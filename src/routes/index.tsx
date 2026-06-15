import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Nav } from "@/components/Nav";
import { Katori } from "@/components/Katori";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  useItems,
  setItems,
  freshnessText,
  priorityLabel,
  itemFreshness,
  discardItem,
  type Item,
  type Category,
} from "@/lib/fridge";
import { getKatoriImage } from "@/lib/imageRegistry";
import { logFoodSelected, logItemsMutated } from "@/lib/debug";

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

const CATEGORIES: Category[] = ["Paneer", "Dal", "Rice", "Chole", "Curry", "Sabzi", "Other"];

function FridgePage() {
  const items = useItems();
  const [removing, setRemoving] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [confirmDiscard, setConfirmDiscard] = useState(false);

  const selected = items.find((i) => i.id === selectedId) ?? null;

  // Log food selection for debugging
  const handleSelect = (id: string) => {
    const item = items.find((i) => i.id === id);
    if (item) logFoodSelected(item);
    setSelectedId(id);
  };

  const handleDiscard = () => {
    if (!selected) return;
    setRemoving(selected.id);
    setConfirmDiscard(false);
    setSelectedId(null);
    setTimeout(() => {
      discardItem(selected.id);
      setRemoving(null);
    }, 500);
  };

  const shelves: Item[][] = [[], [], []];
  items.forEach((it) => shelves[it.shelf]?.push(it));

  return (
    <div className="min-h-screen bg-fridge-base overflow-x-hidden">
      <main className="relative max-w-2xl mx-auto min-h-screen bg-gradient-to-b from-sky-50 via-white to-sky-100/80 shadow-[0_40px_80px_-20px_rgba(30,60,110,0.45)]">
        <div className="absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-slate-400 via-slate-300 to-slate-200 shadow-[inset_-1px_0_2px_rgba(255,255,255,0.6)]" />
        <div className="absolute inset-y-0 right-0 w-3 bg-gradient-to-l from-slate-400 via-slate-300 to-slate-200 shadow-[inset_1px_0_2px_rgba(255,255,255,0.6)]" />
        <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-b from-slate-400 to-slate-200" />

        <div className="absolute top-2 inset-x-3 h-[34rem] bg-gradient-to-b from-sky-100/80 via-white/40 to-transparent pointer-events-none rounded-b-[40%]" />
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-48 h-[3px] rounded-full fridge-led pointer-events-none" />

        <div className="absolute top-2 bottom-0 left-3 w-12 fridge-wall-left pointer-events-none" />
        <div className="absolute top-2 bottom-0 right-3 w-12 fridge-wall-right pointer-events-none" />

        <Nav />

        <section className="relative px-6 pt-12 pb-16 space-y-24">
          {shelves.map((shelfItems, idx) => (
            <div key={idx} className="relative">
              <div className="flex justify-around items-end pb-8 relative z-10 gap-2 px-2 min-h-[12rem]">
                {shelfItems.map((it, i) => (
                  <Katori
                    key={it.id}
                    image={it.image}
                    name={it.name}
                    freshness={itemFreshness(it)}
                    size={it.size}
                    rotateIndex={i}
                    removing={removing === it.id}
                    onClick={() => handleSelect(it.id)}
                  />
                ))}
                {idx === 2 && (
                  <button
                    type="button"
                    onClick={() => setAddOpen(true)}
                    className="group flex flex-col items-center justify-center size-36 rounded-full border-2 border-dashed border-slate-300 hover:border-sky-500 hover:bg-sky-100 transition-all"
                  >
                    <span className="text-sky-400 text-3xl mb-1 group-hover:scale-110 transition-transform">+</span>
                    <span className="text-[10px] uppercase tracking-[0.18em] font-semibold text-slate-500 group-hover:text-slate-900">
                      Add a Katori
                    </span>
                  </button>
                )}
              </div>
              <div className="absolute -left-1 bottom-2 w-2 h-6 shelf-bracket z-20" />
              <div className="absolute -right-1 bottom-2 w-2 h-6 shelf-bracket z-20" />
              <div className="relative h-4 w-full glass-shelf rounded-sm" />
              <div className="h-[6px] w-full glass-shelf-edge rounded-b-md" />
            </div>
          ))}
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

      {/* Detail panel */}
      <Dialog open={!!selected && !confirmDiscard && !editOpen} onOpenChange={(o) => !o && setSelectedId(null)}>
        <DialogContent className="bg-white">
          {selected && (
            <>
              <div className="flex flex-col items-center -mt-2">
                <img src={selected.image} alt={selected.name} className="size-40 object-contain drop-shadow-[0_18px_12px_rgba(40,70,110,0.25)]" />
                <DialogHeader className="text-center mt-2">
                  <DialogTitle className="font-serif italic text-3xl text-slate-900 text-center">{selected.name}</DialogTitle>
                  <DialogDescription className="text-center text-slate-500">
                    {freshnessText(itemFreshness(selected))}
                  </DialogDescription>
                </DialogHeader>
              </div>
              <div className="grid grid-cols-3 gap-3 mt-2 text-sm">
                <div className="rounded-xl bg-sky-50 border border-sky-100 p-3">
                  <p className="text-[10px] uppercase tracking-widest text-slate-500">Remaining</p>
                  <p className="font-semibold text-slate-900">{selected.count} Katori{selected.count !== 1 ? "s" : ""}</p>
                </div>
                <div className="rounded-xl bg-sky-50 border border-sky-100 p-3">
                  <p className="text-[10px] uppercase tracking-widest text-slate-500">Category</p>
                  <p className="font-semibold text-slate-900">{selected.category}</p>
                </div>
                <div className="rounded-xl bg-sky-50 border border-sky-100 p-3">
                  <p className="text-[10px] uppercase tracking-widest text-slate-500">Priority</p>
                  <p className="font-semibold text-slate-900">{priorityLabel(selected)}</p>
                </div>
              </div>
              {selected.notes && (
                <p className="text-sm text-slate-600 italic px-1">"{selected.notes}"</p>
              )}
              <div className="grid grid-cols-3 gap-2 pt-2">
                <Link
                  to="/ideas"
                  className="text-center py-3 rounded-full bg-slate-900 text-white text-xs font-bold uppercase tracking-wider hover:bg-slate-800"
                >
                  🍽 Ideas
                </Link>
                <button
                  onClick={() => setEditOpen(true)}
                  className="py-3 rounded-full bg-white border border-slate-300 text-slate-800 text-xs font-bold uppercase tracking-wider hover:bg-slate-50"
                >
                  ✏ Edit
                </button>
                <button
                  onClick={() => setConfirmDiscard(true)}
                  className="py-3 rounded-full bg-tomato/10 border border-tomato/30 text-xs font-bold uppercase tracking-wider hover:bg-tomato/20"
                  style={{ color: "var(--danger)" }}
                >
                  🗑 Discard
                </button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Discard confirmation */}
      <Dialog open={confirmDiscard} onOpenChange={setConfirmDiscard}>
        <DialogContent className="bg-white max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-serif italic text-2xl text-slate-900">Discard this leftover?</DialogTitle>
            <DialogDescription className="text-slate-500">
              This katori will be removed from your fridge.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-2">
            <button
              onClick={() => setConfirmDiscard(false)}
              className="flex-1 py-3 rounded-full bg-white border border-slate-300 text-slate-800 text-xs font-bold uppercase tracking-wider"
            >
              Cancel
            </button>
            <button
              onClick={handleDiscard}
              className="flex-1 py-3 rounded-full text-white text-xs font-bold uppercase tracking-wider"
              style={{ background: "var(--danger)" }}
            >
              Discard
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Katori */}
      <AddOrEditDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        title="Add a Katori"
        onSave={(data) => {
          const newItem: Item = {
            id: crypto.randomUUID(),
            name: data.name,
            image: getKatoriImage(data.name, data.category),
            qty: data.qty,
            count: data.count,
            dateAdded: data.dateAdded,
            category: data.category,
            notes: data.notes,
            size: "md",
            shelf: 0 as 0 | 1 | 2, // will be corrected by rebalanceShelves
          };
          logItemsMutated("add", { name: data.name, category: data.category, image: newItem.image });
          setItems((prev) => [...prev, newItem]);
          setAddOpen(false);
        }}
      />

      {/* Edit */}
      {selected && (
        <AddOrEditDialog
          open={editOpen}
          onOpenChange={setEditOpen}
          title="Edit Katori"
          initial={selected}
          onSave={(data) => {
            logItemsMutated("edit", { id: selected.id, name: data.name, category: data.category });
            setItems((prev) =>
              prev.map((i) =>
                i.id === selected.id
                  ? {
                      ...i,
                      name: data.name,
                      qty: data.qty,
                      count: data.count,
                      dateAdded: data.dateAdded,
                      category: data.category,
                      notes: data.notes,
                      image: getKatoriImage(data.name, data.category),
                    }
                  : i
              )
            );
            setEditOpen(false);
          }}
        />
      )}
    </div>
  );
}

