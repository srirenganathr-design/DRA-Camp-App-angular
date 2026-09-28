export interface DiagnosisOption {
  optionNodeId: string;
  label: string;
  selected: boolean;
}

export const primaryDiagnosis: DiagnosisOption = {
  optionNodeId: '126:21709',
  label: 'No Abnormality Detected',
  selected: true,
};

export const diagnosisOptions: DiagnosisOption[] = [
  { optionNodeId: '126:21711', label: 'Cataract', selected: false },
  { optionNodeId: '126:21712', label: 'Myopia', selected: false },
  { optionNodeId: '126:21713', label: 'Glaucoma', selected: false },
  { optionNodeId: '126:21714', label: 'Hypermetropia', selected: false },
  { optionNodeId: '126:21715', label: 'Chalazion', selected: false },
  { optionNodeId: '126:21716', label: 'Diabetic retinopathy', selected: false },
  { optionNodeId: '126:21717', label: 'Hypertension', selected: false },
  { optionNodeId: '126:21718', label: 'Retinal Detachment', selected: false },
  { optionNodeId: '126:21719', label: 'Presbyopia', selected: false },
];
