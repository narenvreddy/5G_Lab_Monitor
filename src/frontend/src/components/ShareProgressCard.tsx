import { Check, Copy, Share2, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import React, { useState } from "react";
import type { ChildProfile } from "../backend";
import { UNITS, UNIT_COLORS } from "../constants/units";
import { buildAchievements, getTotalStars } from "../utils/achievements";

interface ShareProgressCardProps {
  profile: ChildProfile;
  onClose: () => void;
}

const RARITY_ORDER = ["legendary", "epic", "rare", "common"] as const;

function getTopBadges(profile: ChildProfile, count = 3) {
  const profileId = String(profile.id);
  const achievements = buildAchievements(profile, profileId);
  const earned = achievements.filter((a) => a.earned);
  const sorted: typeof earned = [];
  for (const rarity of RARITY_ORDER) {
    sorted.push(...earned.filter((a) => a.rarity === rarity));
  }
  return sorted.slice(0, count);
}

const AVATAR_COLORS: Record<string, string> = {
  "\uD83E\uDD81": "#FF6B35",
  "\uD83D\uDC3C": "#6B6B8A",
  "\uD83D\uDC38": "#00C9A7",
  "\uD83E\uDD8A": "#FF6B35",
  "\uD83D\uDC2F": "#FFD166",
  "\uD83D\uDC28": "#5B4FCF",
  "\uD83E\uDD84": "#EF476F",
  "\uD83D\uDC19": "#5B4FCF",
  "\uD83E\uDD8B": "#EF476F",
  "\uD83D\uDC22": "#00C9A7",
  "\u2B50": "#FFD166",
  "\uD83D\uDE80": "#5B4FCF",
};

/** Mini per-unit star bars for the share card */
function UnitStarBars({ profile }: { profile: ChildProfile }) {
  const progress = profile.progress ?? [];
  const unitsWithData = UNITS.filter((unit) => {
    const up = progress.find((u) => Number(u.unitIndex) === unit.idx);
    return up?.lessons.some((l) => Number(l.stars) > 0);
  });

  if (unitsWithData.length === 0) return null;

  return (
    <div className="bg-white/15 rounded-2xl p-3 mb-4">
      <p className="text-xs font-black text-purple-200 uppercase tracking-wider mb-2">
        \uD83D\uDCCA Unit Progress
      </p>
      <div className="space-y-1.5">
        {unitsWithData.map((unit) => {
          const up = progress.find((u) => Number(u.unitIndex) === unit.idx);
          const starsEarned = up
            ? up.lessons.reduce((s, l) => s + Number(l.stars), 0)
            : 0;
          const maxStars = unit.total * 3;
          const pct = maxStars > 0 ? (starsEarned / maxStars) * 100 : 0;
          const color = UNIT_COLORS[unit.idx] ?? "#5B4FCF";
          return (
            <div key={unit.idx} className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-white/70 w-20 truncate flex-shrink-0">
                {unit.name.split(" ").slice(0, 2).join(" ")}
              </span>
              <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: color,
                    opacity: 0.9,
                  }}
                />
              </div>
              <span className="text-[10px] font-black text-white/80 w-8 text-right flex-shrink-0">
                \u2B50{starsEarned}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function ShareProgressCard({
  profile,
  onClose,
}: ShareProgressCardProps) {
  const [copied, setCopied] = useState(false);

  const totalStars = getTotalStars(profile);
  const streak = Number(profile.dailyStreak?.currentStreak ?? 0);
  const topBadges = getTopBadges(profile);
  const topBadge = topBadges[0] ?? null;
  const name = profile.name as string;
  const avatar = profile.avatar as string;
  const avatarBg = AVATAR_COLORS[avatar] ?? "#5B4FCF";

  // Build unit progress summary for share text
  const progress = profile.progress ?? [];
  const unitSummary = UNITS.filter((unit) => {
    const up = progress.find((u) => Number(u.unitIndex) === unit.idx);
    return up?.lessons.some((l) => Number(l.stars) > 0);
  })
    .map((unit) => {
      const up = progress.find((u) => Number(u.unitIndex) === unit.idx);
      const completed = up
        ? up.lessons.filter((l) => Number(l.stars) > 0).length
        : 0;
      return `${unit.name}: ${completed}/${unit.total} lessons`;
    })
    .join(", ");

  const shareText = [
    `\uD83C\uDF1F ${name} has earned ${totalStars} stars on MathSpark! \u26A1`,
    streak > 0 ? `\uD83D\uDD25 ${streak}-day learning streak!` : null,
    topBadge ? `Top badge: ${topBadge.emoji} ${topBadge.title}` : null,
    topBadges.length > 1
      ? `Also earned: ${topBadges
          .slice(1)
          .map((b) => `${b.emoji} ${b.title}`)
          .join(", ")}`
      : null,
    unitSummary ? `Units: ${unitSummary}` : null,
    "\nPowered by MathSpark \u26A1 mathspark.app",
  ]
    .filter(Boolean)
    .join("\n");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback: create a textarea and copy manually
      const el = document.createElement("textarea");
      el.value = shareText;
      el.style.position = "fixed";
      el.style.opacity = "0";
      document.body.appendChild(el);
      el.select();
      try {
        document.execCommand("copy");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {}
      document.body.removeChild(el);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: "MathSpark Progress", text: shareText });
      } catch {
        // user dismissed
      }
    } else {
      handleCopy();
    }
  };

  const canNativeShare = typeof navigator !== "undefined" && !!navigator.share;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4"
        data-ocid="share_card.modal"
        onClick={(e) => e.target === e.currentTarget && onClose()}
        onKeyDown={(e) => e.key === "Escape" && onClose()}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.88, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.88, y: 24 }}
          transition={{ type: "spring", stiffness: 320, damping: 22 }}
          className="w-full max-w-sm"
        >
          {/* Close button */}
          <div className="flex justify-end mb-2">
            <button
              type="button"
              data-ocid="share_card.close_button"
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

          {/* The shareable card */}
          <div className="rounded-3xl overflow-hidden shadow-2xl mb-4">
            {/* Header gradient */}
            <div
              className="p-5 text-white text-center relative"
              style={{
                background:
                  "linear-gradient(135deg, #5B4FCF 0%, #7B6FEF 50%, #FF6B35 100%)",
              }}
            >
              {/* Decorative sparkles */}
              <div className="absolute top-3 left-4 text-yellow-300 text-xs opacity-70 select-none">
                \u2726 \u2726 \u2726
              </div>
              <div className="absolute top-3 right-4 text-yellow-300 text-xs opacity-70 select-none">
                \u2726 \u2726 \u2726
              </div>

              {/* Avatar with colored ring */}
              <div className="flex justify-center mb-3">
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center text-5xl shadow-lg"
                  style={{
                    backgroundColor: `${avatarBg}33`,
                    border: `3px solid ${avatarBg}`,
                  }}
                >
                  {avatar}
                </div>
              </div>

              <h2 className="font-black text-3xl mb-0.5">{name}</h2>
              <p className="text-purple-200 text-sm font-semibold mb-4">
                MathSpark Explorer \u26A1
              </p>

              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-white/20 rounded-2xl p-3">
                  <div className="font-black text-3xl text-[#FFD166]">
                    {totalStars}
                  </div>
                  <div className="text-xs font-bold text-purple-200">
                    \u2B50 Total Stars
                  </div>
                </div>
                <div className="bg-white/20 rounded-2xl p-3">
                  <div className="font-black text-3xl text-orange-300">
                    {streak}
                  </div>
                  <div className="text-xs font-bold text-purple-200">
                    \uD83D\uDD25 Day Streak
                  </div>
                </div>
              </div>

              {/* Top badge highlight */}
              {topBadge && (
                <div className="bg-white/20 rounded-2xl p-3 mb-4 flex items-center gap-3 text-left">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-2xl flex-shrink-0"
                    style={{
                      backgroundColor:
                        topBadge.rarity === "legendary"
                          ? "rgba(255,209,102,0.3)"
                          : topBadge.rarity === "epic"
                            ? "rgba(239,71,111,0.25)"
                            : topBadge.rarity === "rare"
                              ? "rgba(0,201,167,0.25)"
                              : "rgba(255,255,255,0.15)",
                    }}
                  >
                    {topBadge.emoji}
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-purple-200 uppercase tracking-wider">
                      \uD83C\uDFC6 Top Achievement
                    </p>
                    <p className="font-black text-white text-sm">
                      {topBadge.title}
                    </p>
                    <p className="text-[10px] text-purple-200 capitalize">
                      {topBadge.rarity}
                    </p>
                  </div>
                  {topBadges.length > 1 && (
                    <div className="ml-auto flex gap-1">
                      {topBadges.slice(1).map((b) => (
                        <span key={b.id} className="text-lg" title={b.title}>
                          {b.emoji}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Per-unit star bars (Sprint 23) */}
              <UnitStarBars profile={profile} />

              {/* Powered by footer */}
              <div className="border-t border-white/20 pt-3">
                <p className="font-black text-white text-sm">
                  Powered by MathSpark \u26A1
                </p>
                <p className="text-purple-300 text-xs">by EdUnite</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2">
            {canNativeShare && (
              <button
                type="button"
                data-ocid="share_card.share.primary_button"
                onClick={handleShare}
                className="w-full py-3.5 rounded-2xl font-black text-base text-white shadow-lg flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
                style={{ backgroundColor: "#5B4FCF" }}
              >
                <Share2 size={18} />
                Share Progress
              </button>
            )}
            {/* Always show copy button */}
            <button
              type="button"
              data-ocid="share_card.copy.primary_button"
              onClick={handleCopy}
              className="w-full py-3.5 rounded-2xl font-black text-base text-white shadow-lg flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
              style={{
                backgroundColor: copied
                  ? "#00C9A7"
                  : canNativeShare
                    ? "#FF6B35"
                    : "#5B4FCF",
              }}
            >
              {copied ? <Check size={18} /> : <Copy size={18} />}
              {copied ? "Copied to clipboard!" : "Copy as Text"}
            </button>
            <button
              type="button"
              data-ocid="share_card.close.button"
              onClick={onClose}
              className="w-full py-3.5 rounded-2xl font-black text-base border-2 border-white/40 text-white/80 bg-transparent"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
