import { Component, inject } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../../services/seo.service';

interface Sheet {
  slug: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  topics: string[];
  status: 'available' | 'coming-soon';
  tier: 1 | 2 | 3;
  href: string | null;
}

@Component({
  selector: 'app-cheatsheets-hub',
  imports: [RouterLink, NgTemplateOutlet],
  template: `
    <section class="py-12 md:py-16 animate-in fade-in duration-500">
      <div class="container max-w-6xl mx-auto px-6">
        <nav aria-label="Breadcrumb" class="mb-6">
          <ol class="flex items-center gap-1.5 text-sm text-muted-foreground">
            <li><a routerLink="/" class="hover:text-foreground transition-colors">Home</a></li>
            <li class="text-muted-foreground/50">/</li>
            <li class="text-foreground font-medium" aria-current="page">Reference</li>
          </ol>
        </nav>

        <header class="text-center max-w-3xl mx-auto mb-12">
          <span class="inline-block rounded-full bg-teal-500/10 border border-teal-500/30 px-4 py-1 text-xs font-bold text-teal-500 uppercase tracking-wider mb-4">Production Engineering Reference</span>
          <h1 class="text-3xl md:text-5xl font-extrabold tracking-tight leading-[1.1] mb-5">
            Production Engineering <span class="bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 bg-clip-text text-transparent">Reference Sheets</span>
          </h1>
          <p class="text-base md:text-lg text-muted-foreground leading-relaxed">
            Operational quick-reference guides for cloud-native security and infrastructure engineering — built for the engineer in the middle of an incident, not for someone learning syntax. Every entry includes <strong class="text-foreground">production context, security implications, and a working example</strong>.
          </p>
        </header>

        <!-- Production references (Tier 1) -->
        <div class="mb-14">
          <div class="flex items-end justify-between mb-6">
            <div>
              <h2 class="text-2xl md:text-3xl font-extrabold tracking-tight">Cloud Native Security &amp; Infrastructure</h2>
              <p class="mt-1 text-sm text-muted-foreground">Production references for the security primitives modern infrastructure runs on.</p>
            </div>
          </div>

          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            @for (sheet of tier1Sheets; track sheet.slug) {
              <ng-container *ngTemplateOutlet="card; context: { $implicit: sheet }"></ng-container>
            }
          </div>
        </div>

        <!-- Engineering essentials (existing) -->
        <div class="mb-14">
          <div class="flex items-end justify-between mb-6">
            <div>
              <h2 class="text-2xl md:text-3xl font-extrabold tracking-tight">Engineering Essentials</h2>
              <p class="mt-1 text-sm text-muted-foreground">The core toolchain every backend, platform, and DevOps engineer reaches for daily.</p>
            </div>
          </div>

          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            @for (sheet of essentialsSheets; track sheet.slug) {
              <ng-container *ngTemplateOutlet="card; context: { $implicit: sheet }"></ng-container>
            }
          </div>
        </div>

        <!-- Why production references -->
        <div class="rounded-2xl border border-border/60 bg-gradient-to-br from-teal-500/5 via-card to-cyan-500/5 p-8 md:p-10">
          <div class="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 class="text-2xl md:text-3xl font-extrabold tracking-tight mb-3">Why these are different from generic cheatsheets</h2>
              <p class="text-sm md:text-base text-muted-foreground leading-relaxed mb-4">
                Most cheatsheets online are shallow command lists. Ours are written for the engineer in the middle of a production incident — every command shows <strong class="text-foreground">when to use it</strong>, the <strong class="text-foreground">security implication</strong>, and the <strong class="text-foreground">production tip</strong> that catches the 90% case.
              </p>
              <p class="text-sm md:text-base text-muted-foreground leading-relaxed">
                Pair the references here with the free
                <a routerLink="/courses/cloud-native-security-engineering" class="text-primary underline">Cloud Native Security Engineering</a>
                course for depth, the
                <a routerLink="/games/kubernetes-security-simulator" class="text-primary underline">Kubernetes Security Simulator</a>
                for hands-on practice, and the
                <a routerLink="/glossary" class="text-primary underline">cloud-native glossary</a>
                for definitions.
              </p>
            </div>
            <div class="grid grid-cols-2 gap-3 text-sm">
              <div class="rounded-xl border border-border/40 bg-card p-4">
                <div class="text-xs font-bold uppercase tracking-wider text-blue-500 mb-1">Production Tip</div>
                <span class="text-xs text-muted-foreground">When to actually use it</span>
              </div>
              <div class="rounded-xl border border-border/40 bg-card p-4">
                <div class="text-xs font-bold uppercase tracking-wider text-red-500 mb-1">Security Warning</div>
                <span class="text-xs text-muted-foreground">What can go wrong</span>
              </div>
              <div class="rounded-xl border border-border/40 bg-card p-4">
                <div class="text-xs font-bold uppercase tracking-wider text-green-500 mb-1">Hardened Pattern</div>
                <span class="text-xs text-muted-foreground">The safe alternative</span>
              </div>
              <div class="rounded-xl border border-border/40 bg-card p-4">
                <div class="text-xs font-bold uppercase tracking-wider text-orange-500 mb-1">Try It Yourself</div>
                <span class="text-xs text-muted-foreground">Working YAML / commands</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <ng-template #card let-sheet>
      @if (sheet.status === 'available' && sheet.href) {
        <a [routerLink]="sheet.href"
           class="group relative overflow-hidden rounded-2xl border border-border/60 bg-card p-7 transition-all duration-500 hover:shadow-xl hover:-translate-y-1 hover:border-primary/30">
          <div class="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-500"
               [style.background-image]="'linear-gradient(to right, transparent, ' + sheet.color + ', transparent)'"></div>
          <ng-container *ngTemplateOutlet="cardBody; context: { $implicit: sheet }"></ng-container>
        </a>
      } @else {
        <div class="group relative overflow-hidden rounded-2xl border border-dashed border-border/50 bg-card/40 p-7 cursor-not-allowed">
          <ng-container *ngTemplateOutlet="cardBody; context: { $implicit: sheet }"></ng-container>
        </div>
      }
    </ng-template>

    <ng-template #cardBody let-sheet>
      <div class="flex items-center justify-between mb-3">
        <div class="flex items-center justify-center h-12 w-12 rounded-xl text-2xl transition-transform duration-300 group-hover:scale-110"
             [style.background-color]="sheet.color + '15'"
             [style.color]="sheet.color"
             aria-hidden="true">
          {{ sheet.icon }}
        </div>
        @if (sheet.status === 'coming-soon') {
          <span class="inline-flex items-center rounded-full bg-muted text-muted-foreground px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">Coming Soon</span>
        } @else {
          <span class="inline-flex items-center rounded-full bg-green-500/15 text-green-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">Available</span>
        }
      </div>
      <h3 class="text-lg font-extrabold tracking-tight mb-2 transition-colors duration-300"
          [class.group-hover:text-primary]="sheet.status === 'available'">{{ sheet.name }}</h3>
      <p class="text-sm text-muted-foreground leading-relaxed mb-4">{{ sheet.description }}</p>
      <div class="flex flex-wrap gap-1.5">
        @for (topic of sheet.topics; track topic) {
          <span class="inline-flex items-center rounded-full border border-border/40 bg-muted/50 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
            {{ topic }}
          </span>
        }
      </div>
    </ng-template>
  `,
})
export class CheatsheetsHubComponent {
  private seo = inject(SeoService);

