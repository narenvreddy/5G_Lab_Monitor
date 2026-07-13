import { r as reactExports, j as jsxRuntimeExports } from "./index-zTtK-yRg.js";
const ROCK_CSS = `
@keyframes rockPop {
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.5); opacity: 0.5; }
  100% { transform: scale(0); opacity: 0; }
}
@keyframes rockWrong {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-8px); }
  75% { transform: translateX(8px); }
}
`;
const COL_IDS = ["lane-left", "lane-mid", "lane-right"];
const COL_COLORS = ["#5B4FCF", "#FF6B35", "#00C9A7"];
function genTarget(difficulty) {
  const max = difficulty === 0 ? 10 : difficulty === 1 ? 20 : 30;
  return 2 + Math.floor(Math.random() * (max - 1));
}
function genRock(id, target, difficulty, isCorrect) {
  const max = difficulty === 0 ? 9 : difficulty === 1 ? 19 : 29;
  let a;
  let b;
  if (isCorrect) {
    a = 1 + Math.floor(Math.random() * (target - 1));
    b = target - a;
  } else {
    do {
      a = 1 + Math.floor(Math.random() * Math.min(max, target + 5));
      b = 1 + Math.floor(Math.random() * Math.min(max, target + 5));
    } while (a + b === target);
  }
  return {
    id,
    a,
    b,
    col: Math.floor(Math.random() * 3),
    y: 0,
    state: "falling"
  };
}
const FALL_SPEED_BASE = 8e-3;
const ROCK_INTERVAL_BASE = 2e3;
function AdditionAvalanche({ difficulty, onGameOver }) {
  const [target, setTarget] = reactExports.useState(() => genTarget(difficulty));
  const [rocks, setRocks] = reactExports.useState([]);
  const [score, setScore] = reactExports.useState(0);
  const [lives, setLives] = reactExports.useState(3);
  const [gameOver, setGameOver] = reactExports.useState(false);
  const idRef = reactExports.useRef(0);
  const rockRef = reactExports.useRef([]);
  const targetRef = reactExports.useRef(target);
  const scoreRef = reactExports.useRef(0);
  const livesRef = reactExports.useRef(3);
  const gameOverRef = reactExports.useRef(false);
  const animRef = reactExports.useRef(0);
  const lastRef = reactExports.useRef(0);
  const spawnRef = reactExports.useRef(null);
  targetRef.current = target;
  scoreRef.current = score;
  livesRef.current = lives;
  gameOverRef.current = gameOver;
  const spawnRock = reactExports.useCallback(() => {
    if (gameOverRef.current) return;
    const t = targetRef.current;
    const shouldBeCorrect = Math.random() < 0.4;
    const id = ++idRef.current;
    const newRock = genRock(id, t, difficulty, shouldBeCorrect);
    rockRef.current = [...rockRef.current, newRock];
    setRocks([...rockRef.current]);
  }, [difficulty]);
  reactExports.useEffect(() => {
    const interval = Math.max(800, ROCK_INTERVAL_BASE - difficulty * 400);
    spawnRef.current = setInterval(spawnRock, interval);
    return () => {
      if (spawnRef.current) clearInterval(spawnRef.current);
    };
  }, [spawnRock, difficulty]);
  reactExports.useEffect(() => {
    const speed = FALL_SPEED_BASE * (1 + difficulty * 0.5);
    function tick(ts) {
      if (gameOverRef.current) return;
      if (!lastRef.current) lastRef.current = ts;
      const dt = ts - lastRef.current;
      lastRef.current = ts;
      const updated = rockRef.current.map((r) => {
        if (r.state !== "falling") return r;
        const ny = r.y + speed * dt;
        if (ny >= 95) return { ...r, y: 95, state: "falling" };
        return { ...r, y: ny };
      });
      const fallen = updated.filter((r) => r.y >= 95 && r.state === "falling");
      if (fallen.length > 0) {
        const newLives = Math.max(0, livesRef.current - fallen.length);
        livesRef.current = newLives;
        const remaining = updated.filter(
          (r) => r.y < 95 || r.state !== "falling"
        );
        rockRef.current = remaining;
        setLives(newLives);
        setRocks([...remaining]);
        if (newLives <= 0) {
          gameOverRef.current = true;
          setGameOver(true);
          return;
        }
      } else {
        rockRef.current = updated;
        setRocks([...updated]);
      }
      animRef.current = requestAnimationFrame(tick);
    }
    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, [difficulty]);
  reactExports.useEffect(() => {
    if (gameOver) onGameOver(score);
  }, [gameOver, score, onGameOver]);
  reactExports.useEffect(() => {
    const poppingRocks = rocks.filter(
      (r) => r.state === "popping" || r.state === "wrong"
    );
    if (poppingRocks.length === 0) return;
    const t = setTimeout(() => {
      const updated = rockRef.current.filter(
        (r) => r.state !== "popping" && r.state !== "wrong"
      );
      rockRef.current = updated;
      setRocks([...updated]);
    }, 500);
    return () => clearTimeout(t);
  }, [rocks]);
  const handleTapRock = (id) => {
    if (gameOver) return;
    const rock = rockRef.current.find((r) => r.id === id);
    if (!rock || rock.state !== "falling") return;
    const isCorrect = rock.a + rock.b === targetRef.current;
    if (isCorrect) {
      const newScore = scoreRef.current + 10;
      scoreRef.current = newScore;
      setScore(newScore);
      const updated = rockRef.current.map(
        (r) => r.id === id ? { ...r, state: "popping" } : r
      );
      rockRef.current = updated;
      setRocks([...updated]);
      if (newScore % 50 === 0) {
        const newT = genTarget(difficulty);
        targetRef.current = newT;
        setTarget(newT);
      }
    } else {
      const newScore = Math.max(0, scoreRef.current - 5);
      scoreRef.current = newScore;
      setScore(newScore);
      const updated = rockRef.current.map(
        (r) => r.id === id ? { ...r, state: "wrong" } : r
      );
      rockRef.current = updated;
      setRocks([...updated]);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col h-full min-h-[500px] bg-gradient-to-b from-[#1A1A2E] to-[#2D1A4E] select-none overflow-hidden relative", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: ROCK_CSS }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-4 pt-3 pb-2 z-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white/20 rounded-xl px-3 py-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white/70 text-xs", children: "Target sum" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[#FFD166] font-black text-2xl leading-tight", children: target })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1", children: ["h1", "h2", "h3"].map((hk, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "span",
        {
          className: `text-2xl ${i + 1 <= lives ? "" : "opacity-20"}`,
          children: "❤️"
        },
        hk
      )) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white/20 rounded-xl px-3 py-1 text-right", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white/70 text-xs", children: "Score" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[#00C9A7] font-black text-2xl leading-tight", children: score })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center text-white/50 text-xs mb-1", children: "Tap rocks that add up to the target!" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative flex-1 flex", children: COL_IDS.map((colId, col) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 relative border-x border-white/5", children: rocks.filter((r) => r.col === col).map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        "data-ocid": "addition_avalanche.rock.button",
        onClick: () => handleTapRock(r.id),
        style: {
          position: "absolute",
          top: `${r.y}%`,
          left: "50%",
          transform: "translate(-50%, -50%)",
          background: r.state === "popping" ? "#00C9A7" : r.state === "wrong" ? "#EF476F" : COL_COLORS[col],
          animation: r.state === "popping" ? "rockPop 0.5s ease forwards" : r.state === "wrong" ? "rockWrong 0.4s ease" : void 0
        },
        className: "w-16 h-16 rounded-2xl text-white font-black text-base shadow-lg active:scale-90 flex items-center justify-center min-h-[44px] min-w-[44px]",
        children: [
          r.a,
          " + ",
          r.b
        ]
      },
      r.id
    )) }, colId)) })
  ] });
}
export {
  AdditionAvalanche
};
