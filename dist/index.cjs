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

// shared/models/auth.ts
var import_drizzle_orm, import_pg_core, users;
var init_auth = __esm({
  "shared/models/auth.ts"() {
    "use strict";
    import_drizzle_orm = require("drizzle-orm");
    import_pg_core = require("drizzle-orm/pg-core");
    users = (0, import_pg_core.pgTable)("users", {
      id: (0, import_pg_core.varchar)("id").primaryKey().default(import_drizzle_orm.sql`gen_random_uuid()`),
      email: (0, import_pg_core.varchar)("email").unique(),
      firstName: (0, import_pg_core.varchar)("first_name"),
      lastName: (0, import_pg_core.varchar)("last_name"),
      profileImageUrl: (0, import_pg_core.varchar)("profile_image_url"),
      termsAcceptedAt: (0, import_pg_core.timestamp)("terms_accepted_at"),
      privacyAcceptedAt: (0, import_pg_core.timestamp)("privacy_accepted_at"),
      createdAt: (0, import_pg_core.timestamp)("created_at").defaultNow(),
      updatedAt: (0, import_pg_core.timestamp)("updated_at").defaultNow()
    });
  }
});

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
var import_drizzle_orm2, import_pg_core2, import_drizzle_zod, subscriptionPlans, organizations, dogs, portraitStyles, portraits, insertSubscriptionPlanSchema, insertOrganizationSchema, insertDogSchema, insertPortraitStyleSchema, insertPortraitSchema;
var init_schema = __esm({
  "shared/schema.ts"() {
    "use strict";
    import_drizzle_orm2 = require("drizzle-orm");
    import_pg_core2 = require("drizzle-orm/pg-core");
    import_drizzle_zod = require("drizzle-zod");
    init_auth();
    subscriptionPlans = (0, import_pg_core2.pgTable)("subscription_plans", {
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
    organizations = (0, import_pg_core2.pgTable)("organizations", {
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
    dogs = (0, import_pg_core2.pgTable)("dogs", {
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
      externalId: (0, import_pg_core2.text)("external_id"),
      // ID from import source (Petfinder, RescueGroups, ShelterLuv)
      externalSource: (0, import_pg_core2.text)("external_source"),
      // "petfinder", "rescuegroups", "shelterluv"
      lastSyncedAt: (0, import_pg_core2.timestamp)("last_synced_at"),
      // When this record was last imported/refreshed
      tags: (0, import_pg_core2.jsonb)("tags"),
      // Array of searchable strings for hashtags/filtering
      createdAt: (0, import_pg_core2.timestamp)("created_at").default(import_drizzle_orm2.sql`CURRENT_TIMESTAMP`).notNull()
    });
    portraitStyles = (0, import_pg_core2.pgTable)("portrait_styles", {
      id: (0, import_pg_core2.serial)("id").primaryKey(),
      name: (0, import_pg_core2.text)("name").notNull(),
      description: (0, import_pg_core2.text)("description").notNull(),
      promptTemplate: (0, import_pg_core2.text)("prompt_template").notNull(),
      previewImageUrl: (0, import_pg_core2.text)("preview_image_url"),
      category: (0, import_pg_core2.text)("category").notNull()
    });
    portraits = (0, import_pg_core2.pgTable)("portraits", {
      id: (0, import_pg_core2.serial)("id").primaryKey(),
      dogId: (0, import_pg_core2.integer)("dog_id").notNull().references(() => dogs.id, { onDelete: "cascade" }),
      styleId: (0, import_pg_core2.integer)("style_id").notNull().references(() => portraitStyles.id),
      generatedImageUrl: (0, import_pg_core2.text)("generated_image_url"),
      previousImageUrl: (0, import_pg_core2.text)("previous_image_url"),
      isSelected: (0, import_pg_core2.boolean)("is_selected").default(false).notNull(),
      editCount: (0, import_pg_core2.integer)("edit_count").default(0).notNull(),
      createdAt: (0, import_pg_core2.timestamp)("created_at").default(import_drizzle_orm2.sql`CURRENT_TIMESTAMP`).notNull()
    });
    insertSubscriptionPlanSchema = (0, import_drizzle_zod.createInsertSchema)(subscriptionPlans).omit({
      id: true,
      createdAt: true
    });
    insertOrganizationSchema = (0, import_drizzle_zod.createInsertSchema)(organizations).omit({
      id: true,
      createdAt: true
    });
    insertDogSchema = (0, import_drizzle_zod.createInsertSchema)(dogs).omit({
      id: true,
      createdAt: true
    });
    insertPortraitStyleSchema = (0, import_drizzle_zod.createInsertSchema)(portraitStyles).omit({
      id: true
    });
    insertPortraitSchema = (0, import_drizzle_zod.createInsertSchema)(portraits).omit({
      id: true,
      createdAt: true
    });
  }
});

// server/db.ts
var db_exports = {};
__export(db_exports, {
  db: () => db,
  pool: () => pool
});
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
var import_pg, import_node_postgres, dbConfig, pool, db;
var init_db = __esm({
  "server/db.ts"() {
    "use strict";
    import_pg = require("pg");
    import_node_postgres = require("drizzle-orm/node-postgres");
    init_schema();
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL environment variable is not set");
    }
    dbConfig = parseDbUrl(process.env.DATABASE_URL);
    pool = new import_pg.Pool({
      ...dbConfig,
      ssl: { rejectUnauthorized: false }
    });
    db = (0, import_node_postgres.drizzle)(pool, { schema: schema_exports });
  }
});

// server/import/petfinder.ts
async function getAccessToken() {
  const now = Date.now();
  if (cachedToken && now < tokenExpiresAt - 6e4) {
    return cachedToken;
  }
  const apiKey = process.env.PETFINDER_API_KEY;
  const apiSecret = process.env.PETFINDER_API_SECRET;
  if (!apiKey || !apiSecret) {
    throw new Error("Petfinder API credentials not configured");
  }
  const res = await fetch("https://api.petfinder.com/v2/oauth2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: apiKey,
      client_secret: apiSecret
    })
  });
  if (!res.ok) {
    throw new Error(`Petfinder auth failed: ${res.status} ${res.statusText}`);
  }
  const data = await res.json();
  cachedToken = data.access_token;
  tokenExpiresAt = now + data.expires_in * 1e3;
  return cachedToken;
}
async function petfinderGet(path5, params) {
  const token = await getAccessToken();
  const url = new URL(`https://api.petfinder.com/v2${path5}`);
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v) url.searchParams.set(k, v);
    }
  }
  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Petfinder API error ${res.status}: ${body}`);
  }
  return res.json();
}
function extractTags(animal) {
  const tags = [];
  if (animal.breeds?.primary) tags.push(animal.breeds.primary);
  if (animal.breeds?.secondary) tags.push(animal.breeds.secondary);
  if (animal.breeds?.mixed) tags.push("Mixed Breed");
  if (animal.size) tags.push(animal.size);
  if (animal.gender) tags.push(animal.gender);
  if (animal.age) tags.push(animal.age);
  if (animal.coat) tags.push(animal.coat);
  if (animal.colors?.primary) tags.push(animal.colors.primary);
  if (animal.attributes?.spayed_neutered) tags.push("Spayed/Neutered");
  if (animal.attributes?.house_trained) tags.push("House Trained");
  if (animal.attributes?.special_needs) tags.push("Special Needs");
  if (animal.attributes?.shots_current) tags.push("Shots Current");
  if (animal.environment?.children) tags.push("Good with Kids");
  if (animal.environment?.dogs) tags.push("Good with Dogs");
  if (animal.environment?.cats) tags.push("Good with Cats");
  if (Array.isArray(animal.tags)) {
    tags.push(...animal.tags);
  }
  return [...new Set(tags)];
}
function normalizeAnimal(animal) {
  const species = (animal.type || "").toLowerCase();
  return {
    externalId: String(animal.id),
    name: animal.name || "Unknown",
    species: species === "cat" ? "cat" : "dog",
    breed: animal.breeds?.primary || null,
    age: animal.age || null,
    description: animal.description || null,
    photos: (animal.photos || []).map((p) => p.full || p.large || p.medium || p.small).filter(Boolean),
    adoptionUrl: animal.url || null,
    isAvailable: animal.status === "adoptable",
    tags: extractTags(animal)
  };
}
var cachedToken, tokenExpiresAt, petfinderProvider;
var init_petfinder = __esm({
  "server/import/petfinder.ts"() {
    "use strict";
    cachedToken = null;
    tokenExpiresAt = 0;
    petfinderProvider = {
      name: "petfinder",
      async searchOrganizations(query, location) {
        const params = { limit: "20" };
        if (query) params.name = query;
        if (location) params.location = location;
        const data = await petfinderGet("/organizations", params);
        return (data.organizations || []).map((org) => ({
          externalId: org.id,
          name: org.name,
          location: org.address ? [org.address.city, org.address.state].filter(Boolean).join(", ") : null,
          website: org.website || null
        }));
      },
      async fetchAnimals(orgId) {
        const animals = [];
        let page = 1;
        const maxPages = 10;
        while (page <= maxPages) {
          const data = await petfinderGet("/animals", {
            organization: orgId,
            status: "adoptable",
            limit: "100",
            page: String(page)
          });
          const batch = (data.animals || []).map(normalizeAnimal);
          animals.push(...batch);
          const totalPages = data.pagination?.total_pages || 1;
          if (page >= totalPages) break;
          page++;
        }
        return animals;
      }
    };
  }
});

// server/import/rescuegroups.ts
async function rescuegroupsGet(path5) {
  const apiKey = process.env.RESCUEGROUPS_API_KEY;
  if (!apiKey) {
    throw new Error("RescueGroups API key not configured");
  }
  const res = await fetch(`https://api.rescuegroups.org/v5${path5}`, {
    headers: { Authorization: apiKey }
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`RescueGroups API error ${res.status}: ${body}`);
  }
  return res.json();
}
function extractTags2(animal) {
  const tags = [];
  const attrs = animal.attributes || {};
  if (attrs.breedPrimary) tags.push(attrs.breedPrimary);
  if (attrs.breedSecondary) tags.push(attrs.breedSecondary);
  if (attrs.colorDetails) tags.push(attrs.colorDetails);
  if (attrs.sizeGroup) tags.push(attrs.sizeGroup);
  if (attrs.ageGroup) tags.push(attrs.ageGroup);
  if (attrs.sex) tags.push(attrs.sex);
  if (attrs.isHousetrained) tags.push("House Trained");
  if (attrs.isSpecialNeeds) tags.push("Special Needs");
  if (attrs.isMicrochipped) tags.push("Microchipped");
  if (attrs.isOKWithDogs) tags.push("Good with Dogs");
  if (attrs.isOKWithCats) tags.push("Good with Cats");
  if (attrs.isOKWithKids) tags.push("Good with Kids");
  return [...new Set(tags)];
}
function normalizeAnimal2(animal) {
  const attrs = animal.attributes || {};
  const species = (attrs.species || "").toLowerCase();
  const photos = [];
  if (attrs.pictureThumbnailUrl) photos.push(attrs.pictureThumbnailUrl);
  return {
    externalId: String(animal.id),
    name: attrs.name || "Unknown",
    species: species === "cat" ? "cat" : "dog",
    breed: attrs.breedPrimary || null,
    age: attrs.ageGroup || attrs.ageString || null,
    description: attrs.descriptionText || attrs.description || null,
    photos,
    adoptionUrl: attrs.url || null,
    isAvailable: (attrs.status || "").toLowerCase() === "available",
    tags: extractTags2(animal)
  };
}
var rescuegroupsProvider;
var init_rescuegroups = __esm({
  "server/import/rescuegroups.ts"() {
    "use strict";
    rescuegroupsProvider = {
      name: "rescuegroups",
      async searchOrganizations(query) {
        const encodedQuery = encodeURIComponent(query);
        const data = await rescuegroupsGet(
          `/public/orgs?filter[name]=${encodedQuery}&limit=20`
        );
        return (data.data || []).map((org) => ({
          externalId: String(org.id),
          name: org.attributes?.name || "Unknown",
          location: org.attributes?.city && org.attributes?.state ? `${org.attributes.city}, ${org.attributes.state}` : null,
          website: org.attributes?.url || null
        }));
      },
      async fetchAnimals(orgId) {
        const animals = [];
        let page = 1;
        const maxPages = 10;
        while (page <= maxPages) {
          const data = await rescuegroupsGet(
            `/public/animals?filter[orgID]=${orgId}&filter[status]=Available&limit=100&page=${page}`
          );
          const batch = (data.data || []).map(normalizeAnimal2);
          animals.push(...batch);
          const totalPages = data.meta?.pages || 1;
          if (page >= totalPages) break;
          page++;
        }
        return animals;
      }
    };
  }
});

