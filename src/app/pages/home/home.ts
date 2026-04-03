import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BLOG_POSTS, CATEGORIES, BlogPost } from '../../models/blog-post.model';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  template: `
    <!-- Hero -->
    <section class="py-16 md:py-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div class="container max-w-5xl mx-auto px-6">
        <div class="max-w-2xl">
          <h1 class="text-4xl md:text-5xl font-bold tracking-tight leading-[1.1]">
            Welcome to <span class="text-primary">Coders</span>Secret
          </h1>
          <p class="mt-4 text-lg text-muted-foreground leading-relaxed">
            Exploring modern web development with Angular, Tailwind CSS, and the tools that make building for the web a joy.
          </p>
          <div class="mt-8 flex flex-wrap gap-3">
            <a routerLink="/blog"
               class="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-sm transition-all duration-200 hover:bg-primary/90 hover:shadow-md active:scale-[0.98]">
              Read the Blog
            </a>
            <a routerLink="/category/tutorials"
               class="inline-flex items-center justify-center rounded-md border border-border bg-background px-6 py-3 text-sm font-medium text-foreground shadow-sm transition-all duration-200 hover:bg-accent hover:shadow-md active:scale-[0.98]">
              Browse Tutorials
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Post -->
    @if (featuredPost) {
      <section class="py-12 border-t border-border animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
        <div class="container max-w-5xl mx-auto px-6">
          <div class="flex items-center gap-2 mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                 class="text-yellow-500">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
            <h2 class="text-lg font-semibold tracking-tight">Featured Post</h2>
          </div>

          <a [routerLink]="['/blog', featuredPost.slug]" class="group block">
            <div class="rounded-xl border border-border bg-gradient-to-br from-card to-accent/20 p-8 md:p-10 transition-all duration-300 hover:shadow-lg hover:border-primary/20 hover:-translate-y-0.5">
              <div class="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mb-4">
                <span class="inline-flex items-center rounded-full bg-primary/10 text-primary px-2.5 py-0.5 text-xs font-semibold">
                  Featured
                </span>
                <time>{{ featuredPost.date }}</time>
                <span>&middot;</span>
                <span>{{ featuredPost.readTime }}</span>
              </div>
              <h3 class="text-2xl md:text-3xl font-bold tracking-tight transition-colors duration-200 group-hover:text-primary">
                {{ featuredPost.title }}
              </h3>
              <p class="mt-3 text-muted-foreground text-base leading-relaxed max-w-2xl">{{ featuredPost.excerpt }}</p>
              <div class="mt-5 flex flex-wrap gap-2">
                @for (tag of featuredPost.tags; track tag) {
                  <span class="inline-flex items-center rounded-md bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
                    {{ tag }}
                  </span>
                }
              </div>
              <div class="mt-6 inline-flex items-center gap-1 text-sm font-medium text-primary transition-all duration-200 group-hover:gap-2">
                Read more
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                </svg>
              </div>
            </div>
          </a>
        </div>
      </section>
    }

    <!-- Categories -->
    <section class="py-12 border-t border-border animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
      <div class="container max-w-5xl mx-auto px-6">
        <h2 class="text-2xl font-bold tracking-tight mb-6">Browse by Category</h2>
        <div class="grid grid-cols-2 md:grid-cols-5 gap-3">
          @for (cat of categories; track cat.slug) {
            <a [routerLink]="['/category', cat.slug]"
               class="group flex flex-col items-center gap-2 rounded-lg border border-border bg-card p-4 text-center transition-all duration-200 hover:shadow-md hover:border-primary/20 hover:-translate-y-0.5 active:scale-[0.98]">
              <span class="h-3 w-3 rounded-full transition-transform duration-200 group-hover:scale-125"
                    [style.background-color]="getCategoryColor(cat.slug)"></span>
              <span class="text-sm font-medium text-foreground">{{ cat.name }}</span>
            </a>
          }
        </div>
      </div>
    </section>

    <!-- Latest Posts -->
    <section class="py-12 border-t border-border animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
      <div class="container max-w-5xl mx-auto px-6">
        <div class="flex items-center justify-between mb-8">
          <h2 class="text-2xl font-bold tracking-tight">Latest Posts</h2>
          <a routerLink="/blog"
             class="inline-flex items-center gap-1 text-sm font-medium text-primary transition-all duration-200 hover:gap-2">
            View all
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
            </svg>
          </a>
        </div>
        <div class="grid gap-5">
          @for (post of latestPosts; track post.id) {
            <article class="group">
              <a [routerLink]="['/blog', post.slug]" class="block">
                <div class="rounded-lg border border-border bg-card p-6 transition-all duration-300 hover:shadow-md hover:border-primary/20 hover:-translate-y-0.5">
                  <div class="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mb-3">
                    <time>{{ post.date }}</time>
                    <span>&middot;</span>
                    <span>{{ post.readTime }}</span>
                  </div>
                  <h3 class="text-xl font-semibold tracking-tight transition-colors duration-200 group-hover:text-primary">
                    {{ post.title }}
                  </h3>
                  <p class="mt-2 text-muted-foreground line-clamp-2">{{ post.excerpt }}</p>
                  <div class="mt-4 flex flex-wrap gap-2">
                    @for (tag of post.tags; track tag) {
                      <span class="inline-flex items-center rounded-md bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
                        {{ tag }}
                      </span>
                    }
                  </div>
                </div>
              </a>
            </article>
          }
        </div>
      </div>
    </section>
  `,
})
export class HomeComponent {
  featuredPost: BlogPost | undefined = BLOG_POSTS.find(p => p.featured);
  latestPosts = BLOG_POSTS.filter(p => p !== this.featuredPost).slice(0, 4);
  categories = CATEGORIES.filter(c => c.slug !== '');

  getCategoryColor(slug: string): string {
    const colors: Record<string, string> = {
      frontend: '#3b82f6',
      backend: '#22c55e',
      devops: '#f97316',
      tutorials: '#a855f7',
      'open-source': '#ec4899',
    };
    return colors[slug] ?? '#6b7280';
  }
}
