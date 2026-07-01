export const CONTENT = `
      <p>OAuth2 private key JWT, usually written as <code>private_key_jwt</code>, is a client authentication method for confidential OAuth clients. Instead of sending a shared <code>client_secret</code> to the token endpoint, the client signs a short-lived JWT with its private key. The authorization server verifies the signature with the client's registered public key, checks the claims, and then decides whether to issue tokens.</p>

      <p>This pattern is common in high-trust server-to-server systems, financial APIs, enterprise OIDC integrations, partner APIs, and internal platforms where a copied client secret would be too easy to leak. It does not remove all key management. It changes the shared-secret problem into an asymmetric-key problem with short-lived assertions, key identifiers, rotation, and replay protection.</p>

      <aside class="callout callout-security">
        <strong>Security rule:</strong> a private key JWT is not an access token. It is proof that the OAuth client controls the private key registered for its <code>client_id</code>. The authorization server still applies client registration, grant type, scope, audience, and policy before issuing an access token.
      </aside>

      <h2>What Private Key JWT Solves</h2>

      <p>Most OAuth client authentication starts with <code>client_secret_basic</code> or <code>client_secret_post</code>. Both use a symmetric secret. The client and authorization server know the same value. That is simple, but it has production problems:</p>

      <ul>
        <li><strong>The secret is reusable.</strong> If it leaks from logs, CI variables, support bundles, Terraform state, or a developer machine, the attacker can authenticate until it is rotated.</li>
        <li><strong>The secret must be present at runtime.</strong> Every environment that calls the token endpoint needs a copy or a secret-manager reference.</li>
        <li><strong>Rotation is disruptive.</strong> Changing a shared secret often means coordinating all deployments that use it.</li>
        <li><strong>Attribution is weak.</strong> The token endpoint sees the client, but not a one-time assertion identifier that can be replay-checked and audited.</li>
      </ul>

      <p>With <code>private_key_jwt</code>, the authorization server stores or fetches only the public key. The private key stays with the client. Each token request includes a freshly signed JWT assertion with a short expiration and a unique <code>jti</code>. The server verifies the assertion and rejects reused, expired, wrong-audience, or wrongly signed assertions.</p>

      <h2>The Core Flow</h2>

      <div class="flow-diagram" role="img" aria-label="OAuth2 private key JWT client authentication flow">
        <div class="flow-diagram-title">Key Pair &rarr; Signed Client Assertion &rarr; Token Endpoint</div>
        <div style="display:grid;grid-template-columns:repeat(5,minmax(150px,1fr));gap:0.75rem;min-width:860px">
          <div style="border:1px solid var(--md-sys-color-outline-variant);background:var(--md-sys-color-surface-container);border-radius:0.9rem;padding:1rem;text-align:center"><strong>Client</strong><br><small>Owns private key</small></div>
          <div style="border:1px solid var(--md-sys-color-secondary);background:var(--md-sys-color-secondary-container);color:var(--md-sys-color-on-secondary-container);border-radius:0.9rem;padding:1rem;text-align:center"><strong>Registered Key</strong><br><small>JWKS or jwks_uri</small></div>
          <div style="border:1px solid var(--md-sys-color-tertiary);background:var(--md-sys-color-tertiary-container);color:var(--md-sys-color-on-tertiary-container);border-radius:0.9rem;padding:1rem;text-align:center"><strong>JWT Assertion</strong><br><small>iss, sub, aud, exp, jti</small></div>
          <div style="border:1px solid var(--md-sys-color-primary);background:var(--md-sys-color-primary-container);color:var(--md-sys-color-on-primary-container);border-radius:0.9rem;padding:1rem;text-align:center"><strong>Authorization Server</strong><br><small>Verifies signature and claims</small></div>
          <div style="border:1px solid var(--md-sys-color-error);background:var(--md-sys-color-error-container);color:var(--md-sys-color-on-error-container);border-radius:0.9rem;padding:1rem;text-align:center"><strong>Access Token</strong><br><small>Issued only after policy</small></div>
        </div>
      </div>

      <ol>
        <li><strong>Generate a key pair.</strong> The client keeps the private key and exposes or uploads the public key as JWK/JWKS.</li>
        <li><strong>Register the client.</strong> The authorization server records <code>client_id</code>, allowed grant types, allowed scopes, <code>token_endpoint_auth_method=private_key_jwt</code>, allowed signing algorithms, and the public key.</li>
        <li><strong>Create a client assertion.</strong> For each token request, the client builds a JWT whose issuer and subject identify the client, whose audience identifies the token endpoint, and whose expiration is close.</li>
        <li><strong>Sign the assertion.</strong> The JWT header includes an allowed <code>alg</code> and a <code>kid</code> that selects the public key.</li>
        <li><strong>POST to the token endpoint.</strong> The request includes <code>client_assertion_type</code> and <code>client_assertion</code> along with the normal OAuth grant parameters.</li>
        <li><strong>Verify and issue.</strong> The authorization server verifies the signature and claims, rejects replayed <code>jti</code> values, checks policy, and returns an access token if the request is allowed.</li>
      </ol>

      <h2>Where It Fits in OAuth2</h2>

      <p><code>private_key_jwt</code> is about <strong>client authentication</strong>. It answers: "Is this OAuth client really the registered confidential client?" It is not the same thing as a JWT access token, an ID token, or a JWT bearer authorization grant.</p>

      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Term</th>
              <th>Purpose</th>
              <th>Common confusion</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>private_key_jwt</code></td>
              <td>Authenticates the OAuth client to the token endpoint using a signed JWT assertion.</td>
              <td>The assertion proves the client, not the end user.</td>
            </tr>
            <tr>
              <td>JWT access token</td>
              <td>Represents authorization to call a resource server.</td>
              <td>A private key JWT assertion is sent to the authorization server, not to the API as a bearer token.</td>
            </tr>
            <tr>
              <td>OpenID Connect ID token</td>
              <td>Represents authentication information about an end user.</td>
              <td>An ID token is not client authentication.</td>
            </tr>
            <tr>
              <td>JWT bearer grant</td>
              <td>Uses a JWT as an authorization grant to request an access token.</td>
              <td>RFC 7523 defines both JWT grants and JWT client authentication, but they are different roles.</td>
            </tr>
            <tr>
              <td>mTLS client authentication</td>
              <td>Authenticates the client at the TLS layer and can bind tokens to certificates.</td>
              <td>mTLS and <code>private_key_jwt</code> both use asymmetric keys, but at different protocol layers.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>The Token Request</h2>

      <p>For client credentials, the request shape looks like this:</p>

      <pre><code>POST /oauth2/token HTTP/1.1
Host: auth.example.com
Content-Type: application/x-www-form-urlencoded

grant_type=client_credentials
&amp;scope=payments.read payments.write
&amp;client_id=orders-service
&amp;client_assertion_type=urn:ietf:params:oauth:client-assertion-type:jwt-bearer
&amp;client_assertion=eyJhbGciOiJSUzI1NiIsImtpZCI6Im9yZGVycy0yMDI2LTA3In0...</code></pre>

      <p>The value of <code>client_assertion_type</code> is fixed for JWT bearer assertions: <code>urn:ietf:params:oauth:client-assertion-type:jwt-bearer</code>. The <code>client_assertion</code> is one compact JWS: header, payload, signature.</p>

      <h2>JWT Claims You Must Get Right</h2>

      <p>The assertion is small, but every claim matters. A valid signature alone is not enough. The authorization server must know which client signed the assertion, which endpoint it was meant for, when it expires, and whether it has been used before.</p>

      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Field</th>
              <th>Example</th>
              <th>Production rule</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Header <code>alg</code></td>
              <td><code>RS256</code> or <code>ES256</code></td>
              <td>Allowlist algorithms per client. Never accept <code>none</code> or whatever the token asks for.</td>
            </tr>
            <tr>
              <td>Header <code>kid</code></td>
              <td><code>orders-2026-07</code></td>
              <td>Selects the registered public key. Required for smooth rotation.</td>
            </tr>
            <tr>
              <td><code>iss</code></td>
              <td><code>orders-service</code></td>
              <td>For client authentication, normally the OAuth <code>client_id</code>.</td>
            </tr>
            <tr>
              <td><code>sub</code></td>
              <td><code>orders-service</code></td>
              <td>For client authentication, must identify the same client. Do not accept a user subject here.</td>
            </tr>
            <tr>
              <td><code>aud</code></td>
              <td><code>https://auth.example.com/oauth2/token</code></td>
              <td>Must identify the authorization server or token endpoint exactly as configured.</td>
            </tr>
            <tr>
              <td><code>iat</code></td>
              <td><code>1782902400</code></td>
              <td>Issued-at time. Reject assertions too far in the past or future.</td>
            </tr>
            <tr>
              <td><code>exp</code></td>
              <td><code>1782902700</code></td>
              <td>Keep short. Five minutes or less is a common starting point.</td>
            </tr>
            <tr>
              <td><code>jti</code></td>
              <td><code>uuid</code></td>
              <td>Unique assertion ID. Store until expiration and reject replay.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Build It in Python</h2>

      <p>The demo below is self-contained. It generates an RSA key pair, publishes the public key as a JWK, signs a <code>private_key_jwt</code> assertion, verifies it like an authorization server would, rejects a replay, and prints the form body you would send to a real token endpoint.</p>

      <h3>Install Dependencies</h3>

      <pre><code>python -m venv .venv
.venv\\Scripts\\activate
pip install pyjwt cryptography requests</code></pre>

      <p>On macOS or Linux, activate the environment with <code>source .venv/bin/activate</code>.</p>

      <h3>private_key_jwt_demo.py</h3>

      <pre><code>import base64
import json
import time
import uuid
from dataclasses import dataclass, field
from typing import Dict, Set

import jwt
from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography.hazmat.primitives import serialization


CLIENT_ASSERTION_TYPE = (
    "urn:ietf:params:oauth:client-assertion-type:jwt-bearer"
)


def b64url_uint(value: int) -&gt; str:
    """Encode an RSA integer as base64url without padding for JWK."""
    byte_length = (value.bit_length() + 7) // 8
    data = value.to_bytes(byte_length, "big")
    return base64.urlsafe_b64encode(data).decode("ascii").rstrip("=")


def generate_rsa_key_pair():
    private_key = rsa.generate_private_key(
        public_exponent=65537,
        key_size=2048,
    )
    private_pem = private_key.private_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PrivateFormat.PKCS8,
        encryption_algorithm=serialization.NoEncryption(),
    )
    return private_key, private_pem


def public_jwk(private_key, kid: str) -&gt; Dict[str, str]:
    numbers = private_key.public_key().public_numbers()
    return {
        "kty": "RSA",
        "kid": kid,
        "use": "sig",
        "alg": "RS256",
        "n": b64url_uint(numbers.n),
        "e": b64url_uint(numbers.e),
    }


def create_client_assertion(
    *,
    client_id: str,
    token_endpoint: str,
    private_pem: bytes,
    kid: str,
    lifetime_seconds: int = 300,
) -&gt; str:
    now = int(time.time())
    claims = {
        "iss": client_id,
        "sub": client_id,
        "aud": token_endpoint,
        "iat": now,
        "exp": now + lifetime_seconds,
        "jti": str(uuid.uuid4()),
    }
    headers = {
        "alg": "RS256",
        "kid": kid,
        "typ": "JWT",
    }
    return jwt.encode(
        claims,
        private_pem,
        algorithm="RS256",
        headers=headers,
    )


@dataclass
class RegisteredClient:
    client_id: str
    token_endpoint: str
    jwks: Dict[str, Dict[str, str]]
    allowed_algs: Set[str] = field(default_factory=lambda: {"RS256"})


class AuthorizationServerVerifier:
    def __init__(self):
        self.used_jti: Set[str] = set()

    def verify_private_key_jwt(
        self,
        *,
        client: RegisteredClient,
        assertion: str,
    ) -&gt; Dict:
        header = jwt.get_unverified_header(assertion)
        alg = header.get("alg")
        kid = header.get("kid")

        if alg not in client.allowed_algs:
            raise ValueError(f"unsupported alg: {alg}")
        if not kid:
            raise ValueError("missing kid")
        if kid not in client.jwks:
            raise ValueError(f"unknown kid: {kid}")

        public_key = jwt.algorithms.RSAAlgorithm.from_jwk(
            json.dumps(client.jwks[kid])
        )

        claims = jwt.decode(
            assertion,
            public_key,
            algorithms=[alg],
            audience=client.token_endpoint,
            issuer=client.client_id,
            options={
                "require": ["iss", "sub", "aud", "exp", "iat", "jti"],
            },
            leeway=30,
        )

        if claims["sub"] != client.client_id:
            raise ValueError("sub must equal client_id")

        if claims["jti"] in self.used_jti:
            raise ValueError("replayed client assertion")
        self.used_jti.add(claims["jti"])

        return claims


def main():
    client_id = "orders-service"
    token_endpoint = "https://auth.example.com/oauth2/token"
    kid = "orders-2026-07"

    private_key, private_pem = generate_rsa_key_pair()
    jwk = public_jwk(private_key, kid)

    registered_client = RegisteredClient(
        client_id=client_id,
        token_endpoint=token_endpoint,
        jwks={kid: jwk},
    )

    assertion = create_client_assertion(
        client_id=client_id,
        token_endpoint=token_endpoint,
        private_pem=private_pem,
        kid=kid,
    )

    verifier = AuthorizationServerVerifier()
    claims = verifier.verify_private_key_jwt(
        client=registered_client,
        assertion=assertion,
    )

    print("verified client assertion")
    print(json.dumps(claims, indent=2))

    token_request_form = {
        "grant_type": "client_credentials",
        "scope": "payments.read",
        "client_id": client_id,
        "client_assertion_type": CLIENT_ASSERTION_TYPE,
        "client_assertion": assertion,
    }
    print()
    print("form fields for the token endpoint:")
    for key, value in token_request_form.items():
        display = value if key != "client_assertion" else value[:80] + "..."
        print(f"{key}={display}")

    try:
        verifier.verify_private_key_jwt(
            client=registered_client,
            assertion=assertion,
        )
    except ValueError as exc:
        print()
        print(f"replay rejected: {exc}")


if __name__ == "__main__":
    main()</code></pre>

      <h3>Run It</h3>

      <pre><code>python private_key_jwt_demo.py</code></pre>

      <p>You should see the decoded claims, the token endpoint form fields, and a replay rejection for the second verification attempt. In a real client, the client sends the form fields to the authorization server over HTTPS. In a real authorization server, the verifier loads the registered public key from client metadata, a database, or a trusted <code>jwks_uri</code>.</p>

      <h2>How to Send the Assertion to a Real Token Endpoint</h2>

      <p>If you already have a provider that supports <code>private_key_jwt</code>, the client code changes only at the final step. Instead of verifying locally, create the assertion and POST it:</p>

      <pre><code>import requests

response = requests.post(
    "https://auth.example.com/oauth2/token",
    data={
        "grant_type": "client_credentials",
        "scope": "payments.read",
        "client_id": "orders-service",
        "client_assertion_type": CLIENT_ASSERTION_TYPE,
        "client_assertion": assertion,
    },
    timeout=10,
)
response.raise_for_status()
tokens = response.json()
print(tokens["access_token"])</code></pre>

      <p>Do not log the assertion or access token. The assertion is short-lived, but it is still a bearer artifact during its lifetime.</p>

      <h2>Registering the Public Key</h2>

      <p>The authorization server needs a trusted public key for the client. There are two common registration patterns:</p>

      <ul>
        <li><strong>Static JWKS:</strong> upload the public JWK during client registration. This is simple for a small number of clients.</li>
        <li><strong><code>jwks_uri</code>:</strong> register an HTTPS URL where the authorization server can fetch the client's JWKS. This is better for larger systems and key rotation, but it requires strict HTTPS, hostname validation, caching, and SSRF protections.</li>
      </ul>

      <p>A public JWKS for the demo key looks like this:</p>

      <pre><code>{
  "keys": [
    {
      "kty": "RSA",
      "kid": "orders-2026-07",
      "use": "sig",
      "alg": "RS256",
      "n": "base64url-modulus",
      "e": "AQAB"
    }
  ]
}</code></pre>

      <p>Only publish public key material. Never publish a private JWK that contains fields such as <code>d</code>, <code>p</code>, <code>q</code>, <code>dp</code>, <code>dq</code>, or <code>qi</code>.</p>

      <h2>Key Rotation Strategy</h2>

      <p>Key rotation works cleanly when every key has a stable <code>kid</code> and the server can accept more than one valid public key during the transition.</p>

      <ol>
        <li><strong>Create a new key pair.</strong> Keep the old private key active.</li>
        <li><strong>Publish the new public key.</strong> Add it to JWKS with a new <code>kid</code>.</li>
        <li><strong>Wait for caches.</strong> Give authorization servers enough time to refresh JWKS.</li>
        <li><strong>Start signing with the new key.</strong> The JWT header now uses the new <code>kid</code>.</li>
        <li><strong>Remove the old key after its last possible assertion expires.</strong> Include cache TTL and clock skew in the wait time.</li>
      </ol>

      <aside class="callout callout-production">
        <strong>Production habit:</strong> make rotation a rehearsed operation. If the first key rotation happens during an incident, you will discover cache behavior, missing <code>kid</code> values, and deployment coupling at the worst possible time.
      </aside>

      <h2>Verifier Rules for Authorization Servers</h2>

      <p>If you implement the authorization server side, the verifier should fail closed and be boring. The checks are not optional polish; they are the security boundary.</p>

      <ul>
        <li><strong>Read <code>client_id</code> from the request or derive it from the assertion only after verification policy is clear.</strong> Do not let an untrusted token choose arbitrary client metadata without bounds.</li>
        <li><strong>Require a registered authentication method.</strong> The client must be configured for <code>private_key_jwt</code>.</li>
        <li><strong>Allowlist algorithms per client.</strong> Do not choose verification behavior solely from the JWT header.</li>
        <li><strong>Select only registered keys.</strong> Match <code>kid</code> to a public key registered for that client.</li>
        <li><strong>Require <code>iss</code> and <code>sub</code>.</strong> For client authentication, both should identify the OAuth client.</li>
        <li><strong>Require exact <code>aud</code>.</strong> Prefer the token endpoint URL or the exact issuer value your server documents.</li>
        <li><strong>Require short <code>exp</code>.</strong> Reject expired assertions and assertions too far in the future.</li>
        <li><strong>Check <code>iat</code>.</strong> Reject assertions that are too old or too far ahead of server time.</li>
        <li><strong>Replay-check <code>jti</code>.</strong> Store the value until expiration and reject repeats.</li>
        <li><strong>Return <code>invalid_client</code> safely.</strong> Give enough detail in internal logs, but avoid leaking key lookup and policy internals to callers.</li>
      </ul>

      <h2>Common Failure Modes</h2>

      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Symptom</th>
              <th>Likely cause</th>
              <th>Fix</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>invalid_client</code> with no detail</td>
              <td>Wrong signing key, wrong client method, missing <code>kid</code>, or issuer mismatch.</td>
              <td>Compare the registered client metadata with the assertion header and claims.</td>
            </tr>
            <tr>
              <td>Audience validation failed</td>
              <td><code>aud</code> is issuer URL but provider expects token endpoint URL, or the reverse.</td>
              <td>Use the exact value documented by your authorization server.</td>
            </tr>
            <tr>
              <td>Works once, then fails</td>
              <td>The same assertion is being reused and replay protection is active.</td>
              <td>Create a fresh assertion with a new <code>jti</code> for every request.</td>
            </tr>
            <tr>
              <td>Fails during rotation</td>
              <td>New <code>kid</code> not published, JWKS cache has not refreshed, or old key removed too early.</td>
              <td>Overlap old and new keys, respect JWKS cache TTL, and publish before signing.</td>
            </tr>
            <tr>
              <td>Clock-related failures</td>
              <td>Client and server clocks drifted or the assertion lifetime is too tight.</td>
              <td>Use NTP, allow small skew, and keep lifetime short but practical.</td>
            </tr>
            <tr>
              <td>Algorithm errors</td>
              <td>The client signs with an unsupported algorithm.</td>
              <td>Read authorization server metadata and configure one allowed algorithm explicitly.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Security Checklist</h2>

      <ul>
        <li>Use a hardware-backed key store or managed KMS/HSM when the client is high value.</li>
        <li>Never commit private keys, private JWKs, generated assertions, or access tokens.</li>
        <li>Use one client and key set per environment. Do not share production client keys with staging.</li>
        <li>Keep assertion lifetimes short and require a unique <code>jti</code>.</li>
        <li>Pin acceptable algorithms. Avoid algorithm agility unless it is explicitly configured.</li>
        <li>Use separate keys for signing client assertions and other JWT types.</li>
        <li>Log <code>client_id</code>, <code>kid</code>, <code>jti</code>, decision, grant type, and correlation ID. Do not log full JWTs.</li>
        <li>Alert on sudden <code>invalid_client</code> spikes, unknown <code>kid</code> values, replay attempts, and token requests outside normal regions or networks.</li>
        <li>Protect <code>jwks_uri</code> fetching from SSRF. Fetch only registered HTTPS URLs and never follow them to internal metadata services.</li>
        <li>Document break-glass rotation: who can disable a key, add a new key, and revoke old tokens.</li>
      </ul>

      <h2>When to Choose Private Key JWT</h2>

      <p>Use <code>private_key_jwt</code> when the client is a confidential server-side application, the authorization server supports it, and you want to avoid long-lived shared client secrets. It fits partner APIs, SaaS enterprise integrations, platform services, background jobs, and backend services that already have a secure place for private keys.</p>

      <p>Use <strong>mTLS</strong> when you need certificate-based client authentication at the transport layer or certificate-bound tokens. Use <strong>OIDC workload federation</strong> when the runtime platform can prove workload identity and you want to remove manually managed keys from CI, Kubernetes, or cloud workloads. Use a <strong>client secret</strong> only when the risk is acceptable and rotation is simple.</p>

      <h2>Related CodersSecret Guides</h2>

      <ul>
        <li><a href="/blog/oauth2-openid-connect-developer-guide">OAuth 2.0 and OpenID Connect: A Developer Guide</a></li>
        <li><a href="/blog/oidc-workload-federation-secretless-service-access">OIDC Workload Federation: Build Secretless Service Access</a></li>
        <li><a href="/blog/m2m-authentication-service-to-service">M2M Authentication: Securing Service-to-Service Communication</a></li>
        <li><a href="/blog/mcp-security-production-ai-agents-oauth-gateways">MCP Security for Production AI Agents</a></li>
        <li><a href="/blog/api-security-attacks-defense-guide">API Security Attacks and Defense Guide</a></li>
        <li><a href="/courses/centralized-authentication-authorization-envoy">Centralized Authentication and Authorization with Envoy</a></li>
      </ul>

      <h2>Sources and Further Reading</h2>

      <ul>
        <li><a href="https://datatracker.ietf.org/doc/html/rfc7523">RFC 7523: JSON Web Token Profile for OAuth 2.0 Client Authentication and Authorization Grants</a></li>
        <li><a href="https://openid.net/specs/openid-connect-core-1_0.html#ClientAuthentication">OpenID Connect Core 1.0: Client Authentication</a></li>
        <li><a href="https://datatracker.ietf.org/doc/html/rfc8414">RFC 8414: OAuth 2.0 Authorization Server Metadata</a></li>
        <li><a href="https://datatracker.ietf.org/doc/html/rfc7515">RFC 7515: JSON Web Signature</a></li>
        <li><a href="https://datatracker.ietf.org/doc/html/rfc7517">RFC 7517: JSON Web Key</a></li>
        <li><a href="https://datatracker.ietf.org/doc/html/rfc8725">RFC 8725: JSON Web Token Best Current Practices</a></li>
        <li><a href="https://datatracker.ietf.org/doc/html/rfc8705">RFC 8705: OAuth 2.0 Mutual-TLS Client Authentication and Certificate-Bound Access Tokens</a></li>
      </ul>
`;
