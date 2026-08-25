import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, ViewEncapsulation, computed, input, signal, viewChild } from '@angular/core';
import { ResolvedSlideFocusStep, SlideCompanionAnchor, SlideData, resolveSlideFocusSteps } from './slide-focus';

export type { SlideData, SlideFocusStep } from './slide-focus';

type ResolvedCompanionAnchor = Exclude<SlideCompanionAnchor, 'auto'> | 'dock';

interface CompanionPlacement {
  x: number;
  y: number;
  anchor: ResolvedCompanionAnchor;
  score: number;
}

interface RelativeRect {
  left: number;
  top: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
}

@Component({
  selector: 'app-slide-player',
  styleUrl: './slide-player.styles.css',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  template: `
    <div class="fixed inset-0 z-[100] bg-background flex flex-col overflow-hidden">
      <!-- Top bar -->
      <header class="flex h-14 min-w-0 flex-shrink-0 items-center justify-between gap-2 border-b border-border/60 bg-card/80 px-3 backdrop-blur sm:px-6">
        <div class="flex min-w-0 items-center gap-2 sm:gap-3">
          <span class="min-w-0 truncate text-xs font-mono text-muted-foreground uppercase tracking-wider">{{ deckTitle() }}</span>
          <span class="shrink-0 text-xs text-muted-foreground">{{ idx() + 1 }} / {{ slides().length }}</span>
        </div>
        <div class="flex shrink-0 items-center gap-2">
          <button type="button"
                  (click)="toggleGuide()"
                  aria-label="Teaching Guide"
                  [attr.aria-pressed]="guideEnabled()"
                  [style.background-color]="guideEnabled() ? 'var(--md-sys-color-primary-container)' : 'var(--md-sys-color-surface-container)'"
                  [style.border-color]="guideEnabled() ? 'var(--md-sys-color-primary)' : 'var(--md-sys-color-outline-variant)'"
                  [style.color]="guideEnabled() ? 'var(--md-sys-color-on-primary-container)' : 'var(--md-sys-color-on-surface-variant)'"
                  class="md3-focus-ring inline-flex h-11 min-w-11 items-center justify-center gap-2 rounded-[var(--md-sys-shape-corner-full)] border px-3 text-xs font-bold transition-[background-color,border-color,color,transform] duration-200 active:scale-[0.98]">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 8 3.5 4.5 8 6"/><path d="m19 8 1.5-3.5L16 6"/><rect x="5" y="6" width="14" height="14" rx="7"/><path d="M8.5 12h.01M15.5 12h.01"/><path d="M9 16c2 1.3 4 1.3 6 0"/></svg>
            <span class="hidden sm:inline">Guide</span>
          </button>
          @if (speaking()) {
            <span class="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span class="text-xs font-mono text-green-500 hidden sm:inline">NARRATING</span>
          }
          <button type="button"
                  (click)="toggleScript()"
                  [attr.aria-controls]="showScript() ? 'slide-script-panel' : null"
                  [attr.aria-expanded]="showScript()"
                  [class.text-primary]="showScript()"
                  [class.border-primary]="showScript()"
                  class="hidden md:inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M3 12h18"/><path d="M3 18h12"/></svg>
            Script
          </button>
          <a [href]="backUrl()" aria-label="Close slides" class="inline-flex h-11 w-11 items-center justify-center gap-1.5 rounded-full border border-border/60 bg-card px-3 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground sm:w-auto">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            <span class="hidden sm:inline">Close</span>
          </a>
        </div>
      </header>

      <!-- Clickable progress bar (tap any slide to jump) -->
      <div class="h-2 bg-muted flex-shrink-0 flex gap-[1px] px-0.5" role="progressbar" [attr.aria-valuenow]="idx() + 1" [attr.aria-valuemax]="slides().length">
        @for (_ of slides(); track $index) {
          <button type="button"
                  (click)="jumpTo($index)"
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
        <div id="slide-script-panel" class="hidden md:block border-b border-border/60 bg-primary/5 backdrop-blur flex-shrink-0">
          <div class="max-w-5xl mx-auto px-6 py-3 flex gap-3 items-start">
            <span class="font-mono text-[10px] uppercase tracking-[0.2em] text-primary font-bold flex-shrink-0 mt-0.5">NARRATOR</span>
            <p class="text-sm text-foreground/90 leading-relaxed">{{ currentNarrationText() }}</p>
          </div>
        </div>
      }

      <!-- Slide content -->
      <main #slideViewport class="flex-1 min-h-0 overflow-y-auto relative">
        @if (audioPrompt()) {
          <section
            role="dialog"
            aria-modal="false"
            aria-labelledby="slide-audio-prompt-title"
            aria-describedby="slide-audio-prompt-desc"
            class="absolute inset-x-4 bottom-6 z-40 mx-auto max-w-xl rounded-[var(--md-sys-shape-corner-xl)] border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-high)] p-5 shadow-[var(--md-sys-elevation-3)] md:bottom-8">
            <div class="flex items-start gap-4">
              <span class="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[color:var(--md-sys-color-primary-container)] text-[color:var(--md-sys-color-on-primary-container)]">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M19 5a10 10 0 0 1 0 14"/></svg>
              </span>
              <div class="min-w-0 flex-1">
                <h2 id="slide-audio-prompt-title" class="text-base font-bold text-[color:var(--md-sys-color-on-surface)]">{{ audioPromptTitle() }}</h2>
                <p id="slide-audio-prompt-desc" class="mt-1 text-sm leading-relaxed text-[color:var(--md-sys-color-on-surface-variant)]">{{ audioPromptMessage() }}</p>
                <div class="mt-4 flex flex-wrap gap-2">
                  @if (synthAvailable()) {
                    <button type="button" (click)="startNarrationWithConsent()" class="md3-button-filled">
                      Start narration
                    </button>
                  }
                  <button type="button" (click)="continueWithoutNarration()" class="md3-button-outlined">
                    Continue without audio
                  </button>
                </div>
              </div>
            </div>
          </section>
        }

        <!-- Animated background visuals per slide type -->
        <div class="absolute inset-0 pointer-events-none overflow-hidden -z-0">
          @switch (currentSlide().type) {
            @case ('title') {
              <svg class="absolute top-1/2 right-[-100px] -translate-y-1/2 w-[600px] h-[600px] opacity-30" viewBox="0 0 400 400" fill="none">
                <defs>
                  <linearGradient id="ring-g" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="var(--md-sys-color-tertiary)"/><stop offset="100%" stop-color="var(--md-sys-color-primary)"/>
                  </linearGradient>
                </defs>
                <circle cx="200" cy="200" r="180" stroke="url(#ring-g)" stroke-width="1" fill="none" class="slide-ring-1"/>
                <circle cx="200" cy="200" r="130" stroke="url(#ring-g)" stroke-width="1" fill="none" class="slide-ring-2"/>
                <circle cx="200" cy="200" r="80" stroke="url(#ring-g)" stroke-width="1.5" fill="none" class="slide-ring-3"/>
                <circle cx="380" cy="200" r="6" fill="var(--md-sys-color-tertiary)" class="slide-orbit-1"/>
                <circle cx="330" cy="200" r="4" fill="var(--md-sys-color-primary)" class="slide-orbit-2"/>
                <circle cx="280" cy="200" r="5" fill="var(--md-sys-color-secondary)" class="slide-orbit-3"/>
              </svg>
            }
            @case ('content') {
              <svg class="absolute top-10 right-10 w-48 h-48 opacity-20" viewBox="0 0 200 200" fill="none">
                <rect x="20" y="20" width="60" height="60" rx="8" stroke="var(--md-sys-color-tertiary)" stroke-width="1.5" class="slide-float-1"/>
                <rect x="110" y="40" width="50" height="50" rx="8" stroke="var(--md-sys-color-primary)" stroke-width="1.5" class="slide-float-2"/>
                <rect x="50" y="110" width="70" height="70" rx="8" stroke="var(--md-sys-color-secondary)" stroke-width="1.5" class="slide-float-3"/>
                <circle cx="155" cy="140" r="18" stroke="var(--md-sys-color-tertiary)" stroke-width="1.5" class="slide-float-1"/>
              </svg>
            }
            @case ('code') {
              <svg class="absolute top-10 right-10 w-56 h-56 opacity-15" viewBox="0 0 200 200" fill="none">
                <polyline points="30,60 60,40 30,20" stroke="var(--md-sys-color-tertiary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="slide-float-1"/>
                <polyline points="30,180 60,160 30,140" stroke="var(--md-sys-color-primary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="slide-float-2"/>
                <line x1="80" y1="50" x2="160" y2="50" stroke="var(--md-sys-color-secondary)" stroke-width="2" stroke-linecap="round" class="slide-pulse-1"/>
                <line x1="80" y1="100" x2="140" y2="100" stroke="var(--md-sys-color-tertiary)" stroke-width="2" stroke-linecap="round" class="slide-pulse-2"/>
                <line x1="80" y1="150" x2="170" y2="150" stroke="var(--md-sys-color-secondary)" stroke-width="2" stroke-linecap="round" class="slide-pulse-3"/>
              </svg>
            }
            @case ('grid') {
              <svg class="absolute bottom-10 right-10 w-60 h-60 opacity-15" viewBox="0 0 200 200" fill="none">
                <path d="M 40 100 L 100 40 L 160 100 L 100 160 Z" stroke="var(--md-sys-color-tertiary)" stroke-width="1.5" class="slide-rotate-slow"/>
                <path d="M 60 100 L 100 60 L 140 100 L 100 140 Z" stroke="var(--md-sys-color-primary)" stroke-width="1.5" class="slide-rotate-reverse"/>
                <circle cx="100" cy="100" r="6" fill="var(--md-sys-color-secondary)" class="slide-pulse-1"/>
              </svg>
            }
            @case ('end') {
              <svg class="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 400 400" fill="none" preserveAspectRatio="xMidYMid slice">
                <circle cx="80" cy="60" r="4" fill="var(--md-sys-color-tertiary)" class="slide-confetti-1"/>
                <circle cx="320" cy="80" r="5" fill="var(--md-sys-color-primary)" class="slide-confetti-2"/>
                <circle cx="150" cy="120" r="3" fill="var(--md-sys-color-secondary)" class="slide-confetti-3"/>
                <circle cx="280" cy="160" r="4" fill="var(--md-sys-color-tertiary)" class="slide-confetti-4"/>
                <circle cx="60" cy="220" r="5" fill="var(--md-sys-color-secondary)" class="slide-confetti-5"/>
                <circle cx="340" cy="280" r="3" fill="var(--md-sys-color-tertiary)" class="slide-confetti-1"/>
                <circle cx="200" cy="320" r="4" fill="var(--md-sys-color-primary)" class="slide-confetti-2"/>
                <path d="M 180 180 L 195 200 L 220 165" stroke="var(--md-sys-color-secondary)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" fill="none" class="slide-check"/>
              </svg>
            }
          }
        </div>

        <div #slideStage
             [class.slide-stage-guide-enabled]="guideEnabled() && currentSlide().type !== 'title' && currentSlide().type !== 'end'"
             class="slide-stage max-w-5xl mx-auto px-6 py-12 md:py-16 min-h-full flex flex-col relative z-10">
          @switch (currentSlide().type) {
            @case ('title') {
              <div class="flex-1 flex flex-col justify-center">
                @if (currentSlide().eyebrow) {
                  <p class="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground mb-6">{{ currentSlide().eyebrow }}</p>
                }
                <h1 data-slide-focus="title" [class.slide-focus-active]="isFocusActive('title')" class="slide-focus-target text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.05] mb-6">{{ currentSlide().title }}</h1>
                @if (currentSlide().subtitle) {
                  <p data-slide-focus="subtitle" [class.slide-focus-active]="isFocusActive('subtitle')" class="slide-focus-target text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl">{{ currentSlide().subtitle }}</p>
                }
                @if (currentSlide().tags?.length) {
                  <div data-slide-focus="tags" [class.slide-focus-active]="isFocusActive('tags')" class="slide-focus-target flex flex-wrap gap-2 mt-8">
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
                <h2 data-slide-focus="title" [class.slide-focus-active]="isFocusActive('title')" class="slide-focus-target text-3xl md:text-4xl font-extrabold tracking-tight mb-6">{{ currentSlide().title }}</h2>
                @if (currentSlide().body) {
                  <p data-slide-focus="body" [class.slide-focus-active]="isFocusActive('body')" class="slide-focus-target text-base md:text-lg text-muted-foreground leading-relaxed mb-8 max-w-3xl">{{ currentSlide().body }}</p>
                }
                @if (currentSlide().bullets?.length) {
                  <ul class="grid gap-3 md:gap-4 mt-2">
                    @for (b of currentSlide().bullets; track b; let i = $index) {
                      <li [attr.data-slide-focus]="'bullet:' + i" [class.slide-focus-active]="isFocusActive('bullet:' + i)" class="slide-focus-target flex gap-4 items-start rounded-xl border border-border/60 bg-card px-5 py-4 hover:border-primary/40 transition-colors">
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
                <h2 data-slide-focus="title" [class.slide-focus-active]="isFocusActive('title')" class="slide-focus-target text-3xl md:text-4xl font-extrabold tracking-tight mb-4">{{ currentSlide().title }}</h2>
                @if (currentSlide().body) {
                  <p data-slide-focus="body" [class.slide-focus-active]="isFocusActive('body')" class="slide-focus-target text-base text-muted-foreground leading-relaxed mb-6 max-w-3xl">{{ currentSlide().body }}</p>
                }
                <div data-slide-focus="code" [class.slide-focus-active]="isFocusActive('code')" class="slide-focus-target rounded-xl border border-border/60 bg-muted overflow-hidden">
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
                <h2 data-slide-focus="title" [class.slide-focus-active]="isFocusActive('title')" class="slide-focus-target text-3xl md:text-4xl font-extrabold tracking-tight mb-8">{{ currentSlide().title }}</h2>
                @if (currentSlide().body) {
                  <p data-slide-focus="body" [class.slide-focus-active]="isFocusActive('body')" class="slide-focus-target text-base text-muted-foreground leading-relaxed mb-8 max-w-3xl">{{ currentSlide().body }}</p>
                }
                <div class="grid md:grid-cols-2 gap-4">
                  @for (item of currentSlide().items; track item.title; let i = $index) {
                    <div [attr.data-slide-focus]="'item:' + i" [class.slide-focus-active]="isFocusActive('item:' + i)" class="slide-focus-target rounded-xl border border-border/60 bg-card p-5">
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
                <h2 data-slide-focus="title" [class.slide-focus-active]="isFocusActive('title')" class="slide-focus-target text-3xl md:text-4xl font-extrabold tracking-tight mb-4">{{ currentSlide().title }}</h2>
                @if (currentSlide().caption) {
                  <p data-slide-focus="caption" [class.slide-focus-active]="isFocusActive('caption')" class="slide-focus-target text-base text-muted-foreground mb-6">{{ currentSlide().caption }}</p>
                }
                <div data-slide-focus="image" [class.slide-focus-active]="isFocusActive('image')" class="slide-focus-target rounded-xl border border-border/60 overflow-hidden bg-white">
                  <img [src]="currentSlide().src"
                       [alt]="currentSlide().title"
                       [attr.width]="currentSlide().imageWidth ?? null"
                       [attr.height]="currentSlide().imageHeight ?? null"
                       sizes="(min-width: 1024px) 960px, calc(100vw - 3rem)"
                       (load)="scheduleCompanionPosition()"
                       class="w-full"
                       loading="lazy"
                       decoding="async" />
                </div>
              </div>
            }
            @case ('end') {
              <div class="flex-1 flex flex-col justify-center">
                <h2 data-slide-focus="title" [class.slide-focus-active]="isFocusActive('title')" class="slide-focus-target text-4xl md:text-5xl font-extrabold tracking-tight mb-4">{{ currentSlide().title }}</h2>
                @if (currentSlide().subtitle) {
                  <p data-slide-focus="subtitle" [class.slide-focus-active]="isFocusActive('subtitle')" class="slide-focus-target text-lg text-muted-foreground mb-10 max-w-2xl">{{ currentSlide().subtitle }}</p>
                }
                @if (currentSlide().links?.length) {
                  <div class="grid sm:grid-cols-2 gap-4 max-w-xl">
                    @for (link of currentSlide().links; track link.label) {
                      <div [attr.data-slide-focus]="'link:' + $index" [class.slide-focus-active]="isFocusActive('link:' + $index)" class="slide-focus-target rounded-xl border border-border/60 bg-card p-4">
                        <div class="font-mono text-xs text-primary uppercase tracking-wider mb-1.5">{{ link.label }}</div>
                        <div class="font-mono text-sm text-foreground break-all">{{ link.value }}</div>
                      </div>
                    }
                  </div>
                }
              </div>
            }
          }

          @if (guideEnabled() && !audioPrompt()) {
            <svg class="slide-companion-connector" [attr.viewBox]="connectorViewBox()" preserveAspectRatio="none" aria-hidden="true">
              <path [attr.d]="connectorPath()"></path>
              @if (connectorTarget()) {
                <circle [attr.cx]="connectorTarget()!.x" [attr.cy]="connectorTarget()!.y" r="5"></circle>
              }
            </svg>

            <div #slideCompanion
                 aria-hidden="true"
                 [class.slide-companion-positioned]="companionPositioned()"
                 [class.slide-companion-facing-right]="companionFacing() === 'right'"
                 [class.slide-companion-speaking]="speaking()"
                 [class.slide-companion-travelling]="companionTravelling()"
                 [style.transform]="companionTransform()"
                 class="slide-companion">
              <div class="slide-companion-pet-stage">
                <svg class="slide-companion-pet" viewBox="0 0 160 190" role="presentation">
                  <defs>
                    <linearGradient id="slide-companion-body-gradient" x1="38" y1="35" x2="126" y2="170" gradientUnits="userSpaceOnUse">
                      <stop stop-color="var(--md-sys-color-primary-container)"/>
                      <stop offset="1" stop-color="var(--md-sys-color-primary)"/>
                    </linearGradient>
                  </defs>
                  <ellipse cx="82" cy="177" rx="43" ry="8" fill="var(--md-sys-color-shadow)" opacity="0.24"/>
                  <g class="slide-companion-voice-wave" fill="none" stroke="var(--md-sys-color-tertiary)" stroke-linecap="round" stroke-width="4">
                    <path d="M130 76c10 7 10 20 0 27"/>
                    <path d="M140 67c18 13 18 34 0 47" opacity="0.58"/>
                  </g>
                  <g class="slide-companion-character">
                    <path d="M53 58C36 46 34 28 44 20c10-8 26 1 35 20" fill="var(--md-sys-color-secondary-container)" stroke="var(--md-sys-color-primary)" stroke-width="4"/>
                    <path d="M107 58c17-12 19-30 9-38-10-8-26 1-35 20" fill="var(--md-sys-color-secondary-container)" stroke="var(--md-sys-color-primary)" stroke-width="4"/>
                    <path d="M38 84c2-28 18-45 44-45s42 17 44 45l4 43c2 28-18 44-48 44s-50-16-48-44z" fill="url(#slide-companion-body-gradient)" stroke="var(--md-sys-color-primary)" stroke-width="4"/>
                    <path class="slide-companion-pointer-arm" d="M45 104c-16 0-27-7-35-19" fill="none" stroke="var(--md-sys-color-primary)" stroke-linecap="round" stroke-width="11"/>
                    <circle cx="10" cy="85" r="6" fill="var(--md-sys-color-primary-container)" stroke="var(--md-sys-color-primary)" stroke-width="3"/>
                    <path d="M119 109c11 7 16 18 14 30" fill="none" stroke="var(--md-sys-color-primary)" stroke-linecap="round" stroke-width="11"/>
                    <circle cx="133" cy="141" r="6" fill="var(--md-sys-color-primary-container)" stroke="var(--md-sys-color-primary)" stroke-width="3"/>
                    <ellipse cx="64" cy="83" rx="7" ry="10" fill="var(--md-sys-color-on-primary-container)"/>
                    <ellipse cx="101" cy="83" rx="7" ry="10" fill="var(--md-sys-color-on-primary-container)"/>
                    <circle cx="66" cy="80" r="2.4" fill="var(--md-sys-color-surface)"/>
                    <circle cx="103" cy="80" r="2.4" fill="var(--md-sys-color-surface)"/>
                    <path class="slide-companion-mouth-rest" d="M75 105c5 4 10 4 15 0" fill="none" stroke="var(--md-sys-color-on-primary-container)" stroke-linecap="round" stroke-width="4"/>
                    <ellipse class="slide-companion-mouth-open" cx="82" cy="108" rx="8" ry="6" fill="var(--md-sys-color-on-primary-container)"/>
                    <rect x="59" y="131" width="46" height="23" rx="11.5" fill="var(--md-sys-color-surface-container-high)"/>
                    <path d="M76 137l-6 5.5 6 5.5M89 137l6 5.5-6 5.5" fill="none" stroke="var(--md-sys-color-primary)" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"/>
                  </g>
                </svg>
              </div>
              <div class="slide-companion-status">
                <span class="slide-companion-status-dot"></span>
                <span>{{ companionStatusLabel() }}</span>
              </div>
            </div>
          }
        </div>
      </main>

      <!-- Controls bar -->
      <footer class="flex-shrink-0 border-t border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-low)] px-1 py-3 sm:px-4">
        <div class="mx-auto flex w-full max-w-4xl flex-wrap items-center justify-center gap-2 rounded-[var(--md-sys-shape-corner-full)] border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-high)] px-1 py-2 shadow-[var(--md-sys-elevation-1)] sm:px-3">
        <!-- Prev -->
        <button type="button" (click)="prev()" [disabled]="idx() === 0"
                aria-label="Previous slide"
                class="md3-focus-ring inline-flex h-11 w-11 items-center justify-center rounded-full border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container)] text-[color:var(--md-sys-color-on-surface-variant)] transition-[background-color,border-color,color,transform] duration-200 hover:bg-[color:var(--md-sys-color-primary-container)] hover:text-[color:var(--md-sys-color-on-primary-container)] active:scale-95 disabled:cursor-not-allowed disabled:opacity-40">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>
        </button>

        <!-- Play / Pause -->
        <button type="button" (click)="togglePlay()"
                [attr.aria-label]="mediaButtonLabel()"
                [attr.aria-pressed]="speaking()"
                [style.background-color]="speaking() ? 'var(--md-sys-color-primary-container)' : 'var(--md-sys-color-primary)'"
                [style.color]="speaking() ? 'var(--md-sys-color-on-primary-container)' : 'var(--md-sys-color-on-primary)'"
                class="md3-focus-ring inline-flex h-14 w-14 items-center justify-center rounded-full shadow-[var(--md-sys-elevation-2)] transition-[background-color,color,transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-[var(--md-sys-elevation-3)] active:translate-y-0 active:scale-95">
          @if (speaking()) {
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="5" width="4.5" height="14" rx="1.5"/><rect x="13.5" y="5" width="4.5" height="14" rx="1.5"/></svg>
          } @else {
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><polygon points="8 5 19 12 8 19 8 5"/></svg>
          }
        </button>

        <!-- Stop -->
        <button type="button" (click)="stopAll()"
                aria-label="Stop narration"
                class="md3-focus-ring inline-flex h-11 w-11 items-center justify-center rounded-full border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container)] text-[color:var(--md-sys-color-on-surface-variant)] transition-[background-color,border-color,color,transform] duration-200 hover:bg-[color:var(--md-sys-color-tertiary-container)] hover:text-[color:var(--md-sys-color-on-tertiary-container)] active:scale-95">
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>
        </button>

        <!-- Next -->
        <button type="button" (click)="next()" [disabled]="idx() === slides().length - 1"
                aria-label="Next slide"
                class="md3-focus-ring inline-flex h-11 w-11 items-center justify-center rounded-full border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container)] text-[color:var(--md-sys-color-on-surface-variant)] transition-[background-color,border-color,color,transform] duration-200 hover:bg-[color:var(--md-sys-color-primary-container)] hover:text-[color:var(--md-sys-color-on-primary-container)] active:scale-95 disabled:cursor-not-allowed disabled:opacity-40">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>
        </button>

        <div class="mx-1 hidden h-8 w-px bg-[color:var(--md-sys-color-outline-variant)] sm:block"></div>

        <span class="hidden min-w-20 text-center text-[11px] font-bold uppercase tracking-[0.16em] text-[color:var(--md-sys-color-on-surface-variant)] sm:inline">
          {{ narrationStatusLabel() }}
        </span>

        <!-- Auto-advance -->
        <button type="button" (click)="toggleAutoAdvance()"
                [attr.aria-pressed]="autoAdvance()"
                class="md3-focus-ring inline-flex h-11 items-center gap-2 rounded-[var(--md-sys-shape-corner-full)] border px-3 text-xs font-bold transition-[background-color,border-color,color,transform] duration-200 active:scale-[0.98] sm:px-4"
                [style.background-color]="autoAdvance() ? 'var(--md-sys-color-secondary-container)' : 'var(--md-sys-color-surface-container)'"
                [style.border-color]="autoAdvance() ? 'var(--md-sys-color-secondary)' : 'var(--md-sys-color-outline-variant)'"
                [style.color]="autoAdvance() ? 'var(--md-sys-color-on-secondary-container)' : 'var(--md-sys-color-on-surface-variant)'">
          <span class="inline-block h-2 w-2 rounded-full" [style.background-color]="autoAdvance() ? 'var(--md-sys-color-secondary)' : 'var(--md-sys-color-outline)'"></span>
          {{ autoAdvance() ? 'Auto' : 'Manual' }}
        </button>

        <!-- Voice selector -->
        @if (availableVoices().length > 0) {
          <label class="sr-only" for="slide-voice-select">Narration voice</label>
          <select id="slide-voice-select" (change)="onVoiceChange($event)"
                  class="md3-focus-ring h-11 min-w-0 max-w-[180px] cursor-pointer rounded-[var(--md-sys-shape-corner-full)] border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container)] px-3 text-xs font-semibold text-[color:var(--md-sys-color-on-surface)] transition-[background-color,border-color] duration-200 hover:bg-[color:var(--md-sys-color-surface-container-highest)] sm:max-w-[220px] sm:px-4"
                  aria-label="Narration voice">
            @for (v of availableVoices(); track v.name) {
              <option [value]="v.name" [selected]="v.name === selectedVoice()">{{ v.name }}</option>
            }
          </select>
        }

        <!-- Rate selector -->
        <label class="sr-only" for="slide-rate-select">Narration speed</label>
        <select id="slide-rate-select" (change)="onRateChange($event)"
                class="md3-focus-ring h-11 cursor-pointer rounded-[var(--md-sys-shape-corner-full)] border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container)] px-4 text-xs font-semibold text-[color:var(--md-sys-color-on-surface)] transition-[background-color,border-color] duration-200 hover:bg-[color:var(--md-sys-color-surface-container-highest)]"
                aria-label="Narration speed">
          @for (r of rates; track r) {
            <option [value]="r" [selected]="r === rate()">{{ r }}×</option>
          }
        </select>
        </div>
      </footer>
    </div>
  `,
})
export class SlidePlayerComponent implements AfterViewInit, OnDestroy {
  slides = input.required<SlideData[]>();
  deckTitle = input<string>('Tutorial');
  backUrl = input<string>('/');

