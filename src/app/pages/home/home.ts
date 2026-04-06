import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BLOG_POSTS, CATEGORIES, BlogPost } from '../../models/blog-post.model';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  template: `
    <!-- Hero with animated gradient -->
    <section class="relative overflow-hidden">
      <!-- Animated gradient blobs -->
      <div class="absolute inset-0 -z-10">
        <div class="absolute top-[-20%] left-[-10%] h-[500px] w-[500px] rounded-full bg-purple-500/15 blur-[100px] animate-blob"></div>
        <div class="absolute top-[-10%] right-[-10%] h-[400px] w-[400px] rounded-full bg-blue-500/15 blur-[100px] animate-blob animation-delay-2000"></div>
        <div class="absolute bottom-[-20%] left-[30%] h-[450px] w-[450px] rounded-full bg-pink-500/10 blur-[100px] animate-blob animation-delay-4000"></div>
      </div>

      <div class="container max-w-6xl mx-auto px-6 pt-20 pb-24 md:pt-32 md:pb-32">
        <div class="flex flex-col items-center text-center">
          <!-- Badge -->
          <div class="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 backdrop-blur-sm px-4 py-1.5 text-xs font-medium text-muted-foreground mb-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            New posts every week
          </div>

          <!-- Heading -->
          <h1 class="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.05] animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
            Where <span class="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 bg-clip-text text-transparent">Code</span>
            Meets
            <br class="hidden sm:block" />
            <span class="bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 bg-clip-text text-transparent">Creativity</span>
          </h1>

          <p class="mt-6 text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            Battle-tested guides on Python, DevOps, APIs, and system design — written by engineers, for engineers who ship.
          </p>

          <!-- CTA buttons -->
          <div class="mt-10 flex flex-wrap justify-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
            <a routerLink="/blog"
               class="group relative inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 active:scale-[0.97]">
              Start Reading
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                   class="transition-transform duration-300 group-hover:translate-x-1">
                <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
              </svg>
            </a>
            <a routerLink="/category/tutorials"
               class="inline-flex items-center justify-center rounded-full border border-border/60 bg-card/60 backdrop-blur-sm px-8 py-3.5 text-sm font-semibold text-foreground transition-all duration-300 hover:bg-accent hover:shadow-md hover:-translate-y-0.5 active:scale-[0.97]">
              Browse Tutorials
            </a>
          </div>

          <!-- Stats -->
          <div class="mt-16 grid grid-cols-3 gap-8 md:gap-16 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
            <div class="text-center">
              <div class="text-3xl md:text-4xl font-extrabold tracking-tight">{{ totalPosts }}</div>
              <div class="mt-1 text-xs md:text-sm text-muted-foreground">Articles</div>
            </div>
            <div class="text-center">
              <div class="text-3xl md:text-4xl font-extrabold tracking-tight">{{ categories.length }}</div>
              <div class="mt-1 text-xs md:text-sm text-muted-foreground">Categories</div>
            </div>
            <div class="text-center">
              <div class="text-3xl md:text-4xl font-extrabold tracking-tight">{{ uniqueTags }}</div>
              <div class="mt-1 text-xs md:text-sm text-muted-foreground">Topics</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Post — Full-width spotlight -->
    @if (featuredPost) {
      <section class="py-16 md:py-20 animate-in fade-in duration-700">
        <div class="container max-w-6xl mx-auto px-6">
          <a [routerLink]="['/blog', featuredPost.slug]" class="group block relative">
            <div class="relative rounded-2xl overflow-hidden border border-border bg-gradient-to-br from-violet-500/10 via-card to-blue-500/10 p-[1px]">
              <div class="rounded-[calc(1rem-1px)] bg-card/95 backdrop-blur-xl p-8 md:p-12 lg:p-16">
                <!-- Decorative corner elements -->
                <div class="absolute top-4 right-4 md:top-8 md:right-8 flex items-center gap-2">
                  <span class="inline-flex items-center gap-1.5 rounded-full bg-yellow-500/10 text-yellow-600 px-3 py-1 text-xs font-bold uppercase tracking-wider">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                    Featured
                  </span>
                </div>

                <div class="max-w-3xl">
                  <div class="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-6">
                    <time class="font-mono text-xs" [attr.datetime]="featuredPost.date">{{ featuredPost.date }}</time>
                    <span class="h-1 w-1 rounded-full bg-muted-foreground/50"></span>
                    <span>{{ featuredPost.readTime }}</span>
                  </div>

                  <h2 class="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.1] transition-colors duration-300 group-hover:text-primary">
                    {{ featuredPost.title }}
                  </h2>

                  <p class="mt-5 text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl">
                    {{ featuredPost.excerpt }}
                  </p>

                  <div class="mt-6 flex flex-wrap gap-2">
                    @for (tag of featuredPost.tags; track tag) {
                      <span class="inline-flex items-center rounded-full border border-border/60 bg-secondary/50 px-3 py-1 text-xs font-medium text-secondary-foreground">
                        {{ tag }}
                      </span>
                    }
                  </div>

                  <div class="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                    <span class="transition-all duration-300 group-hover:mr-1">Read the full article</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"
                         class="transition-transform duration-300 group-hover:translate-x-2">
                      <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </a>
        </div>
      </section>
    }

    <!-- Bento Grid — Categories + Quick Stats -->
    <section class="py-16 animate-in fade-in duration-700">
      <div class="container max-w-6xl mx-auto px-6">
        <div class="flex items-end justify-between mb-10">
          <div>
            <h2 class="text-3xl font-extrabold tracking-tight">Explore Topics</h2>
            <p class="mt-2 text-muted-foreground">Find what interests you</p>
          </div>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          @for (cat of categories; track cat.slug; let i = $index) {
            <a [routerLink]="['/category', cat.slug]"
               class="group relative overflow-hidden rounded-2xl border border-border/60 p-6 md:p-8 transition-all duration-500 hover:shadow-xl hover:-translate-y-1 hover:border-transparent active:scale-[0.98]"
               [class]="i === 0 ? 'col-span-2 row-span-2 md:col-span-2 md:row-span-2' : ''"
               [style.background]="getCategoryGradient(cat.slug)">

              <!-- Glow effect on hover -->
              <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                   [style.background]="'radial-gradient(circle at 50% 50%, ' + getCategoryColor(cat.slug) + '15, transparent 70%)'">
              </div>

              <div class="relative z-10">
                <div class="inline-flex items-center justify-center rounded-xl p-2.5 mb-4 transition-transform duration-300 group-hover:scale-110"
                     [style.background-color]="getCategoryColor(cat.slug) + '20'">
                  <span class="text-xl md:text-2xl" [class]="i === 0 ? 'md:text-3xl' : ''">{{ getCategoryIcon(cat.slug) }}</span>
                </div>
                <h3 class="font-bold tracking-tight transition-colors duration-300 group-hover:text-foreground"
                    [class]="i === 0 ? 'text-xl md:text-2xl' : 'text-sm md:text-base'">
                  {{ cat.name }}
                </h3>
                <p class="mt-1 text-xs text-muted-foreground" [class]="i === 0 ? 'md:text-sm md:mt-2' : ''">
                  {{ getCategoryCount(cat.slug) }} post{{ getCategoryCount(cat.slug) !== 1 ? 's' : '' }}
                </p>
              </div>

              <!-- Arrow -->
              <div class="absolute bottom-4 right-4 md:bottom-6 md:right-6 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-muted-foreground">
                  <path d="M7 17 17 7"/><path d="M7 7h10v10"/>
                </svg>
              </div>
            </a>
          }
        </div>
      </div>
    </section>

    <!-- Most Popular — Ranked by traffic -->
    @if (popularPosts.length > 0) {
      <section class="py-16 animate-in fade-in duration-700">
        <div class="container max-w-6xl mx-auto px-6">
          <div class="flex items-end justify-between mb-10">
            <div>
              <h2 class="text-3xl font-extrabold tracking-tight">Most Popular</h2>
              <p class="mt-2 text-muted-foreground">Top reads from our community</p>
            </div>
          </div>

          <div class="grid md:grid-cols-3 gap-4">
            @for (post of popularPosts; track post.id; let i = $index) {
              <article class="group">
                <a [routerLink]="['/blog', post.slug]" class="block h-full">
                  <div class="relative h-full rounded-2xl border border-border/60 bg-card overflow-hidden transition-all duration-500 hover:shadow-xl hover:-translate-y-1 hover:border-primary/20">
                    <!-- Rank badge -->
                    <div class="absolute top-3 left-3 z-10 inline-flex items-center justify-center h-8 w-8 rounded-full font-extrabold text-sm"
                         [class]="i === 0 ? 'bg-yellow-500 text-yellow-950' : i === 1 ? 'bg-gray-300 text-gray-700' : i === 2 ? 'bg-orange-400 text-orange-950' : 'bg-muted text-muted-foreground'">
                      #{{ i + 1 }}
                    </div>
                    <!-- Top accent bar -->
                    <div class="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                         [style.background-image]="'linear-gradient(to right, transparent, ' + getCategoryColor(post.category) + ', transparent)'"></div>

                    <div class="p-6 pt-14 flex flex-col justify-between h-full">
                      <div>
                        <div class="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mb-3">
                          <span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                                [style.background-color]="getCategoryColor(post.category) + '15'"
                                [style.color]="getCategoryColor(post.category)">
                            {{ post.category }}
                          </span>
                          <span>{{ post.readTime }}</span>
                        </div>
                        <h3 class="font-bold text-lg tracking-tight leading-snug transition-colors duration-300 group-hover:text-primary line-clamp-2">
                          {{ post.title }}
                        </h3>
                        <p class="mt-2 text-sm text-muted-foreground line-clamp-2">{{ post.excerpt }}</p>
                      </div>
                      <div class="mt-4 flex items-center justify-between">
                        <div class="flex flex-wrap gap-1.5">
                          @for (tag of post.tags.slice(0, 2); track tag) {
                            <span class="inline-flex items-center rounded-full border border-border/40 bg-muted/50 px-2.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                              {{ tag }}
                            </span>
                          }
                        </div>
                        <div class="shrink-0 ml-4 inline-flex items-center justify-center rounded-full h-8 w-8 bg-muted/50 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                               stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M7 17 17 7"/><path d="M7 7h10v10"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </a>
              </article>
            }
          </div>
        </div>
      </section>
    }

    <!-- Latest Posts — Modern card grid -->
    <section class="py-16 animate-in fade-in duration-700">
      <div class="container max-w-6xl mx-auto px-6">
        <div class="flex items-end justify-between mb-10">
          <div>
            <h2 class="text-3xl font-extrabold tracking-tight">Latest Articles</h2>
            <p class="mt-2 text-muted-foreground">Fresh insights and tutorials</p>
          </div>
          <a routerLink="/blog"
             class="group hidden sm:inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card/60 px-5 py-2 text-sm font-medium text-muted-foreground transition-all duration-300 hover:text-foreground hover:bg-accent hover:shadow-sm">
            View all
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                 class="transition-transform duration-300 group-hover:translate-x-1">
              <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
            </svg>
          </a>
        </div>

        <div class="grid md:grid-cols-2 gap-5">
          @for (post of latestPosts; track post.id; let i = $index) {
            <article class="group" [class]="i === 0 ? 'md:col-span-2' : ''">
              <a [routerLink]="['/blog', post.slug]" class="block h-full">
                <div class="relative h-full rounded-2xl border border-border/60 bg-card overflow-hidden transition-all duration-500 hover:shadow-xl hover:-translate-y-1 hover:border-primary/20"
                     [class]="i === 0 ? 'md:flex md:items-stretch' : ''">
                  <!-- Color accent bar -->
                  <div class="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  <div class="p-6 md:p-8 flex flex-col justify-between" [class]="i === 0 ? 'md:flex-1' : ''">
                    <div>
                      <div class="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mb-4">
                        <span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                              [style.background-color]="getCategoryColor(post.category) + '15'"
                              [style.color]="getCategoryColor(post.category)">
                          {{ post.category }}
                        </span>
                        <time class="font-mono" [attr.datetime]="post.date">{{ post.date }}</time>
                        <span class="h-1 w-1 rounded-full bg-muted-foreground/50"></span>
                        <span>{{ post.readTime }}</span>
                      </div>

                      <h3 class="font-bold tracking-tight leading-snug transition-colors duration-300 group-hover:text-primary"
                          [class]="i === 0 ? 'text-2xl md:text-3xl' : 'text-xl'">
                        {{ post.title }}
                      </h3>

                      <p class="mt-3 text-muted-foreground leading-relaxed"
                         [class]="i === 0 ? 'text-base line-clamp-3' : 'text-sm line-clamp-2'">
                        {{ post.excerpt }}
                      </p>
                    </div>

                    <div class="mt-5 flex items-center justify-between">
                      <div class="flex flex-wrap gap-1.5">
                        @for (tag of post.tags.slice(0, i === 0 ? 4 : 2); track tag) {
                          <span class="inline-flex items-center rounded-full border border-border/40 bg-muted/50 px-2.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                            {{ tag }}
                          </span>
                        }
                      </div>
                      <div class="shrink-0 ml-4 inline-flex items-center justify-center rounded-full h-8 w-8 bg-muted/50 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                             stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M7 17 17 7"/><path d="M7 7h10v10"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </a>
            </article>
          }
        </div>

        <!-- Mobile view all link -->
        <div class="mt-8 text-center sm:hidden">
          <a routerLink="/blog"
             class="inline-flex items-center gap-1.5 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-xl active:scale-[0.97]">
            View all articles
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
            </svg>
          </a>
        </div>
      </div>
    </section>

  `,
})
export class HomeComponent {
  private seo = inject(SeoService);
  featuredPost: BlogPost | undefined = BLOG_POSTS.find(p => p.featured);
  popularPosts = BLOG_POSTS.filter(p => p.popularRank != null).sort((a, b) => (a.popularRank ?? 99) - (b.popularRank ?? 99)).slice(0, 6);
  latestPosts = BLOG_POSTS.filter(p => p !== this.featuredPost).slice(0, 4);
  categories = CATEGORIES.filter(c => c.slug !== '');
  totalPosts = BLOG_POSTS.length;
  uniqueTags = new Set(BLOG_POSTS.flatMap(p => p.tags)).size;

