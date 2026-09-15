export type GamePhase = "idle" | "playing" | "gameOver";

export type FallingWord = {
  id: string;
  text: string;
  x: number;
  y: number;
  speed: number;
  typedCount: number;
};

export type GameState = {
  phase: GamePhase;
  words: FallingWord[];
  score: number;
  lives: number;
  elapsedMs: number;
  activeWordId: string | null;
  buffer: string;
};

export const INITIAL_LIVES = 3;
export const MAX_CONCURRENT_WORDS = 4;
export const PLAYFIELD_HEIGHT = 600;
export const PLAYFIELD_WIDTH = 800;
