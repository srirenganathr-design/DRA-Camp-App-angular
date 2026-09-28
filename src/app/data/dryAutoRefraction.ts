export interface RefractionField {
  label: string;
  value: string;
  labelNodeId: string;
  valueNodeId: string;
}

export interface RefractionReading {
  cardNodeId: string;
  titleNodeId: string;
  title: string;
  rowNodeId: string;
  fields: RefractionField[];
}

export const defaultReadingValues: RefractionField[] = [
  { label: 'Sph', value: '-22.25', labelNodeId: '', valueNodeId: '' },
  { label: 'Cyl', value: '-20.75', labelNodeId: '', valueNodeId: '' },
  { label: 'Axis', value: '180', labelNodeId: '', valueNodeId: '' },
];

export const rightEyeReadings: RefractionReading[] = [
  {
    cardNodeId: '126:21348',
    titleNodeId: '126:21349',
    title: 'Reading 1',
    rowNodeId: '126:21350',
    fields: [
      { label: 'Sph', value: '-22.25', labelNodeId: '126:21353', valueNodeId: '126:21355' },
      { label: 'Cyl', value: '-20.75', labelNodeId: '126:21358', valueNodeId: '126:21360' },
      { label: 'Axis', value: '180', labelNodeId: '126:21363', valueNodeId: '126:21365' },
    ],
  },
  {
    cardNodeId: '126:21366',
    titleNodeId: '126:21367',
    title: 'Reading 2',
    rowNodeId: '126:21368',
    fields: [
      { label: 'Sph', value: '-22.25', labelNodeId: '126:21371', valueNodeId: '126:21373' },
      { label: 'Cyl', value: '-20.75', labelNodeId: '126:21376', valueNodeId: '126:21378' },
      { label: 'Axis', value: '180', labelNodeId: '126:21381', valueNodeId: '126:21383' },
    ],
  },
  {
    cardNodeId: '126:21384',
    titleNodeId: '126:21385',
    title: 'Reading 3',
    rowNodeId: '126:21386',
    fields: [
      { label: 'Sph', value: '-22.25', labelNodeId: '126:21389', valueNodeId: '126:21391' },
      { label: 'Cyl', value: '-20.75', labelNodeId: '126:21394', valueNodeId: '126:21396' },
      { label: 'Axis', value: '180', labelNodeId: '126:21399', valueNodeId: '126:21401' },
    ],
  },
];

export const leftEyeReadings: RefractionReading[] = [
  {
    cardNodeId: '126:21411',
    titleNodeId: '126:21412',
    title: 'Reading 1',
    rowNodeId: '126:21413',
    fields: [
      { label: 'Sph', value: '-22.25', labelNodeId: '126:21416', valueNodeId: '126:21418' },
      { label: 'Cyl', value: '-20.75', labelNodeId: '126:21421', valueNodeId: '126:21423' },
      { label: 'Axis', value: '180', labelNodeId: '126:21426', valueNodeId: '126:21428' },
    ],
  },
  {
    cardNodeId: '126:21429',
    titleNodeId: '126:21430',
    title: 'Reading 2',
    rowNodeId: '126:21431',
    fields: [
      { label: 'Sph', value: '-22.25', labelNodeId: '126:21434', valueNodeId: '126:21436' },
      { label: 'Cyl', value: '-20.75', labelNodeId: '126:21439', valueNodeId: '126:21441' },
      { label: 'Axis', value: '180', labelNodeId: '126:21444', valueNodeId: '126:21446' },
    ],
  },
  {
    cardNodeId: '126:21447',
    titleNodeId: '126:21448',
    title: 'Reading 3',
    rowNodeId: '126:21449',
    fields: [
      { label: 'Sph', value: '-22.25', labelNodeId: '126:21452', valueNodeId: '126:21454' },
      { label: 'Cyl', value: '-20.75', labelNodeId: '126:21457', valueNodeId: '126:21459' },
      { label: 'Axis', value: '180', labelNodeId: '126:21462', valueNodeId: '126:21464' },
    ],
  },
];
