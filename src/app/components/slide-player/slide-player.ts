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
            <span class="text-xs font-mono text-green-500 hidden sm:inline">NARRATING</span>
          }
          <button (click)="showScript.set(!showScript())"
                  [class.text-primary]="showScript()"
                  [class.border-primary]="showScript()"
                  class="hidden md:inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M3 12h18"/><path d="M3 18h12"/></svg>
            Script
          </button>
          <a [href]="backUrl()" class="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            Close
          </a>
        </div>
      </header>

      <!-- Clickable progress bar (tap any slide to jump) -->
      <div class="h-2 bg-muted flex-shrink-0 flex gap-[1px] px-0.5" role="progressbar" [attr.aria-valuenow]="idx() + 1" [attr.aria-valuemax]="slides().length">
        @for (_ of slides(); track $index) {
          <button (click)="jumpTo($index)"
                  [attr.aria-label]="'Go to slide ' + ($index + 1)"
                  class="flex-1 h-full rounded-sm transition-all hover:opacity-80 cursor-pointer"
                  [class.bg-gradient-to-r]="$index <= idx()"
                  [class.from-purple-500]="$index <= idx()"
                  [class.to-blue-500]="$index <= idx()"
                  [class.bg-muted-foreground\\/20]="$index > idx()"></button>
        }
      </div>

      <!-- Narrator script panel (desktop only, when toggled on) -->
      @if (showScript()) {
        <div class="hidden md:block border-b border-border/60 bg-primary/5 backdrop-blur flex-shrink-0">
          <div class="max-w-5xl mx-auto px-6 py-3 flex gap-3 items-start">
            <span class="font-mono text-[10px] uppercase tracking-[0.2em] text-primary font-bold flex-shrink-0 mt-0.5">NARRATOR</span>
            <p class="text-sm text-foreground/90 leading-relaxed">{{ currentSlide().narration }}</p>
          </div>
        </div>
      }

      <!-- Slide content -->
      <main class="flex-1 overflow-y-auto relative">
        <!-- Animated background visuals per slide type -->
        <div class="absolute inset-0 pointer-events-none overflow-hidden -z-0">
          @switch (currentSlide().type) {
            @case ('title') {
              <svg class="absolute top-1/2 right-[-100px] -translate-y-1/2 w-[600px] h-[600px] opacity-30" viewBox="0 0 400 400" fill="none">
                <defs>
                  <linearGradient id="ring-g" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#a855f7"/><stop offset="100%" stop-color="#3b82f6"/>
                  </linearGradient>
                </defs>
                <circle cx="200" cy="200" r="180" stroke="url(#ring-g)" stroke-width="1" fill="none" class="slide-ring-1"/>
                <circle cx="200" cy="200" r="130" stroke="url(#ring-g)" stroke-width="1" fill="none" class="slide-ring-2"/>
                <circle cx="200" cy="200" r="80" stroke="url(#ring-g)" stroke-width="1.5" fill="none" class="slide-ring-3"/>
                <circle cx="380" cy="200" r="6" fill="#a855f7" class="slide-orbit-1"/>
                <circle cx="330" cy="200" r="4" fill="#3b82f6" class="slide-orbit-2"/>
                <circle cx="280" cy="200" r="5" fill="#ec4899" class="slide-orbit-3"/>
              </svg>
            }
            @case ('content') {
              <svg class="absolute top-10 right-10 w-48 h-48 opacity-20" viewBox="0 0 200 200" fill="none">
                <rect x="20" y="20" width="60" height="60" rx="8" stroke="#a855f7" stroke-width="1.5" class="slide-float-1"/>
                <rect x="110" y="40" width="50" height="50" rx="8" stroke="#3b82f6" stroke-width="1.5" class="slide-float-2"/>
                <rect x="50" y="110" width="70" height="70" rx="8" stroke="#ec4899" stroke-width="1.5" class="slide-float-3"/>
                <circle cx="155" cy="140" r="18" stroke="#f97316" stroke-width="1.5" class="slide-float-1"/>
              </svg>
            }
            @case ('code') {
              <svg class="absolute top-10 right-10 w-56 h-56 opacity-15" viewBox="0 0 200 200" fill="none">
                <polyline points="30,60 60,40 30,20" stroke="#a855f7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="slide-float-1"/>
                <polyline points="30,180 60,160 30,140" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="slide-float-2"/>
                <line x1="80" y1="50" x2="160" y2="50" stroke="#ec4899" stroke-width="2" stroke-linecap="round" class="slide-pulse-1"/>
                <line x1="80" y1="100" x2="140" y2="100" stroke="#f97316" stroke-width="2" stroke-linecap="round" class="slide-pulse-2"/>
                <line x1="80" y1="150" x2="170" y2="150" stroke="#10b981" stroke-width="2" stroke-linecap="round" class="slide-pulse-3"/>
              </svg>
            }
            @case ('grid') {
              <svg class="absolute bottom-10 right-10 w-60 h-60 opacity-15" viewBox="0 0 200 200" fill="none">
                <path d="M 40 100 L 100 40 L 160 100 L 100 160 Z" stroke="#a855f7" stroke-width="1.5" class="slide-rotate-slow"/>
                <path d="M 60 100 L 100 60 L 140 100 L 100 140 Z" stroke="#3b82f6" stroke-width="1.5" class="slide-rotate-reverse"/>
                <circle cx="100" cy="100" r="6" fill="#ec4899" class="slide-pulse-1"/>
              </svg>
            }
            @case ('end') {
              <svg class="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 400 400" fill="none" preserveAspectRatio="xMidYMid slice">
                <circle cx="80" cy="60" r="4" fill="#a855f7" class="slide-confetti-1"/>
                <circle cx="320" cy="80" r="5" fill="#3b82f6" class="slide-confetti-2"/>
                <circle cx="150" cy="120" r="3" fill="#ec4899" class="slide-confetti-3"/>
                <circle cx="280" cy="160" r="4" fill="#f97316" class="slide-confetti-4"/>
                <circle cx="60" cy="220" r="5" fill="#10b981" class="slide-confetti-5"/>
                <circle cx="340" cy="280" r="3" fill="#a855f7" class="slide-confetti-1"/>
                <circle cx="200" cy="320" r="4" fill="#3b82f6" class="slide-confetti-2"/>
                <path d="M 180 180 L 195 200 L 220 165" stroke="#10b981" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" fill="none" class="slide-check"/>
              </svg>
            }
          }
        </div>

        <div class="max-w-5xl mx-auto px-6 py-12 md:py-16 min-h-full flex flex-col relative z-10">
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
                  <ul class="grid gap-3 md:gap-4 mt-2">
                    @for (b of currentSlide().bullets; track b; let i = $index) {
                      <li class="flex gap-4 items-start rounded-xl border border-border/60 bg-card px-5 py-4 hover:border-primary/40 transition-colors">
                        <span class="font-mono text-xs text-primary font-bold flex-shrink-0 mt-1 inline-flex items-center justify-center w-7 h-7 rounded-full bg-primary/10">{{ String(i + 1).padStart(2, '0') }}</span>
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
                    <button (click)="copyCode()" class="ml-2 inline-flex items-center gap-1 rounded-md border border-border/60 px-2 py-1 text-xs font-mono text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
                      @if (copied()) {
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="text-green-500"><polyline points="20 6 9 17 4 12"/></svg>
                        <span class="text-green-500">Copied</span>
                      } @else {
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                        Copy
                      }
                    </button>
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
      <footer class="flex flex-wrap items-center justify-center gap-2 md:gap-3 px-4 py-3 md:py-0 md:h-16 border-t border-border/60 bg-card/80 backdrop-blur flex-shrink-0">
        <!-- Prev -->
        <button (click)="prev()" [disabled]="idx() === 0"
                aria-label="Previous slide"
                class="inline-flex items-center justify-center w-10 h-10 rounded-full border border-border/60 text-foreground hover:bg-accent transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>

        <!-- Play / Pause -->
        <button (click)="togglePlay()"
                [attr.aria-label]="speaking() ? 'Pause narration' : 'Play narration'"
                class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 text-white shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-0.5 transition-all">
          @if (speaking()) {
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>
          } @else {
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="6 3 20 12 6 21 6 3"/></svg>
          }
        </button>

        <!-- Stop -->
        <button (click)="stopAll()"
                aria-label="Stop narration"
                class="inline-flex items-center justify-center w-10 h-10 rounded-full border border-border/60 text-foreground hover:bg-accent transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="4" y="4" width="16" height="16" rx="2"/></svg>
        </button>

        <!-- Next -->
        <button (click)="next()" [disabled]="idx() === slides().length - 1"
                aria-label="Next slide"
                class="inline-flex items-center justify-center w-10 h-10 rounded-full border border-border/60 text-foreground hover:bg-accent transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
        </button>

        <div class="w-px h-6 bg-border/60 mx-1"></div>

        <!-- Auto-advance -->
        <button (click)="toggleAutoAdvance()"
                class="inline-flex items-center gap-1.5 rounded-full border px-3 h-10 text-xs font-mono transition-colors"
                [class]="autoAdvance() ? 'border-primary bg-primary/10 text-primary' : 'border-border/60 text-muted-foreground hover:bg-accent'">
          {{ autoAdvance() ? 'AUTO: ON' : 'AUTO: OFF' }}
        </button>

        <!-- Voice selector -->
        @if (availableVoices().length > 0) {
          <select (change)="onVoiceChange($event)"
                  class="rounded-full border border-border/60 bg-card h-10 px-3 text-xs font-mono text-foreground hover:bg-accent transition-colors cursor-pointer max-w-[180px]"
                  aria-label="Voice selector">
            @for (v of availableVoices(); track v.name) {
              <option [value]="v.name" [selected]="v.name === selectedVoice()">{{ v.name }}</option>
            }
          </select>
        }

        <!-- Rate selector -->
        <select (change)="onRateChange($event)"
                class="rounded-full border border-border/60 bg-card h-10 px-3 text-xs font-mono text-foreground hover:bg-accent transition-colors cursor-pointer"
                aria-label="Speech rate">
          @for (r of rates; track r) {
            <option [value]="r" [selected]="r === rate()">{{ r }}×</option>
          }
        </select>
      </footer>
    </div>
  `,
})
export class SlidePlayerComponent implements OnDestroy {
  slides = input.required<SlideData[]>();
  deckTitle = input<string>('Tutorial');
  backUrl = input<string>('/');

  idx = signal(0);
  autoAdvance = signal(true);
  speaking = signal(false);
  showScript = signal(false);
  copied = signal(false);
  availableVoices = signal<SpeechSynthesisVoice[]>([]);
  selectedVoice = signal<string>('');
  rate = signal<number>(1.0);
  rates = [0.75, 1.0, 1.25, 1.5];

  private synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
  private utterance: SpeechSynthesisUtterance | null = null;
  private userInitiated = false;

  currentSlide = computed(() => this.slides()[this.idx()]);

  String = String;

  constructor() {
    if (this.synth) {
      this.loadVoices();
      this.synth.onvoiceschanged = () => this.loadVoices();
    }
    // Load saved prefs
    if (typeof localStorage !== 'undefined') {
      const savedVoice = localStorage.getItem('slides.voice');
      const savedRate = localStorage.getItem('slides.rate');
      if (savedVoice) this.selectedVoice.set(savedVoice);
      if (savedRate) this.rate.set(parseFloat(savedRate));
    }
  }

  private loadVoices() {
    if (!this.synth) return;
    const all = this.synth.getVoices();
    const english = all.filter(v => v.lang.toLowerCase().startsWith('en'));
    english.sort((a, b) => {
      const score = (v: SpeechSynthesisVoice) => {
        if (/google uk.*male/i.test(v.name)) return -100;
        if (/google uk/i.test(v.name)) return -50;
        if (/google/i.test(v.name)) return -20;
        if (/daniel|oliver|arthur|samantha/i.test(v.name)) return -10;
        return 0;
      };
      return score(a) - score(b);
    });
    this.availableVoices.set(english);
    if (!this.selectedVoice() && english.length > 0) {
      this.selectedVoice.set(english[0].name);
    }
  }

  @HostListener('window:keydown', ['$event'])
  onKey(e: KeyboardEvent) {
    if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); this.next(); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); this.prev(); }
    if (e.key === 'Escape') { window.location.href = this.backUrl(); }
    if (e.key === 'p' || e.key === 'P') { this.togglePlay(); }
    if (e.key === 's' || e.key === 'S') { this.stopAll(); }
  }

  prev() {
    if (this.idx() > 0) {
      this.idx.update(i => i - 1);
      if (this.userInitiated) this.speak();
    }
  }

  jumpTo(i: number) {
    if (i >= 0 && i < this.slides().length && i !== this.idx()) {
      this.idx.set(i);
      this.userInitiated = true;
      this.speak();
    }
  }

  async copyCode() {
    const code = this.currentSlide().code;
    if (!code || typeof navigator === 'undefined' || !navigator.clipboard) return;
    try {
      await navigator.clipboard.writeText(code);
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000);
    } catch {
      // Clipboard API failed (permissions, not HTTPS, etc.) — silently fail
    }
  }

  next() {
    if (this.idx() < this.slides().length - 1) {
      this.idx.update(i => i + 1);
      if (this.userInitiated) this.speak();
    }
  }

  togglePlay() {
    if (this.speaking()) {
      this.synth?.pause();
      this.speaking.set(false);
    } else if (this.synth?.paused) {
      this.synth.resume();
      this.speaking.set(true);
    } else {
      this.userInitiated = true;
      this.speak();
    }
  }

  stopAll() {
    this.userInitiated = false;
    this.synth?.cancel();
    this.speaking.set(false);
    this.utterance = null;
  }

  toggleAutoAdvance() {
    this.autoAdvance.update(v => !v);
  }

  onVoiceChange(e: Event) {
    const name = (e.target as HTMLSelectElement).value;
    this.selectedVoice.set(name);
    if (typeof localStorage !== 'undefined') localStorage.setItem('slides.voice', name);
    if (this.userInitiated) this.speak();
  }

  onRateChange(e: Event) {
    const r = parseFloat((e.target as HTMLSelectElement).value);
    this.rate.set(r);
    if (typeof localStorage !== 'undefined') localStorage.setItem('slides.rate', String(r));
    if (this.userInitiated) this.speak();
  }

  private speak() {
    this.synth?.cancel();
    if (!this.synth) return;
    const text = this.currentSlide().narration;
    if (!text) return;
    const u = new SpeechSynthesisUtterance(text);
    u.rate = this.rate();
    u.pitch = 1.0;
    u.volume = 1.0;
    const voice = this.availableVoices().find(v => v.name === this.selectedVoice());
    if (voice) u.voice = voice;
    u.onstart = () => this.speaking.set(true);
    u.onend = () => {
      this.speaking.set(false);
      if (this.autoAdvance() && this.userInitiated && this.idx() < this.slides().length - 1) {
        setTimeout(() => this.next(), 600);
      }
    };
    u.onerror = () => this.speaking.set(false);
    this.utterance = u;
    setTimeout(() => this.synth!.speak(u), 200);
  }

  ngOnDestroy() {
    this.stopAll();
  }
}
