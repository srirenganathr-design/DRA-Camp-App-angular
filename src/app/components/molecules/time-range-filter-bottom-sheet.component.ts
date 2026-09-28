import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  DEFAULT_TIME_RANGE_FILTER,
  TIME_RANGE_OPTIONS,
  type TimeRangeFilter,
  type TimeRangePreset,
} from '../../data/timeRangeFilter';
import { AnimatedBottomSheetComponent } from './animated-bottom-sheet.component';

@Component({
  selector: 'app-time-range-filter-bottom-sheet',
  standalone: true,
  imports: [AnimatedBottomSheetComponent],
  template: `
    <app-animated-bottom-sheet
      [open]="open"
      titleId="time-range-filter-title"
      [overlayClass]="'overlay'"
      [sheetClass]="'sheet'"
      [dataName]="'Select Time Range'"
      (overlayClick)="onOverlay($event)"
    >
      <div class="body">
        <h2 id="time-range-filter-title" class="visuallyHidden">Select Time Range</h2>
        <div class="optionCard" role="listbox" aria-labelledby="time-range-filter-title">
          @for (option of options; track option.preset) {
            <button
              type="button"
              role="option"
              [attr.aria-selected]="isSelected(option.preset)"
              [class]="isSelected(option.preset) ? 'optionBtn optionBtnSelected' : 'optionBtn'"
              (click)="pick(option.preset)"
            >
              <span [class]="isSelected(option.preset) ? 'optionLabel optionLabelSelected' : 'optionLabel'">
                {{ option.label }}
              </span>
            </button>
          }
        </div>
      </div>
    </app-animated-bottom-sheet>
  `,
  styleUrl: './TimeRangeFilterBottomSheet.module.css',
})
export class TimeRangeFilterBottomSheetComponent {
  @Input() open = false;
  @Input() value: TimeRangeFilter = DEFAULT_TIME_RANGE_FILTER;
  @Output() closed = new EventEmitter<void>();
  @Output() presetSelected = new EventEmitter<Exclude<TimeRangePreset, 'custom'>>();
  @Output() customRange = new EventEmitter<void>();

  readonly options = TIME_RANGE_OPTIONS;

  isSelected(preset: TimeRangePreset): boolean {
    return preset === 'custom' ? this.value.preset === 'custom' : this.value.preset === preset;
  }

  pick(preset: TimeRangePreset): void {
    if (preset === 'custom') {
      this.customRange.emit();
      return;
    }
    this.presetSelected.emit(preset);
    this.closed.emit();
  }

  onOverlay(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.closed.emit();
    }
  }
}
