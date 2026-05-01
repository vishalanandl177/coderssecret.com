export const CONTENT = `
      <p>Every Angular team eventually debates state management. One developer wants NgRx for &ldquo;proper architecture.&rdquo; Another says signals make everything simpler. A third argues that injectable services with BehaviorSubjects work fine. They are all right &mdash; for different scenarios.</p>

      <h2>The Three Approaches</h2>

      <h3>1. Simple Services (BehaviorSubject / Signals)</h3>

      <pre><code>// Simplest approach: service with signals
@Injectable({ providedIn: 'root' })
export class CartService {
  private _items = signal&lt;CartItem[]&gt;([]);

  readonly items = this._items.asReadonly();
  readonly total = computed(() =>
    this._items().reduce((sum, item) => sum + item.price * item.qty, 0)
  );
  readonly count = computed(() =>
    this._items().reduce((sum, item) => sum + item.qty, 0)
  );

  addItem(product: Product) {
    this._items.update(items => {
      const existing = items.find(i => i.productId === product.id);
      if (existing) {
        return items.map(i =>
          i.productId === product.id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...items, { productId: product.id, name: product.name, price: product.price, qty: 1 }];
    });
  }

  removeItem(productId: string) {
    this._items.update(items => items.filter(i => i.productId !== productId));
  }

  clear() {
    this._items.set([]);
  }
}

// Component usage: dead simple
@Component({
  template: \\\`
    &lt;span&gt;Cart ({{ cart.count() }})&lt;/span&gt;
    &lt;span&gt;Total: {{ cart.total() | currency }}&lt;/span&gt;
  \\\`
})
export class CartBadgeComponent {
  cart = inject(CartService);
}</code></pre>

      <h3>2. NgRx Store (Redux Pattern)</h3>

      <pre><code>// Actions: what happened
export const CartActions = createActionGroup({
  source: 'Cart',
  events: {
    'Add Item': props&lt;{ product: Product }&gt;(),
    'Remove Item': props&lt;{ productId: string }&gt;(),
    'Clear Cart': emptyProps(),
    'Load Cart Success': props&lt;{ items: CartItem[] }&gt;(),
    'Load Cart Failure': props&lt;{ error: string }&gt;(),
  },
});

// Reducer: how state changes
export const cartReducer = createReducer(
  initialState,
  on(CartActions.addItem, (state, { product }) => ({
    ...state,
    items: addOrIncrement(state.items, product),
  })),
  on(CartActions.removeItem, (state, { productId }) => ({
    ...state,
    items: state.items.filter(i => i.productId !== productId),
  })),
  on(CartActions.clearCart, () => initialState),
  on(CartActions.loadCartSuccess, (state, { items }) => ({
    ...state,
    items,
    loaded: true,
  })),
);

// Selectors: derived state
export const selectCartItems = createSelector(selectCart, state => state.items);
export const selectCartTotal = createSelector(selectCartItems, items =>
  items.reduce((sum, i) => sum + i.price * i.qty, 0)
);

// Effects: side effects (API calls)
@Injectable()
export class CartEffects {
  loadCart$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.loadCart),
      switchMap(() =>
        this.cartApi.load().pipe(
          map(items => CartActions.loadCartSuccess({ items })),
          catchError(error => of(CartActions.loadCartFailure({ error: error.message })))
        )
      )
    )
  );

  constructor(private actions$: Actions, private cartApi: CartApiService) {}
}

// Component usage
@Component({
  template: \\\`
    &lt;span&gt;Total: {{ total$ | async | currency }}&lt;/span&gt;
  \\\`
})
export class CartBadgeComponent {
  total$ = this.store.select(selectCartTotal);
  constructor(private store: Store) {}
}</code></pre>

      <h3>3. Signal Store (NgRx Signals)</h3>

      <pre><code>// NgRx SignalStore: NgRx concepts with signal ergonomics
export const CartStore = signalStore(
  { providedIn: 'root' },
  withState&lt;CartState&gt;({
    items: [],
    loaded: false,
    error: null,
  }),
  withComputed(({ items }) => ({
    total: computed(() => items().reduce((sum, i) => sum + i.price * i.qty, 0)),
    count: computed(() => items().reduce((sum, i) => sum + i.qty, 0)),
  })),
  withMethods((store, cartApi = inject(CartApiService)) => ({
    addItem(product: Product) {
      patchState(store, { items: addOrIncrement(store.items(), product) });
    },
    removeItem(productId: string) {
      patchState(store, { items: store.items().filter(i => i.productId !== productId) });
    },
    async loadCart() {
      try {
        const items = await firstValueFrom(cartApi.load());
        patchState(store, { items, loaded: true });
      } catch (e) {
        patchState(store, { error: 'Failed to load cart' });
      }
    },
  })),
);

// Component usage
@Component({
  template: \\\`
    &lt;span&gt;Cart ({{ store.count() }})&lt;/span&gt;
    &lt;span&gt;Total: {{ store.total() | currency }}&lt;/span&gt;
  \\\`
})
export class CartBadgeComponent {
  store = inject(CartStore);
}</code></pre>

      <h2>Comparison Table</h2>

      <table>
        <thead>
          <tr>
            <th>Criteria</th>
            <th>Services + Signals</th>
            <th>NgRx Store</th>
            <th>NgRx SignalStore</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Boilerplate</td>
            <td>Minimal</td>
            <td>High (actions, reducers, effects, selectors)</td>
            <td>Medium</td>
          </tr>
          <tr>
            <td>Learning Curve</td>
            <td>Low</td>
            <td>High (Redux concepts)</td>
            <td>Medium</td>
          </tr>
          <tr>
            <td>DevTools</td>
            <td>None</td>
            <td>Excellent (time-travel debugging)</td>
            <td>Limited</td>
          </tr>
          <tr>
            <td>Predictability</td>
            <td>Good</td>
            <td>Excellent (strict unidirectional flow)</td>
            <td>Good</td>
          </tr>
          <tr>
            <td>Testing</td>
            <td>Easy (just call methods)</td>
            <td>Structured (test reducers, effects separately)</td>
            <td>Easy</td>
          </tr>
          <tr>
            <td>Async Handling</td>
            <td>Manual (RxJS in service)</td>
            <td>Effects (declarative)</td>
            <td>Methods (imperative async)</td>
          </tr>
          <tr>
            <td>Team Scale</td>
            <td>Small (1-5 devs)</td>
            <td>Large (10+ devs, enforced patterns)</td>
            <td>Medium (5-10 devs)</td>
          </tr>
        </tbody>
      </table>

      <h2>Decision Framework</h2>

      <ul>
        <li><strong>Small app, small team (1-5 devs):</strong> Services with signals. Simple, fast, no overhead.</li>
        <li><strong>Medium app, medium team (5-10 devs):</strong> NgRx SignalStore. Structured patterns without Redux verbosity.</li>
        <li><strong>Large enterprise app (10+ devs):</strong> NgRx Store. Enforced architecture, time-travel debugging, established patterns.</li>
        <li><strong>State shared across many components:</strong> Any centralized store (NgRx or signal service at root).</li>
        <li><strong>State local to one component:</strong> Just use a signal in the component. No store needed.</li>
        <li><strong>Complex async workflows:</strong> NgRx Effects or RxJS in services. Signals alone do not handle streams.</li>
      </ul>

      <h2>Key Takeaways</h2>

      <ul>
        <li><strong>Start with the simplest approach that works</strong> &mdash; signal services for most apps</li>
        <li><strong>NgRx Store earns its complexity at scale</strong> &mdash; with large teams, the enforced patterns prevent chaos</li>
        <li><strong>NgRx SignalStore is the middle ground</strong> &mdash; structured state management without Redux boilerplate</li>
        <li><strong>Local state stays local</strong> &mdash; not everything belongs in a global store</li>
        <li><strong>You can mix approaches</strong> &mdash; global auth state in a service, feature state in NgRx, component state in signals</li>
        <li><strong>The best state management is the one your team understands</strong> &mdash; a well-used simple approach beats a misused complex one</li>
      </ul>

      <p>State management is a spectrum, not a binary choice. Match the tool to the problem: signals for simple state, signal stores for moderate complexity, full NgRx for enterprise-scale applications with strict architectural requirements. The goal is managing complexity, not adding it.</p>
    `;
