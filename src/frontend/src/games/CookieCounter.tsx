import React, { useEffect, useRef, useState } from "react";
import { ComboIndicator, ConfettiBurst, ScorePopup } from "./gameUtils";
import type { GameProps } from "./types";

const COLORS = ["#5B4FCF", "#FF6B35", "#00C9A7", "#EF476F"];
const randInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;
function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function makeChoices(correct: number, min: number, max: number): number[] {
  const s = new Set([correct]);
  let attempts = 0;
  while (s.size < 4 && attempts < 100) {
    s.add(randInt(Math.max(min, correct - 5), Math.min(max, correct + 5)));
    attempts++;
  }
  while (s.size < 4) s.add(correct + s.size);
  return shuffle([...s]);
}

function genQ(difficulty: number) {
  const max = difficulty === 0 ? 10 : difficulty === 1 ? 20 : 30;
  const count = randInt(1, max);
  const choices = makeChoices(count, 1, max);
  return { count, choices, correct: choices.indexOf(count) };
}

export function CookieCounter({ difficulty, onGameOver }: GameProps) {
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [q, setQ] = useState(() => genQ(difficulty));
  const [flash, setFlash] = useState<"correct" | "wrong" | null>(null);
  const [combo, setCombo] = useState(0);
  const [popupKey, setPopupKey] = useState(0);
  const [popupValue, setPopupValue] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
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
      const newCombo = combo + 1;
      setCombo(newCombo);
      const comboMult = Math.min(newCombo, 3);
      const pts = comboMult === 1 ? 10 : comboMult === 2 ? 15 : 20;
      scoreRef.current += pts;
      setScore(scoreRef.current);
      setPopupValue(pts);
      setPopupKey((k) => k + 1);
      setShowPopup(true);
      if (newCombo >= 3) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 1000);
      }
      setTimeout(() => setShowPopup(false), 800);
      setFlash("correct");
      setTimeout(() => {
        setFlash(null);
        setQ(genQ(difficulty));
      }, 700);
    } else {
      setCombo(0);
      scoreRef.current = Math.max(0, scoreRef.current - 5);
      setScore(scoreRef.current);
      setFlash("wrong");
      setTimeout(() => setFlash(null), 400);
    }
  };

  const cols = q.count <= 10 ? 5 : q.count <= 20 ? 6 : 7;
  const cookieIndices = Array.from({ length: q.count }, (_, i) => i);

  return (
    <div className="flex flex-col items-center p-4 gap-4 pt-6">
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
      <div className="h-8 flex items-center justify-center">
        <ComboIndicator combo={combo} />
      </div>
      <p className="font-black text-xl text-[#1A1A2E]">How many cookies? 🍪</p>
      <div className="relative w-full max-w-sm">
        <div
          key={q.count}
          className={`w-full p-4 rounded-3xl shadow-md transition-colors ${
            flash === "correct"
              ? "bg-[#00C9A7]"
              : flash === "wrong"
                ? "bg-[#EF476F]"
                : "bg-white"
          }`}
        >
          <div
            className="grid gap-1"
            style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
          >
            {cookieIndices.map((cookieIdx) => (
              <span
                key={`cookie-${cookieIdx}`}
                className="text-2xl text-center"
                style={{ animationDelay: `${cookieIdx * 0.03}s` }}
              >
                🍪
              </span>
            ))}
          </div>
        </div>
        <ConfettiBurst active={showConfetti} />
        {showPopup && <ScorePopup key={popupKey} value={popupValue} />}
      </div>
      <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
        {q.choices.map((choice, idx) => (
          <button
            key={`${q.count}-${idx}`}
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
