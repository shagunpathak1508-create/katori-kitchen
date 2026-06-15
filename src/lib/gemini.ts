import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { Cuisine, Diet } from "./fridge";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
export type GeminiRecipeStep = string;

export type GeminiAlternative = {
  title: string;
  prepTime: number;
  serves: number;
};

export type GeminiRecipeResponse = {
  heroRecipe: string;
  alternativeRecipes: GeminiAlternative[];
  ingredientsUsed: string[];
  steps: GeminiRecipeStep[];
  prepTime: number;
  serves: number;
};

// ─────────────────────────────────────────────
// Server Function — Gemini API call (key stays server-side)
// ─────────────────────────────────────────────
const inputSchema = z.object({
  foodName: z.string(),
  quantity: z.string(),
  freshnessStatus: z.string(),
  cuisinePreference: z.string(),
  dietPreference: z.string(),
});

export const callGeminiRecipe = createServerFn({ method: "POST" })
  .inputValidator(inputSchema)
  .handler(async ({ data }): Promise<GeminiRecipeResponse> => {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured on the server.");
    }

    const prompt = buildPrompt(data);

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.7,
            maxOutputTokens: 1024,
          },
        }),
      },
    );

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Gemini API error ${response.status}: ${errText}`);
    }

    const raw = await response.json();
    const text: string =
      raw?.candidates?.[0]?.content?.parts?.[0]?.text ?? "{}";

    let parsed: GeminiRecipeResponse;
    try {
      parsed = JSON.parse(text) as GeminiRecipeResponse;
    } catch {
      throw new Error("Gemini returned invalid JSON: " + text.slice(0, 200));
    }

    // Validate shape — provide safe defaults where fields are missing
    return {
      heroRecipe: parsed.heroRecipe ?? `${data.foodName} Special`,
      alternativeRecipes: Array.isArray(parsed.alternativeRecipes)
        ? parsed.alternativeRecipes.slice(0, 2)
        : [],
      ingredientsUsed: Array.isArray(parsed.ingredientsUsed)
        ? parsed.ingredientsUsed
        : [`${data.quantity} ${data.foodName}`],
      steps: Array.isArray(parsed.steps) ? parsed.steps : [],
      prepTime: typeof parsed.prepTime === "number" ? parsed.prepTime : 20,
      serves: typeof parsed.serves === "number" ? parsed.serves : 2,
    };
  });

// ─────────────────────────────────────────────
// Prompt Builder
// ─────────────────────────────────────────────
function buildPrompt(data: z.infer<typeof inputSchema>): string {
  return `You are a creative Indian home chef. A user has leftover food in the fridge.

Leftover Details:
- Food: ${data.foodName}
- Quantity: ${data.quantity}
- Freshness: ${data.freshnessStatus} (this food should be used ${data.freshnessStatus === "tonight" ? "tonight urgently" : data.freshnessStatus === "soon" ? "soon in the next day" : "within a few days"})
- Cuisine Preference: ${data.cuisinePreference}
- Diet: ${data.dietPreference}

Generate 1 hero recipe and 2 alternative recipes that creatively repurpose this leftover.

Rules:
- If cuisine is "Indian", suggest Indian-style transformations (parathas, kathi rolls, tikki, khichdi, etc.)
- If cuisine is "Global", suggest global transformations (tacos, wraps, quesadillas, fried rice, etc.)
- Diet "${data.dietPreference}" must be respected — no non-vegetarian ingredients if diet is "Veg"
- The hero recipe should be the most impactful and exciting transformation
- Steps must be practical, numbered, and suitable for a home cook
- Prep time should be realistic (10-30 minutes typically)

Respond ONLY with valid JSON in this exact format (no markdown, no explanation):
{
  "heroRecipe": "Recipe Name Here",
  "alternativeRecipes": [
    { "title": "Alternative 1 Name", "prepTime": 15, "serves": 2 },
    { "title": "Alternative 2 Name", "prepTime": 20, "serves": 3 }
  ],
  "ingredientsUsed": [
    "${data.quantity} ${data.foodName}",
    "Additional ingredient 1",
    "Additional ingredient 2"
  ],
  "steps": [
    "Step 1: Description",
    "Step 2: Description",
    "Step 3: Description",
    "Step 4: Description",
    "Step 5: Description"
  ],
  "prepTime": 20,
  "serves": 2
}`;
}

// ─────────────────────────────────────────────
// Client-Side Cache + Public API
// ─────────────────────────────────────────────
const CACHE_PREFIX = "katori:recipe:";

function cacheKey(foodName: string, cuisine: Cuisine, diet: Diet): string {
  return `${CACHE_PREFIX}${foodName}|${cuisine}|${diet}`;
}

function readCache(key: string): GeminiRecipeResponse | null {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw) as GeminiRecipeResponse;
  } catch {
    // ignore
  }
  return null;
}

function writeCache(key: string, data: GeminiRecipeResponse) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // ignore quota errors
  }
}

/**
 * Public function called from the client.
 * Returns cached result if available; otherwise calls the Gemini server function.
 */
export async function getGeminiRecipes(
  foodName: string,
  quantity: string,
  freshnessStatus: string,
  cuisine: Cuisine,
  diet: Diet,
): Promise<GeminiRecipeResponse> {
  const key = cacheKey(foodName, cuisine, diet);
  const cached = readCache(key);
  if (cached) return cached;

  const result = await callGeminiRecipe({
    data: {
      foodName,
      quantity,
      freshnessStatus,
      cuisinePreference: cuisine,
      dietPreference: diet,
    },
  });

  writeCache(key, result);
  return result;
}
