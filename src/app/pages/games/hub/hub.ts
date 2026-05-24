import { Component, inject } from '@angular/core';
import { SeoService } from '../../../services/seo.service';
import { Md3HeroComponent } from '../../../shared/md3/md3-hero';
import { Md3LinkPanelComponent } from '../../../shared/md3/md3-link-panel';
import { Md3ResourceCardComponent } from '../../../shared/md3/md3-resource-card';
import { Md3Hero, Md3LinkPanel, Md3ResourceCard } from '../../../shared/md3/md3.types';

interface SimulatorConcept {
  label: string;
}

interface Simulator {
  slug: string;
  name: string;
  shortName: string;
  category: 'security' | 'foundations';
  status: 'available' | 'coming-soon';
  description: string;
  concepts: SimulatorConcept[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
  time: string;
  href: string | null;
}

@Component({
  selector: 'app-games-hub',
  imports: [Md3HeroComponent, Md3ResourceCardComponent, Md3LinkPanelComponent],
  template: `
    <main class="md3-learning-page">
      <app-md3-hero [hero]="hero" />

      <section class="md3-learning-section">
        <div class="md3-learning-container">
          <div class="md3-learning-section-heading">
            <span class="md3-learning-eyebrow">Security practice</span>
            <h2>Cloud native security simulators</h2>
            <p>Use these labs when you want to test the decisions behind RBAC, mTLS, runtime defense, supply-chain gates, threat modeling, and AI agent infrastructure.</p>
          </div>

          <div class="md3-learning-grid-3">
            @for (card of securityCards; track card.title) {
              <app-md3-resource-card [card]="card" />
            }
          </div>
        </div>
      </section>

      <section class="md3-learning-tonal-section">
        <div class="md3-learning-container">
          <div class="md3-learning-section-heading">
            <span class="md3-learning-eyebrow">Foundations</span>
            <h2>Engineering drills for production reflexes</h2>
            <p>Short practice loops for code review, Linux, incident debugging, language behavior, and career planning. These are lighter than the security labs, but still practical.</p>
          </div>

          <div class="md3-learning-grid-3">
            @for (card of foundationCards; track card.title) {
              <app-md3-resource-card [card]="card" />
            }
          </div>
        </div>
      </section>

      <section class="md3-learning-section">
        <div class="md3-learning-container">
          <app-md3-link-panel [panel]="linkPanel" />
        </div>
      </section>
    </main>
  `,
})
export class GamesHubComponent {
  private seo = inject(SeoService);

  get hero(): Md3Hero {
    return {
      breadcrumbs: [
        { label: 'Home', href: '/' },
        { label: 'Interactive labs' },
      ],
      eyebrow: 'Interactive engineering labs',
      title: 'Practice production decisions before they are incidents',
      lede: 'Scenario-based labs for Kubernetes, Zero Trust, API security, incident response, supply chain, AI infrastructure, Linux, and production debugging. Each lab turns a real engineering failure mode into a focused decision exercise.',
      actions: [
        { label: 'Start a lab', href: '/games/kubernetes-security-simulator', variant: 'filled' },
        { label: 'Learn the system first', href: '/courses/cloud-native-security-engineering', variant: 'tonal' },
      ],
      selectedChip: 'Kubernetes',
      chips: ['Kubernetes', 'Zero Trust', 'API Security', 'Incident Response', 'Supply Chain', 'AI Infrastructure', 'Linux'],
      panel: {
        title: 'Lab cockpit',
        meta: `${this.availableLabs.length} available`,
        ariaLabel: 'Lab coverage summary',
        mapLabels: ['K8S', 'ID', 'IR', 'API'],
        stats: [
          { value: `${this.securitySimulators.length}`, label: 'Security scenarios' },
          { value: `${this.foundationsGames.length}`, label: 'Foundation drills' },
        ],
      },
    };
  }