  slideViewport = viewChild<ElementRef<HTMLElement>>('slideViewport');
  slideStage = viewChild<ElementRef<HTMLElement>>('slideStage');
  slideCompanion = viewChild<ElementRef<HTMLElement>>('slideCompanion');

  idx = signal(0);
  autoAdvance = signal(true);
  speaking = signal(false);
  narrationPaused = signal(false);
  guideEnabled = signal(true);
  activeFocusIndex = signal(0);
  activeFocusKey = signal<string | null>(null);
  companionPosition = signal({ x: 0, y: 0 });
  companionPositioned = signal(false);
  companionFacing = signal<'left' | 'right'>('left');
  companionTravelling = signal(false);
  connectorPath = signal('');
  connectorViewBox = signal('0 0 1 1');
  connectorTarget = signal<{ x: number; y: number } | null>(null);
  showScript = signal(false);
  copied = signal(false);
  availableVoices = signal<SpeechSynthesisVoice[]>([]);
  selectedVoice = signal<string>('');
  rate = signal<number>(1.0);
  audioPrompt = signal(false);
  audioPromptTitle = signal('Start narrated slides?');
  audioPromptMessage = signal('Browser audio and speech playback need your permission before narration starts. Start narration once, or continue reading the slides manually.');
  narrationUnlocked = signal(false);
  synthAvailable = signal(typeof window !== 'undefined' && 'speechSynthesis' in window);
  rates = [0.75, 1.0, 1.25, 1.5];

