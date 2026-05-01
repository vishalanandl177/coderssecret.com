export const CONTENT = `
      <p>Angular Signals landed as stable in Angular 17 and have matured significantly through Angular 21. The community reaction has been polarized: some developers want to replace every Observable with a signal, while others cling to RxJS for everything. Both extremes are wrong.</p>

      <p>This guide explains what signals actually are under the hood, when they genuinely replace RxJS, and when observables remain the better tool.</p>

      <h2>What Signals Actually Are</h2>

      <p>A signal is a <strong>reactive primitive</strong> that holds a value and notifies consumers when that value changes. Unlike observables, signals are synchronous, always have a current value, and are pull-based (consumers read the value when they need it).</p>

      <pre><code>import { signal, computed, effect } from '@angular/core';

// Create a writable signal
const count = signal(0);

// Read the value (call it like a function)
console.log(count()); // 0

// Update the value
count.set(5);
count.update(prev => prev + 1); // 6

// Computed: derived value that auto-updates
const doubled = computed(() => count() * 2);
console.log(doubled()); // 12

// Effect: run side effects when dependencies change
effect(() => {
  console.log(\`Count changed to \${count()}\`);
});</code></pre>

      <h2>Signals vs Observables: The Core Difference</h2>

      <table>
        <thead>
          <tr>
            <th>Aspect</th>
            <th>Signal</th>
            <th>Observable (RxJS)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Execution</td>
            <td>Synchronous</td>
            <td>Can be async</td>
          </tr>
          <tr>
            <td>Current Value</td>
            <td>Always has one</td>
            <td>May not (streams)</td>
          </tr>
          <tr>
            <td>Model</td>
            <td>Pull-based</td>
            <td>Push-based</td>
          </tr>
          <tr>
            <td>Glitch-Free</td>
            <td>Yes (batched updates)</td>
            <td>No (each emission triggers independently)</td>
          </tr>
          <tr>
            <td>Cleanup</td>
            <td>Automatic (injection context)</td>
            <td>Manual (unsubscribe)</td>
          </tr>
          <tr>
            <td>Operators</td>
            <td>computed() only</td>
            <td>100+ operators (map, filter, merge, debounce...)</td>
          </tr>
          <tr>
            <td>Best For</td>
            <td>Component state, UI bindings</td>
            <td>Async events, HTTP, WebSocket, complex streams</td>
          </tr>
        </tbody>
      </table>

      <h2>When to Use Signals</h2>

      <ul>
        <li><strong>Component local state:</strong> Form values, toggle flags, counters, selected items</li>
        <li><strong>Derived/computed values:</strong> Filtered lists, formatted strings, validation states</li>
        <li><strong>Input/output binding:</strong> Component inputs and template bindings</li>
        <li><strong>Simple shared state:</strong> Service-level state that multiple components read</li>
      </ul>

      <h3>Before (RxJS for simple state)</h3>

      <pre><code>// Old pattern: BehaviorSubject for simple toggle
@Injectable({ providedIn: 'root' })
export class SidebarService {
  private isOpen$$ = new BehaviorSubject&lt;boolean&gt;(false);
  isOpen$ = this.isOpen$$.asObservable();

  toggle() {
    this.isOpen$$.next(!this.isOpen$$.value);
  }
}

// Component (needs async pipe or manual subscribe)
@Component({
  template: \`&lt;aside *ngIf="isOpen$ | async"&gt;...&lt;/aside&gt;\`
})
export class SidebarComponent {
  isOpen$ = inject(SidebarService).isOpen$;
}</code></pre>

      <h3>After (Signal &mdash; simpler, no subscription management)</h3>

      <pre><code>@Injectable({ providedIn: 'root' })
export class SidebarService {
  isOpen = signal(false);

  toggle() {
    this.isOpen.update(open => !open);
  }
}

@Component({
  template: \`@if (isOpen()) { &lt;aside&gt;...&lt;/aside&gt; }\`
})
export class SidebarComponent {
  isOpen = inject(SidebarService).isOpen;
}</code></pre>

      <h2>When to Keep RxJS</h2>

      <ul>
        <li><strong>HTTP requests:</strong> HttpClient returns observables with retry, timeout, and cancellation</li>
        <li><strong>Debounced search:</strong> debounceTime + switchMap is irreplaceable for typeahead</li>
        <li><strong>WebSocket streams:</strong> Continuous push-based data flow</li>
        <li><strong>Complex event composition:</strong> merge, combineLatest, race, forkJoin</li>
        <li><strong>Route events:</strong> Router events are observable-based</li>
      </ul>

      <pre><code>// RxJS is STILL better for debounced search
@Component({
  template: \`&lt;input [formControl]="searchControl"&gt;\`
})
export class SearchComponent {
  searchControl = new FormControl('');
  results = signal&lt;Result[]&gt;([]);

  constructor() {
    // RxJS for the stream, signal for the result
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(query => this.searchService.search(query)),
      takeUntilDestroyed()
    ).subscribe(results => {
      this.results.set(results);  // Bridge to signal
    });
  }
}</code></pre>

      <h2>Bridging Signals and Observables</h2>

      <p>Angular provides built-in functions to convert between signals and observables:</p>

      <pre><code>import { toSignal, toObservable } from '@angular/core/rxjs-interop';

// Observable to Signal
const data = toSignal(this.http.get&lt;Data[]&gt;('/api/data'), {
  initialValue: []  // Required: signals must always have a value
});

// Signal to Observable
const count = signal(0);
const count$ = toObservable(count);
count$.pipe(
  debounceTime(500)
).subscribe(val => console.log(val));</code></pre>

      <h2>Computed Signals: Gotchas</h2>

      <h3>1. Computed signals are lazy and cached</h3>

      <pre><code>const items = signal([1, 2, 3, 4, 5]);
const total = computed(() => {
  console.log('Computing total...'); // Only runs when read AND deps changed
  return items().reduce((a, b) => a + b, 0);
});

// First read: computes and caches
console.log(total()); // "Computing total..." then 15

// Second read without change: returns cached value
console.log(total()); // 15 (no recomputation!)</code></pre>

      <h3>2. Do not mutate objects inside signals</h3>

      <pre><code>const user = signal({ name: 'Alice', age: 30 });

// WRONG: mutation is not detected
user().name = 'Bob'; // Signal does not know it changed!

// RIGHT: create a new reference
user.update(u => ({ ...u, name: 'Bob' }));</code></pre>

      <h3>3. Effect cleanup and injection context</h3>

      <pre><code>// Effects must run in an injection context (constructor, field initializer)
@Component({...})
export class MyComponent {
  count = signal(0);

  // Works: field initializer is in injection context
  logger = effect(() => {
    console.log(\`Count: \${this.count()}\`);
  });

  // WRONG: ngOnInit is NOT an injection context
  ngOnInit() {
    // effect(() => {}); // Error!
  }
}</code></pre>

      <h2>Signal-Based Components Pattern</h2>

      <pre><code>@Component({
  selector: 'app-product-list',
  template: \`
    &lt;input type="text" (input)="filterText.set(input.value)" placeholder="Search..."&gt;
    &lt;select (change)="sortBy.set(select.value)"&gt;
      &lt;option value="name"&gt;Name&lt;/option&gt;
      &lt;option value="price"&gt;Price&lt;/option&gt;
    &lt;/select&gt;
    &lt;p&gt;Showing {{ filteredProducts().length }} of {{ products().length }}&lt;/p&gt;
    @for (product of filteredProducts(); track product.id) {
      &lt;app-product-card [product]="product" /&gt;
    }
  \`
})
export class ProductListComponent {
  private productService = inject(ProductService);

  products = toSignal(this.productService.getAll(), { initialValue: [] });
  filterText = signal('');
  sortBy = signal('name');

  filteredProducts = computed(() => {
    const text = this.filterText().toLowerCase();
    const sort = this.sortBy();

    return this.products()
      .filter(p => p.name.toLowerCase().includes(text))
      .sort((a, b) => a[sort] > b[sort] ? 1 : -1);
  });
}</code></pre>

      <p>This component has <strong>zero subscriptions</strong>, zero OnDestroy cleanup, and zero async pipes. The template reads signals directly, and Angular only re-renders when the computed value actually changes.</p>

      <h2>Migration Strategy</h2>

      <ol>
        <li><strong>New code:</strong> Write all new components with signals by default</li>
        <li><strong>Simple state:</strong> Replace BehaviorSubject services with signal services</li>
        <li><strong>Keep RxJS for:</strong> HTTP, WebSocket, debounce, complex stream composition</li>
        <li><strong>Bridge pattern:</strong> Use toSignal() at the component level to consume observables as signals</li>
        <li><strong>Do not force it:</strong> If RxJS is cleaner for a specific case, keep it. Signals and observables coexist.</li>
      </ol>

      <h2>Key Takeaways</h2>

      <ul>
        <li><strong>Signals replace BehaviorSubject for synchronous state</strong> &mdash; simpler, no subscriptions to manage</li>
        <li><strong>RxJS remains essential for async streams</strong> &mdash; HTTP, WebSocket, debounce, complex event composition</li>
        <li><strong>Use computed() for derived values</strong> &mdash; it is lazy, cached, and glitch-free</li>
        <li><strong>Never mutate signal values directly</strong> &mdash; always create new references with update() or set()</li>
        <li><strong>Bridge with toSignal() and toObservable()</strong> &mdash; use the right primitive at each layer</li>
        <li><strong>Effects run in injection context only</strong> &mdash; field initializers or constructors, not lifecycle hooks</li>
        <li><strong>Signals and RxJS coexist</strong> &mdash; this is not a replacement, it is an addition to your toolkit</li>
      </ul>

      <p>The best Angular code in 2026 uses both signals and observables, each where they are strongest. Signals for component state and UI bindings. Observables for async operations and complex event streams. Do not pick a side &mdash; use the right tool for each job.</p>
    `;