  tier1Sheets: Sheet[] = [
    {
      slug: 'kubernetes-security',
      name: 'Kubernetes Security',
      icon: '🛡️',
      color: '#f97316',
      description: 'RBAC audit, PodSecurity standards, NetworkPolicy default-deny, secrets, image signing, runtime forensics — with production tips and security warnings on every command.',
      topics: ['RBAC', 'PodSecurity', 'NetworkPolicy', 'Secrets', 'Sigstore', 'Audit'],
      status: 'available',
      tier: 1,
      href: '/cheatsheets/kubernetes-security',
    },
    {
      slug: 'kubernetes',
      name: 'Kubernetes (kubectl)',
      icon: '⎈',
      color: '#326ce5',
      description: 'Core kubectl commands for pods, deployments, services, debugging, logs, configs, and secrets — the day-to-day operational reference.',
      topics: ['kubectl', 'Pods', 'Deployments', 'Debugging'],
      status: 'available',
      tier: 1,
      href: '/cheatsheets/kubernetes',
    },
    {
      slug: 'spiffe-spire',
      name: 'SPIFFE & SPIRE',
      icon: '🔐',
      color: '#06b6d4',
      description: 'SPIFFE IDs, SVID issuance, SPIRE CLI commands, registration entries, federation reference, and the workload-attestation patterns used in production.',
      topics: ['SPIFFE ID', 'SVID', 'SPIRE CLI', 'Federation', 'Attestors'],
      status: 'available',
      tier: 1,
      href: '/cheatsheets/spiffe-spire',
    },
    {
      slug: 'opa-rego',
      name: 'OPA & Rego',
      icon: '⚖️',
      color: '#a855f7',
      description: 'Rego syntax, OPA policy patterns, Kubernetes admission policy examples, Gatekeeper constraints, and the testing flow that keeps policy authors honest.',
      topics: ['Rego', 'Gatekeeper', 'Admission', 'Policy-as-Code'],
      status: 'available',
      tier: 1,
      href: '/cheatsheets/opa-rego',
    },
    {
      slug: 'api-security',
      name: 'API Security',
      icon: '🔑',
      color: '#ef4444',
      description: 'JWT validation patterns, OAuth2 flows, secure API headers, mTLS configuration, webhook signing, and the OWASP API Top 10 — with copy-paste defenses.',
      topics: ['JWT', 'OAuth2', 'mTLS', 'Webhooks', 'OWASP API'],
      status: 'available',
      tier: 1,
      href: '/cheatsheets/api-security',
    },
    {
      slug: 'linux-networking',
      name: 'Linux Networking',
      icon: '🌐',
      color: '#22c55e',
      description: 'iptables/nftables, tcpdump, OpenSSL, certificate debugging, eBPF tracing, ss/netstat, and the toolkit you reach for when a connection just will not establish.',
      topics: ['iptables', 'tcpdump', 'OpenSSL', 'eBPF', 'Routing'],
      status: 'available',
      tier: 1,
      href: '/cheatsheets/linux-networking',
    },
    {
      slug: 'runtime-security',
      name: 'Runtime Security (Falco / eBPF)',
      icon: '🚨',
      color: '#dc2626',
      description: 'Falco rule syntax, eBPF observability with Pixie/Tetragon, Linux syscall reference for detection engineering, and patterns for tuning out noise.',
      topics: ['Falco', 'eBPF', 'Tetragon', 'Syscalls'],
      status: 'available',
      tier: 2,
      href: '/cheatsheets/runtime-security',
    },
    {
      slug: 'service-mesh',
      name: 'Service Mesh (Istio / Envoy)',
      icon: '🕸️',
      color: '#8b5cf6',
      description: 'Istio traffic management, Envoy filter patterns, mTLS configuration, AuthorizationPolicy examples, and the diagnostics commands that actually work.',
      topics: ['Istio', 'Envoy', 'mTLS', 'AuthZ Policy'],
      status: 'available',
      tier: 2,
      href: '/cheatsheets/service-mesh',
    },
    {
      slug: 'devsecops',
      name: 'DevSecOps & Supply Chain',
      icon: '🔗',
      color: '#14b8a6',
      description: 'Sigstore / cosign commands, SBOM generation, SLSA provenance, GitHub Actions security patterns, and the gates that catch supply-chain attacks at CI time.',
      topics: ['Sigstore', 'cosign', 'SBOM', 'SLSA', 'GHA Security'],
      status: 'available',
      tier: 2,
      href: '/cheatsheets/devsecops',
    },
  ];

