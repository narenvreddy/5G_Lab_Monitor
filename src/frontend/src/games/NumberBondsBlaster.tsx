import React, { useCallback, useEffect, useRef, useState } from "react";
import type { GameProps } from "./types";

interface Bubble {
  id: number;
  value: number;
  x: number;
  y: number;
  dx: number;
  dy: number;
  selected: boolean;
  popping: boolean;
  wrong: boolean;
}

function getTarget(difficulty: number): number {
  if (difficulty === 0) return 10;
  if (difficulty === 1) return 10 + Math.floor(Math.random() * 11) + 5;
  return 25 + Math.floor(Math.random() * 26);
}

function generateBubbles(
  target: number,
  difficulty: number,
  count: number,
): Bubble[] {
  const maxVal = difficulty === 0 ? 9 : difficulty === 1 ? 19 : 49;
  const bubbles: Bubble[] = [];
  let id = 0;

  const a = 1 + Math.floor(Math.random() * Math.min(target - 1, maxVal));
  const b = target - a;
  if (b >= 1 && b <= maxVal) {
    bubbles.push(makeBubble(id++, a), makeBubble(id++, b));
  }

  while (bubbles.length < count) {
    const v = 1 + Math.floor(Math.random() * maxVal);
    bubbles.push(makeBubble(id++, v));
  }

  return bubbles;
}

function makeBubble(id: number, value: number): Bubble {
  return {
    id,
    value,
    x: 10 + Math.random() * 70,
    y: 15 + Math.random() * 65,
    dx: (Math.random() - 0.5) * 0.015,
    dy: (Math.random() - 0.5) * 0.015,
    selected: false,
    popping: false,
    wrong: false,
  };
}

export function NumberBondsBlaster({ difficulty, onGameOver }: GameProps) {
  const [target, setTarget] = useState(() => getTarget(difficulty));
  const [bubbles, setBubbles] = useState<Bubble[]>(() =>
    generateBubbles(getTarget(difficulty), difficulty, 10),
  );
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameOver, setGameOver] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [pairs, setPairs] = useState(0);
  const animRef = useRef<number>(0);
  const lastRef = useRef<number>(0);

  useEffect(() => {
    if (gameOver) return;
    function tick(ts: number) {
      if (!lastRef.current) lastRef.current = ts;
      const dt = ts - lastRef.current;
      lastRef.current = ts;
      setBubbles((prev) =>
        prev.map((b) => {
          if (b.popping || b.wrong) return b;
          let nx = b.x + b.dx * dt;
          let ny = b.y + b.dy * dt;
          let ndx = b.dx;
          let ndy = b.dy;
          if (nx < 3 || nx > 90) ndx = -ndx;
          if (ny < 10 || ny > 85) ndy = -ndy;
          nx = Math.max(3, Math.min(90, nx));
          ny = Math.max(10, Math.min(85, ny));
          return { ...b, x: nx, y: ny, dx: ndx, dy: ndy };
        }),
      );
      animRef.current = requestAnimationFrame(tick);
    }
    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, [gameOver]);

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

  const handleBubbleTap = useCallback(
    (id: number) => {
      if (gameOver) return;
      const bubble = bubbles.find((b) => b.id === id);
      if (!bubble || bubble.popping || bubble.wrong) return;

      if (selected === null) {
        setSelected(id);
        setBubbles((prev) =>
          prev.map((b) => (b.id === id ? { ...b, selected: true } : b)),
        );
      } else {
        if (selected === id) {
          setSelected(null);
          setBubbles((prev) =>
            prev.map((b) => (b.id === id ? { ...b, selected: false } : b)),
          );
          return;
        }
        const first = bubbles.find((b) => b.id === selected);
        const second = bubbles.find((b) => b.id === id);
        if (!first || !second) return;

        if (first.value + second.value === target) {
          const newScore = score + 10;
          setScore(newScore);
          const newPairs = pairs + 1;
          setPairs(newPairs);
          setBubbles((prev) =>
            prev.map((b) =>
              b.id === selected || b.id === id
                ? { ...b, popping: true, selected: false }
                : b,
            ),
          );
          setSelected(null);
          setTimeout(() => {
            const newTarget =
              difficulty > 0 && newPairs % 3 === 0
                ? getTarget(difficulty)
                : target;
            setTarget(newTarget);
            setBubbles((prev) => {
              const remaining = prev.filter(
                (b) => b.id !== selected && b.id !== id,
              );
              const newId1 = Date.now();
              const newId2 = Date.now() + 1;
              const maxVal = difficulty === 0 ? 9 : difficulty === 1 ? 19 : 49;
              return [
                ...remaining,
                makeBubble(newId1, 1 + Math.floor(Math.random() * maxVal)),
                makeBubble(newId2, 1 + Math.floor(Math.random() * maxVal)),
              ];
            });
          }, 500);
        } else {
          setBubbles((prev) =>
            prev.map((b) =>
              b.id === selected || b.id === id
                ? { ...b, wrong: true, selected: false }
                : b,
            ),
          );
          setSelected(null);
          setTimeout(() => {
            setBubbles((prev) =>
              prev.map((b) =>
                b.id === selected || b.id === id ? { ...b, wrong: false } : b,
              ),
            );
          }, 600);
        }
      }
    },
    [bubbles, selected, target, score, pairs, difficulty, gameOver],
  );

  return (
    <div className="relative w-full h-full min-h-[400px] select-none overflow-hidden bg-gradient-to-b from-[#1A1A2E] to-[#2D2B5E] rounded-2xl">
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 pt-3 pb-2 z-20">
        <div className="bg-white/20 rounded-xl px-3 py-1">
          <span className="text-white font-black text-sm">Make </span>
          <span className="text-[#FFD166] font-black text-xl">{target}</span>
        </div>
        <div className="bg-white/20 rounded-xl px-3 py-1 flex items-center gap-2">
          <span className="text-[#00C9A7] font-black text-lg">{score}</span>
          <span className="text-white/60 text-xs">pts</span>
        </div>
        <div className="bg-white/20 rounded-xl px-3 py-1">
          <span
            className={`font-black text-lg ${timeLeft <= 10 ? "text-[#EF476F]" : "text-white"}`}
          >
            {timeLeft}s
          </span>
        </div>
      </div>

      {bubbles.map((b) => (
        <button
          type="button"
          key={b.id}
          data-ocid="number_bonds.bubble.button"
          onClick={() => handleBubbleTap(b.id)}
          className={`absolute rounded-full flex items-center justify-center font-black text-lg transition-transform
            ${
              b.popping
                ? "scale-150 opacity-0 transition-all duration-500"
                : b.wrong
                  ? "scale-110 ring-4 ring-[#EF476F] bg-[#EF476F]/80 text-white"
                  : b.selected
                    ? "ring-4 ring-[#FFD166] bg-[#FFD166] text-[#1A1A2E] scale-110"
                    : "bg-[#5B4FCF] text-white hover:scale-105 active:scale-95"
            }
          `}
          style={{
            left: `${b.x}%`,
            top: `${b.y}%`,
            width: 64,
            height: 64,
            transform: `translate(-50%, -50%) ${b.popping ? "scale(1.5)" : b.selected ? "scale(1.1)" : "scale(1)"}`,
            boxShadow: b.selected
              ? "0 0 20px #FFD166"
              : "0 4px 12px rgba(0,0,0,0.3)",
          }}
        >
          {b.value}
        </button>
      ))}

      <div className="absolute bottom-3 left-0 right-0 text-center">
        <p className="text-white/50 text-xs">
          Tap two bubbles that add up to the target!
        </p>
      </div>
    </div>
  );
}
