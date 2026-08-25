import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { EXTERNAL_LINKS } from '../shared/external-links';

interface SeoConfig {
  title: string;
  description: string;
  url?: string;
  type?: string;
  image?: string;
  imageWidth?: number;
  imageHeight?: number;
  robots?: string;
  article?: {
    author?: string;
    publishedTime?: string;
    modifiedTime?: string;
    tags?: string[];
    section?: string;
  };
  breadcrumbs?: { name: string; url: string }[];
  itemList?: { name: string; url: string; description?: string }[];
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

@Injectable({ providedIn: 'root' })
export class SeoService {
  private title = inject(Title);
  private meta = inject(Meta);
  private doc = inject(DOCUMENT);

  private readonly siteName = 'CodersSecret';
  private readonly siteUrl = 'https://coderssecret.com';
  private readonly defaultDescription = 'Free engineering courses and guides on malware defense, Kubernetes, Zero Trust, production AI, analytics, DevSecOps, system design, labs, and diagrams.';
  private readonly defaultImage = `${this.siteUrl}/og-image.svg`;
  private readonly defaultImageWidth = 1200;
  private readonly defaultImageHeight = 630;

  update(config: SeoConfig) {
    const fullTitle = this.buildTitle(config.title);
    const description = config.description || this.defaultDescription;
    const url = config.url ? this.absoluteUrl(config.url) : this.siteUrl;
    const type = config.type || 'website';
    const image = config.image || this.defaultImage;
    const imageWidth = config.imageWidth || this.defaultImageWidth;
    const imageHeight = config.imageHeight || this.defaultImageHeight;

    // Page title
    this.title.setTitle(fullTitle);

    // Standard meta
    this.meta.updateTag({ name: 'description', content: description });
    if (config.robots) {
      this.meta.updateTag({ name: 'robots', content: config.robots });
    } else {
      this.meta.removeTag('name="robots"');
    }

    // Open Graph
    this.meta.updateTag({ property: 'og:title', content: fullTitle });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:type', content: type });
    this.meta.updateTag({ property: 'og:image', content: image });
    this.meta.updateTag({ property: 'og:image:width', content: String(imageWidth) });
    this.meta.updateTag({ property: 'og:image:height', content: String(imageHeight) });
    this.meta.updateTag({ property: 'og:site_name', content: this.siteName });

    // Twitter Card
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: fullTitle });
    this.meta.updateTag({ name: 'twitter:description', content: description });
    this.meta.updateTag({ name: 'twitter:image', content: image });
    this.meta.updateTag({ name: 'twitter:creator', content: '@coderssecret' });
    this.meta.updateTag({ name: 'twitter:site', content: '@coderssecret' });

    // Article-specific OG tags
    this.clearArticleMeta();
    if (config.article) {
      if (config.article.author) {
        this.meta.updateTag({ property: 'article:author', content: config.article.author });
      }
      if (config.article.publishedTime) {
        this.meta.updateTag({ property: 'article:published_time', content: config.article.publishedTime });
      }
      if (config.article.modifiedTime) {
        this.meta.updateTag({ property: 'article:modified_time', content: config.article.modifiedTime });
      }
      if (config.article.section) {
        this.meta.updateTag({ property: 'article:section', content: config.article.section });
      }
      if (config.article.tags) {
        [...new Set(config.article.tags)].forEach(tag => {
          this.meta.addTag({ property: 'article:tag', content: tag }, true);
        });
      }
    }

    // Canonical URL
    this.updateCanonical(url);

    // JSON-LD structured data
    const schemas: Record<string, unknown>[] = [];

