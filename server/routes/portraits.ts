import type { Express, Request, Response } from "express";
import { storage } from "../storage";
import { isAuthenticated } from "../auth";
import { generateImage, editImage } from "../gemini";
import { generateShowcaseMockup, generatePawfileMockup } from "../generate-mockups";
import { isTrialExpired } from "../subscription";
import { getUserId, getUserEmail, ADMIN_EMAIL, sanitizeForPrompt, resolveOrgForUser, checkDogLimit, aiRateLimiter, MAX_EDITS_PER_IMAGE } from "./helpers";
import { uploadToStorage, isDataUri, fetchImageAsBuffer } from "../supabase-storage";
import { enqueue, registerWorker, type Job } from "../job-queue";

export function registerPortraitRoutes(app: Express): void {
  // Register the async worker that processes portrait generation and edit jobs
  registerWorker(async (job: Job) => {
    const p = job.payload;

    if (job.type === "generate") {
      const generatedImageRaw = await generateImage(p.prompt, p.originalImage || undefined);

      let generatedImage = generatedImageRaw;
      try {
        const fname = `portrait-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.png`;
        generatedImage = await uploadToStorage(generatedImageRaw, "portraits", fname);
      } catch (err) {
        console.error("[storage-upload] Portrait upload failed, using base64 fallback:", err);
      }

      let portraitRecord = p.existingPortrait ? { ...p.existingPortrait } : null;
      if (p.dogId && p.styleId) {
        if (p.existingPortrait) {
          await storage.updatePortrait(p.existingPortrait.id, {
            previousImageUrl: p.existingPortrait.generatedImageUrl || null,
            generatedImageUrl: generatedImage,
          });
          await storage.incrementPortraitEditCount(p.existingPortrait.id);
          await storage.selectPortraitForGallery(p.dogId, p.existingPortrait.id);
          portraitRecord = {
            ...p.existingPortrait,
            editCount: p.existingPortrait.editCount + 1,
            generatedImageUrl: generatedImage,
            previousImageUrl: p.existingPortrait.generatedImageUrl || null,
          };
        } else {
          portraitRecord = await storage.createPortrait({
            dogId: p.dogId,
            styleId: p.styleId,
            generatedImageUrl: generatedImage,
          });
          await storage.selectPortraitForGallery(p.dogId, portraitRecord.id);
          await storage.incrementOrgPortraitsUsed(p.orgId);
        }
      }

      return {
        generatedImage,
        dogName: p.dogName,
        portraitId: portraitRecord?.id,
        editCount: portraitRecord ? portraitRecord.editCount : null,
        maxEdits: MAX_EDITS_PER_IMAGE,
        isNewPortrait: p.isNewPortrait,
        hasPreviousImage: !!(portraitRecord as any)?.previousImageUrl,
      };
    }

    if (job.type === "edit") {
      const editedImageRaw = await editImage(p.imageForEdit, p.editPrompt);

      let editedImage = editedImageRaw;
      try {
        const fname = `portrait-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.png`;
        editedImage = await uploadToStorage(editedImageRaw, "portraits", fname);
      } catch (err) {
        console.error("[storage-upload] Edited portrait upload failed, using base64 fallback:", err);
      }

      let editCount: number | null = null;
      if (p.portraitId) {
        const existing = await storage.getPortrait(p.portraitId);
        await storage.updatePortrait(p.portraitId, {
          previousImageUrl: existing?.generatedImageUrl || null,
          generatedImageUrl: editedImage,
        });
        await storage.incrementPortraitEditCount(p.portraitId);
        const updated = await storage.getPortrait(p.portraitId);
        editCount = updated?.editCount ?? null;
      }

      return {
        editedImage,
        editCount,
        maxEdits: MAX_EDITS_PER_IMAGE,
        hasPreviousImage: true,
      };
    }

    throw new Error(`Unknown job type: ${job.type}`);
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

  app.get("/api/dogs/:dogId/portraits", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const dogId = parseInt(req.params.dogId as string);
      if (isNaN(dogId)) return res.status(400).json({ error: "Invalid pet ID" });
      const userId = getUserId(req);
      const userEmail = getUserEmail(req);
      const userIsAdmin = userEmail === ADMIN_EMAIL;

      const dog = await storage.getDog(dogId);
      if (!dog) return res.status(404).json({ error: "Pet not found" });

      if (!userIsAdmin) {
        const userOrg = await storage.getOrganizationByOwner(userId);
        if (!userOrg || userOrg.id !== dog.organizationId) {
          return res.status(403).json({ error: "Access denied" });
        }
      }

      const dogPortraits = await storage.getPortraitsByDog(dogId);
      res.json(dogPortraits);
    } catch (error) {
      console.error("Error fetching portraits:", error);
      res.status(500).json({ error: "Failed to fetch portraits" });
    }
  });

  // POST /api/generate-portrait — ASYNC: returns jobId immediately
  app.post("/api/generate-portrait", isAuthenticated, aiRateLimiter, async (req: any, res: Response) => {
    try {
      const userId = getUserId(req);
      const userEmail = getUserEmail(req);
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

      // Enqueue the generation job — returns instantly
      const jobId = enqueue("generate", {
        prompt: sanitizedPrompt,
        originalImage: originalImage || null,
        dogName: dogName ? sanitizeForPrompt(dogName) : dogName,
        dogId: dogId ? parseInt(dogId) : null,
        styleId: styleId ? parseInt(styleId) : null,
        orgId: org.id,
        existingPortrait: existingPortrait ? {
          id: existingPortrait.id,
          editCount: existingPortrait.editCount,
          generatedImageUrl: existingPortrait.generatedImageUrl,
        } : null,
        isNewPortrait,
      }, 1, userId);

      res.status(202).json({ jobId });
    } catch (error) {
      console.error("[generate-portrait]", error);
      res.status(500).json({ error: "Failed to start portrait generation. Please try again." });
    }
  });

  // POST /api/edit-portrait — ASYNC: returns jobId immediately
  app.post("/api/edit-portrait", isAuthenticated, aiRateLimiter, async (req: any, res: Response) => {
    try {
      const userId = getUserId(req);
      const userEmail = getUserEmail(req);
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

      // If currentImage is a URL (from Storage), fetch and convert to data URI for Gemini
      let imageForEdit = currentImage;
      if (!isDataUri(currentImage)) {
        const buf = await fetchImageAsBuffer(currentImage);
        imageForEdit = `data:image/png;base64,${buf.toString('base64')}`;
      }

      // Enqueue the edit job — returns instantly
      const jobId = enqueue("edit", {
        imageForEdit,
        editPrompt: sanitizedEditPrompt,
        portraitId: portraitId ? parseInt(portraitId) : null,
      }, 1, userId);

      res.status(202).json({ jobId });
    } catch (error) {
      console.error("[edit-portrait]", error);
      res.status(500).json({ error: "Failed to start portrait edit. Please try again." });
    }
  });

  // POST /api/revert-portrait — stays synchronous (no Gemini call)
  app.post("/api/revert-portrait", isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = getUserId(req);
      const userEmail = getUserEmail(req);
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
}
