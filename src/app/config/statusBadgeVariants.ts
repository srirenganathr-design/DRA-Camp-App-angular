export type StatusBadgeVariant = 'azure' | 'yellow' | 'orange' | 'green' | 'red' | 'neutral';

const STATUS_VARIANTS: Record<string, StatusBadgeVariant> = {
  Screened: 'azure',
  Active: 'azure',
  Scheduled: 'yellow',
  Referred: 'yellow',
  Treated: 'orange',
  Delayed: 'orange',
  Visited: 'green',
  Completed: 'green',
  Cancelled: 'red',
};

export function getStatusBadgeVariant(status: string): StatusBadgeVariant {
  return STATUS_VARIANTS[status] ?? 'neutral';
}
