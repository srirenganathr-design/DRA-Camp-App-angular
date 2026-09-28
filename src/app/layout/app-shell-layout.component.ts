import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PersistentBottomNavComponent } from '../components/molecules/persistent-bottom-nav.component';

@Component({
  selector: 'app-shell-layout',
  standalone: true,
  imports: [RouterOutlet, PersistentBottomNavComponent],
  templateUrl: './app-shell-layout.component.html',
  styleUrl: './app-shell-layout.component.css',
})
export class AppShellLayoutComponent {}
