import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  template: `
    <footer class="border-t border-border bg-card/50">
      <div class="container max-w-5xl mx-auto px-6 py-12">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Brand -->
          <div>
            <a routerLink="/" class="font-bold text-lg tracking-tight">
              <span class="text-primary">Coders</span><span class="text-muted-foreground">Secret</span>
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

          <!-- Links -->
          <div>
            <h3 class="text-sm font-semibold text-foreground mb-3">Connect</h3>
            <ul class="space-y-2 text-sm">
              <li><a href="#" class="text-muted-foreground transition-colors hover:text-foreground">Twitter</a></li>
              <li><a href="#" class="text-muted-foreground transition-colors hover:text-foreground">GitHub</a></li>
              <li><a href="#" class="text-muted-foreground transition-colors hover:text-foreground">Instagram</a></li>
              <li><a href="#" class="text-muted-foreground transition-colors hover:text-foreground">RSS Feed</a></li>
            </ul>
          </div>
        </div>

        <div class="mt-10 pt-6 border-t border-border text-center text-xs text-muted-foreground">
          <p>&copy; {{ currentYear }} CodersSecret. All rights reserved.</p>
        </div>
      </div>
    </footer>
  `,
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
