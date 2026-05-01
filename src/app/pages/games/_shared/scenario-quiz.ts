import { Component, Input, signal, computed } from '@angular/core';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';

export interface Choice {
  label: string;
  correct: boolean;
  feedback: string;
}

export interface Scenario {
  id: string;
  topic: string;
  title: string;
  briefing: string;
  yaml: string;
  question: string;
  choices: Choice[];
  explanation: string;
  learnMore: { label: string; href: string };
}

export interface PracticeConcept {
  name: string;
  description: string;
}

export interface QuizTheme {
  // Tailwind class strings (must be literal so Tailwind can detect them at build time)
  badgePill: string;          // e.g. 'bg-orange-500/10 border-orange-500/30 text-orange-500'
  accentText: string;         // e.g. 'text-orange-500'
  titleGradient: string;      // e.g. 'from-orange-500 via-amber-500 to-yellow-500'
  numberCircle: string;       // e.g. 'bg-orange-500/15 text-orange-500'
  startButton: string;        // e.g. 'bg-orange-500 hover:bg-orange-400 shadow-orange-500/30'
  topicPill: string;          // e.g. 'bg-orange-500/15 text-orange-500'
  callout: string;            // e.g. 'border-orange-500/30 bg-orange-500/5'
  calloutTitle: string;       // e.g. 'text-orange-500'
  resultsBg: string;          // e.g. 'from-orange-500/10 via-card to-amber-500/10'
}

export interface QuizIntro {
  badge: string;
  titlePlain: string;
  titleGradient: string;
  description: string;
  steps: string[];
  practiceTitle: string;
  practiceDescription: string;
  practiceConcepts: PracticeConcept[];
  deeperLine: string;
  deeperLinks: { label: string; href: string }[];
  timeMinutes: number;
  difficulty: string;
}

export interface QuizResults {
  perfect: { headline: string; emoji: string; message: string };
  great: { headline: string; emoji: string; message: string };
  good: { headline: string; emoji: string; message: string };
  weak: { headline: string; emoji: string; message: string };
}

export interface QuizCallToActions {
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
}

