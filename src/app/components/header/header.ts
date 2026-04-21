import { Component, inject, signal, viewChild } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { SearchComponent } from '../search/search';
import { LocaleService, SUPPORTED_LOCALES, LOCALE_LABELS } from '../../services/locale.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, SearchComponent, TranslocoPipe],
  template: `
    <header class="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-300">
      <div class="container flex h-16 max-w-5xl items-center justify-between mx-auto px-6">
        <a routerLink="/" class="flex items-center gap-2.5 font-bold text-xl tracking-tight transition-opacity duration-200 hover:opacity-80">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none" class="h-8 w-8">
            <defs>
              <linearGradient id="logo-g" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#7c3aed"/>
                <stop offset="100%" style="stop-color:#3b82f6"/>
              </linearGradient>
            </defs>
            <rect width="32" height="32" rx="7" fill="url(#logo-g)"/>
            <g stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none">
              <polyline points="11,10 6,16 11,22"/>
              <polyline points="21,10 26,16 21,22"/>
              <line x1="18.5" y1="8" x2="13.5" y2="24"/>
            </g>
          </svg>
          <span><span class="text-primary">Coders</span><span class="text-muted-foreground">Secret</span></span>
        </a>

        <div class="flex items-center gap-1 md:gap-2">
          <nav class="hidden md:flex items-center gap-1 text-sm font-medium">
            <a routerLink="/" routerLinkActive="text-foreground bg-accent" [routerLinkActiveOptions]="{ exact: true }"
               class="rounded-md px-3 py-2 text-muted-foreground transition-all duration-200 hover:text-foreground hover:bg-accent/50">
              {{ 'nav.home' | transloco }}
            </a>
            <a routerLink="/blog" routerLinkActive="text-foreground bg-accent"
               class="rounded-md px-3 py-2 text-muted-foreground transition-all duration-200 hover:text-foreground hover:bg-accent/50">
              {{ 'nav.blog' | transloco }}
            </a>

            <a routerLink="/games" routerLinkActive="text-foreground bg-accent"
               class="rounded-md px-3 py-2 text-muted-foreground transition-all duration-200 hover:text-foreground hover:bg-accent/50">
              {{ 'nav.games' | transloco }}
            </a>
            <a routerLink="/cheatsheets" routerLinkActive="text-foreground bg-accent"
               class="rounded-md px-3 py-2 text-muted-foreground transition-all duration-200 hover:text-foreground hover:bg-accent/50">
              {{ 'nav.cheatsheets' | transloco }}
            </a>
            <a routerLink="/about" routerLinkActive="text-foreground bg-accent"
               class="rounded-md px-3 py-2 text-muted-foreground transition-all duration-200 hover:text-foreground hover:bg-accent/50">
              {{ 'nav.about' | transloco }}
            </a>

            <!-- Categories dropdown -->
            <div class="relative">
              <button (click)="categoriesOpen.set(!categoriesOpen())"
                      (blur)="closeCategoriesDelayed()"
                      class="flex items-center gap-1 rounded-md px-3 py-2 text-sm text-muted-foreground transition-all duration-200 hover:text-foreground hover:bg-accent/50">
                {{ 'nav.categories' | transloco }}
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                     class="transition-transform duration-200"
                     [class.rotate-180]="categoriesOpen()">
                  <path d="m6 9 6 6 6-6"/>
                </svg>
              </button>
              @if (categoriesOpen()) {
                <div class="absolute right-0 top-full mt-2 w-48 rounded-lg border border-border bg-card p-1.5 shadow-lg animate-in fade-in slide-in-from-top-2 duration-200"
                     (mousedown)="$event.preventDefault()">
                  <a routerLink="/category/frontend" (click)="categoriesOpen.set(false)"
                     class="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground hover:bg-accent">
                    <span class="h-2 w-2 rounded-full bg-blue-500"></span> {{ 'categories.frontend' | transloco }}
                  </a>
                  <a routerLink="/category/backend" (click)="categoriesOpen.set(false)"
                     class="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground hover:bg-accent">
                    <span class="h-2 w-2 rounded-full bg-green-500"></span> {{ 'categories.backend' | transloco }}
                  </a>
                  <a routerLink="/category/devops" (click)="categoriesOpen.set(false)"
                     class="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground hover:bg-accent">
                    <span class="h-2 w-2 rounded-full bg-orange-500"></span> {{ 'categories.devops' | transloco }}
                  </a>
                  <a routerLink="/category/tutorials" (click)="categoriesOpen.set(false)"
                     class="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground hover:bg-accent">
                    <span class="h-2 w-2 rounded-full bg-purple-500"></span> {{ 'categories.tutorials' | transloco }}
                  </a>
                  <a routerLink="/category/open-source" (click)="categoriesOpen.set(false)"
                     class="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground hover:bg-accent">
                    <span class="h-2 w-2 rounded-full bg-pink-500"></span> {{ 'categories.openSource' | transloco }}
                  </a>
                </div>
              }
            </div>
          </nav>

          <!-- Search button -->
          <button (click)="openSearch()"
                  class="inline-flex items-center gap-2 rounded-md border border-border bg-muted/50 px-3 py-1.5 text-sm text-muted-foreground transition-all duration-200 hover:bg-accent hover:text-foreground hover:border-accent">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
            </svg>
            <span class="hidden sm:inline">{{ 'nav.search' | transloco }}</span>
            <kbd class="hidden md:inline-flex items-center rounded border border-border bg-background px-1 py-0.5 text-[10px] font-medium">
              Ctrl+K
            </kbd>
          </button>

          <!-- Language switcher -->
          <div class="relative">
            <button (click)="langOpen.set(!langOpen())"
                    (blur)="closeLangDelayed()"
                    class="inline-flex items-center gap-1.5 rounded-md p-2 text-muted-foreground transition-all duration-200 hover:bg-accent hover:text-accent-foreground"
                    aria-label="Switch language">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/>
                <path d="M2 12h20"/>
              </svg>
              <span class="text-xs font-semibold uppercase">{{ localeService.currentLocale() }}</span>
            </button>
            @if (langOpen()) {
              <div class="absolute right-0 top-full mt-2 w-40 rounded-lg border border-border bg-card p-1.5 shadow-lg animate-in fade-in slide-in-from-top-2 duration-200"
                   (mousedown)="$event.preventDefault()">
                @for (lang of supportedLocales; track lang) {
                  <button (click)="switchLocale(lang)"
                          class="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent"
                          [class.text-foreground]="localeService.currentLocale() === lang"
                          [class.font-semibold]="localeService.currentLocale() === lang"
                          [class.text-muted-foreground]="localeService.currentLocale() !== lang">
                    {{ localeLabels[lang] }}
                    @if (localeService.currentLocale() === lang) {
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                           stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ml-auto">
                        <path d="M20 6 9 17l-5-5"/>
                      </svg>
                    }
                  </button>
                }
              </div>
            }
          </div>

          <!-- Theme toggle -->
          <button (click)="toggleTheme()"
                  class="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground transition-all duration-200 hover:bg-accent hover:text-accent-foreground"
                  [attr.aria-label]="isDark() ? 'Switch to light mode' : 'Switch to dark mode'">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                 class="transition-transform duration-300"
                 [class.rotate-0]="isDark()" [class.-rotate-90]="!isDark()">
              @if (isDark()) {
                <circle cx="12" cy="12" r="4"/>
                <path d="M12 2v2"/><path d="M12 20v2"/>
                <path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/>
                <path d="M2 12h2"/><path d="M20 12h2"/>
                <path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>
              } @else {
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
              }
            </svg>
          </button>

          <!-- Mobile menu -->
          <button (click)="mobileMenuOpen.set(!mobileMenuOpen())"
                  class="md:hidden inline-flex items-center justify-center rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                 class="transition-transform duration-200"
                 [class.rotate-90]="mobileMenuOpen()">
              @if (mobileMenuOpen()) {
                <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
              } @else {
                <line x1="4" x2="20" y1="12" y2="12"/>
                <line x1="4" x2="20" y1="6" y2="6"/>
                <line x1="4" x2="20" y1="18" y2="18"/>
              }
            </svg>
          </button>
        </div>
      </div>

      @if (mobileMenuOpen()) {
        <div class="md:hidden border-t border-border animate-in slide-in-from-top-2 duration-200">
          <nav class="container max-w-5xl mx-auto px-6 py-4 flex flex-col gap-1">
            <a routerLink="/" (click)="mobileMenuOpen.set(false)"
               class="rounded-md px-3 py-2.5 text-muted-foreground transition-colors hover:text-foreground hover:bg-accent">{{ 'nav.home' | transloco }}</a>
            <a routerLink="/blog" (click)="mobileMenuOpen.set(false)"
               class="rounded-md px-3 py-2.5 text-muted-foreground transition-colors hover:text-foreground hover:bg-accent">{{ 'nav.blog' | transloco }}</a>
            <a routerLink="/games" (click)="mobileMenuOpen.set(false)"
               class="rounded-md px-3 py-2.5 text-muted-foreground transition-colors hover:text-foreground hover:bg-accent">{{ 'nav.games' | transloco }}</a>
            <a routerLink="/cheatsheets" (click)="mobileMenuOpen.set(false)"
               class="rounded-md px-3 py-2.5 text-muted-foreground transition-colors hover:text-foreground hover:bg-accent">{{ 'nav.cheatsheets' | transloco }}</a>
            <a routerLink="/about" (click)="mobileMenuOpen.set(false)"
               class="rounded-md px-3 py-2.5 text-muted-foreground transition-colors hover:text-foreground hover:bg-accent">{{ 'nav.about' | transloco }}</a>
            <div class="border-t border-border my-2"></div>
            <p class="px-3 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{{ 'nav.categories' | transloco }}</p>
            <a routerLink="/category/frontend" (click)="mobileMenuOpen.set(false)"
               class="flex items-center gap-2 rounded-md px-3 py-2.5 text-muted-foreground transition-colors hover:text-foreground hover:bg-accent">
              <span class="h-2 w-2 rounded-full bg-blue-500"></span> {{ 'categories.frontend' | transloco }}
            </a>
            <a routerLink="/category/backend" (click)="mobileMenuOpen.set(false)"
               class="flex items-center gap-2 rounded-md px-3 py-2.5 text-muted-foreground transition-colors hover:text-foreground hover:bg-accent">
              <span class="h-2 w-2 rounded-full bg-green-500"></span> {{ 'categories.backend' | transloco }}
            </a>
            <a routerLink="/category/devops" (click)="mobileMenuOpen.set(false)"
               class="flex items-center gap-2 rounded-md px-3 py-2.5 text-muted-foreground transition-colors hover:text-foreground hover:bg-accent">
              <span class="h-2 w-2 rounded-full bg-orange-500"></span> {{ 'categories.devops' | transloco }}
            </a>
            <a routerLink="/category/tutorials" (click)="mobileMenuOpen.set(false)"
               class="flex items-center gap-2 rounded-md px-3 py-2.5 text-muted-foreground transition-colors hover:text-foreground hover:bg-accent">
              <span class="h-2 w-2 rounded-full bg-purple-500"></span> {{ 'categories.tutorials' | transloco }}
            </a>
            <a routerLink="/category/open-source" (click)="mobileMenuOpen.set(false)"
               class="flex items-center gap-2 rounded-md px-3 py-2.5 text-muted-foreground transition-colors hover:text-foreground hover:bg-accent">
              <span class="h-2 w-2 rounded-full bg-pink-500"></span> {{ 'categories.openSource' | transloco }}
            </a>
            <div class="border-t border-border my-2"></div>
            <p class="px-3 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{{ 'common.language' | transloco }}</p>
            @for (lang of supportedLocales; track lang) {
              <button (click)="switchLocale(lang); mobileMenuOpen.set(false)"
                      class="flex items-center gap-2 rounded-md px-3 py-2.5 text-left transition-colors hover:bg-accent"
                      [class.text-foreground]="localeService.currentLocale() === lang"
                      [class.font-semibold]="localeService.currentLocale() === lang"
                      [class.text-muted-foreground]="localeService.currentLocale() !== lang">
                {{ localeLabels[lang] }}
                @if (localeService.currentLocale() === lang) {
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                       stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ml-auto">
                    <path d="M20 6 9 17l-5-5"/>
                  </svg>
                }
              </button>
            }
          </nav>
        </div>
      }
    </header>

    <app-search />
  `,
})
export class HeaderComponent {
  localeService = inject(LocaleService);
  private router = inject(Router);

  mobileMenuOpen = signal(false);
  categoriesOpen = signal(false);
  langOpen = signal(false);
  isDark = signal(typeof document !== 'undefined' && document.documentElement.classList.contains('dark'));
  searchComponent = viewChild(SearchComponent);

  supportedLocales = SUPPORTED_LOCALES;
  localeLabels = LOCALE_LABELS;

  toggleTheme() {
    document.documentElement.classList.add('theme-transition');
    const dark = !this.isDark();
    this.isDark.set(dark);
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
    setTimeout(() => document.documentElement.classList.remove('theme-transition'), 300);
  }

  openSearch() {
    this.searchComponent()?.open();
  }

  closeCategoriesDelayed() {
    setTimeout(() => this.categoriesOpen.set(false), 150);
  }

  closeLangDelayed() {
    setTimeout(() => this.langOpen.set(false), 150);
  }

  switchLocale(lang: string) {
    this.localeService.setLocale(lang);
    this.langOpen.set(false);
    const localizedPath = this.localeService.localizeRoute(this.router.url);
    this.router.navigateByUrl(localizedPath);
  }
}
