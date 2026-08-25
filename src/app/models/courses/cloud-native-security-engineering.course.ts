import type { Course } from '../course.model';

export const CLOUD_NATIVE_SECURITY_ENGINEERING_COURSE: Course = {
    id: 'cloud-native-security',
    title: 'Cloud Native Security Engineering: Securing Kubernetes, Workloads, APIs & Zero Trust Systems',
    slug: 'cloud-native-security-engineering',
    subtitle: 'From passwords and perimeter trust to workload identity, Zero Trust, runtime protection, and production cloud-native security architecture',
    excerpt: 'Secure Kubernetes from attack to defense. Learn workload identity (SPIFFE/SPIRE), Zero Trust (mTLS), policy-as-code (OPA/Kyverno), runtime protection (Falco/eBPF), and supply chain security (Sigstore/SLSA). 16 modules, 32 labs, completely free.',
    description: 'A beginner-to-advanced cloud-native security course that replaces secret sprawl and perimeter trust with workload identity, Zero Trust architecture, policy-as-code, runtime protection, and supply chain security. Includes 16 modules and 32 hands-on labs covering Kubernetes, SPIFFE/SPIRE, OPA, Falco, Sigstore, Vault, Envoy, Istio, eBPF, and AI infrastructure security.',
    totalDuration: '50+ hours',
    level: 'Beginner to Advanced',
    category: 'devops',
    tags: ['Cloud Native Security', 'Kubernetes Security', 'Zero Trust', 'Workload Identity', 'SPIFFE', 'SPIRE', 'OPA', 'Falco', 'eBPF', 'Sigstore', 'Supply Chain Security', 'Service Mesh', 'Istio', 'Envoy', 'Vault', 'Runtime Security', 'Policy-as-Code', 'Platform Security', 'Machine Identity', 'AI Infrastructure Security', 'CNCF', 'mTLS', 'Container Security', 'CI/CD Security'],
    targetAudience: [
      'Backend Engineers building cloud-native applications',
      'DevOps Engineers securing Kubernetes infrastructure',
      'Platform Engineers building internal developer platforms',
      'SREs responsible for production security posture',
      'Security Engineers entering cloud-native systems',
      'Kubernetes Beginners who want security-first foundations',
      'Cloud Architects designing multi-cloud security',
    ],
    instructor: {
      name: 'Vishal Anand',
      title: 'Senior Product Engineer & Tech Lead',
      bio: 'Creator of DRF API Logger (1.6M+ PyPI downloads), educator at CodersSecret, and author of the Mastering SPIFFE & SPIRE course. Builds production infrastructure security systems and teaches practical engineering - no theory without code, no concepts without labs.',
      github: 'https://github.com/vishalanandl177',
      achievements: [
        'Creator of DRF API Logger - 1.6M+ downloads, used across enterprise systems',
        'Author of Mastering SPIFFE & SPIRE - comprehensive free workload identity course',
        'Educator at CodersSecret - 80+ production-grade engineering tutorials',
        'Production experience securing Kubernetes platforms at scale',
      ],
    },
    seoPages: [
      {
        slug: 'cloud-native-security-explained',
        title: 'Cloud Native Security Explained: A Complete Guide',
        description: 'Understand why traditional security fails in cloud-native systems and how workload identity, Zero Trust, runtime protection, and policy-as-code create production-grade security.',
        ctaModule: 1,
        content: `
          <h1>Cloud Native Security Explained: A Complete Guide</h1>
          <p>Cloud-native systems - containers, Kubernetes, service meshes, serverless - break every assumption of traditional security. Perimeters dissolve. IPs change constantly. Workloads are ephemeral. Secrets sprawl across environment variables, config maps, and CI/CD pipelines.</p>
          <p><strong>Cloud native security</strong> replaces perimeter trust with identity-based trust, static firewall rules with policy-as-code, manual certificate management with automatic workload identity, and reactive monitoring with runtime threat detection.</p>
          <h2>The Five Pillars of Cloud Native Security</h2>
          <ul>
            <li><strong>Workload Identity:</strong> Every service gets a cryptographic identity (SPIFFE/SPIRE)</li>
            <li><strong>Zero Trust Networking:</strong> No implicit trust - verify every request (mTLS, network policies)</li>
            <li><strong>Policy-as-Code:</strong> Security rules are versioned, tested, and deployed like application code (OPA, Kyverno)</li>
            <li><strong>Runtime Protection:</strong> Detect and prevent threats in real-time (Falco, Tetragon, eBPF)</li>
            <li><strong>Supply Chain Security:</strong> Verify every artifact from source to deployment (Sigstore, SLSA, SBOM)</li>
          </ul>
          <h2>Learn Cloud Native Security - Free</h2>
          <p>Our free <a href="/courses/cloud-native-security-engineering">Cloud Native Security Engineering</a> course takes you from beginner to production-ready across all five pillars. 16 modules, 32 hands-on labs, zero paywalls.</p>
        `,
      },
      {
        slug: 'kubernetes-runtime-security',
        title: 'Kubernetes Runtime Security: Falco, Tetragon, and eBPF',
        description: 'Detect container escapes, unauthorized syscalls, and runtime threats in Kubernetes using Falco, Tetragon, and eBPF-based enforcement.',
        ctaModule: 10,
        content: `
          <h1>Kubernetes Runtime Security: Falco, Tetragon, and eBPF</h1>
          <p>Identity and network policies prevent unauthorized access. But what about threats that happen <em>inside</em> an authorized workload? A compromised container attempting privilege escalation, an attacker running a cryptominer, or malware modifying system files - these are <strong>runtime threats</strong>.</p>
          <h2>Runtime Security Tools</h2>
          <ul>
            <li><strong>Falco:</strong> CNCF graduated project that detects abnormal behavior by monitoring Linux syscalls. Detects: shell spawned in container, sensitive file read, unexpected network connections.</li>
            <li><strong>Tetragon:</strong> Cilium-based runtime enforcement using eBPF. Goes beyond detection - can block malicious actions in real-time at the kernel level.</li>
            <li><strong>eBPF:</strong> The underlying technology that makes modern runtime security possible. Runs sandboxed programs in the Linux kernel without kernel modules.</li>
          </ul>
          <h2>Learn Runtime Security - Free</h2>
          <p>Module 10 of our free <a href="/courses/cloud-native-security-engineering">Cloud Native Security Engineering</a> course covers Falco, Tetragon, and eBPF with hands-on detection and response labs.</p>
        `,
      },
      {
        slug: 'kubernetes-supply-chain-security',
        title: 'Kubernetes Supply Chain Security: Sigstore, SLSA, and SBOM',
        description: 'Secure your software supply chain from source to deployment. Learn image signing with Cosign, provenance with SLSA, and vulnerability tracking with SBOMs.',
        ctaModule: 11,
        content: `
          <h1>Kubernetes Supply Chain Security: Sigstore, SLSA, and SBOM</h1>
          <p>You build secure code. You deploy it to a hardened cluster. But where did the container image come from? Was it tampered with? Does it contain known vulnerabilities? Supply chain attacks target the <strong>build and distribution pipeline</strong> - the path between source code and running container.</p>
          <h2>The Supply Chain Security Stack</h2>
          <ul>
            <li><strong>Sigstore (Cosign):</strong> Sign container images and verify signatures before deployment. Keyless signing via OIDC.</li>
            <li><strong>SLSA (Supply-chain Levels for Software Artifacts):</strong> Framework for build provenance - proving WHERE and HOW an artifact was built.</li>
            <li><strong>SBOM (Software Bill of Materials):</strong> Complete inventory of components in your container image for vulnerability tracking.</li>
          </ul>
          <h2>Learn Supply Chain Security - Free</h2>
          <p>Module 11 of our <a href="/courses/cloud-native-security-engineering">Cloud Native Security Engineering</a> course covers the complete supply chain security pipeline with hands-on labs.</p>
        `,
      },
      {
        slug: 'secure-service-to-service-communication',
        title: 'Secure Service-to-Service Communication in Kubernetes',
        description: 'Implement mTLS, workload identity, and authorization policies for secure east-west traffic between Kubernetes services.',
        ctaModule: 5,
        content: `
          <h1>Secure Service-to-Service Communication in Kubernetes</h1>
          <p>By default, Kubernetes services communicate in plaintext. Any pod on the network can intercept traffic between services. NetworkPolicies restrict <em>which</em> pods can communicate, but they do not encrypt traffic or verify identity.</p>
          <h2>The Three Layers of Secure Communication</h2>
          <ul>
            <li><strong>Identity (SPIFFE/SPIRE):</strong> Every service gets a cryptographic certificate proving who it is</li>
            <li><strong>Encryption (mTLS):</strong> All traffic is encrypted and both sides verify each other</li>
            <li><strong>Authorization (OPA):</strong> Policies control which services can access which endpoints</li>
          </ul>
          <h2>Learn This - Free</h2>
          <p>Our <a href="/courses/cloud-native-security-engineering">Cloud Native Security Engineering</a> course covers secure communication across Modules 5-8 with full lab environments.</p>
        `,
      },
    ],
    faqs: [
      { question: 'What is cloud native security?', answer: 'Cloud native security is a comprehensive approach to securing containerized, orchestrated, and microservice-based systems. It covers workload identity, Zero Trust networking, policy-as-code, runtime threat detection, and supply chain security.' },
      { question: 'Is this course beginner-friendly?', answer: 'Yes. The course starts with security fundamentals and Kubernetes basics, then progressively builds to advanced topics like SPIFFE federation, eBPF runtime security, and AI infrastructure protection.' },
      { question: 'Is this course free?', answer: 'Yes, 100% free. All 16 modules, 32 hands-on labs, companion GitHub repositories, and course content are completely free.' },
      { question: 'What tools does this course cover?', answer: 'Kubernetes, SPIFFE/SPIRE, OPA, Kyverno, Gatekeeper, Falco, Tetragon, eBPF, Sigstore, Cosign, SLSA, HashiCorp Vault, Istio, Envoy, OpenTelemetry, and GitHub Actions security.' },
      { question: 'What is the difference between this course and the SPIFFE & SPIRE course?', answer: 'The SPIFFE & SPIRE course goes deep on workload identity specifically. This Cloud Native Security Engineering course covers the full security stack - identity is one of five pillars alongside Zero Trust, policy, runtime protection, and supply chain security.' },
      { question: 'What is OPA vs Kyverno?', answer: 'OPA (Open Policy Agent) uses the Rego language for powerful policy expressions. Kyverno uses Kubernetes-native YAML for easier adoption. Both enforce security policies via admission control. The course covers both so you can choose.' },
      { question: 'What is runtime security?', answer: 'Runtime security detects and prevents threats inside running containers - shell execution, privilege escalation, sensitive file access, cryptomining. Tools like Falco (detection) and Tetragon (enforcement) use eBPF to monitor at the kernel level.' },
      { question: 'What is supply chain security?', answer: 'Supply chain security ensures that every artifact from source code to running container is verified and untampered. It includes image signing (Cosign), build provenance (SLSA), and vulnerability tracking (SBOM).' },
    ],
    modules: [
    {
      number: 1, title: 'Introduction to Cloud Native Security', slug: 'introduction-cloud-native-security',
      subtitle: 'Why traditional security fails in cloud-native systems and how to think about modern infrastructure protection',
      duration: '3 hours',
      objectives: ['Understand the evolution from monoliths to cloud-native platforms', 'Learn why perimeter security fails with ephemeral workloads', 'Map the cloud-native threat landscape', 'Build a security-first engineering mindset'],
      svgDiagram: '<svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg"><rect width="800" height="400" fill="#0f172a" rx="12"/><text x="400" y="30" text-anchor="middle" fill="#94a3b8" font-size="14" font-weight="bold">EVOLUTION OF INFRASTRUCTURE SECURITY</text><rect x="40" y="60" width="160" height="130" rx="8" fill="#1e293b" stroke="#ef4444" stroke-width="2"/><text x="120" y="90" text-anchor="middle" fill="#fca5a5" font-size="12" font-weight="bold">Monolith Era</text><text x="120" y="115" text-anchor="middle" fill="#94a3b8" font-size="9">Firewall perimeter</text><text x="120" y="132" text-anchor="middle" fill="#94a3b8" font-size="9">Static servers</text><text x="120" y="149" text-anchor="middle" fill="#94a3b8" font-size="9">Trust = network</text><text x="120" y="166" text-anchor="middle" fill="#94a3b8" font-size="9">Long-lived secrets</text><rect x="230" y="60" width="160" height="130" rx="8" fill="#1e293b" stroke="#f97316" stroke-width="2"/><text x="310" y="90" text-anchor="middle" fill="#fdba74" font-size="12" font-weight="bold">VM Era</text><text x="310" y="115" text-anchor="middle" fill="#94a3b8" font-size="9">Network segmentation</text><text x="310" y="132" text-anchor="middle" fill="#94a3b8" font-size="9">VLANs + firewalls</text><text x="310" y="149" text-anchor="middle" fill="#94a3b8" font-size="9">IP-based trust</text><text x="310" y="166" text-anchor="middle" fill="#94a3b8" font-size="9">Manual cert rotation</text><rect x="420" y="60" width="160" height="130" rx="8" fill="#1e293b" stroke="#eab308" stroke-width="2"/><text x="500" y="90" text-anchor="middle" fill="#eab308" font-size="12" font-weight="bold">Container Era</text><text x="500" y="115" text-anchor="middle" fill="#94a3b8" font-size="9">Ephemeral workloads</text><text x="500" y="132" text-anchor="middle" fill="#94a3b8" font-size="9">Dynamic IPs</text><text x="500" y="149" text-anchor="middle" fill="#94a3b8" font-size="9">Secret sprawl</text><text x="500" y="166" text-anchor="middle" fill="#94a3b8" font-size="9">Perimeter collapse</text><rect x="610" y="60" width="160" height="130" rx="8" fill="#1e293b" stroke="#22c55e" stroke-width="2"/><text x="690" y="90" text-anchor="middle" fill="#86efac" font-size="12" font-weight="bold">Cloud Native</text><text x="690" y="115" text-anchor="middle" fill="#86efac" font-size="9">Workload identity</text><text x="690" y="132" text-anchor="middle" fill="#86efac" font-size="9">Zero Trust</text><text x="690" y="149" text-anchor="middle" fill="#86efac" font-size="9">Policy-as-code</text><text x="690" y="166" text-anchor="middle" fill="#86efac" font-size="9">Runtime protection</text><line x1="200" y1="125" x2="230" y2="125" stroke="#94a3b8" stroke-width="2" marker-end="url(#ar)"/><line x1="390" y1="125" x2="420" y2="125" stroke="#94a3b8" stroke-width="2" marker-end="url(#ar)"/><line x1="580" y1="125" x2="610" y2="125" stroke="#22c55e" stroke-width="2" marker-end="url(#ar)"/><rect x="40" y="230" width="730" height="140" rx="10" fill="#22c55e" fill-opacity="0.05" stroke="#22c55e" stroke-width="1"/><text x="400" y="260" text-anchor="middle" fill="#22c55e" font-size="13" font-weight="bold">Five Pillars of Cloud Native Security</text><text x="120" y="290" text-anchor="middle" fill="#94a3b8" font-size="10">Workload Identity</text><text x="120" y="305" text-anchor="middle" fill="#64748b" font-size="9">(SPIFFE/SPIRE)</text><text x="280" y="290" text-anchor="middle" fill="#94a3b8" font-size="10">Zero Trust</text><text x="280" y="305" text-anchor="middle" fill="#64748b" font-size="9">(mTLS, verify all)</text><text x="440" y="290" text-anchor="middle" fill="#94a3b8" font-size="10">Policy-as-Code</text><text x="440" y="305" text-anchor="middle" fill="#64748b" font-size="9">(OPA, Kyverno)</text><text x="580" y="290" text-anchor="middle" fill="#94a3b8" font-size="10">Runtime Security</text><text x="580" y="305" text-anchor="middle" fill="#64748b" font-size="9">(Falco, eBPF)</text><text x="710" y="290" text-anchor="middle" fill="#94a3b8" font-size="10">Supply Chain</text><text x="710" y="305" text-anchor="middle" fill="#64748b" font-size="9">(Sigstore, SLSA)</text><text x="400" y="350" text-anchor="middle" fill="#64748b" font-size="10">This course covers ALL five pillars from beginner to production</text><defs><marker id="ar" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill="#94a3b8"/></marker></defs></svg>',
      content: `
        <p>Cloud-native systems break every assumption of traditional security. Containers live for seconds. Pods get random IPs. Services span clusters, clouds, and regions. The network perimeter does not exist. Secrets sprawl across environment variables, ConfigMaps, and CI/CD pipelines.</p>
        <p>This module builds your security mindset from the ground up. You will understand WHY traditional security fails, WHAT the modern threat landscape looks like, and HOW cloud-native security engineering addresses it.</p>
        <h2>The Evolution of Infrastructure</h2>
        <p>Infrastructure evolved through four eras, and security had to evolve with it:</p>
        <ul>
          <li><strong>Monolith Era (1990s-2000s):</strong> One application, one server, one firewall. Security = guard the perimeter.</li>
          <li><strong>VM Era (2000s-2010s):</strong> Multiple VMs, network segmentation, VLANs. Security = segment the network.</li>
          <li><strong>Container Era (2010s-2020s):</strong> Docker, ephemeral workloads, dynamic IPs. Traditional security starts breaking.</li>
          <li><strong>Cloud Native Era (2020s+):</strong> Kubernetes, service mesh, serverless. Security = identity + policy + runtime + supply chain.</li>
        </ul>
        <h2>Why Traditional Security Fails</h2>
        <p>In a Kubernetes cluster with 500 pods across 50 services, a pod restarts and gets a new IP every few hours. Auto-scaling creates replicas with no warning. Service mesh proxies route traffic through sidecars, masking the real source. A firewall rule for 10.0.1.50 is meaningless when that IP hosted the payment service 5 minutes ago and now hosts the logging service.</p>
        <h2>The Cloud Native Threat Landscape</h2>
        <ul>
          <li><strong>Container escapes:</strong> Breaking out of container isolation to access the host</li>
          <li><strong>Kubernetes API abuse:</strong> Exploiting misconfigured RBAC to escalate privileges</li>
          <li><strong>Supply chain attacks:</strong> Compromised base images or dependencies injecting malware</li>
          <li><strong>Secret sprawl:</strong> Leaked credentials in logs, env vars, and Git history</li>
          <li><strong>East-west attacks:</strong> Lateral movement between services inside the cluster</li>
          <li><strong>Identity attacks:</strong> Impersonating services using stolen tokens or certificates</li>
        </ul>
        <h2>Core Security Principles</h2>
        <ol>
          <li><strong>Least Privilege:</strong> Every workload gets only the permissions it needs, nothing more</li>
          <li><strong>Zero Trust:</strong> Never trust, always verify - regardless of network location</li>
          <li><strong>Defense in Depth:</strong> Multiple overlapping security layers, not one wall</li>
          <li><strong>Identity-First Security:</strong> Cryptographic identity, not network properties</li>
          <li><strong>Shift Left:</strong> Security starts in the build pipeline, not after deployment</li>
        </ol>
      `,
      labs: [
        { title: 'Exploring the Kubernetes Attack Surface', objective: 'Identify security weaknesses in a default Kubernetes deployment.', repoPath: 'module-01/lab-01', steps: ['Deploy a Kind cluster with default settings', 'List all service accounts and their permissions', 'Access the Kubernetes API from inside a pod', 'Document every security gap you find'], duration: '30 min', difficulty: 'Beginner' },
        { title: 'Analyzing Insecure Deployment Examples', objective: 'Review real-world insecure Kubernetes manifests and identify vulnerabilities.', repoPath: 'module-01/lab-02', steps: ['Review 5 intentionally insecure deployment manifests', 'Identify the security issues in each', 'Write hardened versions of each manifest', 'Compare before and after with diff'], duration: '25 min', difficulty: 'Beginner' },
      ],
      keyTakeaways: ['Traditional perimeter security fails with ephemeral cloud-native workloads', 'Cloud native security requires five pillars: identity, zero trust, policy, runtime, supply chain', 'Least privilege and defense in depth are foundational principles', 'The threat landscape includes container escapes, RBAC abuse, supply chain attacks, and lateral movement', 'Security must shift left - it starts in the build pipeline, not after deployment'],
      whyThisMatters: 'Every Kubernetes cluster deployed without security awareness is a breach waiting to happen. Default Kubernetes configurations are intentionally permissive for developer convenience - not for production safety. Understanding the threat landscape and security principles BEFORE deploying is the difference between a secure platform and a headline-making incident.',
      realWorldUseCases: ['Securing production Kubernetes clusters from day one', 'Building security-first internal developer platforms', 'Preparing for SOC 2 and compliance audits', 'Defending against lateral movement in multi-tenant clusters'],
      commonMistakes: ['Assuming Kubernetes is secure by default (it is not)', 'Using the default service account for all workloads', 'Storing secrets in plain ConfigMaps or environment variables', 'Deploying containers as root without resource limits', 'Relying solely on network policies for east-west security'],
      careerRelevance: 'Cloud native security engineering is one of the fastest-growing specializations. Organizations adopting Kubernetes need engineers who understand the threat landscape and can implement defense in depth. This module gives you the foundational thinking that every subsequent module builds upon.',
      beforeAfter: { before: ['Firewall perimeter', 'Static IP-based trust', 'Manual security reviews', 'Secrets in env vars', 'Hope-based east-west security'], after: ['Identity-based trust', 'Cryptographic verification', 'Policy-as-code automation', 'Dynamic credential management', 'Runtime threat detection'] },
      glossary: [{ term: 'Cloud Native', definition: 'Architecture designed for containers, microservices, and orchestration platforms like Kubernetes' }, { term: 'Secret Sprawl', definition: 'Uncontrolled proliferation of credentials across systems, configs, and pipelines' }, { term: 'East-West Traffic', definition: 'Service-to-service communication inside a cluster (vs north-south = external)' }, { term: 'Defense in Depth', definition: 'Multiple overlapping security controls so failure of one does not compromise the system' }, { term: 'Shift Left', definition: 'Moving security earlier in the development lifecycle (build-time, not runtime)' }],
    },    {
      number: 2, title: 'Kubernetes Foundations for Security', slug: 'kubernetes-foundations-security',
      subtitle: 'Understanding Kubernetes architecture, RBAC, and the API attack surface from a security perspective',
      duration: '3.5 hours',
      objectives: ['Understand Kubernetes architecture through a security lens', 'Master RBAC design and common misconfigurations', 'Map the Kubernetes API attack surface', 'Debug authentication and authorization failures'],
      svgDiagram: '<svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg"><rect width="800" height="400" fill="#0f172a" rx="12"/><text x="400" y="28" text-anchor="middle" fill="#94a3b8" font-size="14" font-weight="bold">KUBERNETES API REQUEST FLOW (SECURITY VIEW)</text><rect x="50" y="60" width="120" height="45" rx="6" fill="#1e293b" stroke="#3b82f6" stroke-width="2"/><text x="110" y="87" text-anchor="middle" fill="#93c5fd" font-size="11" font-weight="bold">kubectl / Pod</text><rect x="220" y="50" width="150" height="65" rx="8" fill="#1e293b" stroke="#a855f7" stroke-width="2"/><text x="295" y="75" text-anchor="middle" fill="#c084fc" font-size="11" font-weight="bold">API Server</text><text x="295" y="95" text-anchor="middle" fill="#94a3b8" font-size="9">Authentication</text><text x="295" y="108" text-anchor="middle" fill="#94a3b8" font-size="9">Authorization (RBAC)</text><rect x="420" y="60" width="130" height="45" rx="6" fill="#1e293b" stroke="#f97316" stroke-width="2"/><text x="485" y="80" text-anchor="middle" fill="#fdba74" font-size="10" font-weight="bold">Admission</text><text x="485" y="95" text-anchor="middle" fill="#94a3b8" font-size="9">Mutating + Validating</text><rect x="600" y="60" width="100" height="45" rx="6" fill="#1e293b" stroke="#22c55e" stroke-width="2"/><text x="650" y="87" text-anchor="middle" fill="#86efac" font-size="11" font-weight="bold">etcd</text><line x1="170" y1="82" x2="220" y2="82" stroke="#94a3b8" stroke-width="2" marker-end="url(#a3)"/><line x1="370" y1="82" x2="420" y2="82" stroke="#94a3b8" stroke-width="2" marker-end="url(#a3)"/><line x1="550" y1="82" x2="600" y2="82" stroke="#94a3b8" stroke-width="2" marker-end="url(#a3)"/><text x="195" y="72" text-anchor="middle" fill="#64748b" font-size="8">TLS</text><text x="395" y="72" text-anchor="middle" fill="#64748b" font-size="8">RBAC OK</text><text x="575" y="72" text-anchor="middle" fill="#64748b" font-size="8">Admitted</text><rect x="50" y="160" width="650" height="210" rx="10" fill="none" stroke="#ef4444" stroke-width="1.5" stroke-dasharray="5,3"/><text x="80" y="180" fill="#ef4444" font-size="11" font-weight="bold">Common Attack Surfaces</text><rect x="70" y="195" width="180" height="55" rx="6" fill="#1e293b" stroke="#ef4444"/><text x="160" y="215" text-anchor="middle" fill="#fca5a5" font-size="10">Misconfigured RBAC</text><text x="160" y="232" text-anchor="middle" fill="#94a3b8" font-size="8">cluster-admin to default SA</text><rect x="270" y="195" width="180" height="55" rx="6" fill="#1e293b" stroke="#ef4444"/><text x="360" y="215" text-anchor="middle" fill="#fca5a5" font-size="10">Exposed API Server</text><text x="360" y="232" text-anchor="middle" fill="#94a3b8" font-size="8">Anonymous auth enabled</text><rect x="470" y="195" width="200" height="55" rx="6" fill="#1e293b" stroke="#ef4444"/><text x="570" y="215" text-anchor="middle" fill="#fca5a5" font-size="10">etcd Without Encryption</text><text x="570" y="232" text-anchor="middle" fill="#94a3b8" font-size="8">Secrets stored in plaintext</text><rect x="70" y="270" width="180" height="55" rx="6" fill="#1e293b" stroke="#ef4444"/><text x="160" y="290" text-anchor="middle" fill="#fca5a5" font-size="10">Privilege Escalation</text><text x="160" y="307" text-anchor="middle" fill="#94a3b8" font-size="8">Pod with hostPID/hostNetwork</text><rect x="270" y="270" width="180" height="55" rx="6" fill="#1e293b" stroke="#ef4444"/><text x="360" y="290" text-anchor="middle" fill="#fca5a5" font-size="10">No Admission Control</text><text x="360" y="307" text-anchor="middle" fill="#94a3b8" font-size="8">No policy enforcement</text><rect x="470" y="270" width="200" height="55" rx="6" fill="#1e293b" stroke="#ef4444"/><text x="570" y="290" text-anchor="middle" fill="#fca5a5" font-size="10">Default Service Accounts</text><text x="570" y="307" text-anchor="middle" fill="#94a3b8" font-size="8">Auto-mounted tokens everywhere</text><defs><marker id="a3" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill="#94a3b8"/></marker></defs></svg>',
      content: `
        <p>Before you can secure Kubernetes, you must understand how it works - specifically, how requests flow through the API server, how authentication and authorization decisions are made, and where the attack surface lies.</p>
        <h2>Kubernetes Architecture Through a Security Lens</h2>
        <p>Every Kubernetes interaction goes through the <strong>API Server</strong>. The API Server authenticates the request (who are you?), authorizes it via RBAC (are you allowed?), runs admission controllers (should this be modified or rejected?), and then writes to etcd (the cluster state store). Each step is a security boundary. Each step can be misconfigured.</p>
        <h2>RBAC Deep Dive</h2>
        <p>Role-Based Access Control is Kubernetes' primary authorization mechanism. It consists of Roles (what permissions exist), RoleBindings (who gets those permissions), ClusterRoles (cluster-wide permissions), and ClusterRoleBindings (cluster-wide assignments).</p>
        <pre><code># Least-privilege Role: read pods in one namespace only
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  namespace: production
  name: pod-reader
rules:
  - apiGroups: [""]
    resources: ["pods"]
    verbs: ["get", "list", "watch"]
---
# Bind to a specific service account
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  namespace: production
  name: read-pods
subjects:
  - kind: ServiceAccount
    name: monitoring-agent
    namespace: production
roleRef:
  kind: Role
  name: pod-reader
  apiGroup: rbac.authorization.k8s.io</code></pre>
        <h2>Kubernetes Admission Flow</h2>
        <p>Admission controllers run AFTER authentication and authorization but BEFORE the object is persisted. They can mutate requests (MutatingAdmissionWebhook) or reject them (ValidatingAdmissionWebhook). This is where policy engines like OPA Gatekeeper and Kyverno plug in.</p>
        <h2>The Kubernetes Attack Surface</h2>
        <ul>
          <li><strong>API Server:</strong> Exposed without auth? Anonymous access enabled? Insecure port open?</li>
          <li><strong>etcd:</strong> Unencrypted? Accessible without mTLS? Secrets stored in plaintext?</li>
          <li><strong>Kubelet:</strong> Anonymous auth enabled? Read-only port exposed?</li>
          <li><strong>Service Accounts:</strong> Default SA with auto-mounted tokens? Overly broad ClusterRoleBindings?</li>
          <li><strong>Pods:</strong> Running as root? hostPID? hostNetwork? Privileged containers?</li>
        </ul>
      `,
      labs: [
        { title: 'Explore Kubernetes Security Components', objective: 'Map the Kubernetes control plane from a security perspective.', repoPath: 'module-02/lab-01', steps: ['Deploy a Kind cluster', 'Inspect API server flags and security settings', 'List all ClusterRoleBindings and identify overly broad permissions', 'Check if etcd encryption is enabled'], duration: '25 min', difficulty: 'Beginner' },
        { title: 'Create Least-Privilege RBAC Policies', objective: 'Design and deploy RBAC roles following least-privilege principles.', repoPath: 'module-02/lab-02', steps: ['Create a namespace-scoped Role for a monitoring agent', 'Bind it to a specific ServiceAccount', 'Test that the SA can only read pods (not create/delete)', 'Attempt to escalate privileges and observe the denial'], duration: '30 min', difficulty: 'Beginner' },
        { title: 'Exploit Insecure RBAC Configuration', objective: 'Demonstrate how misconfigured RBAC leads to privilege escalation.', repoPath: 'module-02/lab-03', steps: ['Deploy a pod with an overly permissive service account', 'Use kubectl from inside the pod to list secrets', 'Escalate to cluster-admin by creating a new ClusterRoleBinding', 'Document the attack chain and fix the RBAC configuration'], duration: '35 min', difficulty: 'Intermediate' },
      ],
      keyTakeaways: ['Every K8s request flows through: AuthN -> AuthZ (RBAC) -> Admission -> etcd', 'RBAC should follow least privilege - never use cluster-admin for workloads', 'Default service accounts with auto-mounted tokens are a common attack vector', 'Admission controllers are where policy enforcement happens', 'etcd must be encrypted at rest - it stores all cluster secrets'],
      whyThisMatters: 'Kubernetes RBAC misconfigurations are consistently in the top 3 causes of Kubernetes security incidents. Understanding the API request flow and designing least-privilege RBAC is not optional - it is the foundation of every secure Kubernetes deployment.',
      commonMistakes: ['Granting cluster-admin to the default service account', 'Not disabling auto-mounting of service account tokens', 'Leaving the kubelet read-only port (10255) exposed', 'Not encrypting etcd at rest', 'Using wildcards (*) in RBAC rules for convenience'],
      productionNotes: ['Always disable auto-mounting of service account tokens: automountServiceAccountToken: false. Only mount when the pod actually needs API access.', 'Audit RBAC regularly with tools like kubectl-who-can or rbac-police. Permissions accumulate over time.', 'Enable audit logging on the API server to track who accessed what and when.'],
      glossary: [{ term: 'RBAC', definition: 'Role-Based Access Control - Kubernetes authorization mechanism' }, { term: 'ClusterRole', definition: 'Cluster-wide set of permissions (dangerous if bound broadly)' }, { term: 'Admission Controller', definition: 'Plugin that intercepts API requests after auth but before persistence' }, { term: 'etcd', definition: 'Key-value store holding all Kubernetes cluster state including secrets' }, { term: 'Service Account', definition: 'Identity assigned to pods for API server authentication' }],
      realWorldUseCases: ['Hardening RBAC for SOC 2 compliance', 'Detecting privilege escalation via overpermissioned service accounts', 'Configuring admission control for multi-tenant clusters', 'Auditing API server access for security investigations'],
      securityRisks: ['cluster-admin bound to default service account', 'etcd accessible without mTLS', 'Kubelet read-only port (10255) exposed', 'Anonymous API authentication enabled'],
      thinkLikeAnEngineer: ['How would you audit RBAC across 50 namespaces with 200 service accounts?', 'What is the minimum RBAC needed for a CI/CD pipeline to deploy safely?'],
      operationalStory: 'A platform team discovered that 12 of their 30 namespaces had service accounts with cluster-admin - all created during initial setup and never scoped down. A single compromised pod in any of those namespaces could read every secret in the cluster. One RBAC audit and cleanup fixed it, but the vulnerability had been open for 18 months.',
      careerRelevance: 'RBAC design is the #1 Kubernetes security skill. Every production cluster audit starts with RBAC review. Engineers who can design least-privilege RBAC are essential for any organization running Kubernetes at scale.',
    },    {
      number: 3, title: 'Containers & Workload Security', slug: 'containers-workload-security',
      subtitle: 'Hardening containers from image build to runtime with Pod Security Standards, seccomp, and distroless images',
      duration: '3 hours',
      objectives: ['Understand Linux container isolation primitives (namespaces, cgroups)', 'Build secure container images with distroless and rootless patterns', 'Configure Pod Security Standards for cluster-wide enforcement', 'Implement seccomp and capabilities restrictions'],
      svgDiagram: '<svg viewBox="0 0 800 350" xmlns="http://www.w3.org/2000/svg"><rect width="800" height="350" fill="#0f172a" rx="12"/><text x="400" y="28" text-anchor="middle" fill="#94a3b8" font-size="14" font-weight="bold">CONTAINER ISOLATION vs CONTAINER ESCAPE</text><rect x="40" y="55" width="340" height="260" rx="10" fill="none" stroke="#22c55e" stroke-width="2"/><text x="210" y="78" text-anchor="middle" fill="#22c55e" font-size="12" font-weight="bold">Properly Isolated Container</text><rect x="60" y="95" width="140" height="35" rx="5" fill="#1e293b" stroke="#22c55e"/><text x="130" y="117" text-anchor="middle" fill="#86efac" font-size="10">PID Namespace</text><rect x="220" y="95" width="140" height="35" rx="5" fill="#1e293b" stroke="#22c55e"/><text x="290" y="117" text-anchor="middle" fill="#86efac" font-size="10">Network Namespace</text><rect x="60" y="145" width="140" height="35" rx="5" fill="#1e293b" stroke="#22c55e"/><text x="130" y="167" text-anchor="middle" fill="#86efac" font-size="10">Mount Namespace</text><rect x="220" y="145" width="140" height="35" rx="5" fill="#1e293b" stroke="#22c55e"/><text x="290" y="167" text-anchor="middle" fill="#86efac" font-size="10">User Namespace</text><rect x="60" y="200" width="300" height="35" rx="5" fill="#1e293b" stroke="#22c55e"/><text x="210" y="222" text-anchor="middle" fill="#86efac" font-size="10">Seccomp + AppArmor + Capabilities Drop</text><rect x="60" y="250" width="300" height="40" rx="5" fill="#22c55e" fill-opacity="0.1" stroke="#22c55e"/><text x="210" y="270" text-anchor="middle" fill="#22c55e" font-size="10">Non-root user | Read-only FS | No hostPID</text><text x="210" y="285" text-anchor="middle" fill="#64748b" font-size="9">Result: strong isolation from host</text><rect x="420" y="55" width="340" height="260" rx="10" fill="none" stroke="#ef4444" stroke-width="2"/><text x="590" y="78" text-anchor="middle" fill="#ef4444" font-size="12" font-weight="bold">Container Escape Scenario</text><rect x="440" y="95" width="300" height="35" rx="5" fill="#1e293b" stroke="#ef4444"/><text x="590" y="117" text-anchor="middle" fill="#fca5a5" font-size="10">privileged: true (ALL capabilities)</text><rect x="440" y="145" width="300" height="35" rx="5" fill="#1e293b" stroke="#ef4444"/><text x="590" y="167" text-anchor="middle" fill="#fca5a5" font-size="10">hostPID: true (sees host processes)</text><rect x="440" y="195" width="300" height="35" rx="5" fill="#1e293b" stroke="#ef4444"/><text x="590" y="217" text-anchor="middle" fill="#fca5a5" font-size="10">hostNetwork: true (host network stack)</text><rect x="440" y="250" width="300" height="40" rx="5" fill="#ef4444" fill-opacity="0.1" stroke="#ef4444"/><text x="590" y="270" text-anchor="middle" fill="#ef4444" font-size="10">Root user | Writable FS | No seccomp</text><text x="590" y="285" text-anchor="middle" fill="#fca5a5" font-size="9">Result: trivial escape to host</text></svg>',
      content: `
        <p>Containers are not VMs. They share the host kernel and rely on Linux primitives - namespaces, cgroups, seccomp, capabilities - for isolation. Misconfigure any of these, and the container boundary dissolves.</p>
        <h2>Linux Container Isolation Primitives</h2>
        <ul>
          <li><strong>Namespaces:</strong> Isolate what a container can see (PID, network, mount, user, IPC, UTS)</li>
          <li><strong>cgroups:</strong> Limit what a container can use (CPU, memory, I/O)</li>
          <li><strong>Seccomp:</strong> Filter which syscalls a container can make (block dangerous ones like ptrace, mount)</li>
          <li><strong>Capabilities:</strong> Fine-grained root privileges (drop everything except what is needed)</li>
          <li><strong>AppArmor/SELinux:</strong> Mandatory access control for file and network operations</li>
        </ul>
        <h2>Secure Container Image Patterns</h2>
        <pre><code># Insecure: full OS, root user, unnecessary tools
FROM ubuntu:22.04
RUN apt-get update && apt-get install -y curl wget vim
COPY app /app
CMD ["/app"]

# Secure: distroless, non-root, minimal attack surface
FROM gcr.io/distroless/static-debian12:nonroot
COPY --chown=65534:65534 app /app
USER 65534
ENTRYPOINT ["/app"]
# No shell, no package manager, no curl, no wget
# Attacker with RCE cannot spawn a shell</code></pre>
        <h2>Pod Security Standards</h2>
        <p>Kubernetes defines three Pod Security Standards that enforce container hardening at the namespace level:</p>
        <ul>
          <li><strong>Privileged:</strong> No restrictions (for system workloads only)</li>
          <li><strong>Baseline:</strong> Prevents known privilege escalations (blocks hostPID, hostNetwork, privileged)</li>
          <li><strong>Restricted:</strong> Maximum hardening (requires non-root, read-only root FS, drops ALL capabilities)</li>
        </ul>
        <pre><code># Enforce restricted Pod Security Standard on a namespace
apiVersion: v1
kind: Namespace
metadata:
  name: production
  labels:
    pod-security.kubernetes.io/enforce: restricted
    pod-security.kubernetes.io/warn: restricted
    pod-security.kubernetes.io/audit: restricted</code></pre>
      `,
      labs: [
        { title: 'Harden an Insecure Container', objective: 'Transform an insecure Dockerfile into a hardened production image.', repoPath: 'module-03/lab-01', steps: ['Start with a vulnerable Dockerfile (root, full OS, unnecessary tools)', 'Rebuild with distroless base image', 'Add non-root user and read-only filesystem', 'Compare image sizes and attack surfaces'], duration: '30 min', difficulty: 'Beginner' },
        { title: 'Configure Pod Security Standards', objective: 'Enforce container hardening at the namespace level.', repoPath: 'module-03/lab-02', steps: ['Label a namespace with restricted Pod Security Standard', 'Deploy a compliant pod (succeeds)', 'Deploy a non-compliant pod with hostPID (rejected)', 'Review audit logs for policy violations'], duration: '25 min', difficulty: 'Beginner' },
        { title: 'Container Escape Demonstration', objective: 'Understand how misconfigurations enable container escape.', repoPath: 'module-03/lab-03', steps: ['Deploy a privileged container with hostPID', 'Access host processes from inside the container', 'Read host filesystem via /proc/1/root', 'Fix the configuration and verify isolation is restored'], duration: '30 min', difficulty: 'Intermediate' },
      ],
      keyTakeaways: ['Containers share the host kernel - isolation depends on namespaces, cgroups, seccomp', 'Distroless images eliminate shells and tools, drastically reducing attack surface', 'Pod Security Standards enforce container hardening at the namespace level', 'Never run containers as root or with privileged: true in production', 'Seccomp profiles block dangerous syscalls - always enable the default profile'],
      whyThisMatters: 'Container escapes are the most impactful Kubernetes attacks - breaking out of a container gives the attacker access to the node and potentially the entire cluster. Proper container hardening is the first line of defense and the most frequently misconfigured.',
      commonMistakes: ['Running containers as root (the default in most base images)', 'Using ubuntu or alpine base images that include shells and package managers', 'Not dropping ALL capabilities and adding back only what is needed', 'Setting privileged: true "just to make it work" and never removing it', 'Not enforcing Pod Security Standards on production namespaces'],
      productionNotes: ['Use distroless or scratch base images for all production workloads. A container with no shell cannot be used for interactive exploitation.', 'Apply the restricted Pod Security Standard to all production namespaces. Use warn mode first to identify non-compliant workloads before enforcing.'],
      securityRisks: ['privileged: true gives the container ALL capabilities including CAP_SYS_ADMIN - equivalent to root on the host', 'hostPID exposes all host processes to the container - enables credential theft from other pods', 'hostNetwork puts the container on the host network stack - bypasses all NetworkPolicies'],
      glossary: [{ term: 'Namespace (Linux)', definition: 'Kernel feature that isolates what a process can see (PID, network, mount, etc.)' }, { term: 'cgroup', definition: 'Control group - limits CPU, memory, and I/O resources for a set of processes' }, { term: 'Seccomp', definition: 'Secure computing mode - filters which syscalls a process can make' }, { term: 'Distroless', definition: 'Container image containing only the application binary and runtime - no OS tools' }, { term: 'Pod Security Standard', definition: 'Kubernetes policy level (Privileged/Baseline/Restricted) for container hardening' }],

      realWorldUseCases: ['Hardening container images for production', 'Implementing Pod Security Standards cluster-wide', 'Building distroless CI pipelines', 'Container escape prevention in multi-tenant clusters'],
      operationalStory: 'A container running as root with hostPID was used by an attacker to read K8s secrets from kubelet process memory. After enforcing Pod Security Standards cluster-wide, privileged containers were blocked before reaching production.',
      careerRelevance: 'Container hardening is foundational for any K8s security role. Organizations need engineers who build secure-by-default container pipelines.',},    {
      number: 4, title: 'Kubernetes Authentication & Authorization', slug: 'kubernetes-authentication-authorization',
      subtitle: 'Service accounts, OIDC, RBAC deep dive, and identity in distributed systems',
      duration: '3 hours',
      objectives: ['Configure Kubernetes authentication methods', 'Design least-privilege RBAC policies', 'Integrate OIDC for human authentication', 'Debug authentication and authorization failures'],
      svgDiagram: '<svg viewBox="0 0 800 300" xmlns="http://www.w3.org/2000/svg"><rect width="800" height="300" fill="#0f172a" rx="12"/><text x="400" y="28" text-anchor="middle" fill="#94a3b8" font-size="14" font-weight="bold">AUTHENTICATION vs AUTHORIZATION</text><rect x="40" y="55" width="340" height="210" rx="10" fill="none" stroke="#3b82f6" stroke-width="2"/><text x="210" y="80" text-anchor="middle" fill="#93c5fd" font-size="13" font-weight="bold">Authentication (Who are you?)</text><rect x="60" y="100" width="140" height="40" rx="6" fill="#1e293b" stroke="#475569"/><text x="130" y="125" text-anchor="middle" fill="#e2e8f0" font-size="10">Service Account Token</text><rect x="220" y="100" width="140" height="40" rx="6" fill="#1e293b" stroke="#475569"/><text x="290" y="125" text-anchor="middle" fill="#e2e8f0" font-size="10">OIDC Token</text><rect x="60" y="155" width="140" height="40" rx="6" fill="#1e293b" stroke="#475569"/><text x="130" y="180" text-anchor="middle" fill="#e2e8f0" font-size="10">X.509 Certificate</text><rect x="220" y="155" width="140" height="40" rx="6" fill="#1e293b" stroke="#475569"/><text x="290" y="180" text-anchor="middle" fill="#e2e8f0" font-size="10">Webhook Token</text><text x="210" y="230" text-anchor="middle" fill="#64748b" font-size="9">Verifies identity. Does NOT grant permissions.</text><rect x="420" y="55" width="340" height="210" rx="10" fill="none" stroke="#22c55e" stroke-width="2"/><text x="590" y="80" text-anchor="middle" fill="#86efac" font-size="13" font-weight="bold">Authorization (What can you do?)</text><rect x="440" y="100" width="140" height="40" rx="6" fill="#1e293b" stroke="#475569"/><text x="510" y="125" text-anchor="middle" fill="#e2e8f0" font-size="10">RBAC (default)</text><rect x="600" y="100" width="140" height="40" rx="6" fill="#1e293b" stroke="#475569"/><text x="670" y="125" text-anchor="middle" fill="#e2e8f0" font-size="10">ABAC (legacy)</text><rect x="440" y="155" width="140" height="40" rx="6" fill="#1e293b" stroke="#475569"/><text x="510" y="180" text-anchor="middle" fill="#e2e8f0" font-size="10">Webhook (custom)</text><rect x="600" y="155" width="140" height="40" rx="6" fill="#1e293b" stroke="#475569"/><text x="670" y="180" text-anchor="middle" fill="#e2e8f0" font-size="10">Node (kubelet)</text><text x="590" y="230" text-anchor="middle" fill="#64748b" font-size="9">Checks permissions. Requires authenticated identity.</text></svg>',
      content: `
        <p>Authentication proves who is making a request. Authorization decides what they can do. In Kubernetes, these are separate subsystems that run in sequence on every API request.</p>
        <h2>Kubernetes Authentication Methods</h2>
        <ul>
          <li><strong>Service Account Tokens:</strong> Projected tokens for pods (auto-mounted by default). Short-lived since K8s 1.24.</li>
          <li><strong>OIDC:</strong> External identity providers (Okta, Auth0, Dex) for human users. Recommended for developer access.</li>
          <li><strong>X.509 Client Certificates:</strong> Certificate-based auth for system components and CI/CD. Hard to revoke.</li>
          <li><strong>Webhook Token Authentication:</strong> Custom auth server for specialized flows.</li>
        </ul>
        <h2>RBAC Design Principles</h2>
        <pre><code># Principle 1: Namespace-scoped Roles over ClusterRoles
# Principle 2: Bind to specific ServiceAccounts, not groups
# Principle 3: Use verb restrictions (get,list vs create,delete)
# Principle 4: Audit with: kubectl auth can-i --list --as=system:serviceaccount:ns:sa</code></pre>
        <h2>Identity in Distributed Systems</h2>
        <p>Kubernetes service accounts provide in-cluster identity. But what about services communicating across clusters? Or between Kubernetes and VMs? This is where SPIFFE (Module 6) bridges the gap - providing portable, cryptographic workload identity beyond Kubernetes boundaries.</p>
      `,
      labs: [
        { title: 'Configure OIDC Authentication', objective: 'Integrate an OIDC provider for human user authentication.', repoPath: 'module-04/lab-01', steps: ['Deploy Dex as an OIDC provider', 'Configure the API server to trust Dex', 'Authenticate with kubectl using OIDC tokens', 'Verify identity with kubectl auth whoami'], duration: '35 min', difficulty: 'Intermediate' },
        { title: 'Debug Authorization Failures', objective: 'Troubleshoot RBAC denials systematically.', repoPath: 'module-04/lab-02', steps: ['Create a restricted service account', 'Attempt unauthorized operations and observe errors', 'Use kubectl auth can-i to diagnose permissions', 'Fix RBAC bindings and verify access'], duration: '25 min', difficulty: 'Beginner' },
      ],
      keyTakeaways: ['Authentication and authorization are separate - never confuse them', 'Use OIDC for human users, service accounts for workloads', 'RBAC should be namespace-scoped and least-privilege by default', 'Audit permissions regularly with kubectl auth can-i', 'Kubernetes identity ends at the cluster boundary - SPIFFE extends it'],
      whyThisMatters: 'RBAC misconfigurations are the #1 cause of Kubernetes privilege escalation. Every production cluster needs well-designed authentication and authorization - this module teaches you to build it right from the start.',
      commonMistakes: ['Using cluster-admin for CI/CD service accounts', 'Not disabling auto-mounting of service account tokens', 'Granting list secrets permission without understanding the blast radius', 'Using X.509 certificates for human users (impossible to revoke without CA rotation)'],
      glossary: [{ term: 'OIDC', definition: 'OpenID Connect - federated identity protocol for single sign-on' }, { term: 'RBAC', definition: 'Role-Based Access Control - maps roles to permissions to subjects' }, { term: 'Service Account', definition: 'Kubernetes identity for pods, used for API server authentication' }, { term: 'Projected Token', definition: 'Short-lived, audience-bound service account token (K8s 1.24+)' }],

      realWorldUseCases: ['OIDC integration for developer kubectl access', 'Service account token audit and cleanup', 'Cross-cluster identity challenges', 'Debugging auth failures in production'],
      operationalStory: 'A company using X.509 client certificates for developer access could not revoke a terminated employee access without rotating the entire CA - disrupting all 50 developers. After switching to OIDC via Dex, revocation was instant via the identity provider.',
      careerRelevance: 'Authentication and authorization design is fundamental to every Kubernetes security architecture. Engineers who understand the full auth flow are essential for platform teams.',},    {
      number: 5, title: 'Zero Trust Security Fundamentals', slug: 'zero-trust-security-fundamentals',
      subtitle: 'Identity-based security, mTLS, trust domains, and microsegmentation for cloud-native systems',
      duration: '3 hours',
      objectives: ['Understand Zero Trust principles for cloud-native systems', 'Implement mutual TLS between services', 'Design trust domains and microsegmentation', 'Plan east-west security for Kubernetes clusters'],
      svgDiagram: '<svg viewBox="0 0 800 300" xmlns="http://www.w3.org/2000/svg"><rect width="800" height="300" fill="#0f172a" rx="12"/><text x="400" y="28" text-anchor="middle" fill="#94a3b8" font-size="14" font-weight="bold">ZERO TRUST: EVERY REQUEST VERIFIED</text><rect x="50" y="60" width="140" height="50" rx="8" fill="#1e293b" stroke="#3b82f6" stroke-width="2"/><text x="120" y="90" text-anchor="middle" fill="#93c5fd" font-size="11" font-weight="bold">Service A</text><rect x="330" y="60" width="140" height="50" rx="8" fill="#1e293b" stroke="#22c55e" stroke-width="2"/><text x="400" y="90" text-anchor="middle" fill="#86efac" font-size="11" font-weight="bold">Service B</text><rect x="610" y="60" width="140" height="50" rx="8" fill="#1e293b" stroke="#a855f7" stroke-width="2"/><text x="680" y="90" text-anchor="middle" fill="#c084fc" font-size="11" font-weight="bold">Service C</text><line x1="190" y1="85" x2="330" y2="85" stroke="#22c55e" stroke-width="2.5"/><text x="260" y="78" text-anchor="middle" fill="#22c55e" font-size="9" font-weight="bold">mTLS verified</text><line x1="470" y1="85" x2="610" y2="85" stroke="#22c55e" stroke-width="2.5"/><text x="540" y="78" text-anchor="middle" fill="#22c55e" font-size="9" font-weight="bold">mTLS verified</text><rect x="50" y="150" width="700" height="120" rx="10" fill="#22c55e" fill-opacity="0.05" stroke="#22c55e" stroke-width="1"/><text x="400" y="175" text-anchor="middle" fill="#22c55e" font-size="12" font-weight="bold">Zero Trust Verification Stack</text><text x="150" y="205" text-anchor="middle" fill="#94a3b8" font-size="10">1. Identity</text><text x="150" y="220" text-anchor="middle" fill="#64748b" font-size="9">Who is this service?</text><text x="300" y="205" text-anchor="middle" fill="#94a3b8" font-size="10">2. Authentication</text><text x="300" y="220" text-anchor="middle" fill="#64748b" font-size="9">Prove it cryptographically</text><text x="470" y="205" text-anchor="middle" fill="#94a3b8" font-size="10">3. Encryption</text><text x="470" y="220" text-anchor="middle" fill="#64748b" font-size="9">mTLS for every connection</text><text x="640" y="205" text-anchor="middle" fill="#94a3b8" font-size="10">4. Authorization</text><text x="640" y="220" text-anchor="middle" fill="#64748b" font-size="9">Policy says: allowed?</text><text x="400" y="255" text-anchor="middle" fill="#64748b" font-size="9">Every request goes through all four layers. No exceptions. No implicit trust.</text></svg>',
      content: `
        <p>Zero Trust is not a product. It is an architecture principle: <strong>never trust, always verify</strong>. Every request - regardless of where it comes from - must be authenticated, encrypted, and authorized before it is processed.</p>
        <h2>Zero Trust Principles for Cloud Native</h2>
        <ol>
          <li><strong>Identity is the new perimeter:</strong> Cryptographic workload identity replaces network location</li>
          <li><strong>Encrypt everything:</strong> mTLS for all service-to-service communication</li>
          <li><strong>Verify continuously:</strong> Not just at connection establishment - on every request</li>
          <li><strong>Least privilege:</strong> Services access only what they need, verified by policy</li>
          <li><strong>Assume breach:</strong> Design so a compromised service cannot access everything</li>
        </ol>
        <h2>Mutual TLS (mTLS)</h2>
        <p>Regular TLS only verifies the server. mTLS verifies <strong>both sides</strong>. The client presents a certificate proving its identity, and the server verifies it before accepting the connection. This is the transport-layer foundation of zero trust.</p>
        <h2>Microsegmentation</h2>
        <p>Instead of one large trusted network, microsegmentation creates fine-grained security boundaries around individual services or groups of services. Combined with identity-based policies, it limits the blast radius of any breach to the compromised segment.</p>
        <h2>East-West Security</h2>
        <p>North-south traffic (external to cluster) gets security attention by default - load balancers, WAFs, API gateways. East-west traffic (service to service inside the cluster) is often unencrypted and unauthenticated. Zero trust means east-west traffic gets the same security treatment as north-south.</p>
      `,
      labs: [
        { title: 'Implement mTLS Between Services', objective: 'Set up manual mTLS between two services to understand the fundamentals.', repoPath: 'module-05/lab-01', steps: ['Generate CA and service certificates with OpenSSL', 'Configure two services to require client certificates', 'Verify mutual authentication succeeds', 'Test that connections without certificates are rejected'], duration: '30 min', difficulty: 'Intermediate' },
        { title: 'Simulate Zero Trust Networking', objective: 'Compare flat network vs microsegmented zero trust architecture.', repoPath: 'module-05/lab-02', steps: ['Deploy services on a flat network - observe unrestricted access', 'Add NetworkPolicies for microsegmentation', 'Add mTLS for encryption and authentication', 'Document the security improvement at each layer'], duration: '35 min', difficulty: 'Intermediate' },
      ],
      keyTakeaways: ['Zero Trust = never trust, always verify, regardless of network location', 'mTLS authenticates both client and server - the transport layer of zero trust', 'Microsegmentation limits blast radius by creating fine-grained security boundaries', 'East-west traffic needs the same security as north-south traffic', 'Identity + encryption + authorization = the three layers of zero trust'],
      whyThisMatters: 'Zero Trust is not optional for production Kubernetes. Without it, a single compromised pod can access every service in the cluster. With it, compromise is contained and detected. This module gives you the conceptual foundation that SPIFFE, Envoy, and OPA implement in later modules.',
      beforeAfter: { before: ['Trust the network', 'Unencrypted east-west traffic', 'IP-based access control', 'Perimeter-only security', 'Implicit trust inside the cluster'], after: ['Verify every request', 'mTLS on all connections', 'Identity-based policies', 'Defense in depth everywhere', 'Cryptographic proof of identity'] },
      commonMistakes: ['Thinking NetworkPolicies alone = zero trust (they do not encrypt or authenticate)', 'Implementing mTLS but not authorization (authenticated does not mean authorized)', 'Deploying zero trust for external traffic only, ignoring east-west', 'Using long-lived certificates instead of short-lived automatically rotated ones'],
      glossary: [{ term: 'mTLS', definition: 'Mutual TLS - both client and server verify certificates' }, { term: 'Microsegmentation', definition: 'Fine-grained network boundaries around individual services' }, { term: 'East-West Traffic', definition: 'Service-to-service communication inside the cluster' }, { term: 'North-South Traffic', definition: 'External traffic entering/leaving the cluster' }, { term: 'Zero Trust', definition: 'Security model: never trust, always verify, regardless of source' }],

      realWorldUseCases: ['mTLS between all production services', 'Microsegmentation for PCI-DSS compliance', 'East-west encryption in financial services', 'Zero trust architecture for healthcare data'],
      operationalStory: 'A healthcare company passed their HIPAA audit only after implementing mTLS between all services handling patient data. NetworkPolicies alone were insufficient - the auditor required encrypted, authenticated service communication.',
      careerRelevance: 'Zero trust is the industry direction. Engineers who can implement mTLS and microsegmentation are increasingly required for security-sensitive industries.',},    {
      number: 6, title: 'SPIFFE & SPIRE Deep Dive', slug: 'spiffe-spire-deep-dive',
      subtitle: 'Production workload identity with the CNCF standard - from concepts to Kubernetes deployment',
      duration: '4 hours',
      objectives: ['Understand SPIFFE specification and SPIRE architecture', 'Deploy SPIRE on Kubernetes with auto-registration', 'Configure workload attestation and SVID issuance', 'Implement SPIFFE federation across trust domains'],
      svgDiagram: '<svg viewBox="0 0 800 350" xmlns="http://www.w3.org/2000/svg"><rect width="800" height="350" fill="#0f172a" rx="12"/><text x="400" y="28" text-anchor="middle" fill="#94a3b8" font-size="14" font-weight="bold">SPIRE ARCHITECTURE ON KUBERNETES</text><rect x="280" y="50" width="240" height="60" rx="8" fill="#1e293b" stroke="#a855f7" stroke-width="2"/><text x="400" y="75" text-anchor="middle" fill="#c084fc" font-size="12" font-weight="bold">SPIRE Server (StatefulSet)</text><text x="400" y="95" text-anchor="middle" fill="#94a3b8" font-size="9">CA + Registration + Datastore</text><rect x="50" y="160" width="200" height="55" rx="8" fill="#1e293b" stroke="#3b82f6" stroke-width="2"/><text x="150" y="185" text-anchor="middle" fill="#93c5fd" font-size="11" font-weight="bold">Agent (DaemonSet)</text><text x="150" y="200" text-anchor="middle" fill="#94a3b8" font-size="9">Workload API + Attestation</text><rect x="300" y="160" width="200" height="55" rx="8" fill="#1e293b" stroke="#3b82f6" stroke-width="2"/><text x="400" y="185" text-anchor="middle" fill="#93c5fd" font-size="11" font-weight="bold">Agent (DaemonSet)</text><rect x="550" y="160" width="200" height="55" rx="8" fill="#1e293b" stroke="#3b82f6" stroke-width="2"/><text x="650" y="185" text-anchor="middle" fill="#93c5fd" font-size="11" font-weight="bold">Agent (DaemonSet)</text><line x1="150" y1="160" x2="330" y2="110" stroke="#a855f7" stroke-width="1.5"/><line x1="400" y1="160" x2="400" y2="110" stroke="#a855f7" stroke-width="1.5"/><line x1="650" y1="160" x2="470" y2="110" stroke="#a855f7" stroke-width="1.5"/><rect x="70" y="255" width="80" height="35" rx="5" fill="#1e293b" stroke="#22c55e"/><text x="110" y="277" text-anchor="middle" fill="#86efac" font-size="9">Pod (SVID)</text><rect x="170" y="255" width="80" height="35" rx="5" fill="#1e293b" stroke="#22c55e"/><text x="210" y="277" text-anchor="middle" fill="#86efac" font-size="9">Pod (SVID)</text><rect x="320" y="255" width="80" height="35" rx="5" fill="#1e293b" stroke="#22c55e"/><text x="360" y="277" text-anchor="middle" fill="#86efac" font-size="9">Pod (SVID)</text><rect x="570" y="255" width="80" height="35" rx="5" fill="#1e293b" stroke="#22c55e"/><text x="610" y="277" text-anchor="middle" fill="#86efac" font-size="9">Pod (SVID)</text><line x1="110" y1="255" x2="130" y2="215" stroke="#22c55e" stroke-width="1" stroke-dasharray="3,2"/><line x1="210" y1="255" x2="180" y2="215" stroke="#22c55e" stroke-width="1" stroke-dasharray="3,2"/><line x1="360" y1="255" x2="380" y2="215" stroke="#22c55e" stroke-width="1" stroke-dasharray="3,2"/><line x1="610" y1="255" x2="630" y2="215" stroke="#22c55e" stroke-width="1" stroke-dasharray="3,2"/><text x="400" y="320" text-anchor="middle" fill="#64748b" font-size="10">Every pod gets a unique cryptographic SVID - automatic issuance, rotation, and revocation</text></svg>',
      content: `
        <p>This module teaches the SPIFFE specification and its production implementation SPIRE. If you have already taken our dedicated <a href="/courses/mastering-spiffe-spire">Mastering SPIFFE &amp; SPIRE course</a>, this module serves as a recap within the broader cloud-native security context.</p>
        <h2>SPIFFE in 5 Minutes</h2>
        <p>SPIFFE (Secure Production Identity Framework For Everyone) defines a standard for workload identity. SPIRE (SPIFFE Runtime Environment) implements it. Together they give every service a cryptographic identity - automatically issued, automatically rotated, cryptographically verifiable.</p>
        <h2>Key Concepts</h2>
        <ul>
          <li><strong>Trust Domain:</strong> The root of trust (e.g., spiffe://company.org)</li>
          <li><strong>SPIFFE ID:</strong> URI identifying a workload (spiffe://company.org/ns/prod/sa/api)</li>
          <li><strong>X.509-SVID:</strong> Certificate proving identity - used for mTLS</li>
          <li><strong>JWT-SVID:</strong> Token proving identity - used for HTTP APIs</li>
          <li><strong>Workload API:</strong> Unix socket where pods request their identity</li>
        </ul>
        <h2>SPIRE on Kubernetes</h2>
        <p>SPIRE Server runs as a StatefulSet. SPIRE Agent runs as a DaemonSet on every node. The Controller Manager auto-registers workloads. The CSI Driver mounts the Workload API socket into pods. The result: every pod gets a cryptographic identity with zero manual configuration.</p>
        <h2>Why SPIFFE Matters for This Course</h2>
        <p>SPIFFE is the identity layer that enables everything in subsequent modules: Envoy mTLS (Module 7), OPA authorization (Module 8), Vault integration (Module 9), and production federation (Module 14). Without workload identity, none of these integrations work.</p>
      `,
      labs: [
        { title: 'Deploy SPIRE on Kubernetes', objective: 'Deploy the complete SPIRE stack on a Kind cluster.', repoPath: 'module-06/lab-01', steps: ['Create a Kind cluster', 'Deploy SPIRE Server, Agent, and Controller Manager', 'Register a workload and verify SVID issuance', 'Inspect the SVID with openssl'], duration: '40 min', difficulty: 'Intermediate' },
        { title: 'Configure SPIFFE Federation', objective: 'Federate two SPIRE deployments for cross-cluster trust.', repoPath: 'module-06/lab-02', steps: ['Deploy SPIRE on two separate Kind clusters', 'Exchange trust bundles', 'Register federated workloads', 'Verify cross-cluster mTLS communication'], duration: '45 min', difficulty: 'Advanced' },
      ],
      keyTakeaways: ['SPIFFE is the specification, SPIRE is the implementation', 'Every pod gets automatic cryptographic identity via SVID', 'SPIRE Server (StatefulSet) + Agent (DaemonSet) + Controller Manager = automatic workload identity', 'Federation enables cross-cluster and cross-cloud trust', 'SPIFFE is the identity foundation for all subsequent security modules'],
      whyThisMatters: 'Workload identity is the foundation of cloud-native zero trust. Without it, services cannot prove who they are, mTLS is impossible to manage at scale, and authorization policies have nothing to anchor on. This module gives you the identity layer everything else depends on.',
      commonMistakes: ['Using SQLite for SPIRE Server in production (no HA)', 'Not monitoring SVID rotation - stalled rotation = imminent certificate expiry', 'Overly broad ClusterSPIFFEID selectors matching unintended workloads', 'Confusing SPIFFE (identity) with authorization (what identity can do)'],
      glossary: [{ term: 'SPIFFE', definition: 'Secure Production Identity Framework For Everyone - the standard' }, { term: 'SPIRE', definition: 'SPIFFE Runtime Environment - the implementation' }, { term: 'SVID', definition: 'SPIFFE Verifiable Identity Document - certificate or JWT' }, { term: 'Trust Domain', definition: 'Root of trust identified by domain name' }, { term: 'Attestation', definition: 'Process of verifying node or workload identity' }],

      realWorldUseCases: ['Automatic workload identity for 500+ microservices', 'Cross-cluster identity with SPIFFE federation', 'Replacing shared secrets with SVID-based authentication', 'Kubernetes + VM hybrid identity'],
      operationalStory: 'A fintech company replaced 200+ shared API keys with SPIFFE SVIDs over 3 months. Each service got unique, auto-rotating cryptographic identity. Secret sprawl dropped to zero and the security team could finally audit who accessed what.',
      careerRelevance: 'SPIFFE/SPIRE expertise is rare and increasingly demanded. Bloomberg, Uber, and Pinterest use it at scale - and they need engineers who understand it.',},    {
      number: 7, title: 'Service Mesh Security', slug: 'service-mesh-security',
      subtitle: 'Envoy, Istio, and Linkerd - transparent mTLS, identity propagation, and authorization policies',
      duration: '3.5 hours',
      objectives: ['Understand service mesh architecture and security capabilities', 'Deploy Istio with mTLS enforcement', 'Configure identity-aware authorization policies', 'Integrate SPIRE as the mesh identity provider'],
      svgDiagram: '<svg viewBox="0 0 800 300" xmlns="http://www.w3.org/2000/svg"><rect width="800" height="300" fill="#0f172a" rx="12"/><text x="400" y="28" text-anchor="middle" fill="#94a3b8" font-size="14" font-weight="bold">SERVICE MESH: TRANSPARENT mTLS</text><rect x="50" y="70" width="280" height="180" rx="10" fill="none" stroke="#3b82f6" stroke-width="1.5" stroke-dasharray="5,3"/><text x="70" y="90" fill="#3b82f6" font-size="10">Pod A</text><rect x="70" y="100" width="100" height="40" rx="6" fill="#1e293b" stroke="#22c55e"/><text x="120" y="125" text-anchor="middle" fill="#86efac" font-size="10">App (HTTP)</text><rect x="190" y="100" width="120" height="40" rx="6" fill="#1e293b" stroke="#f97316" stroke-width="2"/><text x="250" y="120" text-anchor="middle" fill="#fdba74" font-size="10">Envoy Sidecar</text><text x="250" y="135" text-anchor="middle" fill="#94a3b8" font-size="8">SVID from SPIRE</text><rect x="70" y="160" width="240" height="30" rx="4" fill="#06b6d4" fill-opacity="0.1" stroke="#06b6d4"/><text x="190" y="180" text-anchor="middle" fill="#67e8f9" font-size="9">SPIRE Agent (Workload API)</text><rect x="470" y="70" width="280" height="180" rx="10" fill="none" stroke="#3b82f6" stroke-width="1.5" stroke-dasharray="5,3"/><text x="490" y="90" fill="#3b82f6" font-size="10">Pod B</text><rect x="490" y="100" width="100" height="40" rx="6" fill="#1e293b" stroke="#22c55e"/><text x="540" y="125" text-anchor="middle" fill="#86efac" font-size="10">App (HTTP)</text><rect x="610" y="100" width="120" height="40" rx="6" fill="#1e293b" stroke="#f97316" stroke-width="2"/><text x="670" y="120" text-anchor="middle" fill="#fdba74" font-size="10">Envoy Sidecar</text><text x="670" y="135" text-anchor="middle" fill="#94a3b8" font-size="8">SVID from SPIRE</text><rect x="490" y="160" width="240" height="30" rx="4" fill="#06b6d4" fill-opacity="0.1" stroke="#06b6d4"/><text x="610" y="180" text-anchor="middle" fill="#67e8f9" font-size="9">SPIRE Agent (Workload API)</text><line x1="310" y1="120" x2="470" y2="120" stroke="#22c55e" stroke-width="3"/><text x="390" y="112" text-anchor="middle" fill="#22c55e" font-size="11" font-weight="bold">mTLS</text><text x="390" y="145" text-anchor="middle" fill="#64748b" font-size="9">Apps talk HTTP. Envoy handles mTLS transparently.</text></svg>',
      content: `
        <p>A service mesh adds a sidecar proxy (typically Envoy) to every pod. The proxy handles mTLS, load balancing, retries, and observability - transparently, without application code changes. For security, this means automatic encryption and authentication for all service-to-service traffic.</p>
        <h2>Service Mesh Security Capabilities</h2>
        <ul>
          <li><strong>Automatic mTLS:</strong> All traffic encrypted and mutually authenticated without application changes</li>
          <li><strong>Identity propagation:</strong> SPIFFE IDs flow through the proxy chain for end-to-end verification</li>
          <li><strong>Authorization policies:</strong> Fine-grained rules based on service identity, method, path</li>
          <li><strong>Traffic policies:</strong> Rate limiting, circuit breaking, fault injection for resilience</li>
        </ul>
        <h2>Istio Security Model</h2>
        <p>Istio enforces mTLS via PeerAuthentication resources and authorization via AuthorizationPolicy resources. When combined with SPIRE as the identity provider, you get stronger attestation than Istio default CA provides.</p>
        <pre><code># Enforce strict mTLS on all services in production namespace
apiVersion: security.istio.io/v1
kind: PeerAuthentication
metadata:
  name: strict-mtls
  namespace: production
spec:
  mtls:
    mode: STRICT
---
# Only allow orders-api to access the database
apiVersion: security.istio.io/v1
kind: AuthorizationPolicy
metadata:
  name: allow-orders-to-db
  namespace: production
spec:
  selector:
    matchLabels:
      app: database
  rules:
    - from:
        - source:
            principals: ["cluster.local/ns/production/sa/orders-api"]
      to:
        - operation:
            methods: ["GET", "POST"]</code></pre>
      `,
      labs: [
        { title: 'Deploy Istio with Strict mTLS', objective: 'Enable automatic encryption for all service traffic.', repoPath: 'module-07/lab-01', steps: ['Install Istio with default profile', 'Enable sidecar injection', 'Deploy sample application', 'Enforce strict mTLS and verify encryption'], duration: '35 min', difficulty: 'Intermediate' },
        { title: 'Configure Identity-Based Authorization', objective: 'Restrict service access based on SPIFFE identities.', repoPath: 'module-07/lab-02', steps: ['Create AuthorizationPolicy resources', 'Allow only specific services to access database', 'Test that unauthorized services are rejected (403)', 'View access logs in Envoy'], duration: '30 min', difficulty: 'Intermediate' },
      ],
      keyTakeaways: ['Service meshes provide transparent mTLS - no application code changes', 'Envoy sidecars handle encryption, authentication, and authorization', 'Istio PeerAuthentication enforces mTLS, AuthorizationPolicy enforces access', 'SPIRE can replace Istio CA for stronger workload attestation', 'Service mesh + SPIFFE = the infrastructure layer of zero trust'],
      whyThisMatters: 'Service meshes are the most practical way to deploy zero trust at scale. Instead of modifying every application to handle mTLS, the mesh proxy handles it transparently. This module teaches you to deploy and configure the encryption and authorization layer for production Kubernetes.',
      commonMistakes: ['Enabling permissive mTLS instead of strict - allows plaintext fallback', 'Not testing AuthorizationPolicies before enforcing - blocks legitimate traffic', 'Running service mesh without understanding resource overhead (CPU, memory per sidecar)', 'Deploying mesh without SPIRE - default Istio CA uses weaker attestation'],
      glossary: [{ term: 'Service Mesh', definition: 'Infrastructure layer of sidecar proxies handling L7 traffic between services' }, { term: 'Envoy', definition: 'High-performance proxy used as the sidecar in most service meshes' }, { term: 'PeerAuthentication', definition: 'Istio resource controlling mTLS mode (permissive/strict)' }, { term: 'AuthorizationPolicy', definition: 'Istio resource controlling which services can access which endpoints' }],

      realWorldUseCases: ['Transparent mTLS for all east-west traffic', 'Identity-based authorization in Istio', 'Service mesh migration from permissive to strict mTLS', 'Envoy SDS integration with SPIRE'],
      operationalStory: 'During an Istio migration, a team enabled strict mTLS without checking all services. 12 services that bypassed the sidecar proxy broke immediately. Lesson: migrate from permissive to strict incrementally, one namespace at a time.',
      careerRelevance: 'Service mesh expertise combined with security knowledge is a rare and valuable skill set. Organizations deploying Istio at scale need engineers who understand both.',},    {
      number: 8, title: 'Policy-as-Code Security', slug: 'policy-as-code-security',
      subtitle: 'OPA, Kyverno, Gatekeeper, and admission controllers for automated security enforcement',
      duration: '3.5 hours',
      objectives: ['Write OPA Rego policies for Kubernetes security', 'Deploy Kyverno for declarative policy enforcement', 'Configure Gatekeeper admission controller', 'Automate compliance checks in CI/CD'],
      svgDiagram: '<svg viewBox="0 0 800 300" xmlns="http://www.w3.org/2000/svg"><rect width="800" height="300" fill="#0f172a" rx="12"/><text x="400" y="28" text-anchor="middle" fill="#94a3b8" font-size="14" font-weight="bold">POLICY-AS-CODE ENFORCEMENT PIPELINE</text><rect x="50" y="70" width="130" height="50" rx="8" fill="#1e293b" stroke="#3b82f6" stroke-width="2"/><text x="115" y="100" text-anchor="middle" fill="#93c5fd" font-size="11" font-weight="bold">kubectl apply</text><rect x="230" y="60" width="140" height="70" rx="8" fill="#1e293b" stroke="#a855f7" stroke-width="2"/><text x="300" y="85" text-anchor="middle" fill="#c084fc" font-size="11" font-weight="bold">API Server</text><text x="300" y="105" text-anchor="middle" fill="#94a3b8" font-size="9">AuthN + AuthZ (RBAC)</text><text x="300" y="118" text-anchor="middle" fill="#94a3b8" font-size="9">passes to admission</text><rect x="420" y="60" width="180" height="70" rx="8" fill="#1e293b" stroke="#f97316" stroke-width="2"/><text x="510" y="85" text-anchor="middle" fill="#fdba74" font-size="11" font-weight="bold">Admission Controller</text><text x="510" y="105" text-anchor="middle" fill="#94a3b8" font-size="9">OPA Gatekeeper / Kyverno</text><text x="510" y="118" text-anchor="middle" fill="#94a3b8" font-size="9">Evaluate policies</text><rect x="650" y="70" width="110" height="50" rx="8" fill="#1e293b" stroke="#22c55e" stroke-width="2"/><text x="705" y="100" text-anchor="middle" fill="#86efac" font-size="11" font-weight="bold">etcd (saved)</text><line x1="180" y1="95" x2="230" y2="95" stroke="#94a3b8" stroke-width="2" marker-end="url(#a8)"/><line x1="370" y1="95" x2="420" y2="95" stroke="#94a3b8" stroke-width="2" marker-end="url(#a8)"/><line x1="600" y1="95" x2="650" y2="95" stroke="#22c55e" stroke-width="2" marker-end="url(#a8)"/><rect x="420" y="170" width="180" height="100" rx="8" fill="#f97316" fill-opacity="0.05" stroke="#f97316" stroke-width="1"/><text x="510" y="195" text-anchor="middle" fill="#fdba74" font-size="10" font-weight="bold">Example Policies</text><text x="510" y="215" text-anchor="middle" fill="#94a3b8" font-size="9">No privileged containers</text><text x="510" y="230" text-anchor="middle" fill="#94a3b8" font-size="9">Require resource limits</text><text x="510" y="245" text-anchor="middle" fill="#94a3b8" font-size="9">Block latest tag</text><text x="510" y="260" text-anchor="middle" fill="#94a3b8" font-size="9">Require labels</text><rect x="50" y="170" width="330" height="50" rx="8" fill="#ef4444" fill-opacity="0.05" stroke="#ef4444" stroke-width="1"/><text x="215" y="195" text-anchor="middle" fill="#ef4444" font-size="10">Rejected: violates "no-privileged-containers" policy</text><text x="215" y="210" text-anchor="middle" fill="#94a3b8" font-size="9">Blocked BEFORE reaching etcd. Zero impact on cluster.</text><defs><marker id="a8" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill="#94a3b8"/></marker></defs></svg>',
      content: `
        <p>Security policies should be code: version-controlled, testable, reviewable, and automatically enforced. Policy-as-code replaces manual security reviews and hopeful checklists with automated admission control that blocks insecure configurations before they reach the cluster.</p>
        <h2>OPA and Rego</h2>
        <p>Open Policy Agent (OPA) is the CNCF-graduated policy engine. Policies are written in Rego, a declarative language designed for structured data evaluation.</p>
        <pre><code># Block privileged containers
package kubernetes.admission

deny[msg] {
  input.request.kind.kind == "Pod"
  container := input.request.object.spec.containers[_]
  container.securityContext.privileged == true
  msg := sprintf("Privileged containers not allowed: %s", [container.name])
}</code></pre>
        <h2>Kyverno</h2>
        <p>Kyverno uses Kubernetes-native YAML instead of Rego. No new language to learn. Policies are Kubernetes resources that can validate, mutate, and generate configurations.</p>
        <pre><code># Kyverno: require resource limits on all containers
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: require-resource-limits
spec:
  validationFailureAction: Enforce
  rules:
    - name: check-limits
      match:
        any:
          - resources:
              kinds: ["Pod"]
      validate:
        message: "Resource limits are required for all containers"
        pattern:
          spec:
            containers:
              - resources:
                  limits:
                    memory: "?*"
                    cpu: "?*"</code></pre>
        <h2>Gatekeeper vs Kyverno</h2>
        <table>
          <thead><tr><th>Feature</th><th>OPA Gatekeeper</th><th>Kyverno</th></tr></thead>
          <tbody>
            <tr><td>Policy language</td><td>Rego</td><td>YAML (K8s native)</td></tr>
            <tr><td>Learning curve</td><td>Higher (new language)</td><td>Lower (familiar YAML)</td></tr>
            <tr><td>Mutation</td><td>Limited</td><td>Full support</td></tr>
            <tr><td>Generation</td><td>No</td><td>Yes (auto-create resources)</td></tr>
            <tr><td>Ecosystem</td><td>Broader (OPA used beyond K8s)</td><td>K8s-specific</td></tr>
          </tbody>
        </table>
      `,
      labs: [
        { title: 'Block Insecure Deployments with OPA Gatekeeper', objective: 'Deploy Gatekeeper and enforce container security policies.', repoPath: 'module-08/lab-01', steps: ['Install OPA Gatekeeper', 'Create ConstraintTemplate for privileged containers', 'Deploy a privileged pod - observe rejection', 'Deploy a compliant pod - observe success'], duration: '30 min', difficulty: 'Intermediate' },
        { title: 'Enforce Security with Kyverno', objective: 'Use Kyverno to require resource limits and block dangerous configurations.', repoPath: 'module-08/lab-02', steps: ['Install Kyverno', 'Create policies: require limits, block latest tag, require labels', 'Test with compliant and non-compliant deployments', 'View policy reports'], duration: '30 min', difficulty: 'Beginner' },
      ],
      keyTakeaways: ['Policy-as-code automates security enforcement - no manual reviews needed', 'Admission controllers block insecure configs BEFORE they reach the cluster', 'OPA Gatekeeper uses Rego (powerful, steep learning curve)', 'Kyverno uses YAML (Kubernetes-native, easier adoption)', 'Policies should be tested in CI/CD before deploying to production'],
      whyThisMatters: 'Manual security reviews do not scale. With hundreds of deployments per day, you need automated policy enforcement that blocks misconfigurations at the admission layer. Policy-as-code is the automation layer of cloud-native security.',
      commonMistakes: ['Deploying policies in Enforce mode without testing in Audit mode first', 'Writing overly broad policies that block legitimate workloads', 'Not versioning policies in Git alongside application code', 'Forgetting to exclude system namespaces (kube-system) from restrictive policies'],
      designTradeoffs: [{ option: 'OPA Gatekeeper', pros: ['Powerful Rego language', 'Broader ecosystem (works beyond K8s)', 'Strong community'], cons: ['Steep learning curve', 'Limited mutation support', 'Separate template + constraint model'] }, { option: 'Kyverno', pros: ['Kubernetes-native YAML', 'Easy to learn', 'Full mutation and generation', 'Policy reports built-in'], cons: ['K8s-specific only', 'Less expressive than Rego for complex logic'] }],
      glossary: [{ term: 'Admission Controller', definition: 'Intercepts API requests after auth, before persistence - can mutate or reject' }, { term: 'OPA', definition: 'Open Policy Agent - general-purpose policy engine' }, { term: 'Rego', definition: 'Declarative policy language used by OPA' }, { term: 'Kyverno', definition: 'Kubernetes-native policy engine using YAML policies' }, { term: 'Gatekeeper', definition: 'Kubernetes admission controller that uses OPA for policy enforcement' }],

      realWorldUseCases: ['Blocking privileged containers via admission control', 'Requiring resource limits on all deployments', 'Automated compliance enforcement in CI/CD', 'Multi-tenant policy isolation'],
      operationalStory: 'A team deployed Kyverno in Enforce mode without testing. It blocked their monitoring stack from deploying because the DaemonSet needed hostNetwork. After adding policy exceptions for system namespaces, everything recovered. Lesson: always test in Audit mode first.',
      careerRelevance: 'Policy-as-code is becoming mandatory for regulated industries. Engineers who can design and test admission policies are essential for platform security.',},    {
      number: 9, title: 'Secrets Management & Machine Identity', slug: 'secrets-management-machine-identity',
      subtitle: 'Vault, dynamic secrets, certificate rotation, and replacing secret sprawl with workload identity',
      duration: '3.5 hours',
      objectives: ['Integrate HashiCorp Vault with Kubernetes', 'Implement dynamic secrets and automatic rotation', 'Replace static credentials with workload identity', 'Design a secrets management strategy for production'],
      svgDiagram: '<svg viewBox="0 0 800 300" xmlns="http://www.w3.org/2000/svg"><rect width="800" height="300" fill="#0f172a" rx="12"/><text x="400" y="28" text-anchor="middle" fill="#94a3b8" font-size="14" font-weight="bold">SECRET SPRAWL vs WORKLOAD IDENTITY</text><rect x="40" y="55" width="340" height="210" rx="10" fill="none" stroke="#ef4444" stroke-width="2"/><text x="210" y="80" text-anchor="middle" fill="#ef4444" font-size="12" font-weight="bold">Secret Sprawl (Before)</text><text x="210" y="110" text-anchor="middle" fill="#94a3b8" font-size="10">API keys in env vars</text><text x="210" y="130" text-anchor="middle" fill="#94a3b8" font-size="10">Database passwords in ConfigMaps</text><text x="210" y="150" text-anchor="middle" fill="#94a3b8" font-size="10">Long-lived certificates on disk</text><text x="210" y="170" text-anchor="middle" fill="#94a3b8" font-size="10">Vault tokens (another secret!)</text><text x="210" y="190" text-anchor="middle" fill="#94a3b8" font-size="10">Secrets in Git history</text><text x="210" y="215" text-anchor="middle" fill="#ef4444" font-size="9">Every secret is a breach vector</text><text x="210" y="245" text-anchor="middle" fill="#94a3b8" font-size="9">Manual rotation (or never)</text><rect x="420" y="55" width="340" height="210" rx="10" fill="none" stroke="#22c55e" stroke-width="2"/><text x="590" y="80" text-anchor="middle" fill="#22c55e" font-size="12" font-weight="bold">Workload Identity (After)</text><text x="590" y="110" text-anchor="middle" fill="#94a3b8" font-size="10">SPIFFE SVIDs (auto-issued)</text><text x="590" y="130" text-anchor="middle" fill="#94a3b8" font-size="10">Dynamic DB credentials (Vault)</text><text x="590" y="150" text-anchor="middle" fill="#94a3b8" font-size="10">Short-lived certs (auto-rotated)</text><text x="590" y="170" text-anchor="middle" fill="#94a3b8" font-size="10">SVID auth to Vault (no tokens)</text><text x="590" y="190" text-anchor="middle" fill="#94a3b8" font-size="10">Zero secrets in code or config</text><text x="590" y="215" text-anchor="middle" fill="#22c55e" font-size="9">Identity replaces secrets</text><text x="590" y="245" text-anchor="middle" fill="#94a3b8" font-size="9">Automatic rotation (always)</text></svg>',
      content: `
        <p>Secret sprawl is one of the most dangerous problems in cloud-native security. API keys in environment variables, database passwords in ConfigMaps, certificates that never rotate, and Vault tokens that need their own distribution mechanism. Each secret is a breach vector. Workload identity replaces most of these with cryptographic proof that needs no distribution.</p>
        <h2>Kubernetes Secrets: The Problem</h2>
        <p>Kubernetes Secrets are base64-encoded (not encrypted) by default. They are accessible to anyone with RBAC access to the namespace. They persist in etcd and must be encrypted at rest explicitly. They have no automatic rotation mechanism.</p>
        <h2>HashiCorp Vault Integration</h2>
        <p>Vault provides encrypted secret storage, dynamic credentials (database passwords generated on demand and automatically revoked), PKI certificates, and transit encryption. The key integration: workloads authenticate to Vault using their SPIFFE SVID instead of static Vault tokens.</p>
        <h2>Dynamic Secrets</h2>
        <pre><code># Instead of: static database password shared across all services
# Vault generates: unique short-lived credentials per service
# Each credential is automatically revoked after TTL expires

# Vault dynamic database credential:
vault read database/creds/readonly
# Key             Value
# lease_id        database/creds/readonly/abc123
# lease_duration  1h
# username        v-svc-readonly-xyz123  (unique per request!)
# password        A1b2C3-random-xyz      (auto-revoked in 1 hour)</code></pre>
        <h2>Replacing Secrets with Workload Identity</h2>
        <p>The ultimate goal: eliminate static secrets entirely. Services authenticate with their SVID (automatic, short-lived, no distribution needed). Vault issues dynamic credentials based on verified identity. Certificates are managed by SPIRE (automatic rotation). The only secret that remains is the Vault unseal key - protected by cloud KMS.</p>
      `,
      labs: [
        { title: 'Integrate Vault with Kubernetes', objective: 'Deploy Vault and configure Kubernetes authentication.', repoPath: 'module-09/lab-01', steps: ['Deploy Vault in dev mode on Kubernetes', 'Enable Kubernetes auth backend', 'Create a policy for a service account', 'Retrieve secrets from a pod using the Vault agent'], duration: '35 min', difficulty: 'Intermediate' },
        { title: 'Dynamic Secret Rotation', objective: 'Configure Vault to issue short-lived database credentials.', repoPath: 'module-09/lab-02', steps: ['Deploy PostgreSQL', 'Configure Vault database secrets engine', 'Generate dynamic credentials with 1-hour TTL', 'Verify automatic revocation after TTL expires'], duration: '30 min', difficulty: 'Intermediate' },
      ],
      keyTakeaways: ['Secret sprawl is a top cloud-native security risk - every static secret is a breach vector', 'Vault provides encrypted storage, dynamic credentials, and PKI - but needs its own auth', 'SPIFFE SVIDs replace Vault tokens - workloads authenticate to Vault with their identity', 'Dynamic secrets (short-lived, auto-revoked) are always better than static passwords', 'The goal: zero static secrets in your infrastructure'],
      whyThisMatters: 'Secret sprawl is consistently in the top 3 causes of cloud-native breaches. Every leaked API key, every long-lived certificate, every hardcoded password is a potential headline. This module teaches you to systematically eliminate static secrets and replace them with identity-based authentication and dynamic credentials.',
      commonMistakes: ['Storing Vault tokens as Kubernetes Secrets (replaces one secret problem with another)', 'Not encrypting Kubernetes Secrets at rest in etcd', 'Using static database passwords shared across all services', 'Not implementing credential rotation - "it works fine" until the breach'],
      beforeAfter: { before: ['API keys in env vars', 'Shared database passwords', 'Long-lived certificates', 'Vault tokens as secrets', 'Manual rotation (or never)'], after: ['SVID-based authentication', 'Dynamic per-service credentials', 'Auto-rotated short-lived certs', 'Identity-based Vault auth', 'Automatic rotation always'] },
      glossary: [{ term: 'Secret Sprawl', definition: 'Uncontrolled proliferation of credentials across systems and configs' }, { term: 'Dynamic Secrets', definition: 'Credentials generated on-demand with automatic expiration' }, { term: 'Vault', definition: 'HashiCorp secret management platform' }, { term: 'Transit Encryption', definition: 'Vault engine for encrypting/decrypting data without storing it' }],

      realWorldUseCases: ['Eliminating static database passwords with Vault dynamic secrets', 'SPIFFE-based Vault authentication (no token distribution)', 'Certificate rotation for internal PKI', 'Encrypting application data with Vault transit'],
      operationalStory: 'An e-commerce platform had 47 services sharing the same database password via environment variables. When the password was rotated, 12 services crashed because their cached connections used the old password. After switching to Vault dynamic credentials, each service got unique credentials with automatic rotation - zero-downtime rotations became routine.',
      careerRelevance: 'Secrets management is a critical skill for DevOps and platform engineering roles. Organizations need engineers who can eliminate secret sprawl and implement dynamic credential workflows.',},    {
      number: 10, title: 'Runtime Security & Threat Detection', slug: 'runtime-security-threat-detection',
      subtitle: 'Falco, Tetragon, eBPF - detecting container escapes, unauthorized access, and runtime threats',
      duration: '3.5 hours',
      objectives: ['Understand runtime threat categories in Kubernetes', 'Deploy Falco for syscall-based threat detection', 'Use Tetragon for eBPF-based enforcement', 'Build incident response procedures for runtime events'],
      svgDiagram: '<svg viewBox="0 0 800 300" xmlns="http://www.w3.org/2000/svg"><rect width="800" height="300" fill="#0f172a" rx="12"/><text x="400" y="28" text-anchor="middle" fill="#94a3b8" font-size="14" font-weight="bold">RUNTIME THREAT DETECTION PIPELINE</text><rect x="50" y="70" width="160" height="60" rx="8" fill="#1e293b" stroke="#ef4444" stroke-width="2"/><text x="130" y="95" text-anchor="middle" fill="#fca5a5" font-size="11" font-weight="bold">Threat Event</text><text x="130" y="115" text-anchor="middle" fill="#94a3b8" font-size="9">shell in container</text><rect x="260" y="70" width="160" height="60" rx="8" fill="#1e293b" stroke="#f97316" stroke-width="2"/><text x="340" y="95" text-anchor="middle" fill="#fdba74" font-size="11" font-weight="bold">Falco / Tetragon</text><text x="340" y="115" text-anchor="middle" fill="#94a3b8" font-size="9">eBPF + syscall rules</text><rect x="470" y="70" width="140" height="60" rx="8" fill="#1e293b" stroke="#eab308" stroke-width="2"/><text x="540" y="95" text-anchor="middle" fill="#eab308" font-size="11" font-weight="bold">Alert</text><text x="540" y="115" text-anchor="middle" fill="#94a3b8" font-size="9">Slack / PagerDuty</text><rect x="660" y="70" width="110" height="60" rx="8" fill="#1e293b" stroke="#22c55e" stroke-width="2"/><text x="715" y="95" text-anchor="middle" fill="#86efac" font-size="11" font-weight="bold">Response</text><text x="715" y="115" text-anchor="middle" fill="#94a3b8" font-size="9">kill / isolate</text><line x1="210" y1="100" x2="260" y2="100" stroke="#94a3b8" stroke-width="2" marker-end="url(#a10)"/><line x1="420" y1="100" x2="470" y2="100" stroke="#94a3b8" stroke-width="2" marker-end="url(#a10)"/><line x1="610" y1="100" x2="660" y2="100" stroke="#94a3b8" stroke-width="2" marker-end="url(#a10)"/><rect x="50" y="170" width="720" height="100" rx="10" fill="#ef4444" fill-opacity="0.05" stroke="#ef4444" stroke-width="1"/><text x="400" y="195" text-anchor="middle" fill="#ef4444" font-size="11" font-weight="bold">Common Runtime Threats Detected</text><text x="150" y="220" text-anchor="middle" fill="#94a3b8" font-size="9">Shell spawned in container</text><text x="320" y="220" text-anchor="middle" fill="#94a3b8" font-size="9">Sensitive file read (/etc/shadow)</text><text x="510" y="220" text-anchor="middle" fill="#94a3b8" font-size="9">Unexpected outbound connection</text><text x="680" y="220" text-anchor="middle" fill="#94a3b8" font-size="9">Privilege escalation attempt</text><text x="150" y="245" text-anchor="middle" fill="#94a3b8" font-size="9">Crypto-mining process</text><text x="320" y="245" text-anchor="middle" fill="#94a3b8" font-size="9">Container escape via nsenter</text><text x="510" y="245" text-anchor="middle" fill="#94a3b8" font-size="9">Unauthorized kubectl exec</text><text x="680" y="245" text-anchor="middle" fill="#94a3b8" font-size="9">Binary modified at runtime</text><defs><marker id="a10" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill="#94a3b8"/></marker></defs></svg>',
      content: `
        <p>Identity prevents unauthorized access. Network policies restrict traffic. But what about threats INSIDE an authorized workload? A compromised container running a cryptominer, an attacker spawning a shell, malware reading sensitive files - these are <strong>runtime threats</strong> that require real-time detection and response.</p>
        <h2>Falco: Syscall-Based Detection</h2>
        <p>Falco is a CNCF graduated project that monitors Linux syscalls and alerts on suspicious behavior. It runs as a DaemonSet and watches every container on the node.</p>
        <pre><code># Falco rule: detect shell spawned in container
- rule: Terminal shell in container
  desc: A shell was spawned in a container
  condition: >
    spawned_process and container and
    proc.name in (bash, sh, zsh, dash)
  output: >
    Shell spawned in container
    (user=%user.name container=%container.name
     image=%container.image.repository
     pod=%k8s.pod.name ns=%k8s.ns.name)
  priority: WARNING</code></pre>
        <h2>Tetragon: eBPF Runtime Enforcement</h2>
        <p>Tetragon goes beyond detection - it can <strong>block</strong> malicious actions in real-time using eBPF. While Falco alerts you to a shell spawn, Tetragon can prevent the shell from executing.</p>
        <h2>eBPF: The Foundation</h2>
        <p>eBPF (extended Berkeley Packet Filter) runs sandboxed programs in the Linux kernel without kernel modules. It enables runtime security tools to observe and enforce at the kernel level - with near-zero performance overhead.</p>
        <h2>Incident Response</h2>
        <p>Detection without response is just monitoring. The response pipeline should: alert the security team (Slack/PagerDuty), capture forensic data (pod logs, network connections), isolate the pod (NetworkPolicy deny-all), preserve evidence (do not delete the pod), and investigate root cause.</p>
      `,
      labs: [
        { title: 'Detect Container Escape Attempts with Falco', objective: 'Deploy Falco and trigger security alerts.', repoPath: 'module-10/lab-01', steps: ['Install Falco as a DaemonSet', 'Spawn a shell inside a container', 'Read /etc/shadow from inside a container', 'Observe Falco alerts for both events'], duration: '30 min', difficulty: 'Intermediate' },
        { title: 'Runtime Enforcement with Tetragon', objective: 'Block malicious actions at the kernel level.', repoPath: 'module-10/lab-02', steps: ['Install Tetragon', 'Create a TracingPolicy that blocks shell execution', 'Attempt to spawn a shell - observe block', 'View Tetragon event logs'], duration: '30 min', difficulty: 'Advanced' },
      ],
      keyTakeaways: ['Runtime security detects threats INSIDE authorized workloads - the last line of defense', 'Falco monitors syscalls and alerts on suspicious behavior (CNCF graduated)', 'Tetragon uses eBPF to BLOCK malicious actions, not just detect', 'eBPF enables kernel-level observability with near-zero overhead', 'Detection without response is just monitoring - build the full incident pipeline'],
      whyThisMatters: 'All the identity, encryption, and policy controls in earlier modules prevent unauthorized access. But what about an authorized workload that gets compromised? Runtime security is the last line of defense - it detects and responds to threats that bypass all other controls.',
      commonMistakes: ['Running Falco without custom rules (defaults miss many threats)', 'Not integrating alerts with incident response workflows', 'Using Tetragon enforcement rules without thorough testing (can block legitimate operations)', 'Not preserving forensic evidence when responding to incidents'],
      glossary: [{ term: 'Falco', definition: 'CNCF runtime security tool that monitors syscalls for suspicious behavior' }, { term: 'Tetragon', definition: 'Cilium eBPF-based runtime enforcement engine' }, { term: 'eBPF', definition: 'Extended Berkeley Packet Filter - runs programs in the kernel sandbox' }, { term: 'Syscall', definition: 'System call - interface between user programs and the kernel' }],

      realWorldUseCases: ['Detecting cryptominers in production containers', 'Container escape attempt alerting', 'Runtime threat detection for compliance (PCI-DSS)', 'Automated incident response for security events'],
      operationalStory: 'A production cluster was running a cryptominer for 3 weeks before anyone noticed the CPU spike. After deploying Falco, the same behavior was detected within 30 seconds and the security team was alerted via PagerDuty. The compromised container was isolated automatically.',
      careerRelevance: 'Runtime security is the fastest-growing area of Kubernetes security. Falco and eBPF skills are increasingly listed in security engineering and SRE job descriptions.',},    {
      number: 11, title: 'Cloud Native Supply Chain Security', slug: 'supply-chain-security',
      subtitle: 'Sigstore, SLSA, SBOM, image signing, and provenance verification',
      duration: '3 hours',
      objectives: ['Understand supply chain attack vectors', 'Sign container images with Cosign', 'Verify image provenance with SLSA', 'Generate and analyze SBOMs for vulnerability tracking'],
      svgDiagram: '<svg viewBox="0 0 800 300" xmlns="http://www.w3.org/2000/svg"><rect width="800" height="300" fill="#0f172a" rx="12"/><text x="400" y="28" text-anchor="middle" fill="#94a3b8" font-size="14" font-weight="bold">SECURE SOFTWARE SUPPLY CHAIN</text><rect x="40" y="70" width="130" height="50" rx="8" fill="#1e293b" stroke="#3b82f6" stroke-width="2"/><text x="105" y="100" text-anchor="middle" fill="#93c5fd" font-size="10" font-weight="bold">Source Code</text><rect x="200" y="70" width="130" height="50" rx="8" fill="#1e293b" stroke="#a855f7" stroke-width="2"/><text x="265" y="95" text-anchor="middle" fill="#c084fc" font-size="10" font-weight="bold">Build (CI)</text><text x="265" y="110" text-anchor="middle" fill="#94a3b8" font-size="8">SLSA provenance</text><rect x="360" y="70" width="130" height="50" rx="8" fill="#1e293b" stroke="#f97316" stroke-width="2"/><text x="425" y="95" text-anchor="middle" fill="#fdba74" font-size="10" font-weight="bold">Sign (Cosign)</text><text x="425" y="110" text-anchor="middle" fill="#94a3b8" font-size="8">Keyless via OIDC</text><rect x="520" y="70" width="130" height="50" rx="8" fill="#1e293b" stroke="#22c55e" stroke-width="2"/><text x="585" y="95" text-anchor="middle" fill="#86efac" font-size="10" font-weight="bold">Registry</text><text x="585" y="110" text-anchor="middle" fill="#94a3b8" font-size="8">Signed + SBOM</text><rect x="680" y="70" width="90" height="50" rx="8" fill="#1e293b" stroke="#06b6d4" stroke-width="2"/><text x="725" y="95" text-anchor="middle" fill="#67e8f9" font-size="10" font-weight="bold">Deploy</text><text x="725" y="110" text-anchor="middle" fill="#94a3b8" font-size="8">Verify sig</text><line x1="170" y1="95" x2="200" y2="95" stroke="#94a3b8" stroke-width="1.5" marker-end="url(#a11)"/><line x1="330" y1="95" x2="360" y2="95" stroke="#94a3b8" stroke-width="1.5" marker-end="url(#a11)"/><line x1="490" y1="95" x2="520" y2="95" stroke="#94a3b8" stroke-width="1.5" marker-end="url(#a11)"/><line x1="650" y1="95" x2="680" y2="95" stroke="#94a3b8" stroke-width="1.5" marker-end="url(#a11)"/><rect x="40" y="170" width="730" height="100" rx="10" fill="#ef4444" fill-opacity="0.05" stroke="#ef4444" stroke-width="1"/><text x="400" y="195" text-anchor="middle" fill="#ef4444" font-size="11" font-weight="bold">Supply Chain Attack Vectors</text><text x="150" y="220" text-anchor="middle" fill="#94a3b8" font-size="9">Compromised dependency</text><text x="320" y="220" text-anchor="middle" fill="#94a3b8" font-size="9">Tampered build pipeline</text><text x="500" y="220" text-anchor="middle" fill="#94a3b8" font-size="9">Malicious base image</text><text x="670" y="220" text-anchor="middle" fill="#94a3b8" font-size="9">Registry poisoning</text><text x="400" y="250" text-anchor="middle" fill="#64748b" font-size="9">Every step from source to deployment is a potential attack point</text><defs><marker id="a11" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill="#94a3b8"/></marker></defs></svg>',
      content: `
        <p>You write secure code and deploy to a hardened cluster. But where did the container image come from? Was it built from the source you think? Were any dependencies compromised? Supply chain attacks target the path between source code and running container.</p>
        <h2>Sigstore: Sign Everything</h2>
        <p>Sigstore provides keyless signing via OIDC identity. Cosign signs container images. Rekor provides a transparency log of all signatures. Fulcio issues short-lived signing certificates tied to OIDC identity.</p>
        <pre><code># Sign a container image (keyless - uses your OIDC identity)
cosign sign ghcr.io/myorg/myapp:v1.2.3

# Verify the signature before deploying
cosign verify ghcr.io/myorg/myapp:v1.2.3

# In CI/CD: sign after build, verify before deploy
# No keys to manage! Identity-based signing via GitHub Actions OIDC</code></pre>
        <h2>SLSA: Build Provenance</h2>
        <p>SLSA (Supply-chain Levels for Software Artifacts) provides a framework for build integrity. It answers: WHERE was this artifact built? HOW was it built? CAN the build process be tampered with?</p>
        <h2>SBOM: Know What You Ship</h2>
        <p>A Software Bill of Materials lists every component in your container image. When a CVE is announced, you can instantly check which images are affected - instead of scanning everything.</p>
        <pre><code># Generate SBOM with Syft
syft ghcr.io/myorg/myapp:v1.2.3 -o spdx-json > sbom.json

# Scan SBOM for vulnerabilities with Grype
grype sbom:sbom.json</code></pre>
      `,
      labs: [
        { title: 'Sign and Verify Container Images', objective: 'Use Cosign for keyless image signing.', repoPath: 'module-11/lab-01', steps: ['Build a container image', 'Sign it with cosign sign (keyless)', 'Verify the signature with cosign verify', 'Configure admission controller to reject unsigned images'], duration: '30 min', difficulty: 'Intermediate' },
        { title: 'Generate and Analyze SBOMs', objective: 'Create SBOMs and scan for vulnerabilities.', repoPath: 'module-11/lab-02', steps: ['Generate SBOM with Syft for a production image', 'Scan the SBOM with Grype for known CVEs', 'Attach the SBOM to the image with cosign attach', 'Set up automated SBOM scanning in CI'], duration: '25 min', difficulty: 'Beginner' },
      ],
      keyTakeaways: ['Supply chain attacks target the build and distribution pipeline, not the running application', 'Cosign provides keyless image signing via OIDC - no keys to manage', 'SLSA framework ensures build provenance and integrity', 'SBOMs enable instant CVE impact analysis across all your images', 'Sign in CI, verify at admission - block unsigned images from deploying'],
      whyThisMatters: 'Supply chain attacks (SolarWinds, Log4j, codecov) are among the most devastating security incidents. They bypass all runtime security because the malicious code IS the application. Supply chain security ensures you only deploy what you built, from the source you trust.',
      commonMistakes: ['Not verifying image signatures before deployment', 'Using base images from untrusted registries', 'Not generating SBOMs - unable to assess CVE impact', 'Building images on developer machines instead of isolated CI runners'],
      glossary: [{ term: 'Sigstore', definition: 'Open-source project for signing, verifying, and protecting software' }, { term: 'Cosign', definition: 'Container image signing and verification tool' }, { term: 'SLSA', definition: 'Supply-chain Levels for Software Artifacts - build provenance framework' }, { term: 'SBOM', definition: 'Software Bill of Materials - inventory of components in an artifact' }, { term: 'Rekor', definition: 'Immutable transparency log for signing events' }],

      realWorldUseCases: ['Image signing in CI/CD pipelines', 'SBOM generation for vulnerability tracking', 'Admission control rejecting unsigned images', 'Compliance with US Executive Order 14028 (software supply chain security)'],
      operationalStory: 'When Log4Shell hit, teams without SBOMs spent days scanning every container image to find affected versions. Teams with SBOMs queried their inventory in minutes and patched within hours. The difference: days of uncertainty vs hours of response.',
      careerRelevance: 'Supply chain security is driven by regulatory pressure (US EO 14028, EU CRA). Engineers who understand Sigstore, SLSA, and SBOMs are ahead of regulatory requirements.',},    {
      number: 12, title: 'Secure CI/CD Pipelines', slug: 'secure-cicd-pipelines',
      subtitle: 'Harden GitHub Actions, protect secrets, isolate pipelines, and implement secure deployment workflows',
      duration: '3 hours',
      objectives: ['Identify CI/CD threat vectors', 'Harden GitHub Actions workflows', 'Implement pipeline isolation and secret scanning', 'Deploy securely with signed artifacts and workload identity'],
      svgDiagram: '<svg viewBox="0 0 800 280" xmlns="http://www.w3.org/2000/svg"><rect width="800" height="280" fill="#0f172a" rx="12"/><text x="400" y="28" text-anchor="middle" fill="#94a3b8" font-size="14" font-weight="bold">SECURE CI/CD PIPELINE</text><rect x="40" y="60" width="120" height="50" rx="8" fill="#1e293b" stroke="#3b82f6" stroke-width="2"/><text x="100" y="90" text-anchor="middle" fill="#93c5fd" font-size="10" font-weight="bold">Code Push</text><rect x="190" y="60" width="120" height="50" rx="8" fill="#1e293b" stroke="#a855f7" stroke-width="2"/><text x="250" y="85" text-anchor="middle" fill="#c084fc" font-size="10" font-weight="bold">Secret Scan</text><text x="250" y="100" text-anchor="middle" fill="#94a3b8" font-size="8">gitleaks/trufflehog</text><rect x="340" y="60" width="120" height="50" rx="8" fill="#1e293b" stroke="#eab308" stroke-width="2"/><text x="400" y="85" text-anchor="middle" fill="#eab308" font-size="10" font-weight="bold">Build + Test</text><text x="400" y="100" text-anchor="middle" fill="#94a3b8" font-size="8">Isolated runner</text><rect x="490" y="60" width="120" height="50" rx="8" fill="#1e293b" stroke="#f97316" stroke-width="2"/><text x="550" y="85" text-anchor="middle" fill="#fdba74" font-size="10" font-weight="bold">Sign + SBOM</text><text x="550" y="100" text-anchor="middle" fill="#94a3b8" font-size="8">Cosign + Syft</text><rect x="640" y="60" width="130" height="50" rx="8" fill="#1e293b" stroke="#22c55e" stroke-width="2"/><text x="705" y="85" text-anchor="middle" fill="#86efac" font-size="10" font-weight="bold">Deploy (OIDC)</text><text x="705" y="100" text-anchor="middle" fill="#94a3b8" font-size="8">No static secrets</text><line x1="160" y1="85" x2="190" y2="85" stroke="#94a3b8" stroke-width="1.5" marker-end="url(#a12)"/><line x1="310" y1="85" x2="340" y2="85" stroke="#94a3b8" stroke-width="1.5" marker-end="url(#a12)"/><line x1="460" y1="85" x2="490" y2="85" stroke="#94a3b8" stroke-width="1.5" marker-end="url(#a12)"/><line x1="610" y1="85" x2="640" y2="85" stroke="#94a3b8" stroke-width="1.5" marker-end="url(#a12)"/><rect x="40" y="150" width="730" height="100" rx="10" fill="#22c55e" fill-opacity="0.05" stroke="#22c55e" stroke-width="1"/><text x="400" y="175" text-anchor="middle" fill="#22c55e" font-size="11" font-weight="bold">Security Controls at Each Stage</text><text x="120" y="200" text-anchor="middle" fill="#94a3b8" font-size="9">Branch protection</text><text x="120" y="215" text-anchor="middle" fill="#94a3b8" font-size="9">Signed commits</text><text x="290" y="200" text-anchor="middle" fill="#94a3b8" font-size="9">Pre-commit hooks</text><text x="290" y="215" text-anchor="middle" fill="#94a3b8" font-size="9">Credential detection</text><text x="450" y="200" text-anchor="middle" fill="#94a3b8" font-size="9">Pinned actions</text><text x="450" y="215" text-anchor="middle" fill="#94a3b8" font-size="9">Minimal permissions</text><text x="610" y="200" text-anchor="middle" fill="#94a3b8" font-size="9">Image signing</text><text x="610" y="215" text-anchor="middle" fill="#94a3b8" font-size="9">OIDC auth (no secrets)</text><text x="400" y="240" text-anchor="middle" fill="#64748b" font-size="9">Every stage has controls. Compromise of one stage does not compromise the full pipeline.</text><defs><marker id="a12" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill="#94a3b8"/></marker></defs></svg>',
      content: `
        <p>CI/CD pipelines have privileged access to production systems. They pull source code, build artifacts, push to registries, and deploy to clusters. A compromised pipeline is a direct path to production compromise.</p>
        <h2>CI/CD Threat Vectors</h2>
        <ul>
          <li><strong>Poisoned pipeline execution:</strong> Malicious PR modifies workflow to exfiltrate secrets</li>
          <li><strong>Dependency confusion:</strong> Attacker publishes a package with the same name as an internal one</li>
          <li><strong>Leaked secrets:</strong> API keys printed in logs, exposed in artifacts, or committed to Git</li>
          <li><strong>Unpinned actions:</strong> Third-party GitHub Actions updated with malicious code</li>
          <li><strong>Over-permissioned runners:</strong> CI runners with cluster-admin access</li>
        </ul>
        <h2>Hardening GitHub Actions</h2>
        <pre><code># Secure GitHub Actions workflow
name: Secure Build
on:
  push:
    branches: [main]

permissions:
  contents: read        # Minimal! Not write
  packages: write       # Only for pushing images
  id-token: write       # For OIDC auth (no static secrets)

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4    # Pin to exact SHA in production
      - name: Secret Scan
        run: gitleaks detect --source . --verbose
      - name: Build
        run: docker build -t myapp .
      - name: Sign Image
        run: cosign sign ghcr.io/myorg/myapp:latest
      - name: Deploy via OIDC (no secrets!)
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::123:role/deploy
          aws-region: us-east-1
          # No AWS_ACCESS_KEY_ID! OIDC temporary credentials only</code></pre>
      `,
      labs: [
        { title: 'Harden a GitHub Actions Workflow', objective: 'Apply security best practices to a CI/CD pipeline.', repoPath: 'module-12/lab-01', steps: ['Audit an insecure workflow (over-permissioned, unpinned actions)', 'Add minimal permissions, pin action versions to SHA', 'Add secret scanning with gitleaks', 'Configure OIDC for deployment (eliminate static secrets)'], duration: '30 min', difficulty: 'Intermediate' },
        { title: 'Implement Secure Deployment Pipeline', objective: 'Build a pipeline that signs, scans, and deploys with verification.', repoPath: 'module-12/lab-02', steps: ['Build and sign images with Cosign in CI', 'Generate SBOM and scan for CVEs', 'Configure admission controller to reject unsigned images', 'Deploy using OIDC workload identity (zero static secrets)'], duration: '35 min', difficulty: 'Advanced' },
      ],
      keyTakeaways: ['CI/CD pipelines are high-value targets - they have production access', 'Use minimal permissions on every workflow - never write when read is enough', 'Pin all third-party actions to specific commit SHAs', 'Use OIDC for cloud authentication - eliminate all static secrets from CI', 'Sign every artifact in CI, verify every artifact before deploying'],
      whyThisMatters: 'A compromised CI/CD pipeline is the fastest path from attacker to production. Securing the pipeline secures the entire delivery chain - from source code to running workload.',
      commonMistakes: ['Using permissions: write-all in workflows', 'Storing cloud credentials as repository secrets instead of OIDC', 'Not scanning for leaked secrets before they reach the main branch', 'Using unpinned action versions (uses: actions/checkout@main instead of SHA)'],
      glossary: [{ term: 'OIDC', definition: 'OpenID Connect - used for keyless authentication from CI to cloud' }, { term: 'gitleaks', definition: 'Tool for detecting hardcoded secrets in Git repositories' }, { term: 'Branch Protection', definition: 'GitHub rules requiring reviews, status checks, and signed commits' }, { term: 'Pinned Actions', definition: 'Referencing GitHub Actions by commit SHA instead of mutable tags' }],

      realWorldUseCases: ['Hardening GitHub Actions for production deployments', 'OIDC-based cloud authentication (zero static secrets)', 'Secret scanning in pre-commit hooks', 'Secure artifact signing in CI pipelines'],
      operationalStory: 'A malicious PR modified a GitHub Actions workflow to exfiltrate repository secrets to an external server. The team had no workflow approval process and the PR was auto-merged. After adding branch protection, workflow approval, and OIDC auth, the attack vector was eliminated.',
      careerRelevance: 'CI/CD security is a growing specialization as DevSecOps becomes standard. Engineers who can harden pipelines are essential for any organization with continuous deployment.',},    {
      number: 13, title: 'Observability & Security Monitoring', slug: 'observability-security-monitoring',
      subtitle: 'OpenTelemetry, audit logging, distributed tracing, and security telemetry',
      duration: '3 hours',
      objectives: ['Build security-focused observability with OpenTelemetry', 'Configure Kubernetes audit logging', 'Correlate security events across services', 'Design dashboards for security posture monitoring'],
      svgDiagram: '<svg viewBox="0 0 800 280" xmlns="http://www.w3.org/2000/svg"><rect width="800" height="280" fill="#0f172a" rx="12"/><text x="400" y="28" text-anchor="middle" fill="#94a3b8" font-size="14" font-weight="bold">SECURITY TELEMETRY PIPELINE</text><rect x="40" y="65" width="160" height="50" rx="8" fill="#1e293b" stroke="#3b82f6" stroke-width="2"/><text x="120" y="95" text-anchor="middle" fill="#93c5fd" font-size="10" font-weight="bold">Workloads + K8s</text><rect x="250" y="55" width="160" height="70" rx="8" fill="#1e293b" stroke="#a855f7" stroke-width="2"/><text x="330" y="80" text-anchor="middle" fill="#c084fc" font-size="10" font-weight="bold">OpenTelemetry</text><text x="330" y="100" text-anchor="middle" fill="#94a3b8" font-size="8">Collector</text><text x="330" y="115" text-anchor="middle" fill="#94a3b8" font-size="8">traces + metrics + logs</text><rect x="460" y="55" width="110" height="40" rx="6" fill="#1e293b" stroke="#f97316"/><text x="515" y="80" text-anchor="middle" fill="#fdba74" font-size="10">Prometheus</text><rect x="460" y="105" width="110" height="40" rx="6" fill="#1e293b" stroke="#22c55e"/><text x="515" y="130" text-anchor="middle" fill="#86efac" font-size="10">Loki (Logs)</text><rect x="620" y="55" width="140" height="40" rx="6" fill="#1e293b" stroke="#06b6d4"/><text x="690" y="80" text-anchor="middle" fill="#67e8f9" font-size="10">Grafana</text><rect x="620" y="105" width="140" height="40" rx="6" fill="#1e293b" stroke="#eab308"/><text x="690" y="130" text-anchor="middle" fill="#eab308" font-size="10">AlertManager</text><line x1="200" y1="90" x2="250" y2="90" stroke="#94a3b8" stroke-width="1.5" marker-end="url(#a13)"/><line x1="410" y1="75" x2="460" y2="75" stroke="#94a3b8" stroke-width="1.5" marker-end="url(#a13)"/><line x1="410" y1="120" x2="460" y2="120" stroke="#94a3b8" stroke-width="1.5" marker-end="url(#a13)"/><line x1="570" y1="75" x2="620" y2="75" stroke="#94a3b8" stroke-width="1.5" marker-end="url(#a13)"/><line x1="570" y1="125" x2="620" y2="125" stroke="#94a3b8" stroke-width="1.5" marker-end="url(#a13)"/><rect x="40" y="175" width="730" height="75" rx="10" fill="#22c55e" fill-opacity="0.05" stroke="#22c55e" stroke-width="1"/><text x="400" y="200" text-anchor="middle" fill="#22c55e" font-size="11" font-weight="bold">Key Security Metrics</text><text x="130" y="225" text-anchor="middle" fill="#94a3b8" font-size="9">Failed auth attempts</text><text x="290" y="225" text-anchor="middle" fill="#94a3b8" font-size="9">SVID rotation stalls</text><text x="450" y="225" text-anchor="middle" fill="#94a3b8" font-size="9">Policy violations</text><text x="600" y="225" text-anchor="middle" fill="#94a3b8" font-size="9">Falco alerts rate</text><text x="720" y="225" text-anchor="middle" fill="#94a3b8" font-size="9">Anomalous traffic</text><defs><marker id="a13" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill="#94a3b8"/></marker></defs></svg>',
      content: `
        <p>Security without visibility is flying blind. You need to know: who accessed what, when, whether SVID rotation is healthy, how many policy violations occurred, and whether any runtime alerts were triggered. Security observability connects all your security controls into a unified monitoring layer.</p>
        <h2>Kubernetes Audit Logging</h2>
        <p>Audit logs capture every API request: who made it, what was requested, and what was the result. Critical for compliance (SOC 2, PCI-DSS) and incident investigation.</p>
        <pre><code># Audit policy: log all authentication failures and secret access
apiVersion: audit.k8s.io/v1
kind: Policy
rules:
  - level: Metadata
    resources:
      - group: ""
        resources: ["secrets"]
    verbs: ["get", "list", "watch"]
  - level: RequestResponse
    users: ["system:anonymous"]
  - level: Metadata
    verbs: ["create", "delete", "patch"]</code></pre>
        <h2>OpenTelemetry for Security</h2>
        <p>OpenTelemetry collects traces, metrics, and logs from all services. For security, this means: correlating authentication events with service behavior, tracking SVID rotation health, monitoring policy decision latency, and tracing request flows across mTLS boundaries.</p>
        <h2>Security Dashboards</h2>
        <p>Essential Grafana dashboards: authentication failures over time, SVID rotation success rate, policy violations by namespace, runtime alerts (Falco/Tetragon), certificate expiry countdown, and API server audit log analysis.</p>
      `,
      labs: [
        { title: 'Build Security Dashboards', objective: 'Create Grafana dashboards for security posture monitoring.', repoPath: 'module-13/lab-01', steps: ['Deploy Prometheus, Loki, and Grafana', 'Configure security metric scraping (SPIRE, Falco, OPA)', 'Build dashboards for auth failures, SVID rotation, policy violations', 'Set up alerts for security-critical thresholds'], duration: '35 min', difficulty: 'Intermediate' },
        { title: 'Kubernetes Audit Log Analysis', objective: 'Enable and analyze audit logs for security investigation.', repoPath: 'module-13/lab-02', steps: ['Configure API server audit policy', 'Generate events (access secrets, create roles)', 'Search audit logs for suspicious patterns', 'Correlate audit events with application traces'], duration: '25 min', difficulty: 'Intermediate' },
      ],
      keyTakeaways: ['Security observability connects all controls into unified monitoring', 'Kubernetes audit logs are essential for compliance and incident investigation', 'OpenTelemetry provides the collection layer for security telemetry', 'Dashboard the security posture: auth failures, SVID health, policy violations, runtime alerts', 'Alert on security metrics - do not wait for incidents to discover monitoring gaps'],
      whyThisMatters: 'You have deployed identity, encryption, policy, and runtime security. But are they working? Observability tells you. Without it, you only discover problems after the breach.',
      glossary: [{ term: 'Audit Log', definition: 'Kubernetes record of every API request - who, what, when, result' }, { term: 'OpenTelemetry', definition: 'CNCF observability framework for traces, metrics, and logs' }, { term: 'SIEM', definition: 'Security Information and Event Management - centralized security log analysis' }],

      realWorldUseCases: ['Security dashboards for SOC teams', 'Kubernetes audit log analysis for compliance', 'Correlating Falco alerts with application traces', 'SIEM integration for centralized security monitoring'],
      operationalStory: 'A security team discovered a privilege escalation attempt only after reviewing audit logs 2 weeks later. After deploying real-time alerting on audit events, the same pattern was caught in under 5 minutes.',
      careerRelevance: 'Security observability bridges the gap between security engineering and SRE. Engineers who can build security dashboards and alerting are valuable across both disciplines.',},    {
      number: 14, title: 'Multi-Cluster & Multi-Cloud Security', slug: 'multi-cluster-multi-cloud-security',
      subtitle: 'Federation, cross-cloud identity, hybrid infrastructure, and trust boundaries at scale',
      duration: '3 hours',
      objectives: ['Design trust boundaries for multi-cluster deployments', 'Implement SPIFFE federation across clusters and clouds', 'Secure hybrid infrastructure (Kubernetes + VMs)', 'Plan cross-cloud identity portability'],
      svgDiagram: '<svg viewBox="0 0 800 280" xmlns="http://www.w3.org/2000/svg"><rect width="800" height="280" fill="#0f172a" rx="12"/><text x="400" y="28" text-anchor="middle" fill="#94a3b8" font-size="14" font-weight="bold">MULTI-CLUSTER FEDERATED TRUST</text><rect x="30" y="55" width="230" height="180" rx="10" fill="none" stroke="#3b82f6" stroke-width="2"/><text x="145" y="78" text-anchor="middle" fill="#3b82f6" font-size="11" font-weight="bold">AWS Cluster</text><rect x="50" y="90" width="190" height="35" rx="5" fill="#1e293b" stroke="#a855f7"/><text x="145" y="112" text-anchor="middle" fill="#c084fc" font-size="9">SPIRE Server (aws.company.org)</text><rect x="60" y="140" width="80" height="30" rx="4" fill="#1e293b" stroke="#22c55e"/><text x="100" y="160" text-anchor="middle" fill="#86efac" font-size="8">Service A</text><rect x="150" y="140" width="80" height="30" rx="4" fill="#1e293b" stroke="#22c55e"/><text x="190" y="160" text-anchor="middle" fill="#86efac" font-size="8">Service B</text><rect x="285" y="55" width="230" height="180" rx="10" fill="none" stroke="#f97316" stroke-width="2"/><text x="400" y="78" text-anchor="middle" fill="#f97316" font-size="11" font-weight="bold">GCP Cluster</text><rect x="305" y="90" width="190" height="35" rx="5" fill="#1e293b" stroke="#a855f7"/><text x="400" y="112" text-anchor="middle" fill="#c084fc" font-size="9">SPIRE Server (gcp.company.org)</text><rect x="315" y="140" width="80" height="30" rx="4" fill="#1e293b" stroke="#22c55e"/><text x="355" y="160" text-anchor="middle" fill="#86efac" font-size="8">Service C</text><rect x="405" y="140" width="80" height="30" rx="4" fill="#1e293b" stroke="#22c55e"/><text x="445" y="160" text-anchor="middle" fill="#86efac" font-size="8">Service D</text><rect x="540" y="55" width="230" height="180" rx="10" fill="none" stroke="#22c55e" stroke-width="2"/><text x="655" y="78" text-anchor="middle" fill="#22c55e" font-size="11" font-weight="bold">On-Prem VMs</text><rect x="560" y="90" width="190" height="35" rx="5" fill="#1e293b" stroke="#a855f7"/><text x="655" y="112" text-anchor="middle" fill="#c084fc" font-size="9">SPIRE Server (onprem.company.org)</text><rect x="570" y="140" width="80" height="30" rx="4" fill="#1e293b" stroke="#22c55e"/><text x="610" y="160" text-anchor="middle" fill="#86efac" font-size="8">Legacy API</text><rect x="660" y="140" width="80" height="30" rx="4" fill="#1e293b" stroke="#22c55e"/><text x="700" y="160" text-anchor="middle" fill="#86efac" font-size="8">Database</text><path d="M220 107 L305 107" stroke="#eab308" stroke-width="2.5" stroke-dasharray="6,3"/><path d="M475 107 L560 107" stroke="#eab308" stroke-width="2.5" stroke-dasharray="6,3"/><text x="262" y="100" text-anchor="middle" fill="#eab308" font-size="8">Federation</text><text x="517" y="100" text-anchor="middle" fill="#eab308" font-size="8">Federation</text><text x="400" y="260" text-anchor="middle" fill="#64748b" font-size="9">Three trust domains, federated. Services in any domain can verify identities from any other.</text></svg>',
      content: `
        <p>Most organizations eventually outgrow a single cluster. Multi-cluster, multi-cloud, and hybrid deployments introduce trust boundary challenges that single-cluster security models cannot handle.</p>
        <h2>Trust Domain Design</h2>
        <p>Each cluster or cloud region gets its own SPIFFE trust domain. Trust domains are federated by exchanging trust bundles. Services in any domain can verify SVIDs from any federated domain.</p>
        <h2>Cross-Cloud Identity</h2>
        <p>SPIFFE identity is cloud-agnostic. A service running on AWS can verify the identity of a service running on GCP - if both trust domains are federated. No cloud IAM roles, no cloud-specific tokens, just SPIFFE SVIDs.</p>
        <h2>Hybrid Infrastructure</h2>
        <p>SPIRE supports both Kubernetes and VM workloads. Kubernetes uses k8s_psat attestation, VMs use AWS IID, Azure MSI, or join token attestation. Both participate in the same trust domain and can verify each other.</p>
        <h2>Trust Boundaries</h2>
        <ul>
          <li><strong>Within a trust domain:</strong> All workloads share the same CA. Any registered workload can get an SVID. Identity is verified locally by the SPIRE Agent.</li>
          <li><strong>Across trust domains:</strong> Federation via bundle exchange. Identity verification requires the remote trust bundle. More controlled - you choose which domains to federate with.</li>
          <li><strong>Between organizations:</strong> Separate trust domains with explicit federation. Full organizational boundary isolation.</li>
        </ul>
      `,
      labs: [
        { title: 'Federated Trust Across Two Clusters', objective: 'Deploy SPIRE on two clusters and federate them.', repoPath: 'module-14/lab-01', steps: ['Create two Kind clusters', 'Deploy SPIRE on each with different trust domains', 'Exchange trust bundles', 'Deploy services and verify cross-cluster mTLS'], duration: '45 min', difficulty: 'Advanced' },
      ],
      keyTakeaways: ['Each cluster/cloud gets its own trust domain - federate to enable cross-domain trust', 'SPIFFE identity is cloud-agnostic - works across AWS, GCP, Azure, and on-prem', 'Trust boundaries should align with organizational boundaries', 'Federation is explicit - you choose which domains to trust', 'Hybrid identity (K8s + VMs) works with different attestation plugins in the same domain'],
      whyThisMatters: 'Most production environments span multiple clusters, clouds, or data centers. Multi-cluster security is not an advanced topic - it is the reality of modern infrastructure. This module teaches you to design trust boundaries and implement federation for real-world deployments.',
      commonMistakes: ['Using one trust domain for everything (no blast radius isolation)', 'Not planning trust domain names before deployment (hard to rename)', 'Federating without understanding the security implications (full trust of remote domain)', 'Different security policies across clusters without coordination'],
      glossary: [{ term: 'Trust Domain', definition: 'Root of trust identified by a domain name, corresponding to one SPIRE Server' }, { term: 'Federation', definition: 'Cross-trust-domain trust via bundle exchange' }, { term: 'Trust Bundle', definition: 'CA certificates used to verify SVIDs from a trust domain' }, { term: 'Hybrid Infrastructure', definition: 'Mix of Kubernetes, VMs, and cloud services in one architecture' }],

      realWorldUseCases: ['Multi-cluster identity for global deployments', 'Cross-cloud trust between AWS and GCP', 'Hybrid identity for Kubernetes + VM workloads', 'Organizational mergers requiring trust domain federation'],
      operationalStory: 'A global company expanded from 2 to 8 Kubernetes clusters across 3 clouds. Each cluster had its own identity system - separate Vault instances, separate CAs. After deploying federated SPIRE, all clusters shared trust automatically. Cross-cluster service calls dropped from 500ms (token exchange) to 5ms (direct mTLS).',
      careerRelevance: 'Multi-cloud and multi-cluster architectures are the reality for most enterprises. Engineers who can design trust boundaries and implement federation are essential for platform teams at scale.',},    {
      number: 15, title: 'AI Infrastructure Security', slug: 'ai-infrastructure-security',
      subtitle: 'Securing AI agents, LLM endpoints, MCP servers, vector databases, and inference pipelines',
      duration: '3 hours',
      objectives: ['Understand AI infrastructure threat landscape', 'Implement workload identity for AI agents', 'Secure MCP servers and vector databases with mTLS', 'Design identity-aware AI access control policies'],
      svgDiagram: '<svg viewBox="0 0 800 300" xmlns="http://www.w3.org/2000/svg"><rect width="800" height="300" fill="#0f172a" rx="12"/><text x="400" y="28" text-anchor="middle" fill="#94a3b8" font-size="14" font-weight="bold">AI INFRASTRUCTURE SECURITY</text><rect x="40" y="60" width="150" height="55" rx="8" fill="#1e293b" stroke="#a855f7" stroke-width="2"/><text x="115" y="82" text-anchor="middle" fill="#c084fc" font-size="10" font-weight="bold">AI Agent</text><text x="115" y="100" text-anchor="middle" fill="#94a3b8" font-size="8">SPIFFE ID: /ai/agent</text><rect x="230" y="60" width="150" height="55" rx="8" fill="#1e293b" stroke="#3b82f6" stroke-width="2"/><text x="305" y="82" text-anchor="middle" fill="#93c5fd" font-size="10" font-weight="bold">LLM Service</text><text x="305" y="100" text-anchor="middle" fill="#94a3b8" font-size="8">SPIFFE ID: /ai/llm</text><rect x="420" y="60" width="150" height="55" rx="8" fill="#1e293b" stroke="#22c55e" stroke-width="2"/><text x="495" y="82" text-anchor="middle" fill="#86efac" font-size="10" font-weight="bold">Vector DB</text><text x="495" y="100" text-anchor="middle" fill="#94a3b8" font-size="8">SPIFFE ID: /ai/vectordb</text><rect x="610" y="60" width="150" height="55" rx="8" fill="#1e293b" stroke="#f97316" stroke-width="2"/><text x="685" y="82" text-anchor="middle" fill="#fdba74" font-size="10" font-weight="bold">MCP Server</text><text x="685" y="100" text-anchor="middle" fill="#94a3b8" font-size="8">SPIFFE ID: /ai/mcp</text><line x1="190" y1="87" x2="230" y2="87" stroke="#22c55e" stroke-width="2"/><line x1="380" y1="87" x2="420" y2="87" stroke="#22c55e" stroke-width="2"/><line x1="570" y1="87" x2="610" y2="87" stroke="#22c55e" stroke-width="2"/><text x="400" y="145" text-anchor="middle" fill="#22c55e" font-size="10" font-weight="bold">All connections secured with mTLS via SPIFFE SVIDs</text><rect x="40" y="165" width="720" height="110" rx="10" fill="#ef4444" fill-opacity="0.05" stroke="#ef4444" stroke-width="1"/><text x="400" y="190" text-anchor="middle" fill="#ef4444" font-size="11" font-weight="bold">AI Infrastructure Threats</text><text x="130" y="215" text-anchor="middle" fill="#94a3b8" font-size="9">Unauthorized model access</text><text x="310" y="215" text-anchor="middle" fill="#94a3b8" font-size="9">Prompt injection</text><text x="480" y="215" text-anchor="middle" fill="#94a3b8" font-size="9">Data exfiltration via agent</text><text x="660" y="215" text-anchor="middle" fill="#94a3b8" font-size="9">MCP tool abuse</text><text x="130" y="240" text-anchor="middle" fill="#94a3b8" font-size="9">Vector DB poisoning</text><text x="310" y="240" text-anchor="middle" fill="#94a3b8" font-size="9">Model theft</text><text x="480" y="240" text-anchor="middle" fill="#94a3b8" font-size="9">Agent impersonation</text><text x="660" y="240" text-anchor="middle" fill="#94a3b8" font-size="9">Inference endpoint abuse</text><text x="400" y="265" text-anchor="middle" fill="#64748b" font-size="9">Identity + authorization prevent most AI infrastructure attacks</text></svg>',
      content: `
        <p>AI infrastructure introduces new attack surfaces. AI agents make autonomous decisions and call external tools. LLM endpoints are expensive - unauthorized access costs real money. Vector databases contain sensitive embeddings. MCP servers expose powerful capabilities. All of these need the same workload identity and authorization that traditional microservices require.</p>
        <h2>The AI Security Problem</h2>
        <p>Most AI infrastructure today uses shared API keys. One key for all agents accessing the LLM. One key for the vector database. No distinction between a customer support agent and a code review agent. If one key leaks, all AI capabilities are compromised.</p>
        <h2>SPIFFE for AI Agents</h2>
        <p>Each AI agent gets its own SPIFFE ID. OPA policies control which agents can access which models, tools, and databases. Every interaction is authenticated and auditable.</p>
        <pre><code># AI Agent SPIFFE IDs:
spiffe://ai.company.org/agent/customer-support/v2
spiffe://ai.company.org/agent/code-review/v1
spiffe://ai.company.org/pipeline/training/job-abc

# OPA Policy: customer-support can query LLM but not train models
allow {
  input.source == "spiffe://ai.company.org/agent/customer-support/v2"
  input.target == "spiffe://ai.company.org/service/llm-proxy"
  input.method == "POST"
  input.path == "/v1/chat/completions"
}</code></pre>
        <h2>Securing MCP Servers</h2>
        <p>Model Context Protocol (MCP) servers give AI agents access to tools - file systems, databases, APIs. Without identity, any process can call MCP tools. With SPIFFE, only verified agents can access specific MCP servers based on their identity and OPA policies.</p>
        <h2>Vector Database Access Control</h2>
        <p>Vector databases store embeddings of sensitive documents. mTLS with SPIFFE ensures only authorized services can query or write to the vector database. OPA policies can further restrict: read-only for query agents, write access only for training pipelines.</p>
      `,
      labs: [
        { title: 'Secure AI Agent Communication', objective: 'Deploy AI agents with SPIFFE identities and OPA policies.', repoPath: 'module-15/lab-01', steps: ['Deploy simulated AI agent with SPIFFE identity', 'Deploy LLM mock service with SPIFFE identity', 'Configure mTLS between agent and LLM', 'Add OPA policy: only authorized agents can invoke the LLM'], duration: '35 min', difficulty: 'Advanced' },
        { title: 'Identity-Aware AI API Access', objective: 'Restrict AI service access based on agent identity.', repoPath: 'module-15/lab-02', steps: ['Register multiple AI agents with different SPIFFE IDs', 'Create OPA policies: support agent = read-only, training pipeline = full access', 'Test enforcement with different agent identities', 'Audit access logs with verified SPIFFE IDs'], duration: '30 min', difficulty: 'Advanced' },
      ],
      keyTakeaways: ['AI agents are workloads - they need cryptographic identity, not shared API keys', 'SPIFFE secures agent-to-LLM, agent-to-tool, and agent-to-database communication', 'MCP servers should verify agent identity before granting tool access', 'OPA policies enable fine-grained AI access control (read vs write, model access by agent role)', 'The zero trust skills from earlier modules apply directly to AI infrastructure'],
      whyThisMatters: 'AI infrastructure is the next frontier for security engineering. As AI agents become more autonomous, the blast radius of a compromised agent grows. Engineers who understand workload identity for AI systems today are positioning themselves for the most in-demand security roles of tomorrow.',
      beforeAfter: { before: ['Shared API keys for all AI agents', 'No distinction between agent roles', 'Unencrypted agent-to-service traffic', 'No audit trail for AI tool access'], after: ['Unique SPIFFE identity per AI agent', 'OPA policies per agent role', 'mTLS between agents and services', 'Complete audit trail with verified identity'] },
      glossary: [{ term: 'MCP', definition: 'Model Context Protocol - standard for AI agents to access tools and data' }, { term: 'Vector Database', definition: 'Database optimized for storing and searching high-dimensional embeddings' }, { term: 'LLM', definition: 'Large Language Model - AI model for text generation and reasoning' }, { term: 'AI Agent', definition: 'Autonomous AI system that makes decisions and takes actions' }],

      realWorldUseCases: ['AI agent identity for autonomous systems', 'Securing MCP server access with workload identity', 'Vector database access control with mTLS', 'LLM endpoint cost protection via identity-based rate limiting'],
      operationalStory: 'A company running 20 AI agents with a single shared API key discovered that a compromised agent was making 10,000 LLM calls per hour - costing $500/day. After deploying SPIFFE with per-agent identity and OPA rate limiting, the rogue agent was blocked within seconds.',
      careerRelevance: 'AI infrastructure security is an emerging discipline with very few practitioners. Engineers who understand both workload identity and AI systems are uniquely positioned for the next wave of platform engineering roles.',},    {
      number: 16, title: 'Production Architecture & Capstone', slug: 'production-architecture-capstone',
      subtitle: 'Build a production-grade cloud-native security platform combining all five pillars',
      duration: '5 hours',
      objectives: ['Design an end-to-end production security architecture', 'Deploy the complete cloud-native security stack', 'Implement all five pillars: identity, zero trust, policy, runtime, supply chain', 'Test with attack simulations and verify containment'],
      svgDiagram: '<svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg"><rect width="800" height="400" fill="#0f172a" rx="12"/><text x="400" y="25" text-anchor="middle" fill="#94a3b8" font-size="14" font-weight="bold">PRODUCTION CLOUD NATIVE SECURITY PLATFORM</text><rect x="250" y="40" width="300" height="35" rx="6" fill="#a855f7" fill-opacity="0.15" stroke="#a855f7" stroke-width="1.5"/><text x="400" y="62" text-anchor="middle" fill="#c084fc" font-size="11" font-weight="bold">SPIRE Server (HA) + Controller Manager</text><rect x="30" y="95" width="740" height="275" rx="10" fill="none" stroke="#3b82f6" stroke-width="1.5" stroke-dasharray="5,3"/><text x="60" y="115" fill="#3b82f6" font-size="10" font-weight="bold">Kubernetes Cluster</text><rect x="50" y="130" width="160" height="50" rx="6" fill="#1e293b" stroke="#22c55e"/><text x="130" y="150" text-anchor="middle" fill="#86efac" font-size="9">Frontend + Envoy</text><text x="130" y="165" text-anchor="middle" fill="#64748b" font-size="8">mTLS + SVID</text><rect x="230" y="130" width="160" height="50" rx="6" fill="#1e293b" stroke="#22c55e"/><text x="310" y="150" text-anchor="middle" fill="#86efac" font-size="9">API + Envoy</text><text x="310" y="165" text-anchor="middle" fill="#64748b" font-size="8">mTLS + SVID</text><rect x="410" y="130" width="160" height="50" rx="6" fill="#1e293b" stroke="#22c55e"/><text x="490" y="150" text-anchor="middle" fill="#86efac" font-size="9">Database + Envoy</text><text x="490" y="165" text-anchor="middle" fill="#64748b" font-size="8">mTLS + SVID</text><rect x="590" y="130" width="160" height="50" rx="6" fill="#1e293b" stroke="#22c55e"/><text x="670" y="150" text-anchor="middle" fill="#86efac" font-size="9">AI Agent + Envoy</text><text x="670" y="165" text-anchor="middle" fill="#64748b" font-size="8">mTLS + SVID</text><rect x="50" y="200" width="160" height="40" rx="5" fill="#1e293b" stroke="#f97316"/><text x="130" y="225" text-anchor="middle" fill="#fdba74" font-size="9">OPA Gatekeeper</text><rect x="230" y="200" width="160" height="40" rx="5" fill="#1e293b" stroke="#ef4444"/><text x="310" y="225" text-anchor="middle" fill="#fca5a5" font-size="9">Falco + Tetragon</text><rect x="410" y="200" width="160" height="40" rx="5" fill="#1e293b" stroke="#eab308"/><text x="490" y="225" text-anchor="middle" fill="#eab308" font-size="9">Vault (Secrets)</text><rect x="590" y="200" width="160" height="40" rx="5" fill="#1e293b" stroke="#06b6d4"/><text x="670" y="225" text-anchor="middle" fill="#67e8f9" font-size="9">Sigstore (Images)</text><rect x="50" y="260" width="340" height="40" rx="5" fill="#1e293b" stroke="#a855f7"/><text x="220" y="285" text-anchor="middle" fill="#c084fc" font-size="9">OpenTelemetry Collector + Prometheus + Grafana</text><rect x="410" y="260" width="340" height="40" rx="5" fill="#1e293b" stroke="#3b82f6"/><text x="580" y="285" text-anchor="middle" fill="#93c5fd" font-size="9">SPIRE Agents (DaemonSet) + CSI Driver</text><rect x="50" y="320" width="700" height="40" rx="6" fill="#22c55e" fill-opacity="0.1" stroke="#22c55e" stroke-width="1.5"/><text x="400" y="340" text-anchor="middle" fill="#22c55e" font-size="10" font-weight="bold">All Five Pillars: Identity + Zero Trust + Policy + Runtime + Supply Chain</text><text x="400" y="355" text-anchor="middle" fill="#64748b" font-size="9">Production-grade. Battle-tested. Your reference architecture.</text></svg>',
      content: `
        <p>This is the capstone. You will build a production-grade cloud-native security platform that combines everything from the previous 15 modules into one integrated architecture. By the end, you will have a complete reference implementation that you can adapt for your organization.</p>
        <h2>What You Will Build</h2>
        <ol>
          <li><strong>SPIRE (Identity):</strong> HA deployment with auto-registration and federation</li>
          <li><strong>Envoy + Istio (Zero Trust):</strong> Transparent mTLS for all service communication</li>
          <li><strong>OPA Gatekeeper + Kyverno (Policy):</strong> Admission control blocking insecure deployments</li>
          <li><strong>Falco + Tetragon (Runtime):</strong> Real-time threat detection and enforcement</li>
          <li><strong>Sigstore + SBOM (Supply Chain):</strong> Image signing and vulnerability tracking</li>
          <li><strong>Vault (Secrets):</strong> Dynamic credentials with SPIFFE authentication</li>
          <li><strong>OpenTelemetry + Grafana (Observability):</strong> Security dashboards and alerting</li>
        </ol>
        <h2>Architecture Decisions</h2>
        <p>Document your choices: trust domain naming schema, SPIFFE ID path convention, SVID TTL, policy enforcement mode, runtime detection rules, image signing workflow, monitoring thresholds, and incident response procedures.</p>
        <h2>Attack Simulation</h2>
        <p>After deployment, simulate attacks to verify your security controls work:</p>
        <ul>
          <li>Deploy a rogue pod - verify it gets no SVID (identity layer)</li>
          <li>Attempt unauthorized API access - verify OPA denies it (policy layer)</li>
          <li>Spawn a shell in a container - verify Falco alerts (runtime layer)</li>
          <li>Deploy an unsigned image - verify Gatekeeper rejects it (supply chain layer)</li>
          <li>Access a service without mTLS - verify Envoy rejects it (zero trust layer)</li>
        </ul>
        <h2>What This Proves</h2>
        <p>When you complete this capstone, you can demonstrate: production-grade Kubernetes security, five-pillar defense in depth, attack simulation and containment, security observability and incident response, and architecture documentation for stakeholder review.</p>
      `,
      labs: [
        { title: 'Capstone: Production Cloud Native Security Platform', objective: 'Deploy the complete security stack end-to-end.', repoPath: 'module-16/capstone', steps: ['Create a Kind cluster with 3 worker nodes', 'Deploy SPIRE Server (HA) and Agents', 'Deploy application with Envoy sidecars and mTLS', 'Deploy OPA Gatekeeper + Kyverno policies', 'Deploy Falco + Tetragon for runtime detection', 'Configure Vault with SPIFFE authentication', 'Set up image signing with Cosign', 'Deploy OpenTelemetry + Prometheus + Grafana', 'Run attack simulations and verify containment', 'Document architecture decisions'], duration: '3 hours', difficulty: 'Advanced' },
      ],
      keyTakeaways: ['Five pillars working together: identity, zero trust, policy, runtime, supply chain', 'Each pillar catches threats the others miss - defense in depth', 'Attack simulation proves your controls work - do not assume', 'Document architecture decisions - they are your organizational security standard', 'This reference architecture is your template for production deployments'],
      whyThisMatters: 'This capstone is your proof of competence. Building a complete security platform end-to-end demonstrates that you can architect, deploy, and operate production security infrastructure - not just follow tutorials. This is what you put on your resume, discuss in interviews, and present to your engineering leadership.',
      thinkLikeAnEngineer: ['How would you present this architecture to a CISO for approval?', 'What is the total compute overhead of the full security stack?', 'Which pillar would you deploy first for maximum security impact?', 'How would you measure the ROI of this security investment?'],
      operationalStory: 'A startup grew from 10 to 200 microservices in 18 months. At 50 services, they added SPIRE for workload identity. At 100, they added Envoy for mTLS. At 150, they added OPA for authorization. At 200, they added Falco for runtime detection. Each layer was deployed incrementally, validated independently, and integrated progressively. The full stack now catches security issues that no single tool could detect alone - from unauthorized access to runtime exploitation to supply chain compromise.',
      glossary: [{ term: 'Defense in Depth', definition: 'Multiple overlapping security layers so failure of one does not compromise the system' }, { term: 'Blast Radius', definition: 'The scope of damage a security incident can cause' }, { term: 'Reference Architecture', definition: 'Documented, tested architecture pattern for organizational adoption' }, { term: 'Five Pillars', definition: 'Identity, Zero Trust, Policy, Runtime, Supply Chain - complete cloud-native security' }],

      realWorldUseCases: ['Building production-grade security platforms', 'Architecture design for security compliance', 'Attack simulation and penetration testing', 'Security architecture documentation for stakeholder review'],
      careerRelevance: 'Engineers who can architect complete security platforms - not just individual tools - are the most valuable security hires. This capstone proves you can design, deploy, and operate the full stack.',},    ],
  };
