"use client";

import { useState } from "react";
import { Person } from "./types";

export default function Home() {
  const [name, setName] = useState("");
  const [people, setPeople] = useState<Person[]>([]);

  function addPerson() {
    if (name.trim() === "") return;
    const newPerson = { id: crypto.randomUUID(), name: name };
    setPeople([...people, newPerson]);
    setName("");
  }

  function removePerson(id: string) {
    setPeople(people.filter((person) => person.id !== id))
  }

  return (
    <main>
      <h1> Tabbed </h1>
      <input
        className = "border px-2 py-1"
        placeholder = "Enter your name"
        value = {name}
        onChange = {(e) => setName(e.target.value)}
      />
      <button className = "border px-3 py-1 rounded" onClick = {addPerson}>
        Add
      </button>
      <ul> 
        {people.map((person) => (
          <li key = {person.id} className="flex justify-between items-center w-64 py-1">
            {person.name}
            <button onClick = {() => removePerson(person.id)}>
              x
            </button>
          </li>
        ))}
      </ul>     
    </main>
  );
}