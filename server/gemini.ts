import { GoogleGenAI, Modality } from "@google/genai";

export const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

function extractImageFromResponse(response: any): string | null {
  const part = response.candidates?.[0]?.content?.parts?.find(
    (p: { inlineData?: { data?: string } }) => p.inlineData
  );
  if (!part?.inlineData?.data) return null;
  const mime = part.inlineData.mimeType || "image/png";
  return `data:${mime};base64,${part.inlineData.data}`;
}

function parseBase64(dataUrl: string): { mimeType: string; data: string } {
  const data = dataUrl.includes(",") ? dataUrl.split(",")[1] : dataUrl;
  const mimeType = (dataUrl.match(/data:([^;]+);/) || [])[1] || "image/jpeg";
  return { mimeType, data };
}

export async function generateImage(prompt: string, sourceImage?: string): Promise<string> {
  if (sourceImage) {
    try {
      const result = await generateWithImage(prompt, sourceImage);
      if (result) return result;
    } catch {
      // fall through to text-only
    }
  }
  return generateTextOnly(prompt);
}

const FIDELITY_PREFIX = `REFERENCE PHOTO ATTACHED — YOU MUST USE IT.
Study the attached photo carefully. This is the EXACT animal you must depict.
You MUST faithfully reproduce THIS SPECIFIC animal's:
- Face shape, muzzle, and facial structure
- Ear shape, size, and positioning
- Fur/coat color, pattern, markings, and texture
- Eye color and shape
- Body size and proportions
- Any unique distinguishing features (spots, patches, scars, etc.)

DO NOT substitute a generic or different-looking animal. DO NOT change the animal's coloring, markings, or features to match any breed stereotype. The generated portrait must be unmistakably recognizable as the SAME individual animal in the reference photo. If the style description mentions specific colors or physical features that conflict with the actual animal in the photo, ALWAYS use the animal's REAL appearance from the photo instead.

Now apply the following artistic style while preserving this exact animal's appearance:

`;

async function generateWithImage(prompt: string, sourceImage: string): Promise<string | null> {
  const { mimeType, data } = parseBase64(sourceImage);
  const enhancedPrompt = FIDELITY_PREFIX + prompt;
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-image",
    contents: [{ role: "user", parts: [{ inlineData: { mimeType, data } }, { text: enhancedPrompt }] }],
    config: { responseModalities: [Modality.TEXT, Modality.IMAGE] },
  });
  return extractImageFromResponse(response);
}

async function generateTextOnly(prompt: string): Promise<string> {
  for (let attempt = 0; attempt < 2; attempt++) {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: { responseModalities: [Modality.TEXT, Modality.IMAGE] },
    });
    const result = extractImageFromResponse(response);
    if (result) return result;
  }
  throw new Error("Failed to generate image after retries");
}

export async function editImage(currentImage: string, editPrompt: string): Promise<string> {
  const { mimeType, data } = parseBase64(currentImage);
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-image",
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
}
