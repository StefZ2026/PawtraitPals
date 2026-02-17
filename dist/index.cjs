"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc2) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc2 = __getOwnPropDesc(from, key)) || desc2.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// vite.config.ts
var import_vite, import_plugin_react, import_path3, import_meta2, vite_config_default;
var init_vite_config = __esm({
  "vite.config.ts"() {
    "use strict";
    import_vite = require("vite");
    import_plugin_react = __toESM(require("@vitejs/plugin-react"), 1);
    import_path3 = __toESM(require("path"), 1);
    import_meta2 = {};
    vite_config_default = (0, import_vite.defineConfig)({
      plugins: [
        (0, import_plugin_react.default)()
      ],
      resolve: {
        alias: {
          "@": import_path3.default.resolve(import_meta2.dirname, "client", "src"),
          "@shared": import_path3.default.resolve(import_meta2.dirname, "shared"),
          "@assets": import_path3.default.resolve(import_meta2.dirname, "attached_assets")
        }
      },
      root: import_path3.default.resolve(import_meta2.dirname, "client"),
      build: {
        outDir: import_path3.default.resolve(import_meta2.dirname, "dist/public"),
        emptyOutDir: true
      },
      server: {
        fs: {
          strict: true,
          deny: ["**/.*"]
        }
      }
    });
  }
});

// server/vite.ts
var vite_exports = {};
__export(vite_exports, {
  setupVite: () => setupVite
});
async function setupVite(server, app2) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server, path: "/vite-hmr" },
    allowedHosts: true
  };
  const vite = await (0, import_vite2.createServer)({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("/{*path}", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = import_path4.default.resolve(
        import_meta3.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await import_fs3.default.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${(0, import_nanoid.nanoid)()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
var import_vite2, import_fs3, import_path4, import_nanoid, import_meta3, viteLogger;
var init_vite = __esm({
  "server/vite.ts"() {
    "use strict";
    import_vite2 = require("vite");
    init_vite_config();
    import_fs3 = __toESM(require("fs"), 1);
    import_path4 = __toESM(require("path"), 1);
    import_nanoid = require("nanoid");
    import_meta3 = {};
    viteLogger = (0, import_vite2.createLogger)();
  }
});

// server/index.ts
var index_exports = {};
__export(index_exports, {
  log: () => log
});
module.exports = __toCommonJS(index_exports);
var import_express2 = __toESM(require("express"), 1);
var import_helmet = __toESM(require("helmet"), 1);

// server/db.ts
var import_pg = require("pg");
var import_node_postgres = require("drizzle-orm/node-postgres");

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  dogs: () => dogs,
  insertDogSchema: () => insertDogSchema,
  insertOrganizationSchema: () => insertOrganizationSchema,
  insertPortraitSchema: () => insertPortraitSchema,
  insertPortraitStyleSchema: () => insertPortraitStyleSchema,
  insertSubscriptionPlanSchema: () => insertSubscriptionPlanSchema,
  organizations: () => organizations,
  portraitStyles: () => portraitStyles,
  portraits: () => portraits,
  subscriptionPlans: () => subscriptionPlans,
  users: () => users
});
var import_drizzle_orm2 = require("drizzle-orm");
var import_pg_core2 = require("drizzle-orm/pg-core");
var import_drizzle_zod = require("drizzle-zod");

// shared/models/auth.ts
var import_drizzle_orm = require("drizzle-orm");
var import_pg_core = require("drizzle-orm/pg-core");
var users = (0, import_pg_core.pgTable)("users", {
  id: (0, import_pg_core.varchar)("id").primaryKey().default(import_drizzle_orm.sql`gen_random_uuid()`),
  email: (0, import_pg_core.varchar)("email").unique(),
  firstName: (0, import_pg_core.varchar)("first_name"),
  lastName: (0, import_pg_core.varchar)("last_name"),
  profileImageUrl: (0, import_pg_core.varchar)("profile_image_url"),
  createdAt: (0, import_pg_core.timestamp)("created_at").defaultNow(),
  updatedAt: (0, import_pg_core.timestamp)("updated_at").defaultNow()
});

// shared/schema.ts
var subscriptionPlans = (0, import_pg_core2.pgTable)("subscription_plans", {
  id: (0, import_pg_core2.serial)("id").primaryKey(),
  name: (0, import_pg_core2.text)("name").notNull(),
  description: (0, import_pg_core2.text)("description"),
  priceMonthly: (0, import_pg_core2.integer)("price_monthly").notNull(),
  // in cents
  dogsLimit: (0, import_pg_core2.integer)("dogs_limit"),
  // max active pets allowed
  monthlyPortraitCredits: (0, import_pg_core2.integer)("monthly_portrait_credits").default(45),
  // portrait generations per month (edits are free)
  overagePriceCents: (0, import_pg_core2.integer)("overage_price_cents").default(400),
  // cost per additional portrait beyond credits
  trialDays: (0, import_pg_core2.integer)("trial_days").default(0),
  // trial period in days
  stripeProductId: (0, import_pg_core2.text)("stripe_product_id"),
  stripePriceId: (0, import_pg_core2.text)("stripe_price_id"),
  isActive: (0, import_pg_core2.boolean)("is_active").default(true).notNull(),
  createdAt: (0, import_pg_core2.timestamp)("created_at").default(import_drizzle_orm2.sql`CURRENT_TIMESTAMP`).notNull()
});
var organizations = (0, import_pg_core2.pgTable)("organizations", {
  id: (0, import_pg_core2.serial)("id").primaryKey(),
  name: (0, import_pg_core2.text)("name").notNull(),
  slug: (0, import_pg_core2.text)("slug").notNull().unique(),
  description: (0, import_pg_core2.text)("description"),
  websiteUrl: (0, import_pg_core2.text)("website_url"),
  logoUrl: (0, import_pg_core2.text)("logo_url"),
  contactName: (0, import_pg_core2.text)("contact_name"),
  contactEmail: (0, import_pg_core2.text)("contact_email"),
  contactPhone: (0, import_pg_core2.text)("contact_phone"),
  socialFacebook: (0, import_pg_core2.text)("social_facebook"),
  socialInstagram: (0, import_pg_core2.text)("social_instagram"),
  socialTwitter: (0, import_pg_core2.text)("social_twitter"),
  socialNextdoor: (0, import_pg_core2.text)("social_nextdoor"),
  billingStreet: (0, import_pg_core2.text)("billing_street"),
  billingCity: (0, import_pg_core2.text)("billing_city"),
  billingState: (0, import_pg_core2.text)("billing_state"),
  billingZip: (0, import_pg_core2.text)("billing_zip"),
  billingCountry: (0, import_pg_core2.text)("billing_country"),
  locationStreet: (0, import_pg_core2.text)("location_street"),
  locationCity: (0, import_pg_core2.text)("location_city"),
  locationState: (0, import_pg_core2.text)("location_state"),
  locationZip: (0, import_pg_core2.text)("location_zip"),
  locationCountry: (0, import_pg_core2.text)("location_country"),
  notes: (0, import_pg_core2.text)("notes"),
  speciesHandled: (0, import_pg_core2.text)("species_handled"),
  // dogs, cats, both — must be explicitly chosen during onboarding
  onboardingCompleted: (0, import_pg_core2.boolean)("onboarding_completed").default(false).notNull(),
  isActive: (0, import_pg_core2.boolean)("is_active").default(true).notNull(),
  ownerId: (0, import_pg_core2.varchar)("owner_id"),
  // References users.id (the org owner) — nullable for admin-created or unowned orgs
  planId: (0, import_pg_core2.integer)("plan_id").references(() => subscriptionPlans.id),
  stripeCustomerId: (0, import_pg_core2.text)("stripe_customer_id"),
  stripeSubscriptionId: (0, import_pg_core2.text)("stripe_subscription_id"),
  // stripeTestMode is managed via raw SQL (added by migration in seed.ts)
  // Read via storage.getOrganization which adds it, defaults to false (live mode)
  subscriptionStatus: (0, import_pg_core2.text)("subscription_status").default("trial"),
  // trial, active, past_due, canceled
  trialEndsAt: (0, import_pg_core2.timestamp)("trial_ends_at"),
  hasUsedFreeTrial: (0, import_pg_core2.boolean)("has_used_free_trial").default(false).notNull(),
  portraitsUsedThisMonth: (0, import_pg_core2.integer)("portraits_used_this_month").default(0).notNull(),
  additionalPetSlots: (0, import_pg_core2.integer)("additional_pet_slots").default(0).notNull(),
  pendingPlanId: (0, import_pg_core2.integer)("pending_plan_id"),
  billingCycleStart: (0, import_pg_core2.timestamp)("billing_cycle_start"),
  createdAt: (0, import_pg_core2.timestamp)("created_at").default(import_drizzle_orm2.sql`CURRENT_TIMESTAMP`).notNull()
});
var dogs = (0, import_pg_core2.pgTable)("dogs", {
  id: (0, import_pg_core2.serial)("id").primaryKey(),
  organizationId: (0, import_pg_core2.integer)("organization_id").notNull().references(() => organizations.id, { onDelete: "cascade" }),
  name: (0, import_pg_core2.text)("name").notNull(),
  species: (0, import_pg_core2.text)("species").default("dog").notNull(),
  // dog or cat
  breed: (0, import_pg_core2.text)("breed"),
  age: (0, import_pg_core2.text)("age"),
  description: (0, import_pg_core2.text)("description"),
  originalPhotoUrl: (0, import_pg_core2.text)("original_photo_url"),
  adoptionUrl: (0, import_pg_core2.text)("adoption_url"),
  isAvailable: (0, import_pg_core2.boolean)("is_available").default(true).notNull(),
  createdAt: (0, import_pg_core2.timestamp)("created_at").default(import_drizzle_orm2.sql`CURRENT_TIMESTAMP`).notNull()
});
var portraitStyles = (0, import_pg_core2.pgTable)("portrait_styles", {
  id: (0, import_pg_core2.serial)("id").primaryKey(),
  name: (0, import_pg_core2.text)("name").notNull(),
  description: (0, import_pg_core2.text)("description").notNull(),
  promptTemplate: (0, import_pg_core2.text)("prompt_template").notNull(),
  previewImageUrl: (0, import_pg_core2.text)("preview_image_url"),
  category: (0, import_pg_core2.text)("category").notNull()
});
var portraits = (0, import_pg_core2.pgTable)("portraits", {
  id: (0, import_pg_core2.serial)("id").primaryKey(),
  dogId: (0, import_pg_core2.integer)("dog_id").notNull().references(() => dogs.id, { onDelete: "cascade" }),
  styleId: (0, import_pg_core2.integer)("style_id").notNull().references(() => portraitStyles.id),
  generatedImageUrl: (0, import_pg_core2.text)("generated_image_url"),
  previousImageUrl: (0, import_pg_core2.text)("previous_image_url"),
  isSelected: (0, import_pg_core2.boolean)("is_selected").default(false).notNull(),
  editCount: (0, import_pg_core2.integer)("edit_count").default(0).notNull(),
  createdAt: (0, import_pg_core2.timestamp)("created_at").default(import_drizzle_orm2.sql`CURRENT_TIMESTAMP`).notNull()
});
var insertSubscriptionPlanSchema = (0, import_drizzle_zod.createInsertSchema)(subscriptionPlans).omit({
  id: true,
  createdAt: true
});
var insertOrganizationSchema = (0, import_drizzle_zod.createInsertSchema)(organizations).omit({
  id: true,
  createdAt: true
});
var insertDogSchema = (0, import_drizzle_zod.createInsertSchema)(dogs).omit({
  id: true,
  createdAt: true
});
var insertPortraitStyleSchema = (0, import_drizzle_zod.createInsertSchema)(portraitStyles).omit({
  id: true
});
var insertPortraitSchema = (0, import_drizzle_zod.createInsertSchema)(portraits).omit({
  id: true,
  createdAt: true
});

// server/db.ts
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set");
}
function parseDbUrl(url) {
  try {
    const parsed = new URL(url);
    return {
      user: decodeURIComponent(parsed.username),
      password: decodeURIComponent(parsed.password),
      host: parsed.hostname,
      port: parseInt(parsed.port) || 5432,
      database: parsed.pathname.slice(1) || "postgres"
    };
  } catch {
    return { connectionString: url };
  }
}
var dbConfig = parseDbUrl(process.env.DATABASE_URL);
var pool = new import_pg.Pool({
  ...dbConfig,
  ssl: { rejectUnauthorized: false }
});
var db = (0, import_node_postgres.drizzle)(pool, { schema: schema_exports });

// server/storage.ts
var import_drizzle_orm3 = require("drizzle-orm");
var DatabaseStorage = class {
  // Users
  async getUser(id) {
    const [user] = await db.select().from(users).where((0, import_drizzle_orm3.eq)(users.id, id));
    return user;
  }
  async getAllUsers() {
    return db.select().from(users);
  }
  // Subscription Plans
  async getSubscriptionPlan(id) {
    const [plan] = await db.select().from(subscriptionPlans).where((0, import_drizzle_orm3.eq)(subscriptionPlans.id, id));
    return plan;
  }
  async getAllSubscriptionPlans() {
    return db.select().from(subscriptionPlans).where((0, import_drizzle_orm3.eq)(subscriptionPlans.isActive, true));
  }
  async updateSubscriptionPlan(id, data) {
    await db.update(subscriptionPlans).set(data).where((0, import_drizzle_orm3.eq)(subscriptionPlans.id, id));
  }
  // Organizations
  async getOrganization(id) {
    const [org] = await db.select().from(organizations).where((0, import_drizzle_orm3.eq)(organizations.id, id));
    return org;
  }
  async getOrganizationBySlug(slug) {
    const [org] = await db.select().from(organizations).where((0, import_drizzle_orm3.eq)(organizations.slug, slug));
    return org;
  }
  async getOrganizationByOwner(ownerId) {
    const [org] = await db.select().from(organizations).where((0, import_drizzle_orm3.eq)(organizations.ownerId, ownerId));
    return org;
  }
  async getAllOrganizations() {
    return db.select().from(organizations).orderBy((0, import_drizzle_orm3.desc)(organizations.createdAt));
  }
  async createOrganization(org) {
    const [created] = await db.insert(organizations).values(org).returning();
    return created;
  }
  async updateOrganization(id, org) {
    const [updated] = await db.update(organizations).set(org).where((0, import_drizzle_orm3.eq)(organizations.id, id)).returning();
    return updated;
  }
  async updateOrganizationStripeInfo(id, stripeInfo) {
    const { stripeTestMode, ...drizzleFields } = stripeInfo;
    if (Object.keys(drizzleFields).length > 0) {
      await db.update(organizations).set(drizzleFields).where((0, import_drizzle_orm3.eq)(organizations.id, id));
    }
    if (stripeTestMode !== void 0) {
      try {
        await pool.query("UPDATE organizations SET stripe_test_mode = $1 WHERE id = $2", [stripeTestMode, id]);
      } catch (e) {
        console.warn("[stripe] Could not set stripeTestMode:", e.message);
      }
    }
    const [updated] = await db.select().from(organizations).where((0, import_drizzle_orm3.eq)(organizations.id, id));
    return updated;
  }
  async getOrgStripeTestMode(orgId) {
    try {
      const result = await pool.query("SELECT stripe_test_mode FROM organizations WHERE id = $1", [orgId]);
      return result.rows[0]?.stripe_test_mode ?? true;
    } catch {
      return true;
    }
  }
  async clearOrganizationOwner(id) {
    await db.update(organizations).set({ ownerId: null }).where((0, import_drizzle_orm3.eq)(organizations.id, id));
  }
  async deleteOrganization(id) {
    await db.delete(organizations).where((0, import_drizzle_orm3.eq)(organizations.id, id));
  }
  // Dogs
  async getDog(id) {
    const [dog] = await db.select().from(dogs).where((0, import_drizzle_orm3.eq)(dogs.id, id));
    return dog;
  }
  async getDogsByOrganization(orgId) {
    return db.select().from(dogs).where((0, import_drizzle_orm3.eq)(dogs.organizationId, orgId)).orderBy((0, import_drizzle_orm3.desc)(dogs.createdAt));
  }
  async getAllDogs() {
    return db.select().from(dogs).orderBy((0, import_drizzle_orm3.desc)(dogs.createdAt));
  }
  async createDog(dog) {
    const [created] = await db.insert(dogs).values(dog).returning();
    return created;
  }
  async updateDog(id, dog) {
    const [updated] = await db.update(dogs).set(dog).where((0, import_drizzle_orm3.eq)(dogs.id, id)).returning();
    return updated;
  }
  async deleteDog(id) {
    await db.delete(dogs).where((0, import_drizzle_orm3.eq)(dogs.id, id));
  }
  // Portrait Styles
  async getPortraitStyle(id) {
    const [style] = await db.select().from(portraitStyles).where((0, import_drizzle_orm3.eq)(portraitStyles.id, id));
    return style;
  }
  async getAllPortraitStyles() {
    return db.select().from(portraitStyles);
  }
  // Portraits
  async getPortrait(id) {
    const [portrait] = await db.select().from(portraits).where((0, import_drizzle_orm3.eq)(portraits.id, id));
    return portrait;
  }
  async getPortraitByDogAndStyle(dogId, styleId) {
    const [portrait] = await db.select().from(portraits).where((0, import_drizzle_orm3.and)((0, import_drizzle_orm3.eq)(portraits.dogId, dogId), (0, import_drizzle_orm3.eq)(portraits.styleId, styleId)));
    return portrait;
  }
  async getPortraitsByDog(dogId) {
    return db.select().from(portraits).where((0, import_drizzle_orm3.eq)(portraits.dogId, dogId)).orderBy((0, import_drizzle_orm3.desc)(portraits.createdAt));
  }
  async getSelectedPortraitByDog(dogId) {
    const [selected] = await db.select().from(portraits).where((0, import_drizzle_orm3.and)((0, import_drizzle_orm3.eq)(portraits.dogId, dogId), (0, import_drizzle_orm3.eq)(portraits.isSelected, true))).orderBy((0, import_drizzle_orm3.desc)(portraits.createdAt)).limit(1);
    if (selected) return selected;
    const [fallback] = await db.select().from(portraits).where((0, import_drizzle_orm3.eq)(portraits.dogId, dogId)).orderBy((0, import_drizzle_orm3.desc)(portraits.createdAt)).limit(1);
    return fallback;
  }
  async createPortrait(portrait) {
    const [created] = await db.insert(portraits).values(portrait).returning();
    return created;
  }
  async updatePortrait(id, portrait) {
    const [updated] = await db.update(portraits).set(portrait).where((0, import_drizzle_orm3.eq)(portraits.id, id)).returning();
    return updated;
  }
  async selectPortraitForGallery(dogId, portraitId) {
    await db.transaction(async (tx) => {
      await tx.update(portraits).set({ isSelected: false }).where((0, import_drizzle_orm3.eq)(portraits.dogId, dogId));
      await tx.update(portraits).set({ isSelected: true }).where((0, import_drizzle_orm3.and)((0, import_drizzle_orm3.eq)(portraits.id, portraitId), (0, import_drizzle_orm3.eq)(portraits.dogId, dogId)));
    });
  }
  async incrementPortraitEditCount(portraitId) {
    await db.update(portraits).set({ editCount: import_drizzle_orm3.sql`COALESCE(${portraits.editCount}, 0) + 1` }).where((0, import_drizzle_orm3.eq)(portraits.id, portraitId));
  }
  async incrementOrgPortraitsUsed(orgId) {
    await db.update(organizations).set({ portraitsUsedThisMonth: import_drizzle_orm3.sql`COALESCE(${organizations.portraitsUsedThisMonth}, 0) + 1` }).where((0, import_drizzle_orm3.eq)(organizations.id, orgId));
  }
  async getAccurateCreditsUsed(orgId) {
    const [org] = await db.select().from(organizations).where((0, import_drizzle_orm3.eq)(organizations.id, orgId));
    if (!org) return { creditsUsed: 0, billingCycleStart: null };
    const now = /* @__PURE__ */ new Date();
    let effectiveCycleStart = org.billingCycleStart;
    if (effectiveCycleStart && org.createdAt && effectiveCycleStart > org.createdAt) {
      effectiveCycleStart = org.createdAt;
    }
    if (effectiveCycleStart) {
      const cycleMonth = effectiveCycleStart.getMonth();
      const cycleYear = effectiveCycleStart.getFullYear();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();
      if (cycleMonth !== currentMonth || cycleYear !== currentYear) {
        effectiveCycleStart = new Date(currentYear, currentMonth, effectiveCycleStart.getDate());
        if (effectiveCycleStart > now) {
          effectiveCycleStart = new Date(currentYear, currentMonth, 1);
        }
      }
    } else {
      effectiveCycleStart = org.createdAt || now;
    }
    const rows = await db.select({ count: import_drizzle_orm3.sql`count(*)` }).from(portraits).innerJoin(dogs, (0, import_drizzle_orm3.eq)(portraits.dogId, dogs.id)).where(
      (0, import_drizzle_orm3.and)(
        (0, import_drizzle_orm3.eq)(dogs.organizationId, orgId),
        (0, import_drizzle_orm3.gte)(portraits.createdAt, effectiveCycleStart)
      )
    );
    const creditsUsed = Number(rows[0]?.count ?? 0);
    return { creditsUsed, billingCycleStart: effectiveCycleStart };
  }
  async syncOrgCredits(orgId) {
    const { creditsUsed, billingCycleStart } = await this.getAccurateCreditsUsed(orgId);
    const [org] = await db.select().from(organizations).where((0, import_drizzle_orm3.eq)(organizations.id, orgId));
    if (!org) return void 0;
    const updates = {};
    if (org.portraitsUsedThisMonth !== creditsUsed) {
      updates.portraitsUsedThisMonth = creditsUsed;
    }
    if (billingCycleStart && (!org.billingCycleStart || org.billingCycleStart.getTime() !== billingCycleStart.getTime())) {
      updates.billingCycleStart = billingCycleStart;
    }
    if (Object.keys(updates).length > 0) {
      const [updated] = await db.update(organizations).set(updates).where((0, import_drizzle_orm3.eq)(organizations.id, orgId)).returning();
      return updated;
    }
    return org;
  }
  async recalculateAllOrgCredits() {
    const allOrgs = await db.select().from(organizations);
    const results = [];
    for (const org of allOrgs) {
      const { creditsUsed, billingCycleStart } = await this.getAccurateCreditsUsed(org.id);
      const updates = {};
      if (creditsUsed !== org.portraitsUsedThisMonth) {
        updates.portraitsUsedThisMonth = creditsUsed;
      }
      if (billingCycleStart && (!org.billingCycleStart || org.billingCycleStart.getTime() !== billingCycleStart.getTime())) {
        updates.billingCycleStart = billingCycleStart;
      }
      if (Object.keys(updates).length > 0) {
        await db.update(organizations).set(updates).where((0, import_drizzle_orm3.eq)(organizations.id, org.id));
        if (creditsUsed !== org.portraitsUsedThisMonth) {
          results.push({ orgId: org.id, name: org.name, old: org.portraitsUsedThisMonth, new: creditsUsed });
        }
      }
    }
    return results;
  }
  async repairSequences() {
    const fixes = [];
    const tables = [
      { table: "organizations", seq: "organizations_id_seq" },
      { table: "dogs", seq: "dogs_id_seq" },
      { table: "portraits", seq: "portraits_id_seq" },
      { table: "portrait_styles", seq: "portrait_styles_id_seq" },
      { table: "subscription_plans", seq: "subscription_plans_id_seq" }
    ];
    for (const { table, seq } of tables) {
      await db.execute(import_drizzle_orm3.sql.raw(
        `SELECT setval('${seq}', GREATEST((SELECT COALESCE(MAX(id), 0) FROM ${table}), 1))`
      ));
      const maxResult = await db.execute(import_drizzle_orm3.sql.raw(`SELECT MAX(id) as max_id FROM ${table}`));
      const seqResult = await db.execute(import_drizzle_orm3.sql.raw(`SELECT last_value FROM ${seq}`));
      const maxId = Number(maxResult.rows?.[0]?.max_id ?? 0);
      const seqVal = Number(seqResult.rows?.[0]?.last_value ?? 0);
      if (seqVal > 0 && maxId > 0 && seqVal === maxId) {
        fixes.push(`${table}: sequence synced to ${maxId}`);
      }
    }
    return fixes;
  }
};
var storage = new DatabaseStorage();

// server/routes.ts
var import_zod = require("zod");

// server/gemini.ts
var import_genai = require("@google/genai");
var ai = new import_genai.GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});
function extractImageFromResponse(response) {
  const part = response.candidates?.[0]?.content?.parts?.find(
    (p) => p.inlineData
  );
  if (!part?.inlineData?.data) return null;
  const mime = part.inlineData.mimeType || "image/png";
  return `data:${mime};base64,${part.inlineData.data}`;
}
function parseBase64(dataUrl) {
  const data = dataUrl.includes(",") ? dataUrl.split(",")[1] : dataUrl;
  const mimeType = (dataUrl.match(/data:([^;]+);/) || [])[1] || "image/jpeg";
  return { mimeType, data };
}
async function generateImage(prompt, sourceImage) {
  if (sourceImage) {
    try {
      const result = await generateWithImage(prompt, sourceImage);
      if (result) return result;
    } catch {
    }
  }
  return generateTextOnly(prompt);
}
async function generateWithImage(prompt, sourceImage) {
  const { mimeType, data } = parseBase64(sourceImage);
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-image",
    contents: [{ role: "user", parts: [{ inlineData: { mimeType, data } }, { text: prompt }] }],
    config: { responseModalities: [import_genai.Modality.TEXT, import_genai.Modality.IMAGE] }
  });
  return extractImageFromResponse(response);
}
async function generateTextOnly(prompt) {
  for (let attempt = 0; attempt < 2; attempt++) {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: { responseModalities: [import_genai.Modality.TEXT, import_genai.Modality.IMAGE] }
    });
    const result = extractImageFromResponse(response);
    if (result) return result;
  }
  throw new Error("Failed to generate image after retries");
}
async function editImage(currentImage, editPrompt) {
  const { mimeType, data } = parseBase64(currentImage);
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-image",
    contents: [{
      role: "user",
      parts: [
        { inlineData: { mimeType, data } },
        { text: `Edit this image: ${editPrompt}. Keep the same overall style and subject, just apply the requested modifications.` }
      ]
    }],
    config: { responseModalities: [import_genai.Modality.TEXT, import_genai.Modality.IMAGE] }
  });
  const result = extractImageFromResponse(response);
  if (!result) throw new Error("Failed to edit image");
  return result;
}

