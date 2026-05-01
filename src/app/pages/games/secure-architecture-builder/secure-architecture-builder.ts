import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../../services/seo.service';
import { ScenarioQuizComponent, Scenario, QuizTheme, QuizIntro, QuizResults, QuizCallToActions } from '../_shared/scenario-quiz';

@Component({
  selector: 'app-secure-architecture-builder',
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
            <li class="text-foreground font-medium" aria-current="page">Secure Architecture Builder</li>
          </ol>
        </nav>

        <app-scenario-quiz [scenarios]="scenarios" [theme]="theme" [intro]="intro" [results]="results" [callToActions]="callToActions" />
      </div>
    </section>
  `,
})
export class SecureArchitectureBuilderComponent {
  private seo = inject(SeoService);

  theme: QuizTheme = {
    badgePill: 'bg-blue-500/10 border-blue-500/30 text-blue-500',
    accentText: 'text-blue-500',
    titleGradient: 'from-blue-500 via-sky-500 to-cyan-500',
    numberCircle: 'bg-blue-500/15 text-blue-500',
    startButton: 'bg-blue-500 hover:bg-blue-400 shadow-blue-500/30',
    topicPill: 'bg-blue-500/15 text-blue-500',
    callout: 'border-blue-500/30 bg-blue-500/5',
    calloutTitle: 'text-blue-500',
    resultsBg: 'from-blue-500/10 via-card to-sky-500/10',
  };

  intro: QuizIntro = {
    badge: 'Architecture Lab',
    titlePlain: 'Secure Architecture',
    titleGradient: 'Builder',
    description: 'Design production-grade infrastructure with Zero Trust controls baked in. Each scenario presents a real architecture decision — VPC layout, WAF placement, secret stores, region failover — and asks you to pick the design that holds up under attack.',
    steps: [
      'Each scenario shows a system architecture and a specific design question.',
      'Choose the most secure design from four plausible options — the wrong answers explain why they look reasonable but introduce risk.',
      'Read the production explanation, follow the link to the relevant lesson, and move to the next scenario.',
      'Score yourself across all six rounds — covering network segmentation, WAF placement, bastion vs IAM, secret stores, CDN auth, and multi-region resilience.',
    ],
    practiceTitle: `What You'll Practice`,
    practiceDescription: 'Architecture decisions made early are expensive to reverse. The simulator covers the choices that determine whether a system survives its first real attack.',
    practiceConcepts: [
      { name: 'VPC Layout', description: 'Public/private subnets, NAT, peering' },
      { name: 'WAF Placement', description: 'Edge vs origin, ordering with TLS' },
      { name: 'Operator Access', description: 'Bastion vs IAM-managed access' },
      { name: 'Secret Stores', description: 'Vault vs cloud-native vs Parameter Store' },
      { name: 'CDN Auth', description: 'Origin authentication & origin shielding' },
      { name: 'Multi-region', description: 'Failover, split-brain, RPO/RTO design' },
    ],
    deeperLine: 'Want to go deeper after the simulation? Read the ',
    deeperLinks: [
      { label: 'Cloud Native Security Engineering course', href: '/courses/cloud-native-security-engineering' },
      { label: 'Multi-Cluster / Multi-Cloud module', href: '/courses/cloud-native-security-engineering/multi-cluster-multi-cloud-security' },
    ],
    timeMinutes: 20,
    difficulty: 'Hard',
  };

  results: QuizResults = {
    perfect: { headline: 'Architecture hardened. Flawless run.', emoji: '\u{1F947}', message: 'You design like a security architect. The Cloud Native Security Engineering course goes deeper into multi-cloud federation, capacity reservation, and the architecture patterns that scale across regulated industries.' },
    great: { headline: 'You design with attackers in mind.', emoji: '\u{1F3D7}\u{FE0F}', message: 'Strong architectural instincts. Brush up on the few you missed and explore the multi-cluster module for region-scale design.' },
    good: { headline: 'Solid foundation — refine the rough edges.', emoji: '\u{1F4DA}', message: 'You know the patterns. The structured curriculum walks through each architecture class with real production case studies.' },
    weak: { headline: 'Time to dig into architecture fundamentals.', emoji: '\u{1F50D}', message: 'These are foundational design decisions. Start with the introduction and zero-trust modules of the Cloud Native Security Engineering course, then come back.' },
  };

  callToActions: QuizCallToActions = {
    primary: { label: 'Take the security course', href: '/courses/cloud-native-security-engineering' },
  };

  scenarios: Scenario[] = [
    {
      id: 'vpc-layout',
      topic: 'VPC Layout',
      title: 'A new VPC for a payments service',
      briefing: 'You\'re designing the network layout for a new payments service in AWS. Components: a public-facing API (behind a load balancer), an async worker fleet, an RDS Postgres database, an ElastiCache Redis cluster, and an S3 bucket for receipts. Internet egress is needed for some callbacks (Stripe webhooks).',
      yaml: `Components to place:
  - Application LB (public-facing)
  - API tasks (need internet for outbound webhooks)
  - Worker tasks (need internet for outbound webhooks)
  - Postgres (RDS)
  - Redis (ElastiCache)
  - S3 receipts bucket

VPC: 10.0.0.0/16  with 3 AZs.`,
      question: 'Which layout is the most secure baseline?',
      choices: [
        {
          label: 'Single subnet per AZ. Everything (LB, API, workers, RDS, Redis) shares the subnet. Security via security groups only.',
          correct: false,
          feedback: 'Mixing public and private workloads in one subnet means a misconfigured route table or NACL can expose RDS or Redis directly. Network segmentation via subnets is a layer of defence — don\'t skip it.',
        },
        {
          label: 'Three subnet tiers per AZ: PUBLIC (LB only) → PRIVATE (API + workers, with NAT gateway egress) → ISOLATED (RDS, Redis — no internet path). S3 access via VPC Endpoint, not internet. Security groups enforce least-privilege between tiers.',
          correct: true,
          feedback: 'Correct. Three-tier layout with isolated data plane is the standard secure VPC baseline. RDS and Redis have no internet path at all (no NAT, no IGW reachable) — even a misconfigured security group can\'t accidentally expose them. S3 via VPC Endpoint avoids internet egress and gets traffic-policy controls. NAT gateway in the PRIVATE tier handles outbound webhooks. SG rules enforce: LB → API:443; API/workers → RDS:5432, Redis:6379; only API can talk to S3 via the endpoint.',
        },
        {
          label: 'Two subnets: public (LB + API + workers) and private (RDS + Redis). Simpler than three tiers.',
          correct: false,
          feedback: 'Public-facing API and workers in the public subnet means they have direct internet exposure — a misconfigured SG or sidecar can be probed from anywhere. The PRIVATE tier protects compute from inbound internet exposure even if an SG is mis-set.',
        },
        {
          label: 'Single subnet plus a NACL with explicit deny rules between tiers.',
          correct: false,
          feedback: 'NACLs are stateless and order-sensitive. They\'re hard to use as a primary segmentation control. Subnets + security groups (stateful, simpler model) is the conventional answer.',
        },
      ],
      explanation: 'Three-tier VPC layout (public / private / isolated) gives defence in depth — even a misconfigured security group can\'t expose isolated workloads to the internet. VPC Endpoints (Gateway for S3/DynamoDB, Interface for everything else) keep AWS service traffic off the internet entirely. For Kubernetes (EKS), the same principle: nodes and pods in private subnets, public-facing only via the ingress LB. Most cloud security incidents that result from misconfigurations would have been contained by sane network segmentation.',
      learnMore: { label: 'Cloud-native security architecture', href: '/courses/cloud-native-security-engineering' },
    },
    {
      id: 'waf-placement',
      topic: 'WAF Placement',
      title: 'Where does the WAF go?',
      briefing: 'You\'re adding a WAF to your stack. The path is: client → CloudFront CDN → ALB → ECS service. The WAF can be associated with CloudFront, the ALB, or both. Latency budget is tight; engineering capacity is limited.',
      yaml: `Path:
  Client (TLS 1.3)
    -> CloudFront (TLS termination + caching)
    -> ALB (TLS re-encrypt to origin)
    -> ECS service (HTTPS to backend)

Options:
  A: WAF on CloudFront only
  B: WAF on ALB only
  C: WAF on both CloudFront and ALB
  D: No WAF, rely on application-layer validation`,
      question: 'Which placement is most effective?',
      choices: [
        {
          label: 'A — WAF on CloudFront only.',
          correct: false,
          feedback: 'CloudFront WAF is great for blocking edge-evident attacks (volumetric, simple injection patterns) — but doesn\'t protect against attackers who reach the ALB directly via its DNS name. Most ALBs are reachable on the internet by default.',
        },
        {
          label: 'C — WAF on BOTH CloudFront and ALB. CloudFront WAF blocks attacks at the edge (lower latency, less origin load). ALB WAF protects against direct-to-ALB attackers who bypass the CDN. Add a header-based check at the ALB to require requests came through CloudFront — defence in depth.',
          correct: true,
          feedback: 'Correct. Edge-only WAF protects only the edge path; attackers who find the ALB DNS hostname (often discoverable via passive DNS, certificate transparency logs, or subdomain enumeration) bypass CloudFront entirely. The pattern: WAF at edge for volumetric/early blocking, WAF at origin LB for defence in depth, plus a "must come through CloudFront" header check at ALB (CloudFront injects a custom secret header) to prevent direct-to-ALB attacks. This is standard AWS-published architecture.',
        },
        {
          label: 'B — WAF on ALB only.',
          correct: false,
          feedback: 'ALB-only WAF inspects every request after it\'s already reached your origin. Edge filtering offloads volumetric attacks; not having edge WAF means the volumetric load reaches your origin.',
        },
        {
          label: 'D — No WAF; rely on app-layer validation.',
          correct: false,
          feedback: 'WAFs are not a substitute for app-level validation, but they are useful as a coarse first filter — especially for known attack signatures, volumetric, and bot traffic. Skipping WAF leaves easy wins on the table.',
        },
      ],
      explanation: 'WAF is the canonical "defence in depth" example: useful at edge AND origin. Edge WAF (CloudFront, Cloudflare) handles volumetric attacks, geo-blocking, and cheap pattern matching efficiently. Origin WAF (ALB, ingress) catches attacks that bypass the CDN. The "lock down origin to only accept CDN traffic" pattern (custom header secret, or origin shield + IP allowlist) closes the bypass path entirely. Pair with rate limiting at both layers.',
      learnMore: { label: 'API security architecture', href: '/cheatsheets/api-security' },
    },
    {
      id: 'bastion-vs-iam',
      topic: 'Operator Access',
      title: 'How do operators reach private databases?',
      briefing: 'Production RDS sits in an isolated subnet. Operators occasionally need to run psql for incident debugging. Three access patterns are proposed:',
      yaml: `A) SSH bastion in public subnet:
   operator -> SSH bastion (key auth)
            -> SSH tunnel through bastion to RDS

B) AWS SSM Session Manager + IAM auth to RDS:
   operator -> SSM start-session to a private EC2 (or IAM-auth direct to RDS)
            -> psql with --auth=iam (token-based, 15-min expiry)

C) Dedicated VPN concentrator:
   operator -> VPN client into VPC
            -> direct psql with shared password`,
      question: 'Which provides the strongest security posture?',
      choices: [
        {
          label: 'A — SSH bastion. SSH keys are well-understood; bastions log connections.',
          correct: false,
          feedback: 'SSH bastions work but require ongoing operational hygiene (key rotation, host hardening, OS patching, intrusion detection). Lost private keys are a real failure mode. SSM does the same job with less operational burden and stronger audit.',
        },
        {
          label: 'B — SSM Session Manager + IAM auth to RDS. No long-lived passwords; access is gated by IAM (which means MFA, SCP, role-based revocation already work). Sessions are logged to CloudTrail and S3. Database connections use 15-minute IAM tokens — credential leaks are minutes, not months.',
          correct: true,
          feedback: 'Correct. SSM Session Manager removes the SSH host attack surface entirely (no SSH port open, no host keys to manage). IAM auth to RDS replaces shared DB passwords with short-lived tokens. Both integrate with CloudTrail for full session audit. The combined posture: revoke an operator\'s IAM access and they immediately lose all database access — no separate password change, no key rotation, no missed accounts. This is the AWS-native pattern.',
        },
        {
          label: 'C — VPN concentrator. Strong network isolation.',
          correct: false,
          feedback: 'VPN gives network access but doesn\'t solve credential management — once on the VPN, a shared DB password is still a shared DB password. Plus VPN concentrators are themselves attack surface; many real-world breaches start with VPN compromises.',
        },
        {
          label: 'A and B equally — depends on team familiarity.',
          correct: false,
          feedback: 'Tooling familiarity matters but isn\'t a security-architecture answer. SSM + IAM auth has structurally better properties.',
        },
      ],
      explanation: 'Modern cloud-native architectures replace shared infrastructure (bastions, VPN concentrators, shared DB users) with per-operation, identity-based access. AWS SSM Session Manager (or GCP IAP) for shell access; IAM database auth for short-lived DB tokens; OIDC for human auth. The SOC2/PCI-friendly properties — full audit, centralised access management, immediate revocation — are emergent from the architecture, not bolted on. The bastion model is being phased out at most mature security organisations.',
      learnMore: { label: 'Operator access patterns', href: '/courses/cloud-native-security-engineering' },
    },
    {
      id: 'secret-store',
      topic: 'Secret Stores',
      title: 'Where do secrets actually live?',
      briefing: 'Your team needs to manage: (a) database passwords, (b) third-party API keys (Stripe, SendGrid), (c) TLS certificates, (d) per-tenant encryption keys. Workloads run on EKS. Engineering capacity is limited.',
      yaml: `Options:
A) AWS Secrets Manager + Secrets Store CSI Driver (mounts secrets as files in pods)
B) HashiCorp Vault, self-hosted on EKS
C) Kubernetes Secret resources, base64-encoded YAML in Git
D) AWS Parameter Store (Standard tier)`,
      question: 'Which is the right baseline?',
      choices: [
        {
          label: 'C — Kubernetes Secrets in Git. Simplest, version-controlled.',
          correct: false,
          feedback: 'Plain K8s Secrets are base64, not encrypted. Committing them to Git leaks them permanently, regardless of repo permissions. Even with Sealed Secrets / SOPS, you\'re managing crypto by hand.',
        },
        {
          label: 'A — Secrets Manager + Secrets Store CSI. Cloud-managed (no operations burden), encrypted at rest with KMS, integrates with IAM for access control, mounts as files for IRSA-authenticated pods. The right defaults for "we run on AWS, we don\'t want to operate Vault".',
          correct: true,
          feedback: 'Correct. AWS Secrets Manager + the Secrets Store CSI Driver gives you: encryption at rest (KMS), per-secret IAM policies, audit logs (CloudTrail), automatic rotation hooks, and pod-mounted secrets that update on rotation. No operational overhead. Vault is a great fit when you need cross-cloud, dynamic database credentials, or PKI as a service — but it\'s significant ops investment. Parameter Store Standard tier is for config, not secrets (no rotation, smaller size limits, simpler IAM).',
        },
        {
          label: 'B — Self-hosted Vault. Most flexible.',
          correct: false,
          feedback: 'Vault is genuinely powerful (dynamic credentials, PKI engine, multi-cloud). But "self-hosted Vault" means you operate the cluster, the auto-unseal, the storage backend, the auditing — significant ongoing cost. Use Vault when its capabilities (dynamic DB creds, on-demand certs) justify the operational investment.',
        },
        {
          label: 'D — Parameter Store Standard. Free; integrates with IAM.',
          correct: false,
          feedback: 'Parameter Store Standard tier doesn\'t support secret rotation; its SecureString type uses default KMS. Use it for non-rotating config; use Secrets Manager for actual secrets that should rotate.',
        },
      ],
      explanation: 'Choose secret store by capability fit and operational cost. Cloud-native managed services (Secrets Manager, GCP Secret Manager, Azure Key Vault) are the right defaults for most teams — they encrypt at rest, integrate with IAM, log access, and support rotation. The Secrets Store CSI Driver bridges them to Kubernetes pods cleanly with IRSA auth. Vault wins when you need dynamic DB credentials, multi-cloud, or PKI as a service. Avoid plain-text Kubernetes Secrets in Git — even with Sealed Secrets, you\'re managing crypto details that managed services handle for you.',
      learnMore: { label: 'Secrets & machine identity', href: '/courses/cloud-native-security-engineering/secrets-management-machine-identity' },
    },
    {
      id: 'cdn-origin-auth',
      topic: 'CDN Auth',
      title: 'Authenticating origin to CDN',
      briefing: 'You serve static assets via CloudFront from an S3 bucket. The API is served via CloudFront from an ALB. You want to ensure that requests to S3 and ALB only come through CloudFront — direct access should be denied.',
      yaml: `Goals:
- Prevent direct access to S3 bucket (public URL)
- Prevent direct access to ALB (DNS hostname)
- Allow only CloudFront-fronted access`,
      question: 'What\'s the right pair of mechanisms?',
      choices: [
        {
          label: 'For S3: bucket policy that allows access only from a specific CloudFront distribution (using AWS:SourceArn condition + Origin Access Control). For ALB: a custom secret header injected by CloudFront, validated at the ALB or via WAF rule.',
          correct: true,
          feedback: 'Correct. For S3, use Origin Access Control (OAC) — the modern replacement for OAI — and a bucket policy that restricts access to the specific CloudFront distribution ARN via aws:SourceArn condition. For ALB, the standard pattern is "CloudFront sets a custom header (e.g. X-Origin-Verify) with a secret value; the ALB rejects requests without it via WAF or listener rule". Rotate the secret regularly. This denies direct-to-origin attacks at both endpoints.',
        },
        {
          label: 'Make the S3 bucket private and use signed URLs. Make the ALB private (internal scheme) and put it inside the VPC.',
          correct: false,
          feedback: 'Internal ALB doesn\'t work — CloudFront can\'t reach internal ALBs without VPC Origin (which has its own complications). Signed URLs on S3 work but mix authentication with content-distribution rather than just origin-locking.',
        },
        {
          label: 'Use IP allowlist for CloudFront\'s known IP ranges.',
          correct: false,
          feedback: 'CloudFront\'s IP ranges are large, change frequently, and are shared by everyone using CloudFront — anyone with a CloudFront distribution can present those IPs. IP allowlist is not authentication.',
        },
        {
          label: 'Trust the X-Forwarded-Host header set by CloudFront.',
          correct: false,
          feedback: 'X-Forwarded-* headers are client-controllable — anyone can send them. Authentication needs a secret CloudFront knows that direct callers don\'t.',
        },
      ],
      explanation: 'CDN-to-origin authentication is the closing-the-loop step that turns a CDN from "performance" into "edge security". Without it, all your edge WAF, rate limiting, and geo-blocking can be bypassed by going direct to the origin. AWS\'s native pattern: Origin Access Control for S3, custom-secret-header for ALB/EC2/EKS origins. CloudFlare uses Authenticated Origin Pulls for the same purpose (mTLS between Cloudflare and origin). Rotate the shared secret as part of a regular hygiene cadence.',
      learnMore: { label: 'API security headers', href: '/cheatsheets/api-security' },
    },
    {
      id: 'multi-region-failover',
      topic: 'Multi-region',
      title: 'Active-active multi-region with split-brain risk',
      briefing: 'You have two production regions (us-east, us-west) running active-active. Each region has its own DB cluster (writers in both regions). Asynchronous replication between regions. Health checks at the global load balancer fail traffic over to the surviving region within 30 seconds. The system processes payments — duplicate writes are very expensive.',
      yaml: `Architecture:
  GlobalLB (Route 53 health-checked)
    -> us-east region (active, with DB writer)
    -> us-west region (active, with DB writer)

Replication: async, both directions
Failover: Route 53 health check; ~30s switchover
Payments: idempotency keys at API; DB-side UNIQUE on (idempotency_key)`,
      question: 'What\'s the most likely production failure mode?',
      choices: [
        {
          label: 'During a region brownout, both regions briefly accept writes from different clients (split brain). Async replication can\'t reconcile conflicting writes deterministically. Idempotency keys help but require client-side consistency that may not hold during failover.',
          correct: true,
          feedback: 'Correct. Active-active across regions with async replication is fundamentally split-brain prone — under network partition or partial regional failure, both regions accept writes that the other can\'t see. Idempotency keys catch duplicates within one region\'s consistent view, but during cross-region replication delay, the same key can be accepted in both regions. Mitigations: (1) active-active with sharded ownership (region per shard); (2) active-passive with explicit failover and quorum-based reconciliation; (3) globally consistent databases (Spanner, CockroachDB, DynamoDB Global Tables with strong consistency where supported); (4) saga pattern for cross-region eventual consistency. Don\'t do active-active for payment writes without one of these.',
        },
        {
          label: 'Latency between regions is the limiting factor.',
          correct: false,
          feedback: 'Cross-region latency is real but not the most damaging failure. Split-brain on writes is.',
        },
        {
          label: 'Route 53 health checks are too slow at 30s.',
          correct: false,
          feedback: 'Faster health checks can reduce blast time but don\'t solve split brain — they shorten the duration of double-accepting, but during the window, both regions are still active.',
        },
        {
          label: 'Idempotency keys are sufficient — duplicates can\'t happen.',
          correct: false,
          feedback: 'Idempotency keys work within a single source of truth. Two regions with async replication don\'t share a single source of truth during the replication window — same key can succeed in both.',
        },
      ],
      explanation: 'Multi-region architecture is genuinely hard. The CAP theorem isn\'t academic — under network partition, you choose Consistency or Availability, not both. For payment-class workloads, Consistency must win: active-passive with controlled failover, OR active-active with sharded ownership (each shard has a single writer region), OR a globally-consistent storage layer (Spanner, CockroachDB, DynamoDB Global Tables with strongly-consistent reads). For lower-stakes data (analytics, audit logs), eventual consistency is fine; for money, eventual consistency is a bug. Failover should be a deliberate, observable operation, not a 30-second automatic reaction.',
      learnMore: { label: 'Multi-cluster security architecture', href: '/courses/cloud-native-security-engineering/multi-cluster-multi-cloud-security' },
    },
  ];

  constructor() {
    this.seo.update({
      title: 'Secure Architecture Builder',
      description: 'Interactive cloud architecture simulator: design VPC layouts, place WAFs, choose between bastions and IAM-managed access, pick secret stores, authenticate CDN-to-origin, and design multi-region resilience across 6 production scenarios. Free, no signup.',
      url: '/games/secure-architecture-builder',
      breadcrumbs: [
        { name: 'Home', url: '/' },
        { name: 'Security Simulators', url: '/games' },
        { name: 'Secure Architecture Builder', url: '/games/secure-architecture-builder' },
      ],
    });
  }
}
