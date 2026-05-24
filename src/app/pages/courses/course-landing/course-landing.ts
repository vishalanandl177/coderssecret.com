import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { COURSES, Course, CourseModule } from '../../../models/course.model';
import { SeoService } from '../../../services/seo.service';

@Component({
  selector: 'app-course-landing',
  imports: [RouterLink],
  template: `
    @if (course(); as c) {
      <main class="md3-course-page app-forward">
        <section class="md3-course-detail-hero md3-section">
          <div class="md3-container">
            <nav aria-label="Breadcrumb" class="md3-course-breadcrumb">
              <ol>
                <li><a routerLink="/">Home</a></li>
                <li aria-hidden="true">/</li>
                <li><a routerLink="/courses">Courses</a></li>
                <li aria-hidden="true">/</li>
                <li aria-current="page">{{ c.title }}</li>
              </ol>
            </nav>

            <div class="md3-course-detail-hero-grid">
              <div class="md3-course-detail-copy">
                <p class="md3-course-eyebrow">Free course</p>
                <h1>{{ c.title }}</h1>
                <p class="md3-course-detail-text">{{ c.subtitle }}</p>

                <div class="md3-course-meta-row" aria-label="Course facts">
                  <span class="md3-chip-selected">{{ c.level }}</span>
                  <span class="md3-chip">{{ c.modules.length }} modules</span>
                  <span class="md3-chip">{{ labCountLabel(c) }}</span>
                  <span class="md3-chip">{{ c.totalDuration }}</span>
                </div>

                <div class="md3-course-actions" aria-label="Course actions">
                  <a [routerLink]="firstModuleUrl(c)" class="md3-button-filled md3-button-large">
                    Start Module 1
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                      <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                    </svg>
                  </a>
                  <a href="#curriculum" class="md3-button-tonal md3-button-large">View curriculum</a>
                  @if (c.labDelivery !== 'inline') {
                    <a [href]="courseLabRepositoryUrl(c)" target="_blank" rel="noopener noreferrer" class="md3-button-outlined md3-button-large">
                      Lab repository
                    </a>
                  }
                </div>
              </div>

              <aside class="md3-course-overview-panel" aria-label="Course overview">
                <div class="md3-course-overview-panel-top">
                  <span>{{ c.category }}</span>
                  <span>{{ courseIconLabel(c) }}</span>
                </div>
                <div class="md3-course-overview-stats">
                  <div class="md3-course-overview-stat">
                    <strong>{{ c.modules.length }}</strong>
                    <span>Modules</span>
                  </div>
                  <div class="md3-course-overview-stat">
                    <strong>{{ totalLabsFor(c) }}</strong>
                    <span>{{ c.labDelivery === 'inline' ? 'Exercises' : 'Labs' }}</span>
                  </div>
                </div>
                <div class="md3-course-overview-list">
                  <span>Outcome: {{ courseFocus(c) }}</span>
                  <a [routerLink]="firstModuleSlidesUrl(c)">Preview Module 1 slides</a>
                  <a routerLink="/cheatsheets">Use reference sheets</a>
                </div>
              </aside>
            </div>
          </div>
        </section>

        <section class="md3-section">
          <div class="md3-container">
            <div class="md3-course-section-heading centered">
              <p class="md3-course-eyebrow">Outcomes</p>
              <h2>What you will be able to build and explain</h2>
              <p>Each outcome is tied to architecture, operational judgement, or a concrete deployment habit you can reuse at work.</p>
            </div>

            <div class="md3-course-outcome-grid">
              @for (outcome of courseOutcomes(c); track outcome; let i = $index) {
                <article class="md3-course-outcome-card">
                  <span class="md3-course-outcome-icon" aria-hidden="true">{{ i + 1 }}</span>
                  <h3>Outcome {{ i + 1 }}</h3>
                  <p>{{ outcome }}</p>
                </article>
              }
            </div>
          </div>
        </section>

        <section class="md3-course-tonal-section md3-section">
          <div class="md3-container">
            <div class="md3-course-section-heading">
              <p class="md3-course-eyebrow">Learning loop</p>
              <h2>Learn the model, practice the decision, keep the checklist</h2>
              <p>{{ c.description }}</p>
            </div>

            <div class="md3-course-callout-grid">
              <article class="md3-course-info-card">
                <p class="md3-course-info-kicker">01</p>
                <h3>Inspect the architecture</h3>
                <p>Start every module with the system model: components, trust boundaries, data flow, and the production problem it solves.</p>
              </article>
              <article class="md3-course-info-card">
                <p class="md3-course-info-kicker">02</p>
                <h3>Practice the failure mode</h3>
                <p>Labs and exercises focus on the operational edge cases that separate tutorial knowledge from production confidence.</p>
              </article>
              <article class="md3-course-info-card">
                <p class="md3-course-info-kicker">03</p>
                <h3>Ship with judgement</h3>
                <p>Production notes, common mistakes, and tradeoffs make the course useful when you are designing or reviewing real systems.</p>
              </article>
            </div>
          </div>
        </section>

        <section class="md3-section">
          <div class="md3-container">
            <div class="md3-course-section-heading">
              <p class="md3-course-eyebrow">Good fit</p>
              <h2>Who should take this course?</h2>
              <p>This course is written for engineers who need practical production context, not abstract theory.</p>
            </div>
            <div class="md3-course-audience-grid">
              @for (audience of c.targetAudience; track audience) {
                <article class="md3-course-audience-card">
                  <span class="md3-course-list-marker" aria-hidden="true">+</span>
                  <p>{{ audience }}</p>
                </article>
              }
            </div>
          </div>
        </section>

        <section id="curriculum" class="md3-course-tonal-section md3-section">
          <div class="md3-container">
            <div class="md3-course-section-heading">
              <p class="md3-course-eyebrow">Curriculum</p>
              <h2>Full course path</h2>
              <p>{{ c.modules.length }} modules, {{ labCountLabel(c) }}, {{ c.totalDuration }} of production-focused learning.</p>
            </div>

            <div class="md3-course-curriculum-list">
              @for (mod of c.modules; track mod.number) {
                <article class="md3-course-module-disclosure">
                  <button
                    type="button"
                    class="md3-course-disclosure-button"
                    (click)="toggleModule(mod.number)"
                    [attr.aria-expanded]="openModules().has(mod.number)"
                    [attr.aria-controls]="'course-module-' + mod.number">
                    <span class="md3-course-disclosure-title">
                      <span class="md3-course-module-number" aria-hidden="true">{{ mod.number }}</span>
                      <span class="md3-course-disclosure-copy">
                        <strong>{{ mod.title }}</strong>
                        <span>{{ mod.subtitle }}</span>
                      </span>
                    </span>
                    <span class="md3-course-disclosure-meta">
                      {{ mod.duration }} | {{ moduleLabLabel(mod, c) }}
                    </span>
                    <svg class="md3-course-disclosure-icon" [class.open]="openModules().has(mod.number)"
                         xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                      <path d="m6 9 6 6 6-6"/>
                    </svg>
                  </button>
                  @if (openModules().has(mod.number)) {
                    <div [id]="'course-module-' + mod.number" class="md3-course-disclosure-body">
                      <div class="md3-course-module-grid">
                        <div class="md3-course-info-card">
                          <h3>Objectives</h3>
                          <ul class="md3-course-list">
                            @for (obj of mod.objectives; track obj) {
                              <li><span class="md3-course-list-marker" aria-hidden="true">-</span><span>{{ obj }}</span></li>
                            }
                          </ul>
                        </div>
                        <div class="md3-course-info-card">
                          <h3>{{ c.labDelivery === 'inline' ? 'Exercises' : 'Labs' }}</h3>
                          @if (mod.labs.length > 0) {
                            <ul class="md3-course-list">
                              @for (lab of mod.labs; track lab.title) {
                                <li><span class="md3-course-list-marker" aria-hidden="true">-</span><span>{{ lab.title }}</span></li>
                              }
                            </ul>
                          } @else {
                            <p>This module is concept-first and prepares you for the next practical step.</p>
                          }
                        </div>
                        <div class="md3-course-info-card">
                          <h3>Open module</h3>
                          <p>Read the guide, use the slides for review, then work through the practice material.</p>
                          <div class="md3-course-seo-actions">
                            <a [routerLink]="'/courses/' + c.slug + '/' + mod.slug" class="md3-button-filled">Start module</a>
                            <a [routerLink]="'/courses/' + c.slug + '/' + mod.slug + '/slides'" class="md3-button-tonal">Watch slides</a>
                          </div>
                        </div>
                      </div>
                    </div>
                  }
                </article>
              }
            </div>
          </div>
        </section>

        <section class="md3-section">
          <div class="md3-container">
            <div class="md3-course-resource-panel">
              <div>
                <p class="md3-course-eyebrow">Instructor</p>
                <h2>{{ c.instructor.name }}</h2>
                <p><strong>{{ c.instructor.title }}</strong></p>
                <p>{{ c.instructor.bio }}</p>
              </div>
              <div class="md3-course-resource-links">
                <a [href]="c.instructor.github" target="_blank" rel="noopener noreferrer">GitHub profile</a>
                <a routerLink="/about">About CodersSecret</a>
                <a routerLink="/consultation">Consulting</a>
              </div>
            </div>
          </div>
        </section>

        @if (c.faqs && c.faqs.length > 0) {
          <section class="md3-course-tonal-section md3-section">
            <div class="md3-container">
              <div class="md3-course-section-heading">
                <p class="md3-course-eyebrow">FAQ</p>
                <h2>Questions before you start</h2>
              </div>
              <div class="md3-course-faq-list">
                @for (faq of c.faqs; track faq.question) {
                  <article class="md3-course-faq-item">
                    <button
                      type="button"
                      class="md3-course-faq-button"
                      (click)="toggleFaq(faq.question)"
                      [attr.aria-expanded]="openFaqs().has(faq.question)"
                      [attr.aria-controls]="'course-faq-' + $index">
                      <strong>{{ faq.question }}</strong>
                      <svg class="md3-course-faq-icon" [class.open]="openFaqs().has(faq.question)"
                           xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                           stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <path d="m6 9 6 6 6-6"/>
                      </svg>
                    </button>
                    @if (openFaqs().has(faq.question)) {
                      <div [id]="'course-faq-' + $index" class="md3-course-faq-body">
                        {{ faq.answer }}
                      </div>
                    }
                  </article>
                }
              </div>
            </div>
          </section>
        }

        <section class="md3-section">
          <div class="md3-container">
            <div class="md3-course-section-heading">
              <p class="md3-course-eyebrow">Topics</p>
              <h2>Course reference tags</h2>
            </div>
            <div class="md3-course-tags" aria-label="Course topics">
              @for (tag of c.tags; track tag) {
                <span class="md3-chip">{{ tag }}</span>
              }
            </div>
          </div>
        </section>
      </main>
    }
  `,
})
export class CourseLandingComponent {
  course = signal<Course | undefined>(undefined);
  private openModulesSet = signal(new Set<number>());
  openModules = this.openModulesSet.asReadonly();
  private openFaqsSet = signal(new Set<string>());
  openFaqs = this.openFaqsSet.asReadonly();
  private seo = inject(SeoService);
  private route = inject(ActivatedRoute);

