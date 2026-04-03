import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BLOG_POSTS, BlogPost } from '../../models/blog-post.model';

@Component({
  selector: 'app-blog-post',
  imports: [RouterLink],
  template: `
    @if (post) {
      <article class="py-12 md:py-16">
        <div class="container max-w-3xl mx-auto px-6">
          <a routerLink="/blog"
             class="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>
            </svg>
            Back to Blog
          </a>

          <header class="mb-10">
            <div class="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-4">
              <time>{{ post.date }}</time>
              <span>&middot;</span>
              <span>{{ post.readTime }}</span>
              <span>&middot;</span>
              <span>By {{ post.author }}</span>
            </div>
            <h1 class="text-3xl md:text-4xl font-bold tracking-tight">{{ post.title }}</h1>
            <div class="mt-4 flex flex-wrap gap-2">
              @for (tag of post.tags; track tag) {
                <span class="inline-flex items-center rounded-md bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
                  {{ tag }}
                </span>
              }
            </div>
          </header>

          <div class="prose prose-neutral max-w-none
                      [&>p]:text-foreground [&>p]:leading-relaxed [&>p]:mb-4
                      [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:tracking-tight [&>h2]:mt-10 [&>h2]:mb-4
                      [&>code]:bg-muted [&>code]:px-1.5 [&>code]:py-0.5 [&>code]:rounded [&>code]:text-sm
                      [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm"
               [innerHTML]="post.content">
          </div>
        </div>
      </article>
    } @else {
      <div class="py-16 text-center">
        <div class="container max-w-4xl mx-auto px-6">
          <h1 class="text-2xl font-bold mb-4">Post not found</h1>
          <p class="text-muted-foreground mb-6">The blog post you're looking for doesn't exist.</p>
          <a routerLink="/blog"
             class="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 transition-colors">
            Back to Blog
          </a>
        </div>
      </div>
    }
  `,
})
export class BlogPostComponent {
  private route = inject(ActivatedRoute);
  post: BlogPost | undefined;

  constructor() {
    const slug = this.route.snapshot.paramMap.get('slug');
    this.post = BLOG_POSTS.find(p => p.slug === slug);
  }
}
