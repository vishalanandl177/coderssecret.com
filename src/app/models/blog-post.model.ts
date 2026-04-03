export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  readTime: string;
  tags: string[];
  coverImage: string;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    id: '5',
    title: 'Cron Jobs Explained: The Complete Guide with Real-World Examples',
    slug: 'cron-jobs-complete-guide-with-examples',
    excerpt: 'Everything you need to know about cron jobs — from basic syntax to advanced scheduling patterns. Packed with practical examples anyone can follow.',
    content: `
      <p>If you've ever wanted your computer to automatically run a task — like backing up a database every night, sending a report every Monday, or clearing temp files every hour — <strong>cron jobs</strong> are how you do it. Cron is one of the most powerful and widely-used scheduling tools in the Linux/Unix world, and once you understand it, you'll wonder how you ever lived without it.</p>

      <h2>What is a Cron Job?</h2>
      <p>A <strong>cron job</strong> is a scheduled task that runs automatically at specified times or intervals on Unix-based systems (Linux, macOS). The word "cron" comes from the Greek word <em>chronos</em>, meaning time. The cron daemon (<code>crond</code>) runs in the background and checks every minute if there's a job to execute.</p>
      <p>You define cron jobs in a file called the <strong>crontab</strong> (cron table). Each line in the crontab represents one scheduled task.</p>

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
      <pre><code>0 3 * * * pg_dump mydb > /backups/mydb_$(date +\\%Y\\%m\\%d).sql 2>&1</code></pre>
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
    `,
    author: 'Coder Secret',
    date: '2026-04-03',
    readTime: '12 min read',
    tags: ['Linux', 'DevOps', 'Cron', 'Automation', 'Tutorial'],
    coverImage: '',
  },
  {
    id: '4',
    title: 'DRF API Logger: Effortless API Logging for Django REST Framework',
    slug: 'drf-api-logger-django-rest-framework',
    excerpt: 'Discover how DRF API Logger makes it dead simple to capture, monitor, and analyze every API call in your Django REST Framework application — with zero impact on response times.',
    content: `
      <p>If you've ever found yourself digging through server logs trying to figure out why an API call failed, or wishing you had a dashboard showing your API's health at a glance, <strong>DRF API Logger</strong> is the tool you've been looking for. It's an open-source Django package that automatically logs every API request and response in your Django REST Framework project — with minimal setup and zero performance overhead.</p>

      <h2>What is DRF API Logger?</h2>
      <p>DRF API Logger is a middleware-based logging solution for Django REST Framework. Once installed, it silently captures detailed information about every API call — the URL, HTTP method, request headers, request body, response status code, response body, execution time, and client IP address. All of this happens in the background using a non-blocking queue, so your API response times remain completely unaffected.</p>
      <p>The project has earned <strong>335+ stars</strong> on GitHub and is actively maintained under the <strong>Apache 2.0 license</strong>. It supports Python 3.6+, Django 3.2+, and DRF 3.12+.</p>

      <h2>Getting Started in 3 Steps</h2>
      <p>Setting up DRF API Logger couldn't be simpler:</p>
      <p><strong>Step 1:</strong> Install the package:</p>
      <pre><code>pip install drf-api-logger</code></pre>

      <p><strong>Step 2:</strong> Add it to your Django settings:</p>
      <pre><code>INSTALLED_APPS = [
    ...
    'drf_api_logger',
]

MIDDLEWARE = [
    ...
    'drf_api_logger.middleware.api_logger_middleware.APILoggerMiddleware',
]</code></pre>

      <p><strong>Step 3:</strong> Enable database logging and run migrations:</p>
      <pre><code>DRF_API_LOGGER_DATABASE = True</code></pre>
      <pre><code>python manage.py migrate</code></pre>
      <p>That's it. Every API call is now being logged automatically.</p>

      <h2>Two Ways to Log: Database &amp; Signals</h2>
      <p>DRF API Logger gives you two powerful logging mechanisms that can be used independently or together:</p>
      <p><strong>Database Logging</strong> stores every API call in your Django database. It comes with a beautiful admin dashboard featuring charts, analytics, advanced search across request/response data, and filtering by date, status code, HTTP method, and performance metrics. This is perfect for debugging, auditing, and monitoring.</p>
      <p><strong>Signal-Based Logging</strong> fires a custom Django signal for every API call, letting you build custom handlers. Want to send logs to Elasticsearch? Push slow API alerts to Slack? Write to a custom file format? Signals make it possible without touching the core library.</p>

      <h2>Powerful Configuration Options</h2>
      <p>DRF API Logger is highly configurable. Here are some of the most useful settings:</p>
      <ul>
        <li><strong>Sensitive Data Masking:</strong> Automatically masks fields like passwords, tokens, and secrets in your logs — no sensitive data leaks.</li>
        <li><strong>Selective Logging:</strong> Filter which APIs get logged by namespace, URL name, HTTP method, or response status code.</li>
        <li><strong>Slow API Detection:</strong> Set a threshold (e.g., 200ms) and the logger will flag any API call that exceeds it — great for performance monitoring.</li>
        <li><strong>Request Tracing:</strong> Automatically generates or extracts trace UUIDs for distributed tracing across microservices.</li>
        <li><strong>Response Size Limits:</strong> Cap the size of logged response bodies to keep your database lean.</li>
        <li><strong>Queue Tuning:</strong> Configure the background queue size and flush interval to match your traffic patterns.</li>
      </ul>

      <h2>Querying Logs Programmatically</h2>
      <p>When database logging is enabled, you can query your API logs using Django's ORM just like any other model:</p>
      <pre><code>from drf_api_logger.models import APILogsModel

# Find all failed API calls in the last 24 hours
from django.utils import timezone
from datetime import timedelta

recent_errors = APILogsModel.objects.filter(
    status_code__gte=400,
    added_on__gte=timezone.now() - timedelta(hours=24)
)

# Find the slowest endpoints
slow_apis = APILogsModel.objects.filter(
    execution_time__gte=200
).order_by('-execution_time')[:10]

# Count calls by HTTP method
from django.db.models import Count
method_stats = APILogsModel.objects.values('method').annotate(
    count=Count('id')
)</code></pre>

      <h2>Production Best Practices</h2>
      <p>For high-traffic production environments, the DRF API Logger documentation recommends several optimizations:</p>
      <ul>
        <li><strong>Dedicated Logging Database:</strong> Route API logs to a separate database to avoid impacting your main application's performance.</li>
        <li><strong>Database Indexes:</strong> Add indexes on frequently queried fields like <code>status_code</code>, <code>method</code>, and <code>added_on</code>.</li>
        <li><strong>Data Archival:</strong> Implement a strategy to archive or purge old logs — your database will thank you.</li>
        <li><strong>Queue Optimization:</strong> Tune the queue size and interval based on your traffic volume to balance memory usage and write frequency.</li>
      </ul>

      <h2>Why You Should Use It</h2>
      <p>Whether you're debugging a tricky API issue in development, monitoring production health, or building an audit trail for compliance, DRF API Logger has you covered. It's lightweight, non-intrusive, and incredibly easy to set up. The combination of database logging with a built-in admin dashboard and signal-based extensibility makes it one of the most complete API logging solutions in the Django ecosystem.</p>
      <p>Check out the project on <a href="https://github.com/vishalanandl177/DRF-API-Logger" target="_blank" rel="noopener noreferrer">GitHub</a> and give it a star if you find it useful!</p>
    `,
    author: 'Coder Secret',
    date: '2026-04-03',
    readTime: '8 min read',
    tags: ['Django', 'Python', 'DRF', 'API Logging', 'Open Source'],
    coverImage: '',
  },
  {
    id: '1',
    title: 'Getting Started with Angular and Spartan UI',
    slug: 'getting-started-angular-spartan-ui',
    excerpt: 'Learn how to set up a modern Angular project with Spartan UI, the shadcn/ui-inspired component library for Angular.',
    content: `
      <p>Spartan UI brings the popular shadcn/ui approach to Angular. Instead of installing a traditional component library, you get unstyled, accessible primitives that you style with Tailwind CSS.</p>
      <h2>Why Spartan UI?</h2>
      <p>Traditional component libraries come with opinionated styles that are hard to customize. Spartan UI takes a different approach — it provides headless components (called "brain") that handle all the accessibility and behavior, while you control the styling through Tailwind CSS classes (called "helm").</p>
      <h2>Setting Up</h2>
      <p>First, create a new Angular project and install the required packages. You'll need <code>@spartan-ng/brain</code> for the headless primitives and Tailwind CSS for styling.</p>
      <p>The beauty of this approach is that every component is fully customizable. You own the code, you own the styles, and you can modify anything without fighting against a library's design decisions.</p>
    `,
    author: 'Coder Secret',
    date: '2026-04-01',
    readTime: '5 min read',
    tags: ['Angular', 'Spartan UI', 'Tutorial'],
    coverImage: '',
  },
  {
    id: '2',
    title: 'Tailwind CSS v4: What\'s New for Angular Developers',
    slug: 'tailwind-css-v4-angular',
    excerpt: 'Explore the latest features in Tailwind CSS v4 and how they improve the Angular development experience.',
    content: `
      <p>Tailwind CSS v4 introduces a brand-new engine built from the ground up with performance and developer experience in mind.</p>
      <h2>CSS-First Configuration</h2>
      <p>Gone is the <code>tailwind.config.js</code> file. In v4, everything is configured directly in CSS using <code>@theme</code> directives. This means faster builds and a more intuitive setup.</p>
      <h2>Automatic Content Detection</h2>
      <p>Tailwind v4 automatically detects your content files — no more configuring content paths manually. It just works.</p>
      <h2>New @theme Directive</h2>
      <p>The new <code>@theme</code> directive replaces the old config file approach, allowing you to define your design tokens right in CSS where they belong.</p>
    `,
    author: 'Coder Secret',
    date: '2026-03-28',
    readTime: '4 min read',
    tags: ['Tailwind CSS', 'Angular', 'CSS'],
    coverImage: '',
  },
  {
    id: '3',
    title: 'Building Accessible Components in Angular',
    slug: 'accessible-components-angular',
    excerpt: 'A deep dive into creating fully accessible UI components using Angular and the WAI-ARIA specification.',
    content: `
      <p>Web accessibility is not optional — it's a fundamental requirement for building inclusive web applications. In this post, we'll explore how to build accessible components in Angular.</p>
      <h2>Understanding ARIA</h2>
      <p>WAI-ARIA (Web Accessibility Initiative – Accessible Rich Internet Applications) provides attributes that define ways to make web content more accessible to people with disabilities.</p>
      <h2>Keyboard Navigation</h2>
      <p>Every interactive element must be keyboard accessible. This means proper focus management, keyboard shortcuts, and logical tab order throughout your application.</p>
      <h2>Using Spartan Brain</h2>
      <p>Spartan UI's brain primitives handle accessibility out of the box. They manage ARIA attributes, keyboard interactions, and focus trapping so you don't have to implement these patterns manually.</p>
    `,
    author: 'Coder Secret',
    date: '2026-03-25',
    readTime: '6 min read',
    tags: ['Accessibility', 'Angular', 'Best Practices'],
    coverImage: '',
  },
];
