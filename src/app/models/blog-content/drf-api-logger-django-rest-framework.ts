export const CONTENT = `
      <p>If you've ever found yourself digging through server logs trying to figure out why an API call failed, or wishing you had a dashboard showing your API's health at a glance, <strong>DRF API Logger</strong> is the tool you've been looking for. It's an open-source Django package that automatically logs every API request and response in your Django REST Framework project — with minimal setup and zero performance overhead.</p>

      <p>The current PyPI release (<strong>v1.1.21</strong>, September 2025) keeps the project active with Python 3.13 classifiers, Apache 2.0 licensing, database logging, signal-based logging, sensitive-data masking, queue controls, and admin analytics.</p>

      <!-- DRF Logger Pipeline -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">DRF API Logger &#x2014; How It Works</div>
        <div class="pipeline">
          <div class="pipeline-step" style="background:#3b82f6;--i:0"><span class="pipeline-step-icon">&#x1F4E8;</span>Request<span class="pipeline-step-sub">Client sends API call</span></div>
          <div class="pipeline-arrow">&#x2192;</div>
          <div class="pipeline-step" style="background:#7c3aed;--i:1"><span class="pipeline-step-icon">&#x1F50D;</span>Middleware<span class="pipeline-step-sub">Captures + queues</span></div>
          <div class="pipeline-arrow">&#x2192;</div>
          <div class="pipeline-step" style="background:#22c55e;--i:2"><span class="pipeline-step-icon">&#x2699;</span>DRF View<span class="pipeline-step-sub">Processes normally</span></div>
          <div class="pipeline-arrow">&#x2192;</div>
          <div class="pipeline-step" style="background:#7c3aed;--i:3"><span class="pipeline-step-icon">&#x1F4DD;</span>Log<span class="pipeline-step-sub">Queue (non-blocking)</span></div>
          <div class="pipeline-arrow">&#x2192;</div>
          <div class="pipeline-step" style="background:#f97316;--i:4"><span class="pipeline-step-icon">&#x1F4E4;</span>Response<span class="pipeline-step-sub">Sent to client</span></div>
        </div>
      </div>

      <!-- Logging Destinations -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">Two Logging Paths</div>
        <div class="vs-cards" style="grid-template-columns:1fr 1fr">
          <div class="vs-card" style="border-color:#3b82f6">
            <div class="vs-card-header" style="background:#3b82f6">&#x1F4BE; Database Logging</div>
            <div class="vs-card-body">
              <div class="vs-row"><span class="vs-row-icon">&#x1F4CA;</span>Admin dashboard with charts</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F50E;</span>Search across request/response</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F4C5;</span>Filter by date, status, method</div>
              <div class="vs-row"><span class="vs-row-icon">&#x26A1;</span>Slow API detection</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F4E5;</span>CSV export for offline analysis</div>
            </div>
          </div>
          <div class="vs-card" style="border-color:#22c55e">
            <div class="vs-card-header" style="background:#22c55e">&#x1F4E1; Signal-Based Logging</div>
            <div class="vs-card-body">
              <div class="vs-row"><span class="vs-row-icon">&#x1F4E8;</span>Send to Elasticsearch / Datadog</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F514;</span>Slack alerts for slow APIs</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F4C1;</span>Custom file format output</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F527;</span>Build any custom handler</div>
            </div>
          </div>
        </div>
      </div>

      <h2>What is DRF API Logger?</h2>
      <p>DRF API Logger is a middleware-based logging solution for Django REST Framework. Once installed, it silently captures detailed information about every API call — the URL, HTTP method, request headers, request body, response status code, response body, execution time, and client IP address. All of this happens in the background using a non-blocking queue, so your API response times remain completely unaffected.</p>
      <p>The project has hundreds of GitHub stars and a long release history, and the current PyPI package is published under the <strong>Apache 2.0 license</strong>. It supports modern Python and Django REST Framework projects, including Python 3.13 classifiers in the latest release.</p>

      <h2>Current Stable Capabilities</h2>
      <p>The stable package focuses on practical API observability for Django REST Framework projects:</p>
      <ul>
        <li><strong>Request and Response Logging:</strong> Capture API path, method, headers, body, status code, response body, execution time, and client IP.</li>
        <li><strong>Database or Signal Logging:</strong> Store logs in Django models, emit signals to external systems, or use both paths together.</li>
        <li><strong>Sensitive Data Masking:</strong> Hide passwords, tokens, and other configured keys before logs are persisted.</li>
        <li><strong>Slow API Detection:</strong> Use the slow-API threshold to filter requests that exceed your latency budget.</li>
      </ul>

      <pre><code># Mark APIs slower than 200 ms as slow in the admin filters
DRF_API_LOGGER_SLOW_API_ABOVE = 200</code></pre>

      <h2>Recent Release Highlights</h2>
      <ul>
        <li><strong>v1.1.16:</strong> Support for <code>application/vnd.*+json</code> media types (JSON:API, FHIR, etc.) and automatic skipping of static/media file requests.</li>
        <li><strong>v1.1.15:</strong> Enhanced data masking for lists of dictionaries (e.g., batch request payloads). Body size limits now properly enforced.</li>
        <li><strong>v1.1.14:</strong> Tracing ID priority — checks the incoming header first, only generates a UUID if none present. Works seamlessly with API gateways.</li>
        <li><strong>v1.1.12:</strong> GZIP response decompression for logging compressed API responses. URL parameter exclusion from logs. Localized static files for air-gapped deployments.</li>
        <li><strong>v1.1.10:</strong> CSV export of API logs from the admin dashboard — export filtered logs for offline analysis, reporting, or compliance audits.</li>
      </ul>

      <h2>Getting Started in 4 Steps</h2>
      <p><strong>Step 1:</strong> Install the package:</p>
      <pre><code>pip install drf-api-logger</code></pre>

      <p><strong>Step 2:</strong> Add to INSTALLED_APPS:</p>
      <pre><code>INSTALLED_APPS = [
    ...
    'drf_api_logger',
]</code></pre>

      <p><strong>Step 3:</strong> Add the middleware:</p>
      <pre><code>MIDDLEWARE = [
    ...
    'drf_api_logger.middleware.api_logger_middleware.APILoggerMiddleware',
]</code></pre>

      <p><strong>Step 4:</strong> Enable database logging and run migrations:</p>
      <pre><code>DRF_API_LOGGER_DATABASE = True</code></pre>
      <pre><code>python manage.py migrate</code></pre>
      <p>That's it. Every API call is now being logged automatically.</p>

      <h2>Two Ways to Log: Database &amp; Signals</h2>
      <p><strong>Database Logging</strong> stores every API call in your Django database. It comes with an admin dashboard featuring charts, analytics, advanced search, filtering, slow API detection, and CSV export.</p>
      <p>Here's what the built-in analytics dashboard looks like:</p>
      <img src="/images/drf-api-logger/01-admin-dashboard.png" alt="DRF API Logger admin dashboard with API analytics charts" style="width:100%;border-radius:0.5rem;border:1px solid var(--border);margin:1rem 0;" />
      <p>The log listing view gives you a detailed table of every API call with status codes, methods, execution times, and request metadata:</p>
      <img src="/images/drf-api-logger/02-api-logs-list.png" alt="DRF API Logger list view showing API call logs with status codes, methods, and execution times" style="width:100%;border-radius:0.5rem;border:1px solid var(--border);margin:1rem 0;" />
      <p>Click into any log entry to see the full request, response, and timing details. Here is a slow API request being flagged:</p>
      <img src="/images/drf-api-logger/03-api-log-detail-slow-sql.png" alt="DRF API Logger detail view showing slow SQL query detection with execution time breakdown" style="width:100%;border-radius:0.5rem;border:1px solid var(--border);margin:1rem 0;" />
      <p>Sensitive data like passwords and tokens are automatically masked in the logs:</p>
      <img src="/images/drf-api-logger/04-api-log-detail-login-masked.png" alt="DRF API Logger detail view showing automatic masking of password and token fields" style="width:100%;border-radius:0.5rem;border:1px solid var(--border);margin:1rem 0;" />
      <p>Detailed request views make it easier to spot repeated slow endpoints, oversized payloads, and error patterns before users report them:</p>
      <img src="/images/drf-api-logger/05-api-log-detail-n-plus-one.png" alt="DRF API Logger detail view showing API timing and diagnostic information" style="width:100%;border-radius:0.5rem;border:1px solid var(--border);margin:1rem 0;" />

      <p><strong>Signal-Based Logging</strong> fires a custom Django signal for every API call, letting you build custom handlers — Elasticsearch, Datadog, Kafka, Slack alerts, flat files, anything.</p>
      <pre><code>from drf_api_logger import API_LOGGER_SIGNAL

def ship_to_elk(**kwargs):
    elk.send({
        'url': kwargs['api'],
        'method': kwargs['method'],
        'status': kwargs['status_code'],
        'took_ms': kwargs['execution_time'],
        'tracing_id': kwargs.get('tracing_id'),
    })

API_LOGGER_SIGNAL.listen += ship_to_elk</code></pre>

      <h2>Full Configuration Reference</h2>
      <pre><code># ── Core ──────────────────────────────
DRF_API_LOGGER_DATABASE = True
DRF_API_LOGGER_SIGNAL = True

# ── Performance Tuning ───────────────
DRF_LOGGER_QUEUE_MAX_SIZE = 50
DRF_LOGGER_INTERVAL = 10
DRF_API_LOGGER_SLOW_API_ABOVE = 200

# ── Selective Logging ────────────────
DRF_API_LOGGER_SKIP_NAMESPACE = ['admin', 'internal']
DRF_API_LOGGER_SKIP_URL_NAME = ['health-check', 'metrics']
DRF_API_LOGGER_METHODS = ['GET', 'POST', 'PUT', 'DELETE']
DRF_API_LOGGER_STATUS_CODES = [200, 201, 400, 401, 403, 404, 500]

# ── Content Types ────────────────────
DRF_API_LOGGER_CONTENT_TYPES = [
    'application/json',
    'application/vnd.api+json',    # JSON:API
    'application/xml',
]

# ── Security ─────────────────────────
DRF_API_LOGGER_EXCLUDE_KEYS = ['password', 'token', 'access', 'refresh', 'secret']
DRF_API_LOGGER_MAX_REQUEST_BODY_SIZE = 1024
DRF_API_LOGGER_MAX_RESPONSE_BODY_SIZE = 2048

# ── Tracing ──────────────────────────
DRF_API_LOGGER_ENABLE_TRACING = True
DRF_API_LOGGER_TRACING_ID_HEADER_NAME = 'X-Trace-ID'
DRF_API_LOGGER_TRACING_FUNC = 'myapp.utils.generate_trace_id'

# ── Storage ──────────────────────────
DRF_API_LOGGER_DEFAULT_DATABASE = 'logging_db'
DRF_API_LOGGER_PATH_TYPE = 'ABSOLUTE'
DRF_API_LOGGER_TIMEDELTA = 330  # IST offset in minutes</code></pre>

      <h2>Querying Logs Programmatically</h2>
      <p>When database logging is enabled, you can query your API logs using Django's ORM just like any other model:</p>
      <pre><code>from drf_api_logger.models import APILogsModel
from django.utils import timezone
from datetime import timedelta
from django.db.models import Count

# Find all failed API calls in the last 24 hours
recent_errors = APILogsModel.objects.filter(
    status_code__gte=400,
    added_on__gte=timezone.now() - timedelta(hours=24)
)

# Find the slowest endpoints
slow_apis = APILogsModel.objects.filter(
    execution_time__gte=200
).order_by('-execution_time')[:10]

# Most popular endpoints
popular = APILogsModel.objects.values('api').annotate(
    count=Count('id')
).order_by('-count')[:10]

# Archive old logs (keep 30 days)
old_logs = APILogsModel.objects.filter(
    added_on__lt=timezone.now() - timedelta(days=30)
)
old_logs.delete()</code></pre>

      <h2>Production Best Practices</h2>
      <ul>
        <li><strong>Dedicated Logging Database:</strong> Route API logs to a separate database to avoid impacting your main application's performance.</li>
        <li><strong>Database Indexes:</strong> Add indexes on <code>added_on</code>, <code>api</code>, and <code>method</code> columns for fast queries.</li>
        <li><strong>Data Archival:</strong> Delete or archive logs older than 30-90 days — your database will thank you.</li>
        <li><strong>Queue Optimization:</strong> Increase <code>DRF_LOGGER_QUEUE_MAX_SIZE</code> for high-traffic apps to reduce DB write frequency.</li>
        <li><strong>Body Size Limits:</strong> Set <code>MAX_REQUEST_BODY_SIZE</code> and <code>MAX_RESPONSE_BODY_SIZE</code> to prevent one giant payload from bloating your logs.</li>
        <li><strong>Mask Everything Sensitive:</strong> Extend <code>EXCLUDE_KEYS</code> with your app-specific fields (API keys, SSNs, card numbers).</li>
        <li><strong>Enable Profiling Selectively:</strong> Use <code>PROFILING_SQL_TRACKING</code> in staging/development. Disable in production if overhead is a concern.</li>
      </ul>

      <h2>Why You Should Use It</h2>
      <p>Whether you're debugging a tricky API issue in development, monitoring production health, exporting logs for compliance audits, or building an audit trail — DRF API Logger has you covered. It's lightweight, non-intrusive, and easy to set up. The combination of database logging, built-in admin analytics, CSV export, and signal-based extensibility makes it a practical API logging option for Django REST Framework teams.</p>
      <p>Check out the project on <a href="https://github.com/vishalanandl177/DRF-API-Logger" target="_blank" rel="noopener noreferrer">GitHub</a> and give it a star if you find it useful!</p>
    `;
