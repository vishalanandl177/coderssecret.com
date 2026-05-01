import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../../services/seo.service';

interface CommandRow {
  cmd: string;
  desc: string;
  prodNote?: string;
  warning?: string;
}

interface CommandGroup {
  title: string;
  rows: CommandRow[];
}

interface MisconfigPair {
  bad: string;
  good: string;
  why: string;
}

@Component({
  selector: 'app-cheatsheet-kubernetes-security',
  imports: [RouterLink],
  template: `
    <section class="py-12 md:py-16 animate-in fade-in duration-500">
      <div class="container max-w-5xl mx-auto px-6">
        <nav aria-label="Breadcrumb" class="mb-6">
          <ol class="flex items-center gap-1.5 text-sm text-muted-foreground">
            <li><a routerLink="/" class="hover:text-foreground transition-colors">Home</a></li>
            <li class="text-muted-foreground/50">/</li>
            <li><a routerLink="/cheatsheets" class="hover:text-foreground transition-colors">Reference</a></li>
            <li class="text-muted-foreground/50">/</li>
            <li class="text-foreground font-medium" aria-current="page">Kubernetes Security</li>
          </ol>
        </nav>

        <header class="mb-10">
          <div class="flex items-center gap-4 mb-4">
            <span class="text-4xl md:text-5xl" aria-hidden="true">🛡️</span>
            <div>
              <span class="inline-block rounded-full bg-orange-500/10 border border-orange-500/30 px-3 py-0.5 text-[10px] font-bold text-orange-500 uppercase tracking-wider mb-2">Production Reference</span>
              <h1 class="text-3xl md:text-4xl font-extrabold tracking-tight">Kubernetes Security Cheatsheet</h1>
            </div>
          </div>
          <p class="text-base md:text-lg text-muted-foreground leading-relaxed max-w-3xl">
            A production-grade quick reference for securing Kubernetes clusters. Covers RBAC, PodSecurity standards, NetworkPolicies, runtime detection, secrets, image security, and the audit/forensic commands you reach for during an incident — with security context for every entry.
          </p>
        </header>

        <!-- Visual quick-reference: Auth chain -->
        <section class="mb-10" aria-labelledby="auth-chain-heading">
          <h2 id="auth-chain-heading" class="text-xl md:text-2xl font-extrabold tracking-tight mb-3">Kubernetes Authorization Chain</h2>
          <p class="text-sm text-muted-foreground mb-4 leading-relaxed">
            Every API request goes through this chain. Most security misconfigurations are failures at the Authentication or Authorization layer.
          </p>
          <div class="rounded-2xl border border-border/60 bg-card p-6">
            <svg viewBox="0 0 760 130" class="w-full h-auto" role="img" aria-label="Kubernetes API request authorization chain diagram">
              <defs>
                <marker id="kArr" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                  <path d="M0,0 L7,3 L0,6 Z" fill="currentColor" class="text-muted-foreground"/>
                </marker>
              </defs>
              <rect x="10" y="40" width="120" height="50" rx="8" fill="none" stroke="#3b82f6" stroke-width="1.5"/>
              <text x="70" y="60" text-anchor="middle" font-size="11" font-weight="700" fill="#3b82f6">Client</text>
              <text x="70" y="76" text-anchor="middle" font-size="9" fill="currentColor" class="text-muted-foreground">kubectl / SDK</text>

              <line x1="130" y1="65" x2="160" y2="65" stroke="currentColor" class="text-muted-foreground" stroke-width="1.5" marker-end="url(#kArr)"/>

              <rect x="160" y="40" width="120" height="50" rx="8" fill="none" stroke="#a855f7" stroke-width="1.5"/>
              <text x="220" y="60" text-anchor="middle" font-size="11" font-weight="700" fill="#a855f7">Authentication</text>
              <text x="220" y="76" text-anchor="middle" font-size="9" fill="currentColor" class="text-muted-foreground">x509 / OIDC / SA token</text>

              <line x1="280" y1="65" x2="310" y2="65" stroke="currentColor" class="text-muted-foreground" stroke-width="1.5" marker-end="url(#kArr)"/>

              <rect x="310" y="40" width="120" height="50" rx="8" fill="none" stroke="#ec4899" stroke-width="1.5"/>
              <text x="370" y="60" text-anchor="middle" font-size="11" font-weight="700" fill="#ec4899">Authorization</text>
              <text x="370" y="76" text-anchor="middle" font-size="9" fill="currentColor" class="text-muted-foreground">RBAC / ABAC / Webhook</text>

              <line x1="430" y1="65" x2="460" y2="65" stroke="currentColor" class="text-muted-foreground" stroke-width="1.5" marker-end="url(#kArr)"/>

              <rect x="460" y="40" width="120" height="50" rx="8" fill="none" stroke="#f97316" stroke-width="1.5"/>
              <text x="520" y="60" text-anchor="middle" font-size="11" font-weight="700" fill="#f97316">Admission</text>
              <text x="520" y="76" text-anchor="middle" font-size="9" fill="currentColor" class="text-muted-foreground">PodSecurity / OPA / Kyverno</text>

              <line x1="580" y1="65" x2="610" y2="65" stroke="currentColor" class="text-muted-foreground" stroke-width="1.5" marker-end="url(#kArr)"/>

              <rect x="610" y="40" width="120" height="50" rx="8" fill="none" stroke="#22c55e" stroke-width="1.5"/>
              <text x="670" y="60" text-anchor="middle" font-size="11" font-weight="700" fill="#22c55e">etcd</text>
              <text x="670" y="76" text-anchor="middle" font-size="9" fill="currentColor" class="text-muted-foreground">resource persisted</text>
            </svg>
          </div>
        </section>

        <!-- Sectioned commands -->
        @for (group of groups; track group.title) {
          <section class="mb-10" [attr.aria-labelledby]="'group-' + slugify(group.title)">
            <h2 [id]="'group-' + slugify(group.title)" class="text-xl md:text-2xl font-extrabold tracking-tight mb-4">{{ group.title }}</h2>
            <div class="rounded-2xl border border-border/60 bg-card overflow-hidden">
              <div class="divide-y divide-border/40">
                @for (row of group.rows; track row.cmd) {
                  <div class="px-5 py-4">
                    <div class="flex flex-col md:flex-row md:items-start md:gap-4">
                      <code class="block text-xs md:text-sm font-mono bg-muted px-3 py-2 rounded mb-2 md:mb-0 md:flex-shrink-0 md:max-w-[55%] overflow-x-auto whitespace-pre-wrap break-all">{{ row.cmd }}</code>
                      <span class="text-sm text-muted-foreground md:flex-1">{{ row.desc }}</span>
                    </div>
                    @if (row.prodNote) {
                      <div class="mt-2 rounded-lg border border-blue-500/20 bg-blue-500/5 p-3 text-xs text-foreground/90 leading-relaxed">
                        <strong class="text-blue-500 uppercase tracking-wider text-[10px] font-bold mr-1">Production tip:</strong> {{ row.prodNote }}
                      </div>
                    }
                    @if (row.warning) {
                      <div class="mt-2 rounded-lg border border-red-500/20 bg-red-500/5 p-3 text-xs text-foreground/90 leading-relaxed">
                        <strong class="text-red-500 uppercase tracking-wider text-[10px] font-bold mr-1">Security warning:</strong> {{ row.warning }}
                      </div>
                    }
                  </div>
                }
              </div>
            </div>
          </section>
        }

        <!-- Try it yourself: default-deny NetworkPolicy -->
        <section class="mb-10" aria-labelledby="lab-heading">
          <h2 id="lab-heading" class="text-xl md:text-2xl font-extrabold tracking-tight mb-4">Try It Yourself: Default-Deny NetworkPolicy</h2>
          <p class="text-sm text-muted-foreground mb-4 leading-relaxed">
            Drop this in any namespace. It blocks all ingress and egress; you then add explicit allow rules for the traffic that should exist. This single change shrinks lateral-movement blast radius more than almost any other Kubernetes control.
          </p>
          <div class="rounded-2xl border border-border/60 bg-card overflow-hidden">
            <div class="px-5 py-2 bg-muted/50 border-b border-border/40 text-[10px] font-mono text-muted-foreground uppercase tracking-wider">network-policy-default-deny.yaml</div>
            <pre class="p-5 text-xs md:text-sm font-mono overflow-x-auto leading-relaxed"><code>apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny-all
  namespace: payments
spec:
  podSelector: &#123;&#125;
  policyTypes:
  - Ingress
  - Egress
---
# Then explicitly allow what should be allowed:
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-payments-to-rds
  namespace: payments
spec:
  podSelector:
    matchLabels:
      app: payments-api
  policyTypes:
  - Egress
  egress:
  - to:
    - ipBlock:
        cidr: 10.20.0.0/16  # RDS subnet
    ports:
    - protocol: TCP
      port: 5432</code></pre>
          </div>
        </section>

        <!-- Common Misconfigurations (good vs bad) -->
        <section class="mb-10" aria-labelledby="misconfigs-heading">
          <h2 id="misconfigs-heading" class="text-xl md:text-2xl font-extrabold tracking-tight mb-4">Common Misconfigurations</h2>
          <div class="space-y-5">
            @for (m of misconfigurations; track m.bad) {
              <div class="rounded-2xl border border-border/60 bg-card overflow-hidden">
                <div class="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border/40">
                  <div class="p-5">
                    <div class="flex items-center gap-2 mb-2">
                      <span class="inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-500/15 text-red-500 text-xs font-bold" aria-hidden="true">✕</span>
                      <span class="text-xs font-bold text-red-500 uppercase tracking-wider">Insecure</span>
                    </div>
                    <pre class="text-xs font-mono bg-muted rounded p-3 overflow-x-auto whitespace-pre-wrap break-all leading-relaxed"><code>{{ m.bad }}</code></pre>
                  </div>
                  <div class="p-5">
                    <div class="flex items-center gap-2 mb-2">
                      <span class="inline-flex items-center justify-center w-5 h-5 rounded-full bg-green-500/15 text-green-500 text-xs font-bold" aria-hidden="true">✓</span>
                      <span class="text-xs font-bold text-green-500 uppercase tracking-wider">Hardened</span>
                    </div>
                    <pre class="text-xs font-mono bg-muted rounded p-3 overflow-x-auto whitespace-pre-wrap break-all leading-relaxed"><code>{{ m.good }}</code></pre>
                  </div>
                </div>
                <div class="px-5 py-3 bg-muted/30 border-t border-border/40 text-xs text-muted-foreground leading-relaxed">
                  <strong class="text-foreground">Why:</strong> {{ m.why }}
                </div>
              </div>
            }
          </div>
        </section>

        <!-- Related learning -->
        <section class="mb-10" aria-labelledby="related-heading">
          <h2 id="related-heading" class="text-xl md:text-2xl font-extrabold tracking-tight mb-4">Related Tutorials &amp; Labs</h2>
          <div class="grid md:grid-cols-2 gap-4">
            <a routerLink="/courses/cloud-native-security-engineering" class="group rounded-2xl border border-border/60 bg-card p-5 hover:border-orange-500/40 hover:-translate-y-0.5 transition-all">
              <div class="text-[10px] font-bold uppercase tracking-wider text-orange-500 mb-1">Course · Free</div>
              <h3 class="font-bold mb-1 group-hover:text-primary transition-colors">Cloud Native Security Engineering</h3>
              <p class="text-xs text-muted-foreground leading-relaxed">16 modules, 50+ labs covering every primitive on this cheatsheet from beginner to production.</p>
            </a>
            <a routerLink="/courses/kubernetes-runtime-security" class="group rounded-2xl border border-border/60 bg-card p-5 hover:border-orange-500/40 hover:-translate-y-0.5 transition-all">
              <div class="text-[10px] font-bold uppercase tracking-wider text-orange-500 mb-1">Guide</div>
              <h3 class="font-bold mb-1 group-hover:text-primary transition-colors">Kubernetes Runtime Security</h3>
              <p class="text-xs text-muted-foreground leading-relaxed">Falco, Tetragon, eBPF — detect compromise inside running pods, not just at admission time.</p>
            </a>
            <a routerLink="/games/kubernetes-security-simulator" class="group rounded-2xl border border-border/60 bg-card p-5 hover:border-orange-500/40 hover:-translate-y-0.5 transition-all">
              <div class="text-[10px] font-bold uppercase tracking-wider text-orange-500 mb-1">Interactive Lab</div>
              <h3 class="font-bold mb-1 group-hover:text-primary transition-colors">Kubernetes Security Simulator</h3>
              <p class="text-xs text-muted-foreground leading-relaxed">Six production scenarios. Spot the misconfigurations from this cheatsheet in real manifests.</p>
            </a>
            <a routerLink="/glossary" class="group rounded-2xl border border-border/60 bg-card p-5 hover:border-orange-500/40 hover:-translate-y-0.5 transition-all">
              <div class="text-[10px] font-bold uppercase tracking-wider text-orange-500 mb-1">Reference</div>
              <h3 class="font-bold mb-1 group-hover:text-primary transition-colors">Cloud Native Glossary</h3>
              <p class="text-xs text-muted-foreground leading-relaxed">Quick definitions for SPIFFE, SVID, OPA, Falco, mTLS, and the rest of the cloud-native security vocabulary.</p>
            </a>
          </div>
        </section>

        <div class="mt-8 flex flex-wrap items-center justify-between gap-3 text-sm">
          <a routerLink="/cheatsheets" class="text-muted-foreground hover:text-foreground transition-colors">← All reference sheets</a>
          <a routerLink="/blog" [queryParams]="{tag:'Kubernetes Security'}" class="text-primary hover:underline">Read related tutorials →</a>
        </div>
      </div>
    </section>
  `,
})
export class KubernetesSecurityCheatsheetComponent {
  private seo = inject(SeoService);

