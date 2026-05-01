import { Component, inject } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../../services/seo.service';

interface SimulatorConcept {
  label: string;
}

interface Simulator {
  slug: string;
  name: string;
  shortName: string;
  icon: string;
  category: 'security' | 'foundations';
  status: 'available' | 'coming-soon';
  description: string;
  concepts: SimulatorConcept[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
  time: string;
  color: string;
  href: string | null;
  external?: boolean;
}

@Component({
  selector: 'app-games-hub',
  imports: [RouterLink, NgTemplateOutlet],
  template: `
    <section class="py-12 md:py-16 animate-in fade-in duration-500">
      <div class="container max-w-6xl mx-auto px-6">
        <nav aria-label="Breadcrumb" class="mb-6">
          <ol class="flex items-center gap-1.5 text-sm text-muted-foreground">
            <li><a routerLink="/" class="hover:text-foreground transition-colors">Home</a></li>
            <li class="text-muted-foreground/50">/</li>
            <li class="text-foreground font-medium" aria-current="page">Security Simulators</li>
          </ol>
        </nav>

        <header class="text-center max-w-3xl mx-auto mb-12">
          <span class="inline-block rounded-full bg-orange-500/10 border border-orange-500/30 px-4 py-1 text-xs font-bold text-orange-500 uppercase tracking-wider mb-4">Learn by Playing</span>
          <h1 class="text-3xl md:text-5xl font-extrabold tracking-tight leading-[1.1] mb-5">
            Cloud Native Security <span class="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 bg-clip-text text-transparent">Simulators &amp; Labs</span>
          </h1>
          <p class="text-base md:text-lg text-muted-foreground leading-relaxed">
            Interactive Kubernetes security challenges, Zero Trust simulations, and infrastructure-engineering exercises. Built for engineers who want to <strong class="text-foreground">learn cloud-native security by doing</strong> — with real manifests, real attack patterns, and real production stakes.
          </p>
        </header>

        <!-- Section: Cloud Native Security Simulators -->
        <div class="mb-14">
          <div class="flex items-end justify-between mb-6">
            <div>
              <h2 class="text-2xl md:text-3xl font-extrabold tracking-tight">Cloud Native Security Simulators</h2>
              <p class="mt-1 text-sm text-muted-foreground">Hands-on labs covering Kubernetes security, Zero Trust, workload identity, runtime defense, and supply chain.</p>
            </div>
          </div>

          <div class="grid md:grid-cols-2 gap-5">
            @for (game of securitySimulators; track game.slug) {
              <ng-container *ngTemplateOutlet="simCard; context: { $implicit: game }"></ng-container>
            }
          </div>
        </div>

        <!-- Section: Foundations & Engineering Drills -->
        <div class="mb-14">
          <div class="flex items-end justify-between mb-6">
            <div>
              <h2 class="text-2xl md:text-3xl font-extrabold tracking-tight">Foundations &amp; Engineering Drills</h2>
              <p class="mt-1 text-sm text-muted-foreground">Sharpen the engineering fundamentals that good infrastructure security depends on — reading code, debugging Linux, troubleshooting production.</p>
            </div>
          </div>

          <div class="grid md:grid-cols-2 gap-5">
            @for (game of foundationsGames; track game.slug) {
              <ng-container *ngTemplateOutlet="simCard; context: { $implicit: game }"></ng-container>
            }
          </div>
        </div>

        <!-- Why play -->
        <div class="rounded-2xl border border-border/60 bg-gradient-to-br from-orange-500/5 via-card to-amber-500/5 p-8 md:p-10">
          <div class="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 class="text-2xl md:text-3xl font-extrabold tracking-tight mb-3">Why interactive labs — not just docs</h2>
              <p class="text-sm md:text-base text-muted-foreground leading-relaxed mb-4">
                Most cloud-native security knowledge lives in the muscle memory of engineers who&apos;ve seen it go wrong. The simulators recreate the exact decision points — the YAML you have to review, the alert you have to triage, the policy you have to write — without needing a real cluster, a real incident, or a real attacker.
              </p>
              <p class="text-sm md:text-base text-muted-foreground leading-relaxed">
                Combined with the free <a routerLink="/courses/cloud-native-security-engineering" class="text-primary underline">Cloud Native Security Engineering</a> course and the <a routerLink="/courses/mastering-spiffe-spire" class="text-primary underline">Mastering SPIFFE &amp; SPIRE</a> curriculum, you get the full ecosystem: courses for depth, tutorials for focused implementation, diagrams for visual understanding, labs for hands-on practice, and games for interactive learning.
              </p>
            </div>
            <div class="grid grid-cols-2 gap-3 text-sm">
              <div class="rounded-xl border border-border/40 bg-card p-4">
                <div class="text-2xl mb-1" aria-hidden="true">📚</div>
                <strong class="block text-foreground">Courses</strong>
                <span class="text-xs text-muted-foreground">Deep, structured learning</span>
              </div>
              <div class="rounded-xl border border-border/40 bg-card p-4">
                <div class="text-2xl mb-1" aria-hidden="true">🛠️</div>
                <strong class="block text-foreground">Tutorials</strong>
                <span class="text-xs text-muted-foreground">Focused implementation</span>
              </div>
              <div class="rounded-xl border border-border/40 bg-card p-4">
                <div class="text-2xl mb-1" aria-hidden="true">🗺️</div>
                <strong class="block text-foreground">Diagrams</strong>
                <span class="text-xs text-muted-foreground">Visual architecture</span>
              </div>
              <div class="rounded-xl border border-border/40 bg-card p-4">
                <div class="text-2xl mb-1" aria-hidden="true">🎮</div>
                <strong class="block text-foreground">Games &amp; Labs</strong>
                <span class="text-xs text-muted-foreground">Interactive practice</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Reusable simulator card template -->
    <ng-template #simCard let-game>
      @if (game.href && game.status === 'available') {
        <a [routerLink]="game.href"
           class="group relative overflow-hidden rounded-2xl border border-border/60 bg-card p-7 transition-all duration-500 hover:shadow-xl hover:-translate-y-1 hover:border-primary/30">
          <div class="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-500"
               [style.background-image]="'linear-gradient(to right, transparent, ' + game.color + ', transparent)'"></div>
          <ng-container *ngTemplateOutlet="cardBody; context: { $implicit: game }"></ng-container>
        </a>
      } @else {
        <div class="group relative overflow-hidden rounded-2xl border border-dashed border-border/50 bg-card/40 p-7 cursor-not-allowed">
          <ng-container *ngTemplateOutlet="cardBody; context: { $implicit: game }"></ng-container>
        </div>
      }
    </ng-template>

    <ng-template #cardBody let-game>
      <div class="flex items-start gap-5">
        <div class="flex items-center justify-center h-14 w-14 rounded-2xl text-2xl flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
             [style.background-color]="game.color + '15'"
             [style.color]="game.color">
          {{ game.icon }}
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 mb-1.5">
            @if (game.status === 'coming-soon') {
              <span class="inline-flex items-center rounded-full bg-muted text-muted-foreground px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">Coming Soon</span>
            } @else {
              <span class="inline-flex items-center rounded-full bg-green-500/15 text-green-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">Available</span>
            }
            <span class="text-[10px] text-muted-foreground font-mono">{{ game.time }} · {{ game.difficulty }}</span>
          </div>
          <h3 class="text-lg font-extrabold tracking-tight mb-2 transition-colors duration-300"
              [class.group-hover:text-primary]="game.status === 'available'">
            {{ game.name }}
          </h3>
          <p class="text-sm text-muted-foreground leading-relaxed mb-3">
            {{ game.description }}
          </p>
          <div class="flex flex-wrap gap-1.5">
            @for (concept of game.concepts; track concept.label) {
              <span class="inline-flex items-center rounded-full border border-border/40 bg-muted/50 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                {{ concept.label }}
              </span>
            }
          </div>
        </div>
        @if (game.status === 'available') {
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
               class="text-muted-foreground flex-shrink-0 transition-all duration-300 group-hover:translate-x-1 group-hover:text-primary" aria-hidden="true">
            <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
          </svg>
        }
      </div>
    </ng-template>
  `,
})
export class GamesHubComponent {
  private seo = inject(SeoService);

