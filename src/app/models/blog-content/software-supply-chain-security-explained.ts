export const CONTENT = `
      <p>Software supply chain security is the discipline of protecting everything that turns source code into production software. That includes developer accounts, source repositories, dependencies, CI runners, build scripts, artifacts, registries, deployment credentials, and the policies that decide what is allowed to run.</p>

      <p>A scanner is useful, but it is only one control. The real goal is to make every production artifact traceable, reproducible enough to investigate, and difficult to tamper with silently.</p>

      <aside class="callout callout-production">
        <strong>Production rule:</strong> protect the path to production, not only the code. Attackers often compromise builds, packages, credentials, or deployment automation because those paths already have trust.
      </aside>

      <h2>The Supply Chain Map</h2>

      <p>A typical software supply chain has these stages:</p>

      <ol>
        <li><strong>Source:</strong> Git repositories, branch protection, code review, developer identity, signed commits if required.</li>
        <li><strong>Dependencies:</strong> package registries, lockfiles, dependency updates, vulnerability scanning, license policy.</li>
        <li><strong>Build:</strong> CI runners, build scripts, compilers, container builds, generated artifacts.</li>
        <li><strong>Provenance:</strong> metadata that says what was built, from which source, by which workflow.</li>
        <li><strong>Artifact storage:</strong> container registries, package registries, checksums, signatures, retention.</li>
        <li><strong>Deployment:</strong> environment approvals, OIDC roles, admission policy, runtime verification.</li>
      </ol>

      <h2>SBOM, Provenance, and Signing</h2>

      <p>An <strong>SBOM</strong> lists the components inside software. It helps vulnerability response and dependency visibility. It does not prove that the artifact was built safely.</p>

      <p><strong>Provenance</strong> records how an artifact was produced: source repo, commit, workflow, builder, build parameters, and output digest. This helps answer whether the artifact came from the expected pipeline.</p>

      <p><strong>Signing</strong> binds identity to artifacts or attestations. The important part is enforcement: production should be able to reject unsigned or untrusted artifacts, not merely store signatures for audits.</p>

      <h2>SLSA as a Practical Maturity Model</h2>

      <p>SLSA gives teams a shared language for build integrity. At a practical level, it pushes teams toward source integrity, hardened build systems, provenance generation, and verification before deployment.</p>

      <p>You do not need to adopt every control at once. Start by protecting the build path that deploys production services, then expand to internal packages, base images, and infrastructure modules.</p>

      <h2>Common Attack Paths</h2>

      <ul>
        <li>Compromised maintainer account pushes malicious source or workflow changes.</li>
        <li>Dependency confusion pulls an attacker-controlled package with a trusted name.</li>
        <li>CI runner exposes long-lived cloud credentials through logs or pull request workflows.</li>
        <li>Build script downloads unpinned tools from the internet.</li>
        <li>Unsigned container images are deployed because the cluster has no admission policy.</li>
        <li>Artifact registry permissions allow overwriting a trusted release tag.</li>
      </ul>

      <h2>Production Controls That Matter</h2>

      <ul>
        <li>Require MFA and least privilege for source and registry accounts.</li>
        <li>Use branch protection and required reviews on deployment-sensitive paths.</li>
        <li>Pin build dependencies and verify checksums for critical tools.</li>
        <li>Use OIDC federation from CI instead of static cloud keys.</li>
        <li>Generate provenance for release artifacts.</li>
        <li>Sign container images and enforce verification at deployment.</li>
        <li>Keep SBOMs available for vulnerability response.</li>
        <li>Isolate untrusted pull request builds from trusted deployment workflows.</li>
      </ul>

      <h2>Supply Chain Flow Diagram</h2>

      <p>A useful way to reason about supply chain security is to follow the artifact. Every stage should either preserve integrity, add verifiable metadata, or enforce policy. If a stage can silently replace the artifact, the whole chain is weak.</p>

      <div class="flow-diagram" role="img" aria-label="Software supply chain flow from source control to runtime admission">
        <div class="flow-diagram-title">Source &rarr; Build &rarr; Artifact &rarr; Deploy</div>
        <div style="display:grid;grid-template-columns:repeat(6,minmax(120px,1fr));gap:0.75rem;min-width:820px">
          <div style="border:1px solid var(--md-sys-color-outline-variant);background:var(--md-sys-color-surface-container);border-radius:0.9rem;padding:1rem;text-align:center"><strong>Source</strong><br><small>Branch rules, reviews, identity</small></div>
          <div style="border:1px solid var(--md-sys-color-tertiary);background:var(--md-sys-color-tertiary-container);color:var(--md-sys-color-on-tertiary-container);border-radius:0.9rem;padding:1rem;text-align:center"><strong>Dependencies</strong><br><small>Lockfiles, policy, SBOM</small></div>
          <div style="border:1px solid var(--md-sys-color-secondary);background:var(--md-sys-color-secondary-container);color:var(--md-sys-color-on-secondary-container);border-radius:0.9rem;padding:1rem;text-align:center"><strong>Build</strong><br><small>Isolated runner, pinned tools</small></div>
          <div style="border:1px solid var(--md-sys-color-primary);background:var(--md-sys-color-primary-container);color:var(--md-sys-color-on-primary-container);border-radius:0.9rem;padding:1rem;text-align:center"><strong>Attest</strong><br><small>Provenance, digest, signer</small></div>
          <div style="border:1px solid var(--md-sys-color-outline-variant);background:var(--md-sys-color-surface-container-high);border-radius:0.9rem;padding:1rem;text-align:center"><strong>Registry</strong><br><small>Immutable tags, retention</small></div>
          <div style="border:1px solid var(--md-sys-color-error);background:var(--md-sys-color-error-container);color:var(--md-sys-color-on-error-container);border-radius:0.9rem;padding:1rem;text-align:center"><strong>Admission</strong><br><small>Verify before runtime</small></div>
        </div>
      </div>

      <h2>What to Enforce at Each Boundary</h2>

      <p>Supply chain programs fail when they collect evidence but never enforce it. SBOMs, signatures, and provenance are useful only when a policy engine or review process uses them. Start with the deployment boundary because that is where the final production decision happens.</p>

      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Boundary</th>
              <th>Minimum control</th>
              <th>Stronger control</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Source to CI</td>
              <td>Required review and protected branches for release paths.</td>
              <td>CODEOWNERS, signed commits for sensitive repos, workflow-change approval.</td>
            </tr>
            <tr>
              <td>CI to artifact</td>
              <td>Clean build environment and no long-lived production secrets.</td>
              <td>Isolated builder, OIDC cloud access, generated provenance, pinned tools.</td>
            </tr>
            <tr>
              <td>Artifact to registry</td>
              <td>Immutable digest and controlled write permissions.</td>
              <td>Signed images, SBOM stored with artifact, tag overwrite prevention.</td>
            </tr>
            <tr>
              <td>Registry to runtime</td>
              <td>Deploy by digest and scan for known critical issues.</td>
              <td>Admission policy verifies signature, provenance, source repo, and builder identity.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Incident Response: When a Package or Image Is Compromised</h2>

      <p>The value of supply chain metadata becomes obvious during an incident. If a base image, dependency, or CI workflow is compromised, you need to answer which artifacts included it, which environments ran them, and whether anything was deployed outside the expected pipeline. Without SBOMs, provenance, and deployment inventory, response becomes a slow search across registries, clusters, and repos.</p>

      <pre><code>incident_questions:
  affected_component: "Which package, image, workflow, or builder was compromised?"
  artifact_search: "Which image digests or packages include it?"
  runtime_search: "Which clusters, namespaces, and services ran those digests?"
  provenance_check: "Were affected artifacts built by trusted workflows?"
  containment: "Block deploys, rotate credentials, revoke tokens, rebuild clean artifacts"
  recovery: "Patch, rebuild, resign, redeploy, and document evidence"</code></pre>

      <h2>Start Small: A Practical 30-Day Plan</h2>

      <p>You do not need a perfect supply chain program to reduce risk. A realistic first month can focus on the production deployment path for the most important services. Inventory those repos, lock down workflow permissions, remove static cloud keys from CI, build images by digest, generate SBOMs for release artifacts, and add an admission rule for unsigned images in at least one non-production cluster.</p>

      <aside class="callout callout-production">
        <strong>Platform sequence:</strong> protect release workflows first, then internal packages, then base images, then developer tooling. The production deploy path carries the most immediate risk.
      </aside>

      <h2>Maturity Roadmap</h2>

      <p>Supply chain security improves fastest when teams focus on the path that actually deploys production. A useful roadmap moves from visibility, to integrity, to enforcement. Visibility tells you what exists. Integrity tells you whether artifacts came from the expected process. Enforcement prevents untrusted artifacts from running.</p>

      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Stage</th>
              <th>Goal</th>
              <th>Proof it is working</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Visibility</td>
              <td>Know repos, workflows, dependencies, images, packages, and deployed digests.</td>
              <td>You can answer which services use a vulnerable dependency or base image.</td>
            </tr>
            <tr>
              <td>Integrity</td>
              <td>Generate provenance, sign artifacts, protect builders, and pin build inputs.</td>
              <td>A release artifact can be traced to a repo, commit, workflow, and builder identity.</td>
            </tr>
            <tr>
              <td>Enforcement</td>
              <td>Reject artifacts that do not meet source, builder, signature, or policy requirements.</td>
              <td>Production admission blocks an unsigned image even if someone can push it to a registry.</td>
            </tr>
            <tr>
              <td>Response</td>
              <td>Rebuild, revoke, rotate, and redeploy clean artifacts quickly after compromise.</td>
              <td>Incident drills produce a list of affected artifacts and environments within minutes.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Policy Examples That Are Worth Automating</h2>

      <p>Security policy should move closer to the point where a decision is made. Repository policy belongs near code review. Build policy belongs in CI. Artifact policy belongs in the registry and admission controller. Runtime policy belongs in the cluster or deployment platform. Manual review is useful, but repeated manual review of the same rule eventually fails.</p>

      <pre><code>example_release_policy:
  source:
    - "default branch is protected"
    - "workflow and deployment files require code owner review"
  build:
    - "production image built by trusted workflow only"
    - "cloud credentials issued through OIDC"
  artifact:
    - "image is signed"
    - "provenance references expected repository and commit"
    - "critical vulnerability exceptions expire"
  deploy:
    - "deploy by digest"
    - "admission verifies signature and provenance"</code></pre>

      <h2>Common Trade-Offs</h2>

      <p>Strong supply chain controls can slow teams if implemented as a wall instead of a paved road. The goal is to make the secure path the easiest path. Provide reusable workflow templates, base images, signing steps, SBOM generation, and deployment policies. Then teams do not have to invent the same controls for every service.</p>

      <p>Another trade-off is exception handling. Production teams need a way to ship emergency fixes, but exceptions should be time-bound and visible. A permanent exception for unsigned images, broad CI credentials, or unpinned build tools becomes the real policy. If an exception is necessary, record the owner, reason, expiration, and compensating control.</p>

      <h2>Questions for a Release Review</h2>

      <ul>
        <li>Can this artifact be traced to the exact source commit and workflow that built it?</li>
        <li>Can the build job reach production credentials directly, or does it use short-lived federation?</li>
        <li>Can untrusted pull request code influence a trusted release artifact?</li>
        <li>Can a registry tag be overwritten after release?</li>
        <li>Can production reject an artifact that is unsigned or built by an unexpected workflow?</li>
        <li>Can the team identify all deployments of a compromised image digest?</li>
      </ul>

      <p>If the answer to several questions is no, start with the release path for one critical service. Make that path reliable, repeatable, and enforced. Then expand the pattern to more services instead of trying to boil the entire supply chain at once.</p>

      <h2>What Good Looks Like</h2>

      <p>A healthy supply chain is boring in the best way. A developer opens a pull request, reviewers approve the source change, CI runs with narrow permissions, the build uses pinned inputs, the artifact is created in a trusted runner, provenance is generated, the image is signed, and deployment policy verifies the result before it reaches the cluster. No person copies a production key. No job can silently replace a release artifact. No unsigned image becomes a production workload by accident.</p>

      <p>That boring path is what makes incident response possible. When a dependency advisory appears, the team can find affected SBOMs. When a registry tag is suspicious, the team can compare digests. When a workflow changes, code owners see it. When an emergency exception is needed, it is visible, time-bound, and reviewed afterward. Supply chain security is working when engineers can move quickly without bypassing the trust model.</p>

      <h2>Related CodersSecret Guides</h2>

      <ul>
        <li><a href="/blog/common-cicd-attack-paths">Common CI/CD Attack Paths</a></li>
        <li><a href="/blog/kubernetes-security-explained">Kubernetes Security Explained</a></li>
        <li><a href="/cheatsheets/devsecops">DevSecOps Cheatsheet</a></li>
        <li><a href="/games/supply-chain-defense">Practice Supply Chain Defense</a></li>
      </ul>

      <h2>Sources and Further Reading</h2>

      <ul>
        <li><a href="https://slsa.dev/spec/v1.0/">SLSA specification</a></li>
        <li><a href="https://www.cisa.gov/news-events/alerts/2023/11/09/cisa-nsa-and-partners-release-new-guidance-securing-software-supply-chain">CISA software supply chain guidance</a></li>
        <li><a href="https://owasp.org/www-project-top-10-ci-cd-security-risks/">OWASP Top 10 CI/CD Security Risks</a></li>
      </ul>
`;
