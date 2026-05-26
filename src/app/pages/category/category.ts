import { Component, inject, computed, signal, effect } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BLOG_POSTS, CATEGORIES } from '../../models/blog-post.model';
import { SeoService } from '../../services/seo.service';
import { md3CategoryAccent, md3CategoryAccentLine, md3CategoryTint } from '../../shared/md3/md3-color-roles';

@Component({
  selector: 'app-category',
  imports: [RouterLink],
  template: `
    <!-- Hero header -->
    <section class="relative overflow-hidden">
      <div class="absolute inset-0 -z-10">
        <div class="absolute top-[-25%] left-[10%] h-[400px] w-[400px] rounded-full blur-[120px] animate-blob"
             [style.background-color]="categoryTint(10)"></div>
        <div class="absolute bottom-[-30%] right-[-5%] h-[350px] w-[350px] rounded-full blur-[100px] animate-blob animation-delay-2000"
             style="background: color-mix(in srgb, var(--md-sys-color-primary) 8%, transparent)"></div>
      </div>

      <div class="container max-w-6xl mx-auto px-6 pt-16 pb-12 md:pt-24 md:pb-16">
        <!-- Breadcrumb -->
        <nav aria-label="Breadcrumb" class="mb-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <ol class="flex items-center gap-1.5 text-sm text-muted-foreground">
            <li><a routerLink="/" class="hover:text-foreground transition-colors">Home</a></li>
            <li class="text-muted-foreground/50">/</li>
            <li><a routerLink="/blog" class="hover:text-foreground transition-colors">Blog</a></li>
            <li class="text-muted-foreground/50">/</li>
            <li class="text-foreground font-medium" aria-current="page">{{ categoryName() }}</li>
          </ol>
        </nav>
        <div class="max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div class="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider mb-6"
               [style.background-color]="categoryTint()"
               [style.color]="categoryColor()">
            <span class="h-2 w-2 rounded-full" [style.background-color]="categoryColor()"></span>
            Category
          </div>
          <h1 class="text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.1]">
            {{ categoryName() }}
          </h1>
          <p class="mt-4 text-lg text-muted-foreground leading-relaxed">
            {{ categoryHub().description }}
          </p>
        </div>
      </div>
    </section>

    <!-- Category pills + Posts -->
    <section class="pb-20">
      <div class="container max-w-6xl mx-auto px-6">
        <section class="mb-10 rounded-[2rem] border border-border/60 bg-card/70 p-6 shadow-sm md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div class="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <p class="text-xs font-bold uppercase tracking-wider" [style.color]="categoryColor()">Learning hub</p>
              <h2 class="mt-2 text-2xl font-extrabold tracking-tight">What this category covers</h2>
              <p class="mt-3 text-muted-foreground leading-relaxed">{{ categoryHub().scope }}</p>
              <div class="mt-5 flex flex-wrap gap-2">
                @for (topic of categoryHub().topics; track topic) {
                  <span class="inline-flex min-h-[36px] items-center rounded-full border border-border/60 bg-muted/50 px-3 text-xs font-bold text-muted-foreground">
                    {{ topic }}
                  </span>
                }
              </div>
            </div>
            <div class="rounded-[1.5rem] bg-muted/50 p-5">
              <h3 class="text-base font-bold">Recommended starting guides</h3>
              <ul class="mt-4 space-y-3">
                @for (post of recommendedPosts(); track post.id) {
                  <li>
                    <a [routerLink]="['/blog', post.slug]" class="group flex gap-3 rounded-2xl p-2 transition-colors hover:bg-accent focus-visible:bg-accent">
                      <span class="mt-1 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                            [style.background-color]="categoryTint(18)"
                            [style.color]="categoryColor()">
                        {{ $index + 1 }}
                      </span>
                      <span>
                        <span class="block text-sm font-bold text-foreground group-hover:text-primary">{{ post.title }}</span>
                        <span class="mt-1 block text-xs text-muted-foreground">{{ post.readTime }}</span>
                      </span>
                    </a>
                  </li>
                }
              </ul>
            </div>
          </div>
        </section>

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
                       [style.background-image]="categoryAccentLine()"></div>

                  <div class="p-6 md:p-8 flex flex-col justify-between" [class]="i === 0 ? 'md:flex-1' : ''">
                    <div>
                      <div class="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mb-4">
                        <time class="font-mono" [attr.datetime]="post.date">{{ post.date }}</time>
                        <span class="h-1 w-1 rounded-full bg-muted-foreground/50"></span>
                        <span>{{ post.readTime }}</span>
                        <span class="h-1 w-1 rounded-full bg-muted-foreground/50"></span>
                        <span>By {{ post.author }}</span>
                        @if (post.featured) {
                          <span class="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold"
                                style="background: var(--md-sys-color-tertiary-container); color: var(--md-sys-color-on-tertiary-container)">
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
  private seo = inject(SeoService);
  categories = CATEGORIES;

  categorySlug = signal(this.route.snapshot.paramMap.get('slug') ?? '');

  categoryName = computed(() => {
    const cat = CATEGORIES.find(c => c.slug === this.categorySlug());
    return cat ? cat.name : 'Category';
  });

  categoryColor = computed(() => {
    return md3CategoryAccent(this.categorySlug());
  });

  categoryTint(amount = 14): string {
    return md3CategoryTint(this.categorySlug(), amount);
  }

  categoryAccentLine(): string {
    return md3CategoryAccentLine(this.categorySlug());
  }

  private categoryDescriptions: Record<string, string> = {
    ai: 'Guides on AI, LLMs, Claude, MCP servers, prompting, local AI stacks, and building with modern AI tools.',
    frontend: 'Frontend engineering guides for building reliable Angular, React, TypeScript, CSS, and UI systems that hold up in production.',
    backend: 'Practical guides on Python, Django, APIs, authentication, and backend architecture patterns.',
    devops: 'Learn Kubernetes, Docker, CI/CD, cron jobs, and infrastructure automation for production systems.',
    tutorials: 'Step-by-step workshops and hands-on tutorials for developers at every level.',
    'open-source': 'Open-source engineering guides for contributing safely, structuring public projects, and maintaining developer tools with confidence.',
  };

  private categoryHubContent: Record<string, { description: string; scope: string; topics: string[] }> = {
    frontend: {
      description: 'Learn practical frontend engineering through real layout, framework, state-management, and performance guides.',
      scope: 'This hub is for engineers who want frontend decisions to stay maintainable under real product pressure: routing, state, responsive layout, accessibility, and production UI trade-offs.',
      topics: ['Angular', 'React', 'TypeScript', 'CSS architecture', 'Responsive UI', 'Performance'],
    },
    'open-source': {
      description: 'Learn how to read, contribute to, and maintain open-source projects without turning the workflow into guesswork.',
      scope: 'This hub focuses on the engineering habits behind public software: first pull requests, repository structure, maintainer communication, package quality, and practical project hygiene.',
      topics: ['First PRs', 'Project structure', 'Maintainer workflow', 'Package quality', 'Developer tooling'],
    },
    ai: {
      description: 'Learn production AI systems through RAG, MCP, Claude, embeddings, agents, and observability guides.',
      scope: 'This hub connects AI application ideas to the systems work that makes them reliable: retrieval quality, token cost control, tool permissions, evaluation, and safe deployment.',
      topics: ['RAG', 'MCP', 'AI agents', 'Vector search', 'Prompting', 'Evaluation'],
    },
    backend: {
      description: 'Learn backend architecture through API design, authentication, databases, distributed systems, and production patterns.',
      scope: 'This hub covers the decisions backend engineers revisit repeatedly: rate limiting, caching, auth, connection pooling, queues, concurrency, and operational debugging.',
      topics: ['APIs', 'Auth', 'Databases', 'Caching', 'Queues', 'Distributed systems'],
    },
    devops: {
      description: 'Learn DevOps and platform engineering through Kubernetes, Linux, CI/CD, observability, and infrastructure automation.',
      scope: 'This hub is built for engineers who operate systems after deployment: scheduling, debugging, infrastructure-as-code, deployment safety, and production reliability.',
      topics: ['Kubernetes', 'Linux', 'CI/CD', 'Terraform', 'Observability', 'Reliability'],
    },
    tutorials: {
      description: 'Step-by-step engineering tutorials with examples, commands, trade-offs, and production notes.',
      scope: 'This hub collects guided walkthroughs that teach one practical skill at a time, with enough context to understand the decisions behind the code.',
      topics: ['Hands-on guides', 'Code examples', 'Architecture notes', 'Debugging', 'Production trade-offs'],
    },
  };

  constructor() {
    effect(() => {
      const name = this.categoryName();
      const slug = this.categorySlug();
      const count = this.filteredPosts().length;
      const desc = this.categoryHub().description || this.categoryDescriptions[slug]
        || `Browse ${count} article${count !== 1 ? 's' : ''} about ${name} on CodersSecret.`;
      const posts = this.filteredPosts();
      this.seo.update({
        title: `${name} Tutorials and Guides | CodersSecret`,
        description: desc,
        url: `/category/${slug}`,
        breadcrumbs: [
          { name: 'Home', url: '/' },
          { name: 'Blog', url: '/blog' },
          { name: name, url: `/category/${slug}` },
        ],
        itemList: posts.map(p => ({
          name: p.title,
          url: `/blog/${p.slug}`,
          description: p.excerpt,
        })),
      });
    });
  }

  filteredPosts = computed(() => {
    const slug = this.categorySlug();
    if (!slug) return BLOG_POSTS;
    return BLOG_POSTS.filter(post => post.category === slug);
  });

  recommendedPosts = computed(() => this.filteredPosts().slice(0, 3));

  categoryHub = computed(() => {
    const slug = this.categorySlug();
    const name = this.categoryName();
    return this.categoryHubContent[slug] ?? {
      description: this.categoryDescriptions[slug] || `Practical ${name} guides for engineers building production software.`,
      scope: `Use this hub to scan the most useful ${name} articles, then follow the internal links into detailed tutorials, examples, and related learning paths.`,
      topics: [name, 'Production engineering', 'Practical guides'],
    };
  });
}
