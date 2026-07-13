import React, { useEffect, useRef, useState } from "react";
import type { GameProps } from "./types";

const COLORS = ["#5B4FCF", "#FF6B35", "#00C9A7", "#EF476F"];
const BLOOM_CSS =
  "@keyframes bloom{0%{transform:scale(0) rotate(-20deg);opacity:0}60%{transform:scale(1.3) rotate(5deg)}100%{transform:scale(1) rotate(0deg);opacity:1}}.bloom{animation:bloom 0.5s ease forwards}";

const randInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;
function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

const FLOWERS = ["🌸", "🌺", "🌻", "🌼", "🌷"];
const GARDEN_SLOTS = Array.from({ length: 10 }, (_, i) => i);

function getFibSeq(n: number): number[] {
  const s = [1, 1];
  while (s.length < n + 2) s.push(s[s.length - 1] + s[s.length - 2]);
  return s.slice(0, n + 2);
}

function genQ(difficulty: number): {
  seqItems: { val: number | null; key: string }[];
  answer: number;
  choices: number[];
  correct: number;
  seqName: string;
} {
  const seqTypes = ["fibonacci", "squares", "triangular", "powers2"] as const;
  const type = seqTypes[randInt(0, seqTypes.length - 1)];
  const startIdx = randInt(0, difficulty === 0 ? 3 : difficulty === 1 ? 5 : 7);
  let values: number[] = [];
  let seqName = "";

  if (type === "fibonacci") {
    values = getFibSeq(startIdx + 4).slice(startIdx, startIdx + 5);
    seqName = "Fibonacci";
  } else if (type === "squares") {
    values = Array.from({ length: 5 }, (_, i) => (startIdx + i + 1) ** 2);
    seqName = "Square Numbers";
  } else if (type === "triangular") {
    values = Array.from({ length: 5 }, (_, i) => {
      const n = startIdx + i + 1;
      return (n * (n + 1)) / 2;
    });
    seqName = "Triangular Numbers";
  } else {
    values = Array.from({ length: 5 }, (_, i) => 2 ** (startIdx + i));
    seqName = "Powers of 2";
    if (values[4] > 2000) return genQ(difficulty);
  }

  const answer = values[4];
  const seqItems = [...values.slice(0, 4), null].map((val, i) => ({
    val: val as number | null,
    key: `seq-${i}-${val ?? "q"}`,
  }));

  const s = new Set([answer]);
  let attempts = 0;
  while (s.size < 4 && attempts < 100) {
    s.add(
      (answer + randInt(-Math.floor(answer * 0.4), Math.floor(answer * 0.4))) |
        0,
    );
    attempts++;
  }
  while (s.size < 4) s.add(answer + s.size * 3);
  const choices = shuffle([...s]);
  return {
    seqItems,
    answer,
    choices,
    correct: choices.indexOf(answer),
    seqName,
  };
}

export function ChaosGarden({ difficulty, onGameOver }: GameProps) {
  const [timeLeft, setTimeLeft] = useState(90);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [q, setQ] = useState(() => genQ(difficulty));
  const [flash, setFlash] = useState<"correct" | "wrong" | null>(null);
  const [bloomed, setBloomed] = useState(0);
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
      setBloomed((b) => Math.min(b + 1, 10));
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
    <div className="flex flex-col items-center p-4 gap-4 pt-6">
      <style>{BLOOM_CSS}</style>
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
      <div className="flex gap-1 justify-center w-full max-w-sm flex-wrap bg-[#00C9A7]/10 rounded-2xl p-3">
        {GARDEN_SLOTS.map((slotIdx) => (
          <span
            key={`garden-${slotIdx}`}
            className={
              slotIdx < bloomed ? "text-3xl bloom" : "text-3xl opacity-20"
            }
            style={{ animationDelay: `${slotIdx * 0.05}s` }}
          >
            {slotIdx < bloomed ? FLOWERS[slotIdx % FLOWERS.length] : "🌱"}
          </span>
        ))}
      </div>
      <div
        className={`w-full max-w-sm rounded-3xl p-5 shadow-md text-center transition-colors ${
          flash === "correct"
            ? "bg-[#00C9A7]"
            : flash === "wrong"
              ? "bg-[#EF476F]"
              : "bg-white"
        }`}
      >
        <p className="text-[#6B6B8A] font-bold text-sm mb-3">
          {q.seqName} — What comes next?
        </p>
        <div className="flex justify-center gap-2 flex-wrap">
          {q.seqItems.map(({ val, key }) => (
            <span
              key={key}
              className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-lg ${
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
            className="py-5 rounded-2xl font-black text-2xl text-white shadow-md active:scale-95 transition-transform min-h-[72px]"
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
