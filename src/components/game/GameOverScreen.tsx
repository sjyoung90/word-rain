"use client";

type Props = {
  score: number;
  onRestart: () => void;
};

export function GameOverScreen({ score, onRestart }: Props) {
  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <h2 className="text-4xl font-bold">Game Over</h2>
      <p className="text-2xl text-zinc-400">
        최종 점수: <span className="font-bold text-zinc-50">{score}</span>
      </p>
      <button
        onClick={onRestart}
        className="rounded-full bg-zinc-50 px-8 py-3 text-lg font-semibold text-zinc-950 transition hover:bg-zinc-200"
      >
        다시 시작
      </button>
    </div>
  );
}
