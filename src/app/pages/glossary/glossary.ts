import { Component, inject, signal, computed } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { GLOSSARY, GlossaryEntry } from '../../models/glossary.model';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-glossary',
  imports: [RouterLink],
  template: `
    @if (entry(); as e) {
    <div class="container max-w-4xl mx-auto px-6 py-16">
      <nav class="mb-8 text-sm text-muted-foreground">
        <a routerLink="/" class="hover:text-foreground transition-colors">Home</a>
        <span class="mx-2">/</span>
        <a routerLink="/glossary" class="hover:text-foreground transition-colors">Glossary</a>
        <span class="mx-2">/</span>
        <span class="text-foreground">{{ e.term }}</span>
      </nav>

      <article class="course-content max-w-none" [innerHTML]="safeContent()"></article>

      <!-- Related Terms -->
      @if (e.relatedTerms && e.relatedTerms.length > 0) {
        <div class="mt-10 rounded-xl border border-border/60 bg-card p-6">
          <h2 class="font-semibold text-foreground mb-3">Related Terms</h2>
          <div class="flex flex-wrap gap-2">
            @for (term of e.relatedTerms; track term) {
              <a [routerLink]="'/glossary/' + term"
                 class="rounded-full bg-accent border border-border/40 px-3 py-1 text-sm text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors">
                {{ getTermName(term) }}
              </a>
            }
          </div>
        </div>
      }

      <!-- Related Courses -->
      @if (e.relatedCourses && e.relatedCourses.length > 0) {
        <div class="mt-6 rounded-xl border border-primary/30 bg-primary/5 p-6">
          <h2 class="font-semibold text-foreground mb-3">Learn This in Our Free Courses</h2>
          <div class="space-y-2">
            @for (course of e.relatedCourses; track course.slug) {
              <a [routerLink]="'/courses/' + course.slug"
                 class="flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                {{ course.title }}
              </a>
            }
          </div>
        </div>
      }
    </div>
    } @else if (isHub()) {
    <div class="container max-w-6xl mx-auto px-6 py-16">
      <nav class="mb-8 text-sm text-muted-foreground">
        <a routerLink="/" class="hover:text-foreground transition-colors">Home</a>
        <span class="mx-2">/</span>
        <span class="text-foreground">Glossary</span>
      </nav>

      <h1 class="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">Cloud Native Security Glossary</h1>
      <p class="text-lg text-muted-foreground mb-10">Quick-reference definitions for cloud-native security, workload identity, Kubernetes security, and Zero Trust terms.</p>

      <div class="grid md:grid-cols-2 gap-4">
        @for (item of allEntries; track item.slug) {
          <a [routerLink]="'/glossary/' + item.slug"
             class="group rounded-xl border border-border/60 bg-card p-5 hover:shadow-lg hover:-translate-y-0.5 hover:border-primary/30 transition-all duration-300">
            <h2 class="font-bold text-foreground group-hover:text-primary transition-colors">{{ item.term }}</h2>
            <p class="text-sm text-muted-foreground mt-1 line-clamp-2">{{ item.description }}</p>
          </a>
        }
      </div>
    </div>
    }
  `,
})
export class GlossaryComponent {
  entry = signal<GlossaryEntry | undefined>(undefined);
  isHub = signal(false);
  allEntries = GLOSSARY;
  private seo = inject(SeoService);
  private sanitizer = inject(DomSanitizer);

  safeContent = computed<SafeHtml>(() => {
    const e = this.entry();
    if (!e?.content) return '';
    return this.sanitizer.bypassSecurityTrustHtml(e.content);
  });

  constructor() {
    const route = inject(ActivatedRoute);
    const router = inject(Router);
    const slug = route.snapshot.paramMap.get('term');

    if (!slug) {
      this.isHub.set(true);
      this.seo.update({
        title: 'Cloud Native Security Glossary — CodersSecret',
        description: 'Definitions for SPIFFE, SPIRE, Zero Trust, workload identity, mTLS, OPA, Falco, service mesh, Sigstore, and more cloud-native security terms.',
        url: '/glossary',
      });
      return;
    }

    const entry = GLOSSARY.find(g => g.slug === slug);
    if (entry) {
      this.entry.set(entry);
      this.seo.update({
        title: entry.title + ' — CodersSecret',
        description: entry.description,
        url: '/glossary/' + entry.slug,
        jsonLd: [{
          '@context': 'https://schema.org',
          '@type': 'DefinedTerm',
          'name': entry.term,
          'description': entry.description,
          'url': 'https://coderssecret.com/glossary/' + entry.slug,
          'inDefinedTermSet': 'https://coderssecret.com/glossary',
        }],
      });
    } else {
      router.navigate(['/glossary']);
    }
  }

  getTermName(slug: string): string {
    return GLOSSARY.find(g => g.slug === slug)?.term || slug;
  }
}
