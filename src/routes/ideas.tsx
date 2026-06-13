import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowDown, Plus, Clock, Users } from "lucide-react";
import { Nav } from "@/components/Nav";
import frankie from "@/assets/dish-frankie.jpg";
import khichdi from "@/assets/dish-khichdi.jpg";
import tikki from "@/assets/dish-tikki.jpg";
import paneer from "@/assets/katori-paneer.png";
import rice from "@/assets/katori-rice.png";
import dal from "@/assets/katori-dal.png";
import chole from "@/assets/katori-chole.png";

export const Route = createFileRoute("/ideas")({
  head: () => ({
    meta: [
      { title: "Tonight's Ideas — Katori" },
      { name: "description", content: "Yesterday's katori becomes tonight's meal." },
      { property: "og:title", content: "Tonight's Ideas — Katori" },
    ],
  }),
  component: IdeasPage,
});

type Cuisine = "Indian" | "Global";
type Diet = "Veg" | "Non-Veg" | "Eggitarian" | "Any";

type Recipe = {
  id: string;
  title: string;
  image: string;
  uses: { label: string; image?: string }[];
  minutes: number;
  serves: number;
  cuisine: Cuisine;
  diet: Exclude<Diet, "Any">;
  hero?: boolean;
};

const RECIPES: Recipe[] = [
  {
    id: "frankie",
    title: "Paneer Frankie Wrap",
    image: frankie,
    uses: [
      { label: "Paneer Bhurji", image: paneer },
      { label: "2 Rotis" },
    ],
    minutes: 25,
    serves: 4,
    cuisine: "Indian",
    diet: "Veg",
    hero: true,
  },
  {
    id: "khichdi",
    title: "Dal Khichdi",
    image: khichdi,
    uses: [
      { label: "Dal", image: dal },
      { label: "Rice", image: rice },
    ],
    minutes: 20,
    serves: 3,
    cuisine: "Indian",
    diet: "Veg",
  },
  {
    id: "tikki",
    title: "Aloo Tikki Stack",
    image: tikki,
    uses: [{ label: "Aloo Sabzi" }],
    minutes: 18,
    serves: 2,
    cuisine: "Indian",
    diet: "Veg",
  },
  {
    id: "burrito",
    title: "Chole Burrito Bowl",
    image: frankie,
    uses: [
      { label: "Chole", image: chole },
      { label: "Rice", image: rice },
    ],
    minutes: 22,
    serves: 3,
    cuisine: "Global",
    diet: "Veg",
  },
  {
    id: "omelette",
    title: "Masala Egg Roll",
    image: tikki,
    uses: [{ label: "2 Rotis" }, { label: "Eggs" }],
    minutes: 15,
    serves: 2,
    cuisine: "Indian",
    diet: "Eggitarian",
  },
];

const CUISINES: Cuisine[] = ["Indian", "Global"];
const DIETS: Diet[] = ["Veg", "Non-Veg", "Eggitarian", "Any"];

function IdeasPage() {
  const [cuisine, setCuisine] = useState<Cuisine>("Indian");
  const [diet, setDiet] = useState<Diet>("Veg");

  const filtered = useMemo(
    () =>
      RECIPES.filter(
        (r) => r.cuisine === cuisine && (diet === "Any" || r.diet === diet),
      ),
    [cuisine, diet],
  );

  const hero = filtered.find((r) => r.hero) ?? filtered[0];
  const alternates = filtered.filter((r) => r.id !== hero?.id).slice(0, 4);

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
            Three pulls from the fridge, reimagined.
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

        {/* Hero Recommendation — image first, text below */}
        {hero && (
          <section className="px-8 pb-10">
            <span className="text-[10px] uppercase tracking-[0.25em] text-slate-500 font-semibold font-sans">
              Hero Tonight
            </span>
            <article className="mt-3 rounded-3xl overflow-hidden bg-white ring-1 ring-slate-200 shadow-[0_24px_50px_-24px_rgba(30,70,120,0.35)]">
              <img
                src={hero.image}
                alt={hero.title}
                className="w-full aspect-[4/3] object-cover"
              />
              <div className="p-6">
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

        {filtered.length === 0 && (
          <section className="px-8 pb-16 text-center">
            <p className="font-serif italic text-xl text-slate-600">
              No ideas match yet — try another filter.
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
