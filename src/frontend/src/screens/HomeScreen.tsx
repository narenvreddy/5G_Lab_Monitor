import {
  BookOpen,
  ChevronRight,
  Flame,
  Play,
  Plus,
  Shield,
  Star,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import type { ChildProfile } from "../backend";
import { DailyChallenge } from "../components/DailyChallenge";
import { FamilyChallenge } from "../components/FamilyChallenge";
import { RobotMascot } from "../components/RobotMascot";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Progress } from "../components/ui/progress";
import { UNITS, UNIT_COLORS, UNIT_NAMES } from "../constants/units";
import { useApp } from "../contexts/AppContext";
import { getTodayKey } from "../data/dailyChallengeQuestions";
import { useActor } from "../hooks/useActor";
import {
  getDailyStarData,
  getLessonsThisWeek,
  getStarsThisWeek,
} from "../utils/parentTracking";

function isDailyDone(profileId: string): boolean {
  try {
    return (
      localStorage.getItem(`mathquest_daily_${profileId}_${getTodayKey()}`) ===
      "done"
    );
  } catch {
    return false;
  }
}

function getTimeGreeting(): string {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "Good morning";
  if (hour >= 12 && hour < 17) return "Good afternoon";
  return "Good evening";
}

// ── Streak Shield helpers ────────────────────────────────────────────────────

function getStreakShieldActive(profileId: string): boolean {
  try {
    return (
      localStorage.getItem(`mathspark_streak_shield_${profileId}`) === "true"
    );
  } catch {
    return false;
  }
}

function setStreakShieldActive(profileId: string, value: boolean): void {
  try {
    localStorage.setItem(
      `mathspark_streak_shield_${profileId}`,
      value ? "true" : "false",
    );
  } catch {}
}

// Grant shield when streak >= 7 (if not already granted)
function maybeGrantStreakShield(profileId: string, streak: number): void {
  if (streak < 7) return;
  try {
    const key = `mathspark_streak_shield_granted_${profileId}`;
    if (localStorage.getItem(key) === "true") return;
    setStreakShieldActive(profileId, true);
    localStorage.setItem(key, "true");
  } catch {}
}

// ── Weekly Recap helpers ─────────────────────────────────────────────────────

function getWeekNumber(date: Date): string {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));
  const week1 = new Date(d.getFullYear(), 0, 4);
  return `${d.getFullYear()}-W${String(
    1 +
      Math.round(
        ((d.getTime() - week1.getTime()) / 86400000 -
          3 +
          ((week1.getDay() + 6) % 7)) /
          7,
      ),
  ).padStart(2, "00")}`;
}

function shouldShowWeeklyRecap(profileId: string): {
  show: boolean;
  starsThisWeek: number;
  lessonsThisWeek: number;
} {
  if (!profileId) return { show: false, starsThisWeek: 0, lessonsThisWeek: 0 };
  try {
    const currentWeek = getWeekNumber(new Date());
    const seenKey = `mathspark_weekly_recap_${profileId}`;
    if (localStorage.getItem(seenKey) === currentWeek) {
      return { show: false, starsThisWeek: 0, lessonsThisWeek: 0 };
    }
    const dailyData = getDailyStarData(profileId, 7);
    const activeDays = dailyData.filter((d) => d.stars > 0).length;
    if (activeDays < 5)
      return { show: false, starsThisWeek: 0, lessonsThisWeek: 0 };
    const starsThisWeek = getStarsThisWeek(profileId);
    const lessonsThisWeek = getLessonsThisWeek(profileId);
    return { show: true, starsThisWeek, lessonsThisWeek };
  } catch {
    return { show: false, starsThisWeek: 0, lessonsThisWeek: 0 };
  }
}

function markWeeklyRecapShown(profileId: string): void {
  try {
    localStorage.setItem(
      `mathspark_weekly_recap_${profileId}`,
      getWeekNumber(new Date()),
    );
  } catch {}
}

// ── Weak area helpers ─────────────────────────────────────────────────────────

