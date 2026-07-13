import { r as reactExports, j as jsxRuntimeExports } from "./index-zTtK-yRg.js";
const COLORS = ["#5B4FCF", "#FF6B35", "#00C9A7", "#EF476F"];
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}
function genQ(difficulty) {
  const maxVal = difficulty === 0 ? 20 : difficulty === 1 ? 50 : 100;
  const op = Math.random() < 0.5 ? "+" : "-";
  const total = randInt(5, maxVal);
  const b = randInt(1, total - 1);
  const a = op === "+" ? total - b : total + b;
  const text = op === "+" ? `? + ${b} = ${total}` : `? − ${b} = ${total}`;
  const answer = a;
  const s = /* @__PURE__ */ new Set([answer]);
  let attempts = 0;
  while (s.size < 4 && attempts < 100) {
    s.add(randInt(1, maxVal));
    attempts++;
  }
  while (s.size < 4) s.add(answer + s.size);
  const choices = shuffle([...s]);
  return {
    text,
    answer,
    choices,
    correct: choices.indexOf(answer),
    op,
    b,
    total
  };
}
function BalanceScale({ tilt }) {
  const leftY = tilt === "left" ? 60 : tilt === "right" ? 80 : 70;
  const rightY = tilt === "right" ? 60 : tilt === "left" ? 80 : 70;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "200", height: "120", viewBox: "0 0 200 120", "aria-hidden": "true", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("title", { children: "Balance Scale" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "line",
      {
        x1: "100",
        y1: "20",
        x2: "100",
        y2: "60",
        stroke: "#6B6B8A",
        strokeWidth: "3"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "line",
      {
        x1: "30",
        y1: leftY - 10,
        x2: "170",
        y2: rightY - 10,
        stroke: "#1A1A2E",
        strokeWidth: "3",
        strokeLinecap: "round",
        style: { transition: "all 0.5s" }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "100", cy: "55", r: "6", fill: "#5B4FCF" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "rect",
      {
        x: "15",
        y: leftY,
        width: "50",
        height: "35",
        rx: "8",
        fill: "#5B4FCF",
        style: { transition: "all 0.5s" }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "rect",
      {
        x: "135",
        y: rightY,
        width: "50",
        height: "35",
        rx: "8",
        fill: "#FF6B35",
        style: { transition: "all 0.5s" }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "text",
      {
        x: "40",
        y: leftY + 22,
        textAnchor: "middle",
        fill: "white",
        fontWeight: "900",
        fontSize: "14",
        children: "?"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "text",
      {
        x: "160",
        y: rightY + 22,
        textAnchor: "middle",
        fill: "white",
        fontWeight: "900",
        fontSize: "11",
        children: "known"
      }
    )
  ] });
}
function ScaleMaster({ difficulty, onGameOver }) {
  const [timeLeft, setTimeLeft] = reactExports.useState(60);
  const [score, setScore] = reactExports.useState(0);
  const [done, setDone] = reactExports.useState(false);
  const [q, setQ] = reactExports.useState(() => genQ(difficulty));
  const [flash, setFlash] = reactExports.useState(null);
  const [tilt, setTilt] = reactExports.useState("left");
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
      setTilt("balanced");
      setFlash("correct");
      setTimeout(() => {
        setFlash(null);
        setTilt("left");
        setQ(genQ(difficulty));
      }, 800);
    } else {
      setTilt("right");
      setFlash("wrong");
      scoreRef.current = Math.max(0, scoreRef.current - 5);
      setScore(scoreRef.current);
      setTimeout(() => {
        setFlash(null);
        setTilt("left");
      }, 500);
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
        className: `w-full max-w-sm rounded-3xl py-4 shadow-md text-center transition-colors ${flash === "correct" ? "bg-[#00C9A7]" : flash === "wrong" ? "bg-[#EF476F]" : "bg-white"}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-black text-4xl text-[#1A1A2E]", children: q.text }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center mt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BalanceScale, { tilt }) })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3 w-full max-w-sm", children: q.choices.map((choice, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        "data-ocid": `game.answer.item.${idx + 1}`,
        className: "py-5 rounded-2xl font-black text-3xl text-white shadow-md active:scale-95 transition-transform min-h-[72px]",
        style: { backgroundColor: COLORS[idx] },
        onClick: () => handleChoice(idx),
        disabled: !!flash || done,
        children: choice
      },
      `${q.text}-${idx}`
    )) })
  ] });
}
export {
  ScaleMaster
};
