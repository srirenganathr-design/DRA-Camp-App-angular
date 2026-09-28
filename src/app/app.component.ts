import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `<div class="appViewport"><router-outlet /></div>`,
  styles: `
    :host {
      display: contents;
    }
  `,
})
export class AppComponent {}
