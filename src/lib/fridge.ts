import { useSyncExternalStore } from "react";
import paneer from "@/assets/katori-paneer.png";
import dal from "@/assets/katori-dal.png";
import rice from "@/assets/katori-rice.png";
import aloo from "@/assets/katori-aloo.png";
import chole from "@/assets/katori-chole.png";

export type Freshness = "fresh" | "soon" | "tonight";
export type Cuisine = "Indian" | "Global";
export type Diet = "Veg" | "Non-Veg" | "Eggitarian" | "Any";

export type Item = {
  id: string;
  name: string;
  image: string;
  freshness: Freshness;
  qty: string;
  count: number;
  dateAdded: string;
  notes?: string;
  size: "sm" | "md" | "lg";
  shelf: 0 | 1 | 2;
};

const today = () => new Date().toISOString().slice(0, 10);
const yesterday = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
};

export const imagePool = [paneer, dal, rice, aloo, chole];

const INITIAL: Item[] = [
  { id: "1", name: "Paneer Bhurji", image: paneer, freshness: "fresh", qty: "1 bowl", count: 1, dateAdded: yesterday(), size: "lg", shelf: 0 },
  { id: "2", name: "Dal Tadka",     image: dal,    freshness: "soon",  qty: "1 bowl", count: 1, dateAdded: yesterday(), size: "md", shelf: 0 },
  { id: "3", name: "Jeera Rice",    image: rice,   freshness: "fresh", qty: "1 bowl", count: 1, dateAdded: today(),     size: "md", shelf: 1 },
  { id: "4", name: "Chole",         image: chole,  freshness: "tonight", qty: "2 bowls", count: 2, dateAdded: yesterday(), size: "lg", shelf: 1 },
  { id: "5", name: "Aloo Fry",      image: aloo,   freshness: "soon",  qty: "1 bowl", count: 1, dateAdded: yesterday(), size: "md", shelf: 2 },
];

let items: Item[] = INITIAL;
const listeners = new Set<() => void>();
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};
const snapshot = () => items;

export function setItems(updater: (prev: Item[]) => Item[]) {
  items = updater(items);
  listeners.forEach((l) => l());
}

export function useItems() {
  return useSyncExternalStore(subscribe, snapshot, snapshot);
}

/* ───────────── Freshness language ───────────── */
export function freshnessText(f: Freshness): string {
  if (f === "tonight") return "Best used tonight";
  if (f === "soon") return "Best used tomorrow";
  return "Safe for 3 more days";
}

export function freshnessTone(f: Freshness): "red" | "amber" | "green" {
  return f === "tonight" ? "red" : f === "soon" ? "amber" : "green";
}

/* ───────────── Rescue Priority Engine ───────────── */
// Higher score = more urgent to rescue.
export function priorityScore(item: Item): number {
  const freshnessWeight: Record<Freshness, number> = { tonight: 3, soon: 2, fresh: 1 };
  const valueWeight = Math.max(1, item.count); // estimated food value via qty
  return freshnessWeight[item.freshness] * 10 + valueWeight;
}

export function priorityLabel(item: Item): "High" | "Medium" | "Low" {
  const s = priorityScore(item);
  if (s >= 30) return "High";
  if (s >= 20) return "Medium";
  return "Low";
}

export function sortByRescue(list: Item[]): Item[] {
  return [...list].sort((a, b) => priorityScore(b) - priorityScore(a));
}

/* ───────────── AI Transformation Engine ───────────── */
import frankie from "@/assets/dish-frankie.jpg";
import khichdi from "@/assets/dish-khichdi.jpg";
import tikki from "@/assets/dish-tikki.jpg";

const DISH_IMAGES = [frankie, khichdi, tikki];

type Transform = { indian: string[]; global: string[]; pairs?: string[] };

const TRANSFORMS: Record<string, Transform> = {
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

const dietOk = (_name: string, diet: Diet) => diet === "Any" || diet !== "Non-Veg";

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
    const titles = (cuisine === "Indian" ? t.indian : t.global).filter((n) =>
      dietOk(n, diet),
    );
    titles.slice(0, idx === 0 ? 3 : 1).forEach((title, j) => {
      out.push({
        id: `${item.id}-${j}`,
        title,
        image: DISH_IMAGES[(idx + j) % DISH_IMAGES.length],
        uses: [
          { label: `${item.count} Katori ${item.name}`, image: item.image },
          ...(t.pairs ? [{ label: t.pairs[j % t.pairs.length] }] : []),
        ],
        minutes: 15 + ((idx + j) % 4) * 5,
        serves: 2 + ((idx + j) % 3),
        cuisine,
        hero: idx === 0 && j === 0,
        fromItemId: item.id,
      });
    });
  });
  return out;
}
