import { Injectable } from '@angular/core';

declare let gtag: (...args: unknown[]) => void;

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
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
}
