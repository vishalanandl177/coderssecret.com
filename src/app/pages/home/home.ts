import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BLOG_POSTS, CATEGORIES, BlogPost } from '../../models/blog-post.model';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  template: `
    <!-- Hero with animated gradient -->
    <section class="relative overflow-hidden">
      <!-- Animated gradient blobs -->
      <div class="absolute inset-0 -z-10">
        <div class="absolute top-[-20%] left-[-10%] h-[500px] w-[500px] rounded-full bg-purple-500/15 blur-[100px] animate-blob"></div>
        <div class="absolute top-[-10%] right-[-10%] h-[400px] w-[400px] rounded-full bg-blue-500/15 blur-[100px] animate-blob animation-delay-2000"></div>
        <div class="absolute bottom-[-20%] left-[30%] h-[450px] w-[450px] rounded-full bg-pink-500/10 blur-[100px] animate-blob animation-delay-4000"></div>
      </div>

      <div class="container max-w-6xl mx-auto px-6 pt-20 pb-24 md:pt-32 md:pb-32">
        <div class="flex flex-col items-center text-center">
          <!-- Badge -->
          <a routerLink="/slides/drf-api-logger" class="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-orange-500/10 backdrop-blur-sm px-4 py-1.5 text-xs font-semibold text-foreground mb-8 animate-in fade-in slide-in-from-bottom-2 duration-500 hover:border-primary/60 hover:shadow-md transition-all">
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span class="font-mono text-[10px] uppercase tracking-wider text-primary">NEW</span>
            Watch any article as narrated slides →
          </a>

          <!-- Heading -->
          <h1 class="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.05] animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
            Where <span class="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 bg-clip-text text-transparent">Code</span>
            Meets
            <br class="hidden sm:block" />
            <span class="bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 bg-clip-text text-transparent">Creativity</span>
          </h1>

          <p class="mt-6 text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            Battle-tested guides on Python, DevOps, APIs, and system design — written by engineers, for engineers who ship.
            <span class="block mt-2 text-foreground font-medium">Read articles, or <span class="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent font-bold">watch every tutorial as narrated slides</span>.</span>
          </p>

          <!-- CTA buttons -->
          <div class="mt-10 flex flex-wrap justify-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
            <a routerLink="/blog"
               class="group relative inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 active:scale-[0.97]">
              Start Reading
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                   class="transition-transform duration-300 group-hover:translate-x-1">
                <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
              </svg>
            </a>
            <a routerLink="/slides/drf-api-logger"
               class="group relative inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-purple-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/40 hover:-translate-y-0.5 active:scale-[0.97]">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="6 3 20 12 6 21 6 3"/></svg>
              Watch a Demo
            </a>
            <a routerLink="/category/tutorials"
               class="inline-flex items-center justify-center rounded-full border border-border/60 bg-card/60 backdrop-blur-sm px-8 py-3.5 text-sm font-semibold text-foreground transition-all duration-300 hover:bg-accent hover:shadow-md hover:-translate-y-0.5 active:scale-[0.97]">
              Browse Tutorials
            </a>
          </div>

          <!-- Stats -->
          <div class="mt-16 grid grid-cols-4 gap-8 md:gap-16 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
            <div class="text-center">
              <div class="text-3xl md:text-4xl font-extrabold tracking-tight">{{ totalPosts }}</div>
              <div class="mt-1 text-xs md:text-sm text-muted-foreground">Articles</div>
            </div>
            <div class="text-center">
              <div class="text-3xl md:text-4xl font-extrabold tracking-tight">{{ categories.length }}</div>
              <div class="mt-1 text-xs md:text-sm text-muted-foreground">Categories</div>
            </div>
            <div class="text-center">
              <div class="text-3xl md:text-4xl font-extrabold tracking-tight">{{ uniqueTags }}</div>
              <div class="mt-1 text-xs md:text-sm text-muted-foreground">Topics</div>
            </div>
            <div class="text-center">
              <div class="text-3xl md:text-4xl font-extrabold tracking-tight">{{ totalPosts }}</div>
              <div class="mt-1 text-xs md:text-sm text-muted-foreground">Slide Tutorials</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Watch as Slides — flagship feature showcase -->
    <section class="relative py-16 md:py-24 overflow-hidden">
      <div class="absolute inset-0 -z-10">
        <div class="absolute top-0 left-1/2 -translate-x-1/2 h-[400px] w-[800px] bg-gradient-to-b from-purple-500/10 via-blue-500/5 to-transparent blur-3xl"></div>
      </div>
      <div class="container max-w-6xl mx-auto px-6">
        <div class="text-center max-w-3xl mx-auto mb-14">
          <h2 class="text-3xl md:text-5xl font-extrabold tracking-tight leading-[1.1] mb-5">
            Don't just read.
            <span class="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 bg-clip-text text-transparent">Watch every tutorial as slides.</span>
          </h2>
          <p class="text-base md:text-lg text-muted-foreground leading-relaxed">
            Tired of long-form articles? Every single tutorial on CodersSecret can be watched as <strong class="text-foreground">auto-narrated slide presentations</strong> — like a YouTube tutorial, but 20× lighter, fully focused, and completely free.
          </p>
        </div>

        <!-- Feature grid -->
        <div class="grid md:grid-cols-3 gap-5 mb-12">
          <div class="rounded-2xl border border-border/60 bg-card p-6 hover:border-primary/40 transition-all hover:-translate-y-1">
            <div class="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>
            </div>
            <h3 class="text-lg font-bold mb-2">Voice-narrated</h3>
            <p class="text-sm text-muted-foreground leading-relaxed">A human-style narrator explains every slide in detail — beyond what's on screen. Pick your voice, adjust the speed.</p>
          </div>
          <div class="rounded-2xl border border-border/60 bg-card p-6 hover:border-primary/40 transition-all hover:-translate-y-1">
            <div class="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500/20 to-teal-500/20 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-blue-500"><path d="M4.93 4.93l14.14 14.14"/><path d="M12 2a10 10 0 1 0 0 20 10 10 0 1 0 0-20z"/></svg>
            </div>
            <h3 class="text-lg font-bold mb-2">20× less data</h3>
            <p class="text-sm text-muted-foreground leading-relaxed">Slides + TTS narration uses a fraction of the bandwidth of video tutorials. Perfect for low-data, offline-first, or limited-mobile-plan users.</p>
          </div>
          <div class="rounded-2xl border border-border/60 bg-card p-6 hover:border-primary/40 transition-all hover:-translate-y-1">
            <div class="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-orange-500/20 to-pink-500/20 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-orange-500"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
            <h3 class="text-lg font-bold mb-2">Learn at your pace</h3>
            <p class="text-sm text-muted-foreground leading-relaxed">Auto-advance for hands-free learning, or step through manually. Review the full narrator script anytime. Keyboard nav built-in.</p>
          </div>
        </div>

        <!-- Comparison row + CTA -->
        <div class="rounded-3xl border border-border/60 bg-gradient-to-br from-card via-card to-primary/5 p-6 md:p-10">
          <div class="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 class="text-2xl md:text-3xl font-extrabold tracking-tight mb-4">Slides vs. Video</h3>
              <div class="space-y-3 text-sm">
                <div class="flex items-start gap-3">
                  <span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-500/20 text-green-600 flex-shrink-0 mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </span>
                  <span class="text-foreground"><strong>~1MB per tutorial</strong> vs 50-200MB for video — save data, save time.</span>
                </div>
                <div class="flex items-start gap-3">
                  <span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-500/20 text-green-600 flex-shrink-0 mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </span>
                  <span class="text-foreground"><strong>Zero ads. Zero tracking.</strong> No distracting sidebar, no suggested videos, no algorithm.</span>
                </div>
                <div class="flex items-start gap-3">
                  <span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-500/20 text-green-600 flex-shrink-0 mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </span>
                  <span class="text-foreground"><strong>Fully accessible.</strong> Screen-reader friendly, keyboard navigable, high-contrast theme.</span>
                </div>
                <div class="flex items-start gap-3">
                  <span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-500/20 text-green-600 flex-shrink-0 mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </span>
                  <span class="text-foreground"><strong>Available on every article.</strong> Click "Watch as Slides" on any of {{ totalPosts }}+ tutorials.</span>
                </div>
              </div>
            </div>
            <div class="flex flex-col gap-3 items-stretch md:items-start">
              <a routerLink="/slides/drf-api-logger"
                 class="group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 px-7 py-4 text-sm font-bold text-white shadow-xl shadow-purple-500/30 hover:shadow-2xl hover:shadow-purple-500/50 hover:-translate-y-0.5 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="6 3 20 12 6 21 6 3"/></svg>
                Try the Demo: DRF API Logger
              </a>
              <a routerLink="/slides/python-c-extensions-workshop"
                 class="inline-flex items-center justify-center gap-2 rounded-full border border-border/60 bg-card/80 px-7 py-4 text-sm font-semibold text-foreground hover:bg-accent hover:-translate-y-0.5 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="6 3 20 12 6 21 6 3"/></svg>
                Try: Python C Extensions
              </a>
              <p class="text-xs text-muted-foreground mt-1">
                Or open any article and tap the <strong class="text-foreground">green "Watch as Slides"</strong> pill at the top.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- What We Cover — keyword-rich intro for SEO -->
    <section class="py-12 md:py-16 animate-in fade-in duration-700">
      <div class="container max-w-4xl mx-auto px-6">
        <h2 class="text-2xl md:text-3xl font-extrabold tracking-tight text-center mb-6">What You'll Learn Here</h2>
        <div class="text-center text-muted-foreground leading-relaxed text-base md:text-lg space-y-4">
          <p>
            CodersSecret publishes <strong class="text-foreground">production-grade engineering tutorials</strong> covering the full modern stack &mdash; from Python performance optimization and gRPC microservices to Kubernetes operators, mTLS security, and running large language models locally.
          </p>
          <p>
            Whether you're debugging a Kubernetes networking issue at 3 AM, choosing between Firebase and PostgreSQL for your next project, or trying to understand how CPU cache layers actually affect your code &mdash; you'll find <strong class="text-foreground">deep, practical guides written from real production experience</strong>, not surface-level tutorials.
          </p>
          <p>
            Every article includes working code examples, interactive diagrams, real benchmarks, and honest discussion of trade-offs. Select tutorials are also available as <strong class="text-foreground">interactive slide presentations</strong> &mdash; watch them step-by-step like a video, at your own pace. No fluff. No padding. No "you'll figure it out from the docs."
          </p>
        </div>
        <div class="flex flex-wrap justify-center gap-2 mt-8">
          @for (cat of categories; track cat.slug) {
            <a [routerLink]="['/category', cat.slug]"
               class="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card/60 backdrop-blur-sm px-4 py-1.5 text-sm font-medium text-muted-foreground transition-all duration-300 hover:text-foreground hover:bg-accent">
              {{ cat.name }}
            </a>
          }
        </div>
      </div>
    </section>

    <!-- Featured Post — Full-width spotlight -->
    @if (featuredPost) {
      <section class="py-16 md:py-20 animate-in fade-in duration-700">
        <div class="container max-w-6xl mx-auto px-6">
          <a [routerLink]="['/blog', featuredPost.slug]" class="group block relative">
            <div class="relative rounded-2xl overflow-hidden border border-border bg-gradient-to-br from-violet-500/10 via-card to-blue-500/10 p-[1px]">
              <div class="rounded-[calc(1rem-1px)] bg-card/95 backdrop-blur-xl p-8 md:p-12 lg:p-16">
                <!-- Decorative corner elements -->
                <div class="absolute top-4 right-4 md:top-8 md:right-8 flex items-center gap-2">
                  <span class="inline-flex items-center gap-1.5 rounded-full bg-yellow-500/10 text-yellow-600 px-3 py-1 text-xs font-bold uppercase tracking-wider">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                    Featured
                  </span>
                </div>

                <div class="max-w-3xl">
                  <div class="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-6">
                    <time class="font-mono text-xs" [attr.datetime]="featuredPost.date">{{ featuredPost.date }}</time>
                    <span class="h-1 w-1 rounded-full bg-muted-foreground/50"></span>
                    <span>{{ featuredPost.readTime }}</span>
                  </div>

                  <h2 class="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.1] transition-colors duration-300 group-hover:text-primary">
                    {{ featuredPost.title }}
                  </h2>

                  <p class="mt-5 text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl">
                    {{ featuredPost.excerpt }}
                  </p>

                  <div class="mt-6 flex flex-wrap gap-2">
                    @for (tag of featuredPost.tags; track tag) {
                      <span class="inline-flex items-center rounded-full border border-border/60 bg-secondary/50 px-3 py-1 text-xs font-medium text-secondary-foreground">
                        {{ tag }}
                      </span>
                    }
                  </div>

                  <div class="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                    <span class="transition-all duration-300 group-hover:mr-1">Read the full article</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"
                         class="transition-transform duration-300 group-hover:translate-x-2">
                      <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </a>
        </div>
      </section>
    }

    <!-- Bento Grid — Categories + Quick Stats -->
    <section class="py-16 animate-in fade-in duration-700">
      <div class="container max-w-6xl mx-auto px-6">
        <div class="flex items-end justify-between mb-10">
          <div>
            <h2 class="text-3xl font-extrabold tracking-tight">Explore Topics</h2>
            <p class="mt-2 text-muted-foreground">Find what interests you</p>
          </div>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          @for (cat of categories; track cat.slug; let i = $index) {
            <a [routerLink]="['/category', cat.slug]"
               class="group relative overflow-hidden rounded-2xl border border-border/60 p-6 md:p-8 transition-all duration-500 hover:shadow-xl hover:-translate-y-1 hover:border-transparent active:scale-[0.98]"
               [class]="i === 0 ? 'col-span-2 row-span-2 md:col-span-2 md:row-span-2' : ''"
               [style.background]="getCategoryGradient(cat.slug)">

              <!-- Glow effect on hover -->
              <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                   [style.background]="'radial-gradient(circle at 50% 50%, ' + getCategoryColor(cat.slug) + '15, transparent 70%)'">
              </div>

              <div class="relative z-10">
                <div class="inline-flex items-center justify-center rounded-xl p-2.5 mb-4 transition-transform duration-300 group-hover:scale-110"
                     [style.background-color]="getCategoryColor(cat.slug) + '20'">
                  <span class="text-xl md:text-2xl" [class]="i === 0 ? 'md:text-3xl' : ''">{{ getCategoryIcon(cat.slug) }}</span>
                </div>
                <h3 class="font-bold tracking-tight transition-colors duration-300 group-hover:text-foreground"
                    [class]="i === 0 ? 'text-xl md:text-2xl' : 'text-sm md:text-base'">
                  {{ cat.name }}
                </h3>
                <p class="mt-1 text-xs text-muted-foreground" [class]="i === 0 ? 'md:text-sm md:mt-2' : ''">
                  {{ getCategoryCount(cat.slug) }} post{{ getCategoryCount(cat.slug) !== 1 ? 's' : '' }}
                </p>
              </div>

              <!-- Arrow -->
              <div class="absolute bottom-4 right-4 md:bottom-6 md:right-6 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-muted-foreground">
                  <path d="M7 17 17 7"/><path d="M7 7h10v10"/>
                </svg>
              </div>
            </a>
          }
        </div>
      </div>
    </section>

    <!-- Most Popular — Ranked by traffic -->
    @if (popularPosts.length > 0) {
      <section class="py-16 animate-in fade-in duration-700">
        <div class="container max-w-6xl mx-auto px-6">
          <div class="flex items-end justify-between mb-10">
            <div>
              <h2 class="text-3xl font-extrabold tracking-tight">Most Popular</h2>
              <p class="mt-2 text-muted-foreground">Top reads from our community</p>
            </div>
          </div>

          <div class="grid md:grid-cols-3 gap-4">
            @for (post of popularPosts; track post.id; let i = $index) {
              <article class="group">
                <a [routerLink]="['/blog', post.slug]" class="block h-full">
                  <div class="relative h-full rounded-2xl border border-border/60 bg-card overflow-hidden transition-all duration-500 hover:shadow-xl hover:-translate-y-1 hover:border-primary/20">
                    <!-- Rank badge -->
                    <div class="absolute top-3 left-3 z-10 inline-flex items-center justify-center h-8 w-8 rounded-full font-extrabold text-sm"
                         [class]="i === 0 ? 'bg-yellow-500 text-yellow-950' : i === 1 ? 'bg-gray-300 text-gray-700' : i === 2 ? 'bg-orange-400 text-orange-950' : 'bg-muted text-muted-foreground'">
                      #{{ i + 1 }}
                    </div>
                    <!-- Top accent bar -->
                    <div class="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                         [style.background-image]="'linear-gradient(to right, transparent, ' + getCategoryColor(post.category) + ', transparent)'"></div>

                    <div class="p-6 pt-14 flex flex-col justify-between h-full">
                      <div>
                        <div class="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mb-3">
                          <span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                                [style.background-color]="getCategoryColor(post.category) + '15'"
                                [style.color]="getCategoryColor(post.category)">
                            {{ post.category }}
                          </span>
                          <span>{{ post.readTime }}</span>
                        </div>
                        <h3 class="font-bold text-lg tracking-tight leading-snug transition-colors duration-300 group-hover:text-primary line-clamp-2">
                          {{ post.title }}
                        </h3>
                        <p class="mt-2 text-sm text-muted-foreground line-clamp-2">{{ post.excerpt }}</p>
                      </div>
                      <div class="mt-4 flex items-center justify-between">
                        <div class="flex flex-wrap gap-1.5">
                          @for (tag of post.tags.slice(0, 2); track tag) {
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
          </div>
        </div>
      </section>
    }

    <!-- Latest Posts — Modern card grid -->
    <section class="py-16 animate-in fade-in duration-700">
      <div class="container max-w-6xl mx-auto px-6">
        <div class="flex items-end justify-between mb-10">
          <div>
            <h2 class="text-3xl font-extrabold tracking-tight">Latest Articles</h2>
            <p class="mt-2 text-muted-foreground">Fresh insights and tutorials</p>
          </div>
          <a routerLink="/blog"
             class="group hidden sm:inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card/60 px-5 py-2 text-sm font-medium text-muted-foreground transition-all duration-300 hover:text-foreground hover:bg-accent hover:shadow-sm">
            View all
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                 class="transition-transform duration-300 group-hover:translate-x-1">
              <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
            </svg>
          </a>
        </div>

        <div class="grid md:grid-cols-2 gap-5">
          @for (post of latestPosts; track post.id; let i = $index) {
            <article class="group" [class]="i === 0 ? 'md:col-span-2' : ''">
              <a [routerLink]="['/blog', post.slug]" class="block h-full">
                <div class="relative h-full rounded-2xl border border-border/60 bg-card overflow-hidden transition-all duration-500 hover:shadow-xl hover:-translate-y-1 hover:border-primary/20"
                     [class]="i === 0 ? 'md:flex md:items-stretch' : ''">
                  <!-- Color accent bar -->
                  <div class="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  <div class="p-6 md:p-8 flex flex-col justify-between" [class]="i === 0 ? 'md:flex-1' : ''">
                    <div>
                      <div class="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mb-4">
                        <span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                              [style.background-color]="getCategoryColor(post.category) + '15'"
                              [style.color]="getCategoryColor(post.category)">
                          {{ post.category }}
                        </span>
                        <time class="font-mono" [attr.datetime]="post.date">{{ post.date }}</time>
                        <span class="h-1 w-1 rounded-full bg-muted-foreground/50"></span>
                        <span>{{ post.readTime }}</span>
                      </div>

                      <h3 class="font-bold tracking-tight leading-snug transition-colors duration-300 group-hover:text-primary"
                          [class]="i === 0 ? 'text-2xl md:text-3xl' : 'text-xl'">
                        {{ post.title }}
                      </h3>

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
        </div>

        <!-- Mobile view all link -->
        <div class="mt-8 text-center sm:hidden">
          <a routerLink="/blog"
             class="inline-flex items-center gap-1.5 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-xl active:scale-[0.97]">
            View all articles
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
            </svg>
          </a>
        </div>
      </div>
    </section>

    <!-- Trending Tags -->
    <section class="py-16 animate-in fade-in duration-700">
      <div class="container max-w-6xl mx-auto px-6">
        <div class="mb-10">
          <h2 class="text-3xl font-extrabold tracking-tight">Trending Topics</h2>
          <p class="mt-2 text-muted-foreground">Click any tag to find related articles</p>
        </div>
        <div class="flex flex-wrap gap-2">
          @for (tag of trendingTags; track tag.name) {
            <a [routerLink]="['/blog']" [queryParams]="{tag: tag.name}"
               class="group inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 backdrop-blur-sm px-4 py-2 text-sm font-medium text-muted-foreground transition-all duration-300 hover:bg-primary hover:text-primary-foreground hover:border-primary hover:shadow-md hover:-translate-y-0.5"
               [style.fontSize.px]="11 + tag.count">
              <span>{{ tag.name }}</span>
              <span class="text-xs opacity-60 group-hover:opacity-100">{{ tag.count }}</span>
            </a>
          }
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="py-16 animate-in fade-in duration-700">
      <div class="container max-w-6xl mx-auto px-6">
        <div class="rounded-2xl border border-border/60 bg-gradient-to-br from-purple-500/5 via-card to-blue-500/5 p-10 md:p-16">
          <div class="text-center mb-10">
            <h2 class="text-3xl md:text-4xl font-extrabold tracking-tight">Built for Engineers, by an Engineer</h2>
            <p class="mt-3 text-muted-foreground max-w-2xl mx-auto">Real production knowledge, not surface-level tutorials. Every article is written from hands-on experience and tested against real-world systems.</p>
          </div>
          <div class="grid grid-cols-2 md:grid-cols-5 gap-8">
            <div class="text-center">
              <div class="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">{{ totalPosts }}+</div>
              <div class="mt-2 text-sm text-muted-foreground">In-Depth Articles</div>
            </div>
            <div class="text-center">
              <div class="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">{{ avgReadTime }}</div>
              <div class="mt-2 text-sm text-muted-foreground">Avg Read Time (min)</div>
            </div>
            <div class="text-center">
              <div class="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text text-transparent">{{ uniqueTags }}+</div>
              <div class="mt-2 text-sm text-muted-foreground">Topics Covered</div>
            </div>
            <div class="text-center">
              <div class="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-teal-500 to-green-500 bg-clip-text text-transparent">{{ totalPosts }}</div>
              <div class="mt-2 text-sm text-muted-foreground">Slide Tutorials</div>
            </div>
            <div class="text-center">
              <div class="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">100%</div>
              <div class="mt-2 text-sm text-muted-foreground">Free, Open Source</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Author Teaser -->
    <section class="py-16 animate-in fade-in duration-700">
      <div class="container max-w-6xl mx-auto px-6">
        <a routerLink="/about" class="group block">
          <div class="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm p-8 md:p-10 transition-all duration-500 hover:shadow-xl hover:border-primary/20 hover:-translate-y-1">
            <div class="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div class="flex items-center justify-center h-20 w-20 md:h-24 md:w-24 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 text-white text-3xl md:text-4xl font-bold flex-shrink-0">
                V
              </div>
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-2">
                  <span class="text-xs font-bold uppercase tracking-wider text-muted-foreground">Written By</span>
                </div>
                <h3 class="text-2xl font-extrabold tracking-tight transition-colors duration-300 group-hover:text-primary">Vishal Anand</h3>
                <p class="mt-2 text-muted-foreground leading-relaxed max-w-2xl">
                  Senior Product Engineer and Tech Lead with hands-on experience building production systems at scale. Writing about backend architecture, DevOps, security, Kubernetes, and the Python ecosystem &mdash; the kind of practical knowledge you only get from years on the job.
                </p>
                <div class="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                  Learn more about CodersSecret
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                       stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"
                       class="transition-transform duration-300 group-hover:translate-x-1">
                    <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </a>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="py-16 animate-in fade-in duration-700">
      <div class="container max-w-3xl mx-auto px-6">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-extrabold tracking-tight">Frequently Asked Questions</h2>
          <p class="mt-3 text-muted-foreground">Common questions about CodersSecret and our content</p>
        </div>

        <div class="space-y-3">
          @for (faq of faqs; track faq.q) {
            <details class="group rounded-xl border border-border/60 bg-card/50 backdrop-blur-sm overflow-hidden">
              <summary class="flex items-center justify-between gap-4 cursor-pointer px-6 py-5 text-base font-semibold text-foreground select-none hover:bg-accent/30 transition-colors">
                <span>{{ faq.q }}</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                     class="text-muted-foreground transition-transform duration-300 group-open:rotate-180 flex-shrink-0">
                  <path d="m6 9 6 6 6-6"/>
                </svg>
              </summary>
              <div class="px-6 pb-5 pt-0 text-sm text-muted-foreground leading-relaxed" [innerHTML]="faq.a"></div>
            </details>
          }
        </div>
      </div>
    </section>

    <!-- Support / Buy Me a Coffee -->
    <section class="py-16 animate-in fade-in duration-700">
      <div class="container max-w-4xl mx-auto px-6">
        <div class="relative rounded-3xl overflow-hidden border border-yellow-500/30 bg-gradient-to-br from-yellow-500/10 via-orange-500/10 to-pink-500/10 p-10 md:p-16">
          <!-- Decorative background -->
          <div class="absolute inset-0 -z-10">
            <div class="absolute top-[-30%] right-[-10%] h-[300px] w-[300px] rounded-full bg-yellow-400/20 blur-[100px] animate-blob"></div>
            <div class="absolute bottom-[-20%] left-[-10%] h-[250px] w-[250px] rounded-full bg-orange-400/20 blur-[100px] animate-blob animation-delay-2000"></div>
          </div>

          <div class="text-center">
            <div class="text-6xl md:text-7xl mb-6 animate-bounce-slow">&#x2615;</div>
            <h2 class="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
              Support This Blog
            </h2>
            <p class="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-2">
              CodersSecret is <strong class="text-foreground">100% free and ad-free</strong> &mdash; no paywalls, no signup walls, no tracking beyond anonymous analytics.
            </p>
            <p class="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-8">
              If these articles have helped you ship better software or land a job, consider buying me a coffee. It keeps the content coming and the servers running.
            </p>
            <a href="https://buymeacoffee.com/riptechlead" target="_blank" rel="noopener noreferrer"
               class="group inline-flex items-center gap-3 rounded-full bg-yellow-500 hover:bg-yellow-400 text-yellow-950 font-bold px-8 py-4 text-base md:text-lg shadow-xl shadow-yellow-500/30 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 active:scale-[0.97]">
              <span class="text-2xl">&#x2615;</span>
              Buy me a coffee
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"
                   class="transition-transform duration-300 group-hover:translate-x-1">
                <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
              </svg>
            </a>
            <p class="mt-6 text-sm text-muted-foreground">
              Or just share a post that helped you &mdash; that helps too. &#x1F64C;
            </p>
          </div>
        </div>
      </div>
    </section>

  `,
})
export class HomeComponent {
  private seo = inject(SeoService);
  featuredPost: BlogPost | undefined = BLOG_POSTS.find(p => p.featured);
  popularPosts = BLOG_POSTS.filter(p => p.popularRank != null).sort((a, b) => (a.popularRank ?? 99) - (b.popularRank ?? 99)).slice(0, 6);
  latestPosts = BLOG_POSTS.filter(p => p !== this.featuredPost).slice(0, 4);
  categories = CATEGORIES.filter(c => c.slug !== '');
  totalPosts = BLOG_POSTS.length;
  uniqueTags = new Set(BLOG_POSTS.flatMap(p => p.tags)).size;
  avgReadTime = Math.round(
    BLOG_POSTS.reduce((sum, p) => {
      const m = p.readTime.match(/(\d+)/);
      return sum + (m ? parseInt(m[1], 10) : 0);
    }, 0) / Math.max(BLOG_POSTS.length, 1)
  );

