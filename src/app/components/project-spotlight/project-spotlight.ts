import { ChangeDetectionStrategy, Component, OnDestroy, inject, input, signal } from '@angular/core';
import {
  AnalyticsService,
  ProjectAnalyticsId,
  ProjectInternalDestination,
  ProjectPromotionPlacement,
  ProjectResource,
} from '../../services/analytics.service';

export type ProjectSpotlightSurface = 'tonal' | 'elevated' | 'outlined';

interface ProjectSpotlightLinkBase {
  label: string;
  href: string;
  ariaLabel?: string;
}

export interface ProjectSpotlightExternalLink extends ProjectSpotlightLinkBase {
  resource: ProjectResource;
  destination?: never;
  external?: boolean;
}

export interface ProjectSpotlightInternalLink extends ProjectSpotlightLinkBase {
  destination: ProjectInternalDestination;
  resource?: never;
  external?: false;
}

export type ProjectSpotlightLink = ProjectSpotlightExternalLink | ProjectSpotlightInternalLink;

export interface ProjectSpotlightFact {
  label: string;
  value: string;
}

export interface ProjectSpotlightConfig {
  eyebrow?: string;
  title: string;
  description: string;
  installCommand?: string;
  facts?: readonly ProjectSpotlightFact[];
  links: readonly ProjectSpotlightLink[];
}

@Component({
  selector: 'app-project-spotlight',
  standalone: true,
  template: `
    <section
      class="project-spotlight"
      [class.project-spotlight--tonal]="surface() === 'tonal'"
      [class.project-spotlight--elevated]="surface() === 'elevated'"
      [class.project-spotlight--outlined]="surface() === 'outlined'"
      [attr.data-project-spotlight]="analyticsId() ?? null"
      role="region"
      [attr.aria-label]="project().title">
      <div class="project-spotlight__content">
        @if (project().eyebrow) {
          <p class="project-spotlight__eyebrow">{{ project().eyebrow }}</p>
        }
        <h2 class="project-spotlight__title">{{ project().title }}</h2>
        <p class="project-spotlight__description">{{ project().description }}</p>

        @if (project().facts?.length) {
          <dl class="project-spotlight__facts">
            @for (fact of project().facts; track fact.label) {
              <div class="project-spotlight__fact">
                <dt>{{ fact.label }}</dt>
                <dd>{{ fact.value }}</dd>
              </div>
            }
          </dl>
        }

        @if (project().installCommand; as command) {
          <div class="project-spotlight__install" aria-label="Install command">
            <code>{{ command }}</code>
            <button
              type="button"
              class="project-spotlight__copy md3-focus-ring"
              [attr.aria-label]="copied() ? 'Install command copied' : 'Copy install command'"
              (click)="copyInstall()">
              @if (copied()) {
                <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                  <path d="m5 12.5 4.5 4.5L19 7.5" />
                </svg>
                Copied
              } @else {
                <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                  <rect x="8" y="8" width="11" height="11" rx="2" />
                  <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
                </svg>
                Copy install
              }
            </button>
          </div>
          <p
            class="project-spotlight__status"
            role="status"
            aria-live="polite"
            aria-atomic="true">{{ copyStatus() }}</p>
        }
      </div>

      <nav class="project-spotlight__links" aria-label="Project resources">
        @for (link of project().links; track link.href) {
          <a
            class="project-spotlight__link md3-focus-ring"
            [href]="link.href"
            [attr.target]="isExternal(link) ? '_blank' : null"
            [attr.rel]="isExternal(link) ? 'noopener noreferrer' : null"
            [attr.aria-label]="linkAriaLabel(link)"
            (click)="trackLink(link)">
            <span>{{ link.label }}</span>
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              @if (isExternal(link)) {
                <path d="M14 5h5v5M13 11l6-6M19 13v5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5" />
              } @else {
                <path d="m9 18 6-6-6-6" />
              }
            </svg>
          </a>
        }
      </nav>
    </section>
  `,
  styleUrl: './project-spotlight.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectSpotlightComponent implements OnDestroy {
  project = input.required<ProjectSpotlightConfig>();
  surface = input<ProjectSpotlightSurface>('tonal');
  analyticsId = input<ProjectAnalyticsId | undefined>(undefined);
  analyticsPlacement = input<ProjectPromotionPlacement>('project-spotlight');

  copied = signal(false);
  copyStatus = signal('');

  private readonly analytics = inject(AnalyticsService);
  private copyResetTimer: ReturnType<typeof setTimeout> | undefined;

  isExternal(link: ProjectSpotlightLink) {
    if (this.isInternalLink(link)) return false;
    return link.external ?? /^(?:https?:)?\/\//.test(link.href);
  }

  isInternalLink(link: ProjectSpotlightLink): link is ProjectSpotlightInternalLink {
    return 'destination' in link && link.destination !== undefined;
  }

  linkAriaLabel(link: ProjectSpotlightLink) {
    if (link.ariaLabel) return link.ariaLabel;
    return this.isExternal(link)
      ? `${link.label} (opens in a new tab)`
      : null;
  }

  trackLink(link: ProjectSpotlightLink) {
    const projectId = this.analyticsId();
    if (!projectId) return;

    try {
      if (this.isInternalLink(link)) {
        this.analytics.trackProjectInternalClick(
          projectId,
          link.destination,
          this.analyticsPlacement(),
        );
      } else {
        this.analytics.trackProjectResourceClick(
          projectId,
          link.resource,
          this.analyticsPlacement(),
        );
      }
    } catch {
      // A telemetry failure must not cancel the anchor's native navigation.
    }
  }

  async copyInstall() {
    const command = this.project().installCommand;
    if (!command) return;

    if (typeof navigator === 'undefined' || !navigator.clipboard?.writeText) {
      this.copied.set(false);
      this.copyStatus.set('Copy is unavailable. Select the install command and copy it manually.');
      return;
    }

    try {
      await navigator.clipboard.writeText(command);
      this.copied.set(true);
      this.copyStatus.set('Install command copied to the clipboard.');

      const projectId = this.analyticsId();
      if (projectId) {
        try {
          this.analytics.trackProjectInstallCopy(projectId, this.analyticsPlacement());
        } catch {
          // Clipboard feedback remains successful when telemetry is unavailable.
        }
      }

      if (this.copyResetTimer) clearTimeout(this.copyResetTimer);
      this.copyResetTimer = setTimeout(() => {
        this.copied.set(false);
        this.copyStatus.set('');
        this.copyResetTimer = undefined;
      }, 2000);
    } catch {
      this.copied.set(false);
      this.copyStatus.set('The install command could not be copied. Select it and copy it manually.');
    }
  }

  ngOnDestroy() {
    if (this.copyResetTimer) clearTimeout(this.copyResetTimer);
  }
}
