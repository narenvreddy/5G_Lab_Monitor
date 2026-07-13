import type { ComponentType } from "react";
import { AdditionAvalanche } from "./AdditionAvalanche";
import { AlgebraEscape } from "./AlgebraEscape";
import { AlgorithmAnt } from "./AlgorithmAnt";
import { ArrayAttack } from "./ArrayAttack";
import { BinaryCracker } from "./BinaryCracker";
import { BlockBuilder } from "./BlockBuilder";
import { ChaosGarden } from "./ChaosGarden";
import { CookieCounter } from "./CookieCounter";
import { FactFamilyTree } from "./FactFamilyTree";
import { FractionFiend } from "./FractionFiend";
import { FractionFrenzy } from "./FractionFrenzy";
import { FractionMatch } from "./FractionMatch";
import { FractionPizza } from "./FractionPizza";
import { HistoryHunter } from "./HistoryHunter";
import { HopToIt } from "./HopToIt";
import { MathBoss } from "./MathBoss";
import { NumberBlaster } from "./NumberBlaster";
import { NumberBondsBlaster } from "./NumberBondsBlaster";
import { NumberNemesis } from "./NumberNemesis";
import { PatternPanic } from "./PatternPanic";
import { PatternPatrol } from "./PatternPatrol";
import { PlaceProtector } from "./PlaceProtector";
import { RocketMath } from "./RocketMath";
import { ScaleMaster } from "./ScaleMaster";
import { ShapeShifter } from "./ShapeShifter";
import { SubtractionStorm } from "./SubtractionStorm";
import { SumSlayer } from "./SumSlayer";
import { TimelineTraveler } from "./TimelineTraveler";
import { TimesTableTurbo } from "./TimesTableTurbo";
import { TimesTitan } from "./TimesTitan";
import type { GameProps } from "./types";

export const GAME_REGISTRY: Record<string, ComponentType<GameProps>> = {
  "number-blaster": NumberBlaster,
  "hop-to-it": HopToIt,
  "cookie-counter": CookieCounter,
  "rocket-math": RocketMath,
  "fact-family-tree": FactFamilyTree,
  "array-attack": ArrayAttack,
  "times-table-turbo": TimesTableTurbo,
  "binary-cracker": BinaryCracker,
  "block-builder": BlockBuilder,
  "fraction-pizza": FractionPizza,
  "fraction-match": FractionMatch,
  "scale-master": ScaleMaster,
  "pattern-panic": PatternPanic,
  "history-hunter": HistoryHunter,
  "chaos-garden": ChaosGarden,
  "number-bonds-blaster": NumberBondsBlaster,
  "fraction-frenzy": FractionFrenzy,
  "pattern-patrol": PatternPatrol,
  "algebra-escape": AlgebraEscape,
  "math-boss": MathBoss,
  "addition-avalanche": AdditionAvalanche,
  "subtraction-storm": SubtractionStorm,
  "shape-shifter": ShapeShifter,
  "timeline-traveler": TimelineTraveler,
  "algorithm-ant": AlgorithmAnt,
  "number-nemesis": NumberNemesis,
  "sum-slayer": SumSlayer,
  "times-titan": TimesTitan,
  "place-protector": PlaceProtector,
  "fraction-fiend": FractionFiend,
};
