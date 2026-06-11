import { Link } from "@tanstack/react-router";

export function Nav() {
  return (
    <nav className="relative z-20 px-8 pt-10 pb-6 flex justify-between items-end max-w-2xl mx-auto">
      <Link to="/" className="block">
        <h1 className="font-serif italic text-4xl tracking-tight text-white leading-none">Katori</h1>
        <p className="text-[10px] uppercase tracking-[0.3em] text-sky-300/80 font-semibold mt-1">
          The Household Layer
        </p>
      </Link>
      <div className="flex gap-6 text-xs font-medium text-slate-400">
        <Link
          to="/"
          className="pb-1 transition-colors hover:text-white"
          activeProps={{ className: "text-white border-b border-white/40 pb-1" }}
          activeOptions={{ exact: true }}
        >
          The Fridge
        </Link>
        <Link
          to="/ideas"
          className="pb-1 transition-colors hover:text-white"
          activeProps={{ className: "text-white border-b border-white/40 pb-1" }}
        >
          Ideas
        </Link>
        <Link
          to="/magnets"
          className="pb-1 transition-colors hover:text-white"
          activeProps={{ className: "text-white border-b border-white/40 pb-1" }}
        >
          Magnets
        </Link>
      </div>
    </nav>
  );
}
