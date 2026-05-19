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
        <p class="text-muted-foreground mb-10">Last updated: May 20, 2026</p>

        <div class="prose prose-neutral max-w-none
                    [&>h2]:text-2xl [&>h2]:font-extrabold [&>h2]:tracking-tight [&>h2]:mt-10 [&>h2]:mb-4 [&>h2]:text-foreground
                    [&>h3]:text-lg [&>h3]:font-bold [&>h3]:mt-7 [&>h3]:mb-3 [&>h3]:text-foreground
                    [&>p]:text-foreground [&>p]:leading-[1.8] [&>p]:mb-6 [&>p]:text-[15px]
                    [&>ul]:text-foreground [&>ul]:mb-6 [&>ul]:ml-6 [&>ul]:list-disc [&>ul>li]:mb-2 [&>ul>li]:leading-[1.7]
                    [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4 [&_a:hover]:text-primary/80
                    [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded-md [&_code]:text-sm">

          <p><strong>CodersSecret</strong> is a free technical education website at <strong>coderssecret.com</strong>. This policy explains what data is processed when you read articles, open courses, use slides, search the site, comment through GitHub Discussions, or follow links to external platforms.</p>

          <h2>Short Version</h2>
          <ul>
            <li>You can read the site without creating an account.</li>
            <li>We do not sell personal data.</li>
            <li>We do not use advertising pixels, remarketing tags, or session replay tools.</li>
            <li>We use Google Analytics 4 to understand aggregate traffic, search, scroll depth, and Core Web Vitals.</li>
            <li>We use browser storage for theme and slide-player preferences.</li>
            <li>Comments are optional and are handled by Giscus and GitHub Discussions.</li>
          </ul>

          <h2>Information We Do Not Collect Directly</h2>
          <p>CodersSecret does not run user accounts, paid checkout, newsletters, or private member areas. We do not ask for your name, email address, phone number, postal address, payment card, password, biometric data, or government ID.</p>

          <h2>Analytics Data</h2>
          <p>We use <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer">Google Analytics 4</a> to understand how the site is used and which topics are useful. Analytics may process page views, referring pages, approximate geography, device type, browser, operating system, on-site search terms, scroll-depth events, and Core Web Vitals such as CLS.</p>
          <p>Google may process IP address and device information to provide analytics services. CodersSecret sees aggregated reports, not a list of named readers. We use analytics to improve content, navigation, performance, and course planning. We do not use analytics data for ad targeting or resale.</p>
          <p>You can opt out with the <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">Google Analytics Opt-out Browser Add-on</a>, browser tracking protection, content blockers, or by blocking analytics cookies.</p>

          <h2>Browser Storage</h2>
          <p>The site uses local browser storage to keep small preferences on your own device:</p>
          <ul>
            <li><code>theme</code> stores your light or dark mode preference.</li>
            <li><code>slides.voice</code> stores your selected narrated-slide voice.</li>
            <li><code>slides.rate</code> stores your selected narration speed.</li>
          </ul>
          <p>These values are stored in your browser. They are not a user account and are not submitted to CodersSecret servers.</p>

          <h2>Comments And GitHub Discussions</h2>
          <p>Blog comments are powered by <a href="https://giscus.app" target="_blank" rel="noopener noreferrer">Giscus</a>, which stores discussion data in GitHub Discussions. The comments script loads on blog post pages and uses GitHub infrastructure. If you choose to comment or react, you use your GitHub account and GitHub may process your username, avatar, profile link, comment text, reactions, and related metadata.</p>
          <p>Your comments are public. You can edit or delete them through GitHub, subject to GitHub's own policies. If you do not interact with comments, you do not need a GitHub account to use CodersSecret.</p>

          <h2>External Services</h2>
          <p>Some links take you to third-party platforms. Those platforms have their own privacy practices:</p>
          <ul>
            <li><a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google</a> for Google Analytics and YouTube.</li>
            <li><a href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement" target="_blank" rel="noopener noreferrer">GitHub</a> for repository hosting and comments.</li>
            <li><a href="https://www.spotify.com/legal/privacy-policy/" target="_blank" rel="noopener noreferrer">Spotify</a> for the CodersSecret podcast.</li>
            <li><a href="https://buymeacoffee.com/privacy-policy" target="_blank" rel="noopener noreferrer">Buy Me a Coffee</a> for optional support links.</li>
            <li>LinkedIn and Instagram if you choose to open social profile links.</li>
          </ul>

          <h2>Hosting And Security Logs</h2>
          <p>The site is hosted through GitHub Pages and related delivery infrastructure. Hosting providers may process standard technical logs such as IP address, user agent, URL, timestamp, and error information for security, abuse prevention, and reliability. CodersSecret does not use those logs to identify individual readers.</p>

          <h2>Cookies</h2>
          <p>CodersSecret uses a small number of cookies and similar technologies. See the <a routerLink="/cookies">Cookie Policy</a> for the detailed list. The site does not use advertising cookies, remarketing cookies, or tracking pixels.</p>

          <h2>How Long Data Is Kept</h2>
          <ul>
            <li>Google Analytics data follows the configured GA4 retention period and Google's retention rules.</li>
            <li>GitHub Discussion comments remain until deleted by you or moderated according to GitHub/CodersSecret rules.</li>
            <li>Local browser storage remains until you clear browser data or change preferences.</li>
          </ul>

          <h2>Your Choices And Rights</h2>
          <ul>
            <li>Block cookies or analytics scripts in your browser.</li>
            <li>Use the Google Analytics opt-out linked above.</li>
            <li>Clear local storage and cookies through browser settings.</li>
            <li>Edit or delete GitHub comments from your GitHub account.</li>
            <li>Contact us through the social links in the footer if you have a privacy question.</li>
          </ul>
          <p>Depending on where you live, privacy laws may provide rights to access, delete, correct, restrict, object to, or receive a copy of personal data. Because CodersSecret does not run user accounts, most identifiable data is controlled by the third-party service you chose to use, such as Google or GitHub.</p>

          <h2>International Processing</h2>
          <p>CodersSecret is available globally. Third-party providers may process data in countries other than your own according to their own policies and transfer mechanisms.</p>

          <h2>Children's Privacy</h2>
          <p>CodersSecret is an educational site for developers and is not directed to children under 13. We do not knowingly collect personal information from children.</p>

          <h2>Changes</h2>
          <p>We may update this Privacy Policy as the site changes. The latest version will always show the effective date at the top of this page.</p>

          <h2>Contact</h2>
          <p>Questions about privacy can be sent through the social links in the footer or through the public GitHub repository.</p>

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
      description: 'CodersSecret Privacy Policy: analytics, browser storage, GitHub comments, third-party services, cookies, retention, and user choices.',
      url: '/privacy',
    });
  }
}
