import React, { useState } from "react";
import type { GameProps } from "./types";

const FRACTIONS = [
  { num: 1, den: 2 },
  { num: 1, den: 3 },
  { num: 2, den: 3 },
  { num: 1, den: 4 },
  { num: 3, den: 4 },
  { num: 1, den: 6 },
  { num: 5, den: 6 },
  { num: 1, den: 8 },
  { num: 3, den: 8 },
  { num: 5, den: 8 },
  { num: 7, den: 8 },
  { num: 2, den: 5 },
  { num: 3, den: 5 },
  { num: 4, den: 5 },
  { num: 1, den: 5 },
];

function getFractions(difficulty: number) {
  if (difficulty === 0) return FRACTIONS.filter((f) => f.den <= 4);
  if (difficulty === 1) return FRACTIONS.filter((f) => f.den <= 6);
  return FRACTIONS;
}

function PizzaSlice({
  cx,
  cy,
  r,
  index,
  total,
  shaded,
  onClick,
}: {
  cx: number;
  cy: number;
  r: number;
  index: number;
  total: number;
  shaded: boolean;
  onClick: () => void;
}) {
  const step = (2 * Math.PI) / total;
  const start = index * step - Math.PI / 2;
  const end = start + step;
  const x1 = cx + r * Math.cos(start);
  const y1 = cy + r * Math.sin(start);
  const x2 = cx + r * Math.cos(end);
  const y2 = cy + r * Math.sin(end);
  const large = step > Math.PI ? 1 : 0;
  return (
    <path
      d={`M ${cx} ${cy} L ${x1.toFixed(1)} ${y1.toFixed(1)} A ${r} ${r} 0 ${large} 1 ${x2.toFixed(1)} ${y2.toFixed(1)} Z`}
      fill={shaded ? "#FF6B35" : "#FFD166"}
      stroke="white"
      strokeWidth={3}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onClick();
      }}
      role="button"
      tabIndex={0}
      aria-label={`Pizza slice ${index + 1}${shaded ? " (selected)" : ""}`}
      style={{ cursor: "pointer", transition: "fill 0.2s" }}
    />
  );
}

export function FractionPizza({ difficulty, onGameOver }: GameProps) {
  const fractions = getFractions(difficulty);
  const [round, setRound] = useState(0);
  const [fIdx, setFIdx] = useState(() =>
    Math.floor(Math.random() * fractions.length),
  );
  const [shaded, setShaded] = useState<Set<number>>(new Set());
  const [flash, setFlash] = useState<"correct" | "wrong" | null>(null);
  const [score, setScore] = useState(0);
  const totalRounds = 8;

  const fraction = fractions[fIdx];

  const toggleSlice = (idx: number) => {
    if (flash) return;
    const next = new Set(shaded);
    if (next.has(idx)) next.delete(idx);
    else next.add(idx);
    setShaded(next);
    if (next.size === fraction.num) {
      const newScore = score + 15;
      setScore(newScore);
      setFlash("correct");
      setTimeout(() => {
        const nextRound = round + 1;
        if (nextRound >= totalRounds) {
          onGameOver(newScore);
        } else {
          setRound(nextRound);
          setFIdx(Math.floor(Math.random() * fractions.length));
          setShaded(new Set());
          setFlash(null);
        }
      }, 800);
    }
  };

  const r = 90;
  const cx = 100;
  const cy = 100;
  const sliceIndices = Array.from({ length: fraction.den }, (_, i) => i);

  return (
    <div className="flex flex-col items-center p-4 gap-5 pt-6">
      <div className="flex justify-between w-full max-w-sm">
        <span className="font-black text-xl text-[#5B4FCF]">
          Round {round + 1}/{totalRounds}
        </span>
        <span className="font-black text-xl text-[#FF6B35]">⭐ {score}</span>
      </div>
      <div
        className={`w-full max-w-sm py-4 rounded-3xl text-center shadow-md transition-colors ${
          flash === "correct" ? "bg-[#00C9A7]" : "bg-white"
        }`}
      >
        <p className="font-bold text-[#6B6B8A]">Shade</p>
        <p className="font-black text-6xl text-[#5B4FCF]">
          {fraction.num}/{fraction.den}
        </p>
        <p className="font-bold text-[#6B6B8A]">of the pizza</p>
      </div>
      <div className="relative">
        <svg
          width="200"
          height="200"
          viewBox="0 0 200 200"
          role="img"
          aria-label="Pizza fraction game"
        >
          <title>Pizza Fraction</title>
          {sliceIndices.map((sliceIdx) => (
            <PizzaSlice
              key={`${fIdx}-slice-${sliceIdx}`}
              cx={cx}
              cy={cy}
              r={r}
              index={sliceIdx}
              total={fraction.den}
              shaded={shaded.has(sliceIdx)}
              onClick={() => toggleSlice(sliceIdx)}
            />
          ))}
          <circle
            cx={cx}
            cy={cy}
            r={12}
            fill="#FFD166"
            stroke="white"
            strokeWidth={2}
          />
        </svg>
        {flash === "correct" && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl">✅</span>
          </div>
        )}
      </div>
      <p className="text-[#6B6B8A] font-bold text-sm">
        Tap slices to shade them • {shaded.size}/{fraction.num} selected
      </p>
    </div>
  );
}