  constructor() {
    const urlSlug = this.route.snapshot.url.map(s => s.path).pop() || '';
    const c = COURSES.find(c => c.slug === urlSlug);
    if (c) {
      const totalLabs = this.totalLabsFor(c);
      this.course.set(c);
      this.seo.update({
        title: this.getSeoTitle(c),
        description: this.getSeoDescription(c, totalLabs),
        url: '/courses/' + c.slug,
        image: this.getCourseImage(c),
        imageWidth: 1200,
        imageHeight: 480,
        breadcrumbs: [
          { name: 'Home', url: '/' },
          { name: 'Courses', url: '/courses' },
          { name: c.title, url: '/courses/' + c.slug },
        ],
        jsonLd: [
          {
            '@context': 'https://schema.org',
            '@type': 'Course',
            'name': c.title,
            'description': this.getSeoDescription(c, totalLabs),
            'provider': {
              '@type': 'Organization',
              'name': 'CodersSecret',
              'sameAs': 'https://coderssecret.com',
            },
            'instructor': {
              '@type': 'Person',
              'name': c.instructor.name,
              'url': c.instructor.github,
            },
            'offers': {
              '@type': 'Offer',
              'price': '0',
              'priceCurrency': 'USD',
              'availability': 'https://schema.org/InStock',
              'category': 'Free',
            },
            'hasCourseInstance': {
              '@type': 'CourseInstance',
              'courseMode': 'online',
              'courseWorkload': c.totalDuration,
            },
            'educationalLevel': c.level,
            'about': c.tags,
            'numberOfCredits': c.modules.length,
            'inLanguage': 'en',
            'isAccessibleForFree': true,
          },
          ...(c.faqs ? [{
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            'mainEntity': c.faqs.map(faq => ({
              '@type': 'Question',
              'name': faq.question,
              'acceptedAnswer': { '@type': 'Answer', 'text': faq.answer },
            })),
          }] : []),
        ],
      });
    }
  }

