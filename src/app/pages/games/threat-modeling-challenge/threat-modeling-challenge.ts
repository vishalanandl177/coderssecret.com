import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../../services/seo.service';
import { ScenarioQuizComponent, Scenario, QuizTheme, QuizIntro, QuizResults, QuizCallToActions } from '../_shared/scenario-quiz';

@Component({
  selector: 'app-threat-modeling-challenge',
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
            <li class="text-foreground font-medium" aria-current="page">Threat Modeling Challenge</li>
          </ol>
        </nav>

        <app-scenario-quiz [scenarios]="scenarios" [theme]="theme" [intro]="intro" [results]="results" [callToActions]="callToActions" />
      </div>
    </section>
  `,
})
export class ThreatModelingChallengeComponent {
  private seo = inject(SeoService);

  theme: QuizTheme = {
    badgePill: 'bg-pink-500/10 border-pink-500/30 text-pink-500',
    accentText: 'text-pink-500',
    titleGradient: 'from-pink-500 via-fuchsia-500 to-purple-500',
    numberCircle: 'bg-pink-500/15 text-pink-500',
    startButton: 'bg-pink-500 hover:bg-pink-400 shadow-pink-500/30',
    topicPill: 'bg-pink-500/15 text-pink-500',
    callout: 'border-pink-500/30 bg-pink-500/5',
    calloutTitle: 'text-pink-500',
    resultsBg: 'from-pink-500/10 via-card to-fuchsia-500/10',
  };

  intro: QuizIntro = {
    badge: 'Threat Modeling Lab',
    titlePlain: 'Threat Modeling',
    titleGradient: 'Challenge',
    description: 'Map the attack surface of real cloud-native systems. Each scenario presents an architecture or data-flow diagram and asks you to enumerate threats with STRIDE, prioritise mitigations, and identify the trust boundary that actually matters.',
    steps: [
      'Each scenario shows an architecture diagram, data flow, or asset inventory from a real cloud-native system.',
      'Identify the top threat from four plausible options — the wrong answers explain why they look plausible but rank lower.',
      'Read the production explanation, follow the link to the relevant lesson, and move to the next scenario.',
      'Score yourself across all six rounds — covering STRIDE classification, trust boundaries, data classification, attack trees, severity prioritisation, and mitigation cost.',
    ],
    practiceTitle: `What You'll Practice`,
    practiceDescription: 'Threat modeling is the most leveraged security skill — finding what to fix before it ships costs less than every alternative.',
    practiceConcepts: [
      { name: 'STRIDE', description: 'Spoofing/Tampering/Repudiation/Info-disclosure/DoS/Escalation' },
      { name: 'Trust Boundaries', description: 'Where one trust domain ends and another begins' },
      { name: 'Data Classification', description: 'PII, secrets, public — handling decisions' },
      { name: 'Attack Trees', description: 'Working back from the goal to the entry' },
      { name: 'Severity', description: 'DREAD-style impact + likelihood' },
      { name: 'Mitigations', description: 'Cost vs effectiveness ranking' },
    ],
    deeperLine: 'Want to go deeper after the simulation? Read the ',
    deeperLinks: [
      { label: 'Cloud Native Security Engineering course', href: '/courses/cloud-native-security-engineering' },
      { label: 'Zero Trust glossary entry', href: '/glossary/zero-trust' },
    ],
    timeMinutes: 15,
    difficulty: 'Hard',
  };

  results: QuizResults = {
    perfect: { headline: 'Threat model mastered. Flawless run.', emoji: '\u{1F947}', message: 'You think like an attacker AND a designer. The Cloud Native Security Engineering course goes deeper into adversarial architecture, attack-graph automation, and the patterns that scale across hundreds of services.' },
    great: { headline: 'You read architectures like an adversary.', emoji: '\u{1F9E0}', message: 'Strong instincts. Brush up on the few you missed and integrate STRIDE/PASTA reviews into your design-review process.' },
    good: { headline: 'Solid foundation — refine the rough edges.', emoji: '\u{1F4DA}', message: 'You know the framework. The structured curriculum walks through threat modeling on real cloud-native systems with end-to-end labs.' },
    weak: { headline: 'Time to learn the threat-modeling fundamentals.', emoji: '\u{1F50D}', message: 'STRIDE, trust boundaries, attack trees — these are the language of defensive design. Start with the introduction-cloud-native-security module, then come back.' },
  };

  callToActions: QuizCallToActions = {
    primary: { label: 'Take the security course', href: '/courses/cloud-native-security-engineering' },
  };

  scenarios: Scenario[] = [
    {
      id: 'stride-classify',
      topic: 'STRIDE',
      title: 'STRIDE-classify this risk',
      briefing: 'A web app has a "forgot password" flow that emails a reset link. The link contains a token in the query string. Tokens are 8-character random strings, valid for 24 hours, single-use. Threat: an attacker enumerates tokens to take over accounts.',
      yaml: `User -> /forgot-password (email)
        -> Email link: https://app.example.com/reset?token=Xa7Bk2Pq
        -> /reset accepts token, lets user set new password

Token spec:
  - 8 chars from [A-Za-z0-9]  (62^8 ≈ 2.18 × 10^14)
  - 24-hour validity
  - single-use (consumed on password change)
  - rate limit: 100 reset attempts per IP per hour`,
      question: 'Which STRIDE category does the enumeration attack primarily fall into?',
      choices: [
        {
          label: 'D — Denial of Service',
          correct: false,
          feedback: 'Token enumeration aims to take over accounts, not deny service. DoS is when the attack prevents legitimate use — different threat class.',
        },
        {
          label: 'S — Spoofing of identity. The attacker proves "I am the user with this email" without actually being them, by guessing a credential (the reset token).',
          correct: true,
          feedback: 'Correct. The attack lets the adversary impersonate the legitimate user — that\'s spoofing in STRIDE. Mitigations: longer tokens (32+ random chars; 62^32 is unguessable), shorter validity (15-30 minutes), per-account rate limiting (not just per-IP — IPs are cheap), and constant-time token lookup. Also consider: tie the reset to a session cookie set when the request was made, so a cross-device email click + reset doesn\'t work.',
        },
        {
          label: 'I — Information Disclosure. The attacker learns information they shouldn\'t.',
          correct: false,
          feedback: 'Information disclosure is unintended leakage — leaked logs, exposed APIs, error messages. Token enumeration is about gaining authentication, not learning info.',
        },
        {
          label: 'R — Repudiation. The attacker denies having performed the action.',
          correct: false,
          feedback: 'Repudiation is about disowning legitimate actions — solved by audit logs and signatures. Not the right category here.',
        },
      ],
      explanation: 'STRIDE is a mnemonic for threat categories: Spoofing (auth bypass), Tampering (integrity), Repudiation (audit), Information disclosure (confidentiality), Denial of Service (availability), Elevation of privilege (authz bypass). Most threats fit multiple categories — but identifying the primary one drives the right mitigation. Token enumeration is spoofing; SQL injection is tampering + information disclosure; CSRF is spoofing + tampering. STRIDE per-flow (vs per-component) is more useful in modern cloud-native systems.',
      learnMore: { label: 'Threat modeling foundations', href: '/courses/cloud-native-security-engineering/introduction-cloud-native-security' },
    },
    {
      id: 'trust-boundaries',
      topic: 'Trust Boundaries',
      title: 'Where is the highest-stakes trust boundary?',
      briefing: 'You\'re reviewing a 3-tier architecture: a public web client, a backend API on Kubernetes, and a Postgres database. Authentication uses OIDC; the API uses a service account to talk to Postgres.',
      yaml: `[Browser]
   |  HTTPS, OIDC ID token
   v
[CDN]  -- WAF + edge auth
   |  HTTPS
   v
[K8s Ingress]
   |  HTTP, mesh-internal
   v
[API Pod]
   |  TCP, password auth
   v
[Postgres]  (private subnet)`,
      question: 'Which trust boundary deserves the most security investment?',
      choices: [
        {
          label: 'Browser → CDN. This is the only internet-facing edge; everything depends on it.',
          correct: false,
          feedback: 'It\'s a real boundary, but it\'s already the most-hardened (TLS, WAF, edge auth). Marginal investment here yields less than fixing weaker internal boundaries.',
        },
        {
          label: 'API Pod → Postgres. The boundary between the application identity (workload running arbitrary code) and the data store of record. A code-execution flaw in the API has full access to all data unless the boundary is enforced via least-privilege DB users + per-tenant row-level security + network policy + workload identity.',
          correct: true,
          feedback: 'Correct. The boundary that separates "compromised application" from "compromised data" is the highest-leverage. A code-execution bug in the API is plausible (npm package, Log4Shell-class vuln); without strict DB-side authorisation the blast radius is the entire database. Hardening: scoped DB users per service, row-level security, audit logs at the DB, NetworkPolicy that only the API pod can reach Postgres on port 5432, workload-identity-based DB auth (IAM Auth on RDS, SPIFFE-bridge for self-hosted) so a stolen password is short-lived.',
        },
        {
          label: 'CDN → K8s Ingress. The TLS termination boundary.',
          correct: false,
          feedback: 'TLS termination is a real boundary but mostly handled by infrastructure choice. Application-layer compromise still propagates past it.',
        },
        {
          label: 'K8s Ingress → API Pod. The mesh-internal boundary.',
          correct: false,
          feedback: 'Important to enforce mTLS here, but the API pod is already inside the trust zone — compromise here is less catastrophic than compromise at the data boundary.',
        },
      ],
      explanation: 'The most valuable trust boundary is the one between "code that processes input" and "data of record". Compromise of the input-processing layer (API, web app) is regularly assumed in threat modeling — it\'s the data boundary that determines blast radius. This is why the principle "don\'t use database superusers for application connections" matters more than any individual web-layer hardening. Same principle: AWS IAM least-privilege between application and S3/DynamoDB; Kubernetes RBAC scoped to specific verbs/resources; service-to-service authz enforced at the receiving service.',
      learnMore: { label: 'Architect Zero Trust systems', href: '/courses/cloud-native-security-engineering/zero-trust-security-fundamentals' },
    },
    {
      id: 'data-classification',
      topic: 'Data Classification',
      title: 'Classify and decide handling',
      briefing: 'A new feature collects: (a) user email, (b) user IP address at signup, (c) hashed password (bcrypt cost 12), (d) device fingerprint hash (SHA-256 of canvas + UA + screen-res), (e) signup timestamp. The product team asks "do we need to think about PII / GDPR for any of this?"',
      yaml: `Fields collected:
  email           string
  signup_ip       string  (e.g. "203.0.113.45")
  password_hash   string  (bcrypt $2b$12$...)
  device_fp_hash  string  (sha256 hex)
  created_at      timestamp`,
      question: 'Which fields are PII / personal data under GDPR-style regulation?',
      choices: [
        {
          label: 'Email and IP address. Password hash and device fingerprint are anonymized.',
          correct: false,
          feedback: 'IP address is correctly identified as PII. But "password hash and device fingerprint are anonymized" is wrong — both are linked to a specific person and used to identify or track them.',
        },
        {
          label: 'Email, signup IP, password hash, AND device fingerprint hash. GDPR considers any data that can identify or track a specific individual to be personal data — even hashed device fingerprints are personal data when used to recognize a person across sessions.',
          correct: true,
          feedback: 'Correct. GDPR Article 4 defines personal data broadly: any information relating to an identified or identifiable natural person. Hashed values are NOT anonymous — they\'re pseudonymous if they consistently identify a person, and pseudonymous data is still personal data under GDPR. Device fingerprints (even hashed) are explicitly cited in EDPB guidance. Password hashes are personal data because they\'re tied to the account. Storage handling: encryption at rest, retention policies, the right to erasure, and clear data-flow documentation.',
        },
        {
          label: 'Only email is PII; everything else is technical metadata.',
          correct: false,
          feedback: 'IP address is established PII (CJEU ruling C-582/14). Password hash is an authentication credential tied to a person. Device fingerprint is explicitly PII per EDPB.',
        },
        {
          label: 'None of it is PII — all values are hashed or pseudonymised.',
          correct: false,
          feedback: 'Email and IP are not hashed. And "hashed = anonymous" is a common misconception that GDPR rejects.',
        },
      ],
      explanation: 'PII / personal data classification drives a lot of architectural decisions: encryption at rest, retention policies, deletion rights, audit logs of access, data residency. The mistake of thinking "I hashed it, so it\'s anonymous" leads to compliance gaps — and to design decisions that make true anonymisation harder later. The cleaner pattern: classify each field on collection (Public / Internal / PII / PII-Sensitive / Secret), apply handling policy programmatically, and audit data-egress paths against the classification.',
      learnMore: { label: 'Compliance-aware architecture', href: '/courses/cloud-native-security-engineering' },
    },
    {
      id: 'attack-tree',
      topic: 'Attack Trees',
      title: 'Working back from the attacker\'s goal',
      briefing: 'An attacker\'s goal: exfiltrate the customer database. You map the attack tree — every path that achieves the goal. Which root path is the most plausible entry?',
      yaml: `Goal: Exfiltrate customer DB

Branches:
A) Compromise a developer laptop with prod DB credentials in env
B) Exploit a 0-day RCE in the public API → access DB via service account
C) Compromise the on-call SRE Slack to phish DB password
D) Insider threat: bribed employee with DB read access
E) Steal an etcd snapshot from cluster backup S3 bucket
F) Compromise the CI runner that has read access to production secrets

Defender resources are limited.`,
      question: 'Which branch typically has the highest probability AND is most under-defended in mid-stage companies?',
      choices: [
        {
          label: 'B — 0-day RCE in the public API. Most attack reports describe RCE; therefore most attacks are RCE.',
          correct: false,
          feedback: 'Reporting bias — public attack disclosures over-represent technically interesting RCE. In real-world incident data, RCE is far less common than supply-chain and credential paths.',
        },
        {
          label: 'F — CI runner compromise. Mid-stage companies regularly grant CI broad access (deploy + read secrets), pin actions to mutable refs, and don\'t harden runners. A compromised runner = stolen secrets = direct DB access. Verizon DBIR consistently shows credentials and supply-chain over 0-days.',
          correct: true,
          feedback: 'Correct. CI/CD compromise has eclipsed RCE in real-world breach reports for several years (Verizon DBIR, Mandiant M-Trends). Mid-stage companies tend to have under-hardened CI: GITHUB_TOKEN with full permissions, action references like @main, secrets accessible to fork PRs (pull_request_target patterns), self-hosted runners with privileged Docker access, and broad cloud IAM scopes. The fix: minimum permissions, SHA-pinned actions, OIDC-based ephemeral cloud auth, ephemeral runners.',
        },
        {
          label: 'D — Insider threat. Most breach data implicates insiders.',
          correct: false,
          feedback: 'Insider threats are real but require established defenses (DLP, behavior analytics, separation of duties) that are different from technical/access defenses. Not the typical "high prob + under-defended" cell for mid-stage companies.',
        },
        {
          label: 'A — Developer laptop compromise. Most laptops are unmanaged.',
          correct: false,
          feedback: 'Laptop compromise IS common, but mature companies are increasingly addressing it (MDM, hardware security keys, no-prod-creds-on-laptop policies). At mid-stage it\'s a real risk but typically less than CI compromise.',
        },
      ],
      explanation: 'Attack tree analysis is a forcing function: enumerate every plausible path, estimate probability and effort, and budget defense by the highest-leverage paths. The mistake is letting attention follow novelty (RCE, exotic exploits) rather than data (credentials, supply chain). The Verizon DBIR is the best annual reality check on real breach causes — read it, then re-prioritise. CI/CD hardening has the highest ratio of "attack risk" to "engineering effort" for most companies right now.',
      learnMore: { label: 'Secure CI/CD pipelines', href: '/courses/cloud-native-security-engineering/secure-cicd-pipelines' },
    },
    {
      id: 'severity-prioritization',
      topic: 'Severity',
      title: 'Prioritise these threats',
      briefing: 'Three threats are surfaced in a sprint review. The team has capacity for one this sprint. Pick the highest priority by impact × likelihood.',
      yaml: `T1: An XSS in the admin dashboard. Admin role only.
    Exploitable by: a malicious authenticated admin user.
    Impact: full admin actions; potential persistence.
    Likelihood: low (admins are 5 internal users).

T2: A missing authz check on /api/v1/users/:id/profile.
    Exploitable by: any authenticated user.
    Impact: read any other user's profile (name, email, plan tier).
    Likelihood: high (any user can hit it).

T3: Unencrypted backups in S3 bucket "company-backups".
    Exploitable by: anyone with the bucket name + access.
    Impact: full DB snapshots leaked.
    Likelihood: low (bucket is private with allowlist).`,
      question: 'Which one ships this sprint?',
      choices: [
        {
          label: 'T1 — XSS in admin. Persistence is the most dangerous outcome.',
          correct: false,
          feedback: 'Limited audience (5 internal users) and requires already-authenticated admin. Real risk but low likelihood.',
        },
        {
          label: 'T2 — Missing authz on profile API. High likelihood (any user) × medium impact (PII exposure across the user base) = highest risk × cost ratio. Also smallest fix surface (one endpoint, one check).',
          correct: true,
          feedback: 'Correct. Risk = Impact × Likelihood. T2: medium impact × high likelihood × low cost-to-fix = best ratio this sprint. T2 is also a class of vulnerability (BOLA / IDOR — Broken Object Level Authorization) that\'s OWASP API Top 10 #1 and a common breach vector. The fix is a few lines of authz code. T1 and T3 are real but lower likelihood and bigger fix surfaces.',
        },
        {
          label: 'T3 — Unencrypted backups. Backup leakage is catastrophic.',
          correct: false,
          feedback: 'Catastrophic IF exploited, but likelihood is low (private bucket, allowlist). Encrypt backups as a sprint follow-up — it\'s a hardening, not a hot risk.',
        },
        {
          label: 'All three are equal — split the sprint into thirds.',
          correct: false,
          feedback: 'Splitting capacity 3 ways means none get done well. Prioritise.',
        },
      ],
      explanation: 'Severity = Impact × Likelihood is the simplest useful model. DREAD adds Discoverability/Reproducibility/Exploitability for nuance. CVSS v3.1 is the industry-standard score. The trap is letting "scary" override "likely" — a low-probability catastrophic threat is still lower priority than a high-probability moderate one when capacity is tight. Track all three; ship the highest ratio.',
      learnMore: { label: 'API security risk patterns', href: '/games/api-attack-defense' },
    },
    {
      id: 'mitigation-tradeoffs',
      topic: 'Mitigations',
      title: 'A risky design decision',
      briefing: 'Your team is designing a new microservice that processes payment events. The risk: a code-execution flaw in the service has access to a long-lived AWS access key with permissions to write the payment-events Kinesis stream and read the customer-data S3 bucket. Three mitigation paths are proposed.',
      yaml: `Option A: Replace the long-lived AWS key with IAM Roles
         for Service Accounts (IRSA) on EKS.
         (Tokens issued to the pod's SA, signed by EKS,
         exchanged for short-lived AWS creds.)

Option B: Add WAF rules in front of the service to
         block "common attacks".

Option C: Run trivy on every PR + pre-deploy scan
         + snyk monitoring.`,
      question: 'Which mitigation gives the most defence-in-depth value for the lowest cost?',
      choices: [
        {
          label: 'B. WAF blocks the attack before it reaches the code.',
          correct: false,
          feedback: 'WAF helps but is signature-based; novel attacks pass through. And once code execution happens, WAF doesn\'t reduce the blast radius. Plus the AWS keys remain long-lived and over-scoped.',
        },
        {
          label: 'A. Replacing the long-lived key with IRSA + scope-limiting the IAM role to "write Kinesis, no S3 read" turns a catastrophic compromise into a contained one. The AWS credential has minutes-of-validity, only the permissions actually needed, and is automatically rotated.',
          correct: true,
          feedback: 'Correct. Workload-identity + least-privilege closes the worst-case impact even if the code is compromised. A 60-minute STS token with Kinesis-write only is a much smaller blast radius than a long-lived key with S3 read access. Combine with WAF (defence in depth at the edge), code scanning (catch issues pre-deploy), and runtime detection (Falco for unexpected egress) — no single mitigation is enough, but workload identity + least-privilege is the single highest-impact change.',
        },
        {
          label: 'C. Code scanning catches the bug before it ships.',
          correct: false,
          feedback: 'Scanners catch known patterns; novel bugs pass. Reducing the blast radius of "code is exploited" is the more durable defence. Use scanners AND least-privilege, not scanners INSTEAD OF least-privilege.',
        },
        {
          label: 'All three are equal — implement all simultaneously.',
          correct: false,
          feedback: 'They\'re not equal. A reduces blast radius; B catches edge attacks; C catches known patterns. Sequence by impact: A first, B and C as parallel work after.',
        },
      ],
      explanation: 'The most-leveraged security investment is usually shrinking the blast radius of the next compromise — workload identity, least-privilege IAM, network segmentation, scoped database users. These mitigations apply broadly and benefit every workload running in the platform. Edge defenses (WAF) and detection (scanners, runtime alerts) are necessary too, but they assume the code is compromised in some way the defender didn\'t anticipate. The defence-in-depth stack is "shrink blast radius + catch known patterns + detect anomalies" — not any single one.',
      learnMore: { label: 'Machine identity & least privilege', href: '/courses/mastering-spiffe-spire' },
    },
  ];

  constructor() {
    this.seo.update({
      title: 'Threat Modeling Challenge',
      description: 'Interactive threat modeling simulator: classify threats with STRIDE, identify trust boundaries, classify PII, build attack trees, prioritise by severity, and rank mitigations across 6 production scenarios. Free, no signup.',
      url: '/games/threat-modeling-challenge',
      breadcrumbs: [
        { name: 'Home', url: '/' },
        { name: 'Security Simulators', url: '/games' },
        { name: 'Threat Modeling Challenge', url: '/games/threat-modeling-challenge' },
      ],
    });
  }
}
