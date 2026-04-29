import { Component, inject, signal, computed, DestroyRef } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { COURSES, CourseModule, Course } from '../../../models/course.model';
import { SeoService } from '../../../services/seo.service';

@Component({
  selector: 'app-course-module',
  imports: [RouterLink],
  template: `
    @if (mod(); as m) {
    <div class="container max-w-6xl mx-auto px-6 py-12">
      <nav class="mb-8 text-sm text-muted-foreground">
        <a routerLink="/" class="hover:text-foreground transition-colors">Home</a>
        <span class="mx-2">/</span>
        <a routerLink="/courses" class="hover:text-foreground transition-colors">Courses</a>
        <span class="mx-2">/</span>
        <a [routerLink]="'/courses/' + courseSlug()" class="hover:text-foreground transition-colors">{{ courseTitle() }}</a>
        <span class="mx-2">/</span>
        <span class="text-foreground">Module {{ m.number }}</span>
      </nav>

      <div class="flex flex-col lg:flex-row gap-10">
        <!-- Main Content -->
        <main class="flex-1 min-w-0">
          <div class="flex flex-wrap gap-2 mb-4">
            <span class="rounded-full bg-primary/10 border border-primary/30 px-3 py-0.5 text-xs font-bold text-primary">Module {{ m.number }} of {{ totalModules() }}</span>
            <span class="rounded-full bg-accent border border-border/40 px-3 py-0.5 text-xs text-muted-foreground">{{ m.duration }}</span>
            <span class="rounded-full bg-green-500/10 border border-green-500/30 px-3 py-0.5 text-xs font-bold text-green-500">FREE</span>
          </div>

          <h1 class="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">{{ m.title }}</h1>
          <p class="text-lg text-muted-foreground mb-8">{{ m.subtitle }}</p>

          <!-- Objectives -->
          <div class="rounded-xl border border-border/60 bg-card p-6 mb-8">
            <h2 class="font-semibold text-foreground mb-3">Learning Objectives</h2>
            <ul class="space-y-2">
              @for (obj of m.objectives; track obj) {
                <li class="flex items-start gap-2 text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="mt-0.5 shrink-0 text-primary"><polyline points="20 6 9 17 4 12"/></svg>
                  {{ obj }}
                </li>
              }
            </ul>
          </div>

          <!-- Architecture Diagram -->
          @if (safeSvg(); as svg) {
            <div class="rounded-xl border border-border/60 overflow-hidden mb-8 bg-slate-900" [innerHTML]="svg"></div>
          }

          <!-- Content -->
          <article class="course-content max-w-none mb-10" [innerHTML]="safeContent()"></article>

          <!-- Labs -->
          @if (m.labs.length > 0) {
            <div class="mb-10">
              <h2 class="text-2xl font-bold mb-4">Hands-On Labs</h2>
              <div class="space-y-4">
                @for (lab of m.labs; track lab.title; let i = $index) {
                  <div class="rounded-xl border border-border/60 bg-card p-6">
                    <div class="flex items-start gap-3 mb-3">
                      <span class="flex items-center justify-center h-7 w-7 rounded-full bg-green-500/10 text-green-500 text-xs font-bold">{{ i + 1 }}</span>
                      <div>
                        <h3 class="font-semibold text-foreground">{{ lab.title }}</h3>
                        <p class="text-sm text-muted-foreground">{{ lab.objective }}</p>
                      </div>
                    </div>
                    <ol class="ml-10 space-y-1">
                      @for (step of lab.steps; track step) {
                        <li class="text-sm text-muted-foreground list-decimal">{{ step }}</li>
                      }
                    </ol>
                    <a [href]="'https://github.com/vishalanandl177/mastering-spiffe-spire/tree/main/' + lab.repoPath" target="_blank" rel="noopener noreferrer"
                       class="inline-flex items-center gap-1.5 mt-3 ml-10 text-xs font-semibold text-primary hover:underline">
                      View Lab on GitHub
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                    </a>
                  </div>
                }
              </div>
            </div>
          }

          <!-- Key Takeaways -->
          <div class="rounded-xl border border-green-500/30 bg-green-500/5 p-6 mb-10">
            <h2 class="font-semibold text-foreground mb-3">Key Takeaways</h2>
            <ul class="space-y-2">
              @for (takeaway of m.keyTakeaways; track takeaway) {
                <li class="flex items-start gap-2 text-sm">
                  <span class="text-green-500 mt-0.5 shrink-0">&#10003;</span>
                  {{ takeaway }}
                </li>
              }
            </ul>
          </div>

          <!-- Navigation -->
          <div class="flex justify-between items-center pt-6 border-t border-border/40">
            @if (prevModule(); as prev) {
              <a [routerLink]="'/courses/' + courseSlug() + '/' + prev.slug"
                 class="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
                Module {{ prev.number }}: {{ prev.title }}
              </a>
            } @else {
              <div></div>
            }
            @if (nextModule(); as next) {
              <a [routerLink]="'/courses/' + courseSlug() + '/' + next.slug"
                 class="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
                Module {{ next.number }}: {{ next.title }}
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </a>
            }
          </div>
        </main>

        <!-- Sidebar -->
        <aside class="lg:w-72 shrink-0 hidden lg:block">
          <div class="sticky top-24 space-y-2">
            <h3 class="font-semibold text-sm text-foreground mb-3">All Modules</h3>
            @for (mod of allModules(); track mod.number) {
              <a [routerLink]="'/courses/' + courseSlug() + '/' + mod.slug"
                 class="flex items-center gap-2 p-2 rounded-lg text-sm transition-colors"
                 [class]="mod.number === m.number ? 'bg-primary/10 text-primary font-semibold' : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'">
                <span class="flex items-center justify-center h-6 w-6 rounded-full text-xs font-bold"
                      [class]="mod.number === m.number ? 'bg-primary text-primary-foreground' : 'bg-accent text-muted-foreground'">{{ mod.number }}</span>
                <span class="truncate">{{ mod.title }}</span>
              </a>
            }
          </div>
        </aside>
      </div>
    </div>
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
    const course = COURSES.find(c => c.slug === 'mastering-spiffe-spire');
    if (course) {
      this.courseData.set(course);
      this.courseSlug.set(course.slug);
      this.courseTitle.set(course.title);
      this.totalModules.set(course.modules.length);
      this.allModules.set(course.modules);
    }

    this.route.paramMap.pipe(takeUntilDestroyed()).subscribe(params => {
      const moduleSlug = params.get('moduleSlug') ?? '';
      const c = this.courseData();
      if (c) {
        const m = c.modules.find(m => m.slug === moduleSlug);
        if (m) {
          this.mod.set(m);
          this.seo.update({
            title: `Module ${m.number}: ${m.title} — ${c.title} | CodersSecret`,
            description: m.subtitle + '. ' + m.objectives.join('. '),
          });
          window.scrollTo(0, 0);
        }
      }
    });
  }
}