  // Trending tags — top 20 most-used tags with counts
  trendingTags = (() => {
    const counts: Record<string, number> = {};
    for (const p of BLOG_POSTS) {
      for (const t of p.tags) counts[t] = (counts[t] || 0) + 1;
    }
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20);
  })();

  faqs = [
    {
      q: 'What is the "Watch as Slides" feature?',
      a: `Every tutorial on CodersSecret can be watched as an auto-narrated slide presentation — like a YouTube video, but 20x lighter on data. Each slide focuses on the key visual, while a narrator explains the details in the background. You can pick your preferred voice, adjust the speed (0.75x to 1.5x), toggle auto-advance, and even read the full narrator script. Perfect for learners who prefer watching over reading, want to save bandwidth, or need a distraction-free focus mode. Try our <a href="/slides/drf-api-logger" class="text-primary underline">DRF API Logger slide demo</a>.`,
    },
    {
      q: 'How is "Watch as Slides" different from a YouTube tutorial?',
      a: `Slides + text-to-speech narration uses about 1MB per tutorial versus 50-200MB for video. There are zero ads, zero tracking pixels, no suggested videos, and no algorithm competing for your attention. It\'s fully accessible: screen-reader friendly, keyboard navigable, and works perfectly on slow connections. You own the experience — choose your voice, your speed, and your pace.`,
    },
    {
      q: 'What topics does CodersSecret cover?',
      a: 'We publish in-depth tutorials on backend engineering (Python, gRPC, APIs), DevOps (Kubernetes, Docker, Karpenter), security (mTLS, encryption, ethical hacking), system design (SOLID principles, compression algorithms, CPU architecture), AI (running LLMs locally, MCP servers), and modern web development (Angular, Tailwind CSS). Every article is available both as a long-form blog post and as a narrated slide presentation.',
    },
    {
      q: 'Are the tutorials free to read?',
      a: `Yes, every article and every slide tutorial is 100% free and ad-free. The site is open source and supported by the author. There's no paywall, no signup wall, and no tracking beyond anonymous Google Analytics.`,
    },
    {
      q: 'Who writes the content?',
      a: 'All articles are written by <a href="/about" class="text-primary underline">Vishal Anand</a>, a Senior Product Engineer and Tech Lead with hands-on experience building production systems at scale. The content reflects real-world engineering, not textbook theory.',
    },
    {
      q: 'How often do you publish new articles?',
      a: 'New articles are published regularly — typically 2-4 per week covering current engineering topics, deep dives, and practical tutorials. Check the <a href="/blog" class="text-primary underline">blog page</a> for the latest posts.',
    },
    {
      q: 'Can I use the code examples in my own projects?',
      a: 'Absolutely. All code snippets in the articles are released under the <a href="https://opensource.org/licenses/MIT" target="_blank" rel="noopener noreferrer" class="text-primary underline">MIT License</a>. Use them in commercial or personal projects without restriction.',
    },
    {
      q: 'Do you accept guest posts or contributions?',
      a: 'The blog is open source on <a href="https://github.com/vishalanandl177/coderssecret.com" target="_blank" rel="noopener noreferrer" class="text-primary underline">GitHub</a>. You can suggest topics, fix typos via pull requests, or open issues for discussion.',
    },
    {
      q: 'What makes CodersSecret different from other tech blogs?',
      a: 'Three things: (1) <strong>Practical depth</strong> — articles average 2,500+ words with working code examples, not surface-level intros. (2) <strong>Interactive diagrams</strong> — complex flows like SSO, mTLS, and Kubernetes networking are explained with animated visual diagrams, not static images. (3) <strong>Honest trade-offs</strong> — we cover limitations and when NOT to use a technology, not just the happy path.',
    },
    {
      q: 'How do you handle privacy and tracking?',
      a: 'We use only Google Analytics for anonymous page views. No advertising cookies, no tracking pixels, no user accounts required. Comments use GitHub Discussions (only loads if you choose to comment). Read the full <a href="/privacy" class="text-primary underline">privacy policy</a>.',
    },
  ];

  constructor() {
    this.seo.update({
      title: 'CodersSecret',
      description: 'Battle-tested tutorials on Python, DevOps, APIs, AI, and system design — plus every article available as narrated slide presentations. Read or watch: 20× lighter than video, zero ads, fully free.',
      url: '/',
    });
    // Inject FAQPage JSON-LD schema for rich snippets in Google search
    this.injectFaqSchema();
  }

  private injectFaqSchema() {
    if (typeof document === 'undefined') return;
    const existing = document.getElementById('faq-schema');
    if (existing) existing.remove();
    const script = document.createElement('script');
    script.id = 'faq-schema';
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': this.faqs.map(f => ({
        '@type': 'Question',
        'name': f.q,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': f.a.replace(/<[^>]+>/g, ''),
        },
      })),
    });
    document.head.appendChild(script);
  }

  getCategoryColor(slug: string): string {
    const colors: Record<string, string> = {
      ai: '#06b6d4',
      frontend: '#3b82f6',
      backend: '#22c55e',
      devops: '#f97316',
      tutorials: '#a855f7',
      'open-source': '#ec4899',
    };
    return colors[slug] ?? '#6b7280';
  }

  getCategoryGradient(slug: string): string {
    const gradients: Record<string, string> = {
      ai: 'linear-gradient(135deg, rgba(6,182,212,0.08), rgba(6,182,212,0.02))',
      frontend: 'linear-gradient(135deg, rgba(59,130,246,0.08), rgba(59,130,246,0.02))',
      backend: 'linear-gradient(135deg, rgba(34,197,94,0.08), rgba(34,197,94,0.02))',
      devops: 'linear-gradient(135deg, rgba(249,115,22,0.08), rgba(249,115,22,0.02))',
      tutorials: 'linear-gradient(135deg, rgba(168,85,247,0.08), rgba(168,85,247,0.02))',
      'open-source': 'linear-gradient(135deg, rgba(236,72,153,0.08), rgba(236,72,153,0.02))',
    };
    return gradients[slug] ?? '';
  }

  getCategoryIcon(slug: string): string {
    const icons: Record<string, string> = {
      ai: '\u{1F916}',
      frontend: '\u{1F3A8}',
      backend: '\u{2699}\u{FE0F}',
      devops: '\u{1F680}',
      tutorials: '\u{1F4DA}',
      'open-source': '\u{1F4E6}',
    };
    return icons[slug] ?? '\u{1F4C1}';
  }

  getCategoryCount(slug: string): number {
    return BLOG_POSTS.filter(p => p.category === slug).length;
  }
}
