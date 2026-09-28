import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ListNavVisibilityService } from '../../services/list-nav-visibility.service';
import { BottomNavComponent } from './bottom-nav.component';
import { campsNavConfig, getActiveNavTab, patientsNavConfig } from './bottom-nav-config';

@Component({
  selector: 'app-persistent-bottom-nav',
  standalone: true,
  imports: [BottomNavComponent],
  template: `
    @if (activeTab) {
      <div class="host">
        <app-bottom-nav [config]="navConfig" [visible]="listNav.visible()" />
      </div>
    }
  `,
  styleUrl: './PersistentBottomNav.module.css',
})
export class PersistentBottomNavComponent {
  private readonly router = inject(Router);
  readonly listNav = inject(ListNavVisibilityService);

  get activeTab() {
    return getActiveNavTab(this.router.url.split('?')[0]);
  }

  get navConfig() {
    return this.activeTab === 'camps' ? campsNavConfig : patientsNavConfig;
  }
}
