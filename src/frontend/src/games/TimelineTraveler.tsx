import React, { useCallback, useEffect, useState } from "react";
import type { GameProps } from "./types";

const TIMELINE_CSS = `
@keyframes cardSlide {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
`;

interface HistoryFact {
  id: number;
  text: string;
  era: number;
  label: string;
}

const ALL_FACTS: HistoryFact[] = [
  {
    id: 1,
    text: "Ancient Egyptians used hieroglyphic numerals",
    era: 1,
    label: "3000 BCE",
  },
  {
    id: 2,
    text: "Babylonians developed a place-value number system",
    era: 2,
    label: "2000 BCE",
  },
  {
    id: 3,
    text: "Pythagoreans studied numbers and geometry",
    era: 3,
    label: "500 BCE",
  },
  {
    id: 4,
    text: "Euclid wrote his famous book on geometry",
    era: 4,
    label: "300 BCE",
  },
  { id: 5, text: "Zero was invented in India", era: 5, label: "500 CE" },
  {
    id: 6,
    text: "Al-Khwarizmi named Algebra and wrote key math books",
    era: 6,
    label: "820 CE",
  },
  {
    id: 7,
    text: "Fibonacci introduced Hindu-Arabic numbers to Europe",
    era: 7,
    label: "1202 CE",
  },
  {
    id: 8,
    text: "Galileo used math to describe the motion of objects",
    era: 8,
    label: "1600s",
  },
  {
    id: 9,
    text: "Newton and Leibniz invented calculus",
    era: 9,
    label: "1670s",
  },
  {
    id: 10,
    text: "Ada Lovelace wrote the first computer algorithm",
    era: 10,
    label: "1843",
  },
  {
    id: 11,
    text: "Computers used math to solve complex problems",
    era: 11,
    label: "1940s",
  },
  {
    id: 12,
    text: "The internet linked computers across the world",
    era: 12,
    label: "1990s",
  },
];

function pickFacts(difficulty: number): HistoryFact[] {
  const count = difficulty === 0 ? 4 : difficulty === 1 ? 5 : 6;
  const shuffled = [...ALL_FACTS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).sort(() => Math.random() - 0.5);
}

const TOTAL_ROUNDS = 3;

