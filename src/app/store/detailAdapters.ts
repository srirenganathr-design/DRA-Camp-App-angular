import type { AppointmentFormValues } from '../data/appointmentForm';
import { formatAppointmentTime } from '../data/appointmentForm';
import { campDetailsEmptyMock, campDetailsWithPatientsMock } from '../data/campDetails';
import { campDetailsPatients } from '../data/campDetailsPatients';
import {
  patientDetailsMock,
  type DetailRow,
  type EyeAutoRefraction,
  type EyeDryRefraction,
} from '../data/patientDetails';
import { patientDetailsWithAppointmentMock } from '../data/patientDetailsWithAppointment';
import type { Patient } from '../data/patients';
import { autoRefractionBlocks, patientRecordToListCard, readingsToRefractionRows } from './adapters';
import type { CampRecord, EyeReadings, PatientRecord } from './types';

const GENDER_LABEL: Record<string, string> = {
  male: 'Male',
  female: 'Female',
  others: 'Others',
};

function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) {
    return `${digits.slice(0, 5)} ${digits.slice(5)}`;
  }
  return phone;
}

function buildDryRefractionEye(
  eyeLabel: string,
  eyeLabelNodeId: string,
  sectionNodeId: string,
  tableWrapperNodeId: string,
  headerRowNodeId: string,
  headerCellNodeIds: string[],
  bodyNodeId: string,
  templateRows: EyeDryRefraction['rows'],
  readings: EyeReadings,
): EyeDryRefraction {
  const rowData = readingsToRefractionRows(readings);
  return {
    eyeLabelNodeId,
    eyeLabel,
    sectionNodeId,
    tableWrapperNodeId,
    headerRowNodeId,
    headerCellNodeIds,
    bodyNodeId,
    rows: templateRows.map((template, index) => ({
      ...template,
      sph: rowData[index]?.sph ?? template.sph,
      cyl: rowData[index]?.cyl ?? template.cyl,
      axis: rowData[index]?.axis ?? template.axis,
    })),
  };
}

function buildAutoRefractionEye(
  template: EyeAutoRefraction,
  readings: EyeReadings,
): EyeAutoRefraction {
  const blocks = autoRefractionBlocks(readings);
  return {
    ...template,
    blocks: template.blocks.map((block, index) => ({
      ...block,
      values: blocks[index]?.values ?? block.values,
    })),
  };
}

type PatientDetailsLayout = typeof patientDetailsMock | typeof patientDetailsWithAppointmentMock;