  slugify(s: string): string {
    return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }

  groups: CommandGroup[] = [
    {
      title: 'RBAC: Audit & Least Privilege',
      rows: [
        {
          cmd: 'kubectl auth can-i --list',
          desc: 'List every action your current credentials can perform.',
          prodNote: 'Run this as the ServiceAccount your workload uses (kubectl --as=system:serviceaccount:NS:NAME) to verify least-privilege before deploy.',
        },
        {
          cmd: 'kubectl auth can-i create pods --as=alice@example.com -n payments',
          desc: 'Check whether a specific user/SA can perform an action in a namespace.',
        },
        {
          cmd: 'kubectl get clusterrolebinding -o json | jq \'.items[] | select(.roleRef.name=="cluster-admin") | .metadata.name\'',
          desc: 'Find every binding to cluster-admin.',
          warning: 'A surprising number of clusters have human users bound to cluster-admin. Audit these aggressively — cluster-admin is Kubernetes "root."',
        },
        {
          cmd: 'kubectl get rolebinding,clusterrolebinding -A -o wide',
          desc: 'List every RBAC binding cluster-wide.',
        },
        {
          cmd: 'kubectl create role NAME --verb=get,list --resource=pods --dry-run=client -o yaml',
          desc: 'Generate a least-privilege Role YAML to commit.',
          prodNote: 'Always start with the smallest verb set that works. Re-audit on every promotion (staging → prod).',
        },
        {
          cmd: 'kubectl describe clusterrole admin',
          desc: 'Inspect what a built-in ClusterRole grants.',
        },
      ],
    },
    {
      title: 'PodSecurity & SecurityContext',
      rows: [
        {
          cmd: 'kubectl label namespace NS pod-security.kubernetes.io/enforce=restricted',
          desc: 'Enforce the strictest PodSecurity profile on a namespace.',
          prodNote: 'Use enforce / audit / warn modes together: enforce blocks, audit logs, warn shows a deprecation-style message in kubectl output.',
        },
        {
          cmd: 'kubectl get pods -A -o json | jq \'.items[] | select(.spec.containers[].securityContext.privileged==true) | "\\(.metadata.namespace)/\\(.metadata.name)"\'',
          desc: 'Find every privileged container in the cluster.',
          warning: 'Privileged containers can break out to the host. They should be rare and tightly scoped (e.g. kube-system DaemonSets only).',
        },
        {
          cmd: 'kubectl get pods -A -o json | jq \'.items[] | select(.spec.hostPID==true or .spec.hostNetwork==true) | .metadata.name\'',
          desc: 'Find pods sharing host PID/network namespaces.',
        },
        {
          cmd: 'kubectl run debug --image=alpine --rm -it --overrides=\'{"spec":{"securityContext":{"runAsNonRoot":true,"runAsUser":1000,"seccompProfile":{"type":"RuntimeDefault"}}}}\' -- sh',
          desc: 'Spawn a debug pod with a hardened securityContext.',
        },
        {
          cmd: 'kubectl get psa -A',
          desc: 'List PodSecurity admission labels per namespace (if PSA enabled).',
        },
      ],
    },
    {
      title: 'NetworkPolicy: Default-Deny &amp; Egress',
      rows: [
        {
          cmd: 'kubectl get networkpolicy -A',
          desc: 'List all NetworkPolicies cluster-wide.',
          warning: 'A namespace with NO NetworkPolicy is allow-all. Default-deny + explicit allows is the production baseline.',
        },
        {
          cmd: 'kubectl describe networkpolicy NAME -n NS',
          desc: 'See the resolved rules (which podSelectors match, which CIDRs are allowed).',
        },
        {
          cmd: 'kubectl exec -n NS POD -- nc -vz TARGET 443',
          desc: 'Verify a NetworkPolicy from inside a pod (open or blocked).',
          prodNote: 'After applying a default-deny, run this from each microservice to confirm only the intended targets are reachable. Catches typos in label selectors.',
        },
        {
          cmd: 'cilium connectivity test',
          desc: 'Run Cilium\'s built-in policy connectivity test (if Cilium CNI).',
        },
      ],
    },
    {
      title: 'Secrets &amp; Certificate Management',
      rows: [
        {
          cmd: 'kubectl get secrets -A -o json | jq \'.items[] | select(.type=="Opaque") | "\\(.metadata.namespace)/\\(.metadata.name)"\'',
          desc: 'List all custom (non-system) secrets cluster-wide.',
        },
        {
          cmd: 'kubectl get secret NAME -n NS -o jsonpath="&#123;.data.password&#125;" | base64 -d',
          desc: 'Decode a single secret value.',
          warning: 'Anyone with secrets/get RBAC can do this. Audit RBAC for secret access aggressively. Treat it as a credential-extraction action.',
        },
        {
          cmd: 'kubectl get csr',
          desc: 'List CertificateSigningRequests (kubelet, custom certs).',
        },
        {
          cmd: 'kubectl auth can-i get secrets -n NS --as=system:serviceaccount:NS:SA',
          desc: 'Verify a ServiceAccount cannot read secrets it does not own.',
          prodNote: 'Most workloads should NOT be able to read other workloads\' secrets. Default RBAC is too permissive here.',
        },
        {
          cmd: 'kubectl rollout restart deployment/NAME -n NS',
          desc: 'Force pods to re-mount rotated secrets / certs.',
          prodNote: 'Kubernetes does not auto-restart pods when a Secret changes. Use the secret-CSI driver, External Secrets Operator, or restart on rotation.',
        },
      ],
    },
    {
      title: 'Audit, Forensics &amp; Incident Response',
      rows: [
        {
          cmd: 'kubectl get events -A --sort-by=.lastTimestamp',
          desc: 'Recent cluster events (failed pulls, OOMKilled, evictions).',
        },
        {
          cmd: 'kubectl logs -n kube-system pod/kube-apiserver-NODE | grep "audit"',
          desc: 'Tail audit log entries from the API server (if audit logging enabled).',
          prodNote: 'If you do not have audit logging on, you have no forensic trail. Configure --audit-policy-file with at least Metadata level on every prod cluster.',
        },
        {
          cmd: 'kubectl debug -it POD --image=busybox --target=CONTAINER',
          desc: 'Attach an ephemeral debug container to a running pod.',
          warning: 'Ephemeral containers run in the same pod as the target. Restrict via RBAC; treat as a privileged action in production.',
        },
        {
          cmd: 'kubectl get pods -A -o json | jq \'.items[] | select(.status.containerStatuses[]?.restartCount > 5) | .metadata.name\'',
          desc: 'Find pods with high restart counts (often crash-loop / abuse).',
        },
        {
          cmd: 'kubectl top pods -A --sort-by=cpu',
          desc: 'Pods by CPU — finds runaway processes (cryptominers, infinite loops).',
        },
      ],
    },
    {
      title: 'Image Security &amp; Admission',
      rows: [
        {
          cmd: 'kubectl get pods -A -o json | jq \'.items[].spec.containers[].image\' | sort -u',
          desc: 'List every distinct image running in the cluster.',
          prodNote: 'Pipe through `grep -E ":(latest|main|stable)"` to find mutable-tag images that bypass cryptographic provenance.',
        },
        {
          cmd: 'cosign verify --key cosign.pub IMAGE',
          desc: 'Verify a container image signature with Sigstore cosign.',
        },
        {
          cmd: 'syft IMAGE -o spdx-json',
          desc: 'Generate an SBOM for an image (Syft).',
        },
        {
          cmd: 'trivy image --severity CRITICAL,HIGH IMAGE',
          desc: 'Scan an image for known CVEs.',
          prodNote: 'Wire this into CI and gate merges. Re-scan on a schedule for already-deployed images — new CVEs are published daily.',
        },
        {
          cmd: 'kubectl get validatingwebhookconfigurations',
          desc: 'List admission webhooks (Kyverno, OPA Gatekeeper, Connaisseur, etc.).',
        },
      ],
    },
  ];

