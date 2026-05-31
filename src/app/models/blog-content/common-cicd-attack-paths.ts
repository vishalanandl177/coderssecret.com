export const CONTENT = `
      <p>CI/CD systems are trusted automation with access to source code, secrets, artifacts, cloud roles, deployment environments, and production clusters. That makes them attractive targets. An attacker does not need direct production access if the pipeline can build, sign, and deploy for them.</p>

      <p>This guide explains common CI/CD attack paths and the controls that reduce blast radius.</p>

      <aside class="callout callout-security">
        <strong>Security mindset:</strong> treat CI/CD as production infrastructure. A compromised workflow can be as serious as a compromised server.
      </aside>

      <h2>Attack Path 1: Poisoned Pull Request Workflow</h2>

      <p>A pull request from an untrusted branch can change code, tests, scripts, and sometimes workflow files. If that workflow receives secrets or privileged tokens, the attacker can exfiltrate credentials or modify build output.</p>

      <p>Controls:</p>

      <ul>
        <li>Do not expose deployment secrets to untrusted pull request workflows.</li>
        <li>Separate validation workflows from privileged release workflows.</li>
        <li>Require approval before running workflows from first-time contributors.</li>
        <li>Pin actions and tools where the risk justifies it.</li>
      </ul>

      <h2>Attack Path 2: Long-Lived Secrets in CI</h2>

      <p>Static cloud keys, registry tokens, SSH keys, and kubeconfigs are often stored as CI secrets. Once leaked, they may work outside the pipeline and outside the intended job.</p>

      <p>Use OIDC federation when possible. The CI platform should request a short-lived token scoped to the repository, branch, environment, and workflow. Cloud IAM policy can then decide whether that run is allowed to deploy.</p>

      <h2>Attack Path 3: Compromised Runner</h2>

      <p>Self-hosted runners are powerful but dangerous when they run untrusted jobs. A runner may keep workspace files, Docker layers, credentials, network access, or cached artifacts between jobs if it is not isolated correctly.</p>

      <p>High-risk workloads should use ephemeral runners. At minimum, isolate runner groups by trust level, clean workspaces aggressively, restrict network access, and avoid sharing deployment runners with pull request validation.</p>

      <h2>Attack Path 4: Dependency Confusion and Build Tool Abuse</h2>

      <p>Builds often fetch dependencies, plugins, base images, scripts, and tools. If package names, registries, versions, or checksums are not controlled, a malicious dependency can execute during install or build.</p>

      <p>Controls include private registry configuration, lockfiles, dependency review, checksum verification for downloaded tools, and avoiding curl-to-shell install steps in trusted pipelines.</p>

      <h2>Attack Path 5: Artifact Replacement</h2>

      <p>If attackers can overwrite an image tag, package, or release artifact after review, production may deploy something different from what was approved. Mutable tags such as <code>latest</code> make this worse.</p>

      <p>Use immutable digests, restricted registry permissions, provenance, image signing, environment approvals, and deployment policy that verifies the artifact identity.</p>

      <h2>Attack Path 6: Overpowered Environment Permissions</h2>

      <p>Many pipelines use the same credentials for staging and production. Some allow any branch to deploy to sensitive environments. Others grant broad cloud permissions because least privilege was too slow during setup.</p>

      <p>Use environment-specific policies, branch restrictions, manual approvals for sensitive changes, and role separation between build, publish, and deploy steps.</p>

      <h2>CI/CD Defense Checklist</h2>

      <ul>
        <li>Map every workflow that can publish or deploy artifacts.</li>
        <li>Remove static cloud keys where OIDC federation is supported.</li>
        <li>Separate untrusted PR workflows from trusted release workflows.</li>
        <li>Use ephemeral or strongly isolated self-hosted runners.</li>
        <li>Pin critical actions, base images, and tool downloads.</li>
        <li>Generate provenance and sign release artifacts.</li>
        <li>Deploy by immutable digest, not mutable tags.</li>
        <li>Enforce production admission policy for signed and trusted artifacts.</li>
      </ul>

      <h2>Attack Path Flow Diagram</h2>

      <p>CI/CD attacks usually work because the pipeline is trusted to do what humans cannot do manually: fetch secrets, build artifacts, and deploy. The attacker only needs to influence one trusted step.</p>

      <div class="flow-diagram" role="img" aria-label="CI/CD attack path from pull request to production deployment">
        <div class="flow-diagram-title">Untrusted Change &rarr; Trusted Pipeline &rarr; Production Access</div>
        <div style="display:grid;grid-template-columns:repeat(5,minmax(140px,1fr));gap:0.75rem;min-width:820px">
          <div style="border:1px solid var(--md-sys-color-outline-variant);background:var(--md-sys-color-surface-container);border-radius:0.9rem;padding:1rem;text-align:center"><strong>Input</strong><br><small>PR, branch, dependency, workflow edit</small></div>
          <div style="border:1px solid var(--md-sys-color-tertiary);background:var(--md-sys-color-tertiary-container);color:var(--md-sys-color-on-tertiary-container);border-radius:0.9rem;padding:1rem;text-align:center"><strong>Runner</strong><br><small>Executes untrusted code</small></div>
          <div style="border:1px solid var(--md-sys-color-error);background:var(--md-sys-color-error-container);color:var(--md-sys-color-on-error-container);border-radius:0.9rem;padding:1rem;text-align:center"><strong>Secret</strong><br><small>Token, cloud role, registry push</small></div>
          <div style="border:1px solid var(--md-sys-color-secondary);background:var(--md-sys-color-secondary-container);color:var(--md-sys-color-on-secondary-container);border-radius:0.9rem;padding:1rem;text-align:center"><strong>Artifact</strong><br><small>Image, package, IaC plan</small></div>
          <div style="border:1px solid var(--md-sys-color-primary);background:var(--md-sys-color-primary-container);color:var(--md-sys-color-on-primary-container);border-radius:0.9rem;padding:1rem;text-align:center"><strong>Deploy</strong><br><small>Environment trusts pipeline</small></div>
        </div>
      </div>

      <h2>High-Risk Workflow Patterns</h2>

      <p>The most dangerous pipeline designs combine untrusted code execution with trusted credentials. Fork pull requests, dependency install scripts, generated build steps, and workflow changes are all code execution paths. If those paths can access secrets or write artifacts that production trusts, they become deployment paths for attackers.</p>

      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Pattern</th>
              <th>Why it is risky</th>
              <th>Safer design</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Fork PR runs with secrets</td>
              <td>Untrusted code can exfiltrate credentials.</td>
              <td>Run untrusted PR checks without secrets; deploy only after trusted review.</td>
            </tr>
            <tr>
              <td>Workflow file changes auto-run</td>
              <td>Attacker changes the pipeline before the pipeline protects itself.</td>
              <td>Require code owner review for workflow and IaC paths.</td>
            </tr>
            <tr>
              <td>Long-lived cloud keys in CI</td>
              <td>Stolen key remains useful after the job ends.</td>
              <td>Use OIDC federation with short-lived scoped credentials.</td>
            </tr>
            <tr>
              <td>Mutable release tags</td>
              <td>A trusted tag can be replaced with a malicious artifact.</td>
              <td>Deploy by digest and prevent overwrite of release artifacts.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Example: Split Build and Deploy Trust</h2>

      <p>A safe pipeline often has two trust levels. The first level runs tests on untrusted code without secrets. The second level deploys only reviewed code from protected branches. This is less convenient than one pipeline that does everything, but it makes the trust boundary visible.</p>

      <pre><code># Safer pipeline shape
pull_request:
  permissions: read-only
  secrets: none
  actions: test, lint, build-untrusted

main_branch_after_review:
  permissions: scoped
  credentials: short-lived OIDC role
  actions: build, sign, attest, deploy</code></pre>

      <h2>Detection Signals</h2>

      <p>CI/CD security is not only prevention. You should alert on unusual workflow edits, new secrets, new self-hosted runners, unexpected outbound network calls during build, artifact overwrites, deployments outside normal windows, and new cloud roles assumed by CI. These signals often catch misuse faster than vulnerability scanners.</p>

      <aside class="callout callout-security">
        <strong>Review habit:</strong> treat workflow files, build scripts, Dockerfiles, package manager hooks, and deployment manifests as production code. They can change what reaches production even when application code looks safe.
      </aside>

      <h2>Runner Isolation Model</h2>

      <p>Runners are execution environments, so treat them like production infrastructure. A hosted runner, a self-hosted runner, and a long-lived build machine have different risk profiles. The central question is whether untrusted code can persist, read credentials, reach internal networks, or influence a later trusted build.</p>

      <p>Self-hosted runners are useful for private networks, large builds, or specialized hardware, but they require stronger isolation. If an untrusted pull request can run on a self-hosted runner with access to internal systems, the runner becomes a bridge from the internet into your environment. Use ephemeral runners, network segmentation, clean workspaces, and strict workflow routing.</p>

      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Runner type</th>
              <th>Main risk</th>
              <th>Mitigation</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Hosted ephemeral runner</td>
              <td>Workflow permissions and exposed secrets.</td>
              <td>Least privilege job permissions, no secrets for untrusted code, OIDC roles.</td>
            </tr>
            <tr>
              <td>Persistent self-hosted runner</td>
              <td>State persists between jobs and can expose future builds.</td>
              <td>Avoid for untrusted code, clean workspace, rotate credentials, isolate network.</td>
            </tr>
            <tr>
              <td>Ephemeral self-hosted runner</td>
              <td>Provisioning image or bootstrap script compromise.</td>
              <td>Harden images, patch frequently, restrict metadata and internal network access.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Threat Modeling a Pipeline Change</h2>

      <p>Before approving a pipeline change, ask what new authority it grants. Does it add a secret? Does it change who can deploy? Does it install dependencies from a new registry? Does it run on a privileged runner? Does it upload artifacts to a trusted location? Does it change the permissions block? Those are security changes even if the file is called CI configuration.</p>

      <pre><code>pipeline_review_questions:
  - "Can this workflow run on untrusted input?"
  - "Can it read secrets or assume cloud roles?"
  - "Can it publish packages, images, or release assets?"
  - "Can it deploy or modify infrastructure?"
  - "Can it change another workflow or generated artifact?"
  - "Is the runner isolated from internal services?"</code></pre>

      <h2>How to Handle Tag and Release Attacks</h2>

      <p>Tags feel stable, but many systems treat mutable tags as trusted release identifiers. If an attacker can move a tag, overwrite a package, or push a new image to an existing tag, consumers may deploy attacker-controlled code while believing they are using a known release. Production systems should prefer immutable digests and should protect release tags from modification.</p>

      <p>For containers, deploy by digest where possible. For packages, enforce registry permissions, provenance, and version immutability. For Git tags, protect release tag patterns and require signed or reviewed release workflows when the organization needs that level of assurance. The goal is to make a release artifact a stable object, not a name that can quietly point somewhere else.</p>

      <h2>Practical Review Flow for Existing Pipelines</h2>

      <p>If you already have dozens of workflows, do not try to redesign them all in one pass. Start by listing workflows that can deploy, publish packages, push images, assume cloud roles, or modify infrastructure. Those workflows are the trust boundary. Read them line by line and mark where they accept input, where they install dependencies, where they read secrets, and where they write artifacts.</p>

      <p>Then rank the risky paths. A lint workflow with no secrets is usually less urgent than a deployment workflow with a broad cloud role. A workflow that runs only on the protected main branch is different from one that runs on fork pull requests. A self-hosted runner connected to internal networks deserves more attention than an ephemeral hosted runner running unit tests. This ranking keeps the work practical and prevents security review from becoming a spreadsheet nobody finishes.</p>

      <p>The final step is enforcement. Good guidance is not enough if the old pattern remains easy. Add repository rules for workflow files, set default job permissions to read-only, require environment approvals for production, and make reusable secure workflow templates the default for new services. That is how teams move from awareness to durable control.</p>

      <h2>Related CodersSecret Guides</h2>

      <ul>
        <li><a href="/blog/software-supply-chain-security-explained">Software Supply Chain Security Explained</a></li>
        <li><a href="/blog/github-actions-ci-cd-pipelines-mastery">GitHub Actions Mastery</a></li>
        <li><a href="/cheatsheets/devsecops">DevSecOps Cheatsheet</a></li>
        <li><a href="/games/supply-chain-defense">Supply Chain Defense Lab</a></li>
      </ul>

      <h2>Sources and Further Reading</h2>

      <ul>
        <li><a href="https://owasp.org/www-project-top-10-ci-cd-security-risks/">OWASP Top 10 CI/CD Security Risks</a></li>
        <li><a href="https://slsa.dev/spec/v1.0/">SLSA specification</a></li>
        <li><a href="https://www.cisa.gov/resources-tools/resources/defending-against-software-supply-chain-attacks">CISA: Defending Against Software Supply Chain Attacks</a></li>
      </ul>
`;
