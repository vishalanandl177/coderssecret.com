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
        <p class="text-muted-foreground mb-10">Last updated: April 2026</p>

        <div class="prose prose-neutral max-w-none
                    [&>h2]:text-2xl [&>h2]:font-extrabold [&>h2]:tracking-tight [&>h2]:mt-10 [&>h2]:mb-4 [&>h2]:text-foreground
                    [&>p]:text-foreground [&>p]:leading-[1.8] [&>p]:mb-6 [&>p]:text-[15px]
                    [&>ul]:text-foreground [&>ul]:mb-6 [&>ul]:ml-6 [&>ul]:list-disc [&>ul>li]:mb-2 [&>ul>li]:leading-[1.7]
                    [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4 [&_a:hover]:text-primary/80
                    [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded-md [&_code]:text-sm">

          <p>By accessing <strong>coderssecret.com</strong>, you agree to these terms. Please read them carefully. If you don't agree, please don't use this site.</p>

          <h2>1. About This Site</h2>
          <p>CodersSecret is a free personal technical blog publishing tutorials, guides, and opinions on software engineering topics. Content is written by the author(s) and reflects personal views, not the views of any employer.</p>

          <h2>2. Content Is Provided "As Is"</h2>
          <p>All content on this site is provided <strong>for educational and informational purposes only</strong>.</p>
          <ul>
            <li>We make reasonable efforts to ensure accuracy but <strong>do not guarantee</strong> that content is error-free, complete, or up-to-date.</li>
            <li>Code examples are for learning. Test before using in production.</li>
            <li>We are not responsible for damages resulting from use of our content, including but not limited to: data loss, security breaches, lost profits, or service outages.</li>
            <li>Always verify information against official documentation and apply your own judgment.</li>
          </ul>

          <h2>3. Intellectual Property</h2>
          <ul>
            <li>Blog post text is &copy; CodersSecret. You may quote short excerpts with attribution and a link back to the original article.</li>
            <li>Code snippets in blog posts are released under the <a href="https://opensource.org/licenses/MIT" target="_blank" rel="noopener noreferrer">MIT License</a> &#x2014; feel free to use them in your own projects.</li>
            <li>Do not republish full articles without written permission.</li>
            <li>Logos, trademarks, and brand names belong to their respective owners.</li>
          </ul>

          <h2>4. User-Generated Content (Comments)</h2>
          <p>Comments are powered by <a href="https://giscus.app" target="_blank" rel="noopener noreferrer">Giscus</a> via GitHub Discussions. By commenting:</p>
          <ul>
            <li>You agree to <a href="https://docs.github.com/en/site-policy/github-terms/github-terms-of-service" target="_blank" rel="noopener noreferrer">GitHub's Terms of Service</a>.</li>
            <li>You retain ownership of your content but grant us the right to display it on the site.</li>
            <li>We reserve the right to moderate, edit, hide, or delete comments that are spam, offensive, off-topic, illegal, or violate GitHub's community guidelines.</li>
            <li>You are solely responsible for the content you post.</li>
          </ul>

          <h2>5. Prohibited Uses</h2>
          <p>You may not:</p>
          <ul>
            <li>Use automated tools (bots, scrapers) to systematically download the site without permission.</li>
            <li>Attempt to gain unauthorized access to the site, its infrastructure, or related services.</li>
            <li>Post spam, malware links, illegal content, hate speech, or personal attacks in comments.</li>
            <li>Use our content to train AI models without permission (see the <code>robots.txt</code>).</li>
          </ul>

          <h2>6. External Links</h2>
          <p>We link to third-party websites and tools. We are <strong>not responsible</strong> for the content, privacy practices, or availability of external sites. Links don't imply endorsement.</p>

          <h2>7. Disclaimer of Warranty</h2>
          <p>This site is provided "as is" and "as available," <strong>without warranties of any kind</strong>, express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, or non-infringement.</p>

          <h2>8. Limitation of Liability</h2>
          <p>To the fullest extent permitted by law, CodersSecret and its contributors shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the site &#x2014; even if we've been advised of the possibility of such damages.</p>

          <h2>9. Changes to These Terms</h2>
          <p>We may update these terms from time to time. Continued use of the site after changes constitutes acceptance of the new terms. Check the "Last updated" date at the top.</p>

          <h2>10. Governing Law</h2>
          <p>These terms are governed by the laws of India. Any disputes will be resolved in the courts of India.</p>

          <h2>11. Contact</h2>
          <p>Questions about these terms? Reach out via the social links in our footer.</p>

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
      description: 'CodersSecret Terms of Service — rules for using the site, content licensing, and user responsibilities.',
      url: '/terms',
    });
  }
}
