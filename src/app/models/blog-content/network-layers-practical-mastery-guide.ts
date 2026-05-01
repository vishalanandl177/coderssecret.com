export const CONTENT = `
      <p>Every tutorial on network layers starts with a boring table: "Layer 7 is Application, Layer 6 is Presentation..." and you forget it by next week. This guide is different. We'll learn each layer by <strong>doing</strong> — capturing packets, debugging real problems, and understanding what happens byte-by-byte when you type <code>curl https://api.example.com</code>.</p>

      <h2>The Practical Model: TCP/IP (Not OSI)</h2>
      <p>The OSI model has 7 layers but the real internet uses the <strong>TCP/IP model</strong> with 4 layers. Every packet you've ever sent uses TCP/IP, not OSI. Let's focus on what actually matters:</p>

      <!-- TCP/IP vs OSI -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">TCP/IP Model (What the Internet Actually Uses)</div>
        <div class="layer-diagram">
          <div class="layer-item" style="background:#ef4444">Layer 4: Application<span class="layer-item-sub">HTTP, HTTPS, DNS, gRPC, SMTP, SSH, WebSocket — what your code talks to</span></div>
          <div class="layer-item" style="background:#f97316">Layer 3: Transport<span class="layer-item-sub">TCP (reliable, ordered) or UDP (fast, fire-and-forget) — how data is delivered</span></div>
          <div class="layer-item" style="background:#3b82f6">Layer 2: Internet (Network)<span class="layer-item-sub">IP addresses, routing, packets crossing networks — where data goes</span></div>
          <div class="layer-item" style="background:#22c55e">Layer 1: Network Access (Link + Physical)<span class="layer-item-sub">Ethernet, WiFi, MAC addresses, physical cables — the actual wire/radio</span></div>
        </div>
      </div>

      <h2>What Happens When You curl a URL?</h2>
      <p>Let's trace a real request through every layer. This is the single most useful mental model for networking:</p>

      <!-- Full Request Flow -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">Anatomy of: curl https://api.example.com/users</div>
        <div class="seq-diagram">
          <div class="seq-actors">
            <div class="seq-actor browser">Your Machine<span class="seq-actor-sub">(curl)</span></div>
            <div class="seq-actor idp">Network<span class="seq-actor-sub">(Internet)</span></div>
            <div class="seq-actor sp">Server<span class="seq-actor-sub">(api.example.com)</span></div>
          </div>
          <div class="seq-steps">
            <div class="seq-step">
              <div class="seq-arrow right" style="--arrow-color:#ef4444"><span class="seq-num" style="background:#ef4444">1</span> DNS: Resolve api.example.com &#x2192; 93.184.216.34</div>
            </div>
            <div class="seq-step">
              <div class="seq-arrow full-right" style="--arrow-color:#f97316"><span class="seq-num" style="background:#f97316">2</span> TCP: 3-way handshake (SYN &#x2192; SYN-ACK &#x2192; ACK)</div>
            </div>
            <div class="seq-step">
              <div class="seq-arrow full-right" style="--arrow-color:#7c3aed"><span class="seq-num purple">3</span> TLS: Handshake (certs, key exchange, cipher suite)</div>
            </div>
            <div class="seq-step">
              <div class="seq-arrow full-right" style="--arrow-color:#ef4444"><span class="seq-num" style="background:#ef4444">4</span> HTTP: GET /users (encrypted inside TLS)</div>
            </div>
            <div class="seq-step">
              <div class="seq-arrow full-left" style="--arrow-color:#22c55e"><span class="seq-num green">5</span> HTTP: 200 OK + JSON body (encrypted)</div>
            </div>
            <div class="seq-step">
              <div class="seq-arrow full-right" style="--arrow-color:#f97316"><span class="seq-num" style="background:#f97316">6</span> TCP: FIN &#x2192; ACK (connection close)</div>
            </div>
          </div>
        </div>
      </div>

      <pre><code># See it yourself! Use curl with verbose output:
curl -v https://api.example.com/users 2>&1

# Output breakdown:
# * Trying 93.184.216.34:443...              ← Layer 2: IP resolution
# * Connected to api.example.com             ← Layer 3: TCP connection
# * SSL connection using TLSv1.3             ← Layer 4: TLS handshake
# > GET /users HTTP/2                        ← Layer 4: HTTP request
# < HTTP/2 200                               ← Layer 4: HTTP response</code></pre>

      <h2>Layer 1: Network Access (The Physical Wire)</h2>
      <p>This is the only layer you can physically touch. It handles getting bits from one device to the next device on the <strong>same local network</strong>.</p>

      <h2>Real-World: Ethernet &amp; MAC Addresses</h2>
      <pre><code># See your network interfaces and MAC addresses
ip link show          # Linux
ifconfig              # macOS
ipconfig /all         # Windows

# Example output:
# eth0: 00:1A:2B:3C:4D:5E  ← 48-bit MAC address (hardware address)
# wlan0: AA:BB:CC:DD:EE:FF  ← WiFi adapter MAC

# See which MAC addresses your machine has talked to recently (ARP table)
arp -a
# ? (192.168.1.1) at 00:11:22:33:44:55 on en0  ← Your router's MAC
# ? (192.168.1.42) at AA:BB:CC:DD:EE:FF on en0  ← Another device

# ARP (Address Resolution Protocol) maps IP &#x2192; MAC
# "Who has 192.168.1.1? Tell 192.168.1.100"
# "192.168.1.1 is at 00:11:22:33:44:55"</code></pre>

      <p><strong>When you'll debug this layer:</strong></p>
      <ul>
        <li>"My server can't reach the database on the same subnet" &#x2192; Check if ARP resolution works</li>
        <li>"Network is slow on this machine" &#x2192; Check for duplex mismatch, cable issues</li>
        <li>"VMs can't talk to each other" &#x2192; Check virtual switch / bridge configuration</li>
      </ul>

      <h2>Layer 2: Internet Layer (IP — Getting Packets Across Networks)</h2>
      <p>Layer 1 handles the local network. Layer 2 (IP) handles getting packets from <strong>your network to any other network in the world</strong> via routing.</p>

      <h2>Real-World: IP Addresses &amp; Routing</h2>
      <pre><code># See your IP addresses
ip addr show          # Linux
ifconfig              # macOS
ipconfig              # Windows

# Public vs Private IPs:
# Private (local network only):
#   10.0.0.0/8        ← Large enterprise networks
#   172.16.0.0/12     ← Medium networks
#   192.168.0.0/16    ← Home/small office (your WiFi is probably here)
# Public (internet-routable):
#   Everything else (e.g., 93.184.216.34)

# What's my public IP?
curl -s https://ifconfig.me
# Output: 203.0.113.42

# Trace the route from your machine to Google's servers
traceroute google.com    # macOS/Linux
tracert google.com       # Windows

# Output:
#  1  192.168.1.1      0.5ms   ← Your home router
#  2  10.0.0.1         2.1ms   ← ISP's first router
#  3  72.14.209.81     5.3ms   ← ISP backbone
#  4  108.170.252.1    8.7ms   ← Google's edge
#  5  142.250.80.46   10.2ms   ← Google's server
# Each hop is a router making a forwarding decision based on the destination IP

# See your machine's routing table
ip route show         # Linux
netstat -rn           # macOS
route print           # Windows

# Key routes:
# default via 192.168.1.1    ← Everything goes to router (gateway)
# 192.168.1.0/24 dev eth0    ← Local network (no routing needed)
# 10.0.0.0/8 via 10.0.0.1   ← VPN or internal network route</code></pre>

      <!-- Routing Diagram -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">How IP Routing Works</div>
        <div class="pipeline">
          <div class="pipeline-step" style="background:#3b82f6;--i:0"><span class="pipeline-step-icon">&#x1F4BB;</span>Your PC<span class="pipeline-step-sub">192.168.1.100</span></div>
          <div class="pipeline-arrow">&#x2192;</div>
          <div class="pipeline-step" style="background:#7c3aed;--i:1"><span class="pipeline-step-icon">&#x1F4F6;</span>Router<span class="pipeline-step-sub">192.168.1.1</span></div>
          <div class="pipeline-arrow">&#x2192;</div>
          <div class="pipeline-step" style="background:#f97316;--i:2"><span class="pipeline-step-icon">&#x1F30D;</span>ISP<span class="pipeline-step-sub">Multiple hops</span></div>
          <div class="pipeline-arrow">&#x2192;</div>
          <div class="pipeline-step" style="background:#ef4444;--i:3"><span class="pipeline-step-icon">&#x1F310;</span>Internet<span class="pipeline-step-sub">BGP routing</span></div>
          <div class="pipeline-arrow">&#x2192;</div>
          <div class="pipeline-step" style="background:#22c55e;--i:4"><span class="pipeline-step-icon">&#x1F5A5;</span>Server<span class="pipeline-step-sub">93.184.216.34</span></div>
        </div>
      </div>

      <p><strong>When you'll debug this layer:</strong></p>
      <ul>
        <li>"Can't reach external services" &#x2192; Check default route, DNS resolution</li>
        <li>"High latency to a specific service" &#x2192; <code>traceroute</code> to find which hop is slow</li>
        <li>"Packets getting dropped" &#x2192; <code>ping</code> with different sizes, check MTU</li>
        <li>"VPN connected but can't reach internal services" &#x2192; Check route table conflicts</li>
      </ul>

      <h2>Layer 3: Transport (TCP &amp; UDP — How Data Gets Delivered)</h2>
      <p>IP gets packets to the right machine. Transport protocols get data to the right <strong>application</strong> on that machine, using <strong>ports</strong>.</p>

      <!-- TCP vs UDP -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">TCP vs UDP — The Two Transport Protocols</div>
        <div class="vs-cards">
          <div class="vs-card" style="border-color:#3b82f6">
            <div class="vs-card-header" style="background:#3b82f6">&#x1F4E6; TCP (Transmission Control Protocol)</div>
            <div class="vs-card-body">
              <div class="vs-row"><span class="vs-row-icon">&#x1F91D;</span>Connection-oriented (3-way handshake)</div>
              <div class="vs-row"><span class="vs-row-icon">&#x2705;</span>Guaranteed delivery (retransmits lost packets)</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F522;</span>Ordered (packets arrive in sequence)</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F4CA;</span>Flow control (prevents overwhelming receiver)</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F422;</span>Higher overhead (headers + handshake)</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F3AF;</span>HTTP, HTTPS, SSH, SMTP, databases</div>
            </div>
          </div>
          <div class="vs-badge">VS</div>
          <div class="vs-card" style="border-color:#22c55e">
            <div class="vs-card-header" style="background:#22c55e">&#x26A1; UDP (User Datagram Protocol)</div>
            <div class="vs-card-body">
              <div class="vs-row"><span class="vs-row-icon">&#x1F4E8;</span>Connectionless (fire and forget)</div>
              <div class="vs-row"><span class="vs-row-icon">&#x274C;</span>No delivery guarantee (packets may be lost)</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F500;</span>Unordered (packets may arrive shuffled)</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F6AB;</span>No flow control</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F680;</span>Minimal overhead (tiny 8-byte header)</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F3AF;</span>DNS, video streaming, gaming, VoIP</div>
            </div>
          </div>
        </div>
      </div>

      <h2>Real-World: TCP Deep Dive</h2>
      <pre><code># See all active TCP connections on your machine
ss -tuln              # Linux (modern)
netstat -tuln         # Linux/macOS (classic)
netstat -an           # Windows

# Output:
# State     Recv-Q  Send-Q  Local Address:Port   Peer Address:Port
# LISTEN    0       128     0.0.0.0:22           0.0.0.0:*          ← SSH server
# LISTEN    0       511     0.0.0.0:80           0.0.0.0:*          ← Web server
# ESTAB     0       0       10.0.1.5:43210       93.184.216.34:443  ← Active HTTPS
# TIME_WAIT 0       0       10.0.1.5:43211       93.184.216.34:443  ← Closing

# TCP 3-Way Handshake — capture it live with tcpdump
sudo tcpdump -i eth0 -nn 'tcp[tcpflags] & (tcp-syn|tcp-ack) != 0' -c 10
# Output:
# 10:00:01 IP 10.0.1.5.43210 > 93.184.216.34.443: Flags [S]      ← SYN
# 10:00:01 IP 93.184.216.34.443 > 10.0.1.5.43210: Flags [S.]     ← SYN-ACK
# 10:00:01 IP 10.0.1.5.43210 > 93.184.216.34.443: Flags [.]      ← ACK
# Connection established! Took ~1ms (3 packets)

# Common TCP states you'll see:
# LISTEN      ← Server waiting for connections
# ESTABLISHED ← Active connection (data flowing)
# TIME_WAIT   ← Connection closed, waiting for stale packets to expire (2 min)
# CLOSE_WAIT  ← Remote side closed, your app hasn't closed yet (BUG if stuck here)
# SYN_SENT    ← Your machine sent SYN, waiting for SYN-ACK (firewall blocking?)

# &#x1F6A8; Debugging: "Too many TIME_WAIT connections"
# This means your app opens and closes tons of short-lived connections.
# Fix: Use connection pooling (requests.Session(), HTTP keep-alive)
ss -s  # Show TCP state summary
# TCP: 2345 (estab 890, closed 1200, time-wait 245)</code></pre>

      <h2>Real-World: Ports You Must Know</h2>

      <!-- Essential Ports -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">Essential Port Numbers for Developers</div>
        <div style="overflow-x:auto">
          <table style="width:100%;border-collapse:collapse;font-size:0.78rem;min-width:450px">
            <thead>
              <tr>
                <th style="text-align:left;padding:0.6rem;background:#7c3aed;color:#fff;border-radius:0.4rem 0 0 0">Port</th>
                <th style="text-align:left;padding:0.6rem;background:#7c3aed;color:#fff">Protocol</th>
                <th style="text-align:left;padding:0.6rem;background:#7c3aed;color:#fff">Transport</th>
                <th style="text-align:left;padding:0.6rem;background:#7c3aed;color:#fff;border-radius:0 0.4rem 0 0">What It Does</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:#ef4444;font-weight:700">22</td><td style="padding:0.5rem;color:var(--foreground)">SSH</td><td style="padding:0.5rem">TCP</td><td style="padding:0.5rem">Remote shell, SCP, SFTP</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:#f97316;font-weight:700">53</td><td style="padding:0.5rem;color:var(--foreground)">DNS</td><td style="padding:0.5rem">UDP/TCP</td><td style="padding:0.5rem">Domain name resolution</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:#3b82f6;font-weight:700">80</td><td style="padding:0.5rem;color:var(--foreground)">HTTP</td><td style="padding:0.5rem">TCP</td><td style="padding:0.5rem">Web traffic (unencrypted)</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:#22c55e;font-weight:700">443</td><td style="padding:0.5rem;color:var(--foreground)">HTTPS</td><td style="padding:0.5rem">TCP</td><td style="padding:0.5rem">Web traffic (encrypted)</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:#a855f7;font-weight:700">5432</td><td style="padding:0.5rem;color:var(--foreground)">PostgreSQL</td><td style="padding:0.5rem">TCP</td><td style="padding:0.5rem">Database connections</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:#ec4899;font-weight:700">6379</td><td style="padding:0.5rem;color:var(--foreground)">Redis</td><td style="padding:0.5rem">TCP</td><td style="padding:0.5rem">Cache / message broker</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:#f97316;font-weight:700">8080</td><td style="padding:0.5rem;color:var(--foreground)">HTTP (alt)</td><td style="padding:0.5rem">TCP</td><td style="padding:0.5rem">Dev servers, proxies</td></tr>
              <tr><td style="padding:0.5rem;color:#3b82f6;font-weight:700">50051</td><td style="padding:0.5rem;color:var(--foreground)">gRPC</td><td style="padding:0.5rem">TCP (HTTP/2)</td><td style="padding:0.5rem">RPC services</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <h2>Layer 4: Application (HTTP, DNS, TLS — What Your Code Uses)</h2>
      <p>This is the layer developers interact with most. Every API call, database query, and web page uses application-layer protocols built on top of TCP/UDP.</p>

      <h2>DNS — The Internet's Phone Book</h2>
      <pre><code># How DNS resolution works (step by step):
# 1. You type: curl api.example.com
# 2. OS checks /etc/hosts file first (local override)
# 3. OS checks local DNS cache
# 4. Asks your configured DNS server (e.g., 8.8.8.8)
# 5. DNS server resolves recursively:
#    Root server (.com) &#x2192; TLD server (example.com) &#x2192; Authoritative server
# 6. Returns: api.example.com &#x2192; 93.184.216.34

# Query DNS manually
dig api.example.com
# ;; ANSWER SECTION:
# api.example.com.  300  IN  A  93.184.216.34
# TTL=300 means this answer is cached for 5 minutes

# Query specific record types
dig example.com MX          # Mail servers
dig example.com NS          # Name servers
dig example.com TXT         # SPF, DKIM, verification records
dig example.com AAAA        # IPv6 address
dig example.com CNAME       # Alias to another domain

# Trace the full DNS resolution path
dig +trace api.example.com
# Shows: root &#x2192; .com &#x2192; example.com &#x2192; api.example.com

# Check what DNS server you're using
cat /etc/resolv.conf        # Linux
scutil --dns | head -20     # macOS

# &#x1F6A8; Debugging DNS:
# "Can't resolve hostname" &#x2192; dig @8.8.8.8 hostname (bypass local DNS)
# "Works from one machine, not another" &#x2192; Different DNS servers, stale cache
# "Intermittent failures" &#x2192; DNS TTL too low, server overloaded
# Clear DNS cache:
sudo systemd-resolve --flush-caches   # Linux (systemd)
sudo dscacheutil -flushcache          # macOS</code></pre>

      <h2>HTTP/HTTPS — How the Web Works</h2>
      <pre><code># HTTP is a text-based request-response protocol on top of TCP

# Raw HTTP request (what curl sends):
# GET /api/users HTTP/1.1
# Host: api.example.com
# Accept: application/json
# Authorization: Bearer eyJ...
#
# (empty line = end of headers)

# Raw HTTP response (what the server returns):
# HTTP/1.1 200 OK
# Content-Type: application/json
# Content-Length: 128
# Cache-Control: max-age=300
#
# {"users": [{"id": 1, "name": "Alice"}]}

# See the full request/response exchange:
curl -v https://api.example.com/users 2>&1 | head -30
# Lines starting with > are the REQUEST
# Lines starting with < are the RESPONSE

# HTTP/2 vs HTTP/1.1:
# HTTP/1.1: One request per TCP connection (or keep-alive pipelining)
# HTTP/2: Multiplexed — many requests share one connection (used by gRPC)
# HTTP/3: Uses QUIC (UDP-based) — faster handshake, no head-of-line blocking

# Check which HTTP version a server supports:
curl -v --http2 https://api.example.com 2>&1 | grep "< HTTP"
# < HTTP/2 200</code></pre>

      <h2>Packet Capture with tcpdump &amp; Wireshark</h2>
      <p>The ultimate debugging tool. <code>tcpdump</code> captures raw packets on any interface — the network equivalent of a debugger.</p>
      <pre><code># Capture all traffic on eth0
sudo tcpdump -i eth0 -nn

# Capture only HTTP traffic (port 80)
sudo tcpdump -i eth0 -nn port 80

# Capture traffic to/from a specific IP
sudo tcpdump -i eth0 -nn host 93.184.216.34

# Capture DNS queries (port 53)
sudo tcpdump -i eth0 -nn port 53
# Output:
# 10:00:01 IP 10.0.1.5.52341 > 8.8.8.8.53: A? api.example.com
# 10:00:01 IP 8.8.8.8.53 > 10.0.1.5.52341: A 93.184.216.34

# Capture only TCP SYN packets (new connections)
sudo tcpdump -i eth0 -nn 'tcp[tcpflags] == tcp-syn'

# Save capture to file (analyze in Wireshark later)
sudo tcpdump -i eth0 -nn -w capture.pcap -c 1000

# Wireshark: Open capture.pcap for visual analysis
# - Filter: http.request.method == "GET"
# - Filter: tcp.flags.syn == 1
# - Filter: dns.qry.name contains "example"
# - Right-click any packet &#x2192; Follow TCP Stream (see full conversation)</code></pre>

      <h2>Production Debugging Scenarios</h2>
      <p>Here are real problems you'll face and which layer to investigate:</p>

      <!-- Debugging Decision Tree -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">Network Debugging: Which Layer Is the Problem?</div>
        <div style="overflow-x:auto">
          <table style="width:100%;border-collapse:collapse;font-size:0.78rem;min-width:550px">
            <thead>
              <tr>
                <th style="text-align:left;padding:0.6rem;background:#ef4444;color:#fff;border-radius:0.4rem 0 0 0">Symptom</th>
                <th style="text-align:left;padding:0.6rem;background:#ef4444;color:#fff">Layer</th>
                <th style="text-align:left;padding:0.6rem;background:#ef4444;color:#fff">Debug With</th>
                <th style="text-align:left;padding:0.6rem;background:#ef4444;color:#fff;border-radius:0 0.4rem 0 0">Likely Cause</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:var(--foreground);font-weight:600">Can't resolve hostname</td><td style="padding:0.5rem;color:#ef4444">Application (DNS)</td><td style="padding:0.5rem">dig, nslookup</td><td style="padding:0.5rem">DNS server down, wrong /etc/resolv.conf</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:var(--foreground);font-weight:600">Connection refused</td><td style="padding:0.5rem;color:#f97316">Transport (TCP)</td><td style="padding:0.5rem">telnet, nc, ss</td><td style="padding:0.5rem">Service not running, wrong port</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:var(--foreground);font-weight:600">Connection timeout</td><td style="padding:0.5rem;color:#3b82f6">Internet (IP)</td><td style="padding:0.5rem">ping, traceroute</td><td style="padding:0.5rem">Firewall blocking, routing issue</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:var(--foreground);font-weight:600">TLS handshake failed</td><td style="padding:0.5rem;color:#ef4444">Application (TLS)</td><td style="padding:0.5rem">openssl s_client</td><td style="padding:0.5rem">Expired cert, wrong hostname, cipher mismatch</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:var(--foreground);font-weight:600">HTTP 502 Bad Gateway</td><td style="padding:0.5rem;color:#ef4444">Application (HTTP)</td><td style="padding:0.5rem">curl -v, access logs</td><td style="padding:0.5rem">Backend crashed, proxy misconfigured</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:var(--foreground);font-weight:600">Slow responses</td><td style="padding:0.5rem;color:#f97316">Transport (TCP)</td><td style="padding:0.5rem">tcpdump, ss</td><td style="padding:0.5rem">Packet loss, TCP retransmissions, small window</td></tr>
              <tr><td style="padding:0.5rem;color:var(--foreground);font-weight:600">Network unreachable</td><td style="padding:0.5rem;color:#22c55e">Link (Physical)</td><td style="padding:0.5rem">ip link, ethtool</td><td style="padding:0.5rem">Cable unplugged, NIC down, VLAN wrong</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <h2>The Essential Networking Toolkit</h2>

      <!-- Tools Pipeline -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">Your Network Debugging Toolkit</div>
        <div class="pipeline">
          <div class="pipeline-step" style="background:#22c55e;--i:0"><span class="pipeline-step-icon">&#x1F4E1;</span>ping<span class="pipeline-step-sub">Is host alive?</span></div>
          <div class="pipeline-arrow">&#x2192;</div>
          <div class="pipeline-step" style="background:#3b82f6;--i:1"><span class="pipeline-step-icon">&#x1F5FA;</span>traceroute<span class="pipeline-step-sub">Where is it slow?</span></div>
          <div class="pipeline-arrow">&#x2192;</div>
          <div class="pipeline-step" style="background:#f97316;--i:2"><span class="pipeline-step-icon">&#x1F50D;</span>dig<span class="pipeline-step-sub">DNS working?</span></div>
          <div class="pipeline-arrow">&#x2192;</div>
          <div class="pipeline-step" style="background:#7c3aed;--i:3"><span class="pipeline-step-icon">&#x1F517;</span>curl -v<span class="pipeline-step-sub">HTTP working?</span></div>
          <div class="pipeline-arrow">&#x2192;</div>
          <div class="pipeline-step" style="background:#ef4444;--i:4"><span class="pipeline-step-icon">&#x1F4E6;</span>tcpdump<span class="pipeline-step-sub">What's on the wire?</span></div>
          <div class="pipeline-arrow">&#x2192;</div>
          <div class="pipeline-step" style="background:#ec4899;--i:5"><span class="pipeline-step-icon">&#x1F4CA;</span>ss / netstat<span class="pipeline-step-sub">Connection state?</span></div>
        </div>
      </div>

      <pre><code># Debugging flowchart (use this every time):

# Step 1: Can I reach the host at all?
ping 93.184.216.34
# If NO &#x2192; Layer 2/3 issue (routing, firewall, host down)

# Step 2: Can I resolve the hostname?
dig api.example.com
# If NO &#x2192; DNS issue (Layer 4: Application)

# Step 3: Can I open a TCP connection?
nc -zv api.example.com 443
# or: telnet api.example.com 443
# If "Connection refused" &#x2192; Service not listening on that port
# If "Connection timed out" &#x2192; Firewall blocking the port

# Step 4: Is TLS working?
openssl s_client -connect api.example.com:443 -servername api.example.com
# Shows certificate chain, TLS version, cipher suite
# If error &#x2192; Cert expired, hostname mismatch, protocol mismatch

# Step 5: Is HTTP working?
curl -v https://api.example.com/health
# If 5xx &#x2192; Server-side bug
# If timeout &#x2192; Back to step 1-3

# Step 6: Capture packets for deep analysis
sudo tcpdump -i eth0 -nn host 93.184.216.34 -w debug.pcap
# Open in Wireshark for visual analysis</code></pre>

      <h2>Network Layers in Kubernetes</h2>
      <p>If you work with Kubernetes, here's how the layers map:</p>

      <!-- K8s Networking -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">Network Layers in Kubernetes</div>
        <div class="layer-diagram">
          <div class="layer-item" style="background:#ef4444">L4: Application — Ingress (HTTP routing, TLS termination, path-based routing)<span class="layer-item-sub">nginx-ingress, traefik, istio gateway &#x2192; routes external traffic to Services</span></div>
          <div class="layer-item" style="background:#f97316">L3: Transport — Service (ClusterIP, NodePort, LoadBalancer)<span class="layer-item-sub">kube-proxy / iptables / eBPF &#x2192; load-balances TCP/UDP to pod endpoints</span></div>
          <div class="layer-item" style="background:#3b82f6">L2: Internet — Pod Network (CNI plugin: Calico, Cilium, Flannel)<span class="layer-item-sub">Every pod gets a unique IP, pods communicate across nodes via overlay/BGP</span></div>
          <div class="layer-item" style="background:#22c55e">L1: Link — Node Network (AWS VPC, GCP VPC, bare metal)<span class="layer-item-sub">Physical/virtual NICs, VPC subnets, security groups</span></div>
        </div>
      </div>

      <pre><code># Debugging networking in Kubernetes:

# What IP did my pod get?
kubectl get pod my-app -o wide
# NAME    READY   STATUS   IP           NODE
# my-app  1/1     Running  10.244.1.15  node-2

# Can my pod reach another service?
kubectl exec -it my-app -- curl -v http://other-service:8080/health

# DNS resolution inside a pod:
kubectl exec -it my-app -- nslookup other-service.default.svc.cluster.local
# Server: 10.96.0.10 (CoreDNS)
# Address: 10.96.0.10#53
# Name: other-service.default.svc.cluster.local  Address: 10.96.45.123

# See Service endpoints (which pods back a Service?)
kubectl get endpoints other-service
# NAME            ENDPOINTS
# other-service   10.244.1.15:8080,10.244.2.23:8080

# Debug with a network tools pod:
kubectl run debug --image=nicolaka/netshoot -it --rm -- bash
# Inside: ping, traceroute, dig, curl, tcpdump all available</code></pre>

      <h2>Mastery Checklist</h2>

      <!-- Mastery Timeline -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">Network Mastery Roadmap</div>
        <div class="timeline">
          <div class="timeline-item" style="--c:#22c55e"><div class="timeline-item-title" style="color:#22c55e">Level 1: Know your tools</div><div class="timeline-item-desc">ping, dig, curl -v, traceroute, ss, nc &#x2014; use them daily until they're muscle memory</div></div>
          <div class="timeline-item" style="--c:#3b82f6"><div class="timeline-item-title" style="color:#3b82f6">Level 2: Understand TCP</div><div class="timeline-item-desc">Handshake, states, retransmissions, window size. Read tcpdump output fluently.</div></div>
          <div class="timeline-item" style="--c:#7c3aed"><div class="timeline-item-title" style="color:#7c3aed">Level 3: Master DNS</div><div class="timeline-item-desc">Record types, TTL, caching layers, split-horizon DNS, CoreDNS in K8s</div></div>
          <div class="timeline-item" style="--c:#f97316"><div class="timeline-item-title" style="color:#f97316">Level 4: Know TLS deeply</div><div class="timeline-item-desc">Certificate chains, mTLS, cipher suites. Debug with openssl s_client.</div></div>
          <div class="timeline-item" style="--c:#ef4444"><div class="timeline-item-title" style="color:#ef4444">Level 5: Packet analysis</div><div class="timeline-item-desc">Wireshark fluency. Capture and analyze any protocol. Spot retransmissions, resets, fragmentation.</div></div>
          <div class="timeline-item" style="--c:#ec4899"><div class="timeline-item-title" style="color:#ec4899">Level 6: Network design</div><div class="timeline-item-desc">VPC architecture, subnet design, load balancer types, service mesh, eBPF</div></div>
        </div>
      </div>

      <p>Networking isn't about memorizing layer numbers — it's about knowing which tool to reach for when something breaks at 3 AM. Start by running every command in this guide on your own machine. Then break things intentionally in a lab (block ports with iptables, poison DNS, drop packets with tc) and practice fixing them. That's how you master network layers — not by reading, but by debugging.</p>
    `;