  constructor() {
    this.seo.update({
      title: 'CodersSecret',
      description: 'Battle-tested guides on Python, DevOps, APIs, and system design — written by engineers, for engineers who ship.',
      url: '/',
    });
  }

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

  getCategoryGradient(slug: string): string {
    const gradients: Record<string, string> = {
      frontend: 'linear-gradient(135deg, rgba(59,130,246,0.08), rgba(59,130,246,0.02))',
      backend: 'linear-gradient(135deg, rgba(34,197,94,0.08), rgba(34,197,94,0.02))',
      devops: 'linear-gradient(135deg, rgba(249,115,22,0.08), rgba(249,115,22,0.02))',
      tutorials: 'linear-gradient(135deg, rgba(168,85,247,0.08), rgba(168,85,247,0.02))',
      'open-source': 'linear-gradient(135deg, rgba(236,72,153,0.08), rgba(236,72,153,0.02))',
    };
    return gradients[slug] ?? '';
  }

  getCategoryIcon(slug: string): string {
    const icons: Record<string, string> = {
      frontend: '\u{1F3A8}',
      backend: '\u{2699}\u{FE0F}',
      devops: '\u{1F680}',
      tutorials: '\u{1F4DA}',
      'open-source': '\u{1F4E6}',
    };
    return icons[slug] ?? '\u{1F4C1}';
  }

  getCategoryCount(slug: string): number {
    return BLOG_POSTS.filter(p => p.category === slug).length;
  }
}
