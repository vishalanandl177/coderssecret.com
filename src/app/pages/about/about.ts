import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../services/seo.service';
import { BLOG_POSTS, CATEGORIES } from '../../models/blog-post.model';

@Component({
  selector: 'app-about',
  imports: [RouterLink],
  template: `
    <section class="py-16 md:py-20 animate-in fade-in duration-500">
      <div class="container max-w-3xl mx-auto px-6">
        <nav aria-label="Breadcrumb" class="mb-6">
          <ol class="flex items-center gap-1.5 text-sm text-muted-foreground">
            <li><a routerLink="/" class="hover:text-foreground transition-colors">Home</a></li>
            <li class="text-muted-foreground/50">/</li>
            <li class="text-foreground font-medium" aria-current="page">About</li>
          </ol>
        </nav>

        <h1 class="text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.1] mb-10">About CodersSecret</h1>

        <div class="prose prose-neutral max-w-none
                    [&>h2]:text-2xl [&>h2]:font-extrabold [&>h2]:tracking-tight [&>h2]:mt-10 [&>h2]:mb-4 [&>h2]:text-foreground
                    [&>p]:text-foreground [&>p]:leading-[1.8] [&>p]:mb-6 [&>p]:text-[15px]
                    [&>ul]:text-foreground [&>ul]:mb-6 [&>ul]:ml-6 [&>ul]:list-disc [&>ul>li]:mb-2 [&>ul>li]:leading-[1.7]
                    [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4 [&_a:hover]:text-primary/80">

          <div class="flex items-center gap-5 mb-10 p-6 rounded-2xl border border-border bg-card">
            <div class="flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 text-white text-3xl font-bold flex-shrink-0">
              V
            </div>
            <div>
              <h2 class="mt-0 mb-1">Vishal Anand</h2>
              <p class="mt-0 mb-2 text-muted-foreground text-sm">Senior Product Engineer & Tech Lead</p>
              <div class="flex gap-3 text-sm">
                <a href="https://linkedin.com/in/vishal-techlead" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                <a href="https://instagram.com/vis_naz" target="_blank" rel="noopener noreferrer">Instagram</a>
                <a href="https://github.com/vishalanandl177" target="_blank" rel="noopener noreferrer">GitHub</a>
              </div>
            </div>
          </div>

          <h2>Who Writes This Blog?</h2>
          <p>CodersSecret is written by <strong>Vishal Anand</strong> — a Senior Product Engineer and Tech Lead with experience building production systems at scale. The blog covers topics I've learned from building real software: backend architecture, DevOps, security, Kubernetes, and Python.</p>

          <h2>Why This Blog Exists</h2>
          <p>Most technical tutorials are either too theoretical (textbook explanations that don't help in practice) or too shallow (5-minute introductions that don't cover edge cases). CodersSecret fills the gap with <strong>battle-tested, production-grade tutorials</strong> written from hands-on experience — the kind of knowledge you normally only get from years on the job.</p>

          <h2>What Makes This Blog Different</h2>
          <ul>
            <li><strong>Practical, not theoretical:</strong> Every tutorial includes real code you can run. No abstract Shape/Animal examples — real APIs, real databases, real deployments.</li>
            <li><strong>Interactive diagrams:</strong> Complex topics like SSO flows, Kubernetes networking, and CPU architecture are illustrated with animated, hoverable diagrams — not static images.</li>
            <li><strong>Honest about trade-offs:</strong> We don't just show you the happy path. Every post covers limitations, when NOT to use a technology, and real production gotchas.</li>
            <li><strong>Deep, not shallow:</strong> Posts average 2,000-4,000 words with multiple code examples, benchmarks, and comparison tables. No fluff, no padding.</li>
          </ul>

          <h2>Topics We Cover</h2>
          <ul>
            <li><strong>Backend Engineering:</strong> Python, Django, APIs (REST, gRPC, Thrift), databases, data formats (Arrow, Parquet)</li>
            <li><strong>DevOps & Infrastructure:</strong> Kubernetes, Docker, Karpenter, cron jobs, CI/CD, networking</li>
            <li><strong>Security:</strong> Ethical hacking, mTLS, encryption, API security, compliance (HIPAA, SOC 2, GDPR)</li>
            <li><strong>System Design:</strong> SOLID principles, separation of concerns, compression algorithms, CPU architecture</li>
            <li><strong>AI & ML:</strong> Running LLMs locally, MCP servers, RAG, function calling, autonomous agents</li>
            <li><strong>Frontend:</strong> Angular, Tailwind CSS, performance optimization</li>
          </ul>

          <h2>By the Numbers</h2>
          <ul>
            <li><strong>{{ totalPosts }}</strong> in-depth articles published</li>
            <li><strong>{{ totalCategories }}</strong> topic categories</li>
            <li><strong>{{ totalTags }}</strong> unique topics covered</li>
            <li>Average article length: <strong>2,500+ words</strong></li>
            <li>Built with Angular 21, Tailwind CSS 4, hosted on GitHub Pages</li>
          </ul>

          <h2>Open Source Impact</h2>
          <p>I'm the creator of <a href="https://github.com/vishalanandl177/DRF-API-Logger" target="_blank" rel="noopener noreferrer"><strong>DRF API Logger</strong></a> — an open-source Django package with <strong>1.6M+ downloads on PyPI</strong>, used by enterprise teams worldwide for production API observability. It's actively maintained and battle-tested across thousands of production deployments.</p>
          <p>This isn't just a tutorial site — it's content backed by real OSS contributions, real production scars, and real engineering ownership.</p>

          <h2>Free Courses I've Created</h2>
          <div class="not-prose rounded-2xl border border-border bg-card p-6 mb-8">
            <div class="flex flex-wrap gap-2 mb-3">
              <span class="rounded-full bg-green-500/10 border border-green-500/30 px-2.5 py-0.5 text-xs font-bold text-green-500">100% FREE</span>
              <span class="rounded-full bg-primary/10 border border-primary/30 px-2.5 py-0.5 text-xs font-semibold text-primary">13 Modules</span>
              <span class="rounded-full bg-cyan-500/10 border border-cyan-500/30 px-2.5 py-0.5 text-xs font-semibold text-cyan-500">30+ Hands-On Labs</span>
            </div>
            <h3 class="text-xl font-bold mb-2">Mastering SPIFFE & SPIRE: Zero Trust for Cloud Native Systems</h3>
            <p class="text-sm text-muted-foreground mb-4">The most comprehensive free course on workload identity. Production-focused — not just theory. Deploy SPIRE on Kubernetes, configure mTLS with Envoy, enforce OPA policies, federate clusters, and secure AI infrastructure.</p>
            <div class="flex flex-wrap gap-3">
              <a routerLink="/courses/mastering-spiffe-spire"
                 class="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold !text-primary-foreground !no-underline shadow hover:shadow-lg transition-all">
                View Course
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </a>
              <a href="https://github.com/vishalanandl177/mastering-spiffe-spire" target="_blank" rel="noopener noreferrer"
                 class="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold !text-foreground !no-underline hover:bg-accent transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                Course Labs on GitHub
              </a>
            </div>
          </div>
          <p>Why I created this: SPIFFE/SPIRE has weak educational content online. Most tutorials are theoretical. This course is built from real production deployment experience — the kind of knowledge that takes engineers 6 months to learn the hard way. I'm giving it away free because <strong>workload identity is the future of cloud-native security</strong>, and the more engineers who understand it, the safer our systems become.</p>

          <h2>Why I Teach</h2>
          <p>I've spent years building production systems at scale and contributing to open source. I've seen the gap between "tutorial knowledge" and "production knowledge" — and I want to close it. Free courses, free labs on GitHub, no paywalls, no upsells. The goal: <strong>turn tutorial readers into the engineers who secure, scale, and ship real infrastructure</strong>.</p>

          <h2>Open Source</h2>
          <p>This entire blog is open source. The code, content, and infrastructure are all visible on <a href="https://github.com/vishalanandl177/coderssecret.com" target="_blank" rel="noopener noreferrer">GitHub</a>. Pull requests, issues, and suggestions are welcome.</p>

          <h2>Contact</h2>
          <p>Have a question, suggestion, or collaboration idea? Reach out via <a href="https://linkedin.com/in/vishal-techlead" target="_blank" rel="noopener noreferrer">LinkedIn</a> or <a href="https://instagram.com/vis_naz" target="_blank" rel="noopener noreferrer">Instagram</a>. For technical discussions, use the <a href="https://github.com/vishalanandl177/coderssecret.com/discussions" target="_blank" rel="noopener noreferrer">GitHub Discussions</a> on the repo.</p>

        </div>
      </div>
    </section>
  `,
})
export class AboutComponent {
  private seo = inject(SeoService);
  totalPosts = BLOG_POSTS.length;
  totalCategories = CATEGORIES.filter(c => c.slug).length;
  totalTags = new Set(BLOG_POSTS.flatMap(p => p.tags)).size;

  constructor() {
    this.seo.update({
      title: 'About — Vishal Anand | Creator of DRF API Logger (1.6M+ downloads)',
      description: 'Vishal Anand — Senior Product Engineer, creator of DRF API Logger (1.6M+ PyPI downloads), and instructor of the free Mastering SPIFFE & SPIRE course. Production-focused engineering education, no paywalls.',
      url: '/about',
      breadcrumbs: [
        { name: 'Home', url: '/' },
        { name: 'About', url: '/about' },
      ],
    });
  }
}
