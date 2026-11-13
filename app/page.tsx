"use client";

import { useState } from "react";
import { Person, Item } from "./types";
import { toCents, formatCents } from "./money";
import { subtotalsByPerson, splitProportionally } from "./split";
import { Card } from "./components/Card";
import { inputClass, buttonClass } from "./styles";
import { Background } from "./components/Backgrounds";

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

  const getsBack = people
    .filter((person) => person.id !== paidBy)
    .reduce((sum, person) => sum + totalFor(person.id), 0);

  return (
    <main className="mx-auto max-w-md space-y-4 px-4 py-10">
<Background />
<header className="mb-6">
  <h1
    className="bg-clip-text text-4xl font-semibold tracking-tight text-transparent"
    style={{ backgroundImage: "linear-gradient(90deg, #059669, #0284c7)" }}
  >
    Tabbed
  </h1>
  <p className="text-neutral-500">Split the bill, item by item.</p>
</header>
      <Card title="Who's at the table?">
        <div className="flex gap-2">
          <input
            className={`${inputClass} min-w-0 flex-1`}
            placeholder="Friend's name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button className={buttonClass} onClick={addPerson}>
            Add
          </button>
        </div>
        {people.length === 0 ? (
          <p className="text-sm text-neutral-500">Add everyone who&apos;s eating.</p>
        ) : (
          <ul className="divide-y divide-neutral-100">
            {people.map((person) => (
              <li key={person.id} className="flex items-center justify-between py-2">
                <span>{person.name}</span>
                <button
                  className="rounded-full p-2 text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700"
                  onClick={() => removePerson(person.id)}
                  aria-label={`Remove ${person.name}`}
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card title="Who paid?">
        <select
          className={`${inputClass} w-full`}
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
      </Card>

      <Card title="What did you order?">
        <div className="flex gap-2">
          <input
            className={`${inputClass} min-w-0 flex-1`}
            placeholder="Item"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
          />
          <input
            className={`${inputClass} w-24`}
            placeholder="0.00"
            inputMode="decimal"
            value={itemPrice}
            onChange={(e) => setItemPrice(e.target.value)}
          />
          <button className={buttonClass} onClick={addItem}>
            Add
          </button>
        </div>
        {items.length === 0 ? (
          <p className="text-sm text-neutral-500">Add the first item from the receipt.</p>
        ) : (
          <ul className="divide-y divide-neutral-100">
            {items.map((item) => (
              <li key={item.id} className="space-y-3 py-4">
                <div className="flex justify-between">
                  <span className="font-medium">{item.name}</span>
                  <span className="tabular-nums">{formatCents(item.priceCents)}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {people.map((person) => {
                    const selected = item.splitAmongst.includes(person.id);
                    return (
                      <button
                        key={person.id}
                        aria-pressed={selected}
                        onClick={() => toggleShare(item.id, person.id)}
                        className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                          selected
                            ? "bg-emerald-600 text-white"
                            : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
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
        )}
      </Card>

      <Card title="Tax and tip">
        <div className="flex gap-2">
          <label className="flex-1 space-y-1">
            <span className="text-sm text-neutral-500">Tax</span>
            <input
              className={`${inputClass} w-full`}
              placeholder="0.00"
              inputMode="decimal"
              value={tax}
              onChange={(e) => setTax(e.target.value)}
            />
          </label>
          <label className="flex-1 space-y-1">
            <span className="text-sm text-neutral-500">Tip</span>
            <input
              className={`${inputClass} w-full`}
              placeholder="0.00"
              inputMode="decimal"
              value={tip}
              onChange={(e) => setTip(e.target.value)}
            />
          </label>
        </div>
        <label className="flex items-center gap-3 text-sm">
          <input
            type="checkbox"
            className="h-4 w-4 accent-emerald-600"
            checked={splitTip}
            onChange={(e) => setSplitTip(e.target.checked)}
          />
          Split the tip (otherwise {payer ? payer.name : "the payer"} covers it)
        </label>
      </Card>

      <Card title="Who owes what">
        {unassigned.length > 0 && (
          <p className="text-sm text-amber-600">
            {unassigned.length} item(s) not assigned to anyone yet.
          </p>
        )}
        {!payer && <p className="text-sm text-amber-600">Pick who paid to see who owes whom.</p>}
        <ul className="divide-y divide-neutral-100">
          {people.map((person) => (
            <li key={person.id} className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium">{person.name}</p>
                <p className="text-sm text-neutral-500">
                  {person.id === paidBy
                    ? "Their share"
                    : payer
                    ? `Owes ${payer.name}`
                    : "Share"}
                </p>
              </div>
              <span className="font-medium tabular-nums">
                {formatCents(totalFor(person.id))}
              </span>
            </li>
          ))}
        </ul>
        {payer && (
          <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
            {payer.name} paid the bill and gets back{" "}
            <strong>{formatCents(getsBack)}</strong>.
          </p>
        )}
        <p className="flex justify-between border-t border-neutral-100 pt-3 font-semibold">
          <span>Bill total</span>
          <span className="tabular-nums">{formatCents(billTotal)}</span>
        </p>
      </Card>
    </main>
  );
}