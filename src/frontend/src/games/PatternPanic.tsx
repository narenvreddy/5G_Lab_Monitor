import React, { useEffect, useRef, useState } from "react";
import type { GameProps } from "./types";

const COLORS = ["#5B4FCF", "#FF6B35", "#00C9A7", "#EF476F"];
const randInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;
function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function genQ(difficulty: number): {
  seqItems: { val: number | null; key: string }[];
  answer: number;
  missingIdx: number;
  choices: number[];
  correct: number;
} {
  const type = ["arithmetic", "geometric", "alternating"][randInt(0, 2)];
  let values: number[] = [];

  if (type === "arithmetic") {
    const step = randInt(1, difficulty === 0 ? 5 : difficulty === 1 ? 10 : 20);
    const start = randInt(1, 20);
    values = Array.from({ length: 5 }, (_, i) => start + i * step);
  } else if (type === "geometric") {
    const factor = randInt(2, difficulty === 0 ? 2 : difficulty === 1 ? 3 : 4);
    const start = randInt(1, 5);
    values = Array.from({ length: 5 }, (_, i) => start * factor ** i);
    if (values[4] > 2000) return genQ(difficulty);
  } else {
    const a = randInt(1, difficulty === 0 ? 3 : 5);
    const b = randInt(1, difficulty === 0 ? 2 : 4);
    const start = randInt(1, 10);
    values = [start];
    for (let i = 1; i < 5; i++)
      values.push(values[i - 1] + (i % 2 === 0 ? b : a));
  }

  const missingIdx = randInt(1, 3);
  const answer = values[missingIdx];
  const seqItems = values.map((v, i) => ({
    val: i === missingIdx ? null : v,
    key: `si-${i}-${i === missingIdx ? "q" : v}`,
  }));

  const s = new Set([answer]);
  let attempts = 0;
  while (s.size < 4 && attempts < 100) {
    s.add(answer + randInt(-10, 10));
    attempts++;
  }
  while (s.size < 4) s.add(answer + s.size);
  const choices = shuffle([...s]);
  return {
    seqItems,
    answer,
    missingIdx,
    choices,
    correct: choices.indexOf(answer),
  };
}

export function PatternPanic({ difficulty, onGameOver }: GameProps) {
  const [timeLeft, setTimeLeft] = useState(90);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [q, setQ] = useState(() => genQ(difficulty));
  const [flash, setFlash] = useState<"correct" | "wrong" | null>(null);
  const scoreRef = useRef(0);
  const onDoneRef = useRef(onGameOver);
  onDoneRef.current = onGameOver;

  useEffect(() => {
    if (done || timeLeft <= 0) return;
    const t = setTimeout(() => setTimeLeft((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, done]);

  useEffect(() => {
    if (timeLeft <= 0 && !done) {
      setDone(true);
      onDoneRef.current(scoreRef.current);
    }
  }, [timeLeft, done]);

  const handleChoice = (idx: number) => {
    if (flash || done) return;
    if (idx === q.correct) {
      scoreRef.current += 10;
      setScore(scoreRef.current);
      setFlash("correct");
      setTimeout(() => {
        setFlash(null);
        setQ(genQ(difficulty));
      }, 700);
    } else {
      scoreRef.current = Math.max(0, scoreRef.current - 5);
      setScore(scoreRef.current);
      setFlash("wrong");
      setTimeout(() => setFlash(null), 400);
    }
  };

  return (
    <div className="flex flex-col items-center p-4 gap-5 pt-6">
      <div className="flex justify-between w-full max-w-sm">
        <span
          className={`font-black text-2xl ${
            timeLeft <= 15 ? "text-[#EF476F]" : "text-[#5B4FCF]"
          }`}
        >
          ⏱ {timeLeft}s
        </span>
        <span className="font-black text-2xl text-[#FF6B35]">⭐ {score}</span>
      </div>
      <p className="font-black text-xl text-[#1A1A2E]">
        What's the missing number? 🌀
      </p>
      <div
        className={`w-full max-w-sm rounded-3xl p-5 shadow-md text-center transition-colors ${
          flash === "correct"
            ? "bg-[#00C9A7]"
            : flash === "wrong"
              ? "bg-[#EF476F]"
              : "bg-white"
        }`}
      >
        <div className="flex justify-center gap-2 flex-wrap">
          {q.seqItems.map(({ val, key }) => (
            <span
              key={key}
              className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl ${
                val === null
                  ? "bg-[#5B4FCF] text-white text-3xl animate-pulse"
                  : "bg-[#F4F2FF] text-[#1A1A2E]"
              }`}
            >
              {val === null ? "?" : val}
            </span>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
        {q.choices.map((choice, idx) => (
          <button
            key={`${q.answer}-${idx}`}
            type="button"
            data-ocid={`game.answer.item.${idx + 1}`}
            className="py-5 rounded-2xl font-black text-3xl text-white shadow-md active:scale-95 transition-transform min-h-[72px]"
            style={{ backgroundColor: COLORS[idx] }}
            onClick={() => handleChoice(idx)}
            disabled={!!flash || done}
          >
            {choice}
          </button>
        ))}
      </div>
    </div>
  );
}
