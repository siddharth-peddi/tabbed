"use client";

import { useState } from "react";
import { Person, Item } from "./types";
import { toCents, formatCents } from "./money";
import { subtotalsByPerson, splitProportionally } from "./split";

export default function Home() {
  // What the user enters (stored)
  const [name, setName] = useState("");
  const [people, setPeople] = useState<Person[]>([]);
  const [paidBy, setPaidBy] = useState("");
  const [itemName, setItemName] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [items, setItems] = useState<Item[]>([]);
  const [tax, setTax] = useState("");
  const [tip, setTip] = useState("");
  const [splitTip, setSplitTip] = useState(true);

  function addPerson() {
    if (name.trim() === "") return;
    const newPerson: Person = { id: crypto.randomUUID(), name: name };
    setPeople([...people, newPerson]);
    setName("");
  }

  function removePerson(id: string) {
    setPeople(people.filter((person) => person.id !== id));
    setItems(
      items.map((item) => ({
        ...item,
        splitAmongst: item.splitAmongst.filter((personId) => personId !== id),
      }))
    );
    if (paidBy === id) setPaidBy("");
  }

  function addItem() {
    const cents = toCents(itemPrice);
    if (itemName.trim() === "" || cents === null) return;
    const newItem: Item = {
      id: crypto.randomUUID(),
      name: itemName,
      priceCents: cents,
      splitAmongst: [],
    };
    setItems([...items, newItem]);
    setItemName("");
    setItemPrice("");
  }

  function toggleShare(itemId: string, personId: string) {
    setItems(
      items.map((item) => {
        if (item.id !== itemId) return item;
        const alreadyIn = item.splitAmongst.includes(personId);
        return {
          ...item,
          splitAmongst: alreadyIn
            ? item.splitAmongst.filter((id) => id !== personId)
            : [...item.splitAmongst, personId],
        };
      })
    );
  }

  // Everything below is calculated (never stored)
  const taxCents = toCents(tax) ?? 0;
  const tipCents = toCents(tip) ?? 0;
  const subtotals = subtotalsByPerson(items);
  const taxShares = splitProportionally(taxCents, subtotals);
  const tipShares: Record<string, number> = splitTip
    ? splitProportionally(tipCents, subtotals)
    : paidBy
    ? { [paidBy]: tipCents }
    : {};
  const payer = people.find((person) => person.id === paidBy);
  const unassigned = items.filter((item) => item.splitAmongst.length === 0);
  const billTotal =
    items.reduce((sum, item) => sum + item.priceCents, 0) + taxCents + tipCents;

  function totalFor(id: string) {
    return (subtotals[id] ?? 0) + (taxShares[id] ?? 0) + (tipShares[id] ?? 0);
  }

  return (
    <main className="mx-auto max-w-md p-6 space-y-8">
      <h1 className="text-3xl font-bold">Tabbed</h1>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Who&apos;s at the table?</h2>
        <div className="flex gap-2">
          <input
            className="flex-1 border rounded px-3 py-2"
            placeholder="Friend's name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button className="border rounded px-4 py-2 font-medium" onClick={addPerson}>
            Add
          </button>
        </div>
        <ul className="divide-y">
          {people.map((person) => (
            <li key={person.id} className="flex justify-between items-center py-2">
              {person.name}
              <button
                onClick={() => removePerson(person.id)}
                aria-label={`Remove ${person.name}`}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Who paid?</h2>
        <select
          className="w-full border rounded px-3 py-2"
          value={paidBy}
          onChange={(e) => setPaidBy(e.target.value)}
        >
          <option value="">Pick who paid</option>
          {people.map((person) => (
            <option key={person.id} value={person.id}>
              {person.name}
            </option>
          ))}
        </select>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">What did you order?</h2>
        <div className="flex gap-2">
          <input
            className="flex-1 border rounded px-3 py-2"
            placeholder="Item"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
          />
          <input
            className="w-24 border rounded px-3 py-2"
            placeholder="0.00"
            inputMode="decimal"
            value={itemPrice}
            onChange={(e) => setItemPrice(e.target.value)}
          />
          <button className="border rounded px-4 py-2 font-medium" onClick={addItem}>
            Add
          </button>
        </div>
        <ul className="divide-y">
          {items.map((item) => (
            <li key={item.id} className="py-3 space-y-2">
              <div className="flex justify-between">
                <span>{item.name}</span>
                <span>{formatCents(item.priceCents)}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {people.map((person) => {
                  const selected = item.splitAmongst.includes(person.id);
                  return (
                    <button
                      key={person.id}
                      aria-pressed={selected}
                      onClick={() => toggleShare(item.id, person.id)}
                      className={`rounded-full border px-3 py-1 text-sm ${
                        selected ? "bg-blue-600 text-white border-blue-600" : ""
                      }`}
                    >
                      {person.name}
                    </button>
                  );
                })}
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Tax and tip</h2>
        <div className="flex gap-2">
          <label className="flex-1 space-y-1">
            <span className="text-sm">Tax</span>
            <input
              className="w-full border rounded px-3 py-2"
              placeholder="0.00"
              inputMode="decimal"
              value={tax}
              onChange={(e) => setTax(e.target.value)}
            />
          </label>
          <label className="flex-1 space-y-1">
            <span className="text-sm">Tip</span>
            <input
              className="w-full border rounded px-3 py-2"
              placeholder="0.00"
              inputMode="decimal"
              value={tip}
              onChange={(e) => setTip(e.target.value)}
            />
          </label>
        </div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={splitTip}
            onChange={(e) => setSplitTip(e.target.checked)}
          />
          Split the tip (otherwise {payer ? payer.name : "the payer"} covers it)
        </label>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Who owes what</h2>
        {unassigned.length > 0 && (
          <p className="text-sm text-amber-700">
            {unassigned.length} item(s) not assigned to anyone yet.
          </p>
        )}
        {!payer && <p className="text-sm text-amber-700">Pick who paid to see who owes whom.</p>}
        <ul className="divide-y">
          {people.map((person) => (
            <li key={person.id} className="flex justify-between py-2">
              <span>
                {person.name}
                {payer && person.id !== paidBy && ` owes ${payer.name}`}
                {person.id === paidBy && " (paid the bill)"}
              </span>
              <span>{formatCents(totalFor(person.id))}</span>
            </li>
          ))}
        </ul>
        <p className="flex justify-between font-semibold border-t pt-2">
          <span>Bill total</span>
          <span>{formatCents(billTotal)}</span>
        </p>
      </section>
    </main>
  );
}