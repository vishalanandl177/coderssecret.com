import { Component, inject, signal, computed } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { COURSES, CourseModule, Course } from '../../../models/course.model';
import { SeoService } from '../../../services/seo.service';

@Component({
  selector: 'app-course-module',
  imports: [RouterLink],
  template: `
    @if (mod(); as m) {
      <main class="md3-course-page app-forward">
        <section class="md3-course-detail-hero md3-section">
          <div class="md3-container">
            <nav aria-label="Breadcrumb" class="md3-course-module-breadcrumb">
              <ol>
                <li><a routerLink="/">Home</a></li>
                <li aria-hidden="true">/</li>
                <li><a routerLink="/courses">Courses</a></li>
                <li aria-hidden="true">/</li>
                <li><a [routerLink]="'/courses/' + courseSlug()">{{ courseTitle() }}</a></li>
                <li aria-hidden="true">/</li>
                <li aria-current="page">Module {{ m.number }}</li>
              </ol>
            </nav>

            <div class="md3-course-detail-hero-grid">
              <div class="md3-course-detail-copy">
                <p class="md3-course-eyebrow">Module {{ m.number }} of {{ totalModules() }}</p>
                <h1>{{ m.title }}</h1>
                <p class="md3-course-detail-text">{{ m.subtitle }}</p>

                <div class="md3-course-meta-row" aria-label="Module facts">
                  <span class="md3-chip-selected">{{ m.duration }}</span>
                  <span class="md3-chip">{{ m.labs.length }} {{ labDelivery() === 'inline' ? 'exercises' : 'labs' }}</span>
                  <span class="md3-chip">Free</span>
                </div>

                <div class="md3-course-actions" aria-label="Module actions">
                  <a [routerLink]="'/courses/' + courseSlug() + '/' + m.slug + '/slides'" class="md3-button-filled md3-button-large">
                    Watch as Slides
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </a>
                  <a [routerLink]="'/courses/' + courseSlug()" class="md3-button-tonal md3-button-large">Course overview</a>
                  @if (labDelivery() === 'inline') {
                    <span class="md3-chip-selected">Inline lab below</span>
                  } @else {
                    <a [href]="'https://github.com/vishalanandl177/' + courseSlug()" target="_blank" rel="noopener noreferrer" class="md3-button-outlined md3-button-large">
                      Lab code
                    </a>
                  }
                </div>
              </div>

              <aside class="md3-course-overview-panel" aria-label="Module summary">
                <div class="md3-course-overview-panel-top">
                  <span>{{ courseTitle() }}</span>
                  <span>{{ m.number }}/{{ totalModules() }}</span>
                </div>
                <div class="md3-course-overview-stats">
                  <div class="md3-course-overview-stat">
                    <strong>{{ m.objectives.length }}</strong>
                    <span>Objectives</span>
                  </div>
                  <div class="md3-course-overview-stat">
                    <strong>{{ m.keyTakeaways.length }}</strong>
                    <span>Takeaways</span>
                  </div>
                </div>
                <div class="md3-course-overview-list">
                  @if (prevModule(); as prev) {
                    <a [routerLink]="'/courses/' + courseSlug() + '/' + prev.slug">Previous module</a>
                  }
                  @if (nextModule(); as next) {
                    <a [routerLink]="'/courses/' + courseSlug() + '/' + next.slug">Next module</a>
                  }
                  <a routerLink="/cheatsheets">Reference sheets</a>
                </div>
              </aside>
            </div>
          </div>
        </section>

        <section class="md3-section">
          <div class="md3-container">
            <div class="md3-course-module-layout">
              <div class="md3-course-module-main">
                <section class="md3-course-info-card" aria-labelledby="objectives-heading">
                  <p class="md3-course-info-kicker">Start here</p>
                  <h2 id="objectives-heading">Learning objectives</h2>
                  <ul class="md3-course-list">
                    @for (obj of m.objectives; track obj) {
                      <li><span class="md3-course-list-marker" aria-hidden="true">-</span><span>{{ obj }}</span></li>
                    }
                  </ul>
                </section>

                @if (m.whyThisMatters) {
                  <aside class="md3-course-callout secondary">
                    <p class="md3-course-info-kicker">Why this matters</p>
                    <h2>Production context</h2>
                    <p>{{ m.whyThisMatters }}</p>
                  </aside>
                }

                @if (m.beforeAfter; as beforeAfter) {
                  <section class="md3-course-callout-grid" aria-label="Before and after">
                    <article class="md3-course-callout error">
                      <p class="md3-course-info-kicker">Before</p>
                      <ul class="md3-course-list">
                        @for (item of beforeAfter.before; track item) {
                          <li><span class="md3-course-list-marker" aria-hidden="true">-</span><span>{{ item }}</span></li>
                        }
                      </ul>
                    </article>
                    <article class="md3-course-callout secondary">
                      <p class="md3-course-info-kicker">After</p>
                      <ul class="md3-course-list">
                        @for (item of beforeAfter.after; track item) {
                          <li><span class="md3-course-list-marker" aria-hidden="true">+</span><span>{{ item }}</span></li>
                        }
                      </ul>
                    </article>
                  </section>
                }

                @if (safeSvg(); as svg) {
                  <figure class="md3-course-diagram-surface" [innerHTML]="svg"></figure>
                }

                <article class="md3-course-article-surface course-content" [innerHTML]="safeContent()"></article>

                @if (m.realWorldUseCases && m.realWorldUseCases.length > 0) {
                  <section class="md3-course-info-card">
                    <p class="md3-course-info-kicker">Real world</p>
                    <h2>Where this shows up</h2>
                    <ul class="md3-course-list">
                      @for (useCase of m.realWorldUseCases; track useCase) {
                        <li><span class="md3-course-list-marker" aria-hidden="true">-</span><span>{{ useCase }}</span></li>
                      }
                    </ul>
                  </section>
                }

                @if (m.productionNotes && m.productionNotes.length > 0) {
                  <section class="md3-course-callout secondary">
                    <p class="md3-course-info-kicker">Production notes</p>
                    <h2>Keep these close</h2>
                    <ul class="md3-course-list">
                      @for (note of m.productionNotes; track note) {
                        <li><span class="md3-course-list-marker" aria-hidden="true">!</span><span>{{ note }}</span></li>
                      }
                    </ul>
                  </section>
                }

                @if (m.commonMistakes && m.commonMistakes.length > 0) {
                  <section class="md3-course-callout error">
                    <p class="md3-course-info-kicker">Common mistakes</p>
                    <h2>What usually breaks</h2>
                    <ul class="md3-course-list">
                      @for (mistake of m.commonMistakes; track mistake) {
                        <li><span class="md3-course-list-marker" aria-hidden="true">!</span><span>{{ mistake }}</span></li>
                      }
                    </ul>
                  </section>
                }

                @if (m.securityRisks && m.securityRisks.length > 0) {
                  <section class="md3-course-callout tertiary">
                    <p class="md3-course-info-kicker">Security risks</p>
                    <h2>Threats to watch</h2>
                    <ul class="md3-course-list">
                      @for (risk of m.securityRisks; track risk) {
                        <li><span class="md3-course-list-marker" aria-hidden="true">!</span><span>{{ risk }}</span></li>
                      }
                    </ul>
                  </section>
                }

                @if (m.designTradeoffs && m.designTradeoffs.length > 0) {
                  <section>
                    <div class="md3-course-section-heading">
                      <p class="md3-course-eyebrow">Tradeoffs</p>
                      <h2>Design choices you should be able to defend</h2>
                    </div>
                    <div class="md3-course-callout-grid">
                      @for (trade of m.designTradeoffs; track trade.option) {
                        <article class="md3-course-info-card">
                          <h3>{{ trade.option }}</h3>
                          <p class="md3-course-info-kicker">Pros</p>
                          <ul class="md3-course-list">
                            @for (pro of trade.pros; track pro) {
                              <li><span class="md3-course-list-marker" aria-hidden="true">+</span><span>{{ pro }}</span></li>
                            }
                          </ul>
                          <p class="md3-course-info-kicker">Cons</p>
                          <ul class="md3-course-list">
                            @for (con of trade.cons; track con) {
                              <li><span class="md3-course-list-marker" aria-hidden="true">-</span><span>{{ con }}</span></li>
                            }
                          </ul>
                        </article>
                      }
                    </div>
                  </section>
                }

                @if (m.productionAlternatives && m.productionAlternatives.length > 0) {
                  <section class="md3-course-info-card">
                    <p class="md3-course-info-kicker">Alternatives</p>
                    <h2>Other production approaches</h2>
                    <div class="md3-course-callout-grid">
                      @for (alt of m.productionAlternatives; track alt.name) {
                        <article class="md3-course-callout">
                          <h3>{{ alt.name }}</h3>
                          <p>{{ alt.description }}</p>
                        </article>
                      }
                    </div>
                  </section>
                }

                @if (m.thinkLikeAnEngineer && m.thinkLikeAnEngineer.length > 0) {
                  <section class="md3-course-callout">
                    <p class="md3-course-info-kicker">Think like an engineer</p>
                    <h2>Questions to answer before shipping</h2>
                    <ul class="md3-course-list">
                      @for (question of m.thinkLikeAnEngineer; track question) {
                        <li><span class="md3-course-list-marker" aria-hidden="true">?</span><span>{{ question }}</span></li>
                      }
                    </ul>
                  </section>
                }

                @if (m.operationalStory) {
                  <aside class="md3-course-callout tertiary">
                    <p class="md3-course-info-kicker">Production story</p>
                    <p>{{ m.operationalStory }}</p>
                  </aside>
                }

                @if (m.careerRelevance) {
                  <aside class="md3-course-callout secondary">
                    <p class="md3-course-info-kicker">Career relevance</p>
                    <p>{{ m.careerRelevance }}</p>
                  </aside>
                }

                @if (m.glossary && m.glossary.length > 0) {
                  <section class="md3-course-info-card">
                    <p class="md3-course-info-kicker">Key terms</p>
                    <h2>Vocabulary used in this module</h2>
                    <div class="md3-course-callout-grid">
                      @for (term of m.glossary; track term.term) {
                        <article class="md3-course-callout">
                          <h3>{{ term.term }}</h3>
                          <p>{{ term.definition }}</p>
                        </article>
                      }
                    </div>
                  </section>
                }

                @if (m.labs.length > 0) {
                  <section>
                    <div class="md3-course-section-heading">
                      <p class="md3-course-eyebrow">{{ labDelivery() === 'inline' ? 'Exercises' : 'Labs' }}</p>
                      <h2>{{ labDelivery() === 'inline' ? 'Practice inside the lesson' : 'Hands-on labs' }}</h2>
                    </div>
                    <div class="md3-course-curriculum-list">
                      @for (lab of m.labs; track lab.title; let i = $index) {
                        <article class="md3-course-lab-card">
                          <div class="md3-course-lab-card-top">
                            <span class="md3-course-lab-number" aria-hidden="true">{{ i + 1 }}</span>
                            <div class="md3-course-meta-row">
                              @if (lab.duration) {
                                <span class="md3-chip">{{ lab.duration }}</span>
                              }
                              @if (lab.difficulty) {
                                <span class="md3-chip">{{ lab.difficulty }}</span>
                              }
                            </div>
                          </div>
                          <h3>{{ lab.title }}</h3>
                          <p>{{ lab.objective }}</p>
                          <ol class="md3-course-list">
                            @for (step of lab.steps; track step) {
                              <li><span class="md3-course-list-marker" aria-hidden="true">-</span><span>{{ step }}</span></li>
                            }
                          </ol>
                          @if (lab.repoPath && labDelivery() !== 'inline') {
                            <a [href]="'https://github.com/vishalanandl177/' + courseSlug() + '/tree/main/' + lab.repoPath"
                               target="_blank"
                               rel="noopener noreferrer"
                               class="md3-course-inline-link">
                              View lab on GitHub
                            </a>
                          }
                        </article>
                      }
                    </div>
                  </section>
                }

                <section class="md3-course-callout secondary">
                  <p class="md3-course-info-kicker">Recap</p>
                  <h2>Key takeaways</h2>
                  <ul class="md3-course-list">
                    @for (takeaway of m.keyTakeaways; track takeaway) {
                      <li><span class="md3-course-list-marker" aria-hidden="true">+</span><span>{{ takeaway }}</span></li>
                    }
                  </ul>
                </section>

                <section class="md3-course-info-card">
                  <p class="md3-course-info-kicker">Related resources</p>
                  <h2>Keep learning across CodersSecret</h2>
                  <div class="md3-course-related-grid">
                    <a routerLink="/blog" class="md3-course-related-card">
                      <h3>Related guides</h3>
                      <p>Read practical engineering walkthroughs that connect this lesson to real systems.</p>
                    </a>
                    <a routerLink="/cheatsheets" class="md3-course-related-card">
                      <h3>Cheatsheets</h3>
                      <p>Keep command references and production checklists close while you practice.</p>
                    </a>
                    <a routerLink="/games" class="md3-course-related-card">
                      <h3>Interactive labs</h3>
                      <p>Practice infrastructure decisions through short, scenario-driven exercises.</p>
                    </a>
                    <a routerLink="/glossary" class="md3-course-related-card">
                      <h3>Glossary terms</h3>
                      <p>Build the vocabulary needed to explain architecture clearly in reviews.</p>
                    </a>
                  </div>
                </section>

                <nav class="md3-course-nav-row" aria-label="Course module navigation">
                  @if (prevModule(); as prev) {
                    <a [routerLink]="'/courses/' + courseSlug() + '/' + prev.slug" class="md3-course-nav-card">
                      <span>Previous</span>
                      <h3>Module {{ prev.number }}: {{ prev.title }}</h3>
                    </a>
                  } @else {
                    <span></span>
                  }
                  @if (nextModule(); as next) {
                    <a [routerLink]="'/courses/' + courseSlug() + '/' + next.slug" class="md3-course-nav-card">
                      <span>Next</span>
                      <h3>Module {{ next.number }}: {{ next.title }}</h3>
                    </a>
                  }
                </nav>
              </div>

              <aside class="md3-course-module-sidebar" aria-label="All course modules">
                <h2>All modules</h2>
                @for (courseModule of allModules(); track courseModule.number) {
                  <a [routerLink]="'/courses/' + courseSlug() + '/' + courseModule.slug"
                     class="md3-course-module-link"
                     [class.active]="courseModule.number === m.number"
                     [attr.aria-current]="courseModule.number === m.number ? 'page' : null">
                    <span class="md3-course-module-link-number">{{ courseModule.number }}</span>
                    <span class="md3-course-module-link-title">{{ courseModule.title }}</span>
                  </a>
                }
              </aside>
            </div>
          </div>
        </section>
      </main>
    }
  `,
})
export class CourseModuleComponent {
  private route = inject(ActivatedRoute);
  private seo = inject(SeoService);
  private sanitizer = inject(DomSanitizer);