    if (config.type === 'article' && config.article) {
      // BlogPosting schema
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        'headline': config.title,
        'description': description,
        'url': url,
        'image': image,
        'datePublished': config.article.publishedTime,
        // Keep the key present in the in-memory merge so a same-page update can
        // clear a previously emitted value. JSON.stringify omits undefined.
        'dateModified': config.article.modifiedTime,
        'author': {
          '@type': 'Person',
          'name': config.article.author,
          'url': `${this.siteUrl}/about`,
        },
        'publisher': {
          '@type': 'Organization',
          'name': this.siteName,
          'url': this.siteUrl,
          'logo': {
            '@type': 'ImageObject',
            'url': `${this.siteUrl}/logo.svg`,
          },
        },
        'mainEntityOfPage': {
          '@type': 'WebPage',
          '@id': url,
        },
        'keywords': config.article.tags?.join(', '),
        'articleSection': config.article.section,
      });
    } else if (config.url === '/') {
      // Organization schema for homepage
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        'name': this.siteName,
        'url': this.siteUrl,
        'logo': `${this.siteUrl}/logo.svg`,
        'description': this.defaultDescription,
        'sameAs': [
          EXTERNAL_LINKS.instagram,
          EXTERNAL_LINKS.linkedin,
          EXTERNAL_LINKS.youtube,
          EXTERNAL_LINKS.spotifyPodcast,
          EXTERNAL_LINKS.githubRepo,
        ],
      });
      // WebSite schema with search action
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        'name': this.siteName,
        'url': this.siteUrl,
        'description': this.defaultDescription,
      });
    }

    // BreadcrumbList schema
    if (config.breadcrumbs && config.breadcrumbs.length > 0) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': config.breadcrumbs.map((crumb, i) => ({
          '@type': 'ListItem',
          'position': i + 1,
          'name': crumb.name,
          'item': this.absoluteUrl(crumb.url),
        })),
      });
    }

    // ItemList schema (for blog list and category pages)
    if (config.itemList && config.itemList.length > 0) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        'name': config.title,
        'description': config.description,
        'url': url,
        'mainEntity': {
          '@type': 'ItemList',
          'numberOfItems': config.itemList.length,
          'itemListElement': config.itemList.map((item, i) => ({
            '@type': 'ListItem',
            'position': i + 1,
            'url': this.absoluteUrl(item.url),
            'name': item.name,
          })),
        },
      });
    }

    // Custom JSON-LD (Course schema, FAQPage, etc.)
    if (config.jsonLd) {
      if (Array.isArray(config.jsonLd)) {
        schemas.push(...config.jsonLd);
      } else {
        schemas.push(config.jsonLd);
      }
    }

    if (schemas.length > 0) {
      this.updateJsonLd(schemas.length === 1 ? schemas[0] : schemas, url);
    } else {
      this.removeJsonLd();
    }
  }

  private buildTitle(title: string): string {
    const trimmedTitle = title.trim();
    const normalizedTitle = this.normalizeTitleSeparators(trimmedTitle);

    if (normalizedTitle === this.siteName) {
      return `${this.siteName} | Security, AI, Data & Production Engineering`;
    }

    if (normalizedTitle.toLowerCase().includes(this.siteName.toLowerCase())) {
      return normalizedTitle;
    }

    return `${normalizedTitle} | ${this.siteName}`;
  }

  private normalizeTitleSeparators(title: string): string {
    return title
      .replace(/\s+(?:\u2014|\u2013|\u00e2\u20ac\u201d|-)\s+/g, ' | ')
      .replace(/\s+\|\s+/g, ' | ')
      .trim();
  }

  private updateCanonical(url: string) {
    let link: HTMLLinkElement | null = this.doc.querySelector('link[rel="canonical"]');
    if (!link) {
      link = this.doc.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.doc.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }

  private clearArticleMeta() {
    const selectors = [
      'property="article:author"',
      'property="article:published_time"',
      'property="article:modified_time"',
      'property="article:section"',
      'property="article:tag"',
    ];
    selectors.forEach(selector => {
      this.meta.getTags(selector).forEach(tag => this.meta.removeTagElement(tag));
    });
  }

  private normalizeCanonicalPath(path: string): string {
    const pathOnly = String(path || '/').split(/[?#]/)[0] || '/';
    const normalized = `/${pathOnly.replace(/^\/+/, '')}`.replace(/\/+$/, '');
    return normalized === '' ? '/' : normalized;
  }

  private absoluteUrl(path: string): string {
    const normalizedPath = this.normalizeCanonicalPath(path);
    return normalizedPath === '/' ? this.siteUrl : `${this.siteUrl}${normalizedPath}`;
  }

  private updateJsonLd(
    data: Record<string, unknown> | Record<string, unknown>[],
    pageUrl: string,
  ) {
    let script: HTMLScriptElement | null = this.doc.querySelector('script[type="application/ld+json"]');
    const existingSchemas = this.readJsonLd(script);
    const preservedSchemas = existingSchemas.filter(schema => this.schemaOwnerUrl(schema) === pageUrl);
    const nextSchemas = Array.isArray(data) ? data : [data];
    const mergedSchemas = new Map<string, Record<string, unknown>>();

    for (const schema of [...preservedSchemas, ...nextSchemas]) {
      const identity = this.schemaIdentity(schema);
      mergedSchemas.set(identity, { ...(mergedSchemas.get(identity) || {}), ...schema });
    }

    if (!script) {
      script = this.doc.createElement('script');
      script.setAttribute('type', 'application/ld+json');
      this.doc.head.appendChild(script);
    }
    const merged = [...mergedSchemas.values()];
    script.textContent = JSON.stringify(merged.length === 1 ? merged[0] : merged);
  }

  private readJsonLd(script: HTMLScriptElement | null): Record<string, unknown>[] {
    if (!script?.textContent) return [];
    try {
      const parsed: unknown = JSON.parse(script.textContent);
      const entries = Array.isArray(parsed) ? parsed : [parsed];
      return entries.filter((entry): entry is Record<string, unknown> => (
        typeof entry === 'object' && entry !== null && !Array.isArray(entry)
      ));
    } catch {
      return [];
    }
  }

  private schemaIdentity(schema: Record<string, unknown>): string {
    const type = Array.isArray(schema['@type'])
      ? schema['@type'].join(',')
      : String(schema['@type'] || 'Thing');
    return `${type}|${this.schemaOwnerUrl(schema) || ''}`;
  }

  private schemaOwnerUrl(schema: Record<string, unknown>): string | undefined {
    const directUrl = this.stringValue(schema['url']) || this.stringValue(schema['@id']);
    if (directUrl) return this.normalizeSchemaUrl(directUrl);

    const mainEntity = schema['mainEntityOfPage'];
    const mainEntityUrl = this.stringValue(mainEntity)
      || (this.isRecord(mainEntity) ? this.stringValue(mainEntity['@id']) : undefined);
    if (mainEntityUrl) return this.normalizeSchemaUrl(mainEntityUrl);

    if (schema['@type'] === 'BreadcrumbList' && Array.isArray(schema['itemListElement'])) {
      const lastItem = [...schema['itemListElement']].reverse().find(this.isRecord);
      const itemUrl = lastItem && (this.stringValue(lastItem['item']) || this.stringValue(lastItem['url']));
      if (itemUrl) return this.normalizeSchemaUrl(itemUrl);
    }

    return undefined;
  }

  private normalizeSchemaUrl(value: string): string | undefined {
    try {
      const parsed = new URL(value, this.siteUrl);
      const pathname = this.normalizeCanonicalPath(parsed.pathname);
      return pathname === '/' ? parsed.origin : `${parsed.origin}${pathname}`;
    } catch {
      return undefined;
    }
  }

  private stringValue(value: unknown): string | undefined {
    return typeof value === 'string' && value.trim() ? value.trim() : undefined;
  }

  private isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
  }

  private removeJsonLd() {
    const script = this.doc.querySelector('script[type="application/ld+json"]');
    script?.remove();
  }
}
