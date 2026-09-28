export type CampTimeMeridiem = 'AM' | 'PM';

export interface CampTimeParts {
  hour: string;
  minute: string;
  meridiem: CampTimeMeridiem;
}

const TIME_12_PATTERN = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i;
const TIME_24_PATTERN = /^(\d{2}):(\d{2})(?::(\d{2}))?$/;

export const campTimeHourOptions = Array.from({ length: 12 }, (_, index) =>
  String(index + 1).padStart(2, '0'),
);

export const campTimeMinuteOptions = Array.from({ length: 60 }, (_, index) =>
  String(index).padStart(2, '0'),
);

export const campTimeMeridiemOptions: CampTimeMeridiem[] = ['AM', 'PM'];

export const defaultStartCampTimeParts: CampTimeParts = {
  hour: '09',
  minute: '00',
  meridiem: 'AM',
};

export const defaultEndCampTimeParts: CampTimeParts = {
  hour: '05',
  minute: '00',
  meridiem: 'PM',
};

export const campTimePlaceholder = 'hh:mm AM';

export function isNativeTimePickerAvailable(): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const input = document.createElement('input');
    input.type = 'time';
    if (input.type !== 'time') return false;
  } catch {
    return false;
  }

  const isTouchPrimary =
    window.matchMedia('(pointer: coarse)').matches && window.matchMedia('(hover: none)').matches;

  return isTouchPrimary || 'showPicker' in HTMLInputElement.prototype;
}

export function formatCampTimeValue(parts: CampTimeParts): string {
  return `${parts.hour}:${parts.minute} ${parts.meridiem}`;
}

export function formatCampTimeDisplay(value: string): string {
  const parts = parseCampTimeValue(value);
  if (!parts) return '';
  return formatCampTimeValue(parts);
}

export function parseCampTimeValue(value: string): CampTimeParts | undefined {
  const trimmed = value.trim();
  if (!trimmed) return undefined;

  const match12 = TIME_12_PATTERN.exec(trimmed);
  if (match12) {
    const hourNum = Number.parseInt(match12[1]!, 10);
    const minute = match12[2]!;
    const meridiem = match12[3]!.toUpperCase() as CampTimeMeridiem;
    if (hourNum < 1 || hourNum > 12) return undefined;
    if (!isValidMinute(minute)) return undefined;
    return {
      hour: String(hourNum).padStart(2, '0'),
      minute,
      meridiem,
    };
  }

  const match24 = TIME_24_PATTERN.exec(trimmed);
  if (match24) {
    const hour24 = Number.parseInt(match24[1]!, 10);
    const minute = match24[2]!;
    if (!isValidMinute(minute) || hour24 < 0 || hour24 > 23) return undefined;
    return partsFromHour24(hour24, minute);
  }

  return undefined;
}

export function toNativeTimeInputValue(value: string): string {
  const parts = parseCampTimeValue(value);
  if (!parts) return '';
  return `${toHour24(parts.hour, parts.meridiem)}:${parts.minute}`;
}

export function fromNativeTimeInputValue(hhmm: string): string {
  const match = TIME_24_PATTERN.exec(hhmm.trim());
  if (!match) return '';

  const hour24 = Number.parseInt(match[1]!, 10);
  const minute = match[2]!;
  if (!isValidMinute(minute) || hour24 < 0 || hour24 > 23) return '';

  return formatCampTimeValue(partsFromHour24(hour24, minute));
}

function partsFromHour24(hour24: number, minute: string): CampTimeParts {
  const meridiem: CampTimeMeridiem = hour24 >= 12 ? 'PM' : 'AM';
  const hour12 = hour24 % 12 || 12;

  return {
    hour: String(hour12).padStart(2, '0'),
    minute,
    meridiem,
  };
}

function toHour24(hour12: string, meridiem: CampTimeMeridiem): string {
  let hourNum = Number.parseInt(hour12, 10);
  if (meridiem === 'AM') {
    hourNum = hourNum === 12 ? 0 : hourNum;
  } else {
    hourNum = hourNum === 12 ? 12 : hourNum + 12;
  }
  return String(hourNum).padStart(2, '0');
}

function isValidMinute(minute: string): boolean {
  const minuteNum = Number.parseInt(minute, 10);
  return minuteNum >= 0 && minuteNum <= 59;
}
