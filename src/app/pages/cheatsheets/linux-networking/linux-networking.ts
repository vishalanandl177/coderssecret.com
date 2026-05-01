import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../../services/seo.service';
import { CheatsheetPageComponent, CheatsheetHeader, CommandGroup, MisconfigPair, RelatedLink } from '../_shared/cheatsheet-page';

@Component({
  selector: 'app-cheatsheet-linux-networking',
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
            <li class="text-foreground font-medium" aria-current="page">Linux Networking</li>
          </ol>
        </nav>

        <app-cheatsheet-page [header]="header" [groups]="groups" [misconfigPairs]="misconfigs" [relatedLinks]="related" />
      </div>
    </section>
  `,
})
export class LinuxNetworkingCheatsheetComponent {
  private seo = inject(SeoService);

  header: CheatsheetHeader = {
    icon: '🌐',
    iconColor: '#22c55e',
    badge: 'Production Reference',
    badgeClass: 'bg-green-500/10 border-green-500/30 text-green-500',
    title: 'Linux Networking Cheatsheet',
    intro: 'Operational reference for the Linux networking toolkit. Sockets, routes, firewalls (iptables/nftables), packet capture (tcpdump), TLS debugging (openssl), and the eBPF-era diagnostics for the moments a connection just will not establish.',
  };

  groups: CommandGroup[] = [
    {
      title: 'Inspecting interfaces, addresses, routes',
      rows: [
        { cmd: 'ip a  /  ip addr show', desc: 'Show all interfaces and their addresses. Modern replacement for ifconfig.', prodNote: 'On Kubernetes nodes, look for veth* (pod), cni0/flannel.1 (CNI), eth0 (host).' },
        { cmd: 'ip r  /  ip route show', desc: 'Show the kernel routing table.', prodNote: 'On a misbehaving pod, compare to a healthy pod\'s routes — CNI mistakes often show up here.' },
        { cmd: 'ip -s link show <iface>', desc: 'Per-interface byte/packet counters and error stats.', prodNote: 'Drops climbing on an interface = MTU mismatch, NIC saturation, or buffer issue.' },
        { cmd: 'ip neigh  /  ip n', desc: 'ARP / neighbor table. Stale entries cause "destination unreachable" symptoms.', prodNote: 'Force refresh with `ip neigh flush all` if you suspect ARP poisoning or stale entries after a node move.' },
        { cmd: 'ip netns list', desc: 'List network namespaces. Each Kubernetes pod runs in its own.', prodNote: 'Enter a pod\'s netns from the node: `nsenter -t <PID> -n <command>`.' },
      ],
    },
    {
      title: 'Sockets and listening ports',
      rows: [
        { cmd: 'ss -tlnp', desc: 'TCP listening sockets with the owning process. -t TCP, -l listening, -n numeric, -p process.', prodNote: 'Modern replacement for `netstat -tlnp`. Faster and shows more detail.' },
        { cmd: 'ss -tunap', desc: 'All TCP+UDP sockets including established connections.', prodNote: 'Look at Recv-Q / Send-Q columns to spot backlog.' },
        { cmd: 'ss -t state established \'( dport = :443 )\'', desc: 'Filter sockets by state and port. Useful when investigating TLS connection counts.', prodNote: 'ss filters are more powerful than grep — fewer false positives in port-number matches.' },
        { cmd: 'lsof -i :443', desc: 'Which process is listening on a port. Falls back when ss output is overwhelming.', prodNote: 'Pair with `lsof -p <pid>` to see all of a process\'s open files and sockets.' },
      ],
    },
    {
      title: 'Connectivity testing',
      rows: [
        { cmd: 'curl -v https://example.com', desc: 'Verbose HTTPS request. Shows DNS, connect, TLS handshake, request, response.', prodNote: 'Add --resolve example.com:443:1.2.3.4 to bypass DNS for testing a specific origin.' },
        { cmd: 'curl --connect-timeout 5 -o /dev/null -s -w "%{http_code} %{time_total}\\n" URL', desc: 'Latency and status without body. Loop with watch for SLO-style probing.', prodNote: 'Combine with `-o /dev/null --write-out "%{ssl_verify_result} %{remote_ip} %{time_namelookup} %{time_connect} %{time_starttransfer}"` for full timing breakdown.' },
        { cmd: 'nc -zv host port  /  ncat -zv host port', desc: 'TCP connect test. -z just probes, -v reports outcome.', prodNote: 'Use to differentiate "DNS works but port is blocked" from "DNS is broken".' },
        { cmd: 'mtr -rwn host  (or  traceroute -T -p 443 host)', desc: 'Path-by-path latency and loss. -T uses TCP (passes most firewalls vs ICMP).', prodNote: 'Run from both endpoints — asymmetric paths and loss show up immediately.' },
        { cmd: 'dig +trace example.com  /  dig @8.8.8.8 example.com', desc: 'DNS resolution path. +trace walks from root to authoritative.', prodNote: '`dig +short TXT _dmarc.example.com` for DMARC, etc. Always specify the resolver in incident debugging.' },
      ],
    },
    {
      title: 'Packet capture and analysis (tcpdump)',
      rows: [
        { cmd: 'tcpdump -i any -nn -s0 -w cap.pcap port 443', desc: 'Capture full-length packets on any interface. -nn suppresses name resolution; -s0 grabs full packet (essential for TLS analysis).', warning: 'Captures contain plaintext for non-TLS traffic. Treat capture files as sensitive — store on encrypted volumes, scrub before sharing.' },
        { cmd: 'tcpdump -i eth0 -nn host 1.2.3.4 and port 443', desc: 'Filter by host and port. tcpdump\'s BPF filter language is concise.', prodNote: 'Common filters: `tcp[tcpflags] & (tcp-syn|tcp-fin) != 0` (connection setup/teardown), `not port 22` (skip SSH noise).' },
        { cmd: 'tcpdump -i any -A -nn port 80', desc: 'ASCII dump of packets — readable for plaintext HTTP debugging.', warning: 'Body content is in capture; never run on a production interface carrying customer data without explicit authorization.' },
        { cmd: 'tshark -i any -Y "http.response.code >= 500" -T fields -e ip.src -e http.host', desc: 'CLI Wireshark with display filter. Grep-like for packet streams.', prodNote: 'tshark is great in CI / scripts. For interactive analysis, capture with tcpdump and open the pcap in Wireshark GUI.' },
      ],
    },
    {
      title: 'TLS debugging (openssl)',
      rows: [
        { cmd: 'openssl s_client -connect example.com:443 -servername example.com', desc: 'Open a TLS session and dump the cert chain. -servername sends SNI (required for most modern hosts).', prodNote: 'Add -showcerts to print the entire chain in PEM. Pipe to `openssl x509 -text -noout` to inspect each cert.' },
        { cmd: 'openssl x509 -in cert.pem -noout -dates -subject -issuer', desc: 'Parse a certificate file. Check expiry, subject, issuer in one line.', prodNote: 'Add `-ext subjectAltName` to see SANs — vital for debugging "cert valid for X but I requested Y" errors.' },
        { cmd: 'openssl verify -CAfile chain.pem cert.pem', desc: 'Verify a cert against a CA bundle.', prodNote: 'When a system trust store complains, use this to isolate "is the cert + chain self-consistent" from "does this OS trust the issuing CA".' },
        { cmd: 'curl --cacert chain.pem -v https://example.com', desc: 'Test with a custom CA bundle without modifying system stores.', prodNote: 'Quick way to validate an internal CA before deploying it to nodes / containers.' },
        { cmd: 'openssl s_client -connect host:443 -tls1_2  /  -tls1_3', desc: 'Force a specific TLS version. Useful for negotiating with legacy peers.', warning: 'TLS 1.0 and 1.1 are deprecated and should be disabled in production. Use this only for debugging legacy systems.' },
      ],
    },
    {
      title: 'Firewall: iptables / nftables',
      rows: [
        { cmd: 'iptables -L -n -v --line-numbers', desc: 'List all chains with packet counters and line numbers. Counters help identify which rules are actually being hit.', prodNote: 'On modern distros, prefer nftables (`nft list ruleset`). iptables-nft preserves the iptables CLI on top of nftables.' },
        { cmd: 'iptables -t nat -L -n', desc: 'NAT table — DNAT/SNAT rules. Critical for understanding Kubernetes service routing.', prodNote: 'On Kubernetes nodes, `iptables -t nat -L KUBE-SERVICES -n` shows how kube-proxy maps Service IPs to pod IPs.' },
        { cmd: 'iptables -A INPUT -p tcp --dport 22 -j DROP', desc: 'Drop incoming SSH. Example of an explicit firewall rule.', warning: 'Modifying iptables on a remote host can lock you out. Always test with `at` to schedule a rollback if connection is lost.' },
        { cmd: 'nft list ruleset', desc: 'nftables — the modern Linux firewall framework.', prodNote: 'nftables uses sets and maps for efficient rule matching at scale; iptables degrades linearly above a few hundred rules.' },
        { cmd: 'iptables-save  /  iptables-restore', desc: 'Backup and restore the rule set. Always run iptables-save before making changes.', prodNote: 'Persist rules with iptables-persistent (Debian/Ubuntu) or netfilter-persistent so they survive reboots.' },
      ],
    },
    {
      title: 'eBPF-era observability',
      rows: [
        { cmd: 'ss --tcp-info', desc: 'Per-connection TCP stats: RTT, retransmits, congestion window. eBPF-backed in modern kernels.', prodNote: 'Spotting elevated retransmits or low cwnd points to packet loss or path MTU issues.' },
        { cmd: 'bpftrace -e \'kprobe:tcp_sendmsg { @[comm] = count(); }\'', desc: 'eBPF one-liner: count tcp_sendmsg calls per process. The "what is sending traffic" question, answered without restarting.', prodNote: 'bpftool, BCC, and bpftrace are the modern observability stack — minimal overhead, no kernel modules.' },
        { cmd: 'tcpdrop  (BCC tool)', desc: 'Trace why TCP packets are being dropped at the kernel level. Essential when retransmits climb without a clear cause.', prodNote: 'Part of the bcc-tools package. The whole bcc/ suite is gold for production debugging.' },
        { cmd: 'cilium hubble observe', desc: 'Cilium\'s eBPF-based flow visibility — pod-to-pod traffic with policy decisions.', prodNote: 'In Cilium-managed clusters, this replaces tcpdump for east-west traffic analysis.' },
      ],
    },
  ];

  misconfigs: MisconfigPair[] = [
    {
      bad: `# Use ICMP ping for connectivity test
ping -c 3 example.com`,
      good: `# TCP probe at the actual port
curl --connect-timeout 5 -o /dev/null -s -w "%{http_code}\\n" https://example.com
# or
nc -zv example.com 443`,
      why: 'ICMP is blocked by many firewalls and load balancers — a failing ping doesn\'t mean the service is down. Always probe the protocol your application uses, on the actual port.',
    },
    {
      bad: `# Capture only header (truncated)
tcpdump -i any -s 100 host 1.2.3.4`,
      good: `# Capture full packets
tcpdump -i any -s 0 -w trace.pcap host 1.2.3.4
# (-s 0 means full packet length;
#  open in Wireshark for analysis)`,
      why: '-s 100 captures only 100 bytes per packet — enough for the TCP header but not the application payload. TLS handshakes, HTTP bodies, and DNS responses get truncated. Almost never what you want.',
    },
    {
      bad: `# Test cert expiry by visiting in browser
firefox https://api.example.com`,
      good: `# Scriptable cert expiry check
echo | openssl s_client -connect api.example.com:443 -servername api.example.com 2>/dev/null \\
  | openssl x509 -noout -enddate
# notAfter=Jul 15 23:59:59 2025 GMT`,
      why: 'Browsers cache certs and may show stale data. The openssl s_client one-liner gives you the actual cert the server presents right now — the canonical answer for "when does this cert expire" and the right primitive for monitoring scripts.',
    },
  ];

  related: RelatedLink[] = [
    { label: 'Cloud Native Security Engineering', href: '/courses/cloud-native-security-engineering', description: 'Free 16-module course covering networking-aware security from PodSecurity to service mesh.' },
    { label: 'Service Mesh Security module', href: '/courses/cloud-native-security-engineering/service-mesh-security', description: 'How Linux networking primitives compose into a service-mesh data plane.' },
    { label: 'Kubernetes Security Cheatsheet', href: '/cheatsheets/kubernetes-security', description: 'NetworkPolicy patterns for the cluster-scoped equivalent of a firewall.' },
  ];

  constructor() {
    this.seo.update({
      title: 'Linux Networking Cheatsheet',
      description: 'Production reference for Linux networking: ip / ss / lsof, tcpdump, openssl s_client, iptables/nftables, eBPF observability with bpftrace and Hubble. Free, ad-free.',
      url: '/cheatsheets/linux-networking',
      breadcrumbs: [
        { name: 'Home', url: '/' },
        { name: 'Reference', url: '/cheatsheets' },
        { name: 'Linux Networking', url: '/cheatsheets/linux-networking' },
      ],
    });
  }
}
