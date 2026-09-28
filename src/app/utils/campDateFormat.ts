const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const DISPLAY_DATE_PATTERN = /^(\d{2})\/(\d{2})\/(\d{4})$/;
const CAMP_LIST_DATE_PATTERN = /^(\d{2})-(\d{2})-(\d{4})$/;

export function formatCampDateDisplay(iso: string): string {
  if (!ISO_DATE_PATTERN.test(iso)) return '';
  const [year, month, day] = iso.split('-');
  return `${day}/${month}/${year}`;
}

export function formatCampDateDisplayShort(iso: string): string {
  if (!ISO_DATE_PATTERN.test(iso)) return '';
  const [year, month, day] = iso.split('-');
  return `${day}/${month}/${year.slice(-2)}`;
}

export function parseCampDateInput(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (ISO_DATE_PATTERN.test(trimmed)) return trimmed;

  const match = DISPLAY_DATE_PATTERN.exec(trimmed);
  if (!match) return null;

  const [, day, month, year] = match;
  const iso = `${year}-${month}-${day}`;
  const date = parseIsoToDate(iso);
  if (!date) return null;

  return iso;
}

export function parseCampListDateToIso(value: string): string | undefined {
  const match = CAMP_LIST_DATE_PATTERN.exec(value.trim());
  if (!match) return undefined;

  const [, day, month, year] = match;
  const iso = `${year}-${month}-${day}`;
  return parseIsoToDate(iso) ? iso : undefined;
}

export function parseIsoToDate(iso: string): Date | undefined {
  if (!ISO_DATE_PATTERN.test(iso)) return undefined;

  const [year, month, day] = iso.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return undefined;
  }

  return date;
}

export function formatDateToIso(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
