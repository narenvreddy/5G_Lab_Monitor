import { motion } from "motion/react";

export function NumberLineHint({ answer }: { answer: string | number }) {
  const num = Number(answer);
  if (Number.isNaN(num)) return null;
  const min = Math.max(0, num - 5);
  const max = num + 5;
  const nums = Array.from({ length: max - min + 1 }, (_, i) => min + i);
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-sm"
      data-ocid="lesson.number_line.panel"
    >
      <div className="text-xs font-bold text-[#6B6B8A] mb-1 text-center">
        The answer is on this number line 👇
      </div>
      <div className="flex gap-1 justify-center flex-wrap">
        {nums.map((n) => (
          <div
            key={n}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black transition-all"
            style={{
              backgroundColor: n === num ? "#5B4FCF" : "#F4F2FF",
              color: n === num ? "white" : "#6B6B8A",
              border: n === num ? "2px solid #5B4FCF" : "2px solid #E5E0FF",
              animation: n === num ? "pulse 1s ease-in-out infinite" : "none",
            }}
          >
            {n === num ? "?" : n}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
