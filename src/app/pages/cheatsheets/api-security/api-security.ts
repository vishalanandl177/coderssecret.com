import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../../services/seo.service';
import { CheatsheetPageComponent, CheatsheetHeader, CommandGroup, MisconfigPair, RelatedLink } from '../_shared/cheatsheet-page';

@Component({
  selector: 'app-cheatsheet-api-security',
  imports: [RouterLink, CheatsheetPageComponent],
  template: `
    <section class="py-12 md:py-16 animate-in fade-in duration-500">
      <div class="container max-w-5xl mx-auto px-6">
        <nav aria-label="Breadcrumb" class="mb-6">
          <ol class="flex items-center gap-1.5 text-sm text-muted-foreground">
            <li><a routerLink="/" class="hover:text-foreground transition-colors">Home</a></li>
            <li class="text-muted-foreground/50">/</li>
            <li><a routerLink="/cheatsheets" class="hover:text-foreground transition-colors">Reference</a></li>
            <li class="text-muted-foreground/50">/</li>
            <li class="text-foreground font-medium" aria-current="page">API Security</li>
          </ol>
        </nav>

        <app-cheatsheet-page [header]="header" [groups]="groups" [misconfigPairs]="misconfigs" [relatedLinks]="related" />
      </div>
    </section>
  `,
})
export class ApiSecurityCheatsheetComponent {
  private seo = inject(SeoService);

  header: CheatsheetHeader = {
    icon: '🔑',
    iconColor: '#ef4444',
    badge: 'Production Reference',
    badgeClass: 'bg-red-500/10 border-red-500/30 text-red-500',
    title: 'API Security Cheatsheet',
    intro: 'Operational reference for securing HTTP APIs in production. JWT verification patterns, OAuth2 flows, secure HTTP headers, mTLS, webhook signing, and rate-limiting that holds up against the OWASP API Top 10.',
  };