  toggleModule(num: number) {
    const s = new Set(this.openModulesSet());
    if (s.has(num)) s.delete(num); else s.add(num);
    this.openModulesSet.set(s);
  }

  toggleFaq(question: string) {
    const s = new Set(this.openFaqsSet());
    if (s.has(question)) s.delete(question); else s.add(question);
    this.openFaqsSet.set(s);
  }

  firstModuleUrl(course: Course): string {
    return `/courses/${course.slug}/${course.modules[0].slug}`;
  }

  firstModuleSlidesUrl(course: Course): string {
    return `${this.firstModuleUrl(course)}/slides`;
  }

  totalLabsFor(course: Course): number {
    return course.modules.reduce((sum, m) => sum + m.labs.length, 0);
  }

  labCountLabel(course: Course): string {
    const totalLabs = this.totalLabsFor(course);
    return course.labDelivery === 'inline' ? `${totalLabs} inline exercises` : `${totalLabs} hands-on labs`;
  }

  moduleLabLabel(module: CourseModule, course: Course): string {
    const unit = course.labDelivery === 'inline' ? 'exercises' : 'labs';
    return `${module.labs.length} ${unit}`;
  }

  courseLabRepositoryUrl(course: Course): string {
    return `https://github.com/vishalanandl177/${course.slug}`;
  }

