"use client";

import { useGameLoop } from "@/hooks/useGameLoop";
import { FallingWord } from "./FallingWord";
import { PLAYFIELD_HEIGHT, PLAYFIELD_WIDTH } from "@/types/game";

type Props = {
  onGameOver: (score: number) => void;
};

export function GameScreen({ onGameOver }: Props) {
  const state = useGameLoop(onGameOver);

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className="flex w-full justify-between px-4 font-mono text-lg"
        style={{ width: PLAYFIELD_WIDTH }}
      >
        <span>Score: {state.score}</span>
        <span>Lives: {"♥".repeat(state.lives)}</span>
        <span>Time: {Math.floor(state.elapsedMs / 1000)}s</span>
      </div>

      <div
        className="relative overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900"
        style={{ width: PLAYFIELD_WIDTH, height: PLAYFIELD_HEIGHT }}
      >
        {state.words.map((word) => (
          <FallingWord
            key={word.id}
            word={word}
            isActive={word.id === state.activeWordId}
          />
        ))}
      </div>

      <div className="font-mono text-sm text-zinc-500">
        buffer: <span className="text-zinc-300">{state.buffer || "_"}</span>
      </div>
    </div>
  );
}
