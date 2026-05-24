import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BLOG_POSTS, BlogPost, CATEGORIES } from '../../models/blog-post.model';
import { SeoService } from '../../services/seo.service';
import { Md3ActiveIndicatorDirective } from '../../shared/md3/md3-active-indicator';

type TopicFilter = {
  label: string;
  key: string;
  hint: string;
};

type CategoryRail = {
  category: (typeof CATEGORIES)[number];
  posts: BlogPost[];
  intro: string;
};

@Component({
  selector: 'app-blog-list',
  imports: [RouterLink, Md3ActiveIndicatorDirective],
  template: `
    <div class="md3-blog-page">
      <section class="md3-blog-hero md3-page-hero" aria-labelledby="blog-heading">
        <div class="md3-blog-hero-inner">
          <nav aria-label="Breadcrumb" class="md3-blog-breadcrumb">
            <ol>
              <li><a routerLink="/">Home</a></li>
              <li aria-hidden="true">/</li>
              <li aria-current="page">Blog</li>
            </ol>
          </nav>

          <div class="md3-blog-hero-grid">
            <div class="md3-blog-hero-copy">
              <p class="md3-blog-kicker">CodersSecret blog</p>
              <h1 id="blog-heading">Learn the systems behind production software</h1>
              <p class="md3-blog-hero-lede">
                Practical guides on system design, security, DevOps, AI, cloud, databases, and the engineering decisions that matter in real projects.
              </p>

              <div class="md3-blog-hero-actions" aria-label="Learning focus">
                <a routerLink="/courses" class="md3-button-filled">
                  Start with courses
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                       stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                  </svg>
                </a>
                <a routerLink="/cheatsheets" class="md3-button-tonal">Use reference sheets</a>
              </div>
            </div>

            <aside class="md3-blog-hero-panel" aria-label="Blog overview">
              <div class="md3-blog-panel-header">
                <p>Learning hub</p>
                <span>{{ latestPost().date }}</span>
              </div>
              <div class="md3-blog-metric-grid" aria-label="Blog stats">
                <div>
                  <strong>{{ totalPosts }}</strong>
                  <span>Guides</span>
                </div>
                <div>
                  <strong>{{ topTags.length }}</strong>
                  <span>Popular topics</span>
                </div>
              </div>
              <div class="md3-blog-topic-stack" aria-label="Common blog topics">
                @for (tag of topTags.slice(0, 4); track tag.label) {
                  <a [routerLink]="['/blog']" [queryParams]="{ tag: tag.label }">
                    <span>{{ tag.label }}</span>
                    <strong>{{ tag.count }}</strong>
                  </a>
                }
              </div>
            </aside>
          </div>
        </div>
      </section>

      @if (isDefaultView()) {
        <section class="md3-blog-section md3-blog-featured-section" aria-labelledby="start-here-heading">
          <div class="md3-blog-container">
            <div class="md3-blog-section-header">
              <div>
                <p class="md3-blog-section-label">Start here</p>
                <h2 id="start-here-heading">Featured paths for practical engineers</h2>
              </div>
              <a routerLink="/slides/mcp-security-production-ai-agents-oauth-gateways" class="md3-button-outlined">
                Watch a guide
              </a>
            </div>

            <div class="md3-blog-featured-grid">
              @if (startHerePost(); as post) {
                <article class="md3-blog-featured-card" [attr.aria-labelledby]="'featured-' + post.id">
                  <div class="md3-blog-featured-media">
                    @if (coverImageFor(post); as cover) {
                      <img [src]="cover"
                           [alt]="post.title + ' illustration'"
                           width="1200"
                           height="630"
                           loading="eager"
                           decoding="async" />
                    } @else {
                      <div class="md3-blog-card-visual-fallback" aria-hidden="true">
                        <span>{{ getCategoryName(post.category) }}</span>
                        <strong>{{ post.tags[0] || 'Guide' }}</strong>
                      </div>
                    }
                  </div>
                  <div class="md3-blog-featured-body">
                    <div class="md3-blog-meta-row">
                      <a [routerLink]="['/category', post.category]" class="md3-blog-category-pill">{{ getCategoryName(post.category) }}</a>
                      <time [attr.datetime]="post.date">{{ formatDate(post.date) }}</time>
                      <span>{{ post.readTime }}</span>
                    </div>
                    <h3 [id]="'featured-' + post.id">{{ post.title }}</h3>
                    <p>{{ summaryFor(post) }}</p>
                    <div class="md3-blog-tag-row">
                      @for (tag of post.tags.slice(0, 4); track tag) {
                        <a [routerLink]="['/blog']" [queryParams]="{ tag: tag }">{{ tag }}</a>
                      }
                    </div>
                    <div class="md3-blog-card-actions">
                      <a [routerLink]="['/blog', post.slug]" class="md3-button-filled" [attr.aria-label]="'Read article: ' + post.title">
                        Read article
                      </a>
                      <a [routerLink]="['/slides', post.slug]" class="md3-button-outlined" [attr.aria-label]="'Watch as slides: ' + post.title">
                        Watch as Slides
                      </a>
                    </div>
                  </div>
                </article>
              }

              <div class="md3-blog-supporting-list" aria-label="Supporting featured guides">
                @for (post of supportingFeatured(); track post.id) {
                  <article class="md3-blog-supporting-card" [attr.aria-labelledby]="'supporting-' + post.id">
                    <div class="md3-blog-meta-row">
                      <a [routerLink]="['/category', post.category]" class="md3-blog-category-pill">{{ getCategoryName(post.category) }}</a>
                      <span>{{ post.readTime }}</span>
                    </div>
                    <h3 [id]="'supporting-' + post.id">{{ post.title }}</h3>
                    <p>{{ summaryFor(post) }}</p>
                    <div class="md3-blog-card-actions">
                      <a [routerLink]="['/blog', post.slug]" class="md3-blog-text-action" [attr.aria-label]="'Read article: ' + post.title">
                        Read article
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                             stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                          <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                        </svg>
                      </a>
                      <a [routerLink]="['/slides', post.slug]" class="md3-blog-text-action md3-blog-text-action-tonal" [attr.aria-label]="'Watch as slides: ' + post.title">
                        Slides
                      </a>
                    </div>
                  </article>
                }
              </div>
            </div>
          </div>
        </section>
      }

      <section class="md3-blog-filter-section" aria-labelledby="browse-topic-heading">
        <div class="md3-blog-container">
          <div class="md3-blog-filter-surface">
            <div class="md3-blog-filter-header">
              <div>
                <p class="md3-blog-section-label">Browse by topic</p>
                <h2 id="browse-topic-heading">Find the guide that matches your work</h2>
              </div>
              <p>{{ allFilteredPosts().length }} matching guide{{ allFilteredPosts().length === 1 ? '' : 's' }}</p>
            </div>

            <div class="md3-blog-search-field">
              <label for="blog-filter-search">Search guides</label>
              <div>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
                </svg>
                <input id="blog-filter-search"
                       type="search"
                       autocomplete="off"
                       placeholder="Search by title, summary, tag, or author"
                       [value]="searchQuery()"
                       (input)="onSearchInput($event)" />
              </div>
            </div>

            <nav class="md3-blog-filter-chip-list"
                 appMd3ActiveIndicator=".md3-blog-filter-chip-selected"
                 aria-label="Article topic filters">
              @for (filter of topicFilters; track filter.key) {
                <button type="button"
                        class="md3-blog-filter-chip"
                        [class.md3-blog-filter-chip-selected]="activeTopic() === filter.key"
                        [attr.aria-pressed]="activeTopic() === filter.key"
                        [attr.aria-label]="filter.hint + ': ' + getTopicCount(filter.key) + ' guides'"
                        (click)="setTopic(filter.key)">
                  @if (activeTopic() === filter.key) {
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                      <path d="m5 12 4 4L19 6"/>
                    </svg>
                  }
                  <span>{{ filter.label }}</span>
                  <strong>{{ getTopicCount(filter.key) }}</strong>
                </button>
              }
            </nav>

            @if (activeTag()) {
              <div class="md3-blog-active-filter" role="status">
                <span>Filtered by tag: <strong>{{ activeTag() }}</strong></span>
                <button type="button" (click)="clearTag()" aria-label="Clear tag filter">
                  Clear tag
                </button>
              </div>
            }
          </div>
        </div>
      </section>

      <section class="md3-blog-section md3-blog-section-alt" aria-labelledby="latest-guides-heading">
        <div class="md3-blog-container">
          <div class="md3-blog-section-header">
            <div>
              <p class="md3-blog-section-label">Category shelves</p>
              <h2 id="latest-guides-heading">{{ resultHeading() }}</h2>
            </div>
            @if (!isDefaultView()) {
              <button type="button" class="md3-button-outlined" (click)="clearAllFilters()">
                Reset filters
              </button>
            }
          </div>

          @if (categoryRails().length > 0) {
            <div class="md3-blog-category-rails">
              @for (rail of categoryRails(); track rail.category.slug) {
                <section class="md3-blog-category-rail" [attr.aria-labelledby]="'blog-rail-' + rail.category.slug">
                  <div class="md3-blog-category-rail-header">
                    <div>
                      <p class="md3-blog-section-label">{{ rail.posts.length }} guide{{ rail.posts.length === 1 ? '' : 's' }}</p>
                      <h3 [id]="'blog-rail-' + rail.category.slug">{{ rail.category.name }}</h3>
                      <p>{{ rail.intro }}</p>
                    </div>
                    <a [routerLink]="['/category', rail.category.slug]" class="md3-button-outlined">
                      View category
                    </a>
                  </div>

                  <div class="md3-blog-horizontal-scroller"
                       role="list"
                       tabindex="0"
                       [attr.aria-label]="rail.category.name + ' article list'">
                    @for (post of rail.posts; track post.id) {
                      <article class="md3-blog-article-card md3-blog-rail-card"
                               role="listitem"
                               [attr.aria-labelledby]="'article-' + post.id">
                        <div class="md3-blog-card-media">
                          @if (coverImageFor(post); as cover) {
                            <img [src]="cover"
                                 [alt]="post.title + ' illustration'"
                                 width="1200"
                                 height="630"
                                 loading="lazy"
                                 decoding="async" />
                          } @else {
                            <div class="md3-blog-card-visual-fallback" aria-hidden="true">
                              <span>{{ getCategoryName(post.category) }}</span>
                              <strong>{{ post.tags[0] || 'Guide' }}</strong>
                            </div>
                          }
                        </div>

                        <div class="md3-blog-card-body">
                          <div class="md3-blog-meta-row">
                            <a [routerLink]="['/category', post.category]" class="md3-blog-category-pill">{{ getCategoryName(post.category) }}</a>
                            <time [attr.datetime]="post.date">{{ formatDate(post.date) }}</time>
                            <span>{{ post.readTime }}</span>
                          </div>

                          <h3 [id]="'article-' + post.id">{{ post.title }}</h3>
                          <p>{{ summaryFor(post) }}</p>

                          <div class="md3-blog-tag-row">
                            @for (tag of post.tags.slice(0, 3); track tag) {
                              <a [routerLink]="['/blog']" [queryParams]="{ tag: tag }">{{ tag }}</a>
                            }
                          </div>

                          <div class="md3-blog-card-actions">
                            <a [routerLink]="['/blog', post.slug]" class="md3-blog-read-link" [attr.aria-label]="'Read article: ' + post.title">
                              Read article
                            </a>
                            <a [routerLink]="['/slides', post.slug]" class="md3-blog-slide-link" [attr.aria-label]="'Watch as slides: ' + post.title">
                              Watch as Slides
                            </a>
                          </div>
                        </div>
                      </article>
                    }
                  </div>
                </section>
              }
            </div>
          } @else {
            <div class="md3-blog-empty-state" role="status">
              <div aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
                </svg>
              </div>
              <h2>No guides match these filters</h2>
              <p>Try a broader topic, remove the tag filter, or search for the system you are working on.</p>
              <button type="button" class="md3-button-filled" (click)="clearAllFilters()">View all guides</button>
            </div>
          }
        </div>
      </section>
    </div>
  `,
})
export class BlogListComponent {
  private seo = inject(SeoService);
  private route = inject(ActivatedRoute);

