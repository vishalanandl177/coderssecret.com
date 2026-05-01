import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../../services/seo.service';
import { CheatsheetPageComponent, CheatsheetHeader, CommandGroup, MisconfigPair, RelatedLink } from '../_shared/cheatsheet-page';

@Component({
  selector: 'app-cheatsheet-opa-rego',
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
            <li class="text-foreground font-medium" aria-current="page">OPA & Rego</li>
          </ol>
        </nav>

        <app-cheatsheet-page [header]="header" [groups]="groups" [misconfigPairs]="misconfigs" [relatedLinks]="related" />
      </div>
    </section>
  `,
})
export class OpaRegoCheatsheetComponent {
  private seo = inject(SeoService);

  header: CheatsheetHeader = {
    icon: '⚖️',
    iconColor: '#a855f7',
    badge: 'Production Reference',
    badgeClass: 'bg-purple-500/10 border-purple-500/30 text-purple-500',
    title: 'OPA & Rego Cheatsheet',
    intro: 'Operational reference for Open Policy Agent (OPA) and the Rego policy language. Rego syntax, Kubernetes admission patterns with Gatekeeper, OPA bundle workflow, and the testing flow that catches policy regressions before they reach production.',
  };

  groups: CommandGroup[] = [
    {
      title: 'Rego language essentials',
      rows: [
        { cmd: 'package authz', desc: 'Every Rego file is in a package. Queries reference this path: data.authz.allow.', prodNote: 'Use a hierarchy that mirrors your services: data.kubernetes.admission.podsecurity, data.authz.payments.read.' },
        { cmd: 'default allow := false', desc: 'Default rule: when no allow rule fires, return false. Always set defaults — undefined is not the same as false.', warning: 'Without a default, undefined results may be coerced to false by some integrations and to "no decision" by others. Be explicit.' },
        { cmd: 'allow if {\n  input.user.role == "admin"\n}', desc: 'Rule body — Rego is "if all expressions hold, the rule succeeds". The body is implicit AND.', prodNote: 'Multiple allow rules are OR-ed. Define multiple `allow` rules instead of nested OR conditions for readability.' },
        { cmd: 'deny[msg] if {\n  input.request.kind.kind == "Pod"\n  input.request.object.spec.hostNetwork\n  msg := "hostNetwork is not allowed"\n}', desc: 'Partial set rule — produces violations as set entries. Common pattern in Gatekeeper and admission control.', prodNote: 'Each entry includes a human-readable message; surface these in admission webhook responses for fast debugging.' },
        { cmd: 'some i; input.containers[i].privileged', desc: 'Iterate over a collection looking for any element matching the body. `some` introduces variables.', prodNote: 'Quantifier patterns: `every i in input.containers { not c.privileged }` for "all must satisfy".' },
      ],
    },
    {
      title: 'Built-in functions (most useful)',
      rows: [
        { cmd: 'startswith(input.image, "registry.example.com/")', desc: 'String prefix match. Use for image registry allowlists.', prodNote: 'Combine with regex.match() for richer patterns; never trust user-supplied strings without normalization.' },
        { cmd: 'time.now_ns()', desc: 'Current time in nanoseconds. Use for time-window rules (e.g. business hours, ticket expiry).', warning: 'Time-based rules are evaluator-dependent. In Gatekeeper, time.now_ns() may not reflect the cluster controller\'s clock identically.' },
        { cmd: 'json.unmarshal(input.annotations.policy, parsed)', desc: 'Parse a JSON string into a Rego object. Useful when annotations carry policy metadata.', prodNote: 'Wrap in error handling (`with default {}`) — malformed JSON will fail the rule otherwise.' },
        { cmd: 'crypto.sha256(input.payload)', desc: 'SHA-256 hash. Useful for content-addressable policy keys.', prodNote: 'OPA also has crypto.x509.parse_certificates() for cert chain analysis.' },
      ],
    },
    {
      title: 'OPA CLI (eval, test, run)',
      rows: [
        { cmd: 'opa eval -d policy.rego -i input.json "data.authz.allow"', desc: 'Evaluate a query against a policy file with input data. Primary smoke-test command.', prodNote: 'Add -f pretty for readable output. Use --explain=full to debug rule evaluation.' },
        { cmd: 'opa test -v ./policies', desc: 'Run all unit tests in the directory. Tests live in *_test.rego files alongside policy files.', prodNote: 'Run in CI on every policy change. Failing policy tests should block merges to main.' },
        { cmd: 'opa fmt -w .', desc: 'Format Rego files in place (like gofmt). Run before commit.', prodNote: 'Pair with a pre-commit hook so policies stay formatted across contributors.' },
        { cmd: 'opa run --server policy.rego', desc: 'Run OPA as a long-lived server. Loads policy at startup; serve queries over REST.', prodNote: 'In production, prefer bundles over file mounts so policy can rotate without restarts.' },
        { cmd: 'opa bench -d policy.rego -i input.json "data.authz.allow"', desc: 'Microbenchmark a query. Use to find policies that are too slow for the request path.', prodNote: 'Target sub-millisecond evaluation for inline authz. Slow policies often have an O(N²) iteration that indexing or partial evaluation can fix.' },
      ],
    },
    {
      title: 'Gatekeeper (Kubernetes admission)',
      rows: [
        { cmd: 'kubectl apply -f constraint-template.yaml', desc: 'Install a ConstraintTemplate — defines a constraint kind (e.g. K8sRequiredLabels) backed by Rego.', prodNote: 'ConstraintTemplate goes in cluster-scoped CRD; the Rego is in the spec.targets[].rego field.' },
        { cmd: 'kubectl apply -f constraint.yaml', desc: 'Install a Constraint instance — applies the template to specific resources (kinds, namespaces).', prodNote: 'Use enforcementAction: dryrun first to capture violations without blocking. Promote to deny once clean.' },
        { cmd: 'kubectl get constraints', desc: 'List all active constraints across the cluster.', prodNote: 'Each constraint reports violations in status.violations — perfect for dashboards and alerting.' },
        { cmd: 'kubectl describe constraint <name> | grep -A 10 violations', desc: 'See current violations for a specific constraint.', warning: 'Violations are an audit signal of past bad state. Existing resources don\'t get retro-blocked when you create a constraint.' },
      ],
    },
    {
      title: 'OPA bundles (production policy distribution)',
      rows: [
        { cmd: 'opa build -b ./policies -o bundle.tar.gz', desc: 'Build a bundle from a policy directory. Bundle is a tarball of .rego files plus metadata.', prodNote: 'Sign bundles with cosign so OPA verifies provenance before loading.' },
        { cmd: 'services:\n  policy-bundle:\n    url: https://bundles.example.com', desc: 'OPA config snippet that points at a bundle service. OPA polls for updates and hot-swaps policy.', prodNote: 'Bundle service can be S3, GCS, OCI registry, or a custom HTTP server. OCI registries integrate cleanly with cosign signing.' },
        { cmd: 'opa run --server -c config.yaml', desc: 'Run OPA as a server with bundle config. No file-mount, no restart-to-update.', prodNote: 'Serves /v1/data/<package>/<rule> for policy queries. Configure proper readiness/liveness probes.' },
      ],
    },
    {
      title: 'Testing & CI patterns',
      rows: [
        { cmd: 'test_admin_can_read if {\n  allow with input as {"user":{"role":"admin"}}\n}', desc: 'Rego unit test. Use `with input as ...` to inject test inputs.', prodNote: 'Name tests test_<expectation_in_words> — they read like specifications when failing.' },
        { cmd: 'opa test --coverage --threshold 80 ./policies', desc: 'Enforce policy test coverage threshold. Fails CI if below 80%.', prodNote: 'Combine with --explain=fails to surface why specific tests broke.' },
        { cmd: 'opa eval -d policies -i sample-input.json "data.authz.allow" --partial', desc: 'Partial evaluation — useful for ahead-of-time policy compilation.', prodNote: 'Helps identify rules that are constant given known inputs; can dramatically speed runtime evaluation.' },
      ],
    },
  ];

  misconfigs: MisconfigPair[] = [
    {
      bad: `package authz

allow {
  input.user.role == "admin"
}
# (no default)`,
      good: `package authz

default allow := false

allow if {
  input.user.role == "admin"
}`,
      why: 'Without a default, the rule produces undefined when no path succeeds. Some integrations treat undefined as deny, others as "no decision" passed up the chain. Always set an explicit default so policy behaviour is predictable across contexts.',
    },
    {
      bad: `# Image allowlist
deny[msg] if {
  not contains(input.image, "registry.example.com")
  msg := "untrusted image"
}`,
      good: `# Image allowlist (anchored prefix)
deny[msg] if {
  not startswith(input.image, "registry.example.com/")
  msg := sprintf("image %s is not from a trusted registry", [input.image])
}`,
      why: 'contains() matches the substring anywhere — an attacker registers "registry.example.com.attacker.com/img" and bypasses the check. startswith() with a trailing "/" anchors the match to the registry host; the message also identifies the offending image for fast triage.',
    },
    {
      bad: `# Constraint applied with deny enforcement on day one:
spec:
  enforcementAction: deny
  match:
    kinds:
    - apiGroups: [""]
      kinds: ["Pod"]`,
      good: `# Roll out in dryrun first:
spec:
  enforcementAction: dryrun
  match:
    kinds:
    - apiGroups: [""]
      kinds: ["Pod"]
# Promote to deny only after status.violations is empty.`,
      why: 'Going straight to deny on existing clusters blocks legitimate workloads that pre-date the policy. dryrun captures violations in status.violations without rejecting requests — once you can see (and fix) the gap, promote to deny in a controlled change.',
    },
  ];

  related: RelatedLink[] = [
    { label: 'Cloud Native Security Engineering — Policy as Code module', href: '/courses/cloud-native-security-engineering/policy-as-code-security', description: 'Module: design and ship OPA policy across admission, ingress, and microservice authz.' },
    { label: 'Kubernetes Security Simulator', href: '/games/kubernetes-security-simulator', description: 'Practice spotting RBAC/admission misconfigurations including policy-as-code coverage.' },
    { label: 'OPA glossary entry', href: '/glossary/opa', description: 'Definition and how OPA fits into a cloud-native security architecture.' },
  ];

  constructor() {
    this.seo.update({
      title: 'OPA & Rego Cheatsheet',
      description: 'Production reference for Open Policy Agent and Rego: Rego syntax, Gatekeeper Kubernetes admission, OPA CLI (eval/test/run), bundle distribution, and testing patterns. Free, ad-free.',
      url: '/cheatsheets/opa-rego',
      breadcrumbs: [
        { name: 'Home', url: '/' },
        { name: 'Reference', url: '/cheatsheets' },
        { name: 'OPA & Rego', url: '/cheatsheets/opa-rego' },
      ],
    });
  }
}
