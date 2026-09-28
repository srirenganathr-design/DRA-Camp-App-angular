import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-list-hero-header',
  standalone: true,
  template: `
    <div class="titleRow" [attr.data-figma-node-id]="rootNodeId">
      <span class="icon" [attr.data-figma-node-id]="iconNodeId">
        <ng-content select="[heroIcon]" />
      </span>
      <h1 class="title" [attr.data-figma-node-id]="titleNodeId">{{ title }}</h1>
    </div>
  `,
  styleUrl: './ListHeroHeader.module.css',
})
export class ListHeroHeaderComponent {
  @Input({ required: true }) rootNodeId!: string;
  @Input({ required: true }) iconNodeId!: string;
  @Input({ required: true }) titleNodeId!: string;
  @Input({ required: true }) title!: string;
}
