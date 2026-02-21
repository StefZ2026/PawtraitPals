// Shared types for all import provider adapters

export interface NormalizedAnimal {
  externalId: string;
  name: string;
  species: "dog" | "cat";
  breed: string | null;
  age: string | null;
  description: string | null;
  photos: string[]; // Array of photo URLs (full size)
  adoptionUrl: string | null;
  isAvailable: boolean;
  tags: string[]; // Searchable terms: breed, size, age, gender, attributes, etc.
}

export interface NormalizedOrganization {
  externalId: string;
  name: string;
  location: string | null; // "City, State" or similar
  website: string | null;
  animalCount?: number;
}

export interface ImportProvider {
  name: string;
  searchOrganizations(query: string, location?: string): Promise<NormalizedOrganization[]>;
  fetchAnimals(orgIdOrKey: string): Promise<NormalizedAnimal[]>;
}