  groups: CommandGroup[] = [
    {
      title: 'JWT verification (the only correct way)',
      rows: [
        { cmd: 'jwt.verify(token, key, { algorithms: ["RS256"] })', desc: 'Always pin algorithms in an allowlist. Without it, libraries trust the alg in the token header — a known attack vector.', warning: 'Without algorithms allowlist, an attacker can swap RS256 → HS256 with the public key as HMAC secret and forge tokens.' },
        { cmd: 'jwt.verify(token, key, { issuer, audience, clockTolerance: 5 })', desc: 'Validate iss, aud, and clock skew. clockTolerance handles cross-machine drift.', prodNote: 'Always validate aud — a token minted for service A must not be accepted by service B. iss anchors which IdP issued the token.' },
        { cmd: 'JWKS rotation: cache JWKS for 1h, force refresh on kid miss', desc: 'When a kid (key ID) in a JWT header isn\'t in your cache, refresh JWKS once before failing.', prodNote: 'Use libraries with JWKS support (jose, PyJWT 2.x, Auth0\'s jwks-rsa). Manual cache management is a footgun.' },
        { cmd: 'Token revocation: short TTLs + denylist for emergency revoke', desc: 'JWT cannot be revoked once issued. Mitigate with short TTLs (5-15 min access tokens) and refresh tokens.', warning: 'Long-lived JWTs (>1 hour) without refresh flow are an outage waiting to happen — once leaked, they\'re valid until expiry.' },
      ],
    },
    {
      title: 'OAuth2 / OIDC patterns',
      rows: [
        { cmd: 'response_type=code & PKCE (S256)', desc: 'Authorization Code flow with PKCE. The default for SPAs and mobile apps. PKCE prevents authz code interception.', prodNote: 'PKCE is now recommended for confidential clients too (OAuth 2.1 draft). No reason to skip it.' },
        { cmd: 'redirect_uri: exact-match against allowlist', desc: 'Never use prefix or substring matching on redirect_uri. Parse the URI and compare host:port:path exactly.', warning: 'startsWith("https://app.example.com") matches "https://app.example.com.attacker.com" — leak the auth code to the attacker.' },
        { cmd: 'state parameter: random per-request, validated on callback', desc: 'CSRF protection for the auth flow. Tie state to the user\'s session.', prodNote: 'Use a HMAC-signed state with timestamp so you can verify "this state was issued by us, recently".' },
        { cmd: 'refresh_token: rotate on use, detect reuse', desc: 'Issue a new refresh token on each refresh; revoke the entire refresh chain if an old one is reused.', prodNote: 'Refresh-token reuse detection catches stolen refresh tokens — both attacker and legit user end up logged out, but the attacker can no longer mint access tokens.' },
        { cmd: 'OIDC: validate id_token signature + claims (sub, aud, iss, exp, iat, nonce)', desc: 'OIDC id_tokens carry user identity. Validate every claim — exp prevents replay, nonce binds to the auth request.', warning: 'Skipping nonce validation enables a token-substitution attack across sessions.' },
      ],
    },
    {
      title: 'Security headers (every response)',
      rows: [
        { cmd: 'Strict-Transport-Security: max-age=31536000; includeSubDomains; preload', desc: 'Force HTTPS for 1 year, including subdomains. Preload submits to browser HSTS lists.', warning: 'HSTS is sticky. Test on a subdomain before enabling site-wide; rolling back requires every visiting browser to expire the policy.' },
        { cmd: 'Content-Security-Policy: default-src \'self\'; script-src \'self\' \'sha256-...\'', desc: 'Restrict where scripts/styles/images can come from. Use script hashes or nonces, never \'unsafe-inline\' or *.', prodNote: 'Roll out with Content-Security-Policy-Report-Only first to capture violations without blocking; promote once clean.' },
        { cmd: 'X-Frame-Options: DENY  (or  CSP frame-ancestors \'none\')', desc: 'Prevent clickjacking via iframe embedding. CSP frame-ancestors supersedes XFO in modern browsers.', prodNote: 'Send both for maximum compatibility — older browsers ignore frame-ancestors.' },
        { cmd: 'X-Content-Type-Options: nosniff', desc: 'Prevent browsers from MIME-sniffing responses. Mitigates a class of polyglot file attacks.', prodNote: 'Pair with explicit Content-Type on every response. Static-asset pipelines should set both.' },
        { cmd: 'Referrer-Policy: strict-origin-when-cross-origin', desc: 'Limit Referer header to origin (no path) when navigating cross-origin. Default in modern browsers — set explicitly anyway.', prodNote: 'Aggressive policies (no-referrer) can break analytics; strict-origin-when-cross-origin is the production sweet spot.' },
        { cmd: 'Permissions-Policy: camera=(), geolocation=(), microphone=()', desc: 'Disable powerful browser APIs your app doesn\'t use. Limits the blast radius of XSS.', prodNote: 'Audit which features your app actually uses. Most APIs need none of these — disable them all.' },
      ],
    },
    {
      title: 'CORS (the rules that matter)',
      rows: [
        { cmd: 'Access-Control-Allow-Origin: <exact origin>  (echoed from request)', desc: 'For credentialed requests, echo back the request Origin only if it\'s in your allowlist. Add Vary: Origin so caches don\'t mix responses.', warning: 'Browsers reject Access-Control-Allow-Origin: * combined with Allow-Credentials: true. Use exact origins.' },
        { cmd: 'Access-Control-Allow-Methods: GET, POST, PUT, DELETE', desc: 'Methods your endpoint supports. Don\'t list methods you don\'t implement.', prodNote: 'Wildcard methods are NOT a thing in CORS — list each one explicitly.' },
        { cmd: 'Access-Control-Allow-Headers: Authorization, Content-Type', desc: 'Headers the browser may send on cross-origin requests. List only what your API needs.', prodNote: 'Authorization typically needs to be allowed for token-based APIs; never wildcard headers.' },
        { cmd: 'Access-Control-Max-Age: 600', desc: 'Cache preflight for 10 minutes. Reduces preflight overhead for chatty APIs.', warning: 'Browsers cap this (Chrome 2 hours, Firefox 24 hours). Don\'t set huge values expecting them to be honored.' },
      ],
    },
    {
      title: 'mTLS for service-to-service',
      rows: [
        { cmd: 'tls.Config{ Certificates, ClientCAs, ClientAuth: tls.RequireAndVerifyClientCert }', desc: 'Server config that requires client certs and validates against ClientCAs.', prodNote: 'Authorize the peer\'s identity (SPIFFE ID, CN, or SAN) after the handshake — "valid cert from our CA" is not authorization.' },
        { cmd: 'tlsconfig.MTLSServerConfig(source, source, authorizer)  // go-spiffe', desc: 'go-spiffe SDK builds an mTLS config that reads SVIDs from the live source. Auto-rotation, no app code.', prodNote: 'Always use the SDK\'s tlsconfig helpers — manual GetX509SVID() captures a snapshot and breaks rotation.' },
        { cmd: 'Authorization: spiffe://corp.example.com/ns/X/sa/Y allow if peer.path startswith "/ns/X/"', desc: 'Authorize peers by SPIFFE ID prefix, not "any cert from our CA". Push the policy into OPA/Rego for clarity.', warning: 'Substring matching on SPIFFE IDs is bypassable. Always parse the URI and compare exact trust domain + path prefix.' },
      ],
    },
    {
      title: 'Webhooks (signed by sender)',
      rows: [
        { cmd: 'X-Hub-Signature-256: sha256=<HMAC>', desc: 'GitHub-style webhook signature header. HMAC-SHA256 over the raw request body, with a shared secret.', prodNote: 'Always verify against the *raw* body — JSON parsing changes whitespace and breaks the signature.' },
        { cmd: 'crypto.timingSafeEqual(received, expected)', desc: 'Constant-time signature comparison. Prevents a timing side-channel that leaks the signature byte-by-byte.', warning: 'Plain == on strings short-circuits; an attacker can measure response time to forge signatures.' },
        { cmd: 'X-Webhook-Timestamp + tolerance window (300s)', desc: 'Reject requests outside a small time window to prevent replay. Stripe uses ±5 minutes.', prodNote: 'Sign the timestamp into the HMAC so an attacker can\'t adjust it.' },
        { cmd: 'Idempotency: dedupe by signed event ID', desc: 'The same event may be delivered multiple times. Dedupe on a unique ID provided by the sender.', warning: 'Without dedupe, double-charges and double-side-effects are inevitable on networks with retries.' },
      ],
    },
    {
      title: 'Rate limiting (that survives spoofed headers)',
      rows: [
        { cmd: 'Trusted edge: strip incoming X-Forwarded-For; emit a sealed header', desc: 'Configure your CDN/ingress to strip client-supplied X-Forwarded-For and emit a fresh, trusted header.', warning: 'Trusting client X-Forwarded-For lets attackers cycle the value to get a fresh rate-limit bucket per request.' },
        { cmd: 'Per-token + per-IP buckets, separately', desc: 'Apply both — per-token catches authenticated abuse, per-IP catches unauthenticated abuse from a botnet.', prodNote: 'Token-based limits should be more generous than anonymous limits. Tie limits to billing tier where applicable.' },
        { cmd: 'Backend: 429 + Retry-After header', desc: 'When limited, return 429 with Retry-After so well-behaved clients back off.', prodNote: 'Add a Retry-After-Reset header with the absolute reset time for client UX. Echo back rate-limit headers (X-RateLimit-Limit/Remaining/Reset).' },
      ],
    },
  ];

