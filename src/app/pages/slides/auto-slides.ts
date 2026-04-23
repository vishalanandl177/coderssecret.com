import { Component, inject, signal, computed, OnDestroy } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BLOG_POSTS, CATEGORIES } from '../../models/blog-post.model';
import { SeoService } from '../../services/seo.service';
import { SlidePlayerComponent, SlideData } from '../../components/slide-player/slide-player';

@Component({
  selector: 'app-auto-slides',
  standalone: true,
  imports: [SlidePlayerComponent, RouterLink],
  template: `
    @if (slides().length) {
      <app-slide-player
        [slides]="slides()"
        [deckTitle]="deckTitle()"
        [backUrl]="backUrl()" />
    } @else {
      <div class="min-h-screen flex items-center justify-center">
        <div class="text-center">
          <h1 class="text-2xl font-bold mb-4">Post not found</h1>
          <a routerLink="/blog" class="text-primary underline">Back to Blog</a>
        </div>
      </div>
    }
  `,
})
export class AutoSlidesComponent {
  private route = inject(ActivatedRoute);
  private seo = inject(SeoService);

  slides = signal<SlideData[]>([]);
  deckTitle = signal('');
  backUrl = signal('/blog');

  constructor() {
    this.route.paramMap.pipe(takeUntilDestroyed()).subscribe(params => {
      const slug = params.get('slug');
      const post = BLOG_POSTS.find(p => p.slug === slug);
      if (!post) return;

      this.deckTitle.set(post.title);
      this.backUrl.set(`/blog/${post.slug}`);

      const category = CATEGORIES.find(c => c.slug === post.category);
      const categoryName = category?.name ?? post.category;

      this.seo.update({
        title: `${post.title} — Interactive Slides`,
        description: `Learn "${post.title}" through interactive slides with voice narration. ${post.excerpt}`,
        url: `/slides/${post.slug}`,
        breadcrumbs: [
          { name: 'Home', url: '/' },
          { name: 'Blog', url: '/blog' },
          { name: post.title, url: `/blog/${post.slug}` },
          { name: 'Slides', url: `/slides/${post.slug}` },
        ],
      });

      this.slides.set(this.generateSlides(post.title, post.excerpt, post.content, post.tags, categoryName));
    });
  }

  private generateSlides(title: string, excerpt: string, html: string, tags: string[], category: string): SlideData[] {
    const slides: SlideData[] = [];

    const titleNarration = `Welcome! In this walkthrough, we'll cover "${title}". ${excerpt} Let's dive in.`;
    slides.push({
      type: 'title',
      title,
      subtitle: excerpt,
      tags: [category, ...tags.slice(0, 3)],
      narration: titleNarration,
    });

    const sections = this.splitOnH2(html);

    const transitions = [
      "Let's start with",
      "Next up,",
      "Now let's look at",
      "Moving on to",
      "Here's where it gets interesting —",
      "This next part covers",
      "Let's walk through",
      "Now we'll dig into",
    ];

    for (let i = 0; i < sections.length; i++) {
      const sec = sections[i];
      const eyebrow = `${String(i + 1).padStart(2, '0')} / ${String(sections.length).padStart(2, '0')}`;
      const transition = transitions[i % transitions.length];

      const codeBlocks = this.extractCode(sec.html);
      const bullets = this.extractBullets(sec.html);
      const paragraphs = this.extractParagraphs(sec.html);

      const detailedNarration = this.buildNarration(transition, sec.heading, paragraphs, bullets, codeBlocks.length > 0);

      if (codeBlocks.length > 0) {
        slides.push({
          type: 'code',
          eyebrow,
          title: sec.heading,
          body: paragraphs.slice(0, 220),
          code: codeBlocks[0].code,
          lang: codeBlocks[0].lang,
          narration: detailedNarration,
        });

        for (let c = 1; c < Math.min(codeBlocks.length, 3); c++) {
          slides.push({
            type: 'code',
            eyebrow,
            title: sec.heading + ' (continued)',
            code: codeBlocks[c].code,
            lang: codeBlocks[c].lang,
            narration: `Here's another code example for ${sec.heading}. Take a moment to look through it — the patterns will become clearer as we move forward.`,
          });
        }
      } else if (bullets.length >= 3) {
        slides.push({
          type: 'content',
          eyebrow,
          title: sec.heading,
          body: paragraphs.slice(0, 200),
          bullets: bullets.slice(0, 8),
          narration: detailedNarration,
        });
      } else if (paragraphs.length > 0) {
        slides.push({
          type: 'content',
          eyebrow,
          title: sec.heading,
          body: paragraphs.slice(0, 500),
          narration: detailedNarration,
        });
      }
    }

    slides.push({
      type: 'end',
      title: 'Thanks for watching.',
      subtitle: `That wraps up "${title}". Head back to the full article for code examples, diagrams, and comments.`,
      narration: `And that's it for this tutorial on "${title}". You've now got the full picture. If you want to dig deeper, head back to the full article where you'll find the complete code examples, diagrams, and comments from the community. Thanks for watching — see you in the next one.`,
    });

    return slides;
  }

