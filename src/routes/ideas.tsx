import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/Nav";
import frankie from "@/assets/dish-frankie.jpg";
import khichdi from "@/assets/dish-khichdi.jpg";
import tikki from "@/assets/dish-tikki.jpg";
import paneer from "@/assets/katori-paneer.jpg";
import rice from "@/assets/katori-rice.jpg";

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

const timing = [
  { id: "tonight", label: "Use by Tonight", count: 2, badge: "bg-tomato" },
  { id: "tomorrow", label: "Use by Tomorrow", count: 2, badge: "bg-amber" },
  { id: "wait", label: "Can Wait", count: 1, badge: "bg-emerald" },
];

function IdeasPage() {
  return (
    <div className="min-h-screen bg-fridge-base overflow-x-hidden">
      <main className="relative max-w-2xl mx-auto min-h-screen border-x border-slate-200 bg-gradient-to-b from-sky-50 via-white to-sky-100/70">
        <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-sky-200/50 to-transparent pointer-events-none" />
        <Nav />

        {/* Priority pills */}
        <section className="px-8 pt-8 pb-10">
          <h2 className="font-serif italic text-4xl text-slate-900 mb-2">Tonight's Ideas</h2>
          <p className="text-sm text-slate-500 mb-8">Three pulls from the fridge. One hero. Two alternates.</p>
          <div className="space-y-3">
            {timing.map((t, i) => (
              <button
                key={t.id}
                className="w-full bg-tape px-5 py-3 masking-tape flex items-center justify-between text-slate-800 group"
                style={{ transform: `rotate(${i % 2 === 0 ? "-0.5" : "0.5"}deg)` }}
              >
                <span className="font-hand text-xl">{t.label}</span>
                <span
                  className={`text-[10px] uppercase tracking-widest font-bold px-2 py-1 rounded-full text-white ${t.badge}`}
                >
                  {t.count} katori{t.count !== 1 ? "s" : ""}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Transformation */}
        <section className="px-8 py-10 bg-gradient-to-t from-sky-100/70 to-transparent">
          <div className="flex items-center gap-4 mb-8">
            <div className="flex -space-x-3">
              <div className="size-12 rounded-full katori-shine p-0.5">
                <img src={paneer} alt="" className="w-full h-full rounded-full object-cover" />
              </div>
              <div className="size-12 rounded-full katori-shine p-0.5">
                <img src={rice} alt="" className="w-full h-full rounded-full object-cover" />
              </div>
            </div>
            <span className="text-sm italic font-serif text-slate-600">
              becomes tonight's hero...
            </span>
          </div>

          <div className="relative overflow-hidden rounded-3xl ring-1 ring-slate-200">
            <img
              src={frankie}
              alt="Paneer Frankie Wrap"
              width={1024}
              height={1280}
              className="w-full aspect-[4/5] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-8">
              <span className="text-[10px] uppercase tracking-[0.25em] text-marigold font-bold mb-3">
                Hero Recommendation
              </span>
              <h3 className="font-serif text-5xl italic text-white mb-3 leading-none">
                Paneer Frankie Wrap
              </h3>
              <p className="text-slate-600 text-sm max-w-sm mb-2 font-light leading-relaxed">
                Uses 1 katori Paneer Bhurji + 2 leftover rotis. Add mint chutney, fresh onions, a dash of chaat masala.
              </p>
              <p className="font-hand text-marigold text-lg mb-6">25 minutes · serves 4</p>
              <button className="w-full py-4 bg-slate-900 text-white font-bold uppercase tracking-[0.2em] text-[11px] rounded-full hover:bg-slate-800 transition-colors">
                Cook This Tonight
              </button>
            </div>
          </div>
        </section>

        {/* Alternatives */}
        <section className="px-8 py-12">
          <h3 className="font-serif italic text-2xl text-slate-900 mb-6">Or try...</h3>
          <div className="grid grid-cols-2 gap-5">
            <button className="text-left group">
              <div className="rounded-2xl overflow-hidden ring-1 ring-slate-200 mb-3">
                <img src={khichdi} alt="" width={400} height={400} className="aspect-square object-cover group-hover:scale-105 transition-transform" />
              </div>
              <p className="font-serif text-lg text-slate-900 leading-tight">Dal Khichdi</p>
              <p className="text-[11px] text-slate-500 uppercase tracking-widest mt-1">2 katoris</p>
            </button>
            <button className="text-left group">
              <div className="rounded-2xl overflow-hidden ring-1 ring-slate-200 mb-3">
                <img src={tikki} alt="" width={400} height={400} className="aspect-square object-cover group-hover:scale-105 transition-transform" />
              </div>
              <p className="font-serif text-lg text-slate-900 leading-tight">Aloo Tikki Stack</p>
              <p className="text-[11px] text-slate-500 uppercase tracking-widest mt-1">1 katori</p>
            </button>
          </div>
        </section>

        {/* Household profile recipe card */}
        <section className="px-8 py-16">
          <div className="relative p-8 bg-tape rounded-sm shadow-2xl magnet-shadow -rotate-1 border-b-2 border-slate-300">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-7 bg-sky-200/60 masking-tape -rotate-2" />
            <div className="border-b border-slate-300/60 pb-3 mb-5 flex justify-between items-baseline">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
                Household Profile
              </span>
              <span className="text-[10px] font-bold text-slate-700">Card · 842</span>
            </div>
            <div className="grid grid-cols-2 gap-y-5 gap-x-6">
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest">Family Size</p>
                <p className="font-hand text-2xl text-slate-800 leading-tight">Family of 5</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest">Spice Level</p>
                <p className="font-hand text-2xl text-slate-800 leading-tight">Medium-High</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest">Region</p>
                <p className="font-hand text-2xl text-slate-800 leading-tight">Punjabi · North</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest">Diet</p>
                <p className="font-hand text-2xl text-slate-800 leading-tight">Vegetarian</p>
              </div>
            </div>
          </div>
        </section>

        <footer className="p-10 text-center border-t border-slate-200">
          <div className="font-serif italic text-lg text-slate-600">Katori</div>
        </footer>
      </main>
    </div>
  );
}
