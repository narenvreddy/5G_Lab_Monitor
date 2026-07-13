import { AnimatePresence, motion } from "motion/react";
import React, { useEffect, useState } from "react";
import { RobotMascot } from "./RobotMascot";
import { Button } from "./ui/button";

interface UnitCelebrationProps {
  unitName: string;
  unitEmoji: string;
  onContinue: () => void;
}

interface Confetti {
  id: number;
  x: number;
  color: string;
  delay: number;
  duration: number;
  size: number;
}

const CONFETTI_COLORS = ["#5B4FCF", "#FF6B35", "#00C9A7", "#FFD166", "#EF476F"];

function makeConfetti(count: number): Confetti[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    delay: Math.random() * 1.5,
    duration: 2 + Math.random() * 2,
    size: 6 + Math.random() * 8,
  }));
}

export function UnitCelebration({
  unitName,
  unitEmoji,
  onContinue,
}: UnitCelebrationProps) {
  const [confetti] = useState(() => makeConfetti(30));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
      style={{ background: "rgba(26,26,46,0.92)" }}
      data-ocid="unit_celebration.modal"
    >
      {/* Confetti */}
      {confetti.map((c) => (
        <div
          key={c.id}
          className="absolute rounded-sm"
          style={{
            left: `${c.x}%`,
            top: "-20px",
            width: c.size,
            height: c.size,
            backgroundColor: c.color,
            animation: `confettiFall ${c.duration}s ${c.delay}s ease-in infinite`,
          }}
        />
      ))}

      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.7, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 280, damping: 22 }}
          className="bg-white rounded-3xl mx-6 p-8 max-w-sm w-full shadow-2xl text-center relative z-10"
        >
          <RobotMascot size={100} mood="celebrating" className="mx-auto mb-4" />

          <div className="text-6xl mb-2">{unitEmoji}</div>

          <h2 className="text-3xl font-black text-[#5B4FCF] mb-1">
            You've completed {unitName}! 🎉
          </h2>
          <p className="text-[#6B6B8A] font-semibold text-sm mb-3">
            Every lesson in this unit is done. You're a MathSpark champion!
          </p>

          <div className="bg-[#FFD166]/20 rounded-2xl px-4 py-3 mb-6">
            <p className="text-[#1A1A2E] font-bold text-sm">
              🎖️ Badge earned! You finished all lessons in this unit.
            </p>
          </div>

          <div className="flex gap-2 mb-4 justify-center">
            {["s1", "s2", "s3", "s4", "s5"].map((skey, i) => (
              <motion.span
                key={skey}
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  delay: 0.3 + i * 0.1,
                  type: "spring",
                  stiffness: 300,
                }}
                className="text-3xl"
              >
                ⭐
              </motion.span>
            ))}
          </div>

          <Button
            onClick={onContinue}
            className="w-full bg-gradient-to-r from-[#FF6B35] to-[#FFD166] text-white font-black text-lg py-4 rounded-2xl shadow-lg hover:opacity-90"
            data-ocid="unit_celebration.continue.primary_button"
          >
            Keep Going! 🚀
          </Button>
        </motion.div>
      </AnimatePresence>

      <style>{`
        @keyframes confettiFall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