  securitySimulators: Simulator[] = [
    {
      slug: 'kubernetes-security-simulator',
      name: 'Kubernetes Security Simulator',
      shortName: 'K8s Security Simulator',
      category: 'security',
      status: 'available',
      description: 'Secure a production Kubernetes cluster across real scenarios: RBAC, NetworkPolicy, PodSecurity, secrets, image provenance, and audit decisions.',
      concepts: [{ label: 'RBAC' }, { label: 'NetworkPolicy' }, { label: 'PodSecurity' }, { label: 'Secrets' }, { label: 'Sigstore' }],
      difficulty: 'Hard',
      time: '~10 min',
      href: '/games/kubernetes-security-simulator',
    },
    {
      slug: 'zero-trust-network-builder',
      name: 'Zero Trust Network Builder',
      shortName: 'Zero Trust Builder',
      category: 'security',
      status: 'available',
      description: 'Design service-to-service communication using SPIFFE workload identity, mTLS, attestation, federation, and short-lived SVIDs.',
      concepts: [{ label: 'SPIFFE' }, { label: 'SPIRE' }, { label: 'mTLS' }, { label: 'Federation' }],
      difficulty: 'Hard',
      time: '~12 min',
      href: '/games/zero-trust-network-builder',
    },
    {
      slug: 'api-attack-defense',
      name: 'API Attack & Defense',
      shortName: 'API Attack & Defense',
      category: 'security',
      status: 'available',
      description: 'Spot vulnerable endpoints before attackers do: JWT confusion, OAuth redirect bypasses, mass assignment, CORS, rate-limit spoofing, and webhook timing.',
      concepts: [{ label: 'JWT' }, { label: 'OAuth' }, { label: 'Gateways' }, { label: 'OWASP API' }],
      difficulty: 'Hard',
      time: '~12 min',
      href: '/games/api-attack-defense',
    },
    {
      slug: 'incident-response-simulator',
      name: 'Incident Response Simulator',
      shortName: 'Incident Response',
      category: 'security',
      status: 'available',
      description: 'Triage Falco alerts, stolen service-account tokens, crypto-miner indicators, container drift, suspicious audit logs, and eBPF detections.',
      concepts: [{ label: 'Falco' }, { label: 'Runtime' }, { label: 'eBPF' }, { label: 'Forensics' }],
      difficulty: 'Hard',
      time: '~15 min',
      href: '/games/incident-response-simulator',
    },
    {
      slug: 'supply-chain-defense',
      name: 'Supply Chain Defense Simulator',
      shortName: 'Supply Chain Defense',
      category: 'security',
      status: 'available',
      description: 'Review signing, SBOM, SLSA, dependency confusion, GitHub Actions scope, and admission policy gaps before artifacts reach production.',
      concepts: [{ label: 'Sigstore' }, { label: 'SBOM' }, { label: 'SLSA' }, { label: 'CI/CD' }],
      difficulty: 'Medium',
      time: '~12 min',
      href: '/games/supply-chain-defense',
    },
    {
      slug: 'service-mesh-routing',
      name: 'Service Mesh Routing Game',
      shortName: 'Service Mesh Routing',
      category: 'security',
      status: 'available',
      description: 'Debug mTLS rollout flaws, AuthorizationPolicy scope, JWT validation, traffic shifting, retry storms, and Envoy diagnostics.',
      concepts: [{ label: 'Istio' }, { label: 'Envoy' }, { label: 'mTLS' }, { label: 'AuthZ' }],
      difficulty: 'Medium',
      time: '~12 min',
      href: '/games/service-mesh-routing',
    },
    {
      slug: 'threat-modeling-challenge',
      name: 'Threat Modeling Challenge',
      shortName: 'Threat Modeling',
      category: 'security',
      status: 'available',
      description: 'Classify STRIDE threats, trust boundaries, attack trees, data sensitivity, mitigations, and risk priority across production systems.',
      concepts: [{ label: 'STRIDE' }, { label: 'Boundaries' }, { label: 'Mitigation' }, { label: 'Risk' }],
      difficulty: 'Hard',
      time: '~15 min',
      href: '/games/threat-modeling-challenge',
    },
    {
      slug: 'secure-architecture-builder',
      name: 'Secure Architecture Builder',
      shortName: 'Architecture Builder',
      category: 'security',
      status: 'available',
      description: 'Choose VPC boundaries, WAF placement, secret stores, CDN origin controls, IAM access, and multi-region resilience patterns.',
      concepts: [{ label: 'Architecture' }, { label: 'IAM' }, { label: 'Secrets' }, { label: 'Resilience' }],
      difficulty: 'Hard',
      time: '~20 min',
      href: '/games/secure-architecture-builder',
    },
    {
      slug: 'kubernetes-escape-room',
      name: 'Kubernetes Escape Room',
      shortName: 'K8s Escape Room',
      category: 'security',
      status: 'available',
      description: 'Walk through compromise chains and pick the control that breaks each step: token recon, host access, exec abuse, and secret exposure.',
      concepts: [{ label: 'Escalation' }, { label: 'Escape' }, { label: 'Secrets' }, { label: 'Controls' }],
      difficulty: 'Hard',
      time: '~20 min',
      href: '/games/kubernetes-escape-room',
    },
    {
      slug: 'ai-infrastructure-security',
      name: 'AI Infrastructure Security Game',
      shortName: 'AI Infra Security',
      category: 'security',
      status: 'available',
      description: 'Identify prompt injection, model extraction, vector database leakage, agent tool scope, cost abuse, and MCP server identity gaps.',
      concepts: [{ label: 'Agents' }, { label: 'MCP' }, { label: 'RAG' }, { label: 'Tool Scope' }],
      difficulty: 'Hard',
      time: '~15 min',
      href: '/games/ai-infrastructure-security',
    },
  ];