// server/import/shelterluv.ts
function extractTags3(animal) {
  const tags = [];
  if (animal.Breed) tags.push(animal.Breed);
  if (animal.Color) tags.push(animal.Color);
  if (animal.Size) tags.push(animal.Size);
  if (animal.Sex) tags.push(animal.Sex);
  if (animal.Age) tags.push(animal.Age);
  if (animal.Pattern) tags.push(animal.Pattern);
  return [...new Set(tags.filter(Boolean))];
}
function normalizeAnimal3(animal) {
  const type = (animal.Type || "").toLowerCase();
  const photos = [];
  if (Array.isArray(animal.Photos)) {
    for (const photo of animal.Photos) {
      if (typeof photo === "string") {
        photos.push(photo);
      } else if (photo?.Url) {
        photos.push(photo.Url);
      } else if (photo?.url) {
        photos.push(photo.url);
      }
    }
  }
  if (photos.length === 0 && animal.CoverPhoto) {
    photos.push(animal.CoverPhoto);
  }
  const animalId = String(animal.ID || animal["Internal-ID"]);
  return {
    externalId: animalId,
    name: animal.Name || "Unknown",
    species: type === "cat" ? "cat" : "dog",
    breed: animal.Breed || null,
    age: animal.Age || null,
    description: animal.Description || null,
    photos,
    adoptionUrl: null,
    isAvailable: (animal.Status || "").toLowerCase() === "available",
    tags: extractTags3(animal)
  };
}
var shelterluvProvider;
var init_shelterluv = __esm({
  "server/import/shelterluv.ts"() {
    "use strict";
    shelterluvProvider = {
      name: "shelterluv",
      async searchOrganizations(_query) {
        return [];
      },
      async fetchAnimals(apiKey) {
        if (!apiKey) {
          throw new Error("ShelterLuv API key is required");
        }
        const animals = [];
        let offset = 0;
        const limit = 100;
        const maxIterations = 20;
        for (let i = 0; i < maxIterations; i++) {
          const res = await fetch(
            `https://new.shelterluv.com/api/v1/animals?offset=${offset}&limit=${limit}&status_type=publishable`,
            {
              headers: { "X-Api-Key": apiKey }
            }
          );
          if (!res.ok) {
            if (res.status === 401 || res.status === 403) {
              throw new Error("Invalid ShelterLuv API key. Please check your key and try again.");
            }
            const body = await res.text().catch(() => "");
            throw new Error(`ShelterLuv API error ${res.status}: ${body}`);
          }
          const data = await res.json();
          const batch = (data.animals || []).map(normalizeAnimal3);
          animals.push(...batch);
          const totalCount = data.total_count || 0;
          offset += limit;
          if (offset >= totalCount || batch.length === 0) break;
        }
        return animals;
      }
    };
  }
});

// server/import/demo.ts
var DEMO_ANIMALS, demoProvider;
var init_demo = __esm({
  "server/import/demo.ts"() {
    "use strict";
    DEMO_ANIMALS = [
      {
        externalId: "demo-001",
        name: "Bella",
        species: "dog",
        breed: "Golden Retriever",
        age: "Adult",
        description: "Bella is a sweet, gentle Golden Retriever who loves long walks and belly rubs. She's great with kids and other dogs. House-trained and knows basic commands.",
        photos: [
          "https://images.unsplash.com/photo-1552053831-71594a27632d?w=600&h=600&fit=crop",
          "https://images.unsplash.com/photo-1612774412771-005ed8e861d2?w=600&h=600&fit=crop",
          "https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=600&h=600&fit=crop"
        ],
        adoptionUrl: null,
        isAvailable: true,
        tags: ["Golden Retriever", "Large", "Adult", "Female", "House Trained", "Good with Kids", "Good with Dogs"]
      },
      {
        externalId: "demo-002",
        name: "Max",
        species: "dog",
        breed: "German Shepherd",
        age: "Young",
        description: "Max is an energetic young German Shepherd looking for an active family. He loves to play fetch and go on hikes. Loyal and protective.",
        photos: [
          "https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=600&h=600&fit=crop",
          "https://images.unsplash.com/photo-1568572933382-74d440642117?w=600&h=600&fit=crop"
        ],
        adoptionUrl: null,
        isAvailable: true,
        tags: ["German Shepherd", "Large", "Young", "Male", "Shots Current", "Neutered"]
      },
      {
        externalId: "demo-003",
        name: "Luna",
        species: "cat",
        breed: "Domestic Shorthair",
        age: "Adult",
        description: "Luna is a calm, affectionate tabby who loves sunny spots and gentle pets. She'd do best in a quiet home.",
        photos: [
          "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&h=600&fit=crop",
          "https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=600&h=600&fit=crop",
          "https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?w=600&h=600&fit=crop"
        ],
        adoptionUrl: null,
        isAvailable: true,
        tags: ["Domestic Shorthair", "Medium", "Adult", "Female", "Spayed", "Indoor Only"]
      },
      {
        externalId: "demo-004",
        name: "Charlie",
        species: "dog",
        breed: "Labrador Retriever Mix",
        age: "Puppy",
        description: "Charlie is an adorable Lab mix puppy full of energy and love. He's learning basic commands and is crate trained. Great with everyone!",
        photos: [
          "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&h=600&fit=crop"
        ],
        adoptionUrl: null,
        isAvailable: true,
        tags: ["Labrador Retriever", "Medium", "Puppy", "Male", "Good with Kids", "Good with Dogs", "Good with Cats"]
      },
      {
        externalId: "demo-005",
        name: "Daisy",
        species: "dog",
        breed: "Beagle",
        age: "Senior",
        description: "Daisy is a sweet senior Beagle looking for a loving forever home. She's mellow, house-trained, and just wants a warm lap to rest on.",
        photos: [
          "https://images.unsplash.com/photo-1505628346881-b72b27e84530?w=600&h=600&fit=crop",
          "https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?w=600&h=600&fit=crop"
        ],
        adoptionUrl: null,
        isAvailable: true,
        tags: ["Beagle", "Small", "Senior", "Female", "House Trained", "Special Needs", "Spayed"]
      },
      {
        externalId: "demo-006",
        name: "Oliver",
        species: "cat",
        breed: "Orange Tabby",
        age: "Young",
        description: "Oliver is a playful orange tabby who loves toys and treats. He gets along great with other cats and is very social.",
        photos: [
          "https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=600&h=600&fit=crop",
          "https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=600&h=600&fit=crop"
        ],
        adoptionUrl: null,
        isAvailable: true,
        tags: ["Orange Tabby", "Medium", "Young", "Male", "Good with Cats", "Neutered", "Shots Current"]
      },
      {
        externalId: "demo-007",
        name: "Rocky",
        species: "dog",
        breed: "Pit Bull Terrier",
        age: "Adult",
        description: "Rocky is a big softie who loves cuddles and treats. He's strong but gentle, and walks well on a leash. Looking for someone to give him a second chance.",
        photos: [
          "https://images.unsplash.com/photo-1529429617124-95b109e86571?w=600&h=600&fit=crop",
          "https://images.unsplash.com/photo-1544568100-847a948585b9?w=600&h=600&fit=crop",
          "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=600&h=600&fit=crop"
        ],
        adoptionUrl: null,
        isAvailable: true,
        tags: ["Pit Bull Terrier", "Large", "Adult", "Male", "Neutered", "House Trained", "Leash Trained"]
      },
      {
        externalId: "demo-008",
        name: "Whiskers",
        species: "cat",
        breed: "Siamese Mix",
        age: "Senior",
        description: "Whiskers is a dignified Siamese mix who enjoys quiet afternoons and gentle brushing. She's very vocal and will always let you know when it's dinner time.",
        photos: [
          "https://images.unsplash.com/photo-1561948955-570b270e7c36?w=600&h=600&fit=crop"
        ],
        adoptionUrl: null,
        isAvailable: true,
        tags: ["Siamese", "Medium", "Senior", "Female", "Spayed", "Indoor Only", "Special Needs"]
      }
    ];
    demoProvider = {
      name: "demo",
      async searchOrganizations(_query) {
        return [];
      },
      async fetchAnimals(_key) {
        await new Promise((resolve) => setTimeout(resolve, 1200));
        return DEMO_ANIMALS;
      }
    };
  }
});

// server/import/index.ts
var import_exports = {};
__export(import_exports, {
  downloadPhotoAsBase64: () => downloadPhotoAsBase64,
  getAvailableProviders: () => getAvailableProviders,
  getProvider: () => getProvider
});
function getProvider(name) {
  const provider = providers[name];
  if (!provider) {
    throw new Error(`Unknown import provider: ${name}. Available: ${Object.keys(providers).join(", ")}`);
  }
  return provider;
}
function getAvailableProviders() {
  return [
    { name: "petfinder", configured: !!(process.env.PETFINDER_API_KEY && process.env.PETFINDER_API_SECRET) },
    { name: "rescuegroups", configured: !!process.env.RESCUEGROUPS_API_KEY },
    { name: "shelterluv", configured: true }
    // Always available — per-org keys
  ];
}
async function downloadPhotoAsBase64(photoUrl) {
  try {
    const res = await fetch(photoUrl, { signal: AbortSignal.timeout(3e4) });
    if (!res.ok) return null;
    const contentType = res.headers.get("content-type") || "image/jpeg";
    const buffer = await res.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");
    return `data:${contentType};base64,${base64}`;
  } catch (e) {
    console.error(`[import] Failed to download photo from ${photoUrl}:`, e.message);
    return null;
  }
}
var providers;
var init_import = __esm({
  "server/import/index.ts"() {
    "use strict";
    init_petfinder();
    init_rescuegroups();
    init_shelterluv();
    init_demo();
    providers = {
      petfinder: petfinderProvider,
      rescuegroups: rescuegroupsProvider,
      shelterluv: shelterluvProvider,
      demo: demoProvider
    };
  }
});

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
          "@shared": import_path3.default.resolve(import_meta2.dirname, "shared")
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

// server/auth.ts
var import_supabase_js = require("@supabase/supabase-js");
var import_express_rate_limit = __toESM(require("express-rate-limit"), 1);

