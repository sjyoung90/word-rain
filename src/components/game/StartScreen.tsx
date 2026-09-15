"use client";

type Props = {
  onStart: () => void;
};

export function StartScreen({ onStart }: Props) {
  return (
    <div className="flex flex-col items-center gap-8 text-center">
      <h1 className="text-6xl font-bold tracking-tight">Word Rain</h1>
      <p className="max-w-md text-lg text-zinc-400">
        위에서 떨어지는 단어를 타이핑해서 지워보세요.
        <br />
        바닥에 닿기 전에!
      </p>
      <button
        onClick={onStart}
        className="rounded-full bg-zinc-50 px-8 py-3 text-lg font-semibold text-zinc-950 transition hover:bg-zinc-200"
      >
        게임 시작
      </button>
    </div>
  );
}
