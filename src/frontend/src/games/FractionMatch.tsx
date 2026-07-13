import React, { useEffect, useState } from "react";
import type { GameProps } from "./types";

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

const ALL_PAIRS = [
  ["1/2", "2/4"],
  ["1/3", "2/6"],
  ["2/3", "4/6"],
  ["3/4", "6/8"],
  ["1/4", "2/8"],
  ["1/5", "2/10"],
  ["3/5", "6/10"],
  ["2/5", "4/10"],
];

interface MemCard {
  id: number;
  label: string;
  pairId: number;
  flipped: boolean;
  matched: boolean;
}

function buildCards(difficulty: number): MemCard[] {
  const numPairs = difficulty === 0 ? 4 : difficulty === 1 ? 6 : 8;
  const rawCards = ALL_PAIRS.slice(0, numPairs).flatMap((pair, pairId) =>
    pair.map(
      (label): MemCard => ({
        id: 0,
        label,
        pairId,
        flipped: false,
        matched: false,
      }),
    ),
  );
  return shuffle(rawCards).map((c, i) => ({ ...c, id: i }));
}

export function FractionMatch({ difficulty, onGameOver }: GameProps) {
  const [cards, setCards] = useState<MemCard[]>(() => buildCards(difficulty));
  const [selected, setSelected] = useState<number[]>([]);
  const [flips, setFlips] = useState(0);
  const [locked, setLocked] = useState(false);
  const [score, setScore] = useState(0);

  const numPairs = difficulty === 0 ? 4 : difficulty === 1 ? 6 : 8;
  const found = cards.filter((c) => c.matched).length / 2;
  const cols = 4;

  useEffect(() => {
    if (found === numPairs && found > 0) {
      const finalScore = Math.max(10, 200 - (flips - numPairs * 2) * 5);
      setScore(finalScore);
      setTimeout(() => onGameOver(finalScore), 600);
    }
  }, [found, numPairs, flips, onGameOver]);

  const handleFlip = (id: number) => {
    if (locked) return;
    const card = cards.find((c) => c.id === id);
    if (!card || card.flipped || card.matched || selected.length >= 2) return;

    const newCards = cards.map((c) =>
      c.id === id ? { ...c, flipped: true } : c,
    );
    const newSelected = [...selected, id];
    setCards(newCards);
    setFlips((f) => f + 1);

    if (newSelected.length === 2) {
      setLocked(true);
      const [cardA, cardB] = newSelected.map(
        (sid) => newCards.find((c) => c.id === sid)!,
      );
      if (cardA.pairId === cardB.pairId) {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              newSelected.includes(c.id) ? { ...c, matched: true } : c,
            ),
          );
          setSelected([]);
          setLocked(false);
        }, 500);
      } else {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              newSelected.includes(c.id) ? { ...c, flipped: false } : c,
            ),
          );
          setSelected([]);
          setLocked(false);
        }, 1000);
      }
    } else {
      setSelected(newSelected);
    }
  };

  const PAIR_COLORS = [
    "#5B4FCF",
    "#FF6B35",
    "#00C9A7",
    "#EF476F",
    "#FFD166",
    "#6B6B8A",
    "#1A1A2E",
    "#a78bfa",
  ];

  return (
    <div className="flex flex-col items-center p-4 gap-4 pt-6">
      <div className="flex justify-between w-full max-w-sm">
        <span className="font-black text-xl text-[#5B4FCF]">
          Found: {found}/{numPairs}
        </span>
        <span className="font-black text-xl text-[#FF6B35]">
          Flips: {flips}
        </span>
      </div>
      <p className="font-bold text-[#6B6B8A]">Match equivalent fractions!</p>
      <div
        className="grid gap-2 w-full max-w-sm"
        style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
      >
        {cards.map((card, i) => (
          <button
            key={card.id}
            type="button"
            data-ocid={`game.answer.item.${i + 1}`}
            className={`aspect-square rounded-2xl font-black text-lg shadow-md transition-all active:scale-95 flex items-center justify-center ${
              card.matched
                ? "opacity-50 cursor-default"
                : card.flipped
                  ? "scale-105 shadow-lg"
                  : "hover:scale-105"
            }`}
            style={{
              backgroundColor:
                card.flipped || card.matched
                  ? PAIR_COLORS[card.pairId % PAIR_COLORS.length]
                  : "#1A1A2E",
              color: "white",
              minHeight: 72,
            }}
            onClick={() => handleFlip(card.id)}
            disabled={card.matched || locked}
          >
            {card.flipped || card.matched ? card.label : "❓"}
          </button>
        ))}
      </div>
      <p className="text-sm font-bold text-[#6B6B8A]">
        {score > 0
          ? `Score: ${score}`
          : "Flip cards to find matching fractions"}
      </p>
    </div>
  );
}
