import { Component, inject } from '@angular/core';
import { SeoService } from '../../../services/seo.service';
import { CheatsheetHeader, CheatsheetPageComponent, CommandGroup, MisconfigPair, RelatedLink } from '../_shared/cheatsheet-page';

@Component({
  selector: 'app-cheatsheet-kubernetes-security',
  imports: [CheatsheetPageComponent],
  template: `
    <app-cheatsheet-page [header]="header" [groups]="groups" [misconfigPairs]="misconfigurations" [relatedLinks]="related">
      <section slot="diagram" class="mb-10" aria-labelledby="auth-chain-heading">
        <div class="md3-learning-section-heading">
          <span class="md3-learning-eyebrow">Request path</span>
          <h2 id="auth-chain-heading">Kubernetes Authorization Chain</h2>
          <p>Every API request goes through this chain. Most security misconfigurations are failures at the authentication, authorization, or admission layer.</p>
        </div>
        <div class="md3-learning-card">
          <svg viewBox="0 0 760 130" class="w-full h-auto" role="img" aria-label="Kubernetes API request authorization chain diagram">
            <defs>
              <marker id="kArr" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                <path d="M0,0 L7,3 L0,6 Z" fill="currentColor" class="text-muted-foreground"/>
              </marker>
            </defs>
            <rect x="10" y="40" width="120" height="50" rx="16" fill="none" stroke="currentColor" stroke-width="1.5"/>
            <text x="70" y="60" text-anchor="middle" font-size="11" font-weight="700" fill="currentColor">Client</text>
            <text x="70" y="76" text-anchor="middle" font-size="9" fill="currentColor">kubectl / SDK</text>
            <line x1="130" y1="65" x2="160" y2="65" stroke="currentColor" stroke-width="1.5" marker-end="url(#kArr)"/>
            <rect x="160" y="40" width="120" height="50" rx="16" fill="none" stroke="currentColor" stroke-width="1.5"/>
            <text x="220" y="60" text-anchor="middle" font-size="11" font-weight="700" fill="currentColor">Authentication</text>
            <text x="220" y="76" text-anchor="middle" font-size="9" fill="currentColor">x509 / OIDC / SA</text>
            <line x1="280" y1="65" x2="310" y2="65" stroke="currentColor" stroke-width="1.5" marker-end="url(#kArr)"/>
            <rect x="310" y="40" width="120" height="50" rx="16" fill="none" stroke="currentColor" stroke-width="1.5"/>
            <text x="370" y="60" text-anchor="middle" font-size="11" font-weight="700" fill="currentColor">Authorization</text>
            <text x="370" y="76" text-anchor="middle" font-size="9" fill="currentColor">RBAC / Webhook</text>
            <line x1="430" y1="65" x2="460" y2="65" stroke="currentColor" stroke-width="1.5" marker-end="url(#kArr)"/>
            <rect x="460" y="40" width="120" height="50" rx="16" fill="none" stroke="currentColor" stroke-width="1.5"/>
            <text x="520" y="60" text-anchor="middle" font-size="11" font-weight="700" fill="currentColor">Admission</text>
            <text x="520" y="76" text-anchor="middle" font-size="9" fill="currentColor">PSA / OPA</text>
            <line x1="580" y1="65" x2="610" y2="65" stroke="currentColor" stroke-width="1.5" marker-end="url(#kArr)"/>
            <rect x="610" y="40" width="120" height="50" rx="16" fill="none" stroke="currentColor" stroke-width="1.5"/>
            <text x="670" y="60" text-anchor="middle" font-size="11" font-weight="700" fill="currentColor">etcd</text>
            <text x="670" y="76" text-anchor="middle" font-size="9" fill="currentColor">persisted</text>
          </svg>
        </div>
      </section>

      <section slot="after-commands" class="mt-10" aria-labelledby="lab-heading">
        <div class="md3-learning-section-heading">
          <span class="md3-learning-eyebrow">Try it yourself</span>
          <h2 id="lab-heading">Default-Deny NetworkPolicy</h2>
          <p>Drop this into a namespace to block all ingress and egress, then add explicit allow rules for the traffic that should exist.</p>
        </div>
        <div class="md3-learning-command-card">
          <div class="md3-learning-command-header">
            <h3>network-policy-default-deny.yaml</h3>
            <span class="md3-chip-selected">Blast-radius control</span>
          </div>
          <pre class="md3-learning-code"><code>apiVersion: networking.k8s.io/v1
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
        cidr: 10.20.0.0/16
    ports:
    - protocol: TCP
      port: 5432</code></pre>
        </div>
      </section>
    </app-cheatsheet-page>
  `,
})
export class KubernetesSecurityCheatsheetComponent {
  private seo = inject(SeoService);

  header: CheatsheetHeader = {
    icon: 'K8S',
    iconColor: '',
    badge: 'Production Reference',
    badgeClass: '',
    title: 'Kubernetes Security Cheatsheet',
    intro: 'A production-grade quick reference for securing Kubernetes clusters. Covers RBAC, PodSecurity standards, NetworkPolicies, runtime detection, secrets, image security, and audit or forensic commands with security context for every entry.',
  };

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

  related: RelatedLink[] = [
    {
      label: 'Cloud Native Security Engineering',
      href: '/courses/cloud-native-security-engineering',
      description: 'A free course covering the primitives on this cheatsheet from beginner foundations to production practice.',
    },
    {
      label: 'Kubernetes Security Simulator',
      href: '/games/kubernetes-security-simulator',
      description: 'Practice the decisions from this reference against realistic production security scenarios.',
    },
    {
      label: 'Cloud Native Glossary',
      href: '/glossary',
      description: 'Definitions for SPIFFE, SVID, OPA, Falco, mTLS, and other cloud-native security vocabulary.',
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
