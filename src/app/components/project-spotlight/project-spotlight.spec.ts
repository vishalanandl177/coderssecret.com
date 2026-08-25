import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AnalyticsService, DRF_API_LOGGER_ANALYTICS_ID } from '../../services/analytics.service';
import {
  ProjectSpotlightComponent,
  ProjectSpotlightConfig,
} from './project-spotlight';

const project: ProjectSpotlightConfig = {
  eyebrow: 'Open source project',
  title: 'DRF API Logger',
  description: 'Inspect Django REST Framework requests without blocking the response path.',
  installCommand: 'pip install drf-api-logger',
  facts: [
    { label: 'Version', value: '1.0.0' },
    { label: 'Verified', value: 'August 2026' },
    { label: 'Compatibility', value: 'Python 3.10+, Django 4.2+, DRF 3.14+' },
    { label: 'License', value: 'MIT' },
  ],
  links: [
    {
      label: 'Read the guide',
      href: '/blog/drf-api-logger-django-rest-framework',
      destination: 'article',
    },
    {
      label: 'PyPI',
      href: 'https://pypi.org/project/drf-api-logger/',
      resource: 'pypi',
      external: true,
    },
  ],
};

describe('ProjectSpotlightComponent', () => {
  let fixture: ComponentFixture<ProjectSpotlightComponent>;
  let component: ProjectSpotlightComponent;
  let analytics: {
    trackProjectResourceClick: ReturnType<typeof vi.fn>;
    trackProjectInternalClick: ReturnType<typeof vi.fn>;
    trackProjectInstallCopy: ReturnType<typeof vi.fn>;
  };
  let clipboardDescriptor: PropertyDescriptor | undefined;

  beforeEach(async () => {
    analytics = {
      trackProjectResourceClick: vi.fn(),
      trackProjectInternalClick: vi.fn(),
      trackProjectInstallCopy: vi.fn(),
    };
    clipboardDescriptor = Object.getOwnPropertyDescriptor(navigator, 'clipboard');

    await TestBed.configureTestingModule({
      imports: [ProjectSpotlightComponent],
      providers: [{ provide: AnalyticsService, useValue: analytics }],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectSpotlightComponent);
    fixture.componentRef.setInput('project', project);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    fixture.destroy();
    if (clipboardDescriptor) {
      Object.defineProperty(navigator, 'clipboard', clipboardDescriptor);
    } else {
      delete (navigator as unknown as { clipboard?: Clipboard }).clipboard;
    }
  });

  it('renders a labelled region with an H2 and crawlable native anchors', () => {
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    const region = element.querySelector<HTMLElement>('section[role="region"]');
    const links = Array.from(element.querySelectorAll<HTMLAnchorElement>('nav a'));

    expect(region?.getAttribute('aria-label')).toBe('DRF API Logger');
    expect(element.querySelector('h1')).toBeNull();
    expect(element.querySelector('h2')?.textContent).toContain('DRF API Logger');
    expect(Array.from(element.querySelectorAll('dl dt')).map(term => term.textContent)).toEqual([
      'Version',
      'Verified',
      'Compatibility',
      'License',
    ]);
    expect(links.map(link => link.getAttribute('href'))).toEqual([
      '/blog/drf-api-logger-django-rest-framework',
      'https://pypi.org/project/drf-api-logger/',
    ]);
    expect(links[0].getAttribute('target')).toBeNull();
    expect(links[1].getAttribute('target')).toBe('_blank');
    expect(links[1].getAttribute('rel')).toBe('noopener noreferrer');
    expect(links[1].getAttribute('aria-label')).toContain('opens in a new tab');
  });

  it('copies the install command, announces success, and records its placement', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    analytics.trackProjectInstallCopy.mockImplementation(() => {
      throw new Error('analytics unavailable');
    });
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    });
    fixture.componentRef.setInput('analyticsId', DRF_API_LOGGER_ANALYTICS_ID);
    fixture.componentRef.setInput('analyticsPlacement', 'article-body');
    fixture.detectChanges();

    await component.copyInstall();
    fixture.detectChanges();

    expect(writeText).toHaveBeenCalledWith('pip install drf-api-logger');
    expect(fixture.nativeElement.querySelector('[role="status"]')?.textContent).toContain(
      'Install command copied to the clipboard.',
    );
    expect(component.copied()).toBe(true);
    expect(analytics.trackProjectInstallCopy).toHaveBeenCalledWith(
      'drf-api-logger',
      'article-body',
    );
  });

  it('tracks an internal destination without cancelling native anchor behavior', () => {
    fixture.componentRef.setInput('analyticsId', DRF_API_LOGGER_ANALYTICS_ID);
    fixture.detectChanges();
    const anchor = fixture.nativeElement.querySelector('nav a') as HTMLAnchorElement | null;
    const click = new MouseEvent('click', { bubbles: true, cancelable: true });
    let preventedByComponent = true;
    anchor?.addEventListener('click', event => {
      preventedByComponent = event.defaultPrevented;
      event.preventDefault();
    });

    anchor?.dispatchEvent(click);
    expect(preventedByComponent).toBe(false);
    expect(fixture.nativeElement.querySelector('section')?.getAttribute('data-project-spotlight')).toBe(
      'drf-api-logger',
    );
    expect(analytics.trackProjectInternalClick).toHaveBeenCalledWith(
      'drf-api-logger',
      'article',
      'project-spotlight',
    );
  });

  it('tracks external resources with an enumerated resource value', () => {
    fixture.componentRef.setInput('analyticsId', DRF_API_LOGGER_ANALYTICS_ID);
    fixture.detectChanges();

    component.trackLink(project.links[1]);

    expect(analytics.trackProjectResourceClick).toHaveBeenCalledWith(
      'drf-api-logger',
      'pypi',
      'project-spotlight',
    );
    expect(analytics.trackProjectInternalClick).not.toHaveBeenCalled();
  });

  it('does not emit promotion analytics when no analytics id is supplied', () => {
    fixture.detectChanges();

    component.trackLink(project.links[0]);

    expect(analytics.trackProjectResourceClick).not.toHaveBeenCalled();
    expect(analytics.trackProjectInternalClick).not.toHaveBeenCalled();
  });

  it('isolates analytics failures from navigation', () => {
    analytics.trackProjectInternalClick.mockImplementation(() => {
      throw new Error('analytics unavailable');
    });
    fixture.componentRef.setInput('analyticsId', DRF_API_LOGGER_ANALYTICS_ID);
    fixture.detectChanges();

    expect(() => component.trackLink(project.links[0])).not.toThrow();
  });
});
