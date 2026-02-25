import type { ImportProvider, NormalizedAnimal, NormalizedOrganization } from "./types";

// Decode HTML entities that RescueGroups embeds in description text
const HTML_ENTITIES: Record<string, string> = {
  "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"',
  "&apos;": "'", "&nbsp;": " ", "&rsquo;": "\u2019", "&lsquo;": "\u2018",
  "&rdquo;": "\u201C", "&ldquo;": "\u201D", "&mdash;": "\u2014",
  "&ndash;": "\u2013", "&hellip;": "\u2026", "&bull;": "\u2022",
  "&copy;": "\u00A9", "&reg;": "\u00AE", "&trade;": "\u2122",
};

function decodeHtmlEntities(text: string): string {
  if (!text) return text;
  // Replace named entities
  let result = text.replace(/&[a-zA-Z]+;/g, (entity) => {
    return HTML_ENTITIES[entity.toLowerCase()] ?? entity;
  });
  // Replace numeric entities (&#123; and &#x1F; forms)
  result = result.replace(/&#(\d+);/g, (_, code) => String.fromCharCode(parseInt(code, 10)));
  result = result.replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
  // Strip any remaining HTML tags
  result = result.replace(/<[^>]+>/g, "");
  // Normalize whitespace (collapse multiple spaces/nbsp into single space)
  result = result.replace(/\s+/g, " ").trim();
  return result;
}

function getApiKey(): string {
  const apiKey = process.env.RESCUEGROUPS_API_KEY;
  if (!apiKey) throw new Error("RescueGroups API key not configured");
  return apiKey;
}

async function rescuegroupsGet(path: string): Promise<any> {
  const res = await fetch(`https://api.rescuegroups.org/v5${path}`, {
    headers: {
      Authorization: getApiKey(),
      "Content-Type": "application/vnd.api+json",
    },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`RescueGroups API error ${res.status}: ${body}`);
  }

  return res.json();
}

async function rescuegroupsPost(path: string, body: any): Promise<any> {
  const res = await fetch(`https://api.rescuegroups.org/v5${path}`, {
    method: "POST",
    headers: {
      Authorization: getApiKey(),
      "Content-Type": "application/vnd.api+json",
    },
    body: JSON.stringify({ data: body }),
  });

  if (!res.ok) {
    const errBody = await res.text().catch(() => "");
    throw new Error(`RescueGroups API error ${res.status}: ${errBody}`);
  }

  return res.json();
}

// Build lookup maps from JSON:API "included" sideloaded data
function buildIncludedMaps(included: any[]) {
  const species: Record<string, string> = {};
  const statuses: Record<string, string> = {};
  const pictures: Record<string, { large: string | null; original: string | null }> = {};

  for (const inc of included) {
    if (inc.type === "species") {
      species[inc.id] = inc.attributes?.singular || "Unknown";
    } else if (inc.type === "statuses") {
      statuses[inc.id] = inc.attributes?.name || "Unknown";
    } else if (inc.type === "pictures") {
      const pa = inc.attributes || {};
      pictures[inc.id] = {
        large: pa.large?.url || null,
        original: pa.original?.url || null,
      };
    }
  }

  return { species, statuses, pictures };
}

function getRelationshipId(animal: any, relName: string): string | null {
  const data = animal.relationships?.[relName]?.data;
  if (Array.isArray(data) && data.length > 0) return data[0].id;
  return null;
}

function getRelationshipIds(animal: any, relName: string): string[] {
  const data = animal.relationships?.[relName]?.data;
  if (Array.isArray(data)) return data.map((d: any) => d.id);
  return [];
}

function extractTags(attrs: any): string[] {
  const tags: string[] = [];

  if (attrs.breedPrimary) tags.push(attrs.breedPrimary);
  if (attrs.breedSecondary) tags.push(attrs.breedSecondary);
  if (attrs.colorDetails) tags.push(attrs.colorDetails);
  if (attrs.sizeGroup) tags.push(attrs.sizeGroup);
  if (attrs.ageGroup) tags.push(attrs.ageGroup);
  if (attrs.sex) tags.push(attrs.sex);
  if (attrs.isHousetrained === true) tags.push("House Trained");
  if (attrs.isSpecialNeeds === true) tags.push("Special Needs");
  if (attrs.isMicrochipped === true) tags.push("Microchipped");
  if (attrs.isSpayedNeutered === true) tags.push("Spayed/Neutered");
  if (attrs.isCurrentVaccinations === true) tags.push("Vaccinations Current");
  if (attrs.isOKWithDogs === true) tags.push("Good with Dogs");
  if (attrs.isOKWithCats === true) tags.push("Good with Cats");
  if (attrs.isOKWithKids === true) tags.push("Good with Kids");

  return [...new Set(tags)];
}

function normalizeAnimal(
  animal: any,
  maps: ReturnType<typeof buildIncludedMaps>,
  speciesOverride?: "dog" | "cat"
): NormalizedAnimal {
  const attrs = animal.attributes || {};

  // Species from JSON:API relationship (most reliable)
  let species: "dog" | "cat" = speciesOverride || "dog";
  if (!speciesOverride) {
    const speciesId = getRelationshipId(animal, "species");
    if (speciesId) {
      const speciesName = (maps.species[speciesId] || "").toLowerCase();
      species = speciesName === "cat" ? "cat" : "dog";
    } else {
      // Fallback: infer from slug or searchString
      const slug = (attrs.slug || "").toLowerCase();
      const searchStr = (attrs.searchString || "").toLowerCase();
      if (slug.includes("-cat") || searchStr.includes(" cats ")) {
        species = "cat";
      }
    }
  }

  // Photos from included pictures (full-size), fall back to thumbnail
  const photos: string[] = [];
  const picIds = getRelationshipIds(animal, "pictures");
  for (const picId of picIds) {
    const pic = maps.pictures[picId];
    if (pic) {
      const url = pic.original || pic.large;
      if (url) photos.push(url);
    }
  }
  if (photos.length === 0 && attrs.pictureThumbnailUrl) {
    photos.push(attrs.pictureThumbnailUrl);
  }

  return {
    externalId: String(animal.id),
    name: decodeHtmlEntities(attrs.name) || "Unknown",
    species,
    breed: attrs.breedPrimary || null,
    age: attrs.ageGroup || attrs.ageString || null,
    description: decodeHtmlEntities(attrs.descriptionText || attrs.description) || null,
    photos,
    adoptionUrl: attrs.url || null,
    isAvailable: true, // we only fetch from the /available/ endpoints
    tags: extractTags(attrs),
  };
}

// Fetch one page of available animals for an org from a specific endpoint
async function fetchAvailablePage(
  endpoint: string,
  orgId: string,
  page: number,
  speciesOverride: "dog" | "cat"
): Promise<{ animals: NormalizedAnimal[]; totalPages: number }> {
  const data = await rescuegroupsPost(
    `${endpoint}?include=species,statuses,pictures&limit=100&page=${page}`,
    {
      filters: [
        { fieldName: "orgs.id", operation: "equal", criteria: orgId },
      ],
    }
  );

  const maps = buildIncludedMaps(data.included || []);
  const animals = (data.data || []).map((a: any) =>
    normalizeAnimal(a, maps, speciesOverride)
  );
  const totalPages = data.meta?.pages || 1;

  return { animals, totalPages };
}

// Quick count of available animals for an org (dogs + cats)
async function countAvailableAnimals(orgId: string): Promise<number> {
  try {
    const [dogsRes, catsRes] = await Promise.all([
      rescuegroupsPost("/public/animals/search/available/dogs?limit=1", {
        filters: [{ fieldName: "orgs.id", operation: "equal", criteria: orgId }],
      }),
      rescuegroupsPost("/public/animals/search/available/cats?limit=1", {
        filters: [{ fieldName: "orgs.id", operation: "equal", criteria: orgId }],
      }),
    ]);
    return (dogsRes.meta?.count || 0) + (catsRes.meta?.count || 0);
  } catch {
    return 0;
  }
}

export const rescuegroupsProvider: ImportProvider = {
  name: "rescuegroups",

  async searchOrganizations(query: string, location?: string): Promise<NormalizedOrganization[]> {
    const postalCode = (location || "").trim();

    let allOrgs: any[] = [];

    if (postalCode) {
      const data = await rescuegroupsPost("/public/orgs/search", {
        filterRadius: {
          postalcode: postalCode,
          miles: 50,
        },
      });
      allOrgs = data.data || [];
    } else {
      const data = await rescuegroupsGet("/public/orgs?limit=250");
      allOrgs = data.data || [];
    }

    let results = allOrgs.map((org: any) => ({
      externalId: String(org.id),
      name: org.attributes?.name || "Unknown",
      location: org.attributes?.city && org.attributes?.state
        ? `${org.attributes.city}, ${org.attributes.state}`
        : null,
      website: org.attributes?.url || null,
    }));

    if (query.trim()) {
      const q = query.trim().toLowerCase();
      results = results.filter((org) => org.name.toLowerCase().includes(q));
    }

    // Trim before counting to limit API calls
    const candidates = results.slice(0, 50);

    // Count available animals per org in parallel, filter out empty ones
    const withCounts = await Promise.all(
      candidates.map(async (org) => ({
        ...org,
        animalCount: await countAvailableAnimals(org.externalId),
      }))
    );

    return withCounts.filter((org) => org.animalCount > 0);
  },

  async getOrganization(orgId: string): Promise<NormalizedOrganization> {
    const data = await rescuegroupsGet(`/public/orgs/${orgId}`);
    const raw = data.data;
    const org = Array.isArray(raw) ? raw[0] : raw;
    if (!org) throw new Error("Organization not found");
    return {
      externalId: String(org.id),
      name: org.attributes?.name || "Unknown",
      location: org.attributes?.city && org.attributes?.state
        ? `${org.attributes.city}, ${org.attributes.state}`
        : null,
      website: org.attributes?.url || null,
    };
  },

  async fetchAnimals(orgId: string): Promise<NormalizedAnimal[]> {
    const allAnimals: NormalizedAnimal[] = [];
    const maxPages = 10;

    // Fetch available dogs and cats in parallel (separate endpoints)
    for (const { endpoint, species } of [
      { endpoint: "/public/animals/search/available/dogs", species: "dog" as const },
      { endpoint: "/public/animals/search/available/cats", species: "cat" as const },
    ]) {
      let page = 1;
      while (page <= maxPages) {
        const { animals, totalPages } = await fetchAvailablePage(endpoint, orgId, page, species);
        allAnimals.push(...animals);
        if (page >= totalPages) break;
        page++;
      }
    }

    return allAnimals;
  },
};
