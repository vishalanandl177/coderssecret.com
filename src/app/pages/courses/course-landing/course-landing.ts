import { Component, inject, signal, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { COURSES, Course } from '../../../models/course.model';
import { SeoService } from '../../../services/seo.service';

@Component({
  selector: 'app-course-landing',
  imports: [RouterLink],
  template: `
    @if (course(); as c) {
    <!-- Hero -->
    <section class="relative overflow-hidden">
      <div class="absolute inset-0 -z-10">
        <div class="absolute top-[-20%] left-[-10%] h-[500px] w-[500px] rounded-full bg-teal-500/15 blur-[100px]"></div>
        <div class="absolute top-[-10%] right-[-10%] h-[400px] w-[400px] rounded-full bg-cyan-500/15 blur-[100px]"></div>
      </div>
      <div class="container max-w-6xl mx-auto px-6 pt-16 pb-20">
        <nav class="mb-8 text-sm text-muted-foreground">
          <a routerLink="/" class="hover:text-foreground transition-colors">Home</a>
          <span class="mx-2">/</span>
          <a routerLink="/courses" class="hover:text-foreground transition-colors">Courses</a>
          <span class="mx-2">/</span>
          <span class="text-foreground">{{ c.title }}</span>
        </nav>

        <div class="flex flex-wrap gap-2 mb-6">
          <span class="rounded-full bg-green-500/10 border border-green-500/30 px-4 py-1.5 text-sm font-bold text-green-500">100% FREE</span>
          <span class="rounded-full bg-primary/10 border border-primary/30 px-4 py-1.5 text-sm font-semibold text-primary">{{ c.level }}</span>
          <span class="rounded-full bg-cyan-500/10 border border-cyan-500/30 px-4 py-1.5 text-sm font-semibold text-cyan-500">{{ c.modules.length }} Modules</span>
          <span class="rounded-full bg-orange-500/10 border border-orange-500/30 px-4 py-1.5 text-sm font-semibold text-orange-500">{{ c.totalDuration }}</span>
        </div>

        <h1 class="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight mb-6">{{ c.title }}</h1>
        <p class="text-lg md:text-xl text-muted-foreground max-w-3xl leading-relaxed mb-8">{{ c.subtitle }}</p>

        <div class="flex flex-wrap gap-3 mb-10">
          <a [routerLink]="'/courses/' + c.slug + '/' + c.modules[0].slug"
             class="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
            Start Module 1 — Free
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </a>
          <a [href]="'https://github.com/vishalanandl177/' + c.slug" target="_blank" rel="noopener noreferrer"
             class="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-8 py-4 text-base font-semibold text-foreground hover:bg-accent transition-all duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
            Course Labs on GitHub
          </a>
        </div>
      </div>
    </section>

    <!-- What You'll Build -->
    <section class="border-b border-border/40 py-16">
      <div class="container max-w-6xl mx-auto px-6">
        <h2 class="text-2xl md:text-3xl font-bold text-center mb-10">By the End of This Course, You Will Build</h2>
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div class="flex items-start gap-3 p-4 rounded-xl border border-green-500/20 bg-green-500/5">
            <span class="text-green-500 text-lg mt-0.5 shrink-0">&#10003;</span>
            <span class="text-sm">A production-style <strong class="text-foreground">Zero Trust Kubernetes platform</strong></span>
          </div>
          <div class="flex items-start gap-3 p-4 rounded-xl border border-green-500/20 bg-green-500/5">
            <span class="text-green-500 text-lg mt-0.5 shrink-0">&#10003;</span>
            <span class="text-sm"><strong class="text-foreground">Secure workload identities</strong> with automatic rotation</span>
          </div>
          <div class="flex items-start gap-3 p-4 rounded-xl border border-green-500/20 bg-green-500/5">
            <span class="text-green-500 text-lg mt-0.5 shrink-0">&#10003;</span>
            <span class="text-sm"><strong class="text-foreground">mTLS-encrypted services</strong> via Envoy SDS</span>
          </div>
          <div class="flex items-start gap-3 p-4 rounded-xl border border-green-500/20 bg-green-500/5">
            <span class="text-green-500 text-lg mt-0.5 shrink-0">&#10003;</span>
            <span class="text-sm"><strong class="text-foreground">OPA-powered authorization</strong> policies</span>
          </div>
          <div class="flex items-start gap-3 p-4 rounded-xl border border-green-500/20 bg-green-500/5">
            <span class="text-green-500 text-lg mt-0.5 shrink-0">&#10003;</span>
            <span class="text-sm"><strong class="text-foreground">Federated trust domains</strong> across clusters</span>
          </div>
          <div class="flex items-start gap-3 p-4 rounded-xl border border-green-500/20 bg-green-500/5">
            <span class="text-green-500 text-lg mt-0.5 shrink-0">&#10003;</span>
            <span class="text-sm"><strong class="text-foreground">Production monitoring</strong> with Prometheus dashboards</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Transformation Section -->
    <section class="bg-accent/30 border-y border-border/40 py-16">
      <div class="container max-w-6xl mx-auto px-6">
        <h2 class="text-2xl md:text-3xl font-bold text-center mb-4">This Course Is Not About Technology</h2>
        <p class="text-center text-muted-foreground max-w-2xl mx-auto mb-10">It is about becoming the engineer who secures production Kubernetes clusters with cryptographic workload identity — a skill that makes you invaluable in the AI/cloud-native era.</p>
        <div class="grid md:grid-cols-3 gap-6">
          <div class="p-6 rounded-xl bg-card border border-border/60">
            <div class="text-3xl mb-3">Before</div>
            <p class="text-muted-foreground text-sm">Shared secrets in env vars. Long-lived API keys. NetworkPolicies and hope. No idea how services actually authenticate.</p>
          </div>
          <div class="p-6 rounded-xl bg-card border border-green-500/40 shadow-lg shadow-green-500/5">
            <div class="text-3xl mb-3">After</div>
            <p class="text-sm text-foreground">You deploy SPIRE on Kubernetes, configure mTLS between services, enforce OPA policies, and federate across clusters. You are the zero trust engineer.</p>
          </div>
          <div class="p-6 rounded-xl bg-card border border-border/60">
            <div class="text-3xl mb-3">Career Impact</div>
            <p class="text-muted-foreground text-sm">Platform engineering, security engineering, and DevOps roles increasingly require zero trust skills. This course positions you ahead of the curve.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Who Is This For -->
    <section class="container max-w-6xl mx-auto px-6 py-16">
      <h2 class="text-2xl md:text-3xl font-bold mb-8">Who Should Take This Course?</h2>
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        @for (audience of c.targetAudience; track audience) {
          <div class="flex items-start gap-3 p-4 rounded-lg border border-border/40 bg-card/50">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mt-0.5 shrink-0 text-green-500"><polyline points="20 6 9 17 4 12"/></svg>
            <span class="text-sm">{{ audience }}</span>
          </div>
        }
      </div>
    </section>

    <!-- Curriculum -->
    <section id="curriculum" class="bg-accent/20 border-y border-border/40 py-16">
      <div class="container max-w-6xl mx-auto px-6">
        <h2 class="text-2xl md:text-3xl font-bold mb-2">Full Curriculum</h2>
        <p class="text-muted-foreground mb-8">{{ c.modules.length }} modules, {{ getTotalLabs() }} hands-on labs, {{ c.totalDuration }} of production-focused content</p>

        <div class="space-y-3">
          @for (mod of c.modules; track mod.number) {
            <div class="rounded-xl border border-border/60 bg-card overflow-hidden">
              <button (click)="toggleModule(mod.number)"
                      class="w-full flex items-center justify-between p-5 text-left hover:bg-accent/50 transition-colors">
                <div class="flex items-center gap-4">
                  <span class="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 text-primary text-sm font-bold">{{ mod.number }}</span>
                  <div>
                    <div class="font-semibold text-foreground">{{ mod.title }}</div>
                    <div class="text-sm text-muted-foreground">{{ mod.subtitle }}</div>
                  </div>
                </div>
                <div class="flex items-center gap-3 shrink-0">
                  <span class="text-xs text-muted-foreground hidden sm:block">{{ mod.duration }} · {{ mod.labs.length }} labs</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-muted-foreground" [class.rotate-180]="openModules().has(mod.number)"><polyline points="6 9 12 15 18 9"/></svg>
                </div>
              </button>
              @if (openModules().has(mod.number)) {
                <div class="px-5 pb-5 border-t border-border/40">
                  <div class="pt-4 space-y-2">
                    <div class="text-sm font-semibold text-foreground mb-2">Learning Objectives</div>
                    @for (obj of mod.objectives; track obj) {
                      <div class="flex items-start gap-2 text-sm text-muted-foreground">
                        <span class="text-primary mt-0.5">•</span> {{ obj }}
                      </div>
                    }
                    @if (mod.labs.length > 0) {
                      <div class="text-sm font-semibold text-foreground mt-4 mb-2">Hands-On Labs</div>
                      @for (lab of mod.labs; track lab.title) {
                        <div class="flex items-start gap-2 text-sm text-muted-foreground">
                          <span class="text-green-500 mt-0.5">&#9654;</span> {{ lab.title }}
                        </div>
                      }
                    }
                    <div class="mt-4">
                      <a [routerLink]="'/courses/' + c.slug + '/' + mod.slug"
                         class="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
                        Start Module {{ mod.number }}
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                      </a>
                    </div>
                  </div>
                </div>
              }
            </div>
          }
        </div>
      </div>
    </section>

    <!-- Instructor -->
    <section class="container max-w-6xl mx-auto px-6 py-16">
      <h2 class="text-2xl md:text-3xl font-bold mb-8">Your Instructor</h2>
      <div class="flex flex-col md:flex-row gap-6 p-6 rounded-xl border border-border/60 bg-card">
        <div class="flex-1">
          <h3 class="text-xl font-bold mb-1">{{ c.instructor.name }}</h3>
          <p class="text-sm text-muted-foreground mb-4">{{ c.instructor.title }}</p>
          <p class="text-sm text-muted-foreground leading-relaxed mb-4">{{ c.instructor.bio }}</p>
          <ul class="space-y-2">
            @for (achievement of c.instructor.achievements; track achievement) {
              <li class="flex items-start gap-2 text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="mt-0.5 shrink-0 text-green-500"><polyline points="20 6 9 17 4 12"/></svg>
                {{ achievement }}
              </li>
            }
          </ul>
          <a [href]="c.instructor.github" target="_blank" rel="noopener noreferrer"
             class="inline-flex items-center gap-2 mt-4 text-sm font-semibold text-primary hover:underline">
            View GitHub Profile
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          </a>
        </div>
      </div>
    </section>

    <!-- FAQ -->
    @if (c.faqs && c.faqs.length > 0) {
    <section class="bg-accent/20 border-y border-border/40 py-16">
      <div class="container max-w-4xl mx-auto px-6">
        <h2 class="text-2xl md:text-3xl font-bold mb-8">Frequently Asked Questions</h2>
        <div class="space-y-4">
          @for (faq of c.faqs; track faq.question) {
            <div class="rounded-xl border border-border/60 bg-card overflow-hidden">
              <button (click)="toggleFaq(faq.question)"
                      class="w-full flex items-center justify-between p-5 text-left hover:bg-accent/50 transition-colors">
                <span class="font-semibold text-foreground pr-4">{{ faq.question }}</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-muted-foreground shrink-0" [class.rotate-180]="openFaqs().has(faq.question)"><polyline points="6 9 12 15 18 9"/></svg>
              </button>
              @if (openFaqs().has(faq.question)) {
                <div class="px-5 pb-5 border-t border-border/40">
                  <p class="text-sm text-muted-foreground leading-relaxed pt-3">{{ faq.answer }}</p>
                </div>
              }
            </div>
          }
        </div>
      </div>
    </section>
    }

    <!-- Tags -->
    <section class="container max-w-6xl mx-auto px-6 pb-16">
      <h2 class="text-lg font-semibold mb-4">Course Topics</h2>
      <div class="flex flex-wrap gap-2">
        @for (tag of c.tags; track tag) {
          <span class="rounded-full bg-accent border border-border/40 px-3 py-1 text-sm text-muted-foreground">{{ tag }}</span>
        }
      </div>
    </section>
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
      const totalLabs = this.getTotalLabsFor(c);
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

  getTotalLabs(): number {
    return this.course()?.modules.reduce((sum, m) => sum + m.labs.length, 0) ?? 0;
  }

  private getTotalLabsFor(course: Course): number {
    return course.modules.reduce((sum, m) => sum + m.labs.length, 0);
  }

  private getSeoTitle(course: Course): string {
    if (course.slug === 'mastering-spiffe-spire') {
      return 'Mastering SPIFFE & SPIRE: Zero Trust Course';
    }
    return course.title + ' - Free Course';
  }

  private getSeoDescription(course: Course, totalLabs: number): string {
    if (course.slug === 'mastering-spiffe-spire') {
      return `Free ${course.modules.length}-module SPIFFE/SPIRE course: deploy SPIRE on Kubernetes, issue SVIDs, configure mTLS, enforce OPA, federate clusters, and run ${totalLabs}+ labs.`;
    }
    return `${course.excerpt} ${course.modules.length} modules, ${totalLabs}+ hands-on labs, free.`;
  }

  private getCourseImage(course: Course): string {
    const imageByCourse: Record<string, string> = {
      'mastering-spiffe-spire': 'https://coderssecret.com/images/banners/course-mastering-spiffe-spire.svg',
      'cloud-native-security-engineering': 'https://coderssecret.com/images/banners/course-cloud-native-security-engineering.svg',
      'production-rag-systems-engineering': 'https://coderssecret.com/images/banners/course-production-rag-systems-engineering.svg',
    };
    return imageByCourse[course.slug] ?? 'https://coderssecret.com/og-image.svg';
  }
}
