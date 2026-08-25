import type { CourseOutline } from '../../course-outline';

export const MASTERING_SPIFFE_SPIRE_OUTLINE: CourseOutline = {
  "id": "course-1",
  "title": "Mastering SPIFFE & SPIRE: Zero Trust for Cloud Native Systems",
  "slug": "mastering-spiffe-spire",
  "subtitle": "Learn modern cloud-native identity security and become the engineer who secures production Kubernetes clusters - for free.",
  "excerpt": "Go from \"what is workload identity?\" to deploying production-grade SPIRE on Kubernetes with mTLS, OPA policy enforcement, and multi-cluster federation. 13 modules, 30+ labs, completely free.",
  "description": "Replace secret sprawl with workload identity. The most comprehensive free course on SPIFFE and SPIRE - the CNCF standard for machine identity in cloud-native systems. Learn zero trust architecture, PKI fundamentals, Kubernetes workload identity, service mesh integration, and production operations through 30+ hands-on labs and real-world architecture patterns. Go from shared secrets and manual certificates to automatic, cryptographic workload identity.",
  "instructor": {
    "name": "Vishal Anand",
    "title": "Senior Product Engineer & Open Source Contributor",
    "bio": "Creator of DRF API Logger, an open-source package powering API observability across thousands of enterprise Django applications. Vishal builds production infrastructure at scale and created this course to fill the gap in practical SPIFFE/SPIRE education - teaching real deployment patterns, not just theory.",
    "github": "https://github.com/vishalanandl177",
    "achievements": [
      "Creator of DRF API Logger - open source with 1,200+ GitHub stars",
      "Used across enterprise systems for API observability",
      "Senior Product Engineer with production Kubernetes experience",
      "Technical writer at coderssecret.com - 80+ engineering tutorials"
    ]
  },
  "totalDuration": "40+ hours",
  "level": "Intermediate to Advanced",
  "tags": [
    "SPIFFE",
    "SPIRE",
    "Zero Trust",
    "Kubernetes",
    "mTLS",
    "PKI",
    "Service Mesh",
    "OPA",
    "Cloud Native",
    "CNCF",
    "Workload Identity",
    "Security"
  ],
  "category": "devops",
  "targetAudience": [
    "Platform Engineers building internal developer platforms",
    "DevOps Engineers managing Kubernetes clusters",
    "Security Engineers implementing zero trust",
    "Backend Developers securing microservice communication",
    "SREs responsible for production identity infrastructure",
    "Cloud Architects designing multi-cluster systems"
  ],
  "seoPages": [
    {
      "slug": "spiffe-spire",
      "title": "SPIFFE & SPIRE: The Complete Guide to Workload Identity",
      "description": "Learn what SPIFFE and SPIRE are, how they solve workload identity in cloud-native systems, and why they are the CNCF standard for zero trust security.",
      "ctaModule": 1,
      "content": "\n          <h1>SPIFFE &amp; SPIRE: The Complete Guide to Workload Identity</h1>\n\n          <p>In traditional infrastructure, services proved their identity through network location - if a request came from the right IP address, it was trusted. In cloud-native systems with ephemeral containers, auto-scaling pods, and multi-cloud deployments, network location means nothing. A pod&rsquo;s IP changes every time it restarts.</p>\n\n          <p><strong>SPIFFE</strong> (Secure Production Identity Framework For Everyone) solves this by giving every workload a cryptographic identity - an identity that is verifiable, short-lived, and automatically rotated. <strong>SPIRE</strong> (SPIFFE Runtime Environment) is the production implementation that manages these identities at scale.</p>\n\n          <h2>Why SPIFFE Matters Now</h2>\n\n          <p>The shift to Kubernetes, service meshes, and microservices created an identity crisis in infrastructure. Secrets stored in environment variables get leaked. Long-lived certificates expire and cause outages. API keys shared between services become attack vectors. SPIFFE replaces all of these with a standards-based identity system that works across clouds, clusters, and trust boundaries.</p>\n\n          <p>SPIFFE is a <strong>CNCF graduated project</strong> - the same maturity level as Kubernetes, Prometheus, and Envoy. It is not experimental. It is production infrastructure used by companies like Bloomberg, Uber, and Pinterest.</p>\n\n          <h2>What You Will Learn</h2>\n\n          <ul>\n            <li>How SPIFFE IDs provide cryptographic workload identity</li>\n            <li>X.509-SVIDs and JWT-SVIDs - the two identity document formats</li>\n            <li>How SPIRE manages identity lifecycle - attestation, issuance, rotation</li>\n            <li>Deploying SPIRE on Kubernetes with automatic workload registration</li>\n            <li>Integrating SPIRE with Envoy, Istio, and OPA for end-to-end zero trust</li>\n            <li>Production architecture patterns for multi-cluster and multi-cloud</li>\n          </ul>\n\n          <h2>Start Learning for Free</h2>\n\n          <p>Our <strong>Mastering SPIFFE &amp; SPIRE</strong> course covers everything from zero trust fundamentals to production operations across 13 modules and 30+ hands-on labs. No paywall, no signup wall - just practical education for engineers who secure real infrastructure.</p>\n        "
    },
    {
      "slug": "what-is-spire",
      "title": "What Is SPIRE? The SPIFFE Runtime Environment Explained",
      "description": "SPIRE is the production implementation of SPIFFE that manages workload identities. Learn how SPIRE Server, Agent, and attestation work together to secure your infrastructure.",
      "ctaModule": 4,
      "content": "\n          <h1>What Is SPIRE? The SPIFFE Runtime Environment Explained</h1>\n\n          <p>SPIRE (SPIFFE Runtime Environment) is the reference implementation of the SPIFFE specification. While SPIFFE defines <em>what</em> workload identity should look like, SPIRE provides the <em>how</em> - a production-ready system for issuing, managing, and rotating cryptographic identities for every workload in your infrastructure.</p>\n\n          <h2>SPIRE Architecture</h2>\n\n          <p>SPIRE consists of two main components:</p>\n\n          <ul>\n            <li><strong>SPIRE Server:</strong> The central authority that manages identity registrations and issues SVIDs (SPIFFE Verifiable Identity Documents). It maintains the trust root and communicates with SPIRE Agents.</li>\n            <li><strong>SPIRE Agent:</strong> Runs on every node (physical host, VM, or Kubernetes node). It attests workloads on that node and provides them with their identities via the SPIFFE Workload API.</li>\n          </ul>\n\n          <h2>How SPIRE Issues Identities</h2>\n\n          <ol>\n            <li><strong>Node Attestation:</strong> When a SPIRE Agent starts, it proves its identity to the SPIRE Server using platform-specific evidence (AWS instance identity document, Kubernetes service account token, etc.)</li>\n            <li><strong>Workload Attestation:</strong> When a workload requests an identity, the SPIRE Agent verifies the workload using OS-level or orchestrator-level selectors (PID, Kubernetes namespace/service account, Docker labels)</li>\n            <li><strong>SVID Issuance:</strong> After both attestation steps succeed, SPIRE issues an X.509-SVID or JWT-SVID to the workload</li>\n            <li><strong>Automatic Rotation:</strong> SVIDs are short-lived (typically 1 hour). SPIRE automatically rotates them before expiry - no application changes needed</li>\n          </ol>\n\n          <h2>Why Not Just Use Certificates Directly?</h2>\n\n          <p>You could manage certificates yourself with tools like cert-manager or Vault. But SPIRE provides: automatic attestation (no manual enrollment), short-lived certificates with automatic rotation, a standard API (SPIFFE Workload API) that any application can use, federation across trust domains for multi-cluster communication, and integration with service meshes like Envoy and Istio.</p>\n\n          <h2>Learn SPIRE Hands-On</h2>\n\n          <p>Our free course covers SPIRE architecture in depth, starting with Module 4 where you install SPIRE from binaries, configure the server and agent, and register your first workload. By Module 5, you will be running SPIRE on Kubernetes with automatic pod identity.</p>\n        "
    },
    {
      "slug": "workload-identity",
      "title": "Workload Identity: Why Network Location Is Not Identity",
      "description": "Workload identity gives every service a cryptographic identity independent of network location. Learn why IP-based trust fails in cloud-native systems and how SPIFFE solves it.",
      "ctaModule": 1,
      "content": "\n          <h1>Workload Identity: Why Network Location Is Not Identity</h1>\n\n          <p>For decades, we trusted services based on where they ran. If a request came from 10.0.1.50, it was the payment service. If it came from the 10.0.2.0/24 subnet, it was in the trusted zone. This model worked when servers had static IPs and lived for years.</p>\n\n          <p>In cloud-native systems, this model is fundamentally broken:</p>\n\n          <ul>\n            <li><strong>Containers get random IPs</strong> that change on every restart</li>\n            <li><strong>Auto-scaling creates and destroys instances</strong> continuously</li>\n            <li><strong>Service meshes route traffic</strong> through proxies, masking the original source</li>\n            <li><strong>Multi-cloud deployments</strong> span networks with overlapping IP ranges</li>\n            <li><strong>Attackers who compromise one pod</strong> can impersonate any service on the same network</li>\n          </ul>\n\n          <h2>The Secret Sprawl Problem</h2>\n\n          <p>Without workload identity, teams resort to shared secrets: API keys in environment variables, long-lived certificates copied between services, Vault tokens that themselves need distribution, and Kubernetes service account tokens that never expire. This is <strong>secret sprawl</strong> - a growing attack surface that becomes unmanageable at scale. Every shared secret is a potential breach vector. Every long-lived credential is a ticking clock.</p>\n\n          <h2>What Is Workload Identity?</h2>\n\n          <p>Workload identity (also called <strong>machine identity</strong> or <strong>service identity</strong>) assigns a <strong>cryptographic identity</strong> to every service, container, or process - an identity that is independent of network location, tied to the workload itself, cryptographically verifiable by any other workload, automatically issued and rotated, and short-lived to limit blast radius of compromise. It replaces secret sprawl with infrastructure-managed trust.</p>\n\n          <h2>The SPIFFE Standard</h2>\n\n          <p>SPIFFE (Secure Production Identity Framework For Everyone) is the CNCF standard for workload identity. It defines a URI-based identity format, two types of verifiable identity documents (X.509-SVIDs and JWT-SVIDs), a standard API for workloads to request their identities, and trust bundles for cross-domain verification.</p>\n\n          <h2>Real-World Impact</h2>\n\n          <p>With workload identity, you replace static API keys with automatically rotated cryptographic credentials, enable mutual TLS between services without managing certificates manually, implement fine-grained authorization based on verified identity rather than network rules, and federate trust across clusters and clouds without VPN tunnels.</p>\n\n          <h2>Start Your Workload Identity Journey</h2>\n\n          <p>Our free SPIFFE &amp; SPIRE course starts with the fundamentals of zero trust and workload identity in Module 1, then progressively builds to production Kubernetes deployments, service mesh integration, and multi-cluster federation.</p>\n        "
    },
    {
      "slug": "zero-trust-kubernetes",
      "title": "Zero Trust for Kubernetes: Moving Beyond Network Policies",
      "description": "Kubernetes NetworkPolicies are not zero trust. Learn how to implement real zero trust with SPIFFE/SPIRE workload identity, mTLS, and OPA policy enforcement.",
      "ctaModule": 5,
      "content": "\n          <h1>Zero Trust for Kubernetes: Moving Beyond Network Policies</h1>\n\n          <p>Most Kubernetes clusters rely on NetworkPolicies for security. While NetworkPolicies are useful, they only control <em>which pods can talk to which pods</em> at the network level. They do not verify identity, encrypt traffic, or enforce fine-grained authorization. A compromised pod in an allowed namespace can impersonate any service.</p>\n\n          <h2>What Zero Trust Means for Kubernetes</h2>\n\n          <p>Zero trust in Kubernetes means every pod has a verifiable cryptographic identity (not just a service account token), all pod-to-pod communication is encrypted with mutual TLS, authorization decisions are based on verified identity and context (not just namespace or label), and identities are short-lived and automatically rotated.</p>\n\n          <h2>The Stack: SPIRE + Envoy + OPA</h2>\n\n          <ul>\n            <li><strong>SPIRE:</strong> Issues cryptographic identities (X.509-SVIDs) to every pod via the SPIFFE Workload API</li>\n            <li><strong>Envoy (sidecar proxy):</strong> Handles mTLS transparently - applications do not need to implement TLS themselves</li>\n            <li><strong>OPA (Open Policy Agent):</strong> Enforces fine-grained authorization policies based on SPIFFE IDs</li>\n          </ul>\n\n          <h2>Why NetworkPolicies Are Not Enough</h2>\n\n          <table>\n            <thead><tr><th>Feature</th><th>NetworkPolicy</th><th>SPIRE + mTLS + OPA</th></tr></thead>\n            <tbody>\n              <tr><td>Identity verification</td><td>No</td><td>Cryptographic (X.509)</td></tr>\n              <tr><td>Encryption</td><td>No</td><td>mTLS (automatic)</td></tr>\n              <tr><td>Authorization granularity</td><td>Namespace/label</td><td>Per-service, per-method</td></tr>\n              <tr><td>Works across clusters</td><td>No</td><td>Yes (SPIFFE federation)</td></tr>\n              <tr><td>Audit trail</td><td>Limited</td><td>Full (identity + policy logs)</td></tr>\n            </tbody>\n          </table>\n\n          <h2>Learn Zero Trust Kubernetes</h2>\n\n          <p>Module 5 of our free course deploys SPIRE on Kubernetes, registers workloads, and retrieves SVIDs inside pods. Modules 7-8 add Envoy integration and OPA policy enforcement for a complete zero trust stack.</p>\n        "
    },
    {
      "slug": "spire-kubernetes-tutorial",
      "title": "SPIRE on Kubernetes: Step-by-Step Deployment Tutorial",
      "description": "Deploy SPIRE Server and Agent on Kubernetes, register workloads, and secure pod-to-pod communication with mTLS. Complete hands-on tutorial with manifests.",
      "ctaModule": 5,
      "content": "\n          <h1>SPIRE on Kubernetes: Step-by-Step Deployment Tutorial</h1>\n\n          <p>This tutorial walks through deploying SPIRE on a Kubernetes cluster, registering workloads, and verifying that pods receive cryptographic identities. By the end, your pods will have automatically-issued, short-lived X.509 certificates for mutual TLS.</p>\n\n          <h2>Prerequisites</h2>\n\n          <ul>\n            <li>A Kubernetes cluster (Kind, Minikube, or cloud-managed)</li>\n            <li>kubectl configured and working</li>\n            <li>Basic understanding of Kubernetes pods, services, and service accounts</li>\n          </ul>\n\n          <h2>Architecture Overview</h2>\n\n          <p>SPIRE runs as two components on Kubernetes: the <strong>SPIRE Server</strong> (a StatefulSet with persistent storage for the datastore) and the <strong>SPIRE Agent</strong> (a DaemonSet that runs on every node). The Agent exposes the SPIFFE Workload API via a Unix domain socket that pods access through a CSI driver or hostPath volume.</p>\n\n          <h2>What You Will Deploy</h2>\n\n          <ol>\n            <li>SPIRE Server as a StatefulSet with SQLite datastore</li>\n            <li>SPIRE Agent as a DaemonSet with Kubernetes node attestor</li>\n            <li>SPIRE Controller Manager for automatic workload registration</li>\n            <li>A demo application that retrieves its SVID and establishes mTLS</li>\n          </ol>\n\n          <h2>Full Tutorial in Our Free Course</h2>\n\n          <p>Module 5 of the Mastering SPIFFE &amp; SPIRE course provides the complete hands-on tutorial with Kubernetes manifests, verification commands, and troubleshooting guides. The companion GitHub repository contains all manifests ready to apply.</p>\n        "
    },
    {
      "slug": "spiffe-mtls-service-mesh",
      "title": "SPIFFE, mTLS, and Service Mesh: How They Work Together",
      "description": "SPIFFE provides identity, mTLS provides encryption, service meshes provide the infrastructure. Learn how these three layers create end-to-end zero trust in production.",
      "ctaModule": 8,
      "content": "\n          <h1>SPIFFE, mTLS, and Service Mesh: How They Work Together</h1>\n\n          <p>Zero trust security requires three layers working together: <strong>identity</strong> (who is this service?), <strong>encryption</strong> (is the communication secure?), and <strong>authorization</strong> (is this service allowed to do this?). SPIFFE, mTLS, and service meshes each handle one of these layers.</p>\n\n          <h2>The Three Layers</h2>\n\n          <ul>\n            <li><strong>SPIFFE (Identity):</strong> Gives every workload a cryptographic identity via X.509-SVIDs or JWT-SVIDs. This answers: \"Who is making this request?\"</li>\n            <li><strong>mTLS (Encryption):</strong> Both client and server present certificates and verify each other&rsquo;s identity. This answers: \"Is this connection secure and authenticated?\"</li>\n            <li><strong>Service Mesh (Infrastructure):</strong> Envoy/Istio/Linkerd sidecar proxies handle mTLS transparently so applications do not need TLS code. This answers: \"How do we enforce security without changing applications?\"</li>\n          </ul>\n\n          <h2>SPIRE as the Identity Provider for Service Meshes</h2>\n\n          <p>Istio has its own CA (Citadel/istiod). Linkerd has its own CA. But SPIRE can replace both as a unified identity provider across mesh and non-mesh workloads. This is critical for organizations that need consistent identity across Kubernetes services (in the mesh), legacy VMs (outside the mesh), serverless functions, and CI/CD pipelines.</p>\n\n          <h2>Learn the Full Integration</h2>\n\n          <p>Module 8 of our free course covers SPIRE integration with Envoy, Istio, and Linkerd. You will deploy a service mesh with SPIRE as the identity backend and enforce OPA policies based on SPIFFE IDs.</p>\n        "
    },
    {
      "slug": "machine-identity-management",
      "title": "Machine Identity Management: SPIFFE vs Vault vs Cloud IAM",
      "description": "Compare workload identity approaches: SPIFFE/SPIRE vs HashiCorp Vault PKI vs Kubernetes Service Accounts vs Cloud IAM roles. Understand the tradeoffs for machine identity at scale.",
      "ctaModule": 4,
      "content": "\n          <h1>Machine Identity Management: SPIFFE vs Vault vs Cloud IAM</h1>\n\n          <p>Every organization needs to identify its services. But which approach is right? This guide compares the four most common machine identity strategies and explains when each excels.</p>\n\n          <h2>SPIFFE/SPIRE</h2>\n          <p><strong>Best for:</strong> Cross-platform workload identity, multi-cloud, service mesh integration, Kubernetes-native identity.</p>\n          <ul>\n            <li>Automatic identity issuance via attestation</li>\n            <li>Short-lived certificates with zero manual rotation</li>\n            <li>Works across Kubernetes, VMs, bare metal, and cloud providers</li>\n            <li>CNCF graduated standard - vendor-neutral</li>\n          </ul>\n\n          <h2>HashiCorp Vault PKI</h2>\n          <p><strong>Best for:</strong> Secret management combined with certificate issuance, organizations already using Vault.</p>\n          <ul>\n            <li>Strong secret storage and certificate management</li>\n            <li>Rich policy system for secret access</li>\n            <li>Requires Vault token distribution (creates its own secret management problem)</li>\n            <li>Not a workload identity system - does not attest workloads</li>\n          </ul>\n\n          <h2>Kubernetes Service Accounts</h2>\n          <p><strong>Best for:</strong> Simple single-cluster Kubernetes deployments.</p>\n          <ul>\n            <li>Built into Kubernetes - no extra infrastructure</li>\n            <li>Limited to one cluster - no federation</li>\n            <li>Not cryptographic certificates - cannot be used for mTLS</li>\n            <li>Tokens were long-lived before Kubernetes 1.24</li>\n          </ul>\n\n          <h2>Cloud IAM (AWS IAM, GCP Workload Identity)</h2>\n          <p><strong>Best for:</strong> Single-cloud deployments using cloud-native services.</p>\n          <ul>\n            <li>Deep integration with cloud provider services</li>\n            <li>No infrastructure to manage</li>\n            <li>Locked to one cloud provider - breaks in multi-cloud</li>\n            <li>Not designed for service-to-service mTLS</li>\n          </ul>\n\n          <h2>Comparison Table</h2>\n\n          <table>\n            <thead><tr><th>Feature</th><th>SPIFFE/SPIRE</th><th>Vault PKI</th><th>K8s Service Accounts</th><th>Cloud IAM</th></tr></thead>\n            <tbody>\n              <tr><td>Workload attestation</td><td>Yes</td><td>No</td><td>Limited</td><td>Cloud-specific</td></tr>\n              <tr><td>mTLS certificates</td><td>Yes (X.509-SVID)</td><td>Yes</td><td>No</td><td>No</td></tr>\n              <tr><td>Automatic rotation</td><td>Yes</td><td>Yes (with agent)</td><td>Partial (1.24+)</td><td>Yes</td></tr>\n              <tr><td>Multi-cloud</td><td>Yes</td><td>Yes</td><td>No</td><td>No</td></tr>\n              <tr><td>Federation</td><td>Yes (native)</td><td>Manual</td><td>No</td><td>Cross-account only</td></tr>\n              <tr><td>VM + Kubernetes</td><td>Yes</td><td>Yes</td><td>No</td><td>Partial</td></tr>\n              <tr><td>Open standard</td><td>CNCF (SPIFFE)</td><td>Proprietary</td><td>K8s-native</td><td>Proprietary</td></tr>\n            </tbody>\n          </table>\n\n          <h2>The Right Choice Depends on Your Needs</h2>\n\n          <p>Use <strong>SPIFFE/SPIRE</strong> when you need cross-platform, multi-cloud, or multi-cluster workload identity. Use <strong>Vault</strong> when secret management is the primary concern. Use <strong>K8s Service Accounts</strong> for simple single-cluster deployments. Use <strong>Cloud IAM</strong> for cloud-native services within a single provider.</p>\n\n          <p>For most organizations adopting zero trust, SPIFFE/SPIRE provides the most comprehensive and portable solution. Our free course teaches it from the ground up.</p>\n        "
    }
  ],
  "faqs": [
    {
      "question": "What is SPIFFE?",
      "answer": "SPIFFE (Secure Production Identity Framework For Everyone) is a CNCF standard that defines how workloads identify themselves to each other using cryptographic certificates, independent of network location."
    },
    {
      "question": "What is SPIRE?",
      "answer": "SPIRE (SPIFFE Runtime Environment) is the production implementation of SPIFFE. It automatically issues, rotates, and manages cryptographic identities for every workload in your infrastructure."
    },
    {
      "question": "Is this course really free?",
      "answer": "Yes, 100% free. 13 modules, 30+ hands-on labs, all course content, and the companion GitHub repository are completely free with no paywalls or upsells."
    },
    {
      "question": "Who is this course for?",
      "answer": "Platform engineers, DevOps engineers, security engineers, SREs, Kubernetes engineers, and backend developers who want to learn production-grade workload identity and Zero Trust security."
    },
    {
      "question": "Do I need prior SPIFFE experience?",
      "answer": "No. The course starts from Zero Trust fundamentals and builds up to production SPIRE deployments, federation, and AI infrastructure security."
    },
    {
      "question": "What is workload identity?",
      "answer": "Workload identity gives every service, container, or process a unique cryptographic identity - like a passport for machines. It replaces shared secrets, API keys, and IP-based trust with automatic, short-lived certificates."
    },
    {
      "question": "How does SPIFFE compare to HashiCorp Vault?",
      "answer": "SPIFFE provides workload identity (who is this service?). Vault provides secret management (what secrets can it access?). They are complementary - workloads can authenticate to Vault using their SPIFFE SVID instead of static Vault tokens."
    },
    {
      "question": "What is Zero Trust?",
      "answer": "Zero Trust is a security architecture that requires cryptographic verification of every request, regardless of network location. It replaces the traditional perimeter model where everything inside the network is trusted."
    }
  ],
  "modules": [
    {
      "number": 1,
      "title": "Understanding Zero Trust Security",
      "slug": "understanding-zero-trust-security",
      "subtitle": "Why perimeter security fails and how identity-based security changes everything",
      "duration": "3 hours",
      "objectives": [
        "Understand why traditional perimeter security fails in cloud-native systems",
        "Learn the core principles of Zero Trust architecture",
        "Differentiate between human identity and workload identity",
        "Understand service-to-service authentication challenges"
      ],
      "labs": [
        {
          "title": "Exploring Traditional vs Zero Trust Architectures"
        },
        {
          "title": "Inspecting Service Communication Flows"
        }
      ]
    },
    {
      "number": 2,
      "title": "Cryptography and PKI Foundations",
      "slug": "cryptography-pki-foundations",
      "subtitle": "The cryptographic building blocks that make SPIFFE possible",
      "duration": "3.5 hours",
      "objectives": [
        "Understand symmetric vs asymmetric encryption",
        "Learn how PKI and certificate authorities work",
        "Master X.509 certificates and certificate chains",
        "Implement mutual TLS between services"
      ],
      "labs": [
        {
          "title": "Creating a Root Certificate Authority"
        },
        {
          "title": "Generating and Signing Certificates"
        },
        {
          "title": "Establishing mTLS Between Services"
        }
      ]
    },
    {
      "number": 3,
      "title": "SPIFFE Fundamentals",
      "slug": "spiffe-fundamentals",
      "subtitle": "The specification that defines how workload identity works",
      "duration": "3 hours",
      "objectives": [
        "Understand the SPIFFE specification and its components",
        "Learn SPIFFE ID format and trust domains",
        "Master X.509-SVIDs and JWT-SVIDs",
        "Use the SPIFFE Workload API"
      ],
      "labs": [
        {
          "title": "Exploring SPIFFE IDs"
        },
        {
          "title": "Working with SVID Formats"
        }
      ]
    },
    {
      "number": 4,
      "title": "SPIRE Architecture and Components",
      "slug": "spire-architecture-components",
      "subtitle": "How SPIRE implements the SPIFFE specification in production",
      "duration": "3.5 hours",
      "objectives": [
        "Understand SPIRE Server and Agent architecture",
        "Learn node attestation and workload attestation",
        "Configure registration entries",
        "Master the SPIRE plugin framework"
      ],
      "labs": [
        {
          "title": "Installing SPIRE from Binaries"
        },
        {
          "title": "Configuring Registration Entries"
        },
        {
          "title": "Attesting Nodes and Workloads"
        }
      ]
    },
    {
      "number": 5,
      "title": "Running SPIRE on Kubernetes",
      "slug": "running-spire-on-kubernetes",
      "subtitle": "Deploy and operate SPIRE in real Kubernetes clusters",
      "duration": "4 hours",
      "objectives": [
        "Deploy SPIRE Server and Agent on Kubernetes",
        "Configure Kubernetes workload and node attestors",
        "Use SPIRE Controller Manager for automatic registration",
        "Retrieve SVIDs inside pods"
      ],
      "labs": [
        {
          "title": "Deploying SPIRE on Kind"
        },
        {
          "title": "Registering Kubernetes Workloads"
        },
        {
          "title": "Automatic Identity Rotation"
        },
        {
          "title": "Debugging Failed Attestation"
        }
      ]
    },
    {
      "number": 6,
      "title": "Working with SVIDs and the Workload API",
      "slug": "working-with-svids-workload-api",
      "subtitle": "How applications consume and use SPIFFE identities",
      "duration": "3 hours",
      "objectives": [
        "Use the SPIFFE Workload API programmatically",
        "Integrate SPIFFE into Go, Python, and Java applications",
        "Build mTLS connections between microservices",
        "Implement automatic certificate rotation in applications"
      ],
      "labs": [
        {
          "title": "Getting SVIDs with SPIFFE Helper"
        },
        {
          "title": "Building mTLS Between Microservices"
        },
        {
          "title": "Secure gRPC Communication"
        }
      ]
    },
    {
      "number": 7,
      "title": "Authorization and Policy Enforcement",
      "slug": "authorization-policy-enforcement",
      "subtitle": "Identity answers who - policy answers what they can do",
      "duration": "3 hours",
      "objectives": [
        "Understand authentication vs authorization in zero trust",
        "Write Rego policies with Open Policy Agent (OPA)",
        "Implement identity-aware authorization with SPIFFE IDs",
        "Integrate OPA with Envoy for runtime policy enforcement"
      ],
      "labs": [
        {
          "title": "Writing Basic Rego Policies"
        },
        {
          "title": "Integrating OPA with Envoy"
        }
      ]
    },
    {
      "number": 8,
      "title": "SPIRE Integrations and Service Mesh",
      "slug": "spire-integrations-service-mesh",
      "subtitle": "Connect SPIRE with Envoy, Istio, and the cloud-native ecosystem",
      "duration": "3.5 hours",
      "objectives": [
        "Integrate SPIRE with Envoy as the identity provider",
        "Use SPIRE with Istio and Linkerd service meshes",
        "Configure OIDC discovery for JWT authentication",
        "Design SPIFFE ID naming schemas for production"
      ],
      "labs": [
        {
          "title": "SPIRE with Envoy mTLS"
        },
        {
          "title": "SPIRE + OPA Authorization"
        },
        {
          "title": "OIDC Discovery with SPIRE"
        }
      ]
    },
    {
      "number": 9,
      "title": "Advanced SPIRE Architectures",
      "slug": "advanced-spire-architectures",
      "subtitle": "Production-grade deployments: HA, federation, and multi-cluster",
      "duration": "3.5 hours",
      "objectives": [
        "Design high-availability SPIRE deployments",
        "Configure nested SPIRE for hierarchical trust",
        "Implement SPIFFE federation across trust domains",
        "Plan multi-cluster and multi-cloud architectures"
      ],
      "labs": [
        {
          "title": "Deploying SPIRE in HA Mode"
        },
        {
          "title": "Configuring SPIFFE Federation"
        }
      ]
    },
    {
      "number": 10,
      "title": "Day Two Operations and Observability",
      "slug": "day-two-operations-observability",
      "subtitle": "Monitor, troubleshoot, and maintain SPIRE in production",
      "duration": "3 hours",
      "objectives": [
        "Monitor SPIRE with Prometheus metrics",
        "Debug common attestation and rotation failures",
        "Plan certificate rotation and upgrade strategies",
        "Implement operational runbooks for SPIRE"
      ],
      "labs": [
        {
          "title": "Monitoring SPIRE Metrics"
        },
        {
          "title": "Debugging Registration Failures"
        }
      ]
    },
    {
      "number": 11,
      "title": "The SPIFFE/SPIRE Ecosystem",
      "slug": "spiffe-spire-ecosystem",
      "subtitle": "Real-world integrations: Vault, Cilium, CI/CD, and enterprise patterns",
      "duration": "3 hours",
      "objectives": [
        "Integrate SPIRE with HashiCorp Vault for secret management",
        "Connect SPIRE with Cilium for network identity",
        "Use SPIFFE identity in CI/CD pipelines",
        "Understand enterprise adoption patterns and case studies"
      ],
      "labs": [
        {
          "title": "Vault Authentication with SPIFFE"
        },
        {
          "title": "CI/CD Workload Identity"
        }
      ]
    },
    {
      "number": 12,
      "title": "Building a Complete Zero Trust Platform",
      "slug": "building-zero-trust-platform",
      "subtitle": "Capstone project: assemble everything into a production architecture",
      "duration": "4 hours",
      "objectives": [
        "Design an end-to-end zero trust platform architecture",
        "Deploy SPIRE with Envoy mTLS and OPA authorization",
        "Implement federation across two clusters",
        "Create a reference architecture for your organization"
      ],
      "labs": [
        {
          "title": "Capstone: Build a Zero Trust Kubernetes Platform"
        }
      ]
    },
    {
      "number": 13,
      "title": "SPIFFE for AI Infrastructure",
      "slug": "spiffe-for-ai-infrastructure",
      "subtitle": "Bonus: securing AI agents, LLM pipelines, and vector databases",
      "duration": "2 hours",
      "objectives": [
        "Understand identity challenges in AI infrastructure",
        "Secure AI agent-to-service communication with SPIFFE",
        "Implement workload identity for ML pipelines",
        "Protect vector databases and model endpoints with mTLS"
      ],
      "labs": [
        {
          "title": "Securing AI Agent Communication"
        }
      ]
    }
  ]
};
