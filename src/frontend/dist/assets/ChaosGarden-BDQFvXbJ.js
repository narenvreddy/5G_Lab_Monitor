import { r as reactExports, j as jsxRuntimeExports } from "./index-zTtK-yRg.js";
const COLORS = ["#5B4FCF", "#FF6B35", "#00C9A7", "#EF476F"];
const BLOOM_CSS = "@keyframes bloom{0%{transform:scale(0) rotate(-20deg);opacity:0}60%{transform:scale(1.3) rotate(5deg)}100%{transform:scale(1) rotate(0deg);opacity:1}}.bloom{animation:bloom 0.5s ease forwards}";
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}
const FLOWERS = ["🌸", "🌺", "🌻", "🌼", "🌷"];
const GARDEN_SLOTS = Array.from({ length: 10 }, (_, i) => i);
function getFibSeq(n) {
  const s = [1, 1];
  while (s.length < n + 2) s.push(s[s.length - 1] + s[s.length - 2]);
  return s.slice(0, n + 2);
}
function genQ(difficulty) {
  const seqTypes = ["fibonacci", "squares", "triangular", "powers2"];
  const type = seqTypes[randInt(0, seqTypes.length - 1)];
  const startIdx = randInt(0, difficulty === 0 ? 3 : difficulty === 1 ? 5 : 7);
  let values = [];
  let seqName = "";
  if (type === "fibonacci") {
    values = getFibSeq(startIdx + 4).slice(startIdx, startIdx + 5);
    seqName = "Fibonacci";
  } else if (type === "squares") {
    values = Array.from({ length: 5 }, (_, i) => (startIdx + i + 1) ** 2);
    seqName = "Square Numbers";
  } else if (type === "triangular") {
    values = Array.from({ length: 5 }, (_, i) => {
      const n = startIdx + i + 1;
      return n * (n + 1) / 2;
    });
    seqName = "Triangular Numbers";
  } else {
    values = Array.from({ length: 5 }, (_, i) => 2 ** (startIdx + i));
    seqName = "Powers of 2";
    if (values[4] > 2e3) return genQ(difficulty);
  }
  const answer = values[4];
  const seqItems = [...values.slice(0, 4), null].map((val, i) => ({
    val,
    key: `seq-${i}-${val ?? "q"}`
  }));
  const s = /* @__PURE__ */ new Set([answer]);
  let attempts = 0;
  while (s.size < 4 && attempts < 100) {
    s.add(
      answer + randInt(-Math.floor(answer * 0.4), Math.floor(answer * 0.4)) | 0
    );
    attempts++;
  }
  while (s.size < 4) s.add(answer + s.size * 3);
  const choices = shuffle([...s]);
  return {
    seqItems,
    answer,
    choices,
    correct: choices.indexOf(answer),
    seqName
  };
}
function ChaosGarden({ difficulty, onGameOver }) {
  const [timeLeft, setTimeLeft] = reactExports.useState(90);
  const [score, setScore] = reactExports.useState(0);
  const [done, setDone] = reactExports.useState(false);
  const [q, setQ] = reactExports.useState(() => genQ(difficulty));
  const [flash, setFlash] = reactExports.useState(null);
  const [bloomed, setBloomed] = reactExports.useState(0);
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
      setBloomed((b) => Math.min(b + 1, 10));
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
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center p-4 gap-4 pt-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: BLOOM_CSS }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between w-full max-w-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "span",
        {
          className: `font-black text-2xl ${timeLeft <= 15 ? "text-[#EF476F]" : "text-[#5B4FCF]"}`,
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
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1 justify-center w-full max-w-sm flex-wrap bg-[#00C9A7]/10 rounded-2xl p-3", children: GARDEN_SLOTS.map((slotIdx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "span",
      {
        className: slotIdx < bloomed ? "text-3xl bloom" : "text-3xl opacity-20",
        style: { animationDelay: `${slotIdx * 0.05}s` },
        children: slotIdx < bloomed ? FLOWERS[slotIdx % FLOWERS.length] : "🌱"
      },
      `garden-${slotIdx}`
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: `w-full max-w-sm rounded-3xl p-5 shadow-md text-center transition-colors ${flash === "correct" ? "bg-[#00C9A7]" : flash === "wrong" ? "bg-[#EF476F]" : "bg-white"}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[#6B6B8A] font-bold text-sm mb-3", children: [
            q.seqName,
            " — What comes next?"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center gap-2 flex-wrap", children: q.seqItems.map(({ val, key }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: `w-14 h-14 rounded-2xl flex items-center justify-center font-black text-lg ${val === null ? "bg-[#5B4FCF] text-white text-3xl animate-pulse" : "bg-[#F4F2FF] text-[#1A1A2E]"}`,
              children: val === null ? "?" : val
            },
            key
          )) })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3 w-full max-w-sm", children: q.choices.map((choice, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        "data-ocid": `game.answer.item.${idx + 1}`,
        className: "py-5 rounded-2xl font-black text-2xl text-white shadow-md active:scale-95 transition-transform min-h-[72px]",
        style: { backgroundColor: COLORS[idx] },
        onClick: () => handleChoice(idx),
        disabled: !!flash || done,
        children: choice
      },
      `${q.answer}-${idx}`
    )) })
  ] });
}
export {
  ChaosGarden
};
