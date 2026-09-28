import { refractionFieldKey, type RefractionPickerField } from '../data/refractionValuePicker';
import type { EyeReadings, PatientDraft } from '../store/types';
import {
  firstFieldError,
  validateAppointmentFields,
  validateCampBasicFields,
  validatePatientProfileFields,
} from '../utils/fieldValidation';

type RefractionSection = 'dryRefraction' | 'dryAutoRefraction';
type EyeSide = 'right' | 'left';
type ReadingKey = 'distant' | 'add' | 'near';

const DRY_REFRACTION_CARD_MAP: Record<string, { eye: EyeSide; reading: ReadingKey }> = {
  '126:21511': { eye: 'right', reading: 'distant' },
  '126:21536': { eye: 'right', reading: 'add' },
  '126:21561': { eye: 'right', reading: 'near' },
  '126:21595': { eye: 'left', reading: 'distant' },
  '126:21620': { eye: 'left', reading: 'add' },
  '126:21645': { eye: 'left', reading: 'near' },
};

const DRY_AUTO_REFRACTION_CARD_MAP: Record<string, { eye: EyeSide; reading: ReadingKey }> = {
  '126:21348': { eye: 'right', reading: 'distant' },
  '126:21366': { eye: 'right', reading: 'add' },
  '126:21384': { eye: 'right', reading: 'near' },
  '126:21411': { eye: 'left', reading: 'distant' },
  '126:21429': { eye: 'left', reading: 'add' },
  '126:21447': { eye: 'left', reading: 'near' },
};

const FIELD_TO_KEY: Record<RefractionPickerField, keyof EyeReadings['distant']> = {
  Sph: 'sph',
  Cyl: 'cyl',
  Axis: 'axis',
};

function cardMapForSection(section: RefractionSection) {
  return section === 'dryRefraction' ? DRY_REFRACTION_CARD_MAP : DRY_AUTO_REFRACTION_CARD_MAP;
}

export function isSameAsRightEye(draft: PatientDraft, section: RefractionSection): boolean {
  return section === 'dryRefraction'
    ? draft.dryRefractionSameAsRight
    : draft.dryAutoRefractionSameAsRight;
}

function setSameAsRightEyeFlag(
  draft: PatientDraft,
  section: RefractionSection,
  enabled: boolean,
): PatientDraft {
  const next = structuredClone(draft);
  if (section === 'dryRefraction') {
    next.dryRefractionSameAsRight = enabled;
  } else {
    next.dryAutoRefractionSameAsRight = enabled;
  }
  return next;
}

export function toggleSameAsRightEye(
  draft: PatientDraft,
  section: RefractionSection,
): PatientDraft {
  const enabled = !isSameAsRightEye(draft, section);
  let next = setSameAsRightEyeFlag(draft, section, enabled);
  if (enabled) {
    next[section].left = structuredClone(next[section].right);
  }
  return next;
}

export function buildRefractionValueMap(
  draft: PatientDraft,
  section: RefractionSection,
  cardNodeIds: string[],
): Record<string, string> {
  const map = cardMapForSection(section);
  const values: Record<string, string> = {};

  for (const cardNodeId of cardNodeIds) {
    const location = map[cardNodeId];
    if (!location) continue;
    const readings = draft[section][location.eye][location.reading];
    for (const field of ['Sph', 'Cyl', 'Axis'] as RefractionPickerField[]) {
      const key = FIELD_TO_KEY[field];
      values[refractionFieldKey(cardNodeId, field)] = readings[key];
    }
    values[`${cardNodeId}-Vision`] = readings.vision;
  }

  return values;
}

export function applyRefractionValueChange(
  draft: PatientDraft,
  section: RefractionSection,
  compositeKey: string,
  value: string,
): PatientDraft {
  const [cardNodeId, fieldLabel] = compositeKey.split(/-(?=Sph$|Cyl$|Axis$)/);
  const map = cardMapForSection(section);
  const location = map[cardNodeId];
  if (!location) return draft;

  const field = fieldLabel as RefractionPickerField;
  const readingKey = FIELD_TO_KEY[field];
  const sameAsRight = isSameAsRightEye(draft, section);
  const next = structuredClone(draft);
  next[section][location.eye][location.reading][readingKey] = value;

  if (location.eye === 'right' && sameAsRight) {
    next[section].left[location.reading][readingKey] = value;
  }

  if (location.eye === 'left' && sameAsRight) {
    return setSameAsRightEyeFlag(next, section, false);
  }

  return next;
}

export function validatePatientProfile(draft: PatientDraft): string | null {
  return firstFieldError(validatePatientProfileFields(draft));
}

export function validateCampBasic(draft: import('../store/types').CampDraft): string | null {
  return firstFieldError(validateCampBasicFields(draft));
}

export function validateAppointment(values: import('../data/appointmentForm').AppointmentFormValues): string | null {
  return firstFieldError(validateAppointmentFields(values));
}
