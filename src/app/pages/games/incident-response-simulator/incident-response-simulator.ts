import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../../services/seo.service';
import { ScenarioQuizComponent, Scenario, QuizTheme, QuizIntro, QuizResults, QuizCallToActions } from '../_shared/scenario-quiz';

@Component({
  selector: 'app-incident-response-simulator',
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
            <li class="text-foreground font-medium" aria-current="page">Incident Response Simulator</li>
          </ol>
        </nav>

        <app-scenario-quiz [scenarios]="scenarios" [theme]="theme" [intro]="intro" [results]="results" [callToActions]="callToActions" />
      </div>
    </section>
  `,
})
export class IncidentResponseSimulatorComponent {
  private seo = inject(SeoService);

  theme: QuizTheme = {
    badgePill: 'bg-rose-500/10 border-rose-500/30 text-rose-500',
    accentText: 'text-rose-500',
    titleGradient: 'from-rose-500 via-red-500 to-orange-500',
    numberCircle: 'bg-rose-500/15 text-rose-500',
    startButton: 'bg-rose-500 hover:bg-rose-400 shadow-rose-500/30',
    topicPill: 'bg-rose-500/15 text-rose-500',
    callout: 'border-rose-500/30 bg-rose-500/5',
    calloutTitle: 'text-rose-500',
    resultsBg: 'from-rose-500/10 via-card to-red-500/10',
  };

  intro: QuizIntro = {
    badge: 'Runtime Defense Lab',
    titlePlain: 'Incident Response',
    titleGradient: 'Simulator',
    description: 'You are on call. Falco fires, Tetragon blocks a syscall, an audit log raises a flag. Each scenario drops you into the first 60 seconds of an incident — the moment between "alert" and "decision". Triage well, contain fast, write the post-mortem.',
    steps: [
      'Each scenario shows a Falco rule firing, an audit-log line, or a runtime telemetry event from a real cluster.',
      'Choose the right next action — the wrong answers explain why they look reasonable but waste critical time.',
      'Read the production explanation, follow the link to the deeper lesson, and move to the next scenario.',
      'Score yourself across all six rounds — covering shell-in-container, lateral movement, crypto-mining, container drift, audit-log triage, and eBPF-detected fileless attacks.',
    ],
    practiceTitle: `What You'll Practice`,
    practiceDescription: 'The simulator covers the runtime-detection scenarios that show up on every real-world security on-call rotation. Each maps to a real CVE class or post-mortem.',
    practiceConcepts: [
      { name: 'Falco Triage', description: 'Reading rules and the events they fire on' },
      { name: 'Lateral Movement', description: 'ServiceAccount token theft & egress detection' },
      { name: 'Crypto-mining', description: 'Spotting compromised workload telltales' },
      { name: 'Container Drift', description: 'Modified binaries, immutable filesystem violations' },
      { name: 'Audit Logs', description: 'Triaging suspicious K8s API activity' },
      { name: 'eBPF Detection', description: 'Fileless attacks caught at the syscall layer' },
    ],
    deeperLine: 'Want to go deeper after the simulation? Open the ',
    deeperLinks: [
      { label: 'Kubernetes Runtime Security course', href: '/courses/kubernetes-runtime-security' },
      { label: 'Runtime Security cheatsheet', href: '/cheatsheets/runtime-security' },
    ],
    timeMinutes: 15,
    difficulty: 'Hard',
  };

  results: QuizResults = {
    perfect: { headline: 'Cluster contained. Flawless triage.', emoji: '\u{1F947}', message: 'You triaged every event correctly. The Cloud Native Security Engineering course goes deeper into multi-cluster forensics, IR runbooks, and the alert-pipeline design that actually works.' },
    great: { headline: 'On-call instincts are real.', emoji: '\u{1F6A8}', message: 'Strong triage decisions. Brush up on the few you missed, then practice the runtime-security cheatsheet to reinforce the syscall-level detection alphabet.' },
    good: { headline: 'Solid foundation — sharpen the response.', emoji: '\u{1F4DA}', message: 'You know the patterns. The structured curriculum walks through each scenario class with end-to-end labs.' },
    weak: { headline: 'Practice the runbooks before the next page.', emoji: '\u{1F50D}', message: 'These are textbook runtime-security incidents. Start with the Runtime Security cheatsheet and the Kubernetes Runtime Security course, then come back.' },
  };

  callToActions: QuizCallToActions = {
    primary: { label: 'Take the runtime security course', href: '/courses/kubernetes-runtime-security' },
  };

  scenarios: Scenario[] = [
    {
      id: 'falco-shell-in-container',
      topic: 'Falco Triage',
      title: 'A "Shell in container" Falco alert fires',
      briefing: `It's 02:14. Falco fires the rule below for a pod in the "payments" namespace. The pod is a payments-api production replica.`,
      yaml: `Falco rule fired: "Shell spawned in container"
container.name=payments-api-7d9-xqr2k
container.image=registry/payments-api@sha256:e4c2...
proc.name=bash
proc.cmdline="bash -c whoami; id; uname -a"
proc.pname=node
user.name=root
proc.tty=0
priority=WARNING`,
      question: 'What\'s the most appropriate first action?',
      choices: [
        {
          label: 'kubectl exec into the pod and check what bash is doing.',
          correct: false,
          feedback: 'Adding another shell session to the pod adds noise to the timeline and may interfere with attacker activity. Capture state first; do not interact.',
        },
        {
          label: 'Cordon the node, scale the deployment to isolate the affected replica via pod-level NetworkPolicy block, snapshot the filesystem if possible, and capture process tree + open sockets — then preserve and analyse.',
          correct: true,
          feedback: 'Correct. The IR pattern: contain (NetworkPolicy isolation, optionally cordon), preserve (snapshot, process state, sockets), then analyse. Killing the pod first destroys evidence; exec-ing first contaminates evidence. proc.tty=0 + proc.pname=node strongly suggests the API process spawned the shell — likely an injection or template-execution flaw.',
        },
        {
          label: 'kubectl delete pod immediately to stop the attacker.',
          correct: false,
          feedback: 'Deleting the pod loses all forensic evidence and tells the attacker they\'ve been spotted. Containment first, then preservation, then eviction.',
        },
        {
          label: 'Wait 10 minutes — Falco has high false-positive rates, see if the alert recurs.',
          correct: false,
          feedback: 'A "shell in container" alert with proc.pname=node (the application spawned the shell) and `whoami; id; uname -a` (canonical reconnaissance) is high-signal. Don\'t wait.',
        },
      ],
      explanation: 'The contain → preserve → analyse pattern is the SANS / NIST IR baseline applied to cloud-native runtime alerts. Tools that automate the containment step (Tetragon\'s Sigkill action, or K8s NetworkPolicy applied via Kyverno) buy minutes. The reconnaissance command pattern (`whoami; id; uname -a`) is universal post-exploit footprinting — when you see it spawned by an application process, treat it as confirmed compromise until proven otherwise.',
      learnMore: { label: 'Practice runtime triage', href: '/courses/kubernetes-runtime-security' },
    },
    {
      id: 'lateral-sa-token',
      topic: 'Lateral Movement',
      title: 'A workload reads its ServiceAccount token at an unusual time',
      briefing: 'A scheduled Falco rule detects reads of /var/run/secrets/kubernetes.io/serviceaccount/token. A pod that has been running for 6 hours just read its token for the first time. The pod is a third-party log-shipper sidecar.',
      yaml: `Event: open of SA token
container.name=log-shipper-vendor
file.name=/var/run/secrets/kubernetes.io/serviceaccount/token
proc.name=curl
proc.cmdline="curl -sS -H 'Authorization: Bearer ...' https://kubernetes.default.svc/api/v1/namespaces/payments/secrets"

Recent egress (Hubble):
  log-shipper-vendor -> 198.51.100.42:443 (NOT a known destination)`,
      question: 'What does this telemetry indicate?',
      choices: [
        {
          label: 'Routine token rotation — sidecars read tokens every 6 hours.',
          correct: false,
          feedback: 'Projected SA tokens auto-rotate behind the scenes; the application typically reads them once at startup. A first read 6 hours into the pod\'s life — followed by an API call to list secrets and an unknown egress — is not routine.',
        },
        {
          label: 'A compromised log-shipper using its SA token to enumerate secrets in the payments namespace and exfiltrate to an unknown destination — classic lateral movement via supply-chain compromise.',
          correct: true,
          feedback: 'Correct. The pattern is: exec to read the token (an app rarely curls its own token file), API call to list secrets, then egress to an unknown destination. The third-party sidecar likely got compromised upstream. Immediate response: revoke the SA, isolate the pod with a deny-all NetworkPolicy, and audit which secrets exist in the namespace.',
        },
        {
          label: 'Misconfiguration — log-shipper should not have access to the SA token.',
          correct: false,
          feedback: 'Every pod by default has the projected SA token mounted. The fact that the sidecar can read it isn\'t a misconfig — it\'s the active use of the token to enumerate secrets that\'s the problem. (You can disable automount with `automountServiceAccountToken: false` for sidecars that don\'t need it — recommended hardening.)',
        },
        {
          label: 'Falco false positive — curl is part of the log-shipper\'s health probe.',
          correct: false,
          feedback: 'Health probes call internal endpoints, not /api/v1/namespaces/.../secrets. The API path is the smoking gun.',
        },
      ],
      explanation: 'Third-party sidecars are a common lateral-movement vector — a compromised npm package, base image, or build pipeline can ship a malicious binary that uses the pod\'s SA token to scope creep. Hardening: set `automountServiceAccountToken: false` on every workload that doesn\'t call the K8s API, and restrict API access via NetworkPolicy. Detection: combine Falco file-read events with eBPF/Hubble flow data — neither alone tells the full story.',
      learnMore: { label: 'Lock down service accounts', href: '/courses/cloud-native-security-engineering/secrets-management-machine-identity' },
    },
    {
      id: 'crypto-miner-indicators',
      topic: 'Crypto-mining',
      title: 'CPU pinned at 100% across multiple replicas',
      briefing: 'CloudWatch alerts on sustained 100% CPU across 4 of 6 replicas of a marketing-cms deployment. It is not a known traffic event. eBPF process telemetry shows:',
      yaml: `Hubble + Tetragon process events on affected pods:
proc.name=xmrig
proc.cmdline="xmrig -o pool.minexmr.com:443 -u 4xxxxxxxxxxxx --tls"
parent_proc.name=php-fpm

Egress connections:
  marketing-cms-* -> pool.minexmr.com:443
  marketing-cms-* -> 192.0.2.55:8080 (C2 callback?)`,
      question: 'What is the right immediate response?',
      choices: [
        {
          label: 'Scale the deployment to 0 replicas — kills the miner and stops the cost bleed.',
          correct: false,
          feedback: 'Scaling to 0 destroys evidence and tells the attacker they\'ve been detected. Worse, the persistence (likely a scheduled job, sidecar, or a build artefact) will reactivate when the deployment scales back up. Containment first, eviction second.',
        },
        {
          label: 'Apply a default-deny NetworkPolicy + cordon affected nodes, snapshot pod filesystems for forensics, then identify the persistence point (image, init script, scheduled job) before redeploying clean replicas.',
          correct: true,
          feedback: 'Correct. The pattern: (1) deny network egress immediately to stop active mining and C2; (2) preserve evidence; (3) identify persistence (this miner came from somewhere — check the image, init containers, ConfigMaps, scheduled jobs); (4) redeploy clean only after persistence is identified, otherwise the next deploy reintroduces the miner.',
        },
        {
          label: 'Create a CronJob to kill xmrig every minute via kubectl exec.',
          correct: false,
          feedback: 'Whack-a-mole. Doesn\'t address persistence, doesn\'t contain egress, and turns into a perpetual runaway problem. Treat the root cause (where xmrig came from), not the symptom.',
        },
        {
          label: 'Increase node CPU limits — this is just a misconfigured workload.',
          correct: false,
          feedback: 'xmrig with the minexmr.com pool URL is unambiguously a Monero miner. This is not a config issue.',
        },
      ],
      explanation: 'Crypto-miners are typically delivered via supply-chain attacks (compromised base images, malicious npm packages with postinstall hooks) or RCE-to-persistence chains. The php-fpm parent process here suggests an RCE in the marketing CMS that wrote xmrig to /tmp and exec\'d it. Long-term fixes: read-only root filesystem, NetworkPolicy default-deny egress, image signing with cosign, and SBOM scanning to catch the entry point.',
      learnMore: { label: 'Detection engineering for runtime', href: '/courses/cloud-native-security-engineering/runtime-security-threat-detection' },
    },
    {
      id: 'container-drift',
      topic: 'Container Drift',
      title: 'Tetragon detects writes to /usr/bin in a "read-only" workload',
      briefing: 'Your platform standard is `readOnlyRootFilesystem: true` on all workloads. Tetragon fires on a pod that should match that standard.',
      yaml: `Tetragon TracingPolicy event:
process_kprobe: { function: security_path_mknod }
container.image=registry/orders-api@sha256:abc...
container.name=orders-api
proc.name=cp
proc.args=["/tmp/sshd-impersonator", "/usr/bin/sshd"]
verdict: ALLOWED  # action was Audit, not Sigkill

Pod spec (current):
  securityContext:
    readOnlyRootFilesystem: false  # <-- expected: true`,
      question: 'What is the actual problem here?',
      choices: [
        {
          label: 'Tetragon is too aggressive — /usr/bin writes are normal for application updates.',
          correct: false,
          feedback: 'Production workloads should never write to /usr/bin at runtime. This is a textbook persistence attempt — replacing or planting a system binary so the attacker survives pod restarts on this image.',
        },
        {
          label: 'The pod was deployed without `readOnlyRootFilesystem: true`, so the standard wasn\'t enforced. The attacker exploited that to plant a binary at /usr/bin/sshd. The Tetragon policy was set to Audit instead of Sigkill, so the write succeeded.',
          correct: true,
          feedback: 'Correct. Two layers failed: (1) admission (PodSecurity / Kyverno should have rejected the pod for not having readOnlyRootFilesystem: true), and (2) runtime (Tetragon was in Audit mode rather than enforcement). Either layer would have stopped the persistence. Both layers failing means a compromised binary is now part of this pod\'s image at runtime.',
        },
        {
          label: 'A legitimate application update — log it but don\'t alert.',
          correct: false,
          feedback: 'Pods should never modify their own /usr/bin. Application updates happen by deploying a new image, not by writing to the running pod\'s root filesystem.',
        },
        {
          label: 'False positive — sshd-impersonator is a sandbox tool, not malicious.',
          correct: false,
          feedback: 'The name itself is a red flag. Real sandboxing tools have known signatures and don\'t rename themselves to impersonate system binaries.',
        },
      ],
      explanation: 'Defence in depth means you don\'t rely on a single layer. PodSecurity admission (or Kyverno/OPA) rejects pods that violate the readOnlyRootFilesystem standard at deploy time. Runtime enforcement (Tetragon Sigkill, or an LSM-backed alternative) blocks the write at the kernel even if a non-compliant pod slips through. Audit-mode rules are useful during rollout but should graduate to enforcement once tuned. The audit→enforce promotion deserves its own change-management process.',
      learnMore: { label: 'Containers & workload security', href: '/courses/cloud-native-security-engineering/containers-workload-security' },
    },
    {
      id: 'audit-log-triage',
      topic: 'Audit Logs',
      title: 'Suspicious kube-apiserver audit entries',
      briefing: 'The platform team\'s daily audit-log review surfaces this pattern. The actor is a ServiceAccount used by a CI deploy bot.',
      yaml: `kube-apiserver audit log (filtered):

22:14:01 verb=create kind=ClusterRoleBinding subjects=[ServiceAccount/ci-deploy/default]
         roleRef.name=cluster-admin
         user.username=system:serviceaccount:ci-deploy:deploy-bot

22:14:14 verb=list kind=Secret namespace=*
         user.username=system:serviceaccount:ci-deploy:deploy-bot

22:14:22 verb=create kind=Pod namespace=kube-system
         object.spec.containers[0].image=alpine
         object.spec.containers[0].command=["/bin/sh","-c","..."]
         object.spec.hostNetwork=true
         user.username=system:serviceaccount:ci-deploy:deploy-bot`,
      question: 'What sequence of events is this audit log telling you?',
      choices: [
        {
          label: 'Routine deployment — the ci-deploy ServiceAccount is used by CI for production rollouts.',
          correct: false,
          feedback: 'Bind to cluster-admin → list every secret → schedule a hostNetwork pod in kube-system is not a deployment pattern. CI deploys apply specific manifests; they don\'t self-elevate.',
        },
        {
          label: 'A token belonging to ci-deploy/deploy-bot was leaked or stolen. The attacker bound it to cluster-admin (privilege escalation), enumerated secrets across all namespaces, then scheduled a hostNetwork pod in kube-system to pivot to the host.',
          correct: true,
          feedback: 'Correct. The audit log tells the entire chain: privilege escalation, secret enumeration, host pivot. The most common entry point for this pattern is a leaked token in a build log, container image layer, or compromised CI runner. Response: revoke the token, rotate every secret enumerated, audit who had access to it, and add Falco/audit-log alerts for ClusterRoleBinding creation by non-platform actors.',
        },
        {
          label: 'A rebound test — the user is verifying their RBAC role.',
          correct: false,
          feedback: 'Verifying RBAC is `kubectl auth can-i`, not creating a ClusterRoleBinding. And listing every secret in every namespace is not a verification step.',
        },
        {
          label: 'Kubernetes auto-elevated the ServiceAccount due to certificate rotation.',
          correct: false,
          feedback: 'Kubernetes never auto-elevates RBAC. Privilege changes are always explicit API calls and always show up in audit logs.',
        },
      ],
      explanation: 'Audit-log triage is the most underrated security capability in Kubernetes. Set audit policy to log at "RequestResponse" level for sensitive verbs (RBAC mutations, Secret reads, hostNetwork/privileged pods). Pipe to a long-term store (S3 + Athena, Elasticsearch, BigQuery), and write standing queries: "any ClusterRoleBinding to cluster-admin not by the platform team", "any pod created with hostNetwork or privileged outside the allowed namespaces", "any secret read by a non-allowlisted SA". These queries find compromise before runtime alerts do.',
      learnMore: { label: 'Audit & observability for security', href: '/courses/cloud-native-security-engineering/observability-security-monitoring' },
    },
    {
      id: 'ebpf-fileless',
      topic: 'eBPF Detection',
      title: 'eBPF detects a fileless attack: process exec from anonymous memory',
      briefing: 'A new bpftrace rule fires for the first time: "process executing from memfd-created anonymous memory (no file backing)".',
      yaml: `bpftrace event:
event=execve
proc.exe_path=/proc/self/fd/3  (fd points to memfd)
proc.exe_was_memfd_created=true
container.image=registry/payments-api@sha256:e4c2...
parent_proc.name=node

# The binary at fd 3 has no on-disk presence.
# Falco file-write rules did NOT fire (nothing was written to disk).
# This pod also showed the "shell in container" alert from scenario 1.`,
      question: 'Why does this technique evade traditional file-based detection?',
      choices: [
        {
          label: 'memfd_create() lets a process create a file in RAM that has no on-disk presence. The attacker downloads or writes a binary into the memfd and exec\'s it — file-write and image-scan-based detection see nothing because nothing was ever written to disk.',
          correct: true,
          feedback: 'Correct. memfd is a Linux primitive originally designed for IPC and dynamic libraries. Attackers use it to evade file-integrity monitoring and disk-based AV. eBPF / Tetragon / Falco modern eBPF can detect it because the syscall layer (execve from anonymous fd) is observable even when the filesystem layer is not. This pattern is documented in MITRE ATT&CK T1620 (Reflective Code Loading).',
        },
        {
          label: 'memfd_create() is a Kubernetes feature that bypasses container isolation by design.',
          correct: false,
          feedback: 'memfd_create() is a Linux kernel call, not Kubernetes-specific. Container isolation works the same regardless. The detection challenge is on the security tooling side, not the runtime.',
        },
        {
          label: 'The Linux kernel doesn\'t track memfd processes — they\'re invisible to the OS.',
          correct: false,
          feedback: 'They\'re absolutely tracked. The kernel provides them and tools (eBPF/Tetragon) can observe them. The reason they evade detection is that *some* detection tools only watch on-disk file events.',
        },
        {
          label: 'The pod has hostPID enabled and is running on the host network.',
          correct: false,
          feedback: 'No info in the event indicates hostPID/hostNetwork. The technique works in a fully-isolated container.',
        },
      ],
      explanation: 'Fileless attacks via memfd are the canonical example of why "image scanning + file-write detection" is necessary but not sufficient. Modern runtime security needs syscall-level visibility (eBPF / Tetragon / Falco modern eBPF driver) to catch in-memory execution, reflective loading, and process injection. Build a baseline rule: "exec from anonymous memory in production workloads is always alert-worthy" — legitimate applications almost never do it.',
      learnMore: { label: 'eBPF-era detection engineering', href: '/courses/kubernetes-runtime-security' },
    },
  ];

  constructor() {
    this.seo.update({
      title: 'Incident Response Simulator',
      description: 'Interactive runtime-security incident response simulator: triage Falco alerts, lateral movement, crypto-miners, container drift, audit-log compromise, and eBPF-detected fileless attacks across 6 production scenarios. Free, no signup.',
      url: '/games/incident-response-simulator',
      breadcrumbs: [
        { name: 'Home', url: '/' },
        { name: 'Security Simulators', url: '/games' },
        { name: 'Incident Response Simulator', url: '/games/incident-response-simulator' },
      ],
    });
  }
}
