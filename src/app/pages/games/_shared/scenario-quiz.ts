import { Component, Input, signal, computed } from '@angular/core';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Md3BreadcrumbComponent } from '../../../shared/md3/md3-breadcrumb';
import { Md3MiniMapComponent } from '../../../shared/md3/md3-mini-map';
import { Md3BreadcrumbItem } from '../../../shared/md3/md3.types';

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
  badgePill: string;
  accentText: string;
  titleGradient: string;
  numberCircle: string;
  startButton: string;
  topicPill: string;
  callout: string;
  calloutTitle: string;
  resultsBg: string;
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
  imports: [RouterLink, NgClass, Md3BreadcrumbComponent, Md3MiniMapComponent],
  template: `
    <section class="md3-learning-page py-12 md:py-16">
      <div class="md3-learning-container">
        <app-md3-breadcrumb [items]="breadcrumbItems" />

        <article class="md3-lab-shell">
          <header class="md3-learning-hero md3-reference-hero">
            <div class="md3-learning-hero-grid">
              <div class="md3-learning-hero-copy">
                <span class="md3-learning-eyebrow">{{ intro.badge }}</span>
                <h1>{{ intro.titlePlain }} {{ intro.titleGradient }}</h1>
                <p class="md3-learning-lede">{{ intro.description }}</p>
                <div class="md3-learning-chip-row" aria-label="Lab metadata">
                  <span class="md3-chip-selected">{{ scenarios.length }} scenarios</span>
                  <span class="md3-chip">~{{ intro.timeMinutes }} minutes</span>
                  <span class="md3-chip">{{ intro.difficulty }}</span>
                </div>
              </div>

              <aside class="md3-learning-panel" aria-label="Lab flow">
                <div class="md3-learning-panel-top">
                  <strong>Practice loop</strong>
                  <span>{{ gameStarted() ? currentIndex() + 1 : 0 }} / {{ scenarios.length }}</span>
                </div>
                <div class="md3-learning-stat-grid">
                  <div class="md3-learning-stat-tile">
                    <strong>{{ scenarios.length }}</strong>
                    <span>Scenarios</span>
                  </div>
                  <div class="md3-learning-stat-tile">
                    <strong>{{ score() }}</strong>
                    <span>Current score</span>
                  </div>
                </div>
                <app-md3-mini-map [labels]="mapLabels" />
              </aside>
            </div>
          </header>

      @if (!gameStarted()) {
        <section class="md3-learning-grid-2" aria-labelledby="lab-start-heading">
          <div class="md3-learning-card interactive">
            <div class="md3-learning-card-top">
              <span class="md3-learning-icon">RUN</span>
              <span class="md3-chip-selected">{{ intro.difficulty }}</span>
            </div>
            <h2 id="lab-start-heading">How the simulator works</h2>
            <ul class="md3-learning-bullet-list">
              @for (step of intro.steps; track $index) {
                <li>{{ step }}</li>
              }
            </ul>
            <button (click)="startGame()" class="md3-button-filled md3-button-large">
              Start simulation
            </button>
          </div>

          <aside class="md3-learning-card" aria-labelledby="practice-heading">
            <div class="md3-learning-card-top">
              <span class="md3-learning-icon">SKILL</span>
              <span class="md3-chip">Practice</span>
            </div>
            <h2 id="practice-heading">{{ intro.practiceTitle }}</h2>
            <p>{{ intro.practiceDescription }}</p>
            <div class="md3-learning-grid-2">
              @for (concept of intro.practiceConcepts; track concept.name) {
                <div class="md3-learning-callout">
                  <strong>{{ concept.name }}</strong>
                  <p>{{ concept.description }}</p>
                </div>
              }
            </div>
            <p>
              {{ intro.deeperLine }}
              @for (link of intro.deeperLinks; track link.href; let i = $index; let last = $last) {
                <a [routerLink]="link.href" class="md3-course-inline-link">{{ link.label }}</a>{{ last ? '.' : (i === intro.deeperLinks.length - 2 ? ' or ' : ', ') }}
              }
            </p>
          </aside>
        </section>
      }

      @if (gameStarted() && !gameEnded()) {
        <section class="md3-learning-card interactive" aria-labelledby="scenario-heading">
          <div class="md3-learning-card-top">
            <span class="md3-chip-selected">Scenario {{ currentIndex() + 1 }} of {{ scenarios.length }}</span>
            <span class="md3-chip">Score {{ score() }} / {{ currentIndex() + (answered() ? 1 : 0) }}</span>
          </div>

          <div class="md3-lab-progress" aria-hidden="true">
            <span [style.width.%]="((currentIndex() + (answered() ? 1 : 0)) / scenarios.length) * 100"></span>
          </div>

          <div class="md3-learning-card-top">
            <span class="md3-learning-icon">{{ currentScenario().topic.slice(0, 4).toUpperCase() }}</span>
            <div>
              <p class="md3-course-card-kicker">{{ currentScenario().topic }}</p>
              <h2 id="scenario-heading">{{ currentScenario().title }}</h2>
            </div>
          </div>

          <p>{{ currentScenario().briefing }}</p>
          <pre class="md3-learning-code"><code>{{ currentScenario().yaml }}</code></pre>

          <div>
            <h3 class="mb-3 text-lg font-bold">{{ currentScenario().question }}</h3>
            <div class="space-y-3">
              @for (choice of currentScenario().choices; track $index; let i = $index) {
                <button
                  (click)="select(i)"
                  [disabled]="answered()"
                  class="md3-lab-choice"
                  [ngClass]="getChoiceClasses(i, choice.correct)">
                  <span class="flex items-start gap-3">
                    <span class="md3-learning-number">{{ ['A','B','C','D'][i] }}</span>
                    <span>
                      <span class="block font-semibold">{{ choice.label }}</span>
                      @if (answered() && (choice.correct || selectedIndex() === i)) {
                        <span class="mt-2 block text-sm leading-relaxed text-muted-foreground">{{ choice.feedback }}</span>
                      }
                    </span>
                  </span>
                </button>
              }
            </div>
          </div>

          @if (answered()) {
            <aside class="md3-learning-callout tertiary">
              <h3>What happens in production</h3>
              <p>{{ currentScenario().explanation }}</p>
              <a [routerLink]="currentScenario().learnMore.href" class="md3-course-inline-link">{{ currentScenario().learnMore.label }}</a>
            </aside>

            <button (click)="next()" class="md3-button-tonal md3-button-large">
              {{ currentIndex() + 1 < scenarios.length ? 'Next scenario' : 'See your results' }}
            </button>
          }
        </section>
      }

      @if (gameEnded()) {
        <section class="md3-learning-panel text-center" aria-labelledby="results-heading">
          <div class="md3-learning-avatar mx-auto" aria-hidden="true">{{ score() }}</div>
          <span class="md3-learning-eyebrow">Final score</span>
          <h2 id="results-heading" class="mt-3">{{ resultBucket().headline }}</h2>
          <p class="mx-auto max-w-2xl">{{ resultBucket().message }}</p>
          <div class="md3-learning-actions justify-center">
            <button (click)="restart()" class="md3-button-filled md3-button-large">Play again</button>
            <a [routerLink]="callToActions.primary.href" class="md3-button-tonal md3-button-large">{{ callToActions.primary.label }}</a>
            @if (callToActions.secondary) {
              <a [routerLink]="callToActions.secondary.href" class="md3-button-outlined md3-button-large">{{ callToActions.secondary.label }}</a>
            }
            <a routerLink="/games" class="md3-button-outlined md3-button-large">Try another lab</a>
          </div>
        </section>
      }
        </article>
      </div>
    </section>
  `,
})
export class ScenarioQuizComponent {
  @Input({ required: true }) scenarios!: Scenario[];
  @Input({ required: true }) theme!: QuizTheme;
  @Input({ required: true }) intro!: QuizIntro;
  @Input({ required: true }) results!: QuizResults;
  @Input({ required: true }) callToActions!: QuizCallToActions;
  @Input() breadcrumbs: Md3BreadcrumbItem[] = [
    { label: 'Home', href: '/' },
    { label: 'Interactive labs', href: '/games' },
  ];
  readonly mapLabels = ['READ', 'PICK', 'FIX', 'REVIEW'];

  gameStarted = signal(false);
  currentIndex = signal(0);
  selectedIndex = signal<number | null>(null);
  answered = signal(false);
  score = signal(0);

  currentScenario = computed<Scenario>(() => this.scenarios[this.currentIndex()]);
  gameEnded = computed<boolean>(() => this.gameStarted() && this.currentIndex() >= this.scenarios.length);

  get breadcrumbItems(): Md3BreadcrumbItem[] {
    if (this.breadcrumbs.length > 2) return this.breadcrumbs;
    return [...this.breadcrumbs, { label: `${this.intro.titlePlain} ${this.intro.titleGradient}`.trim() }];
  }

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
      correct: isAnswered && isCorrect,
      incorrect: isAnswered && isSelected && !isCorrect,
      'opacity-60': isAnswered && !isSelected && !isCorrect,
    };
  }
}
