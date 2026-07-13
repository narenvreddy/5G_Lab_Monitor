import { AnimatePresence, motion } from "motion/react";
import React from "react";
import { RobotMascot } from "../RobotMascot";
import { HintPanel } from "./HintPanel";
import { WorkedExamplePanel } from "./WorkedExamplePanel";

type AnswerState = "idle" | "correct" | "wrong";

const CHOICE_COLORS = ["#5B4FCF", "#FF6B35", "#00C9A7", "#EF476F"];

interface DragDropQuestionProps {
  questionText: string;
  mascotMood: string;
  answerState: AnswerState;
  showHint: boolean;
  showParticle: boolean;
  isFinished: boolean;
  dragShake: boolean;
  dragPlaced: (string | null)[];
  dragBank: string[];
  dragBankIds: string[];
  onBankTap: (item: string, bankIdx: number) => void;
  onSlotTap: (slotIdx: number) => void;
  onCheck: () => void;
}

export const DragDropQuestion = React.memo(function DragDropQuestion({
  questionText,
  mascotMood,
  answerState,
  showHint,
  showParticle,
  isFinished,
  dragPlaced,
  dragBank,
  dragBankIds,
  onBankTap,
  onSlotTap,
  onCheck,
}: DragDropQuestionProps) {
  return (
    <div className="flex flex-col items-center px-4 py-6 gap-5">
      <RobotMascot size={80} mood={mascotMood as any} />

      <h3 className="text-2xl font-black text-[#1A1A2E] text-center px-2">
        {questionText}
      </h3>

      <p className="text-sm text-[#6B6B8A] font-bold">
        Tap a tile to place it &#x2192; tap a placed tile to return it
      </p>

      <AnimatePresence>
        {showHint && (
          <motion.div
            key="hint-group-drag"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <WorkedExamplePanel
              questionText={questionText}
              questionType="dragDrop"
            />
            <HintPanel questionText={questionText} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Drop zone */}
      <div className="flex gap-2 flex-wrap justify-center w-full max-w-sm">
        {dragPlaced.map((item, i) => {
          const isFirstCorrectHint = showHint && i === 0 && !item;
          return (
            <button
              // biome-ignore lint/suspicious/noArrayIndexKey: slot order is positionally significant
              key={`slot-${i}`}
              type="button"
              data-ocid={`lesson.drag_slot.button.${i + 1}`}
              aria-label={
                item
                  ? `Slot ${i + 1}: ${item} — tap to return`
                  : `Empty slot ${i + 1}`
              }
              onClick={() => onSlotTap(i)}
              disabled={answerState === "correct"}
              className={`min-w-[70px] px-3 py-3 rounded-2xl font-black text-base transition-all select-none ${
                item
                  ? answerState === "correct"
                    ? "bg-[#00C9A7] text-white shadow-md"
                    : "bg-[#5B4FCF] text-white shadow-md active:scale-95"
                  : isFirstCorrectHint
                    ? "bg-white border-4 border-dashed border-[#5B4FCF] text-transparent drag-hint-pulse"
                    : "bg-white border-4 border-dashed border-[#5B4FCF]/30 text-transparent"
              }`}
            >
              {item ?? "__"}
            </button>
          );
        })}
      </div>

      {answerState === "wrong" && (
        <motion.p
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[#EF476F] font-black text-lg"
          aria-live="polite"
        >
          Not quite! Try a different order &#x1f4aa;
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

      {/* Tile bank */}
      <div className="flex flex-wrap gap-2 justify-center w-full max-w-sm">
        {dragBank.map((item, i) => (
          <button
            key={dragBankIds[i] ?? `tile-${item}-${i}`}
            type="button"
            data-ocid={`lesson.drag_tile.button.${i + 1}`}
            aria-label={`Tile: ${item}`}
            onClick={() => onBankTap(item, i)}
            disabled={answerState === "correct"}
            className="min-w-[70px] px-3 py-3 rounded-2xl font-black text-base text-white shadow-md active:scale-95 transition-transform select-none"
            style={{ backgroundColor: CHOICE_COLORS[i % CHOICE_COLORS.length] }}
          >
            {item}
          </button>
        ))}
      </div>

      <button
        type="button"
        data-ocid="lesson.drag_check.button"
        onClick={onCheck}
        disabled={
          dragPlaced.some((s) => s === null) || answerState === "correct"
        }
        className="w-full max-w-sm py-4 rounded-2xl font-black text-xl text-white shadow-md active:scale-95 transition-transform disabled:opacity-50"
        style={{ backgroundColor: "#FF6B35" }}
      >
        Check Order &#x2713;
      </button>
    </div>
  );
});
