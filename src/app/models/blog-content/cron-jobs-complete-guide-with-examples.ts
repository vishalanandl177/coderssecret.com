export const CONTENT = `
      <p>If you've ever wanted your computer to automatically run a task — like backing up a database every night, sending a report every Monday, or clearing temp files every hour — <strong>cron jobs</strong> are how you do it. Cron is one of the most powerful and widely-used scheduling tools in the Linux/Unix world, and once you understand it, you'll wonder how you ever lived without it.</p>

      <h2>What is a Cron Job?</h2>
      <p>A <strong>cron job</strong> is a scheduled task that runs automatically at specified times or intervals on Unix-based systems (Linux, macOS). The word "cron" comes from the Greek word <em>chronos</em>, meaning time. The cron daemon (<code>crond</code>) runs in the background and checks every minute if there's a job to execute.</p>
      <p>You define cron jobs in a file called the <strong>crontab</strong> (cron table). Each line in the crontab represents one scheduled task.</p>

      <!-- Cron Syntax Visual -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">Cron Expression: 5 Fields + Command</div>
        <div class="pipeline" style="justify-content:center">
          <div class="pipeline-step" style="background:#ef4444;--i:0"><span class="pipeline-step-icon">&#x23F0;</span>Minute<span class="pipeline-step-sub">0-59</span></div>
          <div class="pipeline-step" style="background:#f97316;--i:1"><span class="pipeline-step-icon">&#x1F551;</span>Hour<span class="pipeline-step-sub">0-23</span></div>
          <div class="pipeline-step" style="background:#a855f7;--i:2"><span class="pipeline-step-icon">&#x1F4C5;</span>Day<span class="pipeline-step-sub">1-31</span></div>
          <div class="pipeline-step" style="background:#3b82f6;--i:3"><span class="pipeline-step-icon">&#x1F5D3;</span>Month<span class="pipeline-step-sub">1-12</span></div>
          <div class="pipeline-step" style="background:#22c55e;--i:4"><span class="pipeline-step-icon">&#x1F4C6;</span>Weekday<span class="pipeline-step-sub">0-7 (Sun=0,7)</span></div>
          <div class="pipeline-arrow">&#x2192;</div>
          <div class="pipeline-step" style="background:#ec4899;--i:5"><span class="pipeline-step-icon">&#x1F4BB;</span>Command<span class="pipeline-step-sub">/path/to/script</span></div>
        </div>
      </div>

      <h2>The Cron Syntax — 5 Fields</h2>
      <p>Every cron expression has exactly <strong>5 time fields</strong> followed by the command to run:</p>
      <pre><code>┌───────────── minute (0 - 59)
│ ┌───────────── hour (0 - 23)
│ │ ┌───────────── day of month (1 - 31)
│ │ │ ┌───────────── month (1 - 12)
│ │ │ │ ┌───────────── day of week (0 - 7, where 0 and 7 = Sunday)
│ │ │ │ │
* * * * * command_to_run</code></pre>
      <p>The <code>*</code> (asterisk) means <strong>"every"</strong> — so <code>* * * * *</code> means "every minute of every hour of every day of every month on every day of the week."</p>

      <h2>Special Characters</h2>
      <p>Before we dive into examples, here are the special characters you'll use:</p>
      <ul>
        <li><code>*</code> — Every possible value (wildcard)</li>
        <li><code>,</code> — List separator (e.g., <code>1,3,5</code> means 1 and 3 and 5)</li>
        <li><code>-</code> — Range (e.g., <code>1-5</code> means 1 through 5)</li>
        <li><code>/</code> — Step value (e.g., <code>*/10</code> means every 10th unit)</li>
      </ul>

      <h2>Basic Examples — Getting Started</h2>

      <p><strong>Example 1: Run every minute</strong></p>
      <pre><code>* * * * * /home/user/scripts/check-health.sh</code></pre>
      <p>This runs <code>check-health.sh</code> every single minute, 24/7. Useful for monitoring scripts.</p>

      <p><strong>Example 2: Run every hour (at minute 0)</strong></p>
      <pre><code>0 * * * * /home/user/scripts/sync-data.sh</code></pre>
      <p>Runs at the top of every hour: 1:00, 2:00, 3:00, etc.</p>

      <p><strong>Example 3: Run once a day at midnight</strong></p>
      <pre><code>0 0 * * * /home/user/scripts/daily-backup.sh</code></pre>
      <p>Runs at exactly 00:00 (midnight) every day. Perfect for nightly backups.</p>

      <p><strong>Example 4: Run once a day at 2:30 AM</strong></p>
      <pre><code>30 2 * * * /home/user/scripts/cleanup.sh</code></pre>
      <p>Runs at 2:30 AM every day. Great for maintenance tasks during low-traffic hours.</p>

      <h2>Weekly &amp; Monthly Examples</h2>

      <p><strong>Example 5: Run every Monday at 9:00 AM</strong></p>
      <pre><code>0 9 * * 1 /home/user/scripts/weekly-report.sh</code></pre>
      <p>Day of week: 0 = Sunday, 1 = Monday, ..., 6 = Saturday. This sends your weekly report every Monday morning.</p>

      <p><strong>Example 6: Run every weekday (Mon-Fri) at 8:00 AM</strong></p>
      <pre><code>0 8 * * 1-5 /home/user/scripts/morning-alerts.sh</code></pre>
      <p>The <code>1-5</code> range covers Monday through Friday. No weekend noise.</p>

      <p><strong>Example 7: Run on the 1st of every month at midnight</strong></p>
      <pre><code>0 0 1 * * /home/user/scripts/monthly-invoice.sh</code></pre>
      <p>Runs at midnight on the 1st day of each month. Ideal for monthly billing, reports, or cleanup.</p>

      <p><strong>Example 8: Run on the 1st and 15th of every month</strong></p>
      <pre><code>0 0 1,15 * * /home/user/scripts/bimonthly-task.sh</code></pre>
      <p>The comma lets you specify multiple days. This runs twice a month — on the 1st and 15th.</p>

      <h2>Interval Examples — Every N Minutes/Hours</h2>

      <p><strong>Example 9: Run every 5 minutes</strong></p>
      <pre><code>*/5 * * * * /home/user/scripts/check-queue.sh</code></pre>
      <p>The <code>*/5</code> means "every 5th minute." Runs at :00, :05, :10, :15, etc.</p>

      <p><strong>Example 10: Run every 15 minutes</strong></p>
      <pre><code>*/15 * * * * /home/user/scripts/poll-api.sh</code></pre>
      <p>Runs at :00, :15, :30, :45 of every hour.</p>

      <p><strong>Example 11: Run every 2 hours</strong></p>
      <pre><code>0 */2 * * * /home/user/scripts/cache-refresh.sh</code></pre>
      <p>Runs at 00:00, 02:00, 04:00, 06:00, etc. Note the <code>0</code> in the minute field — without it, the job would run every minute during those hours!</p>

      <p><strong>Example 12: Run every 30 minutes during business hours (9 AM - 6 PM)</strong></p>
      <pre><code>*/30 9-18 * * * /home/user/scripts/business-check.sh</code></pre>
      <p>Combines a step value (<code>*/30</code>) with an hour range (<code>9-18</code>). Only runs during working hours.</p>

      <h2>Specific Time Examples</h2>

      <p><strong>Example 13: Run at 6:00 AM and 6:00 PM every day</strong></p>
      <pre><code>0 6,18 * * * /home/user/scripts/twice-daily.sh</code></pre>
      <p>The comma in the hour field gives you two specific times.</p>

      <p><strong>Example 14: Run every Sunday at 11:30 PM</strong></p>
      <pre><code>30 23 * * 0 /home/user/scripts/weekly-cleanup.sh</code></pre>
      <p>End-of-week cleanup right before Monday begins.</p>

      <p><strong>Example 15: Run at 3:15 AM on the first Monday of each month</strong></p>
      <pre><code>15 3 1-7 * 1 /home/user/scripts/first-monday.sh</code></pre>
      <p>This is a clever trick: it targets days 1-7 (first week of the month) AND Mondays. The job only fires when both conditions overlap — the first Monday.</p>

      <h2>Real-World Use Cases</h2>

      <p><strong>Example 16: Database backup every night at 3 AM</strong></p>
      <pre><code>0 3 * * * pg_dump mydb > /backups/mydb_\$(date +\\%Y\\%m\\%d).sql 2>&1</code></pre>
      <p>Creates a dated backup file like <code>mydb_20260403.sql</code>. The <code>\\%</code> escaping is needed in crontab because <code>%</code> has a special meaning (newline).</p>

      <p><strong>Example 17: Clear log files older than 7 days</strong></p>
      <pre><code>0 4 * * * find /var/log/myapp -name "*.log" -mtime +7 -delete</code></pre>
      <p>Runs at 4 AM daily and removes log files older than 7 days. Keeps your disk from filling up.</p>

      <p><strong>Example 18: Restart a service every 6 hours</strong></p>
      <pre><code>0 */6 * * * systemctl restart myapp.service</code></pre>
      <p>Restarts at midnight, 6 AM, noon, and 6 PM. Useful for apps with memory leaks you haven't fixed yet.</p>

      <p><strong>Example 19: Send a disk space alert if usage exceeds 90%</strong></p>
      <pre><code>*/30 * * * * df -h / | awk 'NR==2 {if ($5+0 > 90) print "DISK ALERT: " $5 " used"}' | mail -s "Disk Alert" admin@example.com</code></pre>
      <p>Checks every 30 minutes and emails an alert if the root partition is over 90% full.</p>

      <p><strong>Example 20: Pull latest code and restart app (simple CI/CD)</strong></p>
      <pre><code>*/10 * * * * cd /var/www/myapp && git pull origin main && systemctl restart myapp</code></pre>
      <p>A simple (but effective) deploy pipeline that checks for new code every 10 minutes.</p>

      <h2>Shortcut Strings</h2>
      <p>Most cron implementations support these convenient shortcuts:</p>
      <ul>
        <li><code>@reboot</code> — Run once at startup</li>
        <li><code>@yearly</code> or <code>@annually</code> — Same as <code>0 0 1 1 *</code> (Jan 1st, midnight)</li>
        <li><code>@monthly</code> — Same as <code>0 0 1 * *</code> (1st of month, midnight)</li>
        <li><code>@weekly</code> — Same as <code>0 0 * * 0</code> (Sunday, midnight)</li>
        <li><code>@daily</code> or <code>@midnight</code> — Same as <code>0 0 * * *</code></li>
        <li><code>@hourly</code> — Same as <code>0 * * * *</code></li>
      </ul>

      <p><strong>Example 21: Run a script at system boot</strong></p>
      <pre><code>@reboot /home/user/scripts/start-services.sh</code></pre>
      <p>Perfect for starting background processes after a server reboot.</p>

      <h2>Managing Cron Jobs</h2>
      <p>Here are the essential commands for working with crontab:</p>
      <pre><code># Edit your crontab
crontab -e

# List all your cron jobs
crontab -l

# Remove all your cron jobs (use with caution!)
crontab -r

# Edit crontab for a specific user (requires root)
crontab -u username -e</code></pre>

      <h2>Cron Jobs on Different Platforms</h2>
      <p>Cron syntax is universal, but the setup differs across operating systems and environments. Here's how to get cron running on each platform.</p>

      <!-- Platform Pipeline -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">Cron Across Platforms</div>
        <div class="pipeline">
          <div class="pipeline-step" style="background:#f97316;--i:0"><span class="pipeline-step-icon">&#x1F427;</span>Linux<span class="pipeline-step-sub">crontab (built-in)</span></div>
          <div class="pipeline-step" style="background:#6b7280;--i:1"><span class="pipeline-step-icon">&#x1F34E;</span>macOS<span class="pipeline-step-sub">crontab + launchd</span></div>
          <div class="pipeline-step" style="background:#3b82f6;--i:2"><span class="pipeline-step-icon">&#x1FA9F;</span>Windows<span class="pipeline-step-sub">Task Scheduler</span></div>
          <div class="pipeline-step" style="background:#22c55e;--i:3"><span class="pipeline-step-icon">&#x1F433;</span>Docker<span class="pipeline-step-sub">Entrypoint cron</span></div>
          <div class="pipeline-step" style="background:#7c3aed;--i:4"><span class="pipeline-step-icon">&#x2638;</span>Kubernetes<span class="pipeline-step-sub">CronJob resource</span></div>
        </div>
      </div>

      <h2>Linux (Ubuntu / Debian / CentOS / RHEL)</h2>
      <p>Cron is pre-installed on virtually all Linux distributions. The cron daemon (<code>crond</code> or <code>cron</code>) runs automatically.</p>
      <pre><code># Check if cron is running
systemctl status cron        # Ubuntu/Debian
systemctl status crond       # CentOS/RHEL

# If not running, start and enable it
sudo systemctl start cron
sudo systemctl enable cron

# Edit your crontab
crontab -e

# Add your jobs — e.g., backup every night at 2 AM
0 2 * * * /home/deploy/scripts/backup.sh >> /var/log/backup.log 2>&1

# System-wide cron jobs go in /etc/crontab or /etc/cron.d/
# These require specifying the user:
# min hour day month dow USER command
0 3 * * * root /usr/local/bin/cleanup.sh

# You can also drop scripts into these directories:
# /etc/cron.daily/    — runs once a day
# /etc/cron.hourly/   — runs once an hour
# /etc/cron.weekly/   — runs once a week
# /etc/cron.monthly/  — runs once a month
sudo cp my-script.sh /etc/cron.daily/
sudo chmod +x /etc/cron.daily/my-script.sh</code></pre>

      <h2>macOS</h2>
      <p>macOS has cron built-in, but Apple recommends <code>launchd</code> for modern scheduling. Both work — here's how to use each.</p>
      <pre><code># Option 1: crontab (works exactly like Linux)
crontab -e
# Add: 0 9 * * 1-5 /Users/you/scripts/morning-report.sh

# ⚠️ macOS may prompt for "Full Disk Access" — grant it in:
# System Settings → Privacy & Security → Full Disk Access → cron

# Option 2: launchd (Apple's recommended approach)
# Create a plist file:
cat > ~/Library/LaunchAgents/com.you.backup.plist << 'PLIST'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN"
  "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>com.you.backup</string>
  <key>ProgramArguments</key>
  <array>
    <string>/Users/you/scripts/backup.sh</string>
  </array>
  <key>StartCalendarInterval</key>
  <dict>
    <key>Hour</key>
    <integer>2</integer>
    <key>Minute</key>
    <integer>0</integer>
  </dict>
  <key>StandardOutPath</key>
  <string>/tmp/backup.log</string>
  <key>StandardErrorPath</key>
  <string>/tmp/backup-error.log</string>
</dict>
</plist>
PLIST

# Load the job
launchctl load ~/Library/LaunchAgents/com.you.backup.plist

# Unload (disable)
launchctl unload ~/Library/LaunchAgents/com.you.backup.plist

# List all loaded jobs
launchctl list | grep com.you</code></pre>

      <h2>Windows</h2>
      <p>Windows doesn't have cron, but <strong>Task Scheduler</strong> provides the same functionality. You can set it up via GUI or command line.</p>
      <pre><code># PowerShell: Create a scheduled task (equivalent of a cron job)

# Example: Run a Python script every day at 3 AM
# Create action, trigger, and settings
\$action = New-ScheduledTaskAction -Execute "C:\\Python312\\python.exe" -Argument "C:\\scripts\\daily-backup.py"
\$trigger = New-ScheduledTaskTrigger -Daily -At 3:00AM
\$settings = New-ScheduledTaskSettingsSet -StartWhenAvailable -DontStopOnIdleEnd

# Register the task
Register-ScheduledTask -TaskName "DailyBackup" -Action \$action -Trigger \$trigger -Settings \$settings -Description "Runs daily backup at 3 AM"

# List all scheduled tasks
Get-ScheduledTask | Where-Object {\$_.TaskName -like "*Backup*"}

# Run a task immediately (for testing)
Start-ScheduledTask -TaskName "DailyBackup"

# Delete a task
Unregister-ScheduledTask -TaskName "DailyBackup" -Confirm:\$false

# ─────────────────────────────────────────────
# Alternative: Use schtasks.exe (works in CMD too)
schtasks /create /tn "DailyBackup" /tr "python C:\\scripts\\backup.py" ^
  /sc daily /st 03:00

# Using WSL? You can use Linux cron inside WSL:
wsl crontab -e</code></pre>

      <h2>Docker</h2>
      <p>Running cron inside Docker requires a slightly different approach since containers are single-process by default.</p>
      <pre><code># Dockerfile with cron
FROM python:3.12-slim

# Install cron
RUN apt-get update && apt-get install -y cron && rm -rf /var/lib/apt/lists/*

# Copy your scripts
COPY scripts/ /app/scripts/
RUN chmod +x /app/scripts/*.sh

# Create the crontab file
COPY crontab /etc/cron.d/app-cron
RUN chmod 0644 /etc/cron.d/app-cron
RUN crontab /etc/cron.d/app-cron

# Create log file
RUN touch /var/log/cron.log

# Start cron in the foreground + tail logs
CMD cron && tail -f /var/log/cron.log</code></pre>
      <pre><code># crontab file (placed at project root)
# Note: cron in Docker doesn't inherit ENV vars — pass them explicitly

SHELL=/bin/bash
PATH=/usr/local/bin:/usr/bin:/bin

# Run every 5 minutes
*/5 * * * * /app/scripts/health-check.sh >> /var/log/cron.log 2>&1

# Daily backup at midnight
0 0 * * * /app/scripts/backup.sh >> /var/log/cron.log 2>&1

# IMPORTANT: Must have an empty line at the end
</code></pre>
      <pre><code># Better approach: Use Docker's --restart with a lightweight scheduler
# or use a sidecar pattern in Docker Compose:

# docker-compose.yml
version: '3.8'
services:
  app:
    build: .
    # ... your main app

  scheduler:
    build: .
    command: cron -f  # Run cron in foreground
    volumes:
      - ./scripts:/app/scripts
    depends_on:
      - app</code></pre>

      <h2>Kubernetes CronJob</h2>
      <p>Kubernetes has a first-class <strong>CronJob</strong> resource that runs Jobs on a cron schedule. This is the production-grade way to run scheduled tasks in a cluster — no need to install cron in your containers.</p>

      <!-- K8s CronJob Architecture -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">Kubernetes CronJob Architecture</div>
        <div class="layer-diagram">
          <div class="layer-item" style="background:#7c3aed">CronJob Resource<span class="layer-item-sub">Defines the schedule (cron syntax) and the Job template</span></div>
          <div class="layer-item" style="background:#3b82f6">CronJob Controller<span class="layer-item-sub">Watches the clock, creates Jobs when the schedule matches</span></div>
          <div class="layer-item" style="background:#f97316">Job<span class="layer-item-sub">Created automatically, manages Pod lifecycle and retries</span></div>
          <div class="layer-item" style="background:#22c55e">Pod<span class="layer-item-sub">Runs your container to completion, then exits</span></div>
        </div>
      </div>

      <pre><code># cronjob.yaml — Kubernetes CronJob manifest
apiVersion: batch/v1
kind: CronJob
metadata:
  name: database-backup
  namespace: production
spec:
  schedule: "0 3 * * *"              # Every day at 3 AM (same cron syntax!)
  timeZone: "America/New_York"       # K8s 1.27+ supports time zones
  concurrencyPolicy: Forbid          # Don't start new if previous still running
  successfulJobsHistoryLimit: 3      # Keep last 3 successful runs
  failedJobsHistoryLimit: 5          # Keep last 5 failed runs
  startingDeadlineSeconds: 600       # Skip if more than 10 min late
  jobTemplate:
    spec:
      backoffLimit: 3                # Retry up to 3 times on failure
      activeDeadlineSeconds: 3600    # Kill if running longer than 1 hour
      template:
        spec:
          restartPolicy: OnFailure
          containers:
          - name: backup
            image: your-registry/db-backup:latest
            command:
            - /bin/sh
            - -c
            - |
              echo "Starting backup at \$(date)"
              pg_dump \$DATABASE_URL > /backups/db-\$(date +%Y%m%d-%H%M%S).sql
              echo "Backup completed at \$(date)"
            env:
            - name: DATABASE_URL
              valueFrom:
                secretKeyRef:
                  name: db-credentials
                  key: url
            volumeMounts:
            - name: backup-storage
              mountPath: /backups
          volumes:
          - name: backup-storage
            persistentVolumeClaim:
              claimName: backup-pvc</code></pre>

      <pre><code># Apply it
kubectl apply -f cronjob.yaml

# Check the CronJob
kubectl get cronjobs -n production
# NAME              SCHEDULE    SUSPEND   ACTIVE   LAST SCHEDULE
# database-backup   0 3 * * *   False     0        3h

# List Jobs created by this CronJob
kubectl get jobs -n production -l job-name=database-backup
# NAME                         COMPLETIONS   DURATION   AGE
# database-backup-28571234     1/1           45s        3h

# Check logs from the latest run
kubectl logs job/database-backup-28571234 -n production

# Trigger a manual run (useful for testing)
kubectl create job --from=cronjob/database-backup manual-backup-test -n production

# Suspend a CronJob (pause without deleting)
kubectl patch cronjob database-backup -n production -p '{"spec":{"suspend":true}}'

# Resume
kubectl patch cronjob database-backup -n production -p '{"spec":{"suspend":false}}'

# Delete
kubectl delete cronjob database-backup -n production</code></pre>

      <h2>Kubernetes CronJob — Advanced Patterns</h2>
      <pre><code># Pattern 1: CronJob with resource limits and monitoring
apiVersion: batch/v1
kind: CronJob
metadata:
  name: report-generator
spec:
  schedule: "0 9 * * 1"   # Every Monday at 9 AM
  jobTemplate:
    spec:
      template:
        spec:
          restartPolicy: Never
          containers:
          - name: report
            image: your-registry/reports:latest
            resources:
              requests:
                cpu: "500m"
                memory: "512Mi"
              limits:
                cpu: "1"
                memory: "1Gi"
            envFrom:
            - configMapRef:
                name: report-config
            - secretRef:
                name: report-secrets

---
# Pattern 2: CronJob with init container (wait for dependency)
apiVersion: batch/v1
kind: CronJob
metadata:
  name: data-sync
spec:
  schedule: "*/30 * * * *"   # Every 30 minutes
  concurrencyPolicy: Replace  # Kill previous if still running
  jobTemplate:
    spec:
      template:
        spec:
          restartPolicy: OnFailure
          initContainers:
          - name: wait-for-api
            image: busybox
            command: ['sh', '-c', 'until wget -q -O- http://api-service:8080/health; do sleep 2; done']
          containers:
          - name: sync
            image: your-registry/data-sync:latest
            command: ["python", "sync.py"]

---
# Pattern 3: CronJob that sends Slack alerts on failure
apiVersion: batch/v1
kind: CronJob
metadata:
  name: health-monitor
spec:
  schedule: "*/5 * * * *"    # Every 5 minutes
  jobTemplate:
    spec:
      backoffLimit: 0        # Don't retry — alert immediately
      template:
        spec:
          restartPolicy: Never
          containers:
          - name: monitor
            image: curlimages/curl
            command:
            - /bin/sh
            - -c
            - |
              STATUS=\$(curl -s -o /dev/null -w "%{http_code}" https://api.example.com/health)
              if [ "\$STATUS" != "200" ]; then
                curl -X POST \$SLACK_WEBHOOK -H 'Content-Type: application/json' \\
                  -d "{\"text\": \"&#x1F6A8; API health check failed! Status: \$STATUS\"}"
                exit 1
              fi
              echo "Health check passed: \$STATUS"
            env:
            - name: SLACK_WEBHOOK
              valueFrom:
                secretKeyRef:
                  name: slack-config
                  key: webhook-url</code></pre>

      <h2>Cron vs Kubernetes CronJob — When to Use Which</h2>

      <!-- Cron vs K8s Decision -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">Cron vs Kubernetes CronJob</div>
        <div class="vs-cards">
          <div class="vs-card" style="border-color:#f97316">
            <div class="vs-card-header" style="background:#f97316">&#x23F0; Traditional Cron</div>
            <div class="vs-card-body">
              <div class="vs-row"><span class="vs-row-icon">&#x1F4BB;</span>Runs on<span class="vs-row-value" style="color:#f97316">Single machine</span></div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F504;</span>Retries<span class="vs-row-value" style="color:#ef4444">Manual</span></div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F4CA;</span>Monitoring<span class="vs-row-value" style="color:#ef4444">DIY (logs)</span></div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F512;</span>Secrets<span class="vs-row-value" style="color:#f97316">Env vars / files</span></div>
              <div class="vs-row"><span class="vs-row-icon">&#x2699;</span>Best for<span class="vs-row-value" style="color:#f97316">Simple servers, VMs</span></div>
            </div>
          </div>
          <div class="vs-badge">VS</div>
          <div class="vs-card" style="border-color:#7c3aed">
            <div class="vs-card-header" style="background:#7c3aed">&#x2638; K8s CronJob</div>
            <div class="vs-card-body">
              <div class="vs-row"><span class="vs-row-icon">&#x1F4BB;</span>Runs on<span class="vs-row-value" style="color:#22c55e">Any cluster node</span></div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F504;</span>Retries<span class="vs-row-value" style="color:#22c55e">Automatic (backoffLimit)</span></div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F4CA;</span>Monitoring<span class="vs-row-value" style="color:#22c55e">Built-in (kubectl, events)</span></div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F512;</span>Secrets<span class="vs-row-value" style="color:#22c55e">K8s Secrets + RBAC</span></div>
              <div class="vs-row"><span class="vs-row-icon">&#x2699;</span>Best for<span class="vs-row-value" style="color:#7c3aed">Production, microservices</span></div>
            </div>
          </div>
        </div>
      </div>

      <h2>Common Mistakes to Avoid</h2>
      <ul>
        <li><strong>Forgetting the full path:</strong> Cron runs with a minimal environment. Always use absolute paths like <code>/usr/bin/python3</code> instead of just <code>python3</code>.</li>
        <li><strong>Not escaping %:</strong> In crontab, <code>%</code> is treated as a newline. Escape it with <code>\\%</code> when using date formats.</li>
        <li><strong>Missing output redirection:</strong> Cron emails output by default. Redirect to a file or <code>/dev/null</code> to avoid mailbox spam:</li>
      </ul>
      <pre><code># Log output to a file
0 3 * * * /scripts/backup.sh >> /var/log/backup.log 2>&1

# Discard output completely
0 3 * * * /scripts/backup.sh > /dev/null 2>&1</code></pre>
      <ul>
        <li><strong>Not setting PATH:</strong> Add a PATH variable at the top of your crontab if your scripts depend on it:</li>
      </ul>
      <pre><code>PATH=/usr/local/bin:/usr/bin:/bin
0 3 * * * backup.sh</code></pre>

      <h2>Quick Reference Cheat Sheet</h2>
      <pre><code>Expression          Description
──────────────────  ──────────────────────────────
* * * * *           Every minute
*/5 * * * *         Every 5 minutes
0 * * * *           Every hour
0 0 * * *           Every day at midnight
0 0 * * 0           Every Sunday at midnight
0 0 1 * *           First day of every month
0 0 1 1 *           Once a year (Jan 1st)
0 9-17 * * 1-5      Every hour, Mon-Fri, 9AM-5PM
*/10 * * * *        Every 10 minutes
0 6,18 * * *        At 6 AM and 6 PM
0 0 1,15 * *        1st and 15th of each month</code></pre>

      <p>Cron jobs are one of those tools that, once mastered, become an essential part of your DevOps toolkit. Whether you're automating backups, scheduling reports, managing deployments, or monitoring systems, cron has been doing it reliably for over 40 years — and it's not going anywhere.</p>
    `;
