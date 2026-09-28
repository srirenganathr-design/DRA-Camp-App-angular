import { Component, ElementRef, EventEmitter, HostListener, Input, Output, inject, signal } from '@angular/core';
import { ZONES, type Zone } from '../../config/zones';
const logoIcon = 'assets/icons/dr-agarwals-logo.svg';
const arrowDownIcon = 'assets/icons/arrow-down-s-line-hero.svg';

@Component({
  selector: 'app-header-bar',
  standalone: true,
  template: `
    <div class="header" [attr.data-figma-node-id]="rootNodeId" #root>
      <img
        [src]="logoIcon"
        alt="Dr. Agarwal's"
        class="logo"
        [attr.data-figma-node-id]="logoNodeId"
        width="91"
        height="32"
      />
      <div class="zoneWrapper">
        <button
          type="button"
          class="zoneButton"
          [attr.data-figma-node-id]="zoneButtonNodeId"
          aria-haspopup="listbox"
          [attr.aria-expanded]="open()"
          (click)="open.set(!open())"
        >
          <span class="zoneLabel">{{ selectedZone }}</span>
          <img [src]="arrowDownIcon" alt="" class="zoneArrow" width="20" height="20" />
        </button>
        @if (open()) {
          <ul class="zoneMenu" role="listbox" aria-label="Select zone">
            @for (zone of zones; track zone) {
              <li>
                <button
                  type="button"
                  role="option"
                  [attr.aria-selected]="zone === selectedZone"
                  [class]="zone === selectedZone ? 'zoneOptionActive' : 'zoneOption'"
                  (click)="selectZone(zone)"
                >
                  {{ zone }}
                </button>
              </li>
            }
          </ul>
        }
      </div>
    </div>
  `,
  styleUrl: './AppHeaderBar.module.css',
})
export class AppHeaderBarComponent {
  @Input({ required: true }) rootNodeId!: string;
  @Input({ required: true }) logoNodeId!: string;
  @Input({ required: true }) zoneButtonNodeId!: string;
  @Input({ required: true }) selectedZone!: Zone;
  @Output() zoneSelected = new EventEmitter<Zone>();

  readonly zones = ZONES;
  readonly open = signal(false);
  protected readonly logoIcon = logoIcon;
  protected readonly arrowDownIcon = arrowDownIcon;

  private readonly rootRef = inject(ElementRef<HTMLElement>);

  @HostListener('document:mousedown', ['$event'])
  onDocumentMouseDown(event: MouseEvent): void {
    if (!this.open()) return;
    if (!this.rootRef.nativeElement.contains(event.target as Node)) {
      this.open.set(false);
    }
  }

  selectZone(zone: Zone): void {
    this.zoneSelected.emit(zone);
    this.open.set(false);
  }
}
