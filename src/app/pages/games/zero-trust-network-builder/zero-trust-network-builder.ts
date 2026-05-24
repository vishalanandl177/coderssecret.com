import { Component, inject } from '@angular/core';
import { SeoService } from '../../../services/seo.service';
import { ScenarioQuizComponent, Scenario, QuizTheme, QuizIntro, QuizResults, QuizCallToActions } from '../_shared/scenario-quiz';

@Component({
  selector: 'app-zero-trust-network-builder',
  imports: [ScenarioQuizComponent],
  template: `
    <app-scenario-quiz [scenarios]="scenarios" [theme]="theme" [intro]="intro" [results]="results" [callToActions]="callToActions" />
  `,
})
export class ZeroTrustNetworkBuilderComponent {
  private seo = inject(SeoService);


  scenarios: Scenario[] = [
    {
      id: 'spiffe-id-namespacing',
      topic: 'SPIFFE ID',
      title: 'Naming the workloads in a multi-team cluster',
      briefing: 'Your platform team is rolling out SPIFFE across three product teams (payments, identity, marketing) running in the same Kubernetes cluster. The first design proposal looks like this.',
      yaml: `# Trust domain: example.com
# Proposed SPIFFE IDs:

spiffe://example.com/payments-api
spiffe://example.com/payments-worker
spiffe://example.com/identity-api
spiffe://example.com/identity-worker
spiffe://example.com/marketing-cms
spiffe://example.com/marketing-events`,
      question: 'What is the design issue with this naming scheme?',
      choices: [
        {
          label: 'SPIFFE IDs must use kebab-case only — underscores are invalid.',
          correct: false,
          feedback: 'SPIFFE IDs are URI paths. Both kebab-case and snake_case are technically valid characters; the spec just requires they be URL-safe.',
        },
        {
          label: 'Flat workload names share a single namespace across teams — when payments deploys a "events" service it collides with marketing-events, and authorization policies have no team boundary to anchor on.',
          correct: true,
          feedback: 'Correct. SPIFFE IDs should use a hierarchical path that maps to your actual organizational/operational boundaries. Use spiffe://example.com/ns/payments/sa/payments-api so the trust domain itself reflects team scope and you can write team-wide authz policy with prefix matching.',
        },
        {
          label: 'Trust domain "example.com" is reserved by SPIFFE for documentation only.',
          correct: false,
          feedback: 'There is no such reservation. Trust domains are arbitrary strings the operator picks; example.com is fine for production if owned by the operator.',
        },
        {
          label: 'SPIFFE IDs should always include a UUID for uniqueness.',
          correct: false,
          feedback: 'SPIFFE IDs are deliberately stable, human-readable identifiers. Adding UUIDs defeats the point — selectors and authorization policies cannot bind to them.',
        },
      ],
      explanation: 'A SPIFFE ID is the primary key your authorization layer indexes on. Flat naming works for ten services and falls apart at a hundred. The healthy production pattern mirrors the deployment graph: spiffe://corp.example.com/cluster/prod/ns/payments/sa/payments-api. Then OPA / authz policy can express rules like `input.peer.spiffe_id starts_with "spiffe://corp.example.com/cluster/prod/ns/payments/"` to grant intra-team access without enumerating every workload.',
      learnMore: { label: 'Learn SPIFFE fundamentals', href: '/courses/mastering-spiffe-spire/spiffe-fundamentals' },
    },
    {
      id: 'attestation-broad-selector',
      topic: 'Attestation',
      title: 'A SPIRE registration entry that "just works"',
      briefing: 'A developer is debugging why their workload cannot get an SVID. They iterate on the SPIRE registration entry until it works. Here is the entry that finally lets the pod get its SVID.',
      yaml: `spire-server entry create \\
  -spiffeID spiffe://example.com/payments-api \\
  -parentID spiffe://example.com/spire/agent/k8s_psat/cluster/prod \\
  -selector k8s:ns:payments`,
      question: 'Why is this registration entry dangerous in production?',
      choices: [
        {
          label: 'The parentID should be the SPIRE Server, not the agent.',
          correct: false,
          feedback: 'For workload attestation, the parentID is the agent that vouches for the workload. This is correct.',
        },
        {
          label: 'A single selector "k8s:ns:payments" matches every pod in the payments namespace, so the marketing-cms test pod accidentally deployed there can also receive the payments-api SVID.',
          correct: true,
          feedback: 'Correct. SPIRE selectors are AND-ed — with only one weak selector, every pod that matches it gets the same identity. A pod that lands in the wrong namespace, an exploited container, or even a compromised init container can request and receive an SVID it should not have.',
        },
        {
          label: 'The SPIFFE ID should not contain "api" — that is a reserved suffix.',
          correct: false,
          feedback: 'There are no reserved suffixes in SPIFFE IDs.',
        },
        {
          label: 'k8s:ns:payments is the wrong selector key — it should be k8s:namespace:payments.',
          correct: false,
          feedback: 'The actual selector key for the Kubernetes Workload Attestor is "k8s:ns:NAME". The spec is fine; the issue is its breadth, not its syntax.',
        },
      ],
      explanation: 'The principle is "defense in depth via multiple selectors". A solid registration entry combines several attestor-provided properties: namespace, ServiceAccount, container image hash (or signature), and (when relevant) pod label selector. This binds the SPIFFE ID to a specific deployment, not to a broad piece of cluster state. The Mastering SPIFFE & SPIRE course walks through the full Kubernetes attestor selector list and the trade-offs of each.',
      learnMore: { label: 'Master workload attestation', href: '/courses/mastering-spiffe-spire/working-with-svids-workload-api' },
    },
    {
      id: 'mtls-shared-ca',
      topic: 'mTLS',
      title: 'Bootstrapping mTLS for service-to-service calls',
      briefing: 'A team wants services to authenticate each other with mTLS. Their proposal: generate a single corporate CA, sign one cert per service, and mount the cert as a Secret. Rotation is "manual, every 90 days." They argue that SPIRE adds operational complexity with no real benefit.',
      yaml: `# Proposed flow:
# 1. Corp CA signs payments-api.crt + payments-api.key
# 2. Cert and key mounted via Secret into the pod
# 3. TLS server config:
#      certfile=/etc/tls/payments-api.crt
#      keyfile=/etc/tls/payments-api.key
#      clientCAs=corp-root.pem  # any cert signed by corp CA passes

apiVersion: v1
kind: Secret
metadata:
  name: payments-api-mtls
type: kubernetes.io/tls
data:
  tls.crt: <base64 cert valid for 90 days>
  tls.key: <base64 private key>`,
      question: 'What is the most important thing this approach gets wrong about Zero Trust mTLS?',
      choices: [
        {
          label: 'Kubernetes does not support kubernetes.io/tls Secret type.',
          correct: false,
          feedback: 'It does — kubernetes.io/tls is a real, supported Secret type. The issue is what you do with the credentials, not the Secret format.',
        },
        {
          label: 'Long-lived (90-day) keys mounted from Secrets create an enormous attack window: any read of the Secret leaks a usable identity for months, and "trust any cert signed by corp CA" is not authentication of the specific peer.',
          correct: true,
          feedback: 'Correct. Two distinct flaws compound each other. Long-lived keys mean a single Secret read (or a stolen backup, or a leaked etcd snapshot) leaks a usable identity for the rest of its validity period. And "any cert signed by corp CA" means service A cannot distinguish service B from a malicious service C — it just confirms "some workload that corp CA signed." Real mTLS authorization needs identity-aware policy on top of the channel.',
        },
        {
          label: 'Mounting tls.key as a Secret violates the Kubernetes API — keys must be in ConfigMaps.',
          correct: false,
          feedback: 'Keys belong in Secrets, not ConfigMaps. The issue is the lifecycle, not the storage type.',
        },
        {
          label: 'mTLS requires HTTP/2; the snippet does not configure ALPN.',
          correct: false,
          feedback: 'mTLS works fine on HTTP/1.1. ALPN is optional.',
        },
      ],
      explanation: 'Zero Trust mTLS has two parts: (1) short-lived, automatically-rotated credentials so a leaked key has minutes of value, not months, and (2) authorization based on the peer\'s SPIFFE ID, not just "signed by our CA." SPIRE issues SVIDs that are typically valid for an hour and rotated automatically, with each workload getting its own ID. Your TLS layer then authorizes peers by SPIFFE ID — `spiffe://corp.example.com/ns/payments/sa/payments-api` — not by the fact that they hold a corp-CA-signed cert.',
      learnMore: { label: 'Implement mTLS the right way', href: '/courses/mastering-spiffe-spire/spire-integrations-service-mesh' },
    },
    {
      id: 'authz-prefix-matching',
      topic: 'Authorization',
      title: 'Service-to-service authorization with SPIFFE IDs',
      briefing: 'The marketing team wants their internal "events" service to be callable by any marketing service, but not by anything else. Their authz check looks like this.',
      yaml: `// In the events service, peer authorization:
func authorize(peerSpiffeID string) error {
  if strings.Contains(peerSpiffeID, "marketing") {
    return nil  // allowed
  }
  return errors.New("forbidden")
}`,
      question: 'What is wrong with this authorization check?',
      choices: [
        {
          label: 'strings.Contains is slower than strings.HasPrefix in Go.',
          correct: false,
          feedback: 'Performance is not the issue here. The issue is correctness.',
        },
        {
          label: 'A SPIFFE ID like "spiffe://example.com/marketing-evil-attacker" or even "spiffe://attacker.example/payments-marketing" passes the substring check — authorization should always anchor to the trust domain and a path prefix, never a substring match.',
          correct: true,
          feedback: 'Correct. Substring matching on identity is a classic auth bypass: an attacker who can register a workload with the substring in any position passes the check. The right check parses the SPIFFE ID, validates the trust domain matches yours exactly, and checks a strict path prefix like "/ns/marketing/".',
        },
        {
          label: 'The check should also verify the SPIFFE ID is signed by the workload\'s own private key.',
          correct: false,
          feedback: 'SPIFFE IDs are not "signed by the workload" — they are issued in SVIDs by the SPIRE Server and validated as part of the TLS handshake. You don\'t re-verify the signature in the application.',
        },
        {
          label: 'authorize() should return a *Status, not an error.',
          correct: false,
          feedback: 'Return type is a stylistic choice, not a security issue.',
        },
      ],
      explanation: 'Treat SPIFFE IDs like you treat URLs in security-sensitive code: parse them, do not pattern-match. Use the official go-spiffe library: `spiffeID, _ := spiffeid.FromString(peerID); spiffeID.TrustDomain() == myTD && strings.HasPrefix(spiffeID.Path(), "/ns/marketing/")`. Better yet, push the policy into OPA so it lives in versioned, testable Rego rather than in service code.',
      learnMore: { label: 'Build authorization policy properly', href: '/courses/mastering-spiffe-spire/authorization-policy-enforcement' },
    },
    {
      id: 'federation-trust-bundle-stale',
      topic: 'Federation',
      title: 'Federating across two clusters',
      briefing: 'Your "us-east" and "us-west" Kubernetes clusters each run a SPIRE deployment. To let workloads in one cluster authenticate workloads in the other, the team statically copies each cluster\'s trust bundle (the X.509 chain) into the other cluster\'s SPIRE Server config and re-applies on cert rotation. Trust bundles rotate every 90 days.',
      yaml: `# spire-server.yaml (us-east cluster):
federation:
  bundle_endpoint:
    address: 0.0.0.0
    port: 8443
  federates_with "us-west.example.com" = {
    bundle_endpoint_url: "https://spire-server.us-west.example.com:8443"
    bundle_endpoint_profile: "https_web"
    # trust bundle was last copied 87 days ago
  }`,
      question: 'What goes wrong with this federation setup in production?',
      choices: [
        {
          label: 'bundle_endpoint_profile must be "https_spiffe", not "https_web".',
          correct: false,
          feedback: 'Both profiles exist and both are valid. https_web uses a public CA; https_spiffe uses SPIFFE-issued bundles for the bundle endpoint itself. Either works for federation.',
        },
        {
          label: 'Static bundle copies become stale: when us-west rotates its CA, every us-east workload that calls us-west fails authentication until someone notices and re-copies the bundle.',
          correct: true,
          feedback: 'Correct. The whole point of bundle endpoints is to fetch the federated trust bundle dynamically. With static copies you\'re effectively running on an unmaintained cron — and the failure mode is total cross-cluster auth failure when the upstream rotates. Use the bundle endpoint protocol so SPIRE refreshes the bundle automatically.',
        },
        {
          label: 'SPIRE federation requires the same trust domain name in both clusters.',
          correct: false,
          feedback: 'It is the opposite — federation is for different trust domains that need to authenticate each other. Same trust domain doesn\'t need federation.',
        },
        {
          label: 'us-east and us-west cannot federate over public DNS — they must be peered via VPN.',
          correct: false,
          feedback: 'Federation works over any reachable network as long as the bundle endpoint is reachable. VPN/peering is an availability/security choice, not a SPIRE requirement.',
        },
      ],
      explanation: 'SPIRE federation is designed to be dynamic. The bundle endpoint protocol lets each SPIRE Server expose its current trust bundle over HTTPS, and federated peers fetch it on a schedule (default every 5 minutes). When the upstream rotates its CA, the new bundle propagates within minutes — no manual ops, no static copies, no certificate-rollover incidents at 3am. Manual bundle copying is acceptable only as a one-time bootstrap.',
      learnMore: { label: 'Configure SPIRE federation correctly', href: '/courses/mastering-spiffe-spire/advanced-spire-architectures' },
    },
    {
      id: 'svid-rotation-cached',
      topic: 'Rotation',
      title: 'A workload that "ignores" its rotated SVID',
      briefing: 'After a CA compromise, the security team forces SPIRE to rotate all SVIDs immediately and revokes the old trust bundle. Most services pick up the new SVID within a minute. One service — payments-api — keeps presenting the old SVID and failing TLS handshakes for 6 hours until someone restarts the pods.',
      yaml: `// payments-api server bootstrap (Go, simplified):
func main() {
  source, err := workloadapi.NewX509Source(ctx)
  if err != nil { log.Fatal(err) }

  // Used at startup, then never refreshed:
  cert := source.GetX509SVID()

  tlsConfig := &tls.Config{
    Certificates: []tls.Certificate{cert.Certificate()},
    ClientCAs:    source.GetX509Bundles().Bundles()[0].X509Authorities(),
  }
  http.ListenAndServeTLS(":443", "", "", tlsConfig)
}`,
      question: 'Why does this service keep using the old SVID?',
      choices: [
        {
          label: 'The Go `time` package caches certificates internally for 24 hours.',
          correct: false,
          feedback: 'There is no such cache in the standard library. The bug is in the application code.',
        },
        {
          label: 'GetX509SVID() returns the SVID at call time, then never updates. The TLS config is built once at startup with that snapshot, so every connection uses that frozen cert until the process restarts.',
          correct: true,
          feedback: 'Correct. The Workload API delivers a stream of SVID updates as they rotate, but you have to consume that stream. The fix is to use the dynamic helpers — tlsconfig.MTLSServerConfig(source, source, authorizer) — which read the current SVID on every connection from the live source. Then SVID rotation is automatic.',
        },
        {
          label: 'ClientCAs should be a trust domain, not a bundle.',
          correct: false,
          feedback: 'ClientCAs requires a CA pool of authorities, which is exactly what Bundles().X509Authorities() provides.',
        },
        {
          label: 'The Workload API requires polling — by default it never pushes updates.',
          correct: false,
          feedback: 'The Workload API streams updates; the SDK\'s X509Source consumes that stream. The bug is using a stale snapshot, not the API behavior.',
        },
      ],
      explanation: 'Short-lived SVIDs only deliver Zero Trust if your app actually re-reads them. Use the SPIFFE Go SDK\'s tlsconfig helpers (MTLSServerConfig, MTLSClientConfig) — they install a GetCertificate / GetClientCertificate callback that the standard library invokes on every handshake. Same pattern in Java (spire-tls), Python (py-spiffe), and Envoy SDS. Treat any code that reads an SVID once at startup as a latent rotation bug.',
      learnMore: { label: 'Run SPIRE on Kubernetes (with rotation)', href: '/courses/mastering-spiffe-spire/running-spire-on-kubernetes' },
    },
  ];