  foundationsGames: Simulator[] = [
    {
      slug: 'devops-scenario',
      name: 'DevOps Incident Scenarios',
      shortName: 'DevOps Scenarios',
      category: 'foundations',
      status: 'available',
      description: 'Diagnose crashing pods, latency spikes, broken rollouts, and secret rotation failures through realistic on-call prompts.',
      concepts: [{ label: 'Kubernetes' }, { label: 'On-call' }, { label: 'Debugging' }],
      difficulty: 'Hard',
      time: '~10 min',
      href: '/games/devops-scenario',
    },
    {
      slug: 'linux-challenge',
      name: 'Linux Command Challenge',
      shortName: 'Linux Challenge',
      category: 'foundations',
      status: 'available',
      description: 'Use the right command to find files, inspect processes, read logs, test networking, and manage permissions.',
      concepts: [{ label: 'Linux' }, { label: 'Bash' }, { label: 'CLI' }],
      difficulty: 'Medium',
      time: '~5 min',
      href: '/games/linux-challenge',
    },
    {
      slug: 'spot-the-bug',
      name: 'Spot the Bug',
      shortName: 'Spot the Bug',
      category: 'foundations',
      status: 'available',
      description: 'Train code-review judgment on subtle auth checks, off-by-one errors, race conditions, and broken assumptions.',
      concepts: [{ label: 'Code Review' }, { label: 'Auth' }, { label: 'Concurrency' }],
      difficulty: 'Hard',
      time: '~8 min',
      href: '/games/spot-the-bug',
    },
    {
      slug: 'guess-output',
      name: 'Guess the Output',
      shortName: 'Guess the Output',
      category: 'foundations',
      status: 'available',
      description: 'Predict what tricky Python and JavaScript snippets print, then learn the language behavior behind the surprise.',
      concepts: [{ label: 'Python' }, { label: 'JavaScript' }, { label: 'Runtime' }],
      difficulty: 'Medium',
      time: '~5 min',
      href: '/games/guess-output',
    },
    {
      slug: 'typing-test',
      name: 'Code Typing Speed',
      shortName: 'Code Typing Speed',
      category: 'foundations',
      status: 'available',
      description: 'Practice typing real code snippets with a clean speed test built for developers.',
      concepts: [{ label: 'Typing' }, { label: 'Speed' }],
      difficulty: 'Easy',
      time: '~2 min',
      href: '/games/typing-test',
    },
    {
      slug: 'salary-calculator',
      name: 'Tech Salary Calculator',
      shortName: 'Salary Calculator',
      category: 'foundations',
      status: 'available',
      description: 'Estimate compensation for backend, platform, cloud-native security, and AI infrastructure roles by level and location.',
      concepts: [{ label: 'Career' }, { label: 'Compensation' }],
      difficulty: 'Easy',
      time: '~1 min',
      href: '/games/salary-calculator',
    },
  ];

