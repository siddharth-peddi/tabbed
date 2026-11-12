"use client";

import { useState } from "react";
import { Person, Item } from "./types";
import { toCents, formatCents } from "./money";

export default function Home() {
  const [name, setName] = useState("");
  const [people, setPeople] = useState<Person[]>([]);
  const [itemName, setItemName] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [items, setItems] = useState<Item[]>([]);

  function addPerson() {
    if (name.trim() === "") return;
    const newPerson: Person = { id: crypto.randomUUID(), name: name };
    setPeople([...people, newPerson]);
    setName("");
  }

  function removePerson(id: string) {
    setPeople(people.filter((person) => person.id !== id));
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
            <li key={item.id} className="flex justify-between py-2">
              <span>{item.name}</span>
              <span>{formatCents(item.priceCents)}</span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}