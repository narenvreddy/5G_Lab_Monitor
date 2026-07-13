import { r as reactExports, j as jsxRuntimeExports } from "./index-zTtK-yRg.js";
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}
function genFamily(difficulty) {
  const max = difficulty === 0 ? 10 : difficulty === 1 ? 20 : 50;
  const a = randInt(1, Math.floor(max / 2));
  const b = randInt(1, Math.floor(max / 2));
  const c = a + b;
  return { a, b, c };
}
const EQ_IDS = ["eq0", "eq1", "eq2", "eq3"];
function FactFamilyTree({ difficulty, onGameOver }) {
  const [familyNum, setFamilyNum] = reactExports.useState(0);
  const [family, setFamily] = reactExports.useState(() => genFamily(difficulty));
  const [slots, setSlots] = reactExports.useState([
    null,
    null,
    null,
    null
  ]);
  const [selectedSlot, setSelectedSlot] = reactExports.useState(null);
  const [flash, setFlash] = reactExports.useState(null);
  const [score, setScore] = reactExports.useState(0);
  const totalFamilies = 5;
  const { a, b, c } = family;
  const eqDisplays = [
    { id: EQ_IDS[0], idx: 0, text: `${a} + ${b} = `, answer: c },
    { id: EQ_IDS[1], idx: 1, text: `${b} + ${a} = `, answer: c },
    { id: EQ_IDS[2], idx: 2, text: `${c} − ${a} = `, answer: b },
    { id: EQ_IDS[3], idx: 3, text: `${c} − ${b} = `, answer: a }
  ];
  const trioItems = [
    { n: a, id: "trio-a" },
    { n: b, id: "trio-b" },
    { n: c, id: "trio-c" }
  ];
  const rawBank = [a, b, c].filter((v, i, arr) => arr.indexOf(v) === i);
  const bankItems = shuffle(rawBank).map((num, i) => ({
    num,
    id: `bank-${i}-${num}`
  }));
  const handleSlotTap = (idx) => {
    if (flash) return;
    setSelectedSlot((prev) => prev === idx ? null : idx);
  };
  const handleNumberTap = (num) => {
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
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center p-4 gap-4 pt-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between w-full max-w-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-black text-xl text-[#5B4FCF]", children: [
        "Family ",
        familyNum + 1,
        "/",
        totalFamilies
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-black text-xl text-[#FF6B35]", children: [
        "⭐ ",
        score
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-3xl p-4 shadow-md w-full max-w-sm text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-[#6B6B8A] mb-2", children: "The three numbers:" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center gap-6", children: trioItems.map(({ n, id }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "span",
        {
          className: "w-14 h-14 rounded-2xl bg-[#5B4FCF] text-white font-black text-2xl flex items-center justify-center shadow-md",
          children: n
        },
        id
      )) })
    ] }),
    flash === "correct" && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-black text-xl text-[#00C9A7]", children: "Perfect family! 🎉" }),
    flash === "wrong" && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-black text-xl text-[#EF476F]", children: "Not quite! Try again 💪" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2 w-full max-w-sm", children: eqDisplays.map(({ id, idx, text }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        "data-ocid": `game.answer.item.${idx + 1}`,
        className: `py-3 px-3 rounded-2xl font-bold text-sm text-left shadow-sm transition-all min-h-[56px] border-2 ${selectedSlot === idx ? "border-[#5B4FCF] bg-purple-50" : slots[idx] !== null ? flash === "correct" ? "border-[#00C9A7] bg-green-50" : flash === "wrong" ? "border-[#EF476F] bg-red-50" : "border-[#00C9A7] bg-green-50" : "border-gray-200 bg-white"}`,
        onClick: () => handleSlotTap(idx),
        disabled: !!flash,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#1A1A2E] font-black", children: text }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: `inline-block min-w-[32px] text-center rounded-lg px-1 font-black text-lg ${slots[idx] !== null ? "bg-[#FFD166] text-[#1A1A2E]" : "bg-gray-200 text-gray-400"}`,
              children: slots[idx] !== null ? slots[idx] : "?"
            }
          )
        ]
      },
      id
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-3xl p-4 shadow-md w-full max-w-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center font-bold text-[#6B6B8A] mb-3", children: "Tap a slot, then pick a number:" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-3 justify-center", children: bankItems.map(({ num, id }, position) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          "data-ocid": `game.answer.item.${position + 5}`,
          className: "w-16 h-16 rounded-2xl bg-[#FF6B35] text-white font-black text-2xl shadow-md active:scale-95 transition-transform disabled:opacity-50",
          onClick: () => handleNumberTap(num),
          disabled: selectedSlot === null || !!flash,
          children: num
        },
        id
      )) })
    ] }),
    selectedSlot !== null && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[#5B4FCF] font-bold text-sm", children: [
      "Slot ",
      selectedSlot + 1,
      " selected — pick a number above ☝️"
    ] })
  ] });
}
export {
  FactFamilyTree
};