@Component({
  selector: 'app-scenario-quiz',
  imports: [RouterLink, NgClass],
  template: `
    <header class="text-center mb-10">
      <span class="inline-block rounded-full border px-4 py-1 text-xs font-bold uppercase tracking-wider mb-4" [ngClass]="theme.badgePill">{{ intro.badge }}</span>
      <h1 class="text-3xl md:text-5xl font-extrabold tracking-tight leading-[1.1] mb-4">
        {{ intro.titlePlain }} <span class="bg-gradient-to-r bg-clip-text text-transparent" [ngClass]="theme.titleGradient">{{ intro.titleGradient }}</span>
      </h1>
      <p class="text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
        {{ intro.description }}
      </p>
    </header>

    @if (!gameStarted()) {
      <div class="rounded-2xl border border-border/60 bg-card p-6 md:p-10 mb-6">
        <h2 class="text-xl md:text-2xl font-bold mb-4">How the Simulator Works</h2>
        <ul class="space-y-3 text-sm md:text-base text-muted-foreground mb-6">
          @for (step of intro.steps; track $index; let i = $index) {
            <li class="flex items-start gap-3">
              <span class="inline-flex items-center justify-center h-6 w-6 rounded-full font-bold text-xs flex-shrink-0 mt-0.5" [ngClass]="theme.numberCircle">{{ i + 1 }}</span>
              <span>{{ step }}</span>
            </li>
          }
        </ul>

        <div class="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
          <div class="rounded-lg bg-accent/40 p-3 text-center">
            <div class="text-2xl font-extrabold">{{ scenarios.length }}</div>
            <div class="text-[10px] text-muted-foreground uppercase tracking-wider">Scenarios</div>
          </div>
          <div class="rounded-lg bg-accent/40 p-3 text-center">
            <div class="text-2xl font-extrabold">~{{ intro.timeMinutes }}</div>
            <div class="text-[10px] text-muted-foreground uppercase tracking-wider">Minutes</div>
          </div>
          <div class="rounded-lg bg-accent/40 p-3 text-center col-span-2 md:col-span-1">
            <div class="text-2xl font-extrabold">{{ intro.difficulty }}</div>
            <div class="text-[10px] text-muted-foreground uppercase tracking-wider">Difficulty</div>
          </div>
        </div>

        <button (click)="startGame()" class="w-full md:w-auto inline-flex items-center justify-center gap-2 rounded-full text-white font-bold px-7 py-3.5 text-sm shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all" [ngClass]="theme.startButton">
          Start Simulation
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
        </button>
      </div>

      <div class="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm p-6 md:p-8">
        <h2 class="text-lg md:text-xl font-bold mb-3">{{ intro.practiceTitle }}</h2>
        <p class="text-sm text-muted-foreground leading-relaxed mb-5">{{ intro.practiceDescription }}</p>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
          @for (concept of intro.practiceConcepts; track concept.name) {
            <div class="rounded-lg border border-border/40 bg-card p-3">
              <strong class="text-foreground">{{ concept.name }}</strong>
              <p class="text-muted-foreground mt-0.5">{{ concept.description }}</p>
            </div>
          }
        </div>
        <p class="mt-5 text-xs text-muted-foreground">
          {{ intro.deeperLine }}
          @for (link of intro.deeperLinks; track link.href; let i = $index; let last = $last) {
            <a [routerLink]="link.href" class="text-primary underline">{{ link.label }}</a>{{ last ? '.' : (i === intro.deeperLinks.length - 2 ? ' or ' : ', ') }}
          }
        </p>
      </div>
    }

    @if (gameStarted() && !gameEnded()) {
      <div class="rounded-2xl border border-border/60 bg-card p-6 md:p-8 mb-6">
        <div class="flex items-center justify-between text-sm mb-4">
          <span class="text-muted-foreground">Scenario {{ currentIndex() + 1 }} of {{ scenarios.length }}</span>
          <span>Score: <strong class="text-foreground">{{ score() }} / {{ currentIndex() + (answered() ? 1 : 0) }}</strong></span>
        </div>
        <div class="h-2 bg-muted rounded-full overflow-hidden mb-6">
          <div class="h-full bg-gradient-to-r transition-all duration-500" [ngClass]="theme.titleGradient"
               [style.width.%]="((currentIndex() + (answered() ? 1 : 0)) / scenarios.length) * 100"></div>
        </div>

        <div class="flex flex-wrap items-center gap-2 mb-4">
          <span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider" [ngClass]="theme.topicPill">
            {{ currentScenario().topic }}
          </span>
          <h2 class="text-lg md:text-xl font-bold tracking-tight">{{ currentScenario().title }}</h2>
        </div>
        <p class="text-sm text-muted-foreground mb-4 leading-relaxed">{{ currentScenario().briefing }}</p>

        <pre class="bg-muted rounded-lg p-4 overflow-x-auto text-xs md:text-sm font-mono mb-6 leading-relaxed"><code>{{ currentScenario().yaml }}</code></pre>

        <p class="font-semibold mb-3">{{ currentScenario().question }}</p>

        <div class="space-y-2">
          @for (choice of currentScenario().choices; track $index; let i = $index) {
            <button
              (click)="select(i)"
              [disabled]="answered()"
              class="w-full text-left rounded-xl border-2 p-4 text-sm md:text-base transition-all duration-200"
              [ngClass]="getChoiceClasses(i, choice.correct)">
              <div class="flex items-start gap-3">
                <span class="inline-flex items-center justify-center h-7 w-7 rounded-full text-xs font-bold flex-shrink-0 mt-0.5"
                      [ngClass]="getBadgeClasses(i, choice.correct)">
                  {{ ['A','B','C','D'][i] }}
                </span>
                <div class="flex-1">
                  <div class="font-medium">{{ choice.label }}</div>
                  @if (answered() && (choice.correct || selectedIndex() === i)) {
                    <p class="mt-2 text-xs text-muted-foreground leading-relaxed">{{ choice.feedback }}</p>
                  }
                </div>
              </div>
            </button>
          }
        </div>

        @if (answered()) {
          <div class="mt-6 rounded-xl border p-5" [ngClass]="theme.callout">
            <h3 class="text-sm font-bold mb-2 uppercase tracking-wider" [ngClass]="theme.calloutTitle">What actually happens in production</h3>
            <p class="text-sm text-foreground/90 leading-relaxed mb-3">{{ currentScenario().explanation }}</p>
            <a [routerLink]="currentScenario().learnMore.href" class="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2.5 transition-all">
              {{ currentScenario().learnMore.label }}
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </a>
          </div>

          <button (click)="next()" class="mt-5 w-full md:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-foreground text-background font-bold px-6 py-3 text-sm hover:gap-3 transition-all">
            {{ currentIndex() + 1 < scenarios.length ? 'Next scenario' : 'See your results' }}
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </button>
        }
      </div>
    }

    @if (gameEnded()) {
      <div class="rounded-2xl border border-border/60 bg-gradient-to-br p-8 md:p-12 text-center" [ngClass]="theme.resultsBg">
        <div class="text-6xl mb-4" aria-hidden="true">{{ resultBucket().emoji }}</div>
        <h2 class="text-2xl md:text-3xl font-extrabold tracking-tight mb-3">{{ resultBucket().headline }}</h2>
        <p class="text-lg text-muted-foreground mb-2">You scored</p>
        <div class="text-5xl md:text-6xl font-extrabold bg-gradient-to-r bg-clip-text text-transparent mb-3" [ngClass]="theme.titleGradient">
          {{ score() }} / {{ scenarios.length }}
        </div>
        <p class="text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed mb-8">
          {{ resultBucket().message }}
        </p>
        <div class="flex flex-wrap justify-center gap-3">
          <button (click)="restart()" class="inline-flex items-center gap-2 rounded-full text-white font-bold px-6 py-3 text-sm shadow-lg hover:-translate-y-0.5 transition-all" [ngClass]="theme.startButton">
            Play again
          </button>
          <a [routerLink]="callToActions.primary.href" class="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-6 py-3 text-sm font-semibold text-foreground hover:bg-accent transition-all">
            {{ callToActions.primary.label }}
          </a>
          <a routerLink="/games" class="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-6 py-3 text-sm font-semibold text-foreground hover:bg-accent transition-all">
            Try another simulator
          </a>
        </div>
      </div>
    }
  `,
})
export class ScenarioQuizComponent {
  @Input({ required: true }) scenarios!: Scenario[];
  @Input({ required: true }) theme!: QuizTheme;
  @Input({ required: true }) intro!: QuizIntro;
  @Input({ required: true }) results!: QuizResults;
  @Input({ required: true }) callToActions!: QuizCallToActions;

