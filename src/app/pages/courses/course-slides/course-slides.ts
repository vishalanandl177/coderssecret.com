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

    // Why This Matters slide
    if (mod.whyThisMatters) {
      generatedSlides.push({
        type: 'content',
        eyebrow: 'Why This Matters',
        title: 'Why This Module Matters',
        body: mod.whyThisMatters.substring(0, 200) + (mod.whyThisMatters.length > 200 ? '...' : ''),
        narration: mod.whyThisMatters,
      });
    }

    // Before/After transformation slide
    if (mod.beforeAfter) {
      generatedSlides.push({
        type: 'grid',
        eyebrow: 'Transformation',
        title: 'Before vs After',
        items: [
          ...mod.beforeAfter.before.map(b => ({ title: 'Before: ' + b, desc: '' })),
          ...mod.beforeAfter.after.map(a => ({ title: 'After: ' + a, desc: '' })),
        ],
        narration: `Before: ${mod.beforeAfter.before.join('. ')}. After: ${mod.beforeAfter.after.join('. ')}.`,
      });
    }

    // Content sections from HTML
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

    // Real-World Use Cases slide
    if (mod.realWorldUseCases && mod.realWorldUseCases.length > 0) {
      generatedSlides.push({
        type: 'grid',
        eyebrow: 'Real World',
        title: 'Real-World Use Cases',
        items: mod.realWorldUseCases.map(uc => ({ title: uc, desc: '' })),
        narration: `Real-world use cases for this module include: ${mod.realWorldUseCases.join('. ')}.`,
      });
    }

    // Common Mistakes slide
    if (mod.commonMistakes && mod.commonMistakes.length > 0) {
      generatedSlides.push({
        type: 'grid',
        eyebrow: 'Watch Out',
        title: 'Common Mistakes to Avoid',
        items: mod.commonMistakes.slice(0, 5).map(m => ({ title: m, desc: '' })),
        narration: `Common mistakes engineers make: ${mod.commonMistakes.join('. ')}.`,
      });
    }

    // Production Notes slide
    if (mod.productionNotes && mod.productionNotes.length > 0) {
      generatedSlides.push({
        type: 'content',
        eyebrow: 'Production',
        title: 'Production Notes',
        bullets: mod.productionNotes,
        narration: `Important production notes: ${mod.productionNotes.join('. ')}.`,
      });
    }

    // Design Tradeoffs slide
    if (mod.designTradeoffs && mod.designTradeoffs.length > 0) {
      generatedSlides.push({
        type: 'grid',
        eyebrow: 'Tradeoffs',
        title: 'Design Tradeoffs',
        items: mod.designTradeoffs.map(t => ({
          title: t.option,
          desc: 'Pros: ' + t.pros.join(', ') + ' | Cons: ' + t.cons.join(', '),
        })),
        narration: `Design tradeoffs to consider: ${mod.designTradeoffs.map(t => t.option + '. Pros: ' + t.pros.join(', ') + '. Cons: ' + t.cons.join(', ')).join('. ')}.`,
      });
    }

    // Security Risks slide
    if (mod.securityRisks && mod.securityRisks.length > 0) {
      generatedSlides.push({
        type: 'grid',
        eyebrow: 'Security',
        title: 'Security Risks to Watch',
        items: mod.securityRisks.map(r => ({ title: r, desc: '' })),
        narration: `Security risks to be aware of: ${mod.securityRisks.join('. ')}.`,
      });
    }

    // Think Like an Engineer slide
    if (mod.thinkLikeAnEngineer && mod.thinkLikeAnEngineer.length > 0) {
      generatedSlides.push({
        type: 'grid',
        eyebrow: 'Think Deeper',
        title: 'Think Like a Platform Engineer',
        items: mod.thinkLikeAnEngineer.map(q => ({ title: q, desc: '' })),
        narration: `Architecture thinking questions: ${mod.thinkLikeAnEngineer.join('. ')}.`,
      });
    }

    // Operational Story slide
    if (mod.operationalStory) {
      generatedSlides.push({
        type: 'content',
        eyebrow: 'Production Story',
        title: 'From the Field',
        body: mod.operationalStory.substring(0, 250) + (mod.operationalStory.length > 250 ? '...' : ''),
        narration: mod.operationalStory,
      });
    }

    // Labs slide
    if (mod.labs.length > 0) {
      generatedSlides.push({
        type: 'grid',
        eyebrow: 'Hands-On',
        title: 'Hands-On Labs',
        items: mod.labs.map(lab => ({ title: lab.title, desc: lab.objective })),
        narration: `This module includes ${mod.labs.length} hands-on labs: ${mod.labs.map(l => l.title).join(', ')}.`,
      });
    }

    // Key Takeaways slide
    generatedSlides.push({
      type: 'grid',
      eyebrow: 'Summary',
      title: 'Key Takeaways',
      items: mod.keyTakeaways.map(t => ({ title: t, desc: '' })),
      narration: `Let us recap the key takeaways from this module. ${mod.keyTakeaways.join('. ')}.`,
    });

    // Career Relevance slide
    if (mod.careerRelevance) {
      generatedSlides.push({
        type: 'content',
        eyebrow: 'Career Impact',
        title: 'Why This Skill Matters',
        body: mod.careerRelevance,
        narration: mod.careerRelevance,
      });
    }

    // End slide
    generatedSlides.push({
      type: 'end',
      title: `Module ${mod.number} Complete!`,
      subtitle: mod.number < course.modules.length
        ? `Next up: Module ${mod.number + 1} — ${course.modules[mod.number]?.title}`
        : 'Congratulations! You have completed the entire course.',
      narration: mod.number < course.modules.length
        ? `You have completed Module ${mod.number}. Great work! Next up is Module ${mod.number + 1}: ${course.modules[mod.number]?.title}.`
        : `Congratulations! You have completed the entire course. You are now equipped with production-grade cloud-native security skills.`,
    });

    this.slides.set(generatedSlides);
    this.seo.update({
      title: `Module ${mod.number}: ${mod.title} — Slides | CodersSecret`,
      description: mod.subtitle,
    });
  }
}
