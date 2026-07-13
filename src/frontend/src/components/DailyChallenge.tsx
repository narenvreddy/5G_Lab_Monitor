import { AnimatePresence, motion } from "motion/react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useApp } from "../contexts/AppContext";
import {
  getMsUntilMidnight,
  getTodayKey,
  getTodaysChallengeQuestions,
} from "../data/dailyChallengeQuestions";
import type { LessonQuestion } from "../data/lessons";
import { playCelebration, playCorrect, playWrong } from "../utils/sound";
import { RobotMascot } from "./RobotMascot";

interface DailyChallengeProps {
  profileId: string;
  onClose: () => void;
}

const CHOICE_COLORS = ["#5B4FCF", "#FF6B35", "#00C9A7", "#EF476F"];
const DAILY_CHALLENGE_UNIT = 99; // special unit index for daily challenges

function getDailyKey(profileId: string): string {
  return `mathquest_daily_${profileId}_${getTodayKey()}`;
}

function isCompletedToday(profileId: string): boolean {
  try {
    return localStorage.getItem(getDailyKey(profileId)) === "done";
  } catch {
    return false;
  }
}

function markCompletedToday(profileId: string): void {
  try {
    localStorage.setItem(getDailyKey(profileId), "done");
    // Also increment dedicated counter so getDailyCompletionCount avoids a full scan (PERF-01)
    const countKey = `mathspark_daily_count_${profileId}`;
    const current = Number(localStorage.getItem(countKey) ?? 0);
    localStorage.setItem(countKey, String(current + 1));
  } catch {
    // ignore
  }
}

