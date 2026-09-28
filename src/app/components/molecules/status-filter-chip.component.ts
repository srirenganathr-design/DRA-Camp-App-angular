import { Component, EventEmitter, Input, Output } from '@angular/core';
const checkboxUnselectedIcon = 'assets/icons/checkbox-unselected.svg';
const checkboxSelectedIcon = 'assets/icons/checkbox-selected.svg';

@Component({
  selector: 'app-status-filter-chip',
  standalone: true,
  template: `
    <button
      type="button"
      [class]="checked ? 'chipChecked' : 'chip'"
      [attr.data-figma-node-id]="nodeId"
      data-name="Button"
      [attr.aria-pressed]="checked"
      (click)="toggle.emit(!checked)"
    >
      <img [src]="checked ? checkboxSelectedIcon : checkboxUnselectedIcon" alt="" class="icon" width="20" height="20" />
      <span class="label">{{ label }}</span>
    </button>
  `,
  styleUrl: './StatusFilterChip.module.css',
})
export class StatusFilterChipComponent {
  @Input({ required: true }) nodeId!: string;
  @Input({ required: true }) label!: string;
  @Input() checked = false;
  @Output() toggle = new EventEmitter<boolean>();

  protected readonly checkboxSelectedIcon = checkboxSelectedIcon;
  protected readonly checkboxUnselectedIcon = checkboxUnselectedIcon;
}
