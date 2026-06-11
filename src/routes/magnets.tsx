import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/Nav";
import dal from "@/assets/katori-dal.jpg";

export const Route = createFileRoute("/magnets")({
  head: () => ({
    meta: [
      { title: "The Magnet Wall — Katori" },
      { name: "description", content: "Your impact, collected as fridge magnets." },
      { property: "og:title", content: "The Magnet Wall — Katori" },
    ],
  }),
  component: MagnetsPage,
});

function MagnetsPage() {
  return (
    <div className="min-h-screen bg-fridge-base overflow-x-hidden">
      <main className="relative max-w-2xl mx-auto min-h-screen border-x border-slate-200 bg-gradient-to-b from-sky-50 via-white to-sky-100/70">
        <Nav />

        <section className="brushed-steel relative px-8 py-16 mt-4 mx-2 rounded-md overflow-hidden">
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, #000 0px, #000 1px, transparent 1px, transparent 9px)",
            }}
          />

          <header className="relative text-center mb-14">
            <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500 font-bold mb-3">
              The Door
            </p>
            <h2 className="font-serif italic text-4xl text-slate-800">Your Magnet Wall</h2>
          </header>

          {/* Magnet scatter */}
          <div className="relative grid grid-cols-2 gap-y-12 gap-x-6 pb-8">
            {/* Streak */}
            <div className="flex justify-center">
              <div className="size-32 rounded-2xl bg-tomato magnet-shadow rotate-[6deg] flex flex-col items-center justify-center text-center ring-2 ring-white/20 px-3">
                <span className="text-3xl mb-1">🔥</span>
                <span className="text-[11px] font-extrabold uppercase tracking-tight text-white leading-tight">
                  7 Day Streak
                </span>
              </div>
            </div>

            {/* Savings round */}
            <div className="flex justify-center">
              <div className="size-32 rounded-full bg-emerald magnet-shadow -rotate-[8deg] flex flex-col items-center justify-center text-center ring-2 ring-white/20">
                <span className="text-sm font-serif italic text-emerald-50">Saved</span>
                <span className="text-xl font-extrabold text-white">₹1,240</span>
                <span className="text-[9px] uppercase tracking-widest text-emerald-100 mt-1">this month</span>
              </div>
            </div>

            {/* Hexagonal waste */}
            <div className="flex justify-center">
              <div
                className="w-32 h-32 bg-slate-100 text-slate-900 magnet-shadow rotate-[3deg] flex flex-col items-center justify-center text-center"
                style={{
                  clipPath:
                    "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                }}
              >
                <span className="text-[10px] uppercase tracking-widest text-emerald font-bold">
                  Prevented
                </span>
                <span className="block text-2xl font-extrabold leading-none mt-1">4.8kg</span>
                <span className="text-[9px] text-slate-500 mt-1">food waste</span>
              </div>
            </div>

            {/* Katoris saved polaroid */}
            <div className="flex justify-center">
              <div className="bg-tape p-2 pb-4 magnet-shadow -rotate-[5deg]">
                <img src={dal} alt="" width={200} height={200} className="size-24 object-cover" />
                <p className="font-hand text-slate-800 text-base text-center mt-2 leading-tight">
                  12 Katoris<br />Saved
                </p>
              </div>
            </div>

            {/* Dal saver enamel */}
            <div className="flex justify-center">
              <div className="size-28 rounded-full magnet-shadow rotate-[10deg] flex items-center justify-center text-center bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 ring-4 ring-amber-900/40">
                <div className="size-24 rounded-full border-2 border-amber-900/50 flex items-center justify-center">
                  <span className="text-amber-950 font-extrabold uppercase text-[11px] tracking-tight">
                    Dal Saver
                  </span>
                </div>
              </div>
            </div>

            {/* Festival ribbon */}
            <div className="flex justify-center">
              <div className="px-5 py-3 bg-marigold magnet-shadow -rotate-[3deg] ring-2 ring-white/20 relative">
                <span className="block text-[10px] uppercase font-bold tracking-[0.2em] text-amber-950">
                  Achievement
                </span>
                <span className="font-serif italic text-2xl text-amber-950 leading-tight">
                  Festival Hero
                </span>
                <span className="absolute -bottom-2 left-2 right-2 h-2 bg-marigold" style={{ clipPath: "polygon(0 0, 100% 0, 90% 100%, 10% 100%)" }} />
              </div>
            </div>
          </div>
        </section>

        {/* Festival Surplus Mode */}
        <section className="px-8 py-12">
          <div className="relative bg-[#FFF6E3] p-8 shadow-2xl rounded-sm border-t-[6px] border-marigold magnet-shadow rotate-[0.5deg]">
            <div className="flex items-center gap-2 mb-4">
              <span className="size-3 rounded-full bg-marigold animate-pulse" />
              <span className="text-[10px] uppercase tracking-[0.25em] font-extrabold text-amber-700">
                Festival Surplus Detected
              </span>
            </div>
            <h3 className="font-serif italic text-3xl text-slate-900 mb-1">Diwali Leftovers</h3>
            <p className="text-sm text-slate-600 mb-6">Three transformations waiting in the wings.</p>

            <ul className="space-y-3 border-t border-amber-300/40 pt-4">
              {[
                { from: "14 Puris", to: "Puri Nachos" },
                { from: "6 Pedas", to: "Peda Kheer" },
                { from: "2 katoris Chole", to: "Chole Frankie Wrap" },
              ].map((r) => (
                <li key={r.from} className="flex items-baseline justify-between font-hand text-xl text-slate-800">
                  <span>{r.from}</span>
                  <span className="flex-1 mx-3 border-b border-dashed border-amber-700/40 translate-y-[-4px]" />
                  <span className="text-marigold">{r.to}</span>
                </li>
              ))}
            </ul>

            <button className="mt-7 w-full py-3 bg-slate-900 text-marigold font-bold uppercase tracking-[0.2em] text-[10px] rounded-full hover:bg-slate-800 transition-colors">
              Open Festival Mode
            </button>
          </div>
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
