import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Md3BreadcrumbItem } from './md3.types';

@Component({
  selector: 'app-md3-breadcrumb',
  imports: [RouterLink],
  styles: [':host { display: contents; }'],
  template: `
    <nav aria-label="Breadcrumb" class="md3-learning-breadcrumb">
      <ol>
        @for (item of items; track item.label; let last = $last) {
          <li>
            @if (item.href && !last) {
              <a [routerLink]="item.href">{{ item.label }}</a>
            } @else {
              <span [attr.aria-current]="last ? 'page' : null">{{ item.label }}</span>
            }
          </li>
          @if (!last) {
            <li aria-hidden="true">/</li>
          }
        }
      </ol>
    </nav>
  `,
})
export class Md3BreadcrumbComponent {
  @Input({ required: true }) items: Md3BreadcrumbItem[] = [];
}
