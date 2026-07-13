import React, { useCallback, useEffect, useState } from "react";
import type { GameProps } from "./types";

const SHAPE_CSS = `
@keyframes shapeIn {
  from { transform: scale(0.5) rotate(-20deg); opacity: 0; }
  to { transform: scale(1) rotate(0deg); opacity: 1; }
}
@keyframes shapeCorrect {
  0% { transform: scale(1); }
  50% { transform: scale(1.3); }
  100% { transform: scale(1); }
}
`;

type ShapeType =
  | "circle"
  | "square"
  | "triangle"
  | "star"
  | "pentagon"
  | "diamond"
  | "heart";

const SHAPES: ShapeType[] = [
  "circle",
  "square",
  "triangle",
  "star",
  "pentagon",
  "diamond",
  "heart",
];
const SHAPE_EMOJI: Record<ShapeType, string> = {
  circle: "🔵",
  square: "🟦",
  triangle: "🔺",
  star: "⭐",
  pentagon: "🔷",
  diamond: "💎",
  heart: "❤️",
};

function generateSequence(length: number): ShapeType[] {
  const poolSize = 2 + Math.floor(Math.random() * 2);
  const pool = [...SHAPES].sort(() => Math.random() - 0.5).slice(0, poolSize);
  return Array.from({ length }, (_, i) => pool[i % pool.length]);
}

function generateQuestion(difficulty: number) {
  const length = difficulty === 0 ? 4 : difficulty === 1 ? 5 : 6;
  const seq = generateSequence(length);
  const blankIdx = 1 + Math.floor(Math.random() * (length - 2));
  const answer = seq[blankIdx];
  const others = SHAPES.filter((s) => s !== answer);
  const shuffled = others.sort(() => Math.random() - 0.5);
  const choices = [answer, ...shuffled.slice(0, 3)].sort(
    () => Math.random() - 0.5,
  );
  return { seq, blankIdx, answer, choices };
}

const TOTAL_ROUNDS = 10;

export function ShapeShifter({ difficulty, onGameOver }: GameProps) {
  const [roundNum, setRoundNum] = useState(0);
  const [question, setQuestion] = useState(() => generateQuestion(difficulty));
  const [score, setScore] = useState(0);
  const [flash, setFlash] = useState<"correct" | "wrong" | null>(null);
  const [chosenShape, setChosenShape] = useState<ShapeType | null>(null);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (gameOver) onGameOver(score);
  }, [gameOver, score, onGameOver]);

  const nextRound = useCallback(() => {
    const next = roundNum + 1;
    if (next >= TOTAL_ROUNDS) {
      setGameOver(true);
    } else {
      setRoundNum(next);
      setQuestion(generateQuestion(difficulty));
      setFlash(null);
      setChosenShape(null);
    }
  }, [roundNum, difficulty]);

  const handleChoice = (shape: ShapeType) => {
    if (flash !== null || gameOver) return;
    setChosenShape(shape);
    if (shape === question.answer) {
      setFlash("correct");
      setScore((s) => s + 10);
      setTimeout(() => nextRound(), 900);
    } else {
      setFlash("wrong");
      setTimeout(() => {
        setFlash(null);
        setChosenShape(null);
      }, 600);
    }
  };

  return (
    <div className="flex flex-col min-h-[500px] bg-gradient-to-b from-[#F4F2FF] to-[#E8E4FF] p-4 gap-5 select-none">
      <style>{SHAPE_CSS}</style>
      <div className="flex justify-between items-center">
        <span className="bg-[#5B4FCF] text-white font-black text-sm px-3 py-1 rounded-xl">
          {roundNum + 1}/{TOTAL_ROUNDS}
        </span>
        <span className="bg-[#FFD166] text-[#1A1A2E] font-black text-lg px-4 py-1 rounded-xl">
          ⭐ {score}
        </span>
      </div>

      <div className="text-center">
        <p className="font-black text-xl text-[#1A1A2E]">
          What shape comes next?
        </p>
        <p className="text-[#6B6B8A] text-sm">
          Find the missing shape in the pattern
        </p>
      </div>

      <div className="bg-white rounded-3xl p-4 shadow-md">
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {question.seq.map((shape, i) => (
            <div
              key={`seq-${i}-${shape}`}
              style={{ animation: "shapeIn 0.3s ease forwards" }}
              className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl font-black border-2 ${
                i === question.blankIdx
                  ? "border-[#5B4FCF] bg-[#5B4FCF]/10 text-[#5B4FCF]"
                  : "border-[#1A1A2E]/10 bg-[#F4F2FF]"
              }`}
            >
              {i === question.blankIdx
                ? flash === "correct"
                  ? SHAPE_EMOJI[question.answer]
                  : "?"
                : SHAPE_EMOJI[shape]}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {question.choices.map((shape) => {
          const isChosen = chosenShape === shape;
          const isAnswer = shape === question.answer;
          return (
            <button
              type="button"
              key={shape}
              data-ocid="shape_shifter.choice.button"
              onClick={() => handleChoice(shape)}
              style={{
                animation:
                  isChosen && flash === "correct"
                    ? "shapeCorrect 0.4s ease"
                    : undefined,
              }}
              className={`py-5 rounded-2xl text-3xl font-bold shadow-md min-h-[44px] transition-all active:scale-95 flex items-center justify-center gap-2 ${
                isChosen && flash === "correct"
                  ? "bg-[#00C9A7] text-white scale-105"
                  : isChosen && flash === "wrong"
                    ? "bg-[#EF476F] text-white"
                    : flash === "correct" && isAnswer
                      ? "bg-[#00C9A7] text-white"
                      : "bg-white text-[#1A1A2E] border-2 border-[#1A1A2E]/10 hover:border-[#5B4FCF]"
              }`}
            >
              {SHAPE_EMOJI[shape]}
              <span className="text-base capitalize">{shape}</span>
            </button>
          );
        })}
      </div>

      {flash === "correct" && (
        <p className="text-center font-black text-2xl text-[#00C9A7]">
          ✅ Correct!
        </p>
      )}
      {flash === "wrong" && (
        <p className="text-center font-black text-2xl text-[#EF476F]">
          ❌ Not quite!
        </p>
      )}
    </div>
  );
}
