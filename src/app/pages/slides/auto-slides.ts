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

    // Title narration — welcoming, sets expectations
    const titleNarration = `Welcome to this walkthrough on ${title}. ${excerpt} In the next few minutes, we'll cover the key concepts, the practical how-to, and the trade-offs you should know about. Keep an ear on the narration — the slides highlight the essentials, but the narration walks you through the details. Let's get started.`;

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
      "Moving on,",
      "Next up is",
      "Here's where it gets interesting —",
      "Now we come to",
      "This next bit covers",
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

      // Slide content = CONCISE highlights (first sentence only, max 140 chars)
      const bodyTeaser = this.firstSentence(paragraphs, 140);

      // Narration = DETAILED explanation (uses full paragraph + bullets + framing)
      const narration = this.buildNarration({
        transition,
        heading: sec.heading,
        paragraphs,
        bullets,
        hasCode: codeBlocks.length > 0,
        hasBullets: bullets.length >= 3,
      });

      if (codeBlocks.length > 0) {
        slides.push({
          type: 'code',
          eyebrow,
          title: sec.heading,
          body: bodyTeaser,
          code: codeBlocks[0].code,
          lang: codeBlocks[0].lang,
          narration,
        });

        for (let c = 1; c < Math.min(codeBlocks.length, 3); c++) {
          slides.push({
            type: 'code',
            eyebrow,
            title: sec.heading,
            code: codeBlocks[c].code,
            lang: codeBlocks[c].lang,
            narration: this.buildCodeFollowupNarration(sec.heading, c),
          });
        }
      } else if (bullets.length >= 3) {
        slides.push({
          type: 'content',
          eyebrow,
          title: sec.heading,
          body: bodyTeaser,
          bullets: bullets.slice(0, 6).map(b => this.trim(b, 100)),
          narration,
        });
      } else if (paragraphs.length > 0) {
        // Pure content slide — show only a short teaser + key phrases
        const keyPhrases = this.extractKeyPhrases(paragraphs, 3);
        if (keyPhrases.length >= 2) {
          slides.push({
            type: 'content',
            eyebrow,
            title: sec.heading,
            body: bodyTeaser,
            bullets: keyPhrases,
            narration,
          });
        } else {
          slides.push({
            type: 'content',
            eyebrow,
            title: sec.heading,
            body: this.firstSentence(paragraphs, 260),
            narration,
          });
        }
      }
    }

    // End narration — conversational closing, points back to article
    slides.push({
      type: 'end',
      title: 'Thanks for watching.',
      subtitle: `You now know the essentials of ${title}. Head back to the full article for code examples, diagrams, and deeper discussions.`,
      narration: `And that wraps up our walkthrough on ${title}. Hopefully the key ideas feel a bit clearer now — the what, the why, and the how. If you want to go deeper, head back to the full article where you'll find the complete code examples, the diagrams, and comments from other engineers who've implemented this. Thanks so much for watching — I'll see you in the next one.`,
    });

    return slides;
  }

  /**
   * Build detailed conversational narration that goes BEYOND what's on the slide.
   * The narration should explain, contextualize, and add value — not just read the slide.
   */
  private buildNarration(opts: {
    transition: string;
    heading: string;
    paragraphs: string;
    bullets: string[];
    hasCode: boolean;
    hasBullets: boolean;
  }): string {
    const { transition, heading, paragraphs, bullets, hasCode, hasBullets } = opts;
    const sentences = this.splitSentences(paragraphs);

    const parts: string[] = [];
    parts.push(`${transition} ${heading.toLowerCase()}.`);

    // Conceptual intro based on content shape
    if (hasCode) {
      parts.push(`You'll see some code on screen — let me walk you through what it's actually doing.`);
    } else if (hasBullets) {
      parts.push(`There are a few key points here worth unpacking.`);
    }

    // Main content: use up to 8 sentences for rich detail
    const mainBody = sentences.slice(0, 8).join(' ');
    if (mainBody) {
      parts.push(mainBody);
    } else if (bullets.length > 0) {
      parts.push(bullets.slice(0, 4).map(b => this.ensurePeriod(b)).join(' '));
    }

    // Closing framing if content is short
    if (parts.join(' ').length < 250) {
      parts.push(`Keep this in mind as we move on — it'll come up again.`);
    }

    return parts.join(' ').replace(/\s+/g, ' ').trim();
  }

  private buildCodeFollowupNarration(heading: string, idx: number): string {
    const intros = [
      `Here's another angle on ${heading}.`,
      `Let's look at one more example for ${heading}.`,
      `And here's a related pattern in the same space.`,
    ];
    return `${intros[idx % intros.length]} Read through it — the shape should feel familiar now. The key thing to notice is how this piece connects to what we just covered.`;
  }

  /** First sentence of text, truncated to max length */
  private firstSentence(text: string, maxLen: number): string {
    const s = this.splitSentences(text)[0] ?? text;
    return this.trim(s, maxLen);
  }

  /** Extract 2-4 short key phrases from longer text for visual bullets */
  private extractKeyPhrases(text: string, max: number): string[] {
    const sentences = this.splitSentences(text);
    // Pick sentences that are short-ish (good for display) and interesting
    const short = sentences.filter(s => s.length >= 20 && s.length <= 110);
    return short.slice(0, max).map(s => this.stripTrailingPunctuation(s));
  }

  private trim(s: string, max: number): string {
    if (s.length <= max) return s;
    return s.slice(0, max - 1).replace(/[,;:.\s]*$/, '') + '…';
  }

  private stripTrailingPunctuation(s: string): string {
    return s.replace(/[.!?]+$/, '').trim();
  }

  private ensurePeriod(s: string): string {
    return /[.!?]$/.test(s.trim()) ? s : s.trim() + '.';
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
