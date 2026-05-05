import { Component, inject, DestroyRef, AfterViewChecked, OnDestroy, ElementRef, signal, HostListener } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BLOG_POSTS, CATEGORIES, BlogPost } from '../../models/blog-post.model';
import { SeoService } from '../../services/seo.service';
import { AnalyticsService } from '../../services/analytics.service';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-blog-post',
  imports: [RouterLink],
  template: `
    @if (post) {
      <!-- Reading progress bar -->
      <div class="fixed top-0 left-0 z-[60] h-[3px] bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 transition-all duration-150"
           [style.width.%]="readingProgress()"></div>

      <!-- Hero header -->
      <section class="relative overflow-hidden">
        <div class="absolute inset-0 -z-10">
          <div class="absolute top-[-30%] left-[20%] h-[400px] w-[400px] rounded-full blur-[120px] animate-blob"
               [style.background-color]="categoryColor + '12'"></div>
          <div class="absolute bottom-[-30%] right-[10%] h-[350px] w-[350px] rounded-full bg-purple-500/8 blur-[100px] animate-blob animation-delay-2000"></div>
        </div>

        <div class="container max-w-4xl mx-auto px-6 pt-12 pb-10 md:pt-16 md:pb-14">
          <!-- Breadcrumb navigation -->
          <nav aria-label="Breadcrumb" class="mb-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <ol class="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
              <li><a routerLink="/" class="hover:text-foreground transition-colors">Home</a></li>
              <li class="text-muted-foreground/50">/</li>
              <li><a routerLink="/blog" class="hover:text-foreground transition-colors">Blog</a></li>
              @if (categoryName) {
                <li class="text-muted-foreground/50">/</li>
                <li><a [routerLink]="['/category', post.category]" class="hover:text-foreground transition-colors">{{ categoryName }}</a></li>
              }
              <li class="text-muted-foreground/50">/</li>
              <li class="text-foreground font-medium truncate max-w-[200px]" aria-current="page">{{ post.title }}</li>
            </ol>
          </nav>

          <header class="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
            <!-- Meta row -->
            <div class="flex flex-wrap items-center gap-3 mb-6">
              @if (categoryName) {
                <a [routerLink]="['/category', post.category]"
                   class="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider transition-all duration-300 hover:shadow-md"
                   [style.background-color]="categoryColor + '15'"
                   [style.color]="categoryColor">
                  {{ categoryName }}
                </a>
              }
              <div class="flex items-center gap-2 text-sm text-muted-foreground">
                <time class="font-mono text-xs" [attr.datetime]="post.date">{{ post.date }}</time>
                <span class="h-1 w-1 rounded-full bg-muted-foreground/50"></span>
                <span>{{ post.readTime }}</span>
                <span class="h-1 w-1 rounded-full bg-muted-foreground/50"></span>
                <!-- Listen button -->
                <button (click)="toggleSpeech()"
                        class="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card/60 px-3 py-1 text-xs font-medium text-muted-foreground transition-all duration-200 hover:text-foreground hover:bg-accent hover:border-accent cursor-pointer"
                        [attr.aria-label]="isSpeaking() ? 'Pause reading' : 'Listen to article'">
                  @if (isSpeaking()) {
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                    Pause
                  } @else if (speechPaused()) {
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                    Resume
                  } @else {
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>
                    Listen
                  }
                </button>
                @if (isSpeaking() || speechPaused()) {
                  <button (click)="stopSpeech()"
                          class="inline-flex items-center gap-1 rounded-full border border-border/60 bg-card/60 px-2.5 py-1 text-xs text-muted-foreground transition-all duration-200 hover:text-foreground hover:bg-accent cursor-pointer"
                          aria-label="Stop reading">
                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><rect x="4" y="4" width="16" height="16" rx="2"/></svg>
                    Stop
                  </button>
                }
                <a [routerLink]="'/slides/' + post.slug"
                   class="inline-flex min-h-[44px] touch-manipulation items-center gap-1.5 rounded-full border border-green-500/40 bg-green-500/10 px-3 py-1 text-xs font-medium text-green-600 dark:text-green-400 transition-all duration-200 hover:bg-green-500/20 hover:border-green-500/60 cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                  Watch as Slides
                </a>
              </div>
            </div>

            <!-- Title -->
            <h1 class="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.1]">
              {{ post.title }}
            </h1>

            <!-- Author + tags -->
            <div class="mt-6 flex flex-col sm:flex-row sm:items-center gap-4">
              <div class="flex items-center gap-3">
                <div class="flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 text-white text-sm font-bold">
                  {{ post.author.charAt(0) }}
                </div>
                <div>
                  <div class="text-sm font-semibold">{{ post.author }}</div>
                  <div class="text-xs text-muted-foreground">Author</div>
                </div>
              </div>

              <div class="sm:ml-auto flex flex-wrap gap-1.5">
                @for (tag of post.tags; track tag) {
                  <a [routerLink]="['/blog']" [queryParams]="{tag: tag}"
                     class="inline-flex items-center rounded-full border border-border/40 bg-muted/50 px-3 py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground hover:border-primary cursor-pointer">
                    {{ tag }}
                  </a>
                }
              </div>
            </div>
          </header>
        </div>
      </section>

      <!-- Banner image -->
      <div class="container max-w-4xl mx-auto px-6 mt-6 md:mt-8">
        <img [src]="'/images/banners/' + post.slug + '.svg'"
             [alt]="post.title"
             width="1200" height="480"
             class="w-full rounded-2xl border border-border/40 shadow-lg animate-in fade-in zoom-in-95 duration-700"
             loading="eager"
             decoding="async" />
      </div>

      <!-- Divider -->
      <div class="container max-w-4xl mx-auto px-6 mt-8">
        <div class="h-[1px] bg-gradient-to-r from-transparent via-border to-transparent"></div>
      </div>

      <!-- Article + Right-side TOC layout -->
      <div class="container max-w-6xl mx-auto px-6">
        <div class="flex gap-10">

          <!-- Article content (left) -->
          <article class="flex-1 min-w-0 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            <div class="max-w-3xl mx-auto py-12 md:py-16">
              <div class="prose prose-neutral max-w-none
                          [&>p]:text-foreground [&>p]:leading-[1.8] [&>p]:mb-6 [&>p]:text-[15px]
                          [&>h2]:text-2xl [&>h2]:font-extrabold [&>h2]:tracking-tight [&>h2]:mt-14 [&>h2]:mb-5 [&>h2]:text-foreground
                          [&>ul]:text-foreground [&>ul]:mb-6 [&>ul]:ml-6 [&>ul]:list-disc [&>ul>li]:mb-2.5 [&>ul>li]:leading-[1.7] [&>ul>li]:text-[15px]
                          [&>ol]:text-foreground [&>ol]:mb-6 [&>ol]:ml-6 [&>ol]:list-decimal [&>ol>li]:mb-2.5
                          [&>pre]:bg-muted [&>pre]:rounded-xl [&>pre]:p-5 [&>pre]:mb-6 [&>pre]:overflow-x-auto [&>pre]:text-sm [&>pre]:border [&>pre]:border-border/40
                          [&>code]:bg-muted [&>code]:px-1.5 [&>code]:py-0.5 [&>code]:rounded-md [&>code]:text-sm [&>code]:font-mono
                          [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded-md [&_code]:text-sm [&_code]:font-mono
                          [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4 [&_a:hover]:text-primary/80
                          [&>pre_code]:bg-transparent [&>pre_code]:p-0
                          [&>img]:rounded-xl [&>img]:border [&>img]:border-border/40 [&>img]:my-8 [&>img]:w-full [&>img]:shadow-md"
                   [innerHTML]="post.content">
              </div>
            </div>
          </article>

          <!-- Right-side TOC (desktop only, sticky) -->
          @if (toc.length > 2) {
            <nav class="hidden xl:block w-64 flex-shrink-0 animate-in fade-in duration-500 delay-300"
                 aria-label="On this page">
              <div class="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto py-12">
                <h3 class="text-xs font-bold text-foreground uppercase tracking-wider mb-4 px-1">On this page</h3>
                <ul class="space-y-0.5 border-l-2 border-border/40">
                  @for (item of toc; track item.id) {
                    <li>
                      <button (click)="scrollToHeading(item.id)"
                         class="block w-full text-left px-4 py-1.5 text-[13px] leading-snug text-muted-foreground transition-colors hover:text-foreground hover:border-l-primary border-l-2 border-transparent -ml-[2px] cursor-pointer">
                        {{ item.text }}
                      </button>
                    </li>
                  }
                </ul>
              </div>
            </nav>
          }
        </div>
      </div>

      <!-- Share + related -->
      <div class="container max-w-4xl mx-auto px-6 pb-20">
        <div class="h-[1px] bg-gradient-to-r from-transparent via-border to-transparent mb-12"></div>

        <!-- Share buttons -->
        <div class="flex items-center gap-4 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <span class="text-sm font-semibold text-muted-foreground">Share this article</span>
          <div class="flex gap-2">
            <a [href]="'https://twitter.com/intent/tweet?text=' + encodeURIComponent(post.title) + '&url=' + encodeURIComponent('https://coderssecret.com/blog/' + post.slug)"
               target="_blank" rel="noopener noreferrer"
               class="inline-flex h-11 w-11 touch-manipulation items-center justify-center rounded-full border border-border/60 bg-card/60 text-muted-foreground transition-all duration-300 hover:bg-accent hover:text-foreground hover:border-accent"
               aria-label="Share on X (Twitter)">
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a [href]="'https://www.linkedin.com/sharing/share-offsite/?url=' + encodeURIComponent('https://coderssecret.com/blog/' + post.slug)"
               target="_blank" rel="noopener noreferrer"
               class="inline-flex h-11 w-11 touch-manipulation items-center justify-center rounded-full border border-border/60 bg-card/60 text-muted-foreground transition-all duration-300 hover:bg-accent hover:text-foreground hover:border-accent"
               aria-label="Share on LinkedIn">
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </a>
            <button (click)="copyLink()"
                    class="inline-flex h-11 w-11 touch-manipulation items-center justify-center rounded-full border border-border/60 bg-card/60 text-muted-foreground transition-all duration-300 hover:bg-accent hover:text-foreground hover:border-accent"
                    [attr.aria-label]="linkCopied() ? 'Link copied!' : 'Copy link'">
              @if (linkCopied()) {
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              } @else {
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
              }
            </button>
          </div>
        </div>

        <!-- Consultation CTA -->
        <div class="mb-16 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-card to-primary/5 p-6 md:p-8 animate-in fade-in duration-700">
          <div class="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <div class="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
            </div>
            <div class="flex-1">
              <h3 class="font-bold mb-1">Stuck on implementation?</h3>
              <p class="text-sm text-muted-foreground">Get private, 1-on-1 help with system design, performance, scaling, or any technical challenge.</p>
            </div>
            <a routerLink="/consultation"
               class="inline-flex min-h-[44px] touch-manipulation items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-0.5 transition-all flex-shrink-0">
              Book a Session
            </a>
          </div>
        </div>

        <!-- Comments (Giscus) -->
        <div class="mb-16 animate-in fade-in duration-700">
          <h2 class="text-2xl font-extrabold tracking-tight mb-6">Discussion</h2>
          <p class="text-sm text-muted-foreground mb-6">
            Comments are powered by <a href="https://giscus.app" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">Giscus</a> and GitHub Discussions. You'll need a GitHub account to comment.
          </p>
          <div #giscus class="giscus-container"></div>
        </div>

        <!-- Related posts -->
        @if (relatedPosts.length > 0) {
          <div class="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h2 class="text-2xl font-extrabold tracking-tight mb-8">Continue Reading</h2>
            <div class="grid gap-5 md:grid-cols-2">
              @for (related of relatedPosts; track related.id) {
                <a [routerLink]="['/blog', related.slug]"
                   class="group relative rounded-2xl border border-border/60 bg-card overflow-hidden transition-all duration-500 hover:shadow-xl hover:-translate-y-1 hover:border-primary/20">
                  <!-- Top accent -->
                  <div class="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                       [style.background-image]="'linear-gradient(to right, transparent, ' + getCategoryColor(related.category) + ', transparent)'"></div>

                  <div class="p-6 md:p-8">
                    <div class="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                      <span class="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                            [style.background-color]="getCategoryColor(related.category) + '15'"
                            [style.color]="getCategoryColor(related.category)">
                        {{ getCategoryName(related.category) }}
                      </span>
                      <time class="font-mono" [attr.datetime]="related.date">{{ related.date }}</time>
                      <span class="h-1 w-1 rounded-full bg-muted-foreground/50"></span>
                      <span>{{ related.readTime }}</span>
                    </div>
                    <h3 class="text-lg font-bold tracking-tight leading-snug transition-colors duration-300 group-hover:text-primary">
                      {{ related.title }}
                    </h3>
                    <p class="mt-2 text-sm text-muted-foreground line-clamp-2">{{ related.excerpt }}</p>

                    <div class="mt-5 flex items-center justify-between">
                      <div class="flex flex-wrap gap-1.5">
                        @for (tag of related.tags.slice(0, 2); track tag) {
                          <span class="inline-flex items-center rounded-full border border-border/40 bg-muted/50 px-2.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                            {{ tag }}
                          </span>
                        }
                      </div>
                      <div class="shrink-0 inline-flex items-center justify-center rounded-full h-8 w-8 bg-muted/50 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                             stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M7 17 17 7"/><path d="M7 7h10v10"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                </a>
              }
            </div>
          </div>
        }
      </div>
    } @else {
      <!-- 404 state -->
      <div class="py-32 text-center animate-in fade-in duration-500">
        <div class="container max-w-4xl mx-auto px-6">
          <div class="inline-flex items-center justify-center h-20 w-20 rounded-3xl bg-muted/50 mb-8">
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-muted-foreground">
              <circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/>
            </svg>
          </div>
          <h1 class="text-3xl font-extrabold mb-3">Post not found</h1>
          <p class="text-muted-foreground text-lg mb-8">The blog post you're looking for doesn't exist or has been moved.</p>
          <a routerLink="/blog"
             class="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.97]">
            Browse all posts
          </a>
        </div>
      </div>
    }
  `,
})
export class BlogPostComponent implements AfterViewChecked, OnDestroy {
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);
  private seo = inject(SeoService);
  private el = inject(ElementRef);
  private doc = inject(DOCUMENT);
  private analytics = inject(AnalyticsService);
  private copyButtonsAdded = false;
  private imagesProcessed = false;
  private giscusAdded = false;
  private scrollMilestones = new Set<number>();
  readingProgress = signal(0);
  linkCopied = signal(false);
  isSpeaking = signal(false);
  speechPaused = signal(false);
  encodeURIComponent = encodeURIComponent;
  post: BlogPost | undefined;
  relatedPosts: BlogPost[] = [];
  toc: { id: string; text: string }[] = [];
  categoryName = '';
  categoryColor = '#6b7280';

  constructor() {
    this.route.paramMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(async params => {
        const slug = params.get('slug');
        this.post = BLOG_POSTS.find(p => p.slug === slug);
        if (this.post) {
          // Dynamically load content for this specific post
          try {
            const contentModule = await import(`../../models/blog-content/${slug}.ts`);
            this.post = { ...this.post, content: contentModule.CONTENT };
          } catch {
            // Content not found — post.content stays empty
          }
          const cat = CATEGORIES.find(c => c.slug === this.post!.category);
          this.categoryName = cat?.name ?? '';
          this.categoryColor = this.getCategoryColor(this.post.category);
          this.relatedPosts = BLOG_POSTS
            .filter(p => p.id !== this.post!.id && (p.category === this.post!.category || p.tags.some(t => this.post!.tags.includes(t))))
            .slice(0, 2);
          this.copyButtonsAdded = false;
          this.imagesProcessed = false;
          this.giscusAdded = false;
          this.scrollMilestones.clear();
          this.stopSpeech();
          // Generate TOC from h2 tags in content
          const h2Regex = /<h2>(.*?)<\/h2>/g;
          this.toc = [];
          let tocMatch;
          let tocIndex = 0;
          while ((tocMatch = h2Regex.exec(this.post.content)) !== null) {
            const text = tocMatch[1].replace(/<[^>]+>/g, '');
            this.toc.push({ id: `heading-${tocIndex++}`, text });
          }
          this.seo.update({
            title: this.getSeoTitle(this.post.title),
            description: this.post.excerpt,
            url: `/blog/${this.post.slug}`,
            type: 'article',
            image: `https://coderssecret.com/images/banners/${this.post.slug}.svg`,
            article: {
              author: this.post.author,
              publishedTime: this.post.date,
              tags: this.post.tags,
              section: this.categoryName,
            },
            breadcrumbs: [
              { name: 'Home', url: '/' },
              { name: 'Blog', url: '/blog' },
              ...(this.categoryName ? [{ name: this.categoryName, url: `/category/${this.post.category}` }] : []),
              { name: this.post.title, url: `/blog/${this.post.slug}` },
            ],
          });
        } else {
          this.relatedPosts = [];
          this.categoryName = '';
          this.categoryColor = '#6b7280';
        }
      });
  }

  @HostListener('window:scroll')
  onScroll() {
    const el = this.doc.documentElement;
    const scrollTop = el.scrollTop || this.doc.body.scrollTop;
    const scrollHeight = el.scrollHeight - el.clientHeight;
    const progress = scrollHeight > 0 ? Math.min((scrollTop / scrollHeight) * 100, 100) : 0;
    this.readingProgress.set(progress);
    // Track scroll depth milestones
    if (this.post) {
      for (const milestone of [25, 50, 75, 100]) {
        if (progress >= milestone && !this.scrollMilestones.has(milestone)) {
          this.scrollMilestones.add(milestone);
          this.analytics.trackScrollDepth(milestone, this.post.slug);
        }
      }
    }
  }

  ngOnDestroy() {
    this.readingProgress.set(0);
    this.stopSpeech();
  }

  ngAfterViewChecked() {
    // Load Giscus comments
    if (this.post && !this.giscusAdded) {
      const container = this.el.nativeElement.querySelector('.giscus-container');
      if (container) {
        this.giscusAdded = true;
        // Clear any existing Giscus iframe (for navigation between posts)
        container.innerHTML = '';
        const script = document.createElement('script');
        script.src = 'https://giscus.app/client.js';
        script.setAttribute('data-repo', 'vishalanandl177/coderssecret.com');
        script.setAttribute('data-repo-id', 'R_kgDOR5J1Dw');
        script.setAttribute('data-category', 'General');
        script.setAttribute('data-category-id', 'DIC_kwDOR5J1D84C62V5');
        script.setAttribute('data-mapping', 'title');
        script.setAttribute('data-strict', '1');
        script.setAttribute('data-reactions-enabled', '1');
        script.setAttribute('data-emit-metadata', '1');
        script.setAttribute('data-input-position', 'bottom');
        script.setAttribute('data-theme', 'preferred_color_scheme');
        script.setAttribute('data-lang', 'en');
        script.setAttribute('data-loading', 'lazy');
        script.setAttribute('crossorigin', 'anonymous');
        script.async = true;
        container.appendChild(script);
      }
    }
    if (this.post && !this.imagesProcessed) {
      const images = this.el.nativeElement.querySelectorAll('article img');
      if (images.length > 0) {
        this.imagesProcessed = true;
        images.forEach((img: HTMLImageElement) => {
          const knownSize = this.getKnownImageSize(img.getAttribute('src') ?? '');
          if (knownSize && !img.hasAttribute('width') && !img.hasAttribute('height')) {
            img.setAttribute('width', String(knownSize.width));
            img.setAttribute('height', String(knownSize.height));
          }
          img.setAttribute('loading', 'lazy');
          img.setAttribute('decoding', 'async');
        });
      }
    }
    if (this.post && !this.copyButtonsAdded) {
      const preBlocks = this.el.nativeElement.querySelectorAll('pre');
      const h2s = this.el.nativeElement.querySelectorAll('article h2');
      if (h2s.length > 0) {
        h2s.forEach((h2: HTMLElement, i: number) => {
          if (!h2.id) h2.id = `heading-${i}`;
        });
      }
      if (preBlocks.length > 0) {
        this.copyButtonsAdded = true;
        preBlocks.forEach((pre: HTMLElement) => {
          if (pre.querySelector('.copy-btn')) return;
          pre.style.position = 'relative';
          const btn = document.createElement('button');
          btn.className = 'copy-btn';
          btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`;
          btn.title = 'Copy code';
          btn.addEventListener('click', () => {
            const code = pre.querySelector('code')?.textContent ?? pre.textContent ?? '';
            navigator.clipboard.writeText(code).then(() => {
              btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
              setTimeout(() => {
                btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`;
              }, 2000);
            });
          });
          pre.appendChild(btn);
        });
      }
    }
  }

  toggleSpeech() {
    if (typeof speechSynthesis === 'undefined') return;

    if (this.isSpeaking()) {
      speechSynthesis.pause();
      this.isSpeaking.set(false);
      this.speechPaused.set(true);
      return;
    }

    if (this.speechPaused()) {
      speechSynthesis.resume();
      this.isSpeaking.set(true);
      this.speechPaused.set(false);
      return;
    }

    // Start fresh — extract text from article content
    const article = this.el.nativeElement.querySelector('article');
    if (!article) return;

    // Get clean text: strip code blocks, get readable content
    const clone = article.cloneNode(true) as HTMLElement;
    clone.querySelectorAll('pre, code, .flow-diagram, .copy-btn, svg').forEach((el: Element) => el.remove());
    const text = clone.textContent?.replace(/\s+/g, ' ').trim() || '';

    if (!text) return;

    // Cancel any existing speech
    speechSynthesis.cancel();

    // Split into chunks (browsers have a ~5000 char limit per utterance)
    const chunks = this.splitText(text, 4000);
    let currentChunk = 0;

    const speakNext = () => {
      if (currentChunk >= chunks.length) {
        this.isSpeaking.set(false);
        this.speechPaused.set(false);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(chunks[currentChunk]);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.lang = 'en-US';

      // Try to use a natural-sounding voice
      const voices = speechSynthesis.getVoices();
      const preferred = voices.find(v => v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha'));
      if (preferred) utterance.voice = preferred;

      utterance.onend = () => {
        currentChunk++;
        speakNext();
      };

      utterance.onerror = () => {
        this.isSpeaking.set(false);
        this.speechPaused.set(false);
      };

      speechSynthesis.speak(utterance);
    };

    this.isSpeaking.set(true);
    this.speechPaused.set(false);
    speakNext();
  }

  stopSpeech() {
    if (typeof speechSynthesis === 'undefined') return;
    speechSynthesis.cancel();
    this.isSpeaking.set(false);
    this.speechPaused.set(false);
  }

  private splitText(text: string, maxLength: number): string[] {
    const chunks: string[] = [];
    let remaining = text;
    while (remaining.length > 0) {
      if (remaining.length <= maxLength) {
        chunks.push(remaining);
        break;
      }
      // Find a good break point (period, question mark, exclamation)
      let breakAt = remaining.lastIndexOf('. ', maxLength);
      if (breakAt < maxLength * 0.5) breakAt = remaining.lastIndexOf(' ', maxLength);
      if (breakAt < 0) breakAt = maxLength;
      chunks.push(remaining.substring(0, breakAt + 1));
      remaining = remaining.substring(breakAt + 1).trim();
    }
    return chunks;
  }

  scrollToHeading(id: string) {
    const el = this.doc.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  copyLink() {
    if (this.post) {
      navigator.clipboard.writeText(`https://coderssecret.com/blog/${this.post.slug}`).then(() => {
        this.linkCopied.set(true);
        setTimeout(() => this.linkCopied.set(false), 2000);
      });
    }
  }

  getCategoryColor(slug: string): string {
    const colors: Record<string, string> = {
      frontend: '#3b82f6', backend: '#22c55e', devops: '#f97316',
      tutorials: '#a855f7', 'open-source': '#ec4899',
    };
    return colors[slug] ?? '#6b7280';
  }

  getCategoryName(slug: string): string {
    const cat = CATEGORIES.find(c => c.slug === slug);
    return cat?.name ?? slug;
  }

  private getSeoTitle(title: string): string {
    return this.compactSeoTitle(title, 55);
  }

  private compactSeoTitle(title: string, maxLength: number): string {
    const normalized = title.replace(/\s+/g, ' ').trim();
    if (normalized.length <= maxLength) return normalized;

    const separators = [': ', ' - ', ' | '];
    for (const separator of separators) {
      const parts = normalized.split(separator);
      if (parts.length < 2) continue;

      let candidate = parts[0];
      for (let i = 1; i < parts.length; i++) {
        const next = `${candidate}${separator}${parts[i]}`;
        if (next.length > maxLength) break;
        candidate = next;
      }

      if (candidate.length >= 28) return candidate;
      const guided = `${candidate} Guide`;
      return guided.length <= maxLength ? guided : candidate;
    }

    return this.trimAtWord(normalized, maxLength);
  }

  private trimAtWord(text: string, maxLength: number): string {
    const clipped = text.slice(0, maxLength);
    const lastSpace = clipped.lastIndexOf(' ');
    return clipped.slice(0, lastSpace > 30 ? lastSpace : clipped.length).trim();
  }

  private getKnownImageSize(src: string): { width: number; height: number } | undefined {
    const sizes: Record<string, { width: number; height: number }> = {
      '/images/drf-api-logger/01-admin-dashboard.png': { width: 2880, height: 1800 },
      '/images/drf-api-logger/02-api-logs-list.png': { width: 2880, height: 4478 },
      '/images/drf-api-logger/03-api-log-detail-slow-sql.png': { width: 2880, height: 3180 },
      '/images/drf-api-logger/04-api-log-detail-login-masked.png': { width: 2880, height: 3182 },
      '/images/drf-api-logger/05-api-log-detail-n-plus-one.png': { width: 2880, height: 3316 },
      '/images/drf-api-logger/06-api-log-detail-echo-masked.png': { width: 2880, height: 2344 },
    };
    return sizes[src];
  }
}
