import { useSyncExternalStore } from "react";
import type { Cuisine, Diet } from "./fridge";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
export type Preferences = {
  cuisine: Cuisine;
  diet: Diet;
};

const DEFAULT: Preferences = {
  cuisine: "Indian",
  diet: "Veg",
};

// ─────────────────────────────────────────────
// localStorage Persistence
// ─────────────────────────────────────────────
const LS_KEY = "katori:preferences";

function loadPreferences(): Preferences {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Preferences;
      if (parsed.cuisine && parsed.diet) return parsed;
    }
  } catch {
    // ignore
  }
  return { ...DEFAULT };
}

function savePreferences(p: Preferences) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(p));
  } catch {
    // ignore
  }
}

// ─────────────────────────────────────────────
// Store
// ─────────────────────────────────────────────
let prefs: Preferences = loadPreferences();
const listeners = new Set<() => void>();

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};
const snapshot = () => prefs;

export function setPreferences(patch: Partial<Preferences>) {
  prefs = { ...prefs, ...patch };
  savePreferences(prefs);
  listeners.forEach((l) => l());
}

export function usePreferences(): Preferences {
  return useSyncExternalStore(subscribe, snapshot, snapshot);
}
