import { Component, inject, DestroyRef } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BLOG_POSTS, CATEGORIES, BlogPost } from '../../models/blog-post.model';

@Component({
  selector: 'app-blog-post',
  imports: [RouterLink],
  template: `
    @if (post) {
      <!-- Hero header -->
      <section class="relative overflow-hidden">
        <div class="absolute inset-0 -z-10">
          <div class="absolute top-[-30%] left-[20%] h-[400px] w-[400px] rounded-full blur-[120px] animate-blob"
               [style.background-color]="categoryColor + '12'"></div>
          <div class="absolute bottom-[-30%] right-[10%] h-[350px] w-[350px] rounded-full bg-purple-500/8 blur-[100px] animate-blob animation-delay-2000"></div>
        </div>

        <div class="container max-w-4xl mx-auto px-6 pt-12 pb-10 md:pt-16 md:pb-14">
          <!-- Back button -->
          <a routerLink="/blog"
             class="group inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 backdrop-blur-sm px-4 py-2 text-sm text-muted-foreground transition-all duration-300 hover:text-foreground hover:bg-accent hover:border-accent mb-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                 class="transition-transform duration-300 group-hover:-translate-x-1">
              <path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>
            </svg>
            Back to Blog
          </a>

          <header class="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
            <!-- Meta row -->
            <div class="flex flex-wrap items-center gap-3 mb-6">
              @if (categoryName) {
                <a [routerLink]="['/category', post.category]"
                   class="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider transition-all duration-300 hover:shadow-md"
                   [style.background-color]="categoryColor + '15'"
                   [style.color]="categoryColor">
                  {{ categoryName }}
                </a>
              }
              <div class="flex items-center gap-2 text-sm text-muted-foreground">
                <time class="font-mono text-xs">{{ post.date }}</time>
                <span class="h-1 w-1 rounded-full bg-muted-foreground/50"></span>
                <span>{{ post.readTime }}</span>
              </div>
            </div>

            <!-- Title -->
            <h1 class="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.1]">
              {{ post.title }}
            </h1>

            <!-- Author + tags -->
            <div class="mt-6 flex flex-col sm:flex-row sm:items-center gap-4">
              <div class="flex items-center gap-3">
                <div class="flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 text-white text-sm font-bold">
                  {{ post.author.charAt(0) }}
                </div>
                <div>
                  <div class="text-sm font-semibold">{{ post.author }}</div>
                  <div class="text-xs text-muted-foreground">Author</div>
                </div>
              </div>

              <div class="sm:ml-auto flex flex-wrap gap-1.5">
                @for (tag of post.tags; track tag) {
                  <span class="inline-flex items-center rounded-full border border-border/40 bg-muted/50 px-3 py-1 text-[11px] font-medium text-muted-foreground">
                    {{ tag }}
                  </span>
                }
              </div>
            </div>
          </header>
        </div>
      </section>

      <!-- Divider -->
      <div class="container max-w-4xl mx-auto px-6">
        <div class="h-[1px] bg-gradient-to-r from-transparent via-border to-transparent"></div>
      </div>

      <!-- Article content -->
      <article class="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
        <div class="container max-w-3xl mx-auto px-6 py-12 md:py-16">
          <div class="prose prose-neutral max-w-none
                      [&>p]:text-foreground [&>p]:leading-[1.8] [&>p]:mb-6 [&>p]:text-[15px]
                      [&>h2]:text-2xl [&>h2]:font-extrabold [&>h2]:tracking-tight [&>h2]:mt-14 [&>h2]:mb-5 [&>h2]:text-foreground
                      [&>ul]:text-foreground [&>ul]:mb-6 [&>ul]:ml-6 [&>ul]:list-disc [&>ul>li]:mb-2.5 [&>ul>li]:leading-[1.7] [&>ul>li]:text-[15px]
                      [&>ol]:text-foreground [&>ol]:mb-6 [&>ol]:ml-6 [&>ol]:list-decimal [&>ol>li]:mb-2.5
                      [&>pre]:bg-muted [&>pre]:rounded-xl [&>pre]:p-5 [&>pre]:mb-6 [&>pre]:overflow-x-auto [&>pre]:text-sm [&>pre]:border [&>pre]:border-border/40
                      [&>code]:bg-muted [&>code]:px-1.5 [&>code]:py-0.5 [&>code]:rounded-md [&>code]:text-sm [&>code]:font-mono
                      [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded-md [&_code]:text-sm [&_code]:font-mono
                      [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4 [&_a:hover]:text-primary/80
                      [&>pre_code]:bg-transparent [&>pre_code]:p-0
                      [&>img]:rounded-xl [&>img]:border [&>img]:border-border/40 [&>img]:my-8 [&>img]:w-full [&>img]:shadow-md"
               [innerHTML]="post.content">
          </div>
        </div>
      </article>

      <!-- Share + related -->
      <div class="container max-w-4xl mx-auto px-6 pb-20">
        <div class="h-[1px] bg-gradient-to-r from-transparent via-border to-transparent mb-12"></div>

        <!-- Related posts -->
        @if (relatedPosts.length > 0) {
          <div class="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h2 class="text-2xl font-extrabold tracking-tight mb-8">Continue Reading</h2>
            <div class="grid gap-5 md:grid-cols-2">
              @for (related of relatedPosts; track related.id) {
                <a [routerLink]="['/blog', related.slug]"
                   class="group relative rounded-2xl border border-border/60 bg-card overflow-hidden transition-all duration-500 hover:shadow-xl hover:-translate-y-1 hover:border-primary/20">
                  <!-- Top accent -->
                  <div class="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                       [style.background-image]="'linear-gradient(to right, transparent, ' + getCategoryColor(related.category) + ', transparent)'"></div>

                  <div class="p-6 md:p-8">
                    <div class="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                      <span class="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                            [style.background-color]="getCategoryColor(related.category) + '15'"
                            [style.color]="getCategoryColor(related.category)">
                        {{ getCategoryName(related.category) }}
                      </span>
                      <time class="font-mono">{{ related.date }}</time>
                      <span class="h-1 w-1 rounded-full bg-muted-foreground/50"></span>
                      <span>{{ related.readTime }}</span>
                    </div>
                    <h3 class="text-lg font-bold tracking-tight leading-snug transition-colors duration-300 group-hover:text-primary">
                      {{ related.title }}
                    </h3>
                    <p class="mt-2 text-sm text-muted-foreground line-clamp-2">{{ related.excerpt }}</p>

                    <div class="mt-5 flex items-center justify-between">
                      <div class="flex flex-wrap gap-1.5">
                        @for (tag of related.tags.slice(0, 2); track tag) {
                          <span class="inline-flex items-center rounded-full border border-border/40 bg-muted/50 px-2.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                            {{ tag }}
                          </span>
                        }
                      </div>
                      <div class="shrink-0 inline-flex items-center justify-center rounded-full h-8 w-8 bg-muted/50 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                             stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M7 17 17 7"/><path d="M7 7h10v10"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                </a>
              }
            </div>
          </div>
        }
      </div>
    } @else {
      <!-- 404 state -->
      <div class="py-32 text-center animate-in fade-in duration-500">
        <div class="container max-w-4xl mx-auto px-6">
          <div class="inline-flex items-center justify-center h-20 w-20 rounded-3xl bg-muted/50 mb-8">
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-muted-foreground">
              <circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/>
            </svg>
          </div>
          <h1 class="text-3xl font-extrabold mb-3">Post not found</h1>
          <p class="text-muted-foreground text-lg mb-8">The blog post you're looking for doesn't exist or has been moved.</p>
          <a routerLink="/blog"
             class="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.97]">
            Browse all posts
          </a>
        </div>
      </div>
    }
  `,
})
export class BlogPostComponent {
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);
  post: BlogPost | undefined;
  relatedPosts: BlogPost[] = [];
  categoryName = '';
  categoryColor = '#6b7280';

  constructor() {
    this.route.paramMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(params => {
        const slug = params.get('slug');
        this.post = BLOG_POSTS.find(p => p.slug === slug);
        if (this.post) {
          const cat = CATEGORIES.find(c => c.slug === this.post!.category);
          this.categoryName = cat?.name ?? '';
          this.categoryColor = this.getCategoryColor(this.post.category);
          this.relatedPosts = BLOG_POSTS
            .filter(p => p.id !== this.post!.id && (p.category === this.post!.category || p.tags.some(t => this.post!.tags.includes(t))))
            .slice(0, 2);
        } else {
          this.relatedPosts = [];
          this.categoryName = '';
          this.categoryColor = '#6b7280';
        }
      });
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