  theme: QuizTheme = {
    badgePill: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-500',
    accentText: 'text-cyan-500',
    titleGradient: 'from-cyan-500 via-blue-500 to-violet-500',
    numberCircle: 'bg-cyan-500/15 text-cyan-500',
    startButton: 'bg-cyan-500 hover:bg-cyan-400 shadow-cyan-500/30',
    topicPill: 'bg-cyan-500/15 text-cyan-500',
    callout: 'border-cyan-500/30 bg-cyan-500/5',
    calloutTitle: 'text-cyan-500',
    resultsBg: 'from-cyan-500/10 via-card to-violet-500/10',
  };

  intro: QuizIntro = {
    badge: 'Workload Identity Lab',
    titlePlain: 'Zero Trust Network',
    titleGradient: 'Builder',
    description: 'Design secure service-to-service communication with SPIFFE workload identity, mTLS, and trust federation. Each scenario drops you into a real architectural decision before any workload issues its first SVID.',
    steps: [
      'Each scenario shows a real SPIFFE/SPIRE configuration, mTLS handshake flow, or federation setup with a hidden design or security flaw.',
      'Identify the issue from four plausible options; the wrong answers explain why they look tempting but are not the root cause.',
      'Read the production explanation, follow the linked SPIFFE/SPIRE module, and move to the next scenario.',
      'Score yourself across six rounds covering SPIFFE ID design, workload attestation, mTLS bootstrap, authorization, federation, and SVID rotation.',
    ],
    practiceTitle: `What You'll Practice`,
    practiceDescription: 'The simulator covers the design decisions that determine whether a Zero Trust deployment actually achieves Zero Trust. Each scenario maps to a real production pattern or anti-pattern seen in SPIFFE/SPIRE rollouts at scale.',
    practiceConcepts: [
      { name: 'SPIFFE ID Design', description: 'Trust domains, workload names, and stable identity paths' },
      { name: 'Attestation', description: 'Selectors that bind identity to a real workload' },
      { name: 'mTLS Bootstrap', description: 'First connection without shared secrets' },
      { name: 'Authorization', description: 'SPIFFE-based access policy and least privilege' },
      { name: 'Federation', description: 'Cross-cluster trust bundles and boundaries' },
      { name: 'Rotation', description: 'Short-lived SVIDs and live certificate refresh' },
    ],
    deeperLine: 'Want to go deeper after the simulation? Open the ',
    deeperLinks: [
      { label: 'Mastering SPIFFE & SPIRE course', href: '/courses/mastering-spiffe-spire' },
      { label: 'SPIFFE & SPIRE cheatsheet', href: '/cheatsheets/spiffe-spire' },
    ],
    timeMinutes: 12,
    difficulty: 'Hard',
  };

