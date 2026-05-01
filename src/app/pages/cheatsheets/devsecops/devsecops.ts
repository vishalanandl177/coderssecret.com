import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../../services/seo.service';
import { CheatsheetPageComponent, CheatsheetHeader, CommandGroup, MisconfigPair, RelatedLink } from '../_shared/cheatsheet-page';

@Component({
  selector: 'app-cheatsheet-devsecops',
  imports: [RouterLink, CheatsheetPageComponent],
  template: `
    <section class="py-12 md:py-16 animate-in fade-in duration-500">
      <div class="container max-w-5xl mx-auto px-6">
        <nav aria-label="Breadcrumb" class="mb-6">
          <ol class="flex items-center gap-1.5 text-sm text-muted-foreground">
            <li><a routerLink="/" class="hover:text-foreground transition-colors">Home</a></li>
            <li class="text-muted-foreground/50">/</li>
            <li><a routerLink="/cheatsheets" class="hover:text-foreground transition-colors">Reference</a></li>
            <li class="text-muted-foreground/50">/</li>
            <li class="text-foreground font-medium" aria-current="page">DevSecOps & Supply Chain</li>
          </ol>
        </nav>

        <app-cheatsheet-page [header]="header" [groups]="groups" [misconfigPairs]="misconfigs" [relatedLinks]="related" />
      </div>
    </section>
  `,
})
export class DevSecOpsCheatsheetComponent {
  private seo = inject(SeoService);

  header: CheatsheetHeader = {
    icon: '🔗',
    iconColor: '#14b8a6',
    badge: 'Production Reference',
    badgeClass: 'bg-teal-500/10 border-teal-500/30 text-teal-500',
    title: 'DevSecOps & Supply Chain Cheatsheet',
    intro: 'Operational reference for securing the software supply chain. cosign signing, SBOM generation, SLSA provenance, GitHub Actions security patterns, and the gates that catch supply-chain attacks at CI time before they reach production.',
  };

