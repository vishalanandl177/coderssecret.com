import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Component, DestroyRef, HostListener, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header';
import { FooterComponent } from './components/footer/footer';
import { AnalyticsService } from './services/analytics.service';

type RouteTransitionPattern = 'top-level' | 'container' | 'forward' | 'back' | 'lateral' | 'slides';
type RouteInteractionSource = 'unknown' | 'nav' | 'card' | 'filter' | 'toc' | 'action';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  template: `
    <a href="#main-content"
       class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-primary focus:px-5 focus:py-3 focus:text-sm focus:font-bold focus:text-primary-foreground focus:shadow-[var(--md-sys-elevation-2)]">
      Skip to main content
    </a>
    <div class="flex min-h-screen flex-col bg-background text-foreground lg:pl-[5.5rem]">
      <app-header />
      <main id="main-content" class="flex-1 min-h-screen overflow-x-clip">
        <router-outlet />
      </main>
      <app-footer />
    </div>

    <!-- Back to top button -->
    @if (showBackToTop()) {
      <button (click)="scrollToTop()"
              aria-label="Back to top"
              class="md3-motion-pressable fixed bottom-5 right-5 z-50 inline-flex h-12 w-12 touch-manipulation items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[var(--md-sys-elevation-2)] hover:shadow-[var(--md-sys-elevation-3)] sm:bottom-6 sm:right-6">
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
export class App implements OnInit {
  private analytics = inject(AnalyticsService);
  private destroyRef = inject(DestroyRef);
  private document = inject(DOCUMENT);
  private platformId = inject(PLATFORM_ID);
  private router = inject(Router);

  private lastNavigationUrl = '/';
  private lastInteractionSource: RouteInteractionSource = 'unknown';
  private activeSourceElement: HTMLElement | undefined;
  private routeTransitionTimer: number | undefined;
  private interactionCleanupTimer: number | undefined;
  private readonly transitionClasses = [
    'cs-transition-top-level',
    'cs-transition-container',
    'cs-transition-forward',
    'cs-transition-back',
    'cs-transition-lateral',
    'cs-transition-slides',
  ];
  private readonly interactionClasses = [
    'cs-transition-from-nav',
    'cs-transition-from-card',
    'cs-transition-from-filter',
    'cs-transition-from-toc',
    'cs-transition-from-action',
  ];
  private readonly sourceCardSelector = [
    'app-blog-list .md3-blog-featured-card',
    'app-blog-list .md3-blog-supporting-card',
    'app-blog-list .md3-blog-article-card',
    'app-blog-post .md3-article-related-card',
    'app-courses .md3-card',
    'app-games-hub .md3-card',
    'app-cheatsheets-hub .md3-card',
    '.md3-card-elevated',
    '.md3-card',
  ].join(',');

  showBackToTop = signal(false);

  ngOnInit() {
    this.analytics.monitorCoreWebVitals();

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.lastNavigationUrl = this.router.url || this.document.defaultView?.location.pathname || '/';
    this.setViewTransitionCapability();
    this.router.events
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((event) => {
        if (event instanceof NavigationStart) {
          this.prepareRouteTransition(event.url);
          return;
        }

        if (event instanceof NavigationEnd) {
          this.lastNavigationUrl = event.urlAfterRedirects || event.url || this.lastNavigationUrl;
          this.scheduleRouteTransitionClear(750);
          return;
        }

        if (event instanceof NavigationCancel || event instanceof NavigationError) {
          this.clearRouteTransitionClasses();
          this.clearInteractionSource();
        }
      });
  }

  @HostListener('window:scroll')
  onScroll() {
    this.showBackToTop.set(window.scrollY > 400);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!isPlatformBrowser(this.platformId) || event.defaultPrevented || event.button !== 0) {
      return;
    }

    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }

    const target = event.target instanceof Element ? event.target : null;
    const anchor = target?.closest('a[href]') as HTMLAnchorElement | null;
    if (!anchor || anchor.target === '_blank' || anchor.hasAttribute('download')) {
      return;
    }

    const href = anchor.getAttribute('href') ?? '';
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) {
      return;
    }

    const win = this.document.defaultView;
    if (!win) {
      return;
    }

    let destination: URL;
    try {
      destination = new URL(anchor.href || href, win.location.origin);
    } catch {
      return;
    }

    if (destination.origin !== win.location.origin) {
      return;
    }

    if (destination.pathname === win.location.pathname && destination.hash) {
      this.setInteractionSource('toc', anchor);
      return;
    }

    this.setInteractionSource(this.classifyInteractionSource(anchor), anchor);
  }

  scrollToTop() {
    const win = this.document.defaultView;
    const reduceMotion = win?.matchMedia('(prefers-reduced-motion: reduce)').matches ?? false;
    win?.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  }

  private prepareRouteTransition(nextUrl: string) {
    const win = this.document.defaultView;
    const root = this.document.documentElement;
    const pattern = this.getRouteTransitionPattern(this.lastNavigationUrl, nextUrl);

    this.clearRouteTransitionClasses();
    root.classList.add(`cs-transition-${pattern}`);
    root.dataset['csTransition'] = pattern;

    if (this.lastInteractionSource !== 'unknown') {
      root.classList.add(`cs-transition-from-${this.lastInteractionSource}`);
      root.dataset['csInteraction'] = this.lastInteractionSource;
    }

    this.scheduleRouteTransitionClear(2400);
  }

  private setViewTransitionCapability() {
    const hasViewTransitionApi = typeof this.document.defaultView?.document.startViewTransition === 'function';
    this.document.documentElement.classList.toggle('cs-view-transition-api', hasViewTransitionApi);
  }

  private clearRouteTransitionClasses(clearTimer = true) {
    const win = this.document.defaultView;
    const root = this.document.documentElement;

    root.classList.remove(...this.transitionClasses);
    delete root.dataset['csTransition'];

    if (clearTimer && win && this.routeTransitionTimer !== undefined) {
      win.clearTimeout(this.routeTransitionTimer);
      this.routeTransitionTimer = undefined;
    }
  }

  private scheduleRouteTransitionClear(delay: number) {
    const win = this.document.defaultView;
    if (!win) return;

    if (this.routeTransitionTimer !== undefined) {
      win.clearTimeout(this.routeTransitionTimer);
    }

    this.routeTransitionTimer = win.setTimeout(() => {
      this.clearRouteTransitionClasses(false);
      this.clearInteractionSource();
    }, delay);
  }

  private classifyInteractionSource(anchor: HTMLAnchorElement): RouteInteractionSource {
    if (anchor.closest('app-header') || anchor.closest('.md3-top-app-bar')) {
      return 'nav';
    }

    if (anchor.closest('.md3-article-toc') || anchor.closest('.md3-article-toc-mobile')) {
      return 'toc';
    }

    if (anchor.closest('.md3-blog-topic-stack')) {
      return 'filter';
    }

    if (anchor.closest(this.sourceCardSelector)) {
      return 'card';
    }

    if (
      anchor.matches('.md3-button-filled, .md3-button-tonal, .md3-button-outlined, .md3-blog-slide-link, .md3-article-slide-button')
    ) {
      return 'action';
    }

    return 'unknown';
  }

  private setInteractionSource(source: RouteInteractionSource, anchor?: HTMLAnchorElement) {
    const win = this.document.defaultView;
    const root = this.document.documentElement;

    this.clearInteractionSource(false);
    this.lastInteractionSource = source;

    if (source !== 'unknown') {
      root.classList.add(`cs-transition-from-${source}`);
      root.dataset['csInteraction'] = source;
    }

    if (source === 'card' && anchor) {
      const sourceElement = anchor.closest(this.sourceCardSelector) as HTMLElement | null;
      sourceElement?.classList.add('cs-motion-source-pressed');
      this.activeSourceElement = sourceElement ?? undefined;
    }

    if (win) {
      this.interactionCleanupTimer = win.setTimeout(() => {
        this.clearInteractionSource();
      }, 900);
    }
  }

  private clearInteractionSource(clearTimer = true) {
    const win = this.document.defaultView;
    const root = this.document.documentElement;

    root.classList.remove(...this.interactionClasses);
    delete root.dataset['csInteraction'];
    this.lastInteractionSource = 'unknown';

    this.activeSourceElement?.classList.remove('cs-motion-source-pressed');
    this.activeSourceElement = undefined;

    if (clearTimer && win && this.interactionCleanupTimer !== undefined) {
      win.clearTimeout(this.interactionCleanupTimer);
      this.interactionCleanupTimer = undefined;
    }
  }

  private getRouteTransitionPattern(fromUrl: string, toUrl: string): RouteTransitionPattern {
    const fromPath = this.toPath(fromUrl);
    const toPath = this.toPath(toUrl);
    const fromSegments = this.toSegments(fromPath);
    const toSegments = this.toSegments(toPath);

    if (fromPath === toPath && fromUrl !== toUrl) {
      return 'lateral';
    }

    if (toSegments[0] === 'slides' || toPath.endsWith('/slides')) {
      return 'slides';
    }

    if (fromSegments[0] === 'slides' || fromPath.endsWith('/slides')) {
      return 'back';
    }

    if (fromSegments[0] === 'blog' && toSegments[0] === 'blog') {
      if (fromSegments.length <= 1 && toSegments.length > 1) {
        return 'container';
      }

      if (fromSegments.length > 1 && toSegments.length <= 1) {
        return 'back';
      }

      return fromPath === toPath ? 'top-level' : 'lateral';
    }

    if (fromSegments[0] === toSegments[0] && fromSegments[0]) {
      if (toSegments.length > fromSegments.length) {
        return 'forward';
      }

      if (toSegments.length < fromSegments.length) {
        return 'back';
      }

      return fromPath === toPath ? 'top-level' : 'lateral';
    }

    return 'top-level';
  }

  private toPath(url: string): string {
    const win = this.document.defaultView;

    try {
      const parsed = new URL(url, win?.location.origin ?? 'https://coderssecret.com');
      return this.normalizePath(parsed.pathname);
    } catch {
      return this.normalizePath(url.split(/[?#]/)[0] || '/');
    }
  }

  private normalizePath(path: string): string {
    const normalized = `/${path.replace(/^\/+/, '')}`.replace(/\/+$/, '');
    return normalized === '' ? '/' : normalized;
  }

  private toSegments(path: string): string[] {
    return path.split('/').filter(Boolean);
  }
}
