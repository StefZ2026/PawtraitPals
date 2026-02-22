const dogBreeds: string[] = [
  "Affenpinscher", "Afghan Hound", "Airedale Terrier", "Akita", "Alaskan Malamute",
  "American Bulldog", "American English Coonhound", "American Eskimo Dog", "American Foxhound",
  "American Hairless Terrier", "American Staffordshire Terrier", "American Water Spaniel",
  "Anatolian Shepherd Dog", "Australian Cattle Dog", "Australian Shepherd", "Australian Terrier",
  "Azawakh", "Barbet", "Basenji", "Basset Fauve de Bretagne", "Basset Hound", "Beagle",
  "Bearded Collie", "Beauceron", "Bedlington Terrier", "Belgian Laekenois", "Belgian Malinois",
  "Belgian Sheepdog", "Belgian Tervuren", "Bergamasco Sheepdog", "Berger Picard",
  "Bernese Mountain Dog", "Bichon Frise", "Biewer Terrier", "Black and Tan Coonhound",
  "Black Russian Terrier", "Bloodhound", "Bluetick Coonhound", "Boerboel", "Border Collie",
  "Border Terrier", "Borzoi", "Boston Terrier", "Bouvier des Flandres", "Boxer", "Boykin Spaniel",
  "Bracco Italiano", "Briard", "Brittany", "Brussels Griffon", "Bull Terrier", "Bulldog",
  "Bullmastiff", "Cairn Terrier", "Canaan Dog", "Cane Corso", "Cardigan Welsh Corgi",
  "Cavalier King Charles Spaniel", "Cesky Terrier", "Chesapeake Bay Retriever", "Chihuahua",
  "Chinese Crested", "Chinese Shar-Pei", "Chinook", "Chow Chow", "Cirneco dell'Etna",
  "Clumber Spaniel", "Cocker Spaniel", "Collie", "Coton de Tulear", "Croatian Sheepdog",
  "Curly-Coated Retriever", "Dachshund", "Dalmatian", "Dandie Dinmont Terrier",
  "Danish-Swedish Farmdog", "Doberman Pinscher", "Dogo Argentino", "Dogue de Bordeaux",
  "English Cocker Spaniel", "English Foxhound", "English Setter", "English Springer Spaniel",
  "English Toy Spaniel", "Entlebucher Mountain Dog", "Field Spaniel", "Finnish Lapphund",
  "Finnish Spitz", "Flat-Coated Retriever", "French Bulldog", "German Pinscher",
  "German Shepherd Dog", "German Shorthaired Pointer", "German Wirehaired Pointer",
  "Giant Schnauzer", "Glen of Imaal Terrier", "Golden Retriever", "Gordon Setter",
  "Grand Basset Griffon Vendeen", "Great Dane", "Great Pyrenees", "Greater Swiss Mountain Dog",
  "Greyhound", "Harrier", "Havanese", "Ibizan Hound", "Icelandic Sheepdog",
  "Irish Red and White Setter", "Irish Setter", "Irish Terrier", "Irish Water Spaniel",
  "Irish Wolfhound", "Italian Greyhound", "Japanese Chin", "Japanese Spitz", "Keeshond",
  "Kerry Blue Terrier", "Komondor", "Kuvasz", "Labrador Retriever", "Lagotto Romagnolo",
  "Lakeland Terrier", "Lancashire Heeler", "Leonberger", "Lhasa Apso", "Lowchen", "Maltese",
  "Manchester Terrier", "Mastiff", "Miniature American Shepherd", "Miniature Bull Terrier",
  "Miniature Pinscher", "Miniature Schnauzer", "Mudi", "Neapolitan Mastiff", "Newfoundland",
  "Norfolk Terrier", "Norwegian Buhund", "Norwegian Elkhound", "Norwegian Lundehund",
  "Norwich Terrier", "Nova Scotia Duck Tolling Retriever", "Old English Sheepdog", "Otterhound",
  "Papillon", "Parson Russell Terrier", "Pekingese", "Pembroke Welsh Corgi",
  "Petit Basset Griffon Vendeen", "Pharaoh Hound", "Plott Hound", "Pointer",
  "Polish Lowland Sheepdog", "Pomeranian", "Poodle", "Portuguese Podengo Pequeno",
  "Portuguese Water Dog", "Pug", "Puli", "Pumi", "Pyrenean Shepherd", "Rat Terrier",
  "Redbone Coonhound", "Rhodesian Ridgeback", "Rottweiler", "Russell Terrier", "Russian Toy",
  "Russian Tsvetnaya Bolonka", "Saint Bernard", "Saluki", "Samoyed", "Schipperke",
  "Scottish Deerhound", "Scottish Terrier", "Sealyham Terrier", "Shetland Sheepdog", "Shiba Inu",
  "Shih Tzu", "Siberian Husky", "Silky Terrier", "Skye Terrier", "Sloughi", "Small Munsterlander",
  "Smooth Fox Terrier", "Soft Coated Wheaten Terrier", "Spanish Water Dog", "Spinone Italiano",
  "Staffordshire Bull Terrier", "Standard Schnauzer", "Sussex Spaniel", "Swedish Vallhund",
  "Teddy Roosevelt Terrier", "Thai Ridgeback", "Tibetan Mastiff", "Tibetan Spaniel",
  "Tibetan Terrier", "Toy Fox Terrier", "Treeing Walker Coonhound", "Vizsla", "Weimaraner",
  "Welsh Springer Spaniel", "Welsh Terrier", "West Highland White Terrier", "Whippet",
  "Wire Fox Terrier", "Wirehaired Pointing Griffon", "Wirehaired Vizsla", "Xoloitzcuintli",
  "Yorkshire Terrier",
];

