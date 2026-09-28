/** Figma wizard step sections use a fixed ~33% fill (107.683 / 323.077). */
export const WIZARD_FIGMA_PROGRESS_PERCENT = (107.683 / 323.077) * 100;

/** Returns 0–100 for a step's filled-field ratio. */
export function computeStepProgressPercent(filledCount: number, totalCount: number): number {
  if (totalCount <= 0) return 0;
  return Math.round((filledCount / totalCount) * 100);
}

export function isNonEmptyString(value: string | undefined | null): boolean {
  return (value ?? '').trim().length > 0;
}

export function countTruthy(values: boolean[]): number {
  return values.filter(Boolean).length;
}