  private synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
  private utterance: SpeechSynthesisUtterance | null = null;
  private speakTimer: ReturnType<typeof setTimeout> | null = null;
  private autoAdvanceTimer: ReturnType<typeof setTimeout> | null = null;
  private travelTimer: ReturnType<typeof setTimeout> | null = null;
  private companionFrame: number | null = null;
  private connectorFrame: number | null = null;
  private revealFrame: number | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private narrationSession = 0;
  private pendingStepIndex: number | null = null;
  private userInitiated = false;
  private readonly companionTravelDuration = 500;
  private readonly companionLeadInDuration = 520;
  private readonly viewportScrollHandler = () => this.scheduleCompanionPosition();

  currentSlide = computed(() => this.slides()[this.idx()]);
  focusSteps = computed(() => resolveSlideFocusSteps(this.currentSlide()));
  currentFocusStep = computed<ResolvedSlideFocusStep | null>(() => {
    const steps = this.focusSteps();
    if (!steps.length) return null;
    return steps[Math.min(this.activeFocusIndex(), steps.length - 1)];
  });
  currentNarrationText = computed(() => {
    const steps = this.focusSteps();
    return steps.length ? steps.map(step => step.narration).join(' ') : this.currentSlide().narration;
  });
  companionTransform = computed(() => {
    const position = this.companionPosition();
    return `translate3d(${position.x}px, ${position.y}px, 0)`;
  });
  companionStatusLabel = computed(() => {
    const label = this.currentFocusStep()?.label || this.currentSlide().title;
    if (this.narrationPaused()) return `Paused: ${label}`;
    if (this.speaking()) return `Explaining: ${label}`;
    return `Ready: ${label}`;
  });
  mediaButtonLabel = computed(() => this.speaking() ? 'Pause narration' : this.narrationPaused() ? 'Resume narration' : 'Play narration');
  narrationStatusLabel = computed(() => this.speaking() ? 'Narrating' : this.narrationPaused() ? 'Paused' : 'Ready');

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