const catBreeds: string[] = [
  "Abyssinian", "American Bobtail", "American Curl", "American Shorthair", "American Wirehair",
  "Balinese", "Bengal", "Birman", "Bombay", "British Shorthair", "Burmese", "Burmilla",
  "Chartreux", "Colorpoint Shorthair", "Cornish Rex", "Devon Rex", "Egyptian Mau",
  "European Burmese", "Exotic Shorthair", "Havana Brown", "Japanese Bobtail", "Khao Manee",
  "Korat", "LaPerm", "Lykoi", "Maine Coon", "Manx", "Norwegian Forest Cat", "Ocicat",
  "Oriental", "Persian", "Ragamuffin", "Ragdoll", "Russian Blue", "Scottish Fold", "Selkirk Rex",
  "Siamese", "Siberian", "Singapura", "Somali", "Sphynx", "Tonkinese", "Toybob",
  "Turkish Angora", "Turkish Van",
];

function buildValidBreeds(breeds: string[]): Set<string> {
  const set = new Set<string>();
  set.add("Mixed Breed");
  for (const b of breeds) {
    set.add(b);
    set.add(`${b} Mix`);
  }
  return set;
}

const validDogBreeds = buildValidBreeds(dogBreeds);
const validCatBreeds = buildValidBreeds(catBreeds);

export function isValidBreed(breed: string, species?: string): boolean {
  if (!breed || !breed.trim()) return false;
  if (species === "cat") return validCatBreeds.has(breed);
  if (species === "dog") return validDogBreeds.has(breed);
  return validDogBreeds.has(breed) || validCatBreeds.has(breed);
}

// --- Breed normalization for imports ---

// Common aliases from Petfinder/RescueGroups/ShelterLuv → our AKC names
const breedAliases: Record<string, string> = {
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
  "polydactyl": "Mixed Breed",
};

// Build a case-insensitive lookup map for exact breed names
const dogBreedLower = new Map<string, string>();
const catBreedLower = new Map<string, string>();
for (const b of dogBreeds) {
  dogBreedLower.set(b.toLowerCase(), b);
  dogBreedLower.set(`${b.toLowerCase()} mix`, `${b} Mix`);
}
for (const b of catBreeds) {
  catBreedLower.set(b.toLowerCase(), b);
  catBreedLower.set(`${b.toLowerCase()} mix`, `${b} Mix`);
}

/**
 * Normalize an external breed name to our internal breed list.
 * Returns the matched breed name, or the original string if no match found.
 * The `matched` flag tells the caller whether normalization succeeded.
 */
export function normalizeBreed(
  breed: string | null | undefined,
  species?: string
): { breed: string | null; matched: boolean } {
  if (!breed || !breed.trim()) return { breed: null, matched: false };

  const trimmed = breed.trim();
  const lower = trimmed.toLowerCase();

  // 1. Already valid (exact match)
  if (isValidBreed(trimmed, species)) {
    return { breed: trimmed, matched: true };
  }

  // 2. Case-insensitive exact match
  const breedMap = species === "cat" ? catBreedLower : species === "dog" ? dogBreedLower : null;
  if (breedMap) {
    const found = breedMap.get(lower);
    if (found) return { breed: found, matched: true };
  } else {
    // Unknown species — try both
    const foundDog = dogBreedLower.get(lower);
    if (foundDog) return { breed: foundDog, matched: true };
    const foundCat = catBreedLower.get(lower);
    if (foundCat) return { breed: foundCat, matched: true };
  }

  // 3. Strip " Mix" suffix and try to match the base breed, then re-add Mix
  const isMix = /\s+mix$/i.test(lower);
  const baseLower = isMix ? lower.replace(/\s+mix$/i, '').trim() : lower;

  // 4. Alias lookup (on base breed without Mix)
  const aliased = breedAliases[baseLower];
  if (aliased) {
    const result = isMix && aliased !== "Mixed Breed" ? `${aliased} Mix` : aliased;
    return { breed: result, matched: true };
  }

  // 5. Substring match — find a breed that contains or is contained in the input
  const allBreeds = species === "cat" ? catBreeds : species === "dog" ? dogBreeds : [...dogBreeds, ...catBreeds];
  for (const b of allBreeds) {
    const bLower = b.toLowerCase();
    // External "Shepherd" matches "German Shepherd Dog"
    if (bLower.includes(baseLower) || baseLower.includes(bLower)) {
      const result = isMix ? `${b} Mix` : b;
      return { breed: result, matched: true };
    }
  }

  // 6. Word overlap — score breeds by shared words
  const inputWords = new Set(baseLower.split(/\s+/).filter(w => w.length > 2));
  if (inputWords.size > 0) {
    let bestBreed = "";
    let bestScore = 0;
    for (const b of allBreeds) {
      const bWords = b.toLowerCase().split(/\s+/).filter(w => w.length > 2);
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

  // 7. No match — return original, flag as unmatched
  return { breed: trimmed, matched: false };
}
