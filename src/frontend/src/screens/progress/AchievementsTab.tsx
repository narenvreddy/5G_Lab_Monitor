import { Lock } from "lucide-react";
import React, { useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import type { ChildProfile } from "../../backend";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Progress } from "../../components/ui/progress";
import { ScrollArea } from "../../components/ui/scroll-area";
import {
  type AchievementDef,
  buildAchievements,
} from "../../utils/achievements";

export const RARITY_STYLES: Record<
  string,
  { border: string; label: string; color: string; shadow?: string }
> = {
  common: { border: "border-gray-300", label: "Common", color: "#6B6B8A" },
  rare: { border: "border-blue-400", label: "Rare", color: "#3B82F6" },
  epic: { border: "border-purple-500", label: "Epic", color: "#8B5CF6" },
  legendary: {
    border: "border-amber-400",
    label: "Legendary",
    color: "#F59E0B",
    shadow: "shadow-amber-200",
  },
};

export const RARITY_ORDER = ["legendary", "epic", "rare", "common"] as const;

export function AchievementCard({
  ach,
  compact = false,
}: { ach: AchievementDef; compact?: boolean }) {
  const style = RARITY_STYLES[ach.rarity];
  return (
    <Card
      className={`relative overflow-hidden transition-all border ${
        style.border
      } ${
        ach.earned && style.shadow ? `${style.shadow} shadow-lg` : "shadow-sm"
      } ${ach.earned ? "bg-white" : "bg-gray-50"} ${
        compact ? "p-3" : "p-4"
      } rounded-2xl`}
      aria-label={`${ach.title} badge, ${ach.rarity} rarity, ${
        ach.earned ? "earned" : "not yet earned"
      }`}
      data-ocid={`progress.achievement.${ach.id}.card`}
    >
      {ach.earned && (
        <div
          className="absolute top-0 left-0 px-1.5 py-0.5 rounded-br-lg text-white font-black"
          style={{ fontSize: "9px", backgroundColor: style.color }}
        >
          {style.label}
        </div>
      )}
      {!ach.earned && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/5 rounded-2xl z-10">
          <Lock size={18} className="text-gray-400" />
        </div>
      )}
      <div
        className={`${
          compact ? "text-3xl mb-1 mt-3" : "text-4xl mb-2 mt-2"
        } ${ach.earned ? "" : "grayscale opacity-40"}`}
      >
        {ach.emoji}
      </div>
      <div
        className={`font-black ${
          compact ? "text-xs" : "text-sm"
        } leading-tight ${ach.earned ? "text-[#1A1A2E]" : "text-[#6B6B8A]"}`}
      >
        {ach.title}
      </div>
      <div
        className={`${
          compact ? "text-[10px]" : "text-xs"
        } text-[#6B6B8A] mt-0.5 leading-tight`}
      >
        {ach.desc}
      </div>
      {ach.earned && (
        <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-[#00C9A7] flex items-center justify-center">
          <span className="text-white text-[9px] font-black">✓</span>
        </div>
      )}
    </Card>
  );
}

