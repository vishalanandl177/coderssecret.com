import { Injectable } from '@angular/core';

const GA_MEASUREMENT_ID = 'G-32HFW3BZEY';

type GtagFn = (...args: unknown[]) => void;

type AnalyticsWindow = Window & {
  dataLayer?: unknown[][];
  gtag?: GtagFn;
};

type LayoutShiftEntry = PerformanceEntry & {
  value: number;
  hadRecentInput?: boolean;
};

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private coreWebVitalsMonitoringStarted = false;
  private gtagConfigQueued = false;
  private gtagLoadScheduled = false;
  private gtagLoaded = false;

  trackEvent(action: string, category: string, label?: string, value?: number) {
    const gtag = this.getGtag(true);
    if (!gtag) return;

    gtag('event', action, {
      event_category: category,
      event_label: label,
      value,
    });
  }

  trackPageView(url: string, title: string) {
    const gtag = this.getGtag(true);
    if (!gtag) return;

    gtag('event', 'page_view', {
      page_path: url,
      page_title: title,
    });
  }

  trackSearch(query: string, resultsCount: number) {
    const gtag = this.getGtag(true);
    if (!gtag) return;

    gtag('event', 'search', {
      search_term: query,
      results_count: resultsCount,
    });
  }

  trackScrollDepth(depth: number, postSlug: string) {
    const gtag = this.getGtag(true);
    if (!gtag) return;

    gtag('event', 'scroll_depth', {
      event_category: 'engagement',
      event_label: postSlug,
      value: depth,
    });
  }

  monitorCoreWebVitals() {
    if (
      this.coreWebVitalsMonitoringStarted ||
      typeof window === 'undefined' ||
      typeof document === 'undefined' ||
      !('PerformanceObserver' in window)
    ) {
      return;
    }

    this.coreWebVitalsMonitoringStarted = true;
    this.scheduleGtagLoad();
    this.monitorCumulativeLayoutShift();
  }

  private getGtag(loadImmediately = false): GtagFn | undefined {
    if (typeof window === 'undefined') return undefined;

    const analyticsWindow = window as AnalyticsWindow;
    analyticsWindow.dataLayer = analyticsWindow.dataLayer || [];
    analyticsWindow.gtag =
      analyticsWindow.gtag ||
      ((...args: unknown[]) => {
        analyticsWindow.dataLayer?.push(args);
      });

    this.queueGtagConfig(analyticsWindow.gtag);
    if (loadImmediately) {
      this.scheduleGtagLoad(0);
    }

    return analyticsWindow.gtag;
  }

  private queueGtagConfig(gtag: GtagFn) {
    if (this.gtagConfigQueued) return;

    gtag('js', new Date());
    gtag('config', GA_MEASUREMENT_ID);
    this.gtagConfigQueued = true;
  }

  private scheduleGtagLoad(delayMs = 8000) {
    if (
      this.gtagLoaded ||
      this.gtagLoadScheduled ||
      typeof window === 'undefined' ||
      typeof document === 'undefined'
    ) {
      return;
    }

    this.gtagLoadScheduled = true;
    const load = () => {
      const requestIdleCallback = (window as AnalyticsWindow & {
        requestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number;
      }).requestIdleCallback;

      if (requestIdleCallback) {
        requestIdleCallback(() => this.loadGtagScript(), { timeout: 2000 });
      } else {
        this.loadGtagScript();
      }
    };

    if (delayMs <= 0) {
      globalThis.setTimeout(load, 0);
      return;
    }

    globalThis.setTimeout(load, delayMs);
  }

  private loadGtagScript() {
    if (this.gtagLoaded || typeof document === 'undefined') return;

    const existingScript = document.querySelector<HTMLScriptElement>(
      `script[src*="googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}"]`
    );

    if (existingScript) {
      this.gtagLoaded = true;
      return;
    }

    this.getGtag(false);

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    script.onload = () => {
      this.gtagLoaded = true;
    };
    script.onerror = () => {
      this.gtagLoadScheduled = false;
    };
    document.head.appendChild(script);
  }

  private monitorCumulativeLayoutShift() {
    let clsValue = 0;
    let lastReportedValue = 0;

    const report = () => {
      if (clsValue <= lastReportedValue) return;
      lastReportedValue = clsValue;
      this.trackWebVital('CLS', clsValue);
    };

    try {
      const observer = new PerformanceObserver(list => {
        for (const entry of list.getEntries() as LayoutShiftEntry[]) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        }
      });

      observer.observe({ type: 'layout-shift', buffered: true });

      document.addEventListener(
        'visibilitychange',
        () => {
          if (document.visibilityState === 'hidden') {
            report();
          }
        },
        { capture: true }
      );

      window.addEventListener(
        'pagehide',
        () => {
          report();
          observer.disconnect();
        },
        { capture: true, once: true }
      );
    } catch {
      // Older browsers do not expose layout-shift entries.
    }
  }

  private trackWebVital(name: string, value: number) {
    const gtag = this.getGtag(true);
    if (!gtag) return;

    gtag('event', 'web_vital', {
      event_category: 'Web Vitals',
      event_label: name,
      metric_name: name,
      metric_value: Math.round(value * 1000),
      metric_delta: value,
      non_interaction: true,
    });
  }
}
