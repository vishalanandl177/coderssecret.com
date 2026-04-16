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
              <p class="mt-0 mb-2 text-muted-foreground text-sm">Founder & Author</p>
              <div class="flex gap-3 text-sm">
                <a href="https://linkedin.com/in/vishal-techlead" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                <a href="https://instagram.com/vis_naz" target="_blank" rel="noopener noreferrer">Instagram</a>
                <a href="https://github.com/vishalanandl177" target="_blank" rel="noopener noreferrer">GitHub</a>
              </div>
            </div>
          </div>

          <h2>Who Writes This Blog?</h2>
          <p>CodersSecret is written by <strong>Vishal Anand</strong> — a software engineer and tech lead with experience building production systems at scale. The blog covers topics I've learned from building real software: backend architecture, DevOps, security, Kubernetes, and Python.</p>

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
      title: 'About CodersSecret — Vishal Anand',
      description: 'CodersSecret is a technical blog by Vishal Anand covering Python, Kubernetes, security, and system design with battle-tested, production-grade tutorials.',
      url: '/about',
      breadcrumbs: [
        { name: 'Home', url: '/' },
        { name: 'About', url: '/about' },
      ],
    });
  }
}
