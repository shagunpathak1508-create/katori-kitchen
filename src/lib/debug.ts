// ─────────────────────────────────────────────
// Debug Logger — [Katori] prefixed console logging
// ─────────────────────────────────────────────

const PREFIX = "[Katori]";

/** Log when a food item is selected (clicked in fridge) */
export function logFoodSelected(item: { id: string; name: string; image: string; category: string }) {
  console.log(
    `${PREFIX} 🍲 Food Selected`,
    `\n  ID: ${item.id}`,
    `\n  Name: ${item.name}`,
    `\n  Category: ${item.category}`,
    `\n  Image: ${item.image}`,
  );
}

/** Log when items are mutated (add/edit/discard) */
export function logItemsMutated(action: "add" | "edit" | "discard" | "rebalance", details: Record<string, unknown>) {
  console.log(
    `${PREFIX} 📦 Items ${action.toUpperCase()}`,
    details,
  );
}

/** Log when a recipe is generated */
export function logRecipeGenerated(recipe: { id: string; title: string; image: string; fromItemId: string }) {
  console.log(
    `${PREFIX} 🍽️ Recipe Generated`,
    `\n  ID: ${recipe.id}`,
    `\n  Title: ${recipe.title}`,
    `\n  Image: ${recipe.image}`,
    `\n  From Item: ${recipe.fromItemId}`,
  );
}

/** Log when an image is resolved from the registry */
export function logImageResolved(context: string, name: string, resolvedImage: string) {
  console.log(
    `${PREFIX} 🖼️ Image Resolved [${context}]`,
    `\n  Name: ${name}`,
    `\n  Image: ${resolvedImage.slice(-40)}`, // last 40 chars to keep it readable
  );
}

/** Log shelf rebalance results */
export function logShelfRebalance(items: { id: string; name: string; shelf: number; size: string }[]) {
  console.log(
    `${PREFIX} 🗄️ Shelf Rebalance`,
    items.map((i) => `  ${i.name} → shelf ${i.shelf} (${i.size})`).join("\n"),
  );
}
