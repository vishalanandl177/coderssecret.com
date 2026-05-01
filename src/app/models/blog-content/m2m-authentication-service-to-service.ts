export const CONTENT = `
      <p>In a microservices world, services constantly talk to each other — fetching user data, processing payments, sending notifications. But how do you ensure that only <strong>authorized services</strong> can make these calls? That's where <strong>Machine-to-Machine (M2M) authentication</strong> comes in.</p>

      <h2>What is M2M Authentication?</h2>
      <p>M2M authentication is the process of verifying the identity of a <strong>service or application</strong> (not a human user) when it communicates with another service. Unlike user authentication where someone types a password, M2M auth happens programmatically, without any human interaction.</p>
      <p>Common scenarios include:</p>
      <ul>
        <li>A backend API calling a payment gateway</li>
        <li>A cron job fetching data from an internal service</li>
        <li>A CI/CD pipeline deploying to cloud infrastructure</li>
        <li>Microservices communicating within a cluster</li>
      </ul>

      <!-- M2M Auth Flow -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">M2M Authentication: Service-to-Service Communication</div>
        <div class="seq-diagram">
          <div class="seq-actors">
            <div class="seq-actor sp">Service A<span class="seq-actor-sub">(Client)</span></div>
            <div class="seq-actor idp">Auth Server<span class="seq-actor-sub">(OAuth 2.0)</span></div>
            <div class="seq-actor browser">Service B<span class="seq-actor-sub">(API)</span></div>
          </div>
          <div class="seq-steps">
            <div class="seq-step">
              <div class="seq-arrow right" style="--arrow-color:#22c55e"><span class="seq-num green">1</span> POST /token (client_id + secret)</div>
            </div>
            <div class="seq-step">
              <div class="seq-arrow left" style="--arrow-color:#7c3aed"><span class="seq-num purple">2</span> Access Token (JWT)</div>
            </div>
            <div class="seq-step">
              <div class="seq-arrow full-right" style="--arrow-color:#3b82f6"><span class="seq-num blue">3</span> GET /api/data + Bearer token</div>
            </div>
            <div class="seq-step">
              <div></div>
              <div></div>
              <div class="seq-action" style="border-color:#3b82f6;color:#60a5fa">Validate JWT signature + scopes</div>
            </div>
            <div class="seq-step">
              <div class="seq-arrow full-left" style="--arrow-color:#3b82f6"><span class="seq-num blue">4</span> 200 OK + response data &#x2705;</div>
            </div>
          </div>
        </div>
      </div>

      <h2>OAuth 2.0 Client Credentials Flow</h2>
      <p>The most widely adopted standard for M2M auth is the <strong>OAuth 2.0 Client Credentials Grant</strong>. Here's how it works:</p>
      <pre><code># Step 1: Service requests an access token from the auth server
curl -X POST https://auth.example.com/oauth/token \\
  -H "Content-Type: application/x-www-form-urlencoded" \\
  -d "grant_type=client_credentials" \\
  -d "client_id=SERVICE_A_ID" \\
  -d "client_secret=SERVICE_A_SECRET" \\
  -d "audience=https://api.example.com"

# Response:
{
  "access_token": "eyJhbGciOiJSUzI1NiIs...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "scope": "read:users write:orders"
}

# Step 2: Service uses the token to call the target API
curl -X GET https://api.example.com/users \\
  -H "Authorization: Bearer eyJhbGciOiJSUzI1NiIs..."</code></pre>
      <p>The target API validates the JWT token by checking the signature, expiration, audience, and scopes — all without calling the auth server again.</p>

      <h2>Implementing Client Credentials in Python</h2>
      <pre><code>import requests
from functools import lru_cache
from datetime import datetime, timedelta

class M2MClient:
    def __init__(self, client_id, client_secret, token_url, audience):
        self.client_id = client_id
        self.client_secret = client_secret
        self.token_url = token_url
        self.audience = audience
        self._token = None
        self._token_expiry = None

    def get_token(self):
        """Get a valid access token, refreshing if expired."""
        if self._token and self._token_expiry > datetime.utcnow():
            return self._token

        response = requests.post(self.token_url, data={
            'grant_type': 'client_credentials',
            'client_id': self.client_id,
            'client_secret': self.client_secret,
            'audience': self.audience,
        })
        response.raise_for_status()
        data = response.json()

        self._token = data['access_token']
        self._token_expiry = (
            datetime.utcnow()
            + timedelta(seconds=data['expires_in'] - 30)
        )
        return self._token

    def request(self, method, url, **kwargs):
        """Make an authenticated HTTP request."""
        headers = kwargs.pop('headers', {})
        headers['Authorization'] = f'Bearer {self.get_token()}'
        return requests.request(method, url, headers=headers, **kwargs)

# Usage
client = M2MClient(
    client_id='svc-order-processor',
    client_secret='your-secret-here',
    token_url='https://auth.example.com/oauth/token',
    audience='https://api.example.com',
)
users = client.request('GET', 'https://api.example.com/users').json()</code></pre>

      <h2>Mutual TLS (mTLS)</h2>
      <p>For the highest level of security, especially within a service mesh, <strong>mutual TLS</strong> provides two-way certificate-based authentication:</p>
      <pre><code># Both client and server present certificates
import requests

response = requests.get(
    'https://internal-api.example.com/data',
    cert=('/path/to/client.crt', '/path/to/client.key'),
    verify='/path/to/ca-bundle.crt'
)</code></pre>
      <p>With mTLS, both parties verify each other's identity using X.509 certificates. Service meshes like <strong>Istio</strong> and <strong>Linkerd</strong> automate mTLS between all services in your cluster — zero code changes required.</p>

      <h2>API Keys</h2>
      <p>API keys are the simplest form of M2M auth. They're easy to implement but come with trade-offs:</p>
      <pre><code># Simple but limited
curl -X GET https://api.example.com/data \\
  -H "X-API-Key: sk_live_abc123def456"</code></pre>
      <ul>
        <li><strong>Pros:</strong> Simple to implement, easy to rotate, low overhead.</li>
        <li><strong>Cons:</strong> No built-in expiration, no scoping, no standard validation mechanism, easy to leak.</li>
      </ul>
      <p>API keys work well for simple integrations but should be combined with other measures (IP allowlisting, rate limiting) for production use.</p>

      <h2>JWT Validation on the Receiving End</h2>
      <p>When your service receives a JWT from another service, validate it properly:</p>
      <pre><code>import jwt
from jwt import PyJWKClient

# Fetch the public key from the auth server's JWKS endpoint
jwks_client = PyJWKClient("https://auth.example.com/.well-known/jwks.json")

def validate_m2m_token(token):
    """Validate an incoming M2M JWT token."""
    signing_key = jwks_client.get_signing_key_from_jwt(token)

    payload = jwt.decode(
        token,
        signing_key.key,
        algorithms=["RS256"],
        audience="https://api.example.com",
        issuer="https://auth.example.com/",
    )

    # Check scopes
    required_scope = "read:users"
    token_scopes = payload.get("scope", "").split()
    if required_scope not in token_scopes:
        raise PermissionError(f"Missing required scope: {required_scope}")

    return payload</code></pre>

      <!-- M2M Method Comparison -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">M2M Authentication Methods Compared</div>
        <div class="vs-cards" style="grid-template-columns:1fr 1fr">
          <div class="vs-card" style="border-color:#7c3aed">
            <div class="vs-card-header" style="background:#7c3aed">OAuth 2.0 Client Credentials</div>
            <div class="vs-card-body">
              <div class="vs-row"><span class="vs-row-icon">&#x1F512;</span>Security<span class="vs-row-value" style="color:#22c55e">High</span></div>
              <div class="vs-row"><span class="vs-row-icon">&#x2699;</span>Complexity<span class="vs-row-value" style="color:#f97316">Medium</span></div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F3AF;</span>Scoping<span class="vs-row-value" style="color:#22c55e">Yes (JWT scopes)</span></div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F3E2;</span>Best For<span class="vs-row-value" style="color:#7c3aed">Cross-boundary APIs</span></div>
            </div>
          </div>
          <div class="vs-card" style="border-color:#3b82f6">
            <div class="vs-card-header" style="background:#3b82f6">Mutual TLS (mTLS)</div>
            <div class="vs-card-body">
              <div class="vs-row"><span class="vs-row-icon">&#x1F512;</span>Security<span class="vs-row-value" style="color:#22c55e">Highest</span></div>
              <div class="vs-row"><span class="vs-row-icon">&#x2699;</span>Complexity<span class="vs-row-value" style="color:#ef4444">High</span></div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F3AF;</span>Scoping<span class="vs-row-value" style="color:#f97316">Certificate-based</span></div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F3E2;</span>Best For<span class="vs-row-value" style="color:#3b82f6">Service mesh / Zero-trust</span></div>
            </div>
          </div>
        </div>
      </div>

      <h2>Choosing the Right Approach</h2>
      <ul>
        <li><strong>OAuth 2.0 Client Credentials:</strong> Best for most M2M scenarios. Industry standard, supports scopes, works across trust boundaries.</li>
        <li><strong>mTLS:</strong> Best for service mesh / zero-trust networks. Strongest security, but more complex to manage certificates.</li>
        <li><strong>API Keys:</strong> Best for simple, low-risk integrations. Quick to implement, but limited security features.</li>
        <li><strong>Service Accounts + RBAC:</strong> Best for Kubernetes-native services. Use Kubernetes service account tokens with RBAC policies.</li>
      </ul>

      <p>In practice, many organizations use a combination — mTLS for transport security within the mesh, plus JWT-based authorization for fine-grained access control. The key is to never let services talk to each other without authentication, no matter how "internal" the network feels.</p>
    `;
