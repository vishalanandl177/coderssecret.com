export const CONTENT = `
      <p>Every time you log in, make a payment, or send a message, cryptography is silently protecting you. But most developers treat it as a black box — "just use HTTPS and bcrypt." This guide gives you a <strong>practical understanding</strong> of how encryption, hashing, and digital signatures actually work, with Python code for every concept and clear guidance on when to use what.</p>

      <h2>The Three Pillars of Cryptography</h2>

      <!-- Three Pillars -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">Cryptography: Three Core Concepts</div>
        <div class="hub-apps" style="max-width:500px;margin:0 auto;grid-template-columns:1fr 1fr 1fr">
          <div class="hub-app" style="animation-delay:0.1s"><span class="hub-app-icon">&#x1F510;</span>Encryption<span class="hub-app-sub">Protect confidentiality</span></div>
          <div class="hub-app" style="background:#a855f7;animation-delay:0.25s"><span class="hub-app-icon">&#x1F5C3;</span>Hashing<span class="hub-app-sub">Verify integrity</span></div>
          <div class="hub-app" style="background:#f97316;animation-delay:0.4s"><span class="hub-app-icon">&#x270D;</span>Signatures<span class="hub-app-sub">Prove authenticity</span></div>
        </div>
      </div>

      <ul>
        <li><strong>Encryption:</strong> Scramble data so only authorized parties can read it. Reversible — you can decrypt to get the original data back.</li>
        <li><strong>Hashing:</strong> Generate a fixed-size fingerprint of data. <em>Not reversible</em> — you can't get the original data from the hash. Used for integrity checks and passwords.</li>
        <li><strong>Digital Signatures:</strong> Prove that a message was sent by a specific person and hasn't been tampered with. Combines hashing + asymmetric encryption.</li>
      </ul>

      <h2>Part 1: Encryption</h2>
      <p>Encryption transforms readable data (<strong>plaintext</strong>) into scrambled data (<strong>ciphertext</strong>) using a <strong>key</strong>. Only someone with the correct key can reverse the process (decrypt). There are two types:</p>

      <!-- Symmetric vs Asymmetric -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">Symmetric vs Asymmetric Encryption</div>
        <div class="vs-cards">
          <div class="vs-card" style="border-color:#3b82f6">
            <div class="vs-card-header" style="background:#3b82f6">&#x1F511; Symmetric (One Key)</div>
            <div class="vs-card-body">
              <div class="vs-row"><span class="vs-row-icon">&#x1F511;</span>Same key encrypts and decrypts</div>
              <div class="vs-row"><span class="vs-row-icon">&#x26A1;</span>Fast (1000x faster than asymmetric)</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F4E6;</span>Good for: bulk data encryption</div>
              <div class="vs-row"><span class="vs-row-icon">&#x26A0;</span>Problem: how to share the key safely?</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F3AF;</span>AES-256, ChaCha20</div>
            </div>
          </div>
          <div class="vs-badge">VS</div>
          <div class="vs-card" style="border-color:#22c55e">
            <div class="vs-card-header" style="background:#22c55e">&#x1F510; Asymmetric (Key Pair)</div>
            <div class="vs-card-body">
              <div class="vs-row"><span class="vs-row-icon">&#x1F511;</span>Public key encrypts, private key decrypts</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F422;</span>Slow (for small data only)</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F4E6;</span>Good for: key exchange, signatures</div>
              <div class="vs-row"><span class="vs-row-icon">&#x2705;</span>No key sharing problem!</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F3AF;</span>RSA, ECDSA, Ed25519</div>
            </div>
          </div>
        </div>
      </div>

      <h2>AES-256: The Gold Standard for Symmetric Encryption</h2>
      <p><strong>AES</strong> (Advanced Encryption Standard) with a 256-bit key is used by governments, banks, and every HTTPS connection. It's fast, secure, and battle-tested.</p>
      <pre><code># pip install cryptography
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
import os

# ── AES-256-GCM (Authenticated Encryption) ────
# GCM mode provides BOTH encryption AND integrity verification
# If anyone tampers with the ciphertext, decryption fails

# Generate a random 256-bit key (store this securely!)
key = AESGCM.generate_key(bit_length=256)
print(f"Key (hex): {key.hex()}")
# Output: a 64-character hex string (32 bytes = 256 bits)

# Encrypt
plaintext = b"Patient record: John Doe, DOB 1990-01-15, Diagnosis: ..."
nonce = os.urandom(12)  # 96-bit nonce (MUST be unique per encryption!)
aes = AESGCM(key)
ciphertext = aes.encrypt(nonce, plaintext, None)
print(f"Encrypted: {ciphertext[:20].hex()}...")
# Output: gibberish bytes — completely unreadable

# Decrypt
decrypted = aes.decrypt(nonce, ciphertext, None)
print(f"Decrypted: {decrypted.decode()}")
# Output: "Patient record: John Doe, DOB 1990-01-15, Diagnosis: ..."

# ── With Associated Data (AAD) ─────────────────
# AAD is authenticated but NOT encrypted — useful for metadata
# (e.g., patient ID is visible but tamper-proof)
aad = b"patient-id:12345"
ciphertext = aes.encrypt(nonce, plaintext, aad)
decrypted = aes.decrypt(nonce, ciphertext, aad)  # Must provide same AAD
# If AAD is modified, decryption raises InvalidTag

# ⚠️ CRITICAL: Never reuse a nonce with the same key!
# AES-GCM with a repeated nonce is catastrophically broken.
# Always use os.urandom(12) for each encryption.</code></pre>

      <h2>RSA: Asymmetric Encryption &amp; Key Exchange</h2>
      <pre><code>from cryptography.hazmat.primitives.asymmetric import rsa, padding
from cryptography.hazmat.primitives import hashes

# Generate RSA key pair (2048-bit minimum, 4096 for high security)
private_key = rsa.generate_private_key(
    public_exponent=65537,
    key_size=2048,
)
public_key = private_key.public_key()

# ── Encrypt with public key, decrypt with private key ──
message = b"Top secret: the launch code is 12345"

# Anyone with the public key can encrypt
ciphertext = public_key.encrypt(
    message,
    padding.OAEP(
        mgf=padding.MGF1(algorithm=hashes.SHA256()),
        algorithm=hashes.SHA256(),
        label=None,
    ),
)
print(f"Encrypted ({len(ciphertext)} bytes): {ciphertext[:20].hex()}...")

# Only the private key holder can decrypt
decrypted = private_key.decrypt(
    ciphertext,
    padding.OAEP(
        mgf=padding.MGF1(algorithm=hashes.SHA256()),
        algorithm=hashes.SHA256(),
        label=None,
    ),
)
print(f"Decrypted: {decrypted.decode()}")

# ⚠️ RSA can only encrypt small data (< key size - padding)
# For large data: encrypt with AES, encrypt AES key with RSA
# This is called "hybrid encryption" — exactly how TLS works!</code></pre>

      <h2>How TLS Uses Both (Hybrid Encryption)</h2>

      <!-- TLS Hybrid -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">TLS: Asymmetric Key Exchange + Symmetric Data Encryption</div>
        <div class="seq-diagram">
          <div class="seq-actors">
            <div class="seq-actor browser">Client<span class="seq-actor-sub">(Browser)</span></div>
            <div class="seq-actor idp">Key Exchange<span class="seq-actor-sub">(Asymmetric)</span></div>
            <div class="seq-actor sp">Server<span class="seq-actor-sub">(HTTPS)</span></div>
          </div>
          <div class="seq-steps">
            <div class="seq-step">
              <div class="seq-arrow full-right" style="--arrow-color:#22c55e"><span class="seq-num green">1</span> Server sends RSA/ECDH public key (in certificate)</div>
            </div>
            <div class="seq-step">
              <div></div>
              <div class="seq-action" style="border-color:#7c3aed;color:#a78bfa">Both sides derive shared AES key (Diffie-Hellman)</div>
            </div>
            <div class="seq-step">
              <div class="seq-arrow full-right" style="--arrow-color:#3b82f6"><span class="seq-num blue">2</span> All data encrypted with AES-256-GCM (fast!)</div>
            </div>
            <div class="seq-step">
              <div class="seq-arrow full-left" style="--arrow-color:#3b82f6"><span class="seq-num blue">3</span> Response also AES encrypted</div>
            </div>
          </div>
        </div>
      </div>

      <h2>Part 2: Hashing Algorithms</h2>
      <p>A hash function takes any input and produces a <strong>fixed-size output</strong> (the hash/digest). It's a one-way function — you can't reverse it to get the original data. Two key properties: the same input always produces the same hash, and even a tiny change in input produces a completely different hash.</p>

      <pre><code>import hashlib

# ── SHA-256 (Secure Hash Algorithm) ────────────
message = b"Hello, World!"
hash_value = hashlib.sha256(message).hexdigest()
print(f"SHA-256: {hash_value}")
# Output: dffd6021bb2bd5b0af676290809ec3a53191dd81c7f70a4b28688a362182986f

# Change ONE character:
hash_value2 = hashlib.sha256(b"Hello, World?").hexdigest()
print(f"SHA-256: {hash_value2}")
# Output: 8945e5fdde8ac1e3a2db735cbc206e5ba97a835deab69e7e50bd2fc84e3a82f2
# Completely different! This is the "avalanche effect"

# ── Common hash algorithms ─────────────────────
algorithms = {
    "MD5":      hashlib.md5(message).hexdigest(),
    "SHA-1":    hashlib.sha1(message).hexdigest(),
    "SHA-256":  hashlib.sha256(message).hexdigest(),
    "SHA-512":  hashlib.sha512(message).hexdigest(),
    "SHA-3":    hashlib.sha3_256(message).hexdigest(),
    "BLAKE2":   hashlib.blake2b(message).hexdigest(),
}
for name, h in algorithms.items():
    print(f"{name:10}: {h[:32]}... ({len(h)//2} bytes)")

# Output:
# MD5       : ed076287532e86365e841e92bfc50d8c... (16 bytes) ← BROKEN, don't use!
# SHA-1     : 0a0a9f2a6772942557ab5355d76af442... (20 bytes) ← BROKEN, don't use!
# SHA-256   : dffd6021bb2bd5b0af676290809ec3a5... (32 bytes) ← Standard choice
# SHA-512   : 374d794a95cdcfd8b35993185fef9ba3... (64 bytes) ← Extra security
# SHA-3     : 1af17a664e3fa8e419b8ba05c2a173... (32 bytes) ← Latest standard
# BLAKE2    : 021ced8799296ceca557832ab941a50b... (64 bytes) ← Fastest secure hash</code></pre>

      <!-- Hash Algorithm Comparison -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">Hash Algorithm Comparison</div>
        <div style="overflow-x:auto">
          <table style="width:100%;border-collapse:collapse;font-size:0.78rem;min-width:500px">
            <thead>
              <tr>
                <th style="text-align:left;padding:0.6rem;background:#7c3aed;color:#fff;border-radius:0.4rem 0 0 0">Algorithm</th>
                <th style="text-align:center;padding:0.6rem;background:#7c3aed;color:#fff">Output Size</th>
                <th style="text-align:center;padding:0.6rem;background:#7c3aed;color:#fff">Security</th>
                <th style="text-align:left;padding:0.6rem;background:#7c3aed;color:#fff;border-radius:0 0.4rem 0 0">Use For</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:var(--foreground);font-weight:700">MD5</td><td style="padding:0.5rem;text-align:center">128-bit</td><td style="padding:0.5rem;text-align:center;color:#ef4444;font-weight:700">BROKEN</td><td style="padding:0.5rem;color:#ef4444">Never for security. Only checksums for non-critical files.</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:var(--foreground);font-weight:700">SHA-1</td><td style="padding:0.5rem;text-align:center">160-bit</td><td style="padding:0.5rem;text-align:center;color:#ef4444;font-weight:700">BROKEN</td><td style="padding:0.5rem;color:#ef4444">Legacy only. Git uses it but is migrating to SHA-256.</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:var(--foreground);font-weight:700">SHA-256</td><td style="padding:0.5rem;text-align:center">256-bit</td><td style="padding:0.5rem;text-align:center;color:#22c55e;font-weight:700">Strong</td><td style="padding:0.5rem">Default choice. TLS certs, JWT signatures, integrity checks.</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:var(--foreground);font-weight:700">SHA-3</td><td style="padding:0.5rem;text-align:center">256-bit</td><td style="padding:0.5rem;text-align:center;color:#22c55e;font-weight:700">Strong</td><td style="padding:0.5rem">Different design than SHA-2. Good if SHA-2 ever breaks.</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:var(--foreground);font-weight:700">BLAKE2</td><td style="padding:0.5rem;text-align:center">256/512-bit</td><td style="padding:0.5rem;text-align:center;color:#22c55e;font-weight:700">Strong</td><td style="padding:0.5rem">Fastest secure hash. File integrity, MACs.</td></tr>
              <tr><td style="padding:0.5rem;color:var(--foreground);font-weight:700">bcrypt/Argon2</td><td style="padding:0.5rem;text-align:center">Variable</td><td style="padding:0.5rem;text-align:center;color:#22c55e;font-weight:700">Designed for passwords</td><td style="padding:0.5rem;color:#22c55e;font-weight:700">Password storage ONLY. Intentionally slow.</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <h2>Password Hashing: bcrypt, scrypt, Argon2</h2>
      <p><strong>Never store passwords in plain text. Never use SHA-256 for passwords.</strong> Regular hash functions are too fast — an attacker can try billions of guesses per second. Password hashing algorithms are <em>intentionally slow</em> to make brute-force attacks impractical.</p>
      <pre><code># ── bcrypt (most widely used) ──────────────────
# pip install bcrypt
import bcrypt

password = b"my_secure_password_123"

# Hash (with automatic salt generation)
hashed = bcrypt.hashpw(password, bcrypt.gensalt(rounds=12))
print(f"bcrypt: {hashed.decode()}")
# Output: \\$2b\\$12\\$LJ3m4ys3Lg.Hy5OwF5IkNe7Yjv6RmXKN6bLHFhMGCNmYq3xKp.VK
# Format: \\$2b\\$ROUNDS\\$SALT+HASH

# Verify password
is_valid = bcrypt.checkpw(password, hashed)
print(f"Valid: {is_valid}")  # True

is_valid = bcrypt.checkpw(b"wrong_password", hashed)
print(f"Valid: {is_valid}")  # False

# ── Argon2 (winner of Password Hashing Competition) ──
# pip install argon2-cffi
from argon2 import PasswordHasher

ph = PasswordHasher(
    time_cost=3,      # Number of iterations
    memory_cost=65536, # 64 MB of RAM per hash (prevents GPU attacks)
    parallelism=4,     # Use 4 threads
)

hashed = ph.hash("my_secure_password_123")
print(f"Argon2: {hashed}")
# Output: \\$argon2id\\$v=19\\$m=65536,t=3,p=4\\$SALT\\$HASH

# Verify
try:
    ph.verify(hashed, "my_secure_password_123")
    print("Valid!")
except Exception:
    print("Invalid!")

# ── WHY is SHA-256 bad for passwords? ──────────
# SHA-256: 10 BILLION hashes/second on a GPU
# bcrypt(12): ~13 hashes/second on the same GPU
# Argon2: ~3 hashes/second (also needs 64MB RAM per attempt!)
# Brute-forcing a 10-char password:
#   SHA-256: hours
#   bcrypt:  centuries
#   Argon2:  longer than the universe</code></pre>

      <h2>HMAC: Hash-Based Message Authentication</h2>
      <p><strong>HMAC</strong> combines a hash function with a secret key to produce an authentication code. It proves both <em>integrity</em> (data wasn't tampered) and <em>authenticity</em> (sender knows the secret key).</p>
      <pre><code>import hmac
import hashlib

secret_key = b"my-webhook-secret-key"
message = b'{"event":"payment.completed","amount":100}'

# Create HMAC
signature = hmac.new(secret_key, message, hashlib.sha256).hexdigest()
print(f"HMAC-SHA256: {signature}")

# Verify HMAC (webhook receiver)
received_signature = signature  # From X-Signature header
expected = hmac.new(secret_key, message, hashlib.sha256).hexdigest()
is_valid = hmac.compare_digest(received_signature, expected)
print(f"Valid: {is_valid}")  # True
# hmac.compare_digest prevents timing attacks!

# Real-world uses of HMAC:
# 1. Webhook signatures (Stripe, GitHub, Slack)
# 2. JWT signatures (HS256 = HMAC-SHA256)
# 3. API request signing (AWS Signature V4)
# 4. Cookie integrity (prevent tampering)</code></pre>

      <h2>Part 3: Digital Signatures</h2>
      <p>A digital signature proves: (1) the message was sent by a specific entity, and (2) the message hasn't been modified. It uses asymmetric keys: <strong>sign with private key, verify with public key</strong>.</p>
      <pre><code>from cryptography.hazmat.primitives.asymmetric import ec, utils
from cryptography.hazmat.primitives import hashes

# ── ECDSA (Elliptic Curve Digital Signature Algorithm) ──
# Faster and smaller than RSA signatures
private_key = ec.generate_private_key(ec.SECP256R1())  # P-256 curve
public_key = private_key.public_key()

message = b"Transfer \\$1000 from account A to account B"

# Sign with private key (only the sender can do this)
signature = private_key.sign(
    message,
    ec.ECDSA(hashes.SHA256()),
)
print(f"Signature ({len(signature)} bytes): {signature[:20].hex()}...")

# Verify with public key (anyone can verify)
try:
    public_key.verify(signature, message, ec.ECDSA(hashes.SHA256()))
    print("Signature VALID - message is authentic and unmodified")
except Exception:
    print("Signature INVALID - message was tampered with!")

# Tamper with the message and try again:
tampered = b"Transfer \\$9999 from account A to account B"
try:
    public_key.verify(signature, tampered, ec.ECDSA(hashes.SHA256()))
    print("Valid")
except Exception:
    print("INVALID - tampering detected!")

# Real-world uses of digital signatures:
# 1. TLS certificates (CA signs server certificates)
# 2. JWT (RS256 = RSA signature, ES256 = ECDSA signature)
# 3. Code signing (Apple, Microsoft sign their software)
# 4. Git commits (gpg signed commits)
# 5. Blockchain transactions (prove ownership without revealing private key)</code></pre>

      <h2>The Complete Decision Guide</h2>

      <!-- Decision Guide -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">What to Use When</div>
        <div style="overflow-x:auto">
          <table style="width:100%;border-collapse:collapse;font-size:0.78rem;min-width:500px">
            <thead>
              <tr>
                <th style="text-align:left;padding:0.6rem;background:#ef4444;color:#fff;border-radius:0.4rem 0 0 0">I Need To...</th>
                <th style="text-align:left;padding:0.6rem;background:#ef4444;color:#fff">Use This</th>
                <th style="text-align:left;padding:0.6rem;background:#ef4444;color:#fff;border-radius:0 0.4rem 0 0">Algorithm</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:var(--foreground);font-weight:600">Encrypt data at rest</td><td style="padding:0.5rem;color:#3b82f6;font-weight:700">Symmetric encryption</td><td style="padding:0.5rem">AES-256-GCM</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:var(--foreground);font-weight:600">Encrypt data in transit</td><td style="padding:0.5rem;color:#3b82f6;font-weight:700">TLS (hybrid)</td><td style="padding:0.5rem">ECDHE + AES-256-GCM</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:var(--foreground);font-weight:600">Store passwords</td><td style="padding:0.5rem;color:#22c55e;font-weight:700">Password hash</td><td style="padding:0.5rem">Argon2id or bcrypt</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:var(--foreground);font-weight:600">Verify file integrity</td><td style="padding:0.5rem;color:#a855f7;font-weight:700">Hash function</td><td style="padding:0.5rem">SHA-256 or BLAKE2</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:var(--foreground);font-weight:600">Sign a JWT</td><td style="padding:0.5rem;color:#f97316;font-weight:700">Digital signature</td><td style="padding:0.5rem">RS256 (RSA) or ES256 (ECDSA)</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:var(--foreground);font-weight:600">Verify webhook payload</td><td style="padding:0.5rem;color:#f97316;font-weight:700">HMAC</td><td style="padding:0.5rem">HMAC-SHA256</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:var(--foreground);font-weight:600">Exchange keys securely</td><td style="padding:0.5rem;color:#22c55e;font-weight:700">Key exchange</td><td style="padding:0.5rem">ECDH (Diffie-Hellman)</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:var(--foreground);font-weight:600">Sign TLS certificates</td><td style="padding:0.5rem;color:#f97316;font-weight:700">Digital signature</td><td style="padding:0.5rem">RSA-2048 or ECDSA P-256</td></tr>
              <tr><td style="padding:0.5rem;color:var(--foreground);font-weight:600">Generate API tokens</td><td style="padding:0.5rem;color:#7c3aed;font-weight:700">CSPRNG</td><td style="padding:0.5rem">os.urandom() / secrets module</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <h2>Common Mistakes</h2>

      <!-- Mistakes Timeline -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">Cryptography Mistakes to Avoid</div>
        <div class="timeline">
          <div class="timeline-item" style="--c:#ef4444"><div class="timeline-item-title" style="color:#ef4444">Using MD5 or SHA-1 for anything security-related</div><div class="timeline-item-desc">Both are broken. Collisions can be generated in seconds. Use SHA-256+.</div></div>
          <div class="timeline-item" style="--c:#f97316"><div class="timeline-item-title" style="color:#f97316">Hashing passwords with SHA-256</div><div class="timeline-item-desc">Too fast! Use bcrypt or Argon2 — designed to be slow and memory-hard.</div></div>
          <div class="timeline-item" style="--c:#a855f7"><div class="timeline-item-title" style="color:#a855f7">Rolling your own crypto</div><div class="timeline-item-desc">Use established libraries (cryptography, NaCl/libsodium). Custom implementations will have bugs.</div></div>
          <div class="timeline-item" style="--c:#3b82f6"><div class="timeline-item-title" style="color:#3b82f6">Reusing nonces/IVs with AES-GCM</div><div class="timeline-item-desc">Catastrophic. Always use os.urandom() for each encryption operation.</div></div>
          <div class="timeline-item" style="--c:#22c55e"><div class="timeline-item-title" style="color:#22c55e">Comparing signatures with == instead of hmac.compare_digest()</div><div class="timeline-item-desc">String comparison leaks timing info. Use constant-time comparison for all security checks.</div></div>
          <div class="timeline-item" style="--c:#ec4899"><div class="timeline-item-title" style="color:#ec4899">Hardcoding encryption keys in source code</div><div class="timeline-item-desc">Use environment variables, KMS (AWS/GCP), or HashiCorp Vault. Never commit keys to git.</div></div>
        </div>
      </div>

      <p>Cryptography is the foundation of all software security. You don't need to implement algorithms from scratch — but you <em>do</em> need to choose the right tool for each job and use it correctly. Remember the three rules: <strong>AES for encrypting data, bcrypt/Argon2 for passwords, SHA-256 for integrity</strong>. Use established libraries, never reuse nonces, and keep your keys out of your code. That covers 95% of real-world cryptography needs.</p>
    `;
