import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  AnalyticsService,
  DRF_API_LOGGER_ANALYTICS_ID,
  ProjectAnalyticsId,
} from '../../services/analytics.service';
import { SlideData, SlidePlayerComponent } from './slide-player';

const slides: SlideData[] = [
  {
    type: 'content',
    title: 'Request flow',
    body: 'The middleware captures a request snapshot.',
    bullets: ['Queue the snapshot'],
    narration: 'Start with the request. Then queue the snapshot.',
    focusSteps: [
      { target: 'body', narration: 'Start with the request.', label: 'Capture request' },
      { target: 'bullet:0', narration: 'Then queue the snapshot.', label: 'Queue snapshot' },
    ],
  },
  {
    type: 'end',
    title: 'Complete',
    narration: 'You completed the guide.',
  },
];

const milestoneSlides: SlideData[] = [
  { type: 'content', title: 'Start', narration: 'Start.' },
  { type: 'content', title: 'Quarter', narration: 'Quarter.' },
  { type: 'content', title: 'Half', narration: 'Half.' },
  { type: 'content', title: 'Three quarters', narration: 'Three quarters.' },
  { type: 'end', title: 'Complete', narration: 'Complete.' },
];

describe('SlidePlayerComponent', () => {
  let fixture: ComponentFixture<SlidePlayerComponent> | undefined;
  let component: SlidePlayerComponent;
  let clipboardDescriptor: PropertyDescriptor | undefined;
  let analytics: {
    trackProjectResourceClick: ReturnType<typeof vi.fn>;
    trackProjectInternalClick: ReturnType<typeof vi.fn>;
    trackProjectInstallCopy: ReturnType<typeof vi.fn>;
    trackProjectSlideStart: ReturnType<typeof vi.fn>;
    trackProjectSlideProgress: ReturnType<typeof vi.fn>;
    trackProjectSlideComplete: ReturnType<typeof vi.fn>;
    trackProjectSlideBackToArticle: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    clipboardDescriptor = Object.getOwnPropertyDescriptor(navigator, 'clipboard');
    analytics = {
      trackProjectResourceClick: vi.fn(),
      trackProjectInternalClick: vi.fn(),
      trackProjectInstallCopy: vi.fn(),
      trackProjectSlideStart: vi.fn(),
      trackProjectSlideProgress: vi.fn(),
      trackProjectSlideComplete: vi.fn(),
      trackProjectSlideBackToArticle: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [SlidePlayerComponent],
      providers: [{ provide: AnalyticsService, useValue: analytics }],
    }).compileComponents();
  });

  afterEach(() => {
    fixture?.destroy();
    if (clipboardDescriptor) {
      Object.defineProperty(navigator, 'clipboard', clipboardDescriptor);
    } else {
      delete (navigator as unknown as { clipboard?: Clipboard }).clipboard;
    }
  });

  const createComponent = (
    slideData: SlideData[] = slides,
    analyticsId?: ProjectAnalyticsId,
  ) => {
    fixture = TestBed.createComponent(SlidePlayerComponent);
    fixture.componentRef.setInput('slides', slideData);
    if (analyticsId) fixture.componentRef.setInput('analyticsId', analyticsId);
    fixture.detectChanges();
    component = fixture.componentInstance;
  };

  it('keeps the full transcript stable while focus changes', () => {
    createComponent();
    component.activeFocusIndex.set(1);

    expect(component.currentNarrationText()).toBe('Start with the request. Then queue the snapshot.');
  });

  it('preserves the current teaching step when Guide is hidden and shown', () => {
    createComponent();
    component.activeFocusIndex.set(1);
    component.activeFocusKey.set('bullet:0');

    component.toggleGuide();
    component.toggleGuide();

    expect(component.guideEnabled()).toBe(true);
    expect(component.activeFocusIndex()).toBe(1);
    expect(component.activeFocusKey()).toBe('bullet:0');
  });

  it('does not advance the slide when Space comes from a control', () => {
    createComponent();
    const button = document.createElement('button');
    const event = {
      key: ' ',
      target: button,
      preventDefault: () => undefined,
    } as unknown as KeyboardEvent;

    component.onKey(event);

    expect(component.idx()).toBe(0);
  });

  it('keeps generic decks analytics-free when analyticsId is omitted', () => {
    createComponent();
    component.next();
    component.trackBackToArticle();

    expect(analytics.trackProjectSlideStart).not.toHaveBeenCalled();
    expect(analytics.trackProjectSlideProgress).not.toHaveBeenCalled();
    expect(analytics.trackProjectSlideComplete).not.toHaveBeenCalled();
    expect(analytics.trackProjectSlideBackToArticle).not.toHaveBeenCalled();
  });

  it('tracks start, progress thresholds, and completion once per deck', () => {
    createComponent(milestoneSlides, DRF_API_LOGGER_ANALYTICS_ID);

    expect(analytics.trackProjectSlideStart).toHaveBeenCalledTimes(1);
    component.jumpTo(1);
    component.jumpTo(2);
    component.jumpTo(1);
    component.jumpTo(2);
    component.jumpTo(3);
    component.jumpTo(4);
    component.prev();
    component.next();

    expect(analytics.trackProjectSlideStart).toHaveBeenCalledTimes(1);
    expect(analytics.trackProjectSlideProgress.mock.calls).toEqual([
      ['drf-api-logger', 25],
      ['drf-api-logger', 50],
      ['drf-api-logger', 75],
    ]);
    expect(analytics.trackProjectSlideComplete).toHaveBeenCalledTimes(1);
    expect(analytics.trackProjectSlideComplete).toHaveBeenCalledWith('drf-api-logger');
  });

  it('tracks the back-to-article action only once', () => {
    createComponent(slides, DRF_API_LOGGER_ANALYTICS_ID);

    component.trackBackToArticle();
    component.trackBackToArticle();

    expect(analytics.trackProjectSlideBackToArticle).toHaveBeenCalledTimes(1);
    expect(analytics.trackProjectSlideBackToArticle).toHaveBeenCalledWith('drf-api-logger');
  });

  it('renders actionable end-slide resources as native anchors and preserves navigation', () => {
    createComponent([{
      type: 'end',
      title: 'Resources',
      narration: 'Open the package.',
      links: [{
        label: 'PyPI',
        value: 'pypi.org/project/drf-api-logger',
        href: 'https://pypi.org/project/drf-api-logger/',
        external: true,
        analyticsResource: 'pypi',
      }],
    }], DRF_API_LOGGER_ANALYTICS_ID);
    const anchor = fixture!.nativeElement.querySelector('.slide-action-card[href]') as HTMLAnchorElement | null;
    const click = new MouseEvent('click', { bubbles: true, cancelable: true });
    let preventedByComponent = true;
    anchor?.addEventListener('click', event => {
      preventedByComponent = event.defaultPrevented;
      event.preventDefault();
    });

    expect(anchor?.getAttribute('href')).toBe('https://pypi.org/project/drf-api-logger/');
    expect(anchor?.getAttribute('target')).toBe('_blank');
    expect(anchor?.getAttribute('rel')).toBe('noopener noreferrer');
    anchor?.dispatchEvent(click);
    expect(preventedByComponent).toBe(false);
    expect(analytics.trackProjectResourceClick).toHaveBeenCalledWith(
      'drf-api-logger',
      'pypi',
      'slides',
    );
  });

  it('copies an actionable end-slide command and announces success', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    });
    const installLink = {
      label: 'Install command',
      value: 'pip install drf-api-logger',
      copyValue: 'pip install drf-api-logger',
      analyticsAction: 'install' as const,
    };
    createComponent([{
      type: 'end',
      title: 'Install',
      narration: 'Copy the install command.',
      links: [installLink],
    }], DRF_API_LOGGER_ANALYTICS_ID);

    await component.copySlideAction(installLink, 0);
    fixture!.detectChanges();

    expect(writeText).toHaveBeenCalledWith('pip install drf-api-logger');
    expect(fixture!.nativeElement.querySelector('.slide-action-status')?.textContent).toContain(
      'Install command copied to the clipboard.',
    );
    expect(analytics.trackProjectInstallCopy).toHaveBeenCalledWith('drf-api-logger', 'slides');
  });

  it('retains legacy end-slide links as non-actionable cards', () => {
    createComponent([{
      type: 'end',
      title: 'Legacy resources',
      narration: 'Read the resource value.',
      links: [{ label: 'Source', value: 'example.com/source' }],
    }]);
    const legacyCard = fixture!.nativeElement.querySelector('[data-slide-focus="link:0"]') as HTMLElement | null;

    expect(legacyCard?.tagName).toBe('DIV');
    expect(fixture!.nativeElement.querySelector('.slide-action-card')).toBeNull();
  });

  it('isolates analytics failures from slide navigation', () => {
    createComponent(milestoneSlides, DRF_API_LOGGER_ANALYTICS_ID);
    analytics.trackProjectSlideProgress.mockImplementation(() => {
      throw new Error('analytics unavailable');
    });

    expect(() => component.jumpTo(1)).not.toThrow();
    expect(component.idx()).toBe(1);
  });
});