  misconfigs: MisconfigPair[] = [
    {
      bad: `// Verify a JWT
const decoded = jwt.verify(token, getKey());`,
      good: `// Verify a JWT (correct)
const decoded = jwt.verify(token, getKey(), {
  algorithms: ['RS256'],
  issuer: 'https://auth.example.com',
  audience: 'https://api.example.com',
  clockTolerance: 5,
});`,
      why: 'Without algorithms, the library trusts the token\'s alg header — letting an attacker forge tokens by switching to HS256 with the public key as HMAC secret. Without iss/aud, a token minted by a different IdP or for a different service may be accepted.',
    },
    {
      bad: `// Webhook signature check
function verify(sig, expected) {
  return sig === expected;
}`,
      good: `// Webhook signature check (constant-time)
function verify(sig, expected) {
  const a = Buffer.from(sig, 'hex');
  const b = Buffer.from(expected, 'hex');
  return a.length === b.length &&
    crypto.timingSafeEqual(a, b);
}`,
      why: 'String == short-circuits at the first mismatched byte; an attacker can measure response time to discover the signature byte by byte. timingSafeEqual compares in constant time. The provider docs (Stripe, GitHub) explicitly recommend this.',
    },
    {
      bad: `app.use(cors({
  origin: '*',
  credentials: true,
}));`,
      good: `const allowedOrigins = ['https://app.example.com', 'https://admin.example.com'];
app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) cb(null, true);
    else cb(new Error('CORS blocked'));
  },
  credentials: true,
}));`,
      why: 'Browsers reject the * + credentials combination outright. Even if they didn\'t, every site could read authenticated user data via cross-origin fetch. Echo back specific allowed origins; combine with Vary: Origin so caches don\'t leak responses.',
    },
  ];

  related: RelatedLink[] = [
    { label: 'API Attack & Defense simulator', href: '/games/api-attack-defense', description: 'Six API security scenarios — JWT, OAuth, mass assignment, CORS, webhooks, rate limiting.' },
    { label: 'Cloud Native Security Engineering', href: '/courses/cloud-native-security-engineering', description: 'Free 16-module course covering API + machine identity end-to-end.' },
    { label: 'Secure Service-to-Service Communication', href: '/courses/secure-service-to-service-communication', description: 'Replace shared API keys with workload-identity-based auth.' },
  ];

  constructor() {
    this.seo.update({
      title: 'API Security Cheatsheet',
      description: 'Production reference for securing HTTP APIs: JWT verification, OAuth2/OIDC flows, security headers (HSTS/CSP/XFO), CORS rules, mTLS, webhook signature verification, and rate limiting. Free, ad-free.',
      url: '/cheatsheets/api-security',
      breadcrumbs: [
        { name: 'Home', url: '/' },
        { name: 'Reference', url: '/cheatsheets' },
        { name: 'API Security', url: '/cheatsheets/api-security' },
      ],
    });
  }
}
