import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-md3-mini-map',
  styles: [':host { display: contents; }'],
  template: `
    <div class="md3-learning-mini-map" aria-hidden="true">
      <svg viewBox="0 0 520 300" role="img">
        <rect class="md3-mini-map-backdrop" x="0" y="0" width="520" height="300" rx="34" />
        <path class="md3-mini-map-grid" d="M56 64h408M56 150h408M56 236h408M132 40v220M260 40v220M388 40v220" />
        <path class="md3-mini-map-route" d="M108 116H412" />
        <path class="md3-mini-map-route secondary" d="M258 150v58" />

        <g class="md3-mini-map-node md3-mini-map-node-a" transform="translate(48 58)">
          <rect width="122" height="92" rx="30" />
          <text class="md3-mini-map-node-label" x="24" y="40">{{ labelAt(0) }}</text>
          <text class="md3-mini-map-node-copy" x="24" y="66">{{ stepAt(0) }}</text>
        </g>

        <g class="md3-mini-map-node md3-mini-map-node-b" transform="translate(199 58)">
          <rect width="122" height="92" rx="30" />
          <text class="md3-mini-map-node-label" x="24" y="40">{{ labelAt(1) }}</text>
          <text class="md3-mini-map-node-copy" x="24" y="66">{{ stepAt(1) }}</text>
        </g>

        <g class="md3-mini-map-node md3-mini-map-node-c" transform="translate(350 58)">
          <rect width="122" height="92" rx="30" />
          <text class="md3-mini-map-node-label" x="24" y="40">{{ labelAt(2) }}</text>
          <text class="md3-mini-map-node-copy" x="24" y="66">{{ stepAt(2) }}</text>
        </g>

        <g class="md3-mini-map-reference" transform="translate(70 198)">
          <rect width="380" height="60" rx="30" />
          <text class="md3-mini-map-reference-label" x="30" y="28">{{ labelAt(3) }}</text>
          <text class="md3-mini-map-reference-copy" x="30" y="48">Context, action, notes</text>
        </g>

        <g class="md3-mini-map-chip" transform="translate(183 160)">
          <rect width="154" height="34" rx="17" />
          <text x="77" y="22" text-anchor="middle">LEARN -> PRACTICE</text>
        </g>
      </svg>
    </div>
  `,
})
export class Md3MiniMapComponent {
  @Input() labels: string[] = ['READ', 'RUN', 'SHIP', 'REF'];
  private readonly stepLabels = ['Learn', 'Decide', 'Ship'];

  labelAt(index: number): string {
    return this.labels[index] ?? ['READ', 'RUN', 'SHIP', 'REF'][index] ?? 'CS';
  }

  stepAt(index: number): string {
    return this.stepLabels[index] ?? 'Practice';
  }
}
