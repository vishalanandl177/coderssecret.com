import { Component, inject, computed, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BLOG_POSTS, CATEGORIES } from '../../models/blog-post.model';

@Component({
  selector: 'app-category',
  imports: [RouterLink],
  template: `
    <section class="py-12 md:py-16">
      <div class="container max-w-4xl mx-auto px-6">
        <h1 class="text-3xl md:text-4xl font-bold tracking-tight mb-2">
          {{ categoryName() }}
        </h1>
        <p class="text-muted-foreground mb-8">
          {{ filteredPosts().length }} post{{ filteredPosts().length !== 1 ? 's' : '' }} in this category
        </p>

        <div class="flex flex-wrap gap-2 mb-10">
          @for (cat of categories; track cat.slug) {
            <a [routerLink]="cat.slug ? ['/category', cat.slug] : ['/blog']"
               class="inline-flex items-center rounded-full px-4 py-1.5 text-sm font-medium transition-colors"
               [class]="cat.slug === categorySlug() ?
                 'bg-primary text-primary-foreground' :
                 'bg-secondary text-secondary-foreground hover:bg-accent'">
              {{ cat.name }}
            </a>
          }
        </div>

        <div class="grid gap-6">
          @for (post of filteredPosts(); track post.id) {
            <article class="group">
              <a [routerLink]="['/blog', post.slug]" class="block">
                <div class="rounded-lg border border-border bg-card p-6 transition-colors hover:bg-accent/50">
                  <div class="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mb-3">
                    <time>{{ post.date }}</time>
                    <span>&middot;</span>
                    <span>{{ post.readTime }}</span>
                    <span>&middot;</span>
                    <span>By {{ post.author }}</span>
                  </div>
                  <h2 class="text-xl font-semibold tracking-tight group-hover:text-primary transition-colors">
                    {{ post.title }}
                  </h2>
                  <p class="mt-2 text-muted-foreground">{{ post.excerpt }}</p>
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

          @if (filteredPosts().length === 0) {
            <div class="text-center py-12">
              <p class="text-muted-foreground">No posts found in this category yet.</p>
              <a routerLink="/blog" class="mt-4 inline-flex items-center text-sm text-primary hover:underline">
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

  filteredPosts = computed(() => {
    const slug = this.categorySlug();
    if (!slug) return BLOG_POSTS;
    return BLOG_POSTS.filter(post => post.category === slug);
  });
}
