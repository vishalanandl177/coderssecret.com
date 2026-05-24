import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../services/seo.service';
import { EXTERNAL_LINKS } from '../../shared/external-links';
import { md3CategoryAccent, md3CategoryAccentLine, md3CategoryGradient, md3CategoryTint } from '../../shared/md3/md3-color-roles';

type PostCard = { id: string; title: string; slug: string; excerpt: string; category: string; date: string; readTime: string; tags: string[]; author: string; featured?: boolean; popularRank?: number; coverImage: string };
type CategoryInfo = { name: string; slug: string };
type HeroTrackKey = 'security' | 'ai' | 'data' | 'devops' | 'labs';
type HeroTrack = {
  key: HeroTrackKey;
  label: string;
  title: string;
  outcome: string;
  route: string;
  color: string;
  nodes: string[];
  metrics: { label: string; value: string }[];
};

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  template: `
    <!-- Material 3-style hero -->
    <section class="md3-home-hero relative overflow-hidden px-3 py-3 sm:px-4 sm:py-4 lg:px-6 lg:py-6">
      <div class="md3-hero-panel mx-auto grid max-w-[100rem] gap-3 lg:grid-cols-[minmax(0,0.96fr)_minmax(24rem,1fr)]">
        <div class="md3-home-hero-copy flex max-w-6xl flex-col items-start text-left">
          <!-- Badge -->
          <a routerLink="/slides/drf-api-logger" class="md3-chip-selected mb-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <span class="md3-status-dot-wrap" aria-hidden="true">
              <span class="md3-status-dot-ping"></span>
              <span class="md3-status-dot"></span>
            </span>
            <span class="font-mono text-[10px] uppercase tracking-wider">NEW</span>
            Watch any article as narrated slides
          </a>

          <!-- Heading -->
          <h1 class="md3-display-title">
            Security, AI, Data &amp; Production Engineering
          </h1>

          <p class="mt-7 max-w-3xl text-xl leading-8 text-[color:var(--md-sys-color-on-surface-variant)] md:text-2xl md:leading-9 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            Practical guides, free courses, labs, and references for engineers building secure production systems.
          </p>

          <div class="mt-6 flex flex-wrap gap-2 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            <span class="md3-chip-selected">Free</span>
            <span class="md3-chip">Ad-free</span>
            <span class="md3-chip">Production-focused</span>
          </div>

          <!-- CTA buttons -->
          <div class="mt-10 flex flex-wrap gap-3 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
            <a routerLink="/courses"
               class="md3-button-filled md3-button-large group">
              Start a Free Course
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
              </svg>
            </a>
            <a routerLink="/blog"
               class="md3-button-tonal md3-button-large group">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v6h6"/><path d="M8 13h8"/><path d="M8 17h5"/>
              </svg>
              Browse Engineering Guides
            </a>
          </div>

          <!-- Stats -->
          <div class="md3-hero-stats mt-16 grid w-full grid-cols-2 gap-3 md:grid-cols-5 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
            <div class="md3-stat-tile">
              <div class="md3-stat-number">{{ totalPosts() }}</div>
              <div class="md3-stat-label">Articles</div>
            </div>
            <div class="md3-stat-tile">
              <div class="md3-stat-number">{{ categories().length }}</div>
              <div class="md3-stat-label">Categories</div>
            </div>
            <div class="md3-stat-tile">
              <div class="md3-stat-number">{{ uniqueTags() }}</div>
              <div class="md3-stat-label">Topics</div>
            </div>
            <div class="md3-stat-tile">
              <div class="md3-stat-number">{{ totalCourseModules() }}</div>
              <div class="md3-stat-label">Course Modules</div>
            </div>
            <div class="md3-stat-tile">
              <div class="md3-stat-number">{{ totalLabs() }}+</div>
              <div class="md3-stat-label">Hands-On Labs</div>
            </div>
          </div>
        </div>

        <div class="md3-hero-visual-stage animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
          <div class="md3-floating-panel md3-floating-panel-a" aria-hidden="true">
            <div class="md3-floating-title">AI gateway</div>
            <svg viewBox="0 0 220 112" role="img">
              <path class="md3-floating-path" d="M22 82 C48 26, 82 28, 106 58 S166 100, 198 38"/>
              <circle cx="42" cy="72" r="16"/>
              <circle cx="108" cy="58" r="22"/>
              <circle cx="182" cy="42" r="17"/>
              <text x="108" y="62" text-anchor="middle">eval</text>
            </svg>
          </div>
          <div class="md3-floating-panel md3-floating-panel-b" aria-hidden="true">
            <div class="md3-floating-title">Zero Trust</div>
            <div class="md3-mini-stack">
              <span>identity</span>
              <span>policy</span>
              <span>runtime</span>
            </div>
          </div>

          <aside class="md3-cockpit-panel"
                 aria-label="Interactive production engineering tracks">
          <div class="flex items-start justify-between gap-4">
            <div>
              <p class="text-xs font-bold uppercase tracking-[0.18em] text-[color:var(--md-sys-color-outline)]">Production Cockpit</p>
              <h2 class="mt-2 text-2xl font-semibold tracking-tight text-[color:var(--md-sys-color-on-surface)]">Pick a learning track</h2>
            </div>
            <span class="md3-live-dot" aria-hidden="true"></span>
          </div>

          <div class="mt-6 flex flex-wrap gap-2" role="tablist" aria-label="Engineering track selector">
            @for (track of heroTracks; track track.key) {
              <button type="button"
                      role="tab"
                      [attr.aria-selected]="activeHeroTrack() === track.key"
                      [class.md3-cockpit-tab-active]="activeHeroTrack() === track.key"
                      class="md3-cockpit-tab"
                      (click)="activeHeroTrack.set(track.key)"
                      (keydown.arrowRight)="selectNextHeroTrack(1)"
                      (keydown.arrowLeft)="selectNextHeroTrack(-1)">
                {{ track.label }}
              </button>
            }
          </div>

          @if (activeHeroTrackData(); as track) {
            <div class="mt-6 grid items-start gap-5 2xl:grid-cols-[1fr_0.9fr]" [style.--track-color]="track.color">
              <div class="md3-system-map" aria-hidden="true">
                <svg viewBox="0 0 360 260" role="img">
                  <defs>
                    <linearGradient id="trackFlowGradient" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stop-color="var(--track-color)" stop-opacity="0.95"/>
                      <stop offset="100%" stop-color="var(--md-sys-color-primary)" stop-opacity="0.45"/>
                    </linearGradient>
                  </defs>
                  <path class="md3-flow-line" d="M72 70 C140 28, 215 30, 286 72"/>
                  <path class="md3-flow-line md3-flow-line-alt" d="M72 190 C140 232, 215 230, 286 188"/>
                  <path class="md3-flow-line md3-flow-line-alt2" d="M74 72 C112 128, 114 132, 74 188"/>
                  <path class="md3-flow-line" d="M286 72 C248 128, 248 132, 286 188"/>
                  <circle class="md3-map-node md3-map-node-a" cx="72" cy="70" r="30"/>
                  <circle class="md3-map-node md3-map-node-b" cx="286" cy="72" r="30"/>
                  <circle class="md3-map-node md3-map-node-c" cx="286" cy="188" r="30"/>
                  <circle class="md3-map-node md3-map-node-d" cx="72" cy="190" r="30"/>
                  <circle class="md3-map-core" cx="180" cy="130" r="42"/>
                  <text x="180" y="126" text-anchor="middle" class="md3-map-core-text">prod</text>
                  <text x="180" y="145" text-anchor="middle" class="md3-map-core-subtext">ready</text>
                </svg>
                <div class="md3-map-label md3-map-label-a">{{ track.nodes[0] }}</div>
                <div class="md3-map-label md3-map-label-b">{{ track.nodes[1] }}</div>
                <div class="md3-map-label md3-map-label-c">{{ track.nodes[2] }}</div>
                <div class="md3-map-label md3-map-label-d">{{ track.nodes[3] }}</div>
              </div>

              <div class="flex flex-col justify-between gap-5">
                <div>
                  <p class="text-sm font-bold text-[color:var(--track-color)]">{{ track.label }}</p>
                  <h3 class="mt-2 text-2xl font-semibold leading-tight tracking-tight">{{ track.title }}</h3>
                  <p class="mt-3 text-sm leading-6 text-[color:var(--md-sys-color-on-surface-variant)]">{{ track.outcome }}</p>
                </div>

                <div class="grid grid-cols-2 gap-2">
                  @for (metric of track.metrics; track metric.label) {
                    <div class="md3-cockpit-metric">
                      <div class="text-xl font-semibold">{{ metric.value }}</div>
                      <div class="mt-1 text-xs font-semibold text-[color:var(--md-sys-color-on-surface-variant)]">{{ metric.label }}</div>
                    </div>
                  }
                </div>

                <a [routerLink]="track.route" class="md3-cockpit-link">
                  Open this track
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                       stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                  </svg>
                </a>
              </div>
            </div>
          }
          </aside>
        </div>
      </div>
    </section>

    <section class="md3-home-os-section md3-section" aria-labelledby="engineering-os-heading">
      <div class="md3-container">
        <div class="md3-home-os-grid">
          <div class="md3-home-os-copy">
            <span class="md3-home-section-kicker">Production learning map</span>
            <h2 id="engineering-os-heading">An engineering operating system for secure production work</h2>
            <p>
              CodersSecret connects guides, courses, labs, reference sheets, and glossary terms as one practical path: learn the concept, inspect the architecture, practice the failure mode, then keep the checklist close when you ship.
            </p>
            <div class="md3-home-os-actions">
              <a routerLink="/courses" class="md3-button-filled">
                Courses
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                </svg>
              </a>
              <a routerLink="/games" class="md3-button-tonal">Interactive labs</a>
              <a routerLink="/cheatsheets" class="md3-button-outlined">Reference sheets</a>
            </div>
          </div>

          <div class="md3-home-pathway-visual" aria-hidden="true">
            <svg viewBox="0 0 640 360" role="img">
              <defs>
                <linearGradient id="homePathwayGradient" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stop-color="var(--md-sys-color-primary)"/>
                  <stop offset="52%" stop-color="var(--md-sys-color-secondary)"/>
                  <stop offset="100%" stop-color="var(--md-sys-color-tertiary)"/>
                </linearGradient>
              </defs>
              <path class="md3-home-pathway-line" d="M92 180 C164 72, 276 76, 320 180 S476 292, 548 180"/>
              <path class="md3-home-pathway-line md3-home-pathway-line-alt" d="M92 180 C166 286, 272 286, 320 180 S478 70, 548 180"/>
              <g class="md3-home-pathway-node md3-home-pathway-node-a">
                <circle cx="92" cy="180" r="42"/>
                <text x="92" y="175" text-anchor="middle">identity</text>
                <text x="92" y="195" text-anchor="middle">SPIRE</text>
              </g>
              <g class="md3-home-pathway-node md3-home-pathway-node-b">
                <circle cx="250" cy="98" r="42"/>
                <text x="250" y="93" text-anchor="middle">runtime</text>
                <text x="250" y="113" text-anchor="middle">K8s</text>
              </g>
              <g class="md3-home-pathway-node md3-home-pathway-node-c">
                <circle cx="390" cy="262" r="42"/>
                <text x="390" y="257" text-anchor="middle">RAG</text>
                <text x="390" y="277" text-anchor="middle">eval</text>
              </g>
              <g class="md3-home-pathway-node md3-home-pathway-node-d">
                <circle cx="548" cy="180" r="42"/>
                <text x="548" y="175" text-anchor="middle">ship</text>
                <text x="548" y="195" text-anchor="middle">check</text>
              </g>
            </svg>
            <div class="md3-home-signal-card md3-home-signal-card-a">
              <span>active path</span>
              <strong>Security to runtime</strong>
            </div>
            <div class="md3-home-signal-card md3-home-signal-card-b">
              <span>next action</span>
              <strong>Practice in labs</strong>
            </div>
          </div>
        </div>

        <div class="md3-home-flow-grid" aria-label="How the homepage content connects">
          <a routerLink="/courses" class="md3-home-flow-card">
            <span class="md3-home-flow-card-icon" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5z"/>
              </svg>
            </span>
            <span class="md3-home-flow-card-title">Learn the system</span>
            <span class="md3-home-flow-card-copy">Use structured courses for SPIFFE, Kubernetes security, production RAG, distributed systems, and dbt analytics engineering.</span>
            <span class="md3-home-flow-card-action">
              Open course hub
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
              </svg>
            </span>
          </a>

          <a routerLink="/games" class="md3-home-flow-card">
            <span class="md3-home-flow-card-icon" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M6 12h4"/><path d="M8 10v4"/><path d="M15 13h.01"/><path d="M18 11h.01"/><rect x="2" y="6" width="20" height="12" rx="4"/>
              </svg>
            </span>
            <span class="md3-home-flow-card-title">Practice decisions</span>
            <span class="md3-home-flow-card-copy">Run scenario-style labs for incident response, API security, Linux, supply chain controls, and AI infrastructure.</span>
            <span class="md3-home-flow-card-action">
              Explore labs
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
              </svg>
            </span>
          </a>

          <a routerLink="/cheatsheets" class="md3-home-flow-card">
            <span class="md3-home-flow-card-icon" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v6h6"/><path d="M8 13h8"/><path d="M8 17h5"/>
              </svg>
            </span>
            <span class="md3-home-flow-card-title">Reference fast</span>
            <span class="md3-home-flow-card-copy">Keep compact command sheets, production warnings, glossary definitions, and implementation checklists close while building.</span>
            <span class="md3-home-flow-card-action">
              Browse cheatsheets
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
              </svg>
            </span>
          </a>

          <a routerLink="/blog" class="md3-home-flow-card">
            <span class="md3-home-flow-card-icon" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5Z"/><path d="M8 7h8"/><path d="M8 11h8"/><path d="M8 15h5"/>
              </svg>
            </span>
            <span class="md3-home-flow-card-title">Go deeper</span>
            <span class="md3-home-flow-card-copy">Move from short references to long-form guides, architecture breakdowns, and consulting-focused production patterns.</span>
            <span class="md3-home-flow-card-action">
              Read guides
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
              </svg>
            </span>
          </a>
        </div>
      </div>
    </section>

    <!-- ========================================================== -->
    <!-- SECTION 1: Learn Cloud Native Security Through Practical Engineering -->
    <!-- ========================================================== -->
    <section class="md3-home-card-section md3-home-practical-section relative py-16 md:py-24 overflow-hidden" aria-labelledby="practical-engineering-heading">
      <div class="absolute inset-0 -z-10">
        <div class="absolute top-0 left-1/2 -translate-x-1/2 h-[400px] w-[800px] bg-gradient-to-b from-blue-500/10 via-cyan-500/5 to-transparent blur-3xl"></div>
      </div>
      <div class="container max-w-7xl mx-auto px-6">
        <div class="text-center max-w-3xl mx-auto mb-14">
          <span class="md3-section-eyebrow inline-block rounded-full bg-blue-500/10 border border-blue-500/30 px-4 py-1 text-xs font-bold text-blue-500 uppercase tracking-wider mb-4">Practical Engineering</span>
          <h2 id="practical-engineering-heading" class="text-3xl md:text-5xl font-extrabold tracking-tight leading-[1.1] mb-5">
            Learn <span class="bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 bg-clip-text text-transparent">Cloud Native Security</span> Through Practical Engineering
          </h2>
          <p class="text-base md:text-lg text-muted-foreground leading-relaxed">
            Understand production security systems through <strong class="text-foreground">hands-on labs</strong>, annotated <strong class="text-foreground">architecture diagrams</strong>, real infrastructure examples, and step-by-step deployments &mdash; not abstract theory or marketing copy. Every concept you learn here is built, broken, and rebuilt against the same systems used by teams running Kubernetes in production today.
          </p>
        </div>

        <!-- 3 Pillar cards (H3) -->
        <div class="md3-info-grid grid md:grid-cols-3 gap-5 mb-10">
          <article class="md3-info-card md3-info-card-primary rounded-2xl border border-border/60 bg-card p-7 hover:border-blue-500/40 transition-all hover:-translate-y-1">
            <div class="md3-info-icon inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-blue-500" aria-hidden="true"><path d="M5 22h14"/><path d="M5 2h14"/><path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22"/><path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2"/></svg>
            </div>
            <h3 class="md3-info-title text-xl font-bold mb-2 tracking-tight">Hands-On Kubernetes Security Labs</h3>
            <p class="md3-info-copy text-sm text-muted-foreground leading-relaxed">Spin up real clusters, deploy SPIRE agents, federate trust domains, write Rego policies, and break workload identity yourself. Every lab ships with manifests, troubleshooting steps, and verified outputs &mdash; so you can reproduce production behavior on a laptop.</p>
            <a routerLink="/courses/mastering-spiffe-spire" class="md3-info-action mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-500 hover:text-blue-400 transition-colors">
              Try the SPIFFE/SPIRE labs
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </a>
          </article>
          <article class="md3-info-card md3-info-card-secondary rounded-2xl border border-border/60 bg-card p-7 hover:border-purple-500/40 transition-all hover:-translate-y-1">
            <div class="md3-info-icon inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-purple-500" aria-hidden="true"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/></svg>
            </div>
            <h3 class="md3-info-title text-xl font-bold mb-2 tracking-tight">Production-Grade Security Architectures</h3>
            <p class="md3-info-copy text-sm text-muted-foreground leading-relaxed">Walk through the architecture of multi-cluster identity federation, sidecar-injected mTLS, OPA policy enforcement, and supply-chain signing flows. Each architecture is dissected layer by layer, with the trade-offs and failure modes that only show up at scale.</p>
            <a routerLink="/courses/cloud-native-security-engineering" class="md3-info-action mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-purple-500 hover:text-purple-400 transition-colors">
              Study production architectures
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </a>
          </article>
          <article class="md3-info-card md3-info-card-tertiary rounded-2xl border border-border/60 bg-card p-7 hover:border-orange-500/40 transition-all hover:-translate-y-1">
            <div class="md3-info-icon inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-orange-500" aria-hidden="true"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
            </div>
            <h3 class="md3-info-title text-xl font-bold mb-2 tracking-tight">Real-World Cloud Native Threat Modeling</h3>
            <p class="md3-info-copy text-sm text-muted-foreground leading-relaxed">Map attacks against Kubernetes API servers, sidecar containers, service mesh control planes, and the supply chain. Each threat model is grounded in real CVEs, real post-mortems, and the controls (Falco, OPA, image signing) that contain them.</p>
            <a routerLink="/courses/kubernetes-runtime-security" class="md3-info-action mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-orange-500 hover:text-orange-400 transition-colors">
              Explore threat modeling
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </a>
          </article>
        </div>

        <!-- 4 H4 supporting topic tiles -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3" aria-label="Foundational security capabilities">
          <a routerLink="/glossary/falco" class="md3-mini-link-card group rounded-xl border border-border/60 bg-card/60 backdrop-blur-sm p-4 hover:border-primary/40 hover:-translate-y-0.5 transition-all">
            <h4 class="md3-mini-link-title text-sm font-bold mb-1 group-hover:text-primary transition-colors">Runtime Security</h4>
            <p class="md3-mini-link-copy text-xs text-muted-foreground leading-snug">Detect anomalous syscalls, exec, and network behavior with Falco &amp; eBPF.</p>
          </a>
          <a routerLink="/courses/cloud-native-security-engineering/containers-workload-security" class="md3-mini-link-card group rounded-xl border border-border/60 bg-card/60 backdrop-blur-sm p-4 hover:border-primary/40 hover:-translate-y-0.5 transition-all">
            <h4 class="md3-mini-link-title text-sm font-bold mb-1 group-hover:text-primary transition-colors">Workload Isolation</h4>
            <p class="md3-mini-link-copy text-xs text-muted-foreground leading-snug">PodSecurity standards, gVisor, namespace boundaries &amp; RBAC.</p>
          </a>
          <a routerLink="/glossary/workload-identity" class="md3-mini-link-card group rounded-xl border border-border/60 bg-card/60 backdrop-blur-sm p-4 hover:border-primary/40 hover:-translate-y-0.5 transition-all">
            <h4 class="md3-mini-link-title text-sm font-bold mb-1 group-hover:text-primary transition-colors">Identity-Aware Infrastructure</h4>
            <p class="md3-mini-link-copy text-xs text-muted-foreground leading-snug">SPIFFE IDs, SVIDs &amp; cryptographic workload identity for every service.</p>
          </a>
          <a routerLink="/glossary/mtls" class="md3-mini-link-card group rounded-xl border border-border/60 bg-card/60 backdrop-blur-sm p-4 hover:border-primary/40 hover:-translate-y-0.5 transition-all">
            <h4 class="md3-mini-link-title text-sm font-bold mb-1 group-hover:text-primary transition-colors">Secure Service Communication</h4>
            <p class="md3-mini-link-copy text-xs text-muted-foreground leading-snug">mTLS, SPIFFE-bootstrapped trust, and zero-config service authentication.</p>
          </a>
        </div>
      </div>
    </section>

    <!-- ========================================================== -->
    <!-- SECTION 2: Production Courses on Security, AI and Data Engineering -->
    <!-- ========================================================== -->
    <section class="md3-home-courses-section py-16 md:py-24 bg-gradient-to-br from-teal-500/5 via-cyan-500/5 to-blue-500/5 border-y border-border/40" aria-labelledby="production-courses-heading">
      <div class="container max-w-7xl mx-auto px-6">
        <div class="text-center max-w-3xl mx-auto mb-12">
          <span class="md3-course-eyebrow inline-block rounded-full bg-green-500/10 border border-green-500/30 px-4 py-1 text-xs font-bold text-green-500 uppercase tracking-wider mb-4">100% Free &middot; Open Curriculum</span>
          <h2 id="production-courses-heading" class="text-3xl md:text-5xl font-extrabold tracking-tight leading-[1.1] mb-5">
            Production Courses for <span class="bg-gradient-to-r from-teal-500 to-cyan-500 bg-clip-text text-transparent">Security</span>, <span class="bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">AI</span> &amp; <span class="bg-gradient-to-r from-blue-500 to-emerald-500 bg-clip-text text-transparent">Data Engineering</span>
          </h2>
          <p class="text-base md:text-lg text-muted-foreground leading-relaxed">
            Five complete, free curriculums covering 73 modules and 145+ labs or inline exercises. Each course is built around production thinking: annotated configs, practical diagrams, guided labs, and the diagnostic workflow engineers use when systems fail.
          </p>
        </div>

        <!-- 4 featured course cards (H3) -->
        <div class="md3-course-grid grid md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          <!-- Course 1: SPIFFE/SPIRE -->
          <article class="md3-course-card md3-course-card-spiffe">
            <div class="md3-course-card-visual" aria-hidden="true">
              <svg class="md3-course-svg" viewBox="0 0 220 128" role="img">
                <path class="md3-course-svg-line" d="M42 78h56m24 0h56M84 50l26 28 28-28M84 106l26-28 28 28"/>
                <circle class="md3-course-svg-node" cx="42" cy="78" r="18"/>
                <circle class="md3-course-svg-node" cx="110" cy="78" r="22"/>
                <circle class="md3-course-svg-node" cx="178" cy="78" r="18"/>
                <path class="md3-course-svg-mark" d="M101 78l6 6 13-14"/>
              </svg>
            </div>
            <div class="md3-course-meta">
              <span class="md3-course-chip md3-course-chip-strong">Free</span>
              <span class="md3-course-chip">13 Modules</span>
              <span class="md3-course-chip">30 Labs</span>
            </div>
            <h3 class="md3-course-title">Master SPIFFE &amp; SPIRE for Workload Identity</h3>
            <p class="md3-course-copy">Deploy SPIRE on Kubernetes, attest workloads, issue X.509 and JWT SVIDs, and federate trust across clusters and clouds.</p>
            <a routerLink="/courses/mastering-spiffe-spire" class="md3-course-action">
              Start the SPIFFE/SPIRE course
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </a>
          </article>

          <!-- Course 2: Kubernetes Security -->
          <article class="md3-course-card md3-course-card-kubernetes">
            <div class="md3-course-card-visual" aria-hidden="true">
              <svg class="md3-course-svg" viewBox="0 0 220 128" role="img">
                <path class="md3-course-svg-line" d="M110 28v72M70 50l40 24 40-24M70 98l40-24 40 24"/>
                <path class="md3-course-svg-node" d="M110 18l46 27v54l-46 27-46-27V45z"/>
                <circle class="md3-course-svg-dot" cx="110" cy="74" r="12"/>
                <circle class="md3-course-svg-dot" cx="70" cy="50" r="8"/>
                <circle class="md3-course-svg-dot" cx="150" cy="50" r="8"/>
                <circle class="md3-course-svg-dot" cx="70" cy="98" r="8"/>
                <circle class="md3-course-svg-dot" cx="150" cy="98" r="8"/>
              </svg>
            </div>
            <div class="md3-course-meta">
              <span class="md3-course-chip md3-course-chip-strong">Free</span>
              <span class="md3-course-chip">16 Modules</span>
              <span class="md3-course-chip">32 Labs</span>
            </div>
            <h3 class="md3-course-title">Secure Kubernetes Workloads in Production</h3>
            <p class="md3-course-copy">Harden PodSecurity, RBAC, network policy, runtime detection, signed images, and supply-chain controls as one production workflow.</p>
            <a routerLink="/courses/cloud-native-security-engineering" class="md3-course-action">
              Open the Kubernetes track
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </a>
          </article>

          <!-- Course 3: Production RAG -->
          <article class="md3-course-card md3-course-card-rag">
            <div class="md3-course-card-visual" aria-hidden="true">
              <svg class="md3-course-svg" viewBox="0 0 220 128" role="img">
                <rect class="md3-course-svg-node" x="44" y="24" width="132" height="28" rx="14"/>
                <rect class="md3-course-svg-node" x="44" y="76" width="132" height="28" rx="14"/>
                <path class="md3-course-svg-line" d="M70 52v24m40-24v24m40-24v24"/>
                <circle class="md3-course-svg-dot" cx="70" cy="90" r="7"/>
                <circle class="md3-course-svg-dot" cx="110" cy="90" r="7"/>
                <circle class="md3-course-svg-dot" cx="150" cy="90" r="7"/>
                <path class="md3-course-svg-mark" d="M88 38h44m-28 52h12"/>
              </svg>
            </div>
            <div class="md3-course-meta">
              <span class="md3-course-chip md3-course-chip-strong">Free</span>
              <span class="md3-course-chip">16 Modules</span>
              <span class="md3-course-chip">31 Labs</span>
            </div>
            <h3 class="md3-course-title">Engineer Production RAG Systems</h3>
            <p class="md3-course-copy">Build reliable AI retrieval with ingestion, embeddings, hybrid search, reranking, evaluation, observability, security, and deployment.</p>
            <a routerLink="/courses/production-rag-systems-engineering" class="md3-course-action">
              Start the RAG course
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </a>
          </article>

          <!-- Course 4: Analytics Engineering -->
          <article class="md3-course-card md3-course-card-analytics">
            <div class="md3-course-card-visual" aria-hidden="true">
              <svg class="md3-course-svg" viewBox="0 0 220 128" role="img">
                <path class="md3-course-svg-line" d="M54 96h112M66 80l28-24 28 16 34-38"/>
                <rect class="md3-course-svg-node" x="48" y="28" width="34" height="68" rx="12"/>
                <rect class="md3-course-svg-node" x="94" y="48" width="34" height="48" rx="12"/>
                <rect class="md3-course-svg-node" x="140" y="18" width="34" height="78" rx="12"/>
                <circle class="md3-course-svg-dot" cx="94" cy="56" r="6"/>
                <circle class="md3-course-svg-dot" cx="122" cy="72" r="6"/>
                <circle class="md3-course-svg-dot" cx="156" cy="34" r="6"/>
              </svg>
            </div>
            <div class="md3-course-meta">
              <span class="md3-course-chip md3-course-chip-strong">Free</span>
              <span class="md3-course-chip">16 Modules</span>
              <span class="md3-course-chip">Inline Labs</span>
            </div>
            <h3 class="md3-course-title">Build Trusted Analytics with dbt</h3>
            <p class="md3-course-copy">Model staging layers, marts, tests, freshness, metrics, MetricFlow, lineage, CI/CD, and data incident debugging.</p>
            <a routerLink="/courses/production-analytics-engineering-dbt" class="md3-course-action">
              Start the analytics course
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </a>
          </article>
        </div>

        <!-- 4 H4 supporting concept tiles -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3" aria-label="Production engineering building blocks">
          <a routerLink="/glossary/mtls" class="md3-course-mini-card md3-course-mini-card-spiffe group">
            <span class="md3-course-mini-icon" aria-hidden="true">TLS</span>
            <h4 class="md3-course-mini-title">mTLS</h4>
            <p class="md3-course-mini-copy">Mutual TLS as the universal handshake for service-to-service trust.</p>
          </a>
          <a routerLink="/glossary/spiffe" class="md3-course-mini-card md3-course-mini-card-spiffe group">
            <span class="md3-course-mini-icon" aria-hidden="true">ID</span>
            <h4 class="md3-course-mini-title">Service Identity</h4>
            <p class="md3-course-mini-copy">SPIFFE IDs that uniquely name every workload, regardless of platform.</p>
          </a>
          <a routerLink="/courses/production-rag-systems-engineering/rag-evaluation-quality-engineering" class="md3-course-mini-card md3-course-mini-card-rag group">
            <span class="md3-course-mini-icon" aria-hidden="true">AI</span>
            <h4 class="md3-course-mini-title">RAG Evaluation</h4>
            <p class="md3-course-mini-copy">Retrieval quality, hallucination checks, and regression gates for AI systems.</p>
          </a>
          <a routerLink="/courses/production-analytics-engineering-dbt/semantic-layer-fundamentals" class="md3-course-mini-card md3-course-mini-card-analytics group">
            <span class="md3-course-mini-icon" aria-hidden="true">DBT</span>
            <h4 class="md3-course-mini-title">Semantic Layer</h4>
            <p class="md3-course-mini-copy">Governed metrics and business definitions that dashboards can trust.</p>
          </a>
        </div>

        <div class="mt-10 text-center">
          <a routerLink="/courses" class="md3-button-tonal">
            Browse all free courses
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </a>
        </div>
      </div>
    </section>

    <!-- ========================================================== -->
    <!-- SECTION 3: Cloud Native Security Topics You'll Learn -->
    <!-- ========================================================== -->
    <section class="md3-home-card-section md3-home-topics-section py-16 md:py-24 animate-in fade-in duration-700" aria-labelledby="topics-heading">
      <div class="container max-w-7xl mx-auto px-6">
        <div class="text-center max-w-3xl mx-auto mb-12">
          <span class="md3-section-eyebrow inline-block rounded-full bg-purple-500/10 border border-purple-500/30 px-4 py-1 text-xs font-bold text-purple-500 uppercase tracking-wider mb-4">Topical Coverage</span>
          <h2 id="topics-heading" class="text-3xl md:text-5xl font-extrabold tracking-tight leading-[1.1] mb-5">
            Cloud Native Security Topics You&apos;ll Learn
          </h2>
          <p class="text-base md:text-lg text-muted-foreground leading-relaxed">
            A curated map of the security disciplines that define modern infrastructure engineering &mdash; covered in depth across courses, articles, diagrams, and labs. Each topic is taught from first principles, then connected to the production systems and CNCF projects that implement it.
          </p>
        </div>

        <div class="md3-topic-grid grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          <!-- Topic 1 -->
          <article class="md3-topic-card md3-topic-card-tertiary rounded-2xl border border-border/60 bg-card p-6 hover:border-orange-500/40 hover:-translate-y-1 transition-all">
            <div class="md3-topic-icon inline-flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-orange-500" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <h3 class="md3-topic-title text-lg font-bold mb-2 tracking-tight">Kubernetes Security &amp; Runtime Protection</h3>
            <p class="md3-topic-copy text-sm text-muted-foreground leading-relaxed mb-4">Lock down PodSecurity standards, enforce least-privilege RBAC, isolate workloads with network policies, and detect compromise in real time using Falco and eBPF. Understand the attack surface of the API server, kubelet, and etcd &mdash; then close it.</p>
            <a routerLink="/courses/kubernetes-runtime-security" class="md3-topic-action inline-flex items-center gap-1.5 text-sm font-semibold text-orange-500 hover:text-orange-400 transition-colors">
              Explore runtime security
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </a>
          </article>

          <!-- Topic 2 -->
          <article class="md3-topic-card md3-topic-card-secondary rounded-2xl border border-border/60 bg-card p-6 hover:border-cyan-500/40 hover:-translate-y-1 transition-all">
            <div class="md3-topic-icon inline-flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-cyan-500" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
            </div>
            <h3 class="md3-topic-title text-lg font-bold mb-2 tracking-tight">Service Mesh, mTLS &amp; Secure Networking</h3>
            <p class="md3-topic-copy text-sm text-muted-foreground leading-relaxed mb-4">Compare sidecar versus ambient meshes, bootstrap mTLS with SPIFFE-issued SVIDs, and engineer pod-to-pod authentication that survives upgrades. Trace a request from one workload to another, byte by byte, with full cryptographic context.</p>
            <a routerLink="/glossary/service-mesh" class="md3-topic-action inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-500 hover:text-cyan-400 transition-colors">
              Learn service mesh security
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </a>
          </article>

          <!-- Topic 3 -->
          <article class="md3-topic-card md3-topic-card-primary rounded-2xl border border-border/60 bg-card p-6 hover:border-purple-500/40 hover:-translate-y-1 transition-all">
            <div class="md3-topic-icon inline-flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-purple-500" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="15" x2="15" y2="15"/></svg>
            </div>
            <h3 class="md3-topic-title text-lg font-bold mb-2 tracking-tight">OPA, Policy-as-Code &amp; Authorization</h3>
            <p class="md3-topic-copy text-sm text-muted-foreground leading-relaxed mb-4">Express security and compliance policy as versioned Rego, evaluate it at admission time, and enforce it across Kubernetes, microservices, CI/CD, and Terraform. Replace ad-hoc YAML rules with a single, testable policy plane.</p>
            <a routerLink="/courses/cloud-native-security-engineering/policy-as-code-security" class="md3-topic-action inline-flex items-center gap-1.5 text-sm font-semibold text-purple-500 hover:text-purple-400 transition-colors">
              Adopt policy-as-code
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </a>
          </article>

          <!-- Topic 4 -->
          <article class="md3-topic-card md3-topic-card-secondary rounded-2xl border border-border/60 bg-card p-6 hover:border-green-500/40 hover:-translate-y-1 transition-all">
            <div class="md3-topic-icon inline-flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-green-500" aria-hidden="true"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
            </div>
            <h3 class="md3-topic-title text-lg font-bold mb-2 tracking-tight">Supply Chain Security &amp; Secure CI/CD</h3>
            <p class="md3-topic-copy text-sm text-muted-foreground leading-relaxed mb-4">Sign artifacts with Sigstore, generate SBOMs, verify provenance with SLSA levels, and gate deployments on cryptographic attestations. Stop dependency-confusion and build-system attacks at the pipeline, not in production.</p>
            <a routerLink="/courses/kubernetes-supply-chain-security" class="md3-topic-action inline-flex items-center gap-1.5 text-sm font-semibold text-green-500 hover:text-green-400 transition-colors">
              Secure your supply chain
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </a>
          </article>

          <!-- Topic 5 -->
          <article class="md3-topic-card md3-topic-card-tertiary rounded-2xl border border-border/60 bg-card p-6 hover:border-pink-500/40 hover:-translate-y-1 transition-all md:col-span-2 lg:col-span-1">
            <div class="md3-topic-icon inline-flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-pink-500/20 to-rose-500/20 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-pink-500" aria-hidden="true"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>
            </div>
            <h3 class="md3-topic-title text-lg font-bold mb-2 tracking-tight">API Security &amp; Machine Identity</h3>
            <p class="md3-topic-copy text-sm text-muted-foreground leading-relaxed mb-4">Authenticate APIs with workload identity instead of long-lived secrets, rotate credentials cryptographically, and design machine-to-machine flows that scale to thousands of services without OAuth client soup.</p>
            <a routerLink="/courses/machine-identity-management" class="md3-topic-action inline-flex items-center gap-1.5 text-sm font-semibold text-pink-500 hover:text-pink-400 transition-colors">
              Design machine identity
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </a>
          </article>
        </div>

        <!-- Category quick-links retained for internal linking -->
        <div class="flex flex-wrap justify-center gap-2 mt-12" aria-label="Browse by category">
          @for (cat of categories(); track cat.slug) {
            <a [routerLink]="['/category', cat.slug]"
               class="md3-chip inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card/60 backdrop-blur-sm px-4 py-1.5 text-sm font-medium text-muted-foreground transition-all duration-300 hover:text-foreground hover:bg-accent">
              {{ cat.name }}
            </a>
          }
        </div>
      </div>
    </section>

    <!-- ========================================================== -->
    <!-- SECTION 4: Beginner-Friendly Learning Paths for Modern Infrastructure Security -->
    <!-- ========================================================== -->
    <section class="md3-home-card-section md3-home-learning-section py-16 md:py-24 bg-gradient-to-br from-violet-500/5 via-card to-blue-500/5 border-y border-border/40 animate-in fade-in duration-700" aria-labelledby="learning-paths-heading">
      <div class="container max-w-7xl mx-auto px-6">
        <div class="text-center max-w-3xl mx-auto mb-12">
          <span class="md3-section-eyebrow inline-block rounded-full bg-violet-500/10 border border-violet-500/30 px-4 py-1 text-xs font-bold text-violet-500 uppercase tracking-wider mb-4">Learning Paths</span>
          <h2 id="learning-paths-heading" class="text-3xl md:text-5xl font-extrabold tracking-tight leading-[1.1] mb-5">
            Beginner-Friendly Learning Paths for Modern Infrastructure Security
          </h2>
          <p class="text-base md:text-lg text-muted-foreground leading-relaxed">
            Start with first principles, progress to production. Whether you&apos;re new to Kubernetes or refining your cloud-native security expertise, every learning path on CodersSecret is structured around <strong class="text-foreground">visual explanations, annotated diagrams, and reproducible labs</strong> &mdash; so each concept lands before the next one builds on it.
          </p>
        </div>

        <!-- 3 H3 method cards -->
        <div class="md3-info-grid grid md:grid-cols-3 gap-5 mb-12">
          <article class="md3-info-card md3-info-card-primary rounded-2xl border border-border/60 bg-card p-6 hover:border-violet-500/40 hover:-translate-y-1 transition-all">
            <div class="md3-info-icon inline-flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-violet-500" aria-hidden="true"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
            </div>
            <h3 class="md3-info-title text-lg font-bold mb-2 tracking-tight">Step-by-Step Visual Explanations</h3>
            <p class="md3-info-copy text-sm text-muted-foreground leading-relaxed">Every complex concept &mdash; from SVID rotation to admission webhooks &mdash; is broken into ordered, visual steps. No assumed prerequisites. No paragraphs of dense theory before you see a single diagram.</p>
          </article>
          <article class="md3-info-card md3-info-card-secondary rounded-2xl border border-border/60 bg-card p-6 hover:border-blue-500/40 hover:-translate-y-1 transition-all">
            <div class="md3-info-icon inline-flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-blue-500" aria-hidden="true"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
            </div>
            <h3 class="md3-info-title text-lg font-bold mb-2 tracking-tight">Architecture Diagrams &amp; Security Flows</h3>
            <p class="md3-info-copy text-sm text-muted-foreground leading-relaxed">SVG architecture diagrams showing exactly how the kube-apiserver authenticates a workload, how SPIRE issues an SVID, how an mTLS handshake completes &mdash; rendered fast, scaled crisply, designed for engineers who think in components.</p>
          </article>
          <article class="md3-info-card md3-info-card-tertiary rounded-2xl border border-border/60 bg-card p-6 hover:border-cyan-500/40 hover:-translate-y-1 transition-all">
            <div class="md3-info-icon inline-flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500/20 to-teal-500/20 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-cyan-500" aria-hidden="true"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
            </div>
            <h3 class="md3-info-title text-lg font-bold mb-2 tracking-tight">Hands-On Labs &amp; Real Deployment Examples</h3>
            <p class="md3-info-copy text-sm text-muted-foreground leading-relaxed">Reproducible labs with full YAML, kubectl commands, expected outputs, and rollback steps. You won&apos;t just watch concepts &mdash; you&apos;ll deploy them, break them, and rebuild them on a real cluster.</p>
          </article>
        </div>

        <!-- 3 progression cards (Beginner / Intermediate / Advanced) -->
        <div class="grid md:grid-cols-3 gap-5" aria-label="Suggested learning progression">
          <a routerLink="/glossary" class="md3-path-card md3-path-card-beginner group relative overflow-hidden rounded-2xl border border-green-500/30 bg-gradient-to-br from-green-500/10 to-emerald-500/5 p-6 hover:border-green-500/60 hover:-translate-y-1 transition-all">
            <div class="flex items-center justify-between mb-3">
              <span class="md3-path-badge rounded-full bg-green-500/20 border border-green-500/40 px-2.5 py-0.5 text-[10px] font-bold text-green-500 uppercase tracking-wider">Beginner</span>
              <span class="text-xs text-muted-foreground font-mono">~6 hours</span>
            </div>
            <h3 class="text-lg font-bold mb-2 tracking-tight">Foundations of Cloud Native Security</h3>
            <p class="text-xs text-muted-foreground leading-relaxed mb-4">Glossary &middot; Kubernetes basics &middot; What is mTLS &middot; What is workload identity &middot; What is Zero Trust.</p>
            <ul class="space-y-1.5 text-xs text-foreground/80">
              <li class="flex items-center gap-2"><span class="h-1.5 w-1.5 rounded-full bg-green-500"></span>Cloud-native vocabulary</li>
              <li class="flex items-center gap-2"><span class="h-1.5 w-1.5 rounded-full bg-green-500"></span>Kubernetes object model</li>
              <li class="flex items-center gap-2"><span class="h-1.5 w-1.5 rounded-full bg-green-500"></span>TLS &amp; mTLS fundamentals</li>
            </ul>
             <div class="md3-path-action mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-green-500 group-hover:gap-2.5 transition-all">
              Start the foundations
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </div>
          </a>

          <a routerLink="/courses/mastering-spiffe-spire" class="md3-path-card md3-path-card-intermediate group relative overflow-hidden rounded-2xl border border-blue-500/30 bg-gradient-to-br from-blue-500/10 to-cyan-500/5 p-6 hover:border-blue-500/60 hover:-translate-y-1 transition-all">
            <div class="flex items-center justify-between mb-3">
              <span class="md3-path-badge rounded-full bg-blue-500/20 border border-blue-500/40 px-2.5 py-0.5 text-[10px] font-bold text-blue-500 uppercase tracking-wider">Intermediate</span>
              <span class="text-xs text-muted-foreground font-mono">~20 hours</span>
            </div>
            <h3 class="text-lg font-bold mb-2 tracking-tight">SPIFFE/SPIRE &amp; Workload Identity</h3>
            <p class="text-xs text-muted-foreground leading-relaxed mb-4">Deploy SPIRE on Kubernetes &middot; attest workloads &middot; issue SVIDs &middot; enforce policies &middot; federate trust domains.</p>
            <ul class="space-y-1.5 text-xs text-foreground/80">
              <li class="flex items-center gap-2"><span class="h-1.5 w-1.5 rounded-full bg-blue-500"></span>SPIRE server &amp; agent setup</li>
              <li class="flex items-center gap-2"><span class="h-1.5 w-1.5 rounded-full bg-blue-500"></span>X.509 &amp; JWT SVID issuance</li>
              <li class="flex items-center gap-2"><span class="h-1.5 w-1.5 rounded-full bg-blue-500"></span>Cross-cluster federation</li>
            </ul>
            <div class="md3-path-action mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-blue-500 group-hover:gap-2.5 transition-all">
              Open the workload identity course
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </div>
          </a>

          <a routerLink="/courses/cloud-native-security-engineering" class="md3-path-card md3-path-card-advanced group relative overflow-hidden rounded-2xl border border-purple-500/30 bg-gradient-to-br from-purple-500/10 to-pink-500/5 p-6 hover:border-purple-500/60 hover:-translate-y-1 transition-all">
            <div class="flex items-center justify-between mb-3">
              <span class="md3-path-badge rounded-full bg-purple-500/20 border border-purple-500/40 px-2.5 py-0.5 text-[10px] font-bold text-purple-500 uppercase tracking-wider">Advanced</span>
              <span class="text-xs text-muted-foreground font-mono">~40 hours</span>
            </div>
            <h3 class="text-lg font-bold mb-2 tracking-tight">Production Cloud Native Security Engineering</h3>
            <p class="text-xs text-muted-foreground leading-relaxed mb-4">Multi-cluster security &middot; supply-chain attestation &middot; runtime detection &middot; incident response &middot; capstone project.</p>
            <ul class="space-y-1.5 text-xs text-foreground/80">
              <li class="flex items-center gap-2"><span class="h-1.5 w-1.5 rounded-full bg-purple-500"></span>Multi-cloud federation</li>
              <li class="flex items-center gap-2"><span class="h-1.5 w-1.5 rounded-full bg-purple-500"></span>Sigstore &amp; SLSA pipelines</li>
              <li class="flex items-center gap-2"><span class="h-1.5 w-1.5 rounded-full bg-purple-500"></span>Production capstone</li>
            </ul>
            <div class="md3-path-action mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-purple-500 group-hover:gap-2.5 transition-all">
              Tackle the production track
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </div>
          </a>
        </div>
      </div>
    </section>

    <!-- Most Popular — Ranked by traffic -->
    @if (popularPosts().length > 0) {
      <section class="md3-home-posts-section md3-home-popular-section py-16 animate-in fade-in duration-700">
        <div class="container max-w-7xl mx-auto px-6">
          <div class="flex items-end justify-between mb-10">
            <div>
              <h2 class="text-3xl font-extrabold tracking-tight">Most Popular</h2>
              <p class="mt-2 text-muted-foreground">Top reads from our community</p>
            </div>
          </div>

          <div class="md3-post-grid grid md:grid-cols-3 gap-4">
            @for (post of popularPosts(); track post.id; let i = $index) {
              <article class="md3-home-post-shell group">
                <a [routerLink]="['/blog', post.slug]" class="block h-full">
                  <div class="md3-home-post-card md3-home-post-card-ranked relative h-full rounded-2xl border border-border/60 bg-card overflow-hidden transition-all duration-500 hover:shadow-xl hover:-translate-y-1 hover:border-primary/20">
                    <!-- Rank badge -->
                    <div class="md3-home-rank-badge absolute top-3 left-3 z-10 inline-flex items-center justify-center h-8 w-8 rounded-full font-extrabold text-sm"
                         [attr.aria-label]="'Popularity rank ' + (i + 1)">
                      #{{ i + 1 }}
                    </div>
                    <!-- Top accent bar -->
                  <div class="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                         [style.background-image]="getCategoryAccentLine(post.category)"></div>

                    <div class="p-6 pt-14 flex flex-col justify-between h-full">
                      <div>
                        <div class="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mb-3">
                          <span class="md3-home-post-category inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                                [style.background-color]="getCategoryTint(post.category)"
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
                            <span class="md3-home-tag-chip inline-flex items-center rounded-full border border-border/40 bg-muted/50 px-2.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                              {{ tag }}
                            </span>
                          }
                        </div>
                         <div class="md3-home-card-arrow shrink-0 ml-4 inline-flex items-center justify-center rounded-full h-8 w-8 bg-muted/50 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
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
    <section class="md3-home-posts-section md3-home-latest-section py-16 animate-in fade-in duration-700">
      <div class="container max-w-7xl mx-auto px-6">
        <div class="flex items-end justify-between mb-10">
          <div>
            <h2 class="text-3xl font-extrabold tracking-tight">Latest Articles</h2>
            <p class="mt-2 text-muted-foreground">Fresh insights and tutorials</p>
          </div>
          <a routerLink="/blog"
             class="md3-button-outlined group hidden sm:inline-flex items-center gap-1.5">
            View all
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                 class="transition-transform duration-300 group-hover:translate-x-1">
              <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
            </svg>
          </a>
        </div>

        <div class="md3-post-grid grid md:grid-cols-2 gap-5">
          @for (post of latestPosts(); track post.id; let i = $index) {
            <article class="md3-home-post-shell group" [class]="i === 0 ? 'md:col-span-2' : ''">
              <a [routerLink]="['/blog', post.slug]" class="block h-full">
                <div class="md3-home-post-card md3-home-post-card-latest relative h-full rounded-2xl border border-border/60 bg-card overflow-hidden transition-all duration-500 hover:shadow-xl hover:-translate-y-1 hover:border-primary/20"
                     [class]="i === 0 ? 'md:flex md:items-stretch' : ''">
                  <!-- Color accent bar -->
                  <div class="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  <div class="p-6 md:p-8 flex flex-col justify-between" [class]="i === 0 ? 'md:flex-1' : ''">
                    <div>
                      <div class="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mb-4">
                        <span class="md3-home-post-category inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                              [style.background-color]="getCategoryTint(post.category)"
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
                          <span class="md3-home-tag-chip inline-flex items-center rounded-full border border-border/40 bg-muted/50 px-2.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                            {{ tag }}
                          </span>
                        }
                      </div>
                       <div class="md3-home-card-arrow shrink-0 ml-4 inline-flex items-center justify-center rounded-full h-8 w-8 bg-muted/50 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
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
             class="md3-button-filled inline-flex items-center gap-1.5 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-xl active:scale-[0.97]">
            View all articles
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
            </svg>
          </a>
        </div>
      </div>
    </section>

    <!-- Trending Tags (compact) -->
    <section class="py-12 animate-in fade-in duration-700" aria-labelledby="trending-tags-heading">
      <div class="container max-w-6xl mx-auto px-6">
        <div class="mb-6">
          <h2 id="trending-tags-heading" class="text-2xl font-extrabold tracking-tight">Trending Topics</h2>
          <p class="mt-1 text-sm text-muted-foreground">Click any tag to find related articles &amp; tutorials.</p>
        </div>
        <div class="flex flex-wrap gap-2">
          @for (tag of trendingTags(); track tag.name) {
            <a [routerLink]="['/blog']" [queryParams]="{tag: tag.name}"
               class="md3-home-topic-chip group inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-300">
              <span>{{ tag.name }}</span>
              <span class="md3-home-topic-count text-xs">{{ tag.count }}</span>
            </a>
          }
        </div>
      </div>
    </section>

    <!-- ========================================================== -->
    <!-- SECTION 6: Designed for Backend Engineers, Platform Engineers & DevOps Teams -->
    <!-- ========================================================== -->
    <section class="md3-home-card-section md3-home-audience-section py-16 md:py-24 bg-gradient-to-br from-blue-500/5 via-card to-cyan-500/5 border-y border-border/40 animate-in fade-in duration-700" aria-labelledby="audience-heading">
      <div class="container max-w-7xl mx-auto px-6">
        <div class="text-center max-w-3xl mx-auto mb-12">
          <span class="md3-section-eyebrow inline-block rounded-full bg-blue-500/10 border border-blue-500/30 px-4 py-1 text-xs font-bold text-blue-500 uppercase tracking-wider mb-4">For Engineers Shipping in Production</span>
          <h2 id="audience-heading" class="text-3xl md:text-5xl font-extrabold tracking-tight leading-[1.1] mb-5">
            Designed for <span class="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">Backend Engineers</span>, <span class="bg-gradient-to-r from-cyan-500 to-teal-500 bg-clip-text text-transparent">Platform Engineers</span> &amp; <span class="bg-gradient-to-r from-teal-500 to-green-500 bg-clip-text text-transparent">DevOps Teams</span>
          </h2>
          <p class="text-base md:text-lg text-muted-foreground leading-relaxed">
            CodersSecret is built for the engineers who own production: the people writing the services, running the clusters, and on the pager when something breaks. Every course, lab, and architecture diagram is designed to be immediately useful in real systems &mdash; not just academic.
          </p>
        </div>

        <!-- 3 H3 framing headings -->
        <div class="md3-info-grid grid md:grid-cols-3 gap-5 mb-10">
          <div class="md3-info-card md3-info-card-secondary rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm p-6 hover:border-blue-500/40 transition-all">
            <h3 class="text-lg font-bold mb-2 tracking-tight">Production Security for Modern Applications</h3>
            <p class="text-sm text-muted-foreground leading-relaxed">From REST APIs and gRPC services to event-driven systems and ML pipelines &mdash; ship them with workload identity, mTLS, and policy enforcement baked in from day one.</p>
          </div>
          <div class="md3-info-card md3-info-card-primary rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm p-6 hover:border-cyan-500/40 transition-all">
            <h3 class="text-lg font-bold mb-2 tracking-tight">Secure Service-to-Service Communication</h3>
            <p class="text-sm text-muted-foreground leading-relaxed">Replace shared secrets, static API keys, and trust-by-IP with cryptographic, short-lived workload identities that survive auto-scaling, restarts, and multi-cluster failover.</p>
          </div>
          <div class="md3-info-card md3-info-card-tertiary rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm p-6 hover:border-teal-500/40 transition-all">
            <h3 class="text-lg font-bold mb-2 tracking-tight">Identity-First Cloud Native Systems</h3>
            <p class="text-sm text-muted-foreground leading-relaxed">Treat identity as the foundational primitive &mdash; ahead of network, ahead of permissions &mdash; so every authorization decision has a verifiable subject behind it.</p>
          </div>
        </div>

        <!-- 5 audience role cards -->
        <div class="grid grid-cols-2 md:grid-cols-5 gap-3" aria-label="Built for these roles">
          <a routerLink="/category/backend" class="md3-role-card group rounded-xl border border-border/60 bg-card p-5 text-center hover:border-blue-500/40 hover:-translate-y-1 transition-all">
            <div class="md3-role-icon inline-flex items-center justify-center w-10 h-10 rounded-lg bg-blue-500/10 text-blue-500 mb-3 mx-auto" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14a9 3 0 0 0 18 0V5"/><path d="M3 12a9 3 0 0 0 18 0"/></svg>
            </div>
            <h4 class="text-sm font-bold mb-1 group-hover:text-blue-500 transition-colors">Backend Engineers</h4>
            <p class="text-[11px] text-muted-foreground leading-snug">Build services that authenticate without secrets.</p>
          </a>
          <a routerLink="/category/devops" class="md3-role-card group rounded-xl border border-border/60 bg-card p-5 text-center hover:border-orange-500/40 hover:-translate-y-1 transition-all">
            <div class="md3-role-icon inline-flex items-center justify-center w-10 h-10 rounded-lg bg-orange-500/10 text-orange-500 mb-3 mx-auto" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
            </div>
            <h4 class="text-sm font-bold mb-1 group-hover:text-orange-500 transition-colors">DevOps Engineers</h4>
            <p class="text-[11px] text-muted-foreground leading-snug">Wire up secure CI/CD &amp; cluster automation.</p>
          </a>
          <a routerLink="/courses/cloud-native-security-engineering" class="md3-role-card group rounded-xl border border-border/60 bg-card p-5 text-center hover:border-cyan-500/40 hover:-translate-y-1 transition-all">
            <div class="md3-role-icon inline-flex items-center justify-center w-10 h-10 rounded-lg bg-cyan-500/10 text-cyan-500 mb-3 mx-auto" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
            </div>
            <h4 class="text-sm font-bold mb-1 group-hover:text-cyan-500 transition-colors">Platform Engineers</h4>
            <p class="text-[11px] text-muted-foreground leading-snug">Build internal platforms with identity built-in.</p>
          </a>
          <a routerLink="/courses/mastering-spiffe-spire" class="md3-role-card group rounded-xl border border-border/60 bg-card p-5 text-center hover:border-purple-500/40 hover:-translate-y-1 transition-all">
            <div class="md3-role-icon inline-flex items-center justify-center w-10 h-10 rounded-lg bg-purple-500/10 text-purple-500 mb-3 mx-auto" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <h4 class="text-sm font-bold mb-1 group-hover:text-purple-500 transition-colors">Security Engineers</h4>
            <p class="text-[11px] text-muted-foreground leading-snug">Adopt CNCF-native controls for modern stacks.</p>
          </a>
          <a routerLink="/courses/kubernetes-runtime-security" class="md3-role-card group rounded-xl border border-border/60 bg-card p-5 text-center hover:border-green-500/40 hover:-translate-y-1 transition-all">
            <div class="md3-role-icon inline-flex items-center justify-center w-10 h-10 rounded-lg bg-green-500/10 text-green-500 mb-3 mx-auto" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            </div>
            <h4 class="text-sm font-bold mb-1 group-hover:text-green-500 transition-colors">SREs</h4>
            <p class="text-[11px] text-muted-foreground leading-snug">Detect, contain, and recover from incidents.</p>
          </a>
        </div>
      </div>
    </section>

    <!-- ========================================================== -->
    <!-- SECTION 7: Why Cloud Native Security Matters -->
    <!-- ========================================================== -->
    <section class="md3-home-card-section md3-home-why-section py-16 md:py-24 animate-in fade-in duration-700" aria-labelledby="why-matters-heading">
      <div class="container max-w-7xl mx-auto px-6">
        <div class="text-center mb-12">
          <span class="md3-section-eyebrow inline-block rounded-full bg-pink-500/10 border border-pink-500/30 px-4 py-1 text-xs font-bold text-pink-500 uppercase tracking-wider mb-4">Why It Matters</span>
          <h2 id="why-matters-heading" class="text-3xl md:text-5xl font-extrabold tracking-tight leading-[1.1] mb-5">
            Why <span class="bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500 bg-clip-text text-transparent">Cloud Native Security</span> Matters
          </h2>
          <p class="text-base md:text-lg text-muted-foreground leading-relaxed">
            The infrastructure model has changed. The security model has to change with it.
          </p>
        </div>

        <div class="md3-why-grid space-y-10">
          <article class="md3-why-card">
            <h3 class="text-xl md:text-2xl font-bold tracking-tight mb-3">Traditional Security No Longer Works</h3>
            <p class="text-base text-muted-foreground leading-relaxed">
              The classic security model was built around a perimeter: a corporate network, a DMZ, a handful of servers, and a firewall in front of all of it. Cloud native infrastructure has dissolved that perimeter. Workloads spin up and down in seconds, run across clouds and clusters, talk to each other over the public internet, and frequently belong to ephemeral identities that didn&apos;t exist five minutes ago. <strong class="text-foreground">Network location is no longer a meaningful security signal</strong> &mdash; and any system still relying on &quot;trust the IP range&quot; is structurally broken in this environment.
            </p>
          </article>

          <article class="md3-why-card">
            <h3 class="text-xl md:text-2xl font-bold tracking-tight mb-3">The Rise of Workload Identity &amp; Zero Trust</h3>
            <p class="text-base text-muted-foreground leading-relaxed">
              The replacement for network-based trust is <a routerLink="/glossary/workload-identity" class="text-primary underline underline-offset-4 decoration-primary/40 hover:decoration-primary">workload identity</a>: every service, container, and function gets a cryptographically verifiable identity, refreshed continuously, attested by the underlying platform. Combined with <a routerLink="/glossary/zero-trust" class="text-primary underline underline-offset-4 decoration-primary/40 hover:decoration-primary">Zero Trust</a> principles &mdash; never trust, always verify, assume breach &mdash; this lets us build distributed systems where every authorization decision is based on who the workload <em>is</em>, not where it sits on the network. CNCF projects like <a routerLink="/glossary/spiffe" class="text-primary underline underline-offset-4 decoration-primary/40 hover:decoration-primary">SPIFFE</a> and <a routerLink="/glossary/spire" class="text-primary underline underline-offset-4 decoration-primary/40 hover:decoration-primary">SPIRE</a> make this practical and portable across clouds.
            </p>
          </article>

          <article class="md3-why-card">
            <h3 class="text-xl md:text-2xl font-bold tracking-tight mb-3">Securing Kubernetes &amp; Distributed Systems at Scale</h3>
            <p class="text-base text-muted-foreground leading-relaxed">
              Kubernetes is now the substrate that runs most modern infrastructure, which means its attack surface &mdash; the API server, kubelet, etcd, container runtime, networking, supply chain &mdash; is the attack surface of the modern software industry. Securing it requires fluency in admission control, RBAC, runtime detection, mTLS, signed artifacts, and policy-as-code. CodersSecret exists to teach those disciplines together, with the same depth that production engineering teams need to actually deploy them &mdash; not as isolated tools, but as a coherent <strong class="text-foreground">cloud native security architecture</strong>.
            </p>
          </article>
        </div>

        <div class="mt-12 flex flex-wrap justify-center gap-3">
          <a routerLink="/courses/cloud-native-security-engineering" class="md3-button-filled inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
            Start the Cloud Native Security course
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </a>
          <a routerLink="/glossary" class="md3-button-outlined inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-7 py-3 text-sm font-semibold text-foreground hover:bg-accent transition-all duration-300">
            Browse the glossary
          </a>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="py-16 animate-in fade-in duration-700">
      <div class="container max-w-6xl mx-auto px-6">
        <div class="md3-home-proof-panel">
          <div class="text-center mb-10">
            <h2 class="text-3xl md:text-4xl font-extrabold tracking-tight">Built for Engineers, by an Engineer</h2>
            <p class="mt-3 text-muted-foreground max-w-2xl mx-auto">Real production knowledge, not surface-level tutorials. Every article is written from hands-on experience and tested against real-world systems.</p>
          </div>
          <div class="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div class="text-center md3-home-proof-metric">
              <div class="md3-home-proof-number">{{ totalPosts() }}+</div>
              <div class="mt-2 text-sm text-muted-foreground">In-Depth Articles</div>
            </div>
            <div class="text-center md3-home-proof-metric">
              <div class="md3-home-proof-number">{{ avgReadTime() }}</div>
              <div class="mt-2 text-sm text-muted-foreground">Avg Read Time (min)</div>
            </div>
            <div class="text-center md3-home-proof-metric">
              <div class="md3-home-proof-number">{{ uniqueTags() }}+</div>
              <div class="mt-2 text-sm text-muted-foreground">Topics Covered</div>
            </div>
            <div class="text-center md3-home-proof-metric">
              <div class="md3-home-proof-number">{{ totalPosts() }}</div>
              <div class="mt-2 text-sm text-muted-foreground">Slide Tutorials</div>
            </div>
            <div class="text-center md3-home-proof-metric">
              <div class="md3-home-proof-number">100%</div>
              <div class="mt-2 text-sm text-muted-foreground">Free, Open Source</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Author Teaser -->
    <section class="py-16 animate-in fade-in duration-700" aria-labelledby="home-author-heading">
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
                <h2 id="home-author-heading" class="md3-home-author-heading text-2xl font-extrabold tracking-tight transition-colors duration-300 group-hover:text-primary">Vishal Anand</h2>
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

    <!-- Video and Podcast CTA -->
    <section class="py-12 animate-in fade-in duration-700">
      <div class="container max-w-6xl mx-auto px-6">
        <div class="grid gap-5 md:grid-cols-2">
          <div class="md3-home-external-panel md3-home-external-panel-youtube">
            <div class="md3-external-content">
              <div class="md3-external-head">
                <div class="md3-external-icon" aria-hidden="true">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.6V8.4L15.8 12l-6.2 3.6Z"/>
                  </svg>
                </div>
                <div>
                  <p class="md3-external-kicker">Now on YouTube</p>
                  <h2 class="mt-2 font-extrabold tracking-tight">Watch CodersSecret Tutorials</h2>
                </div>
              </div>
              <div class="md3-external-visual md3-external-visual-video" aria-hidden="true">
                <div class="md3-video-card md3-video-card-back">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <div class="md3-video-card md3-video-card-front">
                  <div class="md3-video-toolbar">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <div class="md3-video-play">
                    <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5.5v13l10-6.5-10-6.5Z"/>
                    </svg>
                  </div>
                  <div class="md3-video-lines">
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
              <p class="md3-external-copy">
                Visual walkthroughs for backend, security, Kubernetes, and production engineering topics.
              </p>
              <div class="md3-external-topic-list">
                <p>Watch next</p>
                <ul>
                  <li>Kubernetes security walkthroughs</li>
                  <li>Production RAG architecture guides</li>
                  <li>Backend and DevOps implementation notes</li>
                </ul>
              </div>
              <a [href]="links.youtube" target="_blank" rel="noopener noreferrer"
                 class="md3-external-action">
                Visit Channel
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M7 17 17 7"/><path d="M7 7h10v10"/>
                </svg>
              </a>
            </div>
          </div>

          <div class="md3-home-external-panel md3-home-external-panel-spotify">
            <div class="md3-external-content">
              <div class="md3-external-head">
                <div class="md3-external-icon" aria-hidden="true">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 1.75C6.34 1.75 1.75 6.34 1.75 12S6.34 22.25 12 22.25 22.25 17.66 22.25 12 17.66 1.75 12 1.75Zm4.7 14.78a.73.73 0 0 1-1 .24c-2.74-1.67-6.18-2.05-10.24-1.12a.73.73 0 1 1-.33-1.42c4.44-1.02 8.25-.58 11.33 1.3.35.21.46.66.24 1Zm1.33-2.96a.9.9 0 0 1-1.24.3c-3.13-1.93-7.9-2.49-11.6-1.36a.9.9 0 1 1-.52-1.73c4.22-1.28 9.48-.66 13.06 1.54.43.27.57.83.3 1.25Zm.11-3.08c-3.76-2.23-9.95-2.44-13.54-1.35a1.08 1.08 0 1 1-.63-2.07c4.12-1.25 10.95-1 15.27 1.56a1.08 1.08 0 0 1-1.1 1.86Z"/>
                  </svg>
                </div>
                <div>
                  <p class="md3-external-kicker">Listen on Spotify</p>
                  <h2 class="mt-2 font-extrabold tracking-tight">CodersSecret Podcast</h2>
                </div>
              </div>
              <div class="md3-external-visual md3-external-visual-audio" aria-hidden="true">
                <div class="md3-audio-shell">
                  <div class="md3-audio-meta">
                    <span>New episode</span>
                    <span>32 min</span>
                  </div>
                  <div class="md3-audio-wave">
                    <span style="--bar-height: 42%"></span>
                    <span style="--bar-height: 68%"></span>
                    <span style="--bar-height: 52%"></span>
                    <span style="--bar-height: 86%"></span>
                    <span style="--bar-height: 58%"></span>
                    <span style="--bar-height: 74%"></span>
                    <span style="--bar-height: 45%"></span>
                  </div>
                </div>
              </div>
              <p class="md3-external-copy">
                Audio-first engineering explainers for commutes, walks, and screen-free learning.
              </p>
              <div class="md3-external-topic-list">
                <p>Recent topics</p>
                <ul>
                  <li>Why Your Claude Bill Is Bigger Than Your Prompt</li>
                  <li>Delta Lake vs Iceberg: The Table Format War</li>
                  <li>OAuth Is Not Authentication</li>
                </ul>
              </div>
              <a [href]="links.spotifyPodcast" target="_blank" rel="noopener noreferrer"
                 class="md3-external-action">
                Listen on Spotify
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M7 17 17 7"/><path d="M7 7h10v10"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
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

    <!-- Support / Contribution CTA -->
    <section class="py-16 animate-in fade-in duration-700" aria-labelledby="support-heading">
      <div class="container max-w-4xl mx-auto px-6">
        <div class="md3-home-support-panel">
          <div class="mx-auto max-w-2xl text-center">
            <div class="md3-home-support-icon mx-auto mb-6" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 2v20"/><path d="m17 5-5-3-5 3"/><path d="M17 19l-5 3-5-3"/><path d="M2 12h20"/><path d="m5 7-3 5 3 5"/><path d="m19 7 3 5-3 5"/>
              </svg>
            </div>
            <h2 id="support-heading" class="mb-4">
              Support the Knowledge Base
            </h2>
            <p class="text-base md:text-lg text-muted-foreground leading-relaxed mb-2">
              CodersSecret is <strong class="text-foreground">100% free and ad-free</strong> &mdash; no paywalls, no signup walls, no tracking beyond anonymous analytics.
            </p>
            <p class="text-base md:text-lg text-muted-foreground leading-relaxed mb-8">
              If these courses, labs, and engineering guides help you ship better systems, a small contribution keeps the platform running and supports deeper production-focused content.
            </p>
            <a href="https://buymeacoffee.com/riptechlead" target="_blank" rel="noopener noreferrer"
               class="md3-button-filled group">
              Support CodersSecret
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"
                   class="transition-transform duration-300 group-hover:translate-x-1">
                <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
              </svg>
            </a>
            <p class="mt-6 text-sm text-muted-foreground">
              Sharing a useful guide with your team helps too.
            </p>
          </div>
        </div>
      </div>
    </section>

  `,
})
export class HomeComponent implements OnInit {
  private seo = inject(SeoService);
  private readonly homeDescription = 'Free engineering courses and guides on Kubernetes, SPIFFE/SPIRE, Zero Trust, production RAG, analytics engineering, DevSecOps, labs, and diagrams.';
  links = EXTERNAL_LINKS;
  popularPosts = signal<PostCard[]>([]);
  latestPosts = signal<PostCard[]>([]);
  categories = signal<CategoryInfo[]>([]);
  totalPosts = signal(0);
  uniqueTags = signal(0);
  totalCourseModules = signal(0);
  totalLabs = signal(0);
  avgReadTime = signal(0);
  trendingTags = signal<{ name: string; count: number }[]>([]);
  activeHeroTrack = signal<HeroTrackKey>('security');
  heroTracks: HeroTrack[] = [
    {
      key: 'security',
      label: 'Security',
      title: 'Build identity-first cloud native systems',
      outcome: 'Practice SPIFFE/SPIRE, Kubernetes hardening, mTLS, OPA policy, and runtime detection as one production workflow.',
      route: '/courses/cloud-native-security-engineering',
      color: 'var(--md-sys-color-primary)',
      nodes: ['K8s', 'SPIRE', 'mTLS', 'OPA'],
      metrics: [
        { label: 'security modules', value: '24' },
        { label: 'identity labs', value: '46' },
        { label: 'zero trust paths', value: '5' },
        { label: 'checklists', value: '18' },
      ],
    },
    {
      key: 'ai',
      label: 'AI',
      title: 'Ship production RAG without guesswork',
      outcome: 'Connect retrieval, evaluation, prompt boundaries, API security, and observability into a deployable AI infrastructure track.',
      route: '/courses/production-rag-systems-engineering',
      color: 'var(--md-sys-color-secondary)',
      nodes: ['Docs', 'Vector DB', 'Gateway', 'Eval'],
      metrics: [
        { label: 'RAG modules', value: '14' },
        { label: 'eval gates', value: '9' },
        { label: 'threat models', value: '7' },
        { label: 'infra patterns', value: '12' },
      ],
    },
    {
      key: 'data',
      label: 'Data',
      title: 'Make analytics engineering production-grade',
      outcome: 'Move from dbt basics to semantic layers, lineage, quality checks, metric governance, and reliable pipeline operations.',
      route: '/courses/production-analytics-engineering-dbt',
      color: 'var(--md-sys-color-tertiary)',
      nodes: ['dbt', 'Tests', 'Lineage', 'Metrics'],
      metrics: [
        { label: 'dbt modules', value: '15' },
        { label: 'SQL drills', value: '30' },
        { label: 'quality gates', value: '11' },
        { label: 'dashboards', value: '6' },
      ],
    },
    {
      key: 'devops',
      label: 'DevOps',
      title: 'Debug distributed systems under pressure',
      outcome: 'Study caching, scheduling, API reliability, CI/CD, incident response, and observability through practical engineering guides.',
      route: '/blog',
      color: 'var(--md-sys-color-secondary)',
      nodes: ['API', 'Queue', 'Cache', 'Trace'],
      metrics: [
        { label: 'guides', value: '86' },
        { label: 'systems topics', value: '42' },
        { label: 'debug flows', value: '21' },
        { label: 'patterns', value: '60+' },
      ],
    },
    {
      key: 'labs',
      label: 'Labs',
      title: 'Practice with interactive engineering labs',
      outcome: 'Use games and labs to rehearse Kubernetes, API security, incident response, supply chain, Linux, and AI infrastructure scenarios.',
      route: '/games',
      color: 'var(--md-sys-color-primary)',
      nodes: ['Scenario', 'Signal', 'Decision', 'Debrief'],
      metrics: [
        { label: 'lab drills', value: '145+' },
        { label: 'skill areas', value: '7' },
        { label: 'quick refs', value: '20+' },
        { label: 'routes', value: '1' },
      ],
    },
  ];
  private categoryCountsMap = signal<Record<string, number>>({});

