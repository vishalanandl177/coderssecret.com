import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { COURSES, Course } from '../../../models/course.model';
import { SeoService } from '../../../services/seo.service';

interface CourseTheme {
  slug: string;
  icon: string;
  badge: string;
  border: string;
  accentText: string;
  accentBg: string;
  gradientText: string;
  resultsBg: string;
  buttonBg: string;
  pillBg: string;
}

@Component({
  selector: 'app-courses-hub',
  imports: [RouterLink],
  template: `
    <!-- Hero -->
    <section class="relative overflow-hidden">
      <div class="absolute inset-0 -z-10">
        <div class="absolute top-[-20%] left-[10%] h-[400px] w-[400px] rounded-full bg-cyan-500/10 blur-[120px]"></div>
        <div class="absolute top-[-10%] right-[10%] h-[400px] w-[400px] rounded-full bg-purple-500/10 blur-[120px]"></div>
      </div>

      <div class="container max-w-6xl mx-auto px-6 py-16 md:py-20">
        <nav aria-label="Breadcrumb" class="mb-6">
          <ol class="flex items-center gap-1.5 text-sm text-muted-foreground">
            <li><a routerLink="/" class="hover:text-foreground transition-colors">Home</a></li>
            <li class="text-muted-foreground/50">/</li>
            <li class="text-foreground font-medium" aria-current="page">Courses</li>
          </ol>
        </nav>

        <div class="text-center max-w-3xl mx-auto">
          <span class="inline-block rounded-full bg-green-500/10 border border-green-500/30 px-4 py-1 text-xs font-bold text-green-500 uppercase tracking-wider mb-4">100% Free &middot; No Signup</span>
          <h1 class="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.05] mb-5">
            Cloud Native Security &amp;
            <br class="hidden sm:block" />
            <span class="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 bg-clip-text text-transparent">Production Engineering</span> Courses
          </h1>
          <p class="text-base md:text-lg text-muted-foreground leading-relaxed mb-8">
            Production-focused, architecture-first, hands-on. Learn distributed systems engineering, workload identity, Zero Trust, Kubernetes security, and AI infrastructure &mdash; from operational reality, not textbooks.
          </p>

          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            <div class="text-center">
              <div class="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">{{ courses.length }}</div>
              <div class="text-xs text-muted-foreground mt-1">Free Courses</div>
            </div>
            <div class="text-center">
              <div class="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">{{ totalModules() }}</div>
              <div class="text-xs text-muted-foreground mt-1">Modules</div>
            </div>
            <div class="text-center">
              <div class="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">{{ totalLabs() }}+</div>
              <div class="text-xs text-muted-foreground mt-1">Hands-On Labs</div>
            </div>
            <div class="text-center">
              <div class="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text text-transparent">$0</div>
              <div class="text-xs text-muted-foreground mt-1">Cost (Forever)</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured course -->
    @if (featuredCourse(); as fc) {
      @let ft = themeFor(fc.slug);
      <section class="container max-w-6xl mx-auto px-6 pb-16">
        <div class="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">⭐ Featured &mdash; newest course</div>
        <a [routerLink]="'/courses/' + fc.slug"
           class="group block rounded-3xl border-2 bg-gradient-to-br p-8 md:p-12 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1"
           [class]="ft.border + ' ' + ft.resultsBg">
          <div class="grid md:grid-cols-3 gap-8 items-center">
            <div class="md:col-span-2">
              <div class="flex flex-wrap items-center gap-2 mb-4">
                <span class="text-3xl" aria-hidden="true">{{ ft.icon }}</span>
                <span class="rounded-full bg-green-500/15 border border-green-500/30 px-2.5 py-0.5 text-[10px] font-bold text-green-500 uppercase tracking-wider">Free</span>
                <span class="rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                      [class]="ft.pillBg + ' ' + ft.accentText">{{ fc.level }}</span>
                <span class="rounded-full bg-card border border-border/60 px-2.5 py-0.5 text-[10px] font-semibold text-muted-foreground">{{ fc.totalDuration }}</span>
              </div>
              <h2 class="text-2xl md:text-3xl font-extrabold tracking-tight mb-3">{{ fc.title }}</h2>
              <p class="text-base text-muted-foreground leading-relaxed mb-5">{{ fc.subtitle }}</p>
              <div class="flex flex-wrap gap-3">
                <span class="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold text-white shadow-lg group-hover:shadow-xl group-hover:gap-3 transition-all"
                      [class]="ft.buttonBg">
                  Start the course
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </span>
                <span class="inline-flex items-center rounded-full border border-border/60 bg-card/80 px-6 py-3 text-sm font-semibold text-foreground">
                  {{ fc.modules.length }} modules &middot; {{ totalLabsFor(fc) }}+ labs
                </span>
              </div>
            </div>
            <div class="space-y-2.5">
              <h3 class="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">For</h3>
              @for (audience of fc.targetAudience.slice(0, 5); track audience) {
                <div class="flex items-start gap-2 text-sm text-foreground/85">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="mt-0.5 shrink-0" [class]="ft.accentText" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>{{ audience }}</span>
                </div>
              }
            </div>
          </div>
        </a>
      </section>
    }

    <!-- All courses grid -->
    <section class="container max-w-6xl mx-auto px-6 pb-16">
      <div class="mb-8">
        <h2 class="text-2xl md:text-3xl font-extrabold tracking-tight mb-2">All Courses</h2>
        <p class="text-muted-foreground">Each course is structured around production architectures, hands-on labs, and the operational practices real teams use.</p>
      </div>

      <div class="grid md:grid-cols-2 gap-5">
        @for (course of courses; track course.id) {
          @let t = themeFor(course.slug);
          <a [routerLink]="'/courses/' + course.slug"
             class="group flex flex-col rounded-2xl border bg-card p-6 md:p-7 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
             [class]="t.border">
            <div class="flex items-start justify-between gap-4 mb-4">
              <div class="flex items-center gap-3">
                <div class="flex items-center justify-center h-12 w-12 rounded-xl text-2xl"
                     [class]="t.accentBg" aria-hidden="true">
                  {{ t.icon }}
                </div>
                <div class="flex flex-wrap gap-1.5">
                  <span class="rounded-full bg-green-500/15 border border-green-500/30 px-2 py-0.5 text-[9px] font-bold text-green-500 uppercase tracking-wider">Free</span>
                  <span class="rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider"
                        [class]="t.pillBg + ' ' + t.accentText">{{ course.level }}</span>
                </div>
              </div>
              <span class="text-xs font-mono text-muted-foreground shrink-0">{{ course.totalDuration }}</span>
            </div>

            <h3 class="text-lg md:text-xl font-bold tracking-tight mb-2 transition-colors duration-300"
                [class]="'group-hover:' + t.accentText">
              {{ course.title }}
            </h3>
            <p class="text-sm text-muted-foreground leading-relaxed mb-5 line-clamp-3">{{ course.subtitle }}</p>

            <div class="grid grid-cols-3 gap-2 mb-5">
              <div class="rounded-lg bg-accent/40 p-2.5 text-center">
                <div class="text-lg font-extrabold text-foreground">{{ course.modules.length }}</div>
                <div class="text-[9px] text-muted-foreground uppercase tracking-wider">Modules</div>
              </div>
              <div class="rounded-lg bg-accent/40 p-2.5 text-center">
                <div class="text-lg font-extrabold text-foreground">{{ totalLabsFor(course) }}+</div>
                <div class="text-[9px] text-muted-foreground uppercase tracking-wider">Labs</div>
              </div>
              <div class="rounded-lg bg-accent/40 p-2.5 text-center">
                <div class="text-lg font-extrabold text-foreground">$0</div>
                <div class="text-[9px] text-muted-foreground uppercase tracking-wider">Forever</div>
              </div>
            </div>

            <div class="flex flex-wrap gap-1.5 mb-5">
              @for (tag of course.tags.slice(0, 5); track tag) {
                <span class="rounded-md bg-muted/50 border border-border/40 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">{{ tag }}</span>
              }
              @if (course.tags.length > 5) {
                <span class="rounded-md bg-muted/30 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">+{{ course.tags.length - 5 }}</span>
              }
            </div>

            <div class="mt-auto pt-1 flex items-center justify-between">
              <span class="inline-flex items-center gap-1.5 text-sm font-semibold transition-all duration-300 group-hover:gap-2.5"
                    [class]="t.accentText">
                Start learning
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </span>
              <span class="text-xs text-muted-foreground">by {{ course.instructor.name }}</span>
            </div>
          </a>
        }
      </div>
    </section>

    <!-- Suggested learning paths -->
    <section class="bg-gradient-to-br from-cyan-500/5 via-card to-purple-500/5 border-y border-border/40 py-16">
      <div class="container max-w-6xl mx-auto px-6">
        <div class="text-center mb-10 max-w-3xl mx-auto">
          <span class="inline-block rounded-full bg-blue-500/10 border border-blue-500/30 px-4 py-1 text-xs font-bold text-blue-500 uppercase tracking-wider mb-4">Suggested Paths</span>
          <h2 class="text-2xl md:text-3xl font-extrabold tracking-tight mb-3">Three Ways to Use These Courses</h2>
          <p class="text-muted-foreground">Pick a path based on your role or where you want to go next.</p>
        </div>

        <div class="grid md:grid-cols-3 gap-5">
          <article class="rounded-2xl border border-orange-500/30 bg-card p-6">
            <div class="text-2xl mb-3" aria-hidden="true">🌐</div>
            <h3 class="text-lg font-bold tracking-tight mb-2">Distributed Systems Track</h3>
            <p class="text-sm text-muted-foreground leading-relaxed mb-4">Become production-fluent in distributed systems, then layer on security &amp; identity.</p>
            <ol class="space-y-2 text-sm">
              <li class="flex items-start gap-2.5"><span class="inline-flex items-center justify-center h-5 w-5 rounded-full bg-orange-500/20 text-orange-500 font-bold text-[10px] shrink-0 mt-0.5">1</span><a routerLink="/courses/distributed-systems-engineering" class="hover:text-primary transition-colors">Distributed Systems Engineering</a></li>
              <li class="flex items-start gap-2.5"><span class="inline-flex items-center justify-center h-5 w-5 rounded-full bg-orange-500/20 text-orange-500 font-bold text-[10px] shrink-0 mt-0.5">2</span><a routerLink="/courses/cloud-native-security-engineering" class="hover:text-primary transition-colors">Cloud Native Security Engineering</a></li>
              <li class="flex items-start gap-2.5"><span class="inline-flex items-center justify-center h-5 w-5 rounded-full bg-orange-500/20 text-orange-500 font-bold text-[10px] shrink-0 mt-0.5">3</span><a routerLink="/courses/mastering-spiffe-spire" class="hover:text-primary transition-colors">Mastering SPIFFE &amp; SPIRE</a></li>
            </ol>
          </article>

          <article class="rounded-2xl border border-purple-500/30 bg-card p-6">
            <div class="text-2xl mb-3" aria-hidden="true">🛡️</div>
            <h3 class="text-lg font-bold tracking-tight mb-2">Security Engineer Track</h3>
            <p class="text-sm text-muted-foreground leading-relaxed mb-4">Cloud-native security from foundations to workload identity to capstone.</p>
            <ol class="space-y-2 text-sm">
              <li class="flex items-start gap-2.5"><span class="inline-flex items-center justify-center h-5 w-5 rounded-full bg-purple-500/20 text-purple-500 font-bold text-[10px] shrink-0 mt-0.5">1</span><a routerLink="/courses/cloud-native-security-engineering" class="hover:text-primary transition-colors">Cloud Native Security Engineering</a></li>
              <li class="flex items-start gap-2.5"><span class="inline-flex items-center justify-center h-5 w-5 rounded-full bg-purple-500/20 text-purple-500 font-bold text-[10px] shrink-0 mt-0.5">2</span><a routerLink="/courses/mastering-spiffe-spire" class="hover:text-primary transition-colors">Mastering SPIFFE &amp; SPIRE</a></li>
              <li class="flex items-start gap-2.5"><span class="inline-flex items-center justify-center h-5 w-5 rounded-full bg-purple-500/20 text-purple-500 font-bold text-[10px] shrink-0 mt-0.5">3</span><a routerLink="/games/kubernetes-security-simulator" class="hover:text-primary transition-colors">Practice in the Security Simulators</a></li>
            </ol>
          </article>

          <article class="rounded-2xl border border-pink-500/30 bg-card p-6">
            <div class="text-2xl mb-3" aria-hidden="true">🤖</div>
            <h3 class="text-lg font-bold tracking-tight mb-2">AI Infrastructure Track</h3>
            <p class="text-sm text-muted-foreground leading-relaxed mb-4">Production AI/RAG with the security and distributed-systems foundations to back it.</p>
            <ol class="space-y-2 text-sm">
              <li class="flex items-start gap-2.5"><span class="inline-flex items-center justify-center h-5 w-5 rounded-full bg-pink-500/20 text-pink-500 font-bold text-[10px] shrink-0 mt-0.5">1</span><a routerLink="/courses/distributed-systems-engineering" class="hover:text-primary transition-colors">Distributed Systems Engineering</a></li>
              <li class="flex items-start gap-2.5"><span class="inline-flex items-center justify-center h-5 w-5 rounded-full bg-pink-500/20 text-pink-500 font-bold text-[10px] shrink-0 mt-0.5">2</span><a routerLink="/courses/production-rag-systems-engineering" class="hover:text-primary transition-colors">Production RAG Systems Engineering</a></li>
              <li class="flex items-start gap-2.5"><span class="inline-flex items-center justify-center h-5 w-5 rounded-full bg-pink-500/20 text-pink-500 font-bold text-[10px] shrink-0 mt-0.5">3</span><a routerLink="/games/ai-infrastructure-security" class="hover:text-primary transition-colors">AI Infrastructure Security Game</a></li>
            </ol>
          </article>
        </div>
      </div>
    </section>

    <!-- Beyond the courses -->
    <section class="container max-w-6xl mx-auto px-6 py-16">
      <div class="text-center mb-10">
        <h2 class="text-2xl md:text-3xl font-extrabold tracking-tight mb-3">Beyond the Courses</h2>
        <p class="text-muted-foreground max-w-2xl mx-auto">Reinforce what you learn with hands-on simulators, fast operational references, and deep technical articles.</p>
      </div>

      <div class="grid md:grid-cols-3 gap-5">
        <a routerLink="/games" class="group rounded-2xl border border-border/60 bg-card p-6 hover:border-orange-500/40 hover:-translate-y-1 transition-all">
          <div class="text-2xl mb-3" aria-hidden="true">🎮</div>
          <h3 class="text-lg font-bold tracking-tight mb-2 group-hover:text-orange-500 transition-colors">Security Simulators</h3>
          <p class="text-sm text-muted-foreground leading-relaxed">10 interactive scenario-based games &mdash; Kubernetes Security Simulator, Zero Trust Network Builder, Incident Response, and more. Practice production decisions, no cluster required.</p>
        </a>
        <a routerLink="/cheatsheets" class="group rounded-2xl border border-border/60 bg-card p-6 hover:border-cyan-500/40 hover:-translate-y-1 transition-all">
          <div class="text-2xl mb-3" aria-hidden="true">📋</div>
          <h3 class="text-lg font-bold tracking-tight mb-2 group-hover:text-cyan-500 transition-colors">Cheatsheets</h3>
          <p class="text-sm text-muted-foreground leading-relaxed">Fast operational references for Kubernetes, SPIFFE/SPIRE, OPA/Rego, API security, runtime security, service mesh, and DevSecOps.</p>
        </a>
        <a routerLink="/blog" class="group rounded-2xl border border-border/60 bg-card p-6 hover:border-purple-500/40 hover:-translate-y-1 transition-all">
          <div class="text-2xl mb-3" aria-hidden="true">📝</div>
          <h3 class="text-lg font-bold tracking-tight mb-2 group-hover:text-purple-500 transition-colors">Engineering Blog</h3>
          <p class="text-sm text-muted-foreground leading-relaxed">Long-form deep dives on distributed systems algorithms, rate limiting, caching strategies, scheduling, and the production-engineering patterns that hold up at scale.</p>
        </a>
      </div>
    </section>
  `,
})
export class CoursesHubComponent {
  courses = COURSES;
  private seo = inject(SeoService);

