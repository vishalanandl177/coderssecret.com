import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../../services/seo.service';
import { ScenarioQuizComponent, Scenario, QuizTheme, QuizIntro, QuizResults, QuizCallToActions } from '../_shared/scenario-quiz';

@Component({
  selector: 'app-kubernetes-escape-room',
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
            <li class="text-foreground font-medium" aria-current="page">Kubernetes Escape Room</li>
          </ol>
        </nav>

        <app-scenario-quiz [scenarios]="scenarios" [theme]="theme" [intro]="intro" [results]="results" [callToActions]="callToActions" />
      </div>
    </section>
  `,
})
export class KubernetesEscapeRoomComponent {
  private seo = inject(SeoService);

  theme: QuizTheme = {
    badgePill: 'bg-fuchsia-500/10 border-fuchsia-500/30 text-fuchsia-500',
    accentText: 'text-fuchsia-500',
    titleGradient: 'from-fuchsia-500 via-pink-500 to-rose-500',
    numberCircle: 'bg-fuchsia-500/15 text-fuchsia-500',
    startButton: 'bg-fuchsia-500 hover:bg-fuchsia-400 shadow-fuchsia-500/30',
    topicPill: 'bg-fuchsia-500/15 text-fuchsia-500',
    callout: 'border-fuchsia-500/30 bg-fuchsia-500/5',
    calloutTitle: 'text-fuchsia-500',
    resultsBg: 'from-fuchsia-500/10 via-card to-pink-500/10',
  };

  intro: QuizIntro = {
    badge: 'Adversarial Lab',
    titlePlain: 'Kubernetes',
    titleGradient: 'Escape Room',
    description: 'You have shell access in a low-privilege pod. Solve a chain of misconfigurations — secrets leaks, privilege escalation, container escape — to "escape" the cluster. Then identify which defensive control would have stopped each step.',
    steps: [
      'Each scenario shows a step in an attack chain — what the attacker has access to and what they need next.',
      'Identify the defensive control that would have blocked that step from four plausible options.',
      'Read the production explanation, follow the link to the relevant lesson, and move to the next step.',
      'Score yourself across all six escape steps — covering SA tokens, host-mounts, kernel exploits, etcd, RBAC escalation, and CVE-class vulnerabilities.',
    ],
    practiceTitle: `What You'll Practice`,
    practiceDescription: 'Adversarial reasoning is the strongest skill for defenders. Walk through real container-escape and privilege-escalation chains and identify the single control that closes each one.',
    practiceConcepts: [
      { name: 'SA Tokens', description: 'Projected tokens, automount, audience-bound' },
      { name: 'Host Mounts', description: 'docker.sock, /proc, /var/run/secrets' },
      { name: 'Kernel Exploits', description: 'When pods talk to the kernel directly' },
      { name: 'etcd', description: 'Snapshot exposure & backup security' },
      { name: 'RBAC', description: 'pod/exec → cluster-admin paths' },
      { name: 'CVEs', description: 'Real CVEs and their containment' },
    ],
    deeperLine: 'Want to go deeper after the simulation? Read the ',
    deeperLinks: [
      { label: 'Kubernetes Runtime Security course', href: '/courses/kubernetes-runtime-security' },
      { label: 'Kubernetes Security cheatsheet', href: '/cheatsheets/kubernetes-security' },
    ],
    timeMinutes: 20,
    difficulty: 'Hard',
  };

  results: QuizResults = {
    perfect: { headline: 'Cluster escape blocked. Flawless run.', emoji: '\u{1F947}', message: 'You think like an attacker AND a defender. The Cloud Native Security Engineering course goes deeper into red-team chained-attack scenarios and the defence-in-depth controls that contain them.' },
    great: { headline: 'You spot escape paths fast.', emoji: '\u{1F511}', message: 'Strong adversarial instincts. Brush up on the few you missed and run through the Kubernetes Security cheatsheet to reinforce the hardening checklist.' },
    good: { headline: 'Solid foundation — refine the rough edges.', emoji: '\u{1F4DA}', message: 'You know the patterns. The structured curriculum walks through each escape class with the labs to deploy the fixes.' },
    weak: { headline: 'Time to learn the escape playbook — for defence.', emoji: '\u{1F50D}', message: 'These are the canonical Kubernetes container-escape patterns. Start with the runtime-security and containers-workload-security modules, then come back.' },
  };

  callToActions: QuizCallToActions = {
    primary: { label: 'Take the runtime security course', href: '/courses/kubernetes-runtime-security' },
  };

  scenarios: Scenario[] = [
    {
      id: 'sa-token-recon',
      topic: 'SA Tokens',
      title: 'You have shell in a low-privilege pod. First move?',
      briefing: 'You\'ve compromised an "internal-tools" pod via an SSRF that gave you exec capability. The pod runs as a non-root user. Default Kubernetes setup. Goal: figure out what cluster-level access you have.',
      yaml: `# What an attacker would run first:
$ ls /var/run/secrets/kubernetes.io/serviceaccount/
ca.crt    namespace    token

$ TOKEN=$(cat /var/run/secrets/kubernetes.io/serviceaccount/token)
$ NAMESPACE=$(cat /var/run/secrets/kubernetes.io/serviceaccount/namespace)
$ curl -k -H "Authorization: Bearer $TOKEN" \\
       https://kubernetes.default.svc/api/v1/namespaces/$NAMESPACE/pods
# (returns pod list — leaks namespace topology)

$ kubectl auth can-i --list --token=$TOKEN
# Reveals every API the SA can call`,
      question: 'Which control would have blocked this reconnaissance entirely?',
      choices: [
        {
          label: 'Strong NetworkPolicy: pods can only reach kube-dns.',
          correct: false,
          feedback: 'NetworkPolicy that allows kube-apiserver still allows the SA token reconnaissance. You need to specifically block kube-apiserver access — or remove the SA token from the pod.',
        },
        {
          label: '`automountServiceAccountToken: false` on the pod spec, AND an explicit RoleBinding that grants only what the workload actually needs (likely nothing). With no token mounted, the curl to kube-apiserver fails immediately.',
          correct: true,
          feedback: 'Correct. Most workloads do not need to call the Kubernetes API. Setting automountServiceAccountToken: false removes the projected SA token from the pod entirely — the can-i and pod-list calls fail because there\'s no credential. For the workloads that DO need API access (operators, controllers), use a dedicated SA with a tightly-scoped Role. This single setting closes the most common in-cluster reconnaissance vector.',
        },
        {
          label: 'Falco rule that alerts on /var/run/secrets/kubernetes.io reads.',
          correct: false,
          feedback: 'Detection alerts after the read happens. The control question is what *prevents* the read. Detection is good for response, not prevention.',
        },
        {
          label: 'kube-apiserver on a non-default port.',
          correct: false,
          feedback: 'Security through obscurity. The kubernetes.default.svc DNS works regardless of port; in-cluster discovery is trivial.',
        },
      ],
      explanation: 'The default-mounted Service Account token is the biggest in-cluster reconnaissance and lateral-movement enabler. Most pods don\'t need it, so most pods should set automountServiceAccountToken: false. For pods that genuinely need K8s API access, use a dedicated SA with a Role scoped to only the verbs and resources required. Combine with NetworkPolicy that denies kube-apiserver egress for workloads that shouldn\'t talk to it. This is one of the highest-impact, lowest-effort hardenings in Kubernetes.',
      learnMore: { label: 'Containers & workload security', href: '/courses/cloud-native-security-engineering/containers-workload-security' },
    },
    {
      id: 'docker-sock-mount',
      topic: 'Host Mounts',
      title: 'A "log shipper" pod has docker.sock mounted',
      briefing: 'Reconnaissance shows a pod in the cluster has /var/run/docker.sock mounted. You compromise that pod next via a known CVE. Now you have shell + docker.sock access.',
      yaml: `# Inside the compromised log-shipper pod:
$ ls /var/run/docker.sock
/var/run/docker.sock

$ curl --unix-socket /var/run/docker.sock \\
       http://localhost/containers/json | jq
# (lists all containers on the node)

$ curl --unix-socket /var/run/docker.sock \\
       -X POST -H "Content-Type: application/json" \\
       -d '{"Image":"alpine","HostConfig":{"PidMode":"host","Privileged":true,"Binds":["/:/host"]},"Cmd":["chroot","/host","sh"]}' \\
       http://localhost/containers/create
# Creates a privileged container with the host root mounted.
# chroot /host sh = you're now root on the node.`,
      question: 'Which control would have prevented this escape?',
      choices: [
        {
          label: 'Run the log shipper as a non-root user.',
          correct: false,
          feedback: 'Non-root in the container does NOT prevent docker.sock abuse — the docker daemon runs as root, and docker.sock access is effectively root on the node regardless of who calls the API.',
        },
        {
          label: 'PodSecurity admission "restricted" profile (or Kyverno equivalent) that rejects pods with hostPath mounts of sensitive paths like /var/run/docker.sock.',
          correct: true,
          feedback: 'Correct. Mounting docker.sock (or the kubelet socket /var/lib/kubelet) into a workload pod is effectively granting root on the node. The PodSecurity "restricted" profile rejects most hostPath mounts; combine with a Kyverno policy that explicitly denies mounts of /var/run/docker.sock, /var/run/containerd, and /var/lib/kubelet. The healthy pattern: use Kubernetes-native logging (DaemonSet + filesystem reads of /var/log) instead of docker.sock-based log shipping.',
        },
        {
          label: 'NetworkPolicy that blocks egress from the log shipper.',
          correct: false,
          feedback: 'docker.sock is a Unix socket on the host — NetworkPolicy applies to TCP/UDP traffic, not to filesystem mounts. Doesn\'t help here.',
        },
        {
          label: 'Falco rule for docker.sock writes.',
          correct: false,
          feedback: 'Detection after the fact. PodSecurity admission is the prevention layer.',
        },
      ],
      explanation: 'docker.sock and kubelet socket mounts are the canonical "container escape via misconfiguration" vector. PodSecurity admission (restricted profile) catches it in modern clusters. Older clusters need an explicit Kyverno or OPA policy. The lesson: any pod with hostPath, hostPID, hostNetwork, or privileged should be a tracked, audited exception — not a default. Use eBPF-based logging (Cilium, Tetragon) instead of legacy log-shipper-via-docker.sock patterns.',
      learnMore: { label: 'PodSecurity & host isolation', href: '/courses/cloud-native-security-engineering/containers-workload-security' },
    },
    {
      id: 'host-pid-process-recon',
      topic: 'Host Mounts',
      title: 'A monitoring pod has hostPID + hostNetwork',
      briefing: 'Failing to find docker.sock, you pivot to a monitoring DaemonSet that runs with hostPID: true and hostNetwork: true. You compromise it via a vulnerable Prometheus exporter. Now you can see all processes on the node.',
      yaml: `# Inside the compromised monitoring pod with hostPID:
$ ps aux  # sees ALL processes on the node, not just container

# Find the kubelet's running config:
$ cat /proc/<kubelet-pid>/cmdline
... --kubeconfig=/var/lib/kubelet/kubeconfig --client-ca-file=...

# /proc/<pid>/root/ gives access to other processes' filesystems:
$ ls /proc/<some-other-pod-pid>/root/
# View any other pod's filesystem from this pod`,
      question: 'Which control breaks this attack?',
      choices: [
        {
          label: 'Reject hostPID + hostNetwork at admission. Combine with proper monitoring tools (Prometheus node-exporter uses minimal capabilities; eBPF-based monitors don\'t need hostPID at all). Tetragon and modern Falco use the kernel hook layer, not /proc traversal.',
          correct: true,
          feedback: 'Correct. hostPID + hostNetwork together let a compromised pod see and reach into every other pod on the node. The monitoring use case has moved on: eBPF-based observability (Cilium, Tetragon, Pixie) doesn\'t need hostPID. Reject hostPID/hostNetwork at admission for any pod that doesn\'t demonstrate genuine necessity, and audit those exceptions quarterly. Many vendor-supplied agents request these settings out of habit, not need — push back.',
        },
        {
          label: 'Run the monitoring pod as a non-root user.',
          correct: false,
          feedback: 'hostPID lets non-root users see all PIDs on the node. Doesn\'t solve it.',
        },
        {
          label: 'Use Cilium NetworkPolicy to restrict egress.',
          correct: false,
          feedback: 'Network policy doesn\'t affect /proc filesystem traversal — that\'s local kernel access, not network.',
        },
        {
          label: 'Run Prometheus on a separate node pool.',
          correct: false,
          feedback: 'Doesn\'t solve the problem; just moves it. The compromised monitoring pod still has full visibility on its node.',
        },
      ],
      explanation: 'Modern Kubernetes monitoring should use eBPF-based agents that don\'t need hostPID/hostNetwork. The legacy "mount the host PID namespace and walk /proc" pattern is being replaced by Tetragon, Cilium Hubble, and similar. PodSecurity admission can reject hostPID/hostNetwork by default; allow only specific, audited workloads (CNI agent, kube-proxy itself). The principle: every "host-level access" privilege is a tracked exception with a sunset date and an owner.',
      learnMore: { label: 'Runtime security architecture', href: '/cheatsheets/runtime-security' },
    },
    {
      id: 'etcd-snapshot-exposure',
      topic: 'etcd',
      title: 'A backup S3 bucket leak',
      briefing: 'Reconnaissance reveals an S3 bucket named "company-eks-backups" that\'s readable by anyone with the URL. It contains nightly etcd snapshots.',
      yaml: `$ aws s3 ls s3://company-eks-backups/ --no-sign-request
2024-09-01 03:00:00  etcd-snapshot-2024-09-01.db
2024-09-02 03:00:00  etcd-snapshot-2024-09-02.db
...

$ aws s3 cp s3://company-eks-backups/etcd-snapshot-2024-09-02.db . --no-sign-request
# Now you have the entire cluster state, including:
#   - All Secrets (SA tokens, DB passwords, certificates)
#   - All RBAC bindings (find the cluster-admins)
#   - All ConfigMaps (CI tokens, API keys often live here)`,
      question: 'Which control would have made this snapshot worthless to the attacker?',
      choices: [
        {
          label: 'KMS-based etcd encryption at rest. Etcd Secret values are encrypted with a key that the snapshot does NOT include — the snapshot bytes are useless without the KMS key, which lives in a separate trust domain (AWS KMS, GCP KMS) with its own access controls and audit logs.',
          correct: true,
          feedback: 'Correct. KMS-based encryption at rest for etcd (configurable via the apiserver --encryption-provider-config flag, or natively in EKS / GKE) encrypts Secret values with a KMS-managed key. A leaked snapshot is just ciphertext without KMS access. Combine with: bucket policy that denies public access, bucket KMS encryption (separate key), AWS Macie scans for misclassified data, IAM access logging. Defence in depth at every layer.',
        },
        {
          label: 'Make the S3 bucket private.',
          correct: false,
          feedback: 'Bucket privacy is essential — but it\'s a single layer. KMS encryption protects the data even if the bucket policy is misconfigured (which is how this leaked in the first place).',
        },
        {
          label: 'Encrypt etcd Secrets with sealed-secrets.',
          correct: false,
          feedback: 'Sealed Secrets encrypts the manifest before it goes into etcd; once Kubernetes processes it, the actual Secret value lands in etcd in plaintext (or encrypted by etcd encryption-at-rest, which is the right answer).',
        },
        {
          label: 'Rotate Secrets every 24 hours.',
          correct: false,
          feedback: 'Rotation reduces the validity window of leaked secrets but doesn\'t prevent the leak itself. And rotating every Secret in the cluster every 24 hours is operationally expensive.',
        },
      ],
      explanation: 'KMS-backed etcd encryption at rest is one of the most-skipped Kubernetes hardenings. Self-managed clusters need explicit configuration; managed clusters (EKS, GKE) make it a checkbox but it\'s often left off. Always enable it — Secret leakage from etcd snapshots is a recurring breach vector. Combine with public-access-block on backup buckets, separate KMS keys per cluster, and Macie/CASB scanning of the backup destination.',
      learnMore: { label: 'Multi-cluster security architecture', href: '/courses/cloud-native-security-engineering/multi-cluster-multi-cloud-security' },
    },
    {
      id: 'rbac-pod-exec-escalation',
      topic: 'RBAC',
      title: 'Privilege escalation via pod/exec',
      briefing: 'You\'ve compromised a developer\'s ServiceAccount that has only "list/get/exec on pods in dev namespace". Surprise — that\'s enough to escalate to cluster-admin in many clusters.',
      yaml: `# What you can do with pods/exec in dev:
$ kubectl --token=$TOKEN exec -n dev <some-pod> -- cat /var/run/secrets/kubernetes.io/serviceaccount/token

# Find a pod whose SA has more permissions:
$ kubectl --token=$TOKEN get sa -n dev
$ kubectl --token=$TOKEN get rolebindings,clusterrolebindings -A | grep <sa-name>

# If any pod in dev runs with a more-privileged SA (e.g.
# a deploy controller, helm-runner, or an operator with
# create permission on RBAC objects), exec into it and
# read its token. Then the chain is:
#   pods/exec  -> steal a more-privileged SA token
#              -> use it to create a ClusterRoleBinding
#              -> cluster-admin`,
      question: 'Which control breaks this escalation chain?',
      choices: [
        {
          label: 'Strict separation: no privileged ServiceAccounts run in namespaces where developers have pods/exec. Operators and deploy controllers run in dedicated namespaces (e.g. flux-system, argocd, kube-system) where dev SAs cannot exec. Combine with audit-log alerts on ClusterRoleBinding creation and on cross-namespace exec attempts.',
          correct: true,
          feedback: 'Correct. The pods/exec verb is effectively "be root in any pod in this namespace" — and if any pod in that namespace has a powerful SA, exec\'ing in steals that SA\'s token. The fix is namespace separation: never run cluster-admin-class workloads in namespaces where humans have exec. Plus: an audit-log alert "any new ClusterRoleBinding to cluster-admin not from the platform team" catches the escalation step. Plus: PodSecurity admission restricting pods with privileged SAs to specific namespaces.',
        },
        {
          label: 'Disable kubectl exec entirely.',
          correct: false,
          feedback: 'pods/exec is a useful debugging primitive. Disabling it is heavy-handed; namespace separation is the right granularity.',
        },
        {
          label: 'Require MFA on the developer\'s human user.',
          correct: false,
          feedback: 'MFA protects the human auth — but the attack here is post-auth. The attacker has the developer\'s SA token; MFA doesn\'t apply.',
        },
        {
          label: 'Network policies between dev and other namespaces.',
          correct: false,
          feedback: 'NetworkPolicy controls pod-to-pod traffic; pods/exec is a kube-apiserver verb, not pod-to-pod traffic.',
        },
      ],
      explanation: 'pods/exec → cluster-admin is one of the most-cited privilege-escalation chains in Kubernetes. The attack works because powerful SAs often run in shared namespaces with developer access. Mitigations: (1) namespace separation between operators and developer workloads; (2) PodSecurity admission to restrict where privileged SAs can run; (3) explicit RBAC audit ("which SAs in this namespace can do X cluster-wide?"); (4) audit-log alerting on ClusterRoleBinding creation. Treat pods/exec as a sensitive verb — equivalent to root on the workloads in that namespace.',
      learnMore: { label: 'RBAC & authentication module', href: '/courses/cloud-native-security-engineering/kubernetes-authentication-authorization' },
    },
    {
      id: 'cve-class-vuln',
      topic: 'CVEs',
      title: 'A CVE in a container runtime allows pod escape',
      briefing: 'A CVE drops in your container runtime (e.g. CVE-2022-0492 cgroups, CVE-2024-21626 runc). Active exploit: a malicious image escapes to the host with no special privileges. Your team is scrambling to patch.',
      yaml: `# CVE class: container runtime escape (e.g. CVE-2024-21626 runc)
# - Triggered by the image at runtime
# - Doesn't require privileged: true or host mounts
# - Patch is in containerd/runc; nodes need to be upgraded

# Active exploit timeline:
# T+0:  CVE published
# T+1h: PoC public on GitHub
# T+24h: Mass scanning for vulnerable nodes
# T+72h: Vendor patch in containerd

# What's your defence-in-depth posture in the meantime?`,
      question: 'Which existing controls limit blast radius BEFORE the patch is applied?',
      choices: [
        {
          label: 'Image admission policy that requires Sigstore-signed images from your registry. Combined with PodSecurity restricted, NetworkPolicy default-deny, and runtime detection (Falco/Tetragon for unexpected syscalls), the attack surface for an unsigned malicious image is tiny — they have to compromise your CI to get a signed image.',
          correct: true,
          feedback: 'Correct. Most container-escape CVEs require the attacker to run their crafted image. Image admission (cosign + Kyverno verifyImages with identity allowlist) means an attacker needs to compromise your CI to deploy a malicious image. Then PodSecurity rejects malformed pod specs, NetworkPolicy default-deny limits lateral movement, runtime detection catches the actual escape attempt, and node patching applies the structural fix. No single control is enough; the combination contains the worst case while the patch rolls out.',
        },
        {
          label: 'Stop deploying any images until patch ships.',
          correct: false,
          feedback: 'Halting deploys for 72 hours during an active CVE is operationally painful and rarely actually feasible. Defence in depth means you can keep deploying signed, vetted images while the patch rolls.',
        },
        {
          label: 'Run all workloads as non-root.',
          correct: false,
          feedback: 'Non-root helps for many CVEs but not for runtime-level escapes (some CVEs work specifically against non-root pods). Defence in depth is broader.',
        },
        {
          label: 'Disable network policies temporarily so workloads can\'t reach the internet.',
          correct: false,
          feedback: 'You want MORE network policy, not less. Default-deny egress contains exfiltration.',
        },
      ],
      explanation: 'The lesson of every container-escape CVE: defence in depth is the difference between "we patched a node" and "we suffered a breach". The control stack: image signing (only trusted images run); PodSecurity restricted (malformed specs rejected); NetworkPolicy default-deny (lateral movement contained); workload identity (stolen SAs don\'t survive rotation); runtime detection (escape attempts flagged); and patching cadence (the structural fix). No single control is sufficient; the combination is. Build all of them, and the next CVE is a controlled rollout instead of an incident.',
      learnMore: { label: 'Defense in depth architecture', href: '/courses/cloud-native-security-engineering' },
    },
  ];

  constructor() {
    this.seo.update({
      title: 'Kubernetes Escape Room',
      description: 'Adversarial Kubernetes lab: walk through real container-escape and privilege-escalation chains — SA token recon, docker.sock mounts, hostPID, etcd snapshot leaks, pods/exec → cluster-admin, and CVE defense — and identify the control that breaks each step. Free, no signup.',
      url: '/games/kubernetes-escape-room',
      breadcrumbs: [
        { name: 'Home', url: '/' },
        { name: 'Security Simulators', url: '/games' },
        { name: 'Kubernetes Escape Room', url: '/games/kubernetes-escape-room' },
      ],
    });
  }
}
