"use client";

import type { FallingWord as FallingWordType } from "@/types/game";

type Props = {
  word: FallingWordType;
  isActive: boolean;
};

export function FallingWord({ word, isActive }: Props) {
  const typed = word.text.slice(0, word.typedCount);
  const remaining = word.text.slice(word.typedCount);

  return (
    <div
      className="absolute font-mono text-2xl font-semibold"
      style={{
        left: `${word.x}px`,
        top: `${word.y}px`,
        transform: "translateX(-50%)",
      }}
    >
      <span className={isActive ? "text-emerald-400" : "text-zinc-500"}>
        {typed}
      </span>
      <span className={isActive ? "text-zinc-50" : "text-zinc-300"}>
        {remaining}
      </span>
    </div>
  );
}
