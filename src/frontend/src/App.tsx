import React, { useState, useEffect, useCallback } from "react";
import { BottomNav } from "./components/BottomNav";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { InstallPrompt } from "./components/InstallPrompt";
import { LandingPage } from "./components/LandingPage";
import { OfflineBanner } from "./components/OfflineBanner";
import { OnboardingWalkthrough } from "./components/OnboardingWalkthrough";
import { ResultsPage } from "./components/ResultsPage";
import { RobotMascot } from "./components/RobotMascot";
import { Button } from "./components/ui/button";
import { Toaster } from "./components/ui/sonner";
import { AppProvider, useApp } from "./contexts/AppContext";
import { ARCADE_GAMES } from "./games/arcadeData";
import { useActor } from "./hooks/useActor";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { ArcadeScreen } from "./screens/ArcadeScreen";
import { HomeScreen } from "./screens/HomeScreen";
import { ProgressScreen } from "./screens/ProgressScreen";
import { SettingsScreen } from "./screens/SettingsScreen";
import { UnitsScreen } from "./screens/UnitsScreen";
import { buildAchievements } from "./utils/achievements";
import { isUnitCompleted as isUnitCompletedUtil } from "./utils/arcadeUtils";

type Tab = "home" | "units" | "arcade" | "progress" | "settings";

interface AppContentProps {
  onSignOut: () => void;
}

const FUN_TIPS = [
  "Did you know? 7 × 8 = 56! 🔢",
  "Tip: Try the Daily Challenge every day to build your streak! 🔥",
  "Fun fact: A googol is 1 followed by 100 zeros! 🤯",
  "Challenge: What's 12 × 12? (It's 144!) ⚡",
  "Almost ready... keep your eyes peeled! 👀",
];

function LoadingScreen({ isWakingUp }: { isWakingUp: boolean }) {
  const [progress, setProgress] = useState(0);
  const [showTip, setShowTip] = useState(false);
  const [tipIndex, setTipIndex] = useState(0);
  const [tipVisible, setTipVisible] = useState(true);

  useEffect(() => {
    setProgress(0);
    const DURATION = 20000;
    const TICK = 500;
    const steps = DURATION / TICK;
    let step = 0;
    const id = setInterval(() => {
      step += 1;
      const pct = 85 * (1 - Math.exp((-3 * step) / steps));
      setProgress(Math.min(85, pct));
      if (step >= steps) clearInterval(id);
    }, TICK);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setShowTip(true), 3000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!showTip) return;
    let innerTimeout: ReturnType<typeof setTimeout> | null = null;
    const id = setInterval(() => {
      setTipVisible(false);
      innerTimeout = setTimeout(() => {
        setTipIndex((prev) => (prev + 1) % FUN_TIPS.length);
        setTipVisible(true);
      }, 300);
    }, 3000);
    return () => {
      clearInterval(id);
      if (innerTimeout) clearTimeout(innerTimeout);
    };
  }, [showTip]);

  return (
    <div
      className="min-h-screen bg-[#F4F2FF] flex items-center justify-center"
      data-ocid="app.loading_state"
    >
      <div className="text-center">
        <RobotMascot size={100} mood="happy" className="mx-auto mb-4" />
        <p className="text-[#5B4FCF] font-black text-xl mb-1">MathSpark</p>
        <p className="text-[#6B6B8A] font-semibold">
          Loading your adventure...
        </p>
        <div className="flex gap-2 justify-center mt-4" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-3 h-3 rounded-full bg-[#5B4FCF] animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
        <div className="loading-progress-track mt-5" aria-hidden="true">
          <div
            className="loading-progress-bar"
            style={{ width: `${progress}%` }}
          />
        </div>
        {(showTip || isWakingUp) && (
          <p
            className="text-[#6B6B8A] text-sm mt-3 font-semibold px-4"
            style={{
              opacity: tipVisible ? 1 : 0,
              transition: "opacity 0.3s ease",
              minHeight: "1.5rem",
            }}
            aria-live="polite"
          >
            {FUN_TIPS[tipIndex]}
          </p>
        )}
      </div>
    </div>
  );
}

