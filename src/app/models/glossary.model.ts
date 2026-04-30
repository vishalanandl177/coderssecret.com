export interface GlossaryEntry {
  slug: string;
  term: string;
  title: string;
  description: string;
  content: string;
  relatedCourses?: { slug: string; title: string }[];
  relatedTerms?: string[];
  category: 'identity' | 'kubernetes' | 'security' | 'policy' | 'observability' | 'ai';
}

export const GLOSSARY: GlossaryEntry[] = [
  {
    slug: 'spiffe', term: 'SPIFFE', category: 'identity',
    title: 'What is SPIFFE? Secure Production Identity Framework Explained',
    description: 'SPIFFE (Secure Production Identity Framework For Everyone) is a CNCF standard that defines how workloads identify themselves using cryptographic certificates, independent of network location.',
    relatedCourses: [{ slug: 'mastering-spiffe-spire', title: 'Mastering SPIFFE & SPIRE' }],
    relatedTerms: ['spire', 'svid', 'workload-identity', 'zero-trust', 'mtls'],
    content: `
      <h1>What is SPIFFE?</h1>
      <p><strong>SPIFFE</strong> (Secure Production Identity Framework For Everyone) is a set of open standards, backed by the <a href="https://www.cncf.io/">CNCF</a>, that define how workloads identify themselves to each other in distributed systems.</p>
      <h2>The Problem SPIFFE Solves</h2>
      <p>In cloud-native systems, services need to prove their identity to each other. Traditional approaches — shared secrets, API keys, IP-based trust — break in environments where containers are ephemeral, IPs change constantly, and workloads span multiple clouds. SPIFFE provides a universal, cryptographic identity framework that works everywhere.</p>
      <h2>How SPIFFE Works</h2>
      <ul>
        <li><strong>Trust Domain:</strong> The root of trust (e.g., <code>spiffe://company.org</code>)</li>
        <li><strong>SPIFFE ID:</strong> A URI uniquely identifying a workload (e.g., <code>spiffe://company.org/ns/prod/sa/api</code>)</li>
        <li><strong>SVID:</strong> A verifiable identity document — either an X.509 certificate (for mTLS) or a JWT token (for HTTP APIs)</li>
        <li><strong>Workload API:</strong> Unix domain socket where workloads request their identity — no credentials needed</li>
      </ul>
      <h2>SPIFFE vs Other Approaches</h2>
      <table><thead><tr><th>Feature</th><th>SPIFFE</th><th>K8s Service Accounts</th><th>Vault PKI</th></tr></thead><tbody>
        <tr><td>Cross-cluster</td><td>Yes (federation)</td><td>No</td><td>Manual</td></tr>
        <tr><td>Auto rotation</td><td>Yes</td><td>Partial</td><td>Yes (with agent)</td></tr>
        <tr><td>mTLS ready</td><td>Yes (X.509-SVID)</td><td>No</td><td>Yes</td></tr>
        <tr><td>Open standard</td><td>CNCF</td><td>K8s-only</td><td>Proprietary</td></tr>
      </tbody></table>
      <h2>Learn SPIFFE</h2>
      <p>Our free <a href="/courses/mastering-spiffe-spire">Mastering SPIFFE & SPIRE</a> course covers SPIFFE from fundamentals to production federation across 13 modules with 30+ hands-on labs.</p>
    `,
  },
  {
    slug: 'spire', term: 'SPIRE', category: 'identity',
    title: 'What is SPIRE? SPIFFE Runtime Environment Explained',
    description: 'SPIRE is the production implementation of the SPIFFE specification — a CNCF graduated project that automatically issues, rotates, and manages cryptographic workload identities.',
    relatedCourses: [{ slug: 'mastering-spiffe-spire', title: 'Mastering SPIFFE & SPIRE' }],
    relatedTerms: ['spiffe', 'svid', 'workload-identity', 'attestation'],
    content: `
      <h1>What is SPIRE?</h1>
      <p><strong>SPIRE</strong> (SPIFFE Runtime Environment) is the reference implementation of the <a href="/glossary/spiffe">SPIFFE</a> specification. It is a CNCF graduated project used by Bloomberg, Uber, Pinterest, and ByteDance at massive scale.</p>
      <h2>SPIRE Architecture</h2>
      <ul>
        <li><strong>SPIRE Server:</strong> Central control plane that manages registrations, signs SVIDs, and maintains the trust bundle. Runs as a Kubernetes StatefulSet.</li>
        <li><strong>SPIRE Agent:</strong> Runs on every node (DaemonSet). Exposes the Workload API, performs workload attestation, and caches SVIDs.</li>
        <li><strong>Controller Manager:</strong> Watches Kubernetes for pod events and auto-registers workloads.</li>
      </ul>
      <h2>How SPIRE Issues Identity</h2>
      <ol>
        <li>Agent starts on a node and proves its legitimacy to the Server (<strong>node attestation</strong>)</li>
        <li>A workload calls the Workload API via Unix domain socket</li>
        <li>Agent inspects the calling process and matches it to a registration entry (<strong>workload attestation</strong>)</li>
        <li>Agent requests an SVID from the Server and returns it to the workload</li>
        <li>SVID is automatically rotated before expiry — zero manual intervention</li>
      </ol>
      <h2>Learn SPIRE</h2>
      <p>Deploy SPIRE on Kubernetes in our free <a href="/courses/mastering-spiffe-spire/running-spire-on-kubernetes">Module 5: Running SPIRE on Kubernetes</a>.</p>
    `,
  },
  {
    slug: 'zero-trust', term: 'Zero Trust', category: 'security',
    title: 'What is Zero Trust Security? Architecture and Principles Explained',
    description: 'Zero Trust is a security architecture where every request is verified cryptographically, regardless of network location. Never trust, always verify.',
    relatedCourses: [{ slug: 'cloud-native-security-engineering', title: 'Cloud Native Security Engineering' }],
    relatedTerms: ['mtls', 'workload-identity', 'spiffe', 'microsegmentation'],
    content: `
      <h1>What is Zero Trust Security?</h1>
      <p><strong>Zero Trust</strong> is a security architecture that eliminates implicit trust. Every request — regardless of where it comes from — must be authenticated, encrypted, and authorized before processing.</p>
      <h2>Core Principles</h2>
      <ol>
        <li><strong>Never trust, always verify:</strong> No request is trusted based on network location alone</li>
        <li><strong>Least privilege:</strong> Every workload gets only the permissions it needs</li>
        <li><strong>Assume breach:</strong> Design so a compromised component cannot access everything</li>
        <li><strong>Verify continuously:</strong> Not just at connection establishment — on every request</li>
      </ol>
      <h2>Zero Trust in Kubernetes</h2>
      <p>Kubernetes <a href="/glossary/network-policy">NetworkPolicies</a> restrict traffic by labels but do not encrypt or authenticate. True Zero Trust requires <a href="/glossary/mtls">mTLS</a> (encryption + authentication) and <a href="/glossary/workload-identity">workload identity</a> (cryptographic proof of who is making the request).</p>
      <h2>Learn Zero Trust</h2>
      <p>Start with <a href="/courses/cloud-native-security-engineering/zero-trust-security-fundamentals">Module 5: Zero Trust Fundamentals</a> in our free Cloud Native Security course.</p>
    `,
  },
  {
    slug: 'workload-identity', term: 'Workload Identity', category: 'identity',
    title: 'What is Workload Identity? Machine Identity for Cloud Native Systems',
    description: 'Workload identity gives every service a unique cryptographic certificate — replacing shared secrets, API keys, and IP-based trust with automatic, verifiable machine identity.',
    relatedCourses: [{ slug: 'mastering-spiffe-spire', title: 'Mastering SPIFFE & SPIRE' }, { slug: 'cloud-native-security-engineering', title: 'Cloud Native Security Engineering' }],
    relatedTerms: ['spiffe', 'svid', 'mtls', 'zero-trust'],
    content: `
      <h1>What is Workload Identity?</h1>
      <p><strong>Workload identity</strong> (also called machine identity or service identity) assigns a cryptographic identity to every service, container, or process — like a passport for machines.</p>
      <h2>Why Workload Identity Matters</h2>
      <p>Without workload identity, teams use shared secrets (API keys in environment variables), long-lived certificates (never rotated), and IP-based trust (breaks with auto-scaling). Each is a breach vector. Workload identity replaces all of these with automatic, short-lived, cryptographically verifiable certificates.</p>
      <h2>How It Works</h2>
      <p>The workload identity provider (like <a href="/glossary/spire">SPIRE</a>) automatically attests each workload, issues a short-lived certificate (SVID), and rotates it before expiry. The workload never manages certificates manually.</p>
      <h2>Learn More</h2>
      <p>Our free <a href="/courses/mastering-spiffe-spire">Mastering SPIFFE & SPIRE</a> course teaches workload identity from fundamentals to production federation.</p>
    `,
  },
  {
    slug: 'mtls', term: 'mTLS (Mutual TLS)', category: 'security',
    title: 'What is mTLS? Mutual TLS Authentication Explained',
    description: 'Mutual TLS (mTLS) authenticates both client and server with certificates. It is the transport-layer foundation of Zero Trust service-to-service communication.',
    relatedCourses: [{ slug: 'cloud-native-security-engineering', title: 'Cloud Native Security Engineering' }],
    relatedTerms: ['zero-trust', 'spiffe', 'svid', 'service-mesh'],
    content: `
      <h1>What is mTLS (Mutual TLS)?</h1>
      <p>Regular TLS only verifies the <strong>server</strong> (your browser checks the website certificate). <strong>Mutual TLS (mTLS)</strong> verifies <strong>both sides</strong> — the client presents a certificate too, and the server verifies it.</p>
      <h2>Why mTLS for Microservices?</h2>
      <p>In a Kubernetes cluster, services communicate over the internal network. Without mTLS, this traffic is unencrypted and unauthenticated — any compromised pod can eavesdrop or impersonate. mTLS provides encryption (confidentiality) and mutual authentication (identity verification) on every connection.</p>
      <h2>mTLS with SPIFFE</h2>
      <p><a href="/glossary/spiffe">SPIFFE</a> provides the certificates (X.509-SVIDs) that mTLS uses. <a href="/glossary/spire">SPIRE</a> manages the issuance and rotation automatically. Service meshes like Istio and Envoy handle the TLS handshake transparently as a sidecar proxy.</p>
      <h2>Learn More</h2>
      <p>See <a href="/courses/cloud-native-security-engineering/zero-trust-security-fundamentals">Zero Trust Fundamentals</a> for hands-on mTLS implementation.</p>
    `,
  },
  {
    slug: 'svid', term: 'SVID (SPIFFE Verifiable Identity Document)', category: 'identity',
    title: 'What is an SVID? SPIFFE Identity Documents Explained',
    description: 'An SVID is a cryptographic document that proves a workload identity. SPIFFE defines two formats: X.509-SVID (for mTLS) and JWT-SVID (for HTTP APIs).',
    relatedCourses: [{ slug: 'mastering-spiffe-spire', title: 'Mastering SPIFFE & SPIRE' }],
    relatedTerms: ['spiffe', 'spire', 'mtls', 'workload-identity'],
    content: `
      <h1>What is an SVID?</h1>
      <p>An <strong>SVID</strong> (SPIFFE Verifiable Identity Document) is the credential that proves a workload's identity. It contains the workload's <a href="/glossary/spiffe">SPIFFE ID</a> and is cryptographically signed by the trust domain's certificate authority.</p>
      <h2>Two SVID Formats</h2>
      <ul>
        <li><strong>X.509-SVID:</strong> A standard X.509 certificate with the SPIFFE ID in the URI SAN field. Used for <a href="/glossary/mtls">mTLS</a> connections.</li>
        <li><strong>JWT-SVID:</strong> A signed JWT with the SPIFFE ID in the <code>sub</code> claim. Used for HTTP APIs where certificates are impractical.</li>
      </ul>
      <h2>Learn More</h2>
      <p>See <a href="/courses/mastering-spiffe-spire/spiffe-fundamentals">Module 3: SPIFFE Fundamentals</a> for deep dive on SVIDs.</p>
    `,
  },
  {
    slug: 'opa', term: 'OPA (Open Policy Agent)', category: 'policy',
    title: 'What is OPA? Open Policy Agent for Kubernetes Explained',
    description: 'OPA is a CNCF graduated policy engine that enables policy-as-code. Use it with Gatekeeper for Kubernetes admission control or with Envoy for runtime authorization.',
    relatedCourses: [{ slug: 'cloud-native-security-engineering', title: 'Cloud Native Security Engineering' }],
    relatedTerms: ['kyverno', 'gatekeeper', 'rego', 'zero-trust'],
    content: `
      <h1>What is OPA (Open Policy Agent)?</h1>
      <p><strong>OPA</strong> is a general-purpose policy engine that decouples policy decisions from application code. Policies are written in <strong>Rego</strong>, a declarative language designed for evaluating structured data.</p>
      <h2>OPA in Kubernetes</h2>
      <p>OPA Gatekeeper runs as an admission controller — it evaluates every API request against your Rego policies and rejects non-compliant configurations before they reach the cluster.</p>
      <h2>OPA vs Kyverno</h2>
      <table><thead><tr><th>Feature</th><th>OPA Gatekeeper</th><th>Kyverno</th></tr></thead><tbody>
        <tr><td>Language</td><td>Rego</td><td>YAML (K8s native)</td></tr>
        <tr><td>Learning curve</td><td>Higher</td><td>Lower</td></tr>
        <tr><td>Mutation</td><td>Limited</td><td>Full</td></tr>
        <tr><td>Ecosystem</td><td>Broader (beyond K8s)</td><td>K8s-specific</td></tr>
      </tbody></table>
      <h2>Learn More</h2>
      <p>See <a href="/courses/cloud-native-security-engineering/policy-as-code-security">Module 8: Policy-as-Code Security</a>.</p>
    `,
  },
  {
    slug: 'falco', term: 'Falco', category: 'security',
    title: 'What is Falco? Kubernetes Runtime Security Explained',
    description: 'Falco is a CNCF graduated runtime security tool that monitors Linux syscalls and alerts on suspicious container behavior — shell execution, sensitive file access, unexpected network connections.',
    relatedCourses: [{ slug: 'cloud-native-security-engineering', title: 'Cloud Native Security Engineering' }],
    relatedTerms: ['tetragon', 'ebpf', 'runtime-security'],
    content: `
      <h1>What is Falco?</h1>
      <p><strong>Falco</strong> is a CNCF graduated project for runtime threat detection in Kubernetes. It monitors Linux syscalls and alerts when containers exhibit suspicious behavior.</p>
      <h2>What Falco Detects</h2>
      <ul>
        <li>Shell spawned inside a container</li>
        <li>Sensitive file access (/etc/shadow, /etc/passwd)</li>
        <li>Unexpected outbound network connections</li>
        <li>Privilege escalation attempts</li>
        <li>Cryptomining processes</li>
        <li>Container escape via nsenter or chroot</li>
      </ul>
      <h2>Falco vs Tetragon</h2>
      <p>Falco <strong>detects</strong> threats and sends alerts. <a href="/glossary/tetragon">Tetragon</a> can <strong>block</strong> threats in real-time using eBPF enforcement. Many teams use both: Falco for broad detection, Tetragon for critical enforcement.</p>
      <h2>Learn More</h2>
      <p>See <a href="/courses/cloud-native-security-engineering/runtime-security-threat-detection">Module 10: Runtime Security</a>.</p>
    `,
  },
  {
    slug: 'service-mesh', term: 'Service Mesh', category: 'security',
    title: 'What is a Service Mesh? Istio, Envoy, and Linkerd Explained',
    description: 'A service mesh is an infrastructure layer of sidecar proxies that handles service-to-service communication — providing automatic mTLS, load balancing, observability, and traffic management.',
    relatedCourses: [{ slug: 'cloud-native-security-engineering', title: 'Cloud Native Security Engineering' }],
    relatedTerms: ['mtls', 'zero-trust', 'spiffe', 'envoy'],
    content: `
      <h1>What is a Service Mesh?</h1>
      <p>A <strong>service mesh</strong> adds a sidecar proxy (typically <strong>Envoy</strong>) to every pod. The proxy handles mTLS, load balancing, retries, circuit breaking, and observability — transparently, without application code changes.</p>
      <h2>Popular Service Meshes</h2>
      <ul>
        <li><strong>Istio:</strong> Most feature-rich. Uses Envoy sidecars. Strong security model with PeerAuthentication and AuthorizationPolicy.</li>
        <li><strong>Linkerd:</strong> Lightweight, Rust-based proxy. Simpler than Istio, focuses on reliability and observability.</li>
        <li><strong>Envoy (standalone):</strong> The proxy itself, used directly without a full mesh control plane.</li>
      </ul>
      <h2>Service Mesh + SPIFFE</h2>
      <p><a href="/glossary/spire">SPIRE</a> can replace the mesh's built-in CA for stronger workload attestation, cross-cluster federation, and identity for non-mesh workloads (VMs, CI/CD).</p>
      <h2>Learn More</h2>
      <p>See <a href="/courses/cloud-native-security-engineering/service-mesh-security">Module 7: Service Mesh Security</a>.</p>
    `,
  },
  {
    slug: 'sigstore', term: 'Sigstore', category: 'security',
    title: 'What is Sigstore? Container Image Signing and Verification',
    description: 'Sigstore provides keyless container image signing via OIDC identity. Cosign signs images, Rekor provides transparency logging, and Fulcio issues ephemeral signing certificates.',
    relatedCourses: [{ slug: 'cloud-native-security-engineering', title: 'Cloud Native Security Engineering' }],
    relatedTerms: ['cosign', 'slsa', 'sbom', 'supply-chain-security'],
    content: `
      <h1>What is Sigstore?</h1>
      <p><strong>Sigstore</strong> is an open-source project for signing, verifying, and protecting software. It makes software supply chain security accessible by providing keyless signing — no GPG keys to manage.</p>
      <h2>Sigstore Components</h2>
      <ul>
        <li><strong>Cosign:</strong> Sign and verify container images. Keyless signing via OIDC (GitHub, Google identity).</li>
        <li><strong>Rekor:</strong> Immutable transparency log of all signing events.</li>
        <li><strong>Fulcio:</strong> Issues short-lived signing certificates tied to OIDC identity.</li>
      </ul>
      <h2>Learn More</h2>
      <p>See <a href="/courses/cloud-native-security-engineering/supply-chain-security">Module 11: Supply Chain Security</a>.</p>
    `,
  },
];
