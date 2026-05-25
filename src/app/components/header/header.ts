import { AfterViewInit, Component, DestroyRef, ElementRef, HostListener, inject, signal, viewChild } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SearchComponent } from '../search/search';
import { EXTERNAL_LINKS } from '../../shared/external-links';
import { BrandMarkComponent } from '../../shared/brand/brand-mark';
import { Md3ActiveIndicatorDirective } from '../../shared/md3/md3-active-indicator';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, SearchComponent, BrandMarkComponent, Md3ActiveIndicatorDirective],
  template: `
    <aside class="md3-nav-rail hidden lg:flex"
           [class.md3-nav-rail-searching]="searchLaunching()"
           aria-label="Primary navigation rail">
      <button type="button"
              class="md3-rail-fab"
              [class.md3-rail-fab-launching]="searchLaunching()"
              (click)="openSearch()"
              aria-label="Search CodersSecret">
        <svg class="md3-rail-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
        </svg>
      </button>

      <nav #railNav aria-label="Primary navigation" class="md3-rail-nav">
        <span class="md3-rail-active-indicator"
              [class.md3-rail-active-indicator-visible]="railIndicatorVisible()"
              [style.transform]="'translate3d(0, ' + railIndicatorTop() + 'px, 0)'"
              aria-hidden="true"></span>
        <a routerLink="/" routerLinkActive="md3-rail-link-active" [routerLinkActiveOptions]="{ exact: true }"
           ariaCurrentWhenActive="page" class="md3-rail-link">
          <span class="md3-rail-icon"><svg class="md3-rail-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m3 10.5 9-7 9 7"/><path d="M5 9.5V21h14V9.5"/><path d="M9 21v-6h6v6"/></svg></span>
          <span class="md3-rail-label">Home</span>
        </a>
        <a routerLink="/blog" routerLinkActive="md3-rail-link-active"
           ariaCurrentWhenActive="page" class="md3-rail-link">
          <span class="md3-rail-icon"><svg class="md3-rail-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v6h6"/><path d="M8 13h8"/><path d="M8 17h5"/></svg></span>
          <span class="md3-rail-label">Blog</span>
        </a>
        <a [href]="links.spotifyPodcast" target="_blank" rel="noopener noreferrer" class="md3-rail-link">
          <span class="md3-rail-icon"><svg class="md3-rail-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 18v4"/><path d="M8 22h8"/><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10a7 7 0 0 0 14 0"/></svg></span>
          <span class="md3-rail-label">Podcast</span>
        </a>
        <a routerLink="/courses" routerLinkActive="md3-rail-link-active"
           ariaCurrentWhenActive="page" class="md3-rail-link">
          <span class="md3-rail-icon"><svg class="md3-rail-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m22 10-10-5-10 5 10 5 10-5Z"/><path d="M6 12v5c3 2 9 2 12 0v-5"/></svg></span>
          <span class="md3-rail-label">Courses</span>
        </a>
        <a routerLink="/games" routerLinkActive="md3-rail-link-active"
           ariaCurrentWhenActive="page" class="md3-rail-link">
          <span class="md3-rail-icon"><svg class="md3-rail-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 12h4"/><path d="M8 10v4"/><path d="M15 13h.01"/><path d="M18 11h.01"/><path d="M17.3 6H6.7A4.7 4.7 0 0 0 2 10.7v2.6A4.7 4.7 0 0 0 6.7 18h10.6a4.7 4.7 0 0 0 4.7-4.7v-2.6A4.7 4.7 0 0 0 17.3 6Z"/></svg></span>
          <span class="md3-rail-label">Labs</span>
        </a>
        <a routerLink="/cheatsheets" routerLinkActive="md3-rail-link-active"
           ariaCurrentWhenActive="page" class="md3-rail-link">
          <span class="md3-rail-icon"><svg class="md3-rail-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M8 12h8"/><path d="M8 16h6"/></svg></span>
          <span class="md3-rail-label">Sheets</span>
        </a>
        <a routerLink="/about" routerLinkActive="md3-rail-link-active"
           ariaCurrentWhenActive="page" class="md3-rail-link">
          <span class="md3-rail-icon"><svg class="md3-rail-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 22a8 8 0 0 1 16 0"/></svg></span>
          <span class="md3-rail-label">About</span>
        </a>
        <a routerLink="/consultation" routerLinkActive="md3-rail-link-active"
           ariaCurrentWhenActive="page" class="md3-rail-link">
          <span class="md3-rail-icon"><svg class="md3-rail-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m11 17 2 2a2.8 2.8 0 0 0 4 0l3-3a2.8 2.8 0 0 0 0-4l-2-2"/><path d="m13 7-2-2a2.8 2.8 0 0 0-4 0L4 8a2.8 2.8 0 0 0 0 4l2 2"/><path d="m8 12 8-8"/><path d="m16 12-8 8"/></svg></span>
          <span class="md3-rail-label">Hire</span>
        </a>
      </nav>

      <div class="mt-auto flex flex-col items-center gap-3 pb-4">
        <button type="button"
                (click)="toggleTheme()"
                class="md3-rail-icon-button"
                [attr.aria-label]="isDark() ? 'Switch to light mode' : 'Switch to dark mode'">
          <svg class="md3-rail-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
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
      </div>
    </aside>

    <header class="md3-top-app-bar sticky top-0 z-50 border-b border-border backdrop-blur-xl lg:hidden">
      <div class="mx-auto flex h-20 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <a routerLink="/"
           class="md3-brand group inline-flex min-h-[44px] shrink-0 items-center gap-3 rounded-full pr-3 text-base font-extrabold tracking-tight text-foreground md:text-lg">
          <app-brand-mark />
          <span><span class="text-primary">Coders</span><span class="text-foreground">Secret</span></span>
        </a>

        <div class="hidden min-w-0 flex-1 justify-center xl:flex">
        <nav aria-label="Primary navigation"
             appMd3ActiveIndicator=".md3-nav-link-active"
             class="md3-nav-shell flex h-12 max-w-full items-center gap-1 overflow-x-auto rounded-full p-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <a routerLink="/" routerLinkActive="md3-nav-link-active" [routerLinkActiveOptions]="{ exact: true }"
             ariaCurrentWhenActive="page"
             class="md3-nav-link">
            Home
          </a>
          <a routerLink="/blog" routerLinkActive="md3-nav-link-active"
             ariaCurrentWhenActive="page"
             class="md3-nav-link">
            Blog
          </a>
          <a [href]="links.spotifyPodcast" target="_blank" rel="noopener noreferrer"
             class="md3-nav-link">
            Podcast
          </a>
          <a routerLink="/courses" routerLinkActive="md3-nav-link-active"
             ariaCurrentWhenActive="page"
             class="md3-nav-link gap-2">
            Courses
            <span class="md3-nav-badge">FREE</span>
          </a>
          <a routerLink="/games" routerLinkActive="md3-nav-link-active"
             ariaCurrentWhenActive="page"
             class="md3-nav-link">
            Games
          </a>
          <a routerLink="/cheatsheets" routerLinkActive="md3-nav-link-active"
             ariaCurrentWhenActive="page"
             class="md3-nav-link">
            Cheatsheets
          </a>
          <a routerLink="/about" routerLinkActive="md3-nav-link-active"
             ariaCurrentWhenActive="page"
             class="md3-nav-link">
            About
          </a>
          <a routerLink="/consultation" routerLinkActive="md3-nav-link-active"
             ariaCurrentWhenActive="page"
             class="md3-nav-link md3-nav-link-cta">
            Hire Me
          </a>
        </nav>
        </div>

        <div class="flex shrink-0 items-center gap-2">
          <button type="button"
                  (click)="openSearch()"
                  aria-label="Open search"
                  aria-haspopup="dialog"
                  [attr.aria-controls]="searchComponent()?.isOpen() ? 'site-search-dialog' : null"
                  [class.md3-search-trigger-launching]="searchLaunching()"
                  class="md3-search-button hidden h-12 min-w-[9rem] items-center gap-2 rounded-full px-4 text-sm font-semibold md:inline-flex">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"
                 class="md3-icon-glyph">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
            </svg>
            Search
            <kbd class="hidden rounded-full border border-border bg-background px-2 py-0.5 text-[10px] font-bold text-muted-foreground md:inline-flex">Ctrl K</kbd>
          </button>

          <button type="button"
                  (click)="openSearch()"
                  aria-label="Open search"
                  [class.md3-search-trigger-launching]="searchLaunching()"
                  class="md3-icon-button inline-flex h-12 w-12 items-center justify-center rounded-full md:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"
                 class="md3-icon-glyph">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
            </svg>
          </button>

          <button type="button"
                  (click)="toggleTheme()"
                  class="md3-icon-button inline-flex h-12 w-12 items-center justify-center rounded-full"
                  [attr.aria-label]="isDark() ? 'Switch to light mode' : 'Switch to dark mode'">
            <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"
                 class="md3-icon-glyph">
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

          <button type="button"
                  (click)="mobileMenuOpen.set(!mobileMenuOpen())"
                  class="md3-icon-button inline-flex h-12 w-12 items-center justify-center rounded-full lg:hidden"
                  [attr.aria-label]="mobileMenuOpen() ? 'Close menu' : 'Open menu'"
                  [attr.aria-controls]="mobileMenuOpen() ? 'mobile-navigation' : null"
                  [attr.aria-expanded]="mobileMenuOpen()">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"
                 class="md3-icon-glyph">
              @if (mobileMenuOpen()) {
                <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
              } @else {
                <path d="M4 7h16"/><path d="M4 12h16"/><path d="M4 17h16"/>
              }
            </svg>
          </button>
        </div>
      </div>
    </header>

    @if (mobileMenuOpen()) {
      <div class="md3-drawer-scrim fixed inset-0 z-40 bg-black/35 backdrop-blur-sm lg:hidden" (click)="mobileMenuOpen.set(false)"></div>
      <aside id="mobile-navigation"
             role="dialog"
             aria-modal="true"
             aria-label="Site navigation"
             class="md3-nav-drawer fixed inset-y-0 right-0 z-50 flex w-[min(26rem,92vw)] flex-col border-l border-border p-4 lg:hidden">
        <div class="flex items-center justify-between border-b border-border pb-3">
          <span class="inline-flex items-center gap-3 text-sm font-extrabold text-foreground">
            <app-brand-mark />
            CodersSecret
          </span>
          <button type="button"
                  (click)="mobileMenuOpen.set(false)"
                  class="md3-icon-button inline-flex h-11 w-11 items-center justify-center rounded-full"
                  aria-label="Close menu">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"
                 class="md3-icon-glyph">
              <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
            </svg>
          </button>
        </div>

        <nav aria-label="Mobile navigation" class="mt-4 flex flex-1 flex-col gap-1 overflow-y-auto">
          <a routerLink="/" (click)="mobileMenuOpen.set(false)" routerLinkActive="bg-accent text-accent-foreground" [routerLinkActiveOptions]="{ exact: true }"
             ariaCurrentWhenActive="page" class="md3-mobile-link">Home</a>
          <a routerLink="/blog" (click)="mobileMenuOpen.set(false)" routerLinkActive="bg-accent text-accent-foreground"
             ariaCurrentWhenActive="page" class="md3-mobile-link">Blog</a>
          <a [href]="links.spotifyPodcast" target="_blank" rel="noopener noreferrer" (click)="mobileMenuOpen.set(false)"
             class="md3-mobile-link">Podcast</a>
          <a routerLink="/courses" (click)="mobileMenuOpen.set(false)" routerLinkActive="bg-accent text-accent-foreground"
             ariaCurrentWhenActive="page" class="md3-mobile-link justify-between">
            Courses <span class="md3-nav-badge">FREE</span>
          </a>
          <a routerLink="/games" (click)="mobileMenuOpen.set(false)" routerLinkActive="bg-accent text-accent-foreground"
             ariaCurrentWhenActive="page" class="md3-mobile-link">Games</a>
          <a routerLink="/cheatsheets" (click)="mobileMenuOpen.set(false)" routerLinkActive="bg-accent text-accent-foreground"
             ariaCurrentWhenActive="page" class="md3-mobile-link">Cheatsheets</a>
          <a routerLink="/about" (click)="mobileMenuOpen.set(false)" routerLinkActive="bg-accent text-accent-foreground"
             ariaCurrentWhenActive="page" class="md3-mobile-link">About</a>
          <a routerLink="/consultation" (click)="mobileMenuOpen.set(false)" routerLinkActive="bg-primary text-primary-foreground"
             ariaCurrentWhenActive="page" class="mt-2 flex min-h-[48px] items-center justify-center rounded-full bg-[color:var(--md-sys-color-primary-container)] px-4 text-base font-bold text-primary hover:bg-primary hover:text-primary-foreground">Hire Me</a>

          <div class="my-3 border-t border-border"></div>
          <p class="px-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Categories</p>
          @for (cat of categories; track cat.slug) {
            <a [routerLink]="['/category', cat.slug]" (click)="mobileMenuOpen.set(false)"
               class="md3-mobile-link gap-3">
              <span class="h-2.5 w-2.5 rounded-full" [style.background]="cat.color"></span>
              {{ cat.name }}
            </a>
          }
        </nav>
      </aside>
    }

    <app-search />
  `,
})
export class HeaderComponent implements AfterViewInit {
  links = EXTERNAL_LINKS;
  mobileMenuOpen = signal(false);
  isDark = signal(typeof document !== 'undefined' && document.documentElement.classList.contains('dark'));
  searchLaunching = signal(false);
  railIndicatorTop = signal(0);
  railIndicatorVisible = signal(false);
  searchComponent = viewChild(SearchComponent);
  railNav = viewChild<ElementRef<HTMLElement>>('railNav');
  categories = [
    { name: 'AI', slug: 'ai', color: 'var(--md-sys-color-secondary)' },
    { name: 'Frontend', slug: 'frontend', color: 'var(--md-sys-color-primary)' },
    { name: 'Backend', slug: 'backend', color: 'var(--md-sys-color-secondary)' },
    { name: 'DevOps', slug: 'devops', color: 'var(--md-sys-color-tertiary)' },
    { name: 'Tutorials', slug: 'tutorials', color: 'var(--md-sys-color-primary-container)' },
    { name: 'Open Source', slug: 'open-source', color: 'var(--md-sys-color-tertiary-container)' },
  ];

  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly canUseDom = typeof window !== 'undefined';
  private railRefreshFrame: number | undefined;
  private searchLaunchTimer: number | undefined;

