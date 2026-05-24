import { Component } from '@angular/core';

@Component({
  selector: 'app-brand-mark',
  template: `
    <span class="md3-brand-mark" aria-hidden="true">
      <svg class="md3-brand-mark-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">
        <path class="md3-brand-mark-left" d="M20 16 12 24l8 8" />
        <path class="md3-brand-mark-right" d="m29 16 7 8-7 8" />
        <path class="md3-brand-mark-slash" d="m27 12-6 24" />
        <circle class="md3-brand-mark-node" cx="34" cy="13" r="4" />
      </svg>
    </span>
  `,
})
export class BrandMarkComponent {}
