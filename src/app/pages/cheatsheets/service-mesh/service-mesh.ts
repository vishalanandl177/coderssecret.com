import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../../services/seo.service';
import { CheatsheetPageComponent, CheatsheetHeader, CommandGroup, MisconfigPair, RelatedLink } from '../_shared/cheatsheet-page';

@Component({
  selector: 'app-cheatsheet-service-mesh',
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
            <li class="text-foreground font-medium" aria-current="page">Service Mesh</li>
          </ol>
        </nav>

        <app-cheatsheet-page [header]="header" [groups]="groups" [misconfigPairs]="misconfigs" [relatedLinks]="related" />
      </div>
    </section>
  `,
})
export class ServiceMeshCheatsheetComponent {
  private seo = inject(SeoService);

  header: CheatsheetHeader = {
    icon: '🕸️',
    iconColor: '#8b5cf6',
    badge: 'Production Reference',
    badgeClass: 'bg-violet-500/10 border-violet-500/30 text-violet-500',
    title: 'Service Mesh Cheatsheet (Istio / Envoy)',
    intro: 'Operational reference for Istio service mesh and Envoy proxy. mTLS configuration, AuthorizationPolicy patterns, traffic management, and the diagnostic commands that actually pinpoint why a request was rejected.',
  };

  groups: CommandGroup[] = [
    {
      title: 'Mesh-wide mTLS',
      rows: [
        { cmd: 'PeerAuthentication mode: STRICT', desc: 'Require mTLS on all incoming requests. The recommended production default once mesh adoption is complete.', warning: 'Roll out via PERMISSIVE first to validate every workload talks mTLS, then promote to STRICT. Going straight to STRICT breaks any workload not yet in the mesh.' },
        { cmd: 'PeerAuthentication mode: PERMISSIVE', desc: 'Accept both mTLS and plaintext. The migration mode while you onboard services.', prodNote: 'Use kiali or Istio metrics to verify every connection is mTLS before promoting to STRICT.' },
        { cmd: 'PeerAuthentication mode: DISABLE', desc: 'Don\'t do mTLS. Used to selectively exempt workloads that cannot speak mTLS (e.g. health probes).', warning: 'Each DISABLE creates a hole in the security model. Document and review these regularly.' },
        { cmd: 'apiVersion: security.istio.io/v1\nkind: PeerAuthentication\nmetadata:\n  name: default\n  namespace: istio-system\nspec:\n  mtls:\n    mode: STRICT', desc: 'Mesh-wide STRICT. Apply in the istio-system namespace and inherit across the mesh.', prodNote: 'Override per-namespace by applying a PeerAuthentication in that namespace; per-workload via a workloadSelector.' },
      ],
    },
    {
      title: 'AuthorizationPolicy (Istio L4/L7 authz)',
      rows: [
        { cmd: 'apiVersion: security.istio.io/v1\nkind: AuthorizationPolicy\nmetadata:\n  name: deny-all\n  namespace: foo\nspec: {}', desc: 'Empty AuthorizationPolicy = deny all by default in the namespace. Then add explicit allow rules.', prodNote: 'Default-deny is the Zero Trust pattern. Build allowlist of who can talk to whom from there.' },
        { cmd: 'spec:\n  selector: { matchLabels: { app: payments } }\n  action: ALLOW\n  rules:\n  - from:\n    - source:\n        principals: [cluster.local/ns/marketing/sa/marketing-api]', desc: 'Allow marketing-api ServiceAccount to call payments. Principal format is cluster-local SPIFFE-style ID.', prodNote: 'For external callers (other clusters), use requestPrincipals (JWT subject) or namespaces.' },
        { cmd: 'rules:\n- to:\n  - operation:\n      methods: [GET]\n      paths: [/api/v1/users/*]', desc: 'L7 method/path matching. Read-only access to a path subtree.', prodNote: 'Path matchers support * wildcard. Be careful with /* — it matches /admin/* too unless explicitly denied.' },
        { cmd: 'rules:\n- when:\n  - key: request.auth.claims[role]\n    values: [admin]', desc: 'JWT claim-based authz. Requires a RequestAuthentication that validates the JWT first.', prodNote: 'Combine RequestAuthentication (validates the token) + AuthorizationPolicy (uses claims for decisions).' },
        { cmd: 'action: AUDIT', desc: 'Log the decision but don\'t enforce. Useful for shadow-running a new policy.', prodNote: 'Roll out new policies as AUDIT first; promote to ALLOW/DENY after the audit log shows the expected pattern.' },
      ],
    },
    {
      title: 'RequestAuthentication (JWT validation)',
      rows: [
        { cmd: 'apiVersion: security.istio.io/v1\nkind: RequestAuthentication\nmetadata:\n  name: jwt-auth0\nspec:\n  jwtRules:\n  - issuer: https://example.auth0.com/\n    jwksUri: https://example.auth0.com/.well-known/jwks.json\n    audiences: [https://api.example.com]', desc: 'Validate JWTs from a specific issuer. Failed tokens result in HTTP 401.', warning: 'RequestAuthentication alone doesn\'t require a token — without an AuthorizationPolicy that demands authentication, requests with no token still pass through.' },
        { cmd: 'AuthorizationPolicy { rules: [- from: [- source: { requestPrincipals: ["*"] }]] }', desc: 'Pair with RequestAuthentication: require any valid JWT. Anonymous requests get 403.', prodNote: 'requestPrincipals is "issuer/subject". Use specific principals for tighter authorization.' },
      ],
    },
    {
      title: 'Traffic management',
      rows: [
        { cmd: 'VirtualService { http: [- match: [{ headers: { x-canary: { exact: "true" } } }], route: [{ destination: { host: api, subset: canary }, weight: 100 }] }', desc: 'Route by header — opt-in canary via a feature flag header.', prodNote: 'Combine with weighted routing for percentage-based canaries: 95% baseline, 5% canary, then ramp.' },
        { cmd: 'DestinationRule { subsets: [{ name: canary, labels: { version: v2 } }], trafficPolicy: { connectionPool: { tcp: { maxConnections: 100 } } } }', desc: 'Define subsets (versions) of a service plus connection pool limits.', prodNote: 'Connection pool limits prevent one consumer from overloading a backend. Critical for noisy-neighbour resilience.' },
        { cmd: 'VirtualService { http: [- timeout: 5s, retries: { attempts: 3, perTryTimeout: 2s, retryOn: 5xx,reset,connect-failure } ] }', desc: 'Timeouts and retries at the mesh layer. Centralizes resilience policy.', warning: 'Retries amplify load on a struggling service. Limit attempts and use jittered backoff. Don\'t retry on POST without idempotency keys.' },
        { cmd: 'VirtualService { http: [- fault: { delay: { fixedDelay: 5s, percentage: { value: 100 } } } ] }', desc: 'Fault injection — inject latency or aborts. Use in pre-production chaos testing.', warning: 'Never deploy fault injection to production. Confine to staging clusters or narrow workloadSelectors in dev environments.' },
      ],
    },
    {
      title: 'istioctl: diagnostics that work',
      rows: [
        { cmd: 'istioctl analyze', desc: 'Static analysis across the mesh. Catches missing dependencies, misconfigurations, and deprecated fields.', prodNote: 'Run in CI on every Istio config change — catches 80% of policy bugs before deploy.' },
        { cmd: 'istioctl proxy-status', desc: 'Show every Envoy sidecar\'s sync state with the control plane (CDS, LDS, EDS, RDS).', prodNote: 'Sidecars stuck in STALE/NOT SENT state mean the workload sees outdated routing — common cause of "I deployed an update but the change isn\'t live".' },
        { cmd: 'istioctl proxy-config cluster <pod>.<ns> --fqdn <svc>', desc: 'See what routing the sidecar believes for a given service. The truth, vs what your config says.', prodNote: 'When traffic isn\'t routing as expected, this is the diff to compare config-as-written vs config-as-pushed.' },
        { cmd: 'istioctl proxy-config listeners <pod>.<ns>', desc: 'Show all Envoy listeners on the sidecar. Useful when ingress/egress isn\'t reaching the workload.', prodNote: 'Listeners are bound to (port, IP) — mismatches between Service ports and listener ports are common.' },
        { cmd: 'istioctl proxy-config secret <pod>.<ns>', desc: 'Show certs in the Envoy SDS cache. Confirm the SVID is current and the trust bundle is right.', prodNote: 'When mTLS handshakes fail, this is where to start: is the cert there, is it valid, is the chain right.' },
        { cmd: 'istioctl experimental authz check <pod>.<ns>', desc: 'Print the AuthorizationPolicy rules that apply to a specific pod. Maps from "who is denied" back to "which rule is doing it".', prodNote: 'Debugging authz starts here — much faster than reading every namespace-scoped policy.' },
      ],
    },
    {
      title: 'Envoy: when sidecar logs aren\'t enough',
      rows: [
        { cmd: 'kubectl exec <pod> -c istio-proxy -- pilot-agent request GET stats | grep <pattern>', desc: 'Envoy stats endpoint. Counters for everything Envoy does.', prodNote: 'Useful patterns: `cluster.<name>.upstream_rq_5xx` (backend 5xx counts), `listener.<addr>.downstream_cx_total` (ingress connections).' },
        { cmd: 'kubectl exec <pod> -c istio-proxy -- pilot-agent request GET config_dump', desc: 'Dump the full Envoy config from the running sidecar.', prodNote: 'Pipe to jq to filter: `... | jq \'.configs[] | select(.["@type"] | contains("Cluster"))\'` for cluster config.' },
        { cmd: 'kubectl exec <pod> -c istio-proxy -- curl localhost:15000/clusters', desc: 'Cluster (upstream) state — endpoints, health checks, circuit breakers.', prodNote: 'EDS endpoints showing "unhealthy" point to a real connection failure between sidecar and backend.' },
        { cmd: 'level: debug  scope: connection,upstream,router', desc: 'Bump Envoy log level for specific scopes. Use sparingly — extreme volume.', prodNote: '`pilot-agent request POST "logging?upstream=debug"` toggles at runtime; reset to info when done.' },
      ],
    },
  ];

  misconfigs: MisconfigPair[] = [
    {
      bad: `# AuthorizationPolicy that "allows everything"
spec:
  action: ALLOW
  rules: []`,
      good: `# Default-deny + explicit allow
# 1) Deny all in namespace:
metadata: { name: deny-all, namespace: foo }
spec: {}
# 2) Then allow specific callers:
metadata: { name: allow-payments-from-marketing, namespace: foo }
spec:
  selector: { matchLabels: { app: payments } }
  action: ALLOW
  rules:
  - from:
    - source: { principals: [cluster.local/ns/marketing/sa/marketing-api] }`,
      why: 'An AuthorizationPolicy with action: ALLOW and empty rules matches nothing — but combined with no other policy, the namespace-default is "no policy = allow all". The Zero Trust pattern is empty-spec deny-all + explicit allow rules per service-to-service relationship.',
    },
    {
      bad: `# RequestAuthentication only — assumes auth required
kind: RequestAuthentication
spec:
  jwtRules:
  - issuer: https://auth.example.com/`,
      good: `# RequestAuthentication + AuthorizationPolicy that DEMANDS the token
---
kind: RequestAuthentication
spec:
  jwtRules:
  - issuer: https://auth.example.com/
---
kind: AuthorizationPolicy
spec:
  action: ALLOW
  rules:
  - from:
    - source: { requestPrincipals: ["*"] }`,
      why: 'RequestAuthentication validates JWTs but doesn\'t require their presence — anonymous requests still pass through. The AuthorizationPolicy with requestPrincipals: ["*"] enforces "must have a valid JWT". Both are required for actual authentication.',
    },
    {
      bad: `# Roll out STRICT mTLS mesh-wide on day one:
kind: PeerAuthentication
metadata: { name: default, namespace: istio-system }
spec:
  mtls: { mode: STRICT }`,
      good: `# Phase 1: PERMISSIVE
spec: { mtls: { mode: PERMISSIVE } }
# (verify in Kiali: every connection is now mTLS)
# Phase 2: STRICT per-namespace as it's confirmed
metadata: { name: default, namespace: payments }
spec: { mtls: { mode: STRICT } }
# Phase 3: STRICT mesh-wide once all namespaces are confirmed`,
      why: 'STRICT immediately blocks any workload not yet talking mTLS — including ingress probes from external load balancers, sidecar-less DaemonSets, and apps that haven\'t adopted Istio yet. PERMISSIVE accepts both, lets you verify mTLS is happening, and then promote to STRICT one namespace at a time.',
    },
  ];

  related: RelatedLink[] = [
    { label: 'Cloud Native Security Engineering — Service Mesh module', href: '/courses/cloud-native-security-engineering/service-mesh-security', description: 'Module: build and secure a service mesh from first principles.' },
    { label: 'SPIFFE/SPIRE integration with service mesh', href: '/courses/mastering-spiffe-spire/spire-integrations-service-mesh', description: 'How SPIRE-issued SVIDs power Istio/Envoy mTLS.' },
    { label: 'Service mesh glossary entry', href: '/glossary/service-mesh', description: 'What service mesh is and what it solves.' },
    { label: 'mTLS glossary entry', href: '/glossary/mtls', description: 'Mutual TLS — the universal handshake for service-to-service trust.' },
  ];

  constructor() {
    this.seo.update({
      title: 'Service Mesh Cheatsheet (Istio / Envoy)',
      description: 'Production reference for Istio and Envoy: mesh-wide mTLS rollout, AuthorizationPolicy patterns, RequestAuthentication for JWTs, traffic management, and istioctl/Envoy diagnostics. Free, ad-free.',
      url: '/cheatsheets/service-mesh',
      breadcrumbs: [
        { name: 'Home', url: '/' },
        { name: 'Reference', url: '/cheatsheets' },
        { name: 'Service Mesh', url: '/cheatsheets/service-mesh' },
      ],
    });
  }
}
