import type { ChildProfile } from "../backend";
import { UNITS } from "../constants/units";

export interface AchievementDef {
  id: string;
  emoji: string;
  title: string;
  desc: string;
  earned: boolean;
  rarity: "common" | "rare" | "epic" | "legendary";
}

export const getTotalStars = (profile: ChildProfile): number =>
  profile.progress.reduce(
    (total, unit) =>
      total + unit.lessons.reduce((s, l) => s + Number(l.stars), 0),
    0,
  );

export function getDailyCompletionCount(profileId: string): number {
  try {
    // Read from a dedicated counter key instead of scanning all localStorage keys (PERF-01)
    return Number(
      localStorage.getItem(`mathspark_daily_count_${profileId}`) ?? 0,
    );
  } catch {
    return 0;
  }
}

export function buildAchievements(
  profile: ChildProfile | null,
  profileId: string,
): AchievementDef[] {
  if (!profile) return [];
  const totalStars = getTotalStars(profile);
  const streak = Number(profile.dailyStreak?.currentStreak ?? 0);
  const arcadeScores = profile.arcadeHighScores;
  const dailyCount = getDailyCompletionCount(profileId);
  const todayKey = new Date().toISOString().slice(0, 10);

  const countUnitsComplete = () =>
    profile.progress.filter((u) => {
      const unit = UNITS.find((x) => x.idx === Number(u.unitIndex));
      if (!unit) return false;
      return u.lessons.filter((l) => Number(l.stars) > 0).length >= unit.total;
    }).length;

  const unitsComplete = countUnitsComplete();
  const anyUnitComplete = unitsComplete >= 1;

  let speedLearner = false;
  try {
    speedLearner =
      Number(
        localStorage.getItem(`mathquest_speed_${profileId}_${todayKey}`) ?? 0,
      ) >= 3;
  } catch {
    speedLearner = false;
  }

  let lessonBlitz = false;
  try {
    lessonBlitz =
      Number(
        localStorage.getItem(`mathquest_lessons_${profileId}_${todayKey}`) ?? 0,
      ) >= 5;
  } catch {
    lessonBlitz = false;
  }

  let perfectLesson = false;
  try {
    perfectLesson =
      localStorage.getItem(`mathquest_perfect_${profileId}`) === "true";
  } catch {
    perfectLesson = false;
  }

  const nightOwl = totalStars > 0 && new Date().getHours() >= 21;
  const earlyBird = totalStars > 0 && new Date().getHours() < 8;

  const arcade5Games = arcadeScores.length >= 5;
  const arcadeScore100 = !!arcadeScores.find(([, s]) => Number(s) >= 100);
  const arcadeScore500 = !!arcadeScores.find(([, s]) => Number(s) >= 500);

  const totalLessonsComplete = profile.progress.reduce(
    (sum, u) => sum + u.lessons.filter((l) => Number(l.stars) > 0).length,
    0,
  );

  const arcade10Games = arcadeScores.length >= 10;

  const hasPerfectUnit = profile.progress.some((u) => {
    const unit = UNITS.find((x) => x.idx === Number(u.unitIndex));
    if (!unit) return false;
    return (
      u.lessons.length >= unit.total &&
      u.lessons.every((l) => Number(l.stars) === 3)
    );
  });

  const mainUnits = UNITS.filter((u) => u.idx > 0);
  const allPerfect = mainUnits.every((unitMeta) => {
    const up = profile.progress.find(
      (u) => Number(u.unitIndex) === unitMeta.idx,
    );
    if (!up) return false;
    return (
      up.lessons.length >= unitMeta.total &&
      up.lessons.every((l) => Number(l.stars) === 3)
    );
  });

  const arcadeScore1000 = !!arcadeScores.find(([, s]) => Number(s) >= 1000);
  const speedDemon = !!arcadeScores.find(([, s]) => Number(s) >= 300);

  return [
    // Common
    {
      id: "first_lesson",
      emoji: "\u2B50",
      title: "First Lesson",
      desc: "Earn 1+ stars on any lesson",
      earned: totalStars > 0,
      rarity: "common",
    },
    {
      id: "first_arcade",
      emoji: "\uD83C\uDFAE",
      title: "First Arcade Score",
      desc: "Earn a score in any arcade game",
      earned: arcadeScores.length > 0,
      rarity: "common",
    },
    {
      id: "daily_challenger",
      emoji: "\uD83D\uDDD3\uFE0F",
      title: "Daily Challenger",
      desc: "Complete 5 daily challenges",
      earned: dailyCount >= 5,
      rarity: "common",
    },
    {
      id: "stars_25",
      emoji: "\uD83D\uDCAB",
      title: "Star Collector",
      desc: "Collect 25 total stars",
      earned: totalStars >= 25,
      rarity: "common",
    },
    {
      id: "lessons_10",
      emoji: "\uD83D\uDCDA",
      title: "Lesson Lover",
      desc: "Complete 10 lessons",
      earned: totalLessonsComplete >= 10,
      rarity: "common",
    },
    {
      id: "arcade_10_games",
      emoji: "\uD83D\uDD79\uFE0F",
      title: "Game Hopper",
      desc: "Play 10 different arcade games",
      earned: arcade10Games,
      rarity: "epic",
    },
    {
      id: "early_bird",
      emoji: "\uD83C\uDF05",
      title: "Early Bird",
      desc: "Complete a lesson before 8am",
      earned: earlyBird,
      rarity: "common",
    },
    // Rare
    {
      id: "first_unit",
      emoji: "\uD83C\uDFAF",
      title: "First Unit Complete",
      desc: "Complete all lessons in any unit",
      earned: anyUnitComplete,
      rarity: "rare",
    },
    {
      id: "streak_3",
      emoji: "\uD83D\uDD25",
      title: "3-Day Streak",
      desc: "Maintain a 3-day streak",
      earned: streak >= 3,
      rarity: "rare",
    },
    {
      id: "speed_learner",
      emoji: "\u26A1",
      title: "Speed Learner",
      desc: "Complete 3 lessons in one day",
      earned: speedLearner,
      rarity: "rare",
    },
    {
      id: "stars_50",
      emoji: "\u2728",
      title: "50 Stars",
      desc: "Collect 50 total stars",
      earned: totalStars >= 50,
      rarity: "rare",
    },
    {
      id: "arcade_score_100",
      emoji: "\uD83C\uDFC5",
      title: "Arcade Rising",
      desc: "Score 100+ in any arcade game",
      earned: arcadeScore100,
      rarity: "rare",
    },
    {
      id: "perfect_unit",
      emoji: "\uD83D\uDC8E",
      title: "Unit Master",
      desc: "Earn 3 stars on every lesson in a unit",
      earned: hasPerfectUnit,
      rarity: "rare",
    },
    {
      id: "night_owl",
      emoji: "\uD83E\uDD89",
      title: "Night Owl",
      desc: "Complete a lesson after 9pm",
      earned: nightOwl,
      rarity: "rare",
    },
    {
      id: "daily_3_streak",
      emoji: "\uD83D\uDCC6",
      title: "Daily Devotee",
      desc: "Complete 3 daily challenges",
      earned: dailyCount >= 3,
      rarity: "rare",
    },
    {
      id: "arcade_15_games",
      emoji: "\uD83C\uDFB0",
      title: "Arcade Adventurer",
      desc: "Play 15 different arcade games",
      earned: arcadeScores.length >= 15,
      rarity: "rare",
    },
    {
      id: "stars_75",
      emoji: "\uD83C\uDF1F",
      title: "75 Stars",
      desc: "Collect 75 total stars",
      earned: totalStars >= 75,
      rarity: "rare",
    },
    {
      id: "lesson_blitz",
      emoji: "\uD83D\uDE80",
      title: "Lesson Blitz",
      desc: "Complete 5 lessons in one day",
      earned: lessonBlitz,
      rarity: "rare",
    },
    {
      id: "streak_shield",
      emoji: "\uD83D\uDEE1\uFE0F",
      title: "Streak Shield",
      desc: "A shield that protects your streak once",
      earned: streak >= 5,
      rarity: "rare",
    },
    {
      id: "arcade_5_games",
      emoji: "\uD83D\uDC7E",
      title: "Game Explorer",
      desc: "Play 5 different arcade games",
      earned: arcade5Games,
      rarity: "rare",
    },
    // Epic
    {
      id: "streak_7",
      emoji: "\uD83C\uDFC6",
      title: "7-Day Streak",
      desc: "Maintain a 7-day streak",
      earned: streak >= 7,
      rarity: "epic",
    },
    {
      id: "units_3",
      emoji: "\uD83C\uDF93",
      title: "Triple Crown",
      desc: "Complete 3 full units",
      earned: unitsComplete >= 3,
      rarity: "epic",
    },
    {
      id: "stars_100",
      emoji: "\uD83D\uDCAF",
      title: "100 Stars",
      desc: "Collect 100 total stars",
      earned: totalStars >= 100,
      rarity: "epic",
    },
    {
      id: "arcade_score_500",
      emoji: "\uD83D\uDD2E",
      title: "Arcade Master",
      desc: "Score 500+ in any arcade game",
      earned: arcadeScore500,
      rarity: "epic",
    },
    {
      id: "daily_challenger_10",
      emoji: "\uD83D\uDCC5",
      title: "Daily Challenger Pro",
      desc: "Complete 10 daily challenges",
      earned: dailyCount >= 10,
      rarity: "epic",
    },
    {
      id: "stars_150",
      emoji: "\uD83C\uDF20",
      title: "Star Seeker",
      desc: "Earn 150 stars",
      earned: totalStars >= 150,
      rarity: "epic",
    },
    {
      id: "units_5",
      emoji: "\uD83D\uDCAA",
      title: "Five Star General",
      desc: "Complete 5 units",
      earned: unitsComplete >= 5,
      rarity: "epic",
    },
    {
      id: "arcade_score_1000",
      emoji: "\uD83E\uDD16",
      title: "Arcade Legend",
      desc: "Score 1000 in a single arcade game",
      earned: arcadeScore1000,
      rarity: "epic",
    },
    {
      id: "speed_demon",
      emoji: "\uD83D\uDCA8",
      title: "Speed Demon",
      desc: "Score 300+ in any arcade game",
      earned: speedDemon,
      rarity: "epic",
    },
    {
      id: "stars_125",
      emoji: "\uD83C\uDF08",
      title: "Stars 125",
      desc: "Earn 125 total stars",
      earned: totalStars >= 125,
      rarity: "epic",
    },
    {
      id: "units_6",
      emoji: "\uD83D\uDCD6",
      title: "Six-Unit Scholar",
      desc: "Complete 6 full units",
      earned: unitsComplete >= 6,
      rarity: "epic",
    },
    {
      id: "daily_20",
      emoji: "\uD83D\uDDC3\uFE0F",
      title: "Daily Pro",
      desc: "Complete 20 daily challenges",
      earned: dailyCount >= 20,
      rarity: "epic",
    },
    // Legendary
    {
      id: "streak_14",
      emoji: "\uD83D\uDCA5",
      title: "14-Day Streak",
      desc: "Maintain a 14-day streak",
      earned: streak >= 14,
      rarity: "legendary",
    },
    {
      id: "streak_21",
      emoji: "\uD83D\uDC51",
      title: "21-Day Streak",
      desc: "Maintain a 21-day streak",
      earned: streak >= 21,
      rarity: "legendary",
    },
    {
      id: "all_units",
      emoji: "\uD83C\uDF0D",
      title: "MathSpark Champion",
      desc: "Complete all 8 main units",
      earned: (() => {
        const requiredUnits = [1, 2, 3, 4, 5, 6, 7, 8];
        return requiredUnits.every((idx) => {
          const unitMeta = UNITS.find((u) => u.idx === idx);
          if (!unitMeta) return false;
          const unitProg = profile.progress.find(
            (u) => Number(u.unitIndex) === idx,
          );
          if (!unitProg) return false;
          return (
            unitProg.lessons.filter((l) => Number(l.stars) > 0).length >=
            unitMeta.total
          );
        });
      })(),
      rarity: "legendary",
    },
    {
      id: "stars_200",
      emoji: "\uD83E\uDE90",
      title: "Star Legend",
      desc: "Collect 200 total stars",
      earned: totalStars >= 200,
      rarity: "legendary",
    },
    {
      id: "perfect_lesson",
      emoji: "\uD83E\uDD47",
      title: "Perfect Score",
      desc: "Get 3 stars on first attempt in any lesson",
      earned: perfectLesson,
      rarity: "legendary",
    },
    {
      id: "daily_30",
      emoji: "\uD83C\uDF96\uFE0F",
      title: "Daily Champion",
      desc: "Complete 30 daily challenges",
      earned: dailyCount >= 30,
      rarity: "legendary",
    },
    {
      id: "all_perfect",
      emoji: "\uD83E\uDD8B",
      title: "Perfection",
      desc: "Earn 3 stars on every lesson in every unit",
      earned: allPerfect,
      rarity: "legendary",
    },
    {
      id: "all_arcade",
      emoji: "\uD83C\uDFAA",
      title: "Arcade All-Star",
      desc: "Play all 30 arcade games",
      earned: arcadeScores.length >= 30,
      rarity: "legendary",
    },
    {
      id: "stars_250",
      emoji: "\uD83C\uDF0C",
      title: "Stars 250",
      desc: "Collect 250 total stars",
      earned: totalStars >= 250,
      rarity: "legendary",
    },
  ];
}
