export const CONTENT = `
      <p>OIDC workload federation is the pattern behind modern secretless access from CI jobs, Kubernetes Pods, service meshes, build systems, and external workloads into cloud APIs or internal platforms. The workload proves who it is with a short-lived OIDC token. The target system verifies that token and returns a different short-lived credential scoped to one role, audience, project, repository, namespace, or service account.</p>

      <p>The important shift is this: the workload no longer stores a long-lived cloud key, API key, service account key, or shared password. It presents identity evidence at runtime. Policy decides whether that exact workload is allowed to receive temporary access.</p>

      <aside class="callout callout-security">
        <strong>Security rule:</strong> an OIDC token is identity evidence, not permission by itself. Permission comes from the trust policy that maps issuer, audience, subject, and provider-specific claims to a narrowly scoped role.
      </aside>

      <h2>What OIDC Workload Federation Solves</h2>

      <p>Traditional automation often starts with a secret copied into the runtime environment. A GitHub Actions workflow stores an AWS access key. A Kubernetes Pod mounts a service account key. A build runner keeps a registry password. A batch job stores a database token in an environment variable. These credentials work, but they create the same operational problems over and over:</p>

      <ul>
        <li><strong>They are long-lived.</strong> If copied from CI logs, Git history, a compromised runner, or a mounted Secret, the attacker may use them later.</li>
        <li><strong>They are hard to scope.</strong> One static key often accumulates permissions because nobody wants to rotate it across every consumer.</li>
        <li><strong>They are hard to attribute.</strong> A cloud audit log may show that a key acted, but not which workflow run, branch, Pod, or service account caused it.</li>
        <li><strong>They spread.</strong> The same key appears in repository secrets, Helm values, Terraform state, support tickets, and local developer machines.</li>
      </ul>

      <p>OIDC workload federation replaces the stored credential with a runtime proof. The proof is usually a signed JWT containing claims such as <code>iss</code>, <code>sub</code>, <code>aud</code>, <code>iat</code>, and <code>exp</code>. The target system validates the signature and claims, checks a trust policy, and issues a short-lived token for the target API.</p>

      <h2>The Core Flow</h2>

      <p>The same shape appears across GitHub Actions to AWS, GitHub Actions to Google Cloud, Kubernetes to Azure, Kubernetes to Google Cloud, SPIFFE JWT-SVIDs to cloud APIs, and custom internal federation gateways.</p>

      <div class="flow-diagram" role="img" aria-label="OIDC workload federation flow from workload token to short-lived access token">
        <div class="flow-diagram-title">Workload OIDC Token &rarr; Trust Policy &rarr; Short-Lived Access</div>
        <div style="display:grid;grid-template-columns:repeat(5,minmax(150px,1fr));gap:0.75rem;min-width:860px">
          <div style="border:1px solid var(--md-sys-color-outline-variant);background:var(--md-sys-color-surface-container);border-radius:0.9rem;padding:1rem;text-align:center"><strong>Workload</strong><br><small>CI job, Pod, service, agent</small></div>
          <div style="border:1px solid var(--md-sys-color-secondary);background:var(--md-sys-color-secondary-container);color:var(--md-sys-color-on-secondary-container);border-radius:0.9rem;padding:1rem;text-align:center"><strong>Issuer</strong><br><small>Signs OIDC JWT</small></div>
          <div style="border:1px solid var(--md-sys-color-tertiary);background:var(--md-sys-color-tertiary-container);color:var(--md-sys-color-on-tertiary-container);border-radius:0.9rem;padding:1rem;text-align:center"><strong>Verifier</strong><br><small>Checks JWKS and claims</small></div>
          <div style="border:1px solid var(--md-sys-color-primary);background:var(--md-sys-color-primary-container);color:var(--md-sys-color-on-primary-container);border-radius:0.9rem;padding:1rem;text-align:center"><strong>Policy</strong><br><small>Maps identity to role</small></div>
          <div style="border:1px solid var(--md-sys-color-error);background:var(--md-sys-color-error-container);color:var(--md-sys-color-on-error-container);border-radius:0.9rem;padding:1rem;text-align:center"><strong>Access</strong><br><small>Temporary target token</small></div>
        </div>
      </div>

      <ol>
        <li><strong>The workload asks its local platform for a token.</strong> GitHub Actions asks GitHub's OIDC provider. A Kubernetes Pod uses a projected service account token. A SPIRE workload asks for a JWT-SVID.</li>
        <li><strong>The issuer signs the token.</strong> The token contains an issuer, subject, audience, issue time, expiration, and extra claims that describe the workload context.</li>
        <li><strong>The workload presents the token to the target.</strong> This target can be a cloud STS endpoint, Microsoft identity platform, a Vault JWT auth backend, or an internal federation gateway.</li>
        <li><strong>The target validates signature and claims.</strong> It fetches signing keys from a JWKS endpoint, verifies the token, and checks whether the issuer, audience, and subject match configured trust.</li>
        <li><strong>The target issues short-lived access.</strong> The returned credential is scoped to the target system and should expire quickly.</li>
      </ol>

      <h2>OIDC Claims You Must Understand</h2>

      <p>OIDC workload federation usually fails because a team treats a valid signature as sufficient. A valid signature only proves the token came from the issuer. You still need to prove that this exact token was minted for your relying party, came from an allowed workload, has not expired, and matches the intended trust rule.</p>

      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Claim</th>
              <th>What it means</th>
              <th>Production check</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>iss</code></td>
              <td>The issuer that signed the token.</td>
              <td>Must exactly match the trusted issuer URL. Do not accept tokens from similar-looking domains.</td>
            </tr>
            <tr>
              <td><code>sub</code></td>
              <td>The workload identity inside that issuer.</td>
              <td>Pin to a repository, branch, service account, namespace, SPIFFE ID, or other stable workload identity.</td>
            </tr>
            <tr>
              <td><code>aud</code></td>
              <td>The intended recipient of the token.</td>
              <td>Must match your service, STS endpoint, or configured audience. Reject broad or wrong audiences.</td>
            </tr>
            <tr>
              <td><code>exp</code></td>
              <td>When the token expires.</td>
              <td>Reject expired tokens and keep lifetimes short. Allow only small clock skew.</td>
            </tr>
            <tr>
              <td><code>iat</code> and <code>nbf</code></td>
              <td>Issue time and not-before time.</td>
              <td>Reject tokens from far in the future. Investigate excessive clock skew.</td>
            </tr>
            <tr>
              <td><code>kid</code></td>
              <td>Header value that selects a signing key from JWKS.</td>
              <td>Use it to select the right key, but never trust it without verifying the signature.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p>Provider-specific claims matter too. GitHub tokens can identify repository, ref, workflow, environment, and run context. Kubernetes service account tokens identify a service account and namespace. SPIFFE JWT-SVIDs place the SPIFFE ID in <code>sub</code>. Your trust policy should use the most stable and least-broad claims available.</p>

      <h2>Where This Pattern Shows Up</h2>

      <p>Different platforms use different names, but the control plane is similar.</p>

      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Scenario</th>
              <th>Issuer</th>
              <th>Target verifier</th>
              <th>Typical policy boundary</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>GitHub Actions deploys to AWS</td>
              <td>GitHub OIDC provider</td>
              <td>AWS IAM / STS</td>
              <td>Organization, repository, branch, environment, and audience.</td>
            </tr>
            <tr>
              <td>GitHub Actions deploys to Google Cloud</td>
              <td>GitHub OIDC provider</td>
              <td>Google Cloud Workload Identity Federation</td>
              <td>Workload identity pool, provider attribute mapping, service account or direct IAM binding.</td>
            </tr>
            <tr>
              <td>Kubernetes Pod calls Azure</td>
              <td>AKS or cluster OIDC issuer</td>
              <td>Microsoft Entra workload identity federation</td>
              <td>Issuer, subject, audience, service account, namespace, and managed identity.</td>
            </tr>
            <tr>
              <td>Kubernetes Pod calls Google Cloud</td>
              <td>Kubernetes OIDC issuer</td>
              <td>Google Cloud Workload Identity Federation</td>
              <td>Cluster issuer, namespace, service account, and workload identity pool attributes.</td>
            </tr>
            <tr>
              <td>SPIRE workload calls an API</td>
              <td>SPIRE JWT-SVID issuer</td>
              <td>Cloud provider or internal token gateway</td>
              <td>SPIFFE ID, trust domain, audience, and expiry.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p>The common goal is to avoid copying secrets into the workload environment. The cloud provider, identity platform, or gateway accepts a signed workload token only when the token matches a preconfigured trust relationship.</p>

      <h2>Build the Mental Model Before the Code</h2>

      <p>Think of workload federation as a border checkpoint for machine identity.</p>

      <ul>
        <li><strong>Issuer:</strong> the authority that knows the workload context and signs the token.</li>
        <li><strong>Subject:</strong> the workload identity, such as <code>repo:org/app:ref:refs/heads/main</code> or <code>system:serviceaccount:payments:api</code>.</li>
        <li><strong>Audience:</strong> the relying party that this token was minted for.</li>
        <li><strong>Trust policy:</strong> the rule that says which issuers, subjects, audiences, and extra claims can get which target role.</li>
        <li><strong>Exchange:</strong> the step that converts identity evidence into target-system access.</li>
      </ul>

      <p>The exchange step is important. A workload token minted by GitHub should not become a general-purpose AWS credential automatically. It should become one role session, with one duration, one permission policy, and a clear audit trail. A Kubernetes service account token should not become access to every cloud resource. It should map to the one managed identity or service account needed by that workload.</p>

      <h2>Runnable Python Example: A Tiny Federation Gateway</h2>

      <p>The following example gives you a complete local lab. It does not use AWS, Azure, or Google Cloud. Instead, it shows the core mechanics that every real provider performs:</p>

      <ul>
        <li>Serve OIDC discovery metadata and JWKS from a tiny development issuer.</li>
        <li>Mint a signed workload token for a fake Kubernetes service account.</li>
        <li>Run a gateway that validates the token signature, issuer, audience, subject prefix, expiry, and optional repository/ref claims.</li>
        <li>Exchange the workload token for a short-lived internal access token.</li>
      </ul>

      <p>Install dependencies:</p>

      <pre><code>python -m venv .venv
.venv\\Scripts\\activate
pip install "pyjwt[crypto]" flask requests cryptography</code></pre>

      <p>On macOS or Linux, activate the environment with <code>source .venv/bin/activate</code>.</p>

      <p>Save this as <code>federation_demo.py</code>:</p>

      <pre><code>#!/usr/bin/env python3
import argparse
import base64
import json
import os
import time
import uuid
from functools import lru_cache
from typing import Any

import jwt
import requests
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import rsa
from flask import Flask, jsonify, request

ISSUER = os.getenv("OIDC_ISSUER", "http://127.0.0.1:9000")
EXPECTED_ISSUER = os.getenv("EXPECTED_ISSUER", ISSUER)
EXPECTED_AUDIENCE = os.getenv("EXPECTED_AUDIENCE", "api://federation-gateway")
ALLOWED_SUBJECT_PREFIX = os.getenv(
    "ALLOWED_SUBJECT_PREFIX",
    "system:serviceaccount:payments:"
)
REQUIRED_REPOSITORY = os.getenv("REQUIRED_REPOSITORY", "")
REQUIRED_REF = os.getenv("REQUIRED_REF", "")

SESSION_ISSUER = os.getenv("SESSION_ISSUER", "local-federation-gateway")
SESSION_AUDIENCE = os.getenv("SESSION_AUDIENCE", "internal-api")
SESSION_SECRET = os.getenv("SESSION_SECRET", "dev-only-change-me")

KEY_FILE = os.getenv("DEV_ISSUER_KEY_FILE", "dev-issuer-key.pem")
KID = "dev-key-1"


def b64url_uint(value: int) -> str:
    raw = value.to_bytes((value.bit_length() + 7) // 8, "big")
    return base64.urlsafe_b64encode(raw).rstrip(b"=").decode("ascii")


def load_private_key():
    if os.path.exists(KEY_FILE):
        with open(KEY_FILE, "rb") as handle:
            return serialization.load_pem_private_key(handle.read(), password=None)

    key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
    pem = key.private_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PrivateFormat.PKCS8,
        encryption_algorithm=serialization.NoEncryption(),
    )
    with open(KEY_FILE, "wb") as handle:
        handle.write(pem)
    try:
        os.chmod(KEY_FILE, 0o600)
    except OSError:
        pass
    return key


def private_key_pem() -> bytes:
    return load_private_key().private_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PrivateFormat.PKCS8,
        encryption_algorithm=serialization.NoEncryption(),
    )


def public_jwk() -> dict[str, Any]:
    public_numbers = load_private_key().public_key().public_numbers()
    return {
        "kty": "RSA",
        "use": "sig",
        "alg": "RS256",
        "kid": KID,
        "n": b64url_uint(public_numbers.n),
        "e": b64url_uint(public_numbers.e),
    }


def serve_issuer(port: int) -> None:
    app = Flask("dev-oidc-issuer")

    @app.get("/.well-known/openid-configuration")
    def discovery():
        return jsonify({
            "issuer": ISSUER,
            "jwks_uri": f"{ISSUER}/jwks.json",
            "id_token_signing_alg_values_supported": ["RS256"],
            "subject_types_supported": ["public"],
        })

    @app.get("/jwks.json")
    def jwks():
        return jsonify({"keys": [public_jwk()]})

    app.run(host="127.0.0.1", port=port)


def mint_token(args: argparse.Namespace) -> None:
    now = int(time.time())
    claims = {
        "iss": ISSUER,
        "sub": args.subject,
        "aud": args.audience,
        "iat": now,
        "nbf": now - 5,
        "exp": now + args.ttl_seconds,
        "jti": str(uuid.uuid4()),
        "repository": args.repository,
        "ref": args.ref,
        "namespace": args.namespace,
        "service_account": args.service_account,
    }
    token = jwt.encode(
        claims,
        private_key_pem(),
        algorithm="RS256",
        headers={"kid": KID},
    )
    print(token)


def fetch_openid_configuration(issuer: str) -> dict[str, Any]:
    response = requests.get(
        f"{issuer.rstrip('/')}/.well-known/openid-configuration",
        timeout=5,
    )
    response.raise_for_status()
    config = response.json()
    if config.get("issuer") != issuer:
        raise ValueError("Issuer metadata does not match expected issuer")
    return config


@lru_cache(maxsize=16)
def fetch_jwks(jwks_uri: str) -> dict[str, Any]:
    response = requests.get(jwks_uri, timeout=5)
    response.raise_for_status()
    return response.json()


def select_jwk(jwks: dict[str, Any], kid: str) -> dict[str, Any]:
    for key in jwks.get("keys", []):
        if key.get("kid") == kid:
            return key
    raise ValueError("No matching JWK found for token kid")


def enforce_trust_policy(claims: dict[str, Any]) -> None:
    subject = str(claims.get("sub", ""))
    if not subject.startswith(ALLOWED_SUBJECT_PREFIX):
        raise PermissionError("Subject is not allowed by trust policy")

    if REQUIRED_REPOSITORY and claims.get("repository") != REQUIRED_REPOSITORY:
        raise PermissionError("Repository claim is not allowed")

    if REQUIRED_REF and claims.get("ref") != REQUIRED_REF:
        raise PermissionError("Ref claim is not allowed")


def verify_oidc_token(raw_token: str) -> dict[str, Any]:
    header = jwt.get_unverified_header(raw_token)
    if header.get("alg") != "RS256":
        raise ValueError("Only RS256 is accepted in this demo")

    config = fetch_openid_configuration(EXPECTED_ISSUER)
    jwks = fetch_jwks(config["jwks_uri"])
    jwk = select_jwk(jwks, header["kid"])
    public_key = jwt.algorithms.RSAAlgorithm.from_jwk(json.dumps(jwk))

    claims = jwt.decode(
        raw_token,
        key=public_key,
        algorithms=["RS256"],
        audience=EXPECTED_AUDIENCE,
        issuer=EXPECTED_ISSUER,
        leeway=30,
        options={"require": ["iss", "sub", "aud", "exp", "iat"]},
    )
    enforce_trust_policy(claims)
    return claims


def issue_session_token(claims: dict[str, Any]) -> str:
    now = int(time.time())
    session_claims = {
        "iss": SESSION_ISSUER,
        "sub": claims["sub"],
        "aud": SESSION_AUDIENCE,
        "iat": now,
        "exp": now + 600,
        "scope": "payments:read",
        "actor": {
            "iss": claims["iss"],
            "sub": claims["sub"],
            "repository": claims.get("repository", ""),
            "ref": claims.get("ref", ""),
        },
    }
    return jwt.encode(session_claims, SESSION_SECRET, algorithm="HS256")


def bearer_token_from_request() -> str:
    auth = request.headers.get("Authorization", "")
    if not auth.startswith("Bearer "):
        raise PermissionError("Missing Authorization: Bearer token")
    return auth[len("Bearer "):].strip()


def serve_gateway(port: int) -> None:
    app = Flask("federation-gateway")

    @app.get("/healthz")
    def healthz():
        return jsonify({"ok": True})

    @app.post("/exchange")
    def exchange():
        try:
            raw_token = bearer_token_from_request()
            workload_claims = verify_oidc_token(raw_token)
            access_token = issue_session_token(workload_claims)
            return jsonify({
                "token_type": "Bearer",
                "expires_in": 600,
                "access_token": access_token,
                "workload_subject": workload_claims["sub"],
                "issuer": workload_claims["iss"],
            })
        except Exception as exc:
            return jsonify({"error": str(exc)}), 401

    app.run(host="127.0.0.1", port=port)


def main() -> None:
    parser = argparse.ArgumentParser()
    subcommands = parser.add_subparsers(dest="command", required=True)

    issuer_cmd = subcommands.add_parser("serve-issuer")
    issuer_cmd.add_argument("--port", type=int, default=9000)

    gateway_cmd = subcommands.add_parser("serve-gateway")
    gateway_cmd.add_argument("--port", type=int, default=9001)

    mint_cmd = subcommands.add_parser("mint-token")
    mint_cmd.add_argument(
        "--subject",
        default="system:serviceaccount:payments:api",
    )
    mint_cmd.add_argument("--audience", default=EXPECTED_AUDIENCE)
    mint_cmd.add_argument("--ttl-seconds", type=int, default=300)
    mint_cmd.add_argument("--repository", default="acme/payments")
    mint_cmd.add_argument("--ref", default="refs/heads/main")
    mint_cmd.add_argument("--namespace", default="payments")
    mint_cmd.add_argument("--service-account", default="api")

    args = parser.parse_args()
    if args.command == "serve-issuer":
        serve_issuer(args.port)
    elif args.command == "serve-gateway":
        serve_gateway(args.port)
    elif args.command == "mint-token":
        mint_token(args)


if __name__ == "__main__":
    main()</code></pre>

      <p>Run the local lab in three terminals.</p>

      <p>Terminal 1: start the development issuer:</p>

      <pre><code>python federation_demo.py serve-issuer</code></pre>

      <p>Terminal 2: start the federation gateway:</p>

      <pre><code>set EXPECTED_ISSUER=http://127.0.0.1:9000
set EXPECTED_AUDIENCE=api://federation-gateway
set ALLOWED_SUBJECT_PREFIX=system:serviceaccount:payments:
python federation_demo.py serve-gateway</code></pre>

      <p>Terminal 3: mint a workload token and exchange it:</p>

      <pre><code>python federation_demo.py mint-token --subject system:serviceaccount:payments:api > oidc.jwt
set /p TOKEN=&lt;oidc.jwt
curl -X POST http://127.0.0.1:9001/exchange -H "Authorization: Bearer %TOKEN%"</code></pre>

      <p>On macOS or Linux, use this equivalent shell syntax:</p>

      <pre><code>python federation_demo.py mint-token --subject system:serviceaccount:payments:api > oidc.jwt
TOKEN="$(cat oidc.jwt)"
curl -X POST http://127.0.0.1:9001/exchange -H "Authorization: Bearer $TOKEN"</code></pre>

      <p>You should receive a JSON response containing a short-lived internal access token. Now try a denied subject:</p>

      <pre><code>python federation_demo.py mint-token --subject system:serviceaccount:default:debug > bad.jwt
set /p BAD_TOKEN=&lt;bad.jwt
curl -X POST http://127.0.0.1:9001/exchange -H "Authorization: Bearer %BAD_TOKEN%"</code></pre>

      <p>The gateway rejects it because <code>system:serviceaccount:default:debug</code> does not match the allowed subject prefix. That is the core of workload federation: a signed token is necessary, but authorization depends on claims and policy.</p>

      <aside class="callout callout-production">
        <strong>Do not copy the demo into production unchanged.</strong> In production, use HTTPS, strict issuer allowlists, cache JWKS with refresh and key rotation behavior, sign issued tokens with a real key management system, log exchange decisions, rate limit the endpoint, and avoid broad subject prefixes.
      </aside>

      <h2>How to Connect This to Real Providers</h2>

      <p>The local demo has the same moving parts as a real cloud setup. The difference is that the cloud provider owns the verifier and token issuer for the target credential.</p>

      <h3>GitHub Actions to AWS</h3>

      <p>In AWS, create an IAM OIDC provider for GitHub and a role trust policy. The role trust policy should require the expected audience and a tightly scoped <code>sub</code> claim. For GitHub, that usually means a specific organization, repository, branch, tag, or environment. Avoid broad wildcard subjects. A role that trusts every repository in an organization can become a production deployment path for unrelated code.</p>

      <pre><code>{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::123456789012:oidc-provider/token.actions.githubusercontent.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com",
          "token.actions.githubusercontent.com:sub": "repo:acme/payments:ref:refs/heads/main"
        }
      }
    }
  ]
}</code></pre>

      <p>The workflow then requests an OIDC token and uses the official AWS credential action to exchange it for temporary AWS credentials. The important part is the trust policy, not only the workflow YAML.</p>

      <h3>GitHub Actions to Google Cloud</h3>

      <p>In Google Cloud, create a workload identity pool and provider, map claims from the GitHub token into attributes, and bind IAM permissions either directly to the federated principal or through service account impersonation. The pool should represent a clear external environment such as GitHub production deployments, not every possible external workload.</p>

      <pre><code>trust_design:
  provider: "GitHub OIDC"
  issuer: "https://token.actions.githubusercontent.com"
  allowed_repository: "acme/payments"
  allowed_ref: "refs/heads/main"
  target: "deploy-payments service account"
  role: "minimal deploy role"</code></pre>

      <h3>Kubernetes Pods to Cloud APIs</h3>

      <p>Kubernetes v1.22 and later can mount short-lived, automatically rotating service account tokens for Pods. These projected tokens are better federation inputs than old service account token Secrets because they expire and can be audience-scoped. In a cloud federation setup, the cloud provider trusts the cluster's OIDC issuer and maps a service account subject to a cloud identity.</p>

      <pre><code>apiVersion: v1
kind: ServiceAccount
metadata:
  name: payments-api
  namespace: payments
---
apiVersion: v1
kind: Pod
metadata:
  name: payments-api
  namespace: payments
spec:
  serviceAccountName: payments-api
  containers:
    - name: app
      image: ghcr.io/acme/payments-api:1.0.0
      volumeMounts:
        - name: cloud-federation-token
          mountPath: /var/run/secrets/cloud
          readOnly: true
  volumes:
    - name: cloud-federation-token
      projected:
        sources:
          - serviceAccountToken:
              path: token
              audience: api://federation-gateway
              expirationSeconds: 3600</code></pre>

      <p>The target trust policy should reference the exact issuer, audience, namespace, and service account. If one namespace compromise can mint a token that maps to another team's cloud role, the trust boundary is too broad.</p>

      <h3>SPIFFE and SPIRE</h3>

      <p>SPIFFE gives workloads platform-neutral identities such as <code>spiffe://example.org/ns/payments/sa/api</code>. SPIRE can issue JWT-SVIDs. A JWT-SVID is still a bearer token, so the same rules apply: verify the signature, check the expected audience, require expiration, keep the audience narrow, and map the SPIFFE ID to the smallest useful permission.</p>

      <h2>Trust Policy Design</h2>

      <p>A trust policy should be boring and explicit. If a human cannot explain why a specific workload can assume a role, the policy is too loose.</p>

      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Bad policy</th>
              <th>Why it fails</th>
              <th>Better policy</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Trust any token from GitHub.</td>
              <td>Any repository that can mint a matching token might reach the role.</td>
              <td>Trust one organization, repository, branch or environment, and audience.</td>
            </tr>
            <tr>
              <td>Trust any service account in a cluster.</td>
              <td>A low-trust namespace can become a path to high-trust cloud access.</td>
              <td>Trust one namespace and service account per role.</td>
            </tr>
            <tr>
              <td>Use one audience for all internal services.</td>
              <td>A token meant for one service can be replayed to another service.</td>
              <td>Use a service-specific audience for each relying party.</td>
            </tr>
            <tr>
              <td>Issue target credentials for hours by default.</td>
              <td>Leaked tokens remain useful too long.</td>
              <td>Use short sessions and require re-exchange from fresh workload identity.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Production Checklist</h2>

      <ul>
        <li><strong>Pin the issuer.</strong> Use exact issuer URLs and validate discovery metadata. Do not accept arbitrary issuer values from user input.</li>
        <li><strong>Pin the audience.</strong> The token must be intended for your verifier or STS endpoint.</li>
        <li><strong>Constrain the subject.</strong> Match exact repositories, branches, environments, service accounts, namespaces, or SPIFFE IDs.</li>
        <li><strong>Check expiration.</strong> Reject expired tokens and keep both source and target tokens short-lived.</li>
        <li><strong>Validate the signing algorithm.</strong> Do not accept <code>none</code> or unexpected algorithms.</li>
        <li><strong>Handle JWKS rotation.</strong> Cache keys, refresh on unknown <code>kid</code>, and fail closed if metadata cannot be trusted.</li>
        <li><strong>Audit exchange events.</strong> Log issuer, subject, audience, policy decision, target role, and request ID. Do not log bearer tokens.</li>
        <li><strong>Separate environments.</strong> Development, staging, and production should have separate trust policies and target roles.</li>
        <li><strong>Prefer exact conditions over wildcards.</strong> Wildcards should be rare, reviewed, and bounded by other claims.</li>
        <li><strong>Keep fallback secrets out.</strong> Do not leave static keys active after migration unless there is a documented break-glass path.</li>
      </ul>

      <h2>Common Failure Modes</h2>

      <p><strong>Audience confusion:</strong> A token minted for one service is accepted by another. Fix this by requiring service-specific audiences and rejecting tokens with unexpected audiences.</p>

      <p><strong>Over-broad subjects:</strong> A policy allows any branch, any repository, any namespace, or any service account. Fix this by tying roles to deployment environments and workload owners.</p>

      <p><strong>Issuer spoofing:</strong> The verifier reads <code>iss</code> and fetches arbitrary metadata from that URL. Fix this by using a static issuer allowlist and exact metadata validation.</p>

      <p><strong>Long target sessions:</strong> The source token is short-lived, but the exchanged credential lasts for many hours. Fix this by setting target session durations to the minimum operationally useful value.</p>

      <p><strong>Audit gaps:</strong> A cloud audit log shows a role assumption, but nobody can connect it to a workflow run, Pod, or SPIFFE ID. Fix this by propagating subject and run metadata into session names, token claims, or audit attributes where the provider supports it.</p>

      <h2>Migration Plan from Static Secrets</h2>

      <p>Do not migrate every credential at once. Start with the credentials that are both powerful and widely distributed.</p>

      <ol>
        <li><strong>Inventory long-lived credentials.</strong> Search repository secrets, CI variables, Kubernetes Secrets, Terraform state, cloud IAM keys, and developer runbooks.</li>
        <li><strong>Rank by blast radius.</strong> Cloud admin keys, deploy keys, registry push tokens, production database users, and cross-account roles should be first.</li>
        <li><strong>Pick one federation path.</strong> For example, GitHub Actions to AWS, Kubernetes service account to Azure, or SPIFFE JWT-SVID to an internal gateway.</li>
        <li><strong>Create the narrow role.</strong> The target role should have only the permissions the workload needs.</li>
        <li><strong>Write the trust policy.</strong> Require exact issuer, audience, subject, and provider-specific claims.</li>
        <li><strong>Run in parallel briefly.</strong> Compare logs from old and new access paths, then remove the static key.</li>
        <li><strong>Enforce the new default.</strong> Add policy, CI checks, or review rules that prevent new long-lived keys from appearing.</li>
      </ol>

      <h2>When Not to Use It</h2>

      <p>OIDC workload federation is not a replacement for every secret. Your application may still need database passwords, user tokens, API keys for third-party systems that do not support federation, or encryption keys. The point is to remove static bootstrap credentials where the platform can already identify the workload.</p>

      <p>It may also be too much for a tiny internal script if the target system has no federation support and the operational overhead would exceed the risk reduction. In that case, use a secret manager, short rotation windows, least privilege, and audit logs. For production deployment paths, cloud access, cross-account access, and Kubernetes workloads, federation is usually worth the setup.</p>

      <h2>Related CodersSecret Guides</h2>

      <ul>
        <li><a href="/blog/kubernetes-secrets-vault-workload-identity">Kubernetes Secrets vs Vault vs Workload Identity</a></li>
        <li><a href="/blog/sso-saml-oidc-practical-guide">SSO Demystified: SAML and OIDC</a></li>
        <li><a href="/blog/common-cicd-attack-paths">Common CI/CD Attack Paths</a></li>
        <li><a href="/blog/software-supply-chain-security-explained">Software Supply Chain Security Explained</a></li>
        <li><a href="/courses/mastering-spiffe-spire">Master SPIFFE and SPIRE for Workload Identity</a></li>
        <li><a href="/cheatsheets/spiffe-spire">SPIFFE and SPIRE Cheatsheet</a></li>
      </ul>

      <h2>Sources and Further Reading</h2>

      <ul>
        <li><a href="https://openid.net/specs/openid-connect-core-1_0.html">OpenID Connect Core 1.0</a></li>
        <li><a href="https://datatracker.ietf.org/doc/html/rfc8693">RFC 8693: OAuth 2.0 Token Exchange</a></li>
        <li><a href="https://docs.github.com/en/actions/concepts/security/openid-connect">GitHub Actions OpenID Connect documentation</a></li>
        <li><a href="https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create_for-idp_oidc.html">AWS IAM OIDC federation roles</a></li>
        <li><a href="https://docs.cloud.google.com/iam/docs/workload-identity-federation">Google Cloud Workload Identity Federation</a></li>
        <li><a href="https://learn.microsoft.com/en-us/entra/workload-id/workload-identity-federation">Microsoft Entra Workload Identity Federation</a></li>
        <li><a href="https://kubernetes.io/docs/concepts/security/service-accounts/">Kubernetes Service Accounts</a></li>
        <li><a href="https://spiffe.io/docs/latest/spiffe-specs/jwt-svid/">SPIFFE JWT-SVID specification</a></li>
      </ul>
`;