// server/auth.ts
var import_supabase_js = require("@supabase/supabase-js");

// server/auth-storage.ts
var import_drizzle_orm4 = require("drizzle-orm");
var AuthStorage = class {
  async getUser(id) {
    const [user] = await db.select().from(users).where((0, import_drizzle_orm4.eq)(users.id, id));
    return user;
  }
  async upsertUser(userData) {
    if (userData.id) {
      const existingById = await this.getUser(userData.id);
      if (existingById) {
        const [updated] = await db.update(users).set({ ...userData, updatedAt: /* @__PURE__ */ new Date() }).where((0, import_drizzle_orm4.eq)(users.id, userData.id)).returning();
        return updated;
      }
    }
    if (userData.email) {
      const [existingByEmail] = await db.select().from(users).where((0, import_drizzle_orm4.eq)(users.email, userData.email));
      if (existingByEmail) {
        const [updated] = await db.update(users).set({ ...userData, updatedAt: /* @__PURE__ */ new Date() }).where((0, import_drizzle_orm4.eq)(users.email, userData.email)).returning();
        return updated;
      }
    }
    try {
      const [user] = await db.insert(users).values(userData).returning();
      return user;
    } catch (e) {
      if (e?.code === "23505" && userData.email) {
        const [existingByEmail] = await db.select().from(users).where((0, import_drizzle_orm4.eq)(users.email, userData.email));
        if (existingByEmail) {
          const { id: _ignoreId, ...mutableFields } = userData;
          const [updated] = await db.update(users).set({ ...mutableFields, updatedAt: /* @__PURE__ */ new Date() }).where((0, import_drizzle_orm4.eq)(users.email, userData.email)).returning();
          return updated;
        }
      }
      throw e;
    }
  }
};
var authStorage = new AuthStorage();

// server/auth.ts
var supabaseUrl = process.env.SUPABASE_URL;
var supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
var supabase = (0, import_supabase_js.createClient)(supabaseUrl, supabaseServiceKey);
var recentUsers = /* @__PURE__ */ new Map();
var CACHE_TTL = 5 * 60 * 1e3;
var isAuthenticated = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const token = authHeader.substring(7);
  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.user = {
      claims: {
        sub: user.id,
        email: user.email
      },
      access_token: token
    };
    const now = Date.now();
    const lastSeen = recentUsers.get(user.id);
    if (!lastSeen || now - lastSeen > CACHE_TTL) {
      await authStorage.upsertUser({
        id: user.id,
        email: user.email || null,
        firstName: user.user_metadata?.first_name || user.user_metadata?.full_name?.split(" ")[0] || null,
        lastName: user.user_metadata?.last_name || user.user_metadata?.full_name?.split(" ").slice(1).join(" ") || null,
        profileImageUrl: user.user_metadata?.avatar_url || null
      });
      recentUsers.set(user.id, now);
    }
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};
function registerAuthRoutes(app2) {
  app2.get("/api/auth/user", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await authStorage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });
  app2.post("/api/auth/signup", async (req, res) => {
    try {
      const { email, password, firstName, lastName } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
      }
      if (password.length < 6) {
        return res.status(400).json({ error: "Password must be at least 6 characters" });
      }
      const { data, error } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          first_name: firstName || "",
          last_name: lastName || ""
        }
      });
      if (error) {
        console.error("Signup error:", error.message);
        return res.status(400).json({ error: error.message });
      }
      res.json({ user: { id: data.user.id, email: data.user.email } });
    } catch (error) {
      console.error("Signup error:", error);
      res.status(500).json({ error: "Failed to create account" });
    }
  });
}

// server/stripeClient.ts
var import_stripe = __toESM(require("stripe"), 1);
var testStripe = new import_stripe.default(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-11-17.clover"
});
var liveStripe = new import_stripe.default(process.env.STRIPE_LIVE_SECRET_KEY, {
  apiVersion: "2025-11-17.clover"
});
function getStripeClient(testMode) {
  return testMode === false ? liveStripe : testStripe;
}
function getStripePublishableKey(testMode) {
  return testMode === false ? process.env.STRIPE_LIVE_PUBLISHABLE_KEY : process.env.STRIPE_PUBLISHABLE_KEY;
}
function getWebhookSecret(testMode) {
  return testMode === false ? process.env.STRIPE_LIVE_WEBHOOK_SECRET : process.env.STRIPE_WEBHOOK_SECRET;
}
var TEST_TO_LIVE_PRICE = {
  "price_1T1NpB2LfX3IuyBIb44I2uwq": "price_1SxgIU2LfX3IuyBI3iXCfRn5",
  // Starter $39
  "price_1T1NpC2LfX3IuyBIBj9Mdx3f": "price_1SxgIU2LfX3IuyBIbG1jtLcC",
  // Professional $79
  "price_1T1NpC2LfX3IuyBIPtezJkZ0": "price_1SxgIU2LfX3IuyBIUy4rwplJ"
  // Executive $349
};
function getPriceId(priceId, testMode) {
  if (testMode === false) return TEST_TO_LIVE_PRICE[priceId] || priceId;
  return priceId;
}
var STRIPE_PLAN_PRICE_MAP = {
  // Test price IDs
  "price_1T1NpB2LfX3IuyBIb44I2uwq": { id: 6, name: "Starter" },
  "price_1T1NpC2LfX3IuyBIBj9Mdx3f": { id: 7, name: "Professional" },
  "price_1T1NpC2LfX3IuyBIPtezJkZ0": { id: 8, name: "Executive" },
  // Live price IDs
  "price_1SxgIU2LfX3IuyBI3iXCfRn5": { id: 6, name: "Starter" },
  "price_1SxgIU2LfX3IuyBIbG1jtLcC": { id: 7, name: "Professional" },
  "price_1SxgIU2LfX3IuyBIUy4rwplJ": { id: 8, name: "Executive" }
};
function mapStripeStatusToInternal(stripeStatus, currentStatus) {
  switch (stripeStatus) {
    case "active":
      return "active";
    case "trialing":
      return "trial";
    case "past_due":
      return "past_due";
    case "canceled":
    case "unpaid":
    case "incomplete":
    case "incomplete_expired":
    case "paused":
      return "canceled";
    default:
      return currentStatus || "inactive";
  }
}

// server/stripeService.ts
var cachedTestAddonPriceId = null;
var cachedLiveAddonPriceId = null;
function isTestMode(testMode) {
  return testMode !== false;
}
var StripeService = class {
  async createCustomer(email, orgId, organizationName, testMode) {
    const stripe = getStripeClient(testMode);
    return await stripe.customers.create({
      email,
      name: organizationName,
      metadata: { orgId: String(orgId), organizationName }
    });
  }
  async retrieveCustomer(customerId, testMode) {
    const stripe = getStripeClient(testMode);
    return await stripe.customers.retrieve(customerId);
  }
  async createCheckoutSession(customerId, priceId, successUrl, cancelUrl, testMode, trialDays, metadata) {
    const stripe = getStripeClient(testMode);
    const effectivePriceId = getPriceId(priceId, testMode);
    const sessionParams = {
      customer: customerId,
      payment_method_types: ["card"],
      line_items: [{ price: effectivePriceId, quantity: 1 }],
      mode: "subscription",
      success_url: successUrl,
      cancel_url: cancelUrl
    };
    if (trialDays && trialDays > 0) {
      sessionParams.subscription_data = {
        trial_period_days: trialDays
      };
    }
    if (metadata) {
      sessionParams.metadata = metadata;
    }
    return await stripe.checkout.sessions.create(sessionParams);
  }
  async createCustomerPortalSession(customerId, returnUrl, testMode) {
    const stripe = getStripeClient(testMode);
    return await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl
    });
  }
  async retrieveCheckoutSession(sessionId, testMode) {
    const stripe = getStripeClient(testMode);
    return await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["subscription"]
    });
  }
  async retrieveSubscription(subscriptionId, testMode) {
    const stripe = getStripeClient(testMode);
    return await stripe.subscriptions.retrieve(subscriptionId);
  }
  async getOrCreateAddonPriceId(testMode) {
    const test = isTestMode(testMode);
    const cached = test ? cachedTestAddonPriceId : cachedLiveAddonPriceId;
    if (cached) return cached;
    if (process.env.STRIPE_ADDON_PRICE_ID) {
      const val = process.env.STRIPE_ADDON_PRICE_ID;
      if (test) cachedTestAddonPriceId = val;
      else cachedLiveAddonPriceId = val;
      return val;
    }
    const stripe = getStripeClient(testMode);
    const products = await stripe.products.search({
      query: "metadata['type']:'pet_slot_addon'"
    });
    let product;
    if (products.data.length > 0) {
      product = products.data[0];
    } else {
      product = await stripe.products.create({
        name: "Extra Pet Slot",
        description: "Additional pet slot for your rescue organization ($3/month per slot)",
        metadata: { type: "pet_slot_addon" }
      });
    }
    const prices = await stripe.prices.list({
      product: product.id,
      active: true,
      type: "recurring"
    });
    let price = prices.data.find(
      (p) => p.unit_amount === 300 && p.recurring?.interval === "month"
    );
    if (!price) {
      price = await stripe.prices.create({
        product: product.id,
        unit_amount: 300,
        currency: "usd",
        recurring: { interval: "month" },
        metadata: { type: "pet_slot_addon" }
      });
    }
    if (test) cachedTestAddonPriceId = price.id;
    else cachedLiveAddonPriceId = price.id;
    return price.id;
  }
  async updateAddonSlots(subscriptionId, quantity, testMode) {
    const stripe = getStripeClient(testMode);
    const addonPriceId = await this.getOrCreateAddonPriceId(testMode);
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const existingItem = subscription.items.data.find((item) => {
      const priceId = typeof item.price === "string" ? item.price : item.price?.id;
      return priceId === addonPriceId;
    });
    if (quantity === 0 && existingItem) {
      await stripe.subscriptionItems.del(existingItem.id, {
        proration_behavior: "create_prorations"
      });
    } else if (quantity > 0 && existingItem) {
      await stripe.subscriptionItems.update(existingItem.id, {
        quantity,
        proration_behavior: "create_prorations"
      });
    } else if (quantity > 0 && !existingItem) {
      await stripe.subscriptionItems.create({
        subscription: subscriptionId,
        price: addonPriceId,
        quantity,
        proration_behavior: "create_prorations"
      });
    }
  }
  async removeAddonFromSubscription(subscriptionId, testMode) {
    const stripe = getStripeClient(testMode);
    const addonPriceId = await this.getOrCreateAddonPriceId(testMode);
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const existingItem = subscription.items.data.find((item) => {
      const priceId = typeof item.price === "string" ? item.price : item.price?.id;
      return priceId === addonPriceId;
    });
    if (existingItem) {
      await stripe.subscriptionItems.del(existingItem.id, {
        proration_behavior: "create_prorations"
      });
    }
  }
  async getAddonPriceId(testMode) {
    return this.getOrCreateAddonPriceId(testMode);
  }
  async scheduleDowngrade(subscriptionId, newPriceId, testMode) {
    const stripe = getStripeClient(testMode);
    const addonPriceId = await this.getOrCreateAddonPriceId(testMode);
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const mainItem = subscription.items.data.find((item) => {
      const priceId = typeof item.price === "string" ? item.price : item.price?.id;
      return priceId !== addonPriceId;
    }) || subscription.items.data[0];
    const effectivePriceId = getPriceId(newPriceId, testMode);
    await stripe.subscriptions.update(subscriptionId, {
      proration_behavior: "none",
      items: [{
        id: mainItem.id,
        price: effectivePriceId
      }],
      cancel_at_period_end: false
    });
    const periodEnd = new Date(subscription.current_period_end * 1e3);
    return { currentPeriodEnd: periodEnd };
  }
  async getSubscriptionPeriodEnd(subscriptionId, testMode) {
    const stripe = getStripeClient(testMode);
    try {
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      return new Date(subscription.current_period_end * 1e3);
    } catch {
      return null;
    }
  }
};
var stripeService = new StripeService();

