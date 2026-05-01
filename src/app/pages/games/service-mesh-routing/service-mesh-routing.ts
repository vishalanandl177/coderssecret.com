import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../../services/seo.service';
import { ScenarioQuizComponent, Scenario, QuizTheme, QuizIntro, QuizResults, QuizCallToActions } from '../_shared/scenario-quiz';

@Component({
  selector: 'app-service-mesh-routing',
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
            <li class="text-foreground font-medium" aria-current="page">Service Mesh Routing Game</li>
          </ol>
        </nav>

        <app-scenario-quiz [scenarios]="scenarios" [theme]="theme" [intro]="intro" [results]="results" [callToActions]="callToActions" />
      </div>
    </section>
  `,
})
export class ServiceMeshRoutingComponent {
  private seo = inject(SeoService);

  theme: QuizTheme = {
    badgePill: 'bg-violet-500/10 border-violet-500/30 text-violet-500',
    accentText: 'text-violet-500',
    titleGradient: 'from-violet-500 via-purple-500 to-fuchsia-500',
    numberCircle: 'bg-violet-500/15 text-violet-500',
    startButton: 'bg-violet-500 hover:bg-violet-400 shadow-violet-500/30',
    topicPill: 'bg-violet-500/15 text-violet-500',
    callout: 'border-violet-500/30 bg-violet-500/5',
    calloutTitle: 'text-violet-500',
    resultsBg: 'from-violet-500/10 via-card to-purple-500/10',
  };

  intro: QuizIntro = {
    badge: 'Service Mesh Lab',
    titlePlain: 'Service Mesh',
    titleGradient: 'Routing Game',
    description: 'Configure traffic, secure communications, and authorise the right peers across an Istio/Envoy mesh. Each scenario shows a real configuration with a hidden flaw — the kind that causes 4xx storms, broken canaries, or wide-open authz at 03:00.',
    steps: [
      'Each scenario shows an Istio CRD (PeerAuthentication, AuthorizationPolicy, VirtualService, DestinationRule) or an Envoy snippet.',
      'Identify the routing or security flaw from four plausible options — the wrong answers explain why they look reasonable but miss the issue.',
      'Read the production explanation, follow the link to the relevant lesson, and move to the next scenario.',
      'Score yourself across all six rounds — covering mTLS rollout, authz policy, JWT auth, traffic shifting, retries, and Envoy diagnostics.',
    ],
    practiceTitle: `What You'll Practice`,
    practiceDescription: 'The simulator covers the service-mesh design decisions that determine whether the mesh actually delivers Zero Trust — or just adds a sidecar.',
    practiceConcepts: [
      { name: 'mTLS Rollout', description: 'PERMISSIVE → STRICT migration patterns' },
      { name: 'AuthorizationPolicy', description: 'Default-deny + explicit allow' },
      { name: 'JWT Auth', description: 'RequestAuthentication + matching policy' },
      { name: 'Traffic Shift', description: 'Canary, weighted routing, header gates' },
      { name: 'Retries', description: 'Backoff, idempotency, retry budgets' },
      { name: 'Diagnostics', description: 'istioctl proxy-config, Envoy stats' },
    ],
    deeperLine: 'Want to go deeper after the simulation? Read the ',
    deeperLinks: [
      { label: 'Cloud Native Security Engineering — Service Mesh module', href: '/courses/cloud-native-security-engineering/service-mesh-security' },
      { label: 'Service Mesh cheatsheet', href: '/cheatsheets/service-mesh' },
    ],
    timeMinutes: 12,
    difficulty: 'Medium',
  };

  results: QuizResults = {
    perfect: { headline: 'Mesh secured, traffic clean. Flawless run.', emoji: '\u{1F947}', message: 'You configure Istio like an SRE. The Cloud Native Security Engineering course goes deeper into multi-cluster mesh, ambient mode, and the federation patterns that scale.' },
    great: { headline: 'You read CRDs like a mesh operator.', emoji: '\u{1F578}\u{FE0F}', message: 'Strong design instincts. Brush up on the few you missed and explore the istioctl proxy-config flow for live debugging.' },
    good: { headline: 'Solid foundation — refine the rough edges.', emoji: '\u{1F4DA}', message: 'You know the patterns. The structured curriculum walks through each design with the labs to deploy them.' },
    weak: { headline: 'Time to revisit Istio fundamentals.', emoji: '\u{1F50D}', message: 'These are the mesh design decisions that show up on every Istio rollout. Start with the service-mesh module and the cheatsheet, then come back.' },
  };

  callToActions: QuizCallToActions = {
    primary: { label: 'Take the service mesh module', href: '/courses/cloud-native-security-engineering/service-mesh-security' },
  };

  scenarios: Scenario[] = [
    {
      id: 'mtls-strict-day-one',
      topic: 'mTLS Rollout',
      title: 'Mesh-wide STRICT mTLS, applied on day one',
      briefing: 'A platform team installs Istio and immediately applies mesh-wide STRICT mTLS. Within minutes, multiple production services start failing health probes; external load balancers stop forwarding traffic.',
      yaml: `apiVersion: security.istio.io/v1
kind: PeerAuthentication
metadata:
  name: default
  namespace: istio-system
spec:
  mtls:
    mode: STRICT`,
      question: 'What\'s the design problem?',
      choices: [
        {
          label: 'STRICT must be applied per-namespace, not mesh-wide.',
          correct: false,
          feedback: 'Mesh-wide STRICT is a valid (and recommended) end state. The issue is going there directly without a migration path.',
        },
        {
          label: 'STRICT immediately rejects any non-mTLS traffic — including external load balancer health probes, DaemonSets without sidecars, and services not yet onboarded to Istio. The migration pattern is PERMISSIVE first (verify all traffic is mTLS via Kiali / Istio metrics), then promote to STRICT once clean.',
          correct: true,
          feedback: 'Correct. PERMISSIVE accepts both mTLS and plaintext, lets you verify in Kiali that every connection is mTLS-capable, and then you graduate to STRICT one namespace at a time. Going straight to STRICT on a brownfield cluster guarantees an outage. The same pattern applies to AuthorizationPolicy: roll out as AUDIT first, then promote to ALLOW/DENY.',
        },
        {
          label: 'The PeerAuthentication should be in the istio-config namespace, not istio-system.',
          correct: false,
          feedback: 'istio-system is the correct namespace for mesh-wide PeerAuthentication.',
        },
        {
          label: 'STRICT requires Istio 1.20+; older versions silently downgrade.',
          correct: false,
          feedback: 'STRICT mode has been supported since Istio 1.5. There\'s no version-related silent downgrade.',
        },
      ],
      explanation: 'Mesh adoption is a brownfield migration, not a greenfield install. The phased rollout is: (1) install Istio with sidecars in PERMISSIVE; (2) verify mTLS coverage in Kiali for every workload; (3) per-namespace STRICT for namespaces fully on the mesh; (4) mesh-wide STRICT once every namespace is clean. Add explicit DISABLE PeerAuthentications for any workload that genuinely cannot speak mTLS (legacy bridge services, certain LB health probes) — and document each one as a tracked exception.',
      learnMore: { label: 'Plan a mesh rollout', href: '/cheatsheets/service-mesh' },
    },
    {
      id: 'authz-allow-empty-rules',
      topic: 'AuthorizationPolicy',
      title: 'A "deny all" AuthorizationPolicy that allows everything',
      briefing: 'A team wants to enforce a default-deny posture in their namespace. They apply this policy:',
      yaml: `apiVersion: security.istio.io/v1
kind: AuthorizationPolicy
metadata:
  name: deny-all
  namespace: payments
spec:
  action: ALLOW
  rules: []`,
      question: 'Why does this not actually deny traffic?',
      choices: [
        {
          label: 'AuthorizationPolicy with action: ALLOW and empty rules matches nothing — but Istio falls back to its default behaviour, which is "no policy matches → allow". The correct deny-all is `spec: {}` (empty spec entirely), which Istio interprets as "deny all".',
          correct: true,
          feedback: 'Correct. There are two ways to express "deny everything": (1) action: DENY with rules that match all (e.g. from any source); (2) action: ALLOW with empty spec ({}). The pitfall is action: ALLOW with rules: [] — that matches no allow rules, falls through to "no policy applies", and traffic flows. The empty-spec deny-all + explicit allow rules per relationship is the Zero Trust pattern.',
        },
        {
          label: 'The namespace selector is missing — needs `selector: {}`.',
          correct: false,
          feedback: 'Without a selector, the policy applies to the whole namespace. The selector isn\'t the issue.',
        },
        {
          label: 'AuthorizationPolicy needs to be in istio-system to take effect.',
          correct: false,
          feedback: 'Namespace-scoped AuthorizationPolicy applies to the namespace it lives in. istio-system is for mesh-wide policies.',
        },
        {
          label: 'Rules must include `from: [{ source: { namespaces: ["*"] } }]` to match.',
          correct: false,
          feedback: 'That would explicitly allow all sources. The fix is the opposite — make the policy actually deny.',
        },
      ],
      explanation: 'Istio AuthorizationPolicy semantics are subtle. Three distinct configurations look similar but behave differently: (a) `spec: {}` — deny all in the namespace; (b) `spec: { action: ALLOW, rules: [{...}] }` — allow only what matches; (c) `spec: { action: ALLOW, rules: [] }` — allows everything (the bug above). Always test with `istioctl experimental authz check <pod>.<ns>` to see which policies apply and what they decide. AuthorizationPolicy is one of the most-misconfigured Istio resources in production.',
      learnMore: { label: 'AuthorizationPolicy patterns', href: '/cheatsheets/service-mesh' },
    },
    {
      id: 'jwt-auth-without-policy',
      topic: 'JWT Auth',
      title: 'A RequestAuthentication for JWT — but anonymous traffic still passes',
      briefing: 'Your team adds JWT validation via RequestAuthentication. Tests confirm valid tokens pass; invalid tokens are rejected with 401. But QA reports requests with NO Authorization header still reach the backend.',
      yaml: `apiVersion: security.istio.io/v1
kind: RequestAuthentication
metadata:
  name: api-jwt
  namespace: api
spec:
  selector: { matchLabels: { app: api } }
  jwtRules:
  - issuer: https://auth.example.com/
    jwksUri: https://auth.example.com/.well-known/jwks.json
    audiences: [https://api.example.com]`,
      question: 'Why does anonymous traffic still reach the backend?',
      choices: [
        {
          label: 'jwksUri is wrong — should be "/openid/jwks".',
          correct: false,
          feedback: 'The path varies by IdP; .well-known/jwks.json is standard for OAuth2/OIDC.',
        },
        {
          label: 'RequestAuthentication only validates tokens that are present — it doesn\'t require their presence. Anonymous requests pass through. You need a paired AuthorizationPolicy with `from: [{ source: { requestPrincipals: ["*"] } }]` to enforce "must have a valid JWT".',
          correct: true,
          feedback: 'Correct. RequestAuthentication is "if a JWT is presented, validate it" — invalid tokens 401, missing tokens fall through. The companion AuthorizationPolicy with requestPrincipals: ["*"] enforces "any valid JWT principal is required". For finer-grained authz, use specific principals or claim-based when conditions.',
        },
        {
          label: 'audiences should be a list of paths, not URLs.',
          correct: false,
          feedback: 'audiences are JWT aud claim values — typically URLs identifying the API. The format is fine.',
        },
        {
          label: 'RequestAuthentication needs an annotation `istio.io/rev=default`.',
          correct: false,
          feedback: 'The rev annotation is only relevant in revision-tagged Istio installs.',
        },
      ],
      explanation: 'The full JWT-required pattern is two CRDs: RequestAuthentication (validate tokens that are present) + AuthorizationPolicy (require a valid principal). Without the second piece, you have JWT validation that doesn\'t enforce JWT presence. For authorization based on claims (e.g. "only role=admin can hit this path"), add a `when` block that matches request.auth.claims[role]. Push more nuanced rules into OPA / Authorino for richer policy.',
      learnMore: { label: 'JWT + AuthorizationPolicy', href: '/cheatsheets/service-mesh' },
    },
    {
      id: 'canary-traffic-shift',
      topic: 'Traffic Shift',
      title: 'A canary deployment that doesn\'t actually canary',
      briefing: 'A team rolls out v2 of payments-api. They add a VirtualService for header-based routing — `x-canary: true` should hit v2; everything else should hit v1.',
      yaml: `apiVersion: networking.istio.io/v1
kind: VirtualService
metadata:
  name: payments-api
spec:
  hosts: [payments-api]
  http:
  - route:
    - destination: { host: payments-api, subset: v1 }
      weight: 100
  - match:
    - headers: { x-canary: { exact: "true" } }
    route:
    - destination: { host: payments-api, subset: v2 }`,
      question: 'Why does the canary header never reach v2?',
      choices: [
        {
          label: 'subset names must be alphanumeric — v1/v2 are reserved.',
          correct: false,
          feedback: 'v1 and v2 are valid subset names. The issue is in the match order.',
        },
        {
          label: 'VirtualService HTTP routes are evaluated top-down. The first route has no match block — it matches everything and sends 100% to v1 before the canary match is reached. Move the canary match block first.',
          correct: true,
          feedback: 'Correct. Routes in a VirtualService are ordered. A route with no `match` is a catch-all; everything below it is unreachable. Reorder so the most specific match (canary header) comes first; the catch-all is last. This is the same evaluation model as nginx location blocks or Express middleware — most specific first.',
        },
        {
          label: 'subset v2 isn\'t defined in the DestinationRule yet.',
          correct: false,
          feedback: 'That would cause v2 routes to fail with no-healthy-upstream errors. The actual symptom is "v2 never reached" because of route ordering.',
        },
        {
          label: 'weight: 100 means "always route here" and overrides everything below.',
          correct: false,
          feedback: 'weight is for splitting within a single route\'s destinations. Multiple routes are evaluated by match order, not weight.',
        },
      ],
      explanation: 'Most VirtualService routing bugs are ordering bugs. A useful rule: "first matching route wins". Always validate with `istioctl proxy-config route <pod>.<ns>` to see what the sidecar believes the routing actually is. For a real canary: header match first, then weighted catch-all (e.g. 95% v1 / 5% v2) — combining feature-flag canaries (opt-in) with percentage canaries (gradual rollout).',
      learnMore: { label: 'Traffic management patterns', href: '/cheatsheets/service-mesh' },
    },
    {
      id: 'retry-storm',
      topic: 'Retries',
      title: 'A retry policy that\'s causing the outage it\'s trying to mitigate',
      briefing: 'Production is in partial failure. payments-api is overloaded; latency is climbing. Your monitoring shows requests-per-second to payments-api is 4× normal. The VirtualService has this retry policy:',
      yaml: `http:
- route:
  - destination: { host: payments-api }
  retries:
    attempts: 3
    perTryTimeout: 10s
    retryOn: 5xx,reset,connect-failure
  timeout: 30s`,
      question: 'How is the retry policy contributing to the outage?',
      choices: [
        {
          label: 'attempts: 3 + retryOn 5xx means a single struggling backend gets hammered with 4× the traffic (1 original + 3 retries). When a service is already overloaded, retries amplify load and prevent recovery — the classic "retry storm".',
          correct: true,
          feedback: 'Correct. Retry storms turn brownouts into outages. Mitigations: (1) use a retry budget — limit retries to a percentage of total RPS so a struggling backend gets relief; (2) add jittered exponential backoff; (3) only retry on specific 5xx codes (503/504, not 500), and use idempotency keys for non-idempotent verbs; (4) consider a circuit breaker on the upstream (Envoy outlier detection).',
        },
        {
          label: 'perTryTimeout: 10s is too short — increase to 30s.',
          correct: false,
          feedback: 'Longer per-try timeouts make the storm worse — each attempt holds resources longer.',
        },
        {
          label: 'timeout: 30s is the full request timeout — Istio doesn\'t retry within it.',
          correct: false,
          feedback: 'Istio absolutely retries within the request timeout. perTryTimeout × attempts is bounded by timeout.',
        },
        {
          label: 'retryOn should include "deadline-exceeded" to retry on slow backends.',
          correct: false,
          feedback: 'Adding more retry conditions makes the storm worse. The fix is fewer/smarter retries, not more.',
        },
      ],
      explanation: 'Retries are useful when a transient error has a real chance of succeeding on a retry. They are harmful when (a) the backend is overloaded — retries amplify load; (b) the request isn\'t idempotent — POSTs retried multiple times cause duplicate side effects; (c) every layer adds its own retries — multiplying the amplification. The healthy pattern: retry budgets at the mesh layer, idempotency keys at the application layer, circuit breaking on the upstream, and structured backoff with jitter. Retry budgets are an Envoy-native feature; use them.',
      learnMore: { label: 'Resilience design patterns', href: '/courses/cloud-native-security-engineering/service-mesh-security' },
    },
    {
      id: 'envoy-no-healthy-upstream',
      topic: 'Diagnostics',
      title: '"no healthy upstream" — debug this',
      briefing: 'A new VirtualService is deployed. Requests to /api/v2 return "no healthy upstream" with HTTP 503. The pods are running and ready. You run istioctl diagnostics:',
      yaml: `$ kubectl get pods -n api -l version=v2
NAME              READY   STATUS    AGE
api-v2-7d9-x   2/2     Running   3m

$ istioctl proxy-config cluster api-v1-abc.api --fqdn api.api.svc
SERVICE FQDN              PORT   SUBSET   ENDPOINTS
api.api.svc.cluster.local  80     v1       3 endpoints
api.api.svc.cluster.local  80     v2       0 endpoints  # <- empty!

$ kubectl get destinationrule -n api api -o yaml
spec:
  host: api
  subsets:
  - name: v1
    labels: { version: v1 }
  - name: v2
    labels: { app: api-v2 }    # <- typo or wrong key`,
      question: 'What\'s the root cause?',
      choices: [
        {
          label: 'The DestinationRule subset v2 selects on `app: api-v2`, but the pods are labelled `version: v2`. The selector matches no pods, so the v2 subset has zero endpoints — Envoy returns "no healthy upstream". Fix the subset label match.',
          correct: true,
          feedback: 'Correct. DestinationRule subsets group endpoints by pod label. The selector must match an actual label on the pods. The classic mistake is labelling pods with `version: v2` (the convention) and then writing the subset selector with a different key. proxy-config cluster output makes the diagnostic trivial: 0 endpoints in a subset = the selector isn\'t matching.',
        },
        {
          label: 'Pods need 1m+ to enter the Istio service registry — wait longer.',
          correct: false,
          feedback: 'Pods enter the registry in seconds, not minutes. They\'re Running and Ready already.',
        },
        {
          label: 'The Service object is missing port 80.',
          correct: false,
          feedback: 'The proxy-config output shows port 80 with v1 endpoints — the Service is fine.',
        },
        {
          label: 'mTLS handshake is failing between v1 and v2.',
          correct: false,
          feedback: '"No healthy upstream" is an endpoint-discovery problem, not a handshake problem. Handshake failures show as connection failures with TLS-specific reason codes.',
        },
      ],
      explanation: 'The mesh diagnostic flow: (1) is the pod Running and Ready? — kubectl get pods. (2) is the sidecar configured with the right cluster? — `istioctl proxy-config cluster`. (3) does the cluster have endpoints? — same command, look at ENDPOINTS column. (4) if no endpoints, the DestinationRule subset selector doesn\'t match the pod labels. This four-step flow resolves 80% of "service won\'t take traffic" symptoms in Istio. The rest are usually mTLS or AuthorizationPolicy issues, debugged with `istioctl experimental authz check`.',
      learnMore: { label: 'istioctl diagnostics flow', href: '/cheatsheets/service-mesh' },
    },
  ];

  constructor() {
    this.seo.update({
      title: 'Service Mesh Routing Game',
      description: 'Interactive Istio/Envoy service mesh simulator: spot mTLS rollout flaws, AuthorizationPolicy semantics, JWT validation gaps, traffic-shift ordering bugs, retry-storm patterns, and Envoy diagnostic flows across 6 production scenarios. Free, no signup.',
      url: '/games/service-mesh-routing',
      breadcrumbs: [
        { name: 'Home', url: '/' },
        { name: 'Security Simulators', url: '/games' },
        { name: 'Service Mesh Routing Game', url: '/games/service-mesh-routing' },
      ],
    });
  }
}
