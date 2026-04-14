import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-cookies',
  imports: [RouterLink],
  template: `
    <section class="py-16 md:py-20 animate-in fade-in duration-500">
      <div class="container max-w-3xl mx-auto px-6">
        <nav aria-label="Breadcrumb" class="mb-6">
          <ol class="flex items-center gap-1.5 text-sm text-muted-foreground">
            <li><a routerLink="/" class="hover:text-foreground transition-colors">Home</a></li>
            <li class="text-muted-foreground/50">/</li>
            <li class="text-foreground font-medium" aria-current="page">Cookie Policy</li>
          </ol>
        </nav>

        <h1 class="text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.1] mb-4">Cookie Policy</h1>
        <p class="text-muted-foreground mb-10">Last updated: April 2026</p>

        <div class="prose prose-neutral max-w-none
                    [&>h2]:text-2xl [&>h2]:font-extrabold [&>h2]:tracking-tight [&>h2]:mt-10 [&>h2]:mb-4 [&>h2]:text-foreground
                    [&>p]:text-foreground [&>p]:leading-[1.8] [&>p]:mb-6 [&>p]:text-[15px]
                    [&>ul]:text-foreground [&>ul]:mb-6 [&>ul]:ml-6 [&>ul]:list-disc [&>ul>li]:mb-2 [&>ul>li]:leading-[1.7]
                    [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4 [&_a:hover]:text-primary/80
                    [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded-md [&_code]:text-sm">

          <p>This page describes the cookies and browser storage used on <strong>coderssecret.com</strong>. We use the minimum possible &#x2014; no ads, no trackers, no marketing cookies.</p>

          <h2>What Is a Cookie?</h2>
          <p>A cookie is a small text file that websites store on your device to remember information (like your theme preference) or to count visits. Similar technologies include <code>localStorage</code> and <code>sessionStorage</code>.</p>

          <h2>Cookies and Storage We Use</h2>

          <div style="overflow-x:auto;margin:1.5rem 0">
            <table style="width:100%;border-collapse:collapse;font-size:0.85rem">
              <thead>
                <tr>
                  <th style="text-align:left;padding:0.75rem;background:var(--muted);color:var(--foreground);border-radius:0.4rem 0 0 0">Name</th>
                  <th style="text-align:left;padding:0.75rem;background:var(--muted);color:var(--foreground)">Type</th>
                  <th style="text-align:left;padding:0.75rem;background:var(--muted);color:var(--foreground)">Purpose</th>
                  <th style="text-align:left;padding:0.75rem;background:var(--muted);color:var(--foreground);border-radius:0 0.4rem 0 0">Expires</th>
                </tr>
              </thead>
              <tbody>
                <tr style="border-bottom:1px solid var(--border)">
                  <td style="padding:0.75rem"><code>theme</code></td>
                  <td style="padding:0.75rem">localStorage</td>
                  <td style="padding:0.75rem">Remembers dark/light mode choice</td>
                  <td style="padding:0.75rem">Until cleared</td>
                </tr>
                <tr style="border-bottom:1px solid var(--border)">
                  <td style="padding:0.75rem"><code>_ga</code></td>
                  <td style="padding:0.75rem">Cookie (Google Analytics)</td>
                  <td style="padding:0.75rem">Distinguishes unique visitors</td>
                  <td style="padding:0.75rem">2 years</td>
                </tr>
                <tr style="border-bottom:1px solid var(--border)">
                  <td style="padding:0.75rem"><code>_ga_XXXXX</code></td>
                  <td style="padding:0.75rem">Cookie (Google Analytics)</td>
                  <td style="padding:0.75rem">Maintains session state</td>
                  <td style="padding:0.75rem">2 years</td>
                </tr>
                <tr>
                  <td style="padding:0.75rem"><em>GitHub cookies</em></td>
                  <td style="padding:0.75rem">Third-party (Giscus)</td>
                  <td style="padding:0.75rem">Only set if you comment</td>
                  <td style="padding:0.75rem">Per GitHub policy</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2>What We DON'T Use</h2>
          <ul>
            <li>&#x274C; Advertising cookies</li>
            <li>&#x274C; Facebook Pixel, LinkedIn Insight Tag, TikTok Pixel, or any marketing tracker</li>
            <li>&#x274C; Third-party remarketing cookies</li>
            <li>&#x274C; Session replay tools (Hotjar, FullStory, etc.)</li>
            <li>&#x274C; Cross-site tracking</li>
            <li>&#x274C; Device fingerprinting</li>
          </ul>

          <h2>How to Control Cookies</h2>

          <h3 style="font-size:1.15rem;font-weight:700;margin-top:1.5rem;margin-bottom:0.75rem">Block All Cookies</h3>
          <p>Most browsers let you block all cookies via settings. The site works fine without cookies &#x2014; only the theme preference resets on each visit and analytics stops counting you.</p>

          <h3 style="font-size:1.15rem;font-weight:700;margin-top:1.5rem;margin-bottom:0.75rem">Opt Out of Google Analytics</h3>
          <p>Install the <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">Google Analytics Opt-out Browser Add-on</a>. Or use a privacy-focused browser like <a href="https://brave.com" target="_blank" rel="noopener noreferrer">Brave</a> or Firefox with strict tracking protection.</p>

          <h3 style="font-size:1.15rem;font-weight:700;margin-top:1.5rem;margin-bottom:0.75rem">Clear Existing Cookies</h3>
          <p>Open your browser's developer tools (F12) &#x2192; Application &#x2192; Storage &#x2192; Clear site data. Or use your browser's privacy settings.</p>

          <h2>Do Not Track (DNT)</h2>
          <p>We honor browser "Do Not Track" signals where technically feasible. However, DNT is deprecated in most modern browsers. The best way to opt out is using the Google Analytics opt-out linked above.</p>

          <h2>Changes</h2>
          <p>If we ever add or remove cookies, we'll update this page and change the "Last updated" date.</p>

          <h2>Questions</h2>
          <p>Reach out via the social links in our footer.</p>

          <hr style="margin:3rem 0;border:none;border-top:1px solid var(--border)" />

          <p class="text-sm text-muted-foreground">See also: <a routerLink="/privacy">Privacy Policy</a> &middot; <a routerLink="/terms">Terms of Service</a></p>
        </div>
      </div>
    </section>
  `,
})
export class CookiesComponent {
  private seo = inject(SeoService);

  constructor() {
    this.seo.update({
      title: 'Cookie Policy',
      description: 'CodersSecret Cookie Policy — we use minimal cookies for anonymous analytics and theme preference. No advertising, no tracking pixels.',
      url: '/cookies',
    });
  }
}