  readonly categories = CATEGORIES;
  readonly totalPosts = BLOG_POSTS.length;
  readonly topTags = this.computeTopTags();
  readonly generatedCoverMissingSlugs = new Set([
    'distributed-systems-algorithms-production-guide',
    'rate-limiting-algorithms-production-guide',
    'caching-strategies-production-guide',
    'scheduling-systems-production-guide',
  ]);

  readonly activeTopic = signal('all');
  readonly activeTag = signal('');
  readonly searchQuery = signal('');

  readonly topicFilters: TopicFilter[] = [
    { label: 'All', key: 'all', hint: 'Show all practical engineering guides' },
    { label: 'Security', key: 'security', hint: 'Security, identity, OAuth, and Zero Trust guides' },
    { label: 'System Design', key: 'system-design', hint: 'Distributed systems, architecture, caching, and scaling guides' },
    { label: 'DevOps', key: 'devops', hint: 'Kubernetes, CI/CD, observability, and operations guides' },
    { label: 'AI', key: 'ai', hint: 'RAG, agents, Claude, MCP, and AI infrastructure guides' },
    { label: 'Python', key: 'python', hint: 'Python, Django, async, and performance guides' },
    { label: 'Cloud', key: 'cloud', hint: 'Cloud, Kubernetes, containers, and platform guides' },
    { label: 'Data', key: 'data', hint: 'SQL, analytics, dbt, pipelines, and data architecture guides' },
    { label: 'Frontend', key: 'frontend', hint: 'Angular, React, TypeScript, CSS, and UI engineering guides' },
    { label: 'Career', key: 'career', hint: 'Engineering career, compensation, OKRs, and communication guides' },
  ];

