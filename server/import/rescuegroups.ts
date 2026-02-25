import type { ImportProvider, NormalizedAnimal, NormalizedOrganization } from "./types";

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
    const body = await res.text().catch(() => "");
    throw new Error(`RescueGroups API error ${res.status}: ${body}`);
  }

  return res.json();
}

function extractTags(animal: any): string[] {
  const tags: string[] = [];
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

function normalizeAnimal(animal: any): NormalizedAnimal {
  const attrs = animal.attributes || {};
  const species = (attrs.species || "").toLowerCase();

  // Extract photos — prefer full size, fall back to thumbnail
  const photos: string[] = [];
  if (attrs.pictureUrl) photos.push(attrs.pictureUrl);
  else if (attrs.pictureThumbnailUrl) photos.push(attrs.pictureThumbnailUrl);

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
    tags: extractTags(animal),
  };
}

export const rescuegroupsProvider: ImportProvider = {
  name: "rescuegroups",

  async searchOrganizations(query: string, location?: string): Promise<NormalizedOrganization[]> {
    // RescueGroups v5 API requires POST search with filterRadius for location-based search
    // Name-based filtering is not supported server-side, so we filter client-side after fetching
    const postalCode = (location || "").trim();

    let allOrgs: any[] = [];

    if (postalCode) {
      // Location-based search using POST with filterRadius
      const data = await rescuegroupsPost("/public/orgs/search", {
        filterRadius: {
          postalcode: postalCode,
          miles: 50,
        },
      });
      allOrgs = data.data || [];
    } else {
      // No location — get first page of orgs (API doesn't support name filtering)
      const data = await rescuegroupsGet("/public/orgs?limit=250");
      allOrgs = data.data || [];
    }

    // Map to normalized format
    let results = allOrgs.map((org: any) => ({
      externalId: String(org.id),
      name: org.attributes?.name || "Unknown",
      location: org.attributes?.city && org.attributes?.state
        ? `${org.attributes.city}, ${org.attributes.state}`
        : null,
      website: org.attributes?.url || null,
    }));

    // Client-side filter by name if query provided
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      results = results.filter((org) =>
        org.name.toLowerCase().includes(q)
      );
    }

    return results.slice(0, 50);
  },

  async fetchAnimals(orgId: string): Promise<NormalizedAnimal[]> {
    const animals: NormalizedAnimal[] = [];
    let page = 1;
    const maxPages = 10;

    while (page <= maxPages) {
      const data = await rescuegroupsGet(
        `/public/animals?filter[orgID]=${orgId}&filter[status]=Available&limit=100&page=${page}`
      );

      const batch = (data.data || []).map(normalizeAnimal);
      animals.push(...batch);

      const totalPages = data.meta?.pages || 1;
      if (page >= totalPages) break;
      page++;
    }

    return animals;
  },
};
