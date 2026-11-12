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

// Split an amount in proportion to weights (e.g. tax by what each person ordered).
export function splitProportionally(
    totalCents: number,
    weights: Record<string, number>
  ): Record<string, number> {
    const shares: Record<string, number> = {};
    const ids = Object.keys(weights).sort();
    const weightSum = ids.reduce((sum, id) => sum + weights[id], 0);
    if (weightSum === 0 || totalCents === 0) return shares;
  
    let given = 0;
    const remainders: { id: string; rest: number }[] = [];
    for (const id of ids) {
      const exact = (totalCents * weights[id]) / weightSum;
      const base = Math.floor(exact);
      shares[id] = base;
      given += base;
      remainders.push({ id, rest: exact - base });
    }
  
    // Leftover cents go to whoever was rounded down the most.
    remainders.sort((a, b) => b.rest - a.rest || a.id.localeCompare(b.id));
    for (let i = 0; i < totalCents - given; i++) {
      shares[remainders[i].id] += 1;
    }
    return shares;
  }