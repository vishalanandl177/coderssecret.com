import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BLOG_POSTS } from '../../models/blog-post.model';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  template: `
    <section class="py-16 md:py-24">
      <div class="container max-w-4xl mx-auto px-6">
        <div class="max-w-2xl">
          <h1 class="text-4xl md:text-5xl font-bold tracking-tight">
            Welcome to <span class="text-primary">Coders</span>Secret
          </h1>
          <p class="mt-4 text-lg text-muted-foreground leading-relaxed">
            Exploring modern web development with Angular, Tailwind CSS, and the tools that make building for the web a joy.
          </p>
          <div class="mt-8 flex gap-4">
            <a routerLink="/blog"
               class="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 transition-colors">
              Read the Blog
            </a>
          </div>
        </div>
      </div>
    </section>

    <section class="py-12 border-t border-border">
      <div class="container max-w-4xl mx-auto px-6">
        <h2 class="text-2xl font-bold tracking-tight mb-8">Latest Posts</h2>
        <div class="grid gap-8">
          @for (post of latestPosts; track post.id) {
            <article class="group">
              <a [routerLink]="['/blog', post.slug]" class="block">
                <div class="rounded-lg border border-border bg-card p-6 transition-colors hover:bg-accent/50">
                  <div class="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mb-3">
                    <time>{{ post.date }}</time>
                    <span>&middot;</span>
                    <span>{{ post.readTime }}</span>
                  </div>
                  <h3 class="text-xl font-semibold tracking-tight group-hover:text-primary transition-colors">
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
  latestPosts = BLOG_POSTS.slice(0, 3);
}
