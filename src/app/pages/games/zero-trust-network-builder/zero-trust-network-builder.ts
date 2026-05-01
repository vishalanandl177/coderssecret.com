import { Component, inject, signal, computed } from '@angular/core';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../../services/seo.service';

interface Choice {
  label: string;
  correct: boolean;
  feedback: string;
}

interface Scenario {
  id: string;
  topic: 'SPIFFE ID' | 'Attestation' | 'mTLS' | 'Authorization' | 'Federation' | 'Rotation';
  title: string;
  briefing: string;
  yaml: string;
  question: string;
  choices: Choice[];
  explanation: string;
  learnMore: { label: string; href: string };
}

@Component({
  selector: 'app-zero-trust-network-builder',
  imports: [RouterLink, NgClass],
  template: `
    <section class="py-12 md:py-16 animate-in fade-in duration-500">
      <div class="container max-w-4xl mx-auto px-6">
        <nav aria-label="Breadcrumb" class="mb-6">
          <ol class="flex items-center gap-1.5 text-sm text-muted-foreground">
            <li><a routerLink="/" class="hover:text-foreground transition-colors">Home</a></li>
            <li class="text-muted-foreground/50">/</li>
            <li><a routerLink="/games" class="hover:text-foreground transition-colors">Security Simulators</a></li>
            <li class="text-muted-foreground/50">/</li>
            <li class="text-foreground font-medium" aria-current="page">Zero Trust Network Builder</li>
          </ol>
        </nav>

        <header class="text-center mb-10">
          <span class="inline-block rounded-full bg-cyan-500/10 border border-cyan-500/30 px-4 py-1 text-xs font-bold text-cyan-500 uppercase tracking-wider mb-4">Workload Identity Lab</span>
          <h1 class="text-3xl md:text-5xl font-extrabold tracking-tight leading-[1.1] mb-4">
            Zero Trust <span class="bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-500 bg-clip-text text-transparent">Network Builder</span>
          </h1>
          <p class="text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Design secure service-to-service communication with SPIFFE workload identity, mTLS, and trust federation. Each scenario drops you into a real architectural decision — the kind your team has to make before any pod issues its first SVID.
          </p>
        </header>

        @if (!gameStarted()) {
          <div class="rounded-2xl border border-border/60 bg-card p-6 md:p-10 mb-6">
            <h2 class="text-xl md:text-2xl font-bold mb-4">How the Simulator Works</h2>
            <ul class="space-y-3 text-sm md:text-base text-muted-foreground mb-6">
              <li class="flex items-start gap-3">
                <span class="inline-flex items-center justify-center h-6 w-6 rounded-full bg-cyan-500/15 text-cyan-500 font-bold text-xs flex-shrink-0 mt-0.5">1</span>
                <span>Each scenario shows a real SPIFFE/SPIRE configuration, mTLS handshake flow, or federation setup with a hidden design or security flaw.</span>
              </li>
              <li class="flex items-start gap-3">
                <span class="inline-flex items-center justify-center h-6 w-6 rounded-full bg-cyan-500/15 text-cyan-500 font-bold text-xs flex-shrink-0 mt-0.5">2</span>
                <span>Identify the issue from four plausible options — the wrong answers explain why they look tempting but aren't the issue.</span>
              </li>
              <li class="flex items-start gap-3">
                <span class="inline-flex items-center justify-center h-6 w-6 rounded-full bg-cyan-500/15 text-cyan-500 font-bold text-xs flex-shrink-0 mt-0.5">3</span>
                <span>Read the production explanation, follow the link to the relevant SPIFFE/SPIRE module, and move to the next scenario.</span>
              </li>
              <li class="flex items-start gap-3">
                <span class="inline-flex items-center justify-center h-6 w-6 rounded-full bg-cyan-500/15 text-cyan-500 font-bold text-xs flex-shrink-0 mt-0.5">4</span>
                <span>Score yourself across all six rounds — covering SPIFFE ID design, workload attestation, mTLS bootstrap, authorization, federation, and SVID rotation.</span>
              </li>
            </ul>

            <div class="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
              <div class="rounded-lg bg-accent/40 p-3 text-center">
                <div class="text-2xl font-extrabold">{{ scenarios.length }}</div>
                <div class="text-[10px] text-muted-foreground uppercase tracking-wider">Scenarios</div>
              </div>
              <div class="rounded-lg bg-accent/40 p-3 text-center">
                <div class="text-2xl font-extrabold">~12</div>
                <div class="text-[10px] text-muted-foreground uppercase tracking-wider">Minutes</div>
              </div>
              <div class="rounded-lg bg-accent/40 p-3 text-center col-span-2 md:col-span-1">
                <div class="text-2xl font-extrabold">Hard</div>
                <div class="text-[10px] text-muted-foreground uppercase tracking-wider">Difficulty</div>
              </div>
            </div>

            <button (click)="startGame()" class="w-full md:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-cyan-500 hover:bg-cyan-400 text-white font-bold px-7 py-3.5 text-sm shadow-lg shadow-cyan-500/30 hover:shadow-xl hover:-translate-y-0.5 transition-all">
              Start Simulation
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </button>
          </div>

          <div class="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm p-6 md:p-8">
            <h2 class="text-lg md:text-xl font-bold mb-3">What You'll Practice</h2>
            <p class="text-sm text-muted-foreground leading-relaxed mb-5">
              The simulator covers the design decisions that determine whether a Zero Trust deployment actually achieves Zero Trust. Each scenario maps to a real production pattern (or anti-pattern) seen in SPIFFE/SPIRE rollouts at scale.
            </p>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
              <div class="rounded-lg border border-border/40 bg-card p-3"><strong class="text-foreground">SPIFFE ID Design</strong><p class="text-muted-foreground mt-0.5">Trust domains &amp; namespacing</p></div>
              <div class="rounded-lg border border-border/40 bg-card p-3"><strong class="text-foreground">Attestation</strong><p class="text-muted-foreground mt-0.5">Selectors that bind identity to workload</p></div>
              <div class="rounded-lg border border-border/40 bg-card p-3"><strong class="text-foreground">mTLS Bootstrap</strong><p class="text-muted-foreground mt-0.5">First connection without shared secrets</p></div>
              <div class="rounded-lg border border-border/40 bg-card p-3"><strong class="text-foreground">Authorization</strong><p class="text-muted-foreground mt-0.5">SPIFFE-based access policy</p></div>
              <div class="rounded-lg border border-border/40 bg-card p-3"><strong class="text-foreground">Federation</strong><p class="text-muted-foreground mt-0.5">Cross-cluster trust bundles</p></div>
              <div class="rounded-lg border border-border/40 bg-card p-3"><strong class="text-foreground">Rotation</strong><p class="text-muted-foreground mt-0.5">Short-lived SVIDs in production</p></div>
            </div>
            <p class="mt-5 text-xs text-muted-foreground">
              Want to go deeper after the simulation? Take the free
              <a routerLink="/courses/mastering-spiffe-spire" class="text-primary underline">Mastering SPIFFE &amp; SPIRE</a> course or read the
              <a routerLink="/courses/zero-trust-kubernetes" class="text-primary underline">Zero Trust for Kubernetes</a> guide.
            </p>
          </div>
        }

        @if (gameStarted() && !gameEnded()) {
          <div class="rounded-2xl border border-border/60 bg-card p-6 md:p-8 mb-6">
            <div class="flex items-center justify-between text-sm mb-4">
              <span class="text-muted-foreground">Scenario {{ currentIndex() + 1 }} of {{ scenarios.length }}</span>
              <span>Score: <strong class="text-foreground">{{ score() }} / {{ currentIndex() + (answered() ? 1 : 0) }}</strong></span>
            </div>
            <div class="h-2 bg-muted rounded-full overflow-hidden mb-6">
              <div class="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-500 transition-all duration-500"
                   [style.width.%]="((currentIndex() + (answered() ? 1 : 0)) / scenarios.length) * 100"></div>
            </div>

            <div class="flex flex-wrap items-center gap-2 mb-4">
              <span class="inline-flex items-center rounded-full bg-cyan-500/15 text-cyan-500 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                {{ currentScenario().topic }}
              </span>
              <h2 class="text-lg md:text-xl font-bold tracking-tight">{{ currentScenario().title }}</h2>
            </div>
            <p class="text-sm text-muted-foreground mb-4 leading-relaxed">{{ currentScenario().briefing }}</p>

            <pre class="bg-muted rounded-lg p-4 overflow-x-auto text-xs md:text-sm font-mono mb-6 leading-relaxed"><code>{{ currentScenario().yaml }}</code></pre>

            <p class="font-semibold mb-3">{{ currentScenario().question }}</p>

            <div class="space-y-2">
              @for (choice of currentScenario().choices; track $index; let i = $index) {
                <button
                  (click)="select(i)"
                  [disabled]="answered()"
                  class="w-full text-left rounded-xl border-2 p-4 text-sm md:text-base transition-all duration-200"
                  [ngClass]="getChoiceClasses(i, choice.correct)">
                  <div class="flex items-start gap-3">
                    <span class="inline-flex items-center justify-center h-7 w-7 rounded-full text-xs font-bold flex-shrink-0 mt-0.5"
                          [ngClass]="getBadgeClasses(i, choice.correct)">
                      {{ ['A','B','C','D'][i] }}
                    </span>
                    <div class="flex-1">
                      <div class="font-medium">{{ choice.label }}</div>
                      @if (answered() && (choice.correct || selectedIndex() === i)) {
                        <p class="mt-2 text-xs text-muted-foreground leading-relaxed">{{ choice.feedback }}</p>
                      }
                    </div>
                  </div>
                </button>
              }
            </div>

            @if (answered()) {
              <div class="mt-6 rounded-xl border border-cyan-500/30 bg-cyan-500/5 p-5">
                <h3 class="text-sm font-bold mb-2 text-cyan-500 uppercase tracking-wider">What actually happens in production</h3>
                <p class="text-sm text-foreground/90 leading-relaxed mb-3">{{ currentScenario().explanation }}</p>
                <a [routerLink]="currentScenario().learnMore.href" class="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2.5 transition-all">
                  {{ currentScenario().learnMore.label }}
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </a>
              </div>

              <button (click)="next()" class="mt-5 w-full md:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-foreground text-background font-bold px-6 py-3 text-sm hover:gap-3 transition-all">
                {{ currentIndex() + 1 < scenarios.length ? 'Next scenario' : 'See your results' }}
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </button>
            }
          </div>
        }

        @if (gameEnded()) {
          <div class="rounded-2xl border border-border/60 bg-gradient-to-br from-cyan-500/10 via-card to-blue-500/10 p-8 md:p-12 text-center">
            <div class="text-6xl mb-4" aria-hidden="true">{{ resultEmoji() }}</div>
            <h2 class="text-2xl md:text-3xl font-extrabold tracking-tight mb-3">{{ resultHeadline() }}</h2>
            <p class="text-lg text-muted-foreground mb-2">You scored</p>
            <div class="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-500 bg-clip-text text-transparent mb-3">
              {{ score() }} / {{ scenarios.length }}
            </div>
            <p class="text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed mb-8">
              {{ resultMessage() }}
            </p>
            <div class="flex flex-wrap justify-center gap-3">
              <button (click)="restart()" class="inline-flex items-center gap-2 rounded-full bg-cyan-500 hover:bg-cyan-400 text-white font-bold px-6 py-3 text-sm shadow-lg shadow-cyan-500/30 hover:-translate-y-0.5 transition-all">
                Play again
              </button>
              <a routerLink="/courses/mastering-spiffe-spire" class="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-6 py-3 text-sm font-semibold text-foreground hover:bg-accent transition-all">
                Take the SPIFFE/SPIRE course
              </a>
              <a routerLink="/games" class="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-6 py-3 text-sm font-semibold text-foreground hover:bg-accent transition-all">
                Try another simulator
              </a>
            </div>
          </div>
        }
      </div>
    </section>
  `,
})
export class ZeroTrustNetworkBuilderComponent {
  private seo = inject(SeoService);

