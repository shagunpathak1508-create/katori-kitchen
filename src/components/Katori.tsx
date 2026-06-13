type Freshness = "fresh" | "soon" | "tonight";

const dot: Record<Freshness, string> = {
  fresh: "bg-emerald",
  soon: "bg-amber",
  tonight: "bg-tomato",
};

const tapeRotate = ["-rotate-2", "rotate-1", "-rotate-1", "rotate-2"];

interface Props {
  image: string;
  name: string;
  freshness: Freshness;
  size?: "sm" | "md" | "lg";
  rotateIndex?: number;
}

interface KatoriProps extends Props {
  onClick?: () => void;
  removing?: boolean;
}

export function Katori({ image, name, freshness, size = "md", rotateIndex = 0, onClick, removing }: KatoriProps) {
  const dim = size === "lg" ? "size-44" : size === "sm" ? "size-28" : "size-36";
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group cursor-pointer relative bg-transparent border-0 p-0 transition-all duration-500 ${removing ? "opacity-0 translate-y-8 scale-75" : "opacity-100"}`}
    >
      {/* Freshness dot — sits above the bowl like the reference */}
      <span
        className={`absolute -top-2 left-1/2 -translate-x-1/2 size-2.5 rounded-full ${dot[freshness]} ring-2 ring-white/80 shadow-sm z-10`}
        aria-label={freshness}
      />

      <div className="flex flex-col items-center">
        {/* Bowl — full photographic image, no clipping */}
        <div
          className={`${dim} relative transition-transform duration-300 group-hover:-translate-y-1`}
          style={{ filter: "drop-shadow(0 18px 12px rgba(40, 70, 110, 0.25))" }}
        >
          <img
            src={image}
            alt={name}
            loading="lazy"
            width={640}
            height={640}
            className="w-full h-full object-contain"
          />
        </div>

        {/* Handwritten label with masking tape */}
        <div
          className={`-mt-2 bg-tape px-4 py-1 masking-tape ${tapeRotate[rotateIndex % 4]} group-hover:rotate-0 transition-transform relative`}
        >
          <span
            className="absolute -top-2 left-1/2 -translate-x-1/2 w-10 h-3 bg-slate-200/70 -rotate-3"
            style={{ clipPath: "polygon(2% 0%, 98% 1%, 100% 98%, 0% 100%)" }}
          />
          <span className="font-hand text-slate-800 text-xl font-bold whitespace-nowrap">
            {name}
          </span>
        </div>
      </div>
    </button>
  );
}
