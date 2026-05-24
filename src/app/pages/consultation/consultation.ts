import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../services/seo.service';
import { Md3HeroComponent } from '../../shared/md3/md3-hero';
import { Md3LinkPanelComponent } from '../../shared/md3/md3-link-panel';
import { Md3ResourceCardComponent } from '../../shared/md3/md3-resource-card';
import { Md3Hero, Md3LinkPanel, Md3ResourceCard } from '../../shared/md3/md3.types';

interface ExpertiseArea {
  title: string;
  description: string;
  icon: string;
}

interface EngagementType {
  title: string;
  description: string;
}

interface FaqItem {
  question: string;
  answer: string;
}

@Component({
  selector: 'app-consultation',
  imports: [RouterLink, Md3HeroComponent, Md3ResourceCardComponent, Md3LinkPanelComponent],
  template: `
    <main class="md3-learning-page">
      <app-md3-hero [hero]="hero" />

      <section class="md3-learning-section">
        <div class="md3-learning-container">
          <div class="md3-learning-section-heading centered">
            <span class="md3-learning-eyebrow">Expertise</span>
            <h2>Problems I can help untangle</h2>
            <p>These are the areas where CodersSecret already has deep public learning material and where consulting work can move quickly.</p>
          </div>

          <div class="md3-learning-grid-3">
            @for (card of expertiseCards; track card.title) {
              <app-md3-resource-card [card]="card" />
            }
          </div>
        </div>
      </section>

      <section class="md3-learning-tonal-section">
        <div class="md3-learning-container">
          <div class="md3-learning-section-heading">
            <span class="md3-learning-eyebrow">Engagement types</span>
            <h2>Focused help, not generic advice</h2>
            <p>Sessions are shaped around the system you are actually building or operating.</p>
          </div>

          <div class="md3-learning-grid-3">
            @for (card of engagementCards; track card.title) {
              <app-md3-resource-card [card]="card" />
            }
          </div>
        </div>
      </section>

      <section class="md3-learning-section">
        <div class="md3-learning-container">
          <app-md3-link-panel [panel]="proofPanel" />
        </div>
      </section>

      <section class="md3-learning-tonal-section">
        <div class="md3-learning-container">
          <div class="md3-learning-panel text-center">
            <span class="md3-learning-eyebrow">Start here</span>
            <h2>Send the problem, architecture, or decision you are stuck on</h2>
            <p class="mx-auto max-w-2xl">
              Share the context, constraints, stack, and what you have already tried. I will review it privately and respond with next steps or a session invite.
            </p>
            <div class="md3-learning-actions justify-center">
              <a [href]="consultationFormUrl" target="_blank" rel="noopener noreferrer" class="md3-button-filled md3-button-large">Submit your challenge</a>
              <a routerLink="/blog" class="md3-button-outlined md3-button-large">Browse public guides first</a>
            </div>
            <p class="text-sm text-muted-foreground">Your information is private. NDAs are fine when company context requires one.</p>
          </div>
        </div>
      </section>

      <section class="md3-learning-section">
        <div class="md3-learning-container-narrow">
          <div class="md3-learning-section-heading centered">
            <span class="md3-learning-eyebrow">FAQ</span>
            <h2>Common questions</h2>
          </div>
          <div class="md3-learning-grid">
            @for (item of faqItems; track item.question) {
              <article class="md3-learning-card">
                <h3>{{ item.question }}</h3>
                <p>{{ item.answer }}</p>
              </article>
            }
          </div>
        </div>
      </section>
    </main>
  `,
})
export class ConsultationComponent {
  private seo = inject(SeoService);
  readonly consultationFormUrl = 'https://forms.gle/C37TKC9b1zdPH2nL8';

  get hero(): Md3Hero {
    return {
      breadcrumbs: [
        { label: 'Home', href: '/' },
        { label: 'Consultation' },
      ],
      eyebrow: 'Production engineering consulting',
      title: 'Architecture, Security, and Production Engineering Consulting',
      lede: 'Practical help for teams working through cloud-native security, SPIFFE/SPIRE, Kubernetes hardening, AI infrastructure, RAG, data engineering, and production readiness.',
      actions: [
        { label: 'Submit your challenge', href: this.consultationFormUrl, variant: 'filled', external: true },
        { label: 'Why CodersSecret', href: '/about', variant: 'tonal' },
      ],
      selectedChip: 'Architecture review',
      chips: ['Architecture review', 'Security design', 'Production readiness', 'Team enablement'],
      panel: {
        title: 'How it works',
        meta: 'Private by default',
        ariaLabel: 'Engagement summary',
        mapLabels: ['ASK', 'MAP', 'FIX'],
        stats: [
          { value: '24-48h', label: 'Typical response' },
          { value: '1:1', label: 'Focused session' },
        ],
      },
    };
  }

