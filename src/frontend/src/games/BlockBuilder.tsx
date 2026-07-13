import React, { useState } from "react";
import type { GameProps } from "./types";

const randInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

function genTarget(difficulty: number): number {
  if (difficulty === 0) return randInt(10, 99);
  if (difficulty === 1) return randInt(100, 999);
  return randInt(100, 999);
}

function BlockRow({
  count,
  color,
  label,
}: { count: number; color: string; label: string }) {
  const blockIndices = Array.from({ length: Math.min(count, 20) }, (_, i) => i);
  return (
    <div className="flex items-center gap-2">
      <span className="w-16 text-right font-bold text-[#6B6B8A] text-sm">
        {label}
      </span>
      <div className="flex gap-1 flex-wrap flex-1">
        {blockIndices.map((blockIdx) => (
          <div
            key={`block-${blockIdx}`}
            style={{
              width: 16,
              height: 16,
              backgroundColor: color,
              borderRadius: 3,
            }}
          />
        ))}
        {count > 20 && (
          <span className="text-xs font-bold" style={{ color }}>
            +{count - 20}
          </span>
        )}
      </div>
      <span className="w-8 font-black text-lg" style={{ color }}>
        {count}
      </span>
    </div>
  );
}

export function BlockBuilder({ difficulty, onGameOver }: GameProps) {
  const [round, setRound] = useState(0);
  const [target, setTarget] = useState(() => genTarget(difficulty));
  const [hundreds, setHundreds] = useState(0);
  const [tens, setTens] = useState(0);
  const [ones, setOnes] = useState(0);
  const [flash, setFlash] = useState<"correct" | "wrong" | null>(null);
  const [score, setScore] = useState(0);
  const totalRounds = 8;

  const targetH = Math.floor(target / 100);
  const targetT = Math.floor((target % 100) / 10);
  const targetO = target % 10;
  const showHundreds = difficulty >= 1 || targetH > 0;

  const handleSubmit = () => {
    if (flash) return;
    const built = hundreds * 100 + tens * 10 + ones;
    if (built === target) {
      const newScore = score + 15;
      setScore(newScore);
      setFlash("correct");
      setTimeout(() => {
        const next = round + 1;
        if (next >= totalRounds) {
          onGameOver(newScore);
        } else {
          setRound(next);
          setTarget(genTarget(difficulty));
          setHundreds(0);
          setTens(0);
          setOnes(0);
          setFlash(null);
        }
      }, 800);
    } else {
      setFlash("wrong");
      setTimeout(() => {
        setHundreds(targetH);
        setTens(targetT);
        setOnes(targetO);
        setFlash(null);
      }, 900);
    }
  };

  const Counter = ({
    label,
    value,
    onChange,
    color,
  }: {
    label: string;
    value: number;
    onChange: (v: number) => void;
    color: string;
  }) => (
    <div className="flex flex-col items-center gap-1">
      <span className="font-bold text-sm" style={{ color }}>
        {label}
      </span>
      <button
        type="button"
        className="w-12 h-12 rounded-xl font-black text-xl text-white shadow-md active:scale-95"
        style={{ backgroundColor: color }}
        onClick={() => onChange(Math.min(value + 1, 9))}
        data-ocid="game.toggle"
      >
        ▲
      </button>
      <span className="font-black text-3xl" style={{ color }}>
        {value}
      </span>
      <button
        type="button"
        className="w-12 h-12 rounded-xl font-black text-xl text-white shadow-md active:scale-95"
        style={{ backgroundColor: color }}
        onClick={() => onChange(Math.max(value - 1, 0))}
        data-ocid="game.toggle"
      >
        ▼
      </button>
    </div>
  );

  return (
    <div className="flex flex-col items-center p-4 gap-4 pt-6">
      <div className="flex justify-between w-full max-w-sm">
        <span className="font-black text-xl text-[#5B4FCF]">
          Round {round + 1}/{totalRounds}
        </span>
        <span className="font-black text-xl text-[#FF6B35]">⭐ {score}</span>
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
        <p className="text-[#6B6B8A] font-bold">Build this number:</p>
        <p className="font-black text-7xl text-[#1A1A2E]">{target}</p>
      </div>
      <div className="bg-white rounded-3xl p-4 shadow-md w-full max-w-sm">
        <div className="flex justify-center gap-6">
          {showHundreds && (
            <Counter
              label="100s"
              value={hundreds}
              onChange={setHundreds}
              color="#5B4FCF"
            />
          )}
          <Counter
            label="10s"
            value={tens}
            onChange={setTens}
            color="#FF6B35"
          />
          <Counter label="1s" value={ones} onChange={setOnes} color="#00C9A7" />
        </div>
      </div>
      <div className="bg-white rounded-3xl p-3 w-full max-w-sm shadow-sm">
        {showHundreds && (
          <BlockRow count={hundreds} color="#5B4FCF" label="Hundreds" />
        )}
        <BlockRow count={tens} color="#FF6B35" label="Tens" />
        <BlockRow count={ones} color="#00C9A7" label="Ones" />
        <p className="text-center font-black text-2xl mt-2 text-[#1A1A2E]">
          {hundreds * 100 + tens * 10 + ones}
        </p>
      </div>
      <button
        type="button"
        data-ocid="game.primary_button"
        className="w-full max-w-sm py-4 rounded-2xl font-black text-xl text-white shadow-lg active:scale-95 transition-transform"
        style={{ backgroundColor: "#5B4FCF" }}
        onClick={handleSubmit}
        disabled={!!flash}
      >
        ✅ Check!
      </button>
    </div>
  );
}
