export type RefractionPickerField = 'Sph' | 'Cyl' | 'Axis';

export type RefractionPickerKind = 'column' | 'axis';

export const refractionSignOptions = ['+', '-'] as const;
export const refractionIntegerOptions = Array.from({ length: 26 }, (_, index) => String(index));
export const refractionAddIntegerOptions = Array.from({ length: 5 }, (_, index) => String(index));
export const refractionDecimalOptions = ['.00', '.25', '.50', '.75'] as const;

export type ColumnPickerVariant = 'standard' | 'add';

export interface RefractionFieldRef {
  cardNodeId: string;
  title: string;
  fields: Array<{ label: string; value: string }>;
}

export function refractionFieldKey(cardNodeId: string, label: RefractionPickerField) {
  return `${cardNodeId}-${label}`;
}

export function refractionPickerKind(label: RefractionPickerField): RefractionPickerKind {
  return label === 'Axis' ? 'axis' : 'column';
}

export function columnPickerVariant(
  readingTitle: string,
  label: RefractionPickerField,
): ColumnPickerVariant {
  return readingTitle === 'Add' && (label === 'Sph' || label === 'Cyl') ? 'add' : 'standard';
}

export function addDecimalOptionsForInteger(integer: string): readonly string[] {
  return integer === '4' ? ['.00'] : refractionDecimalOptions;
}

export function buildInitialRefractionValues(readings: RefractionFieldRef[]) {
  const values: Record<string, string> = {};

  for (const reading of readings) {
    for (const field of reading.fields) {
      if (field.label === 'Sph' || field.label === 'Cyl' || field.label === 'Axis') {
        values[refractionFieldKey(reading.cardNodeId, field.label as RefractionPickerField)] = field.value;
      }
    }
  }

  return values;
}

export function parseRefractionValue(value: string, variant: ColumnPickerVariant = 'standard') {
  const trimmed = value.trim();
  const sign = variant === 'add' ? '+' : trimmed.startsWith('+') ? '+' : '-';
  const unsigned = trimmed.replace(/^[+-]/, '');
  const [integerPart = '0', decimalPart = '00'] = unsigned.split('.');

  const normalizedDecimal = `.${decimalPart.padEnd(2, '0').slice(0, 2)}`;
  const decimal = refractionDecimalOptions.includes(
    normalizedDecimal as (typeof refractionDecimalOptions)[number],
  )
    ? normalizedDecimal
    : '.00';

  const maxInteger = variant === 'add' ? 4 : 25;
  const integer = String(Math.min(maxInteger, Math.max(0, Number.parseInt(integerPart, 10) || 0)));
  const resolvedDecimal =
    variant === 'add' && integer === '4' && decimal !== '.00' ? '.00' : decimal;

  return {
    sign,
    integer,
    decimal: resolvedDecimal,
  };
}

export function formatRefractionValue(
  sign: string,
  integer: string,
  decimal: string,
  variant: ColumnPickerVariant = 'standard',
) {
  const normalizedDecimal = decimal.startsWith('.') ? decimal.slice(1) : decimal;
  const resolvedSign = variant === 'add' ? '+' : sign;
  return `${resolvedSign}${integer}.${normalizedDecimal.padStart(2, '0')}`;
}

export function refractionPickerTitle(label: RefractionPickerField) {
  if (label === 'Sph') {
    return 'Select Sph';
  }

  if (label === 'Cyl') {
    return 'Select Cyl';
  }

  return 'Select Axis';
}
