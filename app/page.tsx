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
          <li key = {person.id}>{person.name}</li>
        ))}
      </ul>     
    </main>
  );
}