  readonly latestPost = computed(() => BLOG_POSTS[0]);
  readonly featuredPosts = computed(() => BLOG_POSTS.filter(post => post.featured).slice(0, 4));
  readonly startHerePost = computed(() => this.featuredPosts()[0] ?? BLOG_POSTS[0]);
  readonly supportingFeatured = computed(() => {
    const primary = this.startHerePost();
    return this.featuredPosts().filter(post => post.slug !== primary.slug).slice(0, 3);
  });
  readonly isDefaultView = computed(() => {
    return this.activeTopic() === 'all' && !this.activeTag() && !this.searchQuery().trim();
  });

  readonly allFilteredPosts = computed(() => {
    let posts = BLOG_POSTS;
    const topic = this.activeTopic();
    const tag = this.activeTag();
    const query = this.searchQuery().trim().toLowerCase();

    if (topic !== 'all') {
      posts = posts.filter(post => this.matchesTopic(post, topic));
    }

    if (tag) {
      posts = posts.filter(post => post.tags.some(item => item.toLowerCase() === tag.toLowerCase()));
    }

    if (query) {
      posts = posts.filter(post => {
        const haystack = [post.title, post.excerpt, post.author, post.category, ...post.tags].join(' ').toLowerCase();
        return haystack.includes(query);
      });
    }

    return posts;
  });

