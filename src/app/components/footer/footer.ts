import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EXTERNAL_LINKS } from '../../shared/external-links';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  template: `
    <footer class="border-t border-border bg-[color:var(--md-sys-color-surface-container)]">
      <div class="mx-auto w-full max-w-7xl px-6 py-12">
        <div class="grid gap-10 lg:grid-cols-[1.3fr_2fr]">
          <div>
            <a routerLink="/" class="inline-flex items-center gap-3 text-lg font-extrabold tracking-tight">
              <span class="grid h-10 w-10 place-items-center rounded-[1.25rem] bg-[color:var(--md-sys-color-primary-container)] text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="m9 18-6-6 6-6"/>
                  <path d="m15 6 6 6-6 6"/>
                  <path d="m14 4-4 16"/>
                </svg>
              </span>
              <span><span class="text-primary">Coders</span>Secret</span>
            </a>
            <p class="mt-4 max-w-md text-sm leading-7 text-muted-foreground">
              Practical engineering guides, free courses, labs, and references for engineers building secure production systems.
            </p>
            <div class="mt-5 flex flex-wrap gap-2">
              <span class="md3-chip-selected">Free</span>
              <span class="md3-chip">Ad-free</span>
              <span class="md3-chip">Production-focused</span>
            </div>
          </div>

          <div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <nav aria-label="Learning links">
              <h2 class="mb-3 text-sm font-bold text-foreground">Learn</h2>
              <ul class="space-y-2 text-sm">
                <li><a routerLink="/courses" class="text-muted-foreground hover:text-foreground">Free Courses</a></li>
                <li><a routerLink="/courses/mastering-spiffe-spire" class="text-muted-foreground hover:text-foreground">SPIFFE & SPIRE</a></li>
                <li><a routerLink="/courses/cloud-native-security-engineering" class="text-muted-foreground hover:text-foreground">Cloud Native Security</a></li>
                <li><a routerLink="/courses/production-rag-systems-engineering" class="text-muted-foreground hover:text-foreground">Production RAG</a></li>
                <li><a routerLink="/courses/production-analytics-engineering-dbt" class="text-muted-foreground hover:text-foreground">Analytics Engineering</a></li>
              </ul>
            </nav>

            <nav aria-label="Reference links">
              <h2 class="mb-3 text-sm font-bold text-foreground">Reference</h2>
              <ul class="space-y-2 text-sm">
                <li><a routerLink="/blog" class="text-muted-foreground hover:text-foreground">Engineering Guides</a></li>
                <li><a routerLink="/cheatsheets" class="text-muted-foreground hover:text-foreground">Cheatsheets</a></li>
                <li><a routerLink="/games" class="text-muted-foreground hover:text-foreground">Interactive Labs</a></li>
                <li><a routerLink="/glossary" class="text-muted-foreground hover:text-foreground">Glossary</a></li>
                <li><a routerLink="/category/devops" class="text-muted-foreground hover:text-foreground">DevOps Articles</a></li>
              </ul>
            </nav>

            <nav aria-label="Company links">
              <h2 class="mb-3 text-sm font-bold text-foreground">CodersSecret</h2>
              <ul class="space-y-2 text-sm">
                <li><a routerLink="/about" class="text-muted-foreground hover:text-foreground">About</a></li>
                <li><a routerLink="/consultation" class="text-muted-foreground hover:text-foreground">Consulting</a></li>
                <li><a [href]="links.spotifyPodcast" target="_blank" rel="noopener noreferrer" class="text-muted-foreground hover:text-foreground">Podcast</a></li>
                <li><a [href]="links.youtube" target="_blank" rel="noopener noreferrer" class="text-muted-foreground hover:text-foreground">YouTube</a></li>
                <li><a [href]="links.githubRepo" target="_blank" rel="noopener noreferrer" class="text-muted-foreground hover:text-foreground">GitHub</a></li>
              </ul>
            </nav>

            <nav aria-label="Legal links">
              <h2 class="mb-3 text-sm font-bold text-foreground">Legal</h2>
              <ul class="space-y-2 text-sm">
                <li><a routerLink="/privacy" class="text-muted-foreground hover:text-foreground">Privacy Policy</a></li>
                <li><a routerLink="/terms" class="text-muted-foreground hover:text-foreground">Terms of Service</a></li>
                <li><a routerLink="/cookies" class="text-muted-foreground hover:text-foreground">Cookie Policy</a></li>
                <li><a [href]="links.linkedin" target="_blank" rel="noopener noreferrer" class="text-muted-foreground hover:text-foreground">LinkedIn</a></li>
                <li><a [href]="links.buyMeACoffee" target="_blank" rel="noopener noreferrer" class="text-muted-foreground hover:text-foreground">Support the site</a></li>
              </ul>
            </nav>
          </div>
        </div>

        <div class="mt-10 rounded-[1.5rem] border border-border bg-[color:var(--md-sys-color-surface-container-high)] p-6">
          <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 class="text-base font-bold text-foreground">Need help with architecture, security, or production engineering?</h2>
              <p class="mt-1 text-sm text-muted-foreground">Bring the same practical production lens into your platform, data, or AI infrastructure work.</p>
            </div>
            <a routerLink="/consultation" class="md3-button-tonal shrink-0">Book a consultation</a>
          </div>
        </div>

        <div class="mt-8 flex flex-col gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {{ currentYear }} CodersSecret. All rights reserved.</p>
          <p>No ads. No paywalls. Privacy-first analytics.</p>
        </div>
      </div>
    </footer>
  `,
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
  links = EXTERNAL_LINKS;
}
