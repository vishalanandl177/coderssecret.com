import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Md3Action, Md3Hero } from './md3.types';
import { Md3BreadcrumbComponent } from './md3-breadcrumb';
import { Md3MiniMapComponent } from './md3-mini-map';

@Component({
  selector: 'app-md3-hero',
  imports: [RouterLink, Md3BreadcrumbComponent, Md3MiniMapComponent],
  styles: [':host { display: contents; }'],
  template: `
    <section class="md3-learning-hero">
      <div class="md3-learning-container">
        <app-md3-breadcrumb [items]="hero.breadcrumbs" />

        <div class="md3-learning-hero-grid">
          <div class="md3-learning-hero-copy">
            <span class="md3-learning-eyebrow">{{ hero.eyebrow }}</span>
            <h1>{{ hero.title }}</h1>
            <p class="md3-learning-lede">{{ hero.lede }}</p>

            @if (hero.actions && hero.actions.length > 0) {
              <div class="md3-learning-actions">
                @for (action of hero.actions; track action.label) {
                  @if (action.external) {
                    <a [href]="action.href" target="_blank" rel="noopener noreferrer" [class]="actionClass(action)">{{ action.label }}</a>
                  } @else {
                    <a [routerLink]="action.href" [class]="actionClass(action)">{{ action.label }}</a>
                  }
                }
              </div>
            }

            @if (hero.chips && hero.chips.length > 0) {
              <div class="md3-learning-chip-row" aria-label="Page topics">
                @for (chip of hero.chips; track chip) {
                  <span [class]="chip === hero.selectedChip ? 'md3-chip-selected' : 'md3-chip'">{{ chip }}</span>
                }
              </div>
            }
          </div>

          @if (hero.panel) {
            <aside class="md3-learning-panel" [attr.aria-label]="hero.panel.ariaLabel">
              <div class="md3-learning-panel-top">
                <strong>{{ hero.panel.title }}</strong>
                <span>{{ hero.panel.meta }}</span>
              </div>
              <div class="md3-learning-stat-grid">
                @for (stat of hero.panel.stats; track stat.label) {
                  <div class="md3-learning-stat-tile">
                    <strong>{{ stat.value }}</strong>
                    <span>{{ stat.label }}</span>
                  </div>
                }
              </div>
              <app-md3-mini-map [labels]="hero.panel.mapLabels ?? []" />
            </aside>
          }
        </div>
      </div>
    </section>
  `,
})
export class Md3HeroComponent {
  @Input({ required: true }) hero!: Md3Hero;

  actionClass(action: Md3Action): string {
    const variant = action.variant ?? 'tonal';
    return `md3-button-${variant} md3-button-large`;
  }
}