  courseOutcomes(course: Course): string[] {
    return course.outcomes ?? [
      'A production-style Zero Trust Kubernetes platform',
      'Secure workload identities with automatic rotation',
      'mTLS-encrypted services via Envoy SDS',
      'OPA-powered authorization policies',
      'Federated trust domains across clusters',
      'Production monitoring with Prometheus dashboards',
    ];
  }

  courseFocus(course: Course): string {
    const focusByCourse: Record<string, string> = {
      'mastering-spiffe-spire': 'workload identity and Zero Trust',
      'cloud-native-security-engineering': 'Kubernetes security operations',
      'production-rag-systems-engineering': 'reliable AI retrieval systems',
      'distributed-systems-engineering': 'resilient distributed platforms',
      'production-analytics-engineering-dbt': 'trusted analytics with dbt',
    };
    return focusByCourse[course.slug] ?? course.category;
  }

  courseIconLabel(course: Course): string {
    const labels: Record<string, string> = {
      'mastering-spiffe-spire': 'ID',
      'cloud-native-security-engineering': 'K8S',
      'production-rag-systems-engineering': 'RAG',
      'distributed-systems-engineering': 'SYS',
      'production-analytics-engineering-dbt': 'SQL',
    };
    return labels[course.slug] ?? 'CS';
  }

  private getSeoTitle(course: Course): string {
    if (course.slug === 'mastering-spiffe-spire') {
      return 'Mastering SPIFFE & SPIRE | Zero Trust Course';
    }
    return `${course.title} | Free Course`;
  }

  private getSeoDescription(course: Course, totalLabs: number): string {
    if (course.slug === 'mastering-spiffe-spire') {
      return `Free ${course.modules.length}-module SPIFFE/SPIRE course: deploy SPIRE on Kubernetes, issue SVIDs, configure mTLS, enforce OPA, federate clusters, and run ${totalLabs} labs.`;
    }
    const labLabel = course.labDelivery === 'inline' ? `${totalLabs} inline exercises` : `${totalLabs} hands-on labs`;
    return `${course.excerpt} ${course.modules.length} modules, ${labLabel}, free.`;
  }

  private getCourseImage(course: Course): string {
    const imageByCourse: Record<string, string> = {
      'mastering-spiffe-spire': 'https://coderssecret.com/images/banners/course-mastering-spiffe-spire.svg',
      'cloud-native-security-engineering': 'https://coderssecret.com/images/banners/course-cloud-native-security-engineering.svg',
      'production-rag-systems-engineering': 'https://coderssecret.com/images/banners/course-production-rag-systems-engineering.svg',
      'distributed-systems-engineering': 'https://coderssecret.com/og-image.svg',
      'production-analytics-engineering-dbt': 'https://coderssecret.com/images/banners/course-production-analytics-engineering-dbt.svg',
    };
    return imageByCourse[course.slug] ?? 'https://coderssecret.com/og-image.svg';
  }
}
