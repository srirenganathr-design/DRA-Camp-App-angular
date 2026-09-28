import dotScreened from '../assets/icons/dot-screened.svg';
import dotReferred from '../assets/icons/dot-referred.svg';
import dotTreated from '../assets/icons/dot-treated.svg';
import dotFollowup from '../assets/icons/dot-followup.svg';
import type { Zone } from '../config/zones';

export type PatientStatus = 'Screened' | 'Referred' | 'Treated' | 'Visited';

export interface Patient {
  id?: string;
  nodeId: string;
  topNodeId: string;
  conditionsNodeId?: string;
  bottomNodeId: string;
  phoneNodeId: string;
  calendarNodeId: string;
  arrowNodeId: string;
  statusNodeId: string;
  verifyNodeId?: string;
  verifiedBadgeNodeId?: string;
  name: string;
  patientNumber: string;
  campName: string;
  campId: string;
  status: PatientStatus;
  dotIcon: string;
  campRef: string;
  waitTime: string;
  age: string;
  gender: string;
  conditions?: string;
  phone: string;
  phoneVerified?: boolean;
  registeredAt: string;
  zone?: Zone;
}

export const patients: Patient[] = [
  {
    nodeId: '20:22318',
    topNodeId: '20:22319',
    conditionsNodeId: '20:22336',
    bottomNodeId: '20:22339',
    phoneNodeId: '20:22343',
    verifyNodeId: '20:22344',
    calendarNodeId: '20:22346',
    arrowNodeId: '20:22347',
    statusNodeId: '20:22330',
    name: 'Anita Sharma',
    patientNumber: '#1',
    campName: 'Eye Screening Camp',
    campId: '1',
    status: 'Screened',
    dotIcon: dotScreened,
    campRef: '#7',
    waitTime: '20M',
    age: '20',
    gender: 'Male',
    conditions: 'Myopia, Astigmatism, Dry eye syndrome, Computer vision strain',
    phone: '9876543210',
    registeredAt: '2026-09-10',
    zone: 'Nanganallur',
  },
  {
    nodeId: '20:22348',
    topNodeId: '20:22349',
    bottomNodeId: '20:22367',
    phoneNodeId: '20:22370',
    verifiedBadgeNodeId: '20:22371',
    calendarNodeId: '20:22374',
    arrowNodeId: '20:22375',
    statusNodeId: '20:22360',
    name: 'Suresh Kumar',
    patientNumber: '#2',
    campName: 'Community Eye Health Camp',
    campId: '1',
    status: 'Referred',
    dotIcon: dotReferred,
    campRef: '#7',
    waitTime: '10M',
    age: '10',
    gender: 'Female',
    phone: '8745012369',
    phoneVerified: true,
    registeredAt: '2026-08-20',
    zone: 'Nanganallur',
  },
  {
    nodeId: '20:22376',
    topNodeId: '20:22377',
    conditionsNodeId: '20:22394',
    bottomNodeId: '20:22397',
    phoneNodeId: '20:22400',
    verifyNodeId: '20:22402',
    calendarNodeId: '20:22404',
    arrowNodeId: '20:22405',
    statusNodeId: '20:22388',
    name: 'Meera Nair',
    patientNumber: '#3',
    campName: 'Netra Jyothi Free Eye Camp',
    campId: '3',
    status: 'Treated',
    dotIcon: dotTreated,
    campRef: '#7',
    waitTime: '15M',
    age: '9',
    gender: 'Male',
    conditions: 'Diabetic retinopathy, Macular degeneration, Conjunctivitis',
    phone: '7012345698',
    registeredAt: '2026-06-01',
    zone: 'Nanganallur',
  },
  {
    nodeId: '20:22436',
    topNodeId: '20:22437',
    conditionsNodeId: '20:22454',
    bottomNodeId: '20:22457',
    phoneNodeId: '20:22460',
    verifyNodeId: '20:22462',
    calendarNodeId: '20:22464',
    arrowNodeId: '20:22465',
    statusNodeId: '20:22448',
    name: 'Ravi Shankar',
    patientNumber: '#4',
    campName: 'Rural Eye Screening Initiative',
    campId: '2',
    status: 'Treated',
    dotIcon: dotTreated,
    campRef: '#7',
    waitTime: '8M',
    age: '11',
    gender: 'Female',
    conditions: 'Hypermetropia, Amblyopia, Corneal ulcer, Blepharitis',
    phone: '9034567812',
    registeredAt: '2026-01-15',
    zone: 'T Nagar',
  },
  {
    nodeId: '20:22406',
    topNodeId: '20:22407',
    conditionsNodeId: '20:22424',
    bottomNodeId: '20:22427',
    phoneNodeId: '20:22430',
    verifyNodeId: '20:22431',
    calendarNodeId: '20:22434',
    arrowNodeId: '20:22435',
    statusNodeId: '20:22418',
    name: 'Lakshmi Devi',
    patientNumber: '#5',
    campName: "Dr. Agarwal's Eye Check-Up Camp",
    campId: '5',
    status: 'Visited',
    dotIcon: dotFollowup,
    campRef: '#7',
    waitTime: '12M',
    age: '26',
    gender: 'Male',
    conditions: 'Cataract, Strabismus, Keratoconus, Dry eyes',
    phone: '8123456790',
    registeredAt: '2026-09-17',
    zone: 'Nanganallur',
  },
  {
    nodeId: '20:22466',
    topNodeId: '20:22467',
    conditionsNodeId: '20:22468',
    bottomNodeId: '20:22469',
    phoneNodeId: '20:22470',
    verifyNodeId: '20:22471',
    calendarNodeId: '20:22472',
    arrowNodeId: '20:22473',
    statusNodeId: '20:22474',
    name: 'Arun Murali',
    patientNumber: '#6',
    campName: 'Rural Eye Care Camp',
    campId: '4',
    status: 'Treated',
    dotIcon: dotTreated,
    campRef: '#3',
    waitTime: '6M',
    age: '32',
    gender: 'Male',
    conditions: 'Myopia, Retinal detachment, Chalazion, Diabetic retinopathy',
    phone: '7890123456',
    registeredAt: '2026-07-15',
    zone: 'Nanganallur',
  },
];

export function getPatientKey(patient: Pick<Patient, 'id' | 'nodeId'>): string {
  return patient.id ?? patient.nodeId;
}
