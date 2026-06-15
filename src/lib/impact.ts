import { useSyncExternalStore } from "react";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
export type ImpactState = {
  katorisSaved: number;
  moneySaved: number;       // ₹ — based on ₹35 per katori
  wastePrevented: number;   // kg — based on 0.15 kg per katori
  currentStreak: number;    // consecutive days cooking
  lastCookedDate: string | null; // ISO date "YYYY-MM-DD"
};

// ─────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────
const MONEY_PER_KATORI = 35;   // ₹ per katori saved
const WASTE_PER_KATORI = 0.15; // kg per katori

// ─────────────────────────────────────────────
// localStorage Persistence
// ─────────────────────────────────────────────
const LS_KEY = "katori:impact";

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function loadImpact(): ImpactState {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as ImpactState;
      if (typeof parsed.katorisSaved === "number") return parsed;
    }
  } catch {
    // ignore
  }
  return {
    katorisSaved: 0,
    moneySaved: 0,
    wastePrevented: 0,
    currentStreak: 0,
    lastCookedDate: null,
  };
}

function saveImpact(state: ImpactState) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

// ─────────────────────────────────────────────
// Store
// ─────────────────────────────────────────────
let state: ImpactState = loadImpact();
const listeners = new Set<() => void>();

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};
const snapshot = () => state;

function emit() {
  listeners.forEach((l) => l());
}

export function useImpact(): ImpactState {
  return useSyncExternalStore(subscribe, snapshot, snapshot);
}

/**
 * Called when a user cooks a recipe. Increments all impact stats and
 * manages the consecutive-day streak.
 */
export function recordCookedRecipe(katorisUsed: number) {
  const today = todayISO();
  const prev = state;

  // --- Streak logic ---
  let newStreak = 1;
  if (prev.lastCookedDate) {
    const prevDate = new Date(prev.lastCookedDate);
    const todayDate = new Date(today);
    const diffMs = todayDate.getTime() - prevDate.getTime();
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      // Already cooked today — keep streak, do not double-count streak
      newStreak = prev.currentStreak;
    } else if (diffDays === 1) {
      // Cooked yesterday — extend streak
      newStreak = prev.currentStreak + 1;
    } else {
      // Gap > 1 day — reset to 1
      newStreak = 1;
    }
  }

  state = {
    katorisSaved: prev.katorisSaved + katorisUsed,
    moneySaved: Math.round(prev.moneySaved + katorisUsed * MONEY_PER_KATORI),
    wastePrevented:
      Math.round((prev.wastePrevented + katorisUsed * WASTE_PER_KATORI) * 100) / 100,
    currentStreak: newStreak,
    lastCookedDate: today,
  };

  saveImpact(state);
  emit();
}

// ─────────────────────────────────────────────
// Magnet Data for the Magnets Page
// ─────────────────────────────────────────────
export type MagnetDef = {
  id: string;
  emoji: string;
  label: string;
  sub?: string;
  shape: "round" | "square" | "hex";
  color: "tomato" | "emerald" | "amber" | "slate" | "marigold" | "sky";
  x: number;
  y: number;
  rot: number;
};

export function getMagnetData(impact: ImpactState): MagnetDef[] {
  const magnets: MagnetDef[] = [
    {
      id: "streak",
      emoji: "🔥",
      label: `${impact.currentStreak} Day`,
      sub: "Streak",
      shape: "square",
      color: "tomato",
      x: 12,
      y: 8,
      rot: -6,
    },
    {
      id: "saved",
      emoji: "🥣",
      label: String(impact.katorisSaved),
      sub: "Katoris Saved",
      shape: "round",
      color: "emerald",
      x: 60,
      y: 6,
      rot: 8,
    },
    {
      id: "money",
      emoji: "💰",
      label: `₹${impact.moneySaved.toLocaleString("en-IN")}`,
      sub: "Saved",
      shape: "round",
      color: "marigold",
      x: 14,
      y: 40,
      rot: 4,
    },
    {
      id: "waste",
      emoji: "🌱",
      label: `${impact.wastePrevented}kg`,
      sub: "Waste Prevented",
      shape: "hex",
      color: "sky",
      x: 58,
      y: 38,
      rot: -4,
    },
  ];

  // Zero-waste week badge — only appears after 7+ consecutive days
  if (impact.currentStreak >= 7) {
    magnets.push({
      id: "zero",
      emoji: "♻",
      label: "Zero Waste",
      sub: "Week",
      shape: "square",
      color: "slate",
      x: 30,
      y: 70,
      rot: -2,
    });
  }

  return magnets;
}
