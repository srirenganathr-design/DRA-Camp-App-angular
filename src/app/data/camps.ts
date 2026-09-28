const dotActive = 'assets/icons/dot-active.svg';
const dotScheduled = 'assets/icons/dot-scheduled.svg';
const dotCancelled = 'assets/icons/dot-cancelled.svg';
const dotDelayed = 'assets/icons/dot-delayed.svg';
const dotCompleted = 'assets/icons/dot-completed.svg';
import type { Zone } from '../config/zones';

export type CampStatus = 'Active' | 'Scheduled' | 'Cancelled' | 'Delayed' | 'Completed';

export interface Camp {
  id?: string;
  nodeId: string;
  topNodeId: string;
  bottomNodeId: string;
  actionNodeId: string;
  cancelNodeId?: string;
  name: string;
  campNumber: string;
  status: CampStatus;
  statusNodeId: string;
  dotIcon: string;
  patientCount: string;
  typeCode: string;
  doctor: string;
  date: string;
  location: string;
  zone?: Zone;
  muted?: boolean;
}

export const camps: Camp[] = [
  {
    id: '1',
    nodeId: '16:2924',
    topNodeId: '16:2925',
    bottomNodeId: '16:2939',
    actionNodeId: '16:2946',
    name: 'Cataract Screening Camp',
    campNumber: '#1',
    status: 'Active',
    statusNodeId: '16:2933',
    dotIcon: dotActive,
    patientCount: '14',
    typeCode: 'CSC',
    doctor: 'Dr. Kavitha Nair',
    date: '12-09-2026',
    location: 'Madurai, TN',
    zone: 'Nanganallur',
  },
  {
    id: '2',
    nodeId: '16:2947',
    topNodeId: '16:2948',
    bottomNodeId: '16:2962',
    actionNodeId: '16:2969',
    name: 'Glaucoma Detection Drive',
    campNumber: '#8',
    status: 'Scheduled',
    statusNodeId: '16:2956',
    dotIcon: dotScheduled,
    patientCount: '23',
    typeCode: 'GDD',
    doctor: 'Dr. Rakesh Menon',
    date: '18-01-2027',
    location: 'Coimbatore, TN',
    zone: 'T Nagar',
  },
  {
    id: '3',
    nodeId: '16:2970',
    topNodeId: '16:2971',
    bottomNodeId: '16:2985',
    actionNodeId: '16:2992',
    name: 'Diabetic Retinopathy Check-up',
    campNumber: '#3',
    status: 'Cancelled',
    statusNodeId: '16:2979',
    dotIcon: dotCancelled,
    patientCount: '08',
    typeCode: 'DRC',
    doctor: 'Dr. Anita Desai',
    date: '18-01-2027',
    location: 'Coimbatore, TN',
    zone: 'Nanganallur',
  },
  {
    id: '4',
    nodeId: '16:2993',
    topNodeId: '16:2994',
    bottomNodeId: '16:3008',
    actionNodeId: '16:3017',
    cancelNodeId: '16:3016',
    name: 'Pediatric Vision Screening Camp',
    campNumber: '#6',
    status: 'Delayed',
    statusNodeId: '16:3002',
    dotIcon: dotDelayed,
    patientCount: '08',
    typeCode: 'PVS',
    doctor: 'Dr. Deepa Krishnan',
    date: '03-12-2026',
    location: 'Trichy, TN',
    zone: 'Nanganallur',
  },
  {
    id: '5',
    nodeId: '16:3018',
    topNodeId: '16:3019',
    bottomNodeId: '16:3033',
    actionNodeId: '16:3040',
    name: 'Corneal Health Awareness Camp',
    campNumber: '#2',
    status: 'Completed',
    statusNodeId: '16:3027',
    dotIcon: dotCompleted,
    patientCount: '16',
    typeCode: 'PVS',
    doctor: 'Dr. Rajesh Iyer',
    date: '28-08-2026',
    location: 'Erode, TN',
    zone: 'Nanganallur',
    muted: true,
  },
];
