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

          <!-- Links -->
          <div>
            <h3 class="text-sm font-semibold text-foreground mb-3">Connect</h3>
            <ul class="space-y-2 text-sm">
              <li><a href="https://instagram.com/vis_naz" target="_blank" rel="noopener noreferrer" class="text-muted-foreground transition-colors hover:text-foreground">Instagram</a></li>
              <li><a href="https://linkedin.com/in/vishal-techlead" target="_blank" rel="noopener noreferrer" class="text-muted-foreground transition-colors hover:text-foreground">LinkedIn</a></li>
              <li><a href="https://github.com/vishalanandl177/coderssecret.com" target="_blank" rel="noopener noreferrer" class="text-muted-foreground transition-colors hover:text-foreground">GitHub</a></li>
            </ul>
          </div>
        </div>

        <div class="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
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