function CountdownTimer() {
  const [ms, setMs] = useState(getMsUntilMidnight());

  useEffect(() => {
    const interval = setInterval(() => {
      setMs(getMsUntilMidnight());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const hours = Math.floor(ms / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);

  return (
    <span className="font-black text-[#5B4FCF]">
      {String(hours).padStart(2, "0")}:{String(minutes).padStart(2, "0")}:
      {String(seconds).padStart(2, "0")}
    </span>
  );
}

type AnswerState = "idle" | "correct" | "wrong";

export function DailyChallenge({ profileId, onClose }: DailyChallengeProps) {
  const { settings, saveProgress, activeProfile } = useApp();
  const soundEnabled = settings.soundEnabled as boolean;

  const [alreadyDone, setAlreadyDone] = useState(() =>
    isCompletedToday(profileId),
  );
  // Re-check alreadyDone if profile changes while component is mounted (BUG-03)
  useEffect(() => {
    setAlreadyDone(isCompletedToday(profileId));
  }, [profileId]);

  const questions = getTodaysChallengeQuestions().filter(
    (q) => q.type !== "dragDrop" && q.type !== "slide",
  );

  const [qIdx, setQIdx] = useState(0);
  const [answerState, setAnswerState] = useState<AnswerState>("idle");
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [wrongChoices, setWrongChoices] = useState<Set<number>>(new Set());
  const [firstTryCorrect, setFirstTryCorrect] = useState(0);
  const firstTryCorrectRef = useRef(0);
  const [isFinished, setIsFinished] = useState(() =>
    isCompletedToday(profileId),
  );
  const [fillInput, setFillInput] = useState("");
  const [showParticle, setShowParticle] = useState(false);
  const [saving, setSaving] = useState(false);
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const advanceRef = useRef<() => void>(() => {});
  const timerExpired = useRef(false);
  const answerStateRef = useRef<AnswerState>("idle");
  const [timeLeft, setTimeLeft] = useState(10);
  const streak = Number(activeProfile?.dailyStreak?.currentStreak ?? 0);
  const [showGreeting, setShowGreeting] = useState(
    !isCompletedToday(profileId),
  );

  const totalQ = questions.length;
  const currentQ: LessonQuestion | undefined = questions[qIdx];

  // Normalize dragDrop questions to multiChoice
  const normalizedQ = currentQ
    ? currentQ.type === "dragDrop" &&
      !(currentQ as LessonQuestion & { choices?: string[] }).choices &&
      (currentQ as LessonQuestion & { items?: string[] }).items
      ? {
          ...currentQ,
          type: "multiChoice" as const,
          choices:
            (currentQ as LessonQuestion & { items?: string[] }).items ?? [],
          correct: 0,
        }
      : currentQ
    : undefined;

  const pct = totalQ > 0 ? (qIdx / totalQ) * 100 : 0;

  useEffect(() => {
    return () => {
      if (advanceTimer.current) clearTimeout(advanceTimer.current);
    };
  }, []);

  // Auto-dismiss greeting after 2s
  useEffect(() => {
    if (!showGreeting) return;
    const t = setTimeout(() => setShowGreeting(false), 2000);
    return () => clearTimeout(t);
  }, [showGreeting]);

  const computeBonus = useCallback(
    (correct: number) => {
      const ratio = correct / totalQ;
      if (ratio >= 0.85) return 3;
      if (ratio >= 0.57) return 2;
      return 1;
    },
    [totalQ],
  );

  const finishChallenge = useCallback(
    async (correct: number) => {
      playCelebration(soundEnabled);
      markCompletedToday(profileId);
      // Save score for display on "already done" screen
      try {
        localStorage.setItem(
          `mathquest_daily_score_${profileId}_${getTodayKey()}`,
          String(correct),
        );
      } catch {}
      setIsFinished(true);
      const bonus = computeBonus(correct);
      // Save as special daily-challenge unit progress
      const today = new Date();
      const dayIndex =
        today.getFullYear() * 10000 +
        (today.getMonth() + 1) * 100 +
        today.getDate();
      setSaving(true);
      await saveProgress(DAILY_CHALLENGE_UNIT, dayIndex % 1000, bonus);
      setSaving(false);
      toast.success("Daily Challenge complete! 🎉 Bonus Stars earned!");
    },
    [profileId, soundEnabled, computeBonus, saveProgress],
  );

  const advance = useCallback(() => {
    if (qIdx + 1 >= totalQ) {
      finishChallenge(firstTryCorrectRef.current);
    } else {
      setQIdx((prev) => prev + 1);
      setAnswerState("idle");
      setSelectedChoice(null);
      setWrongChoices(new Set());
      setFillInput("");
    }
  }, [qIdx, totalQ, finishChallenge]);

  // Keep answerStateRef in sync with answerState
  useEffect(() => {
    answerStateRef.current = answerState;
  }, [answerState]);

  // Keep advanceRef in sync so stale closures in setTimeout calls always get latest advance (BUG-05)
  useEffect(() => {
    advanceRef.current = advance;
  }, [advance]);

  // Reset timer when question changes - qIdx is the intentional trigger dep
  // biome-ignore lint/correctness/useExhaustiveDependencies: qIdx triggers the reset intentionally
  useEffect(() => {
    setTimeLeft(10);
    timerExpired.current = false;
  }, [qIdx]);

  // Per-question countdown timer
  // biome-ignore lint/correctness/useExhaustiveDependencies: uses refs to avoid restarts on answerState change
  useEffect(() => {
    if (answerStateRef.current !== "idle" || isFinished || alreadyDone) return;
    const interval = setInterval(() => {
      if (answerStateRef.current !== "idle") return; // skip tick if already answered
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          if (!timerExpired.current) {
            timerExpired.current = true;
            playWrong(soundEnabled);
            setAnswerState("wrong");
            advanceTimer.current = setTimeout(() => advanceRef.current(), 1200);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [qIdx, isFinished, alreadyDone]);

  const handleChoice = (idx: number) => {
    if (answerState === "correct" || wrongChoices.has(idx)) return;
    setSelectedChoice(idx);
    if (idx === normalizedQ?.correct) {
      if (wrongChoices.size === 0)
        (() => {
          firstTryCorrectRef.current += 1;
          setFirstTryCorrect((p) => p + 1);
        })();
      playCorrect(soundEnabled);
      setAnswerState("correct");
      setShowParticle(true);
      setTimeout(() => setShowParticle(false), 1000);
      advanceTimer.current = setTimeout(() => advanceRef.current(), 1200);
    } else {
      setWrongChoices((prev) => new Set(prev).add(idx));
      playWrong(soundEnabled);
      setAnswerState("wrong");
      setTimeout(() => setAnswerState("idle"), 700);
    }
  };

  const handleTrueFalse = (answer: boolean) => {
    if (answerState === "correct") return;
    const isCorrect = answer === currentQ?.isTrue;
    if (isCorrect) {
      if (answerState !== "wrong")
        (() => {
          firstTryCorrectRef.current += 1;
          setFirstTryCorrect((p) => p + 1);
        })();
      playCorrect(soundEnabled);
      setAnswerState("correct");
      setShowParticle(true);
      setTimeout(() => setShowParticle(false), 1000);
      advanceTimer.current = setTimeout(() => advanceRef.current(), 1200);
    } else {
      playWrong(soundEnabled);
      setAnswerState("wrong");
      setTimeout(() => setAnswerState("idle"), 700);
    }
  };

  const handleFillSubmit = () => {
    if (answerState === "correct" || !fillInput.trim()) return;
    const userAnswer = fillInput.trim().toLowerCase();
    const correctAnswer = (currentQ?.answer ?? "").toLowerCase();
    if (userAnswer === correctAnswer) {
      if (answerState !== "wrong")
        (() => {
          firstTryCorrectRef.current += 1;
          setFirstTryCorrect((p) => p + 1);
        })();
      playCorrect(soundEnabled);
      setAnswerState("correct");
      setShowParticle(true);
      setTimeout(() => setShowParticle(false), 1000);
      advanceTimer.current = setTimeout(() => advanceRef.current(), 1400);
    } else {
      playWrong(soundEnabled);
      setAnswerState("wrong");
      setFillInput("");
      setTimeout(() => setAnswerState("idle"), 900);
    }
  };

  const bonus = computeBonus(firstTryCorrect);

  // Already completed screen
  if (alreadyDone && !saving) {
    let prevScore: number | null = null;
    let prevStars = 0;
    try {
      const s = localStorage.getItem(
        `mathquest_daily_score_${profileId}_${getTodayKey()}`,
      );
      if (s !== null) {
        prevScore = Number(s);
        if (prevScore >= 6) prevStars = 3;
        else if (prevScore >= 3) prevStars = 2;
        else prevStars = 1;
      }
    } catch {}

    return (
      <dialog
        open
        aria-label="Daily Challenge"
        className="fixed inset-0 z-50 bg-[#F4F2FF] flex flex-col items-center justify-center px-6 p-0 max-w-none w-full h-full border-0 m-0"
      >
        <div className="text-center max-w-sm md:max-w-md w-full">
          <RobotMascot size={100} mood="celebrating" className="mx-auto mb-4" />
          <h2 className="text-3xl font-black text-[#5B4FCF] mb-2">
            Challenge Done! 🏆
          </h2>

          {prevScore !== null ? (
            <div className="bg-white rounded-2xl p-5 shadow-md mb-4">
              <p className="text-xs font-black text-[#6B6B8A] uppercase tracking-wider mb-3">
                Today's Score
              </p>
              <p className="font-black text-5xl text-[#1A1A2E] mb-2">
                {prevScore}
                <span className="text-2xl text-[#6B6B8A]">/{totalQ}</span>
              </p>
              <div className="flex justify-center gap-2 mb-2">
                {[1, 2, 3].map((s) => (
                  <span
                    key={s}
                    style={{
                      fontSize: 32,
                      filter:
                        prevStars >= s ? "none" : "grayscale(1) opacity(0.3)",
                    }}
                  >
                    ⭐
                  </span>
                ))}
              </div>
              <p className="text-sm font-bold text-[#6B6B8A]">
                {prevScore === totalQ
                  ? "Perfect score! Amazing!"
                  : prevScore >= 5
                    ? "Great job today!"
                    : "Keep practising!"}
              </p>
            </div>
          ) : (
            <p className="text-[#6B6B8A] font-semibold mb-4">
              You've already completed today's challenge.
            </p>
          )}

          <div className="bg-gradient-to-r from-[#5B4FCF]/10 to-[#FF6B35]/10 rounded-2xl p-4 mb-5 border border-[#5B4FCF]/20">
            <p className="text-sm font-black text-[#5B4FCF] mb-1">
              🌅 Come back tomorrow for a new challenge!
            </p>
            <p className="text-[#6B6B8A] text-xs font-bold mb-2">
              Next challenge in
            </p>
            <CountdownTimer />
          </div>

          <button
            type="button"
            data-ocid="daily_challenge.close.button"
            onClick={onClose}
            className="w-full py-4 rounded-2xl font-black text-xl text-white shadow-lg"
            style={{ backgroundColor: "#5B4FCF" }}
          >
            Back to Home 🏠
          </button>
        </div>
      </dialog>
    );
  }

  // Finished screen
  if (isFinished) {
    return (
      <dialog
        open
        aria-label="Daily Challenge"
        className="fixed inset-0 z-50 bg-[#F4F2FF] flex flex-col items-center justify-center px-6 p-0 max-w-none w-full h-full border-0 m-0"
      >
        <div className="text-center max-w-sm md:max-w-md w-full">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
          >
            <RobotMascot
              size={120}
              mood="celebrating"
              className="mx-auto mb-4"
            />
          </motion.div>
          <h2 className="text-4xl font-black text-[#1A1A2E] mb-2">
            Challenge Complete!
          </h2>
          <p className="text-[#6B6B8A] font-semibold mb-2">
            {firstTryCorrect} out of {totalQ} correct on first try!
          </p>

          {/* Bonus stars */}
          <div className="flex justify-center gap-3 my-4">
            {[1, 2, 3].map((s) => (
              <motion.span
                key={s}
                initial={{ scale: 0, rotate: -30 }}
                animate={bonus >= s ? { scale: 1, rotate: 0 } : { scale: 0.4 }}
                transition={{
                  delay: s * 0.2,
                  type: "spring",
                  stiffness: 400,
                  damping: 15,
                }}
                style={{
                  fontSize: 52,
                  filter: bonus >= s ? "none" : "grayscale(1) opacity(0.3)",
                }}
              >
                ⭐
              </motion.span>
            ))}
          </div>

          {/* Badges */}
          <div className="bg-white rounded-2xl p-4 shadow-md mb-4">
            <p className="font-black text-[#5B4FCF] mb-2">Rewards Earned</p>
            <div className="flex justify-center gap-3">
              <div className="flex flex-col items-center gap-1">
                <span className="text-4xl">🏆</span>
                <span className="text-xs font-bold text-[#6B6B8A]">
                  Daily Badge
                </span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="text-4xl">+{bonus * 10}</span>
                <span className="text-xs font-bold text-[#6B6B8A]">
                  Bonus Stars
                </span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="text-4xl">🔥</span>
                <span className="text-xs font-bold text-[#6B6B8A]">
                  Streak+
                </span>
              </div>
            </div>
          </div>

          {/* Next challenge countdown */}
          <div className="bg-white rounded-2xl p-3 shadow-sm mb-6">
            <p className="text-[#6B6B8A] text-sm font-bold mb-1">
              Next challenge in
            </p>
            <CountdownTimer />
          </div>

          <button
            type="button"
            data-ocid="daily_challenge.finish.button"
            onClick={onClose}
            disabled={saving}
            className="w-full py-4 rounded-2xl font-black text-xl text-white shadow-lg"
            style={{ backgroundColor: "#5B4FCF" }}
          >
            {saving ? "Saving..." : "Back to Home 🏠"}
          </button>
        </div>
      </dialog>
    );
  }

  return (
    <dialog
      open
      aria-label="Daily Challenge"
      className="fixed inset-0 z-50 bg-[#F4F2FF] flex flex-col overflow-hidden p-0 max-w-none w-full h-full border-0 m-0"
    >
      {/* Screen reader feedback */}
      <div aria-live="polite" className="sr-only">
        {answerState === "correct"
          ? "Correct!"
          : answerState === "wrong"
            ? "Not quite"
            : ""}
      </div>
      {/* Greeting overlay */}
      {showGreeting && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 pointer-events-none">
          <div className="bg-white rounded-3xl p-6 mx-6 shadow-2xl flex flex-col items-center text-center max-w-sm pointer-events-auto">
            <RobotMascot size={90} mood="greeting" className="mb-3" />
            <h3 className="font-black text-[#FF6B35] text-xl mb-1">
              Daily Challenge!
            </h3>
            <p className="font-bold text-[#1A1A2E] text-lg leading-snug">
              {streak >= 3
                ? `You're on a ${streak}-day streak! Keep it going! 🔥`
                : "Ready for today's challenge? 🏆"}
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-[#FF6B35] to-[#FFD166] px-4 pt-safe-top pt-4 pb-3 flex items-center gap-3">
        <button
          type="button"
          data-ocid="daily_challenge.back.button"
          onClick={onClose}
          className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white font-black text-xl flex-shrink-0"
          aria-label="Close daily challenge"
        >
          ←
        </button>
        <div className="flex-1 text-center">
          <h2 className="font-black text-white text-lg leading-tight">
            Daily Challenge
          </h2>
          <p className="text-white/80 text-xs font-semibold">
            Q {qIdx + 1} of {totalQ}
          </p>
        </div>
        <span className="text-2xl">🏆</span>
        {/* Per-question timer ring */}
        {answerState === "idle" && !isFinished && !alreadyDone && (
          <div className="relative w-10 h-10 flex-shrink-0">
            <svg
              className="w-10 h-10 -rotate-90"
              viewBox="0 0 44 44"
              role="img"
              aria-label="Time remaining"
            >
              <circle
                cx="22"
                cy="22"
                r="20"
                fill="none"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="4"
              />
              <circle
                cx="22"
                cy="22"
                r="20"
                fill="none"
                stroke={
                  timeLeft > 5
                    ? "#00C9A7"
                    : timeLeft > 2
                      ? "#FF6B35"
                      : "#EF476F"
                }
                strokeWidth="4"
                strokeDasharray="125.6"
                strokeDashoffset={125.6 - (timeLeft / 10) * 125.6}
                strokeLinecap="round"
                style={{
                  transition: "stroke-dashoffset 1s linear, stroke 0.3s",
                }}
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center font-black text-xs text-white">
              {timeLeft}
            </span>
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-orange-100 w-full">
        <motion.div
          className="h-full bg-gradient-to-r from-[#FF6B35] to-[#FFD166] rounded-r-full"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>

      {/* Correct banner */}
      <AnimatePresence>
        {answerState === "correct" && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="w-full bg-[#00C9A7] py-2 px-4 text-center text-white font-black text-lg"
          >
            Correct! 🎉
          </motion.div>
        )}
      </AnimatePresence>

      {/* Question content */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {normalizedQ?.type === "trueFalse" ? (
            <motion.div
              key={`tf-${qIdx}`}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              className="flex flex-col items-center px-4 md:px-8 py-6 gap-6"
            >
              <RobotMascot
                size={80}
                mood={
                  answerState === "correct"
                    ? "celebrating"
                    : answerState === "wrong"
                      ? "thinking"
                      : "happy"
                }
              />
              <h3 className="text-2xl font-black text-[#1A1A2E] text-center px-2">
                {normalizedQ.text}
              </h3>
              {answerState === "wrong" && (
                <p className="text-[#EF476F] font-black text-lg">
                  Nice try! 🤔
                </p>
              )}
              <AnimatePresence>
                {showParticle && (
                  <motion.div
                    key="p"
                    initial={{ opacity: 1, y: 0, scale: 1 }}
                    animate={{ opacity: 0, y: -60, scale: 1.5 }}
                    exit={{ opacity: 0 }}
                    className="absolute top-1/3 left-1/2 -translate-x-1/2 text-4xl pointer-events-none"
                  >
                    +1 ⭐
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="flex gap-4 w-full max-w-sm md:max-w-md">
                <button
                  type="button"
                  data-ocid="daily_challenge.true.button"
                  onClick={() => handleTrueFalse(true)}
                  disabled={answerState === "correct"}
                  className={`flex-1 py-5 rounded-2xl font-black text-xl text-white shadow-md active:scale-95 transition-all ${answerState === "wrong" ? "animate-shake" : ""}`}
                  style={{ backgroundColor: "#00C9A7" }}
                >
                  TRUE ✓
                </button>
                <button
                  type="button"
                  data-ocid="daily_challenge.false.button"
                  onClick={() => handleTrueFalse(false)}
                  disabled={answerState === "correct"}
                  className={`flex-1 py-5 rounded-2xl font-black text-xl text-white shadow-md active:scale-95 transition-all ${answerState === "wrong" ? "animate-shake" : ""}`}
                  style={{ backgroundColor: "#EF476F" }}
                >
                  FALSE ✗
                </button>
              </div>
            </motion.div>
          ) : normalizedQ?.type === "fillBlank" ? (
            <motion.div
              key={`fill-${qIdx}`}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              className="flex flex-col items-center px-4 md:px-8 py-6 gap-5"
            >
              <RobotMascot
                size={80}
                mood={
                  answerState === "correct"
                    ? "celebrating"
                    : answerState === "wrong"
                      ? "thinking"
                      : "happy"
                }
              />
              <h3 className="text-2xl font-black text-[#1A1A2E] text-center px-2">
                {normalizedQ.text}
              </h3>
              {normalizedQ.hint && (
                <p className="text-sm text-[#6B6B8A] font-semibold">
                  {normalizedQ.hint}
                </p>
              )}
              {answerState === "wrong" && (
                <p className="text-[#EF476F] font-black text-lg">
                  Nice try! 🤔
                </p>
              )}
              <AnimatePresence>
                {showParticle && (
                  <motion.div
                    key="p"
                    initial={{ opacity: 1, y: 0, scale: 1 }}
                    animate={{ opacity: 0, y: -60, scale: 1.5 }}
                    exit={{ opacity: 0 }}
                    className="absolute top-1/3 left-1/2 -translate-x-1/2 text-4xl pointer-events-none"
                  >
                    +1 ⭐
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="w-full max-w-sm md:max-w-md space-y-3">
                <input
                  type="text"
                  inputMode={
                    Number.isNaN(Number(currentQ?.answer)) ? "text" : "numeric"
                  }
                  value={fillInput}
                  onChange={(e) => setFillInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleFillSubmit()}
                  placeholder="Type your answer..."
                  disabled={answerState === "correct"}
                  aria-label="Your answer"
                  data-ocid="daily_challenge.fill_blank.input"
                  className={`w-full text-center text-3xl font-black py-4 px-4 rounded-2xl border-4 outline-none transition-all bg-white ${
                    answerState === "wrong"
                      ? "border-[#EF476F] animate-shake"
                      : answerState === "correct"
                        ? "border-[#00C9A7]"
                        : "border-[#FF6B35]/30 focus:border-[#FF6B35]"
                  }`}
                />
                <button
                  type="button"
                  data-ocid="daily_challenge.check.button"
                  onClick={handleFillSubmit}
                  disabled={!fillInput.trim() || answerState === "correct"}
                  className="w-full py-4 rounded-2xl font-black text-xl text-white shadow-md active:scale-95 disabled:opacity-50"
                  style={{ backgroundColor: "#FF6B35" }}
                >
                  Check ➜
                </button>
              </div>
            </motion.div>
          ) : (
            // Default: multiChoice (and normalized dragDrop)
            <motion.div
              key={`q-${qIdx}`}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              className="flex flex-col items-center px-4 py-6 gap-4"
            >
              <RobotMascot
                size={80}
                mood={
                  answerState === "correct"
                    ? "celebrating"
                    : answerState === "wrong"
                      ? "thinking"
                      : "happy"
                }
              />
              {normalizedQ?.visual && (
                <div className="text-5xl text-center select-none">
                  {normalizedQ.visual}
                </div>
              )}
              <h3 className="text-2xl font-black text-[#1A1A2E] text-center px-2">
                {normalizedQ?.text}
              </h3>
              {answerState === "wrong" && (
                <p className="text-[#EF476F] font-black text-lg">
                  Nice try! 🤔
                </p>
              )}
              <AnimatePresence>
                {showParticle && (
                  <motion.div
                    key="p"
                    initial={{ opacity: 1, y: 0, scale: 1 }}
                    animate={{ opacity: 0, y: -60, scale: 1.5 }}
                    exit={{ opacity: 0 }}
                    className="absolute top-1/3 left-1/2 -translate-x-1/2 text-4xl pointer-events-none"
                  >
                    +1 ⭐
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="grid grid-cols-2 gap-3 w-full max-w-sm mt-2">
                {normalizedQ?.choices?.map((choice, idx) => (
                  <button
                    type="button"
                    key={choice}
                    data-ocid={`daily_challenge.choice.button.${idx + 1}`}
                    className={`relative w-full py-4 px-4 rounded-2xl font-black text-lg text-white transition-all select-none flex items-center justify-center shadow-md active:scale-95 ${
                      wrongChoices.has(idx)
                        ? "opacity-40 cursor-not-allowed"
                        : ""
                    } ${
                      selectedChoice === idx && answerState === "correct"
                        ? "ring-4 ring-green-300"
                        : ""
                    } ${
                      selectedChoice === idx && answerState === "wrong"
                        ? "animate-shake"
                        : ""
                    }`}
                    style={{
                      backgroundColor:
                        selectedChoice === idx && answerState === "correct"
                          ? "#00C9A7"
                          : wrongChoices.has(idx)
                            ? "#6B6B8A"
                            : CHOICE_COLORS[idx % CHOICE_COLORS.length],
                    }}
                    onClick={() => handleChoice(idx)}
                    disabled={
                      wrongChoices.has(idx) || answerState === "correct"
                    }
                  >
                    <span
                      className="absolute top-1.5 left-2 text-xs font-black opacity-60"
                      aria-hidden
                    >
                      {idx + 1}
                    </span>
                    {choice}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </dialog>
  );
}
