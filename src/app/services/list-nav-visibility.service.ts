import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ListNavVisibilityService {
  private readonly visibleSignal = signal(true);

  readonly visible = this.visibleSignal.asReadonly();

  setVisible(value: boolean): void {
    this.visibleSignal.set(value);
  }
}
