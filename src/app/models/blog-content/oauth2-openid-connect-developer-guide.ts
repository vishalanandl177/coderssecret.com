export const CONTENT = `
      <p>OAuth 2.0 is the most misunderstood protocol in web development. Developers confuse authentication with authorization, skip PKCE because &ldquo;it works without it,&rdquo; store tokens in localStorage, and wonder why their app gets compromised. This guide explains what OAuth 2.0 actually does, how OpenID Connect adds authentication on top, and the security mistakes you must avoid.</p>

      <h2>OAuth 2.0 Is Authorization, Not Authentication</h2>

      <p>OAuth 2.0 answers one question: <strong>&ldquo;Can this app access this resource on behalf of this user?&rdquo;</strong> It does NOT answer &ldquo;Who is this user?&rdquo; That distinction matters.</p>

      <ul>
        <li><strong>Authorization (OAuth 2.0):</strong> &ldquo;This app can read your Google Drive files&rdquo;</li>
        <li><strong>Authentication (OpenID Connect):</strong> &ldquo;This user is alice@example.com&rdquo;</li>
      </ul>

      <p>If you use OAuth 2.0 alone for login, you are doing it wrong. You need OpenID Connect (OIDC), which is a thin identity layer built on top of OAuth 2.0.</p>

      <h2>The Key Players</h2>

      <ul>
        <li><strong>Resource Owner:</strong> The user who owns the data</li>
        <li><strong>Client:</strong> Your application that wants access</li>
        <li><strong>Authorization Server:</strong> Issues tokens (Google, Auth0, Keycloak)</li>
        <li><strong>Resource Server:</strong> The API that holds the data (Google Drive API, your backend)</li>
      </ul>

      <h2>Authorization Code Flow (The Right Way)</h2>

      <p>This is the flow you should use for web applications. It keeps secrets on the server and never exposes tokens to the browser URL bar.</p>

      <pre><code># Step 1: Redirect user to authorization server
GET https://auth.example.com/authorize?
  response_type=code
  &client_id=YOUR_CLIENT_ID
  &redirect_uri=https://yourapp.com/callback
  &scope=openid profile email
  &state=random_csrf_token
  &code_challenge=S256_HASH_OF_VERIFIER    # PKCE
  &code_challenge_method=S256

# Step 2: User logs in and grants permission
# Authorization server redirects back:
GET https://yourapp.com/callback?
  code=AUTHORIZATION_CODE
  &state=random_csrf_token

# Step 3: Exchange code for tokens (server-side, not browser!)
POST https://auth.example.com/token
Content-Type: application/x-www-form-urlencoded

grant_type=authorization_code
&code=AUTHORIZATION_CODE
&redirect_uri=https://yourapp.com/callback
&client_id=YOUR_CLIENT_ID
&client_secret=YOUR_CLIENT_SECRET
&code_verifier=ORIGINAL_RANDOM_VERIFIER    # PKCE

# Step 4: Receive tokens
{
  "access_token": "eyJhbGci...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "refresh_token": "dGhpcyBpcyBh...",
  "id_token": "eyJhbGci..."          # OpenID Connect!
}</code></pre>

      <h2>PKCE: Required for All Clients</h2>

      <p>PKCE (Proof Key for Code Exchange) prevents authorization code interception attacks. It was originally designed for mobile apps but is now <strong>required for all clients</strong> per OAuth 2.1.</p>

      <pre><code>import hashlib
import base64
import secrets

# Step 1: Generate a random verifier (43-128 characters)
code_verifier = secrets.token_urlsafe(32)
# Example: "dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk"

# Step 2: Create the challenge (SHA-256 hash of verifier)
code_challenge = base64.urlsafe_b64encode(
    hashlib.sha256(code_verifier.encode()).digest()
).decode().rstrip('=')

# Step 3: Send code_challenge in the authorization request
# Step 4: Send code_verifier in the token exchange
# The server verifies: SHA256(code_verifier) == code_challenge

# Without PKCE: an attacker who intercepts the authorization code
# can exchange it for tokens. With PKCE: they also need the verifier,
# which never left your app.</code></pre>

      <h2>OpenID Connect: Adding Identity</h2>

      <p>OIDC adds an <code>id_token</code> to the OAuth 2.0 response. This is a JWT containing user identity claims.</p>

      <pre><code># Decoded id_token payload:
{
  "iss": "https://auth.example.com",      # Who issued this token
  "sub": "user_123456",                    # Unique user identifier
  "aud": "YOUR_CLIENT_ID",                 # Intended audience
  "exp": 1714237200,                       # Expiration time
  "iat": 1714233600,                       # Issued at
  "email": "alice@example.com",            # User's email
  "name": "Alice Smith",                   # Display name
  "picture": "https://example.com/pic.jpg" # Avatar URL
}

# CRITICAL: Always validate the id_token before trusting it:
# 1. Verify the signature (using the issuer's public keys)
# 2. Check 'iss' matches the expected issuer
# 3. Check 'aud' matches YOUR client_id
# 4. Check 'exp' is in the future
# 5. Check 'iat' is not too far in the past</code></pre>

      <h2>Access Tokens vs Refresh Tokens</h2>

      <table>
        <thead>
          <tr>
            <th>Property</th>
            <th>Access Token</th>
            <th>Refresh Token</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Purpose</td>
            <td>Access protected resources</td>
            <td>Get new access tokens</td>
          </tr>
          <tr>
            <td>Lifetime</td>
            <td>Short (15 min - 1 hour)</td>
            <td>Long (days - months)</td>
          </tr>
          <tr>
            <td>Sent to</td>
            <td>Resource server (API)</td>
            <td>Authorization server only</td>
          </tr>
          <tr>
            <td>Revocable</td>
            <td>Not easily (unless using introspection)</td>
            <td>Yes (server-side revocation)</td>
          </tr>
          <tr>
            <td>Storage</td>
            <td>Memory or httpOnly cookie</td>
            <td>httpOnly cookie (server-side only)</td>
          </tr>
        </tbody>
      </table>

      <h3>Token Refresh Flow</h3>

      <pre><code># When access token expires, use refresh token to get a new one:
POST https://auth.example.com/token
Content-Type: application/x-www-form-urlencoded

grant_type=refresh_token
&refresh_token=dGhpcyBpcyBh...
&client_id=YOUR_CLIENT_ID
&client_secret=YOUR_CLIENT_SECRET

# Response: new access token (and optionally rotated refresh token)
{
  "access_token": "NEW_ACCESS_TOKEN",
  "expires_in": 3600,
  "refresh_token": "NEW_REFRESH_TOKEN"   # Rotation!
}</code></pre>

      <h2>Implementation: Django Backend</h2>

      <pre><code># views.py
import requests
from django.shortcuts import redirect
from django.http import JsonResponse
from django.conf import settings
import secrets

def login(request):
    """Redirect user to authorization server."""
    state = secrets.token_urlsafe(32)
    code_verifier = secrets.token_urlsafe(32)

    # Store in session for verification later
    request.session['oauth_state'] = state
    request.session['code_verifier'] = code_verifier

    code_challenge = create_code_challenge(code_verifier)

    auth_url = (
        f"{settings.AUTH_SERVER_URL}/authorize?"
        f"response_type=code"
        f"&client_id={settings.CLIENT_ID}"
        f"&redirect_uri={settings.REDIRECT_URI}"
        f"&scope=openid profile email"
        f"&state={state}"
        f"&code_challenge={code_challenge}"
        f"&code_challenge_method=S256"
    )
    return redirect(auth_url)


def callback(request):
    """Handle the authorization code callback."""
    # Verify state to prevent CSRF
    if request.GET.get('state') != request.session.get('oauth_state'):
        return JsonResponse({"error": "Invalid state"}, status=403)

    code = request.GET.get('code')
    code_verifier = request.session.pop('code_verifier')

    # Exchange code for tokens (server-side!)
    token_response = requests.post(
        f"{settings.AUTH_SERVER_URL}/token",
        data={
            'grant_type': 'authorization_code',
            'code': code,
            'redirect_uri': settings.REDIRECT_URI,
            'client_id': settings.CLIENT_ID,
            'client_secret': settings.CLIENT_SECRET,
            'code_verifier': code_verifier,
        }
    )

    tokens = token_response.json()
    id_token = validate_and_decode_id_token(tokens['id_token'])

    # Create or update user from id_token claims
    user = get_or_create_user(
        sub=id_token['sub'],
        email=id_token['email'],
        name=id_token.get('name', ''),
    )

    # Set session
    request.session['user_id'] = user.id
    return redirect('/dashboard')</code></pre>

      <h2>Security Mistakes That Get Apps Hacked</h2>

      <ul>
        <li><strong>Storing tokens in localStorage:</strong> Accessible via XSS. Use httpOnly cookies or in-memory storage.</li>
        <li><strong>Not validating the state parameter:</strong> Enables CSRF attacks where an attacker links their account to your session.</li>
        <li><strong>Not validating id_token signature:</strong> Anyone can craft a JWT with any claims. Always verify the signature against the issuer&rsquo;s public keys.</li>
        <li><strong>Using implicit flow:</strong> Tokens in URL fragments are logged in browser history, server logs, and referrer headers. Use authorization code + PKCE instead.</li>
        <li><strong>Not using PKCE:</strong> Authorization code interception is a real attack on mobile and SPA apps.</li>
        <li><strong>Overly broad scopes:</strong> Request the minimum scopes needed. &ldquo;openid email&rdquo; not &ldquo;openid profile email phone address.&rdquo;</li>
        <li><strong>Not rotating refresh tokens:</strong> If a refresh token is stolen, the attacker has long-lived access. Rotate on every use.</li>
        <li><strong>Hardcoding redirect URIs with wildcards:</strong> Allows open redirect attacks. Use exact match redirect URIs.</li>
      </ul>

      <h2>Key Takeaways</h2>

      <ul>
        <li><strong>OAuth 2.0 = authorization, OIDC = authentication</strong> &mdash; do not use OAuth alone for login</li>
        <li><strong>Always use Authorization Code flow + PKCE</strong> &mdash; implicit flow is deprecated</li>
        <li><strong>Validate everything:</strong> state parameter, id_token signature, issuer, audience, expiration</li>
        <li><strong>Store tokens securely:</strong> httpOnly cookies for web, secure storage for mobile, never localStorage</li>
        <li><strong>Use short-lived access tokens + refresh token rotation</strong> to limit blast radius of token theft</li>
        <li><strong>The token exchange must happen server-side</strong> &mdash; never expose client_secret to the browser</li>
      </ul>

      <p>OAuth 2.0 and OIDC are not complicated once you understand the roles and flows. The protocol itself is sound &mdash; the vulnerabilities come from implementation shortcuts. Follow this guide, avoid the security mistakes, and your auth implementation will be solid.</p>
    `;
