import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

interface SeoConfig {
  title: string;
  description: string;
  url?: string;
  type?: string;
  image?: string;
  imageWidth?: number;
  imageHeight?: number;
  article?: {
    author?: string;
    publishedTime?: string;
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
  private readonly defaultDescription = 'Battle-tested tutorials on Python, DevOps, APIs, AI, and system design — plus every article available as narrated slide presentations. Read or watch: 20x lighter than video, zero ads, fully free.';
  private readonly defaultImage = `${this.siteUrl}/og-image.svg`;
  private readonly defaultImageWidth = 1200;
  private readonly defaultImageHeight = 630;

  update(config: SeoConfig) {
    const fullTitle = config.title === this.siteName
      ? `${this.siteName} - Modern Web Development Blog`
      : `${config.title} | ${this.siteName}`;
    const description = config.description || this.defaultDescription;
    const url = config.url ? `${this.siteUrl}${config.url}` : this.siteUrl;
    const type = config.type || 'website';
    const image = config.image || this.defaultImage;
    const imageWidth = config.imageWidth || this.defaultImageWidth;
    const imageHeight = config.imageHeight || this.defaultImageHeight;

    // Page title
    this.title.setTitle(fullTitle);

    // Standard meta
    this.meta.updateTag({ name: 'description', content: description });

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
    if (config.article) {
      if (config.article.author) {
        this.meta.updateTag({ property: 'article:author', content: config.article.author });
      }
      if (config.article.publishedTime) {
        this.meta.updateTag({ property: 'article:published_time', content: config.article.publishedTime });
      }
      if (config.article.section) {
        this.meta.updateTag({ property: 'article:section', content: config.article.section });
      }
      if (config.article.tags) {
        config.article.tags.forEach(tag => {
          this.meta.updateTag({ property: 'article:tag', content: tag });
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
        'author': {
          '@type': 'Person',
          'name': config.article.author,
          'url': this.siteUrl,
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
          'https://instagram.com/vis_naz',
          'https://linkedin.com/in/vishal-techlead',
        ],
      });
      // WebSite schema with search action
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        'name': this.siteName,
        'url': this.siteUrl,
        'description': this.defaultDescription,
        'potentialAction': {
          '@type': 'SearchAction',
          'target': `${this.siteUrl}/blog?q={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
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
          'item': `${this.siteUrl}${crumb.url}`,
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
            'url': `${this.siteUrl}${item.url}`,
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
      this.updateJsonLd(schemas.length === 1 ? schemas[0] : schemas);
    } else {
      this.removeJsonLd();
    }
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

  private updateJsonLd(data: Record<string, unknown> | Record<string, unknown>[]) {
    let script: HTMLScriptElement | null = this.doc.querySelector('script[type="application/ld+json"]');
    if (!script) {
      script = this.doc.createElement('script');
      script.setAttribute('type', 'application/ld+json');
      this.doc.head.appendChild(script);
    }
    script.textContent = JSON.stringify(data);
  }

  private removeJsonLd() {
    const script = this.doc.querySelector('script[type="application/ld+json"]');
    script?.remove();
  }
}
