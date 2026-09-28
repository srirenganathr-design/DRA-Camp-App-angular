import dotActive from '../assets/icons/dot-active.svg';
import type { Patient } from '../data/patients';
import type { Camp } from '../data/camps';
import type {
  CampDraft,
  CampRecord,
  EyeReadings,
  Gender,
  MedicalHistoryAnswers,
  PatientDraft,
  PatientRecord,
  RefractionFieldValues,
} from './types';
import { emptyEyeReadings } from './types';

const GENDER_LABEL: Record<string, string> = {
  male: 'Male',
  female: 'Female',
  others: 'Others',
};

function formatListGender(gender: string): string {
  return GENDER_LABEL[gender.toLowerCase()] ?? gender;
}

function deriveConditions(diagnosis: PatientDraft['diagnosis']): string | undefined {
  if (diagnosis.secondary.length === 0) return undefined;
  return diagnosis.secondary.join(', ');
}

export function buildPatientRecordFromDraft(
  draft: PatientDraft,
  id: string,
  patientNumber: string,
): PatientRecord {
  return {
    id,
    patientNumber,
    status: 'Active',
    campRef: draft.profile.campId,
    waitTime: '0M',
    conditions: deriveConditions(draft.diagnosis),
    profile: {
      name: draft.profile.name,
      age: draft.profile.age,
      gender: draft.profile.gender as Gender,
      phone: draft.profile.phone,
      campId: draft.profile.campId,
    },
    medicalHistory: {
      diabetic: draft.medicalHistory.diabetic as MedicalHistoryAnswers['diabetic'],
      bloodPressure: draft.medicalHistory.bloodPressure as MedicalHistoryAnswers['bloodPressure'],
      digitalHours: draft.medicalHistory.digitalHours as MedicalHistoryAnswers['digitalHours'],
    },
    dryAutoRefraction: structuredClone(draft.dryAutoRefraction),
    dryRefraction: structuredClone(draft.dryRefraction),
    diagnosis: { ...draft.diagnosis, secondary: [...draft.diagnosis.secondary] },
    listMeta: {
      nodeId: `patient-${id}`,
      topNodeId: `patient-${id}-top`,
      bottomNodeId: `patient-${id}-bottom`,
      phoneNodeId: `patient-${id}-phone`,
      calendarNodeId: `patient-${id}-cal`,
      arrowNodeId: `patient-${id}-arrow`,
      statusNodeId: `patient-${id}-status`,
      dotIcon: dotActive,
    },
  };
}

export function updatePatientRecordFromDraft(
  existing: PatientRecord,
  draft: PatientDraft,
): PatientRecord {
  return {
    ...existing,
    conditions: deriveConditions(draft.diagnosis),
    profile: {
      name: draft.profile.name,
      age: draft.profile.age,
      gender: draft.profile.gender as Gender,
      phone: draft.profile.phone,
      campId: draft.profile.campId,
    },
    medicalHistory: {
      diabetic: draft.medicalHistory.diabetic as MedicalHistoryAnswers['diabetic'],
      bloodPressure: draft.medicalHistory.bloodPressure as MedicalHistoryAnswers['bloodPressure'],
      digitalHours: draft.medicalHistory.digitalHours as MedicalHistoryAnswers['digitalHours'],
    },
    dryAutoRefraction: structuredClone(draft.dryAutoRefraction),
    dryRefraction: structuredClone(draft.dryRefraction),
    diagnosis: { ...draft.diagnosis, secondary: [...draft.diagnosis.secondary] },
  };
}

export function buildCampRecordFromDraft(
  draft: CampDraft,
  id: string,
  campNumber: string,
): CampRecord {
  return {
    id,
    campNumber,
    name: draft.name,
    typeCode: draft.typeCode,
    typeLabel: draft.typeLabel,
    status: 'Scheduled',
    doctor: 'Dr. Agarwal Team',
    date: draft.date,
    startTime: draft.startTime,
    endTime: draft.endTime,
    location: draft.city,
    city: draft.city,
    address: draft.address,
    manager: draft.team.manager[0] ?? 'Unassigned',
    patientCount: 0,
    patientIds: [],
    branches: draft.branches.map((b) => ({ ...b })),
    team: {
      manager: [...draft.team.manager],
      executive: [...draft.team.executive],
      counsellor: [...draft.team.counsellor],
      consultant: [...draft.team.consultant],
    },
    listMeta: {
      nodeId: `camp-${id}`,
      topNodeId: `camp-${id}-top`,
      bottomNodeId: `camp-${id}-bottom`,
      actionNodeId: `camp-${id}-action`,
      statusNodeId: `camp-${id}-status`,
      dotIcon: dotActive,
    },
  };
}

