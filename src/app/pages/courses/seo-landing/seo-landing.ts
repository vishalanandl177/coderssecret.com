import { Component, inject, signal, computed } from '@angular/core';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { COURSES, Course, CourseSeoPage } from '../../../models/course.model';
import { SeoService } from '../../../services/seo.service';

@Component({
  selector: 'app-seo-landing',
  imports: [RouterLink],
  template: `
    @if (page(); as p) {
    <div class="container max-w-4xl mx-auto px-6 py-16">
      <nav class="mb-8 text-sm text-muted-foreground">
        <a routerLink="/" class="hover:text-foreground transition-colors">Home</a>
        <span class="mx-2">/</span>
        <a routerLink="/courses" class="hover:text-foreground transition-colors">Courses</a>
        <span class="mx-2">/</span>
        <span class="text-foreground">{{ p.title }}</span>
      </nav>

      <article class="course-content max-w-none" [innerHTML]="safeContent()"></article>

      <div class="mt-12 rounded-xl border border-primary/30 bg-primary/5 p-8 text-center">
        <h2 class="text-2xl font-bold mb-3">Ready to Learn?</h2>
        <p class="text-muted-foreground mb-6">Start with our free {{ courseTitle() }} course &mdash; {{ courseModuleCount() }} modules, {{ totalLabs() }} hands-on labs, completely free.</p>
        <div class="flex flex-wrap justify-center gap-3">
          <a [routerLink]="ctaModuleUrl()"
             class="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
            Start Module {{ p.ctaModule }} &mdash; Free
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </a>
          <a [routerLink]="'/courses/' + courseSlug()"
             class="inline-flex items-center rounded-full border border-border/60 bg-card/60 px-6 py-3 text-sm font-semibold text-foreground hover:bg-accent transition-all duration-300">
            View Full Curriculum
          </a>
        </div>
      </div>
    </div>
    }
  `,
})
export class SeoLandingComponent {
  page = signal<CourseSeoPage | undefined>(undefined);
  course = signal<Course | undefined>(undefined);
  private seo = inject(SeoService);
  private sanitizer = inject(DomSanitizer);

  courseTitle = computed(() => this.course()?.title ?? 'Mastering SPIFFE & SPIRE');
  courseSlug = computed(() => this.course()?.slug ?? 'mastering-spiffe-spire');
  courseModuleCount = computed(() => this.course()?.modules.length ?? 13);
  totalLabs = computed(() => this.course()?.modules.reduce((sum, m) => sum + m.labs.length, 0) ?? 30);
  ctaModuleUrl = computed(() => {
    const c = this.course();
    const p = this.page();
    const target = c && p ? c.modules.find(m => m.number === p.ctaModule) : undefined;
    return c && target ? `/courses/${c.slug}/${target.slug}` : `/courses/${this.courseSlug()}`;
  });

  safeContent = computed<SafeHtml>(() => {
    const p = this.page();
    if (!p?.content) return '';
    return this.sanitizer.bypassSecurityTrustHtml(p.content);
  });

  constructor() {
    const route = inject(ActivatedRoute);
    const router = inject(Router);
    const slug = route.snapshot.paramMap.get('seoSlug') ?? '';

    let found: CourseSeoPage | undefined;
    let foundCourse: Course | undefined;
    for (const course of COURSES) {
      found = course.seoPages.find(p => p.slug === slug);
      if (found) {
        foundCourse = course;
        break;
      }
    }

    if (found) {
      this.page.set(found);
      this.course.set(foundCourse);
      this.seo.update({
        title: found.title,
        description: found.description,
        url: `/courses/${found.slug}`,
        breadcrumbs: [
          { name: 'Home', url: '/' },
          { name: 'Courses', url: '/courses' },
          { name: found.title, url: `/courses/${found.slug}` },
        ],
      });
    } else {
      router.navigate(['/not-found']);
    }
  }
}
