"use client";

import { useState} from "react";

export default function Home() {
  const [count, SetCount] = useState(0);

  return (
    <main>
      <h1> Tabbed </h1>
      <p> You clicked {count} times </p>
      <button 
      className = "border px-3 py-1 rounded"
      onClick = {() => SetCount(count + 1)}
      >
        Click me
      </button>
      <button 
        className = "border px-3 py-1 rounded ml-2"
        onClick = {() => SetCount(0)}
      >
        Reset
      </button>
    </main>
  );
}