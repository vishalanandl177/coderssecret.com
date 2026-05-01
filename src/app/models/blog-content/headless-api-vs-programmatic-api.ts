export const CONTENT = `
      <p>In modern software architecture, the word "API" gets thrown around a lot — but not all APIs serve the same purpose. Two terms that often cause confusion are <strong>headless APIs</strong> and <strong>programmatic APIs</strong>. They overlap in some ways, but they solve fundamentally different problems. Understanding the distinction will help you make better architectural decisions.</p>

      <h2>What is a Headless API?</h2>
      <p>A <strong>headless API</strong> is the backend of a system that has been <em>decoupled from its frontend</em> (the "head"). The API serves content or functionality without dictating how it's presented. The term comes from "headless CMS" but applies broadly to any system where the presentation layer is separated from the data/logic layer.</p>
      <p>In a traditional (monolithic) architecture, the backend renders HTML pages directly. In a headless architecture, the backend only exposes APIs — and any frontend (web app, mobile app, kiosk, smartwatch) can consume them independently.</p>

      <!-- Headless vs Traditional -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">Traditional (Coupled) vs Headless (Decoupled) Architecture</div>
        <div class="layer-diagram" style="margin-bottom:1.5rem">
          <div class="layer-item" style="background:#6b7280;border-radius:0.6rem">Traditional: Server renders HTML + Data together &#x1F6AB;</div>
        </div>
        <div class="hub-diagram">
          <div class="hub-center" style="background:#22c55e;box-shadow:0 0 30px rgba(34,197,94,0.3)">Headless API<span class="hub-center-sub">JSON / GraphQL — no UI opinions</span></div>
          <div class="hub-arrow-label"><span class="arrow-animated">&#x2B07;</span> Same API, any frontend</div>
          <div class="hub-apps">
            <div class="hub-app" style="animation-delay:0.3s"><span class="hub-app-icon">&#x1F310;</span>React App<span class="hub-app-sub">Web</span></div>
            <div class="hub-app" style="animation-delay:0.45s"><span class="hub-app-icon">&#x1F4F1;</span>iOS / Android<span class="hub-app-sub">Mobile</span></div>
            <div class="hub-app" style="animation-delay:0.6s"><span class="hub-app-icon">&#x1F4FA;</span>Smart Display<span class="hub-app-sub">IoT</span></div>
            <div class="hub-app" style="animation-delay:0.75s"><span class="hub-app-icon">&#x2328;</span>CLI Tool<span class="hub-app-sub">Terminal</span></div>
          </div>
        </div>
      </div>

      <h2>Headless Architecture in Practice</h2>
      <pre><code># Traditional (coupled) architecture:
User → Browser → Server (renders HTML + data) → Browser displays page

# Headless (decoupled) architecture:
User → React/Angular App → Headless API (JSON) → App renders UI
User → Mobile App ──────→ Same Headless API ──→ App renders UI
User → Smart Display ───→ Same Headless API ──→ Display renders UI</code></pre>

      <h2>Headless CMS Example</h2>
      <p>The most common example is a <strong>headless CMS</strong> like Strapi, Contentful, or Sanity. Instead of coupling content to a specific theme or template engine, the CMS exposes content via REST or GraphQL:</p>
      <pre><code># Strapi headless CMS — fetching blog posts
GET https://cms.example.com/api/articles?populate=*

{
  "data": [
    {
      "id": 1,
      "attributes": {
        "title": "Getting Started with Docker",
        "content": "Docker containers package your application...",
        "slug": "getting-started-with-docker",
        "publishedAt": "2026-04-01T10:00:00.000Z",
        "author": {
          "data": {
            "attributes": { "name": "Jane Developer" }
          }
        }
      }
    }
  ]
}</code></pre>
      <p>The same API feeds your website, mobile app, and even a digital signage display — each with its own UI.</p>

      <h2>Headless Commerce Example</h2>
      <p>E-commerce platforms like <strong>Shopify Storefront API</strong>, <strong>commercetools</strong>, and <strong>Medusa</strong> follow the same pattern:</p>
      <pre><code># Shopify Storefront API — headless commerce
query {
  products(first: 10) {
    edges {
      node {
        title
        description
        priceRange {
          minVariantPrice { amount currencyCode }
        }
        images(first: 1) {
          edges { node { url altText } }
        }
      }
    }
  }
}</code></pre>
      <p>You get full control over the shopping experience while the headless backend handles inventory, payments, and order management.</p>

      <h2>What is a Programmatic API?</h2>
      <p>A <strong>programmatic API</strong> is an interface designed for <em>machine-to-machine interaction</em> — it lets software systems communicate, automate tasks, and integrate with each other. The key distinction: programmatic APIs are built for developers and scripts, not for serving content to end-user interfaces.</p>
      <p>Think of it as the difference between a restaurant menu (headless API — content for humans to consume through some interface) and a kitchen supply chain system (programmatic API — machines talking to machines).</p>

      <h2>Programmatic API Examples</h2>
      <pre><code># Stripe API — programmatic payment processing
import stripe
stripe.api_key = "sk_live_..."

# Create a charge programmatically
charge = stripe.PaymentIntent.create(
    amount=2000,       # $20.00
    currency="usd",
    payment_method="pm_card_visa",
    confirm=True,
)

# Twilio API — programmatic SMS
from twilio.rest import Client
client = Client("ACCOUNT_SID", "AUTH_TOKEN")

message = client.messages.create(
    body="Your order has shipped!",
    from_="+15551234567",
    to="+15559876543",
)

# AWS S3 API — programmatic file storage
import boto3
s3 = boto3.client('s3')

# Upload a file
s3.upload_file('report.pdf', 'my-bucket', 'reports/2026/report.pdf')

# Generate a pre-signed URL
url = s3.generate_presigned_url(
    'get_object',
    Params={'Bucket': 'my-bucket', 'Key': 'reports/2026/report.pdf'},
    ExpiresIn=3600,
)</code></pre>

      <h2>Programmatic APIs for Automation</h2>
      <p>Programmatic APIs shine in automation, CI/CD, and infrastructure management:</p>
      <pre><code># GitHub API — automate repository management
curl -X POST https://api.github.com/repos/owner/repo/issues \\
  -H "Authorization: Bearer ghp_xxxx" \\
  -d '{
    "title": "Automated bug report",
    "body": "Detected by monitoring at 2026-04-04T03:00:00Z",
    "labels": ["bug", "automated"]
  }'

# Kubernetes API — programmatic cluster management
from kubernetes import client, config

config.load_kube_config()
v1 = client.AppsV1Api()

# Scale a deployment programmatically
v1.patch_namespaced_deployment_scale(
    name="web-app",
    namespace="production",
    body={"spec": {"replicas": 5}},
)</code></pre>

      <h2>The Key Differences</h2>
      <pre><code>Aspect               Headless API                  Programmatic API
──────────────────   ───────────────────────────   ───────────────────────────
Primary Purpose      Serve content/data to UIs     Enable machine-to-machine
                                                   interaction and automation
Consumer             Frontend apps (web, mobile)   Backend services, scripts,
                                                   CI/CD pipelines
Data Flow            Content out to displays       Commands and data between
                                                   systems
Examples             Headless CMS, headless         Payment APIs, cloud APIs,
                     commerce, headless auth        messaging APIs, CI/CD APIs
Response Format      Content-rich JSON/GraphQL     Action-oriented responses
                     (articles, products, users)   (receipts, status, tokens)
Who Initiates?       End user (via frontend)       Another system or script
Caching              Heavy (content rarely changes) Light (actions are unique)
Idempotency          GET-heavy (reads)              POST/PUT-heavy (writes)</code></pre>

      <h2>Where They Overlap</h2>
      <p>The lines blur in practice. Many systems expose <em>both</em> types of API:</p>
      <ul>
        <li><strong>Shopify</strong> has a <em>Storefront API</em> (headless — serve products to your custom frontend) and an <em>Admin API</em> (programmatic — manage inventory, fulfill orders, create discounts).</li>
        <li><strong>Stripe</strong> has a <em>Payment Intents API</em> (programmatic — process payments) but also <em>Stripe Elements</em> that consume a headless-style API to render payment forms.</li>
        <li><strong>Auth0/Firebase Auth</strong> provides <em>headless authentication</em> (bring your own login UI) and <em>programmatic management APIs</em> (create users, assign roles via scripts).</li>
      </ul>

      <h2>Building a Headless API</h2>
      <p>If you're building a headless API, design it for content delivery:</p>
      <pre><code># Django REST Framework — headless blog API
from rest_framework import serializers, viewsets
from .models import Article

class ArticleSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.name', read_only=True)

    class Meta:
        model = Article
        fields = ['id', 'title', 'slug', 'content', 'excerpt',
                  'author_name', 'published_at', 'tags', 'cover_image']

class ArticleViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Article.objects.filter(status='published').order_by('-published_at')
    serializer_class = ArticleSerializer
    lookup_field = 'slug'</code></pre>
      <p>Key design principles for headless APIs:</p>
      <ul>
        <li><strong>Content-first responses:</strong> Return rich, structured content ready for rendering.</li>
        <li><strong>Flexible querying:</strong> Support filtering, pagination, field selection, and content relationships.</li>
        <li><strong>CDN-friendly:</strong> Set proper cache headers. Headless content is highly cacheable.</li>
        <li><strong>Multi-channel ready:</strong> Don't assume any particular frontend — return data that works for web, mobile, and IoT.</li>
      </ul>

      <h2>Building a Programmatic API</h2>
      <p>If you're building a programmatic API, design it for automation:</p>
      <pre><code># FastAPI — programmatic deployment API
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI()

class DeployRequest(BaseModel):
    service: str
    version: str
    environment: str  # staging, production
    replicas: int = 2

class DeployResponse(BaseModel):
    deployment_id: str
    status: str
    message: str

@app.post("/api/v1/deployments", response_model=DeployResponse)
async def create_deployment(req: DeployRequest):
    deployment_id = trigger_deployment(req)
    return DeployResponse(
        deployment_id=deployment_id,
        status="in_progress",
        message=f"Deploying {req.service}:{req.version} to {req.environment}",
    )</code></pre>
      <p>Key design principles for programmatic APIs:</p>
      <ul>
        <li><strong>Idempotency keys:</strong> Allow clients to safely retry requests without duplicate side effects.</li>
        <li><strong>Webhooks:</strong> Notify callers when async operations complete instead of requiring polling.</li>
        <li><strong>Rate limiting:</strong> Protect against runaway scripts or misconfigured automations.</li>
        <li><strong>Versioning:</strong> Programmatic consumers can't "see" breaking changes. Use versioned URLs or headers.</li>
        <li><strong>SDKs:</strong> Provide client libraries in popular languages. Programmatic consumers prefer typed SDKs over raw HTTP.</li>
      </ul>

      <h2>When to Use Which</h2>
      <ul>
        <li><strong>Use a headless API when:</strong> You want to decouple your content/data from the presentation layer. You need to serve the same content to multiple frontends (website, app, smart device). You're building a CMS, e-commerce store, or any content-driven application.</li>
        <li><strong>Use a programmatic API when:</strong> You need systems to talk to each other. You're building integrations, automations, or developer tools. The consumer is a script, a CI/CD pipeline, or another backend service — not a human looking at a screen.</li>
        <li><strong>Use both when:</strong> You're building a platform. Expose headless APIs for frontend developers building UIs, and programmatic APIs for backend developers building automations and integrations.</li>
      </ul>

      <h2>Authentication: The Critical Difference</h2>
      <p>One of the most important — and often overlooked — differences between headless and programmatic APIs is <strong>how authentication works</strong>. The auth model fundamentally changes based on <em>who</em> is making the request: a user through a frontend, or a machine through code.</p>

      <!-- Auth Comparison Diagram -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">Authentication Models: Headless vs Programmatic</div>
        <div class="vs-cards">
          <div class="vs-card" style="border-color:#3b82f6">
            <div class="vs-card-header" style="background:#3b82f6">&#x1F464; Headless API Auth</div>
            <div class="vs-card-body">
              <div class="vs-row"><span class="vs-row-icon">&#x1F511;</span>Who authenticates?<span class="vs-row-value" style="color:#3b82f6">End user</span></div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F4B3;</span>Token represents<span class="vs-row-value" style="color:#3b82f6">User identity</span></div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F504;</span>Auth flow<span class="vs-row-value" style="color:#3b82f6">OAuth + PKCE</span></div>
              <div class="vs-row"><span class="vs-row-icon">&#x23F1;</span>Token lifetime<span class="vs-row-value" style="color:#f97316">Short (15-60 min)</span></div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F6AA;</span>Revocation<span class="vs-row-value" style="color:#3b82f6">User logs out</span></div>
              <div class="vs-row"><span class="vs-row-icon">&#x2753;</span>Key question<span class="vs-row-value" style="color:#3b82f6">Who is this person?</span></div>
            </div>
          </div>
          <div class="vs-badge">VS</div>
          <div class="vs-card" style="border-color:#22c55e">
            <div class="vs-card-header" style="background:#22c55e">&#x1F916; Programmatic API Auth</div>
            <div class="vs-card-body">
              <div class="vs-row"><span class="vs-row-icon">&#x1F511;</span>Who authenticates?<span class="vs-row-value" style="color:#22c55e">Service / machine</span></div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F4B3;</span>Token represents<span class="vs-row-value" style="color:#22c55e">Service identity</span></div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F504;</span>Auth flow<span class="vs-row-value" style="color:#22c55e">Client Credentials</span></div>
              <div class="vs-row"><span class="vs-row-icon">&#x23F1;</span>Token lifetime<span class="vs-row-value" style="color:#22c55e">Longer (hours-days)</span></div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F6AA;</span>Revocation<span class="vs-row-value" style="color:#22c55e">Credential rotated</span></div>
              <div class="vs-row"><span class="vs-row-icon">&#x2753;</span>Key question<span class="vs-row-value" style="color:#22c55e">Which system is this?</span></div>
            </div>
          </div>
        </div>
      </div>

      <h2>Headless API Authentication Patterns</h2>
      <p>Headless APIs serve content to frontends — so authentication must be <strong>user-centric</strong> and work safely in browsers and mobile apps where secrets can't be hidden.</p>

      <h2>Public Content (No User Login)</h2>
      <p>If your headless API serves public content (blog posts, product listings, marketing pages), you don't need user auth at all — just a public API key to identify the client:</p>
      <pre><code># Public Storefront API — no user context needed
GET https://cdn.example.com/api/v1/articles
Headers:
  X-API-Key: pk_storefront_abc123

# Response: public content, heavily cached, CDN-friendly
{
  "data": [
    { "title": "Getting Started", "slug": "getting-started", ... }
  ]
}</code></pre>
      <p><strong>Real-world examples:</strong> Contentful Delivery API, Shopify Storefront API, Strapi public endpoints. These use <strong>read-only public tokens</strong> that are safe to embed in frontend code.</p>

      <h2>Personalized Content (User Login Required)</h2>
      <p>When the headless API serves personalized data (user profile, cart, order history), use <strong>OAuth 2.0 Authorization Code + PKCE</strong> — the gold standard for SPAs and mobile apps:</p>

      <!-- Headless Auth Flow -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">Headless API: OAuth 2.0 + PKCE Flow (for SPAs &amp; Mobile)</div>
        <div class="seq-diagram">
          <div class="seq-actors">
            <div class="seq-actor browser">User / SPA</div>
            <div class="seq-actor idp">Auth Server<span class="seq-actor-sub">(OAuth 2.0)</span></div>
            <div class="seq-actor sp">Headless API<span class="seq-actor-sub">(Content)</span></div>
          </div>
          <div class="seq-steps">
            <div class="seq-step">
              <div class="seq-arrow right" style="--arrow-color:#3b82f6"><span class="seq-num blue">1</span> /authorize + code_challenge (PKCE)</div>
            </div>
            <div class="seq-step">
              <div class="seq-arrow left" style="--arrow-color:#7c3aed"><span class="seq-num purple">2</span> Login page (user enters credentials)</div>
            </div>
            <div class="seq-step">
              <div class="seq-arrow left" style="--arrow-color:#7c3aed"><span class="seq-num purple">3</span> Authorization code (via redirect)</div>
            </div>
            <div class="seq-step">
              <div class="seq-arrow right" style="--arrow-color:#3b82f6"><span class="seq-num blue">4</span> Exchange code + verifier for tokens</div>
            </div>
            <div class="seq-step">
              <div class="seq-arrow left" style="--arrow-color:#7c3aed"><span class="seq-num purple">5</span> access_token (15 min) + refresh_token</div>
            </div>
            <div class="seq-step">
              <div class="seq-arrow full-right" style="--arrow-color:#22c55e"><span class="seq-num green">6</span> GET /api/me/cart + Bearer token</div>
            </div>
            <div class="seq-step">
              <div class="seq-arrow full-left" style="--arrow-color:#22c55e"><span class="seq-num green">7</span> Personalized data &#x2705;</div>
            </div>
          </div>
        </div>
      </div>

      <pre><code># SPA fetching personalized content from a headless API
# Step 1-5: OAuth PKCE flow handled by auth library (e.g., auth0-spa-js)
import { createAuth0Client } from '@auth0/auth0-spa-js';

const auth0 = await createAuth0Client({
  domain: 'your-tenant.auth0.com',
  clientId: 'YOUR_SPA_CLIENT_ID',  // Public — no secret needed
  authorizationParams: { audience: 'https://api.example.com' }
});

// Step 6: Use the token to call the headless API
const token = await auth0.getTokenSilently();
const response = await fetch('https://api.example.com/me/cart', {
  headers: { 'Authorization': 'Bearer ' + token }
});
const cart = await response.json();</code></pre>

      <p><strong>Why PKCE?</strong> SPAs and mobile apps can't securely store a client secret — the code is visible to the user. PKCE (Proof Key for Code Exchange) replaces the secret with a one-time cryptographic challenge, making the flow safe for public clients.</p>

      <h2>Server-Rendered Headless (SSR)</h2>
      <p>If your frontend is server-rendered (Next.js, Nuxt, Angular SSR), the SSR server can securely hold secrets:</p>
      <pre><code># Next.js API route — SSR server authenticates with headless CMS
# The server has a secret token; the browser never sees it

export async function getServerSideProps() {
  const res = await fetch('https://cms.example.com/api/articles', {
    headers: {
      'Authorization': 'Bearer SECRET_CMS_TOKEN',  // Server-side only
    },
  });
  const articles = await res.json();
  return { props: { articles } };
}

// The browser receives rendered HTML — no token exposed</code></pre>

      <h2>Programmatic API Authentication Patterns</h2>
      <p>Programmatic APIs serve machines, not humans. Authentication must be <strong>automated, scriptable, and work without user interaction</strong>.</p>

      <h2>API Keys (Simple Integrations)</h2>
      <p>The simplest approach — a long-lived secret string that identifies the calling service:</p>
      <pre><code># Simple API key authentication
curl -X POST https://api.example.com/v1/deployments \\
  -H "X-API-Key: sk_live_abc123def456" \\
  -H "Content-Type: application/json" \\
  -d '{"service": "web-app", "version": "2.1.0"}'

# Server-side validation
def authenticate(request):
    api_key = request.headers.get('X-API-Key')
    service = APIKey.objects.filter(
        key=api_key, active=True
    ).select_related('service').first()
    if not service:
        raise AuthenticationError("Invalid API key")
    return service  # Returns the SERVICE, not a user</code></pre>

      <!-- API Key vs OAuth Decision -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">Programmatic Auth: When to Use What</div>
        <div class="dtree">
          <div class="dtree-node question">What's your use case?</div>
          <div class="dtree-branches">
            <div class="dtree-branch">
              <div class="dtree-label">Simple 3rd-party integration?</div>
              <div class="dtree-connector orange"></div>
              <div class="dtree-answer saml">API Key<span class="dtree-answer-sub">+ rate limiting + scopes</span></div>
            </div>
            <div class="dtree-branch">
              <div class="dtree-label">Internal microservices?</div>
              <div class="dtree-connector blue"></div>
              <div class="dtree-answer oidc">Client Credentials<span class="dtree-answer-sub">JWT with scopes, auto-expiring</span></div>
            </div>
            <div class="dtree-branch">
              <div class="dtree-label">Zero-trust / service mesh?</div>
              <div class="dtree-connector green"></div>
              <div class="dtree-answer both">mTLS<span class="dtree-answer-sub">+ JWT for authorization</span></div>
            </div>
          </div>
        </div>
      </div>

      <h2>OAuth 2.0 Client Credentials (Microservices)</h2>
      <p>For internal service-to-service communication, <strong>Client Credentials</strong> is the standard — no user involvement, scoped access, auto-expiring tokens:</p>
      <pre><code>import requests

class ServiceClient:
    """Programmatic API client with auto-refreshing M2M tokens."""

    def __init__(self, client_id, client_secret, token_url, audience):
        self.client_id = client_id
        self.client_secret = client_secret
        self.token_url = token_url
        self.audience = audience
        self._token = None
        self._expiry = 0

    def _get_token(self):
        if self._token and time.time() < self._expiry:
            return self._token

        resp = requests.post(self.token_url, data={
            'grant_type': 'client_credentials',
            'client_id': self.client_id,
            'client_secret': self.client_secret,
            'audience': self.audience,
        })
        data = resp.json()
        self._token = data['access_token']
        self._expiry = time.time() + data['expires_in'] - 30
        return self._token

    def call(self, method, url, **kwargs):
        headers = kwargs.pop('headers', {})
        headers['Authorization'] = f'Bearer {self._get_token()}'
        return requests.request(method, url, headers=headers, **kwargs)

# Usage — fully automated, no human in the loop
order_service = ServiceClient(
    client_id='svc-order-processor',
    client_secret=os.environ['ORDER_SVC_SECRET'],
    token_url='https://auth.internal/oauth/token',
    audience='https://api.internal',
)
users = order_service.call('GET', 'https://api.internal/users').json()</code></pre>

      <!-- Programmatic Auth Flow -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">OAuth 2.0 Client Credentials Flow (M2M)</div>
        <div class="seq-diagram">
          <div class="seq-actors">
            <div class="seq-actor sp">Service A<span class="seq-actor-sub">(Client)</span></div>
            <div class="seq-actor idp">Auth Server<span class="seq-actor-sub">(OAuth 2.0)</span></div>
            <div class="seq-actor browser">Service B<span class="seq-actor-sub">(API)</span></div>
          </div>
          <div class="seq-steps">
            <div class="seq-step">
              <div class="seq-arrow right" style="--arrow-color:#22c55e"><span class="seq-num green">1</span> POST /token (client_id + client_secret)</div>
            </div>
            <div class="seq-step">
              <div></div>
              <div class="seq-action" style="border-color:#7c3aed;color:#a78bfa">Validate credentials, generate JWT</div>
            </div>
            <div class="seq-step">
              <div class="seq-arrow left" style="--arrow-color:#7c3aed"><span class="seq-num purple">2</span> access_token (JWT with scopes)</div>
            </div>
            <div class="seq-step">
              <div class="seq-arrow full-right" style="--arrow-color:#3b82f6"><span class="seq-num blue">3</span> GET /api/data + Bearer token</div>
            </div>
            <div class="seq-step">
              <div></div>
              <div></div>
              <div class="seq-action" style="border-color:#3b82f6;color:#60a5fa">Verify JWT signature + check scopes</div>
            </div>
            <div class="seq-step">
              <div class="seq-arrow full-left" style="--arrow-color:#3b82f6"><span class="seq-num blue">4</span> 200 OK + data &#x2705;</div>
            </div>
          </div>
        </div>
      </div>

      <h2>mTLS + JWT (Zero-Trust / High Security)</h2>
      <p>For the highest security environments, combine <strong>mutual TLS</strong> (transport-level identity) with <strong>JWT</strong> (application-level authorization):</p>
      <pre><code># mTLS: Both client and server present certificates
import requests

response = requests.get(
    'https://internal-api.example.com/sensitive-data',
    cert=('/path/to/service-a.crt', '/path/to/service-a.key'),
    verify='/path/to/ca-bundle.crt',
    headers={'Authorization': f'Bearer {jwt_token}'}  # JWT for scopes
)

# The server verifies:
# 1. TLS: Is this certificate signed by our CA? (identity)
# 2. JWT: Does this token have the required scopes? (authorization)</code></pre>

      <!-- Security Layers -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">Security Layers: Transport vs Application</div>
        <div class="layer-diagram">
          <div class="layer-item" style="background:#22c55e">mTLS &#x2014; Transport Layer<span class="layer-item-sub">WHO is connecting? Certificate-based identity verification</span></div>
          <div class="layer-item" style="background:#3b82f6">JWT &#x2014; Application Layer<span class="layer-item-sub">WHAT can they do? Scope-based authorization (read:users, write:orders)</span></div>
          <div class="layer-item" style="background:#7c3aed">API Logic &#x2014; Business Layer<span class="layer-item-sub">Execute the request with verified identity and permissions</span></div>
        </div>
      </div>

      <h2>Cloud-Native Auth (IAM / Service Accounts)</h2>
      <p>When your services run in AWS, GCP, or Azure, skip managing secrets entirely — use <strong>cloud IAM roles</strong>:</p>
      <pre><code># AWS: No secrets in code — the EC2 instance / Lambda / ECS task
# automatically gets temporary credentials via its IAM role
import boto3

# boto3 automatically discovers credentials from:
# 1. IAM role attached to the compute (EC2, Lambda, ECS)
# 2. Environment variables (AWS_ACCESS_KEY_ID)
# 3. ~/.aws/credentials file
s3 = boto3.client('s3')  # No credentials passed — auto-discovered
s3.put_object(Bucket='my-bucket', Key='data.json', Body=json_data)

# Kubernetes: Workload Identity maps K8s service accounts to cloud IAM
# Pod spec:
#   serviceAccountName: my-service-sa
# The pod gets cloud credentials automatically — zero secrets to manage</code></pre>

      <h2>Auth Quick Reference: Which Auth for Which Scenario</h2>

      <!-- Comprehensive Auth Reference -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">Authentication Quick Reference</div>
        <div style="overflow-x:auto">
          <table style="width:100%;border-collapse:collapse;font-size:0.8rem;min-width:500px">
            <thead>
              <tr>
                <th style="text-align:left;padding:0.6rem 0.75rem;background:#3b82f6;color:#fff;border-radius:0.5rem 0 0 0">Scenario</th>
                <th style="text-align:left;padding:0.6rem 0.75rem;background:#3b82f6;color:#fff">Type</th>
                <th style="text-align:left;padding:0.6rem 0.75rem;background:#3b82f6;color:#fff;border-radius:0 0.5rem 0 0">Recommended Auth</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom:1px solid var(--border)">
                <td style="padding:0.5rem 0.75rem;color:var(--foreground)">&#x1F4F0; Public blog / CMS</td>
                <td style="padding:0.5rem 0.75rem;color:#3b82f6;font-weight:600">Headless</td>
                <td style="padding:0.5rem 0.75rem;color:#22c55e;font-weight:700">Public API key</td>
              </tr>
              <tr style="border-bottom:1px solid var(--border)">
                <td style="padding:0.5rem 0.75rem;color:var(--foreground)">&#x1F6D2; E-commerce browsing</td>
                <td style="padding:0.5rem 0.75rem;color:#3b82f6;font-weight:600">Headless</td>
                <td style="padding:0.5rem 0.75rem;color:#22c55e;font-weight:700">Storefront token</td>
              </tr>
              <tr style="border-bottom:1px solid var(--border)">
                <td style="padding:0.5rem 0.75rem;color:var(--foreground)">&#x1F464; User dashboard (SPA)</td>
                <td style="padding:0.5rem 0.75rem;color:#3b82f6;font-weight:600">Headless</td>
                <td style="padding:0.5rem 0.75rem;color:#3b82f6;font-weight:700">OAuth 2.0 + PKCE</td>
              </tr>
              <tr style="border-bottom:1px solid var(--border)">
                <td style="padding:0.5rem 0.75rem;color:var(--foreground)">&#x1F4F1; Mobile app with login</td>
                <td style="padding:0.5rem 0.75rem;color:#3b82f6;font-weight:600">Headless</td>
                <td style="padding:0.5rem 0.75rem;color:#3b82f6;font-weight:700">OAuth + PKCE + refresh</td>
              </tr>
              <tr style="border-bottom:1px solid var(--border)">
                <td style="padding:0.5rem 0.75rem;color:var(--foreground)">&#x1F5A5; SSR (Next.js / Nuxt)</td>
                <td style="padding:0.5rem 0.75rem;color:#3b82f6;font-weight:600">Headless</td>
                <td style="padding:0.5rem 0.75rem;color:#7c3aed;font-weight:700">Server-side secret token</td>
              </tr>
              <tr style="border-bottom:1px solid var(--border);background:var(--muted)">
                <td colspan="3" style="padding:0.3rem 0.75rem;font-size:0.65rem;color:var(--muted-foreground);text-align:center;font-weight:600">&#x2500;&#x2500;&#x2500; Programmatic &#x2500;&#x2500;&#x2500;</td>
              </tr>
              <tr style="border-bottom:1px solid var(--border)">
                <td style="padding:0.5rem 0.75rem;color:var(--foreground)">&#x1F91D; Partner integration</td>
                <td style="padding:0.5rem 0.75rem;color:#22c55e;font-weight:600">Programmatic</td>
                <td style="padding:0.5rem 0.75rem;color:#f97316;font-weight:700">Scoped API key</td>
              </tr>
              <tr style="border-bottom:1px solid var(--border)">
                <td style="padding:0.5rem 0.75rem;color:var(--foreground)">&#x23F0; Cron job / script</td>
                <td style="padding:0.5rem 0.75rem;color:#22c55e;font-weight:600">Programmatic</td>
                <td style="padding:0.5rem 0.75rem;color:#f97316;font-weight:700">API key or Client Creds</td>
              </tr>
              <tr style="border-bottom:1px solid var(--border)">
                <td style="padding:0.5rem 0.75rem;color:var(--foreground)">&#x1F504; Microservice-to-microservice</td>
                <td style="padding:0.5rem 0.75rem;color:#22c55e;font-weight:600">Programmatic</td>
                <td style="padding:0.5rem 0.75rem;color:#3b82f6;font-weight:700">Client Credentials (JWT)</td>
              </tr>
              <tr style="border-bottom:1px solid var(--border)">
                <td style="padding:0.5rem 0.75rem;color:var(--foreground)">&#x1F512; Zero-trust / service mesh</td>
                <td style="padding:0.5rem 0.75rem;color:#22c55e;font-weight:600">Programmatic</td>
                <td style="padding:0.5rem 0.75rem;color:#22c55e;font-weight:700">mTLS + JWT</td>
              </tr>
              <tr>
                <td style="padding:0.5rem 0.75rem;color:var(--foreground)">&#x2601; CI/CD to cloud</td>
                <td style="padding:0.5rem 0.75rem;color:#22c55e;font-weight:600">Programmatic</td>
                <td style="padding:0.5rem 0.75rem;color:#7c3aed;font-weight:700">IAM role / Service account</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <h2>The Rule of Thumb</h2>
      <ul>
        <li><strong>Headless API auth follows the user:</strong> "Who is this person, and what can they see?" The token represents a human's identity and permissions. It's short-lived because users log out.</li>
        <li><strong>Programmatic API auth follows the service:</strong> "Which system is this, and what can it do?" The token represents a machine's identity and scopes. It's longer-lived because machines don't take lunch breaks.</li>
        <li><strong>Never put secrets in frontend code:</strong> SPAs and mobile apps are <em>public clients</em>. Use PKCE for user auth, public API keys for anonymous access. Reserve secret-based auth (Client Credentials, API keys) for server-side code only.</li>
      </ul>

      <p>The distinction matters because it shapes your API design — response structure, caching strategy, authentication model, documentation style, and error handling all differ. A headless API optimizes for content delivery; a programmatic API optimizes for reliable machine interaction. Know which one you're building, and design accordingly.</p>
    `;
