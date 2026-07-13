import { motion } from "motion/react";
import React from "react";
import { RobotMascot } from "../RobotMascot";

const HINT_HEADERS = [
  "Need a hint? 💜",
  "I've got a clue for you! 🔍",
  "Let me help! 🤖",
  "Here's a tip! ✨",
];

function generateHintText(questionText: string): string {
  const q = questionText.toLowerCase();
  if (q.includes("add") || q.includes("+")) {
    return "Try counting up from the bigger number! 🔢";
  }
  if (q.includes("subtract") || q.includes("-") || q.includes("take away")) {
    return "Count backwards from the bigger number! ⬅️";
  }
  if (q.includes("multipl") || q.includes("×") || q.includes("times")) {
    return "Multiplication is just adding the same number over and over! 🔄";
  }
  if (q.includes("divid") || q.includes("÷") || q.includes("share")) {
    return "Division means splitting into equal groups! 🍕";
  }
  if (
    q.includes("fraction") ||
    q.includes("1/") ||
    q.includes("half") ||
    q.includes("quarter")
  ) {
    return "A fraction shows part of a whole — top number ÷ bottom number! 🍰";
  }
  if (
    q.includes("algebra") ||
    q.includes(" x ") ||
    q.includes("variable") ||
    q.includes("solve for")
  ) {
    return "Think of the unknown as a mystery number. What would make both sides equal? 🔍";
  }
  if (
    q.includes("pattern") ||
    q.includes("sequence") ||
    q.includes("next number")
  ) {
    return "Look at the difference between each number — do you spot the rule? 📈";
  }
  if (q.includes("roman") || q.includes("binary") || q.includes("history")) {
    return "Think about what you just learned in the lesson — the answer is in there! 📜";
  }
  if (q.includes("true") || q.includes("false")) {
    return "Read the statement carefully — does it always hold true? 🤔";
  }
  if (
    q.includes("order") ||
    q.includes("arrange") ||
    q.includes("smallest") ||
    q.includes("biggest")
  ) {
    return "Start with the smallest number and work your way up! 📊";
  }
  if (q.includes("perimeter") || q.includes("area")) {
    return "Perimeter = all sides added together. Area = length × width! 📐";
  }
  // Rotate through generic encouraging messages
  const generics = [
    "Take a deep breath and try a different approach! 💡",
    "You've got this — go with your best guess! 🌟",
    "Think about what you learned earlier in the lesson! 📚",
    "Try eliminating answers you know are wrong first! 🎯",
  ];
  const seed = questionText.length % generics.length;
  return generics[seed];
}

export const HintPanel = React.memo(function HintPanel({
  questionText,
}: { questionText: string }) {
  // Pick a stable header based on question text length so it doesn't flicker
  const header = HINT_HEADERS[questionText.length % HINT_HEADERS.length];

  return (
    <motion.div
      key="hint-panel"
      initial={{ opacity: 0, y: 10, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.96 }}
      transition={{
        duration: 0.3,
        type: "spring",
        stiffness: 300,
        damping: 20,
      }}
      className="w-full max-w-sm rounded-2xl p-4 flex items-start gap-3"
      style={{
        background: "linear-gradient(135deg, #F4F2FF 0%, #EDE8FF 100%)",
        border: "2px solid #5B4FCF33",
      }}
      data-ocid="lesson.hint.panel"
    >
      <RobotMascot size={48} mood="thinking" className="flex-shrink-0" />
      <div>
        <div className="font-black text-[#5B4FCF] text-sm mb-0.5">{header}</div>
        <div className="text-[#1A1A2E] text-sm font-semibold leading-snug">
          {generateHintText(questionText)}
        </div>
      </div>
    </motion.div>
  );
});
