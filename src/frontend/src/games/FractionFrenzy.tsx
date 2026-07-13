import React, { useEffect, useState } from "react";
import type { GameProps } from "./types";

interface FractionPair {
  a: [number, number];
  b: [number, number];
}

const DIFFICULTY_PAIRS: FractionPair[][] = [
  [
    { a: [1, 2], b: [2, 4] },
    { a: [1, 4], b: [2, 8] },
    { a: [3, 4], b: [6, 8] },
    { a: [1, 2], b: [4, 8] },
    { a: [2, 4], b: [4, 8] },
  ],
  [
    { a: [1, 3], b: [2, 6] },
    { a: [2, 3], b: [4, 6] },
    { a: [1, 2], b: [3, 6] },
    { a: [1, 4], b: [3, 12] },
    { a: [3, 4], b: [9, 12] },
    { a: [2, 3], b: [8, 12] },
  ],
  [
    { a: [1, 5], b: [2, 10] },
    { a: [2, 5], b: [4, 10] },
    { a: [3, 5], b: [6, 10] },
    { a: [4, 5], b: [8, 10] },
    { a: [1, 2], b: [5, 10] },
    { a: [1, 4], b: [5, 20] },
    { a: [3, 4], b: [15, 20] },
  ],
];

function pickPairs(difficulty: number): Array<{
  frac: [number, number];
  pairId: number;
  cardId: number;
  matched: boolean;
  flipped: boolean;
  shaking: boolean;
}> {
  const pool = DIFFICULTY_PAIRS[difficulty] ?? DIFFICULTY_PAIRS[0];
  const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, 3);
  const cards: Array<{
    frac: [number, number];
    pairId: number;
    cardId: number;
    matched: boolean;
    flipped: boolean;
    shaking: boolean;
  }> = [];
  shuffled.forEach((pair, pairId) => {
    cards.push({
      frac: pair.a,
      pairId,
      cardId: pairId * 2,
      matched: false,
      flipped: false,
      shaking: false,
    });
    cards.push({
      frac: pair.b,
      pairId,
      cardId: pairId * 2 + 1,
      matched: false,
      flipped: false,
      shaking: false,
    });
  });
  return cards.sort(() => Math.random() - 0.5);
}

function FractionDisplay({ num, den }: { num: number; den: number }) {
  return (
    <div className="flex flex-col items-center leading-none">
      <span className="font-black text-2xl">{num}</span>
      <div className="w-8 h-0.5 bg-current my-0.5" />
      <span className="font-black text-2xl">{den}</span>
    </div>
  );
}

export function FractionFrenzy({ difficulty, onGameOver }: GameProps) {
  const [cards, setCards] = useState(() => pickPairs(difficulty));
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(90);
  const [gameOver, setGameOver] = useState(false);
  const [round, setRound] = useState(1);

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

  const handleTap = (cardId: number) => {
    if (gameOver) return;
    const card = cards.find((c) => c.cardId === cardId);
    if (!card || card.matched || card.shaking) return;

    if (selected === null) {
      setSelected(cardId);
      setCards((prev) =>
        prev.map((c) => (c.cardId === cardId ? { ...c, flipped: true } : c)),
      );
    } else {
      if (selected === cardId) {
        setSelected(null);
        setCards((prev) =>
          prev.map((c) => (c.cardId === cardId ? { ...c, flipped: false } : c)),
        );
        return;
      }
      const first = cards.find((c) => c.cardId === selected);
      const second = cards.find((c) => c.cardId === cardId);
      if (!first || !second) return;

      setSelected(null);
      setCards((prev) =>
        prev.map((c) => (c.cardId === cardId ? { ...c, flipped: true } : c)),
      );

      if (first.pairId === second.pairId) {
        const newScore = score + 20;
        setScore(newScore);
        setTimeout(() => {
          setCards((prev) => {
            const updated = prev.map((c) =>
              c.cardId === selected || c.cardId === cardId
                ? { ...c, matched: true }
                : c,
            );
            if (updated.every((c) => c.matched)) {
              setRound((r) => r + 1);
              return pickPairs(difficulty);
            }
            return updated;
          });
        }, 600);
      } else {
        setCards((prev) =>
          prev.map((c) =>
            c.cardId === selected || c.cardId === cardId
              ? { ...c, shaking: true }
              : c,
          ),
        );
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.cardId === selected || c.cardId === cardId
                ? { ...c, flipped: false, shaking: false }
                : c,
            ),
          );
        }, 800);
      }
    }
  };

  return (
    <div className="flex flex-col h-full min-h-[400px] bg-gradient-to-b from-[#00C9A7]/20 to-[#F4F2FF] rounded-2xl p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="bg-[#5B4FCF] text-white rounded-xl px-3 py-1">
          <span className="font-black text-sm">Round {round}</span>
        </div>
        <div className="bg-[#FFD166] rounded-xl px-3 py-1">
          <span className="font-black text-[#1A1A2E] text-lg">{score}</span>
          <span className="text-[#1A1A2E]/60 text-xs ml-1">pts</span>
        </div>
        <div
          className={`rounded-xl px-3 py-1 ${
            gameOver
              ? "bg-[#6B6B8A] text-white"
              : timeLeft <= 15
                ? "bg-[#EF476F] text-white"
                : "bg-[#1A1A2E] text-white"
          }`}
        >
          <span className="font-black text-lg">
            {gameOver ? "Done!" : `${timeLeft}s`}
          </span>
        </div>
      </div>

      <p className="text-center text-[#6B6B8A] font-bold text-sm mb-4">
        Tap matching equivalent fractions!
      </p>

      <div className="grid grid-cols-3 gap-3 flex-1">
        {cards.map((card) => (
          <button
            type="button"
            key={card.cardId}
            data-ocid="fraction_frenzy.card.button"
            onClick={() => !gameOver && handleTap(card.cardId)}
            className={`
              rounded-2xl flex flex-col items-center justify-center min-h-[90px] font-bold border-2 transition-all duration-200
              ${
                card.matched
                  ? "bg-[#00C9A7] border-[#00C9A7] text-white scale-95 opacity-70"
                  : card.shaking
                    ? "bg-[#EF476F]/20 border-[#EF476F] text-[#EF476F] animate-pulse"
                    : card.flipped
                      ? "bg-white border-[#5B4FCF] text-[#5B4FCF] ring-4 ring-[#5B4FCF]/30 scale-105"
                      : gameOver
                        ? "bg-[#5B4FCF]/40 border-[#5B4FCF]/20 text-white cursor-default"
                        : "bg-[#5B4FCF] border-[#5B4FCF] text-white hover:scale-105 active:scale-95 cursor-pointer"
              }
            `}
          >
            {card.matched ? (
              <span className="text-3xl">✓</span>
            ) : card.flipped ? (
              <FractionDisplay num={card.frac[0]} den={card.frac[1]} />
            ) : (
              <span className="text-3xl">🍰</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
