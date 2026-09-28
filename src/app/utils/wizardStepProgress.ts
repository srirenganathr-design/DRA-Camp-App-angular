import type { AppointmentFormValues } from '../data/appointmentForm';
import type { CampDraft, EyeReadings, PatientDraft } from '../store/types';
import { computeStepProgressPercent, countTruthy, isNonEmptyString } from './stepProgress';

const REFRACTION_EYES = ['right', 'left'] as const;
const REFRACTION_READINGS = ['distant', 'add', 'near'] as const;
const REFRACTION_PICKER_FIELDS = ['sph', 'cyl', 'axis'] as const;

type RefractionSection = 'dryAutoRefraction' | 'dryRefraction';

function countRefractionPickerFields(section: RefractionSection, draft: PatientDraft): number {
  let filled = 0;
  let total = 0;

  for (const eye of REFRACTION_EYES) {
    for (const reading of REFRACTION_READINGS) {
      const values: EyeReadings[typeof reading] = draft[section][eye][reading];
      for (const field of REFRACTION_PICKER_FIELDS) {
        total += 1;
        if (isNonEmptyString(values[field])) filled += 1;
      }
    }
  }

  return computeStepProgressPercent(filled, total);
}

export function getCampBasicStepProgress(draft: CampDraft): number {
  const filled = countTruthy([
    isNonEmptyString(draft.typeCode),
    isNonEmptyString(draft.name),
    isNonEmptyString(draft.date),
    isNonEmptyString(draft.startTime),
    isNonEmptyString(draft.endTime),
  ]);
  return computeStepProgressPercent(filled, 5);
}

export function getCampLocationStepProgress(draft: CampDraft): number {
  return computeStepProgressPercent(isNonEmptyString(draft.address) ? 1 : 0, 1);
}

export function getCampBranchesStepProgress(draft: CampDraft): number {
  return computeStepProgressPercent(draft.branches.length > 0 ? 1 : 0, 1);
}

export function getCampTeamStepProgress(draft: CampDraft): number {
  const { manager, executive, counsellor, consultant } = draft.team;
  const filled = countTruthy([
    manager.length > 0,
    executive.length > 0,
    counsellor.length > 0,
    consultant.length > 0,
  ]);
  return computeStepProgressPercent(filled, 4);
}

export function getPatientProfileStepProgress(draft: PatientDraft): number {
  const { name, age, gender, phone } = draft.profile;
  const filled = countTruthy([
    isNonEmptyString(name),
    isNonEmptyString(age),
    isNonEmptyString(gender),
    isNonEmptyString(phone),
  ]);
  return computeStepProgressPercent(filled, 4);
}

export function getPatientMedicalHistoryStepProgress(draft: PatientDraft): number {
  const { diabetic, bloodPressure, digitalHours } = draft.medicalHistory;
  const filled = countTruthy([
    isNonEmptyString(diabetic),
    isNonEmptyString(bloodPressure),
    isNonEmptyString(digitalHours),
  ]);
  return computeStepProgressPercent(filled, 3);
}

export function getPatientDryAutoRefractionStepProgress(draft: PatientDraft): number {
  return countRefractionPickerFields('dryAutoRefraction', draft);
}

export function getPatientDryRefractionStepProgress(draft: PatientDraft): number {
  return countRefractionPickerFields('dryRefraction', draft);
}

export function getPatientDiagnosisStepProgress(draft: PatientDraft): number {
  const hasSelection =
    isNonEmptyString(draft.diagnosis.primary) || draft.diagnosis.secondary.length > 0;
  return computeStepProgressPercent(hasSelection ? 1 : 0, 1);
}

export function getScheduleAppointmentStepProgress(form: AppointmentFormValues): number {
  const filled = countTruthy([
    isNonEmptyString(form.branchCity),
    isNonEmptyString(form.selectedDateContainerNodeId),
    isNonEmptyString(form.selectedTimeSlotContainerNodeId),
  ]);
  return computeStepProgressPercent(filled, 3);
}
