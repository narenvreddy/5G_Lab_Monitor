import React, { useCallback, useEffect, useRef, useState } from "react";
import type { GameProps } from "./types";

interface Question {
  display: string;
  answer: number;
  choices: number[];
}

const BOSSES = ["👾", "🐲", "🦹", "🤖", "👹"];
const BOSS_NAMES = [
  "Space Invader",
  "Dragon King",
  "Math Villain",
  "Evil Bot",
  "Number Goblin",
];
const HP_SLOTS = ["a", "b", "c", "d", "e"];

function generateQuestion(difficulty: number): Question {
  const rnd = (min: number, max: number) =>
    min + Math.floor(Math.random() * (max - min + 1));

  const types =
    difficulty === 0
      ? ["add", "sub"]
      : difficulty === 1
        ? ["add", "sub", "mult", "frac"]
        : ["add", "sub", "mult", "frac", "mixed"];

  const type = types[Math.floor(Math.random() * types.length)];

  if (type === "add") {
    const max = difficulty === 0 ? 20 : 50;
    const a = rnd(1, max);
    const b = rnd(1, max);
    return makeQ(`${a} + ${b}`, a + b);
  }
  if (type === "sub") {
    const max = difficulty === 0 ? 20 : 50;
    const a = rnd(5, max);
    const b = rnd(1, a);
    return makeQ(`${a} − ${b}`, a - b);
  }
  if (type === "mult") {
    const a = rnd(2, difficulty === 1 ? 9 : 12);
    const b = rnd(2, difficulty === 1 ? 9 : 12);
    return makeQ(`${a} × ${b}`, a * b);
  }
  if (type === "frac") {
    const den = [2, 4, 5][Math.floor(Math.random() * 3)];
    const num = rnd(1, den - 1);
    const mult = rnd(2, 5);
    return makeQ(`${num}/${den} of ${den * mult}`, num * mult);
  }
  const a = rnd(2, 8);
  const b = rnd(2, 8);
  const c = rnd(1, 10);
  return makeQ(`${a} × ${b} + ${c}`, a * b + c);
}

function makeQ(display: string, answer: number): Question {
  const choices = new Set<number>();
  choices.add(answer);
  while (choices.size < 4) {
    const offset = [-3, -2, -1, 1, 2, 3, 5, -5, 10, -10][
      Math.floor(Math.random() * 10)
    ];
    const c = answer + offset;
    if (c >= 0 && c <= 200) choices.add(c);
  }
  return {
    display,
    answer,
    choices: [...choices].sort(() => Math.random() - 0.5),
  };
}

const PLAYER_MAX_HP = 5;
const BOSS_MAX_HP = 5;
const TIME_PER_Q = 6;

function HpBar({
  current,
  max,
  color,
  label,
}: { current: number; max: number; color: string; label: string }) {
  const slots = HP_SLOTS.slice(0, max);
  return (
    <div className="flex-1">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-bold text-white/80">{label}</span>
        <span className="text-xs font-bold text-white">
          {current}/{max}
        </span>
      </div>
      <div className="h-4 bg-white/20 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${(current / max) * 100}%`, background: color }}
        />
      </div>
      <div className="flex gap-1 mt-1">
        {slots.map((slot, i) => (
          <span key={slot} className="text-sm">
            {i < current ? "❤️" : "🖤"}
          </span>
        ))}
      </div>
    </div>
  );
}

