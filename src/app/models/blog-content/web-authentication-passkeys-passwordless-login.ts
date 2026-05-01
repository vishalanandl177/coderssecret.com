export const CONTENT = `
      <p>Passwords are fundamentally broken. Users reuse them across sites, phishing steals them daily, and even hashed databases get breached. Passkeys replace passwords entirely with cryptographic key pairs stored on the user&rsquo;s device, authenticated with biometrics (fingerprint, face) or a device PIN. No password to remember, no password to steal.</p>

      <h2>How Passkeys Work</h2>

      <ol>
        <li><strong>Registration:</strong> The user&rsquo;s device generates a public/private key pair. The public key is sent to your server. The private key never leaves the device.</li>
        <li><strong>Authentication:</strong> Your server sends a random challenge. The device signs it with the private key (after biometric verification). Your server verifies the signature with the stored public key.</li>
      </ol>

      <p>The private key is protected by the device&rsquo;s secure enclave (TPM, Secure Enclave, Android Keystore). Even if your server is breached, attackers get only public keys &mdash; which are useless without the device.</p>

      <h2>WebAuthn API: Registration</h2>

      <pre><code>// Client-side: create a new passkey
async function registerPasskey() {
  // 1. Get registration options from your server
  const response = await fetch('/api/auth/register/options', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'alice@example.com' }),
  });
  const options = await response.json();

  // 2. Browser prompts user for biometric verification
  const credential = await navigator.credentials.create({
    publicKey: {
      challenge: base64ToBuffer(options.challenge),
      rp: {
        name: 'My App',
        id: 'example.com',    // Must match your domain
      },
      user: {
        id: base64ToBuffer(options.userId),
        name: 'alice@example.com',
        displayName: 'Alice Smith',
      },
      pubKeyCredParams: [
        { alg: -7, type: 'public-key' },    // ES256
        { alg: -257, type: 'public-key' },  // RS256
      ],
      authenticatorSelection: {
        authenticatorAttachment: 'platform',  // Device biometrics
        residentKey: 'required',              // Discoverable credential
        userVerification: 'required',         // Biometric required
      },
      timeout: 60000,
    },
  });

  // 3. Send credential to server for storage
  await fetch('/api/auth/register/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: credential.id,
      rawId: bufferToBase64(credential.rawId),
      response: {
        attestationObject: bufferToBase64(
          credential.response.attestationObject
        ),
        clientDataJSON: bufferToBase64(
          credential.response.clientDataJSON
        ),
      },
      type: credential.type,
    }),
  });
}</code></pre>

      <h2>WebAuthn API: Authentication</h2>

      <pre><code>// Client-side: authenticate with existing passkey
async function loginWithPasskey() {
  // 1. Get authentication options from server
  const response = await fetch('/api/auth/login/options', {
    method: 'POST',
  });
  const options = await response.json();

  // 2. Browser prompts for biometric verification
  const assertion = await navigator.credentials.get({
    publicKey: {
      challenge: base64ToBuffer(options.challenge),
      rpId: 'example.com',
      allowCredentials: [],  // Empty = discoverable (shows all passkeys)
      userVerification: 'required',
      timeout: 60000,
    },
  });

  // 3. Send signed assertion to server
  const result = await fetch('/api/auth/login/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: assertion.id,
      rawId: bufferToBase64(assertion.rawId),
      response: {
        authenticatorData: bufferToBase64(
          assertion.response.authenticatorData
        ),
        clientDataJSON: bufferToBase64(
          assertion.response.clientDataJSON
        ),
        signature: bufferToBase64(
          assertion.response.signature
        ),
      },
      type: assertion.type,
    }),
  });

  const session = await result.json();
  // User is now authenticated!
}</code></pre>

      <h2>Server-Side: Python Verification</h2>

      <pre><code># Using the py_webauthn library
from webauthn import (
    generate_registration_options,
    verify_registration_response,
    generate_authentication_options,
    verify_authentication_response,
)
from webauthn.helpers.structs import (
    AuthenticatorSelectionCriteria,
    ResidentKeyRequirement,
    UserVerificationRequirement,
)

# Registration options
def get_registration_options(user):
    options = generate_registration_options(
        rp_id="example.com",
        rp_name="My App",
        user_id=user.id.encode(),
        user_name=user.email,
        user_display_name=user.name,
        authenticator_selection=AuthenticatorSelectionCriteria(
            resident_key=ResidentKeyRequirement.REQUIRED,
            user_verification=UserVerificationRequirement.REQUIRED,
        ),
    )
    # Store challenge in session for verification
    session['challenge'] = options.challenge
    return options

# Verify registration
def verify_registration(credential_data):
    verification = verify_registration_response(
        credential=credential_data,
        expected_challenge=session['challenge'],
        expected_origin="https://example.com",
        expected_rp_id="example.com",
    )

    # Store credential for future authentication
    store_credential(
        user_id=current_user.id,
        credential_id=verification.credential_id,
        public_key=verification.credential_public_key,
        sign_count=verification.sign_count,
    )</code></pre>

      <h2>Passkeys vs Passwords Comparison</h2>

      <table>
        <thead>
          <tr>
            <th>Aspect</th>
            <th>Passwords</th>
            <th>Passkeys</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Phishing</td>
            <td>Vulnerable (users type on fake sites)</td>
            <td>Immune (domain-bound, cannot be phished)</td>
          </tr>
          <tr>
            <td>Breach impact</td>
            <td>Hashed passwords can be cracked</td>
            <td>Public keys are useless to attackers</td>
          </tr>
          <tr>
            <td>Reuse across sites</td>
            <td>Common (80% of users)</td>
            <td>Impossible (unique key per site)</td>
          </tr>
          <tr>
            <td>User experience</td>
            <td>Remember, type, reset</td>
            <td>Touch fingerprint sensor</td>
          </tr>
          <tr>
            <td>MFA needed</td>
            <td>Yes (passwords alone are weak)</td>
            <td>No (biometric + device is inherently 2FA)</td>
          </tr>
          <tr>
            <td>Cross-device</td>
            <td>Works everywhere</td>
            <td>Synced via iCloud/Google (or use QR code)</td>
          </tr>
        </tbody>
      </table>

      <h2>Progressive Enhancement Strategy</h2>

      <pre><code>// Check if the browser supports WebAuthn
function supportsPasskeys(): boolean {
  return window.PublicKeyCredential !== undefined &&
    typeof window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable === 'function';
}

// Check if a platform authenticator is available
async function hasPlatformAuth(): Promise&lt;boolean&gt; {
  if (!supportsPasskeys()) return false;
  return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
}

// Progressive enhancement:
// 1. Everyone gets username/password as baseline
// 2. If passkeys supported: show "Add Passkey" option in settings
// 3. On next login: offer "Sign in with Passkey" as primary option
// 4. Keep password as fallback for unsupported devices</code></pre>

      <h2>Key Takeaways</h2>

      <ul>
        <li><strong>Passkeys are phishing-proof</strong> &mdash; the private key is domain-bound and never transmitted</li>
        <li><strong>Passkeys are inherently two-factor:</strong> something you have (device) + something you are (biometric)</li>
        <li><strong>Use progressive enhancement</strong> &mdash; offer passkeys alongside passwords, do not force them</li>
        <li><strong>Store only public keys on your server</strong> &mdash; a breach exposes nothing usable</li>
        <li><strong>Discoverable credentials (resident keys)</strong> enable username-less login &mdash; the user just touches their fingerprint sensor</li>
        <li><strong>Major platforms support passkey sync:</strong> iCloud Keychain (Apple), Google Password Manager, Windows Hello</li>
        <li><strong>Libraries handle the crypto:</strong> py_webauthn (Python), SimpleWebAuthn (Node.js), webauthn4j (Java)</li>
      </ul>

      <p>Passkeys are the future of authentication, and the future is already here. Apple, Google, and Microsoft have committed to universal passkey support. Start with progressive enhancement &mdash; add passkey registration alongside existing password auth &mdash; and give your users the option to never type a password again.</p>
    `;
