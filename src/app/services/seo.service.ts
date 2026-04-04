import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

interface SeoConfig {
  title: string;
  description: string;
  url?: string;
  type?: string;
  image?: string;
  article?: {
    author?: string;
    publishedTime?: string;
    tags?: string[];
  };
}

@Injectable({ providedIn: 'root' })
export class SeoService {
  private title = inject(Title);
  private meta = inject(Meta);
  private doc = inject(DOCUMENT);

  private readonly siteName = 'CodersSecret';
  private readonly siteUrl = 'https://coderssecret.com';
  private readonly defaultDescription = 'Deep dives into Angular, Python, DevOps, and the modern web. Written by developers, for developers who love building things.';
  private readonly defaultImage = `${this.siteUrl}/logo.svg`;

  update(config: SeoConfig) {
    const fullTitle = config.title === this.siteName
      ? `${this.siteName} - Modern Web Development Blog`
      : `${config.title} | ${this.siteName}`;
    const description = config.description || this.defaultDescription;
    const url = config.url ? `${this.siteUrl}${config.url}` : this.siteUrl;
    const type = config.type || 'website';
    const image = config.image || this.defaultImage;

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
    this.meta.updateTag({ property: 'og:site_name', content: this.siteName });

    // Twitter Card
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: fullTitle });
    this.meta.updateTag({ name: 'twitter:description', content: description });
    this.meta.updateTag({ name: 'twitter:image', content: image });

    // Article-specific
    if (config.article) {
      if (config.article.author) {
        this.meta.updateTag({ property: 'article:author', content: config.article.author });
      }
      if (config.article.publishedTime) {
        this.meta.updateTag({ property: 'article:published_time', content: config.article.publishedTime });
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
    if (config.type === 'article' && config.article) {
      this.updateJsonLd({
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
        },
        'publisher': {
          '@type': 'Organization',
          'name': this.siteName,
          'url': this.siteUrl,
        },
        'keywords': config.article.tags?.join(', '),
      });
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

  private updateJsonLd(data: Record<string, unknown>) {
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
