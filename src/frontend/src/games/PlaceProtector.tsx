import React, { useCallback, useEffect, useRef, useState } from "react";
import type { GameProps } from "./types";

const CSS = `
@keyframes bossIn {
  0% { opacity: 0; transform: scale(0.4) rotate(-10deg); }
  60% { opacity: 1; transform: scale(1.15) rotate(4deg); }
  100% { opacity: 1; transform: scale(1) rotate(0deg); }
}
`;

const SHIELD_SLOTS = [0, 1, 2, 3, 4];

interface Question {
  number: number;
  place: "hundreds" | "tens" | "ones";
  answer: number;
  choices: number[];
}

function generateQuestion(): Question {
  const num = 100 + Math.floor(Math.random() * 900);
  const places: Array<"hundreds" | "tens" | "ones"> = [
    "hundreds",
    "tens",
    "ones",
  ];
  const place = places[Math.floor(Math.random() * 3)];
  const digits = {
    hundreds: Math.floor(num / 100),
    tens: Math.floor((num % 100) / 10),
    ones: num % 10,
  };
  const answer = digits[place];
  const set = new Set<number>([answer]);
  while (set.size < 3) {
    const c = Math.floor(Math.random() * 10);
    set.add(c);
  }
  return {
    number: num,
    place,
    answer,
    choices: [...set].sort(() => Math.random() - 0.5),
  };
}

export function PlaceProtector({ difficulty, onGameOver }: GameProps) {
  const [introPhase, setIntroPhase] = useState(true);
  const [shields, setShields] = useState(5);
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [question, setQuestion] = useState(() => generateQuestion());
  const [flash, setFlash] = useState<"correct" | "wrong" | null>(null);
  const [gameResult, setGameResult] = useState<"win" | "lose" | "end" | null>(
    null,
  );
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  void difficulty;

  useEffect(() => {
    const t = setTimeout(() => setIntroPhase(false), 1200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (introPhase || gameResult !== null) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setGameResult("end");
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [introPhase, gameResult]);

  useEffect(() => {
    if (gameResult !== null) {
      if (timerRef.current) clearInterval(timerRef.current);
      onGameOver(Math.max(0, score));
    }
  }, [gameResult, score, onGameOver]);

  const handleAnswer = useCallback(
    (choice: number) => {
      if (flash !== null || gameResult !== null) return;
      if (choice === question.answer) {
        setScore((s) => s + 40);
        setFlash("correct");
        setTimeout(() => {
          setFlash(null);
          setQuestion(generateQuestion());
        }, 400);
      } else {
        setWrongCount((w) => w + 1);
        setScore((s) => s - 20);
        setShields((sh) => {
          const newSh = sh - 1;
          if (newSh <= 0) setGameResult("lose");
          return Math.max(0, newSh);
        });
        setFlash("wrong");
        setTimeout(() => {
          setFlash(null);
          setQuestion(generateQuestion());
        }, 500);
      }
    },
    [flash, gameResult, question],
  );

  const placeLabel = { hundreds: "HUNDREDS", tens: "TENS", ones: "ONES" }[
    question.place
  ];

  return (
    <div className="flex flex-col min-h-[500px] bg-gradient-to-b from-[#1A1A2E] to-[#1A2D2E] p-4 relative">
      <style>{CSS}</style>

      {introPhase && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-[#14B8A6] to-[#1A1A2E]">
          <div
            style={{
              animation: "bossIn 0.8s cubic-bezier(0.34,1.56,0.64,1) forwards",
            }}
          >
            <div className="text-8xl text-center mb-3">🏰</div>
            <div
              className="text-[#FFD166] font-black text-2xl text-center"
              style={{ fontFamily: "Nunito, sans-serif" }}
            >
              Place Protector!
            </div>
            <div className="text-white/70 text-center mt-2 text-sm font-bold">
              Defend the castle!
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-3xl">🏰</span>
          <div>
            <div className="text-white font-black text-sm">Place Protector</div>
            <div className="flex gap-1">
              {SHIELD_SLOTS.map((slot) => (
                <span key={slot} className="text-sm">
                  {slot < shields ? "🛡️" : "💔"}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <div
            className={`font-black text-lg ${timeLeft <= 10 ? "text-[#EF476F] animate-pulse" : "text-white"}`}
          >
            ⏱ {timeLeft}s
          </div>
          <div className="text-[#FFD166] font-black text-sm">⭐ {score}</div>
        </div>
      </div>

      {!gameResult && (
        <>
          <div
            className={`bg-white/10 rounded-2xl px-4 py-5 mb-4 text-center ${flash === "wrong" ? "border-2 border-[#EF476F]" : flash === "correct" ? "border-2 border-[#00C9A7]" : ""}`}
          >
            <div className="text-white/60 font-bold text-sm mb-1">
              What digit is in the
            </div>
            <div className="text-[#FFD166] font-black text-xl mb-2">
              {placeLabel} place?
            </div>
            <div className="text-white font-black text-6xl tracking-widest">
              {question.number}
            </div>
          </div>
          <div className="flex gap-3">
            {question.choices.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => handleAnswer(c)}
                disabled={flash !== null}
                className="flex-1 min-h-[56px] rounded-2xl font-black text-2xl text-white bg-white/15 active:scale-95 transition-transform disabled:opacity-60"
              >
                {c}
              </button>
            ))}
          </div>
          {wrongCount > 0 && (
            <div className="text-[#EF476F] text-xs font-bold text-center mt-3">
              Wrong answers: {wrongCount} ⚠️
            </div>
          )}
        </>
      )}

      {gameResult && (
        <div className="flex-1 flex flex-col items-center justify-center text-center gap-4 py-8">
          <div className="text-7xl">{gameResult === "lose" ? "🏚️" : "🏰"}</div>
          <div className="text-[#FFD166] font-black text-3xl">
            {gameResult === "lose" ? "Castle Fell! 😢" : "Time's Up! 🎉"}
          </div>
          <div className="bg-white/10 rounded-2xl px-8 py-4">
            <div className="text-white/60 font-bold text-sm">Final Score</div>
            <div className="text-[#FFD166] font-black text-5xl">
              {Math.max(0, score)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
