import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../../services/seo.service';
import { CheatsheetPageComponent, CheatsheetHeader, CommandGroup, MisconfigPair, RelatedLink } from '../_shared/cheatsheet-page';

@Component({
  selector: 'app-cheatsheet-spiffe-spire',
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
            <li class="text-foreground font-medium" aria-current="page">SPIFFE & SPIRE</li>
          </ol>
        </nav>

        <app-cheatsheet-page [header]="header" [groups]="groups" [misconfigPairs]="misconfigs" [relatedLinks]="related" />
      </div>
    </section>
  `,
})
export class SpiffeSpireCheatsheetComponent {
  private seo = inject(SeoService);

  header: CheatsheetHeader = {
    icon: '🔐',
    iconColor: '#06b6d4',
    badge: 'Production Reference',
    badgeClass: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-500',
    title: 'SPIFFE & SPIRE Cheatsheet',
    intro: 'Operational reference for SPIFFE workload identity and SPIRE deployment. SPIFFE IDs, SVID issuance, registration entries, attestor selectors, federation, and the diagnostic commands you reach for when a workload is not getting its identity.',
  };

  groups: CommandGroup[] = [
    {
      title: 'SPIFFE ID structure',
      rows: [
        { cmd: 'spiffe://<trust-domain>/<path>', desc: 'Canonical SPIFFE ID format. Trust domain is your organisation; path identifies the workload.', prodNote: 'Use a hierarchical path that mirrors deployment scope: /ns/<namespace>/sa/<service-account> on Kubernetes.' },
        { cmd: 'spiffe://corp.example.com/ns/payments/sa/payments-api', desc: 'Production-style SPIFFE ID. Encodes cluster, namespace, and service account in the path so authz can prefix-match.', prodNote: 'Pick the trust domain once; changing it later requires re-issuing every SVID across the fleet.' },
        { cmd: 'X.509 SVID', desc: 'X.509 certificate whose URI SAN is the SPIFFE ID. Used for mTLS handshakes.', prodNote: 'Default TTL in SPIRE is 1 hour with rotation at half-life. Tune via -ttl on the registration entry.' },
        { cmd: 'JWT SVID', desc: 'Signed JWT with the SPIFFE ID in the `sub` claim. For HTTP/gRPC services that cannot terminate TLS themselves.', warning: 'JWT SVIDs are bearer tokens — anyone who steals them can impersonate the workload until they expire. Prefer X.509 mTLS where possible.' },
      ],
    },
    {
      title: 'SPIRE Server: cluster bootstrap',
      rows: [
        { cmd: 'spire-server run -config server.conf', desc: 'Start the SPIRE Server with the given config file. Server holds the trust domain CA and issues SVIDs.', prodNote: 'Run as a StatefulSet on Kubernetes with persistent storage for the datastore. HA needs an external SQL backend.' },
        { cmd: 'spire-server token generate -spiffeID spiffe://corp.example.com/spire/agent/<id>', desc: 'Generate a one-time join token to bootstrap a SPIRE Agent. Use only when no native attestation method is available.', warning: 'Join tokens are bearer secrets. Prefer node-level attestation (k8s_psat, aws_iid, gcp_iit, k8s_sat) in production.' },
        { cmd: 'spire-server bundle show', desc: 'Print the trust bundle (CA chain) for this trust domain. Federate it to peer trust domains.', prodNote: 'Combine with the Bundle Endpoint protocol (`-format pem` for static seeding).' },
        { cmd: 'spire-server healthcheck', desc: 'Liveness probe. Exits 0 when the server is ready to serve.', prodNote: 'Wire into Kubernetes liveness/readiness probes. Combine with prometheus_metrics for SLOs.' },
      ],
    },
    {
      title: 'SPIRE Agent: workload attestation',
      rows: [
        { cmd: 'spire-agent run -config agent.conf', desc: 'Start the SPIRE Agent on a node. Attests workloads via local OS or Kubernetes signals and proxies the Workload API.', prodNote: 'Deploy as a DaemonSet; mount /run/spire/agent.sock as the Workload API endpoint for pods.' },
        { cmd: 'spire-agent api fetch x509', desc: 'Fetch the current X.509 SVID for the workload calling the Workload API. Used for diagnostics.', prodNote: 'In code, use the go-spiffe SDK (workloadapi.NewX509Source) so rotation is automatic.' },
        { cmd: 'spire-agent api fetch jwt -audience https://api.example.com', desc: 'Mint a JWT SVID with the given audience. Audience is the receiving service URL.', warning: 'Always validate `aud` on the receiving end — a JWT minted for service A must not be accepted by service B.' },
        { cmd: 'spire-agent healthcheck', desc: 'Verify the agent has registered with the server and is serving the Workload API.', prodNote: 'If agent healthcheck passes but workloads cannot fetch SVIDs, the registration entries are missing or the selectors do not match.' },
      ],
    },
    {
      title: 'Registration entries (workload identity assignment)',
      rows: [
        { cmd: 'spire-server entry create -spiffeID <id> -parentID <parent> -selector <key:val>', desc: 'Create a registration entry. The agent issues the SVID to any workload that matches all selectors AND descends from the parent.', prodNote: 'Combine multiple selectors (k8s:ns + k8s:sa + k8s:image-id) so identity binds to the specific deployment, not just the namespace.' },
        { cmd: 'spire-server entry list', desc: 'Show all registration entries on this server. Pipe through grep to find the entry for a specific SPIFFE ID.', prodNote: 'In production, manage entries declaratively with the SPIRE Controller Manager (CRDs ClusterSPIFFEID + ClusterFederatedTrustDomain) instead of imperative CLI.' },
        { cmd: 'spire-server entry update -entryID <id> -ttl 600', desc: 'Update an existing entry. -ttl sets SVID validity in seconds (default 3600).', prodNote: 'Shorter TTLs reduce blast radius of leaked SVIDs but increase load on SPIRE Server. 600–3600s is typical for production.' },
        { cmd: 'spire-server entry delete -entryID <id>', desc: 'Delete a registration entry. Workload loses identity at next refresh.', warning: 'Plan deletes carefully — services using the SVID will fail TLS handshakes within minutes.' },
      ],
    },
    {
      title: 'Attestor selectors (Kubernetes Workload Attestor)',
      rows: [
        { cmd: 'k8s:ns:<namespace>', desc: 'Match pods in a specific Kubernetes namespace.', warning: 'Single-selector entries on namespace alone match every pod in the namespace — a misplaced pod gets the SVID.' },
        { cmd: 'k8s:sa:<service-account>', desc: 'Match pods running under a specific ServiceAccount.', prodNote: 'Combine with k8s:ns: for tenant + role scoping.' },
        { cmd: 'k8s:pod-label:<key>:<value>', desc: 'Match pods with a specific label.', prodNote: 'Use for "app=payments-api" style identity binding when ServiceAccounts are shared.' },
        { cmd: 'k8s:container-image:<image>', desc: 'Match pods running a specific container image (by digest).', prodNote: 'Strongest selector — binds identity to the exact image hash. Combine with k8s:ns: and k8s:sa: for defence in depth.' },
        { cmd: 'unix:uid:<uid>  /  unix:path:<path>', desc: 'Unix Workload Attestor selectors. Match the calling process by UID, path, or SHA256.', prodNote: 'Use for VM / non-Kubernetes workloads. unix:sha256:<digest> binds identity to the specific binary.' },
      ],
    },
    {
      title: 'Federation (cross trust domain)',
      rows: [
        { cmd: 'spire-server federation create -trustDomain peer.example.com -bundleEndpointURL https://peer.example.com:8443 -bundleEndpointProfile https_web', desc: 'Federate with another trust domain. SPIRE will fetch the peer\'s trust bundle dynamically over the bundle endpoint.', prodNote: 'https_web uses public CA validation for the bundle endpoint (simplest). https_spiffe uses a SPIFFE ID for endpoint authentication (most secure).' },
        { cmd: 'spire-server federation list', desc: 'Show configured federation relationships.', prodNote: 'Workloads can authenticate peers in any federated trust domain — combine with authz policy that allowlists the peer SPIFFE IDs you trust.' },
        { cmd: 'spire-server bundle set -id spiffe://peer.example.com -path peer-bundle.pem', desc: 'Static seed of a peer trust bundle. One-time bootstrap before bundle endpoint takes over.', warning: 'Static bundles go stale. Always pair with bundle endpoint for ongoing rotation.' },
      ],
    },
    {
      title: 'Diagnostics ("my workload cannot get an SVID")',
      rows: [
        { cmd: 'spire-server entry show -spiffeID spiffe://corp.example.com/ns/payments/sa/payments-api', desc: 'Confirm the registration entry exists with the expected selectors.', prodNote: 'If empty: the entry was never created (most common cause).' },
        { cmd: 'kubectl logs -n spire spire-agent-xxx | grep "Workload"', desc: 'Tail the SPIRE Agent on the node where the workload is running. Look for "Workload not registered" or selector-mismatch messages.', prodNote: 'Run on the right node — DaemonSet means there is one agent per node.' },
        { cmd: 'spire-agent api fetch x509 -socketPath /run/spire/agent.sock', desc: 'From inside the workload pod (or via kubectl exec), call the Workload API directly to see what (if anything) the agent issues.', prodNote: 'If empty here but entry exists: selectors do not match. Compare actual pod labels/SA to what the entry expects.' },
        { cmd: 'spire-server entry list -selector k8s:ns:payments', desc: 'List all entries scoped to a namespace. Useful when entries were created with overly broad selectors.', warning: 'If an entry matches more workloads than intended, every match gets the same SVID — review selectors carefully.' },
      ],
    },
  ];

  misconfigs: MisconfigPair[] = [
    {
      bad: `spire-server entry create \\
  -spiffeID spiffe://example.com/payments-api \\
  -selector k8s:ns:payments`,
      good: `spire-server entry create \\
  -spiffeID spiffe://example.com/ns/payments/sa/payments-api \\
  -selector k8s:ns:payments \\
  -selector k8s:sa:payments-api \\
  -selector k8s:container-image:registry/payments-api@sha256:abc...`,
      why: 'A single namespace selector matches every pod in the namespace. Combining ns + ServiceAccount + image-digest binds identity to the specific deployment, so a misplaced or compromised pod cannot acquire an unintended SVID.',
    },
    {
      bad: `// Read SVID once at startup, never refresh:
src, _ := workloadapi.NewX509Source(ctx)
cert := src.GetX509SVID()
tlsConfig := &tls.Config{
  Certificates: []tls.Certificate{cert.Certificate()},
}`,
      good: `// Use the live source for every handshake:
src, _ := workloadapi.NewX509Source(ctx)
tlsConfig := tlsconfig.MTLSServerConfig(src, src,
  tlsconfig.AuthorizeAny())`,
      why: 'GetX509SVID() returns a snapshot; the tlsconfig helpers install GetCertificate / GetClientCertificate callbacks that read from the live source on each handshake. Without that, SVID rotation has no effect — the server keeps presenting the cert it captured at startup.',
    },
    {
      bad: `// Static bundle seed only:
spire-server bundle set \\
  -id spiffe://us-west.example.com \\
  -path us-west-bundle-2024-Q3.pem
# (re-applied manually every quarter)`,
      good: `spire-server federation create \\
  -trustDomain us-west.example.com \\
  -bundleEndpointURL https://spire.us-west.example.com:8443 \\
  -bundleEndpointProfile https_spiffe \\
  -endpointSpiffeID spiffe://us-west.example.com/spire/server`,
      why: 'Static bundle copies go stale on rotation. The bundle endpoint protocol fetches the federated trust bundle dynamically (default every 5 minutes), so a CA rotation propagates within minutes — no manual ops, no 3am incident when the upstream CA rolls.',
    },
  ];

  related: RelatedLink[] = [
    { label: 'Mastering SPIFFE & SPIRE course', href: '/courses/mastering-spiffe-spire', description: 'Free 13-module curriculum that takes you from "what is workload identity" to running a federated SPIRE deployment.' },
    { label: 'Zero Trust Network Builder simulator', href: '/games/zero-trust-network-builder', description: 'Interactive SPIFFE/SPIRE design challenges — six production scenarios, four-choice format.' },
    { label: 'Run SPIRE on Kubernetes', href: '/courses/mastering-spiffe-spire/running-spire-on-kubernetes', description: 'Module: deploy SPIRE Server + Agent on Kubernetes from scratch.' },
    { label: 'Working with SVIDs (Workload API)', href: '/courses/mastering-spiffe-spire/working-with-svids-workload-api', description: 'Module: SVID issuance, rotation, and the SDK patterns that survive production.' },
  ];

  constructor() {
    this.seo.update({
      title: 'SPIFFE & SPIRE Cheatsheet',
      description: 'Production reference for SPIFFE workload identity and SPIRE: SPIFFE IDs, X.509/JWT SVIDs, registration entries, Kubernetes attestor selectors, federation bundle endpoints, and diagnostic commands. Free, ad-free.',
      url: '/cheatsheets/spiffe-spire',
      breadcrumbs: [
        { name: 'Home', url: '/' },
        { name: 'Reference', url: '/cheatsheets' },
        { name: 'SPIFFE & SPIRE', url: '/cheatsheets/spiffe-spire' },
      ],
    });
  }
}
