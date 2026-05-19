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
        <p class="text-muted-foreground mb-10">Last updated: May 20, 2026</p>

        <div class="prose prose-neutral max-w-none
                    [&>h2]:text-2xl [&>h2]:font-extrabold [&>h2]:tracking-tight [&>h2]:mt-10 [&>h2]:mb-4 [&>h2]:text-foreground
                    [&>h3]:text-lg [&>h3]:font-bold [&>h3]:mt-7 [&>h3]:mb-3 [&>h3]:text-foreground
                    [&>p]:text-foreground [&>p]:leading-[1.8] [&>p]:mb-6 [&>p]:text-[15px]
                    [&>ul]:text-foreground [&>ul]:mb-6 [&>ul]:ml-6 [&>ul]:list-disc [&>ul>li]:mb-2 [&>ul>li]:leading-[1.7]
                    [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4 [&_a:hover]:text-primary/80
                    [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded-md [&_code]:text-sm">

          <p>This Cookie Policy explains how <strong>coderssecret.com</strong> uses cookies and browser storage. The site is free, ad-free, and designed to work even if you block analytics cookies.</p>

          <h2>What Cookies Are</h2>
          <p>Cookies are small files stored by your browser. Similar browser technologies include localStorage and sessionStorage. They can remember preferences, keep a session working, or help a site understand aggregate usage.</p>

          <h2>Cookies And Storage We Use</h2>

          <div style="overflow-x:auto;margin:1.5rem 0">
            <table style="width:100%;border-collapse:collapse;font-size:0.85rem">
              <thead>
                <tr>
                  <th style="text-align:left;padding:0.75rem;background:var(--muted);color:var(--foreground);border-radius:0.4rem 0 0 0">Name</th>
                  <th style="text-align:left;padding:0.75rem;background:var(--muted);color:var(--foreground)">Type</th>
                  <th style="text-align:left;padding:0.75rem;background:var(--muted);color:var(--foreground)">Purpose</th>
                  <th style="text-align:left;padding:0.75rem;background:var(--muted);color:var(--foreground);border-radius:0 0.4rem 0 0">Duration</th>
                </tr>
              </thead>
              <tbody>
                <tr style="border-bottom:1px solid var(--border)">
                  <td style="padding:0.75rem"><code>theme</code></td>
                  <td style="padding:0.75rem">localStorage</td>
                  <td style="padding:0.75rem">Remembers light or dark theme choice.</td>
                  <td style="padding:0.75rem">Until cleared by you.</td>
                </tr>
                <tr style="border-bottom:1px solid var(--border)">
                  <td style="padding:0.75rem"><code>slides.voice</code></td>
                  <td style="padding:0.75rem">localStorage</td>
                  <td style="padding:0.75rem">Remembers narrated-slide voice preference.</td>
                  <td style="padding:0.75rem">Until cleared by you.</td>
                </tr>
                <tr style="border-bottom:1px solid var(--border)">
                  <td style="padding:0.75rem"><code>slides.rate</code></td>
                  <td style="padding:0.75rem">localStorage</td>
                  <td style="padding:0.75rem">Remembers narrated-slide playback speed.</td>
                  <td style="padding:0.75rem">Until cleared by you.</td>
                </tr>
                <tr style="border-bottom:1px solid var(--border)">
                  <td style="padding:0.75rem"><code>_ga</code></td>
                  <td style="padding:0.75rem">Google Analytics cookie</td>
                  <td style="padding:0.75rem">Helps distinguish visits in aggregate analytics reports.</td>
                  <td style="padding:0.75rem">Usually up to 2 years.</td>
                </tr>
                <tr style="border-bottom:1px solid var(--border)">
                  <td style="padding:0.75rem"><code>_ga_*</code></td>
                  <td style="padding:0.75rem">Google Analytics cookie</td>
                  <td style="padding:0.75rem">Helps maintain analytics session state.</td>
                  <td style="padding:0.75rem">Usually up to 2 years.</td>
                </tr>
                <tr>
                  <td style="padding:0.75rem">GitHub / Giscus storage</td>
                  <td style="padding:0.75rem">Third-party cookies or storage</td>
                  <td style="padding:0.75rem">Only relevant if you interact with GitHub-powered comments.</td>
                  <td style="padding:0.75rem">Controlled by GitHub.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2>What We Do Not Use</h2>
          <ul>
            <li>No advertising cookies.</li>
            <li>No remarketing or retargeting cookies.</li>
            <li>No Facebook Pixel, LinkedIn Insight Tag, TikTok Pixel, or similar marketing pixels.</li>
            <li>No session replay tools such as Hotjar or FullStory.</li>
            <li>No cross-site behavioral advertising profiles created by CodersSecret.</li>
            <li>No device fingerprinting by CodersSecret.</li>
          </ul>

          <h2>External Links</h2>
          <p>Links to YouTube, Spotify, Buy Me a Coffee, GitHub, LinkedIn, Instagram, documentation sites, and package registries may set their own cookies after you leave CodersSecret. Those cookies are controlled by the external service, not by CodersSecret.</p>

          <h2>How To Control Cookies</h2>
          <h3>Block Or Delete Cookies</h3>
          <p>You can block or delete cookies in your browser settings. CodersSecret content remains available if analytics cookies are blocked.</p>

          <h3>Clear Local Storage</h3>
          <p>You can clear theme and slide-player preferences through your browser's site data settings or developer tools. After clearing storage, the site will use default preferences again.</p>

          <h3>Opt Out Of Google Analytics</h3>
          <p>You can install the <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">Google Analytics Opt-out Browser Add-on</a> or use browser tracking protection.</p>

          <h2>Do Not Track</h2>
          <p>Some browsers send a Do Not Track signal, but there is no consistent modern standard for how all services should respond. The most reliable controls are blocking cookies, using the analytics opt-out, and using browser privacy protections.</p>

          <h2>Changes</h2>
          <p>If CodersSecret adds or removes cookies, storage keys, analytics tooling, or embedded services, this page will be updated.</p>

          <h2>Questions</h2>
          <p>Questions about cookies can be sent through the social links in the footer or through the public GitHub repository.</p>

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
      description: 'CodersSecret Cookie Policy: Google Analytics cookies, browser storage, slide preferences, GitHub comments, and cookie controls.',
      url: '/cookies',
    });
  }
}
