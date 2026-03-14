// Portrait generation engine — fal.ai Nano Banana 2 (primary)
// Fallback: Gemini 3 Pro Image Preview
import { GoogleGenAI, Modality } from "@google/genai";
import { Semaphore } from "./semaphore";

// --- fal.ai setup (primary) ---
const FAL_KEY = process.env.FAL_KEY;

// --- Gemini setup (fallback) ---
export const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const geminiSemaphore = new Semaphore(10);

// --- Helpers ---

function parseBase64(dataUrl: string): { mimeType: string; data: string } {
  const data = dataUrl.includes(",") ? dataUrl.split(",")[1] : dataUrl;
  const mimeType = (dataUrl.match(/data:([^;]+);/) || [])[1] || "image/jpeg";
  return { mimeType, data };
}

/** Convert a URL to a data URI */
async function urlToDataUri(url: string): Promise<string> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch image: ${response.status}`);
  const buffer = Buffer.from(await response.arrayBuffer());
  const contentType = response.headers.get("content-type") || "image/png";
  return `data:${contentType};base64,${buffer.toString("base64")}`;
}

function extractImageFromResponse(response: any): string | null {
  const part = response.candidates?.[0]?.content?.parts?.find(
    (p: { inlineData?: { data?: string } }) => p.inlineData
  );
  if (!part?.inlineData?.data) return null;
  const mime = part.inlineData.mimeType || "image/png";
  return `data:${mime};base64,${part.inlineData.data}`;
}

function isRetryableError(err: any): boolean {
  const status = err?.status || err?.httpStatusCode || err?.code;
  if (status === 429 || status === 503) return true;
  const msg = String(err?.message || "").toLowerCase();
  return msg.includes("resource_exhausted") || msg.includes("rate limit") || msg.includes("overloaded") || msg.includes("unavailable");
}

async function callWithRetry<T>(fn: () => Promise<T>, label: string): Promise<T> {
  const MAX_RETRIES = 3;
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await fn();
    } catch (err: any) {
      if (attempt < MAX_RETRIES && isRetryableError(err)) {
        const delay = Math.pow(2, attempt + 1) * 1000 + Math.random() * 1000;
        console.warn(`[gemini] ${label} attempt ${attempt + 1} failed (${err?.message || err}), retrying in ${Math.round(delay)}ms...`);
        await new Promise(r => setTimeout(r, delay));
        continue;
      }
      throw err;
    }
  }
  throw new Error(`${label}: all retries exhausted`);
}

// --- fal.ai Nano Banana 2: Primary generator ---
// Stefanie's proven prompt — DO NOT MODIFY THIS WORDING (20+ iterations to get right)
function buildFalPrompt(styleName: string): string {
  return `Create a ${styleName} scene using the EXACT dog from the first image. Note that the first dog does NOT have standard breed features so do not substitute or make this dog pretty. Ensure all ORIGINAL dog features are EXACTLY COPIED / PRESERVED (snout length and shape and slope, width of face (wide or narrow and fox-like), eye color and shape, ear shape and direction they point, fur color and texture, height)`;
}

export interface FalOptions {
  dogImageUrl: string;     // Public URL of the dog's photo
  styleImageUrl: string;   // Public URL of the style reference image
  styleName: string;       // e.g. "Garden Party", "Renaissance Noble"
}

async function generateWithFal(options: FalOptions): Promise<string> {
  const prompt = buildFalPrompt(options.styleName);
  console.log(`[fal] Generating "${options.styleName}" portrait via Nano Banana 2...`);

  // Submit to queue — /edit is ONLY for submit endpoint
  const submitRes = await fetch("https://queue.fal.run/fal-ai/nano-banana-2/edit", {
    method: "POST",
    headers: {
      "Authorization": `Key ${FAL_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt,
      image_urls: [options.dogImageUrl, options.styleImageUrl],
    }),
  });

  if (!submitRes.ok) {
    const errText = await submitRes.text();
    throw new Error(`fal.ai submit failed (${submitRes.status}): ${errText}`);
  }
  const { request_id } = await submitRes.json();
  console.log(`[fal] Queued request: ${request_id}`);

  // Poll for completion (timeout after 120s)
  // CRITICAL: status/result URLs do NOT include /edit
  const deadline = Date.now() + 120_000;
  while (Date.now() < deadline) {
    await new Promise(r => setTimeout(r, 1500));
    const statusRes = await fetch(
      `https://queue.fal.run/fal-ai/nano-banana-2/requests/${request_id}/status`,
      { headers: { "Authorization": `Key ${FAL_KEY}` } },
    );
    const statusData = await statusRes.json();
    if (statusData.status === "COMPLETED") break;
    if (statusData.status === "FAILED") {
      throw new Error(`fal.ai generation failed: ${JSON.stringify(statusData)}`);
    }
  }

  // Get result — NO /edit in URL
  const resultRes = await fetch(
    `https://queue.fal.run/fal-ai/nano-banana-2/requests/${request_id}`,
    { headers: { "Authorization": `Key ${FAL_KEY}` } },
  );
  if (!resultRes.ok) throw new Error(`fal.ai result fetch failed: ${resultRes.status}`);
  const result = await resultRes.json();
  const imageUrl = result.images?.[0]?.url;
  if (!imageUrl) throw new Error("fal.ai returned no image in response");

  console.log(`[fal] Portrait generated successfully`);
  // Convert to data URI for consistency with rest of codebase
  return urlToDataUri(imageUrl);
}

