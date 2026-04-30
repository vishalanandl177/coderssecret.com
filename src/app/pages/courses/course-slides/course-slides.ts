import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { COURSES } from '../../../models/course.model';
import { SlidePlayerComponent, SlideData } from '../../../components/slide-player/slide-player';
import { SeoService } from '../../../services/seo.service';

@Component({
  selector: 'app-course-slides',
  imports: [SlidePlayerComponent],
  template: `
    @if (slides().length > 0) {
      <app-slide-player
        [slides]="slides()"
        [deckTitle]="deckTitle()"
        [backUrl]="backUrl()" />
    }
  `,
})
export class CourseSlidesComponent {
  slides = signal<SlideData[]>([]);
  deckTitle = signal('');
  backUrl = signal('/courses');
  private seo = inject(SeoService);

  constructor() {
    const route = inject(ActivatedRoute);
    const router = inject(Router);
    const moduleSlug = route.snapshot.paramMap.get('moduleSlug') ?? '';
    const urlSegments = route.snapshot.pathFromRoot.flatMap(r => r.url.map(s => s.path));
    const courseSlugFromUrl = urlSegments[1] || '';
    const course = COURSES.find(c => c.slug === courseSlugFromUrl);

    if (!course) { router.navigate(['/courses']); return; }

    const mod = course.modules.find(m => m.slug === moduleSlug);
    if (!mod) { router.navigate(['/courses/' + course.slug]); return; }

    this.deckTitle.set(`Module ${mod.number}: ${mod.title}`);
    this.backUrl.set(`/courses/${course.slug}/${mod.slug}`);

    const generatedSlides: SlideData[] = [
      {
        type: 'title',
        title: mod.title,
        subtitle: mod.subtitle,
        eyebrow: `Module ${mod.number} of ${course.modules.length}`,
        narration: `Welcome to Module ${mod.number}: ${mod.title}. ${mod.subtitle}. In this module, you will ${mod.objectives.join(', ')}. Let us get started.`,
      },
      {
        type: 'grid',
        title: 'Learning Objectives',
        items: mod.objectives.map(obj => ({ title: obj, desc: '' })),
        narration: `This module covers ${mod.objectives.length} key objectives: ${mod.objectives.join('. ')}.`,
      },
    ];

    const contentHtml = mod.content;
    const h2Regex = /<h2>(.*?)<\/h2>/g;
    let match;
    const sections: { heading: string; body: string }[] = [];
    const h2Indices: number[] = [];
    while ((match = h2Regex.exec(contentHtml)) !== null) {
      h2Indices.push(match.index);
      sections.push({ heading: match[1].replace(/<[^>]+>/g, ''), body: '' });
    }
    for (let i = 0; i < sections.length; i++) {
      const start = h2Indices[i];
      const end = i + 1 < h2Indices.length ? h2Indices[i + 1] : contentHtml.length;
      const sectionHtml = contentHtml.substring(start, end);
      const textOnly = sectionHtml.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      const sentences = textOnly.split(/(?<=[.!?])\s+/).filter(s => s.length > 10);
      sections[i].body = sentences.slice(0, 2).join(' ');

      if (sectionHtml.includes('<pre><code>')) {
        const codeMatch = sectionHtml.match(/<pre><code>([\s\S]*?)<\/code><\/pre>/);
        generatedSlides.push({
          type: 'code',
          title: sections[i].heading,
          code: codeMatch ? codeMatch[1].replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').substring(0, 400) : '',
          narration: sentences.slice(0, 4).join(' '),
        });
      } else {
        generatedSlides.push({
          type: 'content',
          title: sections[i].heading,
          body: sections[i].body,
          narration: sentences.slice(0, 6).join(' '),
        });
      }
    }

    if (mod.labs.length > 0) {
      generatedSlides.push({
        type: 'grid',
        title: 'Hands-On Labs',
        items: mod.labs.map(lab => ({ title: lab.title, desc: lab.objective })),
        narration: `This module includes ${mod.labs.length} hands-on labs: ${mod.labs.map(l => l.title).join(', ')}.`,
      });
    }

    generatedSlides.push({
      type: 'grid',
      title: 'Key Takeaways',
      items: mod.keyTakeaways.map(t => ({ title: t, desc: '' })),
      narration: `Let us recap the key takeaways from this module. ${mod.keyTakeaways.join('. ')}.`,
    });

    generatedSlides.push({
      type: 'end',
      title: `Module ${mod.number} Complete!`,
      subtitle: mod.number < course.modules.length
        ? `Next up: Module ${mod.number + 1} — ${course.modules[mod.number]?.title}`
        : 'Congratulations! You have completed the entire course.',
      narration: mod.number < course.modules.length
        ? `You have completed Module ${mod.number}. Great work! Next up is Module ${mod.number + 1}: ${course.modules[mod.number]?.title}.`
        : `Congratulations! You have completed the entire Mastering SPIFFE and SPIRE course. You are now equipped to deploy zero trust identity in production.`,
    });

    this.slides.set(generatedSlides);
    this.seo.update({
      title: `Module ${mod.number}: ${mod.title} — Slides | CodersSecret`,
      description: mod.subtitle,
    });
  }
}