// server/auth-storage.ts
init_auth();
init_db();
var import_drizzle_orm3 = require("drizzle-orm");
var AuthStorage = class {
  async getUser(id) {
    const [user] = await db.select().from(users).where((0, import_drizzle_orm3.eq)(users.id, id));
    return user;
  }
  async upsertUser(userData) {
    if (userData.id) {
      const existingById = await this.getUser(userData.id);
      if (existingById) {
        const [updated] = await db.update(users).set({ ...userData, updatedAt: /* @__PURE__ */ new Date() }).where((0, import_drizzle_orm3.eq)(users.id, userData.id)).returning();
        return updated;
      }
    }
    if (userData.email) {
      const [existingByEmail] = await db.select().from(users).where((0, import_drizzle_orm3.eq)(users.email, userData.email));
      if (existingByEmail) {
        const [updated] = await db.update(users).set({ ...userData, updatedAt: /* @__PURE__ */ new Date() }).where((0, import_drizzle_orm3.eq)(users.email, userData.email)).returning();
        return updated;
      }
    }
    try {
      const [user] = await db.insert(users).values(userData).returning();
      return user;
    } catch (e) {
      if (e?.code === "23505" && userData.email) {
        const [existingByEmail] = await db.select().from(users).where((0, import_drizzle_orm3.eq)(users.email, userData.email));
        if (existingByEmail) {
          const { id: _ignoreId, ...mutableFields } = userData;
          const [updated] = await db.update(users).set({ ...mutableFields, updatedAt: /* @__PURE__ */ new Date() }).where((0, import_drizzle_orm3.eq)(users.email, userData.email)).returning();
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
  let token;
  if (authHeader?.startsWith("Bearer ")) {
    token = authHeader.substring(7);
  } else if (req.query.token) {
    token = req.query.token;
  }
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
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
      const userEmail = req.user.claims.email;
      const user = await authStorage.getUser(userId);
      const isAdmin2 = userEmail === process.env.ADMIN_EMAIL;
      res.json({ ...user, isAdmin: isAdmin2 });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });
  const signupRateLimiter = (0, import_express_rate_limit.default)({
    windowMs: 60 * 1e3,
    max: 5,
    message: { error: "Too many signup attempts. Please wait a minute." },
    standardHeaders: true,
    legacyHeaders: false
  });
  app2.post("/api/auth/signup", signupRateLimiter, async (req, res) => {
    try {
      const { email, password, firstName, lastName, acceptedTerms } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
      }
      if (password.length < 6) {
        return res.status(400).json({ error: "Password must be at least 6 characters" });
      }
      if (!acceptedTerms) {
        return res.status(400).json({ error: "You must accept the Terms of Service and Privacy Policy" });
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
      try {
        const { pool: pool2 } = await Promise.resolve().then(() => (init_db(), db_exports));
        await pool2.query(
          "UPDATE users SET terms_accepted_at = NOW(), privacy_accepted_at = NOW() WHERE id = $1",
          [data.user.id]
        );
      } catch (consentErr) {
        console.error("Failed to record consent:", consentErr);
      }
      res.json({ user: { id: data.user.id, email: data.user.email } });
    } catch (error) {
      console.error("Signup error:", error);
      res.status(500).json({ error: "Failed to create account" });
    }
  });
}

// server/storage.ts
init_db();
var import_drizzle_orm4 = require("drizzle-orm");
init_schema();
init_auth();
var DatabaseStorage = class {
  // Users
  async getUser(id) {
    const [user] = await db.select().from(users).where((0, import_drizzle_orm4.eq)(users.id, id));
    return user;
  }
  async getAllUsers() {
    return db.select().from(users);
  }
  // Subscription Plans
  async getSubscriptionPlan(id) {
    const [plan] = await db.select().from(subscriptionPlans).where((0, import_drizzle_orm4.eq)(subscriptionPlans.id, id));
    return plan;
  }
  async getAllSubscriptionPlans() {
    return db.select().from(subscriptionPlans).where((0, import_drizzle_orm4.eq)(subscriptionPlans.isActive, true));
  }
  async updateSubscriptionPlan(id, data) {
    await db.update(subscriptionPlans).set(data).where((0, import_drizzle_orm4.eq)(subscriptionPlans.id, id));
  }
  // Organizations
  async getOrganization(id) {
    const [org] = await db.select().from(organizations).where((0, import_drizzle_orm4.eq)(organizations.id, id));
    return org;
  }
  async getOrganizationBySlug(slug) {
    const [org] = await db.select().from(organizations).where((0, import_drizzle_orm4.eq)(organizations.slug, slug));
    return org;
  }
  async getOrganizationByOwner(ownerId) {
    const [org] = await db.select().from(organizations).where((0, import_drizzle_orm4.eq)(organizations.ownerId, ownerId));
    return org;
  }
  async getAllOrganizations() {
    return db.select().from(organizations).orderBy((0, import_drizzle_orm4.desc)(organizations.createdAt));
  }
  async createOrganization(org) {
    const [created] = await db.insert(organizations).values(org).returning();
    return created;
  }
  async updateOrganization(id, org) {
    const [updated] = await db.update(organizations).set(org).where((0, import_drizzle_orm4.eq)(organizations.id, id)).returning();
    return updated;
  }
  async updateOrganizationStripeInfo(id, stripeInfo) {
    const { stripeTestMode, ...drizzleFields } = stripeInfo;
    if (Object.keys(drizzleFields).length > 0) {
      await db.update(organizations).set(drizzleFields).where((0, import_drizzle_orm4.eq)(organizations.id, id));
    }
    if (stripeTestMode !== void 0) {
      try {
        await pool.query("UPDATE organizations SET stripe_test_mode = $1 WHERE id = $2", [stripeTestMode, id]);
      } catch (e) {
        console.warn("[stripe] Could not set stripeTestMode:", e.message);
      }
    }
    const [updated] = await db.select().from(organizations).where((0, import_drizzle_orm4.eq)(organizations.id, id));
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
    await db.update(organizations).set({ ownerId: null }).where((0, import_drizzle_orm4.eq)(organizations.id, id));
  }
  async deleteOrganization(id) {
    await db.delete(organizations).where((0, import_drizzle_orm4.eq)(organizations.id, id));
  }
  // Dogs
  async getDog(id) {
    const [dog] = await db.select().from(dogs).where((0, import_drizzle_orm4.eq)(dogs.id, id));
    return dog;
  }
  async getDogsByOrganization(orgId) {
    return db.select().from(dogs).where((0, import_drizzle_orm4.eq)(dogs.organizationId, orgId)).orderBy((0, import_drizzle_orm4.desc)(dogs.createdAt));
  }
  async getAllDogs() {
    return db.select().from(dogs).orderBy((0, import_drizzle_orm4.desc)(dogs.createdAt));
  }
  async createDog(dog) {
    const [created] = await db.insert(dogs).values(dog).returning();
    return created;
  }
  async updateDog(id, dog) {
    const [updated] = await db.update(dogs).set(dog).where((0, import_drizzle_orm4.eq)(dogs.id, id)).returning();
    return updated;
  }
  async deleteDog(id) {
    await db.delete(dogs).where((0, import_drizzle_orm4.eq)(dogs.id, id));
  }
  async findDogByExternalId(externalId, externalSource, orgId) {
    const [dog] = await db.select().from(dogs).where(
      (0, import_drizzle_orm4.and)(
        (0, import_drizzle_orm4.eq)(dogs.externalId, externalId),
        (0, import_drizzle_orm4.eq)(dogs.externalSource, externalSource),
        (0, import_drizzle_orm4.eq)(dogs.organizationId, orgId)
      )
    );
    return dog;
  }
  // Portrait Styles
  async getPortraitStyle(id) {
    const [style] = await db.select().from(portraitStyles).where((0, import_drizzle_orm4.eq)(portraitStyles.id, id));
    return style;
  }
  async getAllPortraitStyles() {
    return db.select().from(portraitStyles);
  }
  // Portraits
  async getPortrait(id) {
    const [portrait] = await db.select().from(portraits).where((0, import_drizzle_orm4.eq)(portraits.id, id));
    return portrait;
  }
  async getPortraitByDogAndStyle(dogId, styleId) {
    const [portrait] = await db.select().from(portraits).where((0, import_drizzle_orm4.and)((0, import_drizzle_orm4.eq)(portraits.dogId, dogId), (0, import_drizzle_orm4.eq)(portraits.styleId, styleId)));
    return portrait;
  }
  async getPortraitsByDog(dogId) {
    return db.select().from(portraits).where((0, import_drizzle_orm4.eq)(portraits.dogId, dogId)).orderBy((0, import_drizzle_orm4.desc)(portraits.createdAt));
  }
  async getSelectedPortraitByDog(dogId) {
    const [selected] = await db.select().from(portraits).where((0, import_drizzle_orm4.and)((0, import_drizzle_orm4.eq)(portraits.dogId, dogId), (0, import_drizzle_orm4.eq)(portraits.isSelected, true))).orderBy((0, import_drizzle_orm4.desc)(portraits.createdAt)).limit(1);
    if (selected) return selected;
    const [fallback] = await db.select().from(portraits).where((0, import_drizzle_orm4.eq)(portraits.dogId, dogId)).orderBy((0, import_drizzle_orm4.desc)(portraits.createdAt)).limit(1);
    return fallback;
  }
  async createPortrait(portrait) {
    const [created] = await db.insert(portraits).values(portrait).returning();
    return created;
  }
  async updatePortrait(id, portrait) {
    const [updated] = await db.update(portraits).set(portrait).where((0, import_drizzle_orm4.eq)(portraits.id, id)).returning();
    return updated;
  }
  async deletePortrait(id) {
    await db.delete(portraits).where((0, import_drizzle_orm4.eq)(portraits.id, id));
  }
  async selectPortraitForGallery(dogId, portraitId) {
    await db.transaction(async (tx) => {
      await tx.update(portraits).set({ isSelected: false }).where((0, import_drizzle_orm4.eq)(portraits.dogId, dogId));
      await tx.update(portraits).set({ isSelected: true }).where((0, import_drizzle_orm4.and)((0, import_drizzle_orm4.eq)(portraits.id, portraitId), (0, import_drizzle_orm4.eq)(portraits.dogId, dogId)));
    });
  }
  async incrementPortraitEditCount(portraitId) {
    await db.update(portraits).set({ editCount: import_drizzle_orm4.sql`COALESCE(${portraits.editCount}, 0) + 1` }).where((0, import_drizzle_orm4.eq)(portraits.id, portraitId));
  }
  async incrementOrgPortraitsUsed(orgId) {
    await db.update(organizations).set({ portraitsUsedThisMonth: import_drizzle_orm4.sql`COALESCE(${organizations.portraitsUsedThisMonth}, 0) + 1` }).where((0, import_drizzle_orm4.eq)(organizations.id, orgId));
  }
  async getAccurateCreditsUsed(orgId) {
    const [org] = await db.select().from(organizations).where((0, import_drizzle_orm4.eq)(organizations.id, orgId));
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
    const rows = await db.select({ count: import_drizzle_orm4.sql`count(*)` }).from(portraits).innerJoin(dogs, (0, import_drizzle_orm4.eq)(portraits.dogId, dogs.id)).where(
      (0, import_drizzle_orm4.and)(
        (0, import_drizzle_orm4.eq)(dogs.organizationId, orgId),
        (0, import_drizzle_orm4.gte)(portraits.createdAt, effectiveCycleStart)
      )
    );
    const creditsUsed = Number(rows[0]?.count ?? 0);
    return { creditsUsed, billingCycleStart: effectiveCycleStart };
  }
  async syncOrgCredits(orgId) {
    const { creditsUsed, billingCycleStart } = await this.getAccurateCreditsUsed(orgId);
    const [org] = await db.select().from(organizations).where((0, import_drizzle_orm4.eq)(organizations.id, orgId));
    if (!org) return void 0;
    const updates = {};
    if (org.portraitsUsedThisMonth !== creditsUsed) {
      updates.portraitsUsedThisMonth = creditsUsed;
    }
    if (billingCycleStart && (!org.billingCycleStart || org.billingCycleStart.getTime() !== billingCycleStart.getTime())) {
      updates.billingCycleStart = billingCycleStart;
    }
    if (Object.keys(updates).length > 0) {
      const [updated] = await db.update(organizations).set(updates).where((0, import_drizzle_orm4.eq)(organizations.id, orgId)).returning();
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
        await db.update(organizations).set(updates).where((0, import_drizzle_orm4.eq)(organizations.id, org.id));
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
      await db.execute(import_drizzle_orm4.sql.raw(
        `SELECT setval('${seq}', GREATEST((SELECT COALESCE(MAX(id), 0) FROM ${table}), 1))`
      ));
      const maxResult = await db.execute(import_drizzle_orm4.sql.raw(`SELECT MAX(id) as max_id FROM ${table}`));
      const seqResult = await db.execute(import_drizzle_orm4.sql.raw(`SELECT last_value FROM ${seq}`));
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

// server/routes/helpers.ts
var import_express_rate_limit2 = __toESM(require("express-rate-limit"), 1);

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

// server/routes/helpers.ts
var ADMIN_EMAIL = process.env.ADMIN_EMAIL;
var MAX_ADDITIONAL_SLOTS = 5;
var MAX_EDITS_PER_IMAGE = 4;
function getUserId(req) {
  return req.user.claims.sub;
}
function getUserEmail(req) {
  return req.user.claims.email;
}
function isUserAdmin(req) {
  return getUserEmail(req) === ADMIN_EMAIL;
}
var isAdmin = async (req, res, next) => {
  if (!req.user?.claims?.email || req.user.claims.email !== ADMIN_EMAIL) {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
};
var aiRateLimiter = (0, import_express_rate_limit2.default)({
  windowMs: 60 * 1e3,
  max: 10,
  message: { error: "Too many requests. Please wait a minute before generating more portraits." },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.user?.claims?.sub || "anonymous",
  validate: { xForwardedForHeader: false }
});
var apiRateLimiter = (0, import_express_rate_limit2.default)({
  windowMs: 60 * 1e3,
  max: 100,
  message: { error: "Too many requests. Please try again shortly." },
  standardHeaders: true,
  legacyHeaders: false
});
var smsRateLimiter = (0, import_express_rate_limit2.default)({
  windowMs: 60 * 1e3,
  max: 5,
  message: { error: "Too many texts sent. Please wait a minute." },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.user?.claims?.sub || "anonymous"
});
function sanitizeForPrompt(input) {
  return input.replace(/[^\w\s\-'.,:;!?()]/g, "").trim();
}
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
async function getOrgForUser(req, orgIdParam) {
  const userId = getUserId(req);
  const admin = isUserAdmin(req);
  if (admin && orgIdParam) {
    return storage.getOrganization(orgIdParam);
  }
  return storage.getOrganizationByOwner(userId);
}

// server/routes/startup.ts
var ADMIN_EMAIL2 = process.env.ADMIN_EMAIL;
async function runStartupHealthCheck() {
  try {
    if (ADMIN_EMAIL2) {
      const allOrgsStartup = await storage.getAllOrganizations();
      const users2 = await storage.getAllUsers();
      let adminUserId = null;
      const adminUser = users2.find((u) => u.email === ADMIN_EMAIL2);
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
}

// server/routes/public.ts
function registerPublicRoutes(app2) {
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
}

// server/routes/organizations.ts
function registerOrganizationRoutes(app2) {
  app2.get("/api/my-organization", isAuthenticated, async (req, res) => {
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
      const userId = getUserId(req);
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
}

// server/routes/dogs.ts
var import_zod = require("zod");

// shared/content-filter.ts
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
var breedAliases = {
  // Dogs — common external names
  "pit bull": "American Staffordshire Terrier",
  "pit bull terrier": "American Staffordshire Terrier",
  "american pit bull terrier": "American Staffordshire Terrier",
  "pitbull": "American Staffordshire Terrier",
  "apbt": "American Staffordshire Terrier",
  "am staff": "American Staffordshire Terrier",
  "amstaff": "American Staffordshire Terrier",
  "staffie": "Staffordshire Bull Terrier",
  "staffy": "Staffordshire Bull Terrier",
  "lab": "Labrador Retriever",
  "labrador": "Labrador Retriever",
  "yellow lab": "Labrador Retriever",
  "black lab": "Labrador Retriever",
  "chocolate lab": "Labrador Retriever",
  "golden": "Golden Retriever",
  "shepherd": "German Shepherd Dog",
  "german shepherd": "German Shepherd Dog",
  "gsd": "German Shepherd Dog",
  "husky": "Siberian Husky",
  "malamute": "Alaskan Malamute",
  "cattle dog": "Australian Cattle Dog",
  "blue heeler": "Australian Cattle Dog",
  "red heeler": "Australian Cattle Dog",
  "heeler": "Australian Cattle Dog",
  "aussie": "Australian Shepherd",
  "mini aussie": "Miniature American Shepherd",
  "miniature australian shepherd": "Miniature American Shepherd",
  "corgi": "Pembroke Welsh Corgi",
  "pembroke corgi": "Pembroke Welsh Corgi",
  "cardigan corgi": "Cardigan Welsh Corgi",
  "poodle (standard)": "Poodle",
  "standard poodle": "Poodle",
  "miniature poodle": "Poodle",
  "toy poodle": "Poodle",
  "doxie": "Dachshund",
  "dachshund (standard)": "Dachshund",
  "dachshund (miniature)": "Dachshund",
  "wiener dog": "Dachshund",
  "weiner dog": "Dachshund",
  "dobie": "Doberman Pinscher",
  "doberman": "Doberman Pinscher",
  "great pyr": "Great Pyrenees",
  "pyrenees": "Great Pyrenees",
  "pyr": "Great Pyrenees",
  "berner": "Bernese Mountain Dog",
  "bernese": "Bernese Mountain Dog",
  "jack russell": "Russell Terrier",
  "jack russell terrier": "Russell Terrier",
  "jrt": "Russell Terrier",
  "yorkie": "Yorkshire Terrier",
  "shih-tzu": "Shih Tzu",
  "shihtzu": "Shih Tzu",
  "frenchie": "French Bulldog",
  "french bully": "French Bulldog",
  "english bulldog": "Bulldog",
  "olde english bulldog": "Bulldog",
  "olde english bulldogge": "Bulldog",
  "american bully": "American Bulldog",
  "schnauzer": "Standard Schnauzer",
  "schnauzer (standard)": "Standard Schnauzer",
  "schnauzer (miniature)": "Miniature Schnauzer",
  "schnauzer (giant)": "Giant Schnauzer",
  "mini schnauzer": "Miniature Schnauzer",
  "shar pei": "Chinese Shar-Pei",
  "shar-pei": "Chinese Shar-Pei",
  "sharpei": "Chinese Shar-Pei",
  "st. bernard": "Saint Bernard",
  "st bernard": "Saint Bernard",
  "wheaten": "Soft Coated Wheaten Terrier",
  "wheaten terrier": "Soft Coated Wheaten Terrier",
  "westie": "West Highland White Terrier",
  "west highland terrier": "West Highland White Terrier",
  "scottie": "Scottish Terrier",
  "pom": "Pomeranian",
  "king charles spaniel": "Cavalier King Charles Spaniel",
  "cavalier": "Cavalier King Charles Spaniel",
  "ckcs": "Cavalier King Charles Spaniel",
  "cocker": "Cocker Spaniel",
  "springer spaniel": "English Springer Spaniel",
  "springer": "English Springer Spaniel",
  "english springer": "English Springer Spaniel",
  "welsh corgi": "Pembroke Welsh Corgi",
  "sheltie": "Shetland Sheepdog",
  "newf": "Newfoundland",
  "newfie": "Newfoundland",
  "dane": "Great Dane",
  "ridgeback": "Rhodesian Ridgeback",
  "rhodesian": "Rhodesian Ridgeback",
  "weimeraner": "Weimaraner",
  "pointer (german shorthaired)": "German Shorthaired Pointer",
  "coonhound": "Black and Tan Coonhound",
  "plott": "Plott Hound",
  "treeing walker": "Treeing Walker Coonhound",
  "mountain cur": "Mixed Breed",
  "feist": "Mixed Breed",
  "hound": "Mixed Breed",
  "terrier": "Mixed Breed",
  "spaniel": "Mixed Breed",
  "retriever": "Mixed Breed",
  "cur": "Mixed Breed",
  "mutt": "Mixed Breed",
  "mixed": "Mixed Breed",
  "mixed breed": "Mixed Breed",
  // Cats — common external names
  "domestic shorthair": "American Shorthair",
  "domestic short hair": "American Shorthair",
  "dsh": "American Shorthair",
  "domestic mediumhair": "American Shorthair",
  "domestic medium hair": "American Shorthair",
  "dmh": "American Shorthair",
  "domestic longhair": "American Shorthair",
  "domestic long hair": "American Shorthair",
  "dlh": "American Shorthair",
  "tabby": "American Shorthair",
  "tuxedo": "American Shorthair",
  "calico": "American Shorthair",
  "tortoiseshell": "American Shorthair",
  "tortie": "American Shorthair",
  "orange tabby": "American Shorthair",
  "gray tabby": "American Shorthair",
  "brown tabby": "American Shorthair",
  "black cat": "American Shorthair",
  "snowshoe": "Siamese",
  "flame point": "Siamese",
  "lynx point": "Siamese",
  "himalayan": "Persian",
  "munchkin": "Mixed Breed",
  "polydactyl": "Mixed Breed"
};
var dogBreedLower = /* @__PURE__ */ new Map();
var catBreedLower = /* @__PURE__ */ new Map();
for (const b of dogBreeds) {
  dogBreedLower.set(b.toLowerCase(), b);
  dogBreedLower.set(`${b.toLowerCase()} mix`, `${b} Mix`);
}
for (const b of catBreeds) {
  catBreedLower.set(b.toLowerCase(), b);
  catBreedLower.set(`${b.toLowerCase()} mix`, `${b} Mix`);
}
function normalizeBreed(breed, species) {
  if (!breed || !breed.trim()) return { breed: null, matched: false };
  const trimmed = breed.trim();
  const lower = trimmed.toLowerCase();
  if (isValidBreed(trimmed, species)) {
    return { breed: trimmed, matched: true };
  }
  const breedMap = species === "cat" ? catBreedLower : species === "dog" ? dogBreedLower : null;
  if (breedMap) {
    const found = breedMap.get(lower);
    if (found) return { breed: found, matched: true };
  } else {
    const foundDog = dogBreedLower.get(lower);
    if (foundDog) return { breed: foundDog, matched: true };
    const foundCat = catBreedLower.get(lower);
    if (foundCat) return { breed: foundCat, matched: true };
  }
  const isMix = /\s+mix$/i.test(lower);
  const baseLower = isMix ? lower.replace(/\s+mix$/i, "").trim() : lower;
  const aliased = breedAliases[baseLower];
  if (aliased) {
    const result = isMix && aliased !== "Mixed Breed" ? `${aliased} Mix` : aliased;
    return { breed: result, matched: true };
  }
  const allBreeds = species === "cat" ? catBreeds : species === "dog" ? dogBreeds : [...dogBreeds, ...catBreeds];
  for (const b of allBreeds) {
    const bLower = b.toLowerCase();
    if (bLower.includes(baseLower) || baseLower.includes(bLower)) {
      const result = isMix ? `${b} Mix` : b;
      return { breed: result, matched: true };
    }
  }
  const inputWords = new Set(baseLower.split(/\s+/).filter((w) => w.length > 2));
  if (inputWords.size > 0) {
    let bestBreed = "";
    let bestScore = 0;
    for (const b of allBreeds) {
      const bWords = b.toLowerCase().split(/\s+/).filter((w) => w.length > 2);
      let score = 0;
      for (const w of bWords) {
        if (inputWords.has(w)) score++;
      }
      if (score > bestScore) {
        bestScore = score;
        bestBreed = b;
      }
    }
    if (bestScore > 0) {
      const result = isMix ? `${bestBreed} Mix` : bestBreed;
      return { breed: result, matched: true };
    }
  }
  return { breed: trimmed, matched: false };
}

// server/routes/dogs.ts
function registerDogRoutes(app2) {
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
            return { ...dog, portrait: { ...portrait, style } };
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
      const limitParam = req.query.limit;
      const limit = limitParam !== void 0 ? parseInt(limitParam) : 24;
      const offset = parseInt(req.query.offset) || 0;
      res.setHeader("X-Total-Count", visibleDogs.length.toString());
      if (limit > 0) {
        res.json(visibleDogs.slice(offset, offset + limit));
      } else {
        res.json(visibleDogs);
      }
    } catch (error) {
      console.error("Error fetching dogs:", error);
      res.status(500).json({ error: "Failed to fetch dogs" });
    }
  });
  app2.get("/api/my-dogs", isAuthenticated, async (req, res) => {
    try {
      const userId = getUserId(req);
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
            return { ...dog, portrait: { ...portrait, style } };
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
      if (isNaN(id)) return res.status(400).json({ error: "Invalid pet ID" });
      const dog = await storage.getDog(id);
      if (!dog) {
        return res.status(404).json({ error: "Pet not found" });
      }
      const org = dog.organizationId ? await storage.getOrganization(dog.organizationId) : null;
      if (!org || !org.isActive || !dog.isAvailable) {
        return res.status(404).json({ error: "Pet not found" });
      }
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
        organizationWebsiteUrl: org?.websiteUrl || null,
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
      const userId = getUserId(req);
      const userEmail = getUserEmail(req);
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
      const userId = getUserId(req);
      const userEmail = getUserEmail(req);
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
        return res.status(400).json({
          error: `"${dogData.breed}" isn't recognized. Please select a breed from the dropdown list.`,
          code: "invalid_breed"
        });
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
      const userId = getUserId(req);
      const userEmail = getUserEmail(req);
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
}

// server/gemini.ts
var import_genai = require("@google/genai");

// server/semaphore.ts
var Semaphore = class {
  constructor(maxConcurrent) {
    this.maxConcurrent = maxConcurrent;
  }
  queue = [];
  active = 0;
  async acquire() {
    if (this.active < this.maxConcurrent) {
      this.active++;
      return;
    }
    return new Promise((resolve) => {
      this.queue.push(() => {
        this.active++;
        resolve();
      });
    });
  }
  release() {
    this.active--;
    const next = this.queue.shift();
    if (next) next();
  }
  async run(fn) {
    await this.acquire();
    try {
      return await fn();
    } finally {
      this.release();
    }
  }
};

// server/gemini.ts
var ai = new import_genai.GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});
var geminiSemaphore = new Semaphore(2);
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
var FIDELITY_PREFIX = `REFERENCE PHOTO ATTACHED \u2014 THE PHOTO IS THE GROUND TRUTH.
Study the attached photo carefully. This is the EXACT animal you must depict.

CRITICAL RULE \u2014 PHOTO OVERRIDES TEXT:
The style description below may mention a breed name (e.g., "Beagle", "Labrador", "Persian cat"). IGNORE any breed name in the text if it does not match what you see in the photo. The PHOTO is the sole authority on what this animal looks like. If the text says "Beagle" but the photo shows a Chow Chow, you MUST depict a Chow Chow. If the text says "Tabby" but the photo shows a Siamese, you MUST depict a Siamese. NEVER generate an animal that matches the text breed instead of the photo \u2014 the photo always wins.

COLOR AND PATTERN MATCHING IS THE #1 PRIORITY:
Most animals are NOT one uniform color. Study WHERE each color appears on this specific animal's body:
- Note which areas are lighter vs darker (chest, belly, legs, face, back, ears, tail)
- Note any two-tone or multi-tone patterns \u2014 e.g., white chest with reddish back, dark face with lighter body, tabby stripes, tuxedo markings, brindle patterns
- Note the EXACT boundaries where one color transitions to another
You must reproduce the PRECISE color of EACH body area \u2014 not a uniform "average" color, not a "typical" breed color, not a slightly different shade. If the chest is white and the back is reddish, the portrait must show a white chest and a reddish back in those same proportions. If there are patches, spots, or gradients, they must appear in the same locations. Do NOT simplify a multi-colored coat into one uniform tone. Do NOT let the artistic style, scene lighting, or background colors influence or shift the animal's actual coat colors.

You MUST also faithfully reproduce THIS SPECIFIC animal's:
- Face shape, muzzle, and facial structure
- Ear shape, size, and positioning
- Fur/coat texture and length
- Eye color and shape
- Body size and proportions
- Any unique distinguishing features (spots, patches, scars, etc.)

DO NOT substitute a generic or different-looking animal. DO NOT default to a "breed typical" appearance. The generated portrait must be unmistakably recognizable as the SAME individual animal in the reference photo.

Now apply the following artistic style while preserving this exact animal's appearance, coloring, and color distribution:

`;
async function generateWithImage(prompt, sourceImage) {
  const { mimeType, data } = parseBase64(sourceImage);
  const enhancedPrompt = FIDELITY_PREFIX + prompt;
  return geminiSemaphore.run(async () => {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: [{ role: "user", parts: [{ inlineData: { mimeType, data } }, { text: enhancedPrompt }] }],
      config: { responseModalities: [import_genai.Modality.TEXT, import_genai.Modality.IMAGE] }
    });
    return extractImageFromResponse(response);
  });
}
async function generateTextOnly(prompt) {
  for (let attempt = 0; attempt < 2; attempt++) {
    const result = await geminiSemaphore.run(async () => {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-image",
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        config: { responseModalities: [import_genai.Modality.TEXT, import_genai.Modality.IMAGE] }
      });
      return extractImageFromResponse(response);
    });
    if (result) return result;
  }
  throw new Error("Failed to generate image after retries");
}
async function editImage(currentImage, editPrompt) {
  const { mimeType, data } = parseBase64(currentImage);
  return geminiSemaphore.run(async () => {
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
  });
}

// server/generate-mockups.ts
var import_sharp = __toESM(require("sharp"), 1);
import_sharp.default.cache(false);
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

// server/routes/portraits.ts
function registerPortraitRoutes(app2) {
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
  app2.get("/api/dogs/:dogId/portraits", isAuthenticated, async (req, res) => {
    try {
      const dogId = parseInt(req.params.dogId);
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
  app2.post("/api/generate-portrait", isAuthenticated, aiRateLimiter, async (req, res) => {
    try {
      const userId = getUserId(req);
      const userEmail = getUserEmail(req);
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
      const userId = getUserId(req);
      const userEmail = getUserEmail(req);
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

// server/routes/plans-billing.ts
function registerPlansBillingRoutes(app2) {
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
      const userId = getUserId(req);
      const { planId, orgId, testMode: reqTestMode } = req.body;
      const testMode = reqTestMode === true;
      if (!planId) {
        return res.status(400).json({ error: "Plan ID is required" });
      }
      const plan = await storage.getSubscriptionPlan(planId);
      if (!plan || !plan.stripePriceId) {
        return res.status(400).json({ error: "Invalid plan selected" });
      }
      const callerEmail = getUserEmail(req);
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
      const userId = getUserId(req);
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
      const userEmail = getUserEmail(req);
      const callerIsAdmin = userEmail === ADMIN_EMAIL;
      if (!callerIsAdmin && org.ownerId !== userId) {
        return res.status(403).json({ error: "You do not have access to this organization" });
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
      const { stripeCustomerId: _sc, stripeSubscriptionId: _ss, ...safeUpdated } = updated;
      res.json(safeUpdated);
    } catch (error) {
      console.error("Error confirming checkout:", error);
      res.status(500).json({ error: "Failed to confirm subscription" });
    }
  });
  app2.post("/api/stripe/portal", isAuthenticated, async (req, res) => {
    try {
      const userId = getUserId(req);
      const callerEmail = getUserEmail(req);
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
      const userId = getUserId(req);
      const callerEmail = getUserEmail(req);
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
      const userId = getUserId(req);
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
      const callerEmail = getUserEmail(req);
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
      const userId = getUserId(req);
      const { orgId } = req.body;
      if (!orgId) {
        return res.status(400).json({ error: "Organization ID is required" });
      }
      const org = await storage.getOrganization(orgId);
      if (!org) {
        return res.status(400).json({ error: "Organization not found" });
      }
      const callerEmail = getUserEmail(req);
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
      const userId = getUserId(req);
      const callerEmail = getUserEmail(req);
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
      const userId = getUserId(req);
      const callerEmail = getUserEmail(req);
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
}

// server/routes/admin.ts
var import_zod2 = require("zod");
function registerAdminRoutes(app2) {
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
      if (error instanceof import_zod2.z.ZodError) {
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
          issues.push({ type: "no_plan", severity: "critical", orgId: org.id, orgName: org.name, dogCount, message: `Has ${dogCount} pet(s) but no plan assigned` });
        }
        if (!org.planId && org.subscriptionStatus === "trial") {
          issues.push({ type: "trial_no_plan", severity: "critical", orgId: org.id, orgName: org.name, message: `Status is "trial" but no plan assigned` });
        }
        if (org.planId && dogCount > 0) {
          const plan = await storage.getSubscriptionPlan(org.planId);
          if (plan?.dogsLimit) {
            const effectiveLimit = plan.dogsLimit + (org.additionalPetSlots || 0);
            if (dogCount > effectiveLimit) {
              issues.push({ type: "over_limit", severity: "warning", orgId: org.id, orgName: org.name, dogCount, petLimit: effectiveLimit, planName: plan.name, message: `Has ${dogCount} pet(s) but limit is ${effectiveLimit}` });
            }
          }
        }
      }
      res.json({ totalOrgs: allOrgs.length, issueCount: issues.length, issues });
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
}

// server/routes/sms.ts
function registerSmsRoutes(app2) {
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
      const twilioSid = process.env.TWILIO_ACCOUNT_SID;
      const twilioKeySid = process.env.TWILIO_API_KEY_SID;
      const twilioKeySecret = process.env.TWILIO_API_KEY_SECRET;
      const twilioMsgSvc = process.env.TWILIO_MESSAGING_SERVICE_SID;
      if (!twilioSid || !twilioKeySid || !twilioKeySecret || !twilioMsgSvc) {
        return res.status(503).json({ error: "SMS service is not configured" });
      }
      const phone = cleaned.startsWith("+") ? cleaned : cleaned.startsWith("1") ? `+${cleaned}` : `+1${cleaned}`;
      const twilioAuth = Buffer.from(`${twilioKeySid}:${twilioKeySecret}`).toString("base64");
      const twilioRes = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Authorization": `Basic ${twilioAuth}`
        },
        body: new URLSearchParams({ To: phone, MessagingServiceSid: twilioMsgSvc, Body: message }).toString()
      });
      if (!twilioRes.ok) {
        const err = await twilioRes.json();
        throw new Error(err.message || "Failed to send text message");
      }
      res.json({ success: true });
    } catch (error) {
      console.error("SMS send error:", error);
      const errMsg = error?.message || "Failed to send text message";
      res.status(500).json({ error: errMsg });
    }
  });
}

// server/routes/instagram.ts
init_db();
var AYRSHARE_API_URL = "https://api.ayrshare.com/api";
function getAyrshareHeaders(profileKey) {
  const headers = {
    "Authorization": `Bearer ${process.env.AYRSHARE_API_KEY}`,
    "Content-Type": "application/json"
  };
  if (profileKey) {
    headers["Profile-Key"] = profileKey;
  }
  return headers;
}
function registerInstagramRoutes(app2) {
  (async () => {
    try {
      await pool.query(`
        ALTER TABLE organizations
          ADD COLUMN IF NOT EXISTS ayrshare_profile_key TEXT,
          ADD COLUMN IF NOT EXISTS instagram_access_token TEXT,
          ADD COLUMN IF NOT EXISTS instagram_user_id TEXT,
          ADD COLUMN IF NOT EXISTS instagram_username TEXT,
          ADD COLUMN IF NOT EXISTS instagram_page_id TEXT,
          ADD COLUMN IF NOT EXISTS instagram_token_expires_at TIMESTAMP
      `);
      console.log("[instagram] DB columns ready (Ayrshare mode)");
    } catch (e) {
      console.warn("[instagram] Could not add columns:", e.message);
    }
  })();
  app2.get("/api/instagram/status", isAuthenticated, async (req, res) => {
    const apiKey = process.env.AYRSHARE_API_KEY;
    if (!apiKey) return res.json({ connected: false });
    try {
      const userId = getUserId(req);
      const email = getUserEmail(req);
      const userIsAdmin = email === ADMIN_EMAIL;
      const orgIdParam = req.query.orgId ? parseInt(req.query.orgId) : null;
      let org;
      if (userIsAdmin && orgIdParam) {
        org = await storage.getOrganization(orgIdParam);
      } else {
        org = await storage.getOrganizationByOwner(userId);
      }
      if (!org) return res.json({ connected: false });
      const result = await pool.query(
        "SELECT ayrshare_profile_key, instagram_username FROM organizations WHERE id = $1",
        [org.id]
      );
      const profileKey = result.rows[0]?.ayrshare_profile_key;
      const userRes = await fetch(`${AYRSHARE_API_URL}/user`, {
        headers: getAyrshareHeaders(profileKey)
      });
      const userData = await userRes.json();
      const connected = Array.isArray(userData.activeSocialAccounts) && userData.activeSocialAccounts.includes("instagram");
      const username = userData.displayNames?.instagram || result.rows[0]?.instagram_username || null;
      if (connected && username && username !== result.rows[0]?.instagram_username) {
        await pool.query("UPDATE organizations SET instagram_username = $1 WHERE id = $2", [username, org.id]);
      }
      res.json({ connected, username, orgId: org.id });
    } catch (error) {
      console.error("[instagram] Status error:", error);
      res.json({ connected: false });
    }
  });
  app2.get("/api/instagram/connect", isAuthenticated, async (req, res) => {
    const apiKey = process.env.AYRSHARE_API_KEY;
    if (!apiKey) return res.status(503).json({ error: "Instagram integration not configured" });
    try {
      const userId = getUserId(req);
      const email = getUserEmail(req);
      const userIsAdmin = email === ADMIN_EMAIL;
      const orgIdParam = req.query.orgId ? parseInt(req.query.orgId) : null;
      let orgId = null;
      if (userIsAdmin && orgIdParam) {
        orgId = orgIdParam;
      } else {
        const org = await storage.getOrganizationByOwner(userId);
        if (org) orgId = org.id;
      }
      if (!orgId) return res.status(400).json({ error: "No organization found" });
      const result = await pool.query(
        "SELECT ayrshare_profile_key FROM organizations WHERE id = $1",
        [orgId]
      );
      let profileKey = result.rows[0]?.ayrshare_profile_key;
      if (!profileKey) {
        const org = await storage.getOrganization(orgId);
        const profileRes = await fetch(`${AYRSHARE_API_URL}/profiles`, {
          method: "POST",
          headers: getAyrshareHeaders(),
          body: JSON.stringify({
            title: `PP-Org-${orgId}-${(org?.name || "Unknown").replace(/[^a-zA-Z0-9 ]/g, "").substring(0, 30)}`
          })
        });
        const profileData = await profileRes.json();
        if (profileData.profileKey) {
          profileKey = profileData.profileKey;
          await pool.query(
            "UPDATE organizations SET ayrshare_profile_key = $1 WHERE id = $2",
            [profileKey, orgId]
          );
          console.log(`[instagram] Created Ayrshare profile for org ${orgId}: ${profileKey}`);
        } else {
          console.error("[instagram] Failed to create Ayrshare profile:", profileData);
          return res.redirect("/settings?instagram=error&detail=" + encodeURIComponent(profileData.message || "profile_creation_failed"));
        }
      }
      const privateKey = process.env.AYRSHARE_PRIVATE_KEY;
      const domain = process.env.AYRSHARE_DOMAIN;
      if (!privateKey || !domain) {
        console.error("[instagram] Missing AYRSHARE_PRIVATE_KEY or AYRSHARE_DOMAIN env vars");
        return res.redirect("/settings?instagram=error&detail=missing_ayrshare_config");
      }
      const jwtRes = await fetch(`${AYRSHARE_API_URL}/profiles/generateJWT`, {
        method: "POST",
        headers: getAyrshareHeaders(),
        body: JSON.stringify({
          domain,
          privateKey: privateKey.replace(/\\n/g, "\n"),
          profileKey,
          redirect: `${process.env.NODE_ENV === "production" ? "https://pawtraitpals.com" : "http://localhost:5000"}/settings?instagram=connected`,
          allowedSocial: ["instagram"]
        })
      });
      const jwtData = await jwtRes.json();
      if (jwtData.url) {
        console.log(`[instagram] Redirecting org ${orgId} to Ayrshare Social Connect`);
        return res.redirect(jwtData.url);
      } else {
        console.error("[instagram] JWT generation failed:", jwtData);
        return res.redirect("/settings?instagram=error&detail=" + encodeURIComponent(jwtData.message || "jwt_failed"));
      }
    } catch (error) {
      console.error("[instagram] Connect error:", error);
      res.redirect("/settings?instagram=error&detail=" + encodeURIComponent(error.message || "unknown"));
    }
  });
  app2.post("/api/instagram/post", isAuthenticated, async (req, res) => {
    const apiKey = process.env.AYRSHARE_API_KEY;
    if (!apiKey) return res.status(503).json({ error: "Instagram integration not configured" });
    try {
      const userId = getUserId(req);
      const email = getUserEmail(req);
      const userIsAdmin = email === ADMIN_EMAIL;
      const { dogId, caption, image, orgId: bodyOrgId } = req.body;
      let imageToUpload;
      let fileName;
      let description;
      let org;
      let defaultCaption;
      if (image && bodyOrgId) {
        org = await storage.getOrganization(parseInt(bodyOrgId));
        if (!org) return res.status(404).json({ error: "Organization not found" });
        if (!userIsAdmin) {
          const userOrg = await storage.getOrganizationByOwner(userId);
          if (!userOrg || userOrg.id !== org.id) {
            return res.status(403).json({ error: "You don't have access to this organization" });
          }
        }
        imageToUpload = image;
        fileName = `showcase-${org.id}-${Date.now()}.png`;
        description = `Showcase from ${org.name}`;
        defaultCaption = caption || `Check out the adorable pets at ${org.name}! #adoptdontshop #rescuepets #pawtraitpals`;
      } else if (dogId) {
        const dog = await storage.getDog(parseInt(dogId));
        if (!dog) return res.status(404).json({ error: "Dog not found" });
        org = await storage.getOrganization(dog.organizationId);
        if (!org) return res.status(404).json({ error: "Organization not found" });
        if (!userIsAdmin) {
          const userOrg = await storage.getOrganizationByOwner(userId);
          if (!userOrg || userOrg.id !== org.id) {
            return res.status(403).json({ error: "You don't have access to this organization" });
          }
        }
        const portrait = await storage.getSelectedPortraitByDog(dog.id);
        if (!portrait || !portrait.generatedImageUrl) {
          return res.status(400).json({ error: "No portrait found for this pet" });
        }
        imageToUpload = portrait.generatedImageUrl;
        fileName = `portrait-${dog.id}-${Date.now()}.png`;
        description = `Pawtrait of ${dog.name}`;
        const proto = req.headers["x-forwarded-proto"] || req.protocol || "https";
        const host = req.headers["x-forwarded-host"] || req.headers["host"] || "pawtraitpals.com";
        defaultCaption = caption || `Meet ${dog.name}! ${dog.breed ? `A beautiful ${dog.breed} ` : ""}Looking for a forever home. View their full profile at ${proto}://${host}/pawfile/${dog.id}

#adoptdontshop #rescuepets #pawtraitpals`;
      } else {
        return res.status(400).json({ error: "dogId or image+orgId is required" });
      }
      const result = await pool.query(
        "SELECT ayrshare_profile_key FROM organizations WHERE id = $1",
        [org.id]
      );
      const profileKey = result.rows[0]?.ayrshare_profile_key;
      console.log(`[instagram] Uploading image for org ${org.id} to Ayrshare`);
      const uploadRes = await fetch(`${AYRSHARE_API_URL}/media/upload`, {
        method: "POST",
        headers: getAyrshareHeaders(),
        body: JSON.stringify({ file: imageToUpload, fileName, description })
      });
      const uploadData = await uploadRes.json();
      if (!uploadData.url) {
        console.error("[instagram] Upload failed:", uploadData);
        throw new Error(uploadData.message || "Failed to upload image");
      }
      console.log(`[instagram] Uploaded: ${uploadData.url}`);
      const postRes = await fetch(`${AYRSHARE_API_URL}/post`, {
        method: "POST",
        headers: getAyrshareHeaders(profileKey),
        body: JSON.stringify({
          post: defaultCaption,
          platforms: ["instagram"],
          mediaUrls: [uploadData.url]
        })
      });
      const postData = await postRes.json();
      if (postData.status === "error") {
        console.error("[instagram] Post failed:", postData);
        throw new Error(postData.message || "Failed to post to Instagram");
      }
      const igPost = postData.postIds?.find((p) => p.platform === "instagram");
      console.log(`[instagram] Posted to Instagram for org ${org.id} via Ayrshare`);
      res.json({
        success: true,
        mediaId: igPost?.id || postData.id,
        postUrl: igPost?.postUrl || null
      });
    } catch (error) {
      console.error("[instagram] Post error:", error);
      res.status(500).json({ error: error.message || "Failed to post to Instagram" });
    }
  });
  app2.delete("/api/instagram/disconnect", isAuthenticated, async (req, res) => {
    const apiKey = process.env.AYRSHARE_API_KEY;
    if (!apiKey) return res.status(503).json({ error: "Instagram integration not configured" });
    try {
      const userId = getUserId(req);
      const email = getUserEmail(req);
      const userIsAdmin = email === ADMIN_EMAIL;
      const orgIdParam = req.query.orgId ? parseInt(req.query.orgId) : null;
      let org;
      if (userIsAdmin && orgIdParam) {
        org = await storage.getOrganization(orgIdParam);
      } else {
        org = await storage.getOrganizationByOwner(userId);
      }
      if (!org) return res.status(404).json({ error: "Organization not found" });
      const result = await pool.query(
        "SELECT ayrshare_profile_key FROM organizations WHERE id = $1",
        [org.id]
      );
      const profileKey = result.rows[0]?.ayrshare_profile_key;
      if (profileKey) {
        await fetch(`${AYRSHARE_API_URL}/profiles/social`, {
          method: "DELETE",
          headers: getAyrshareHeaders(profileKey),
          body: JSON.stringify({ platform: "instagram" })
        });
      }
      await pool.query(
        `UPDATE organizations SET instagram_username = NULL, instagram_user_id = NULL, instagram_access_token = NULL WHERE id = $1`,
        [org.id]
      );
      res.json({ success: true });
    } catch (error) {
      console.error("[instagram] Disconnect error:", error);
      res.status(500).json({ error: "Failed to disconnect Instagram" });
    }
  });
  app2.get("/api/admin/instagram-debug", isAuthenticated, async (req, res) => {
    const email = getUserEmail(req);
    if (email !== ADMIN_EMAIL) return res.status(403).json({ error: "Admin only" });
    const apiKey = process.env.AYRSHARE_API_KEY;
    if (!apiKey) return res.json({ error: "AYRSHARE_API_KEY not set" });
    try {
      const userRes = await fetch(`${AYRSHARE_API_URL}/user`, {
        headers: { "Authorization": `Bearer ${apiKey}` }
      });
      const userData = await userRes.json();
      const profilesRes = await fetch(`${AYRSHARE_API_URL}/profiles`, {
        headers: { "Authorization": `Bearer ${apiKey}` }
      });
      const profilesData = await profilesRes.json();
      res.json({
        ayrshare_user: userData,
        profiles: profilesData,
        env: {
          hasApiKey: !!apiKey,
          hasDomain: !!process.env.AYRSHARE_DOMAIN,
          hasPrivateKey: !!process.env.AYRSHARE_PRIVATE_KEY
        }
      });
    } catch (e) {
      res.json({ error: e.message });
    }
  });
}

// server/routes/instagram-native.ts
var import_crypto = __toESM(require("crypto"), 1);
init_db();
var GRAPH_API = "https://graph.instagram.com";
var GRAPH_API_V = "https://graph.instagram.com/v21.0";
var IG_APP_ID = process.env.INSTAGRAM_APP_ID;
var IG_APP_SECRET = process.env.INSTAGRAM_APP_SECRET;
var imageCache = /* @__PURE__ */ new Map();
var MAX_IMAGE_CACHE_SIZE = 50;
var ALLOWED_IMAGE_TYPES = /* @__PURE__ */ new Set(["image/png", "image/jpeg", "image/webp", "image/gif"]);
function storePublicImage(base64DataUri) {
  const matches = base64DataUri.match(/^data:(image\/\w+);base64,(.+)$/s);
  if (!matches) throw new Error("Invalid base64 image data");
  const contentType = matches[1];
  if (!ALLOWED_IMAGE_TYPES.has(contentType)) {
    throw new Error(`Unsupported image type: ${contentType}`);
  }
  const buffer = Buffer.from(matches[2], "base64");
  if (imageCache.size >= MAX_IMAGE_CACHE_SIZE) {
    const oldestKey = imageCache.keys().next().value;
    if (oldestKey) imageCache.delete(oldestKey);
  }
  const token = import_crypto.default.randomUUID();
  imageCache.set(token, {
    data: buffer,
    contentType,
    expiresAt: Date.now() + 10 * 60 * 1e3
    // 10 min TTL
  });
  const host = process.env.NODE_ENV === "production" ? "https://pawtraitpals.com" : "http://localhost:5000";
  return `${host}/api/public-image/${token}`;
}
function verifyMetaSignedRequest(signedRequest) {
  if (!IG_APP_SECRET) return null;
  const [sig, payload] = signedRequest.split(".");
  if (!sig || !payload) return null;
  const expectedSig = import_crypto.default.createHmac("sha256", IG_APP_SECRET).update(payload).digest("base64url");
  try {
    if (!import_crypto.default.timingSafeEqual(Buffer.from(sig), Buffer.from(expectedSig))) return null;
  } catch {
    return null;
  }
  return JSON.parse(Buffer.from(payload, "base64url").toString());
}
function registerInstagramNativeRoutes(app2) {
  setInterval(() => {
    const now = Date.now();
    for (const [token, entry] of imageCache) {
      if (now > entry.expiresAt) {
        imageCache.delete(token);
      }
    }
  }, 2 * 60 * 1e3);
  app2.get("/api/public-image/:token", (req, res) => {
    const entry = imageCache.get(req.params.token);
    if (!entry || Date.now() > entry.expiresAt) {
      imageCache.delete(req.params.token);
      return res.status(404).json({ error: "Image not found or expired" });
    }
    res.set("Content-Type", entry.contentType);
    res.set("Cache-Control", "public, max-age=600");
    res.send(entry.data);
  });
  app2.get("/api/instagram-native/status", isAuthenticated, async (req, res) => {
    try {
      const orgIdParam = req.query.orgId ? parseInt(req.query.orgId) : null;
      const org = await getOrgForUser(req, orgIdParam);
      if (!org) return res.json({ connected: false });
      const result = await pool.query(
        "SELECT instagram_access_token, instagram_user_id, instagram_username, instagram_token_expires_at FROM organizations WHERE id = $1",
        [org.id]
      );
      const row = result.rows[0];
      if (!row?.instagram_access_token || !row?.instagram_user_id) {
        return res.json({ connected: false });
      }
      if (row.instagram_token_expires_at && new Date(row.instagram_token_expires_at) < /* @__PURE__ */ new Date()) {
        return res.json({ connected: false, reason: "token_expired" });
      }
      const expiresAt = row.instagram_token_expires_at ? new Date(row.instagram_token_expires_at) : null;
      const sevenDaysFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1e3);
      if (expiresAt && expiresAt < sevenDaysFromNow && IG_APP_SECRET) {
        try {
          const refreshRes = await fetch(
            `${GRAPH_API}/refresh_access_token?grant_type=ig_refresh_token&access_token=${row.instagram_access_token}`
          );
          const refreshData = await refreshRes.json();
          if (refreshData.access_token) {
            const newExpires = new Date(Date.now() + (refreshData.expires_in || 5184e3) * 1e3);
            await pool.query(
              "UPDATE organizations SET instagram_access_token = $1, instagram_token_expires_at = $2 WHERE id = $3",
              [refreshData.access_token, newExpires.toISOString(), org.id]
            );
            console.log(`[instagram-native] Token refreshed for org ${org.id}`);
          }
        } catch (refreshErr) {
          console.warn("[instagram-native] Token refresh failed:", refreshErr);
        }
      }
      const verifyRes = await fetch(`${GRAPH_API_V}/me?fields=user_id,username&access_token=${row.instagram_access_token}`);
      const verifyData = await verifyRes.json();
      if (verifyData.error) {
        console.warn("[instagram-native] Token invalid:", verifyData.error.message);
        return res.json({ connected: false, reason: "token_invalid" });
      }
      if (verifyData.username && verifyData.username !== row.instagram_username) {
        await pool.query("UPDATE organizations SET instagram_username = $1 WHERE id = $2", [verifyData.username, org.id]);
      }
      res.json({ connected: true, username: verifyData.username || row.instagram_username, orgId: org.id });
    } catch (error) {
      console.error("[instagram-native] Status error:", error);
      res.json({ connected: false });
    }
  });
  app2.get("/api/instagram-native/connect", isAuthenticated, async (req, res) => {
    if (!IG_APP_ID || !IG_APP_SECRET) {
      return res.redirect("/settings?instagram=error&detail=missing_instagram_config");
    }
    try {
      const userId = getUserId(req);
      const email = getUserEmail(req);
      const userIsAdmin = email === ADMIN_EMAIL;
      const orgIdParam = req.query.orgId ? parseInt(req.query.orgId) : null;
      let orgId = null;
      if (userIsAdmin && orgIdParam) {
        orgId = orgIdParam;
      } else {
        const org = await storage.getOrganizationByOwner(userId);
        if (org) orgId = org.id;
      }
      if (!orgId) return res.redirect("/settings?instagram=error&detail=no_organization");
      const statePayload = JSON.stringify({ orgId, ts: Date.now() });
      const stateHmac = import_crypto.default.createHmac("sha256", IG_APP_SECRET).update(statePayload).digest("hex");
      const state = Buffer.from(JSON.stringify({ p: statePayload, s: stateHmac })).toString("base64url");
      const redirectUri = `${process.env.NODE_ENV === "production" ? "https://pawtraitpals.com" : "http://localhost:5000"}/api/instagram-native/callback`;
      const authUrl = `https://api.instagram.com/oauth/authorize?client_id=${IG_APP_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=instagram_business_basic,instagram_business_content_publish&response_type=code&state=${state}`;
      console.log(`[instagram-native] Redirecting org ${orgId} to Facebook OAuth`);
      res.redirect(authUrl);
    } catch (error) {
      console.error("[instagram-native] Connect error:", error);
      res.redirect("/settings?instagram=error&detail=" + encodeURIComponent(error.message || "unknown"));
    }
  });
  app2.get("/api/instagram-native/callback", async (req, res) => {
    const { code, state, error: oauthError } = req.query;
    if (oauthError) {
      console.error("[instagram-native] OAuth denied:", oauthError);
      return res.redirect("/settings?instagram=error&detail=" + encodeURIComponent(oauthError));
    }
    if (!code || !state) {
      return res.redirect("/settings?instagram=error&detail=missing_code_or_state");
    }
    try {
      const stateOuter = JSON.parse(Buffer.from(state, "base64url").toString());
      const expectedHmac = import_crypto.default.createHmac("sha256", IG_APP_SECRET).update(stateOuter.p).digest("hex");
      if (!import_crypto.default.timingSafeEqual(Buffer.from(stateOuter.s, "hex"), Buffer.from(expectedHmac, "hex"))) {
        return res.redirect("/settings?instagram=error&detail=invalid_state");
      }
      const stateData = JSON.parse(stateOuter.p);
      const orgId = stateData.orgId;
      if (!orgId) throw new Error("No orgId in state");
      const redirectUri = `${process.env.NODE_ENV === "production" ? "https://pawtraitpals.com" : "http://localhost:5000"}/api/instagram-native/callback`;
      const cleanCode = code.replace(/#_$/, "");
      console.log(`[instagram-native] Token exchange: client_id=${IG_APP_ID}, redirect_uri=${redirectUri}, code_length=${cleanCode.length}`);
      const tokenRes = await fetch("https://api.instagram.com/oauth/access_token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: IG_APP_ID,
          client_secret: IG_APP_SECRET,
          grant_type: "authorization_code",
          redirect_uri: redirectUri,
          code: cleanCode
        }).toString()
      });
      const tokenData = await tokenRes.json();
      if (tokenData.error_type || tokenData.error) {
        console.error("[instagram-native] Token exchange error:", JSON.stringify(tokenData));
        console.error("[instagram-native] Used redirect_uri:", redirectUri);
        console.error("[instagram-native] Used client_id:", IG_APP_ID);
        throw new Error(tokenData.error_message || tokenData.error?.message || "Token exchange failed");
      }
      const shortLivedToken = tokenData.access_token;
      const longTokenRes = await fetch(
        `${GRAPH_API}/access_token?grant_type=ig_exchange_token&client_secret=${IG_APP_SECRET}&access_token=${shortLivedToken}`
      );
      const longTokenData = await longTokenRes.json();
      if (longTokenData.error) {
        console.error("[instagram-native] Long-lived token error:", longTokenData.error);
        throw new Error(longTokenData.error.message || "Long-lived token exchange failed");
      }
      const longLivedToken = longTokenData.access_token;
      const expiresIn = longTokenData.expires_in || 5184e3;
      const igProfileRes = await fetch(`${GRAPH_API_V}/me?fields=user_id,username&access_token=${longLivedToken}`);
      const igProfileData = await igProfileRes.json();
      const igUserId = igProfileData.id;
      const igUsername = igProfileData.username || null;
      console.log(`[instagram-native] Profile: id=${igUserId}, username=${igUsername}`);
      const expiresAt = new Date(Date.now() + expiresIn * 1e3);
      await pool.query(
        `UPDATE organizations SET
          instagram_access_token = $1,
          instagram_user_id = $2,
          instagram_username = $3,
          instagram_page_id = $4,
          instagram_token_expires_at = $5
        WHERE id = $6`,
        [longLivedToken, igUserId, igUsername, null, expiresAt.toISOString(), orgId]
      );
      console.log(`[instagram-native] Connected org ${orgId}: @${igUsername} (IG ID: ${igUserId})`);
      res.redirect("/settings?instagram=connected");
    } catch (error) {
      console.error("[instagram-native] Callback error:", error);
      res.redirect("/settings?instagram=error&detail=" + encodeURIComponent(error.message || "callback_failed"));
    }
  });
  app2.post("/api/instagram-native/post", isAuthenticated, async (req, res) => {
    try {
      const userId = getUserId(req);
      const email = getUserEmail(req);
      const userIsAdmin = email === ADMIN_EMAIL;
      const { dogId, caption, image, orgId: bodyOrgId } = req.body;
      let imageToPost;
      let org;
      let defaultCaption;
      if (image && bodyOrgId) {
        org = await storage.getOrganization(parseInt(bodyOrgId));
        if (!org) return res.status(404).json({ error: "Organization not found" });
        if (!userIsAdmin) {
          const userOrg = await storage.getOrganizationByOwner(userId);
          if (!userOrg || userOrg.id !== org.id) {
            return res.status(403).json({ error: "You don't have access to this organization" });
          }
        }
        imageToPost = image;
        defaultCaption = caption || `Check out the adorable pets at ${org.name}! #adoptdontshop #rescuepets #pawtraitpals`;
      } else if (dogId) {
        const dog = await storage.getDog(parseInt(dogId));
        if (!dog) return res.status(404).json({ error: "Dog not found" });
        org = await storage.getOrganization(dog.organizationId);
        if (!org) return res.status(404).json({ error: "Organization not found" });
        if (!userIsAdmin) {
          const userOrg = await storage.getOrganizationByOwner(userId);
          if (!userOrg || userOrg.id !== org.id) {
            return res.status(403).json({ error: "You don't have access to this organization" });
          }
        }
        const portrait = await storage.getSelectedPortraitByDog(dog.id);
        if (!portrait || !portrait.generatedImageUrl) {
          return res.status(400).json({ error: "No portrait found for this pet" });
        }
        imageToPost = portrait.generatedImageUrl;
        const proto = req.headers["x-forwarded-proto"] || req.protocol || "https";
        const host = req.headers["x-forwarded-host"] || req.headers["host"] || "pawtraitpals.com";
        defaultCaption = caption || `Meet ${dog.name}! ${dog.breed ? `A beautiful ${dog.breed} ` : ""}Looking for a forever home. View their full profile at ${proto}://${host}/pawfile/${dog.id}

#adoptdontshop #rescuepets #pawtraitpals`;
      } else {
        return res.status(400).json({ error: "dogId or image+orgId is required" });
      }
      const result = await pool.query(
        "SELECT instagram_access_token, instagram_user_id FROM organizations WHERE id = $1",
        [org.id]
      );
      const token = result.rows[0]?.instagram_access_token;
      const igUserId = result.rows[0]?.instagram_user_id;
      if (!token || !igUserId) {
        return res.status(400).json({ error: "Instagram not connected. Please connect Instagram first." });
      }
      const imageUrl = storePublicImage(imageToPost);
      console.log(`[instagram-native] Posting for org ${org.id}, image URL: ${imageUrl}`);
      console.log(`[instagram-native] Creating container: user=${igUserId}, image_url=${imageUrl}`);
      const containerRes = await fetch(`${GRAPH_API_V}/${igUserId}/media`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image_url: imageUrl,
          caption: defaultCaption,
          access_token: token
        })
      });
      const containerText = await containerRes.text();
      console.log(`[instagram-native] Container response (${containerRes.status}): ${containerText}`);
      const containerData = JSON.parse(containerText);
      if (containerData.error) {
        console.error("[instagram-native] Container creation error:", JSON.stringify(containerData.error));
        throw new Error(containerData.error.message || "Failed to create media container");
      }
      const containerId = containerData.id;
      console.log(`[instagram-native] Container created: ${containerId}`);
      let ready = false;
      for (let i = 0; i < 15; i++) {
        await new Promise((resolve) => setTimeout(resolve, 2e3));
        const statusRes = await fetch(
          `${GRAPH_API_V}/${containerId}?fields=status_code&access_token=${token}`
        );
        const statusData = await statusRes.json();
        if (statusData.status_code === "FINISHED") {
          ready = true;
          break;
        }
        if (statusData.status_code === "ERROR") {
          throw new Error("Instagram rejected the image. It may be too large or in an unsupported format.");
        }
      }
      if (!ready) {
        throw new Error("Image processing timed out. Please try again.");
      }
      console.log(`[instagram-native] Publishing container ${containerId} for user ${igUserId}`);
      const publishRes = await fetch(`${GRAPH_API_V}/${igUserId}/media_publish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          creation_id: containerId,
          access_token: token
        })
      });
      const publishText = await publishRes.text();
      console.log(`[instagram-native] Publish response (${publishRes.status}): ${publishText}`);
      const publishData = JSON.parse(publishText);
      if (publishData.error) {
        console.error("[instagram-native] Publish error:", JSON.stringify(publishData.error));
        throw new Error(publishData.error.message || "Failed to publish to Instagram");
      }
      console.log(`[instagram-native] Published to Instagram: ${publishData.id}`);
      const tokenFromUrl = imageUrl.split("/").pop();
      if (tokenFromUrl) imageCache.delete(tokenFromUrl);
      res.json({
        success: true,
        mediaId: publishData.id,
        postUrl: null
      });
    } catch (error) {
      console.error("[instagram-native] Post error:", error);
      res.status(500).json({ error: error.message || "Failed to post to Instagram" });
    }
  });
  app2.delete("/api/instagram-native/disconnect", isAuthenticated, async (req, res) => {
    try {
      const orgIdParam = req.query.orgId ? parseInt(req.query.orgId) : null;
      const org = await getOrgForUser(req, orgIdParam);
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
      console.log(`[instagram-native] Disconnected org ${org.id}`);
      res.json({ success: true });
    } catch (error) {
      console.error("[instagram-native] Disconnect error:", error);
      res.status(500).json({ error: "Failed to disconnect Instagram" });
    }
  });
  app2.post("/api/instagram-native/data-deletion", async (req, res) => {
    try {
      const { signed_request } = req.body;
      if (!signed_request || !IG_APP_SECRET) {
        return res.status(400).json({ error: "Invalid request" });
      }
      const data = verifyMetaSignedRequest(signed_request);
      if (!data) {
        return res.status(403).json({ error: "Invalid signature" });
      }
      const fbUserId = data.user_id;
      if (fbUserId) {
        await pool.query(
          `UPDATE organizations SET
            instagram_access_token = NULL,
            instagram_user_id = NULL,
            instagram_username = NULL,
            instagram_page_id = NULL,
            instagram_token_expires_at = NULL
          WHERE instagram_user_id = $1`,
          [String(fbUserId)]
        );
        console.log(`[instagram-native] Data deletion processed for IG user ${fbUserId}`);
      }
      const confirmationCode = import_crypto.default.randomUUID();
      res.json({
        url: `https://pawtraitpals.com/privacy`,
        confirmation_code: confirmationCode
      });
    } catch (error) {
      console.error("[instagram-native] Data deletion error:", error);
      res.status(500).json({ error: "Failed to process data deletion" });
    }
  });
  app2.post("/api/instagram-native/deauthorize", async (req, res) => {
    try {
      const { signed_request } = req.body;
      if (!signed_request || !IG_APP_SECRET) {
        return res.status(400).json({ error: "Invalid request" });
      }
      const data = verifyMetaSignedRequest(signed_request);
      if (!data) {
        return res.status(403).json({ error: "Invalid signature" });
      }
      const fbUserId = data.user_id;
      if (fbUserId) {
        await pool.query(
          `UPDATE organizations SET
            instagram_access_token = NULL,
            instagram_user_id = NULL,
            instagram_username = NULL,
            instagram_page_id = NULL,
            instagram_token_expires_at = NULL
          WHERE instagram_user_id = $1`,
          [String(fbUserId)]
        );
        console.log(`[instagram-native] Deauthorized IG user ${fbUserId}`);
      }
      res.json({ success: true });
    } catch (error) {
      console.error("[instagram-native] Deauthorize error:", error);
      res.status(500).json({ error: "Failed to process deauthorization" });
    }
  });
}

