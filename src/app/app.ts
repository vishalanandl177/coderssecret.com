import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, DestroyRef, ElementRef, HostListener, inject, OnInit, PLATFORM_ID, signal, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header';
import { FooterComponent } from './components/footer/footer';
import { AnalyticsService } from './services/analytics.service';

type RouteTransitionPattern = 'top-level' | 'forward' | 'back' | 'lateral' | 'slides';
type RouteInteractionSource = 'unknown' | 'nav' | 'card' | 'filter' | 'toc' | 'action';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  template: `
    <span #backToTopSentinel
          class="pointer-events-none absolute left-0 top-0 h-px w-px"
          aria-hidden="true"></span>
    <div class="md3-app-shell flex min-h-screen flex-col bg-background text-foreground"
         [class.md3-app-shell-slides]="isSlideRoute()">
      @if (!isSlideRoute()) {
        <app-header />
      }
      <main id="main-content" class="flex-1 min-h-screen overflow-x-clip">
        <router-outlet />
      </main>
      @if (!isSlideRoute()) {
        <app-footer />
      }
    </div>

    <!-- Back to top button -->
    @if (showBackToTop() && !isSlideRoute()) {
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

    .md3-app-shell {
      transition: padding-left var(--md-sys-motion-duration-medium-2) var(--md-sys-motion-easing-emphasized-decelerate);
    }

    @media (min-width: 1024px) {
      .md3-app-shell:not(.md3-app-shell-slides) {
        padding-left: 5.5rem;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .md3-app-shell {
        transition: none;
      }
    }
  `,
})
export class App implements OnInit, AfterViewInit {
  private analytics = inject(AnalyticsService);
  private destroyRef = inject(DestroyRef);
  private document = inject(DOCUMENT);
  private platformId = inject(PLATFORM_ID);
  private router = inject(Router);

  private lastNavigationUrl = '/';
  private lastInteractionSource: RouteInteractionSource = 'unknown';
  private routeTransitionTimer: number | undefined;
  private interactionCleanupTimer: number | undefined;
  private backToTopObserver: IntersectionObserver | undefined;
  private backToTopFallbackFrame: number | undefined;
  private removeBackToTopFallback: (() => void) | undefined;
  private readonly backToTopSentinel = viewChild<ElementRef<HTMLElement>>('backToTopSentinel');
  private readonly transitionClasses = [
    'cs-transition-top-level',
    'cs-transition-forward',
    'cs-transition-back',
    'cs-transition-lateral',
    'cs-transition-slides',
    'cs-transition-disabled',
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
  isSlideRoute = signal(false);

  ngOnInit() {
    this.analytics.monitorCoreWebVitals();
    this.isSlideRoute.set(this.isSlideUrl(this.router.url || '/'));

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.lastNavigationUrl = this.router.url || this.document.defaultView?.location.pathname || '/';
    this.setViewTransitionCapability();
    this.router.events
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((event) => {
        if (event instanceof NavigationStart) {
          this.isSlideRoute.set(this.isSlideUrl(event.url));
          this.prepareRouteTransition(event.url);
          return;
        }

        if (event instanceof NavigationEnd) {
          this.lastNavigationUrl = event.urlAfterRedirects || event.url || this.lastNavigationUrl;
          this.isSlideRoute.set(this.isSlideUrl(this.lastNavigationUrl));
          this.scheduleRouteTransitionClear(750);
          return;
        }

        if (event instanceof NavigationCancel || event instanceof NavigationError) {
          this.isSlideRoute.set(this.isSlideUrl(this.lastNavigationUrl));
          this.clearRouteTransitionClasses();
          this.clearInteractionSource();
        }
      });

    this.destroyRef.onDestroy(() => this.teardownBackToTopVisibility());
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.observeBackToTopVisibility();
    }
  }

  @HostListener('document:pointerdown', ['$event'])
  onDocumentPointerDown(event: PointerEvent) {
    this.trackRouteInteraction(event);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    // Pointer activation is captured earlier by pointerdown so NavigationStart
    // sees the interaction source. Keep click only for keyboard/synthetic links.
    if (event.detail !== 0) return;
    this.trackRouteInteraction(event);
  }

  scrollToTop() {
    const win = this.document.defaultView;
    const reduceMotion = win?.matchMedia('(prefers-reduced-motion: reduce)').matches ?? false;
    win?.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  }

