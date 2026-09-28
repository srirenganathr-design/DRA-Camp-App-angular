import { Injectable, computed, signal } from '@angular/core';
import type { AppointmentFormValues } from '../data/appointmentForm';
import { appReducer, type AppAction } from './app-reducer';
import { campRecordToDraft, patientRecordToDraft } from './draft-mappers';
import { createInitialState } from './seedData';
import type {
  AppState,
  CampDraft,
  CampRecord,
  PatientDraft,
  PatientRecord,
} from './types';
import { emptyCampDraft, emptyPatientDraft } from './types';

@Injectable({ providedIn: 'root' })
export class AppStoreService {
  private readonly stateSignal = signal<AppState>(createInitialState());

  readonly state = this.stateSignal.asReadonly();

  readonly isEditingPatient = computed(() => this.state().editingPatientId !== null);
  readonly isEditingCamp = computed(() => this.state().editingCampId !== null);
  readonly editingPatientId = computed(() => this.state().editingPatientId);
  readonly editingCampId = computed(() => this.state().editingCampId);

  private dispatch(action: AppAction): void {
    this.stateSignal.update((state) => appReducer(state, action));
  }

  listPatients(): PatientRecord[] {
    return Object.values(this.state().patients);
  }

  listCamps(): CampRecord[] {
    return Object.values(this.state().camps);
  }

  getPatient(id: string): PatientRecord | undefined {
    return this.state().patients[id];
  }

  getCamp(id: string): CampRecord | undefined {
    return this.state().camps[id];
  }

  getAppointment(patientId: string): AppointmentFormValues | undefined {
    return this.state().appointments[patientId];
  }

  createPatient(draft: PatientDraft): string {
    const id = String(this.state().nextPatientId);
    this.dispatch({ type: 'CREATE_PATIENT', draft });
    return id;
  }

  updatePatient(id: string, draft: PatientDraft): void {
    this.dispatch({ type: 'UPDATE_PATIENT', id, draft });
  }

  syncPatientDraft(draft: PatientDraft): string | null {
    const editingId = this.state().editingPatientId;
    if (editingId) {
      this.dispatch({ type: 'SYNC_PATIENT_DRAFT', draft });
      return editingId;
    }
    const id = String(this.state().nextPatientId);
    this.dispatch({ type: 'SYNC_PATIENT_DRAFT', draft });
    return id;
  }

  createCamp(draft: CampDraft): string {
    const id = String(this.state().nextCampId);
    this.dispatch({ type: 'CREATE_CAMP', draft });
    return id;
  }

  updateCamp(id: string, draft: CampDraft): void {
    this.dispatch({ type: 'UPDATE_CAMP', id, draft });
  }

  saveAppointment(patientId: string, values: AppointmentFormValues): void {
    this.dispatch({ type: 'SAVE_APPOINTMENT', patientId, values });
  }

  startPatientDraft(editingId?: string): void {
    if (editingId) {
      const patient = this.state().patients[editingId];
      if (patient) {
        this.dispatch({
          type: 'SET_PATIENT_DRAFT',
          draft: patientRecordToDraft(patient),
          editingId,
        });
        return;
      }
    }
    this.dispatch({ type: 'SET_PATIENT_DRAFT', draft: emptyPatientDraft(), editingId: null });
  }

  startCampDraft(editingId?: string): void {
    if (editingId) {
      const camp = this.state().camps[editingId];
      if (camp) {
        this.dispatch({
          type: 'SET_CAMP_DRAFT',
          draft: campRecordToDraft(camp),
          editingId,
        });
        return;
      }
    }
    this.dispatch({ type: 'SET_CAMP_DRAFT', draft: emptyCampDraft(), editingId: null });
  }

  setPatientDraft(draft: PatientDraft): void {
    this.dispatch({ type: 'UPDATE_PATIENT_DRAFT', draft });
  }

  setCampDraft(draft: CampDraft): void {
    this.dispatch({ type: 'UPDATE_CAMP_DRAFT', draft });
  }

  patchCampDraft(partial: Partial<CampDraft>): void {
    this.dispatch({ type: 'PATCH_CAMP_DRAFT', partial });
  }

  clearPatientDraft(): void {
    this.dispatch({ type: 'SET_PATIENT_DRAFT', draft: null, editingId: null });
  }

  clearCampDraft(): void {
    this.dispatch({ type: 'SET_CAMP_DRAFT', draft: null, editingId: null });
  }
}
