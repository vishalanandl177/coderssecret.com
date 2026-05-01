import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../../services/seo.service';
import { ScenarioQuizComponent, Scenario, QuizTheme, QuizIntro, QuizResults, QuizCallToActions } from '../_shared/scenario-quiz';

@Component({
  selector: 'app-api-attack-defense',
  imports: [RouterLink, ScenarioQuizComponent],
  template: `
    <section class="py-12 md:py-16 animate-in fade-in duration-500">
      <div class="container max-w-4xl mx-auto px-6">
        <nav aria-label="Breadcrumb" class="mb-6">
          <ol class="flex items-center gap-1.5 text-sm text-muted-foreground">
            <li><a routerLink="/" class="hover:text-foreground transition-colors">Home</a></li>
            <li class="text-muted-foreground/50">/</li>
            <li><a routerLink="/games" class="hover:text-foreground transition-colors">Security Simulators</a></li>
            <li class="text-muted-foreground/50">/</li>
            <li class="text-foreground font-medium" aria-current="page">API Attack &amp; Defense</li>
          </ol>
        </nav>

        <app-scenario-quiz [scenarios]="scenarios" [theme]="theme" [intro]="intro" [results]="results" [callToActions]="callToActions" />
      </div>
    </section>
  `,
})
export class ApiAttackDefenseComponent {
  private seo = inject(SeoService);

  theme: QuizTheme = {
    badgePill: 'bg-red-500/10 border-red-500/30 text-red-500',
    accentText: 'text-red-500',
    titleGradient: 'from-red-500 via-rose-500 to-pink-500',
    numberCircle: 'bg-red-500/15 text-red-500',
    startButton: 'bg-red-500 hover:bg-red-400 shadow-red-500/30',
    topicPill: 'bg-red-500/15 text-red-500',
    callout: 'border-red-500/30 bg-red-500/5',
    calloutTitle: 'text-red-500',
    resultsBg: 'from-red-500/10 via-card to-rose-500/10',
  };

  intro: QuizIntro = {
    badge: 'API Security Lab',
    titlePlain: 'API',
    titleGradient: 'Attack & Defense',
    description: 'Find the vulnerable endpoint before the attacker does. Each scenario drops you into a real API authentication or authorization flaw — JWT verification, OAuth flows, mass assignment, CORS — and asks you to spot the bug a code review missed.',
    steps: [
      'Each scenario shows real API code or middleware configuration with a hidden authentication or authorization flaw.',
      'Identify the issue from four plausible options — the wrong answers explain why they look tempting but aren\'t the bug.',
      'Read the production explanation, follow the link to the relevant lesson, and move to the next scenario.',
      'Score yourself across all six rounds — covering JWT verification, OAuth flows, mass assignment, rate limiting, CORS, and webhook signature verification.',
    ],
    practiceTitle: `What You'll Practice`,
    practiceDescription: 'The simulator covers the API security disciplines that show up in every OWASP API Top 10 list. Each scenario maps to a real CVE class or a real production breach.',
    practiceConcepts: [
      { name: 'JWT', description: 'Algorithm confusion & verification bypass' },
      { name: 'OAuth', description: 'redirect_uri & token leakage' },
      { name: 'Auth Flaws', description: 'Mass assignment & broken access' },
      { name: 'Rate Limiting', description: 'Abuse & header spoofing' },
      { name: 'CORS', description: 'Wildcard with credentials' },
      { name: 'Webhooks', description: 'Signature verification timing' },
    ],
    deeperLine: 'Want to go deeper after the simulation? Read the ',
    deeperLinks: [
      { label: 'Cloud Native Security Engineering', href: '/courses/cloud-native-security-engineering' },
      { label: 'Secure Service-to-Service Communication', href: '/courses/secure-service-to-service-communication' },
    ],
    timeMinutes: 12,
    difficulty: 'Hard',
  };

  results: QuizResults = {
    perfect: { headline: 'API surface secured. Flawless run.', emoji: '\u{1F947}', message: 'You spotted every API vulnerability. The full Cloud Native Security Engineering course goes deeper into machine identity, mTLS-based service auth, and policy enforcement.' },
    great: { headline: 'You read APIs like an attacker.', emoji: '\u{1F6E1}\u{FE0F}', message: 'Strong instincts. Brush up on the few you missed and explore how SPIFFE-based machine identity replaces the entire shared-secret category of these bugs.' },
    good: { headline: 'Solid foundation — refine the rough edges.', emoji: '\u{1F4DA}', message: 'You know the patterns. The structured curriculum walks through each of these flaws with the labs to deploy the fixes.' },
    weak: { headline: 'Time to dig into API security fundamentals.', emoji: '\u{1F50D}', message: 'These are the OWASP API Top 10 in disguise. Start with the API security and machine-identity modules in the Cloud Native Security Engineering course, then run this again.' },
  };

