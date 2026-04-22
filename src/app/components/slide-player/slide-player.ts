import { Component, input, signal, computed, HostListener, OnDestroy } from '@angular/core';

export interface SlideData {
  type: 'title' | 'content' | 'code' | 'grid' | 'image' | 'end';
  eyebrow?: string;
  title: string;
  subtitle?: string;
  body?: string;
  bullets?: string[];
  tags?: string[];
  code?: string;
  lang?: string;
  items?: { title: string; desc: string }[];
  src?: string;
  caption?: string;
  links?: { label: string; value: string }[];
  narration: string;
}

@Component({
  selector: 'app-slide-player',
  standalone: true,
  template: `
    <div class="fixed inset-0 z-[100] bg-background flex flex-col overflow-hidden">
      <!-- Top bar -->
      <header class="flex items-center justify-between px-6 h-14 border-b border-border/60 bg-card/80 backdrop-blur flex-shrink-0">
        <div class="flex items-center gap-3">
          <span class="text-xs font-mono text-muted-foreground uppercase tracking-wider">{{ deckTitle() }}</span>
          <span class="text-xs text-muted-foreground">{{ idx() + 1 }} / {{ slides().length }}</span>
        </div>
        <div class="flex items-center gap-2">
          @if (speaking()) {
            <span class="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span class="text-xs font-mono text-green-500">SPEAKING</span>
          }
          <a [href]="backUrl()" class="ml-4 inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            Close
          </a>
        </div>
      </header>

      <!-- Progress bar -->
      <div class="h-1 bg-muted flex-shrink-0">
        <div class="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-500" [style.width.%]="((idx() + 1) / slides().length) * 100"></div>
      </div>

      <!-- Slide content -->
      <main class="flex-1 overflow-y-auto">
        <div class="max-w-5xl mx-auto px-6 py-12 md:py-16 min-h-full flex flex-col">
          @switch (currentSlide().type) {
            @case ('title') {
              <div class="flex-1 flex flex-col justify-center">
                @if (currentSlide().eyebrow) {
                  <p class="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground mb-6">{{ currentSlide().eyebrow }}</p>
                }
                <h1 class="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.05] mb-6">{{ currentSlide().title }}</h1>
                @if (currentSlide().subtitle) {
                  <p class="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl">{{ currentSlide().subtitle }}</p>
                }
                @if (currentSlide().tags?.length) {
                  <div class="flex flex-wrap gap-2 mt-8">
                    @for (tag of currentSlide().tags; track tag) {
                      <span class="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-muted/50 px-3 py-1 text-xs font-mono text-muted-foreground">
                        <span class="w-1.5 h-1.5 rounded-full bg-primary"></span>{{ tag }}
                      </span>
                    }
                  </div>
                }
              </div>
            }
            @case ('content') {
              <div>
                @if (currentSlide().eyebrow) {
                  <p class="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4 flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500"></span>{{ currentSlide().eyebrow }}
                  </p>
                }
                <h2 class="text-3xl md:text-4xl font-extrabold tracking-tight mb-6">{{ currentSlide().title }}</h2>
                @if (currentSlide().body) {
                  <p class="text-base md:text-lg text-muted-foreground leading-relaxed mb-8 max-w-3xl">{{ currentSlide().body }}</p>
                }
                @if (currentSlide().bullets?.length) {
                  <ul class="space-y-4">
                    @for (b of currentSlide().bullets; track b; let i = $index) {
                      <li class="flex gap-4 items-baseline">
                        <span class="font-mono text-sm text-primary font-bold w-8 flex-shrink-0">{{ String(i + 1).padStart(2, '0') }}</span>
                        <span class="text-base text-foreground leading-relaxed">{{ b }}</span>
                      </li>
                    }
                  </ul>
                }
              </div>
            }
            @case ('code') {
              <div>
                @if (currentSlide().eyebrow) {
                  <p class="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4 flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500"></span>{{ currentSlide().eyebrow }}
                  </p>
                }
                <h2 class="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">{{ currentSlide().title }}</h2>
                @if (currentSlide().body) {
                  <p class="text-base text-muted-foreground leading-relaxed mb-6 max-w-3xl">{{ currentSlide().body }}</p>
                }
                <div class="rounded-xl border border-border/60 bg-muted overflow-hidden">
                  <div class="flex items-center gap-2 px-4 py-2.5 border-b border-border/40 bg-card/50">
                    <span class="w-3 h-3 rounded-full bg-red-500/70"></span>
                    <span class="w-3 h-3 rounded-full bg-yellow-500/70"></span>
                    <span class="w-3 h-3 rounded-full bg-green-500/70"></span>
                    <span class="ml-auto font-mono text-xs text-muted-foreground">{{ currentSlide().lang || 'code' }}</span>
                  </div>
                  <pre class="p-5 text-sm font-mono leading-relaxed overflow-x-auto"><code>{{ currentSlide().code }}</code></pre>
                </div>
              </div>
            }
            @case ('grid') {
              <div>
                @if (currentSlide().eyebrow) {
                  <p class="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4 flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500"></span>{{ currentSlide().eyebrow }}
                  </p>
                }
                <h2 class="text-3xl md:text-4xl font-extrabold tracking-tight mb-8">{{ currentSlide().title }}</h2>
                @if (currentSlide().body) {
                  <p class="text-base text-muted-foreground leading-relaxed mb-8 max-w-3xl">{{ currentSlide().body }}</p>
                }
                <div class="grid md:grid-cols-2 gap-4">
                  @for (item of currentSlide().items; track item.title; let i = $index) {
                    <div class="rounded-xl border border-border/60 bg-card p-5">
                      <div class="font-mono text-xs text-primary mb-2">{{ String(i + 1).padStart(2, '0') }}</div>
                      <div class="text-base font-semibold mb-1.5">{{ item.title }}</div>
                      <div class="text-sm text-muted-foreground leading-relaxed">{{ item.desc }}</div>
                    </div>
                  }
                </div>
              </div>
            }
            @case ('image') {
              <div>
                @if (currentSlide().eyebrow) {
                  <p class="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4 flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500"></span>{{ currentSlide().eyebrow }}
                  </p>
                }
                <h2 class="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">{{ currentSlide().title }}</h2>
                @if (currentSlide().caption) {
                  <p class="text-base text-muted-foreground mb-6">{{ currentSlide().caption }}</p>
                }
                <div class="rounded-xl border border-border/60 overflow-hidden bg-white">
                  <img [src]="currentSlide().src" [alt]="currentSlide().title" class="w-full" loading="lazy" />
                </div>
              </div>
            }
            @case ('end') {
              <div class="flex-1 flex flex-col justify-center">
                <h2 class="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">{{ currentSlide().title }}</h2>
                @if (currentSlide().subtitle) {
                  <p class="text-lg text-muted-foreground mb-10 max-w-2xl">{{ currentSlide().subtitle }}</p>
                }
                @if (currentSlide().links?.length) {
                  <div class="grid sm:grid-cols-2 gap-4 max-w-xl">
                    @for (link of currentSlide().links; track link.label) {
                      <div class="rounded-xl border border-border/60 bg-card p-4">
                        <div class="font-mono text-xs text-primary uppercase tracking-wider mb-1.5">{{ link.label }}</div>
                        <div class="font-mono text-sm text-foreground break-all">{{ link.value }}</div>
                      </div>
                    }
                  </div>
                }
              </div>
            }
          }
        </div>
      </main>

      <!-- Controls bar -->
      <footer class="flex items-center justify-center gap-3 px-6 h-16 border-t border-border/60 bg-card/80 backdrop-blur flex-shrink-0">
        <button (click)="prev()" [disabled]="idx() === 0"
                class="inline-flex items-center justify-center w-10 h-10 rounded-full border border-border/60 text-foreground hover:bg-accent transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <button (click)="toggleNarration()"
                class="inline-flex items-center justify-center w-10 h-10 rounded-full border text-foreground transition-colors"
                [class]="narrationOn() ? 'border-primary bg-primary/10 text-primary' : 'border-border/60 hover:bg-accent'">
          @if (narrationOn()) {
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>
          } @else {
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>
          }
        </button>
        <button (click)="toggleAutoAdvance()"
                class="inline-flex items-center gap-1.5 rounded-full border px-3 h-10 text-xs font-mono transition-colors"
                [class]="autoAdvance() ? 'border-primary bg-primary/10 text-primary' : 'border-border/60 text-muted-foreground hover:bg-accent'">
          {{ autoAdvance() ? 'AUTO: ON' : 'AUTO: OFF' }}
        </button>
        <button (click)="next()" [disabled]="idx() === slides().length - 1"
                class="inline-flex items-center justify-center w-10 h-10 rounded-full border border-border/60 text-foreground hover:bg-accent transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
        </button>
      </footer>
    </div>
  `,
})
export class SlidePlayerComponent implements OnDestroy {
  slides = input.required<SlideData[]>();
  deckTitle = input<string>('Tutorial');
  backUrl = input<string>('/');

