import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BLOG_POSTS, CATEGORIES, BlogPost } from '../../models/blog-post.model';

@Component({
  selector: 'app-blog-post',
  imports: [RouterLink],
  template: `
    @if (post) {
      <article class="py-12 md:py-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div class="container max-w-3xl mx-auto px-6">
          <a routerLink="/blog"
             class="inline-flex items-center gap-1 text-sm text-muted-foreground transition-all duration-200 hover:text-foreground hover:gap-2 mb-8">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>
            </svg>
            Back to Blog
          </a>

          <header class="mb-10">
            <div class="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-4">
              @if (categoryName) {
                <a [routerLink]="['/category', post.category]"
                   class="inline-flex items-center rounded-full bg-primary/10 text-primary px-2.5 py-0.5 text-xs font-semibold transition-colors hover:bg-primary/20">
                  {{ categoryName }}
                </a>
              }
              <time>{{ post.date }}</time>
              <span>&middot;</span>
              <span>{{ post.readTime }}</span>
              <span>&middot;</span>
              <span>By {{ post.author }}</span>
            </div>
            <h1 class="text-3xl md:text-4xl font-bold tracking-tight leading-tight">{{ post.title }}</h1>
            <div class="mt-4 flex flex-wrap gap-2">
              @for (tag of post.tags; track tag) {
                <span class="inline-flex items-center rounded-md bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
                  {{ tag }}
                </span>
              }
            </div>
          </header>

          <div class="prose prose-neutral max-w-none
                      [&>p]:text-foreground [&>p]:leading-relaxed [&>p]:mb-5
                      [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:tracking-tight [&>h2]:mt-12 [&>h2]:mb-4 [&>h2]:text-foreground
                      [&>ul]:text-foreground [&>ul]:mb-5 [&>ul]:ml-6 [&>ul]:list-disc [&>ul>li]:mb-2 [&>ul>li]:leading-relaxed
                      [&>ol]:text-foreground [&>ol]:mb-5 [&>ol]:ml-6 [&>ol]:list-decimal [&>ol>li]:mb-2
                      [&>pre]:bg-muted [&>pre]:rounded-lg [&>pre]:p-4 [&>pre]:mb-5 [&>pre]:overflow-x-auto [&>pre]:text-sm
                      [&>code]:bg-muted [&>code]:px-1.5 [&>code]:py-0.5 [&>code]:rounded [&>code]:text-sm
                      [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm
                      [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4 [&_a:hover]:text-primary/80
                      [&>pre_code]:bg-transparent [&>pre_code]:p-0"
               [innerHTML]="post.content">
          </div>

          <!-- Related posts -->
          @if (relatedPosts.length > 0) {
            <div class="mt-16 pt-10 border-t border-border">
              <h2 class="text-xl font-bold tracking-tight mb-6">Related Posts</h2>
              <div class="grid gap-4 md:grid-cols-2">
                @for (related of relatedPosts; track related.id) {
                  <a [routerLink]="['/blog', related.slug]"
                     class="group rounded-lg border border-border bg-card p-5 transition-all duration-300 hover:shadow-md hover:border-primary/20 hover:-translate-y-0.5">
                    <div class="text-xs text-muted-foreground mb-2">{{ related.date }} &middot; {{ related.readTime }}</div>
                    <h3 class="font-semibold tracking-tight transition-colors duration-200 group-hover:text-primary line-clamp-2">
                      {{ related.title }}
                    </h3>
                  </a>
                }
              </div>
            </div>
          }
        </div>
      </article>
    } @else {
      <div class="py-16 text-center animate-in fade-in duration-300">
        <div class="container max-w-4xl mx-auto px-6">
          <h1 class="text-2xl font-bold mb-4">Post not found</h1>
          <p class="text-muted-foreground mb-6">The blog post you're looking for doesn't exist.</p>
          <a routerLink="/blog"
             class="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow transition-all duration-200 hover:bg-primary/90 hover:shadow-md">
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
  relatedPosts: BlogPost[] = [];
  categoryName = '';

  constructor() {
    const slug = this.route.snapshot.paramMap.get('slug');
    this.post = BLOG_POSTS.find(p => p.slug === slug);
    if (this.post) {
      const cat = CATEGORIES.find(c => c.slug === this.post!.category);
      this.categoryName = cat?.name ?? '';
      this.relatedPosts = BLOG_POSTS
        .filter(p => p.id !== this.post!.id && (p.category === this.post!.category || p.tags.some(t => this.post!.tags.includes(t))))
        .slice(0, 2);
    }
  }
}
