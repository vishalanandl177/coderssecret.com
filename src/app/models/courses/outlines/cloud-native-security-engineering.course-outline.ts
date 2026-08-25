import type { CourseOutline } from '../../course-outline';

export const CLOUD_NATIVE_SECURITY_ENGINEERING_OUTLINE: CourseOutline = {
  "id": "cloud-native-security",
  "title": "Cloud Native Security Engineering: Securing Kubernetes, Workloads, APIs & Zero Trust Systems",
  "slug": "cloud-native-security-engineering",
  "subtitle": "From passwords and perimeter trust to workload identity, Zero Trust, runtime protection, and production cloud-native security architecture",
  "excerpt": "Secure Kubernetes from attack to defense. Learn workload identity (SPIFFE/SPIRE), Zero Trust (mTLS), policy-as-code (OPA/Kyverno), runtime protection (Falco/eBPF), and supply chain security (Sigstore/SLSA). 16 modules, 32 labs, completely free.",
  "description": "A beginner-to-advanced cloud-native security course that replaces secret sprawl and perimeter trust with workload identity, Zero Trust architecture, policy-as-code, runtime protection, and supply chain security. Includes 16 modules and 32 hands-on labs covering Kubernetes, SPIFFE/SPIRE, OPA, Falco, Sigstore, Vault, Envoy, Istio, eBPF, and AI infrastructure security.",
  "totalDuration": "50+ hours",
  "level": "Beginner to Advanced",
  "category": "devops",
  "tags": [
    "Cloud Native Security",
    "Kubernetes Security",
    "Zero Trust",
    "Workload Identity",
    "SPIFFE",
    "SPIRE",
    "OPA",
    "Falco",
    "eBPF",
    "Sigstore",
    "Supply Chain Security",
    "Service Mesh",
    "Istio",
    "Envoy",
    "Vault",
    "Runtime Security",
    "Policy-as-Code",
    "Platform Security",
    "Machine Identity",
    "AI Infrastructure Security",
    "CNCF",
    "mTLS",
    "Container Security",
    "CI/CD Security"
  ],
  "targetAudience": [
    "Backend Engineers building cloud-native applications",
    "DevOps Engineers securing Kubernetes infrastructure",
    "Platform Engineers building internal developer platforms",
    "SREs responsible for production security posture",
    "Security Engineers entering cloud-native systems",
    "Kubernetes Beginners who want security-first foundations",
    "Cloud Architects designing multi-cloud security"
  ],
  "instructor": {
    "name": "Vishal Anand",
    "title": "Senior Product Engineer & Tech Lead",
    "bio": "Creator and maintainer of DRF API Logger, an Apache-2.0 package listed in Django REST Framework's third-party packages documentation. Educator at CodersSecret and author of the Mastering SPIFFE & SPIRE course. Builds production infrastructure security systems and teaches practical engineering - no theory without code, no concepts without labs.",
    "github": "https://github.com/vishalanandl177",
    "achievements": [
      "Maintainer of DRF API Logger - request logging, profiling, masking, and admin analytics",
      "Author of Mastering SPIFFE & SPIRE - comprehensive free workload identity course",
      "Educator at CodersSecret - 80+ production-grade engineering tutorials",
      "Production experience securing Kubernetes platforms at scale"
    ]
  },
  "seoPages": [
    {
      "slug": "cloud-native-security-explained",
      "title": "Cloud Native Security Explained: A Complete Guide",
      "description": "Understand why traditional security fails in cloud-native systems and how workload identity, Zero Trust, runtime protection, and policy-as-code create production-grade security.",
      "ctaModule": 1,
      "content": "\n          <h1>Cloud Native Security Explained: A Complete Guide</h1>\n          <p>Cloud-native systems - containers, Kubernetes, service meshes, serverless - break every assumption of traditional security. Perimeters dissolve. IPs change constantly. Workloads are ephemeral. Secrets sprawl across environment variables, config maps, and CI/CD pipelines.</p>\n          <p><strong>Cloud native security</strong> replaces perimeter trust with identity-based trust, static firewall rules with policy-as-code, manual certificate management with automatic workload identity, and reactive monitoring with runtime threat detection.</p>\n          <h2>The Five Pillars of Cloud Native Security</h2>\n          <ul>\n            <li><strong>Workload Identity:</strong> Every service gets a cryptographic identity (SPIFFE/SPIRE)</li>\n            <li><strong>Zero Trust Networking:</strong> No implicit trust - verify every request (mTLS, network policies)</li>\n            <li><strong>Policy-as-Code:</strong> Security rules are versioned, tested, and deployed like application code (OPA, Kyverno)</li>\n            <li><strong>Runtime Protection:</strong> Detect and prevent threats in real-time (Falco, Tetragon, eBPF)</li>\n            <li><strong>Supply Chain Security:</strong> Verify every artifact from source to deployment (Sigstore, SLSA, SBOM)</li>\n          </ul>\n          <h2>Learn Cloud Native Security - Free</h2>\n          <p>Our free <a href=\"/courses/cloud-native-security-engineering\">Cloud Native Security Engineering</a> course takes you from beginner to production-ready across all five pillars. 16 modules, 32 hands-on labs, zero paywalls.</p>\n        "
    },
    {
      "slug": "kubernetes-runtime-security",
      "title": "Kubernetes Runtime Security: Falco, Tetragon, and eBPF",
      "description": "Detect container escapes, unauthorized syscalls, and runtime threats in Kubernetes using Falco, Tetragon, and eBPF-based enforcement.",
      "ctaModule": 10,
      "content": "\n          <h1>Kubernetes Runtime Security: Falco, Tetragon, and eBPF</h1>\n          <p>Identity and network policies prevent unauthorized access. But what about threats that happen <em>inside</em> an authorized workload? A compromised container attempting privilege escalation, an attacker running a cryptominer, or malware modifying system files - these are <strong>runtime threats</strong>.</p>\n          <h2>Runtime Security Tools</h2>\n          <ul>\n            <li><strong>Falco:</strong> CNCF graduated project that detects abnormal behavior by monitoring Linux syscalls. Detects: shell spawned in container, sensitive file read, unexpected network connections.</li>\n            <li><strong>Tetragon:</strong> Cilium-based runtime enforcement using eBPF. Goes beyond detection - can block malicious actions in real-time at the kernel level.</li>\n            <li><strong>eBPF:</strong> The underlying technology that makes modern runtime security possible. Runs sandboxed programs in the Linux kernel without kernel modules.</li>\n          </ul>\n          <h2>Learn Runtime Security - Free</h2>\n          <p>Module 10 of our free <a href=\"/courses/cloud-native-security-engineering\">Cloud Native Security Engineering</a> course covers Falco, Tetragon, and eBPF with hands-on detection and response labs.</p>\n        "
    },
    {
      "slug": "kubernetes-supply-chain-security",
      "title": "Kubernetes Supply Chain Security: Sigstore, SLSA, and SBOM",
      "description": "Secure your software supply chain from source to deployment. Learn image signing with Cosign, provenance with SLSA, and vulnerability tracking with SBOMs.",
      "ctaModule": 11,
      "content": "\n          <h1>Kubernetes Supply Chain Security: Sigstore, SLSA, and SBOM</h1>\n          <p>You build secure code. You deploy it to a hardened cluster. But where did the container image come from? Was it tampered with? Does it contain known vulnerabilities? Supply chain attacks target the <strong>build and distribution pipeline</strong> - the path between source code and running container.</p>\n          <h2>The Supply Chain Security Stack</h2>\n          <ul>\n            <li><strong>Sigstore (Cosign):</strong> Sign container images and verify signatures before deployment. Keyless signing via OIDC.</li>\n            <li><strong>SLSA (Supply-chain Levels for Software Artifacts):</strong> Framework for build provenance - proving WHERE and HOW an artifact was built.</li>\n            <li><strong>SBOM (Software Bill of Materials):</strong> Complete inventory of components in your container image for vulnerability tracking.</li>\n          </ul>\n          <h2>Learn Supply Chain Security - Free</h2>\n          <p>Module 11 of our <a href=\"/courses/cloud-native-security-engineering\">Cloud Native Security Engineering</a> course covers the complete supply chain security pipeline with hands-on labs.</p>\n        "
    },
    {
      "slug": "secure-service-to-service-communication",
      "title": "Secure Service-to-Service Communication in Kubernetes",
      "description": "Implement mTLS, workload identity, and authorization policies for secure east-west traffic between Kubernetes services.",
      "ctaModule": 5,
      "content": "\n          <h1>Secure Service-to-Service Communication in Kubernetes</h1>\n          <p>By default, Kubernetes services communicate in plaintext. Any pod on the network can intercept traffic between services. NetworkPolicies restrict <em>which</em> pods can communicate, but they do not encrypt traffic or verify identity.</p>\n          <h2>The Three Layers of Secure Communication</h2>\n          <ul>\n            <li><strong>Identity (SPIFFE/SPIRE):</strong> Every service gets a cryptographic certificate proving who it is</li>\n            <li><strong>Encryption (mTLS):</strong> All traffic is encrypted and both sides verify each other</li>\n            <li><strong>Authorization (OPA):</strong> Policies control which services can access which endpoints</li>\n          </ul>\n          <h2>Learn This - Free</h2>\n          <p>Our <a href=\"/courses/cloud-native-security-engineering\">Cloud Native Security Engineering</a> course covers secure communication across Modules 5-8 with full lab environments.</p>\n        "
    }
  ],
  "faqs": [
    {
      "question": "What is cloud native security?",
      "answer": "Cloud native security is a comprehensive approach to securing containerized, orchestrated, and microservice-based systems. It covers workload identity, Zero Trust networking, policy-as-code, runtime threat detection, and supply chain security."
    },
    {
      "question": "Is this course beginner-friendly?",
      "answer": "Yes. The course starts with security fundamentals and Kubernetes basics, then progressively builds to advanced topics like SPIFFE federation, eBPF runtime security, and AI infrastructure protection."
    },
    {
      "question": "Is this course free?",
      "answer": "Yes, 100% free. All 16 modules, 32 hands-on labs, companion GitHub repositories, and course content are completely free."
    },
    {
      "question": "What tools does this course cover?",
      "answer": "Kubernetes, SPIFFE/SPIRE, OPA, Kyverno, Gatekeeper, Falco, Tetragon, eBPF, Sigstore, Cosign, SLSA, HashiCorp Vault, Istio, Envoy, OpenTelemetry, and GitHub Actions security."
    },
    {
      "question": "What is the difference between this course and the SPIFFE & SPIRE course?",
      "answer": "The SPIFFE & SPIRE course goes deep on workload identity specifically. This Cloud Native Security Engineering course covers the full security stack - identity is one of five pillars alongside Zero Trust, policy, runtime protection, and supply chain security."
    },
    {
      "question": "What is OPA vs Kyverno?",
      "answer": "OPA (Open Policy Agent) uses the Rego language for powerful policy expressions. Kyverno uses Kubernetes-native YAML for easier adoption. Both enforce security policies via admission control. The course covers both so you can choose."
    },
    {
      "question": "What is runtime security?",
      "answer": "Runtime security detects and prevents threats inside running containers - shell execution, privilege escalation, sensitive file access, cryptomining. Tools like Falco (detection) and Tetragon (enforcement) use eBPF to monitor at the kernel level."
    },
    {
      "question": "What is supply chain security?",
      "answer": "Supply chain security ensures that every artifact from source code to running container is verified and untampered. It includes image signing (Cosign), build provenance (SLSA), and vulnerability tracking (SBOM)."
    }
  ],
  "modules": [
    {
      "number": 1,
      "title": "Introduction to Cloud Native Security",
      "slug": "introduction-cloud-native-security",
      "subtitle": "Why traditional security fails in cloud-native systems and how to think about modern infrastructure protection",
      "duration": "3 hours",
      "objectives": [
        "Understand the evolution from monoliths to cloud-native platforms",
        "Learn why perimeter security fails with ephemeral workloads",
        "Map the cloud-native threat landscape",
        "Build a security-first engineering mindset"
      ],
      "labs": [
        {
          "title": "Exploring the Kubernetes Attack Surface"
        },
        {
          "title": "Analyzing Insecure Deployment Examples"
        }
      ]
    },
    {
      "number": 2,
      "title": "Kubernetes Foundations for Security",
      "slug": "kubernetes-foundations-security",
      "subtitle": "Understanding Kubernetes architecture, RBAC, and the API attack surface from a security perspective",
      "duration": "3.5 hours",
      "objectives": [
        "Understand Kubernetes architecture through a security lens",
        "Master RBAC design and common misconfigurations",
        "Map the Kubernetes API attack surface",
        "Debug authentication and authorization failures"
      ],
      "labs": [
        {
          "title": "Explore Kubernetes Security Components"
        },
        {
          "title": "Create Least-Privilege RBAC Policies"
        },
        {
          "title": "Exploit Insecure RBAC Configuration"
        }
      ]
    },
    {
      "number": 3,
      "title": "Containers & Workload Security",
      "slug": "containers-workload-security",
      "subtitle": "Hardening containers from image build to runtime with Pod Security Standards, seccomp, and distroless images",
      "duration": "3 hours",
      "objectives": [
        "Understand Linux container isolation primitives (namespaces, cgroups)",
        "Build secure container images with distroless and rootless patterns",
        "Configure Pod Security Standards for cluster-wide enforcement",
        "Implement seccomp and capabilities restrictions"
      ],
      "labs": [
        {
          "title": "Harden an Insecure Container"
        },
        {
          "title": "Configure Pod Security Standards"
        },
        {
          "title": "Container Escape Demonstration"
        }
      ]
    },
    {
      "number": 4,
      "title": "Kubernetes Authentication & Authorization",
      "slug": "kubernetes-authentication-authorization",
      "subtitle": "Service accounts, OIDC, RBAC deep dive, and identity in distributed systems",
      "duration": "3 hours",
      "objectives": [
        "Configure Kubernetes authentication methods",
        "Design least-privilege RBAC policies",
        "Integrate OIDC for human authentication",
        "Debug authentication and authorization failures"
      ],
      "labs": [
        {
          "title": "Configure OIDC Authentication"
        },
        {
          "title": "Debug Authorization Failures"
        }
      ]
    },
    {
      "number": 5,
      "title": "Zero Trust Security Fundamentals",
      "slug": "zero-trust-security-fundamentals",
      "subtitle": "Identity-based security, mTLS, trust domains, and microsegmentation for cloud-native systems",
      "duration": "3 hours",
      "objectives": [
        "Understand Zero Trust principles for cloud-native systems",
        "Implement mutual TLS between services",
        "Design trust domains and microsegmentation",
        "Plan east-west security for Kubernetes clusters"
      ],
      "labs": [
        {
          "title": "Implement mTLS Between Services"
        },
        {
          "title": "Simulate Zero Trust Networking"
        }
      ]
    },
    {
      "number": 6,
      "title": "SPIFFE & SPIRE Deep Dive",
      "slug": "spiffe-spire-deep-dive",
      "subtitle": "Production workload identity with the CNCF standard - from concepts to Kubernetes deployment",
      "duration": "4 hours",
      "objectives": [
        "Understand SPIFFE specification and SPIRE architecture",
        "Deploy SPIRE on Kubernetes with auto-registration",
        "Configure workload attestation and SVID issuance",
        "Implement SPIFFE federation across trust domains"
      ],
      "labs": [
        {
          "title": "Deploy SPIRE on Kubernetes"
        },
        {
          "title": "Configure SPIFFE Federation"
        }
      ]
    },
    {
      "number": 7,
      "title": "Service Mesh Security",
      "slug": "service-mesh-security",
      "subtitle": "Envoy, Istio, and Linkerd - transparent mTLS, identity propagation, and authorization policies",
      "duration": "3.5 hours",
      "objectives": [
        "Understand service mesh architecture and security capabilities",
        "Deploy Istio with mTLS enforcement",
        "Configure identity-aware authorization policies",
        "Integrate SPIRE as the mesh identity provider"
      ],
      "labs": [
        {
          "title": "Deploy Istio with Strict mTLS"
        },
        {
          "title": "Configure Identity-Based Authorization"
        }
      ]
    },
    {
      "number": 8,
      "title": "Policy-as-Code Security",
      "slug": "policy-as-code-security",
      "subtitle": "OPA, Kyverno, Gatekeeper, and admission controllers for automated security enforcement",
      "duration": "3.5 hours",
      "objectives": [
        "Write OPA Rego policies for Kubernetes security",
        "Deploy Kyverno for declarative policy enforcement",
        "Configure Gatekeeper admission controller",
        "Automate compliance checks in CI/CD"
      ],
      "labs": [
        {
          "title": "Block Insecure Deployments with OPA Gatekeeper"
        },
        {
          "title": "Enforce Security with Kyverno"
        }
      ]
    },
    {
      "number": 9,
      "title": "Secrets Management & Machine Identity",
      "slug": "secrets-management-machine-identity",
      "subtitle": "Vault, dynamic secrets, certificate rotation, and replacing secret sprawl with workload identity",
      "duration": "3.5 hours",
      "objectives": [
        "Integrate HashiCorp Vault with Kubernetes",
        "Implement dynamic secrets and automatic rotation",
        "Replace static credentials with workload identity",
        "Design a secrets management strategy for production"
      ],
      "labs": [
        {
          "title": "Integrate Vault with Kubernetes"
        },
        {
          "title": "Dynamic Secret Rotation"
        }
      ]
    },
    {
      "number": 10,
      "title": "Runtime Security & Threat Detection",
      "slug": "runtime-security-threat-detection",
      "subtitle": "Falco, Tetragon, eBPF - detecting container escapes, unauthorized access, and runtime threats",
      "duration": "3.5 hours",
      "objectives": [
        "Understand runtime threat categories in Kubernetes",
        "Deploy Falco for syscall-based threat detection",
        "Use Tetragon for eBPF-based enforcement",
        "Build incident response procedures for runtime events"
      ],
      "labs": [
        {
          "title": "Detect Container Escape Attempts with Falco"
        },
        {
          "title": "Runtime Enforcement with Tetragon"
        }
      ]
    },
    {
      "number": 11,
      "title": "Cloud Native Supply Chain Security",
      "slug": "supply-chain-security",
      "subtitle": "Sigstore, SLSA, SBOM, image signing, and provenance verification",
      "duration": "3 hours",
      "objectives": [
        "Understand supply chain attack vectors",
        "Sign container images with Cosign",
        "Verify image provenance with SLSA",
        "Generate and analyze SBOMs for vulnerability tracking"
      ],
      "labs": [
        {
          "title": "Sign and Verify Container Images"
        },
        {
          "title": "Generate and Analyze SBOMs"
        }
      ]
    },
    {
      "number": 12,
      "title": "Secure CI/CD Pipelines",
      "slug": "secure-cicd-pipelines",
      "subtitle": "Harden GitHub Actions, protect secrets, isolate pipelines, and implement secure deployment workflows",
      "duration": "3 hours",
      "objectives": [
        "Identify CI/CD threat vectors",
        "Harden GitHub Actions workflows",
        "Implement pipeline isolation and secret scanning",
        "Deploy securely with signed artifacts and workload identity"
      ],
      "labs": [
        {
          "title": "Harden a GitHub Actions Workflow"
        },
        {
          "title": "Implement Secure Deployment Pipeline"
        }
      ]
    },
    {
      "number": 13,
      "title": "Observability & Security Monitoring",
      "slug": "observability-security-monitoring",
      "subtitle": "OpenTelemetry, audit logging, distributed tracing, and security telemetry",
      "duration": "3 hours",
      "objectives": [
        "Build security-focused observability with OpenTelemetry",
        "Configure Kubernetes audit logging",
        "Correlate security events across services",
        "Design dashboards for security posture monitoring"
      ],
      "labs": [
        {
          "title": "Build Security Dashboards"
        },
        {
          "title": "Kubernetes Audit Log Analysis"
        }
      ]
    },
    {
      "number": 14,
      "title": "Multi-Cluster & Multi-Cloud Security",
      "slug": "multi-cluster-multi-cloud-security",
      "subtitle": "Federation, cross-cloud identity, hybrid infrastructure, and trust boundaries at scale",
      "duration": "3 hours",
      "objectives": [
        "Design trust boundaries for multi-cluster deployments",
        "Implement SPIFFE federation across clusters and clouds",
        "Secure hybrid infrastructure (Kubernetes + VMs)",
        "Plan cross-cloud identity portability"
      ],
      "labs": [
        {
          "title": "Federated Trust Across Two Clusters"
        }
      ]
    },
    {
      "number": 15,
      "title": "AI Infrastructure Security",
      "slug": "ai-infrastructure-security",
      "subtitle": "Securing AI agents, LLM endpoints, MCP servers, vector databases, and inference pipelines",
      "duration": "3 hours",
      "objectives": [
        "Understand AI infrastructure threat landscape",
        "Implement workload identity for AI agents",
        "Secure MCP servers and vector databases with mTLS",
        "Design identity-aware AI access control policies"
      ],
      "labs": [
        {
          "title": "Secure AI Agent Communication"
        },
        {
          "title": "Identity-Aware AI API Access"
        }
      ]
    },
    {
      "number": 16,
      "title": "Production Architecture & Capstone",
      "slug": "production-architecture-capstone",
      "subtitle": "Build a production-grade cloud-native security platform combining all five pillars",
      "duration": "5 hours",
      "objectives": [
        "Design an end-to-end production security architecture",
        "Deploy the complete cloud-native security stack",
        "Implement all five pillars: identity, zero trust, policy, runtime, supply chain",
        "Test with attack simulations and verify containment"
      ],
      "labs": [
        {
          "title": "Capstone: Production Cloud Native Security Platform"
        }
      ]
    }
  ]
};
