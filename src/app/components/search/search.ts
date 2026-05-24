import { Component, signal, computed, DestroyRef, HostListener, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AnalyticsService } from '../../services/analytics.service';

type SearchablePost = { id: string; title: string; slug: string; excerpt: string; tags: string[]; category: string; author: string };
type ResultGroup = { label: string; posts: SearchablePost[] };

@Component({
  selector: 'app-search',
  template: `
    @if (isOpen()) {
      <div class="md3-search-overlay fixed inset-0 z-[100] bg-black/35 backdrop-blur-sm"
           [class.md3-search-overlay-exit]="isClosing()"
           (click)="close()"></div>
      <div class="md3-search-shell fixed inset-0 z-[101] flex items-start justify-center overflow-y-auto px-4 py-[10vh] sm:py-[14vh]"
           [class.md3-search-shell-exit]="isClosing()"
           (click)="close()">
        <div id="site-search-dialog"
             role="dialog"
             aria-modal="true"
             aria-labelledby="site-search-title"
             class="md3-search-dialog w-full max-w-2xl overflow-hidden rounded-[1.75rem] border border-border bg-popover text-popover-foreground shadow-[var(--md-sys-elevation-3)]"
             [class.md3-search-dialog-exit]="isClosing()"
             (click)="$event.stopPropagation()">
          <div class="border-b border-border bg-[color:var(--md-sys-color-surface-container-high)] px-4 py-3 sm:px-5">
            <div class="flex items-center gap-3">
              <span class="md3-search-icon-orb grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[color:var(--md-sys-color-primary-container)] text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
                </svg>
              </span>
              <div class="min-w-0 flex-1">
                <h2 id="site-search-title" class="text-sm font-bold text-foreground">Search CodersSecret</h2>
                <p class="text-xs text-muted-foreground">Find production guides, courses, security topics, and engineering references.</p>
              </div>
              <kbd class="hidden rounded-full border border-border bg-background px-2 py-1 text-[10px] font-bold text-muted-foreground sm:inline-flex">ESC</kbd>
            </div>
          </div>

          <div class="flex items-center border-b border-border px-4 sm:px-5">
            <input #searchInput
                   type="text"
                   aria-label="Search CodersSecret content"
                   autocomplete="off"
                   autocapitalize="off"
                   spellcheck="false"
                   placeholder="Search API security, Kubernetes, RAG, dbt..."
                   class="min-h-[56px] flex-1 bg-transparent text-base text-foreground placeholder:text-muted-foreground outline-none"
                   [value]="query()"
                   (input)="onSearch($event)"
                   (keydown.escape)="close()"
                   (keydown.enter)="navigateToFirst()"
                   (keydown.arrowDown)="moveSelection(1)"
                   (keydown.arrowUp)="moveSelection(-1)" />
          </div>

          <div class="max-h-[min(60vh,30rem)] overflow-y-auto p-3 sm:p-4">
            @if (query().length === 0) {
              <div class="rounded-[1.25rem] bg-[color:var(--md-sys-color-surface-container)] p-5">
                <p class="text-sm font-semibold text-foreground">Start with a production topic</p>
                <div class="mt-3 flex flex-wrap gap-2">
                  @for (topic of suggestedTopics; track topic) {
                    <button type="button"
                            (click)="query.set(topic)"
                            class="md3-chip hover:border-primary hover:text-primary">
                      {{ topic }}
                    </button>
                  }
                </div>
              </div>
            } @else if (results().length === 0) {
              <div class="rounded-[1.25rem] bg-[color:var(--md-sys-color-surface-container)] p-6 text-center">
                <p class="text-sm font-bold text-foreground">No results for "{{ query() }}"</p>
                <p class="mt-1 text-sm text-muted-foreground">Try a broader term like "security", "Kubernetes", "AI", or "data".</p>
              </div>
            } @else {
              <div class="space-y-4">
                @for (group of groupedResults(); track group.label) {
                  <section aria-label="Search results in {{ group.label }}">
                    <h3 class="mb-2 px-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">{{ group.label }}</h3>
                    <div class="space-y-1">
                      @for (post of group.posts; track post.id) {
                        <button (click)="navigateTo(post)"
                                type="button"
                                class="md3-search-result-item w-full rounded-[1.25rem] px-4 py-3 text-left transition-colors hover:bg-accent hover:text-accent-foreground"
                                [class.bg-accent]="isSelected(post)"
                                [class.text-accent-foreground]="isSelected(post)">
                          <div class="flex items-start justify-between gap-3">
                            <div class="min-w-0">
                              <div class="font-semibold text-foreground">{{ post.title }}</div>
                              <div class="mt-1 line-clamp-2 text-sm text-muted-foreground">{{ post.excerpt }}</div>
                            </div>
                            <span class="hidden shrink-0 rounded-full border border-border bg-background px-2 py-1 text-[10px] font-bold text-muted-foreground sm:inline-flex">
                              {{ categoryLabel(post.category) }}
                            </span>
                          </div>
                          <div class="mt-2 flex flex-wrap gap-1.5">
                            @for (tag of post.tags.slice(0, 4); track tag) {
                              <span class="md3-chip text-[10px]">{{ tag }}</span>
                            }
                          </div>
                        </button>
                      }
                    </div>
                  </section>
                }
              </div>
            }
          </div>
        </div>
      </div>
    }
  `,
})
export class SearchComponent {
  isOpen = signal(false);
  isClosing = signal(false);
  query = signal('');
  selectedIndex = signal(0);
  suggestedTopics = ['Kubernetes', 'SPIFFE', 'API Security', 'Production RAG', 'dbt', 'DevSecOps'];
  private posts = signal<SearchablePost[]>([]);
  private postsLoaded = false;
  private analytics = inject(AnalyticsService);
  private destroyRef = inject(DestroyRef);
  private closeTimer: number | undefined;
  private labels: Record<string, string> = {
    ai: 'AI',
    frontend: 'Frontend',
    backend: 'Backend',
    devops: 'DevOps',
    tutorials: 'Tutorials',
    'open-source': 'Open Source',
  };