  expertiseAreas: ExpertiseArea[] = [
    { title: 'Cloud-native security', icon: 'SEC', description: 'Threat modeling, service boundaries, admission controls, runtime detection, and guardrails for Kubernetes-based platforms.' },
    { title: 'SPIFFE/SPIRE and Zero Trust', icon: 'ID', description: 'Workload identity, mTLS, trust-domain federation, policy enforcement, and migration away from shared secrets.' },
    { title: 'Kubernetes hardening', icon: 'K8S', description: 'RBAC, PodSecurity, NetworkPolicy, image provenance, incident drills, and operating models for production clusters.' },
    { title: 'AI infrastructure and RAG', icon: 'AI', description: 'Production RAG architecture, evaluation, agent/tool permissions, MCP security, and inference reliability.' },
    { title: 'Data and analytics engineering', icon: 'SQL', description: 'dbt modeling, data contracts, semantic layers, lineage, metric trust, and warehouse architecture.' },
    { title: 'Team enablement', icon: 'TEAM', description: 'Architecture reviews, production readiness checklists, debugging workflows, and internal engineering training.' },
  ];

  get expertiseCards(): Md3ResourceCard[] {
    return this.expertiseAreas.map(area => ({
      title: area.title,
      description: area.description,
      icon: area.icon,
      badge: 'Expertise',
    }));
  }

  engagementTypes: EngagementType[] = [
    { title: 'Architecture review', description: 'Walk through diagrams, trust boundaries, service contracts, data flows, and failure paths before the system scales.' },
    { title: 'Security design session', description: 'Review identity, authorization, secrets, deployment gates, runtime signals, and response paths against realistic attack scenarios.' },
    { title: 'Production readiness review', description: 'Turn a launch, migration, or incident-prone system into a checklist of concrete engineering decisions and ownership gaps.' },
  ];

  get engagementCards(): Md3ResourceCard[] {
    return this.engagementTypes.map((engagement, index) => ({
      title: engagement.title,
      description: engagement.description,
      icon: `0${index + 1}`,
      badge: 'Private',
    }));
  }

  proofPanel: Md3LinkPanel = {
    eyebrow: 'Relevant proof',
    title: 'Public material before a private session',
    body: 'CodersSecret already contains courses, labs, and reference sheets around the same production engineering topics. That gives us a shared vocabulary before we work through your specific architecture or incident.',
    links: [
      { label: 'Cloud native security course', href: '/courses/cloud-native-security-engineering' },
      { label: 'Production RAG systems', href: '/courses/production-rag-systems-engineering' },
      { label: 'Interactive labs', href: '/games' },
      { label: 'Reference sheets', href: '/cheatsheets' },
    ],
  };

  faqItems: FaqItem[] = [
    { question: 'Is my question kept private?', answer: 'Yes. Form submissions and session details are handled privately and are never used as public content without explicit permission.' },
    { question: 'How quickly will you respond?', answer: 'I usually review submissions within 24-48 hours and reply with initial thoughts, questions, or a session invite.' },
    { question: 'What does a session look like?', answer: 'We work through the real system together: architecture, code, deployment flow, diagrams, runbooks, or the decision that needs a second technical opinion.' },
    { question: 'Can you help with my specific stack?', answer: 'My strongest areas are Python/Django, Kubernetes, PostgreSQL, AWS/GCP-style cloud architecture, and AI infrastructure. For other stacks, the architecture and security principles still transfer.' },
    { question: 'Do you sign NDAs?', answer: 'Yes. If your company requires an NDA before discussing proprietary architecture or implementation details, that is fine.' },
  ];

  constructor() {
    this.seo.update({
      title: 'Consulting | Architecture, Security, and Production Engineering',
      description: 'Consulting for cloud-native security, SPIFFE/SPIRE, Zero Trust, Kubernetes hardening, AI infrastructure, RAG, data engineering, and team enablement.',
      url: '/consultation',
      breadcrumbs: [
        { name: 'Home', url: '/' },
        { name: 'Consultation', url: '/consultation' },
      ],
    });
  }
}
