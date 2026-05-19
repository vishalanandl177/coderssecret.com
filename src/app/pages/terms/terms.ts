import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-terms',
  imports: [RouterLink],
  template: `
    <section class="py-16 md:py-20 animate-in fade-in duration-500">
      <div class="container max-w-3xl mx-auto px-6">
        <nav aria-label="Breadcrumb" class="mb-6">
          <ol class="flex items-center gap-1.5 text-sm text-muted-foreground">
            <li><a routerLink="/" class="hover:text-foreground transition-colors">Home</a></li>
            <li class="text-muted-foreground/50">/</li>
            <li class="text-foreground font-medium" aria-current="page">Terms of Service</li>
          </ol>
        </nav>

        <h1 class="text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.1] mb-4">Terms of Service</h1>
        <p class="text-muted-foreground mb-10">Last updated: May 20, 2026</p>

        <div class="prose prose-neutral max-w-none
                    [&>h2]:text-2xl [&>h2]:font-extrabold [&>h2]:tracking-tight [&>h2]:mt-10 [&>h2]:mb-4 [&>h2]:text-foreground
                    [&>p]:text-foreground [&>p]:leading-[1.8] [&>p]:mb-6 [&>p]:text-[15px]
                    [&>ul]:text-foreground [&>ul]:mb-6 [&>ul]:ml-6 [&>ul]:list-disc [&>ul>li]:mb-2 [&>ul>li]:leading-[1.7]
                    [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4 [&_a:hover]:text-primary/80
                    [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded-md [&_code]:text-sm">

          <p>These Terms of Service govern your use of <strong>coderssecret.com</strong>. By using the site, you agree to these terms. If you do not agree, do not use the site.</p>

          <h2>1. What CodersSecret Provides</h2>
          <p>CodersSecret publishes free educational content about software engineering, backend systems, cloud native security, Kubernetes, SPIFFE/SPIRE, AI infrastructure, analytics engineering, games, cheatsheets, narrated slides, and related topics.</p>
          <p>The site is provided for learning and reference. It does not provide legal, financial, compliance, security certification, employment, or professional consulting advice.</p>

          <h2>2. Educational Content Only</h2>
          <ul>
            <li>Articles, courses, examples, diagrams, slides, and games are provided "as is".</li>
            <li>Code snippets and infrastructure commands may be incomplete, simplified, outdated, or unsuitable for your environment.</li>
            <li>You are responsible for testing, security review, backups, staged rollout, cost review, and compliance review before using anything in production.</li>
            <li>Always verify commands and technical claims against official documentation before applying them to real systems.</li>
          </ul>

          <h2>3. Intellectual Property And Reuse</h2>
          <ul>
            <li>CodersSecret articles, diagrams, course text, page design, and original explanations are owned by CodersSecret or the author unless stated otherwise.</li>
            <li>You may link to pages and quote short excerpts with attribution and a link back to the original page.</li>
            <li>Do not republish full articles, course modules, diagrams, slide scripts, or generated media without permission.</li>
            <li>Small code snippets in articles may be used in your own projects unless a page says otherwise. Larger examples or third-party code may have their own license.</li>
            <li>Brand names, product names, logos, and trademarks belong to their respective owners.</li>
          </ul>

          <h2>4. Acceptable Use</h2>
          <p>You agree not to misuse CodersSecret or related services. You must not:</p>
          <ul>
            <li>Attempt to disrupt, overload, scan, exploit, or gain unauthorized access to the site or its infrastructure.</li>
            <li>Post spam, malware, abusive content, hate speech, illegal content, or personal attacks in comments or discussions.</li>
            <li>Use automated scraping that ignores robots.txt, access controls, rate limits, or reasonable bandwidth limits.</li>
            <li>Misrepresent CodersSecret content as your own original work.</li>
            <li>Use site content to train or populate commercial datasets at scale without permission.</li>
          </ul>

          <h2>5. Comments And Community Content</h2>
          <p>Comments are powered by <a href="https://giscus.app" target="_blank" rel="noopener noreferrer">Giscus</a> and GitHub Discussions. If you comment, you also agree to <a href="https://docs.github.com/en/site-policy/github-terms/github-terms-of-service" target="_blank" rel="noopener noreferrer">GitHub's Terms of Service</a>.</p>
          <ul>
            <li>You retain responsibility for what you post.</li>
            <li>You grant CodersSecret permission to display your comment on the site.</li>
            <li>We may hide, remove, or moderate comments that are spam, abusive, off-topic, misleading, illegal, or unsafe.</li>
            <li>Public technical discussion may be indexed by search engines.</li>
          </ul>

          <h2>6. Third-Party Links And Platforms</h2>
          <p>CodersSecret links to GitHub, YouTube, Spotify, Buy Me a Coffee, LinkedIn, Instagram, documentation sites, package registries, and other third-party resources. We do not control those services and are not responsible for their content, availability, terms, privacy practices, payments, or account systems.</p>

          <h2>7. No Warranty</h2>
          <p>The site is provided "as is" and "as available" without warranties of any kind, whether express or implied. We do not guarantee that the site will be uninterrupted, error-free, secure, current, or fit for a particular purpose.</p>

          <h2>8. Limitation Of Liability</h2>
          <p>To the fullest extent permitted by law, CodersSecret and its contributors will not be liable for indirect, incidental, special, consequential, exemplary, or punitive damages, including data loss, security incidents, lost profits, service outages, or infrastructure costs arising from use of the site or reliance on its content.</p>

          <h2>9. Indemnity</h2>
          <p>If your misuse of the site, violation of these terms, or violation of another person's rights causes a claim, you agree to defend and hold CodersSecret and its contributors harmless to the extent permitted by law.</p>

          <h2>10. Changes To The Site Or Terms</h2>
          <p>We may update content, remove pages, change features, or revise these terms. Continued use of the site after an update means you accept the updated terms.</p>

          <h2>11. Governing Law</h2>
          <p>These terms are governed by the laws of India. Courts located in India will have jurisdiction unless applicable law requires another forum.</p>

          <h2>12. Contact</h2>
          <p>Questions about these terms can be sent through the social links in the footer or through the public GitHub repository.</p>

          <hr style="margin:3rem 0;border:none;border-top:1px solid var(--border)" />

          <p class="text-sm text-muted-foreground">See also: <a routerLink="/privacy">Privacy Policy</a> &middot; <a routerLink="/cookies">Cookie Policy</a></p>
        </div>
      </div>
    </section>
  `,
})
export class TermsComponent {
  private seo = inject(SeoService);

  constructor() {
    this.seo.update({
      title: 'Terms of Service',
      description: 'CodersSecret Terms of Service: educational content, acceptable use, comments, content reuse, third-party links, warranty, and liability.',
      url: '/terms',
    });
  }
}
