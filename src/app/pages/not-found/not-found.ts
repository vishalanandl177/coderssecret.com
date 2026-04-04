import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  template: `
    <div class="py-32 text-center animate-in fade-in duration-500">
      <div class="container max-w-4xl mx-auto px-6">
        <div class="inline-flex items-center justify-center h-24 w-24 rounded-3xl bg-muted/50 mb-8">
          <span class="text-5xl font-extrabold text-muted-foreground">404</span>
        </div>
        <h1 class="text-3xl font-extrabold mb-3">Page not found</h1>
        <p class="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div class="flex flex-wrap justify-center gap-4">
          <a routerLink="/"
             class="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.97]">
            Go Home
          </a>
          <a routerLink="/blog"
             class="inline-flex items-center justify-center gap-2 rounded-full border border-border/60 bg-card/60 px-8 py-3.5 text-sm font-semibold text-foreground transition-all duration-300 hover:bg-accent hover:shadow-md hover:-translate-y-0.5 active:scale-[0.97]">
            Browse Blog
          </a>
        </div>
      </div>
    </div>
  `,
})
export class NotFoundComponent {
  private seo = inject(SeoService);

  constructor() {
    this.seo.update({
      title: 'Page Not Found',
      description: 'The page you are looking for does not exist.',
    });
  }
}
