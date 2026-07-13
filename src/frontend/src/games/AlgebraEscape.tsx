import React, { useCallback, useEffect, useState } from "react";
import type { GameProps } from "./types";

interface Equation {
  display: string;
  answer: number;
  choices: number[];
}

function generateEquation(difficulty: number, index: number): Equation {
  const rnd = (min: number, max: number) =>
    min + Math.floor(Math.random() * (max - min + 1));

  if (difficulty === 0) {
    const type = index % 2 === 0 ? "add" : "sub";
    if (type === "add") {
      const x = rnd(1, 20);
      const a = rnd(1, 20);
      return makeEq(`x + ${a} = ${x + a}`, x);
    }
    const x = rnd(5, 25);
    const a = rnd(1, x - 1);
    return makeEq(`x − ${a} = ${x - a}`, x);
  }
  if (difficulty === 1) {
    const type = index % 3;
    if (type === 0) {
      const x = rnd(2, 12);
      const a = rnd(2, 9);
      return makeEq(`${a} × x = ${a * x}`, x);
    }
    if (type === 1) {
      const x = rnd(1, 15);
      const a = rnd(1, 15);
      return makeEq(`x + ${a} = ${x + a}`, x);
    }
    const x = rnd(1, 20);
    const a = rnd(1, x);
    return makeEq(`x − ${a} = ${x - a}`, x);
  }
  // Two-step: ax + b = c
  const a = rnd(2, 5);
  const x = rnd(1, 10);
  const b = rnd(1, 15);
  const c = a * x + b;
  return makeEq(`${a}x + ${b} = ${c}`, x);
}

function makeEq(display: string, answer: number): Equation {
  const choices = new Set<number>();
  choices.add(answer);
  while (choices.size < 4) {
    const offset = [-3, -2, -1, 1, 2, 3, 5, -5][Math.floor(Math.random() * 8)];
    const c = answer + offset;
    if (c > 0 && c < 50) choices.add(c);
  }
  return {
    display,
    answer,
    choices: [...choices].sort(() => Math.random() - 0.5),
  };
}

const TOTAL_EQUATIONS = 8;

export function AlgebraEscape({ difficulty, onGameOver }: GameProps) {
  const [eqIndex, setEqIndex] = useState(0);
  const [equation, setEquation] = useState(() =>
    generateEquation(difficulty, 0),
  );
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [flash, setFlash] = useState<"correct" | "wrong" | null>(null);
  const [revealAnswer, setRevealAnswer] = useState<number | null>(null);
  const [doorOpen, setDoorOpen] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    if (gameOver) onGameOver(score);
  }, [gameOver, score, onGameOver]);

  const nextEquation = useCallback(() => {
    const next = eqIndex + 1;
    if (next >= TOTAL_EQUATIONS) {
      const elapsed = Math.round((Date.now() - startTime) / 1000);
      const timeBonus = Math.max(0, 60 - elapsed);
      setScore((s) => s + timeBonus);
      setGameOver(true);
    } else {
      setEqIndex(next);
      setEquation(generateEquation(difficulty, next));
      setFlash(null);
      setRevealAnswer(null);
      setDoorOpen(false);
    }
  }, [eqIndex, difficulty, startTime]);

  useEffect(() => {
    if (flash === null) return;
    const id = setTimeout(nextEquation, flash === "correct" ? 900 : 1200);
    return () => clearTimeout(id);
  }, [flash, nextEquation]);

  const handleAnswer = (choice: number) => {
    if (flash !== null || gameOver) return;
    if (choice === equation.answer) {
      setCorrect((c) => c + 1);
      setScore((s) => s + 20);
      setFlash("correct");
      setDoorOpen(true);
    } else {
      setFlash("wrong");
      setRevealAnswer(equation.answer);
    }
  };

  return (
    <div className="relative flex flex-col h-full min-h-[400px] bg-gradient-to-b from-[#5B4FCF]/10 to-[#F4F2FF] rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="bg-[#5B4FCF] text-white rounded-xl px-3 py-1 font-black text-sm">
          {eqIndex + 1}/{TOTAL_EQUATIONS}
        </span>
        <span className="bg-[#FFD166] text-[#1A1A2E] rounded-xl px-3 py-1 font-black text-lg">
          {score} pts
        </span>
        {correct > 0 && (
          <span className="bg-[#00C9A7] text-white rounded-xl px-3 py-1 font-black text-sm">
            ✓ {correct}
          </span>
        )}
      </div>

      <div className="flex flex-col items-center mb-6">
        <div
          className={`text-7xl mb-2 transition-all duration-500 ${
            gameOver
              ? "scale-150 drop-shadow-[0_0_30px_#00C9A7]"
              : doorOpen
                ? "scale-125"
                : "scale-100"
          } ${flash === "correct" ? "drop-shadow-[0_0_20px_#00C9A7]" : ""}`}
        >
          {gameOver ? "🎉" : doorOpen ? "🔓" : "🚪"}
        </div>
        {gameOver ? (
          <div className="text-center">
            <p className="font-black text-2xl text-[#5B4FCF]">Escaped!</p>
            <p className="text-[#6B6B8A] font-bold text-sm">
              {correct}/{TOTAL_EQUATIONS} correct · time bonus included
            </p>
          </div>
        ) : (
          <div
            className={`bg-white rounded-2xl px-6 py-4 shadow-md border-2 ${
              flash === "correct"
                ? "border-[#00C9A7]"
                : flash === "wrong"
                  ? "border-[#EF476F]"
                  : "border-[#5B4FCF]/20"
            }`}
          >
            <p className="font-black text-3xl text-[#1A1A2E] text-center tracking-wide">
              {equation.display}
            </p>
            <p className="text-center text-[#6B6B8A] font-bold mt-1 text-sm">
              Find x
            </p>
          </div>
        )}
      </div>

      {!gameOver && (
        <div className="grid grid-cols-2 gap-3">
          {equation.choices.map((choice) => {
            const isCorrect = choice === equation.answer;
            const isReveal = revealAnswer !== null && isCorrect;
            return (
              <button
                type="button"
                key={choice}
                data-ocid="algebra_escape.answer.button"
                onClick={() => handleAnswer(choice)}
                className={`
                  py-4 rounded-2xl font-black text-xl transition-all
                  ${
                    isReveal
                      ? "bg-[#00C9A7] text-white scale-105"
                      : flash === "correct" && isCorrect
                        ? "bg-[#00C9A7] text-white scale-105"
                        : flash === "wrong" && !isCorrect && flash !== null
                          ? "bg-gray-200 text-gray-400"
                          : "bg-white text-[#1A1A2E] border-2 border-[#1A1A2E]/10 hover:border-[#5B4FCF] active:scale-95"
                  }
                `}
              >
                x = {choice}
              </button>
            );
          })}
        </div>
      )}

      {flash && !gameOver && (
        <div
          className={`absolute inset-0 rounded-2xl flex items-center justify-center pointer-events-none ${
            flash === "correct" ? "bg-[#00C9A7]/20" : "bg-[#EF476F]/20"
          }`}
        >
          <span className="text-6xl">{flash === "correct" ? "✅" : "❌"}</span>
        </div>
      )}
    </div>
  );
}