  constructor() {
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => this.scheduleRailIndicatorRefresh());

    this.destroyRef.onDestroy(() => {
      if (this.canUseDom && this.railRefreshFrame !== undefined) {
        window.cancelAnimationFrame(this.railRefreshFrame);
      }
      if (this.canUseDom && this.searchLaunchTimer !== undefined) {
        window.clearTimeout(this.searchLaunchTimer);
      }
    });
  }

  ngAfterViewInit() {
    this.scheduleRailIndicatorRefresh();
  }

  @HostListener('document:keydown.escape')
  closeOpenMenus() {
    this.mobileMenuOpen.set(false);
  }

  @HostListener('window:resize')
  onViewportResize() {
    this.scheduleRailIndicatorRefresh();
  }

  toggleTheme() {
    if (!this.canUseDom) return;
    document.documentElement.classList.add('theme-transition');
    const dark = !this.isDark();
    this.isDark.set(dark);
    document.documentElement.classList.toggle('dark', dark);
    try {
      localStorage.setItem('theme', dark ? 'dark' : 'light');
    } catch {
      // Theme still updates for the current session when storage is unavailable.
    }
    window.setTimeout(() => document.documentElement.classList.remove('theme-transition'), 300);
  }

  openSearch() {
    this.mobileMenuOpen.set(false);
    this.runSearchLaunchMotion();
    this.searchComponent()?.open();
  }

  private runSearchLaunchMotion() {
    this.searchLaunching.set(true);
    if (!this.canUseDom) return;
    if (this.searchLaunchTimer !== undefined) {
      window.clearTimeout(this.searchLaunchTimer);
    }
    this.searchLaunchTimer = window.setTimeout(() => {
      this.searchLaunching.set(false);
      this.searchLaunchTimer = undefined;
    }, 430);
  }

  private scheduleRailIndicatorRefresh() {
    if (!this.canUseDom) return;
    if (this.railRefreshFrame !== undefined) {
      window.cancelAnimationFrame(this.railRefreshFrame);
    }
    this.railRefreshFrame = window.requestAnimationFrame(() => {
      this.railRefreshFrame = undefined;
      this.refreshRailIndicator();
    });
  }

  private refreshRailIndicator() {
    const nav = this.railNav()?.nativeElement;
    if (!nav) return;

    const activeLink = nav.querySelector<HTMLElement>('.md3-rail-link-active');
    if (!activeLink) {
      this.railIndicatorVisible.set(false);
      return;
    }

    const navRect = nav.getBoundingClientRect();
    const activeRect = activeLink.getBoundingClientRect();
    if (activeRect.height === 0 || navRect.height === 0) {
      this.railIndicatorVisible.set(false);
      return;
    }

    this.railIndicatorTop.set(activeRect.top - navRect.top);
    this.railIndicatorVisible.set(true);
  }
}
