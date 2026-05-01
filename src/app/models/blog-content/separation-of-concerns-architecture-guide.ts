export const CONTENT = `
      <p>You open a 500-line Django view function that validates input, queries the database, applies business rules, calls an external API, formats the response, and sends an email. You need to change the email provider. Good luck finding the email code without breaking everything else. This is what happens when you ignore <strong>Separation of Concerns</strong> — the most fundamental architecture principle in software engineering.</p>

      <h2>What is Separation of Concerns?</h2>
      <p><strong>Separation of Concerns (SoC)</strong> means organizing code so that each section handles <strong>one distinct responsibility</strong>. The HTTP handler handles HTTP. The business logic handles rules. The database layer handles persistence. They don't know about each other's internals.</p>

      <!-- SoC Overview -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">Separation of Concerns: Before vs After</div>
        <div class="vs-cards">
          <div class="vs-card" style="border-color:#ef4444">
            <div class="vs-card-header" style="background:#ef4444">&#x1F6AB; No SoC (Spaghetti Code)</div>
            <div class="vs-card-body">
              <div class="vs-row"><span class="vs-row-icon">&#x1F35D;</span>Everything in one function/file</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F4A3;</span>Change one thing, break three others</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F6AB;</span>Can't test business logic without database</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F92F;</span>New devs take weeks to understand</div>
            </div>
          </div>
          <div class="vs-badge">VS</div>
          <div class="vs-card" style="border-color:#22c55e">
            <div class="vs-card-header" style="background:#22c55e">&#x2705; With SoC (Clean Architecture)</div>
            <div class="vs-card-body">
              <div class="vs-row"><span class="vs-row-icon">&#x1F4E6;</span>Each module has one responsibility</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F6E1;</span>Changes are isolated to one layer</div>
              <div class="vs-row"><span class="vs-row-icon">&#x2705;</span>Test each layer independently</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F680;</span>New devs productive in days</div>
            </div>
          </div>
        </div>
      </div>

      <h2>The Classic Example: A Web API Endpoint</h2>
      <pre><code># &#x274C; BAD: Everything jammed into one view function
@app.route("/api/orders", methods=["POST"])
def create_order():
    # HTTP concern: parse request
    data = request.json
    if not data.get("items"):
        return jsonify({"error": "items required"}), 400

    # Business logic concern: calculate total
    total = 0
    for item in data["items"]:
        product = db.execute("SELECT price FROM products WHERE id = ?",
                            (item["product_id"],)).fetchone()
        if not product:
            return jsonify({"error": f"Product {item['product_id']} not found"}), 404
        total += product["price"] * item["quantity"]

    # Business rule: apply discount
    if total > 100:
        total *= 0.9  # 10% discount over $100

    # Database concern: save order
    order_id = str(uuid.uuid4())
    db.execute("INSERT INTO orders (id, user_id, total, status) VALUES (?, ?, ?, ?)",
              (order_id, data["user_id"], total, "pending"))
    for item in data["items"]:
        db.execute("INSERT INTO order_items (order_id, product_id, qty) VALUES (?, ?, ?)",
                  (order_id, item["product_id"], item["quantity"]))
    db.commit()

    # External API concern: charge payment
    stripe.PaymentIntent.create(amount=int(total * 100), currency="usd")

    # Email concern: send confirmation
    send_email(data["user_id"], f"Order {order_id} confirmed! Total: \${total:.2f}")

    # HTTP concern: format response
    return jsonify({"order_id": order_id, "total": total}), 201

# This function has 6 concerns mixed together.
# Testing any one requires ALL dependencies (database, Stripe, email).</code></pre>

      <h2>Refactored: Layered Architecture</h2>

      <!-- Layers -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">Layered Architecture (Separation of Concerns)</div>
        <div class="layer-diagram">
          <div class="layer-item" style="background:#3b82f6">Presentation Layer (HTTP/API)<span class="layer-item-sub">Parse requests, validate input, format responses. Knows nothing about business rules.</span></div>
          <div class="layer-item" style="background:#7c3aed">Service Layer (Business Logic)<span class="layer-item-sub">Apply business rules, orchestrate operations. Knows nothing about HTTP or databases.</span></div>
          <div class="layer-item" style="background:#f97316">Repository Layer (Data Access)<span class="layer-item-sub">Query and persist data. Knows nothing about business rules or HTTP.</span></div>
          <div class="layer-item" style="background:#22c55e">Infrastructure (External Services)<span class="layer-item-sub">Email, payments, file storage, message queues. Isolated behind interfaces.</span></div>
        </div>
      </div>

      <pre><code># &#x2705; GOOD: Each layer has one concern

# ── Repository Layer (data access only) ────────
class ProductRepository:
    def __init__(self, db):
        self.db = db
    def get_by_id(self, product_id: str):
        return self.db.execute("SELECT * FROM products WHERE id = ?",
                               (product_id,)).fetchone()

class OrderRepository:
    def __init__(self, db):
        self.db = db
    def save(self, order: dict, items: list):
        self.db.execute("INSERT INTO orders ...", (order["id"], order["total"]))
        for item in items:
            self.db.execute("INSERT INTO order_items ...", (order["id"], item["product_id"]))
        self.db.commit()

# ── Service Layer (business logic only) ────────
class OrderService:
    def __init__(self, product_repo, order_repo, payment, emailer):
        self.product_repo = product_repo
        self.order_repo = order_repo
        self.payment = payment
        self.emailer = emailer

    def create_order(self, user_id: str, items: list) -> dict:
        # Calculate total (business logic)
        total = 0
        for item in items:
            product = self.product_repo.get_by_id(item["product_id"])
            if not product:
                raise ValueError(f"Product {item['product_id']} not found")
            total += product["price"] * item["quantity"]

        # Apply discount (business rule)
        if total > 100:
            total *= 0.9

        # Persist
        order = {"id": str(uuid.uuid4()), "user_id": user_id, "total": total}
        self.order_repo.save(order, items)

        # Side effects
        self.payment.charge(int(total * 100))
        self.emailer.send_confirmation(user_id, order["id"], total)

        return order

# ── Presentation Layer (HTTP only) ─────────────
@app.route("/api/orders", methods=["POST"])
def create_order_endpoint():
    data = request.json

    # Validate input (HTTP concern)
    if not data.get("items"):
        return jsonify({"error": "items required"}), 400

    try:
        order = order_service.create_order(data["user_id"], data["items"])
        return jsonify({"order_id": order["id"], "total": order["total"]}), 201
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

# Each layer is independently testable:
# - Test OrderService with mock repos (no database!)
# - Test endpoint with mock OrderService (no business logic!)
# - Test ProductRepository against a test database (no HTTP!)</code></pre>

      <h2>SoC in Frontend (Angular / React)</h2>

      <!-- Frontend SoC -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">Frontend Separation of Concerns</div>
        <div class="pipeline">
          <div class="pipeline-step" style="background:#3b82f6;--i:0"><span class="pipeline-step-icon">&#x1F5BC;</span>Component<span class="pipeline-step-sub">UI rendering only</span></div>
          <div class="pipeline-arrow">&#x2192;</div>
          <div class="pipeline-step" style="background:#7c3aed;--i:1"><span class="pipeline-step-icon">&#x1F9E0;</span>Service<span class="pipeline-step-sub">Business logic</span></div>
          <div class="pipeline-arrow">&#x2192;</div>
          <div class="pipeline-step" style="background:#f97316;--i:2"><span class="pipeline-step-icon">&#x1F4E1;</span>API Client<span class="pipeline-step-sub">HTTP calls</span></div>
          <div class="pipeline-arrow">&#x2192;</div>
          <div class="pipeline-step" style="background:#22c55e;--i:3"><span class="pipeline-step-icon">&#x1F4BE;</span>State<span class="pipeline-step-sub">Data management</span></div>
        </div>
      </div>

      <pre><code>// &#x274C; BAD: Component does everything
@Component({ template: '...' })
export class OrderComponent {
  orders = [];
  async loadOrders() {
    const res = await fetch('/api/orders');   // HTTP concern
    this.orders = await res.json();
    this.orders = this.orders.filter(o => o.status !== 'cancelled');  // Business logic
    this.orders.sort((a, b) => b.total - a.total);  // Business logic
    localStorage.setItem('lastView', new Date().toISOString());  // Storage concern
  }
}

// &#x2705; GOOD: Each concern separated
// api.service.ts — HTTP only
@Injectable({ providedIn: 'root' })
export class OrderApi {
  private http = inject(HttpClient);
  getOrders() { return this.http.get&lt;Order[]&gt;('/api/orders'); }
}

// order.service.ts — Business logic only
@Injectable({ providedIn: 'root' })
export class OrderService {
  private api = inject(OrderApi);
  getActiveOrders() {
    return this.api.getOrders().pipe(
      map(orders => orders.filter(o => o.status !== 'cancelled')),
      map(orders => orders.sort((a, b) => b.total - a.total)),
    );
  }
}

// order.component.ts — UI rendering only
@Component({ template: '...' })
export class OrderComponent {
  private orderService = inject(OrderService);
  orders = toSignal(this.orderService.getActiveOrders());
}</code></pre>

      <h2>SoC in Microservices</h2>

      <!-- Microservices SoC -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">Microservices: Separation at the System Level</div>
        <div class="hub-diagram">
          <div class="hub-center" style="background:#7c3aed;box-shadow:0 0 30px rgba(124,58,237,0.3)">API Gateway<span class="hub-center-sub">Routes requests to the right service</span></div>
          <div class="hub-arrow-label"><span class="arrow-animated">&#x2B07;</span> Each service owns one business domain</div>
          <div class="hub-apps">
            <div class="hub-app"><span class="hub-app-icon">&#x1F464;</span>User Service<span class="hub-app-sub">Auth, profiles</span></div>
            <div class="hub-app" style="background:#f97316"><span class="hub-app-icon">&#x1F6D2;</span>Order Service<span class="hub-app-sub">Cart, checkout</span></div>
            <div class="hub-app" style="background:#a855f7"><span class="hub-app-icon">&#x1F4B3;</span>Payment Service<span class="hub-app-sub">Stripe, invoices</span></div>
            <div class="hub-app" style="background:#ef4444"><span class="hub-app-icon">&#x1F4E7;</span>Notification<span class="hub-app-sub">Email, SMS, push</span></div>
          </div>
        </div>
      </div>

      <h2>SoC Patterns You Should Know</h2>

      <!-- Patterns Table -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">SoC Patterns at Every Level</div>
        <div style="overflow-x:auto">
          <table style="width:100%;border-collapse:collapse;font-size:0.78rem;min-width:500px">
            <thead>
              <tr>
                <th style="text-align:left;padding:0.6rem;background:#7c3aed;color:#fff;border-radius:0.4rem 0 0 0">Level</th>
                <th style="text-align:left;padding:0.6rem;background:#7c3aed;color:#fff">Pattern</th>
                <th style="text-align:left;padding:0.6rem;background:#7c3aed;color:#fff;border-radius:0 0.4rem 0 0">What It Separates</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:var(--foreground);font-weight:700">Function</td><td style="padding:0.5rem">Single Responsibility</td><td style="padding:0.5rem">One function = one task</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:var(--foreground);font-weight:700">Class</td><td style="padding:0.5rem">SOLID Principles</td><td style="padding:0.5rem">Behavior, data, dependencies</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:var(--foreground);font-weight:700">Module</td><td style="padding:0.5rem">Layered Architecture</td><td style="padding:0.5rem">HTTP, business logic, data access</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:var(--foreground);font-weight:700">Frontend</td><td style="padding:0.5rem">Component + Service + State</td><td style="padding:0.5rem">UI rendering, logic, data management</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:var(--foreground);font-weight:700">API</td><td style="padding:0.5rem">MVC / Clean Architecture</td><td style="padding:0.5rem">Controller, Service, Repository</td></tr>
              <tr><td style="padding:0.5rem;color:var(--foreground);font-weight:700">System</td><td style="padding:0.5rem">Microservices</td><td style="padding:0.5rem">Each service owns one business domain</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <h2>SoC Beyond Code: The Software Lifecycle</h2>

      <p>Most articles stop at code-level SoC. But separation of concerns shapes <em>everything</em> in the software lifecycle — from how teams are organised, to how you deploy, to how you handle incidents at 3 AM.</p>

      <!-- SoC Lifecycle -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">Separation of Concerns Across the Software Lifecycle</div>
        <div class="layer-diagram">
          <div class="layer-item" style="background:#7c3aed">Planning: Separate product decisions from technical decisions<span class="layer-item-sub">Product owners decide WHAT to build. Engineers decide HOW to build it. Mixing these = scope creep or premature technical decisions.</span></div>
          <div class="layer-item" style="background:#3b82f6">Development: Separate feature code from infrastructure code<span class="layer-item-sub">Business logic in /src. CI/CD in /.github. Infra in /terraform. Database in /migrations. Each concern in its own home.</span></div>
          <div class="layer-item" style="background:#22c55e">Testing: Separate unit tests from integration tests from E2E tests<span class="layer-item-sub">Unit tests: fast, isolated, no DB. Integration: real DB, no UI. E2E: full browser. Each catches different bugs.</span></div>
          <div class="layer-item" style="background:#f97316">Deployment: Separate build from deploy from release<span class="layer-item-sub">Build = compile the artifact. Deploy = put it on servers. Release = enable for users (feature flags). Three separate steps.</span></div>
          <div class="layer-item" style="background:#ef4444">Operations: Separate monitoring from alerting from incident response<span class="layer-item-sub">Monitoring collects data. Alerting decides what's urgent. Incident response handles the human process. Different tools, different owners.</span></div>
        </div>
      </div>

      <h2>SoC in Team Structure</h2>

      <p>Conway's Law says: <em>"Organizations design systems that mirror their communication structures."</em> If your frontend team and backend team sit in different buildings, you'll get a frontend-backend separation in your architecture. SoC in teams directly shapes SoC in code.</p>

      <pre><code># &#x274C; BAD: One "full-stack" team does everything
Team: does product design + frontend + backend + database + DevOps + testing + on-call
Result: no clear ownership, everything is everyone's problem (= nobody's problem)

# &#x2705; GOOD: Separated concerns with clear ownership
Product team: defines requirements, priorities, user research
Frontend team: UI components, user experience, client-side state
Backend team: APIs, business logic, data models
Platform team: CI/CD, infrastructure, monitoring, shared libraries
QA team: test strategy, automation frameworks, quality gates

# Each team has a clear concern. When something breaks,
# you know exactly who owns the fix.
# PRs are reviewed by the right people.
# Roadmaps are planned by the right stakeholders.</code></pre>

      <h2>SoC in Testing</h2>

      <pre><code># The Testing Pyramid = Separation of Concerns applied to testing

# Layer 1: Unit Tests (fast, many, no dependencies)
def test_calculate_tax():
    assert calculate_tax(100, rate=0.2) == 20.0
    assert calculate_tax(0, rate=0.2) == 0.0
# Tests ONE function. No database. No HTTP. No filesystem.
# Runs in milliseconds. Catches logic bugs.

# Layer 2: Integration Tests (medium, real dependencies)
def test_create_order_saves_to_db():
    order = OrderService(real_db).create(items=[{"id": 1, "qty": 2}])
    assert Order.query.get(order.id) is not None
    assert order.total == 49.98
# Tests service + database together. Catches wiring bugs.

# Layer 3: E2E Tests (slow, few, full system)
def test_user_can_checkout():
    browser.login("alice@test.com")
    browser.add_to_cart("Widget")
    browser.click("Checkout")
    assert browser.page.has_text("Order confirmed!")
# Tests the entire flow. Catches UX and integration bugs.

# Why separate them?
# Unit tests: run in CI on every commit (30 seconds)
# Integration tests: run in CI before merge (2 minutes)
# E2E tests: run nightly or before release (10 minutes)
#
# Mixing them means ALL tests are slow, flaky, and hard to debug.</code></pre>

      <h2>SoC in Deployment</h2>

      <p>This is one that catches many teams off guard. <strong>Building, deploying, and releasing are three separate concerns.</strong></p>

      <!-- Deploy Pipeline -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">Build &#x2260; Deploy &#x2260; Release</div>
        <div class="pipeline">
          <div class="pipeline-step" style="background:#3b82f6;--i:0"><span class="pipeline-step-icon">&#x1F528;</span>Build<span class="pipeline-step-sub">Compile, test, create artifact</span></div>
          <div class="pipeline-arrow">&#x2192;</div>
          <div class="pipeline-step" style="background:#7c3aed;--i:1"><span class="pipeline-step-icon">&#x1F680;</span>Deploy<span class="pipeline-step-sub">Put artifact on servers</span></div>
          <div class="pipeline-arrow">&#x2192;</div>
          <div class="pipeline-step" style="background:#22c55e;--i:2"><span class="pipeline-step-icon">&#x1F3C1;</span>Release<span class="pipeline-step-sub">Enable for users (feature flag)</span></div>
        </div>
      </div>

      <pre><code># Why separate them?

# BUILD: "Did the code compile and pass tests?"
# This happens in CI. Produces a versioned artifact (Docker image, binary).
# Concern: correctness.

# DEPLOY: "Is the new code running on servers?"
# This happens via CD (ArgoCD, Spinnaker, kubectl).
# The new code is ON the servers but NOT visible to users yet.
# Concern: infrastructure.

# RELEASE: "Can users see the new feature?"
# This happens via feature flags (LaunchDarkly, Unleash).
# You flip a flag, 1% of users see the feature. Then 10%. Then 100%.
# Concern: product risk.

# If you mix these, you get:
# "The deploy broke production" → because deploy = release simultaneously
# "We can't roll back the feature" → because there's no flag, only deploy
# "We need a hotfix" → because you can't disable just the broken feature

# Separated:
# Deploy failed? Rollback the deployment. Feature flag stays off.
# Feature buggy? Turn off the flag. Deploy stays up.
# Need to A/B test? Flag to 50%. No new deploys needed.</code></pre>

      <h2>SoC in Incident Response</h2>

      <pre><code># Even your incident process should have separated concerns:

# DETECT: "Something is wrong"
# Concern: monitoring tools (Datadog, Prometheus, PagerDuty)
# Owner: platform/SRE team
# Tool: automated alerts, anomaly detection

# TRIAGE: "How bad is it?"
# Concern: classify severity (P1 = total outage, P2 = partial, P3 = degraded)
# Owner: on-call engineer
# Tool: runbook, status page

# RESPOND: "Fix it right now"
# Concern: restore service (rollback, scale up, toggle feature flag)
# Owner: on-call engineer + team lead
# Tool: deployment pipeline, feature flags, database access

# COMMUNICATE: "Tell stakeholders what's happening"
# Concern: customer communication, exec updates
# Owner: support/comms team
# Tool: status page, Slack, email

# REVIEW: "Why did it happen and how do we prevent it?"
# Concern: root cause analysis, action items
# Owner: engineering team (blameless post-mortem)
# Tool: post-mortem document, JIRA tickets

# Each step is a DIFFERENT CONCERN with a DIFFERENT OWNER.
# When you mix them: the engineer fixing the bug is also writing
# the customer email and updating the status page = chaos.</code></pre>

      <h2>SoC in Data</h2>

      <pre><code># Even your data should have separated concerns:

# &#x274C; BAD: One database does everything
PostgreSQL handles:
  - User authentication (sessions, tokens)
  - Application data (orders, products, customers)
  - Analytics (page views, funnel tracking)
  - Background job queue (sidekiq/celery jobs)
  - Full-text search (product search)
  - Caching (frequently accessed data)

# Result: one slow analytics query takes down the checkout flow.
# One cache stampede slows user login.

# &#x2705; GOOD: Separated by concern
PostgreSQL:  Application data (orders, products, users)
Redis:       Caching + session storage + background job queue
Elasticsearch: Full-text search
ClickHouse:  Analytics and event tracking
S3:          File storage (uploads, exports)

# Each system optimised for its specific concern.
# Analytics can't slow down checkout.
# Search can be rebuilt without touching the main DB.</code></pre>

      <h2>When SoC Goes Too Far</h2>

      <p>Fair warning — SoC is not "split everything into the smallest possible pieces." Over-separation is just as harmful as no separation:</p>

      <ul>
        <li><strong>500 microservices for a 10-person team</strong> = operational nightmare. You've separated concerns to the point where nobody can understand the system.</li>
        <li><strong>10 layers of abstraction for a CRUD endpoint</strong> = over-engineering. Controller → Service → Repository → DAO → Entity → DTO → Mapper → Validator → Transformer = insanity for a simple GET.</li>
        <li><strong>Separate repos for every tiny library</strong> = dependency hell. You spend more time managing versions than writing code.</li>
      </ul>

      <p>The right level of separation is the one where <strong>each piece can change independently without breaking the others</strong>. If two things always change together, they belong together. If they never change together, they should be separated. That's the real test.</p>

      <p>Separation of Concerns is not about creating more files — it's about creating <strong>boundaries that protect you from change</strong>. When your email provider changes, only the email module changes. When your database changes, only the repository changes. When your UI framework changes, only the components change. And when your deployment breaks, only the deployment pipeline is investigated — not the feature code, the test suite, and the monitoring stack all at once. Build these boundaries from day one — in your code, your tests, your deployment, your team structure, and your incident response — and your software will scale with your organisation instead of against it.</p>
    `;
