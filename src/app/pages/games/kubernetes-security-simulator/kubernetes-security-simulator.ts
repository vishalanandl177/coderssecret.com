import { Component, inject } from '@angular/core';
import { SeoService } from '../../../services/seo.service';
import { ScenarioQuizComponent, Scenario, QuizTheme, QuizIntro, QuizResults, QuizCallToActions } from '../_shared/scenario-quiz';

@Component({
  selector: 'app-kubernetes-security-simulator',
  imports: [ScenarioQuizComponent],
  template: `
    <app-scenario-quiz [scenarios]="scenarios" [theme]="theme" [intro]="intro" [results]="results" [callToActions]="callToActions" />
  `,
})
export class KubernetesSecuritySimulatorComponent {
  private seo = inject(SeoService);

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

  theme: QuizTheme = {
    badgePill: 'bg-orange-500/10 border-orange-500/30 text-orange-500',
    accentText: 'text-orange-500',
    titleGradient: 'from-orange-500 via-amber-500 to-yellow-500',
    numberCircle: 'bg-orange-500/15 text-orange-500',
    startButton: 'bg-orange-500 hover:bg-orange-400 shadow-orange-500/30',
    topicPill: 'bg-orange-500/15 text-orange-500',
    callout: 'border-orange-500/30 bg-orange-500/5',
    calloutTitle: 'text-orange-500',
    resultsBg: 'from-orange-500/10 via-card to-amber-500/10',
  };

  intro: QuizIntro = {
    badge: 'Interactive Security Lab',
    titlePlain: 'Kubernetes Security',
    titleGradient: 'Simulator',
    description: 'Secure a production Kubernetes cluster, scenario by scenario. Each round drops you into a real-world misconfiguration across RBAC, NetworkPolicy, PodSecurity, secrets, namespaces, and image security.',
    steps: [
      'Each scenario shows a real Kubernetes manifest or cluster configuration with a hidden security flaw.',
      'Identify the misconfiguration from four plausible options; the wrong answers explain why they are not the issue.',
      'Read the production explanation, follow the linked lesson, and move to the next scenario.',
      'Score yourself across six rounds covering RBAC, namespace boundaries, network policy, PodSecurity, secrets, and image provenance.',
    ],
    practiceTitle: `What You'll Practice`,
    practiceDescription: 'The simulator covers the core security disciplines every Kubernetes operator needs to be fluent in. Each scenario maps to a real production incident class or a misconfiguration flagged by tools like kube-bench, trivy, and polaris.',
    practiceConcepts: [
      { name: 'RBAC', description: 'Least-privilege roles, bindings, and escalation paths' },
      { name: 'Network Policies', description: 'Default-deny isolation and explicit east-west traffic' },
      { name: 'PodSecurity', description: 'Restricted profile decisions and host escape prevention' },
      { name: 'Secrets', description: 'External stores, CSI projection, and rotation hygiene' },
      { name: 'Namespaces', description: 'Tenant boundaries, quotas, and ownership controls' },
      { name: 'Image Security', description: 'Signing, SBOMs, digest pinning, and provenance' },
    ],
    deeperLine: 'Want to go deeper after the simulation? Open the ',
    deeperLinks: [
      { label: 'Cloud Native Security Engineering course', href: '/courses/cloud-native-security-engineering' },
      { label: 'Kubernetes Security cheatsheet', href: '/cheatsheets/kubernetes-security' },
    ],
    timeMinutes: 10,
    difficulty: 'Hard',
  };

  results: QuizResults = {
    perfect: { headline: 'Cluster secured. Flawless run.', emoji: '1', message: 'You spotted every misconfiguration in this run. The Cloud Native Security Engineering course goes deeper into multi-cluster federation, supply-chain attestation, and runtime detection.' },
    great: { headline: 'Solid operator instincts.', emoji: '2', message: 'You read manifests like a security engineer. Brush up on the few you missed in the relevant lessons, then take on the full course for production-scale scenarios.' },
    good: { headline: 'Good foundation. Refine the rough edges.', emoji: '3', message: 'You know enough to spot the shape of the risk. The structured curriculum covers each scenario in depth with labs that deploy the fixes on a real cluster.' },
    weak: { headline: 'Time to dig into the fundamentals.', emoji: '4', message: 'Most of these scenarios are textbook misconfigurations covered in the first modules of the Cloud Native Security Engineering course. Start there, then run this again.' },
  };

  callToActions: QuizCallToActions = {
    primary: { label: 'Take the full course', href: '/courses/cloud-native-security-engineering' },
    secondary: { label: 'Open Kubernetes security sheet', href: '/cheatsheets/kubernetes-security' },
  };
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
