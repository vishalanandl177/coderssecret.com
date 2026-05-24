import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-md3-mini-map',
  styles: [':host { display: contents; }'],
  template: `
    <div class="md3-learning-mini-map" aria-hidden="true">
      <svg viewBox="0 0 520 320" role="img">
        <defs>
          <linearGradient id="md3MiniMapPanel" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="var(--md-sys-color-primary-container)" stop-opacity="0.72" />
            <stop offset="62%" stop-color="var(--md-sys-color-secondary-container)" stop-opacity="0.28" />
            <stop offset="100%" stop-color="var(--md-sys-color-surface-container-high)" stop-opacity="0.82" />
          </linearGradient>
        </defs>

        <rect class="md3-mini-map-backdrop" x="0" y="0" width="520" height="320" rx="32" />
        <path class="md3-mini-map-grid" d="M60 42v236M150 42v236M240 42v236M330 42v236M420 42v236M38 82h444M38 152h444M38 222h444" />

        <path class="md3-mini-map-flow primary" d="M120 94 C174 52 252 58 288 116" />
        <path class="md3-mini-map-flow secondary" d="M288 116 C334 138 374 160 416 206" />
        <path class="md3-mini-map-flow tertiary" d="M132 224 C200 246 278 240 352 196" />

        <g class="md3-mini-map-card md3-mini-map-card-primary" transform="translate(54 58)">
          <rect width="132" height="76" rx="24" />
          <text class="md3-mini-map-card-label" x="22" y="30">{{ labelAt(0) }}</text>
          <text class="md3-mini-map-card-copy" x="22" y="54">System</text>
        </g>

        <g class="md3-mini-map-card" transform="translate(196 34)">
          <rect width="132" height="76" rx="24" />
          <text class="md3-mini-map-card-label" x="22" y="30">{{ labelAt(1) }}</text>
          <text class="md3-mini-map-card-copy" x="22" y="54">Signal</text>
        </g>

        <g class="md3-mini-map-decision" transform="translate(220 128)">
          <rect width="132" height="84" rx="30" />
          <text class="md3-mini-map-decision-label" x="66" y="38" text-anchor="middle">DECIDE</text>
          <text class="md3-mini-map-decision-copy" x="66" y="60" text-anchor="middle">Pick a fix</text>
        </g>

        <g class="md3-mini-map-card md3-mini-map-card-secondary" transform="translate(352 174)">
          <rect width="132" height="76" rx="24" />
          <text class="md3-mini-map-card-label" x="22" y="30">{{ labelAt(2) }}</text>
          <text class="md3-mini-map-card-copy" x="22" y="54">Response</text>
        </g>

        <g class="md3-mini-map-card md3-mini-map-card-tertiary" transform="translate(58 186)">
          <rect width="132" height="76" rx="24" />
          <text class="md3-mini-map-card-label" x="22" y="30">{{ labelAt(3) }}</text>
          <text class="md3-mini-map-card-copy" x="22" y="54">Reference</text>
        </g>

        <g class="md3-mini-map-rail" transform="translate(212 262)">
          <rect width="236" height="34" rx="17" />
          <text x="118" y="22" text-anchor="middle">LEARN | PRACTICE | SHIP</text>
        </g>
      </svg>
    </div>
  `,
})
export class Md3MiniMapComponent {
  @Input() labels: string[] = ['READ', 'RUN', 'SHIP', 'REF'];

  labelAt(index: number): string {
    return this.labels[index] ?? ['READ', 'RUN', 'SHIP', 'REF'][index] ?? 'CS';
  }
}
