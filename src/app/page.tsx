"use client";

import { useState } from "react";
import { StartScreen } from "@/components/game/StartScreen";
import { GameScreen } from "@/components/game/GameScreen";
import { GameOverScreen } from "@/components/game/GameOverScreen";
import type { GamePhase } from "@/types/game";

export default function Home() {
  const [phase, setPhase] = useState<GamePhase>("idle");
  const [finalScore, setFinalScore] = useState(0);

  const handleStart = () => {
    setFinalScore(0);
    setPhase("playing");
  };

  const handleGameOver = (score: number) => {
    setFinalScore(score);
    setPhase("gameOver");
  };

  const handleRestart = () => {
    setFinalScore(0);
    setPhase("playing");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 text-zinc-50">
      {phase === "idle" && <StartScreen onStart={handleStart} />}
      {phase === "playing" && <GameScreen onGameOver={handleGameOver} />}
      {phase === "gameOver" && (
        <GameOverScreen score={finalScore} onRestart={handleRestart} />
      )}
    </main>
  );
}
