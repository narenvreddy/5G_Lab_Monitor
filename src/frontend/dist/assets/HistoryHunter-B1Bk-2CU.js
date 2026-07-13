import { r as reactExports, j as jsxRuntimeExports } from "./index-zTtK-yRg.js";
const COLORS = ["#5B4FCF", "#FF6B35", "#00C9A7", "#EF476F"];
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}
const ROMAN_VALS = [
  [1e3, "M"],
  [900, "CM"],
  [500, "D"],
  [400, "CD"],
  [100, "C"],
  [90, "XC"],
  [50, "L"],
  [40, "XL"],
  [10, "X"],
  [9, "IX"],
  [5, "V"],
  [4, "IV"],
  [1, "I"]
];
function toRoman(num) {
  let n = num;
  let result = "";
  for (const [val, sym] of ROMAN_VALS) {
    while (n >= val) {
      result += sym;
      n -= val;
    }
  }
  return result;
}
function genQ(difficulty) {
  const maxVal = difficulty === 0 ? 20 : difficulty === 1 ? 100 : 500;
  const decimal = randInt(1, maxVal);
  const roman = toRoman(decimal);
  const showRoman = Math.random() < 0.6;
  const s = /* @__PURE__ */ new Set([decimal]);
  let attempts = 0;
  while (s.size < 4 && attempts < 100) {
    s.add(randInt(1, maxVal));
    attempts++;
  }
  while (s.size < 4) s.add(decimal + s.size);
  if (showRoman) {
    const choices = shuffle([...s]);
    return {
      question: roman,
      choices: choices.map((v) => v.toString()),
      correct: choices.indexOf(decimal),
      hint: "Roman → Decimal"
    };
  }
  const decChoices = shuffle([...s]);
  return {
    question: decimal.toString(),
    choices: decChoices.map((v) => toRoman(v)),
    correct: decChoices.indexOf(decimal),
    hint: "Decimal → Roman"
  };
}
function HistoryHunter({ difficulty, onGameOver }) {
  const [timeLeft, setTimeLeft] = reactExports.useState(60);
  const [score, setScore] = reactExports.useState(0);
  const [done, setDone] = reactExports.useState(false);
  const [q, setQ] = reactExports.useState(() => genQ(difficulty));
  const [flash, setFlash] = reactExports.useState(null);
  const scoreRef = reactExports.useRef(0);
  const onDoneRef = reactExports.useRef(onGameOver);
  onDoneRef.current = onGameOver;
  reactExports.useEffect(() => {
    if (done || timeLeft <= 0) return;
    const t = setTimeout(() => setTimeLeft((v) => v - 1), 1e3);
    return () => clearTimeout(t);
  }, [timeLeft, done]);
  reactExports.useEffect(() => {
    if (timeLeft <= 0 && !done) {
      setDone(true);
      onDoneRef.current(scoreRef.current);
    }
  }, [timeLeft, done]);
  const handleChoice = (idx) => {
    if (flash || done) return;
    if (idx === q.correct) {
      scoreRef.current += 10;
      setScore(scoreRef.current);
      setFlash("correct");
      setTimeout(() => {
        setFlash(null);
        setQ(genQ(difficulty));
      }, 700);
    } else {
      scoreRef.current = Math.max(0, scoreRef.current - 5);
      setScore(scoreRef.current);
      setFlash("wrong");
      setTimeout(() => setFlash(null), 400);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center p-4 gap-5 pt-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between w-full max-w-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "span",
        {
          className: `font-black text-2xl ${timeLeft <= 10 ? "text-[#EF476F]" : "text-[#5B4FCF]"}`,
          children: [
            "⏱ ",
            timeLeft,
            "s"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-black text-2xl text-[#FF6B35]", children: [
        "⭐ ",
        score
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-[#6B6B8A]", children: q.hint }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: `w-full max-w-sm py-8 rounded-3xl text-center shadow-md transition-colors ${flash === "correct" ? "bg-[#00C9A7]" : flash === "wrong" ? "bg-[#EF476F]" : "bg-[#1A1A2E]"}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-black text-5xl text-[#FFD166] tracking-widest", children: q.question }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-400 text-sm mt-2", children: "📜 What is this?" })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3 w-full max-w-sm", children: q.choices.map((choice, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        "data-ocid": `game.answer.item.${idx + 1}`,
        className: "py-4 rounded-2xl font-black text-xl text-white shadow-md active:scale-95 transition-transform min-h-[64px] tracking-wider",
        style: { backgroundColor: COLORS[idx] },
        onClick: () => handleChoice(idx),
        disabled: !!flash || done,
        children: choice
      },
      `${q.question}-${idx}`
    )) })
  ] });
}
export {
  HistoryHunter
};
