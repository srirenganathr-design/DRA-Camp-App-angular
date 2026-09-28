import type { BranchSearchField } from './branchPicker';
import type { CampSearchField } from './campPicker';
import type { TeamMemberSearchField } from './teamMemberPicker';

export const inputPlaceholders = {
  patient: {
    name: 'Anita Sharma',
    age: '34',
    phone: '9876543210',
  },
  camp: {
    name: 'Dr. Agarwal\u2019s Eye Check-up camp',
    startTime: '09:00 AM',
    endTime: '05:00 PM',
    address: '24 & 26, Swathi, 29th St, Nanganallur, Chennai, TN 600061',
  },
  search: {
    camps: 'Diabetic Retinopathy',
    patients: 'Anita Sharma',
    campPatients: 'Anita Sharma',
  },
  branchSearch: {
    name: 'Nanganallur',
    code: 'BR-CHE-002',
    city: 'Velachery',
  },
  campSearch: {
    name: 'Diabetic Retinopathy',
    code: 'DRC',
    location: 'Coimbatore',
  },
  teamSearch: {
    name: 'Janani Sridhar',
    empId: '110850',
    email: 'janani.sridhar@dragarwals.com',
  },
  appointment: {
    branch: 'Velachery, Chennai',
  },
} as const;

export function getBranchSearchPlaceholder(field: BranchSearchField): string {
  return inputPlaceholders.branchSearch[field];
}

export function getTeamSearchPlaceholder(field: TeamMemberSearchField): string {
  return inputPlaceholders.teamSearch[field];
}

export function getCampSearchPlaceholder(field: CampSearchField): string {
  return inputPlaceholders.campSearch[field];
}
