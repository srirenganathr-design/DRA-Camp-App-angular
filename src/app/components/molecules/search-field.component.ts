import { Component, EventEmitter, Input, Output } from '@angular/core';
import { cn } from '../../lib/cn';
const searchIcon = 'assets/icons/search-2-line-hero.svg';

@Component({
  selector: 'app-search-field',
  standalone: true,
  template: `
    <div class="root" [attr.data-figma-node-id]="nodeId" data-name="Text input">
      <div [class]="cn('input', 'inputHero')">
        <img [src]="searchIcon" alt="" class="icon" width="20" height="20" />
        <input
          type="search"
          [class]="cn('field', 'fieldHero')"
          [value]="value"
          [placeholder]="placeholder"
          (input)="onInput($event)"
          aria-label="Search"
        />
      </div>
    </div>
  `,
  styleUrl: './SearchField.module.css',
})
export class SearchFieldComponent {
  @Input({ required: true }) nodeId!: string;
  @Input() value = '';
  @Input() placeholder = 'Search...';
  @Output() valueChange = new EventEmitter<string>();

  protected readonly searchIcon = searchIcon;
  protected readonly cn = cn;

  onInput(event: Event): void {
    this.valueChange.emit((event.target as HTMLInputElement).value);
  }
}
