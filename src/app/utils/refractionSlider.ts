import {
  axisDegreeStep,
  formatAxisValue,
  normalizeAxisValue,
} from '../data/axisValuePicker';
import {
  formatRefractionValue,
  parseRefractionValue,
  type ColumnPickerVariant,
  type RefractionPickerField,
} from '../data/refractionValuePicker';
import { emptyEyeReadings } from '../store/types';

type ReadingKey = 'distant' | 'add' | 'near';

const READING_TITLE_TO_KEY: Record<string, ReadingKey> = {
  Distant: 'distant',
  Add: 'add',
  Near: 'near',
  'Reading 1': 'distant',
  'Reading 2': 'add',
  'Reading 3': 'near',
};

const FIELD_TO_KEY = {
  Sph: 'sph',
  Cyl: 'cyl',
  Axis: 'axis',
} as const;

export function readingKeyFromTitle(readingTitle: string): ReadingKey {
  return READING_TITLE_TO_KEY[readingTitle] ?? 'distant';
}

export function normalizeRefractionFieldValue(
  value: string,
  field: RefractionPickerField,
  variant: ColumnPickerVariant,
): string {
  if (field === 'Axis') {
    return normalizeAxisValue(value);
  }

  const parsed = parseRefractionValue(value, variant);
  return formatRefractionValue(parsed.sign, parsed.integer, parsed.decimal, variant);
}

export function getRefractionFieldDefault(
  readingTitle: string,
  field: RefractionPickerField,
): string {
  const readingKey = readingKeyFromTitle(readingTitle);
  const defaults = emptyEyeReadings()[readingKey];
  const key = FIELD_TO_KEY[field];
  return defaults[key];
}

export { axisDegreeStep, formatAxisValue };
