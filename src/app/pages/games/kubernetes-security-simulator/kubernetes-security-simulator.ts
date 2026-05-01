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
  topic: 'RBAC' | 'NetworkPolicy' | 'PodSecurity' | 'Secrets' | 'Namespaces' | 'ImageSecurity';
  title: string;
  briefing: string;
  yaml: string;
  question: string;
  choices: Choice[];
  explanation: string;
  learnMore: { label: string; href: string };
}

@Component({
  selector: 'app-kubernetes-security-simulator',
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
            <li class="text-foreground font-medium" aria-current="page">Kubernetes Security Simulator</li>
          </ol>
        </nav>

        <header class="text-center mb-10">
          <span class="inline-block rounded-full bg-orange-500/10 border border-orange-500/30 px-4 py-1 text-xs font-bold text-orange-500 uppercase tracking-wider mb-4">Interactive Security Lab</span>
          <h1 class="text-3xl md:text-5xl font-extrabold tracking-tight leading-[1.1] mb-4">
            Kubernetes <span class="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 bg-clip-text text-transparent">Security Simulator</span>
          </h1>
          <p class="text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Secure a production Kubernetes cluster, scenario by scenario. Each round drops you into a real-world misconfiguration — RBAC, network policies, PodSecurity, secrets — and asks you to spot the issue before an attacker does.
          </p>
        </header>

        @if (!gameStarted()) {
          <div class="rounded-2xl border border-border/60 bg-card p-6 md:p-10 mb-6">
            <h2 class="text-xl md:text-2xl font-bold mb-4">How the Simulator Works</h2>
            <ul class="space-y-3 text-sm md:text-base text-muted-foreground mb-6">
              <li class="flex items-start gap-3">
                <span class="inline-flex items-center justify-center h-6 w-6 rounded-full bg-orange-500/15 text-orange-500 font-bold text-xs flex-shrink-0 mt-0.5">1</span>
                <span>Each scenario shows a real Kubernetes manifest or cluster configuration with a hidden security flaw.</span>
              </li>
              <li class="flex items-start gap-3">
                <span class="inline-flex items-center justify-center h-6 w-6 rounded-full bg-orange-500/15 text-orange-500 font-bold text-xs flex-shrink-0 mt-0.5">2</span>
                <span>Identify the misconfiguration from four plausible options — the wrong answers explain why they aren't the issue.</span>
              </li>
              <li class="flex items-start gap-3">
                <span class="inline-flex items-center justify-center h-6 w-6 rounded-full bg-orange-500/15 text-orange-500 font-bold text-xs flex-shrink-0 mt-0.5">3</span>
                <span>Read the explanation, follow the link to the relevant lesson, and move to the next scenario.</span>
              </li>
              <li class="flex items-start gap-3">
                <span class="inline-flex items-center justify-center h-6 w-6 rounded-full bg-orange-500/15 text-orange-500 font-bold text-xs flex-shrink-0 mt-0.5">4</span>
                <span>Score yourself across all six rounds — covering RBAC, namespaces, network policies, PodSecurity, secrets, and image security.</span>
              </li>
            </ul>

            <div class="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
              <div class="rounded-lg bg-accent/40 p-3 text-center">
                <div class="text-2xl font-extrabold">{{ scenarios.length }}</div>
                <div class="text-[10px] text-muted-foreground uppercase tracking-wider">Scenarios</div>
              </div>
              <div class="rounded-lg bg-accent/40 p-3 text-center">
                <div class="text-2xl font-extrabold">~10</div>
                <div class="text-[10px] text-muted-foreground uppercase tracking-wider">Minutes</div>
              </div>
              <div class="rounded-lg bg-accent/40 p-3 text-center col-span-2 md:col-span-1">
                <div class="text-2xl font-extrabold">Hard</div>
                <div class="text-[10px] text-muted-foreground uppercase tracking-wider">Difficulty</div>
              </div>
            </div>

            <button (click)="startGame()" class="w-full md:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-orange-500 hover:bg-orange-400 text-white font-bold px-7 py-3.5 text-sm shadow-lg shadow-orange-500/30 hover:shadow-xl hover:-translate-y-0.5 transition-all">
              Start Simulation
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </button>
          </div>

          <div class="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm p-6 md:p-8">
            <h2 class="text-lg md:text-xl font-bold mb-3">What You'll Practice</h2>
            <p class="text-sm text-muted-foreground leading-relaxed mb-5">
              The simulator covers the core security disciplines every Kubernetes operator needs to be fluent in. Each scenario maps to a real CVE class, a real production incident, or a misconfiguration class flagged by tools like <code class="text-xs bg-muted px-1.5 py-0.5 rounded">kube-bench</code>, <code class="text-xs bg-muted px-1.5 py-0.5 rounded">trivy</code>, and <code class="text-xs bg-muted px-1.5 py-0.5 rounded">polaris</code>.
            </p>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
              <div class="rounded-lg border border-border/40 bg-card p-3"><strong class="text-foreground">RBAC</strong><p class="text-muted-foreground mt-0.5">Least-privilege roles &amp; bindings</p></div>
              <div class="rounded-lg border border-border/40 bg-card p-3"><strong class="text-foreground">Network Policies</strong><p class="text-muted-foreground mt-0.5">East-west traffic isolation</p></div>
              <div class="rounded-lg border border-border/40 bg-card p-3"><strong class="text-foreground">PodSecurity</strong><p class="text-muted-foreground mt-0.5">Restricted &amp; baseline standards</p></div>
              <div class="rounded-lg border border-border/40 bg-card p-3"><strong class="text-foreground">Secrets</strong><p class="text-muted-foreground mt-0.5">CSI drivers &amp; secret rotation</p></div>
              <div class="rounded-lg border border-border/40 bg-card p-3"><strong class="text-foreground">Namespaces</strong><p class="text-muted-foreground mt-0.5">Tenant boundaries &amp; quotas</p></div>
              <div class="rounded-lg border border-border/40 bg-card p-3"><strong class="text-foreground">Image Security</strong><p class="text-muted-foreground mt-0.5">Signing, SBOM &amp; provenance</p></div>
            </div>
            <p class="mt-5 text-xs text-muted-foreground">
              Want to go deeper after the simulation? Take the free
              <a routerLink="/courses/cloud-native-security-engineering" class="text-primary underline">Cloud Native Security Engineering</a> course or the
              <a routerLink="/courses/kubernetes-runtime-security" class="text-primary underline">Kubernetes Runtime Security</a> guide.
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
              <div class="h-full bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 transition-all duration-500"
                   [style.width.%]="((currentIndex() + (answered() ? 1 : 0)) / scenarios.length) * 100"></div>
            </div>

            <div class="flex flex-wrap items-center gap-2 mb-4">
              <span class="inline-flex items-center rounded-full bg-orange-500/15 text-orange-500 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
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
              <div class="mt-6 rounded-xl border border-orange-500/30 bg-orange-500/5 p-5">
                <h3 class="text-sm font-bold mb-2 text-orange-500 uppercase tracking-wider">What actually happens in production</h3>
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
          <div class="rounded-2xl border border-border/60 bg-gradient-to-br from-orange-500/10 via-card to-amber-500/10 p-8 md:p-12 text-center">
            <div class="text-6xl mb-4" aria-hidden="true">{{ resultEmoji() }}</div>
            <h2 class="text-2xl md:text-3xl font-extrabold tracking-tight mb-3">{{ resultHeadline() }}</h2>
            <p class="text-lg text-muted-foreground mb-2">You scored</p>
            <div class="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 bg-clip-text text-transparent mb-3">
              {{ score() }} / {{ scenarios.length }}
            </div>
            <p class="text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed mb-8">
              {{ resultMessage() }}
            </p>
            <div class="flex flex-wrap justify-center gap-3">
              <button (click)="restart()" class="inline-flex items-center gap-2 rounded-full bg-orange-500 hover:bg-orange-400 text-white font-bold px-6 py-3 text-sm shadow-lg shadow-orange-500/30 hover:-translate-y-0.5 transition-all">
                Play again
              </button>
              <a routerLink="/courses/cloud-native-security-engineering" class="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-6 py-3 text-sm font-semibold text-foreground hover:bg-accent transition-all">
                Take the full course
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
export class KubernetesSecuritySimulatorComponent {
  private seo = inject(SeoService);

  gameStarted = signal(false);
  currentIndex = signal(0);
  selectedIndex = signal<number | null>(null);
  answered = signal(false);
  score = signal(0);

  scenarios: Scenario[] = [
    {
      id: 'rbac-cluster-admin',
      topic: 'RBAC',
      title: 'A developer asks for access to deploy to one namespace',
      briefing: `A new backend engineer joined the team. Their tech lead opens a PR adding the following ClusterRoleBinding so they can deploy to the "payments" namespace. CI is green. Approve or reject?`,
      yaml: `apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: dev-payments-deploy
subjects:
- kind: User
  name: alice@example.com
  apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: ClusterRole
  name: cluster-admin
  apiGroup: rbac.authorization.k8s.io`,
      question: 'What is the security issue?',
      choices: [
        {
          label: 'The User subject should be a ServiceAccount instead.',
          correct: false,
          feedback: 'Users are valid RBAC subjects for human operators. The actual issue is the role being granted.',
        },
        {
          label: 'A ClusterRoleBinding to cluster-admin grants global superuser access — Alice can read every secret and delete every workload across all namespaces.',
          correct: true,
          feedback: 'Exactly. The intent was scoped namespace deploy access, but cluster-admin is the "root" of Kubernetes. The fix is a namespaced RoleBinding to a Role with only deployment-related verbs.',
        },
        {
          label: 'The apiGroup field is wrong; it should be "apps" for Deployments.',
          correct: false,
          feedback: 'apiGroup on subjects/roleRef refers to the RBAC API itself, not workload kinds. This field is correct.',
        },
        {
          label: 'The binding is missing a labelSelector and so it cannot be enforced.',
          correct: false,
          feedback: 'RBAC bindings do not use labelSelectors. The Kubernetes API server enforces them by name.',
        },
      ],
      explanation: 'Granting cluster-admin to a single developer is one of the most common privilege-escalation paths into a cluster. Real-world incidents (including the 2022 Argo CD CVE-2022-24348 exploitation patterns) chain "developer with too much access" into total cluster takeover. Always scope: namespaced Role + RoleBinding, with verbs limited to what the workflow actually needs.',
      learnMore: { label: 'Learn Kubernetes RBAC properly', href: '/courses/cloud-native-security-engineering/kubernetes-authentication-authorization' },
    },
    {
      id: 'pod-security-privileged',
      topic: 'PodSecurity',
      title: 'A "monitoring agent" needs to read host metrics',
      briefing: 'A vendor-supplied monitoring DaemonSet needs to read CPU and memory stats from the underlying node. The pod spec includes the configuration below.',
      yaml: `apiVersion: v1
kind: Pod
metadata:
  name: vendor-metrics-agent
spec:
  hostPID: true
  hostNetwork: true
  containers:
  - name: agent
    image: vendor/metrics:latest
    securityContext:
      privileged: true
      runAsUser: 0`,
      question: 'Which choice describes the most serious risk?',
      choices: [
        {
          label: 'image: vendor/metrics:latest should pin to a digest, but otherwise the spec is fine.',
          correct: false,
          feedback: 'Pinning to a digest is good hygiene, but it is not the most serious issue here.',
        },
        {
          label: 'A single compromise of this container becomes a node compromise: privileged + hostPID + hostNetwork + runAsUser 0 effectively gives the container root on the host.',
          correct: true,
          feedback: 'Correct. Privileged drops all isolation, hostPID lets it see/kill any process on the node, hostNetwork joins the host network namespace, and runAsUser 0 makes the container UID equal to host root. Any RCE in the agent equals node compromise.',
        },
        {
          label: 'The Pod is missing a livenessProbe and could deadlock under memory pressure.',
          correct: false,
          feedback: 'Liveness probes are good practice but not the security issue.',
        },
        {
          label: 'hostNetwork: true blocks the cluster DNS service from resolving names.',
          correct: false,
          feedback: 'hostNetwork does change DNS resolution for the pod, but DNS is a functional concern — the security risk is the privilege escalation surface.',
        },
      ],
      explanation: 'Most modern monitoring agents (Falco, kube-state-metrics, the Prometheus node-exporter) use specific Linux capabilities and read-only host mounts — not full privileged mode. The PodSecurity "restricted" profile rejects this manifest by design. Vendor sprawl is one of the top sources of node-level compromise; treat any pod spec with privileged + hostPID + hostNetwork as a critical change.',
      learnMore: { label: 'Master container & workload security', href: '/courses/cloud-native-security-engineering/containers-workload-security' },
    },
    {
      id: 'network-policy-default-allow',
      topic: 'NetworkPolicy',
      title: 'Production has zero NetworkPolicies',
      briefing: `You inherit a cluster with 80 services across 6 namespaces and zero NetworkPolicy resources. The platform team says "we'll add them when we need to."`,
      yaml: `# kubectl get networkpolicy -A
# No resources found.

# Cluster CNI: Calico
# Default behavior with no NetworkPolicy: ALLOW ALL
# (any pod can talk to any pod, in any namespace)`,
      question: `Why is "we'll add them when we need to" the wrong stance?`,
      choices: [
        {
          label: 'Without NetworkPolicies, pods cannot reach the kube-dns service.',
          correct: false,
          feedback: 'kube-dns is reachable by default precisely because there are no NetworkPolicies blocking it. The issue is the opposite.',
        },
        {
          label: 'Kubernetes networking defaults to allow-all, so a single compromised pod has full east-west reach across every namespace — the lateral-movement attack surface is the entire cluster.',
          correct: true,
          feedback: 'Correct. The Kubernetes default is permissive. Without NetworkPolicy, an attacker who lands in any pod can reach every API, every database, every secret-mounting workload across namespaces.',
        },
        {
          label: 'NetworkPolicies are required for the cluster to start scheduling pods.',
          correct: false,
          feedback: 'NetworkPolicies are optional resources; the cluster works without them. The risk is that without them, the network is wide-open.',
        },
        {
          label: 'NetworkPolicies are deprecated in modern Kubernetes; you should be using Cilium ClusterwideNetworkPolicies.',
          correct: false,
          feedback: 'NetworkPolicy is a stable, supported API. Cilium adds richer L7 policies, but the core resource is not deprecated.',
        },
      ],
      explanation: 'A practical baseline: deploy a default-deny NetworkPolicy in every namespace, then add explicit allow rules for the traffic that should exist. Cilium and Calico extend this to L7 (HTTP method/path) once the L3/L4 baseline is in place. This single change shrinks lateral-movement blast radius more than almost any other Kubernetes control.',
      learnMore: { label: 'Build production-grade network policy', href: '/courses/zero-trust-kubernetes' },
    },
    {
      id: 'secret-in-env',
      topic: 'Secrets',
      title: 'Database password sneaks into the Pod manifest',
      briefing: 'A junior developer is debugging connectivity to RDS and pushes the following Deployment to a feature branch. The PR is approved by another junior developer and merged.',
      yaml: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: payments-api
spec:
  template:
    spec:
      containers:
      - name: api
        image: registry/payments-api:1.42
        env:
        - name: DB_HOST
          value: prod-rds.us-east-1.rds.amazonaws.com
        - name: DB_PASSWORD
          value: "Hunter2-Prod-2024!"`,
      question: 'What is the most accurate description of the risk?',
      choices: [
        {
          label: 'The image tag is not pinned to a digest, so the deployment is non-reproducible.',
          correct: false,
          feedback: 'Image digests are good practice but not the primary risk in this manifest.',
        },
        {
          label: `The plaintext production database password is now committed to Git history, visible to anyone with repo access, and replicated to every pod environment — rotation is the only remediation.`,
          correct: true,
          feedback: `Correct. Once a secret is in Git, it is leaked permanently. Even removing the commit doesn't help — you must rotate. Use a Secret + secret CSI driver, or external secret managers (External Secrets Operator, Vault, AWS Secrets Manager).`,
        },
        {
          label: 'The deployment is missing a Service so the pods cannot receive traffic.',
          correct: false,
          feedback: 'Service definition is unrelated to the security issue.',
        },
        {
          label: 'The DB_HOST should be referenced via a ConfigMap, not as a literal value.',
          correct: false,
          feedback: 'Using a ConfigMap is good practice, but the password leak is the immediate problem.',
        },
      ],
      explanation: 'Secrets-in-Git is the most common cause of credential breaches at growing companies. The fix is twofold: (1) immediately rotate the leaked credential, and (2) move secrets out of source control entirely. Most production teams converge on the External Secrets Operator pulling from Vault or a cloud secret manager, with the Kubernetes Secret living only in cluster memory.',
      learnMore: { label: 'Manage secrets & machine identity properly', href: '/courses/cloud-native-security-engineering/secrets-management-machine-identity' },
    },
    {
      id: 'image-mutable-tag',
      topic: 'ImageSecurity',
      title: 'A production image uses a mutable tag',
      briefing: 'You audit the production cluster and find dozens of Deployments referencing image tags like :latest, :v1, or :stable. The platform team argues this makes hot-fix releases easier.',
      yaml: `# kubectl get deploy -A -o jsonpath="{.items[*].spec.template.spec.containers[*].image}"
registry.example.com/payments:latest
registry.example.com/auth:v1
registry.example.com/orders:stable
registry.example.com/web:main
registry.example.com/admin:prod`,
      question: 'What is the production risk — beyond the "latest considered harmful" cliché?',
      choices: [
        {
          label: 'Mutable tags break the kube-apiserver image cache and cause excessive registry pulls.',
          correct: false,
          feedback: 'There is no kube-apiserver image cache. Pulls are handled by the kubelet on each node.',
        },
        {
          label: 'Mutable tags mean different replicas can be running different binaries, supply-chain attestations cannot be verified, and a registry compromise rewrites "production" without any deployment occurring.',
          correct: true,
          feedback: 'Correct. With a mutable tag, an attacker who pushes to the registry instantly poisons every new pod — no Git history, no CI run, no deployment marker. Pin to a digest (@sha256:...) and verify signatures with cosign / Sigstore.',
        },
        {
          label: 'Mutable tags are blocked by default in Kubernetes 1.29+.',
          correct: false,
          feedback: 'There is no such default. Image policy must be enforced explicitly via admission controllers (Kyverno, OPA, Connaisseur).',
        },
        {
          label: 'Mutable tags increase image size and slow down node startup.',
          correct: false,
          feedback: 'Tag mutability has no impact on image size.',
        },
      ],
      explanation: 'The combination that makes images trustworthy is: digest pinning, signature verification, and admission policy. Sigstore + cosign + a Kyverno or OPA policy that rejects unsigned/un-pinned images closes this entire class of supply-chain attack. The 2020 SolarWinds and 2024 xz-utils incidents are textbook reminders of why "trust the registry" is not a security model.',
      learnMore: { label: 'Secure your supply chain & CI/CD', href: '/courses/kubernetes-supply-chain-security' },
    },
    {
      id: 'shared-namespace-tenants',
      topic: 'Namespaces',
      title: 'Two product teams share a namespace',
      briefing: 'To "save resources," the platform team puts the payments and marketing services in the same "apps" namespace. ResourceQuotas and RBAC bindings target the namespace as a whole.',
      yaml: `apiVersion: v1
kind: Namespace
metadata:
  name: apps
---
# 14 Deployments in this namespace:
#   payments-api, payments-worker, payments-cache  (Payments team)
#   marketing-cms, marketing-events, marketing-api (Marketing team)
#   ... and 8 more across both teams ...

# Single ResourceQuota and single Default RoleBinding apply to all 14.`,
      question: 'Why is shared-namespace multi-tenancy a security problem?',
      choices: [
        {
          label: 'Pods in the same namespace cannot use Services to talk to each other.',
          correct: false,
          feedback: 'Service-to-service communication works fine within a namespace; that is not the issue.',
        },
        {
          label: `A namespace is the unit of RBAC, ResourceQuota, NetworkPolicy default, and PodSecurity admission — sharing it means both teams get each other's permissions, secrets are visible across the boundary, and one noisy workload can starve the other.`,
          correct: true,
          feedback: 'Correct. The namespace is the primary tenant boundary in Kubernetes. Anything bound at namespace level (RoleBinding, NetworkPolicy default, quota) leaks across teams when the namespace is shared. Hard multi-tenancy needs separate namespaces (or separate clusters).',
        },
        {
          label: 'Kubernetes only supports up to 10 Deployments per namespace.',
          correct: false,
          feedback: 'There is no such limit; namespaces routinely hold hundreds of resources.',
        },
        {
          label: 'Shared namespaces are blocked by Pod Security Admission.',
          correct: false,
          feedback: 'PodSecurity Admission operates per-namespace and does not block this configuration.',
        },
      ],
      explanation: 'The healthy pattern is one namespace per team or per deployable boundary, with ResourceQuotas, NetworkPolicies, RBAC, and PodSecurity profiles attached at the namespace. For stronger isolation (e.g. PCI scope, regulated workloads), separate clusters are still the gold standard — namespaces are a soft tenancy boundary, not a hard one.',
      learnMore: { label: 'Architect secure multi-tenant clusters', href: '/courses/cloud-native-security-engineering/kubernetes-foundations-security' },
    },
  ];

  currentScenario = computed<Scenario>(() => this.scenarios[this.currentIndex()]);
  gameEnded = computed<boolean>(() => this.gameStarted() && this.currentIndex() >= this.scenarios.length);

  resultEmoji = computed<string>(() => {
    const pct = this.score() / this.scenarios.length;
    if (pct === 1) return '\u{1F947}';
    if (pct >= 0.8) return '\u{1F6E1}\u{FE0F}';
    if (pct >= 0.5) return '\u{1F4DA}';
    return '\u{1F50D}';
  });

  resultHeadline = computed<string>(() => {
    const pct = this.score() / this.scenarios.length;
    if (pct === 1) return 'Cluster secured. Flawless run.';
    if (pct >= 0.8) return 'Solid operator instincts.';
    if (pct >= 0.5) return 'Good foundation — refine the rough edges.';
    return 'Time to dig into the fundamentals.';
  });

  resultMessage = computed<string>(() => {
    const pct = this.score() / this.scenarios.length;
    if (pct === 1) {
      return 'You spotted every misconfiguration in this run. The free Cloud Native Security Engineering course goes deeper into multi-cluster federation, supply-chain attestation, and runtime detection.';
    }
    if (pct >= 0.8) {
      return 'You read manifests like a security engineer. Brush up on the few you missed in the relevant lessons, then take on the full course for production-scale scenarios.';
    }
    if (pct >= 0.5) {
      return 'You know enough to be dangerous. The structured curriculum covers each of these scenarios in depth — with the labs to actually deploy the fixes on a real cluster.';
    }
    return 'Most of these scenarios are textbook misconfigurations covered in the first three modules of the Cloud Native Security Engineering course. Start there — come back and run this again.';
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
      title: 'Kubernetes Security Simulator',
      description: 'Interactive Kubernetes security lab: spot RBAC misconfigurations, network policy gaps, privileged pods, leaked secrets, and supply-chain risks across 6 production scenarios. Free, no signup.',
      url: '/games/kubernetes-security-simulator',
      breadcrumbs: [
        { name: 'Home', url: '/' },
        { name: 'Security Simulators', url: '/games' },
        { name: 'Kubernetes Security Simulator', url: '/games/kubernetes-security-simulator' },
      ],
    });
  }
}
