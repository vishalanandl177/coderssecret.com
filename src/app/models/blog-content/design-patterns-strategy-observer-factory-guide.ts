export const CONTENT = `
      <p>Design patterns have a reputation problem. The Gang of Four book describes 23 patterns, most developers memorize a few for interviews, and then never consciously use them. But the truth is you use design patterns every day &mdash; you just do not call them by name.</p>

      <p>This guide covers the 7 patterns that genuinely appear in production code, with practical examples in Python and TypeScript.</p>

      <h2>1. Strategy Pattern: Swappable Algorithms</h2>

      <p>Replace conditional logic with interchangeable objects that encapsulate different behaviors. You have already used this if you have ever passed a function as an argument.</p>

      <pre><code># Without Strategy: growing if/else chain
def calculate_shipping(order, method):
    if method == "standard":
        return order.weight * 0.5
    elif method == "express":
        return order.weight * 1.5 + 10
    elif method == "overnight":
        return order.weight * 3.0 + 25
    elif method == "drone":       # New method = modify this function
        return 50.0

# With Strategy: each algorithm is a separate callable
from typing import Protocol

class ShippingStrategy(Protocol):
    def calculate(self, order) -> float: ...

class StandardShipping:
    def calculate(self, order) -> float:
        return order.weight * 0.5

class ExpressShipping:
    def calculate(self, order) -> float:
        return order.weight * 1.5 + 10

class OvernightShipping:
    def calculate(self, order) -> float:
        return order.weight * 3.0 + 25

# Usage: swap strategy without changing caller
def checkout(order, shipping: ShippingStrategy):
    cost = shipping.calculate(order)
    return cost

checkout(order, ExpressShipping())  # Easy to add new strategies</code></pre>

      <p><strong>Where you see it:</strong> Sorting algorithms (key functions), authentication strategies (Passport.js), payment processors, serialization formats.</p>

      <h2>2. Observer Pattern: Event-Driven Communication</h2>

      <p>When one object changes, notify all interested objects automatically. This is the foundation of event-driven programming.</p>

      <pre><code># Python implementation
class EventEmitter:
    def __init__(self):
        self._listeners: dict[str, list] = {}

    def on(self, event: str, callback):
        self._listeners.setdefault(event, []).append(callback)

    def emit(self, event: str, data=None):
        for callback in self._listeners.get(event, []):
            callback(data)

# Usage
events = EventEmitter()

# Register observers
events.on("order:created", lambda order: send_email(order))
events.on("order:created", lambda order: update_inventory(order))
events.on("order:created", lambda order: notify_warehouse(order))

# Trigger event - all observers run
events.emit("order:created", new_order)</code></pre>

      <pre><code>// TypeScript: Angular uses this everywhere (RxJS Subjects)
import { Subject } from 'rxjs';

class OrderService {
  private orderCreated = new Subject&lt;Order&gt;();
  orderCreated$ = this.orderCreated.asObservable();

  createOrder(data: OrderData): Order {
    const order = this.save(data);
    this.orderCreated.next(order);  // Notify all subscribers
    return order;
  }
}

// Subscribers
orderService.orderCreated$.subscribe(order => sendEmail(order));
orderService.orderCreated$.subscribe(order => updateAnalytics(order));</code></pre>

      <p><strong>Where you see it:</strong> DOM events (addEventListener), RxJS, Node.js EventEmitter, React state management, message queues.</p>

      <h2>3. Factory Pattern: Object Creation Logic</h2>

      <p>Encapsulate object creation when the exact type depends on runtime conditions. Instead of the caller knowing every possible class, the factory decides.</p>

      <pre><code># Without Factory: caller must know every type
def process_payment(method, amount):
    if method == "credit_card":
        processor = CreditCardProcessor()
    elif method == "paypal":
        processor = PayPalProcessor()
    elif method == "crypto":
        processor = CryptoProcessor()
    processor.charge(amount)

# With Factory: creation logic in one place
class PaymentFactory:
    _processors = {
        "credit_card": CreditCardProcessor,
        "paypal": PayPalProcessor,
        "crypto": CryptoProcessor,
    }

    @classmethod
    def create(cls, method: str) -> PaymentProcessor:
        processor_cls = cls._processors.get(method)
        if not processor_cls:
            raise ValueError(f"Unknown payment method: {method}")
        return processor_cls()

# Usage: clean and extensible
processor = PaymentFactory.create("paypal")
processor.charge(99.99)

# Adding a new method: just register it
PaymentFactory._processors["apple_pay"] = ApplePayProcessor</code></pre>

      <p><strong>Where you see it:</strong> Django&rsquo;s ORM (model instances from query results), React.createElement, database connection factories, logger factories.</p>

      <h2>4. Decorator Pattern: Adding Behavior Without Modification</h2>

      <p>Wrap an object to add functionality without changing its interface. Python decorators are the most famous implementation, but the pattern is broader than the syntax.</p>

      <pre><code># Python decorators ARE the decorator pattern
import functools
import time
import logging

def retry(max_attempts=3, delay=1):
    """Decorator that retries a function on failure."""
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            for attempt in range(max_attempts):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    if attempt == max_attempts - 1:
                        raise
                    time.sleep(delay * (2 ** attempt))
            return None
        return wrapper
    return decorator

def log_calls(func):
    """Decorator that logs function calls."""
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        logging.info(f"Calling {func.__name__}")
        result = func(*args, **kwargs)
        logging.info(f"{func.__name__} returned {result}")
        return result
    return wrapper

# Stack decorators: each wraps the previous
@retry(max_attempts=3)
@log_calls
def fetch_user_data(user_id):
    return api.get(f"/users/{user_id}")</code></pre>

      <pre><code>// TypeScript: class-based decorator pattern
interface DataSource {
  read(): string[];
}

class FileDataSource implements DataSource {
  read(): string[] { return readFile('data.csv'); }
}

// Decorator: adds caching without modifying FileDataSource
class CachedDataSource implements DataSource {
  private cache: string[] | null = null;
  constructor(private wrapped: DataSource) {}

  read(): string[] {
    if (!this.cache) {
      this.cache = this.wrapped.read();
    }
    return this.cache;
  }
}

// Decorator: adds logging
class LoggedDataSource implements DataSource {
  constructor(private wrapped: DataSource) {}

  read(): string[] {
    console.log('Reading data...');
    const result = this.wrapped.read();
    console.log(\`Read \${result.length} records\`);
    return result;
  }
}

// Compose: logged + cached + file
const source = new LoggedDataSource(
  new CachedDataSource(
    new FileDataSource()
  )
);</code></pre>

      <p><strong>Where you see it:</strong> Python decorators (@app.route, @login_required), Express middleware, Java annotations, TypeScript decorators.</p>

      <h2>5. Singleton Pattern: One Instance, Global Access</h2>

      <p>Ensure a class has exactly one instance. Controversial but practical for shared resources like database connections, loggers, and configuration.</p>

      <pre><code># Python: module-level is already a singleton
# config.py
class Config:
    def __init__(self):
        self.db_url = os.environ["DATABASE_URL"]
        self.redis_url = os.environ["REDIS_URL"]
        self.debug = os.environ.get("DEBUG", "false") == "true"

config = Config()  # Created once when module is imported

# All other files:
from config import config  # Same instance everywhere</code></pre>

      <pre><code>// TypeScript: Angular services are singletons by default
@Injectable({ providedIn: 'root' })  // One instance for the entire app
export class AuthService {
  private currentUser = signal&lt;User | null&gt;(null);

  // Every component that injects AuthService gets the SAME instance
  login(credentials: Credentials) { ... }
  logout() { ... }
}</code></pre>

      <p><strong>Where you see it:</strong> Angular services (providedIn: root), Python modules, database connection pools, logging.getLogger().</p>

      <h2>6. Adapter Pattern: Making Incompatible Interfaces Work Together</h2>

      <p>Wrap an existing class so it matches the interface your code expects. Essential when integrating third-party libraries or legacy systems.</p>

      <pre><code># Your code expects this interface:
class PaymentGateway(Protocol):
    def charge(self, amount: float, currency: str) -> dict: ...

# But the Stripe SDK has a different interface:
# stripe.PaymentIntent.create(amount=1000, currency="usd")  # amount in cents!

# Adapter: wraps Stripe to match your interface
class StripeAdapter:
    def charge(self, amount: float, currency: str) -> dict:
        # Convert dollars to cents (Stripe's format)
        intent = stripe.PaymentIntent.create(
            amount=int(amount * 100),
            currency=currency.lower(),
        )
        return {
            "id": intent.id,
            "status": "success" if intent.status == "succeeded" else "pending",
            "amount": amount,
        }

# Another adapter for PayPal (different API entirely)
class PayPalAdapter:
    def charge(self, amount: float, currency: str) -> dict:
        order = paypal.Order.create(
            purchase_units=[{"amount": {"value": str(amount), "currency_code": currency}}]
        )
        return {
            "id": order.id,
            "status": "success" if order.status == "COMPLETED" else "pending",
            "amount": amount,
        }

# Your code works with any adapter:
def process_payment(gateway: PaymentGateway, amount: float):
    result = gateway.charge(amount, "USD")
    return result</code></pre>

      <p><strong>Where you see it:</strong> ORM adapters (SQLAlchemy supports PostgreSQL, MySQL, SQLite through adapters), logging handlers, API client wrappers.</p>

      <h2>7. Builder Pattern: Complex Object Construction</h2>

      <p>Construct complex objects step by step instead of through a constructor with 15 parameters.</p>

      <pre><code># Without Builder: constructor with too many parameters
query = SQLQuery(
    table="users",
    columns=["name", "email"],
    where="age > 18",
    order_by="name",
    order_dir="ASC",
    limit=100,
    offset=0,
    join_table="orders",
    join_condition="users.id = orders.user_id",
    group_by="name",
    having="COUNT(*) > 5",
)

# With Builder: readable, chainable construction
class QueryBuilder:
    def __init__(self, table: str):
        self._table = table
        self._columns = ["*"]
        self._conditions = []
        self._order = None
        self._limit = None

    def select(self, *columns):
        self._columns = list(columns)
        return self  # Return self for chaining

    def where(self, condition: str):
        self._conditions.append(condition)
        return self

    def order_by(self, column: str, direction: str = "ASC"):
        self._order = f"{column} {direction}"
        return self

    def limit(self, n: int):
        self._limit = n
        return self

    def build(self) -> str:
        query = f"SELECT {', '.join(self._columns)} FROM {self._table}"
        if self._conditions:
            query += " WHERE " + " AND ".join(self._conditions)
        if self._order:
            query += f" ORDER BY {self._order}"
        if self._limit:
            query += f" LIMIT {self._limit}"
        return query

# Usage: reads like English
query = (QueryBuilder("users")
    .select("name", "email")
    .where("age > 18")
    .where("status = 'active'")
    .order_by("name")
    .limit(100)
    .build()
)</code></pre>

      <p><strong>Where you see it:</strong> ORM query builders (Django QuerySet, SQLAlchemy), HTTP request builders, test data builders, UI component builders.</p>

      <h2>Pattern Selection Guide</h2>

      <table>
        <thead>
          <tr>
            <th>Problem</th>
            <th>Pattern</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Multiple algorithms for the same task</td>
            <td>Strategy</td>
          </tr>
          <tr>
            <td>Notify multiple objects of state changes</td>
            <td>Observer</td>
          </tr>
          <tr>
            <td>Object creation depends on runtime data</td>
            <td>Factory</td>
          </tr>
          <tr>
            <td>Add behavior without modifying existing code</td>
            <td>Decorator</td>
          </tr>
          <tr>
            <td>Exactly one shared instance needed</td>
            <td>Singleton</td>
          </tr>
          <tr>
            <td>Integrate incompatible third-party interfaces</td>
            <td>Adapter</td>
          </tr>
          <tr>
            <td>Complex object with many configuration options</td>
            <td>Builder</td>
          </tr>
        </tbody>
      </table>

      <h2>Key Takeaways</h2>

      <ul>
        <li><strong>Patterns are tools, not goals</strong> &mdash; do not force a pattern where a simple function would do</li>
        <li><strong>Strategy eliminates if/else chains</strong> &mdash; use it when you have multiple algorithms for the same task</li>
        <li><strong>Observer decouples producers from consumers</strong> &mdash; the foundation of event-driven architecture</li>
        <li><strong>Factory centralizes creation logic</strong> &mdash; add new types without modifying calling code</li>
        <li><strong>Decorator adds behavior without inheritance</strong> &mdash; compose small, focused wrappers</li>
        <li><strong>Singleton is just a module-level instance in Python</strong> and providedIn: root in Angular</li>
        <li><strong>Adapter wraps third-party code</strong> to match your interfaces &mdash; essential for swappable integrations</li>
        <li><strong>Builder replaces constructors with 10+ parameters</strong> &mdash; readable, chainable, self-documenting</li>
      </ul>

      <p>The best code uses patterns without naming them. If you write a function that takes a callback, you are using Strategy. If you emit events, you are using Observer. If you wrap a class to add logging, you are using Decorator. The patterns are already in your code &mdash; knowing their names helps you communicate about them and apply them intentionally.</p>
    `;
