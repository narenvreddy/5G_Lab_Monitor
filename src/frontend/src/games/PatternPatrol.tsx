import React, { useCallback, useEffect, useRef, useState } from "react";
import type { GameProps } from "./types";

interface Question {
  sequence: (number | null)[];
  answer: number;
  choices: number[];
  blankIndex: number;
}

function generateQuestion(difficulty: number, qNum: number): Question {
  if (difficulty === 0) {
    const step = Math.random() < 0.5 ? 2 : 5;
    const start = 1 + Math.floor(Math.random() * 10);
    const length = 5;
    const seq = Array.from({ length }, (_, i) => start + i * step);
    const blankIndex = 1 + Math.floor(Math.random() * (length - 2));
    const answer = seq[blankIndex];
    const choices = shuffleChoices(answer, seq, 1, 50);
    const display: (number | null)[] = seq.map((v, i) =>
      i === blankIndex ? null : v,
    );
    return { sequence: display, answer, choices, blankIndex };
  }
  if (difficulty === 1) {
    const mult = 2 + Math.floor(Math.random() * 2);
    const start = 1 + Math.floor(Math.random() * 5);
    const length = 5;
    const seq = Array.from({ length }, (_, i) => start * mult ** i);
    const blankIndex = 1 + Math.floor(Math.random() * (length - 2));
    const answer = Math.round(seq[blankIndex]);
    const choices = shuffleChoices(answer, seq.map(Math.round), 1, 200);
    const display: (number | null)[] = seq.map((v, i) =>
      i === blankIndex ? null : Math.round(v),
    );
    return { sequence: display, answer, choices, blankIndex };
  }
  // Mixed: vary each question
  const types = ["add", "mult", "sub"];
  const t = types[qNum % types.length];
  if (t === "add") {
    const step = 3 + Math.floor(Math.random() * 7);
    const start = 5 + Math.floor(Math.random() * 20);
    const length = 5;
    const seq = Array.from({ length }, (_, i) => start + i * step);
    const blankIndex = 1 + Math.floor(Math.random() * (length - 2));
    const answer = seq[blankIndex];
    const choices = shuffleChoices(answer, seq, 1, 100);
    const display: (number | null)[] = seq.map((v, i) =>
      i === blankIndex ? null : v,
    );
    return { sequence: display, answer, choices, blankIndex };
  }
  if (t === "mult") {
    const mult = 2 + Math.floor(Math.random() * 3);
    const start = 1 + Math.floor(Math.random() * 4);
    const length = 5;
    const seq = Array.from({ length }, (_, i) => start * mult ** i);
    const blankIndex = 1 + Math.floor(Math.random() * (length - 2));
    const answer = Math.round(seq[blankIndex]);
    const choices = shuffleChoices(answer, seq.map(Math.round), 1, 500);
    const display: (number | null)[] = seq.map((v, i) =>
      i === blankIndex ? null : Math.round(v),
    );
    return { sequence: display, answer, choices, blankIndex };
  }
  const step = 3 + Math.floor(Math.random() * 7);
  const start = 50 + Math.floor(Math.random() * 50);
  const length = 5;
  const seq = Array.from({ length }, (_, i) => start - i * step);
  const blankIndex = 1 + Math.floor(Math.random() * (length - 2));
  const answer = seq[blankIndex];
  const choices = shuffleChoices(answer, seq, 1, 100);
  const display: (number | null)[] = seq.map((v, i) =>
    i === blankIndex ? null : v,
  );
  return { sequence: display, answer, choices, blankIndex };
}

function shuffleChoices(
  answer: number,
  seq: number[],
  min: number,
  max: number,
): number[] {
  const wrong = new Set<number>();
  wrong.add(answer);
  while (wrong.size < 4) {
    const offset = [-3, -2, -1, 1, 2, 3, 5, -5, 10, -10][
      Math.floor(Math.random() * 10)
    ];
    const c = answer + offset;
    if (c >= min && c <= max && !seq.includes(c)) wrong.add(c);
  }
  return [...wrong].sort(() => Math.random() - 0.5);
}

const TOTAL_QUESTIONS = 10;
const TIME_PER_Q = 5;

