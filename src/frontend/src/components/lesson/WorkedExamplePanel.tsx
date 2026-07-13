import { motion } from "motion/react";
import React from "react";

interface WorkedStep {
  label: string;
  value: string;
}

interface WorkedExample {
  title: string;
  steps: WorkedStep[];
  visual?: string;
}

function detectExample(
  question: { type: string; question: string } | string,
): WorkedExample | null {
  // CQ-02: Accept question object so we can check type field first before text matching
  const text = typeof question === "string" ? question : question.question;
  const qType = typeof question === "string" ? "" : question.type;
  const q = text.toLowerCase();

  // ── Type-first routing (avoids false positives from keyword matching) ────
  if (qType === "trueFalse") {
    return {
      title: "True or False",
      visual: "🤔",
      steps: [
        { label: "How to decide", value: "Read the statement carefully" },
        {
          label: "Check",
          value: "Does it match what you learned in the lesson?",
        },
        {
          label: "Tip",
          value: "If you are not 100% sure, think of a counter-example ✓",
        },
      ],
    };
  }
  if (qType === "dragDrop") {
    return {
      title: "Drag and drop",
      visual: "🖐️",
      steps: [
        { label: "Step 1", value: "Read all the items before placing any" },
        {
          label: "Step 2",
          value: "Start with the item you are most confident about",
        },
        {
          label: "Tip",
          value:
            "If a slot doesn't look right, swap items until the pattern makes sense ✓",
        },
      ],
    };
  }
  if (qType === "fillIn") {
    return {
      title: "Fill in the blank",
      visual: "✏️",
      steps: [
        {
          label: "Step 1",
          value: "Read the full sentence with the blank included",
        },
        {
          label: "Step 2",
          value: "Think about what word or number fits the context",
        },
        {
          label: "Tip",
          value: "Say the completed sentence out loud — does it sound right? ✓",
        },
      ],
    };
  }

  // ── Fractions ────────────────────────────────────────────────────────────
  if (
    q.includes("fraction") ||
    q.includes("numerator") ||
    q.includes("denominator") ||
    q.includes("equivalent")
  ) {
    return {
      title: "Understanding fractions",
      visual: "🍕",
      steps: [
        { label: "Step 1", value: "A fraction shows part of a whole" },
        { label: "Step 2", value: "Top number (numerator) = parts you have" },
        { label: "Step 3", value: "Bottom number (denominator) = total parts" },
        { label: "Example", value: "1/4 means 1 out of 4 equal pieces ✓" },
      ],
    };
  }

  // ── Half / Quarter ───────────────────────────────────────────────────────
  if (q.includes("half") || q.includes("quarter") || q.match(/\d\/\d/)) {
    return {
      title: "Parts of a whole",
      visual: "🍰",
      steps: [
        { label: "Half", value: "1 piece out of 2 equal pieces = 1/2" },
        { label: "Quarter", value: "1 piece out of 4 equal pieces = 1/4" },
        { label: "Tip", value: "Bigger bottom number = smaller slice ✓" },
      ],
    };
  }

  // ── Addition ─────────────────────────────────────────────────────────────
  const addMatch = text.match(/(\d+)\s*\+\s*(\d+)/);
  if (addMatch) {
    const a = Number.parseInt(addMatch[1]);
    const b = Number.parseInt(addMatch[2]);
    return {
      title: "Adding numbers",
      visual: "➕",
      steps: [
        { label: "Step 1", value: `Start at ${a} on the number line` },
        { label: "Step 2", value: `Count forward ${b} steps` },
        { label: "Answer", value: `${a} + ${b} = ${a + b} ✓` },
      ],
    };
  }

  // ── Subtraction ──────────────────────────────────────────────────────────
  const subMatch = text.match(/(\d+)\s*[-−]\s*(\d+)/);
  if (subMatch) {
    const a = Number.parseInt(subMatch[1]);
    const b = Number.parseInt(subMatch[2]);
    return {
      title: "Subtracting numbers",
      visual: "➖",
      steps: [
        { label: "Step 1", value: `Start at ${a} on the number line` },
        { label: "Step 2", value: `Count back ${b} steps` },
        { label: "Answer", value: `${a} - ${b} = ${a - b} ✓` },
      ],
    };
  }

  // ── Multiplication ───────────────────────────────────────────────────────
  const mulMatch = text.match(/(\d+)\s*[×x*]\s*(\d+)/i);
  if (mulMatch) {
    const a = Number.parseInt(mulMatch[1]);
    const b = Number.parseInt(mulMatch[2]);
    return {
      title: "Multiplying numbers",
      visual: "✖️",
      steps: [
        { label: "Step 1", value: `Think of ${b} groups of ${a}` },
        {
          label: "Step 2",
          value: `Add: ${Array.from({ length: b }, () => a).join(" + ")} = ${a * b}`,
        },
        { label: "Answer", value: `${a} × ${b} = ${a * b} ✓` },
      ],
    };
  }

  // ── Division ─────────────────────────────────────────────────────────────
  const divMatch = text.match(/(\d+)\s*[÷/]\s*(\d+)/);
  if (divMatch) {
    const a = Number.parseInt(divMatch[1]);
    const b = Number.parseInt(divMatch[2]);
    return {
      title: "Dividing numbers",
      visual: "➗",
      steps: [
        { label: "Step 1", value: `Split ${a} into equal groups of ${b}` },
        { label: "Step 2", value: "Count how many groups you get" },
        { label: "Answer", value: `${a} ÷ ${b} = ${Math.floor(a / b)} ✓` },
      ],
    };
  }

  // ── Algebra / Variables ──────────────────────────────────────────────────
  if (
    q.includes("variable") ||
    q.includes("algebra") ||
    q.includes("solve") ||
    q.includes("equation") ||
    /\bx\b/.test(q)
  ) {
    return {
      title: "Solving with variables",
      visual: "🔢",
      steps: [
        { label: "Step 1", value: "A variable (like x) is a mystery number" },
        { label: "Step 2", value: "Ask: what number makes the equation true?" },
        {
          label: "Example",
          value: "x + 3 = 7 → x must be 4, because 4 + 3 = 7 ✓",
        },
      ],
    };
  }

  // ── Patterns / Sequences ─────────────────────────────────────────────────
  if (
    q.includes("pattern") ||
    q.includes("sequence") ||
    q.includes("next number") ||
    q.includes("what comes next")
  ) {
    return {
      title: "Finding the pattern",
      visual: "📈",
      steps: [
        { label: "Step 1", value: "Look at the gap between each number" },
        { label: "Step 2", value: "Is it always +2? +5? ×2? Spot the rule!" },
        {
          label: "Example",
          value: "2, 4, 6, 8 → +2 each time, so next is 10 ✓",
        },
      ],
    };
  }

  // ── Binary ───────────────────────────────────────────────────────────────
  if (q.includes("binary") || q.includes("base 2") || q.includes("1s and 0s")) {
    return {
      title: "Understanding binary",
      visual: "💻",
      steps: [
        { label: "Bit 1", value: "Each binary digit is a power of 2" },
        { label: "Bit 2", value: "Read right to left: 1, 2, 4, 8, 16…" },
        { label: "Example", value: "1010 = 8+0+2+0 = 10 in decimal ✓" },
      ],
    };
  }

  // ── Place Value / Base 10 ────────────────────────────────────────────────
  if (
    q.includes("place value") ||
    q.includes("hundreds") ||
    q.includes("tens") ||
    q.includes("ones") ||
    q.includes("base 10") ||
    q.includes("digit")
  ) {
    return {
      title: "Place value",
      visual: "🔟",
      steps: [
        { label: "Ones", value: "The rightmost digit — values 0–9" },
        { label: "Tens", value: "Second from right — worth 10× more" },
        {
          label: "Example",
          value: "In 345: 3 hundreds, 4 tens, 5 ones = 345 ✓",
        },
      ],
    };
  }

  // ── Perimeter / Area ─────────────────────────────────────────────────────
  if (q.includes("perimeter")) {
    return {
      title: "Finding the perimeter",
      visual: "📐",
      steps: [
        {
          label: "Step 1",
          value: "Perimeter = the total distance around a shape",
        },
        { label: "Step 2", value: "Add ALL the side lengths together" },
        { label: "Example", value: "Square with sides of 4 → 4+4+4+4 = 16 ✓" },
      ],
    };
  }

  if (q.includes("area")) {
    return {
      title: "Finding the area",
      visual: "📏",
      steps: [
        { label: "Step 1", value: "Area = the space inside a shape" },
        { label: "Step 2", value: "For a rectangle: length × width" },
        { label: "Example", value: "5 cm × 3 cm = 15 cm² ✓" },
      ],
    };
  }

  // ── Counting ─────────────────────────────────────────────────────────────
  if (q.includes("count") || q.includes("how many")) {
    return {
      title: "Counting carefully",
      visual: "🔢",
      steps: [
        { label: "Step 1", value: "Point to each object as you count it" },
        { label: "Step 2", value: "Say each number out loud: 1, 2, 3…" },
        { label: "Tip", value: "The last number you say = the total ✓" },
      ],
    };
  }

  // ── Ordering / Comparing ─────────────────────────────────────────────────
  if (
    q.includes("order") ||
    q.includes("arrange") ||
    q.includes("smallest") ||
    q.includes("largest") ||
    q.includes("biggest")
  ) {
    return {
      title: "Ordering numbers",
      visual: "📊",
      steps: [
        { label: "Step 1", value: "Find the smallest number first" },
        { label: "Step 2", value: "Then find the next smallest, and so on" },
        {
          label: "Example",
          value: "7, 2, 9, 4 → smallest to largest: 2, 4, 7, 9 ✓",
        },
      ],
    };
  }

  // ── Roman Numerals / History of Numbers ──────────────────────────────────
  if (q.includes("roman") || q.includes("numeral")) {
    return {
      title: "Roman numerals",
      visual: "🏛️",
      steps: [
        { label: "I", value: "I = 1, V = 5, X = 10, L = 50, C = 100" },
        {
          label: "Rule",
          value: "Smaller value before larger = subtract (IV = 4)",
        },
        { label: "Example", value: "VIII = 5+1+1+1 = 8, IX = 10-1 = 9 ✓" },
      ],
    };
  }

  // ── True / False reasoning ───────────────────────────────────────────────
  if (q.includes("true") || q.includes("false")) {
    return {
      title: "True or False?",
      visual: "🤔",
      steps: [
        { label: "Step 1", value: "Read the statement carefully" },
        {
          label: "Step 2",
          value: "Think: can you find an example where it's wrong?",
        },
        {
          label: "Tip",
          value: "If it's ALWAYS right → True. If even once wrong → False ✓",
        },
      ],
    };
  }

  // ── Times tables ─────────────────────────────────────────────────────────
  if (
    q.includes("times table") ||
    q.includes("multiply") ||
    q.includes("product")
  ) {
    return {
      title: "Times tables tip",
      visual: "✖️",
      steps: [
        { label: "Step 1", value: "Think of it as repeated addition" },
        { label: "Example", value: "3 × 4 = 3+3+3+3 = 12" },
        { label: "Tip", value: "Count up in the times table: 3, 6, 9, 12 ✓" },
      ],
    };
  }

  // ── Drag-drop ordering cue ───────────────────────────────────────────────
  if (
    q.includes("drag") ||
    q.includes("put in order") ||
    q.includes("arrange")
  ) {
    return {
      title: "Arranging in order",
      visual: "🔀",
      steps: [
        { label: "Step 1", value: "Read all the pieces before placing any" },
        { label: "Step 2", value: "Find the one that goes first" },
        {
          label: "Tip",
          value: "Work left to right — smallest or earliest first ✓",
        },
      ],
    };
  }

  // ── Complexity / Chaos ───────────────────────────────────────────────────
  if (
    q.includes("complex") ||
    q.includes("chaos") ||
    q.includes("system") ||
    q.includes("emerge")
  ) {
    return {
      title: "Complex systems",
      visual: "🌿",
      steps: [
        { label: "Idea", value: "Simple rules can create surprising patterns" },
        {
          label: "Example",
          value: "Each ant follows 2 rules → together they build a colony",
        },
        {
          label: "Tip",
          value: "Look for the simple rule behind the big result ✓",
        },
      ],
    };
  }

  // ── Generic fallback — always shows something ────────────────────────────
  return {
    title: "Break it down",
    visual: "💡",
    steps: [
      { label: "Step 1", value: "Read the question one word at a time" },
      { label: "Step 2", value: "Think about what you learned in the lesson" },
      { label: "Tip", value: "Eliminate answers you know are wrong first ✓" },
    ],
  };
}

