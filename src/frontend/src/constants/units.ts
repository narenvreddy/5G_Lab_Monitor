// Single source of truth for unit names, colors, and lesson totals.
// Import from here in HomeScreen, ArcadeScreen, ProgressScreen, etc.

export interface UnitMeta {
  idx: number;
  name: string;
  color: string;
  total: number; // number of lessons in this unit
}

export const UNITS: UnitMeta[] = [
  { idx: 0, name: "Meet the Tutor", color: "#5B4FCF", total: 1 },
  { idx: 1, name: "Numbers", color: "#3B82F6", total: 10 },
  { idx: 2, name: "Addition & Subtraction", color: "#10B981", total: 12 },
  { idx: 3, name: "Multiplication", color: "#F59E0B", total: 11 },
  { idx: 4, name: "Place Value", color: "#14B8A6", total: 10 },
  { idx: 5, name: "Fractions", color: "#EC4899", total: 11 },
  { idx: 6, name: "Algebra", color: "#6366F1", total: 14 },
  { idx: 7, name: "History of Numbers", color: "#EAB308", total: 13 },
  { idx: 8, name: "Complexity Science", color: "#EF4444", total: 13 },
];

export const UNIT_NAMES: string[] = UNITS.map((u) => u.name);
export const UNIT_COLORS: string[] = UNITS.map((u) => u.color);
