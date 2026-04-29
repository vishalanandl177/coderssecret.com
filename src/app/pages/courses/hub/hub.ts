import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { COURSES } from '../../../models/course.model';
import { SeoService } from '../../../services/seo.service';

@Component({
  selector: 'app-courses-hub',
  imports: [RouterLink],
  template: `
    <section class="container max-w-6xl mx-auto px-6 py-16">
      <nav class="mb-8 text-sm text-muted-foreground">
        <a routerLink="/" class="hover:text-foreground transition-colors">Home</a>
        <span class="mx-2">/</span>
        <span class="text-foreground">Courses</span>
      </nav>

      <div class="text-center mb-16">
        <span class="inline-block rounded-full bg-green-500/10 border border-green-500/30 px-4 py-1 text-xs font-bold text-green-500 uppercase tracking-wider mb-4">100% Free</span>
        <h1 class="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
          Free <span class="bg-gradient-to-r from-teal-500 to-cyan-500 bg-clip-text text-transparent">Engineering Courses</span>
        </h1>
        <p class="text-lg text-muted-foreground max-w-2xl mx-auto">
          Production-focused courses that transform you from tutorial reader to the engineer who secures, scales, and ships real infrastructure.
        </p>
      </div>

      @for (course of courses; track course.id) {
        <div class="rounded-2xl border border-border/60 bg-card p-8 md:p-10 shadow-sm hover:shadow-lg transition-all duration-300">
          <div class="flex flex-col lg:flex-row gap-8">
            <div class="flex-1">
              <div class="flex flex-wrap gap-2 mb-4">
                <span class="rounded-full bg-green-500/10 border border-green-500/30 px-3 py-0.5 text-xs font-bold text-green-500">FREE</span>
                <span class="rounded-full bg-primary/10 border border-primary/30 px-3 py-0.5 text-xs font-semibold text-primary">{{ course.level }}</span>
                <span class="rounded-full bg-cyan-500/10 border border-cyan-500/30 px-3 py-0.5 text-xs font-semibold text-cyan-500">{{ course.totalDuration }}</span>
              </div>
              <h2 class="text-2xl md:text-3xl font-bold mb-3">{{ course.title }}</h2>
              <p class="text-muted-foreground mb-6 leading-relaxed">{{ course.subtitle }}</p>

              <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div class="text-center p-3 rounded-lg bg-accent/50">
                  <div class="text-2xl font-bold text-foreground">{{ course.modules.length }}</div>
                  <div class="text-xs text-muted-foreground">Modules</div>
                </div>
                <div class="text-center p-3 rounded-lg bg-accent/50">
                  <div class="text-2xl font-bold text-foreground">{{ getTotalLabs(course) }}</div>
                  <div class="text-xs text-muted-foreground">Hands-On Labs</div>
                </div>
                <div class="text-center p-3 rounded-lg bg-accent/50">
                  <div class="text-2xl font-bold text-foreground">{{ course.totalDuration }}</div>
                  <div class="text-xs text-muted-foreground">Total Duration</div>
                </div>
                <div class="text-center p-3 rounded-lg bg-accent/50">
                  <div class="text-2xl font-bold text-foreground">$0</div>
                  <div class="text-xs text-muted-foreground">Cost (Forever)</div>
                </div>
              </div>

              <div class="flex flex-wrap gap-2 mb-6">
                @for (tag of course.tags.slice(0, 8); track tag) {
                  <span class="rounded-md bg-accent px-2 py-1 text-xs text-muted-foreground">{{ tag }}</span>
                }
              </div>

              <div class="flex flex-wrap gap-3">
                <a [routerLink]="'/courses/' + course.slug"
                   class="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
                  Start Learning
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </a>
                <a [routerLink]="'/courses/' + course.slug"
                   fragment="curriculum"
                   class="inline-flex items-center rounded-full border border-border/60 bg-card/60 px-6 py-3 text-sm font-semibold text-foreground hover:bg-accent transition-all duration-300">
                  View Curriculum
                </a>
              </div>
            </div>

            <div class="lg:w-80 flex flex-col gap-3">
              <h3 class="font-semibold text-foreground mb-1">Who This Course Is For</h3>
              @for (audience of course.targetAudience; track audience) {
                <div class="flex items-start gap-2 text-sm text-muted-foreground">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="mt-0.5 shrink-0 text-green-500"><polyline points="20 6 9 17 4 12"/></svg>
                  {{ audience }}
                </div>
              }
            </div>
          </div>
        </div>
      }
    </section>
  `,
})
export class CoursesHubComponent {
  courses = COURSES;
  private seo = inject(SeoService);

  constructor() {
    this.seo.update({
      title: 'Free Engineering Courses — CodersSecret',
      description: 'Production-focused engineering courses — completely free. Learn zero trust security, SPIFFE/SPIRE, Kubernetes identity, and cloud-native architecture with hands-on labs.',
    });
  }

  getTotalLabs(course: typeof COURSES[0]): number {
    return course.modules.reduce((sum, m) => sum + m.labs.length, 0);
  }
}
