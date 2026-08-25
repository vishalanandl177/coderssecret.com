import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import type { CourseModuleOutline, CourseOutline } from '../../../models/course-outline';
import { loadCourseOutlineBySlug } from '../../../models/course-loader';
import { SeoService } from '../../../services/seo.service';

interface CourseRelatedArticle {
  title: string;
  url: string;
  description: string;
}

const COURSE_RELATED_ARTICLES: Readonly<Record<string, readonly CourseRelatedArticle[]>> = {
  'mastering-spiffe-spire': [
    { title: 'Kubernetes Secrets vs Vault vs Workload Identity', url: '/blog/kubernetes-secrets-vault-workload-identity', description: 'Choose the right credential and identity model for Kubernetes workloads.' },
    { title: 'OIDC Workload Federation', url: '/blog/oidc-workload-federation-secretless-service-access', description: 'Understand short-lived, secretless access across cloud trust boundaries.' },
    { title: 'mTLS and X.509 Certificates', url: '/blog/mtls-x509-certificates-python-tutorial', description: 'Build the certificate foundation used for mutual workload authentication.' },
    { title: 'M2M Authentication', url: '/blog/m2m-authentication-service-to-service', description: 'Compare service authentication patterns before choosing an identity platform.' },
  ],
  'cloud-native-security-engineering': [
    { title: 'Kubernetes Security Explained', url: '/blog/kubernetes-security-explained', description: 'Map cluster security from API access and RBAC through runtime detection.' },
    { title: 'Software Supply Chain Security', url: '/blog/software-supply-chain-security-explained', description: 'Connect source, CI, artifacts, provenance, signing, and admission policy.' },
    { title: 'Common CI/CD Attack Paths', url: '/blog/common-cicd-attack-paths', description: 'Review the trust boundaries attackers commonly exploit in delivery pipelines.' },
    { title: 'API Security Attacks and Defenses', url: '/blog/api-security-attacks-defense-guide', description: 'Apply practical controls to authentication, authorization, input, and abuse risks.' },
  ],
  'production-rag-systems-engineering': [
    { title: 'Fine-Tuning vs RAG vs Prompt Engineering', url: '/blog/fine-tuning-vs-rag-vs-prompt-engineering', description: 'Choose the right adaptation strategy before building the retrieval stack.' },
    { title: 'Vector Databases and Embeddings', url: '/blog/vector-databases-embeddings-similarity-search', description: 'Understand similarity search, indexing, and vector-store tradeoffs.' },
    { title: 'Build Local RAG and Agent Applications', url: '/blog/local-ai-app-rag-agents-no-cloud', description: 'Practice the application flow locally before operating a production system.' },
    { title: 'MCP Security in Production', url: '/blog/mcp-security-production-ai-agents-oauth-gateways', description: 'Protect agent tools with scoped identity, gateways, and observable policy.' },
  ],
  'distributed-systems-engineering': [
    { title: 'Distributed Systems Algorithms', url: '/blog/distributed-systems-algorithms-production-guide', description: 'Connect coordination algorithms to the production failures they prevent.' },
    { title: 'Caching Strategies', url: '/blog/caching-strategies-production-guide', description: 'Design cache access patterns, invalidation, and failure containment.' },
    { title: 'Rate Limiting Algorithms', url: '/blog/rate-limiting-algorithms-token-bucket-sliding-window', description: 'Compare token bucket, leaky bucket, and sliding-window behavior.' },
    { title: 'Scheduling Systems', url: '/blog/scheduling-systems-production-guide', description: 'Understand queues, leases, retries, fairness, and distributed coordination.' },
  ],
  'centralized-authentication-authorization-envoy': [
    { title: 'Envoy Proxy and xDS', url: '/blog/envoy-proxy-xds-server-guide', description: 'Learn the data-plane and control-plane model behind Envoy configuration.' },
    { title: 'SSO, SAML, and OIDC', url: '/blog/sso-saml-oidc-practical-guide', description: 'Compare the identity protocols that feed centralized authentication.' },
    { title: 'OAuth2 and OpenID Connect', url: '/blog/oauth2-openid-connect-developer-guide', description: 'Separate delegated authorization from identity and session concerns.' },
    { title: 'M2M Authentication in Go', url: '/blog/m2m-authentication-golang-m2mauth-library', description: 'See service authentication evolve from mTLS helpers to workload identity.' },
  ],
  'production-analytics-engineering-dbt': [
    { title: 'Bronze, Silver, and Gold Data Layers', url: '/blog/bronze-silver-gold-data-layers-explained', description: 'Separate raw, cleaned, and business-ready data with explicit contracts.' },
    { title: 'Why Spark Jobs Become Slow', url: '/blog/why-spark-jobs-become-slow-shuffle-skew-partitions-memory', description: 'Diagnose shuffle, skew, partitions, file layout, and memory pressure.' },
    { title: 'Delta Lake, Iceberg, and S3 Tables', url: '/blog/delta-lake-iceberg-s3-tables-beginner-guide', description: 'Understand the table-format layer beneath modern analytics workflows.' },
    { title: 'Modern Data Platforms Compared', url: '/blog/modern-data-platforms-snowflake-databricks-bigquery-e6data', description: 'Compare platform architecture, governance, cost, and workload fit.' },
  ],
  'malware-analysis-defense': [
    { title: 'Types of Malware and Their Risks', url: '/blog/types-of-malware-and-their-risks', description: 'Classify malware by delivery, behavior, impact, evidence, and defensive response.' },
    { title: 'Software Supply Chain Security', url: '/blog/software-supply-chain-security-explained', description: 'Reduce trusted-delivery risk across source, CI, dependencies, and artifacts.' },
    { title: 'Common CI/CD Attack Paths', url: '/blog/common-cicd-attack-paths', description: 'Understand how compromised automation can become a malware delivery path.' },
    { title: 'API Security Attacks and Defenses', url: '/blog/api-security-attacks-defense-guide', description: 'Harden application boundaries that malware and compromised identities abuse.' },
  ],
};

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
                  <a [href]="'/courses/' + c.slug + '#curriculum'" class="md3-button-tonal md3-button-large">View curriculum</a>
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

        @if (c.safetyNotice) {
          <section class="md3-section" aria-labelledby="course-safety-heading">
            <div class="md3-container">
              <aside class="md3-course-callout tertiary">
                <p class="md3-course-info-kicker">Safety boundary</p>
                <h2 id="course-safety-heading">Defense-first practice only</h2>
                <p>{{ c.safetyNotice }}</p>
              </aside>

              @if (c.frameworkVersions && c.frameworkVersions.length > 0) {
                <div class="md3-course-info-card">
                  <h3>Version-pinned references</h3>
                  <ul class="md3-course-list">
                    @for (framework of c.frameworkVersions; track framework.name) {
                      <li>
                        <span class="md3-course-list-marker" aria-hidden="true">-</span>
                        <span>
                          <a [href]="framework.url" target="_blank" rel="noopener noreferrer">{{ framework.name }} {{ framework.version }}</a>
                          &middot; reviewed {{ framework.reviewedAt }}
                        </span>
                      </li>
                    }
                  </ul>
                </div>
              }
            </div>
          </section>
        }

        <section class="md3-section">
          <div class="md3-container">
            <div class="md3-course-section-heading centered">
              <p class="md3-course-eyebrow">Outcomes</p>
              <h2>What you will be able to do and explain</h2>
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
                  <div class="md3-course-disclosure-header">
                    <a
                      [routerLink]="'/courses/' + c.slug + '/' + mod.slug"
                      class="md3-course-disclosure-link"
                      [attr.aria-label]="'Open Module ' + mod.number + ': ' + mod.title">
                      <span class="md3-course-module-number" aria-hidden="true">{{ mod.number }}</span>
                      <span class="md3-course-disclosure-copy">
                        <strong>{{ mod.title }}</strong>
                        <span>{{ mod.subtitle }}</span>
                      </span>
                    </a>
                    <span class="md3-course-disclosure-meta">
                      {{ mod.duration }} | {{ moduleLabLabel(mod, c) }}
                    </span>
                    <button
                      type="button"
                      class="md3-course-disclosure-toggle"
                      (click)="toggleModule(mod.number)"
                      [attr.aria-expanded]="openModules().has(mod.number)"
                      [attr.aria-controls]="'course-module-' + mod.number"
                      [attr.aria-label]="(openModules().has(mod.number) ? 'Hide' : 'Show') + ' details for Module ' + mod.number"
                      [attr.title]="(openModules().has(mod.number) ? 'Hide' : 'Show') + ' module details'">
                      <svg class="md3-course-disclosure-icon" [class.open]="openModules().has(mod.number)"
                           xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                           stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <path d="m6 9 6 6 6-6"/>
                      </svg>
                    </button>
                  </div>
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

        @if (c.seoPages.length > 0) {
          <section class="md3-section">
            <div class="md3-container">
              <div class="md3-course-section-heading">
                <p class="md3-course-eyebrow">Focused guides</p>
                <h2>Start with the topic you need</h2>
                <p>Use a focused guide to understand the production problem, then continue into the relevant module and the full course path.</p>
              </div>
              <div class="md3-course-related-grid">
                @for (guide of c.seoPages; track guide.slug) {
                  <a [routerLink]="'/courses/' + guide.slug" class="md3-course-related-card">
                    <p class="md3-course-info-kicker">Course guide</p>
                    <h3>{{ guide.title }}</h3>
                    <p>{{ guide.description }}</p>
                  </a>
                }
              </div>
            </div>
          </section>
        }

        @if (relatedArticles(c).length > 0) {
          <section class="md3-section">
            <div class="md3-container">
              <div class="md3-course-section-heading">
                <p class="md3-course-eyebrow">Related engineering guides</p>
                <h2>Connect the course to production decisions</h2>
                <p>Use these articles to review adjacent architecture choices, failure modes, and implementation tradeoffs.</p>
              </div>
              <div class="md3-course-related-grid">
                @for (article of relatedArticles(c); track article.url) {
                  <a [routerLink]="article.url" class="md3-course-related-card">
                    <p class="md3-course-info-kicker">Engineering guide</p>
                    <h3>{{ article.title }}</h3>
                    <p>{{ article.description }}</p>
                  </a>
                }
              </div>
            </div>
          </section>
        }

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

        @if (c.assessments && c.assessments.length > 0) {
          <section class="md3-section">
            <div class="md3-container">
              <div class="md3-course-section-heading">
                <p class="md3-course-eyebrow">Assessment</p>
                <h2>How defensive work is evaluated</h2>
                <p>Evaluation rewards evidence quality, reproducibility, false-positive discipline, recovery decisions, and safety. It does not reward offensive capability or speed.</p>
              </div>
              <div class="md3-course-related-grid">
                @for (assessment of c.assessments; track assessment.id) {
                  <article class="md3-course-info-card">
                    <p class="md3-course-info-kicker">{{ assessment.type }}</p>
                    <h3>{{ assessment.title }}</h3>
                    <p>
                      Passing score: {{ assessment.passingScore ?? 'Not scored' }}
                      @if (assessment.weight) { &middot; Course weight: {{ assessment.weight }}% }
                      @if (assessment.safetyCritical) { &middot; Safety-critical }
                    </p>
                    <ul class="md3-course-list">
                      @for (item of assessment.rubric; track item.criterion) {
                        <li><span class="md3-course-list-marker" aria-hidden="true">-</span><span>{{ item.criterion }} ({{ item.weight }}%)</span></li>
                      }
                    </ul>
                  </article>
                }
              </div>
            </div>
          </section>
        }

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
  course = signal<CourseOutline | undefined>(undefined);
  private openModulesSet = signal(new Set<number>());
  openModules = this.openModulesSet.asReadonly();
  private openFaqsSet = signal(new Set<string>());
  openFaqs = this.openFaqsSet.asReadonly();
  private seo = inject(SeoService);
  private route = inject(ActivatedRoute);

  constructor() {
    const urlSlug = this.route.snapshot.url.map(s => s.path).pop() || '';
    void this.loadCourse(urlSlug);
  }

  relatedArticles(course: CourseOutline): readonly CourseRelatedArticle[] {
    return COURSE_RELATED_ARTICLES[course.slug] ?? [];
  }

  private async loadCourse(urlSlug: string): Promise<void> {
    const c = await loadCourseOutlineBySlug(urlSlug);
    if (c) {
      const totalLabs = this.totalLabsFor(c);
      this.course.set(c);
      this.seo.update({
        title: this.getSeoTitle(c),
        description: this.getSeoDescription(c, totalLabs),
        url: '/courses/' + c.slug,
        image: this.getCourseImage(c),
        imageWidth: 1200,
        imageHeight: this.getCourseImageHeight(c),
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
            'url': `https://coderssecret.com/courses/${c.slug}`,
            'image': this.getCourseImage(c),
            'provider': {
              '@type': 'Organization',
              'name': 'CodersSecret',
              'url': 'https://coderssecret.com',
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
            },
            'educationalLevel': c.level,
            'about': c.tags,
            'inLanguage': 'en',
            'isAccessibleForFree': true,
            'hasPart': c.modules.map(module => ({
              '@type': 'LearningResource',
              'name': `Module ${module.number}: ${module.title}`,
              'url': `https://coderssecret.com/courses/${c.slug}/${module.slug}`,
              'position': module.number,
              'isAccessibleForFree': true,
            })),
          },
          {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            'name': `${c.title} curriculum`,
            'url': `https://coderssecret.com/courses/${c.slug}`,
            'itemListElement': c.modules.map(module => ({
              '@type': 'ListItem',
              'position': module.number,
              'url': `https://coderssecret.com/courses/${c.slug}/${module.slug}`,
              'name': `Module ${module.number}: ${module.title}`,
            })),
          },
          ...(c.faqs ? [{
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            'url': `https://coderssecret.com/courses/${c.slug}`,
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

  firstModuleUrl(course: CourseOutline): string {
    return `/courses/${course.slug}/${course.modules[0].slug}`;
  }

  firstModuleSlidesUrl(course: CourseOutline): string {
    return `${this.firstModuleUrl(course)}/slides`;
  }

  totalLabsFor(course: CourseOutline): number {
    return course.modules.reduce((sum, m) => sum + m.labs.length, 0);
  }

  labCountLabel(course: CourseOutline): string {
    const totalLabs = this.totalLabsFor(course);
    return course.labDelivery === 'inline' ? `${totalLabs} inline exercises` : `${totalLabs} hands-on labs`;
  }

  moduleLabLabel(module: CourseModuleOutline, course: CourseOutline): string {
    const unit = course.labDelivery === 'inline' ? 'exercises' : 'labs';
    return `${module.labs.length} ${unit}`;
  }

  courseLabRepositoryUrl(course: CourseOutline): string {
    return `https://github.com/vishalanandl177/${course.slug}`;
  }

  courseOutcomes(course: CourseOutline): string[] {
    return course.outcomes ?? [
      'A production-style Zero Trust Kubernetes platform',
      'Secure workload identities with automatic rotation',
      'mTLS-encrypted services via Envoy SDS',
      'OPA-powered authorization policies',
      'Federated trust domains across clusters',
      'Production monitoring with Prometheus dashboards',
    ];
  }

  courseFocus(course: CourseOutline): string {
    const focusByCourse: Record<string, string> = {
      'mastering-spiffe-spire': 'workload identity and Zero Trust',
      'cloud-native-security-engineering': 'Kubernetes security operations',
      'production-rag-systems-engineering': 'reliable AI retrieval systems',
      'distributed-systems-engineering': 'resilient distributed platforms',
      'production-analytics-engineering-dbt': 'trusted analytics with dbt',
      'centralized-authentication-authorization-envoy': 'centralized authentication and authorization',
      'malware-analysis-defense': 'malware analysis, detection, and secure recovery',
    };
    return focusByCourse[course.slug] ?? course.category;
  }

  courseIconLabel(course: CourseOutline): string {
    const labels: Record<string, string> = {
      'mastering-spiffe-spire': 'ID',
      'cloud-native-security-engineering': 'K8S',
      'production-rag-systems-engineering': 'RAG',
      'distributed-systems-engineering': 'SYS',
      'production-analytics-engineering-dbt': 'SQL',
      'centralized-authentication-authorization-envoy': 'SSO',
      'malware-analysis-defense': 'MAL',
    };
    return labels[course.slug] ?? 'CS';
  }

  private getSeoTitle(course: CourseOutline): string {
    const titles: Record<string, string> = {
      'mastering-spiffe-spire': 'SPIFFE & SPIRE Zero Trust Course',
      'cloud-native-security-engineering': 'Cloud Native Security Free Course',
      'production-rag-systems-engineering': 'Production RAG Engineering Course',
      'distributed-systems-engineering': 'Distributed Systems Engineering Course',
      'production-analytics-engineering-dbt': 'Analytics Engineering with dbt Course',
      'centralized-authentication-authorization-envoy': 'Envoy Authentication and Authorization Course',
      'malware-analysis-defense': 'Malware Analysis and Defense Course',
    };
    return titles[course.slug] ?? `${course.title} Free Course`;
  }

  private getSeoDescription(course: CourseOutline, totalLabs: number): string {
    if (course.slug === 'mastering-spiffe-spire') {
      return `Free ${course.modules.length}-module SPIFFE/SPIRE course: deploy SPIRE on Kubernetes, issue SVIDs, configure mTLS, enforce OPA, federate clusters, and run ${totalLabs} labs.`;
    }
    if (course.slug === 'malware-analysis-defense') {
      return `Free defense-first malware analysis course for developers: safe triage, evidence, YARA, Sigma, incident response, and secure software design.`;
    }
    const labLabel = course.labDelivery === 'inline' ? `${totalLabs} inline exercises` : `${totalLabs} hands-on labs`;
    const descriptions: Record<string, string> = {
      'cloud-native-security-engineering': `Free ${course.modules.length}-module cloud native security course covering Kubernetes, Zero Trust, OPA, Falco, Sigstore, Vault, and ${totalLabs} labs.`,
      'production-rag-systems-engineering': `Free ${course.modules.length}-module production RAG course covering embeddings, hybrid retrieval, reranking, agents, evaluation, observability, security, and ${totalLabs} labs.`,
      'distributed-systems-engineering': `Free ${course.modules.length}-module distributed systems course covering CAP, consensus, data, reliability, Zero Trust, observability, Kubernetes, and ${totalLabs} labs.`,
      'production-analytics-engineering-dbt': `Free ${course.modules.length}-module analytics engineering course covering dbt, metrics, semantic layers, lineage, testing, CI/CD, and ${labLabel}.`,
      'centralized-authentication-authorization-envoy': `Free ${course.modules.length}-module Envoy authentication course covering SSO, OIDC, SAML, JWT/JWKS, ext_authz, Kubernetes, and ${labLabel}.`,
    };
    if (descriptions[course.slug]) return descriptions[course.slug];
    return `${course.excerpt} ${course.modules.length} modules, ${labLabel}, free.`;
  }

  private getCourseImage(course: CourseOutline): string {
    const imageByCourse: Record<string, string> = {
      'mastering-spiffe-spire': 'https://coderssecret.com/images/banners/course-mastering-spiffe-spire.svg',
      'cloud-native-security-engineering': 'https://coderssecret.com/images/banners/course-cloud-native-security-engineering.svg',
      'production-rag-systems-engineering': 'https://coderssecret.com/images/banners/course-production-rag-systems-engineering.svg',
      'distributed-systems-engineering': 'https://coderssecret.com/og-image.svg',
      'production-analytics-engineering-dbt': 'https://coderssecret.com/images/banners/course-production-analytics-engineering-dbt.svg',
      'centralized-authentication-authorization-envoy': 'https://coderssecret.com/images/banners/course-centralized-authentication-authorization-envoy.svg',
      'malware-analysis-defense': 'https://coderssecret.com/images/banners/course-malware-analysis-defense.svg',
    };
    return imageByCourse[course.slug] ?? 'https://coderssecret.com/og-image.svg';
  }

  private getCourseImageHeight(course: CourseOutline): number {
    return course.slug === 'distributed-systems-engineering'
      || course.slug === 'centralized-authentication-authorization-envoy'
      ? 630
      : 480;
  }
}
