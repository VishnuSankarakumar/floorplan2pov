import { GoogleGenerativeAI, Part, InlineDataPart } from '@google/generative-ai';

// Lazily create and cache the Gemini client after dotenv has loaded.
let genAI: GoogleGenerativeAI | null = null;

function getClient() {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // If this throws, .env wasn't loaded before calling into this module.
      // Ensure index.ts calls dotenv.config(...) (with the correct ../../../.env path) before handling requests.
      throw new Error('Missing GEMINI_API_KEY. Add it to your .env at repo root.');
    }
    genAI = new GoogleGenerativeAI(apiKey);
  }
  return genAI;
}

// Type guard that checks if a Part is an InlineDataPart
function isInlinePart(p: Part): p is InlineDataPart {
  return typeof (p as InlineDataPart).inlineData?.data === 'string';
}

export async function renderFromFloorplan(opts: {
  viewpoint: string;
  style?: string;
  image: Buffer;
  mimeType: string;
}): Promise<{ buffer: Buffer; mimeType: string }> {
  const { viewpoint, style, image, mimeType } = opts;

  const prompt = [
    'You are given a 2D architectural floorplan diagram.',
    `Render a *realistic interior view* as if standing at: ${viewpoint}.`,
    'Preserve proportions and doorway/window positions consistent with the plan.',
    'Assume empty furnishings unless specified.',
    style ? `Style hints: ${style}` : ''
  ].filter(Boolean).join('\n');

  const model = getClient().getGenerativeModel({ model: 'gemini-2.5-flash-image-preview' });
  const res = await model.generateContent([
    { text: prompt },
    { inlineData: { data: image.toString('base64'), mimeType } }
  ]);

  const parts = res.response.candidates?.[0]?.content?.parts ?? [];
  const part = parts.find(isInlinePart);

  if (!part?.inlineData?.data) {
    throw new Error('No inline image data returned from Gemini.');
  }

  const outMime = part.inlineData.mimeType || 'image/jpeg';
  const outBuffer = Buffer.from(part.inlineData.data, 'base64');

  return { buffer: outBuffer, mimeType: outMime };
}
