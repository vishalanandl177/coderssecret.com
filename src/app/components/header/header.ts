import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <header class="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div class="container flex h-16 max-w-4xl items-center justify-between mx-auto px-6">
        <a routerLink="/" class="flex items-center gap-2 font-bold text-xl tracking-tight">
          <span class="text-primary">Coders</span><span class="text-muted-foreground">Secret</span>
        </a>

        <div class="flex items-center gap-4">
          <nav class="hidden md:flex items-center gap-6 text-sm font-medium">
            <a routerLink="/" routerLinkActive="text-foreground" [routerLinkActiveOptions]="{ exact: true }"
               class="text-muted-foreground transition-colors hover:text-foreground">Home</a>
            <a routerLink="/blog" routerLinkActive="text-foreground"
               class="text-muted-foreground transition-colors hover:text-foreground">Blog</a>
          </nav>

          <button (click)="toggleTheme()"
                  class="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                  [attr.aria-label]="isDark() ? 'Switch to light mode' : 'Switch to dark mode'">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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

          <button (click)="mobileMenuOpen.set(!mobileMenuOpen())"
                  class="md:hidden inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
        <div class="md:hidden border-t border-border">
          <nav class="container max-w-4xl mx-auto px-6 py-4 flex flex-col gap-3">
            <a routerLink="/" (click)="mobileMenuOpen.set(false)"
               class="text-muted-foreground transition-colors hover:text-foreground">Home</a>
            <a routerLink="/blog" (click)="mobileMenuOpen.set(false)"
               class="text-muted-foreground transition-colors hover:text-foreground">Blog</a>
          </nav>
        </div>
      }
    </header>
  `,
})
export class HeaderComponent {
  mobileMenuOpen = signal(false);
  isDark = signal(typeof document !== 'undefined' && document.documentElement.classList.contains('dark'));

  toggleTheme() {
    const dark = !this.isDark();
    this.isDark.set(dark);
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }
}