// server/routes.ts
var import_express_rate_limit = __toESM(require("express-rate-limit"), 1);
var import_twilio = __toESM(require("twilio"), 1);

// server/content-filter.ts
var blockedWords = [
  "ass",
  "asshole",
  "bastard",
  "bitch",
  "blowjob",
  "boob",
  "boobs",
  "butt",
  "cock",
  "crap",
  "cum",
  "cunt",
  "damn",
  "dick",
  "dildo",
  "douche",
  "fag",
  "fuck",
  "fucker",
  "fucking",
  "handjob",
  "hell",
  "hoe",
  "homo",
  "horny",
  "jerk",
  "milf",
  "mofo",
  "motherfucker",
  "naked",
  "nazi",
  "nigga",
  "nigger",
  "nude",
  "orgasm",
  "penis",
  "piss",
  "porn",
  "porno",
  "pussy",
  "rape",
  "rapist",
  "retard",
  "scrotum",
  "sex",
  "shit",
  "shitty",
  "slut",
  "smut",
  "sperm",
  "stripper",
  "tit",
  "tits",
  "titty",
  "twat",
  "vagina",
  "viagra",
  "vulva",
  "whore",
  "wanker",
  "xxx"
];
var leetMap = {
  "0": "o",
  "1": "i",
  "3": "e",
  "4": "a",
  "5": "s",
  "7": "t",
  "@": "a",
  "$": "s",
  "!": "i",
  "*": "",
  "+": "t"
};
function normalizeLeet(text2) {
  return text2.split("").map((c) => leetMap[c] || c).join("");
}
function normalizeText(text2) {
  let n = text2.toLowerCase();
  n = normalizeLeet(n);
  n = n.replace(/[^a-z]/g, "");
  return n;
}
var blockedPatterns = blockedWords.map((w) => new RegExp(`\\b${w}\\b`, "i"));
function containsInappropriateLanguage(text2) {
  if (blockedPatterns.some((p) => p.test(text2))) return true;
  const stripped = text2.toLowerCase().replace(/[^a-z\s]/g, "");
  if (blockedPatterns.some((p) => p.test(stripped))) return true;
  const normalized = normalizeText(text2);
  if (blockedWords.some((w) => normalized.includes(w))) return true;
  const spaceless = text2.toLowerCase().replace(/[\s._\-*!@#$%^&()]/g, "");
  if (blockedWords.some((w) => spaceless.includes(w))) return true;
  return false;
}

// server/generate-mockups.ts
var import_sharp = __toESM(require("sharp"), 1);
var WIDTH = 1200;
var HEIGHT = 630;
var CREAM_BG = { r: 253, g: 250, b: 245 };
var ORANGE = { r: 234, g: 121, b: 35 };
var DARK_TEXT = { r: 51, g: 38, b: 25 };
var MUTED_TEXT = { r: 120, g: 100, b: 80 };
function roundedRectSvg(w, h, r, fill) {
  return `<svg width="${w}" height="${h}"><rect x="0" y="0" width="${w}" height="${h}" rx="${r}" ry="${r}" fill="${fill}"/></svg>`;
}
function textSvg(text2, fontSize, color, maxWidth, fontWeight = "bold") {
  const escaped = text2.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${maxWidth}" height="${Math.round(fontSize * 1.4)}">
    <text x="0" y="${fontSize}" font-family="sans-serif" font-size="${fontSize}" font-weight="${fontWeight}" fill="${color}">${escaped}</text>
  </svg>`;
  return Buffer.from(svg);
}
function pawtraitPalsLogoSvg(height) {
  const iconSize = Math.round(height * 0.6);
  const fontSize = Math.round(height * 0.45);
  const textWidth = Math.ceil(fontSize * 0.6 * 13);
  const totalWidth = iconSize * 2 + 8 + textWidth + 8;
  const orange = `rgb(${ORANGE.r},${ORANGE.g},${ORANGE.b})`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="${height}">
    <g transform="translate(0, ${Math.round(height * 0.15)})">
      <svg x="0" y="0" width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="none" stroke="${orange}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M10 5.172C10 3.782 8.423 2.679 6.5 3c-2.823.47-4.113 6.006-4 7 .08.703 1.725 1.722 3.656 1 1.261-.472 1.96-1.45 2.344-2.5"/>
        <path d="M14.267 5.172c0-1.39 1.577-2.493 3.5-2.172 2.823.47 4.113 6.006 4 7-.08.703-1.725 1.722-3.656 1-1.261-.472-1.855-1.45-2.239-2.5"/>
        <path d="M8 14v.5"/>
        <path d="M16 14v.5"/>
        <path d="M11.25 16.25h1.5L12 17l-.75-.75Z"/>
        <path d="M4.42 11.247A13.152 13.152 0 0 0 4 14.556C4 18.728 7.582 21 12 21s8-2.272 8-6.444c0-1.061-.162-2.2-.493-3.309m-9.243-6.082A8.801 8.801 0 0 1 12 5c.78 0 1.5.108 2.161.306"/>
      </svg>
      <svg x="${iconSize + 2}" y="0" width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="none" stroke="${orange}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 5c.67 0 1.35.09 2 .26 1.78-2 5.03-2.2 6.71-.56 1.73 1.69 1.97 4.5.56 6.71a9.5 9.5 0 0 1 .03 5.09c-.27 1.61-1.54 2.84-3.3 2.84H6c-1.76 0-3.03-1.23-3.3-2.84A9.5 9.5 0 0 1 2.73 11.41C1.34 9.72 1.56 6.91 3.29 5.26 4.97 3.56 8.22 3.76 10 5.76A6.01 6.01 0 0 1 12 5Z"/>
        <path d="M8 14v.5"/>
        <path d="M16 14v.5"/>
        <path d="M11.25 16.25h1.5L12 17l-.75-.75Z"/>
      </svg>
    </g>
    <text x="${iconSize * 2 + 10}" y="${Math.round(height * 0.65)}" font-family="Georgia, serif" font-size="${fontSize}" font-weight="bold" fill="${orange}">Pawtrait Pals</text>
  </svg>`;
  return { svg: Buffer.from(svg), width: totalWidth, height };
}
function pillSvg(text2, fontSize, bgColor, textColor, paddingX, paddingY) {
  const charWidth = fontSize * 0.6;
  const textWidth = Math.ceil(text2.length * charWidth);
  const width = textWidth + paddingX * 2;
  const height = Math.round(fontSize * 1.3) + paddingY * 2;
  const radius = height / 2;
  const escaped = text2.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
    <rect x="0" y="0" width="${width}" height="${height}" rx="${radius}" ry="${radius}" fill="${bgColor}"/>
    <text x="${width / 2}" y="${height / 2 + fontSize * 0.35}" font-family="sans-serif" font-size="${fontSize}" font-weight="bold" fill="${textColor}" text-anchor="middle">${escaped}</text>
  </svg>`;
  return { svg: Buffer.from(svg), width, height };
}
async function extractImageFromDataUri(dataUri) {
  const base64Data = dataUri.replace(/^data:image\/\w+;base64,/, "");
  return Buffer.from(base64Data, "base64");
}
async function resizeToFit(imageBuffer, maxW, maxH) {
  return (0, import_sharp.default)(imageBuffer).resize(maxW, maxH, { fit: "cover", position: "center" }).png().toBuffer();
}
async function makeRoundedImage(imageBuffer, w, h, radius) {
  const resized = await resizeToFit(imageBuffer, w, h);
  const mask = Buffer.from(
    `<svg width="${w}" height="${h}"><rect x="0" y="0" width="${w}" height="${h}" rx="${radius}" ry="${radius}" fill="white"/></svg>`
  );
  return (0, import_sharp.default)(resized).composite([{ input: mask, blend: "dest-in" }]).png().toBuffer();
}
async function generateShowcaseMockup(orgId) {
  const org = await storage.getOrganization(orgId);
  if (!org) throw new Error("Organization not found");
  const dogs2 = await storage.getDogsByOrganization(orgId);
  const dogsWithPortraits = [];
  for (const dog of dogs2) {
    const portrait = await storage.getSelectedPortraitByDog(dog.id);
    if (portrait && portrait.generatedImageUrl) {
      try {
        const buf = await extractImageFromDataUri(portrait.generatedImageUrl);
        dogsWithPortraits.push({
          name: dog.name,
          breed: dog.breed || "Unknown",
          species: dog.species || "dog",
          portraitBuffer: buf
        });
      } catch (e) {
      }
    }
  }
  const petCount = dogsWithPortraits.length;
  if (petCount === 0) throw new Error("No pets with portraits found");
  const petsToShow = dogsWithPortraits.slice(0, 4);
  const composites = [];
  const bg = await (0, import_sharp.default)({
    create: { width: WIDTH, height: HEIGHT, channels: 4, background: CREAM_BG }
  }).png().toBuffer();
  const topBar = await (0, import_sharp.default)(Buffer.from(roundedRectSvg(WIDTH, 6, 0, `rgb(${ORANGE.r},${ORANGE.g},${ORANGE.b})`))).png().toBuffer();
  composites.push({ input: topBar, top: 0, left: 0 });
  const orgLogoSize = 70;
  let orgLogoWidth = 0;
  if (org.logoUrl) {
    try {
      const orgLogoBuf = await extractImageFromDataUri(org.logoUrl);
      const orgLogo = await makeRoundedImage(orgLogoBuf, orgLogoSize, orgLogoSize, 8);
      composites.push({ input: orgLogo, top: 18, left: 30 });
      orgLogoWidth = orgLogoSize + 14;
    } catch (e) {
    }
  }
  const orgNameText = textSvg(org.name, 36, `rgb(${DARK_TEXT.r},${DARK_TEXT.g},${DARK_TEXT.b})`, 700);
  composites.push({ input: orgNameText, top: 25, left: 30 + orgLogoWidth });
  const adoptPill = pillSvg("Available for Adoption", 16, `rgb(${ORANGE.r},${ORANGE.g},${ORANGE.b})`, "white", 16, 8);
  composites.push({ input: adoptPill.svg, top: 70, left: 30 + orgLogoWidth });
  const portraitAreaTop = 130;
  const portraitAreaHeight = HEIGHT - portraitAreaTop - 60;
  const maxPortraitW = Math.floor((WIDTH - 60 - (petsToShow.length - 1) * 20) / petsToShow.length);
  const portraitImgH = portraitAreaHeight - 70;
  const portraitW = Math.min(maxPortraitW, 280);
  const totalWidth = petsToShow.length * portraitW + (petsToShow.length - 1) * 20;
  let startX = Math.floor((WIDTH - totalWidth) / 2);
  for (let i = 0; i < petsToShow.length; i++) {
    const pet = petsToShow[i];
    const x = startX + i * (portraitW + 20);
    const cardBg = await (0, import_sharp.default)(Buffer.from(roundedRectSvg(portraitW, portraitAreaHeight, 12, "white"))).png().toBuffer();
    composites.push({ input: cardBg, top: portraitAreaTop, left: x });
    const rounded = await makeRoundedImage(pet.portraitBuffer, portraitW - 16, portraitImgH - 8, 8);
    composites.push({ input: rounded, top: portraitAreaTop + 8, left: x + 8 });
    const nameText = textSvg(pet.name, 20, `rgb(${DARK_TEXT.r},${DARK_TEXT.g},${DARK_TEXT.b})`, portraitW - 16);
    composites.push({ input: nameText, top: portraitAreaTop + portraitImgH + 8, left: x + 12 });
    const breedText = textSvg(pet.breed, 14, `rgb(${MUTED_TEXT.r},${MUTED_TEXT.g},${MUTED_TEXT.b})`, portraitW - 16, "normal");
    composites.push({ input: breedText, top: portraitAreaTop + portraitImgH + 34, left: x + 12 });
  }
  const poweredByText = textSvg("Powered by", 13, `rgb(${MUTED_TEXT.r},${MUTED_TEXT.g},${MUTED_TEXT.b})`, 200, "normal");
  composites.push({ input: poweredByText, top: HEIGHT - 38, left: WIDTH - 370 });
  const ppLogo = pawtraitPalsLogoSvg(40);
  composites.push({ input: ppLogo.svg, top: HEIGHT - 48, left: WIDTH - 280 });
  return (0, import_sharp.default)(bg).composite(composites).png().toBuffer();
}
async function generatePawfileMockup(dogId) {
  const dog = await storage.getDog(dogId);
  if (!dog) throw new Error("Dog not found");
  const org = await storage.getOrganization(dog.organizationId);
  if (!org) throw new Error("Organization not found");
  const portrait = await storage.getSelectedPortraitByDog(dog.id);
  if (!portrait || !portrait.generatedImageUrl) throw new Error("No portrait found");
  const portraitBuffer = await extractImageFromDataUri(portrait.generatedImageUrl);
  const composites = [];
  const bg = await (0, import_sharp.default)({
    create: { width: WIDTH, height: HEIGHT, channels: 4, background: CREAM_BG }
  }).png().toBuffer();
  const topBar = await (0, import_sharp.default)(Buffer.from(roundedRectSvg(WIDTH, 6, 0, `rgb(${ORANGE.r},${ORANGE.g},${ORANGE.b})`))).png().toBuffer();
  composites.push({ input: topBar, top: 0, left: 0 });
  const portraitW = 420;
  const portraitH = 480;
  const portraitTop = 80;
  const portraitLeft = 40;
  const rounded = await makeRoundedImage(portraitBuffer, portraitW, portraitH, 16);
  composites.push({ input: rounded, top: portraitTop, left: portraitLeft });
  const infoLeft = portraitLeft + portraitW + 40;
  const orgLogoSize = 60;
  if (org.logoUrl) {
    try {
      const orgLogoBuf = await extractImageFromDataUri(org.logoUrl);
      const orgLogo = await makeRoundedImage(orgLogoBuf, orgLogoSize, orgLogoSize, 8);
      composites.push({ input: orgLogo, top: 20, left: WIDTH - orgLogoSize - 30 });
    } catch (e) {
    }
  }
  const nameText = textSvg(dog.name, 48, `rgb(${DARK_TEXT.r},${DARK_TEXT.g},${DARK_TEXT.b})`, 600);
  composites.push({ input: nameText, top: 100, left: infoLeft });
  const breedText = textSvg(dog.breed || "Unknown Breed", 22, `rgb(${MUTED_TEXT.r},${MUTED_TEXT.g},${MUTED_TEXT.b})`, 500, "normal");
  composites.push({ input: breedText, top: 160, left: infoLeft });
  const ageStr = dog.age ? `${dog.age}` : "";
  if (ageStr) {
    const ageText = textSvg(ageStr, 20, `rgb(${MUTED_TEXT.r},${MUTED_TEXT.g},${MUTED_TEXT.b})`, 400, "normal");
    composites.push({ input: ageText, top: 195, left: infoLeft });
  }
  const speciesLabel = (dog.species || "dog") === "cat" ? "Cat" : "Dog";
  const speciesPill = pillSvg(speciesLabel, 16, `rgb(${ORANGE.r},${ORANGE.g},${ORANGE.b})`, "white", 16, 8);
  composites.push({ input: speciesPill.svg, top: 240, left: infoLeft });
  const adoptPill = pillSvg("Available for Adoption", 16, `rgb(34,139,34)`, "white", 16, 8);
  composites.push({ input: adoptPill.svg, top: 240, left: infoLeft + speciesPill.width + 12 });
  const orgText = textSvg(`From ${org.name}`, 18, `rgb(${MUTED_TEXT.r},${MUTED_TEXT.g},${MUTED_TEXT.b})`, 500, "normal");
  composites.push({ input: orgText, top: 300, left: infoLeft });
  if (dog.description) {
    const desc2 = dog.description.length > 120 ? dog.description.substring(0, 117) + "..." : dog.description;
    const descText = textSvg(desc2, 16, `rgb(${MUTED_TEXT.r},${MUTED_TEXT.g},${MUTED_TEXT.b})`, 550, "normal");
    composites.push({ input: descText, top: 340, left: infoLeft });
  }
  const poweredByText2 = textSvg("Powered by", 13, `rgb(${MUTED_TEXT.r},${MUTED_TEXT.g},${MUTED_TEXT.b})`, 200, "normal");
  composites.push({ input: poweredByText2, top: HEIGHT - 38, left: WIDTH - 370 });
  const ppLogo2 = pawtraitPalsLogoSvg(40);
  composites.push({ input: ppLogo2.svg, top: HEIGHT - 48, left: WIDTH - 280 });
  return (0, import_sharp.default)(bg).composite(composites).png().toBuffer();
}

// server/breeds.ts
var dogBreeds = [
  "Affenpinscher",
  "Afghan Hound",
  "Airedale Terrier",
  "Akita",
  "Alaskan Malamute",
  "American Bulldog",
  "American English Coonhound",
  "American Eskimo Dog",
  "American Foxhound",
  "American Hairless Terrier",
  "American Staffordshire Terrier",
  "American Water Spaniel",
  "Anatolian Shepherd Dog",
  "Australian Cattle Dog",
  "Australian Shepherd",
  "Australian Terrier",
  "Azawakh",
  "Barbet",
  "Basenji",
  "Basset Fauve de Bretagne",
  "Basset Hound",
  "Beagle",
  "Bearded Collie",
  "Beauceron",
  "Bedlington Terrier",
  "Belgian Laekenois",
  "Belgian Malinois",
  "Belgian Sheepdog",
  "Belgian Tervuren",
  "Bergamasco Sheepdog",
  "Berger Picard",
  "Bernese Mountain Dog",
  "Bichon Frise",
  "Biewer Terrier",
  "Black and Tan Coonhound",
  "Black Russian Terrier",
  "Bloodhound",
  "Bluetick Coonhound",
  "Boerboel",
  "Border Collie",
  "Border Terrier",
  "Borzoi",
  "Boston Terrier",
  "Bouvier des Flandres",
  "Boxer",
  "Boykin Spaniel",
  "Bracco Italiano",
  "Briard",
  "Brittany",
  "Brussels Griffon",
  "Bull Terrier",
  "Bulldog",
  "Bullmastiff",
  "Cairn Terrier",
  "Canaan Dog",
  "Cane Corso",
  "Cardigan Welsh Corgi",
  "Cavalier King Charles Spaniel",
  "Cesky Terrier",
  "Chesapeake Bay Retriever",
  "Chihuahua",
  "Chinese Crested",
  "Chinese Shar-Pei",
  "Chinook",
  "Chow Chow",
  "Cirneco dell'Etna",
  "Clumber Spaniel",
  "Cocker Spaniel",
  "Collie",
  "Coton de Tulear",
  "Croatian Sheepdog",
  "Curly-Coated Retriever",
  "Dachshund",
  "Dalmatian",
  "Dandie Dinmont Terrier",
  "Danish-Swedish Farmdog",
  "Doberman Pinscher",
  "Dogo Argentino",
  "Dogue de Bordeaux",
  "English Cocker Spaniel",
  "English Foxhound",
  "English Setter",
  "English Springer Spaniel",
  "English Toy Spaniel",
  "Entlebucher Mountain Dog",
  "Field Spaniel",
  "Finnish Lapphund",
  "Finnish Spitz",
  "Flat-Coated Retriever",
  "French Bulldog",
  "German Pinscher",
  "German Shepherd Dog",
  "German Shorthaired Pointer",
  "German Wirehaired Pointer",
  "Giant Schnauzer",
  "Glen of Imaal Terrier",
  "Golden Retriever",
  "Gordon Setter",
  "Grand Basset Griffon Vendeen",
  "Great Dane",
  "Great Pyrenees",
  "Greater Swiss Mountain Dog",
  "Greyhound",
  "Harrier",
  "Havanese",
  "Ibizan Hound",
  "Icelandic Sheepdog",
  "Irish Red and White Setter",
  "Irish Setter",
  "Irish Terrier",
  "Irish Water Spaniel",
  "Irish Wolfhound",
  "Italian Greyhound",
  "Japanese Chin",
  "Japanese Spitz",
  "Keeshond",
  "Kerry Blue Terrier",
  "Komondor",
  "Kuvasz",
  "Labrador Retriever",
  "Lagotto Romagnolo",
  "Lakeland Terrier",
  "Lancashire Heeler",
  "Leonberger",
  "Lhasa Apso",
  "Lowchen",
  "Maltese",
  "Manchester Terrier",
  "Mastiff",
  "Miniature American Shepherd",
  "Miniature Bull Terrier",
  "Miniature Pinscher",
  "Miniature Schnauzer",
  "Mudi",
  "Neapolitan Mastiff",
  "Newfoundland",
  "Norfolk Terrier",
  "Norwegian Buhund",
  "Norwegian Elkhound",
  "Norwegian Lundehund",
  "Norwich Terrier",
  "Nova Scotia Duck Tolling Retriever",
  "Old English Sheepdog",
  "Otterhound",
  "Papillon",
  "Parson Russell Terrier",
  "Pekingese",
  "Pembroke Welsh Corgi",
  "Petit Basset Griffon Vendeen",
  "Pharaoh Hound",
  "Plott Hound",
  "Pointer",
  "Polish Lowland Sheepdog",
  "Pomeranian",
  "Poodle",
  "Portuguese Podengo Pequeno",
  "Portuguese Water Dog",
  "Pug",
  "Puli",
  "Pumi",
  "Pyrenean Shepherd",
  "Rat Terrier",
  "Redbone Coonhound",
  "Rhodesian Ridgeback",
  "Rottweiler",
  "Russell Terrier",
  "Russian Toy",
  "Russian Tsvetnaya Bolonka",
  "Saint Bernard",
  "Saluki",
  "Samoyed",
  "Schipperke",
  "Scottish Deerhound",
  "Scottish Terrier",
  "Sealyham Terrier",
  "Shetland Sheepdog",
  "Shiba Inu",
  "Shih Tzu",
  "Siberian Husky",
  "Silky Terrier",
  "Skye Terrier",
  "Sloughi",
  "Small Munsterlander",
  "Smooth Fox Terrier",
  "Soft Coated Wheaten Terrier",
  "Spanish Water Dog",
  "Spinone Italiano",
  "Staffordshire Bull Terrier",
  "Standard Schnauzer",
  "Sussex Spaniel",
  "Swedish Vallhund",
  "Teddy Roosevelt Terrier",
  "Thai Ridgeback",
  "Tibetan Mastiff",
  "Tibetan Spaniel",
  "Tibetan Terrier",
  "Toy Fox Terrier",
  "Treeing Walker Coonhound",
  "Vizsla",
  "Weimaraner",
  "Welsh Springer Spaniel",
  "Welsh Terrier",
  "West Highland White Terrier",
  "Whippet",
  "Wire Fox Terrier",
  "Wirehaired Pointing Griffon",
  "Wirehaired Vizsla",
  "Xoloitzcuintli",
  "Yorkshire Terrier"
];
var catBreeds = [
  "Abyssinian",
  "American Bobtail",
  "American Curl",
  "American Shorthair",
  "American Wirehair",
  "Balinese",
  "Bengal",
  "Birman",
  "Bombay",
  "British Shorthair",
  "Burmese",
  "Burmilla",
  "Chartreux",
  "Colorpoint Shorthair",
  "Cornish Rex",
  "Devon Rex",
  "Egyptian Mau",
  "European Burmese",
  "Exotic Shorthair",
  "Havana Brown",
  "Japanese Bobtail",
  "Khao Manee",
  "Korat",
  "LaPerm",
  "Lykoi",
  "Maine Coon",
  "Manx",
  "Norwegian Forest Cat",
  "Ocicat",
  "Oriental",
  "Persian",
  "Ragamuffin",
  "Ragdoll",
  "Russian Blue",
  "Scottish Fold",
  "Selkirk Rex",
  "Siamese",
  "Siberian",
  "Singapura",
  "Somali",
  "Sphynx",
  "Tonkinese",
  "Toybob",
  "Turkish Angora",
  "Turkish Van"
];
function buildValidBreeds(breeds) {
  const set = /* @__PURE__ */ new Set();
  set.add("Mixed Breed");
  for (const b of breeds) {
    set.add(b);
    set.add(`${b} Mix`);
  }
  return set;
}
var validDogBreeds = buildValidBreeds(dogBreeds);
var validCatBreeds = buildValidBreeds(catBreeds);
function isValidBreed(breed, species) {
  if (!breed || !breed.trim()) return false;
  if (species === "cat") return validCatBreeds.has(breed);
  if (species === "dog") return validDogBreeds.has(breed);
  return validDogBreeds.has(breed) || validCatBreeds.has(breed);
}

// server/subscription.ts
var TRIAL_DURATION_MS = 30 * 24 * 60 * 60 * 1e3;
function getTrialEndDate(org) {
  if (org.trialEndsAt) return new Date(org.trialEndsAt);
  if (org.createdAt) return new Date(new Date(org.createdAt).getTime() + TRIAL_DURATION_MS);
  return null;
}
function isTrialExpired(org) {
  if (org.subscriptionStatus !== "trial") return false;
  const trialEnd = getTrialEndDate(org);
  return trialEnd ? trialEnd < /* @__PURE__ */ new Date() : false;
}
function isWithinTrialWindow(org) {
  const trialEnd = getTrialEndDate(org);
  return trialEnd ? trialEnd > /* @__PURE__ */ new Date() : false;
}
async function getFreeTrial() {
  const plans = await storage.getAllSubscriptionPlans();
  return plans.find((p) => p.name === "Free Trial");
}
async function revertToFreeTrial(orgId) {
  const freeTrial = await getFreeTrial();
  if (!freeTrial) return false;
  await storage.updateOrganizationStripeInfo(orgId, {
    subscriptionStatus: "trial",
    stripeCustomerId: null,
    stripeSubscriptionId: null
  });
  await storage.updateOrganization(orgId, {
    planId: freeTrial.id,
    additionalPetSlots: 0
  });
  return true;
}
async function handleCancellation(orgId, org) {
  if (isWithinTrialWindow(org)) {
    const reverted = await revertToFreeTrial(orgId);
    if (reverted) return "reverted_to_trial";
  }
  await storage.updateOrganizationStripeInfo(orgId, {
    subscriptionStatus: "canceled",
    stripeCustomerId: null,
    stripeSubscriptionId: null
  });
  await storage.updateOrganization(orgId, {
    additionalPetSlots: 0,
    planId: null
  });
  return "canceled";
}
function canStartFreeTrial(org) {
  if (org.hasUsedFreeTrial) return false;
  if (org.trialEndsAt) return false;
  return true;
}
async function markFreeTrialUsed(orgId) {
  await storage.updateOrganization(orgId, { hasUsedFreeTrial: true });
}

// server/routes.ts
var ADMIN_EMAIL = process.env.ADMIN_EMAIL;
function sanitizeForPrompt(input) {
  return input.replace(/[^\w\s\-'.,:;!?()]/g, "").trim();
}
var aiRateLimiter = (0, import_express_rate_limit.default)({
  windowMs: 60 * 1e3,
  max: 10,
  message: { error: "Too many requests. Please wait a minute before generating more portraits." },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.user?.claims?.sub || "anonymous",
  validate: { xForwardedForHeader: false }
});
var apiRateLimiter = (0, import_express_rate_limit.default)({
  windowMs: 60 * 1e3,
  max: 100,
  message: { error: "Too many requests. Please try again shortly." },
  standardHeaders: true,
  legacyHeaders: false
});
async function generateUniqueSlug(name, excludeOrgId) {
  let baseSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  let slug = baseSlug;
  let attempts = 0;
  while (attempts < 10) {
    const existing = await storage.getOrganizationBySlug(slug);
    if (!existing || excludeOrgId && existing.id === excludeOrgId) break;
    slug = `${baseSlug}-${Math.random().toString(36).substring(2, 6)}`;
    attempts++;
  }
  return slug;
}
var MAX_ADDITIONAL_SLOTS = 5;
var MAX_EDITS_PER_IMAGE = 4;
async function validateAndCleanStripeData(orgId) {
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
      if (customer.deleted) {
        console.warn(`[stripe-cleanup] Customer ${validCustomerId} is deleted in Stripe for org ${orgId}, clearing`);
        validCustomerId = null;
        validSubscriptionId = null;
        cleaned = true;
      }
    } catch (err) {
      if (err?.type === "StripeInvalidRequestError" || err?.statusCode === 404 || err?.code === "resource_missing") {
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
      if (sub.status === "canceled" || sub.status === "incomplete_expired") {
        console.warn(`[stripe-cleanup] Subscription ${validSubscriptionId} is ${sub.status} in Stripe for org ${orgId}, clearing`);
        validSubscriptionId = null;
        cleaned = true;
      }
    } catch (err) {
      if (err?.type === "StripeInvalidRequestError" || err?.statusCode === 404 || err?.code === "resource_missing") {
        console.warn(`[stripe-cleanup] Stale subscription ${validSubscriptionId} for org ${orgId}, clearing`);
        validSubscriptionId = null;
        cleaned = true;
      }
    }
  }
  if (cleaned) {
    const stripeUpdate = {
      stripeCustomerId: validCustomerId,
      stripeSubscriptionId: validSubscriptionId
    };
    if (!validSubscriptionId && currentStatus === "active") {
      stripeUpdate.subscriptionStatus = "canceled";
      currentStatus = "canceled";
    }
    await storage.updateOrganizationStripeInfo(orgId, stripeUpdate);
    const orgUpdates = {};
    if (!validSubscriptionId && (org.additionalPetSlots || 0) > 0) {
      orgUpdates.additionalPetSlots = 0;
    }
    if (Object.keys(orgUpdates).length > 0) {
      await storage.updateOrganization(orgId, orgUpdates);
    }
  }
  return { customerId: validCustomerId, subscriptionId: validSubscriptionId, subscriptionStatus: currentStatus, cleaned };
}
function computePetLimitInfo(org, plan, petCount) {
  const basePetLimit = plan?.dogsLimit ?? null;
  const effectivePetLimit = basePetLimit != null ? basePetLimit + (org.additionalPetSlots || 0) : null;
  return {
    petCount,
    petLimit: effectivePetLimit,
    basePetLimit,
    additionalPetSlots: org.additionalPetSlots || 0,
    maxAdditionalSlots: MAX_ADDITIONAL_SLOTS,
    isPaidPlan: plan ? plan.priceMonthly > 0 : false
  };
}
async function checkDogLimit(orgId) {
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
async function createDogWithPortrait(dogData, orgId, originalPhotoUrl, generatedPortraitUrl, styleId) {
  const dog = await storage.createDog({
    ...dogData,
    originalPhotoUrl,
    organizationId: orgId
  });
  if (generatedPortraitUrl && styleId) {
    const existingPortrait = await storage.getPortraitByDogAndStyle(dog.id, styleId);
    if (!existingPortrait) {
      await storage.createPortrait({
        dogId: dog.id,
        styleId,
        generatedImageUrl: generatedPortraitUrl,
        isSelected: true
      });
      await storage.incrementOrgPortraitsUsed(orgId);
    } else {
      await storage.updatePortrait(existingPortrait.id, { generatedImageUrl: generatedPortraitUrl });
    }
  }
  return dog;
}
async function registerRoutes(httpServer2, app2) {
  registerAuthRoutes(app2);
  (async () => {
    try {
      if (ADMIN_EMAIL) {
        const allOrgsStartup = await storage.getAllOrganizations();
        const users2 = await storage.getAllUsers();
        let adminUserId = null;
        const adminUser = users2.find((u) => u.email === ADMIN_EMAIL);
        if (adminUser) adminUserId = adminUser.id;
        if (adminUserId) {
          const adminOrgs = allOrgsStartup.filter((o) => o.ownerId === adminUserId);
          for (const adminOrg of adminOrgs) {
            await storage.clearOrganizationOwner(adminOrg.id);
            console.log(`[startup] Removed admin ownership from "${adminOrg.name}" (ID ${adminOrg.id}) \u2014 admin should not own any rescue`);
          }
        }
      }
      try {
        const allOrgsForSync = await storage.getAllOrganizations();
        const orgsWithStripe = allOrgsForSync.filter((o) => o.stripeSubscriptionId);
        for (const org of orgsWithStripe) {
          try {
            const stripe = getStripeClient(org.stripeTestMode);
            const sub = await stripe.subscriptions.retrieve(org.stripeSubscriptionId);
            const newStatus = mapStripeStatusToInternal(sub.status, org.subscriptionStatus);
            const priceId = sub.items?.data?.[0]?.price?.id;
            const matchedPlan = priceId ? STRIPE_PLAN_PRICE_MAP[priceId] : void 0;
            const changes = [];
            const orgUpdates = {};
            if (newStatus === "canceled") {
              const result = await handleCancellation(org.id, org);
              console.log(`[startup] Stripe sync for "${org.name}" (ID ${org.id}): ${result}`);
              continue;
            }
            if (newStatus !== org.subscriptionStatus) {
              await storage.updateOrganizationStripeInfo(org.id, {
                subscriptionStatus: newStatus,
                stripeSubscriptionId: org.stripeSubscriptionId
              });
              changes.push(`status: ${org.subscriptionStatus} \u2192 ${newStatus}`);
            }
            if (matchedPlan && matchedPlan.id !== org.planId) {
              orgUpdates.planId = matchedPlan.id;
              changes.push(`plan: \u2192 ${matchedPlan.name}`);
            }
            if (sub.status === "active" && sub.current_period_start) {
              const periodStart = new Date(sub.current_period_start * 1e3);
              if (!org.billingCycleStart || org.billingCycleStart.getTime() !== periodStart.getTime()) {
                orgUpdates.billingCycleStart = periodStart;
                changes.push(`billing cycle updated`);
              }
            }
            if (Object.keys(orgUpdates).length > 0) {
              await storage.updateOrganization(org.id, orgUpdates);
            }
            if (changes.length > 0) {
              console.log(`[startup] Stripe sync for "${org.name}" (ID ${org.id}): ${changes.join(", ")}`);
            }
          } catch (stripeErr) {
            if (stripeErr?.type === "StripeInvalidRequestError" || stripeErr?.statusCode === 404 || stripeErr?.code === "resource_missing") {
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
      } catch (syncErr) {
        console.error("[startup] Stripe sync failed:", syncErr.message);
      }
      try {
        const stripe = getStripeClient(true);
        const dbPlans = await storage.getAllSubscriptionPlans();
        let plansSynced = 0;
        for (const plan of dbPlans) {
          if (!plan.stripePriceId) continue;
          try {
            const price = await stripe.prices.retrieve(plan.stripePriceId, { expand: ["product"] });
            const product = price.product;
            if (product && !product.deleted) {
              const dbUpdates = {};
              if (product.name && product.name !== plan.name) {
                dbUpdates.name = product.name;
              }
              if (product.description !== void 0 && product.description !== null && product.description !== plan.description) {
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
          } catch (prodErr) {
            console.warn(`[startup] Could not sync Stripe product for plan "${plan.name}":`, prodErr.message);
          }
        }
        if (plansSynced > 0) {
          console.log(`[startup] Updated ${plansSynced} plan(s) from Stripe product data`);
        }
      } catch (descSyncErr) {
        console.warn("[startup] Stripe product sync failed:", descSyncErr.message);
      }
      const seqFixes = await storage.repairSequences();
      if (seqFixes.length > 0) {
        console.log(`[startup] Repaired DB sequences: ${seqFixes.join(", ")}`);
      }
      const creditResults = await storage.recalculateAllOrgCredits();
      if (creditResults.length > 0) {
        console.log(`[startup] Recalculated credits for ${creditResults.length} org(s):`, creditResults);
      }
      const allOrgs = await storage.getAllOrganizations();
      const allPlans = await storage.getAllSubscriptionPlans();
      const freeTrialPlan = await getFreeTrial();
      const issues = [];
      const fixes = [];
      for (const org of allOrgs) {
        if (org.subscriptionStatus === "active" && !org.stripeSubscriptionId) {
          const result = await handleCancellation(org.id, org);
          fixes.push(`FIXED: "${org.name}" (ID ${org.id}) active without subscription \u2192 ${result}`);
        }
        if (org.stripeCustomerId && !org.stripeSubscriptionId && org.subscriptionStatus !== "active") {
          try {
            const stripe = getStripeClient(org.stripeTestMode);
            const customer = await stripe.customers.retrieve(org.stripeCustomerId);
            if (customer.deleted) {
              await storage.updateOrganizationStripeInfo(org.id, { stripeCustomerId: null, stripeSubscriptionId: null });
              fixes.push(`FIXED: "${org.name}" (ID ${org.id}) cleared deleted Stripe customer`);
            }
          } catch (custErr) {
            if (custErr?.type === "StripeInvalidRequestError" || custErr?.statusCode === 404 || custErr?.code === "resource_missing") {
              await storage.updateOrganizationStripeInfo(org.id, { stripeCustomerId: null, stripeSubscriptionId: null });
              fixes.push(`FIXED: "${org.name}" (ID ${org.id}) cleared stale Stripe customer`);
            }
          }
        }
        if (org.subscriptionStatus === "canceled" && !org.stripeSubscriptionId && isWithinTrialWindow(org)) {
          const reverted = await revertToFreeTrial(org.id);
          if (reverted) {
            fixes.push(`FIXED: "${org.name}" (ID ${org.id}) canceled without Stripe sub, still in trial \u2192 reverted to Free Trial`);
          }
        }
        if (org.subscriptionStatus === "trial" && !org.trialEndsAt && org.createdAt) {
          const trialEndsAt = new Date(new Date(org.createdAt).getTime() + 30 * 24 * 60 * 60 * 1e3);
          await storage.updateOrganization(org.id, { trialEndsAt });
          fixes.push(`FIXED: "${org.name}" (ID ${org.id}) backfilled trialEndsAt`);
        }
        if (!org.hasUsedFreeTrial && (org.subscriptionStatus === "trial" || org.trialEndsAt)) {
          await markFreeTrialUsed(org.id);
          fixes.push(`FIXED: "${org.name}" (ID ${org.id}) marked hasUsedFreeTrial`);
        }
        const dogCount = (await storage.getDogsByOrganization(org.id)).length;
        if (!org.planId && (dogCount > 0 || org.subscriptionStatus === "trial")) {
          if (freeTrialPlan) {
            await storage.updateOrganization(org.id, {
              planId: freeTrialPlan.id,
              subscriptionStatus: "trial",
              billingCycleStart: org.billingCycleStart || org.createdAt || /* @__PURE__ */ new Date()
            });
            fixes.push(`FIXED: "${org.name}" (ID ${org.id}) assigned Free Trial plan`);
          } else {
            issues.push(`CRITICAL: "${org.name}" (ID ${org.id}) has no plan and Free Trial not found`);
          }
          continue;
        }
        if (org.planId && dogCount > 0) {
          const plan = allPlans.find((p) => p.id === org.planId);
          if (plan?.dogsLimit) {
            const effectiveLimit = plan.dogsLimit + (org.additionalPetSlots || 0);
            if (dogCount > effectiveLimit) {
              issues.push(`WARNING: "${org.name}" (ID ${org.id}) has ${dogCount} pet(s) but limit is ${effectiveLimit} (${plan.name})`);
            }
          }
        }
      }
      if (fixes.length > 0) {
        console.log(`[startup] Auto-fixed ${fixes.length} org(s):
${fixes.join("\n")}`);
        const recount = await storage.recalculateAllOrgCredits();
        if (recount.length > 0) {
          console.log(`[startup] Re-recalculated credits after fixes:`, recount);
        }
      }
      if (issues.length > 0) {
        console.log(`[startup] Data integrity issues found:
${issues.join("\n")}`);
      }
    } catch (err) {
      console.error("[startup] Health check failed:", err);
    }
  })();
  app2.use("/api/", apiRateLimiter);
  const isAdmin = async (req, res, next) => {
    if (!req.user?.claims?.email || req.user.claims.email !== ADMIN_EMAIL) {
      return res.status(403).json({ error: "Admin access required" });
    }
    next();
  };
  app2.get("/api/my-organization", isAuthenticated, async (req, res) => {
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
      const { stripeCustomerId, stripeSubscriptionId, ...safeOrg } = org;
      res.json({
        ...safeOrg,
        hasStripeAccount: !!stripeCustomerId,
        hasActiveSubscription: !!stripeSubscriptionId,
        ...computePetLimitInfo(org, plan, orgDogs.length)
      });
    } catch (error) {
      console.error("Error fetching user organization:", error);
      res.status(500).json({ error: "Failed to fetch organization" });
    }
  });
  app2.post("/api/my-organization", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
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
        portraitsUsedThisMonth: 0
      });
      res.status(201).json(org);
    } catch (error) {
      console.error("Error creating organization:", error);
      res.status(500).json({ error: "Failed to create organization" });
    }
  });
  app2.patch("/api/my-organization", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const org = await storage.getOrganizationByOwner(userId);
      if (!org) {
        return res.status(404).json({ error: "No organization found" });
      }
      const allowedFields = [
        "name",
        "description",
        "websiteUrl",
        "logoUrl",
        "contactName",
        "contactEmail",
        "contactPhone",
        "socialFacebook",
        "socialInstagram",
        "socialTwitter",
        "socialNextdoor",
        "billingStreet",
        "billingCity",
        "billingState",
        "billingZip",
        "billingCountry",
        "locationStreet",
        "locationCity",
        "locationState",
        "locationZip",
        "locationCountry",
        "speciesHandled",
        "onboardingCompleted"
      ];
      const updates = {};
      for (const field of allowedFields) {
        if (req.body[field] !== void 0) {
          updates[field] = req.body[field];
        }
      }
      if (Object.keys(updates).length === 0) {
        return res.status(400).json({ error: "No valid fields to update" });
      }
      const MAX_LENGTHS = {
        name: 200,
        description: 2e3,
        websiteUrl: 500,
        contactName: 200,
        contactEmail: 200,
        contactPhone: 50,
        socialFacebook: 500,
        socialInstagram: 500,
        socialTwitter: 500,
        socialNextdoor: 500,
        billingStreet: 500,
        billingCity: 200,
        billingState: 100,
        billingZip: 20,
        billingCountry: 100,
        locationStreet: 500,
        locationCity: 200,
        locationState: 100,
        locationZip: 20,
        locationCountry: 100
      };
      for (const [field, maxLen] of Object.entries(MAX_LENGTHS)) {
        if (updates[field] !== void 0 && updates[field] !== null) {
          if (typeof updates[field] !== "string") {
            return res.status(400).json({ error: `${field} must be a string` });
          }
          if (updates[field].length > maxLen) {
            return res.status(400).json({ error: `${field} must be ${maxLen} characters or less` });
          }
        }
      }
      if (updates.name !== void 0 && typeof updates.name === "string" && updates.name.trim().length === 0) {
        return res.status(400).json({ error: "Organization name cannot be empty" });
      }
      if (updates.speciesHandled !== void 0) {
        if (!["dogs", "cats", "both"].includes(updates.speciesHandled)) {
          return res.status(400).json({ error: "speciesHandled must be 'dogs', 'cats', or 'both'" });
        }
      }
      if (updates.logoUrl !== void 0 && updates.logoUrl !== null) {
        const MAX_LOGO_LENGTH = 5e5;
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
  app2.post("/api/select-plan", isAuthenticated, async (req, res) => {
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
      const trialEndsAt = plan.trialDays ? new Date(Date.now() + plan.trialDays * 24 * 60 * 60 * 1e3) : null;
      const isNewPlan = org.planId !== plan.id;
      const orgUpdate = {
        planId: plan.id,
        subscriptionStatus: isFreeTrialPlan ? "trial" : "active"
      };
      if (isNewPlan) {
        orgUpdate.billingCycleStart = org.billingCycleStart || org.createdAt || /* @__PURE__ */ new Date();
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
  function toPublicOrg(org) {
    return {
      id: org.id,
      name: org.name,
      slug: org.slug,
      description: org.description,
      websiteUrl: org.websiteUrl,
      logoUrl: org.logoUrl,
      isActive: org.isActive,
      createdAt: org.createdAt
    };
  }
  app2.get("/api/organizations", async (req, res) => {
    try {
      const orgs = await storage.getAllOrganizations();
      res.json(orgs.map(toPublicOrg));
    } catch (error) {
      console.error("Error fetching organizations:", error);
      res.status(500).json({ error: "Failed to fetch organizations" });
    }
  });
  app2.get("/api/organizations/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
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
  app2.get("/api/rescue/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const org = await storage.getOrganizationBySlug(slug);
      if (!org || !org.isActive) {
        return res.status(404).json({ error: "Rescue not found" });
      }
      const orgDogs = await storage.getDogsByOrganization(org.id);
      const dogsWithPortraits = await Promise.all(
        orgDogs.filter((d) => d.isAvailable).map(async (dog) => {
          const portrait = await storage.getSelectedPortraitByDog(dog.id);
          return { ...dog, portrait: portrait || void 0 };
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
        dogs: dogsWithPortraits
      });
    } catch (error) {
      console.error("Error fetching rescue showcase:", error);
      res.status(500).json({ error: "Failed to fetch rescue" });
    }
  });
  app2.get("/api/plans", async (req, res) => {
    try {
      const plans = await storage.getAllSubscriptionPlans();
      res.json(plans);
    } catch (error) {
      console.error("Error fetching plans:", error);
      res.status(500).json({ error: "Failed to fetch plans" });
    }
  });
  app2.get("/api/portrait-styles", async (req, res) => {
    try {
      const styles = await storage.getAllPortraitStyles();
      res.json(styles);
    } catch (error) {
      console.error("Error fetching portrait styles:", error);
      res.status(500).json({ error: "Failed to fetch portrait styles" });
    }
  });
  app2.get("/api/stripe/publishable-key", async (req, res) => {
    try {
      const testMode = req.query.testMode === "true";
      const key = getStripePublishableKey(testMode);
      res.json({ publishableKey: key, testMode });
    } catch (error) {
      console.error("Error fetching Stripe key:", error);
      res.status(500).json({ error: "Failed to get payment configuration" });
    }
  });
  app2.post("/api/stripe/checkout", isAuthenticated, async (req, res) => {
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
      const orgCurrentMode = org.stripeTestMode ?? true;
      if (org.stripeCustomerId && orgCurrentMode !== testMode) {
        await storage.updateOrganizationStripeInfo(org.id, {
          stripeCustomerId: null,
          stripeSubscriptionId: null,
          stripeTestMode: testMode
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
      const baseUrl = `${req.protocol}://${req.get("host")}`;
      const session = await stripeService.createCheckoutSession(
        customerId,
        plan.stripePriceId,
        `${baseUrl}/dashboard?subscription=success&plan=${planId}&session_id={CHECKOUT_SESSION_ID}&orgId=${org.id}&testMode=${testMode}`,
        `${baseUrl}/dashboard`,
        testMode,
        void 0,
        { orgId: String(org.id), planId: String(planId) }
      );
      res.json({ url: session.url });
    } catch (error) {
      console.error("Error creating checkout session:", error?.message || error);
      res.status(500).json({ error: error?.message || "Failed to create checkout session" });
    }
  });
  app2.post("/api/stripe/confirm-checkout", isAuthenticated, async (req, res) => {
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
      const metadataOrgIdRaw = bodyOrgId ? parseInt(bodyOrgId) : null;
      const preOrg = metadataOrgIdRaw ? await storage.getOrganization(metadataOrgIdRaw) : null;
      const testMode = reqTestMode === true || reqTestMode === "true" || (preOrg?.stripeTestMode ?? true);
      const session = await stripeService.retrieveCheckoutSession(sessionId, testMode);
      if (!session || session.payment_status !== "paid" && session.status !== "complete") {
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
      const sessionCustomerId = typeof session.customer === "string" ? session.customer : session.customer?.id;
      if (org.stripeCustomerId && sessionCustomerId !== org.stripeCustomerId) {
        return res.status(403).json({ error: "Session does not match your account" });
      }
      const subscriptionId = typeof session.subscription === "string" ? session.subscription : session.subscription?.id;
      let subscription = null;
      if (typeof session.subscription === "object" && session.subscription) {
        subscription = session.subscription;
      } else if (subscriptionId) {
        subscription = await stripeService.retrieveSubscription(subscriptionId, testMode);
      }
      if (subscription && plan.stripePriceId) {
        const subItems = subscription.items?.data || [];
        const effectivePriceId = getPriceId(plan.stripePriceId, testMode);
        const matchesPlan = subItems.some((item) => {
          const priceId = typeof item.price === "string" ? item.price : item.price?.id;
          return priceId === plan.stripePriceId || priceId === effectivePriceId;
        });
        if (!matchesPlan) {
          return res.status(400).json({ error: "Subscription does not match the selected plan" });
        }
      }
      let billingCycleStart = /* @__PURE__ */ new Date();
      if (subscription?.current_period_start) {
        billingCycleStart = new Date(subscription.current_period_start * 1e3);
      }
      await storage.updateOrganization(org.id, {
        planId: plan.id,
        subscriptionStatus: "active",
        additionalPetSlots: 0,
        billingCycleStart
      });
      await storage.syncOrgCredits(org.id);
      const stripeInfo = { subscriptionStatus: "active", stripeTestMode: testMode };
      if (sessionCustomerId && !org.stripeCustomerId) {
        stripeInfo.stripeCustomerId = sessionCustomerId;
      }
      if (subscriptionId) {
        stripeInfo.stripeSubscriptionId = subscriptionId;
      }
      await storage.updateOrganizationStripeInfo(org.id, stripeInfo);
      const updated = await storage.getOrganization(org.id);
      res.json(updated);
    } catch (error) {
      console.error("Error confirming checkout:", error);
      res.status(500).json({ error: "Failed to confirm subscription" });
    }
  });
  app2.post("/api/stripe/portal", isAuthenticated, async (req, res) => {
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
      const testMode = refreshedOrg?.stripeTestMode ?? true;
      const baseUrl = `${req.protocol}://${req.get("host")}`;
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
  app2.get("/api/subscription-info", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const callerEmail = req.user.claims.email;
      const callerIsAdmin = callerEmail && callerEmail === ADMIN_EMAIL;
      const reqOrgId = req.query.orgId ? parseInt(req.query.orgId) : null;
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
      let renewalDate = null;
      let pendingPlanName = null;
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
        hasStripeSubscription: !!org.stripeSubscriptionId
      });
    } catch (error) {
      console.error("Error getting subscription info:", error);
      res.status(500).json({ error: "Failed to get subscription info" });
    }
  });
  app2.post("/api/stripe/change-plan", isAuthenticated, async (req, res) => {
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
        return res.json({ action: "upgrade", planId: plan.id });
      }
      const result = await stripeService.scheduleDowngrade(org.stripeSubscriptionId, plan.stripePriceId, org.stripeTestMode);
      await storage.updateOrganization(org.id, {
        pendingPlanId: plan.id
      });
      res.json({
        action: "scheduled",
        renewalDate: result.currentPeriodEnd.toISOString(),
        newPlanName: plan.name
      });
    } catch (error) {
      console.error("Error changing plan:", error?.message || error);
      res.status(500).json({ error: error?.message || "Failed to change plan" });
    }
  });
  app2.post("/api/stripe/cancel-plan-change", isAuthenticated, async (req, res) => {
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
        pendingPlanId: null
      });
      res.json({ success: true });
    } catch (error) {
      console.error("Error canceling plan change:", error?.message || error);
      res.status(500).json({ error: error?.message || "Failed to cancel plan change" });
    }
  });
  app2.get("/api/addon-slots", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const callerEmail = req.user.claims.email;
      const callerIsAdmin = callerEmail && callerEmail === ADMIN_EMAIL;
      const reqOrgId = req.query.orgId ? parseInt(req.query.orgId) : null;
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
        basePetLimit: plan?.dogsLimit ?? null
      });
    } catch (error) {
      console.error("Error fetching addon slots info:", error);
      res.status(500).json({ error: "Failed to fetch add-on information" });
    }
  });
  app2.post("/api/addon-slots", isAuthenticated, async (req, res) => {
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
            error: `Cannot reduce to ${quantity} add-on slots. You have ${orgDogs.length} pets but would only have ${effectiveNewLimit} slots. Remove some pets first.`
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
        message: quantity > 0 ? `You now have ${quantity} extra pet ${slotWord}. Your card will be charged $${(quantity * 3).toFixed(2)}/month.` : "Add-on pet slots removed."
      });
    } catch (error) {
      console.error("Error updating addon slots:", error);
      res.status(500).json({ error: "Failed to update add-on slots. Please try again." });
    }
  });
  app2.get("/api/dogs", async (req, res) => {
    try {
      const allDogs = await storage.getAllDogs();
      const activeOrgs = await storage.getAllOrganizations();
      const activeOrgIds = new Set(activeOrgs.filter((o) => o.isActive).map((o) => o.id));
      const dogsWithPortraits = await Promise.all(
        allDogs.filter((dog) => dog.organizationId && activeOrgIds.has(dog.organizationId)).map(async (dog) => {
          const portrait = await storage.getSelectedPortraitByDog(dog.id);
          if (portrait) {
            const style = await storage.getPortraitStyle(portrait.styleId);
            return {
              ...dog,
              portrait: { ...portrait, style }
            };
          }
          return dog;
        })
      );
      const isRealImage = (url) => {
        if (!url) return false;
        if (url.includes("placehold.co") || url.includes("placeholder") || url.includes("via.placeholder")) return false;
        return true;
      };
      const visibleDogs = dogsWithPortraits.filter(
        (dog) => dog.isAvailable && (isRealImage(dog.portrait?.generatedImageUrl) || isRealImage(dog.originalPhotoUrl))
      );
      res.json(visibleDogs);
    } catch (error) {
      console.error("Error fetching dogs:", error);
      res.status(500).json({ error: "Failed to fetch dogs" });
    }
  });
  app2.get("/api/my-dogs", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const org = await storage.getOrganizationByOwner(userId);
      if (!org) {
        return res.json([]);
      }
      const orgDogs = await storage.getDogsByOrganization(org.id);
      const dogsWithPortraits = await Promise.all(
        orgDogs.map(async (dog) => {
          const portrait = await storage.getSelectedPortraitByDog(dog.id);
          if (portrait) {
            const style = await storage.getPortraitStyle(portrait.styleId);
            return {
              ...dog,
              portrait: { ...portrait, style }
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
  app2.get("/api/dogs/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
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
      const portrait = portraitsWithStyles.find((p) => p.isSelected) || (portraitsWithStyles.length > 0 ? portraitsWithStyles[0] : void 0);
      res.json({
        ...dog,
        organizationName: org?.name || null,
        organizationLogoUrl: org?.logoUrl || null,
        portrait: portrait || void 0,
        portraits: portraitsWithStyles
      });
    } catch (error) {
      console.error("Error fetching dog:", error);
      res.status(500).json({ error: "Failed to fetch pet" });
    }
  });
  app2.post("/api/dogs", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const userEmail = req.user.claims.email;
      const userIsAdmin = userEmail === ADMIN_EMAIL;
      let orgId;
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
      if (error instanceof import_zod.z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      const errMsg = error instanceof Error ? error.message : String(error);
      console.error("Error creating pet:", errMsg, error);
      res.status(500).json({ error: `Failed to save pet: ${errMsg}` });
    }
  });
  app2.patch("/api/dogs/:id", isAuthenticated, async (req, res) => {
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
      if (dogData.breed !== void 0 && !isValidBreed(dogData.breed, dogData.species || dog.species)) {
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
  app2.delete("/api/dogs/:id", isAuthenticated, async (req, res) => {
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
  app2.get("/api/styles", async (req, res) => {
    try {
      const styles = await storage.getAllPortraitStyles();
      res.json(styles);
    } catch (error) {
      console.error("Error fetching styles:", error);
      res.status(500).json({ error: "Failed to fetch styles" });
    }
  });
  app2.get("/api/dogs/:id/photo", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const dog = await storage.getDog(id);
      if (!dog || !dog.originalPhotoUrl) {
        return res.status(404).send("Photo not found");
      }
      const dataUri = dog.originalPhotoUrl;
      if (!dataUri.startsWith("data:")) {
        return res.redirect(dataUri);
      }
      const matches = dataUri.match(/^data:([^;]+);base64,(.+)$/);
      if (!matches) {
        return res.status(400).send("Invalid image data");
      }
      const contentType = matches[1];
      const imageBuffer = Buffer.from(matches[2], "base64");
      res.set({
        "Content-Type": contentType,
        "Content-Length": imageBuffer.length.toString(),
        "Cache-Control": "public, max-age=86400"
      });
      res.send(imageBuffer);
    } catch (error) {
      console.error("Error serving pet photo:", error);
      res.status(500).send("Error loading photo");
    }
  });
  app2.get("/api/portraits/:id/image", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const portrait = await storage.getPortrait(id);
      if (!portrait || !portrait.generatedImageUrl) {
        return res.status(404).send("Image not found");
      }
      const dataUri = portrait.generatedImageUrl;
      if (!dataUri.startsWith("data:")) {
        return res.redirect(dataUri);
      }
      const matches = dataUri.match(/^data:([^;]+);base64,(.+)$/);
      if (!matches) {
        return res.status(400).send("Invalid image data");
      }
      const contentType = matches[1];
      const imageBuffer = Buffer.from(matches[2], "base64");
      res.set({
        "Content-Type": contentType,
        "Content-Length": imageBuffer.length.toString(),
        "Cache-Control": "public, max-age=86400"
      });
      res.send(imageBuffer);
    } catch (error) {
      console.error("Error serving portrait image:", error);
      res.status(500).send("Error loading image");
    }
  });
  app2.get("/api/rescue/:slug/og-image", async (req, res) => {
    try {
      const slug = req.params.slug;
      const org = await storage.getOrganizationBySlug(slug);
      if (!org) {
        res.status(404).send("Organization not found");
        return;
      }
      const imageBuffer = await generateShowcaseMockup(org.id);
      res.set({
        "Content-Type": "image/png",
        "Content-Length": imageBuffer.length.toString(),
        "Cache-Control": "no-cache, no-store, must-revalidate"
      });
      res.send(imageBuffer);
    } catch (error) {
      console.error("Error generating rescue OG image:", error);
      res.status(500).send("Error generating preview");
    }
  });
  app2.get("/api/pawfile/:id/og-image", async (req, res) => {
    try {
      const dogId = parseInt(req.params.id);
      if (isNaN(dogId)) {
        res.status(400).send("Invalid ID");
        return;
      }
      const imageBuffer = await generatePawfileMockup(dogId);
      res.set({
        "Content-Type": "image/png",
        "Content-Length": imageBuffer.length.toString(),
        "Cache-Control": "no-cache, no-store, must-revalidate"
      });
      res.send(imageBuffer);
    } catch (error) {
      console.error("Error generating pawfile OG image:", error);
      res.status(500).send("Error generating preview");
    }
  });
  app2.get("/api/dogs/:dogId/portraits", async (req, res) => {
    try {
      const dogId = parseInt(req.params.dogId);
      const dogPortraits = await storage.getPortraitsByDog(dogId);
      res.json(dogPortraits);
    } catch (error) {
      console.error("Error fetching portraits:", error);
      res.status(500).json({ error: "Failed to fetch portraits" });
    }
  });
  async function resolveOrgForUser(userId, userEmail, dogId) {
    const userIsAdmin = userEmail === ADMIN_EMAIL;
    if (dogId) {
      const dog = await storage.getDog(dogId);
      if (!dog || !dog.organizationId) {
        return { org: null, error: "Pet not found", status: 404 };
      }
      const org2 = await storage.getOrganization(dog.organizationId);
      if (!org2) {
        return { org: null, error: "Organization not found", status: 404 };
      }
      if (userIsAdmin || org2.ownerId === userId) {
        return { org: org2 };
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
  app2.post("/api/generate-portrait", isAuthenticated, aiRateLimiter, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const userEmail = req.user.claims.email || "";
      const { prompt, dogName, originalImage, dogId, styleId, organizationId } = req.body;
      if (!prompt || typeof prompt !== "string") return res.status(400).json({ error: "Prompt is required" });
      if (prompt.length > 2e3) {
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
        const resolved = await resolveOrgForUser(userId, userEmail, dogId ? parseInt(dogId) : void 0);
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
              maxEdits: MAX_EDITS_PER_IMAGE
            });
          }
        } else {
          isNewPortrait = true;
          const existingPortraits = await storage.getPortraitsByDog(parsedDogId);
          const uniqueStyles = new Set(existingPortraits.map((p) => p.styleId));
          if (uniqueStyles.size >= MAX_STYLES_PER_PET) {
            return res.status(403).json({
              error: `This pet already has ${MAX_STYLES_PER_PET} styles. Edit an existing style or remove one first.`,
              stylesUsed: uniqueStyles.size,
              maxStyles: MAX_STYLES_PER_PET
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
                  creditsLimit: plan.monthlyPortraitCredits
                });
              }
            }
          }
        }
      }
      const generatedImage = await generateImage(sanitizedPrompt, originalImage || void 0);
      let portraitRecord = existingPortrait;
      if (dogId && styleId) {
        const parsedDogId = parseInt(dogId);
        const parsedStyleId = parseInt(styleId);
        if (existingPortrait) {
          await storage.updatePortrait(existingPortrait.id, {
            previousImageUrl: existingPortrait.generatedImageUrl || null,
            generatedImageUrl: generatedImage
          });
          await storage.incrementPortraitEditCount(existingPortrait.id);
          await storage.selectPortraitForGallery(parsedDogId, existingPortrait.id);
          portraitRecord = { ...existingPortrait, editCount: existingPortrait.editCount + 1, generatedImageUrl: generatedImage, previousImageUrl: existingPortrait.generatedImageUrl || null };
        } else {
          portraitRecord = await storage.createPortrait({
            dogId: parsedDogId,
            styleId: parsedStyleId,
            generatedImageUrl: generatedImage
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
        hasPreviousImage: !!portraitRecord?.previousImageUrl
      });
    } catch (error) {
      console.error("[generate-portrait]", error);
      res.status(500).json({ error: "Failed to generate portrait. Please try again." });
    }
  });
  app2.post("/api/edit-portrait", isAuthenticated, aiRateLimiter, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const userEmail = req.user.claims.email || "";
      const { currentImage, editPrompt, dogId, portraitId } = req.body;
      if (!currentImage) return res.status(400).json({ error: "Current image is required" });
      if (!editPrompt || typeof editPrompt !== "string") return res.status(400).json({ error: "Edit instructions are required" });
      if (editPrompt.length > 500) return res.status(400).json({ error: "Edit instructions too long (max 500 characters)." });
      const sanitizedEditPrompt = sanitizeForPrompt(editPrompt);
      if (!sanitizedEditPrompt) return res.status(400).json({ error: "Edit instructions contain invalid characters." });
      const { org, error, status } = await resolveOrgForUser(userId, userEmail, dogId ? parseInt(dogId) : void 0);
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
            maxEdits: MAX_EDITS_PER_IMAGE
          });
        }
      }
      const editedImage = await editImage(currentImage, sanitizedEditPrompt);
      let editCount = null;
      if (portraitId) {
        const existing = await storage.getPortrait(parseInt(portraitId));
        await storage.updatePortrait(parseInt(portraitId), {
          previousImageUrl: existing?.generatedImageUrl || null,
          generatedImageUrl: editedImage
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
  app2.post("/api/revert-portrait", isAuthenticated, async (req, res) => {
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
        previousImageUrl: null
      });
      res.json({
        revertedImage: portrait.previousImageUrl,
        portraitId: portrait.id,
        editCount: portrait.editCount,
        hasPreviousImage: false
      });
    } catch (error) {
      console.error("[revert-portrait]", error);
      res.status(500).json({ error: "Failed to revert portrait. Please try again." });
    }
  });
  app2.post("/api/admin/organizations", isAuthenticated, isAdmin, async (req, res) => {
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
        portraitsUsedThisMonth: 0
      });
      res.status(201).json(org);
    } catch (error) {
      console.error("Error creating organization (admin):", error);
      res.status(500).json({ error: "Failed to create organization" });
    }
  });
  app2.get("/api/admin/organizations", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const orgs = await storage.getAllOrganizations();
      const allPlans = await storage.getAllSubscriptionPlans();
      const planMap = new Map(allPlans.map((p) => [p.id, p]));
      const orgsWithStats = await Promise.all(
        orgs.map(async (org) => {
          const dogs2 = await storage.getDogsByOrganization(org.id);
          let portraitCount = 0;
          for (const dog of dogs2) {
            const portraits2 = await storage.getPortraitsByDog(dog.id);
            portraitCount += portraits2.length;
          }
          const plan = org.planId ? planMap.get(org.planId) : null;
          const planName = plan ? plan.name.toLowerCase() : "none";
          const planPriceCents = plan ? plan.priceMonthly : 0;
          const addonSlots = org.additionalPetSlots || 0;
          const addonRevenueCents = addonSlots * 300;
          const totalRevenueCents = (org.subscriptionStatus === "active" ? planPriceCents : 0) + (org.subscriptionStatus === "active" ? addonRevenueCents : 0);
          return {
            ...org,
            dogCount: dogs2.length,
            portraitCount,
            planName,
            planPriceCents,
            addonRevenueCents,
            totalRevenueCents
          };
        })
      );
      res.json(orgsWithStats);
    } catch (error) {
      console.error("Error fetching admin organizations:", error);
      res.status(500).json({ error: "Failed to fetch organizations" });
    }
  });
  app2.get("/api/admin/stats", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const orgs = await storage.getAllOrganizations();
      const dogs2 = await storage.getAllDogs();
      let totalPortraits = 0;
      for (const dog of dogs2) {
        const portraits2 = await storage.getPortraitsByDog(dog.id);
        totalPortraits += portraits2.length;
      }
      const activeSubscriptions = orgs.filter((o) => o.subscriptionStatus === "active").length;
      const pastDue = orgs.filter((o) => o.subscriptionStatus === "past_due").length;
      const allPlans = await storage.getAllSubscriptionPlans();
      const planMap = new Map(allPlans.map((p) => [p.id, p]));
      const planDistribution = {};
      for (const plan of allPlans) {
        const key = plan.name.toLowerCase() === "free trial" ? "trial" : plan.name.toLowerCase();
        planDistribution[key] = orgs.filter((o) => o.planId === plan.id).length;
      }
      planDistribution.trial = (planDistribution.trial || 0) + orgs.filter((o) => !o.planId && o.subscriptionStatus === "trial").length;
      planDistribution.inactive = orgs.filter((o) => o.subscriptionStatus === "inactive" || o.subscriptionStatus === "canceled").length;
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
        totalDogs: dogs2.length,
        totalPortraits,
        activeSubscriptions,
        pastDue,
        monthlyRevenue,
        planDistribution
      });
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });
  app2.get("/api/admin/organizations/:id/dogs", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const orgId = parseInt(req.params.id);
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
  app2.post("/api/admin/organizations/:id/dogs", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const orgId = parseInt(req.params.id);
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
      if (error instanceof import_zod.z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      const errMsg = error instanceof Error ? error.message : String(error);
      console.error("Error creating pet for org:", errMsg, error);
      res.status(500).json({ error: `Failed to save pet: ${errMsg}` });
    }
  });
  app2.get("/api/admin/organizations/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      let org = await storage.getOrganization(id);
      if (!org) {
        return res.status(404).json({ error: "Organization not found" });
      }
      const synced = await storage.syncOrgCredits(id);
      if (synced) org = synced;
      const dogs2 = await storage.getDogsByOrganization(id);
      const plan = org.planId ? await storage.getSubscriptionPlan(org.planId) : null;
      res.json({
        ...org,
        dogCount: dogs2.length,
        ...computePetLimitInfo(org, plan, dogs2.length)
      });
    } catch (error) {
      console.error("Error fetching organization:", error);
      res.status(500).json({ error: "Failed to fetch organization" });
    }
  });
  app2.post("/api/admin/organizations/:id/select-plan", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
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
      const trialEndsAt = plan.trialDays ? new Date(Date.now() + plan.trialDays * 24 * 60 * 60 * 1e3) : null;
      const isNewPlan = org.planId !== plan.id;
      const orgUpdate = {
        planId: plan.id,
        subscriptionStatus: isFreeTrialPlan ? "trial" : "active"
      };
      if (isNewPlan) {
        orgUpdate.billingCycleStart = org.billingCycleStart || org.createdAt || /* @__PURE__ */ new Date();
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
  app2.patch("/api/admin/organizations/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const org = await storage.getOrganization(id);
      if (!org) {
        return res.status(404).json({ error: "Organization not found" });
      }
      const allowedFields = [
        "name",
        "description",
        "websiteUrl",
        "logoUrl",
        "contactName",
        "contactEmail",
        "contactPhone",
        "socialFacebook",
        "socialInstagram",
        "socialTwitter",
        "socialNextdoor",
        "locationStreet",
        "locationCity",
        "locationState",
        "locationZip",
        "locationCountry",
        "billingStreet",
        "billingCity",
        "billingState",
        "billingZip",
        "billingCountry",
        "notes",
        "isActive",
        "planId",
        "speciesHandled",
        "onboardingCompleted",
        "subscriptionStatus",
        "stripeCustomerId",
        "stripeSubscriptionId",
        "stripeTestMode",
        "billingCycleStart"
      ];
      const updates = {};
      for (const field of allowedFields) {
        if (req.body[field] !== void 0) {
          updates[field] = req.body[field];
        }
      }
      if (updates.planId !== void 0) {
        if (updates.planId !== null) {
          const plan = await storage.getSubscriptionPlan(updates.planId);
          if (!plan) {
            return res.status(400).json({ error: "Invalid plan selected" });
          }
        }
      }
      if (updates.logoUrl !== void 0 && updates.logoUrl !== null) {
        const MAX_LOGO_LENGTH = 5e5;
        if (typeof updates.logoUrl !== "string" || updates.logoUrl.length > MAX_LOGO_LENGTH) {
          return res.status(400).json({ error: "Logo data too large or invalid" });
        }
      }
      if (updates.name && updates.name !== org.name) {
        updates.slug = await generateUniqueSlug(updates.name, id);
      }
      const stripeFields = {};
      for (const key of ["stripeCustomerId", "stripeSubscriptionId", "subscriptionStatus", "stripeTestMode"]) {
        if (updates[key] !== void 0) {
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
  app2.delete("/api/admin/organizations/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const org = await storage.getOrganization(id);
      if (!org) {
        return res.status(404).json({ error: "Organization not found" });
      }
      const dogs2 = await storage.getDogsByOrganization(id);
      for (const dog of dogs2) {
        await storage.deleteDog(dog.id);
      }
      await storage.deleteOrganization(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting organization:", error);
      res.status(500).json({ error: "Failed to delete organization" });
    }
  });
  app2.get("/api/admin/data-integrity", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const allOrgs = await storage.getAllOrganizations();
      const issues = [];
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
            message: `Has ${dogCount} pet(s) but no plan assigned`
          });
        }
        if (!org.planId && org.subscriptionStatus === "trial") {
          issues.push({
            type: "trial_no_plan",
            severity: "critical",
            orgId: org.id,
            orgName: org.name,
            message: `Status is "trial" but no plan assigned`
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
                message: `Has ${dogCount} pet(s) but limit is ${effectiveLimit}`
              });
            }
          }
        }
      }
      res.json({
        totalOrgs: allOrgs.length,
        issueCount: issues.length,
        issues
      });
    } catch (error) {
      console.error("Error checking data integrity:", error);
      res.status(500).json({ error: "Failed to check data integrity" });
    }
  });
  app2.post("/api/admin/sync-stripe", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const allOrgs = await storage.getAllOrganizations();
      const orgsWithStripe = allOrgs.filter((o) => o.stripeSubscriptionId);
      const results = [];
      for (const org of orgsWithStripe) {
        try {
          const stripe = getStripeClient(org.stripeTestMode);
          const sub = await stripe.subscriptions.retrieve(org.stripeSubscriptionId);
          const newStatus = mapStripeStatusToInternal(sub.status, org.subscriptionStatus);
          const priceId = sub.items?.data?.[0]?.price?.id;
          const matchedPlan = priceId ? STRIPE_PLAN_PRICE_MAP[priceId] : void 0;
          const updates = {};
          const changes = [];
          if (newStatus !== org.subscriptionStatus) {
            updates.subscriptionStatus = newStatus;
            changes.push(`status: ${org.subscriptionStatus} \u2192 ${newStatus}`);
          }
          if (matchedPlan && matchedPlan.id !== org.planId) {
            updates.planId = matchedPlan.id;
            changes.push(`plan: ${org.planId} \u2192 ${matchedPlan.id} (${matchedPlan.name})`);
          }
          if (newStatus === "canceled") {
            if (org.additionalPetSlots && org.additionalPetSlots > 0) {
              updates.additionalPetSlots = 0;
              changes.push(`add-on slots: ${org.additionalPetSlots} \u2192 0`);
            }
          }
          const subAny = sub;
          if (sub.status === "active" && subAny.current_period_start) {
            const periodStart = new Date(subAny.current_period_start * 1e3);
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
                stripeSubscriptionId: org.stripeSubscriptionId
              });
              delete updates.subscriptionStatus;
            }
            if (Object.keys(updates).length > 0) {
              await storage.updateOrganization(org.id, updates);
            }
            results.push(`${org.name} (id ${org.id}): ${changes.join(", ")}`);
          }
        } catch (stripeErr) {
          results.push(`${org.name} (id ${org.id}): ERROR - ${stripeErr.message}`);
        }
      }
      res.json({
        message: `Synced ${orgsWithStripe.length} org(s) with Stripe`,
        orgsChecked: orgsWithStripe.length,
        changes: results
      });
    } catch (error) {
      console.error("Error syncing Stripe data:", error);
      res.status(500).json({ error: "Failed to sync Stripe data" });
    }
  });
  app2.post("/api/admin/recalculate-credits", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const results = await storage.recalculateAllOrgCredits();
      res.json({
        message: `Recalculated credits for ${results.length} organization(s)`,
        changes: results
      });
    } catch (error) {
      console.error("Error recalculating credits:", error);
      res.status(500).json({ error: "Failed to recalculate credits" });
    }
  });
  const smsRateLimiter = (0, import_express_rate_limit.default)({
    windowMs: 60 * 1e3,
    max: 5,
    message: { error: "Too many texts sent. Please wait a minute." },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => req.user?.claims?.sub || "anonymous"
  });
  app2.post("/api/send-sms", isAuthenticated, smsRateLimiter, async (req, res) => {
    try {
      const { to, message } = req.body;
      if (!to || !message) {
        return res.status(400).json({ error: "Phone number and message are required" });
      }
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
      const client = (0, import_twilio.default)(apiKeySid, apiKeySecret, { accountSid });
      const phone = cleaned.startsWith("+") ? cleaned : cleaned.startsWith("1") ? `+${cleaned}` : `+1${cleaned}`;
      await client.messages.create({
        body: message,
        messagingServiceSid,
        to: phone
      });
      res.json({ success: true });
    } catch (error) {
      console.error("SMS send error:", error);
      const twilioMsg = error?.message || "Failed to send text message";
      res.status(500).json({ error: twilioMsg });
    }
  });
  return httpServer2;
}

