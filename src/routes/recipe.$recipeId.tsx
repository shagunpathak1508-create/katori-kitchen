import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Clock, Users, ChefHat, Sparkles } from "lucide-react";
import { Nav } from "@/components/Nav";
import { getRecipe, storeRecipe, type FullRecipe } from "@/lib/recipeStore";
import { recordCookedRecipe } from "@/lib/impact";
import { setItems } from "@/lib/fridge";
import { getRecipeImage } from "@/lib/imageRegistry";

export const Route = createFileRoute("/recipe/$recipeId")({
  head: () => ({
    meta: [
      { title: "Recipe — Katori" },
      { name: "description", content: "Step-by-step recipe to rescue your leftover." },
      { property: "og:title", content: "Recipe — Katori" },
    ],
  }),
  component: RecipePage,
});

function RecipePage() {
  const { recipeId } = Route.useParams();
  const navigate = useNavigate();
  const initialRecipe = getRecipe(recipeId);
  const [recipe, setRecipe] = useState<FullRecipe | undefined>(initialRecipe);
  const [cooked, setCooked] = useState(false);

  if (!recipe) {
    return (
      <div className="min-h-screen bg-fridge-base overflow-x-hidden">
        <main className="relative max-w-2xl mx-auto min-h-screen border-x border-slate-200 bg-gradient-to-b from-sky-50 via-white to-sky-100/70 flex flex-col items-center justify-center gap-6 px-8">
          <p className="font-serif italic text-2xl text-slate-600 text-center">
            Recipe not found — it may have expired.
          </p>
          <button
            onClick={() => void navigate({ to: "/ideas" })}
            className="px-6 py-3 rounded-full bg-slate-900 text-white text-sm font-bold uppercase tracking-wider"
          >
            Back to Ideas
          </button>
        </main>
      </div>
    );
  }

  const handleCook = () => {
    if (cooked) return;
    recordCookedRecipe(recipe.katorisUsed);
    setItems((prev) =>
      prev
        .map((i) => (i.id === recipe.fromItemId ? { ...i, count: i.count - recipe.katorisUsed } : i))
        .filter((i) => i.count > 0),
    );
    setCooked(true);
    setTimeout(() => void navigate({ to: "/" }), 1200);
  };

  const switchToAlternative = (idx: number) => {
    const alt = recipe.alternativeRecipes[idx];
    if (!alt) return;
    const altFull: FullRecipe = {
      ...recipe,
      id: `gemini-alt-${idx}`,
      title: alt.title,
      image: getRecipeImage(alt.title),
      minutes: alt.prepTime,
      serves: alt.serves,
    };
    storeRecipe(altFull);
    setRecipe(altFull);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-fridge-base overflow-x-hidden">
      <main className="relative max-w-2xl mx-auto min-h-screen border-x border-slate-200 bg-gradient-to-b from-sky-50 via-white to-sky-100/70">
        <Nav />

        {/* Back button */}
        <div className="px-8 pb-2 relative z-10">
          <button
            onClick={() => void navigate({ to: "/ideas" })}
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="size-4" />
            Back to Ideas
          </button>
        </div>

        {/* Hero Image */}
        <div className="relative">
          <img
            src={recipe.image}
            alt={recipe.title}
            className="w-full aspect-[4/3] object-cover"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Recipe title overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <h1 className="font-serif text-4xl text-white leading-tight drop-shadow-lg">
              {recipe.title}
            </h1>
            <div className="flex items-center gap-4 mt-3">
              <span className="inline-flex items-center gap-1.5 text-white/90 text-sm">
                <Clock className="size-4" />
                {recipe.minutes} min
              </span>
              <span className="inline-flex items-center gap-1.5 text-white/90 text-sm">
                <Users className="size-4" />
                Serves {recipe.serves}
              </span>
              {recipe.hero && (
                <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-bold bg-tomato text-white px-2.5 py-1 rounded-full">
                  <Sparkles className="size-3" />
                  AI Recipe
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="px-8 py-8 space-y-10">
          {/* Katoris Used */}
          <section>
            <p className="text-[10px] uppercase tracking-[0.22em] text-slate-500 font-semibold mb-4">
              Katoris Used
            </p>
            <div className="flex flex-wrap gap-3">
              {recipe.uses.map((u, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 bg-sky-50 ring-1 ring-sky-100 rounded-full pl-1.5 pr-4 py-1.5"
                >
                  {u.image ? (
                    <img src={u.image} alt="" className="size-8 rounded-full object-cover" />
                  ) : (
                    <span className="size-8 rounded-full bg-amber/20 grid place-items-center text-sm">🫓</span>
                  )}
                  <span className="text-sm font-medium text-slate-800">{u.label}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Ingredients Used */}
          {recipe.ingredientsUsed.length > 0 && (
            <section>
              <p className="text-[10px] uppercase tracking-[0.22em] text-slate-500 font-semibold mb-4">
                Ingredients
              </p>
              <ul className="space-y-2">
                {recipe.ingredientsUsed.map((ing, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-slate-700">
                    <span className="size-2 rounded-full bg-sky-400 shrink-0" />
                    {ing}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Step-by-Step Instructions */}
          {recipe.steps.length > 0 && (
            <section>
              <p className="text-[10px] uppercase tracking-[0.22em] text-slate-500 font-semibold mb-4 flex items-center gap-2">
                <ChefHat className="size-3.5" />
                Step-by-Step Instructions
              </p>
              <ol className="space-y-5">
                {recipe.steps.map((step, i) => (
                  <li key={i} className="flex gap-4">
                    <span className="shrink-0 size-7 rounded-full bg-slate-900 text-white text-xs font-bold grid place-items-center mt-0.5">
                      {i + 1}
                    </span>
                    <p className="text-sm text-slate-700 leading-relaxed pt-1">{step}</p>
                  </li>
                ))}
              </ol>
            </section>
          )}

          {/* Cook This Tonight CTA */}
          <section>
            <button
              onClick={handleCook}
              disabled={cooked}
              className={
                "w-full py-5 rounded-full font-bold uppercase tracking-[0.2em] text-[11px] transition-all " +
                (cooked
                  ? "bg-emerald-500 text-white scale-95"
                  : "bg-slate-900 text-white hover:bg-slate-800")
              }
            >
              {cooked ? "✓ Cooked! Updating impact…" : "Cook This Tonight"}
            </button>
            {!cooked && (
              <p className="text-center text-[10px] text-slate-400 mt-2 uppercase tracking-wider">
                This will mark {recipe.katorisUsed} katori{recipe.katorisUsed !== 1 ? "s" : ""} as saved
              </p>
            )}
          </section>

          {/* Alternative Recipes */}
          {recipe.alternativeRecipes.length > 0 && (
            <section>
              <h2 className="font-serif text-2xl text-slate-900 mb-5">Alternative Recipes</h2>
              <div className="grid grid-cols-1 gap-3">
                {recipe.alternativeRecipes.map((alt, i) => (
                  <button
                    key={i}
                    onClick={() => switchToAlternative(i)}
                    className="text-left flex items-center gap-4 p-4 rounded-2xl bg-white ring-1 ring-slate-200 hover:ring-sky-300 hover:bg-sky-50 transition-all group"
                  >
                    <div className="size-16 rounded-xl overflow-hidden shrink-0">
                      <img
                        src={getRecipeImage(alt.title)}
                        alt=""
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-serif text-lg text-slate-900 leading-tight">{alt.title}</p>
                      <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-500">
                        <span className="flex items-center gap-1"><Clock className="size-3" />{alt.prepTime} min</span>
                        <span className="flex items-center gap-1"><Users className="size-3" />Serves {alt.serves}</span>
                      </div>
                    </div>
                    <ArrowLeft className="size-4 text-slate-300 rotate-180 group-hover:text-sky-400 transition-colors" />
                  </button>
                ))}
              </div>
            </section>
          )}
        </div>

        <footer className="p-10 text-center border-t border-slate-200">
          <div className="font-serif italic text-lg text-slate-600">Katori</div>
          <p className="text-[10px] uppercase tracking-[0.25em] text-slate-700 mt-1">
            Honoring every grain, every bowl.
          </p>
        </footer>
      </main>
    </div>
  );
}
