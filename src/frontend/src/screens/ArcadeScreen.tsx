import { Lock, Play } from "lucide-react";
import React, { useState } from "react";
import { Card } from "../components/ui/card";
import { UNITS, UNIT_NAMES } from "../constants/units";
import { useApp } from "../contexts/AppContext";
import { GameLauncher } from "../games/GameLauncher";
import { ARCADE_GAMES, type ArcadeGame } from "../games/arcadeData";
import { isUnitCompleted } from "../utils/arcadeUtils";

function StarRating({ score }: { score: number | null }) {
  const stars =
    score === null ? 0 : score >= 150 ? 3 : score >= 50 ? 2 : score > 0 ? 1 : 0;
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3].map((s) => (
        <span
          key={s}
          className={`text-sm ${s <= stars ? "text-[#FFD166]" : "text-[#D1D5DB]"}`}
        >
          {s <= stars ? "⭐" : "☆"}
        </span>
      ))}
      {score !== null && score > 0 && (
        <span className="text-[10px] text-[#6B6B8A] font-bold ml-1">
          {score}
        </span>
      )}
    </div>
  );
}

export function ArcadeScreen() {
  const { activeProfile } = useApp();
  const [selectedGame, setSelectedGame] = useState<ArcadeGame | null>(null);

  const getHighScore = (gameId: string): number | null => {
    const entry = activeProfile?.arcadeHighScores.find(([id]) => id === gameId);
    return entry ? Number(entry[1]) : null;
  };

  const unlockedCount = ARCADE_GAMES.filter((g) =>
    isUnitCompleted(activeProfile ?? null, g.unlockUnit, g.requiresFullUnit),
  ).length;

  if (selectedGame) {
    return (
      <GameLauncher
        gameId={selectedGame.id}
        gameName={selectedGame.name}
        emoji={selectedGame.emoji}
        onClose={() => setSelectedGame(null)}
      />
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#F4F2FF] pb-20">
      <div className="bg-gradient-to-br from-[#5B4FCF] to-[#7B6FDF] px-6 pt-10 md:pt-12 pb-6 rounded-b-[40px] shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-white font-black text-2xl md:text-3xl lg:text-4xl">
              🎮 Arcade
            </h1>
            <p className="text-purple-200 mt-1 text-sm md:text-base">
              Complete lessons to unlock games!
            </p>
          </div>
          <div className="bg-white/20 rounded-2xl px-4 py-2 text-center">
            <p className="text-[#FFD166] font-black text-xl">{unlockedCount}</p>
            <p className="text-purple-200 text-xs font-bold">
              of {ARCADE_GAMES.length}
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-6 pt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        {ARCADE_GAMES.map((game, i) => {
          const unlocked = isUnitCompleted(
            activeProfile ?? null,
            game.unlockUnit,
            game.requiresFullUnit,
          );
          const highScore = getHighScore(game.id);
          const unlockUnitName =
            game.unlockUnit > 0
              ? (UNIT_NAMES[game.unlockUnit - 1] ?? `Unit ${game.unlockUnit}`)
              : "Starter";
          return (
            <Card
              key={game.id}
              className={`p-4 rounded-2xl border-0 shadow-md flex flex-col items-center text-center gap-2 relative overflow-hidden transition-all ${
                unlocked
                  ? "cursor-pointer active:scale-[0.97] hover:shadow-lg hover:-translate-y-0.5"
                  : "opacity-60"
              }`}
              data-ocid={`arcade.game.item.${i + 1}`}
              onClick={() => unlocked && setSelectedGame(game)}
            >
              {game.requiresFullUnit && (
                <div className="absolute top-2 left-2 bg-[#5B4FCF] text-white text-[10px] font-black px-2 py-0.5 rounded-full z-10">
                  👑 BOSS
                </div>
              )}
              <div className="text-4xl mt-1">{game.emoji}</div>
              <span
                className={`font-bold text-sm leading-tight line-clamp-2 w-full ${
                  unlocked ? "text-[#1A1A2E]" : "text-[#6B6B8A]"
                }`}
              >
                {game.name}
              </span>
              {unlocked ? (
                <StarRating score={highScore} />
              ) : (
                <div className="flex items-center gap-1 text-xs text-[#6B6B8A] flex-wrap justify-center">
                  <Lock size={10} />
                  <span className="line-clamp-1">
                    {game.requiresFullUnit
                      ? `Complete ${unlockUnitName}`
                      : `1 lesson: ${unlockUnitName}`}
                  </span>
                </div>
              )}
              {unlocked && highScore === null && (
                <div className="flex items-center gap-1 text-xs text-[#5B4FCF] font-bold bg-purple-50 px-2 py-0.5 rounded-full">
                  <Play size={10} fill="currentColor" /> Play
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
