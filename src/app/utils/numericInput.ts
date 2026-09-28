const NAVIGATION_KEYS = new Set([
  'Backspace',
  'Delete',
  'Tab',
  'ArrowLeft',
  'ArrowRight',
  'Home',
  'End',
]);

/** Strips non-digit characters and optionally caps length. */
export function filterDigits(value: string, maxLength?: number): string {
  const digits = value.replace(/\D/g, '');
  return maxLength != null ? digits.slice(0, maxLength) : digits;
}

/** Blocks letter/symbol keys in numeric fields (allows navigation and shortcuts). */
export function blockNonDigitKeyDown(event: KeyboardEvent) {
  if (event.ctrlKey || event.metaKey || event.altKey) return;
  if (NAVIGATION_KEYS.has(event.key)) return;
  if (/^\d$/.test(event.key)) return;
  event.preventDefault();
}
