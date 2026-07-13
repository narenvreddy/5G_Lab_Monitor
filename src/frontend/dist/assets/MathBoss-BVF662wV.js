import { r as reactExports, j as jsxRuntimeExports } from "./index-zTtK-yRg.js";
const BOSSES = ["👾", "🐲", "🦹", "🤖", "👹"];
const BOSS_NAMES = [
  "Space Invader",
  "Dragon King",
  "Math Villain",
  "Evil Bot",
  "Number Goblin"
];
const HP_SLOTS = ["a", "b", "c", "d", "e"];
function generateQuestion(difficulty) {
  const rnd = (min, max) => min + Math.floor(Math.random() * (max - min + 1));
  const types = difficulty === 0 ? ["add", "sub"] : difficulty === 1 ? ["add", "sub", "mult", "frac"] : ["add", "sub", "mult", "frac", "mixed"];
  const type = types[Math.floor(Math.random() * types.length)];
  if (type === "add") {
    const max = difficulty === 0 ? 20 : 50;
    const a2 = rnd(1, max);
    const b2 = rnd(1, max);
    return makeQ(`${a2} + ${b2}`, a2 + b2);
  }
  if (type === "sub") {
    const max = difficulty === 0 ? 20 : 50;
    const a2 = rnd(5, max);
    const b2 = rnd(1, a2);
    return makeQ(`${a2} − ${b2}`, a2 - b2);
  }
  if (type === "mult") {
    const a2 = rnd(2, difficulty === 1 ? 9 : 12);
    const b2 = rnd(2, difficulty === 1 ? 9 : 12);
    return makeQ(`${a2} × ${b2}`, a2 * b2);
  }
  if (type === "frac") {
    const den = [2, 4, 5][Math.floor(Math.random() * 3)];
    const num = rnd(1, den - 1);
    const mult = rnd(2, 5);
    return makeQ(`${num}/${den} of ${den * mult}`, num * mult);
  }
  const a = rnd(2, 8);
  const b = rnd(2, 8);
  const c = rnd(1, 10);
  return makeQ(`${a} × ${b} + ${c}`, a * b + c);
}
function makeQ(display, answer) {
  const choices = /* @__PURE__ */ new Set();
  choices.add(answer);
  while (choices.size < 4) {
    const offset = [-3, -2, -1, 1, 2, 3, 5, -5, 10, -10][Math.floor(Math.random() * 10)];
    const c = answer + offset;
    if (c >= 0 && c <= 200) choices.add(c);
  }
  return {
    display,
    answer,
    choices: [...choices].sort(() => Math.random() - 0.5)
  };
}
const PLAYER_MAX_HP = 5;
const BOSS_MAX_HP = 5;
const TIME_PER_Q = 6;
function HpBar({
  current,
  max,
  color,
  label
}) {
  const slots = HP_SLOTS.slice(0, max);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-white/80", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-bold text-white", children: [
        current,
        "/",
        max
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 bg-white/20 rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "h-full rounded-full transition-all duration-500",
        style: { width: `${current / max * 100}%`, background: color }
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1 mt-1", children: slots.map((slot, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", children: i < current ? "❤️" : "🖤" }, slot)) })
  ] });
}
function MathBoss({ difficulty, onGameOver }) {
  const [bossIndex] = reactExports.useState(() => Math.floor(Math.random() * BOSSES.length));
  const [question, setQuestion] = reactExports.useState(() => generateQuestion(difficulty));
  const [playerHp, setPlayerHp] = reactExports.useState(PLAYER_MAX_HP);
  const [bossHp, setBossHp] = reactExports.useState(BOSS_MAX_HP);
  const [score, setScore] = reactExports.useState(0);
  const [timer, setTimer] = reactExports.useState(TIME_PER_Q);
  const [flash, setFlash] = reactExports.useState(null);
  const [bossShake, setBossShake] = reactExports.useState(false);
  const [playerShake, setPlayerShake] = reactExports.useState(false);
  const [gameResult, setGameResult] = reactExports.useState(null);
  const timerRef = reactExports.useRef(null);
  const nextQuestion = reactExports.useCallback(() => {
    setQuestion(generateQuestion(difficulty));
    setTimer(TIME_PER_Q);
    setFlash(null);
  }, [difficulty]);
  reactExports.useEffect(() => {
    if (gameResult !== null) return;
    if (flash !== null) return;
    timerRef.current = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          setPlayerHp((hp) => {
            const newHp = hp - 1;
            if (newHp <= 0) setGameResult("lose");
            return newHp;
          });
          setFlash("wrong");
          setPlayerShake(true);
          setTimeout(() => setPlayerShake(false), 600);
          return 0;
        }
        return t - 1;
      });
    }, 1e3);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameResult, flash]);
  reactExports.useEffect(() => {
    if (flash === null || gameResult !== null) return;
    const id = setTimeout(nextQuestion, 900);
    return () => clearTimeout(id);
  }, [flash, gameResult, nextQuestion]);
  reactExports.useEffect(() => {
    if (gameResult !== null) onGameOver(score);
  }, [gameResult, score, onGameOver]);
  const handleAnswer = (choice) => {
    if (flash !== null || gameResult !== null) return;
    if (timerRef.current) clearInterval(timerRef.current);
    if (choice === question.answer) {
      setScore((s) => s + 15);
      setFlash("correct");
      setBossHp((hp) => {
        const newHp = hp - 1;
        if (newHp <= 0) setGameResult("win");
        return newHp;
      });
      setBossShake(true);
      setTimeout(() => setBossShake(false), 600);
    } else {
      setFlash("wrong");
      setPlayerHp((hp) => {
        const newHp = hp - 1;
        if (newHp <= 0) setGameResult("lose");
        return newHp;
      });
      setPlayerShake(true);
      setTimeout(() => setPlayerShake(false), 600);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col h-full min-h-[400px] bg-gradient-to-b from-[#1A1A2E] to-[#2D1A4E] rounded-2xl p-4 relative", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        HpBar,
        {
          current: bossHp,
          max: BOSS_MAX_HP,
          color: "#EF476F",
          label: "👾 Boss"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        HpBar,
        {
          current: playerHp,
          max: PLAYER_MAX_HP,
          color: "#00C9A7",
          label: "🧒 You"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: `flex flex-col items-center mb-4 transition-transform ${bossShake ? "animate-pulse" : ""}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: `text-7xl transition-all duration-300 ${gameResult === "win" ? "scale-150 drop-shadow-[0_0_30px_#FFD166]" : gameResult === "lose" ? "opacity-40 scale-75" : bossShake ? "scale-125 drop-shadow-[0_0_30px_#EF476F]" : "scale-100"} ${flash === "correct" && !gameResult ? "opacity-60" : "opacity-100"}`,
              children: gameResult === "win" ? "💀" : BOSSES[bossIndex]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white/60 font-bold text-xs mt-1", children: gameResult === "win" ? "DEFEATED!" : gameResult === "lose" ? "You fell..." : BOSS_NAMES[bossIndex] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-2 bg-white/20 rounded-full overflow-hidden mb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: `h-full rounded-full transition-all duration-1000 ${timer > TIME_PER_Q * 0.5 ? "bg-[#00C9A7]" : timer > TIME_PER_Q * 0.25 ? "bg-[#FFD166]" : "bg-[#EF476F]"}`,
        style: {
          width: gameResult ? "0%" : `${timer / TIME_PER_Q * 100}%`
        }
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: `bg-white/10 rounded-2xl px-4 py-3 mb-4 text-center ${playerShake ? "border-2 border-[#EF476F]" : ""}`,
        children: [
          gameResult ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[#FFD166] font-black text-2xl", children: gameResult === "win" ? "🎉 Boss Defeated!" : "💀 Game Over" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white font-black text-3xl tracking-wide", children: question.display }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-white/50 text-xs mt-1", children: [
            "Score: ",
            score
          ] })
        ]
      }
    ),
    !gameResult && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2", children: question.choices.map((choice) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        "data-ocid": "math_boss.answer.button",
        onClick: () => handleAnswer(choice),
        className: `
                py-3 rounded-2xl font-black text-lg transition-all
                ${flash === "correct" && choice === question.answer ? "bg-[#00C9A7] text-white scale-105" : flash === "wrong" && choice === question.answer ? "bg-[#00C9A7]/30 text-[#00C9A7]" : "bg-white/15 text-white hover:bg-white/25 active:scale-95"}
              `,
        children: choice
      },
      choice
    )) })
  ] });
}
export {
  MathBoss
};