export function MathBoss({ difficulty, onGameOver }: GameProps) {
  const [bossIndex] = useState(() => Math.floor(Math.random() * BOSSES.length));
  const [question, setQuestion] = useState(() => generateQuestion(difficulty));
  const [playerHp, setPlayerHp] = useState(PLAYER_MAX_HP);
  const [bossHp, setBossHp] = useState(BOSS_MAX_HP);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(TIME_PER_Q);
  const [flash, setFlash] = useState<"correct" | "wrong" | null>(null);
  const [bossShake, setBossShake] = useState(false);
  const [playerShake, setPlayerShake] = useState(false);
  const [gameResult, setGameResult] = useState<"win" | "lose" | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const nextQuestion = useCallback(() => {
    setQuestion(generateQuestion(difficulty));
    setTimer(TIME_PER_Q);
    setFlash(null);
  }, [difficulty]);

  useEffect(() => {
    if (gameResult !== null) return;
    if (flash !== null) return;
    timerRef.current = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          setPlayerHp((hp) => {
            const newHp = hp - 1;
            if (newHp <= 0) setGameResult("lose");
            return newHp;
          });
          setFlash("wrong");
          setPlayerShake(true);
          setTimeout(() => setPlayerShake(false), 600);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameResult, flash]);

  useEffect(() => {
    if (flash === null || gameResult !== null) return;
    const id = setTimeout(nextQuestion, 900);
    return () => clearTimeout(id);
  }, [flash, gameResult, nextQuestion]);

  useEffect(() => {
    if (gameResult !== null) onGameOver(score);
  }, [gameResult, score, onGameOver]);

  const handleAnswer = (choice: number) => {
    if (flash !== null || gameResult !== null) return;
    if (timerRef.current) clearInterval(timerRef.current);

    if (choice === question.answer) {
      setScore((s) => s + 15);
      setFlash("correct");
      setBossHp((hp) => {
        const newHp = hp - 1;
        if (newHp <= 0) setGameResult("win");
        return newHp;
      });
      setBossShake(true);
      setTimeout(() => setBossShake(false), 600);
    } else {
      setFlash("wrong");
      setPlayerHp((hp) => {
        const newHp = hp - 1;
        if (newHp <= 0) setGameResult("lose");
        return newHp;
      });
      setPlayerShake(true);
      setTimeout(() => setPlayerShake(false), 600);
    }
  };

  return (
    <div className="flex flex-col h-full min-h-[400px] bg-gradient-to-b from-[#1A1A2E] to-[#2D1A4E] rounded-2xl p-4 relative">
      <div className="flex gap-3 mb-4">
        <HpBar
          current={bossHp}
          max={BOSS_MAX_HP}
          color="#EF476F"
          label="👾 Boss"
        />
        <HpBar
          current={playerHp}
          max={PLAYER_MAX_HP}
          color="#00C9A7"
          label="🧒 You"
        />
      </div>

      <div
        className={`flex flex-col items-center mb-4 transition-transform ${
          bossShake ? "animate-pulse" : ""
        }`}
      >
        <div
          className={`text-7xl transition-all duration-300 ${
            gameResult === "win"
              ? "scale-150 drop-shadow-[0_0_30px_#FFD166]"
              : gameResult === "lose"
                ? "opacity-40 scale-75"
                : bossShake
                  ? "scale-125 drop-shadow-[0_0_30px_#EF476F]"
                  : "scale-100"
          } ${flash === "correct" && !gameResult ? "opacity-60" : "opacity-100"}`}
        >
          {gameResult === "win" ? "💀" : BOSSES[bossIndex]}
        </div>
        <span className="text-white/60 font-bold text-xs mt-1">
          {gameResult === "win"
            ? "DEFEATED!"
            : gameResult === "lose"
              ? "You fell..."
              : BOSS_NAMES[bossIndex]}
        </span>
      </div>

      <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden mb-3">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${
            timer > TIME_PER_Q * 0.5
              ? "bg-[#00C9A7]"
              : timer > TIME_PER_Q * 0.25
                ? "bg-[#FFD166]"
                : "bg-[#EF476F]"
          }`}
          style={{
            width: gameResult ? "0%" : `${(timer / TIME_PER_Q) * 100}%`,
          }}
        />
      </div>

      <div
        className={`bg-white/10 rounded-2xl px-4 py-3 mb-4 text-center ${
          playerShake ? "border-2 border-[#EF476F]" : ""
        }`}
      >
        {gameResult ? (
          <p className="text-[#FFD166] font-black text-2xl">
            {gameResult === "win" ? "🎉 Boss Defeated!" : "💀 Game Over"}
          </p>
        ) : (
          <p className="text-white font-black text-3xl tracking-wide">
            {question.display}
          </p>
        )}
        <p className="text-white/50 text-xs mt-1">Score: {score}</p>
      </div>

      {!gameResult && (
        <div className="grid grid-cols-2 gap-2">
          {question.choices.map((choice) => (
            <button
              type="button"
              key={choice}
              data-ocid="math_boss.answer.button"
              onClick={() => handleAnswer(choice)}
              className={`
                py-3 rounded-2xl font-black text-lg transition-all
                ${
                  flash === "correct" && choice === question.answer
                    ? "bg-[#00C9A7] text-white scale-105"
                    : flash === "wrong" && choice === question.answer
                      ? "bg-[#00C9A7]/30 text-[#00C9A7]"
                      : "bg-white/15 text-white hover:bg-white/25 active:scale-95"
                }
              `}
            >
              {choice}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