  async ngOnInit() {
    // Only load blog metadata (48KB) — NOT the course model (418KB)
    const { BLOG_POSTS, CATEGORIES } = await import('../../models/blog-post.model');

    this.popularPosts.set(
      BLOG_POSTS.filter(p => p.popularRank != null)
        .sort((a, b) => (a.popularRank ?? 99) - (b.popularRank ?? 99))
        .slice(0, 6).map(p => this.toCard(p))
    );
    this.latestPosts.set(BLOG_POSTS.slice(0, 4).map(p => this.toCard(p)));
    this.categories.set(CATEGORIES.filter(c => c.slug !== ''));
    this.totalPosts.set(BLOG_POSTS.length);
    this.uniqueTags.set(new Set(BLOG_POSTS.flatMap(p => p.tags)).size);
    // Course stats: hardcoded to avoid importing the large course model for 2 numbers.
    // Update when adding/removing courses: 5 courses, 73 modules, 145+ labs/exercises.
    this.totalCourseModules.set(73);
    this.totalLabs.set(145);
    this.avgReadTime.set(Math.round(
      BLOG_POSTS.reduce((sum, p) => { const m = p.readTime.match(/(\d+)/); return sum + (m ? parseInt(m[1], 10) : 0); }, 0) / Math.max(BLOG_POSTS.length, 1)
    ));

    const counts: Record<string, number> = {};
    for (const p of BLOG_POSTS) { for (const t of p.tags) counts[t] = (counts[t] || 0) + 1; }
    this.trendingTags.set(Object.entries(counts).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count).slice(0, 20));

