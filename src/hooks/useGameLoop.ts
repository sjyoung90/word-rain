"use client";

import { useEffect, useReducer, useRef } from "react";
import wordData from "@/data/words.json";
import {
  INITIAL_LIVES,
  MAX_CONCURRENT_WORDS,
  PLAYFIELD_HEIGHT,
  PLAYFIELD_WIDTH,
  type FallingWord,
  type GameState,
} from "@/types/game";

const WORDS: string[] = wordData.words;
const SPAWN_INTERVAL_MS = 1500;
const MAX_DELTA_MS = 100;

type Action =
  | { type: "TICK"; deltaMs: number }
  | { type: "SPAWN" }
  | { type: "KEY_PRESS"; key: string }
  | { type: "RESET" };

const initialState: GameState = {
  phase: "playing",
  words: [],
  score: 0,
  lives: INITIAL_LIVES,
  elapsedMs: 0,
  activeWordId: null,
  buffer: "",
};

function randomWord(elapsedMs: number): FallingWord {
  const text = WORDS[Math.floor(Math.random() * WORDS.length)];
  const speedBoost = Math.min(elapsedMs / 60_000, 1) * 0.15;
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    text,
    x: Math.random() * (PLAYFIELD_WIDTH - 100) + 50,
    y: 0,
    speed: 0.05 + speedBoost,
    typedCount: 0,
  };
}

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case "TICK": {
      const survivors: FallingWord[] = [];
      let livesLost = 0;

      for (const word of state.words) {
        const nextY = word.y + word.speed * action.deltaMs;
        if (nextY >= PLAYFIELD_HEIGHT) {
          livesLost++;
        } else {
          survivors.push({ ...word, y: nextY });
        }
      }

      const nextLives = Math.max(0, state.lives - livesLost);
      const activeSurvived = survivors.some((w) => w.id === state.activeWordId);

      return {
        ...state,
        words: survivors,
        lives: nextLives,
        elapsedMs: state.elapsedMs + action.deltaMs,
        phase: nextLives === 0 ? "gameOver" : state.phase,
        activeWordId: activeSurvived ? state.activeWordId : null,
        buffer: activeSurvived ? state.buffer : "",
      };
    }

    case "SPAWN": {
      if (state.words.length >= MAX_CONCURRENT_WORDS) return state;
      return {
        ...state,
        words: [...state.words, randomWord(state.elapsedMs)],
      };
    }

    case "KEY_PRESS": {
      const key = action.key.toLowerCase();

      if (state.activeWordId === null) {
        const target = state.words.find((w) => w.text[0] === key);
        if (!target) return state;
        return {
          ...state,
          activeWordId: target.id,
          buffer: key,
          words: state.words.map((w) =>
            w.id === target.id ? { ...w, typedCount: 1 } : w,
          ),
        };
      }

      const active = state.words.find((w) => w.id === state.activeWordId);
      if (!active) {
        return { ...state, activeWordId: null, buffer: "" };
      }

      const expected = active.text[active.typedCount];
      if (expected !== key) return state;

      const nextTypedCount = active.typedCount + 1;
      const isComplete = nextTypedCount >= active.text.length;

      if (isComplete) {
        return {
          ...state,
          words: state.words.filter((w) => w.id !== active.id),
          score: state.score + active.text.length * 2,
          activeWordId: null,
          buffer: "",
        };
      }

      return {
        ...state,
        buffer: state.buffer + key,
        words: state.words.map((w) =>
          w.id === active.id ? { ...w, typedCount: nextTypedCount } : w,
        ),
      };
    }

    case "RESET":
      return initialState;
  }
}

export function useGameLoop(onGameOver: (score: number) => void) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const lastSpawnRef = useRef<number>(0);
  const phaseRef = useRef(state.phase);
  const gameOverCalledRef = useRef(false);
  phaseRef.current = state.phase;

  useEffect(() => {
    lastTimeRef.current = performance.now();
    lastSpawnRef.current = performance.now();

    const loop = (now: number) => {
      if (phaseRef.current === "gameOver") return;

      const deltaMs = Math.min(now - lastTimeRef.current, MAX_DELTA_MS);
      lastTimeRef.current = now;
      dispatch({ type: "TICK", deltaMs });

      if (now - lastSpawnRef.current >= SPAWN_INTERVAL_MS) {
        dispatch({ type: "SPAWN" });
        lastSpawnRef.current = now;
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useEffect(() => {
    if (state.phase === "gameOver" && !gameOverCalledRef.current) {
      gameOverCalledRef.current = true;
      onGameOver(state.score);
    }
  }, [state.phase, state.score, onGameOver]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key.length === 1 && /[a-zA-Z]/.test(e.key)) {
        dispatch({ type: "KEY_PRESS", key: e.key });
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return state;
}
