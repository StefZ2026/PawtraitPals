import type { Express } from "express";
import { type Server } from "http";
import { registerAuthRoutes } from "./auth";
import { apiRateLimiter } from "./routes/helpers";
import { runStartupHealthCheck } from "./routes/startup";
import { registerPublicRoutes } from "./routes/public";
import { registerOrganizationRoutes } from "./routes/organizations";
import { registerDogRoutes } from "./routes/dogs";
import { registerPortraitRoutes } from "./routes/portraits";
import { registerPlansBillingRoutes } from "./routes/plans-billing";
import { registerAdminRoutes } from "./routes/admin";
import { registerSmsRoutes } from "./routes/sms";
import { registerInstagramRoutes } from "./routes/instagram";
import { registerInstagramNativeRoutes } from "./routes/instagram-native";
import { registerImportRoutes } from "./routes/import";
import { registerGdprRoutes } from "./routes/gdpr";
import { registerJobRoutes } from "./routes/jobs";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Auth routes (signup, login token validation)
  registerAuthRoutes(app);

  // Non-blocking startup health checks (admin ownership, Stripe sync, sequences, credits)
  (async () => { await runStartupHealthCheck(); })();

  // Global API rate limiter
  app.use("/api/", apiRateLimiter);

  // Route modules
  registerPublicRoutes(app);
  registerOrganizationRoutes(app);
  registerDogRoutes(app);
  registerPortraitRoutes(app);
  registerPlansBillingRoutes(app);
  registerAdminRoutes(app);
  registerSmsRoutes(app);
  registerInstagramRoutes(app);
  registerInstagramNativeRoutes(app);
  await registerImportRoutes(app);
  registerGdprRoutes(app);
  registerJobRoutes(app);

  return httpServer;
}
