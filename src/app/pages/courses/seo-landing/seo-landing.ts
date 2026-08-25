import { Component, inject, signal, computed } from '@angular/core';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import type { CourseSeoPage } from '../../../models/course.model';
import type { CourseModuleOutline, CourseOutline } from '../../../models/course-outline';
import { loadCourseBySeoSlug } from '../../../models/course-loader';
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
                <li><a [routerLink]="'/courses/' + courseSlug()">{{ courseTitle() }}</a></li>
                <li aria-hidden="true">/</li>
                <li aria-current="page">{{ p.title }}</li>
              </ol>
            </nav>
            <div class="md3-course-seo-copy">
              <p class="md3-course-eyebrow">Course guide</p>
              <h1>{{ p.title }}</h1>
              <p class="md3-course-seo-text">{{ p.description }}</p>
              <p class="md3-course-seo-text">Maintained by <a routerLink="/about">Vishal Anand</a>.</p>
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

        <section class="md3-course-tonal-section md3-section">
          <div class="md3-container">
            <div class="md3-course-section-heading">
              <p class="md3-course-eyebrow">Learning path</p>
              <h2>Continue from concept to implementation</h2>
              <p>These course modules place this topic in context, connect it to adjacent decisions, and provide the practical next step.</p>
            </div>
            <div class="md3-course-related-grid md3-course-guide-grid">
              @for (mod of learningPath(); track mod.number) {
                <a [routerLink]="'/courses/' + courseSlug() + '/' + mod.slug" class="md3-course-related-card">
                  <p class="md3-course-info-kicker">Module {{ mod.number }}</p>
                  <h3>{{ mod.title }}</h3>
                  <p>{{ mod.subtitle }}</p>
                  <p>{{ mod.duration }} | {{ mod.objectives.length }} learning objectives</p>
                </a>
              }
            </div>

            @if (targetModule(); as target) {
              <div class="md3-course-guide-objectives">
                <div class="md3-course-section-heading">
                  <p class="md3-course-eyebrow">Practical outcomes</p>
                  <h2>What the recommended module teaches</h2>
                </div>
                <ul class="md3-course-list">
                  @for (objective of target.objectives; track objective) {
                    <li><span class="md3-course-list-marker" aria-hidden="true">-</span><span>{{ objective }}</span></li>
                  }
                </ul>
              </div>
            }
          </div>
        </section>
      </main>
    }
  `,
})
export class SeoLandingComponent {
  page = signal<CourseSeoPage | undefined>(undefined);
  course = signal<CourseOutline | undefined>(undefined);
  private seo = inject(SeoService);
  private sanitizer = inject(DomSanitizer);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  courseTitle = computed(() => this.course()?.title ?? 'Mastering SPIFFE & SPIRE');
  courseSlug = computed(() => this.course()?.slug ?? 'mastering-spiffe-spire');
  courseModuleCount = computed(() => this.course()?.modules.length ?? 13);
  totalLabs = computed(() => this.course()?.modules.reduce((sum, m) => sum + m.labs.length, 0) ?? 30);
  targetModule = computed<CourseModuleOutline | undefined>(() => {
    const c = this.course();
    const p = this.page();
    return c && p ? c.modules.find(module => module.number === p.ctaModule) : undefined;
  });
  learningPath = computed<CourseModuleOutline[]>(() => {
    const c = this.course();
    const target = this.targetModule();
    if (!c || !target) return [];

    const targetIndex = c.modules.findIndex(module => module.number === target.number);
    const visibleCount = Math.min(3, c.modules.length);
    const startIndex = Math.max(0, Math.min(targetIndex - 1, c.modules.length - visibleCount));
    return c.modules.slice(startIndex, startIndex + visibleCount);
  });
  ctaModuleUrl = computed(() => {
    const c = this.course();
    const target = this.targetModule();
    return c && target ? `/courses/${c.slug}/${target.slug}` : `/courses/${this.courseSlug()}`;
  });

  safeContent = computed<SafeHtml>(() => {
    const p = this.page();
    if (!p?.content) return '';
    const contentWithoutDuplicateH1 = p.content.replace(/<h1[^>]*>[\s\S]*?<\/h1>/i, '');
    return this.sanitizer.bypassSecurityTrustHtml(contentWithoutDuplicateH1);
  });

  constructor() {
    const slug = this.route.snapshot.paramMap.get('seoSlug') ?? '';
    void this.loadPage(slug);
  }

  private async loadPage(slug: string): Promise<void> {
    const result = await loadCourseBySeoSlug(slug);
    if (result) {
      const { page: found, course: foundCourse } = result;
      const image = this.courseImage(foundCourse.slug);
      const imageHeight = foundCourse.slug === 'distributed-systems-engineering'
        || foundCourse.slug === 'centralized-authentication-authorization-envoy'
        ? 630
        : 480;
      this.page.set(found);
      this.course.set(foundCourse);
      this.seo.update({
        title: found.title,
        description: found.description,
        url: `/courses/${found.slug}`,
        image,
        imageWidth: 1200,
        imageHeight,
        ...(found.indexable === true ? {} : { robots: 'noindex,follow' }),
        breadcrumbs: [
          { name: 'Home', url: '/' },
          { name: 'Courses', url: '/courses' },
          ...(foundCourse ? [{ name: foundCourse.title, url: `/courses/${foundCourse.slug}` }] : []),
          { name: found.title, url: `/courses/${found.slug}` },
        ],
        jsonLd: {
          '@context': 'https://schema.org',
          '@type': 'TechArticle',
          'headline': found.title,
          'description': found.description,
          'url': `https://coderssecret.com/courses/${found.slug}`,
          'isPartOf': {
            '@type': 'Course',
            'name': foundCourse.title,
            'url': `https://coderssecret.com/courses/${foundCourse.slug}`,
          },
          'author': {
            '@type': 'Person',
            'name': 'Vishal Anand',
            'url': 'https://coderssecret.com/about',
          },
          'publisher': {
            '@type': 'Organization',
            'name': 'CodersSecret',
            'url': 'https://coderssecret.com',
          },
          'inLanguage': 'en',
        },
      });
    } else {
      this.router.navigate(['/not-found']);
    }
  }

  private courseImage(courseSlug: string): string {
    const images: Record<string, string> = {
      'mastering-spiffe-spire': '/images/banners/course-mastering-spiffe-spire.svg',
      'cloud-native-security-engineering': '/images/banners/course-cloud-native-security-engineering.svg',
      'production-rag-systems-engineering': '/images/banners/course-production-rag-systems-engineering.svg',
      'distributed-systems-engineering': '/og-image.svg',
      'production-analytics-engineering-dbt': '/images/banners/course-production-analytics-engineering-dbt.svg',
      'centralized-authentication-authorization-envoy': '/images/banners/course-centralized-authentication-authorization-envoy.svg',
      'malware-analysis-defense': '/images/banners/course-malware-analysis-defense.svg',
    };
    return `https://coderssecret.com${images[courseSlug] ?? '/og-image.svg'}`;
  }
}
