/** Helpers for parent dashboard tracking (daily stars, question-type accuracy, lesson counts) */

export type QuestionTypeKey =
  | "multipleChoice"
  | "trueFalse"
  | "fillInBlank"
  | "dragDrop";

export interface QTypeStats {
  correct: number;
  total: number;
}

export type QTypeAccuracy = Record<QuestionTypeKey, QTypeStats>;

/** Record a question-type attempt in localStorage */
export function recordQuestionTypeAttempt(
  profileId: string,
  questionType: QuestionTypeKey,
  isCorrect: boolean,
): void {
  if (!profileId) return;
  try {
    const key = `mathquest_qtype_${profileId}`;
    const raw = localStorage.getItem(key);
    const data: QTypeAccuracy = raw
      ? (JSON.parse(raw) as QTypeAccuracy)
      : {
          multipleChoice: { correct: 0, total: 0 },
          trueFalse: { correct: 0, total: 0 },
          fillInBlank: { correct: 0, total: 0 },
          dragDrop: { correct: 0, total: 0 },
        };
    if (!data[questionType]) data[questionType] = { correct: 0, total: 0 };
    data[questionType].total += 1;
    if (isCorrect) data[questionType].correct += 1;
    localStorage.setItem(key, JSON.stringify(data));
  } catch {}
}

/** Read question-type accuracy from localStorage */
export function getQuestionTypeAccuracy(
  profileId: string,
): QTypeAccuracy | null {
  if (!profileId) return null;
  try {
    const raw = localStorage.getItem(`mathquest_qtype_${profileId}`);
    if (!raw) return null;
    return JSON.parse(raw) as QTypeAccuracy;
  } catch {
    return null;
  }
}

/** Save a daily star delta entry.
 *  Compares currentTotalStars vs last-known total and writes the delta for today. */
export function syncDailyStarEntry(
  profileId: string,
  currentTotalStars: number,
): void {
  if (!profileId) return;
  try {
    const lastKnownKey = `mathquest_last_known_stars_${profileId}`;
    const lastKnown = Number(localStorage.getItem(lastKnownKey) ?? 0);
    const delta = currentTotalStars - lastKnown;
    if (delta > 0) {
      const today = new Date().toISOString().slice(0, 10);
      const dayKey = `mathquest_daily_stars_${profileId}_${today}`;
      const existing = Number(localStorage.getItem(dayKey) ?? 0);
      localStorage.setItem(dayKey, String(existing + delta));
      localStorage.setItem(lastKnownKey, String(currentTotalStars));
    }
  } catch {}
}

/** Return the last N days of daily star data as chart-ready array */
export function getDailyStarData(
  profileId: string,
  days = 14,
): Array<{ date: string; label: string; stars: number }> {
  const result: Array<{ date: string; label: string; stars: number }> = [];
  const now = new Date();
  const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    const label =
      i === 0 ? "Today" : i === 1 ? "Yesterday" : DAY_LABELS[d.getDay()];
    let stars = 0;
    try {
      stars = Number(
        localStorage.getItem(`mathquest_daily_stars_${profileId}_${dateStr}`) ??
          0,
      );
    } catch {}
    result.push({ date: dateStr, label, stars });
  }
  return result;
}

/** Get lessons completed in the last N days (uses speed-learner key) */
export function getLessonsThisWeek(profileId: string): number {
  if (!profileId) return 0;
  let total = 0;
  try {
    const now = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);
      const key = `mathquest_speed_${profileId}_${dateStr}`;
      total += Number(localStorage.getItem(key) ?? 0);
    }
  } catch {}
  return total;
}

/** Get stars earned in the last 7 days */
export function getStarsThisWeek(profileId: string): number {
  if (!profileId) return 0;
  let total = 0;
  try {
    const now = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);
      total += Number(
        localStorage.getItem(`mathquest_daily_stars_${profileId}_${dateStr}`) ??
          0,
      );
    }
  } catch {}
  return total;
}
