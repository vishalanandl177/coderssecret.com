export const CONTENT = `
      <p>Kubernetes security is not one control. It is a set of boundaries around the API server, workloads, images, networks, identities, secrets, nodes, admission policy, and runtime behavior. A secure cluster is not a cluster with every scanner installed. It is a cluster where the default path is least privilege and unsafe changes are hard to ship.</p>

      <p>This guide gives you the map: what to secure first, what each layer does, and where production clusters usually fail.</p>

      <aside class="callout callout-production">
        <strong>Production rule:</strong> secure the Kubernetes API first. If an attacker can create Pods, mount Secrets, or impersonate service accounts, network policy and runtime tools are already playing defense.
      </aside>

      <h2>The Kubernetes Security Layers</h2>

      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Layer</th>
              <th>Primary controls</th>
              <th>Failure mode</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>API access</td>
              <td>Authentication, RBAC, audit logs, admission control</td>
              <td>Overpowered users or service accounts can change the cluster.</td>
            </tr>
            <tr>
              <td>Workloads</td>
              <td>Pod Security, securityContext, resource limits</td>
              <td>Privileged containers escape intended boundaries.</td>
            </tr>
            <tr>
              <td>Network</td>
              <td>NetworkPolicy, service mesh, ingress policy</td>
              <td>Every Pod can talk to every other Pod.</td>
            </tr>
            <tr>
              <td>Supply chain</td>
              <td>Image scanning, signing, admission verification</td>
              <td>Untrusted images reach production.</td>
            </tr>
            <tr>
              <td>Runtime</td>
              <td>Detection, logs, node hardening, eBPF/Falco-style monitoring</td>
              <td>Compromise is invisible after deployment.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>RBAC: Least Privilege for Humans and Workloads</h2>

      <p>RBAC controls who can perform actions against Kubernetes resources. The most common mistake is granting broad verbs across broad resources because a deployment was blocked once.</p>

      <pre><code># Risky pattern: this service account can read every Secret in the namespace
verbs: ["get", "list", "watch"]
resources: ["secrets"]

# Better pattern: bind the workload only to resources it actually needs
verbs: ["get"]
resources: ["configmaps"]
resourceNames: ["app-config"]</code></pre>

      <p>Review service accounts the same way you review IAM roles. The identity attached to a Pod can often do more damage than the container image itself.</p>

      <h2>Pod Security: Reduce What a Container Can Do</h2>

      <p>Pod Security Standards define broad policy levels for Pods. In production, the restricted profile is the direction most teams should move toward, even if legacy workloads need exceptions during migration.</p>

      <p>Important settings include running as non-root, disabling privilege escalation, dropping Linux capabilities, using read-only root filesystems where possible, and avoiding host namespaces or hostPath mounts unless there is a strong reason.</p>

      <h2>Network Policy: Default Deny Where It Matters</h2>

      <p>Kubernetes networking is usually open by default. NetworkPolicy gives you a way to restrict Pod-to-Pod and Pod-to-external traffic, assuming your CNI enforces it.</p>

      <p>Start with critical namespaces: databases, identity systems, CI runners, ingress controllers, and admin tooling. A realistic first goal is not perfect zero trust. It is stopping unrelated workloads from freely reaching sensitive services.</p>

      <h2>Secrets and Identity</h2>

      <p>Secrets need encryption at rest, tight RBAC, rotation, and auditability. But the long-term goal is to remove static credentials where possible. Use workload identity, projected service account tokens, cloud IAM federation, or SPIFFE/SPIRE when a workload can authenticate dynamically.</p>

      <h2>Admission Control</h2>

      <p>Admission control is where policy becomes enforceable. It can reject privileged Pods, unsigned images, public LoadBalancers, missing labels, hostPath mounts, or deployments from untrusted registries.</p>

      <p>This is where Kubernetes security becomes repeatable. Humans should not have to remember every rule during every deployment.</p>

      <h2>Practical Hardening Checklist</h2>

      <ul>
        <li>Require strong identity for humans and automation.</li>
        <li>Review ClusterRoleBinding usage and avoid broad cluster-admin grants.</li>
        <li>Apply Pod Security Standards with documented exceptions.</li>
        <li>Use NetworkPolicy for sensitive namespaces.</li>
        <li>Enable audit logs and route them to a system people actually monitor.</li>
        <li>Scan and sign images, then enforce trusted images at admission.</li>
        <li>Use workload identity instead of long-lived cloud keys in Secrets.</li>
        <li>Patch nodes and control plane components on a defined schedule.</li>
      </ul>

      <h2>Kubernetes Request Security Flow</h2>

      <p>Kubernetes security starts at the API server. Every important control either protects access to the API, limits what admitted workloads can do, restricts network paths, or observes runtime behavior. The flow below shows where the main controls sit.</p>

      <div class="flow-diagram" role="img" aria-label="Kubernetes security flow from user request to runtime monitoring">
        <div class="flow-diagram-title">API Request &rarr; Admission &rarr; Runtime</div>
        <div style="display:grid;grid-template-columns:repeat(6,minmax(120px,1fr));gap:0.75rem;min-width:820px">
          <div style="border:1px solid var(--md-sys-color-outline-variant);background:var(--md-sys-color-surface-container);border-radius:0.9rem;padding:1rem;text-align:center"><strong>Identity</strong><br><small>User, group, service account</small></div>
          <div style="border:1px solid var(--md-sys-color-primary);background:var(--md-sys-color-primary-container);color:var(--md-sys-color-on-primary-container);border-radius:0.9rem;padding:1rem;text-align:center"><strong>AuthN</strong><br><small>OIDC, certs, tokens</small></div>
          <div style="border:1px solid var(--md-sys-color-secondary);background:var(--md-sys-color-secondary-container);color:var(--md-sys-color-on-secondary-container);border-radius:0.9rem;padding:1rem;text-align:center"><strong>RBAC</strong><br><small>Can this subject do this?</small></div>
          <div style="border:1px solid var(--md-sys-color-tertiary);background:var(--md-sys-color-tertiary-container);color:var(--md-sys-color-on-tertiary-container);border-radius:0.9rem;padding:1rem;text-align:center"><strong>Admission</strong><br><small>Pod Security, policy, image rules</small></div>
          <div style="border:1px solid var(--md-sys-color-outline-variant);background:var(--md-sys-color-surface-container-high);border-radius:0.9rem;padding:1rem;text-align:center"><strong>Runtime</strong><br><small>Network, secrets, nodes</small></div>
          <div style="border:1px solid var(--md-sys-color-error);background:var(--md-sys-color-error-container);color:var(--md-sys-color-on-error-container);border-radius:0.9rem;padding:1rem;text-align:center"><strong>Detect</strong><br><small>Audit, events, eBPF, logs</small></div>
        </div>
      </div>

      <h2>Threat Model by Cluster Layer</h2>

      <p>A cluster is not one security boundary. It is a stack of boundaries. A weak RBAC role can become cluster takeover. A permissive Pod can become node compromise. A service account token can become cloud access. A missing network policy can turn one vulnerable service into lateral movement.</p>

      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Layer</th>
              <th>Common failure</th>
              <th>Control to verify</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Identity and RBAC</td>
              <td>Developers, CI, or service accounts have broad verbs across the cluster.</td>
              <td>Least privilege roles, namespace scoping, audit of cluster-admin bindings.</td>
            </tr>
            <tr>
              <td>Admission</td>
              <td>Privileged Pods, hostPath mounts, host networking, unsafe capabilities.</td>
              <td>Pod Security Standards, admission policy, image provenance checks.</td>
            </tr>
            <tr>
              <td>Workload runtime</td>
              <td>Container escapes, token theft, unexpected process or network behavior.</td>
              <td>Runtime detection, read-only filesystems, seccomp, non-root users.</td>
            </tr>
            <tr>
              <td>Network</td>
              <td>Every Pod can reach every other Pod and metadata services.</td>
              <td>Default-deny NetworkPolicy, egress policy, service mesh policy where needed.</td>
            </tr>
            <tr>
              <td>Supply chain</td>
              <td>Unsigned or untrusted images reach production.</td>
              <td>Registry controls, scanning, signing, admission verification.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>RBAC Review Pattern</h2>

      <p>Start RBAC review with the identities that can change workloads, read secrets, create roles, or impersonate users. Those permissions are more dangerous than read-only access to ordinary resources. In many incidents, the first mistake is not a Kubernetes CVE; it is an overpowered service account or CI token.</p>

      <pre><code># Find broad role bindings
kubectl get clusterrolebinding
kubectl get rolebinding --all-namespaces

# Ask what a specific identity can do
kubectl auth can-i list secrets \
  --as=system:serviceaccount:payments:api

kubectl auth can-i create pods \
  --as=system:serviceaccount:ci:deployer \
  --namespace=production</code></pre>

      <h2>Runtime and Audit Signals</h2>

      <p>Preventive controls are not enough. You still need to know when something unusual happens. Useful signals include new privileged Pods, Pods mounting host paths, service accounts reading secrets they normally do not read, unexpected egress, containers starting shells, image pull failures, and admission denials. Audit logs are noisy, so start with high-risk verbs and high-risk resources.</p>

      <aside class="callout callout-troubleshoot">
        <strong>Operational check:</strong> pick one namespace and trace a deployment from Git commit to running Pod. You should be able to identify who approved it, which image digest ran, which service account it used, which secrets it could read, and which network paths were allowed.
      </aside>

      <h2>Baseline by Environment</h2>

      <p>Development, staging, and production do not need identical controls, but they do need consistent expectations. Development clusters can be more flexible, yet they should not train teams to depend on privileged Pods, broad secrets, or cluster-admin access. Production clusters should make dangerous paths difficult by default.</p>

      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Control</th>
              <th>Development</th>
              <th>Production</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Human access</td>
              <td>Namespaced roles and short-lived elevated access for debugging.</td>
              <td>SSO, least privilege, approval for elevated roles, audited break-glass.</td>
            </tr>
            <tr>
              <td>Pod security</td>
              <td>Warn and audit unsafe settings so teams see problems early.</td>
              <td>Enforce restricted baseline with documented exceptions.</td>
            </tr>
            <tr>
              <td>Network policy</td>
              <td>Apply to sensitive namespaces and shared services.</td>
              <td>Default deny for critical namespaces with explicit ingress and egress.</td>
            </tr>
            <tr>
              <td>Images</td>
              <td>Scan and report; block obvious high-risk images.</td>
              <td>Require approved registries, signatures, and admission checks.</td>
            </tr>
            <tr>
              <td>Secrets</td>
              <td>Use short-lived credentials where practical; block secret commits.</td>
              <td>Workload identity, encryption at rest, strict RBAC, rotation drills.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Namespace Design Matters</h2>

      <p>Namespaces are not a hard security boundary by themselves, but they are still useful for ownership and policy. A good namespace design groups workloads with similar owners, sensitivity, lifecycle, and network needs. A poor design mixes unrelated services so broadly that RBAC and NetworkPolicy become difficult to reason about.</p>

      <p>For production, prefer namespaces that map to teams or service domains, not to random deployment tools. Each namespace should have an owner, allowed service accounts, default resource quotas, baseline network policy, secret access expectations, and a clear support path. Shared namespaces should be rare because shared ownership tends to create weak policy.</p>

      <h2>Upgrade and Patch Discipline</h2>

      <p>Kubernetes security is not only configuration. Clusters need upgrades, node image patches, dependency updates for controllers, and CVE response. Many cluster incidents happen because a known issue remained exploitable long after a fix existed. Treat the control plane, nodes, ingress controllers, CNI, CSI drivers, service mesh, and admission controllers as part of the production software inventory.</p>

      <pre><code>cluster_patch_calendar:
  weekly:
    - "review critical Kubernetes and node CVEs"
    - "review admission and runtime security alerts"
  monthly:
    - "patch node images and managed add-ons"
    - "review cluster-admin and secret-reader bindings"
  quarterly:
    - "test control plane upgrade in non-production"
    - "run incident drill for compromised service account"</code></pre>

      <p>The point is not bureaucracy. The point is to avoid discovering during an incident that nobody owns the upgrade path for a controller that can mutate every Pod in the cluster.</p>

      <h2>What Good Kubernetes Security Feels Like</h2>

      <p>A secure cluster should not feel like every deployment needs a security meeting. It should feel like the safe path is already paved. Developers get namespace-scoped permissions by default. CI deploys through a narrow service account. Unsafe Pod settings are rejected with clear messages. Secrets are not readable by unrelated workloads. Network paths are explicit. Images come from approved registries and are verified before admission.</p>

      <p>The security team still reviews exceptions and investigates alerts, but routine safety comes from platform defaults. That is the practical goal: make the common path safe enough that exceptions are rare, visible, and temporary. Kubernetes gives you the primitives; production security comes from composing them into defaults that teams can actually use.</p>

      <h2>Related CodersSecret Guides</h2>

      <ul>
        <li><a href="/blog/kubernetes-secrets-vault-workload-identity">Kubernetes Secrets vs Vault vs Workload Identity</a></li>
        <li><a href="/courses/cloud-native-security-engineering">Cloud Native Security Engineering</a></li>
        <li><a href="/cheatsheets/kubernetes-security">Kubernetes Security Cheatsheet</a></li>
        <li><a href="/games/kubernetes-security-simulator">Practice Kubernetes Security Decisions</a></li>
      </ul>

      <h2>Sources and Further Reading</h2>

      <ul>
        <li><a href="https://kubernetes.io/docs/concepts/security/">Kubernetes security documentation</a></li>
        <li><a href="https://kubernetes.io/docs/concepts/security/pod-security-standards/">Kubernetes Pod Security Standards</a></li>
        <li><a href="https://www.nsa.gov/Press-Room/News-Highlights/Article/Article/2716980/nsa-cisa-release-kubernetes-hardening-guidance/">NSA and CISA Kubernetes hardening guidance</a></li>
      </ul>
`;
