import type { ChildProfile } from "../backend.d";
import { UNITS } from "../constants/units";

export function isUnitCompleted(
  activeProfile: ChildProfile | null,
  unlockUnit: number,
  requiresFullUnit?: boolean,
): boolean {
  if (unlockUnit === 0) return true;
  const unitIdx = unlockUnit - 1;
  const unit = activeProfile?.progress.find(
    (u) => Number(u.unitIndex) === unitIdx,
  );
  if (!unit) return false;

  if (requiresFullUnit) {
    const unitMeta = UNITS.find((x) => x.idx === unitIdx);
    if (!unitMeta) return false;
    return (
      unit.lessons.filter((l) => Number(l.stars) > 0).length >= unitMeta.total
    );
  }

  return unit.lessons.filter((l) => Number(l.stars) > 0).length >= 1;
}