  gameStarted = signal(false);
  currentIndex = signal(0);
  selectedIndex = signal<number | null>(null);
  answered = signal(false);
  score = signal(0);

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

  currentScenario = computed<Scenario>(() => this.scenarios[this.currentIndex()]);
  gameEnded = computed<boolean>(() => this.gameStarted() && this.currentIndex() >= this.scenarios.length);

  resultEmoji = computed<string>(() => {
    const pct = this.score() / this.scenarios.length;
    if (pct === 1) return '\u{1F947}';
    if (pct >= 0.8) return '\u{1F510}';
    if (pct >= 0.5) return '\u{1F4DA}';
    return '\u{1F50D}';
  });

  resultHeadline = computed<string>(() => {
    const pct = this.score() / this.scenarios.length;
    if (pct === 1) return 'Trust domain hardened. Flawless run.';
    if (pct >= 0.8) return 'You design Zero Trust like an operator.';
    if (pct >= 0.5) return 'Solid foundation — refine the rough edges.';
    return 'Time to dig into the SPIFFE/SPIRE fundamentals.';
  });

  resultMessage = computed<string>(() => {
    const pct = this.score() / this.scenarios.length;
    if (pct === 1) {
      return 'You spotted every Zero Trust design flaw in this run. The free Mastering SPIFFE & SPIRE course goes deeper into multi-cluster architecture, registration entry patterns at scale, and AI-infrastructure identity.';
    }
    if (pct >= 0.8) {
      return 'You read SPIRE configurations like a platform engineer. Brush up on the few you missed in the relevant modules, then deploy a federated trust domain in the labs.';
    }
    if (pct >= 0.5) {
      return 'You know the vocabulary. The structured curriculum walks through each of these scenarios with the labs to actually deploy SPIRE on a real cluster.';
    }
    return 'Most of these scenarios are covered in the first five modules of the Mastering SPIFFE & SPIRE course. Start there — the labs let you reproduce every misconfiguration on a real cluster.';
  });

