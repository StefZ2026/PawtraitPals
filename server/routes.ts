import type { Express, Request, Response } from "express";
import { type Server } from "http";
import { storage } from "./storage";
import type { InsertOrganization } from "@shared/schema";
import { z } from "zod";
import { generateImage, editImage } from "./gemini";
import { isAuthenticated, registerAuthRoutes } from "./auth";
import { stripeService } from "./stripeService";
import { getStripePublishableKey, getStripeClient, STRIPE_PLAN_PRICE_MAP, mapStripeStatusToInternal, getPriceId } from "./stripeClient";
import rateLimit from "express-rate-limit";
import Twilio from "twilio";
import { containsInappropriateLanguage } from "./content-filter";
import { generateShowcaseMockup, generatePawfileMockup } from "./generate-mockups";
import { isValidBreed } from "./breeds";
import { isTrialExpired, isWithinTrialWindow, getFreeTrial, revertToFreeTrial, handleCancellation, canStartFreeTrial, markFreeTrialUsed } from "./subscription";
import { pool } from "./db";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

function sanitizeForPrompt(input: string): string {
  return input
    .replace(/[^\w\s\-'.,:;!?()]/g, '')
    .trim();
}

const aiRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { error: "Too many requests. Please wait a minute before generating more portraits." },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: any) => req.user?.claims?.sub || "anonymous",
  validate: { xForwardedForHeader: false },
});

const apiRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: { error: "Too many requests. Please try again shortly." },
  standardHeaders: true,
  legacyHeaders: false,
});

async function generateUniqueSlug(name: string, excludeOrgId?: number): Promise<string> {
  let baseSlug = name.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  let slug = baseSlug;
  let attempts = 0;
  while (attempts < 10) {
    const existing = await storage.getOrganizationBySlug(slug);
    if (!existing || (excludeOrgId && existing.id === excludeOrgId)) break;
    slug = `${baseSlug}-${Math.random().toString(36).substring(2, 6)}`;
    attempts++;
  }
  return slug;
}

const MAX_ADDITIONAL_SLOTS = 5;
const MAX_EDITS_PER_IMAGE = 4;

async function validateAndCleanStripeData(orgId: number): Promise<{ customerId: string | null; subscriptionId: string | null; subscriptionStatus: string | null; cleaned: boolean }> {
  const org = await storage.getOrganization(orgId);
  if (!org) return { customerId: null, subscriptionId: null, subscriptionStatus: null, cleaned: false };

  const testMode = org.stripeTestMode;
  let cleaned = false;
  let validCustomerId = org.stripeCustomerId || null;
  let validSubscriptionId = org.stripeSubscriptionId || null;
  let currentStatus = org.subscriptionStatus || null;

  if (validCustomerId) {
    try {
      const stripe = getStripeClient(testMode);
      const customer = await stripe.customers.retrieve(validCustomerId);
      if ((customer as any).deleted) {
        console.warn(`[stripe-cleanup] Customer ${validCustomerId} is deleted in Stripe for org ${orgId}, clearing`);
        validCustomerId = null;
        validSubscriptionId = null;
        cleaned = true;
      }
    } catch (err: any) {
      if (err?.type === 'StripeInvalidRequestError' || err?.statusCode === 404 || err?.code === 'resource_missing') {
        console.warn(`[stripe-cleanup] Stale customer ${validCustomerId} for org ${orgId}, clearing`);
        validCustomerId = null;
        validSubscriptionId = null;
        cleaned = true;
      }
    }
  }

  if (validSubscriptionId) {
    try {
      const stripe = getStripeClient(testMode);
      const sub = await stripe.subscriptions.retrieve(validSubscriptionId);
      if (sub.status === 'canceled' || sub.status === 'incomplete_expired') {
        console.warn(`[stripe-cleanup] Subscription ${validSubscriptionId} is ${sub.status} in Stripe for org ${orgId}, clearing`);
        validSubscriptionId = null;
        cleaned = true;
      }
    } catch (err: any) {
      if (err?.type === 'StripeInvalidRequestError' || err?.statusCode === 404 || err?.code === 'resource_missing') {
        console.warn(`[stripe-cleanup] Stale subscription ${validSubscriptionId} for org ${orgId}, clearing`);
        validSubscriptionId = null;
        cleaned = true;
      }
    }
  }

  if (cleaned) {
    const stripeUpdate: any = {
      stripeCustomerId: validCustomerId,
      stripeSubscriptionId: validSubscriptionId,
    };
    if (!validSubscriptionId && currentStatus === 'active') {
      stripeUpdate.subscriptionStatus = 'canceled';
      currentStatus = 'canceled';
    }
    await storage.updateOrganizationStripeInfo(orgId, stripeUpdate);

    const orgUpdates: any = {};
    if (!validSubscriptionId && (org.additionalPetSlots || 0) > 0) {
      orgUpdates.additionalPetSlots = 0;
    }
    if (Object.keys(orgUpdates).length > 0) {
      await storage.updateOrganization(orgId, orgUpdates);
    }
  }

  return { customerId: validCustomerId, subscriptionId: validSubscriptionId, subscriptionStatus: currentStatus, cleaned };
}

function computePetLimitInfo(org: any, plan: any, petCount: number) {
  const basePetLimit = plan?.dogsLimit ?? null;
  const effectivePetLimit = basePetLimit != null ? basePetLimit + (org.additionalPetSlots || 0) : null;
  return {
    petCount,
    petLimit: effectivePetLimit,
    basePetLimit,
    additionalPetSlots: org.additionalPetSlots || 0,
    maxAdditionalSlots: MAX_ADDITIONAL_SLOTS,
    isPaidPlan: plan ? plan.priceMonthly > 0 : false,
  };
}

async function checkDogLimit(orgId: number): Promise<string | null> {
  const org = await storage.getOrganization(orgId);
  if (!org) return "Organization not found.";
  if (org.subscriptionStatus === "canceled") return "Your subscription has been canceled. Please choose a new plan.";
  if (isTrialExpired(org)) return "Your 30-day free trial has expired. Please upgrade to a paid plan to continue.";
  if (!org.planId) return "No plan selected. Please choose a plan before adding pets.";
  const plan = await storage.getSubscriptionPlan(org.planId);
  if (!plan) return "Plan not found. Please contact support.";
  if (!plan.dogsLimit) return null;
  const effectiveLimit = plan.dogsLimit + (org.additionalPetSlots || 0);
  const orgDogs = await storage.getDogsByOrganization(orgId);
  if (orgDogs.length >= effectiveLimit) {
    return `You've reached your pet limit of ${effectiveLimit}. Add extra slots or upgrade your plan.`;
  }
  return null;
}

