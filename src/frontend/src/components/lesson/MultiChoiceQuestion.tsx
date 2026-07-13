import { AnimatePresence, motion } from "motion/react";
import React, { useRef } from "react";
import { RobotMascot } from "../RobotMascot";
import { HintPanel } from "./HintPanel";
import { WorkedExamplePanel } from "./WorkedExamplePanel";

type AnswerState = "idle" | "correct" | "wrong";

const CHOICE_COLORS = ["#5B4FCF", "#FF6B35", "#00C9A7", "#EF476F"];
const CHOICE_BADGES = ["1", "2", "3", "4", "5", "6", "7", "8"];

interface MultiChoiceQuestionProps {
  questionText: string;
  visual?: string;
  choices: string[];
  selectedChoice: number | null;
  wrongChoices: Set<number>;
  answerState: AnswerState;
  showHint: boolean;
  showAnswer: boolean;
  showParticle: boolean;
  isFinished: boolean;
  visibleChoiceIndices: number[];
  correctAnswerText: string;
  onChoice: (idx: number) => void;
  mascotMood: string;
}

export const MultiChoiceQuestion = React.memo(function MultiChoiceQuestion({
  questionText,
  visual,
  choices,
  selectedChoice,
  wrongChoices,
  answerState,
  showHint,
  showAnswer,
  showParticle,
  isFinished,
  visibleChoiceIndices,
  correctAnswerText,
  onChoice,
  mascotMood,
}: MultiChoiceQuestionProps) {
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const choiceButtonClass = (idx: number) => {
    const isSelected = selectedChoice === idx;
    const isWrong = wrongChoices.has(idx);
    const isCorrect = isSelected && answerState === "correct";
    const isShaking = isSelected && answerState === "wrong";
    let base =
      "relative w-full py-4 px-4 rounded-2xl font-black text-lg text-white transition-all select-none flex items-center justify-center shadow-md active:scale-95";
    if (isWrong) base += " opacity-40 cursor-not-allowed";
    if (isCorrect) base += " ring-4 ring-green-300";
    if (isShaking) base += " animate-shake";
    return base;
  };

  const visibleButtons = choices
    .map((choice, idx) => ({ choice, idx }))
    .filter(({ idx }) => !showHint || visibleChoiceIndices.includes(idx));

  const handleKeyDown = (e: React.KeyboardEvent, currentIdx: number) => {
    const visibleIdxs = visibleButtons.map((b) => b.idx);
    const pos = visibleIdxs.indexOf(currentIdx);
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const nextPos = (pos + 1) % visibleIdxs.length;
      buttonRefs.current[visibleIdxs[nextPos] ?? 0]?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const prevPos = (pos - 1 + visibleIdxs.length) % visibleIdxs.length;
      buttonRefs.current[visibleIdxs[prevPos] ?? 0]?.focus();
    }
  };

  return (
    <div className="flex flex-col items-center px-4 md:px-8 py-6 gap-4">
      <RobotMascot size={80} mood={mascotMood as any} />

      {visual && (
        <div className="text-6xl leading-none text-center select-none">
          {visual}
        </div>
      )}

      <h3
        id="mc-question-label"
        className="text-2xl font-black text-[#1A1A2E] text-center px-2"
      >
        {questionText}
      </h3>

      <AnimatePresence>
        {showHint && !showAnswer && (
          <motion.div
            key="hint-group-multi"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="w-full max-w-sm"
          >
            <WorkedExamplePanel
              questionText={questionText}
              questionType="multiChoice"
            />
            <HintPanel questionText={questionText} />
            <p className="text-center text-xs text-[#5B4FCF] font-bold mt-2">
              ✨ Choices narrowed down to help you!
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {showAnswer && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#00C9A7] text-white rounded-2xl p-4 text-center font-bold text-lg w-full"
        >
          ✓ The answer is: {correctAnswerText}
        </motion.div>
      )}

      {answerState === "wrong" && !showAnswer && !showHint && (
        <motion.p
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[#EF476F] font-black text-lg"
          aria-live="polite"
        >
          Try again! 💪
        </motion.p>
      )}

      <AnimatePresence>
        {showParticle && !isFinished && (
          <motion.div
            key="particle"
            initial={{ opacity: 1, y: 0, scale: 1 }}
            animate={{ opacity: 0, y: -60, scale: 1.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute top-1/3 left-1/2 -translate-x-1/2 text-4xl pointer-events-none"
            aria-hidden="true"
          >
            +1 ⭐
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2x2 choice grid — fieldset groups choices semantically for screen readers */}
      <fieldset className="grid grid-cols-2 gap-3 w-full max-w-sm md:max-w-md mt-2 border-0 p-0 m-0">
        <legend className="sr-only">Choose your answer: {questionText}</legend>
        {visibleButtons.map(({ choice, idx }) => (
          <button
            type="button"
            key={choice}
            ref={(el) => {
              buttonRefs.current[idx] = el;
            }}
            data-ocid={`lesson.choice.button.${idx + 1}`}
            aria-pressed={selectedChoice === idx}
            className={choiceButtonClass(idx)}
            style={{
              backgroundColor:
                selectedChoice === idx && answerState === "correct"
                  ? "#00C9A7"
                  : wrongChoices.has(idx)
                    ? "#6B6B8A"
                    : CHOICE_COLORS[idx % CHOICE_COLORS.length],
            }}
            onClick={() => onChoice(idx)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            disabled={wrongChoices.has(idx) || answerState === "correct"}
          >
            <span
              className="absolute top-1.5 left-2 text-white/70 font-black text-xs"
              aria-hidden="true"
            >
              {CHOICE_BADGES[idx]}
            </span>
            {choice}
          </button>
        ))}
      </fieldset>
    </div>
  );
});
