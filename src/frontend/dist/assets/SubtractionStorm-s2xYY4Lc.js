import { r as reactExports, j as jsxRuntimeExports } from "./index-zTtK-yRg.js";
const STORM_CSS = `
@keyframes cloudAppear {
  from { transform: scale(0.6); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
@keyframes cloudPop {
  0% { transform: scale(1); }
  50% { transform: scale(1.3); }
  100% { transform: scale(0); opacity: 0; }
}
@keyframes cloudWrong {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-6px); }
  75% { transform: translateX(6px); }
}
`;
function genClouds(difficulty, targetAnswer) {
  const maxA = difficulty === 0 ? 10 : difficulty === 1 ? 20 : 30;
  const correct = {
    id: 1,
    a: targetAnswer + Math.floor(Math.random() * Math.min(5, maxA - targetAnswer)),
    b: 0,
    state: "idle"
  };
  correct.b = correct.a - targetAnswer;
  const clouds = [correct];
  let id = 2;
  while (clouds.length < 6) {
    const a = Math.max(2, Math.floor(Math.random() * maxA) + 1);
    const b = Math.floor(Math.random() * a);
    if (a - b !== targetAnswer) {
      clouds.push({ id: id++, a, b, state: "idle" });
    }
  }
  for (let i = clouds.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [clouds[i], clouds[j]] = [clouds[j], clouds[i]];
  }
  return clouds;
}
function genTarget(difficulty) {
  const max = difficulty === 0 ? 9 : difficulty === 1 ? 18 : 27;
  return 1 + Math.floor(Math.random() * max);
}
const ROUND_TIME = 60;
function SubtractionStorm({ difficulty, onGameOver }) {
  const [target, setTarget] = reactExports.useState(() => genTarget(difficulty));
  const [clouds, setClouds] = reactExports.useState(
    () => genClouds(difficulty, genTarget(difficulty))
  );
  const [score, setScore] = reactExports.useState(0);
  const [timeLeft, setTimeLeft] = reactExports.useState(ROUND_TIME);
  const [gameOver, setGameOver] = reactExports.useState(false);
  const [answering, setAnswering] = reactExports.useState(false);
  const targetRef = reactExports.useRef(target);
  targetRef.current = target;
  reactExports.useEffect(() => {
    if (gameOver) return;
    const id = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setGameOver(true);
          return 0;
        }
        return t - 1;
      });
    }, 1e3);
    return () => clearInterval(id);
  }, [gameOver]);
  reactExports.useEffect(() => {
    if (gameOver) onGameOver(score);
  }, [gameOver, score, onGameOver]);
  const advance = reactExports.useCallback(() => {
    const newTarget = genTarget(difficulty);
    setTarget(newTarget);
    setClouds(genClouds(difficulty, newTarget));
    setAnswering(false);
  }, [difficulty]);
  const handleTap = (cloud) => {
    if (gameOver || answering) return;
    const isCorrect = cloud.a - cloud.b === targetRef.current;
    setAnswering(true);
    if (isCorrect) {
      setScore((s) => s + 10);
      setClouds(
        (prev) => prev.map((c) => c.id === cloud.id ? { ...c, state: "correct" } : c)
      );
      setTimeout(() => advance(), 700);
    } else {
      setClouds(
        (prev) => prev.map((c) => c.id === cloud.id ? { ...c, state: "wrong" } : c)
      );
      setTimeout(() => {
        setClouds(
          (prev) => prev.map((c) => c.id === cloud.id ? { ...c, state: "idle" } : c)
        );
        setAnswering(false);
      }, 500);
    }
  };
  const timerPct = timeLeft / ROUND_TIME * 100;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col min-h-[480px] bg-gradient-to-b from-[#1E3A5F] to-[#2D5986] p-4 gap-4 select-none", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: STORM_CSS }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white/20 rounded-xl px-3 py-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/70 text-xs", children: "Score" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[#FFD166] font-black text-2xl leading-tight", children: score })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 mx-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-3 bg-white/20 rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: `h-full rounded-full transition-all duration-1000 ${timerPct > 50 ? "bg-[#00C9A7]" : timerPct > 20 ? "bg-[#FFD166]" : "bg-[#EF476F]"}`,
            style: { width: `${timerPct}%` }
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-center text-white/60 text-xs mt-1", children: [
          timeLeft,
          "s left"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white/15 rounded-3xl p-4 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/70 font-bold text-sm", children: "Find the cloud that equals:" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[#FFD166] font-black text-5xl", children: target })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3 flex-1", children: clouds.map((cloud) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        "data-ocid": "subtraction_storm.cloud.button",
        onClick: () => handleTap(cloud),
        style: {
          animation: cloud.state === "correct" ? "cloudPop 0.6s ease forwards" : cloud.state === "wrong" ? "cloudWrong 0.4s ease" : "cloudAppear 0.3s ease"
        },
        className: `py-5 rounded-2xl font-black text-xl shadow-lg min-h-[44px] transition-colors active:scale-95 ${cloud.state === "correct" ? "bg-[#00C9A7] text-white" : cloud.state === "wrong" ? "bg-[#EF476F] text-white" : "bg-white/90 text-[#1A1A2E]"}`,
        children: [
          "⛈️ ",
          cloud.a,
          " − ",
          cloud.b
        ]
      },
      cloud.id
    )) })
  ] });
}
export {
  SubtractionStorm
};