// server/static.ts
var import_express = __toESM(require("express"), 1);
var import_fs = __toESM(require("fs"), 1);
var import_path = __toESM(require("path"), 1);
function serveStatic(app2) {
  const distPath = import_path.default.resolve(__dirname, "public");
  if (!import_fs.default.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(import_express.default.static(distPath));
  app2.use("/{*path}", (_req, res) => {
    res.sendFile(import_path.default.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var import_http = require("http");

// client/src/lib/portrait-styles.ts
var portraitStyles2 = [
  {
    id: 1,
    name: "Renaissance Noble",
    description: "A dignified portrait in the style of Italian Renaissance masters",
    category: "Classical",
    species: "dog",
    promptTemplate: "A majestic Renaissance oil painting portrait of a white fluffy {breed} dog wearing ornate noble attire with a velvet collar and golden medallion, dramatic chiaroscuro lighting, rich earth tones, in the style of Leonardo da Vinci and Raphael, museum quality, highly detailed white fur texture"
  },
  {
    id: 25,
    name: "Baroque Aristocrat",
    description: "Opulent and dramatic in the Baroque tradition",
    category: "Classical",
    species: "dog",
    promptTemplate: "An opulent Baroque oil painting portrait of a {breed} dog as an aristocrat wearing an elaborate ruff collar and jeweled chain, dramatic lighting with deep shadows, rich burgundy and gold colors, in the style of Rembrandt and Caravaggio, ornate gilded frame style"
  },
  {
    id: 2,
    name: "Victorian Gentleman",
    description: "Distinguished elegance of the Victorian era",
    category: "Classical",
    species: "dog",
    promptTemplate: "A distinguished Victorian portrait of a {breed} dog as a proper gentleman wearing a top hat and monocle with a fine tweed jacket and pocket watch chain, photographed in a Victorian study with leather books and brass fixtures, warm sepia tones, dignified and refined, professional pet photography"
  },
  {
    id: 3,
    name: "Royal Monarch",
    description: "Regal portraiture fit for royalty",
    category: "Classical",
    species: "dog",
    promptTemplate: "A regal royal portrait of a {breed} dog as a king or queen wearing an ermine-trimmed cape and crown, holding a scepter, throne room background with rich tapestries, oil painting in the style of royal court painters, majestic and commanding presence"
  },
  {
    id: 5,
    name: "Art Nouveau Beauty",
    description: "Elegant flowing lines and natural motifs",
    category: "Artistic",
    species: "dog",
    promptTemplate: "A real {breed} dog photographed wearing a delicate floral wreath collar, posed against a painted Art Nouveau backdrop with flowing organic patterns and gilded decorative border, soft natural lighting, real dog with artistic styled setting inspired by Alphonse Mucha, pastel colors with gold accents"
  },
  {
    id: 26,
    name: "Impressionist Garden",
    description: "Soft, light-filled garden scene",
    category: "Artistic",
    species: "dog",
    promptTemplate: "A beautiful Impressionist painting of a {breed} dog in a sunlit garden with blooming flowers, visible brushstrokes, dappled light through trees, soft and dreamy atmosphere, in the style of Monet and Renoir, vibrant yet gentle colors"
  },
  {
    id: 24,
    name: "Vintage Classic",
    description: "Timeless old-fashioned charm",
    category: "Artistic",
    species: "dog",
    promptTemplate: "A charming vintage-style portrait of a {breed} dog in an antique setting, wearing a simple bow tie or pearl collar, sepia-toned photograph aesthetic, classic furniture and lace curtains, timeless elegance, nostalgic and refined"
  },
  {
    id: 22,
    name: "Spring Flower Crown",
    description: "Whimsical garden beauty",
    category: "Seasonal",
    species: "dog",
    promptTemplate: "A whimsical portrait of a {breed} dog wearing a delicate flower crown, sitting in a meadow of wildflowers, soft bokeh background with butterflies, dreamy golden hour lighting, gentle and sweet, natural beauty"
  },
  {
    id: 6,
    name: "Steampunk Explorer",
    description: "Victorian era meets mechanical innovation",
    category: "Sci-Fi",
    species: "dog",
    promptTemplate: "A real {breed} dog wearing actual steampunk costume accessories - brass goggles on head, leather aviator cap, gear-decorated collar, photographed in Victorian industrial setting with copper pipes and gears backdrop, warm sepia lighting, real dog in real costume, not cartoon or illustration"
  },
  {
    id: 9,
    name: "Space Explorer",
    description: "Futuristic astronaut among the stars",
    category: "Sci-Fi",
    species: "dog",
    promptTemplate: "A futuristic portrait of a {breed} dog as an astronaut wearing a detailed space suit with reflective visor, Earth visible in background, cosmic starfield, photorealistic digital art style, sense of wonder and exploration"
  },
  {
    id: 12,
    name: "Pirate Captain",
    description: "Swashbuckling adventure on the high seas",
    category: "Adventure",
    species: "dog",
    promptTemplate: "A real {breed} dog wearing an actual pirate costume with tricorn hat and eyepatch accessory, photographed on a ship deck setting, ocean background, warm golden sunset lighting, real dog in real costume, not cartoon or illustration, professional pet photography"
  },
  {
    id: 13,
    name: "Cowboy Sheriff",
    description: "Wild West lawkeeper with frontier charm",
    category: "Adventure",
    species: "dog",
    promptTemplate: "A real {breed} dog wearing an actual cowboy hat and sheriff badge bandana, photographed against desert sunset background with cacti, warm golden lighting, real dog in real costume, not cartoon or illustration, professional pet photography"
  },
  {
    id: 15,
    name: "Country Cowboy",
    description: "Rugged Western ranch companion",
    category: "Adventure",
    species: "dog",
    promptTemplate: "A charming portrait of a {breed} dog wearing a classic brown cowboy hat and red bandana, sitting on a rustic wooden fence, golden prairie sunset background, warm country vibes, loyal ranch companion, natural and approachable"
  },
  {
    id: 18,
    name: "Mountain Explorer",
    description: "Adventurous hiking companion",
    category: "Adventure",
    species: "dog",
    promptTemplate: "A real {breed} dog wearing a cute mini hiking backpack and adventure bandana, close-up portrait with blurred mountain background, focus on the dog not the scenery, ready for adventure, loyal hiking companion, warm natural lighting"
  },
  {
    id: 10,
    name: "Halloween Pumpkin",
    description: "Whimsical spooky season costume",
    category: "Seasonal",
    species: "dog",
    promptTemplate: "A whimsical Halloween portrait of a {breed} dog wearing a cute pumpkin costume or witch hat, surrounded by jack-o-lanterns and autumn decorations, playful spooky atmosphere, orange and purple lighting, fun quirky expression, memorable and shareable"
  },
  {
    id: 23,
    name: "Holiday Spirit",
    description: "Festive seasonal celebration",
    category: "Seasonal",
    species: "dog",
    promptTemplate: "A real {breed} dog wearing a fluffy red and white Santa hat, close-up portrait with cozy holiday background of twinkling lights and wrapped presents, warm fireplace glow, joyful expression, heartwarming holiday spirit"
  },
  {
    id: 20,
    name: "Autumn Leaves",
    description: "Fall season beauty",
    category: "Seasonal",
    species: "dog",
    promptTemplate: "A beautiful portrait of a {breed} dog sitting among colorful autumn leaves in a park, warm golden and orange foliage, soft afternoon sunlight filtering through trees, cozy fall sweater weather vibes, natural seasonal beauty"
  },
  {
    id: 4,
    name: "Adopt Me Bandana",
    description: "Heartwarming adoption appeal with colorful bandana",
    category: "Adoption",
    species: "dog",
    promptTemplate: "A heartwarming portrait of a {breed} dog wearing a bright colorful bandana that says ADOPT ME, sitting attentively with hopeful eyes, soft studio lighting, clean simple background, friendly and approachable expression, professional shelter photo style, captures the dog's sweet personality"
  },
  {
    id: 7,
    name: "Tutu Princess",
    description: "Adorable ballerina with soft pink tutu",
    category: "Humanizing",
    species: "dog",
    promptTemplate: "An adorable portrait of a {breed} dog wearing a soft fluffy pink tutu and a delicate tiara, sitting gracefully like a little princess, soft pastel background with sparkles, gentle lighting, sweet innocent expression, humanizing and approachable, perfect for softening tough breed reputations"
  },
  {
    id: 8,
    name: "Cozy Pajamas",
    description: "Snuggly sleepyhead in cute pajamas",
    category: "Humanizing",
    species: "dog",
    promptTemplate: "An adorable portrait of a {breed} dog wearing cozy striped pajamas, curled up on a fluffy pillow with a soft blanket, sleepy content expression, warm bedroom lighting, stuffed toy nearby, like a toddler ready for bedtime, heartwarming and cuddly"
  },
  {
    id: 11,
    name: "Birthday Party",
    description: "Celebratory party pup with festive hat",
    category: "Celebration",
    species: "dog",
    promptTemplate: "A joyful birthday portrait of a {breed} dog wearing a colorful party hat, surrounded by balloons and streamers, birthday cake with candles nearby, confetti falling, bright cheerful colors, happy excited expression, celebrating being part of a forever family"
  },
  {
    id: 14,
    name: "Superhero",
    description: "Caped crusader ready to save the day",
    category: "Modern",
    species: "dog",
    promptTemplate: "A real {breed} dog wearing an actual superhero costume - red satin cape and simple eye mask, photographed in heroic pose against city skyline backdrop, dramatic studio lighting, real dog in real costume, professional pet photography, not cartoon or illustration"
  },
  {
    id: 16,
    name: "Garden Party",
    description: "Elegant outdoor celebration guest",
    category: "Fun",
    species: "dog",
    promptTemplate: "A delightful portrait of a {breed} dog wearing a simple floral collar or bow tie, sitting among blooming flowers in a beautiful English garden, soft afternoon light, charming and refined, tea party atmosphere"
  },
  {
    id: 17,
    name: "Beach Day",
    description: "Sun-kissed seaside companion",
    category: "Fun",
    species: "dog",
    promptTemplate: "A sunny portrait of a {breed} dog relaxing on a beautiful sandy beach, wearing stylish sunglasses, golden sand and turquoise ocean waves, tropical sunset colors, happy carefree summer vibes, natural beach setting"
  },
  {
    id: 19,
    name: "Cozy Cabin",
    description: "Warm fireside friend",
    category: "Fun",
    species: "dog",
    promptTemplate: "A cozy portrait of a {breed} dog curled up by a warm fireplace in a rustic cabin, wearing a plaid flannel bow tie, soft blankets and warm lighting, comfortable winter evening atmosphere, loving and content"
  },
  {
    id: 21,
    name: "Picnic Buddy",
    description: "Perfect park day companion",
    category: "Fun",
    species: "dog",
    promptTemplate: "A real {breed} dog sitting on a cozy picnic blanket in a sunny park, wearing a cute bandana, picnic basket nearby, warm afternoon sunlight, happy relaxed expression, ready for family fun, approachable and friendly"
  },
  {
    id: 28,
    name: "Yoga Instructor",
    description: "Flexible fitness guru striking a pose",
    category: "Fun",
    species: "dog",
    promptTemplate: "A balanced portrait of a {breed} dog as a yoga instructor doing downward dog pose on a purple yoga mat, peaceful studio with plants and natural light, wearing athletic gear, zen atmosphere, namaste energy"
  },
  {
    id: 27,
    name: "Taco Tuesday Chef",
    description: "Festive fiesta friend with tasty treats",
    category: "Fun",
    species: "dog",
    promptTemplate: "A real {breed} dog wearing a small sombrero hat and colorful serape bandana, photographed in a festive Mexican cantina setting with papel picado decorations, surrounded by tacos and fresh ingredients on the table, warm fiesta lighting, real dog in real costume, professional pet photography, not cartoon or illustration"
  },
  {
    id: 101,
    name: "Egyptian Royalty",
    description: "Ancient Egyptian deity with golden adornments",
    category: "Classical",
    species: "cat",
    promptTemplate: "A majestic ancient Egyptian portrait of a {breed} cat as a divine feline deity, wearing golden collar with lapis lazuli and turquoise jewels, Egyptian temple background with hieroglyphics, warm golden lighting, regal and mysterious, in the style of ancient Egyptian art but photorealistic, museum quality"
  },
  {
    id: 102,
    name: "Renaissance Feline",
    description: "Elegant portrait in the Italian Renaissance tradition",
    category: "Classical",
    species: "cat",
    promptTemplate: "A refined Renaissance oil painting portrait of a {breed} cat lounging on a velvet cushion wearing an ornate jeweled collar, dramatic chiaroscuro lighting, rich warm tones, in the style of Leonardo da Vinci, elegant and aristocratic, museum quality, detailed fur texture"
  },
  {
    id: 103,
    name: "Victorian Lady",
    description: "Prim and proper Victorian elegance",
    category: "Classical",
    species: "cat",
    promptTemplate: "A distinguished Victorian portrait of a {breed} cat wearing a delicate lace collar and cameo brooch, perched gracefully on an ornate chair in a parlor with velvet curtains and antique furniture, warm sepia tones, dignified and refined, professional pet photography"
  },
  {
    id: 104,
    name: "Sunbeam Napper",
    description: "Cozy cat basking in a warm sunbeam",
    category: "Cozy",
    species: "cat",
    promptTemplate: "A heartwarming portrait of a {breed} cat curled up and napping in a warm golden sunbeam on a cozy window seat, soft knit blanket underneath, dust motes floating in the light, peaceful sleeping expression, warm amber and honey tones, gentle bokeh background of a cozy living room, photorealistic, tender and serene atmosphere"
  },
  {
    id: 105,
    name: "Space Cadet",
    description: "Cosmic kitty exploring the final frontier",
    category: "Sci-Fi",
    species: "cat",
    promptTemplate: "A spectacular portrait of a {breed} cat wearing a tiny astronaut helmet floating weightlessly in outer space, colorful nebula and distant galaxies in the background, Earth visible through the visor reflection, wide curious eyes full of wonder, stars twinkling around, playful and awe-inspiring, cinematic space photography style, highly detailed"
  },
  {
    id: 106,
    name: "Purrista Barista",
    description: "Your favorite feline coffee artist",
    category: "Fun",
    species: "cat",
    promptTemplate: "An adorable portrait of a {breed} cat as a tiny barista behind a miniature coffee shop counter, wearing a small apron and barista cap, surrounded by espresso machines and latte cups with cat-face latte art, warm cafe lighting with chalkboard menu in background, charming and whimsical, cozy coffeehouse atmosphere, irresistibly cute"
  },
  {
    id: 107,
    name: "Midnight Prowler",
    description: "Mysterious feline under moonlight",
    category: "Adventure",
    species: "cat",
    promptTemplate: "A dramatic portrait of a {breed} cat perched on a moonlit rooftop or garden wall, silvery moonlight casting elegant shadows, starry night sky background, mysterious and enchanting atmosphere, the cat's eyes glowing softly, beautiful nighttime photography"
  },
  {
    id: 108,
    name: "Bookshelf Scholar",
    description: "Intellectual companion among the books",
    category: "Humanizing",
    species: "cat",
    promptTemplate: "An adorable portrait of a {breed} cat sitting among stacked books on a cozy bookshelf, wearing tiny reading glasses perched on nose, warm library lighting, leather-bound books and a warm cup of tea nearby, intellectual and charming, cozy literary atmosphere"
  },
  {
    id: 109,
    name: "Garden Explorer",
    description: "Curious kitty among the flowers",
    category: "Fun",
    species: "cat",
    promptTemplate: "A delightful portrait of a {breed} cat exploring a beautiful garden among blooming flowers and butterflies, wearing a small floral collar, soft afternoon sunlight, curious playful expression, surrounded by colorful roses and lavender, natural and enchanting"
  },
  {
    id: 110,
    name: "Adopt Me Bow Tie",
    description: "Charming adoption appeal with dapper bow tie",
    category: "Adoption",
    species: "cat",
    promptTemplate: "A heartwarming portrait of a {breed} cat wearing a cute bow tie with an ADOPT ME tag on the collar, sitting with wide hopeful eyes, soft studio lighting, clean simple background, friendly and approachable expression, professional shelter photo style, captures the cat's sweet personality"
  },
  {
    id: 111,
    name: "Cozy Blanket",
    description: "Snuggly kitty wrapped in warmth",
    category: "Humanizing",
    species: "cat",
    promptTemplate: "An adorable portrait of a {breed} cat wrapped in a soft knitted blanket, peeking out with sleepy content eyes, warm bedroom lighting, fluffy pillows nearby, cozy and heartwarming, like a child tucked in for bedtime, irresistibly cuddly"
  },
  {
    id: 112,
    name: "Halloween Black Cat",
    description: "Enchanting spooky season mystique",
    category: "Seasonal",
    species: "cat",
    promptTemplate: "A whimsical Halloween portrait of a {breed} cat wearing a tiny witch hat, surrounded by glowing jack-o-lanterns and autumn decorations, mysterious and playful atmosphere, orange and purple lighting, enchanting expression, magical and shareable"
  },
  {
    id: 113,
    name: "Holiday Stocking",
    description: "Festive kitty in holiday cheer",
    category: "Seasonal",
    species: "cat",
    promptTemplate: "A real {breed} cat peeking out of a cozy holiday stocking or wearing a fluffy red and white Santa hat, twinkling lights and wrapped presents in background, warm fireplace glow, playful curious expression, heartwarming holiday spirit"
  },
  {
    id: 114,
    name: "Spring Blossoms",
    description: "Gentle beauty among cherry blossoms",
    category: "Seasonal",
    species: "cat",
    promptTemplate: "A beautiful portrait of a {breed} cat sitting among delicate cherry blossom branches, wearing a small flower crown, soft pink petals falling gently, dreamy spring atmosphere, golden hour lighting, gentle and sweet, natural beauty"
  },
  {
    id: 115,
    name: "Box Inspector",
    description: "Classic cat-in-a-box charm",
    category: "Fun",
    species: "cat",
    promptTemplate: "An adorable portrait of a {breed} cat sitting inside a cardboard box, peeking over the edge with curious wide eyes, playful and mischievous expression, warm home lighting, the box decorated with doodles, charming and relatable, captures the universal cat love of boxes"
  },
  {
    id: 116,
    name: "Tea Party Guest",
    description: "Refined afternoon tea companion",
    category: "Fun",
    species: "cat",
    promptTemplate: "A charming portrait of a {breed} cat sitting at a tiny tea party setting with miniature cups and saucers, wearing a small pearl collar, delicate floral tablecloth, soft afternoon light through a window, elegant and whimsical, very British and refined"
  }
];
var dogStyles = portraitStyles2.filter((s) => s.species === "dog");
var catStyles = portraitStyles2.filter((s) => s.species === "cat");
var styleCategories = Array.from(new Set(portraitStyles2.map((s) => s.category)));

// server/seed.ts
var import_drizzle_orm5 = require("drizzle-orm");
var planDefinitions = [
  {
    id: 5,
    name: "Free Trial",
    description: "Try Pawtrait Pals free for 30 days with up to 3 pets",
    priceMonthly: 0,
    dogsLimit: 3,
    monthlyPortraitCredits: 9,
    overagePriceCents: 0,
    trialDays: 30
  },
  {
    id: 6,
    name: "Starter",
    description: "Perfect for small rescues with up to 15 pets.",
    priceMonthly: 3900,
    dogsLimit: 15,
    monthlyPortraitCredits: 45,
    overagePriceCents: 400,
    trialDays: 0,
    stripePriceId: "price_1T1NpB2LfX3IuyBIb44I2uwq",
    stripeProductId: "prod_TzMYhqaSdDwYcO"
  },
  {
    id: 7,
    name: "Professional",
    description: "Ideal for growing rescue organizations with up to 45 pets.",
    priceMonthly: 7900,
    dogsLimit: 45,
    monthlyPortraitCredits: 135,
    overagePriceCents: 400,
    trialDays: 0,
    stripePriceId: "price_1T1NpC2LfX3IuyBIBj9Mdx3f",
    stripeProductId: "prod_TzMY4ahWLz2y9C"
  },
  {
    id: 8,
    name: "Executive",
    description: "Best value for large rescue networks with up to 200 pets.",
    priceMonthly: 34900,
    dogsLimit: 200,
    monthlyPortraitCredits: 600,
    overagePriceCents: 300,
    trialDays: 0,
    stripePriceId: "price_1T1NpC2LfX3IuyBIPtezJkZ0",
    stripeProductId: "prod_TzMYb3LIL5kiZ5"
  }
];
async function seedDatabase() {
  console.log("Checking if seed data exists...");
  try {
    const migTimeout = new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), 1e4));
    await Promise.race([
      (async () => {
        await pool.query("SET LOCAL statement_timeout = 8000");
        await pool.query("ALTER TABLE organizations ADD COLUMN IF NOT EXISTS stripe_test_mode BOOLEAN DEFAULT false NOT NULL");
        const migResult = await pool.query("UPDATE organizations SET stripe_test_mode = true WHERE stripe_customer_id IS NOT NULL AND stripe_test_mode = false");
        if (migResult.rowCount && migResult.rowCount > 0) {
          console.log(`[migration] Set ${migResult.rowCount} existing org(s) to Stripe test mode`);
        }
        console.log("[migration] stripe_test_mode column ready");
      })(),
      migTimeout
    ]);
  } catch (migErr) {
    console.log("[migration] stripe_test_mode:", migErr.message);
  }
  await seedSubscriptionPlans();
  const existingStyles = await db.select().from(portraitStyles);
  const existingMap = new Map(existingStyles.map((s) => [s.id, s]));
  const missingStyles = portraitStyles2.filter((s) => !existingMap.has(s.id));
  if (missingStyles.length > 0) {
    console.log(`Seeding ${missingStyles.length} missing portrait styles...`);
    for (const style of missingStyles) {
      await db.insert(portraitStyles).values({
        id: style.id,
        name: style.name,
        description: style.description,
        promptTemplate: style.promptTemplate,
        category: style.category
      }).onConflictDoNothing();
    }
    console.log(`Seeded ${missingStyles.length} portrait styles`);
  }
  let updatedCount = 0;
  for (const style of portraitStyles2) {
    const existing = existingMap.get(style.id);
    if (existing && (existing.name !== style.name || existing.description !== style.description || existing.promptTemplate !== style.promptTemplate || existing.category !== style.category)) {
      await db.update(portraitStyles).set({
        name: style.name,
        description: style.description,
        promptTemplate: style.promptTemplate,
        category: style.category
      }).where((0, import_drizzle_orm5.eq)(portraitStyles.id, style.id));
      updatedCount++;
    }
  }
  if (updatedCount > 0) {
    console.log(`Updated ${updatedCount} changed portrait styles`);
  }
  const validIds = portraitStyles2.map((s) => s.id);
  const staleEntries = existingStyles.filter((s) => !validIds.includes(s.id));
  if (staleEntries.length > 0) {
    await db.delete(portraitStyles).where((0, import_drizzle_orm5.notInArray)(portraitStyles.id, validIds));
    console.log(`Removed ${staleEntries.length} stale portrait styles: ${staleEntries.map((s) => s.name).join(", ")}`);
  }
  if (missingStyles.length === 0 && updatedCount === 0 && staleEntries.length === 0) {
    console.log("Portrait styles already up to date, skipping...");
  }
  console.log("Database seeding complete!");
}
async function seedSubscriptionPlans() {
  const existingPlans = await db.select().from(subscriptionPlans);
  const existingMap = new Map(existingPlans.map((p) => [p.id, p]));
  let inserted = 0;
  let updated = 0;
  for (const plan of planDefinitions) {
    const existing = existingMap.get(plan.id);
    if (!existing) {
      await db.insert(subscriptionPlans).values(plan).onConflictDoNothing();
      inserted++;
    } else {
      const updateData = {};
      if (existing.priceMonthly !== plan.priceMonthly) updateData.priceMonthly = plan.priceMonthly;
      if (existing.dogsLimit !== plan.dogsLimit) updateData.dogsLimit = plan.dogsLimit;
      if (existing.monthlyPortraitCredits !== plan.monthlyPortraitCredits) updateData.monthlyPortraitCredits = plan.monthlyPortraitCredits;
      if (existing.overagePriceCents !== plan.overagePriceCents) updateData.overagePriceCents = plan.overagePriceCents;
      if (existing.trialDays !== plan.trialDays) updateData.trialDays = plan.trialDays;
      if (plan.stripePriceId && existing.stripePriceId !== plan.stripePriceId) updateData.stripePriceId = plan.stripePriceId;
      if (plan.stripeProductId && existing.stripeProductId !== plan.stripeProductId) updateData.stripeProductId = plan.stripeProductId;
      if (Object.keys(updateData).length > 0) {
        await db.update(subscriptionPlans).set(updateData).where((0, import_drizzle_orm5.eq)(subscriptionPlans.id, plan.id));
        updated++;
      }
    }
  }
  if (inserted > 0) console.log(`Seeded ${inserted} subscription plans`);
  if (updated > 0) console.log(`Updated ${updated} subscription plans`);
  if (inserted === 0 && updated === 0) console.log("Subscription plans already up to date, skipping...");
}

// server/webhookHandlers.ts
var WebhookHandlers = class _WebhookHandlers {
  static async processWebhook(payload, signature) {
    if (!Buffer.isBuffer(payload)) {
      throw new Error(
        "STRIPE WEBHOOK ERROR: Payload must be a Buffer. Received type: " + typeof payload + ". This usually means express.json() parsed the body before reaching this handler. FIX: Ensure webhook route is registered BEFORE app.use(express.json())."
      );
    }
    let event;
    const liveStripe2 = getStripeClient(false);
    const testStripe2 = getStripeClient(true);
    const liveSecret = getWebhookSecret(false);
    const testSecret = getWebhookSecret(true);
    try {
      event = liveStripe2.webhooks.constructEvent(payload, signature, liveSecret);
    } catch {
      event = testStripe2.webhooks.constructEvent(payload, signature, testSecret);
    }
    await _WebhookHandlers.handleEvent(event);
  }
  static async handleEvent(event) {
    const type = event.type;
    const data = event.data?.object;
    if (!data) return;
    switch (type) {
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const customerId = typeof data.customer === "string" ? data.customer : data.customer?.id;
        if (!customerId) break;
        const orgs = await storage.getAllOrganizations();
        const org = orgs.find((o) => o.stripeCustomerId === customerId);
        if (!org) {
          console.log(`[webhook] No org found for Stripe customer ${customerId}`);
          break;
        }
        const testMode = org.stripeTestMode;
        const newStatus = mapStripeStatusToInternal(data.status, org.subscriptionStatus);
        if (newStatus === "canceled") {
          const result = await handleCancellation(org.id, org);
          console.log(`[webhook] Subscription canceled for org ${org.id}: ${result}`);
          break;
        }
        await storage.updateOrganizationStripeInfo(org.id, {
          subscriptionStatus: newStatus,
          stripeSubscriptionId: data.id
        });
        if (data.status === "active" && data.current_period_start) {
          const periodStart = new Date(data.current_period_start * 1e3);
          const existingStart = org.billingCycleStart;
          if (!existingStart || existingStart.getMonth() !== periodStart.getMonth() || existingStart.getFullYear() !== periodStart.getFullYear()) {
            await storage.updateOrganization(org.id, {
              billingCycleStart: periodStart
            });
            await storage.syncOrgCredits(org.id);
          }
        }
        try {
          const addonPriceId = await stripeService.getAddonPriceId(testMode);
          const subItems = data.items?.data || [];
          const addonItem = subItems.find((item) => {
            const priceId = typeof item.price === "string" ? item.price : item.price?.id;
            return priceId === addonPriceId;
          });
          const addonQuantity = addonItem ? Math.min(addonItem.quantity || 0, 5) : 0;
          if (addonQuantity !== (org.additionalPetSlots || 0)) {
            await storage.updateOrganization(org.id, { additionalPetSlots: addonQuantity });
            console.log(`[webhook] Synced add-on slots for org ${org.id}: ${addonQuantity}`);
          }
        } catch (addonErr) {
          console.error(`[webhook] Error syncing add-on slots for org ${org.id}:`, addonErr.message);
        }
        console.log(`[webhook] Updated org ${org.id} subscription: ${newStatus}`);
        break;
      }
      case "invoice.payment_succeeded": {
        const customerId = typeof data.customer === "string" ? data.customer : data.customer?.id;
        if (!customerId) break;
        const orgs = await storage.getAllOrganizations();
        const org = orgs.find((o) => o.stripeCustomerId === customerId);
        if (!org) break;
        if (data.billing_reason === "subscription_cycle") {
          const periodStart = data.period_start ? new Date(data.period_start * 1e3) : /* @__PURE__ */ new Date();
          const updateFields = { billingCycleStart: periodStart };
          if (org.pendingPlanId) {
            const pendingPlan = await storage.getSubscriptionPlan(org.pendingPlanId);
            if (pendingPlan) {
              updateFields.planId = pendingPlan.id;
              updateFields.pendingPlanId = null;
              updateFields.additionalPetSlots = 0;
              console.log(`[webhook] Applied pending plan change for org ${org.id}: plan ${pendingPlan.name}`);
            } else {
              updateFields.pendingPlanId = null;
            }
          }
          await storage.updateOrganization(org.id, updateFields);
          await storage.syncOrgCredits(org.id);
          console.log(`[webhook] Synced credits for org ${org.id} on billing cycle`);
        }
        break;
      }
      default:
        break;
    }
  }
};

// server/og-meta.ts
var import_url = require("url");
var import_fs2 = __toESM(require("fs"), 1);
var import_path2 = __toESM(require("path"), 1);
var import_meta = {};
var currentDir = typeof __dirname !== "undefined" ? __dirname : import_path2.default.dirname((0, import_url.fileURLToPath)(import_meta.url));
var SITE_NAME = "Pawtrait Pals";
var BOT_USER_AGENTS = [
  "facebookexternalhit",
  "Facebot",
  "Twitterbot",
  "LinkedInBot",
  "WhatsApp",
  "Slackbot",
  "TelegramBot",
  "Pinterest",
  "Discordbot",
  "Nextdoor",
  "Google-InspectionTool",
  "Googlebot",
  "bingbot",
  "Applebot",
  "Embedly",
  "outbrain",
  "vkShare",
  "W3C_Validator",
  "redditbot"
];
function isCrawler(userAgent) {
  if (!userAgent) return false;
  const ua = userAgent.toLowerCase();
  return BOT_USER_AGENTS.some((bot) => ua.includes(bot.toLowerCase()));
}
function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function getBaseUrl(req) {
  const proto = req.headers["x-forwarded-proto"] || req.protocol || "https";
  const host = req.headers["x-forwarded-host"] || req.headers["host"] || "pawtraitpals.com";
  return `${proto}://${host}`;
}
function buildOgHtml(template, meta) {
  const ogTags = [
    `<meta property="og:title" content="${escapeHtml(meta.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(meta.description)}" />`,
    `<meta property="og:url" content="${escapeHtml(meta.url)}" />`,
    `<meta property="og:site_name" content="${SITE_NAME}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta name="twitter:card" content="${meta.imageUrl ? "summary_large_image" : "summary"}" />`,
    `<meta name="twitter:title" content="${escapeHtml(meta.title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(meta.description)}" />`
  ];
  if (meta.imageUrl) {
    ogTags.push(`<meta property="og:image" content="${escapeHtml(meta.imageUrl)}" />`);
    ogTags.push(`<meta property="og:image:width" content="1200" />`);
    ogTags.push(`<meta property="og:image:height" content="630" />`);
    ogTags.push(`<meta name="twitter:image" content="${escapeHtml(meta.imageUrl)}" />`);
  }
  const titleTag = `<title>${escapeHtml(meta.title)}</title>`;
  const descTag = `<meta name="description" content="${escapeHtml(meta.description)}" />`;
  let html = template;
  html = html.replace(/<title>[^<]*<\/title>/, titleTag);
  html = html.replace(/<meta name="description"[^>]*\/>/, descTag);
  html = html.replace(/<meta property="og:title"[^>]*\/>/, "");
  html = html.replace(/<meta property="og:description"[^>]*\/>/, "");
  html = html.replace("</head>", `    ${ogTags.join("\n    ")}
  </head>`);
  return html;
}
function getHtmlTemplate() {
  const isProd = process.env.NODE_ENV === "production";
  const templatePath = isProd ? import_path2.default.resolve(currentDir, "public", "index.html") : import_path2.default.resolve(currentDir, "..", "client", "index.html");
  return import_fs2.default.readFileSync(templatePath, "utf-8");
}
function setupOgMetaRoutes(app2) {
  app2.get("/rescue/:slug", async (req, res, next) => {
    const ua = req.headers["user-agent"];
    if (!isCrawler(ua)) return next();
    try {
      const { slug } = req.params;
      const org = await storage.getOrganizationBySlug(slug);
      if (!org || !org.isActive) return next();
      const orgDogs = await storage.getDogsByOrganization(org.id);
      const availableDogs = orgDogs.filter((d) => d.isAvailable);
      const baseUrl = getBaseUrl(req);
      const ogImageUrl = `${baseUrl}/api/rescue/${slug}/og-image`;
      const petCount = availableDogs.length;
      const speciesSet = new Set(availableDogs.map((d) => d.species));
      const species = availableDogs.length > 0 ? Array.from(speciesSet).join(" and ") : "pets";
      const description = org.description || `Meet ${petCount} adorable ${species} available for adoption at ${org.name}! View their beautiful artistic portraits and find your new best friend.`;
      const template = getHtmlTemplate();
      const html = buildOgHtml(template, {
        title: `${org.name} - Adoptable Pets | ${SITE_NAME}`,
        description,
        imageUrl: ogImageUrl,
        url: `${baseUrl}/rescue/${slug}`
      });
      res.status(200).set({ "Content-Type": "text/html" }).end(html);
    } catch (error) {
      console.error("OG meta error for rescue:", error);
      next();
    }
  });
  app2.get("/pawfile/:id", async (req, res, next) => {
    const ua = req.headers["user-agent"];
    if (!isCrawler(ua)) return next();
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return next();
      const dog = await storage.getDog(id);
      if (!dog) return next();
      const org = dog.organizationId ? await storage.getOrganization(dog.organizationId) : null;
      const baseUrl = getBaseUrl(req);
      const ogImageUrl = `${baseUrl}/api/pawfile/${id}/og-image`;
      const breedStr = dog.breed ? `${dog.breed} ` : "";
      const ageStr = dog.age ? `, ${dog.age}` : "";
      const orgStr = org ? ` at ${org.name}` : "";
      const speciesLabel = dog.species === "cat" ? "Cat" : "Dog";
      const title = `${dog.name} - Adoptable ${breedStr}${speciesLabel}${orgStr} | ${SITE_NAME}`;
      const description = dog.description || `Meet ${dog.name}, an adorable ${breedStr}${speciesLabel.toLowerCase()}${ageStr} looking for a furever home${orgStr}. View ${dog.name}'s beautiful artistic portrait!`;
      const template = getHtmlTemplate();
      const html = buildOgHtml(template, {
        title,
        description,
        imageUrl: ogImageUrl,
        url: `${baseUrl}/pawfile/${id}`
      });
      res.status(200).set({ "Content-Type": "text/html" }).end(html);
    } catch (error) {
      console.error("OG meta error for pawfile:", error);
      next();
    }
  });
}

