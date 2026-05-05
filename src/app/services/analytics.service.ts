import { Injectable } from '@angular/core';

declare let gtag: (...args: unknown[]) => void;

type LayoutShiftEntry = PerformanceEntry & {
  value: number;
  hadRecentInput?: boolean;
};

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private coreWebVitalsMonitoringStarted = false;

  trackEvent(action: string, category: string, label?: string, value?: number) {
    if (typeof gtag !== 'undefined') {
      gtag('event', action, {
        event_category: category,
        event_label: label,
        value,
      });
    }
  }

  trackPageView(url: string, title: string) {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'page_view', {
        page_path: url,
        page_title: title,
      });
    }
  }

  trackSearch(query: string, resultsCount: number) {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'search', {
        search_term: query,
        results_count: resultsCount,
      });
    }
  }

  trackScrollDepth(depth: number, postSlug: string) {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'scroll_depth', {
        event_category: 'engagement',
        event_label: postSlug,
        value: depth,
      });
    }
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
    this.monitorCumulativeLayoutShift();
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
    if (typeof gtag !== 'undefined') {
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
}
