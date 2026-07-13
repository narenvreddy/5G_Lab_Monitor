import { r as reactExports, j as jsxRuntimeExports } from "./index-zTtK-yRg.js";
const CSS = `
@keyframes bossIn {
  0% { opacity: 0; transform: scale(0.4) rotate(-10deg); }
  60% { opacity: 1; transform: scale(1.15) rotate(4deg); }
  100% { opacity: 1; transform: scale(1) rotate(0deg); }
}
`;
function gcd(a, b) {
  return b === 0 ? a : gcd(b, a % b);
}
function generatePair(difficulty) {
  const maxDen = difficulty === 0 ? 6 : difficulty === 1 ? 10 : 12;
  let a = [1, 2];
  let b = [1, 3];
  do {
    const denA = 2 + Math.floor(Math.random() * (maxDen - 1));
    const numA = 1 + Math.floor(Math.random() * (denA - 1));
    const gA = gcd(numA, denA);
    a = [numA / gA, denA / gA];
    const denB = 2 + Math.floor(Math.random() * (maxDen - 1));
    const numB = 1 + Math.floor(Math.random() * (denB - 1));
    const gB = gcd(numB, denB);
    b = [numB / gB, denB / gB];
  } while (a[0] / a[1] === b[0] / b[1]);
  return { a, b, largerIsA: a[0] / a[1] > b[0] / b[1] };
}
function FractionDisplay({ num, den }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center leading-none", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-black text-4xl text-white", children: num }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-8 h-0.5 bg-white/80 my-1" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-black text-4xl text-white", children: den })
  ] });
}
function FractionFiend({ difficulty, onGameOver }) {
  const [introPhase, setIntroPhase] = reactExports.useState(true);
  const [bossHp, setBossHp] = reactExports.useState(100);
  const [timeLeft, setTimeLeft] = reactExports.useState(45);
  const [correctCount, setCorrectCount] = reactExports.useState(0);
  const [pair, setPair] = reactExports.useState(() => generatePair(difficulty));
  const [flash, setFlash] = reactExports.useState(null);
  const [gameResult, setGameResult] = reactExports.useState(null);
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
      onGameOver(correctCount * 30);
    }
  }, [gameResult, correctCount, onGameOver]);
  const handleTap = reactExports.useCallback(
    (tappedA) => {
      if (flash !== null || gameResult !== null) return;
      const correct = tappedA === pair.largerIsA;
      if (correct) {
        setCorrectCount((c) => c + 1);
        setFlash("correct");
        setBossHp((hp) => {
          const newHp = Math.max(0, hp - 10);
          if (newHp <= 0) setGameResult("win");
          return newHp;
        });
        setTimeout(() => {
          setFlash(null);
          setPair(generatePair(difficulty));
        }, 400);
      } else {
        setFlash("wrong");
        setBossHp((hp) => Math.min(100, hp + 5));
        setTimeout(() => {
          setFlash(null);
          setPair(generatePair(difficulty));
        }, 500);
      }
    },
    [flash, gameResult, pair, difficulty]
  );
  const hpPct = bossHp / 100;
  const hpColor = hpPct > 0.6 ? "#00C9A7" : hpPct > 0.3 ? "#FFD166" : "#EF476F";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col min-h-[500px] bg-gradient-to-b from-[#1A1A2E] to-[#2D1A3D] p-4 relative", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: CSS }),
    introPhase && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-[#EC4899] to-[#1A1A2E]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        style: {
          animation: "bossIn 0.8s cubic-bezier(0.34,1.56,0.64,1) forwards"
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-8xl text-center mb-3", children: "🧙" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "text-[#FFD166] font-black text-2xl text-center",
              style: { fontFamily: "Nunito, sans-serif" },
              children: "Fraction Fiend!"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-white/70 text-center mt-2 text-sm font-bold", children: "Tap the LARGER fraction!" })
        ]
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-3xl", children: "🧙" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-white font-black text-sm", children: "Fraction Fiend" })
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
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white/60", children: "Fiend HP" }),
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
      ) })
    ] }),
    !gameResult && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-white/70 text-center font-bold text-sm mb-4", children: [
        "Tap the ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#FFD166]", children: "LARGER" }),
        " fraction"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-4", children: [true, false].map((isA) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => handleTap(isA),
          disabled: flash !== null,
          className: `flex-1 min-h-[120px] rounded-3xl flex items-center justify-center transition-all active:scale-95 disabled:opacity-60 ${flash === "correct" ? "bg-[#00C9A7]/30 border-2 border-[#00C9A7]" : flash === "wrong" ? "bg-[#EF476F]/30 border-2 border-[#EF476F]" : "bg-white/15 hover:bg-white/25"}`,
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            FractionDisplay,
            {
              num: isA ? pair.a[0] : pair.b[0],
              den: isA ? pair.a[1] : pair.b[1]
            }
          )
        },
        String(isA)
      )) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-white/40 text-center text-xs mt-3", children: "vs" })
    ] }),
    gameResult && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col items-center justify-center text-center gap-4 py-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-7xl", children: gameResult === "win" ? "💀" : "🧙" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[#FFD166] font-black text-3xl", children: gameResult === "win" ? "Fiend Defeated! ✨" : "Time's Up! 😢" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white/10 rounded-2xl px-8 py-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-white/60 font-bold text-sm", children: "Final Score" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[#FFD166] font-black text-5xl", children: correctCount * 30 })
      ] })
    ] })
  ] });
}
export {
  FractionFiend
};
