import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-animated-bottom-sheet',
  standalone: true,
  template: `
    @if (open) {
      <div [class]="overlayClass" role="presentation" (click)="onOverlayClick($event)">
        <div
          [class]="sheetClass"
          role="dialog"
          aria-modal="true"
          [attr.aria-labelledby]="titleId"
          [attr.data-figma-node-id]="figmaNodeId"
          [attr.data-name]="dataName"
          (click)="$event.stopPropagation()"
        >
          <ng-content />
        </div>
      </div>
    }
  `,
  styles: `:host { display: contents; }`,
})
export class AnimatedBottomSheetComponent {
  @Input({ required: true }) open = false;
  @Input({ required: true }) titleId!: string;
  @Input() overlayClass = '';
  @Input() sheetClass = '';
  @Input() figmaNodeId?: string;
  @Input('dataName') dataName?: string;
  @Output() overlayClick = new EventEmitter<MouseEvent>();

  onOverlayClick(event: MouseEvent): void {
    this.overlayClick.emit(event);
  }
}
