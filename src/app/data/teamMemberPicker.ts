export type TeamMemberSearchField = 'name' | 'empId' | 'email';

export type TeamMemberRole = 'manager' | 'executive' | 'counsellor' | 'consultant';

export interface TeamMemberOption {
  id: string;
  label: string;
  name: string;
  empId: string;
  email: string;
  chipNodeId?: string;
}

interface StaffRecord extends TeamMemberOption {
  roles: TeamMemberRole[];
}

function member(
  id: string,
  name: string,
  empId: string,
  email: string,
  roles: TeamMemberRole[],
  chipNodeId?: string,
): StaffRecord {
  const label = id === 'gowriwakkam' ? name : `${name} - ${empId}`;
  return { id, label, name, empId, email, roles, chipNodeId };
}

/** Pinned staff required by seed camps and Playwright tests */
const PINNED_STAFF: StaffRecord[] = [
  member('gowriwakkam', 'Gowriwakkam', '108001', 'gowriwakkam.v@dragarwals.com', ['manager']),
  member('110850', 'Janani Sridhar', '110850', 'janani.sridhar@dragarwals.com', ['manager', 'executive', 'counsellor', 'consultant'], '156:31441'),
  member('900339', 'Srikrishna Gururao Nadgouda', '900339', 'srikrishna.nadgouda@dragarwals.com', ['manager', 'executive', 'counsellor', 'consultant'], '156:31561'),
  member('113366', 'R Ranjana Sri', '113366', 'ranjana.sri@dragarwals.com', ['manager', 'executive', 'counsellor', 'consultant']),
  member('114201', 'Vasanth Krishnan', '114201', 'vasanth.krishnan@dragarwals.com', ['manager', 'executive']),
  member('115432', 'Priya Venkatesh', '115432', 'priya.venkatesh@dragarwals.com', ['executive', 'counsellor']),
  member('116578', 'Arun Kumar Selvam', '116578', 'arun.selvam@dragarwals.com', ['executive', 'consultant']),
  member('117890', 'Deepa Lakshmi', '117890', 'deepa.lakshmi@dragarwals.com', ['executive', 'counsellor']),
  member('118234', 'Karthik Subramanian', '118234', 'karthik.subramanian@dragarwals.com', ['executive', 'consultant']),
  member('119567', 'Meena Rajesh', '119567', 'meena.rajesh@dragarwals.com', ['counsellor', 'consultant']),
  member('120891', 'Suresh Babu', '120891', 'suresh.babu@dragarwals.com', ['consultant']),
  member('121345', 'Anitha Devi', '121345', 'anitha.devi@dragarwals.com', ['counsellor', 'consultant']),
  member('122678', 'Mohammed Farook', '122678', 'mohammed.farook@dragarwals.com', ['counsellor']),
  member('123901', 'Lakshmi Narayanan', '123901', 'lakshmi.narayanan@dragarwals.com', ['consultant']),
  member('124456', 'Harish Chandran', '124456', 'harish.chandran@dragarwals.com', ['consultant']),
];

const FIRST_NAMES = [
  'Anitha',
  'Arun',
  'Bhavani',
  'Chitra',
  'Deepak',
  'Divya',
  'Ganesh',
  'Geetha',
  'Harish',
  'Indira',
  'Janani',
  'Karthik',
  'Kavitha',
  'Lakshmi',
  'Manoj',
  'Meena',
  'Mohan',
  'Naveen',
  'Padma',
  'Priya',
  'Rahul',
  'Rajesh',
  'Ranjana',
  'Revathi',
  'Sanjay',
  'Saranya',
  'Senthil',
  'Shalini',
  'Srikanth',
  'Subash',
  'Suresh',
  'Uma',
  'Vasanth',
  'Vijay',
  'Vimala',
];

const LAST_NAMES = [
  'Krishnan',
  'Subramanian',
  'Venkatesh',
  'Narayanan',
  'Selvam',
  'Rajesh',
  'Devi',
  'Kumar',
  'Raman',
  'Iyer',
  'Nair',
  'Pillai',
  'Reddy',
  'Sharma',
  'Babu',
  'Chandran',
  'Murugan',
  'Perumal',
  'Sundaram',
  'Varadarajan',
];


function rolesForIndex(index: number): TeamMemberRole[] {
  const roles: TeamMemberRole[] = [];
  if (index % 17 === 0) roles.push('manager');
  if (index % 3 !== 2) roles.push('executive');
  if (index % 2 === 0) roles.push('counsellor');
  if (index % 5 !== 4) roles.push('consultant');
  return roles.length > 0 ? roles : ['executive'];
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '.')
    .replace(/^\.|\.$/g, '');
}