  private courseData = signal<Course | undefined>(undefined);
  mod = signal<CourseModule | undefined>(undefined);
  courseSlug = signal('');
  courseTitle = signal('');
  labDelivery = signal<'github' | 'inline'>('github');
  totalModules = signal(0);
  allModules = signal<CourseModule[]>([]);

  safeSvg = computed<SafeHtml | undefined>(() => {
    const m = this.mod();
    if (!m?.svgDiagram) return undefined;
    return this.sanitizer.bypassSecurityTrustHtml(m.svgDiagram);
  });

  safeContent = computed<SafeHtml>(() => {
    const m = this.mod();
    if (!m?.content) return '';
    return this.sanitizer.bypassSecurityTrustHtml(m.content);
  });

  prevModule = computed(() => {
    const m = this.mod();
    const mods = this.allModules();
    if (!m) return undefined;
    return mods.find(x => x.number === m.number - 1);
  });

  nextModule = computed(() => {
    const m = this.mod();
    const mods = this.allModules();
    if (!m) return undefined;
    return mods.find(x => x.number === m.number + 1);
  });

  constructor() {
    const router = inject(Router);
    const urlSegments = this.route.snapshot.pathFromRoot.flatMap(r => r.url.map(s => s.path));
    const courseSlugFromUrl = urlSegments[1] || '';
    const course = COURSES.find(c => c.slug === courseSlugFromUrl);
    if (!course) { router.navigate(['/courses']); return; }
    this.courseData.set(course);
    this.courseSlug.set(course.slug);
    this.courseTitle.set(course.title);
    this.labDelivery.set(course.labDelivery ?? 'github');
    this.totalModules.set(course.modules.length);
    this.allModules.set(course.modules);

    this.route.paramMap.pipe(takeUntilDestroyed()).subscribe(params => {
      const moduleSlug = params.get('moduleSlug') ?? '';
      const c = this.courseData();
      if (!c) return;
      const m = c.modules.find(m => m.slug === moduleSlug);
      if (m) {
        const moduleUrl = `/courses/${c.slug}/${m.slug}`;
        const moduleDescription = this.getModuleSeoDescription(c, m);
        this.mod.set(m);
        this.seo.update({
          title: this.getModuleSeoTitle(c, m),
          description: moduleDescription,
          url: moduleUrl,
          image: this.getCourseImage(c),
          imageWidth: 1200,
          imageHeight: 480,
          breadcrumbs: [
            { name: 'Home', url: '/' },
            { name: 'Courses', url: '/courses' },
            { name: c.title, url: `/courses/${c.slug}` },
            { name: `Module ${m.number}: ${m.title}`, url: moduleUrl },
          ],
          jsonLd: {
            '@context': 'https://schema.org',
            '@type': 'LearningResource',
            'name': `Module ${m.number}: ${m.title}`,
            'description': moduleDescription,
            'url': `https://coderssecret.com${moduleUrl}`,
            'learningResourceType': 'Course module',
            'isAccessibleForFree': true,
            'inLanguage': 'en',
            'position': m.number,
            'timeRequired': m.duration,
            'teaches': m.objectives,
            'about': c.tags,
            'provider': {
              '@type': 'Organization',
              'name': 'CodersSecret',
              'url': 'https://coderssecret.com',
            },
            'creator': {
              '@type': 'Person',
              'name': c.instructor.name,
              'url': c.instructor.github,
            },
            'isPartOf': {
              '@type': 'Course',
              'name': c.title,
              'url': `https://coderssecret.com/courses/${c.slug}`,
            },
          },
        });
        if (typeof window !== 'undefined') window.scrollTo(0, 0);
      } else {
        router.navigate(['/courses/' + c.slug]);
      }
    });
  }

