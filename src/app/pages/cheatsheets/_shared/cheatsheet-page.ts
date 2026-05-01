import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';

export interface CommandRow {
  cmd: string;
  desc: string;
  prodNote?: string;
  warning?: string;
}

export interface CommandGroup {
  title: string;
  rows: CommandRow[];
}

export interface MisconfigPair {
  bad: string;
  good: string;
  why: string;
}

export interface RelatedLink {
  label: string;
  href: string;
  description?: string;
}

export interface CheatsheetHeader {
  icon: string;
  iconColor: string;        // hex color
  badge: string;
  badgeClass: string;       // 'bg-orange-500/10 border-orange-500/30 text-orange-500'
  title: string;
  intro: string;
}

@Component({
  selector: 'app-cheatsheet-page',
  imports: [RouterLink, NgClass],
  template: `
    <header class="mb-10">
      <div class="flex items-center gap-4 mb-4">
        <span class="text-4xl md:text-5xl" aria-hidden="true">{{ header.icon }}</span>
        <div>
          <span class="inline-block rounded-full border px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider mb-2" [ngClass]="header.badgeClass">{{ header.badge }}</span>
          <h1 class="text-3xl md:text-4xl font-extrabold tracking-tight">{{ header.title }}</h1>
        </div>
      </div>
      <p class="text-base md:text-lg text-muted-foreground leading-relaxed max-w-3xl">{{ header.intro }}</p>
    </header>

    <ng-content select="[slot=diagram]"></ng-content>

    @for (group of groups; track group.title) {
      <section class="mb-10" aria-labelledby="grp-{{ $index }}">
        <h2 [id]="'grp-' + $index" class="text-xl md:text-2xl font-extrabold tracking-tight mb-3">{{ group.title }}</h2>
        <div class="rounded-2xl border border-border/60 bg-card overflow-hidden">
          <div class="divide-y divide-border/40">
            @for (row of group.rows; track row.cmd) {
              <div class="px-5 py-4 hover:bg-accent/30 transition-colors">
                <div class="flex flex-col md:flex-row md:items-start gap-3">
                  <code class="text-xs md:text-sm font-mono bg-muted px-2 py-1 rounded flex-shrink-0 max-w-full md:max-w-[55%] overflow-x-auto whitespace-pre">{{ row.cmd }}</code>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm text-foreground/90 leading-relaxed">{{ row.desc }}</p>
                    @if (row.prodNote) {
                      <p class="mt-1.5 text-xs leading-relaxed flex gap-2">
                        <strong class="text-blue-500 uppercase tracking-wider text-[10px] flex-shrink-0">Prod tip</strong>
                        <span class="text-muted-foreground">{{ row.prodNote }}</span>
                      </p>
                    }
                    @if (row.warning) {
                      <p class="mt-1 text-xs leading-relaxed flex gap-2">
                        <strong class="text-red-500 uppercase tracking-wider text-[10px] flex-shrink-0">Warning</strong>
                        <span class="text-muted-foreground">{{ row.warning }}</span>
                      </p>
                    }
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      </section>
    }

    @if (misconfigPairs && misconfigPairs.length > 0) {
      <section class="mb-10" aria-labelledby="misconfig-heading">
        <h2 id="misconfig-heading" class="text-xl md:text-2xl font-extrabold tracking-tight mb-3">Common Misconfigurations</h2>
        <p class="text-sm text-muted-foreground mb-4 leading-relaxed">The bad pattern, the hardened replacement, and the reason they aren't equivalent in production.</p>
        <div class="space-y-4">
          @for (pair of misconfigPairs; track pair.why) {
            <div class="rounded-2xl border border-border/60 bg-card overflow-hidden">
              <div class="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border/40">
                <div class="p-5">
                  <div class="text-[10px] font-bold uppercase tracking-wider text-red-500 mb-2">⚠ Risky</div>
                  <pre class="text-xs font-mono bg-muted/50 rounded p-3 overflow-x-auto leading-relaxed"><code>{{ pair.bad }}</code></pre>
                </div>
                <div class="p-5">
                  <div class="text-[10px] font-bold uppercase tracking-wider text-green-500 mb-2">✓ Hardened</div>
                  <pre class="text-xs font-mono bg-muted/50 rounded p-3 overflow-x-auto leading-relaxed"><code>{{ pair.good }}</code></pre>
                </div>
              </div>
              <div class="px-5 py-3 bg-muted/30 border-t border-border/40">
                <p class="text-xs text-foreground/80 leading-relaxed"><strong>Why it matters:</strong> {{ pair.why }}</p>
              </div>
            </div>
          }
        </div>
      </section>
    }

    @if (relatedLinks && relatedLinks.length > 0) {
      <section class="mb-10" aria-labelledby="related-heading">
        <h2 id="related-heading" class="text-xl md:text-2xl font-extrabold tracking-tight mb-3">Go Deeper</h2>
        <div class="grid md:grid-cols-2 gap-3">
          @for (link of relatedLinks; track link.href) {
            <a [routerLink]="link.href" class="group rounded-xl border border-border/60 bg-card p-4 hover:border-primary/30 hover:-translate-y-0.5 transition-all">
              <div class="flex items-start gap-3">
                <div class="flex-1 min-w-0">
                  <h3 class="text-sm font-bold mb-1 group-hover:text-primary transition-colors">{{ link.label }}</h3>
                  @if (link.description) {
                    <p class="text-xs text-muted-foreground leading-snug">{{ link.description }}</p>
                  }
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="text-muted-foreground flex-shrink-0 mt-0.5 transition-all group-hover:translate-x-0.5 group-hover:text-primary" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </div>
            </a>
          }
        </div>
      </section>
    }

    <div class="mt-8 text-center text-sm">
      <a routerLink="/cheatsheets" class="text-muted-foreground hover:text-foreground">← All reference sheets</a>
    </div>
  `,
})
export class CheatsheetPageComponent {
  @Input({ required: true }) header!: CheatsheetHeader;
  @Input({ required: true }) groups!: CommandGroup[];
  @Input() misconfigPairs?: MisconfigPair[];
  @Input() relatedLinks?: RelatedLink[];
}
