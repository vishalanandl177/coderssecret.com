import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-consultation',
  imports: [RouterLink],
  template: `
    <section class="py-16 md:py-24 animate-in fade-in duration-500">
      <div class="container max-w-4xl mx-auto px-6">

        <!-- Breadcrumb -->
        <nav aria-label="Breadcrumb" class="mb-8">
          <ol class="flex items-center gap-1.5 text-sm text-muted-foreground">
            <li><a routerLink="/" class="hover:text-foreground transition-colors">Home</a></li>
            <li class="text-muted-foreground/50">/</li>
            <li class="text-foreground font-medium">Consultation</li>
          </ol>
        </nav>

        <!-- Hero -->
        <div class="text-center mb-16">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          </div>
          <h1 class="text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.1] mb-4">
            Need Expert Help?
          </h1>
          <p class="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Stuck on a system design problem, performance bottleneck, or scaling decision?
            Get private, 1-on-1 guidance from a Senior Product Engineer with hands-on production experience.
          </p>
        </div>

        <!-- How it works -->
        <div class="mb-16">
          <h2 class="text-2xl font-extrabold tracking-tight text-center mb-8">How It Works</h2>
          <div class="grid md:grid-cols-3 gap-6">
            <div class="rounded-2xl border border-border/60 bg-card p-6 text-center hover:border-primary/40 transition-all hover:-translate-y-1">
              <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary font-mono font-bold text-lg mb-4">01</div>
              <h3 class="font-bold mb-2">Describe Your Challenge</h3>
              <p class="text-sm text-muted-foreground leading-relaxed">Fill out a short private form with your technical problem, context, and what you have tried so far.</p>
            </div>
            <div class="rounded-2xl border border-border/60 bg-card p-6 text-center hover:border-primary/40 transition-all hover:-translate-y-1">
              <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary font-mono font-bold text-lg mb-4">02</div>
              <h3 class="font-bold mb-2">I Review & Respond</h3>
              <p class="text-sm text-muted-foreground leading-relaxed">I read your submission privately and reply via email with initial thoughts, questions, or a session invite.</p>
            </div>
            <div class="rounded-2xl border border-border/60 bg-card p-6 text-center hover:border-primary/40 transition-all hover:-translate-y-1">
              <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary font-mono font-bold text-lg mb-4">03</div>
              <h3 class="font-bold mb-2">Private 1-on-1 Session</h3>
              <p class="text-sm text-muted-foreground leading-relaxed">We hop on a private call to solve your problem together. Everything discussed stays between us.</p>
            </div>
          </div>
        </div>

        <!-- Expertise areas -->
        <div class="mb-16">
          <h2 class="text-2xl font-extrabold tracking-tight text-center mb-8">What I Can Help With</h2>
          <div class="grid sm:grid-cols-2 gap-4">
            <div class="flex gap-4 items-start rounded-xl border border-border/60 bg-card p-5 hover:border-primary/40 transition-colors">
              <span class="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-blue-500/10 text-blue-500 flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
              </span>
              <div>
                <h3 class="font-semibold mb-1">System Design & Architecture</h3>
                <p class="text-sm text-muted-foreground">Microservices vs monolith, database selection, API design, multi-tenant architecture, event-driven systems.</p>
              </div>
            </div>
            <div class="flex gap-4 items-start rounded-xl border border-border/60 bg-card p-5 hover:border-primary/40 transition-colors">
              <span class="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-orange-500/10 text-orange-500 flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
              </span>
              <div>
                <h3 class="font-semibold mb-1">Performance Optimization</h3>
                <p class="text-sm text-muted-foreground">Database query tuning, caching strategies, Python/Django performance, API latency reduction, profiling.</p>
              </div>
            </div>
            <div class="flex gap-4 items-start rounded-xl border border-border/60 bg-card p-5 hover:border-primary/40 transition-colors">
              <span class="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-green-500/10 text-green-500 flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
              </span>
              <div>
                <h3 class="font-semibold mb-1">Scaling & Infrastructure</h3>
                <p class="text-sm text-muted-foreground">Kubernetes, Docker, CI/CD pipelines, auto-scaling, load balancing, cloud cost optimization.</p>
              </div>
            </div>
            <div class="flex gap-4 items-start rounded-xl border border-border/60 bg-card p-5 hover:border-primary/40 transition-colors">
              <span class="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-red-500/10 text-red-500 flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              </span>
              <div>
                <h3 class="font-semibold mb-1">Security & Authentication</h3>
                <p class="text-sm text-muted-foreground">mTLS, OAuth/OIDC, API security, SPIFFE/SPIRE, encryption, compliance (SOC2, HIPAA, GDPR).</p>
              </div>
            </div>
            <div class="flex gap-4 items-start rounded-xl border border-border/60 bg-card p-5 hover:border-primary/40 transition-colors">
              <span class="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-purple-500/10 text-purple-500 flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
              </span>
              <div>
                <h3 class="font-semibold mb-1">AI Integration</h3>
                <p class="text-sm text-muted-foreground">Claude API, LLM integration, RAG pipelines, MCP servers, AI-powered features in production apps.</p>
              </div>
            </div>
            <div class="flex gap-4 items-start rounded-xl border border-border/60 bg-card p-5 hover:border-primary/40 transition-colors">
              <span class="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-cyan-500/10 text-cyan-500 flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              </span>
              <div>
                <h3 class="font-semibold mb-1">Code Review & Best Practices</h3>
                <p class="text-sm text-muted-foreground">Django/DRF, Python patterns, API design review, database schema review, tech debt reduction.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- CTA -->
        <div class="rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/5 via-card to-primary/5 p-8 md:p-12 text-center mb-16">
          <h2 class="text-2xl md:text-3xl font-extrabold tracking-tight mb-3">Ready to Get Started?</h2>
          <p class="text-muted-foreground mb-8 max-w-xl mx-auto">
            Fill out the form below to describe your challenge. I will review it privately and get back to you within 24-48 hours.
          </p>
          <a href="https://forms.gle/YOUR_FORM_ID_HERE" target="_blank" rel="noopener noreferrer"
             class="group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 px-8 py-4 text-base font-bold text-white shadow-xl shadow-purple-500/25 hover:shadow-2xl hover:shadow-purple-500/40 hover:-translate-y-0.5 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            Submit Your Challenge
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                 class="transition-transform group-hover:translate-x-1"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </a>
          <p class="text-xs text-muted-foreground mt-4">100% private. Your information is never shared publicly.</p>
        </div>

        <!-- FAQ -->
        <div>
          <h2 class="text-2xl font-extrabold tracking-tight text-center mb-8">Frequently Asked Questions</h2>
          <div class="space-y-4 max-w-2xl mx-auto">
            <div class="rounded-xl border border-border/60 bg-card p-5">
              <h3 class="font-semibold mb-2">Is my question kept private?</h3>
              <p class="text-sm text-muted-foreground leading-relaxed">Yes. Your form submission goes directly to my email. The problem description, code, architecture details, and our conversation are never shared publicly.</p>
            </div>
            <div class="rounded-xl border border-border/60 bg-card p-5">
              <h3 class="font-semibold mb-2">How quickly will you respond?</h3>
              <p class="text-sm text-muted-foreground leading-relaxed">I review submissions daily and typically respond within 24-48 hours with initial thoughts and next steps.</p>
            </div>
            <div class="rounded-xl border border-border/60 bg-card p-5">
              <h3 class="font-semibold mb-2">What does a session look like?</h3>
              <p class="text-sm text-muted-foreground leading-relaxed">After reviewing your challenge, we hop on a private video call (Google Meet or Zoom). I come prepared with research on your problem. We work through the solution together &mdash; whiteboarding, code review, architecture diagrams, whatever helps.</p>
            </div>
            <div class="rounded-xl border border-border/60 bg-card p-5">
              <h3 class="font-semibold mb-2">Can you help with my specific stack?</h3>
              <p class="text-sm text-muted-foreground leading-relaxed">My strongest areas are Python/Django, Kubernetes, PostgreSQL, cloud architecture (AWS/GCP), and AI integration. For other stacks, I can still help with architecture and system design &mdash; the principles are universal.</p>
            </div>
            <div class="rounded-xl border border-border/60 bg-card p-5">
              <h3 class="font-semibold mb-2">Do you sign NDAs?</h3>
              <p class="text-sm text-muted-foreground leading-relaxed">Yes. If your company requires an NDA before discussing proprietary architecture, I am happy to sign one.</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  `,
})
export class ConsultationComponent {
  private seo = inject(SeoService);

  constructor() {
    this.seo.update({
      title: '1-on-1 Technical Consultation — System Design, Performance, Scaling',
      description: 'Get private, expert help with system design, performance optimization, scaling architecture, security, and AI integration from a Senior Product Engineer. Submit your challenge and get a response within 48 hours.',
      url: '/consultation',
      breadcrumbs: [
        { name: 'Home', url: '/' },
        { name: 'Consultation', url: '/consultation' },
      ],
    });
  }
}
