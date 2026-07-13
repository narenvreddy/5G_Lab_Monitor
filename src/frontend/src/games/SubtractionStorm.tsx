import React, { useCallback, useEffect, useRef, useState } from "react";
import type { GameProps } from "./types";

const STORM_CSS = `
@keyframes cloudAppear {
  from { transform: scale(0.6); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
@keyframes cloudPop {
  0% { transform: scale(1); }
  50% { transform: scale(1.3); }
  100% { transform: scale(0); opacity: 0; }
}
@keyframes cloudWrong {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-6px); }
  75% { transform: translateX(6px); }
}
`;

interface Cloud {
  id: number;
  a: number;
  b: number;
  state: "idle" | "correct" | "wrong";
}

function genClouds(difficulty: number, targetAnswer: number): Cloud[] {
  const maxA = difficulty === 0 ? 10 : difficulty === 1 ? 20 : 30;
  const correct: Cloud = {
    id: 1,
    a:
      targetAnswer +
      Math.floor(Math.random() * Math.min(5, maxA - targetAnswer)),
    b: 0,
    state: "idle",
  };
  correct.b = correct.a - targetAnswer;
  const clouds: Cloud[] = [correct];
  let id = 2;
  while (clouds.length < 6) {
    const a = Math.max(2, Math.floor(Math.random() * maxA) + 1);
    const b = Math.floor(Math.random() * a);
    if (a - b !== targetAnswer) {
      clouds.push({ id: id++, a, b, state: "idle" });
    }
  }
  for (let i = clouds.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [clouds[i], clouds[j]] = [clouds[j], clouds[i]];
  }
  return clouds;
}

function genTarget(difficulty: number): number {
  const max = difficulty === 0 ? 9 : difficulty === 1 ? 18 : 27;
  return 1 + Math.floor(Math.random() * max);
}

const ROUND_TIME = 60;

export function SubtractionStorm({ difficulty, onGameOver }: GameProps) {
  const [target, setTarget] = useState(() => genTarget(difficulty));
  const [clouds, setClouds] = useState<Cloud[]>(() =>
    genClouds(difficulty, genTarget(difficulty)),
  );
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(ROUND_TIME);
  const [gameOver, setGameOver] = useState(false);
  const [answering, setAnswering] = useState(false);
  const targetRef = useRef(target);
  targetRef.current = target;

  useEffect(() => {
    if (gameOver) return;
    const id = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setGameOver(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [gameOver]);

  useEffect(() => {
    if (gameOver) onGameOver(score);
  }, [gameOver, score, onGameOver]);

  const advance = useCallback(() => {
    const newTarget = genTarget(difficulty);
    setTarget(newTarget);
    setClouds(genClouds(difficulty, newTarget));
    setAnswering(false);
  }, [difficulty]);

  const handleTap = (cloud: Cloud) => {
    if (gameOver || answering) return;
    const isCorrect = cloud.a - cloud.b === targetRef.current;
    setAnswering(true);
    if (isCorrect) {
      setScore((s) => s + 10);
      setClouds((prev) =>
        prev.map((c) => (c.id === cloud.id ? { ...c, state: "correct" } : c)),
      );
      setTimeout(() => advance(), 700);
    } else {
      setClouds((prev) =>
        prev.map((c) => (c.id === cloud.id ? { ...c, state: "wrong" } : c)),
      );
      setTimeout(() => {
        setClouds((prev) =>
          prev.map((c) => (c.id === cloud.id ? { ...c, state: "idle" } : c)),
        );
        setAnswering(false);
      }, 500);
    }
  };

  const timerPct = (timeLeft / ROUND_TIME) * 100;

  return (
    <div className="flex flex-col min-h-[480px] bg-gradient-to-b from-[#1E3A5F] to-[#2D5986] p-4 gap-4 select-none">
      <style>{STORM_CSS}</style>
      <div className="flex items-center justify-between">
        <div className="bg-white/20 rounded-xl px-3 py-1">
          <p className="text-white/70 text-xs">Score</p>
          <p className="text-[#FFD166] font-black text-2xl leading-tight">
            {score}
          </p>
        </div>
        <div className="flex-1 mx-4">
          <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${timerPct > 50 ? "bg-[#00C9A7]" : timerPct > 20 ? "bg-[#FFD166]" : "bg-[#EF476F]"}`}
              style={{ width: `${timerPct}%` }}
            />
          </div>
          <p className="text-center text-white/60 text-xs mt-1">
            {timeLeft}s left
          </p>
        </div>
      </div>

      <div className="bg-white/15 rounded-3xl p-4 text-center">
        <p className="text-white/70 font-bold text-sm">
          Find the cloud that equals:
        </p>
        <p className="text-[#FFD166] font-black text-5xl">{target}</p>
      </div>

      <div className="grid grid-cols-2 gap-3 flex-1">
        {clouds.map((cloud) => (
          <button
            type="button"
            key={cloud.id}
            data-ocid="subtraction_storm.cloud.button"
            onClick={() => handleTap(cloud)}
            style={{
              animation:
                cloud.state === "correct"
                  ? "cloudPop 0.6s ease forwards"
                  : cloud.state === "wrong"
                    ? "cloudWrong 0.4s ease"
                    : "cloudAppear 0.3s ease",
            }}
            className={`py-5 rounded-2xl font-black text-xl shadow-lg min-h-[44px] transition-colors active:scale-95 ${
              cloud.state === "correct"
                ? "bg-[#00C9A7] text-white"
                : cloud.state === "wrong"
                  ? "bg-[#EF476F] text-white"
                  : "bg-white/90 text-[#1A1A2E]"
            }`}
          >
            ⛈️ {cloud.a} − {cloud.b}
          </button>
        ))}
      </div>
    </div>
  );
}