    const catCounts: Record<string, number> = {};
    for (const p of BLOG_POSTS) { catCounts[p.category] = (catCounts[p.category] || 0) + 1; }
    this.categoryCountsMap.set(catCounts);
  }

  private toCard(p: any): PostCard {
    return { id: p.id, title: p.title, slug: p.slug, excerpt: p.excerpt, category: p.category, date: p.date, readTime: p.readTime, tags: p.tags, author: p.author, featured: p.featured, popularRank: p.popularRank, coverImage: p.coverImage };
  }

  activeHeroTrackData(): HeroTrack {
    return this.heroTracks.find(track => track.key === this.activeHeroTrack()) ?? this.heroTracks[0];
  }

  selectNextHeroTrack(delta: number) {
    const currentIndex = this.heroTracks.findIndex(track => track.key === this.activeHeroTrack());
    const nextIndex = (currentIndex + delta + this.heroTracks.length) % this.heroTracks.length;
    this.activeHeroTrack.set(this.heroTracks[nextIndex].key);
  }

  faqs = [
    {
      q: 'What is cloud native security?',
      a: 'Cloud native security is the discipline of securing applications and infrastructure that are designed to run in dynamic, containerized, distributed environments &mdash; primarily on Kubernetes and across multiple clouds. It replaces perimeter-based controls with identity-based controls, defense-in-depth across the whole stack (image &rarr; container &rarr; pod &rarr; cluster &rarr; mesh), and policy that travels with the workload. Core building blocks include <a href="/glossary/workload-identity" class="text-primary underline">workload identity</a>, <a href="/glossary/mtls" class="text-primary underline">mTLS</a>, <a href="/glossary/opa" class="text-primary underline">OPA policy enforcement</a>, supply-chain signing, and runtime detection. Learn it end-to-end in the <a href="/courses/cloud-native-security-engineering" class="text-primary underline">Cloud Native Security Engineering course</a>.',
    },
    {
      q: 'What is workload identity?',
      a: 'Workload identity is a cryptographically verifiable identifier that names a piece of software &mdash; a container, a Pod, a Lambda, a VM &mdash; instead of a human or an IP address. Instead of long-lived API keys or shared secrets, the workload presents a short-lived, attested credential (such as a SPIFFE SVID) that other services can verify. This eliminates secret-sprawl, makes auto-rotation trivial, and is the foundation of Zero Trust service-to-service authentication. See the <a href="/glossary/workload-identity" class="text-primary underline">workload identity glossary entry</a> for a deeper definition.',
    },
    {
      q: 'What is SPIFFE and SPIRE?',
      a: 'SPIFFE (Secure Production Identity Framework For Everyone) is a CNCF specification that defines a universal format for workload identity &mdash; the SPIFFE ID and the SVID (SPIFFE Verifiable Identity Document, in either X.509 or JWT form). SPIRE is the reference implementation: a SPIRE Server issues SVIDs after a SPIRE Agent attests the workload using node and workload selectors. Together they let services prove who they are across clusters and clouds without relying on shared secrets. The <a href="/courses/mastering-spiffe-spire" class="text-primary underline">Mastering SPIFFE &amp; SPIRE</a> course walks through deploying both on Kubernetes from scratch.',
    },
    {
      q: 'Why is Kubernetes security important?',
      a: 'Kubernetes is the substrate that runs most modern infrastructure, which makes its attack surface &mdash; the API server, kubelet, etcd, container runtime, network plugins, and the supply chain feeding all of them &mdash; the attack surface of the modern software industry. A misconfigured RBAC binding, an unsigned container image, or a privileged sidecar can all turn into full cluster compromise. Securing Kubernetes requires fluency in admission control, PodSecurity standards, network policies, runtime detection (Falco / eBPF), and policy-as-code (OPA). The <a href="/courses/kubernetes-runtime-security" class="text-primary underline">Kubernetes Runtime Security</a> guide covers the full picture.',
    },
    {
      q: 'What is Zero Trust architecture?',
      a: 'Zero Trust is a security model that drops the assumption of a trusted internal network. Instead of granting access based on network location, every request is authenticated, authorized, and encrypted &mdash; with policy decisions made at request time using the workload&apos;s identity, posture, and context. In cloud native systems this typically means SPIFFE-issued workload identity for the &quot;who,&quot; mTLS for the channel, and OPA / Rego for the &quot;what they&apos;re allowed to do.&quot; See the <a href="/glossary/zero-trust" class="text-primary underline">Zero Trust glossary entry</a> and the <a href="/courses/zero-trust-kubernetes" class="text-primary underline">Zero Trust for Kubernetes</a> guide.',
    },
    {
      q: 'How do service-to-service authentication systems work?',
      a: 'Modern service-to-service authentication replaces shared API keys with short-lived, cryptographic identities. The flow generally looks like this: (1) the workload starts up and connects to a local identity provider (e.g. SPIRE Agent); (2) the agent attests the workload using selectors such as Kubernetes namespace, service account, and image hash; (3) the workload receives an SVID (X.509 cert or JWT); (4) when calling another service it presents the SVID over mTLS or in an Authorization header; (5) the receiving service validates the SVID against the trust bundle and applies authorization policy (often OPA). The <a href="/courses/secure-service-to-service-communication" class="text-primary underline">Secure Service-to-Service Communication</a> guide walks through a full reference implementation.',
    },
    {
      q: 'Are the courses and tutorials free?',
      a: 'Yes. Every course, every module, every lab, and every article on CodersSecret is 100% free and ad-free. There&apos;s no paywall, no signup wall, and no tracking beyond anonymous analytics. The site is open source and maintained by the author.',
    },
    {
      q: 'Who writes the content?',
      a: 'All content is written by <a href="/about" class="text-primary underline">Vishal Anand</a>, a Senior Product Engineer and Tech Lead with hands-on experience building production systems at scale. Every course, lab, and architecture diagram is grounded in real engineering practice rather than textbook theory.',
    },
    {
      q: 'What is the "Watch as Slides" feature?',
      a: 'Every tutorial on CodersSecret can be watched as an auto-narrated slide presentation &mdash; like a YouTube video, but 20&times; lighter on bandwidth. Each slide focuses on the key visual, while a narrator explains the details. You can pick your preferred voice, adjust speed (0.75&times;&ndash;1.5&times;), toggle auto-advance, and read the full narrator script. Perfect for learners who prefer watching over reading or who need a distraction-free focus mode. Try the <a href="/slides/drf-api-logger" class="text-primary underline">slide demo</a>.',
    },
    {
      q: 'How do you handle privacy and tracking?',
      a: 'We use only Google Analytics for anonymous page views. No advertising cookies, no tracking pixels, no user accounts required. Comments use GitHub Discussions (only loads if you choose to comment). Read the full <a href="/privacy" class="text-primary underline">privacy policy</a>.',
    },
  ];

  constructor() {
    this.seo.update({
      title: 'CodersSecret',
      description: this.homeDescription,
      url: '/',
      jsonLd: [this.faqSchema(), this.podcastSchema()],
    });
  }

  private faqSchema(): Record<string, unknown> {
    return {
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
    };
  }

  private podcastSchema(): Record<string, unknown> {
    return {
      '@context': 'https://schema.org',
      '@type': 'PodcastSeries',
      'name': 'CodersSecret Podcast',
      'description': 'Audio-first engineering explainers on backend systems, cloud native security, AI, data engineering, and production architecture.',
      'url': this.links.spotifyPodcast,
      'inLanguage': 'en',
      'publisher': {
        '@type': 'Organization',
        'name': 'CodersSecret',
        'url': 'https://coderssecret.com',
      },
    };
  }

  getCategoryColor(slug: string): string {
    return md3CategoryAccent(slug);
  }

  getCategoryTint(slug: string): string {
    return md3CategoryTint(slug);
  }

  getCategoryAccentLine(slug: string): string {
    return md3CategoryAccentLine(slug);
  }

  getCategoryGradient(slug: string): string {
    return md3CategoryGradient(slug);
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
    return this.categoryCountsMap()[slug] || 0;
  }
}