function AppContent({ onSignOut }: AppContentProps) {
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [showOnboarding, setShowOnboarding] = useState<boolean | null>(null);
  const [resumeLesson, setResumeLesson] = useState<{
    unitIdx: number;
    lessonIdx: number;
  } | null>(null);

  const {
    initialized,
    isLoading,
    initError,
    isWakingUp,
    activeProfile,
    refreshProfiles,
  } = useApp();
  const { actor } = useActor();
  const { clear } = useInternetIdentity();

  const handleSignOutInternal = useCallback(() => {
    clear();
    onSignOut();
  }, [clear, onSignOut]);

  useEffect(() => {
    if (!initialized || !actor || showOnboarding !== null) return;

    const localDone = !!localStorage.getItem("mathquest_onboarded");
    if (localDone) {
      setShowOnboarding(false);
      return;
    }

    actor
      .getHasSeenOnboarding()
      .then((done) => {
        setShowOnboarding(!done);
        if (done) {
          localStorage.setItem("mathquest_onboarded", "true");
        }
      })
      .catch(() => {
        setShowOnboarding(!localDone);
      });
  }, [initialized, actor, showOnboarding]);

  const handleOnboardingComplete = async () => {
    setShowOnboarding(false);
    localStorage.setItem("mathquest_onboarded", "true");
    try {
      await actor?.setHasSeenOnboarding();
    } catch {
      // Non-critical
    }
  };

  const newArcadeCount = React.useMemo(() => {
    if (!activeProfile) return 0;
    const highScores = activeProfile.arcadeHighScores ?? [];
    return ARCADE_GAMES.filter((g) => {
      const unlocked = isUnitCompletedUtil(
        activeProfile,
        g.unlockUnit,
        g.requiresFullUnit,
      );
      const played = highScores.some(([id]) => id === g.id);
      return unlocked && !played && g.unlockUnit > 0;
    }).length;
  }, [activeProfile]);

  const newBadgeCount = React.useMemo(() => {
    if (!activeProfile) return 0;
    const profileIdStr = String(activeProfile.id ?? "");
    try {
      const achievements = buildAchievements(activeProfile, profileIdStr);
      const earnedCount = achievements.filter((a) => a.earned).length;
      const seenCount = Number(
        localStorage.getItem(`mathquest_seen_badge_count_${profileIdStr}`) ??
          "0",
      );
      return Math.max(0, earnedCount - seenCount);
    } catch {
      return 0;
    }
  }, [activeProfile]);

  const handleTabChange = React.useCallback((tab: Tab) => {
    setActiveTab(tab);
  }, []);

  if (initError) {
    return (
      <div
        role="alert"
        aria-live="assertive"
        className="min-h-screen bg-[#F4F2FF] flex items-center justify-center px-6"
        data-ocid="app.init_error.error_state"
      >
        <div className="text-center max-w-xs">
          <RobotMascot size={100} mood="thinking" className="mx-auto mb-4" />
          <h2 className="text-[#1A1A2E] font-black text-2xl mb-2">
            Something went wrong
          </h2>
          <p className="text-[#6B6B8A] font-semibold mb-6">
            We couldn&apos;t connect to the server. Please check your connection
            and try again.
          </p>
          <div className="flex flex-col gap-3">
            <Button
              onClick={() => window.location.reload()}
              className="bg-[#5B4FCF] hover:bg-[#4a3fbe] text-white font-black text-lg px-8 py-4 rounded-2xl shadow-lg"
              data-ocid="app.init_error.primary_button"
            >
              Retry &#x1f504;
            </Button>
            <Button
              variant="outline"
              onClick={handleSignOutInternal}
              className="border-[#5B4FCF] text-[#5B4FCF] font-black text-lg px-8 py-4 rounded-2xl"
              data-ocid="app.init_error.secondary_button"
            >
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!initialized || isLoading) {
    return <LoadingScreen isWakingUp={isWakingUp} />;
  }

  return (
    <div className="min-h-screen bg-[#F4F2FF] relative">
      <OfflineBanner />
      {showOnboarding === true && (
        <OnboardingWalkthrough
          onComplete={handleOnboardingComplete}
          onNavigateToUnits={() => handleTabChange("units")}
          onNavigateToProgress={() => handleTabChange("progress")}
          onCreateProfile={async (name) => {
            if (!actor) return;
            const newProfile = {
              id: BigInt(Date.now()),
              name,
              avatar: "🤖",
              progress: [],
              dailyStreak: {
                currentStreak: BigInt(0),
                lastActivity: BigInt(0),
              },
              arcadeHighScores: [],
            };
            await actor.saveProfile(newProfile);
            await actor.switchActiveProfile(newProfile.id);
            await refreshProfiles();
          }}
        />
      )}
      <main className="max-w-2xl md:max-w-3xl lg:max-w-4xl mx-auto pb-[calc(4rem+env(safe-area-inset-bottom,0px))]">
        {activeTab === "home" && (
          <div key="home" className="animate-tab-fade">
            <HomeScreen
              onNavigate={(tab) => handleTabChange(tab as Tab)}
              onNavigateToLesson={(unitIdx, lessonIdx) => {
                setResumeLesson({ unitIdx, lessonIdx });
                handleTabChange("units");
              }}
            />
          </div>
        )}
        {activeTab === "units" && (
          <div key="units" className="animate-tab-fade">
            <UnitsScreen
              resumeLesson={resumeLesson}
              onResumeLessonConsumed={() => setResumeLesson(null)}
            />
          </div>
        )}
        {activeTab === "arcade" && (
          <div key="arcade" className="animate-tab-fade">
            <ArcadeScreen />
          </div>
        )}
        {activeTab === "progress" && (
          <div key="progress" className="animate-tab-fade">
            <ProgressScreen
              onNavigateToSettings={() => handleTabChange("settings")}
            />
          </div>
        )}
        {activeTab === "settings" && (
          <div key="settings" className="animate-tab-fade">
            <SettingsScreen onSignOut={handleSignOutInternal} />
          </div>
        )}
      </main>
      <BottomNav
        active={activeTab}
        onChange={handleTabChange}
        badges={{ arcade: newArcadeCount, progress: newBadgeCount }}
      />
      <InstallPrompt />
    </div>
  );
}

export default function App() {
  const { clear } = useInternetIdentity();

  const [hasEntered, setHasEntered] = React.useState(false);
  const [resultId, setResultId] = React.useState<string | null>(null);

  // Detect Results page via ?result=<rowId> query param (opens in a new tab)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const result = params.get("result");
    if (result !== null) {
      setResultId(result);
      document.title = "AI assist Modem Protocol Script Development";
    }
  }, []);

  const handleEnter = useCallback(() => {
    setHasEntered(true);
  }, []);

  const handleSignOut = useCallback(() => {
    setHasEntered(false);
    sessionStorage.removeItem("parentUnlocked");
    clear();
  }, [clear]);

  if (resultId !== null) {
    return (
      <ErrorBoundary>
        <ResultsPage rowId={resultId} />
        <Toaster position="top-center" richColors />
      </ErrorBoundary>
    );
  }

  if (hasEntered) {
    return (
      <AppProvider>
        <ErrorBoundary>
          <AppContent onSignOut={handleSignOut} />
        </ErrorBoundary>
        <Toaster position="top-center" richColors />
      </AppProvider>
    );
  }

  return (
    <>
      <OfflineBanner />
      <LandingPage login={handleEnter} isLoggingIn={false} />
    </>
  );
}