// server/index.ts
var app = (0, import_express2.default)();
app.use((0, import_helmet.default)({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));
app.disable("x-powered-by");
var httpServer = (0, import_http.createServer)(app);
app.post(
  "/api/stripe/webhook",
  import_express2.default.raw({ type: "application/json" }),
  async (req, res) => {
    const signature = req.headers["stripe-signature"];
    if (!signature) {
      return res.status(400).json({ error: "Missing stripe-signature" });
    }
    try {
      const sig = Array.isArray(signature) ? signature[0] : signature;
      if (!Buffer.isBuffer(req.body)) {
        console.error("STRIPE WEBHOOK ERROR: req.body is not a Buffer");
        return res.status(500).json({ error: "Webhook processing error" });
      }
      await WebhookHandlers.processWebhook(req.body, sig);
      res.status(200).json({ received: true });
    } catch (error) {
      console.error("Webhook error:", error.message);
      res.status(400).json({ error: "Webhook processing error" });
    }
  }
);
app.use(import_express2.default.json({ limit: "20mb" }));
app.use(import_express2.default.urlencoded({ extended: false }));
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
app.use((req, res, next) => {
  const start = Date.now();
  const path5 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path5.startsWith("/api")) {
      let logLine = `${req.method} ${path5} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  try {
    await seedDatabase();
  } catch (error) {
    console.error("Error seeding database:", error);
  }
  setupOgMetaRoutes(app);
  await registerRoutes(httpServer, app);
  app.use((err, _req, res, next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    console.error("Internal Server Error:", err);
    if (res.headersSent) {
      return next(err);
    }
    return res.status(status).json({ message });
  });
  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  } else {
    const { setupVite: setupVite2 } = await Promise.resolve().then(() => (init_vite(), vite_exports));
    await setupVite2(httpServer, app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  httpServer.listen(
    {
      port,
      host: "0.0.0.0"
    },
    () => {
      log(`serving on port ${port}`);
    }
  );
})();
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  log
});
