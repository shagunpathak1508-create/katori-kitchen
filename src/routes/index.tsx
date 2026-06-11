import { createFileRoute, Link } from "@tanstack/react-router";
import { Nav } from "@/components/Nav";
import { Katori } from "@/components/Katori";
import paneer from "@/assets/katori-paneer.png";
import dal from "@/assets/katori-dal.png";
import rice from "@/assets/katori-rice.png";
import aloo from "@/assets/katori-aloo.png";
import chole from "@/assets/katori-chole.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "The Fridge — Katori" },
      { name: "description", content: "Seven katoris are waiting in your fridge. Tap one to rediscover it." },
      { property: "og:title", content: "The Fridge — Katori" },
    ],
  }),
  component: FridgePage,
});

function FridgePage() {
  return (
    <div className="min-h-screen bg-fridge-base overflow-x-hidden">
      <main className="relative max-w-2xl mx-auto min-h-screen bg-gradient-to-b from-sky-50 via-white to-sky-100/80 shadow-[0_40px_80px_-20px_rgba(30,60,110,0.45)]">
        {/* Stainless steel fridge frame */}
        <div className="absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-slate-400 via-slate-300 to-slate-200 shadow-[inset_-1px_0_2px_rgba(255,255,255,0.6)]" />
        <div className="absolute inset-y-0 right-0 w-3 bg-gradient-to-l from-slate-400 via-slate-300 to-slate-200 shadow-[inset_1px_0_2px_rgba(255,255,255,0.6)]" />
        <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-b from-slate-400 to-slate-200" />

        {/* Inner cavity glow + LED strip */}
        <div className="absolute top-2 inset-x-3 h-[34rem] bg-gradient-to-b from-sky-100/80 via-white/40 to-transparent pointer-events-none rounded-b-[40%]" />
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-48 h-[3px] rounded-full fridge-led pointer-events-none" />

        {/* Soft inner side reflections */}
        <div className="absolute top-2 bottom-0 left-3 w-12 fridge-wall-left pointer-events-none" />
        <div className="absolute top-2 bottom-0 right-3 w-12 fridge-wall-right pointer-events-none" />

        <Nav />

        <header className="relative z-10 px-8 pb-2">
          <p className="font-serif italic text-slate-900 text-lg">
            Good evening, Sharma family.
          </p>
          <p className="text-xs text-slate-500 mt-1">5 katoris inside · last opened 4 min ago</p>
        </header>

        <section className="relative px-6 pt-10 pb-16 space-y-24">
          {/* Shelf 1 */}
          <div className="relative">
            <div className="flex justify-around items-end pb-8 relative z-10 gap-2 px-2">
              <Katori image={paneer} name="Paneer Bhurji" freshness="fresh" size="lg" rotateIndex={0} />
              <Katori image={dal} name="Dal Tadka" freshness="soon" size="md" rotateIndex={1} />
            </div>
            {/* Brackets */}
            <div className="absolute -left-1 bottom-2 w-2 h-6 shelf-bracket z-20" />
            <div className="absolute -right-1 bottom-2 w-2 h-6 shelf-bracket z-20" />
            {/* Glass pane */}
            <div className="relative h-4 w-full glass-shelf rounded-sm" />
            <div className="h-[6px] w-full glass-shelf-edge rounded-b-md" />
          </div>

          {/* Shelf 2 */}
          <div className="relative">
            <div className="flex justify-around items-end pb-8 relative z-10 gap-2 px-2">
              <Katori image={rice} name="Jeera Rice" freshness="fresh" size="md" rotateIndex={2} />
              <Katori image={chole} name="Chole" freshness="tonight" size="lg" rotateIndex={3} />
            </div>
            <div className="absolute -left-1 bottom-2 w-2 h-6 shelf-bracket z-20" />
            <div className="absolute -right-1 bottom-2 w-2 h-6 shelf-bracket z-20" />
            <div className="relative h-4 w-full glass-shelf rounded-sm" />
            <div className="h-[6px] w-full glass-shelf-edge rounded-b-md" />
          </div>

          {/* Shelf 3 */}
          <div className="relative">
            <div className="flex justify-around items-end pb-8 relative z-10 gap-6 px-2">
              <Katori image={aloo} name="Aloo Fry" freshness="soon" size="md" rotateIndex={0} />
              <button className="group flex flex-col items-center justify-center size-36 rounded-full border-2 border-dashed border-slate-300 hover:border-sky-500 hover:bg-sky-100 transition-all">
                <span className="text-sky-300/90 text-3xl mb-1 group-hover:scale-110 transition-transform">+</span>
                <span className="text-[10px] uppercase tracking-[0.18em] font-semibold text-slate-500 group-hover:text-slate-900">
                  Add a Katori
                </span>
              </button>
            </div>
            <div className="absolute -left-1 bottom-2 w-2 h-6 shelf-bracket z-20" />
            <div className="absolute -right-1 bottom-2 w-2 h-6 shelf-bracket z-20" />
            <div className="relative h-4 w-full glass-shelf rounded-sm" />
            <div className="h-[6px] w-full glass-shelf-edge rounded-b-md" />
          </div>
        </section>

        <div className="px-8 pb-16 relative z-10">
          <Link
            to="/ideas"
            className="block w-full text-center py-5 rounded-full bg-slate-900 text-white font-bold uppercase tracking-[0.2em] text-[11px] hover:bg-slate-800 transition-colors shadow-lg"
          >
            See Tonight's Ideas
          </Link>
        </div>

        <footer className="p-10 text-center border-t border-slate-200 relative z-10">
          <div className="font-serif italic text-lg text-slate-600">Katori</div>
          <p className="text-[10px] uppercase tracking-[0.25em] text-slate-700 mt-1">
            Honoring every grain, every bowl.
          </p>
        </footer>
      </main>
    </div>
  );
}
