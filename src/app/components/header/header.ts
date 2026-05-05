import { Component, signal, viewChild } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SearchComponent } from '../search/search';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, SearchComponent],
  template: `
    <header class="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-300">
      <div class="container flex h-16 max-w-7xl items-center justify-between mx-auto px-4 sm:px-6">
        <a routerLink="/" class="flex shrink-0 items-center gap-2.5 font-bold text-xl tracking-tight transition-opacity duration-200 hover:opacity-80">
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
          <nav class="hidden lg:flex items-center gap-0.5 text-sm font-medium">
            <a routerLink="/" routerLinkActive="text-foreground bg-accent" [routerLinkActiveOptions]="{ exact: true }"
               class="whitespace-nowrap rounded-md px-3 py-2 text-muted-foreground transition-all duration-200 hover:text-foreground hover:bg-accent/50">
              Home
            </a>
            <a routerLink="/blog" routerLinkActive="text-foreground bg-accent"
               class="whitespace-nowrap rounded-md px-3 py-2 text-muted-foreground transition-all duration-200 hover:text-foreground hover:bg-accent/50">
              Blog
            </a>
            <a routerLink="/courses" routerLinkActive="text-foreground bg-accent"
               class="relative whitespace-nowrap rounded-md px-3 py-2 text-muted-foreground transition-all duration-200 hover:text-foreground hover:bg-accent/50">
              Courses
              <span class="absolute -top-1 -right-1 inline-flex items-center rounded-full bg-green-500 px-1.5 py-0.5 text-[9px] font-bold leading-none text-white">FREE</span>
            </a>
            <a routerLink="/games" routerLinkActive="text-foreground bg-accent"
               class="whitespace-nowrap rounded-md px-3 py-2 text-muted-foreground transition-all duration-200 hover:text-foreground hover:bg-accent/50">
              Games
            </a>
            <a routerLink="/cheatsheets" routerLinkActive="text-foreground bg-accent"
               class="whitespace-nowrap rounded-md px-3 py-2 text-muted-foreground transition-all duration-200 hover:text-foreground hover:bg-accent/50">
              Cheatsheets
            </a>
            <a routerLink="/about" routerLinkActive="text-foreground bg-accent"
               class="whitespace-nowrap rounded-md px-3 py-2 text-muted-foreground transition-all duration-200 hover:text-foreground hover:bg-accent/50">
              About
            </a>
            <a routerLink="/consultation" routerLinkActive="text-foreground bg-accent"
               class="whitespace-nowrap rounded-md px-3 py-2 text-muted-foreground transition-all duration-200 hover:text-foreground hover:bg-accent/50">
              Hire Me
            </a>

            <!-- Categories dropdown -->
            <div class="relative">
              <button (click)="categoriesOpen.set(!categoriesOpen())"
                      (blur)="closeCategoriesDelayed()"
                      class="flex items-center gap-1 whitespace-nowrap rounded-md px-3 py-2 text-sm text-muted-foreground transition-all duration-200 hover:text-foreground hover:bg-accent/50">
                Categories
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
                  <a routerLink="/category/ai" (click)="categoriesOpen.set(false)"
                     class="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground hover:bg-accent">
                    <span class="h-2 w-2 rounded-full bg-cyan-500"></span> AI
                  </a>
                  <a routerLink="/category/frontend" (click)="categoriesOpen.set(false)"
                     class="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground hover:bg-accent">
                    <span class="h-2 w-2 rounded-full bg-blue-500"></span> Frontend
                  </a>
                  <a routerLink="/category/backend" (click)="categoriesOpen.set(false)"
                     class="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground hover:bg-accent">
                    <span class="h-2 w-2 rounded-full bg-green-500"></span> Backend
                  </a>
                  <a routerLink="/category/devops" (click)="categoriesOpen.set(false)"
                     class="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground hover:bg-accent">
                    <span class="h-2 w-2 rounded-full bg-orange-500"></span> DevOps
                  </a>
                  <a routerLink="/category/tutorials" (click)="categoriesOpen.set(false)"
                     class="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground hover:bg-accent">
                    <span class="h-2 w-2 rounded-full bg-purple-500"></span> Tutorials
                  </a>
                  <a routerLink="/category/open-source" (click)="categoriesOpen.set(false)"
                     class="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground hover:bg-accent">
                    <span class="h-2 w-2 rounded-full bg-pink-500"></span> Open Source
                  </a>
                </div>
              }
            </div>
          </nav>

          <!-- Search button -->
          <button (click)="openSearch()"
                  aria-label="Open search"
                  class="inline-flex min-h-[44px] min-w-[44px] touch-manipulation items-center justify-center gap-2 rounded-md border border-border bg-muted/50 px-3 py-2 text-sm text-muted-foreground transition-all duration-200 hover:bg-accent hover:text-foreground hover:border-accent">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
            </svg>
            <span class="hidden sm:inline">Search</span>
            <kbd class="hidden md:inline-flex items-center rounded border border-border bg-background px-1 py-0.5 text-[10px] font-medium">
              Ctrl+K
            </kbd>
          </button>

          <!-- Theme toggle -->
          <button (click)="toggleTheme()"
                  class="inline-flex min-h-[44px] min-w-[44px] touch-manipulation items-center justify-center rounded-md p-2 text-muted-foreground transition-all duration-200 hover:bg-accent hover:text-accent-foreground"
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
                  class="lg:hidden inline-flex min-h-[44px] min-w-[44px] touch-manipulation items-center justify-center rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                  [attr.aria-label]="mobileMenuOpen() ? 'Close menu' : 'Open menu'"
                  aria-controls="mobile-navigation"
                  [attr.aria-expanded]="mobileMenuOpen()">
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
        <div class="lg:hidden border-t border-border bg-background/98 backdrop-blur animate-in slide-in-from-top-2 duration-200">
          <nav id="mobile-navigation" class="container max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col gap-0.5 max-h-[calc(100vh-4rem)] overflow-y-auto">
            <a routerLink="/" (click)="mobileMenuOpen.set(false)" routerLinkActive="bg-accent text-foreground" [routerLinkActiveOptions]="{ exact: true }"
               class="flex min-h-[44px] touch-manipulation items-center gap-3 rounded-lg px-4 py-3 text-base font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-accent">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              Home
            </a>
            <a routerLink="/blog" (click)="mobileMenuOpen.set(false)" routerLinkActive="bg-accent text-foreground"
               class="flex min-h-[44px] touch-manipulation items-center gap-3 rounded-lg px-4 py-3 text-base font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-accent">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/></svg>
              Blog
            </a>
            <a routerLink="/courses" (click)="mobileMenuOpen.set(false)" routerLinkActive="bg-accent text-foreground"
               class="flex min-h-[44px] touch-manipulation items-center gap-3 rounded-lg px-4 py-3 text-base font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-accent">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
              Courses
              <span class="ml-auto inline-flex items-center rounded-full bg-green-500 px-2 py-0.5 text-[10px] font-bold leading-none text-white">FREE</span>
            </a>
            <a routerLink="/games" (click)="mobileMenuOpen.set(false)" routerLinkActive="bg-accent text-foreground"
               class="flex min-h-[44px] touch-manipulation items-center gap-3 rounded-lg px-4 py-3 text-base font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-accent">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="6" x2="10" y1="11" y2="11"/><line x1="8" x2="8" y1="9" y2="13"/><line x1="15" x2="15.01" y1="12" y2="12"/><line x1="18" x2="18.01" y1="10" y2="10"/><path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258A4 4 0 0 0 17.32 5z"/></svg>
              Games
            </a>
            <a routerLink="/cheatsheets" (click)="mobileMenuOpen.set(false)" routerLinkActive="bg-accent text-foreground"
               class="flex min-h-[44px] touch-manipulation items-center gap-3 rounded-lg px-4 py-3 text-base font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-accent">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
              Cheatsheets
            </a>
            <a routerLink="/about" (click)="mobileMenuOpen.set(false)" routerLinkActive="bg-accent text-foreground"
               class="flex min-h-[44px] touch-manipulation items-center gap-3 rounded-lg px-4 py-3 text-base font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-accent">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
              About
            </a>
            <a routerLink="/consultation" (click)="mobileMenuOpen.set(false)" routerLinkActive="bg-accent text-foreground"
               class="flex min-h-[44px] touch-manipulation items-center gap-3 rounded-lg px-4 py-3 text-base font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-accent">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              Hire Me
            </a>
            <div class="border-t border-border my-3"></div>
            <p class="px-4 py-1 text-xs font-bold text-muted-foreground uppercase tracking-wider">Browse Categories</p>
            <a routerLink="/category/ai" (click)="mobileMenuOpen.set(false)"
               class="flex min-h-[44px] touch-manipulation items-center gap-3 rounded-lg px-4 py-3 text-base text-muted-foreground transition-colors hover:text-foreground hover:bg-accent">
              <span class="h-2 w-2 rounded-full bg-cyan-500"></span> AI
            </a>
            <a routerLink="/category/frontend" (click)="mobileMenuOpen.set(false)"
               class="flex min-h-[44px] touch-manipulation items-center gap-3 rounded-lg px-4 py-3 text-base text-muted-foreground transition-colors hover:text-foreground hover:bg-accent">
              <span class="h-2 w-2 rounded-full bg-blue-500"></span> Frontend
            </a>
            <a routerLink="/category/backend" (click)="mobileMenuOpen.set(false)"
               class="flex min-h-[44px] touch-manipulation items-center gap-3 rounded-lg px-4 py-3 text-base text-muted-foreground transition-colors hover:text-foreground hover:bg-accent">
              <span class="h-2 w-2 rounded-full bg-green-500"></span> Backend
            </a>
            <a routerLink="/category/devops" (click)="mobileMenuOpen.set(false)"
               class="flex min-h-[44px] touch-manipulation items-center gap-3 rounded-lg px-4 py-3 text-base text-muted-foreground transition-colors hover:text-foreground hover:bg-accent">
              <span class="h-2 w-2 rounded-full bg-orange-500"></span> DevOps
            </a>
            <a routerLink="/category/tutorials" (click)="mobileMenuOpen.set(false)"
               class="flex min-h-[44px] touch-manipulation items-center gap-3 rounded-lg px-4 py-3 text-base text-muted-foreground transition-colors hover:text-foreground hover:bg-accent">
              <span class="h-2 w-2 rounded-full bg-purple-500"></span> Tutorials
            </a>
            <a routerLink="/category/open-source" (click)="mobileMenuOpen.set(false)"
               class="flex min-h-[44px] touch-manipulation items-center gap-3 rounded-lg px-4 py-3 text-base text-muted-foreground transition-colors hover:text-foreground hover:bg-accent">
              <span class="h-2 w-2 rounded-full bg-pink-500"></span> Open Source
            </a>
          </nav>
        </div>
      }
    </header>

    <app-search />
  `,
})
export class HeaderComponent {
  mobileMenuOpen = signal(false);
  categoriesOpen = signal(false);
  isDark = signal(typeof document !== 'undefined' && document.documentElement.classList.contains('dark'));
  searchComponent = viewChild(SearchComponent);

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
}
