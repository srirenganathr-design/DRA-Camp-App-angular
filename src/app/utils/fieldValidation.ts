import type { AppointmentFormValues } from '../data/appointmentForm';
import type { TeamMemberRole } from '../data/teamMemberPicker';
import type { CampDraft, PatientDraft } from '../store/types';

export type FieldErrors<K extends string> = Partial<Record<K, string>>;

export type PatientProfileField = 'name' | 'age' | 'gender' | 'phone';
export type PatientMedicalHistoryField = 'diabetic' | 'bloodPressure' | 'digitalHours';
export type CampBasicField = 'typeCode' | 'name' | 'date' | 'startTime' | 'endTime';
export type CampLocationField = 'address';
export type CampBranchesField = 'branches';
export type CampTeamField = TeamMemberRole;
export type AppointmentField = 'branch' | 'date' | 'timeSlot';

export function validatePatientProfileFields(
  draft: PatientDraft,
): FieldErrors<PatientProfileField> {
  const errors: FieldErrors<PatientProfileField> = {};
  const { name, age, gender, phone } = draft.profile;

  if (!name.trim()) errors.name = 'Name is required';

  const ageNum = Number.parseInt(age, 10);
  if (!age || Number.isNaN(ageNum) || ageNum < 1 || ageNum > 120) {
    errors.age = 'Age must be 1–120';
  }

  if (!gender) errors.gender = 'Gender is required';

  if (!/^\d{10}$/.test(phone.replace(/\D/g, ''))) {
    errors.phone = 'Phone must be 10 digits';
  }

  return errors;
}

export function validatePatientMedicalHistoryFields(
  draft: PatientDraft,
): FieldErrors<PatientMedicalHistoryField> {
  const errors: FieldErrors<PatientMedicalHistoryField> = {};
  const { diabetic, bloodPressure, digitalHours } = draft.medicalHistory;

  if (!diabetic) errors.diabetic = 'Selection required';
  if (!bloodPressure) errors.bloodPressure = 'Selection required';
  if (!digitalHours) errors.digitalHours = 'Selection required';

  return errors;
}

export function isPatientProfileComplete(draft: PatientDraft): boolean {
  return Object.keys(validatePatientProfileFields(draft)).length === 0;
}

export function isPatientMedicalHistoryComplete(draft: PatientDraft): boolean {
  return Object.keys(validatePatientMedicalHistoryFields(draft)).length === 0;
}

export function validateCampBasicFields(draft: CampDraft): FieldErrors<CampBasicField> {
  const errors: FieldErrors<CampBasicField> = {};

  if (!draft.typeCode) errors.typeCode = 'Camp type is required';
  if (!draft.name.trim()) errors.name = 'Camp name is required';
  if (!draft.date.trim()) errors.date = 'Date is required';
  if (!draft.startTime.trim()) errors.startTime = 'Start time is required';
  if (!draft.endTime.trim()) errors.endTime = 'End time is required';

  return errors;
}

export function validateCampLocationFields(draft: CampDraft): FieldErrors<CampLocationField> {
  const errors: FieldErrors<CampLocationField> = {};
  if (!draft.address.trim()) errors.address = 'Address is required';
  return errors;
}

export function validateCampBranchesFields(draft: CampDraft): FieldErrors<CampBranchesField> {
  const errors: FieldErrors<CampBranchesField> = {};
  if (draft.branches.length === 0) errors.branches = 'At least one branch is required';
  return errors;
}

export function validateCampTeamFields(draft: CampDraft): FieldErrors<CampTeamField> {
  const errors: FieldErrors<CampTeamField> = {};
  const { team } = draft;

  if (team.manager.length === 0) errors.manager = 'Camp manager is required';
  if (team.executive.length === 0) errors.executive = 'At least one executive is required';
  if (team.counsellor.length === 0) errors.counsellor = 'At least one counsellor is required';
  if (team.consultant.length === 0) errors.consultant = 'At least one consultant is required';

  return errors;
}

export function validateAppointmentFields(
  values: AppointmentFormValues,
): FieldErrors<AppointmentField> {
  const errors: FieldErrors<AppointmentField> = {};

  if (!values.branchCity) errors.branch = 'Branch is required';
  if (!values.selectedDateContainerNodeId) errors.date = 'Date is required';
  if (!values.selectedTimeSlotContainerNodeId) errors.timeSlot = 'Time slot is required';

  return errors;
}

export function firstFieldError<K extends string>(errors: FieldErrors<K>): string | null {
  const values = Object.values(errors);
  return values.length > 0 ? (values[0] as string) : null;
}