// --- Main generation function ---

export async function generateImage(prompt: string, sourceImage?: string, falOptions?: FalOptions): Promise<string> {
  // Try fal.ai first if configured and style info provided
  if (FAL_KEY && falOptions?.dogImageUrl && falOptions?.styleImageUrl && falOptions?.styleName) {
    try {
      return await geminiSemaphore.run(() =>
        callWithRetry(() => generateWithFal(falOptions), "generateWithFal")
      );
    } catch (falErr: any) {
      console.error("[fal] Generation failed, falling back to Gemini:", falErr.message);
    }
  }

  // Fallback to Gemini
  if (sourceImage) {
    const result = await generateWithImage(prompt, sourceImage);
    if (result) return result;
    throw new Error("Image generation with reference photo returned no result. Please try again.");
  }
  return generateTextOnly(prompt);
}

const FIDELITY_PREFIX = `REFERENCE PHOTO ATTACHED — YOU MUST DEPICT THIS EXACT ANIMAL.

MANDATORY RULES (violating any rule = total failure):
1. SINGLE ANIMAL ONLY — depict ONLY the one animal from the reference photo. Never add extra animals, companions, or duplicates to the scene.
2. PHOTO OVERRIDES TEXT — if the text mentions a breed that doesn't match the photo, depict what you SEE in the photo. The photo is always the sole authority.
3. EXACT COLORS AND PATTERNS — reproduce each color exactly where it appears on the body. White chest stays white, dark back stays dark, patches stay in the same locations and proportions. Do NOT simplify a multi-colored coat into one uniform tone. Do NOT shift colors to match "typical breed" palettes or scene lighting.
4. PRESERVE UNIQUE FEATURES — floppy ears stay floppy, perked ears stay perked. If ears are asymmetric (one up, one down; one folded, one straight), keep them asymmetric. Underbites, crooked tails, scars, heterochromia, unusual markings — reproduce them ALL exactly. Do NOT "fix" or normalize any feature to match breed standard.
5. PRESERVE FACE AND BODY — match this animal's exact muzzle shape, eye color, ear shape and position, fur texture and length, and body proportions from the photo.
6. PHOTOREALISTIC ANIMAL — the animal must look like a real, living creature with photorealistic fur, natural eyes, and real anatomy. Apply the artistic style to the scene, costume, and background — but the animal itself must always look like a genuine photograph of a real animal.

Now apply the following artistic style to this exact animal:

`;

async function generateWithImage(prompt: string, sourceImage: string): Promise<string | null> {
  const { mimeType, data } = parseBase64(sourceImage);
  const enhancedPrompt = FIDELITY_PREFIX + prompt;
  return geminiSemaphore.run(() =>
    callWithRetry(async () => {
      const response = await ai.models.generateContent({
        model: "gemini-3-pro-image-preview",
        contents: [{ role: "user", parts: [{ text: enhancedPrompt }, { inlineData: { mimeType, data } }] }],
        config: { responseModalities: [Modality.TEXT, Modality.IMAGE], imageConfig: { imageSize: "2K" } },
      });
      return extractImageFromResponse(response);
    }, "generateWithImage")
  );
}

async function generateTextOnly(prompt: string): Promise<string> {
  for (let attempt = 0; attempt < 2; attempt++) {
    const result = await geminiSemaphore.run(() =>
      callWithRetry(async () => {
        const response = await ai.models.generateContent({
          model: "gemini-3-pro-image-preview",
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          config: { responseModalities: [Modality.TEXT, Modality.IMAGE] },
        });
        return extractImageFromResponse(response);
      }, "generateTextOnly")
    );
    if (result) return result;
  }
  throw new Error("Failed to generate image after retries");
}

export async function editImage(currentImage: string, editPrompt: string): Promise<string> {
  const { mimeType, data } = parseBase64(currentImage);
  return geminiSemaphore.run(() =>
    callWithRetry(async () => {
      const response = await ai.models.generateContent({
        model: "gemini-3-pro-image-preview",
        contents: [{
          role: "user",
          parts: [
            { inlineData: { mimeType, data } },
            { text: `Edit this image: ${editPrompt}. Keep the same overall style and subject, just apply the requested modifications.` },
          ],
        }],
        config: { responseModalities: [Modality.TEXT, Modality.IMAGE] },
      });
      const result = extractImageFromResponse(response);
      if (!result) throw new Error("Failed to edit image");
      return result;
    }, "editImage")
  );
}