export function updateCampRecordFromDraft(existing: CampRecord, draft: CampDraft): CampRecord {
  return {
    ...existing,
    name: draft.name,
    typeCode: draft.typeCode,
    typeLabel: draft.typeLabel,
    date: draft.date,
    startTime: draft.startTime,
    endTime: draft.endTime,
    location: draft.city,
    city: draft.city,
    address: draft.address,
    manager: draft.team.manager[0] ?? existing.manager,
    branches: draft.branches.map((b) => ({ ...b })),
    team: {
      manager: [...draft.team.manager],
      executive: [...draft.team.executive],
      counsellor: [...draft.team.counsellor],
      consultant: [...draft.team.consultant],
    },
  };
}

function toListPatientStatus(status: PatientRecord['status']): Patient['status'] {
  switch (status) {
    case 'Active':
      return 'Screened';
    case 'Screened':
    case 'Referred':
      return status;
    default:
      return 'Screened';
  }
}

export function patientRecordToListCard(patient: PatientRecord, campName: string): Patient {
  return {
    id: patient.id,
    nodeId: patient.listMeta.nodeId,
    topNodeId: patient.listMeta.topNodeId,
    conditionsNodeId: patient.listMeta.conditionsNodeId,
    bottomNodeId: patient.listMeta.bottomNodeId,
    phoneNodeId: patient.listMeta.phoneNodeId,
    calendarNodeId: patient.listMeta.calendarNodeId,
    arrowNodeId: patient.listMeta.arrowNodeId,
    statusNodeId: patient.listMeta.statusNodeId,
    name: patient.profile.name,
    patientNumber: patient.patientNumber,
    campName,
    campId: patient.profile.campId,
    status: toListPatientStatus(patient.status),
    dotIcon: patient.listMeta.dotIcon,
    campRef: patient.campRef,
    waitTime: patient.waitTime,
    age: patient.profile.age,
    gender: formatListGender(patient.profile.gender),
    conditions: patient.conditions,
    phone: patient.profile.phone,
    phoneVerified: patient.profile.phoneVerified,
    registeredAt: '2026-09-01',
  };
}

export function campRecordToListCard(camp: CampRecord): Camp {
  return {
    id: camp.id,
    nodeId: camp.listMeta.nodeId,
    topNodeId: camp.listMeta.topNodeId,
    bottomNodeId: camp.listMeta.bottomNodeId,
    actionNodeId: camp.listMeta.actionNodeId,
    name: camp.name,
    campNumber: camp.campNumber,
    status: camp.status,
    statusNodeId: camp.listMeta.statusNodeId,
    dotIcon: camp.listMeta.dotIcon,
    patientCount: String(camp.patientCount).padStart(2, '0'),
    typeCode: camp.typeCode,
    doctor: camp.doctor,
    date: camp.date,
    location: camp.location,
    muted: camp.listMeta.muted,
  };
}

export function readingsToRefractionRows(readings: {
  distant: RefractionFieldValues;
  add: RefractionFieldValues;
  near: RefractionFieldValues;
}) {
  return [
    {
      rowIndex: 1,
      reading: 'Distant',
      sph: readings.distant.sph,
      cyl: readings.distant.cyl,
      axis: readings.distant.axis,
    },
    {
      rowIndex: 2,
      reading: 'Add',
      sph: readings.add.sph,
      cyl: readings.add.cyl,
      axis: readings.add.axis,
    },
    {
      rowIndex: 3,
      reading: 'Near',
      sph: readings.near.sph,
      cyl: readings.near.cyl,
      axis: readings.near.axis,
    },
  ];
}

export function autoRefractionBlocks(readings: EyeReadings) {
  return [
    {
      label: 'Distant',
      columns: ['Sph', 'Cyl', 'Axis', 'Vision'],
      values: [readings.distant.sph, readings.distant.cyl, readings.distant.axis, readings.distant.vision],
    },
    {
      label: 'Add',
      columns: ['Sph'],
      values: [readings.add.sph],
      singleColumn: true,
    },
    {
      label: 'Near',
      columns: ['Sph', 'Cyl', 'Axis', 'Vision'],
      values: [readings.near.sph, readings.near.cyl, readings.near.axis, readings.near.vision],
    },
  ];
}

export { emptyEyeReadings };
