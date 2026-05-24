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
      <main class="md3-course-page app-forward">
        <section class="md3-course-seo-hero md3-section">
          <div class="md3-container">
            <nav aria-label="Breadcrumb" class="md3-course-breadcrumb">
              <ol>
                <li><a routerLink="/">Home</a></li>
                <li aria-hidden="true">/</li>
                <li><a routerLink="/courses">Courses</a></li>
                <li aria-hidden="true">/</li>
                <li aria-current="page">{{ p.title }}</li>
              </ol>
            </nav>
            <div class="md3-course-seo-copy">
              <p class="md3-course-eyebrow">Course guide</p>
              <h1>{{ p.title }}</h1>
              <p class="md3-course-seo-text">{{ p.description }}</p>
            </div>
          </div>
        </section>

        <section class="md3-section">
          <div class="md3-container">
            <div class="md3-course-seo-layout">
              <article class="md3-course-article-surface course-content" [innerHTML]="safeContent()"></article>

              <aside class="md3-course-seo-panel" aria-label="Start this course">
                <div class="md3-course-overview-panel-top">
                  <span>Ready to learn?</span>
                  <span>Free</span>
                </div>
                <div class="md3-course-overview-stats">
                  <div class="md3-course-overview-stat">
                    <strong>{{ courseModuleCount() }}</strong>
                    <span>Modules</span>
                  </div>
                  <div class="md3-course-overview-stat">
                    <strong>{{ totalLabs() }}</strong>
                    <span>{{ course()?.labDelivery === 'inline' ? 'Exercises' : 'Labs' }}</span>
                  </div>
                </div>
                <p>{{ courseTitle() }} gives you the practical path behind this topic, with module guides, slides, and production notes.</p>
                <div class="md3-course-seo-actions">
                  <a [routerLink]="ctaModuleUrl()" class="md3-button-filled">
                    Start Module {{ p.ctaModule }}
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                      <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                    </svg>
                  </a>
                  <a [routerLink]="'/courses/' + courseSlug()" class="md3-button-tonal">View full curriculum</a>
                  <a routerLink="/cheatsheets" class="md3-button-outlined">Open reference sheets</a>
                </div>
              </aside>
            </div>
          </div>
        </section>
      </main>
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
    const contentWithoutDuplicateH1 = p.content.replace(/<h1[^>]*>[\s\S]*?<\/h1>/i, '');
    return this.sanitizer.bypassSecurityTrustHtml(contentWithoutDuplicateH1);
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
