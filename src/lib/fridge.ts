import { useSyncExternalStore } from "react";
import { getKatoriImage, getRecipeImage } from "@/lib/imageRegistry";
import { logItemsMutated, logRecipeGenerated, logShelfRebalance } from "@/lib/debug";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
export type Freshness = "fresh" | "soon" | "tonight";
export type Cuisine = "Indian" | "Global";
export type Diet = "Veg" | "Non-Veg" | "Eggitarian" | "Any";
export type Category =
  | "Paneer"
  | "Dal"
  | "Rice"
  | "Chole"
  | "Curry"
  | "Sabzi"
  | "Other";

export type Item = {
  id: string;
  name: string;
  image: string;
  qty: string;
  count: number;
  dateAdded: string; // ISO date string, e.g. "2024-06-15"
  category: Category;
  notes?: string;
  size: "sm" | "md" | "lg";
  shelf: 0 | 1 | 2;
};

// ─────────────────────────────────────────────
// Freshness Engine — Rule-Based Lookup Table (NO AI)
// ─────────────────────────────────────────────
// greenDays:  0..greenDays  → "fresh"
// yellowDays: greenDays+1..yellowDays → "soon"
// red:        yellowDays+1+           → "tonight"
type FreshnessRule = { greenDays: number; yellowDays: number };

export const FRESHNESS_RULES: Record<Category, FreshnessRule> = {
  Paneer: { greenDays: 1, yellowDays: 2 }, // 0-1 fresh | 2 soon | 3+ tonight
  Dal:    { greenDays: 2, yellowDays: 3 }, // 0-2 fresh | 3 soon | 4+ tonight
  Rice:   { greenDays: 1, yellowDays: 2 }, // 0-1 fresh | 2 soon | 3+ tonight
  Chole:  { greenDays: 1, yellowDays: 2 }, // 0-1 fresh | 2 soon | 3+ tonight
  Curry:  { greenDays: 1, yellowDays: 2 }, // 0-1 fresh | 2 soon | 3+ tonight
  Sabzi:  { greenDays: 2, yellowDays: 3 }, // 0-2 fresh | 3 soon | 4+ tonight
  Other:  { greenDays: 2, yellowDays: 3 }, // default fallback
};

/** Compute freshness from category + dateAdded. No AI required. */
export function computeFreshness(category: Category, dateAdded: string): Freshness {
  const added = new Date(dateAdded);
  const now = new Date();
  // Compare calendar days only, not time-of-day
  const addedDay = Date.UTC(added.getFullYear(), added.getMonth(), added.getDate());
  const todayDay = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  const ageInDays = Math.floor((todayDay - addedDay) / (1000 * 60 * 60 * 24));

  const rule = FRESHNESS_RULES[category] ?? FRESHNESS_RULES.Other;
  if (ageInDays <= rule.greenDays) return "fresh";
  if (ageInDays <= rule.yellowDays) return "soon";
  return "tonight";
}

/** Get freshness for an item — convenience wrapper */
export function itemFreshness(item: Item): Freshness {
  return computeFreshness(item.category, item.dateAdded);
}

// ─────────────────────────────────────────────
// Freshness Display Helpers
// ─────────────────────────────────────────────
export function freshnessText(f: Freshness): string {
  if (f === "tonight") return "Use Tonight";
  if (f === "soon") return "Use Soon";
  return "Fresh";
}

export function freshnessTone(f: Freshness): "red" | "amber" | "green" {
  return f === "tonight" ? "red" : f === "soon" ? "amber" : "green";
}

// ─────────────────────────────────────────────
// Priority Engine — Spec Formula (NO AI)
// ─────────────────────────────────────────────
// Freshness Weight: Red = +100, Yellow = +50, Green = +10
// Quantity Weight:  1 katori = +10, 2 = +20, 3+ = +30
export function priorityScore(item: Item): number {
  const f = itemFreshness(item);
  const freshnessWeight = f === "tonight" ? 100 : f === "soon" ? 50 : 10;
  const qtyWeight = item.count >= 3 ? 30 : item.count === 2 ? 20 : 10;
  return freshnessWeight + qtyWeight;
}

