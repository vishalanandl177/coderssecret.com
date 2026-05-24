import { Component, inject } from '@angular/core';
import { SeoService } from '../../services/seo.service';
import { BLOG_POSTS, CATEGORIES } from '../../models/blog-post.model';
import { EXTERNAL_LINKS } from '../../shared/external-links';
import { Md3HeroComponent } from '../../shared/md3/md3-hero';
import { Md3LinkPanelComponent } from '../../shared/md3/md3-link-panel';
import { Md3ResourceCardComponent } from '../../shared/md3/md3-resource-card';
import { Md3Hero, Md3LinkPanel, Md3ResourceCard } from '../../shared/md3/md3.types';

interface FocusArea {
  label: string;
  description: string;
}

interface TrustSignal {
  value: string;
  label: string;
}

@Component({
  selector: 'app-about',
  imports: [Md3HeroComponent, Md3ResourceCardComponent, Md3LinkPanelComponent],
  template: `
    <main class="md3-learning-page">
      <app-md3-hero [hero]="hero" />

      <section class="md3-learning-section">
        <div class="md3-learning-container">
          <div class="md3-learning-profile-card">
            <div class="md3-learning-card-top">
              <div class="flex items-center gap-4">
                <span class="md3-learning-avatar" aria-hidden="true">V</span>
                <div>
                  <span class="md3-learning-eyebrow">Written by</span>
                  <h2>Vishal Anand</h2>
                  <p>Senior Product Engineer and Tech Lead</p>
                </div>
              </div>
            </div>
            <p>
              I write from hands-on production experience: backend architecture, DevOps, Kubernetes, security, AI infrastructure, data engineering, and Python.
              CodersSecret exists to close the gap between short tutorials and the judgment engineers need when real systems fail.
            </p>
            <div class="md3-learning-chip-row">
              <a [href]="links.linkedin" target="_blank" rel="noopener noreferrer" class="md3-chip">LinkedIn</a>
              <a [href]="links.instagram" target="_blank" rel="noopener noreferrer" class="md3-chip">Instagram</a>
              <a [href]="links.youtube" target="_blank" rel="noopener noreferrer" class="md3-chip">YouTube</a>
              <a [href]="links.spotifyPodcast" target="_blank" rel="noopener noreferrer" class="md3-chip">Spotify</a>
              <a href="https://github.com/vishalanandl177" target="_blank" rel="noopener noreferrer" class="md3-chip">GitHub</a>
            </div>
          </div>
        </div>
      </section>

      <section class="md3-learning-tonal-section">
        <div class="md3-learning-container">
          <div class="md3-learning-section-heading">
            <span class="md3-learning-eyebrow">What makes it different</span>
            <h2>Built around production judgment</h2>
            <p>Each guide is designed to help engineers understand the decision, the failure mode, and the operational trade-off, not just copy the happy path.</p>
          </div>

          <div class="md3-learning-grid-4">
            @for (card of focusCards; track card.title) {
              <app-md3-resource-card [card]="card" />
            }
          </div>
        </div>
      </section>

      <section class="md3-learning-section">
        <div class="md3-learning-container">
          <div class="md3-learning-grid-3">
            @for (card of proofCards; track card.title) {
              <app-md3-resource-card [card]="card" />
            }
          </div>
        </div>
      </section>

      <section class="md3-learning-tonal-section">
        <div class="md3-learning-container">
          <app-md3-link-panel [panel]="contactPanel" />
        </div>
      </section>
    </main>
  `,
})
export class AboutComponent {
  private seo = inject(SeoService);
  links = EXTERNAL_LINKS;
  totalPosts = BLOG_POSTS.length;
  totalCategories = CATEGORIES.filter(c => c.slug).length;
  totalTags = new Set(BLOG_POSTS.flatMap(p => p.tags)).size;

  trustSignals: TrustSignal[] = [
    { value: `${this.totalPosts}`, label: 'In-depth guides' },
    { value: `${this.totalCategories}`, label: 'Categories' },
    { value: `${this.totalTags}`, label: 'Topics' },
    { value: '1.6M+', label: 'OSS downloads' },
  ];