  results: QuizResults = {
    perfect: { headline: 'Trust domain hardened. Flawless run.', emoji: '1', message: 'You spotted every Zero Trust design flaw in this run. The Mastering SPIFFE & SPIRE course goes deeper into multi-cluster architecture, registration-entry patterns, and AI-infrastructure identity.' },
    great: { headline: 'You design Zero Trust like an operator.', emoji: '2', message: 'You read SPIRE configurations like a platform engineer. Brush up on the few you missed in the relevant modules, then deploy a federated trust domain in the labs.' },
    good: { headline: 'Solid foundation. Refine the rough edges.', emoji: '3', message: 'You know the vocabulary. The structured curriculum walks through each scenario with labs that deploy SPIRE on a real cluster.' },
    weak: { headline: 'Time to dig into SPIFFE/SPIRE fundamentals.', emoji: '4', message: 'Most of these scenarios are covered in the first modules of the Mastering SPIFFE & SPIRE course. Start there, then reproduce the misconfigurations in the labs.' },
  };

  callToActions: QuizCallToActions = {
    primary: { label: 'Take the SPIFFE/SPIRE course', href: '/courses/mastering-spiffe-spire' },
    secondary: { label: 'Open SPIFFE/SPIRE sheet', href: '/cheatsheets/spiffe-spire' },
  };
  constructor() {
    this.seo.update({
      title: 'Zero Trust Network Builder',
      description: 'Interactive workload-identity simulator. Design SPIFFE ID schemes, configure SPIRE attestation, bootstrap mTLS, federate trust domains, and rotate SVIDs across 6 production scenarios. Free, no signup.',
      url: '/games/zero-trust-network-builder',
      breadcrumbs: [
        { name: 'Home', url: '/' },
        { name: 'Security Simulators', url: '/games' },
        { name: 'Zero Trust Network Builder', url: '/games/zero-trust-network-builder' },
      ],
    });
  }
}