  private trackRouteInteraction(event: MouseEvent | PointerEvent) {
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
      this.setInteractionSource('toc');
      return;
    }

    this.setInteractionSource(this.classifyInteractionSource(anchor));
  }

  private prepareRouteTransition(nextUrl: string) {
    const root = this.document.documentElement;
    const skipRouteTransition = this.isBlogListToDetail(this.lastNavigationUrl, nextUrl);

    this.clearRouteTransitionClasses();

    if (skipRouteTransition) {
      this.clearInteractionSource();
      root.classList.add('cs-transition-disabled');
      this.scheduleRouteTransitionClear(750);
      return;
    }

    const pattern = this.getRouteTransitionPattern(this.lastNavigationUrl, nextUrl);

    root.classList.add(`cs-transition-${pattern}`);
    root.dataset['csTransition'] = pattern;

    if (this.lastInteractionSource !== 'unknown') {
      root.classList.add(`cs-transition-from-${this.lastInteractionSource}`);
      root.dataset['csInteraction'] = this.lastInteractionSource;
    }

    this.scheduleRouteTransitionClear(2400);
  }

  private setViewTransitionCapability() {
    const win = this.document.defaultView;
    const hasViewTransitionApi = typeof win?.document.startViewTransition === 'function';
    const reduceMotion = win?.matchMedia('(prefers-reduced-motion: reduce)').matches ?? false;
    const useNativeViewTransitions = hasViewTransitionApi && !reduceMotion;

    this.document.documentElement.classList.toggle('cs-view-transition-api', hasViewTransitionApi);
    this.document.documentElement.classList.toggle('cs-native-view-transition', useNativeViewTransitions);
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

  private setInteractionSource(source: RouteInteractionSource) {
    const win = this.document.defaultView;
    const root = this.document.documentElement;

    this.clearInteractionSource(false);
    this.lastInteractionSource = source;

    if (source !== 'unknown') {
      root.classList.add(`cs-transition-from-${source}`);
      root.dataset['csInteraction'] = source;
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
        return 'forward';
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

  private isSlideUrl(url: string): boolean {
    const path = this.toPath(url);
    const segments = this.toSegments(path);
    return segments[0] === 'slides' || path.endsWith('/slides');
  }

  private isBlogListToDetail(fromUrl: string, toUrl: string): boolean {
    const fromSegments = this.toSegments(this.toPath(fromUrl));
    const toSegments = this.toSegments(this.toPath(toUrl));
    return fromSegments[0] === 'blog'
      && fromSegments.length <= 1
      && toSegments[0] === 'blog'
      && toSegments.length > 1;
  }

  private observeBackToTopVisibility() {
    const win = this.document.defaultView;
    const sentinel = this.backToTopSentinel()?.nativeElement;
    if (!win || !sentinel) return;

    this.showBackToTop.set(win.scrollY > 400);
    const Observer = (win as unknown as {
      IntersectionObserver?: typeof IntersectionObserver;
    }).IntersectionObserver;
    if (typeof Observer === 'function') {
      this.backToTopObserver = new Observer(([entry]) => {
        this.showBackToTop.set(!entry.isIntersecting);
      }, { rootMargin: '400px 0px 0px 0px' });
      this.backToTopObserver.observe(sentinel);
      return;
    }

    const refresh = () => {
      if (this.backToTopFallbackFrame !== undefined) return;
      this.backToTopFallbackFrame = win.requestAnimationFrame(() => {
        this.backToTopFallbackFrame = undefined;
        this.showBackToTop.set(win.scrollY > 400);
      });
    };
    win.addEventListener('scroll', refresh, { passive: true });
    this.removeBackToTopFallback = () => win.removeEventListener('scroll', refresh);
  }

  private teardownBackToTopVisibility() {
    const win = this.document.defaultView;
    this.backToTopObserver?.disconnect();
    this.backToTopObserver = undefined;
    this.removeBackToTopFallback?.();
    this.removeBackToTopFallback = undefined;
    if (win && this.backToTopFallbackFrame !== undefined) {
      win.cancelAnimationFrame(this.backToTopFallbackFrame);
      this.backToTopFallbackFrame = undefined;
    }
  }
}