export function TimelineTraveler({ difficulty, onGameOver }: GameProps) {
  const [roundNum, setRoundNum] = useState(0);
  const [facts, setFacts] = useState<HistoryFact[]>(() =>
    pickFacts(difficulty),
  );
  const [ordered, setOrdered] = useState<HistoryFact[]>([]);
  const [selected, setSelected] = useState<HistoryFact | null>(null);
  const [score, setScore] = useState(0);
  const [checked, setChecked] = useState(false);
  const [result, setResult] = useState<boolean[]>([]);
  const [gameOver, setGameOver] = useState(false);
  // Slot IDs derived from fact IDs so they're stable per round
  const [slotIds] = useState(() => facts.map((f) => `slot-${f.id}`));

  useEffect(() => {
    if (gameOver) onGameOver(score);
  }, [gameOver, score, onGameOver]);

  const handleSelectSource = (fact: HistoryFact) => {
    if (checked) return;
    if (selected?.id === fact.id) {
      setSelected(null);
    } else {
      setSelected(fact);
    }
  };

  const handleSlotTap = (slotIdx: number) => {
    if (checked) return;
    if (selected) {
      const newOrdered = [...ordered];
      const existingIdx = newOrdered.findIndex((f) => f.id === selected.id);
      if (existingIdx !== -1) newOrdered.splice(existingIdx, 1);
      newOrdered.splice(slotIdx, 0, selected);
      setOrdered(newOrdered.slice(0, facts.length));
      setSelected(null);
    } else if (ordered[slotIdx]) {
      setSelected(ordered[slotIdx]);
      const newOrdered = [...ordered];
      newOrdered.splice(slotIdx, 1);
      setOrdered(newOrdered);
    }
  };

  const handleCheck = useCallback(() => {
    if (ordered.length !== facts.length) return;
    const correctOrder = [...facts].sort((a, b) => a.era - b.era);
    const res = ordered.map((f, i) => f.id === correctOrder[i].id);
    setResult(res);
    setChecked(true);
    const pts = res.filter(Boolean).length * 20;
    setScore((s) => s + pts);
    setTimeout(() => {
      const next = roundNum + 1;
      if (next >= TOTAL_ROUNDS) {
        setGameOver(true);
      } else {
        setRoundNum(next);
        setFacts(pickFacts(difficulty));
        setOrdered([]);
        setSelected(null);
        setChecked(false);
        setResult([]);
      }
    }, 2000);
  }, [ordered, facts, roundNum, difficulty]);

  const unplaced = facts.filter((f) => !ordered.some((o) => o.id === f.id));

  return (
    <div className="flex flex-col min-h-[520px] bg-gradient-to-b from-[#F4F2FF] to-[#EDF0FF] p-4 gap-4 select-none">
      <style>{TIMELINE_CSS}</style>
      <div className="flex justify-between items-center">
        <span className="bg-[#5B4FCF] text-white font-black text-sm px-3 py-1 rounded-xl">
          Round {roundNum + 1}/{TOTAL_ROUNDS}
        </span>
        <span className="bg-[#FFD166] text-[#1A1A2E] font-black text-lg px-4 py-1 rounded-xl">
          🗺️ {score} pts
        </span>
      </div>

      <p className="font-black text-[#1A1A2E] text-base text-center">
        Put these math history facts in order — earliest first!
      </p>

      <div className="flex flex-col gap-2">
        {unplaced.map((fact) => (
          <button
            type="button"
            key={fact.id}
            data-ocid="timeline.fact.button"
            onClick={() => handleSelectSource(fact)}
            style={{ animation: "cardSlide 0.3s ease forwards" }}
            className={`p-3 rounded-2xl text-left font-bold text-sm shadow-md transition-all min-h-[44px] ${
              selected?.id === fact.id
                ? "bg-[#5B4FCF] text-white scale-[1.02]"
                : "bg-white text-[#1A1A2E] border-2 border-[#1A1A2E]/10 hover:border-[#5B4FCF] active:scale-95"
            }`}
          >
            {fact.text}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-xs font-bold text-[#6B6B8A] text-center">
          ← Earliest → Latest
        </p>
        {slotIds.map((slotId, i) => (
          <button
            type="button"
            key={slotId}
            data-ocid={`timeline.slot.item.${i + 1}`}
            onClick={() => handleSlotTap(i)}
            className={`p-3 rounded-2xl text-left text-sm font-bold min-h-[44px] border-2 transition-all ${
              ordered[i]
                ? checked
                  ? result[i]
                    ? "bg-[#00C9A7] border-[#00C9A7] text-white"
                    : "bg-[#EF476F] border-[#EF476F] text-white"
                  : "bg-[#FFD166] border-[#FFD166] text-[#1A1A2E] active:scale-95"
                : "bg-white border-dashed border-[#5B4FCF]/40 text-[#6B6B8A]"
            }`}
          >
            {ordered[i]
              ? `${i + 1}. ${ordered[i].text}${checked ? ` (${ordered[i].label})` : ""}`
              : `${i + 1}. Tap a card, then tap here`}
          </button>
        ))}
      </div>

      {!checked && (
        <button
          type="button"
          data-ocid="timeline.submit.button"
          onClick={handleCheck}
          disabled={ordered.length !== facts.length}
          className="py-4 rounded-2xl font-black text-lg bg-[#5B4FCF] text-white shadow-lg disabled:opacity-40 active:scale-95 transition-transform"
        >
          Check Order ✓
        </button>
      )}

      {checked && (
        <div className="text-center">
          <p className="font-black text-2xl text-[#5B4FCF]">
            {result.filter(Boolean).length}/{facts.length} correct! +
            {result.filter(Boolean).length * 20} pts
          </p>
        </div>
      )}
    </div>
  );
}
