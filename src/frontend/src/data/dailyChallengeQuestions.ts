import type { LessonQuestion } from "./lessons";

// Pool of daily challenge questions from all units
export const DAILY_CHALLENGE_POOL: LessonQuestion[] = [
  // Numbers
  {
    type: "multiChoice",
    text: "What comes after 9?",
    choices: ["8", "10", "11", "7"],
    correct: 1,
  },
  {
    type: "multiChoice",
    text: "How many fingers on two hands?",
    visual: "✋✋",
    choices: ["8", "9", "10", "12"],
    correct: 2,
  },
  { type: "trueFalse", text: "15 is bigger than 20.", isTrue: false },
  {
    type: "multiChoice",
    text: "What number is shown? 🔟",
    choices: ["8", "9", "10", "11"],
    correct: 2,
  },
  {
    type: "fillBlank",
    text: "Count the stars: ⭐⭐⭐⭐⭐ How many?",
    answer: "5",
    hint: "Count each star",
  },
  {
    type: "multiChoice",
    text: "Which number is the biggest?",
    choices: ["7", "12", "3", "9"],
    correct: 1,
  },
  {
    type: "trueFalse",
    text: "The number 0 means nothing (zero).",
    isTrue: true,
  },
  {
    type: "multiChoice",
    text: "What comes before 5?",
    choices: ["6", "4", "3", "7"],
    correct: 1,
  },

  // Addition & Subtraction
  {
    type: "multiChoice",
    text: "What is 3 + 4?",
    visual: "🍎🍎🍎 + 🍎🍎🍎🍎",
    choices: ["5", "6", "7", "8"],
    correct: 2,
  },
  {
    type: "fillBlank",
    text: "5 + 5 = ?",
    answer: "10",
    hint: "Count on 5 from 5",
  },
  {
    type: "multiChoice",
    text: "What is 10 - 3?",
    choices: ["5", "6", "7", "8"],
    correct: 2,
  },
  { type: "trueFalse", text: "2 + 2 = 5", isTrue: false },
  {
    type: "fillBlank",
    text: "8 - 3 = ?",
    answer: "5",
    hint: "Count back 3 from 8",
  },
  {
    type: "multiChoice",
    text: "What is 6 + 7?",
    choices: ["11", "12", "13", "14"],
    correct: 2,
  },
  {
    type: "trueFalse",
    text: "Adding zero to any number keeps it the same.",
    isTrue: true,
  },
  {
    type: "multiChoice",
    text: "15 - 8 = ?",
    choices: ["5", "6", "7", "8"],
    correct: 2,
  },

  // Multiplication
  {
    type: "multiChoice",
    text: "What is 3 × 4?",
    choices: ["10", "11", "12", "13"],
    correct: 2,
  },
  { type: "fillBlank", text: "5 × 2 = ?", answer: "10", hint: "2 groups of 5" },
  { type: "trueFalse", text: "3 × 0 = 3", isTrue: false },
  {
    type: "multiChoice",
    text: "What is 2 × 7?",
    choices: ["12", "13", "14", "15"],
    correct: 2,
  },
  {
    type: "multiChoice",
    text: "6 × 6 = ?",
    choices: ["30", "32", "36", "40"],
    correct: 2,
  },
  { type: "trueFalse", text: "4 × 5 = 5 × 4", isTrue: true },
  { type: "fillBlank", text: "3 × 3 = ?", answer: "9", hint: "3 groups of 3" },

  // Place Value
  {
    type: "multiChoice",
    text: "In 47, what is the tens digit?",
    choices: ["7", "4", "47", "10"],
    correct: 1,
  },
  {
    type: "trueFalse",
    text: "In 83, the 3 is in the tens place.",
    isTrue: false,
  },
  {
    type: "fillBlank",
    text: "How many tens in 60?",
    answer: "6",
    hint: "60 = 6 × 10",
  },
  {
    type: "multiChoice",
    text: "What is 3 tens and 5 ones?",
    choices: ["53", "35", "30", "53"],
    correct: 1,
  },
  {
    type: "multiChoice",
    text: "100 has how many zeros?",
    choices: ["1", "2", "3", "0"],
    correct: 1,
  },

  // Fractions
  {
    type: "multiChoice",
    text: "What fraction is shaded? 🍕 (half shaded)",
    choices: ["1/4", "1/2", "1/3", "2/3"],
    correct: 1,
  },
  { type: "trueFalse", text: "1/2 is bigger than 1/4.", isTrue: true },
  {
    type: "fillBlank",
    text: "A pizza cut into 4 equal slices — each slice is 1/?",
    answer: "4",
    hint: "4 equal pieces",
  },
  {
    type: "multiChoice",
    text: "Which fraction equals one half?",
    choices: ["2/3", "3/4", "2/4", "1/3"],
    correct: 2,
  },
  { type: "trueFalse", text: "3/3 equals 1 whole.", isTrue: true },

  // Algebra
  {
    type: "fillBlank",
    text: "If x + 3 = 7, what is x?",
    answer: "4",
    hint: "7 - 3 = ?",
  },
  {
    type: "multiChoice",
    text: "What comes next? 2, 4, 6, ?",
    choices: ["7", "8", "9", "10"],
    correct: 1,
  },
  {
    type: "trueFalse",
    text: "In a pattern 1, 3, 5, 7 — the next number is 9.",
    isTrue: true,
  },
  {
    type: "multiChoice",
    text: "If y = 5, what is y + 4?",
    choices: ["8", "9", "10", "11"],
    correct: 1,
  },
  {
    type: "fillBlank",
    text: "? - 6 = 4. What is the missing number?",
    answer: "10",
    hint: "4 + 6 = ?",
  },

  // History of Numbers
  {
    type: "multiChoice",
    text: "The Romans used letters as numbers. What is V?",
    choices: ["4", "5", "6", "10"],
    correct: 1,
  },
  {
    type: "trueFalse",
    text: "Zero was invented in Ancient India.",
    isTrue: true,
  },
  {
    type: "multiChoice",
    text: "What does X mean in Roman numerals?",
    choices: ["5", "9", "10", "11"],
    correct: 2,
  },
  {
    type: "trueFalse",
    text: "Ancient Egyptians used a number system.",
    isTrue: true,
  },

  // Complexity Science
  {
    type: "multiChoice",
    text: "Fibonacci sequence: 1, 1, 2, 3, 5, ?",
    choices: ["6", "7", "8", "9"],
    correct: 2,
  },
  {
    type: "trueFalse",
    text: "A butterfly flapping wings could affect weather far away (butterfly effect).",
    isTrue: true,
  },
  {
    type: "multiChoice",
    text: "What are the chances of flipping heads on a fair coin?",
    choices: ["1 in 4", "1 in 2", "1 in 3", "1 in 6"],
    correct: 1,
  },
  {
    type: "trueFalse",
    text: "Symmetry means both halves look exactly the same.",
    isTrue: true,
  },
  {
    type: "multiChoice",
    text: "In Fibonacci: 1,1,2,3,5,8 — what comes next?",
    choices: ["11", "12", "13", "14"],
    correct: 2,
  },
  // Sprint 18: Additional variety
  {
    type: "multiChoice",
    text: "If x = 5, what is x + 7?",
    choices: ["10", "11", "12", "13"],
    correct: 2,
  },
  {
    type: "trueFalse",
    text: "A square has 4 equal sides.",
    isTrue: true,
  },
  {
    type: "multiChoice",
    text: "What is the value of 3² (3 squared)?",
    choices: ["6", "9", "8", "12"],
    correct: 1,
  },
  {
    type: "multiChoice",
    text: "Which Roman numeral stands for 10?",
    choices: ["V", "I", "X", "L"],
    correct: 2,
  },
  {
    type: "multiChoice",
    text: "What is the missing number: 3, 6, ___, 12, 15?",
    choices: ["7", "8", "9", "10"],
    correct: 2,
  },
  {
    type: "trueFalse",
    text: "Zero was invented by the ancient Romans.",
    isTrue: false,
  },
  {
    type: "multiChoice",
    text: "A pie is cut into 8 equal slices. You eat 3. What fraction is left?",
    choices: ["3/8", "5/8", "1/2", "1/4"],
    correct: 1,
  },
  {
    type: "trueFalse",
    text: "Multiplying any number by 0 always gives 0.",
    isTrue: true,
  },
];

/**
 * Get today's daily challenge questions (7 per day, seeded by date)
 */
export function getTodaysChallengeQuestions(): LessonQuestion[] {
  const today = new Date();
  const seed =
    today.getFullYear() * 10000 +
    (today.getMonth() + 1) * 100 +
    today.getDate();

  // Simple seeded shuffle
  const pool = [...DAILY_CHALLENGE_POOL];
  let s = seed;
  for (let i = pool.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) & 0x7fffffff;
    const j = s % (i + 1);
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  // Return first 7, filter out slides
  return pool.filter((q) => q.type !== "slide").slice(0, 7);
}

/**
 * Returns a string like "2026-03-17" for today
 */
export function getTodayKey(): string {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
}

/**
 * How many ms until midnight (next reset)
 */
export function getMsUntilMidnight(): number {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  return midnight.getTime() - now.getTime();
}
