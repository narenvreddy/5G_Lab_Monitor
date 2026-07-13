import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
} from "react";
import type { AppSettings, ChildProfile, UnitProgress } from "../backend";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export type ColorBlindType =
  | "off"
  | "deuteranopia"
  | "protanopia"
  | "tritanopia";

const CB_TYPE_KEY = "mq_cb_type";
const CACHE_KEY_PREFIX = "mathspark_cache_";

interface CachedAppData {
  profiles: ChildProfile[];
  activeProfileId: number | null;
  settings: AppSettings;
  timestamp: number;
}

function getLocalDeviceId(): string {
  try {
    let id = localStorage.getItem("mathspark_local_id");
    if (!id) {
      id =
        Math.random().toString(36).slice(2) +
        Math.random().toString(36).slice(2);
      localStorage.setItem("mathspark_local_id", id);
    }
    return `local_${id}`;
  } catch {
    return "local_fallback";
  }
}

function getEffectivePrincipalId(
  identity:
    | { getPrincipal(): { isAnonymous(): boolean; toString(): string } }
    | undefined,
): string {
  try {
    if (identity && !identity.getPrincipal().isAnonymous()) {
      return identity.getPrincipal().toString();
    }
  } catch {}
  return getLocalDeviceId();
}

function getCachedData(principalId: string): CachedAppData | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY_PREFIX + principalId);
    if (!raw) return null;
    const data = JSON.parse(raw) as CachedAppData;
    if (Date.now() - data.timestamp > 7 * 24 * 60 * 60 * 1000) return null;
    return data;
  } catch {
    return null;
  }
}

function setCachedData(principalId: string, data: CachedAppData) {
  try {
    localStorage.setItem(
      CACHE_KEY_PREFIX + principalId,
      JSON.stringify(data, (_, value) =>
        typeof value === "bigint" ? Number(value) : value,
      ),
    );
  } catch {}
}

function loadColorBlindType(): ColorBlindType {
  try {
    const val = localStorage.getItem(CB_TYPE_KEY);
    if (val === "deuteranopia" || val === "protanopia" || val === "tritanopia")
      return val;
  } catch {}
  return "off";
}

const DEFAULT_SETTINGS: AppSettings = {
  textToSpeechEnabled: false,
  voiceSpeed: BigInt(10),
  dyslexicFont: false,
  highContrastMode: false,
  reduceMotion: false,
  largeTapTargets: false,
  colorBlindnessMode: false,
  autoAdvance: false,
  soundEnabled: true,
};

interface AppContextType {
  activeProfile: ChildProfile | null;
  profiles: ChildProfile[];
  settings: AppSettings;
  isLoading: boolean;
  refreshProfiles: () => Promise<void>;
  setActiveProfile: (profile: ChildProfile | null) => void;
  updateSettings: (s: AppSettings) => Promise<void>;
  initialized: boolean;
  initError: boolean;
  isWakingUp: boolean;
  saveProgress: (
    unitIdx: number,
    lessonIdx: number,
    stars: number,
  ) => Promise<void>;
  saveHighScore: (gameId: string, score: number) => Promise<void>;
  colorBlindType: ColorBlindType;
  setColorBlindType: (t: ColorBlindType) => void;
}