function getWeakUnitFromProgress(
  progress: ChildProfile["progress"],
): { unitIdx: number; unitName: string; avgStars: number } | null {
  let weakest: { unitIdx: number; unitName: string; avgStars: number } | null =
    null;
  for (const unit of UNITS) {
    const up = progress.find((u) => Number(u.unitIndex) === unit.idx);
    if (!up) continue;
    const started = up.lessons.filter(
      (l) => Number(l.stars) > 0 || Number(l.attempts) > 0,
    );
    if (started.length < 2) continue; // not enough data
    const avg =
      started.reduce((s, l) => s + Number(l.stars), 0) / started.length;
    if (avg < 2) {
      if (!weakest || avg < weakest.avgStars) {
        weakest = { unitIdx: unit.idx, unitName: unit.name, avgStars: avg };
      }
    }
  }
  return weakest;
}

interface HomeScreenProps {
  onNavigate: (tab: string) => void;
  onNavigateToLesson?: (unitIdx: number, lessonIdx: number) => void;
}

function StatsSkeleton() {
  return (
    <div className="mt-4 flex items-center gap-3">
      <div className="h-9 w-36 bg-white/20 animate-pulse rounded-2xl" />
      <div className="h-9 w-28 bg-white/20 animate-pulse rounded-2xl" />
    </div>
  );
}

function UnitCardsSkeleton() {
  return (
    <div className="space-y-3 md:grid md:grid-cols-2 md:gap-3 md:space-y-0">
      {UNIT_NAMES.map((name) => (
        <div
          key={name}
          className="h-16 bg-[#E8E4FF] animate-pulse rounded-2xl"
        />
      ))}
    </div>
  );
}

