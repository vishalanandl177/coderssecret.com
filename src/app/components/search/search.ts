import { Component, signal, computed, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { BLOG_POSTS, BlogPost } from '../../models/blog-post.model';

@Component({
  selector: 'app-search',
  template: `
    @if (isOpen()) {
      <div class="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm" (click)="close()"></div>
      <div class="fixed inset-x-0 top-0 z-[101] flex justify-center pt-[15vh]">
        <div class="w-full max-w-lg mx-4 rounded-lg border border-border bg-card shadow-2xl overflow-hidden"
             (click)="$event.stopPropagation()">
          <div class="flex items-center border-b border-border px-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                 class="shrink-0 text-muted-foreground">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
            </svg>
            <input #searchInput
                   type="text"
                   placeholder="Search blog posts..."
                   class="flex-1 bg-transparent px-3 py-4 text-sm text-foreground placeholder:text-muted-foreground outline-none"
                   [value]="query()"
                   (input)="onSearch($event)"
                   (keydown.escape)="close()"
                   (keydown.enter)="navigateToFirst()"
                   (keydown.arrowDown)="moveSelection(1)"
                   (keydown.arrowUp)="moveSelection(-1)" />
            <kbd class="hidden sm:inline-flex items-center rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
              ESC
            </kbd>
          </div>

          <div class="max-h-[300px] overflow-y-auto p-2">
            @if (query().length === 0) {
              <p class="px-3 py-6 text-center text-sm text-muted-foreground">
                Type to search across all blog posts...
              </p>
            } @else if (results().length === 0) {
              <p class="px-3 py-6 text-center text-sm text-muted-foreground">
                No posts found for "{{ query() }}"
              </p>
            } @else {
              @for (post of results(); track post.id; let i = $index) {
                <button (click)="navigateTo(post)"
                        class="w-full text-left rounded-md px-3 py-3 text-sm transition-colors hover:bg-accent"
                        [class.bg-accent]="i === selectedIndex()">
                  <div class="font-medium text-foreground">{{ post.title }}</div>
                  <div class="mt-1 text-xs text-muted-foreground line-clamp-1">{{ post.excerpt }}</div>
                  <div class="mt-1.5 flex flex-wrap gap-1">
                    @for (tag of post.tags.slice(0, 3); track tag) {
                      <span class="inline-flex items-center rounded bg-secondary px-1.5 py-0.5 text-[10px] font-medium text-secondary-foreground">
                        {{ tag }}
                      </span>
                    }
                  </div>
                </button>
              }
            }
          </div>
        </div>
      </div>
    }
  `,
})
export class SearchComponent {
  isOpen = signal(false);
  query = signal('');
  selectedIndex = signal(0);

  results = computed(() => {
    const q = this.query().toLowerCase().trim();
    if (!q) return [];
    return BLOG_POSTS.filter(
      post =>
        post.title.toLowerCase().includes(q) ||
        post.excerpt.toLowerCase().includes(q) ||
        post.tags.some(tag => tag.toLowerCase().includes(q)) ||
        post.category.toLowerCase().includes(q) ||
        post.author.toLowerCase().includes(q)
    );
  });

  constructor(private router: Router) {}

  @HostListener('document:keydown', ['$event'])
  handleKeyboard(event: KeyboardEvent) {
    if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
      event.preventDefault();
      this.toggle();
    }
  }

  toggle() {
    this.isOpen.set(!this.isOpen());
    if (this.isOpen()) {
      this.query.set('');
      this.selectedIndex.set(0);
      setTimeout(() => {
        const input = document.querySelector('app-search input') as HTMLInputElement;
        input?.focus();
      });
    }
  }

  open() {
    this.isOpen.set(true);
    this.query.set('');
    this.selectedIndex.set(0);
    setTimeout(() => {
      const input = document.querySelector('app-search input') as HTMLInputElement;
      input?.focus();
    });
  }

  close() {
    this.isOpen.set(false);
    this.query.set('');
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

  navigateTo(post: BlogPost) {
    this.close();
    this.router.navigate(['/blog', post.slug]);
  }
}