  readonly articleGridPosts = computed(() => {
    const posts = this.allFilteredPosts();
    if (!this.isDefaultView()) {
      return posts;
    }

    const featuredSlugs = new Set([
      this.startHerePost().slug,
      ...this.supportingFeatured().map(post => post.slug),
    ]);
    return posts.filter(post => !featuredSlugs.has(post.slug));
  });

  readonly categoryRails = computed<CategoryRail[]>(() => {
    const posts = this.articleGridPosts();
    return CATEGORIES
      .filter(category => category.slug)
      .map(category => ({
        category,
        posts: posts.filter(post => post.category === category.slug),
        intro: this.categoryIntro(category.slug),
      }))
      .filter(rail => rail.posts.length > 0);
  });

  constructor() {
    const tag = this.route.snapshot.queryParamMap.get('tag');
    if (tag) {
      this.activeTag.set(tag);
    }

    this.seo.update({
      title: tag ? `Articles tagged "${tag}" | CodersSecret Blog` : 'Blog | CodersSecret | Practical Engineering Tutorials',
      description: tag
        ? `Practical CodersSecret tutorials tagged ${tag}, with clear examples, diagrams, and slide walkthroughs for production engineering work.`
        : 'Practical tutorials on system design, security, DevOps, AI, cloud, Python, databases, and production software engineering.',
      url: '/blog/',
      breadcrumbs: [
        { name: 'Home', url: '/' },
        { name: 'Blog', url: '/blog/' },
      ],
      itemList: BLOG_POSTS.slice(0, 24).map(post => ({
        name: post.title,
        url: `/blog/${post.slug}`,
        description: post.excerpt,
      })),
    });
  }

