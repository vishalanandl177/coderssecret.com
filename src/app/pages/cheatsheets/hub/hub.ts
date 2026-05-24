import { Component, inject } from '@angular/core';
import { SeoService } from '../../../services/seo.service';
import { Md3HeroComponent } from '../../../shared/md3/md3-hero';
import { Md3LinkPanelComponent } from '../../../shared/md3/md3-link-panel';
import { Md3ResourceCardComponent } from '../../../shared/md3/md3-resource-card';
import { Md3Hero, Md3LinkPanel, Md3ResourceCard } from '../../../shared/md3/md3.types';

interface Sheet {
  slug: string;
  name: string;
  description: string;
  topics: string[];
  status: 'available' | 'coming-soon';
  tier: 1 | 2 | 3;
  href: string | null;
}

@Component({
  selector: 'app-cheatsheets-hub',
  imports: [Md3HeroComponent, Md3ResourceCardComponent, Md3LinkPanelComponent],
  template: `
    <main class="md3-learning-page">
      <app-md3-hero [hero]="hero" />

      <section class="md3-learning-section">
        <div class="md3-learning-container">
          <div class="md3-learning-section-heading">
            <span class="md3-learning-eyebrow">Cloud native security</span>
            <h2>References for production infrastructure</h2>
            <p>Use these sheets when the decision has operational risk: identity, authorization, runtime defense, network paths, API authentication, and artifact trust.</p>
          </div>

          <div class="md3-learning-grid-3">
            @for (card of tier1Cards; track card.title) {
              <app-md3-resource-card [card]="card" />
            }
          </div>
        </div>
      </section>

      <section class="md3-learning-tonal-section">
        <div class="md3-learning-container">
          <div class="md3-learning-section-heading">
            <span class="md3-learning-eyebrow">Daily toolkit</span>
            <h2>Engineering essentials</h2>
            <p>Compact references for the commands engineers reach for repeatedly: containers, source control, query debugging, and Python runtime work.</p>
          </div>

          <div class="md3-learning-grid-4">
            @for (card of essentialsCards; track card.title) {
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
export class CheatsheetsHubComponent {
  private seo = inject(SeoService);

  get hero(): Md3Hero {
    return {
      breadcrumbs: [
        { label: 'Home', href: '/' },
        { label: 'Reference sheets' },
      ],
      eyebrow: 'Production reference',
      title: 'Reference sheets for shipping under pressure',
      lede: 'Command-first references for Kubernetes, security, APIs, Linux, DevSecOps, Docker, Git, SQL, and Python. Each sheet is written for real production work: what to run, when to use it, and what can go wrong.',
      actions: [
        { label: 'Open Kubernetes security', href: '/cheatsheets/kubernetes-security', variant: 'filled' },
        { label: 'Use with courses', href: '/courses', variant: 'tonal' },
      ],
      selectedChip: 'Kubernetes',
      chips: ['Kubernetes', 'Security', 'APIs', 'Linux', 'DevSecOps', 'Data/SQL'],
      panel: {
        title: 'Reference library',
        meta: `${this.allSheets.length} sheets`,
        ariaLabel: 'Reference library summary',
        mapLabels: ['FIND', 'VERIFY', 'RUN', 'SAVE'],
        stats: [
          { value: `${this.tier1Sheets.length}`, label: 'Production security sheets' },
          { value: `${this.essentialsSheets.length}`, label: 'Daily engineering sheets' },
        ],
      },
    };
  }

  tier1Sheets: Sheet[] = [
    {
      slug: 'kubernetes-security',
      name: 'Kubernetes Security',
      description: 'RBAC audit, PodSecurity standards, NetworkPolicy default-deny, secrets, image signing, runtime forensics, and security warnings for cluster changes.',
      topics: ['RBAC', 'PodSecurity', 'NetworkPolicy', 'Secrets', 'Sigstore', 'Audit'],
      status: 'available',
      tier: 1,
      href: '/cheatsheets/kubernetes-security',
    },
    {
      slug: 'kubernetes',
      name: 'Kubernetes kubectl',
      description: 'Core kubectl commands for pods, deployments, services, debugging, logs, configs, and secrets.',
      topics: ['kubectl', 'Pods', 'Deployments', 'Debugging'],
      status: 'available',
      tier: 1,
      href: '/cheatsheets/kubernetes',
    },
    {
      slug: 'spiffe-spire',
      name: 'SPIFFE & SPIRE',
      description: 'SPIFFE IDs, SVID issuance, SPIRE CLI commands, registration entries, federation, and workload attestation patterns.',
      topics: ['SPIFFE ID', 'SVID', 'SPIRE CLI', 'Federation'],
      status: 'available',
      tier: 1,
      href: '/cheatsheets/spiffe-spire',
    },
    {
      slug: 'opa-rego',
      name: 'OPA & Rego',
      description: 'Rego syntax, OPA policy patterns, Kubernetes admission examples, Gatekeeper constraints, and policy testing flows.',
      topics: ['Rego', 'Gatekeeper', 'Admission', 'Policy-as-Code'],
      status: 'available',
      tier: 1,
      href: '/cheatsheets/opa-rego',
    },
    {
      slug: 'api-security',
      name: 'API Security',
      description: 'JWT validation, OAuth2 flows, secure headers, mTLS, webhook signing, and OWASP API defenses.',
      topics: ['JWT', 'OAuth2', 'mTLS', 'Webhooks'],
      status: 'available',
      tier: 1,
      href: '/cheatsheets/api-security',
    },
    {
      slug: 'linux-networking',
      name: 'Linux Networking',
      description: 'iptables, nftables, tcpdump, OpenSSL, certificate debugging, eBPF tracing, and routing inspection.',
      topics: ['iptables', 'tcpdump', 'OpenSSL', 'eBPF'],
      status: 'available',
      tier: 1,
      href: '/cheatsheets/linux-networking',
    },
    {
      slug: 'runtime-security',
      name: 'Runtime Security',
      description: 'Falco rules, eBPF observability, Tetragon, syscall context, and production alert tuning patterns.',
      topics: ['Falco', 'eBPF', 'Tetragon', 'Syscalls'],
      status: 'available',
      tier: 2,
      href: '/cheatsheets/runtime-security',
    },
    {
      slug: 'service-mesh',
      name: 'Service Mesh',
      description: 'Istio traffic management, Envoy diagnostics, mTLS configuration, and AuthorizationPolicy examples.',
      topics: ['Istio', 'Envoy', 'mTLS', 'AuthZ'],
      status: 'available',
      tier: 2,
      href: '/cheatsheets/service-mesh',
    },
    {
      slug: 'devsecops',
      name: 'DevSecOps & Supply Chain',
      description: 'cosign, SBOMs, SLSA provenance, GitHub Actions hardening, and CI/CD gates for artifact trust.',
      topics: ['Sigstore', 'cosign', 'SBOM', 'SLSA'],
      status: 'available',
      tier: 2,
      href: '/cheatsheets/devsecops',
    },
  ];

  essentialsSheets: Sheet[] = [
    {
      slug: 'docker',
      name: 'Docker',
      description: 'Build, run, compose, volumes, networks, multi-stage builds, and container debugging commands.',
      topics: ['Build', 'Compose', 'Volumes', 'Debug'],
      status: 'available',
      tier: 2,
      href: '/cheatsheets/docker',
    },
    {
      slug: 'git',
      name: 'Git',
      description: 'Branch, merge, rebase, stash, reset, log, diff, cherry-pick, and recovery workflows.',
      topics: ['Rebase', 'Stash', 'Reset', 'Recovery'],
      status: 'available',
      tier: 2,
      href: '/cheatsheets/git',
    },
    {
      slug: 'sql',
      name: 'SQL',
      description: 'SELECT, JOIN, GROUP BY, window functions, CTEs, indexes, and query performance patterns.',
      topics: ['Joins', 'Windows', 'CTEs', 'Indexes'],
      status: 'available',
      tier: 2,
      href: '/cheatsheets/sql',
    },
    {
      slug: 'python',
      name: 'Python',
      description: 'Core syntax, list comprehensions, f-strings, decorators, OOP, file I/O, errors, and virtual environments.',
      topics: ['Idioms', 'OOP', 'venv', 'Errors'],
      status: 'available',
      tier: 3,
      href: '/cheatsheets/python',
    },
  ];

  get allSheets(): Sheet[] {
    return [...this.tier1Sheets, ...this.essentialsSheets];
  }

  get tier1Cards(): Md3ResourceCard[] {
    return this.tier1Sheets.map(sheet => this.sheetCard(sheet, true));
  }

  get essentialsCards(): Md3ResourceCard[] {
    return this.essentialsSheets.map(sheet => this.sheetCard(sheet, false));
  }

  linkPanel: Md3LinkPanel = {
    eyebrow: 'Practical use',
    title: 'Command lists are not enough',
    body: 'These sheets include production notes, security warnings, and hardened alternatives so the command is tied to a decision. Pair them with courses for depth and labs for practice.',
    links: [
      { label: 'Cloud native security course', href: '/courses/cloud-native-security-engineering' },
      { label: 'Kubernetes security lab', href: '/games/kubernetes-security-simulator' },
      { label: 'Engineering guides', href: '/blog' },
    ],
  };

  private sheetCard(sheet: Sheet, featured: boolean): Md3ResourceCard {
    return {
      title: sheet.name,
      description: sheet.description,
      href: sheet.href,
      icon: this.sheetIcon(sheet.slug),
      badge: featured ? 'Reference' : this.sheetGroup(sheet.slug),
      selectedBadge: featured,
      kicker: featured ? this.sheetGroup(sheet.slug) : undefined,
      chips: sheet.topics.slice(0, featured ? 4 : undefined),
      actionLabel: featured ? 'Open sheet' : undefined,
      ariaLabel: `Open ${sheet.name} reference sheet`,
    };
  }

  sheetIcon(slug: string): string {
    const labels: Record<string, string> = {
      'kubernetes-security': 'K8S',
      kubernetes: 'CTL',
      'spiffe-spire': 'ID',
      'opa-rego': 'OPA',
      'api-security': 'API',
      'linux-networking': 'NET',
      'runtime-security': 'IR',
      'service-mesh': 'MESH',
      devsecops: 'CI',
      docker: 'DOC',
      git: 'GIT',
      sql: 'SQL',
      python: 'PY',
    };
    return labels[slug] ?? 'REF';
  }

  sheetGroup(slug: string): string {
    if (['docker', 'git', 'python', 'sql'].includes(slug)) return 'Essentials';
    if (slug.includes('security') || slug === 'runtime-security') return 'Security';
    if (slug.includes('kubernetes') || slug.includes('spiffe') || slug.includes('mesh')) return 'Cloud native';
    return 'Reference';
  }

  constructor() {
    this.seo.update({
      title: 'Cheatsheets | Production Engineering Reference Sheets',
      description: 'Production-grade reference sheets for Kubernetes, SPIFFE/SPIRE, OPA/Rego, API security, runtime detection, service mesh, supply chain, Docker, Git, SQL, and Python.',
      url: '/cheatsheets',
      breadcrumbs: [
        { name: 'Home', url: '/' },
        { name: 'Reference Sheets', url: '/cheatsheets' },
      ],
    });
  }
}