  callToActions: QuizCallToActions = {
    primary: { label: 'Take the full course', href: '/courses/cloud-native-security-engineering' },
  };

  scenarios: Scenario[] = [
    {
      id: 'jwt-alg-confusion',
      topic: 'JWT',
      title: 'A "minor" JWT verification helper',
      briefing: 'A backend service verifies JWTs from upstream auth. The team is using a popular JWT library; the verification helper looks like the one below.',
      yaml: `// Node.js (jsonwebtoken)
import jwt from 'jsonwebtoken';

export function verifyToken(token: string) {
  return jwt.verify(token, getPublicKey());
}

// Token issuer signs with RS256:
//   { "alg": "RS256", "typ": "JWT" }`,
      question: 'What is the security issue?',
      choices: [
        {
          label: 'The function is missing a try/catch — a malformed JWT will crash the process.',
          correct: false,
          feedback: 'A crash is an availability issue, not the security issue here. The library throws on verify failure, which is fine to handle at a higher level.',
        },
        {
          label: 'verify() does not pin the algorithm. An attacker can present a token with alg: HS256 and the public key as the secret — the library will accept the public-key-as-HMAC-key forgery.',
          correct: true,
          feedback: 'Correct. The classic JWT algorithm confusion attack. Always pass `algorithms: ["RS256"]` (or the specific algorithms you accept) to verify(). Without that, the library trusts the alg in the token header — and an attacker can sign with HS256 using your public key as the HMAC secret.',
        },
        {
          label: 'getPublicKey() should be cached for performance.',
          correct: false,
          feedback: 'Caching is good practice but not the security issue.',
        },
        {
          label: 'JWT is deprecated; you should be using PASETO.',
          correct: false,
          feedback: 'JWT is widely deployed; the practical issue is using it correctly, not switching libraries.',
        },
      ],
      explanation: 'Algorithm confusion remains one of the most common JWT vulnerabilities (CVE-2015-9235 and many descendants). The fix is universal: always pass an explicit `algorithms` allowlist on verify. Even better, prefer libraries that require it (jose, PyJWT >= 2). For service-to-service authentication, replace JWT-with-shared-key entirely with SPIFFE workload identity — a much stronger model.',
      learnMore: { label: 'Replace JWT with workload identity', href: '/courses/mastering-spiffe-spire/spiffe-fundamentals' },
    },
    {
      id: 'oauth-redirect-uri',
      topic: 'OAuth',
      title: 'redirect_uri validation in an OAuth callback',
      briefing: 'You implement OAuth in your customer-facing app. The login flow accepts a redirect_uri from the client. The validator looks like this:',
      yaml: `// In the OAuth callback handler:
function isAllowedRedirect(uri: string): boolean {
  const allowed = [
    'https://app.example.com',
    'https://staging.example.com',
  ];
  return allowed.some(prefix => uri.startsWith(prefix));
}`,
      question: 'How does an attacker bypass this validator?',
      choices: [
        {
          label: 'They register a domain like https://app.example.com.attacker.com — startsWith() matches because the allowed prefix is at the start of the attacker domain.',
          correct: true,
          feedback: 'Correct. startsWith on the full URL is the wrong primitive. https://app.example.com.attacker.com starts with https://app.example.com — the validator says yes, the OAuth code is sent to attacker.com. Always parse the URI and compare host / origin exactly, not as a string prefix.',
        },
        {
          label: 'They URL-encode the redirect_uri — the validator is case-sensitive and misses the encoding.',
          correct: false,
          feedback: 'URL encoding is decoded by the framework before the validator sees it; it is not the bypass.',
        },
        {
          label: 'They use http:// instead of https:// — the validator only checks the path.',
          correct: false,
          feedback: 'The validator does check the scheme (https://) as part of the prefix. The bypass is in the host suffix.',
        },
        {
          label: 'They register a redirect_uri with a fragment (#) — fragments are stripped before comparison.',
          correct: false,
          feedback: 'OAuth redirects include the path and query, not fragments. Fragment manipulation is not the bypass here.',
        },
      ],
      explanation: 'Open redirects in OAuth are catastrophic — they leak authorization codes that exchange for tokens. The fix: parse the URI with the platform\'s URL parser, compare the host (and optionally port + scheme) exactly against an allowlist of registered redirect URIs. RFC 6749 actually requires exact matching of redirect_uri; many implementations relax it for "convenience" and ship vulnerabilities. Always exact-match.',
      learnMore: { label: 'Authentication & authorization deep dive', href: '/courses/cloud-native-security-engineering/kubernetes-authentication-authorization' },
    },
    {
      id: 'mass-assignment',
      topic: 'Auth Flaws',
      title: 'A user-profile update endpoint',
      briefing: 'You build a PATCH /api/users/me endpoint that accepts a JSON body and updates the authenticated user\'s profile.',
      yaml: `// Express + Mongoose
app.patch('/api/users/me', requireAuth, async (req, res) => {
  const updated = await User.findByIdAndUpdate(
    req.user.id,
    req.body,
    { new: true }
  );
  res.json(updated);
});

// Client sends:
//   PATCH /api/users/me
//   { "displayName": "Alice", "role": "admin" }`,
      question: 'What\'s the vulnerability?',
      choices: [
        {
          label: 'Mongoose is deprecated; use Prisma.',
          correct: false,
          feedback: 'ORM choice is unrelated. The bug is the same in any ORM that accepts the request body wholesale.',
        },
        {
          label: 'The endpoint does not enforce a Content-Type check; the request can be tunneled through a form.',
          correct: false,
          feedback: 'Content-Type is a hardening detail, not the primary vulnerability.',
        },
        {
          label: 'Spreading req.body into the update lets the client set any field — including role, isVerified, billingTier, or balance — turning an "edit my profile" endpoint into a privilege escalation.',
          correct: true,
          feedback: 'Correct. Mass assignment / overposting. Always allowlist the fields a request can update: pick { displayName, avatar, bio } from the body explicitly. ORMs that have "schema" fields aren\'t protection — Mongoose schemas don\'t restrict which fields are mass-assignable.',
        },
        {
          label: 'findByIdAndUpdate is async but the response is sync — race condition.',
          correct: false,
          feedback: 'The function is properly awaited. No race here.',
        },
      ],
      explanation: 'Mass assignment is OWASP API Top 10 #6 (API6:2023). The fix is allowlist, not denylist: explicitly extract the fields the endpoint should accept and ignore everything else. Tools like Zod (for TypeScript) or Pydantic (for Python) make this idiomatic — define a schema for "what the API accepts," parse the body, then update.',
      learnMore: { label: 'Cloud Native Security Engineering', href: '/courses/cloud-native-security-engineering' },
    },
    {
      id: 'rate-limit-bypass',
      topic: 'Rate Limiting',
      title: 'Rate limiting by client IP',
      briefing: 'Your API gateway is deployed behind a CDN and a load balancer. The rate limiter looks at the client IP from the request:',
      yaml: `// Gateway middleware
const limiter = rateLimit({
  windowMs: 60_000,    // 1 minute
  max: 100,            // 100 requests per minute
  keyGenerator: (req) => {
    return req.headers['x-forwarded-for']
      || req.socket.remoteAddress;
  }
});`,
      question: 'How does an attacker bypass this limiter?',
      choices: [
        {
          label: 'They add multiple IPs in X-Forwarded-For — keyGenerator gets a different string per request, defeating the per-IP bucket.',
          correct: true,
          feedback: 'Correct. X-Forwarded-For is client-controlled. The attacker sends "X-Forwarded-For: 1.1.1.1, 2.2.2.2" then varies the values — each request gets a fresh rate-limit bucket. The fix: trust X-Forwarded-For only when the request comes from a known, trusted proxy, and pull the *first* IP from a controlled-position parser (or use the Forwarded RFC 7239 header your edge sets).',
        },
        {
          label: 'They use HTTP/2 multiplexing to send 1000 requests in a single TCP connection — the limiter only counts connections.',
          correct: false,
          feedback: 'rateLimit middleware counts requests, not connections. Multiplexing doesn\'t bypass per-request counting.',
        },
        {
          label: 'They send requests with no Host header — keyGenerator returns undefined and the request is exempted.',
          correct: false,
          feedback: 'Host header is unrelated to the keyGenerator here. Modern servers reject requests with no Host.',
        },
        {
          label: 'They use a CDN cache to serve cached responses — the limiter never sees the requests.',
          correct: false,
          feedback: 'The CDN may cache, but for unauthenticated abuse the attacker controls path/query to bust cache. The limiter still sees the requests on cache miss.',
        },
      ],
      explanation: 'Trusting any client-supplied header for security decisions is unsafe. For rate limiting and IP-based access controls, configure your edge (CDN, ingress, ALB) to strip incoming X-Forwarded-For and set a *new* trusted header. Then your application reads only that trusted header, knowing only your edge can write it. Tools like Cloudflare Workers, AWS WAF, and Envoy support this pattern natively.',
      learnMore: { label: 'API gateway hardening', href: '/courses/cloud-native-security-engineering/service-mesh-security' },
    },
    {
      id: 'cors-credentials',
      topic: 'CORS',
      title: 'A CORS configuration with "credentials"',
      briefing: 'A frontend team complains they can\'t send cookies with their fetch() calls to the API. The team lead adds the following CORS configuration to fix it:',
      yaml: `// Express CORS middleware
app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));`,
      question: 'What\'s the security failure?',
      choices: [
        {
          label: 'origin: \'*\' is fine, but credentials: true should be inside the cors options.',
          correct: false,
          feedback: 'credentials: true is in the options object — that\'s correct usage. The combination is the issue.',
        },
        {
          label: 'methods includes DELETE which CORS does not support.',
          correct: false,
          feedback: 'DELETE is a valid CORS method.',
        },
        {
          label: 'Most browsers reject the combination origin: \'*\' + credentials: true outright — but if they didn\'t, every site could read your authenticated user\'s data via a cross-origin fetch with cookies.',
          correct: true,
          feedback: 'Correct. The CORS spec actually rejects this combination — browsers fail the preflight when credentials: true and Access-Control-Allow-Origin: * are both present. So the team\'s "fix" actually breaks the feature. The real fix: allowlist specific origins (echo back the request Origin only if it\'s in your allowed list), then set credentials: true.',
        },
        {
          label: 'cors() should be the last middleware — putting it first causes CSRF.',
          correct: false,
          feedback: 'Order doesn\'t cause CSRF. The combination of wildcard origin + credentials is the fundamental issue.',
        },
      ],
      explanation: 'CORS misconfigurations regularly leak authenticated data. The pattern: maintain an allowlist of origins; in your middleware, set Access-Control-Allow-Origin to the specific request Origin (only if it\'s in the allowlist) and add Vary: Origin so caches don\'t mix responses. Never combine wildcard origin with credentials. For internal APIs, prefer SameSite=Strict cookies to limit cross-origin exposure entirely.',
      learnMore: { label: 'Service mesh & secure networking', href: '/courses/cloud-native-security-engineering/service-mesh-security' },
    },
    {
      id: 'webhook-timing',
      topic: 'Webhooks',
      title: 'Webhook signature verification',
      briefing: 'You receive Stripe-style webhooks at /webhooks/payments. To prevent forgery, you verify a signature header. The check:',
      yaml: `// Webhook handler
function verifyWebhook(payload: Buffer, signature: string) {
  const expected = crypto
    .createHmac('sha256', SECRET)
    .update(payload)
    .digest('hex');

  return signature === expected;
}`,
      question: 'What attack does this code allow?',
      choices: [
        {
          label: 'Replay attack: the same payload + signature can be re-submitted.',
          correct: false,
          feedback: 'Replay is a real concern, but it\'s typically mitigated with a timestamp + tolerance window. The bug here is more direct.',
        },
        {
          label: 'A timing side-channel attack: == on strings short-circuits at the first mismatched byte. An attacker measures response time to learn the signature one byte at a time.',
          correct: true,
          feedback: 'Correct. String equality short-circuits, leaking timing. Use a constant-time comparison: crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected)). The provider (Stripe, GitHub, etc.) explicitly recommends timing-safe comparison in their webhook docs for this exact reason.',
        },
        {
          label: 'sha256 is broken — use sha3-256.',
          correct: false,
          feedback: 'HMAC-SHA256 is not broken and is appropriate for webhook signatures.',
        },
        {
          label: 'createHmac should use base64url encoding.',
          correct: false,
          feedback: 'Either hex or base64url works as long as both sides use the same encoding.',
        },
      ],
      explanation: 'Timing attacks on signature comparisons are practical against network services with microsecond response variance, especially when the attacker can issue many attempts. crypto.timingSafeEqual (Node.js), hmac.compare_digest (Python), or subtle.ConstantTimeCompare (Go) are the right primitives. Combine with a timestamp tolerance to defeat replay, and you have a webhook handler that resists both forgery and replay.',
      learnMore: { label: 'Authentication patterns', href: '/courses/cloud-native-security-engineering/kubernetes-authentication-authorization' },
    },
  ];

  constructor() {
    this.seo.update({
      title: 'API Attack & Defense',
      description: 'Interactive API security simulator: spot JWT verification bypasses, OAuth redirect_uri exploits, mass assignment, rate-limit bypasses, CORS misconfigurations, and webhook timing attacks across 6 production scenarios. Free, no signup.',
      url: '/games/api-attack-defense',
      breadcrumbs: [
        { name: 'Home', url: '/' },
        { name: 'Security Simulators', url: '/games' },
        { name: 'API Attack & Defense', url: '/games/api-attack-defense' },
      ],
    });
  }
}
