import { Item } from "./types";

// Split one amount evenly, handing out leftover cents so the total always matches.
export function splitEvenly(totalCents: number, personIds: string[]): Record<string, number> {
  const shares: Record<string, number> = {};
  if (personIds.length === 0) return shares;

  const sorted = [...personIds].sort();
  const base = Math.floor(totalCents / sorted.length);
  const leftover = totalCents % sorted.length;

  sorted.forEach((id, index) => {
    shares[id] = base + (index < leftover ? 1 : 0);
  });
  return shares;
}

// Add up each person's share across all items.
export function subtotalsByPerson(items: Item[]): Record<string, number> {
  const totals: Record<string, number> = {};
  for (const item of items) {
    const shares = splitEvenly(item.priceCents, item.splitAmongst);
    for (const [personId, cents] of Object.entries(shares)) {
      totals[personId] = (totals[personId] ?? 0) + cents;
    }
  }
  return totals;
}