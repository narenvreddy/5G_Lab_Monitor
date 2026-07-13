import React, { useEffect, useRef, useState } from "react";
import type { GameProps } from "./types";

const COLORS = ["#5B4FCF", "#FF6B35", "#00C9A7", "#EF476F"];
const randInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;
function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function genQ(difficulty: number) {
  const maxA = difficulty === 0 ? 9 : difficulty === 1 ? 50 : 200;
  const op = Math.random() < 0.5 ? "+" : "-";
  let a = randInt(difficulty === 0 ? 1 : 10, maxA);
  let b = randInt(1, Math.min(a, maxA));
  if (op === "-" && b > a) [a, b] = [b, a];
  const answer = op === "+" ? a + b : a - b;
  const s = new Set([answer]);
  let attempts = 0;
  while (s.size < 4 && attempts < 100) {
    s.add(answer + randInt(-10, 10));
    attempts++;
  }
  while (s.size < 4) s.add(answer + s.size + 1);
  const choices = shuffle([...s]);
  return { a, b, op, answer, choices, correct: choices.indexOf(answer) };
}

export function RocketMath({ difficulty, onGameOver }: GameProps) {
  const [timeLeft, setTimeLeft] = useState(60);
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
      }, 600);
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
          className={`font-black text-2xl ${timeLeft <= 10 ? "text-[#EF476F]" : "text-[#5B4FCF]"}`}
        >
          ⏱ {timeLeft}s
        </span>
        <span className="font-black text-2xl text-[#FF6B35]">⭐ {score}</span>
      </div>
      <div
        className={`w-full max-w-sm py-8 rounded-3xl text-center shadow-md transition-colors ${flash === "correct" ? "bg-[#00C9A7]" : flash === "wrong" ? "bg-[#EF476F]" : "bg-white"}`}
      >
        <p className="font-black text-5xl text-[#1A1A2E]">
          {q.a} {q.op} {q.b} = ?
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
        {q.choices.map((choice, idx) => (
          <button
            key={`${q.a}-${q.b}-${q.op}-${idx}`}
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
