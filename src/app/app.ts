import { Component, signal, HostListener, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { HeaderComponent } from './components/header/header';
import { FooterComponent } from './components/footer/footer';
import { LocaleService } from './services/locale.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent, TranslocoPipe],
  template: `
    <a href="#main-content"
       class="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-primary-foreground focus:shadow-lg">
      {{ 'nav.skipToContent' | transloco }}
    </a>
    <div class="flex min-h-screen flex-col">
      <app-header />
      <main id="main-content" class="flex-1">
        <router-outlet />
      </main>
      <app-footer />
    </div>

    <!-- Back to top button -->
    @if (showBackToTop()) {
      <button (click)="scrollToTop()"
              aria-label="Back to top"
              class="fixed bottom-6 right-6 z-50 inline-flex items-center justify-center h-10 w-10 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 active:scale-95 animate-in fade-in slide-in-from-bottom-4 duration-300">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="m18 15-6-6-6 6"/>
        </svg>
      </button>
    }
  `,
  styles: `
    :host {
      display: block;
    }
  `,
})
export class App {
  private locale = inject(LocaleService);
  showBackToTop = signal(false);

  constructor() {
    this.locale.setLocale(this.locale.detectLocale());
  }

  @HostListener('window:scroll')
  onScroll() {
    this.showBackToTop.set(window.scrollY > 400);
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
