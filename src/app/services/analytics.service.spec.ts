import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  AnalyticsService,
  DRF_API_LOGGER_ANALYTICS_ID,
  ProjectPromotionEventName,
} from './analytics.service';

type GtagCall = [command: string, eventNameOrConfig: unknown, params?: Record<string, unknown>];

describe('AnalyticsService project promotion events', () => {
  let analytics: AnalyticsService;
  let gtag: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.useFakeTimers();
    gtag = vi.fn();
    Object.assign(window, { gtag, dataLayer: [] });
    analytics = new AnalyticsService();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
    delete (window as Window & { gtag?: unknown }).gtag;
    delete (window as Window & { dataLayer?: unknown }).dataLayer;
  });

  const projectEventCalls = () => (gtag.mock.calls as GtagCall[])
    .filter(([command]) => command === 'event');

  it('emits resource and install events with only allow-listed, low-cardinality fields', () => {
    analytics.trackProjectResourceClick(DRF_API_LOGGER_ANALYTICS_ID, 'official-listing', 'project-spotlight');
    analytics.trackProjectInternalClick(DRF_API_LOGGER_ANALYTICS_ID, 'slides', 'article-body');
    analytics.trackProjectInstallCopy(DRF_API_LOGGER_ANALYTICS_ID, 'article-body');

    expect(projectEventCalls()).toEqual([
      [
        'event',
        'project_resource_click',
        {
          project_id: 'drf-api-logger',
          resource: 'official-listing',
          placement: 'project-spotlight',
        },
      ],
      [
        'event',
        'project_internal_click',
        {
          project_id: 'drf-api-logger',
          destination: 'slides',
          placement: 'article-body',
        },
      ],
      [
        'event',
        'project_install_copy',
        {
          project_id: 'drf-api-logger',
          placement: 'article-body',
        },
      ],
    ]);

    for (const [, , params] of projectEventCalls()) {
      expect(params).not.toHaveProperty('url');
      expect(params).not.toHaveProperty('href');
      expect(params).not.toHaveProperty('label');
      expect(params).not.toHaveProperty('title');
    }
  });

  it('swallows gtag failures so UI actions can continue', () => {
    gtag.mockImplementation(() => {
      throw new Error('analytics unavailable');
    });

    expect(() => analytics.trackProjectInternalClick(
      DRF_API_LOGGER_ANALYTICS_ID,
      'article',
      'project-spotlight',
    )).not.toThrow();
  });

  it('emits stable once-trackable slide lifecycle events', () => {
    analytics.trackProjectSlideStart(DRF_API_LOGGER_ANALYTICS_ID);
    analytics.trackProjectSlideProgress(DRF_API_LOGGER_ANALYTICS_ID, 50);
    analytics.trackProjectSlideComplete(DRF_API_LOGGER_ANALYTICS_ID);
    analytics.trackProjectSlideBackToArticle(DRF_API_LOGGER_ANALYTICS_ID);

    expect(projectEventCalls()).toEqual([
      ['event', 'project_slide_start', { project_id: 'drf-api-logger' }],
      ['event', 'project_slide_progress', { project_id: 'drf-api-logger', milestone: 50 }],
      ['event', 'project_slide_complete', { project_id: 'drf-api-logger' }],
      ['event', 'project_slide_back_to_article', { project_id: 'drf-api-logger' }],
    ]);

    const names = projectEventCalls().map(([, eventName]) => eventName as ProjectPromotionEventName);
    expect(names).toEqual([
      'project_slide_start',
      'project_slide_progress',
      'project_slide_complete',
      'project_slide_back_to_article',
    ]);
  });
});
