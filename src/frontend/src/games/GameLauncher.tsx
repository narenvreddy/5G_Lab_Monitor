import React, { Suspense, useCallback, useEffect, useState } from "react";
import { ErrorBoundary } from "../components/ErrorBoundary";
import { useApp } from "../contexts/AppContext";
import { ConfettiBurst } from "./gameUtils";
import type { GameProps } from "./types";

// Lazy-load each game component so they are only bundled when actually played.
const LAZY_GAME_REGISTRY: Record<
  string,
  React.LazyExoticComponent<React.ComponentType<GameProps>>
> = {
  "number-blaster": React.lazy(() =>
    import("./NumberBlaster").then((m) => ({ default: m.NumberBlaster })),
  ),
  "hop-to-it": React.lazy(() =>
    import("./HopToIt").then((m) => ({ default: m.HopToIt })),
  ),
  "cookie-counter": React.lazy(() =>
    import("./CookieCounter").then((m) => ({ default: m.CookieCounter })),
  ),
  "rocket-math": React.lazy(() =>
    import("./RocketMath").then((m) => ({ default: m.RocketMath })),
  ),
  "fact-family-tree": React.lazy(() =>
    import("./FactFamilyTree").then((m) => ({ default: m.FactFamilyTree })),
  ),
  "array-attack": React.lazy(() =>
    import("./ArrayAttack").then((m) => ({ default: m.ArrayAttack })),
  ),
  "times-table-turbo": React.lazy(() =>
    import("./TimesTableTurbo").then((m) => ({ default: m.TimesTableTurbo })),
  ),
  "binary-cracker": React.lazy(() =>
    import("./BinaryCracker").then((m) => ({ default: m.BinaryCracker })),
  ),
  "block-builder": React.lazy(() =>
    import("./BlockBuilder").then((m) => ({ default: m.BlockBuilder })),
  ),
  "fraction-pizza": React.lazy(() =>
    import("./FractionPizza").then((m) => ({ default: m.FractionPizza })),
  ),
  "fraction-match": React.lazy(() =>
    import("./FractionMatch").then((m) => ({ default: m.FractionMatch })),
  ),
  "scale-master": React.lazy(() =>
    import("./ScaleMaster").then((m) => ({ default: m.ScaleMaster })),
  ),
  "pattern-panic": React.lazy(() =>
    import("./PatternPanic").then((m) => ({ default: m.PatternPanic })),
  ),
  "history-hunter": React.lazy(() =>
    import("./HistoryHunter").then((m) => ({ default: m.HistoryHunter })),
  ),
  "chaos-garden": React.lazy(() =>
    import("./ChaosGarden").then((m) => ({ default: m.ChaosGarden })),
  ),
  "number-bonds-blaster": React.lazy(() =>
    import("./NumberBondsBlaster").then((m) => ({
      default: m.NumberBondsBlaster,
    })),
  ),
  "fraction-frenzy": React.lazy(() =>
    import("./FractionFrenzy").then((m) => ({ default: m.FractionFrenzy })),
  ),
  "pattern-patrol": React.lazy(() =>
    import("./PatternPatrol").then((m) => ({ default: m.PatternPatrol })),
  ),
  "algebra-escape": React.lazy(() =>
    import("./AlgebraEscape").then((m) => ({ default: m.AlgebraEscape })),
  ),
  "math-boss": React.lazy(() =>
    import("./MathBoss").then((m) => ({ default: m.MathBoss })),
  ),
  "addition-avalanche": React.lazy(() =>
    import("./AdditionAvalanche").then((m) => ({
      default: m.AdditionAvalanche,
    })),
  ),
  "subtraction-storm": React.lazy(() =>
    import("./SubtractionStorm").then((m) => ({
      default: m.SubtractionStorm,
    })),
  ),
  "shape-shifter": React.lazy(() =>
    import("./ShapeShifter").then((m) => ({ default: m.ShapeShifter })),
  ),
  "timeline-traveler": React.lazy(() =>
    import("./TimelineTraveler").then((m) => ({
      default: m.TimelineTraveler,
    })),
  ),
  "algorithm-ant": React.lazy(() =>
    import("./AlgorithmAnt").then((m) => ({ default: m.AlgorithmAnt })),
  ),
  "number-nemesis": React.lazy(() =>
    import("./NumberNemesis").then((m) => ({ default: m.NumberNemesis })),
  ),
  "sum-slayer": React.lazy(() =>
    import("./SumSlayer").then((m) => ({ default: m.SumSlayer })),
  ),
  "times-titan": React.lazy(() =>
    import("./TimesTitan").then((m) => ({ default: m.TimesTitan })),
  ),
  "place-protector": React.lazy(() =>
    import("./PlaceProtector").then((m) => ({ default: m.PlaceProtector })),
  ),
  "fraction-fiend": React.lazy(() =>
    import("./FractionFiend").then((m) => ({ default: m.FractionFiend })),
  ),
};

