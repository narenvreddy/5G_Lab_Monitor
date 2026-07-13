import React, { useState } from "react";
import type { GameProps } from "./types";

const randInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;
function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function genFamily(difficulty: number) {
  const max = difficulty === 0 ? 10 : difficulty === 1 ? 20 : 50;
  const a = randInt(1, Math.floor(max / 2));
  const b = randInt(1, Math.floor(max / 2));
  const c = a + b;
  return { a, b, c };
}

const EQ_IDS = ["eq0", "eq1", "eq2", "eq3"] as const;

export function FactFamilyTree({ difficulty, onGameOver }: GameProps) {
  const [familyNum, setFamilyNum] = useState(0);
  const [family, setFamily] = useState(() => genFamily(difficulty));
  const [slots, setSlots] = useState<(number | null)[]>([
    null,
    null,
    null,
    null,
  ]);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [flash, setFlash] = useState<"correct" | "wrong" | null>(null);
  const [score, setScore] = useState(0);
  const totalFamilies = 5;

  const { a, b, c } = family;
  const eqDisplays = [
    { id: EQ_IDS[0], idx: 0, text: `${a} + ${b} = `, answer: c },
    { id: EQ_IDS[1], idx: 1, text: `${b} + ${a} = `, answer: c },
    { id: EQ_IDS[2], idx: 2, text: `${c} \u2212 ${a} = `, answer: b },
    { id: EQ_IDS[3], idx: 3, text: `${c} \u2212 ${b} = `, answer: a },
  ];
  const trioItems = [
    { n: a, id: "trio-a" },
    { n: b, id: "trio-b" },
    { n: c, id: "trio-c" },
  ];
  const rawBank = [a, b, c].filter((v, i, arr) => arr.indexOf(v) === i);
  const bankItems = shuffle(rawBank).map((num, i) => ({
    num,
    id: `bank-${i}-${num}`,
  }));

  const handleSlotTap = (idx: number) => {
    if (flash) return;
    setSelectedSlot((prev) => (prev === idx ? null : idx));
  };

  const handleNumberTap = (num: number) => {
    if (selectedSlot === null || flash) return;
    const newSlots = [...slots];
    newSlots[selectedSlot] = num;
    setSlots(newSlots);
    setSelectedSlot(null);
    if (newSlots.every((s) => s !== null)) {
      const allCorrect = newSlots.every((s, i) => s === eqDisplays[i].answer);
      if (allCorrect) {
        const newScore = score + 20;
        setScore(newScore);
        setFlash("correct");
        setTimeout(() => {
          const next = familyNum + 1;
          if (next >= totalFamilies) {
            onGameOver(newScore);
          } else {
            setFamilyNum(next);
            setFamily(genFamily(difficulty));
            setSlots([null, null, null, null]);
            setFlash(null);
          }
        }, 900);
      } else {
        setFlash("wrong");
        setTimeout(() => {
          setSlots([null, null, null, null]);
          setFlash(null);
        }, 900);
      }
    }
  };

  return (
    <div className="flex flex-col items-center p-4 gap-4 pt-6">
      <div className="flex justify-between w-full max-w-sm">
        <span className="font-black text-xl text-[#5B4FCF]">
          Family {familyNum + 1}/{totalFamilies}
        </span>
        <span className="font-black text-xl text-[#FF6B35]">⭐ {score}</span>
      </div>
      <div className="bg-white rounded-3xl p-4 shadow-md w-full max-w-sm text-center">
        <p className="font-bold text-[#6B6B8A] mb-2">The three numbers:</p>
        <div className="flex justify-center gap-6">
          {trioItems.map(({ n, id }) => (
            <span
              key={id}
              className="w-14 h-14 rounded-2xl bg-[#5B4FCF] text-white font-black text-2xl flex items-center justify-center shadow-md"
            >
              {n}
            </span>
          ))}
        </div>
      </div>
      {flash === "correct" && (
        <p className="font-black text-xl text-[#00C9A7]">Perfect family! 🎉</p>
      )}
      {flash === "wrong" && (
        <p className="font-black text-xl text-[#EF476F]">
          Not quite! Try again 💪
        </p>
      )}
      <div className="grid grid-cols-2 gap-2 w-full max-w-sm">
        {eqDisplays.map(({ id, idx, text }) => (
          <button
            key={id}
            type="button"
            data-ocid={`game.answer.item.${idx + 1}`}
            className={`py-3 px-3 rounded-2xl font-bold text-sm text-left shadow-sm transition-all min-h-[56px] border-2 ${
              selectedSlot === idx
                ? "border-[#5B4FCF] bg-purple-50"
                : slots[idx] !== null
                  ? flash === "correct"
                    ? "border-[#00C9A7] bg-green-50"
                    : flash === "wrong"
                      ? "border-[#EF476F] bg-red-50"
                      : "border-[#00C9A7] bg-green-50"
                  : "border-gray-200 bg-white"
            }`}
            onClick={() => handleSlotTap(idx)}
            disabled={!!flash}
          >
            <span className="text-[#1A1A2E] font-black">{text}</span>
            <span
              className={`inline-block min-w-[32px] text-center rounded-lg px-1 font-black text-lg ${
                slots[idx] !== null
                  ? "bg-[#FFD166] text-[#1A1A2E]"
                  : "bg-gray-200 text-gray-400"
              }`}
            >
              {slots[idx] !== null ? slots[idx] : "?"}
            </span>
          </button>
        ))}
      </div>
      <div className="bg-white rounded-3xl p-4 shadow-md w-full max-w-sm">
        <p className="text-center font-bold text-[#6B6B8A] mb-3">
          Tap a slot, then pick a number:
        </p>
        <div className="flex gap-3 justify-center">
          {bankItems.map(({ num, id }, position) => (
            <button
              key={id}
              type="button"
              data-ocid={`game.answer.item.${position + 5}`}
              className="w-16 h-16 rounded-2xl bg-[#FF6B35] text-white font-black text-2xl shadow-md active:scale-95 transition-transform disabled:opacity-50"
              onClick={() => handleNumberTap(num)}
              disabled={selectedSlot === null || !!flash}
            >
              {num}
            </button>
          ))}
        </div>
      </div>
      {selectedSlot !== null && (
        <p className="text-[#5B4FCF] font-bold text-sm">
          Slot {selectedSlot + 1} selected — pick a number above ☝️
        </p>
      )}
    </div>
  );
}
