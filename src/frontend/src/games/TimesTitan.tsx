import React, { useCallback, useEffect, useRef, useState } from "react";
import type { GameProps } from "./types";

const CSS = `
@keyframes bossIn {
  0% { opacity: 0; transform: scale(0.4) rotate(-10deg); }
  60% { opacity: 1; transform: scale(1.15) rotate(4deg); }
  100% { opacity: 1; transform: scale(1) rotate(0deg); }
}
`;

interface Question {
  display: string;
  answer: number;
  choices: number[];
}

function makeChoices(answer: number): number[] {
  const set = new Set<number>([answer]);
  while (set.size < 3) {
    const offset = [-6, -3, -2, 2, 3, 6, 8, -8][Math.floor(Math.random() * 8)];
    const c = answer + offset;
    if (c > 0) set.add(c);
  }
  return [...set].sort(() => Math.random() - 0.5);
}

function generateQuestion(difficulty: number): Question {
  const maxTable = difficulty === 0 ? 5 : difficulty === 1 ? 9 : 12;
  const a = 2 + Math.floor(Math.random() * (maxTable - 1));
  const b = 2 + Math.floor(Math.random() * (maxTable - 1));
  return { display: `${a} × ${b}`, answer: a * b, choices: makeChoices(a * b) };
}

export function TimesTitan({ difficulty, onGameOver }: GameProps) {
  const [introPhase, setIntroPhase] = useState(true);
  const [bossHp, setBossHp] = useState(100);
  const [timeLeft, setTimeLeft] = useState(45);
  const [correctCount, setCorrectCount] = useState(0);
  const [question, setQuestion] = useState(() => generateQuestion(difficulty));
  const [flash, setFlash] = useState<"correct" | "wrong" | null>(null);
  const [gameResult, setGameResult] = useState<"win" | "lose" | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastAnswerTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    const t = setTimeout(() => setIntroPhase(false), 1200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (introPhase || gameResult !== null) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setGameResult("lose");
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
      const speedBonus = correctCount * 5;
      const finalScore = correctCount * 30 + speedBonus;
      onGameOver(finalScore);
    }
  }, [gameResult, correctCount, onGameOver]);

  const handleAnswer = useCallback(
    (choice: number) => {
      if (flash !== null || gameResult !== null) return;
      const now = Date.now();
      const elapsed = (now - lastAnswerTimeRef.current) / 1000;
      lastAnswerTimeRef.current = now;

      if (choice === question.answer) {
        setCorrectCount((c) => c + 1);
        setFlash("correct");
        setBossHp((hp) => {
          const newHp = Math.max(0, hp - 10);
          if (newHp <= 0) setGameResult("win");
          return newHp;
        });
        setTimeout(() => {
          setFlash(null);
          setQuestion(generateQuestion(difficulty));
        }, 300);
      } else {
        setFlash("wrong");
        setBossHp((hp) => Math.min(100, hp + 5));
        setTimeout(() => {
          setFlash(null);
          setQuestion(generateQuestion(difficulty));
        }, 400);
      }
      void elapsed;
    },
    [flash, gameResult, question, difficulty],
  );

  const hpPct = bossHp / 100;
  const hpColor = hpPct > 0.6 ? "#00C9A7" : hpPct > 0.3 ? "#FFD166" : "#EF476F";

  return (
    <div className="flex flex-col min-h-[500px] bg-gradient-to-b from-[#1A1A2E] to-[#1A2E3D] p-4 relative">
      <style>{CSS}</style>

      {introPhase && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-[#F59E0B] to-[#1A1A2E]">
          <div
            style={{
              animation: "bossIn 0.8s cubic-bezier(0.34,1.56,0.64,1) forwards",
            }}
          >
            <div className="text-8xl text-center mb-3">🦾</div>
            <div
              className="text-[#FFD166] font-black text-2xl text-center"
              style={{ fontFamily: "Nunito, sans-serif" }}
            >
              Times Titan!
            </div>
            <div className="text-white/70 text-center mt-2 text-sm font-bold">
              Answer multiplication fast!
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-3xl">🦾</span>
          <div className="text-white font-black text-sm">Times Titan</div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <div
            className={`font-black text-lg ${timeLeft <= 10 ? "text-[#EF476F] animate-pulse" : "text-white"}`}
          >
            ⏱ {timeLeft}s
          </div>
          <div className="text-[#FFD166] font-black text-sm">
            ✅ {correctCount}
          </div>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-xs font-bold mb-1">
          <span className="text-white/60">Boss HP</span>
          <span className="text-white">{bossHp}/100</span>
        </div>
        <div className="w-full h-4 bg-white/20 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{ width: `${bossHp}%`, background: hpColor }}
          />
        </div>
        {flash === "wrong" && (
          <div className="text-[#EF476F] text-xs font-bold mt-1 text-center">
            Boss healed +5! ❤️‍🔥
          </div>
        )}
      </div>

      {!gameResult && (
        <>
          <div
            className={`bg-white/10 rounded-2xl px-4 py-6 mb-4 text-center ${flash === "wrong" ? "border-2 border-[#EF476F]" : flash === "correct" ? "border-2 border-[#00C9A7]" : ""}`}
          >
            <div className="text-white font-black text-5xl tracking-wide">
              {question.display}
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
        </>
      )}

      {gameResult && (
        <div className="flex-1 flex flex-col items-center justify-center text-center gap-4 py-8">
          <div className="text-7xl">{gameResult === "win" ? "💀" : "🦾"}</div>
          <div className="text-[#FFD166] font-black text-3xl">
            {gameResult === "win" ? "Titan Toppled! 💥" : "Time's Up! 😢"}
          </div>
          <div className="bg-white/10 rounded-2xl px-8 py-4">
            <div className="text-white/60 font-bold text-sm">Final Score</div>
            <div className="text-[#FFD166] font-black text-5xl">
              {correctCount * 30 + correctCount * 5}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