  setTopic(topic: string) {
    this.activeTopic.set(topic);
  }

  clearTag() {
    this.activeTag.set('');
  }

  clearAllFilters() {
    this.activeTopic.set('all');
    this.activeTag.set('');
    this.searchQuery.set('');
  }

  onSearchInput(event: Event) {
    this.searchQuery.set((event.target as HTMLInputElement).value);
  }

  resultHeading(): string {
    if (this.searchQuery().trim()) {
      return `Guides matching "${this.searchQuery().trim()}" by category`;
    }
    if (this.activeTag()) {
      return `Guides tagged ${this.activeTag()} by category`;
    }
    const filter = this.topicFilters.find(item => item.key === this.activeTopic());
    return this.activeTopic() === 'all' ? 'Browse engineering guides by category' : `${filter?.label ?? 'Topic'} guides by category`;
  }

  getTopicCount(key: string): number {
    if (key === 'all') {
      return BLOG_POSTS.length;
    }
    return BLOG_POSTS.filter(post => this.matchesTopic(post, key)).length;
  }

  getCategoryName(slug: string): string {
    return CATEGORIES.find(category => category.slug === slug)?.name ?? slug;
  }

  formatDate(date: string): string {
    if (!date) {
      return '';
    }

    const parsed = new Date(`${date}T00:00:00`);
    if (Number.isNaN(parsed.getTime())) {
      return date;
    }

    return new Intl.DateTimeFormat('en', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(parsed);
  }

  summaryFor(post: BlogPost): string {
    return post.excerpt.replace(/\s+/g, ' ').trim();
  }

  coverImageFor(post: BlogPost): string | null {
    if (post.coverImage) {
      return post.coverImage;
    }

    if (this.generatedCoverMissingSlugs.has(post.slug)) {
      return null;
    }

    return `/images/banners/${post.slug}.svg`;
  }

  private matchesTopic(post: BlogPost, topic: string): boolean {
    const haystack = [post.category, post.title, post.excerpt, ...post.tags].join(' ').toLowerCase();
    const topicTerms: Record<string, string[]> = {
      security: ['security', 'zero trust', 'spiffe', 'spire', 'oauth', 'mtls', 'api security', 'supply chain', 'compliance'],
      'system-design': ['system design', 'distributed systems', 'architecture', 'cap theorem', 'load balancer', 'caching', 'rate limiting', 'scalability'],
      devops: ['devops', 'kubernetes', 'docker', 'ci/cd', 'terraform', 'observability', 'scheduling', 'linux'],
      ai: ['ai', 'rag', 'llm', 'mcp', 'agent', 'claude', 'vector'],
      python: ['python', 'django', 'fastapi', 'asyncio', 'gil'],
      cloud: ['cloud', 'kubernetes', 'serverless', 'aws', 'gcp', 'azure', 'container'],
      data: ['data', 'sql', 'dbt', 'analytics', 'pipeline', 'lakehouse', 'warehouse', 'dag'],
      frontend: ['frontend', 'angular', 'react', 'css', 'javascript', 'ui'],
      career: ['career', 'salary', 'interview', 'resume', 'okr', 'communication'],
    };

    return topicTerms[topic]?.some(term => haystack.includes(term)) ?? post.category === topic;
  }

  private categoryIntro(slug: string): string {
    const intros: Record<string, string> = {
      ai: 'RAG, MCP, agents, Claude, embeddings, and production AI infrastructure.',
      frontend: 'Angular, React, CSS, TypeScript, UI systems, and client-side performance.',
      backend: 'APIs, distributed systems, databases, caching, auth, and service architecture.',
      devops: 'Kubernetes, Linux, CI/CD, reliability, observability, and production operations.',
      tutorials: 'Step-by-step explanations with examples, commands, and practical trade-offs.',
      'open-source': 'Developer tooling, libraries, contribution workflows, and project structure.',
    };

    return intros[slug] ?? 'Practical engineering guides grouped for faster browsing.';
  }

  private computeTopTags(): Array<{ label: string; count: number }> {
    const counts = new Map<string, number>();
    BLOG_POSTS.forEach(post => {
      post.tags.forEach(tag => counts.set(tag, (counts.get(tag) ?? 0) + 1));
    });

    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .slice(0, 8)
      .map(([label, count]) => ({ label, count }));
  }
}
