import { BookOpen, Mail, Shield, Star, TrendingUp } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ChildProfile } from "../../backend";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { UNITS } from "../../constants/units";
import { useActor } from "../../hooks/useActor";
import { getTotalStars } from "../../utils/achievements";
import {
  type QTypeAccuracy,
  type QuestionTypeKey,
  getDailyStarData,
  getLessonsThisWeek,
  getQuestionTypeAccuracy,
  getStarsThisWeek,
  syncDailyStarEntry,
} from "../../utils/parentTracking";
import { hashPin } from "../../utils/pinHash";

const QTYPE_LABELS: Record<QuestionTypeKey, string> = {
  multipleChoice: "Multiple Choice",
  trueFalse: "True / False",
  fillInBlank: "Fill in the Blank",
  dragDrop: "Drag & Drop",
};

function formatMinutes(seconds: number): string {
  if (seconds === 0) return "--";
  const mins = Math.round(seconds / 60);
  return mins < 1 ? "<1m" : `${mins}m`;
}

function getLessonTimeSpent(
  profileId: string,
  unitIdx: number,
  lessonIdx: number,
): number {
  try {
    const key = `mathquest_time_${profileId}_${unitIdx}_${lessonIdx}`;
    return Number(localStorage.getItem(key) ?? 0);
  } catch {
    return 0;
  }
}

function getUnitTimeSpent(
  profileId: string,
  unitIdx: number,
  totalLessons: number,
): number {
  let total = 0;
  for (let i = 0; i < totalLessons; i++) {
    total += getLessonTimeSpent(profileId, unitIdx, i);
  }
  return total;
}

function getWeakAreas(
  profileId: string,
): Array<{ unit: string; lessonNum: number }> {
  if (!profileId) return [];
  const weak: Array<{ unit: string; lessonNum: number }> = [];
  try {
    const prefix = `mathquest_hints_${profileId}_`;
    const relevantKeys = Object.keys(localStorage).filter((k) =>
      k.startsWith(prefix),
    );
    for (const key of relevantKeys) {
      const count = Number.parseInt(localStorage.getItem(key) ?? "0", 10);
      if (count >= 3) {
        const parts = key.replace(prefix, "").split("_");
        const unitIdx = Number.parseInt(parts[0] ?? "0", 10);
        const lessonIdx = Number.parseInt(parts[1] ?? "0", 10);
        weak.push({
          unit: UNITS.find((u) => u.idx === unitIdx)?.name ?? `Unit ${unitIdx}`,
          lessonNum: lessonIdx + 1,
        });
      }
    }
  } catch {}
  return weak.slice(0, 5);
}

function QuestionTypeBar({
  label,
  correct,
  total,
}: { label: string; correct: number; total: number }) {
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
  const color = pct >= 80 ? "#00C9A7" : pct >= 50 ? "#FFD166" : "#EF476F";
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-bold text-[#1A1A2E] w-32 shrink-0 truncate">
        {label}
      </span>
      <div className="flex-1 h-3 bg-[#F4F2FF] rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        />
      </div>
      <span
        className="text-xs font-black w-12 text-right shrink-0"
        style={{ color }}
      >
        {pct}%
      </span>
      <span className="text-[10px] text-[#6B6B8A] w-12 text-right shrink-0">
        {correct}/{total}
      </span>
    </div>
  );
}

function WeeklySummaryPill({
  profileId,
  streak,
}: { profileId: string; streak: number }) {
  const starsThisWeek = getStarsThisWeek(profileId);
  const lessonsThisWeek = getLessonsThisWeek(profileId);
  return (
    <div
      className="flex flex-wrap items-center gap-3 px-4 py-2 rounded-2xl text-xs font-bold"
      style={{ background: "#EDE8FF", color: "#5B4FCF" }}
      data-ocid="progress.weekly_summary.panel"
    >
      <span>⭐ {starsThisWeek} stars this week</span>
      <span className="text-[#6B6B8A]">&middot;</span>
      <span>📚 {lessonsThisWeek} lessons done</span>
      <span className="text-[#6B6B8A]">&middot;</span>
      <span>🔥 {streak} day streak</span>
    </div>
  );
}