function buildPatientDetailsViewFromLayout<T extends PatientDetailsLayout>(
  patient: PatientRecord,
  campName: string,
  layout: T,
) {
  const medicalHistory: DetailRow[] = [
    {
      rowNodeId: layout.medicalHistory[0].rowNodeId,
      labelNodeId: layout.medicalHistory[0].labelNodeId,
      valueNodeId: layout.medicalHistory[0].valueNodeId,
      label: 'Diabetic',
      value: patient.medicalHistory.diabetic,
    },
    {
      rowNodeId: layout.medicalHistory[1].rowNodeId,
      labelNodeId: layout.medicalHistory[1].labelNodeId,
      valueNodeId: layout.medicalHistory[1].valueNodeId,
      label: 'Blood Pressure',
      value: patient.medicalHistory.bloodPressure === 'Yes' ? '120/80 Hg' : 'No',
    },
    {
      rowNodeId: layout.medicalHistory[2].rowNodeId,
      labelNodeId: layout.medicalHistory[2].labelNodeId,
      valueNodeId: layout.medicalHistory[2].valueNodeId,
      label: 'Daily Digital Hours',
      value: patient.medicalHistory.digitalHours,
    },
  ];

  const [rightDryTemplate, leftDryTemplate] = layout.dryRefractionEyes;
  const [rightAutoTemplate, leftAutoTemplate] = layout.dryAutoRefractionEyes;

  return {
    ...layout,
    name: patient.profile.name,
    displayNumber: patient.patientNumber.replace(/^#/, ''),
    status: patient.status,
    dotIcon: patient.listMeta.dotIcon,
    age: patient.profile.age,
    gender: GENDER_LABEL[patient.profile.gender] ?? patient.profile.gender,
    phone: formatPhone(patient.profile.phone),
    campName,
    medicalHistory,
    dryRefractionEyes: [
      buildDryRefractionEye(
        rightDryTemplate.eyeLabel,
        rightDryTemplate.eyeLabelNodeId,
        rightDryTemplate.sectionNodeId,
        rightDryTemplate.tableWrapperNodeId,
        rightDryTemplate.headerRowNodeId,
        rightDryTemplate.headerCellNodeIds,
        rightDryTemplate.bodyNodeId,
        rightDryTemplate.rows,
        patient.dryRefraction.right,
      ),
      buildDryRefractionEye(
        leftDryTemplate.eyeLabel,
        leftDryTemplate.eyeLabelNodeId,
        leftDryTemplate.sectionNodeId,
        leftDryTemplate.tableWrapperNodeId,
        leftDryTemplate.headerRowNodeId,
        leftDryTemplate.headerCellNodeIds,
        leftDryTemplate.bodyNodeId,
        leftDryTemplate.rows,
        patient.dryRefraction.left,
      ),
    ],
    dryAutoRefractionEyes: [
      buildAutoRefractionEye(rightAutoTemplate, patient.dryAutoRefraction.right),
      buildAutoRefractionEye(leftAutoTemplate, patient.dryAutoRefraction.left),
    ],
  } as T & {
    name: string;
    displayNumber: string;
    status: PatientRecord['status'];
    dotIcon: string;
    age: string;
    gender: string;
    phone: string;
    campName: string;
    medicalHistory: DetailRow[];
    dryRefractionEyes: EyeDryRefraction[];
    dryAutoRefractionEyes: EyeAutoRefraction[];
  };
}

export function buildPatientDetailsView(patient: PatientRecord, campName: string) {
  return buildPatientDetailsViewFromLayout(patient, campName, patientDetailsMock);
}

export function buildPatientDetailsWithAppointmentView(
  patient: PatientRecord,
  campName: string,
  appointment: AppointmentFormValues,
) {
  const base = buildPatientDetailsViewFromLayout(patient, campName, patientDetailsWithAppointmentMock);
  return {
    ...base,
    appointmentTime: formatAppointmentTime(appointment),
    appointmentCity: appointment.branchCity,
    appointmentAddress: appointment.branchAddress,
  };
}

export function buildCampDetailsPatients(camp: CampRecord, patients: PatientRecord[]): Patient[] {
  if (camp.id === '1') {
    return campDetailsPatients;
  }
  return patients
    .filter((p) => p.profile.campId === camp.id)
    .map((p) => patientRecordToListCard(p, camp.name));
}

export function buildCampDetailsLayout(camp: CampRecord | null, isNewCamp: boolean) {
  if (isNewCamp || !camp || camp.patientIds.length === 0) {
    return { layout: campDetailsEmptyMock, variant: 'empty' as const };
  }
  return { layout: campDetailsWithPatientsMock, variant: 'withPatients' as const };
}

function formatCampTimeForDisplay(time: string) {
  return time.replace(/\s*(AM|PM)/i, (_, meridiem) => meridiem.toUpperCase()).replace(/\s/g, '');
}

export function campRecordToDetailFields(camp: CampRecord) {
  const start = formatCampTimeForDisplay(camp.startTime);
  const end = formatCampTimeForDisplay(camp.endTime);
  const campNumber = camp.campNumber.replace(/^#/, '');
  return {
    name: camp.name,
    campNumber,
    typeLabel: camp.typeLabel,
    manager: camp.manager,
    status: camp.status,
    dotIcon: camp.listMeta.dotIcon,
    schedule: `${start} - ${end}, ${camp.date}`,
    city: camp.city,
    address: camp.address,
    stats: {
      screened: '121',
      referred: '0',
      visited: '22',
      treated: '0',
    },
  };
}
