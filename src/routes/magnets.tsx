import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState, type PointerEvent as RPointerEvent } from "react";
import { Nav } from "@/components/Nav";
import { useImpact, getMagnetData, type MagnetDef } from "@/lib/impact";

export const Route = createFileRoute("/magnets")({
  head: () => ({
    meta: [
      { title: "The Door — Katori" },
      { name: "description", content: "Your impact, collected as fridge magnets. Drag to arrange." },
      { property: "og:title", content: "The Door — Katori" },
    ],
  }),
  component: MagnetsPage,
});

type MagnetStyle = "tomato" | "emerald" | "amber" | "slate" | "marigold" | "sky";

const colorClass: Record<MagnetStyle, string> = {
  tomato: "bg-tomato text-white",
  emerald: "bg-emerald text-white",
  amber: "bg-amber text-amber-950",
  slate: "bg-slate-800 text-white",
  marigold: "bg-marigold text-amber-950",
  sky: "bg-sky-500 text-white",
};

function MagnetsPage() {
  const impact = useImpact();
  const liveMagnets = getMagnetData(impact);

  // Local drag positions (UI state — not persisted)
  const [positions, setPositions] = useState<Record<string, { x: number; y: number }>>(
    () => Object.fromEntries(liveMagnets.map((m) => [m.id, { x: m.x, y: m.y }])),
  );

  const boardRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    id: string;
    offsetX: number;
    offsetY: number;
    rect: DOMRect;
  } | null>(null);

  const onPointerDown = (e: RPointerEvent<HTMLDivElement>, id: string) => {
    const board = boardRef.current;
    if (!board) return;
    const rect = board.getBoundingClientRect();
    const magnetRect = e.currentTarget.getBoundingClientRect();
    dragRef.current = {
      id,
      offsetX: e.clientX - magnetRect.left,
      offsetY: e.clientY - magnetRect.top,
      rect,
    };
    (e.target as Element).setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e: RPointerEvent<HTMLDivElement>) => {
    const d = dragRef.current;
    if (!d) return;
    const px = e.clientX - d.rect.left - d.offsetX;
    const py = e.clientY - d.rect.top - d.offsetY;
    const x = Math.max(0, Math.min(85, (px / d.rect.width) * 100));
    const y = Math.max(0, Math.min(90, (py / d.rect.height) * 100));
    setPositions((prev) => ({ ...prev, [d.id]: { x, y } }));
  };

  const onPointerUp = () => { dragRef.current = null; };

  // Sync new magnets that appear (e.g., zero-waste week badge after streak hits 7)
  const knownIds = Object.keys(positions);
  const newMagnets = liveMagnets.filter((m) => !knownIds.includes(m.id));
  if (newMagnets.length > 0) {
    setPositions((prev) => ({
      ...prev,
      ...Object.fromEntries(newMagnets.map((m) => [m.id, { x: m.x, y: m.y }])),
    }));
  }

  return (
    <div className="min-h-screen bg-fridge-base overflow-x-hidden">
      <main className="relative max-w-2xl mx-auto min-h-screen border-x border-slate-200 bg-gradient-to-b from-sky-50 via-white to-sky-100/70">
        <Nav />

        {/* Stats summary strip */}
        <section className="px-8 pb-2 pt-2">
          <div className="grid grid-cols-4 gap-2">
            <StatCard emoji="🔥" value={`${impact.currentStreak}d`} label="Streak" color="tomato" />
            <StatCard emoji="🥣" value={String(impact.katorisSaved)} label="Saved" color="emerald" />
            <StatCard emoji="💰" value={`₹${impact.moneySaved}`} label="Money" color="marigold" />
            <StatCard emoji="🌱" value={`${impact.wastePrevented}kg`} label="Waste" color="sky" />
          </div>
        </section>

        {/* Brushed steel fridge door */}
        <section
          ref={boardRef}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
          className="relative mx-2 mt-4 rounded-md overflow-hidden touch-none select-none"
          style={{
            height: "36rem",
            background:
              "linear-gradient(180deg, #d8dee5 0%, #c4ccd4 30%, #b8c1cb 70%, #a8b2bc 100%)",
            boxShadow:
              "inset 0 2px 0 rgba(255,255,255,0.7), inset 0 -3px 6px rgba(0,0,0,0.18), 0 18px 40px -20px rgba(20,30,50,0.5)",
          }}
        >
          {/* Brushed steel texture */}
          <div
            className="absolute inset-0 opacity-60 pointer-events-none mix-blend-overlay"
            style={{
              backgroundImage:
                "repeating-linear-gradient(90deg, rgba(255,255,255,0.18) 0 1px, transparent 1px 3px), repeating-linear-gradient(90deg, rgba(0,0,0,0.06) 0 1px, transparent 1px 5px)",
            }}
          />
          {/* Top highlight */}
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/40 to-transparent pointer-events-none" />
          {/* Bottom shadow */}
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/15 to-transparent pointer-events-none" />
          {/* Handle */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 w-1.5 h-40 rounded-full bg-gradient-to-b from-slate-300 via-slate-100 to-slate-400 shadow-md pointer-events-none" />

          {/* Header */}
          <header className="relative text-center pt-8 pb-4 pointer-events-none">
            <p className="text-[10px] uppercase tracking-[0.3em] text-slate-700 font-bold mb-1">
              The Door
            </p>
            <h2 className="font-serif italic text-3xl text-slate-800">Your Magnet Wall</h2>
            <p className="text-[11px] text-slate-600 mt-1 font-sans">Drag to arrange</p>
          </header>

          {/* Empty state */}
          {impact.katorisSaved === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <p className="font-serif italic text-slate-500 text-center px-8 text-lg">
                Cook your first recipe to earn magnets!
              </p>
            </div>
          )}

          {/* Magnets */}
          {liveMagnets.map((m) => {
            const pos = positions[m.id] ?? { x: m.x, y: m.y };
            return (
              <div
                key={m.id}
                onPointerDown={(e) => onPointerDown(e, m.id)}
                className="absolute cursor-grab active:cursor-grabbing"
                style={{
                  left: `${pos.x}%`,
                  top: `${pos.y}%`,
                  transform: `rotate(${m.rot}deg)`,
                  filter: "drop-shadow(0 8px 10px rgba(0,0,0,0.28))",
                  touchAction: "none",
                }}
              >
                <MagnetVisual m={m} />
              </div>
            );
          })}
        </section>

        <footer className="p-10 text-center border-t border-slate-200">
          <div className="font-serif italic text-lg text-slate-600">Katori</div>
          <p className="text-[10px] uppercase tracking-[0.25em] text-slate-700 mt-1">
            A door covered in small victories.
          </p>
        </footer>
      </main>
    </div>
  );
}

