import { Component, Input } from '@angular/core';
import { getStatusBadgeVariant, type StatusBadgeVariant } from '../../config/statusBadgeVariants';
import { cn } from '../../lib/cn';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  template: `
    <div
      [class]="badgeClass"
      [attr.data-figma-node-id]="nodeId"
      data-name="Status Badge"
    >
      <img [src]="dotIcon" alt="" class="dot" width="16" height="16" />
      <span [class]="labelClass">{{ status }}</span>
    </div>
  `,
  styleUrl: './StatusBadge.module.css',
})
export class StatusBadgeComponent {
  @Input({ required: true }) status!: string;
  @Input({ required: true }) dotIcon!: string;
  @Input({ required: true }) nodeId!: string;

  get variant(): StatusBadgeVariant {
    return getStatusBadgeVariant(this.status);
  }

  get badgeClass(): string {
    const v = this.variant;
    return cn('statusBadge', v !== 'neutral' ? v : undefined);
  }

  get labelClass(): string {
    const map: Record<StatusBadgeVariant, string | undefined> = {
      azure: 'label labelAzure',
      yellow: 'label labelYellow',
      orange: 'label labelOrange',
      green: 'label labelGreen',
      red: 'label labelRed',
      neutral: 'label',
    };
    return map[this.variant] ?? 'label';
  }
}