  essentialsSheets: Sheet[] = [
    {
      slug: 'docker',
      name: 'Docker',
      icon: '🐳',
      color: '#0db7ed',
      description: 'Build, run, compose, volumes, networks, multi-stage builds, and the debugging commands you reach for when a container will not start.',
      topics: ['Build', 'Compose', 'Volumes', 'Debug'],
      status: 'available',
      tier: 2,
      href: '/cheatsheets/docker',
    },
    {
      slug: 'git',
      name: 'Git',
      icon: '🔀',
      color: '#f97316',
      description: 'Branch, merge, rebase, stash, reset, log, diff, cherry-pick, and how to undo every mistake without losing work.',
      topics: ['Rebase', 'Stash', 'Reset', 'Recovery'],
      status: 'available',
      tier: 2,
      href: '/cheatsheets/git',
    },
    {
      slug: 'sql',
      name: 'SQL',
      icon: '🗄️',
      color: '#22c55e',
      description: 'SELECT, JOIN, GROUP BY, window functions, subqueries, CTEs, indexes, and the performance-tuning patterns that separate junior from senior queries.',
      topics: ['Joins', 'Window Functions', 'CTEs', 'Indexes'],
      status: 'available',
      tier: 2,
      href: '/cheatsheets/sql',
    },
    {
      slug: 'python',
      name: 'Python',
      icon: '🐍',
      color: '#3b82f6',
      description: 'Data types, list comprehensions, f-strings, decorators, OOP patterns, file I/O, error handling, and virtual environments.',
      topics: ['Idioms', 'OOP', 'venv', 'Errors'],
      status: 'available',
      tier: 3,
      href: '/cheatsheets/python',
    },
  ];

  constructor() {
    this.seo.update({
      title: 'Production Engineering Reference Sheets',
      description: 'Production-grade reference guides for cloud-native security and infrastructure engineering: Kubernetes Security, SPIFFE/SPIRE, OPA/Rego, API security, runtime detection, service mesh, and supply chain. Free, ad-free.',
      url: '/cheatsheets',
      breadcrumbs: [
        { name: 'Home', url: '/' },
        { name: 'Reference', url: '/cheatsheets' },
      ],
    });
  }
}
