// ─────────────────────────────────────────────
// Centralized Image Registry
// ─────────────────────────────────────────────
// Single source of truth for ALL food and recipe images.
// Every screen pulls from here — never use index-based matching.

import paneer from "@/assets/katori-paneer.png";
import dal from "@/assets/katori-dal.png";
import rice from "@/assets/katori-rice.png";
import aloo from "@/assets/katori-aloo.png";
import chole from "@/assets/katori-chole.png";

import frankie from "@/assets/dish-frankie.jpg";
import khichdi from "@/assets/dish-khichdi.jpg";
import tikki from "@/assets/dish-tikki.jpg";

import type { Category } from "./fridge";
import { logImageResolved } from "./debug";

// ─────────────────────────────────────────────
// Katori (Bowl) Images — by category
// ─────────────────────────────────────────────
const KATORI_BY_CATEGORY: Record<Category, string> = {
  Paneer: paneer,
  Dal: dal,
  Rice: rice,
  Chole: chole,
  Curry: dal,    // curry dishes look closest to dal
  Sabzi: aloo,   // sabzi/aloo share visual category
  Other: rice,   // generic fallback
};

// ─────────────────────────────────────────────
// Katori Images — by specific food name (overrides category)
// ─────────────────────────────────────────────
const KATORI_BY_NAME: Record<string, string> = {
  "Paneer Bhurji": paneer,
  "Dal Tadka": dal,
  "Jeera Rice": rice,
  "Chole": chole,
  "Aloo Fry": aloo,
  "Aloo Gobi": aloo,
  "Aloo Paratha": aloo,
  "Paneer Butter Masala": paneer,
  "Rajma": dal,
  "Chana Dal": dal,
  "Veg Pulao": rice,
  "Fried Rice": rice,
  "Biryani": rice,
  "Kadhi": dal,
  "Palak Paneer": paneer,
  "Shahi Paneer": paneer,
  "Matar Paneer": paneer,
  "Dal Makhani": dal,
  "Dal Fry": dal,
  "Chole Bhature": chole,
  "Mixed Veg": aloo,
  "Baingan Bharta": aloo,
};

// ─────────────────────────────────────────────
// Recipe / Dish Images — keyword-based matching
// ─────────────────────────────────────────────
// Each entry: [keywords to match in title, image to use]
const RECIPE_KEYWORD_MAP: [string[], string][] = [
  // Frankie / wrap / roll family
  [["frankie", "wrap", "roll", "kathi", "burrito"], frankie],
  // Khichdi / rice / pulao family
  [["khichdi", "rice", "pulao", "biryani", "arancini", "bowl"], khichdi],
  // Tikki / patty / samosa / paratha / stuffed family
  [["tikki", "patty", "samosa", "paratha", "cheela", "hash", "tortilla", "stack"], tikki],
  // Taco / quesadilla family
  [["taco", "quesadilla", "pita"], frankie],
  // Soup / hummus family
  [["soup", "hummus"], khichdi],
  // Toast / open-face family
  [["toast", "snack", "burger"], tikki],
  // Kulcha family
  [["kulcha"], tikki],
];

// Fallback dish image
const FALLBACK_DISH_IMAGE = khichdi;

// Fallback katori image
const FALLBACK_KATORI_IMAGE = rice;

// ─────────────────────────────────────────────
// Public Lookup Functions
// ─────────────────────────────────────────────

/**
 * Get the katori (bowl) image for a food item.
 * Priority: exact name match → category match → fallback.
 */
export function getKatoriImage(foodName: string, category: Category): string {
  // 1. Exact name match
  const byName = KATORI_BY_NAME[foodName];
  if (byName) {
    logImageResolved("katori-name", foodName, byName);
    return byName;
  }

  // 2. Fuzzy name match (check if any key is a substring of foodName or vice versa)
  const nameLower = foodName.toLowerCase();
  for (const [key, img] of Object.entries(KATORI_BY_NAME)) {
    if (nameLower.includes(key.toLowerCase()) || key.toLowerCase().includes(nameLower)) {
      logImageResolved("katori-fuzzy", foodName, img);
      return img;
    }
  }

  // 3. Category match
  const byCat = KATORI_BY_CATEGORY[category];
  if (byCat) {
    logImageResolved("katori-category", foodName, byCat);
    return byCat;
  }

  // 4. Fallback
  logImageResolved("katori-fallback", foodName, FALLBACK_KATORI_IMAGE);
  return FALLBACK_KATORI_IMAGE;
}

/**
 * Get the dish image for a recipe title.
 * Uses keyword matching against the title.
 */
export function getRecipeImage(recipeTitle: string): string {
  const titleLower = recipeTitle.toLowerCase();

  for (const [keywords, img] of RECIPE_KEYWORD_MAP) {
    for (const kw of keywords) {
      if (titleLower.includes(kw)) {
        logImageResolved("recipe", recipeTitle, img);
        return img;
      }
    }
  }

  // Fallback
  logImageResolved("recipe-fallback", recipeTitle, FALLBACK_DISH_IMAGE);
  return FALLBACK_DISH_IMAGE;
}
