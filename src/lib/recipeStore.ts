import type { Cuisine } from "./fridge";
import type { GeminiAlternative } from "./gemini";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
export type FullRecipe = {
  id: string;
  title: string;
  image: string;
  uses: { label: string; image?: string }[];
  minutes: number;
  serves: number;
  cuisine: Cuisine;
  hero?: boolean;
  fromItemId: string;
  steps: string[];
  ingredientsUsed: string[];
  alternativeRecipes: GeminiAlternative[];
  // The raw katori count used so impact can be tracked
  katorisUsed: number;
};

// ─────────────────────────────────────────────
// In-Memory Store
// ─────────────────────────────────────────────
// Recipes are generated per session — no need for persistence.
const recipeMap = new Map<string, FullRecipe>();

export function storeRecipe(recipe: FullRecipe): void {
  recipeMap.set(recipe.id, recipe);
}

export function getRecipe(id: string): FullRecipe | undefined {
  return recipeMap.get(id);
}

export function clearRecipes(): void {
  recipeMap.clear();
}
