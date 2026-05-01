export const CONTENT = `
      <p>When your microservices talk to each other, how do you ensure that only <strong>authorized services</strong> can make those calls? API keys leak. JWTs expire and need refresh infrastructure. The most robust solution is <strong>certificate-based M2M authentication</strong> — and there's a Go library that makes it straightforward: <a href="https://github.com/vishalanandl177/m2mauth" target="_blank" rel="noopener noreferrer"><strong>m2mauth</strong></a>.</p>

      <h2>Why m2mauth?</h2>
      <p>Building mTLS from scratch in Go means dealing with TLS config, certificate loading, peer verification, and error handling yourself. The <code>m2mauth</code> library wraps all of this into a clean API focused specifically on service-to-service authentication.</p>

      <!-- Why m2mauth -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">DIY mTLS vs m2mauth Library</div>
        <div class="vs-cards">
          <div class="vs-card" style="border-color:#ef4444">
            <div class="vs-card-header" style="background:#ef4444">&#x1F6AB; Rolling Your Own</div>
            <div class="vs-card-body">
              <div class="vs-row"><span class="vs-row-icon">&#x1F4CB;</span>50+ lines of TLS config boilerplate</div>
              <div class="vs-row"><span class="vs-row-icon">&#x26A0;</span>Easy to misconfigure (skip verify, wrong ciphers)</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F504;</span>Certificate rotation logic is your problem</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F41B;</span>Subtle security bugs in peer validation</div>
            </div>
          </div>
          <div class="vs-badge">VS</div>
          <div class="vs-card" style="border-color:#22c55e">
            <div class="vs-card-header" style="background:#22c55e">&#x2705; Using m2mauth</div>
            <div class="vs-card-body">
              <div class="vs-row"><span class="vs-row-icon">&#x26A1;</span>Clean API — few lines to set up</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F512;</span>Secure defaults (TLS 1.2+, strong ciphers)</div>
              <div class="vs-row"><span class="vs-row-icon">&#x2705;</span>Handles certificate loading and validation</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F4E6;</span>Open source, auditable, community-maintained</div>
            </div>
          </div>
        </div>
      </div>

      <h2>Installation</h2>
      <pre><code>go get github.com/vishalanandl177/m2mauth</code></pre>

      <h2>How M2M Auth Works</h2>

      <!-- M2M Auth Flow -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">M2M Authentication Flow</div>
        <div class="seq-diagram">
          <div class="seq-actors">
            <div class="seq-actor browser">Service A<span class="seq-actor-sub">(Client)</span></div>
            <div class="seq-actor idp">mTLS Handshake<span class="seq-actor-sub">(m2mauth)</span></div>
            <div class="seq-actor sp">Service B<span class="seq-actor-sub">(Server)</span></div>
          </div>
          <div class="seq-steps">
            <div class="seq-step">
              <div class="seq-arrow full-right" style="--arrow-color:#3b82f6"><span class="seq-num blue">1</span> Connect with client certificate</div>
            </div>
            <div class="seq-step">
              <div class="seq-arrow full-left" style="--arrow-color:#22c55e"><span class="seq-num green">2</span> Server sends its certificate</div>
            </div>
            <div class="seq-step">
              <div></div>
              <div class="seq-action" style="border-color:#7c3aed;color:#a78bfa">Both verify certificates against shared CA</div>
            </div>
            <div class="seq-step">
              <div class="seq-arrow full-right" style="--arrow-color:#f97316"><span class="seq-num orange">3</span> Encrypted request (identity proven)</div>
            </div>
            <div class="seq-step">
              <div class="seq-arrow full-left" style="--arrow-color:#22c55e"><span class="seq-num green">4</span> Encrypted response &#x2705;</div>
            </div>
          </div>
        </div>
      </div>

      <h2>Setting Up the Server</h2>
      <pre><code>package main

import (
    "fmt"
    "log"
    "net/http"

    "github.com/vishalanandl177/m2mauth"
)

func main() {
    // Create M2M auth configuration
    config := m2mauth.Config{
        CertFile: "certs/server-cert.pem",   // Server's certificate
        KeyFile:  "certs/server-key.pem",     // Server's private key
        CAFile:   "certs/ca-cert.pem",        // CA to verify client certs
    }

    // Your HTTP handler
    mux := http.NewServeMux()
    mux.HandleFunc("/api/data", func(w http.ResponseWriter, r *http.Request) {
        // At this point, the client's certificate has been verified
        // by m2mauth — only trusted services reach this handler
        fmt.Fprintf(w, "Hello from Service B! You are authenticated.")
    })

    mux.HandleFunc("/api/health", func(w http.ResponseWriter, r *http.Request) {
        w.WriteHeader(http.StatusOK)
        fmt.Fprintf(w, "OK")
    })

    // Start mTLS server using m2mauth
    server, err := m2mauth.NewServer(config, mux)
    if err != nil {
        log.Fatalf("Failed to create M2M server: %v", err)
    }

    log.Println("M2M server listening on :8443 (mTLS required)")
    log.Fatal(server.ListenAndServeTLS(":8443"))
}</code></pre>

      <h2>Setting Up the Client</h2>
      <pre><code>package main

import (
    "fmt"
    "io"
    "log"
    "net/http"

    "github.com/vishalanandl177/m2mauth"
)

func main() {
    // Client M2M auth configuration
    config := m2mauth.Config{
        CertFile: "certs/client-cert.pem",   // Client's certificate
        KeyFile:  "certs/client-key.pem",     // Client's private key
        CAFile:   "certs/ca-cert.pem",        // CA to verify server cert
    }

    // Create authenticated HTTP client
    client, err := m2mauth.NewClient(config)
    if err != nil {
        log.Fatalf("Failed to create M2M client: %v", err)
    }

    // Make authenticated request — certificate is sent automatically
    resp, err := client.Get("https://localhost:8443/api/data")
    if err != nil {
        log.Fatalf("Request failed: %v", err)
    }
    defer resp.Body.Close()

    body, _ := io.ReadAll(resp.Body)
    fmt.Printf("Status: %d\\n", resp.StatusCode)
    fmt.Printf("Body: %s\\n", body)
    // Output:
    // Status: 200
    // Body: Hello from Service B! You are authenticated.
}</code></pre>

      <h2>Generating Certificates</h2>
      <p>For development/testing, generate your own CA and certificates:</p>
      <pre><code># Generate CA (Certificate Authority)
openssl genrsa -out certs/ca-key.pem 4096
openssl req -new -x509 -key certs/ca-key.pem -sha256 \\
  -subj "/CN=My Internal CA" -days 3650 -out certs/ca-cert.pem

# Generate Server certificate
openssl genrsa -out certs/server-key.pem 4096
openssl req -new -key certs/server-key.pem \\
  -subj "/CN=service-b.local" -out certs/server.csr
openssl x509 -req -in certs/server.csr \\
  -CA certs/ca-cert.pem -CAkey certs/ca-key.pem \\
  -CAcreateserial -days 365 -sha256 \\
  -extfile &lt;(echo "subjectAltName=DNS:localhost,IP:127.0.0.1") \\
  -out certs/server-cert.pem

# Generate Client certificate
openssl genrsa -out certs/client-key.pem 4096
openssl req -new -key certs/client-key.pem \\
  -subj "/CN=service-a" -out certs/client.csr
openssl x509 -req -in certs/client.csr \\
  -CA certs/ca-cert.pem -CAkey certs/ca-key.pem \\
  -CAcreateserial -days 365 -sha256 \\
  -out certs/client-cert.pem</code></pre>

      <h2>Using with gRPC</h2>
      <pre><code>package main

import (
    "log"
    "google.golang.org/grpc"
    "github.com/vishalanandl177/m2mauth"
)

func main() {
    config := m2mauth.Config{
        CertFile: "certs/server-cert.pem",
        KeyFile:  "certs/server-key.pem",
        CAFile:   "certs/ca-cert.pem",
    }

    // Get TLS credentials for gRPC
    tlsCreds, err := m2mauth.NewGRPCServerCredentials(config)
    if err != nil {
        log.Fatalf("Failed to create gRPC credentials: %v", err)
    }

    // Create gRPC server with mTLS
    grpcServer := grpc.NewServer(grpc.Creds(tlsCreds))

    // Register your gRPC services here...
    // pb.RegisterMyServiceServer(grpcServer, &myService{})

    log.Println("gRPC server with mTLS on :50051")
}</code></pre>

      <h2>Kubernetes Deployment</h2>
      <pre><code># Mount certificates from Kubernetes Secrets
apiVersion: apps/v1
kind: Deployment
metadata:
  name: service-b
spec:
  template:
    spec:
      containers:
        - name: service-b
          image: myregistry/service-b:latest
          ports:
            - containerPort: 8443
          volumeMounts:
            - name: tls-certs
              mountPath: /certs
              readOnly: true
      volumes:
        - name: tls-certs
          secret:
            secretName: service-b-tls

# Create the secret from cert files:
# kubectl create secret generic service-b-tls \\
#   --from-file=server-cert.pem=certs/server-cert.pem \\
#   --from-file=server-key.pem=certs/server-key.pem \\
#   --from-file=ca-cert.pem=certs/ca-cert.pem

# For production: use cert-manager to auto-generate and rotate certs</code></pre>

      <h2>When to Use m2mauth</h2>
      <ul>
        <li><strong>Microservice-to-microservice:</strong> Internal APIs within your cluster where API keys aren't secure enough.</li>
        <li><strong>Zero-trust environments:</strong> Every connection must prove identity cryptographically — not just "I have the right API key."</li>
        <li><strong>Cross-cluster communication:</strong> Services in different Kubernetes clusters or VPCs that need to trust each other.</li>
        <li><strong>Compliance requirements:</strong> PCI-DSS, HIPAA, or SOC 2 often require mutual authentication for sensitive data access.</li>
      </ul>

      <h2>Scaling M2M Auth: SPIFFE and SPIRE</h2>

      <p>The <code>m2mauth</code> library is perfect for small-to-medium deployments where you manage certificates manually. But there's a fundamental problem it can't solve: <strong>the identity bootstrapping problem</strong>.</p>

      <p>When a new pod starts in Kubernetes, how does it prove who it is? It can't show a certificate — it doesn't have one yet. It can't use a password — where would you store it securely before the pod exists? This chicken-and-egg problem is exactly what SPIFFE and SPIRE were designed to solve.</p>

      <h2>What is SPIFFE?</h2>

      <p><strong>SPIFFE</strong> (Secure Production Identity Framework for Everyone) is not a tool — it's an <strong>open standard</strong> (a set of specifications) that defines how workloads identify themselves to each other. Think of it like how HTTPS is a standard that defines secure web connections. SPIFFE is a standard that defines secure workload identity.</p>

      <p>SPIFFE answers three questions:</p>
      <ul>
        <li><strong>How do you name a workload?</strong> → SPIFFE ID (a URI)</li>
        <li><strong>How do you prove a workload's identity?</strong> → SVID (a signed document — X.509 cert or JWT)</li>
        <li><strong>How does a workload get its identity?</strong> → Workload API (a local Unix socket)</li>
      </ul>

      <h2>SPIFFE IDs: Naming Workloads</h2>

      <p>Every workload in a SPIFFE-enabled system has a <strong>SPIFFE ID</strong> — a URI that uniquely identifies it:</p>

      <pre><code># SPIFFE ID format:
spiffe://trust-domain/path

# The trust domain is like a realm or scope:
spiffe://mycompany.com/payments/charge-service
spiffe://mycompany.com/orders/api
spiffe://staging.mycompany.com/payments/charge-service

# Real-world naming patterns:
# By namespace + service account (Kubernetes):
spiffe://prod.acme.com/ns/production/sa/payment-service

# By cluster + service:
spiffe://acme.com/cluster/us-east/service/order-api

# By environment + team + service:
spiffe://acme.com/env/prod/team/platform/service/gateway</code></pre>

      <p>The SPIFFE ID is embedded inside the identity document (SVID). When Service A talks to Service B, they exchange SVIDs and verify each other's SPIFFE ID — not IP addresses, not hostnames, not API keys. This is cryptographic proof of identity.</p>

      <h2>SVIDs: Proving Identity</h2>

      <p>An <strong>SVID</strong> (SPIFFE Verifiable Identity Document) is the actual proof of identity. SPIFFE supports two types:</p>

      <!-- SVID Types -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">Two Types of SPIFFE Identity Documents</div>
        <div class="vs-cards">
          <div class="vs-card" style="border-color:#3b82f6">
            <div class="vs-card-header" style="background:#3b82f6">X.509 SVID (Certificate)</div>
            <div class="vs-card-body">
              <div class="vs-row"><span class="vs-row-icon">&#x1F512;</span>Standard X.509 certificate with SPIFFE ID in SAN</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F504;</span>Short-lived (typically 1 hour, auto-rotated)</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F310;</span>Works with ANY TLS library (no SPIFFE SDK needed)</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F3AF;</span>Best for: mTLS between services (most common)</div>
            </div>
          </div>
          <div class="vs-badge">VS</div>
          <div class="vs-card" style="border-color:#22c55e">
            <div class="vs-card-header" style="background:#22c55e">JWT SVID (Token)</div>
            <div class="vs-card-body">
              <div class="vs-row"><span class="vs-row-icon">&#x1F4DD;</span>Standard JWT with SPIFFE ID in sub claim</div>
              <div class="vs-row"><span class="vs-row-icon">&#x23F1;</span>Very short-lived (typically 5 minutes)</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F310;</span>Works over HTTP headers (no mTLS needed)</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F3AF;</span>Best for: L7 proxies, API gateways, cross-boundary</div>
            </div>
          </div>
        </div>
      </div>

      <h2>What is SPIRE?</h2>

      <p><strong>SPIRE</strong> (SPIFFE Runtime Environment) is the production implementation of the SPIFFE standard. If SPIFFE is the specification, SPIRE is the software you actually deploy. It has two components:</p>

      <!-- SPIRE Architecture -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">SPIRE Architecture</div>
        <div class="layer-diagram">
          <div class="layer-item" style="background:#7c3aed">SPIRE Server (Control Plane)<span class="layer-item-sub">Central authority. Signs SVIDs. Stores registration entries. Manages trust bundles. Runs as a Deployment in K8s.</span></div>
          <div class="layer-item" style="background:#3b82f6">SPIRE Agent (Per-Node Daemon)<span class="layer-item-sub">Runs on every node (DaemonSet). Attests workloads. Caches SVIDs locally. Exposes the Workload API.</span></div>
          <div class="layer-item" style="background:#22c55e">Workload API (Unix Socket)<span class="layer-item-sub">A local gRPC endpoint (/run/spire/sockets/agent.sock) that workloads call to get their SVID. No secrets needed to call it.</span></div>
          <div class="layer-item" style="background:#f97316">Workload (Your Service)<span class="layer-item-sub">Calls the Workload API on startup. Gets its SVID. Uses it for mTLS connections. Never sees a private key file.</span></div>
        </div>
      </div>

      <h2>Workload Attestation: How SPIRE Knows Who's Asking</h2>

      <p>This is the clever part — how does SPIRE know which identity to give a workload? It uses <strong>attestation</strong>: verifying properties of the workload's environment to determine its identity.</p>

      <!-- Attestation Flow -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">Workload Attestation: "Who Are You?"</div>
        <div class="seq-diagram">
          <div class="seq-actors">
            <div class="seq-actor browser">Workload<span class="seq-actor-sub">(Your pod)</span></div>
            <div class="seq-actor idp">SPIRE Agent<span class="seq-actor-sub">(On same node)</span></div>
            <div class="seq-actor sp">SPIRE Server<span class="seq-actor-sub">(Central)</span></div>
          </div>
          <div class="seq-steps">
            <div class="seq-step">
              <div class="seq-arrow right" style="--arrow-color:#3b82f6"><span class="seq-num blue">1</span> Connect to /run/spire/sockets/agent.sock</div>
            </div>
            <div class="seq-step">
              <div></div>
              <div class="seq-action" style="border-color:#7c3aed;color:#a78bfa">Agent inspects caller: PID &#x2192; K8s API &#x2192; pod name, namespace, SA, labels</div>
            </div>
            <div class="seq-step">
              <div class="seq-arrow right-23" style="--arrow-color:#f97316"><span class="seq-num orange">2</span> "Pod in ns:production, sa:payment-service — match?"</div>
            </div>
            <div class="seq-step">
              <div class="seq-arrow left-23" style="--arrow-color:#22c55e"><span class="seq-num green">3</span> "Yes — issue SVID: spiffe://acme.com/.../payment-service"</div>
            </div>
            <div class="seq-step">
              <div class="seq-arrow left" style="--arrow-color:#22c55e"><span class="seq-num green">4</span> X.509 SVID + private key + trust bundle</div>
            </div>
            <div class="seq-step">
              <div></div>
              <div class="seq-action" style="border-color:#3b82f6;color:#60a5fa">Auto-rotates before expiry. Workload never manages keys.</div>
            </div>
          </div>
        </div>
      </div>

      <p>SPIRE supports multiple <strong>attestors</strong> — plugins that verify workload identity on different platforms:</p>

      <pre><code># Kubernetes attestor selectors:
-selector k8s:ns:production               # Pod is in namespace "production"
-selector k8s:sa:payment-service           # Pod uses service account "payment-service"
-selector k8s:pod-label:app:payments       # Pod has label app=payments
-selector k8s:container-name:main          # Specific container in the pod

# AWS attestor selectors:
-selector aws:iamrole:arn:aws:iam::123:role/my-role  # EC2 instance role
-selector aws:sgid:sg-12345                           # Security group
-selector aws:tag:env:production                      # Instance tag

# Docker attestor selectors:
-selector docker:image-id:sha256:abc123    # Specific image hash
-selector docker:label:service:payments    # Docker label

# The beauty: SPIRE doesn't care WHERE your workload runs.
# Kubernetes, VMs, Docker, bare metal — same identity system.</code></pre>

      <h2>Trust Domains and Federation</h2>

      <p>A <strong>trust domain</strong> is a zone of trust — all workloads within a trust domain share the same root certificates and can verify each other. But what if Service A in <code>us-east.acme.com</code> needs to call Service B in <code>eu-west.acme.com</code>? That's where <strong>federation</strong> comes in.</p>

      <!-- Federation Diagram -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">SPIFFE Federation: Cross-Cluster Trust</div>
        <div class="hub-diagram">
          <div class="hub-center" style="background:#7c3aed;box-shadow:0 0 30px rgba(124,58,237,0.3)">
            Federation
            <span class="hub-center-sub">Trust bundle exchange</span>
          </div>
          <div class="hub-arrow-label"><span class="arrow-animated">&#x2B07;</span> Workloads in different domains can verify each other</div>
          <div class="hub-apps">
            <div class="hub-app"><span class="hub-app-icon">&#x1F1FA;&#x1F1F8;</span>us-east.acme.com<span class="hub-app-sub">US East cluster</span></div>
            <div class="hub-app" style="background:#f97316"><span class="hub-app-icon">&#x1F1EA;&#x1F1FA;</span>eu-west.acme.com<span class="hub-app-sub">EU West cluster</span></div>
            <div class="hub-app" style="background:#a855f7"><span class="hub-app-icon">&#x1F3E2;</span>partner.bigcorp.com<span class="hub-app-sub">Partner company</span></div>
            <div class="hub-app" style="background:#ef4444"><span class="hub-app-icon">&#x1F4BB;</span>onprem.acme.com<span class="hub-app-sub">On-prem datacenter</span></div>
          </div>
        </div>
      </div>

      <pre><code># Set up federation between two SPIRE servers:

# On us-east SPIRE server: trust eu-west
spire-server bundle set \\
  -id spiffe://eu-west.acme.com \\
  -path /path/to/eu-west-bundle.json

# On eu-west SPIRE server: trust us-east
spire-server bundle set \\
  -id spiffe://us-east.acme.com \\
  -path /path/to/us-east-bundle.json

# Now workloads in us-east can verify SVIDs from eu-west and vice versa.
# Service A in US can call Service B in EU with full mTLS verification.
# No shared secrets. No VPN. Just cryptographic trust.

# For partner companies:
# Exchange trust bundles out-of-band (email, secure portal).
# Now your payment service can call BigCorp's API with mTLS,
# and both sides cryptographically verify the other's identity.
# No API keys to rotate. No shared credentials to leak.</code></pre>

      <h2>SPIRE on Kubernetes — Full Setup</h2>

      <pre><code># Deploy SPIRE on Kubernetes using Helm

# 1. Add the SPIFFE helm repo
helm repo add spiffe https://spiffe.github.io/helm-charts-hardened/
helm repo update

# 2. Install SPIRE server
helm install spire-server spiffe/spire-server \\
  --namespace spire-system --create-namespace \\
  --set trustDomain=mycompany.com

# 3. Install SPIRE agent (DaemonSet — runs on every node)
helm install spire-agent spiffe/spire-agent \\
  --namespace spire-system

# 4. Register workloads (tell SPIRE which pods get which identity)
kubectl exec -n spire-system spire-server-0 -- \\
  spire-server entry create \\
  -spiffeID spiffe://mycompany.com/ns/production/sa/payment-service \\
  -parentID spiffe://mycompany.com/spire/agent/k8s_psat/default \\
  -selector k8s:ns:production \\
  -selector k8s:sa:payment-service

# Any pod in namespace=production with serviceAccount=payment-service
# automatically gets: spiffe://mycompany.com/ns/production/sa/payment-service

# 5. Verify it works:
kubectl exec -n production payment-service-pod -- \\
  /opt/spire/bin/spire-agent api fetch x509 \\
  -socketPath /run/spire/sockets/agent.sock
# Shows the X.509 SVID with the SPIFFE ID embedded</code></pre>

      <h2>Using SPIRE SVIDs in Go</h2>

      <pre><code>package main

import (
    "context"
    "fmt"
    "log"
    "net/http"

    "github.com/spiffe/go-spiffe/v2/spiffetls"
    "github.com/spiffe/go-spiffe/v2/spiffetls/tlsconfig"
    "github.com/spiffe/go-spiffe/v2/spiffeid"
    "github.com/spiffe/go-spiffe/v2/workloadapi"
)

func main() {
    ctx := context.Background()

    // Connect to SPIRE Workload API (auto-discovers via socket)
    source, err := workloadapi.NewX509Source(ctx)
    if err != nil {
        log.Fatalf("Unable to create X509Source: %v", err)
    }
    defer source.Close()

    // Get our own SVID (identity)
    svid, err := source.GetX509SVID()
    if err != nil {
        log.Fatalf("Unable to get SVID: %v", err)
    }
    fmt.Printf("My identity: %s\\n", svid.ID)

    // ── Server: Accept connections only from specific SPIFFE IDs ──
    authorizedCaller := spiffeid.RequireIDFromString(
        "spiffe://mycompany.com/ns/production/sa/order-service",
    )

    listener, err := spiffetls.Listen(ctx, "tcp", ":8443",
        tlsconfig.AuthorizeID(authorizedCaller),
    )
    if err != nil {
        log.Fatalf("Unable to create TLS listener: %v", err)
    }

    http.HandleFunc("/api/charge", func(w http.ResponseWriter, r *http.Request) {
        // The caller's SPIFFE ID has been verified by SPIRE
        fmt.Fprintln(w, "Payment processed! Caller verified.")
    })
    log.Println("Payment service on :8443 (SPIFFE mTLS)")
    log.Fatal(http.Serve(listener, nil))
}

// ── Client: Connect using SPIFFE identity ──
func callPaymentService(ctx context.Context) {
    targetID := spiffeid.RequireIDFromString(
        "spiffe://mycompany.com/ns/production/sa/payment-service",
    )

    conn, err := spiffetls.Dial(ctx, "tcp", "payment-service:8443",
        tlsconfig.AuthorizeID(targetID),
    )
    if err != nil {
        log.Fatalf("Unable to connect: %v", err)
    }
    defer conn.Close()
    // Connection is mTLS-protected with auto-rotated certificates
    // Zero certificate files. Zero rotation scripts.
}</code></pre>


      <h2>m2mauth vs SPIFFE/SPIRE — When to Use Which</h2>

      <!-- Comparison -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">m2mauth vs SPIFFE/SPIRE</div>
        <div class="vs-cards">
          <div class="vs-card" style="border-color:#3b82f6">
            <div class="vs-card-header" style="background:#3b82f6">m2mauth (Simple)</div>
            <div class="vs-card-body">
              <div class="vs-row"><span class="vs-row-icon">&#x2705;</span>No infrastructure to deploy</div>
              <div class="vs-row"><span class="vs-row-icon">&#x2705;</span>Works with static cert files</div>
              <div class="vs-row"><span class="vs-row-icon">&#x2705;</span>5 minutes to set up</div>
              <div class="vs-row"><span class="vs-row-icon">&#x26A0;</span>Manual certificate rotation</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F3AF;</span>Best for: 2-20 services, dev/staging</div>
            </div>
          </div>
          <div class="vs-badge">VS</div>
          <div class="vs-card" style="border-color:#22c55e">
            <div class="vs-card-header" style="background:#22c55e">SPIFFE/SPIRE (Production)</div>
            <div class="vs-card-body">
              <div class="vs-row"><span class="vs-row-icon">&#x2705;</span>Automatic identity assignment</div>
              <div class="vs-row"><span class="vs-row-icon">&#x2705;</span>Auto cert rotation (no downtime)</div>
              <div class="vs-row"><span class="vs-row-icon">&#x2705;</span>Cross-cluster federation</div>
              <div class="vs-row"><span class="vs-row-icon">&#x26A0;</span>Requires SPIRE infrastructure</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F3AF;</span>Best for: 20-1000+ services, production</div>
            </div>
          </div>
        </div>
      </div>

      <h2>Production Use Cases</h2>

      <ul>
        <li><strong>Uber</strong> uses SPIFFE/SPIRE to issue identities for thousands of microservices across multiple data centres. Every service-to-service call is mTLS-authenticated with SVIDs that rotate every hour.</li>
        <li><strong>Bloomberg</strong> deployed SPIRE to replace static service account credentials across their trading platform — eliminating credential leaks as a threat vector.</li>
        <li><strong>ByteDance (TikTok)</strong> uses SPIRE for workload identity across their global Kubernetes infrastructure, enabling zero-trust networking across regions.</li>
        <li><strong>HPE (Hewlett Packard Enterprise)</strong> acquired the SPIFFE/SPIRE project creators and uses it across their hybrid cloud products.</li>
        <li><strong>Square/Block</strong> uses SPIFFE for payment processing services — every transaction flows through mTLS-authenticated connections with automatically rotated certificates.</li>
      </ul>

      <h2>The "Bottom Turtle" Problem</h2>

      <p>There's a famous analogy in the SPIFFE community (so famous they <a href="https://spiffe.io/book/" target="_blank" rel="noopener noreferrer">named a book after it</a>). It goes like this:</p>

      <p>In an old story, someone insists the world rests on the back of a giant turtle. "What's the turtle standing on?" they're asked. "Another turtle." And that one? <em>"It's turtles all the way down!"</em></p>

      <p>Computer security has the same problem. You protect your APIs with secrets (passwords, API keys). You protect the secrets with encryption keys. You protect the encryption keys with a secrets vault. You protect the vault with... more secrets. <strong>It's secrets all the way down.</strong></p>

      <p>SPIFFE and SPIRE aim to be the <strong>bottom turtle</strong> — the foundational layer of trust that everything else stands on. Instead of cascading secrets, you have cryptographic identity rooted in platform attestation (the node's identity is verified by the cloud provider or kernel, the workload's identity is verified by the node). No secrets to leak because there are no secrets — just cryptographic proofs.</p>

      <h2>Think of It as MFA for Workloads</h2>

      <p>You know how multi-factor authentication (MFA) works for humans — you prove your identity with something you know (password) AND something you have (phone/hardware key). SPIFFE/SPIRE does the same thing for workloads:</p>

      <ul>
        <li><strong>Something the workload IS:</strong> its process attributes (PID, container image hash, Kubernetes service account)</li>
        <li><strong>Something the workload's node HAS:</strong> the node's attestation proof (AWS instance identity document, GCP VM identity token, Kubernetes node certificate)</li>
        <li><strong>Combined result:</strong> a short-lived, cryptographically signed SVID that proves identity without any stored secrets</li>
      </ul>

      <h2>Beyond Microservices: Where SPIFFE/SPIRE Is Going</h2>

      <!-- Emerging Use Cases -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">Emerging SPIFFE/SPIRE Use Cases (2025-2026)</div>
        <div class="timeline">
          <div class="timeline-item" style="--c:#7c3aed"><div class="timeline-item-title" style="color:#7c3aed">AI Agent Identity</div><div class="timeline-item-desc">AI agents that interact with sensitive systems (databases, APIs, cloud resources) need verifiable, short-lived identities — not long-lived API keys. SPIFFE SVIDs provide exactly this: the agent gets an identity, does its work, the identity expires automatically.</div></div>
          <div class="timeline-item" style="--c:#3b82f6"><div class="timeline-item-title" style="color:#3b82f6">Edge Computing Security</div><div class="timeline-item-desc">Edge nodes in retail stores, factories, and cell towers need to authenticate with central cloud services. SPIRE extends the identity control plane to the edge — same cryptographic verification model, even on far-flung devices with intermittent connectivity.</div></div>
          <div class="timeline-item" style="--c:#22c55e"><div class="timeline-item-title" style="color:#22c55e">Service Mesh Trust Foundation</div><div class="timeline-item-desc">Service meshes like Istio and Linkerd already use SPIFFE under the hood for mTLS between sidecars. But SPIRE can serve as a trust foundation ACROSS meshes — different clusters, different mesh implementations, same identity framework.</div></div>
          <div class="timeline-item" style="--c:#f97316"><div class="timeline-item-title" style="color:#f97316">Virtual Machine Identity (KubeVirt)</div><div class="timeline-item-desc">Not everything runs in containers. VMs managed by KubeVirt (or OpenShift Virtualization) can get SPIFFE identities too — same attestation model, same SVIDs, same trust domains. One identity system for containers AND VMs.</div></div>
          <div class="timeline-item" style="--c:#ef4444"><div class="timeline-item-title" style="color:#ef4444">Cross-Organisation Federation</div><div class="timeline-item-desc">Two companies exchanging trust bundles can authenticate each other's workloads without sharing any secrets. Your payment service calls your partner's fraud API — both sides verify with SPIFFE, no API keys exchanged, no secrets vault shared.</div></div>
        </div>
      </div>

      <h2>SPIFFE/SPIRE in 3 Key Facts</h2>

      <ul>
        <li><strong>Graduated CNCF project:</strong> Same maturity level as Kubernetes, Prometheus, and Envoy. Production-proven at the highest scale.</li>
        <li><strong>Platform-agnostic:</strong> Works on Kubernetes, VMs, bare metal, Docker, edge devices. Node and workload attestors exist for AWS, GCP, Azure, and more.</li>
        <li><strong>Enterprise-ready:</strong> Red Hat offers an enterprise SPIFFE/SPIRE implementation as the <strong>Red Hat Zero Trust Workload Identity Manager</strong> (OpenShift operator). HashiCorp, HPE, and others offer commercial SPIRE distributions too.</li>
      </ul>

      <h2>Practical Example: E-Commerce Platform with m2mauth + SPIFFE</h2>

      <p>Let's walk through a real production architecture. You're building an e-commerce platform with 5 microservices. Here's how you'd secure every service-to-service call.</p>

      <!-- Architecture Diagram -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">E-Commerce M2M Architecture</div>
        <div class="hub-diagram">
          <div class="hub-center" style="background:#7c3aed;box-shadow:0 0 30px rgba(124,58,237,0.3)">
            SPIRE Server
            <span class="hub-center-sub">Issues SVIDs to all services</span>
          </div>
          <div class="hub-arrow-label"><span class="arrow-animated">&#x2B07;</span> mTLS-authenticated connections</div>
          <div class="hub-apps">
            <div class="hub-app"><span class="hub-app-icon">&#x1F310;</span>API Gateway<span class="hub-app-sub">Public entry</span></div>
            <div class="hub-app" style="background:#f97316"><span class="hub-app-icon">&#x1F6D2;</span>Order Service<span class="hub-app-sub">Processes orders</span></div>
            <div class="hub-app" style="background:#a855f7"><span class="hub-app-icon">&#x1F4B3;</span>Payment Service<span class="hub-app-sub">Charges cards</span></div>
            <div class="hub-app" style="background:#ef4444"><span class="hub-app-icon">&#x1F4E6;</span>Inventory Service<span class="hub-app-sub">Stock management</span></div>
          </div>
        </div>
      </div>

      <pre><code>// ── Example 1: Order Service calling Payment Service ──
// The Order Service needs to charge a customer's card.
// It must prove its identity to the Payment Service.

package main

import (
    "bytes"
    "context"
    "encoding/json"
    "fmt"
    "log"
    "net/http"

    "github.com/vishalanandl177/m2mauth"
)

// ChargeRequest represents a payment request
type ChargeRequest struct {
    OrderID  string  \u0060json:"order_id"\u0060
    Amount   float64 \u0060json:"amount"\u0060
    Currency string  \u0060json:"currency"\u0060
    UserID   string  \u0060json:"user_id"\u0060
}

// OrderService calls PaymentService with mTLS authentication
func chargeCustomer(order ChargeRequest) error {
    // Create authenticated M2M client
    config := m2mauth.Config{
        CertFile: "/certs/order-service-cert.pem",
        KeyFile:  "/certs/order-service-key.pem",
        CAFile:   "/certs/ca-cert.pem",
    }

    client, err := m2mauth.NewClient(config)
    if err != nil {
        return fmt.Errorf("failed to create M2M client: %w", err)
    }

    // Marshal the request
    body, _ := json.Marshal(order)

    // Call Payment Service — mTLS proves we ARE the Order Service
    resp, err := client.Post(
        "https://payment-service.internal:8443/api/charge",
        "application/json",
        bytes.NewReader(body),
    )
    if err != nil {
        return fmt.Errorf("payment request failed: %w", err)
    }
    defer resp.Body.Close()

    if resp.StatusCode != http.StatusOK {
        return fmt.Errorf("payment failed with status: %d", resp.StatusCode)
    }

    log.Printf("Payment successful for order %s", order.OrderID)
    return nil
}

// ── Example 2: Payment Service (server side) ──
// Only accepts calls from Order Service — rejects everything else

func main() {
    config := m2mauth.Config{
        CertFile: "/certs/payment-service-cert.pem",
        KeyFile:  "/certs/payment-service-key.pem",
        CAFile:   "/certs/ca-cert.pem",
    }

    mux := http.NewServeMux()

    mux.HandleFunc("/api/charge", func(w http.ResponseWriter, r *http.Request) {
        // At this point, mTLS has already verified the caller's certificate.
        // The caller IS the Order Service (or whoever holds the client cert
        // signed by our CA). No API key needed, no JWT needed.

        var req ChargeRequest
        if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
            http.Error(w, "Invalid request", http.StatusBadRequest)
            return
        }

        // Process the payment
        log.Printf("Processing payment: order=%s amount=%.2f %s",
            req.OrderID, req.Amount, req.Currency)

        // In production: call Stripe, validate amount, check fraud, etc.

        w.WriteHeader(http.StatusOK)
        json.NewEncoder(w).Encode(map[string]string{
            "status":     "success",
            "payment_id": "pay_" + req.OrderID,
        })
    })

    mux.HandleFunc("/api/health", func(w http.ResponseWriter, r *http.Request) {
        fmt.Fprintln(w, "OK")
    })

    server, err := m2mauth.NewServer(config, mux)
    if err != nil {
        log.Fatalf("Failed to create server: %v", err)
    }

    log.Println("Payment Service running on :8443 (mTLS required)")
    log.Fatal(server.ListenAndServeTLS(":8443"))
}</code></pre>

      <h2>Example: Inventory Check with Circuit Breaker</h2>

      <pre><code>// Real production pattern: m2mauth + circuit breaker + retry
// Order Service checks inventory before placing an order

package main

import (
    "context"
    "encoding/json"
    "fmt"
    "log"
    "net/http"
    "time"

    "github.com/vishalanandl177/m2mauth"
)

type InventoryClient struct {
    httpClient *http.Client
    baseURL    string
}

func NewInventoryClient(certFile, keyFile, caFile, baseURL string) (*InventoryClient, error) {
    config := m2mauth.Config{
        CertFile: certFile,
        KeyFile:  keyFile,
        CAFile:   caFile,
    }

    client, err := m2mauth.NewClient(config)
    if err != nil {
        return nil, err
    }

    // Add timeout (production-critical)
    client.Timeout = 5 * time.Second

    return &InventoryClient{
        httpClient: client,
        baseURL:    baseURL,
    }, nil
}

type StockResponse struct {
    ProductID string \u0060json:"product_id"\u0060
    Available int    \u0060json:"available"\u0060
    Reserved  int    \u0060json:"reserved"\u0060
}

func (ic *InventoryClient) CheckStock(ctx context.Context, productID string) (*StockResponse, error) {
    url := fmt.Sprintf("%s/api/stock/%s", ic.baseURL, productID)

    req, err := http.NewRequestWithContext(ctx, "GET", url, nil)
    if err != nil {
        return nil, err
    }

    resp, err := ic.httpClient.Do(req)
    if err != nil {
        return nil, fmt.Errorf("inventory service unreachable: %w", err)
    }
    defer resp.Body.Close()

    if resp.StatusCode != http.StatusOK {
        return nil, fmt.Errorf("inventory check failed: status %d", resp.StatusCode)
    }

    var stock StockResponse
    if err := json.NewDecoder(resp.Body).Decode(&stock); err != nil {
        return nil, err
    }

    return &stock, nil
}

func (ic *InventoryClient) ReserveStock(ctx context.Context, productID string, qty int) error {
    url := fmt.Sprintf("%s/api/stock/%s/reserve", ic.baseURL, productID)
    body := fmt.Sprintf(\u0060{"quantity": %d}\u0060, qty)

    req, err := http.NewRequestWithContext(ctx, "POST", url,
        bytes.NewBufferString(body))
    if err != nil {
        return err
    }
    req.Header.Set("Content-Type", "application/json")

    resp, err := ic.httpClient.Do(req)
    if err != nil {
        return fmt.Errorf("reserve failed: %w", err)
    }
    defer resp.Body.Close()

    if resp.StatusCode != http.StatusOK {
        return fmt.Errorf("reserve failed: status %d", resp.StatusCode)
    }
    return nil
}

// Usage in Order Service:
// inventory, _ := NewInventoryClient(
//     "/certs/order-cert.pem", "/certs/order-key.pem",
//     "/certs/ca-cert.pem", "https://inventory-service.internal:8443",
// )
// stock, err := inventory.CheckStock(ctx, "PROD-123")
// if stock.Available >= orderQty {
//     inventory.ReserveStock(ctx, "PROD-123", orderQty)
// }</code></pre>

      <h2>Example: SPIFFE + m2mauth Migration (Gradual)</h2>

      <p>You don't need to switch from m2mauth to SPIRE all at once. Here's how to migrate gradually — one service at a time:</p>

      <pre><code>// service_auth.go — Abstraction that supports both m2mauth and SPIFFE
package auth

import (
    "crypto/tls"
    "net/http"
    "os"

    "github.com/vishalanandl177/m2mauth"
    "github.com/spiffe/go-spiffe/v2/workloadapi"
)

// NewAuthenticatedClient returns an mTLS HTTP client.
// Uses SPIFFE if SPIFFE_ENDPOINT_SOCKET is set, otherwise m2mauth.
func NewAuthenticatedClient() (*http.Client, error) {
    spiffeSocket := os.Getenv("SPIFFE_ENDPOINT_SOCKET")

    if spiffeSocket != "" {
        // Production: Use SPIFFE/SPIRE (auto-rotated certificates)
        source, err := workloadapi.NewX509Source(context.Background())
        if err != nil {
            return nil, fmt.Errorf("SPIFFE source failed: %w", err)
        }
        tlsConfig := tlsconfig.MTLSClientConfig(source, source,
            tlsconfig.AuthorizeAny())
        return &http.Client{
            Transport: &http.Transport{TLSClientConfig: tlsConfig},
        }, nil
    }

    // Development/staging: Use m2mauth (static certificates)
    config := m2mauth.Config{
        CertFile: os.Getenv("TLS_CERT_FILE"),
        KeyFile:  os.Getenv("TLS_KEY_FILE"),
        CAFile:   os.Getenv("TLS_CA_FILE"),
    }
    return m2mauth.NewClient(config)
}

// In your service code — works with both:
// client, err := auth.NewAuthenticatedClient()
// resp, err := client.Get("https://payment-service:8443/api/charge")

// Migration strategy:
// 1. Deploy SPIRE to your cluster
// 2. Set SPIFFE_ENDPOINT_SOCKET on ONE service
// 3. That service uses SPIRE, all others still use m2mauth
// 4. Both work because they're both mTLS — compatible!
// 5. Gradually migrate all services to SPIRE
// 6. Remove static cert files when all services are on SPIRE</code></pre>

      <!-- Migration Strategy -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">Gradual Migration: m2mauth &#x2192; SPIFFE/SPIRE</div>
        <div class="timeline">
          <div class="timeline-item" style="--c:#3b82f6"><div class="timeline-item-title" style="color:#3b82f6">Phase 1: All services use m2mauth (static certs)</div><div class="timeline-item-desc">Quick setup. Works for dev, staging, and small production. Manual cert rotation.</div></div>
          <div class="timeline-item" style="--c:#7c3aed"><div class="timeline-item-title" style="color:#7c3aed">Phase 2: Deploy SPIRE, migrate first service</div><div class="timeline-item-desc">Install SPIRE server + agents. Migrate one non-critical service. Both still talk mTLS — fully compatible.</div></div>
          <div class="timeline-item" style="--c:#f97316"><div class="timeline-item-title" style="color:#f97316">Phase 3: Migrate remaining services one at a time</div><div class="timeline-item-desc">Each service switches from static certs to SPIRE SVIDs. No downtime — mTLS works with both cert sources.</div></div>
          <div class="timeline-item" style="--c:#22c55e"><div class="timeline-item-title" style="color:#22c55e">Phase 4: Full SPIRE — remove static certs</div><div class="timeline-item-desc">All services on SPIRE. Auto-rotation, cross-cluster federation, zero manual cert management.</div></div>
        </div>
      </div>

      <h2>Getting Started: The Practical Path</h2>

      <!-- Path -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">Your M2M Auth Journey</div>
        <div class="pipeline">
          <div class="pipeline-step" style="background:#3b82f6;--i:0"><span class="pipeline-step-icon">1</span>m2mauth<span class="pipeline-step-sub">Start here. Static certs.</span></div>
          <div class="pipeline-arrow">&#x2192;</div>
          <div class="pipeline-step" style="background:#7c3aed;--i:1"><span class="pipeline-step-icon">2</span>cert-manager<span class="pipeline-step-sub">Auto-rotate in K8s</span></div>
          <div class="pipeline-arrow">&#x2192;</div>
          <div class="pipeline-step" style="background:#22c55e;--i:2"><span class="pipeline-step-icon">3</span>SPIFFE/SPIRE<span class="pipeline-step-sub">Full identity platform</span></div>
        </div>
      </div>

      <p>Start with <a href="https://github.com/vishalanandl177/m2mauth" target="_blank" rel="noopener noreferrer"><strong>m2mauth</strong></a> to get mTLS working in your Go services today. When you outgrow static certificates (20+ services, multi-cluster, compliance requirements), graduate to SPIFFE/SPIRE for automatic identity management. Both solve the same fundamental problem — proving "I am who I say I am" — at different scales.</p>
    `;
