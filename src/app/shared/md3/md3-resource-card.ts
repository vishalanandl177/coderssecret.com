import { NgTemplateOutlet } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Md3ResourceCard } from './md3.types';

@Component({
  selector: 'app-md3-resource-card',
  imports: [NgTemplateOutlet, RouterLink],
  styles: [':host { display: contents; }'],
  template: `
    <ng-template #cardBody>
      <div class="md3-learning-card-top">
        @if (card.icon) {
          <span class="md3-learning-icon">{{ card.icon }}</span>
        }
        @if (card.badge) {
          <span [class]="card.selectedBadge ? 'md3-chip-selected' : 'md3-chip'">{{ card.badge }}</span>
        }
      </div>
      <div>
        @if (card.kicker) {
          <p class="md3-course-card-kicker">{{ card.kicker }}</p>
        }
        <h3>{{ card.title }}</h3>
      </div>
      <p>{{ card.description }}</p>
      @if (card.chips && card.chips.length > 0) {
        <div class="md3-learning-chip-row" aria-label="Topics">
          @for (chip of card.chips; track chip) {
            <span class="md3-chip">{{ chip }}</span>
          }
        </div>
      }
      @if (card.actionLabel) {
        <span class="md3-learning-card-action">
          {{ card.actionLabel }}
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
        </span>
      }
    </ng-template>

    @if (card.href && card.external) {
      <a [href]="card.href" target="_blank" rel="noopener noreferrer" class="md3-learning-card" [attr.aria-label]="card.ariaLabel ?? card.title">
        <ng-container [ngTemplateOutlet]="cardBody" />
      </a>
    } @else if (card.href) {
      <a [routerLink]="card.href" class="md3-learning-card" [attr.aria-label]="card.ariaLabel ?? card.title">
        <ng-container [ngTemplateOutlet]="cardBody" />
      </a>
    } @else {
      <article class="md3-learning-card" [attr.aria-label]="card.ariaLabel ?? null">
        <ng-container [ngTemplateOutlet]="cardBody" />
      </article>
    }
  `,
})
export class Md3ResourceCardComponent {
  @Input({ required: true }) card!: Md3ResourceCard;
}
