export interface DetailRow {
  rowNodeId: string;
  labelNodeId: string;
  valueNodeId: string;
  label: string;
  value: string;
}

export interface RefractionReadingRow {
  rowIndex: number;
  readingCellNodeId: string;
  sphCellNodeId: string;
  cylCellNodeId: string;
  axisCellNodeId: string;
  sph: string;
  cyl: string;
  axis: string;
}

export interface AutoRefractionBlock {
  labelNodeId: string;
  label: string;
  tableNodeId: string;
  columns: string[];
  columnHeaderNodeIds: string[];
  valueCellNodeIds: string[];
  values: string[];
  singleColumn?: boolean;
}

export interface EyeAutoRefraction {
  eyeLabelNodeId: string;
  eyeLabel: string;
  sectionNodeId: string;
  blocks: AutoRefractionBlock[];
}

export interface EyeDryRefraction {
  eyeLabelNodeId: string;
  eyeLabel: string;
  sectionNodeId: string;
  tableWrapperNodeId: string;
  headerRowNodeId: string;
  headerCellNodeIds: string[];
  bodyNodeId: string;
  rows: RefractionReadingRow[];
}

export const patientDetailsMock = {
  screenNodeId: '16:3821',
  statusBarNodeId: '16:4077',
  mainNodeId: '16:3822',
  headerNodeId: '16:3823',
  headerRowNodeId: '16:3824',
  backButtonNodeId: '16:3825',
  titleNodeId: '16:3826',
  editButtonNodeId: '16:3827',
  contentNodeId: '16:3828',
  profileCardNodeId: '16:3829',
  profileHeaderNodeId: '16:3830',
  profileCurveNodeId: '16:3831',
  profileBodyNodeId: '16:3832',
  avatarNodeId: '16:3833',
  nameBlockNodeId: '16:3836',
  nameWrapNodeId: '16:3837',
  nameNodeId: '16:3838',
  idStatusRowNodeId: '16:3839',
  hashMetaNodeId: '16:3840',
  hashIconNodeId: '16:3841',
  numberNodeId: '16:3843',
  idStatusDotNodeId: '16:3844',
  statusBadgeNodeId: '16:3845',
  dividerNodeId: '16:3846',
  metaRowNodeId: '16:3847',
  ageTextNodeId: '16:3851',
  genderTextNodeId: '16:3856',
  phoneTextNodeId: '16:3861',
  campRowNodeId: '16:3863',
  campNameNodeId: '16:3865',
  medicalHistorySectionNodeId: '16:3866',
  medicalHistoryTitleNodeId: '16:3869',
  medicalHistoryCardNodeId: '16:3871',
  dryRefractionSectionNodeId: '16:3881',
  dryRefractionTitleNodeId: '16:3884',
  dryAutoRefractionSectionNodeId: '16:3964',
  dryAutoRefractionTitleNodeId: '16:3967',
  footerNodeId: '16:4073',
  scheduleButtonNodeId: '16:4075',
  scheduleLabelNodeId: '16:4076',
  footerRowNodeId: '16:4074',
  scrolledStickyNodeId: '18:20751',
  scrolledPatientNameNodeId: '18:20752',
  scrolledIdStatusRowNodeId: '18:20753',
  scrolledHashMetaNodeId: '18:20754',
  scrolledHashIconNodeId: '18:20755',
  scrolledNumberNodeId: '18:20757',
  scrolledIdStatusDotNodeId: '18:20758',
  scrolledStatusBadgeNodeId: '18:20759',
  name: 'Rajkumar Periyasamy',
  displayNumber: '23',
  status: 'Screened',
  age: '12',
  gender: 'Female',
  phone: '89706 35213',
  campName: 'Dr. Agarwal\u2019s Eye Check-up camp',
  medicalHistory: [
    { rowNodeId: '16:3872', labelNodeId: '16:3873', valueNodeId: '16:3874', label: 'Diabetic', value: 'No' },
    {
      rowNodeId: '16:3875',
      labelNodeId: '16:3876',
      valueNodeId: '16:3877',
      label: 'Blood Pressure',
      value: '120/80 Hg',
    },
    {
      rowNodeId: '16:3878',
      labelNodeId: '16:3879',
      valueNodeId: '16:3880',
      label: 'Daily Digital Hours',
      value: '2-5 hrs',
    },
  ] satisfies DetailRow[],
  dryRefractionEyes: [
    {
      eyeLabelNodeId: '16:3889',
      eyeLabel: 'R/OD',
      sectionNodeId: '16:3886',
      tableWrapperNodeId: '16:3890',
      headerRowNodeId: '16:3891',
      headerCellNodeIds: ['16:3893', '16:3895', '16:3897', '16:3899'],
      bodyNodeId: '16:3900',
      rows: [
        {
          rowIndex: 1,
          readingCellNodeId: '16:3902',
          sphCellNodeId: '16:3904',
          cylCellNodeId: '16:3906',
          axisCellNodeId: '16:3908',
          sph: '-25.25',
          cyl: '-25.25',
          axis: '-25.25',
        },
        {
          rowIndex: 2,
          readingCellNodeId: '16:3910',
          sphCellNodeId: '16:3912',
          cylCellNodeId: '16:3914',
          axisCellNodeId: '16:3916',
          sph: '-25.25',
          cyl: '-25.25',
          axis: '-25.25',
        },
        {
          rowIndex: 3,
          readingCellNodeId: '16:3918',
          sphCellNodeId: '16:3920',
          cylCellNodeId: '16:3922',
          axisCellNodeId: '16:3924',
          sph: '-25.25',
          cyl: '-25.25',
          axis: '-25.25',
        },
      ],
    },
    {
      eyeLabelNodeId: '16:3928',
      eyeLabel: 'L/OS',
      sectionNodeId: '16:3925',
      tableWrapperNodeId: '16:3929',
      headerRowNodeId: '16:3930',
      headerCellNodeIds: ['16:3932', '16:3934', '16:3936', '16:3938'],
      bodyNodeId: '16:3939',
      rows: [
        {
          rowIndex: 1,
          readingCellNodeId: '16:3941',
          sphCellNodeId: '16:3943',
          cylCellNodeId: '16:3945',
          axisCellNodeId: '16:3947',
          sph: '-25.25',
          cyl: '-25.25',
          axis: '-25.25',
        },
        {
          rowIndex: 2,
          readingCellNodeId: '16:3949',
          sphCellNodeId: '16:3951',
          cylCellNodeId: '16:3953',
          axisCellNodeId: '16:3955',
          sph: '-25.25',
          cyl: '-25.25',
          axis: '-25.25',
        },
        {
          rowIndex: 3,
          readingCellNodeId: '16:3957',
          sphCellNodeId: '16:3959',
          cylCellNodeId: '16:3961',
          axisCellNodeId: '16:3963',
          sph: '-25.25',
          cyl: '-25.25',
          axis: '-25.25',
        },
      ],
    },
  ] satisfies EyeDryRefraction[],
  dryAutoRefractionEyes: [
    {
      eyeLabelNodeId: '16:3972',
      eyeLabel: 'R/OD',
      sectionNodeId: '16:3969',
      blocks: [
        {
          labelNodeId: '16:3975',
          label: 'Distant',
          tableNodeId: '16:3973',
          columns: ['Sph', 'Cyl', 'Axis', 'Vision'],
          columnHeaderNodeIds: ['16:3978', '16:3980', '16:3982', '16:3984'],
          valueCellNodeIds: ['16:3986', '16:3988', '16:3990', '16:3992'],
          values: ['-25.25', '-25.25', '-25.25', '-25.25'],
        },
        {
          labelNodeId: '16:3995',
          label: 'Add',
          tableNodeId: '16:3993',
          columns: ['Sph'],
          columnHeaderNodeIds: ['16:3998'],
          valueCellNodeIds: ['16:4000'],
          values: ['-25.25'],
          singleColumn: true,
        },
        {
          labelNodeId: '16:4003',
          label: 'Near',
          tableNodeId: '16:4001',
          columns: ['Sph', 'Cyl', 'Axis', 'Vision'],
          columnHeaderNodeIds: ['16:4006', '16:4008', '16:4010', '16:4012'],
          valueCellNodeIds: ['16:4014', '16:4016', '16:4018', '16:4020'],
          values: ['-25.25', '-25.25', '-25.25', '-25.25'],
        },
      ],
    },
    {
      eyeLabelNodeId: '16:4024',
      eyeLabel: 'L/OS',
      sectionNodeId: '16:4021',
      blocks: [
        {
          labelNodeId: '16:4027',
          label: 'Distant',
          tableNodeId: '16:4025',
          columns: ['Sph', 'Cyl', 'Axis', 'Vision'],
          columnHeaderNodeIds: ['16:4030', '16:4032', '16:4034', '16:4036'],
          valueCellNodeIds: ['16:4038', '16:4040', '16:4042', '16:4044'],
          values: ['-25.25', '-25.25', '-25.25', '-25.25'],
        },
        {
          labelNodeId: '16:4047',
          label: 'Add',
          tableNodeId: '16:4045',
          columns: ['Sph'],
          columnHeaderNodeIds: ['16:4050'],
          valueCellNodeIds: ['16:4052'],
          values: ['-25.25'],
          singleColumn: true,
        },
        {
          labelNodeId: '16:4055',
          label: 'Near',
          tableNodeId: '16:4053',
          columns: ['Sph', 'Cyl', 'Axis', 'Vision'],
          columnHeaderNodeIds: ['16:4058', '16:4060', '16:4062', '16:4064'],
          valueCellNodeIds: ['16:4066', '16:4068', '16:4070', '16:4072'],
          values: ['-25.25', '-25.25', '-25.25', '-25.25'],
        },
      ],
    },
  ] satisfies EyeAutoRefraction[],
};