  private getModuleSeoTitle(course: Course, module: CourseModule): string {
    if (course.slug === 'mastering-spiffe-spire') {
      return `Module ${module.number}: ${this.getSpiffeModuleShortTitle(module)} | SPIFFE`;
    }
    return `Module ${module.number}: ${module.title} | ${course.title}`;
  }

  private getSpiffeModuleShortTitle(module: CourseModule): string {
    const titles: Record<number, string> = {
      1: 'Zero Trust Security',
      2: 'PKI Foundations',
      3: 'SPIFFE Fundamentals',
      4: 'SPIRE Architecture',
      5: 'SPIRE on Kubernetes',
      6: 'SVIDs & Workload API',
      7: 'Authorization & OPA',
      8: 'Service Mesh Integrations',
      9: 'Advanced SPIRE Architecture',
      10: 'SPIRE Operations',
      11: 'SPIFFE/SPIRE Ecosystem',
      12: 'Zero Trust Platform Capstone',
      13: 'SPIFFE for AI Infrastructure',
    };
    return titles[module.number] ?? module.title;
  }

  private getModuleSeoDescription(course: Course, module: CourseModule): string {
    const unit = course.labDelivery === 'inline' ? 'exercise' : 'lab';
    const labLabel = module.labs.length === 1 ? unit : `${unit}s`;
    const practiceType = course.labDelivery === 'inline' ? 'inline' : 'hands-on';
    const courseName = course.slug === 'mastering-spiffe-spire' ? 'SPIFFE/SPIRE' : course.title;
    return `Module ${module.number} of the free ${courseName} course: ${module.subtitle}. ${module.labs.length} ${practiceType} ${labLabel}.`;
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
