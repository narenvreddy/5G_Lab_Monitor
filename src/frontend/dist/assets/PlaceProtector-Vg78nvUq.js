import { r as reactExports, j as jsxRuntimeExports } from "./index-zTtK-yRg.js";
const CSS = `
@keyframes bossIn {
  0% { opacity: 0; transform: scale(0.4) rotate(-10deg); }
  60% { opacity: 1; transform: scale(1.15) rotate(4deg); }
  100% { opacity: 1; transform: scale(1) rotate(0deg); }
}
`;
const SHIELD_SLOTS = [0, 1, 2, 3, 4];
function generateQuestion() {
  const num = 100 + Math.floor(Math.random() * 900);
  const places = [
    "hundreds",
    "tens",
    "ones"
  ];
  const place = places[Math.floor(Math.random() * 3)];
  const digits = {
    hundreds: Math.floor(num / 100),
    tens: Math.floor(num % 100 / 10),
    ones: num % 10
  };
  const answer = digits[place];
  const set = /* @__PURE__ */ new Set([answer]);
  while (set.size < 3) {
    const c = Math.floor(Math.random() * 10);
    set.add(c);
  }
  return {
    number: num,
    place,
    answer,
    choices: [...set].sort(() => Math.random() - 0.5)
  };
}
function PlaceProtector({ difficulty, onGameOver }) {
  const [introPhase, setIntroPhase] = reactExports.useState(true);
  const [shields, setShields] = reactExports.useState(5);
  const [timeLeft, setTimeLeft] = reactExports.useState(60);
  const [score, setScore] = reactExports.useState(0);
  const [wrongCount, setWrongCount] = reactExports.useState(0);
  const [question, setQuestion] = reactExports.useState(() => generateQuestion());
  const [flash, setFlash] = reactExports.useState(null);
  const [gameResult, setGameResult] = reactExports.useState(
    null
  );
  const timerRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    const t = setTimeout(() => setIntroPhase(false), 1200);
    return () => clearTimeout(t);
  }, []);
  reactExports.useEffect(() => {
    if (introPhase || gameResult !== null) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setGameResult("end");
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
      onGameOver(Math.max(0, score));
    }
  }, [gameResult, score, onGameOver]);
  const handleAnswer = reactExports.useCallback(
    (choice) => {
      if (flash !== null || gameResult !== null) return;
      if (choice === question.answer) {
        setScore((s) => s + 40);
        setFlash("correct");
        setTimeout(() => {
          setFlash(null);
          setQuestion(generateQuestion());
        }, 400);
      } else {
        setWrongCount((w) => w + 1);
        setScore((s) => s - 20);
        setShields((sh) => {
          const newSh = sh - 1;
          if (newSh <= 0) setGameResult("lose");
          return Math.max(0, newSh);
        });
        setFlash("wrong");
        setTimeout(() => {
          setFlash(null);
          setQuestion(generateQuestion());
        }, 500);
      }
    },
    [flash, gameResult, question]
  );
  const placeLabel = { hundreds: "HUNDREDS", tens: "TENS", ones: "ONES" }[question.place];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col min-h-[500px] bg-gradient-to-b from-[#1A1A2E] to-[#1A2D2E] p-4 relative", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: CSS }),
    introPhase && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-[#14B8A6] to-[#1A1A2E]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        style: {
          animation: "bossIn 0.8s cubic-bezier(0.34,1.56,0.64,1) forwards"
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-8xl text-center mb-3", children: "🏰" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "text-[#FFD166] font-black text-2xl text-center",
              style: { fontFamily: "Nunito, sans-serif" },
              children: "Place Protector!"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-white/70 text-center mt-2 text-sm font-bold", children: "Defend the castle!" })
        ]
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-3xl", children: "🏰" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-white font-black text-sm", children: "Place Protector" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1", children: SHIELD_SLOTS.map((slot) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", children: slot < shields ? "🛡️" : "💔" }, slot)) })
        ] })
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
          "⭐ ",
          score
        ] })
      ] })
    ] }),
    !gameResult && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: `bg-white/10 rounded-2xl px-4 py-5 mb-4 text-center ${flash === "wrong" ? "border-2 border-[#EF476F]" : flash === "correct" ? "border-2 border-[#00C9A7]" : ""}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-white/60 font-bold text-sm mb-1", children: "What digit is in the" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[#FFD166] font-black text-xl mb-2", children: [
              placeLabel,
              " place?"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-white font-black text-6xl tracking-widest", children: question.number })
          ]
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
      )) }),
      wrongCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[#EF476F] text-xs font-bold text-center mt-3", children: [
        "Wrong answers: ",
        wrongCount,
        " ⚠️"
      ] })
    ] }),
    gameResult && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col items-center justify-center text-center gap-4 py-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-7xl", children: gameResult === "lose" ? "🏚️" : "🏰" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[#FFD166] font-black text-3xl", children: gameResult === "lose" ? "Castle Fell! 😢" : "Time's Up! 🎉" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white/10 rounded-2xl px-8 py-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-white/60 font-bold text-sm", children: "Final Score" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[#FFD166] font-black text-5xl", children: Math.max(0, score) })
      ] })
    ] })
  ] });
}
export {
  PlaceProtector
};
