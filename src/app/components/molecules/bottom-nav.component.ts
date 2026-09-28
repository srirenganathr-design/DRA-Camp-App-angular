import { AfterViewChecked, Component, ElementRef, Input, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { BottomNavConfig, NavTabId } from './bottom-nav-config';

@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  imports: [RouterLink],
  template: `
    <nav
      #navEl
      [class]="visible ? 'nav' : 'nav navHidden'"
      [attr.data-figma-node-id]="config.rootNodeId"
      aria-label="Main navigation"
      [attr.aria-hidden]="!visible"
    >
      <div class="activeIndicatorTrack" [style.transform]="'translateX(' + indicatorX + 'px)'" aria-hidden="true">
        <div class="activeIndicator" [attr.data-figma-node-id]="activeTabConfig?.indicatorNodeId"></div>
        <div class="activeGlow" [attr.data-figma-node-id]="activeTabConfig?.glowNodeId"></div>
      </div>

      @for (tab of config.tabs; track tab.nodeId) {
        @if (tab.href && tab.id !== config.activeTab) {
          <a
            #tabEl
            [routerLink]="tab.href"
            class="tab"
            [attr.data-figma-node-id]="tab.nodeId"
            data-name="Container"
          >
            <img [src]="tab.icon" alt="" class="icon" width="24" height="24" />
            <span class="label">{{ tab.label }}</span>
          </a>
        } @else {
          <div
            #tabEl
            class="tab"
            [attr.data-figma-node-id]="tab.nodeId"
            data-name="Container"
          >
            <img [src]="tab.activeIcon ?? tab.icon" alt="" class="icon" width="24" height="24" />
            <span [class]="tab.id === config.activeTab ? 'labelActive' : 'label'">{{ tab.label }}</span>
          </div>
        }
      }
    </nav>
  `,
  styleUrl: './BottomNav.module.css',
})
export class BottomNavComponent implements AfterViewChecked {
  @Input({ required: true }) config!: BottomNavConfig;
  @Input() visible = true;

  @ViewChildren('tabEl') tabElements!: QueryList<ElementRef<HTMLElement>>;
  @ViewChild('navEl') navElement!: ElementRef<HTMLElement>;

  indicatorX = 0;
  private lastActiveTab: NavTabId | null = null;

  get activeTabConfig() {
    return this.config.tabs.find((tab) => tab.id === this.config.activeTab);
  }

  ngAfterViewChecked(): void {
    if (this.lastActiveTab === this.config.activeTab && this.indicatorX !== 0) return;
    this.updateIndicator();
    this.lastActiveTab = this.config.activeTab;
  }

  private updateIndicator(): void {
    const nav = this.navElement?.nativeElement;
    const tabs = this.tabElements?.toArray();
    const activeIndex = this.config.tabs.findIndex((t) => t.id === this.config.activeTab);
    const tab = tabs[activeIndex]?.nativeElement;
    if (!nav || !tab) return;
    const navRect = nav.getBoundingClientRect();
    const tabRect = tab.getBoundingClientRect();
    this.indicatorX = tabRect.left - navRect.left + tabRect.width / 2;
  }
}
