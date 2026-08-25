import { Injectable } from '@angular/core';

const GA_MEASUREMENT_ID = 'G-32HFW3BZEY';

export const DRF_API_LOGGER_ANALYTICS_ID = 'drf-api-logger' as const;

export type ProjectAnalyticsId = typeof DRF_API_LOGGER_ANALYTICS_ID;

export type ProjectPromotionPlacement =
  | 'project-spotlight'
  | 'article-hero'
  | 'article-body'
  | 'home'
  | 'about'
  | 'slides';

export type ProjectResource = 'pypi' | 'docs' | 'github' | 'official-listing' | 'issues';

export type ProjectInternalDestination = 'article' | 'slides';

export type ProjectSlideMilestone = 25 | 50 | 75;

export type ProjectPromotionEventName =
  | 'project_resource_click'
  | 'project_internal_click'
  | 'project_install_copy'
  | 'project_slide_start'
  | 'project_slide_progress'
  | 'project_slide_complete'
  | 'project_slide_back_to_article';

type ProjectPromotionEventParams = {
  project_id: ProjectAnalyticsId;
  placement?: ProjectPromotionPlacement;
  resource?: ProjectResource;
  destination?: ProjectInternalDestination;
  milestone?: ProjectSlideMilestone;
};

type GtagFn = (...args: unknown[]) => void;

type AnalyticsWindow = Window & {
  dataLayer?: unknown[][];
  gtag?: GtagFn;
};

type LayoutShiftEntry = PerformanceEntry & {
  value: number;
  hadRecentInput?: boolean;
};

type LargestContentfulPaintEntry = PerformanceEntry & {
  renderTime?: number;
  loadTime?: number;
};

