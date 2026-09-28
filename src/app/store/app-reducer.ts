import type { AppointmentFormValues } from '../data/appointmentForm';
import {
  buildPatientRecordFromDraft,
  updatePatientRecordFromDraft,
  updateCampRecordFromDraft,
  buildCampRecordFromDraft,
} from './adapters';
import type { AppState, CampDraft, PatientDraft } from './types';

export type AppAction =
  | { type: 'CREATE_PATIENT'; draft: PatientDraft }
  | { type: 'UPDATE_PATIENT'; id: string; draft: PatientDraft }
  | { type: 'SYNC_PATIENT_DRAFT'; draft: PatientDraft }
  | { type: 'CREATE_CAMP'; draft: CampDraft }
  | { type: 'UPDATE_CAMP'; id: string; draft: CampDraft }
  | { type: 'SAVE_APPOINTMENT'; patientId: string; values: AppointmentFormValues }
  | { type: 'SET_PATIENT_DRAFT'; draft: PatientDraft | null; editingId?: string | null }
  | { type: 'SET_CAMP_DRAFT'; draft: CampDraft | null; editingId?: string | null }
  | { type: 'UPDATE_PATIENT_DRAFT'; draft: PatientDraft }
  | { type: 'UPDATE_CAMP_DRAFT'; draft: CampDraft }
  | { type: 'PATCH_CAMP_DRAFT'; partial: Partial<CampDraft> };

export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'CREATE_PATIENT': {
      const id = String(state.nextPatientId);
      const record = buildPatientRecordFromDraft(action.draft, id, `#${state.nextPatientId}`);
      const camp = state.camps[action.draft.profile.campId];
      const nextPatients = { ...state.patients, [id]: record };
      const nextCamps = camp
        ? {
            ...state.camps,
            [camp.id]: {
              ...camp,
              patientIds: [...camp.patientIds, id],
              patientCount: camp.patientIds.length + 1,
            },
          }
        : state.camps;
      return {
        ...state,
        patients: nextPatients,
        camps: nextCamps,
        nextPatientId: state.nextPatientId + 1,
        patientDraft: null,
        editingPatientId: null,
      };
    }
    case 'UPDATE_PATIENT': {
      const existing = state.patients[action.id];
      if (!existing) return state;
      return {
        ...state,
        patients: {
          ...state.patients,
          [action.id]: updatePatientRecordFromDraft(existing, action.draft),
        },
        patientDraft: null,
        editingPatientId: null,
      };
    }
    case 'SYNC_PATIENT_DRAFT': {
      if (state.editingPatientId) {
        const existing = state.patients[state.editingPatientId];
        if (!existing) return state;
        return {
          ...state,
          patients: {
            ...state.patients,
            [state.editingPatientId]: updatePatientRecordFromDraft(existing, action.draft),
          },
          patientDraft: action.draft,
        };
      }
      const id = String(state.nextPatientId);
      const record = buildPatientRecordFromDraft(action.draft, id, `#${state.nextPatientId}`);
      const camp = state.camps[action.draft.profile.campId];
      const nextPatients = { ...state.patients, [id]: record };
      const nextCamps = camp
        ? {
            ...state.camps,
            [camp.id]: {
              ...camp,
              patientIds: camp.patientIds.includes(id) ? camp.patientIds : [...camp.patientIds, id],
              patientCount: camp.patientIds.includes(id) ? camp.patientCount : camp.patientCount + 1,
            },
          }
        : state.camps;
      return {
        ...state,
        patients: nextPatients,
        camps: nextCamps,
        nextPatientId: state.nextPatientId + 1,
        patientDraft: action.draft,
        editingPatientId: id,
      };
    }
    case 'CREATE_CAMP': {
      const id = String(state.nextCampId);
      const record = buildCampRecordFromDraft(action.draft, id, `#${state.nextCampId}`);
      return {
        ...state,
        camps: { ...state.camps, [id]: record },
        nextCampId: state.nextCampId + 1,
        campDraft: null,
        editingCampId: null,
      };
    }
    case 'UPDATE_CAMP': {
      const existing = state.camps[action.id];
      if (!existing) return state;
      return {
        ...state,
        camps: {
          ...state.camps,
          [action.id]: updateCampRecordFromDraft(existing, action.draft),
        },
        campDraft: null,
        editingCampId: null,
      };
    }
    case 'SAVE_APPOINTMENT':
      return {
        ...state,
        appointments: { ...state.appointments, [action.patientId]: action.values },
      };
    case 'SET_PATIENT_DRAFT':
      return {
        ...state,
        patientDraft: action.draft,
        editingPatientId: action.editingId ?? null,
      };
    case 'SET_CAMP_DRAFT':
      return {
        ...state,
        campDraft: action.draft,
        editingCampId: action.editingId ?? null,
      };
    case 'UPDATE_PATIENT_DRAFT':
      return { ...state, patientDraft: action.draft };
    case 'UPDATE_CAMP_DRAFT':
      return { ...state, campDraft: action.draft };
    case 'PATCH_CAMP_DRAFT':
      if (!state.campDraft) return state;
      return { ...state, campDraft: { ...state.campDraft, ...action.partial } };
    default:
      return state;
  }
}
