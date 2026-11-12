import { describe, it, expect } from "vitest";
import { splitEvenly, subtotalsByPerson } from "./split";

describe("splitEvenly", () => {
  it("splits evenly when the amount divides", () => {
    expect(splitEvenly(1000, ["a", "b"])).toEqual({ a: 500, b: 500 });
  });

  it("hands out leftover cents so the total still matches", () => {
    expect(splitEvenly(1000, ["a", "b", "c"])).toEqual({ a: 334, b: 333, c: 333 });
  });

  it("returns nothing when nobody is on the item", () => {
    expect(splitEvenly(1000, [])).toEqual({});
  });
});

describe("subtotalsByPerson", () => {
  it("adds up each person's shares across items", () => {
    const items = [
      { id: "1", name: "Idli", priceCents: 2000, splitAmongst: ["a", "b"] },
      { id: "2", name: "Pancakes", priceCents: 1000, splitAmongst: ["a"] },
    ];
    expect(subtotalsByPerson(items)).toEqual({ a: 2000, b: 1000 });
  });
});