type InteractionPerformanceEntry = PerformanceEntry & {
  duration: number;
  interactionId?: number;
};

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private coreWebVitalsMonitoringStarted = false;
  private gtagConfigQueued = false;
  private gtagLoadScheduled = false;
  private gtagLoaded = false;
  private gtagLoadTimer: number | undefined;

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

  trackProjectResourceClick(
    projectId: ProjectAnalyticsId,
    resource: ProjectResource,
    placement: ProjectPromotionPlacement,
  ) {
    this.trackProjectEvent('project_resource_click', {
      project_id: projectId,
      resource,
      placement,
    });
  }

  trackProjectInstallCopy(
    projectId: ProjectAnalyticsId,
    placement: ProjectPromotionPlacement,
  ) {
    this.trackProjectEvent('project_install_copy', {
      project_id: projectId,
      placement,
    });
  }

  trackProjectInternalClick(
    projectId: ProjectAnalyticsId,
    destination: ProjectInternalDestination,
    placement: ProjectPromotionPlacement,
  ) {
    this.trackProjectEvent('project_internal_click', {
      project_id: projectId,
      destination,
      placement,
    });
  }

  trackProjectSlideStart(projectId: ProjectAnalyticsId) {
    this.trackProjectEvent('project_slide_start', {
      project_id: projectId,
    });
  }

  trackProjectSlideProgress(
    projectId: ProjectAnalyticsId,
    milestone: ProjectSlideMilestone,
  ) {
    this.trackProjectEvent('project_slide_progress', {
      project_id: projectId,
      milestone,
    });
  }

  trackProjectSlideComplete(projectId: ProjectAnalyticsId) {
    this.trackProjectEvent('project_slide_complete', {
      project_id: projectId,
    });
  }

  trackProjectSlideBackToArticle(projectId: ProjectAnalyticsId) {
    this.trackProjectEvent('project_slide_back_to_article', {
      project_id: projectId,
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
    const finalizeVitals = [
      this.monitorCumulativeLayoutShift(),
      this.monitorLargestContentfulPaint(),
      this.monitorInteractionToNextPaint(),
    ].filter((finalize): finalize is () => void => typeof finalize === 'function');

    const finalize = () => finalizeVitals.forEach(report => report());
    document.addEventListener(
      'visibilitychange',
      () => {
        if (document.visibilityState === 'hidden') {
          finalize();
        }
      },
      { capture: true }
    );
    window.addEventListener('pagehide', finalize, { capture: true, once: true });
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

  private trackProjectEvent(
    eventName: ProjectPromotionEventName,
    params: ProjectPromotionEventParams,
  ) {
    try {
      const gtag = this.getGtag(true);
      if (!gtag) return;

      gtag('event', eventName, params);
    } catch {
      // Promotion analytics must never block navigation or other UI actions.
    }
  }

  private queueGtagConfig(gtag: GtagFn) {
    if (this.gtagConfigQueued) return;

    gtag('js', new Date());
    gtag('config', GA_MEASUREMENT_ID);
    this.gtagConfigQueued = true;
  }

  private scheduleGtagLoad(delayMs = 8000) {
    if (this.gtagLoaded || typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }

    // An explicit analytics action may shorten the idle startup delay without
    // ever moving gtag onto the initial rendering path.
    if (this.gtagLoadScheduled) {
      if (delayMs > 0 || this.gtagLoadTimer === undefined) return;
      globalThis.clearTimeout(this.gtagLoadTimer);
      this.gtagLoadTimer = undefined;
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
      this.gtagLoadTimer = globalThis.setTimeout(() => {
        this.gtagLoadTimer = undefined;
        load();
      }, 0);
      return;
    }

    this.gtagLoadTimer = globalThis.setTimeout(() => {
      this.gtagLoadTimer = undefined;
      load();
    }, delayMs);
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

  private monitorCumulativeLayoutShift(): (() => void) | undefined {
    let maxSessionValue = 0;
    let sessionValue = 0;
    let sessionStart = 0;
    let lastShiftTime = 0;
    let hasSession = false;
    let reported = false;

    try {
      const processEntries = (entries: LayoutShiftEntry[]) => {
        for (const entry of entries) {
          if (entry.hadRecentInput) continue;
          const continuesSession = hasSession
            && entry.startTime - lastShiftTime < 1000
            && entry.startTime - sessionStart < 5000;
          if (continuesSession) {
            sessionValue += entry.value;
          } else {
            sessionValue = entry.value;
            sessionStart = entry.startTime;
            hasSession = true;
          }
          lastShiftTime = entry.startTime;
          maxSessionValue = Math.max(maxSessionValue, sessionValue);
        }
      };
      const observer = new PerformanceObserver(list => {
        processEntries(list.getEntries() as LayoutShiftEntry[]);
      });

      observer.observe({ type: 'layout-shift', buffered: true });
      return () => {
        if (reported) return;
        reported = true;
        processEntries(observer.takeRecords() as LayoutShiftEntry[]);
        observer.disconnect();
        this.trackWebVital('CLS', maxSessionValue);
      };
    } catch {
      // Older browsers do not expose layout-shift entries.
      return undefined;
    }
  }

  private monitorLargestContentfulPaint(): (() => void) | undefined {
    let lcpValue = 0;
    let reported = false;
    try {
      const observer = new PerformanceObserver(list => {
        const entry = list.getEntries().at(-1) as LargestContentfulPaintEntry | undefined;
        if (entry) {
          lcpValue = entry.renderTime || entry.loadTime || entry.startTime;
        }
      });
      observer.observe({ type: 'largest-contentful-paint', buffered: true });

      const finalize = () => {
        if (reported) return;
        reported = true;
        const pending = observer.takeRecords().at(-1) as LargestContentfulPaintEntry | undefined;
        if (pending) {
          lcpValue = pending.renderTime || pending.loadTime || pending.startTime;
        }
        observer.disconnect();
        document.removeEventListener('keydown', finalize, true);
        document.removeEventListener('pointerdown', finalize, true);
        if (lcpValue > 0) {
          this.trackWebVital('LCP', lcpValue);
        }
      };

      document.addEventListener('keydown', finalize, { capture: true, once: true });
      document.addEventListener('pointerdown', finalize, { capture: true, once: true });
      return finalize;
    } catch {
      return undefined;
    }
  }

  private monitorInteractionToNextPaint(): (() => void) | undefined {
    const interactions = new Map<number, number>();
    let reported = false;
    try {
      const observer = new PerformanceObserver(list => {
        for (const entry of list.getEntries() as InteractionPerformanceEntry[]) {
          if (!entry.interactionId) continue;
          interactions.set(
            entry.interactionId,
            Math.max(interactions.get(entry.interactionId) ?? 0, entry.duration)
          );
        }
      });
      observer.observe({
        type: 'event',
        buffered: true,
        durationThreshold: 40,
      } as PerformanceObserverInit);

      return () => {
        if (reported) return;
        reported = true;
        observer.takeRecords().forEach(entry => {
          const interaction = entry as InteractionPerformanceEntry;
          if (!interaction.interactionId) return;
          interactions.set(
            interaction.interactionId,
            Math.max(interactions.get(interaction.interactionId) ?? 0, interaction.duration)
          );
        });
        observer.disconnect();

        const values = [...interactions.values()].sort((a, b) => b - a);
        if (values.length === 0) return;
        // INP approximates the 98th percentile by ignoring one worst
        // interaction for each complete set of 50 interactions.
        const percentileIndex = Math.min(values.length - 1, Math.floor(values.length / 50));
        this.trackWebVital('INP', values[percentileIndex]);
      };
    } catch {
      return undefined;
    }
  }

  private trackWebVital(name: string, value: number) {
    const gtag = this.getGtag(true);
    if (!gtag) return;

    gtag('event', 'web_vital', {
      event_category: 'Web Vitals',
      event_label: name,
      metric_name: name,
      metric_value: Math.round(name === 'CLS' ? value * 1000 : value),
      metric_delta: value,
      metric_unit: name === 'CLS' ? 'score_x1000' : 'millisecond',
      non_interaction: true,
    });
  }
}
