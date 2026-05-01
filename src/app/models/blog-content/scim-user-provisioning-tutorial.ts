export const CONTENT = `
      <p>If you've ever onboarded a new employee and had to create their accounts across 15 different SaaS tools — Slack, Jira, GitHub, AWS, Google Workspace — you know the pain. Now imagine doing that for 500 employees. And then deprovisioning them when they leave. <strong>SCIM</strong> (System for Cross-domain Identity Management) solves this by automating user provisioning and deprovisioning across all your applications from a single identity provider.</p>

      <h2>What is SCIM?</h2>
      <p>SCIM is an <strong>open standard protocol</strong> (RFC 7642, 7643, 7644) that defines a REST API for managing user identities across systems. When an identity provider (like Okta, Azure AD, or OneLogin) supports SCIM, it can automatically:</p>
      <ul>
        <li><strong>Create</strong> user accounts in your app when someone joins the organization</li>
        <li><strong>Update</strong> user profiles when their details change (name, email, department, role)</li>
        <li><strong>Deactivate/Delete</strong> accounts when someone leaves — instantly, across all connected apps</li>
        <li><strong>Manage groups</strong> — add/remove users from teams, departments, or permission groups</li>
      </ul>
      <p>Think of SCIM as the <strong>CRUD API for user management</strong> that every SaaS app agrees to speak.</p>

      <h2>Why Does SCIM Matter?</h2>
      <p>Without SCIM, enterprise IT teams face these problems:</p>
      <ul>
        <li><strong>Security risk:</strong> When an employee leaves, their accounts across 20+ tools might not get disabled for days or weeks. That's a massive security hole.</li>
        <li><strong>Manual toil:</strong> HR creates a ticket, IT manually provisions accounts one by one. For a company hiring 50 people a month, that's hundreds of hours wasted.</li>
        <li><strong>Data drift:</strong> A user's email changes in the IdP but not in your app. Names get out of sync. Groups become stale.</li>
        <li><strong>Compliance failures:</strong> Auditors ask "who has access to what?" and nobody can answer accurately.</li>
      </ul>
      <p>SCIM eliminates all of this. The IdP becomes the single source of truth, and every connected app stays in sync automatically.</p>

      <!-- SCIM Provisioning Flow -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">SCIM User Provisioning Flow</div>
        <div class="seq-diagram">
          <div class="seq-actors">
            <div class="seq-actor idp">Identity Provider<span class="seq-actor-sub">(Okta / Azure AD)</span></div>
            <div class="seq-actor sp">SCIM Endpoint<span class="seq-actor-sub">(Your App)</span></div>
            <div class="seq-actor browser">App Database<span class="seq-actor-sub">(Users table)</span></div>
          </div>
          <div class="seq-steps">
            <div class="seq-step">
              <div class="seq-arrow right" style="--arrow-color:#7c3aed"><span class="seq-num purple">1</span> POST /scim/v2/Users (new hire)</div>
            </div>
            <div class="seq-step">
              <div></div>
              <div class="seq-arrow right-23" style="--arrow-color:#22c55e"><span class="seq-num green">2</span> INSERT user row</div>
            </div>
            <div class="seq-step">
              <div class="seq-arrow left" style="--arrow-color:#22c55e"><span class="seq-num green">3</span> 201 Created + SCIM user</div>
            </div>
            <div class="seq-step"><div style="border-top:1px dashed var(--border);grid-column:1/4;margin:0.3rem 0"></div></div>
            <div class="seq-step">
              <div class="seq-arrow right" style="--arrow-color:#f97316"><span class="seq-num orange">4</span> PATCH /Users/:id (deactivate)</div>
            </div>
            <div class="seq-step">
              <div></div>
              <div class="seq-arrow right-23" style="--arrow-color:#ef4444"><span class="seq-num" style="background:#ef4444">5</span> UPDATE active=false</div>
            </div>
            <div class="seq-step">
              <div class="seq-arrow left" style="--arrow-color:#22c55e"><span class="seq-num green">6</span> 200 OK &#x2014; user deactivated &#x1F512;</div>
            </div>
          </div>
        </div>
      </div>

      <!-- User Lifecycle -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">Employee Lifecycle via SCIM</div>
        <div class="pipeline">
          <div class="pipeline-step" style="background:#22c55e;--i:0"><span class="pipeline-step-icon">&#x1F464;</span>Hired<span class="pipeline-step-sub">IdP creates user</span></div>
          <div class="pipeline-arrow">&#x2192;</div>
          <div class="pipeline-step" style="background:#3b82f6;--i:1"><span class="pipeline-step-icon">&#x1F4E9;</span>SCIM POST<span class="pipeline-step-sub">Auto-provisioned</span></div>
          <div class="pipeline-arrow">&#x2192;</div>
          <div class="pipeline-step" style="background:#a855f7;--i:2"><span class="pipeline-step-icon">&#x1F504;</span>Updates<span class="pipeline-step-sub">SCIM PATCH syncs</span></div>
          <div class="pipeline-arrow">&#x2192;</div>
          <div class="pipeline-step" style="background:#f97316;--i:3"><span class="pipeline-step-icon">&#x1F44B;</span>Leaves<span class="pipeline-step-sub">IdP deactivates</span></div>
          <div class="pipeline-arrow">&#x2192;</div>
          <div class="pipeline-step" style="background:#ef4444;--i:4"><span class="pipeline-step-icon">&#x1F512;</span>Deprovisioned<span class="pipeline-step-sub">Instant, everywhere</span></div>
        </div>
      </div>

      <h2>How SCIM Works — The Flow</h2>
      <pre><code>1. Admin adds a new user "Jane" in the Identity Provider (Okta, Azure AD)
2. IdP sends a SCIM POST request to each connected app:
   POST https://your-app.com/scim/v2/Users
   { "userName": "jane@company.com", "name": { "givenName": "Jane", ... } }
3. Your app creates the user and returns the SCIM response
4. Jane can now log in to your app via SSO

When Jane leaves:
5. Admin deactivates Jane in the IdP
6. IdP sends SCIM PATCH to each app:
   PATCH https://your-app.com/scim/v2/Users/jane-uuid
   { "Operations": [{ "op": "replace", "path": "active", "value": false }] }
7. Jane is instantly deactivated everywhere</code></pre>

      <h2>SCIM Resource Types</h2>
      <p>SCIM defines two core resource types:</p>

      <h2>User Resource</h2>
      <pre><code>{
  "schemas": ["urn:ietf:params:scim:schemas:core:2.0:User"],
  "id": "a1b2c3d4-uuid",
  "externalId": "jane-from-idp",
  "userName": "jane@company.com",
  "name": {
    "givenName": "Jane",
    "familyName": "Developer",
    "formatted": "Jane Developer"
  },
  "emails": [
    { "value": "jane@company.com", "type": "work", "primary": true }
  ],
  "displayName": "Jane Developer",
  "active": true,
  "groups": [
    { "value": "group-uuid", "display": "Engineering" }
  ],
  "meta": {
    "resourceType": "User",
    "created": "2026-04-04T10:00:00Z",
    "lastModified": "2026-04-04T10:00:00Z",
    "location": "https://your-app.com/scim/v2/Users/a1b2c3d4-uuid"
  }
}</code></pre>

      <h2>Group Resource</h2>
      <pre><code>{
  "schemas": ["urn:ietf:params:scim:schemas:core:2.0:Group"],
  "id": "group-uuid",
  "displayName": "Engineering",
  "members": [
    { "value": "a1b2c3d4-uuid", "display": "Jane Developer" },
    { "value": "e5f6g7h8-uuid", "display": "John Backend" }
  ],
  "meta": {
    "resourceType": "Group",
    "location": "https://your-app.com/scim/v2/Groups/group-uuid"
  }
}</code></pre>

      <h2>SCIM API Endpoints</h2>
      <p>A SCIM server must implement these REST endpoints:</p>
      <pre><code>Method   Endpoint                    Purpose
──────   ──────────────────────────  ───────────────────────────────
GET      /scim/v2/Users              List users (with filtering)
GET      /scim/v2/Users/:id          Get a specific user
POST     /scim/v2/Users              Create a new user
PUT      /scim/v2/Users/:id          Replace a user (full update)
PATCH    /scim/v2/Users/:id          Partial update (e.g., deactivate)
DELETE   /scim/v2/Users/:id          Delete a user

GET      /scim/v2/Groups             List groups
GET      /scim/v2/Groups/:id         Get a specific group
POST     /scim/v2/Groups             Create a group
PATCH    /scim/v2/Groups/:id         Update group membership
DELETE   /scim/v2/Groups/:id         Delete a group

GET      /scim/v2/ServiceProviderConfig   Advertise supported features
GET      /scim/v2/Schemas                 Return supported schemas
GET      /scim/v2/ResourceTypes           Return supported resource types</code></pre>

      <h2>Building a SCIM Server — Python Example</h2>
      <p>Let's build a minimal SCIM 2.0 server using Flask. This handles user provisioning from any SCIM-compatible IdP:</p>
      <pre><code>from flask import Flask, request, jsonify
import uuid
from datetime import datetime

app = Flask(__name__)

# In-memory store (use a database in production)
users = {}
BASE_URL = "https://your-app.com/scim/v2"

def scim_error(status, detail):
    return jsonify({
        "schemas": ["urn:ietf:params:scim:api:messages:2.0:Error"],
        "status": str(status),
        "detail": detail,
    }), status

def format_user(user):
    return {
        "schemas": ["urn:ietf:params:scim:schemas:core:2.0:User"],
        "id": user["id"],
        "externalId": user.get("externalId", ""),
        "userName": user["userName"],
        "name": user.get("name", {}),
        "emails": user.get("emails", []),
        "displayName": user.get("displayName", ""),
        "active": user.get("active", True),
        "meta": {
            "resourceType": "User",
            "created": user["created"],
            "lastModified": user["lastModified"],
            "location": f"{BASE_URL}/Users/{user['id']}",
        },
    }

# ── Create User ──────────────────────────────────
@app.route("/scim/v2/Users", methods=["POST"])
def create_user():
    data = request.json
    user_name = data.get("userName")

    # Check for duplicates
    for u in users.values():
        if u["userName"] == user_name:
            return scim_error(409, f"User {user_name} already exists")

    now = datetime.utcnow().isoformat() + "Z"
    user = {
        "id": str(uuid.uuid4()),
        "externalId": data.get("externalId", ""),
        "userName": user_name,
        "name": data.get("name", {}),
        "emails": data.get("emails", []),
        "displayName": data.get("displayName", ""),
        "active": data.get("active", True),
        "created": now,
        "lastModified": now,
    }
    users[user["id"]] = user

    # TODO: Create the user in your actual application database here

    return jsonify(format_user(user)), 201

# ── Get User ─────────────────────────────────────
@app.route("/scim/v2/Users/&lt;user_id&gt;", methods=["GET"])
def get_user(user_id):
    user = users.get(user_id)
    if not user:
        return scim_error(404, "User not found")
    return jsonify(format_user(user))

# ── List / Filter Users ──────────────────────────
@app.route("/scim/v2/Users", methods=["GET"])
def list_users():
    filter_param = request.args.get("filter", "")
    count = int(request.args.get("count", 100))
    start = int(request.args.get("startIndex", 1))

    result = list(users.values())

    # Handle filter: userName eq "jane@company.com"
    if 'userName eq' in filter_param:
        value = filter_param.split('"')[1]
        result = [u for u in result if u["userName"] == value]

    total = len(result)
    result = result[start - 1:start - 1 + count]

    return jsonify({
        "schemas": ["urn:ietf:params:scim:api:messages:2.0:ListResponse"],
        "totalResults": total,
        "startIndex": start,
        "itemsPerPage": len(result),
        "Resources": [format_user(u) for u in result],
    })

# ── Update User (PATCH) ─────────────────────────
@app.route("/scim/v2/Users/&lt;user_id&gt;", methods=["PATCH"])
def patch_user(user_id):
    user = users.get(user_id)
    if not user:
        return scim_error(404, "User not found")

    data = request.json
    for op in data.get("Operations", []):
        if op["op"] == "replace":
            if op.get("path") == "active":
                user["active"] = op["value"]
                # TODO: Activate/deactivate in your app database
            elif op.get("path"):
                user[op["path"]] = op["value"]
            else:
                # Bulk replace
                user.update(op.get("value", {}))

    user["lastModified"] = datetime.utcnow().isoformat() + "Z"
    return jsonify(format_user(user))

# ── Delete User ──────────────────────────────────
@app.route("/scim/v2/Users/&lt;user_id&gt;", methods=["DELETE"])
def delete_user(user_id):
    if user_id not in users:
        return scim_error(404, "User not found")
    del users[user_id]
    # TODO: Delete or hard-deactivate in your app database
    return "", 204</code></pre>

      <h2>Securing Your SCIM Endpoint</h2>
      <p>SCIM endpoints must be secured — they can create and delete users in your system. Common approaches:</p>
      <pre><code># Bearer token authentication (most common with IdPs)
@app.before_request
def authenticate():
    auth = request.headers.get("Authorization", "")
    if not auth.startswith("Bearer "):
        return scim_error(401, "Missing bearer token")
    token = auth.split(" ")[1]
    if token != EXPECTED_SCIM_TOKEN:  # Store securely, rotate regularly
        return scim_error(401, "Invalid token")</code></pre>
      <p>Most IdPs (Okta, Azure AD) support <strong>Bearer token</strong> authentication for SCIM. You generate a long-lived token in your app, and the IdP includes it in every SCIM request.</p>

      <h2>Real-World Use Cases</h2>
      <ul>
        <li><strong>Employee onboarding:</strong> HR adds a new hire in Okta. SCIM automatically creates their account in Slack, Jira, GitHub, AWS IAM, your internal dashboard — all within seconds.</li>
        <li><strong>Employee offboarding:</strong> When someone leaves, IT deactivates them in the IdP. SCIM instantly deactivates their access across every connected app. No orphaned accounts, no security gaps.</li>
        <li><strong>Role changes:</strong> An engineer moves to the security team. Their IdP group membership changes, and SCIM propagates the new group to all connected apps, updating permissions automatically.</li>
        <li><strong>License management:</strong> Automatically deprovision users from paid tools when they leave, freeing up license seats.</li>
        <li><strong>Compliance and auditing:</strong> SCIM ensures your user directory is always in sync with your IdP, making SOC 2 and ISO 27001 audits straightforward.</li>
      </ul>

      <h2>Testing with Okta</h2>
      <p>To test your SCIM server with Okta:</p>
      <pre><code>1. In Okta Admin → Applications → Create App Integration
2. Choose SCIM 2.0 as the provisioning method
3. Enter your SCIM endpoint: https://your-app.com/scim/v2
4. Enter your Bearer token
5. Okta will test these endpoints:
   - GET /scim/v2/Users?filter=userName eq "test@example.com"
   - POST /scim/v2/Users (create test user)
   - GET /scim/v2/Users/:id (verify creation)
   - PATCH /scim/v2/Users/:id (deactivate)
6. If all pass, enable provisioning features:
   ✓ Create Users
   ✓ Update User Attributes
   ✓ Deactivate Users</code></pre>

      <h2>Common Pitfalls</h2>
      <ul>
        <li><strong>Filter parsing:</strong> IdPs send SCIM filter expressions like <code>userName eq "jane@co.com"</code>. You must parse and handle these — IdPs rely on filters to check for existing users before creating duplicates.</li>
        <li><strong>Case sensitivity:</strong> SCIM attribute names are case-sensitive per the spec, but some IdPs send them inconsistently. Be lenient in what you accept.</li>
        <li><strong>PATCH operations:</strong> Different IdPs send PATCH operations differently. Okta prefers <code>replace</code>, Azure AD sometimes uses <code>add</code> and <code>remove</code>. Test with your target IdPs.</li>
        <li><strong>Rate limiting:</strong> Large organizations might push thousands of users during initial sync. Make sure your endpoint can handle bulk operations.</li>
        <li><strong>Idempotency:</strong> If the IdP retries a failed request, creating a duplicate user is wrong. Always check for existing users by <code>userName</code> or <code>externalId</code> before creating.</li>
      </ul>

      <p>SCIM is a must-have for any B2B SaaS product targeting enterprise customers. It's the difference between "we support SSO" and "we support automated lifecycle management" — and the latter is what enterprise IT teams actually need. Implement it once, and you'll unlock integrations with every major identity provider out of the box.</p>
    `;
