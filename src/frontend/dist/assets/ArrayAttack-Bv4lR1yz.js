import { r as reactExports, j as jsxRuntimeExports } from "./index-zTtK-yRg.js";
const COLORS = ["#5B4FCF", "#FF6B35", "#00C9A7", "#EF476F"];
const DOT_COLORS = ["#a78bfa", "#fb923c", "#34d399", "#f87171"];
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}
function genQ(difficulty) {
  const maxFactor = difficulty === 0 ? 5 : difficulty === 1 ? 9 : 12;
  const rows = randInt(2, maxFactor);
  const cols = randInt(2, maxFactor);
  const answer = rows * cols;
  const distractors = [];
  const used = /* @__PURE__ */ new Set([answer]);
  while (distractors.length < 3) {
    const dr = randInt(2, maxFactor);
    const dc = randInt(2, maxFactor);
    const val = dr * dc;
    if (!used.has(val)) {
      used.add(val);
      distractors.push({ rows: dr, cols: dc });
    }
  }
  const allChoices = shuffle([{ rows, cols }, ...distractors]);
  const correct = allChoices.findIndex(
    (c) => c.rows === rows && c.cols === cols
  );
  return { rows, cols, answer, choices: allChoices, correct };
}
function DotGrid({
  rows,
  cols,
  color
}) {
  const size = cols > 7 || rows > 7 ? 6 : cols > 5 || rows > 5 ? 8 : 10;
  const dotIndices = Array.from({ length: rows * cols }, (_, i) => i);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      style: {
        display: "grid",
        gridTemplateColumns: `repeat(${cols}, ${size + 2}px)`,
        gap: 2
      },
      children: dotIndices.map((dotIdx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          style: {
            width: size,
            height: size,
            borderRadius: "50%",
            backgroundColor: color
          }
        },
        `dot-${dotIdx}`
      ))
    }
  );
}
function ArrayAttack({ difficulty, onGameOver }) {
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
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: `w-full max-w-sm py-6 rounded-3xl text-center shadow-md transition-colors ${flash === "correct" ? "bg-[#00C9A7]" : flash === "wrong" ? "bg-[#EF476F]" : "bg-white"}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-black text-5xl text-[#1A1A2E]", children: [
            q.rows,
            " × ",
            q.cols
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[#6B6B8A] font-bold mt-1", children: "Pick the matching array!" })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3 w-full max-w-sm", children: q.choices.map((choice, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        "data-ocid": `game.answer.item.${idx + 1}`,
        className: "p-3 rounded-2xl shadow-md active:scale-95 transition-transform min-h-[80px] flex flex-col items-center justify-center gap-1 border-2",
        style: {
          backgroundColor: `${COLORS[idx]}22`,
          borderColor: flash === "correct" && idx === q.correct ? "#00C9A7" : `${COLORS[idx]}44`
        },
        onClick: () => handleChoice(idx),
        disabled: !!flash || done,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            DotGrid,
            {
              rows: choice.rows,
              cols: choice.cols,
              color: DOT_COLORS[idx]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-bold", style: { color: COLORS[idx] }, children: [
            choice.rows,
            "×",
            choice.cols
          ] })
        ]
      },
      `${q.rows}-${q.cols}-${idx}`
    )) })
  ] });
}
export {
  ArrayAttack
};
