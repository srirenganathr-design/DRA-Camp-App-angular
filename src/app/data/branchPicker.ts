export type BranchSearchField = 'name' | 'code' | 'city';

export interface BranchOption {
  id: string;
  city: string;
  address: string;
  campId: string;
  campName: string;
}

export function filterBranches(
  query: string,
  field: BranchSearchField,
  branches: BranchOption[],
  excludeIds: string[] = [],
): BranchOption[] {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) {
    return [];
  }

  return branches.filter((branch) => {
    if (excludeIds.includes(branch.id)) {
      return false;
    }

    if (field === 'name') {
      return (
        branch.campName.toLowerCase().includes(normalizedQuery) ||
        branch.city.toLowerCase().includes(normalizedQuery) ||
        branch.address.toLowerCase().includes(normalizedQuery)
      );
    }

    if (field === 'code') {
      return branch.id.toLowerCase().includes(normalizedQuery);
    }

    return branch.city.toLowerCase().includes(normalizedQuery);
  });
}

export const branchPickerEmptyMock = {
  sheetNodeId: '126:22100',
  headerNodeId: '126:22101',
  titleNodeId: '126:22102',
  resetButtonNodeId: '126:22103',
  bodyNodeId: '126:22104',
  searchBySectionNodeId: '126:22105',
  searchByLabelNodeId: '126:22106',
  nameTabNodeId: '126:22107',
  codeTabNodeId: '126:22108',
  cityTabNodeId: '126:22109',
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

export const branchPickerFilledMock = {
  ...branchPickerEmptyMock,
  selectedAreaNodeId: '126:22119',
};