export function HomeScreen({
  onNavigate,
  onNavigateToLesson,
}: HomeScreenProps) {
  const { activeProfile, profiles, refreshProfiles, initialized } = useApp();
  const { actor } = useActor();
  const [showCreateProfile, setShowCreateProfile] = useState(false);
  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);
  const [showDailyChallenge, setShowDailyChallenge] = useState(false);
  const [showFamilyChallenge, setShowFamilyChallenge] = useState(false);

  // Streak shield state
  const [streakShieldActive, setStreakShieldActiveState] = useState(false);

  // Weekly recap state
  const [weeklyRecap, setWeeklyRecap] = useState<{
    show: boolean;
    starsThisWeek: number;
    lessonsThisWeek: number;
  }>({ show: false, starsThisWeek: 0, lessonsThisWeek: 0 });
  const recapDismissTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isDataReady = initialized && !!activeProfile;
  const streak = Number(activeProfile?.dailyStreak?.currentStreak ?? 0);
  const profileIdStr = activeProfile ? String(activeProfile.id) : "";

  // Streak shield: grant when streak >= 7, check on profile change
  useEffect(() => {
    if (!profileIdStr) return;
    maybeGrantStreakShield(profileIdStr, streak);
    setStreakShieldActiveState(getStreakShieldActive(profileIdStr));

    if (streak === 0 && getStreakShieldActive(profileIdStr)) {
      const dailyData = getDailyStarData(profileIdStr, 2);
      const yesterday = dailyData[0];
      if (yesterday && yesterday.stars > 0) {
        setStreakShieldActive(profileIdStr, false);
        setStreakShieldActiveState(false);
        toast("\uD83D\uDEE1\uFE0F Your Streak Shield saved your streak!");
      }
    }
  }, [profileIdStr, streak]);

  // Weekly recap: check on profile load
  useEffect(() => {
    if (!profileIdStr || !isDataReady) return;
    const result = shouldShowWeeklyRecap(profileIdStr);
    if (result.show) {
      setWeeklyRecap(result);
      recapDismissTimer.current = setTimeout(() => {
        setWeeklyRecap((prev) => ({ ...prev, show: false }));
        markWeeklyRecapShown(profileIdStr);
      }, 5000);
    }
    return () => {
      if (recapDismissTimer.current) clearTimeout(recapDismissTimer.current);
    };
  }, [profileIdStr, isDataReady]);

  // Unit completion celebration toast (once per unit per profile)
  const progress = activeProfile?.progress ?? [];
  useEffect(() => {
    if (!profileIdStr || !isDataReady) return;
    UNITS.forEach((_unit, idx) => {
      const unitProgress = progress.find((u) => Number(u.unitIndex) === idx);
      const total = UNITS.find((u) => u.idx === idx)?.total ?? 0;
      if (total === 0) return;
      const completed = unitProgress
        ? unitProgress.lessons.filter((l) => Number(l.stars) > 0).length
        : 0;
      if (completed >= total) {
        const key = `mathspark_unit_complete_${profileIdStr}_${idx}`;
        if (!localStorage.getItem(key)) {
          localStorage.setItem(key, "1");
          toast.success(`\uD83C\uDF89 Unit ${idx + 1} complete! Amazing work!`);
        }
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileIdStr, isDataReady, progress]);

  const dailyDone = profileIdStr ? isDailyDone(profileIdStr) : false;

  const totalStars = useMemo(
    () =>
      progress.reduce(
        (total, unit) =>
          total + unit.lessons.reduce((s, l) => s + Number(l.stars), 0),
        0,
      ),
    [progress],
  );

  const unitProgressMap = useMemo(() => {
    const map = new Map<
      number,
      { completed: number; total: number; pct: number }
    >();
    for (const unit of UNITS) {
      const up = progress.find((u) => Number(u.unitIndex) === unit.idx);
      const completed = up
        ? up.lessons.filter((l) => Number(l.stars) > 0).length
        : 0;
      const total = unit.total ?? 0;
      map.set(unit.idx, {
        completed,
        total,
        pct: total > 0 ? (completed / total) * 100 : 0,
      });
    }
    return map;
  }, [progress]);

  // Compute in-progress unit for "Resume" card
  const resumeUnit = useMemo(() => {
    for (const unit of UNITS) {
      const up = progress.find((u) => Number(u.unitIndex) === unit.idx);
      if (!up) continue;
      const completed = up.lessons.filter((l) => Number(l.stars) > 0).length;
      const total = unit.total ?? 0;
      const hasStarted = completed > 0;
      const notDone = completed < total;
      if (hasStarted && notDone) {
        return { unitIdx: unit.idx, unitName: unit.name, completed, total };
      }
    }
    return null;
  }, [progress]);

  // Weak area for mascot greeting (Sprint 23)
  const weakUnit = useMemo(() => getWeakUnitFromProgress(progress), [progress]);

  const getUnitProgress = (unitIdx: number) =>
    unitProgressMap.get(unitIdx) ?? { completed: 0, total: 0, pct: 0 };

  const handleCreateProfile = async () => {
    if (!actor || !newName.trim()) return;
    setCreating(true);
    try {
      const newProfile: ChildProfile = {
        id: BigInt(Date.now()),
        name: newName.trim(),
        avatar: "\uD83E\uDD16",
        progress: [],
        dailyStreak: { currentStreak: BigInt(0), lastActivity: BigInt(0) },
        arcadeHighScores: [],
      };
      await actor.saveProfile(newProfile);
      await actor.switchActiveProfile(newProfile.id);
      await refreshProfiles();
      setShowCreateProfile(false);
      setNewName("");
      toast.success(`Welcome to MathSpark, ${newProfile.name}! \uD83D\uDE80`);
    } catch (e) {
      console.error(e);
      toast.error("Couldn't create profile. Please try again.");
    } finally {
      setCreating(false);
    }
  };

  // Memoized mascot mood & greeting (Sprint 22 + 23 enhancements)
  const mascotData = useMemo(() => {
    // Streak milestones (Sprint 23)
    if (streak === 21)
      return {
        mood: "excited" as const,
        greeting: "21 days! That's a habit! You're unstoppable! ⚡",
      };
    if (streak === 10)
      return {
        mood: "excited" as const,
        greeting: "10 day streak \u2014 double digits! You're a legend! 🏆",
      };
    if (streak === 5)
      return {
        mood: "excited" as const,
        greeting: "5 days in a row! You're on fire! 🔥",
      };
    // Standard streak states
    if (streak >= 3)
      return {
        mood: "excited" as const,
        greeting: `🔥 ${streak} day streak! Keep it up!`,
      };
    // Weak area nudge (Sprint 23) — only when no strong streak
    if (weakUnit && streak < 3)
      return {
        mood: "worried" as const,
        greeting: `${weakUnit.unitName} could use some practice \u2014 want to give it another go? 💪`,
      };
    if (streak === 0)
      return {
        mood: "worried" as const,
        greeting: "No streak yet \u2014 let's start one today!",
      };
    if (streak === 1)
      return {
        mood: "happy" as const,
        greeting: "Day 1 streak \u2014 keep it going tomorrow! \uD83D\uDE80",
      };
    return {
      mood: "happy" as const,
      greeting: `${streak} days in a row \u2014 keep it up!`,
    };
  }, [streak, weakUnit]);

  if (initialized && !activeProfile && profiles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-6 pb-20 bg-[#F4F2FF]">
        <RobotMascot size={120} mood="happy" className="mb-6" />
        <h1 className="text-3xl font-black text-[#5B4FCF] mb-2 text-center">
          Welcome to MathSpark!
        </h1>
        <p className="text-[#6B6B8A] text-center mb-8 text-lg">
          Let's create your first profile to get started.
        </p>
        <Button
          onClick={() => setShowCreateProfile(true)}
          className="bg-[#FF6B35] hover:bg-[#e55c28] text-white font-bold text-lg px-8 py-4 rounded-2xl"
          data-ocid="home.create_profile.primary_button"
        >
          <Plus className="mr-2" size={20} /> Create Profile
        </Button>

        <Dialog open={showCreateProfile} onOpenChange={setShowCreateProfile}>
          <DialogContent
            className="rounded-3xl"
            data-ocid="home.create_profile.dialog"
          >
            <DialogHeader>
              <DialogTitle className="text-[#5B4FCF] font-black text-xl">
                What's your name?
              </DialogTitle>
            </DialogHeader>
            <Input
              placeholder="Enter your name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreateProfile()}
              disabled={creating}
              className="rounded-xl text-lg"
              data-ocid="home.profile_name.input"
            />
            <Button
              onClick={handleCreateProfile}
              disabled={!newName.trim() || creating}
              className="bg-[#5B4FCF] hover:bg-[#4a3fbe] text-white font-bold rounded-xl"
              data-ocid="home.create_profile.submit_button"
            >
              {creating ? "Creating..." : "Let's Go! \uD83D\uDE80"}
            </Button>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <>
      {showDailyChallenge && profileIdStr && (
        <DailyChallenge
          profileId={profileIdStr}
          onClose={() => setShowDailyChallenge(false)}
        />
      )}
      {showFamilyChallenge && (
        <FamilyChallenge onClose={() => setShowFamilyChallenge(false)} />
      )}

      <div className="flex flex-col min-h-screen bg-[#F4F2FF] pb-20">
        {/* Header */}
        <div className="bg-gradient-to-br from-[#5B4FCF] via-[#6B5FDF] to-[#FF6B35] px-6 pt-10 md:pt-12 pb-8 rounded-b-[40px] shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-200 font-semibold text-sm">
                {getTimeGreeting()}!
              </p>
              <h1 className="text-white font-black text-2xl md:text-3xl">
                {activeProfile?.name ?? "Explorer"} \uD83D\uDC4B
              </h1>
            </div>
            <div className="flex flex-col items-center gap-1">
              <RobotMascot size={70} mood={mascotData.mood} />
              {isDataReady && (
                <span className="text-xs font-bold text-white/80 max-w-[90px] text-center leading-tight">
                  {mascotData.greeting}
                </span>
              )}
            </div>
          </div>

          {/* Stats row */}
          {isDataReady ? (
            <div className="mt-4 flex items-center gap-3">
              <div className="flex items-center gap-2 bg-white/20 rounded-2xl px-4 py-2">
                <Flame className="text-[#FFD166]" size={20} />
                <span className="text-white font-bold">
                  {streak > 0 ? `${streak} day streak` : "No streak yet"}
                </span>
                {streakShieldActive && (
                  <Shield size={16} className="text-[#FFD166]" />
                )}
              </div>
              <div className="flex items-center gap-2 bg-white/20 rounded-2xl px-4 py-2">
                <Star className="text-[#FFD166] fill-[#FFD166]" size={18} />
                <span className="text-white font-bold">{totalStars} stars</span>
              </div>
            </div>
          ) : (
            <StatsSkeleton />
          )}
        </div>

        {/* Weekly Recap Banner */}
        <AnimatePresence>
          {weeklyRecap.show && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="mx-4 mt-4"
              data-ocid="home.weekly_recap.card"
            >
              <button
                type="button"
                className="w-full text-left"
                onClick={() => {
                  setWeeklyRecap((prev) => ({ ...prev, show: false }));
                  markWeeklyRecapShown(profileIdStr);
                  if (recapDismissTimer.current)
                    clearTimeout(recapDismissTimer.current);
                }}
              >
                <Card className="p-4 rounded-2xl border-0 shadow-md bg-gradient-to-r from-[#00C9A7] to-[#00b598]">
                  <div className="flex items-center gap-3">
                    <RobotMascot size={50} mood="excited" />
                    <div className="flex-1">
                      <p className="font-black text-white text-sm leading-snug">
                        Amazing week, {activeProfile?.name}! \uD83C\uDF89
                      </p>
                      <p className="text-white/90 text-xs mt-0.5">
                        You earned {weeklyRecap.starsThisWeek} stars and
                        completed {weeklyRecap.lessonsThisWeek} lessons \u2014
                        keep it up!
                      </p>
                    </div>
                    <span className="text-white/60 text-xs">tap to close</span>
                  </div>
                </Card>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="px-4 pt-6 space-y-5">
          {/* ── Resume Last Lesson Card (Sprint 22) ── */}
          {resumeUnit && isDataReady && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              data-ocid="home.resume_lesson.card"
            >
              <button
                type="button"
                className="w-full text-left"
                onClick={() => {
                  if (onNavigateToLesson && resumeUnit) {
                    onNavigateToLesson(
                      resumeUnit.unitIdx,
                      resumeUnit.completed,
                    );
                  } else {
                    onNavigate("units");
                  }
                }}
                data-ocid="home.resume_lesson.primary_button"
              >
                <Card className="p-4 rounded-2xl border-0 shadow-md bg-gradient-to-r from-[#5B4FCF] to-[#7B6FEF] overflow-hidden relative">
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-5xl opacity-10 select-none">
                    \uD83D\uDCD6
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                      <Play className="text-white" size={20} fill="white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white/80 text-xs font-bold uppercase tracking-wide">
                        Continue where you left off
                      </p>
                      <p className="font-black text-white text-base leading-snug truncate">
                        {resumeUnit.unitName}
                      </p>
                      <p className="text-white/70 text-xs mt-0.5">
                        {resumeUnit.completed}/{resumeUnit.total} lessons done
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <span className="text-white/80 text-xs font-black px-3 py-1.5 bg-white/20 rounded-full">
                        Resume →
                      </span>
                    </div>
                  </div>
                </Card>
              </button>
            </motion.div>
          )}

          {/* Daily Challenge card */}
          <button
            type="button"
            data-ocid="home.daily_challenge.button"
            onClick={() => !dailyDone && setShowDailyChallenge(true)}
            disabled={dailyDone}
            className={`w-full text-left ${dailyDone ? "cursor-default" : ""}`}
          >
            <Card
              className={`p-4 rounded-2xl border-0 shadow-md overflow-hidden relative ${
                dailyDone
                  ? "bg-gradient-to-r from-[#00C9A7] to-[#00b598]"
                  : "bg-gradient-to-r from-[#FF6B35] to-[#FFD166]"
              }`}
            >
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-6xl opacity-20 select-none">
                \uD83C\uDFC6
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/30 flex items-center justify-center">
                  <Zap className="text-white" size={24} />
                </div>
                <div>
                  <p className="font-black text-white text-lg leading-tight">
                    Daily Challenge
                  </p>
                  {dailyDone ? (
                    <p className="text-white/90 text-sm font-semibold">
                      ✅ Completed today!
                    </p>
                  ) : (
                    <p className="text-white/80 text-sm font-semibold">
                      7 mixed questions \u2022 Bonus Stars + Badge
                    </p>
                  )}
                </div>
              </div>
            </Card>
          </button>

          {/* Family Challenge */}
          <button
            type="button"
            data-ocid="home.family_challenge.button"
            onClick={() => setShowFamilyChallenge(true)}
            className="w-full text-left"
          >
            <div className="p-4 rounded-2xl border-2 border-[#00C9A7] bg-white shadow-sm flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#00C9A7]/10 flex items-center justify-center text-2xl flex-shrink-0">
                \uD83D\uDC68\u200D\uD83D\uDC69\u200D\uD83D\uDC67
              </div>
              <div>
                <p className="font-black text-[#00C9A7] text-base leading-tight">
                  Family Challenge
                </p>
                <p className="text-[#6B6B8A] text-sm font-semibold">
                  Challenge another profile!
                </p>
              </div>
            </div>
          </button>

          {/* Continue Learning */}
          <Button
            onClick={() => onNavigate("units")}
            className={`w-full bg-[#FF6B35] hover:bg-[#e55c28] text-white font-black text-xl py-6 rounded-2xl shadow-md flex items-center justify-between${!resumeUnit ? " ring-4 ring-[#FF6B35]/30 animate-pulse" : ""}`}
            data-ocid="home.continue_learning.primary_button"
          >
            <span>Continue Learning</span>
            <ChevronRight size={24} />
          </Button>

          {/* Unit progress cards */}
          <div>
            <button
              type="button"
              className="w-full flex items-center justify-between mb-3 group cursor-pointer"
              onClick={() => onNavigate("units")}
              data-ocid="home.units_heading.link"
            >
              <h2 className="text-[#1A1A2E] font-black text-xl group-hover:text-[#5B4FCF] transition-colors">
                Your Units
              </h2>
              <ChevronRight
                size={18}
                className="text-[#6B6B8A] group-hover:text-[#5B4FCF] transition-colors"
              />
            </button>
            {isDataReady ? (
              <div className="space-y-3 md:grid md:grid-cols-2 md:gap-3 md:space-y-0">
                {UNIT_NAMES.map((name, idx) => {
                  const { completed, total, pct } = getUnitProgress(idx);
                  const isInProgress = completed > 0 && completed < total;
                  return (
                    <Card
                      key={name}
                      className={`p-4 rounded-2xl border-0 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer active:scale-[0.99] ${
                        isInProgress ? "ring-2 ring-[#5B4FCF]/30" : ""
                      }`}
                      onClick={() => {
                        try {
                          localStorage.setItem(
                            "mathspark_expand_unit",
                            String(idx),
                          );
                        } catch {}
                        onNavigate("units");
                      }}
                      data-ocid={`home.unit.item.${idx + 1}`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black"
                          style={{ backgroundColor: UNIT_COLORS[idx] }}
                        >
                          {idx + 1}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-bold text-[#1A1A2E]">
                              {name}
                            </span>
                            <span className="text-xs text-[#6B6B8A] font-semibold">
                              {completed}/{total}
                            </span>
                          </div>
                          <Progress value={pct} className="h-2 rounded-full" />
                        </div>
                        {isInProgress && (
                          <BookOpen
                            size={16}
                            className="text-[#5B4FCF] flex-shrink-0"
                          />
                        )}
                      </div>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <UnitCardsSkeleton />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
