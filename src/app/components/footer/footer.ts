import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  template: `
    <footer class="border-t border-border">
      <div class="container max-w-4xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <p>&copy; {{ currentYear }} CodersSecret. All rights reserved.</p>
        <div class="flex items-center gap-4">
          <a href="#" class="hover:text-foreground transition-colors">Twitter</a>
          <a href="#" class="hover:text-foreground transition-colors">GitHub</a>
          <a href="#" class="hover:text-foreground transition-colors">RSS</a>
        </div>
      </div>
    </footer>
  `,
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
