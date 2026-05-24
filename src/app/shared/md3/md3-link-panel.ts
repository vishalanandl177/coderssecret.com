import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Md3LinkPanel } from './md3.types';

@Component({
  selector: 'app-md3-link-panel',
  imports: [RouterLink],
  styles: [':host { display: contents; }'],
  template: `
    <div class="md3-learning-panel md3-learning-split-panel">
      <div>
        <span class="md3-learning-eyebrow">{{ panel.eyebrow }}</span>
        <h2>{{ panel.title }}</h2>
        <p>{{ panel.body }}</p>
      </div>
      <div class="md3-learning-link-grid">
        @for (link of panel.links; track link.href) {
          @if (link.external) {
            <a [href]="link.href" target="_blank" rel="noopener noreferrer" class="md3-learning-link-pill">{{ link.label }} <span aria-hidden="true">-></span></a>
          } @else {
            <a [routerLink]="link.href" class="md3-learning-link-pill">{{ link.label }} <span aria-hidden="true">-></span></a>
          }
        }
      </div>
    </div>
  `,
})
export class Md3LinkPanelComponent {
  @Input({ required: true }) panel!: Md3LinkPanel;
}
