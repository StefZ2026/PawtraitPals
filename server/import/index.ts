import type { ImportProvider } from "./types";
import { petfinderProvider } from "./petfinder";
import { rescuegroupsProvider } from "./rescuegroups";
import { shelterluvProvider } from "./shelterluv";

const providers: Record<string, ImportProvider> = {
  petfinder: petfinderProvider,
  rescuegroups: rescuegroupsProvider,
  shelterluv: shelterluvProvider,
};

export function getProvider(name: string): ImportProvider {
  const provider = providers[name];
  if (!provider) {
    throw new Error(`Unknown import provider: ${name}. Available: ${Object.keys(providers).join(", ")}`);
  }
  return provider;
}

export function getAvailableProviders(): { name: string; configured: boolean }[] {
  return [
    { name: "petfinder", configured: !!(process.env.PETFINDER_API_KEY && process.env.PETFINDER_API_SECRET) },
    { name: "rescuegroups", configured: !!process.env.RESCUEGROUPS_API_KEY },
    { name: "shelterluv", configured: true }, // Always available — per-org keys
  ];
}

/**
 * Download a photo from a URL and convert to base64 data URI.
 * Returns null if download fails.
 */
export async function downloadPhotoAsBase64(photoUrl: string): Promise<string | null> {
  try {
    const res = await fetch(photoUrl, { signal: AbortSignal.timeout(30000) });
    if (!res.ok) return null;

    const contentType = res.headers.get("content-type") || "image/jpeg";
    const buffer = await res.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");
    return `data:${contentType};base64,${base64}`;
  } catch (e) {
    console.error(`[import] Failed to download photo from ${photoUrl}:`, (e as Error).message);
    return null;
  }
}

export type { NormalizedAnimal, NormalizedOrganization, ImportProvider } from "./types";
