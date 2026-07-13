import { r as reactExports, j as jsxRuntimeExports } from "./index-zTtK-yRg.js";
function generateEquation(difficulty, index) {
  const rnd = (min, max) => min + Math.floor(Math.random() * (max - min + 1));
  if (difficulty === 0) {
    const type = index % 2 === 0 ? "add" : "sub";
    if (type === "add") {
      const x3 = rnd(1, 20);
      const a3 = rnd(1, 20);
      return makeEq(`x + ${a3} = ${x3 + a3}`, x3);
    }
    const x2 = rnd(5, 25);
    const a2 = rnd(1, x2 - 1);
    return makeEq(`x − ${a2} = ${x2 - a2}`, x2);
  }
  if (difficulty === 1) {
    const type = index % 3;
    if (type === 0) {
      const x3 = rnd(2, 12);
      const a3 = rnd(2, 9);
      return makeEq(`${a3} × x = ${a3 * x3}`, x3);
    }
    if (type === 1) {
      const x3 = rnd(1, 15);
      const a3 = rnd(1, 15);
      return makeEq(`x + ${a3} = ${x3 + a3}`, x3);
    }
    const x2 = rnd(1, 20);
    const a2 = rnd(1, x2);
    return makeEq(`x − ${a2} = ${x2 - a2}`, x2);
  }
  const a = rnd(2, 5);
  const x = rnd(1, 10);
  const b = rnd(1, 15);
  const c = a * x + b;
  return makeEq(`${a}x + ${b} = ${c}`, x);
}
function makeEq(display, answer) {
  const choices = /* @__PURE__ */ new Set();
  choices.add(answer);
  while (choices.size < 4) {
    const offset = [-3, -2, -1, 1, 2, 3, 5, -5][Math.floor(Math.random() * 8)];
    const c = answer + offset;
    if (c > 0 && c < 50) choices.add(c);
  }
  return {
    display,
    answer,
    choices: [...choices].sort(() => Math.random() - 0.5)
  };
}
const TOTAL_EQUATIONS = 8;
function AlgebraEscape({ difficulty, onGameOver }) {
  const [eqIndex, setEqIndex] = reactExports.useState(0);
  const [equation, setEquation] = reactExports.useState(
    () => generateEquation(difficulty, 0)
  );
  const [score, setScore] = reactExports.useState(0);
  const [correct, setCorrect] = reactExports.useState(0);
  const [flash, setFlash] = reactExports.useState(null);
  const [revealAnswer, setRevealAnswer] = reactExports.useState(null);
  const [doorOpen, setDoorOpen] = reactExports.useState(false);
  const [gameOver, setGameOver] = reactExports.useState(false);
  const [startTime] = reactExports.useState(Date.now());
  reactExports.useEffect(() => {
    if (gameOver) onGameOver(score);
  }, [gameOver, score, onGameOver]);
  const nextEquation = reactExports.useCallback(() => {
    const next = eqIndex + 1;
    if (next >= TOTAL_EQUATIONS) {
      const elapsed = Math.round((Date.now() - startTime) / 1e3);
      const timeBonus = Math.max(0, 60 - elapsed);
      setScore((s) => s + timeBonus);
      setGameOver(true);
    } else {
      setEqIndex(next);
      setEquation(generateEquation(difficulty, next));
      setFlash(null);
      setRevealAnswer(null);
      setDoorOpen(false);
    }
  }, [eqIndex, difficulty, startTime]);
  reactExports.useEffect(() => {
    if (flash === null) return;
    const id = setTimeout(nextEquation, flash === "correct" ? 900 : 1200);
    return () => clearTimeout(id);
  }, [flash, nextEquation]);
  const handleAnswer = (choice) => {
    if (flash !== null || gameOver) return;
    if (choice === equation.answer) {
      setCorrect((c) => c + 1);
      setScore((s) => s + 20);
      setFlash("correct");
      setDoorOpen(true);
    } else {
      setFlash("wrong");
      setRevealAnswer(equation.answer);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex flex-col h-full min-h-[400px] bg-gradient-to-b from-[#5B4FCF]/10 to-[#F4F2FF] rounded-2xl p-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "bg-[#5B4FCF] text-white rounded-xl px-3 py-1 font-black text-sm", children: [
        eqIndex + 1,
        "/",
        TOTAL_EQUATIONS
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "bg-[#FFD166] text-[#1A1A2E] rounded-xl px-3 py-1 font-black text-lg", children: [
        score,
        " pts"
      ] }),
      correct > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "bg-[#00C9A7] text-white rounded-xl px-3 py-1 font-black text-sm", children: [
        "✓ ",
        correct
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: `text-7xl mb-2 transition-all duration-500 ${gameOver ? "scale-150 drop-shadow-[0_0_30px_#00C9A7]" : doorOpen ? "scale-125" : "scale-100"} ${flash === "correct" ? "drop-shadow-[0_0_20px_#00C9A7]" : ""}`,
          children: gameOver ? "🎉" : doorOpen ? "🔓" : "🚪"
        }
      ),
      gameOver ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-black text-2xl text-[#5B4FCF]", children: "Escaped!" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[#6B6B8A] font-bold text-sm", children: [
          correct,
          "/",
          TOTAL_EQUATIONS,
          " correct · time bonus included"
        ] })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: `bg-white rounded-2xl px-6 py-4 shadow-md border-2 ${flash === "correct" ? "border-[#00C9A7]" : flash === "wrong" ? "border-[#EF476F]" : "border-[#5B4FCF]/20"}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-black text-3xl text-[#1A1A2E] text-center tracking-wide", children: equation.display }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center text-[#6B6B8A] font-bold mt-1 text-sm", children: "Find x" })
          ]
        }
      )
    ] }),
    !gameOver && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3", children: equation.choices.map((choice) => {
      const isCorrect = choice === equation.answer;
      const isReveal = revealAnswer !== null && isCorrect;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          "data-ocid": "algebra_escape.answer.button",
          onClick: () => handleAnswer(choice),
          className: `
                  py-4 rounded-2xl font-black text-xl transition-all
                  ${isReveal ? "bg-[#00C9A7] text-white scale-105" : flash === "correct" && isCorrect ? "bg-[#00C9A7] text-white scale-105" : flash === "wrong" && !isCorrect && flash !== null ? "bg-gray-200 text-gray-400" : "bg-white text-[#1A1A2E] border-2 border-[#1A1A2E]/10 hover:border-[#5B4FCF] active:scale-95"}
                `,
          children: [
            "x = ",
            choice
          ]
        },
        choice
      );
    }) }),
    flash && !gameOver && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: `absolute inset-0 rounded-2xl flex items-center justify-center pointer-events-none ${flash === "correct" ? "bg-[#00C9A7]/20" : "bg-[#EF476F]/20"}`,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-6xl", children: flash === "correct" ? "✅" : "❌" })
      }
    )
  ] });
}
export {
  AlgebraEscape
};
