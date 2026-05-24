import { Component, Input } from '@angular/core';

export interface Md3CommandRow {
  cmd: string;
  desc: string;
  prodNote?: string;
  warning?: string;
}

export interface Md3CommandGroup {
  title: string;
  rows?: Md3CommandRow[];
  items?: Md3CommandRow[];
}

@Component({
  selector: 'app-md3-command-groups',
  styles: [':host { display: contents; }'],
  template: `
    <div class="md3-learning-grid-2">
      @for (group of groups; track group.title) {
        <section class="md3-learning-command-card" aria-labelledby="grp-{{ idPrefix }}-{{ $index }}">
          <div class="md3-learning-command-header">
            <h2 [id]="'grp-' + idPrefix + '-' + $index">{{ group.title }}</h2>
            <span class="md3-chip">{{ rowsFor(group).length }} commands</span>
          </div>
          <div>
            @for (row of rowsFor(group); track row.cmd) {
              <div class="md3-learning-command-row">
                <code class="md3-learning-code">{{ row.cmd }}</code>
                <div>
                  <p class="text-sm leading-relaxed text-foreground/90">{{ row.desc }}</p>
                  @if (row.prodNote) {
                    <p class="mt-2 rounded-2xl border border-primary/20 bg-primary/5 p-3 text-xs leading-relaxed text-muted-foreground">
                      <strong class="text-primary">Production note:</strong> {{ row.prodNote }}
                    </p>
                  }
                  @if (row.warning) {
                    <p class="mt-2 rounded-2xl border border-destructive/20 bg-destructive/5 p-3 text-xs leading-relaxed text-muted-foreground">
                      <strong class="text-destructive">Warning:</strong> {{ row.warning }}
                    </p>
                  }
                </div>
              </div>
            }
          </div>
        </section>
      }
    </div>
  `,
})
export class Md3CommandGroupsComponent {
  @Input({ required: true }) groups: Md3CommandGroup[] = [];
  @Input() idPrefix = 'cmd';

  rowsFor(group: Md3CommandGroup): Md3CommandRow[] {
    return group.rows ?? group.items ?? [];
  }
}
