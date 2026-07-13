import { r as reactExports, j as jsxRuntimeExports } from "./index-zTtK-yRg.js";
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
function genTarget(difficulty) {
  if (difficulty === 0) return randInt(10, 99);
  if (difficulty === 1) return randInt(100, 999);
  return randInt(100, 999);
}
function BlockRow({
  count,
  color,
  label
}) {
  const blockIndices = Array.from({ length: Math.min(count, 20) }, (_, i) => i);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-16 text-right font-bold text-[#6B6B8A] text-sm", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1 flex-wrap flex-1", children: [
      blockIndices.map((blockIdx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          style: {
            width: 16,
            height: 16,
            backgroundColor: color,
            borderRadius: 3
          }
        },
        `block-${blockIdx}`
      )),
      count > 20 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-bold", style: { color }, children: [
        "+",
        count - 20
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-8 font-black text-lg", style: { color }, children: count })
  ] });
}
function BlockBuilder({ difficulty, onGameOver }) {
  const [round, setRound] = reactExports.useState(0);
  const [target, setTarget] = reactExports.useState(() => genTarget(difficulty));
  const [hundreds, setHundreds] = reactExports.useState(0);
  const [tens, setTens] = reactExports.useState(0);
  const [ones, setOnes] = reactExports.useState(0);
  const [flash, setFlash] = reactExports.useState(null);
  const [score, setScore] = reactExports.useState(0);
  const totalRounds = 8;
  const targetH = Math.floor(target / 100);
  const targetT = Math.floor(target % 100 / 10);
  const targetO = target % 10;
  const showHundreds = difficulty >= 1 || targetH > 0;
  const handleSubmit = () => {
    if (flash) return;
    const built = hundreds * 100 + tens * 10 + ones;
    if (built === target) {
      const newScore = score + 15;
      setScore(newScore);
      setFlash("correct");
      setTimeout(() => {
        const next = round + 1;
        if (next >= totalRounds) {
          onGameOver(newScore);
        } else {
          setRound(next);
          setTarget(genTarget(difficulty));
          setHundreds(0);
          setTens(0);
          setOnes(0);
          setFlash(null);
        }
      }, 800);
    } else {
      setFlash("wrong");
      setTimeout(() => {
        setHundreds(targetH);
        setTens(targetT);
        setOnes(targetO);
        setFlash(null);
      }, 900);
    }
  };
  const Counter = ({
    label,
    value,
    onChange,
    color
  }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-1", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-sm", style: { color }, children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        className: "w-12 h-12 rounded-xl font-black text-xl text-white shadow-md active:scale-95",
        style: { backgroundColor: color },
        onClick: () => onChange(Math.min(value + 1, 9)),
        "data-ocid": "game.toggle",
        children: "▲"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-black text-3xl", style: { color }, children: value }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        className: "w-12 h-12 rounded-xl font-black text-xl text-white shadow-md active:scale-95",
        style: { backgroundColor: color },
        onClick: () => onChange(Math.max(value - 1, 0)),
        "data-ocid": "game.toggle",
        children: "▼"
      }
    )
  ] });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center p-4 gap-4 pt-6", children: [
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
        className: `w-full max-w-sm py-6 rounded-3xl text-center shadow-md transition-colors ${flash === "correct" ? "bg-[#00C9A7]" : flash === "wrong" ? "bg-[#EF476F]" : "bg-white"}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[#6B6B8A] font-bold", children: "Build this number:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-black text-7xl text-[#1A1A2E]", children: target })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white rounded-3xl p-4 shadow-md w-full max-w-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-center gap-6", children: [
      showHundreds && /* @__PURE__ */ jsxRuntimeExports.jsx(
        Counter,
        {
          label: "100s",
          value: hundreds,
          onChange: setHundreds,
          color: "#5B4FCF"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Counter,
        {
          label: "10s",
          value: tens,
          onChange: setTens,
          color: "#FF6B35"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Counter, { label: "1s", value: ones, onChange: setOnes, color: "#00C9A7" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-3xl p-3 w-full max-w-sm shadow-sm", children: [
      showHundreds && /* @__PURE__ */ jsxRuntimeExports.jsx(BlockRow, { count: hundreds, color: "#5B4FCF", label: "Hundreds" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(BlockRow, { count: tens, color: "#FF6B35", label: "Tens" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(BlockRow, { count: ones, color: "#00C9A7", label: "Ones" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center font-black text-2xl mt-2 text-[#1A1A2E]", children: hundreds * 100 + tens * 10 + ones })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        "data-ocid": "game.primary_button",
        className: "w-full max-w-sm py-4 rounded-2xl font-black text-xl text-white shadow-lg active:scale-95 transition-transform",
        style: { backgroundColor: "#5B4FCF" },
        onClick: handleSubmit,
        disabled: !!flash,
        children: "✅ Check!"
      }
    )
  ] });
}
export {
  BlockBuilder
};
