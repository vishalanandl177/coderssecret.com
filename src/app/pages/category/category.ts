import { Component, inject, computed, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BLOG_POSTS, CATEGORIES } from '../../models/blog-post.model';

@Component({
  selector: 'app-category',
  imports: [RouterLink],
  template: `
    <!-- Hero header -->
    <section class="relative overflow-hidden">
      <div class="absolute inset-0 -z-10">
        <div class="absolute top-[-25%] left-[10%] h-[400px] w-[400px] rounded-full blur-[120px] animate-blob"
             [style.background-color]="categoryColor() + '12'"></div>
        <div class="absolute bottom-[-30%] right-[-5%] h-[350px] w-[350px] rounded-full bg-purple-500/8 blur-[100px] animate-blob animation-delay-2000"></div>
      </div>

      <div class="container max-w-6xl mx-auto px-6 pt-16 pb-12 md:pt-24 md:pb-16">
        <div class="max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div class="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider mb-6"
               [style.background-color]="categoryColor() + '15'"
               [style.color]="categoryColor()">
            <span class="h-2 w-2 rounded-full" [style.background-color]="categoryColor()"></span>
            Category
          </div>
          <h1 class="text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.1]">
            {{ categoryName() }}
          </h1>
          <p class="mt-4 text-lg text-muted-foreground leading-relaxed">
            {{ filteredPosts().length }} article{{ filteredPosts().length !== 1 ? 's' : '' }} in this category
          </p>
        </div>
      </div>
    </section>

    <!-- Category pills + Posts -->
    <section class="pb-20">
      <div class="container max-w-6xl mx-auto px-6">
        <!-- Category navigation -->
        <div class="flex flex-wrap gap-2 mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
          @for (cat of categories; track cat.slug) {
            <a [routerLink]="cat.slug ? ['/category', cat.slug] : ['/blog']"
               class="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 active:scale-[0.96]"
               [class]="cat.slug === categorySlug() ?
                 'bg-primary text-primary-foreground shadow-lg shadow-primary/25' :
                 'border border-border/60 bg-card/60 backdrop-blur-sm text-muted-foreground hover:text-foreground hover:bg-accent hover:border-accent'">
              {{ cat.name }}
            </a>
          }
        </div>

        <!-- Posts grid -->
        <div class="grid md:grid-cols-2 gap-5 animate-in fade-in duration-500 delay-300">
          @for (post of filteredPosts(); track post.id; let i = $index) {
            <article class="group" [class]="i === 0 ? 'md:col-span-2' : ''">
              <a [routerLink]="['/blog', post.slug]" class="block h-full">
                <div class="relative h-full rounded-2xl border border-border/60 bg-card overflow-hidden transition-all duration-500 hover:shadow-xl hover:-translate-y-1 hover:border-primary/20"
                     [class]="i === 0 ? 'md:flex md:items-stretch' : ''">
                  <!-- Top accent -->
                  <div class="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                       [style.background-image]="'linear-gradient(to right, transparent, ' + categoryColor() + ', transparent)'"></div>

                  <div class="p-6 md:p-8 flex flex-col justify-between" [class]="i === 0 ? 'md:flex-1' : ''">
                    <div>
                      <div class="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mb-4">
                        <time class="font-mono">{{ post.date }}</time>
                        <span class="h-1 w-1 rounded-full bg-muted-foreground/50"></span>
                        <span>{{ post.readTime }}</span>
                        <span class="h-1 w-1 rounded-full bg-muted-foreground/50"></span>
                        <span>By {{ post.author }}</span>
                        @if (post.featured) {
                          <span class="inline-flex items-center gap-1 rounded-full bg-yellow-500/10 text-yellow-600 px-2 py-0.5 text-[10px] font-bold">
                            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                            </svg>
                            Featured
                          </span>
                        }
                      </div>

                      <h2 class="font-bold tracking-tight leading-snug transition-colors duration-300 group-hover:text-primary"
                          [class]="i === 0 ? 'text-2xl md:text-3xl' : 'text-xl'">
                        {{ post.title }}
                      </h2>

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

          @if (filteredPosts().length === 0) {
            <div class="md:col-span-2 text-center py-20 animate-in fade-in duration-300">
              <div class="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-muted/50 mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-muted-foreground">
                  <path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/>
                </svg>
              </div>
              <p class="text-muted-foreground text-lg font-medium">No posts found in this category yet.</p>
              <a routerLink="/blog" class="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline underline-offset-4">
                View all posts
              </a>
            </div>
          }
        </div>
      </div>
    </section>
  `,
})
export class CategoryComponent {
  private route = inject(ActivatedRoute);
  categories = CATEGORIES;

  categorySlug = signal(this.route.snapshot.paramMap.get('slug') ?? '');

  categoryName = computed(() => {
    const cat = CATEGORIES.find(c => c.slug === this.categorySlug());
    return cat ? cat.name : 'Category';
  });

  categoryColor = computed(() => {
    const colors: Record<string, string> = {
      frontend: '#3b82f6', backend: '#22c55e', devops: '#f97316',
      tutorials: '#a855f7', 'open-source': '#ec4899',
    };
    return colors[this.categorySlug()] ?? '#6b7280';
  });

  filteredPosts = computed(() => {
    const slug = this.categorySlug();
    if (!slug) return BLOG_POSTS;
    return BLOG_POSTS.filter(post => post.category === slug);
  });
}
