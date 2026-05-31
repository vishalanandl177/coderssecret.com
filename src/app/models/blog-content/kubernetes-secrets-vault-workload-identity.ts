export const CONTENT = `
      <p>Secret management in Kubernetes is often discussed as if there is one correct tool. In production, the right answer depends on what you are protecting, who needs access, how often the value rotates, and whether the workload can authenticate without a stored credential.</p>

      <p>The practical comparison is not just <strong>Kubernetes Secrets vs Vault</strong>. It is <strong>stored secrets vs brokered secrets vs workload identity</strong>.</p>

      <aside class="callout callout-production">
        <strong>Production rule:</strong> the safest secret is the one your application never stores. Prefer identity-based access where the platform can issue short-lived credentials at runtime.
      </aside>

      <h2>Kubernetes Secrets: Native, Simple, and Easy to Misuse</h2>

      <p>Kubernetes Secrets are built-in API objects for storing sensitive values such as tokens, passwords, certificates, and keys. They integrate naturally with Pods as environment variables or mounted files.</p>

      <p>They are useful for simple cluster-native configuration, but they are not a complete secret management strategy by themselves. You still need RBAC, encryption at rest, audit logs, rotation, namespace boundaries, and careful control over who can read Secrets.</p>

      <pre><code>apiVersion: v1
kind: Secret
metadata:
  name: api-config
type: Opaque
stringData:
  DATABASE_URL: postgres://app:password@db:5432/app</code></pre>

      <p>The problem is not that Kubernetes Secrets are always bad. The problem is that they often become long-lived credentials copied into many namespaces, CI jobs, Helm values, and developer machines.</p>

      <h2>Vault: Central Secret Broker and Policy Engine</h2>

      <p>Vault adds a central control plane for secrets, auth methods, policies, audit logs, leases, dynamic credentials, PKI, and rotation. In Kubernetes, workloads commonly authenticate to Vault using Kubernetes auth, JWT/OIDC, cloud IAM, or an agent/injector pattern.</p>

      <p>Vault is strongest when you need dynamic database credentials, PKI issuance, central audit, strict policy, and cross-platform secret access beyond one Kubernetes cluster.</p>

      <p>The trade-off is operational complexity. Vault must be deployed, unsealed, backed up, monitored, upgraded, and protected. A poorly operated Vault cluster can become the highest-value outage dependency in your platform.</p>

      <h2>Workload Identity: Stop Handing Out Shared Secrets</h2>

      <p>Workload identity means the platform can prove which workload is calling, then issue access based on that identity. In Kubernetes this can involve projected service account tokens, cloud workload identity integrations, SPIFFE/SPIRE SVIDs, service mesh identity, or OIDC federation.</p>

      <p>The goal is to replace static credentials with short-lived, scoped, auditable credentials. A Pod should not need an AWS access key stored in a Secret if it can use a federated identity to obtain temporary permissions.</p>

      <h2>Decision Table</h2>

      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Need</th>
              <th>Good fit</th>
              <th>Reason</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Small cluster config value</td>
              <td>Kubernetes Secret</td>
              <td>Native, simple, works with standard Pod mounting.</td>
            </tr>
            <tr>
              <td>Dynamic database credentials</td>
              <td>Vault</td>
              <td>Can issue leased credentials and revoke them centrally.</td>
            </tr>
            <tr>
              <td>Cloud API access from Pods</td>
              <td>Workload identity</td>
              <td>Removes long-lived cloud keys from the cluster.</td>
            </tr>
            <tr>
              <td>Service-to-service trust</td>
              <td>SPIFFE/SPIRE or mesh identity</td>
              <td>Gives every workload a cryptographic identity.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Runtime Credential Flow</h2>

      <p>The biggest difference between these approaches is when the credential exists. A Kubernetes Secret usually exists before the Pod starts. Vault can broker a credential at runtime, but the workload still needs a safe way to authenticate to Vault. Workload identity tries to make the platform identity itself the starting point.</p>

      <div class="flow-diagram" role="img" aria-label="Credential flow comparing Kubernetes Secrets Vault and workload identity">
        <div class="flow-diagram-title">Stored Secret vs Brokered Secret vs Workload Identity</div>
        <div style="display:grid;grid-template-columns:repeat(3,minmax(220px,1fr));gap:1rem;min-width:760px">
          <div style="border:1px solid var(--md-sys-color-outline-variant);background:var(--md-sys-color-surface-container);border-radius:1rem;padding:1rem">
            <strong>Kubernetes Secret</strong>
            <ol style="margin:0.75rem 0 0 1.1rem">
              <li>Secret object exists in cluster.</li>
              <li>Pod mounts it or receives env vars.</li>
              <li>Application uses the static value.</li>
            </ol>
          </div>
          <div style="border:1px solid var(--md-sys-color-secondary);background:var(--md-sys-color-secondary-container);color:var(--md-sys-color-on-secondary-container);border-radius:1rem;padding:1rem">
            <strong>Vault Broker</strong>
            <ol style="margin:0.75rem 0 0 1.1rem">
              <li>Workload authenticates to Vault.</li>
              <li>Vault checks policy.</li>
              <li>Vault returns leased credentials.</li>
            </ol>
          </div>
          <div style="border:1px solid var(--md-sys-color-primary);background:var(--md-sys-color-primary-container);color:var(--md-sys-color-on-primary-container);border-radius:1rem;padding:1rem">
            <strong>Workload Identity</strong>
            <ol style="margin:0.75rem 0 0 1.1rem">
              <li>Platform proves workload identity.</li>
              <li>Provider issues short-lived access.</li>
              <li>No shared static secret is stored.</li>
            </ol>
          </div>
        </div>
      </div>

      <h2>Threat Model: What Are You Reducing?</h2>

      <p>Secret tooling should be chosen by the failure mode it reduces. Kubernetes Secrets mostly reduce configuration sprawl by giving the cluster a native object. Vault reduces unmanaged static credentials by centralizing policy, leases, and audit. Workload identity reduces the need to distribute shared credentials at all. These controls overlap, but they do not solve the same problem.</p>

      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Threat</th>
              <th>Kubernetes Secret</th>
              <th>Vault</th>
              <th>Workload identity</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Secret copied into Git</td>
              <td>Still possible if values are managed in manifests.</td>
              <td>Reduced when apps fetch at runtime.</td>
              <td>Strongly reduced for supported providers.</td>
            </tr>
            <tr>
              <td>Credential never rotates</td>
              <td>Requires external process.</td>
              <td>Leases and dynamic secrets help.</td>
              <td>Short-lived tokens are the default model.</td>
            </tr>
            <tr>
              <td>Pod compromise</td>
              <td>Mounted secret can be stolen.</td>
              <td>Lease can be stolen until revoked or expired.</td>
              <td>Access is scoped, short-lived, and auditable.</td>
            </tr>
            <tr>
              <td>Over-broad access</td>
              <td>Controlled with RBAC and namespace policy.</td>
              <td>Controlled with Vault policy.</td>
              <td>Controlled with identity claims and provider policy.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Migration Pattern: Static Keys to Identity</h2>

      <p>A safe migration starts with the highest-risk static keys: cloud access keys, database admin passwords, long-lived API tokens, and credentials copied into CI. Do not rewrite every application at once. Pick one credential class, replace it with a runtime path, and prove rotation and rollback.</p>

      <pre><code>migration_steps:
  1_inventory: "find Secrets, CI variables, Helm values, and copied config"
  2_classify: "cloud key, database password, API token, certificate"
  3_choose_runtime_path: "Vault lease, cloud workload identity, SPIFFE SVID"
  4_limit_scope: "one namespace, one service account, one environment"
  5_rotate: "replace old value, monitor access, revoke old credential"
  6_enforce: "policy prevents new long-lived credentials"</code></pre>

      <p>The enforcement step matters. If developers can still create new long-lived secrets with no review, the migration becomes a one-time cleanup instead of a platform improvement. Use admission policy, repository scanning, CI checks, and cloud IAM review to prevent the old pattern from returning.</p>

      <h2>Operational Ownership</h2>

      <p>Secret management crosses team boundaries. Platform teams often own Kubernetes RBAC, service account token configuration, Vault deployment, and cloud workload identity integrations. Application teams own which permissions their service needs. Security teams own policy review, audit expectations, and incident response. If those boundaries are not explicit, every credential request becomes a ticket with unclear approval rules.</p>

      <aside class="callout callout-security">
        <strong>Access review question:</strong> can you explain why this workload has this credential, when it last used it, how it rotates, and who gets paged if access fails? If not, the credential is not production-ready.
      </aside>

      <h2>Common Mistakes</h2>

      <ul>
        <li><strong>Base64 is treated as encryption.</strong> Kubernetes Secret values are encoded, not magically protected.</li>
        <li><strong>CI writes production secrets into manifests.</strong> Secrets should not become Git history.</li>
        <li><strong>Vault tokens are stored as static Kubernetes Secrets.</strong> That can recreate the same long-lived credential problem.</li>
        <li><strong>All service accounts can read all secrets.</strong> RBAC must be least privilege.</li>
        <li><strong>No rotation path exists.</strong> A secret that cannot rotate safely will eventually become an incident.</li>
      </ul>

      <h2>Production Checklist</h2>

      <ul>
        <li>Enable encryption at rest for Kubernetes Secrets.</li>
        <li>Restrict Secret access with RBAC and namespace boundaries.</li>
        <li>Prefer projected service account tokens over legacy token Secrets.</li>
        <li>Use Vault for dynamic secrets and central policy when the operational maturity exists.</li>
        <li>Use cloud workload identity or SPIFFE/SPIRE for runtime identity where possible.</li>
        <li>Audit secret reads and rotate credentials on a schedule and after incidents.</li>
      </ul>

      <h2>Designing Least-Privilege Secret Access</h2>

      <p>Least privilege for secrets starts with a simple inventory: which workload needs which value, why it needs it, how long it needs it, and what happens if the value leaks. Many clusters fail this inventory because secrets are copied by environment or team instead of by workload need. A single shared database password might be mounted into ten services because it was convenient during setup.</p>

      <p>A better design gives each workload its own service account, its own policy boundary, and the smallest useful credential. If the workload only needs read access to one database schema, the credential should not have write access to every schema. If the workload only needs cloud object read access under one prefix, the role should not include broad bucket administration. The secret mechanism and the target-system permission must both be scoped.</p>

      <pre><code>access_review:
  workload: "payments-api"
  identity: "system:serviceaccount:payments:api"
  needs:
    - "read payment processor API token"
    - "write payment events to database"
  should_not_have:
    - "read all namespace secrets"
    - "admin database user"
    - "cloud account-wide storage access"
  rotation_owner: "payments platform team"</code></pre>

      <h2>Handling Break-Glass and Human Access</h2>

      <p>Production systems still need emergency access paths, but they should be explicit. Break-glass access should be time-bound, logged, approved, and reviewed after use. It should not be the same credential the application uses every day. If a human needs a database password during an incident, that access should come from a controlled flow with audit, not from copying the application's Kubernetes Secret.</p>

      <p>Vault can help here because it can issue short-lived credentials and record audit events. Cloud IAM can help when it supports just-in-time access and short-lived role assumption. Kubernetes alone can support temporary RBAC changes, but you need strong process and logging. The goal is not to make emergency access impossible. The goal is to make it visible and revocable.</p>

      <h2>Incident Response for Secret Exposure</h2>

      <p>When a secret leaks, the first question is scope. Which workload had the secret? Which system accepted it? What permissions did it carry? Where was it stored? Which logs might contain it? How quickly can it rotate? This is where workload identity and dynamic secrets pay off. Short-lived credentials reduce the useful lifetime of the leak, and identity-based logs help identify the affected workload.</p>

      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Exposure type</th>
              <th>Immediate response</th>
              <th>Long-term fix</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Secret committed to Git</td>
              <td>Revoke and rotate; do not rely only on deleting history.</td>
              <td>Secret scanning, pre-commit checks, runtime identity for cloud access.</td>
            </tr>
            <tr>
              <td>Secret printed in CI logs</td>
              <td>Revoke credential, restrict log access, inspect recent runs.</td>
              <td>Masking, scoped CI permissions, OIDC instead of static keys.</td>
            </tr>
            <tr>
              <td>Pod reads another service's Secret</td>
              <td>Rotate exposed value and review namespace activity.</td>
              <td>Fix RBAC, namespace boundaries, and admission policy.</td>
            </tr>
            <tr>
              <td>Vault token stolen</td>
              <td>Revoke token and child leases; inspect audit logs.</td>
              <td>Shorter TTLs, narrower policy, stronger workload authentication.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p>Secret exposure response should be rehearsed. If rotation requires a manual deploy across many services, the system is fragile. If one leaked credential can access multiple environments, the boundary is too broad. If nobody can answer which services used the credential, observability is incomplete.</p>

      <h2>Related CodersSecret Guides</h2>

      <ul>
        <li><a href="/courses/mastering-spiffe-spire">Master SPIFFE and SPIRE for Workload Identity</a></li>
        <li><a href="/courses/cloud-native-security-engineering">Cloud Native Security Engineering</a></li>
        <li><a href="/cheatsheets/kubernetes-security">Kubernetes Security Cheatsheet</a></li>
        <li><a href="/games/zero-trust-network-builder">Practice Zero Trust Network Design</a></li>
      </ul>

      <h2>Sources and Further Reading</h2>

      <ul>
        <li><a href="https://kubernetes.io/docs/concepts/configuration/secret/">Kubernetes Secrets documentation</a></li>
        <li><a href="https://kubernetes.io/docs/concepts/security/secrets-good-practices/">Kubernetes Secrets good practices</a></li>
        <li><a href="https://kubernetes.io/docs/concepts/security/service-accounts/">Kubernetes service accounts</a></li>
        <li><a href="https://developer.hashicorp.com/vault/docs/deploy/kubernetes">HashiCorp Vault on Kubernetes</a></li>
      </ul>
`;
