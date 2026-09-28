export interface MedicalHistoryOption {
  label: string;
  nodeId: string;
  selected: boolean;
}

export interface MedicalHistoryQuestion {
  fieldNodeId: string;
  labelNodeId: string;
  rowNodeId: string;
  label: string;
  options: MedicalHistoryOption[];
}

export const medicalHistoryQuestions: MedicalHistoryQuestion[] = [
  {
    fieldNodeId: '126:21284',
    labelNodeId: '126:21286',
    rowNodeId: '126:21287',
    label: 'Diabetic',
    options: [
      { label: 'Yes', nodeId: '126:21288', selected: false },
      { label: 'No', nodeId: '126:21289', selected: true },
    ],
  },
  {
    fieldNodeId: '126:21290',
    labelNodeId: '126:21292',
    rowNodeId: '126:21293',
    label: 'Has Blood Pressure',
    options: [
      { label: 'Yes', nodeId: '126:21294', selected: false },
      { label: 'No', nodeId: '126:21295', selected: true },
    ],
  },
  {
    fieldNodeId: '126:21296',
    labelNodeId: '126:21298',
    rowNodeId: '126:21299',
    label: 'Daily Digital Hours',
    options: [
      { label: '<2 hrs', nodeId: '126:21300', selected: false },
      { label: '2-5 hrs', nodeId: '126:21301', selected: true },
      { label: '5+ hrs', nodeId: '126:21302', selected: false },
    ],
  },
];
