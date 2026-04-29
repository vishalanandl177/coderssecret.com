export interface CourseInstructor {
  name: string;
  title: string;
  bio: string;
  github: string;
  achievements: string[];
}

export interface CourseLab {
  title: string;
  objective: string;
  repoPath: string;
  steps: string[];
  duration?: string;
  difficulty?: string;
  expectedOutput?: string;
}

export interface CourseModule {
  number: number;
  title: string;
  slug: string;
  subtitle: string;
  duration: string;
  objectives: string[];
  content: string;
  svgDiagram: string;
  labs: CourseLab[];
  keyTakeaways: string[];
  whyThisMatters?: string;
  realWorldUseCases?: string[];
  productionNotes?: string[];
  commonMistakes?: string[];
  thinkLikeAnEngineer?: string[];
  securityRisks?: string[];
  designTradeoffs?: { option: string; pros: string[]; cons: string[] }[];
  productionAlternatives?: { name: string; description: string }[];
  operationalStory?: string;
  careerRelevance?: string;
  beforeAfter?: { before: string[]; after: string[] };
  glossary?: { term: string; definition: string }[];
}

export interface CourseSeoPage {
  slug: string;
  title: string;
  description: string;
  content: string;
  ctaModule: number;
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  subtitle: string;
  excerpt: string;
  description: string;
  instructor: CourseInstructor;
  totalDuration: string;
  level: string;
  tags: string[];
  category: string;
  targetAudience: string[];
  modules: CourseModule[];
  seoPages: CourseSeoPage[];
}

