import React, { useCallback, useEffect, useRef, useState } from "react";
import type { GameProps } from "./types";

const ROCK_CSS = `
@keyframes rockPop {
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.5); opacity: 0.5; }
  100% { transform: scale(0); opacity: 0; }
}
@keyframes rockWrong {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-8px); }
  75% { transform: translateX(8px); }
}
`;

interface Rock {
  id: number;
  a: number;
  b: number;
  col: number;
  y: number;
  state: "falling" | "popping" | "wrong";
}

const COL_IDS = ["lane-left", "lane-mid", "lane-right"];
const COL_COLORS = ["#5B4FCF", "#FF6B35", "#00C9A7"];

function genTarget(difficulty: number) {
  const max = difficulty === 0 ? 10 : difficulty === 1 ? 20 : 30;
  return 2 + Math.floor(Math.random() * (max - 1));
}

function genRock(
  id: number,
  target: number,
  difficulty: number,
  isCorrect: boolean,
): Rock {
  const max = difficulty === 0 ? 9 : difficulty === 1 ? 19 : 29;
  let a: number;
  let b: number;
  if (isCorrect) {
    a = 1 + Math.floor(Math.random() * (target - 1));
    b = target - a;
  } else {
    do {
      a = 1 + Math.floor(Math.random() * Math.min(max, target + 5));
      b = 1 + Math.floor(Math.random() * Math.min(max, target + 5));
    } while (a + b === target);
  }
  return {
    id,
    a,
    b,
    col: Math.floor(Math.random() * 3),
    y: 0,
    state: "falling",
  };
}

const FALL_SPEED_BASE = 0.008;
const ROCK_INTERVAL_BASE = 2000;