  idx = signal(0);
  narrationOn = signal(true);
  autoAdvance = signal(true);
  speaking = signal(false);
  private synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
  private utterance: SpeechSynthesisUtterance | null = null;

  currentSlide = computed(() => this.slides()[this.idx()]);

  String = String;

  @HostListener('window:keydown', ['$event'])
  onKey(e: KeyboardEvent) {
    if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); this.next(); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); this.prev(); }
    if (e.key === 'Escape') { window.location.href = this.backUrl(); }
  }

  prev() {
    if (this.idx() > 0) {
      this.idx.update(i => i - 1);
      this.speak();
    }
  }

  next() {
    if (this.idx() < this.slides().length - 1) {
      this.idx.update(i => i + 1);
      this.speak();
    }
  }

  toggleNarration() {
    this.narrationOn.update(v => !v);
    if (!this.narrationOn()) { this.stopSpeech(); }
    else { this.speak(); }
  }

  toggleAutoAdvance() {
    this.autoAdvance.update(v => !v);
  }

  private speak() {
    this.stopSpeech();
    if (!this.narrationOn() || !this.synth) return;
    const text = this.currentSlide().narration;
    if (!text) return;
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 1.0;
    u.onstart = () => this.speaking.set(true);
    u.onend = () => {
      this.speaking.set(false);
      if (this.autoAdvance() && this.idx() < this.slides().length - 1) {
        setTimeout(() => this.next(), 600);
      }
    };
    u.onerror = () => this.speaking.set(false);
    this.utterance = u;
    setTimeout(() => this.synth!.speak(u), 200);
  }

  private stopSpeech() {
    this.synth?.cancel();
    this.speaking.set(false);
    this.utterance = null;
  }

  ngOnDestroy() {
    this.stopSpeech();
  }
}