function generateStaff(targetCount: number): StaffRecord[] {
  const pinnedIds = new Set(PINNED_STAFF.map((s) => s.id));
  const generated: StaffRecord[] = [];
  let index = 0;

  while (PINNED_STAFF.length + generated.length < targetCount) {
    const first = FIRST_NAMES[index % FIRST_NAMES.length];
    const last = LAST_NAMES[(index * 7) % LAST_NAMES.length];
    const name = `${first} ${last}`;
    const empId = String(200001 + index);
    const id = empId;

    if (!pinnedIds.has(id)) {
      const email = `${slugify(first)}.${slugify(last)}${index > 0 ? index : ''}@dragarwals.com`;
      generated.push(member(id, name, empId, email, rolesForIndex(index)));
    }

    index += 1;
  }

  return generated;
}

const staffRecords: StaffRecord[] = [...PINNED_STAFF, ...generateStaff(150)];

export const staffCatalog: TeamMemberOption[] = staffRecords.map(({ roles: _roles, ...option }) => option);

function optionsForRole(role: TeamMemberRole): TeamMemberOption[] {
  return staffRecords
    .filter((record) => record.roles.includes(role))
    .map(({ roles: _roles, ...option }) => option);
}

export function filterTeamMembers(
  query: string,
  field: TeamMemberSearchField,
  options: TeamMemberOption[],
): TeamMemberOption[] {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) {
    return [];
  }

  return options.filter((option) => {
    if (field === 'empId') {
      return option.empId.includes(normalizedQuery) || option.id.toLowerCase().includes(normalizedQuery);
    }

    if (field === 'email') {
      return option.email.toLowerCase().includes(normalizedQuery);
    }

    return (
      option.name.toLowerCase().includes(normalizedQuery) ||
      option.label.toLowerCase().includes(normalizedQuery)
    );
  });
}

export const teamMemberPickerTitles: Record<TeamMemberRole, string> = {
  manager: 'Add Manager',
  executive: 'Add Executives',
  counsellor: 'Add Counsellors',
  consultant: 'Add Consultants',
};

export const teamMemberPickerEmptyMock = {
  sheetNodeId: '156:31293',
  headerNodeId: '156:31294',
  titleNodeId: '156:31295',
  resetButtonNodeId: '156:31296',
  bodyNodeId: '156:31297',
  searchBySectionNodeId: '185:48261',
  searchByLabelNodeId: '185:48262',
  nameTabNodeId: '185:48264',
  empIdTabNodeId: '185:48267',
  emailTabNodeId: '185:48270',
  searchInputNodeId: '156:31308',
  selectedAreaNodeId: '156:31309',
  emptyStateIconNodeId: '156:31310',
  emptyStateTitleNodeId: '156:31312',
  emptyStateSubtitleNodeId: '156:31313',
  footerNodeId: '156:31314',
  footerRowNodeId: '156:31315',
  closeButtonNodeId: '156:31316',
  applyButtonNodeId: '156:31317',
};

export const teamMemberPickerFilledMock = {
  sheetNodeId: '156:31378',
  headerNodeId: '156:31379',
  titleNodeId: '156:31380',
  resetButtonNodeId: '156:31381',
  bodyNodeId: '156:31382',
  searchBySectionNodeId: '185:48245',
  searchByLabelNodeId: '185:48246',
  nameTabNodeId: '185:48248',
  empIdTabNodeId: '185:48251',
  emailTabNodeId: '185:48254',
  searchInputNodeId: '156:31393',
  selectedAreaNodeId: '156:31394',
  footerNodeId: '156:31399',
  footerRowNodeId: '156:31400',
  closeButtonNodeId: '156:31401',
  applyButtonNodeId: '156:31402',
};

export const managerOptions: TeamMemberOption[] = optionsForRole('manager');
export const executiveOptions: TeamMemberOption[] = optionsForRole('executive');
export const counsellorOptions: TeamMemberOption[] = optionsForRole('counsellor');
export const consultantOptions: TeamMemberOption[] = optionsForRole('consultant');

export const teamMemberOptionsByRole: Record<TeamMemberRole, TeamMemberOption[]> = {
  manager: managerOptions,
  executive: executiveOptions,
  counsellor: counsellorOptions,
  consultant: consultantOptions,
};

export const initialTeamSelections: Record<TeamMemberRole, string[]> = {
  manager: ['gowriwakkam'],
  executive: ['110850', '900339', '113366'],
  counsellor: ['110850', '900339', '113366'],
  consultant: [],
};

export function resolveTeamMembers(role: TeamMemberRole, selectedIds: string[]) {
  const options = teamMemberOptionsByRole[role];
  return options.filter((option) => selectedIds.includes(option.id));
}

export interface TeamSectionEmptyStateConfig {
  message: string;
  containerNodeId?: string;
  iconNodeId?: string;
  textNodeId?: string;
}

export const teamSectionEmptyStates: Record<TeamMemberRole, TeamSectionEmptyStateConfig> = {
  manager: { message: 'No Manager Selected' },
  executive: { message: 'No Executives Selected' },
  counsellor: { message: 'No Counsellors Selected' },
  consultant: {
    message: 'No Consultants Selected',
    containerNodeId: '156:46374',
    iconNodeId: '156:46375',
    textNodeId: '156:46376',
  },
};
