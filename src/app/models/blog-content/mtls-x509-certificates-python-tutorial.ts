export const CONTENT = `
      <p>Regular TLS (HTTPS) only verifies the <em>server's</em> identity — the client checks the server's certificate, but the server has no idea who the client is. <strong>Mutual TLS (mTLS)</strong> adds client verification: both sides present certificates and verify each other. It's the gold standard for <strong>zero-trust service-to-service communication</strong>, used by service meshes (Istio, Linkerd), banking systems, and any environment where API keys aren't secure enough.</p>

      <h2>How TLS vs mTLS Works</h2>

      <!-- TLS vs mTLS -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">Regular TLS vs Mutual TLS</div>
        <div class="vs-cards">
          <div class="vs-card" style="border-color:#3b82f6">
            <div class="vs-card-header" style="background:#3b82f6">&#x1F512; Regular TLS (HTTPS)</div>
            <div class="vs-card-body">
              <div class="vs-row"><span class="vs-row-icon">&#x2705;</span>Server proves identity to client</div>
              <div class="vs-row"><span class="vs-row-icon">&#x274C;</span>Client is anonymous to server</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F511;</span>Auth via: API keys, JWT, session</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F3AF;</span>Used by: websites, public APIs</div>
            </div>
          </div>
          <div class="vs-badge">VS</div>
          <div class="vs-card" style="border-color:#22c55e">
            <div class="vs-card-header" style="background:#22c55e">&#x1F510; Mutual TLS (mTLS)</div>
            <div class="vs-card-body">
              <div class="vs-row"><span class="vs-row-icon">&#x2705;</span>Server proves identity to client</div>
              <div class="vs-row"><span class="vs-row-icon">&#x2705;</span>Client proves identity to server</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F511;</span>Auth via: X.509 certificates</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F3AF;</span>Used by: microservices, zero-trust</div>
            </div>
          </div>
        </div>
      </div>

      <h2>The mTLS Handshake — Step by Step</h2>

      <!-- mTLS Handshake Flow -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">mTLS Handshake Flow</div>
        <div class="seq-diagram">
          <div class="seq-actors">
            <div class="seq-actor browser">Client<span class="seq-actor-sub">(Service A)</span></div>
            <div class="seq-actor idp">TLS Handshake<span class="seq-actor-sub">(Protocol)</span></div>
            <div class="seq-actor sp">Server<span class="seq-actor-sub">(Service B)</span></div>
          </div>
          <div class="seq-steps">
            <div class="seq-step">
              <div class="seq-arrow full-right" style="--arrow-color:#3b82f6"><span class="seq-num blue">1</span> ClientHello (supported ciphers, TLS version)</div>
            </div>
            <div class="seq-step">
              <div class="seq-arrow full-left" style="--arrow-color:#22c55e"><span class="seq-num green">2</span> ServerHello + Server Certificate + CertificateRequest</div>
            </div>
            <div class="seq-step">
              <div></div>
              <div class="seq-action" style="border-color:#3b82f6;color:#60a5fa">Client verifies server cert against CA</div>
            </div>
            <div class="seq-step">
              <div class="seq-arrow full-right" style="--arrow-color:#f97316"><span class="seq-num orange">3</span> Client Certificate + CertificateVerify + KeyExchange</div>
            </div>
            <div class="seq-step">
              <div></div>
              <div></div>
              <div class="seq-action" style="border-color:#22c55e;color:#4ade80">Server verifies client cert against CA</div>
            </div>
            <div class="seq-step">
              <div class="seq-arrow full-left" style="--arrow-color:#22c55e"><span class="seq-num green">4</span> Finished (both verified!) &#x1F510;</div>
            </div>
            <div class="seq-step">
              <div class="seq-arrow full-right" style="--arrow-color:#7c3aed"><span class="seq-num purple">5</span> Encrypted application data flows both ways &#x2705;</div>
            </div>
          </div>
        </div>
      </div>

      <h2>X.509 Certificates Explained</h2>
      <p>An <strong>X.509 certificate</strong> is a digital document that binds a public key to an identity. It's the standard format used by TLS, HTTPS, and mTLS. Here's what's inside:</p>

      <!-- X.509 Structure -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">Inside an X.509 Certificate</div>
        <div class="layer-diagram">
          <div class="layer-item" style="background:#3b82f6">Subject (Who is this?)<span class="layer-item-sub">CN=service-a.example.com, O=MyCompany, OU=Engineering</span></div>
          <div class="layer-item" style="background:#7c3aed">Issuer (Who signed it?)<span class="layer-item-sub">CN=MyCompany Internal CA — the Certificate Authority that vouches for this cert</span></div>
          <div class="layer-item" style="background:#f97316">Public Key<span class="layer-item-sub">RSA 2048-bit or ECDSA P-256 — used for key exchange during TLS handshake</span></div>
          <div class="layer-item" style="background:#22c55e">Validity Period<span class="layer-item-sub">Not Before: 2026-04-01, Not After: 2027-04-01 — expired certs are rejected</span></div>
          <div class="layer-item" style="background:#ef4444">Extensions (SAN, Key Usage)<span class="layer-item-sub">Subject Alternative Names (DNS/IP), Key Usage (digital signature, key encipherment)</span></div>
          <div class="layer-item" style="background:#ec4899">Digital Signature<span class="layer-item-sub">Signed by the CA's private key — proves the cert hasn't been tampered with</span></div>
        </div>
      </div>

      <h2>Certificate Chain of Trust</h2>
      <p>Certificates form a <strong>chain of trust</strong>:</p>
      <ul>
        <li><strong>Root CA:</strong> Self-signed certificate at the top of the chain. Trusted by all parties (you install it as a "trusted root").</li>
        <li><strong>Intermediate CA (optional):</strong> Signed by the Root CA. Used to issue end-entity certificates. Keeps the Root CA offline and safe.</li>
        <li><strong>End-Entity Certificate:</strong> The actual server or client certificate. Signed by the Intermediate CA (or directly by the Root CA).</li>
      </ul>

      <!-- Trust Chain -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">Certificate Chain of Trust</div>
        <div class="pipeline">
          <div class="pipeline-step" style="background:#ef4444;--i:0"><span class="pipeline-step-icon">&#x1F3E0;</span>Root CA<span class="pipeline-step-sub">Self-signed, offline</span></div>
          <div class="pipeline-arrow">&#x2192;</div>
          <div class="pipeline-step" style="background:#f97316;--i:1"><span class="pipeline-step-icon">&#x1F3E2;</span>Intermediate<span class="pipeline-step-sub">Signs end certs</span></div>
          <div class="pipeline-arrow">&#x2192;</div>
          <div class="pipeline-step" style="background:#3b82f6;--i:2"><span class="pipeline-step-icon">&#x1F4BB;</span>Server Cert<span class="pipeline-step-sub">service-b.local</span></div>
          <div class="pipeline-arrow">+</div>
          <div class="pipeline-step" style="background:#22c55e;--i:3"><span class="pipeline-step-icon">&#x1F4F1;</span>Client Cert<span class="pipeline-step-sub">service-a.local</span></div>
        </div>
      </div>

      <h2>Step 1: Generate Your Own Certificate Authority</h2>
      <p>In production, you'd use a managed CA (AWS Private CA, Vault PKI, cert-manager). For learning, we'll create our own CA using Python's <code>cryptography</code> library — no OpenSSL CLI needed.</p>
      <pre><code># pip install cryptography flask requests

# generate_certs.py — Complete PKI setup in Python
from cryptography import x509
from cryptography.x509.oid import NameOID, ExtendedKeyUsageOID
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import rsa
from datetime import datetime, timedelta, timezone
import ipaddress
import os

def generate_private_key():
    """Generate a 2048-bit RSA private key."""
    return rsa.generate_private_key(
        public_exponent=65537,
        key_size=2048,
    )

def save_key(key, filename):
    """Save a private key to PEM file."""
    with open(filename, "wb") as f:
        f.write(key.private_bytes(
            encoding=serialization.Encoding.PEM,
            format=serialization.PrivateFormat.TraditionalOpenSSL,
            encryption_algorithm=serialization.NoEncryption(),
        ))
    print(f"  Saved: {filename}")

def save_cert(cert, filename):
    """Save a certificate to PEM file."""
    with open(filename, "wb") as f:
        f.write(cert.public_bytes(serialization.Encoding.PEM))
    print(f"  Saved: {filename}")

# ════════════════════════════════════════════════
# STEP 1: Create the Root Certificate Authority
# ════════════════════════════════════════════════
print("\\n[1/3] Generating Root CA...")
ca_key = generate_private_key()

ca_name = x509.Name([
    x509.NameAttribute(NameOID.COUNTRY_NAME, "US"),
    x509.NameAttribute(NameOID.STATE_OR_PROVINCE_NAME, "California"),
    x509.NameAttribute(NameOID.ORGANIZATION_NAME, "MyCompany"),
    x509.NameAttribute(NameOID.COMMON_NAME, "MyCompany Root CA"),
])

ca_cert = (
    x509.CertificateBuilder()
    .subject_name(ca_name)
    .issuer_name(ca_name)  # Self-signed: issuer = subject
    .public_key(ca_key.public_key())
    .serial_number(x509.random_serial_number())
    .not_valid_before(datetime.now(timezone.utc))
    .not_valid_after(datetime.now(timezone.utc) + timedelta(days=3650))  # 10 years
    .add_extension(
        x509.BasicConstraints(ca=True, path_length=None), critical=True,
    )
    .add_extension(
        x509.KeyUsage(
            digital_signature=True, key_cert_sign=True, crl_sign=True,
            content_commitment=False, key_encipherment=False,
            data_encipherment=False, key_agreement=False,
            encipher_only=False, decipher_only=False,
        ), critical=True,
    )
    .sign(ca_key, hashes.SHA256())
)

os.makedirs("certs", exist_ok=True)
save_key(ca_key, "certs/ca-key.pem")
save_cert(ca_cert, "certs/ca-cert.pem")

# ════════════════════════════════════════════════
# STEP 2: Generate Server Certificate
# ════════════════════════════════════════════════
print("\\n[2/3] Generating Server Certificate...")
server_key = generate_private_key()

server_cert = (
    x509.CertificateBuilder()
    .subject_name(x509.Name([
        x509.NameAttribute(NameOID.COUNTRY_NAME, "US"),
        x509.NameAttribute(NameOID.ORGANIZATION_NAME, "MyCompany"),
        x509.NameAttribute(NameOID.COMMON_NAME, "server.local"),
    ]))
    .issuer_name(ca_name)  # Signed BY the CA
    .public_key(server_key.public_key())
    .serial_number(x509.random_serial_number())
    .not_valid_before(datetime.now(timezone.utc))
    .not_valid_after(datetime.now(timezone.utc) + timedelta(days=365))
    .add_extension(
        x509.SubjectAlternativeName([
            x509.DNSName("localhost"),
            x509.DNSName("server.local"),
            x509.IPAddress(ipaddress.IPv4Address("127.0.0.1")),
        ]), critical=False,
    )
    .add_extension(
        x509.ExtendedKeyUsage([
            ExtendedKeyUsageOID.SERVER_AUTH,  # This cert is for a SERVER
        ]), critical=False,
    )
    .sign(ca_key, hashes.SHA256())  # Signed with CA's private key
)

save_key(server_key, "certs/server-key.pem")
save_cert(server_cert, "certs/server-cert.pem")

# ════════════════════════════════════════════════
# STEP 3: Generate Client Certificate
# ════════════════════════════════════════════════
print("\\n[3/3] Generating Client Certificate...")
client_key = generate_private_key()

client_cert = (
    x509.CertificateBuilder()
    .subject_name(x509.Name([
        x509.NameAttribute(NameOID.COUNTRY_NAME, "US"),
        x509.NameAttribute(NameOID.ORGANIZATION_NAME, "MyCompany"),
        x509.NameAttribute(NameOID.ORGANIZATIONAL_UNIT_NAME, "Engineering"),
        x509.NameAttribute(NameOID.COMMON_NAME, "service-a"),
    ]))
    .issuer_name(ca_name)  # Also signed by the same CA
    .public_key(client_key.public_key())
    .serial_number(x509.random_serial_number())
    .not_valid_before(datetime.now(timezone.utc))
    .not_valid_after(datetime.now(timezone.utc) + timedelta(days=365))
    .add_extension(
        x509.ExtendedKeyUsage([
            ExtendedKeyUsageOID.CLIENT_AUTH,  # This cert is for a CLIENT
        ]), critical=False,
    )
    .sign(ca_key, hashes.SHA256())
)

save_key(client_key, "certs/client-key.pem")
save_cert(client_cert, "certs/client-cert.pem")

print("\\n Done! Generated files:")
print("  certs/ca-cert.pem       (Root CA certificate — share with all services)")
print("  certs/ca-key.pem        (Root CA private key — keep SECRET)")
print("  certs/server-cert.pem   (Server certificate)")
print("  certs/server-key.pem    (Server private key)")
print("  certs/client-cert.pem   (Client certificate)")
print("  certs/client-key.pem    (Client private key)")</code></pre>

      <pre><code># Run it:
python generate_certs.py

# Output:
# [1/3] Generating Root CA...
#   Saved: certs/ca-key.pem
#   Saved: certs/ca-cert.pem
# [2/3] Generating Server Certificate...
#   Saved: certs/server-key.pem
#   Saved: certs/server-cert.pem
# [3/3] Generating Client Certificate...
#   Saved: certs/client-key.pem
#   Saved: certs/client-cert.pem

# Verify the certs are valid:
python -c "
from cryptography import x509
cert = x509.load_pem_x509_certificate(open('certs/server-cert.pem','rb').read())
print(f'Subject: {cert.subject}')
print(f'Issuer:  {cert.issuer}')
print(f'Valid:   {cert.not_valid_before_utc} to {cert.not_valid_after_utc}')
san = cert.extensions.get_extension_for_class(x509.SubjectAlternativeName)
print(f'SANs:    {san.value.get_all_for(x509.DNSName)}')
"</code></pre>

      <h2>Step 2: Build the mTLS Server (Flask)</h2>
      <p>Now let's build a Flask server that <strong>requires client certificates</strong>:</p>
      <pre><code># mtls_server.py — Flask server with mutual TLS
import ssl
from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route("/api/data")
def get_data():
    # Extract client certificate info from the TLS connection
    client_cert = request.environ.get("peercert")

    if client_cert:
        # Get the client's identity from their certificate
        subject = dict(x[0] for x in client_cert.get("subject", ()))
        client_cn = subject.get("commonName", "unknown")
        client_org = subject.get("organizationName", "unknown")

        return jsonify({
            "message": "mTLS authentication successful!",
            "client_identity": {
                "common_name": client_cn,
                "organization": client_org,
            },
            "data": {
                "secret_value": 42,
                "items": ["alpha", "bravo", "charlie"],
            },
        })
    else:
        return jsonify({"error": "No client certificate provided"}), 403

@app.route("/api/health")
def health():
    return jsonify({"status": "ok", "tls": "mutual"})

if __name__ == "__main__":
    # Create SSL context with CLIENT CERTIFICATE VERIFICATION
    context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)

    # Load server's certificate and private key
    context.load_cert_chain(
        certfile="certs/server-cert.pem",
        keyfile="certs/server-key.pem",
    )

    # Load the CA certificate to verify client certificates
    context.load_verify_locations(cafile="certs/ca-cert.pem")

    # REQUIRE client certificates (this is what makes it "mutual")
    context.verify_mode = ssl.CERT_REQUIRED

    # Minimum TLS version (reject TLS 1.1 and below)
    context.minimum_version = ssl.TLSVersion.TLSv1_2

    print("mTLS server running on https://localhost:8443")
    print("Client certificate REQUIRED for all connections")
    app.run(
        host="0.0.0.0",
        port=8443,
        ssl_context=context,
        debug=False,
    )</code></pre>

      <h2>Step 3: Build the mTLS Client</h2>
      <pre><code># mtls_client.py — Python client with mutual TLS
import requests
import json

# ── WILL FAIL: No client certificate ──────────
try:
    response = requests.get(
        "https://localhost:8443/api/data",
        verify="certs/ca-cert.pem",  # Trust the server's CA
        # No client cert! Server will reject this.
    )
except requests.exceptions.SSLError as e:
    print(f"REJECTED (no client cert): {e}")
    # Output: SSLError: certificate required

# ── WILL SUCCEED: With client certificate ──────
response = requests.get(
    "https://localhost:8443/api/data",
    cert=("certs/client-cert.pem", "certs/client-key.pem"),  # Client cert + key
    verify="certs/ca-cert.pem",  # Trust the server's CA
)

print(f"Status: {response.status_code}")
print(f"Response: {json.dumps(response.json(), indent=2)}")
# Output:
# Status: 200
# Response: {
#   "message": "mTLS authentication successful!",
#   "client_identity": {
#     "common_name": "service-a",
#     "organization": "MyCompany"
#   },
#   "data": {
#     "secret_value": 42,
#     "items": ["alpha", "bravo", "charlie"]
#   }
# }

# ── WILL FAIL: Wrong CA (untrusted cert) ──────
try:
    response = requests.get(
        "https://localhost:8443/api/data",
        cert=("certs/client-cert.pem", "certs/client-key.pem"),
        verify=False,  # Skip server verification (DON'T do this in production!)
    )
except Exception as e:
    print(f"Error: {e}")</code></pre>

      <h2>Step 4: Production-Ready mTLS Server</h2>
      <p>For production, use <strong>gunicorn</strong> with SSL instead of Flask's development server:</p>
      <pre><code># Install gunicorn
pip install gunicorn

# Run with mTLS:
gunicorn mtls_server:app \\
  --bind 0.0.0.0:8443 \\
  --certfile certs/server-cert.pem \\
  --keyfile certs/server-key.pem \\
  --ca-certs certs/ca-cert.pem \\
  --cert-reqs 2 \\
  --ssl-version TLSv1_2 \\
  --workers 4 \\
  --timeout 30

# --cert-reqs 2 = ssl.CERT_REQUIRED (mTLS enforced)
# --cert-reqs 1 = ssl.CERT_OPTIONAL (mTLS optional)
# --cert-reqs 0 = ssl.CERT_NONE (regular TLS only)</code></pre>

      <h2>Certificate Rotation</h2>
      <p>Certificates expire. You need an automated rotation strategy:</p>
      <pre><code># rotate_certs.py — Automated certificate renewal
from datetime import datetime, timezone
from cryptography import x509

def check_expiry(cert_path, warn_days=30):
    """Check if a certificate is near expiry."""
    with open(cert_path, "rb") as f:
        cert = x509.load_pem_x509_certificate(f.read())

    days_left = (cert.not_valid_after_utc - datetime.now(timezone.utc)).days

    if days_left <= 0:
        print(f"EXPIRED: {cert_path} expired {abs(days_left)} days ago!")
        return "expired"
    elif days_left <= warn_days:
        print(f"WARNING: {cert_path} expires in {days_left} days!")
        return "warning"
    else:
        print(f"OK: {cert_path} valid for {days_left} more days")
        return "ok"

# Check all certs
for cert_file in ["certs/ca-cert.pem", "certs/server-cert.pem", "certs/client-cert.pem"]:
    check_expiry(cert_file)

# In production:
# 1. Run this as a daily cron job / K8s CronJob
# 2. When "warning": auto-generate new cert, signed by same CA
# 3. Rolling restart services with new certs
# 4. Tools: cert-manager (K8s), HashiCorp Vault PKI, AWS Private CA</code></pre>

      <h2>mTLS in Docker</h2>
      <pre><code># Dockerfile for the mTLS server
FROM python:3.12-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY mtls_server.py .
COPY certs/ certs/

EXPOSE 8443

CMD ["gunicorn", "mtls_server:app", \\
     "--bind", "0.0.0.0:8443", \\
     "--certfile", "certs/server-cert.pem", \\
     "--keyfile", "certs/server-key.pem", \\
     "--ca-certs", "certs/ca-cert.pem", \\
     "--cert-reqs", "2"]

# docker-compose.yml
# version: '3.8'
# services:
#   server:
#     build: .
#     ports:
#       - "8443:8443"
#     volumes:
#       - ./certs:/app/certs:ro   # Mount certs read-only
#
#   client:
#     build: .
#     command: python mtls_client.py
#     volumes:
#       - ./certs:/app/certs:ro
#     depends_on:
#       - server</code></pre>

      <h2>mTLS with Kubernetes (cert-manager)</h2>
      <pre><code># In Kubernetes, use cert-manager to automate certificate lifecycle

# 1. Install cert-manager
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.14.0/cert-manager.yaml

# 2. Create a self-signed Issuer (for internal mTLS)
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: internal-ca
spec:
  selfSigned: {}

---
# 3. Create a CA Certificate
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: internal-ca-cert
  namespace: cert-manager
spec:
  isCA: true
  commonName: internal-ca
  secretName: internal-ca-secret
  issuerRef:
    name: internal-ca
    kind: ClusterIssuer

---
# 4. Create an Issuer that uses the CA
apiVersion: cert-manager.io/v1
kind: Issuer
metadata:
  name: internal-issuer
spec:
  ca:
    secretName: internal-ca-secret

---
# 5. Request a server certificate (auto-renewed!)
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: server-tls
spec:
  secretName: server-tls-secret
  duration: 720h    # 30 days
  renewBefore: 168h # Renew 7 days before expiry
  commonName: my-service.default.svc.cluster.local
  dnsNames:
    - my-service
    - my-service.default
    - my-service.default.svc.cluster.local
  usages:
    - server auth
    - client auth   # Enable for mTLS
  issuerRef:
    name: internal-issuer

# The certificate is auto-mounted as a Kubernetes Secret
# and auto-renewed before expiry. No manual rotation needed!</code></pre>

      <h2>Security Best Practices</h2>

      <!-- Best Practices -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">mTLS Security Checklist</div>
        <div class="timeline">
          <div class="timeline-item" style="--c:#22c55e"><div class="timeline-item-title" style="color:#22c55e">Keep CA private key offline</div><div class="timeline-item-desc">The CA key can issue trusted certs for ANY service. Store in HSM or Vault, never on a server.</div></div>
          <div class="timeline-item" style="--c:#3b82f6"><div class="timeline-item-title" style="color:#3b82f6">Short certificate lifetimes</div><div class="timeline-item-desc">30-90 days for end-entity certs. Auto-renew with cert-manager or Vault PKI.</div></div>
          <div class="timeline-item" style="--c:#7c3aed"><div class="timeline-item-title" style="color:#7c3aed">Use SAN extensions</div><div class="timeline-item-desc">Always include Subject Alternative Names (DNS/IP). Modern TLS ignores the CN field.</div></div>
          <div class="timeline-item" style="--c:#f97316"><div class="timeline-item-title" style="color:#f97316">Enforce TLS 1.2+ minimum</div><div class="timeline-item-desc">TLS 1.0 and 1.1 have known vulnerabilities. Set minimum_version = TLSv1_2.</div></div>
          <div class="timeline-item" style="--c:#ef4444"><div class="timeline-item-title" style="color:#ef4444">Implement Certificate Revocation</div><div class="timeline-item-desc">Use CRL (Certificate Revocation Lists) or OCSP to revoke compromised certs instantly.</div></div>
          <div class="timeline-item" style="--c:#ec4899"><div class="timeline-item-title" style="color:#ec4899">Monitor certificate expiry</div><div class="timeline-item-desc">Alert 30 days before expiry. Expired certs = service outage at 3 AM.</div></div>
        </div>
      </div>

      <h2>When to Use mTLS</h2>
      <ul>
        <li><strong>Microservice-to-microservice:</strong> Internal APIs within your cluster. Service meshes (Istio, Linkerd) automate this completely.</li>
        <li><strong>Zero-trust networks:</strong> Don't trust the network — verify every connection. mTLS ensures only authorized services communicate.</li>
        <li><strong>Financial/healthcare systems:</strong> Regulatory requirements (PCI-DSS, HIPAA) often mandate mutual authentication.</li>
        <li><strong>IoT device authentication:</strong> Each device gets a unique certificate — more secure than shared API keys.</li>
        <li><strong>Cross-organization APIs:</strong> When two companies need to securely exchange data, each side presents certificates signed by agreed-upon CAs.</li>
      </ul>

      <p>mTLS is the strongest form of service authentication available. It eliminates shared secrets (API keys), prevents man-in-the-middle attacks, and provides cryptographic proof of identity for both sides of every connection. With tools like cert-manager and the Python <code>cryptography</code> library, setting up mTLS is no longer reserved for security experts — any developer can build it.</p>
    `;
