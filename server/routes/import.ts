import type { Express, Request, Response } from "express";
import { storage } from "../storage";
import { pool } from "../db";
import { isAuthenticated } from "../auth";
import { getUserId, getUserEmail, ADMIN_EMAIL } from "./helpers";
import { normalizeBreed } from "../breeds";

export async function registerImportRoutes(app: Express): Promise<void> {
  const { getProvider, getAvailableProviders, downloadPhotoAsBase64 } = await import("../import/index");

  // Ensure DB columns exist for import tracking
  (async () => {
    try {
      await pool.query(`
        ALTER TABLE dogs
          ADD COLUMN IF NOT EXISTS external_id TEXT,
          ADD COLUMN IF NOT EXISTS external_source TEXT,
          ADD COLUMN IF NOT EXISTS last_synced_at TIMESTAMP,
          ADD COLUMN IF NOT EXISTS tags JSONB
      `);
      console.log("[import] DB columns ready");
    } catch (e: any) {
      console.warn("[import] Could not add columns:", e.message);
    }
  })();

  // Get available import providers
  app.get("/api/import/providers", isAuthenticated, async (_req: Request, res: Response) => {
    res.json(getAvailableProviders());
  });

  // Search organizations on a platform
  app.get("/api/import/search", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const providerName = req.query.provider as string;
      const name = req.query.name as string;
      const location = req.query.location as string;

      if (!providerName) return res.status(400).json({ error: "provider is required" });
      if (!name) return res.status(400).json({ error: "name is required" });

      const provider = getProvider(providerName);
      const orgs = await provider.searchOrganizations(name, location);
      res.json(orgs);
    } catch (error: any) {
      console.error("[import] Search error:", error);
      res.status(500).json({ error: error.message || "Failed to search organizations" });
    }
  });

  // Fetch animals from an organization
  app.get("/api/import/animals", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const providerName = req.query.provider as string;
      const orgId = req.query.orgId as string;
      const apiKey = req.query.apiKey as string;

      if (!providerName) return res.status(400).json({ error: "provider is required" });
      if (!orgId && !apiKey) return res.status(400).json({ error: "orgId or apiKey is required" });

      // "DEMO" key triggers demo mode for testing
      const isDemoMode = providerName === "shelterluv" && apiKey && apiKey.toUpperCase() === "DEMO";
      const provider = getProvider(isDemoMode ? "demo" : providerName);
      const animals = await provider.fetchAnimals(orgId || apiKey);

      // Check which ones are already imported for this user's org
      const userId = getUserId(req);
      const email = getUserEmail(req);
      const isAdminUser = email === ADMIN_EMAIL;
      const orgIdParam = req.query.userOrgId ? parseInt(req.query.userOrgId as string) : null;

      let userOrg;
      if (isAdminUser && orgIdParam) {
        userOrg = await storage.getOrganization(orgIdParam);
      } else {
        userOrg = await storage.getOrganizationByOwner(userId);
      }

      if (userOrg) {
        const animalsWithStatus = await Promise.all(
          animals.map(async (animal: any) => {
            const existing = await storage.findDogByExternalId(animal.externalId, providerName, userOrg!.id);
            return { ...animal, alreadyImported: !!existing };
          })
        );
        return res.json(animalsWithStatus);
      }

      res.json(animals.map((a: any) => ({ ...a, alreadyImported: false })));
    } catch (error: any) {
      console.error("[import] Fetch animals error:", error);
      res.status(500).json({ error: error.message || "Failed to fetch animals" });
    }
  });

  // Import selected animals into user's organization
  app.post("/api/import/pets", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const { provider: providerName, animals } = req.body;

      if (!providerName) return res.status(400).json({ error: "provider is required" });
      if (!Array.isArray(animals) || animals.length === 0) {
        return res.status(400).json({ error: "animals array is required" });
      }

      const userId = getUserId(req);
      const email = getUserEmail(req);
      const isAdminUser = email === ADMIN_EMAIL;
      const orgIdParam = req.body.orgId ? parseInt(req.body.orgId) : null;

      let org;
      if (isAdminUser && orgIdParam) {
        org = await storage.getOrganization(orgIdParam);
      } else {
        org = await storage.getOrganizationByOwner(userId);
      }

      if (!org) return res.status(404).json({ error: "No organization found" });

      // Check plan limits before importing
      const plan = org.planId ? await storage.getSubscriptionPlan(org.planId) : null;
      const existingDogs = await storage.getDogsByOrganization(org.id);
      const currentCount = existingDogs.length;
      const effectiveLimit = plan?.dogsLimit
        ? plan.dogsLimit + (org.additionalPetSlots || 0)
        : null;

      // Count how many are actually new (not already imported)
      let newCount = 0;
      for (const animal of animals) {
        const existing = await storage.findDogByExternalId(animal.externalId, providerName, org.id);
        if (!existing) newCount++;
      }

      if (effectiveLimit !== null && currentCount + newCount > effectiveLimit) {
        const slotsAvailable = Math.max(0, effectiveLimit - currentCount);
        return res.status(400).json({
          error: "pet_limit_exceeded",
          message: `You have ${currentCount} of ${effectiveLimit} pet slots used. You're trying to import ${newCount} new pets but only have ${slotsAvailable} slot${slotsAvailable !== 1 ? "s" : ""} available.`,
          currentCount,
          effectiveLimit,
          newCount,
          slotsAvailable,
        });
      }

      let imported = 0;
      let skipped = 0;

      for (const animal of animals) {
        const existing = await storage.findDogByExternalId(
          animal.externalId,
          providerName,
          org.id
        );

        if (existing) {
          skipped++;
          continue;
        }

        // Download the selected photo
        let photoBase64: string | null = null;
        if (animal.selectedPhotoUrl) {
          photoBase64 = await downloadPhotoAsBase64(animal.selectedPhotoUrl);
        }

        // Normalize breed name to match our AKC list
        const animalSpecies = animal.species === "cat" ? "cat" : "dog";
        const { breed: normalizedBreed } = normalizeBreed(animal.breed, animalSpecies);

        await storage.createDog({
          organizationId: org.id,
          name: animal.name || "Unknown",
          species: animalSpecies,
          breed: normalizedBreed,
          age: animal.age || null,
          description: animal.description || null,
          originalPhotoUrl: photoBase64,
          adoptionUrl: null,
          isAvailable: animal.isAvailable !== false,
          externalId: animal.externalId,
          externalSource: providerName,
          lastSyncedAt: new Date(),
          tags: animal.tags || [],
        } as any);

        imported++;
      }

      console.log(`[import] ${providerName}: imported ${imported}, skipped ${skipped} for org ${org.id}`);
      res.json({ imported, skipped });
    } catch (error: any) {
      console.error("[import] Import error:", error);
      res.status(500).json({ error: error.message || "Failed to import pets" });
    }
  });
}