const AppContext = createContext<AppContextType>({
  activeProfile: null,
  profiles: [],
  settings: DEFAULT_SETTINGS,
  isLoading: false,
  refreshProfiles: async () => {},
  setActiveProfile: () => {},
  updateSettings: async () => {},
  initialized: true,
  initError: false,
  isWakingUp: false,
  saveProgress: async () => {},
  saveHighScore: async () => {},
  colorBlindType: "off",
  setColorBlindType: () => {},
});

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function AppProvider({ children }: { children: ReactNode }) {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const [activeProfile, setActiveProfile] = useState<ChildProfile | null>(null);
  const [profiles, setProfiles] = useState<ChildProfile[]>([]);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [isLoading] = useState(false);
  const [initialized, setInitialized] = useState(true);
  const [initError, setInitError] = useState(false);
  const [isWakingUp, setIsWakingUp] = useState(false);
  const saveInProgress = useRef(false);
  const pendingSave = useRef<{
    unitIdx: number;
    lessonIdx: number;
    stars: number;
  } | null>(null);
  const saveProgressRef = useRef<
    (u: number, l: number, s: number) => Promise<void>
  >(async () => {});
  const [colorBlindType, setColorBlindTypeState] =
    useState<ColorBlindType>(loadColorBlindType);

  const setColorBlindType = useCallback((t: ColorBlindType) => {
    setColorBlindTypeState(t);
    try {
      localStorage.setItem(CB_TYPE_KEY, t);
    } catch {}
  }, []);

  // autoAdvance migration guard
  useEffect(() => {
    try {
      const OLD_KEY = "mq_autoAdvance";
      const NEW_KEY = "mq_autoAdvance_v2";
      if (
        localStorage.getItem(OLD_KEY) !== null &&
        localStorage.getItem(NEW_KEY) === null
      ) {
        localStorage.setItem(NEW_KEY, localStorage.getItem(OLD_KEY) ?? "false");
        localStorage.removeItem(OLD_KEY);
      }
    } catch {}
  }, []);

  const restoreFromCache = useCallback((principalId: string): boolean => {
    const cached = principalId ? getCachedData(principalId) : null;
    if (!cached) return false;
    const restoredProfiles = cached.profiles.map((p) => ({
      ...p,
      id: BigInt(p.id as unknown as number),
      dailyStreak: {
        currentStreak: BigInt(p.dailyStreak.currentStreak as unknown as number),
        lastActivity: BigInt(p.dailyStreak.lastActivity as unknown as number),
      },
      progress: p.progress.map((u) => ({
        ...u,
        unitIndex: BigInt(u.unitIndex as unknown as number),
        lessons: u.lessons.map((l) => ({
          ...l,
          lessonIndex: BigInt(l.lessonIndex as unknown as number),
          stars: BigInt(l.stars as unknown as number),
          attempts: BigInt(l.attempts as unknown as number),
          hintsUsed: BigInt(l.hintsUsed as unknown as number),
        })),
      })),
      arcadeHighScores: p.arcadeHighScores.map(
        ([id, score]) =>
          [id, BigInt(score as unknown as number)] as [string, bigint],
      ),
    }));
    const restoredSettings = {
      ...cached.settings,
      voiceSpeed: BigInt(cached.settings.voiceSpeed as unknown as number),
    };
    const restoredActive =
      cached.activeProfileId != null
        ? (restoredProfiles.find(
            (p) => Number(p.id) === cached.activeProfileId,
          ) ??
          restoredProfiles[0] ??
          null)
        : (restoredProfiles[0] ?? null);
    setProfiles(restoredProfiles);
    setActiveProfile(restoredActive);
    setSettings(restoredSettings);
    setInitialized(true);
    return true;
  }, []);

  // Load from cache immediately when the component mounts (actor may not be ready yet)
  useEffect(() => {
    const principalId = getEffectivePrincipalId(identity);
    restoreFromCache(principalId);
  }, [identity, restoreFromCache]);

  const refreshProfiles = useCallback(async () => {
    if (!actor) return;
    try {
      const [profs, active] = await Promise.all([
        actor.getProfiles(),
        actor.getActiveProfile(),
      ]);
      setProfiles(profs);
      setActiveProfile((prev) => {
        if (active) return active;
        if (prev) return prev;
        if (profs.length > 0) return profs[0];
        return null;
      });
    } catch (e) {
      console.error("Failed to load profiles", e);
    }
  }, [actor]);

  useEffect(() => {
    if (!actor) return;
    const actorRef = actor;

    let cancelled = false;
    const RETRY_DELAYS = [1000, 2000, 3000, 5000, 8000];
    const MAX_ATTEMPTS = 6;

    async function initWithRetry() {
      const principalId = getEffectivePrincipalId(identity);
      setInitError(false);

      for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
        try {
          await actorRef.initializeUserData();
          const [profs, active, setts] = await Promise.all([
            actorRef.getProfiles(),
            actorRef.getActiveProfile(),
            actorRef.getSettings(),
          ]);

          if (cancelled) return;

          setProfiles(profs);
          const resolvedActive = active ?? (profs.length > 0 ? profs[0] : null);
          setActiveProfile(resolvedActive);
          setSettings(setts);
          setIsWakingUp(false);
          setInitialized(true);

          const activeId =
            resolvedActive != null
              ? Number(resolvedActive.id)
              : profs.length > 0
                ? Number(profs[0].id)
                : null;
          setCachedData(principalId, {
            profiles: profs as unknown as ChildProfile[],
            activeProfileId: activeId,
            settings: setts as unknown as AppSettings,
            timestamp: Date.now(),
          });

          return;
        } catch (e) {
          console.error(`Init attempt ${attempt + 1} failed:`, e);
          if (attempt < MAX_ATTEMPTS - 1) {
            await sleep(
              RETRY_DELAYS[Math.min(attempt, RETRY_DELAYS.length - 1)],
            );
            if (cancelled) return;
          }
        }
      }

      if (!cancelled) {
        setIsWakingUp(false);
        setInitError(true);
      }
    }

    initWithRetry();
    return () => {
      cancelled = true;
    };
  }, [actor, identity]);

  // Apply body classes for accessibility settings + color blind type
  useEffect(() => {
    const body = document.body;
    body.classList.toggle("font-dyslexic", settings.dyslexicFont);
    body.classList.toggle("high-contrast", settings.highContrastMode);
    body.classList.toggle("reduce-motion", settings.reduceMotion);
    body.classList.toggle("large-targets", settings.largeTapTargets);
    body.classList.toggle("color-blind", settings.colorBlindnessMode);
  }, [settings]);

  useEffect(() => {
    const body = document.body;
    body.classList.remove("cb-deuteranopia", "cb-protanopia", "cb-tritanopia");
    if (colorBlindType !== "off") {
      body.classList.add(`cb-${colorBlindType}`);
    }
  }, [colorBlindType]);

  const handleUpdateSettings = useCallback(
    async (s: AppSettings) => {
      setSettings(s);
      if (actor) {
        await actor.updateSettings(s);
      }
    },
    [actor],
  );

  const saveProgress = useCallback(
    async (unitIdx: number, lessonIdx: number, stars: number) => {
      if (!actor) return;
      if (saveInProgress.current) {
        pendingSave.current = { unitIdx, lessonIdx, stars };
        return;
      }
      saveInProgress.current = true;
      const profile =
        activeProfile ?? (profiles.length > 0 ? profiles[0] : null);
      if (!profile) {
        saveInProgress.current = false;
        return;
      }

      const existing = profile.progress ?? [];
      const unitEntry = existing.find((u) => Number(u.unitIndex) === unitIdx);
      let updatedProgress: UnitProgress[];

      if (unitEntry) {
        const existingLesson = unitEntry.lessons.find(
          (l) => Number(l.lessonIndex) === lessonIdx,
        );
        const updatedLessons = existingLesson
          ? unitEntry.lessons.map((l) =>
              Number(l.lessonIndex) === lessonIdx
                ? {
                    ...l,
                    stars: BigInt(Math.max(Number(l.stars), stars)),
                    attempts: l.attempts + BigInt(1),
                  }
                : l,
            )
          : [
              ...unitEntry.lessons,
              {
                lessonIndex: BigInt(lessonIdx),
                stars: BigInt(stars),
                attempts: BigInt(1),
                hintsUsed: BigInt(0),
              },
            ];
        updatedProgress = existing.map((u) =>
          Number(u.unitIndex) === unitIdx
            ? { ...u, lessons: updatedLessons }
            : u,
        );
      } else {
        updatedProgress = [
          ...existing,
          {
            unitIndex: BigInt(unitIdx),
            lessons: [
              {
                lessonIndex: BigInt(lessonIdx),
                stars: BigInt(stars),
                attempts: BigInt(1),
                hintsUsed: BigInt(0),
              },
            ],
          },
        ];
      }

      const optimisticProfile: ChildProfile = {
        ...profile,
        progress: updatedProgress,
      };
      setActiveProfile(optimisticProfile);

      try {
        await actor.updateProfileProgress(profile.id, updatedProgress);
      } catch (e) {
        console.error("Failed to save progress", e);
        setActiveProfile(profile);
      } finally {
        saveInProgress.current = false;
        const pending = pendingSave.current;
        if (pending) {
          pendingSave.current = null;
          saveProgressRef.current(
            pending.unitIdx,
            pending.lessonIdx,
            pending.stars,
          );
        }
      }
    },
    [actor, activeProfile, profiles],
  );

  useEffect(() => {
    saveProgressRef.current = saveProgress;
  }, [saveProgress]);

  const saveHighScore = useCallback(
    async (gameId: string, score: number) => {
      if (!actor || !activeProfile) return;
      const current = activeProfile.arcadeHighScores.find(
        ([id]) => id === gameId,
      );
      if (current && Number(current[1]) >= score) return;
      try {
        await actor.updateArcadeHighScore(
          activeProfile.id,
          gameId,
          BigInt(score),
        );
      } catch (e) {
        console.error("Failed to save high score", e);
      }
    },
    [actor, activeProfile],
  );

  return (
    <AppContext.Provider
      value={{
        activeProfile,
        profiles,
        settings,
        isLoading,
        refreshProfiles,
        setActiveProfile,
        updateSettings: handleUpdateSettings,
        initialized,
        initError,
        isWakingUp,
        saveProgress,
        saveHighScore,
        colorBlindType,
        setColorBlindType,
      }}
    >
      {/* SVG filter definitions for color blind mode */}
      <svg
        className="color-blind-svg-defs"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <filter
            id="deuteranopia-filter"
            x="0"
            y="0"
            width="100%"
            height="100%"
            colorInterpolationFilters="linearRGB"
          >
            <feColorMatrix
              type="matrix"
              values="0.367 0.861 -0.228 0 0
                      0.280 0.673  0.047 0 0
                     -0.012 0.043  0.969 0 0
                      0     0      0     1 0"
            />
          </filter>
          <filter
            id="protanopia-filter"
            x="0"
            y="0"
            width="100%"
            height="100%"
            colorInterpolationFilters="linearRGB"
          >
            <feColorMatrix
              type="matrix"
              values="0.152 1.053 -0.205 0 0  0.115 0.786  0.099 0 0  0 0.143  0.857 0 0  0 0 0 1 0"
            />
          </filter>
          <filter
            id="tritanopia-filter"
            x="0"
            y="0"
            width="100%"
            height="100%"
            colorInterpolationFilters="linearRGB"
          >
            <feColorMatrix
              type="matrix"
              values="0.972 0.112 -0.084 0 0  0.022 0.818  0.160 0 0  0 0.096  0.904 0 0  0 0 0 1 0"
            />
          </filter>
        </defs>
      </svg>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