  /**
   * Build a natural, conversational narration from section content.
   * Goal: ~40-120 words per slide, using transition phrases and full sentences.
   */
  private buildNarration(transition: string, heading: string, paragraphs: string, bullets: string[], hasCode: boolean): string {
    const sentences = this.splitSentences(paragraphs);
    let narration = `${transition} ${heading.toLowerCase().startsWith('the ') || heading.toLowerCase().startsWith('a ') || heading.toLowerCase().startsWith('an ') ? heading : heading}. `;

    // Use first 3-5 sentences for detailed context
    const contentSentences = sentences.slice(0, 5).join(' ');
    if (contentSentences) {
      narration += contentSentences + ' ';
    } else if (bullets.length > 0) {
      // Fall back to first few bullets
      narration += bullets.slice(0, 3).join('. ') + '. ';
    }

    if (hasCode) {
      narration += `Take a look at the code on screen — we'll break it down together. `;
    }

    return narration.trim();
  }

  private splitSentences(text: string): string[] {
    if (!text) return [];
    // Split on sentence boundaries but preserve abbreviations
    return text
      .replace(/([.!?])\s+(?=[A-Z])/g, '$1|SPLIT|')
      .split('|SPLIT|')
      .map(s => s.trim())
      .filter(s => s.length > 10);
  }

  private splitOnH2(html: string): { heading: string; html: string }[] {
    const parts: { heading: string; html: string }[] = [];
    const regex = /<h2[^>]*>(.*?)<\/h2>/gi;
    let match: RegExpExecArray | null;
    let lastIndex = 0;
    let lastHeading = '';

    while ((match = regex.exec(html)) !== null) {
      if (lastHeading) {
        parts.push({ heading: lastHeading, html: html.slice(lastIndex, match.index) });
      }
      lastHeading = match[1].replace(/<[^>]+>/g, '').trim();
      lastIndex = match.index + match[0].length;
    }

    if (lastHeading) {
      parts.push({ heading: lastHeading, html: html.slice(lastIndex) });
    }

    return parts;
  }

  private extractCode(html: string): { code: string; lang: string }[] {
    const blocks: { code: string; lang: string }[] = [];
    const regex = /<pre[^>]*><code[^>]*>([\s\S]*?)<\/code><\/pre>|<pre[^>]*>([\s\S]*?)<\/pre>/gi;
    let match: RegExpExecArray | null;
    while ((match = regex.exec(html)) !== null) {
      const raw = (match[1] || match[2] || '').trim();
      const decoded = raw
        .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&').replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'").replace(/&#96;/g, '`')
        .replace(/<[^>]+>/g, '');
      if (decoded.length > 10 && decoded.length < 2000) {
        const langMatch = match[0].match(/class="[^"]*language-(\w+)/i);
        blocks.push({ code: decoded, lang: langMatch?.[1] ?? 'code' });
      }
    }
    return blocks;
  }

  private extractBullets(html: string): string[] {
    const bullets: string[] = [];
    const regex = /<li[^>]*>([\s\S]*?)<\/li>/gi;
    let match: RegExpExecArray | null;
    while ((match = regex.exec(html)) !== null) {
      const text = match[1].replace(/<[^>]+>/g, '').trim();
      if (text.length > 5 && text.length < 300) bullets.push(text);
    }
    return bullets;
  }

  private extractParagraphs(html: string): string {
    const stripped = html
      .replace(/<pre[\s\S]*?<\/pre>/gi, '')
      .replace(/<ul[\s\S]*?<\/ul>/gi, '')
      .replace(/<ol[\s\S]*?<\/ol>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&[a-z]+;/gi, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    return stripped;
  }

  private htmlToText(html: string): string {
    return html
      .replace(/<[^>]+>/g, ' ')
      .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&').replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'").replace(/&[a-z]+;/gi, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }
}
