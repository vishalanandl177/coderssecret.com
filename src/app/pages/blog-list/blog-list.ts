import { Component, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BLOG_POSTS, CATEGORIES } from '../../models/blog-post.model';

@Component({
  selector: 'app-blog-list',
  imports: [RouterLink],
  template: `
    <section class="py-12 md:py-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div class="container max-w-5xl mx-auto px-6">
        <h1 class="text-3xl md:text-4xl font-bold tracking-tight mb-2">Blog</h1>
        <p class="text-muted-foreground mb-8">Thoughts on Angular, web development, and modern tooling.</p>

        <!-- Category filter pills -->
        <div class="flex flex-wrap gap-2 mb-10">
          @for (cat of categories; track cat.slug) {
            <button (click)="activeCategory.set(cat.slug)"
                    class="inline-flex items-center rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200 active:scale-[0.96]"
                    [class]="activeCategory() === cat.slug ?
                      'bg-primary text-primary-foreground shadow-sm' :
                      'bg-secondary text-secondary-foreground hover:bg-accent'">
              {{ cat.name }}
            </button>
          }
        </div>

        <div class="grid gap-5">
          @for (post of filteredPosts(); track post.id) {
            <article class="group animate-in fade-in slide-in-from-bottom-2 duration-300">
              <a [routerLink]="['/blog', post.slug]" class="block">
                <div class="rounded-lg border border-border bg-card p-6 transition-all duration-300 hover:shadow-md hover:border-primary/20 hover:-translate-y-0.5">
                  <div class="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mb-3">
                    <time>{{ post.date }}</time>
                    <span>&middot;</span>
                    <span>{{ post.readTime }}</span>
                    <span>&middot;</span>
                    <span>By {{ post.author }}</span>
                    @if (post.featured) {
                      <span class="inline-flex items-center rounded-full bg-primary/10 text-primary px-2 py-0.5 text-[10px] font-semibold">
                        Featured
                      </span>
                    }
                  </div>
                  <h2 class="text-xl font-semibold tracking-tight transition-colors duration-200 group-hover:text-primary">
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
            <div class="text-center py-16 animate-in fade-in duration-300">
              <p class="text-muted-foreground text-lg">No posts found in this category.</p>
              <button (click)="activeCategory.set('')"
                      class="mt-4 text-sm text-primary hover:underline">
                View all posts
              </button>
            </div>
          }
        </div>
      </div>
    </section>
  `,
})
export class BlogListComponent {
  categories = CATEGORIES;
  activeCategory = signal('');

  filteredPosts = computed(() => {
    const cat = this.activeCategory();
    if (!cat) return BLOG_POSTS;
    return BLOG_POSTS.filter(post => post.category === cat);
  });
}
