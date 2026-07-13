import { EXTRA_LESSONS } from "./lessonsExtra";

export type QuestionType =
  | "multiChoice"
  | "slide"
  | "trueFalse"
  | "fillBlank"
  | "dragDrop";

export interface LessonQuestion {
  type: QuestionType;
  text: string;
  visual?: string;
  choices?: string[];
  correct?: number;
  slideText?: string;
  isTrue?: boolean;
  answer?: string;
  hint?: string;
  dragItems?: string[];
  dragTarget?: string[];
}

export interface LessonData {
  unitIndex: number;
  lessonIndex: number;
  title: string;
  questions: LessonQuestion[];
}

export const LESSONS: LessonData[] = [
  // Unit 0
  {
    unitIndex: 0,
    lessonIndex: 0,
    title: "How to Use This App",
    questions: [
      {
        type: "slide",
        text: "Welcome to MathSpark! 🤖",
        slideText:
          "I'm your robot tutor! I'll guide you through fun math lessons step by step.",
      },
      {
        type: "slide",
        text: "Tap the right answer!",
        slideText:
          "Each question has 4 choices. Tap the one you think is correct. Don't worry — you can always try again!",
      },
      {
        type: "slide",
        text: "Earn Stars! ⭐",
        slideText:
          "Get 3 stars for getting most answers right on your first try. The more you practice, the better you'll get!",
      },
      {
        type: "slide",
        text: "Unlock new units!",
        slideText:
          "Complete each unit to unlock the next one. Work your way through all 9 units!",
      },
      {
        type: "slide",
        text: "You're ready!",
        slideText:
          "Let's start learning. Head to Unit 1: Numbers to begin your first real lesson!",
      },
    ],
  },
  // Unit 1
  {
    unitIndex: 1,
    lessonIndex: 0,
    title: "Counting Objects",
    questions: [
      {
        type: "slide",
        text: "Why counting matters",
        slideText:
          "We count things every day — toys, apples, steps, and friends! Knowing how to count is the very first step to all maths.",
      },
      {
        type: "multiChoice",
        text: "How many apples are there?",
        visual: "🍎🍎🍎",
        choices: ["1", "2", "3", "4"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "How many stars can you count?",
        visual: "⭐⭐⭐⭐⭐",
        choices: ["3", "4", "5", "6"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "Count the balloons!",
        visual: "🎈🎈",
        choices: ["1", "2", "3", "4"],
        correct: 1,
      },
      {
        type: "multiChoice",
        text: "How many fish?",
        visual: "🐟🐟🐟🐟",
        choices: ["2", "3", "4", "5"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "Count the flowers!",
        visual: "🌸🌸🌸🌸🌸🌸",
        choices: ["4", "5", "6", "7"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "How many hearts?",
        visual: "❤️❤️❤️",
        choices: ["2", "3", "4", "5"],
        correct: 1,
      },
      {
        type: "multiChoice",
        text: "Count the cats!",
        visual: "🐱🐱🐱🐱🐱",
        choices: ["3", "4", "5", "6"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "How many moons?",
        visual: "🌙🌙",
        choices: ["1", "2", "3", "4"],
        correct: 1,
      },
      {
        type: "trueFalse",
        text: "There are 10 fingers on two hands.",
        isTrue: true,
      },
      {
        type: "fillBlank",
        text: "How many legs does a dog have?",
        answer: "4",
        hint: "Type a number",
      },
      {
        type: "slide",
        text: "Well done! \ud83c\udf1f",
        slideText:
          "You just practised counting — a skill you'll use your whole life, from counting money to measuring ingredients. Great work!",
      },
    ],
  },
  {
    unitIndex: 1,
    lessonIndex: 1,
    title: "Number Recognition",
    questions: [
      {
        type: "slide",
        text: "Why we name numbers",
        slideText:
          "Every number has a name and a symbol. Recognising them is how we read prices, scores, ages, and everything else with numbers.",
      },
      {
        type: "multiChoice",
        text: "What number is this?",
        visual: "4",
        choices: ["three", "four", "five", "two"],
        correct: 1,
      },
      {
        type: "multiChoice",
        text: "What number is this?",
        visual: "7",
        choices: ["six", "eight", "seven", "nine"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "What number is this?",
        visual: "2",
        choices: ["one", "three", "four", "two"],
        correct: 3,
      },
      {
        type: "multiChoice",
        text: "What number is this?",
        visual: "9",
        choices: ["eight", "nine", "ten", "seven"],
        correct: 1,
      },
      {
        type: "multiChoice",
        text: "What number is this?",
        visual: "5",
        choices: ["four", "six", "five", "three"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "What number is this?",
        visual: "1",
        choices: ["two", "three", "one", "four"],
        correct: 2,
      },
      { type: "trueFalse", text: "The number 7 comes before 8.", isTrue: true },
      { type: "trueFalse", text: "5 is bigger than 9.", isTrue: false },
      {
        type: "slide",
        text: "Well done! \ud83c\udf1f",
        slideText:
          "You can now match number symbols to their names — a skill you'll use every time you read a price tag, a score, or a page number.",
      },
    ],
  },
  {
    unitIndex: 1,
    lessonIndex: 2,
    title: "Number Order",
    questions: [
      {
        type: "slide",
        text: "Why the order of numbers matters",
        slideText:
          "Numbers go in a set order: 1, 2, 3... Knowing their order helps you count, compare sizes, and understand sequences in real life.",
      },
      {
        type: "multiChoice",
        text: "What comes next? 1, 2, 3, ___",
        choices: ["2", "4", "5", "1"],
        correct: 1,
      },
      {
        type: "multiChoice",
        text: "Fill in the blank: 3, ___, 5",
        choices: ["2", "4", "6", "3"],
        correct: 1,
      },
      {
        type: "multiChoice",
        text: "What number is missing? 6, 7, ___, 9",
        choices: ["5", "10", "8", "6"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "What comes before 5? ___, 5, 6",
        choices: ["3", "4", "6", "2"],
        correct: 1,
      },
      {
        type: "multiChoice",
        text: "Fill in the blank: 8, 9, ___, 11",
        choices: ["7", "12", "10", "13"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "What comes next? 0, 1, 2, ___",
        choices: ["4", "1", "3", "0"],
        correct: 2,
      },
      {
        type: "fillBlank",
        text: "What number comes after 9?",
        answer: "10",
        hint: "Type a number",
      },
      {
        type: "trueFalse",
        text: "3 comes before 2 on a number line.",
        isTrue: false,
      },
      {
        type: "slide",
        text: "Well done! \ud83c\udf1f",
        slideText:
          "Knowing number order helps you read ages, tell who won a race, and understand sequences in nature. Well done!",
      },
    ],
  },
  {
    unitIndex: 1,
    lessonIndex: 3,
    title: "Comparing Numbers",
    questions: [
      {
        type: "slide",
        text: "Why we compare numbers",
        slideText:
          "Which bag has more sweets? Which score is higher? Comparing numbers helps us make decisions and understand the world around us.",
      },
      {
        type: "multiChoice",
        text: "Which is bigger?",
        choices: ["5", "3", "they're equal", "can't tell"],
        correct: 0,
      },
      {
        type: "multiChoice",
        text: "Which is smaller?",
        choices: ["8", "2", "they're equal", "can't tell"],
        correct: 1,
      },
      {
        type: "multiChoice",
        text: "Is 6 bigger or smaller than 4?",
        choices: ["smaller", "bigger", "equal", "different"],
        correct: 1,
      },
      {
        type: "multiChoice",
        text: "Which number is greater: 7 or 9?",
        choices: ["7", "9", "same", "neither"],
        correct: 1,
      },
      {
        type: "multiChoice",
        text: "Which is the smallest: 1, 5, or 3?",
        choices: ["5", "3", "1", "all equal"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "Which is bigger: 10 or 6?",
        choices: ["6", "10", "same", "can't tell"],
        correct: 1,
      },
      {
        type: "slide",
        text: "Well done! \ud83c\udf1f",
        slideText:
          "You can now compare numbers to decide which is bigger or smaller — useful for shopping, sport scores, and sharing things fairly.",
      },
    ],
  },
  {
    unitIndex: 1,
    lessonIndex: 4,
    title: "The Number Line",
    questions: [
      {
        type: "slide",
        text: "Why the number line is so useful",
        slideText:
          "A number line shows all numbers in order. It helps us see how far apart numbers are and makes addition and subtraction visual and easy.",
      },
      {
        type: "multiChoice",
        text: "On the number line 0–10, where is 5?",
        choices: ["At the start", "In the middle", "At the end", "Past 10"],
        correct: 1,
      },
      {
        type: "multiChoice",
        text: "What number comes right after 3 on the number line?",
        choices: ["2", "5", "4", "6"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "What number is between 6 and 8?",
        choices: ["5", "9", "7", "10"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "If you start at 2 and jump 3 steps forward, where do you land?",
        choices: ["4", "6", "5", "3"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "What number is right before 10 on the number line?",
        choices: ["8", "7", "9", "11"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "Starting at 0, count 4 jumps. Where do you end up?",
        choices: ["3", "5", "4", "6"],
        correct: 2,
      },
      {
        type: "slide",
        text: "Well done! \ud83c\udf1f",
        slideText:
          "The number line is a tool mathematicians use their whole lives — you will see it in graphs, temperature scales, and timelines. Great effort!",
      },
    ],
  },
  {
    unitIndex: 1,
    lessonIndex: 5,
    title: "Skip Counting",
    questions: [
      {
        type: "slide",
        text: "Why skip counting is a superpower",
        slideText:
          "Skip counting means jumping by 2s, 5s, or 10s instead of counting one by one. It is the fastest way to count large groups — and it leads straight to multiplication!",
      },
      {
        type: "multiChoice",
        text: "Count by 2s: 2, 4, ___, 8",
        choices: ["5", "7", "6", "3"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "Count by 5s: 5, 10, ___, 20",
        choices: ["12", "14", "15", "16"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "Count by 2s: 6, 8, ___, 12",
        choices: ["9", "10", "11", "13"],
        correct: 1,
      },
      {
        type: "multiChoice",
        text: "Count by 5s: 0, 5, 10, ___",
        choices: ["12", "20", "15", "14"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "Count by 2s: 10, 12, ___, 16",
        choices: ["13", "14", "15", "11"],
        correct: 1,
      },
      {
        type: "multiChoice",
        text: "Count by 10s: 10, 20, ___, 40",
        choices: ["25", "35", "30", "31"],
        correct: 2,
      },
      {
        type: "dragDrop",
        text: "Put these numbers in order from smallest to largest!",
        dragItems: ["4", "1", "3", "2"],
        dragTarget: ["1", "2", "3", "4"],
      },
      {
        type: "slide",
        text: "Well done! \ud83c\udf1f",
        slideText:
          "Skip counting is the first step towards multiplication. You will use it whenever you count coins, tell the time, or work with patterns. Brilliant!",
      },
    ],
  },

  // ── Unit 2: Addition & Subtraction ─────────────────────────────────────────
  {
    unitIndex: 2,
    lessonIndex: 0,
    title: "What Is Addition?",
    questions: [
      {
        type: "slide",
        text: "Why addition is everywhere",
        slideText:
          "Whenever you combine things — putting toys in a box, adding up scores, or counting how many people are at a party — you are adding. Addition is the foundation of all maths.",
      },
      {
        type: "slide",
        text: "Addition means putting things together! ➕",
        slideText:
          "When you have some things and get more, you ADD them. 3 apples + 2 apples = 5 apples!",
      },
      {
        type: "multiChoice",
        text: "What is 1 + 1?",
        visual: "🍎 + 🍎",
        choices: ["1", "2", "3", "4"],
        correct: 1,
      },
      {
        type: "multiChoice",
        text: "What is 2 + 1?",
        visual: "🐱🐱 + 🐱",
        choices: ["2", "4", "3", "1"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "What is 3 + 2?",
        visual: "⭐⭐⭐ + ⭐⭐",
        choices: ["4", "6", "5", "3"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "What is 4 + 1?",
        choices: ["4", "6", "3", "5"],
        correct: 3,
      },
      {
        type: "multiChoice",
        text: "What is 2 + 3?",
        choices: ["4", "5", "6", "3"],
        correct: 1,
      },
      {
        type: "multiChoice",
        text: "What is 5 + 5?",
        visual: "🌟🌟🌟🌟🌟 + 🌟🌟🌟🌟🌟",
        choices: ["8", "9", "11", "10"],
        correct: 3,
      },
      {
        type: "trueFalse",
        text: "Addition makes numbers bigger.",
        isTrue: true,
      },
      {
        type: "fillBlank",
        text: "What is 2 + 2?",
        answer: "4",
        hint: "Type a number",
      },
      {
        type: "slide",
        text: "Well done! \ud83c\udf1f",
        slideText:
          "You now understand what addition means and how it works. You will use it every single day — at the shops, in games, and in recipes. Amazing!",
      },
    ],
  },
  {
    unitIndex: 2,
    lessonIndex: 1,
    title: "Addition with Ten Frames",
    questions: [
      {
        type: "slide",
        text: "Why ten frames make adding easier",
        slideText:
          "Ten frames are a visual tool to organise numbers up to 10. They help your brain see amounts at a glance — the same way an egg carton helps you see how many eggs are left.",
      },
      {
        type: "slide",
        text: "Ten frames help us count! 🔢",
        slideText:
          "A ten frame has 10 boxes. Fill boxes from left to right. Count the filled boxes to find the total!",
      },
      {
        type: "multiChoice",
        text: "A ten frame has 3 dots. How many empty boxes?",
        choices: ["5", "7", "8", "6"],
        correct: 1,
      },
      {
        type: "multiChoice",
        text: "Fill 4 + 3 on a ten frame. How many dots total?",
        choices: ["6", "8", "7", "9"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "Fill 5 + 4 on a ten frame. How many dots?",
        choices: ["8", "10", "9", "7"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "A ten frame has 6 dots. You add 3 more. Total?",
        choices: ["8", "10", "9", "7"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "Fill 5 + 5 on a ten frame. How many dots?",
        choices: ["8", "9", "11", "10"],
        correct: 3,
      },
      {
        type: "multiChoice",
        text: "7 dots in a ten frame. How many empty boxes?",
        choices: ["2", "4", "3", "1"],
        correct: 2,
      },
      {
        type: "fillBlank",
        text: "A ten frame has ___ spaces.",
        answer: "10",
        hint: "Type a number",
      },
      { type: "trueFalse", text: "5 + 5 = 10", isTrue: true },
      {
        type: "slide",
        text: "Well done! \ud83c\udf1f",
        slideText:
          "Ten frames train your brain to recognise amounts instantly — a skill called subitising that helps with mental maths for life. Excellent!",
      },
    ],
  },
  {
    unitIndex: 2,
    lessonIndex: 2,
    title: "Number Bonds",
    questions: [
      {
        type: "slide",
        text: "Why number bonds speed up maths",
        slideText:
          "Number bonds are pairs that add up to a number. Knowing that 3 + 7 = 10 instantly means you never have to count on your fingers — you just know it!",
      },
      {
        type: "slide",
        text: "Number bonds show how numbers split! 🔗",
        slideText:
          "5 can be split into 2 and 3. Or 1 and 4. Or 0 and 5. These pairs that make a number are called number bonds!",
      },
      {
        type: "multiChoice",
        text: "5 = 2 + ___",
        choices: ["2", "4", "3", "1"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "6 = 4 + ___",
        choices: ["3", "1", "2", "4"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "8 = 5 + ___",
        choices: ["4", "2", "3", "1"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "10 = 7 + ___",
        choices: ["2", "4", "3", "5"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "9 = ___ + 6",
        choices: ["4", "2", "3", "5"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "7 = 3 + ___",
        choices: ["3", "5", "4", "2"],
        correct: 2,
      },
      {
        type: "slide",
        text: "Well done! \ud83c\udf1f",
        slideText:
          "Memorising number bonds means faster mental maths. When you know 4 + 6 = 10 by heart, all harder addition becomes quick and easy. Super work!",
      },
    ],
  },
  {
    unitIndex: 2,
    lessonIndex: 3,
    title: "Adding on a Number Line",
    questions: [
      {
        type: "slide",
        text: "Why we add on a number line",
        slideText:
          "The number line turns addition into movement — jump forward and land on the answer. This same idea is used in measuring distances and reading temperatures.",
      },
      {
        type: "slide",
        text: "Jump forward to add! ➡️",
        slideText:
          "To add on a number line, start at the first number and jump forward. 3 + 4 means start at 3 and jump 4 spaces!",
      },
      {
        type: "multiChoice",
        text: "Start at 2, jump 3 forward. Where do you land?",
        choices: ["4", "6", "5", "3"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "Start at 4, jump 5 forward. Where do you land?",
        choices: ["8", "10", "9", "7"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "Start at 0, jump 7 forward. Where do you land?",
        choices: ["6", "8", "5", "7"],
        correct: 3,
      },
      {
        type: "multiChoice",
        text: "6 + 3 = ___",
        choices: ["8", "10", "9", "7"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "5 + 6 = ___",
        choices: ["10", "12", "11", "9"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "7 + 4 = ___",
        choices: ["10", "12", "11", "9"],
        correct: 2,
      },
      {
        type: "slide",
        text: "Well done! \ud83c\udf1f",
        slideText:
          "Adding on a number line builds a physical sense of how numbers grow. You will use this mental picture for bigger numbers and decimals too. Well done!",
      },
    ],
  },
  {
    unitIndex: 2,
    lessonIndex: 4,
    title: "What Is Subtraction?",
    questions: [
      {
        type: "slide",
        text: "Why subtraction matters every day",
        slideText:
          "Subtraction is taking away. You use it when you spend money, eat food, or use up supplies. It tells you what is left — and that matters in real life every day.",
      },
      {
        type: "slide",
        text: "Subtraction means taking away! ➖",
        slideText:
          "If you have 5 apples and eat 2, you take away 2. 5 − 2 = 3. Subtraction is the opposite of addition!",
      },
      {
        type: "multiChoice",
        text: "What is 3 − 1?",
        visual: "🍎🍎🍎",
        choices: ["1", "3", "2", "4"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "What is 5 − 2?",
        visual: "⭐⭐⭐⭐⭐",
        choices: ["4", "2", "3", "1"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "What is 6 − 3?",
        choices: ["2", "4", "3", "1"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "What is 8 − 5?",
        choices: ["2", "4", "3", "1"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "What is 10 − 4?",
        choices: ["5", "7", "6", "8"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "What is 9 − 9?",
        choices: ["1", "9", "0", "2"],
        correct: 2,
      },
      {
        type: "trueFalse",
        text: "Subtraction makes numbers smaller.",
        isTrue: true,
      },
      {
        type: "fillBlank",
        text: "What is 5 - 5?",
        answer: "0",
        hint: "Type a number",
      },
      {
        type: "slide",
        text: "Well done! \ud83c\udf1f",
        slideText:
          "You now understand subtraction — the opposite of addition. You will use it every time you make change, check how much is left, or compare two amounts. Fantastic!",
      },
    ],
  },
  {
    unitIndex: 2,
    lessonIndex: 5,
    title: "Subtraction on a Number Line",
    questions: [
      {
        type: "slide",
        text: "Why we subtract on a number line",
        slideText:
          "Jumping backward on a number line shows subtraction visually. This is the same idea used when counting down, measuring differences, or tracking how much has been used.",
      },
      {
        type: "slide",
        text: "Jump backward to subtract! ⬅️",
        slideText:
          "To subtract on a number line, start at the first number and jump BACKWARD. 7 − 3 means start at 7 and jump 3 spaces back!",
      },
      {
        type: "multiChoice",
        text: "Start at 5, jump 2 back. Where do you land?",
        choices: ["4", "2", "3", "1"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "Start at 8, jump 3 back. Where do you land?",
        choices: ["4", "6", "5", "7"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "7 − 4 = ___",
        choices: ["2", "4", "3", "1"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "10 − 6 = ___",
        choices: ["3", "5", "4", "6"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "9 − 2 = ___",
        choices: ["6", "8", "7", "5"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "12 − 5 = ___",
        choices: ["6", "8", "7", "5"],
        correct: 2,
      },
      {
        type: "slide",
        text: "Well done! \ud83c\udf1f",
        slideText:
          "Subtracting on a number line builds a strong mental picture of taking away. This skill supports negative numbers and algebra later on. Great effort!",
      },
    ],
  },
  {
    unitIndex: 2,
    lessonIndex: 6,
    title: "Fact Families",
    questions: [
      {
        type: "slide",
        text: "Why fact families save time",
        slideText:
          "Addition and subtraction are connected. If you know 3 + 4 = 7, you automatically know 7 - 4 = 3. Fact families show these connections so you learn four facts at once!",
      },
      {
        type: "slide",
        text: "Addition and subtraction are a family! 👨‍👩‍👧‍👦",
        slideText:
          "3, 4, and 7 are a fact family: 3+4=7, 4+3=7, 7−3=4, 7−4=3. These 4 facts all use the same numbers!",
      },
      {
        type: "multiChoice",
        text: "If 2 + 5 = 7, what is 7 − 5?",
        choices: ["3", "5", "2", "4"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "If 6 + 4 = 10, what is 10 − 4?",
        choices: ["4", "6", "5", "3"],
        correct: 1,
      },
      {
        type: "multiChoice",
        text: "If 3 + 8 = 11, what is 11 − 3?",
        choices: ["7", "9", "8", "6"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "Which fact belongs in this family? 2, 9, 11",
        choices: ["2 + 11 = 13", "9 − 2 = 7", "9 + 2 = 11", "11 + 2 = 13"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "If 5 + 7 = 12, what is 12 − 7?",
        choices: ["6", "4", "5", "7"],
        correct: 2,
      },
      {
        type: "slide",
        text: "Well done! \ud83c\udf1f",
        slideText:
          "Understanding fact families means one piece of knowledge unlocks four related facts. This is how mathematicians think efficiently — brilliant work!",
      },
    ],
  },
  {
    unitIndex: 2,
    lessonIndex: 7,
    title: "Word Problems",
    questions: [
      {
        type: "slide",
        text: "Why word problems are real-life maths",
        slideText:
          "Maths is not just numbers on a page — it solves real problems. Word problems train you to read a situation, pull out the numbers, and decide what operation to use. A skill for life.",
      },
      {
        type: "multiChoice",
        text: "Mia has 3 balloons. She gets 4 more. How many does she have?",
        visual: "🎈🎈🎈 + 🎈🎈🎈🎈",
        choices: ["6", "8", "7", "5"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "There are 9 birds on a tree. 3 fly away. How many are left?",
        visual: "🐦🐦🐦🐦🐦🐦🐦🐦🐦",
        choices: ["5", "7", "6", "4"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "Jake had 6 cookies. He ate 2. How many are left?",
        choices: ["3", "5", "4", "2"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "Lily has 5 red flowers and 4 yellow flowers. How many in total?",
        choices: ["8", "10", "9", "7"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "Tom scored 8 points. Ava scored 3 fewer. How many did Ava score?",
        choices: ["4", "6", "5", "3"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "A bag had 12 sweets. Sam ate 5. How many sweets are left?",
        choices: ["6", "8", "7", "5"],
        correct: 2,
      },
      {
        type: "dragDrop",
        text: "Put these numbers in order from smallest to largest!",
        dragItems: ["12", "5", "8", "3"],
        dragTarget: ["3", "5", "8", "12"],
      },
      {
        type: "slide",
        text: "Well done! \ud83c\udf1f",
        slideText:
          "You have practised translating words into maths — exactly what you do when budgeting, planning, or solving everyday problems. This is maths at its most useful. Well done!",
      },
    ],
  },

  // ── Unit 3: Multiplication ──────────────────────────────────────────────────
  {
    unitIndex: 3,
    lessonIndex: 0,
    title: "Repeat Addition",
    questions: [
      {
        type: "slide",
        text: "Why multiplication starts with adding",
        slideText:
          "When you add the same number again and again — like 5 + 5 + 5 — it gets slow. Multiplication is the shortcut! 5 x 3 is faster and means exactly the same thing.",
      },
      {
        type: "slide",
        text: "Multiplication is fast addition! 🚀",
        slideText:
          "3 × 4 means adding 4 three times: 4 + 4 + 4 = 12. It's a shortcut for adding the same number over and over!",
      },
      {
        type: "multiChoice",
        text: "2 + 2 + 2 is the same as ___",
        choices: ["2 × 2", "3 × 3", "2 × 3", "6 × 1"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "5 + 5 = 2 × ___",
        choices: ["2", "10", "5", "4"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "3 × 4 = 4 + 4 + ___",
        choices: ["3", "8", "4", "6"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "What is 2 × 5?",
        choices: ["8", "12", "10", "7"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "What is 3 × 3?",
        visual: "⭐⭐⭐  ⭐⭐⭐  ⭐⭐⭐",
        choices: ["6", "8", "9", "12"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "What is 4 × 2?",
        visual: "🍎🍎  🍎🍎  🍎🍎  🍎🍎",
        choices: ["6", "10", "8", "4"],
        correct: 2,
      },
      {
        type: "trueFalse",
        text: "3 + 3 + 3 is the same as 3 × 3.",
        isTrue: true,
      },
      {
        type: "fillBlank",
        text: "What is 2 + 2 + 2? (Hint: 3 groups of 2)",
        answer: "6",
        hint: "Type a number",
      },
      {
        type: "slide",
        text: "Well done! \ud83c\udf1f",
        slideText:
          "You have discovered that multiplication is just fast repeated addition. This idea powers everything from cooking to architecture. Incredible start!",
      },
    ],
  },
  {
    unitIndex: 3,
    lessonIndex: 1,
    title: "Arrays",
    questions: [
      {
        type: "slide",
        text: "Why arrays are everywhere",
        slideText:
          "Eggs in a carton, seats in a cinema, tiles on a floor — these are all arrays! Arrays show multiplication as rows and columns, making it visual and easy to understand.",
      },
      {
        type: "slide",
        text: "Arrays are rows and columns! 🔲",
        slideText:
          "An array is objects arranged in equal rows and columns. 2 rows of 3 dots = 2 × 3 = 6. Count the rows, then the columns!",
      },
      {
        type: "multiChoice",
        text: "An array has 3 rows and 2 columns. How many dots total?",
        choices: ["4", "8", "6", "5"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "An array has 4 rows and 3 columns. What multiplication does this show?",
        choices: ["3 × 3", "4 × 4", "4 × 3", "3 × 2"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "An array shows 2 × 5. How many dots are there?",
        choices: ["7", "9", "10", "8"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "Which array shows 3 × 4?",
        choices: ["3 rows of 3", "4 rows of 4", "3 rows of 4", "4 rows of 3"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "An array has 5 rows and 2 columns. How many dots?",
        choices: ["7", "9", "10", "8"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "Does swapping rows and columns change the answer? 2×4 vs 4×2",
        choices: [
          "Yes, different",
          "Only sometimes",
          "No, same answer",
          "Can't tell",
        ],
        correct: 2,
      },
      {
        type: "slide",
        text: "Well done! \ud83c\udf1f",
        slideText:
          "Arrays are multiplication made visible. Every time you see a grid — a chessboard, a building's windows, a seating plan — you are looking at an array. Well done!",
      },
    ],
  },
  {
    unitIndex: 3,
    lessonIndex: 2,
    title: "Multiplication on a Number Line",
    questions: [
      {
        type: "slide",
        text: "Why equal jumps show multiplication",
        slideText:
          "Multiplication means making equal jumps — 3 x 4 is three jumps of four. This same idea explains how odometers work, how time passes in equal intervals, and how patterns grow.",
      },
      {
        type: "slide",
        text: "Equal jumps on a number line! 🦘",
        slideText:
          "3 × 4 means making 3 equal jumps of 4 on a number line. Start at 0, jump 4... 4... 4. Land on 12!",
      },
      {
        type: "multiChoice",
        text: "Make 2 jumps of 5. Where do you land?",
        choices: ["7", "12", "10", "8"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "Make 3 jumps of 3. Where do you land?",
        choices: ["6", "12", "9", "8"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "4 × 2: start at 0, make 4 jumps of 2. Answer?",
        choices: ["6", "10", "8", "4"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "5 × 3 = ___",
        choices: ["12", "16", "15", "18"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "2 × 6 = ___",
        choices: ["10", "14", "12", "8"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "3 × 5 = ___",
        choices: ["12", "16", "15", "18"],
        correct: 2,
      },
      {
        type: "slide",
        text: "Well done! \ud83c\udf1f",
        slideText:
          "You can now see multiplication as equal jumps — this picture helps with skip counting, scaling, and even understanding music rhythms. Great work!",
      },
    ],
  },
  {
    unitIndex: 3,
    lessonIndex: 3,
    title: "Times Tables",
    questions: [
      {
        type: "slide",
        text: "Why knowing times tables by heart matters",
        slideText:
          "Times tables are multiplication facts you should know instantly — like knowing your own phone number. They speed up all maths and free your brain for harder thinking.",
      },
      {
        type: "slide",
        text: "Times tables are super useful! 📋",
        slideText:
          "Knowing your times tables by heart makes maths much faster. Let's practice the 2s, 5s, and 10s — they're the easiest to start with!",
      },
      {
        type: "multiChoice",
        text: "2 × 7 = ___",
        choices: ["12", "16", "14", "9"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "5 × 6 = ___",
        choices: ["25", "35", "30", "20"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "10 × 4 = ___",
        choices: ["30", "50", "40", "44"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "2 × 9 = ___",
        choices: ["16", "20", "18", "14"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "5 × 8 = ___",
        choices: ["35", "45", "40", "30"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "10 × 7 = ___",
        choices: ["60", "80", "70", "77"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "3 × 6 = ___",
        choices: ["15", "21", "18", "24"],
        correct: 2,
      },
      {
        type: "fillBlank",
        text: "What is 2 × 5?",
        answer: "10",
        hint: "Type a number",
      },
      { type: "trueFalse", text: "5 × 4 = 20", isTrue: true },
      {
        type: "slide",
        text: "Well done! \ud83c\udf1f",
        slideText:
          "Memorising times tables is like loading shortcuts into your brain. Every maths problem you will ever solve will be faster because of this practice. Superb!",
      },
    ],
  },
  {
    unitIndex: 3,
    lessonIndex: 4,
    title: "The Multiplication Grid",
    questions: [
      {
        type: "slide",
        text: "Why the multiplication grid is a powerful tool",
        slideText:
          "A multiplication grid is like a map of all multiplication facts. Scientists, engineers, and builders use grids to find values quickly without recalculating every time.",
      },
      {
        type: "slide",
        text: "A multiplication grid holds all the answers! 🔢",
        slideText:
          "The grid shows rows and columns numbered 1–10. Find the row and column, then look where they cross for the answer. 3 × 4 → 12!",
      },
      {
        type: "multiChoice",
        text: "On a multiplication grid, row 4 and column 4 = ___",
        choices: ["8", "20", "16", "12"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "4 × 6 = ___",
        choices: ["20", "28", "24", "18"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "7 × 3 = ___",
        choices: ["18", "24", "21", "15"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "6 × 5 = ___",
        choices: ["25", "35", "30", "20"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "8 × 4 = ___",
        choices: ["28", "40", "32", "24"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "9 × 3 = ___",
        choices: ["24", "30", "27", "21"],
        correct: 2,
      },
      {
        type: "slide",
        text: "Well done! \ud83c\udf1f",
        slideText:
          "You have learned to navigate the multiplication grid — a tool that puts 100 facts at your fingertips. This skill makes all maths faster and more confident. Excellent!",
      },
    ],
  },
  {
    unitIndex: 3,
    lessonIndex: 5,
    title: "Area Model",
    questions: [
      {
        type: "slide",
        text: "Why the area model connects maths to the real world",
        slideText:
          "To find how many tiles fit in a room, or how much grass is in a garden, you multiply length by width. The area model makes this visual and extends to algebra later on.",
      },
      {
        type: "slide",
        text: "Area model shows multiplication as a rectangle! 📐",
        slideText:
          "Draw a rectangle 4 wide and 3 tall. Count all the squares inside: 4 × 3 = 12. Area = length × width!",
      },
      {
        type: "multiChoice",
        text: "A rectangle is 5 wide and 2 tall. What is its area?",
        choices: ["7", "14", "10", "8"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "A rectangle is 3 wide and 3 tall. What is its area?",
        choices: ["6", "12", "9", "8"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "A rectangle has area 20 and width 4. What is the height?",
        choices: ["4", "6", "5", "8"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "6 × 4 using area model = ___",
        choices: ["20", "28", "24", "30"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "A rectangle 7 wide and 3 tall. Area = ___",
        choices: ["18", "24", "21", "15"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "What shape does the area model always make?",
        choices: ["Triangle", "Circle", "Rectangle", "Hexagon"],
        correct: 2,
      },
      {
        type: "slide",
        text: "Well done! \ud83c\udf1f",
        slideText:
          "The area model connects multiplication to real space — floors, fields, screens. Every time you calculate an area in life, you will use exactly what you learned here. Fantastic!",
      },
    ],
  },
  {
    unitIndex: 3,
    lessonIndex: 6,
    title: "Word Problems",
    questions: [
      {
        type: "slide",
        text: "Why multiplication solves real-world problems",
        slideText:
          "How many chairs are needed for 8 tables of 6? How much does 5 kg of apples cost? Multiplication word problems model the kinds of questions that come up in every job and home.",
      },
      {
        type: "multiChoice",
        text: "A bag holds 5 apples. How many apples in 3 bags?",
        visual: "🍎🍎🍎🍎🍎",
        choices: ["12", "20", "15", "10"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "4 tables with 6 chairs each. How many chairs total?",
        choices: ["20", "28", "24", "18"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "Mia swims 2 lengths every day. Lengths in 7 days?",
        choices: ["12", "16", "14", "9"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "A spider has 8 legs. Legs on 3 spiders?",
        visual: "🕷️🕷️🕷️",
        choices: ["20", "28", "24", "16"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "5 boxes with 10 crayons each. Total crayons?",
        choices: ["40", "60", "50", "45"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "9 packs of stickers, 3 stickers each. Total?",
        choices: ["24", "30", "27", "21"],
        correct: 2,
      },
      {
        type: "dragDrop",
        text: "Order these multiplications from smallest to largest result!",
        dragItems: ["2×3", "2×1", "2×4", "2×2"],
        dragTarget: ["2×1", "2×2", "2×3", "2×4"],
      },
      {
        type: "slide",
        text: "Well done! \ud83c\udf1f",
        slideText:
          "You have applied multiplication to solve real situations — from catering to shopping to tiling. This is exactly how engineers and planners use maths every day. Brilliant!",
      },
    ],
  },

  // ── Unit 4: Place Value ─────────────────────────────────────────────────────
  {
    unitIndex: 4,
    lessonIndex: 0,
    title: "1-to-2 Machine (Binary)",
    questions: [
      {
        type: "slide",
        text: "Why binary is the language of computers",
        slideText:
          "Every image, message, and game on a computer is stored using just two values: on and off, 1 and 0. Binary is the language all computers speak — and it starts right here!",
      },
      {
        type: "slide",
        text: "Imagine a magic machine! 🤖",
        slideText:
          "A 1-to-2 machine takes 1 ball and makes 2 smaller balls. It groups things into twos. This is the secret behind binary numbers!",
      },
      {
        type: "multiChoice",
        text: "A 1-to-2 machine converts 1 into how many?",
        choices: ["1", "3", "2", "4"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "If the machine runs twice, 1 becomes ___",
        choices: ["2", "6", "4", "3"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "Binary means counting in groups of ___",
        choices: ["5", "10", "2", "3"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "In binary, only these digits are used:",
        choices: ["1, 2, 3", "0, 1, 2", "0 and 1", "1 and 2"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "Computers count in binary because they use ___",
        choices: [
          "10 fingers",
          "on/off switches",
          "tally marks",
          "Roman numerals",
        ],
        correct: 1,
      },
      { type: "trueFalse", text: "Binary uses only 0 and 1.", isTrue: true },
      {
        type: "trueFalse",
        text: "Binary has 10 different digits.",
        isTrue: false,
      },
      {
        type: "slide",
        text: "Well done! \ud83c\udf1f",
        slideText:
          "You have taken the first step into computer science! Every piece of digital information — photos, music, apps — uses binary. You now speak a language computers understand. Amazing!",
      },
    ],
  },
  {
    unitIndex: 4,
    lessonIndex: 1,
    title: "Binary Numbers",
    questions: [
      {
        type: "slide",
        text: "Why binary numbers matter in technology",
        slideText:
          "Your phone uses binary for everything. The colour of each pixel on its screen, every letter you type, every sound it plays — all stored as strings of 0s and 1s.",
      },
      {
        type: "slide",
        text: "Binary numbers use place values of 1, 2, 4, 8...",
        slideText:
          "Each position in binary is double the one before: 1, 2, 4, 8, 16... The binary number 101 means 4 + 0 + 1 = 5!",
      },
      {
        type: "multiChoice",
        text: "Binary 10 equals what in normal numbers?",
        choices: ["1", "3", "2", "10"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "Binary 11 equals what in normal numbers?",
        choices: ["2", "4", "3", "11"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "Binary 100 equals what in normal numbers?",
        choices: ["2", "6", "4", "8"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "The number 5 in binary is ___",
        choices: ["110", "011", "101", "100"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "What is the value of the '1' in binary 1000?",
        choices: ["2", "6", "8", "4"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "Binary 111 = ___",
        choices: ["5", "8", "7", "6"],
        correct: 2,
      },
      {
        type: "slide",
        text: "Well done! \ud83c\udf1f",
        slideText:
          "You can now read and write binary numbers — the same system inside every computer, tablet, and phone on Earth. That is a genuinely powerful skill. Well done!",
      },
    ],
  },
  {
    unitIndex: 4,
    lessonIndex: 2,
    title: "1-to-10 Machine (Base 10)",
    questions: [
      {
        type: "slide",
        text: "Why base 10 is the human number system",
        slideText:
          "We count in base 10 because we have 10 fingers. When you reach 10, you start a new group. This system is called the decimal system and it is used worldwide for all everyday maths.",
      },
      {
        type: "slide",
        text: "Our number system groups by 10! 🔟",
        slideText:
          "When you have 10 ones, you trade them for 1 ten. When you have 10 tens, you trade for 1 hundred. This is base 10!",
      },
      {
        type: "multiChoice",
        text: "How many ones make 1 ten?",
        choices: ["5", "20", "10", "100"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "How many tens make 1 hundred?",
        choices: ["5", "20", "10", "100"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "13 ones = 1 ten and ___ ones",
        choices: ["1", "4", "3", "2"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "How many ones is 2 tens and 5 ones?",
        choices: ["20", "30", "25", "52"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "We use base 10 because humans have ___ fingers",
        choices: ["8", "12", "10", "5"],
        correct: 2,
      },
      {
        type: "slide",
        text: "Well done! \ud83c\udf1f",
        slideText:
          "Understanding base 10 explains why our number system works the way it does — and it makes place value, decimals, and percentages much easier to learn. Brilliant!",
      },
    ],
  },
  {
    unitIndex: 4,
    lessonIndex: 3,
    title: "Building with Blocks",
    questions: [
      {
        type: "slide",
        text: "Why place value blocks make maths clearer",
        slideText:
          "Place value blocks show numbers as physical objects. Seeing that 34 = 3 tens + 4 ones makes addition and subtraction with carrying much easier to understand and do.",
      },
      {
        type: "slide",
        text: "Place value blocks make numbers clear! 🧱",
        slideText:
          "Small unit cubes = ones. A rod of 10 cubes = one ten. A flat of 100 cubes = one hundred. Build any number with these blocks!",
      },
      {
        type: "multiChoice",
        text: "2 tens and 3 ones = ___",
        choices: ["32", "5", "23", "203"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "What is the value of 4 in 47?",
        choices: ["4", "47", "40", "400"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "How many tens are in 65?",
        choices: ["5", "60", "6", "65"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "3 hundreds, 2 tens, 1 one = ___",
        choices: ["123", "321", "312", "231"],
        correct: 1,
      },
      {
        type: "multiChoice",
        text: "What digit is in the tens place of 583?",
        choices: ["5", "3", "8", "53"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "146 = 1 hundred + ___ tens + 6 ones",
        choices: ["40", "14", "4", "46"],
        correct: 2,
      },
      {
        type: "slide",
        text: "Well done! \ud83c\udf1f",
        slideText:
          "You can now visualise place value — the idea that a digit's position determines its value. This understanding underpins all written arithmetic. Superb work!",
      },
    ],
  },
  {
    unitIndex: 4,
    lessonIndex: 4,
    title: "Regrouping",
    questions: [
      {
        type: "slide",
        text: "Why regrouping (carrying and borrowing) matters",
        slideText:
          "When you add 28 + 15, you get more than 9 in the ones column — so you regroup into the tens. This is the key technique that makes written addition and subtraction work.",
      },
      {
        type: "slide",
        text: "Regrouping is trading values! 🔄",
        slideText:
          "When adding, if you get 10 or more in one column, carry 1 to the next. 28 + 14: 8+4=12, write 2, carry 1 ten. So 2+1+1=4 tens. Answer: 42!",
      },
      {
        type: "multiChoice",
        text: "17 + 5 = ___",
        choices: ["20", "23", "22", "21"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "28 + 14 = ___",
        choices: ["40", "43", "42", "41"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "35 + 27 = ___",
        choices: ["60", "63", "62", "61"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "When adding 9 + 7, you regroup because 9 + 7 = ___",
        choices: ["14 (regroup)", "16 (regroup)", "15 (regroup)", "17"],
        correct: 0,
      },
      {
        type: "multiChoice",
        text: "56 − 18 = ___",
        choices: ["36", "40", "38", "42"],
        correct: 2,
      },
      {
        type: "slide",
        text: "Well done! \ud83c\udf1f",
        slideText:
          "Regrouping is what makes column arithmetic possible. Every large addition or subtraction you will ever do — in school, at work, and in life — relies on this. Excellent!",
      },
    ],
  },
  {
    unitIndex: 4,
    lessonIndex: 5,
    title: "Comparing & Rounding",
    questions: [
      {
        type: "slide",
        text: "Why rounding is a practical everyday skill",
        slideText:
          "No one says the journey took 47 minutes and 23 seconds — they say about 50 minutes. Rounding makes numbers easier to use, remember, and estimate in real life.",
      },
      {
        type: "slide",
        text: "Compare digits from left to right! 👈",
        slideText:
          "To compare 347 and 352: hundreds match (3), so check tens: 4 vs 5. Since 5 > 4, then 352 > 347. Rounding: if the next digit is 5 or more, round up!",
      },
      {
        type: "multiChoice",
        text: "Which is greater: 472 or 427?",
        choices: ["427", "they're equal", "472", "can't tell"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "Round 34 to the nearest 10",
        choices: ["40", "20", "30", "34"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "Round 67 to the nearest 10",
        choices: ["60", "50", "70", "67"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "Which is smaller: 519 or 591?",
        choices: ["591", "they're equal", "519", "can't tell"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "Round 245 to the nearest 100",
        choices: ["300", "240", "200", "250"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "Round 85 to the nearest 10",
        choices: ["80", "70", "90", "85"],
        correct: 2,
      },
      {
        type: "dragDrop",
        text: "Order these numbers from smallest to largest!",
        dragItems: ["347", "100", "520", "275"],
        dragTarget: ["100", "275", "347", "520"],
      },
      {
        type: "slide",
        text: "Well done! \ud83c\udf1f",
        slideText:
          "You now know how to round numbers — a skill used in science, finance, cooking, and sport. Approximate answers are often more useful than exact ones. Great work!",
      },
    ],
  },

  // ── Unit 5: Fractions ───────────────────────────────────────────────────────
  {
    unitIndex: 5,
    lessonIndex: 0,
    title: "What Is a Fraction?",
    questions: [
      {
        type: "slide",
        text: "Why fractions are everywhere in real life",
        slideText:
          "Every time you share a pizza, read a recipe, or check a weather forecast, you use fractions. Half a cup, three quarters of an hour, one third of a class — fractions describe parts of things.",
      },
      {
        type: "slide",
        text: "Fractions are equal parts of a whole! 🍕",
        slideText:
          "If you cut a pizza into 4 equal slices and eat 1, you ate 1/4 (one quarter). The bottom number says how many equal parts, the top says how many you have!",
      },
      {
        type: "multiChoice",
        text: "A pizza is cut into 2 equal slices. One slice is ___",
        visual: "🍕🍕",
        choices: ["1/3", "2/1", "1/2", "2/2"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "In the fraction 3/4, what does the 4 tell us?",
        choices: [
          "How many you have",
          "The total pieces",
          "How many equal parts total",
          "The size",
        ],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "In the fraction 3/4, what does the 3 tell us?",
        choices: [
          "How many equal parts total",
          "The size of each part",
          "How many parts you have",
          "The whole number",
        ],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "A chocolate bar is cut into 3 equal parts. You eat 2. What fraction did you eat?",
        choices: ["1/3", "3/2", "2/3", "2/2"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "Which fraction means 'one half'?",
        choices: ["2/1", "1/4", "1/2", "2/2"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "A whole pie = ___",
        choices: ["0/4", "2/4", "4/4", "4/0"],
        correct: 2,
      },
      {
        type: "trueFalse",
        text: "A fraction shows part of a whole.",
        isTrue: true,
      },
      {
        type: "fillBlank",
        text: "A pizza cut into 4 equal slices — each slice is 1/___ of the pizza.",
        answer: "4",
        hint: "Type a number",
      },
      {
        type: "slide",
        text: "Well done! \ud83c\udf1f",
        slideText:
          "You now understand fractions — one of the most used ideas in maths. Cooking, measuring, time, money, and probability all rely on fractions every single day. Incredible!",
      },
    ],
  },
  {
    unitIndex: 5,
    lessonIndex: 1,
    title: "Fraction Smash",
    questions: [
      {
        type: "slide",
        text: "Why seeing fractions in shapes helps",
        slideText:
          "Pie charts, bar charts, and maps all use shapes split into fractional parts. Seeing a fraction as a shaded shape helps you understand what it means before doing any arithmetic.",
      },
      {
        type: "slide",
        text: "Find fractions hiding in shapes! 🔷",
        slideText:
          "Shapes split into equal parts show fractions. A square split into 4 equal pieces: each piece is 1/4. Shading 3 pieces shows 3/4!",
      },
      {
        type: "multiChoice",
        text: "A square is cut into 4 equal parts. 1 part is shaded. What fraction is shaded?",
        choices: ["1/3", "4/1", "1/4", "4/4"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "A circle is split into 8 equal slices. 3 are shaded. What fraction is shaded?",
        choices: ["8/3", "3/5", "3/8", "5/8"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "A strip is cut into 5 equal parts, 2 are coloured. Fraction coloured?",
        choices: ["3/5", "2/3", "2/5", "5/2"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "A rectangle cut into 6 equal parts, 4 shaded. Fraction shaded?",
        choices: ["2/6", "6/4", "4/6", "4/2"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "A shape has 10 equal parts, 7 are filled. Fraction filled?",
        choices: ["3/10", "10/7", "7/10", "7/3"],
        correct: 2,
      },
      {
        type: "slide",
        text: "Well done! \ud83c\udf1f",
        slideText:
          "You can now read fractional parts of shapes — the same skill used to read charts, maps, and diagrams in maths, science, and geography. Brilliant work!",
      },
    ],
  },
  {
    unitIndex: 5,
    lessonIndex: 2,
    title: "Fractions on a Number Line",
    questions: [
      {
        type: "slide",
        text: "Why fractions belong on the number line",
        slideText:
          "Between every two whole numbers live infinitely many fractions. Placing fractions on a number line shows their size and order — essential for decimals, percentages, and measurements.",
      },
      {
        type: "slide",
        text: "Fractions live between whole numbers! 📍",
        slideText:
          "Place 1/2 between 0 and 1 on a number line. Split the space into 2 equal parts — the halfway point is 1/2. Works for any fraction!",
      },
      {
        type: "multiChoice",
        text: "Where is 1/2 on a 0-to-1 number line?",
        choices: ["At 0", "At 1", "Halfway between 0 and 1", "Past 1"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "A number line from 0 to 1 is split into 4 equal parts. The second mark is ___",
        choices: ["1/4", "3/4", "2/4", "4/4"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "On a 0-to-1 number line split into 3 equal parts, the first mark is ___",
        choices: ["3/1", "2/3", "1/3", "1/2"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "Which fraction is closest to 1?",
        choices: ["1/4", "1/2", "3/4", "1/10"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "Which fraction is closest to 0?",
        choices: ["3/4", "1/2", "1/10", "2/3"],
        correct: 2,
      },
      {
        type: "slide",
        text: "Well done! \ud83c\udf1f",
        slideText:
          "You can now place fractions on a number line — this connects fractions to decimals and percentages. A huge leap in mathematical thinking! Well done!",
      },
    ],
  },
  {
    unitIndex: 5,
    lessonIndex: 3,
    title: "Equivalent Fractions",
    questions: [
      {
        type: "slide",
        text: "Why the same amount can look different",
        slideText:
          "Half a pizza written as 1/2 or 2/4 or 4/8 is exactly the same amount of pizza. Recognising equivalent fractions is essential for adding fractions and simplifying answers.",
      },
      {
        type: "slide",
        text: "Same size, different names! 🪞",
        slideText:
          "1/2 = 2/4 = 3/6 = 4/8. They look different but are the same amount! Multiply or divide top AND bottom by the same number to find equivalent fractions.",
      },
      {
        type: "multiChoice",
        text: "Which fraction equals 1/2?",
        choices: ["1/4", "3/4", "2/4", "2/3"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "1/3 = ___/6",
        choices: ["1", "3", "2", "4"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "2/3 = 4/___",
        choices: ["3", "8", "6", "9"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "Which fraction is NOT equivalent to 1/2?",
        choices: ["2/4", "4/8", "3/5", "5/10"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "3/4 = 6/___",
        choices: ["6", "10", "8", "12"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "6/8 simplified = ___",
        choices: ["2/4", "1/2", "3/4", "2/3"],
        correct: 2,
      },
      {
        type: "slide",
        text: "Well done! \ud83c\udf1f",
        slideText:
          "Equivalent fractions are used every time you simplify an answer, compare measurements, or add fractions. This is a cornerstone of all fraction work — amazing effort!",
      },
    ],
  },
  {
    unitIndex: 5,
    lessonIndex: 4,
    title: "Comparing Fractions",
    questions: [
      {
        type: "slide",
        text: "Why comparing fractions matters",
        slideText:
          "Would you rather have 3/4 of a bar of chocolate or 2/3? Comparing fractions tells you which is more — a skill used in cooking, budgeting, and understanding data.",
      },
      {
        type: "slide",
        text: "Bigger bottom = smaller slices! 🍰",
        slideText:
          "When tops are equal, bigger bottoms mean smaller slices: 1/8 < 1/4 < 1/2. When bottoms are equal, bigger tops mean more slices: 3/8 > 2/8 > 1/8.",
      },
      {
        type: "multiChoice",
        text: "Which is larger: 1/2 or 1/4?",
        choices: ["1/4", "they're equal", "1/2", "can't tell"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "Which is smaller: 3/8 or 5/8?",
        choices: ["5/8", "they're equal", "3/8", "can't tell"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "Order from smallest to largest: 1/2, 1/8, 1/4",
        choices: [
          "1/2, 1/4, 1/8",
          "1/8, 1/2, 1/4",
          "1/8, 1/4, 1/2",
          "1/4, 1/8, 1/2",
        ],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "Which is greater: 2/5 or 3/5?",
        choices: ["2/5", "they're equal", "3/5", "can't tell"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "Which is bigger: 3/4 or 2/3?",
        choices: ["2/3", "they're equal", "3/4", "can't tell"],
        correct: 2,
      },
      {
        type: "slide",
        text: "Well done! \ud83c\udf1f",
        slideText:
          "You can now compare fractions — used whenever you need to choose the bigger portion, rank probabilities, or order measurements. Really important maths. Well done!",
      },
    ],
  },
  {
    unitIndex: 5,
    lessonIndex: 5,
    title: "Adding Fractions",
    questions: [
      {
        type: "slide",
        text: "Why adding fractions is a key life skill",
        slideText:
          "Add 1/4 cup of butter to 2/4 cup of butter in a recipe and you need 3/4 cup total. Adding fractions is used in cooking, carpentry, music, and science every day.",
      },
      {
        type: "slide",
        text: "Add tops when bottoms match! ➕",
        slideText:
          "To add 1/4 + 2/4: the bottoms are the same, so just add the tops: 1 + 2 = 3. Answer: 3/4. The bottom (denominator) stays the same!",
      },
      {
        type: "multiChoice",
        text: "1/4 + 1/4 = ___",
        choices: ["1/8", "2/8", "2/4", "1/2"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "2/5 + 1/5 = ___",
        choices: ["3/10", "2/10", "3/5", "3/25"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "1/3 + 1/3 = ___",
        choices: ["2/6", "1/6", "2/3", "2/9"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "3/8 + 2/8 = ___",
        choices: ["4/8", "6/16", "5/8", "5/16"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "1/6 + 4/6 = ___",
        choices: ["4/12", "5/12", "5/6", "4/6"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "Can you add 1/2 + 1/3 by just adding tops? Why not?",
        choices: [
          "Yes, always add tops",
          "Yes, but only sometimes",
          "No, bottoms must match first",
          "No, fractions can't be added",
        ],
        correct: 2,
      },
      {
        type: "slide",
        text: "Well done! \ud83c\udf1f",
        slideText:
          "You can now add fractions with the same denominator — the foundation for adding all fractions, working with decimals, and understanding percentages. Superb!",
      },
    ],
  },
  {
    unitIndex: 5,
    lessonIndex: 6,
    title: "Mixed Numbers",
    questions: [
      {
        type: "slide",
        text: "Why mixed numbers appear everywhere",
        slideText:
          "1 and a half hours, 2 and three quarter miles, 3 and a half cups — mixed numbers appear constantly in real-life measurement and time.",
      },
      {
        type: "slide",
        text: "Mixed numbers have a whole part and a fraction! 🔢",
        slideText:
          "1½ means 1 whole pizza plus half a pizza. The whole number comes first, then the fraction. 2¾ = 2 wholes + 3/4 more!",
      },
      {
        type: "multiChoice",
        text: "1 and 1/2 written as a mixed number is ___",
        choices: ["2/1", "1 + 2", "1½", "3/2"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "2¾ = ___ wholes and ___ quarters",
        choices: [
          "3 wholes, 2 quarters",
          "4 wholes, 2 quarters",
          "2 wholes, 3 quarters",
          "2 wholes, 4 quarters",
        ],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "5/2 as a mixed number is ___",
        choices: ["1½", "3", "2½", "2¼"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "Which is bigger: 2½ or 2¾?",
        choices: ["2½", "they're equal", "2¾", "can't tell"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "1¼ + 1¼ = ___",
        choices: ["2¼", "2¾", "2½", "2"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "7/4 as a mixed number is ___",
        choices: ["1¼", "2¼", "1¾", "1½"],
        correct: 2,
      },
      {
        type: "dragDrop",
        text: "Put these fractions in order from smallest to largest!",
        dragItems: ["3/4", "1/4", "1/2", "1"],
        dragTarget: ["1/4", "1/2", "3/4", "1"],
      },
      {
        type: "slide",
        text: "Well done! \ud83c\udf1f",
        slideText:
          "You now understand mixed numbers — the natural way humans describe amounts bigger than 1 but not quite a whole number more. You will see them in recipes, maps, and timetables. Excellent!",
      },
    ],
  },

  // ── Unit 6: Algebra ─────────────────────────────────────────────────────────
  {
    unitIndex: 6,
    lessonIndex: 0,
    title: "Patterns",
    questions: [
      {
        type: "slide",
        text: "Why recognising patterns is a superpower",
        slideText:
          "Maths is fundamentally the study of patterns. Seasons repeat, prices change in patterns, music follows rhythmic patterns — and algebra, coding, and science all depend on finding rules in sequences.",
      },
      {
        type: "slide",
        text: "Patterns repeat — find the rule! 🔁",
        slideText:
          "A pattern is a sequence that follows a rule. 2, 4, 6, 8 — the rule is +2. Once you know the rule, you can predict what comes next!",
      },
      {
        type: "multiChoice",
        text: "What comes next? 1, 3, 5, 7, ___",
        choices: ["8", "10", "9", "11"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "What is the rule? 3, 6, 9, 12",
        choices: ["+2", "+4", "+3", "+5"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "What comes next? 2, 4, 8, 16, ___",
        choices: ["18", "24", "32", "20"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "What is the rule? 20, 15, 10, 5",
        choices: ["-3", "-4", "-5", "-6"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "What comes next? 🔴🔵🔴🔵🔴___",
        choices: ["🔴", "🟡", "🔵", "🟢"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "Pattern: 1, 4, 9, 16, ___. What comes next?",
        choices: ["20", "24", "25", "21"],
        correct: 2,
      },
      {
        type: "slide",
        text: "Well done! \ud83c\udf1f",
        slideText:
          "You have practised one of the most powerful thinking skills: finding the rule behind a pattern. This is how scientists make predictions and how programmers write loops. Brilliant!",
      },
    ],
  },
  {
    unitIndex: 6,
    lessonIndex: 1,
    title: "What Is a Variable?",
    questions: [
      {
        type: "slide",
        text: "Why letters replace numbers in algebra",
        slideText:
          "Sometimes we do not know a number yet — but we can still do maths with it! A variable is a placeholder for an unknown. Programmers, scientists, and engineers use variables every day.",
      },
      {
        type: "slide",
        text: "A variable is a mystery box! 📦",
        slideText:
          "A variable is a letter like x or n that stands for an unknown number. If x + 3 = 7, the mystery box x holds the number 4!",
      },
      {
        type: "multiChoice",
        text: "If x + 3 = 7, what is x?",
        choices: ["2", "5", "4", "3"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "If y − 2 = 6, what is y?",
        choices: ["6", "10", "8", "4"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "If n × 2 = 10, what is n?",
        choices: ["4", "6", "5", "8"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "A variable can be ___",
        choices: [
          "Only the letter x",
          "Only even numbers",
          "Any unknown number",
          "Always zero",
        ],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "If z + z = 12, what is z?",
        choices: ["4", "8", "6", "12"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "If a × 3 = 15, what is a?",
        choices: ["4", "6", "5", "3"],
        correct: 2,
      },
      {
        type: "slide",
        text: "Well done! \ud83c\udf1f",
        slideText:
          "Variables are the heart of algebra, programming, and science. Every formula you will ever use — in physics, finance, or code — uses variables just like this. Amazing work!",
      },
    ],
  },
  {
    unitIndex: 6,
    lessonIndex: 2,
    title: "Balancing Equations",
    questions: [
      {
        type: "slide",
        text: "Why equations must always balance",
        slideText:
          "An equation is like a set of scales — both sides must weigh the same. This principle is used in chemistry, physics, and finance every single day.",
      },
      {
        type: "slide",
        text: "An equation is a balanced scale! ⚖️",
        slideText:
          "Both sides of the = sign must be equal. 3 + 4 = 7. If you add to one side, you must add the same to the other to keep it balanced!",
      },
      {
        type: "multiChoice",
        text: "3 + ___ = 10",
        choices: ["6", "8", "7", "5"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "___ − 4 = 5",
        choices: ["7", "11", "9", "8"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "2 × ___ = 14",
        choices: ["6", "8", "7", "9"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "If 5 + 3 = ___ + 4, what fills the blank?",
        choices: ["3", "5", "4", "6"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "___ ÷ 3 = 4",
        choices: ["10", "14", "12", "9"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "6 + 9 = 10 + ___",
        choices: ["4", "6", "5", "3"],
        correct: 2,
      },
      {
        type: "slide",
        text: "Well done! \ud83c\udf1f",
        slideText:
          "The balance principle is one of the most important ideas in all of science and maths. Every equation in physics, chemistry, and algebra obeys it. You now understand why. Excellent!",
      },
    ],
  },
  {
    unitIndex: 6,
    lessonIndex: 3,
    title: "Function Machines",
    questions: [
      {
        type: "slide",
        text: "Why function machines are everywhere in tech",
        slideText:
          "A function takes an input and produces a consistent output. Apps, websites, and calculators are built from thousands of functions — each one taking inputs and returning predictable outputs.",
      },
      {
        type: "slide",
        text: "A function machine applies the same rule to every input! ⚙️",
        slideText:
          "Put 3 into a +5 machine → out comes 8. Put 7 in → out comes 12. The machine always does the same thing to whatever goes in!",
      },
      {
        type: "multiChoice",
        text: "Input: 4. Rule: +6. Output: ___",
        choices: ["8", "12", "10", "9"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "Input: 9. Rule: −3. Output: ___",
        choices: ["5", "7", "6", "4"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "Input: 5. Rule: ×4. Output: ___",
        choices: ["16", "24", "20", "15"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "Input: 3. Output: 9. What is the rule?",
        choices: ["+5", "+7", "×3", "+6"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "Input: 8. Rule: ÷2. Output: ___",
        choices: ["3", "5", "4", "6"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "A machine outputs 15 when given 3. Rule could be ___",
        choices: ["+10", "+13", "×5", "+12"],
        correct: 2,
      },
      {
        type: "slide",
        text: "Well done! \ud83c\udf1f",
        slideText:
          "You have just learned one of the core ideas in both maths and computer science. Every app feature, calculator button, and spreadsheet formula is a function in disguise. Super work!",
      },
    ],
  },
  {
    unitIndex: 6,
    lessonIndex: 4,
    title: "Solving for Unknowns",
    questions: [
      {
        type: "slide",
        text: "Why solving equations is a core life skill",
        slideText:
          "If a shop item costs some amount and you have a budget, how much change do you get? Solving for unknowns answers real questions in money, science, cooking, and engineering every day.",
      },
      {
        type: "slide",
        text: "Use opposite operations to find unknowns! 🔓",
        slideText:
          "To solve x + 5 = 12, subtract 5 from both sides: x = 7. To solve 3x = 18, divide both sides by 3: x = 6. Opposites unlock the answer!",
      },
      {
        type: "multiChoice",
        text: "x + 8 = 15. What is x?",
        choices: ["6", "8", "7", "9"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "y − 6 = 9. What is y?",
        choices: ["13", "17", "15", "14"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "4n = 20. What is n?",
        choices: ["4", "6", "5", "8"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "m ÷ 3 = 7. What is m?",
        choices: ["18", "24", "21", "15"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "2x + 1 = 11. What is x?",
        choices: ["4", "6", "5", "3"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "a × a = 16. What is a?",
        choices: ["3", "5", "4", "8"],
        correct: 2,
      },
      {
        type: "slide",
        text: "Well done! \ud83c\udf1f",
        slideText:
          "Solving equations is the engine of algebra — and algebra powers science, engineering, economics, and technology. You have just learned a tool used by professionals worldwide. Incredible!",
      },
    ],
  },
  {
    unitIndex: 6,
    lessonIndex: 5,
    title: "Graphing Patterns",
    questions: [
      {
        type: "slide",
        text: "Why graphs turn data into understanding",
        slideText:
          "A table of numbers is hard to read. A graph makes patterns jump out — is it rising, falling, flat? Scientists, doctors, and economists use graphs to understand trends and make decisions.",
      },
      {
        type: "slide",
        text: "Graphs show patterns as pictures! 📈",
        slideText:
          "Plot points on a grid using (x, y) coordinates. If you double x to get y, the points line up in a straight line. Graphs make patterns easy to see!",
      },
      {
        type: "multiChoice",
        text: "The point (3, 5) means x = ___ and y = ___",
        choices: ["y=3, x=5", "x=5, y=3", "x=3, y=5", "x=0, y=8"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "Rule: y = x + 2. If x = 4, what is y?",
        choices: ["4", "8", "6", "5"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "Rule: y = 2x. If x = 3, what is y?",
        choices: ["4", "8", "6", "5"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "Which pattern makes a straight line when graphed?",
        choices: ["1, 2, 4, 8", "1, 1, 2, 3", "1, 3, 5, 7", "1, 4, 9, 16"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "Rule: y = x − 1. If x = 10, what is y?",
        choices: ["8", "11", "9", "10"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "On a coordinate grid, the starting point (0,0) is called the ___",
        choices: ["vertex", "midpoint", "origin", "centre"],
        correct: 2,
      },
      {
        type: "dragDrop",
        text: "Order these expressions from smallest to largest when x = 2",
        dragItems: ["x+1", "x×3", "x-1", "x×2"],
        dragTarget: ["x-1", "x+1", "x×2", "x×3"],
      },
      {
        type: "slide",
        text: "Well done! \ud83c\udf1f",
        slideText:
          "You can now graph patterns and read coordinates — skills used in every science, geography map, spreadsheet, and data dashboard. One of the most useful maths skills you will ever learn. Fantastic!",
      },
    ],
  },

  // ── Unit 7: History of Numbers ───────────────────────────────────────────────
  {
    unitIndex: 7,
    lessonIndex: 0,
    title: "Is Math Universal?",
    questions: [
      {
        type: "slide",
        text: "Why maths transcends culture and language",
        slideText:
          "A song sounds different in French and English. But 2 + 2 = 4 in every language, every country, and even in outer space. Maths is the one truly universal language humans share.",
      },
      {
        type: "slide",
        text: "Did humans invent math, or discover it? 🌍",
        slideText:
          "Every culture across history counted things — animals, days, trades. They all discovered the same truths: 2 + 2 = 4 everywhere on Earth, and even in space!",
      },
      {
        type: "multiChoice",
        text: "Is 2 + 2 = 4 true in every country?",
        choices: [
          "Only in some",
          "Only in Europe",
          "Yes, everywhere",
          "Only with calculators",
        ],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "Ancient Egyptians, Romans, and Mayans all had their own ___",
        choices: ["computers", "calculators", "number systems", "textbooks"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "Which of these is a universal math fact?",
        choices: ["5 + 3 = 9", "2 × 3 = 7", "7 − 3 = 4", "4 + 4 = 9"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "Math is considered universal because ___",
        choices: [
          "It was invented in Europe",
          "Only scientists use it",
          "Its truths are the same for everyone",
          "It changes from place to place",
        ],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "Humans have been counting for at least ___",
        choices: ["100 years", "500 years", "30,000 years", "200 years"],
        correct: 2,
      },
      {
        type: "slide",
        text: "Well done! \ud83c\udf1f",
        slideText:
          "You now understand something profound: mathematical truths are universal. The same numbers connect ancient Egyptian traders and modern astronauts. That is remarkable — well done!",
      },
    ],
  },
  {
    unitIndex: 7,
    lessonIndex: 1,
    title: "Roman Numerals",
    questions: [
      {
        type: "slide",
        text: "Why Roman numerals are still used today",
        slideText:
          "Roman numerals appear on clock faces, film credits, building inscriptions, and chapter headings. Learning them connects you to 2,000 years of written history.",
      },
      {
        type: "slide",
        text: "Romans wrote numbers with letters! 🏛️",
        slideText:
          "I=1, V=5, X=10, L=50, C=100. To read them: add letters going left to right, EXCEPT when a smaller letter is BEFORE a bigger one — then subtract! IV = 4, IX = 9.",
      },
      {
        type: "multiChoice",
        text: "What is III in normal numbers?",
        choices: ["1", "4", "3", "2"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "What is VII in normal numbers?",
        choices: ["5", "9", "7", "6"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "What is IX in normal numbers?",
        choices: ["8", "11", "9", "10"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "What is XIV in normal numbers?",
        choices: ["13", "16", "14", "15"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "How do you write 4 in Roman numerals?",
        choices: ["IIII", "VI", "IV", "V"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "What is XL in normal numbers?",
        choices: ["60", "50", "40", "30"],
        correct: 2,
      },
      {
        type: "slide",
        text: "Well done! \ud83c\udf1f",
        slideText:
          "You can now read Roman numerals — you will spot them on watches, films, buildings, and sporting events. A connection to the same number system used by Julius Caesar! Excellent!",
      },
    ],
  },
  {
    unitIndex: 7,
    lessonIndex: 2,
    title: "Discovery of Zero",
    questions: [
      {
        type: "slide",
        text: "Why zero changed everything",
        slideText:
          "Before zero was invented, you could not write 10, 100, or 1000 clearly. Zero made our place value system possible, and without it, modern computing would not exist.",
      },
      {
        type: "slide",
        text: "Zero was one of the greatest discoveries in math! 0️⃣",
        slideText:
          "Ancient Indians first used zero as a number around 600 AD. Before that, most cultures had no symbol for 'nothing'. Zero made place value and modern maths possible!",
      },
      {
        type: "multiChoice",
        text: "Who first used zero as a proper number?",
        choices: [
          "Ancient Romans",
          "Ancient Egyptians",
          "Ancient Indians",
          "Ancient Greeks",
        ],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "Without zero, what would be hard to write?",
        choices: [
          "Addition",
          "Shapes",
          "Numbers like 10, 100, 1000",
          "Patterns",
        ],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "What is 5 × 0?",
        choices: ["5", "10", "0", "50"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "What is 100 − 100?",
        choices: ["1", "10", "0", "100"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "Why is zero special in our number system?",
        choices: [
          "It makes numbers smaller",
          "It is the same as one",
          "It allows place value to work",
          "It was invented by computers",
        ],
        correct: 2,
      },
      {
        type: "slide",
        text: "Well done! \ud83c\udf1f",
        slideText:
          "Zero is one of the most important ideas in human history. Without it, computers, rockets, and smartphones could not exist. You have just studied a world-changing discovery. Amazing!",
      },
    ],
  },
  {
    unitIndex: 7,
    lessonIndex: 3,
    title: "Number Systems",
    questions: [
      {
        type: "slide",
        text: "Why different cultures invented different number systems",
        slideText:
          "The way we count is a human choice, not a universal law. Mayans, Babylonians, Romans, and Arabs all invented different systems — and each one tells us something about how they saw the world.",
      },
      {
        type: "slide",
        text: "Different cultures, different number systems! 🌐",
        slideText:
          "The Mayans used base 20 (counting fingers AND toes!). Babylonians used base 60 (we still use this for time: 60 seconds, 60 minutes). We use base 10!",
      },
      {
        type: "multiChoice",
        text: "Which number system do we use today?",
        choices: ["Base 2", "Base 20", "Base 10", "Base 60"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "The Mayans counted in groups of ___",
        choices: ["10", "60", "20", "12"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "We still use Babylonian base 60 for ___",
        choices: [
          "Counting money",
          "Measuring temperature",
          "Measuring time",
          "Counting people",
        ],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "How many seconds are in a minute?",
        choices: ["10", "100", "60", "12"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "Computers use base 2 (binary) because ___",
        choices: [
          "It's easier for humans",
          "It uses only on/off states",
          "It was invented first",
          "Base 10 is too complex",
        ],
        correct: 1,
      },
      {
        type: "slide",
        text: "Well done! \ud83c\udf1f",
        slideText:
          "You have explored number systems from around the world and across history. Understanding this shows that maths is a human creation — shaped by culture and need. Brilliant work!",
      },
    ],
  },
  {
    unitIndex: 7,
    lessonIndex: 4,
    title: "The Story of Infinity",
    questions: [
      {
        type: "slide",
        text: "Why infinity is one of maths greatest ideas",
        slideText:
          "Infinity is not just a big number — it is a concept that challenges how we think. Mathematicians, philosophers, and physicists have wrestled with it for centuries. It appears in number lines, sequences, and the universe itself.",
      },
      {
        type: "slide",
        text: "Infinity means going on forever! ∞",
        slideText:
          "No matter how big a number you think of, you can always add 1 more. Infinity isn't a number you can reach — it's the idea of never stopping. The symbol ∞ was invented in 1655!",
      },
      {
        type: "multiChoice",
        text: "What does infinity mean?",
        choices: [
          "A very large number",
          "One trillion",
          "Going on forever",
          "The biggest number",
        ],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "What is the symbol for infinity?",
        choices: ["Ω", "π", "∞", "∑"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "Can you ever reach infinity by counting?",
        choices: [
          "Yes, if you count fast",
          "Yes, with a calculator",
          "No, it goes on forever",
          "Yes, it equals a trillion",
        ],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "What is infinity + 1?",
        choices: [
          "A bigger number",
          "Still infinity",
          "Undefined",
          "Two infinity",
        ],
        correct: 1,
      },
      {
        type: "multiChoice",
        text: "Who invented the infinity symbol ∞?",
        choices: ["Isaac Newton", "Archimedes", "John Wallis", "Pythagoras"],
        correct: 2,
      },
      {
        type: "dragDrop",
        text: "Order these number systems from oldest to newest!",
        dragItems: [
          "Arabic numerals",
          "Roman numerals",
          "Egyptian hieroglyphs",
          "Greek numerals",
        ],
        dragTarget: [
          "Egyptian hieroglyphs",
          "Greek numerals",
          "Roman numerals",
          "Arabic numerals",
        ],
      },
      {
        type: "slide",
        text: "Well done! \ud83c\udf1f",
        slideText:
          "You have encountered one of the deepest ideas in mathematics. Infinity appears in calculus, physics, and philosophy — and now you understand what it really means. Truly remarkable thinking!",
      },
    ],
  },
  {
    unitIndex: 8,
    lessonIndex: 0,
    title: "The Science of Change",
    questions: [
      {
        type: "slide",
        text: "Why maths helps us understand change",
        slideText:
          "Everything changes over time — populations grow, temperatures rise, rivers change course. Maths gives us tools to describe, measure, and predict change — from weather forecasting to economics.",
      },
      {
        type: "slide",
        text: "The Science of Change",
        slideText:
          "Math helps us understand how things change. Complexity science uses math to study patterns, chaos, and how tiny differences can lead to big changes!",
      },
      {
        type: "multiChoice",
        text: "What does complexity science study?",
        choices: [
          "Simple sums",
          "How things change and grow",
          "Only shapes",
          "Only numbers",
        ],
        correct: 1,
      },
      {
        type: "multiChoice",
        text: "A butterfly flapping its wings can affect the weather far away. This is called:",
        choices: [
          "Butterfly Stroke",
          "The Butterfly Effect",
          "Wing Power",
          "Chaos Math",
        ],
        correct: 1,
      },
      {
        type: "multiChoice",
        text: "Which best describes a pattern?",
        choices: [
          "Something random",
          "A rule that repeats",
          "A single number",
          "A mistake",
        ],
        correct: 1,
      },
      {
        type: "multiChoice",
        text: "If a tiny change causes a huge effect, we call that:",
        choices: [
          "Predictable",
          "Boring",
          "Sensitive to initial conditions",
          "A coincidence",
        ],
        correct: 2,
      },
      {
        type: "slide",
        text: "Well done! \ud83c\udf1f",
        slideText:
          "You have learned that maths is not just about static numbers — it describes how the world changes. This idea is the foundation of calculus and all modern science. Incredible work!",
      },
    ],
  },
  {
    unitIndex: 8,
    lessonIndex: 1,
    title: "Fibonacci & Nature",
    questions: [
      {
        type: "slide",
        text: "Why nature counts in a special sequence",
        slideText:
          "The spirals in a sunflower, the arrangement of a pine cone, the curl of a nautilus shell — they all follow the Fibonacci sequence: 1, 1, 2, 3, 5, 8, 13... Maths is literally built into living things.",
      },
      {
        type: "slide",
        text: "Fibonacci & Nature",
        slideText:
          "The Fibonacci sequence is 1, 1, 2, 3, 5, 8, 13... Each number is the sum of the two before it. This magical pattern appears in sunflower seeds, spiral shells, and pinecones!",
      },
      {
        type: "multiChoice",
        text: "What is the next number in: 1, 1, 2, 3, 5, 8, ?",
        choices: ["12", "13", "11", "15"],
        correct: 1,
      },
      {
        type: "multiChoice",
        text: "How do you get the next Fibonacci number?",
        choices: [
          "Double the last",
          "Add the last two",
          "Multiply by 3",
          "Subtract 1",
        ],
        correct: 1,
      },
      {
        type: "multiChoice",
        text: "Fibonacci patterns appear in:",
        choices: [
          "Only computers",
          "Nature, like shells and flowers",
          "Only textbooks",
          "Only music",
        ],
        correct: 1,
      },
      {
        type: "multiChoice",
        text: "What is 3 + 5 in the Fibonacci sequence?",
        choices: ["7", "9", "8", "10"],
        correct: 2,
      },
      {
        type: "slide",
        text: "Well done! \ud83c\udf1f",
        slideText:
          "You have discovered that nature follows mathematical rules — the Fibonacci sequence appears in flowers, shells, galaxies, and art. Maths really is the language of the universe. Amazing!",
      },
    ],
  },
  {
    unitIndex: 8,
    lessonIndex: 2,
    title: "Symmetry in Nature",
    questions: [
      {
        type: "slide",
        text: "Why symmetry is everywhere in the natural world",
        slideText:
          "Butterflies, snowflakes, leaves, and human faces all have symmetry. Symmetry in nature often signals health and strength — and in maths, it is the foundation of geometry and design.",
      },
      {
        type: "slide",
        text: "Symmetry in Nature",
        slideText:
          "Symmetry means something looks the same on both sides. A butterfly's wings, a snowflake, and a starfish all have beautiful symmetry. Math helps us describe and measure it!",
      },
      {
        type: "multiChoice",
        text: "A butterfly has symmetry that looks the same:",
        choices: [
          "Top to bottom",
          "Left to right",
          "Inside out",
          "Only one side",
        ],
        correct: 1,
      },
      {
        type: "multiChoice",
        text: "A snowflake has how many lines of symmetry?",
        choices: ["1", "2", "3", "6"],
        correct: 3,
      },
      {
        type: "multiChoice",
        text: "Which shape has symmetry?",
        choices: [
          "Random squiggle",
          "A perfect circle",
          "A crumpled paper",
          "A broken stick",
        ],
        correct: 1,
      },
      {
        type: "multiChoice",
        text: "Symmetry means:",
        choices: [
          "Two halves are different",
          "Two halves match",
          "One side is bigger",
          "Nothing repeats",
        ],
        correct: 1,
      },
      {
        type: "slide",
        text: "Well done! \ud83c\udf1f",
        slideText:
          "You have seen how symmetry connects maths to biology, art, and architecture. Every time you notice a symmetric shape in nature or design, you are thinking mathematically. Brilliant!",
      },
    ],
  },
  {
    unitIndex: 8,
    lessonIndex: 3,
    title: "Probability & Chance",
    questions: [
      {
        type: "slide",
        text: "Why understanding chance is a life skill",
        slideText:
          "Will it rain tomorrow? What are the chances your team wins? Probability puts numbers on uncertainty — and it is used in weather forecasting, medicine, insurance, and game design every day.",
      },
      {
        type: "slide",
        text: "Probability & Chance",
        slideText:
          "Probability tells us how likely something is to happen. If you flip a coin, there's a 1 in 2 chance of heads. Math lets us predict outcomes even when things are random!",
      },
      {
        type: "multiChoice",
        text: "If you flip a fair coin, what is the chance of heads?",
        choices: ["1 in 4", "1 in 3", "1 in 2", "1 in 1"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "Rolling a normal die, what is the chance of getting a 6?",
        choices: ["1 in 2", "1 in 6", "1 in 3", "1 in 10"],
        correct: 1,
      },
      {
        type: "multiChoice",
        text: "Probability is always between:",
        choices: ["0 and 100", "0 and 1", "1 and 10", "-1 and 1"],
        correct: 1,
      },
      {
        type: "multiChoice",
        text: "A probability of 0 means:",
        choices: ["Very likely", "50/50 chance", "Impossible", "Certain"],
        correct: 2,
      },
      {
        type: "slide",
        text: "Well done! \ud83c\udf1f",
        slideText:
          "You now understand probability — used in sport statistics, medical trials, risk assessment, and artificial intelligence. This is one of the most practical and powerful ideas in maths. Superb!",
      },
    ],
  },
  {
    unitIndex: 8,
    lessonIndex: 4,
    title: "Systems & Feedback Loops",
    questions: [
      {
        type: "slide",
        text: "Why systems thinking changes how you see the world",
        slideText:
          "Your body temperature, global climate, economies, and ecosystems all operate as systems with feedback loops. Understanding these loops is how scientists predict and manage complex change.",
      },
      {
        type: "slide",
        text: "Systems & Feedback Loops",
        slideText:
          "A system is a group of parts working together. Feedback loops happen when the output of something loops back to affect the input. Your body temperature is a feedback loop!",
      },
      {
        type: "multiChoice",
        text: "A thermostat turns on heating when it's cold and off when warm. This is:",
        choices: [
          "A random event",
          "A feedback loop",
          "Broken math",
          "A probability",
        ],
        correct: 1,
      },
      {
        type: "multiChoice",
        text: "When feedback makes something grow bigger and bigger, it's called:",
        choices: [
          "Negative feedback",
          "Positive feedback",
          "No feedback",
          "Random feedback",
        ],
        correct: 1,
      },
      {
        type: "multiChoice",
        text: "What is a system?",
        choices: [
          "A single number",
          "Parts working together",
          "One big machine",
          "A type of symmetry",
        ],
        correct: 1,
      },
      {
        type: "multiChoice",
        text: "Which is an example of a system?",
        choices: [
          "A single leaf",
          "Your body's immune response",
          "One number",
          "A blank page",
        ],
        correct: 1,
      },
      {
        type: "dragDrop",
        text: "Put these steps of a feedback loop in the right order: first to last",
        dragItems: ["Effect", "Cause", "Response", "Measurement"],
        dragTarget: ["Cause", "Effect", "Measurement", "Response"],
      },
      {
        type: "slide",
        text: "Well done! \ud83c\udf1f",
        slideText:
          "You have learned systems thinking — one of the most important ideas in modern science. Climate models, biological research, and technology design all depend on what you studied here. Fantastic work!",
      },
    ],
  },
];

const ALL_LESSONS = [...LESSONS, ...EXTRA_LESSONS];

export function getLessonData(
  unitIndex: number,
  lessonIndex: number,
): LessonData | null {
  return (
    ALL_LESSONS.find(
      (l) => l.unitIndex === unitIndex && l.lessonIndex === lessonIndex,
    ) ?? null
  );
}