export function AdditionAvalanche({ difficulty, onGameOver }: GameProps) {
  const [target, setTarget] = useState(() => genTarget(difficulty));
  const [rocks, setRocks] = useState<Rock[]>([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const idRef = useRef(0);
  const rockRef = useRef<Rock[]>([]);
  const targetRef = useRef(target);
  const scoreRef = useRef(0);
  const livesRef = useRef(3);
  const gameOverRef = useRef(false);
  const animRef = useRef<number>(0);
  const lastRef = useRef<number>(0);
  const spawnRef = useRef<ReturnType<typeof setInterval> | null>(null);

  targetRef.current = target;
  scoreRef.current = score;
  livesRef.current = lives;
  gameOverRef.current = gameOver;

  const spawnRock = useCallback(() => {
    if (gameOverRef.current) return;
    const t = targetRef.current;
    const shouldBeCorrect = Math.random() < 0.4;
    const id = ++idRef.current;
    const newRock = genRock(id, t, difficulty, shouldBeCorrect);
    rockRef.current = [...rockRef.current, newRock];
    setRocks([...rockRef.current]);
  }, [difficulty]);

  useEffect(() => {
    const interval = Math.max(800, ROCK_INTERVAL_BASE - difficulty * 400);
    spawnRef.current = setInterval(spawnRock, interval);
    return () => {
      if (spawnRef.current) clearInterval(spawnRef.current);
    };
  }, [spawnRock, difficulty]);

  useEffect(() => {
    const speed = FALL_SPEED_BASE * (1 + difficulty * 0.5);
    function tick(ts: number) {
      if (gameOverRef.current) return;
      if (!lastRef.current) lastRef.current = ts;
      const dt = ts - lastRef.current;
      lastRef.current = ts;
      const updated = rockRef.current.map((r) => {
        if (r.state !== "falling") return r;
        const ny = r.y + speed * dt;
        if (ny >= 95) return { ...r, y: 95, state: "falling" as const };
        return { ...r, y: ny };
      });
      const fallen = updated.filter((r) => r.y >= 95 && r.state === "falling");
      if (fallen.length > 0) {
        const newLives = Math.max(0, livesRef.current - fallen.length);
        livesRef.current = newLives;
        const remaining = updated.filter(
          (r) => r.y < 95 || r.state !== "falling",
        );
        rockRef.current = remaining;
        setLives(newLives);
        setRocks([...remaining]);
        if (newLives <= 0) {
          gameOverRef.current = true;
          setGameOver(true);
          return;
        }
      } else {
        rockRef.current = updated;
        setRocks([...updated]);
      }
      animRef.current = requestAnimationFrame(tick);
    }
    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [difficulty]);

  useEffect(() => {
    if (gameOver) onGameOver(score);
  }, [gameOver, score, onGameOver]);

  useEffect(() => {
    const poppingRocks = rocks.filter(
      (r) => r.state === "popping" || r.state === "wrong",
    );
    if (poppingRocks.length === 0) return;
    const t = setTimeout(() => {
      const updated = rockRef.current.filter(
        (r) => r.state !== "popping" && r.state !== "wrong",
      );
      rockRef.current = updated;
      setRocks([...updated]);
    }, 500);
    return () => clearTimeout(t);
  }, [rocks]);

  const handleTapRock = (id: number) => {
    if (gameOver) return;
    const rock = rockRef.current.find((r) => r.id === id);
    if (!rock || rock.state !== "falling") return;
    const isCorrect = rock.a + rock.b === targetRef.current;
    if (isCorrect) {
      const newScore = scoreRef.current + 10;
      scoreRef.current = newScore;
      setScore(newScore);
      const updated = rockRef.current.map((r) =>
        r.id === id ? { ...r, state: "popping" as const } : r,
      );
      rockRef.current = updated;
      setRocks([...updated]);
      if (newScore % 50 === 0) {
        const newT = genTarget(difficulty);
        targetRef.current = newT;
        setTarget(newT);
      }
    } else {
      const newScore = Math.max(0, scoreRef.current - 5);
      scoreRef.current = newScore;
      setScore(newScore);
      const updated = rockRef.current.map((r) =>
        r.id === id ? { ...r, state: "wrong" as const } : r,
      );
      rockRef.current = updated;
      setRocks([...updated]);
    }
  };

  return (
    <div className="flex flex-col h-full min-h-[500px] bg-gradient-to-b from-[#1A1A2E] to-[#2D1A4E] select-none overflow-hidden relative">
      <style>{ROCK_CSS}</style>
      <div className="flex items-center justify-between px-4 pt-3 pb-2 z-10">
        <div className="bg-white/20 rounded-xl px-3 py-1">
          <span className="text-white/70 text-xs">Target sum</span>
          <div className="text-[#FFD166] font-black text-2xl leading-tight">
            {target}
          </div>
        </div>
        <div className="flex gap-1">
          {["h1", "h2", "h3"].map((hk, i) => (
            <span
              key={hk}
              className={`text-2xl ${i + 1 <= lives ? "" : "opacity-20"}`}
            >
              ❤️
            </span>
          ))}
        </div>
        <div className="bg-white/20 rounded-xl px-3 py-1 text-right">
          <span className="text-white/70 text-xs">Score</span>
          <div className="text-[#00C9A7] font-black text-2xl leading-tight">
            {score}
          </div>
        </div>
      </div>

      <p className="text-center text-white/50 text-xs mb-1">
        Tap rocks that add up to the target!
      </p>

      <div className="relative flex-1 flex">
        {COL_IDS.map((colId, col) => (
          <div key={colId} className="flex-1 relative border-x border-white/5">
            {rocks
              .filter((r) => r.col === col)
              .map((r) => (
                <button
                  type="button"
                  key={r.id}
                  data-ocid="addition_avalanche.rock.button"
                  onClick={() => handleTapRock(r.id)}
                  style={{
                    position: "absolute",
                    top: `${r.y}%`,
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    background:
                      r.state === "popping"
                        ? "#00C9A7"
                        : r.state === "wrong"
                          ? "#EF476F"
                          : COL_COLORS[col],
                    animation:
                      r.state === "popping"
                        ? "rockPop 0.5s ease forwards"
                        : r.state === "wrong"
                          ? "rockWrong 0.4s ease"
                          : undefined,
                  }}
                  className="w-16 h-16 rounded-2xl text-white font-black text-base shadow-lg active:scale-90 flex items-center justify-center min-h-[44px] min-w-[44px]"
                >
                  {r.a} + {r.b}
                </button>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}