export function priorityLabel(item: Item): "High" | "Medium" | "Low" {
  const s = priorityScore(item);
  if (s >= 110) return "High";
  if (s >= 60) return "Medium";
  return "Low";
}

export function sortByRescue(list: Item[]): Item[] {
  return [...list].sort((a, b) => priorityScore(b) - priorityScore(a));
}

// ─────────────────────────────────────────────
// Seed / Initial Data
// ─────────────────────────────────────────────
const today = () => new Date().toISOString().slice(0, 10);
const daysAgo = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
};

const SEED: Item[] = [
  { id: "1", name: "Paneer Bhurji", image: getKatoriImage("Paneer Bhurji", "Paneer"), qty: "1 bowl", count: 1, dateAdded: daysAgo(1), category: "Paneer", size: "lg", shelf: 0 },
  { id: "2", name: "Dal Tadka",     image: getKatoriImage("Dal Tadka", "Dal"),       qty: "1 bowl", count: 1, dateAdded: daysAgo(2), category: "Dal",    size: "md", shelf: 0 },
  { id: "3", name: "Jeera Rice",    image: getKatoriImage("Jeera Rice", "Rice"),     qty: "1 bowl", count: 1, dateAdded: today(),    category: "Rice",   size: "md", shelf: 1 },
  { id: "4", name: "Chole",         image: getKatoriImage("Chole", "Chole"),         qty: "2 bowls", count: 2, dateAdded: daysAgo(2), category: "Chole", size: "lg", shelf: 1 },
  { id: "5", name: "Aloo Fry",      image: getKatoriImage("Aloo Fry", "Sabzi"),     qty: "1 bowl", count: 1, dateAdded: daysAgo(1), category: "Sabzi", size: "md", shelf: 2 },
];

// ─────────────────────────────────────────────
// Shelf Layout System
// ─────────────────────────────────────────────
const SHELF_CAPACITY = 3;

/**
 * Auto-rearrange items across shelves.
 * - Distributes items evenly across 3 shelves (max SHELF_CAPACITY each)
 * - Assigns size based on how many items share a shelf
 * - Rehydrates images from the registry (fixes stale localStorage images)
 */
export function rebalanceShelves(list: Item[]): Item[] {
  // Sort by dateAdded (oldest first → top shelf)
  const sorted = [...list].sort(
    (a, b) => new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime(),
  );

  // Assign shelves round-robin
  const shelves: Item[][] = [[], [], []];
  sorted.forEach((item, idx) => {
    const shelfIdx = Math.min(Math.floor(idx / SHELF_CAPACITY), 2) as 0 | 1 | 2;
    shelves[shelfIdx].push(item);
  });

  // Flatten back with updated shelf + size + rehydrated image
  const result: Item[] = [];
  shelves.forEach((shelf, shelfIdx) => {
    const size: "sm" | "md" | "lg" = shelf.length === 1 ? "lg" : "md";
    shelf.forEach((item) => {
      result.push({
        ...item,
        shelf: shelfIdx as 0 | 1 | 2,
        size,
        image: getKatoriImage(item.name, item.category),
      });
    });
  });

  logShelfRebalance(result.map((i) => ({ id: i.id, name: i.name, shelf: i.shelf, size: i.size })));
  return result;
}

// ─────────────────────────────────────────────
// Store with localStorage Persistence
// ─────────────────────────────────────────────
const LS_KEY = "katori:fridge";

function loadItems(): Item[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Item[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Rehydrate images from registry on load (fixes stale localStorage)
        return rebalanceShelves(
          parsed.map((item) => ({
            ...item,
            image: getKatoriImage(item.name, item.category),
          })),
        );
      }
    }
  } catch {
    // ignore parse errors
  }
  return rebalanceShelves(SEED);
}

function saveItems(list: Item[]) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(list));
  } catch {
    // ignore storage errors
  }
}

let items: Item[] = loadItems();
const listeners = new Set<() => void>();

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};
const snapshot = () => items;

