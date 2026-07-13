import React, { useState } from "react";
import type { GameProps } from "./types";

const COLORS = ["#5B4FCF", "#FF6B35", "#00C9A7", "#EF476F"];
const randInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;
function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function genQ(difficulty: number) {
  const bits = difficulty === 0 ? 4 : difficulty === 1 ? 6 : 8;
  const maxVal = (1 << bits) - 1;
  const decimal = randInt(1, maxVal);
  const binary = decimal.toString(2).padStart(bits, "0");
  const s = new Set([decimal]);
  let attempts = 0;
  while (s.size < 4 && attempts < 100) {
    s.add(randInt(1, maxVal));
    attempts++;
  }
  while (s.size < 4) s.add(decimal + s.size);
  const choices = shuffle([...s]);
  return { binary, decimal, choices, correct: choices.indexOf(decimal), bits };
}

export function BinaryCracker({ difficulty, onGameOver }: GameProps) {
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [q, setQ] = useState(() => genQ(difficulty));
  const [flash, setFlash] = useState<"correct" | "wrong" | null>(null);
  const totalRounds = 10;

  const handleChoice = (idx: number) => {
    if (flash) return;
    if (idx === q.correct) {
      const newScore = score + 10;
      setScore(newScore);
      setFlash("correct");
      setTimeout(() => {
        const next = round + 1;
        if (next >= totalRounds) {
          onGameOver(newScore);
        } else {
          setRound(next);
          setQ(genQ(difficulty));
          setFlash(null);
        }
      }, 700);
    } else {
      setScore((s) => Math.max(0, s - 5));
      setFlash("wrong");
      setTimeout(() => setFlash(null), 400);
    }
  };

  const binaryBits = q.binary
    .split("")
    .map((bit, i) => ({ bit, key: `${q.binary}-b${i}` }));

  return (
    <div className="flex flex-col items-center p-4 gap-5 pt-6">
      <div className="flex justify-between w-full max-w-sm">
        <span className="font-black text-xl text-[#5B4FCF]">
          Round {round + 1}/{totalRounds}
        </span>
        <span className="font-black text-xl text-[#FF6B35]">⭐ {score}</span>
      </div>
      <p className="font-bold text-[#6B6B8A]">What decimal is this binary?</p>
      <div
        className={`w-full max-w-sm py-8 rounded-3xl text-center shadow-md transition-colors ${
          flash === "correct"
            ? "bg-[#00C9A7]"
            : flash === "wrong"
              ? "bg-[#EF476F]"
              : "bg-[#1A1A2E]"
        }`}
      >
        <div className="flex justify-center gap-1">
          {binaryBits.map(({ bit, key }) => (
            <span
              key={key}
              className={`w-12 h-16 rounded-xl font-black text-3xl flex items-center justify-center ${
                bit === "1"
                  ? "bg-[#FFD166] text-[#1A1A2E]"
                  : "bg-gray-700 text-gray-500"
              }`}
            >
              {bit}
            </span>
          ))}
        </div>
        <p className="text-gray-400 text-sm mt-3">{q.bits}-bit binary</p>
      </div>
      <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
        {q.choices.map((choice, idx) => (
          <button
            key={`${q.binary}-${idx}`}
            type="button"
            data-ocid={`game.answer.item.${idx + 1}`}
            className="py-5 rounded-2xl font-black text-3xl text-white shadow-md active:scale-95 transition-transform min-h-[72px]"
            style={{ backgroundColor: COLORS[idx] }}
            onClick={() => handleChoice(idx)}
            disabled={!!flash}
          >
            {choice}
          </button>
        ))}
      </div>
    </div>
  );
}