// server/routes/import.ts
init_db();
async function registerImportRoutes(app2) {
  const { getProvider: getProvider2, getAvailableProviders: getAvailableProviders2, downloadPhotoAsBase64: downloadPhotoAsBase642 } = await Promise.resolve().then(() => (init_import(), import_exports));
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
    } catch (e) {
      console.warn("[import] Could not add columns:", e.message);
    }
  })();
  app2.get("/api/import/providers", isAuthenticated, async (_req, res) => {
    res.json(getAvailableProviders2());
  });
  app2.get("/api/import/search", isAuthenticated, async (req, res) => {
    try {
      const providerName = req.query.provider;
      const name = req.query.name;
      const location = req.query.location;
      if (!providerName) return res.status(400).json({ error: "provider is required" });
      if (!name) return res.status(400).json({ error: "name is required" });
      const provider = getProvider2(providerName);
      const orgs = await provider.searchOrganizations(name, location);
      res.json(orgs);
    } catch (error) {
      console.error("[import] Search error:", error);
      res.status(500).json({ error: error.message || "Failed to search organizations" });
    }
  });
  app2.get("/api/import/animals", isAuthenticated, async (req, res) => {
    try {
      const providerName = req.query.provider;
      const orgId = req.query.orgId;
      const apiKey = req.query.apiKey;
      if (!providerName) return res.status(400).json({ error: "provider is required" });
      if (!orgId && !apiKey) return res.status(400).json({ error: "orgId or apiKey is required" });
      const isDemoMode = providerName === "shelterluv" && apiKey && apiKey.toUpperCase() === "DEMO";
      const provider = getProvider2(isDemoMode ? "demo" : providerName);
      const animals = await provider.fetchAnimals(orgId || apiKey);
      const userId = getUserId(req);
      const email = getUserEmail(req);
      const isAdminUser = email === ADMIN_EMAIL;
      const orgIdParam = req.query.userOrgId ? parseInt(req.query.userOrgId) : null;
      let userOrg;
      if (isAdminUser && orgIdParam) {
        userOrg = await storage.getOrganization(orgIdParam);
      } else {
        userOrg = await storage.getOrganizationByOwner(userId);
      }
      if (userOrg) {
        const animalsWithStatus = await Promise.all(
          animals.map(async (animal) => {
            const existing = await storage.findDogByExternalId(animal.externalId, providerName, userOrg.id);
            return { ...animal, alreadyImported: !!existing };
          })
        );
        return res.json(animalsWithStatus);
      }
      res.json(animals.map((a) => ({ ...a, alreadyImported: false })));
    } catch (error) {
      console.error("[import] Fetch animals error:", error);
      res.status(500).json({ error: error.message || "Failed to fetch animals" });
    }
  });
  app2.post("/api/import/pets", isAuthenticated, async (req, res) => {
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
      const plan = org.planId ? await storage.getSubscriptionPlan(org.planId) : null;
      const existingDogs = await storage.getDogsByOrganization(org.id);
      const currentCount = existingDogs.length;
      const effectiveLimit = plan?.dogsLimit ? plan.dogsLimit + (org.additionalPetSlots || 0) : null;
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
          slotsAvailable
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
        let photoBase64 = null;
        if (animal.selectedPhotoUrl) {
          photoBase64 = await downloadPhotoAsBase642(animal.selectedPhotoUrl);
        }
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
          lastSyncedAt: /* @__PURE__ */ new Date(),
          tags: animal.tags || []
        });
        imported++;
      }
      console.log(`[import] ${providerName}: imported ${imported}, skipped ${skipped} for org ${org.id}`);
      res.json({ imported, skipped });
    } catch (error) {
      console.error("[import] Import error:", error);
      res.status(500).json({ error: error.message || "Failed to import pets" });
    }
  });
}