export function setItems(updater: (prev: Item[]) => Item[]) {
  const updated = updater(items);
  // Auto-rebalance shelves on every mutation
  items = rebalanceShelves(updated);
  logItemsMutated("rebalance", { count: items.length, items: items.map((i) => i.name) });
  saveItems(items);
  listeners.forEach((l) => l());
}

export function useItems() {
  return useSyncExternalStore(subscribe, snapshot, snapshot);
}

/** Remove an item — used by discard (does NOT credit impact). */
export function discardItem(id: string, onRemoved?: () => void) {
  logItemsMutated("discard", { id });
  setItems((prev) => prev.filter((i) => i.id !== id));
  onRemoved?.();
}

// ─────────────────────────────────────────────
// Static Recipe Generation (Fallback — NO AI)
// ─────────────────────────────────────────────

type Transform = { indian: string[]; global: string[]; pairs?: string[] };

export const TRANSFORMS: Record<string, Transform> = {
  Chole: {
    indian: ["Chole Kulcha", "Chole Paratha", "Chole Tikki"],
    global: ["Chole Quesadilla", "Chole Tacos", "Chole Burger Patty"],
    pairs: ["2 Rotis", "Onion"],
  },
  "Paneer Bhurji": {
    indian: ["Paneer Frankie Wrap", "Paneer Paratha", "Paneer Kathi Roll"],
    global: ["Paneer Quesadilla", "Paneer Tacos", "Paneer Pita"],
    pairs: ["2 Rotis"],
  },
  "Dal Tadka": {
    indian: ["Dal Khichdi", "Dal Paratha", "Dal Cheela"],
    global: ["Dal Soup", "Dal Hummus", "Dal Wrap"],
    pairs: ["Rice"],
  },
  "Jeera Rice": {
    indian: ["Veg Pulao", "Tawa Rice", "Rice Cheela"],
    global: ["Fried Rice", "Burrito Bowl", "Arancini"],
    pairs: ["Onion"],
  },
  "Aloo Fry": {
    indian: ["Aloo Paratha", "Aloo Tikki Stack", "Aloo Samosa"],
    global: ["Potato Hash", "Aloo Burrito", "Spanish Tortilla"],
    pairs: ["2 Rotis"],
  },
};

const FALLBACK: Transform = {
  indian: ["Stuffed Paratha", "Mixed Cheela", "Tawa Snack"],
  global: ["Grilled Wrap", "Stuffed Pita", "Open Toast"],
};

const STATIC_STEPS: Record<string, string[]> = {
  default: [
    "Gather your leftover and any additional pantry ingredients.",
    "Heat a tawa or pan on medium flame with a drizzle of oil.",
    "Add your leftover and mix in the complementary ingredients.",
    "Season with salt, chaat masala, or herbs to taste.",
    "Cook until heated through and fragrant, about 5–7 minutes.",
    "Plate and serve hot with chutney or curd on the side.",
  ],
};

export type GeneratedRecipe = {
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
};

export function generateRecipes(
  items: Item[],
  cuisine: Cuisine,
  diet: Diet,
): GeneratedRecipe[] {
  const sorted = sortByRescue(items);
  const out: GeneratedRecipe[] = [];
  sorted.forEach((item, idx) => {
    const t = TRANSFORMS[item.name] ?? FALLBACK;
    const titles = (cuisine === "Indian" ? t.indian : t.global).filter(() =>
      diet !== "Non-Veg",
    );
    titles.slice(0, idx === 0 ? 3 : 1).forEach((title, j) => {
      const recipeImage = getRecipeImage(title);
      const recipe: GeneratedRecipe = {
        id: `${item.id}-${j}`,
        title,
        image: recipeImage,
        uses: [
          { label: `${item.count} Katori ${item.name}`, image: item.image },
          ...(t.pairs ? [{ label: t.pairs[j % t.pairs.length] }] : []),
        ],
        minutes: 15 + ((idx + j) % 4) * 5,
        serves: 2 + ((idx + j) % 3),
        cuisine,
        hero: idx === 0 && j === 0,
        fromItemId: item.id,
        steps: STATIC_STEPS[title] ?? STATIC_STEPS.default,
      };
      logRecipeGenerated(recipe);
      out.push(recipe);
    });
  });
  return out;
}
