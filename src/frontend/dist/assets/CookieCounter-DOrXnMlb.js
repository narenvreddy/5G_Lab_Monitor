import { r as reactExports, j as jsxRuntimeExports, C as ComboIndicator, a as ConfettiBurst, S as ScorePopup } from "./index-zTtK-yRg.js";
const COLORS = ["#5B4FCF", "#FF6B35", "#00C9A7", "#EF476F"];
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}
function makeChoices(correct, min, max) {
  const s = /* @__PURE__ */ new Set([correct]);
  let attempts = 0;
  while (s.size < 4 && attempts < 100) {
    s.add(randInt(Math.max(min, correct - 5), Math.min(max, correct + 5)));
    attempts++;
  }
  while (s.size < 4) s.add(correct + s.size);
  return shuffle([...s]);
}
function genQ(difficulty) {
  const max = difficulty === 0 ? 10 : difficulty === 1 ? 20 : 30;
  const count = randInt(1, max);
  const choices = makeChoices(count, 1, max);
  return { count, choices, correct: choices.indexOf(count) };
}
function CookieCounter({ difficulty, onGameOver }) {
  const [timeLeft, setTimeLeft] = reactExports.useState(60);
  const [score, setScore] = reactExports.useState(0);
  const [done, setDone] = reactExports.useState(false);
  const [q, setQ] = reactExports.useState(() => genQ(difficulty));
  const [flash, setFlash] = reactExports.useState(null);
  const [combo, setCombo] = reactExports.useState(0);
  const [popupKey, setPopupKey] = reactExports.useState(0);
  const [popupValue, setPopupValue] = reactExports.useState(0);
  const [showPopup, setShowPopup] = reactExports.useState(false);
  const [showConfetti, setShowConfetti] = reactExports.useState(false);
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
      const newCombo = combo + 1;
      setCombo(newCombo);
      const comboMult = Math.min(newCombo, 3);
      const pts = comboMult === 1 ? 10 : comboMult === 2 ? 15 : 20;
      scoreRef.current += pts;
      setScore(scoreRef.current);
      setPopupValue(pts);
      setPopupKey((k) => k + 1);
      setShowPopup(true);
      if (newCombo >= 3) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 1e3);
      }
      setTimeout(() => setShowPopup(false), 800);
      setFlash("correct");
      setTimeout(() => {
        setFlash(null);
        setQ(genQ(difficulty));
      }, 700);
    } else {
      setCombo(0);
      scoreRef.current = Math.max(0, scoreRef.current - 5);
      setScore(scoreRef.current);
      setFlash("wrong");
      setTimeout(() => setFlash(null), 400);
    }
  };
  const cols = q.count <= 10 ? 5 : q.count <= 20 ? 6 : 7;
  const cookieIndices = Array.from({ length: q.count }, (_, i) => i);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center p-4 gap-4 pt-6", children: [
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
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ComboIndicator, { combo }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-black text-xl text-[#1A1A2E]", children: "How many cookies? 🍪" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full max-w-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: `w-full p-4 rounded-3xl shadow-md transition-colors ${flash === "correct" ? "bg-[#00C9A7]" : flash === "wrong" ? "bg-[#EF476F]" : "bg-white"}`,
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "grid gap-1",
              style: { gridTemplateColumns: `repeat(${cols}, 1fr)` },
              children: cookieIndices.map((cookieIdx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "text-2xl text-center",
                  style: { animationDelay: `${cookieIdx * 0.03}s` },
                  children: "🍪"
                },
                `cookie-${cookieIdx}`
              ))
            }
          )
        },
        q.count
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ConfettiBurst, { active: showConfetti }),
      showPopup && /* @__PURE__ */ jsxRuntimeExports.jsx(ScorePopup, { value: popupValue }, popupKey)
    ] }),
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
      `${q.count}-${idx}`
    )) })
  ] });
}
export {
  CookieCounter
};
