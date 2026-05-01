export const CONTENT = `
      <p>Single Sign-On (SSO) lets users log in once and access multiple applications without re-entering credentials. If you've ever clicked "Sign in with Google" or logged into your company's dashboard and had access to Slack, Jira, and Gmail automatically — that's SSO in action. Two protocols dominate the SSO landscape: <strong>SAML 2.0</strong> and <strong>OpenID Connect (OIDC)</strong>.</p>

      <h2>How SSO Works (The Big Picture)</h2>
      <p>Regardless of the protocol, SSO follows a common pattern:</p>
      <ul>
        <li><strong>Identity Provider (IdP):</strong> The central authority that authenticates users (e.g., Okta, Azure AD, Auth0, Google Workspace).</li>
        <li><strong>Service Provider (SP) / Relying Party (RP):</strong> The application the user wants to access (your app).</li>
        <li><strong>Trust Relationship:</strong> The SP and IdP have a pre-configured trust — they've exchanged certificates or secrets ahead of time.</li>
      </ul>
      <p>The user visits your app, gets redirected to the IdP, authenticates, and gets sent back with proof of identity. Your app trusts this proof because it trusts the IdP.</p>

      <!-- SSO Overview Diagram (Interactive) -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">Single Sign-On: Login Once, Access Everything</div>
        <div class="hub-diagram">
          <div class="hub-center">
            Identity Provider
            <span class="hub-center-sub">Okta / Azure AD / Auth0 / Google Workspace</span>
          </div>
          <div class="hub-arrow-label">
            <span class="arrow-animated">&#x2B06;</span> Login once here
          </div>
          <div class="hub-user">&#x1F464;</div>
          <div class="hub-arrow-label">
            <span class="arrow-animated">&#x2B07;</span> Access all apps below
          </div>
          <div class="hub-apps">
            <div class="hub-app"><span class="hub-app-icon">&#x1F4AC;</span>Slack<span class="hub-app-sub">Chat</span></div>
            <div class="hub-app"><span class="hub-app-icon">&#x1F4CB;</span>Jira<span class="hub-app-sub">Projects</span></div>
            <div class="hub-app"><span class="hub-app-icon">&#x1F680;</span>Your App<span class="hub-app-sub">SaaS</span></div>
            <div class="hub-app"><span class="hub-app-icon">&#x2709;</span>Gmail<span class="hub-app-sub">Email</span></div>
          </div>
          <div class="hub-connector">
            <span><span class="hub-dot-line"></span> Trust relationship</span>
            <span><span class="hub-solid-line"></span> Access granted</span>
          </div>
        </div>
      </div>


      <h2>SAML 2.0 — The Enterprise Veteran</h2>
      <p>SAML (Security Assertion Markup Language) has been the backbone of enterprise SSO since 2005. It uses XML-based assertions passed between the IdP and SP.</p>

      <h2>SAML Authentication Flow</h2>
      <pre><code>1. User visits https://app.example.com (Service Provider)
2. SP generates a SAML AuthnRequest (XML)
3. User's browser is redirected to the IdP with the AuthnRequest
4. IdP authenticates the user (login page, MFA, etc.)
5. IdP generates a SAML Response containing an Assertion
   - The Assertion includes: user identity, attributes, conditions
   - The entire Response is digitally signed with IdP's private key
6. User's browser POSTs the SAML Response back to the SP's ACS URL
7. SP validates the signature, checks conditions, extracts user info
8. SP creates a session — user is logged in</code></pre>

      <!-- SAML Flow (Interactive) -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">SAML 2.0 Authentication Flow</div>
        <div class="seq-diagram">
          <div class="seq-actors">
            <div class="seq-actor browser">Browser / User</div>
            <div class="seq-actor sp">Service Provider<span class="seq-actor-sub">(Your App)</span></div>
            <div class="seq-actor idp">Identity Provider<span class="seq-actor-sub">(Okta / Azure AD)</span></div>
          </div>
          <div class="seq-steps">
            <div class="seq-step">
              <div class="seq-arrow right" style="--arrow-color:#3b82f6"><span class="seq-num blue">1</span> Visit app.example.com</div>
            </div>
            <div class="seq-step">
              <div class="seq-arrow left" style="--arrow-color:#22c55e"><span class="seq-num green">2</span> Redirect + AuthnRequest (XML)</div>
            </div>
            <div class="seq-step">
              <div class="seq-arrow full-right" style="--arrow-color:#3b82f6"><span class="seq-num blue">3</span> Forward AuthnRequest to IdP</div>
            </div>
            <div class="seq-step">
              <div class="seq-arrow full-left" style="--arrow-color:#7c3aed"><span class="seq-num purple">4</span> Show login page + MFA</div>
            </div>
            <div class="seq-step">
              <div class="seq-arrow full-right" style="--arrow-color:#f97316"><span class="seq-num orange">5</span> User enters credentials</div>
            </div>
            <div class="seq-step">
              <div></div>
              <div></div>
              <div class="seq-action" style="border-color:#7c3aed;color:#a78bfa">Validate &amp; Sign Assertion</div>
            </div>
            <div class="seq-step">
              <div class="seq-arrow full-left" style="--arrow-color:#7c3aed"><span class="seq-num purple">6</span> SAML Response (signed XML Assertion)</div>
            </div>
            <div class="seq-step">
              <div class="seq-arrow right" style="--arrow-color:#3b82f6"><span class="seq-num blue">7</span> POST SAML Response to ACS URL</div>
            </div>
            <div class="seq-step">
              <div></div>
              <div class="seq-action" style="border-color:#22c55e;color:#4ade80">Verify signature &amp; extract user</div>
            </div>
            <div class="seq-step">
              <div class="seq-arrow left" style="--arrow-color:#22c55e"><span class="seq-num green">8</span> Session created &#x2014; logged in! &#x2705;</div>
            </div>
          </div>
        </div>
      </div>


      <h2>SAML Response Structure</h2>
      <pre><code>&lt;saml2p:Response&gt;
  &lt;saml2:Assertion&gt;
    &lt;saml2:Issuer&gt;https://idp.example.com&lt;/saml2:Issuer&gt;
    &lt;ds:Signature&gt;...digital signature...&lt;/ds:Signature&gt;
    &lt;saml2:Subject&gt;
      &lt;saml2:NameID&gt;user@example.com&lt;/saml2:NameID&gt;
    &lt;/saml2:Subject&gt;
    &lt;saml2:Conditions NotBefore="..." NotOnOrAfter="..."&gt;
      &lt;saml2:AudienceRestriction&gt;
        &lt;saml2:Audience&gt;https://app.example.com&lt;/saml2:Audience&gt;
      &lt;/saml2:AudienceRestriction&gt;
    &lt;/saml2:Conditions&gt;
    &lt;saml2:AttributeStatement&gt;
      &lt;saml2:Attribute Name="email"&gt;
        &lt;saml2:AttributeValue&gt;user@example.com&lt;/saml2:AttributeValue&gt;
      &lt;/saml2:Attribute&gt;
      &lt;saml2:Attribute Name="role"&gt;
        &lt;saml2:AttributeValue&gt;admin&lt;/saml2:AttributeValue&gt;
      &lt;/saml2:Attribute&gt;
    &lt;/saml2:AttributeStatement&gt;
  &lt;/saml2:Assertion&gt;
&lt;/saml2p:Response&gt;</code></pre>

      <h2>Implementing SAML SP in Python</h2>
      <pre><code># Using python3-saml
from onelogin.saml2.auth import OneLogin_Saml2_Auth

def saml_login(request):
    auth = OneLogin_Saml2_Auth(request, custom_base_path=settings.SAML_FOLDER)
    return redirect(auth.login())

def saml_acs(request):
    """Assertion Consumer Service — receives the SAML Response"""
    auth = OneLogin_Saml2_Auth(request, custom_base_path=settings.SAML_FOLDER)
    auth.process_response()
    errors = auth.get_errors()

    if not errors:
        user_data = {
            'email': auth.get_nameid(),
            'attributes': auth.get_attributes(),
            'session_index': auth.get_session_index(),
        }
        # Create/update user and establish session
        create_session(user_data)
        return redirect('/dashboard')
    else:
        return HttpResponse(f'SAML Error: {errors}', status=400)</code></pre>

      <h2>OpenID Connect (OIDC) — The Modern Standard</h2>
      <p>OIDC is built on top of OAuth 2.0 and uses JSON/JWT instead of XML. It was designed in 2014 as a simpler, more developer-friendly alternative to SAML.</p>

      <h2>OIDC Authorization Code Flow</h2>
      <pre><code>1. User visits https://app.example.com
2. App redirects to IdP's authorization endpoint:
   GET https://idp.example.com/authorize?
     response_type=code
     &client_id=YOUR_CLIENT_ID
     &redirect_uri=https://app.example.com/callback
     &scope=openid profile email
     &state=random_csrf_token
     &nonce=random_nonce

3. User authenticates at the IdP
4. IdP redirects back with an authorization code:
   GET https://app.example.com/callback?code=AUTH_CODE&state=random_csrf_token

5. App exchanges the code for tokens (server-to-server):
   POST https://idp.example.com/token
   {
     "grant_type": "authorization_code",
     "code": "AUTH_CODE",
     "redirect_uri": "https://app.example.com/callback",
     "client_id": "YOUR_CLIENT_ID",
     "client_secret": "YOUR_CLIENT_SECRET"
   }

6. IdP returns tokens:
   {
     "access_token": "eyJ...",
     "id_token": "eyJ...",      // Contains user identity
     "refresh_token": "eyJ...",
     "token_type": "Bearer",
     "expires_in": 3600
   }

7. App validates the id_token JWT and extracts user info</code></pre>

      <!-- OIDC Flow (Interactive) -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">OIDC Authorization Code Flow</div>
        <div class="seq-diagram">
          <div class="seq-actors">
            <div class="seq-actor browser">Browser / User</div>
            <div class="seq-actor sp">Your App<span class="seq-actor-sub">(Relying Party)</span></div>
            <div class="seq-actor idp">Identity Provider<span class="seq-actor-sub">(OIDC Server)</span></div>
          </div>
          <div class="seq-steps">
            <div class="seq-step">
              <div class="seq-arrow right" style="--arrow-color:#3b82f6"><span class="seq-num blue">1</span> Visit app</div>
            </div>
            <div class="seq-step">
              <div class="seq-arrow left" style="--arrow-color:#22c55e"><span class="seq-num green">2</span> Redirect to /authorize</div>
            </div>
            <div class="seq-step">
              <div class="seq-arrow full-right" style="--arrow-color:#3b82f6"><span class="seq-num blue">3</span> /authorize?response_type=code&amp;scope=openid</div>
            </div>
            <div class="seq-step">
              <div class="seq-arrow full-left" style="--arrow-color:#7c3aed"><span class="seq-num purple">4</span> Login page</div>
            </div>
            <div class="seq-step">
              <div class="seq-arrow full-right" style="--arrow-color:#f97316"><span class="seq-num orange">5</span> User authenticates</div>
            </div>
            <div class="seq-step">
              <div class="seq-arrow full-left" style="--arrow-color:#7c3aed"><span class="seq-num purple">6</span> Redirect to /callback?code=AUTH_CODE</div>
            </div>
            <div class="seq-step">
              <div class="seq-arrow right" style="--arrow-color:#3b82f6"><span class="seq-num blue">7</span> Forward code to app server</div>
            </div>
            <div class="seq-step">
              <div class="seq-backchannel">
                <span class="seq-backchannel-label">Back Channel (Server-to-Server)</span>
                <div class="seq-arrow right-23" style="--arrow-color:#f97316"><span class="seq-num orange">8</span> Exchange code for tokens</div>
              </div>
            </div>
            <div class="seq-step">
              <div></div>
              <div class="seq-arrow left-23" style="--arrow-color:#7c3aed"><span class="seq-num purple">9</span> access_token + id_token (JWT)</div>
            </div>
            <div class="seq-step">
              <div></div>
              <div class="seq-action" style="border-color:#22c55e;color:#4ade80">Validate JWT &amp; extract user info</div>
            </div>
            <div class="seq-step">
              <div class="seq-arrow left" style="--arrow-color:#22c55e"><span class="seq-num green">10</span> Session created &#x2014; logged in! &#x2705;</div>
            </div>
          </div>
        </div>
      </div>


      <h2>The ID Token</h2>
      <p>The key differentiator of OIDC is the <strong>ID Token</strong> — a JWT containing the authenticated user's identity:</p>

      <!-- JWT Anatomy (Interactive) -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">JSON Web Token (JWT) Structure — Hover to Explore</div>
        <div class="jwt-diagram">
          <div class="jwt-parts">
            <div class="jwt-part header">
              <span class="jwt-part-label">Header</span>
              <span class="jwt-part-code">eyJhbGciOiJSUzI1NiJ9</span>
              <span class="jwt-part-desc">{"alg": "RS256", "typ": "JWT"}</span>
            </div>
            <div class="jwt-dot">.</div>
            <div class="jwt-part payload">
              <span class="jwt-part-label">Payload (Claims)</span>
              <span class="jwt-part-code">eyJzdWIiOiIxMjM0NTY3...</span>
              <span class="jwt-part-desc">{"sub", "email", "name", "exp", ...}</span>
            </div>
            <div class="jwt-dot">.</div>
            <div class="jwt-part signature">
              <span class="jwt-part-label">Signature</span>
              <span class="jwt-part-code">SflKxwRJSMeKKF2QT4fw...</span>
              <span class="jwt-part-desc">HMAC-SHA256 or RSA signature</span>
            </div>
          </div>
          <div class="jwt-raw">
            <span class="h">eyJhbGciOiJSUzI1NiJ9</span>.<span class="p">eyJzdWIiOiJ1c2VyLXV1aWQiLCJlbWFpbCI6InVzZXJAZXhhbXBsZS5jb20ifQ</span>.<span class="s">SflKxwRJSMeKKF2QT4fwpM</span>
          </div>
        </div>
      </div>

      <pre><code>// Decoded ID Token payload
{
  "iss": "https://idp.example.com",
  "sub": "user-uuid-12345",
  "aud": "YOUR_CLIENT_ID",
  "exp": 1712345678,
  "iat": 1712342078,
  "nonce": "random_nonce",
  "email": "user@example.com",
  "name": "Jane Developer",
  "picture": "https://example.com/photo.jpg",
  "email_verified": true
}</code></pre>

      <h2>SAML vs OIDC — When to Use Which</h2>
      <ul>
        <li><strong>Use SAML when:</strong> Integrating with enterprise IdPs (Okta, Azure AD, ADFS), legacy systems require it, or your customers' IT teams expect SAML support. Most enterprise B2B SaaS products need SAML.</li>
        <li><strong>Use OIDC when:</strong> Building modern web/mobile apps, using social login (Google, GitHub, Apple), building consumer-facing products, or when you want simpler implementation with JWTs.</li>
        <li><strong>Support both when:</strong> Building a B2B SaaS product that serves both enterprise and smaller customers. Most identity platforms (Auth0, Okta) can act as a bridge, accepting SAML from enterprise IdPs and exposing OIDC to your app.</li>
      </ul>

      <h2>Key Differences at a Glance</h2>
      <pre><code>Feature              SAML 2.0              OIDC
──────────────────   ──────────────────    ──────────────────
Data Format          XML                   JSON / JWT
Transport            HTTP POST/Redirect    HTTP GET/POST
Token Type           XML Assertion         JWT (ID Token)
Year Introduced      2005                  2014
Best For             Enterprise SSO        Modern apps, mobile
Complexity           High                  Medium
Mobile Support       Poor                  Excellent
Discovery            Manual config         .well-known endpoint
Standard Body        OASIS                 OpenID Foundation</code></pre>

      <!-- SAML vs OIDC (Interactive Cards) -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">SAML 2.0 vs OpenID Connect — At a Glance</div>
        <div class="vs-cards">
          <div class="vs-card saml">
            <div class="vs-card-header">SAML 2.0</div>
            <div class="vs-card-body">
              <div class="vs-row"><span class="vs-row-icon">&#x1F4C4;</span>Data Format<span class="vs-row-value" style="color:#f97316">XML</span></div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F4E6;</span>Token Type<span class="vs-row-value" style="color:#f97316">XML Assertion</span></div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F4C5;</span>Since<span class="vs-row-value" style="color:#f97316">2005</span></div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F3E2;</span>Best For<span class="vs-row-value" style="color:#f97316">Enterprise SSO</span></div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F4F1;</span>Mobile<span class="vs-row-value" style="color:#ef4444">Poor</span></div>
              <div class="vs-row"><span class="vs-row-icon">&#x2699;</span>Complexity<span class="vs-row-value" style="color:#f97316">High</span></div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F50D;</span>Discovery<span class="vs-row-value" style="color:#f97316">Manual config</span></div>
            </div>
          </div>
          <div class="vs-badge">VS</div>
          <div class="vs-card oidc">
            <div class="vs-card-header">OpenID Connect</div>
            <div class="vs-card-body">
              <div class="vs-row"><span class="vs-row-icon">&#x1F4C4;</span>Data Format<span class="vs-row-value" style="color:#3b82f6">JSON / JWT</span></div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F4E6;</span>Token Type<span class="vs-row-value" style="color:#3b82f6">JWT (ID Token)</span></div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F4C5;</span>Since<span class="vs-row-value" style="color:#3b82f6">2014</span></div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F3E2;</span>Best For<span class="vs-row-value" style="color:#3b82f6">Modern apps</span></div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F4F1;</span>Mobile<span class="vs-row-value" style="color:#22c55e">Excellent</span></div>
              <div class="vs-row"><span class="vs-row-icon">&#x2699;</span>Complexity<span class="vs-row-value" style="color:#3b82f6">Medium</span></div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F50D;</span>Discovery<span class="vs-row-value" style="color:#22c55e">.well-known</span></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Decision Tree (Interactive) -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">Which Protocol Should You Use?</div>
        <div class="dtree">
          <div class="dtree-node question">What are you building?</div>
          <div class="dtree-branches">
            <div class="dtree-branch">
              <div class="dtree-label">Enterprise B2B SaaS?</div>
              <div class="dtree-connector orange"></div>
              <div class="dtree-answer saml">Use SAML<span class="dtree-answer-sub">(+ OIDC optional)</span></div>
            </div>
            <div class="dtree-branch">
              <div class="dtree-label">Both enterprise + consumer?</div>
              <div class="dtree-connector green"></div>
              <div class="dtree-answer both">Support Both<span class="dtree-answer-sub">(Auth0/Okta as bridge)</span></div>
            </div>
            <div class="dtree-branch">
              <div class="dtree-label">Consumer / Mobile app?</div>
              <div class="dtree-connector blue"></div>
              <div class="dtree-answer oidc">Use OIDC<span class="dtree-answer-sub">(simpler, JWT-based)</span></div>
            </div>
          </div>
        </div>
      </div>

      <h2>Security Best Practices for Both</h2>
      <ul>
        <li><strong>Always validate signatures:</strong> Never trust assertions or tokens without verifying the cryptographic signature.</li>
        <li><strong>Check timestamps:</strong> Validate <code>NotBefore</code>, <code>NotOnOrAfter</code> (SAML) and <code>exp</code>, <code>iat</code> (OIDC) to prevent replay attacks.</li>
        <li><strong>Verify audience:</strong> Ensure the assertion/token was intended for your application.</li>
        <li><strong>Use HTTPS everywhere:</strong> Tokens and assertions must only travel over TLS.</li>
        <li><strong>Implement proper session management:</strong> Support single logout (SLO) and session timeouts.</li>
        <li><strong>Store secrets securely:</strong> Client secrets and private keys belong in vaults, not config files.</li>
      </ul>

      <p>SSO is no longer optional for serious applications. Whether you choose SAML, OIDC, or both, understanding these protocols deeply will help you build secure, user-friendly authentication that scales with your product.</p>
    `;
