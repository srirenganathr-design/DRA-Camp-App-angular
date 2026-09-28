import type { Zone } from '../config/zones';

export type CampSearchField = 'name' | 'code' | 'location';

export interface CampOption {
  id: string;
  name: string;
  campNumber: string;
  typeCode: string;
  location: string;
  zone?: Zone;
}

export function filterCamps(
  query: string,
  field: CampSearchField,
  camps: CampOption[],
  excludeIds: string[] = [],
): CampOption[] {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) {
    return [];
  }

  return camps.filter((camp) => {
    if (excludeIds.includes(camp.id)) {
      return false;
    }

    if (field === 'name') {
      return (
        camp.name.toLowerCase().includes(normalizedQuery) ||
        camp.campNumber.toLowerCase().includes(normalizedQuery)
      );
    }

    if (field === 'code') {
      return camp.typeCode.toLowerCase().includes(normalizedQuery);
    }

    return camp.location.toLowerCase().includes(normalizedQuery);
  });
}

export const campPickerEmptyMock = {
  sheetNodeId: '126:22100',
  headerNodeId: '126:22101',
  titleNodeId: '126:22102',
  resetButtonNodeId: '126:22103',
  bodyNodeId: '126:22104',
  searchBySectionNodeId: '126:22105',
  searchByLabelNodeId: '126:22106',
  nameTabNodeId: '126:22107',
  codeTabNodeId: '126:22108',
  locationTabNodeId: '126:22109',
  searchInputNodeId: '126:22110',
  selectedAreaNodeId: '126:22111',
  emptyStateIconNodeId: '126:22112',
  emptyStateTitleNodeId: '126:22113',
  emptyStateSubtitleNodeId: '126:22114',
  footerNodeId: '126:22115',
  footerRowNodeId: '126:22116',
  closeButtonNodeId: '126:22117',
  applyButtonNodeId: '126:22118',
};

export const campPickerFilledMock = {
  ...campPickerEmptyMock,
  selectedAreaNodeId: '126:22119',
};
