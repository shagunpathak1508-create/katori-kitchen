type Freshness = "fresh" | "soon" | "tonight";

const ring: Record<Freshness, string> = {
  fresh: "border-emerald/50 group-hover:border-emerald",
  soon: "border-amber/50 group-hover:border-amber",
  tonight: "border-tomato/60 group-hover:border-tomato",
};

const tapeRotate = ["-rotate-2", "rotate-1", "-rotate-1", "rotate-2"];

interface Props {
  image: string;
  name: string;
  freshness: Freshness;
  size?: "sm" | "md" | "lg";
  rotateIndex?: number;
}

export function Katori({ image, name, freshness, size = "md", rotateIndex = 0 }: Props) {
  const dim = size === "lg" ? "size-44" : size === "sm" ? "size-28" : "size-36";
  return (
    <div className="group cursor-pointer">
      <div className="relative flex flex-col items-center">
        <div
          className={`absolute -inset-3 rounded-full border-2 ${ring[freshness]} blur-[2px] transition-all`}
        />
        <div className={`${dim} rounded-full katori-shine p-[3px] overflow-hidden`}>
          <img
            src={image}
            alt={name}
            loading="lazy"
            width={400}
            height={400}
            className="w-full h-full rounded-full object-cover ring-1 ring-inset ring-black/40"
          />
        </div>
        <div
          className={`mt-5 bg-tape px-4 py-1 masking-tape ${tapeRotate[rotateIndex % 4]} group-hover:rotate-0 transition-transform`}
        >
          <span className="font-hand text-slate-800 text-xl font-bold whitespace-nowrap">
            {name}
          </span>
        </div>
      </div>
    </div>
  );
}
