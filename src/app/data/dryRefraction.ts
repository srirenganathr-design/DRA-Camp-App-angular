export type DryRefractionFieldWidth = 'narrow' | 'flex' | 'vision';

export interface DryRefractionField {
  label: string;
  value: string;
  labelNodeId: string;
  valueContainerNodeId: string;
  valueNodeId: string;
  width: DryRefractionFieldWidth;
  muted?: boolean;
}

export interface DryRefractionReading {
  cardNodeId: string;
  titleNodeId: string;
  title: string;
  rowWrapperNodeId: string;
  rowNodeId: string;
  fields: DryRefractionField[];
}

const addFieldsRight = (): DryRefractionField[] => [
  {
    label: 'Sph',
    value: '+0.00',
    labelNodeId: '126:21543',
    valueContainerNodeId: '126:21544',
    valueNodeId: '126:21545',
    width: 'narrow',
  },
  {
    label: 'Cyl',
    value: '+0.00',
    labelNodeId: '126:21548',
    valueContainerNodeId: '126:21549',
    valueNodeId: '126:21550',
    width: 'narrow',
    muted: true,
  },
  {
    label: 'Axis',
    value: '180',
    labelNodeId: '126:21553',
    valueContainerNodeId: '126:21554',
    valueNodeId: '126:21555',
    width: 'flex',
    muted: true,
  },
  {
    label: 'Vision',
    value: '20/20',
    labelNodeId: '126:21558',
    valueContainerNodeId: '126:21559',
    valueNodeId: '126:21560',
    width: 'vision',
    muted: true,
  },
];

const addFieldsLeft = (): DryRefractionField[] => [
  {
    label: 'Sph',
    value: '+0.00',
    labelNodeId: '126:21627',
    valueContainerNodeId: '126:21628',
    valueNodeId: '126:21629',
    width: 'narrow',
  },
  {
    label: 'Cyl',
    value: '+0.00',
    labelNodeId: '126:21632',
    valueContainerNodeId: '126:21633',
    valueNodeId: '126:21634',
    width: 'narrow',
    muted: true,
  },
  {
    label: 'Axis',
    value: '180',
    labelNodeId: '126:21637',
    valueContainerNodeId: '126:21638',
    valueNodeId: '126:21639',
    width: 'flex',
    muted: true,
  },
  {
    label: 'Vision',
    value: '20/20',
    labelNodeId: '126:21642',
    valueContainerNodeId: '126:21643',
    valueNodeId: '126:21644',
    width: 'vision',
    muted: true,
  },
];

export const rightEyeDryRefractionReadings: DryRefractionReading[] = [
  {
    cardNodeId: '126:21511',
    titleNodeId: '126:21513',
    title: 'Distant',
    rowWrapperNodeId: '126:21514',
    rowNodeId: '126:21515',
    fields: [
      {
        label: 'Sph',
        value: '-22.25',
        labelNodeId: '126:21518',
        valueContainerNodeId: '126:21519',
        valueNodeId: '126:21520',
        width: 'narrow',
      },
      {
        label: 'Cyl',
        value: '-20.75',
        labelNodeId: '126:21523',
        valueContainerNodeId: '126:21524',
        valueNodeId: '126:21525',
        width: 'narrow',
      },
      {
        label: 'Axis',
        value: '180',
        labelNodeId: '126:21528',
        valueContainerNodeId: '126:21529',
        valueNodeId: '126:21530',
        width: 'flex',
      },
      {
        label: 'Vision',
        value: '20/20',
        labelNodeId: '126:21533',
        valueContainerNodeId: '126:21534',
        valueNodeId: '126:21535',
        width: 'vision',
      },
    ],
  },
  {
    cardNodeId: '126:21536',
    titleNodeId: '126:21538',
    title: 'Add',
    rowWrapperNodeId: '126:21539',
    rowNodeId: '126:21540',
    fields: addFieldsRight(),
  },
  {
    cardNodeId: '126:21561',
    titleNodeId: '126:21563',
    title: 'Near',
    rowWrapperNodeId: '126:21564',
    rowNodeId: '126:21565',
    fields: [
      {
        label: 'Sph',
        value: '-22.25',
        labelNodeId: '126:21568',
        valueContainerNodeId: '126:21569',
        valueNodeId: '126:21570',
        width: 'narrow',
      },
      {
        label: 'Cyl',
        value: '-20.75',
        labelNodeId: '126:21573',
        valueContainerNodeId: '126:21574',
        valueNodeId: '126:21575',
        width: 'narrow',
      },
      {
        label: 'Axis',
        value: '180',
        labelNodeId: '126:21578',
        valueContainerNodeId: '126:21579',
        valueNodeId: '126:21580',
        width: 'flex',
      },
      {
        label: 'Vision',
        value: '20/20',
        labelNodeId: '126:21583',
        valueContainerNodeId: '126:21584',
        valueNodeId: '126:21585',
        width: 'vision',
      },
    ],
  },
];

export const leftEyeDryRefractionReadings: DryRefractionReading[] = [
  {
    cardNodeId: '126:21595',
    titleNodeId: '126:21597',
    title: 'Distant',
    rowWrapperNodeId: '126:21598',
    rowNodeId: '126:21599',
    fields: [
      {
        label: 'Sph',
        value: '-22.25',
        labelNodeId: '126:21602',
        valueContainerNodeId: '126:21603',
        valueNodeId: '126:21604',
        width: 'narrow',
      },
      {
        label: 'Cyl',
        value: '-20.75',
        labelNodeId: '126:21607',
        valueContainerNodeId: '126:21608',
        valueNodeId: '126:21609',
        width: 'narrow',
      },
      {
        label: 'Axis',
        value: '180',
        labelNodeId: '126:21612',
        valueContainerNodeId: '126:21613',
        valueNodeId: '126:21614',
        width: 'flex',
      },
      {
        label: 'Vision',
        value: '20/20',
        labelNodeId: '126:21617',
        valueContainerNodeId: '126:21618',
        valueNodeId: '126:21619',
        width: 'vision',
      },
    ],
  },
  {
    cardNodeId: '126:21620',
    titleNodeId: '126:21622',
    title: 'Add',
    rowWrapperNodeId: '126:21623',
    rowNodeId: '126:21624',
    fields: addFieldsLeft(),
  },
  {
    cardNodeId: '126:21645',
    titleNodeId: '126:21647',
    title: 'Near',
    rowWrapperNodeId: '126:21648',
    rowNodeId: '126:21649',
    fields: [
      {
        label: 'Sph',
        value: '-22.25',
        labelNodeId: '126:21652',
        valueContainerNodeId: '126:21653',
        valueNodeId: '126:21654',
        width: 'narrow',
      },
      {
        label: 'Cyl',
        value: '-20.75',
        labelNodeId: '126:21657',
        valueContainerNodeId: '126:21658',
        valueNodeId: '126:21659',
        width: 'narrow',
      },
      {
        label: 'Axis',
        value: '180',
        labelNodeId: '126:21662',
        valueContainerNodeId: '126:21663',
        valueNodeId: '126:21664',
        width: 'flex',
      },
      {
        label: 'Vision',
        value: '20/20',
        labelNodeId: '126:21667',
        valueContainerNodeId: '126:21668',
        valueNodeId: '126:21669',
        width: 'vision',
      },
    ],
  },
];