export const COURSES: Course[] = [
  {
    id: 'course-1',
    title: 'Mastering SPIFFE & SPIRE: Zero Trust for Cloud Native Systems',
    slug: 'mastering-spiffe-spire',
    subtitle: 'Learn modern cloud-native identity security and become the engineer who secures production Kubernetes clusters — for free.',
    excerpt: 'Go from "what is workload identity?" to deploying production-grade SPIRE on Kubernetes with mTLS, OPA policy enforcement, and multi-cluster federation. 13 modules, 60+ labs, completely free.',
    description: 'Replace secret sprawl with workload identity. The most comprehensive free course on SPIFFE and SPIRE — the CNCF standard for machine identity in cloud-native systems. Learn zero trust architecture, PKI fundamentals, Kubernetes workload identity, service mesh integration, and production operations through 30+ hands-on labs and real-world architecture patterns. Go from shared secrets and manual certificates to automatic, cryptographic workload identity.',
    instructor: {
      name: 'Vishal Anand',
      title: 'Senior Product Engineer & Open Source Contributor',
      bio: 'Creator of DRF API Logger, an open-source package powering API observability across thousands of enterprise Django applications. Vishal builds production infrastructure at scale and created this course to fill the gap in practical SPIFFE/SPIRE education — teaching real deployment patterns, not just theory.',
      github: 'https://github.com/vishalanandl177',
      achievements: [
        'Creator of DRF API Logger — open source with 1,200+ GitHub stars',
        'Used across enterprise systems for API observability',
        'Senior Product Engineer with production Kubernetes experience',
        'Technical writer at coderssecret.com — 80+ engineering tutorials',
      ],
    },
    totalDuration: '40+ hours',
    level: 'Intermediate to Advanced',
    tags: ['SPIFFE', 'SPIRE', 'Zero Trust', 'Kubernetes', 'mTLS', 'PKI', 'Service Mesh', 'OPA', 'Cloud Native', 'CNCF', 'Workload Identity', 'Security'],
    category: 'devops',
    targetAudience: [
      'Platform Engineers building internal developer platforms',
      'DevOps Engineers managing Kubernetes clusters',
      'Security Engineers implementing zero trust',
      'Backend Developers securing microservice communication',
      'SREs responsible for production identity infrastructure',
      'Cloud Architects designing multi-cluster systems',
    ],
    seoPages: [
      {
        slug: 'spiffe-spire',
        title: 'SPIFFE & SPIRE: The Complete Guide to Workload Identity',
        description: 'Learn what SPIFFE and SPIRE are, how they solve workload identity in cloud-native systems, and why they are the CNCF standard for zero trust security.',
        ctaModule: 1,
        content: `
          <h1>SPIFFE &amp; SPIRE: The Complete Guide to Workload Identity</h1>

          <p>In traditional infrastructure, services proved their identity through network location &mdash; if a request came from the right IP address, it was trusted. In cloud-native systems with ephemeral containers, auto-scaling pods, and multi-cloud deployments, network location means nothing. A pod&rsquo;s IP changes every time it restarts.</p>

          <p><strong>SPIFFE</strong> (Secure Production Identity Framework For Everyone) solves this by giving every workload a cryptographic identity &mdash; an identity that is verifiable, short-lived, and automatically rotated. <strong>SPIRE</strong> (SPIFFE Runtime Environment) is the production implementation that manages these identities at scale.</p>

          <h2>Why SPIFFE Matters Now</h2>

          <p>The shift to Kubernetes, service meshes, and microservices created an identity crisis in infrastructure. Secrets stored in environment variables get leaked. Long-lived certificates expire and cause outages. API keys shared between services become attack vectors. SPIFFE replaces all of these with a standards-based identity system that works across clouds, clusters, and trust boundaries.</p>

          <p>SPIFFE is a <strong>CNCF graduated project</strong> &mdash; the same maturity level as Kubernetes, Prometheus, and Envoy. It is not experimental. It is production infrastructure used by companies like Bloomberg, Uber, and Pinterest.</p>

          <h2>What You Will Learn</h2>

          <ul>
            <li>How SPIFFE IDs provide cryptographic workload identity</li>
            <li>X.509-SVIDs and JWT-SVIDs &mdash; the two identity document formats</li>
            <li>How SPIRE manages identity lifecycle &mdash; attestation, issuance, rotation</li>
            <li>Deploying SPIRE on Kubernetes with automatic workload registration</li>
            <li>Integrating SPIRE with Envoy, Istio, and OPA for end-to-end zero trust</li>
            <li>Production architecture patterns for multi-cluster and multi-cloud</li>
          </ul>

          <h2>Start Learning for Free</h2>

          <p>Our <strong>Mastering SPIFFE &amp; SPIRE</strong> course covers everything from zero trust fundamentals to production operations across 13 modules and 60+ hands-on labs. No paywall, no signup wall &mdash; just practical education for engineers who secure real infrastructure.</p>
        `,
      },
      {
        slug: 'what-is-spire',
        title: 'What Is SPIRE? The SPIFFE Runtime Environment Explained',
        description: 'SPIRE is the production implementation of SPIFFE that manages workload identities. Learn how SPIRE Server, Agent, and attestation work together to secure your infrastructure.',
        ctaModule: 4,
        content: `
          <h1>What Is SPIRE? The SPIFFE Runtime Environment Explained</h1>

          <p>SPIRE (SPIFFE Runtime Environment) is the reference implementation of the SPIFFE specification. While SPIFFE defines <em>what</em> workload identity should look like, SPIRE provides the <em>how</em> &mdash; a production-ready system for issuing, managing, and rotating cryptographic identities for every workload in your infrastructure.</p>

          <h2>SPIRE Architecture</h2>

          <p>SPIRE consists of two main components:</p>

          <ul>
            <li><strong>SPIRE Server:</strong> The central authority that manages identity registrations and issues SVIDs (SPIFFE Verifiable Identity Documents). It maintains the trust root and communicates with SPIRE Agents.</li>
            <li><strong>SPIRE Agent:</strong> Runs on every node (physical host, VM, or Kubernetes node). It attests workloads on that node and provides them with their identities via the SPIFFE Workload API.</li>
          </ul>

          <h2>How SPIRE Issues Identities</h2>

          <ol>
            <li><strong>Node Attestation:</strong> When a SPIRE Agent starts, it proves its identity to the SPIRE Server using platform-specific evidence (AWS instance identity document, Kubernetes service account token, etc.)</li>
            <li><strong>Workload Attestation:</strong> When a workload requests an identity, the SPIRE Agent verifies the workload using OS-level or orchestrator-level selectors (PID, Kubernetes namespace/service account, Docker labels)</li>
            <li><strong>SVID Issuance:</strong> After both attestation steps succeed, SPIRE issues an X.509-SVID or JWT-SVID to the workload</li>
            <li><strong>Automatic Rotation:</strong> SVIDs are short-lived (typically 1 hour). SPIRE automatically rotates them before expiry &mdash; no application changes needed</li>
          </ol>

          <h2>Why Not Just Use Certificates Directly?</h2>

          <p>You could manage certificates yourself with tools like cert-manager or Vault. But SPIRE provides: automatic attestation (no manual enrollment), short-lived certificates with automatic rotation, a standard API (SPIFFE Workload API) that any application can use, federation across trust domains for multi-cluster communication, and integration with service meshes like Envoy and Istio.</p>

          <h2>Learn SPIRE Hands-On</h2>

          <p>Our free course covers SPIRE architecture in depth, starting with Module 4 where you install SPIRE from binaries, configure the server and agent, and register your first workload. By Module 5, you will be running SPIRE on Kubernetes with automatic pod identity.</p>
        `,
      },
      {
        slug: 'workload-identity',
        title: 'Workload Identity: Why Network Location Is Not Identity',
        description: 'Workload identity gives every service a cryptographic identity independent of network location. Learn why IP-based trust fails in cloud-native systems and how SPIFFE solves it.',
        ctaModule: 1,
        content: `
          <h1>Workload Identity: Why Network Location Is Not Identity</h1>

          <p>For decades, we trusted services based on where they ran. If a request came from 10.0.1.50, it was the payment service. If it came from the 10.0.2.0/24 subnet, it was in the trusted zone. This model worked when servers had static IPs and lived for years.</p>

          <p>In cloud-native systems, this model is fundamentally broken:</p>

          <ul>
            <li><strong>Containers get random IPs</strong> that change on every restart</li>
            <li><strong>Auto-scaling creates and destroys instances</strong> continuously</li>
            <li><strong>Service meshes route traffic</strong> through proxies, masking the original source</li>
            <li><strong>Multi-cloud deployments</strong> span networks with overlapping IP ranges</li>
            <li><strong>Attackers who compromise one pod</strong> can impersonate any service on the same network</li>
          </ul>

          <h2>The Secret Sprawl Problem</h2>

          <p>Without workload identity, teams resort to shared secrets: API keys in environment variables, long-lived certificates copied between services, Vault tokens that themselves need distribution, and Kubernetes service account tokens that never expire. This is <strong>secret sprawl</strong> &mdash; a growing attack surface that becomes unmanageable at scale. Every shared secret is a potential breach vector. Every long-lived credential is a ticking clock.</p>

          <h2>What Is Workload Identity?</h2>

          <p>Workload identity (also called <strong>machine identity</strong> or <strong>service identity</strong>) assigns a <strong>cryptographic identity</strong> to every service, container, or process &mdash; an identity that is independent of network location, tied to the workload itself, cryptographically verifiable by any other workload, automatically issued and rotated, and short-lived to limit blast radius of compromise. It replaces secret sprawl with infrastructure-managed trust.</p>

          <h2>The SPIFFE Standard</h2>

          <p>SPIFFE (Secure Production Identity Framework For Everyone) is the CNCF standard for workload identity. It defines a URI-based identity format, two types of verifiable identity documents (X.509-SVIDs and JWT-SVIDs), a standard API for workloads to request their identities, and trust bundles for cross-domain verification.</p>

          <h2>Real-World Impact</h2>

          <p>With workload identity, you replace static API keys with automatically rotated cryptographic credentials, enable mutual TLS between services without managing certificates manually, implement fine-grained authorization based on verified identity rather than network rules, and federate trust across clusters and clouds without VPN tunnels.</p>

          <h2>Start Your Workload Identity Journey</h2>

          <p>Our free SPIFFE &amp; SPIRE course starts with the fundamentals of zero trust and workload identity in Module 1, then progressively builds to production Kubernetes deployments, service mesh integration, and multi-cluster federation.</p>
        `,
      },
      {
        slug: 'zero-trust-kubernetes',
        title: 'Zero Trust for Kubernetes: Moving Beyond Network Policies',
        description: 'Kubernetes NetworkPolicies are not zero trust. Learn how to implement real zero trust with SPIFFE/SPIRE workload identity, mTLS, and OPA policy enforcement.',
        ctaModule: 5,
        content: `
          <h1>Zero Trust for Kubernetes: Moving Beyond Network Policies</h1>

          <p>Most Kubernetes clusters rely on NetworkPolicies for security. While NetworkPolicies are useful, they only control <em>which pods can talk to which pods</em> at the network level. They do not verify identity, encrypt traffic, or enforce fine-grained authorization. A compromised pod in an allowed namespace can impersonate any service.</p>

          <h2>What Zero Trust Means for Kubernetes</h2>

          <p>Zero trust in Kubernetes means every pod has a verifiable cryptographic identity (not just a service account token), all pod-to-pod communication is encrypted with mutual TLS, authorization decisions are based on verified identity and context (not just namespace or label), and identities are short-lived and automatically rotated.</p>

          <h2>The Stack: SPIRE + Envoy + OPA</h2>

          <ul>
            <li><strong>SPIRE:</strong> Issues cryptographic identities (X.509-SVIDs) to every pod via the SPIFFE Workload API</li>
            <li><strong>Envoy (sidecar proxy):</strong> Handles mTLS transparently &mdash; applications do not need to implement TLS themselves</li>
            <li><strong>OPA (Open Policy Agent):</strong> Enforces fine-grained authorization policies based on SPIFFE IDs</li>
          </ul>

          <h2>Why NetworkPolicies Are Not Enough</h2>

          <table>
            <thead><tr><th>Feature</th><th>NetworkPolicy</th><th>SPIRE + mTLS + OPA</th></tr></thead>
            <tbody>
              <tr><td>Identity verification</td><td>No</td><td>Cryptographic (X.509)</td></tr>
              <tr><td>Encryption</td><td>No</td><td>mTLS (automatic)</td></tr>
              <tr><td>Authorization granularity</td><td>Namespace/label</td><td>Per-service, per-method</td></tr>
              <tr><td>Works across clusters</td><td>No</td><td>Yes (SPIFFE federation)</td></tr>
              <tr><td>Audit trail</td><td>Limited</td><td>Full (identity + policy logs)</td></tr>
            </tbody>
          </table>

          <h2>Learn Zero Trust Kubernetes</h2>

          <p>Module 5 of our free course deploys SPIRE on Kubernetes, registers workloads, and retrieves SVIDs inside pods. Modules 7-8 add Envoy integration and OPA policy enforcement for a complete zero trust stack.</p>
        `,
      },
      {
        slug: 'spire-kubernetes-tutorial',
        title: 'SPIRE on Kubernetes: Step-by-Step Deployment Tutorial',
        description: 'Deploy SPIRE Server and Agent on Kubernetes, register workloads, and secure pod-to-pod communication with mTLS. Complete hands-on tutorial with manifests.',
        ctaModule: 5,
        content: `
          <h1>SPIRE on Kubernetes: Step-by-Step Deployment Tutorial</h1>

          <p>This tutorial walks through deploying SPIRE on a Kubernetes cluster, registering workloads, and verifying that pods receive cryptographic identities. By the end, your pods will have automatically-issued, short-lived X.509 certificates for mutual TLS.</p>

          <h2>Prerequisites</h2>

          <ul>
            <li>A Kubernetes cluster (Kind, Minikube, or cloud-managed)</li>
            <li>kubectl configured and working</li>
            <li>Basic understanding of Kubernetes pods, services, and service accounts</li>
          </ul>

          <h2>Architecture Overview</h2>

          <p>SPIRE runs as two components on Kubernetes: the <strong>SPIRE Server</strong> (a StatefulSet with persistent storage for the datastore) and the <strong>SPIRE Agent</strong> (a DaemonSet that runs on every node). The Agent exposes the SPIFFE Workload API via a Unix domain socket that pods access through a CSI driver or hostPath volume.</p>

          <h2>What You Will Deploy</h2>

          <ol>
            <li>SPIRE Server as a StatefulSet with SQLite datastore</li>
            <li>SPIRE Agent as a DaemonSet with Kubernetes node attestor</li>
            <li>SPIRE Controller Manager for automatic workload registration</li>
            <li>A demo application that retrieves its SVID and establishes mTLS</li>
          </ol>

          <h2>Full Tutorial in Our Free Course</h2>

          <p>Module 5 of the Mastering SPIFFE &amp; SPIRE course provides the complete hands-on tutorial with Kubernetes manifests, verification commands, and troubleshooting guides. The companion GitHub repository contains all manifests ready to apply.</p>
        `,
      },
      {
        slug: 'spiffe-mtls-service-mesh',
        title: 'SPIFFE, mTLS, and Service Mesh: How They Work Together',
        description: 'SPIFFE provides identity, mTLS provides encryption, service meshes provide the infrastructure. Learn how these three layers create end-to-end zero trust in production.',
        ctaModule: 8,
        content: `
          <h1>SPIFFE, mTLS, and Service Mesh: How They Work Together</h1>

          <p>Zero trust security requires three layers working together: <strong>identity</strong> (who is this service?), <strong>encryption</strong> (is the communication secure?), and <strong>authorization</strong> (is this service allowed to do this?). SPIFFE, mTLS, and service meshes each handle one of these layers.</p>

          <h2>The Three Layers</h2>

          <ul>
            <li><strong>SPIFFE (Identity):</strong> Gives every workload a cryptographic identity via X.509-SVIDs or JWT-SVIDs. This answers: "Who is making this request?"</li>
            <li><strong>mTLS (Encryption):</strong> Both client and server present certificates and verify each other&rsquo;s identity. This answers: "Is this connection secure and authenticated?"</li>
            <li><strong>Service Mesh (Infrastructure):</strong> Envoy/Istio/Linkerd sidecar proxies handle mTLS transparently so applications do not need TLS code. This answers: "How do we enforce security without changing applications?"</li>
          </ul>

          <h2>SPIRE as the Identity Provider for Service Meshes</h2>

          <p>Istio has its own CA (Citadel/istiod). Linkerd has its own CA. But SPIRE can replace both as a unified identity provider across mesh and non-mesh workloads. This is critical for organizations that need consistent identity across Kubernetes services (in the mesh), legacy VMs (outside the mesh), serverless functions, and CI/CD pipelines.</p>

          <h2>Learn the Full Integration</h2>

          <p>Module 8 of our free course covers SPIRE integration with Envoy, Istio, and Linkerd. You will deploy a service mesh with SPIRE as the identity backend and enforce OPA policies based on SPIFFE IDs.</p>
        `,
      },
      {
        slug: 'machine-identity-management',
        title: 'Machine Identity Management: SPIFFE vs Vault vs Cloud IAM',
        description: 'Compare workload identity approaches: SPIFFE/SPIRE vs HashiCorp Vault PKI vs Kubernetes Service Accounts vs Cloud IAM roles. Understand the tradeoffs for machine identity at scale.',
        ctaModule: 4,
        content: `
          <h1>Machine Identity Management: SPIFFE vs Vault vs Cloud IAM</h1>

          <p>Every organization needs to identify its services. But which approach is right? This guide compares the four most common machine identity strategies and explains when each excels.</p>

          <h2>SPIFFE/SPIRE</h2>
          <p><strong>Best for:</strong> Cross-platform workload identity, multi-cloud, service mesh integration, Kubernetes-native identity.</p>
          <ul>
            <li>Automatic identity issuance via attestation</li>
            <li>Short-lived certificates with zero manual rotation</li>
            <li>Works across Kubernetes, VMs, bare metal, and cloud providers</li>
            <li>CNCF graduated standard &mdash; vendor-neutral</li>
          </ul>

          <h2>HashiCorp Vault PKI</h2>
          <p><strong>Best for:</strong> Secret management combined with certificate issuance, organizations already using Vault.</p>
          <ul>
            <li>Strong secret storage and certificate management</li>
            <li>Rich policy system for secret access</li>
            <li>Requires Vault token distribution (creates its own secret management problem)</li>
            <li>Not a workload identity system &mdash; does not attest workloads</li>
          </ul>

          <h2>Kubernetes Service Accounts</h2>
          <p><strong>Best for:</strong> Simple single-cluster Kubernetes deployments.</p>
          <ul>
            <li>Built into Kubernetes &mdash; no extra infrastructure</li>
            <li>Limited to one cluster &mdash; no federation</li>
            <li>Not cryptographic certificates &mdash; cannot be used for mTLS</li>
            <li>Tokens were long-lived before Kubernetes 1.24</li>
          </ul>

          <h2>Cloud IAM (AWS IAM, GCP Workload Identity)</h2>
          <p><strong>Best for:</strong> Single-cloud deployments using cloud-native services.</p>
          <ul>
            <li>Deep integration with cloud provider services</li>
            <li>No infrastructure to manage</li>
            <li>Locked to one cloud provider &mdash; breaks in multi-cloud</li>
            <li>Not designed for service-to-service mTLS</li>
          </ul>

          <h2>Comparison Table</h2>

          <table>
            <thead><tr><th>Feature</th><th>SPIFFE/SPIRE</th><th>Vault PKI</th><th>K8s Service Accounts</th><th>Cloud IAM</th></tr></thead>
            <tbody>
              <tr><td>Workload attestation</td><td>Yes</td><td>No</td><td>Limited</td><td>Cloud-specific</td></tr>
              <tr><td>mTLS certificates</td><td>Yes (X.509-SVID)</td><td>Yes</td><td>No</td><td>No</td></tr>
              <tr><td>Automatic rotation</td><td>Yes</td><td>Yes (with agent)</td><td>Partial (1.24+)</td><td>Yes</td></tr>
              <tr><td>Multi-cloud</td><td>Yes</td><td>Yes</td><td>No</td><td>No</td></tr>
              <tr><td>Federation</td><td>Yes (native)</td><td>Manual</td><td>No</td><td>Cross-account only</td></tr>
              <tr><td>VM + Kubernetes</td><td>Yes</td><td>Yes</td><td>No</td><td>Partial</td></tr>
              <tr><td>Open standard</td><td>CNCF (SPIFFE)</td><td>Proprietary</td><td>K8s-native</td><td>Proprietary</td></tr>
            </tbody>
          </table>

          <h2>The Right Choice Depends on Your Needs</h2>

          <p>Use <strong>SPIFFE/SPIRE</strong> when you need cross-platform, multi-cloud, or multi-cluster workload identity. Use <strong>Vault</strong> when secret management is the primary concern. Use <strong>K8s Service Accounts</strong> for simple single-cluster deployments. Use <strong>Cloud IAM</strong> for cloud-native services within a single provider.</p>

          <p>For most organizations adopting zero trust, SPIFFE/SPIRE provides the most comprehensive and portable solution. Our free course teaches it from the ground up.</p>
        `,
      },
    ],
    modules: [
    {
      number: 1,
      title: 'Understanding Zero Trust Security',
      slug: 'understanding-zero-trust-security',
      subtitle: 'Why perimeter security fails and how identity-based security changes everything',
      duration: '3 hours',
      objectives: [
        'Understand why traditional perimeter security fails in cloud-native systems',
        'Learn the core principles of Zero Trust architecture',
        'Differentiate between human identity and workload identity',
        'Understand service-to-service authentication challenges',
      ],
      svgDiagram: '<svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg"><rect width="800" height="400" fill="#0f172a" rx="12"/><text x="400" y="30" text-anchor="middle" fill="#94a3b8" font-size="14" font-weight="bold">PERIMETER SECURITY vs ZERO TRUST</text><rect x="30" y="60" width="350" height="300" rx="8" fill="none" stroke="#ef4444" stroke-width="2" stroke-dasharray="8,4"/><text x="205" y="85" text-anchor="middle" fill="#ef4444" font-size="13" font-weight="bold">Perimeter Model (Broken)</text><rect x="60" y="110" width="120" height="50" rx="6" fill="#1e293b" stroke="#475569"/><text x="120" y="140" text-anchor="middle" fill="#e2e8f0" font-size="11">Service A</text><rect x="230" y="110" width="120" height="50" rx="6" fill="#1e293b" stroke="#475569"/><text x="290" y="140" text-anchor="middle" fill="#e2e8f0" font-size="11">Service B</text><line x1="180" y1="135" x2="230" y2="135" stroke="#22c55e" stroke-width="2"/><text x="205" y="125" text-anchor="middle" fill="#22c55e" font-size="9">Trusted (same network)</text><rect x="60" y="200" width="120" height="50" rx="6" fill="#1e293b" stroke="#ef4444" stroke-width="2"/><text x="120" y="220" text-anchor="middle" fill="#fca5a5" font-size="10">Compromised</text><text x="120" y="237" text-anchor="middle" fill="#fca5a5" font-size="10">Pod</text><line x1="180" y1="225" x2="230" y2="135" stroke="#ef4444" stroke-width="2"/><text x="220" y="185" text-anchor="middle" fill="#ef4444" font-size="9">Also trusted!</text><rect x="420" y="60" width="350" height="300" rx="8" fill="none" stroke="#22c55e" stroke-width="2"/><text x="595" y="85" text-anchor="middle" fill="#22c55e" font-size="13" font-weight="bold">Zero Trust Model (Secure)</text><rect x="450" y="110" width="120" height="50" rx="6" fill="#1e293b" stroke="#22c55e"/><text x="510" y="133" text-anchor="middle" fill="#e2e8f0" font-size="10">Service A</text><text x="510" y="148" text-anchor="middle" fill="#22c55e" font-size="9">SPIFFE ID verified</text><rect x="620" y="110" width="120" height="50" rx="6" fill="#1e293b" stroke="#22c55e"/><text x="680" y="133" text-anchor="middle" fill="#e2e8f0" font-size="10">Service B</text><text x="680" y="148" text-anchor="middle" fill="#22c55e" font-size="9">SPIFFE ID verified</text><line x1="570" y1="135" x2="620" y2="135" stroke="#22c55e" stroke-width="2"/><text x="595" y="125" text-anchor="middle" fill="#22c55e" font-size="9">mTLS + Identity</text><rect x="450" y="200" width="120" height="50" rx="6" fill="#1e293b" stroke="#ef4444" stroke-width="2"/><text x="510" y="220" text-anchor="middle" fill="#fca5a5" font-size="10">Compromised</text><text x="510" y="237" text-anchor="middle" fill="#fca5a5" font-size="10">Pod</text><line x1="570" y1="225" x2="620" y2="135" stroke="#ef4444" stroke-width="2" stroke-dasharray="6,3"/><text x="620" y="190" text-anchor="middle" fill="#ef4444" font-size="9">BLOCKED: No valid SVID</text></svg>',
      content: `
        <p>For decades, enterprise security followed a simple model: build a strong perimeter, trust everything inside it. Firewalls guarded the boundary. VPNs extended the trusted zone. If a request came from inside the network, it was assumed to be legitimate.</p>

        <p>This model is fundamentally broken in cloud-native systems. Containers spin up and down in seconds. Pods get random IP addresses. Services communicate across clusters, clouds, and regions. The &ldquo;perimeter&rdquo; does not exist anymore.</p>

        <h2>The Evolution of Enterprise Security</h2>

        <p>Enterprise security evolved through three eras:</p>

        <ul>
          <li><strong>Castle-and-Moat (1990s-2000s):</strong> Strong perimeter with firewalls. Trust everything inside the network. Works when servers are static and physical.</li>
          <li><strong>Defense in Depth (2000s-2010s):</strong> Multiple security layers. Network segmentation with VLANs. Still fundamentally trusts network location as a proxy for identity.</li>
          <li><strong>Zero Trust (2010s-present):</strong> Trust nothing. Verify every request. Identity is cryptographic, not network-based. Every service must prove who it is on every request.</li>
        </ul>

        <h2>Why Perimeter Security Fails</h2>

        <p>In a Kubernetes cluster, a pod&rsquo;s IP address changes every time it restarts. Auto-scaling creates new replicas with new IPs. Service mesh proxies forward traffic, masking the original source. Network policies can restrict which namespaces can communicate, but they cannot verify <em>which specific service</em> is making the request.</p>

        <p>The fundamental problem: <strong>network location is not identity</strong>. An attacker who compromises one pod in a namespace can impersonate any other pod in that namespace because network policies only check source/destination labels, not cryptographic identity.</p>

        <h2>Core Principles of Zero Trust</h2>

        <ol>
          <li><strong>Never trust, always verify:</strong> Every request must be authenticated and authorized, regardless of source location.</li>
          <li><strong>Least privilege access:</strong> Services get only the permissions they need, nothing more.</li>
          <li><strong>Assume breach:</strong> Design systems so that a compromised component cannot access everything.</li>
          <li><strong>Verify explicitly:</strong> Use cryptographic identity, not network properties, to authenticate services.</li>
          <li><strong>Continuous verification:</strong> Identity is verified on every request, not just at connection establishment.</li>
        </ol>

        <h2>Human Identity vs Workload Identity</h2>

        <p>We solved human identity years ago with SSO, OAuth, and multi-factor authentication. A developer logs in with their credentials and gets a token that proves who they are. But what about the services themselves?</p>

        <p><strong>Workload identity</strong> gives every service, container, and process its own cryptographic identity &mdash; just like a human has a username and password, a workload gets a cryptographic certificate. This identity is automatically issued, short-lived, automatically rotated, and cryptographically verifiable without a central authority.</p>

        <h2>The Identity Crisis in Distributed Systems</h2>

        <p>Without workload identity, teams resort to shared secrets in environment variables (leaked in logs, source control, and crash dumps), long-lived API keys (never rotated, shared across environments), service account tokens (broad permissions, no mutual verification), and IP-based allow lists (break with auto-scaling and container orchestration).</p>

        <p>Each of these is a security vulnerability waiting to happen. SPIFFE and SPIRE replace all of them with a single, standards-based identity system.</p>

        <h2>Zero Trust Maturity Model</h2>

        <table>
          <thead><tr><th>Level</th><th>Description</th><th>Technologies</th></tr></thead>
          <tbody>
            <tr><td>Level 0</td><td>No identity verification between services</td><td>Flat network, shared secrets</td></tr>
            <tr><td>Level 1</td><td>Network segmentation and basic auth</td><td>NetworkPolicies, API keys</td></tr>
            <tr><td>Level 2</td><td>Service-level mTLS with long-lived certs</td><td>cert-manager, Vault PKI</td></tr>
            <tr><td>Level 3</td><td>Automatic workload identity with short-lived certs</td><td>SPIFFE/SPIRE</td></tr>
            <tr><td>Level 4</td><td>Identity-aware authorization with policy engines</td><td>SPIRE + OPA + Envoy</td></tr>
          </tbody>
        </table>

        <p>This course takes you from Level 0 to Level 4.</p>

        <h2>What SPIFFE/SPIRE Does NOT Solve</h2>

        <p>Honest understanding of limitations builds real expertise:</p>

        <ul>
          <li><strong>Does not stop compromised workloads:</strong> If an attacker has code execution inside a legitimate workload, SPIFFE identity does not prevent the attacker from using that identity. Runtime security (Falco, seccomp) handles that layer.</li>
          <li><strong>Does not automatically provide authorization:</strong> SPIFFE proves identity. It does not decide what that identity is allowed to do. You need a policy engine (OPA) for authorization.</li>
          <li><strong>Does not replace runtime security:</strong> Container escape, privilege escalation, and lateral movement are addressed by runtime tools, not identity systems.</li>
          <li><strong>Does not eliminate policy design complexity:</strong> You still need to design who can talk to whom. SPIFFE makes enforcement possible &mdash; it does not design the rules for you.</li>
          <li><strong>Does not prevent all secret sprawl:</strong> Application-level secrets (database passwords, API keys for external services) still need management via Vault or similar tools.</li>
        </ul>

        <h2>Authentication vs Authorization: The Critical Distinction</h2>

        <table>
          <thead><tr><th>Responsibility</th><th>Tool</th><th>Question Answered</th></tr></thead>
          <tbody>
            <tr><td>Identity</td><td>SPIFFE (spec)</td><td>What is this workload called?</td></tr>
            <tr><td>Identity Issuance</td><td>SPIRE (runtime)</td><td>How does it get its identity?</td></tr>
            <tr><td>Authentication</td><td>mTLS / SVID verification</td><td>Is this really who they claim to be?</td></tr>
            <tr><td>Authorization</td><td>OPA / Policy Engine</td><td>Is this workload allowed to do this action?</td></tr>
          </tbody>
        </table>

        <p>Many learners wrongly assume SPIFFE equals authorization. It does not. SPIFFE handles identity and authentication. Authorization is a separate concern addressed in Module 7.</p>
      `,
      labs: [
        {
          title: 'Exploring Traditional vs Zero Trust Architectures',
          objective: 'Compare network-based security with identity-based security by observing service communication patterns.',
          repoPath: 'module-01/lab-01',
          steps: [
            'Deploy two services in a Kubernetes namespace without any security',
            'Observe that any pod can call any other pod without authentication',
            'Add NetworkPolicies and observe the limitations',
            'Discuss what is missing: identity verification and encryption',
          ],
        },
        {
          title: 'Inspecting Service Communication Flows',
          objective: 'Capture and inspect unencrypted service-to-service traffic to understand the attack surface.',
          repoPath: 'module-01/lab-02',
          steps: [
            'Deploy a simple microservice application (frontend + API + database)',
            'Use tcpdump to capture traffic between pods',
            'Observe unencrypted HTTP traffic with visible headers and payloads',
            'Document the security gaps: no encryption, no identity, no authorization',
          ],
        },
      ],
      keyTakeaways: [
        'Network location is not identity — IPs change, containers are ephemeral',
        'Zero trust requires cryptographic verification on every request',
        'Workload identity is the machine equivalent of human SSO',
        'SPIFFE/SPIRE provides the standards-based foundation for zero trust',
        'This course takes you from Level 0 (no identity) to Level 4 (full zero trust)',
      ],
      whyThisMatters: 'Modern distributed systems struggle with secret sprawl, certificate management, service authentication, and workload trust. Perimeter security fails when containers are ephemeral, IPs change constantly, and services span multiple clouds. By mastering zero trust fundamentals, you understand how modern cloud-native platforms establish secure machine identity at scale — a skill that is rapidly becoming essential for platform engineers, DevOps engineers, and security architects.',
      realWorldUseCases: [
        'Kubernetes workload authentication — proving pod identity without shared secrets',
        'Secure service mesh identity — mTLS between all services in a cluster',
        'Multi-cluster trust — workloads across clusters verifying each other',
        'Secure CI/CD pipelines — ephemeral build agents with cryptographic identity',
        'AI agent identity — autonomous AI systems authenticating to services',
      ],
      productionNotes: [
        'Network policies alone are NOT zero trust. They restrict traffic by label but cannot verify cryptographic identity. An attacker who compromises one pod with the right labels can impersonate any service.',
        'Start your zero trust journey with one critical service path (e.g., API → database), not the entire mesh. Incremental rollout reduces risk and builds team confidence.',
      ],
      commonMistakes: [
        'Treating network location as identity — IPs and namespaces are not cryptographic proof',
        'Using long-lived shared secrets in environment variables — they leak in logs, crash dumps, and source control',
        'Assuming Kubernetes NetworkPolicies provide zero trust — they only check labels, not cryptographic identity',
        'Trying to implement zero trust everywhere at once instead of incrementally',
        'Confusing authentication (who are you?) with authorization (what can you do?)',
      ],
      thinkLikeAnEngineer: [
        'If an attacker compromises one pod in your namespace, what can they access?',
        'How would you prove the identity of a service that was just auto-scaled 30 seconds ago?',
        'What happens to your security model when you move workloads between clouds?',
        'How is machine-to-machine authentication different from human-to-machine authentication?',
      ],
      securityRisks: [
        'Shared secrets in environment variables can be read by any process in the container',
        'Long-lived API keys are never rotated and accumulate over time',
        'IP-based allow lists break silently when containers restart with new IPs',
        'Service account tokens in Kubernetes pre-1.24 never expire',
      ],
      operationalStory: 'A financial services company running 500+ microservices on Kubernetes relied on shared API keys stored in environment variables. During a routine security audit, they discovered that 47 services had access to the payment processing key — 44 of them did not need it. A single compromised container could have accessed the payment system. After deploying SPIFFE/SPIRE, each service received its own cryptographic identity, and unauthorized access attempts were blocked and logged automatically.',
      careerRelevance: 'Platform engineering and Zero Trust security are two of the fastest-growing engineering disciplines. According to Gartner, by 2027, 70% of new access management deployments will use identity-based zero trust principles. Engineers who understand workload identity today are positioning themselves for the security and platform engineering roles of tomorrow — across Kubernetes platforms, service mesh environments, enterprise security architectures, and AI infrastructure systems.',
      beforeAfter: {
        before: ['Static secrets in environment variables', 'Shared certificates across services', 'Manual certificate rotation (or none at all)', 'Network location used as proxy for identity', 'IP-based firewall rules that break with auto-scaling'],
        after: ['Automatic cryptographic workload identity', 'Unique short-lived certificate per service', 'Automatic rotation before expiry', 'Cryptographic verification on every request', 'Identity follows the workload regardless of location'],
      },
      glossary: [
        { term: 'Zero Trust', definition: 'Security model that requires verification of every request regardless of source location' },
        { term: 'Workload Identity', definition: 'Cryptographic identity assigned to a service, container, or process' },
        { term: 'mTLS', definition: 'Mutual TLS — both client and server verify each other\'s certificates' },
        { term: 'Perimeter Security', definition: 'Traditional model that trusts everything inside the network boundary' },
        { term: 'SPIFFE', definition: 'Secure Production Identity Framework For Everyone — the open standard for workload identity' },
        { term: 'SVID', definition: 'SPIFFE Verifiable Identity Document — a certificate or JWT proving workload identity' },
      ],
    },
    {
      number: 2,
      title: 'Cryptography and PKI Foundations',
      slug: 'cryptography-pki-foundations',
      subtitle: 'The cryptographic building blocks that make SPIFFE possible',
      duration: '3.5 hours',
      objectives: [
        'Understand symmetric vs asymmetric encryption',
        'Learn how PKI and certificate authorities work',
        'Master X.509 certificates and certificate chains',
        'Implement mutual TLS between services',
      ],
      svgDiagram: '<svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg"><rect width="800" height="400" fill="#0f172a" rx="12"/><text x="400" y="30" text-anchor="middle" fill="#94a3b8" font-size="14" font-weight="bold">MUTUAL TLS (mTLS) HANDSHAKE</text><rect x="50" y="70" width="160" height="60" rx="8" fill="#1e293b" stroke="#3b82f6" stroke-width="2"/><text x="130" y="95" text-anchor="middle" fill="#93c5fd" font-size="12" font-weight="bold">Service A</text><text x="130" y="115" text-anchor="middle" fill="#64748b" font-size="10">Client (has cert)</text><rect x="590" y="70" width="160" height="60" rx="8" fill="#1e293b" stroke="#22c55e" stroke-width="2"/><text x="670" y="95" text-anchor="middle" fill="#86efac" font-size="12" font-weight="bold">Service B</text><text x="670" y="115" text-anchor="middle" fill="#64748b" font-size="10">Server (has cert)</text><line x1="210" y1="160" x2="590" y2="160" stroke="#3b82f6" stroke-width="2" marker-end="url(#arrow)"/><text x="400" y="155" text-anchor="middle" fill="#93c5fd" font-size="10">1. ClientHello + supported ciphers</text><line x1="590" y1="190" x2="210" y2="190" stroke="#22c55e" stroke-width="2" marker-end="url(#arrow)"/><text x="400" y="185" text-anchor="middle" fill="#86efac" font-size="10">2. ServerHello + server certificate</text><line x1="590" y1="220" x2="210" y2="220" stroke="#22c55e" stroke-width="2" marker-end="url(#arrow)"/><text x="400" y="215" text-anchor="middle" fill="#86efac" font-size="10">3. CertificateRequest (mTLS only!)</text><line x1="210" y1="250" x2="590" y2="250" stroke="#3b82f6" stroke-width="2" marker-end="url(#arrow)"/><text x="400" y="245" text-anchor="middle" fill="#93c5fd" font-size="10">4. Client certificate + key exchange</text><line x1="210" y1="280" x2="590" y2="280" stroke="#a855f7" stroke-width="2"/><line x1="590" y1="280" x2="210" y2="280" stroke="#a855f7" stroke-width="2"/><text x="400" y="275" text-anchor="middle" fill="#c084fc" font-size="10">5. Both sides verify each other = mTLS established</text><rect x="150" y="310" width="500" height="50" rx="8" fill="#22c55e" fill-opacity="0.1" stroke="#22c55e" stroke-width="1"/><text x="400" y="335" text-anchor="middle" fill="#22c55e" font-size="11" font-weight="bold">Encrypted + Mutually Authenticated Channel</text><text x="400" y="352" text-anchor="middle" fill="#64748b" font-size="9">Both services proved their identity with cryptographic certificates</text><defs><marker id="arrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill="#94a3b8"/></marker></defs></svg>',
      content: `
        <p>Before diving into SPIFFE and SPIRE, you need to understand the cryptographic primitives they are built on. This module covers the essential building blocks: encryption, certificates, PKI, and mutual TLS.</p>

        <h2>Cryptography Fundamentals</h2>

        <h3>Symmetric Encryption</h3>
        <p>Both parties share the <strong>same secret key</strong> for encryption and decryption. Fast but has a key distribution problem &mdash; how do you securely share the key in the first place?</p>

        <pre><code># AES-256 symmetric encryption
# Same key encrypts and decrypts
# Problem: how does Service B get the key securely?
plaintext -> [AES-256 + key] -> ciphertext -> [AES-256 + same key] -> plaintext</code></pre>

        <h3>Asymmetric Encryption</h3>
        <p>Two mathematically linked keys: a <strong>public key</strong> (shared openly) and a <strong>private key</strong> (kept secret). Data encrypted with the public key can only be decrypted with the private key. This solves the key distribution problem.</p>

        <pre><code># RSA / ECDSA asymmetric encryption
# Public key encrypts, private key decrypts
# Anyone can encrypt, only the key holder can decrypt
plaintext -> [encrypt with public key] -> ciphertext -> [decrypt with private key] -> plaintext

# Digital signatures work in reverse:
# Private key signs, public key verifies
data -> [sign with private key] -> signature
(data + signature) -> [verify with public key] -> valid/invalid</code></pre>

        <h2>Public Key Infrastructure (PKI)</h2>

        <p>PKI is the system of certificate authorities, certificates, and trust relationships that makes asymmetric encryption practical at scale.</p>

        <ul>
          <li><strong>Root Certificate Authority (Root CA):</strong> The ultimate trust anchor. Its certificate is self-signed and pre-installed in trust stores.</li>
          <li><strong>Intermediate CA:</strong> Signed by the Root CA. Issues certificates to end entities. Allows the Root CA to stay offline.</li>
          <li><strong>End Entity Certificate:</strong> Issued to a service, server, or workload. Contains the public key, identity information, and the issuing CA&rsquo;s signature.</li>
        </ul>

        <h2>X.509 Certificates Explained</h2>

        <p>X.509 is the standard format for public key certificates. Every HTTPS connection uses X.509 certificates. SPIFFE X.509-SVIDs are X.509 certificates with a SPIFFE ID in the URI SAN field.</p>

        <pre><code># Key fields in an X.509 certificate:
Subject:     CN=service-a.example.com
Issuer:      CN=Intermediate CA
Not Before:  2026-04-28 00:00:00 UTC
Not After:   2026-04-29 00:00:00 UTC   # Short-lived!
Public Key:  EC P-256 (the service's public key)
SAN:         URI: spiffe://example.org/ns/default/sa/service-a
Signature:   (signed by the Intermediate CA's private key)</code></pre>

        <h2>Mutual TLS (mTLS)</h2>

        <p>Regular TLS (HTTPS) only verifies the <strong>server</strong>. The client checks the server&rsquo;s certificate but does not present one of its own. Mutual TLS requires <strong>both sides</strong> to present and verify certificates. This is the foundation of zero trust service-to-service communication.</p>

        <h2>Certificate Rotation</h2>

        <p>Long-lived certificates are a security risk. If a certificate is compromised, the attacker has access until it expires &mdash; which could be years. Short-lived certificates (1 hour or less) limit the blast radius. But short-lived certificates require automatic rotation, which is exactly what SPIRE provides.</p>

        <h2>JWT Fundamentals</h2>

        <p>JSON Web Tokens are an alternative identity format used when X.509 is impractical (like HTTP APIs without TLS termination control). A JWT-SVID contains the SPIFFE ID in the <code>sub</code> claim and is signed by the SPIRE server.</p>
      `,
      labs: [
        {
          title: 'Creating a Root Certificate Authority',
          objective: 'Build a PKI hierarchy from scratch using OpenSSL.',
          repoPath: 'module-02/lab-01',
          steps: [
            'Generate a Root CA private key and self-signed certificate',
            'Generate an Intermediate CA key and CSR',
            'Sign the Intermediate CA certificate with the Root CA',
            'Verify the certificate chain',
          ],
        },
        {
          title: 'Generating and Signing Certificates',
          objective: 'Issue end-entity certificates for services.',
          repoPath: 'module-02/lab-02',
          steps: [
            'Generate a private key for a service',
            'Create a CSR with SPIFFE ID in the SAN field',
            'Sign the certificate with the Intermediate CA',
            'Inspect the certificate with openssl x509 -text',
          ],
        },
        {
          title: 'Establishing mTLS Between Services',
          objective: 'Configure two services to mutually authenticate with certificates.',
          repoPath: 'module-02/lab-03',
          steps: [
            'Start a TLS server that requires client certificates',
            'Start a TLS client that presents its certificate',
            'Verify that both sides authenticate each other',
            'Observe the connection failing with an invalid or missing certificate',
          ],
        },
      ],
      keyTakeaways: [
        'Asymmetric encryption solves the key distribution problem',
        'PKI provides a scalable trust hierarchy for certificate management',
        'X.509 certificates bind a public key to an identity',
        'mTLS authenticates BOTH client and server — the foundation of zero trust',
        'Short-lived certificates limit blast radius but require automatic rotation',
        'SPIFFE uses X.509 and JWT as its two SVID formats',
      ],
      whyThisMatters: 'Every identity system in cloud-native infrastructure — mTLS, JWT authentication, certificate rotation, federation — is built on these cryptographic primitives. Without understanding PKI and certificate chains, SPIRE configurations feel like magic incantations. With this foundation, you will understand WHY SPIRE makes specific design choices and how to debug certificate failures in production.',
      realWorldUseCases: [
        'Service-to-service mTLS in Kubernetes — encrypted and authenticated communication',
        'API gateway JWT verification — validating service identity at the edge',
        'Certificate rotation in production — preventing outages from expired certs',
        'Cross-cluster trust establishment — sharing CA trust bundles for federation',
      ],
      productionNotes: [
        'Never use self-signed certificates for end-entity SVIDs in production. Always use a proper CA hierarchy with an offline Root CA and online Intermediate CA.',
        'Certificate TTL should be as short as your rotation mechanism supports. SPIRE defaults to 1 hour — this is a good production baseline.',
        'Always verify the full certificate chain, not just the end-entity certificate. Chain verification prevents man-in-the-middle attacks with rogue CAs.',
      ],
      commonMistakes: [
        'Using RSA-2048 when ECDSA P-256 is faster and equally secure for short-lived certificates',
        'Storing CA private keys on disk without hardware security module (HSM) protection',
        'Not monitoring certificate expiration — silent expiry causes sudden production outages',
        'Confusing certificate authentication with certificate authorization — a valid cert proves identity, not permissions',
      ],
      designTradeoffs: [
        { option: 'X.509-SVID', pros: ['Native mTLS support', 'No extra headers needed', 'Works at the transport layer', 'Ecosystem compatible'], cons: ['Certificate management complexity', 'Heavier than JWTs', 'Requires TLS termination control'] },
        { option: 'JWT-SVID', pros: ['Lightweight token', 'Easy to pass in HTTP headers', 'Works with API gateways', 'No TLS termination needed'], cons: ['Weaker transport guarantees', 'Requires token validation', 'Clock synchronization dependency'] },
      ],
      glossary: [
        { term: 'PKI', definition: 'Public Key Infrastructure — the system of CAs, certificates, and trust relationships' },
        { term: 'Root CA', definition: 'The ultimate trust anchor with a self-signed certificate' },
        { term: 'Intermediate CA', definition: 'Signed by Root CA, issues end-entity certificates' },
        { term: 'X.509', definition: 'Standard format for public key certificates' },
        { term: 'SAN', definition: 'Subject Alternative Name — field in X.509 containing SPIFFE ID' },
        { term: 'Certificate Chain', definition: 'Sequence from end-entity cert through intermediates to root' },
      ],
      careerRelevance: 'PKI and certificate management are foundational skills for security engineering, platform engineering, and SRE roles. Organizations running Kubernetes at scale need engineers who can debug certificate chain failures, design CA hierarchies, and implement automatic rotation. This module gives you that foundation.',
    },    {
      number: 3,
      title: 'SPIFFE Fundamentals',
      slug: 'spiffe-fundamentals',
      subtitle: 'The specification that defines how workload identity works',
      duration: '3 hours',
      objectives: [
        'Understand the SPIFFE specification and its components',
        'Learn SPIFFE ID format and trust domains',
        'Master X.509-SVIDs and JWT-SVIDs',
        'Use the SPIFFE Workload API',
      ],
      svgDiagram: '<svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg"><rect width="800" height="400" fill="#0f172a" rx="12"/><text x="400" y="30" text-anchor="middle" fill="#94a3b8" font-size="14" font-weight="bold">SPIFFE IDENTITY ARCHITECTURE</text><rect x="250" y="50" width="300" height="50" rx="8" fill="#1e293b" stroke="#a855f7" stroke-width="2"/><text x="400" y="80" text-anchor="middle" fill="#c084fc" font-size="12" font-weight="bold">Trust Domain: example.org</text><rect x="50" y="140" width="200" height="70" rx="8" fill="#1e293b" stroke="#3b82f6" stroke-width="2"/><text x="150" y="165" text-anchor="middle" fill="#93c5fd" font-size="11" font-weight="bold">X.509-SVID</text><text x="150" y="185" text-anchor="middle" fill="#64748b" font-size="9">Certificate + Private Key</text><text x="150" y="198" text-anchor="middle" fill="#64748b" font-size="9">For mTLS connections</text><rect x="300" y="140" width="200" height="70" rx="8" fill="#1e293b" stroke="#22c55e" stroke-width="2"/><text x="400" y="165" text-anchor="middle" fill="#86efac" font-size="11" font-weight="bold">JWT-SVID</text><text x="400" y="185" text-anchor="middle" fill="#64748b" font-size="9">Signed JWT Token</text><text x="400" y="198" text-anchor="middle" fill="#64748b" font-size="9">For HTTP APIs</text><rect x="550" y="140" width="200" height="70" rx="8" fill="#1e293b" stroke="#f97316" stroke-width="2"/><text x="650" y="165" text-anchor="middle" fill="#fdba74" font-size="11" font-weight="bold">Trust Bundle</text><text x="650" y="185" text-anchor="middle" fill="#64748b" font-size="9">CA certificates</text><text x="650" y="198" text-anchor="middle" fill="#64748b" font-size="9">For verification</text><rect x="200" y="260" width="400" height="50" rx="8" fill="#1e293b" stroke="#06b6d4" stroke-width="2"/><text x="400" y="290" text-anchor="middle" fill="#67e8f9" font-size="12" font-weight="bold">SPIFFE Workload API (Unix Domain Socket)</text><rect x="100" y="340" width="150" height="40" rx="6" fill="#1e293b" stroke="#475569"/><text x="175" y="365" text-anchor="middle" fill="#e2e8f0" font-size="10">Workload A</text><rect x="325" y="340" width="150" height="40" rx="6" fill="#1e293b" stroke="#475569"/><text x="400" y="365" text-anchor="middle" fill="#e2e8f0" font-size="10">Workload B</text><rect x="550" y="340" width="150" height="40" rx="6" fill="#1e293b" stroke="#475569"/><text x="625" y="365" text-anchor="middle" fill="#e2e8f0" font-size="10">Workload C</text><line x1="175" y1="340" x2="300" y2="310" stroke="#67e8f9" stroke-width="1.5"/><line x1="400" y1="340" x2="400" y2="310" stroke="#67e8f9" stroke-width="1.5"/><line x1="625" y1="340" x2="500" y2="310" stroke="#67e8f9" stroke-width="1.5"/><line x1="150" y1="210" x2="300" y2="260" stroke="#3b82f6" stroke-width="1.5" stroke-dasharray="4,3"/><line x1="400" y1="210" x2="400" y2="260" stroke="#22c55e" stroke-width="1.5" stroke-dasharray="4,3"/><line x1="650" y1="210" x2="500" y2="260" stroke="#f97316" stroke-width="1.5" stroke-dasharray="4,3"/></svg>',
      content: `
        <p>SPIFFE (Secure Production Identity Framework For Everyone) is a set of open standards that define how workloads identify themselves to each other. It does not prescribe an implementation &mdash; it defines the <em>what</em>, and projects like SPIRE implement the <em>how</em>.</p>

        <h2>What Problems Does SPIFFE Solve?</h2>

        <p>Before SPIFFE, every organization invented its own way to identify services: custom PKI, Vault-issued secrets, Kubernetes service account tokens, cloud IAM roles, or plain shared passwords. None of these were interoperable, standardized, or designed for cross-platform workload identity. SPIFFE provides a universal identity format that works across Kubernetes, VMs, bare metal, and cloud providers.</p>

        <h2>SPIFFE Trust Domains</h2>

        <p>A trust domain is the root of trust for a set of workloads. It is identified by a domain name and corresponds to one SPIFFE identity authority (like a SPIRE server).</p>

        <pre><code># Trust domain format:
spiffe://example.org

# All workloads in this trust domain share the same root CA
# Cross-trust-domain communication requires federation</code></pre>

        <h2>SPIFFE IDs</h2>

        <p>A SPIFFE ID is a URI that uniquely identifies a workload within a trust domain:</p>

        <pre><code># Format: spiffe://trust-domain/path

# Examples:
spiffe://example.org/ns/production/sa/api-server
spiffe://example.org/ns/staging/sa/web-frontend
spiffe://payments.example.org/region/us-east/service/processor

# The path is arbitrary but typically encodes:
# - Namespace
# - Service account
# - Environment
# - Region</code></pre>

        <h2>SPIFFE Verifiable Identity Documents (SVIDs)</h2>

        <p>An SVID is the document that proves a workload&rsquo;s identity. SPIFFE defines two formats:</p>

        <h3>X.509-SVID</h3>
        <p>An X.509 certificate with the SPIFFE ID in the URI SAN (Subject Alternative Name) field. Used for mTLS connections where both sides present certificates.</p>

        <h3>JWT-SVID</h3>
        <p>A signed JWT with the SPIFFE ID in the <code>sub</code> claim. Used for HTTP APIs where the identity is passed in a header rather than established at the TLS layer.</p>

        <h2>The SPIFFE Workload API</h2>

        <p>The Workload API is how workloads request and receive their identities. It is exposed as a <strong>Unix domain socket</strong> &mdash; no network communication, no credentials needed. The identity provider (like SPIRE Agent) authenticates the workload by inspecting the calling process (PID, user, container ID) and returns the appropriate SVID.</p>

        <pre><code># The Workload API provides:
# 1. FetchX509SVID    - Get the workload's X.509 certificate
# 2. FetchJWTSVID     - Get a JWT token for the workload
# 3. FetchX509Bundles - Get trust bundles for verification
# 4. ValidateJWTSVID  - Validate a received JWT token

# No credentials needed to call the API!
# The Agent identifies the workload by its process attributes</code></pre>

        <h2>Identity Lifecycle</h2>

        <p>Understanding the full lifecycle is critical for production operations:</p>

        <ol>
          <li><strong>Workload Creation:</strong> A pod starts on a Kubernetes node</li>
          <li><strong>Workload Attestation:</strong> SPIRE Agent inspects the process and matches it to a registration entry</li>
          <li><strong>SVID Issuance:</strong> SPIRE Server signs and issues an X.509 certificate or JWT</li>
          <li><strong>Identity Active:</strong> The workload uses its SVID for mTLS and authentication</li>
          <li><strong>Automatic Rotation:</strong> Before the SVID expires, SPIRE issues a new one transparently</li>
          <li><strong>Workload Termination:</strong> When the pod is deleted, the SVID naturally expires (short-lived = no revocation needed)</li>
        </ol>

        <p>This lifecycle is fully automatic. No human intervention. No certificate renewal tickets. No expiry alerts. SPIRE handles it end-to-end.</p>

        <h2>SPIFFE Federation</h2>

        <p>When workloads in different trust domains need to communicate, they use <strong>federation</strong>. Each trust domain shares its trust bundle (CA certificates) with the other, allowing cross-domain SVID verification without merging the domains.</p>
      `,
      labs: [
        {
          title: 'Exploring SPIFFE IDs',
          objective: 'Understand SPIFFE ID format and naming conventions.',
          repoPath: 'module-03/lab-01',
          steps: [
            'Design SPIFFE ID schemas for a microservice application',
            'Map Kubernetes namespaces and service accounts to SPIFFE ID paths',
            'Validate SPIFFE IDs against the specification',
          ],
        },
        {
          title: 'Working with SVID Formats',
          objective: 'Inspect and compare X.509-SVIDs and JWT-SVIDs.',
          repoPath: 'module-03/lab-02',
          steps: [
            'Generate a sample X.509-SVID and inspect its SAN field',
            'Generate a sample JWT-SVID and decode its claims',
            'Compare the two formats and discuss when to use each',
          ],
        },
      ],
      keyTakeaways: [
        'SPIFFE is a specification, not an implementation — SPIRE is the implementation',
        'Trust domains are the root of trust, identified by a domain name',
        'SPIFFE IDs are URIs: spiffe://trust-domain/path',
        'X.509-SVIDs are for mTLS, JWT-SVIDs are for HTTP APIs',
        'The Workload API uses Unix domain sockets — no credentials needed',
        'Federation enables cross-trust-domain communication',
      ],
      whyThisMatters: 'SPIFFE is the specification that every SPIRE deployment implements. Understanding SPIFFE means you can evaluate any workload identity solution — not just SPIRE — and make informed architecture decisions. This module teaches you the standard itself, so your knowledge transcends any single implementation.',
      realWorldUseCases: ['Multi-cloud identity — same SPIFFE IDs work across AWS, GCP, Azure', 'Kubernetes to VM communication — heterogeneous environments sharing trust', 'Cross-organization federation — partner services verifying each other', 'Service mesh identity layer — SPIFFE as the foundation for Istio/Linkerd identity'],
      commonMistakes: ['Incorrect trust domain naming — using internal hostnames instead of stable domain names', 'Hardcoding SPIFFE IDs in application code instead of using selectors', 'Using JWT-SVID where X.509-SVID is required (e.g., for mTLS)', 'Not planning SPIFFE ID path schemas before deployment — hard to change later', 'Confusing SPIFFE (the spec) with SPIRE (the implementation)'],
      thinkLikeAnEngineer: ['How should you name your trust domains for a multi-cluster, multi-cloud organization?', 'When should you use X.509-SVIDs vs JWT-SVIDs for a given service interaction?', 'How would you design SPIFFE ID paths that support both Kubernetes and VM workloads?', 'What happens when a trust domain needs to be renamed or split?'],
      glossary: [{ term: 'Trust Domain', definition: 'The root of trust, identified by a domain name, corresponding to one identity authority' }, { term: 'SPIFFE ID', definition: 'A URI (spiffe://trust-domain/path) uniquely identifying a workload' }, { term: 'X.509-SVID', definition: 'Certificate-based identity document for mTLS' }, { term: 'JWT-SVID', definition: 'Token-based identity document for HTTP APIs' }, { term: 'Workload API', definition: 'Unix domain socket API for workloads to request identities' }, { term: 'Federation', definition: 'Cross-trust-domain trust via bundle exchange' }],
      careerRelevance: 'SPIFFE is a CNCF standard adopted by Bloomberg, Uber, Pinterest, and ByteDance. Understanding the specification — not just the implementation — marks the difference between an engineer who follows tutorials and one who designs identity architectures.',
    },
    {
      number: 4,
      title: 'SPIRE Architecture and Components',
      slug: 'spire-architecture-components',
      subtitle: 'How SPIRE implements the SPIFFE specification in production',
      duration: '3.5 hours',
      objectives: [
        'Understand SPIRE Server and Agent architecture',
        'Learn node attestation and workload attestation',
        'Configure registration entries',
        'Master the SPIRE plugin framework',
      ],
      svgDiagram: '<svg viewBox="0 0 800 450" xmlns="http://www.w3.org/2000/svg"><rect width="800" height="450" fill="#0f172a" rx="12"/><text x="400" y="30" text-anchor="middle" fill="#94a3b8" font-size="14" font-weight="bold">SPIRE ARCHITECTURE</text><rect x="250" y="50" width="300" height="100" rx="10" fill="#1e293b" stroke="#a855f7" stroke-width="2"/><text x="400" y="75" text-anchor="middle" fill="#c084fc" font-size="13" font-weight="bold">SPIRE Server</text><text x="400" y="95" text-anchor="middle" fill="#94a3b8" font-size="10">CA / Registration API / Datastore</text><text x="400" y="112" text-anchor="middle" fill="#94a3b8" font-size="10">Node Attestation / SVID Signing</text><rect x="50" y="220" width="200" height="80" rx="8" fill="#1e293b" stroke="#3b82f6" stroke-width="2"/><text x="150" y="248" text-anchor="middle" fill="#93c5fd" font-size="12" font-weight="bold">SPIRE Agent</text><text x="150" y="268" text-anchor="middle" fill="#94a3b8" font-size="9">Node 1 (DaemonSet)</text><text x="150" y="282" text-anchor="middle" fill="#94a3b8" font-size="9">Workload API socket</text><rect x="300" y="220" width="200" height="80" rx="8" fill="#1e293b" stroke="#3b82f6" stroke-width="2"/><text x="400" y="248" text-anchor="middle" fill="#93c5fd" font-size="12" font-weight="bold">SPIRE Agent</text><text x="400" y="268" text-anchor="middle" fill="#94a3b8" font-size="9">Node 2 (DaemonSet)</text><text x="400" y="282" text-anchor="middle" fill="#94a3b8" font-size="9">Workload API socket</text><rect x="550" y="220" width="200" height="80" rx="8" fill="#1e293b" stroke="#3b82f6" stroke-width="2"/><text x="650" y="248" text-anchor="middle" fill="#93c5fd" font-size="12" font-weight="bold">SPIRE Agent</text><text x="650" y="268" text-anchor="middle" fill="#94a3b8" font-size="9">Node 3 (DaemonSet)</text><text x="650" y="282" text-anchor="middle" fill="#94a3b8" font-size="9">Workload API socket</text><line x1="150" y1="220" x2="320" y2="150" stroke="#a855f7" stroke-width="1.5"/><line x1="400" y1="220" x2="400" y2="150" stroke="#a855f7" stroke-width="1.5"/><line x1="650" y1="220" x2="480" y2="150" stroke="#a855f7" stroke-width="1.5"/><text x="220" y="185" fill="#94a3b8" font-size="9">Node Attestation</text><rect x="50" y="350" width="90" height="40" rx="6" fill="#1e293b" stroke="#22c55e"/><text x="95" y="375" text-anchor="middle" fill="#86efac" font-size="9">Pod A</text><rect x="160" y="350" width="90" height="40" rx="6" fill="#1e293b" stroke="#22c55e"/><text x="205" y="375" text-anchor="middle" fill="#86efac" font-size="9">Pod B</text><rect x="300" y="350" width="90" height="40" rx="6" fill="#1e293b" stroke="#22c55e"/><text x="345" y="375" text-anchor="middle" fill="#86efac" font-size="9">Pod C</text><rect x="410" y="350" width="90" height="40" rx="6" fill="#1e293b" stroke="#22c55e"/><text x="455" y="375" text-anchor="middle" fill="#86efac" font-size="9">Pod D</text><line x1="95" y1="350" x2="120" y2="300" stroke="#22c55e" stroke-width="1" stroke-dasharray="3,2"/><line x1="205" y1="350" x2="170" y2="300" stroke="#22c55e" stroke-width="1" stroke-dasharray="3,2"/><line x1="345" y1="350" x2="370" y2="300" stroke="#22c55e" stroke-width="1" stroke-dasharray="3,2"/><line x1="455" y1="350" x2="430" y2="300" stroke="#22c55e" stroke-width="1" stroke-dasharray="3,2"/><text x="150" y="335" text-anchor="middle" fill="#64748b" font-size="8">Workload Attestation</text></svg>',
      content: `
        <p>SPIRE (SPIFFE Runtime Environment) is the production implementation of the SPIFFE specification. It is a CNCF graduated project and the most widely deployed SPIFFE-compliant identity provider. This module takes you inside SPIRE&rsquo;s architecture.</p>

        <h2>SPIRE Server</h2>

        <p>The SPIRE Server is the central control plane. It is responsible for managing registration entries (which workloads get which SPIFFE IDs), performing node attestation (verifying that SPIRE Agents are running on legitimate nodes), signing SVIDs (issuing X.509 certificates and JWTs), maintaining the trust bundle (the CA certificates that verify SVIDs), and storing state in a datastore (SQLite, PostgreSQL, or MySQL).</p>

        <h2>SPIRE Agent</h2>

        <p>The SPIRE Agent runs on every node (as a DaemonSet in Kubernetes). It is responsible for performing workload attestation (verifying which process is requesting an identity), exposing the SPIFFE Workload API (Unix domain socket), caching SVIDs for registered workloads, and rotating certificates before they expire.</p>

        <h2>Node Attestation</h2>

        <p>When a SPIRE Agent starts, it must prove to the SPIRE Server that it is running on a legitimate node. This is <strong>node attestation</strong>.</p>

        <pre><code># Kubernetes node attestation:
# Agent presents: Kubernetes service account token
# Server verifies: token with the Kubernetes API server

# AWS node attestation:
# Agent presents: AWS instance identity document
# Server verifies: document with AWS STS

# Azure node attestation:
# Agent presents: Azure MSI token
# Server verifies: token with Azure AD</code></pre>

        <h2>Workload Attestation</h2>

        <p>When a workload calls the Workload API, the SPIRE Agent must verify the workload&rsquo;s identity. This is <strong>workload attestation</strong>.</p>

        <pre><code># Kubernetes workload attestation:
# Agent inspects: pod namespace, service account, labels, node
# Matches against: registration entries

# Unix workload attestation:
# Agent inspects: PID, UID, GID, binary path
# Matches against: registration entries</code></pre>

        <h2>Registration Entries</h2>

        <p>A registration entry maps a set of workload attributes (selectors) to a SPIFFE ID:</p>

        <pre><code># Register a workload:
spire-server entry create \\
  -spiffeID spiffe://example.org/ns/default/sa/api-server \\
  -parentID spiffe://example.org/agent/node-1 \\
  -selector k8s:ns:default \\
  -selector k8s:sa:api-server

# This says: any pod in namespace "default" with service account
# "api-server" running on a node attested as "node-1" gets the
# SPIFFE ID spiffe://example.org/ns/default/sa/api-server</code></pre>

        <h2>SPIRE Plugin Framework</h2>

        <p>SPIRE uses a plugin architecture for extensibility. Node attestors, workload attestors, key managers, upstream authorities, and datastores are all pluggable. This allows SPIRE to work across cloud providers, orchestrators, and deployment models.</p>

        <h2>Deployment Models</h2>

        <ul>
          <li><strong>Single cluster:</strong> One SPIRE Server, Agents on every node</li>
          <li><strong>Nested SPIRE:</strong> A hierarchy of SPIRE Servers for multi-tier architectures</li>
          <li><strong>Federated SPIRE:</strong> Multiple independent SPIRE deployments that trust each other</li>
        </ul>
      `,
      labs: [
        {
          title: 'Installing SPIRE from Binaries',
          objective: 'Install and run SPIRE Server and Agent on a local machine.',
          repoPath: 'module-04/lab-01',
          steps: [
            'Download SPIRE release binaries',
            'Configure SPIRE Server with SQLite datastore',
            'Configure SPIRE Agent with join token attestor',
            'Start the server and agent, verify they connect',
          ],
        },
        {
          title: 'Configuring Registration Entries',
          objective: 'Register workloads and assign SPIFFE IDs.',
          repoPath: 'module-04/lab-02',
          steps: [
            'Create a registration entry for a demo workload',
            'Verify the entry with spire-server entry show',
            'Run the demo workload and confirm it receives an SVID',
            'Inspect the SVID with openssl',
          ],
        },
        {
          title: 'Attesting Nodes and Workloads',
          objective: 'Observe the full attestation flow.',
          repoPath: 'module-04/lab-03',
          steps: [
            'Enable debug logging on SPIRE Server and Agent',
            'Restart the agent and observe node attestation logs',
            'Run a workload and observe workload attestation logs',
            'Intentionally fail attestation and observe the error',
          ],
        },
      ],
      keyTakeaways: [
        'SPIRE Server is the control plane — manages registrations and signs SVIDs',
        'SPIRE Agent runs on every node — exposes the Workload API to local workloads',
        'Node attestation proves the Agent is on a legitimate node',
        'Workload attestation proves the calling process matches a registration entry',
        'Registration entries map selectors to SPIFFE IDs',
        'SPIRE is plugin-based — supports multiple clouds, orchestrators, and datastores',
      ],
      whyThisMatters: 'SPIRE is the runtime engine behind workload identity. Understanding its internals — Server/Agent separation, attestation flows, registration entries — is the difference between following a tutorial and operating SPIRE confidently in production. When something breaks at 2 AM, you need to know WHERE to look.',
      realWorldUseCases: ['Enterprise Kubernetes identity — attesting pods via service accounts', 'VM workload identity — attesting bare-metal servers via cloud instance documents', 'Hybrid cloud — mixed Kubernetes + VM environments sharing one trust domain', 'CI/CD pipeline attestation — build agents receiving ephemeral identities'],
      commonMistakes: ['Using SQLite datastore in production (use PostgreSQL for HA)', 'Not enabling debug logging during initial deployment — makes troubleshooting impossible', 'Creating overly broad registration selectors that match unintended workloads', 'Forgetting to create a registration entry before expecting a workload to get an SVID', 'Running SPIRE Agent as a sidecar instead of a DaemonSet (wastes resources, complicates management)'],
      productionNotes: ['Always use a shared database (PostgreSQL/MySQL) for SPIRE Server in production. SQLite does not support HA.', 'SPIRE Agent should run as a DaemonSet — one per node, not one per pod. It serves all workloads on the node via the Unix socket.', 'Use the k8s_psat node attestor for Kubernetes. It is more secure than join tokens because it leverages Kubernetes projected service account tokens.'],
      thinkLikeAnEngineer: ['Why does SPIRE separate Server and Agent instead of running a single process?', 'What are the security implications of running SPIRE Agent with hostPID access?', 'How would you design registration entries for a microservice application with 50 services across 3 namespaces?'],
      securityRisks: ['Compromised SPIRE Agent can issue SVIDs for any registered workload on that node', 'Registration entries with overly broad selectors can grant identity to unintended workloads', 'SPIRE Server datastore contains all registration entries — protect it like a CA'],
      operationalStory: 'A SaaS company deploying SPIRE for the first time used join token attestation in production. Every time a node was replaced by the auto-scaler, someone had to manually generate and deploy a new join token. After switching to k8s_psat attestation, new nodes joined automatically — zero manual intervention, zero downtime.',
      glossary: [{ term: 'SPIRE Server', definition: 'Central control plane that manages registrations and signs SVIDs' }, { term: 'SPIRE Agent', definition: 'Node-local process that exposes the Workload API' }, { term: 'Node Attestation', definition: 'Process of proving an Agent runs on a legitimate node' }, { term: 'Workload Attestation', definition: 'Process of matching a calling process to a registration entry' }, { term: 'Registration Entry', definition: 'Maps selectors (pod attributes) to a SPIFFE ID' }, { term: 'Selector', definition: 'Attribute used to identify workloads (e.g., k8s:ns:default)' }],
    },    {
      number: 5,
      title: 'Running SPIRE on Kubernetes',
      slug: 'running-spire-on-kubernetes',
      subtitle: 'Deploy and operate SPIRE in real Kubernetes clusters',
      duration: '4 hours',
      objectives: [
        'Deploy SPIRE Server and Agent on Kubernetes',
        'Configure Kubernetes workload and node attestors',
        'Use SPIRE Controller Manager for automatic registration',
        'Retrieve SVIDs inside pods',
      ],
      svgDiagram: '<svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg"><rect width="800" height="400" fill="#0f172a" rx="12"/><text x="400" y="28" text-anchor="middle" fill="#94a3b8" font-size="14" font-weight="bold">SPIRE ON KUBERNETES</text><rect x="30" y="50" width="740" height="330" rx="10" fill="none" stroke="#3b82f6" stroke-width="2" stroke-dasharray="6,3"/><text x="60" y="72" fill="#3b82f6" font-size="11" font-weight="bold">Kubernetes Cluster</text><rect x="280" y="85" width="240" height="65" rx="8" fill="#1e293b" stroke="#a855f7" stroke-width="2"/><text x="400" y="110" text-anchor="middle" fill="#c084fc" font-size="12" font-weight="bold">SPIRE Server (StatefulSet)</text><text x="400" y="130" text-anchor="middle" fill="#94a3b8" font-size="9">+ Controller Manager + Datastore</text><rect x="50" y="200" width="180" height="55" rx="8" fill="#1e293b" stroke="#22c55e" stroke-width="2"/><text x="140" y="225" text-anchor="middle" fill="#86efac" font-size="11" font-weight="bold">Agent (DaemonSet)</text><text x="140" y="240" text-anchor="middle" fill="#94a3b8" font-size="9">Node 1</text><rect x="270" y="200" width="180" height="55" rx="8" fill="#1e293b" stroke="#22c55e" stroke-width="2"/><text x="360" y="225" text-anchor="middle" fill="#86efac" font-size="11" font-weight="bold">Agent (DaemonSet)</text><text x="360" y="240" text-anchor="middle" fill="#94a3b8" font-size="9">Node 2</text><rect x="490" y="200" width="180" height="55" rx="8" fill="#1e293b" stroke="#22c55e" stroke-width="2"/><text x="580" y="225" text-anchor="middle" fill="#86efac" font-size="11" font-weight="bold">Agent (DaemonSet)</text><text x="580" y="240" text-anchor="middle" fill="#94a3b8" font-size="9">Node 3</text><line x1="140" y1="200" x2="320" y2="150" stroke="#a855f7" stroke-width="1.5"/><line x1="360" y1="200" x2="400" y2="150" stroke="#a855f7" stroke-width="1.5"/><line x1="580" y1="200" x2="480" y2="150" stroke="#a855f7" stroke-width="1.5"/><rect x="60" y="295" width="120" height="35" rx="5" fill="#1e293b" stroke="#06b6d4"/><text x="120" y="317" text-anchor="middle" fill="#67e8f9" font-size="9">Pod (SVID)</text><rect x="280" y="295" width="120" height="35" rx="5" fill="#1e293b" stroke="#06b6d4"/><text x="340" y="317" text-anchor="middle" fill="#67e8f9" font-size="9">Pod (SVID)</text><rect x="500" y="295" width="120" height="35" rx="5" fill="#1e293b" stroke="#06b6d4"/><text x="560" y="317" text-anchor="middle" fill="#67e8f9" font-size="9">Pod (SVID)</text><rect x="640" y="295" width="120" height="35" rx="5" fill="#1e293b" stroke="#06b6d4"/><text x="700" y="317" text-anchor="middle" fill="#67e8f9" font-size="9">Pod (SVID)</text><line x1="120" y1="295" x2="130" y2="255" stroke="#67e8f9" stroke-width="1" stroke-dasharray="3,2"/><line x1="340" y1="295" x2="350" y2="255" stroke="#67e8f9" stroke-width="1" stroke-dasharray="3,2"/><line x1="560" y1="295" x2="570" y2="255" stroke="#67e8f9" stroke-width="1" stroke-dasharray="3,2"/><line x1="700" y1="295" x2="600" y2="255" stroke="#67e8f9" stroke-width="1" stroke-dasharray="3,2"/><rect x="540" y="85" width="210" height="55" rx="8" fill="#1e293b" stroke="#f97316" stroke-width="1.5"/><text x="645" y="108" text-anchor="middle" fill="#fdba74" font-size="10" font-weight="bold">SPIRE CSI Driver</text><text x="645" y="125" text-anchor="middle" fill="#94a3b8" font-size="9">Mounts Workload API socket</text></svg>',
      content: `
        <p>This is where SPIRE becomes real. In this module, you deploy SPIRE on Kubernetes, register workloads, and watch pods receive cryptographic identities automatically. This is the hands-on foundation for everything that follows.</p>

        <h2>Kubernetes Identity Challenges</h2>

        <p>Kubernetes provides service account tokens, but they were not designed for workload identity. Default tokens are long-lived (no expiration until K8s 1.24+), shared across all pods using the same service account, not cryptographic certificates (cannot be used for mTLS), and not verifiable across clusters.</p>

        <h2>SPIRE Kubernetes Architecture</h2>

        <p>SPIRE on Kubernetes consists of the SPIRE Server running as a StatefulSet, the SPIRE Agent running as a DaemonSet on every node, the SPIRE Controller Manager that auto-registers workloads, and the SPIRE CSI Driver that mounts the Workload API socket into pods.</p>

        <h2>Deploying SPIRE Server</h2>

        <pre><code># spire-server.yaml (simplified)
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: spire-server
  namespace: spire
spec:
  replicas: 1
  selector:
    matchLabels:
      app: spire-server
  template:
    spec:
      containers:
        - name: spire-server
          image: ghcr.io/spiffe/spire-server:1.9
          ports:
            - containerPort: 8081  # Server API
          volumeMounts:
            - name: spire-config
              mountPath: /run/spire/config
            - name: spire-data
              mountPath: /run/spire/data</code></pre>

        <h2>Deploying SPIRE Agent</h2>

        <pre><code># spire-agent.yaml (simplified)
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: spire-agent
  namespace: spire
spec:
  selector:
    matchLabels:
      app: spire-agent
  template:
    spec:
      containers:
        - name: spire-agent
          image: ghcr.io/spiffe/spire-agent:1.9
          volumeMounts:
            - name: spire-agent-socket
              mountPath: /run/spire/sockets</code></pre>

        <h2>Automatic Workload Registration</h2>

        <p>The SPIRE Controller Manager watches Kubernetes for pod creations and automatically creates registration entries based on annotations or ClusterSPIFFEID resources. This eliminates manual registration.</p>

        <pre><code># ClusterSPIFFEID resource for auto-registration
apiVersion: spire.spiffe.io/v1alpha1
kind: ClusterSPIFFEID
metadata:
  name: default-workloads
spec:
  spiffeIDTemplate: "spiffe://example.org/ns/{{ .PodMeta.Namespace }}/sa/{{ .PodSpec.ServiceAccountName }}"
  podSelector:
    matchLabels: {}  # Match all pods
  namespaceSelector:
    matchExpressions:
      - key: kubernetes.io/metadata.name
        operator: NotIn
        values: ["kube-system", "spire"]</code></pre>

        <h2>Retrieving SVIDs Inside Pods</h2>

        <pre><code># Using spiffe-helper to write SVIDs to disk:
# The pod mounts the Workload API socket via CSI driver
# spiffe-helper fetches SVIDs and writes them as files:
# /run/spire/certs/svid.pem       (X.509 certificate)
# /run/spire/certs/svid_key.pem   (private key)
# /run/spire/certs/bundle.pem     (trust bundle)

# Applications read these files for mTLS configuration</code></pre>
      `,
      labs: [
        {
          title: 'Deploying SPIRE on Kind',
          objective: 'Deploy a full SPIRE stack on a local Kind cluster.',
          repoPath: 'module-05/lab-01',
          steps: [
            'Create a Kind cluster with 3 worker nodes',
            'Deploy SPIRE Server as a StatefulSet',
            'Deploy SPIRE Agent as a DaemonSet',
            'Verify server-agent connectivity',
          ],
        },
        {
          title: 'Registering Kubernetes Workloads',
          objective: 'Register workloads and verify SVID issuance.',
          repoPath: 'module-05/lab-02',
          steps: [
            'Deploy SPIRE Controller Manager',
            'Create ClusterSPIFFEID resources',
            'Deploy a demo application pod',
            'Verify the pod receives an X.509-SVID',
          ],
        },
        {
          title: 'Automatic Identity Rotation',
          objective: 'Observe SVID rotation without application restart.',
          repoPath: 'module-05/lab-03',
          steps: [
            'Set SVID TTL to 5 minutes for testing',
            'Monitor the SVID expiration timestamp',
            'Observe automatic rotation before expiry',
            'Verify the application continues without interruption',
          ],
        },
        {
          title: 'Debugging Failed Attestation',
          objective: 'Troubleshoot common SPIRE deployment issues.',
          repoPath: 'module-05/lab-04',
          steps: [
            'Intentionally misconfigure a workload selector',
            'Observe the attestation failure in agent logs',
            'Fix the registration entry',
            'Verify successful attestation after the fix',
          ],
        },
      ],
      keyTakeaways: [
        'SPIRE Server runs as a StatefulSet, Agent as a DaemonSet',
        'SPIRE Controller Manager auto-registers workloads from Kubernetes metadata',
        'CSI Driver mounts the Workload API socket into pods transparently',
        'SVIDs rotate automatically — applications never handle certificate renewal',
        'ClusterSPIFFEID resources define SPIFFE ID templates for automatic registration',
        'Debug attestation failures by checking agent logs and registration entry selectors',
      ],
      whyThisMatters: 'This is where SPIRE becomes real. Deploying on Kubernetes is the most common production scenario, and the skills you build here — deploying, registering, debugging — are exactly what you will use every day as a platform engineer operating SPIRE.',
      realWorldUseCases: ['Production Kubernetes clusters with hundreds of services needing identity', 'Multi-tenant clusters where different teams own different namespaces', 'Auto-scaling environments where pods spin up and need instant identity', 'GitOps workflows where workload registration is declarative via ClusterSPIFFEID'],
      commonMistakes: ['Deploying SPIRE Agent as a sidecar instead of a DaemonSet', 'Forgetting to create the spire-bundle ConfigMap before starting agents', 'Using the wrong cluster name in k8s_psat attestor config', 'Not giving SPIRE Server RBAC permissions for tokenreviews', 'Setting SVID TTL too short without monitoring rotation success'],
      productionNotes: ['Use the SPIRE CSI Driver to mount the Workload API socket into pods. It is cleaner than hostPath volumes and provides proper lifecycle management.', 'In production, always run SPIRE Server as a StatefulSet with persistent storage. Losing the datastore means losing all registration entries.', 'Monitor SVID rotation continuously. A stalled rotation means certificates will expire and services will fail.'],
      operationalStory: 'A platform team deployed SPIRE on a 200-node cluster. Initial deployment went smoothly, but auto-scaling kept creating nodes that could not attest. The root cause: the k8s_psat attestor had a typo in the cluster name. One config fix later, new nodes joined automatically within seconds of creation.',
      securityRisks: ['SPIRE Agent runs with hostPID — a compromised agent can see all processes on the node', 'ClusterSPIFFEID with empty matchLabels registers ALL pods — scope it to specific namespaces', 'Workload API socket mounted via hostPath can be accessed by any pod if not properly secured'],
      glossary: [{ term: 'DaemonSet', definition: 'Kubernetes resource that runs one pod per node' }, { term: 'StatefulSet', definition: 'Kubernetes resource for stateful applications with persistent storage' }, { term: 'ClusterSPIFFEID', definition: 'Custom resource for automatic workload registration' }, { term: 'CSI Driver', definition: 'Container Storage Interface driver for mounting Workload API socket' }, { term: 'k8s_psat', definition: 'Kubernetes Projected Service Account Token attestor' }],
      careerRelevance: 'Kubernetes is the dominant container orchestrator, and SPIRE on Kubernetes is the most common production deployment model. This module gives you the hands-on skills that platform engineering and DevOps job descriptions increasingly list as requirements.',
    },
    {
      number: 6,
      title: 'Working with SVIDs and the Workload API',
      slug: 'working-with-svids-workload-api',
      subtitle: 'How applications consume and use SPIFFE identities',
      duration: '3 hours',
      objectives: [
        'Use the SPIFFE Workload API programmatically',
        'Integrate SPIFFE into Go, Python, and Java applications',
        'Build mTLS connections between microservices',
        'Implement automatic certificate rotation in applications',
      ],
      svgDiagram: '<svg viewBox="0 0 800 350" xmlns="http://www.w3.org/2000/svg"><rect width="800" height="350" fill="#0f172a" rx="12"/><text x="400" y="28" text-anchor="middle" fill="#94a3b8" font-size="14" font-weight="bold">APPLICATION INTEGRATION PATTERNS</text><rect x="50" y="55" width="200" height="120" rx="8" fill="#1e293b" stroke="#3b82f6" stroke-width="2"/><text x="150" y="80" text-anchor="middle" fill="#93c5fd" font-size="11" font-weight="bold">Go Application</text><text x="150" y="100" text-anchor="middle" fill="#94a3b8" font-size="9">go-spiffe library</text><text x="150" y="120" text-anchor="middle" fill="#94a3b8" font-size="9">Direct Workload API</text><text x="150" y="140" text-anchor="middle" fill="#22c55e" font-size="9">Auto-rotation built in</text><rect x="300" y="55" width="200" height="120" rx="8" fill="#1e293b" stroke="#f97316" stroke-width="2"/><text x="400" y="80" text-anchor="middle" fill="#fdba74" font-size="11" font-weight="bold">Python Application</text><text x="400" y="100" text-anchor="middle" fill="#94a3b8" font-size="9">py-spiffe library</text><text x="400" y="120" text-anchor="middle" fill="#94a3b8" font-size="9">or SPIFFE Helper</text><text x="400" y="140" text-anchor="middle" fill="#22c55e" font-size="9">File-based certs</text><rect x="550" y="55" width="200" height="120" rx="8" fill="#1e293b" stroke="#ef4444" stroke-width="2"/><text x="650" y="80" text-anchor="middle" fill="#fca5a5" font-size="11" font-weight="bold">Any Application</text><text x="650" y="100" text-anchor="middle" fill="#94a3b8" font-size="9">SPIFFE Helper sidecar</text><text x="650" y="120" text-anchor="middle" fill="#94a3b8" font-size="9">Writes certs to disk</text><text x="650" y="140" text-anchor="middle" fill="#22c55e" font-size="9">Zero code changes</text><rect x="250" y="220" width="300" height="50" rx="8" fill="#1e293b" stroke="#06b6d4" stroke-width="2"/><text x="400" y="250" text-anchor="middle" fill="#67e8f9" font-size="12" font-weight="bold">SPIFFE Workload API</text><line x1="150" y1="175" x2="320" y2="220" stroke="#06b6d4" stroke-width="1.5"/><line x1="400" y1="175" x2="400" y2="220" stroke="#06b6d4" stroke-width="1.5"/><line x1="650" y1="175" x2="480" y2="220" stroke="#06b6d4" stroke-width="1.5"/><rect x="250" y="290" width="300" height="40" rx="6" fill="#1e293b" stroke="#a855f7"/><text x="400" y="315" text-anchor="middle" fill="#c084fc" font-size="10">SPIRE Agent (Unix Domain Socket)</text></svg>',
      content: `
        <p>A workload identity system is only useful if applications can actually <em>use</em> the identities. This module covers how to integrate SPIFFE into applications &mdash; from zero-code approaches (SPIFFE Helper) to native library integration (go-spiffe, py-spiffe).</p>

        <h2>Integration Approaches</h2>

        <p>There are three ways to consume SPIFFE identities:</p>

        <ol>
          <li><strong>SPIFFE Helper (zero code changes):</strong> A sidecar that fetches SVIDs and writes them as certificate files. Your application reads the files like any TLS certificate. Works with any language.</li>
          <li><strong>Native libraries (code integration):</strong> Use go-spiffe, py-spiffe, or java-spiffe to call the Workload API directly. Provides automatic rotation callbacks and richer integration.</li>
          <li><strong>Envoy sidecar (proxy-based):</strong> Envoy handles mTLS transparently. Your application communicates in plain HTTP; Envoy adds the identity layer. Covered in Module 8.</li>
        </ol>

        <h2>Using go-spiffe</h2>

        <pre><code>package main

import (
    "context"
    "net/http"
    "github.com/spiffe/go-spiffe/v2/spiffetls/tlsconfig"
    "github.com/spiffe/go-spiffe/v2/workloadapi"
)

func main() {
    ctx := context.Background()

    // Connect to the Workload API
    source, err := workloadapi.NewX509Source(ctx)
    if err != nil {
        log.Fatal(err)
    }
    defer source.Close()

    // Create an mTLS server
    tlsConfig := tlsconfig.MTLSServerConfig(
        source,    // Serve our SVID
        source,    // Verify client SVIDs
        tlsconfig.AuthorizeAny(), // Or use AuthorizeID for specific SPIFFE IDs
    )

    server := &amp;http.Server{
        Addr:      ":8443",
        TLSConfig: tlsConfig,
    }
    server.ListenAndServeTLS("", "") // Certs from SPIRE, not files
}</code></pre>

        <h2>Using SPIFFE Helper</h2>

        <pre><code># spiffe-helper.conf
agent_address = "/run/spire/sockets/agent.sock"
cmd = "/app/server"            # Your application command
cert_dir = "/run/spire/certs"  # Where to write certificates
svid_file_name = "svid.pem"
svid_key_file_name = "svid_key.pem"
svid_bundle_file_name = "bundle.pem"
renew_signal = "SIGHUP"       # Signal to send when certs rotate

# Your app reads /run/spire/certs/svid.pem and svid_key.pem
# When certs rotate, your app gets SIGHUP to reload</code></pre>

        <h2>Building mTLS Between Microservices</h2>

        <p>With SVIDs, two services can establish mTLS without manually managing certificates:</p>

        <pre><code># Service A (client) connects to Service B (server):
# 1. Both services get SVIDs from SPIRE via Workload API
# 2. Service A presents its SVID as the client certificate
# 3. Service B presents its SVID as the server certificate
# 4. Both verify the other's SVID against the trust bundle
# 5. Connection established — both identities proven

# No manual certificate generation
# No certificate files to manage
# No expiration alerts — SPIRE handles rotation</code></pre>

        <h2>Secure gRPC Communication</h2>

        <pre><code># gRPC with SPIFFE identity (Go):
# Server:
source, _ := workloadapi.NewX509Source(ctx)
creds := grpc.Creds(credentials.NewTLS(
    tlsconfig.MTLSServerConfig(source, source, authorize),
))
server := grpc.NewServer(creds)

# Client:
source, _ := workloadapi.NewX509Source(ctx)
creds := grpc.WithTransportCredentials(credentials.NewTLS(
    tlsconfig.MTLSClientConfig(source, source, authorize),
))
conn, _ := grpc.Dial("service-b:8443", creds)</code></pre>
      `,
      labs: [
        {
          title: 'Getting SVIDs with SPIFFE Helper',
          objective: 'Use SPIFFE Helper for zero-code SVID integration.',
          repoPath: 'module-06/lab-01',
          steps: [
            'Deploy SPIFFE Helper as a sidecar container',
            'Configure certificate file paths',
            'Verify SVIDs are written to disk',
            'Configure an Nginx server to use the SVID certificates',
          ],
        },
        {
          title: 'Building mTLS Between Microservices',
          objective: 'Establish mutual TLS between two Go services using go-spiffe.',
          repoPath: 'module-06/lab-02',
          steps: [
            'Build a Go server that serves with its SVID',
            'Build a Go client that authenticates with its SVID',
            'Verify mTLS connection with both identities',
            'Test that a service without a valid SVID is rejected',
          ],
        },
        {
          title: 'Secure gRPC Communication',
          objective: 'Secure gRPC services with SPIFFE identities.',
          repoPath: 'module-06/lab-03',
          steps: [
            'Create a gRPC server with SPIFFE TLS credentials',
            'Create a gRPC client with SPIFFE TLS credentials',
            'Verify mutual authentication via SPIFFE IDs',
            'Implement SPIFFE ID-based authorization in the server',
          ],
        },
      ],
      keyTakeaways: [
        'SPIFFE Helper enables zero-code integration — writes certs to files',
        'go-spiffe provides native Workload API integration with auto-rotation',
        'mTLS between services requires no manual certificate management with SPIRE',
        'gRPC integrates natively with SPIFFE via TLS credentials',
        'Choose your approach: sidecar (any language), library (Go/Python/Java), or proxy (Envoy)',
      ],
      whyThisMatters: 'A workload identity system is useless if applications cannot consume the identities. This module bridges the gap between infrastructure (SPIRE) and application code — the integration point where most real-world problems occur.',
      realWorldUseCases: ['Go microservices using go-spiffe for native mTLS', 'Legacy Java applications using SPIFFE Helper for zero-code integration', 'Python services using py-spiffe for Workload API access', 'gRPC services with SPIFFE TLS credentials for inter-service auth'],
      commonMistakes: ['Not handling SVID rotation callbacks — applications crash when certs expire', 'Hardcoding socket paths instead of using the SPIFFE_ENDPOINT_SOCKET environment variable', 'Using SPIFFE Helper without configuring the renew_signal — certs rotate but the app keeps using old ones', 'Fetching SVIDs on every request instead of caching and watching for rotation'],
      productionNotes: ['For new services: use go-spiffe or py-spiffe for native integration. For legacy services: use SPIFFE Helper to write certs to disk with zero code changes.', 'Always configure a renewal signal (SIGHUP) with SPIFFE Helper so applications reload certificates on rotation.', 'In production, use the Envoy sidecar approach when you cannot modify application code and need mTLS transparently.'],
      designTradeoffs: [{ option: 'SPIFFE Helper (sidecar)', pros: ['Zero application code changes', 'Works with any language', 'Writes standard PEM files'], cons: ['Requires sidecar management', 'Signal-based reload can miss rotations', 'Extra process per pod'] }, { option: 'go-spiffe (library)', pros: ['Native API integration', 'Automatic rotation callbacks', 'Fine-grained control'], cons: ['Go-only', 'Requires code changes', 'Adds dependency'] }, { option: 'Envoy sidecar (proxy)', pros: ['Transparent mTLS', 'No app changes', 'L7 features (routing, auth)'], cons: ['Resource overhead', 'Complex config', 'Latency from proxy hop'] }],
      glossary: [{ term: 'SPIFFE Helper', definition: 'Sidecar that writes SVIDs as PEM files to disk' }, { term: 'go-spiffe', definition: 'Official Go library for Workload API integration' }, { term: 'Workload API Socket', definition: 'Unix domain socket at /run/spire/sockets/agent.sock' }, { term: 'SIGHUP', definition: 'Signal sent to applications to trigger certificate reload' }],
    },    {
      number: 7,
      title: 'Authorization and Policy Enforcement',
      slug: 'authorization-policy-enforcement',
      subtitle: 'Identity answers who — policy answers what they can do',
      duration: '3 hours',
      objectives: [
        'Understand authentication vs authorization in zero trust',
        'Write Rego policies with Open Policy Agent (OPA)',
        'Implement identity-aware authorization with SPIFFE IDs',
        'Integrate OPA with Envoy for runtime policy enforcement',
      ],
      svgDiagram: '<svg viewBox="0 0 800 350" xmlns="http://www.w3.org/2000/svg"><rect width="800" height="350" fill="#0f172a" rx="12"/><text x="400" y="28" text-anchor="middle" fill="#94a3b8" font-size="14" font-weight="bold">IDENTITY-AWARE AUTHORIZATION FLOW</text><rect x="50" y="70" width="140" height="50" rx="8" fill="#1e293b" stroke="#3b82f6" stroke-width="2"/><text x="120" y="100" text-anchor="middle" fill="#93c5fd" font-size="11" font-weight="bold">Service A</text><rect x="250" y="60" width="140" height="70" rx="8" fill="#1e293b" stroke="#22c55e" stroke-width="2"/><text x="320" y="85" text-anchor="middle" fill="#86efac" font-size="11" font-weight="bold">Envoy Proxy</text><text x="320" y="105" text-anchor="middle" fill="#94a3b8" font-size="9">mTLS termination</text><text x="320" y="118" text-anchor="middle" fill="#94a3b8" font-size="9">Extracts SPIFFE ID</text><rect x="450" y="60" width="140" height="70" rx="8" fill="#1e293b" stroke="#f97316" stroke-width="2"/><text x="520" y="85" text-anchor="middle" fill="#fdba74" font-size="11" font-weight="bold">OPA</text><text x="520" y="105" text-anchor="middle" fill="#94a3b8" font-size="9">Policy engine</text><text x="520" y="118" text-anchor="middle" fill="#94a3b8" font-size="9">Rego rules</text><rect x="640" y="70" width="120" height="50" rx="8" fill="#1e293b" stroke="#a855f7" stroke-width="2"/><text x="700" y="100" text-anchor="middle" fill="#c084fc" font-size="11" font-weight="bold">Service B</text><line x1="190" y1="95" x2="250" y2="95" stroke="#3b82f6" stroke-width="2" marker-end="url(#a2)"/><text x="220" y="87" text-anchor="middle" fill="#64748b" font-size="8">mTLS</text><line x1="390" y1="95" x2="450" y2="95" stroke="#f97316" stroke-width="2" marker-end="url(#a2)"/><text x="420" y="87" text-anchor="middle" fill="#64748b" font-size="8">Check policy</text><line x1="590" y1="95" x2="640" y2="95" stroke="#22c55e" stroke-width="2" marker-end="url(#a2)"/><text x="615" y="87" text-anchor="middle" fill="#22c55e" font-size="8">Allow</text><rect x="200" y="180" width="400" height="140" rx="8" fill="#1e293b" stroke="#f97316" stroke-width="1.5"/><text x="400" y="205" text-anchor="middle" fill="#fdba74" font-size="12" font-weight="bold">OPA Policy (Rego)</text><text x="220" y="230" fill="#94a3b8" font-size="10" font-family="monospace">allow {</text><text x="240" y="248" fill="#94a3b8" font-size="10" font-family="monospace">  input.source == "spiffe://example.org/.../api"</text><text x="240" y="266" fill="#94a3b8" font-size="10" font-family="monospace">  input.method == "GET"</text><text x="240" y="284" fill="#94a3b8" font-size="10" font-family="monospace">  input.path == "/api/orders"</text><text x="220" y="302" fill="#94a3b8" font-size="10" font-family="monospace">}</text><defs><marker id="a2" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill="#94a3b8"/></marker></defs></svg>',
      content: `
        <p>Authentication tells you <strong>who</strong> is making a request. Authorization tells you <strong>what they are allowed to do</strong>. SPIFFE handles authentication (via SVIDs). This module adds the authorization layer using Open Policy Agent (OPA).</p>

        <h2>Authentication vs Authorization</h2>

        <ul>
          <li><strong>Authentication (SPIFFE/SPIRE):</strong> "This request is from spiffe://example.org/ns/default/sa/orders-api"</li>
          <li><strong>Authorization (OPA):</strong> "The orders-api service is allowed to GET /api/orders but NOT DELETE /api/users"</li>
        </ul>

        <h2>Open Policy Agent (OPA)</h2>

        <p>OPA is a CNCF graduated project that provides policy-as-code. Policies are written in <strong>Rego</strong>, a declarative language designed for structured data.</p>

        <pre><code># Basic Rego policy
package authz

default allow = false

# Allow the orders service to read orders
allow {
    input.source_spiffe_id == "spiffe://example.org/ns/default/sa/orders-api"
    input.request_method == "GET"
    startswith(input.request_path, "/api/orders")
}

# Allow the admin service full access
allow {
    input.source_spiffe_id == "spiffe://example.org/ns/default/sa/admin"
}

# Deny everything else (default allow = false)</code></pre>

        <h2>Envoy External Authorization</h2>

        <p>Envoy proxy can check every request against OPA before forwarding it to the backend service. The flow is: client connects with mTLS (Envoy terminates, extracts SPIFFE ID), Envoy sends the request details and SPIFFE ID to OPA, OPA evaluates the Rego policy and returns allow/deny, and Envoy either forwards the request or returns 403 Forbidden.</p>

        <h2>Context-Aware Authorization</h2>

        <p>Beyond simple SPIFFE ID matching, policies can consider the HTTP method and path, request headers, time of day, source namespace and environment, and custom claims in JWT-SVIDs.</p>

        <h2>Policy Testing</h2>

        <pre><code># Test your policies before deploying
# test_authz.rego
package authz

test_orders_api_can_read {
    allow with input as {
        "source_spiffe_id": "spiffe://example.org/ns/default/sa/orders-api",
        "request_method": "GET",
        "request_path": "/api/orders/123"
    }
}

test_orders_api_cannot_delete_users {
    not allow with input as {
        "source_spiffe_id": "spiffe://example.org/ns/default/sa/orders-api",
        "request_method": "DELETE",
        "request_path": "/api/users/456"
    }
}

# Run tests: opa test . -v</code></pre>
      `,
      labs: [
        {
          title: 'Writing Basic Rego Policies',
          objective: 'Learn Rego syntax by writing and testing authorization policies.',
          repoPath: 'module-07/lab-01',
          steps: ['Write a Rego policy that allows specific SPIFFE IDs', 'Write test cases for the policy', 'Run opa test and verify all tests pass', 'Experiment with more complex rules'],
        },
        {
          title: 'Integrating OPA with Envoy',
          objective: 'Deploy OPA as an Envoy external authorization filter.',
          repoPath: 'module-07/lab-02',
          steps: ['Deploy OPA as a sidecar alongside Envoy', 'Configure Envoy ext_authz filter to call OPA', 'Deploy two services with different SPIFFE IDs', 'Verify that policies correctly allow/deny requests'],
        },
      ],
      keyTakeaways: [
        'Authentication (who) and authorization (what) are separate concerns',
        'OPA provides policy-as-code with the Rego language',
        'Envoy ext_authz integrates OPA into the request path transparently',
        'Policies should be tested like code — use opa test',
        'SPIFFE IDs in policies enable fine-grained service-to-service authorization',
      ],
      whyThisMatters: 'Authentication tells you WHO is making a request. Without authorization, authenticated services can access anything. OPA with SPIFFE IDs gives you fine-grained, testable, version-controlled authorization — the critical layer between "identified" and "permitted."',
      realWorldUseCases: ['API endpoint authorization — which services can call which endpoints', 'Data access control — limiting which services can read sensitive data', 'Multi-tenant isolation — ensuring tenant A services cannot access tenant B data', 'Compliance enforcement — automated policy checks for regulatory requirements'],
      commonMistakes: ['Writing overly permissive policies that allow everything initially and never tightening', 'Not testing policies before deploying — broken policies block legitimate traffic', 'Putting authorization logic in application code instead of a policy engine', 'Confusing OPA with a firewall — OPA makes decisions, Envoy enforces them'],
      productionNotes: ['Always test Rego policies with opa test before deploying. Include both positive and negative test cases.', 'Start with broad allow rules, then tighten incrementally. A deny-all start causes outages.', 'Version your Rego policies in Git and deploy them through CI/CD, just like application code.'],
      thinkLikeAnEngineer: ['Should authorization policies be centralized (one OPA instance) or distributed (per-service OPA)?', 'How do you handle policy updates without restarting services?', 'What is the performance impact of calling OPA on every request?', 'How do you audit authorization decisions for compliance?'],
      glossary: [{ term: 'OPA', definition: 'Open Policy Agent — CNCF graduated policy engine' }, { term: 'Rego', definition: 'Declarative policy language used by OPA' }, { term: 'ext_authz', definition: 'Envoy external authorization filter that calls OPA' }, { term: 'RBAC', definition: 'Role-Based Access Control' }, { term: 'ABAC', definition: 'Attribute-Based Access Control' }],
    },
    {
      number: 8,
      title: 'SPIRE Integrations and Service Mesh',
      slug: 'spire-integrations-service-mesh',
      subtitle: 'Connect SPIRE with Envoy, Istio, and the cloud-native ecosystem',
      duration: '3.5 hours',
      objectives: [
        'Integrate SPIRE with Envoy as the identity provider',
        'Use SPIRE with Istio and Linkerd service meshes',
        'Configure OIDC discovery for JWT authentication',
        'Design SPIFFE ID naming schemas for production',
      ],
      svgDiagram: '<svg viewBox="0 0 800 350" xmlns="http://www.w3.org/2000/svg"><rect width="800" height="350" fill="#0f172a" rx="12"/><text x="400" y="28" text-anchor="middle" fill="#94a3b8" font-size="14" font-weight="bold">SPIRE + SERVICE MESH INTEGRATION</text><rect x="300" y="50" width="200" height="55" rx="8" fill="#1e293b" stroke="#a855f7" stroke-width="2"/><text x="400" y="75" text-anchor="middle" fill="#c084fc" font-size="12" font-weight="bold">SPIRE Server</text><text x="400" y="92" text-anchor="middle" fill="#94a3b8" font-size="9">Identity Authority</text><rect x="50" y="150" width="300" height="160" rx="10" fill="none" stroke="#3b82f6" stroke-width="1.5" stroke-dasharray="5,3"/><text x="70" y="170" fill="#3b82f6" font-size="10">Pod A</text><rect x="70" y="180" width="110" height="40" rx="6" fill="#1e293b" stroke="#22c55e"/><text x="125" y="205" text-anchor="middle" fill="#86efac" font-size="10">App (HTTP)</text><rect x="200" y="180" width="130" height="40" rx="6" fill="#1e293b" stroke="#f97316" stroke-width="2"/><text x="265" y="200" text-anchor="middle" fill="#fdba74" font-size="10">Envoy Sidecar</text><text x="265" y="215" text-anchor="middle" fill="#94a3b8" font-size="8">SVID from SPIRE</text><rect x="70" y="240" width="260" height="30" rx="4" fill="#06b6d4" fill-opacity="0.1" stroke="#06b6d4"/><text x="200" y="260" text-anchor="middle" fill="#67e8f9" font-size="9">SPIRE Agent (Workload API)</text><rect x="450" y="150" width="300" height="160" rx="10" fill="none" stroke="#3b82f6" stroke-width="1.5" stroke-dasharray="5,3"/><text x="470" y="170" fill="#3b82f6" font-size="10">Pod B</text><rect x="470" y="180" width="110" height="40" rx="6" fill="#1e293b" stroke="#22c55e"/><text x="525" y="205" text-anchor="middle" fill="#86efac" font-size="10">App (HTTP)</text><rect x="600" y="180" width="130" height="40" rx="6" fill="#1e293b" stroke="#f97316" stroke-width="2"/><text x="665" y="200" text-anchor="middle" fill="#fdba74" font-size="10">Envoy Sidecar</text><text x="665" y="215" text-anchor="middle" fill="#94a3b8" font-size="8">SVID from SPIRE</text><rect x="470" y="240" width="260" height="30" rx="4" fill="#06b6d4" fill-opacity="0.1" stroke="#06b6d4"/><text x="600" y="260" text-anchor="middle" fill="#67e8f9" font-size="9">SPIRE Agent (Workload API)</text><line x1="330" y1="200" x2="450" y2="200" stroke="#22c55e" stroke-width="2.5"/><text x="390" y="193" text-anchor="middle" fill="#22c55e" font-size="10" font-weight="bold">mTLS</text><line x1="200" y1="270" x2="320" y2="105" stroke="#a855f7" stroke-width="1" stroke-dasharray="4,3"/><line x1="600" y1="270" x2="480" y2="105" stroke="#a855f7" stroke-width="1" stroke-dasharray="4,3"/></svg>',
      content: `
        <p>SPIRE becomes most powerful when integrated with the cloud-native ecosystem. This module covers integration with Envoy (the most common sidecar proxy), Istio (the most popular service mesh), and OIDC discovery for JWT-based authentication.</p>

        <h2>SPIRE with Envoy</h2>

        <p>Envoy can use SPIRE as its certificate source via the Secret Discovery Service (SDS). Instead of loading certificates from files, Envoy requests them from the SPIRE Agent&rsquo;s Workload API. This means automatic certificate rotation with zero Envoy restarts, mTLS between all Envoy sidecars, and SPIFFE ID extraction for authorization decisions.</p>

        <h2>SPIRE with Istio</h2>

        <p>Istio has its own certificate authority (istiod). But SPIRE can replace it for organizations that need consistent identity across mesh and non-mesh workloads, stronger attestation than Kubernetes service account tokens, SPIFFE federation across clusters, or integration with non-Kubernetes workloads (VMs, bare metal).</p>

        <h2>OIDC Discovery with SPIRE</h2>

        <p>SPIRE can act as an OIDC provider, allowing external systems to verify JWT-SVIDs using standard OIDC discovery. This enables cloud provider integration (AWS IAM roles for SPIFFE identities), API gateway authentication, and cross-platform identity verification.</p>

        <h2>SPIFFE ID Naming Schemas</h2>

        <pre><code># Production naming conventions:

# Kubernetes workloads:
spiffe://company.org/k8s/cluster-name/ns/namespace/sa/service-account

# VM workloads:
spiffe://company.org/vm/region/service-name

# CI/CD pipelines:
spiffe://company.org/cicd/github/repo-name/workflow

# Good practices:
# - Include environment (cluster name) in the path
# - Use service account as the identity, not pod name
# - Keep paths hierarchical for policy matching
# - Document the schema for your organization</code></pre>
      `,
      labs: [
        {
          title: 'SPIRE with Envoy mTLS',
          objective: 'Configure Envoy to use SPIRE for automatic mTLS.',
          repoPath: 'module-08/lab-01',
          steps: ['Deploy Envoy sidecars alongside application pods', 'Configure Envoy SDS to use the SPIRE Workload API', 'Verify mTLS between Envoy sidecars', 'Observe certificate rotation in Envoy admin interface'],
        },
        {
          title: 'SPIRE + OPA Authorization',
          objective: 'Combine SPIRE identity with OPA policy enforcement via Envoy.',
          repoPath: 'module-08/lab-02',
          steps: ['Deploy OPA alongside Envoy', 'Write Rego policies that reference SPIFFE IDs', 'Configure Envoy ext_authz filter', 'Test that only authorized services can access protected endpoints'],
        },
        {
          title: 'OIDC Discovery with SPIRE',
          objective: 'Configure SPIRE as an OIDC provider for JWT verification.',
          repoPath: 'module-08/lab-03',
          steps: ['Enable OIDC discovery on SPIRE Server', 'Fetch the OIDC discovery document', 'Verify a JWT-SVID using the OIDC public keys', 'Integrate with an API gateway that supports OIDC'],
        },
      ],
      keyTakeaways: [
        'Envoy SDS integration gives automatic mTLS with zero restarts',
        'SPIRE can replace Istio CA for stronger attestation and federation',
        'OIDC discovery enables external systems to verify SPIFFE JWTs',
        'SPIFFE ID naming schemas should be documented and hierarchical',
        'The combination of SPIRE + Envoy + OPA provides complete zero trust',
      ],
      whyThisMatters: 'SPIRE in isolation is useful. SPIRE integrated with Envoy, Istio, and OPA is transformational. This module shows you how workload identity plugs into the broader cloud-native ecosystem — turning separate tools into a unified zero trust platform.',
      realWorldUseCases: ['Envoy SDS — automatic mTLS certificate delivery without restarts', 'Istio with SPIRE CA — stronger attestation than Istio default', 'OIDC federation — external services verifying SPIFFE JWTs via standard OIDC', 'API gateway authentication — verifying workload identity at the edge'],
      commonMistakes: ['Configuring Envoy SDS with the wrong socket path', 'Not testing OIDC discovery endpoint accessibility from external consumers', 'Using Istio CA and SPIRE CA simultaneously without understanding precedence', 'Designing SPIFFE ID paths that do not support your service mesh routing needs'],
      productionNotes: ['Envoy SDS integration means zero-downtime certificate rotation. Envoy watches the SPIRE socket and reloads certificates automatically.', 'When replacing Istio CA with SPIRE, perform a gradual rollout — run both CAs during migration, then cut over.', 'OIDC discovery must be accessible from wherever JWT verification happens (API gateways, cloud provider IAM).'],
      productionAlternatives: [{ name: 'Istio built-in CA', description: 'Simpler setup but weaker attestation. No federation, no VM support, limited to Kubernetes service accounts.' }, { name: 'cert-manager', description: 'Good for static certificate management but no workload attestation, no automatic identity, no Workload API.' }, { name: 'Vault PKI', description: 'Strong secret management but identity is application-level, not infrastructure-level. Requires Vault tokens (another secret to manage).' }],
      glossary: [{ term: 'SDS', definition: 'Secret Discovery Service — Envoy protocol for dynamic certificate delivery' }, { term: 'OIDC', definition: 'OpenID Connect — standard for identity verification via JWT tokens' }, { term: 'Service Mesh', definition: 'Infrastructure layer handling service-to-service communication (Istio, Linkerd, Envoy)' }],
      operationalStory: 'A fintech company migrating from Istio\'s built-in CA to SPIRE ran both CAs in parallel for 3 weeks. During this period, they discovered that 12 services had hardcoded certificate paths that bypassed Envoy SDS. These services silently fell back to unencrypted HTTP when Istio CA was disabled. The parallel run caught every misconfiguration before production cutover. Lesson: never do a big-bang CA migration. Run both systems simultaneously and verify every service.',
      careerRelevance: 'Service mesh expertise combined with SPIFFE knowledge is a rare and valuable skill set. Organizations deploying Istio, Linkerd, or Envoy at scale need engineers who understand how identity, encryption, and policy enforcement connect at the infrastructure layer.',
    },    {
      number: 9,
      title: 'Advanced SPIRE Architectures',
      slug: 'advanced-spire-architectures',
      subtitle: 'Production-grade deployments: HA, federation, and multi-cluster',
      duration: '3.5 hours',
      objectives: [
        'Design high-availability SPIRE deployments',
        'Configure nested SPIRE for hierarchical trust',
        'Implement SPIFFE federation across trust domains',
        'Plan multi-cluster and multi-cloud architectures',
      ],
      svgDiagram: '<svg viewBox="0 0 800 350" xmlns="http://www.w3.org/2000/svg"><rect width="800" height="350" fill="#0f172a" rx="12"/><text x="400" y="28" text-anchor="middle" fill="#94a3b8" font-size="14" font-weight="bold">FEDERATED SPIRE ARCHITECTURE</text><rect x="30" y="50" width="340" height="270" rx="10" fill="none" stroke="#3b82f6" stroke-width="2"/><text x="200" y="72" text-anchor="middle" fill="#3b82f6" font-size="11" font-weight="bold">Trust Domain: cluster-a.company.org</text><rect x="120" y="90" width="160" height="45" rx="6" fill="#1e293b" stroke="#a855f7" stroke-width="2"/><text x="200" y="118" text-anchor="middle" fill="#c084fc" font-size="10" font-weight="bold">SPIRE Server A</text><rect x="60" y="170" width="100" height="35" rx="5" fill="#1e293b" stroke="#22c55e"/><text x="110" y="192" text-anchor="middle" fill="#86efac" font-size="9">Agent</text><rect x="190" y="170" width="100" height="35" rx="5" fill="#1e293b" stroke="#22c55e"/><text x="240" y="192" text-anchor="middle" fill="#86efac" font-size="9">Agent</text><rect x="60" y="230" width="100" height="30" rx="4" fill="#1e293b" stroke="#475569"/><text x="110" y="250" text-anchor="middle" fill="#e2e8f0" font-size="9">Workload</text><rect x="190" y="230" width="100" height="30" rx="4" fill="#1e293b" stroke="#475569"/><text x="240" y="250" text-anchor="middle" fill="#e2e8f0" font-size="9">Workload</text><rect x="430" y="50" width="340" height="270" rx="10" fill="none" stroke="#f97316" stroke-width="2"/><text x="600" y="72" text-anchor="middle" fill="#f97316" font-size="11" font-weight="bold">Trust Domain: cluster-b.company.org</text><rect x="520" y="90" width="160" height="45" rx="6" fill="#1e293b" stroke="#a855f7" stroke-width="2"/><text x="600" y="118" text-anchor="middle" fill="#c084fc" font-size="10" font-weight="bold">SPIRE Server B</text><rect x="460" y="170" width="100" height="35" rx="5" fill="#1e293b" stroke="#22c55e"/><text x="510" y="192" text-anchor="middle" fill="#86efac" font-size="9">Agent</text><rect x="590" y="170" width="100" height="35" rx="5" fill="#1e293b" stroke="#22c55e"/><text x="640" y="192" text-anchor="middle" fill="#86efac" font-size="9">Agent</text><rect x="460" y="230" width="100" height="30" rx="4" fill="#1e293b" stroke="#475569"/><text x="510" y="250" text-anchor="middle" fill="#e2e8f0" font-size="9">Workload</text><rect x="590" y="230" width="100" height="30" rx="4" fill="#1e293b" stroke="#475569"/><text x="640" y="250" text-anchor="middle" fill="#e2e8f0" font-size="9">Workload</text><path d="M280 112 L520 112" stroke="#eab308" stroke-width="2.5" stroke-dasharray="8,4"/><text x="400" y="105" text-anchor="middle" fill="#eab308" font-size="10" font-weight="bold">Federation (Trust Bundle Exchange)</text><line x1="240" y1="260" x2="510" y2="260" stroke="#22c55e" stroke-width="1.5" stroke-dasharray="4,3"/><text x="375" y="285" text-anchor="middle" fill="#22c55e" font-size="9">Cross-cluster mTLS (verified via federated bundles)</text></svg>',
      content: `
        <p>Single-server SPIRE works for development. Production requires high availability, multi-cluster trust, and sometimes hierarchical deployments. This module covers the advanced architectures that large organizations deploy.</p>

        <h2>High Availability SPIRE</h2>

        <p>A single SPIRE Server is a single point of failure. HA SPIRE uses multiple server replicas with a shared database (PostgreSQL or MySQL), a load balancer in front of the server API, and leader election for CA operations.</p>

        <pre><code># HA SPIRE Server configuration:
server {
    bind_address = "0.0.0.0"
    bind_port = "8081"
    trust_domain = "example.org"

    # Shared datastore (not SQLite!)
    data_dir = "/run/spire/data"
}

plugins {
    DataStore "sql" {
        plugin_data {
            database_type = "postgres"
            connection_string = "host=db.internal dbname=spire sslmode=verify-full"
        }
    }
}</code></pre>

        <h2>Nested SPIRE</h2>

        <p>Nested SPIRE creates a hierarchy where a child SPIRE Server gets its CA certificate from a parent SPIRE Server. This is useful for multi-team deployments where each team manages their own SPIRE Server, organizations with multiple environments (dev/staging/prod), and compliance requirements that mandate separate CA hierarchies.</p>

        <h2>SPIFFE Federation</h2>

        <p>Federation allows workloads in different trust domains to verify each other&rsquo;s identities. Each SPIRE Server shares its trust bundle with the other, enabling cross-domain mTLS.</p>

        <pre><code># Server A configuration (federates with cluster-b):
server {
    trust_domain = "cluster-a.company.org"
    federation {
        bundle_endpoint {
            address = "0.0.0.0"
            port = 8443
        }
    }
}

# Register the federated trust domain:
spire-server bundle set -id spiffe://cluster-b.company.org \\
  -path /path/to/cluster-b-bundle.pem</code></pre>

        <h2>Multi-Cloud Architectures</h2>

        <p>SPIRE works across AWS, GCP, Azure, and on-premise because identity is based on attestation, not cloud-specific constructs. Each environment has its own attestation plugins but all participate in the same trust domain (or federate across domains).</p>

        <h2>Migration Strategy: Adopting SPIFFE Incrementally</h2>

        <p>Most companies cannot switch to SPIFFE overnight. The proven migration path:</p>

        <ol>
          <li><strong>Phase 1 &mdash; Deploy SPIRE alongside existing identity:</strong> Run SPIRE in parallel without changing any service. Just get SVIDs flowing.</li>
          <li><strong>Phase 2 &mdash; Enable mTLS on one critical path:</strong> Pick one service-to-service connection (e.g., API &rarr; database proxy). Add SPIRE-based mTLS. Keep the old auth as fallback.</li>
          <li><strong>Phase 3 &mdash; Expand incrementally:</strong> Service by service, switch from shared secrets to SVID-based authentication. Each switch is independent and reversible.</li>
          <li><strong>Phase 4 &mdash; Remove legacy auth:</strong> Once all services use SVIDs, remove the old shared secrets, API keys, and static certificates.</li>
          <li><strong>Phase 5 &mdash; Add authorization:</strong> Deploy OPA policies for fine-grained access control on top of the identity layer.</li>
        </ol>

        <p>Key principle: <strong>coexistence, not replacement</strong>. SPIRE can run alongside existing PKI, Vault, and service mesh CAs during migration. You do not need to rip and replace.</p>

        <h2>Incident Thinking: What Happens If...</h2>

        <ul>
          <li><strong>SPIRE Server fails?</strong> Agents cache SVIDs locally. Existing workloads continue with cached certificates until TTL expires. New workloads cannot get SVIDs until the server recovers. This is why HA is critical.</li>
          <li><strong>Datastore becomes unavailable?</strong> Server cannot create or modify registration entries but continues serving cached entries. Recovery requires datastore restoration.</li>
          <li><strong>Trust bundle expires?</strong> All SVID verification fails across the trust domain. This is a catastrophic event &mdash; monitor CA TTL and rotate well before expiry.</li>
          <li><strong>Federation breaks?</strong> Cross-cluster communication fails but intra-cluster communication continues. Each trust domain is independent.</li>
          <li><strong>Compromised agent issues rogue SVIDs?</strong> The agent can only issue SVIDs for registered workloads on its node. Blast radius is limited to that node. Revoke the agent&rsquo;s attestation to stop it.</li>
        </ul>
      `,
      labs: [
        {
          title: 'Deploying SPIRE in HA Mode',
          objective: 'Deploy a 3-replica SPIRE Server with PostgreSQL.',
          repoPath: 'module-09/lab-01',
          steps: ['Deploy PostgreSQL for SPIRE datastore', 'Deploy 3 SPIRE Server replicas', 'Verify leader election and failover', 'Simulate a server failure and observe recovery'],
        },
        {
          title: 'Configuring SPIFFE Federation',
          objective: 'Federate two SPIRE deployments for cross-cluster trust.',
          repoPath: 'module-09/lab-02',
          steps: ['Deploy two separate SPIRE instances (two Kind clusters)', 'Exchange trust bundles between the instances', 'Register federated workload entries', 'Verify cross-cluster mTLS communication'],
        },
      ],
      keyTakeaways: [
        'Production SPIRE requires HA with shared database (PostgreSQL/MySQL)',
        'Nested SPIRE enables hierarchical trust for multi-team organizations',
        'Federation allows cross-trust-domain authentication via bundle exchange',
        'Multi-cloud works because attestation is plugin-based, not cloud-specific',
        'Plan trust domain boundaries early — they are hard to change later',
      ],
      whyThisMatters: 'Single-server SPIRE works for demos. Production requires high availability, multi-cluster federation, and disaster recovery. This module teaches you the architecture patterns that organizations with thousands of services deploy.',
      realWorldUseCases: ['Multi-cluster Kubernetes with unified trust', 'Multi-cloud deployments (AWS + GCP) sharing workload identity', 'Organizational mergers where separate trust domains need to federate', 'Disaster recovery where a standby SPIRE Server takes over automatically'],
      commonMistakes: ['Running SPIRE Server with SQLite in production (no HA support)', 'Not planning federation before deploying to multiple clusters', 'Using different trust domains for dev/staging/prod when they need to communicate', 'Not testing failover before you need it in an actual outage'],
      thinkLikeAnEngineer: ['Should federation be centralized (hub-and-spoke) or decentralized (mesh)?', 'When should you use nested SPIRE vs federated SPIRE?', 'How do you handle trust domain migration without downtime?', 'What is the blast radius if one SPIRE Server is compromised?'],
      operationalStory: 'An e-commerce platform expanded from one Kubernetes cluster to three across two cloud providers. Initially, each cluster had its own identity system — separate Vault instances, separate certificates. Cross-cluster communication required manual certificate exchange. After deploying federated SPIRE, services in any cluster could verify identities from any other cluster automatically. The federation bundle exchange took 15 minutes to configure.',
      securityRisks: ['Federation trusts everything in the remote trust domain — scope bundles carefully', 'Compromised SPIRE Server in an HA setup can issue rogue SVIDs until detected', 'Shared PostgreSQL datastore between replicas is a single point of compromise'],
    },
    {
      number: 10,
      title: 'Day Two Operations and Observability',
      slug: 'day-two-operations-observability',
      subtitle: 'Monitor, troubleshoot, and maintain SPIRE in production',
      duration: '3 hours',
      objectives: [
        'Monitor SPIRE with Prometheus metrics',
        'Debug common attestation and rotation failures',
        'Plan certificate rotation and upgrade strategies',
        'Implement operational runbooks for SPIRE',
      ],
      svgDiagram: '<svg viewBox="0 0 800 300" xmlns="http://www.w3.org/2000/svg"><rect width="800" height="300" fill="#0f172a" rx="12"/><text x="400" y="28" text-anchor="middle" fill="#94a3b8" font-size="14" font-weight="bold">SPIRE OBSERVABILITY STACK</text><rect x="300" y="50" width="200" height="50" rx="8" fill="#1e293b" stroke="#a855f7" stroke-width="2"/><text x="400" y="80" text-anchor="middle" fill="#c084fc" font-size="11" font-weight="bold">SPIRE Server + Agent</text><rect x="50" y="150" width="150" height="50" rx="8" fill="#1e293b" stroke="#f97316" stroke-width="2"/><text x="125" y="180" text-anchor="middle" fill="#fdba74" font-size="11" font-weight="bold">Prometheus</text><rect x="250" y="150" width="150" height="50" rx="8" fill="#1e293b" stroke="#22c55e" stroke-width="2"/><text x="325" y="180" text-anchor="middle" fill="#86efac" font-size="11" font-weight="bold">Grafana</text><rect x="450" y="150" width="150" height="50" rx="8" fill="#1e293b" stroke="#3b82f6" stroke-width="2"/><text x="525" y="180" text-anchor="middle" fill="#93c5fd" font-size="11" font-weight="bold">AlertManager</text><rect x="650" y="150" width="120" height="50" rx="8" fill="#1e293b" stroke="#ef4444" stroke-width="2"/><text x="710" y="180" text-anchor="middle" fill="#fca5a5" font-size="11" font-weight="bold">Loki (Logs)</text><line x1="350" y1="100" x2="125" y2="150" stroke="#f97316" stroke-width="1.5"/><line x1="400" y1="100" x2="325" y2="150" stroke="#22c55e" stroke-width="1.5"/><line x1="450" y1="100" x2="525" y2="150" stroke="#3b82f6" stroke-width="1.5"/><line x1="500" y1="100" x2="710" y2="150" stroke="#ef4444" stroke-width="1.5"/><rect x="100" y="240" width="600" height="40" rx="6" fill="#22c55e" fill-opacity="0.1" stroke="#22c55e"/><text x="400" y="262" text-anchor="middle" fill="#22c55e" font-size="10">Key Metrics: svid_rotation_count | attestation_errors | bundle_update_latency | active_agents</text></svg>',
      content: `
        <p>Deploying SPIRE is step one. Keeping it healthy in production is the ongoing challenge. This module covers the operational practices that keep SPIRE running reliably: monitoring, alerting, debugging, and maintenance.</p>

        <h2>Monitoring SPIRE</h2>

        <p>SPIRE exposes Prometheus metrics for both the Server and Agent. Key metrics to monitor:</p>

        <pre><code># Server metrics:
spire_server_ca_manager_x509_ca_rotate_total    # CA rotation count
spire_server_registration_api_entry_count       # Active registrations
spire_server_node_attestation_duration_seconds  # Attestation latency

# Agent metrics:
spire_agent_svid_rotations_total              # SVID rotation count
spire_agent_workload_api_connections          # Active workload connections
spire_agent_attestation_errors_total          # Failed attestations

# Alert on:
# - attestation_errors increasing (broken workload config)
# - svid_rotations_total stalling (rotation failure)
# - node count decreasing (agents disconnecting)</code></pre>

        <h2>Troubleshooting Common Issues</h2>

        <h3>Node Attestation Fails</h3>
        <pre><code># Symptom: Agent cannot connect to Server
# Check: Agent logs for attestation error details
# Common causes:
# - Expired join token (regenerate with spire-server token generate)
# - Network connectivity to SPIRE Server port 8081
# - Clock skew between agent node and server (SVIDs are time-sensitive)</code></pre>

        <h3>Workload Gets No SVID</h3>
        <pre><code># Symptom: Application cannot fetch identity from Workload API
# Debug steps:
# 1. Check registration entries match the workload selectors
spire-server entry show -selector k8s:ns:my-namespace

# 2. Check agent can see the workload
spire-agent api fetch x509 -socketPath /run/spire/sockets/agent.sock

# 3. Check the workload API socket is mounted correctly
ls -la /run/spire/sockets/agent.sock</code></pre>

        <h2>Certificate Rotation Strategies</h2>

        <p>SVID TTL defaults to 1 hour. Shorter TTLs are more secure but increase load on the SPIRE Server. Production recommendations: 1 hour for standard workloads, 15 minutes for high-security workloads, and ensure your monitoring alerts if rotation has not occurred within 80% of TTL.</p>

        <h2>Upgrade Strategies</h2>

        <p>SPIRE supports rolling upgrades. Upgrade Agents first (they are stateless), then upgrade the Server. Always test upgrades in a non-production environment first. Keep the datastore backed up before Server upgrades.</p>
      `,
      labs: [
        {
          title: 'Monitoring SPIRE Metrics',
          objective: 'Set up Prometheus and Grafana dashboards for SPIRE.',
          repoPath: 'module-10/lab-01',
          steps: ['Configure SPIRE to expose Prometheus metrics', 'Deploy Prometheus with SPIRE scrape targets', 'Import the SPIRE Grafana dashboard', 'Create alerts for attestation failures and rotation stalls'],
        },
        {
          title: 'Debugging Registration Failures',
          objective: 'Troubleshoot common SPIRE issues using production debugging techniques.',
          repoPath: 'module-10/lab-02',
          steps: ['Introduce intentional misconfigurations', 'Use spire-server and spire-agent CLI for debugging', 'Read agent and server logs to identify root causes', 'Fix the issues and verify recovery'],
        },
      ],
      keyTakeaways: [
        'Monitor svid_rotations, attestation_errors, and active_agents continuously',
        'Alert on rotation stalls — a stopped rotation means expired certificates soon',
        'Debug workload identity issues by checking: registration entry, agent logs, socket mount',
        'Upgrade agents first (stateless), then server — always backup the datastore',
        'Document operational runbooks for common failure scenarios',
      ],
      whyThisMatters: 'Deploying SPIRE is day one. Keeping it running reliably is every day after. Production incidents from certificate expiry, attestation failures, and datastore issues are inevitable. This module gives you the monitoring, debugging, and operational playbooks to handle them confidently.',
      realWorldUseCases: ['24/7 monitoring of SVID rotation across 100+ services', 'Incident response for certificate expiry events', 'Capacity planning for SPIRE Server based on registration entry growth', 'Automated alerting for attestation failures indicating configuration drift'],
      commonMistakes: ['Not monitoring SVID rotation — stalled rotation means imminent certificate expiry', 'Running upgrades without backup — corrupted datastore means losing all registrations', 'Ignoring clock skew between nodes — SVIDs have time-based validity', 'No runbooks — team scrambles during incidents instead of following documented procedures'],
      productionNotes: ['Set alerts for: svid_rotations_total stalling, attestation_errors increasing, active_agent_count decreasing.', 'Always backup the SPIRE datastore before upgrades. A corrupted migration means regenerating all registrations.', 'SPIRE supports rolling upgrades: upgrade Agents first (they are stateless), then the Server.'],
      operationalStory: 'A production SPIRE deployment went 3 months without issues. Then one Monday morning, services started failing with TLS handshake errors. Investigation revealed that SVID rotation had silently stalled on 12 nodes after a kernel update changed the clock synchronization. The team had no alerting for rotation metrics. After adding Prometheus alerts for stalled rotations, they caught the next occurrence in 5 minutes instead of 3 hours.',
      careerRelevance: 'SRE and platform engineering roles increasingly require operating identity infrastructure. Engineers who can monitor, troubleshoot, and maintain SPIRE in production are scarce and highly valued.',
    },    {
      number: 11,
      title: 'The SPIFFE/SPIRE Ecosystem',
      slug: 'spiffe-spire-ecosystem',
      subtitle: 'Real-world integrations: Vault, Cilium, CI/CD, and enterprise patterns',
      duration: '3 hours',
      objectives: [
        'Integrate SPIRE with HashiCorp Vault for secret management',
        'Connect SPIRE with Cilium for network identity',
        'Use SPIFFE identity in CI/CD pipelines',
        'Understand enterprise adoption patterns and case studies',
      ],
      svgDiagram: '<svg viewBox="0 0 800 300" xmlns="http://www.w3.org/2000/svg"><rect width="800" height="300" fill="#0f172a" rx="12"/><text x="400" y="28" text-anchor="middle" fill="#94a3b8" font-size="14" font-weight="bold">SPIFFE ECOSYSTEM INTEGRATIONS</text><circle cx="400" cy="160" r="50" fill="#1e293b" stroke="#a855f7" stroke-width="2"/><text x="400" y="155" text-anchor="middle" fill="#c084fc" font-size="11" font-weight="bold">SPIRE</text><text x="400" y="172" text-anchor="middle" fill="#94a3b8" font-size="9">Identity Provider</text><rect x="80" y="50" width="120" height="40" rx="6" fill="#1e293b" stroke="#f97316" stroke-width="1.5"/><text x="140" y="75" text-anchor="middle" fill="#fdba74" font-size="10">Vault</text><rect x="600" y="50" width="120" height="40" rx="6" fill="#1e293b" stroke="#22c55e" stroke-width="1.5"/><text x="660" y="75" text-anchor="middle" fill="#86efac" font-size="10">Cilium</text><rect x="80" y="220" width="120" height="40" rx="6" fill="#1e293b" stroke="#3b82f6" stroke-width="1.5"/><text x="140" y="245" text-anchor="middle" fill="#93c5fd" font-size="10">GitHub Actions</text><rect x="600" y="220" width="120" height="40" rx="6" fill="#1e293b" stroke="#06b6d4" stroke-width="1.5"/><text x="660" y="245" text-anchor="middle" fill="#67e8f9" font-size="10">Envoy</text><rect x="280" y="50" width="100" height="40" rx="6" fill="#1e293b" stroke="#eab308" stroke-width="1.5"/><text x="330" y="75" text-anchor="middle" fill="#eab308" font-size="10">Istio</text><rect x="420" y="50" width="100" height="40" rx="6" fill="#1e293b" stroke="#ef4444" stroke-width="1.5"/><text x="470" y="75" text-anchor="middle" fill="#fca5a5" font-size="10">OPA</text><rect x="280" y="220" width="100" height="40" rx="6" fill="#1e293b" stroke="#ec4899" stroke-width="1.5"/><text x="330" y="245" text-anchor="middle" fill="#f472b6" font-size="10">Terraform</text><rect x="420" y="220" width="100" height="40" rx="6" fill="#1e293b" stroke="#8b5cf6" stroke-width="1.5"/><text x="470" y="245" text-anchor="middle" fill="#a78bfa" font-size="10">ArgoCD</text><line x1="355" y1="125" x2="200" y2="80" stroke="#f97316" stroke-width="1"/><line x1="445" y1="125" x2="600" y2="80" stroke="#22c55e" stroke-width="1"/><line x1="355" y1="195" x2="200" y2="230" stroke="#3b82f6" stroke-width="1"/><line x1="445" y1="195" x2="600" y2="230" stroke="#06b6d4" stroke-width="1"/><line x1="370" y1="115" x2="330" y2="90" stroke="#eab308" stroke-width="1"/><line x1="430" y1="115" x2="470" y2="90" stroke="#ef4444" stroke-width="1"/><line x1="370" y1="205" x2="330" y2="220" stroke="#ec4899" stroke-width="1"/><line x1="430" y1="205" x2="470" y2="220" stroke="#8b5cf6" stroke-width="1"/></svg>',
      content: `
        <p>SPIRE does not exist in isolation. It integrates with the broader cloud-native ecosystem to provide identity for secrets management, network security, CI/CD pipelines, and GitOps workflows.</p>

        <h2>SPIRE + HashiCorp Vault</h2>

        <p>Vault can use SPIFFE identities for authentication. Instead of distributing Vault tokens (another secret to manage), workloads authenticate to Vault using their SVID. Vault verifies the SVID against the SPIRE trust bundle and issues a Vault token with the appropriate policies.</p>

        <h2>SPIRE + Cilium</h2>

        <p>Cilium (eBPF-based networking) can use SPIFFE identities for network-level identity enforcement. This combines Kubernetes-native networking with cryptographic workload identity for defense-in-depth.</p>

        <h2>SPIFFE in CI/CD Pipelines</h2>

        <p>CI/CD pipelines are workloads too. They need identity to pull from registries, deploy to clusters, and access secrets. SPIFFE gives pipelines cryptographic identity instead of long-lived tokens.</p>

        <pre><code># GitHub Actions with SPIFFE identity:
# 1. GitHub OIDC token identifies the workflow
# 2. SPIRE attests the workflow as a workload
# 3. Pipeline receives an SVID
# 4. Uses SVID to authenticate to production systems

# No long-lived secrets in GitHub!
# Identity is ephemeral and scoped to the specific workflow run</code></pre>

        <h2>Enterprise Adoption Patterns</h2>

        <ul>
          <li><strong>Bloomberg:</strong> Uses SPIRE for workload identity across 100,000+ services</li>
          <li><strong>Uber:</strong> Integrated SPIFFE for inter-service authentication</li>
          <li><strong>Pinterest:</strong> Uses SPIRE for zero-trust networking</li>
          <li><strong>ByteDance:</strong> Deploys SPIRE at massive scale for cloud-native identity</li>
        </ul>
      `,
      labs: [
        {
          title: 'Vault Authentication with SPIFFE',
          objective: 'Configure Vault to accept SPIFFE identities for authentication.',
          repoPath: 'module-11/lab-01',
          steps: ['Deploy Vault with the JWT auth method', 'Configure Vault to trust the SPIRE trust bundle', 'Authenticate a workload using its JWT-SVID', 'Retrieve secrets with the SPIFFE-authenticated token'],
        },
        {
          title: 'CI/CD Workload Identity',
          objective: 'Give CI/CD pipelines SPIFFE identity instead of static credentials.',
          repoPath: 'module-11/lab-02',
          steps: ['Configure SPIRE to attest CI/CD runners', 'Issue SVIDs to pipeline workloads', 'Use the SVID to deploy to Kubernetes', 'Remove all static credentials from the pipeline'],
        },
      ],
      keyTakeaways: [
        'Vault + SPIFFE eliminates the need to distribute Vault tokens',
        'CI/CD pipelines should have cryptographic identity, not static secrets',
        'SPIFFE integrates with the entire CNCF ecosystem (Cilium, Envoy, OPA, Istio)',
        'Enterprise adoption is real — Bloomberg, Uber, Pinterest use SPIRE at scale',
        'The ecosystem is growing — early adopters have a skills advantage',
      ],
      whyThisMatters: 'SPIRE does not exist in isolation. In production, it integrates with Vault for secrets, Cilium for networking, CI/CD for pipeline identity, and GitOps for declarative operations. Understanding the ecosystem makes you the engineer who connects all the pieces.',
      realWorldUseCases: ['Vault authentication with SPIFFE — eliminating Vault token distribution', 'CI/CD workload identity — GitHub Actions getting SPIFFE SVIDs instead of static secrets', 'Cilium with SPIFFE — combining eBPF networking with cryptographic identity', 'Terraform with SPIFFE — infrastructure provisioning tools authenticating to APIs'],
      commonMistakes: ['Using static Vault tokens alongside SPIFFE (defeats the purpose)', 'Not securing the OIDC discovery endpoint for JWT verification', 'Attempting to replace all existing auth at once instead of migrating incrementally'],
      productionAlternatives: [{ name: 'Vault alone', description: 'Good for secret storage but creates its own token management problem. SPIFFE + Vault eliminates Vault token distribution.' }, { name: 'Cloud IAM alone', description: 'Works within one cloud but breaks in multi-cloud. SPIFFE provides portable identity.' }, { name: 'Kubernetes Service Accounts alone', description: 'Limited to one cluster, no mTLS, no automatic rotation, no federation.' }],
      careerRelevance: 'The CNCF ecosystem is where the industry is heading. Engineers who understand how SPIFFE connects Vault, Cilium, Envoy, OPA, and CI/CD are uniquely positioned for platform engineering leadership roles.',
    },
    {
      number: 12,
      title: 'Building a Complete Zero Trust Platform',
      slug: 'building-zero-trust-platform',
      subtitle: 'Capstone project: assemble everything into a production architecture',
      duration: '4 hours',
      objectives: [
        'Design an end-to-end zero trust platform architecture',
        'Deploy SPIRE with Envoy mTLS and OPA authorization',
        'Implement federation across two clusters',
        'Create a reference architecture for your organization',
      ],
      svgDiagram: '<svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg"><rect width="800" height="400" fill="#0f172a" rx="12"/><text x="400" y="28" text-anchor="middle" fill="#94a3b8" font-size="14" font-weight="bold">ZERO TRUST PLATFORM — CAPSTONE ARCHITECTURE</text><rect x="250" y="45" width="300" height="40" rx="6" fill="#a855f7" fill-opacity="0.15" stroke="#a855f7" stroke-width="1.5"/><text x="400" y="70" text-anchor="middle" fill="#c084fc" font-size="11" font-weight="bold">SPIRE Server (HA) — Identity Authority</text><rect x="30" y="110" width="350" height="260" rx="10" fill="none" stroke="#3b82f6" stroke-width="1.5" stroke-dasharray="5,3"/><text x="205" y="130" text-anchor="middle" fill="#3b82f6" font-size="10" font-weight="bold">Cluster A (Production)</text><rect x="50" y="145" width="140" height="35" rx="5" fill="#1e293b" stroke="#22c55e"/><text x="120" y="167" text-anchor="middle" fill="#86efac" font-size="9">Frontend + Envoy</text><rect x="220" y="145" width="140" height="35" rx="5" fill="#1e293b" stroke="#22c55e"/><text x="290" y="167" text-anchor="middle" fill="#86efac" font-size="9">API + Envoy</text><rect x="50" y="200" width="140" height="35" rx="5" fill="#1e293b" stroke="#22c55e"/><text x="120" y="222" text-anchor="middle" fill="#86efac" font-size="9">Orders + Envoy</text><rect x="220" y="200" width="140" height="35" rx="5" fill="#1e293b" stroke="#22c55e"/><text x="290" y="222" text-anchor="middle" fill="#86efac" font-size="9">Payments + Envoy</text><rect x="100" y="255" width="200" height="35" rx="5" fill="#1e293b" stroke="#f97316"/><text x="200" y="277" text-anchor="middle" fill="#fdba74" font-size="9">OPA (Policy Engine)</text><rect x="100" y="310" width="200" height="35" rx="5" fill="#1e293b" stroke="#06b6d4"/><text x="200" y="332" text-anchor="middle" fill="#67e8f9" font-size="9">SPIRE Agents (DaemonSet)</text><rect x="430" y="110" width="340" height="260" rx="10" fill="none" stroke="#f97316" stroke-width="1.5" stroke-dasharray="5,3"/><text x="600" y="130" text-anchor="middle" fill="#f97316" font-size="10" font-weight="bold">Cluster B (Staging)</text><rect x="450" y="145" width="140" height="35" rx="5" fill="#1e293b" stroke="#22c55e"/><text x="520" y="167" text-anchor="middle" fill="#86efac" font-size="9">Frontend + Envoy</text><rect x="620" y="145" width="140" height="35" rx="5" fill="#1e293b" stroke="#22c55e"/><text x="690" y="167" text-anchor="middle" fill="#86efac" font-size="9">API + Envoy</text><rect x="500" y="255" width="200" height="35" rx="5" fill="#1e293b" stroke="#f97316"/><text x="600" y="277" text-anchor="middle" fill="#fdba74" font-size="9">OPA (Policy Engine)</text><rect x="500" y="310" width="200" height="35" rx="5" fill="#1e293b" stroke="#06b6d4"/><text x="600" y="332" text-anchor="middle" fill="#67e8f9" font-size="9">SPIRE Agents (DaemonSet)</text><path d="M380 200 L430 200" stroke="#22c55e" stroke-width="2.5"/><text x="405" y="195" text-anchor="middle" fill="#22c55e" font-size="8">mTLS</text></svg>',
      content: `
        <p>This is the capstone module. You will combine everything from the previous 11 modules into a complete, production-style zero trust platform. By the end, you will have a fully functional multi-cluster deployment with SPIRE, Envoy, OPA, and federation.</p>

        <h2>Architecture Overview</h2>

        <p>The capstone project deploys a microservice e-commerce application across two Kubernetes clusters with every service identified by SPIRE, all communication encrypted with Envoy mTLS, authorization enforced by OPA policies, cross-cluster communication via SPIFFE federation, and monitoring via Prometheus and Grafana.</p>

        <h2>What You Will Build</h2>

        <ol>
          <li><strong>Deploy SPIRE in HA mode</strong> on both clusters</li>
          <li><strong>Configure automatic workload registration</strong> via Controller Manager</li>
          <li><strong>Deploy Envoy sidecars</strong> for transparent mTLS</li>
          <li><strong>Write and deploy OPA policies</strong> for service-to-service authorization</li>
          <li><strong>Configure federation</strong> between the two clusters</li>
          <li><strong>Deploy monitoring</strong> with SPIRE-specific dashboards</li>
          <li><strong>Test failure scenarios:</strong> what happens when identity expires? When a policy changes?</li>
        </ol>

        <h2>Reference Architecture</h2>

        <p>This architecture serves as a template you can adapt for your organization. The key decisions documented: trust domain naming, SPIFFE ID schema, attestation plugin choices, certificate TTL settings, policy structure, and monitoring/alerting thresholds.</p>

        <h2>Common Pitfalls</h2>

        <ul>
          <li><strong>Starting too big:</strong> Deploy SPIRE for one critical service first, then expand</li>
          <li><strong>Ignoring day-two operations:</strong> Monitoring and runbooks are not optional</li>
          <li><strong>Over-complicated policies:</strong> Start with broad allow rules, tighten incrementally</li>
          <li><strong>Not testing failure modes:</strong> What happens when SPIRE Server is down? Test it.</li>
        </ul>
      `,
      labs: [
        {
          title: 'Capstone: Build a Zero Trust Kubernetes Platform',
          objective: 'Deploy the complete zero trust stack end-to-end.',
          repoPath: 'module-12/capstone',
          steps: ['Create two Kind clusters for production and staging', 'Deploy SPIRE Server (HA) and Agents on both clusters', 'Deploy a microservice application with Envoy sidecars', 'Configure OPA policies for service authorization', 'Set up SPIFFE federation between clusters', 'Deploy Prometheus monitoring with SPIRE dashboards', 'Test by simulating a compromised service attempting unauthorized access'],
        },
      ],
      keyTakeaways: [
        'Zero trust is a system: identity (SPIRE) + encryption (Envoy) + authorization (OPA)',
        'Start with one critical service path and expand incrementally',
        'Document your trust domain schema, SPIFFE ID naming, and policy structure',
        'Test failure modes: expired certs, server downtime, policy misconfiguration',
        'This reference architecture is your template for production deployments',
      ],
      whyThisMatters: 'This capstone project is your proof of competence. By building a complete zero trust platform end-to-end, you demonstrate that you can architect, deploy, and operate production identity infrastructure — not just follow tutorials. This is what you put on your resume and discuss in interviews.',
      realWorldUseCases: ['Multi-cluster production deployment with HA and federation', 'Complete zero trust stack: identity + encryption + authorization', 'Production-style monitoring and incident response', 'Threat modeling: simulating a compromised service and verifying containment'],
      commonMistakes: ['Building everything at once instead of layering: identity first, then encryption, then authorization', 'Not testing failure scenarios: what happens when SPIRE Server goes down?', 'Skipping monitoring — deploying without dashboards means flying blind', 'Not documenting the architecture decisions for your team'],
      thinkLikeAnEngineer: ['How would you present this architecture to a VP of Engineering for approval?', 'What is the total cost of running this stack? (compute, storage, operational overhead)', 'How would you migrate an existing service mesh to use SPIRE instead of built-in CA?', 'What compliance frameworks (SOC 2, PCI-DSS, HIPAA) does this architecture help satisfy?'],
    },
    {
      number: 13,
      title: 'SPIFFE for AI Infrastructure',
      slug: 'spiffe-for-ai-infrastructure',
      subtitle: 'Bonus: securing AI agents, LLM pipelines, and vector databases',
      duration: '2 hours',
      objectives: [
        'Understand identity challenges in AI infrastructure',
        'Secure AI agent-to-service communication with SPIFFE',
        'Implement workload identity for ML pipelines',
        'Protect vector databases and model endpoints with mTLS',
      ],
      svgDiagram: '<svg viewBox="0 0 800 300" xmlns="http://www.w3.org/2000/svg"><rect width="800" height="300" fill="#0f172a" rx="12"/><text x="400" y="28" text-anchor="middle" fill="#94a3b8" font-size="14" font-weight="bold">SPIFFE FOR AI INFRASTRUCTURE</text><rect x="50" y="60" width="150" height="55" rx="8" fill="#1e293b" stroke="#a855f7" stroke-width="2"/><text x="125" y="82" text-anchor="middle" fill="#c084fc" font-size="10" font-weight="bold">AI Agent</text><text x="125" y="100" text-anchor="middle" fill="#94a3b8" font-size="9">SPIFFE ID: /ai/agent-1</text><rect x="250" y="60" width="150" height="55" rx="8" fill="#1e293b" stroke="#3b82f6" stroke-width="2"/><text x="325" y="82" text-anchor="middle" fill="#93c5fd" font-size="10" font-weight="bold">LLM Service</text><text x="325" y="100" text-anchor="middle" fill="#94a3b8" font-size="9">SPIFFE ID: /ai/llm</text><rect x="450" y="60" width="150" height="55" rx="8" fill="#1e293b" stroke="#22c55e" stroke-width="2"/><text x="525" y="82" text-anchor="middle" fill="#86efac" font-size="10" font-weight="bold">Vector DB</text><text x="525" y="100" text-anchor="middle" fill="#94a3b8" font-size="9">SPIFFE ID: /ai/vectordb</text><rect x="650" y="60" width="120" height="55" rx="8" fill="#1e293b" stroke="#f97316" stroke-width="2"/><text x="710" y="82" text-anchor="middle" fill="#fdba74" font-size="10" font-weight="bold">MCP Server</text><text x="710" y="100" text-anchor="middle" fill="#94a3b8" font-size="9">SPIFFE ID: /ai/mcp</text><line x1="200" y1="87" x2="250" y2="87" stroke="#22c55e" stroke-width="2"/><line x1="400" y1="87" x2="450" y2="87" stroke="#22c55e" stroke-width="2"/><line x1="600" y1="87" x2="650" y2="87" stroke="#22c55e" stroke-width="2"/><text x="400" y="145" text-anchor="middle" fill="#22c55e" font-size="10">All communication secured with mTLS via SPIFFE SVIDs</text><rect x="100" y="170" width="600" height="100" rx="8" fill="#22c55e" fill-opacity="0.05" stroke="#22c55e" stroke-width="1"/><text x="400" y="195" text-anchor="middle" fill="#22c55e" font-size="11" font-weight="bold">Why AI Infrastructure Needs Workload Identity</text><text x="400" y="215" text-anchor="middle" fill="#94a3b8" font-size="9">AI agents act autonomously — they need verified identity, not API keys</text><text x="400" y="232" text-anchor="middle" fill="#94a3b8" font-size="9">LLM calls are expensive — identity prevents unauthorized model access</text><text x="400" y="249" text-anchor="middle" fill="#94a3b8" font-size="9">Vector databases contain sensitive embeddings — mTLS protects data in transit</text><text x="400" y="266" text-anchor="middle" fill="#94a3b8" font-size="9">MCP servers expose tools to AI — only authorized agents should access them</text></svg>',
      content: `
        <p>AI infrastructure introduces new identity challenges. AI agents make autonomous decisions and call tools. LLM endpoints are expensive to invoke. Vector databases contain sensitive embeddings. MCP servers expose powerful tools. All of these need workload identity — not shared API keys.</p>

        <h2>The AI Identity Problem</h2>

        <p>Traditional AI/ML pipelines use shared API keys for model access, unencrypted gRPC between training services, static tokens for vector database authentication, and no identity verification between AI agents and tools. In the era of autonomous AI agents, this is a security disaster. An agent with a stolen API key can access any model, any database, any tool.</p>

        <h2>SPIFFE for AI Agents</h2>

        <pre><code># AI Agent SPIFFE IDs:
spiffe://ai.company.org/agent/customer-support/v2
spiffe://ai.company.org/agent/code-review/v1
spiffe://ai.company.org/pipeline/training/job-123

# Each agent gets its own identity
# OPA policies control which agents can access which models/tools
# No shared API keys — each agent authenticates with its SVID</code></pre>

        <h2>Securing MCP Servers</h2>

        <p>Model Context Protocol (MCP) servers give AI agents access to tools — file systems, databases, APIs. Without identity, any process on the network can call MCP tools. With SPIFFE, only verified agents can access specific MCP servers.</p>

        <h2>Vector Database Protection</h2>

        <p>Vector databases store embeddings of sensitive documents. mTLS with SPIFFE ensures that only authorized services can query the vector database, queries are encrypted in transit, and access is logged with verified identity for audit.</p>

        <h2>Future of Workload Identity</h2>

        <p>As AI becomes more autonomous, workload identity becomes more critical. The same SPIFFE infrastructure you build for microservices today will secure your AI agents tomorrow. Early investment in workload identity pays compound returns.</p>
      `,
      labs: [
        {
          title: 'Securing AI Agent Communication',
          objective: 'Give AI agents SPIFFE identities and enforce access policies.',
          repoPath: 'module-13/lab-01',
          steps: ['Deploy a simulated AI agent with SPIFFE identity', 'Deploy an LLM mock service with SPIFFE identity', 'Configure mTLS between agent and LLM service', 'Add OPA policy: only authorized agents can call the LLM endpoint'],
        },
      ],
      keyTakeaways: [
        'AI agents are workloads — they need cryptographic identity, not API keys',
        'SPIFFE secures agent-to-LLM, agent-to-tool, and agent-to-database communication',
        'MCP servers should verify agent identity before granting tool access',
        'The zero trust skills you learn for microservices apply directly to AI infrastructure',
        'Early adoption of workload identity for AI is a career differentiator',
      ],
      whyThisMatters: 'AI infrastructure is the next frontier for workload identity. As AI agents become autonomous, they need verified identities to access tools, databases, and other services. The same SPIFFE infrastructure you build for microservices today secures your AI agents tomorrow. This is not theoretical — it is already happening in production systems.',
      realWorldUseCases: ['AI agent authentication — autonomous agents proving identity to APIs', 'LLM endpoint protection — only authorized services can invoke expensive model calls', 'Vector database access control — mTLS for embedding storage and retrieval', 'MCP server security — verifying which agents can access which tools', 'ML pipeline identity — training jobs authenticating to data sources'],
      commonMistakes: ['Using shared API keys for AI agents (one compromised key exposes all models)', 'Not scoping AI agent permissions — an agent that can query should not be able to train', 'Treating AI workloads differently from microservices — they need the same identity primitives'],
      thinkLikeAnEngineer: ['How do you identity-scope an AI agent that dynamically decides which tools to call?', 'What happens when an AI agent needs to access resources across federated trust domains?', 'How do you audit AI agent access patterns for compliance?'],
      careerRelevance: 'AI infrastructure security is an emerging discipline with very few practitioners. Engineers who understand both workload identity (SPIFFE) and AI systems (agents, MCP, vector databases) are uniquely positioned for the next wave of platform engineering roles.',
      beforeAfter: { before: ['Shared API keys for all AI agents', 'No distinction between agent roles', 'Unencrypted agent-to-service communication', 'No audit trail for AI tool access'], after: ['Unique SPIFFE identity per AI agent', 'Fine-grained OPA policies per agent role', 'mTLS between agents and services', 'Complete audit trail with verified identity'] },
    },    ],
  },
];