  ngAfterViewInit() {
    this.prepareFocusForSlide();
    const stage = this.slideStage()?.nativeElement;
    const viewport = this.slideViewport()?.nativeElement;

    if (stage && typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => this.scheduleCompanionPosition());
      this.resizeObserver.observe(stage);
    }
    viewport?.addEventListener('scroll', this.viewportScrollHandler, { passive: true });
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
    this.scheduleCompanionPosition();
  }

  @HostListener('window:keydown', ['$event'])
  onKey(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      window.location.href = this.backUrl();
      return;
    }
    const target = e.target as HTMLElement | null;
    if (target?.closest('button, a, input, select, textarea, [contenteditable="true"]')) return;
    if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); this.next(); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); this.prev(); }
    if (e.key === 'p' || e.key === 'P') { this.togglePlay(); }
    if (e.key === 's' || e.key === 'S') { this.stopAll(); }
  }

  @HostListener('window:resize')
  onResize() {
    this.scheduleCompanionPosition();
  }

  prev() {
    this.goToSlide(this.idx() - 1);
  }

  jumpTo(i: number) {
    this.goToSlide(i);
  }

  async copyCode() {
    const code = this.currentSlide().code;
    if (!code || typeof navigator === 'undefined' || !navigator.clipboard) return;
    try {
      await navigator.clipboard.writeText(code);
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000);
    } catch {
      // Clipboard API failed (permissions, not HTTPS, etc.) - silently fail
    }
  }

  next() {
    this.goToSlide(this.idx() + 1);
  }

  toggleGuide() {
    this.guideEnabled.update(enabled => !enabled);
    if (this.guideEnabled()) {
      const step = this.currentFocusStep() ?? this.focusSteps()[0];
      this.activeFocusKey.set(step?.target ?? 'title');
      if (step) this.revealFocusTarget(step.target);
      this.scheduleCompanionPosition();
    } else {
      if (this.revealFrame !== null) {
        cancelAnimationFrame(this.revealFrame);
        this.revealFrame = null;
      }
      this.companionPositioned.set(false);
      this.connectorPath.set('');
      this.connectorTarget.set(null);
    }
  }

  toggleScript() {
    this.showScript.update(visible => !visible);
    this.scheduleCompanionPosition();
  }

  isFocusActive(target: string) {
    return this.guideEnabled() && this.activeFocusKey() === target;
  }

  scheduleCompanionPosition() {
    if (typeof window === 'undefined') return;
    if (this.companionFrame !== null) cancelAnimationFrame(this.companionFrame);
    this.companionFrame = requestAnimationFrame(() => {
      this.companionFrame = null;
      if (!this.positionCompanion() && this.guideEnabled() && !this.audioPrompt()) {
        this.companionFrame = requestAnimationFrame(() => {
          this.companionFrame = null;
          this.positionCompanion();
        });
      }
    });
  }

  private goToSlide(index: number) {
    if (index < 0 || index >= this.slides().length || index === this.idx()) return;

    const continueNarrating = this.shouldNarrateOnSlideChange();
    const wasPaused = this.narrationPaused();
    this.cancelActiveUtterance();
    this.idx.set(index);
    const viewport = this.slideViewport()?.nativeElement;
    if (viewport) viewport.scrollTop = 0;
    this.speaking.set(false);
    this.narrationPaused.set(false);
    this.prepareFocusForSlide();

    if (continueNarrating) {
      this.speak();
    } else if (wasPaused) {
      this.pendingStepIndex = 0;
      this.narrationPaused.set(true);
    }
  }

  private prepareFocusForSlide() {
    const firstStep = this.focusSteps()[0];
    this.activeFocusIndex.set(0);
    this.activeFocusKey.set(firstStep?.target ?? 'title');
    this.scheduleCompanionPosition();
  }

  private activateFocusStep(index: number) {
    const steps = this.focusSteps();
    if (!steps.length) {
      this.activeFocusIndex.set(0);
      this.activeFocusKey.set('title');
      this.scheduleCompanionPosition();
      return;
    }

    const safeIndex = Math.min(Math.max(index, 0), steps.length - 1);
    this.activeFocusIndex.set(safeIndex);
    this.activeFocusKey.set(steps[safeIndex].target);
    this.revealFocusTarget(steps[safeIndex].target);
    this.scheduleCompanionPosition();
  }

  private revealFocusTarget(targetKey: string) {
    if (typeof window === 'undefined' || !this.guideEnabled()) return;
    if (this.revealFrame !== null) cancelAnimationFrame(this.revealFrame);
    const session = this.narrationSession;
    const slideIndex = this.idx();
    this.revealFrame = requestAnimationFrame(() => {
      this.revealFrame = null;
      if (session !== this.narrationSession || slideIndex !== this.idx() || !this.guideEnabled()) return;
      const stage = this.slideStage()?.nativeElement;
      const viewport = this.slideViewport()?.nativeElement;
      const target = stage?.querySelector<HTMLElement>(`[data-slide-focus="${targetKey}"]`);
      if (!stage || !viewport || !target) return;

      const viewportRect = viewport.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();
      const safeTop = viewportRect.top + 20;
      const safeBottom = viewportRect.bottom - 20;
      if (targetRect.top < safeTop || targetRect.bottom > safeBottom) {
        target.scrollIntoView({
          behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
          block: 'center',
          inline: 'nearest',
        });
      }
      this.scheduleCompanionPosition();
    });
  }

  private positionCompanion() {
    if (!this.guideEnabled() || this.audioPrompt()) return false;

    const stage = this.slideStage()?.nativeElement;
    const viewport = this.slideViewport()?.nativeElement;
    const companion = this.slideCompanion()?.nativeElement;
    if (!stage || !viewport || !companion) return false;

    const focusElements = Array.from(stage.querySelectorAll<HTMLElement>('[data-slide-focus]'));
    const requestedTarget = this.activeFocusKey();
    const target = focusElements.find(element => element.dataset['slideFocus'] === requestedTarget)
      ?? focusElements.find(element => element.dataset['slideFocus'] === 'title')
      ?? focusElements[0];
    if (!target) return false;

    const stageRect = stage.getBoundingClientRect();
    const viewportRect = viewport.getBoundingClientRect();
    const companionRect = companion.getBoundingClientRect();
    if (!stageRect.width || !stageRect.height || !companionRect.width || !companionRect.height) return false;

    const targetRect = this.toRelativeRect(target.getBoundingClientRect(), stageRect);
    const obstacles = focusElements.map(element => ({
      element,
      rect: this.toRelativeRect(element.getBoundingClientRect(), stageRect),
    }));
    const step = this.currentFocusStep();
    const visibleBounds = this.getVisibleStageBounds(stageRect, viewportRect);
    const placements = this.buildCompanionPlacements(
      targetRect,
      visibleBounds,
      companionRect.width,
      companionRect.height,
      step?.anchor ?? 'auto',
    );

    const scored = placements.map((placement, priority) => {
      const footprint = {
        left: placement.x,
        top: placement.y,
        right: placement.x + companionRect.width,
        bottom: placement.y + companionRect.height,
        width: companionRect.width,
        height: companionRect.height,
      };
      const overlapScore = obstacles.reduce((total, obstacle) => {
        const padding = obstacle.element === target ? 12 : 7;
        const expanded = this.expandRect(obstacle.rect, padding);
        const weight = obstacle.element === target ? 12 : 4;
        return total + this.overlapArea(footprint, expanded) * weight;
      }, 0);
      return { ...placement, score: overlapScore + priority * 180 };
    });

    const placement = scored.reduce((best, candidate) => candidate.score < best.score ? candidate : best);
    const previous = this.companionPosition();
    const travelled = this.companionPositioned()
      && Math.hypot(previous.x - placement.x, previous.y - placement.y) > 6;

    this.companionPosition.set({ x: placement.x, y: placement.y });
    this.companionFacing.set(targetRect.left + targetRect.width / 2 < placement.x + companionRect.width / 2 ? 'left' : 'right');
    this.companionPositioned.set(true);

    if (travelled) {
      this.companionTravelling.set(true);
      if (this.travelTimer) clearTimeout(this.travelTimer);
      this.travelTimer = setTimeout(() => this.companionTravelling.set(false), this.companionTravelDuration);
    }

    this.trackConnector(target);
    return true;
  }

  private buildCompanionPlacements(
    target: RelativeRect,
    bounds: RelativeRect,
    companionWidth: number,
    companionHeight: number,
    preferredAnchor: SlideCompanionAnchor,
  ): CompanionPlacement[] {
    const gap = 20;
    const centerX = target.left + target.width / 2;
    const centerY = target.top + target.height / 2;
    const placements: Record<Exclude<ResolvedCompanionAnchor, 'dock'>, Omit<CompanionPlacement, 'score'>> = {
      right: { x: target.right + gap, y: centerY - companionHeight / 2, anchor: 'right' },
      left: { x: target.left - companionWidth - gap, y: centerY - companionHeight / 2, anchor: 'left' },
      bottom: { x: centerX - companionWidth / 2, y: target.bottom + gap, anchor: 'bottom' },
      top: { x: centerX - companionWidth / 2, y: target.top - companionHeight - gap, anchor: 'top' },
    };
    const boundsCenterX = bounds.left + bounds.width / 2;
    const automaticOrder: Array<Exclude<ResolvedCompanionAnchor, 'dock'>> = centerX < boundsCenterX
      ? ['right', 'left', 'bottom', 'top']
      : ['left', 'right', 'bottom', 'top'];
    const anchorOrder = preferredAnchor === 'auto'
      ? automaticOrder
      : [preferredAnchor, ...automaticOrder.filter(anchor => anchor !== preferredAnchor)];
    const minimumX = bounds.left + 8;
    const minimumY = bounds.top + 8;
    const maximumX = Math.max(minimumX, bounds.right - companionWidth - 8);
    const maximumY = Math.max(minimumY, bounds.bottom - companionHeight - 8);
    const clampPlacement = (placement: Omit<CompanionPlacement, 'score'>): CompanionPlacement => ({
      ...placement,
      x: Math.min(Math.max(placement.x, minimumX), maximumX),
      y: Math.min(Math.max(placement.y, minimumY), maximumY),
      score: 0,
    });
    if (bounds.width <= 639) {
      return [
        { x: maximumX, y: minimumY, anchor: 'dock' as const },
        { x: minimumX, y: minimumY, anchor: 'dock' as const },
        { x: maximumX, y: maximumY, anchor: 'dock' as const },
        { x: minimumX, y: maximumY, anchor: 'dock' as const },
      ].map(clampPlacement);
    }
    const dockOnRight = centerX < boundsCenterX;
    const docked: Array<Omit<CompanionPlacement, 'score'>> = [
      { x: dockOnRight ? maximumX : minimumX, y: maximumY, anchor: 'dock' },
      { x: dockOnRight ? maximumX : minimumX, y: minimumY, anchor: 'dock' },
    ];

    return [
      ...anchorOrder.map(anchor => clampPlacement(placements[anchor])),
      ...docked.map(clampPlacement),
    ];
  }

  private getVisibleStageBounds(stage: DOMRect, viewport: DOMRect): RelativeRect {
    const left = Math.max(stage.left, viewport.left) - stage.left;
    const top = Math.max(stage.top, viewport.top) - stage.top;
    const right = Math.min(stage.right, viewport.right) - stage.left;
    const bottom = Math.min(stage.bottom, viewport.bottom) - stage.top;
    return {
      left,
      top,
      right,
      bottom,
      width: Math.max(0, right - left),
      height: Math.max(0, bottom - top),
    };
  }

  private toRelativeRect(rect: DOMRect, container: DOMRect): RelativeRect {
    return {
      left: rect.left - container.left,
      top: rect.top - container.top,
      right: rect.right - container.left,
      bottom: rect.bottom - container.top,
      width: rect.width,
      height: rect.height,
    };
  }

  private expandRect(rect: RelativeRect, padding: number): RelativeRect {
    return {
      left: rect.left - padding,
      top: rect.top - padding,
      right: rect.right + padding,
      bottom: rect.bottom + padding,
      width: rect.width + padding * 2,
      height: rect.height + padding * 2,
    };
  }

  private overlapArea(first: RelativeRect, second: RelativeRect) {
    const width = Math.max(0, Math.min(first.right, second.right) - Math.max(first.left, second.left));
    const height = Math.max(0, Math.min(first.bottom, second.bottom) - Math.max(first.top, second.top));
    return width * height;
  }

  private trackConnector(target: HTMLElement) {
    if (typeof window === 'undefined') return;
    if (this.connectorFrame !== null) cancelAnimationFrame(this.connectorFrame);
    const startedAt = performance.now();
    const draw = (now: number) => {
      this.drawConnector(target);
      if (now - startedAt < this.companionTravelDuration + 20) {
        this.connectorFrame = requestAnimationFrame(draw);
      } else {
        this.connectorFrame = null;
      }
    };
    this.connectorFrame = requestAnimationFrame(draw);
  }

  private drawConnector(target: HTMLElement) {
    const stage = this.slideStage()?.nativeElement;
    const companion = this.slideCompanion()?.nativeElement;
    if (!stage || !companion || !this.guideEnabled()) return;

    const stageRect = stage.getBoundingClientRect();
    const targetRect = this.toRelativeRect(target.getBoundingClientRect(), stageRect);
    const companionRect = this.toRelativeRect(companion.getBoundingClientRect(), stageRect);
    const facingLeft = this.companionFacing() === 'left';
    const startX = facingLeft
      ? companionRect.left + companionRect.width * 0.24
      : companionRect.left + companionRect.width * 0.76;
    const startY = companionRect.top + Math.min(66, companionRect.height * 0.42);
    const endX = Math.min(Math.max(startX, targetRect.left), targetRect.right);
    const endY = Math.min(Math.max(startY, targetRect.top), targetRect.bottom);
    const horizontal = Math.abs(startX - endX) >= Math.abs(startY - endY);
    const path = horizontal
      ? `M ${startX} ${startY} C ${(startX + endX) / 2} ${startY}, ${(startX + endX) / 2} ${endY}, ${endX} ${endY}`
      : `M ${startX} ${startY} C ${startX} ${(startY + endY) / 2}, ${endX} ${(startY + endY) / 2}, ${endX} ${endY}`;

    this.connectorViewBox.set(`0 0 ${stageRect.width} ${stageRect.height}`);
    this.connectorPath.set(path);
    this.connectorTarget.set({ x: endX, y: endY });
  }

  togglePlay() {
    if (this.speaking()) {
      if (this.speakTimer) {
        clearTimeout(this.speakTimer);
        this.speakTimer = null;
      }
      this.synth?.pause();
      this.speaking.set(false);
      this.narrationPaused.set(true);
    } else if (this.narrationPaused()) {
      if (!this.synth) {
        this.showNarrationUnavailable();
        return;
      }
      this.narrationUnlocked.set(true);
      this.userInitiated = true;
      this.synth.resume();
      this.speaking.set(true);
      this.narrationPaused.set(false);
      if (this.pendingStepIndex !== null) {
        this.queueFocusStep(this.narrationSession, this.pendingStepIndex, 0);
      } else if (!this.utterance) {
        this.speak(this.activeFocusIndex());
      }
    } else if (!this.narrationUnlocked()) {
      this.requestNarrationStart();
    } else {
      this.userInitiated = true;
      this.speak();
    }
  }

  stopAll() {
    this.userInitiated = false;
    this.cancelActiveUtterance();
    this.speaking.set(false);
    this.narrationPaused.set(false);
    this.prepareFocusForSlide();
  }

  toggleAutoAdvance() {
    this.autoAdvance.update(v => !v);
    if (!this.autoAdvance() && this.autoAdvanceTimer) {
      clearTimeout(this.autoAdvanceTimer);
      this.autoAdvanceTimer = null;
    }
  }

  onVoiceChange(e: Event) {
    const name = (e.target as HTMLSelectElement).value;
    this.selectedVoice.set(name);
    if (typeof localStorage !== 'undefined') localStorage.setItem('slides.voice', name);
    if (this.shouldNarrateOnSlideChange()) this.speak(this.activeFocusIndex());
  }

  onRateChange(e: Event) {
    const r = parseFloat((e.target as HTMLSelectElement).value);
    this.rate.set(r);
    if (typeof localStorage !== 'undefined') localStorage.setItem('slides.rate', String(r));
    if (this.shouldNarrateOnSlideChange()) this.speak(this.activeFocusIndex());
  }

  startNarrationWithConsent() {
    if (!this.synth) {
      this.showNarrationUnavailable();
      return;
    }

    this.audioPrompt.set(false);
    this.narrationUnlocked.set(true);
    this.narrationPaused.set(false);
    this.userInitiated = true;
    this.synth.resume();
    this.speak();
  }

  continueWithoutNarration() {
    this.audioPrompt.set(false);
    this.userInitiated = false;
    this.narrationUnlocked.set(false);
    this.cancelActiveUtterance();
    this.speaking.set(false);
    this.narrationPaused.set(false);
    this.prepareFocusForSlide();
  }

  private requestNarrationStart() {
    if (!this.synth) {
      this.showNarrationUnavailable();
      return;
    }

    this.audioPromptTitle.set('Start narrated slides?');
    this.audioPromptMessage.set('Browser audio and speech playback need your permission before narration starts. Start narration once, or continue reading the slides manually.');
    this.audioPrompt.set(true);
  }

  private showNarrationUnavailable() {
    this.audioPromptTitle.set('Narration is not available');
    this.audioPromptMessage.set('This browser does not expose speech narration for the slide player. You can still move through the slides manually.');
    this.audioPrompt.set(true);
    this.speaking.set(false);
    this.narrationPaused.set(false);
  }

  private shouldNarrateOnSlideChange() {
    return this.userInitiated && this.narrationUnlocked() && !this.narrationPaused() && !this.synth?.paused;
  }

  private cancelActiveUtterance() {
    this.narrationSession += 1;
    if (this.revealFrame !== null) {
      cancelAnimationFrame(this.revealFrame);
      this.revealFrame = null;
    }
    if (this.speakTimer) {
      clearTimeout(this.speakTimer);
      this.speakTimer = null;
    }
    if (this.autoAdvanceTimer) {
      clearTimeout(this.autoAdvanceTimer);
      this.autoAdvanceTimer = null;
    }
    if (this.utterance) {
      this.utterance.onstart = null;
      this.utterance.onend = null;
      this.utterance.onerror = null;
    }
    if (this.synth?.paused) this.synth.resume();
    this.synth?.cancel();
    this.utterance = null;
    this.pendingStepIndex = null;
  }

  private speak(startIndex = 0) {
    if (!this.narrationUnlocked()) {
      this.requestNarrationStart();
      return;
    }
    if (!this.synth) {
      this.showNarrationUnavailable();
      return;
    }
    this.cancelActiveUtterance();
    const steps = this.focusSteps();
    if (!steps.length) {
      this.speaking.set(false);
      this.narrationPaused.set(false);
      return;
    }

    const safeIndex = Math.min(Math.max(startIndex, 0), steps.length - 1);
    const session = this.narrationSession;
    this.speaking.set(true);
    this.narrationPaused.set(false);
    this.queueFocusStep(session, safeIndex, this.focusLeadInDelay());
  }

  private focusLeadInDelay() {
    if (!this.guideEnabled() || typeof window === 'undefined') return 0;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : this.companionLeadInDuration;
  }

  private queueFocusStep(session: number, index: number, delay: number) {
    if (session !== this.narrationSession) return;
    this.activateFocusStep(index);
    this.pendingStepIndex = index;
    if (this.speakTimer) clearTimeout(this.speakTimer);

    const start = () => {
      this.speakTimer = null;
      if (session !== this.narrationSession || this.narrationPaused()) return;
      this.pendingStepIndex = null;
      this.speakFocusStep(session, index);
    };

    if (delay <= 0) {
      start();
    } else {
      this.speakTimer = setTimeout(start, delay);
    }
  }

  private speakFocusStep(session: number, index: number) {
    if (!this.synth || session !== this.narrationSession) return;
    const step = this.focusSteps()[index];
    if (!step) {
      this.finishNarration(session);
      return;
    }

    const u = new SpeechSynthesisUtterance(step.narration);
    u.rate = this.rate();
    u.pitch = 1.0;
    u.volume = 1.0;
    const voice = this.availableVoices().find(v => v.name === this.selectedVoice());
    if (voice) u.voice = voice;
    u.onstart = () => {
      if (session !== this.narrationSession) return;
      if (this.narrationPaused()) {
        this.synth?.pause();
        return;
      }
      this.speaking.set(true);
      this.narrationPaused.set(false);
    };
    u.onend = () => {
      if (session !== this.narrationSession || this.utterance !== u) return;
      this.utterance = null;
      const nextStep = index + 1;
      if (nextStep < this.focusSteps().length) {
        this.queueFocusStep(session, nextStep, this.focusLeadInDelay());
      } else {
        this.finishNarration(session);
      }
    };
    u.onerror = () => {
      if (session !== this.narrationSession || this.utterance !== u) return;
      this.utterance = null;
      this.pendingStepIndex = null;
      this.speaking.set(false);
      this.narrationPaused.set(false);
      this.narrationUnlocked.set(false);
      this.audioPromptTitle.set('Start narration again?');
      this.audioPromptMessage.set('The browser stopped slide narration. Start narration again if you want audio, or continue reading manually.');
      this.audioPrompt.set(true);
    };
    this.utterance = u;
    this.synth.resume();
    this.synth.speak(u);
  }

  private finishNarration(session: number) {
    if (session !== this.narrationSession) return;
    this.speaking.set(false);
    this.narrationPaused.set(false);
    this.pendingStepIndex = null;
    if (this.autoAdvance() && this.userInitiated && this.idx() < this.slides().length - 1) {
      this.autoAdvanceTimer = setTimeout(() => {
        this.autoAdvanceTimer = null;
        if (session === this.narrationSession && this.autoAdvance()) this.next();
      }, 600);
    }
  }

  ngOnDestroy() {
    this.userInitiated = false;
    this.cancelActiveUtterance();
    this.resizeObserver?.disconnect();
    this.slideViewport()?.nativeElement.removeEventListener('scroll', this.viewportScrollHandler);
    if (this.companionFrame !== null) cancelAnimationFrame(this.companionFrame);
    if (this.connectorFrame !== null) cancelAnimationFrame(this.connectorFrame);
    if (this.revealFrame !== null) cancelAnimationFrame(this.revealFrame);
    if (this.travelTimer) clearTimeout(this.travelTimer);
    if (this.synth) this.synth.onvoiceschanged = null;
  }
}
