import type { CampDraft, CampRecord, PatientDraft, PatientRecord } from './types';

export function patientRecordToDraft(patient: PatientRecord): PatientDraft {
  return {
    profile: { ...patient.profile },
    medicalHistory: { ...patient.medicalHistory },
    dryAutoRefraction: structuredClone(patient.dryAutoRefraction),
    dryRefraction: structuredClone(patient.dryRefraction),
    dryAutoRefractionSameAsRight: false,
    dryRefractionSameAsRight: false,
    diagnosis: { ...patient.diagnosis, secondary: [...patient.diagnosis.secondary] },
  };
}

export function campRecordToDraft(camp: CampRecord): CampDraft {
  return {
    name: camp.name,
    typeCode: camp.typeCode,
    typeLabel: camp.typeLabel,
    date: camp.date,
    startTime: camp.startTime,
    endTime: camp.endTime,
    city: camp.city,
    address: camp.address,
    branches: camp.branches.map((b) => ({ ...b })),
    team: {
      manager: [...camp.team.manager],
      executive: [...camp.team.executive],
      counsellor: [...camp.team.counsellor],
      consultant: [...camp.team.consultant],
    },
  };
}
