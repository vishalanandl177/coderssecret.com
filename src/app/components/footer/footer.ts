import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  template: `
    <footer class="border-t border-border bg-card/50">
      <div class="container max-w-5xl mx-auto px-6 py-12">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
          <!-- Brand -->
          <div class="col-span-2 md:col-span-1">
            <a routerLink="/" class="inline-flex items-center gap-2 font-bold text-lg tracking-tight">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none" class="h-7 w-7">
                <defs>
                  <linearGradient id="footer-logo-g" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#7c3aed"/>
                    <stop offset="100%" style="stop-color:#3b82f6"/>
                  </linearGradient>
                </defs>
                <rect width="32" height="32" rx="7" fill="url(#footer-logo-g)"/>
                <g stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none">
                  <polyline points="11,10 6,16 11,22"/>
                  <polyline points="21,10 26,16 21,22"/>
                  <line x1="18.5" y1="8" x2="13.5" y2="24"/>
                </g>
              </svg>
              <span><span class="text-primary">Coders</span><span class="text-muted-foreground">Secret</span></span>
            </a>
            <p class="mt-2 text-sm text-muted-foreground leading-relaxed">
              Exploring modern web development, one post at a time.
            </p>
          </div>

          <!-- Categories -->
          <div>
            <h3 class="text-sm font-semibold text-foreground mb-3">Categories</h3>
            <ul class="space-y-2 text-sm">
              <li><a routerLink="/category/ai" class="text-muted-foreground transition-colors hover:text-foreground">AI</a></li>
              <li><a routerLink="/category/frontend" class="text-muted-foreground transition-colors hover:text-foreground">Frontend</a></li>
              <li><a routerLink="/category/backend" class="text-muted-foreground transition-colors hover:text-foreground">Backend</a></li>
              <li><a routerLink="/category/devops" class="text-muted-foreground transition-colors hover:text-foreground">DevOps</a></li>
              <li><a routerLink="/category/tutorials" class="text-muted-foreground transition-colors hover:text-foreground">Tutorials</a></li>
            </ul>
          </div>

          <!-- Legal -->
          <div>
            <h3 class="text-sm font-semibold text-foreground mb-3">Legal</h3>
            <ul class="space-y-2 text-sm">
              <li><a routerLink="/privacy" class="text-muted-foreground transition-colors hover:text-foreground">Privacy Policy</a></li>
              <li><a routerLink="/terms" class="text-muted-foreground transition-colors hover:text-foreground">Terms of Service</a></li>
              <li><a routerLink="/cookies" class="text-muted-foreground transition-colors hover:text-foreground">Cookie Policy</a></li>
            </ul>
          </div>

          <!-- Learn -->
          <div>
            <h3 class="text-sm font-semibold text-foreground mb-3">Learn</h3>
            <ul class="space-y-2 text-sm">
              <li><a routerLink="/courses" class="text-muted-foreground transition-colors hover:text-foreground">Free Courses</a></li>
              <li><a routerLink="/courses/mastering-spiffe-spire" class="text-muted-foreground transition-colors hover:text-foreground">SPIFFE & SPIRE Course</a></li>
              <li><a routerLink="/cheatsheets" class="text-muted-foreground transition-colors hover:text-foreground">Cheat Sheets</a></li>
              <li><a routerLink="/games" class="text-muted-foreground transition-colors hover:text-foreground">Coding Games</a></li>
            </ul>
          </div>

          <!-- Links -->
          <div>
            <h3 class="text-sm font-semibold text-foreground mb-3">Connect</h3>
            <ul class="space-y-2 text-sm">
              <li><a routerLink="/consultation" class="text-muted-foreground transition-colors hover:text-foreground">1-on-1 Consultation</a></li>
              <li><a href="https://instagram.com/vis_naz" target="_blank" rel="noopener noreferrer" class="text-muted-foreground transition-colors hover:text-foreground">Instagram</a></li>
              <li><a href="https://linkedin.com/in/vishal-techlead" target="_blank" rel="noopener noreferrer" class="text-muted-foreground transition-colors hover:text-foreground">LinkedIn</a></li>
              <li><a href="https://github.com/vishalanandl177/coderssecret.com" target="_blank" rel="noopener noreferrer" class="text-muted-foreground transition-colors hover:text-foreground">GitHub</a></li>
              <li><a href="https://buymeacoffee.com/riptechlead" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1 text-yellow-600 dark:text-yellow-500 font-semibold transition-colors hover:text-yellow-700 dark:hover:text-yellow-400">
                &#x2615; Buy me a coffee
              </a></li>
            </ul>
          </div>
        </div>

        <!-- Support banner -->
        <div class="mt-10 rounded-2xl border border-yellow-500/30 bg-gradient-to-br from-yellow-500/10 via-orange-500/5 to-pink-500/5 p-6 md:p-8">
          <div class="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
            <div class="text-4xl flex-shrink-0">&#x2615;</div>
            <div class="flex-1">
              <h3 class="text-base md:text-lg font-bold mb-1">Enjoying the content?</h3>
              <p class="text-sm text-muted-foreground">
                This blog is 100% free and ad-free. If you find it useful, a coffee goes a long way in keeping it that way.
              </p>
            </div>
            <a href="https://buymeacoffee.com/riptechlead" target="_blank" rel="noopener noreferrer"
               class="inline-flex items-center gap-2 rounded-full bg-yellow-500 hover:bg-yellow-600 text-yellow-950 font-bold px-5 py-2.5 text-sm shadow-lg shadow-yellow-500/25 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.97] flex-shrink-0">
              &#x2615; Buy me a coffee
            </a>
          </div>
        </div>

        <div class="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>&copy; {{ currentYear }} CodersSecret. All rights reserved.</p>
          <p>No ads &middot; No tracking &middot; Privacy-first</p>
        </div>
      </div>
    </footer>
  `,
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