  results = computed(() => {
    const q = this.query().toLowerCase().trim();
    if (!q) return [];
    return this.posts().filter(
      post =>
        post.title.toLowerCase().includes(q) ||
        post.excerpt.toLowerCase().includes(q) ||
        post.tags.some(tag => tag.toLowerCase().includes(q)) ||
        post.category.toLowerCase().includes(q) ||
        post.author.toLowerCase().includes(q)
    ).slice(0, 18);
  });

  groupedResults = computed<ResultGroup[]>(() => {
    const groups = new Map<string, SearchablePost[]>();
    for (const post of this.results()) {
      const label = this.categoryLabel(post.category);
      groups.set(label, [...(groups.get(label) ?? []), post]);
    }
    return [...groups.entries()].map(([label, posts]) => ({ label, posts }));
  });

  constructor(private router: Router) {
    this.destroyRef.onDestroy(() => {
      if (this.closeTimer !== undefined) {
        window.clearTimeout(this.closeTimer);
      }
    });
  }

  private async loadPosts() {
    if (this.postsLoaded) return;
    const { BLOG_POSTS } = await import('../../models/blog-post.model');
    this.posts.set(BLOG_POSTS.map(p => ({ id: p.id, title: p.title, slug: p.slug, excerpt: p.excerpt, tags: p.tags, category: p.category, author: p.author })));
    this.postsLoaded = true;
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboard(event: KeyboardEvent) {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      this.toggle();
    }
  }

  async toggle() {
    if (this.isOpen()) {
      this.close();
      return;
    }
    await this.open();
  }

  async open() {
    if (this.closeTimer !== undefined) {
      window.clearTimeout(this.closeTimer);
      this.closeTimer = undefined;
    }
    this.isClosing.set(false);
    this.isOpen.set(true);
    await this.prepareDialog();
  }

  close() {
    if (!this.isOpen() || this.isClosing()) return;
    this.isClosing.set(true);
    this.closeTimer = window.setTimeout(() => {
      this.closeImmediately();
    }, 160);
  }

  onSearch(event: Event) {
    this.query.set((event.target as HTMLInputElement).value);
    this.selectedIndex.set(0);
  }

  moveSelection(delta: number) {
    const max = this.results().length - 1;
    if (max < 0) return;
    const next = this.selectedIndex() + delta;
    this.selectedIndex.set(Math.max(0, Math.min(next, max)));
  }

  navigateToFirst() {
    const res = this.results();
    if (res.length > 0) {
      this.navigateTo(res[this.selectedIndex()]);
    }
  }

  navigateTo(post: SearchablePost) {
    this.analytics.trackSearch(this.query(), this.results().length);
    this.closeImmediately();
    this.router.navigate(['/blog', post.slug]);
  }

  isSelected(post: SearchablePost): boolean {
    return this.results()[this.selectedIndex()]?.id === post.id;
  }

  categoryLabel(category: string): string {
    return this.labels[category] ?? category;
  }

  private async prepareDialog() {
    this.query.set('');
    this.selectedIndex.set(0);
    await this.loadPosts();
    setTimeout(() => {
      const input = document.querySelector('app-search input') as HTMLInputElement;
      input?.focus();
    });
  }

  private closeImmediately() {
    if (this.closeTimer !== undefined) {
      window.clearTimeout(this.closeTimer);
      this.closeTimer = undefined;
    }
    this.isOpen.set(false);
    this.isClosing.set(false);
    this.query.set('');
  }
}
