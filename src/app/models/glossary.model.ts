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
      <svg viewBox="0 0 700 180" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="SPIFFE identity flow diagram"><rect width="700" height="180" fill="#0f172a" rx="10"/><text x="350" y="22" text-anchor="middle" fill="#94a3b8" font-size="11" font-weight="bold">SPIFFE IDENTITY FLOW</text><rect x="20" y="45" width="130" height="45" rx="6" fill="#1e293b" stroke="#3b82f6" stroke-width="1.5"/><text x="85" y="72" text-anchor="middle" fill="#93c5fd" font-size="10">Workload</text><rect x="190" y="45" width="130" height="45" rx="6" fill="#1e293b" stroke="#06b6d4" stroke-width="1.5"/><text x="255" y="65" text-anchor="middle" fill="#67e8f9" font-size="9">Workload API</text><text x="255" y="80" text-anchor="middle" fill="#64748b" font-size="8">Unix socket</text><rect x="360" y="45" width="130" height="45" rx="6" fill="#1e293b" stroke="#a855f7" stroke-width="1.5"/><text x="425" y="65" text-anchor="middle" fill="#c084fc" font-size="9">SPIRE Agent</text><text x="425" y="80" text-anchor="middle" fill="#64748b" font-size="8">Attestation</text><rect x="530" y="45" width="150" height="45" rx="6" fill="#1e293b" stroke="#22c55e" stroke-width="1.5"/><text x="605" y="65" text-anchor="middle" fill="#86efac" font-size="9">SVID Issued</text><text x="605" y="80" text-anchor="middle" fill="#64748b" font-size="8">X.509 or JWT</text><line x1="150" y1="67" x2="190" y2="67" stroke="#94a3b8" stroke-width="1.5"/><line x1="320" y1="67" x2="360" y2="67" stroke="#94a3b8" stroke-width="1.5"/><line x1="490" y1="67" x2="530" y2="67" stroke="#94a3b8" stroke-width="1.5"/><rect x="20" y="120" width="660" height="40" rx="6" fill="#22c55e" fill-opacity="0.06" stroke="#22c55e" stroke-width="1"/><text x="350" y="140" text-anchor="middle" fill="#22c55e" font-size="9">spiffe://trust-domain/namespace/service-account &mdash; automatic, short-lived, cryptographic</text><text x="350" y="155" text-anchor="middle" fill="#64748b" font-size="8">No secrets to distribute. No certificates to manage. No keys to rotate manually.</text></svg>
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
      <svg viewBox="0 0 700 160" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="SPIRE architecture diagram"><rect width="700" height="160" fill="#0f172a" rx="10"/><text x="350" y="22" text-anchor="middle" fill="#94a3b8" font-size="11" font-weight="bold">SPIRE ARCHITECTURE</text><rect x="250" y="35" width="200" height="40" rx="6" fill="#1e293b" stroke="#a855f7" stroke-width="1.5"/><text x="350" y="60" text-anchor="middle" fill="#c084fc" font-size="10" font-weight="bold">SPIRE Server (StatefulSet)</text><rect x="30" y="100" width="150" height="35" rx="5" fill="#1e293b" stroke="#3b82f6"/><text x="105" y="122" text-anchor="middle" fill="#93c5fd" font-size="9">Agent (DaemonSet)</text><rect x="220" y="100" width="130" height="35" rx="5" fill="#1e293b" stroke="#22c55e"/><text x="285" y="122" text-anchor="middle" fill="#86efac" font-size="9">Pod A (SVID)</text><rect x="380" y="100" width="130" height="35" rx="5" fill="#1e293b" stroke="#22c55e"/><text x="445" y="122" text-anchor="middle" fill="#86efac" font-size="9">Pod B (SVID)</text><rect x="540" y="100" width="130" height="35" rx="5" fill="#1e293b" stroke="#22c55e"/><text x="605" y="122" text-anchor="middle" fill="#86efac" font-size="9">Pod C (SVID)</text><line x1="105" y1="100" x2="300" y2="75" stroke="#a855f7" stroke-width="1"/><line x1="285" y1="100" x2="105" y2="135" stroke="#22c55e" stroke-width="1" stroke-dasharray="3,2"/><line x1="445" y1="100" x2="105" y2="135" stroke="#22c55e" stroke-width="1" stroke-dasharray="3,2"/></svg>
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
      <svg viewBox="0 0 700 130" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Zero Trust verification flow"><rect width="700" height="130" fill="#0f172a" rx="10"/><text x="350" y="22" text-anchor="middle" fill="#94a3b8" font-size="11" font-weight="bold">ZERO TRUST: EVERY REQUEST VERIFIED</text><rect x="20" y="45" width="130" height="40" rx="6" fill="#1e293b" stroke="#3b82f6" stroke-width="1.5"/><text x="85" y="70" text-anchor="middle" fill="#93c5fd" font-size="9">1. Identity</text><rect x="180" y="45" width="130" height="40" rx="6" fill="#1e293b" stroke="#a855f7" stroke-width="1.5"/><text x="245" y="70" text-anchor="middle" fill="#c084fc" font-size="9">2. Authenticate</text><rect x="340" y="45" width="130" height="40" rx="6" fill="#1e293b" stroke="#f97316" stroke-width="1.5"/><text x="405" y="70" text-anchor="middle" fill="#fdba74" font-size="9">3. Encrypt (mTLS)</text><rect x="500" y="45" width="130" height="40" rx="6" fill="#1e293b" stroke="#22c55e" stroke-width="1.5"/><text x="565" y="70" text-anchor="middle" fill="#86efac" font-size="9">4. Authorize</text><line x1="150" y1="65" x2="180" y2="65" stroke="#94a3b8" stroke-width="1.5"/><line x1="310" y1="65" x2="340" y2="65" stroke="#94a3b8" stroke-width="1.5"/><line x1="470" y1="65" x2="500" y2="65" stroke="#94a3b8" stroke-width="1.5"/><rect x="20" y="100" width="610" height="20" rx="4" fill="#22c55e" fill-opacity="0.06"/><text x="325" y="115" text-anchor="middle" fill="#64748b" font-size="8">No implicit trust. Every request goes through all four layers.</text></svg>
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
      <svg viewBox="0 0 700 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Workload identity: before and after comparison"><rect width="700" height="120" fill="#0f172a" rx="10"/><rect x="20" y="15" width="310" height="90" rx="8" fill="none" stroke="#ef4444" stroke-width="1.5"/><text x="175" y="35" text-anchor="middle" fill="#ef4444" font-size="10" font-weight="bold">Before: Secret Sprawl</text><text x="175" y="55" text-anchor="middle" fill="#94a3b8" font-size="9">Shared API keys in env vars</text><text x="175" y="70" text-anchor="middle" fill="#94a3b8" font-size="9">Long-lived certificates</text><text x="175" y="85" text-anchor="middle" fill="#94a3b8" font-size="9">IP-based trust (breaks at scale)</text><rect x="370" y="15" width="310" height="90" rx="8" fill="none" stroke="#22c55e" stroke-width="1.5"/><text x="525" y="35" text-anchor="middle" fill="#22c55e" font-size="10" font-weight="bold">After: Workload Identity</text><text x="525" y="55" text-anchor="middle" fill="#94a3b8" font-size="9">Auto-issued cryptographic certs</text><text x="525" y="70" text-anchor="middle" fill="#94a3b8" font-size="9">Short-lived, auto-rotated</text><text x="525" y="85" text-anchor="middle" fill="#94a3b8" font-size="9">Identity follows the workload</text></svg>
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
      <svg viewBox="0 0 700 130" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="mTLS mutual authentication flow"><rect width="700" height="130" fill="#0f172a" rx="10"/><text x="350" y="22" text-anchor="middle" fill="#94a3b8" font-size="11" font-weight="bold">MUTUAL TLS: BOTH SIDES VERIFY</text><rect x="40" y="45" width="140" height="45" rx="6" fill="#1e293b" stroke="#3b82f6" stroke-width="1.5"/><text x="110" y="65" text-anchor="middle" fill="#93c5fd" font-size="10">Service A</text><text x="110" y="80" text-anchor="middle" fill="#64748b" font-size="8">presents cert</text><rect x="520" y="45" width="140" height="45" rx="6" fill="#1e293b" stroke="#22c55e" stroke-width="1.5"/><text x="590" y="65" text-anchor="middle" fill="#86efac" font-size="10">Service B</text><text x="590" y="80" text-anchor="middle" fill="#64748b" font-size="8">presents cert</text><line x1="180" y1="58" x2="520" y2="58" stroke="#3b82f6" stroke-width="1.5"/><text x="350" y="53" text-anchor="middle" fill="#93c5fd" font-size="8">Client cert + verify server</text><line x1="520" y1="78" x2="180" y2="78" stroke="#22c55e" stroke-width="1.5"/><text x="350" y="90" text-anchor="middle" fill="#86efac" font-size="8">Server cert + verify client</text><rect x="200" y="105" width="300" height="18" rx="4" fill="#22c55e" fill-opacity="0.1"/><text x="350" y="118" text-anchor="middle" fill="#22c55e" font-size="8">Encrypted + Mutually Authenticated</text></svg>
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
      <svg viewBox="0 0 700 100" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="X.509-SVID vs JWT-SVID comparison"><rect width="700" height="100" fill="#0f172a" rx="10"/><rect x="20" y="15" width="310" height="70" rx="8" fill="#1e293b" stroke="#3b82f6" stroke-width="1.5"/><text x="175" y="38" text-anchor="middle" fill="#93c5fd" font-size="10" font-weight="bold">X.509-SVID</text><text x="175" y="55" text-anchor="middle" fill="#94a3b8" font-size="9">Certificate for mTLS connections</text><text x="175" y="70" text-anchor="middle" fill="#64748b" font-size="8">SPIFFE ID in URI SAN field</text><rect x="370" y="15" width="310" height="70" rx="8" fill="#1e293b" stroke="#22c55e" stroke-width="1.5"/><text x="525" y="38" text-anchor="middle" fill="#86efac" font-size="10" font-weight="bold">JWT-SVID</text><text x="525" y="55" text-anchor="middle" fill="#94a3b8" font-size="9">Token for HTTP API auth</text><text x="525" y="70" text-anchor="middle" fill="#64748b" font-size="8">SPIFFE ID in sub claim</text></svg>
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
      <svg viewBox="0 0 700 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="OPA admission control flow"><rect width="700" height="120" fill="#0f172a" rx="10"/><text x="350" y="22" text-anchor="middle" fill="#94a3b8" font-size="11" font-weight="bold">OPA ADMISSION CONTROL FLOW</text><rect x="20" y="45" width="120" height="40" rx="6" fill="#1e293b" stroke="#3b82f6" stroke-width="1.5"/><text x="80" y="70" text-anchor="middle" fill="#93c5fd" font-size="9">kubectl apply</text><rect x="170" y="45" width="130" height="40" rx="6" fill="#1e293b" stroke="#a855f7" stroke-width="1.5"/><text x="235" y="70" text-anchor="middle" fill="#c084fc" font-size="9">API Server</text><rect x="330" y="45" width="140" height="40" rx="6" fill="#1e293b" stroke="#f97316" stroke-width="1.5"/><text x="400" y="65" text-anchor="middle" fill="#fdba74" font-size="9">OPA Gatekeeper</text><text x="400" y="78" text-anchor="middle" fill="#64748b" font-size="7">evaluate Rego</text><rect x="500" y="40" width="80" height="22" rx="4" fill="#22c55e" fill-opacity="0.15" stroke="#22c55e"/><text x="540" y="55" text-anchor="middle" fill="#22c55e" font-size="8">Allow</text><rect x="500" y="68" width="80" height="22" rx="4" fill="#ef4444" fill-opacity="0.15" stroke="#ef4444"/><text x="540" y="83" text-anchor="middle" fill="#ef4444" font-size="8">Deny</text><line x1="140" y1="65" x2="170" y2="65" stroke="#94a3b8" stroke-width="1.5"/><line x1="300" y1="65" x2="330" y2="65" stroke="#94a3b8" stroke-width="1.5"/><line x1="470" y1="55" x2="500" y2="55" stroke="#22c55e" stroke-width="1.5"/><line x1="470" y1="79" x2="500" y2="79" stroke="#ef4444" stroke-width="1.5"/><text x="350" y="108" text-anchor="middle" fill="#64748b" font-size="8">Policies block insecure configs BEFORE they reach etcd</text></svg>
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
      <svg viewBox="0 0 700 110" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Falco runtime detection pipeline"><rect width="700" height="110" fill="#0f172a" rx="10"/><text x="350" y="22" text-anchor="middle" fill="#94a3b8" font-size="11" font-weight="bold">FALCO RUNTIME DETECTION</text><rect x="20" y="40" width="120" height="40" rx="6" fill="#1e293b" stroke="#ef4444" stroke-width="1.5"/><text x="80" y="65" text-anchor="middle" fill="#fca5a5" font-size="9">Threat Event</text><rect x="170" y="40" width="140" height="40" rx="6" fill="#1e293b" stroke="#f97316" stroke-width="1.5"/><text x="240" y="58" text-anchor="middle" fill="#fdba74" font-size="9">Falco (eBPF)</text><text x="240" y="72" text-anchor="middle" fill="#64748b" font-size="7">syscall rules</text><rect x="340" y="40" width="120" height="40" rx="6" fill="#1e293b" stroke="#eab308" stroke-width="1.5"/><text x="400" y="65" text-anchor="middle" fill="#eab308" font-size="9">Alert</text><rect x="490" y="40" width="120" height="40" rx="6" fill="#1e293b" stroke="#22c55e" stroke-width="1.5"/><text x="550" y="65" text-anchor="middle" fill="#86efac" font-size="9">Response</text><line x1="140" y1="60" x2="170" y2="60" stroke="#94a3b8" stroke-width="1.5"/><line x1="310" y1="60" x2="340" y2="60" stroke="#94a3b8" stroke-width="1.5"/><line x1="460" y1="60" x2="490" y2="60" stroke="#94a3b8" stroke-width="1.5"/><text x="350" y="100" text-anchor="middle" fill="#64748b" font-size="8">Detects: shell in container, sensitive file read, privilege escalation, crypto mining</text></svg>
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
      <svg viewBox="0 0 700 130" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Service mesh sidecar proxy architecture"><rect width="700" height="130" fill="#0f172a" rx="10"/><text x="350" y="22" text-anchor="middle" fill="#94a3b8" font-size="11" font-weight="bold">SERVICE MESH: TRANSPARENT mTLS</text><rect x="30" y="40" width="270" height="70" rx="8" fill="none" stroke="#3b82f6" stroke-width="1.5" stroke-dasharray="4,2"/><text x="45" y="55" fill="#3b82f6" font-size="8">Pod A</text><rect x="45" y="60" width="90" height="30" rx="4" fill="#1e293b" stroke="#22c55e"/><text x="90" y="80" text-anchor="middle" fill="#86efac" font-size="8">App (HTTP)</text><rect x="155" y="60" width="130" height="30" rx="4" fill="#1e293b" stroke="#f97316" stroke-width="1.5"/><text x="220" y="78" text-anchor="middle" fill="#fdba74" font-size="8">Envoy Sidecar</text><rect x="400" y="40" width="270" height="70" rx="8" fill="none" stroke="#3b82f6" stroke-width="1.5" stroke-dasharray="4,2"/><text x="415" y="55" fill="#3b82f6" font-size="8">Pod B</text><rect x="415" y="60" width="90" height="30" rx="4" fill="#1e293b" stroke="#22c55e"/><text x="460" y="80" text-anchor="middle" fill="#86efac" font-size="8">App (HTTP)</text><rect x="525" y="60" width="130" height="30" rx="4" fill="#1e293b" stroke="#f97316" stroke-width="1.5"/><text x="590" y="78" text-anchor="middle" fill="#fdba74" font-size="8">Envoy Sidecar</text><line x1="285" y1="75" x2="400" y2="75" stroke="#22c55e" stroke-width="2.5"/><text x="342" y="70" text-anchor="middle" fill="#22c55e" font-size="9" font-weight="bold">mTLS</text><text x="350" y="122" text-anchor="middle" fill="#64748b" font-size="8">Apps talk HTTP. Envoy handles mTLS transparently.</text></svg>
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
      <svg viewBox="0 0 700 110" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Sigstore supply chain signing flow"><rect width="700" height="110" fill="#0f172a" rx="10"/><text x="350" y="22" text-anchor="middle" fill="#94a3b8" font-size="11" font-weight="bold">SIGSTORE: KEYLESS IMAGE SIGNING</text><rect x="20" y="40" width="110" height="40" rx="6" fill="#1e293b" stroke="#3b82f6" stroke-width="1.5"/><text x="75" y="65" text-anchor="middle" fill="#93c5fd" font-size="9">Build Image</text><rect x="160" y="40" width="120" height="40" rx="6" fill="#1e293b" stroke="#a855f7" stroke-width="1.5"/><text x="220" y="58" text-anchor="middle" fill="#c084fc" font-size="9">Fulcio</text><text x="220" y="72" text-anchor="middle" fill="#64748b" font-size="7">OIDC cert</text><rect x="310" y="40" width="110" height="40" rx="6" fill="#1e293b" stroke="#f97316" stroke-width="1.5"/><text x="365" y="58" text-anchor="middle" fill="#fdba74" font-size="9">Cosign</text><text x="365" y="72" text-anchor="middle" fill="#64748b" font-size="7">sign image</text><rect x="450" y="40" width="110" height="40" rx="6" fill="#1e293b" stroke="#eab308" stroke-width="1.5"/><text x="505" y="58" text-anchor="middle" fill="#eab308" font-size="9">Rekor</text><text x="505" y="72" text-anchor="middle" fill="#64748b" font-size="7">transparency log</text><rect x="590" y="40" width="90" height="40" rx="6" fill="#1e293b" stroke="#22c55e" stroke-width="1.5"/><text x="635" y="65" text-anchor="middle" fill="#86efac" font-size="9">Verified</text><line x1="130" y1="60" x2="160" y2="60" stroke="#94a3b8" stroke-width="1.5"/><line x1="280" y1="60" x2="310" y2="60" stroke="#94a3b8" stroke-width="1.5"/><line x1="420" y1="60" x2="450" y2="60" stroke="#94a3b8" stroke-width="1.5"/><line x1="560" y1="60" x2="590" y2="60" stroke="#94a3b8" stroke-width="1.5"/><text x="350" y="100" text-anchor="middle" fill="#64748b" font-size="8">No keys to manage. Identity-based signing via OIDC.</text></svg>
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
