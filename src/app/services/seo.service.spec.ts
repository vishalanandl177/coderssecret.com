import { TestBed } from '@angular/core/testing';
import { DOCUMENT } from '@angular/common';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { SeoService } from './seo.service';

describe('SeoService', () => {
  let service: SeoService;
  let documentRef: Document;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [SeoService] });
    service = TestBed.inject(SeoService);
    documentRef = TestBed.inject(DOCUMENT);
    clearSeoElements();
  });

  afterEach(() => {
    clearSeoElements();
    TestBed.resetTestingModule();
  });

  it('preserves specialized current-page schema during hydration', () => {
    addJsonLd([
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://coderssecret.com' },
          { '@type': 'ListItem', position: 2, name: 'Git', item: 'https://coderssecret.com/cheatsheets/git' },
        ],
      },
      {
        '@context': 'https://schema.org',
        '@type': 'TechArticle',
        headline: 'Git Cheatsheet',
        url: 'https://coderssecret.com/cheatsheets/git',
        wordCount: 123,
      },
    ]);

    service.update({
      title: 'Git Cheatsheet',
      description: 'A production Git reference for developers.',
      url: '/cheatsheets/git',
      breadcrumbs: [
        { name: 'Home', url: '/' },
        { name: 'Git Cheatsheet', url: '/cheatsheets/git' },
      ],
    });

    const schemas = readJsonLd();
    expect(schemas.filter(schema => schema['@type'] === 'BreadcrumbList')).toHaveLength(1);
    expect(schemas.find(schema => schema['@type'] === 'TechArticle')?.['wordCount']).toBe(123);
  });

  it('drops schema owned by the previous page during SPA navigation', () => {
    addJsonLd({
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Consultation',
      url: 'https://coderssecret.com/consultation',
    });

    service.update({
      title: 'About',
      description: 'About CodersSecret and its author.',
      url: '/about',
      breadcrumbs: [
        { name: 'Home', url: '/' },
        { name: 'About', url: '/about' },
      ],
    });

    const schemas = readJsonLd();
    expect(schemas.some(schema => schema['@type'] === 'Service')).toBe(false);
    expect(schemas.some(schema => schema['@type'] === 'BreadcrumbList')).toBe(true);
  });

  it('deduplicates current article tags and clears stale article metadata', () => {
    const staleModified = documentRef.createElement('meta');
    staleModified.setAttribute('property', 'article:modified_time');
    staleModified.setAttribute('content', '2024-01-01');
    documentRef.head.appendChild(staleModified);

    service.update({
      title: 'Malware Defense',
      description: 'A defensive malware analysis guide for developers.',
      url: '/blog/malware-defense',
      type: 'article',
      article: {
        author: 'Vishal Anand',
        publishedTime: '2026-08-25',
        section: 'Security',
        tags: ['Malware', 'Detection', 'Malware'],
      },
    });

    const tags = [...documentRef.head.querySelectorAll<HTMLMetaElement>('meta[property="article:tag"]')]
      .map(tag => tag.content);
    expect(tags).toEqual(['Malware', 'Detection']);
    expect(documentRef.head.querySelector('meta[property="article:modified_time"]')).toBeNull();

    service.update({
      title: 'About',
      description: 'About CodersSecret.',
      url: '/about',
    });

    expect(documentRef.head.querySelector('meta[property^="article:"]')).toBeNull();
  });

  it('emits a real modified date in article metadata and BlogPosting schema', () => {
    service.update({
      title: 'DRF API Logger for Django REST Framework',
      description: 'A production guide to request and response observability in Django REST Framework.',
      url: '/blog/drf-api-logger-django-rest-framework',
      type: 'article',
      article: {
        author: 'Vishal Anand',
        publishedTime: '2026-05-14',
        modifiedTime: '2026-08-26',
        section: 'Open Source',
        tags: ['Django', 'DRF'],
      },
    });

    expect(documentRef.head.querySelector<HTMLMetaElement>('meta[property="article:published_time"]')?.content)
      .toBe('2026-05-14');
    expect(documentRef.head.querySelector<HTMLMetaElement>('meta[property="article:modified_time"]')?.content)
      .toBe('2026-08-26');

    const blogPosting = readJsonLd().find(schema => schema['@type'] === 'BlogPosting');
    expect(blogPosting?.['datePublished']).toBe('2026-05-14');
    expect(blogPosting?.['dateModified']).toBe('2026-08-26');

    service.update({
      title: 'DRF API Logger for Django REST Framework',
      description: 'A production guide to request and response observability in Django REST Framework.',
      url: '/blog/drf-api-logger-django-rest-framework',
      type: 'article',
      article: {
        author: 'Vishal Anand',
        publishedTime: '2026-05-14',
        section: 'Open Source',
        tags: ['Django', 'DRF'],
      },
    });

    expect(documentRef.head.querySelector('meta[property="article:modified_time"]')).toBeNull();
    const refreshedBlogPosting = readJsonLd().find(schema => schema['@type'] === 'BlogPosting');
    expect(refreshedBlogPosting).not.toHaveProperty('dateModified');

    service.update({
      title: 'About',
      description: 'About CodersSecret.',
      url: '/about',
    });

    expect(documentRef.head.querySelector('meta[property="article:modified_time"]')).toBeNull();
  });

  function addJsonLd(data: unknown): void {
    const script = documentRef.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data);
    documentRef.head.appendChild(script);
  }

  function readJsonLd(): Record<string, unknown>[] {
    const text = documentRef.head.querySelector<HTMLScriptElement>('script[type="application/ld+json"]')?.textContent;
    const parsed = JSON.parse(text || '[]');
    return Array.isArray(parsed) ? parsed : [parsed];
  }

  function clearSeoElements(): void {
    documentRef?.head.querySelectorAll('script[type="application/ld+json"], link[rel="canonical"], meta[property^="article:"]')
      .forEach(element => element.remove());
  }
});
