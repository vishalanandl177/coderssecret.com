import { Component, signal, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BLOG_POSTS, CATEGORIES } from '../../models/blog-post.model';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-blog-list',
  imports: [RouterLink],
  template: `
    <!-- Hero header with gradient blobs -->
    <section class="relative overflow-hidden">
      <div class="absolute inset-0 -z-10">
        <div class="absolute top-[-30%] right-[-15%] h-[400px] w-[400px] rounded-full bg-blue-500/10 blur-[100px] animate-blob"></div>
        <div class="absolute bottom-[-20%] left-[-10%] h-[350px] w-[350px] rounded-full bg-purple-500/10 blur-[100px] animate-blob animation-delay-2000"></div>
      </div>

      <div class="container max-w-6xl mx-auto px-6 pt-16 pb-12 md:pt-24 md:pb-16">
        <div class="max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div class="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 backdrop-blur-sm px-4 py-1.5 text-xs font-medium text-muted-foreground mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/>
            </svg>
            {{ totalPosts }} articles published
          </div>
          <h1 class="text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.1]">
            All <span class="bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 bg-clip-text text-transparent">Articles</span>
          </h1>
          <p class="mt-4 text-lg text-muted-foreground leading-relaxed">
            Thoughts on Angular, Python, DevOps, and modern tooling — written by developers, for developers.
          </p>
        </div>
      </div>
    </section>

    <!-- Filters + Posts -->
    <section class="pb-20">
      <div class="container max-w-6xl mx-auto px-6">
        <!-- Active tag filter -->
        @if (activeTag()) {
          <div class="flex items-center gap-2 mb-6 animate-in fade-in duration-300">
            <span class="text-sm text-muted-foreground">Filtered by tag:</span>
            <span class="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-1.5 text-sm font-semibold text-primary-foreground">
              {{ activeTag() }}
              <button (click)="clearTag()" class="ml-1 hover:opacity-70" aria-label="Clear tag filter">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </span>
            <span class="text-xs text-muted-foreground">({{ allFilteredPosts().length }} articles)</span>
          </div>
        }

        <!-- Category filter pills -->
        <div class="flex flex-wrap gap-2 mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
          @for (cat of categories; track cat.slug) {
            <button (click)="activeCategory.set(cat.slug); currentPage.set(1)"
                    class="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 active:scale-[0.96]"
                    [class]="activeCategory() === cat.slug ?
                      'bg-primary text-primary-foreground shadow-lg shadow-primary/25' :
                      'border border-border/60 bg-card/60 backdrop-blur-sm text-muted-foreground hover:text-foreground hover:bg-accent hover:border-accent'">
              @if (cat.slug && activeCategory() === cat.slug) {
                <span class="h-1.5 w-1.5 rounded-full bg-primary-foreground"></span>
              }
              {{ cat.name }}
              <span class="text-xs opacity-60">({{ getCount(cat.slug) }})</span>
            </button>
          }
        </div>

        <!-- Post grid -->
        <div class="grid md:grid-cols-2 gap-5 animate-in fade-in duration-500 delay-300">
          @for (post of filteredPosts(); track post.id; let i = $index) {
            <article class="group" [class]="i === 0 && !activeCategory() ? 'md:col-span-2' : ''">
              <a [routerLink]="['/blog', post.slug]" class="block h-full">
                <div class="relative h-full rounded-2xl border border-border/60 bg-card overflow-hidden transition-all duration-500 hover:shadow-xl hover:-translate-y-1 hover:border-primary/20"
                     [class]="i === 0 && !activeCategory() ? 'md:flex md:items-stretch' : ''">
                  <!-- Top accent bar -->
                  <div class="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                       [style.background-image]="'linear-gradient(to right, transparent, ' + getCategoryColor(post.category) + ', transparent)'"></div>

                  <div class="p-6 md:p-8 flex flex-col justify-between" [class]="i === 0 && !activeCategory() ? 'md:flex-1' : ''">
                    <div>
                      <!-- Meta row -->
                      <div class="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mb-4">
                        <span class="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                              [style.background-color]="getCategoryColor(post.category) + '15'"
                              [style.color]="getCategoryColor(post.category)">
                          {{ getCategoryName(post.category) }}
                        </span>
                        <time class="font-mono" [attr.datetime]="post.date">{{ post.date }}</time>
                        <span class="h-1 w-1 rounded-full bg-muted-foreground/50"></span>
                        <span>{{ post.readTime }}</span>
                        @if (post.featured) {
                          <span class="inline-flex items-center gap-1 rounded-full bg-yellow-500/10 text-yellow-600 px-2 py-0.5 text-[10px] font-bold">
                            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                            </svg>
                            Featured
                          </span>
                        }
                      </div>

                      <!-- Title -->
                      <h2 class="font-bold tracking-tight leading-snug transition-colors duration-300 group-hover:text-primary"
                          [class]="i === 0 && !activeCategory() ? 'text-2xl md:text-3xl' : 'text-xl'">
                        {{ post.title }}
                      </h2>

                      <!-- Excerpt -->
                      <p class="mt-3 text-muted-foreground leading-relaxed"
                         [class]="i === 0 && !activeCategory() ? 'text-base line-clamp-3' : 'text-sm line-clamp-2'">
                        {{ post.excerpt }}
                      </p>
                    </div>

                    <!-- Footer -->
                    <div class="mt-5 flex items-center justify-between">
                      <div class="flex flex-wrap gap-1.5">
                        @for (tag of post.tags.slice(0, i === 0 && !activeCategory() ? 4 : 2); track tag) {
                          <span class="inline-flex items-center rounded-full border border-border/40 bg-muted/50 px-2.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                            {{ tag }}
                          </span>
                        }
                        @if (post.tags.length > (i === 0 && !activeCategory() ? 4 : 2)) {
                          <span class="inline-flex items-center rounded-full bg-muted/50 px-2 py-0.5 text-[10px] text-muted-foreground">
                            +{{ post.tags.length - (i === 0 && !activeCategory() ? 4 : 2) }}
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

          @if (filteredPosts().length === 0) {
            <div class="md:col-span-2 text-center py-20 animate-in fade-in duration-300">
              <div class="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-muted/50 mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-muted-foreground">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
                </svg>
              </div>
              <p class="text-muted-foreground text-lg font-medium">No posts found in this category.</p>
              <button (click)="activeCategory.set(''); currentPage.set(1)"
                      class="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline underline-offset-4">
                View all posts
              </button>
            </div>
          }
        </div>

        <!-- Load more -->
        @if (hasMore()) {
          <div class="mt-10 text-center">
            <button (click)="loadMore()"
                    class="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 backdrop-blur-sm px-8 py-3.5 text-sm font-semibold text-foreground transition-all duration-300 hover:bg-accent hover:shadow-md hover:-translate-y-0.5 active:scale-[0.97]">
              Load more articles
              <span class="text-xs text-muted-foreground">({{ allFilteredPosts().length - filteredPosts().length }} remaining)</span>
            </button>
          </div>
        }
      </div>
    </section>
  `,
})
export class BlogListComponent {
  private seo = inject(SeoService);
  private route = inject(ActivatedRoute);
  categories = CATEGORIES;
  activeCategory = signal('');
  activeTag = signal('');
  currentPage = signal(1);
  postsPerPage = 10;
  totalPosts = BLOG_POSTS.length;

