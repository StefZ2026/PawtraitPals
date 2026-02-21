import type { ImportProvider, NormalizedAnimal, NormalizedOrganization } from "./types";

async function rescuegroupsGet(path: string): Promise<any> {
  const apiKey = process.env.RESCUEGROUPS_API_KEY;
  if (!apiKey) {
    throw new Error("RescueGroups API key not configured");
  }

  const res = await fetch(`https://api.rescuegroups.org/v5${path}`, {
    headers: { Authorization: apiKey },
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

  // Extract photos from included relationships
  const photos: string[] = [];
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
    tags: extractTags(animal),
  };
}

export const rescuegroupsProvider: ImportProvider = {
  name: "rescuegroups",

  async searchOrganizations(query: string): Promise<NormalizedOrganization[]> {
    // RescueGroups v5 uses filter syntax
    const encodedQuery = encodeURIComponent(query);
    const data = await rescuegroupsGet(
      `/public/orgs?filter[name]=${encodedQuery}&limit=20`
    );

    return (data.data || []).map((org: any) => ({
      externalId: String(org.id),
      name: org.attributes?.name || "Unknown",
      location: org.attributes?.city && org.attributes?.state
        ? `${org.attributes.city}, ${org.attributes.state}`
        : null,
      website: org.attributes?.url || null,
    }));
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
