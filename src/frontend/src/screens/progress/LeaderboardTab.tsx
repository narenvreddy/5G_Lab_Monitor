import { Trophy } from "lucide-react";
import type { ChildProfile } from "../../backend";
import { RobotMascot } from "../../components/RobotMascot";
import { Card } from "../../components/ui/card";
import { getTodayKey } from "../../data/dailyChallengeQuestions";
import { getTotalStars } from "../../utils/achievements";

const MEDALS = ["🥇", "🥈", "🥉"];

function getTopScore(profile: ChildProfile): number {
  return profile.arcadeHighScores.reduce(
    (max, [, score]) => Math.max(max, Number(score)),
    0,
  );
}

function getDailyScore(profileId: string): number | null {
  try {
    const key = `mathquest_daily_score_${profileId}_${getTodayKey()}`;
    const val = localStorage.getItem(key);
    return val !== null ? Number(val) : null;
  } catch {
    return null;
  }
}

interface LeaderboardTabProps {
  profiles: ChildProfile[];
  activeProfile: ChildProfile | null;
  onNavigateToSettings?: () => void;
}

export function LeaderboardTab({
  profiles,
  activeProfile,
  onNavigateToSettings,
}: LeaderboardTabProps) {
  if (profiles.length <= 1) {
    return (
      <Card
        className="p-8 rounded-2xl border-0 shadow-md text-center"
        data-ocid="progress.leaderboard.empty_state"
      >
        <RobotMascot size={70} mood="greeting" className="mx-auto mb-4" />
        <h3 className="font-black text-xl text-[#1A1A2E] mb-2">
          Start a Family Challenge! 🏆
        </h3>
        <p className="text-[#6B6B8A] text-sm leading-relaxed mb-5">
          Add a second player to start competing! See who can earn the most
          stars, keep the longest streak, and top the leaderboard.
        </p>
        <div className="flex justify-center gap-2 text-2xl mb-5">🥇🥈🥉</div>
        {onNavigateToSettings && (
          <button
            type="button"
            onClick={onNavigateToSettings}
            className="w-full py-3 rounded-2xl font-black text-white text-base shadow-md active:scale-95 transition-transform"
            style={{ backgroundColor: "#5B4FCF" }}
            data-ocid="progress.leaderboard.add_profile.primary_button"
          >
            + Add Profile
          </button>
        )}
      </Card>
    );
  }

  const ranked = [...profiles]
    .map((p) => ({
      profile: p,
      stars: getTotalStars(p),
      streak: Number(p.dailyStreak?.currentStreak ?? 0),
      topScore: getTopScore(p),
    }))
    .sort((a, b) => b.stars - a.stars);

  return (
    <div className="space-y-3" data-ocid="progress.leaderboard.panel">
      <Card className="p-4 rounded-2xl border-0 shadow-md">
        <div className="flex items-center gap-2 mb-1">
          <Trophy size={18} className="text-[#FFD166]" />
          <h3 className="font-black text-[#1A1A2E]">Family Leaderboard</h3>
        </div>
        <p className="text-xs text-[#6B6B8A]">Ranked by total stars earned</p>
      </Card>

      {ranked.map((entry, i) => {
        const isActive = activeProfile?.id === entry.profile.id;
        const isTop = i === 0;

        return (
          <Card
            key={String(entry.profile.id)}
            className={`p-4 rounded-2xl border-0 shadow-md transition-all ${
              isActive
                ? "bg-[#F4F2FF] border-l-4 border-[#5B4FCF] pl-3"
                : isTop
                  ? "bg-amber-50"
                  : "bg-white"
            }`}
            data-ocid={i < 3 ? `progress.leaderboard.item.${i + 1}` : undefined}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 text-center flex-shrink-0">
                {i < 3 ? (
                  <span className="text-2xl">{MEDALS[i]}</span>
                ) : (
                  <span className="text-lg font-black text-[#6B6B8A]">
                    #{i + 1}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-black text-[#1A1A2E] truncate">
                    {entry.profile.name}
                  </span>
                  {isActive && (
                    <span className="text-xs bg-[#5B4FCF] text-white rounded-full px-2 py-0.5 font-bold flex-shrink-0">
                      You
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 mt-1.5">
                  <span
                    className="flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full"
                    style={{ background: "#FFF8E1", color: "#B8860B" }}
                  >
                    ⭐ {entry.stars} stars
                  </span>
                  <span
                    className="flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full"
                    style={{ background: "#FFF0E8", color: "#C44B0A" }}
                  >
                    🔥 {entry.streak} day{entry.streak !== 1 ? "s" : ""}
                  </span>
                  {entry.topScore > 0 && (
                    <span
                      className="flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full"
                      style={{ background: "#E0FAF5", color: "#007A66" }}
                    >
                      🎮 {entry.topScore.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex-shrink-0 text-right">
                {(() => {
                  const ds = getDailyScore(String(entry.profile.id));
                  return ds !== null ? (
                    <div className="mb-1">
                      <span className="text-xs font-black text-[#5B4FCF] bg-[#5B4FCF]/10 rounded-full px-2 py-0.5">
                        Today: {ds}/7
                      </span>
                    </div>
                  ) : null;
                })()}
                <div className="text-2xl font-black text-[#FFD166]">
                  {entry.stars}
                </div>
                <div className="text-[10px] text-[#6B6B8A] font-bold uppercase tracking-wide">
                  stars
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