function ParentEmailSummary({
  profileId,
  activeProfile,
}: { profileId: string; activeProfile: ChildProfile | null }) {
  const { actor } = useActor();
  const emailKey = `mathspark_parent_email_${profileId}`;
  const [email, setEmail] = useState(() => {
    try {
      return localStorage.getItem(emailKey) ?? "";
    } catch {
      return "";
    }
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSend = async () => {
    if (!actor || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    try {
      localStorage.setItem(emailKey, email);
    } catch {}
    setSending(true);
    setError("");
    try {
      const totalStars = (activeProfile?.progress ?? []).reduce(
        (sum, unit) =>
          sum + unit.lessons.reduce((s, l) => s + Number(l.stars), 0),
        0,
      );
      const streak = Number(activeProfile?.dailyStreak?.currentStreak ?? 0);
      const lessonsCompleted = (activeProfile?.progress ?? []).reduce(
        (sum, unit) =>
          sum + unit.lessons.filter((l) => Number(l.stars) > 0).length,
        0,
      );
      const childName = activeProfile?.name ?? "your child";
      const summary = `Hi! Here's ${childName}'s MathSpark progress summary:

⭐ Total stars earned: ${totalStars}
📚 Lessons completed: ${lessonsCompleted}
🔥 Current streak: ${streak} day${streak !== 1 ? "s" : ""}

Keep up the great work! Log in to MathSpark to see the full progress report.`;
      await actor.sendParentWeeklySummaryEmail(email, summary);
      setSent(true);
    } catch {
      setError("Failed to send. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <Card
      className="p-5 rounded-2xl border-0 shadow-md"
      data-ocid="progress.email_summary.card"
    >
      <h3 className="font-black text-[#1A1A2E] mb-1 flex items-center gap-2">
        <Mail size={16} className="text-[#FF6B35]" />
        Weekly Summary Email
      </h3>
      <p className="text-xs text-[#6B6B8A] mb-4">
        Send a progress summary to your email right now.
      </p>
      {sent ? (
        <output className="text-sm font-bold text-[#00C9A7] block">
          ✅ Summary sent to {email}!
        </output>
      ) : (
        <>
          <div className="flex gap-2">
            <Input
              type="email"
              placeholder="parent@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              className="rounded-xl flex-1"
              data-ocid="progress.parent_email.input"
              disabled={sending}
              aria-label="Parent email address"
            />
            <Button
              onClick={handleSend}
              disabled={sending || !email}
              className="bg-[#FF6B35] text-white font-bold rounded-xl shrink-0"
              data-ocid="progress.send_email.primary_button"
              aria-busy={sending}
            >
              {sending ? "Sending..." : "Send"}
            </Button>
          </div>
          {error && (
            <p className="text-xs text-[#EF476F] mt-2" role="alert">
              {error}
            </p>
          )}
        </>
      )}
    </Card>
  );
}

function ParentUnitReport({
  profileId,
  activeProfile,
}: { profileId: string; activeProfile: ChildProfile | null }) {
  const totalStars = (activeProfile?.progress ?? []).reduce(
    (sum, unit) => sum + unit.lessons.reduce((s, l) => s + Number(l.stars), 0),
    0,
  );

  useEffect(() => {
    if (!profileId) return;
    syncDailyStarEntry(profileId, totalStars);
  }, [profileId, totalStars]);

  // PERF-02: Memoize expensive chart data computations (126+ localStorage reads for dailyData)
  const dailyData = useMemo(() => getDailyStarData(profileId, 14), [profileId]);
  const daysWithData = useMemo(
    () => dailyData.filter((d) => d.stars > 0).length,
    [dailyData],
  );

  const qtypeAccuracy: QTypeAccuracy | null = useMemo(
    () => getQuestionTypeAccuracy(profileId),
    [profileId],
  );
  const qtypeKeys: QuestionTypeKey[] = [
    "multipleChoice",
    "trueFalse",
    "fillInBlank",
    "dragDrop",
  ];
  const qtypeWithData = useMemo(
    () => qtypeKeys.filter((k) => (qtypeAccuracy?.[k]?.total ?? 0) > 0),
    [qtypeAccuracy],
  );

  const chartData = useMemo(
    () =>
      UNITS.map((unit) => {
        const unitData = activeProfile?.progress.find(
          (u) => Number(u.unitIndex) === unit.idx,
        );
        const starsEarned =
          unitData?.lessons.reduce((s, l) => s + Number(l.stars), 0) ?? 0;
        const lessonsCompleted =
          unitData?.lessons.filter((l) => Number(l.stars) > 0).length ?? 0;
        const timeSpentSeconds = getUnitTimeSpent(
          profileId,
          unit.idx,
          unit.total,
        );
        return {
          name: unit.name.split(" ").slice(0, 2).join(" "),
          fullName: unit.name,
          stars: starsEarned,
          completed: lessonsCompleted,
          total: unit.total,
          time: timeSpentSeconds,
        };
      }),
    [activeProfile, profileId],
  );

  const hasAnyData = useMemo(
    () => chartData.some((d) => d.stars > 0),
    [chartData],
  );
  const streak = Number(activeProfile?.dailyStreak?.currentStreak ?? 0);

  const getLessonStatus = (unitIdx: number, lessonIdx: number) => {
    const unit = activeProfile?.progress.find(
      (u) => Number(u.unitIndex) === unitIdx,
    );
    const lesson = unit?.lessons.find(
      (l) => Number(l.lessonIndex) === lessonIdx,
    );
    if (!lesson) return "not-started";
    if (Number(lesson.stars) >= 3) return "mastered";
    if (Number(lesson.stars) > 0 || Number(lesson.attempts) > 0)
      return "in-progress";
    return "not-started";
  };

  return (
    <div className="space-y-4">
      <WeeklySummaryPill profileId={profileId} streak={streak} />

      {/* Progress Over Time */}
      <Card
        className="p-5 rounded-2xl border-0 shadow-md"
        data-ocid="progress.trend_chart.card"
      >
        <h3 className="font-black text-[#1A1A2E] mb-1 flex items-center gap-2">
          <TrendingUp size={16} className="text-[#5B4FCF]" />
          Progress Over Time
        </h3>
        <p className="text-xs text-[#6B6B8A] mb-4">
          Stars earned each day — last 14 days
        </p>
        {daysWithData >= 2 ? (
          <ResponsiveContainer width="100%" height={160}>
            <LineChart
              data={dailyData}
              margin={{ top: 4, right: 8, bottom: 20, left: -20 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#E5E0FF"
                vertical={false}
              />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 9, fill: "#6B6B8A", fontWeight: 700 }}
                tickLine={false}
                axisLine={false}
                interval={1}
                angle={-35}
                textAnchor="end"
              />
              <YAxis
                tick={{ fontSize: 10, fill: "#6B6B8A" }}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "none",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
                  fontSize: "12px",
                  fontWeight: 700,
                }}
                formatter={(value: number) => [`${value} stars`, "Stars"]}
              />
              <Line
                type="monotone"
                dataKey="stars"
                stroke="#5B4FCF"
                strokeWidth={3}
                dot={{ r: 4, fill: "#5B4FCF", strokeWidth: 0 }}
                activeDot={{ r: 6, fill: "#FF6B35" }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div
            className="h-28 flex flex-col items-center justify-center text-[#6B6B8A] text-sm gap-2"
            data-ocid="progress.trend_chart.empty_state"
          >
            <TrendingUp size={28} className="text-[#5B4FCF]/30" />
            <span>Come back tomorrow to see your progress trend!</span>
          </div>
        )}
      </Card>

      {/* Question Type Accuracy */}
      {qtypeWithData.length > 0 && (
        <Card
          className="p-5 rounded-2xl border-0 shadow-md"
          data-ocid="progress.qtype_accuracy.card"
        >
          <h3 className="font-black text-[#1A1A2E] mb-1 flex items-center gap-2">
            <BookOpen size={16} className="text-[#FF6B35]" />
            Question Types
          </h3>
          <p className="text-xs text-[#6B6B8A] mb-4">
            Accuracy by question format
          </p>
          <div className="space-y-3">
            {qtypeWithData.map((k) => {
              const s = qtypeAccuracy?.[k] ?? { correct: 0, total: 0 };
              return (
                <QuestionTypeBar
                  key={k}
                  label={QTYPE_LABELS[k]}
                  correct={s.correct}
                  total={s.total}
                />
              );
            })}
          </div>
          <div className="flex gap-4 mt-4 text-[10px] text-[#6B6B8A]">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#00C9A7] inline-block" />{" "}
              ≥80%
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#FFD166] inline-block" />{" "}
              50–79%
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#EF476F] inline-block" />{" "}
              &lt;50%
            </span>
          </div>
        </Card>
      )}

      {/* Stars per unit bar chart */}
      <Card className="p-5 rounded-2xl border-0 shadow-md">
        <h3 className="font-black text-[#1A1A2E] mb-1 flex items-center gap-2">
          <Star size={16} className="text-[#FFD166]" />
          Stars per Unit
        </h3>
        <p className="text-xs text-[#6B6B8A] mb-4">
          How many stars earned in each unit
        </p>
        {hasAnyData ? (
          <ResponsiveContainer width="100%" height={180}>
            <BarChart
              data={chartData}
              margin={{ top: 4, right: 4, bottom: 20, left: -20 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#E5E0FF"
                vertical={false}
              />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 9, fill: "#6B6B8A", fontWeight: 700 }}
                tickLine={false}
                axisLine={false}
                angle={-35}
                textAnchor="end"
                interval={0}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "#6B6B8A" }}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "none",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
                  fontSize: "12px",
                  fontWeight: 700,
                }}
                formatter={(value: number) => [`${value} stars`, "Stars"]}
                labelFormatter={(label: string) => {
                  const d = chartData.find((c) => c.name === label);
                  return d?.fullName ?? label;
                }}
              />
              <Bar
                dataKey="stars"
                fill="#5B4FCF"
                radius={[6, 6, 0, 0]}
                maxBarSize={32}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div
            className="h-32 flex items-center justify-center text-[#6B6B8A] text-sm"
            data-ocid="progress.chart.empty_state"
          >
            Complete some lessons to see your chart! 📊
          </div>
        )}
      </Card>

      {/* Overall Accuracy Card */}
      {qtypeWithData.length > 0 &&
        (() => {
          const totalCorrect = qtypeWithData.reduce(
            (s, k) => s + (qtypeAccuracy?.[k]?.correct ?? 0),
            0,
          );
          const totalAttempted = qtypeWithData.reduce(
            (s, k) => s + (qtypeAccuracy?.[k]?.total ?? 0),
            0,
          );
          const overallAccuracy =
            totalAttempted > 0
              ? Math.round((totalCorrect / totalAttempted) * 100)
              : 0;
          const color =
            overallAccuracy >= 80
              ? "#00C9A7"
              : overallAccuracy >= 50
                ? "#FFD166"
                : "#EF476F";
          return (
            <Card
              className="p-5 rounded-2xl border-0 shadow-md"
              data-ocid="progress.overall_accuracy.card"
            >
              <h3 className="font-black text-[#1A1A2E] mb-1 flex items-center gap-2">
                <Star size={16} className="text-[#FFD166]" />
                Overall Accuracy
              </h3>
              <p className="text-xs text-[#6B6B8A] mb-3">
                Correct answers across all question types
              </p>
              <div className="flex items-center gap-4">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center font-black text-2xl text-white shadow-md flex-shrink-0"
                  style={{ backgroundColor: color }}
                >
                  {overallAccuracy}%
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-xs text-[#6B6B8A]">
                    {totalCorrect} correct out of {totalAttempted} attempts
                  </p>
                  <div className="h-3 bg-[#F4F2FF] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${overallAccuracy}%`,
                        backgroundColor: color,
                      }}
                    />
                  </div>
                  <p className="text-xs font-bold" style={{ color }}>
                    {overallAccuracy >= 80
                      ? "Excellent work!"
                      : overallAccuracy >= 50
                        ? "Good progress!"
                        : "Keep practising!"}
                  </p>
                </div>
              </div>
            </Card>
          );
        })()}

      {/* Unit Summary Table */}
      <Card
        className="p-5 rounded-2xl border-0 shadow-md"
        data-ocid="progress.unit_summary.table"
      >
        <h3 className="font-black text-[#1A1A2E] mb-3 flex items-center gap-2">
          <BookOpen size={16} className="text-[#5B4FCF]" />
          Unit Summary
        </h3>
        <div className="overflow-x-auto -mx-1">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[#E5E0FF]">
                <th
                  scope="col"
                  className="text-left py-2 px-1 font-black text-[#6B6B8A] uppercase tracking-wide"
                >
                  Unit
                </th>
                <th
                  scope="col"
                  className="text-center py-2 px-1 font-black text-[#6B6B8A] uppercase tracking-wide"
                >
                  Stars
                </th>
                <th
                  scope="col"
                  className="text-center py-2 px-1 font-black text-[#6B6B8A] uppercase tracking-wide"
                >
                  Lessons
                </th>
                <th
                  scope="col"
                  className="text-center py-2 px-1 font-black text-[#6B6B8A] uppercase tracking-wide"
                >
                  Time
                </th>
                <th
                  scope="col"
                  className="text-center py-2 px-1 font-black text-[#6B6B8A] uppercase tracking-wide"
                >
                  Score %
                </th>
              </tr>
            </thead>
            <tbody>
              {UNITS.map((unit) => {
                const unitData = activeProfile?.progress.find(
                  (u) => Number(u.unitIndex) === unit.idx,
                );
                const starsEarned =
                  unitData?.lessons.reduce((s, l) => s + Number(l.stars), 0) ??
                  0;
                const maxPossibleStars = unit.total * 3;
                const lessonsCompleted =
                  unitData?.lessons.filter((l) => Number(l.stars) > 0).length ??
                  0;
                const timeSpentSeconds = getUnitTimeSpent(
                  profileId,
                  unit.idx,
                  unit.total,
                );
                const totalAttempts =
                  unitData?.lessons.reduce(
                    (s, l) => s + Number(l.attempts),
                    0,
                  ) ?? 0;
                const accuracy =
                  totalAttempts > 0
                    ? Math.min(
                        100,
                        Math.round((lessonsCompleted / totalAttempts) * 100),
                      )
                    : null;
                const isStarted = lessonsCompleted > 0;
                return (
                  <tr
                    key={unit.idx}
                    className="border-b border-[#F4F2FF] hover:bg-[#F4F2FF] transition-colors"
                    data-ocid={`progress.unit_row.item.${unit.idx + 1}`}
                  >
                    <td className="py-2.5 px-1">
                      <span className="font-bold text-[#1A1A2E] text-xs leading-tight block">
                        {unit.name}
                      </span>
                    </td>
                    <td className="py-2.5 px-1 text-center">
                      {isStarted ? (
                        <span
                          className="font-black"
                          style={{ color: "#FFD166" }}
                        >
                          ⭐ {starsEarned}/{maxPossibleStars}
                        </span>
                      ) : (
                        <span className="text-[#6B6B8A]">—</span>
                      )}
                    </td>
                    <td className="py-2.5 px-1 text-center">
                      <span
                        className={`font-bold ${isStarted ? "text-[#5B4FCF]" : "text-[#6B6B8A]"}`}
                      >
                        {lessonsCompleted}/{unit.total}
                      </span>
                    </td>
                    <td className="py-2.5 px-1 text-center">
                      <span className="font-bold text-[#00C9A7]">
                        {formatMinutes(timeSpentSeconds)}
                      </span>
                    </td>
                    <td className="py-2.5 px-1 text-center">
                      {accuracy !== null ? (
                        <span
                          className="font-black text-sm"
                          style={{
                            color:
                              accuracy >= 80
                                ? "#00C9A7"
                                : accuracy >= 50
                                  ? "#FFD166"
                                  : "#EF476F",
                          }}
                        >
                          {accuracy}%
                        </span>
                      ) : (
                        <span className="text-[#6B6B8A]">N/A</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="mt-3 text-[10px] text-[#6B6B8A] flex flex-wrap gap-3">
          <span>⭐ Stars = stars earned / max possible</span>
          <span>⏱ Time = total lesson time</span>
          <span>% = Score (lessons done ÷ total attempts)</span>
        </div>
      </Card>

      {/* Daily Challenge Stats */}
      {(() => {
        const dcEntries = (activeProfile?.progress ?? []).find(
          (u) => Number(u.unitIndex) === 99,
        );
        const dcLessons = dcEntries?.lessons ?? [];
        const dcCompletions = dcLessons.length;
        const dcTotalStars = dcLessons.reduce((s, l) => s + Number(l.stars), 0);
        const dcAvgStars =
          dcCompletions > 0 ? (dcTotalStars / dcCompletions).toFixed(1) : "0";
        const dcBestStars =
          dcCompletions > 0
            ? Math.max(...dcLessons.map((l) => Number(l.stars)))
            : 0;
        const dcStreak = Number(activeProfile?.dailyStreak?.currentStreak ?? 0);
        return (
          <Card
            className="p-5 rounded-2xl border-0 shadow-md"
            data-ocid="progress.daily_challenge_stats.card"
          >
            <h3 className="font-black text-[#1A1A2E] mb-3 flex items-center gap-2">
              <span className="text-base">🗓️</span> Daily Challenge
            </h3>
            {dcCompletions === 0 ? (
              <p
                className="text-[#6B6B8A] text-sm"
                data-ocid="progress.daily_challenge.empty_state"
              >
                No daily challenges completed yet
              </p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: "Completed", value: dcCompletions },
                  { label: "Avg ⭐", value: dcAvgStars },
                  { label: "Best ⭐", value: dcBestStars },
                  { label: "Streak", value: `${dcStreak} days 🔥` },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="bg-[#F4F2FF] rounded-xl p-3 text-center"
                  >
                    <p className="font-black text-[#5B4FCF] text-lg">
                      {String(value)}
                    </p>
                    <p className="text-xs text-[#6B6B8A] font-semibold">
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </Card>
        );
      })()}

      {/* Mastery Grid */}
      <Card className="p-5 rounded-2xl border-0 shadow-md">
        <h3 className="font-black text-[#1A1A2E] mb-3">Mastery Grid</h3>
        <div className="space-y-2">
          {UNITS.map((unit) => (
            <div key={unit.idx}>
              <div className="text-xs font-bold text-[#6B6B8A] mb-1">
                {unit.name}
              </div>
              <div className="flex gap-1 flex-wrap">
                {Array.from({ length: unit.total }).map((_, li) => {
                  const status = getLessonStatus(unit.idx, li);
                  return (
                    <div
                      key={`${unit.idx}-${li}`}
                      className={`w-7 h-7 rounded-lg ${
                        status === "mastered"
                          ? "bg-[#00C9A7]"
                          : status === "in-progress"
                            ? "bg-[#FFD166]"
                            : "bg-gray-200"
                      }`}
                      title={`Lesson ${li + 1}: ${status}`}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-3 mt-3 text-xs text-[#6B6B8A]">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 bg-[#00C9A7] rounded" /> Mastered
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 bg-[#FFD166] rounded" /> In Progress
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 bg-gray-200 rounded" /> Not Started
          </span>
        </div>
      </Card>

      {/* Weak Areas */}
      <Card className="p-5 rounded-2xl border-0 shadow-md">
        <h3 className="font-black text-[#1A1A2E] mb-2">Weak Areas</h3>
        <p className="text-[#6B6B8A] text-sm mb-3">
          Lessons where hints were needed 3+ times.
        </p>
        {(() => {
          const weak = getWeakAreas(profileId);
          if (weak.length === 0) {
            return (
              <div
                className="text-center py-4 text-[#6B6B8A]"
                data-ocid="progress.weak_areas.empty_state"
              >
                No weak areas yet. Keep going!
              </div>
            );
          }
          return (
            <div className="space-y-2 mt-2">
              {weak.map((w, i) => (
                <div
                  key={`${w.unit}-${w.lessonNum}-${i}`}
                  className="flex items-center gap-2 py-2 px-3 bg-[#FFF0E8] rounded-xl"
                >
                  <span className="text-lg">⚠️</span>
                  <span className="font-bold text-[#1A1A2E] text-sm">
                    {w.unit}
                  </span>
                  <span className="text-xs text-[#6B6B8A] ml-auto">
                    Lesson {w.lessonNum}
                  </span>
                </div>
              ))}
            </div>
          );
        })()}
      </Card>

      {/* Parent Email Summary */}
      <ParentEmailSummary profileId={profileId} activeProfile={activeProfile} />
    </div>
  );
}

interface ParentDashboardProps {
  profileId: string;
  activeProfile: ChildProfile | null;
}

export function ParentDashboard({
  profileId,
  activeProfile,
}: ParentDashboardProps) {
  const { actor } = useActor();
  const [pinInput, setPinInput] = useState("");
  const [parentUnlocked, setParentUnlocked] = useState(
    () => sessionStorage.getItem("parentUnlocked") === "1",
  );
  // Track whether the user bypassed PIN gate (BUG-02): if so, require current PIN for changes
  const [bypassedPin, setBypassedPin] = useState(false);
  const [pinError, setPinError] = useState(false);
  const [settingPin, setSettingPin] = useState(false);
  const [newPin, setNewPin] = useState("");
  const [currentPinForChange, setCurrentPinForChange] = useState("");
  const [changePinError, setChangePinError] = useState(false);

  const handleVerifyPin = async () => {
    if (!actor) return;
    const hash = hashPin(pinInput);
    const ok = await actor.verifyParentPin(hash);
    if (ok) {
      setParentUnlocked(true);
      sessionStorage.setItem("parentUnlocked", "1");
      setPinError(false);
    } else {
      setPinError(true);
    }
    setPinInput("");
  };

  const handleSetPin = async () => {
    if (!actor || newPin.length !== 4) return;
    // If user bypassed PIN gate without knowing the PIN, require current PIN for any changes (BUG-02)
    const hasExistingPin = bypassedPin || currentPinForChange.length > 0;
    if (hasExistingPin) {
      if (currentPinForChange.length !== 4) {
        setChangePinError(true);
        return;
      }
      const hash = hashPin(currentPinForChange);
      const ok = await actor.verifyParentPin(hash);
      if (!ok) {
        setChangePinError(true);
        return;
      }
    }
    await actor.setParentPin(hashPin(newPin));
    setSettingPin(false);
    setNewPin("");
    setCurrentPinForChange("");
    setChangePinError(false);
    setPinError(false);
  };

  if (!parentUnlocked) {
    return (
      <Card
        className="p-6 rounded-2xl border-0 shadow-md text-center"
        data-ocid="progress.pin_gate.panel"
      >
        <Shield size={48} className="text-[#5B4FCF] mx-auto mb-3" />
        <h3 className="font-black text-xl text-[#1A1A2E] mb-2">
          Parent Report
        </h3>
        <p className="text-[#6B6B8A] mb-4">Enter your 4-digit PIN to view</p>
        <Input
          type="password"
          inputMode="numeric"
          maxLength={4}
          placeholder="• • • •"
          value={pinInput}
          onChange={(e) => {
            setPinInput(e.target.value);
            setPinError(false);
          }}
          className={`text-center text-2xl tracking-widest rounded-xl mb-3 ${
            pinError ? "border-[#EF476F]" : ""
          }`}
          data-ocid="progress.parent_pin.input"
        />
        {pinError && (
          <p className="text-[#EF476F] text-sm mb-2">
            Incorrect PIN. Try again.
          </p>
        )}
        <Button
          onClick={handleVerifyPin}
          disabled={pinInput.length !== 4}
          className="w-full bg-[#5B4FCF] text-white rounded-xl font-bold"
          data-ocid="progress.verify_pin.primary_button"
        >
          Unlock Report
        </Button>
        <button
          type="button"
          onClick={() => {
            setParentUnlocked(true);
            setBypassedPin(true);
            sessionStorage.setItem("parentUnlocked", "1");
          }}
          className="mt-3 text-xs text-[#6B6B8A] underline"
          data-ocid="progress.parent_skip_pin.button"
        >
          No PIN set? Enter without PIN
        </button>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="p-4 rounded-2xl border-0 shadow-sm">
        <button
          type="button"
          className="text-sm text-[#6B6B8A] underline"
          onClick={() => setSettingPin(true)}
          data-ocid="progress.set_pin.button"
        >
          Set a new PIN
        </button>
        {settingPin && (
          <div className="mt-3 space-y-2">
            <Input
              type="password"
              inputMode="numeric"
              maxLength={4}
              placeholder="Current PIN"
              value={currentPinForChange}
              onChange={(e) => {
                setCurrentPinForChange(e.target.value);
                setChangePinError(false);
              }}
              className={`text-center text-xl tracking-widest rounded-xl ${
                changePinError ? "border-[#EF476F]" : ""
              }`}
              data-ocid="progress.current_pin.input"
            />
            {changePinError && (
              <p className="text-[#EF476F] text-xs">
                Incorrect current PIN. Try again.
              </p>
            )}
            <Input
              type="password"
              inputMode="numeric"
              maxLength={4}
              placeholder="New 4-digit PIN"
              value={newPin}
              onChange={(e) => setNewPin(e.target.value)}
              className="text-center text-xl tracking-widest rounded-xl"
              data-ocid="progress.new_pin.input"
            />
            <Button
              onClick={handleSetPin}
              disabled={
                newPin.length !== 4 ||
                (bypassedPin && currentPinForChange.length !== 4)
              }
              className="w-full bg-[#00C9A7] text-white rounded-xl font-bold"
              data-ocid="progress.save_pin.primary_button"
            >
              Save PIN
            </Button>
          </div>
        )}
      </Card>
      <ParentUnitReport profileId={profileId} activeProfile={activeProfile} />
    </div>
  );
}
