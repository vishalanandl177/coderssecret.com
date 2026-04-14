import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-privacy',
  imports: [RouterLink],
  template: `
    <section class="py-16 md:py-20 animate-in fade-in duration-500">
      <div class="container max-w-3xl mx-auto px-6">
        <nav aria-label="Breadcrumb" class="mb-6">
          <ol class="flex items-center gap-1.5 text-sm text-muted-foreground">
            <li><a routerLink="/" class="hover:text-foreground transition-colors">Home</a></li>
            <li class="text-muted-foreground/50">/</li>
            <li class="text-foreground font-medium" aria-current="page">Privacy Policy</li>
          </ol>
        </nav>

        <h1 class="text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.1] mb-4">Privacy Policy</h1>
        <p class="text-muted-foreground mb-10">Last updated: April 2026</p>

        <div class="prose prose-neutral max-w-none
                    [&>h2]:text-2xl [&>h2]:font-extrabold [&>h2]:tracking-tight [&>h2]:mt-10 [&>h2]:mb-4 [&>h2]:text-foreground
                    [&>p]:text-foreground [&>p]:leading-[1.8] [&>p]:mb-6 [&>p]:text-[15px]
                    [&>ul]:text-foreground [&>ul]:mb-6 [&>ul]:ml-6 [&>ul]:list-disc [&>ul>li]:mb-2 [&>ul>li]:leading-[1.7]
                    [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4 [&_a:hover]:text-primary/80
                    [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded-md [&_code]:text-sm">

          <p><strong>CodersSecret (coderssecret.com)</strong> is a personal technical blog. We believe in transparency and privacy. This policy explains what minimal data we collect, how it's used, and your rights.</p>

          <h2>Summary (TL;DR)</h2>
          <ul>
            <li>&#x2705; We <strong>do not</strong> collect your name, email, address, or any personal information directly.</li>
            <li>&#x2705; We <strong>do not</strong> require you to create an account to read any content.</li>
            <li>&#x2705; We <strong>do not</strong> sell, rent, or share any data with advertisers.</li>
            <li>&#x2705; We <strong>do not</strong> use tracking cookies beyond what's needed for basic analytics.</li>
            <li>&#x26A0;&#xFE0F; We <strong>do</strong> use Google Analytics to count anonymous page views.</li>
            <li>&#x26A0;&#xFE0F; Comments use GitHub Discussions (via Giscus) &#x2014; only active if you choose to comment.</li>
          </ul>

          <h2>What We Collect</h2>

          <h3 style="font-size:1.15rem;font-weight:700;margin-top:1.5rem;margin-bottom:0.75rem">1. Google Analytics (Anonymous Usage Data)</h3>
          <p>We use <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer">Google Analytics 4</a> to understand which blog posts are popular and how readers find us. This collects:</p>
          <ul>
            <li>Pages you visit and time spent on each</li>
            <li>Your approximate location (country/city) derived from IP address (IP is <strong>not</strong> stored)</li>
            <li>Device type (mobile/desktop), browser, operating system</li>
            <li>Referring website (how you arrived here)</li>
            <li>Generic events: scroll depth, search queries on this site</li>
          </ul>
          <p>This data is <strong>anonymized and aggregated</strong>. We cannot identify individual users. You can opt out using the <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">Google Analytics Opt-out Browser Add-on</a> or a browser with tracking protection (Brave, Firefox strict mode).</p>

          <h3 style="font-size:1.15rem;font-weight:700;margin-top:1.5rem;margin-bottom:0.75rem">2. Local Browser Storage</h3>
          <p>We use your browser's <code>localStorage</code> to remember your theme preference (dark/light mode). This is stored <strong>only on your device</strong> and never sent to our servers. You can clear it anytime via your browser settings.</p>

          <h3 style="font-size:1.15rem;font-weight:700;margin-top:1.5rem;margin-bottom:0.75rem">3. Comments (Optional, via Giscus)</h3>
          <p>Blog post comments are powered by <a href="https://giscus.app" target="_blank" rel="noopener noreferrer">Giscus</a>, which uses <strong>GitHub Discussions</strong> as the backend. If you choose to post a comment:</p>
          <ul>
            <li>You must sign in with your GitHub account (we don't see your password)</li>
            <li>Your GitHub username and avatar become publicly visible next to your comment</li>
            <li>Comments are stored in this site's <a href="https://github.com/vishalanandl177/coderssecret.com/discussions" target="_blank" rel="noopener noreferrer">GitHub Discussions</a>, not on our servers</li>
            <li>By commenting, you agree to <a href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement" target="_blank" rel="noopener noreferrer">GitHub's Privacy Policy</a></li>
          </ul>
          <p>If you never comment, Giscus never loads or tracks you.</p>

          <h2>What We Do NOT Collect</h2>
          <ul>
            <li>&#x274C; Email addresses (no newsletter sign-up)</li>
            <li>&#x274C; Names, phone numbers, physical addresses</li>
            <li>&#x274C; Payment information (nothing to purchase)</li>
            <li>&#x274C; Browsing history outside our site</li>
            <li>&#x274C; Biometric data, device fingerprints, or advertising IDs</li>
          </ul>

          <h2>Cookies</h2>
          <p>We use minimal cookies:</p>
          <ul>
            <li><strong>Google Analytics cookies</strong> (<code>_ga</code>, <code>_ga_*</code>) &#x2014; anonymous usage tracking. Expire after 2 years.</li>
            <li><strong>No advertising cookies, no tracking pixels, no third-party marketing cookies.</strong></li>
          </ul>
          <p>You can block all cookies via browser settings. The site works perfectly without cookies (only analytics breaks).</p>

          <h2>Third-Party Services</h2>
          <p>We use these services, each with their own privacy policies:</p>
          <ul>
            <li><a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google Analytics</a> &#x2014; anonymous usage analytics</li>
            <li><a href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement" target="_blank" rel="noopener noreferrer">GitHub (via Giscus)</a> &#x2014; comments infrastructure (only if you comment)</li>
            <li><a href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement" target="_blank" rel="noopener noreferrer">GitHub Pages</a> &#x2014; website hosting</li>
          </ul>

          <h2>Your Rights (GDPR &amp; CCPA)</h2>
          <p>Since we don't store personal data, most data rights requests don't apply here. However:</p>
          <ul>
            <li><strong>Right to delete analytics data:</strong> use the <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">Google Analytics opt-out</a>.</li>
            <li><strong>Right to delete your comments:</strong> edit or delete via your GitHub account at any time.</li>
            <li><strong>Right to ask questions:</strong> contact us via our social channels in the footer.</li>
          </ul>

          <h2>Data Retention</h2>
          <ul>
            <li>Google Analytics data is retained for 14 months (default GA4 setting)</li>
            <li>Comments in GitHub Discussions are retained until you delete them</li>
            <li>Local browser storage persists until you clear your browser data</li>
          </ul>

          <h2>Children's Privacy</h2>
          <p>This site is not directed at children under 13. We do not knowingly collect information from children.</p>

          <h2>Changes to This Policy</h2>
          <p>If we update this policy, we'll change the "Last updated" date at the top. Significant changes will be noted in our blog.</p>

          <h2>Contact</h2>
          <p>Questions about privacy? Reach out via the social links in our footer. We're a small operation and we respond personally.</p>

          <hr style="margin:3rem 0;border:none;border-top:1px solid var(--border)" />

          <p class="text-sm text-muted-foreground">See also: <a routerLink="/terms">Terms of Service</a> &middot; <a routerLink="/cookies">Cookie Policy</a></p>
        </div>
      </div>
    </section>
  `,
})
export class PrivacyComponent {
  private seo = inject(SeoService);

  constructor() {
    this.seo.update({
      title: 'Privacy Policy',
      description: 'CodersSecret Privacy Policy — we collect minimal anonymous analytics data, no personal information, no advertising cookies.',
      url: '/privacy',
    });
  }
}