  groups: CommandGroup[] = [
    {
      title: 'Sigstore / cosign (artifact signing)',
      rows: [
        { cmd: 'cosign generate-key-pair', desc: 'Generate a cosign keypair locally. Use only for testing — production should use keyless signing.', warning: 'Local keys must be protected like any private key. Lost = re-issue all signatures; leaked = forged signatures.' },
        { cmd: 'cosign sign --identity-token=$OIDC_TOKEN <image>@sha256:<digest>', desc: 'Keyless signing via Sigstore Fulcio. The signing identity comes from your OIDC provider (GitHub, Google, etc.).', prodNote: 'Keyless is the production default. The signing certificate is short-lived and tied to a verifiable identity — no keys to leak or rotate.' },
        { cmd: 'cosign verify --certificate-identity-regexp=".*@example.com$" --certificate-oidc-issuer=https://accounts.google.com <image>', desc: 'Verify a signature, gating on identity (issuer + subject pattern).', warning: 'Without --certificate-identity, ANY Sigstore-signed image passes — defeats the purpose. Always pin the expected signer.' },
        { cmd: 'cosign attest --predicate sbom.spdx.json --type spdx <image>', desc: 'Attach an SBOM (or other predicate) as an attestation alongside the image. Stored in the registry.', prodNote: 'Predicate types: spdx, cyclonedx, slsaprovenance, vuln, custom. Use the standardized types when possible.' },
        { cmd: 'cosign verify-attestation --type slsaprovenance --certificate-identity-regexp ".*@github.com$" <image>', desc: 'Verify an attestation matches expected predicate type and signer.', prodNote: 'Pair with `cue` or `rego` to validate the predicate content (e.g. provenance level >= L3).' },
      ],
    },
    {
      title: 'SBOMs (Software Bill of Materials)',
      rows: [
        { cmd: 'syft <image> -o spdx-json > sbom.spdx.json', desc: 'Generate an SPDX-format SBOM from an image. SPDX is the ISO standard.', prodNote: 'Generate at build time; attach as attestation. Recreating SBOMs after-the-fact is unreliable.' },
        { cmd: 'syft <image> -o cyclonedx-json > sbom.cdx.json', desc: 'CycloneDX format. Often preferred by security tooling.', prodNote: 'Both are valid. Pick one for your org and stick with it — multi-format proliferation creates confusion.' },
        { cmd: 'grype <image>  /  grype sbom:sbom.spdx.json', desc: 'Vulnerability scan against an image or pre-generated SBOM. SBOM-based scans are deterministic.', prodNote: 'Run grype in CI on every build. Gate releases on severity threshold (e.g. fail on Critical, page on High).' },
        { cmd: 'trivy image --severity HIGH,CRITICAL <image>', desc: 'Trivy is the alternative to grype. Both are CNCF; pick one.', prodNote: 'Trivy also scans IaC, secrets, misconfigurations — broader scope, different mental model.' },
        { cmd: 'oras attach --artifact-type "application/spdx+json" <image> sbom.spdx.json', desc: 'Attach SBOM as an OCI referrer to an image. Stays linked through registry copies.', prodNote: 'Modern registries (ghcr, ecr, gcr) support OCI 1.1 referrers — SBOMs travel with the image automatically.' },
      ],
    },
    {
      title: 'SLSA provenance',
      rows: [
        { cmd: 'SLSA Build Level 1', desc: 'Provenance document is generated. Build is documented but not necessarily reproducible.', prodNote: 'Achievable with simple in-pipeline scripts; little assurance value alone.' },
        { cmd: 'SLSA Build Level 2', desc: 'Build runs on a hosted service (e.g. GitHub Actions); provenance is signed.', prodNote: 'GitHub Actions + slsa-github-generator is a turnkey path to L2.' },
        { cmd: 'SLSA Build Level 3', desc: 'Provenance is non-forgeable: the build platform attests directly, not the build itself.', prodNote: 'L3 is the realistic production target. Requires hardened build runners and isolated provenance generation.' },
        { cmd: 'slsa-verifier verify-artifact --provenance-path attestation.intoto.jsonl --source-uri github.com/org/repo --source-tag v1.2.3 <artifact>', desc: 'Verify SLSA provenance against expected source repo and tag.', prodNote: 'Run as an admission gate — only deploy artifacts whose provenance ties to your trusted source repo.' },
        { cmd: 'github_action_jobs:\n  build:\n    permissions:\n      id-token: write\n    uses: slsa-framework/slsa-github-generator/.github/workflows/generator_container_slsa3.yml@v1', desc: 'GitHub Actions reusable workflow that produces SLSA L3 provenance for container images.', prodNote: 'id-token: write is required for OIDC-based keyless signing. Pin the workflow to a specific tag, not @main.' },
      ],
    },
    {
      title: 'Image admission policy (Kubernetes)',
      rows: [
        { cmd: 'kyverno verify-images:\n  imageReferences:\n  - "registry.example.com/*"\n  attestors:\n  - entries:\n    - keyless:\n        subject: ".*@example.com$"\n        issuer: https://accounts.google.com', desc: 'Kyverno cluster policy that requires keyless cosign signature on all images from your registry.', prodNote: 'Audit-mode rollout (validationFailureAction: audit) before enforce. Logs unsigned images without blocking; gives you a window to clean up.' },
        { cmd: 'cosigned (admission webhook)', desc: 'Sigstore-maintained admission controller that enforces signed images.', prodNote: 'Lighter-weight than Kyverno if signing is the only policy you need. Kyverno wins for richer policy needs.' },
        { cmd: 'connaisseur (legacy)', desc: 'Older admission controller for image signing. Still supported.', warning: 'Kyverno + cosign or cosigned have eclipsed Connaisseur for new deployments.' },
      ],
    },
    {
      title: 'GitHub Actions security',
      rows: [
        { cmd: 'permissions:\n  contents: read\n  id-token: write', desc: 'Workflow-level permissions. Default is full GITHUB_TOKEN — explicit minimum is the safe default.', warning: 'Without explicit permissions, every workflow has read+write to everything. A compromised dependency exfiltrates secrets immediately.' },
        { cmd: 'uses: actions/checkout@v4  # never @main, never @master', desc: 'Pin actions to a specific tag or SHA. Renovate/Dependabot handle updates.', prodNote: 'For public actions, prefer SHA pinning with comments: `uses: actions/checkout@8e5e7e5` # v4.1.7. SHAs are immutable; tags can be moved.' },
        { cmd: 'jobs.<job>.environment: production', desc: 'Tie a job to a protected environment with required reviewers. Adds human gate to deploys.', prodNote: 'Protected environments + branch protection rules + required reviewers = ".github/workflows/deploy.yml cannot deploy without two human approvals".' },
        { cmd: 'secrets: inherit  /  env: { GH_TOKEN: ${{ secrets.GH_TOKEN }} }', desc: 'Secret scoping in reusable workflows. inherit shares all; explicit env is least privilege.', warning: 'inherit is convenient but leaks every secret to every reusable workflow. Pass only the secrets needed.' },
        { cmd: 'pull_request_target  vs  pull_request', desc: 'pull_request_target runs in the context of the base branch with secrets — risky for fork PRs. pull_request runs in fork context without secrets.', warning: 'pull_request_target with checkout of fork code is the canonical "GitHub Actions RCE via PR" pattern. Don\'t check out fork code with secrets in scope.' },
        { cmd: 'job.<id>.steps[].if: always() && needs.scan.outputs.severity == \'critical\'', desc: 'Gate on outputs from previous jobs. Use to block deploys on scan failure.', prodNote: 'Standard CI gate: scan -> deploy, with deploy `needs: [scan]` and a severity check.' },
      ],
    },
    {
      title: 'Pre-commit / CI gates',
      rows: [
        { cmd: 'gitleaks detect --source . --redact', desc: 'Find committed secrets. Run as pre-commit hook AND in CI.', warning: 'Pre-commit alone is insufficient — developers can skip hooks. CI gate is the enforcement layer.' },
        { cmd: 'trivy config <dir>', desc: 'Scan IaC (Terraform, K8s manifests, Dockerfiles) for misconfigurations.', prodNote: 'Run on every PR that touches infra. Surface findings as PR comments via reviewdog or trivy-action.' },
        { cmd: 'kube-linter lint <dir>', desc: 'Lint Kubernetes manifests for common security issues (privileged, no probes, missing labels).', prodNote: 'Pair with kustomize/Helm rendering in CI so you lint the final manifest, not the template.' },
        { cmd: 'osv-scanner scan ./', desc: 'Scan dependencies against the OSV database. Faster + more comprehensive than language-specific tools.', prodNote: 'OSV covers npm, pypi, go, maven, etc. in one tool. Simplifies dependency-scan toolchain.' },
      ],
    },
  ];

