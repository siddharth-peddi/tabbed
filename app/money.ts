// "12.50" → 1250. Returns null if it isn't a valid price.
export function toCents(text: string): number | null {
    const value = Number(text);
    if (Number.isNaN(value) || value <= 0) return null;
    return Math.round(value * 100);
  }
  
  // 1250 → "$12.50"
  export function formatCents(cents: number): string {
    return "$" + (cents / 100).toFixed(2);
  }