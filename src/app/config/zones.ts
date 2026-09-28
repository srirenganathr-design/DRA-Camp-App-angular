export const ZONES = ['Nanganallur', 'T Nagar', 'Adyar', 'Velachery'] as const;

export type Zone = (typeof ZONES)[number];

export const DEFAULT_ZONE: Zone = 'Nanganallur';
