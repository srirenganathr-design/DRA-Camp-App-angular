import { Component, EventEmitter, Input, Output } from '@angular/core';
import { cn } from '../../lib/cn';
const arrowDownIconHero = 'assets/icons/arrow-down-s-line-hero.svg';

@Component({
  selector: 'app-filter-chip',
  standalone: true,
  template: `
    <button
      type="button"
      [class]="chipClass"
      [attr.data-figma-node-id]="nodeId"
      data-name="Button"
      (click)="pressed.emit()"
    >
      <img [src]="icon" alt="" class="icon" width="20" height="20" />
      <span [class]="cn('label', 'labelHero')" [style.font-weight]="labelWeight">{{ label }}</span>
      <img [src]="arrowDownIconHero" alt="" class="chevron" width="20" height="20" />
    </button>
  `,
  styleUrl: './FilterChip.module.css',
})
export class FilterChipComponent {
  @Input({ required: true }) nodeId!: string;
  @Input({ required: true }) icon!: string;
  @Input({ required: true }) label!: string;
  @Input() labelWeight: 400 | 500 = 400;
  @Input() width?: 125 | 133 | 138;
  @Output() pressed = new EventEmitter<void>();

  protected readonly arrowDownIconHero = arrowDownIconHero;
  protected readonly cn = cn;

  get chipClass(): string {
    const widthClass =
      this.width === 125 ? 'chipWidth125' : this.width === 133 ? 'chipWidth133' : this.width === 138 ? 'chipWidth138' : undefined;
    return cn('chip', 'chipHero', widthClass);
  }
}
