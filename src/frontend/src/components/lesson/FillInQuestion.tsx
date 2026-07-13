import { AnimatePresence, motion } from "motion/react";
import React from "react";
import { RobotMascot } from "../RobotMascot";
import { HintPanel } from "./HintPanel";
import { NumberLineHint } from "./NumberLineHint";
import { WorkedExamplePanel } from "./WorkedExamplePanel";

type AnswerState = "idle" | "correct" | "wrong";

interface FillInQuestionProps {
  questionText: string;
  visual?: string;
  hint?: string;
  answer?: string | number;
  mascotMood: string;
  answerState: AnswerState;
  showHint: boolean;
  showAnswer: boolean;
  showParticle: boolean;
  isFinished: boolean;
  fillInput: string;
  correctAnswerText: string;
  onInputChange: (val: string) => void;
  onSubmit: () => void;
}

export const FillInQuestion = React.memo(function FillInQuestion({
  questionText,
  visual,
  hint,
  answer,
  mascotMood,
  answerState,
  showHint,
  showAnswer,
  showParticle,
  isFinished,
  fillInput,
  correctAnswerText,
  onInputChange,
  onSubmit,
}: FillInQuestionProps) {
  const inputId = "fill-in-answer";

  return (
    <div className="flex flex-col items-center px-4 py-6 gap-5">
      <RobotMascot size={80} mood={mascotMood as any} />

      {visual && (
        <div
          className="text-6xl leading-none text-center select-none"
          aria-hidden="true"
        >
          {visual}
        </div>
      )}

      <label
        htmlFor={inputId}
        className="text-2xl font-black text-[#1A1A2E] text-center px-2"
      >
        {questionText}
      </label>

      {hint && <p className="text-sm text-[#6B6B8A] font-semibold">{hint}</p>}

      <AnimatePresence>
        {showHint && !showAnswer && (
          <motion.div
            key="hint-group-fill"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <WorkedExamplePanel
              questionText={questionText}
              questionType="fillIn"
            />
            <HintPanel questionText={questionText} />
            {answer !== undefined && <NumberLineHint answer={answer} />}
          </motion.div>
        )}
      </AnimatePresence>

      {showAnswer && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#00C9A7] text-white rounded-2xl p-4 text-center font-bold text-lg w-full"
        >
          &#x2713; The answer is: {correctAnswerText}
        </motion.div>
      )}

      {answerState === "wrong" && !showAnswer && (
        <motion.p
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[#EF476F] font-black text-lg"
          aria-live="polite"
        >
          Try again! &#x1f4aa;
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
            +1 &#x2b50;
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full max-w-sm space-y-3">
        <input
          id={inputId}
          type="text"
          inputMode={
            answer !== undefined &&
            !Number.isNaN(Number(answer)) &&
            answer !== ""
              ? "numeric"
              : "text"
          }
          value={fillInput}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSubmit()}
          placeholder="Type your answer..."
          disabled={answerState === "correct"}
          aria-label="Your answer"
          aria-describedby={
            answerState === "wrong" ? "fill-feedback" : undefined
          }
          data-ocid="lesson.fill_blank.input"
          className={`w-full text-center text-3xl font-black py-4 px-4 rounded-2xl border-4 outline-none transition-all bg-white ${
            answerState === "wrong"
              ? "border-[#EF476F] animate-shake"
              : answerState === "correct"
                ? "border-[#00C9A7] bg-[#00C9A7]/10"
                : "border-[#5B4FCF]/30 focus:border-[#5B4FCF]"
          }`}
        />
        <button
          type="button"
          data-ocid="lesson.check_answer.button"
          onClick={onSubmit}
          disabled={!fillInput.trim() || answerState === "correct"}
          className="w-full py-4 rounded-2xl font-black text-xl text-white shadow-md active:scale-95 transition-transform disabled:opacity-50"
          style={{ backgroundColor: "#5B4FCF" }}
        >
          Check Answer &#x27a1;
        </button>
      </div>
    </div>
  );
});