  gameStarted = signal(false);
  currentIndex = signal(0);
  selectedIndex = signal<number | null>(null);
  answered = signal(false);
  score = signal(0);

  currentScenario = computed<Scenario>(() => this.scenarios[this.currentIndex()]);
  gameEnded = computed<boolean>(() => this.gameStarted() && this.currentIndex() >= this.scenarios.length);

  resultBucket = computed(() => {
    const pct = this.score() / this.scenarios.length;
    if (pct === 1) return this.results.perfect;
    if (pct >= 0.8) return this.results.great;
    if (pct >= 0.5) return this.results.good;
    return this.results.weak;
  });

  startGame() {
    this.gameStarted.set(true);
    this.currentIndex.set(0);
    this.score.set(0);
    this.answered.set(false);
    this.selectedIndex.set(null);
  }

  select(i: number) {
    if (this.answered()) return;
    this.selectedIndex.set(i);
    this.answered.set(true);
    if (this.currentScenario().choices[i].correct) {
      this.score.update(s => s + 1);
    }
  }

  next() {
    this.answered.set(false);
    this.selectedIndex.set(null);
    this.currentIndex.update(i => i + 1);
  }

  restart() {
    this.startGame();
  }

  getChoiceClasses(index: number, isCorrect: boolean): Record<string, boolean> {
    const isAnswered = this.answered();
    const isSelected = this.selectedIndex() === index;
    return {
      'border-border': !isAnswered || (isAnswered && !isSelected && !isCorrect),
      'hover:border-primary': !isAnswered,
      'hover:bg-accent': !isAnswered,
      'border-green-500': isAnswered && isCorrect,
      'bg-green-500/10': isAnswered && isCorrect,
      'border-red-500': isAnswered && isSelected && !isCorrect,
      'bg-red-500/10': isAnswered && isSelected && !isCorrect,
      'opacity-60': isAnswered && !isSelected && !isCorrect,
    };
  }

  getBadgeClasses(index: number, isCorrect: boolean): Record<string, boolean> {
    const isAnswered = this.answered();
    const isSelected = this.selectedIndex() === index;
    return {
      'bg-muted': !isAnswered || (isAnswered && !isSelected && !isCorrect),
      'bg-green-500': isAnswered && isCorrect,
      'bg-red-500': isAnswered && isSelected && !isCorrect,
      'text-white': isAnswered && (isCorrect || (isSelected && !isCorrect)),
    };
  }
}
