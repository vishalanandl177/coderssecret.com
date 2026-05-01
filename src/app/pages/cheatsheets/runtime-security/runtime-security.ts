import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../../services/seo.service';
import { CheatsheetPageComponent, CheatsheetHeader, CommandGroup, MisconfigPair, RelatedLink } from '../_shared/cheatsheet-page';

@Component({
  selector: 'app-cheatsheet-runtime-security',
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
            <li class="text-foreground font-medium" aria-current="page">Runtime Security</li>
          </ol>
        </nav>

        <app-cheatsheet-page [header]="header" [groups]="groups" [misconfigPairs]="misconfigs" [relatedLinks]="related" />
      </div>
    </section>
  `,
})
export class RuntimeSecurityCheatsheetComponent {
  private seo = inject(SeoService);

  header: CheatsheetHeader = {
    icon: '🚨',
    iconColor: '#dc2626',
    badge: 'Production Reference',
    badgeClass: 'bg-red-500/10 border-red-500/30 text-red-500',
    title: 'Runtime Security Cheatsheet (Falco / eBPF)',
    intro: 'Detection-engineering reference for Linux runtime security. Falco rule syntax, syscall reference, eBPF observability with Tetragon, and the patterns that catch real attacks while keeping noise out of your alert pipeline.',
  };

  groups: CommandGroup[] = [
    {
      title: 'Falco rule structure',
      rows: [
        { cmd: '- macro: container\n  condition: container.id != host', desc: 'Macros are reusable named conditions. Most rules start with `evt.type=execve and container` to scope to container syscalls.', prodNote: 'Falco ships with a comprehensive set of macros in /etc/falco/falco_rules.yaml. Override them in falco_rules.local.yaml — never edit the upstream file.' },
        { cmd: '- list: shell_binaries\n  items: [bash, sh, csh, zsh, ksh]', desc: 'Lists are reusable name sets. Reference with `proc.name in (shell_binaries)`.', prodNote: 'Use lists for image registries, allowed processes, sensitive paths — anything that\'s a finite enumeration.' },
        { cmd: '- rule: Terminal shell in container\n  desc: A shell was used as the entrypoint/exec\n  condition: spawned_process and container and shell_procs and proc.tty != 0\n  output: Shell spawned in %container.name (user=%user.name shell=%proc.name)\n  priority: WARNING', desc: 'A complete Falco rule. Detect signature, message format, and severity.', prodNote: 'Output template uses Sysdig field names (proc.name, container.image.repository, fd.name). The full list lives in `falco --list`.' },
      ],
    },
    {
      title: 'High-signal Falco rules (start here)',
      rows: [
        { cmd: 'rule: Shell in container', desc: 'Detects bash/sh spawn inside a container. Aggressive but very high signal — most apps don\'t spawn shells in production.', prodNote: 'Add an exception list for sidecars/init-containers that legitimately spawn shells (e.g. `kubectl exec` in your toolkit pods).' },
        { cmd: 'rule: Sensitive file read by privileged container', desc: 'Reads of /etc/shadow, /etc/passwd, ~/.ssh/* — classic credential-stealing pattern.', warning: 'Whitelist legit security agents that read these files. False positives here erode trust in the signal.' },
        { cmd: 'rule: Outbound connection to disallowed CIDR', desc: 'Network egress to unexpected destinations — crypto-mining pools, C2 infrastructure.', prodNote: 'Maintain an allowlist of egress destinations (npm, pypi, your registry, your APIs). Anything else triggers.' },
        { cmd: 'rule: Write below /etc by container', desc: 'Most container filesystems are immutable. Writes to /etc are an indicator of in-container persistence attempts.', prodNote: 'Container images that need writable /etc usually have a config-rendering step. Audit and except the legitimate ones.' },
        { cmd: 'rule: Mount /var/run/docker.sock or kubelet socket', desc: 'Mounting the container runtime socket grants the container effective control over the node.', warning: 'Almost always a misconfiguration outside of cluster-management agents. High-priority alert.' },
      ],
    },
    {
      title: 'Falco operations',
      rows: [
        { cmd: 'falco -V', desc: 'Show version + driver. Falco supports kernel-module, eBPF, and modern eBPF (CO-RE) drivers.', prodNote: 'On modern kernels (5.8+), use the modern eBPF driver — no kernel module compilation, works across distros.' },
        { cmd: 'falco --list', desc: 'List all available filtering fields (proc.name, container.image, fd.name, etc).', prodNote: 'Use this to discover what fields your rule outputs can reference.' },
        { cmd: 'falco -c /etc/falco/falco.yaml -r /etc/falco/falco_rules.yaml', desc: 'Run with explicit config and rules. Default behavior loads all *.yaml under /etc/falco/.', prodNote: 'In Kubernetes, deploy as DaemonSet via the Falco Helm chart; mount custom rules as a ConfigMap.' },
        { cmd: 'falco --validate /etc/falco/falco_rules.local.yaml', desc: 'Syntax-check a rules file without loading. Run in CI on every change.', prodNote: 'Most "rules silently not firing" issues are syntax errors that didn\'t surface in CI.' },
        { cmd: 'falcoctl artifact install ghcr.io/falcosecurity/rules/falco-rules:latest', desc: 'Manage rule artifacts via the falcoctl tool. OCI-distributed rule sets.', prodNote: 'Pin rule artifacts to specific versions; rule changes can shift signal volume dramatically.' },
      ],
    },
    {
      title: 'Falco output destinations',
      rows: [
        { cmd: 'json_output: true\nlog_stderr: true', desc: 'Structured JSON to stderr — for ingestion by fluentd/vector/Loki.', prodNote: 'Also enable `time_format_iso_8601: true` for searchable timestamps.' },
        { cmd: 'http_output:\n  enabled: true\n  url: https://falcosidekick.example.com/', desc: 'Send alerts to Falcosidekick, which fans out to Slack, PagerDuty, Elasticsearch, S3, etc.', prodNote: 'Falcosidekick is the standard. Don\'t build your own webhook fan-out.' },
        { cmd: 'priority: emergency, alert, critical, error, warning, notice, informational, debug', desc: 'Falco priority levels. Set per-rule.', prodNote: 'Rule of thumb: critical = page, warning = ticket, notice = audit log only.' },
      ],
    },
    {
      title: 'Tetragon (Cilium\'s eBPF-based policy engine)',
      rows: [
        { cmd: 'kubectl apply -f tetragon-policy.yaml', desc: 'Apply a TracingPolicy CRD. Tetragon enforces it at the kernel level via eBPF.', prodNote: 'Unlike Falco (detection), Tetragon can also block/kill processes in real-time.' },
        { cmd: 'kind: TracingPolicy\nspec:\n  kprobes:\n  - call: "sys_write"\n    selectors:\n      matchPIDs: [...]\n      matchActions: [{action: Sigkill}]', desc: 'Kill any process matching selectors that calls sys_write. The "policy as code" model for runtime enforcement.', warning: 'Action: Sigkill terminates processes — test thoroughly in dev/staging before production.' },
        { cmd: 'tetra getevents -o compact', desc: 'CLI to stream Tetragon events from the agent. Like falco output but at kernel level.', prodNote: 'Combine with grep / jq for ad-hoc investigation. For production, ship to a log pipeline.' },
      ],
    },
    {
      title: 'Linux syscalls (the detection alphabet)',
      rows: [
        { cmd: 'execve', desc: 'Process execution. Foundation of "what ran in my container".', prodNote: 'execve + procfs lookups give you the full process tree, working dir, and environment.' },
        { cmd: 'openat / open', desc: 'File opens. "What was read/written" detection lives here.', prodNote: 'Watch for opens of /etc/shadow, /proc/*/maps, ~/.ssh, /var/run/secrets/kubernetes.io.' },
        { cmd: 'connect', desc: 'Outbound network connections. Egress detection lives here.', prodNote: 'Combined with DNS resolution events, you can map "what process connected where" without sniffing packets.' },
        { cmd: 'ptrace', desc: 'Process introspection. Used by debuggers — and by attackers to inject code or read memory.', warning: 'Legit ptrace users are few (gdb, strace). Almost any other context is suspicious.' },
        { cmd: 'mount', desc: 'Filesystem mount syscalls. Watch for mounting /proc, /sys/fs/cgroup with rw, or the host root.', warning: 'Container escapes often involve manipulating mount namespaces. High-signal syscall.' },
        { cmd: 'setns / unshare / clone(NEWNS)', desc: 'Namespace manipulation. Legitimate uses are rare outside of container runtimes.', warning: 'Inside a workload container, these are red flags — possible namespace breakout attempt.' },
      ],
    },
    {
      title: 'Tuning out noise',
      rows: [
        { cmd: 'exception lists per rule', desc: 'Falco rules support `exceptions` — dimensional allowlists (process, image, command, parent).', prodNote: 'Always tune via exceptions on the existing rule, not by disabling the rule entirely. Document why each exception exists.' },
        { cmd: 'aggregate alerts at the alerting layer, not in Falco', desc: 'Suppression in Falco hides events. Send everything; aggregate/dedupe at the SIEM.', prodNote: 'A weekly review of "top noisy rules" is a healthy ritual.' },
        { cmd: 'rate-limit identical events at egress', desc: 'falcosidekick / fluentd can dedupe identical alerts in a window.', prodNote: 'Without rate limiting, a single bad pod can flood the channel and bury real signals.' },
      ],
    },
  ];

  misconfigs: MisconfigPair[] = [
    {
      bad: `# Disable a noisy rule
- rule: Terminal shell in container
  enabled: false`,
      good: `# Tune the rule with explicit exceptions
- rule: Terminal shell in container
  exceptions:
  - name: cluster-debug-tools
    fields: [container.image.repository]
    values:
    - my-registry/cluster-debug
  - name: certbot-init
    fields: [proc.name, container.image.repository]
    values:
    - [certbot, my-registry/certbot]`,
      why: 'Disabling a rule deletes detection. Exceptions surgically allow known-good cases while keeping the rule firing for everything else. Each exception is documented and reviewable, and reverting a single exception is cheap.',
    },
    {
      bad: `# Forward Falco JSON straight to Slack channel
http_output:
  enabled: true
  url: https://hooks.slack.com/services/...`,
      good: `# Send to falcosidekick, which routes:
http_output:
  enabled: true
  url: http://falcosidekick:2801

# falcosidekick config:
#   slack: critical+warning -> #security-alerts
#   loki: all priorities    -> long-term storage
#   pagerduty: critical only -> on-call`,
      why: 'Direct webhook to Slack means every notice/warning becomes Slack noise; on-call gets paged for non-events. Falcosidekick lets you route by priority and destination — critical to PagerDuty, warning to Slack, everything to Loki for forensic search.',
    },
    {
      bad: `# Run Falco with kernel module driver
falco -k`,
      good: `# Use modern eBPF driver (CO-RE)
falco --modern-bpf`,
      why: 'Kernel module drivers require compilation against the running kernel — every kernel upgrade can break ingestion. Modern eBPF (CO-RE) compiles once and runs on any kernel ≥5.8, eliminating an entire class of "Falco isn\'t collecting events after node upgrade" outages.',
    },
  ];

  related: RelatedLink[] = [
    { label: 'Kubernetes Runtime Security course', href: '/courses/kubernetes-runtime-security', description: 'Deep dive on Falco, Tetragon, and eBPF for Kubernetes runtime security.' },
    { label: 'Cloud Native Security Engineering — Runtime module', href: '/courses/cloud-native-security-engineering/runtime-security-threat-detection', description: 'Module: detection engineering, signal-to-noise tuning, and alert routing.' },
    { label: 'Falco glossary entry', href: '/glossary/falco', description: 'What Falco is and where it fits in a cloud-native security architecture.' },
  ];

  constructor() {
    this.seo.update({
      title: 'Runtime Security Cheatsheet (Falco / eBPF)',
      description: 'Production reference for Linux runtime security: Falco rule syntax, high-signal detection rules, eBPF observability with Tetragon, syscall reference, and detection-engineering tuning patterns. Free, ad-free.',
      url: '/cheatsheets/runtime-security',
      breadcrumbs: [
        { name: 'Home', url: '/' },
        { name: 'Reference', url: '/cheatsheets' },
        { name: 'Runtime Security', url: '/cheatsheets/runtime-security' },
      ],
    });
  }
}
