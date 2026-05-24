import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { COURSES, Course } from '../../../models/course.model';
import { SeoService } from '../../../services/seo.service';

@Component({
  selector: 'app-courses-hub',
  imports: [RouterLink],
  template: `
    <main class="md3-course-page">
      <section class="md3-course-hero md3-section">
        <div class="md3-container">
          <nav aria-label="Breadcrumb" class="md3-course-breadcrumb">
            <ol>
              <li><a routerLink="/">Home</a></li>
              <li aria-hidden="true">/</li>
              <li aria-current="page">Courses</li>
            </ol>
          </nav>

          <div class="md3-course-hero-grid">
            <div class="md3-course-hero-copy">
              <p class="md3-course-eyebrow">Free production curriculum</p>
              <h1>Learn production engineering through practical courses</h1>
              <p class="md3-course-hero-text">
                Structured, hands-on courses for engineers building secure cloud-native systems,
                distributed platforms, production AI, and trusted analytics.
              </p>

              <div class="md3-course-actions" aria-label="Course actions">
                <a routerLink="/courses/mastering-spiffe-spire" class="md3-button-filled md3-button-large">
                  Start a course
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                       stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                  </svg>
                </a>
                <a routerLink="/games" class="md3-button-tonal md3-button-large">
                  Practice in labs
                </a>
              </div>

              <div class="md3-course-hero-chips" aria-label="Course highlights">
                <span class="md3-chip-selected">Free</span>
                <span class="md3-chip">Ad-free</span>
                <span class="md3-chip">Production-focused</span>
                <span class="md3-chip">{{ totalModules() }} modules</span>
              </div>
            </div>

            <aside class="md3-course-hero-panel" aria-label="Course library summary">
              <div class="md3-course-hero-panel-top">
                <span>Learning map</span>
                <span>{{ courses.length }} tracks</span>
              </div>
              <div class="md3-course-stat-grid">
                <div class="md3-course-stat-tile">
                  <strong>{{ courses.length }}</strong>
                  <span>Courses</span>
                </div>
                <div class="md3-course-stat-tile">
                  <strong>{{ totalLabs() }}</strong>
                  <span>Labs and exercises</span>
                </div>
              </div>
              <div class="md3-course-map" aria-hidden="true">
                <svg viewBox="0 0 420 220" role="img">
                  <path class="md3-course-map-line" d="M64 116 C112 42 202 48 232 108 S330 182 370 92"/>
                  <circle class="md3-course-map-node md3-course-map-node-a" cx="64" cy="116" r="28"/>
                  <circle class="md3-course-map-node md3-course-map-node-b" cx="164" cy="70" r="28"/>
                  <circle class="md3-course-map-node md3-course-map-node-c" cx="264" cy="142" r="28"/>
                  <circle class="md3-course-map-node md3-course-map-node-d" cx="370" cy="92" r="28"/>
                  <text x="64" y="121" text-anchor="middle">ID</text>
                  <text x="164" y="75" text-anchor="middle">K8S</text>
                  <text x="264" y="147" text-anchor="middle">RAG</text>
                  <text x="370" y="97" text-anchor="middle">SQL</text>
                </svg>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section class="md3-section">
        <div class="md3-container">
          <div class="md3-course-section-heading">
            <p class="md3-course-eyebrow">Course library</p>
            <h2>Choose the system you need to understand</h2>
            <p>Every track keeps the same shape: learn the architecture, practice the failure mode, then keep the production checklist close.</p>
          </div>

          <div class="md3-course-card-grid">
            @for (course of courses; track course.id) {
              @let labs = totalLabsFor(course);
              <a [routerLink]="'/courses/' + course.slug"
                 class="md3-course-hub-card"
                 [attr.data-course]="course.slug"
                 [attr.aria-label]="'Open course: ' + course.title">
                <div class="md3-course-hub-card-top">
                  <span class="md3-course-icon" aria-hidden="true">{{ courseIconLabel(course) }}</span>
                  <span class="md3-chip-selected">Free</span>
                </div>

                <div class="md3-course-hub-card-body">
                  <p class="md3-course-card-kicker">{{ course.category }}</p>
                  <h3>{{ course.title }}</h3>
                  <p>{{ course.subtitle }}</p>
                </div>

                <div class="md3-course-metrics" aria-label="Course facts">
                  <span><strong>{{ course.modules.length }}</strong> modules</span>
                  <span><strong>{{ labs }}</strong> {{ course.labDelivery === 'inline' ? 'exercises' : 'labs' }}</span>
                  <span>{{ course.level }}</span>
                </div>

                <div class="md3-course-chip-row">
                  @for (tag of course.tags.slice(0, 5); track tag) {
                    <span class="md3-chip">{{ tag }}</span>
                  }
                </div>

                <span class="md3-course-card-action">
                  Open curriculum
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                       stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                  </svg>
                </span>
              </a>
            }
          </div>
        </div>
      </section>

      <section class="md3-course-path-section md3-section">
        <div class="md3-container">
          <div class="md3-course-section-heading">
            <p class="md3-course-eyebrow">Learning paths</p>
            <h2>Pick a path based on the work you own</h2>
            <p>These paths link courses with the labs, cheatsheets, and guides that make the concepts stick.</p>
          </div>

          <div class="md3-course-path-grid">
            <article class="md3-course-path-card">
              <span class="md3-course-path-number">01</span>
              <h3>Cloud-native security</h3>
              <p>Start broad with Kubernetes and runtime security, then go deep on workload identity.</p>
              <a routerLink="/courses/cloud-native-security-engineering">Open security path</a>
            </article>
            <article class="md3-course-path-card">
              <span class="md3-course-path-number">02</span>
              <h3>Distributed systems</h3>
              <p>Build the operational mental model behind consensus, scaling, reliability, and Zero Trust.</p>
              <a routerLink="/courses/distributed-systems-engineering">Open systems path</a>
            </article>
            <article class="md3-course-path-card">
              <span class="md3-course-path-number">03</span>
              <h3>Production AI infrastructure</h3>
              <p>Connect RAG architecture with retrieval quality, observability, deployment, and security.</p>
              <a routerLink="/courses/production-rag-systems-engineering">Open AI path</a>
            </article>
            <article class="md3-course-path-card">
              <span class="md3-course-path-number">04</span>
              <h3>Analytics engineering</h3>
              <p>Turn raw warehouse tables into tested dbt models, governed metrics, and trusted dashboards.</p>
              <a routerLink="/courses/production-analytics-engineering-dbt">Open data path</a>
            </article>
          </div>
        </div>
      </section>

      <section class="md3-section">
        <div class="md3-container">
          <div class="md3-course-resource-panel">
            <div>
              <p class="md3-course-eyebrow">Keep practicing</p>
              <h2>Courses are only one part of the learning loop</h2>
              <p>Use labs for decisions, cheatsheets for operations, glossary terms for vocabulary, and blog guides for deeper architecture.</p>
            </div>
            <div class="md3-course-resource-links">
              <a routerLink="/games">Interactive labs</a>
              <a routerLink="/cheatsheets">Reference sheets</a>
              <a routerLink="/glossary">Glossary</a>
              <a routerLink="/blog">Engineering guides</a>
            </div>
          </div>
        </div>
      </section>
    </main>
  `,
})
export class CoursesHubComponent {
  courses = COURSES;
  private seo = inject(SeoService);
  private readonly coursesDescription = 'Free hands-on courses in cloud native security, distributed systems, SPIFFE/SPIRE, Kubernetes, Zero Trust, production RAG, and analytics engineering. No signup.';

