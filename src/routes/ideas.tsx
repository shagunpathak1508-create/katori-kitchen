import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowDown, Plus, Clock, Users, Flame } from "lucide-react";
import { Nav } from "@/components/Nav";
import {
  useItems,
  generateRecipes,
  sortByRescue,
  priorityLabel,
  freshnessText,
  type Cuisine,
  type Diet,
} from "@/lib/fridge";

export const Route = createFileRoute("/ideas")({
  head: () => ({
    meta: [
      { title: "Tonight's Ideas — Katori" },
      { name: "description", content: "Rescue your most at-risk leftover first." },
      { property: "og:title", content: "Tonight's Ideas — Katori" },
    ],
  }),
  component: IdeasPage,
});

const CUISINES: Cuisine[] = ["Indian", "Global"];
const DIETS: Diet[] = ["Veg", "Non-Veg", "Eggitarian", "Any"];

const toneClass = (p: "High" | "Medium" | "Low") =>
  p === "High"
    ? "bg-tomato/15 text-tomato ring-tomato/30"
    : p === "Medium"
      ? "bg-amber/20 text-amber-700 ring-amber/40"
      : "bg-emerald/15 text-emerald-700 ring-emerald/30";

function IdeasPage() {
  const items = useItems();
  const [cuisine, setCuisine] = useState<Cuisine>("Indian");
  const [diet, setDiet] = useState<Diet>("Veg");

  const recipes = useMemo(
    () => generateRecipes(items, cuisine, diet),
    [items, cuisine, diet],
  );
  const prioritized = useMemo(() => sortByRescue(items), [items]);
  const hero = recipes.find((r) => r.hero) ?? recipes[0];
  const heroItem = hero ? items.find((i) => i.id === hero.fromItemId) : null;
  const alternates = recipes.filter((r) => r.id !== hero?.id).slice(0, 4);

  return (
    <div className="min-h-screen bg-fridge-base overflow-x-hidden">
      <main className="relative max-w-2xl mx-auto min-h-screen border-x border-slate-200 bg-gradient-to-b from-sky-50 via-white to-sky-100/70">
        <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-sky-200/50 to-transparent pointer-events-none" />
        <Nav />

        {/* Header + Filters */}
        <section className="px-8 pt-8 pb-8">
          <h1 className="font-serif text-4xl text-slate-900 leading-tight mb-2">
            Tonight's Ideas
          </h1>
          <p className="text-sm text-slate-500 mb-7 font-sans">
            Rescuing your most at-risk leftover first.
          </p>

          <FilterGroup
            label="Cuisine"
            options={CUISINES}
            value={cuisine}
            onChange={(v) => setCuisine(v as Cuisine)}
          />
          <div className="h-3" />
          <FilterGroup
            label="Diet"
            options={DIETS}
            value={diet}
            onChange={(v) => setDiet(v as Diet)}
          />
        </section>

        {/* Priority queue strip */}
        {prioritized.length > 0 && (
          <section className="px-8 pb-6">
            <p className="text-[10px] uppercase tracking-[0.22em] text-slate-500 font-semibold mb-3 font-sans">
              Rescue queue
            </p>
            <ul className="flex gap-2 overflow-x-auto -mx-2 px-2 pb-1">
              {prioritized.map((it) => {
                const p = priorityLabel(it);
                return (
                  <li
                    key={it.id}
                    className={`shrink-0 flex items-center gap-2 rounded-full ring-1 px-3 py-1.5 ${toneClass(p)}`}
                  >
                    <img src={it.image} alt="" className="size-6 rounded-full object-cover" />
                    <span className="text-xs font-semibold">{it.name}</span>
                    <span className="text-[10px] uppercase tracking-wider opacity-80">· {p}</span>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        {/* Hero Recommendation */}
        {hero && heroItem && (
          <section className="px-8 pb-10">
            <div className="flex items-center gap-2 mb-3">
              <Flame className="size-3.5 text-tomato" />
              <span className="text-[10px] uppercase tracking-[0.25em] text-slate-600 font-semibold font-sans">
                Hero — rescuing {heroItem.name}
              </span>
            </div>
            <article className="rounded-3xl overflow-hidden bg-white ring-1 ring-slate-200 shadow-[0_24px_50px_-24px_rgba(30,70,120,0.35)]">
              <img
                src={hero.image}
                alt={hero.title}
                className="w-full aspect-[4/3] object-cover"
              />
              <div className="p-6">
                <div
                  className={`inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-bold ring-1 px-2.5 py-1 rounded-full mb-3 ${toneClass(priorityLabel(heroItem))}`}
                >
                  {priorityLabel(heroItem)} priority · {freshnessText(heroItem.freshness)}
                </div>
                <h2 className="font-serif text-3xl text-slate-900 leading-tight">
                  {hero.title}
                </h2>

                <div className="mt-4">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-slate-500 font-semibold mb-2">
                    Ingredients used
                  </p>
                  <ul className="flex flex-wrap gap-2">
                    {hero.uses.map((u, i) => (
                      <li
                        key={i}
                        className="inline-flex items-center gap-2 bg-sky-50 ring-1 ring-sky-100 rounded-full pl-1 pr-3 py-1"
                      >
                        {u.image ? (
                          <img
                            src={u.image}
                            alt=""
                            className="size-6 rounded-full object-cover"
                          />
                        ) : (
                          <span className="size-6 rounded-full bg-amber/20 grid place-items-center text-[10px]">
                            🫓
                          </span>
                        )}
                        <span className="text-sm text-slate-800">{u.label}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-5 flex items-center gap-5 text-sm text-slate-600">
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="size-4" />
                    {hero.minutes} min
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Users className="size-4" />
                    Serves {hero.serves}
                  </span>
                </div>

                <button className="mt-6 w-full py-4 bg-slate-900 text-white font-semibold uppercase tracking-[0.2em] text-[11px] rounded-full hover:bg-slate-800 transition-colors">
                  Cook This Tonight
                </button>
              </div>
            </article>

            {/* Transformation diagram */}
            <div className="mt-8">
              <p className="text-[10px] uppercase tracking-[0.22em] text-slate-500 font-semibold mb-4 text-center">
                The transformation
              </p>
              <div className="flex flex-col items-center gap-3">
                <div className="flex items-center gap-3">
                  {hero.uses.map((u, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <IngredientTile label={u.label} image={u.image} />
                      {i < hero.uses.length - 1 && (
                        <Plus className="size-4 text-slate-400" />
                      )}
                    </div>
                  ))}
                </div>
                <ArrowDown className="size-5 text-slate-400" />
                <div className="rounded-2xl overflow-hidden ring-1 ring-slate-200 w-32 h-32">
                  <img
                    src={hero.image}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="font-serif text-lg text-slate-900 italic">
                  {hero.title}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Alternatives */}
        {alternates.length > 0 && (
          <section className="px-8 pb-16">
            <h3 className="font-serif text-2xl text-slate-900 mb-5">Or try…</h3>
            <div className="grid grid-cols-2 gap-5">
              {alternates.map((r) => (
                <button key={r.id} className="text-left group">
                  <div className="rounded-2xl overflow-hidden ring-1 ring-slate-200 mb-3">
                    <img
                      src={r.image}
                      alt=""
                      className="aspect-square object-cover w-full group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <p className="font-serif text-lg text-slate-900 leading-tight">
                    {r.title}
                  </p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1 font-semibold">
                    {r.uses.length} ingredient{r.uses.length !== 1 ? "s" : ""} ·{" "}
                    {r.minutes} min
                  </p>
                </button>
              ))}
            </div>
          </section>
        )}

        {recipes.length === 0 && (
          <section className="px-8 pb-16 text-center">
            <p className="font-serif italic text-xl text-slate-600">
              Your fridge is empty — add a katori to get ideas.
            </p>
          </section>
        )}

        <footer className="p-10 text-center border-t border-slate-200">
          <div className="font-serif italic text-lg text-slate-600">Katori</div>
        </footer>
      </main>
    </div>
  );
}

function FilterGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.22em] text-slate-500 font-semibold mb-2 font-sans">
        {label}
      </p>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const active = opt === value;
          return (
            <button
              key={opt}
              onClick={() => onChange(opt)}
              className={
                "px-4 py-1.5 rounded-full text-sm font-medium ring-1 transition-colors " +
                (active
                  ? "bg-slate-900 text-white ring-slate-900"
                  : "bg-white text-slate-700 ring-slate-200 hover:ring-slate-400")
              }
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function IngredientTile({ label, image }: { label: string; image?: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="size-20 rounded-2xl bg-white ring-1 ring-slate-200 grid place-items-center overflow-hidden shadow-sm">
        {image ? (
          <img src={image} alt="" className="w-full h-full object-cover" />
        ) : (
          <span className="text-2xl">🫓</span>
        )}
      </div>
      <span className="text-[11px] text-slate-600 font-medium text-center max-w-[5rem] leading-tight">
        {label}
      </span>
    </div>
  );
}
