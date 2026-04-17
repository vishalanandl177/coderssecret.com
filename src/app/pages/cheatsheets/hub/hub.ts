import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../../services/seo.service';

@Component({
  selector: 'app-cheatsheets-hub',
  imports: [RouterLink],
  template: `
    <section class="py-16 md:py-20 animate-in fade-in duration-500">
      <div class="container max-w-6xl mx-auto px-6">
        <nav aria-label="Breadcrumb" class="mb-6">
          <ol class="flex items-center gap-1.5 text-sm text-muted-foreground">
            <li><a routerLink="/" class="hover:text-foreground transition-colors">Home</a></li>
            <li class="text-muted-foreground/50">/</li>
            <li class="text-foreground font-medium" aria-current="page">Cheat Sheets</li>
          </ol>
        </nav>

        <div class="text-center mb-12">
          <h1 class="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.1] mb-4">
            Developer <span class="bg-gradient-to-r from-green-500 via-teal-500 to-blue-500 bg-clip-text text-transparent">Cheat Sheets</span>
          </h1>
          <p class="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Quick-reference cards for the tools you use every day. Bookmark them, print them, keep them open in a tab.
          </p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          @for (sheet of sheets; track sheet.slug) {
            <a [routerLink]="['/cheatsheets', sheet.slug]"
               class="group relative overflow-hidden rounded-2xl border border-border/60 bg-card p-7 transition-all duration-500 hover:shadow-xl hover:-translate-y-1 hover:border-primary/20">
              <div class="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                   [style.background-image]="'linear-gradient(to right, transparent, ' + sheet.color + ', transparent)'"></div>
              <div class="flex items-center justify-center h-14 w-14 rounded-xl text-3xl mb-4 transition-transform duration-300 group-hover:scale-110"
                   [style.background-color]="sheet.color + '15'">
                {{ sheet.icon }}
              </div>
              <h2 class="text-lg font-extrabold tracking-tight mb-2 transition-colors duration-300 group-hover:text-primary">{{ sheet.name }}</h2>
              <p class="text-sm text-muted-foreground leading-relaxed mb-4">{{ sheet.description }}</p>
              <div class="flex items-center gap-2 text-xs text-muted-foreground">
                <span class="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5">{{ sheet.sections }} sections</span>
                <span class="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5">{{ sheet.commands }}+ commands</span>
              </div>
            </a>
          }
        </div>
      </div>
    </section>
  `,
})
export class CheatsheetsHubComponent {
  private seo = inject(SeoService);

  sheets = [
    { slug: 'python', name: 'Python Cheat Sheet', icon: '🐍', color: '#3b82f6', description: 'Data types, list comprehensions, f-strings, decorators, OOP, file I/O, error handling, virtual environments.', sections: 12, commands: 80 },
    { slug: 'kubernetes', name: 'Kubernetes Cheat Sheet', icon: '⎈', color: '#326ce5', description: 'kubectl commands, pod management, deployments, services, debugging, logs, config, and secrets.', sections: 10, commands: 70 },
    { slug: 'git', name: 'Git Cheat Sheet', icon: '🔀', color: '#f97316', description: 'Branch, merge, rebase, stash, reset, log, diff, cherry-pick, and undoing every mistake.', sections: 10, commands: 60 },
    { slug: 'docker', name: 'Docker Cheat Sheet', icon: '🐳', color: '#0db7ed', description: 'Build, run, compose, volumes, networks, multi-stage builds, debugging containers.', sections: 9, commands: 55 },
    { slug: 'sql', name: 'SQL Cheat Sheet', icon: '🗄️', color: '#22c55e', description: 'SELECT, JOIN, GROUP BY, window functions, subqueries, indexes, CTEs, and performance tips.', sections: 10, commands: 65 },
  ];

  constructor() {
    this.seo.update({
      title: 'Developer Cheat Sheets — Python, Kubernetes, Git, Docker, SQL',
      description: 'Quick-reference cheat sheets for Python, Kubernetes (kubectl), Git, Docker, and SQL. Bookmark-worthy, print-friendly, always up to date.',
      url: '/cheatsheets',
      breadcrumbs: [
        { name: 'Home', url: '/' },
        { name: 'Cheat Sheets', url: '/cheatsheets' },
      ],
    });
  }
}