  securitySimulators: Simulator[] = [
    {
      slug: 'kubernetes-security-simulator',
      name: 'Kubernetes Security Simulator',
      shortName: 'K8s Security Simulator',
      icon: '🛡️',
      category: 'security',
      status: 'available',
      description: 'Secure a production Kubernetes cluster across 6 real-world scenarios. Spot RBAC misconfigurations, missing network policies, privileged pods, leaked secrets, and supply-chain risks.',
      concepts: [
        { label: 'RBAC' },
        { label: 'Namespaces' },
        { label: 'Network Policy' },
        { label: 'PodSecurity' },
        { label: 'Secrets' },
        { label: 'Image Security' },
      ],
      difficulty: 'Hard',
      time: '~10 min',
      color: '#f97316',
      href: '/games/kubernetes-security-simulator',
    },
    {
      slug: 'zero-trust-network-builder',
      name: 'Zero Trust Network Builder',
      shortName: 'Zero Trust Builder',
      icon: '🔐',
      category: 'security',
      status: 'coming-soon',
      description: 'Design secure service-to-service communication using SPIFFE workload identity and mTLS. Configure trust boundaries, federate trust domains, and propagate identity across clusters.',
      concepts: [
        { label: 'SPIFFE' },
        { label: 'SPIRE' },
        { label: 'mTLS' },
        { label: 'Identity Propagation' },
        { label: 'Federation' },
      ],
      difficulty: 'Hard',
      time: '~15 min',
      color: '#06b6d4',
      href: null,
    },
    {
      slug: 'api-attack-defense',
      name: 'API Attack & Defense',
      shortName: 'API Attack & Defense',
      icon: '🎯',
      category: 'security',
      status: 'coming-soon',
      description: 'Identify vulnerable API endpoints, harden auth flows, and stop attacks. Practice catching JWT verification bugs, OAuth misconfigurations, and broken access control before production does.',
      concepts: [
        { label: 'JWT' },
        { label: 'OAuth' },
        { label: 'API Gateways' },
        { label: 'Auth Flaws' },
        { label: 'OWASP API Top 10' },
      ],
      difficulty: 'Medium',
      time: '~12 min',
      color: '#ef4444',
      href: null,
    },
    {
      slug: 'incident-response-simulator',
      name: 'Incident Response Simulator',
      shortName: 'Incident Response',
      icon: '🚨',
      category: 'security',
      status: 'coming-soon',
      description: 'You are on call. A Falco alert fires. Triage the event, analyze runtime telemetry, contain lateral movement, and hand off a post-incident report — all under a clock.',
      concepts: [
        { label: 'Falco' },
        { label: 'Runtime Security' },
        { label: 'Threat Detection' },
        { label: 'eBPF' },
        { label: 'Lateral Movement' },
      ],
      difficulty: 'Hard',
      time: '~15 min',
      color: '#dc2626',
      href: null,
    },
    {
      slug: 'supply-chain-defense',
      name: 'Supply Chain Defense Simulator',
      shortName: 'Supply Chain Defense',
      icon: '🔗',
      category: 'security',
      status: 'coming-soon',
      description: 'Secure CI/CD pipelines against compromised dependencies, malicious commits, and unsigned artifacts. Verify Sigstore signatures, validate SBOMs, enforce SLSA-level provenance.',
      concepts: [
        { label: 'Sigstore' },
        { label: 'SBOM' },
        { label: 'SLSA' },
        { label: 'Provenance' },
        { label: 'Secure CI/CD' },
      ],
      difficulty: 'Medium',
      time: '~12 min',
      color: '#22c55e',
      href: null,
    },
    {
      slug: 'service-mesh-routing',
      name: 'Service Mesh Routing Game',
      shortName: 'Service Mesh Routing',
      icon: '🌐',
      category: 'security',
      status: 'coming-soon',
      description: 'Configure traffic routing, mTLS-by-default, and authorization policy across an Istio/Envoy mesh. Optimize for trust without breaking the service graph.',
      concepts: [
        { label: 'Istio' },
        { label: 'Envoy' },
        { label: 'mTLS' },
        { label: 'Traffic Policy' },
        { label: 'Authz Policies' },
      ],
      difficulty: 'Medium',
      time: '~12 min',
      color: '#8b5cf6',
      href: null,
    },
    {
      slug: 'threat-modeling-challenge',
      name: 'Threat Modeling Challenge',
      shortName: 'Threat Modeling',
      icon: '🧠',
      category: 'security',
      status: 'coming-soon',
      description: 'Identify the attack surface of a given architecture, map data flows, enumerate threats with STRIDE, and propose mitigations. Real cloud-native systems, real trade-offs.',
      concepts: [
        { label: 'STRIDE' },
        { label: 'Attack Surface' },
        { label: 'Mitigations' },
        { label: 'Data Flow' },
      ],
      difficulty: 'Hard',
      time: '~15 min',
      color: '#a855f7',
      href: null,
    },
    {
      slug: 'secure-architecture-builder',
      name: 'Secure Architecture Builder',
      shortName: 'Architecture Builder',
      icon: '🏗️',
      category: 'security',
      status: 'coming-soon',
      description: 'Drag-and-drop infrastructure components onto a canvas, apply Zero Trust controls, and ship a secure production design. Get instant feedback on weak boundaries and missing controls.',
      concepts: [
        { label: 'Architecture' },
        { label: 'Zero Trust' },
        { label: 'Defense in Depth' },
        { label: 'Cloud Native' },
      ],
      difficulty: 'Hard',
      time: '~20 min',
      color: '#3b82f6',
      href: null,
    },
    {
      slug: 'kubernetes-escape-room',
      name: 'Kubernetes Escape Room',
      shortName: 'K8s Escape Room',
      icon: '🔓',
      category: 'security',
      status: 'coming-soon',
      description: 'You have shell access in a low-privilege pod. Solve a chain of misconfigurations — secrets leaks, privilege escalation, container escape — to "escape" the cluster. Defensive perspective: which control would have stopped each step?',
      concepts: [
        { label: 'Privilege Escalation' },
        { label: 'Container Escape' },
        { label: 'Secrets Leak' },
        { label: 'Defensive Controls' },
      ],
      difficulty: 'Hard',
      time: '~20 min',
      color: '#ec4899',
      href: null,
    },
    {
      slug: 'ai-infrastructure-security',
      name: 'AI Infrastructure Security Game',
      shortName: 'AI Infra Security',
      icon: '🤖',
      category: 'security',
      status: 'coming-soon',
      description: 'Secure AI agents, manage machine identity for inference services, and protect model-serving infrastructure from prompt injection, model extraction, and credential abuse.',
      concepts: [
        { label: 'AI Agents' },
        { label: 'Machine Identity' },
        { label: 'Inference Security' },
        { label: 'Prompt Injection' },
      ],
      difficulty: 'Hard',
      time: '~15 min',
      color: '#14b8a6',
      href: null,
    },
  ];