  get hero(): Md3Hero {
    return {
      breadcrumbs: [
        { label: 'Home', href: '/' },
        { label: 'About' },
      ],
      eyebrow: 'CodersSecret knowledge base',
      title: 'Practical engineering notes for people who own production',
      lede: 'CodersSecret is written by Vishal Anand for engineers building secure, observable, and reliable production systems. The site turns real backend, security, DevOps, AI infrastructure, data, and distributed-systems work into guides, courses, labs, and references.',
      actions: [
        { label: 'Read engineering guides', href: '/blog', variant: 'filled' },
        { label: 'Work together', href: '/consultation', variant: 'tonal' },
      ],
      selectedChip: 'Security',
      chips: ['Security', 'AI infrastructure', 'Data engineering', 'Distributed systems', 'DevOps'],
      panel: {
        title: 'Site snapshot',
        meta: 'Free and ad-free',
        ariaLabel: 'CodersSecret metrics',
        mapLabels: ['OSS', 'LAB', 'SHIP', 'DOC'],
        stats: this.trustSignals,
      },
    };
  }

  focusAreas: FocusArea[] = [
    { label: 'Security', description: 'Cloud-native controls, Zero Trust, workload identity, API security, runtime detection, and supply-chain defense.' },
    { label: 'AI infrastructure', description: 'Production RAG, AI agents, MCP security, inference reliability, evaluation, and operational guardrails.' },
    { label: 'Data engineering', description: 'dbt, semantic layers, lineage, data quality, metrics trust, and analytics engineering workflows.' },
    { label: 'Distributed systems', description: 'Consensus, caching, rate limiting, schedulers, failure modes, and production architecture trade-offs.' },
    { label: 'DevOps', description: 'Kubernetes operations, CI/CD, observability, incident response, deployment patterns, and platform reliability.' },
    { label: 'Backend engineering', description: 'APIs, Python, Django, databases, authentication, performance, and maintainable service design.' },
  ];

  get focusCards(): Md3ResourceCard[] {
    return this.focusAreas.map(area => ({
      title: area.label,
      description: area.description,
      icon: this.focusIcon(area.label),
      badge: 'Focus',
    }));
  }

  get proofCards(): Md3ResourceCard[] {
    return [
      {
        title: 'DRF API Logger',
        description: 'I created DRF API Logger, an open-source Django package with 1.6M+ PyPI downloads for production API observability. That operating context shapes the site: practical examples, honest trade-offs, and details that matter in production.',
        href: 'https://github.com/vishalanandl177/DRF-API-Logger',
        external: true,
        badge: 'Open source',
        actionLabel: 'View project',
      },
      {
        title: 'Structured learning paths',
        description: 'Free courses cover SPIFFE/SPIRE, cloud-native security, production RAG, distributed systems, and analytics engineering. Labs and slides stay inside the site so learners can move from concept to practice quickly.',
        href: '/courses',
        badge: 'Free courses',
        actionLabel: 'Open course hub',
      },
      {
        title: 'Tutorials and podcast',
        description: 'The same production engineering topics appear as YouTube tutorials and Spotify podcast episodes for visual walkthroughs and screen-free learning.',
        href: this.links.spotifyPodcast,
        external: true,
        badge: 'Audio and video',
        actionLabel: 'Listen on Spotify',
      },
    ];
  }

  contactPanel: Md3LinkPanel = {
    eyebrow: 'Contact',
    title: 'Questions, corrections, or collaboration ideas?',
    body: 'Use GitHub Discussions for technical notes, connect through social channels, or use the consultation page for architecture, security, and production engineering help.',
    links: [
      { label: 'Architecture consulting', href: '/consultation' },
      { label: 'GitHub Discussions', href: 'https://github.com/vishalanandl177/coderssecret.com/discussions', external: true },
      { label: 'Latest guides', href: '/blog' },
    ],
  };

  focusIcon(label: string): string {
    const icons: Record<string, string> = {
      Security: 'SEC',
      'AI infrastructure': 'AI',
      'Data engineering': 'DATA',
      'Distributed systems': 'SYS',
      DevOps: 'OPS',
      'Backend engineering': 'API',
    };
    return icons[label] ?? 'CS';
  }

  constructor() {
    this.seo.update({
      title: 'About | Vishal Anand and CodersSecret',
      description: 'CodersSecret is a practical engineering knowledge base by Vishal Anand, covering backend architecture, DevOps, Kubernetes, security, AI infrastructure, data engineering, and production systems.',
      url: '/about',
      breadcrumbs: [
        { name: 'Home', url: '/' },
        { name: 'About', url: '/about' },
      ],
    });
  }
}
