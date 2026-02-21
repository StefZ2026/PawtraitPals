import type { ImportProvider, NormalizedAnimal, NormalizedOrganization } from "./types";

/**
 * Demo provider for testing the import flow end-to-end.
 * Activated by entering "DEMO" as the ShelterLuv API key.
 * Returns realistic sample animals with publicly available photos.
 */

const DEMO_ANIMALS: NormalizedAnimal[] = [
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
      "https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=600&h=600&fit=crop",
    ],
    adoptionUrl: "https://www.shelterluv.com/embed/animal/demo-001",
    isAvailable: true,
    tags: ["Golden Retriever", "Large", "Adult", "Female", "House Trained", "Good with Kids", "Good with Dogs"],
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
      "https://images.unsplash.com/photo-1568572933382-74d440642117?w=600&h=600&fit=crop",
    ],
    adoptionUrl: "https://www.shelterluv.com/embed/animal/demo",
    isAvailable: true,
    tags: ["German Shepherd", "Large", "Young", "Male", "Shots Current", "Neutered"],
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
      "https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?w=600&h=600&fit=crop",
    ],
    adoptionUrl: "https://www.shelterluv.com/embed/animal/demo",
    isAvailable: true,
    tags: ["Domestic Shorthair", "Medium", "Adult", "Female", "Spayed", "Indoor Only"],
  },
  {
    externalId: "demo-004",
    name: "Charlie",
    species: "dog",
    breed: "Labrador Retriever Mix",
    age: "Puppy",
    description: "Charlie is an adorable Lab mix puppy full of energy and love. He's learning basic commands and is crate trained. Great with everyone!",
    photos: [
      "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&h=600&fit=crop",
    ],
    adoptionUrl: "https://www.shelterluv.com/embed/animal/demo",
    isAvailable: true,
    tags: ["Labrador Retriever", "Medium", "Puppy", "Male", "Good with Kids", "Good with Dogs", "Good with Cats"],
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
      "https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?w=600&h=600&fit=crop",
    ],
    adoptionUrl: "https://www.shelterluv.com/embed/animal/demo",
    isAvailable: true,
    tags: ["Beagle", "Small", "Senior", "Female", "House Trained", "Special Needs", "Spayed"],
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
      "https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=600&h=600&fit=crop",
    ],
    adoptionUrl: "https://www.shelterluv.com/embed/animal/demo",
    isAvailable: true,
    tags: ["Orange Tabby", "Medium", "Young", "Male", "Good with Cats", "Neutered", "Shots Current"],
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
      "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=600&h=600&fit=crop",
    ],
    adoptionUrl: "https://www.shelterluv.com/embed/animal/demo",
    isAvailable: true,
    tags: ["Pit Bull Terrier", "Large", "Adult", "Male", "Neutered", "House Trained", "Leash Trained"],
  },
  {
    externalId: "demo-008",
    name: "Whiskers",
    species: "cat",
    breed: "Siamese Mix",
    age: "Senior",
    description: "Whiskers is a dignified Siamese mix who enjoys quiet afternoons and gentle brushing. She's very vocal and will always let you know when it's dinner time.",
    photos: [
      "https://images.unsplash.com/photo-1561948955-570b270e7c36?w=600&h=600&fit=crop",
    ],
    adoptionUrl: "https://www.shelterluv.com/embed/animal/demo",
    isAvailable: true,
    tags: ["Siamese", "Medium", "Senior", "Female", "Spayed", "Indoor Only", "Special Needs"],
  },
];

export const demoProvider: ImportProvider = {
  name: "demo",

  async searchOrganizations(_query: string): Promise<NormalizedOrganization[]> {
    return [];
  },

  async fetchAnimals(_key: string): Promise<NormalizedAnimal[]> {
    // Simulate a short network delay for realism
    await new Promise((resolve) => setTimeout(resolve, 1200));
    return DEMO_ANIMALS;
  },
};
