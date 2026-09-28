import { patientDetailsWithAppointmentMock } from './patientDetailsWithAppointment';
import { scheduleAppointmentMock } from './scheduleAppointment';

export type AppointmentPeriod = 'morning' | 'afternoon';

export interface AppointmentFormValues {
  branchCity: string;
  branchAddress: string;
  selectedDateContainerNodeId: string;
  period: AppointmentPeriod;
  selectedTimeSlotContainerNodeId: string;
}

export const emptyAppointmentFormValues: AppointmentFormValues = {
  branchCity: '',
  branchAddress: '',
  selectedDateContainerNodeId: '',
  period: 'morning',
  selectedTimeSlotContainerNodeId: '',
};

export const defaultAppointmentFormValues: AppointmentFormValues = {
  branchCity: patientDetailsWithAppointmentMock.appointmentCity,
  branchAddress: patientDetailsWithAppointmentMock.appointmentAddress,
  selectedDateContainerNodeId: '126:22034',
  period: 'afternoon',
  selectedTimeSlotContainerNodeId: '126:22082',
};

let savedAppointment: AppointmentFormValues = { ...defaultAppointmentFormValues };

export function getSavedAppointment(): AppointmentFormValues {
  return savedAppointment;
}

export function saveAppointment(values: AppointmentFormValues): void {
  savedAppointment = { ...values };
}

export function getTimeSlotsForPeriod(period: AppointmentPeriod) {
  return period === 'morning'
    ? scheduleAppointmentMock.morningTimeSlots
    : scheduleAppointmentMock.afternoonTimeSlots;
}

export function formatAppointmentTime(values: AppointmentFormValues): string {
  const dateOption = scheduleAppointmentMock.dateOptions.find(
    (option) => option.containerNodeId === values.selectedDateContainerNodeId,
  );
  const timeSlot = [...scheduleAppointmentMock.morningTimeSlots, ...scheduleAppointmentMock.afternoonTimeSlots].find(
    (slot) => slot.containerNodeId === values.selectedTimeSlotContainerNodeId,
  );

  if (!dateOption || !timeSlot) {
    return patientDetailsWithAppointmentMock.appointmentTime;
  }

  return `${timeSlot.time.replace(' ', '')}, ${dateOption.displayDate}`;
}