// server/routes/gdpr.ts
init_db();
function registerGdprRoutes(app2) {
  app2.get("/api/my-data/export", isAuthenticated, async (req, res) => {
    try {
      const userId = getUserId(req);
      const user = await storage.getUser(userId);
      const org = await storage.getOrganizationByOwner(userId);
      let dogs2 = [];
      let portraits2 = [];
      if (org) {
        dogs2 = await storage.getDogsByOrganization(org.id);
        for (const dog of dogs2) {
          const dogPortraits = await storage.getPortraitsByDog(dog.id);
          portraits2.push(...dogPortraits.map((p) => ({
            dogName: dog.name,
            style: p.styleId,
            createdAt: p.createdAt
          })));
        }
      }
      const exportData = {
        exportedAt: (/* @__PURE__ */ new Date()).toISOString(),
        user: {
          id: user?.id,
          email: user?.email,
          firstName: user?.firstName,
          lastName: user?.lastName,
          createdAt: user?.createdAt
        },
        organization: org ? {
          name: org.name,
          slug: org.slug,
          description: org.description,
          websiteUrl: org.websiteUrl,
          phone: org.phone,
          address: org.address,
          createdAt: org.createdAt
        } : null,
        pets: dogs2.map((d) => ({
          name: d.name,
          breed: d.breed,
          species: d.species,
          age: d.age,
          gender: d.gender,
          description: d.description,
          ownerName: d.ownerName,
          ownerEmail: d.ownerEmail,
          ownerPhone: d.ownerPhone,
          createdAt: d.createdAt
        })),
        portraits: portraits2
      };
      res.set("Content-Disposition", 'attachment; filename="my-data-export.json"');
      res.set("Content-Type", "application/json");
      res.json(exportData);
    } catch (error) {
      console.error("Data export error:", error);
      res.status(500).json({ error: "Failed to export data" });
    }
  });
  app2.delete("/api/my-account", isAuthenticated, async (req, res) => {
    try {
      const userId = getUserId(req);
      const userEmail = getUserEmail(req);
      if (userEmail === ADMIN_EMAIL) {
        return res.status(403).json({ error: "Admin account cannot be self-deleted" });
      }
      const org = await storage.getOrganizationByOwner(userId);
      if (org) {
        const orgDogs = await storage.getDogsByOrganization(org.id);
        for (const dog of orgDogs) {
          await storage.deleteDog(dog.id);
        }
        await storage.deleteOrganization(org.id);
      }
      await pool.query("DELETE FROM users WHERE id = $1", [userId]);
      const supabaseUrl2 = process.env.SUPABASE_URL;
      const supabaseServiceKey2 = process.env.SUPABASE_SERVICE_ROLE_KEY;
      if (supabaseUrl2 && supabaseServiceKey2) {
        await fetch(`${supabaseUrl2}/auth/v1/admin/users/${userId}`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${supabaseServiceKey2}`,
            "apikey": supabaseServiceKey2
          }
        });
      }
      console.log(`[gdpr] Account deleted: ${userEmail} (${userId})`);
      res.json({ success: true, message: "Your account and all associated data have been permanently deleted." });
    } catch (error) {
      console.error("Account deletion error:", error);
      res.status(500).json({ error: "Failed to delete account" });
    }
  });
}

// server/routes.ts
async function registerRoutes(httpServer2, app2) {
  registerAuthRoutes(app2);
  (async () => {
    await runStartupHealthCheck();
  })();
  app2.use("/api/", apiRateLimiter);
  registerPublicRoutes(app2);
  registerOrganizationRoutes(app2);
  registerDogRoutes(app2);
  registerPortraitRoutes(app2);
  registerPlansBillingRoutes(app2);
  registerAdminRoutes(app2);
  registerSmsRoutes(app2);
  registerInstagramRoutes(app2);
  registerInstagramNativeRoutes(app2);
  await registerImportRoutes(app2);
  registerGdprRoutes(app2);
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

// server/seed.ts
init_db();
init_schema();

// client/src/lib/portrait-styles.ts
var portraitStyles2 = [
  {
    id: 1,
    name: "Renaissance Noble",
    description: "A dignified portrait in the style of Italian Renaissance masters",
    category: "Classical",
    species: "dog",
    promptTemplate: "A majestic Renaissance oil painting portrait of a {breed} dog wearing ornate noble attire with a velvet collar and golden medallion, dramatic chiaroscuro lighting, rich earth tones, in the style of Leonardo da Vinci and Raphael, museum quality, highly detailed fur texture matching the actual dog's coat"
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
    promptTemplate: "A full-body portrait of a {breed} dog as an astronaut, the dog's head completely fills the open helmet with no empty space between the head and helmet rim, the dog's body naturally fills out a detailed NASA-style space suit with mission patches and life-support hoses, standing heroically on the lunar surface with Earth rising in the background, cosmic starfield, the dog's face is large and clearly visible looking straight at camera through the open visor, photorealistic cinematic lighting, highly detailed, anatomically correct dog proportions inside the suit"
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
    promptTemplate: "A full-body portrait of a {breed} cat as an astronaut, the cat's head completely fills the open helmet with no empty space between the head and helmet rim, the cat's furry body naturally fills out a detailed NASA-style space suit with mission patches and life-support hoses, standing heroically on the lunar surface with Earth rising in the background, cosmic starfield and nebula, the cat's face is large and clearly visible looking straight at camera through the open visor, photorealistic cinematic lighting, highly detailed, anatomically correct cat proportions inside the suit"
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
    description: "Try Pawtrait Pals free for 30 days with up to 3 pets and 20 portrait credits",
    priceMonthly: 0,
    dogsLimit: 3,
    monthlyPortraitCredits: 20,
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
  try {
    await pool.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS terms_accepted_at TIMESTAMP");
    await pool.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS privacy_accepted_at TIMESTAMP");
    console.log("[migration] consent columns ready");
  } catch (migErr) {
    console.log("[migration] consent columns:", migErr.message);
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
function getBaseUrl2(req) {
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
      const baseUrl = getBaseUrl2(req);
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
      const baseUrl = getBaseUrl2(req);
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
function sanitizeLogPayload(obj) {
  if (typeof obj === "string") {
    if (obj.length > 500 && obj.startsWith("data:image/")) {
      return `[base64 image, ${Math.round(obj.length / 1024)}kb]`;
    }
    return obj;
  }
  if (Array.isArray(obj)) return obj.map(sanitizeLogPayload);
  if (obj && typeof obj === "object") {
    const out = {};
    for (const [k, v] of Object.entries(obj)) {
      out[k] = sanitizeLogPayload(v);
    }
    return out;
  }
  return obj;
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
        logLine += ` :: ${JSON.stringify(sanitizeLogPayload(capturedJsonResponse))}`;
      }
      log(logLine);
    }
  });
  next();
});
app.get("/healthz", (_req, res) => {
  res.status(200).json({ status: "ok" });
});
var port = parseInt(process.env.PORT || "5000", 10);
httpServer.listen({ port, host: "0.0.0.0" }, () => {
  log(`serving on port ${port}`);
  (async () => {
    try {
      await seedDatabase();
      log("Database seeded");
    } catch (error) {
      console.error("Error seeding database:", error);
    }
    try {
      setupOgMetaRoutes(app);
      log("OG meta routes ready");
    } catch (error) {
      console.error("Error setting up OG routes:", error);
    }
    try {
      await registerRoutes(httpServer, app);
      log("API routes registered");
    } catch (error) {
      console.error("Error registering routes:", error);
    }
    app.use((err, _req, res, next) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      console.error("Internal Server Error:", err);
      if (res.headersSent) return next(err);
      return res.status(status).json({ message });
    });
    if (process.env.NODE_ENV === "production") {
      serveStatic(app);
    } else {
      const { setupVite: setupVite2 } = await Promise.resolve().then(() => (init_vite(), vite_exports));
      await setupVite2(httpServer, app);
    }
    log("All routes and middleware initialized");
  })().catch((err) => {
    console.error("Fatal startup error:", err);
  });
});
httpServer.keepAliveTimeout = 12e4;
httpServer.headersTimeout = 125e3;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  log
});
