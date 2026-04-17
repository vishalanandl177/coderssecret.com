import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../../services/seo.service';

interface Game {
  slug: string;
  name: string;
  icon: string;
  description: string;
  difficulty: string;
  time: string;
  color: string;
}

@Component({
  selector: 'app-games-hub',
  imports: [RouterLink],
  template: `
    <section class="py-16 md:py-20 animate-in fade-in duration-500">
      <div class="container max-w-6xl mx-auto px-6">
        <nav aria-label="Breadcrumb" class="mb-6">
          <ol class="flex items-center gap-1.5 text-sm text-muted-foreground">
            <li><a routerLink="/" class="hover:text-foreground transition-colors">Home</a></li>
            <li class="text-muted-foreground/50">/</li>
            <li class="text-foreground font-medium" aria-current="page">Games</li>
          </ol>
        </nav>

        <div class="text-center mb-12">
          <h1 class="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.1] mb-4">
            Developer <span class="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 bg-clip-text text-transparent">Games</span>
          </h1>
          <p class="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Sharpen your skills while having fun. Quick coding challenges, debugging scenarios, and interactive tools — all built for engineers.
          </p>
        </div>

        <div class="grid md:grid-cols-2 gap-6">
          @for (game of games; track game.slug) {
            <a [routerLink]="['/games', game.slug]"
               class="group relative overflow-hidden rounded-2xl border border-border/60 bg-card p-8 transition-all duration-500 hover:shadow-xl hover:-translate-y-1 hover:border-primary/20">
              <div class="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                   [style.background-image]="'linear-gradient(to right, transparent, ' + game.color + ', transparent)'"></div>

              <div class="flex items-start gap-5">
                <div class="flex items-center justify-center h-16 w-16 rounded-2xl text-3xl flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
                     [style.background-color]="game.color + '15'">
                  {{ game.icon }}
                </div>
                <div class="flex-1 min-w-0">
                  <h2 class="text-xl font-extrabold tracking-tight mb-2 transition-colors duration-300 group-hover:text-primary">
                    {{ game.name }}
                  </h2>
                  <p class="text-sm text-muted-foreground leading-relaxed mb-3">
                    {{ game.description }}
                  </p>
                  <div class="flex items-center gap-3 text-xs text-muted-foreground">
                    <span class="inline-flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      {{ game.time }}
                    </span>
                    <span class="h-1 w-1 rounded-full bg-muted-foreground/50"></span>
                    <span class="inline-flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                      {{ game.difficulty }}
                    </span>
                  </div>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                     class="text-muted-foreground flex-shrink-0 transition-all duration-300 group-hover:translate-x-1 group-hover:text-primary">
                  <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                </svg>
              </div>
            </a>
          }
        </div>
      </div>
    </section>
  `,
})
export class GamesHubComponent {
  private seo = inject(SeoService);

  games: Game[] = [
    {
      slug: 'guess-output',
      name: 'Guess the Output',
      icon: '🎯',
      description: 'Predict what these tricky Python and JavaScript snippets actually print. Perfect for catching language quirks.',
      difficulty: 'Medium',
      time: '5 min',
      color: '#3b82f6',
    },
    {
      slug: 'spot-the-bug',
      name: 'Spot the Bug',
      icon: '🐛',
      description: 'Can you find the bug? Subtle mistakes, off-by-one errors, race conditions — test your code review skills.',
      difficulty: 'Hard',
      time: '8 min',
      color: '#ef4444',
    },
    {
      slug: 'devops-scenario',
      name: 'DevOps Scenario',
      icon: '🚨',
      description: 'Production incident simulations. Your pod is crashing — diagnose and fix it. Learn by troubleshooting.',
      difficulty: 'Hard',
      time: '10 min',
      color: '#f97316',
    },
    {
      slug: 'typing-test',
      name: 'Code Typing Speed',
      icon: '⚡',
      description: 'How fast can you type real code? Test your speed on snippets from popular open-source projects.',
      difficulty: 'Easy',
      time: '2 min',
      color: '#a855f7',
    },
    {
      slug: 'salary-calculator',
      name: 'Tech Salary Calculator',
      icon: '💰',
      description: 'Estimate compensation by role, experience, and location. Based on aggregated industry data.',
      difficulty: 'Easy',
      time: '1 min',
      color: '#22c55e',
    },
    {
      slug: 'linux-challenge',
      name: 'Linux Command Challenge',
      icon: '🐧',
      description: 'Type the right command for each task. Find files, process logs, manage permissions — under pressure.',
      difficulty: 'Medium',
      time: '5 min',
      color: '#ec4899',
    },
  ];

  constructor() {
    this.seo.update({
      title: 'Developer Games — Coding Challenges & Interactive Tools',
      description: 'Fun coding challenges for developers: spot bugs, guess code outputs, debug production scenarios, test typing speed, and more. Sharpen your skills while having fun.',
      url: '/games',
      breadcrumbs: [
        { name: 'Home', url: '/' },
        { name: 'Games', url: '/games' },
      ],
    });
  }
}
