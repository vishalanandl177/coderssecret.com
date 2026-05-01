export const CONTENT = `
      <p>You're building a SaaS product. Ten companies sign up. Then a hundred. Then a thousand. Each company — each <strong>tenant</strong> — thinks they're the only customer. They expect their data to be private, their experience to be customised, and their performance to be unaffected by what other tenants are doing. Meanwhile, you're running one codebase, one infrastructure, and trying not to go bankrupt on hosting costs.</p>

      <p>Welcome to multi-tenancy — the architecture pattern that makes SaaS economically viable. Get it right and you scale to millions of tenants on shared infrastructure. Get it wrong and you have data leaks, noisy neighbours, and midnight pages.</p>

      <h2>What is Multi-Tenancy?</h2>

      <p>A <strong>tenant</strong> is an organisational unit — usually a company, team, or workspace — that uses your SaaS product. Multi-tenancy means <strong>multiple tenants share the same application instance and infrastructure</strong>, but their data and experience are isolated from each other.</p>

      <!-- Single vs Multi -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">Single-Tenant vs Multi-Tenant</div>
        <div class="vs-cards">
          <div class="vs-card" style="border-color:#f97316">
            <div class="vs-card-header" style="background:#f97316">Single-Tenant (one instance per customer)</div>
            <div class="vs-card-body">
              <div class="vs-row"><span class="vs-row-icon">&#x1F4BB;</span>Separate deployment per customer</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F512;</span>Strongest isolation (separate everything)</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F4B8;</span>Most expensive to operate</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F6E0;</span>N customers = N deployments to maintain</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F3AF;</span>On-prem, regulated industries, enterprise</div>
            </div>
          </div>
          <div class="vs-badge">VS</div>
          <div class="vs-card" style="border-color:#22c55e">
            <div class="vs-card-header" style="background:#22c55e">Multi-Tenant (shared instance, isolated data)</div>
            <div class="vs-card-body">
              <div class="vs-row"><span class="vs-row-icon">&#x1F4BB;</span>One deployment serves all customers</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F512;</span>Logical isolation (same DB, filtered by tenant)</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F4B0;</span>Most cost-efficient</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F6E0;</span>One deployment to maintain</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F3AF;</span>SaaS, cloud products, PLG startups</div>
            </div>
          </div>
        </div>
      </div>

      <h2>The Three Isolation Models</h2>

      <p>The biggest architectural decision in multi-tenancy is <strong>how to isolate tenant data</strong>. There are three main approaches, each with different trade-offs:</p>

      <!-- Three Models -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">Tenant Data Isolation Models</div>
        <div class="layer-diagram">
          <div class="layer-item" style="background:#22c55e">Model 1: Shared Database, Shared Schema<span class="layer-item-sub">All tenants in one table, filtered by tenant_id column. Simplest. Most common for startups.</span></div>
          <div class="layer-item" style="background:#3b82f6">Model 2: Shared Database, Separate Schema<span class="layer-item-sub">Each tenant gets their own schema (PostgreSQL schema or MySQL database). Middle ground.</span></div>
          <div class="layer-item" style="background:#7c3aed">Model 3: Separate Database per Tenant<span class="layer-item-sub">Each tenant has a completely separate database instance. Strongest isolation, highest cost.</span></div>
        </div>
      </div>

      <h2>Model 1: Shared Database, Shared Schema (The Default)</h2>

      <p>This is where most SaaS products start, and where many successfully stay forever. Every table has a <code>tenant_id</code> column. Every query filters by it. Simple.</p>

      <pre><code>-- PostgreSQL: Shared schema with tenant_id
CREATE TABLE users (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id   UUID NOT NULL REFERENCES tenants(id),
    email       VARCHAR(255) NOT NULL,
    name        VARCHAR(255),
    role        VARCHAR(50) DEFAULT 'member',
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(tenant_id, email)  -- Email unique WITHIN a tenant, not globally
);

CREATE TABLE orders (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id   UUID NOT NULL REFERENCES tenants(id),
    user_id     UUID REFERENCES users(id),
    total       DECIMAL(10,2),
    status      VARCHAR(50),
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- CRITICAL: Create indexes on tenant_id for every table!
CREATE INDEX idx_users_tenant ON users(tenant_id);
CREATE INDEX idx_orders_tenant ON orders(tenant_id);
CREATE INDEX idx_orders_tenant_status ON orders(tenant_id, status);

-- Every query MUST filter by tenant_id
-- &#x274C; WRONG (data leak!):
SELECT * FROM orders WHERE status = 'pending';

-- &#x2705; RIGHT:
SELECT * FROM orders WHERE tenant_id = '...' AND status = 'pending';</code></pre>

      <pre><code># Python/Django: Automatic tenant filtering middleware
# Every request must include the tenant context

class TenantMiddleware:
    """Extract tenant from subdomain and inject into request."""
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Extract tenant from subdomain: acme.myapp.com -> "acme"
        host = request.get_host().split(':')[0]
        subdomain = host.split('.')[0]

        tenant = Tenant.objects.filter(slug=subdomain).first()
        if not tenant:
            return HttpResponse("Tenant not found", status=404)

        request.tenant = tenant
        return self.get_response(request)

# Django model with automatic tenant filtering
class TenantAwareManager(models.Manager):
    def get_queryset(self):
        # This requires tenant context to be set (via middleware)
        return super().get_queryset()

    def for_tenant(self, tenant):
        return self.get_queryset().filter(tenant=tenant)

class Order(models.Model):
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE)
    total = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=50)

    objects = TenantAwareManager()

# Usage in views:
def list_orders(request):
    # ALWAYS filter by request.tenant
    orders = Order.objects.for_tenant(request.tenant).filter(status='pending')
    return JsonResponse(list(orders.values()), safe=False)

# &#x26A0; The risk: one missing .for_tenant() call = data leak across tenants
# Solution: Use Row-Level Security (RLS) in PostgreSQL as a safety net</code></pre>

      <pre><code>-- PostgreSQL Row-Level Security (RLS) — the safety net
-- Even if application code forgets to filter, the DB enforces it

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation ON orders
    USING (tenant_id = current_setting('app.current_tenant_id')::UUID);

-- Before each request, set the tenant context:
-- SET app.current_tenant_id = 'abc-123-def';

-- Now even "SELECT * FROM orders" only returns the current tenant's data
-- RLS is the LAST line of defence against data leaks</code></pre>

      <h2>Model 2: Shared Database, Separate Schema</h2>

      <p>Each tenant gets their own PostgreSQL schema (or MySQL database). Tables are identical but namespaced: <code>tenant_acme.orders</code>, <code>tenant_globex.orders</code>.</p>

      <pre><code>-- PostgreSQL: Create a schema per tenant
CREATE SCHEMA tenant_acme;
CREATE SCHEMA tenant_globex;

-- Create tables in each schema (same structure)
CREATE TABLE tenant_acme.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    total DECIMAL(10,2),
    status VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE tenant_globex.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    total DECIMAL(10,2),
    status VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Switch schema per request using search_path
SET search_path TO tenant_acme;
SELECT * FROM orders;  -- Only sees acme's orders

SET search_path TO tenant_globex;
SELECT * FROM orders;  -- Only sees globex's orders

-- Django: django-tenants library handles this automatically
# settings.py
DATABASES = {
    'default': {
        'ENGINE': 'django_tenants.postgresql_backend',
        'NAME': 'myapp',
    }
}
TENANT_MODEL = 'tenants.Tenant'
MIDDLEWARE = ['django_tenants.middleware.TenantSubdomainMiddleware', ...]</code></pre>

      <h2>Model 3: Separate Database per Tenant</h2>

      <p>The nuclear option. Each tenant gets their own database instance. Maximum isolation but maximum operational complexity.</p>

      <pre><code># Separate database per tenant — connection routing
import os

TENANT_DB_MAP = {
    'acme': {
        'host': 'acme-db.cluster.us-east-1.rds.amazonaws.com',
        'name': 'acme_production',
    },
    'globex': {
        'host': 'globex-db.cluster.us-east-1.rds.amazonaws.com',
        'name': 'globex_production',
    },
}

def get_db_connection(tenant_slug):
    """Route to the correct database based on tenant."""
    config = TENANT_DB_MAP.get(tenant_slug)
    if not config:
        raise ValueError(f"Unknown tenant: {tenant_slug}")
    return psycopg2.connect(
        host=config['host'],
        dbname=config['name'],
        user=os.environ['DB_USER'],
        password=os.environ['DB_PASSWORD'],
    )

# Used by: banks, healthcare, government — where regulatory
# requirements mandate complete physical data separation</code></pre>

      <h2>Comparison: Which Model When?</h2>

      <!-- Comparison -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">Isolation Model Comparison</div>
        <div style="overflow-x:auto">
          <table style="width:100%;border-collapse:collapse;font-size:0.78rem;min-width:550px">
            <thead>
              <tr>
                <th style="text-align:left;padding:0.6rem;background:var(--muted);color:var(--foreground);border-radius:0.4rem 0 0 0">Criteria</th>
                <th style="text-align:center;padding:0.6rem;background:#22c55e;color:#fff">Shared Schema</th>
                <th style="text-align:center;padding:0.6rem;background:#3b82f6;color:#fff">Schema-per-Tenant</th>
                <th style="text-align:center;padding:0.6rem;background:#7c3aed;color:#fff;border-radius:0 0.4rem 0 0">DB-per-Tenant</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:var(--foreground);font-weight:600">Isolation</td><td style="padding:0.5rem;text-align:center;color:#f97316">Logical (tenant_id)</td><td style="padding:0.5rem;text-align:center;color:#3b82f6">Schema-level</td><td style="padding:0.5rem;text-align:center;color:#22c55e;font-weight:700">Physical (strongest)</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:var(--foreground);font-weight:600">Cost at 1000 tenants</td><td style="padding:0.5rem;text-align:center;color:#22c55e;font-weight:700">Lowest</td><td style="padding:0.5rem;text-align:center;color:#f97316">Medium</td><td style="padding:0.5rem;text-align:center;color:#ef4444">Highest</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:var(--foreground);font-weight:600">Noisy neighbour risk</td><td style="padding:0.5rem;text-align:center;color:#ef4444">High</td><td style="padding:0.5rem;text-align:center;color:#f97316">Medium</td><td style="padding:0.5rem;text-align:center;color:#22c55e">None</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:var(--foreground);font-weight:600">Data leak risk</td><td style="padding:0.5rem;text-align:center;color:#ef4444">Highest (one missing WHERE)</td><td style="padding:0.5rem;text-align:center;color:#f97316">Low</td><td style="padding:0.5rem;text-align:center;color:#22c55e">None</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:var(--foreground);font-weight:600">Schema migration</td><td style="padding:0.5rem;text-align:center;color:#22c55e">One migration for all</td><td style="padding:0.5rem;text-align:center;color:#f97316">N schemas to migrate</td><td style="padding:0.5rem;text-align:center;color:#ef4444">N databases to migrate</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:var(--foreground);font-weight:600">Cross-tenant analytics</td><td style="padding:0.5rem;text-align:center;color:#22c55e;font-weight:700">Easy (same table)</td><td style="padding:0.5rem;text-align:center;color:#f97316">Possible (UNION)</td><td style="padding:0.5rem;text-align:center;color:#ef4444">Hard (federated query)</td></tr>
              <tr><td style="padding:0.5rem;color:var(--foreground);font-weight:600">Best for</td><td style="padding:0.5rem;text-align:center;color:#22c55e;font-weight:700">Most SaaS (start here)</td><td style="padding:0.5rem;text-align:center;color:#3b82f6;font-weight:700">Mid-market SaaS</td><td style="padding:0.5rem;text-align:center;color:#7c3aed;font-weight:700">Enterprise / regulated</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <h2>Multi-Domain Architecture</h2>

      <p>Multi-domain means each tenant gets their own subdomain (or even a completely custom domain). This is how Slack (<code>acme.slack.com</code>), Shopify (<code>my-store.myshopify.com</code>), and Notion (<code>acme.notion.site</code>) work.</p>

      <!-- Domain Routing -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">Multi-Domain Request Routing</div>
        <div class="seq-diagram">
          <div class="seq-actors">
            <div class="seq-actor browser">Browser<span class="seq-actor-sub">(acme.myapp.com)</span></div>
            <div class="seq-actor idp">Load Balancer<span class="seq-actor-sub">(Route by host)</span></div>
            <div class="seq-actor sp">Application<span class="seq-actor-sub">(Resolve tenant)</span></div>
          </div>
          <div class="seq-steps">
            <div class="seq-step">
              <div class="seq-arrow full-right" style="--arrow-color:#3b82f6"><span class="seq-num blue">1</span> GET https://acme.myapp.com/dashboard</div>
            </div>
            <div class="seq-step">
              <div></div>
              <div class="seq-action" style="border-color:#7c3aed;color:#a78bfa">Wildcard SSL cert: *.myapp.com</div>
            </div>
            <div class="seq-step">
              <div class="seq-arrow right-23" style="--arrow-color:#f97316"><span class="seq-num orange">2</span> Forward to app (Host: acme.myapp.com)</div>
            </div>
            <div class="seq-step">
              <div></div>
              <div></div>
              <div class="seq-action" style="border-color:#22c55e;color:#4ade80">Extract "acme" from subdomain &#x2192; look up tenant</div>
            </div>
            <div class="seq-step">
              <div class="seq-arrow full-left" style="--arrow-color:#22c55e"><span class="seq-num green">3</span> Render acme's dashboard with acme's data</div>
            </div>
          </div>
        </div>
      </div>

      <h2>Subdomain Routing (The Standard Approach)</h2>

      <pre><code># DNS: Wildcard A record
# *.myapp.com -> your load balancer IP
# One DNS record handles ALL tenant subdomains

# nginx: Route all subdomains to the app
server {
    listen 443 ssl;
    server_name *.myapp.com;

    ssl_certificate /etc/ssl/wildcard.myapp.com.pem;
    ssl_certificate_key /etc/ssl/wildcard.myapp.com.key;

    location / {
        proxy_pass http://app-backend;
        proxy_set_header Host $host;
        proxy_set_header X-Tenant-Subdomain $subdomain;
    }

    # Extract subdomain
    set $subdomain "";
    if ($host ~* "^(.+)\.myapp\.com$") {
        set $subdomain $1;
    }
}

# Python/FastAPI: Resolve tenant from subdomain
from fastapi import FastAPI, Request, Depends

app = FastAPI()

async def get_current_tenant(request: Request):
    host = request.headers.get("host", "")
    subdomain = host.split(".")[0]

    tenant = await Tenant.get_by_slug(subdomain)
    if not tenant:
        raise HTTPException(status_code=404, detail="Workspace not found")
    return tenant

@app.get("/api/dashboard")
async def dashboard(tenant: Tenant = Depends(get_current_tenant)):
    # tenant is automatically resolved from the subdomain
    orders = await Order.filter(tenant_id=tenant.id).all()
    return {"tenant": tenant.name, "orders": len(orders)}</code></pre>

      <h2>Custom Domain Support</h2>

      <p>Some enterprise tenants want their own domain: <code>app.acme-corp.com</code> instead of <code>acme.myapp.com</code>. This is harder but very valuable for enterprise sales.</p>

      <pre><code># Custom domain flow:
# 1. Tenant registers their domain in your settings page
# 2. They add a CNAME record: app.acme-corp.com -> custom.myapp.com
# 3. Your load balancer accepts the traffic (SNI-based routing)
# 4. You issue a TLS cert for their domain (via Let's Encrypt)
# 5. Your app looks up the tenant by custom domain

# Database: Store custom domain mappings
CREATE TABLE tenant_domains (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    domain VARCHAR(255) NOT NULL UNIQUE,
    ssl_status VARCHAR(50) DEFAULT 'pending',
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

# Tenant resolution: check subdomain first, then custom domain
async def resolve_tenant(request: Request):
    host = request.headers.get("host", "").split(":")[0]

    # Check if it's a subdomain of our app
    if host.endswith(".myapp.com"):
        slug = host.replace(".myapp.com", "")
        return await Tenant.get_by_slug(slug)

    # Check custom domain mapping
    mapping = await TenantDomain.get_by_domain(host)
    if mapping:
        return await Tenant.get(id=mapping.tenant_id)

    raise HTTPException(404, "Unknown domain")

# SSL for custom domains: Use Caddy or cert-manager
# Caddy auto-provisions Let's Encrypt certs on first request
# cert-manager (K8s) can handle cert issuance at scale</code></pre>

      <h2>How Real Companies Do It</h2>

      <!-- Real World Examples -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">Multi-Tenancy at Scale: Real Companies</div>
        <div style="overflow-x:auto">
          <table style="width:100%;border-collapse:collapse;font-size:0.78rem;min-width:500px">
            <thead>
              <tr>
                <th style="text-align:left;padding:0.6rem;background:#7c3aed;color:#fff;border-radius:0.4rem 0 0 0">Company</th>
                <th style="text-align:left;padding:0.6rem;background:#7c3aed;color:#fff">Isolation Model</th>
                <th style="text-align:left;padding:0.6rem;background:#7c3aed;color:#fff">Domain Pattern</th>
                <th style="text-align:left;padding:0.6rem;background:#7c3aed;color:#fff;border-radius:0 0.4rem 0 0">Notable Detail</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:var(--foreground);font-weight:700">Slack</td><td style="padding:0.5rem">Shared schema (MySQL)</td><td style="padding:0.5rem">acme.slack.com</td><td style="padding:0.5rem">Sharded by workspace — each shard holds ~500 workspaces</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:var(--foreground);font-weight:700">Shopify</td><td style="padding:0.5rem">Sharded shared schema</td><td style="padding:0.5rem">my-store.myshopify.com + custom domains</td><td style="padding:0.5rem">Pods architecture — each "pod" serves ~10K shops</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:var(--foreground);font-weight:700">Atlassian</td><td style="padding:0.5rem">DB per tenant (migrated)</td><td style="padding:0.5rem">mysite.atlassian.net</td><td style="padding:0.5rem">Migrated from shared to isolated for enterprise compliance</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:var(--foreground);font-weight:700">Notion</td><td style="padding:0.5rem">Shared schema (PostgreSQL)</td><td style="padding:0.5rem">acme.notion.site</td><td style="padding:0.5rem">Single massive PostgreSQL with partitioning</td></tr>
              <tr><td style="padding:0.5rem;color:var(--foreground);font-weight:700">Salesforce</td><td style="padding:0.5rem">Shared schema (Oracle)</td><td style="padding:0.5rem">Custom domains</td><td style="padding:0.5rem">~100K tenants per database instance with metadata-driven schema</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <h2>The Noisy Neighbour Problem</h2>

      <p>In shared infrastructure, one tenant's heavy workload can degrade performance for everyone else. A single tenant running a massive report at 3 PM shouldn't slow down every other tenant's dashboard.</p>

      <pre><code># Solutions for noisy neighbours:

# 1. Rate limiting per tenant
from fastapi import Request
from slowapi import Limiter

limiter = Limiter(key_func=lambda request: request.state.tenant.id)

@app.get("/api/report")
@limiter.limit("10/minute")  # Per tenant, not global
async def generate_report(request: Request, tenant = Depends(get_tenant)):
    return await run_heavy_report(tenant.id)

# 2. Resource quotas in Kubernetes (per-tenant namespace)
apiVersion: v1
kind: ResourceQuota
metadata:
  name: tenant-acme-quota
  namespace: tenant-acme
spec:
  hard:
    requests.cpu: "4"
    requests.memory: "8Gi"
    limits.cpu: "8"
    limits.memory: "16Gi"
    pods: "20"

# 3. Database connection pooling per tenant
# Use PgBouncer with per-tenant connection limits
# Prevents one tenant from exhausting the connection pool

# 4. Queue isolation
# Separate task queues per tenant tier:
# - Free tier: shared queue, lower priority
# - Pro tier: dedicated queue, higher concurrency
# - Enterprise: dedicated worker pool</code></pre>

      <h2>Tenant-Aware Caching</h2>

      <pre><code># Redis: Prefix keys with tenant_id
import redis

r = redis.Redis()

def cache_get(tenant_id: str, key: str):
    return r.get(f"tenant:{tenant_id}:{key}")

def cache_set(tenant_id: str, key: str, value: str, ttl: int = 300):
    r.setex(f"tenant:{tenant_id}:{key}", ttl, value)

# Usage:
cache_set("acme", "dashboard_stats", json.dumps(stats))
data = cache_get("acme", "dashboard_stats")

# NEVER cache without tenant prefix — that's how data leaks happen
# &#x274C; r.get("dashboard_stats")  -- whose stats? EVERYONE's mixed together
# &#x2705; r.get("tenant:acme:dashboard_stats")  -- acme's stats only</code></pre>

      <h2>Multi-Tenant Security Checklist</h2>

      <!-- Security Checklist -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">Multi-Tenant Security: Non-Negotiable Checklist</div>
        <div class="timeline">
          <div class="timeline-item" style="--c:#ef4444"><div class="timeline-item-title" style="color:#ef4444">1. Every query MUST filter by tenant_id</div><div class="timeline-item-desc">Use RLS (Row-Level Security) as a safety net. One missing WHERE clause = data breach across tenants.</div></div>
          <div class="timeline-item" style="--c:#f97316"><div class="timeline-item-title" style="color:#f97316">2. Every cache key MUST be prefixed with tenant</div><div class="timeline-item-desc">A cache without tenant prefix serves one tenant's data to another. Namespace everything.</div></div>
          <div class="timeline-item" style="--c:#3b82f6"><div class="timeline-item-title" style="color:#3b82f6">3. Every file upload MUST be stored in tenant-scoped paths</div><div class="timeline-item-desc">s3://uploads/tenant-acme/file.pdf — not s3://uploads/file.pdf. Object-level isolation.</div></div>
          <div class="timeline-item" style="--c:#7c3aed"><div class="timeline-item-title" style="color:#7c3aed">4. Every background job MUST carry tenant context</div><div class="timeline-item-desc">When a Celery/Sidekiq job runs, it must know which tenant it's processing for. Pass tenant_id explicitly.</div></div>
          <div class="timeline-item" style="--c:#22c55e"><div class="timeline-item-title" style="color:#22c55e">5. Every API response MUST be scoped to the requesting tenant</div><div class="timeline-item-desc">Test: log in as tenant A, try to access tenant B's resources via ID guessing. Should return 403, not data.</div></div>
          <div class="timeline-item" style="--c:#ec4899"><div class="timeline-item-title" style="color:#ec4899">6. Audit logging MUST include tenant_id</div><div class="timeline-item-desc">When something goes wrong, you need to know which tenant was affected. Log tenant_id on every operation.</div></div>
        </div>
      </div>

      <h2>The Recommended Architecture</h2>

      <!-- Recommended Architecture -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">Production Multi-Tenant Architecture</div>
        <div class="layer-diagram">
          <div class="layer-item" style="background:#ef4444">DNS: *.myapp.com (wildcard) + custom domain CNAME support<span class="layer-item-sub">One wildcard DNS record handles all subdomains. Custom domains via CNAME + cert-manager.</span></div>
          <div class="layer-item" style="background:#f97316">Load Balancer / API Gateway: Resolve tenant from Host header<span class="layer-item-sub">Extract subdomain or look up custom domain &#x2192; inject tenant context into request.</span></div>
          <div class="layer-item" style="background:#7c3aed">Application: Tenant middleware + RLS + scoped services<span class="layer-item-sub">Every request carries tenant context. Services filter by tenant. RLS as safety net.</span></div>
          <div class="layer-item" style="background:#3b82f6">Database: Shared schema + tenant_id + RLS<span class="layer-item-sub">Start shared, add schema-per-tenant for enterprise tier. Partition large tables by tenant_id.</span></div>
          <div class="layer-item" style="background:#22c55e">Cache / Storage: Tenant-prefixed keys and paths<span class="layer-item-sub">Redis: tenant:{id}:key. S3: s3://bucket/tenant-{id}/. Queues: tenant-{id}-tasks.</span></div>
        </div>
      </div>

      <p>Start with Model 1 (shared schema + tenant_id). Add RLS from day one. Support subdomains first, custom domains later. Use tenant middleware to inject context everywhere. Rate limit per tenant. Prefix all cache keys and file paths. And test, test, test: log in as tenant A, try to access tenant B's data. If you can — you have a bug that needs fixing before launch.</p>

      <p>Multi-tenancy is not a feature you add later. It's a foundation you build from the first database migration. Get it right early and you'll scale from 10 tenants to 10,000 without rewriting your architecture.</p>
    `;
