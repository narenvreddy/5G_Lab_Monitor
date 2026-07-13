import { BookOpen, Flame, Star } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import type { ChildProfile } from "../../backend";
import { ShareProgressCard } from "../../components/ShareProgressCard";
import { Card } from "../../components/ui/card";
import { Progress } from "../../components/ui/progress";
import { Skeleton } from "../../components/ui/skeleton";
import { UNITS } from "../../constants/units";

const LEVEL_THRESHOLDS = [0, 20, 60, 120, 200, 300];
const LEVEL_TITLES = [
  { min: 0, title: "Math Explorer", emoji: "🦭" },
  { min: 20, title: "Number Knight", emoji: "⚔️" },
  { min: 60, title: "Equation Wizard", emoji: "🧙" },
  { min: 120, title: "Math Master", emoji: "👑" },
  { min: 200, title: "Grand Wizard", emoji: "✨" },
  { min: 300, title: "Math Legend", emoji: "🌟" },
];

function ProgressSkeleton() {
  return (
    <div className="space-y-4" data-ocid="progress.loading_state">
      <Card className="p-5 rounded-2xl border-0 shadow-md">
        <div className="flex items-center gap-4">
          <Skeleton className="w-12 h-12 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-32 rounded" />
            <Skeleton className="h-4 w-48 rounded" />
          </div>
        </div>
      </Card>
      <Card className="p-5 rounded-2xl border-0 shadow-md">
        <Skeleton className="h-5 w-20 rounded mb-3" />
        <div className="flex gap-2">
          <Skeleton className="w-10 h-10 rounded-full" />
          <Skeleton className="w-10 h-10 rounded-full" />
          <Skeleton className="w-10 h-10 rounded-full" />
        </div>
      </Card>
    </div>
  );
}

interface StarsTabProps {
  profile: ChildProfile | null;
  isLoading: boolean;
}

export function StarsTab({ profile, isLoading }: StarsTabProps) {
  const [showShareCard, setShowShareCard] = useState(false);

  const totalStars = (profile?.progress ?? []).reduce(
    (total, unit) =>
      total + unit.lessons.reduce((s, l) => s + Number(l.stars), 0),
    0,
  );
  const streak = Number(profile?.dailyStreak?.currentStreak ?? 0);

  const levelIndex = LEVEL_THRESHOLDS.reduce(
    (acc, threshold, i) => (totalStars >= threshold ? i : acc),
    0,
  );
  const levelTitle = LEVEL_TITLES[levelIndex] ?? LEVEL_TITLES[0];
  const nextThreshold =
    LEVEL_THRESHOLDS[levelIndex + 1] ??
    LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
  const prevThreshold = LEVEL_THRESHOLDS[levelIndex] ?? 0;
  const xpProgress =
    nextThreshold > prevThreshold
      ? Math.round(
          ((totalStars - prevThreshold) / (nextThreshold - prevThreshold)) *
            100,
        )
      : 100;

  if (isLoading) return <ProgressSkeleton />;

  return (
    <div className="space-y-4">
      {showShareCard && profile && (
        <ShareProgressCard
          profile={profile}
          onClose={() => setShowShareCard(false)}
        />
      )}

      {/* Level Hero Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card
          className="border-0 shadow-lg overflow-hidden rounded-2xl"
          data-ocid="progress.level_hero.card"
        >
          <div className="bg-gradient-to-br from-[#5B4FCF] to-[#7B6FEF] p-5">
            <div className="flex items-center gap-4">
              <div className="text-6xl">{levelTitle.emoji}</div>
              <div className="flex-1">
                <div className="font-black text-2xl text-white">
                  {levelTitle.title}
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <span className="flex items-center gap-1 text-sm font-bold text-[#FFD166]">
                    <Star size={14} className="fill-[#FFD166]" /> {totalStars}{" "}
                    stars
                  </span>
                  <span className="flex items-center gap-1 text-sm font-bold text-orange-200">
                    <Flame size={14} /> {streak} day streak
                  </span>
                </div>
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-purple-200 mb-1 font-bold">
                    <span>Level {levelIndex + 1}</span>
                    <span>
                      {totalStars}/{nextThreshold} Stars
                    </span>
                  </div>
                  <div className="h-2.5 bg-white/20 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-[#FFD166] rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${xpProgress}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Share Progress button */}
      <button
        type="button"
        data-ocid="progress.share_progress.button"
        onClick={() => setShowShareCard(true)}
        className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl border-2 border-[#5B4FCF] text-[#5B4FCF] font-black text-sm bg-white shadow-sm active:scale-[0.98] transition-all"
      >
        📤 Share Progress
      </button>

      {/* Unit Progress */}
      <Card className="p-5 rounded-2xl border-0 shadow-md">
        <h3 className="font-black text-[#1A1A2E] mb-3 flex items-center gap-2">
          <BookOpen size={16} className="text-[#5B4FCF]" />
          Unit Progress
        </h3>
        <div className="space-y-2">
          {UNITS.map((unit) => {
            const unitData = profile?.progress.find(
              (u) => Number(u.unitIndex) === unit.idx,
            );
            const completed =
              unitData?.lessons.filter((l) => Number(l.stars) > 0).length ?? 0;
            const pct = (completed / unit.total) * 100;
            return (
              <div key={unit.idx} className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#6B6B8A] w-24 truncate">
                  {unit.name}
                </span>
                <Progress value={pct} className="flex-1 h-2 rounded-full" />
                <span className="text-xs font-bold text-[#6B6B8A] w-8 text-right">
                  {completed}/{unit.total}
                </span>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
