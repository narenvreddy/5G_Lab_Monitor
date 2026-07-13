import { r as reactExports, j as jsxRuntimeExports } from "./index-zTtK-yRg.js";
const FROG_BOUNCE_CSS = `
@keyframes frogBounce {
  0% { transform: scale(1); }
  30% { transform: scale(1.5) translateY(-4px); }
  60% { transform: scale(0.9); }
  100% { transform: scale(1); }
}
.frog-bounce { animation: frogBounce 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
`;
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
function genRound(difficulty) {
  const max = difficulty === 0 ? 10 : difficulty === 1 ? 20 : 30;
  const target = randInt(1, max);
  return { target, max };
}
function HopToIt({ difficulty, onGameOver }) {
  const [round, setRound] = reactExports.useState(0);
  const [score, setScore] = reactExports.useState(0);
  const [current, setCurrent] = reactExports.useState(() => genRound(difficulty));
  const [frogPos, setFrogPos] = reactExports.useState(0);
  const [flash, setFlash] = reactExports.useState(null);
  const [bounceKey, setBounceKey] = reactExports.useState(0);
  const totalRounds = 8;
  const handleTap = (pos) => {
    if (flash) return;
    setFrogPos(pos);
    setBounceKey((k) => k + 1);
    if (pos === current.target) {
      setFlash("correct");
      const newScore = score + 10;
      setScore(newScore);
      setTimeout(() => {
        const nextRound = round + 1;
        if (nextRound >= totalRounds) {
          onGameOver(newScore);
        } else {
          setRound(nextRound);
          setCurrent(genRound(difficulty));
          setFrogPos(0);
          setFlash(null);
        }
      }, 800);
    } else {
      setFlash("wrong");
      setTimeout(() => setFlash(null), 500);
    }
  };
  const positions = Array.from({ length: current.max + 1 }, (_, i) => i);
  const cols = current.max <= 10 ? 11 : current.max <= 20 ? 7 : 6;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center p-4 gap-5 pt-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: FROG_BOUNCE_CSS }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between w-full max-w-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-black text-xl text-[#5B4FCF]", children: [
        "Round ",
        round + 1,
        "/",
        totalRounds
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-black text-xl text-[#FF6B35]", children: [
        "⭐ ",
        score
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: `w-full max-w-sm p-5 rounded-3xl text-center shadow-md ${flash === "correct" ? "bg-[#00C9A7]" : flash === "wrong" ? "bg-[#EF476F]" : "bg-white"}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-black text-2xl text-[#1A1A2E] mb-1", children: "🐸 Hop to..." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-black text-6xl text-[#5B4FCF]", children: current.target })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-center text-sm font-bold text-[#6B6B8A] mb-3", children: [
        "Frog is at: ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#5B4FCF]", children: frogPos })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "grid gap-2",
          style: { gridTemplateColumns: `repeat(${cols}, 1fr)` },
          children: positions.map((pos) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              "data-ocid": `game.answer.item.${pos + 1}`,
              className: `aspect-square rounded-xl font-black text-sm flex items-center justify-center transition-colors active:scale-90 min-h-[44px] ${pos === frogPos ? "bg-[#00C9A7] text-white shadow-md scale-110" : pos === current.target && flash === "correct" ? "bg-[#00C9A7] text-white" : "bg-white text-[#1A1A2E] shadow-sm hover:bg-purple-50"}`,
              onClick: () => handleTap(pos),
              disabled: !!flash,
              children: pos === frogPos ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "frog-bounce inline-block", children: "🐸" }, bounceKey) : pos
            },
            pos
          ))
        }
      )
    ] }),
    flash === "correct" && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-black text-2xl text-[#00C9A7]", children: "Correct! 🎉" }),
    flash === "wrong" && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-black text-2xl text-[#EF476F]", children: "Try again! 💪" })
  ] });
}
export {
  HopToIt
};
