import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../../services/seo.service';
import { ScenarioQuizComponent, Scenario, QuizTheme, QuizIntro, QuizResults, QuizCallToActions } from '../_shared/scenario-quiz';

@Component({
  selector: 'app-supply-chain-defense',
  imports: [RouterLink, ScenarioQuizComponent],
  template: `
    <section class="py-12 md:py-16 animate-in fade-in duration-500">
      <div class="container max-w-4xl mx-auto px-6">
        <nav aria-label="Breadcrumb" class="mb-6">
          <ol class="flex items-center gap-1.5 text-sm text-muted-foreground">
            <li><a routerLink="/" class="hover:text-foreground transition-colors">Home</a></li>
            <li class="text-muted-foreground/50">/</li>
            <li><a routerLink="/games" class="hover:text-foreground transition-colors">Security Simulators</a></li>
            <li class="text-muted-foreground/50">/</li>
            <li class="text-foreground font-medium" aria-current="page">Supply Chain Defense</li>
          </ol>
        </nav>

        <app-scenario-quiz [scenarios]="scenarios" [theme]="theme" [intro]="intro" [results]="results" [callToActions]="callToActions" />
      </div>
    </section>
  `,
})
export class SupplyChainDefenseComponent {
  private seo = inject(SeoService);

  theme: QuizTheme = {
    badgePill: 'bg-green-500/10 border-green-500/30 text-green-500',
    accentText: 'text-green-500',
    titleGradient: 'from-green-500 via-emerald-500 to-teal-500',
    numberCircle: 'bg-green-500/15 text-green-500',
    startButton: 'bg-green-500 hover:bg-green-400 shadow-green-500/30',
    topicPill: 'bg-green-500/15 text-green-500',
    callout: 'border-green-500/30 bg-green-500/5',
    calloutTitle: 'text-green-500',
    resultsBg: 'from-green-500/10 via-card to-emerald-500/10',
  };

  intro: QuizIntro = {
    badge: 'Supply Chain Lab',
    titlePlain: 'Supply Chain',
    titleGradient: 'Defense Simulator',
    description: 'Most security incidents now begin in the supply chain — a compromised dependency, an unsigned image, a leaked CI token. Each scenario drops you into a real attack class and asks you to spot the gap before the build promotes to production.',
    steps: [
      'Each scenario shows a CI/CD config, an SBOM diff, or a registry artefact with a hidden supply-chain risk.',
      'Identify the issue from four plausible options — the wrong answers explain why they look reasonable but miss the real risk.',
      'Read the production explanation, follow the link to the relevant lesson, and move to the next scenario.',
      'Score yourself across all six rounds — covering signature verification, SBOM gaps, SLSA provenance, dependency confusion, CI runner compromise, and admission policy.',
    ],
    practiceTitle: `What You'll Practice`,
    practiceDescription: 'The simulator covers the supply-chain attack classes that show up in real-world incident reports — from SolarWinds to xz-utils to compromised npm packages.',
    practiceConcepts: [
      { name: 'Sigstore', description: 'cosign signing & verification gates' },
      { name: 'SBOM', description: 'syft / grype / CycloneDX coverage' },
      { name: 'SLSA', description: 'Provenance levels & verification' },
      { name: 'Dep Confusion', description: 'Internal vs public registry collision' },
      { name: 'CI Runners', description: 'Hardening untrusted build environments' },
      { name: 'Admission', description: 'Kyverno / cosigned image gates' },
    ],
    deeperLine: 'Want to go deeper after the simulation? Read the ',
    deeperLinks: [
      { label: 'Kubernetes Supply Chain Security guide', href: '/courses/kubernetes-supply-chain-security' },
      { label: 'DevSecOps cheatsheet', href: '/cheatsheets/devsecops' },
    ],
    timeMinutes: 12,
    difficulty: 'Medium',
  };

  results: QuizResults = {
    perfect: { headline: 'Supply chain hardened. Flawless run.', emoji: '\u{1F947}', message: 'You spotted every supply-chain gap. The Cloud Native Security Engineering course goes deeper into multi-org SLSA design and the gates that scale across hundreds of services.' },
    great: { headline: 'You think like an SBOM auditor.', emoji: '\u{1F510}', message: 'Strong instincts. Brush up on the few you missed and read the DevSecOps cheatsheet for the hardened cosign / Kyverno patterns.' },
    good: { headline: 'Solid foundation — refine the rough edges.', emoji: '\u{1F4DA}', message: 'You know the patterns. The structured curriculum walks through each attack class with the labs to deploy the fixes.' },
    weak: { headline: 'Time to dig into supply chain fundamentals.', emoji: '\u{1F50D}', message: 'These are the SolarWinds / xz-utils / dependency-confusion patterns. Start with the supply-chain modules and the DevSecOps cheatsheet, then come back.' },
  };

