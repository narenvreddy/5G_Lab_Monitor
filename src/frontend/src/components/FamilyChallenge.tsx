import { AnimatePresence, motion } from "motion/react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import type { ChildProfile } from "../backend";
import { useApp } from "../contexts/AppContext";
import { getTodaysChallengeQuestions } from "../data/dailyChallengeQuestions";
import type { LessonQuestion } from "../data/lessons";
import { ConfettiBurst } from "../games/gameUtils";
import { playCelebration, playCorrect, playWrong } from "../utils/sound";
import { RobotMascot } from "./RobotMascot";

interface FamilyChallengeProps {
  onClose: () => void;
}

const CHOICE_COLORS = ["#5B4FCF", "#FF6B35", "#00C9A7", "#EF476F"];
const TOTAL_QUESTIONS = 7;
const TIMER_SECONDS = 10;
const DAILY_CHALLENGE_UNIT = 99;

type Step =
  | "setup"
  | "p1-interstitial"
  | "p1-turn"
  | "p2-interstitial"
  | "p2-turn"
  | "results";
type AnswerState = "idle" | "correct" | "wrong";

function getScoreStars(score: number): number {
  if (score >= 6) return 3;
  if (score >= 3) return 2;
  return 1;
}

function QuestionTimer({
  timeLeft,
  answerState,
}: { timeLeft: number; answerState: AnswerState }) {
  if (answerState !== "idle") return null;
  const circumference = 125.6;
  const offset = circumference - (timeLeft / TIMER_SECONDS) * circumference;
  const color = timeLeft > 5 ? "#00C9A7" : timeLeft > 2 ? "#FF6B35" : "#EF476F";
  return (
    <div className="relative w-12 h-12 flex-shrink-0">
      <svg
        className="w-12 h-12 -rotate-90"
        viewBox="0 0 44 44"
        role="img"
        aria-label="Time remaining"
      >
        <circle
          cx="22"
          cy="22"
          r="20"
          fill="none"
          stroke="#E5E0FF"
          strokeWidth="4"
        />
        <circle
          cx="22"
          cy="22"
          r="20"
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeDasharray="125.6"
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s linear, stroke 0.3s" }}
        />
      </svg>
      <span
        className="absolute inset-0 flex items-center justify-center font-black text-sm"
        style={{ color }}
      >
        {timeLeft}
      </span>
    </div>
  );
}

