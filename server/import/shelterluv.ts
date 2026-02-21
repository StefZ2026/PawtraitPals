import type { ImportProvider, NormalizedAnimal, NormalizedOrganization } from "./types";

function extractTags(animal: any): string[] {
  const tags: string[] = [];

  if (animal.Breed) tags.push(animal.Breed);
  if (animal.Color) tags.push(animal.Color);
  if (animal.Size) tags.push(animal.Size);
  if (animal.Sex) tags.push(animal.Sex);
  if (animal.Age) tags.push(animal.Age);
  if (animal.Pattern) tags.push(animal.Pattern);

  return [...new Set(tags.filter(Boolean))];
}

function normalizeAnimal(animal: any): NormalizedAnimal {
  const type = (animal.Type || "").toLowerCase();

  // ShelterLuv photos are in a Photos array
  const photos: string[] = [];
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
  // Cover photo as fallback
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
    tags: extractTags(animal),
  };
}

export const shelterluvProvider: ImportProvider = {
  name: "shelterluv",

  async searchOrganizations(_query: string): Promise<NormalizedOrganization[]> {
    // ShelterLuv doesn't have org search — the API key IS the org connection
    // Return empty. The UI handles this differently (paste API key instead of search).
    return [];
  },

  async fetchAnimals(apiKey: string): Promise<NormalizedAnimal[]> {
    if (!apiKey) {
      throw new Error("ShelterLuv API key is required");
    }

    const animals: NormalizedAnimal[] = [];
    let offset = 0;
    const limit = 100;
    const maxIterations = 20; // Safety limit (2000 animals max)

    for (let i = 0; i < maxIterations; i++) {
      const res = await fetch(
        `https://new.shelterluv.com/api/v1/animals?offset=${offset}&limit=${limit}&status_type=publishable`,
        {
          headers: { "X-Api-Key": apiKey },
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
      const batch = (data.animals || []).map(normalizeAnimal);
      animals.push(...batch);

      // Check if we've fetched all animals
      const totalCount = data.total_count || 0;
      offset += limit;
      if (offset >= totalCount || batch.length === 0) break;
    }

    return animals;
  },
};