function AddOrEditDialog({
  open,
  onOpenChange,
  title,
  initial,
  onSave,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  title: string;
  initial?: Partial<Item>;
  onSave: (d: { name: string; qty: string; count: number; dateAdded: string; category: Category; notes?: string }) => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [qty, setQty] = useState(initial?.qty ?? "1 bowl");
  const [count, setCount] = useState(initial?.count ?? 1);
  const [dateAdded, setDateAdded] = useState(initial?.dateAdded ?? new Date().toISOString().slice(0, 10));
  const [category, setCategory] = useState<Category>(initial?.category ?? "Other");
  const [notes, setNotes] = useState(initial?.notes ?? "");

  const handleOpen = (o: boolean) => {
    onOpenChange(o);
    if (o && !initial) {
      setName(""); setQty("1 bowl"); setCount(1);
      setDateAdded(new Date().toISOString().slice(0, 10));
      setCategory("Other"); setNotes("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle className="font-serif italic text-2xl text-slate-900">✍️ {title}</DialogTitle>
          <DialogDescription className="text-slate-500">
            Tell your fridge what you've stored.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1">
            <Label className="text-xs uppercase tracking-wider text-slate-500">Food Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Paneer Bhurji" className="border-slate-300" />
          </div>

          {/* Category */}
          <div className="space-y-1">
            <Label className="text-xs uppercase tracking-wider text-slate-500">Category</Label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={
                    "px-3 py-1 rounded-full text-xs font-semibold ring-1 transition-colors " +
                    (category === cat
                      ? "bg-slate-900 text-white ring-slate-900"
                      : "bg-white text-slate-600 ring-slate-200 hover:ring-slate-400")
                  }
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs uppercase tracking-wider text-slate-500">Quantity</Label>
              <Input value={qty} onChange={(e) => setQty(e.target.value)} placeholder="1 bowl" className="border-slate-300" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs uppercase tracking-wider text-slate-500"># Katoris</Label>
              <Input
                type="number"
                min={1}
                value={count}
                onChange={(e) => setCount(Math.max(1, Number(e.target.value) || 1))}
                className="border-slate-300"
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-xs uppercase tracking-wider text-slate-500">Date Added</Label>
            <Input type="date" value={dateAdded} onChange={(e) => setDateAdded(e.target.value)} className="border-slate-300" />
          </div>
          <div className="space-y-1">
            <Label className="text-xs uppercase tracking-wider text-slate-500">Notes (optional)</Label>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="A pinch of love." className="border-slate-300" />
          </div>
        </div>
        <DialogFooter className="gap-2 sm:gap-2">
          <button
            onClick={() => onOpenChange(false)}
            className="flex-1 py-3 rounded-full bg-white border border-slate-300 text-slate-800 text-xs font-bold uppercase tracking-wider"
          >
            Cancel
          </button>
          <button
            disabled={!name.trim()}
            onClick={() => onSave({ name: name.trim(), qty, count, dateAdded, category, notes: notes.trim() || undefined })}
            className="flex-1 py-3 rounded-full bg-slate-900 text-white text-xs font-bold uppercase tracking-wider hover:bg-slate-800 disabled:opacity-40"
          >
            Save
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