function AchievementsGalleryModal({
  achievements,
  open,
  onClose,
}: {
  achievements: AchievementDef[];
  open: boolean;
  onClose: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="max-w-lg w-full p-0 overflow-hidden rounded-3xl"
        data-ocid="progress.achievements.modal"
      >
        <DialogHeader className="px-5 pt-5 pb-3 bg-gradient-to-br from-[#5B4FCF] to-[#7B6FDF]">
          <DialogTitle className="text-white font-black text-xl">
            🏅 All Achievements
          </DialogTitle>
          <p className="text-purple-200 text-sm">
            {achievements.filter((a) => a.earned).length}/{achievements.length}{" "}
            unlocked
          </p>
        </DialogHeader>
        <ScrollArea className="h-[70vh]">
          <div className="px-4 py-4 space-y-5">
            {RARITY_ORDER.map((rarity) => {
              const group = achievements.filter((a) => a.rarity === rarity);
              const earnedCount = group.filter((a) => a.earned).length;
              const style = RARITY_STYLES[rarity];
              return (
                <div key={rarity}>
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className="h-0.5 w-3 rounded-full"
                      style={{ backgroundColor: style.color }}
                    />
                    <span
                      className="text-xs font-black uppercase tracking-wider"
                      style={{ color: style.color }}
                    >
                      {style.label}
                    </span>
                    <span className="text-xs text-[#6B6B8A] font-bold">
                      {earnedCount}/{group.length}
                    </span>
                    <div
                      className="flex-1 h-0.5 rounded-full"
                      style={{ backgroundColor: `${style.color}33` }}
                    />
                  </div>
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                    {group.map((ach) => (
                      <AchievementCard key={ach.id} ach={ach} compact />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

interface AchievementsTabProps {
  profile: ChildProfile | null;
  profileId: string;
  /** Pass true only when this tab is the currently visible tab */
  isActive?: boolean;
}

export function AchievementsTab({
  profile,
  profileId,
  isActive = false,
}: AchievementsTabProps) {
  const achievements = useMemo(
    () => buildAchievements(profile, profileId),
    [profile, profileId],
  );
  const earned = achievements.filter((a) => a.earned).length;
  const [showModal, setShowModal] = useState(false);
  const [newBadgeIds, setNewBadgeIds] = useState<string[]>([]);
  const initialized = useRef<string | null>(null);

  // Only fire badge-seen logic when the Achievements tab is actually visible.
  // This prevents the dot from clearing the moment the Progress screen mounts.
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentionally run once per tab activation
  React.useEffect(() => {
    if (!profileId || !isActive) return;
    const profileKey = String(profileId);
    if (initialized.current === profileKey) return;
    initialized.current = profileKey;
    try {
      const key = `mathquest_new_badges_${profileId}`;
      const prevEarned = new Set(
        (localStorage.getItem(key) ?? "").split(",").filter(Boolean),
      );
      const currentEarned = achievements
        .filter((a) => a.earned)
        .map((a) => a.id);
      const newOnes = currentEarned.filter((id) => !prevEarned.has(id));
      if (newOnes.length > 0) {
        setNewBadgeIds(newOnes);
        for (const id of newOnes) {
          const ach = achievements.find((a) => a.id === id);
          if (ach) toast(`🏅 New badge: ${ach.title}!`);
        }
      }
      localStorage.setItem(key, currentEarned.join(","));
    } catch {}
  }, [profileId, isActive]);

  const preview = [...achievements]
    .sort((a, b) => (b.earned ? 1 : 0) - (a.earned ? 1 : 0))
    .slice(0, 8);

  return (
    <div className="space-y-4" data-ocid="progress.achievements.panel">
      <Card className="p-4 rounded-2xl border-0 shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-black text-[#1A1A2E]">Achievements</h3>
            <p className="text-xs text-[#6B6B8A]">
              {earned}/{achievements.length} unlocked
            </p>
          </div>
          <div className="flex items-center gap-2">
            {newBadgeIds.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#EF476F] flex items-center justify-center text-white text-[10px] font-black">
                {newBadgeIds.length}
              </span>
            )}
            <Button
              size="sm"
              variant="outline"
              className="text-xs rounded-xl h-7 px-3"
              onClick={() => setShowModal(true)}
              data-ocid="progress.achievements.open_modal_button"
            >
              View All
            </Button>
          </div>
        </div>
        <Progress
          value={(earned / achievements.length) * 100}
          className="h-2 mt-3 rounded-full"
        />
        <div className="flex gap-2 mt-2 flex-wrap">
          {RARITY_ORDER.map((r) => {
            const g = achievements.filter((a) => a.rarity === r);
            const e = g.filter((a) => a.earned).length;
            const style = RARITY_STYLES[r];
            return (
              <span
                key={r}
                className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor: `${style.color}15`,
                  color: style.color,
                }}
              >
                {style.label}: {e}/{g.length}
              </span>
            );
          })}
        </div>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {preview.map((ach) => (
          <AchievementCard key={ach.id} ach={ach} />
        ))}
      </div>

      {achievements.length > 8 && (
        <Button
          variant="ghost"
          className="w-full rounded-2xl text-[#5B4FCF] font-bold"
          onClick={() => setShowModal(true)}
          data-ocid="progress.achievements.secondary_button"
        >
          See all {achievements.length} achievements →
        </Button>
      )}

      <AchievementsGalleryModal
        achievements={achievements}
        open={showModal}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
}
