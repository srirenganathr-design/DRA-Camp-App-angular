import { Component, EventEmitter, Input, Output } from '@angular/core';
import { cn } from '../../lib/cn';

@Component({
  selector: 'app-sheet-button',
  standalone: true,
  host: {
    '[attr.data-figma-node-id]': 'figmaNodeId',
  },
  template: `
    <button
      type="button"
      [class]="buttonClass"
      [disabled]="disabled"
      (click)="pressed.emit($event)"
    >
      <ng-content />
    </button>
  `,
  styleUrl: './SheetButton.module.css',
})
export class SheetButtonComponent {
  @Input({ required: true }) variant!: 'primary' | 'secondary';
  @Input() disabled = false;
  @Input() className = '';
  @Input() figmaNodeId?: string;
  @Output() pressed = new EventEmitter<MouseEvent>();

  get buttonClass(): string {
    return cn(
      'button',
      this.variant === 'primary' ? 'primary' : 'secondary',
      this.className || undefined,
    );
  }
}