export const WorkedExamplePanel = React.memo(function WorkedExamplePanel({
  questionText,
  questionType,
}: { questionText: string; questionType?: string }) {
  const example = detectExample(
    questionType
      ? { type: questionType, question: questionText }
      : questionText,
  );
  // With the generic fallback, this should never be null — but keep the guard
  if (!example) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-sm rounded-2xl p-4"
      style={{
        background: "linear-gradient(135deg, #FFF9E6 0%, #FFF4CC 100%)",
        border: "2px solid #FFD16666",
      }}
      data-ocid="lesson.worked_example.panel"
    >
      <div className="font-black text-[#B8860B] text-sm mb-2 flex items-center gap-1.5">
        {example.visual && <span aria-hidden="true">{example.visual}</span>}
        Let me show you how!
      </div>
      <div className="font-bold text-[#6B6B8A] text-xs mb-2 uppercase tracking-wide">
        {example.title}
      </div>
      <div className="space-y-1.5">
        {example.steps.map((step, i) => (
          <motion.div
            key={step.value}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.12, duration: 0.25 }}
            className="flex items-start gap-2 text-[#1A1A2E] text-sm font-semibold bg-white/70 rounded-xl px-3 py-1.5"
          >
            <span className="text-[#B8860B] font-black shrink-0 w-14 text-xs pt-0.5">
              {step.label}
            </span>
            <span className="leading-snug">{step.value}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
});
