import { Component, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../../services/seo.service';

@Component({
  selector: 'app-salary-calculator',
  imports: [RouterLink],
  template: `
    <section class="py-16 md:py-20 animate-in fade-in duration-500">
      <div class="container max-w-3xl mx-auto px-6">
        <nav aria-label="Breadcrumb" class="mb-6">
          <ol class="flex items-center gap-1.5 text-sm text-muted-foreground">
            <li><a routerLink="/" class="hover:text-foreground transition-colors">Home</a></li>
            <li class="text-muted-foreground/50">/</li>
            <li><a routerLink="/games" class="hover:text-foreground transition-colors">Games</a></li>
            <li class="text-muted-foreground/50">/</li>
            <li class="text-foreground font-medium" aria-current="page">Salary Calculator</li>
          </ol>
        </nav>

        <div class="text-center mb-8">
          <div class="text-5xl mb-4">💰</div>
          <h1 class="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">Tech Salary Calculator</h1>
          <p class="text-muted-foreground">Estimate compensation by role, experience, and location</p>
        </div>

        <div class="rounded-2xl border border-border/60 bg-card p-6 md:p-8">
          <div class="grid md:grid-cols-2 gap-4 mb-6">
            <div>
              <label class="block text-sm font-semibold mb-2">Role</label>
              <select [value]="role()" (change)="role.set($any($event.target).value)"
                      class="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm">
                @for (r of roles; track r.key) {
                  <option [value]="r.key">{{ r.label }}</option>
                }
              </select>
            </div>
            <div>
              <label class="block text-sm font-semibold mb-2">Experience Level</label>
              <select [value]="level()" (change)="level.set($any($event.target).value)"
                      class="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm">
                @for (l of levels; track l.key) {
                  <option [value]="l.key">{{ l.label }}</option>
                }
              </select>
            </div>
            <div>
              <label class="block text-sm font-semibold mb-2">Location</label>
              <select [value]="location()" (change)="location.set($any($event.target).value)"
                      class="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm">
                @for (loc of locations; track loc.key) {
                  <option [value]="loc.key">{{ loc.label }}</option>
                }
              </select>
            </div>
            <div>
              <label class="block text-sm font-semibold mb-2">Company Type</label>
              <select [value]="company()" (change)="company.set($any($event.target).value)"
                      class="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm">
                @for (c of companies; track c.key) {
                  <option [value]="c.key">{{ c.label }}</option>
                }
              </select>
            </div>
          </div>

          <div class="rounded-xl bg-gradient-to-br from-green-500/10 via-emerald-500/10 to-teal-500/10 border border-green-500/30 p-6 md:p-8 text-center">
            <p class="text-sm text-muted-foreground uppercase tracking-wider font-semibold mb-2">Estimated Annual Compensation</p>
            <div class="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-green-600 to-teal-500 bg-clip-text text-transparent mb-2">
              {{ formatSalary(salary()) }}
            </div>
            <p class="text-sm text-muted-foreground">
              Range: <strong class="text-foreground">{{ formatSalary(salary() * 0.85) }}</strong> — <strong class="text-foreground">{{ formatSalary(salary() * 1.15) }}</strong>
            </p>
          </div>

          <div class="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6 text-center">
            <div class="rounded-lg bg-muted p-4">
              <div class="text-xs text-muted-foreground uppercase tracking-wider mb-1">Base Salary</div>
              <div class="font-bold">{{ formatSalary(salary() * 0.7) }}</div>
            </div>
            <div class="rounded-lg bg-muted p-4">
              <div class="text-xs text-muted-foreground uppercase tracking-wider mb-1">Bonus (est.)</div>
              <div class="font-bold">{{ formatSalary(salary() * 0.1) }}</div>
            </div>
            <div class="rounded-lg bg-muted p-4 col-span-2 md:col-span-1">
              <div class="text-xs text-muted-foreground uppercase tracking-wider mb-1">Equity (est.)</div>
              <div class="font-bold">{{ formatSalary(salary() * 0.2) }}</div>
            </div>
          </div>

          <p class="mt-6 text-xs text-muted-foreground text-center leading-relaxed">
            Estimates based on aggregated public data from Levels.fyi, Glassdoor, and h1bdata.info. Individual compensation varies widely based on company, skills, and negotiation. Use as a starting point, not exact numbers.
          </p>
        </div>

        <div class="mt-6 flex justify-center">
          <a routerLink="/games"
             class="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
            ← All Games
          </a>
        </div>
      </div>
    </section>
  `,
})
export class SalaryCalculatorComponent {
  private seo = inject(SeoService);

  roles = [
    { key: 'swe', label: 'Software Engineer', base: 100000 },
    { key: 'sre', label: 'SRE / DevOps Engineer', base: 110000 },
    { key: 'ml', label: 'ML / AI Engineer', base: 120000 },
    { key: 'data', label: 'Data Engineer', base: 105000 },
    { key: 'security', label: 'Security Engineer', base: 115000 },
    { key: 'frontend', label: 'Frontend Engineer', base: 95000 },
    { key: 'backend', label: 'Backend Engineer', base: 105000 },
    { key: 'fullstack', label: 'Full-Stack Engineer', base: 100000 },
    { key: 'mobile', label: 'Mobile Engineer', base: 100000 },
    { key: 'em', label: 'Engineering Manager', base: 150000 },
  ];

  levels = [
    { key: 'junior', label: 'Junior (0-2 years)', mult: 0.65 },
    { key: 'mid', label: 'Mid-level (2-5 years)', mult: 1.0 },
    { key: 'senior', label: 'Senior (5-8 years)', mult: 1.5 },
    { key: 'staff', label: 'Staff (8+ years)', mult: 2.2 },
    { key: 'principal', label: 'Principal (10+ years)', mult: 3.0 },
  ];

  locations = [
    { key: 'sf', label: 'San Francisco Bay Area', mult: 1.5 },
    { key: 'nyc', label: 'New York City', mult: 1.35 },
    { key: 'seattle', label: 'Seattle', mult: 1.3 },
    { key: 'la', label: 'Los Angeles', mult: 1.2 },
    { key: 'austin', label: 'Austin, TX', mult: 1.1 },
    { key: 'remote-us', label: 'Remote (US)', mult: 1.05 },
    { key: 'london', label: 'London, UK', mult: 0.85 },
    { key: 'berlin', label: 'Berlin, Germany', mult: 0.75 },
    { key: 'bangalore', label: 'Bangalore, India', mult: 0.3 },
    { key: 'singapore', label: 'Singapore', mult: 0.95 },
    { key: 'toronto', label: 'Toronto, Canada', mult: 0.85 },
  ];

  companies = [
    { key: 'bigtech', label: 'Big Tech (FAANG+)', mult: 1.5 },
    { key: 'unicorn', label: 'Late-stage Startup / Unicorn', mult: 1.2 },
    { key: 'public', label: 'Public Tech Company', mult: 1.1 },
    { key: 'mid', label: 'Mid-size Company', mult: 1.0 },
    { key: 'startup', label: 'Early-stage Startup', mult: 0.85 },
    { key: 'nonprofit', label: 'Non-profit / Government', mult: 0.7 },
  ];

  role = signal('swe');
  level = signal('mid');
  location = signal('sf');
  company = signal('bigtech');

  salary = computed(() => {
    const r = this.roles.find(r => r.key === this.role())!;
    const l = this.levels.find(l => l.key === this.level())!;
    const loc = this.locations.find(loc => loc.key === this.location())!;
    const c = this.companies.find(c => c.key === this.company())!;
    return Math.round(r.base * l.mult * loc.mult * c.mult);
  });

  formatSalary(amount: number): string {
    const loc = this.locations.find(l => l.key === this.location())!;
    const isIndia = loc.key === 'bangalore';
    const isEurope = ['london', 'berlin'].includes(loc.key);
    const isUK = loc.key === 'london';

    if (isIndia) {
      const inr = Math.round(amount * 83); // rough USD to INR
      return `₹${(inr / 100000).toFixed(1)}L`;
    }
    if (isUK) {
      return `£${Math.round(amount).toLocaleString()}`;
    }
    if (isEurope) {
      return `€${Math.round(amount).toLocaleString()}`;
    }
    return `$${Math.round(amount).toLocaleString()}`;
  }

  constructor() {
    this.seo.update({
      title: 'Tech Salary Calculator — Software Engineer Compensation',
      description: 'Estimate software engineer salaries by role, experience, location, and company type. Data from Levels.fyi, Glassdoor, and industry reports.',
      url: '/games/salary-calculator',
      breadcrumbs: [
        { name: 'Home', url: '/' },
        { name: 'Games', url: '/games' },
        { name: 'Salary Calculator', url: '/games/salary-calculator' },
      ],
    });
  }
}
