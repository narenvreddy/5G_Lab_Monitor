import React, { useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { useApp } from "../contexts/AppContext";
import { buildAchievements } from "../utils/achievements";
import { AchievementsTab } from "./progress/AchievementsTab";
import { LeaderboardTab } from "./progress/LeaderboardTab";
import { ParentDashboard } from "./progress/ParentDashboard";
import { StarsTab } from "./progress/StarsTab";
import { TeacherDashboard } from "./progress/TeacherDashboard";

export function ProgressScreen({
  onNavigateToSettings,
}: { onNavigateToSettings?: () => void } = {}) {
  const { activeProfile, profiles, isLoading } = useApp();
  const [activeTab, setActiveTab] = useState("stars");

  const profileIdStr = activeProfile ? String(activeProfile.id) : "";
  const isTeacher =
    typeof window !== "undefined" &&
    localStorage.getItem("mathspark_role") === "teacher";

  // Mark badges as seen only when user opens the Badges tab
  React.useEffect(() => {
    if (!activeProfile || activeTab !== "achievements") return;
    try {
      const achievements = buildAchievements(activeProfile, profileIdStr);
      const earnedCount = achievements.filter((a) => a.earned).length;
      localStorage.setItem(
        `mathquest_seen_badge_count_${profileIdStr}`,
        String(earnedCount),
      );
    } catch {}
  }, [activeProfile, activeTab, profileIdStr]);

  return (
    <div className="flex flex-col min-h-screen bg-[#F4F2FF]">
      <div className="bg-gradient-to-br from-[#5B4FCF] to-[#7B6FDF] px-6 pt-10 md:pt-12 pb-6 rounded-b-[40px] shadow-lg">
        <h1 className="text-white font-black text-2xl md:text-3xl">
          ⭐ {activeProfile ? `${activeProfile.name}'s Progress` : "Progress"}
        </h1>
        <p className="text-purple-200 mt-1">Track your MathSpark journey!</p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex-1 px-4 md:px-6 pt-4"
      >
        <TabsList
          className="w-full rounded-2xl mb-4"
          data-ocid="progress.tabs.panel"
        >
          <TabsTrigger
            value="stars"
            className="flex-1 rounded-xl text-xs sm:text-sm"
            data-ocid="progress.stars.tab"
          >
            ⭐ Stars
          </TabsTrigger>
          <TabsTrigger
            value="achievements"
            className="flex-1 rounded-xl text-xs sm:text-sm"
            data-ocid="progress.achievements.tab"
          >
            🏅 Badges
          </TabsTrigger>
          <TabsTrigger
            value="leaderboard"
            className="flex-1 rounded-xl text-xs sm:text-sm"
            data-ocid="progress.leaderboard.tab"
          >
            🏆 Board
          </TabsTrigger>
          <TabsTrigger
            value="parent"
            className="flex-1 rounded-xl text-xs sm:text-sm"
            data-ocid="progress.parent.tab"
          >
            🔒 Parent
          </TabsTrigger>
          {isTeacher && (
            <TabsTrigger
              value="teacher"
              className="flex-1 rounded-xl text-xs sm:text-sm"
              data-ocid="progress.teacher.tab"
            >
              👩‍🏫 Class
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="stars" className="space-y-4">
          <StarsTab profile={activeProfile} isLoading={isLoading} />
        </TabsContent>

        <TabsContent value="achievements" className="space-y-4">
          <AchievementsTab
            profile={activeProfile}
            profileId={profileIdStr}
            isActive={activeTab === "achievements"}
          />
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-4">
          <LeaderboardTab
            profiles={profiles ?? []}
            activeProfile={activeProfile}
            onNavigateToSettings={onNavigateToSettings}
          />
        </TabsContent>

        <TabsContent value="parent">
          <ParentDashboard
            profileId={profileIdStr}
            activeProfile={activeProfile}
          />
        </TabsContent>

        {isTeacher && (
          <TabsContent value="teacher">
            <TeacherDashboard onNavigateToSettings={onNavigateToSettings} />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
