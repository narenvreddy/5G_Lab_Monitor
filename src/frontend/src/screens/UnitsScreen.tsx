import { CheckCircle, ChevronRight, Circle, Lock, Star } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import React, { useEffect, useMemo, useState } from "react";
import { LessonEngine } from "../components/LessonEngine";
import { UnitCelebration } from "../components/UnitCelebration";
import { Card } from "../components/ui/card";
import { UNITS, type UnitMeta } from "../constants/units";
import { useApp } from "../contexts/AppContext";
import { getLessonData } from "../data/lessons";

// Skeleton rows shown while profile data loads
function UnitsSkeleton() {
  return (
    <div className="px-4 pt-4 space-y-3">
      {["sk1", "sk2", "sk3", "sk4", "sk5", "sk6"].map((k) => (
        <div key={k} className="h-20 bg-[#E8E4FF] animate-pulse rounded-2xl" />
      ))}
    </div>
  );
}

interface UnitsScreenProps {
  resumeLesson?: { unitIdx: number; lessonIdx: number } | null;
  onResumeLessonConsumed?: () => void;
}

export function UnitsScreen({
  resumeLesson,
  onResumeLessonConsumed,
}: UnitsScreenProps) {
  const { activeProfile, initialized } = useApp();
  const [expandedUnitIdx, setExpandedUnitIdx] = useState<number | null>(() => {
    // UX-03: auto-expand unit if HomeScreen set a hint via localStorage
    try {
      const hint = localStorage.getItem("mathspark_expand_unit");
      if (hint !== null) {
        localStorage.removeItem("mathspark_expand_unit");
        const idx = Number.parseInt(hint, 10);
        return Number.isFinite(idx) ? idx : null;
      }
    } catch {}
    return null;
  });
  const [activeLessonKey, setActiveLessonKey] = useState<{
    unitIdx: number;
    lessonIdx: number;
  } | null>(null);
  const [celebrationUnit, setCelebrationUnit] = useState<UnitMeta | null>(null);
  const [pendingCelebrationCheck, setPendingCelebrationCheck] = useState<
    number | null
  >(null);
  const [lessonReturnUnitIdx, setLessonReturnUnitIdx] = useState<number | null>(
    null,
  );

  // Fix 5: consume resumeLesson prop
  useEffect(() => {
    if (resumeLesson) {
      setActiveLessonKey(resumeLesson);
      setLessonReturnUnitIdx(resumeLesson.unitIdx);
      onResumeLessonConsumed?.();
    }
  }, [resumeLesson, onResumeLessonConsumed]);

  const getUnitProgress = (unitIdx: number) => {
    const unit = activeProfile?.progress.find(
      (u) => Number(u.unitIndex) === unitIdx,
    );
    if (!unit)
      return {
        completed: 0,
        total: UNITS[unitIdx]?.total ?? 0,
        pct: 0,
      };
    const completed = unit.lessons.filter((l) => Number(l.stars) > 0).length;
    const total = UNITS[unitIdx]?.total ?? 1;
    return { completed, total, pct: (completed / total) * 100 };
  };

  const getUnitStars = (unitIdx: number): number => {
    const unit = activeProfile?.progress.find(
      (u) => Number(u.unitIndex) === unitIdx,
    );
    if (!unit) return 0;
    return unit.lessons.reduce((s, l) => s + Number(l.stars), 0);
  };

  const getUnitMaxStars = (unitIdx: number): number => {
    return (UNITS[unitIdx]?.total ?? 0) * 3;
  };

  // Unlock next unit after completing at least 1 lesson in the previous unit
  const isUnitUnlocked = (unitIdx: number) => {
    if (unitIdx === 0) return true;
    const prev = getUnitProgress(unitIdx - 1);
    return prev.completed >= 1;
  };

  const getLessonStars = (unitIdx: number, lessonIdx: number): number => {
    const unit = activeProfile?.progress.find(
      (u) => Number(u.unitIndex) === unitIdx,
    );
    const lesson = unit?.lessons.find(
      (l) => Number(l.lessonIndex) === lessonIdx,
    );
    return Number(lesson?.stars ?? 0);
  };

  const handleLessonComplete = (unitIdx: number) => {
    setPendingCelebrationCheck(unitIdx);
    setActiveLessonKey(null);
  };

  // Fix 3: detect if user has any progress at all
  const hasAnyProgress = useMemo(() => {
    if (!activeProfile) return false;
    return activeProfile.progress.some((u) =>
      u.lessons.some((l) => Number(l.stars) > 0),
    );
  }, [activeProfile]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: check after profile update
  useEffect(() => {
    if (pendingCelebrationCheck === null) return;
    const unitIdx = pendingCelebrationCheck;
    setPendingCelebrationCheck(null);
    const unit = UNITS[unitIdx];
    if (!unit) return;
    const { completed, total } = getUnitProgress(unitIdx);
    if (completed >= total && total > 0) {
      const profileId = activeProfile?.id
        ? String(activeProfile.id)
        : "default";
      const celebKey = `mathquest_unit_celebrated_${profileId}_${unitIdx}`;
      if (!localStorage.getItem(celebKey)) {
        localStorage.setItem(celebKey, "true");
        setCelebrationUnit(unit);
      }
    }
  }, [activeProfile, pendingCelebrationCheck]);

  // Show skeleton while data is loading
  const isDataReady = initialized && !!activeProfile;

  return (
    <div className="flex flex-col min-h-screen bg-[#F4F2FF] pb-20">
      <div className="bg-gradient-to-br from-[#5B4FCF] to-[#7B6FDF] px-6 pt-10 md:pt-12 pb-6 rounded-b-[40px] shadow-lg">
        <h1 className="text-white font-black text-2xl md:text-3xl lg:text-4xl">
          Units
        </h1>
        <p className="text-purple-200 mt-1">
          Complete 1 lesson in a unit to unlock the next!
        </p>
      </div>

      {!isDataReady ? (
        <UnitsSkeleton />
      ) : (
        <div className="px-4 md:px-6 pt-4 md:grid md:grid-cols-2 md:gap-x-4 md:items-start">
          <AnimatePresence>
            {UNITS.map((unit) => {
              const unlocked = isUnitUnlocked(unit.idx);
              const { completed, total, pct } = getUnitProgress(unit.idx);
              const stars = getUnitStars(unit.idx);
              const maxStars = getUnitMaxStars(unit.idx);
              const prevUnitName =
                unit.idx > 0 ? UNITS[unit.idx - 1]?.name : null;
              const isExpanded = expandedUnitIdx === unit.idx;
              return (
                <div key={unit.idx} className="mb-2">
                  {/* Fix 3: Start here badge for Unit 0 */}
                  {unit.idx === 0 && !hasAnyProgress && (
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-black text-white bg-[#FF6B35] px-3 py-1 rounded-full animate-pulse">
                        ⚡ Start here!
                      </span>
                    </div>
                  )}
                  <Card
                    className={`p-4 rounded-2xl border-0 shadow-md transition-all ${
                      unlocked
                        ? "cursor-pointer hover:scale-[1.01] active:scale-[0.99] hover:shadow-lg"
                        : "opacity-60 cursor-not-allowed"
                    }`}
                    onClick={() =>
                      unlocked &&
                      setExpandedUnitIdx((prev) =>
                        prev === unit.idx ? null : unit.idx,
                      )
                    }
                    data-ocid={`units.unit.item.${unit.idx + 1}`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-lg flex-shrink-0"
                        style={{
                          backgroundColor: unlocked ? unit.color : "#6B6B8A",
                        }}
                      >
                        {unlocked ? unit.idx + 1 : <Lock size={20} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <span
                            className={`font-black text-lg ${
                              unlocked ? "text-[#1A1A2E]" : "text-[#6B6B8A]"
                            }`}
                          >
                            {unit.name}
                          </span>
                          <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                            {completed > 0 && (
                              <span className="text-xs text-[#FFD166] font-bold">
                                {stars}/{maxStars}
                              </span>
                            )}
                            <span className="text-xs text-[#6B6B8A] font-semibold">
                              {completed}/{total}
                            </span>
                          </div>
                        </div>
                        {!unlocked && prevUnitName && (
                          <p className="text-xs text-[#6B6B8A] mt-0.5">
                            Finish 1 lesson in{" "}
                            <span className="font-bold">{prevUnitName}</span> to
                            unlock
                          </p>
                        )}
                        <div className="mt-2 h-2 rounded-full bg-gray-100 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${pct}%`,
                              backgroundColor: unlocked
                                ? unit.color
                                : "#6B6B8A",
                            }}
                          />
                        </div>
                      </div>
                      {unlocked && (
                        <ChevronRight
                          size={20}
                          className={`text-[#6B6B8A] flex-shrink-0 transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`}
                        />
                      )}
                    </div>
                  </Card>

                  {/* Fix 4: Inline accordion lesson list */}
                  <AnimatePresence>
                    {isExpanded && unlocked && (
                      <motion.div
                        key={`lessons-${unit.idx}`}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="mx-2 mb-2 bg-white rounded-2xl shadow-inner border border-[#E8E4FF] overflow-hidden">
                          <div className="p-3 space-y-1">
                            {Array.from({ length: unit.total }, (_, idx) => {
                              const lessonTitle =
                                getLessonData(unit.idx, idx)?.title ??
                                `Lesson ${idx + 1}`;
                              const lessonStars = getLessonStars(unit.idx, idx);
                              const isComplete = lessonStars > 0;
                              return (
                                <button
                                  type="button"
                                  // biome-ignore lint/suspicious/noArrayIndexKey: lesson positions are stable
                                  key={`lesson-${unit.idx}-${idx}`}
                                  className="w-full flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-purple-50 cursor-pointer transition-colors text-left"
                                  onClick={() => {
                                    setLessonReturnUnitIdx(unit.idx);
                                    setActiveLessonKey({
                                      unitIdx: unit.idx,
                                      lessonIdx: idx,
                                    });
                                    setExpandedUnitIdx(null);
                                  }}
                                  data-ocid={`units.lesson.item.${idx + 1}`}
                                >
                                  <div className="flex-shrink-0">
                                    {isComplete ? (
                                      <CheckCircle
                                        size={22}
                                        className="text-[#00C9A7]"
                                        fill="#00C9A7"
                                        fillOpacity={0.15}
                                      />
                                    ) : (
                                      <Circle
                                        size={22}
                                        className="text-[#6B6B8A]"
                                      />
                                    )}
                                  </div>
                                  <span
                                    className={`flex-1 font-semibold ${isComplete ? "text-[#1A1A2E]" : "text-[#6B6B8A]"}`}
                                  >
                                    {lessonTitle}
                                  </span>
                                  {isComplete && (
                                    <div className="flex gap-0.5">
                                      {[1, 2, 3].map((s) => (
                                        <Star
                                          key={s}
                                          size={14}
                                          className={
                                            s <= lessonStars
                                              ? "text-[#FFD166] fill-[#FFD166]"
                                              : "text-gray-200 fill-gray-200"
                                          }
                                        />
                                      ))}
                                    </div>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {activeLessonKey && (
        <LessonEngine
          unitIndex={activeLessonKey.unitIdx}
          lessonIndex={activeLessonKey.lessonIdx}
          onBack={() => {
            setActiveLessonKey(null);
            setExpandedUnitIdx(lessonReturnUnitIdx);
          }}
          onComplete={() => handleLessonComplete(activeLessonKey.unitIdx)}
          onNextLesson={
            getLessonData(
              activeLessonKey.unitIdx,
              activeLessonKey.lessonIdx + 1,
            ) !== null
              ? () => {
                  if (!activeLessonKey) return;
                  const nextKey = {
                    unitIdx: activeLessonKey.unitIdx,
                    lessonIdx: activeLessonKey.lessonIdx + 1,
                  };
                  setPendingCelebrationCheck(activeLessonKey.unitIdx);
                  setActiveLessonKey(nextKey);
                }
              : undefined
          }
        />
      )}

      {celebrationUnit && (
        <UnitCelebration
          unitName={celebrationUnit.name}
          unitEmoji="🎉"
          onContinue={() => setCelebrationUnit(null)}
        />
      )}
    </div>
  );
}
