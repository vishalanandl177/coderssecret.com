import { Component, inject, DestroyRef, AfterViewChecked, OnDestroy, ElementRef, signal, HostListener, ChangeDetectorRef, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BLOG_POSTS, CATEGORIES, BlogPost } from '../../models/blog-post.model';
import { SeoService } from '../../services/seo.service';
import { AnalyticsService } from '../../services/analytics.service';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { getActiveTocHeadingId } from '../../shared/blog-toc';
import { md3CategoryAccent } from '../../shared/md3/md3-color-roles';

@Component({
  selector: 'app-blog-post',
  imports: [RouterLink],
  template: `
    @if (post) {
      <!-- Reading progress bar -->
      <div class="md3-article-progress fixed top-0 left-0 z-[60] h-[3px] transition-all duration-150"
           [style.width.%]="readingProgress()"></div>

      <!-- Hero header -->
      <section id="article-start" class="md3-article-hero md3-page-hero relative overflow-hidden">
        <div class="absolute inset-0 -z-10">
          <div class="absolute top-[-30%] left-[20%] h-[400px] w-[400px] rounded-full blur-[120px] animate-blob"
               aria-hidden="true"></div>
          <div class="absolute bottom-[-30%] right-[10%] h-[350px] w-[350px] rounded-full blur-[100px] animate-blob animation-delay-2000"
               style="background: color-mix(in srgb, var(--md-sys-color-primary) 8%, transparent)"></div>
        </div>

        <div class="md3-article-hero-inner container max-w-4xl mx-auto px-6 pt-12 pb-10 md:pt-16 md:pb-14">
          <!-- Breadcrumb navigation -->
          <nav aria-label="Breadcrumb" class="md3-article-breadcrumb mb-6">
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

          <header class="md3-article-header">
            <!-- Meta row -->
            <div class="md3-article-meta-row flex flex-wrap items-center gap-3 mb-6">
              @if (categoryName) {
                <a [routerLink]="['/category', post.category]"
                   class="md3-article-category-pill inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider transition-all duration-300 hover:shadow-md">
                  {{ categoryName }}
                </a>
              }
              <div class="md3-article-meta-tools flex items-center gap-2 text-sm text-muted-foreground">
                <time class="font-mono text-xs" [attr.datetime]="post.date">{{ post.date }}</time>
                <span class="h-1 w-1 rounded-full bg-muted-foreground/50"></span>
                <span>{{ post.readTime }}</span>
                <span class="h-1 w-1 rounded-full bg-muted-foreground/50"></span>
                <!-- Listen button -->
                <button (click)="toggleSpeech()"
                        class="md3-article-tool-button inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card/60 px-3 py-1 text-xs font-medium text-muted-foreground transition-all duration-200 hover:text-foreground hover:bg-accent hover:border-accent cursor-pointer"
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
                          class="md3-article-tool-button inline-flex items-center gap-1 rounded-full border border-border/60 bg-card/60 px-2.5 py-1 text-xs text-muted-foreground transition-all duration-200 hover:text-foreground hover:bg-accent cursor-pointer"
                          aria-label="Stop reading">
                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><rect x="4" y="4" width="16" height="16" rx="2"/></svg>
                    Stop
                  </button>
                }
                <a [routerLink]="'/slides/' + post.slug"
                   class="md3-article-slide-button inline-flex min-h-[44px] touch-manipulation items-center gap-1.5 rounded-full border border-green-500/40 bg-green-500/10 px-3 py-1 text-xs font-medium text-green-600 dark:text-green-400 transition-all duration-200 hover:bg-green-500/20 hover:border-green-500/60 cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                  Watch as Slides
                </a>
              </div>
            </div>

            <!-- Title -->
            <h1 class="md3-article-title text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.1]">
              {{ post.title }}
            </h1>
            <p class="md3-article-dek mt-5 max-w-3xl text-lg leading-8 text-muted-foreground">
              {{ post.excerpt }}
            </p>

            <!-- Author + tags -->
            <div class="md3-article-author-row mt-6 flex flex-col sm:flex-row sm:items-center gap-4">
              <div class="md3-article-author flex items-center gap-3">
                <div class="md3-article-avatar flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 text-white text-sm font-bold">
                  {{ post.author.charAt(0) }}
                </div>
                <div>
                  <div class="text-sm font-semibold">{{ post.author }}</div>
                  <div class="text-xs text-muted-foreground">Author</div>
                </div>
              </div>

              <div class="md3-article-tag-list sm:ml-auto flex flex-wrap gap-1.5">
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
      <div class="md3-article-banner-wrap container max-w-4xl mx-auto px-6 mt-6 md:mt-8">
        @if (bannerImageFor(post); as bannerImage) {
          <img [src]="bannerImage"
               [alt]="post.title + ' illustration'"
               width="1200" height="480"
               class="md3-article-banner w-full rounded-2xl border border-border/40 shadow-lg"
               loading="eager"
               fetchpriority="high"
               decoding="async" />
        } @else {
          <div class="md3-article-banner md3-article-banner-fallback" aria-hidden="true">
            <div class="md3-article-fallback-copy">
              <span>{{ categoryName || 'Guide' }}</span>
              <strong>{{ post.tags[0] || 'Production guide' }}</strong>
              <small>CodersSecret production field guide</small>
            </div>
            <div class="md3-article-fallback-map">
              <div class="md3-article-fallback-node node-primary">
                <span>01</span>
                <p>Design</p>
              </div>
              <div class="md3-article-fallback-node node-secondary">
                <span>02</span>
                <p>Build</p>
              </div>
              <div class="md3-article-fallback-node node-tertiary">
                <span>03</span>
                <p>Operate</p>
              </div>
            </div>
          </div>
        }
      </div>

      <!-- Divider -->
      <div class="md3-article-divider-wrap container max-w-4xl mx-auto px-6 mt-8">
        <div class="md3-article-divider h-[1px] bg-gradient-to-r from-transparent via-border to-transparent"></div>
      </div>

      @if (post.content && toc.length > 1) {
        <details class="md3-article-toc-mobile xl:hidden mx-6 mt-6">
          <summary [attr.aria-label]="'On this page, ' + toc.length + ' sections'">
            <span>On this page</span>
            <span>{{ toc.length }} sections</span>
          </summary>
          <nav aria-label="On this page">
            <a href="#article-start"
               class="md3-article-toc-overview md3-article-toc-overview-mobile"
               [attr.aria-current]="activeTocId() === 'article-start' ? 'location' : null"
               [class.md3-article-toc-link-active]="activeTocId() === 'article-start'"
               (click)="scrollToHeading($event, 'article-start')">
              {{ post.title }}
            </a>
            <ul>
              @for (item of toc; track item.id) {
                <li>
                  <a [href]="'#' + item.id"
                     class="md3-article-toc-link"
                     [class.md3-article-toc-link-nested]="item.level === 3"
                     [attr.aria-current]="activeTocId() === item.id ? 'location' : null"
                     [class.md3-article-toc-link-active]="activeTocId() === item.id"
                     (click)="scrollToHeading($event, item.id)">
                    {{ item.text }}
                  </a>
                </li>
              }
            </ul>
          </nav>
        </details>
      }

      <!-- Article + Right-side TOC layout -->
      <div class="md3-article-layout container max-w-6xl mx-auto px-6">
        <div class="md3-article-layout-grid flex gap-10">

          @if (post.content) {
            <!-- Article content (left) -->
            <article class="md3-article-shell flex-1 min-w-0">
              <div class="md3-article-content-surface max-w-3xl mx-auto py-12 md:py-16">
                <div class="md3-article-content prose prose-neutral max-w-none
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
          } @else {
            <article class="md3-article-shell flex-1 min-w-0" aria-busy="true" aria-label="Loading article">
              <div class="md3-article-content-surface max-w-3xl mx-auto py-12 md:py-16">
                <div class="space-y-5">
                  <div class="h-4 w-full rounded bg-muted/70 animate-pulse"></div>
                  <div class="h-4 w-11/12 rounded bg-muted/70 animate-pulse"></div>
                  <div class="h-4 w-10/12 rounded bg-muted/70 animate-pulse"></div>
                  <div class="h-48 rounded-xl border border-border/40 bg-muted/40 animate-pulse"></div>
                  <div class="h-4 w-full rounded bg-muted/70 animate-pulse"></div>
                  <div class="h-4 w-9/12 rounded bg-muted/70 animate-pulse"></div>
                </div>
              </div>
            </article>
          }

          <!-- Right-side TOC (desktop only, sticky) -->
          @if (post.content && toc.length > 2) {
            <nav class="md3-article-toc hidden xl:block flex-shrink-0"
                 aria-label="On this page">
              <div class="md3-article-toc-panel sticky top-20">
                <div class="md3-article-toc-kicker">On this page</div>
                <a href="#article-start"
                   class="md3-article-toc-overview"
                   [attr.title]="post.title"
                   [attr.aria-current]="activeTocId() === 'article-start' ? 'location' : null"
                   (click)="scrollToHeading($event, 'article-start')">
                  {{ desktopTocTitle }}
                </a>
                <ul class="md3-article-toc-list">
                  <li class="md3-article-toc-indicator"
                      aria-hidden="true"
                      [style.transform]="'translate3d(0, ' + tocIndicatorTop() + 'px, 0)'"
                      [style.height.px]="tocIndicatorHeight()"
                      [style.opacity]="tocIndicatorOpacity()"></li>
                  @for (item of desktopToc; track item.id) {
                    <li>
                      <a [href]="'#' + item.id"
                         (click)="scrollToHeading($event, item.id)"
                         class="md3-article-toc-link block w-full text-left px-4 py-1.5 text-[13px] leading-snug text-muted-foreground transition-colors hover:text-foreground hover:border-l-primary border-l-2 border-transparent -ml-[2px] cursor-pointer"
                         [class.md3-article-toc-link-nested]="item.level === 3"
                         [attr.aria-current]="isDesktopTocItemActive(item) ? 'location' : null"
                         [class.font-semibold]="isDesktopTocItemActive(item)"
                         [class.md3-article-toc-link-active]="isDesktopTocItemActive(item)">
                        {{ item.text }}
                      </a>
                    </li>
                  }
                </ul>
                <div class="md3-article-toc-share" aria-label="Share article">
                  <span>Share on</span>
                  <div>
                    <a [href]="'https://twitter.com/intent/tweet?text=' + encodeURIComponent(post.title) + '&url=' + encodeURIComponent('https://coderssecret.com/blog/' + post.slug)"
                       target="_blank"
                       rel="noopener noreferrer"
                       aria-label="Share on X">X</a>
                    <a [href]="'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent('https://coderssecret.com/blog/' + post.slug)"
                       target="_blank"
                       rel="noopener noreferrer"
                       aria-label="Share on Facebook">f</a>
                    <a [href]="'https://www.linkedin.com/sharing/share-offsite/?url=' + encodeURIComponent('https://coderssecret.com/blog/' + post.slug)"
                       target="_blank"
                       rel="noopener noreferrer"
                       aria-label="Share on LinkedIn">in</a>
                  </div>
                </div>
              </div>
            </nav>
          }
        </div>
      </div>

      @if (post.content) {
      <!-- Share + related -->
      <div class="md3-article-after container max-w-4xl mx-auto px-6 pb-20">
        <div class="md3-article-divider h-[1px] bg-gradient-to-r from-transparent via-border to-transparent mb-12"></div>

        <!-- Share buttons -->
        <div class="md3-article-share flex items-center gap-4 mb-12">
          <span class="md3-article-share-label text-sm font-semibold text-muted-foreground">Share this article</span>
          <div class="flex gap-2">
            <a [href]="'https://twitter.com/intent/tweet?text=' + encodeURIComponent(post.title) + '&url=' + encodeURIComponent('https://coderssecret.com/blog/' + post.slug)"
               target="_blank" rel="noopener noreferrer"
               class="md3-article-icon-button inline-flex h-11 w-11 touch-manipulation items-center justify-center rounded-full border border-border/60 bg-card/60 text-muted-foreground transition-all duration-300 hover:bg-accent hover:text-foreground hover:border-accent"
               aria-label="Share on X (Twitter)">
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a [href]="'https://www.linkedin.com/sharing/share-offsite/?url=' + encodeURIComponent('https://coderssecret.com/blog/' + post.slug)"
               target="_blank" rel="noopener noreferrer"
               class="md3-article-icon-button inline-flex h-11 w-11 touch-manipulation items-center justify-center rounded-full border border-border/60 bg-card/60 text-muted-foreground transition-all duration-300 hover:bg-accent hover:text-foreground hover:border-accent"
               aria-label="Share on LinkedIn">
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </a>
            <button (click)="copyLink()"
                    class="md3-article-icon-button inline-flex h-11 w-11 touch-manipulation items-center justify-center rounded-full border border-border/60 bg-card/60 text-muted-foreground transition-all duration-300 hover:bg-accent hover:text-foreground hover:border-accent"
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
        <div class="md3-article-consultation mb-16 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-card to-primary/5 p-6 md:p-8">
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

        <div class="md3-article-resources mb-16">
          <h2 class="mb-6 text-2xl font-extrabold tracking-tight">Related Production Resources</h2>
          <div class="md3-article-resource-grid grid gap-4 md:grid-cols-4">
            <a routerLink="/courses" class="md3-card md3-article-resource-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary">
              <span class="md3-chip-selected">Course</span>
              <h3 class="mt-4 text-base font-bold text-foreground">Free learning tracks</h3>
              <p class="mt-2 text-sm leading-6 text-muted-foreground">Turn this guide into a structured production engineering path.</p>
            </a>
            <a routerLink="/games" class="md3-card md3-article-resource-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary">
              <span class="md3-chip">Lab</span>
              <h3 class="mt-4 text-base font-bold text-foreground">Interactive engineering labs</h3>
              <p class="mt-2 text-sm leading-6 text-muted-foreground">Practice the same ideas through scenario-based simulators.</p>
            </a>
            <a routerLink="/cheatsheets" class="md3-card md3-article-resource-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary">
              <span class="md3-chip">Reference</span>
              <h3 class="mt-4 text-base font-bold text-foreground">Production cheatsheets</h3>
              <p class="mt-2 text-sm leading-6 text-muted-foreground">Keep the operational commands and checks nearby.</p>
            </a>
            <a routerLink="/glossary" class="md3-card md3-article-resource-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary">
              <span class="md3-chip">Glossary</span>
              <h3 class="mt-4 text-base font-bold text-foreground">Key terms</h3>
              <p class="mt-2 text-sm leading-6 text-muted-foreground">Review the vocabulary behind the architecture.</p>
            </a>
          </div>
        </div>

        <!-- Comments (Giscus) -->
        <section class="md3-article-discussion mb-16" aria-labelledby="discussion-title">
          <div class="md3-article-discussion-header">
            <span class="md3-article-section-label">Community notes</span>
            <h2 id="discussion-title">Discussion</h2>
            <p>
              Questions, corrections, or production notes? Add them here so other learners can benefit.
            </p>
          </div>
          @if (discussionStatus() === 'loading') {
            <div class="md3-article-discussion-state" role="status" aria-live="polite">
              <span class="md3-discussion-spinner" aria-hidden="true"></span>
              Loading GitHub Discussion...
            </div>
            <div class="md3-discussion-skeleton" aria-hidden="true">
              <span class="md3-discussion-skeleton-avatar"></span>
              <span class="md3-discussion-skeleton-line is-wide"></span>
              <span class="md3-discussion-skeleton-line"></span>
              <span class="md3-discussion-skeleton-box"></span>
              <span class="md3-discussion-skeleton-action"></span>
            </div>
          }
          @if (discussionStatus() === 'error') {
            <div class="md3-article-discussion-fallback" role="alert">
              <h3>Discussion is unavailable</h3>
              <p>{{ discussionMessage() }}</p>
              <a href="https://github.com/vishalanandl177/coderssecret.com/discussions"
                 target="_blank"
                 rel="noopener noreferrer"
                 class="md3-button-tonal">
                Open GitHub Discussions
              </a>
            </div>
          }
          <div #giscus
               class="giscus-container"
               [attr.aria-busy]="discussionStatus() === 'loading' ? 'true' : null"></div>
        </section>

        <!-- Related posts -->
        @if (relatedPosts.length > 0) {
          <section class="md3-article-related" aria-labelledby="continue-reading-title">
            <div class="md3-article-related-header">
              <span class="md3-article-section-label">Next guides</span>
              <h2 id="continue-reading-title">Continue Reading</h2>
              <p>Related practical guides from the same production engineering path.</p>
            </div>
            <div class="md3-article-related-grid grid gap-4 md:grid-cols-2">
              @for (related of relatedPosts; track related.id) {
                <a [routerLink]="['/blog', related.slug]"
                   class="md3-article-related-card group">
                  <div class="md3-article-related-card-body">
                    <div class="md3-article-related-meta">
                      <span class="md3-article-related-chip">
                        {{ getCategoryName(related.category) }}
                      </span>
                      <time class="font-mono" [attr.datetime]="related.date">{{ related.date }}</time>
                      <span class="md3-article-related-dot" aria-hidden="true"></span>
                      <span>{{ related.readTime }}</span>
                    </div>
                    <h3>
                      {{ related.title }}
                    </h3>
                    <p>{{ related.excerpt }}</p>

                    <div class="md3-article-related-footer">
                      <div class="md3-article-related-tags">
                        @for (tag of related.tags.slice(0, 2); track tag) {
                          <span class="md3-article-related-tag">
                            {{ tag }}
                          </span>
                        }
                      </div>
                      <span class="md3-article-related-action" aria-hidden="true">
                        Read
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                             stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M7 17 17 7"/><path d="M7 7h10v10"/>
                        </svg>
                      </span>
                    </div>
                  </div>
                </a>
              }
            </div>
          </section>
        }
      </div>
      }
    } @else {
      <!-- 404 state -->
      <div class="py-32 text-center">
        <div class="container max-w-4xl mx-auto px-6">
          <div class="inline-flex items-center justify-center h-20 w-20 rounded-3xl bg-muted/50 mb-8">
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-muted-foreground">
              <circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/>
            </svg>
          </div>
          <h2 class="text-3xl font-extrabold mb-3">Post not found</h2>
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
  private platformId = inject(PLATFORM_ID);
  private analytics = inject(AnalyticsService);
  private cdr = inject(ChangeDetectorRef);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private copyButtonsAdded = false;
  private imagesProcessed = false;
  private headingsProcessed = false;
  private giscusAdded = false;
  private discussionSlug = '';
  private discussionTimeoutId: number | undefined;
  private scrollMilestones = new Set<number>();
  readingProgress = signal(0);
  activeTocId = signal('');
  linkCopied = signal(false);
  isSpeaking = signal(false);
  speechPaused = signal(false);
  tocIndicatorTop = signal(0);
  tocIndicatorHeight = signal(0);
  tocIndicatorOpacity = signal(0);
  discussionStatus = signal<'idle' | 'loading' | 'ready' | 'error'>('idle');
  discussionMessage = signal('');
  encodeURIComponent = encodeURIComponent;
  post: BlogPost | undefined;
  relatedPosts: BlogPost[] = [];
  toc: { id: string; text: string; level: 2 | 3 }[] = [];
  desktopToc: { id: string; text: string; level: 2 | 3 }[] = [];
  desktopTocTitle = '';
  categoryName = '';
  categoryColor = md3CategoryAccent('');
  readonly generatedCoverMissingSlugs = new Set([
    'distributed-systems-algorithms-production-guide',
    'rate-limiting-algorithms-production-guide',
    'caching-strategies-production-guide',
    'scheduling-systems-production-guide',
  ]);

  constructor() {
    this.route.paramMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(async params => {
        const slug = params.get('slug');
        const basePost = BLOG_POSTS.find(p => p.slug === slug);
        this.copyButtonsAdded = false;
        this.imagesProcessed = false;
        this.headingsProcessed = false;
        this.giscusAdded = false;
        this.discussionSlug = '';
        this.clearDiscussionTimeout();
        this.discussionStatus.set('idle');
        this.discussionMessage.set('');
        this.scrollMilestones.clear();
        this.stopSpeech();
        this.toc = [];
        this.desktopToc = [];
        this.desktopTocTitle = '';
        this.tocIndicatorOpacity.set(0);
        this.activeTocId.set('');

        if (basePost && slug) {
          this.post = { ...basePost, content: '' };
          const cat = CATEGORIES.find(c => c.slug === basePost.category);
          this.categoryName = cat?.name ?? '';
          this.categoryColor = this.getCategoryColor(basePost.category);
          this.relatedPosts = BLOG_POSTS
            .filter(p => p.id !== basePost.id && (p.category === basePost.category || p.tags.some(t => basePost.tags.includes(t))))
            .slice(0, 2);
          let content = '';
          // Dynamically load content for this specific post
          try {
            const contentModule = await import(`../../models/blog-content/${slug}.ts`);
            content = contentModule.CONTENT;
          } catch {
            content = `<p>${basePost.excerpt}</p>`;
          }
          if (this.post?.slug !== slug) return;
          const prepared = this.prepareArticleContent(content);
          this.post = { ...basePost, content: prepared.content };
          this.toc = prepared.toc;
          this.desktopToc = this.buildDesktopToc(prepared.toc);
          this.desktopTocTitle = this.buildDesktopTocTitle(basePost.title);
          this.activeTocId.set(this.toc[0]?.id ?? '');
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
            jsonLd: this.getBlogFaqSchema(this.post.slug),
          });
          // Dynamic imports can settle outside the current render pass, so refresh before a scroll/event wakes the view.
          this.cdr.detectChanges();
          this.enhanceArticleDom();
          this.scheduleDesktopTocIndicatorRefresh();
          this.loadDiscussion();
        } else {
          this.post = undefined;
          this.relatedPosts = [];
          this.desktopToc = [];
          this.desktopTocTitle = '';
          this.categoryName = '';
          this.categoryColor = md3CategoryAccent('');
          this.discussionStatus.set('idle');
          this.discussionMessage.set('');
          this.cdr.detectChanges();
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
    this.refreshActiveToc();
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
    this.activeTocId.set('');
    this.clearDiscussionTimeout();
    this.stopSpeech();
  }

  ngAfterViewChecked() {
    this.enhanceArticleDom();
    this.loadDiscussion();
  }

  private prepareArticleContent(content: string): { content: string; toc: { id: string; text: string; level: 2 | 3 }[] } {
    const usedIds = new Map<string, number>();
    const toc: { id: string; text: string; level: 2 | 3 }[] = [];
    const preparedContent = content.replace(/<h([23])([^>]*)>([\s\S]*?)<\/h\1>/gi, (match, levelValue, attrs, innerHtml) => {
      const level = Number(levelValue) as 2 | 3;
      const text = this.headingTextFromHtml(innerHtml);
      if (!text) return match;

      const existingId = this.extractHeadingId(attrs);
      const baseId = this.slugifyHeading(existingId || text) || `section-${toc.length + 1}`;
      const id = this.uniqueHeadingId(baseId, usedIds);
      toc.push({ id, text, level });

      return `<h${level}${this.withHeadingId(attrs, id)}>${innerHtml}</h${level}>`;
    });

    return { content: preparedContent, toc };
  }

  private buildDesktopToc(toc: { id: string; text: string; level: 2 | 3 }[]): { id: string; text: string; level: 2 | 3 }[] {
    const topLevel = toc.filter(item => item.level === 2);
    if (topLevel.length <= 5) return topLevel;

    const selected = new Map<string, { id: string; text: string; level: 2 | 3 }>();
    const add = (item: { id: string; text: string; level: 2 | 3 } | undefined) => {
      if (item && !selected.has(item.id)) selected.set(item.id, item);
    };

    topLevel.slice(0, 4).forEach(add);
    add(topLevel.slice(4).find(item => /architecture|pattern|checklist|faq|source/i.test(item.text)) ?? topLevel[4]);

    return Array.from(selected.values()).slice(0, 5);
  }

  private buildDesktopTocTitle(title: string): string {
    if (title.length <= 56) return title;
    const [lead] = title.split(':');
    return lead && lead.length >= 18 && lead.length <= 56 ? lead : title;
  }

  isDesktopTocItemActive(item: { id: string; text: string; level: 2 | 3 }): boolean {
    const activeId = this.activeTocId();
    if (!activeId) return false;
    if (activeId === 'article-start') return this.desktopToc[0]?.id === item.id;
    if (activeId === item.id) return true;

    const activeIndex = this.toc.findIndex(tocItem => tocItem.id === activeId);
    const itemIndex = this.toc.findIndex(tocItem => tocItem.id === item.id);
    if (activeIndex < 0 || itemIndex < 0 || activeIndex < itemIndex) return false;

    const nextDesktopItem = this.desktopToc.find(desktopItem => {
      const index = this.toc.findIndex(tocItem => tocItem.id === desktopItem.id);
      return index > itemIndex;
    });
    if (!nextDesktopItem) return true;

    const nextDesktopIndex = this.toc.findIndex(tocItem => tocItem.id === nextDesktopItem.id);
    return activeIndex < nextDesktopIndex;
  }

  private activeDesktopTocItem(): { id: string; text: string; level: 2 | 3 } | undefined {
    if (this.activeTocId() === 'article-start') return this.desktopToc[0];
    return this.desktopToc.find(item => this.isDesktopTocItemActive(item));
  }

  private headingTextFromHtml(html: string): string {
    const text = html
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    return this.decodeHtmlEntities(text);
  }

  private decodeHtmlEntities(text: string): string {
    if (!this.isBrowser) {
      return text
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'");
    }

    const textarea = this.doc.createElement('textarea');
    textarea.innerHTML = text;
    return textarea.value;
  }

  private extractHeadingId(attrs: string): string {
    return attrs.match(/\s+id=(["'])(.*?)\1/i)?.[2] ?? '';
  }

  private withHeadingId(attrs: string, id: string): string {
    if (this.extractHeadingId(attrs)) {
      return attrs.replace(/\s+id=(["'])(.*?)\1/i, ` id="${id}"`);
    }
    return `${attrs} id="${id}"`;
  }

  private slugifyHeading(text: string): string {
    return text
      .toLowerCase()
      .replace(/&/g, ' and ')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 80);
  }

  private uniqueHeadingId(baseId: string, usedIds: Map<string, number>): string {
    const count = usedIds.get(baseId) ?? 0;
    usedIds.set(baseId, count + 1);
    return count === 0 ? baseId : `${baseId}-${count + 1}`;
  }

  private enhanceArticleDom() {
    if (!this.isBrowser) return;

    if (this.post && !this.imagesProcessed) {
      const images = this.el.nativeElement.querySelectorAll('article img');
      if (images.length > 0) {
        this.imagesProcessed = true;
        images.forEach((img: HTMLImageElement) => {
          const knownSize = this.getKnownImageSize(img.getAttribute('src') ?? '');
          if (knownSize && (!img.hasAttribute('width') || !img.hasAttribute('height'))) {
            img.setAttribute('width', String(knownSize.width));
            img.setAttribute('height', String(knownSize.height));
          }
          img.setAttribute('loading', 'lazy');
          img.setAttribute('decoding', 'async');
        });
      }
    }
    if (this.post && !this.headingsProcessed) {
      const headings = this.el.nativeElement.querySelectorAll('article h2, article h3');
      if (headings.length > 0) {
        this.headingsProcessed = true;
        headings.forEach((heading: HTMLElement, i: number) => {
          heading.id = this.toc[i]?.id ?? `heading-${i}`;
        });
        this.scheduleActiveTocRefresh();
      }
    }
    if (this.post && !this.copyButtonsAdded) {
      const preBlocks = this.el.nativeElement.querySelectorAll('pre');
      if (preBlocks.length > 0) {
        this.copyButtonsAdded = true;
        preBlocks.forEach((pre: HTMLElement) => {
          if (pre.querySelector('.copy-btn')) return;
          pre.style.position = 'relative';
          const btn = document.createElement('button');
          btn.className = 'copy-btn';
          btn.type = 'button';
          btn.setAttribute('aria-label', 'Copy code');
          btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`;
          btn.title = 'Copy code';
          btn.addEventListener('click', () => {
            const code = pre.querySelector('code')?.textContent ?? pre.textContent ?? '';
            navigator.clipboard.writeText(code).then(() => {
              btn.setAttribute('aria-label', 'Code copied');
              btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
              setTimeout(() => {
                btn.setAttribute('aria-label', 'Copy code');
                btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`;
              }, 2000);
            });
          });
          pre.appendChild(btn);
        });
      }
    }
  }

  @HostListener('window:resize')
  onResize() {
    this.scheduleDesktopTocIndicatorRefresh();
  }

  private loadDiscussion() {
    if (!this.isBrowser || !this.post?.slug || !this.post.content) return;

    const container = this.el.nativeElement.querySelector('.giscus-container') as HTMLElement | null;
    if (!container) return;

    if (this.giscusAdded && this.discussionSlug === this.post.slug) return;

    const slug = this.post.slug;
    this.clearDiscussionTimeout();
    this.giscusAdded = true;
    this.discussionSlug = slug;
    this.discussionStatus.set('loading');
    this.discussionMessage.set('');
    container.innerHTML = '';

    const script = this.doc.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.setAttribute('data-repo', 'vishalanandl177/coderssecret.com');
    script.setAttribute('data-repo-id', 'R_kgDOR5J1Dw');
    script.setAttribute('data-category', 'General');
    script.setAttribute('data-category-id', 'DIC_kwDOR5J1D84C62V5');
    script.setAttribute('data-mapping', 'pathname');
    script.setAttribute('data-strict', '1');
    script.setAttribute('data-reactions-enabled', '1');
    script.setAttribute('data-emit-metadata', '1');
    script.setAttribute('data-input-position', 'bottom');
    script.setAttribute('data-theme', this.doc.documentElement.classList.contains('dark') ? 'transparent_dark' : 'light');
    script.setAttribute('data-lang', 'en');
    script.setAttribute('data-loading', 'lazy');
    script.setAttribute('crossorigin', 'anonymous');
    script.async = true;
    script.onerror = () => this.setDiscussionError(slug, 'GitHub Discussions could not be loaded. This is usually a network, ad blocker, or GitHub script availability issue.');

    container.appendChild(script);
    this.pollForDiscussionFrame(container, slug);
  }

  private pollForDiscussionFrame(container: HTMLElement, slug: string, attempt = 0) {
    if (!this.isBrowser || this.post?.slug !== slug) return;

    const frame = container.querySelector('iframe') || this.doc.querySelector('iframe.giscus-frame');
    if (frame) {
      this.clearDiscussionTimeout();
      this.discussionStatus.set('ready');
      this.discussionMessage.set('');
      return;
    }

    if (attempt >= 18) {
      this.setDiscussionError(slug, 'Discussion did not finish loading. You can still open the project discussions on GitHub.');
      return;
    }

    const win = this.doc.defaultView;
    if (!win) return;

    this.discussionTimeoutId = win.setTimeout(() => {
      this.pollForDiscussionFrame(container, slug, attempt + 1);
    }, 750);
  }

  private setDiscussionError(slug: string, message: string) {
    if (this.post?.slug !== slug) return;
    this.clearDiscussionTimeout();
    this.discussionStatus.set('error');
    this.discussionMessage.set(message);
  }

  private clearDiscussionTimeout() {
    const win = this.doc.defaultView;
    if (win && this.discussionTimeoutId !== undefined) {
      win.clearTimeout(this.discussionTimeoutId);
    }
    this.discussionTimeoutId = undefined;
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

  private refreshActiveToc() {
    if (!this.post || this.toc.length === 0) {
      if (this.activeTocId()) this.activeTocId.set('');
      return;
    }

    const headingElements = Array.from(
      this.el.nativeElement.querySelectorAll('article h2[id], article h3[id]')
    ) as HTMLElement[];
    const activationOffset = this.tocActivationOffset();
    const firstHeadingTop = headingElements[0]?.getBoundingClientRect().top;
    const activeId = firstHeadingTop !== undefined && firstHeadingTop > activationOffset
      ? 'article-start'
      : getActiveTocHeadingId(
      headingElements.map(heading => ({
        id: heading.id,
        top: heading.getBoundingClientRect().top,
      })),
      activationOffset
    );

    if (activeId && activeId !== this.activeTocId()) {
      this.activeTocId.set(activeId);
    }
    this.scheduleDesktopTocIndicatorRefresh();
  }

  private scheduleActiveTocRefresh() {
    const win = this.doc.defaultView;
    if (win?.requestAnimationFrame) {
      win.requestAnimationFrame(() => this.refreshActiveToc());
      return;
    }
    queueMicrotask(() => this.refreshActiveToc());
  }

  private scheduleDesktopTocIndicatorRefresh() {
    if (!this.isBrowser) return;

    const win = this.doc.defaultView;
    if (win?.requestAnimationFrame) {
      win.requestAnimationFrame(() => this.updateDesktopTocIndicator());
      return;
    }
    queueMicrotask(() => this.updateDesktopTocIndicator());
  }

  private updateDesktopTocIndicator() {
    if (!this.isBrowser || this.desktopToc.length === 0) {
      this.tocIndicatorOpacity.set(0);
      return;
    }

    const panel = this.el.nativeElement.querySelector('.md3-article-toc-panel') as HTMLElement | null;
    const list = panel?.querySelector('.md3-article-toc-list') as HTMLElement | null;
    const activeItem = this.activeDesktopTocItem();
    if (!panel || !list || !activeItem) {
      this.tocIndicatorOpacity.set(0);
      return;
    }

    const activeLink = Array.from(panel.querySelectorAll('.md3-article-toc-link'))
      .find(link => link.getAttribute('href') === `#${activeItem.id}`) as HTMLElement | undefined;
    if (!activeLink) {
      this.tocIndicatorOpacity.set(0);
      return;
    }

    const listRect = list.getBoundingClientRect();
    const linkRect = activeLink.getBoundingClientRect();
    this.tocIndicatorTop.set(linkRect.top - listRect.top);
    this.tocIndicatorHeight.set(linkRect.height);
    this.tocIndicatorOpacity.set(1);
  }

  private tocActivationOffset(): number {
    const viewportHeight = this.doc.defaultView?.innerHeight ?? 0;
    if (viewportHeight <= 0) return 140;
    return Math.min(180, Math.max(112, viewportHeight * 0.22));
  }

  scrollToHeading(event: Event, id: string) {
    event.preventDefault();
    const el = this.doc.getElementById(id);
    const win = this.doc.defaultView;
    if (!el || !win) return;

    const prefersReducedMotion = win.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const offset = this.tocScrollOffset();
    const top = el.getBoundingClientRect().top + win.scrollY - offset;
    this.activeTocId.set(id);
    this.scheduleDesktopTocIndicatorRefresh();
    win.scrollTo({ top, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    win.history.replaceState(null, '', `${win.location.pathname}${win.location.search}#${id}`);
  }

  private tocScrollOffset(): number {
    const header = this.doc.querySelector('app-header') as HTMLElement | null;
    const headerHeight = header?.getBoundingClientRect().height ?? 72;
    return Math.max(88, headerHeight + 24);
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
    return md3CategoryAccent(slug);
  }

  getCategoryName(slug: string): string {
    const cat = CATEGORIES.find(c => c.slug === slug);
    return cat?.name ?? slug;
  }

  bannerImageFor(post: BlogPost): string | null {
    if (post.coverImage) {
      return post.coverImage;
    }

    if (this.generatedCoverMissingSlugs.has(post.slug)) {
      return null;
    }

    return `/images/banners/${post.slug}.svg`;
  }

  private getBlogFaqSchema(slug: string): Record<string, unknown> | undefined {
    if (slug === 'are-dags-dying-declarative-data-pipelines') {
      const faqs = [
        {
          question: 'Are DAGs becoming obsolete?',
          answer: 'No. Dependency graphs remain fundamental. What is changing is that more graphs are derived from assets, SQL refs, contracts, and metadata instead of being manually written as task chains.',
        },
        {
          question: 'What is a declarative data pipeline?',
          answer: 'A declarative data pipeline describes desired data assets, dependencies, schemas, freshness expectations, checks, and ownership. The execution engine decides what work must run to keep those assets correct and fresh.',
        },
        {
          question: 'Is Airflow still useful?',
          answer: 'Yes. Airflow remains useful for procedural workflows, broad integrations, and mature scheduling. Teams can still add dbt models, lineage, data contracts, asset naming, and freshness checks.',
        },
        {
          question: 'What is an asset graph?',
          answer: 'An asset graph maps durable data objects such as tables, metrics, files, dashboards, or ML features and the dependencies between them.',
        },
        {
          question: 'Should beginners learn Airflow, dbt, or Dagster first?',
          answer: 'Beginners should learn the concepts first: DAGs, idempotency, retries, partitions, SQL models, tests, and lineage. Then choose tools based on the role and platform.',
        },
      ];

      return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        'mainEntity': faqs.map(faq => ({
          '@type': 'Question',
          'name': faq.question,
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': faq.answer,
          },
        })),
      };
    }

    if (slug === 'mcp-security-production-ai-agents-oauth-gateways') {
      const faqs = [
        {
          question: 'Is MCP secure by default?',
          answer: 'MCP is a protocol, not a complete security platform. Production deployments still need authentication, authorization, token validation, policy enforcement, sandboxing, and audit logging.',
        },
        {
          question: 'Should production MCP deployments use a gateway?',
          answer: 'A gateway is the cleanest control point when MCP tools can access sensitive data, mutate production systems, call internal APIs, or run local commands.',
        },
        {
          question: 'Why is token passthrough dangerous in MCP?',
          answer: 'Token passthrough breaks resource boundaries because an MCP server may accept or forward a token that was not issued for it. Production servers should validate token audience and use separate downstream credentials.',
        },
        {
          question: 'How should MCP tool permissions be designed?',
          answer: 'Design permissions at the tool and action level. Separate discovery, read, write, destructive, network, payment, and admin tools, then require stronger controls for higher-risk actions.',
        },
        {
          question: 'How do you make local MCP servers safer?',
          answer: 'Show the exact startup command, require explicit consent, restrict filesystem access, deny network by default, expose only required secrets, and run the server with least privilege.',
        },
      ];

      return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        'mainEntity': faqs.map(faq => ({
          '@type': 'Question',
          'name': faq.question,
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': faq.answer,
          },
        })),
      };
    }

    if (slug !== 'claude-tokens-hidden-costs-optimization-guide') {
      return undefined;
    }

    const faqs = [
      {
        question: 'Are Claude thinking tokens billed?',
        answer: 'Yes. Anthropic documents that thinking tokens are billed as output tokens, even when thinking is summarized or omitted from the visible response.',
      },
      {
        question: 'Does prompt caching reduce context size?',
        answer: 'No. Prompt caching reduces price and latency for repeated prompt prefixes, but cached tokens still count toward the context window.',
      },
      {
        question: 'Why does Claude Code use more tokens than a simple API call?',
        answer: 'Claude Code can include project instructions, conversation history, tool results, file reads, command output, skills, and MCP or tool context. A short user message can sit on top of a much larger coding session context.',
      },
      {
        question: 'Do MCP servers always load every full schema?',
        answer: 'Current Claude Code guidance says MCP tool definitions are deferred by default, but tool names, selected tools, tool calls, and tool results can still affect context. Disable unused servers and measure with /context.',
      },
      {
        question: 'Does 1M context always mean premium long-context pricing?',
        answer: 'No. Claude Opus 4.7, Opus 4.6, and Sonnet 4.6 include the full 1M-token context window at standard pricing. A huge request is still expensive because it contains more tokens, but it does not add a separate long-context premium for those models.',
      },
      {
        question: 'Is the Claude Code /usage dollar amount my final bill?',
        answer: 'Not necessarily. Claude Code reports useful session token and estimated cost information, but the dollar figure is computed locally and may differ from actual billing. For API billing, use the Claude Console.',
      },
      {
        question: 'Can data residency, fast mode, or server tools change the price?',
        answer: 'Yes. US-only inference can add a 1.1x token multiplier for supported models, Opus 4.6 fast mode is priced at 6x standard token rates, and server-side tools can add usage-based charges beyond normal token cost.',
      },
      {
        question: 'What is the fastest way to cut Claude token cost?',
        answer: 'Use Sonnet for default coding work, cache repeated API prefixes, compact long Claude Code sessions, trim CLAUDE.md, disable unused MCP servers, monitor tool usage, and avoid dumping full files or full logs into context.',
      },
    ];

    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': faqs.map(faq => ({
        '@type': 'Question',
        'name': faq.question,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': faq.answer,
        },
      })),
    };
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
      '/images/blog/claude-token-cost-stack.svg': { width: 1200, height: 630 },
      '/images/blog/mcp-security-gateway-architecture.svg': { width: 1200, height: 630 },
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
