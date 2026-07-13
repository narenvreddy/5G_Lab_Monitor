import React, { useState } from "react";
import type { GameProps } from "./types";

const FROG_BOUNCE_CSS = `
@keyframes frogBounce {
  0% { transform: scale(1); }
  30% { transform: scale(1.5) translateY(-4px); }
  60% { transform: scale(0.9); }
  100% { transform: scale(1); }
}
.frog-bounce { animation: frogBounce 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
`;

const randInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

function genRound(difficulty: number) {
  const max = difficulty === 0 ? 10 : difficulty === 1 ? 20 : 30;
  const target = randInt(1, max);
  return { target, max };
}

export function HopToIt({ difficulty, onGameOver }: GameProps) {
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [current, setCurrent] = useState(() => genRound(difficulty));
  const [frogPos, setFrogPos] = useState(0);
  const [flash, setFlash] = useState<"correct" | "wrong" | null>(null);
  const [bounceKey, setBounceKey] = useState(0);
  const totalRounds = 8;

  const handleTap = (pos: number) => {
    if (flash) return;
    setFrogPos(pos);
    setBounceKey((k) => k + 1);
    if (pos === current.target) {
      setFlash("correct");
      const newScore = score + 10;
      setScore(newScore);
      setTimeout(() => {
        const nextRound = round + 1;
        if (nextRound >= totalRounds) {
          onGameOver(newScore);
        } else {
          setRound(nextRound);
          setCurrent(genRound(difficulty));
          setFrogPos(0);
          setFlash(null);
        }
      }, 800);
    } else {
      setFlash("wrong");
      setTimeout(() => setFlash(null), 500);
    }
  };

  const positions = Array.from({ length: current.max + 1 }, (_, i) => i);
  const cols = current.max <= 10 ? 11 : current.max <= 20 ? 7 : 6;

  return (
    <div className="flex flex-col items-center p-4 gap-5 pt-6">
      <style>{FROG_BOUNCE_CSS}</style>
      <div className="flex justify-between w-full max-w-sm">
        <span className="font-black text-xl text-[#5B4FCF]">
          Round {round + 1}/{totalRounds}
        </span>
        <span className="font-black text-xl text-[#FF6B35]">⭐ {score}</span>
      </div>
      <div
        className={`w-full max-w-sm p-5 rounded-3xl text-center shadow-md ${flash === "correct" ? "bg-[#00C9A7]" : flash === "wrong" ? "bg-[#EF476F]" : "bg-white"}`}
      >
        <p className="font-black text-2xl text-[#1A1A2E] mb-1">🐸 Hop to...</p>
        <p className="font-black text-6xl text-[#5B4FCF]">{current.target}</p>
      </div>
      <div className="w-full max-w-sm">
        <p className="text-center text-sm font-bold text-[#6B6B8A] mb-3">
          Frog is at: <span className="text-[#5B4FCF]">{frogPos}</span>
        </p>
        <div
          className="grid gap-2"
          style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
        >
          {positions.map((pos) => (
            <button
              key={pos}
              type="button"
              data-ocid={`game.answer.item.${pos + 1}`}
              className={`aspect-square rounded-xl font-black text-sm flex items-center justify-center transition-colors active:scale-90 min-h-[44px] ${
                pos === frogPos
                  ? "bg-[#00C9A7] text-white shadow-md scale-110"
                  : pos === current.target && flash === "correct"
                    ? "bg-[#00C9A7] text-white"
                    : "bg-white text-[#1A1A2E] shadow-sm hover:bg-purple-50"
              }`}
              onClick={() => handleTap(pos)}
              disabled={!!flash}
            >
              {pos === frogPos ? (
                <span key={bounceKey} className="frog-bounce inline-block">
                  🐸
                </span>
              ) : (
                pos
              )}
            </button>
          ))}
        </div>
      </div>
      {flash === "correct" && (
        <p className="font-black text-2xl text-[#00C9A7]">Correct! 🎉</p>
      )}
      {flash === "wrong" && (
        <p className="font-black text-2xl text-[#EF476F]">Try again! 💪</p>
      )}
    </div>
  );
}
