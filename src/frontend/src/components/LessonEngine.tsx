import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { UNITS } from "../constants/units";
import { useApp } from "../contexts/AppContext";
import { getLessonData } from "../data/lessons";
import { recordQuestionTypeAttempt } from "../utils/parentTracking";
import { playCelebration, playCorrect, playWrong } from "../utils/sound";
import { RobotMascot } from "./RobotMascot";
import { UnitCelebration } from "./UnitCelebration";
import { DragDropQuestion } from "./lesson/DragDropQuestion";
import { FillInQuestion } from "./lesson/FillInQuestion";
import { MultiChoiceQuestion } from "./lesson/MultiChoiceQuestion";
import { TrueFalseQuestion } from "./lesson/TrueFalseQuestion";

interface LessonEngineProps {
  unitIndex: number;
  lessonIndex: number;
  onComplete: () => void;
  onBack: () => void;
  onNextLesson?: () => void;
}

type AnswerState = "idle" | "correct" | "wrong";

function StarDisplay({ count }: { count: number }) {
  return (
    <div className="flex gap-3 justify-center">
      {[1, 2, 3].map((s) => (
        <motion.span
          key={s}
          initial={{ scale: 0, rotate: -30 }}
          animate={
            count >= s ? { scale: 1, rotate: 0 } : { scale: 0.4, rotate: 0 }
          }
          transition={{
            delay: s * 0.2,
            type: "spring",
            stiffness: 400,
            damping: 15,
          }}
          style={{
            fontSize: 56,
            filter: count >= s ? "none" : "grayscale(1) opacity(0.3)",
          }}
        >
          ⭐
        </motion.span>
      ))}
    </div>
  );
}

// Module-level constant for lesson recap messages (PERF-04: hoisted to avoid recreation per render)
const unitRecaps: Record<number, string[]> = {
  0: [
    "Welcome to MathSpark! Your adventure begins now. 🚀",
    "Great start! The MathSpark adventure has begun! ✨",
    "You're ready for the journey — let's go! 🌟",
  ],
  1: [
    "Counting and numbers mastered — stellar work! ⭐",
    "You've got numbers down! Keep counting those stars! 🔢",
    "Numbers are your superpower now! 💪",
  ],
  2: [
    "Addition and subtraction champion! 🏆",
    "You're adding and subtracting like a pro! ➕➖",
    "Maths is getting easier every lesson! Keep it up! ✨",
  ],
  3: [
    "Multiplication and division master! ✖️➗",
    "Times tables conquered! You should be proud! 🌟",
    "Multiplication skills: LEVEL UP! 🎮",
  ],
  4: [
    "Fractions and decimals unlocked! 🍕",
    "You've cracked fractions — that's seriously impressive! 🎉",
    "Fractions, decimals, percentages... you've got them all! 💫",
  ],
  5: [
    "Geometry and measurement pro! 📐",
    "Shapes and measurements: totally mastered! 🔷",
    "Your geometry skills are on point! ✨",
  ],
  6: [
    "Algebra adventure complete! 🔣",
    "Variables and equations? No problem for you! 💡",
    "Algebraic thinking: activated! 🧠",
  ],
  7: [
    "History of numbers explorer! 📜",
    "You've travelled through mathematical history! 🌍",
    "From ancient times to today — you know it all! 🏛️",
  ],
  8: [
    "Complexity science pioneer! 🌀",
    "Patterns, systems, emergence — you've mastered them! 🔬",
    "You think like a complexity scientist now! 🧪",
  ],
};

