import { AnimatePresence, motion } from "motion/react";
import React, { useState } from "react";
import { RobotMascot } from "../RobotMascot";
import { HintPanel } from "./HintPanel";
import { WorkedExamplePanel } from "./WorkedExamplePanel";

type AnswerState = "idle" | "correct" | "wrong";

interface TrueFalseQuestionProps {
  questionText: string;
  visual?: string;
  mascotMood: string;
  answerState: AnswerState;
  showHint: boolean;
  showAnswer: boolean;
  showParticle: boolean;
  isFinished: boolean;
  correctAnswerText: string;
  onAnswer: (answer: boolean) => void;
}

export const TrueFalseQuestion = React.memo(function TrueFalseQuestion({
  questionText,
  visual,
  mascotMood,
  answerState,
  showHint,
  showAnswer,
  showParticle,
  isFinished,
  correctAnswerText,
  onAnswer,
}: TrueFalseQuestionProps) {
  // Track which button was last tapped so aria-pressed is correct per button
  const [lastSelected, setLastSelected] = useState<"true" | "false" | null>(
    null,
  );

  const handleAnswer = (value: boolean) => {
    setLastSelected(value ? "true" : "false");
    onAnswer(value);
  };

  return (
    <div className="flex flex-col items-center px-4 py-6 gap-6">
      <RobotMascot size={80} mood={mascotMood as any} />

      {visual && (
        <div className="text-6xl leading-none text-center select-none">
          {visual}
        </div>
      )}

      <h3
        id="tf-question-label"
        className="text-2xl font-black text-[#1A1A2E] text-center px-2"
      >
        {questionText}
      </h3>

      <AnimatePresence>
        {showHint && !showAnswer && (
          <motion.div
            key="hint-group-tf"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <WorkedExamplePanel
              questionText={questionText}
              questionType="trueFalse"
            />
            <HintPanel questionText={questionText} />
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

      {answerState === "wrong" && !showAnswer && (
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

      <fieldset className="flex gap-4 w-full max-w-sm border-0 p-0 m-0">
        <legend className="sr-only">{questionText}</legend>
        <button
          type="button"
          data-ocid="lesson.true.button"
          aria-pressed={lastSelected === "true"}
          onClick={() => handleAnswer(true)}
          disabled={answerState === "correct"}
          className={`flex-1 py-5 rounded-2xl font-black text-xl text-white shadow-md active:scale-95 transition-all ${
            answerState === "wrong" && lastSelected === "true"
              ? "animate-shake"
              : ""
          }`}
          style={{ backgroundColor: "#00C9A7" }}
        >
          TRUE ✓
        </button>
        <button
          type="button"
          data-ocid="lesson.false.button"
          aria-pressed={lastSelected === "false"}
          onClick={() => handleAnswer(false)}
          disabled={answerState === "correct"}
          className={`flex-1 py-5 rounded-2xl font-black text-xl text-white shadow-md active:scale-95 transition-all ${
            answerState === "wrong" && lastSelected === "false"
              ? "animate-shake"
              : ""
          }`}
          style={{ backgroundColor: "#EF476F" }}
        >
          FALSE ✗
        </button>
      </fieldset>
    </div>
  );
});
