import { branchCatalog } from './branchCatalog';

export interface AddressSuggestion {
  id: string;
  primary: string;
  secondary: string;
  fullAddress: string;
  city: string;
}

function splitAddress(fullAddress: string, city: string): { primary: string; secondary: string } {
  const normalizedCity = city.trim();
  const withoutCity = fullAddress.replace(
    new RegExp(`,\\s*${normalizedCity.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}.*$`),
    '',
  );
  const primary = withoutCity.trim() || fullAddress.split(',')[0]?.trim() || fullAddress;
  return { primary, secondary: normalizedCity };
}

function buildSecondary(city: string, campName: string, branchId: string, address: string): string {
  const normalizedCity = city.trim();
  const normalizedAddress = address.trim().toLowerCase();
  const addressMatches = branchCatalog.filter(
    (entry) => entry.address.trim().toLowerCase() === normalizedAddress,
  );

  if (addressMatches.length > 1) {
    return `${normalizedCity} · ${branchId}`;
  }

  return campName ? `${normalizedCity} · ${campName}` : normalizedCity;
}

function buildSuggestions(): AddressSuggestion[] {
  return branchCatalog.map((branch) => {
    const { primary } = splitAddress(branch.address, branch.city);
    return {
      id: branch.id,
      primary,
      secondary: buildSecondary(branch.city, branch.campName, branch.id, branch.address),
      fullAddress: branch.address,
      city: branch.city,
    };
  });
}

export const addressSuggestions: AddressSuggestion[] = buildSuggestions();

export function filterAddressSuggestions(query: string, limit = 8): AddressSuggestion[] {
  const normalizedQuery = query.trim().toLowerCase();
  if (normalizedQuery.length < 2) {
    return [];
  }

  return addressSuggestions
    .filter(
      (suggestion) =>
        suggestion.fullAddress.toLowerCase().includes(normalizedQuery) ||
        suggestion.city.toLowerCase().includes(normalizedQuery) ||
        suggestion.primary.toLowerCase().includes(normalizedQuery) ||
        suggestion.secondary.toLowerCase().includes(normalizedQuery) ||
        suggestion.id.toLowerCase().includes(normalizedQuery),
    )
    .slice(0, limit);
}