  totalModules = computed(() =>
    this.courses.reduce((sum, c) => sum + c.modules.length, 0)
  );

  totalLabs = computed(() =>
    this.courses.reduce(
      (sum, c) => sum + c.modules.reduce((s, m) => s + m.labs.length, 0),
      0
    )
  );

  /** Featured = the highest-id (newest) course. */
  featuredCourse = computed<Course | undefined>(() => {
    if (this.courses.length === 0) return undefined;
    return [...this.courses].sort((a, b) => Number(b.id) - Number(a.id))[0];
  });

  totalLabsFor(course: Course): number {
    return course.modules.reduce((sum, m) => sum + m.labs.length, 0);
  }

  /**
   * Per-course visual theme. Class strings are written literally so
   * Tailwind can detect them at build time.
   */
  themeFor(slug: string): CourseTheme {
    const themes: Record<string, CourseTheme> = {
      'mastering-spiffe-spire': {
        slug: 'mastering-spiffe-spire',
        icon: '🛡️',
        badge: 'Workload Identity',
        border: 'border-cyan-500/30 hover:border-cyan-500/60',
        accentText: 'text-cyan-500',
        accentBg: 'bg-cyan-500/10',
        gradientText: 'from-cyan-500 via-teal-500 to-blue-500',
        resultsBg: 'from-cyan-500/10 via-card to-teal-500/10',
        buttonBg: 'bg-cyan-500 hover:bg-cyan-400 shadow-cyan-500/30',
        pillBg: 'bg-cyan-500/15 border border-cyan-500/30',
      },
      'cloud-native-security-engineering': {
        slug: 'cloud-native-security-engineering',
        icon: '🔐',
        badge: 'Cloud Native Security',
        border: 'border-purple-500/30 hover:border-purple-500/60',
        accentText: 'text-purple-500',
        accentBg: 'bg-purple-500/10',
        gradientText: 'from-purple-500 via-violet-500 to-pink-500',
        resultsBg: 'from-purple-500/10 via-card to-pink-500/10',
        buttonBg: 'bg-purple-500 hover:bg-purple-400 shadow-purple-500/30',
        pillBg: 'bg-purple-500/15 border border-purple-500/30',
      },
      'production-rag-systems-engineering': {
        slug: 'production-rag-systems-engineering',
        icon: '🤖',
        badge: 'AI Infrastructure',
        border: 'border-pink-500/30 hover:border-pink-500/60',
        accentText: 'text-pink-500',
        accentBg: 'bg-pink-500/10',
        gradientText: 'from-pink-500 via-rose-500 to-orange-500',
        resultsBg: 'from-pink-500/10 via-card to-rose-500/10',
        buttonBg: 'bg-pink-500 hover:bg-pink-400 shadow-pink-500/30',
        pillBg: 'bg-pink-500/15 border border-pink-500/30',
      },
      'distributed-systems-engineering': {
        slug: 'distributed-systems-engineering',
        icon: '🌐',
        badge: 'Distributed Systems',
        border: 'border-orange-500/30 hover:border-orange-500/60',
        accentText: 'text-orange-500',
        accentBg: 'bg-orange-500/10',
        gradientText: 'from-orange-500 via-amber-500 to-yellow-500',
        resultsBg: 'from-orange-500/10 via-card to-amber-500/10',
        buttonBg: 'bg-orange-500 hover:bg-orange-400 shadow-orange-500/30',
        pillBg: 'bg-orange-500/15 border border-orange-500/30',
      },
    };
    return themes[slug] ?? {
      slug,
      icon: '📚',
      badge: 'Course',
      border: 'border-border/60 hover:border-primary/40',
      accentText: 'text-primary',
      accentBg: 'bg-primary/10',
      gradientText: 'from-primary to-primary',
      resultsBg: 'from-primary/10 via-card to-primary/5',
      buttonBg: 'bg-primary hover:bg-primary/90 shadow-primary/30',
      pillBg: 'bg-primary/15 border border-primary/30',
    };
  }

  constructor() {
    this.seo.update({
      title: 'Free Engineering Courses — CodersSecret',
      description: 'Free production-engineering courses on Distributed Systems, Cloud Native Security, SPIFFE/SPIRE workload identity, and Production RAG. Architecture-first, hands-on labs, ad-free, no signup.',
      url: '/courses',
      breadcrumbs: [
        { name: 'Home', url: '/' },
        { name: 'Courses', url: '/courses' },
      ],
    });
  }
}
