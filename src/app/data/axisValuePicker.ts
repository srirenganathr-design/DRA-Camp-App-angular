export const axisDegreeStep = 5;

export const axisDegreeOptions = Array.from({ length: 37 }, (_, index) => String(index * axisDegreeStep));

export function normalizeAxisValue(value: string) {
  const parsed = Number.parseInt(value.replace(/[^\d]/g, ''), 10);

  if (Number.isNaN(parsed)) {
    return '0';
  }

  const snapped = Math.round(parsed / axisDegreeStep) * axisDegreeStep;
  return String(Math.min(180, Math.max(0, snapped)));
}

export function axisDegreesToNumber(value: string) {
  return Number.parseInt(normalizeAxisValue(value), 10);
}

export function formatAxisValue(degrees: number) {
  return String(Math.min(180, Math.max(0, Math.round(degrees / axisDegreeStep) * axisDegreeStep)));
}

export function axisPickerTitle() {
  return 'Select Axis';
}