  get availableLabs(): Simulator[] {
    return [...this.securitySimulators, ...this.foundationsGames].filter(game => game.status === 'available');
  }

  get securityCards(): Md3ResourceCard[] {
    return this.securitySimulators.map(game => this.labCard(game, 'Practice the scenario', true));
  }

  get foundationCards(): Md3ResourceCard[] {
    return this.foundationsGames.map(game => this.labCard(game, 'Open drill', false));
  }

  linkPanel: Md3LinkPanel = {
    eyebrow: 'How to use the labs',
    title: 'Learn, decide, then keep the checklist close',
    body: 'The labs are designed to pair with the free courses and reference sheets. Read the concept, practice the failure mode, then keep the command sheet nearby when you ship.',
    links: [
      { label: 'Cloud native security course', href: '/courses/cloud-native-security-engineering' },
      { label: 'Kubernetes security sheet', href: '/cheatsheets/kubernetes-security' },
      { label: 'Glossary terms', href: '/glossary' },
    ],
  };

  private labCard(game: Simulator, actionLabel: string, selectedBadge: boolean): Md3ResourceCard {
    return {
      title: game.name,
      description: game.description,
      href: game.href,
      icon: this.labIcon(game.slug),
      badge: selectedBadge ? game.difficulty : game.time,
      selectedBadge,
      kicker: `${selectedBadge ? game.time : game.difficulty} | ${this.scenarioType(game.slug)}`,
      chips: game.concepts.slice(0, selectedBadge ? 4 : undefined).map(concept => concept.label),
      actionLabel,
      ariaLabel: `Open ${game.name}`,
    };
  }

  labIcon(slug: string): string {
    const labels: Record<string, string> = {
      'kubernetes-security-simulator': 'K8S',
      'zero-trust-network-builder': 'ID',
      'api-attack-defense': 'API',
      'incident-response-simulator': 'IR',
      'supply-chain-defense': 'SLSA',
      'service-mesh-routing': 'MESH',
      'threat-modeling-challenge': 'TM',
      'secure-architecture-builder': 'ARCH',
      'kubernetes-escape-room': 'ESC',
      'ai-infrastructure-security': 'AI',
      'devops-scenario': 'OPS',
      'linux-challenge': 'LIN',
      'spot-the-bug': 'BUG',
      'guess-output': 'OUT',
      'typing-test': 'TYPE',
      'salary-calculator': 'PAY',
    };
    return labels[slug] ?? 'LAB';
  }

  scenarioType(slug: string): string {
    if (slug.includes('simulator')) return 'Incident-style lab';
    if (slug.includes('builder')) return 'Design exercise';
    if (slug.includes('challenge')) return 'Decision drill';
    return 'Interactive drill';
  }

  constructor() {
    this.seo.update({
      title: 'Games | Interactive Engineering Labs',
      description: 'Interactive Kubernetes security labs, Zero Trust simulations, threat-modeling challenges, API security games, and infrastructure engineering drills. Free and ad-free.',
      url: '/games',
      breadcrumbs: [
        { name: 'Home', url: '/' },
        { name: 'Interactive Engineering Labs', url: '/games' },
      ],
    });
  }
}
