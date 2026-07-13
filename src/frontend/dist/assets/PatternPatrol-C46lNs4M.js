import { r as reactExports, j as jsxRuntimeExports } from "./index-zTtK-yRg.js";
function generateQuestion(difficulty, qNum) {
  if (difficulty === 0) {
    const step2 = Math.random() < 0.5 ? 2 : 5;
    const start2 = 1 + Math.floor(Math.random() * 10);
    const length2 = 5;
    const seq2 = Array.from({ length: length2 }, (_, i) => start2 + i * step2);
    const blankIndex2 = 1 + Math.floor(Math.random() * (length2 - 2));
    const answer2 = seq2[blankIndex2];
    const choices2 = shuffleChoices(answer2, seq2, 1, 50);
    const display2 = seq2.map(
      (v, i) => i === blankIndex2 ? null : v
    );
    return { sequence: display2, answer: answer2, choices: choices2, blankIndex: blankIndex2 };
  }
  if (difficulty === 1) {
    const mult = 2 + Math.floor(Math.random() * 2);
    const start2 = 1 + Math.floor(Math.random() * 5);
    const length2 = 5;
    const seq2 = Array.from({ length: length2 }, (_, i) => start2 * mult ** i);
    const blankIndex2 = 1 + Math.floor(Math.random() * (length2 - 2));
    const answer2 = Math.round(seq2[blankIndex2]);
    const choices2 = shuffleChoices(answer2, seq2.map(Math.round), 1, 200);
    const display2 = seq2.map(
      (v, i) => i === blankIndex2 ? null : Math.round(v)
    );
    return { sequence: display2, answer: answer2, choices: choices2, blankIndex: blankIndex2 };
  }
  const types = ["add", "mult", "sub"];
  const t = types[qNum % types.length];
  if (t === "add") {
    const step2 = 3 + Math.floor(Math.random() * 7);
    const start2 = 5 + Math.floor(Math.random() * 20);
    const length2 = 5;
    const seq2 = Array.from({ length: length2 }, (_, i) => start2 + i * step2);
    const blankIndex2 = 1 + Math.floor(Math.random() * (length2 - 2));
    const answer2 = seq2[blankIndex2];
    const choices2 = shuffleChoices(answer2, seq2, 1, 100);
    const display2 = seq2.map(
      (v, i) => i === blankIndex2 ? null : v
    );
    return { sequence: display2, answer: answer2, choices: choices2, blankIndex: blankIndex2 };
  }
  if (t === "mult") {
    const mult = 2 + Math.floor(Math.random() * 3);
    const start2 = 1 + Math.floor(Math.random() * 4);
    const length2 = 5;
    const seq2 = Array.from({ length: length2 }, (_, i) => start2 * mult ** i);
    const blankIndex2 = 1 + Math.floor(Math.random() * (length2 - 2));
    const answer2 = Math.round(seq2[blankIndex2]);
    const choices2 = shuffleChoices(answer2, seq2.map(Math.round), 1, 500);
    const display2 = seq2.map(
      (v, i) => i === blankIndex2 ? null : Math.round(v)
    );
    return { sequence: display2, answer: answer2, choices: choices2, blankIndex: blankIndex2 };
  }
  const step = 3 + Math.floor(Math.random() * 7);
  const start = 50 + Math.floor(Math.random() * 50);
  const length = 5;
  const seq = Array.from({ length }, (_, i) => start - i * step);
  const blankIndex = 1 + Math.floor(Math.random() * (length - 2));
  const answer = seq[blankIndex];
  const choices = shuffleChoices(answer, seq, 1, 100);
  const display = seq.map(
    (v, i) => i === blankIndex ? null : v
  );
  return { sequence: display, answer, choices, blankIndex };
}
function shuffleChoices(answer, seq, min, max) {
  const wrong = /* @__PURE__ */ new Set();
  wrong.add(answer);
  while (wrong.size < 4) {
    const offset = [-3, -2, -1, 1, 2, 3, 5, -5, 10, -10][Math.floor(Math.random() * 10)];
    const c = answer + offset;
    if (c >= min && c <= max && !seq.includes(c)) wrong.add(c);
  }
  return [...wrong].sort(() => Math.random() - 0.5);
}
const TOTAL_QUESTIONS = 10;
const TIME_PER_Q = 5;
function PatternPatrol({ difficulty, onGameOver }) {
  const [qNum, setQNum] = reactExports.useState(0);
  const [question, setQuestion] = reactExports.useState(
    () => generateQuestion(difficulty, 0)
  );
  const [score, setScore] = reactExports.useState(0);
  const [timer, setTimer] = reactExports.useState(TIME_PER_Q);
  const [flash, setFlash] = reactExports.useState(null);
  const [revealAnswer, setRevealAnswer] = reactExports.useState(null);
  const [gameOver, setGameOver] = reactExports.useState(false);
  const timerRef = reactExports.useRef(null);
  const nextQuestion = reactExports.useCallback(() => {
    const next = qNum + 1;
    if (next >= TOTAL_QUESTIONS) {
      setGameOver(true);
    } else {
      setQNum(next);
      setQuestion(generateQuestion(difficulty, next));
      setTimer(TIME_PER_Q);
      setFlash(null);
      setRevealAnswer(null);
    }
  }, [qNum, difficulty]);
  reactExports.useEffect(() => {
    if (gameOver || flash !== null) return;
    timerRef.current = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          setFlash("wrong");
          setRevealAnswer(question.answer);
          return 0;
        }
        return t - 1;
      });
    }, 1e3);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameOver, flash, question.answer]);
  reactExports.useEffect(() => {
    if (flash === null) return;
    const id = setTimeout(nextQuestion, 1200);
    return () => clearTimeout(id);
  }, [flash, nextQuestion]);
  reactExports.useEffect(() => {
    if (gameOver) onGameOver(score);
  }, [gameOver, score, onGameOver]);
  const handleAnswer = (choice) => {
    if (flash !== null || gameOver) return;
    if (timerRef.current) clearInterval(timerRef.current);
    if (choice === question.answer) {
      setScore((s) => s + 15);
      setFlash("correct");
    } else {
      setFlash("wrong");
      setRevealAnswer(choice === question.answer ? null : question.answer);
    }
  };
  const timerPct = timer / TIME_PER_Q * 100;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex flex-col h-full min-h-[400px] bg-gradient-to-b from-[#FF6B35]/10 to-[#F4F2FF] rounded-2xl p-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "bg-[#5B4FCF] text-white rounded-xl px-3 py-1 font-black text-sm", children: [
        qNum + 1,
        "/",
        TOTAL_QUESTIONS
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "bg-[#FFD166] text-[#1A1A2E] rounded-xl px-3 py-1 font-black text-lg", children: [
        score,
        " pts"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-3 bg-gray-200 rounded-full overflow-hidden mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: `h-full rounded-full transition-all duration-1000 ${timerPct > 50 ? "bg-[#00C9A7]" : timerPct > 25 ? "bg-[#FFD166]" : "bg-[#EF476F]"}`,
        style: { width: `${timerPct}%` }
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center text-[#6B6B8A] font-bold text-sm mb-4", children: "What number completes the sequence?" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center gap-2 flex-wrap mb-6", children: question.sequence.map((val, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: `w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg border-2 ${val === null ? "border-[#5B4FCF] bg-[#5B4FCF]/10 text-[#5B4FCF] text-2xl" : "border-[#1A1A2E]/20 bg-white text-[#1A1A2E]"}`,
        children: val === null ? "?" : val
      },
      `seq-${i}-${val ?? "blank"}`
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3", children: question.choices.map((choice) => {
      const isCorrect = choice === question.answer;
      const isReveal = revealAnswer !== null && isCorrect;
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          "data-ocid": "pattern_patrol.answer.button",
          onClick: () => handleAnswer(choice),
          className: `
                py-4 rounded-2xl font-black text-xl transition-all
                ${isReveal ? "bg-[#00C9A7] text-white scale-105" : flash === "correct" && isCorrect ? "bg-[#00C9A7] text-white scale-105" : flash === "wrong" && !isCorrect ? "bg-gray-200 text-gray-400" : "bg-white text-[#1A1A2E] border-2 border-[#1A1A2E]/10 hover:border-[#5B4FCF] active:scale-95"}
              `,
          children: choice
        },
        choice
      );
    }) }),
    flash && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: `absolute inset-0 rounded-2xl flex items-center justify-center pointer-events-none ${flash === "correct" ? "bg-[#00C9A7]/20" : "bg-[#EF476F]/20"}`,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-6xl", children: flash === "correct" ? "✅" : "❌" })
      }
    )
  ] });
}
export {
  PatternPatrol
};
