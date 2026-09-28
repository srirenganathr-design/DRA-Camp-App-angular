import type { CampStatus } from '../data/camps';

export type StorePatientStatus = 'Screened' | 'Referred' | 'Active';
import type { AppointmentFormValues } from '../data/appointmentForm';
import type { TeamMemberRole } from '../data/teamMemberPicker';

export type Gender = 'male' | 'female' | 'others';

export interface PatientProfile {
  name: string;
  age: string;
  gender: Gender;
  phone: string;
  campId: string;
  phoneVerified?: boolean;
}

export interface PatientDraftProfile {
  name: string;
  age: string;
  gender: Gender | '';
  phone: string;
  campId: string;
}

export interface MedicalHistoryAnswers {
  diabetic: 'Yes' | 'No';
  bloodPressure: 'Yes' | 'No';
  digitalHours: '<2 hrs' | '2-5 hrs' | '5+ hrs';
}

export interface PatientDraftMedicalHistory {
  diabetic: 'Yes' | 'No' | '';
  bloodPressure: 'Yes' | 'No' | '';
  digitalHours: '<2 hrs' | '2-5 hrs' | '5+ hrs' | '';
}

export interface DiagnosisAnswers {
  primary: string;
  secondary: string[];
}

export interface RefractionFieldValues {
  sph: string;
  cyl: string;
  axis: string;
  vision: string;
}

export interface EyeReadings {
  distant: RefractionFieldValues;
  add: RefractionFieldValues;
  near: RefractionFieldValues;
}

export interface PatientListMeta {
  nodeId: string;
  topNodeId: string;
  conditionsNodeId?: string;
  bottomNodeId: string;
  phoneNodeId: string;
  calendarNodeId: string;
  arrowNodeId: string;
  statusNodeId: string;
  dotIcon: string;
}

export interface PatientRecord {
  id: string;
  patientNumber: string;
  status: StorePatientStatus;
  campRef: string;
  waitTime: string;
  conditions?: string;
  profile: PatientProfile;
  medicalHistory: MedicalHistoryAnswers;
  dryAutoRefraction: { right: EyeReadings; left: EyeReadings };
  dryRefraction: { right: EyeReadings; left: EyeReadings };
  diagnosis: DiagnosisAnswers;
  listMeta: PatientListMeta;
}

export interface CampListMeta {
  nodeId: string;
  topNodeId: string;
  bottomNodeId: string;
  actionNodeId: string;
  statusNodeId: string;
  dotIcon: string;
  muted?: boolean;
}

export interface CampBranch {
  id: string;
  city: string;
  address: string;
}

export interface CampTeamSelections {
  manager: string[];
  executive: string[];
  counsellor: string[];
  consultant: string[];
}

export interface CampRecord {
  id: string;
  campNumber: string;
  name: string;
  typeCode: string;
  typeLabel: string;
  status: CampStatus;
  doctor: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  city: string;
  address: string;
  manager: string;
  patientCount: number;
  patientIds: string[];
  branches: CampBranch[];
  team: CampTeamSelections;
  listMeta: CampListMeta;
}

export interface PatientDraft {
  profile: PatientDraftProfile;
  medicalHistory: PatientDraftMedicalHistory;
  dryAutoRefraction: { right: EyeReadings; left: EyeReadings };
  dryRefraction: { right: EyeReadings; left: EyeReadings };
  dryAutoRefractionSameAsRight: boolean;
  dryRefractionSameAsRight: boolean;
  diagnosis: DiagnosisAnswers;
}

export interface CampDraft {
  name: string;
  typeCode: string;
  typeLabel: string;
  date: string;
  startTime: string;
  endTime: string;
  city: string;
  address: string;
  branches: CampBranch[];
  team: CampTeamSelections;
}

export interface AppState {
  patients: Record<string, PatientRecord>;
  camps: Record<string, CampRecord>;
  appointments: Record<string, AppointmentFormValues>;
  patientDraft: PatientDraft | null;
  campDraft: CampDraft | null;
  editingPatientId: string | null;
  editingCampId: string | null;
  nextPatientId: number;
  nextCampId: number;
}

export type TeamMemberRoleKey = TeamMemberRole;

export const emptyRefractionField = (): RefractionFieldValues => ({
  sph: '+0.00',
  cyl: '+0.00',
  axis: '0',
  vision: '20/20',
});

export const emptyEyeReadings = (): EyeReadings => ({
  distant: { sph: '-0.00', cyl: '-0.00', axis: '180', vision: '20/20' },
  add: { sph: '+0.00', cyl: '+0.00', axis: '180', vision: '20/20' },
  near: { sph: '-0.00', cyl: '-0.00', axis: '180', vision: '20/20' },
});

export const emptyPatientDraft = (): PatientDraft => ({
  profile: { name: '', age: '', gender: '', phone: '', campId: '1' },
  medicalHistory: { diabetic: '', bloodPressure: '', digitalHours: '' },
  dryAutoRefraction: { right: emptyEyeReadings(), left: emptyEyeReadings() },
  dryRefraction: { right: emptyEyeReadings(), left: emptyEyeReadings() },
  dryAutoRefractionSameAsRight: false,
  dryRefractionSameAsRight: false,
  diagnosis: { primary: '', secondary: [] },
});

export const emptyCampDraft = (): CampDraft => ({
  name: 'Karthick Kumar',
  typeCode: '',
  typeLabel: '',
  date: '',
  startTime: '',
  endTime: '',
  city: '',
  address: '',
  branches: [],
  team: { manager: [], executive: [], counsellor: [], consultant: [] },
});
