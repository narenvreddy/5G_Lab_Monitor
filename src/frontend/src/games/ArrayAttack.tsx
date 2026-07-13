import React, { useEffect, useRef, useState } from "react";
import type { GameProps } from "./types";

const COLORS = ["#5B4FCF", "#FF6B35", "#00C9A7", "#EF476F"];
const DOT_COLORS = ["#a78bfa", "#fb923c", "#34d399", "#f87171"];
const randInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;
function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function genQ(difficulty: number) {
  const maxFactor = difficulty === 0 ? 5 : difficulty === 1 ? 9 : 12;
  const rows = randInt(2, maxFactor);
  const cols = randInt(2, maxFactor);
  const answer = rows * cols;
  const distractors: Array<{ rows: number; cols: number }> = [];
  const used = new Set([answer]);
  while (distractors.length < 3) {
    const dr = randInt(2, maxFactor);
    const dc = randInt(2, maxFactor);
    const val = dr * dc;
    if (!used.has(val)) {
      used.add(val);
      distractors.push({ rows: dr, cols: dc });
    }
  }
  const allChoices = shuffle([{ rows, cols }, ...distractors]);
  const correct = allChoices.findIndex(
    (c) => c.rows === rows && c.cols === cols,
  );
  return { rows, cols, answer, choices: allChoices, correct };
}

function DotGrid({
  rows,
  cols,
  color,
}: { rows: number; cols: number; color: string }) {
  const size = cols > 7 || rows > 7 ? 6 : cols > 5 || rows > 5 ? 8 : 10;
  const dotIndices = Array.from({ length: rows * cols }, (_, i) => i);
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${cols}, ${size + 2}px)`,
        gap: 2,
      }}
    >
      {dotIndices.map((dotIdx) => (
        <div
          key={`dot-${dotIdx}`}
          style={{
            width: size,
            height: size,
            borderRadius: "50%",
            backgroundColor: color,
          }}
        />
      ))}
    </div>
  );
}

export function ArrayAttack({ difficulty, onGameOver }: GameProps) {
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
            timeLeft <= 10 ? "text-[#EF476F]" : "text-[#5B4FCF]"
          }`}
        >
          ⏱ {timeLeft}s
        </span>
        <span className="font-black text-2xl text-[#FF6B35]">⭐ {score}</span>
      </div>
      <div
        className={`w-full max-w-sm py-6 rounded-3xl text-center shadow-md transition-colors ${
          flash === "correct"
            ? "bg-[#00C9A7]"
            : flash === "wrong"
              ? "bg-[#EF476F]"
              : "bg-white"
        }`}
      >
        <p className="font-black text-5xl text-[#1A1A2E]">
          {q.rows} × {q.cols}
        </p>
        <p className="text-[#6B6B8A] font-bold mt-1">
          Pick the matching array!
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
        {q.choices.map((choice, idx) => (
          <button
            key={`${q.rows}-${q.cols}-${idx}`}
            type="button"
            data-ocid={`game.answer.item.${idx + 1}`}
            className="p-3 rounded-2xl shadow-md active:scale-95 transition-transform min-h-[80px] flex flex-col items-center justify-center gap-1 border-2"
            style={{
              backgroundColor: `${COLORS[idx]}22`,
              borderColor:
                flash === "correct" && idx === q.correct
                  ? "#00C9A7"
                  : `${COLORS[idx]}44`,
            }}
            onClick={() => handleChoice(idx)}
            disabled={!!flash || done}
          >
            <DotGrid
              rows={choice.rows}
              cols={choice.cols}
              color={DOT_COLORS[idx]}
            />
            <span className="text-xs font-bold" style={{ color: COLORS[idx] }}>
              {choice.rows}×{choice.cols}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
