import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Component, DestroyRef, HostListener, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header';
import { FooterComponent } from './components/footer/footer';
import { AnalyticsService } from './services/analytics.service';

type RouteTransitionPattern = 'top-level' | 'container' | 'forward' | 'back' | 'lateral' | 'slides';
type RouteInteractionSource = 'unknown' | 'nav' | 'card' | 'filter' | 'toc' | 'action';
type ActiveContainerTransform = {
  clone: HTMLElement;
  sourceRect: DOMRect;
  animation?: Animation;
  cleanupTimer?: number;
};

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  template: `
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
  private activeContainerTransform: ActiveContainerTransform | undefined;
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
          this.finishContainerTransform();
          this.scheduleRouteTransitionClear(750);
          return;
        }

    if (event instanceof NavigationCancel || event instanceof NavigationError) {
      this.isSlideRoute.set(this.isSlideUrl(this.lastNavigationUrl));
      this.clearRouteTransitionClasses();
      this.clearInteractionSource();
      this.clearContainerTransform();
    }
      });
  }

  @HostListener('window:scroll')
  onScroll() {
    this.showBackToTop.set(window.scrollY > 400);
  }

  @HostListener('document:pointerdown', ['$event'])
  onDocumentPointerDown(event: PointerEvent) {
    this.trackRouteInteraction(event);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
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
      this.setInteractionSource('toc', anchor);
      return;
    }

    this.setInteractionSource(this.classifyInteractionSource(anchor), anchor);
  }

  private prepareRouteTransition(nextUrl: string) {
    const win = this.document.defaultView;
    const root = this.document.documentElement;
    const pattern = this.getRouteTransitionPattern(this.lastNavigationUrl, nextUrl);
    const shouldUseCardTransform = pattern === 'container'
      && this.lastInteractionSource === 'card'
      && !!this.activeSourceElement
      && this.isBlogListToDetail(this.lastNavigationUrl, nextUrl);

    this.clearRouteTransitionClasses();
    root.classList.add(`cs-transition-${pattern}`);
    root.dataset['csTransition'] = pattern;

    if (this.lastInteractionSource !== 'unknown') {
      root.classList.add(`cs-transition-from-${this.lastInteractionSource}`);
      root.dataset['csInteraction'] = this.lastInteractionSource;
    }

    if (shouldUseCardTransform && this.activeSourceElement) {
      this.startContainerTransform(this.activeSourceElement);
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

  private startContainerTransform(sourceElement: HTMLElement) {
    const win = this.document.defaultView;
    if (!win || win.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const sourceRect = sourceElement.getBoundingClientRect();
    if (sourceRect.width < 1 || sourceRect.height < 1) {
      return;
    }

    this.clearContainerTransform();

    const clone = sourceElement.cloneNode(true) as HTMLElement;
    clone.querySelectorAll('[id]').forEach(element => element.removeAttribute('id'));
    clone.setAttribute('aria-hidden', 'true');
    clone.classList.add('md3-route-container-clone');
    clone.style.setProperty('--md3-route-container-left', `${sourceRect.left}px`);
    clone.style.setProperty('--md3-route-container-top', `${sourceRect.top}px`);
    clone.style.setProperty('--md3-route-container-width', `${sourceRect.width}px`);
    clone.style.setProperty('--md3-route-container-height', `${sourceRect.height}px`);

    this.document.body.appendChild(clone);
    this.document.documentElement.classList.add('cs-custom-card-transform-running');
    this.document.documentElement.dataset['csCustomCardTransform'] = 'pending';
    this.activeContainerTransform = { clone, sourceRect };
  }

  private finishContainerTransform() {
    const win = this.document.defaultView;
    const transform = this.activeContainerTransform;
    if (!win || !transform) {
      this.clearContainerTransform();
      return;
    }

    win.scrollTo({ top: 0, left: 0, behavior: 'auto' });

    win.requestAnimationFrame(() => {
      win.requestAnimationFrame(() => {
        const target = this.document.querySelector<HTMLElement>('app-blog-post .md3-article-hero');
        const currentTransform = this.activeContainerTransform;
        if (!target || !currentTransform) {
          this.clearContainerTransform();
          return;
        }

        const targetRect = target.getBoundingClientRect();
        const dx = targetRect.left - currentTransform.sourceRect.left;
        const dy = targetRect.top - currentTransform.sourceRect.top;
        const scaleX = targetRect.width / currentTransform.sourceRect.width;
        const scaleY = Math.min(targetRect.height / currentTransform.sourceRect.height, 2.75);
        const duration = 560;
        const easing = 'cubic-bezier(0.2, 0, 0, 1)';

        target.classList.add('md3-route-container-target');
        target.animate(
          [
            { opacity: 0.08, transform: 'scale(0.985)' },
            { opacity: 0.08, transform: 'scale(0.985)', offset: 0.42 },
            { opacity: 1, transform: 'scale(1)' },
          ],
          { duration, easing, fill: 'both' }
        );

        currentTransform.animation = currentTransform.clone.animate(
          [
            {
              opacity: 1,
              transform: 'translate3d(0, 0, 0) scale(1, 1)',
              borderRadius: 'var(--md-sys-shape-corner-xl)',
            },
            {
              opacity: 0.96,
              transform: `translate3d(${dx}px, ${dy}px, 0) scale(${scaleX}, ${scaleY})`,
              borderRadius: 'var(--md-sys-shape-corner-lg)',
              offset: 0.76,
            },
            {
              opacity: 0,
              transform: `translate3d(${dx}px, ${dy}px, 0) scale(${scaleX}, ${scaleY})`,
              borderRadius: 'var(--md-sys-shape-corner-lg)',
            },
          ],
          { duration, easing, fill: 'both' }
        );

        currentTransform.animation.onfinish = () => {
          target.classList.remove('md3-route-container-target');
          this.clearContainerTransform();
        };

        currentTransform.cleanupTimer = win.setTimeout(() => {
          target.classList.remove('md3-route-container-target');
          this.clearContainerTransform();
        }, duration + 180);
      });
    });
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
      if (this.shouldUseSelectedCardTransition(anchor)) {
        sourceElement?.style.setProperty('view-transition-name', 'cs-selected-card');
        root.dataset['csCustomCardTransform'] = 'pending';
      }
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
    this.activeSourceElement?.style.removeProperty('view-transition-name');
    this.activeSourceElement = undefined;

    if (!this.activeContainerTransform) {
      delete root.dataset['csCustomCardTransform'];
      root.classList.remove('cs-custom-card-transform-running');
    }

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

  private shouldUseSelectedCardTransition(anchor: HTMLAnchorElement): boolean {
    const win = this.document.defaultView;
    if (!win) {
      return false;
    }

    let destination: URL;
    try {
      destination = new URL(anchor.href, win.location.origin);
    } catch {
      return false;
    }

    if (destination.origin !== win.location.origin) {
      return false;
    }

    const fromSegments = this.toSegments(this.toPath(win.location.pathname));
    const toSegments = this.toSegments(this.toPath(destination.pathname));

    return this.isBlogListToDetail(win.location.pathname, destination.pathname);
  }

  private clearContainerTransform() {
    const win = this.document.defaultView;
    const transform = this.activeContainerTransform;

    if (transform?.cleanupTimer !== undefined && win) {
      win.clearTimeout(transform.cleanupTimer);
    }

    transform?.animation?.cancel();
    transform?.clone.remove();
    this.activeContainerTransform = undefined;
    this.document.documentElement.classList.remove('cs-custom-card-transform-running');
    delete this.document.documentElement.dataset['csCustomCardTransform'];
  }
}
