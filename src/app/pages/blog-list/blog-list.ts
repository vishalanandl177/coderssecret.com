import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BLOG_POSTS } from '../../models/blog-post.model';

@Component({
  selector: 'app-blog-list',
  imports: [RouterLink],
  template: `
    <section class="py-12 md:py-16">
      <div class="container max-w-4xl mx-auto px-6">
        <h1 class="text-3xl md:text-4xl font-bold tracking-tight mb-2">Blog</h1>
        <p class="text-muted-foreground mb-10">Thoughts on Angular, web development, and modern tooling.</p>

        <div class="grid gap-6">
          @for (post of posts; track post.id) {
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
        </div>
      </div>
    </section>
  `,
})
export class BlogListComponent {
  posts = BLOG_POSTS;
}
