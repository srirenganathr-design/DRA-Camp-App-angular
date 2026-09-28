import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  ViewChild,
  inject,
} from '@angular/core';
import { ListNavVisibilityService } from '../../services/list-nav-visibility.service';

@Component({
  selector: 'app-list-screen-scroll-layout',
  standalone: true,
  template: `
    <div class="screen" [attr.data-figma-node-id]="screenNodeId" [attr.data-name]="screenName">
      <div class="scrollViewport">
        <div #scrollEl class="scrollContent" data-testid="scroll-content" (scroll)="onScroll()">
          <div class="heroShell">
            <div class="heroBlueBackdrop" data-testid="hero-blue-backdrop" aria-hidden="true">
              <img [src]="ellipseSrc" alt="" class="ellipse" [attr.data-figma-node-id]="ellipseNodeId" />
            </div>
            <div class="topChrome">
              <ng-content select="[statusBar]" />
              <div class="main" [attr.data-figma-node-id]="mainNodeId">
                <ng-content select="[appHeader]" />
                <hr class="divider" [attr.data-figma-node-id]="dividerNodeId" />
              </div>
            </div>
            <div class="body" [attr.data-figma-node-id]="bodyNodeId">
              <div class="contentPanel" [attr.data-figma-node-id]="contentPanelNodeId">
                <ng-content select="[hero]" />
                <div class="listArea" [attr.data-figma-node-id]="listAreaNodeId">
                  <ng-content select="[listControls]" />
                  <ng-content select="[cards]" />
                </div>
              </div>
            </div>
          </div>
          <div class="scrollBottomPad"></div>
        </div>
      </div>
      <ng-content select="[screenOverlay]" />
    </div>
  `,
  styleUrl: '../../screens/CampsScreen.module.css',
})
export class ListScreenScrollLayoutComponent implements AfterViewInit, OnDestroy {
  @Input({ required: true }) screenNodeId!: string;
  @Input({ required: true }) screenName!: string;
  @Input({ required: true }) ellipseNodeId!: string;
  @Input({ required: true }) ellipseSrc!: string;
  @Input({ required: true }) mainNodeId!: string;
  @Input({ required: true }) dividerNodeId!: string;
  @Input({ required: true }) bodyNodeId!: string;
  @Input({ required: true }) contentPanelNodeId!: string;
  @Input({ required: true }) listAreaNodeId!: string;

  @ViewChild('scrollEl') scrollRef!: ElementRef<HTMLDivElement>;

  private readonly listNav = inject(ListNavVisibilityService);
  private lastScrollTop = 0;
  private accumulatedDelta = 0;

  ngAfterViewInit(): void {
    this.listNav.setVisible(true);
  }

  ngOnDestroy(): void {
    this.listNav.setVisible(true);
  }

  onScroll(): void {
    const element = this.scrollRef?.nativeElement;
    if (!element) return;

    const currentScrollTop = element.scrollTop;
    const delta = currentScrollTop - this.lastScrollTop;
    const TOP_THRESHOLD = 10;
    const DIRECTION_THRESHOLD = 30;

    if (currentScrollTop <= TOP_THRESHOLD) {
      this.listNav.setVisible(true);
      this.accumulatedDelta = 0;
      this.lastScrollTop = currentScrollTop;
      return;
    }

    if (delta === 0) return;

    if (Math.sign(delta) !== Math.sign(this.accumulatedDelta)) {
      this.accumulatedDelta = delta;
    } else {
      this.accumulatedDelta += delta;
    }

    if (Math.abs(this.accumulatedDelta) >= DIRECTION_THRESHOLD) {
      this.listNav.setVisible(this.accumulatedDelta < 0);
      this.accumulatedDelta = 0;
    }

    this.lastScrollTop = currentScrollTop;
  }
}
