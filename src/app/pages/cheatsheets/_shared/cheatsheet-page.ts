import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Md3BreadcrumbComponent } from '../../../shared/md3/md3-breadcrumb';
import { Md3CommandGroup, Md3CommandGroupsComponent, Md3CommandRow } from '../../../shared/md3/md3-command-groups';
import { Md3MiniMapComponent } from '../../../shared/md3/md3-mini-map';
import { Md3ResourceCardComponent } from '../../../shared/md3/md3-resource-card';
import { Md3BreadcrumbItem, Md3ResourceCard } from '../../../shared/md3/md3.types';

export interface CommandRow extends Md3CommandRow {}

export interface CommandGroup extends Md3CommandGroup {}

export interface MisconfigPair {
  bad: string;
  good: string;
  why: string;
}

export interface RelatedLink {
  label: string;
  href: string;
  description?: string;
}

export interface CheatsheetHeader {
  icon: string;
  iconColor: string;
  badge: string;
  badgeClass: string;
  title: string;
  intro: string;
}

@Component({
  selector: 'app-cheatsheet-page',
  imports: [RouterLink, Md3BreadcrumbComponent, Md3MiniMapComponent, Md3CommandGroupsComponent, Md3ResourceCardComponent],
  template: `
    <section class="md3-learning-page py-12 md:py-16">
      <div class="md3-learning-container">
        <app-md3-breadcrumb [items]="breadcrumbItems" />

        <article class="md3-reference-shell">
          <header class="md3-learning-hero md3-reference-hero">
            <div class="md3-learning-hero-grid">
              <div class="md3-learning-hero-copy">
                <span class="md3-learning-eyebrow">{{ header.badge }}</span>
                <h1>{{ header.title }}</h1>
                <p class="md3-learning-lede">{{ header.intro }}</p>
                <div class="md3-learning-chip-row" aria-label="Reference features">
                  <span class="md3-chip-selected">Command-first</span>
                  <span class="md3-chip">Production notes</span>
                  <span class="md3-chip">Security warnings</span>
                  <span class="md3-chip">Hardened patterns</span>
                </div>
              </div>

              <aside class="md3-learning-panel" aria-label="Reference summary">
                <div class="md3-learning-panel-top">
                  <strong>{{ referenceLabel }}</strong>
                  <span>{{ totalCommands }} commands</span>
                </div>
                <div class="md3-learning-stat-grid">
                  <div class="md3-learning-stat-tile">
                    <strong>{{ groups.length }}</strong>
                    <span>Sections</span>
                  </div>
                  <div class="md3-learning-stat-tile">
                    <strong>{{ warningCount }}</strong>
                    <span>Risk notes</span>
                  </div>
                </div>
                <app-md3-mini-map [labels]="['RUN', 'READ', 'SHIP', 'REF']" />
              </aside>
            </div>
          </header>

          <ng-content select="[slot=diagram]"></ng-content>
          <ng-content select="[slot=before-commands]"></ng-content>

          <app-md3-command-groups [groups]="groups" [idPrefix]="slugId" />

          <ng-content select="[slot=after-commands]"></ng-content>

      @if (misconfigPairs && misconfigPairs.length > 0) {
        <section class="mt-10" aria-labelledby="misconfig-heading">
          <div class="md3-learning-section-heading">
            <span class="md3-learning-eyebrow">Hardened patterns</span>
            <h2 id="misconfig-heading">Common misconfigurations</h2>
            <p>The unsafe pattern, the replacement, and the reason the two are not equivalent in production.</p>
          </div>
          <div class="md3-learning-grid-2">
            @for (pair of misconfigPairs; track pair.why) {
              <article class="md3-learning-card">
                <div class="md3-learning-card-top">
                  <span class="md3-learning-icon">FIX</span>
                  <span class="md3-chip-selected">Review</span>
                </div>
                <div class="md3-learning-grid-2">
                  <div>
                    <p class="md3-course-card-kicker">Risky</p>
                    <pre class="md3-learning-code"><code>{{ pair.bad }}</code></pre>
                  </div>
                  <div>
                    <p class="md3-course-card-kicker">Hardened</p>
                    <pre class="md3-learning-code"><code>{{ pair.good }}</code></pre>
                  </div>
                </div>
                <p><strong>Why it matters:</strong> {{ pair.why }}</p>
              </article>
            }
          </div>
        </section>
      }

      @if (relatedLinks && relatedLinks.length > 0) {
        <section class="mt-10" aria-labelledby="related-heading">
          <div class="md3-learning-section-heading">
            <span class="md3-learning-eyebrow">Go deeper</span>
            <h2 id="related-heading">Related learning paths</h2>
          </div>
          <div class="md3-learning-grid-2">
            @for (link of relatedLinks; track link.href) {
              <app-md3-resource-card [card]="relatedCard(link)" />
            }
          </div>
        </section>
      }

      <div class="mt-10">
        <a routerLink="/cheatsheets" class="md3-button-tonal">All reference sheets</a>
      </div>
        </article>
      </div>
    </section>
  `,
})
export class CheatsheetPageComponent {
  @Input({ required: true }) header!: CheatsheetHeader;
  @Input({ required: true }) groups!: CommandGroup[];
  @Input() misconfigPairs?: MisconfigPair[];
  @Input() relatedLinks?: RelatedLink[];
  @Input() currentLabel?: string;

  get breadcrumbItems(): Md3BreadcrumbItem[] {
    return [
      { label: 'Home', href: '/' },
      { label: 'Reference', href: '/cheatsheets' },
      { label: this.currentLabel ?? this.referenceLabel },
    ];
  }

  get referenceLabel(): string {
    const words = this.header.title.split(/\s+/).filter(Boolean);
    return words.filter(word => word.toLowerCase() !== 'cheatsheet').slice(0, 2).join(' ');
  }

  get totalCommands(): number {
    return this.groups.reduce((sum, group) => sum + this.rowsFor(group).length, 0);
  }

  get warningCount(): number {
    return this.groups.flatMap(group => this.rowsFor(group)).filter(row => row.warning).length;
  }

  get slugId(): string {
    return this.referenceLabel.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'reference';
  }

  rowsFor(group: CommandGroup): CommandRow[] {
    return (group.rows ?? group.items ?? []) as CommandRow[];
  }

  relatedCard(link: RelatedLink): Md3ResourceCard {
    return {
      title: link.label,
      description: link.description ?? 'Continue with the related CodersSecret learning path.',
      href: link.href,
      icon: 'LINK',
      badge: 'Internal',
      actionLabel: 'Continue',
      ariaLabel: `Open ${link.label}`,
    };
  }
}
