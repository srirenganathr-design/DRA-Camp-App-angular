import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-route-placeholder',
  standalone: true,
  template: `
    <main class="placeholder" [attr.data-route]="routePath">
      <h1 class="label">{{ title }}</h1>
      <p class="hint">Angular migration — UI pending</p>
    </main>
  `,
  styles: `
    .placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      padding: 24px;
      font-family: var(--font-body);
      color: var(--color-neutral-700);
      text-align: center;
    }
    .label {
      font-size: var(--font-size-md);
      font-weight: 600;
    }
    .hint {
      margin-top: 8px;
      font-size: var(--font-size-sm);
      color: var(--color-neutral-500);
    }
  `,
})
export class RoutePlaceholderComponent {
  private readonly route = inject(ActivatedRoute);

  get title(): string {
    return (this.route.snapshot.data['title'] as string) ?? 'Screen';
  }

  get routePath(): string {
    return this.route.snapshot.routeConfig?.path ?? '';
  }
}