  totalModules = computed(() =>
    this.courses.reduce((sum, c) => sum + c.modules.length, 0)
  );

  totalLabs = computed(() =>
    this.courses.reduce(
      (sum, c) => sum + c.modules.reduce((s, m) => s + m.labs.length, 0),
      0
    )
  );

  totalLabsFor(course: Course): number {
    return course.modules.reduce((sum, m) => sum + m.labs.length, 0);
  }

  labCountLabel(course: Course): string {
    const count = this.totalLabsFor(course);
    return course.labDelivery === 'inline' ? `${count} inline exercises` : `${count}+ labs`;
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

  constructor() {
    this.seo.update({
      title: 'Free Production Engineering Courses',
      description: this.coursesDescription,
      url: '/courses',
      breadcrumbs: [
        { name: 'Home', url: '/' },
        { name: 'Courses', url: '/courses' },
      ],
      jsonLd: this.courseListSchema(),
    });
  }

  private courseListSchema(): Record<string, unknown> {
    return {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      'name': 'Free Production Engineering Courses',
      'description': this.coursesDescription,
      'numberOfItems': this.courses.length,
      'itemListElement': this.courses.map((course, i) => ({
        '@type': 'ListItem',
        'position': i + 1,
        'url': `https://coderssecret.com/courses/${course.slug}`,
        'item': {
          '@type': 'Course',
          'name': course.title,
          'description': course.excerpt,
          'url': `https://coderssecret.com/courses/${course.slug}`,
          'provider': {
            '@type': 'Organization',
            'name': 'CodersSecret',
            'url': 'https://coderssecret.com',
          },
          'creator': {
            '@type': 'Person',
            'name': course.instructor.name,
            'url': 'https://coderssecret.com/about',
          },
          'educationalLevel': course.level,
          'teaches': course.tags,
          'isAccessibleForFree': true,
          'inLanguage': 'en',
          'offers': {
            '@type': 'Offer',
            'price': 0,
            'priceCurrency': 'USD',
            'category': 'Free',
            'availability': 'https://schema.org/InStock',
          },
          'hasCourseInstance': {
            '@type': 'CourseInstance',
            'courseMode': 'online',
            'courseWorkload': course.totalDuration,
            'instructor': {
              '@type': 'Person',
              'name': course.instructor.name,
            },
          },
        },
      })),
    };
  }
}
