import { r as reactExports, j as jsxRuntimeExports } from "./index-zTtK-yRg.js";
const CSS = `
@keyframes bossIn {
  0% { opacity: 0; transform: scale(0.4) rotate(-10deg); }
  60% { opacity: 1; transform: scale(1.15) rotate(4deg); }
  100% { opacity: 1; transform: scale(1) rotate(0deg); }
}
`;
function makeChoices(answer) {
  const set = /* @__PURE__ */ new Set([answer]);
  while (set.size < 3) {
    const offset = [-6, -3, -2, 2, 3, 6, 8, -8][Math.floor(Math.random() * 8)];
    const c = answer + offset;
    if (c > 0) set.add(c);
  }
  return [...set].sort(() => Math.random() - 0.5);
}
function generateQuestion(difficulty) {
  const maxTable = difficulty === 0 ? 5 : difficulty === 1 ? 9 : 12;
  const a = 2 + Math.floor(Math.random() * (maxTable - 1));
  const b = 2 + Math.floor(Math.random() * (maxTable - 1));
  return { display: `${a} × ${b}`, answer: a * b, choices: makeChoices(a * b) };
}
function TimesTitan({ difficulty, onGameOver }) {
  const [introPhase, setIntroPhase] = reactExports.useState(true);
  const [bossHp, setBossHp] = reactExports.useState(100);
  const [timeLeft, setTimeLeft] = reactExports.useState(45);
  const [correctCount, setCorrectCount] = reactExports.useState(0);
  const [question, setQuestion] = reactExports.useState(() => generateQuestion(difficulty));
  const [flash, setFlash] = reactExports.useState(null);
  const [gameResult, setGameResult] = reactExports.useState(null);
  const timerRef = reactExports.useRef(null);
  const lastAnswerTimeRef = reactExports.useRef(Date.now());
  reactExports.useEffect(() => {
    const t = setTimeout(() => setIntroPhase(false), 1200);
    return () => clearTimeout(t);
  }, []);
  reactExports.useEffect(() => {
    if (introPhase || gameResult !== null) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setGameResult("lose");
          return 0;
        }
        return t - 1;
      });
    }, 1e3);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [introPhase, gameResult]);
  reactExports.useEffect(() => {
    if (gameResult !== null) {
      if (timerRef.current) clearInterval(timerRef.current);
      const speedBonus = correctCount * 5;
      const finalScore = correctCount * 30 + speedBonus;
      onGameOver(finalScore);
    }
  }, [gameResult, correctCount, onGameOver]);
  const handleAnswer = reactExports.useCallback(
    (choice) => {
      if (flash !== null || gameResult !== null) return;
      const now = Date.now();
      (now - lastAnswerTimeRef.current) / 1e3;
      lastAnswerTimeRef.current = now;
      if (choice === question.answer) {
        setCorrectCount((c) => c + 1);
        setFlash("correct");
        setBossHp((hp) => {
          const newHp = Math.max(0, hp - 10);
          if (newHp <= 0) setGameResult("win");
          return newHp;
        });
        setTimeout(() => {
          setFlash(null);
          setQuestion(generateQuestion(difficulty));
        }, 300);
      } else {
        setFlash("wrong");
        setBossHp((hp) => Math.min(100, hp + 5));
        setTimeout(() => {
          setFlash(null);
          setQuestion(generateQuestion(difficulty));
        }, 400);
      }
    },
    [flash, gameResult, question, difficulty]
  );
  const hpPct = bossHp / 100;
  const hpColor = hpPct > 0.6 ? "#00C9A7" : hpPct > 0.3 ? "#FFD166" : "#EF476F";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col min-h-[500px] bg-gradient-to-b from-[#1A1A2E] to-[#1A2E3D] p-4 relative", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: CSS }),
    introPhase && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-[#F59E0B] to-[#1A1A2E]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        style: {
          animation: "bossIn 0.8s cubic-bezier(0.34,1.56,0.64,1) forwards"
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-8xl text-center mb-3", children: "🦾" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "text-[#FFD166] font-black text-2xl text-center",
              style: { fontFamily: "Nunito, sans-serif" },
              children: "Times Titan!"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-white/70 text-center mt-2 text-sm font-bold", children: "Answer multiplication fast!" })
        ]
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-3xl", children: "🦾" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-white font-black text-sm", children: "Times Titan" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-end gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: `font-black text-lg ${timeLeft <= 10 ? "text-[#EF476F] animate-pulse" : "text-white"}`,
            children: [
              "⏱ ",
              timeLeft,
              "s"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[#FFD166] font-black text-sm", children: [
          "✅ ",
          correctCount
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs font-bold mb-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white/60", children: "Boss HP" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-white", children: [
          bossHp,
          "/100"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-4 bg-white/20 rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "h-full rounded-full transition-all duration-300",
          style: { width: `${bossHp}%`, background: hpColor }
        }
      ) }),
      flash === "wrong" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[#EF476F] text-xs font-bold mt-1 text-center", children: "Boss healed +5! ❤️‍🔥" })
    ] }),
    !gameResult && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: `bg-white/10 rounded-2xl px-4 py-6 mb-4 text-center ${flash === "wrong" ? "border-2 border-[#EF476F]" : flash === "correct" ? "border-2 border-[#00C9A7]" : ""}`,
          children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-white font-black text-5xl tracking-wide", children: question.display })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-3", children: question.choices.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => handleAnswer(c),
          disabled: flash !== null,
          className: "flex-1 min-h-[56px] rounded-2xl font-black text-2xl text-white bg-white/15 active:scale-95 transition-transform disabled:opacity-60",
          children: c
        },
        c
      )) })
    ] }),
    gameResult && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col items-center justify-center text-center gap-4 py-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-7xl", children: gameResult === "win" ? "💀" : "🦾" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[#FFD166] font-black text-3xl", children: gameResult === "win" ? "Titan Toppled! 💥" : "Time's Up! 😢" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white/10 rounded-2xl px-8 py-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-white/60 font-bold text-sm", children: "Final Score" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[#FFD166] font-black text-5xl", children: correctCount * 30 + correctCount * 5 })
      ] })
    ] })
  ] });
}
export {
  TimesTitan
};
