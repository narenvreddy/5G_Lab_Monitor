import { r as reactExports, j as jsxRuntimeExports } from "./index-zTtK-yRg.js";
const ANT_CSS = `
@keyframes antMove {
  0% { transform: scale(1); }
  50% { transform: scale(1.3) rotate(-10deg); }
  100% { transform: scale(1); }
}
`;
function buildSequence(difficulty) {
  const moves = ["up", "down", "left", "right"];
  const stepCount = 8;
  const allChoiceSets = {
    up: ["Move up", "Move down", "Move left", "Move right", "Stay put"],
    down: ["Move down", "Move up", "Move right", "Move left", "Stay put"],
    left: ["Move left", "Move right", "Move up", "Move down", "Stay put"],
    right: ["Move right", "Move left", "Move down", "Move up", "Stay put"]
  };
  const moveLabels = {
    up: "Move up",
    down: "Move down",
    left: "Move left",
    right: "Move right"
  };
  const patternLength = difficulty === 0 ? 2 : difficulty === 1 ? 3 : 4;
  const pattern = Array.from(
    { length: patternLength },
    () => moves[Math.floor(Math.random() * moves.length)]
  );
  const path = Array.from(
    { length: stepCount },
    (_, i) => pattern[i % patternLength]
  );
  const steps = path.map((dir, i) => {
    const answer = moveLabels[dir];
    const allOpts = allChoiceSets[dir];
    const wrongs = allOpts.filter((o) => o !== answer).slice(0, 2);
    const choices = [answer, ...wrongs].sort(() => Math.random() - 0.5);
    const stepNum = i + 1;
    const instruction = difficulty === 0 ? `Step ${stepNum}: What does the ant do next?` : difficulty === 1 ? `Step ${stepNum}: The ant follows the pattern. What's next?` : `Step ${stepNum}: The pattern repeats every ${patternLength} steps. Next?`;
    return { instruction, answer, choices };
  });
  return { steps, path };
}
function getAntPos(path, stepsDone) {
  const GRID = 5;
  let x = Math.floor(GRID / 2);
  let y = Math.floor(GRID / 2);
  for (let i = 0; i < stepsDone; i++) {
    const d = path[i];
    if (d === "up") y = Math.max(0, y - 1);
    else if (d === "down") y = Math.min(GRID - 1, y + 1);
    else if (d === "left") x = Math.max(0, x - 1);
    else if (d === "right") x = Math.min(GRID - 1, x + 1);
  }
  return { x, y };
}
const GRID_SIZE = 5;
const TOTAL_ROUNDS = 10;
const GRID_KEYS = Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, i) => {
  const gx = i % GRID_SIZE;
  const gy = Math.floor(i / GRID_SIZE);
  return `cell-${gx}-${gy}`;
});
function AlgorithmAnt({ difficulty, onGameOver }) {
  const [roundNum, setRoundNum] = reactExports.useState(0);
  const [roundGame, setRoundGame] = reactExports.useState(() => buildSequence(difficulty));
  const [currentStep, setCurrentStep] = reactExports.useState(0);
  const [stepsDone, setStepsDone] = reactExports.useState(0);
  const [flash, setFlash] = reactExports.useState(null);
  const [chosen, setChosen] = reactExports.useState(null);
  const [gameOver, setGameOver] = reactExports.useState(false);
  const [currentScore, setCurrentScore] = reactExports.useState(0);
  reactExports.useEffect(() => {
    if (gameOver) onGameOver(currentScore);
  }, [gameOver, currentScore, onGameOver]);
  const handleChoice = reactExports.useCallback(
    (choice) => {
      if (flash !== null || gameOver) return;
      const step2 = roundGame.steps[currentStep];
      setChosen(choice);
      const isCorrect = choice === step2.answer;
      if (isCorrect) {
        setFlash("correct");
        const ns = currentScore + 10;
        setCurrentScore(ns);
        const nextStep = currentStep + 1;
        setCurrentStep(nextStep);
        const nextStepsDone = stepsDone + 1;
        setStepsDone(nextStepsDone);
        setTimeout(() => {
          setFlash(null);
          setChosen(null);
          if (nextStep >= roundGame.steps.length) {
            const nextRound = roundNum + 1;
            if (nextRound >= TOTAL_ROUNDS) {
              setGameOver(true);
            } else {
              setRoundNum(nextRound);
              setRoundGame(buildSequence(difficulty));
              setCurrentStep(0);
              setStepsDone(0);
            }
          }
        }, 600);
      } else {
        setFlash("wrong");
        setTimeout(() => {
          setFlash(null);
          setChosen(null);
        }, 600);
      }
    },
    [
      flash,
      gameOver,
      roundGame,
      currentStep,
      currentScore,
      stepsDone,
      roundNum,
      difficulty
    ]
  );
  const antPos = getAntPos(roundGame.path, stepsDone);
  const step = roundGame.steps[currentStep] ?? roundGame.steps[roundGame.steps.length - 1];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col min-h-[520px] bg-gradient-to-b from-[#F0FFF4] to-[#E6FFED] p-4 gap-4 select-none", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: ANT_CSS }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "bg-[#00C9A7] text-white font-black text-sm px-3 py-1 rounded-xl", children: [
        "Round ",
        roundNum + 1,
        "/",
        TOTAL_ROUNDS
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "bg-[#FFD166] text-[#1A1A2E] font-black text-lg px-4 py-1 rounded-xl", children: [
        "🐜 ",
        currentScore,
        " pts"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-3xl p-3 shadow-md", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center text-xs text-[#6B6B8A] font-bold mb-2", children: "Ant's path (🍎 = food goal)" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "grid mx-auto",
          style: {
            gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
            maxWidth: 240,
            gap: 4
          },
          children: GRID_KEYS.map((cellKey) => {
            const gx = Number(cellKey.split("-")[1]);
            const gy = Number(cellKey.split("-")[2]);
            const isAnt = gx === antPos.x && gy === antPos.y;
            const isFood = gx === GRID_SIZE - 1 && gy === GRID_SIZE - 1;
            return /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                style: { animation: isAnt ? "antMove 0.4s ease" : void 0 },
                className: `w-10 h-10 rounded-lg flex items-center justify-center text-lg font-black ${isAnt ? "bg-[#5B4FCF] text-white" : isFood ? "bg-[#FF6B35] text-white" : "bg-[#F4F2FF]"}`,
                children: isAnt ? "🐜" : isFood ? "🍎" : ""
              },
              cellKey
            );
          })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-2xl p-4 shadow-md text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-black text-base text-[#1A1A2E]", children: step.instruction }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-[#6B6B8A] mt-1", children: [
        "Step ",
        currentStep + 1,
        " of ",
        roundGame.steps.length
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-3", children: step.choices.map((choice) => {
      const isChosen = chosen === choice;
      const isAnswer = choice === step.answer;
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          "data-ocid": "algorithm_ant.choice.button",
          onClick: () => handleChoice(choice),
          className: `py-4 rounded-2xl font-black text-base shadow-md min-h-[44px] transition-all active:scale-95 ${isChosen && flash === "correct" ? "bg-[#00C9A7] text-white scale-[1.02]" : isChosen && flash === "wrong" ? "bg-[#EF476F] text-white" : flash === "correct" && isAnswer ? "bg-[#00C9A7] text-white" : "bg-white text-[#1A1A2E] border-2 border-[#1A1A2E]/10 hover:border-[#00C9A7]"}`,
          children: choice
        },
        choice
      );
    }) })
  ] });
}
export {
  AlgorithmAnt
};