  callToActions: QuizCallToActions = {
    primary: { label: 'Take the supply chain course', href: '/courses/kubernetes-supply-chain-security' },
  };

  scenarios: Scenario[] = [
    {
      id: 'cosign-verify-no-identity',
      topic: 'Sigstore',
      title: 'A "verify image is signed" admission gate',
      briefing: 'Your platform team adds an admission policy that rejects unsigned images. The verification step in the CI lint job runs:',
      yaml: `# Pre-deploy gate (CI):
cosign verify registry.example.com/payments-api:v1.42

# Admission policy (Kyverno):
verifyImages:
- imageReferences:
  - "registry.example.com/*"
  attestors:
  - entries:
    - keyless: {}        # any keyless signer accepted`,
      question: 'What\'s wrong with this verification?',
      choices: [
        {
          label: 'cosign needs the --key flag for verification.',
          correct: false,
          feedback: 'Without --key, cosign verifies via Sigstore keyless (Fulcio + Rekor). That\'s correct usage. The bug is elsewhere.',
        },
        {
          label: '"any keyless signer accepted" means an attacker can sign their own malicious image with their own GitHub identity and the gate passes — the policy verifies signed-ness but not signed-by-whom.',
          correct: true,
          feedback: 'Correct. Sigstore keyless lets anyone with any OIDC identity sign anything. Without an identity allowlist (--certificate-identity-regexp + --certificate-oidc-issuer in cosign, or matching attestor block in Kyverno), the gate confirms "this image is signed by someone Sigstore knows about" — which is trivially satisfied by an attacker.',
        },
        {
          label: 'Kyverno doesn\'t support Sigstore — must use the cosigned admission controller.',
          correct: false,
          feedback: 'Kyverno fully supports Sigstore (verifyImages rule). cosigned is an alternative; both work.',
        },
        {
          label: 'cosign verify only checks the latest tag, not the specific version.',
          correct: false,
          feedback: 'cosign verify checks the specified reference. It works on tags, digests, and digest-pinned images.',
        },
      ],
      explanation: 'The hardened pattern: pin the expected signer identity. In cosign: --certificate-identity-regexp ".*@example.com$" --certificate-oidc-issuer "https://accounts.google.com". In Kyverno verifyImages: attestors with an entries.keyless block specifying subject and issuer. Even better, gate on a specific repo name in the certificate identity (e.g. "ci@github.com:example/payments-api"). The whole point of keyless is the verifiable identity — use it.',
      learnMore: { label: 'Sigstore in production', href: '/cheatsheets/devsecops' },
    },
    {
      id: 'sbom-transitive-blind-spot',
      topic: 'SBOM',
      title: 'A vulnerability scanner shows zero CVEs',
      briefing: 'You ship images with a CI step that scans dependencies. The scanner reports "0 vulnerabilities" on every build for the past month. Your security team asks for an SBOM-based audit and finds:',
      yaml: `# CI step:
trivy image --severity HIGH,CRITICAL registry/api:latest
# 0 vulnerabilities in 0.3s

# Generated SBOM (syft):
$ syft registry/api:latest -o spdx-json | jq '.packages | length'
12   # only 12 packages found

# But the image is a Go binary statically linked with:
#   - 47 direct Go dependencies
#   - 312 transitive Go dependencies`,
      question: 'Why is the scanner clean while the SBOM is incomplete?',
      choices: [
        {
          label: 'The image was built with --no-cache, so Trivy\'s database is stale.',
          correct: false,
          feedback: 'Trivy maintains its own DB independently of the build. --no-cache affects build-time, not scan-time.',
        },
        {
          label: 'syft and trivy detect Go module dependencies only when the binary embeds module metadata. If the build passed `-trimpath -ldflags "-s -w"`, module info is stripped — so the scanner sees only the OS package layer, not the Go module graph.',
          correct: true,
          feedback: 'Correct. -ldflags "-s -w" strips symbol tables, and stripping or LDFLAGS that drop debug info also drop the buildinfo section that syft needs to identify Go modules. The CVE database for Go vulns is huge and well-maintained — but only matters if the SBOM is complete. Fix: build with module info preserved (drop -s -w in production builds, or use go build with -buildvcs=true) and verify SBOM coverage in CI.',
        },
        {
          label: 'Go binaries are immune to vulnerabilities by design.',
          correct: false,
          feedback: 'Go binaries inherit every CVE in their dependency graph. The Go ecosystem (gopkg.in, golang.org/x/, third-party) has plenty of CVEs.',
        },
        {
          label: 'Trivy doesn\'t support Go — only Java, Python, npm.',
          correct: false,
          feedback: 'Trivy fully supports Go module detection — when the binary metadata is intact.',
        },
      ],
      explanation: 'A "clean" SBOM is often an incomplete SBOM. The hardening pattern: (1) measure SBOM coverage in CI — count packages and compare to expected; (2) generate the SBOM at the source (build time) when full module info is available, not after the fact; (3) sign and attach the SBOM as a Sigstore attestation so consumers can verify it; (4) use language-aware scanners (osv-scanner, govulncheck) in addition to image scanners. Trivy + grype catch what they can see; if they can\'t see the modules, they can\'t catch their CVEs.',
      learnMore: { label: 'Build trustworthy SBOMs', href: '/cheatsheets/devsecops' },
    },
    {
      id: 'slsa-l2-vs-l3',
      topic: 'SLSA',
      title: 'Marketing material says "SLSA Level 3"',
      briefing: 'A vendor pitch claims SLSA Level 3 compliance for their published artefacts. Your platform team asks for the provenance attestation. The vendor sends:',
      yaml: `# attestation.intoto.jsonl payload (predicate truncated):
{
  "predicateType": "https://slsa.dev/provenance/v0.2",
  "predicate": {
    "buildType": "vendor-internal",
    "builder": { "id": "vendor-internal-buildbot" },
    "metadata": { "buildInvocationID": "..." },
    "materials": [...]
  }
}

# Signed by: vendor-signing-key (long-lived RSA key,
# stored on the build machine alongside the build)`,
      question: 'Why does this fail the SLSA L3 bar even if the vendor "publishes" provenance?',
      choices: [
        {
          label: 'SLSA L3 requires SHA-512 hashes; this is using SHA-256.',
          correct: false,
          feedback: 'SLSA doesn\'t mandate hash algorithm. The bar is about provenance non-forgeability, not crypto choice.',
        },
        {
          label: 'SLSA L3 requires the build platform itself (not the build) to attest provenance — and the signing key must be isolated from the build environment so a compromised build can\'t forge provenance. Self-hosted "vendor-internal-buildbot" with the signing key on the same machine is L2 at best.',
          correct: true,
          feedback: 'Correct. The L2 → L3 jump is exactly that: provenance must come from a hardened, isolated build platform whose signing key the build job cannot access. GitHub Actions slsa-github-generator (which uses workflow OIDC + a non-runner-side signer) hits L3. A self-hosted Jenkins where the build job has access to the private key is L2 max — a compromised build can sign forged provenance.',
        },
        {
          label: 'SLSA L3 requires the materials to be reproduced at consumer time.',
          correct: false,
          feedback: 'Reproducible builds are not a SLSA requirement (though they help). The L3 bar is about provenance integrity.',
        },
        {
          label: 'SLSA L3 requires the use of cosign — RSA-signed provenance is not SLSA.',
          correct: false,
          feedback: 'SLSA is signing-tool-agnostic. RSA, cosign keyless, and DSSE-signed in-toto all work.',
        },
      ],
      explanation: 'SLSA levels are about how trustworthy the provenance is. L1 = provenance exists. L2 = signed by the build platform. L3 = provenance is non-forgeable: a compromised build cannot create valid provenance for a different artefact (because the signing happens out-of-band, on a platform the build can\'t reach). L4 adds two-person-controlled provenance and reproducible builds. Most "SLSA-compliant" claims are L2 in practice; L3 requires real platform engineering.',
      learnMore: { label: 'SLSA in practice', href: '/courses/cloud-native-security-engineering/secure-cicd-pipelines' },
    },
    {
      id: 'dependency-confusion',
      topic: 'Dep Confusion',
      title: 'A new internal package suddenly imports from a public mirror',
      briefing: 'Your team publishes internal Python packages to a private PyPI index at `pypi.internal.example.com`. A developer reports their build is suddenly downloading from public PyPI. The pip log shows:',
      yaml: `$ pip install --index-url https://pypi.internal.example.com \\
              --extra-index-url https://pypi.org/simple \\
              internal-payments-utils

  Looking in indexes: https://pypi.internal.example.com,
                      https://pypi.org/simple
  Collecting internal-payments-utils
    Downloading internal_payments_utils-2.99.99-py3-none-any.whl
      from https://files.pythonhosted.org/...  # <-- public PyPI!
  Successfully installed internal-payments-utils-2.99.99
# (Internal version is 1.4.2)`,
      question: 'What\'s the attack here, and what\'s the fix?',
      choices: [
        {
          label: 'pip is buggy — file an issue and pin to an older version.',
          correct: false,
          feedback: 'pip is behaving exactly as documented: with multiple indexes, it picks the highest-versioned package across all of them. The flaw is the multi-index configuration, not pip itself.',
        },
        {
          label: 'Dependency confusion: an attacker registered the same package name on public PyPI with a higher version (2.99.99 vs internal 1.4.2). pip\'s --extra-index-url merges indexes and picks the highest version — pulling the attacker\'s package. Fix: pin trusted source per package, or use a single internal index that proxies/shadows public packages.',
          correct: true,
          feedback: 'Correct. Dependency confusion was popularised by Alex Birsan in 2021 and remains the canonical "I bought a name on a public registry that you have privately" attack. Fixes: (a) use --index-url alone (single source), with a private index that proxies public packages internally; (b) pin per-package source with a tool like pip-compile + hash-pinning; (c) reserve your internal package names on public registries even if you never publish there.',
        },
        {
          label: 'The internal index has a stale version — bump internal-payments-utils to 3.0.0 and republish.',
          correct: false,
          feedback: 'A version race is a temporary fix. The attacker can bump again. The structural fix is to remove the multi-index race entirely.',
        },
        {
          label: 'The TLS certificate of the internal index expired and pip silently fell back to public PyPI.',
          correct: false,
          feedback: 'pip would have errored on a cert problem, not silently substituted. The pip log shows it consulted both indexes and picked the higher version.',
        },
      ],
      explanation: 'Dependency confusion has been used in real attacks against Microsoft, Apple, Yelp, Netflix, and others. Same pattern in npm, RubyGems, Maven, NuGet. Hardening: use a single index that proxies public packages with namespace pinning; verify hashes on every install; reserve your internal package names on public registries; and audit the dependency graph for "downloaded from where" in CI. The Python ecosystem has PEP 708 (in progress) to formalise namespace control; in the meantime, configuration discipline is the only defence.',
      learnMore: { label: 'Supply chain attack patterns', href: '/courses/kubernetes-supply-chain-security' },
    },
    {
      id: 'ci-runner-secret-leak',
      topic: 'CI Runners',
      title: 'A pull request from a fork bumps a "minor dependency"',
      briefing: 'A fork PR updates package.json with a new dependency. The PR author is unknown, but the change looks innocuous. Your GitHub Actions workflow is configured as below. The PR triggers CI on push.',
      yaml: `# .github/workflows/ci.yml
on:
  pull_request_target:
    types: [opened, synchronize]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
      with:
        ref: \${{ github.event.pull_request.head.sha }}
    - run: npm install
    - run: npm test
    env:
      AWS_ACCESS_KEY_ID: \${{ secrets.AWS_ACCESS_KEY_ID }}
      AWS_SECRET_ACCESS_KEY: \${{ secrets.AWS_SECRET_ACCESS_KEY }}
      DEPLOY_TOKEN: \${{ secrets.DEPLOY_TOKEN }}`,
      question: 'What\'s the attack opportunity here?',
      choices: [
        {
          label: 'pull_request_target runs in the base branch context with full secret access. Combined with `ref: pull_request.head.sha` (checking out fork code), `npm install` runs an attacker-controlled postinstall script with AWS keys + deploy token in env vars. This is the canonical GitHub Actions secret-exfiltration pattern.',
          correct: true,
          feedback: 'Correct. pull_request_target was designed for workflows that need secrets but should not run untrusted code (e.g. labelling, comment automation). Checking out fork code in pull_request_target — and especially running npm install / pip install / mvn / go mod download — runs attacker code with secrets exposed. The fix: use plain `pull_request` (no secrets), or split into a non-secret "build untrusted code in pull_request" and a secret-scoped "deploy on pull_request_target after manual approval".',
        },
        {
          label: 'actions/checkout@v4 is too old — needs to be upgraded.',
          correct: false,
          feedback: 'v4 is current. The vulnerability is in the workflow design (pull_request_target + checkout fork + secrets), not in checkout itself.',
        },
        {
          label: 'AWS keys should be IAM roles, not env vars.',
          correct: false,
          feedback: 'Long-lived AWS keys vs OIDC-based role assumption is a separate hardening. The immediate flaw is that a fork PR can exec arbitrary code with secrets in scope.',
        },
        {
          label: 'npm install should be npm ci for reproducibility.',
          correct: false,
          feedback: 'npm ci vs npm install is good practice but doesn\'t change the attack — both run postinstall scripts.',
        },
      ],
      explanation: 'pull_request_target combined with fork checkout is GitHub\'s most-warned-against anti-pattern. The CVE list for this exact mistake is long. Hardening: never check out fork code in pull_request_target. If you need secrets-aware processing of fork PRs, do it in two stages — a non-secret build step on pull_request, then a labelled-and-approved deploy step on pull_request_target that only runs trusted code. Use OIDC-based cloud auth (aws-actions/configure-aws-credentials with role-to-assume) so secrets are short-lived and scope-limited.',
      learnMore: { label: 'Hardened CI/CD pipelines', href: '/courses/cloud-native-security-engineering/secure-cicd-pipelines' },
    },
    {
      id: 'admission-image-scope',
      topic: 'Admission',
      title: 'A Kyverno verifyImages policy that "covers production"',
      briefing: 'Your platform team adds image-signing enforcement. The policy looks like this:',
      yaml: `apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: require-signed-images
spec:
  validationFailureAction: enforce
  rules:
  - name: verify-prod-images
    match:
      any:
      - resources:
          namespaces: [prod-payments, prod-marketing]
    verifyImages:
    - imageReferences:
      - "registry.example.com/*"
      attestors:
      - entries:
        - keyless:
            subject: ".*@example.com$"
            issuer: https://accounts.google.com`,
      question: 'What\'s the gap that a determined attacker exploits?',
      choices: [
        {
          label: 'Kyverno is too slow for admission — production needs OPA Gatekeeper.',
          correct: false,
          feedback: 'Kyverno is fast enough; performance isn\'t the gap.',
        },
        {
          label: 'The match scope is "prod-payments, prod-marketing" only. An attacker who can deploy to ANY other namespace (test, staging, kube-system, default) can run unsigned images and pivot from there. The policy needs to be cluster-wide, with explicit exceptions for namespaces that can\'t be brought up to standard.',
          correct: true,
          feedback: 'Correct. The deny-everywhere-then-allowlist pattern is much safer than the allow-everywhere-then-protect-prod pattern. Real-world: an attacker who compromises a developer SA can deploy a privileged unsigned image into the default namespace, escalate via the kubelet, and pivot. Cluster-wide policy with explicit, audited namespace exclusions — not "we secured prod" — is the production posture.',
        },
        {
          label: 'imageReferences pattern "registry.example.com/*" is too narrow — needs to match every registry.',
          correct: false,
          feedback: 'The narrowness is the right call: only your registry is signed, so you only verify yours. The flaw is in the namespace match, not the image pattern.',
        },
        {
          label: 'subject regex ".*@example.com$" is too permissive — should be a single email.',
          correct: false,
          feedback: 'Allowing the engineering team\'s @example.com identities is reasonable for a CI signing service. The namespace-scope flaw is the bigger issue.',
        },
      ],
      explanation: 'Defence in depth applies to admission policy too: cluster-wide enforcement with explicit, audited exceptions beats namespace-scoped enforcement that leaves unprotected attack surface. Combine signing enforcement with PodSecurity admission (restricted profile), NetworkPolicy default-deny, and image-pull-policy validation. Treat any namespace exception as a tracked risk that needs an owner and a sunset date.',
      learnMore: { label: 'Admission control patterns', href: '/courses/cloud-native-security-engineering/policy-as-code-security' },
    },
  ];

  constructor() {
    this.seo.update({
      title: 'Supply Chain Defense Simulator',
      description: 'Interactive supply-chain security simulator: spot Sigstore identity gaps, SBOM blind spots, SLSA L2 vs L3 confusion, dependency confusion attacks, GitHub Actions secret leaks, and admission policy scope gaps across 6 production scenarios. Free, no signup.',
      url: '/games/supply-chain-defense',
      breadcrumbs: [
        { name: 'Home', url: '/' },
        { name: 'Security Simulators', url: '/games' },
        { name: 'Supply Chain Defense', url: '/games/supply-chain-defense' },
      ],
    });
  }
}