async function createDogWithPortrait(dogData: any, orgId: number, originalPhotoUrl: string | undefined, generatedPortraitUrl: string | undefined, styleId: number | undefined) {
  const dog = await storage.createDog({
    ...dogData,
    originalPhotoUrl,
    organizationId: orgId,
  });

  if (generatedPortraitUrl && styleId) {
    const existingPortrait = await storage.getPortraitByDogAndStyle(dog.id, styleId);
    if (!existingPortrait) {
      await storage.createPortrait({
        dogId: dog.id,
        styleId,
        generatedImageUrl: generatedPortraitUrl,
        isSelected: true,
      });
      await storage.incrementOrgPortraitsUsed(orgId);
    } else {
      await storage.updatePortrait(existingPortrait.id, { generatedImageUrl: generatedPortraitUrl });
    }
  }

  return dog;
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  registerAuthRoutes(app);

  (async () => {
    try {
      if (ADMIN_EMAIL) {
        const allOrgsStartup = await storage.getAllOrganizations();
        const users = await storage.getAllUsers();
        let adminUserId: string | null = null;
        const adminUser = users.find((u: any) => u.email === ADMIN_EMAIL);
        if (adminUser) adminUserId = adminUser.id;
        if (adminUserId) {
          const adminOrgs = allOrgsStartup.filter(o => o.ownerId === adminUserId);
          for (const adminOrg of adminOrgs) {
            await storage.clearOrganizationOwner(adminOrg.id);
            console.log(`[startup] Removed admin ownership from "${adminOrg.name}" (ID ${adminOrg.id}) — admin should not own any rescue`);
          }
        }
      }

      try {
        const allOrgsForSync = await storage.getAllOrganizations();
        const orgsWithStripe = allOrgsForSync.filter(o => o.stripeSubscriptionId);
        for (const org of orgsWithStripe) {
          try {
            const stripe = getStripeClient(org.stripeTestMode);
            const sub = await stripe.subscriptions.retrieve(org.stripeSubscriptionId!);
            const newStatus = mapStripeStatusToInternal(sub.status, org.subscriptionStatus);
            const priceId = sub.items?.data?.[0]?.price?.id;
            const matchedPlan = priceId ? STRIPE_PLAN_PRICE_MAP[priceId] : undefined;
            const changes: string[] = [];
            const orgUpdates: any = {};

            if (newStatus === 'canceled') {
              const result = await handleCancellation(org.id, org);
              console.log(`[startup] Stripe sync for "${org.name}" (ID ${org.id}): ${result}`);
              continue;
            }

            if (newStatus !== org.subscriptionStatus) {
              await storage.updateOrganizationStripeInfo(org.id, {
                subscriptionStatus: newStatus,
                stripeSubscriptionId: org.stripeSubscriptionId!,
              });
              changes.push(`status: ${org.subscriptionStatus} → ${newStatus}`);
            }

            if (matchedPlan && matchedPlan.id !== org.planId) {
              orgUpdates.planId = matchedPlan.id;
              changes.push(`plan: → ${matchedPlan.name}`);
            }

            if (sub.status === 'active' && (sub as any).current_period_start) {
              const periodStart = new Date((sub as any).current_period_start * 1000);
              if (!org.billingCycleStart || org.billingCycleStart.getTime() !== periodStart.getTime()) {
                orgUpdates.billingCycleStart = periodStart;
                changes.push(`billing cycle updated`);
              }
            }

            if (Object.keys(orgUpdates).length > 0) {
              await storage.updateOrganization(org.id, orgUpdates);
            }

            if (changes.length > 0) {
              console.log(`[startup] Stripe sync for "${org.name}" (ID ${org.id}): ${changes.join(', ')}`);
            }
          } catch (stripeErr: any) {
            if (stripeErr?.type === 'StripeInvalidRequestError' || stripeErr?.statusCode === 404 || stripeErr?.code === 'resource_missing') {
              console.warn(`[startup] Stale Stripe subscription for "${org.name}" (ID ${org.id}), cleaning up`);
              const result = await handleCancellation(org.id, org);
              console.log(`[startup] Stale sub cleanup for "${org.name}": ${result}`);
            } else {
              console.error(`[startup] Stripe sync error for "${org.name}" (ID ${org.id}):`, stripeErr.message);
            }
          }
        }

        if (orgsWithStripe.length > 0) {
          console.log(`[startup] Stripe sync complete: checked ${orgsWithStripe.length} org(s)`);
        }
      } catch (syncErr: any) {
        console.error("[startup] Stripe sync failed:", syncErr.message);
      }

      try {
        const stripe = getStripeClient(true);
        const dbPlans = await storage.getAllSubscriptionPlans();
        let plansSynced = 0;
        for (const plan of dbPlans) {
          if (!plan.stripePriceId) continue;
          try {
            const price = await stripe.prices.retrieve(plan.stripePriceId, { expand: ['product'] });
            const product = price.product as any;
            if (product && !product.deleted) {
              const dbUpdates: Record<string, any> = {};
              if (product.name && product.name !== plan.name) {
                dbUpdates.name = product.name;
              }
              if (product.description !== undefined && product.description !== null && product.description !== plan.description) {
                dbUpdates.description = product.description;
              }
              if (product.id && product.id !== plan.stripeProductId) {
                dbUpdates.stripeProductId = product.id;
              }
              if (Object.keys(dbUpdates).length > 0) {
                await storage.updateSubscriptionPlan(plan.id, dbUpdates);
                plansSynced++;
                console.log(`[startup] Synced plan "${plan.name}" from Stripe: ${JSON.stringify(dbUpdates)}`);
              }
            }
          } catch (prodErr: any) {
            console.warn(`[startup] Could not sync Stripe product for plan "${plan.name}":`, prodErr.message);
          }
        }
        if (plansSynced > 0) {
          console.log(`[startup] Updated ${plansSynced} plan(s) from Stripe product data`);
        }
      } catch (descSyncErr: any) {
        console.warn("[startup] Stripe product sync failed:", descSyncErr.message);
      }

      const seqFixes = await storage.repairSequences();
      if (seqFixes.length > 0) {
        console.log(`[startup] Repaired DB sequences: ${seqFixes.join(', ')}`);
      }

      const creditResults = await storage.recalculateAllOrgCredits();
      if (creditResults.length > 0) {
        console.log(`[startup] Recalculated credits for ${creditResults.length} org(s):`, creditResults);
      }

      const allOrgs = await storage.getAllOrganizations();
      const allPlans = await storage.getAllSubscriptionPlans();
      const freeTrialPlan = await getFreeTrial();
      const issues: string[] = [];
      const fixes: string[] = [];

      for (const org of allOrgs) {
        if (org.subscriptionStatus === 'active' && !org.stripeSubscriptionId) {
          const result = await handleCancellation(org.id, org);
          fixes.push(`FIXED: "${org.name}" (ID ${org.id}) active without subscription → ${result}`);
        }

        if (org.stripeCustomerId && !org.stripeSubscriptionId && org.subscriptionStatus !== 'active') {
          try {
            const stripe = getStripeClient(org.stripeTestMode);
            const customer = await stripe.customers.retrieve(org.stripeCustomerId);
            if ((customer as any).deleted) {
              await storage.updateOrganizationStripeInfo(org.id, { stripeCustomerId: null, stripeSubscriptionId: null });
              fixes.push(`FIXED: "${org.name}" (ID ${org.id}) cleared deleted Stripe customer`);
            }
          } catch (custErr: any) {
            if (custErr?.type === 'StripeInvalidRequestError' || custErr?.statusCode === 404 || custErr?.code === 'resource_missing') {
              await storage.updateOrganizationStripeInfo(org.id, { stripeCustomerId: null, stripeSubscriptionId: null });
              fixes.push(`FIXED: "${org.name}" (ID ${org.id}) cleared stale Stripe customer`);
            }
          }
        }

        if (org.subscriptionStatus === 'canceled' && !org.stripeSubscriptionId && isWithinTrialWindow(org)) {
          const reverted = await revertToFreeTrial(org.id);
          if (reverted) {
            fixes.push(`FIXED: "${org.name}" (ID ${org.id}) canceled without Stripe sub, still in trial → reverted to Free Trial`);
          }
        }

        if (org.subscriptionStatus === 'trial' && !org.trialEndsAt && org.createdAt) {
          const trialEndsAt = new Date(new Date(org.createdAt).getTime() + 30 * 24 * 60 * 60 * 1000);
          await storage.updateOrganization(org.id, { trialEndsAt });
          fixes.push(`FIXED: "${org.name}" (ID ${org.id}) backfilled trialEndsAt`);
        }

        if (!org.hasUsedFreeTrial && (org.subscriptionStatus === 'trial' || org.trialEndsAt)) {
          await markFreeTrialUsed(org.id);
          fixes.push(`FIXED: "${org.name}" (ID ${org.id}) marked hasUsedFreeTrial`);
        }

        const dogCount = (await storage.getDogsByOrganization(org.id)).length;

        if (!org.planId && (dogCount > 0 || org.subscriptionStatus === 'trial')) {
          if (freeTrialPlan) {
            await storage.updateOrganization(org.id, {
              planId: freeTrialPlan.id,
              subscriptionStatus: 'trial',
              billingCycleStart: org.billingCycleStart || org.createdAt || new Date(),
            });
            fixes.push(`FIXED: "${org.name}" (ID ${org.id}) assigned Free Trial plan`);
          } else {
            issues.push(`CRITICAL: "${org.name}" (ID ${org.id}) has no plan and Free Trial not found`);
          }
          continue;
        }

        if (org.planId && dogCount > 0) {
          const plan = allPlans.find(p => p.id === org.planId);
          if (plan?.dogsLimit) {
            const effectiveLimit = plan.dogsLimit + (org.additionalPetSlots || 0);
            if (dogCount > effectiveLimit) {
              issues.push(`WARNING: "${org.name}" (ID ${org.id}) has ${dogCount} pet(s) but limit is ${effectiveLimit} (${plan.name})`);
            }
          }
        }
      }

      if (fixes.length > 0) {
        console.log(`[startup] Auto-fixed ${fixes.length} org(s):\n${fixes.join("\n")}`);
        const recount = await storage.recalculateAllOrgCredits();
        if (recount.length > 0) {
          console.log(`[startup] Re-recalculated credits after fixes:`, recount);
        }
      }
      if (issues.length > 0) {
        console.log(`[startup] Data integrity issues found:\n${issues.join("\n")}`);
      }
    } catch (err) {
      console.error("[startup] Health check failed:", err);
    }
  })();

  app.use("/api/", apiRateLimiter);

  const isAdmin = async (req: any, res: Response, next: any) => {
    if (!req.user?.claims?.email || req.user.claims.email !== ADMIN_EMAIL) {
      return res.status(403).json({ error: "Admin access required" });
    }
    next();
  };

  app.get("/api/my-organization", isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = req.user.claims.sub;
      let org = await storage.getOrganizationByOwner(userId);
      if (!org) {
        return res.status(404).json({ error: "No organization found" });
      }
      const synced = await storage.syncOrgCredits(org.id);
      if (synced) org = synced;
      const orgDogs = await storage.getDogsByOrganization(org.id);
      const plan = org.planId ? await storage.getSubscriptionPlan(org.planId) : null;
      const { stripeCustomerId, stripeSubscriptionId, ...safeOrg } = org as any;
      res.json({
        ...safeOrg,
        hasStripeAccount: !!stripeCustomerId,
        hasActiveSubscription: !!stripeSubscriptionId,
        ...computePetLimitInfo(org, plan, orgDogs.length),
      });
    } catch (error) {
      console.error("Error fetching user organization:", error);
      res.status(500).json({ error: "Failed to fetch organization" });
    }
  });

  // Create organization for current user
  app.post("/api/my-organization", isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = req.user.claims.sub;
      
      // Check if user already has an org
      const existingOrg = await storage.getOrganizationByOwner(userId);
      if (existingOrg) {
        return res.status(400).json({ error: "You already have an organization" });
      }

      const { name, description, websiteUrl, logoUrl } = req.body;
      const slug = await generateUniqueSlug(name);

      const org = await storage.createOrganization({
        name,
        slug,
        description,
        websiteUrl,
        logoUrl: logoUrl || null,
        ownerId: userId,
        subscriptionStatus: "inactive",
        portraitsUsedThisMonth: 0,
      });

      res.status(201).json(org);
    } catch (error) {
      console.error("Error creating organization:", error);
      res.status(500).json({ error: "Failed to create organization" });
    }
  });

  app.patch("/api/my-organization", isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = req.user.claims.sub;
      const org = await storage.getOrganizationByOwner(userId);
      if (!org) {
        return res.status(404).json({ error: "No organization found" });
      }

      const allowedFields = [
        "name", "description", "websiteUrl", "logoUrl",
        "contactName", "contactEmail", "contactPhone",
        "socialFacebook", "socialInstagram", "socialTwitter", "socialNextdoor",
        "billingStreet", "billingCity", "billingState", "billingZip", "billingCountry",
        "locationStreet", "locationCity", "locationState", "locationZip", "locationCountry",
        "speciesHandled", "onboardingCompleted"
      ];
      const updates: Record<string, any> = {};
      for (const field of allowedFields) {
        if (req.body[field] !== undefined) {
          updates[field] = req.body[field];
        }
      }

      if (Object.keys(updates).length === 0) {
        return res.status(400).json({ error: "No valid fields to update" });
      }

      const MAX_LENGTHS: Record<string, number> = {
        name: 200, description: 2000, websiteUrl: 500,
        contactName: 200, contactEmail: 200, contactPhone: 50,
        socialFacebook: 500, socialInstagram: 500, socialTwitter: 500, socialNextdoor: 500,
        billingStreet: 500, billingCity: 200, billingState: 100, billingZip: 20, billingCountry: 100,
        locationStreet: 500, locationCity: 200, locationState: 100, locationZip: 20, locationCountry: 100
      };
      for (const [field, maxLen] of Object.entries(MAX_LENGTHS)) {
        if (updates[field] !== undefined && updates[field] !== null) {
          if (typeof updates[field] !== "string") {
            return res.status(400).json({ error: `${field} must be a string` });
          }
          if (updates[field].length > maxLen) {
            return res.status(400).json({ error: `${field} must be ${maxLen} characters or less` });
          }
        }
      }

      if (updates.name !== undefined && typeof updates.name === "string" && updates.name.trim().length === 0) {
        return res.status(400).json({ error: "Organization name cannot be empty" });
      }

      if (updates.speciesHandled !== undefined) {
        if (!["dogs", "cats", "both"].includes(updates.speciesHandled)) {
          return res.status(400).json({ error: "speciesHandled must be 'dogs', 'cats', or 'both'" });
        }
      }

      if (updates.logoUrl !== undefined && updates.logoUrl !== null) {
        const MAX_LOGO_LENGTH = 500000;
        if (typeof updates.logoUrl !== "string" || updates.logoUrl.length > MAX_LOGO_LENGTH) {
          return res.status(400).json({ error: "Logo data too large or invalid" });
        }
      }

      if (updates.name && updates.name !== org.name) {
        updates.slug = await generateUniqueSlug(updates.name, org.id);
      }

      const updated = await storage.updateOrganization(org.id, updates);
      res.json(updated);
    } catch (error) {
      console.error("Error updating organization:", error);
      res.status(500).json({ error: "Failed to update organization" });
    }
  });

  // Select a plan (for free plans that don't go through Stripe checkout)
  app.post("/api/select-plan", isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = req.user.claims.sub;
      const { planId } = req.body;

      if (!planId) {
        return res.status(400).json({ error: "Plan ID is required" });
      }

      const plan = await storage.getSubscriptionPlan(planId);
      if (!plan) {
        return res.status(400).json({ error: "Invalid plan" });
      }

      const org = await storage.getOrganizationByOwner(userId);
      if (!org) {
        return res.status(400).json({ error: "You need to create an organization first" });
      }

      const isFreeTrialPlan = plan.priceMonthly === 0 && (plan.trialDays ?? 0) > 0;

      if (isFreeTrialPlan && !canStartFreeTrial(org)) {
        return res.status(400).json({ error: "Your organization has already used its free trial. Please choose a paid plan." });
      }

      const trialEndsAt = plan.trialDays ? new Date(Date.now() + plan.trialDays * 24 * 60 * 60 * 1000) : null;

      const isNewPlan = org.planId !== plan.id;
      const orgUpdate: Partial<InsertOrganization> = {
        planId: plan.id,
        subscriptionStatus: isFreeTrialPlan ? "trial" : "active",
      };
      if (isNewPlan) {
        orgUpdate.billingCycleStart = org.billingCycleStart || org.createdAt || new Date();
      }
      if (trialEndsAt) {
        orgUpdate.trialEndsAt = trialEndsAt;
      }
      await storage.updateOrganization(org.id, orgUpdate);

      if (isFreeTrialPlan) {
        await markFreeTrialUsed(org.id);
      }

      await storage.syncOrgCredits(org.id);

      const updated = await storage.getOrganization(org.id);
      res.json(updated);
    } catch (error) {
      console.error("Error selecting plan:", error);
      res.status(500).json({ error: "Failed to select plan" });
    }
  });

  function toPublicOrg(org: any) {
    return {
      id: org.id,
      name: org.name,
      slug: org.slug,
      description: org.description,
      websiteUrl: org.websiteUrl,
      logoUrl: org.logoUrl,
      isActive: org.isActive,
      createdAt: org.createdAt,
    };
  }

  app.get("/api/organizations", async (req: Request, res: Response) => {
    try {
      const orgs = await storage.getAllOrganizations();
      res.json(orgs.map(toPublicOrg));
    } catch (error) {
      console.error("Error fetching organizations:", error);
      res.status(500).json({ error: "Failed to fetch organizations" });
    }
  });

  app.get("/api/organizations/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id as string);
      const org = await storage.getOrganization(id);
      if (!org) {
        return res.status(404).json({ error: "Organization not found" });
      }
      res.json(toPublicOrg(org));
    } catch (error) {
      console.error("Error fetching organization:", error);
      res.status(500).json({ error: "Failed to fetch organization" });
    }
  });

  app.get("/api/rescue/:slug", async (req: Request, res: Response) => {
    try {
      const { slug } = req.params;
      const org = await storage.getOrganizationBySlug(slug as string);
      if (!org || !org.isActive) {
        return res.status(404).json({ error: "Rescue not found" });
      }

      const orgDogs = await storage.getDogsByOrganization(org.id);
      const dogsWithPortraits = await Promise.all(
        orgDogs.filter(d => d.isAvailable).map(async (dog) => {
          const portrait = await storage.getSelectedPortraitByDog(dog.id);
          return { ...dog, portrait: portrait || undefined };
        })
      );

      res.json({
        id: org.id,
        name: org.name,
        slug: org.slug,
        description: org.description,
        websiteUrl: org.websiteUrl,
        logoUrl: org.logoUrl,
        contactEmail: org.contactEmail,
        contactPhone: org.contactPhone,
        socialFacebook: org.socialFacebook,
        socialInstagram: org.socialInstagram,
        socialTwitter: org.socialTwitter,
        socialNextdoor: org.socialNextdoor,
        dogs: dogsWithPortraits,
      });
    } catch (error) {
      console.error("Error fetching rescue showcase:", error);
      res.status(500).json({ error: "Failed to fetch rescue" });
    }
  });

  // Subscription plans
  app.get("/api/plans", async (req: Request, res: Response) => {
    try {
      const plans = await storage.getAllSubscriptionPlans();
      res.json(plans);
    } catch (error) {
      console.error("Error fetching plans:", error);
      res.status(500).json({ error: "Failed to fetch plans" });
    }
  });

  app.get("/api/portrait-styles", async (req: Request, res: Response) => {
    try {
      const styles = await storage.getAllPortraitStyles();
      res.json(styles);
    } catch (error) {
      console.error("Error fetching portrait styles:", error);
      res.status(500).json({ error: "Failed to fetch portrait styles" });
    }
  });

  // Stripe billing routes
  app.get("/api/stripe/publishable-key", async (req: Request, res: Response) => {
    try {
      const testMode = req.query.testMode === 'true';
      const key = getStripePublishableKey(testMode);
      res.json({ publishableKey: key, testMode });
    } catch (error) {
      console.error("Error fetching Stripe key:", error);
      res.status(500).json({ error: "Failed to get payment configuration" });
    }
  });

  // Create checkout session for subscription
  app.post("/api/stripe/checkout", isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = req.user.claims.sub;
      const { planId, orgId, testMode: reqTestMode } = req.body;
      const testMode = reqTestMode === true;

      if (!planId) {
        return res.status(400).json({ error: "Plan ID is required" });
      }

      const plan = await storage.getSubscriptionPlan(planId);
      if (!plan || !plan.stripePriceId) {
        return res.status(400).json({ error: "Invalid plan selected" });
      }

      const callerEmail = req.user.claims.email;
      const callerIsAdmin = callerEmail && callerEmail === ADMIN_EMAIL;

      if (!orgId) {
        return res.status(400).json({ error: "Organization ID is required. Please try again from your dashboard." });
      }

      const org = await storage.getOrganization(orgId);
      if (!org) {
        return res.status(400).json({ error: "Organization not found" });
      }

      if (!callerIsAdmin && org.ownerId !== userId) {
        return res.status(403).json({ error: "You don't have access to this organization" });
      }

      // If org already has Stripe data from a different mode, clean it first
      // org.stripeTestMode is not in Drizzle schema — treat undefined as test mode
      const orgCurrentMode = (org as any).stripeTestMode ?? true;
      if (org.stripeCustomerId && orgCurrentMode !== testMode) {
        await storage.updateOrganizationStripeInfo(org.id, {
          stripeCustomerId: null,
          stripeSubscriptionId: null,
          stripeTestMode: testMode,
        });
      } else if (!org.stripeCustomerId) {
        await storage.updateOrganizationStripeInfo(org.id, { stripeTestMode: testMode });
      }

      const stripeState = await validateAndCleanStripeData(org.id);
      let customerId = stripeState.customerId;
      if (!customerId) {
        if (!org.contactEmail) {
          return res.status(400).json({ error: "This organization has no contact email on file. Please add a contact email in your organization settings before setting up billing." });
        }
        const customer = await stripeService.createCustomer(org.contactEmail, org.id, org.name, testMode);
        await storage.updateOrganizationStripeInfo(org.id, { stripeCustomerId: customer.id, stripeTestMode: testMode });
        customerId = customer.id;
      }

      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const session = await stripeService.createCheckoutSession(
        customerId,
        plan.stripePriceId,
        `${baseUrl}/dashboard?subscription=success&plan=${planId}&session_id={CHECKOUT_SESSION_ID}&orgId=${org.id}&testMode=${testMode}`,
        `${baseUrl}/dashboard`,
        testMode,
        undefined,
        { orgId: String(org.id), planId: String(planId) }
      );

      res.json({ url: session.url });
    } catch (error: any) {
      console.error("Error creating checkout session:", error?.message || error);
      res.status(500).json({ error: error?.message || "Failed to create checkout session" });
    }
  });

  app.post("/api/stripe/confirm-checkout", isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = req.user.claims.sub;
      const { sessionId, planId, orgId: bodyOrgId, testMode: reqTestMode } = req.body;

      if (!sessionId || !planId) {
        return res.status(400).json({ error: "Session ID and Plan ID are required" });
      }

      const plan = await storage.getSubscriptionPlan(parseInt(planId));
      if (!plan) {
        return res.status(400).json({ error: "Invalid plan" });
      }

      // Determine testMode from request or from the org
      const metadataOrgIdRaw = bodyOrgId ? parseInt(bodyOrgId) : null;
      const preOrg = metadataOrgIdRaw ? await storage.getOrganization(metadataOrgIdRaw) : null;
      const testMode = reqTestMode === true || reqTestMode === 'true' || ((preOrg as any)?.stripeTestMode ?? true);

      const session = await stripeService.retrieveCheckoutSession(sessionId, testMode);
      if (!session || (session.payment_status !== "paid" && session.status !== "complete")) {
        return res.status(400).json({ error: "Checkout session is not complete" });
      }

      const metadataOrgId = session.metadata?.orgId ? parseInt(session.metadata.orgId) : null;
      const targetOrgId = metadataOrgId || (bodyOrgId ? parseInt(bodyOrgId) : null);
      if (!targetOrgId) {
        return res.status(400).json({ error: "Organization not found. Could not determine which organization this checkout belongs to." });
      }
      const org = await storage.getOrganization(targetOrgId);
      if (!org) {
        return res.status(400).json({ error: "Organization not found. Could not determine which organization this checkout belongs to." });
      }

      const sessionCustomerId = typeof session.customer === 'string' ? session.customer : (session.customer as any)?.id;

      if (org.stripeCustomerId && sessionCustomerId !== org.stripeCustomerId) {
        return res.status(403).json({ error: "Session does not match your account" });
      }

      const subscriptionId = typeof session.subscription === 'string' ? session.subscription : (session.subscription as any)?.id;
      let subscription: any = null;
      if (typeof session.subscription === 'object' && session.subscription) {
        subscription = session.subscription;
      } else if (subscriptionId) {
        subscription = await stripeService.retrieveSubscription(subscriptionId, testMode);
      }

      if (subscription && plan.stripePriceId) {
        const subItems = subscription.items?.data || [];
        const effectivePriceId = getPriceId(plan.stripePriceId, testMode);
        const matchesPlan = subItems.some((item: any) => {
          const priceId = typeof item.price === 'string' ? item.price : item.price?.id;
          return priceId === plan.stripePriceId || priceId === effectivePriceId;
        });
        if (!matchesPlan) {
          return res.status(400).json({ error: "Subscription does not match the selected plan" });
        }
      }

      let billingCycleStart = new Date();
      if (subscription?.current_period_start) {
        billingCycleStart = new Date(subscription.current_period_start * 1000);
      }

      await storage.updateOrganization(org.id, {
        planId: plan.id,
        subscriptionStatus: "active",
        additionalPetSlots: 0,
        billingCycleStart,
      });
      await storage.syncOrgCredits(org.id);

      const stripeInfo: any = { subscriptionStatus: "active", stripeTestMode: testMode };
      if (sessionCustomerId && !org.stripeCustomerId) {
        stripeInfo.stripeCustomerId = sessionCustomerId;
      }
      if (subscriptionId) {
        stripeInfo.stripeSubscriptionId = subscriptionId;
      }
      await storage.updateOrganizationStripeInfo(org.id, stripeInfo);

      const updated = await storage.getOrganization(org.id);
      res.json(updated);
    } catch (error: any) {
      console.error("Error confirming checkout:", error);
      res.status(500).json({ error: "Failed to confirm subscription" });
    }
  });

  app.post("/api/stripe/portal", isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = req.user.claims.sub;
      const callerEmail = req.user.claims.email;
      const callerIsAdmin = callerEmail && callerEmail === ADMIN_EMAIL;
      const { orgId: bodyOrgId } = req.body || {};

      let org;
      if (bodyOrgId) {
        if (!callerIsAdmin) {
          const ownerOrg = await storage.getOrganizationByOwner(userId);
          if (!ownerOrg || ownerOrg.id !== parseInt(bodyOrgId)) {
            return res.status(403).json({ error: "Access denied" });
          }
        }
        org = await storage.getOrganization(parseInt(bodyOrgId));
      } else if (callerIsAdmin) {
        return res.status(400).json({ error: "Admin must specify orgId" });
      } else {
        org = await storage.getOrganizationByOwner(userId);
      }

      if (!org) {
        return res.status(400).json({ error: "No billing account found" });
      }

      const stripeState = await validateAndCleanStripeData(org.id);
      if (!stripeState.customerId) {
        return res.status(400).json({ error: "No billing account found. If you previously had a subscription, it may have been canceled. Please choose a new plan." });
      }

      const refreshedOrg = await storage.getOrganization(org.id);
      const testMode = (refreshedOrg as any)?.stripeTestMode ?? true;
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const session = await stripeService.createCustomerPortalSession(
        stripeState.customerId,
        `${baseUrl}/dashboard`,
        testMode
      );

      res.json({ url: session.url });
    } catch (error) {
      console.error("Error creating portal session:", error);
      res.status(500).json({ error: "Failed to access billing portal" });
    }
  });

  app.get("/api/subscription-info", isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = req.user.claims.sub;
      const callerEmail = req.user.claims.email;
      const callerIsAdmin = callerEmail && callerEmail === ADMIN_EMAIL;
      const reqOrgId = req.query.orgId ? parseInt(req.query.orgId as string) : null;

      let org;
      if (reqOrgId) {
        org = await storage.getOrganization(reqOrgId);
        if (org && !callerIsAdmin && org.ownerId !== userId) {
          return res.status(403).json({ error: "Access denied" });
        }
      } else if (callerIsAdmin) {
        return res.status(400).json({ error: "Admin must specify orgId" });
      } else {
        org = await storage.getOrganizationByOwner(userId);
      }

      if (!org) {
        return res.status(400).json({ error: "Organization not found" });
      }

      let renewalDate: string | null = null;
      let pendingPlanName: string | null = null;

      if (org.stripeSubscriptionId) {
        try {
          const periodEnd = await stripeService.getSubscriptionPeriodEnd(org.stripeSubscriptionId, org.stripeTestMode);
          if (periodEnd) {
            renewalDate = periodEnd.toISOString();
          }
        } catch (e) {
          console.error("[subscription-info] Error fetching Stripe info:", e);
        }
      }

      if (org.pendingPlanId) {
        const pendingPlan = await storage.getSubscriptionPlan(org.pendingPlanId);
        pendingPlanName = pendingPlan?.name || null;
      }

      res.json({
        currentPlanId: org.planId,
        pendingPlanId: org.pendingPlanId,
        pendingPlanName,
        renewalDate,
        subscriptionStatus: org.subscriptionStatus,
        hasStripeSubscription: !!org.stripeSubscriptionId,
      });
    } catch (error) {
      console.error("Error getting subscription info:", error);
      res.status(500).json({ error: "Failed to get subscription info" });
    }
  });

  app.post("/api/stripe/change-plan", isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = req.user.claims.sub;
      const { planId, orgId } = req.body;

      if (!planId || !orgId) {
        return res.status(400).json({ error: "Plan ID and Organization ID are required" });
      }

      const plan = await storage.getSubscriptionPlan(planId);
      if (!plan || !plan.stripePriceId) {
        return res.status(400).json({ error: "Invalid plan selected" });
      }

      const org = await storage.getOrganization(orgId);
      if (!org) {
        return res.status(400).json({ error: "Organization not found" });
      }

      const callerEmail = req.user.claims.email;
      const callerIsAdmin = callerEmail && callerEmail === ADMIN_EMAIL;
      if (!callerIsAdmin && org.ownerId !== userId) {
        return res.status(403).json({ error: "Access denied" });
      }

      if (!org.stripeSubscriptionId) {
        return res.status(400).json({ error: "No active subscription found. Please subscribe first." });
      }

      const currentPlan = org.planId ? await storage.getSubscriptionPlan(org.planId) : null;
      if (!currentPlan) {
        return res.status(400).json({ error: "Current plan not found" });
      }

      if (plan.id === currentPlan.id) {
        return res.status(400).json({ error: "You are already on this plan" });
      }

      const isUpgrade = plan.priceMonthly > currentPlan.priceMonthly;

      if (isUpgrade) {
        return res.json({ action: 'upgrade', planId: plan.id });
      }

      const result = await stripeService.scheduleDowngrade(org.stripeSubscriptionId, plan.stripePriceId, org.stripeTestMode);

      await storage.updateOrganization(org.id, {
        pendingPlanId: plan.id,
      });

      res.json({
        action: 'scheduled',
        renewalDate: result.currentPeriodEnd.toISOString(),
        newPlanName: plan.name,
      });
    } catch (error: any) {
      console.error("Error changing plan:", error?.message || error);
      res.status(500).json({ error: error?.message || "Failed to change plan" });
    }
  });

  app.post("/api/stripe/cancel-plan-change", isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = req.user.claims.sub;
      const { orgId } = req.body;

      if (!orgId) {
        return res.status(400).json({ error: "Organization ID is required" });
      }

      const org = await storage.getOrganization(orgId);
      if (!org) {
        return res.status(400).json({ error: "Organization not found" });
      }

      const callerEmail = req.user.claims.email;
      const callerIsAdmin = callerEmail && callerEmail === ADMIN_EMAIL;
      if (!callerIsAdmin && org.ownerId !== userId) {
        return res.status(403).json({ error: "Access denied" });
      }

      if (!org.pendingPlanId) {
        return res.status(400).json({ error: "No pending plan change to cancel" });
      }

      if (org.stripeSubscriptionId) {
        const currentPlan = org.planId ? await storage.getSubscriptionPlan(org.planId) : null;
        if (currentPlan?.stripePriceId) {
          await stripeService.scheduleDowngrade(org.stripeSubscriptionId, currentPlan.stripePriceId, org.stripeTestMode);
        }
      }

      await storage.updateOrganization(org.id, {
        pendingPlanId: null,
      });

      res.json({ success: true });
    } catch (error: any) {
      console.error("Error canceling plan change:", error?.message || error);
      res.status(500).json({ error: error?.message || "Failed to cancel plan change" });
    }
  });

  app.get("/api/addon-slots", isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = req.user.claims.sub;
      const callerEmail = req.user.claims.email;
      const callerIsAdmin = callerEmail && callerEmail === ADMIN_EMAIL;
      const reqOrgId = req.query.orgId ? parseInt(req.query.orgId as string) : null;

      let org;
      if (reqOrgId) {
        org = await storage.getOrganization(reqOrgId);
        if (org && !callerIsAdmin && org.ownerId !== userId) {
          return res.status(403).json({ error: "Access denied" });
        }
      } else if (callerIsAdmin) {
        return res.status(400).json({ error: "Admin must specify orgId" });
      } else {
        org = await storage.getOrganizationByOwner(userId);
      }
      if (!org) {
        return res.status(404).json({ error: "No organization found" });
      }
      const plan = org.planId ? await storage.getSubscriptionPlan(org.planId) : null;
      res.json({
        currentSlots: org.additionalPetSlots || 0,
        maxSlots: MAX_ADDITIONAL_SLOTS,
        pricePerSlotCents: 300,
        available: (plan ? plan.priceMonthly > 0 : false) && !!org.stripeSubscriptionId,
        basePetLimit: plan?.dogsLimit ?? null,
      });
    } catch (error) {
      console.error("Error fetching addon slots info:", error);
      res.status(500).json({ error: "Failed to fetch add-on information" });
    }
  });

  app.post("/api/addon-slots", isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = req.user.claims.sub;
      const callerEmail = req.user.claims.email;
      const callerIsAdmin = callerEmail && callerEmail === ADMIN_EMAIL;
      const { quantity, orgId: bodyOrgId } = req.body;

      if (typeof quantity !== "number" || quantity < 0 || quantity > 5 || !Number.isInteger(quantity)) {
        return res.status(400).json({ error: "Quantity must be an integer between 0 and 5" });
      }

      let org;
      if (bodyOrgId) {
        org = await storage.getOrganization(parseInt(bodyOrgId));
        if (org && !callerIsAdmin && org.ownerId !== userId) {
          return res.status(403).json({ error: "Access denied" });
        }
      } else if (callerIsAdmin) {
        return res.status(400).json({ error: "Admin must specify orgId" });
      } else {
        org = await storage.getOrganizationByOwner(userId);
      }
      if (!org) {
        return res.status(404).json({ error: "No organization found" });
      }

      const plan = org.planId ? await storage.getSubscriptionPlan(org.planId) : null;
      if (!plan || plan.priceMonthly === 0) {
        return res.status(403).json({ error: "Add-on pet slots are only available on paid plans. Please upgrade first." });
      }

      const stripeState = await validateAndCleanStripeData(org.id);
      if (!stripeState.subscriptionId) {
        return res.status(400).json({ error: "No active subscription found. Please set up billing first." });
      }

      if (quantity < (org.additionalPetSlots || 0)) {
        const effectiveNewLimit = (plan.dogsLimit || 0) + quantity;
        const orgDogs = await storage.getDogsByOrganization(org.id);
        if (orgDogs.length > effectiveNewLimit) {
          return res.status(400).json({
            error: `Cannot reduce to ${quantity} add-on slots. You have ${orgDogs.length} pets but would only have ${effectiveNewLimit} slots. Remove some pets first.`,
          });
        }
      }

      await stripeService.updateAddonSlots(stripeState.subscriptionId, quantity, org.stripeTestMode);
      await storage.updateOrganization(org.id, { additionalPetSlots: quantity });

      const updated = await storage.getOrganization(org.id);
      const slotWord = quantity > 1 ? "slots" : "slot";
      res.json({
        success: true,
        additionalPetSlots: updated?.additionalPetSlots || 0,
        message: quantity > 0
          ? `You now have ${quantity} extra pet ${slotWord}. Your card will be charged $${(quantity * 3).toFixed(2)}/month.`
          : "Add-on pet slots removed.",
      });
    } catch (error: any) {
      console.error("Error updating addon slots:", error);
      res.status(500).json({ error: "Failed to update add-on slots. Please try again." });
    }
  });

  // Dogs - Public gallery (all dogs)
  app.get("/api/dogs", async (req: Request, res: Response) => {
    try {
      const allDogs = await storage.getAllDogs();
      
      const activeOrgs = await storage.getAllOrganizations();
      const activeOrgIds = new Set(activeOrgs.filter(o => o.isActive).map(o => o.id));
      
      const dogsWithPortraits = await Promise.all(
        allDogs
          .filter(dog => dog.organizationId && activeOrgIds.has(dog.organizationId))
          .map(async (dog) => {
            const portrait = await storage.getSelectedPortraitByDog(dog.id);
            if (portrait) {
              const style = await storage.getPortraitStyle(portrait.styleId);
              return {
                ...dog,
                portrait: { ...portrait, style },
              };
            }
            return dog;
          })
      );
      
      const isRealImage = (url: string | null | undefined) => {
        if (!url) return false;
        if (url.includes('placehold.co') || url.includes('placeholder') || url.includes('via.placeholder')) return false;
        return true;
      };
      
      const visibleDogs = dogsWithPortraits.filter((dog: any) => 
        dog.isAvailable && (isRealImage(dog.portrait?.generatedImageUrl) || isRealImage(dog.originalPhotoUrl))
      );
      
      res.json(visibleDogs);
    } catch (error) {
      console.error("Error fetching dogs:", error);
      res.status(500).json({ error: "Failed to fetch dogs" });
    }
  });

  // Get dogs for current user's organization
  app.get("/api/my-dogs", isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = req.user.claims.sub;
      const org = await storage.getOrganizationByOwner(userId);
      
      if (!org) {
        return res.json([]);
      }

      const orgDogs = await storage.getDogsByOrganization(org.id);
      
      // Get portraits and styles for each dog
      const dogsWithPortraits = await Promise.all(
        orgDogs.map(async (dog) => {
          const portrait = await storage.getSelectedPortraitByDog(dog.id);
          if (portrait) {
            const style = await storage.getPortraitStyle(portrait.styleId);
            return {
              ...dog,
              portrait: { ...portrait, style },
            };
          }
          return dog;
        })
      );
      
      res.json(dogsWithPortraits);
    } catch (error) {
      console.error("Error fetching user dogs:", error);
      res.status(500).json({ error: "Failed to fetch dogs" });
    }
  });

  app.get("/api/dogs/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id as string);
      const dog = await storage.getDog(id);
      if (!dog) {
        return res.status(404).json({ error: "Pet not found" });
      }
      
      const org = dog.organizationId ? await storage.getOrganization(dog.organizationId) : null;
      const allPortraits = await storage.getPortraitsByDog(dog.id);

      const portraitsWithStyles = await Promise.all(
        allPortraits.map(async (p) => {
          const style = await storage.getPortraitStyle(p.styleId);
          return { ...p, style: style || null };
        })
      );

      const portrait = portraitsWithStyles.find(p => p.isSelected) || (portraitsWithStyles.length > 0 ? portraitsWithStyles[0] : undefined);
      
      res.json({
        ...dog,
        organizationName: org?.name || null,
        organizationLogoUrl: org?.logoUrl || null,
        portrait: portrait || undefined,
        portraits: portraitsWithStyles,
      });
    } catch (error) {
      console.error("Error fetching dog:", error);
      res.status(500).json({ error: "Failed to fetch pet" });
    }
  });

  app.post("/api/dogs", isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = req.user.claims.sub;
      const userEmail = req.user.claims.email;
      const userIsAdmin = userEmail === ADMIN_EMAIL;

      let orgId: number;

      let org;
      if (userIsAdmin && req.body.organizationId) {
        orgId = req.body.organizationId;
        org = await storage.getOrganization(orgId);
        if (!org) {
          return res.status(400).json({ error: "Organization not found" });
        }
      } else {
        org = await storage.getOrganizationByOwner(userId);
        if (!org) {
          return res.status(400).json({ error: "You need to create an organization first" });
        }
        orgId = org.id;
      }

      if (!org.planId || org.subscriptionStatus === "inactive") {
        return res.status(403).json({ error: "Please select a plan before adding pets" });
      }

      const limitError = await checkDogLimit(orgId);
      if (limitError) {
        return res.status(403).json({ error: limitError });
      }

      const { originalPhotoUrl, generatedPortraitUrl, styleId, organizationId: _orgId, ...dogData } = req.body;

      if (dogData.species && !["dog", "cat"].includes(dogData.species)) {
        return res.status(400).json({ error: "species must be 'dog' or 'cat'" });
      }

      if (dogData.name && containsInappropriateLanguage(dogData.name)) {
        return res.status(400).json({ error: "Please choose a family-friendly name" });
      }

      if (!dogData.breed || !dogData.breed.trim()) {
        return res.status(400).json({ error: "Breed is required" });
      }

      if (!isValidBreed(dogData.breed, dogData.species)) {
        return res.status(400).json({ error: "Please select a valid breed from the list" });
      }

      const dog = await createDogWithPortrait(dogData, orgId, originalPhotoUrl, generatedPortraitUrl, styleId);
      res.status(201).json(dog);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      const errMsg = error instanceof Error ? error.message : String(error);
      console.error("Error creating pet:", errMsg, error);
      res.status(500).json({ error: `Failed to save pet: ${errMsg}` });
    }
  });

  app.patch("/api/dogs/:id", isAuthenticated, async (req: any, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      const userEmail = req.user.claims.email;
      const userIsAdmin = userEmail === ADMIN_EMAIL;

      const dog = await storage.getDog(id);
      if (!dog) {
        return res.status(404).json({ error: "Pet not found" });
      }

      if (!userIsAdmin) {
        const org = await storage.getOrganizationByOwner(userId);
        if (!org || dog.organizationId !== org.id) {
          return res.status(403).json({ error: "Not authorized to edit this dog" });
        }
      }

      const { selectedPortraitId, ...dogData } = req.body;

      if (dogData.name && containsInappropriateLanguage(dogData.name)) {
        return res.status(400).json({ error: "Please choose a family-friendly name" });
      }

      if (dogData.breed !== undefined && !isValidBreed(dogData.breed, dogData.species || dog.species)) {
        return res.status(400).json({ error: "Please select a valid breed from the list" });
      }

      if (selectedPortraitId) {
        const portrait = await storage.getPortrait(selectedPortraitId);
        if (!portrait || portrait.dogId !== id) {
          return res.status(400).json({ error: "Invalid portrait selection" });
        }
      }

      const updatedDog = await storage.updateDog(id, dogData);

      if (selectedPortraitId) {
        await storage.selectPortraitForGallery(id, selectedPortraitId);
      }

      res.json(updatedDog);
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : String(error);
      console.error("Error updating pet:", errMsg, error);
      res.status(500).json({ error: `Failed to update pet: ${errMsg}` });
    }
  });

  app.delete("/api/dogs/:id", isAuthenticated, async (req: any, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      const userEmail = req.user.claims.email;
      const userIsAdmin = userEmail === ADMIN_EMAIL;

      const dog = await storage.getDog(id);
      if (!dog) {
        return res.status(404).json({ error: "Pet not found" });
      }

      if (!userIsAdmin) {
        const org = await storage.getOrganizationByOwner(userId);
        if (!org || dog.organizationId !== org.id) {
          return res.status(403).json({ error: "Not authorized to delete this dog" });
        }
      }

      await storage.deleteDog(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting dog:", error);
      res.status(500).json({ error: "Failed to delete pet" });
    }
  });

  // Portrait Styles
  app.get("/api/styles", async (req: Request, res: Response) => {
    try {
      const styles = await storage.getAllPortraitStyles();
      res.json(styles);
    } catch (error) {
      console.error("Error fetching styles:", error);
      res.status(500).json({ error: "Failed to fetch styles" });
    }
  });

  app.get("/api/dogs/:id/photo", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id as string);
      const dog = await storage.getDog(id);
      if (!dog || !dog.originalPhotoUrl) {
        return res.status(404).send("Photo not found");
      }

      const dataUri = dog.originalPhotoUrl;
      if (!dataUri.startsWith('data:')) {
        return res.redirect(dataUri);
      }

      const matches = dataUri.match(/^data:([^;]+);base64,(.+)$/);
      if (!matches) {
        return res.status(400).send("Invalid image data");
      }

      const contentType = matches[1];
      const imageBuffer = Buffer.from(matches[2], 'base64');

      res.set({
        'Content-Type': contentType,
        'Content-Length': imageBuffer.length.toString(),
        'Cache-Control': 'public, max-age=86400',
      });
      res.send(imageBuffer);
    } catch (error) {
      console.error("Error serving pet photo:", error);
      res.status(500).send("Error loading photo");
    }
  });

  app.get("/api/portraits/:id/image", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id as string);
      const portrait = await storage.getPortrait(id);
      if (!portrait || !portrait.generatedImageUrl) {
        return res.status(404).send("Image not found");
      }

      const dataUri = portrait.generatedImageUrl;
      if (!dataUri.startsWith('data:')) {
        return res.redirect(dataUri);
      }

      const matches = dataUri.match(/^data:([^;]+);base64,(.+)$/);
      if (!matches) {
        return res.status(400).send("Invalid image data");
      }

      const contentType = matches[1];
      const imageBuffer = Buffer.from(matches[2], 'base64');

      res.set({
        'Content-Type': contentType,
        'Content-Length': imageBuffer.length.toString(),
        'Cache-Control': 'public, max-age=86400',
      });
      res.send(imageBuffer);
    } catch (error) {
      console.error("Error serving portrait image:", error);
      res.status(500).send("Error loading image");
    }
  });

  app.get("/api/rescue/:slug/og-image", async (req: Request, res: Response) => {
    try {
      const slug = req.params.slug as string;
      const org = await storage.getOrganizationBySlug(slug);
      if (!org) { res.status(404).send("Organization not found"); return; }
      const imageBuffer = await generateShowcaseMockup(org.id);
      res.set({
        'Content-Type': 'image/png',
        'Content-Length': imageBuffer.length.toString(),
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      });
      res.send(imageBuffer);
    } catch (error) {
      console.error("Error generating rescue OG image:", error);
      res.status(500).send("Error generating preview");
    }
  });

  app.get("/api/pawfile/:id/og-image", async (req: Request, res: Response) => {
    try {
      const dogId = parseInt(req.params.id as string);
      if (isNaN(dogId)) { res.status(400).send("Invalid ID"); return; }
      const imageBuffer = await generatePawfileMockup(dogId);
      res.set({
        'Content-Type': 'image/png',
        'Content-Length': imageBuffer.length.toString(),
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      });
      res.send(imageBuffer);
    } catch (error) {
      console.error("Error generating pawfile OG image:", error);
      res.status(500).send("Error generating preview");
    }
  });

  // Portraits
  app.get("/api/dogs/:dogId/portraits", async (req: Request, res: Response) => {
    try {
      const dogId = parseInt(req.params.dogId as string);
      const dogPortraits = await storage.getPortraitsByDog(dogId);
      res.json(dogPortraits);
    } catch (error) {
      console.error("Error fetching portraits:", error);
      res.status(500).json({ error: "Failed to fetch portraits" });
    }
  });

  async function resolveOrgForUser(userId: string, userEmail: string, dogId?: number): Promise<{ org: any; error?: string; status?: number }> {
    const userIsAdmin = userEmail === ADMIN_EMAIL;

    if (dogId) {
      const dog = await storage.getDog(dogId);
      if (!dog || !dog.organizationId) {
        return { org: null, error: "Pet not found", status: 404 };
      }
      const org = await storage.getOrganization(dog.organizationId);
      if (!org) {
        return { org: null, error: "Organization not found", status: 404 };
      }
      if (userIsAdmin || org.ownerId === userId) {
        return { org };
      }
      return { org: null, error: "Not authorized to access this dog", status: 403 };
    }

    const org = await storage.getOrganizationByOwner(userId);
    if (org) {
      return { org };
    }

    if (userIsAdmin) {
      return { org: null, error: "Admin must specify an organization. Use the dashboard to manage a specific rescue.", status: 400 };
    }

    return { org: null, error: "You need to create an organization first", status: 400 };
  }

  app.post("/api/generate-portrait", isAuthenticated, aiRateLimiter, async (req: any, res: Response) => {
    try {
      const userId = req.user.claims.sub;
      const userEmail = req.user.claims.email || "";
      const { prompt, dogName, originalImage, dogId, styleId, organizationId } = req.body;

      if (!prompt || typeof prompt !== "string") return res.status(400).json({ error: "Prompt is required" });
      if (prompt.length > 2000) {
        return res.status(400).json({ error: "Invalid prompt. Maximum 2000 characters." });
      }
      if (dogName && (typeof dogName !== "string" || dogName.length > 100)) {
        return res.status(400).json({ error: "Invalid dog name." });
      }
      if (originalImage && typeof originalImage === "string" && !originalImage.startsWith("data:image/")) {
        return res.status(400).json({ error: "Invalid image format." });
      }

      const sanitizedPrompt = sanitizeForPrompt(prompt);
      if (!sanitizedPrompt) return res.status(400).json({ error: "Prompt contains invalid characters." });

      let org;
      const userIsAdmin = userEmail === ADMIN_EMAIL;
      if (userIsAdmin && organizationId && !dogId) {
        const targetOrg = await storage.getOrganization(parseInt(organizationId));
        if (!targetOrg) return res.status(404).json({ error: "Organization not found" });
        org = targetOrg;
      } else {
        const resolved = await resolveOrgForUser(userId, userEmail, dogId ? parseInt(dogId) : undefined);
        if (resolved.error) return res.status(resolved.status || 400).json({ error: resolved.error });
        org = resolved.org;
      }

      if (org.subscriptionStatus === "canceled") {
        return res.status(403).json({ error: "Your subscription has been canceled. Please choose a new plan to generate portraits." });
      }

      if (isTrialExpired(org)) {
        return res.status(403).json({ error: "Your 30-day free trial has expired. Please upgrade to a paid plan to continue." });
      }

      if (!org.planId) {
        return res.status(403).json({ error: "No plan selected. Please choose a plan before generating portraits." });
      }

      if (!dogId) {
        const limitError = await checkDogLimit(org.id);
        if (limitError) {
          return res.status(403).json({ error: limitError });
        }
      }

      const MAX_STYLES_PER_PET = 5;

      let existingPortrait = null;
      let isNewPortrait = false;

      if (dogId && styleId) {
        const parsedDogId = parseInt(dogId);
        const parsedStyleId = parseInt(styleId);
        existingPortrait = await storage.getPortraitByDogAndStyle(parsedDogId, parsedStyleId);

        if (existingPortrait) {
          if (existingPortrait.editCount >= MAX_EDITS_PER_IMAGE) {
            return res.status(403).json({
              error: `You've used all ${MAX_EDITS_PER_IMAGE} edits for this style. Try a different style!`,
              editCount: existingPortrait.editCount,
              maxEdits: MAX_EDITS_PER_IMAGE,
            });
          }
        } else {
          isNewPortrait = true;
          const existingPortraits = await storage.getPortraitsByDog(parsedDogId);
          const uniqueStyles = new Set(existingPortraits.map(p => p.styleId));
          if (uniqueStyles.size >= MAX_STYLES_PER_PET) {
            return res.status(403).json({
              error: `This pet already has ${MAX_STYLES_PER_PET} styles. Edit an existing style or remove one first.`,
              stylesUsed: uniqueStyles.size,
              maxStyles: MAX_STYLES_PER_PET,
            });
          }

          const plan = org.planId ? await storage.getSubscriptionPlan(org.planId) : null;
          if (plan && plan.monthlyPortraitCredits) {
            const { creditsUsed } = await storage.getAccurateCreditsUsed(org.id);
            await storage.syncOrgCredits(org.id);
            if (creditsUsed >= plan.monthlyPortraitCredits) {
              if (org.subscriptionStatus === "trial" || !plan.overagePriceCents) {
                return res.status(403).json({
                  error: `You've used all ${plan.monthlyPortraitCredits} monthly portrait credits. ${org.subscriptionStatus === "trial" ? "Upgrade to a paid plan for more credits." : "Credits reset at the start of your next billing cycle."}`,
                  creditsUsed,
                  creditsLimit: plan.monthlyPortraitCredits,
                });
              }
            }
          }
        }
      }

      const generatedImage = await generateImage(sanitizedPrompt, originalImage || undefined);

      let portraitRecord = existingPortrait;
      if (dogId && styleId) {
        const parsedDogId = parseInt(dogId);
        const parsedStyleId = parseInt(styleId);
        if (existingPortrait) {
          await storage.updatePortrait(existingPortrait.id, {
            previousImageUrl: existingPortrait.generatedImageUrl || null,
            generatedImageUrl: generatedImage,
          });
          await storage.incrementPortraitEditCount(existingPortrait.id);
          await storage.selectPortraitForGallery(parsedDogId, existingPortrait.id);
          portraitRecord = { ...existingPortrait, editCount: existingPortrait.editCount + 1, generatedImageUrl: generatedImage, previousImageUrl: existingPortrait.generatedImageUrl || null };
        } else {
          portraitRecord = await storage.createPortrait({
            dogId: parsedDogId,
            styleId: parsedStyleId,
            generatedImageUrl: generatedImage,
          });
          await storage.selectPortraitForGallery(parsedDogId, portraitRecord.id);
          await storage.incrementOrgPortraitsUsed(org.id);
        }
      }

      res.json({
        generatedImage,
        dogName: dogName ? sanitizeForPrompt(dogName) : dogName,
        portraitId: portraitRecord?.id,
        editCount: portraitRecord ? portraitRecord.editCount : null,
        maxEdits: MAX_EDITS_PER_IMAGE,
        isNewPortrait,
        hasPreviousImage: !!(portraitRecord as any)?.previousImageUrl,
      });
    } catch (error) {
      console.error("[generate-portrait]", error);
      res.status(500).json({ error: "Failed to generate portrait. Please try again." });
    }
  });

  app.post("/api/edit-portrait", isAuthenticated, aiRateLimiter, async (req: any, res: Response) => {
    try {
      const userId = req.user.claims.sub;
      const userEmail = req.user.claims.email || "";
      const { currentImage, editPrompt, dogId, portraitId } = req.body;

      if (!currentImage) return res.status(400).json({ error: "Current image is required" });
      if (!editPrompt || typeof editPrompt !== "string") return res.status(400).json({ error: "Edit instructions are required" });
      if (editPrompt.length > 500) return res.status(400).json({ error: "Edit instructions too long (max 500 characters)." });

      const sanitizedEditPrompt = sanitizeForPrompt(editPrompt);
      if (!sanitizedEditPrompt) return res.status(400).json({ error: "Edit instructions contain invalid characters." });

      const { org, error, status } = await resolveOrgForUser(userId, userEmail, dogId ? parseInt(dogId) : undefined);
      if (error) return res.status(status || 400).json({ error });
      if (org.subscriptionStatus === "canceled") {
        return res.status(403).json({ error: "Your subscription has been canceled. Please choose a new plan." });
      }

      if (isTrialExpired(org)) {
        return res.status(403).json({ error: "Your 30-day free trial has expired. Please upgrade to a paid plan to continue." });
      }



      if (portraitId) {
        const portrait = await storage.getPortrait(parseInt(portraitId));
        if (!portrait) return res.status(404).json({ error: "Portrait not found" });

        // Verify portrait belongs to the user's org
        const dog = await storage.getDog(portrait.dogId);
        if (!dog || dog.organizationId !== org.id) {
          return res.status(403).json({ error: "Not authorized to edit this portrait" });
        }

        if (portrait.editCount >= MAX_EDITS_PER_IMAGE) {
          return res.status(403).json({
            error: `You've used all ${MAX_EDITS_PER_IMAGE} edits for this portrait. Try a different style!`,
            editCount: portrait.editCount,
            maxEdits: MAX_EDITS_PER_IMAGE,
          });
        }
      }

      const editedImage = await editImage(currentImage, sanitizedEditPrompt);

      let editCount: number | null = null;
      if (portraitId) {
        const existing = await storage.getPortrait(parseInt(portraitId));
        await storage.updatePortrait(parseInt(portraitId), {
          previousImageUrl: existing?.generatedImageUrl || null,
          generatedImageUrl: editedImage,
        });
        await storage.incrementPortraitEditCount(parseInt(portraitId));
        const updated = await storage.getPortrait(parseInt(portraitId));
        editCount = updated?.editCount ?? null;
      }

      res.json({ editedImage, editCount, maxEdits: MAX_EDITS_PER_IMAGE, hasPreviousImage: true });
    } catch (error) {
      console.error("[edit-portrait]", error);
      res.status(500).json({ error: "Failed to edit portrait. Please try again." });
    }
  });

  app.post("/api/revert-portrait", isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = req.user.claims.sub;
      const userEmail = req.user.claims.email || "";
      const { portraitId } = req.body;

      if (!portraitId) return res.status(400).json({ error: "Portrait ID is required" });

      const portrait = await storage.getPortrait(parseInt(portraitId));
      if (!portrait) return res.status(404).json({ error: "Portrait not found" });
      if (!portrait.previousImageUrl) return res.status(400).json({ error: "No previous image to revert to" });

      const { org, error, status } = await resolveOrgForUser(userId, userEmail, portrait.dogId);
      if (error) return res.status(status || 400).json({ error });

      await storage.updatePortrait(portrait.id, {
        generatedImageUrl: portrait.previousImageUrl,
        previousImageUrl: null,
      });

      res.json({
        revertedImage: portrait.previousImageUrl,
        portraitId: portrait.id,
        editCount: portrait.editCount,
        hasPreviousImage: false,
      });
    } catch (error) {
      console.error("[revert-portrait]", error);
      res.status(500).json({ error: "Failed to revert portrait. Please try again." });
    }
  });

  // Admin routes
  app.post("/api/admin/organizations", isAuthenticated, isAdmin, async (req: any, res: Response) => {
    try {
      const { name, description, websiteUrl } = req.body;

      if (!name) {
        return res.status(400).json({ error: "Organization name is required" });
      }

      const slug = await generateUniqueSlug(name);

      const org = await storage.createOrganization({
        name,
        slug,
        description: description || "",
        websiteUrl: websiteUrl || "",
        ownerId: null,
        subscriptionStatus: "inactive",
        portraitsUsedThisMonth: 0,
      });

      res.status(201).json(org);
    } catch (error) {
      console.error("Error creating organization (admin):", error);
      res.status(500).json({ error: "Failed to create organization" });
    }
  });

  app.get("/api/admin/organizations", isAuthenticated, isAdmin, async (req: any, res: Response) => {
    try {
      const orgs = await storage.getAllOrganizations();
      const allPlans = await storage.getAllSubscriptionPlans();
      const planMap = new Map(allPlans.map(p => [p.id, p]));
      
      const orgsWithStats = await Promise.all(
        orgs.map(async (org) => {
          const dogs = await storage.getDogsByOrganization(org.id);
          let portraitCount = 0;
          for (const dog of dogs) {
            const portraits = await storage.getPortraitsByDog(dog.id);
            portraitCount += portraits.length;
          }
          
          const plan = org.planId ? planMap.get(org.planId) : null;
          const planName = plan ? plan.name.toLowerCase() : "none";
          const planPriceCents = plan ? plan.priceMonthly : 0;
          const addonSlots = org.additionalPetSlots || 0;
          const addonRevenueCents = addonSlots * 300;
          const totalRevenueCents = (org.subscriptionStatus === "active" ? planPriceCents : 0) + (org.subscriptionStatus === "active" ? addonRevenueCents : 0);
          
          return {
            ...org,
            dogCount: dogs.length,
            portraitCount,
            planName,
            planPriceCents,
            addonRevenueCents,
            totalRevenueCents,
          };
        })
      );
      
      res.json(orgsWithStats);
    } catch (error) {
      console.error("Error fetching admin organizations:", error);
      res.status(500).json({ error: "Failed to fetch organizations" });
    }
  });

  app.get("/api/admin/stats", isAuthenticated, isAdmin, async (req: any, res: Response) => {
    try {
      const orgs = await storage.getAllOrganizations();
      const dogs = await storage.getAllDogs();
      
      let totalPortraits = 0;
      for (const dog of dogs) {
        const portraits = await storage.getPortraitsByDog(dog.id);
        totalPortraits += portraits.length;
      }
      
      // Calculate subscription stats
      const activeSubscriptions = orgs.filter(o => o.subscriptionStatus === "active").length;
      const pastDue = orgs.filter(o => o.subscriptionStatus === "past_due").length;
      
      const allPlans = await storage.getAllSubscriptionPlans();
      const planMap = new Map(allPlans.map(p => [p.id, p]));

      const planDistribution: Record<string, number> = {};
      for (const plan of allPlans) {
        const key = plan.name.toLowerCase() === "free trial" ? "trial" : plan.name.toLowerCase();
        planDistribution[key] = orgs.filter(o => o.planId === plan.id).length;
      }
      planDistribution.trial = (planDistribution.trial || 0) + orgs.filter(o => !o.planId && o.subscriptionStatus === "trial").length;
      planDistribution.inactive = orgs.filter(o => o.subscriptionStatus === "inactive" || o.subscriptionStatus === "canceled").length;

      const monthlyRevenue = orgs.reduce((sum, o) => {
        if (o.subscriptionStatus === "active" && o.planId) {
          const plan = planMap.get(o.planId);
          const planRev = plan ? plan.priceMonthly / 100 : 0;
          const addonRev = (o.additionalPetSlots || 0) * 3;
          return sum + planRev + addonRev;
        }
        return sum;
      }, 0);
      
      res.json({
        totalOrgs: orgs.length,
        totalDogs: dogs.length,
        totalPortraits,
        activeSubscriptions,
        pastDue,
        monthlyRevenue,
        planDistribution,
      });
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  app.get("/api/admin/organizations/:id/dogs", isAuthenticated, isAdmin, async (req: any, res: Response) => {
    try {
      const orgId = parseInt(req.params.id as string);
      const org = await storage.getOrganization(orgId);
      if (!org) {
        return res.status(404).json({ error: "Organization not found" });
      }

      const orgDogs = await storage.getDogsByOrganization(orgId);
      const dogsWithPortraits = await Promise.all(
        orgDogs.map(async (dog) => {
          const portrait = await storage.getSelectedPortraitByDog(dog.id);
          if (portrait) {
            const style = await storage.getPortraitStyle(portrait.styleId);
            return { ...dog, portrait: { ...portrait, style } };
          }
          return dog;
        })
      );

      res.json(dogsWithPortraits);
    } catch (error) {
      console.error("Error fetching org dogs:", error);
      res.status(500).json({ error: "Failed to fetch dogs" });
    }
  });

  app.post("/api/admin/organizations/:id/dogs", isAuthenticated, isAdmin, async (req: any, res: Response) => {
    try {
      const orgId = parseInt(req.params.id as string);
      const org = await storage.getOrganization(orgId);
      if (!org) {
        return res.status(404).json({ error: "Organization not found" });
      }

      if (!org.planId || org.subscriptionStatus === "inactive") {
        return res.status(403).json({ error: "This organization needs a plan before pets can be added" });
      }

      const limitError = await checkDogLimit(orgId);
      if (limitError) {
        return res.status(403).json({ error: limitError });
      }

      const { originalPhotoUrl, generatedPortraitUrl, styleId, ...dogData } = req.body;

      if (dogData.name && containsInappropriateLanguage(dogData.name)) {
        return res.status(400).json({ error: "Please choose a family-friendly name" });
      }

      if (dogData.breed && !isValidBreed(dogData.breed, dogData.species)) {
        return res.status(400).json({ error: "Please select a valid breed from the list" });
      }

      const dog = await createDogWithPortrait(dogData, orgId, originalPhotoUrl, generatedPortraitUrl, styleId);
      res.status(201).json(dog);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      const errMsg = error instanceof Error ? error.message : String(error);
      console.error("Error creating pet for org:", errMsg, error);
      res.status(500).json({ error: `Failed to save pet: ${errMsg}` });
    }
  });

  app.get("/api/admin/organizations/:id", isAuthenticated, isAdmin, async (req: any, res: Response) => {
    try {
      const id = parseInt(req.params.id as string);
      let org = await storage.getOrganization(id);
      if (!org) {
        return res.status(404).json({ error: "Organization not found" });
      }
      const synced = await storage.syncOrgCredits(id);
      if (synced) org = synced;
      const dogs = await storage.getDogsByOrganization(id);
      const plan = org.planId ? await storage.getSubscriptionPlan(org.planId) : null;
      res.json({
        ...org,
        dogCount: dogs.length,
        ...computePetLimitInfo(org, plan, dogs.length),
      });
    } catch (error) {
      console.error("Error fetching organization:", error);
      res.status(500).json({ error: "Failed to fetch organization" });
    }
  });

  app.post("/api/admin/organizations/:id/select-plan", isAuthenticated, isAdmin, async (req: any, res: Response) => {
    try {
      const id = parseInt(req.params.id as string);
      const { planId } = req.body;

      if (!planId) {
        return res.status(400).json({ error: "Plan ID is required" });
      }

      const plan = await storage.getSubscriptionPlan(planId);
      if (!plan) {
        return res.status(400).json({ error: "Invalid plan" });
      }

      const org = await storage.getOrganization(id);
      if (!org) {
        return res.status(404).json({ error: "Organization not found" });
      }

      const isFreeTrialPlan = plan.priceMonthly === 0 && (plan.trialDays ?? 0) > 0;

      if (isFreeTrialPlan && !canStartFreeTrial(org)) {
        return res.status(400).json({ error: "This organization has already used its free trial." });
      }

      const trialEndsAt = plan.trialDays ? new Date(Date.now() + plan.trialDays * 24 * 60 * 60 * 1000) : null;

      const isNewPlan = org.planId !== plan.id;
      const orgUpdate: Partial<InsertOrganization> = {
        planId: plan.id,
        subscriptionStatus: isFreeTrialPlan ? "trial" : "active",
      };
      if (isNewPlan) {
        orgUpdate.billingCycleStart = org.billingCycleStart || org.createdAt || new Date();
      }
      if (trialEndsAt) {
        orgUpdate.trialEndsAt = trialEndsAt;
      }
      await storage.updateOrganization(id, orgUpdate);

      if (isFreeTrialPlan) {
        await markFreeTrialUsed(id);
      }

      await storage.syncOrgCredits(id);

      const updated = await storage.getOrganization(id);
      res.json(updated);
    } catch (error) {
      console.error("Error selecting plan for organization:", error);
      res.status(500).json({ error: "Failed to select plan" });
    }
  });

  app.patch("/api/admin/organizations/:id", isAuthenticated, isAdmin, async (req: any, res: Response) => {
    try {
      const id = parseInt(req.params.id as string);
      const org = await storage.getOrganization(id);
      if (!org) {
        return res.status(404).json({ error: "Organization not found" });
      }

      const allowedFields = [
        "name", "description", "websiteUrl", "logoUrl",
        "contactName", "contactEmail", "contactPhone",
        "socialFacebook", "socialInstagram", "socialTwitter", "socialNextdoor",
        "locationStreet", "locationCity", "locationState", "locationZip", "locationCountry",
        "billingStreet", "billingCity", "billingState", "billingZip", "billingCountry",
        "notes", "isActive", "planId", "speciesHandled", "onboardingCompleted",
        "subscriptionStatus", "stripeCustomerId", "stripeSubscriptionId", "stripeTestMode", "billingCycleStart"
      ];
      const updates: Record<string, any> = {};
      for (const field of allowedFields) {
        if (req.body[field] !== undefined) {
          updates[field] = req.body[field];
        }
      }

      if (updates.planId !== undefined) {
        if (updates.planId !== null) {
          const plan = await storage.getSubscriptionPlan(updates.planId);
          if (!plan) {
            return res.status(400).json({ error: "Invalid plan selected" });
          }
        }
      }

      if (updates.logoUrl !== undefined && updates.logoUrl !== null) {
        const MAX_LOGO_LENGTH = 500000;
        if (typeof updates.logoUrl !== "string" || updates.logoUrl.length > MAX_LOGO_LENGTH) {
          return res.status(400).json({ error: "Logo data too large or invalid" });
        }
      }

      if (updates.name && updates.name !== org.name) {
        updates.slug = await generateUniqueSlug(updates.name, id);
      }

      const stripeFields: Record<string, any> = {};
      for (const key of ["stripeCustomerId", "stripeSubscriptionId", "subscriptionStatus", "stripeTestMode"] as const) {
        if (updates[key] !== undefined) {
          stripeFields[key] = updates[key];
          if (key !== "subscriptionStatus") delete updates[key];
        }
      }

      await storage.updateOrganization(id, updates);
      if (Object.keys(stripeFields).length > 0) {
        await storage.updateOrganizationStripeInfo(id, stripeFields);
      }
      const result = await storage.getOrganization(id);
      res.json(result);
    } catch (error) {
      console.error("Error updating organization:", error);
      res.status(500).json({ error: "Failed to update organization" });
    }
  });

  app.delete("/api/admin/organizations/:id", isAuthenticated, isAdmin, async (req: any, res: Response) => {
    try {
      const id = parseInt(req.params.id as string);
      
      const org = await storage.getOrganization(id);
      if (!org) {
        return res.status(404).json({ error: "Organization not found" });
      }
      
      // Delete all dogs (cascades to portraits)
      const dogs = await storage.getDogsByOrganization(id);
      for (const dog of dogs) {
        await storage.deleteDog(dog.id);
      }
      
      // Delete the organization
      await storage.deleteOrganization(id);
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting organization:", error);
      res.status(500).json({ error: "Failed to delete organization" });
    }
  });

  app.get("/api/admin/data-integrity", isAuthenticated, isAdmin, async (req: any, res: Response) => {
    try {
      const allOrgs = await storage.getAllOrganizations();
      const issues: any[] = [];

      for (const org of allOrgs) {
        const orgDogs = await storage.getDogsByOrganization(org.id);
        const dogCount = orgDogs.length;

        if (!org.planId && dogCount > 0) {
          issues.push({
            type: "no_plan",
            severity: "critical",
            orgId: org.id,
            orgName: org.name,
            dogCount,
            message: `Has ${dogCount} pet(s) but no plan assigned`,
          });
        }

        if (!org.planId && org.subscriptionStatus === "trial") {
          issues.push({
            type: "trial_no_plan",
            severity: "critical",
            orgId: org.id,
            orgName: org.name,
            message: `Status is "trial" but no plan assigned`,
          });
        }

        if (org.planId && dogCount > 0) {
          const plan = await storage.getSubscriptionPlan(org.planId);
          if (plan?.dogsLimit) {
            const effectiveLimit = plan.dogsLimit + (org.additionalPetSlots || 0);
            if (dogCount > effectiveLimit) {
              issues.push({
                type: "over_limit",
                severity: "warning",
                orgId: org.id,
                orgName: org.name,
                dogCount,
                petLimit: effectiveLimit,
                planName: plan.name,
                message: `Has ${dogCount} pet(s) but limit is ${effectiveLimit}`,
              });
            }
          }
        }
      }

      res.json({
        totalOrgs: allOrgs.length,
        issueCount: issues.length,
        issues,
      });
    } catch (error) {
      console.error("Error checking data integrity:", error);
      res.status(500).json({ error: "Failed to check data integrity" });
    }
  });

  app.post("/api/admin/sync-stripe", isAuthenticated, isAdmin, async (req: any, res: Response) => {
    try {
      const allOrgs = await storage.getAllOrganizations();
      const orgsWithStripe = allOrgs.filter(o => o.stripeSubscriptionId);
      const results: string[] = [];

      for (const org of orgsWithStripe) {
        try {
          const stripe = getStripeClient(org.stripeTestMode);
          const sub = await stripe.subscriptions.retrieve(org.stripeSubscriptionId!);
          const newStatus = mapStripeStatusToInternal(sub.status, org.subscriptionStatus);

          const priceId = sub.items?.data?.[0]?.price?.id;
          const matchedPlan = priceId ? STRIPE_PLAN_PRICE_MAP[priceId] : undefined;
          const updates: any = {};
          const changes: string[] = [];

          if (newStatus !== org.subscriptionStatus) {
            updates.subscriptionStatus = newStatus;
            changes.push(`status: ${org.subscriptionStatus} → ${newStatus}`);
          }

          if (matchedPlan && matchedPlan.id !== org.planId) {
            updates.planId = matchedPlan.id;
            changes.push(`plan: ${org.planId} → ${matchedPlan.id} (${matchedPlan.name})`);
          }

          if (newStatus === 'canceled') {
            if (org.additionalPetSlots && org.additionalPetSlots > 0) {
              updates.additionalPetSlots = 0;
              changes.push(`add-on slots: ${org.additionalPetSlots} → 0`);
            }
          }

          const subAny = sub as any;
          if (sub.status === 'active' && subAny.current_period_start) {
            const periodStart = new Date(subAny.current_period_start * 1000);
            const existingStart = org.billingCycleStart;
            if (!existingStart || existingStart.getTime() !== periodStart.getTime()) {
              updates.billingCycleStart = periodStart;
              changes.push(`billing cycle: updated to ${periodStart.toISOString()}`);
            }
          }

          if (changes.length > 0) {
            if (updates.subscriptionStatus) {
              await storage.updateOrganizationStripeInfo(org.id, {
                subscriptionStatus: updates.subscriptionStatus,
                stripeSubscriptionId: org.stripeSubscriptionId!,
              });
              delete updates.subscriptionStatus;
            }
            if (Object.keys(updates).length > 0) {
              await storage.updateOrganization(org.id, updates);
            }
            results.push(`${org.name} (id ${org.id}): ${changes.join(', ')}`);
          }
        } catch (stripeErr: any) {
          results.push(`${org.name} (id ${org.id}): ERROR - ${stripeErr.message}`);
        }
      }

      res.json({
        message: `Synced ${orgsWithStripe.length} org(s) with Stripe`,
        orgsChecked: orgsWithStripe.length,
        changes: results,
      });
    } catch (error: any) {
      console.error("Error syncing Stripe data:", error);
      res.status(500).json({ error: "Failed to sync Stripe data" });
    }
  });

  app.post("/api/admin/recalculate-credits", isAuthenticated, isAdmin, async (req: any, res: Response) => {
    try {
      const results = await storage.recalculateAllOrgCredits();
      res.json({
        message: `Recalculated credits for ${results.length} organization(s)`,
        changes: results,
      });
    } catch (error) {
      console.error("Error recalculating credits:", error);
      res.status(500).json({ error: "Failed to recalculate credits" });
    }
  });

  // --- SMS sharing via Twilio ---
  const smsRateLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 5,
    message: { error: "Too many texts sent. Please wait a minute." },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req: any) => req.user?.claims?.sub || "anonymous",
  });

  app.post("/api/send-sms", isAuthenticated, smsRateLimiter, async (req: any, res: Response) => {
    try {
      const { to, message } = req.body;
      if (!to || !message) {
        return res.status(400).json({ error: "Phone number and message are required" });
      }

      // Basic phone number validation: digits, spaces, dashes, parens, optional leading +
      const cleaned = to.replace(/[\s\-().]/g, "");
      if (!/^\+?1?\d{10,15}$/.test(cleaned)) {
        return res.status(400).json({ error: "Please enter a valid phone number" });
      }

      const accountSid = process.env.TWILIO_ACCOUNT_SID;
      const apiKeySid = process.env.TWILIO_API_KEY_SID;
      const apiKeySecret = process.env.TWILIO_API_KEY_SECRET;
      const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;

      if (!accountSid || !apiKeySid || !apiKeySecret || !messagingServiceSid) {
        return res.status(503).json({ error: "SMS service is not configured" });
      }

      const client = Twilio(apiKeySid, apiKeySecret, { accountSid });
      const phone = cleaned.startsWith("+") ? cleaned : cleaned.startsWith("1") ? `+${cleaned}` : `+1${cleaned}`;

      await client.messages.create({
        body: message,
        messagingServiceSid,
        to: phone,
      });

      res.json({ success: true });
    } catch (error: any) {
      console.error("SMS send error:", error);
      const twilioMsg = error?.message || "Failed to send text message";
      res.status(500).json({ error: twilioMsg });
    }
  });

  // --- Instagram Integration ---

  // Ensure Instagram columns exist on organizations table
  (async () => {
    try {
      await pool.query(`
        ALTER TABLE organizations
          ADD COLUMN IF NOT EXISTS instagram_access_token TEXT,
          ADD COLUMN IF NOT EXISTS instagram_user_id TEXT,
          ADD COLUMN IF NOT EXISTS instagram_username TEXT,
          ADD COLUMN IF NOT EXISTS instagram_page_id TEXT,
          ADD COLUMN IF NOT EXISTS instagram_token_expires_at TIMESTAMP
      `);
      console.log("[instagram] DB columns ready");
    } catch (e: any) {
      console.warn("[instagram] Could not add columns:", e.message);
    }
  })();

  // Check Instagram connection status for an org
  app.get("/api/instagram/status", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.claims.sub;
      const email = (req as any).user.claims.email;
      const isAdmin = email === ADMIN_EMAIL;

      const orgIdParam = req.query.orgId ? parseInt(req.query.orgId as string) : null;
      let org;
      if (isAdmin && orgIdParam) {
        org = await storage.getOrganization(orgIdParam);
      } else {
        org = await storage.getOrganizationByOwner(userId);
      }
      if (!org) return res.json({ connected: false });

      const result = await pool.query(
        'SELECT instagram_user_id, instagram_username FROM organizations WHERE id = $1',
        [org.id]
      );
      const row = result.rows[0];
      if (row?.instagram_user_id) {
        res.json({ connected: true, username: row.instagram_username || null, orgId: org.id });
      } else {
        res.json({ connected: false, orgId: org.id });
      }
    } catch (error) {
      console.error("[instagram] Status error:", error);
      res.json({ connected: false });
    }
  });

  // Initiate Instagram OAuth flow via Facebook Login for Business
  app.get("/api/instagram/connect", isAuthenticated, async (req: Request, res: Response) => {
    const appId = process.env.META_APP_ID;
    const configId = process.env.META_CONFIG_ID;
    if (!appId || !configId) return res.status(503).json({ error: "Instagram integration not configured (missing META_APP_ID or META_CONFIG_ID)" });

    const userId = (req as any).user.claims.sub;
    const orgIdParam = req.query.orgId ? parseInt(req.query.orgId as string) : null;
    const email = (req as any).user.claims.email;
    const isAdmin = email === ADMIN_EMAIL;

    let orgId: number | null = null;
    if (isAdmin && orgIdParam) {
      orgId = orgIdParam;
    } else {
      const org = await storage.getOrganizationByOwner(userId);
      if (org) orgId = org.id;
    }
    if (!orgId) return res.status(400).json({ error: "No organization found" });

    const redirectUri = `https://pawtrait-pals.onrender.com/api/instagram/callback`;
    const state = Buffer.from(JSON.stringify({ orgId, userId })).toString('base64url');

    // Facebook Login for Business requires config_id (not scope in URL)
    // Permissions are configured in Meta Developer Console under Facebook Login for Business > Configurations
    const authUrl = `https://www.facebook.com/v21.0/dialog/oauth?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&config_id=${configId}&response_type=code&state=${state}`;

    res.redirect(authUrl);
  });

  // Instagram OAuth callback via Facebook Login for Business
  app.get("/api/instagram/callback", async (req: Request, res: Response) => {
    const appId = process.env.META_APP_ID;
    const appSecret = process.env.META_APP_SECRET;
    if (!appId || !appSecret) return res.status(503).send("Instagram integration not configured");

    const { code, state, error: fbError, error_description } = req.query;
    if (fbError || !code || !state) {
      console.error("[instagram] OAuth error or missing params:", { fbError, error_description, hasCode: !!code, hasState: !!state });
      return res.redirect('/settings?instagram=error&detail=' + encodeURIComponent(String(error_description || fbError || 'missing_params')));
    }

    let stateData: { orgId: number; userId: string };
    try {
      stateData = JSON.parse(Buffer.from(state as string, 'base64url').toString());
    } catch {
      return res.redirect('/settings?instagram=error&detail=invalid_state');
    }

    const redirectUri = `https://pawtrait-pals.onrender.com/api/instagram/callback`;

    try {
      // Step 1: Exchange code for short-lived Facebook user access token
      console.log(`[instagram] Exchanging code for Facebook token via graph.facebook.com`);
      const tokenRes = await fetch(
        `https://graph.facebook.com/v21.0/oauth/access_token?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&client_secret=${appSecret}&code=${encodeURIComponent(code as string)}`
      );
      const tokenData = await tokenRes.json() as any;
      if (!tokenData.access_token) {
        console.error("[instagram] Facebook token exchange failed:", tokenData);
        throw new Error(tokenData.error?.message || "Facebook token exchange failed");
      }
      const shortLivedToken = tokenData.access_token;
      console.log(`[instagram] Got short-lived Facebook user access token`);

      // Step 2: Exchange short-lived token for long-lived token (~60 days)
      // This is REQUIRED — without this, page tokens from /me/accounts expire in ~1 hour
      console.log(`[instagram] Exchanging for long-lived token`);
      const longLivedRes = await fetch(
        `https://graph.facebook.com/v21.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${appId}&client_secret=${appSecret}&fb_exchange_token=${shortLivedToken}`
      );
      const longLivedData = await longLivedRes.json() as any;
      if (!longLivedData.access_token) {
        console.error("[instagram] Long-lived token exchange failed:", longLivedData);
        throw new Error(longLivedData.error?.message || "Long-lived token exchange failed");
      }
      const userToken = longLivedData.access_token;
      console.log(`[instagram] Got long-lived user token (expires_in: ${longLivedData.expires_in || 'never'})`);

      // Step 3: Get user's Facebook Pages (page tokens from long-lived user token are non-expiring)
      const pagesRes = await fetch(
        `https://graph.facebook.com/v21.0/me/accounts?fields=id,name,access_token&access_token=${userToken}`
      );
      const pagesData = await pagesRes.json() as any;
      if (!pagesData.data || pagesData.data.length === 0) {
        throw new Error("No Facebook Pages found. Your Instagram Business account must be connected to a Facebook Page.");
      }
      console.log(`[instagram] Found ${pagesData.data.length} Facebook Page(s)`);

      // Step 4: Find the first page with an Instagram Business Account
      let igAccountId: string | null = null;
      let pageAccessToken: string | null = null;
      let pageId: string | null = null;
      let igUsername: string | null = null;

      for (const page of pagesData.data) {
        const igRes = await fetch(
          `https://graph.facebook.com/v21.0/${page.id}?fields=instagram_business_account&access_token=${page.access_token}`
        );
        const igData = await igRes.json() as any;
        if (igData.instagram_business_account) {
          igAccountId = igData.instagram_business_account.id;
          pageAccessToken = page.access_token;
          pageId = page.id;

          // Get Instagram username
          const profileRes = await fetch(
            `https://graph.facebook.com/v21.0/${igAccountId}?fields=username,name&access_token=${pageAccessToken}`
          );
          const profileData = await profileRes.json() as any;
          igUsername = profileData.username || null;
          console.log(`[instagram] Found IG account @${igUsername} (${igAccountId}) on page ${page.name} (${page.id})`);
          break;
        }
      }

      if (!igAccountId || !pageAccessToken) {
        throw new Error("No Instagram Business account found linked to your Facebook Pages. Make sure your Instagram account is a Business or Creator account connected to a Facebook Page.");
      }

      // Page tokens from /me/accounts (when using a long-lived user token) are non-expiring
      // Set a far-future expiry as a safety marker
      const expiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
      await pool.query(
        `UPDATE organizations SET
          instagram_access_token = $1,
          instagram_user_id = $2,
          instagram_username = $3,
          instagram_page_id = $4,
          instagram_token_expires_at = $5
        WHERE id = $6`,
        [pageAccessToken, igAccountId, igUsername, pageId, expiresAt, stateData.orgId]
      );

      console.log(`[instagram] Connected @${igUsername} (IG ${igAccountId}, Page ${pageId}) to org ${stateData.orgId}`);
      res.redirect(`/settings?instagram=connected&username=${igUsername || ''}`);
    } catch (error: any) {
      console.error("[instagram] OAuth callback error:", error);
      res.redirect('/settings?instagram=error&detail=' + encodeURIComponent(error.message || 'unknown'));
    }
  });

  // Post to Instagram
  app.post("/api/instagram/post", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.claims.sub;
      const email = (req as any).user.claims.email;
      const isAdmin = email === ADMIN_EMAIL;
      const { dogId, caption } = req.body;

      if (!dogId) return res.status(400).json({ error: "dogId is required" });

      const dog = await storage.getDog(parseInt(dogId));
      if (!dog) return res.status(404).json({ error: "Dog not found" });

      // Get the org and verify ownership
      const org = await storage.getOrganization(dog.organizationId);
      if (!org) return res.status(404).json({ error: "Organization not found" });

      if (!isAdmin) {
        const userOrg = await storage.getOrganizationByOwner(userId);
        if (!userOrg || userOrg.id !== org.id) {
          return res.status(403).json({ error: "You don't have access to this organization" });
        }
      }

      // Get Instagram credentials
      const result = await pool.query(
        'SELECT instagram_access_token, instagram_user_id, instagram_token_expires_at FROM organizations WHERE id = $1',
        [org.id]
      );
      const row = result.rows[0];
      if (!row?.instagram_access_token || !row?.instagram_user_id) {
        return res.status(400).json({ error: "Instagram not connected. Connect Instagram in Settings first." });
      }

      // Check token expiry
      if (row.instagram_token_expires_at && new Date(row.instagram_token_expires_at) < new Date()) {
        return res.status(400).json({ error: "Instagram token expired. Please reconnect in Settings." });
      }

      // Get the selected portrait for this dog
      const portrait = await storage.getSelectedPortraitByDog(dog.id);
      if (!portrait || !portrait.generatedImageUrl) {
        return res.status(400).json({ error: "No portrait found for this pet" });
      }

      // Build public image URL
      const proto = req.headers['x-forwarded-proto'] || req.protocol || 'https';
      const host = (req.headers['x-forwarded-host'] as string) || (req.headers['host'] as string) || 'pawtraitpals.com';
      const imageUrl = `${proto}://${host}/api/portraits/${portrait.id}/image`;

      const postCaption = caption || `Meet ${dog.name}! ${dog.breed ? `A beautiful ${dog.breed} ` : ''}looking for a forever home. View their full profile at ${proto}://${host}/pawfile/${dog.id} #adoptdontshop #rescuepets #pawtraitpals`;

      // Step 1: Create media container
      const containerParams = new URLSearchParams({
        image_url: imageUrl,
        caption: postCaption,
        access_token: row.instagram_access_token,
      });
      const containerRes = await fetch(
        `https://graph.facebook.com/v21.0/${row.instagram_user_id}/media`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: containerParams.toString(),
        }
      );
      const containerData = await containerRes.json() as any;
      if (containerData.error) {
        console.error("[instagram] Container creation error:", containerData.error);
        throw new Error(containerData.error.message || "Failed to create Instagram post");
      }

      const containerId = containerData.id;

      // Step 2: Publish
      const publishParams = new URLSearchParams({
        creation_id: containerId,
        access_token: row.instagram_access_token,
      });
      const publishRes = await fetch(
        `https://graph.facebook.com/v21.0/${row.instagram_user_id}/media_publish`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: publishParams.toString(),
        }
      );
      const publishData = await publishRes.json() as any;
      if (publishData.error) {
        console.error("[instagram] Publish error:", publishData.error);
        throw new Error(publishData.error.message || "Failed to publish Instagram post");
      }

      console.log(`[instagram] Posted dog ${dog.id} (${dog.name}) to Instagram, media ID: ${publishData.id}`);
      res.json({ success: true, mediaId: publishData.id });
    } catch (error: any) {
      console.error("[instagram] Post error:", error);
      res.status(500).json({ error: error.message || "Failed to post to Instagram" });
    }
  });

  // Disconnect Instagram
  app.delete("/api/instagram/disconnect", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.claims.sub;
      const email = (req as any).user.claims.email;
      const isAdmin = email === ADMIN_EMAIL;

      const orgIdParam = req.query.orgId ? parseInt(req.query.orgId as string) : null;
      let org;
      if (isAdmin && orgIdParam) {
        org = await storage.getOrganization(orgIdParam);
      } else {
        org = await storage.getOrganizationByOwner(userId);
      }
      if (!org) return res.status(404).json({ error: "Organization not found" });

      await pool.query(
        `UPDATE organizations SET
          instagram_access_token = NULL,
          instagram_user_id = NULL,
          instagram_username = NULL,
          instagram_page_id = NULL,
          instagram_token_expires_at = NULL
        WHERE id = $1`,
        [org.id]
      );

      res.json({ success: true });
    } catch (error: any) {
      console.error("[instagram] Disconnect error:", error);
      res.status(500).json({ error: "Failed to disconnect Instagram" });
    }
  });

  return httpServer;
}
