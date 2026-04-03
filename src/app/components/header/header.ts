import { Component, signal, viewChild } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SearchComponent } from '../search/search';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, SearchComponent],
  template: `
    <header class="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-300">
      <div class="container flex h-16 max-w-5xl items-center justify-between mx-auto px-6">
        <a routerLink="/" class="flex items-center gap-2 font-bold text-xl tracking-tight transition-opacity duration-200 hover:opacity-80">
          <span class="text-primary">Coders</span><span class="text-muted-foreground">Secret</span>
        </a>

        <div class="flex items-center gap-1 md:gap-2">
          <nav class="hidden md:flex items-center gap-1 text-sm font-medium">
            <a routerLink="/" routerLinkActive="text-foreground bg-accent" [routerLinkActiveOptions]="{ exact: true }"
               class="rounded-md px-3 py-2 text-muted-foreground transition-all duration-200 hover:text-foreground hover:bg-accent/50">
              Home
            </a>
            <a routerLink="/blog" routerLinkActive="text-foreground bg-accent"
               class="rounded-md px-3 py-2 text-muted-foreground transition-all duration-200 hover:text-foreground hover:bg-accent/50">
              Blog
            </a>

            <!-- Categories dropdown -->
            <div class="relative">
              <button (click)="categoriesOpen.set(!categoriesOpen())"
                      (blur)="closeCategoriesDelayed()"
                      class="flex items-center gap-1 rounded-md px-3 py-2 text-sm text-muted-foreground transition-all duration-200 hover:text-foreground hover:bg-accent/50">
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
                  class="inline-flex items-center gap-2 rounded-md border border-border bg-muted/50 px-3 py-1.5 text-sm text-muted-foreground transition-all duration-200 hover:bg-accent hover:text-foreground hover:border-accent">
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
               class="rounded-md px-3 py-2.5 text-muted-foreground transition-colors hover:text-foreground hover:bg-accent">Home</a>
            <a routerLink="/blog" (click)="mobileMenuOpen.set(false)"
               class="rounded-md px-3 py-2.5 text-muted-foreground transition-colors hover:text-foreground hover:bg-accent">Blog</a>
            <div class="border-t border-border my-2"></div>
            <p class="px-3 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Categories</p>
            <a routerLink="/category/frontend" (click)="mobileMenuOpen.set(false)"
               class="flex items-center gap-2 rounded-md px-3 py-2.5 text-muted-foreground transition-colors hover:text-foreground hover:bg-accent">
              <span class="h-2 w-2 rounded-full bg-blue-500"></span> Frontend
            </a>
            <a routerLink="/category/backend" (click)="mobileMenuOpen.set(false)"
               class="flex items-center gap-2 rounded-md px-3 py-2.5 text-muted-foreground transition-colors hover:text-foreground hover:bg-accent">
              <span class="h-2 w-2 rounded-full bg-green-500"></span> Backend
            </a>
            <a routerLink="/category/devops" (click)="mobileMenuOpen.set(false)"
               class="flex items-center gap-2 rounded-md px-3 py-2.5 text-muted-foreground transition-colors hover:text-foreground hover:bg-accent">
              <span class="h-2 w-2 rounded-full bg-orange-500"></span> DevOps
            </a>
            <a routerLink="/category/tutorials" (click)="mobileMenuOpen.set(false)"
               class="flex items-center gap-2 rounded-md px-3 py-2.5 text-muted-foreground transition-colors hover:text-foreground hover:bg-accent">
              <span class="h-2 w-2 rounded-full bg-purple-500"></span> Tutorials
            </a>
            <a routerLink="/category/open-source" (click)="mobileMenuOpen.set(false)"
               class="flex items-center gap-2 rounded-md px-3 py-2.5 text-muted-foreground transition-colors hover:text-foreground hover:bg-accent">
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
    const dark = !this.isDark();
    this.isDark.set(dark);
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }

  openSearch() {
    this.searchComponent()?.open();
  }

  closeCategoriesDelayed() {
    setTimeout(() => this.categoriesOpen.set(false), 150);
  }
}