function StatCard({
  emoji,
  value,
  label,
  color,
}: {
  emoji: string;
  value: string;
  label: string;
  color: "tomato" | "emerald" | "marigold" | "sky";
}) {
  const bg = {
    tomato: "bg-tomato/10 text-tomato",
    emerald: "bg-emerald/10 text-emerald",
    marigold: "bg-marigold/10 text-amber-700",
    sky: "bg-sky-100 text-sky-600",
  }[color];

  return (
    <div className={`${bg} rounded-2xl p-3 text-center`}>
      <div className="text-lg">{emoji}</div>
      <div className="text-sm font-bold leading-tight">{value}</div>
      <div className="text-[9px] uppercase tracking-wider opacity-70 mt-0.5">{label}</div>
    </div>
  );
}

function MagnetVisual({ m }: { m: MagnetDef }) {
  const base = `${colorClass[m.color as MagnetStyle]} ring-2 ring-white/40 flex flex-col items-center justify-center text-center px-3`;
  const inner = (
    <>
      <span className="text-2xl leading-none mb-0.5">{m.emoji}</span>
      <span className="text-[12px] font-extrabold leading-tight">{m.label}</span>
      {m.sub && (
        <span className="text-[9px] uppercase tracking-widest opacity-90 mt-0.5">
          {m.sub}
        </span>
      )}
    </>
  );

  if (m.shape === "round") {
    return <div className={`${base} size-28 rounded-full`}>{inner}</div>;
  }
  if (m.shape === "hex") {
    return (
      <div
        className={`${base} w-28 h-28`}
        style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
      >
        {inner}
      </div>
    );
  }
  return <div className={`${base} size-28 rounded-2xl`}>{inner}</div>;
}
