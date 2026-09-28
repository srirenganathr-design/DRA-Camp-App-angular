export type CampTypeFilterValue = 'all' | 'DRT' | 'CR' | 'public';

export const DEFAULT_CAMP_TYPE_FILTER: CampTypeFilterValue = 'all';

export const CAMP_TYPE_FILTER_OPTIONS: { value: CampTypeFilterValue; label: string }[] = [
  { value: 'all', label: 'All Types' },
  { value: 'DRT', label: 'DRT' },
  { value: 'CR', label: 'CR' },
  { value: 'public', label: 'Public Camp' },
];

const TYPE_CODE_MAP: Record<Exclude<CampTypeFilterValue, 'all'>, string[]> = {
  DRT: ['DRT', 'DRC'],
  CR: ['CSC', 'CR'],
  public: ['PVS', 'GDD'],
};

export function matchesCampTypeFilter(typeCode: string, filter: CampTypeFilterValue): boolean {
  if (filter === 'all') return true;
  return TYPE_CODE_MAP[filter].includes(typeCode);
}

export function getCampTypeChipLabel(filter: CampTypeFilterValue): string {
  if (filter === 'all') return 'All Types';
  return CAMP_TYPE_FILTER_OPTIONS.find((option) => option.value === filter)?.label ?? 'All Types';
}
