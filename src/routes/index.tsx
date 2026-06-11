import { createFileRoute, Link } from "@tanstack/react-router";
import { Nav } from "@/components/Nav";
import { Katori } from "@/components/Katori";
import paneer from "@/assets/katori-paneer.jpg";
import dal from "@/assets/katori-dal.jpg";
import rice from "@/assets/katori-rice.jpg";
import aloo from "@/assets/katori-aloo.jpg";
import chole from "@/assets/katori-chole.jpg";

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
      <main className="relative max-w-2xl mx-auto min-h-screen border-x border-white/5 bg-gradient-to-b from-[#161d27] via-[#0f141a] to-[#0a0d12] shadow-2xl">
        {/* interior lighting */}
        <div className="absolute top-0 inset-x-0 h-[28rem] bg-gradient-to-b from-sky-300/15 via-sky-400/5 to-transparent pointer-events-none" />
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-40 h-1 rounded-full bg-sky-100/40 blur-[2px]" />

        <Nav />

        <header className="relative z-10 px-8 pb-2">
          <p className="font-serif italic text-fridge-glow text-lg">
            Good evening, Sharma family.
          </p>
          <p className="text-xs text-slate-500 mt-1">5 katoris inside · last opened 4 min ago</p>
        </header>

        <section className="px-8 pt-10 pb-16 space-y-28">
          {/* Shelf 1 */}
          <div className="relative">
            <div className="flex justify-around items-end pb-10 relative z-10 gap-2">
              <Katori image={paneer} name="Paneer Bhurji" freshness="fresh" size="lg" rotateIndex={0} />
              <Katori image={dal} name="Dal Tadka" freshness="soon" size="md" rotateIndex={1} />
            </div>
            <div className="h-5 w-full glass-shelf rounded-b-xl" />
          </div>

          {/* Shelf 2 */}
          <div className="relative">
            <div className="flex justify-around items-end pb-10 relative z-10 gap-2">
              <Katori image={rice} name="Jeera Rice" freshness="fresh" size="md" rotateIndex={2} />
              <Katori image={chole} name="Chole" freshness="tonight" size="lg" rotateIndex={3} />
            </div>
            <div className="h-5 w-full glass-shelf rounded-b-xl" />
          </div>

          {/* Shelf 3 */}
          <div className="relative">
            <div className="flex justify-around items-end pb-10 relative z-10 gap-6">
              <Katori image={aloo} name="Aloo Fry" freshness="soon" size="md" rotateIndex={0} />
              <button className="group flex flex-col items-center justify-center size-36 rounded-full border-2 border-dashed border-white/15 hover:border-sky-300/60 hover:bg-sky-300/5 transition-all">
                <span className="text-sky-300/90 text-3xl mb-1 group-hover:scale-110 transition-transform">+</span>
                <span className="text-[10px] uppercase tracking-[0.18em] font-semibold text-slate-400 group-hover:text-white">
                  Add a Katori
                </span>
              </button>
            </div>
            <div className="h-5 w-full glass-shelf rounded-b-xl" />
          </div>
        </section>

        <div className="px-8 pb-16">
          <Link
            to="/ideas"
            className="block w-full text-center py-5 rounded-full bg-white text-black font-bold uppercase tracking-[0.2em] text-[11px] hover:bg-sky-100 transition-colors"
          >
            See Tonight's Ideas
          </Link>
        </div>

        <footer className="p-10 text-center border-t border-white/5">
          <div className="font-serif italic text-lg text-slate-600">Katori</div>
          <p className="text-[10px] uppercase tracking-[0.25em] text-slate-700 mt-1">
            Honoring every grain, every bowl.
          </p>
        </footer>
      </main>
    </div>
  );
}