const DIFFICULTY_INTRO_CSS = `
@keyframes diffIntroIn {
  0% { opacity: 0; transform: scale(0.7); }
  60% { opacity: 1; transform: scale(1.08); }
  100% { opacity: 1; transform: scale(1); }
}
@keyframes countUpFade {
  from { opacity: 0.4; }
  to { opacity: 1; }
}
`;

// CQ-04: Inject CSS once at module load instead of creating a new <style> tag on every mount
if (typeof document !== "undefined") {
  const styleId = "game-launcher-css";
  if (!document.getElementById(styleId)) {
    const styleEl = document.createElement("style");
    styleEl.id = styleId;
    styleEl.textContent = DIFFICULTY_INTRO_CSS;
    document.head.appendChild(styleEl);
  }
}

function GameLoadingFallback() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-3">
      <div
        className="w-12 h-12 rounded-full border-4 border-[#5B4FCF]/30 border-t-[#5B4FCF] animate-spin"
        aria-hidden="true"
      />
      <p className="text-[#5B4FCF] font-bold text-sm">Loading game…</p>
    </div>
  );
}

interface GameLauncherProps {
  gameId: string;
  gameName: string;
  emoji: string;
  onClose: () => void;
}

export function GameLauncher({
  gameId,
  gameName,
  emoji,
  onClose,
}: GameLauncherProps) {
  const { activeProfile, saveHighScore } = useApp();
  const [gameKey, setGameKey] = useState(0);
  const [status, setStatus] = useState<"intro" | "playing" | "finished">(
    "intro",
  );
  const [finalScore, setFinalScore] = useState(0);
  const [displayScore, setDisplayScore] = useState(0);
  const [saving, setSaving] = useState(false);

  const totalStars =
    activeProfile?.progress.reduce(
      (sum, unit) =>
        sum + unit.lessons.reduce((s, l) => s + Number(l.stars), 0),
      0,
    ) ?? 0;
  const difficulty = totalStars >= 150 ? 2 : totalStars >= 50 ? 1 : 0;
  const diffLabel =
    difficulty === 0
      ? "Easy Mode 🌱"
      : difficulty === 1
        ? "Medium Mode 🔥"
        : "Hard Mode ⚡";

  const highScoreEntry = activeProfile?.arcadeHighScores.find(
    ([id]) => id === gameId,
  );
  const highScore = highScoreEntry ? Number(highScoreEntry[1]) : null;

  // Show difficulty intro for 1.5s on mount
  useEffect(() => {
    const t = setTimeout(() => setStatus("playing"), 1500);
    return () => clearTimeout(t);
  }, []);

  // Count-up effect for score on game over
  useEffect(() => {
    if (status !== "finished" || finalScore === 0) {
      setDisplayScore(finalScore);
      return;
    }
    setDisplayScore(0);
    const step = Math.max(1, Math.ceil(finalScore / 30));
    let current = 0;
    const interval = setInterval(() => {
      current = Math.min(current + step, finalScore);
      setDisplayScore(current);
      if (current >= finalScore) clearInterval(interval);
    }, 50);
    return () => clearInterval(interval);
  }, [status, finalScore]);

  const handleGameOver = useCallback(
    async (score: number) => {
      setFinalScore(score);
      setStatus("finished");
      setSaving(true);
      try {
        await saveHighScore(gameId, score);
      } finally {
        setSaving(false);
      }
    },
    [gameId, saveHighScore],
  );

  const handlePlayAgain = () => {
    setGameKey((k) => k + 1);
    setStatus("intro");
    setFinalScore(0);
    setDisplayScore(0);
  };

  const GameComponent = LAZY_GAME_REGISTRY[gameId];
  const isNewHighScore =
    finalScore > 0 && (highScore === null || finalScore > highScore);

  return (
    <div
      className="fixed inset-0 z-50 bg-[#F4F2FF] flex flex-col"
      data-ocid="game.modal"
    >
      {/* Header */}
      <div className="bg-white shadow-sm px-4 pt-4 pb-3 flex items-center gap-3 flex-shrink-0">
        <span className="text-3xl">{emoji}</span>
        <div className="flex-1 min-w-0">
          <h2 className="font-black text-lg text-[#1A1A2E] truncate">
            {gameName}
          </h2>
          <span className="text-xs font-bold text-[#6B6B8A]">{diffLabel}</span>
        </div>
        {highScore !== null && (
          <span className="text-sm font-black text-[#FFD166] flex items-center gap-1 bg-[#1A1A2E] px-2 py-1 rounded-xl">
            🏆 {highScore.toLocaleString()}
          </span>
        )}
        <button
          type="button"
          data-ocid="game.close_button"
          onClick={onClose}
          className="w-10 h-10 rounded-xl bg-[#F4F2FF] flex items-center justify-center text-[#1A1A2E] font-black text-xl flex-shrink-0 active:bg-purple-100"
          aria-label="Close game"
        >
          ✕
        </button>
      </div>

      {/* Game content */}
      <div className="flex-1 overflow-y-auto relative">
        {/* Difficulty intro overlay */}
        {status === "intro" && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-[#5B4FCF] to-[#7B6FEF]">
            <div
              style={{
                animation:
                  "diffIntroIn 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards",
                textAlign: "center",
              }}
            >
              <div className="text-8xl mb-4">{emoji}</div>
              <div
                style={{
                  fontFamily: "Nunito, sans-serif",
                  fontWeight: 900,
                  fontSize: 36,
                  color: "#FFD166",
                  textShadow: "0 4px 16px rgba(0,0,0,0.3)",
                }}
              >
                {diffLabel}
              </div>
              <div
                style={{
                  fontFamily: "Nunito, sans-serif",
                  fontWeight: 700,
                  fontSize: 18,
                  color: "rgba(255,255,255,0.8)",
                  marginTop: 12,
                }}
              >
                Get ready!
              </div>
            </div>
          </div>
        )}

        {status === "playing" && GameComponent ? (
          <ErrorBoundary>
            <Suspense fallback={<GameLoadingFallback />}>
              <GameComponent
                key={gameKey}
                difficulty={difficulty}
                onGameOver={handleGameOver}
              />
            </Suspense>
          </ErrorBoundary>
        ) : status === "playing" && !GameComponent ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-[#6B6B8A] font-semibold">Game not found.</p>
          </div>
        ) : status === "finished" ? (
          <div className="flex flex-col items-center justify-center min-h-full px-6 py-10 text-center gap-5 relative">
            {isNewHighScore && <ConfettiBurst active={true} />}
            <div className="text-8xl">{emoji}</div>
            <h2 className="text-4xl font-black text-[#1A1A2E]">Game Over!</h2>
            {isNewHighScore && (
              <div
                style={{
                  fontFamily: "Nunito, sans-serif",
                  fontWeight: 900,
                  fontSize: 28,
                  color: "#5B4FCF",
                  animation: "diffIntroIn 0.5s ease forwards",
                }}
              >
                🎊 New Record!
              </div>
            )}
            <div className="bg-white rounded-3xl p-6 shadow-md w-full max-w-xs">
              <p className="text-[#6B6B8A] font-bold mb-1">Your Score</p>
              <p
                className="font-black text-6xl text-[#5B4FCF]"
                style={{ animation: "countUpFade 0.1s ease" }}
              >
                {displayScore.toLocaleString()}
              </p>
              {isNewHighScore && (
                <div className="mt-3 bg-[#FFD166] rounded-2xl py-2 px-4 text-[#1A1A2E] font-black text-sm">
                  🏆 New High Score!
                </div>
              )}
              {highScore !== null && !isNewHighScore && (
                <p className="mt-2 text-sm font-bold text-[#6B6B8A]">
                  Best: {highScore.toLocaleString()}
                </p>
              )}
              {saving && (
                <p className="mt-2 text-xs text-[#6B6B8A]">Saving...</p>
              )}
            </div>
            <div className="flex flex-col gap-3 w-full max-w-xs">
              <button
                type="button"
                data-ocid="game.play_again_button"
                onClick={handlePlayAgain}
                className="py-5 rounded-2xl font-black text-xl text-white shadow-lg active:scale-95 transition-transform"
                style={{ backgroundColor: "#5B4FCF" }}
              >
                🎮 Play Again
              </button>
              <button
                type="button"
                data-ocid="game.secondary_button"
                onClick={onClose}
                className="py-4 rounded-2xl font-black text-xl text-[#1A1A2E] bg-white shadow-md active:scale-95 transition-transform"
              >
                🏠 Exit
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