  foundationsGames: Simulator[] = [
    {
      slug: 'devops-scenario',
      name: 'DevOps Incident Scenarios',
      shortName: 'DevOps Scenarios',
      icon: '⚠️',
      category: 'foundations',
      status: 'available',
      description: 'Production incident drills. Your pod is crashing, your latency just spiked, your secret rotated mid-deploy — diagnose and fix it, then learn what happened.',
      concepts: [
        { label: 'Kubernetes' },
        { label: 'Troubleshooting' },
        { label: 'On-Call' },
      ],
      difficulty: 'Hard',
      time: '~10 min',
      color: '#f97316',
      href: '/games/devops-scenario',
    },
    {
      slug: 'linux-challenge',
      name: 'Linux Command Challenge',
      shortName: 'Linux Challenge',
      icon: '🐧',
      category: 'foundations',
      status: 'available',
      description: 'Type the right command for each task. Find files, process logs, manage permissions — the Linux fluency that every infra-security incident eventually requires.',
      concepts: [
        { label: 'Linux' },
        { label: 'Bash' },
        { label: 'CLI' },
      ],
      difficulty: 'Medium',
      time: '~5 min',
      color: '#a855f7',
      href: '/games/linux-challenge',
    },
    {
      slug: 'spot-the-bug',
      name: 'Spot the Bug',
      shortName: 'Spot the Bug',
      icon: '🐛',
      category: 'foundations',
      status: 'available',
      description: 'Subtle code-review bugs — off-by-one errors, race conditions, broken auth checks. Train the eye that finds the bug your teammate missed in PR review.',
      concepts: [
        { label: 'Code Review' },
        { label: 'Auth Bugs' },
        { label: 'Concurrency' },
      ],
      difficulty: 'Hard',
      time: '~8 min',
      color: '#ef4444',
      href: '/games/spot-the-bug',
    },
    {
      slug: 'guess-output',
      name: 'Guess the Output',
      shortName: 'Guess the Output',
      icon: '🎯',
      category: 'foundations',
      status: 'available',
      description: 'Predict what these tricky Python and JavaScript snippets actually print. Catch the language quirks that turn into production bugs.',
      concepts: [
        { label: 'Python' },
        { label: 'JavaScript' },
        { label: 'Language Quirks' },
      ],
      difficulty: 'Medium',
      time: '~5 min',
      color: '#3b82f6',
      href: '/games/guess-output',
    },
    {
      slug: 'typing-test',
      name: 'Code Typing Speed',
      shortName: 'Code Typing Speed',
      icon: '⚡',
      category: 'foundations',
      status: 'available',
      description: 'Test your typing speed on real open-source code snippets. Sometimes the fastest fix is the one you can type first.',
      concepts: [
        { label: 'Typing' },
        { label: 'Speed' },
      ],
      difficulty: 'Easy',
      time: '~2 min',
      color: '#06b6d4',
      href: '/games/typing-test',
    },
    {
      slug: 'salary-calculator',
      name: 'Tech Salary Calculator',
      shortName: 'Salary Calculator',
      icon: '💰',
      category: 'foundations',
      status: 'available',
      description: 'Estimate compensation for cloud-native security, platform, and backend roles by experience and location. Aggregated from public industry data.',
      concepts: [
        { label: 'Compensation' },
        { label: 'Career' },
      ],
      difficulty: 'Easy',
      time: '~1 min',
      color: '#22c55e',
      href: '/games/salary-calculator',
    },
  ];

  constructor() {
    this.seo.update({
      title: 'Cloud Native Security Simulators',
      description: 'Interactive Kubernetes security labs, Zero Trust simulations, threat-modeling challenges, and infrastructure-engineering drills. Learn cloud-native security by playing — free and ad-free.',
      url: '/games',
      breadcrumbs: [
        { name: 'Home', url: '/' },
        { name: 'Security Simulators', url: '/games' },
      ],
    });
  }
}