  startGame() {
    this.gameStarted.set(true);
    this.currentIndex.set(0);
    this.score.set(0);
    this.answered.set(false);
    this.selectedIndex.set(null);
  }

  select(i: number) {
    if (this.answered()) return;
    this.selectedIndex.set(i);
    this.answered.set(true);
    if (this.currentScenario().choices[i].correct) {
      this.score.update(s => s + 1);
    }
  }

  next() {
    this.answered.set(false);
    this.selectedIndex.set(null);
    this.currentIndex.update(i => i + 1);
  }

  restart() {
    this.startGame();
  }

  getChoiceClasses(index: number, isCorrect: boolean): Record<string, boolean> {
    const isAnswered = this.answered();
    const isSelected = this.selectedIndex() === index;
    return {
      'border-border': !isAnswered || (isAnswered && !isSelected && !isCorrect),
      'hover:border-primary': !isAnswered,
      'hover:bg-accent': !isAnswered,
      'border-green-500': isAnswered && isCorrect,
      'bg-green-500/10': isAnswered && isCorrect,
      'border-red-500': isAnswered && isSelected && !isCorrect,
      'bg-red-500/10': isAnswered && isSelected && !isCorrect,
      'opacity-60': isAnswered && !isSelected && !isCorrect,
    };
  }

  getBadgeClasses(index: number, isCorrect: boolean): Record<string, boolean> {
    const isAnswered = this.answered();
    const isSelected = this.selectedIndex() === index;
    return {
      'bg-muted': !isAnswered || (isAnswered && !isSelected && !isCorrect),
      'bg-green-500': isAnswered && isCorrect,
      'bg-red-500': isAnswered && isSelected && !isCorrect,
      'text-white': isAnswered && (isCorrect || (isSelected && !isCorrect)),
    };
  }

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
