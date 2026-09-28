import {
  formatCampDateDisplayShort,
  parseCampListDateToIso,
  parseIsoToDate,
} from '../utils/campDateFormat';

export type TimeRangePreset = 'all' | 'last30Days' | 'last90Days' | 'last6Months' | 'custom';

export interface TimeRangeFilter {
  preset: TimeRangePreset;
  customStart?: string;
  customEnd?: string;
}

export const DEFAULT_TIME_RANGE_FILTER: TimeRangeFilter = { preset: 'all' };

export const TIME_RANGE_OPTIONS: { preset: TimeRangePreset; label: string }[] = [
  { preset: 'all', label: 'All' },
  { preset: 'last30Days', label: 'Last 30 Days' },
  { preset: 'last90Days', label: 'Last 90 Days' },
  { preset: 'last6Months', label: 'Last 6 Months' },
  { preset: 'custom', label: 'Custom Range' },
];

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function subtractDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() - days);
  return startOfDay(next);
}

function subtractMonths(date: Date, months: number): Date {
  const next = new Date(date);
  next.setMonth(next.getMonth() - months);
  return startOfDay(next);
}

export function getTimeRangeBounds(
  filter: TimeRangeFilter,
  referenceDate = new Date(),
): { start: Date; end: Date } | null {
  const end = startOfDay(referenceDate);

  switch (filter.preset) {
    case 'all':
      return null;
    case 'last30Days':
      return { start: subtractDays(end, 30), end };
    case 'last90Days':
      return { start: subtractDays(end, 90), end };
    case 'last6Months':
      return { start: subtractMonths(end, 6), end };
    case 'custom': {
      const start = filter.customStart ? parseIsoToDate(filter.customStart) : undefined;
      const customEnd = filter.customEnd ? parseIsoToDate(filter.customEnd) : undefined;
      if (!start || !customEnd) return null;
      return { start: startOfDay(start), end: startOfDay(customEnd) };
    }
    default:
      return null;
  }
}

export function isDateWithinTimeRange(
  isoDate: string,
  filter: TimeRangeFilter,
  referenceDate = new Date(),
): boolean {
  if (filter.preset === 'custom') {
    const { customStart, customEnd } = filter;
    if (!customStart || !customEnd) return true;
    if (!parseIsoToDate(isoDate)) return true;

    const start = customStart <= customEnd ? customStart : customEnd;
    const end = customStart <= customEnd ? customEnd : customStart;
    return isoDate >= start && isoDate <= end;
  }

  const bounds = getTimeRangeBounds(filter, referenceDate);
  if (!bounds) return true;

  const date = parseIsoToDate(isoDate);
  if (!date) return true;

  const normalized = startOfDay(date);
  return normalized >= bounds.start && normalized <= bounds.end;
}

export function isCampDateWithinTimeRange(
  campDate: string,
  filter: TimeRangeFilter,
  referenceDate = new Date(),
): boolean {
  const isoDate = parseCampListDateToIso(campDate);
  if (!isoDate) return true;
  return isDateWithinTimeRange(isoDate, filter, referenceDate);
}

export function getTimeRangeChipLabel(filter: TimeRangeFilter): string {
  switch (filter.preset) {
    case 'all':
      return 'All Time';
    case 'last30Days':
      return 'Last 30 Days';
    case 'last90Days':
      return 'Last 90 Days';
    case 'last6Months':
      return 'Last 6 Months';
    case 'custom':
      if (filter.customStart && filter.customEnd) {
        return `${formatCampDateDisplayShort(filter.customStart)} - ${formatCampDateDisplayShort(filter.customEnd)}`;
      }
      return 'Custom Range';
    default:
      return 'All Time';
  }
}