  constructor() {
    // Read tag from query parameter: /blog?tag=Python
    const tag = this.route.snapshot.queryParamMap.get('tag');
    if (tag) {
      this.activeTag.set(tag);
    }
    this.seo.update({
      title: tag ? `Articles tagged "${tag}"` : 'All Articles — Developer Tutorials & Guides',
      description: tag
        ? `Browse all articles tagged with ${tag} on CodersSecret — practical tutorials, deep dives, and real-world examples.`
        : 'In-depth tutorials on Python, Kubernetes, API security, gRPC, encryption, ethical hacking, and modern web development. Written by engineers, for engineers.',
      url: '/blog',
      itemList: BLOG_POSTS.slice(0, 20).map(p => ({
        name: p.title,
        url: `/blog/${p.slug}`,
        description: p.excerpt,
      })),
    });
  }

  clearTag() {
    this.activeTag.set('');
  }

  allFilteredPosts = computed(() => {
    let posts = BLOG_POSTS;
    const cat = this.activeCategory();
    const tag = this.activeTag();
    if (cat) {
      posts = posts.filter(post => post.category === cat);
    }
    if (tag) {
      posts = posts.filter(post => post.tags.some(t => t.toLowerCase() === tag.toLowerCase()));
    }
    return posts;
  });

  filteredPosts = computed(() => {
    const all = this.allFilteredPosts();
    const page = this.currentPage();
    return all.slice(0, page * this.postsPerPage);
  });

  hasMore = computed(() => {
    return this.filteredPosts().length < this.allFilteredPosts().length;
  });

  loadMore() {
    this.currentPage.set(this.currentPage() + 1);
  }

  getCount(slug: string): number {
    if (!slug) return BLOG_POSTS.length;
    return BLOG_POSTS.filter(p => p.category === slug).length;
  }

  getCategoryColor(slug: string): string {
    const colors: Record<string, string> = {
      frontend: '#3b82f6', backend: '#22c55e', devops: '#f97316',
      tutorials: '#a855f7', 'open-source': '#ec4899',
    };
    return colors[slug] ?? '#6b7280';
  }

  getCategoryName(slug: string): string {
    const cat = CATEGORIES.find(c => c.slug === slug);
    return cat?.name ?? slug;
  }
}
