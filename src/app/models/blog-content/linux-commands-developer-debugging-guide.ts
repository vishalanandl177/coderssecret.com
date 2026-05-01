export const CONTENT = `
      <p>Most developers know a dozen Linux commands and Google the rest. That works until production is on fire at 2 AM and you need to find which process is holding a file lock, which socket is stuck in CLOSE_WAIT, or which log entry appeared right before the crash. These commands are your firefighting toolkit.</p>

      <h2>Text Processing: awk, sed, cut</h2>

      <h3>awk: Column-Based Processing</h3>

      <pre><code># Print the 5th column of a space-delimited file
awk '{print $5}' access.log

# Sum all values in column 3
awk '{sum += $3} END {print sum}' data.txt

# Filter rows where column 9 (HTTP status) is 500
awk '$9 == 500' access.log

# Print lines where response time (col 11) > 1000ms
awk '$11 > 1000 {print $7, $11"ms"}' access.log

# Count requests per HTTP method
awk '{count[$6]++} END {for (m in count) print m, count[m]}' access.log
# "GET 45123
# "POST 12456
# "PUT 3421

# Count unique IPs
awk '{print $1}' access.log | sort -u | wc -l</code></pre>

      <h3>sed: Stream Editing</h3>

      <pre><code># Replace text in-place
sed -i 's/old_api_url/new_api_url/g' config.yaml

# Delete lines matching a pattern
sed '/DEBUG/d' app.log > clean.log

# Print only lines 100-200
sed -n '100,200p' large_file.log

# Insert text after a matching line
sed '/\\[database\\]/a connection_timeout = 30' config.ini

# Remove blank lines
sed '/^$/d' file.txt</code></pre>

      <h3>cut: Extract Columns</h3>

      <pre><code># Extract fields from CSV
cut -d',' -f1,3 users.csv      # Fields 1 and 3, comma-delimited

# Extract from colon-delimited (like /etc/passwd)
cut -d':' -f1,7 /etc/passwd    # Username and shell

# Extract characters 1-10
cut -c1-10 file.txt</code></pre>

      <h2>JSON Processing: jq</h2>

      <pre><code># Pretty print JSON
curl -s https://api.example.com/data | jq .

# Extract a field
echo '{"name":"Alice","age":30}' | jq '.name'
# "Alice"

# Extract from arrays
echo '[{"id":1,"name":"A"},{"id":2,"name":"B"}]' | jq '.[0].name'
# "A"

# Filter array elements
echo '[{"status":"active"},{"status":"inactive"}]' | \\
  jq '[.[] | select(.status == "active")]'

# Extract multiple fields into CSV
jq -r '.[] | [.id, .name, .email] | @csv' users.json

# Transform JSON structure
jq '{user_count: length, names: [.[].name]}' users.json

# Parse Docker inspect output
docker inspect mycontainer | jq '.[0].NetworkSettings.IPAddress'

# Parse kubectl output
kubectl get pods -o json | jq '.items[] | {name: .metadata.name, status: .status.phase}'</code></pre>

      <h2>Parallel Execution: xargs</h2>

      <pre><code># Delete all .pyc files in parallel
find . -name "*.pyc" | xargs rm

# Run commands in parallel (-P for parallelism)
find . -name "*.test.js" | xargs -P 4 -I {} node {}
# Runs 4 test files simultaneously

# Bulk rename files
ls *.jpg | xargs -I {} mv {} archive/{}

# Curl multiple URLs in parallel
cat urls.txt | xargs -P 10 -I {} curl -s -o /dev/null -w "%{url}: %{http_code}\\n" {}

# Kill all processes matching a pattern
pgrep -f "celery worker" | xargs kill -TERM

# Batch database operations
cat user_ids.txt | xargs -I {} psql -c "DELETE FROM sessions WHERE user_id = '{}';"</code></pre>

      <h2>Process Investigation: ps, htop, strace</h2>

      <pre><code># Find what is eating CPU
ps aux --sort=-%cpu | head -10

# Find what is eating memory
ps aux --sort=-%mem | head -10

# Watch processes in real-time (better than top)
htop
# Press F6 to sort, F4 to filter, F5 for tree view

# Trace system calls of a running process
strace -p PID -e trace=network    # Network calls only
strace -p PID -e trace=file       # File operations only
strace -p PID -c                  # Summary of all syscalls

# Example: why is this process slow?
strace -p 12345 -T -e trace=read,write
# Shows every read/write call with time spent
# If you see: read(5, ..., 4096) = 4096  &lt;2.003456&gt;
# That file descriptor is blocking for 2 seconds!</code></pre>

      <h2>Network Debugging: ss, curl, dig</h2>

      <pre><code># List all listening ports (replaces netstat)
ss -tlnp
# -t: TCP, -l: listening, -n: numeric ports, -p: show process
# State    Local Address:Port   Process
# LISTEN   0.0.0.0:8080         users:(("node",pid=1234))
# LISTEN   0.0.0.0:5432         users:(("postgres",pid=5678))

# Find what is using port 8080
ss -tlnp | grep 8080

# Count connections by state
ss -tan | awk '{print $1}' | sort | uniq -c | sort -rn
#   245 ESTAB
#    12 TIME-WAIT
#     3 CLOSE-WAIT    # These are trouble! (leaked connections)

# DNS debugging
dig example.com              # Full DNS query
dig +short example.com       # Just the IP
dig @8.8.8.8 example.com    # Query a specific DNS server

# HTTP debugging with curl
curl -v https://api.example.com/health     # Verbose (shows headers, TLS)
curl -w "\\nTime: %{time_total}s\\nHTTP: %{http_code}\\n" -s -o /dev/null URL
curl --resolve example.com:443:1.2.3.4 https://example.com  # Override DNS</code></pre>

      <h2>File Investigation: lsof, find, du</h2>

      <pre><code># Who has this file open?
lsof /var/log/app.log

# What files does this process have open?
lsof -p 12345

# Find processes with deleted files still open (disk space leak!)
lsof +L1
# If you deleted a large log file but disk space did not free up,
# a process still has it open. Restart the process.

# Find large files
find . -type f -size +100M -exec ls -lh {} \\;

# Find recently modified files
find . -type f -mmin -30      # Modified in last 30 minutes
find . -type f -mtime -1      # Modified in last 24 hours

# Disk usage by directory (sorted)
du -sh */ | sort -rh | head -10
# 4.2G   node_modules/
# 1.8G   .git/
# 250M   dist/

# Watch disk usage in real-time
watch -n 5 'df -h | grep /dev/sda'</code></pre>

      <h2>Log Analysis</h2>

      <pre><code># Follow a log file in real-time
tail -f /var/log/app.log

# Follow multiple files
tail -f /var/log/app.log /var/log/error.log

# Search compressed log archives
zgrep "ERROR" /var/log/app.log.*.gz

# Count errors per hour
grep "ERROR" app.log | awk '{print $1, substr($2,1,2)":00"}' | sort | uniq -c
#   15 2026-04-28 10:00
#   42 2026-04-28 11:00    # Spike!
#    8 2026-04-28 12:00

# Find the most common error messages
grep "ERROR" app.log | awk -F'ERROR' '{print $2}' | sort | uniq -c | sort -rn | head -10

# Extract requests slower than 1 second
grep "request_time" access.log | awk -F'request_time=' '{print $2}' | \\
  awk '$1 > 1.0 {print}' | sort -rn | head -20</code></pre>

      <h2>Quick Reference</h2>

      <table>
        <thead>
          <tr>
            <th>Task</th>
            <th>Command</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Find what uses a port</td>
            <td><code>ss -tlnp | grep :8080</code></td>
          </tr>
          <tr>
            <td>Find large files</td>
            <td><code>find . -size +100M</code></td>
          </tr>
          <tr>
            <td>Count log errors per hour</td>
            <td><code>grep ERROR log | cut -d' ' -f1-2 | uniq -c</code></td>
          </tr>
          <tr>
            <td>Watch a process</td>
            <td><code>strace -p PID -c</code></td>
          </tr>
          <tr>
            <td>Parse JSON</td>
            <td><code>jq '.field' file.json</code></td>
          </tr>
          <tr>
            <td>Parallel execution</td>
            <td><code>xargs -P 4 -I {} cmd {}</code></td>
          </tr>
          <tr>
            <td>Disk space leak</td>
            <td><code>lsof +L1</code></td>
          </tr>
          <tr>
            <td>Replace text in files</td>
            <td><code>sed -i 's/old/new/g' file</code></td>
          </tr>
        </tbody>
      </table>

      <h2>Key Takeaways</h2>

      <ul>
        <li><strong>jq is essential</strong> &mdash; every API, Docker, and Kubernetes tool outputs JSON. jq makes it queryable.</li>
        <li><strong>awk handles 90% of log analysis</strong> &mdash; column extraction, filtering, counting, summing</li>
        <li><strong>ss replaces netstat</strong> &mdash; faster and shows more information about socket states</li>
        <li><strong>strace reveals why a process is slow</strong> &mdash; it shows every system call with timing</li>
        <li><strong>lsof +L1 finds disk space leaks</strong> &mdash; deleted files held open by running processes</li>
        <li><strong>xargs -P enables easy parallelism</strong> &mdash; run commands across multiple inputs simultaneously</li>
        <li><strong>Combine commands with pipes</strong> &mdash; the power is in composition, not individual tools</li>
      </ul>

      <p>These commands are not arcane knowledge &mdash; they are the standard toolkit for anyone who operates production systems. Spend an afternoon practicing them and you will debug faster than colleagues who reach for monitoring dashboards first. The command line is the fastest path from &ldquo;something is wrong&rdquo; to &ldquo;here is exactly what happened.&rdquo;</p>
    `;
