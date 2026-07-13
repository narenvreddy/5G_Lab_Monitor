import type { LessonData } from "./lessons";

// Extra lessons added to expand question pools for all units (3–4x more content)
export const EXTRA_LESSONS: LessonData[] = [
  // ─── Unit 1: Numbers (lessonIndex 6–8) ───────────────────────────────────────
  {
    unitIndex: 1,
    lessonIndex: 6,
    title: "Number Order",
    questions: [
      {
        type: "multiChoice",
        text: "Which number comes after 7?",
        choices: ["6", "8", "9", "5"],
        correct: 1,
      },
      {
        type: "multiChoice",
        text: "Which number comes before 4?",
        choices: ["5", "2", "3", "6"],
        correct: 2,
      },
      {
        type: "trueFalse",
        text: "6 is greater than 9.",
        isTrue: false,
      },
      {
        type: "trueFalse",
        text: "3 is less than 5.",
        isTrue: true,
      },
      {
        type: "fillBlank",
        text: "What number is between 4 and 6?",
        answer: "5",
        hint: "Count: 4, __, 6",
      },
      {
        type: "dragDrop",
        text: "Put these numbers in order from smallest to biggest",
        dragItems: ["7", "2", "5", "1"],
        dragTarget: ["1", "2", "5", "7"],
      },
    ],
  },
  {
    unitIndex: 1,
    lessonIndex: 7,
    title: "Even and Odd Numbers",
    questions: [
      {
        type: "multiChoice",
        text: "Which of these is an even number?",
        choices: ["1", "3", "4", "7"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "Which of these is an odd number?",
        choices: ["2", "4", "5", "6"],
        correct: 2,
      },
      {
        type: "trueFalse",
        text: "10 is an even number.",
        isTrue: true,
      },
      {
        type: "trueFalse",
        text: "9 is an even number.",
        isTrue: false,
      },
      {
        type: "fillBlank",
        text: "What is the next even number after 6?",
        answer: "8",
        hint: "Even numbers: 2, 4, 6, ...",
      },
      {
        type: "dragDrop",
        text: "Match each number to even or odd",
        dragItems: ["2 → Even", "3 → Odd", "8 → Even", "5 → Odd"],
        dragTarget: ["2 → Even", "3 → Odd", "5 → Odd", "8 → Even"],
      },
    ],
  },
  {
    unitIndex: 1,
    lessonIndex: 8,
    title: "Counting to 20",
    questions: [
      {
        type: "multiChoice",
        text: "How many fingers do two people have altogether?",
        visual: "🤚🤚",
        choices: ["5", "15", "20", "10"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "What is 10 + 3?",
        choices: ["12", "13", "14", "15"],
        correct: 1,
      },
      {
        type: "trueFalse",
        text: "15 comes before 12 when counting forward.",
        isTrue: false,
      },
      {
        type: "fillBlank",
        text: "Count on from 14. What is the next number?",
        answer: "15",
        hint: "14, ...",
      },
      {
        type: "fillBlank",
        text: "How many tens are in 20?",
        answer: "2",
        hint: "10, 20 — count by tens",
      },
      {
        type: "dragDrop",
        text: "Put these numbers in order: smallest first",
        dragItems: ["15", "11", "18", "13"],
        dragTarget: ["11", "13", "15", "18"],
      },
    ],
  },

  // ─── Unit 2: Addition & Subtraction (lessonIndex 8–10) ───────────────────────
  {
    unitIndex: 2,
    lessonIndex: 6,
    title: "Adding to 20",
    questions: [
      {
        type: "multiChoice",
        text: "What is 9 + 8?",
        choices: ["16", "17", "18", "15"],
        correct: 1,
      },
      {
        type: "multiChoice",
        text: "What is 7 + 6?",
        choices: ["12", "13", "14", "11"],
        correct: 1,
      },
      {
        type: "trueFalse",
        text: "8 + 5 = 13",
        isTrue: true,
      },
      {
        type: "trueFalse",
        text: "6 + 7 = 14",
        isTrue: false,
      },
      {
        type: "fillBlank",
        text: "What is 10 + 9?",
        answer: "19",
        hint: "Start at 10 and count on 9",
      },
      {
        type: "dragDrop",
        text: "Match each addition to its answer",
        dragItems: ["6+6", "5+8", "9+9", "7+7"],
        dragTarget: ["6+6=12", "5+8=13", "7+7=14", "9+9=18"],
      },
    ],
  },
  {
    unitIndex: 2,
    lessonIndex: 7,
    title: "Subtracting from 20",
    questions: [
      {
        type: "multiChoice",
        text: "What is 18 − 9?",
        choices: ["8", "9", "10", "7"],
        correct: 1,
      },
      {
        type: "multiChoice",
        text: "What is 15 − 7?",
        choices: ["6", "7", "8", "9"],
        correct: 2,
      },
      {
        type: "trueFalse",
        text: "20 − 5 = 15",
        isTrue: true,
      },
      {
        type: "trueFalse",
        text: "14 − 6 = 9",
        isTrue: false,
      },
      {
        type: "fillBlank",
        text: "What is 20 − 8?",
        answer: "12",
        hint: "Count back 8 from 20",
      },
      {
        type: "dragDrop",
        text: "Match each subtraction to its answer",
        dragItems: ["16−8", "13−5", "17−9", "12−4"],
        dragTarget: ["16−8=8", "13−5=8", "12−4=8", "17−9=8"],
      },
    ],
  },
  {
    unitIndex: 2,
    lessonIndex: 8,
    title: "Word Problems: Add & Subtract",
    questions: [
      {
        type: "multiChoice",
        text: "Sam has 6 sweets. He gets 5 more. How many does he have now?",
        choices: ["10", "11", "12", "13"],
        correct: 1,
      },
      {
        type: "multiChoice",
        text: "There are 14 birds on a tree. 6 fly away. How many are left?",
        choices: ["6", "7", "8", "9"],
        correct: 2,
      },
      {
        type: "trueFalse",
        text: "If you have 10 apples and eat 4, you have 6 left.",
        isTrue: true,
      },
      {
        type: "fillBlank",
        text: "Tom scores 7 goals on Monday and 5 on Tuesday. How many goals in total?",
        answer: "12",
        hint: "7 + 5 = ?",
      },
      {
        type: "fillBlank",
        text: "A jar has 15 coins. You take out 8. How many remain?",
        answer: "7",
        hint: "15 − 8 = ?",
      },
      {
        type: "dragDrop",
        text: "Match the word problem to the correct equation",
        dragItems: [],
        dragTarget: ["9+5=14", "13−4=9", "6+6=12", "10−3=7"],
      },
    ],
  },

  // ─── Unit 3: Multiplication (lessonIndex 7–9) ─────────────────────────────────
  {
    unitIndex: 3,
    lessonIndex: 6,
    title: "Multiplying by 3 and 4",
    questions: [
      {
        type: "multiChoice",
        text: "What is 3 × 7?",
        choices: ["18", "21", "24", "20"],
        correct: 1,
      },
      {
        type: "multiChoice",
        text: "What is 4 × 6?",
        choices: ["20", "22", "24", "26"],
        correct: 2,
      },
      {
        type: "trueFalse",
        text: "3 × 8 = 24",
        isTrue: true,
      },
      {
        type: "trueFalse",
        text: "4 × 7 = 26",
        isTrue: false,
      },
      {
        type: "fillBlank",
        text: "What is 3 × 9?",
        answer: "27",
        hint: "3 × 9: add 3 nine times",
      },
      {
        type: "dragDrop",
        text: "Match each multiplication to its answer",
        dragItems: ["3×6", "4×5", "3×4", "4×8"],
        dragTarget: ["3×4=12", "3×6=18", "4×5=20", "4×8=32"],
      },
    ],
  },
  {
    unitIndex: 3,
    lessonIndex: 7,
    title: "Division Basics",
    questions: [
      {
        type: "multiChoice",
        text: "What is 12 ÷ 3?",
        choices: ["3", "4", "5", "6"],
        correct: 1,
      },
      {
        type: "multiChoice",
        text: "What is 20 ÷ 4?",
        choices: ["4", "5", "6", "7"],
        correct: 1,
      },
      {
        type: "trueFalse",
        text: "18 ÷ 6 = 3",
        isTrue: true,
      },
      {
        type: "trueFalse",
        text: "15 ÷ 3 = 6",
        isTrue: false,
      },
      {
        type: "fillBlank",
        text: "What is 24 ÷ 4?",
        answer: "6",
        hint: "4 × ? = 24",
      },
      {
        type: "dragDrop",
        text: "Match each division to its answer",
        dragItems: ["10÷2", "16÷4", "21÷3", "36÷6"],
        dragTarget: ["10÷2=5", "16÷4=4", "21÷3=7", "36÷6=6"],
      },
    ],
  },
  {
    unitIndex: 3,
    lessonIndex: 8,
    title: "Multiplication Word Problems",
    questions: [
      {
        type: "multiChoice",
        text: "There are 5 bags with 4 apples each. How many apples in total?",
        choices: ["16", "18", "20", "24"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "A box holds 6 chocolates. How many chocolates in 3 boxes?",
        choices: ["12", "15", "18", "21"],
        correct: 2,
      },
      {
        type: "trueFalse",
        text: "3 groups of 7 equals 21.",
        isTrue: true,
      },
      {
        type: "fillBlank",
        text: "8 children each have 3 pencils. How many pencils altogether?",
        answer: "24",
        hint: "8 × 3 = ?",
      },
      {
        type: "fillBlank",
        text: "A spider has 8 legs. How many legs do 4 spiders have?",
        answer: "32",
        hint: "4 × 8 = ?",
      },
      {
        type: "dragDrop",
        text: "Match the word problem to the multiplication",
        dragItems: [],
        dragTarget: ["2×6=12", "3×5=15", "4×4=16", "7×2=14"],
      },
    ],
  },

  // ─── Unit 4: Place Value (lessonIndex 6–8) ────────────────────────────────────
  {
    unitIndex: 4,
    lessonIndex: 6,
    title: "Hundreds, Tens and Ones",
    questions: [
      {
        type: "multiChoice",
        text: "In 347, what digit is in the tens place?",
        choices: ["3", "4", "7", "0"],
        correct: 1,
      },
      {
        type: "multiChoice",
        text: "What is the value of the 5 in 532?",
        choices: ["5", "50", "500", "5000"],
        correct: 2,
      },
      {
        type: "trueFalse",
        text: "In 256, the digit 2 is worth 200.",
        isTrue: true,
      },
      {
        type: "trueFalse",
        text: "The number 409 has a 4 in the tens place.",
        isTrue: false,
      },
      {
        type: "fillBlank",
        text: "What is 3 hundreds + 6 tens + 2 ones?",
        answer: "362",
        hint: "300 + 60 + 2 = ?",
      },
      {
        type: "dragDrop",
        text: "Match each number to its expanded form",
        dragItems: ["125", "304", "560", "218"],
        dragTarget: ["100+20+5", "300+0+4", "500+60+0", "200+10+8"],
      },
    ],
  },
  {
    unitIndex: 4,
    lessonIndex: 7,
    title: "Rounding Numbers",
    questions: [
      {
        type: "multiChoice",
        text: "Round 47 to the nearest 10.",
        choices: ["40", "50", "45", "48"],
        correct: 1,
      },
      {
        type: "multiChoice",
        text: "Round 83 to the nearest 10.",
        choices: ["80", "90", "85", "70"],
        correct: 0,
      },
      {
        type: "trueFalse",
        text: "65 rounds up to 70 when rounding to the nearest 10.",
        isTrue: true,
      },
      {
        type: "trueFalse",
        text: "342 rounds to 300 when rounding to the nearest 100.",
        isTrue: true,
      },
      {
        type: "fillBlank",
        text: "Round 76 to the nearest 10.",
        answer: "80",
        hint: "Is 76 closer to 70 or 80?",
      },
      {
        type: "dragDrop",
        text: "Match each number to its rounded value (nearest 10)",
        dragItems: ["32", "58", "75", "91"],
        dragTarget: ["32→30", "58→60", "75→80", "91→90"],
      },
    ],
  },
  {
    unitIndex: 4,
    lessonIndex: 8,
    title: "Comparing Large Numbers",
    questions: [
      {
        type: "multiChoice",
        text: "Which number is greater: 456 or 465?",
        choices: ["456", "465", "They are equal", "Cannot tell"],
        correct: 1,
      },
      {
        type: "multiChoice",
        text: "Order from smallest to largest: 301, 310, 130",
        choices: [],
        correct: 1,
      },
      {
        type: "trueFalse",
        text: "789 is greater than 798.",
        isTrue: false,
      },
      {
        type: "fillBlank",
        text: "What symbol goes between 452 and 425? (< or >)",
        answer: ">",
        hint: "452 is bigger than 425",
      },
      {
        type: "fillBlank",
        text: "What is 100 more than 375?",
        answer: "475",
        hint: "Add 1 to the hundreds digit",
      },
      {
        type: "dragDrop",
        text: "Put these numbers in order from greatest to least",
        dragItems: ["512", "251", "521", "125"],
        dragTarget: ["521", "512", "251", "125"],
      },
    ],
  },

  // ─── Unit 5: Fractions (lessonIndex 7–9) ─────────────────────────────────────
  {
    unitIndex: 5,
    lessonIndex: 6,
    title: "Fractions on a Number Line",
    questions: [
      {
        type: "multiChoice",
        text: "Where does 1/2 sit on a number line from 0 to 1?",
        choices: ["At the start", "In the middle", "At the end", "After 1"],
        correct: 1,
      },
      {
        type: "multiChoice",
        text: "Which fraction is closest to 1 whole?",
        choices: ["1/4", "1/3", "3/4", "1/2"],
        correct: 2,
      },
      {
        type: "trueFalse",
        text: "1/4 is less than 1/2 on a number line.",
        isTrue: true,
      },
      {
        type: "trueFalse",
        text: "2/4 is the same as 1/2.",
        isTrue: true,
      },
      {
        type: "fillBlank",
        text: "What fraction is halfway between 0 and 1/2?",
        answer: "1/4",
        hint: "Split 0 to 1/2 into two equal parts",
      },
      {
        type: "dragDrop",
        text: "Put these fractions in order from smallest to largest",
        dragItems: ["3/4", "1/4", "1/2", "1"],
        dragTarget: ["1/4", "1/2", "3/4", "1"],
      },
    ],
  },
  {
    unitIndex: 5,
    lessonIndex: 7,
    title: "Adding Simple Fractions",
    questions: [
      {
        type: "multiChoice",
        text: "What is 1/4 + 1/4?",
        choices: ["1/8", "1/4", "1/2", "2/8"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "What is 1/3 + 1/3?",
        choices: ["1/6", "2/6", "2/3", "1/3"],
        correct: 2,
      },
      {
        type: "trueFalse",
        text: "1/4 + 3/4 = 1 whole.",
        isTrue: true,
      },
      {
        type: "trueFalse",
        text: "2/5 + 2/5 = 4/10.",
        isTrue: false,
      },
      {
        type: "fillBlank",
        text: "What is 1/6 + 2/6?",
        answer: "3/6",
        hint: "Add the top numbers, keep the bottom the same",
      },
      {
        type: "multiChoice",
        text: "What is 1/8 + 3/8?",
        choices: ["2/8", "4/8", "5/8", "6/8"],
        correct: 1,
      },
    ],
  },
  {
    unitIndex: 5,
    lessonIndex: 8,
    title: "Fractions of Shapes and Groups",
    questions: [
      {
        type: "multiChoice",
        text: "A pizza is cut into 8 equal slices. You eat 3. What fraction did you eat?",
        choices: ["1/3", "3/5", "3/8", "5/8"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "There are 12 sweets. You take 1/4 of them. How many is that?",
        choices: ["2", "3", "4", "6"],
        correct: 1,
      },
      {
        type: "trueFalse",
        text: "Half of 10 is 5.",
        isTrue: true,
      },
      {
        type: "trueFalse",
        text: "A quarter of 20 is 6.",
        isTrue: false,
      },
      {
        type: "fillBlank",
        text: "What is 1/3 of 9?",
        answer: "3",
        hint: "Divide 9 into 3 equal groups",
      },
      {
        type: "dragDrop",
        text: "Match each fraction of a group to its value",
        dragItems: ["1/2 of 8", "1/4 of 16", "1/3 of 12", "1/5 of 10"],
        dragTarget: ["1/2 of 8=4", "1/4 of 16=4", "1/3 of 12=4", "1/5 of 10=2"],
      },
    ],
  },

  // ─── Unit 6: Algebra (lessonIndex 6–8) ───────────────────────────────────────
  {
    unitIndex: 6,
    lessonIndex: 6,
    title: "Finding the Missing Number",
    questions: [
      {
        type: "multiChoice",
        text: "What is the missing number? 5 + __ = 12",
        choices: ["5", "6", "7", "8"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "What is the missing number? __ × 3 = 18",
        choices: ["4", "5", "6", "7"],
        correct: 2,
      },
      {
        type: "trueFalse",
        text: "In the equation 9 − __ = 4, the missing number is 5.",
        isTrue: true,
      },
      {
        type: "trueFalse",
        text: "In 4 × __ = 24, the missing number is 5.",
        isTrue: false,
      },
      {
        type: "fillBlank",
        text: "What is the missing number? __ + 8 = 15",
        answer: "7",
        hint: "15 − 8 = ?",
      },
      {
        type: "multiChoice",
        text: "What is the missing number? __ + 6 = 10",
        choices: ["3", "4", "5", "6"],
        correct: 1,
      },
    ],
  },
  {
    unitIndex: 6,
    lessonIndex: 7,
    title: "Patterns and Sequences",
    questions: [
      {
        type: "multiChoice",
        text: "What comes next? 2, 4, 6, 8, __",
        choices: ["9", "10", "11", "12"],
        correct: 1,
      },
      {
        type: "multiChoice",
        text: "What comes next? 5, 10, 15, 20, __",
        choices: ["22", "24", "25", "30"],
        correct: 2,
      },
      {
        type: "trueFalse",
        text: "The pattern 3, 6, 9, 12 increases by 3 each time.",
        isTrue: true,
      },
      {
        type: "trueFalse",
        text: "The sequence 1, 2, 4, 7 increases by the same amount each time.",
        isTrue: false,
      },
      {
        type: "fillBlank",
        text: "What is the next number? 100, 90, 80, 70, __",
        answer: "60",
        hint: "The pattern decreases by 10",
      },
      {
        type: "multiChoice",
        text: "What is the rule for the sequence 2, 4, 6, 8?",
        choices: ["Add 1", "Add 2", "Multiply by 2", "Add 3"],
        correct: 1,
      },
    ],
  },
  {
    unitIndex: 6,
    lessonIndex: 8,
    title: "Writing Simple Equations",
    questions: [
      {
        type: "multiChoice",
        text: "Which equation matches: 'double a number n gives 16'?",
        choices: ["n + 2 = 16", "2n = 16", "n − 2 = 16", "n/2 = 16"],
        correct: 1,
      },
      {
        type: "multiChoice",
        text: "If n = 5, what is n + 7?",
        choices: ["10", "11", "12", "13"],
        correct: 2,
      },
      {
        type: "trueFalse",
        text: "If n = 4, then 3n = 12.",
        isTrue: true,
      },
      {
        type: "trueFalse",
        text: "n + n is the same as 3n.",
        isTrue: false,
      },
      {
        type: "fillBlank",
        text: "If n = 6, what is n × 4?",
        answer: "24",
        hint: "Replace n with 6 and multiply",
      },
      {
        type: "dragDrop",
        text: "Match each phrase to its equation",
        dragItems: ["triple x", "x plus 10", "x take away 5", "half of x"],
        dragTarget: ["3x", "x+10", "x−5", "x÷2"],
      },
    ],
  },

  // ─── Unit 7: History of Numbers (lessonIndex 5–7) ────────────────────────────
  {
    unitIndex: 7,
    lessonIndex: 5,
    title: "Ancient Number Systems",
    questions: [
      {
        type: "multiChoice",
        text: "Which ancient civilisation invented one of the first number systems?",
        choices: ["Romans", "Egyptians", "Vikings", "Aztecs"],
        correct: 1,
      },
      {
        type: "multiChoice",
        text: "What symbol does Roman numerals use for 5?",
        choices: ["I", "X", "V", "L"],
        correct: 2,
      },
      {
        type: "trueFalse",
        text: "The Romans used the letter X to represent 10.",
        isTrue: true,
      },
      {
        type: "trueFalse",
        text: "Ancient Egyptians used the same number symbols we use today.",
        isTrue: false,
      },
      {
        type: "fillBlank",
        text: "What is VII in modern numbers?",
        answer: "7",
        hint: "V = 5, I = 1",
      },
      {
        type: "dragDrop",
        text: "Match each Roman numeral to its value",
        dragItems: ["I", "V", "X", "L"],
        dragTarget: ["I=1", "V=5", "X=10", "L=50"],
      },
    ],
  },
  {
    unitIndex: 7,
    lessonIndex: 6,
    title: "Zero and Place Value in History",
    questions: [
      {
        type: "multiChoice",
        text: "Which civilisation is credited with inventing the concept of zero?",
        choices: ["Greeks", "Romans", "Indians", "Chinese"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "Why is zero important in our number system?",
        choices: [],
        correct: 1,
      },
      {
        type: "trueFalse",
        text: "Without zero, we could not write the number 100.",
        isTrue: true,
      },
      {
        type: "trueFalse",
        text: "The Romans had a symbol for zero.",
        isTrue: false,
      },
      {
        type: "fillBlank",
        text: "How many zeros are in one thousand (1000)?",
        answer: "3",
        hint: "Count the 0s in 1000",
      },
      {
        type: "multiChoice",
        text: "Which civilisation invented the concept of zero?",
        choices: ["Romans", "Greeks", "Ancient Indians", "Egyptians"],
        correct: 2,
      },
    ],
  },
  {
    unitIndex: 7,
    lessonIndex: 7,
    title: "Binary and Modern Numbers",
    questions: [
      {
        type: "multiChoice",
        text: "How many digits does the binary number system use?",
        choices: ["10", "2", "8", "16"],
        correct: 1,
      },
      {
        type: "multiChoice",
        text: "What is the binary number 10 equal to in decimal?",
        choices: ["1", "2", "10", "3"],
        correct: 1,
      },
      {
        type: "trueFalse",
        text: "Computers use binary (0s and 1s) to store information.",
        isTrue: true,
      },
      {
        type: "trueFalse",
        text: "Binary and decimal use the same number of digits.",
        isTrue: false,
      },
      {
        type: "fillBlank",
        text: "In binary, what does the digit 0 represent in terms of electricity? (on/off)",
        answer: "off",
        hint: "0 = off, 1 = on",
      },
      {
        type: "dragDrop",
        text: "Match each binary number to its decimal value",
        dragItems: ["1", "10", "11", "100"],
        dragTarget: ["1=1", "10=2", "11=3", "100=4"],
      },
    ],
  },

  // ─── Unit 8: Complexity Science (lessonIndex 5–7) ────────────────────────────
  {
    unitIndex: 8,
    lessonIndex: 5,
    title: "Big Numbers and Powers",
    questions: [
      {
        type: "multiChoice",
        text: "What does 10² mean?",
        choices: ["10 + 2", "10 × 2", "10 × 10", "2 × 2"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "What is 2³?",
        choices: ["6", "8", "9", "16"],
        correct: 1,
      },
      {
        type: "trueFalse",
        text: "10³ = 1000",
        isTrue: true,
      },
      {
        type: "trueFalse",
        text: "3² = 6",
        isTrue: false,
      },
      {
        type: "fillBlank",
        text: "What is 5²?",
        answer: "25",
        hint: "5 × 5 = ?",
      },
      {
        type: "dragDrop",
        text: "Match each power to its value",
        dragItems: ["2²", "3²", "4²", "5²"],
        dragTarget: ["2²=4", "3²=9", "4²=16", "5²=25"],
      },
    ],
  },
  {
    unitIndex: 8,
    lessonIndex: 6,
    title: "Multi-Step Problems",
    questions: [
      {
        type: "multiChoice",
        text: "A class of 30 students splits into groups of 5. Each group needs 3 worksheets. How many worksheets in total?",
        choices: ["15", "18", "30", "18"],
        correct: 1,
      },
      {
        type: "multiChoice",
        text: "A recipe needs 4 eggs per cake. You make 3 cakes and already have 6 eggs. How many more eggs do you need?",
        choices: ["4", "5", "6", "7"],
        correct: 2,
      },
      {
        type: "trueFalse",
        text: "To find the perimeter of a rectangle with length 8 and width 5, you calculate 8 + 5 + 8 + 5 = 26.",
        isTrue: true,
      },
      {
        type: "fillBlank",
        text: "A train travels 60 km/h for 3 hours. How far does it travel?",
        answer: "180",
        hint: "distance = speed × time",
      },
      {
        type: "fillBlank",
        text: "Sarah earns £8 per hour. She works 5 hours on Saturday and 3 on Sunday. How much does she earn in total?",
        answer: "64",
        hint: "(5 + 3) × 8 = ?",
      },
      {
        type: "multiChoice",
        text: "What is the first step when solving a word problem?",
        choices: [
          "Calculate the answer",
          "Read and understand the problem",
          "Write the equation",
          "Check your answer",
        ],
        correct: 1,
      },
    ],
  },
  {
    unitIndex: 8,
    lessonIndex: 7,
    title: "Logic and Reasoning",
    questions: [
      {
        type: "multiChoice",
        text: "All cats are animals. Whiskers is a cat. Therefore Whiskers is...",
        choices: ["A dog", "An animal", "A plant", "A bird"],
        correct: 1,
      },
      {
        type: "multiChoice",
        text: "If a number is divisible by 4 and by 3, it is divisible by...",
        choices: ["7", "10", "12", "6"],
        correct: 2,
      },
      {
        type: "trueFalse",
        text: "If A > B and B > C, then A > C.",
        isTrue: true,
      },
      {
        type: "trueFalse",
        text: "A number can be both even and odd.",
        isTrue: false,
      },
      {
        type: "fillBlank",
        text: "If all squares are rectangles, and a shape is a square, what type of shape is it also?",
        answer: "rectangle",
        hint: "Use the 'all squares are...' rule",
      },
      {
        type: "multiChoice",
        text: "In logic, what does 'If A then B' mean?",
        choices: [
          "A and B are equal",
          "A causes or implies B",
          "B causes A",
          "A or B",
        ],
        correct: 1,
      },
    ],
  },

  // ─── Sprint 18: Unit 6 Algebra additions ──────────────────────────────────────
  {
    unitIndex: 6,
    lessonIndex: 9,
    title: "Variables and Expressions",
    questions: [
      {
        type: "multiChoice",
        text: "If x = 3, what is x + 5?",
        choices: ["6", "7", "8", "9"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "What is 2y when y = 4?",
        choices: ["6", "8", "10", "2"],
        correct: 1,
      },
      {
        type: "trueFalse",
        text: "In algebra, a variable like n can represent any number.",
        isTrue: true,
      },
      {
        type: "multiChoice",
        text: "Solve: n - 4 = 7. What is n?",
        choices: ["3", "11", "28", "10"],
        correct: 1,
      },
      {
        type: "fillBlank",
        text: "If a = 6 and b = 2, what is a ÷ b?",
        answer: "3",
        hint: "6 ÷ 2 = ?",
      },
      {
        type: "multiChoice",
        text: "Which expression equals 12 when x = 4?",
        choices: ["x + 4", "x × 3", "x + 3", "x × 4"],
        correct: 1,
      },
      {
        type: "trueFalse",
        text: "3x means 3 multiplied by x.",
        isTrue: true,
      },
    ],
  },
  {
    unitIndex: 6,
    lessonIndex: 10,
    title: "Algebraic Patterns and Sequences",
    questions: [
      {
        type: "multiChoice",
        text: "What is the next number in the pattern: 2, 4, 6, 8, ___?",
        choices: ["9", "10", "12", "14"],
        correct: 1,
      },
      {
        type: "multiChoice",
        text: "What is the rule for this sequence: 3, 6, 12, 24, ___?",
        choices: ["Add 3", "Multiply by 2", "Add 6", "Multiply by 3"],
        correct: 1,
      },
      {
        type: "trueFalse",
        text: "The sequence 1, 4, 9, 16, 25 is made of square numbers.",
        isTrue: true,
      },
      {
        type: "fillBlank",
        text: "What is the missing number: 5, 10, ___, 20, 25?",
        answer: "15",
        hint: "Count up in fives",
      },
      {
        type: "multiChoice",
        text: "If the pattern rule is 'multiply by 3', what comes after 9?",
        choices: ["12", "18", "27", "30"],
        correct: 2,
      },
    ],
  },

  // ─── Sprint 18: Unit 7 History additions ─────────────────────────────────────
  {
    unitIndex: 7,
    lessonIndex: 8,
    title: "Famous Mathematicians",
    questions: [
      {
        type: "multiChoice",
        text: "Which ancient Greek mathematician is known as the 'Father of Geometry'?",
        choices: ["Pythagoras", "Archimedes", "Euclid", "Plato"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "Who invented a famous theorem about right-angled triangles?",
        choices: ["Euclid", "Newton", "Pythagoras", "Galileo"],
        correct: 2,
      },
      {
        type: "trueFalse",
        text: "Ada Lovelace is considered one of the first computer programmers.",
        isTrue: true,
      },
      {
        type: "multiChoice",
        text: "Which mathematician discovered gravity after (according to legend) seeing an apple fall?",
        choices: ["Einstein", "Newton", "Galileo", "Copernicus"],
        correct: 1,
      },
      {
        type: "trueFalse",
        text: "The number zero was invented in ancient Rome.",
        isTrue: false,
      },
      {
        type: "multiChoice",
        text: "What did the ancient Egyptians use to record numbers?",
        choices: ["Binary code", "Hieroglyphs", "Roman numerals", "Cuneiform"],
        correct: 1,
      },
    ],
  },
  {
    unitIndex: 7,
    lessonIndex: 9,
    title: "Number Systems Around the World",
    questions: [
      {
        type: "multiChoice",
        text: "The Mayan number system was based on which number?",
        choices: ["10", "12", "20", "60"],
        correct: 2,
      },
      {
        type: "multiChoice",
        text: "Which number system do computers use?",
        choices: [],
        correct: 1,
      },
      {
        type: "trueFalse",
        text: "Roman numerals are still used today in some situations (like on clocks).",
        isTrue: true,
      },
      {
        type: "fillBlank",
        text: "The number system most people use every day is called the decimal system, which has how many digits?",
        answer: "10",
        hint: "Count from 0 to 9",
      },
      {
        type: "multiChoice",
        text: "Which ancient civilisation used a sexagesimal (base-60) number system — which is why we have 60 seconds in a minute?",
        choices: ["Egyptians", "Babylonians", "Greeks", "Chinese"],
        correct: 1,
      },
    ],
  },

  // ─── Sprint 18: Unit 8 Complexity additions ──────────────────────────────────
  {
    unitIndex: 8,
    lessonIndex: 8,
    title: "Patterns in Nature",
    questions: [
      {
        type: "multiChoice",
        text: "The Fibonacci sequence (1, 1, 2, 3, 5, 8…) appears in which natural object?",
        choices: ["A square", "A sunflower", "A triangle", "A cube"],
        correct: 1,
      },
      {
        type: "trueFalse",
        text: "A fractal is a shape that looks similar at different scales (when zoomed in or out).",
        isTrue: true,
      },
      {
        type: "multiChoice",
        text: "Which of these is an example of a pattern in nature?",
        choices: [],
        correct: 1,
      },
      {
        type: "multiChoice",
        text: "What is the next number in the Fibonacci sequence: 1, 1, 2, 3, 5, 8, ___?",
        choices: ["11", "12", "13", "16"],
        correct: 2,
      },
      {
        type: "trueFalse",
        text: "Symmetry means that one half of a shape mirrors the other half.",
        isTrue: true,
      },
      {
        type: "fillBlank",
        text: "How many sides does a hexagon (like a honeycomb cell) have?",
        answer: "6",
        hint: "Hex means six in Greek",
      },
    ],
  },
  {
    unitIndex: 8,
    lessonIndex: 9,
    title: "Data and Sorting",
    questions: [
      {
        type: "multiChoice",
        text: "Which of these shows information organised so it is easy to read?",
        choices: [],
        correct: 1,
      },
      {
        type: "trueFalse",
        text: "A tally chart uses marks grouped in fives to count things quickly.",
        isTrue: true,
      },
      {
        type: "multiChoice",
        text: "If you collect data about favourite colours in your class, what type of chart works best?",
        choices: ["A number line", "A bar chart", "A calendar", "A ruler"],
        correct: 1,
      },
      {
        type: "multiChoice",
        text: "What is the 'average' (mean) of 2, 4, and 6?",
        choices: ["3", "4", "5", "6"],
        correct: 1,
      },
      {
        type: "trueFalse",
        text: "Sorting data means putting it in order so it is easier to understand.",
        isTrue: true,
      },
      {
        type: "fillBlank",
        text: "A pie chart shows data as slices of a circle. If one slice is half the circle, what percentage is it?",
        answer: "50",
        hint: "Half = 50%",
      },
    ],
  },

  // ─── Unit 6: Algebra & Patterns (lessonIndex 11–13) ──────────────────────────
  {
    unitIndex: 6,
    lessonIndex: 11,
    title: "Function Machines",
    questions: [
      {
        type: "multiChoice",
        text: "A function machine doubles the input. If the input is 5, what is the output?",
        choices: ["5", "10", "15", "25"],
        correct: 1,
      },
      {
        type: "multiChoice",
        text: "A machine adds 7 to every number. Input is 3. What is the output?",
        choices: ["4", "21", "10", "37"],
        correct: 2,
      },
      {
        type: "trueFalse",
        text: "A function machine always does the same operation to every input.",
        isTrue: true,
      },
      {
        type: "fillBlank",
        text: "A machine multiplies by 3. Input is 4. Output is ___.",
        answer: "12",
        hint: "4 × 3 = ?",
      },
      {
        type: "multiChoice",
        text: "A machine subtracts 2. Input is 9. Output is?",
        choices: ["11", "18", "7", "2"],
        correct: 2,
      },
      {
        type: "trueFalse",
        text: "If a function machine adds 5, an input of 0 gives an output of 0.",
        isTrue: false,
      },
    ],
  },
  {
    unitIndex: 6,
    lessonIndex: 12,
    title: "Input/Output Tables",
    questions: [
      {
        type: "multiChoice",
        text: "Input: 1→3, 2→6, 3→9. What is the rule?",
        choices: ["Add 2", "Multiply by 3", "Add 3", "Multiply by 2"],
        correct: 1,
      },
      {
        type: "trueFalse",
        text: "In an input/output table, each input always gives exactly one output.",
        isTrue: true,
      },
      {
        type: "fillBlank",
        text: "Rule: add 10. Input 7, output is ___.",
        answer: "17",
        hint: "7 + 10 = ?",
      },
      {
        type: "multiChoice",
        text: "Input: 2→4, 4→8, 6→12. What is the missing output for input 5?",
        choices: ["5", "10", "15", "25"],
        correct: 1,
      },
      {
        type: "trueFalse",
        text: "If the rule is subtract 4, input 4 gives output 0.",
        isTrue: true,
      },
    ],
  },
  {
    unitIndex: 6,
    lessonIndex: 13,
    title: "Solving Simple Equations",
    questions: [
      {
        type: "multiChoice",
        text: "What value of x makes x + 5 = 12?",
        choices: ["17", "5", "7", "60"],
        correct: 2,
      },
      {
        type: "fillBlank",
        text: "Solve: n - 3 = 8. n = ___.",
        answer: "11",
        hint: "Add 3 to both sides: 8 + 3",
      },
      {
        type: "trueFalse",
        text: "In the equation 2x = 10, x equals 5.",
        isTrue: true,
      },
      {
        type: "multiChoice",
        text: "Which value makes 3y = 15 true?",
        choices: ["3", "12", "45", "5"],
        correct: 3,
      },
      {
        type: "fillBlank",
        text: "If 4 + p = 10, then p = ___.",
        answer: "6",
        hint: "10 - 4 = ?",
      },
    ],
  },
  // ─── Unit 7: History of Numbers (lessonIndex 10–12) ──────────────────────────
  {
    unitIndex: 7,
    lessonIndex: 10,
    title: "Ancient Egyptian Numbers",
    questions: [
      {
        type: "multiChoice",
        text: "Ancient Egyptians used which writing system for numbers?",
        choices: ["Roman numerals", "Hieroglyphs", "Cuneiform", "Binary"],
        correct: 1,
      },
      {
        type: "trueFalse",
        text: "Ancient Egyptian numerals were based on groups of ten.",
        isTrue: true,
      },
      {
        type: "multiChoice",
        text: "What shape did Egyptians use to represent the number 10?",
        choices: [
          "A circle",
          "A vertical line",
          "An arch or heel bone",
          "A coil",
        ],
        correct: 2,
      },
      {
        type: "trueFalse",
        text: "The ancient Egyptians had a symbol for zero.",
        isTrue: false,
      },
      {
        type: "fillBlank",
        text: "Egyptian numerals used pictures called ___ to represent numbers.",
        answer: "hieroglyphs",
        hint: "These were picture symbols used in ancient Egypt",
      },
    ],
  },
  {
    unitIndex: 7,
    lessonIndex: 11,
    title: "The Invention of Zero",
    questions: [
      {
        type: "multiChoice",
        text: "Which ancient civilisation is most credited with inventing zero as a number?",
        choices: ["Romans", "Egyptians", "Indians", "Greeks"],
        correct: 2,
      },
      {
        type: "trueFalse",
        text: "Zero is used as a placeholder in our number system.",
        isTrue: true,
      },
      {
        type: "multiChoice",
        text: "Without zero, which number would be hard to write?",
        choices: ["5", "100", "7", "3"],
        correct: 1,
      },
      {
        type: "trueFalse",
        text: "Zero has a value; it means 'none' or 'nothing'.",
        isTrue: true,
      },
      {
        type: "fillBlank",
        text: "Zero acts as a ___ in numbers like 305, holding the tens place.",
        answer: "placeholder",
        hint: "It keeps digits in the right positions",
      },
    ],
  },
  {
    unitIndex: 7,
    lessonIndex: 12,
    title: "The Fibonacci Sequence",
    questions: [
      {
        type: "multiChoice",
        text: "What are the first five Fibonacci numbers?",
        choices: [
          "1, 2, 4, 8, 16",
          "1, 1, 2, 3, 5",
          "0, 1, 2, 3, 4",
          "2, 4, 6, 8, 10",
        ],
        correct: 1,
      },
      {
        type: "trueFalse",
        text: "Each Fibonacci number is the sum of the two numbers before it.",
        isTrue: true,
      },
      {
        type: "fillBlank",
        text: "In the sequence 1, 1, 2, 3, 5, 8, the next number is ___.",
        answer: "13",
        hint: "5 + 8 = ?",
      },
      {
        type: "multiChoice",
        text: "Who first described the Fibonacci sequence in the Western world?",
        choices: ["Pythagoras", "Leonardo Fibonacci", "Isaac Newton", "Euclid"],
        correct: 1,
      },
      {
        type: "trueFalse",
        text: "Fibonacci numbers appear in nature, like in flower petals and shells.",
        isTrue: true,
      },
    ],
  },
  // ─── Unit 8: Complexity Science (lessonIndex 10–12) ──────────────────────────
  {
    unitIndex: 8,
    lessonIndex: 10,
    title: "Fractals",
    questions: [
      {
        type: "multiChoice",
        text: "What is a fractal?",
        choices: [
          "A type of straight line",
          "A shape that repeats its pattern at different scales",
          "A way to count large numbers",
          "A kind of subtraction",
        ],
        correct: 1,
      },
      {
        type: "trueFalse",
        text: "Fractals have patterns that look similar no matter how much you zoom in.",
        isTrue: true,
      },
      {
        type: "multiChoice",
        text: "Which of these is an example of a fractal in nature?",
        choices: ["A square", "A straight road", "A snowflake", "A cube"],
        correct: 2,
      },
      {
        type: "trueFalse",
        text: "Fractals are only found in maths, never in real life.",
        isTrue: false,
      },
      {
        type: "fillBlank",
        text: "A fractal is a shape with ___ detail at every level of magnification.",
        answer: "repeating",
        hint: "The same pattern appears over and over",
      },
    ],
  },
  {
    unitIndex: 8,
    lessonIndex: 11,
    title: "Networks and Connections",
    questions: [
      {
        type: "multiChoice",
        text: "In a network, what do we call the connected points?",
        choices: ["Edges", "Nodes", "Lines", "Layers"],
        correct: 1,
      },
      {
        type: "trueFalse",
        text: "The internet is an example of a network.",
        isTrue: true,
      },
      {
        type: "multiChoice",
        text: "What do we call the connections between nodes in a network?",
        choices: ["Nodes", "Hubs", "Edges", "Maps"],
        correct: 2,
      },
      {
        type: "trueFalse",
        text: "A spider's web is a type of network found in nature.",
        isTrue: true,
      },
      {
        type: "fillBlank",
        text: "A group of computers all connected together is called a ___.",
        answer: "network",
        hint: "Think about how the internet works",
      },
    ],
  },
  {
    unitIndex: 8,
    lessonIndex: 12,
    title: "Emergence and the Butterfly Effect",
    questions: [
      {
        type: "multiChoice",
        text: "What does 'emergence' mean in complexity science?",
        choices: [
          "A big thing breaks into small things",
          "Simple parts working together create surprising new behaviours",
          "Numbers get bigger over time",
          "One person makes all the decisions",
        ],
        correct: 1,
      },
      {
        type: "trueFalse",
        text: "The butterfly effect suggests that small changes can lead to big results over time.",
        isTrue: true,
      },
      {
        type: "multiChoice",
        text: "Which is the best example of emergence?",
        choices: [
          "A single ant walking alone",
          "An ant colony building a complex nest together",
          "A calculator adding numbers",
          "A ruler measuring length",
        ],
        correct: 1,
      },
      {
        type: "trueFalse",
        text: "The butterfly effect means butterflies control the weather.",
        isTrue: false,
      },
      {
        type: "fillBlank",
        text: "When the whole is greater than the sum of its parts, scientists call this ___.",
        answer: "emergence",
        hint: "Think about what happens when ants or birds work together",
      },
    ],
  },
  // ─── Sprint 25: Extra questions for units 1–5 ───────────────────────────────
  {
    unitIndex: 1,
    lessonIndex: 9,
    title: "Comparing Numbers",
    questions: [
      {
        type: "multiChoice",
        text: "Which number is greater: 47 or 74?",
        choices: ["47", "74", "They are equal", "Cannot tell"],
        correct: 1,
      },
      { type: "trueFalse", text: "56 is greater than 65.", isTrue: false },
      {
        type: "fillBlank",
        text: "What number is 10 more than 38?",
        answer: "48",
        hint: "38 + 10 = ?",
      },
      {
        type: "multiChoice",
        text: "Order from smallest: 23, 12, 45, 8",
        choices: [
          "8, 12, 23, 45",
          "45, 23, 12, 8",
          "12, 8, 23, 45",
          "8, 23, 12, 45",
        ],
        correct: 0,
      },
      { type: "trueFalse", text: "99 is less than 100.", isTrue: true },
      {
        type: "fillBlank",
        text: "What number comes between 29 and 31?",
        answer: "30",
        hint: "Count between 29 and 31",
      },
    ],
  },
  {
    unitIndex: 2,
    lessonIndex: 11,
    title: "Mental Maths Strategies",
    questions: [
      {
        type: "multiChoice",
        text: "What is 25 + 25?",
        choices: ["40", "45", "50", "55"],
        correct: 2,
      },
      {
        type: "trueFalse",
        text: "To add 9, you can add 10 and subtract 1.",
        isTrue: true,
      },
      {
        type: "fillBlank",
        text: "What is 100 - 37?",
        answer: "63",
        hint: "100 - 30 = 70, then 70 - 7 = ?",
      },
      {
        type: "multiChoice",
        text: "What is 48 + 12?",
        choices: ["56", "58", "60", "62"],
        correct: 2,
      },
      { type: "trueFalse", text: "Double 34 equals 68.", isTrue: true },
      {
        type: "fillBlank",
        text: "What is 75 - 25?",
        answer: "50",
        hint: "Think of 75 - 25 as taking away 25",
      },
    ],
  },
  {
    unitIndex: 3,
    lessonIndex: 10,
    title: "Times Tables Practice",
    questions: [
      {
        type: "multiChoice",
        text: "What is 7 × 8?",
        choices: ["54", "56", "58", "63"],
        correct: 1,
      },
      { type: "trueFalse", text: "6 × 9 = 54.", isTrue: true },
      {
        type: "fillBlank",
        text: "What is 12 × 4?",
        answer: "48",
        hint: "12 × 4 = 12 + 12 + 12 + 12",
      },
      {
        type: "multiChoice",
        text: "If there are 8 bags with 7 apples each, how many apples total?",
        choices: ["54", "56", "58", "64"],
        correct: 1,
      },
      { type: "trueFalse", text: "9 × 9 = 81.", isTrue: true },
      {
        type: "fillBlank",
        text: "What is 11 × 6?",
        answer: "66",
        hint: "11 × 6 = 10 × 6 + 1 × 6",
      },
    ],
  },
  {
    unitIndex: 4,
    lessonIndex: 9,
    title: "Reading and Writing Numbers",
    questions: [
      {
        type: "multiChoice",
        text: "How do you write three hundred and forty-two in digits?",
        choices: ["342", "324", "432", "234"],
        correct: 0,
      },
      {
        type: "trueFalse",
        text: "The digit 5 in 572 has a value of 500.",
        isTrue: true,
      },
      {
        type: "fillBlank",
        text: "What is the value of the 4 in 3,462?",
        answer: "400",
        hint: "The 4 is in the hundreds place",
      },
      {
        type: "multiChoice",
        text: "Which is the largest? 3,024 or 3,204 or 3,042?",
        choices: ["3,024", "3,042", "3,204", "They are equal"],
        correct: 2,
      },
      { type: "trueFalse", text: "1,000 has four digits.", isTrue: true },
      {
        type: "fillBlank",
        text: "Write 2,050 in words: two thousand and __",
        answer: "fifty",
        hint: "2,050 = 2000 + 50",
      },
    ],
  },
  {
    unitIndex: 5,
    lessonIndex: 10,
    title: "Comparing Fractions",
    questions: [
      {
        type: "multiChoice",
        text: "Which is larger: 1/2 or 1/4?",
        choices: ["1/4", "1/2", "They are equal", "Cannot tell"],
        correct: 1,
      },
      { type: "trueFalse", text: "3/4 is greater than 1/2.", isTrue: true },
      {
        type: "fillBlank",
        text: "What fraction is equivalent to 2/4?",
        answer: "1/2",
        hint: "Simplify by dividing top and bottom by 2",
      },
      {
        type: "multiChoice",
        text: "Which is smallest: 1/3, 1/5, or 1/2?",
        choices: ["1/2", "1/3", "1/5", "They are equal"],
        correct: 2,
      },
      { type: "trueFalse", text: "2/3 is the same as 4/6.", isTrue: true },
      {
        type: "multiChoice",
        text: "Order from smallest: 1/4, 3/4, 1/2",
        choices: [
          "1/4, 1/2, 3/4",
          "3/4, 1/2, 1/4",
          "1/2, 1/4, 3/4",
          "1/4, 3/4, 1/2",
        ],
        correct: 0,
      },
    ],
  },
];

export const SPRINT18_EXTRA_LESSONS: LessonData[] = [];