export function PatternPatrol({ difficulty, onGameOver }: GameProps) {
  const [qNum, setQNum] = useState(0);
  const [question, setQuestion] = useState(() =>
    generateQuestion(difficulty, 0),
  );
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(TIME_PER_Q);
  const [flash, setFlash] = useState<"correct" | "wrong" | null>(null);
  const [revealAnswer, setRevealAnswer] = useState<number | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const nextQuestion = useCallback(() => {
    const next = qNum + 1;
    if (next >= TOTAL_QUESTIONS) {
      setGameOver(true);
    } else {
      setQNum(next);
      setQuestion(generateQuestion(difficulty, next));
      setTimer(TIME_PER_Q);
      setFlash(null);
      setRevealAnswer(null);
    }
  }, [qNum, difficulty]);

  useEffect(() => {
    if (gameOver || flash !== null) return;
    timerRef.current = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          setFlash("wrong");
          setRevealAnswer(question.answer);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameOver, flash, question.answer]);

  useEffect(() => {
    if (flash === null) return;
    const id = setTimeout(nextQuestion, 1200);
    return () => clearTimeout(id);
  }, [flash, nextQuestion]);

  useEffect(() => {
    if (gameOver) onGameOver(score);
  }, [gameOver, score, onGameOver]);

  const handleAnswer = (choice: number) => {
    if (flash !== null || gameOver) return;
    if (timerRef.current) clearInterval(timerRef.current);
    if (choice === question.answer) {
      setScore((s) => s + 15);
      setFlash("correct");
    } else {
      setFlash("wrong");
      setRevealAnswer(choice === question.answer ? null : question.answer);
    }
  };

  const timerPct = (timer / TIME_PER_Q) * 100;

  return (
    <div className="relative flex flex-col h-full min-h-[400px] bg-gradient-to-b from-[#FF6B35]/10 to-[#F4F2FF] rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="bg-[#5B4FCF] text-white rounded-xl px-3 py-1 font-black text-sm">
          {qNum + 1}/{TOTAL_QUESTIONS}
        </span>
        <span className="bg-[#FFD166] text-[#1A1A2E] rounded-xl px-3 py-1 font-black text-lg">
          {score} pts
        </span>
      </div>

      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden mb-4">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${
            timerPct > 50
              ? "bg-[#00C9A7]"
              : timerPct > 25
                ? "bg-[#FFD166]"
                : "bg-[#EF476F]"
          }`}
          style={{ width: `${timerPct}%` }}
        />
      </div>

      <p className="text-center text-[#6B6B8A] font-bold text-sm mb-4">
        What number completes the sequence?
      </p>

      <div className="flex items-center justify-center gap-2 flex-wrap mb-6">
        {question.sequence.map((val, i) => (
          <div
            key={`seq-${i}-${val ?? "blank"}`}
            className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg border-2 ${
              val === null
                ? "border-[#5B4FCF] bg-[#5B4FCF]/10 text-[#5B4FCF] text-2xl"
                : "border-[#1A1A2E]/20 bg-white text-[#1A1A2E]"
            }`}
          >
            {val === null ? "?" : val}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {question.choices.map((choice) => {
          const isCorrect = choice === question.answer;
          const isReveal = revealAnswer !== null && isCorrect;
          return (
            <button
              type="button"
              key={choice}
              data-ocid="pattern_patrol.answer.button"
              onClick={() => handleAnswer(choice)}
              className={`
                py-4 rounded-2xl font-black text-xl transition-all
                ${
                  isReveal
                    ? "bg-[#00C9A7] text-white scale-105"
                    : flash === "correct" && isCorrect
                      ? "bg-[#00C9A7] text-white scale-105"
                      : flash === "wrong" && !isCorrect
                        ? "bg-gray-200 text-gray-400"
                        : "bg-white text-[#1A1A2E] border-2 border-[#1A1A2E]/10 hover:border-[#5B4FCF] active:scale-95"
                }
              `}
            >
              {choice}
            </button>
          );
        })}
      </div>

      {flash && (
        <div
          className={`absolute inset-0 rounded-2xl flex items-center justify-center pointer-events-none ${
            flash === "correct" ? "bg-[#00C9A7]/20" : "bg-[#EF476F]/20"
          }`}
        >
          <span className="text-6xl">{flash === "correct" ? "✅" : "❌"}</span>
        </div>
      )}
    </div>
  );
}
