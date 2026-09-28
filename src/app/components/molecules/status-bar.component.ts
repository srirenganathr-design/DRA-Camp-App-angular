import { Component, Input } from '@angular/core';
const batteryIcon = 'assets/icons/status-bar-battery.svg';
const wifiIcon = 'assets/icons/status-bar-wifi.svg';
const cellularIcon = 'assets/icons/status-bar-cellular.svg';

@Component({
  selector: 'app-status-bar',
  standalone: true,
  template: `
    <header [class]="variant === 'embedded' ? 'statusBarEmbedded' : 'statusBar'" [attr.data-figma-node-id]="nodeId" aria-hidden="true">
      <span class="time" [attr.data-figma-node-id]="timeNodeId">9:41</span>
      <img [src]="cellularIcon" alt="" class="cellular" width="17" height="11" />
      <img [src]="wifiIcon" alt="" class="wifi" width="15" height="11" />
      <img [src]="batteryIcon" alt="" class="battery" width="25" height="11" />
    </header>
  `,
  styleUrl: './StatusBar.module.css',
})
export class StatusBarComponent {
  @Input({ required: true }) nodeId!: string;
  @Input({ required: true }) timeNodeId!: string;
  @Input() variant: 'overlay' | 'embedded' = 'overlay';

  protected readonly cellularIcon = cellularIcon;
  protected readonly wifiIcon = wifiIcon;
  protected readonly batteryIcon = batteryIcon;
}
