import type { Express, Request, Response } from "express";
import type { InsertOrganization } from "@shared/schema";
import { storage } from "../storage";
import { isAuthenticated } from "../auth";
import { canStartFreeTrial, markFreeTrialUsed } from "../subscription";
import { getUserId, generateUniqueSlug, computePetLimitInfo } from "./helpers";

export function registerOrganizationRoutes(app: Express): void {
  app.get("/api/my-organization", isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = getUserId(req);
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

  app.post("/api/my-organization", isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = getUserId(req);
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
      const userId = getUserId(req);
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

  app.post("/api/select-plan", isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = getUserId(req);
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
}
