import { Injectable, computed, signal } from '@angular/core';
import { getPatientKey, patients as seedPatients, type Patient } from '../data/patients';

const VERIFICATION_STORAGE_KEY = 'dra-phone-verified';
const PHONE_STORAGE_KEY = 'dra-phone-overrides';

function readStoredVerification(): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(VERIFICATION_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, boolean>;
    return typeof parsed === 'object' && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}

function writeStoredVerification(map: Record<string, boolean>): void {
  localStorage.setItem(VERIFICATION_STORAGE_KEY, JSON.stringify(map));
}

function readStoredPhoneOverrides(): Record<string, string> {
  try {
    const raw = localStorage.getItem(PHONE_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, string>;
    return typeof parsed === 'object' && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}

function writeStoredPhoneOverrides(map: Record<string, string>): void {
  localStorage.setItem(PHONE_STORAGE_KEY, JSON.stringify(map));
}

function buildInitialMap(sourcePatients: Patient[]): Record<string, boolean> {
  const stored = readStoredVerification();
  const initial: Record<string, boolean> = { ...stored };
  for (const patient of sourcePatients) {
    const key = getPatientKey(patient);
    if (patient.phoneVerified === true) {
      initial[key] = true;
    }
  }
  return initial;
}

function mergePatientPhones(patients: Patient[], phoneOverrides: Record<string, string>): Patient[] {
  return patients.map((patient) => {
    const key = getPatientKey(patient);
    const phone = phoneOverrides[key];
    return phone && phone !== patient.phone ? { ...patient, phone } : patient;
  });
}

@Injectable({ providedIn: 'root' })
export class PhoneVerificationService {
  private readonly sourcePatients = seedPatients;
  private readonly verificationMap = signal<Record<string, boolean>>(
    buildInitialMap(this.sourcePatients),
  );
  private readonly phoneOverrides = signal<Record<string, string>>(readStoredPhoneOverrides());
  private readonly activePatientKey = signal<string | null>(null);

  readonly patients = computed(() =>
    mergePatientPhones(this.sourcePatients, this.phoneOverrides()),
  );

  readonly activePatient = computed(
    () =>
      this.patients().find((patient) => getPatientKey(patient) === this.activePatientKey()) ??
      null,
  );

  readonly isVerificationOpen = computed(() => this.activePatientKey() !== null);

  isVerified(patient: Patient): boolean {
    const key = getPatientKey(patient);
    return this.verificationMap()[key] === true || patient.phoneVerified === true;
  }

  openVerification(patient: Patient): void {
    this.activePatientKey.set(getPatientKey(patient));
  }

  closeVerification(): void {
    this.activePatientKey.set(null);
  }

  markVerified(patientKey: string): void {
    this.verificationMap.update((current) => {
      const next = { ...current, [patientKey]: true };
      writeStoredVerification(next);
      return next;
    });
  }

  updatePhone(patientKey: string, phone: string): void {
    this.phoneOverrides.update((current) => {
      const next = { ...current, [patientKey]: phone };
      writeStoredPhoneOverrides(next);
      return next;
    });
  }
}
