import React, { useCallback, useEffect, useRef, useState } from "react";
import type { GameProps } from "./types";

const BOSS_INTRO_CSS = `
@keyframes bossIn {
  0% { opacity: 0; transform: scale(0.4) rotate(-10deg); }
  60% { opacity: 1; transform: scale(1.15) rotate(4deg); }
  100% { opacity: 1; transform: scale(1) rotate(0deg); }
}
@keyframes wrongShake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-8px); }
  75% { transform: translateX(8px); }
}
`;

const HP_SLOTS = [0, 1, 2, 3, 4];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateNumbers(difficulty: number): number[] {
  const count = 5;
  const max = difficulty === 0 ? 20 : difficulty === 1 ? 50 : 100;
  const nums = new Set<number>();
  while (nums.size < count) {
    nums.add(1 + Math.floor(Math.random() * max));
  }
  return shuffle([...nums]);
}

export function NumberNemesis({ difficulty, onGameOver }: GameProps) {
  const [introPhase, setIntroPhase] = useState(true);
  const [numbers, setNumbers] = useState(() => generateNumbers(difficulty));
  const [bossHp, setBossHp] = useState(5);
  const [timeLeft, setTimeLeft] = useState(90);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number[]>([]);
  const [flash, setFlash] = useState<"correct" | "wrong" | null>(null);
  const [gameResult, setGameResult] = useState<"win" | "lose" | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

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
      onGameOver(score);
    }
  }, [gameResult, score, onGameOver]);

  const sorted = [...numbers].sort((a, b) => a - b);

  const handleTap = useCallback(
    (num: number) => {
      if (flash !== null || gameResult !== null) return;
      const nextExpected = sorted[selected.length];
      if (num === nextExpected) {
        const newSelected = [...selected, num];
        setSelected(newSelected);
        setFlash("correct");
        if (newSelected.length === numbers.length) {
          const newHp = bossHp - 1;
          setBossHp(newHp);
          const newScore = score + 50 + Math.floor(timeLeft * 0.5);
          setScore(newScore);
          if (newHp <= 0) {
            setGameResult("win");
          } else {
            setTimeout(() => {
              setNumbers(generateNumbers(difficulty));
              setSelected([]);
              setFlash(null);
            }, 600);
          }
        } else {
          setTimeout(() => setFlash(null), 300);
        }
      } else {
        setFlash("wrong");
        setTimeout(() => {
          setSelected([]);
          setFlash(null);
        }, 600);
      }
    },
    [
      flash,
      gameResult,
      selected,
      sorted,
      numbers,
      bossHp,
      score,
      timeLeft,
      difficulty,
    ],
  );

  const hpColor = bossHp >= 4 ? "#00C9A7" : bossHp >= 2 ? "#FFD166" : "#EF476F";

  return (
    <div className="flex flex-col min-h-[500px] bg-gradient-to-b from-[#1A1A2E] to-[#2D1A4E] p-4 relative">
      <style>{BOSS_INTRO_CSS}</style>

      {introPhase && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-[#5B4FCF] to-[#1A1A2E]">
          <div
            style={{
              animation: "bossIn 0.8s cubic-bezier(0.34,1.56,0.64,1) forwards",
            }}
          >
            <div className="text-8xl text-center mb-3">👹</div>
            <div
              className="text-[#FFD166] font-black text-2xl text-center"
              style={{ fontFamily: "Nunito, sans-serif" }}
            >
              Number Nemesis!
            </div>
            <div className="text-white/70 text-center mt-2 text-sm font-bold">
              Tap numbers in order!
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-3xl">👹</span>
          <div>
            <div className="text-white font-black text-sm">Number Nemesis</div>
            <div className="flex gap-1">
              {HP_SLOTS.map((slot) => (
                <span key={slot} className="text-sm">
                  {slot < bossHp ? "❤️" : "🖤"}
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

      <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden mb-4">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${(bossHp / 5) * 100}%`, background: hpColor }}
        />
      </div>

      {!gameResult && (
        <>
          <div className="text-white/70 text-center font-bold text-sm mb-3">
            Tap in ascending order:{" "}
            <span className="text-[#FFD166]">
              {selected.length}/{numbers.length}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-3 mt-2">
            {numbers.map((num) => {
              const isSelected = selected.includes(num);
              return (
                <button
                  key={num}
                  type="button"
                  onClick={() => handleTap(num)}
                  disabled={isSelected || flash !== null}
                  className="min-h-[56px] rounded-2xl font-black text-2xl transition-all active:scale-95"
                  style={{
                    background: isSelected
                      ? "rgba(0,201,167,0.3)"
                      : "rgba(255,255,255,0.15)",
                    color: isSelected ? "#00C9A7" : "white",
                    animation:
                      flash === "wrong" && !isSelected
                        ? "wrongShake 0.4s ease"
                        : undefined,
                  }}
                >
                  {isSelected ? "✓" : num}
                </button>
              );
            })}
          </div>
        </>
      )}

      {gameResult && (
        <div className="flex-1 flex flex-col items-center justify-center text-center gap-4 py-8">
          <div className="text-7xl">{gameResult === "win" ? "💀" : "👹"}</div>
          <div className="text-[#FFD166] font-black text-3xl">
            {gameResult === "win" ? "Boss Defeated! 🎉" : "Time's Up! 😢"}
          </div>
          <div className="bg-white/10 rounded-2xl px-8 py-4">
            <div className="text-white/60 font-bold text-sm">Final Score</div>
            <div className="text-[#FFD166] font-black text-5xl">{score}</div>
          </div>
        </div>
      )}
    </div>
  );
}