  misconfigs: MisconfigPair[] = [
    {
      bad: `# Local keypair signing
cosign sign --key cosign.key <image>`,
      good: `# Keyless via OIDC
cosign sign <image>
# (cosign auto-detects CI OIDC token and uses Fulcio)
# In GitHub Actions:
permissions:
  id-token: write`,
      why: 'Local cosign keys must be stored, distributed, and rotated — and "cosign.key" leaks find their way into Git or build logs regularly. Keyless signing uses a short-lived cert tied to a verifiable identity (your OIDC issuer + email). No keys, no rotation, much smaller attack surface.',
    },
    {
      bad: `# Verify image is signed (any signer)
cosign verify <image>`,
      good: `# Verify signed BY THE EXPECTED IDENTITY
cosign verify <image> \\
  --certificate-identity-regexp=".*@example.com$" \\
  --certificate-oidc-issuer=https://accounts.google.com`,
      why: '`cosign verify` without identity flags only checks "is this signed by anyone via Sigstore?" — which is trivially satisfied by an attacker signing their own image. The identity flags pin the expected signer, so only signatures from your CI / your team pass.',
    },
    {
      bad: `# GitHub Action with default permissions
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - run: ./build.sh`,
      good: `jobs:
  build:
    permissions:
      contents: read
      id-token: write
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@8e5e7e5
      # ^ pinned to a specific SHA
    - run: ./build.sh`,
      why: 'Default GITHUB_TOKEN permissions include write to contents, packages, deployments, and more. A compromised dependency in build.sh exfiltrates secrets and rewrites repository history. Explicit minimum permissions + SHA-pinned actions close the most common GitHub Actions supply-chain attacks.',
    },
  ];

  related: RelatedLink[] = [
    { label: 'Cloud Native Security Engineering — Supply Chain module', href: '/courses/cloud-native-security-engineering/supply-chain-security', description: 'Module: secure CI/CD, signing, attestation, and the gates that close the supply-chain gap.' },
    { label: 'Kubernetes Supply Chain Security guide', href: '/courses/kubernetes-supply-chain-security', description: 'End-to-end signing and verification for Kubernetes deployments.' },
    { label: 'Secure CI/CD Pipelines module', href: '/courses/cloud-native-security-engineering/secure-cicd-pipelines', description: 'Module: hardened CI runners, secret management, and policy gates.' },
    { label: 'Sigstore glossary entry', href: '/glossary/sigstore', description: 'What Sigstore is and how cosign + Fulcio + Rekor compose.' },
  ];

  constructor() {
    this.seo.update({
      title: 'DevSecOps & Supply Chain Cheatsheet',
      description: 'Production reference for software supply chain security: cosign keyless signing, SBOM generation with syft, SLSA provenance levels, Kyverno admission policy, and hardened GitHub Actions patterns. Free, ad-free.',
      url: '/cheatsheets/devsecops',
      breadcrumbs: [
        { name: 'Home', url: '/' },
        { name: 'Reference', url: '/cheatsheets' },
        { name: 'DevSecOps & Supply Chain', url: '/cheatsheets/devsecops' },
      ],
    });
  }
}