function ChallengeRound({
  profile: _profile,
  questions,
  soundEnabled,
  onComplete,
}: {
  profile: ChildProfile;
  questions: LessonQuestion[];
  soundEnabled: boolean;
  onComplete: (score: number, results: boolean[]) => void;
}) {
  const [qIdx, setQIdx] = useState(0);
  const [answerState, setAnswerState] = useState<AnswerState>("idle");
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [wrongChoices, setWrongChoices] = useState<Set<number>>(new Set());
  const [firstTryCorrect, setFirstTryCorrect] = useState(0);
  const [results, setResults] = useState<boolean[]>([]);
  const [fillInput, setFillInput] = useState("");
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const timerExpired = useRef(false);

  const currentQ = questions[qIdx];
  const normalizedQ = currentQ
    ? currentQ.type === "dragDrop" &&
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
  const pct = questions.length > 0 ? (qIdx / questions.length) * 100 : 0;

  const advance = useCallback(
    (currentCorrect: number, currentResults: boolean[]) => {
      if (advanceTimer.current) clearTimeout(advanceTimer.current);
      if (qIdx + 1 >= questions.length) {
        onComplete(currentCorrect, currentResults);
      } else {
        setQIdx((p) => p + 1);
        setAnswerState("idle");
        setSelectedChoice(null);
        setWrongChoices(new Set());
        setFillInput("");
      }
    },
    [qIdx, questions.length, onComplete],
  );

  // Reset timer when question changes
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentionally depend only on qIdx
  useEffect(() => {
    setTimeLeft(TIMER_SECONDS);
    timerExpired.current = false;
  }, [qIdx]);

  // Countdown timer
  useEffect(() => {
    if (answerState !== "idle") return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          if (!timerExpired.current && answerState === "idle") {
            timerExpired.current = true;
            playWrong(soundEnabled);
            setAnswerState("wrong");
            const capturedCorrect = firstTryCorrect;
            const newResults = [...results, false];
            setResults(newResults);
            advanceTimer.current = setTimeout(
              () => advance(capturedCorrect, newResults),
              1000,
            );
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [answerState, soundEnabled, firstTryCorrect, advance, results]);

  useEffect(() => {
    return () => {
      if (advanceTimer.current) clearTimeout(advanceTimer.current);
    };
  }, []);

  const handleChoice = (idx: number) => {
    if (answerState === "correct" || wrongChoices.has(idx)) return;
    setSelectedChoice(idx);
    if (idx === normalizedQ?.correct) {
      const isFirstTry = wrongChoices.size === 0;
      const newCorrect = isFirstTry ? firstTryCorrect + 1 : firstTryCorrect;
      if (isFirstTry) setFirstTryCorrect((p) => p + 1);
      const newResults = [...results, isFirstTry];
      setResults(newResults);
      playCorrect(soundEnabled);
      setAnswerState("correct");
      advanceTimer.current = setTimeout(
        () => advance(newCorrect, newResults),
        1000,
      );
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
      const isFirstTry = answerState !== "wrong";
      const newCorrect = isFirstTry ? firstTryCorrect + 1 : firstTryCorrect;
      if (isFirstTry) setFirstTryCorrect((p) => p + 1);
      const newResults = [...results, isFirstTry];
      setResults(newResults);
      playCorrect(soundEnabled);
      setAnswerState("correct");
      advanceTimer.current = setTimeout(
        () => advance(newCorrect, newResults),
        1000,
      );
    } else {
      const newResults = [...results, false];
      setResults(newResults);
      playWrong(soundEnabled);
      setAnswerState("wrong");
      setTimeout(() => setAnswerState("idle"), 700);
    }
  };

  const handleFillSubmit = () => {
    if (!currentQ || answerState === "correct") return;
    const input = fillInput.trim().toLowerCase();
    const correct = String(
      (currentQ as LessonQuestion & { answer?: string }).answer ?? "",
    )
      .trim()
      .toLowerCase();
    if (input === correct) {
      const newCorrect = firstTryCorrect + 1;
      setFirstTryCorrect((p) => p + 1);
      const newResults = [...results, true];
      setResults(newResults);
      playCorrect(soundEnabled);
      setAnswerState("correct");
      advanceTimer.current = setTimeout(
        () => advance(newCorrect, newResults),
        1000,
      );
    } else {
      const newResults = [...results, false];
      setResults(newResults);
      setAnswerState("wrong");
      setFillInput("");
      setTimeout(() => setAnswerState("idle"), 900);
    }
  };

  if (!normalizedQ) return null;

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Progress */}
      <div className="px-4 pt-2 pb-1">
        <div className="h-2 bg-[#E5E0FF] rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-[#5B4FCF] rounded-full"
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>
        <p className="text-xs text-[#6B6B8A] font-bold mt-1">
          Question {qIdx + 1} of {questions.length}
        </p>
      </div>

      {/* Question */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        <div className="flex items-start gap-3 mb-5">
          <QuestionTimer timeLeft={timeLeft} answerState={answerState} />
          <p className="font-black text-[#1A1A2E] text-lg leading-snug">
            {normalizedQ.text}
          </p>
        </div>

        {/* Answer feedback */}
        <AnimatePresence>
          {answerState !== "idle" && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`rounded-xl px-4 py-2 text-center font-black mb-4 ${
                answerState === "correct"
                  ? "bg-[#00C9A7]/20 text-[#007A66]"
                  : "bg-[#EF476F]/20 text-[#C0002E]"
              }`}
              aria-live="polite"
            >
              {answerState === "correct" ? "✅ Correct!" : "❌ Not quite!"}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Multiple choice */}
        {(normalizedQ.type === "multiChoice" ||
          normalizedQ.type === "dragDrop") && (
          <div className="grid grid-cols-2 gap-3">
            {(
              (normalizedQ as LessonQuestion & { choices?: string[] })
                .choices ?? []
            ).map((choice, idx) => {
              const isSelected = selectedChoice === idx;
              const isWrong = wrongChoices.has(idx);
              const isCorrectAnswer =
                answerState === "correct" && idx === normalizedQ.correct;
              const bg = isCorrectAnswer
                ? "#00C9A7"
                : isWrong
                  ? "#EF476F"
                  : isSelected
                    ? CHOICE_COLORS[idx % CHOICE_COLORS.length]
                    : CHOICE_COLORS[idx % CHOICE_COLORS.length];
              return (
                <button
                  key={`choice-${idx}-${choice}`}
                  type="button"
                  onClick={() => handleChoice(idx)}
                  disabled={answerState === "correct" || isWrong}
                  className="py-4 px-3 rounded-2xl font-black text-white text-base shadow-md active:scale-95 transition-all"
                  style={{
                    backgroundColor: bg,
                    opacity: isWrong ? 0.4 : 1,
                  }}
                  aria-pressed={isSelected}
                >
                  {choice}
                </button>
              );
            })}
          </div>
        )}

        {/* True/False */}
        {normalizedQ.type === "trueFalse" && (
          <fieldset>
            <legend className="sr-only">True or False?</legend>
            <div className="grid grid-cols-2 gap-3">
              {([true, false] as const).map((val) => (
                <button
                  key={String(val)}
                  type="button"
                  onClick={() => handleTrueFalse(val)}
                  disabled={answerState === "correct"}
                  className="py-4 rounded-2xl font-black text-white text-lg shadow-md active:scale-95 transition-transform"
                  style={{
                    backgroundColor: val ? "#00C9A7" : "#EF476F",
                  }}
                  aria-pressed={
                    answerState === "correct" && val === currentQ?.isTrue
                  }
                >
                  {val ? "True" : "False"}
                </button>
              ))}
            </div>
          </fieldset>
        )}

        {/* Fill in the blank */}
        {normalizedQ.type === "fillBlank" && (
          <div className="space-y-3">
            <input
              type="text"
              value={fillInput}
              onChange={(e) => setFillInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleFillSubmit()}
              placeholder="Type your answer..."
              className={`w-full px-4 py-4 rounded-2xl border-2 font-bold text-[#1A1A2E] text-lg outline-none transition-colors ${
                answerState === "correct"
                  ? "border-[#00C9A7] bg-[#E0FAF5]"
                  : answerState === "wrong"
                    ? "border-[#EF476F] bg-red-50"
                    : "border-[#5B4FCF]/30 bg-white focus:border-[#5B4FCF]"
              }`}
              aria-label="Your answer"
            />
            <button
              type="button"
              onClick={handleFillSubmit}
              disabled={!fillInput.trim() || answerState === "correct"}
              className="w-full py-4 rounded-2xl font-black text-white text-lg shadow-md disabled:opacity-50"
              style={{ backgroundColor: "#5B4FCF" }}
            >
              Submit Answer
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export function FamilyChallenge({ onClose }: FamilyChallengeProps) {
  const { settings, profiles, saveProgress } = useApp();
  const soundEnabled = (settings?.soundEnabled ?? true) as boolean;

  const [step, setStep] = useState<Step>("setup");
  const [p1, setP1] = useState<ChildProfile | null>(null);
  const [p2, setP2] = useState<ChildProfile | null>(null);
  const [p1Score, setP1Score] = useState(0);
  const p1ScoreRef = useRef(0);
  const [p2Score, setP2Score] = useState(0);
  const [p1Results, setP1Results] = useState<boolean[]>([]);
  const [p2Results, setP2Results] = useState<boolean[]>([]);
  const [interstitialCountdown, setInterstitialCountdown] = useState(3);
  const [showConfetti, setShowConfetti] = useState(false);

  const questions = getTodaysChallengeQuestions()
    .filter((q) => q.type !== "dragDrop" && q.type !== "slide")
    .slice(0, TOTAL_QUESTIONS);

  const profileList = (profiles ?? []) as ChildProfile[];

  // Interstitial countdown for P2
  useEffect(() => {
    if (step !== "p2-interstitial") return;
    setInterstitialCountdown(3);
    const interval = setInterval(() => {
      setInterstitialCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setStep("p2-turn");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [step]);

  const handleP1Done = (score: number, results: boolean[]) => {
    setP1Score(score);
    p1ScoreRef.current = score;
    setP1Results(results);
    setStep("p2-interstitial");
  };

  const handleP2Done = async (score: number, results: boolean[]) => {
    setP2Score(score);
    setP2Results(results);
    playCelebration(soundEnabled);
    const today = new Date();
    const dayIndex =
      (today.getFullYear() * 10000 +
        (today.getMonth() + 1) * 100 +
        today.getDate()) %
      1000;
    const capturedP1Score = p1ScoreRef.current;
    if (p1)
      await saveProgress(
        DAILY_CHALLENGE_UNIT,
        dayIndex,
        getScoreStars(capturedP1Score),
      );
    if (p2)
      await saveProgress(DAILY_CHALLENGE_UNIT, dayIndex, getScoreStars(score));
    setStep("results");
    // Trigger confetti if not a tie
    if (capturedP1Score !== score) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
    }
  };

  const handlePlayAgain = () => {
    setP1(null);
    setP2(null);
    setP1Score(0);
    p1ScoreRef.current = 0;
    setP2Score(0);
    setP1Results([]);
    setP2Results([]);
    setShowConfetti(false);
    setStep("setup");
  };

  const selectProfile = (profile: ChildProfile) => {
    const pid = String(profile.id);
    if (p1 && String(p1.id) === pid) {
      setP1(null);
      return;
    }
    if (p2 && String(p2.id) === pid) {
      setP2(null);
      return;
    }
    if (!p1) {
      setP1(profile);
    } else if (!p2) {
      setP2(profile);
    }
  };

  const isSelected = (profile: ChildProfile) => {
    const pid = String(profile.id);
    return (p1 && String(p1.id) === pid) || (p2 && String(p2.id) === pid);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-[#F4F2FF] flex flex-col overflow-hidden"
      data-ocid="family_challenge.modal"
    >
      <AnimatePresence mode="wait">
        {/* ── SETUP ── */}
        {step === "setup" && (
          <motion.div
            key="setup"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex flex-col h-full px-4 py-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <button
                type="button"
                data-ocid="family_challenge.close.button"
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-white shadow flex items-center justify-center text-[#5B4FCF] font-black text-lg"
              >
                ×
              </button>
              <h2 className="font-black text-2xl text-[#1A1A2E]">
                ⚔️ Family Challenge
              </h2>
            </div>

            <RobotMascot size={80} mood="excited" className="mx-auto mb-4" />
            <p className="text-center text-[#6B6B8A] font-bold mb-6">
              Pick 2 players to battle it out!
            </p>

            <div className="space-y-3 mb-6">
              {profileList.map((profile) => {
                const selected = isSelected(profile);
                const isP1 = p1 && String(p1.id) === String(profile.id);
                const isP2 = p2 && String(p2.id) === String(profile.id);
                return (
                  <button
                    key={String(profile.id)}
                    type="button"
                    onClick={() => selectProfile(profile)}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${
                      selected
                        ? isP1
                          ? "border-[#5B4FCF] bg-[#5B4FCF]/10"
                          : "border-[#FF6B35] bg-[#FF6B35]/10"
                        : "border-transparent bg-white shadow-sm"
                    }`}
                    data-ocid={`family_challenge.profile.${profileList.indexOf(profile) + 1}.button`}
                  >
                    <div className="text-3xl">{profile.avatar as string}</div>
                    <div className="flex-1 text-left">
                      <p className="font-black text-[#1A1A2E]">
                        {profile.name as string}
                      </p>
                    </div>
                    {isP1 && (
                      <span className="text-xs font-black text-white bg-[#5B4FCF] rounded-full px-2 py-1">
                        P1
                      </span>
                    )}
                    {isP2 && (
                      <span className="text-xs font-black text-white bg-[#FF6B35] rounded-full px-2 py-1">
                        P2
                      </span>
                    )}
                    {!selected && (
                      <div className="w-6 h-6 rounded-full border-2 border-[#E5E0FF]" />
                    )}
                  </button>
                );
              })}
            </div>

            {profileList.length < 2 && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-4 text-center">
                <p className="text-amber-700 font-bold text-sm">
                  You need at least 2 profiles to play Family Challenge. Add
                  another profile in Settings!
                </p>
              </div>
            )}

            <button
              type="button"
              data-ocid="family_challenge.start.primary_button"
              disabled={!p1 || !p2}
              onClick={() => setStep("p1-interstitial")}
              className="w-full py-4 rounded-2xl font-black text-xl text-white shadow-lg disabled:opacity-40 mt-auto active:scale-[0.98] transition-transform"
              style={{ backgroundColor: "#5B4FCF" }}
            >
              ⚡ Start Battle!
            </button>
          </motion.div>
        )}

        {/* ── P1 INTERSTITIAL ── */}
        {step === "p1-interstitial" && p1 && (
          <motion.div
            key="p1-interstitial"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-[#5B4FCF] to-[#7B6FEF] px-6"
          >
            <div className="text-8xl mb-4">{p1.avatar as string}</div>
            <h2 className="text-3xl font-black text-white text-center mb-2">
              Ready,
            </h2>
            <h2 className="text-4xl font-black text-white text-center mb-6">
              {p1.name as string}?
            </h2>
            <p className="text-white/80 font-bold text-lg mb-8">
              7 questions, 10 seconds each!
            </p>
            <button
              type="button"
              data-ocid="family_challenge.p1_start.primary_button"
              onClick={() => setStep("p1-turn")}
              className="px-10 py-4 rounded-2xl font-black text-xl text-[#5B4FCF] bg-white shadow-xl active:scale-95 transition-transform"
            >
              I'm Ready! ⚡
            </button>
          </motion.div>
        )}

        {/* ── P1 TURN ── */}
        {step === "p1-turn" && p1 && (
          <motion.div
            key="p1-turn"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            className="flex flex-col h-full"
          >
            <div className="bg-[#5B4FCF] px-4 py-3 text-center">
              <p className="text-white/80 text-xs font-bold">⚔️ BATTLE MODE</p>
              <p className="font-black text-white text-lg">
                {p1.name as string}'s Turn!
              </p>
            </div>
            <ChallengeRound
              profile={p1}
              questions={questions}
              soundEnabled={soundEnabled}
              onComplete={handleP1Done}
            />
          </motion.div>
        )}

        {/* ── P2 INTERSTITIAL ── */}
        {step === "p2-interstitial" && p2 && (
          <motion.div
            key="p2-interstitial"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-[#FF6B35] to-[#FFD166] px-6"
          >
            <div className="text-8xl mb-4">👋</div>
            <h2 className="text-3xl font-black text-white text-center mb-2">
              Get ready,
            </h2>
            <h2 className="text-4xl font-black text-white text-center mb-6">
              {p2.name as string}!
            </h2>
            <p className="text-white/80 font-bold text-xl">Starting in...</p>
            <motion.div
              key={interstitialCountdown}
              initial={{ scale: 1.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-8xl font-black text-white mt-2"
            >
              {interstitialCountdown}
            </motion.div>
          </motion.div>
        )}

        {/* ── P2 TURN ── */}
        {step === "p2-turn" && p2 && (
          <motion.div
            key="p2-turn"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            className="flex flex-col h-full"
          >
            <div className="bg-[#FF6B35] px-4 py-3 text-center">
              <p className="text-white/80 text-xs font-bold">⚔️ BATTLE MODE</p>
              <p className="font-black text-white text-lg">
                {p2.name as string}'s Turn!
              </p>
            </div>
            <ChallengeRound
              profile={p2}
              questions={questions}
              soundEnabled={soundEnabled}
              onComplete={handleP2Done}
            />
          </motion.div>
        )}

        {/* ── RESULTS ── */}
        {step === "results" && p1 && p2 && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col h-full overflow-y-auto relative"
          >
            {/* Confetti overlay */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <ConfettiBurst active={showConfetti} />
            </div>

            <div className="flex flex-col items-center px-4 py-6">
              {/* Winner announcement */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 15,
                  delay: 0.2,
                }}
                className="text-7xl mb-3"
              >
                {p1Score !== p2Score ? "🏆" : "🤝"}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-center mb-2"
              >
                <h2 className="text-3xl font-black text-[#1A1A2E]">
                  {p1Score > p2Score
                    ? `${p1.name as string} wins!`
                    : p2Score > p1Score
                      ? `${p2.name as string} wins!`
                      : "It's a tie!"}
                </h2>
                <p className="text-[#6B6B8A] font-semibold text-sm">
                  Family Challenge complete!
                </p>
              </motion.div>

              {/* Score cards */}
              <div className="grid grid-cols-2 gap-3 w-full max-w-sm mt-4 mb-5">
                {(
                  [
                    {
                      profile: p1,
                      score: p1Score,
                      color: "#5B4FCF",
                      isWinner: p1Score > p2Score,
                    },
                    {
                      profile: p2,
                      score: p2Score,
                      color: "#FF6B35",
                      isWinner: p2Score > p1Score,
                    },
                  ] as const
                ).map((player, i) => (
                  <div
                    key={String(player.profile.id)}
                    className={`rounded-2xl p-4 text-center bg-white shadow-md border-2 transition-all ${
                      player.isWinner
                        ? "border-[#FFD166] shadow-[0_0_16px_rgba(255,209,102,0.4)]"
                        : "border-transparent"
                    }`}
                    data-ocid={`family_challenge.player${i + 1}.card`}
                  >
                    {player.isWinner && <div className="text-lg mb-1">🥇</div>}
                    <div className="text-4xl mb-1">
                      {player.profile.avatar as string}
                    </div>
                    <p className="font-black text-[#1A1A2E] text-sm mb-2">
                      {player.profile.name as string}
                    </p>
                    <p
                      className="font-black text-2xl"
                      style={{ color: player.color }}
                    >
                      {player.score}/{TOTAL_QUESTIONS}
                    </p>
                    <div className="flex justify-center gap-0.5 mt-2">
                      {[1, 2, 3].map((s) => (
                        <span
                          key={s}
                          style={{
                            fontSize: 18,
                            filter:
                              getScoreStars(player.score) >= s
                                ? "none"
                                : "grayscale(1) opacity(0.3)",
                          }}
                        >
                          ⭐
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Question-by-question comparison */}
              {(p1Results.length > 0 || p2Results.length > 0) && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="w-full max-w-sm mb-5"
                >
                  <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <h3 className="font-black text-[#1A1A2E] text-sm">
                        Question Breakdown
                      </h3>
                    </div>
                    {/* Header row */}
                    <div className="grid grid-cols-[1fr_2fr_1fr] px-4 py-2 bg-gray-50">
                      <span className="text-xs font-bold text-[#5B4FCF] truncate">
                        {(p1.name as string).split(" ")[0]}
                      </span>
                      <span className="text-xs font-bold text-center text-[#6B6B8A]">
                        Q
                      </span>
                      <span className="text-xs font-bold text-right text-[#FF6B35] truncate">
                        {(p2.name as string).split(" ")[0]}
                      </span>
                    </div>
                    {questions.map((qq, i) => {
                      const r1 = p1Results[i];
                      const r2 = p2Results[i];
                      return (
                        <div
                          key={`q-${qq.text.slice(0, 12)}-${i}`}
                          className={`grid grid-cols-[1fr_2fr_1fr] px-4 py-2 ${
                            i % 2 === 0 ? "bg-white" : "bg-gray-50/60"
                          }`}
                        >
                          <span className="text-base">
                            {r1 === undefined ? "—" : r1 ? "✅" : "❌"}
                          </span>
                          <span className="text-xs text-center text-[#6B6B8A] font-bold truncate">
                            Q{i + 1}
                          </span>
                          <span className="text-base text-right">
                            {r2 === undefined ? "—" : r2 ? "✅" : "❌"}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* Action buttons */}
              <div className="flex gap-3 w-full max-w-sm">
                <button
                  type="button"
                  data-ocid="family_challenge.play_again.button"
                  onClick={handlePlayAgain}
                  className="flex-1 py-4 rounded-2xl font-black text-base border-2 border-[#5B4FCF] text-[#5B4FCF] bg-white active:scale-95 transition-transform"
                >
                  🔄 Play Again
                </button>
                <button
                  type="button"
                  data-ocid="family_challenge.done.primary_button"
                  onClick={onClose}
                  className="flex-1 py-4 rounded-2xl font-black text-base text-white shadow-lg active:scale-95 transition-transform"
                  style={{ backgroundColor: "#5B4FCF" }}
                >
                  Done 🏠
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
