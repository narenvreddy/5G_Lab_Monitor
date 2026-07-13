import React, { useCallback, useEffect, useRef, useState } from "react";
import type { GameProps } from "./types";

const CSS = `
@keyframes bossIn {
  0% { opacity: 0; transform: scale(0.4) rotate(-10deg); }
  60% { opacity: 1; transform: scale(1.15) rotate(4deg); }
  100% { opacity: 1; transform: scale(1) rotate(0deg); }
}
`;

interface FractionPair {
  a: [number, number];
  b: [number, number];
  largerIsA: boolean;
}

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

function generatePair(difficulty: number): FractionPair {
  const maxDen = difficulty === 0 ? 6 : difficulty === 1 ? 10 : 12;
  let a: [number, number] = [1, 2];
  let b: [number, number] = [1, 3];
  do {
    const denA = 2 + Math.floor(Math.random() * (maxDen - 1));
    const numA = 1 + Math.floor(Math.random() * (denA - 1));
    const gA = gcd(numA, denA);
    a = [numA / gA, denA / gA];

    const denB = 2 + Math.floor(Math.random() * (maxDen - 1));
    const numB = 1 + Math.floor(Math.random() * (denB - 1));
    const gB = gcd(numB, denB);
    b = [numB / gB, denB / gB];
  } while (a[0] / a[1] === b[0] / b[1]);

  return { a, b, largerIsA: a[0] / a[1] > b[0] / b[1] };
}

function FractionDisplay({ num, den }: { num: number; den: number }) {
  return (
    <div className="flex flex-col items-center leading-none">
      <span className="font-black text-4xl text-white">{num}</span>
      <span className="w-8 h-0.5 bg-white/80 my-1" />
      <span className="font-black text-4xl text-white">{den}</span>
    </div>
  );
}

export function FractionFiend({ difficulty, onGameOver }: GameProps) {
  const [introPhase, setIntroPhase] = useState(true);
  const [bossHp, setBossHp] = useState(100);
  const [timeLeft, setTimeLeft] = useState(45);
  const [correctCount, setCorrectCount] = useState(0);
  const [pair, setPair] = useState(() => generatePair(difficulty));
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
      onGameOver(correctCount * 30);
    }
  }, [gameResult, correctCount, onGameOver]);

  const handleTap = useCallback(
    (tappedA: boolean) => {
      if (flash !== null || gameResult !== null) return;
      const correct = tappedA === pair.largerIsA;
      if (correct) {
        setCorrectCount((c) => c + 1);
        setFlash("correct");
        setBossHp((hp) => {
          const newHp = Math.max(0, hp - 10);
          if (newHp <= 0) setGameResult("win");
          return newHp;
        });
        setTimeout(() => {
          setFlash(null);
          setPair(generatePair(difficulty));
        }, 400);
      } else {
        setFlash("wrong");
        setBossHp((hp) => Math.min(100, hp + 5));
        setTimeout(() => {
          setFlash(null);
          setPair(generatePair(difficulty));
        }, 500);
      }
    },
    [flash, gameResult, pair, difficulty],
  );

  const hpPct = bossHp / 100;
  const hpColor = hpPct > 0.6 ? "#00C9A7" : hpPct > 0.3 ? "#FFD166" : "#EF476F";

  return (
    <div className="flex flex-col min-h-[500px] bg-gradient-to-b from-[#1A1A2E] to-[#2D1A3D] p-4 relative">
      <style>{CSS}</style>

      {introPhase && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-[#EC4899] to-[#1A1A2E]">
          <div
            style={{
              animation: "bossIn 0.8s cubic-bezier(0.34,1.56,0.64,1) forwards",
            }}
          >
            <div className="text-8xl text-center mb-3">🧙</div>
            <div
              className="text-[#FFD166] font-black text-2xl text-center"
              style={{ fontFamily: "Nunito, sans-serif" }}
            >
              Fraction Fiend!
            </div>
            <div className="text-white/70 text-center mt-2 text-sm font-bold">
              Tap the LARGER fraction!
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-3xl">🧙</span>
          <div className="text-white font-black text-sm">Fraction Fiend</div>
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
          <span className="text-white/60">Fiend HP</span>
          <span className="text-white">{bossHp}/100</span>
        </div>
        <div className="w-full h-4 bg-white/20 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{ width: `${bossHp}%`, background: hpColor }}
          />
        </div>
      </div>

      {!gameResult && (
        <>
          <div className="text-white/70 text-center font-bold text-sm mb-4">
            Tap the <span className="text-[#FFD166]">LARGER</span> fraction
          </div>
          <div className="flex gap-4">
            {([true, false] as const).map((isA) => (
              <button
                key={String(isA)}
                type="button"
                onClick={() => handleTap(isA)}
                disabled={flash !== null}
                className={`flex-1 min-h-[120px] rounded-3xl flex items-center justify-center transition-all active:scale-95 disabled:opacity-60 ${
                  flash === "correct"
                    ? "bg-[#00C9A7]/30 border-2 border-[#00C9A7]"
                    : flash === "wrong"
                      ? "bg-[#EF476F]/30 border-2 border-[#EF476F]"
                      : "bg-white/15 hover:bg-white/25"
                }`}
              >
                <FractionDisplay
                  num={isA ? pair.a[0] : pair.b[0]}
                  den={isA ? pair.a[1] : pair.b[1]}
                />
              </button>
            ))}
          </div>
          <div className="text-white/40 text-center text-xs mt-3">vs</div>
        </>
      )}

      {gameResult && (
        <div className="flex-1 flex flex-col items-center justify-center text-center gap-4 py-8">
          <div className="text-7xl">{gameResult === "win" ? "💀" : "🧙"}</div>
          <div className="text-[#FFD166] font-black text-3xl">
            {gameResult === "win" ? "Fiend Defeated! ✨" : "Time's Up! 😢"}
          </div>
          <div className="bg-white/10 rounded-2xl px-8 py-4">
            <div className="text-white/60 font-bold text-sm">Final Score</div>
            <div className="text-[#FFD166] font-black text-5xl">
              {correctCount * 30}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