export function LessonEngine({
  unitIndex,
  lessonIndex,
  onComplete,
  onBack,
  onNextLesson,
}: LessonEngineProps) {
  const { settings, saveProgress, activeProfile } = useApp();
  const activeProfileRef = useRef(activeProfile);
  useEffect(() => {
    activeProfileRef.current = activeProfile;
  });
  const lesson = getLessonData(unitIndex, lessonIndex);

  const [qIdx, setQIdx] = useState(0);
  const [answerState, setAnswerState] = useState<AnswerState>("idle");
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [wrongChoices, setWrongChoices] = useState<Set<number>>(new Set());
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [firstTryCorrect, setFirstTryCorrect] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [stars, setStars] = useState(0);
  const [saving, setSaving] = useState(false);
  const [showParticle, setShowParticle] = useState(false);
  const [fillInput, setFillInput] = useState("");
  const [usedHintThisLesson, setUsedHintThisLesson] = useState(false);
  // Drag-drop state
  const [dragPlaced, setDragPlaced] = useState<(string | null)[]>([]);
  const [dragBank, setDragBank] = useState<string[]>([]);
  const [dragBankIds, setDragBankIds] = useState<string[]>([]);
  const [dragShake, setDragShake] = useState(false);
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstUnitVisit = !activeProfile?.progress?.find(
    (u) => Number(u.unitIndex) === unitIndex && u.lessons.length > 0,
  );
  const unitName = UNITS.find((u) => u.idx === unitIndex)?.name ?? "this unit";
  const unitMeta = UNITS.find((u) => u.idx === unitIndex);

  const getRecapForLesson = (uIdx: number, lessonTitle?: string): string[] => {
    const base = unitRecaps[uIdx] ?? ["Great lesson — well done!"];
    if (lessonTitle) {
      return [
        ...base,
        `Great job on "${lessonTitle}" — you're making excellent progress! ⭐`,
      ];
    }
    return base;
  };
  const recapMessages = getRecapForLesson(unitIndex, lesson?.title);
  const [recapMessage, setRecapMessage] = useState(
    () => recapMessages[Math.floor(Math.random() * recapMessages.length)],
  );
  // biome-ignore lint/correctness/useExhaustiveDependencies: unitRecaps is stable, only reseed on lesson change
  useEffect(() => {
    const msgs = getRecapForLesson(unitIndex, lesson?.title);
    setRecapMessage(msgs[Math.floor(Math.random() * msgs.length)]);
  }, [unitIndex, lessonIndex]);

  const [showGreeting, setShowGreeting] = useState(() => isFirstUnitVisit);
  const [showCelebrating, setShowCelebrating] = useState(false);
  const [showUnitCelebration, setShowUnitCelebration] = useState(false);
  const lessonStartTime = useRef<number>(Date.now());

  const totalQ = lesson?.questions.length ?? 0;
  const currentQ = lesson?.questions[qIdx];
  const pct = totalQ > 0 ? (qIdx / totalQ) * 100 : 0;

  const showHint = wrongAttempts >= 2;
  const [hintsUsedSession, setHintsUsedSession] = useState(0);
  const hintTrackedRef = useRef(false);
  useEffect(() => {
    if (showHint && !hintTrackedRef.current) {
      hintTrackedRef.current = true;
      setHintsUsedSession((prev) => prev + 1);
    }
    if (!showHint) {
      hintTrackedRef.current = false;
    }
  }, [showHint]);
  const soundEnabled = settings.soundEnabled as boolean;

  const mascotMood =
    answerState === "correct"
      ? "celebrating"
      : answerState === "wrong"
        ? "thinking"
        : showHint
          ? "thinking"
          : currentQ?.type === "slide"
            ? "celebrating"
            : currentQ?.type === "dragDrop"
              ? "excited"
              : currentQ?.type === "fillBlank"
                ? "curious"
                : "happy";

  const completionMood =
    stars === 3 ? "celebrating" : stars === 2 ? "happy" : "worried";

  const speak = useCallback(
    (text: string) => {
      if (!settings.textToSpeechEnabled) return;
      if (typeof window === "undefined" || !window.speechSynthesis) return;
      window.speechSynthesis.cancel();
      const utt = new SpeechSynthesisUtterance(text);
      utt.rate = Number(settings.voiceSpeed) / 10;
      window.speechSynthesis.speak(utt);
    },
    [settings.textToSpeechEnabled, settings.voiceSpeed],
  );

  useEffect(() => {
    if (currentQ) speak(currentQ.text);
  }, [currentQ, speak]);

  useEffect(() => {
    if (!showGreeting) return;
    const t = setTimeout(() => setShowGreeting(false), 2500);
    return () => clearTimeout(t);
  }, [showGreeting]);

  useEffect(() => {
    if (currentQ?.type === "dragDrop" && currentQ.dragItems) {
      const newBank = [...currentQ.dragItems];
      setDragBank(newBank);
      setDragBankIds(
        newBank.map((_, i) => `${Date.now()}-${i}-${Math.random()}`),
      );
      setDragPlaced(Array(currentQ.dragTarget?.length ?? 0).fill(null));
    }
  }, [currentQ]);

  useEffect(() => {
    return () => {
      if (advanceTimer.current) clearTimeout(advanceTimer.current);
      window.speechSynthesis?.cancel();
    };
  }, []);

  // Stable reduced choice set — computed once when scaffolding first activates for a question.
  // Using refs prevents re-randomization on every wrong-answer state change.
  const stableChoiceIndicesRef = useRef<number[] | null>(null);
  const stableChoiceQKeyRef = useRef<string>("");
  const prevHintQRef = useRef<string>("");
  const hintWrongIdxRef = useRef<number>(-1);

  const visibleChoiceIndices = useMemo(() => {
    if (!currentQ?.choices || !showHint) {
      // Hint not active — reset stable refs and show all choices.
      stableChoiceIndicesRef.current = null;
      stableChoiceQKeyRef.current = "";
      hintWrongIdxRef.current = -1;
      prevHintQRef.current = "";
      return currentQ?.choices?.map((_, i) => i) ?? [];
    }
    const qKey = currentQ.text ?? "";
    // If we already computed a stable set for this question, reuse it.
    if (
      stableChoiceQKeyRef.current === qKey &&
      stableChoiceIndicesRef.current !== null
    ) {
      return stableChoiceIndicesRef.current;
    }
    // New question with hint active — compute once and lock in.
    const correctIdx = currentQ.correct ?? 0;
    stableChoiceQKeyRef.current = qKey;
    prevHintQRef.current = qKey;
    const wrongIndices = currentQ.choices
      .map((_, i) => i)
      .filter((i) => i !== correctIdx);
    hintWrongIdxRef.current =
      wrongIndices.length > 0
        ? wrongIndices[Math.floor(Math.random() * wrongIndices.length)]
        : -1;
    const result = [correctIdx];
    if (hintWrongIdxRef.current >= 0) result.push(hintWrongIdxRef.current);
    const sorted = result.sort((a, b) => a - b);
    stableChoiceIndicesRef.current = sorted;
    return sorted;
    // Intentionally exclude wrongChoices — stable indices must not re-randomize on wrong answers.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showHint, currentQ]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: uses activeProfileRef to avoid stale closure
  const handleTryAgain = useCallback(() => {
    setQIdx(0);
    setAnswerState("idle");
    setSelectedChoice(null);
    setWrongChoices(new Set());
    setWrongAttempts(0);
    setShowAnswer(false);
    setFirstTryCorrect(0);
    setIsFinished(false);
    setStars(0);
    setShowParticle(false);
    setFillInput("");
    setUsedHintThisLesson(false);
    setDragPlaced([]);
    setDragBank([]);
    setDragBankIds([]);
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: uses activeProfileRef to avoid stale closure
  const advance = useCallback(() => {
    if (qIdx + 1 >= totalQ) {
      const isAllSlides = lesson?.questions.every((q) => q.type === "slide");
      let earned = 1;
      if (isAllSlides) {
        earned = 3;
      } else {
        const ratio = firstTryCorrect / totalQ;
        if (usedHintThisLesson) {
          earned = 1;
        } else if (ratio >= 0.8) {
          earned = 3;
        } else if (ratio >= 0.5) {
          earned = 2;
        } else {
          earned = 1;
        }
      }
      setStars(earned);
      setShowParticle(false);
      playCelebration(soundEnabled);
      if (earned === 3) {
        setShowCelebrating(true);
        setTimeout(() => {
          setShowCelebrating(false);
          setIsFinished(true);
        }, 3000);
      } else {
        setIsFinished(true);
      }

      const timeSpent = Math.round(
        (Date.now() - lessonStartTime.current) / 1000,
      );

      if (earned === 3) {
        const profileId = activeProfileRef.current
          ? String(activeProfileRef.current.id)
          : null;
        if (profileId) {
          try {
            localStorage.setItem(`mathquest_perfect_${profileId}`, "true");
          } catch {}
        }
      }

      const profileIdForSpeed = activeProfileRef.current
        ? String(activeProfileRef.current.id)
        : null;
      if (profileIdForSpeed) {
        try {
          const todayKey = new Date().toISOString().slice(0, 10);
          const speedKey = `mathquest_speed_${profileIdForSpeed}_${todayKey}`;
          const prev = Number(localStorage.getItem(speedKey) ?? 0);
          localStorage.setItem(speedKey, String(prev + 1));
          const lessonsKey = `mathquest_lessons_${profileIdForSpeed}_${todayKey}`;
          const prevLessons = Number(localStorage.getItem(lessonsKey) ?? 0);
          localStorage.setItem(lessonsKey, String(prevLessons + 1));
        } catch {}
      }

      const profileIdStr = activeProfileRef.current
        ? String(activeProfileRef.current.id)
        : null;
      if (profileIdStr) {
        try {
          const timeKey = `mathquest_time_${profileIdStr}_${unitIndex}_${lessonIndex}`;
          const existing = Number(localStorage.getItem(timeKey) ?? 0);
          localStorage.setItem(timeKey, String(Math.max(existing, timeSpent)));
        } catch {}
      }

      setSaving(true);
      saveProgress(unitIndex, lessonIndex, earned).finally(() => {
        setSaving(false);
        if (unitMeta) {
          const existingProgress = activeProfileRef.current?.progress ?? [];
          const unitProgress = existingProgress.find(
            (u) => Number(u.unitIndex) === unitIndex,
          );
          const completedLessons =
            unitProgress?.lessons.filter((l) => Number(l.stars) > 0).length ??
            0;
          const nowCompleted =
            completedLessons +
            (unitProgress?.lessons.some(
              (l) =>
                Number(l.lessonIndex) === lessonIndex && Number(l.stars) > 0,
            )
              ? 0
              : 1);
          if (nowCompleted >= unitMeta.total) {
            // Use localStorage key so this is consistent with UnitsScreen dedup (BUG-04)
            const pId = activeProfile ? String(activeProfile.id) : "default";
            const celebKey = `mathquest_unit_celebrated_${pId}_${unitIndex}`;
            if (!localStorage.getItem(celebKey)) {
              localStorage.setItem(celebKey, "true");
              setShowUnitCelebration(true);
            }
          }
        }
      });
    } else {
      setQIdx((prev) => prev + 1);
      setAnswerState("idle");
      setSelectedChoice(null);
      setWrongChoices(new Set());
      setWrongAttempts(0);
      setShowAnswer(false);
      setFillInput("");
      setDragBank([]);
      setDragBankIds([]);
      setDragPlaced([]);
    }
  }, [
    qIdx,
    totalQ,
    firstTryCorrect,
    lesson,
    unitIndex,
    lessonIndex,
    saveProgress,
    soundEnabled,
    usedHintThisLesson,
  ]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: qIdx triggers reset on question change
  useEffect(() => {
    if (!settings.autoAdvance || currentQ?.type !== "slide" || isFinished)
      return;
    const timer = setTimeout(() => advance(), 4000);
    return () => clearTimeout(timer);
  }, [settings.autoAdvance, currentQ?.type, qIdx, isFinished, advance]);

  const trackHintUsage = useCallback(() => {
    setUsedHintThisLesson(true);
    try {
      const profileId = activeProfile ? String(activeProfile.id) : null;
      if (profileId) {
        const hintKey = `mathquest_hints_${profileId}_${unitIndex}_${lessonIndex}`;
        const cur = Number.parseInt(localStorage.getItem(hintKey) ?? "0", 10);
        localStorage.setItem(hintKey, String(cur + 1));
      }
    } catch {}
  }, [activeProfile, unitIndex, lessonIndex]);

  const profileIdStr = activeProfile ? String(activeProfile.id) : "";

  // biome-ignore lint/correctness/useExhaustiveDependencies: advance and trackHintUsage are stable useCallbacks
  const handleChoice = useCallback(
    (idx: number) => {
      if (answerState === "correct" || wrongChoices.has(idx)) return;
      setSelectedChoice(idx);
      const isCorrect = idx === currentQ?.correct;
      if (!wrongChoices.size) {
        recordQuestionTypeAttempt(profileIdStr, "multipleChoice", isCorrect);
      }
      if (isCorrect) {
        if (wrongChoices.size === 0) {
          setFirstTryCorrect((prev) => prev + 1);
        }
        playCorrect(soundEnabled);
        setAnswerState("correct");
        setShowParticle(true);
        setTimeout(() => setShowParticle(false), 1000);
        if (advanceTimer.current) clearTimeout(advanceTimer.current);
        advanceTimer.current = setTimeout(advance, 1200);
      } else {
        setWrongChoices((prev) => new Set(prev).add(idx));
        playWrong(soundEnabled);
        setAnswerState("wrong");
        setTimeout(() => setAnswerState("idle"), 700);
        const newCount = wrongAttempts + 1;
        setWrongAttempts(newCount);
        if (newCount === 2) {
          trackHintUsage();
          setShowAnswer(true);
          if (advanceTimer.current) clearTimeout(advanceTimer.current);
          advanceTimer.current = setTimeout(advance, 3000);
        }
      }
    },
    [
      answerState,
      wrongChoices,
      currentQ,
      soundEnabled,
      wrongAttempts,
      advance,
      trackHintUsage,
      profileIdStr,
    ],
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: advance and trackHintUsage are stable useCallbacks
  const handleTrueFalse = useCallback(
    (answer: boolean) => {
      if (answerState === "correct") return;
      const isCorrect = answer === currentQ?.isTrue;
      if (answerState !== "wrong") {
        recordQuestionTypeAttempt(profileIdStr, "trueFalse", isCorrect);
      }
      if (isCorrect) {
        if (answerState !== "wrong") {
          setFirstTryCorrect((prev) => prev + 1);
        }
        playCorrect(soundEnabled);
        setAnswerState("correct");
        setShowParticle(true);
        setTimeout(() => setShowParticle(false), 1000);
        if (advanceTimer.current) clearTimeout(advanceTimer.current);
        advanceTimer.current = setTimeout(advance, 1200);
      } else {
        playWrong(soundEnabled);
        setAnswerState("wrong");
        setTimeout(() => setAnswerState("idle"), 700);
        const newCount = wrongAttempts + 1;
        setWrongAttempts(newCount);
        if (newCount === 2) {
          trackHintUsage();
          setShowAnswer(true);
          if (advanceTimer.current) clearTimeout(advanceTimer.current);
          advanceTimer.current = setTimeout(advance, 3000);
        }
      }
    },
    [
      answerState,
      currentQ,
      soundEnabled,
      wrongAttempts,
      advance,
      trackHintUsage,
      profileIdStr,
    ],
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: advance and trackHintUsage are stable useCallbacks
  const handleFillBlankSubmit = useCallback(() => {
    if (answerState === "correct" || !fillInput.trim()) return;
    const userAnswer = fillInput.trim().toLowerCase();
    const correctAnswer = (currentQ?.answer ?? "").toLowerCase();
    const isCorrect = userAnswer === correctAnswer;
    if (answerState !== "wrong") {
      recordQuestionTypeAttempt(profileIdStr, "fillInBlank", isCorrect);
    }
    if (isCorrect) {
      if (answerState !== "wrong") {
        setFirstTryCorrect((prev) => prev + 1);
      }
      playCorrect(soundEnabled);
      setAnswerState("correct");
      setShowParticle(true);
      setTimeout(() => setShowParticle(false), 1000);
      if (advanceTimer.current) clearTimeout(advanceTimer.current);
      advanceTimer.current = setTimeout(advance, 1400);
    } else {
      playWrong(soundEnabled);
      setAnswerState("wrong");
      setFillInput("");
      setTimeout(() => setAnswerState("idle"), 900);
      const newCount = wrongAttempts + 1;
      setWrongAttempts(newCount);
      if (newCount === 2) {
        trackHintUsage();
        setShowAnswer(true);
        if (advanceTimer.current) clearTimeout(advanceTimer.current);
        advanceTimer.current = setTimeout(advance, 3000);
      }
    }
  }, [
    answerState,
    fillInput,
    currentQ,
    soundEnabled,
    wrongAttempts,
    advance,
    trackHintUsage,
    profileIdStr,
  ]);

  const handleDragBankTap = useCallback(
    (item: string, bankIdx: number) => {
      if (answerState === "correct") return;
      const firstEmpty = dragPlaced.findIndex((s) => s === null);
      if (firstEmpty === -1) return;
      const newPlaced = [...dragPlaced];
      newPlaced[firstEmpty] = item;
      const newBank = [...dragBank];
      newBank.splice(bankIdx, 1);
      setDragPlaced(newPlaced);
      setDragBank(newBank);
      setDragBankIds((prev) => prev.filter((_, idx) => idx !== bankIdx));
    },
    [answerState, dragPlaced, dragBank],
  );

  const handleDragSlotTap = useCallback(
    (slotIdx: number) => {
      if (answerState === "correct") return;
      const item = dragPlaced[slotIdx];
      if (!item) return;
      const newPlaced = [...dragPlaced];
      newPlaced[slotIdx] = null;
      const returnId = `return-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      setDragBank((prev) => [...prev, item]);
      setDragBankIds((prev) => [...prev, returnId]);
      setDragPlaced(newPlaced);
    },
    [answerState, dragPlaced],
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: advance and trackHintUsage are stable useCallbacks
  const handleDragCheck = useCallback(() => {
    if (answerState === "correct") return;
    const allFilled = dragPlaced.every((s) => s !== null);
    if (!allFilled) return;
    const correct = currentQ?.dragTarget ?? [];
    const isCorrect = dragPlaced.every((item, i) => item === correct[i]);
    if (!dragShake) {
      recordQuestionTypeAttempt(profileIdStr, "dragDrop", isCorrect);
    }
    if (isCorrect) {
      if (!dragShake) {
        setFirstTryCorrect((prev) => prev + 1);
      }
      playCorrect(soundEnabled);
      setAnswerState("correct");
      setShowParticle(true);
      setTimeout(() => setShowParticle(false), 1000);
      if (advanceTimer.current) clearTimeout(advanceTimer.current);
      advanceTimer.current = setTimeout(advance, 1400);
    } else {
      playWrong(soundEnabled);
      setAnswerState("wrong");
      setDragShake(true);
      setTimeout(() => {
        setAnswerState("idle");
        setDragShake(false);
      }, 700);
      const newCount = wrongAttempts + 1;
      setWrongAttempts(newCount);
      if (newCount === 2) {
        trackHintUsage();
        setTimeout(() => {
          const returnItems = dragPlaced.filter((s): s is string => s !== null);
          setDragBank((prev) => [...prev, ...returnItems]);
          setDragPlaced(Array(currentQ?.dragTarget?.length ?? 0).fill(null));
        }, 600);
      }
    }
  }, [
    answerState,
    dragPlaced,
    currentQ,
    soundEnabled,
    dragShake,
    wrongAttempts,
    advance,
    trackHintUsage,
    profileIdStr,
  ]);

  const getCorrectAnswerText = (q: typeof currentQ): string => {
    if (!q) return "";
    if (q.type === "multiChoice" && q.choices && q.correct !== undefined) {
      return q.choices[q.correct] ?? "";
    }
    if (q.type === "trueFalse") {
      return q.isTrue ? "True" : "False";
    }
    if (q.type === "fillBlank") {
      return String(q.answer ?? "");
    }
    if (q.type === "dragDrop" && q.dragTarget) {
      return q.dragTarget.join(" → ");
    }
    return String(q.answer ?? "");
  };

  if (!lesson) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#F4F2FF]">
        <p className="text-[#6B6B8A] font-semibold">Lesson not found.</p>
      </div>
    );
  }

  if (showCelebrating) {
    return (
      <div className="fixed inset-0 z-50 bg-[#F4F2FF] flex flex-col items-center justify-center px-6 text-center">
        <RobotMascot size={140} mood="celebrating" className="mb-6" />
        <h2 className="text-4xl font-black text-[#5B4FCF] mb-3">Perfect! 🎉</h2>
        <p className="text-xl font-bold text-[#1A1A2E] mb-2">Amazing job!</p>
        <p className="text-[#6B6B8A] font-semibold">
          You got every question right on the first try!
        </p>
        <div className="flex gap-3 mt-6">
          {[1, 2, 3].map((s) => (
            <span key={s} style={{ fontSize: 52 }}>
              ⭐
            </span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      {showUnitCelebration && (
        <UnitCelebration
          unitName={unitName}
          unitEmoji="🏆"
          onContinue={() => {
            setShowUnitCelebration(false);
            onComplete();
          }}
        />
      )}
      <div className="fixed inset-0 z-50 bg-[#F4F2FF] flex flex-col overflow-hidden">
        {/* Screen reader feedback */}
        <div aria-live="polite" className="sr-only">
          {answerState === "correct"
            ? "Correct!"
            : answerState === "wrong"
              ? "Not quite, try again!"
              : ""}
        </div>
        {/* Header */}
        <div className="bg-white shadow-sm px-4 pt-safe-top pt-4 pb-3 flex items-center gap-3">
          <button
            type="button"
            data-ocid="lesson.back.button"
            onClick={onBack}
            className="w-10 h-10 rounded-xl bg-[#F4F2FF] flex items-center justify-center text-[#5B4FCF] font-black text-xl flex-shrink-0 active:bg-purple-100"
            aria-label="Go back"
          >
            ←
          </button>
          <h2 className="flex-1 text-center font-black text-[#1A1A2E] text-base truncate">
            {lesson.title}
          </h2>
          <div className="flex items-center gap-2 flex-shrink-0">
            {hintsUsedSession > 0 && (
              <span className="text-xs font-bold text-[#6B6B8A] bg-white/60 rounded-full px-2 py-0.5">
                💡 {hintsUsedSession} hint{hintsUsedSession !== 1 ? "s" : ""}{" "}
                used
              </span>
            )}
            <span className="text-sm font-bold text-[#6B6B8A] bg-[#F4F2FF] px-3 py-1 rounded-full">
              Q {isFinished ? totalQ : qIdx + 1}/{totalQ}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-2 bg-gray-200 w-full">
          <motion.div
            className="h-full bg-gradient-to-r from-[#5B4FCF] to-[#FF6B35] rounded-r-full"
            initial={{ width: 0 }}
            animate={{ width: `${isFinished ? 100 : pct}%` }}
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
              transition={{ duration: 0.2 }}
              className="w-full bg-[#00C9A7] py-2 px-4 text-center text-white font-black text-lg"
            >
              Correct! 🎉
            </motion.div>
          )}
        </AnimatePresence>

        {/* Greeting bubble */}
        {showGreeting && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/30 pointer-events-none">
            <div className="bg-white rounded-3xl p-6 mx-6 shadow-2xl flex flex-col items-center text-center max-w-sm pointer-events-auto">
              <RobotMascot size={90} mood="greeting" className="mb-3" />
              <h3 className="font-black text-[#5B4FCF] text-xl mb-1">
                Welcome!
              </h3>
              <p className="font-bold text-[#1A1A2E] text-lg leading-snug">
                Welcome to {unitName}!<br />
                Let&apos;s go! 🚀
              </p>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            {isFinished ? (
              <motion.div
                key="end"
                data-ocid="lesson.end.panel"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center justify-center min-h-full px-6 md:px-12 py-10 text-center"
              >
                <RobotMascot
                  size={120}
                  mood={completionMood}
                  className="mb-4"
                />
                <h2
                  className="text-4xl font-black mb-2"
                  style={{
                    color:
                      stars === 3
                        ? "#5B4FCF"
                        : stars === 2
                          ? "#00C9A7"
                          : "#FF6B35",
                  }}
                >
                  {stars === 3
                    ? "🎉 Perfect Score!"
                    : stars === 2
                      ? "✅ Lesson Complete!"
                      : "💪 Keep Going!"}
                </h2>
                <p className="text-[#6B6B8A] font-semibold mb-8 text-lg">
                  {stars === 3
                    ? "Amazing! You nailed it!"
                    : stars === 2
                      ? "Great job! Keep practising!"
                      : "Good effort! Try again to improve!"}
                </p>
                {usedHintThisLesson && stars < 2 && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm text-[#6B6B8A] mb-4 italic"
                  >
                    💜 You used a hint — retry for more stars!
                  </motion.p>
                )}
                <StarDisplay count={stars} />
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="mt-6 flex items-start gap-3 rounded-2xl p-4 max-w-xs mx-auto text-left"
                  style={{ background: "#FFF9E6", border: "2px solid #FFD166" }}
                >
                  <RobotMascot
                    size={60}
                    mood={completionMood}
                    className="flex-shrink-0"
                  />
                  <div>
                    <div className="font-black text-[#5B4FCF] text-xs mb-1">
                      {stars === 3
                        ? "Outstanding work! 🌟"
                        : stars === 2
                          ? "Great work today! ✨"
                          : "Don't give up! 💜"}
                    </div>
                    <div className="text-[#1A1A2E] text-sm font-semibold leading-snug">
                      {recapMessage}
                    </div>
                  </div>
                </motion.div>
                <div className="mt-10 flex flex-col gap-3 items-center">
                  {stars === 1 && (
                    <button
                      type="button"
                      data-ocid="lesson.try_again.button"
                      onClick={handleTryAgain}
                      className="px-10 py-4 rounded-2xl font-black text-xl text-white shadow-lg active:scale-95 transition-transform w-full max-w-xs"
                      style={{ backgroundColor: "#FF6B35" }}
                    >
                      🔄 Try Again
                    </button>
                  )}
                  {onNextLesson && stars >= 2 && (
                    <button
                      type="button"
                      data-ocid="lesson.next_lesson.button"
                      onClick={onNextLesson}
                      disabled={saving}
                      className="px-10 py-4 rounded-2xl font-black text-xl text-white shadow-lg active:scale-95 transition-transform w-full max-w-xs"
                      style={{ backgroundColor: "#5B4FCF" }}
                    >
                      Continue to next lesson →
                    </button>
                  )}
                  <button
                    type="button"
                    data-ocid="lesson.finish.button"
                    onClick={onComplete}
                    disabled={saving}
                    className={
                      onNextLesson
                        ? "px-8 py-3 rounded-2xl font-bold text-base border-2 active:scale-95 transition-transform w-full max-w-xs"
                        : "px-10 py-4 rounded-2xl font-black text-xl text-white shadow-lg active:scale-95 transition-transform"
                    }
                    style={
                      onNextLesson
                        ? {
                            borderColor: "#5B4FCF",
                            color: "#5B4FCF",
                            backgroundColor: "transparent",
                          }
                        : { backgroundColor: "#5B4FCF" }
                    }
                  >
                    {saving ? "Saving..." : "Back to Units 🏠"}
                  </button>
                </div>
              </motion.div>
            ) : currentQ?.type === "slide" ? (
              <motion.div
                key={`slide-${qIdx}`}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center px-6 py-8 text-center gap-6"
              >
                <RobotMascot size={100} mood="celebrating" />
                <h2 className="text-3xl font-black text-[#1A1A2E] leading-tight">
                  {currentQ.text}
                </h2>
                <p className="text-[#6B6B8A] text-lg font-semibold leading-relaxed max-w-sm">
                  {currentQ.slideText}
                </p>
                <button
                  type="button"
                  data-ocid="lesson.next.button"
                  onClick={advance}
                  className="mt-4 px-10 py-4 rounded-2xl font-black text-xl text-white shadow-lg active:scale-95 transition-transform"
                  style={{ backgroundColor: "#FF6B35" }}
                >
                  {qIdx + 1 >= totalQ ? "Finish! 🎉" : "Next →"}
                </button>
              </motion.div>
            ) : currentQ?.type === "trueFalse" ? (
              <motion.div
                key={`tf-${qIdx}`}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.3 }}
              >
                <TrueFalseQuestion
                  questionText={currentQ.text}
                  visual={currentQ.visual}
                  mascotMood={mascotMood}
                  answerState={answerState}
                  showHint={showHint}
                  showAnswer={showAnswer}
                  showParticle={showParticle}
                  isFinished={isFinished}
                  correctAnswerText={getCorrectAnswerText(currentQ)}
                  onAnswer={handleTrueFalse}
                />
              </motion.div>
            ) : currentQ?.type === "fillBlank" ? (
              <motion.div
                key={`fill-${qIdx}`}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.3 }}
              >
                <FillInQuestion
                  questionText={currentQ.text}
                  visual={currentQ.visual}
                  hint={currentQ.hint}
                  answer={currentQ.answer}
                  mascotMood={mascotMood}
                  answerState={answerState}
                  showHint={showHint}
                  showAnswer={showAnswer}
                  showParticle={showParticle}
                  isFinished={isFinished}
                  fillInput={fillInput}
                  correctAnswerText={getCorrectAnswerText(currentQ)}
                  onInputChange={setFillInput}
                  onSubmit={handleFillBlankSubmit}
                />
              </motion.div>
            ) : currentQ?.type === "dragDrop" ? (
              <motion.div
                key={`drag-${qIdx}`}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.3 }}
              >
                <DragDropQuestion
                  questionText={currentQ.text}
                  mascotMood={mascotMood}
                  answerState={answerState}
                  showHint={showHint}
                  showParticle={showParticle}
                  isFinished={isFinished}
                  dragShake={dragShake}
                  dragPlaced={dragPlaced}
                  dragBank={dragBank}
                  dragBankIds={dragBankIds}
                  onBankTap={handleDragBankTap}
                  onSlotTap={handleDragSlotTap}
                  onCheck={handleDragCheck}
                />
              </motion.div>
            ) : (
              <motion.div
                key={`q-${qIdx}`}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.3 }}
              >
                <MultiChoiceQuestion
                  questionText={currentQ?.text ?? ""}
                  visual={currentQ?.visual}
                  choices={currentQ?.choices ?? []}
                  selectedChoice={selectedChoice}
                  wrongChoices={wrongChoices}
                  answerState={answerState}
                  showHint={showHint}
                  showAnswer={showAnswer}
                  showParticle={showParticle}
                  isFinished={isFinished}
                  visibleChoiceIndices={visibleChoiceIndices}
                  correctAnswerText={getCorrectAnswerText(currentQ)}
                  onChoice={handleChoice}
                  mascotMood={mascotMood}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
