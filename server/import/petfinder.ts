import type { ImportProvider, NormalizedAnimal, NormalizedOrganization } from "./types";

let cachedToken: string | null = null;
let tokenExpiresAt = 0;

async function getAccessToken(): Promise<string> {
  const now = Date.now();
  if (cachedToken && now < tokenExpiresAt - 60000) {
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
      client_secret: apiSecret,
    }),
  });

  if (!res.ok) {
    throw new Error(`Petfinder auth failed: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  cachedToken = data.access_token;
  tokenExpiresAt = now + data.expires_in * 1000;
  return cachedToken!;
}

async function petfinderGet(path: string, params?: Record<string, string>): Promise<any> {
  const token = await getAccessToken();
  const url = new URL(`https://api.petfinder.com/v2${path}`);
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v) url.searchParams.set(k, v);
    }
  }

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Petfinder API error ${res.status}: ${body}`);
  }

  return res.json();
}

function extractTags(animal: any): string[] {
  const tags: string[] = [];

  // Breed
  if (animal.breeds?.primary) tags.push(animal.breeds.primary);
  if (animal.breeds?.secondary) tags.push(animal.breeds.secondary);
  if (animal.breeds?.mixed) tags.push("Mixed Breed");

  // Physical
  if (animal.size) tags.push(animal.size);
  if (animal.gender) tags.push(animal.gender);
  if (animal.age) tags.push(animal.age);
  if (animal.coat) tags.push(animal.coat);

  // Colors
  if (animal.colors?.primary) tags.push(animal.colors.primary);

  // Attributes
  if (animal.attributes?.spayed_neutered) tags.push("Spayed/Neutered");
  if (animal.attributes?.house_trained) tags.push("House Trained");
  if (animal.attributes?.special_needs) tags.push("Special Needs");
  if (animal.attributes?.shots_current) tags.push("Shots Current");

  // Environment compatibility
  if (animal.environment?.children) tags.push("Good with Kids");
  if (animal.environment?.dogs) tags.push("Good with Dogs");
  if (animal.environment?.cats) tags.push("Good with Cats");

  // Platform tags
  if (Array.isArray(animal.tags)) {
    tags.push(...animal.tags);
  }

  return [...new Set(tags)]; // Deduplicate
}

function normalizeAnimal(animal: any): NormalizedAnimal {
  const species = (animal.type || "").toLowerCase();
  return {
    externalId: String(animal.id),
    name: animal.name || "Unknown",
    species: species === "cat" ? "cat" : "dog",
    breed: animal.breeds?.primary || null,
    age: animal.age || null,
    description: animal.description || null,
    photos: (animal.photos || [])
      .map((p: any) => p.full || p.large || p.medium || p.small)
      .filter(Boolean),
    adoptionUrl: animal.url || null,
    isAvailable: animal.status === "adoptable",
    tags: extractTags(animal),
  };
}

export const petfinderProvider: ImportProvider = {
  name: "petfinder",

  async searchOrganizations(query: string, location?: string): Promise<NormalizedOrganization[]> {
    const params: Record<string, string> = { limit: "20" };
    if (query) params.name = query;
    if (location) params.location = location;

    const data = await petfinderGet("/organizations", params);
    return (data.organizations || []).map((org: any) => ({
      externalId: org.id,
      name: org.name,
      location: org.address
        ? [org.address.city, org.address.state].filter(Boolean).join(", ")
        : null,
      website: org.website || null,
    }));
  },

  async fetchAnimals(orgId: string): Promise<NormalizedAnimal[]> {
    const animals: NormalizedAnimal[] = [];
    let page = 1;
    const maxPages = 10; // Safety limit

    while (page <= maxPages) {
      const data = await petfinderGet("/animals", {
        organization: orgId,
        status: "adoptable",
        limit: "100",
        page: String(page),
      });

      const batch = (data.animals || []).map(normalizeAnimal);
      animals.push(...batch);

      // Check if there are more pages
      const totalPages = data.pagination?.total_pages || 1;
      if (page >= totalPages) break;
      page++;
    }

    return animals;
  },
};
