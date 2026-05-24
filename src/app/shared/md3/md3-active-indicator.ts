import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Directive, ElementRef, Input, NgZone, OnDestroy, PLATFORM_ID, Renderer2, inject } from '@angular/core';

@Directive({
  selector: '[appMd3ActiveIndicator]',
  standalone: true,
  host: {
    class: 'md3-active-indicator-host',
  },
})
export class Md3ActiveIndicatorDirective implements AfterViewInit, OnDestroy {
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly renderer = inject(Renderer2);
  private readonly zone = inject(NgZone);
  private readonly platformId = inject(PLATFORM_ID);
  private activeSelector = '[aria-current="page"], [aria-pressed="true"], .active';
  private indicator: HTMLElement | undefined;
  private frame = 0;
  private resizeObserver: ResizeObserver | undefined;
  private mutationObserver: MutationObserver | undefined;
  private unlistenClick: (() => void) | undefined;
  private unlistenFocus: (() => void) | undefined;

  @Input()
  set appMd3ActiveIndicator(selector: string | undefined) {
    if (selector?.trim()) {
      this.activeSelector = selector.trim();
      this.scheduleRefresh();
    }
  }

  @Input()
  set md3ActiveIndicatorActiveSelector(selector: string | undefined) {
    if (selector?.trim()) {
      this.activeSelector = selector.trim();
      this.scheduleRefresh();
    }
  }

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.zone.runOutsideAngular(() => {
      this.createIndicator();
      this.observeChanges();
      this.scheduleRefresh();
    });
  }

  ngOnDestroy() {
    if (this.frame) {
      cancelAnimationFrame(this.frame);
      this.frame = 0;
    }

    this.resizeObserver?.disconnect();
    this.mutationObserver?.disconnect();
    this.unlistenClick?.();
    this.unlistenFocus?.();
  }

  private createIndicator() {
    const host = this.elementRef.nativeElement;
    const indicator = this.renderer.createElement('span') as HTMLElement;
    this.renderer.addClass(indicator, 'md3-active-indicator');
    this.renderer.setAttribute(indicator, 'aria-hidden', 'true');
    this.renderer.insertBefore(host, indicator, host.firstChild);
    this.indicator = indicator;
  }

  private observeChanges() {
    const host = this.elementRef.nativeElement;

    this.resizeObserver = new ResizeObserver(() => this.scheduleRefresh());
    this.resizeObserver.observe(host);
    for (const child of Array.from(host.children)) {
      this.resizeObserver.observe(child);
    }

    this.mutationObserver = new MutationObserver(() => this.scheduleRefresh());
    this.mutationObserver.observe(host, {
      attributes: true,
      attributeFilter: ['class', 'aria-current', 'aria-pressed'],
      childList: true,
      subtree: true,
    });

    this.unlistenClick = this.renderer.listen(host, 'click', () => this.scheduleRefresh());
    this.unlistenFocus = this.renderer.listen(host, 'focusin', () => this.scheduleRefresh());
  }

  private scheduleRefresh() {
    if (!isPlatformBrowser(this.platformId) || !this.indicator) {
      return;
    }

    if (this.frame) {
      cancelAnimationFrame(this.frame);
    }

    this.frame = requestAnimationFrame(() => {
      this.frame = 0;
      this.refresh();
    });
  }

  private refresh() {
    const host = this.elementRef.nativeElement;
    const indicator = this.indicator;
    const active = host.querySelector<HTMLElement>(this.activeSelector);

    if (!indicator || !active || active === indicator || !this.isVisible(active)) {
      indicator?.classList.remove('md3-active-indicator-visible');
      return;
    }

    indicator.style.setProperty('--md3-active-indicator-x', `${active.offsetLeft}px`);
    indicator.style.setProperty('--md3-active-indicator-y', `${active.offsetTop}px`);
    indicator.style.setProperty('--md3-active-indicator-width', `${active.offsetWidth}px`);
    indicator.style.setProperty('--md3-active-indicator-height', `${active.offsetHeight}px`);
    indicator.classList.add('md3-active-indicator-visible');
  }

  private isVisible(element: HTMLElement): boolean {
    const rect = element.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  }
}
