export interface ArcadeGame {
  id: string;
  name: string;
  emoji: string;
  unlockUnit: number;
  requiresFullUnit?: boolean;
}

export const ARCADE_GAMES: ArcadeGame[] = [
  { id: "number-blaster", name: "Number Blaster", emoji: "🚀", unlockUnit: 0 },
  { id: "hop-to-it", name: "Hop to It", emoji: "🐸", unlockUnit: 0 },
  { id: "cookie-counter", name: "Cookie Counter", emoji: "🍪", unlockUnit: 0 },
  {
    id: "number-bonds-blaster",
    name: "Number Bonds Blaster",
    emoji: "🫧",
    unlockUnit: 1,
  },
  {
    id: "addition-avalanche",
    name: "Addition Avalanche",
    emoji: "🪨",
    unlockUnit: 1,
  },
  { id: "rocket-math", name: "Rocket Math", emoji: "🔥", unlockUnit: 2 },
  {
    id: "fact-family-tree",
    name: "Fact Family Tree",
    emoji: "🌳",
    unlockUnit: 2,
  },
  {
    id: "subtraction-storm",
    name: "Subtraction Storm",
    emoji: "⛈️",
    unlockUnit: 2,
  },
  { id: "array-attack", name: "Array Attack", emoji: "🛡️", unlockUnit: 3 },
  {
    id: "times-table-turbo",
    name: "Times Table Turbo",
    emoji: "⚡",
    unlockUnit: 3,
  },
  { id: "pattern-patrol", name: "Pattern Patrol", emoji: "🔢", unlockUnit: 3 },
  { id: "binary-cracker", name: "Binary Cracker", emoji: "🔐", unlockUnit: 4 },
  { id: "block-builder", name: "Block Builder", emoji: "🧱", unlockUnit: 4 },
  { id: "shape-shifter", name: "Shape Shifter", emoji: "🔷", unlockUnit: 4 },
  { id: "fraction-pizza", name: "Fraction Pizza", emoji: "🍕", unlockUnit: 5 },
  { id: "fraction-match", name: "Fraction Match", emoji: "🎴", unlockUnit: 5 },
  {
    id: "fraction-frenzy",
    name: "Fraction Frenzy",
    emoji: "🍰",
    unlockUnit: 5,
  },
  { id: "scale-master", name: "Scale Master", emoji: "⚖️", unlockUnit: 6 },
  { id: "pattern-panic", name: "Pattern Panic", emoji: "🌀", unlockUnit: 6 },
  { id: "algebra-escape", name: "Algebra Escape", emoji: "🚪", unlockUnit: 6 },
  { id: "history-hunter", name: "History Hunter", emoji: "📜", unlockUnit: 7 },
  {
    id: "timeline-traveler",
    name: "Timeline Traveler",
    emoji: "🗺️",
    unlockUnit: 7,
  },
  { id: "chaos-garden", name: "Chaos Garden", emoji: "🌱", unlockUnit: 8 },
  { id: "math-boss", name: "Math Boss Battle", emoji: "👾", unlockUnit: 8 },
  { id: "algorithm-ant", name: "Algorithm Ant", emoji: "🐜", unlockUnit: 8 },
  // Mini-boss games (require full unit completion)
  {
    id: "number-nemesis",
    name: "Number Nemesis",
    emoji: "👹",
    unlockUnit: 2,
    requiresFullUnit: true,
  },
  {
    id: "sum-slayer",
    name: "Sum Slayer",
    emoji: "⚔️",
    unlockUnit: 3,
    requiresFullUnit: true,
  },
  {
    id: "times-titan",
    name: "Times Titan",
    emoji: "🦾",
    unlockUnit: 4,
    requiresFullUnit: true,
  },
  {
    id: "place-protector",
    name: "Place Protector",
    emoji: "🏰",
    unlockUnit: 5,
    requiresFullUnit: true,
  },
  {
    id: "fraction-fiend",
    name: "Fraction Fiend",
    emoji: "🧙",
    unlockUnit: 6,
    requiresFullUnit: true,
  },
];