  misconfigurations: MisconfigPair[] = [
    {
      bad: `# ClusterRoleBinding to cluster-admin
roleRef:
  kind: ClusterRole
  name: cluster-admin`,
      good: `# Namespaced Role with only the verbs you need
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
rules:
- apiGroups: ["apps"]
  resources: ["deployments"]
  verbs: ["get","list","update","patch"]`,
      why: 'Bind humans and ServiceAccounts to scoped, namespaced Roles — never to cluster-admin. cluster-admin is "root" of Kubernetes; one compromised credential becomes total cluster takeover.',
    },
    {
      bad: `# Pod with no securityContext
spec:
  containers:
  - name: app
    image: registry/app:latest`,
      good: `spec:
  containers:
  - name: app
    image: registry/app@sha256:abc...
    securityContext:
      runAsNonRoot: true
      runAsUser: 10001
      readOnlyRootFilesystem: true
      allowPrivilegeEscalation: false
      capabilities:
        drop: ["ALL"]
      seccompProfile:
        type: RuntimeDefault`,
      why: 'PodSecurity "restricted" requires non-root, read-only FS, dropped capabilities, and the default seccomp profile. Pin to a digest, not a tag, so the image cannot be silently rewritten.',
    },
    {
      bad: `# No NetworkPolicy in the namespace
# (Kubernetes default: any pod can talk to any pod)`,
      good: `apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny-all
spec:
  podSelector: {}
  policyTypes: [Ingress, Egress]`,
      why: 'Kubernetes networking is allow-all by default. A default-deny in every namespace, plus explicit allows for known traffic, dramatically shrinks lateral-movement blast radius after a single pod compromise.',
    },
    {
      bad: `# Secret as plaintext env in Deployment
env:
- name: DB_PASSWORD
  value: "Hunter2-Prod-2024!"`,
      good: `env:
- name: DB_PASSWORD
  valueFrom:
    secretKeyRef:
      name: payments-db
      key: password
# ...and ideally projected via the secrets-store CSI driver
# pulling from Vault / AWS Secrets Manager.`,
      why: 'Plaintext secrets in manifests end up in Git history forever. Once leaked, the only fix is rotation — not a revert. Use external secret managers with the secrets-store CSI driver so the credential never touches source control.',
    },
  ];

  constructor() {
    this.seo.update({
      title: 'Kubernetes Security Cheatsheet',
      description: 'Production-grade Kubernetes security reference: RBAC audit, PodSecurity, NetworkPolicy, secrets, image signing, runtime forensics. Commands, YAML examples, and security warnings for every entry.',
      url: '/cheatsheets/kubernetes-security',
      breadcrumbs: [
        { name: 'Home', url: '/' },
        { name: 'Reference', url: '/cheatsheets' },
        { name: 'Kubernetes Security', url: '/cheatsheets/kubernetes-security' },
      ],
    });
  }
}
