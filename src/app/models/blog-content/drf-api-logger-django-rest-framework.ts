export const CONTENT = `
      <p>If you run APIs in Django REST Framework, you eventually need answers that normal application logs do not give you quickly: which endpoint failed, what payload arrived, what status code was returned, how long the request took, whether sensitive data was masked, and whether the same endpoint is getting slower over time. <strong>DRF API Logger</strong> fills that gap. It adds request and response observability without forcing every view to write custom logging code. The <a href="/blog/observability-opentelemetry-logs-metrics-traces">OpenTelemetry observability guide</a> shows how these API records complement service-level logs, metrics, and traces.</p>

      <p>This guide covers <strong>DRF API Logger 1.4.0</strong>, released on <strong>July 8, 2026</strong>. The supported baseline is <strong>Python 3.10+</strong>, <strong>Django 4.2+</strong>, and <strong>Django REST Framework 3.16+</strong>; the package uses the <strong>Apache-2.0</strong> license. DRF API Logger is <a href="https://www.django-rest-framework.org/community/third-party-packages/" target="_blank" rel="noopener noreferrer">listed in Django REST Framework's official third-party packages documentation</a>. That listing is useful independent evidence of discoverability, but it does not mean the package is endorsed, certified, or maintained by the DRF project.</p>

      <p><strong>Maintainer disclosure:</strong> I am Vishal Anand, the creator and maintainer of DRF API Logger and the author of this guide. The walkthrough is maintainer-led, while version, compatibility, release, and listing claims link to sources you can verify directly.</p>

      <!-- DRF Logger Pipeline -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">DRF API Logger Request Lifecycle</div>
        <div class="pipeline">
          <div class="pipeline-step" style="background:#3b82f6;--i:0"><span class="pipeline-step-icon">&#x1F4E8;</span>Client<span class="pipeline-step-sub">Calls DRF endpoint</span></div>
          <div class="pipeline-arrow">&#x2192;</div>
          <div class="pipeline-step" style="background:#7c3aed;--i:1"><span class="pipeline-step-icon">&#x1F50D;</span>Middleware<span class="pipeline-step-sub">Captures and masks</span></div>
          <div class="pipeline-arrow">&#x2192;</div>
          <div class="pipeline-step" style="background:#22c55e;--i:2"><span class="pipeline-step-icon">&#x2699;</span>View<span class="pipeline-step-sub">Runs normally</span></div>
          <div class="pipeline-arrow">&#x2192;</div>
          <div class="pipeline-step" style="background:#f97316;--i:3"><span class="pipeline-step-icon">&#x23F1;</span>Profiler<span class="pipeline-step-sub">Measures timing</span></div>
          <div class="pipeline-arrow">&#x2192;</div>
          <div class="pipeline-step" style="background:#0ea5e9;--i:4"><span class="pipeline-step-icon">&#x1F4DD;</span>Queue<span class="pipeline-step-sub">Batches database writes</span></div>
          <div class="pipeline-arrow">&#x2192;</div>
          <div class="pipeline-step" style="background:#ef4444;--i:5"><span class="pipeline-step-icon">&#x1F4E4;</span>Response<span class="pipeline-step-sub">Returned to client</span></div>
        </div>
      </div>

      <h2>What DRF API Logger Actually Solves</h2>
      <p>Most Django projects already have server logs, access logs, exception logs, and maybe an APM tool. Those are useful, but they often fail at one very practical workflow: reconstructing a specific API call. DRF API Logger stores the API path, HTTP method, headers, body, response body, status code, execution time, client IP address, timestamp, and optional tracing ID in a structured way.</p>
      <p>This makes it useful for four common engineering jobs:</p>
      <ul>
        <li><strong>Debugging:</strong> Reproduce what happened when a client says "the API returned the wrong thing".</li>
        <li><strong>Operational monitoring:</strong> Find slow endpoints, failed status codes, noisy clients, and regression patterns.</li>
        <li><strong>Operational evidence:</strong> Keep structured request records for investigations, while using a separate immutable audit system when one is required.</li>
        <li><strong>Performance diagnosis:</strong> Use profiling fields to split total time into middleware, view/serialization, SQL, and business-logic cost.</li>
      </ul>

      <h2>Where It Fits in a Django REST Framework App</h2>
      <p>DRF API Logger is installed as Django middleware. That matters because middleware sees the request before the DRF view executes and sees the response after the view returns. The logger can therefore capture both sides of the call without changing every view, serializer, or viewset.</p>
      <p>A simplified request lifecycle looks like this:</p>
      <ol>
        <li>The client sends a request to a DRF endpoint.</li>
        <li>The logger middleware records request metadata such as path, method, headers, body, and client IP.</li>
        <li>The DRF view runs normally. Authentication, permissions, throttling, serializer validation, database work, and response generation continue as usual.</li>
        <li>The middleware receives the response and records status code, response body, and execution time.</li>
        <li>An eligible log event is sent to the configured destination: database, signal listeners, or both.</li>
        <li>Capture, masking, serialization, custom handling, and enqueueing still happen on the request path. The background worker batches database writes so the request thread does not perform one insert per log record.</li>
      </ol>

      <div class="flow-diagram">
        <div class="flow-diagram-title">Two Logging Destinations</div>
        <div class="vs-cards" style="grid-template-columns:1fr 1fr">
          <div class="vs-card" style="border-color:#3b82f6">
            <div class="vs-card-header" style="background:#3b82f6">&#x1F4BE; Database Logging</div>
            <div class="vs-card-body">
              <div class="vs-row"><span class="vs-row-icon">&#x1F4CA;</span>Django admin dashboard</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F50E;</span>Search request, response, headers, URL</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F4C5;</span>Filter by date, status, method, speed</div>
              <div class="vs-row"><span class="vs-row-icon">&#x23F1;</span>Slow API detection</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F4E5;</span>CSV export for offline analysis</div>
            </div>
          </div>
          <div class="vs-card" style="border-color:#22c55e">
            <div class="vs-card-header" style="background:#22c55e">&#x1F4E1; Signal-Based Logging</div>
            <div class="vs-card-body">
              <div class="vs-row"><span class="vs-row-icon">&#x1F4E8;</span>Send logs to external systems</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F514;</span>Alert on slow or failing APIs</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F4C1;</span>Write custom files or JSONL streams</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F527;</span>Build domain-specific handlers</div>
            </div>
          </div>
        </div>
      </div>

      <h2>When to Use It</h2>
      <p>Use DRF API Logger when you need structured visibility into DRF request and response behavior, especially when the API team needs to answer production questions without digging through unstructured logs. It is useful for CRUD APIs, internal admin APIs, B2B APIs, mobile app backends, partner integrations, and services where request payloads and status-code patterns matter.</p>
      <p>Do not treat it as an immutable audit log, a compliance guarantee, a WAF, SIEM, IDS, APM, or distributed tracing backend. It complements those systems. Metrics tell you that error rate increased. Tracing tells you which service path was slow. DRF API Logger gives you the concrete DRF request/response record inside your Django app.</p>

      <h2>Install and Wire It Correctly</h2>
      <p><strong>Step 1:</strong> Install the package:</p>
      <pre><code>pip install drf-api-logger</code></pre>

      <p><strong>Step 2:</strong> Add it to <code>INSTALLED_APPS</code>:</p>
      <pre><code>INSTALLED_APPS = [
    # Django apps
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # Third-party apps
    'rest_framework',
    'drf_api_logger',
]</code></pre>

      <p><strong>Step 3:</strong> Add the middleware:</p>
      <pre><code>MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',

    'drf_api_logger.middleware.api_logger_middleware.APILoggerMiddleware',
]</code></pre>

      <p>Middleware order depends on what you want captured. In most projects, putting it after Django's common authentication/session middleware is a sensible default because the logger sees normalized Django requests and can still capture the response after DRF finishes.</p>

      <p><strong>Step 4:</strong> Enable database logging and migrate:</p>
      <pre><code>DRF_API_LOGGER_DATABASE = True</code></pre>
      <pre><code>python manage.py migrate</code></pre>
      <p>The database table is only useful after migrations are run. If you enable database logging but skip migrations, you should expect missing-table errors or no usable admin records.</p>
      <p><strong>MySQL and MariaDB upgrade warning:</strong> migration <code>0003</code> adds profiling columns. Adding columns to a large existing log table can lock or rebuild it depending on the exact database version, engine, row format, and table definition. Inspect the generated SQL first with <code>python manage.py sqlmigrate drf_api_logger 0003</code>, test the operation against production-like data, and use database-native online DDL or a reviewed online migration process where appropriate. Do not copy a generic <code>ALTER TABLE</code> command without validating it.</p>

      <h2>Database Logging Deep Dive</h2>
      <p>Database logging stores API calls in a Django model and exposes them through the Django admin. This is the easiest mode to start with because it gives your team an immediate UI for searching, filtering, and inspecting API traffic.</p>
      <p>The built-in admin dashboard gives you charts and high-level API activity:</p>
      <picture><source type="image/webp" srcset="/images/drf-api-logger/01-admin-dashboard-960.webp 960w, /images/drf-api-logger/01-admin-dashboard-1440.webp 1440w" sizes="(min-width: 960px) 840px, calc(100vw - 4rem)" /><img src="/images/drf-api-logger/01-admin-dashboard.png" alt="DRF API Logger admin dashboard with API analytics charts" width="2880" height="1800" loading="lazy" decoding="async" style="width:100%;border-radius:0.5rem;border:1px solid var(--border);margin:1rem 0;" /></picture>
      <p>The log listing view gives you a table of API calls with status codes, methods, timings, and request metadata:</p>
      <picture><source type="image/webp" srcset="/images/drf-api-logger/02-api-logs-list-960.webp 960w, /images/drf-api-logger/02-api-logs-list-1440.webp 1440w" sizes="(min-width: 960px) 840px, calc(100vw - 4rem)" /><img src="/images/drf-api-logger/02-api-logs-list.png" alt="DRF API Logger list view showing API call logs with status codes, methods, and execution times" width="2880" height="4478" loading="lazy" decoding="async" style="width:100%;border-radius:0.5rem;border:1px solid var(--border);margin:1rem 0;" /></picture>
      <p>Clicking into a log entry gives you detailed request and response information, including timing and diagnostics:</p>
      <picture><source type="image/webp" srcset="/images/drf-api-logger/03-api-log-detail-slow-sql-960.webp 960w, /images/drf-api-logger/03-api-log-detail-slow-sql-1440.webp 1440w" sizes="(min-width: 960px) 840px, calc(100vw - 4rem)" /><img src="/images/drf-api-logger/03-api-log-detail-slow-sql.png" alt="DRF API Logger detail view showing slow SQL query detection with execution time breakdown" width="2880" height="3180" loading="lazy" decoding="async" style="width:100%;border-radius:0.5rem;border:1px solid var(--border);margin:1rem 0;" /></picture>
      <p>Sensitive values can be masked before storage, so fields like passwords and tokens do not appear as raw values:</p>
      <picture><source type="image/webp" srcset="/images/drf-api-logger/04-api-log-detail-login-masked-960.webp 960w, /images/drf-api-logger/04-api-log-detail-login-masked-1440.webp 1440w" sizes="(min-width: 960px) 840px, calc(100vw - 4rem)" /><img src="/images/drf-api-logger/04-api-log-detail-login-masked.png" alt="DRF API Logger detail view showing automatic masking of password and token fields" width="2880" height="3182" loading="lazy" decoding="async" style="width:100%;border-radius:0.5rem;border:1px solid var(--border);margin:1rem 0;" /></picture>
      <p>Profiling views make slow endpoints easier to reason about because the problem is split into query count, SQL time, middleware time, and application time:</p>
      <picture><source type="image/webp" srcset="/images/drf-api-logger/05-api-log-detail-n-plus-one-960.webp 960w, /images/drf-api-logger/05-api-log-detail-n-plus-one-1440.webp 1440w" sizes="(min-width: 960px) 840px, calc(100vw - 4rem)" /><img src="/images/drf-api-logger/05-api-log-detail-n-plus-one.png" alt="DRF API Logger detail view showing API timing and diagnostic information" width="2880" height="3316" loading="lazy" decoding="async" style="width:100%;border-radius:0.5rem;border:1px solid var(--border);margin:1rem 0;" /></picture>

      <h2>Model Fields You Should Understand</h2>
      <p>The core log model stores the operational fields you usually need during debugging:</p>
      <pre><code>class APILogsModel(models.Model):
    id = models.BigAutoField(primary_key=True)
    api = models.CharField(max_length=1024)
    headers = models.TextField()
    body = models.TextField()
    method = models.CharField(max_length=10, db_index=True)
    client_ip_address = models.CharField(max_length=50)
    response = models.TextField()
    status_code = models.PositiveSmallIntegerField(db_index=True)
    execution_time = models.DecimalField(decimal_places=5, max_digits=8)
    added_on = models.DateTimeField()

    # Present when API profiling is enabled
    profiling_data = models.TextField(null=True)
    sql_query_count = models.PositiveIntegerField(null=True)</code></pre>
      <p>The important operational detail is that <code>execution_time</code> is server-side execution time, not the user's complete network round trip. That makes it useful for backend diagnosis because it removes client network conditions from the number.</p>

      <h2>Signal-Based Logging Deep Dive</h2>
      <p>Signal-based logging is for teams that do not want eligible API records stored only in the application database. When enabled, DRF API Logger emits a signal for calls that pass its filters and endpoint policy. Your listeners can write JSON lines, ship events to a log pipeline, publish to Kafka, trigger an alert, or attach application-specific context.</p>
      <pre><code>DRF_API_LOGGER_SIGNAL = True</code></pre>
      <pre><code>from drf_api_logger import API_LOGGER_SIGNAL

def write_jsonl(**kwargs):
    import json
    with open('/var/log/myapp/api-logs.jsonl', 'a') as file_obj:
        file_obj.write(json.dumps(kwargs, default=str) + '\\n')

def alert_on_server_errors(**kwargs):
    if kwargs.get('status_code', 200) &gt;= 500:
        notify_ops_team(
            api=kwargs.get('api'),
            method=kwargs.get('method'),
            status=kwargs.get('status_code'),
            took=kwargs.get('execution_time'),
            trace=kwargs.get('tracing_id'),
        )

API_LOGGER_SIGNAL.listen += write_jsonl
API_LOGGER_SIGNAL.listen += alert_on_server_errors</code></pre>
      <p>You can also unsubscribe listeners when needed:</p>
      <pre><code>API_LOGGER_SIGNAL.listen -= write_jsonl</code></pre>

      <h2>What the Signal Payload Looks Like</h2>
      <p>The signal payload contains the same kind of data you need for external observability pipelines:</p>
      <pre><code>{
    'api': '/api/users/',
    'method': 'POST',
    'status_code': 201,
    'headers': '{"Content-Type": "application/json"}',
    'body': '{"username": "john", "password": "***FILTERED***"}',
    'response': '{"id": 1, "username": "john"}',
    'client_ip_address': '192.168.1.100',
    'execution_time': 0.142,
    'added_on': datetime.now(),
    'tracing_id': 'uuid4-string'
}</code></pre>
      <p>This makes signal mode useful when your main log storage is not Django admin. For example, you can keep a short retention window in the database for support and debugging and send a deliberately minimized event stream to a centralized log system for longer retention. The signal is an integration point, not a SIEM or exporter backend by itself.</p>

      <h2>Sampled API Profiling in v1.4</h2>
      <p>The most important modern capability to explain is API profiling. When profiling is enabled, each logged request can include a timing breakdown instead of only a single total duration. That lets you answer better questions:</p>
      <ul>
        <li>Was the request slow because of SQL?</li>
        <li>Was it slow because the serializer did too much work?</li>
        <li>Was middleware adding unexpected overhead?</li>
        <li>Did the endpoint run many queries and look like an N+1 problem?</li>
        <li>Was total time high even though SQL time was low, pointing to external calls or business logic?</li>
      </ul>

      <pre><code>DRF_API_LOGGER_ENABLE_PROFILING = True
DRF_API_LOGGER_PROFILING_SQL_TRACKING = True
DRF_API_LOGGER_PROFILING_SAMPLE_RATE = 0.10</code></pre>
      <p>When enabled, the profiling data can include middleware time, view and serialization time, SQL time, SQL query count, and diagnosis hints. <code>DRF_API_LOGGER_PROFILING_SAMPLE_RATE</code> accepts a fraction from <code>0.0</code> to <code>1.0</code>, so a busy service can profile a sample while still applying its normal logging rules. The package documentation describes patterns such as SQL taking more than 70 percent of total time with high query count as likely N+1 behavior, while low SQL time with high total time suggests business logic or external service latency. Treat diagnosis labels as investigation hints, not proof.</p>

      <div class="flow-diagram">
        <div class="flow-diagram-title">Profiling Diagnosis Map</div>
        <div class="layer-diagram">
          <div class="layer-item" style="background:#ef4444">SQL &gt; 70% + many queries<span class="layer-item-sub">Likely N+1 query pattern</span></div>
          <div class="layer-item" style="background:#f97316">SQL &gt; 70% + few queries<span class="layer-item-sub">Slow query or missing index</span></div>
          <div class="layer-item" style="background:#3b82f6">SQL &lt; 20% + high total time<span class="layer-item-sub">Business logic or external calls</span></div>
          <div class="layer-item" style="background:#7c3aed">Middleware &gt; 10% of total<span class="layer-item-sub">Middleware overhead deserves review</span></div>
        </div>
      </div>

      <h2>Configuration Reference by Use Case</h2>
      <p>A large config block is hard to reason about, so treat settings by the problem they solve.</p>

      <h3>Core Destination Settings</h3>
      <pre><code>DRF_API_LOGGER_DATABASE = True
DRF_API_LOGGER_SIGNAL = False</code></pre>
      <p>Use database mode for admin search and debugging. Use signal mode when your organization already has centralized logging. Use both when you want a short local debugging window plus a minimized external stream governed by its own access and retention controls.</p>

      <h3>Queue and Background Processing</h3>
      <pre><code>DRF_LOGGER_QUEUE_MAX_SIZE = 50
DRF_LOGGER_INTERVAL = 10</code></pre>
      <p>The queue controls how often logs are flushed. Larger queues reduce write frequency but can increase memory usage and delay visibility. Shorter intervals make logs visible faster but write more frequently. For high-traffic systems, tune both with real production traffic instead of guessing.</p>

      <h3>Selective Logging</h3>
      <pre><code>DRF_API_LOGGER_SKIP_NAMESPACE = ['admin', 'internal']
DRF_API_LOGGER_SKIP_URL_NAME = ['health-check', 'metrics']
DRF_API_LOGGER_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
DRF_API_LOGGER_STATUS_CODES = [200, 201, 400, 401, 403, 404, 500]</code></pre>
      <p>Selective logging is how you keep the signal-to-noise ratio healthy. Do not store health checks, metrics endpoints, noisy internal probes, or endpoints that generate data you are not allowed to retain.</p>

      <h3>Sensitive Data and Payload Limits</h3>
      <pre><code>DRF_API_LOGGER_EXCLUDE_KEYS = [
    'password',
    'token',
    'access',
    'refresh',
    'secret',
    'api_key',
    'authorization',
]

DRF_API_LOGGER_MAX_REQUEST_BODY_SIZE = 32768
DRF_API_LOGGER_MAX_RESPONSE_BODY_SIZE = 65536</code></pre>
      <p>Masking protects common secret fields. The default request cap is <strong>32,768 bytes (32 KiB)</strong> and the default response cap is <strong>65,536 bytes (64 KiB)</strong>. Oversized payloads are replaced with a marker rather than stored in full. A value of <code>-1</code> removes the corresponding limit; that is intentionally unlimited, so use it only after a storage and privacy review.</p>

      <h3>Supported Content Types</h3>
      <pre><code>DRF_API_LOGGER_CONTENT_TYPES = [
    'application/json',
    'application/vnd.api+json',
    'application/xml',
    'text/csv',
]</code></pre>
      <p>By default, JSON APIs are the primary use case. The package also supports custom content types, including vendor JSON media types such as JSON:API style content types.</p>

      <h3>Tracing IDs</h3>
      <pre><code>DRF_API_LOGGER_ENABLE_TRACING = True
DRF_API_LOGGER_TRACING_ID_HEADER_NAME = 'X-Trace-ID'
DRF_API_LOGGER_TRACING_FUNC = 'myapp.tracing.generate_trace_id'</code></pre>
      <p>Tracing IDs matter when an API request crosses systems. If your gateway already sends a trace header, configure the header name so DRF API Logger stores the upstream correlation ID instead of inventing an unrelated one. In your views, you can access <code>request.tracing_id</code> when tracing is enabled.</p>

      <h3>Request Correlation, W3C traceparent, and Logging Context</h3>
      <pre><code>DRF_API_LOGGER_ENABLE_CORRELATION = True
DRF_API_LOGGER_CORRELATION_REQUEST_ID_HEADERS = [
    'X-Request-ID',
    'X-Correlation-ID',
]
DRF_API_LOGGER_CORRELATION_TRACE_ID_HEADERS = [
    'traceparent',
    'X-Trace-ID',
]
DRF_API_LOGGER_ENABLE_LOGGING_CONTEXT = True</code></pre>
      <p>Correlation mode parses inbound request IDs and W3C <code>traceparent</code> values, exposes request-scoped context during the view call, and adds correlation plus low-cardinality route metadata to signal payloads. It intentionally does not add correlation columns or synthetic fields to <code>APILogsModel</code>. Keep trace IDs and request IDs in logs and traces, not as Prometheus labels.</p>

      <h3>Endpoint Policies and a Custom Handler</h3>
      <pre><code>DRF_API_LOGGER_POLICY = {
    'rules': [
        {'url_name': 'health_check', 'log': False},
        {
            'route': 'api/payments/',
            'request_body': False,
            'response_body': False,
            'mask_keys': ['card_number', 'payment_token'],
            'signal': False,
        },
    ],
}

DRF_API_LOGGER_CUSTOM_HANDLER = 'myapp.logging.clean_api_log'</code></pre>
      <p>Endpoint policies let a sensitive route disable logging, strip request or response bodies, add route-specific mask keys, or prevent signal export. A custom handler can transform a record before it enters the queue, or return <code>None</code> to drop it. Keep handlers fast and deterministic because they run on the request path.</p>

      <h2>ASGI, Observability Helpers, and First-Party Metrics</h2>
      <p>The 1.4 middleware supports Django's async middleware chain while remaining compatible with synchronous deployments. Request-scoped context is isolated across concurrent ASGI requests, but the same production rule still applies: benchmark capture, masking, profiling, and custom handlers under your workload.</p>

      <h3>Safe Prometheus, OpenTelemetry, and Sentry Helpers</h3>
      <pre><code>from drf_api_logger import API_LOGGER_SIGNAL
from drf_api_logger.observability import (
    annotate_opentelemetry_span,
    configure_sentry_scope,
    record_prometheus_metrics,
)

def export_observability(**event):
    record_prometheus_metrics(event, API_REQUESTS, API_DURATION)
    annotate_opentelemetry_span(current_span, event)
    configure_sentry_scope(sentry_scope, event)

API_LOGGER_SIGNAL.listen += export_observability</code></pre>
      <p>These helpers attach safe route and status context without turning DRF API Logger into Prometheus, OpenTelemetry, or Sentry. Your application still owns those dependencies, exporters, sampling, retention, and access controls. Metrics labels are allowlisted and low-cardinality; never use raw URLs, query strings, request IDs, trace IDs, user IDs, IP addresses, tokens, bodies, SQL text, or exception messages as labels.</p>

      <h3>Logger Health, API Metrics, and Detect-Only Security Signals</h3>
      <pre><code>pip install "drf-api-logger[prometheus]"

DRF_API_LOGGER_METRICS_ENABLED = True
DRF_API_LOGGER_METRICS_GROUPS = ['logger', 'pipeline']
DRF_API_LOGGER_API_METRICS_ENABLED = True

# Optional and disabled by default
DRF_API_LOGGER_SECURITY_METRICS_ENABLED = True
DRF_API_LOGGER_SECURITY_MODE = 'detect'</code></pre>
      <p>First-party metrics can report request-path overhead, queue depth, worker health, flushes, storage failures, API counts, duration, body sizes, slow requests, exceptions, and throttles. API metrics are enabled separately so an application that already instruments requests can avoid duplicates.</p>
      <p>Security signals are <strong>detect-only</strong> and disabled by default. They can flag patterns such as authentication failures, admin probes, route scans, suspicious payloads, enumeration hints, rate-limit pressure, or bulk export behavior. They do not block traffic and they are not a WAF, IDS, or SIEM. Expect false positives, validate alert thresholds, protect any Prometheus endpoint behind an internal authenticated route, and run <code>python manage.py check</code> after enabling metrics.</p>

      <h3>Path Storage Format</h3>
      <pre><code>DRF_API_LOGGER_PATH_TYPE = 'ABSOLUTE'
# Other options: FULL_PATH, RAW_URI</code></pre>
      <p><code>ABSOLUTE</code> stores the full absolute URI using Django's normal host validation. <code>FULL_PATH</code> stores only path and query string. <code>RAW_URI</code> can bypass normal host validation behavior, so use it only when you understand the security implications.</p>

      <h2>Querying Logs with the Django ORM</h2>
      <p>Once database logging is enabled, API logs become queryable with normal Django ORM patterns.</p>
      <pre><code>from datetime import timedelta
from django.db.models import Avg, Count, Max
from django.utils import timezone
from drf_api_logger.models import APILogsModel

since = timezone.now() - timedelta(hours=24)

# Recent failed API calls
errors = APILogsModel.objects.filter(
    added_on__gte=since,
    status_code__gte=400,
).order_by('-added_on')

# Slowest endpoints
slowest = APILogsModel.objects.filter(
    added_on__gte=since,
).order_by('-execution_time')[:20]

# Endpoint error rates
endpoint_summary = (
    APILogsModel.objects
    .filter(added_on__gte=since)
    .values('api', 'method')
    .annotate(
        calls=Count('id'),
        avg_seconds=Avg('execution_time'),
        max_seconds=Max('execution_time'),
    )
    .order_by('-calls')
)</code></pre>

      <p><code>execution_time</code> is stored in seconds, so the aggregate names above deliberately say <code>avg_seconds</code> and <code>max_seconds</code>. Multiply explicitly if your dashboard presents milliseconds; do not label the raw decimal as milliseconds.</p>

      <h2>Retention and Cleanup</h2>
      <p>API logs grow until you intentionally delete or archive them. Decide retention before enabling database logging in production. A short local window is often enough for support and debugging; any longer period should be justified by operational and privacy requirements rather than copied from an example.</p>
      <pre><code># Preview rows older than 30 days
python manage.py prune_api_logs --days 30 --dry-run

# Delete in bounded batches
python manage.py prune_api_logs --days 30 --batch-size 1000</code></pre>
      <p>Schedule the built-in <code>prune_api_logs</code> command through your normal job runner, monitor its results, and always use <code>--dry-run</code> before the first destructive execution. The command also supports a fixed <code>--before</code> date when policy requires a calendar cutoff.</p>

      <h2>Production Database Design</h2>
      <p>For small applications, storing logs in the default database may be acceptable. For high-traffic systems, use a dedicated logging database so API log writes and log searches do not compete with customer-facing transactional data. Apply the same workload-first reasoning from the <a href="/blog/database-indexing-secrets-slow-queries-fix">database indexing guide</a> before adding indexes to the log table.</p>
      <pre><code>DRF_API_LOGGER_DEFAULT_DATABASE = 'logs_db'</code></pre>
      <p>Then configure a Django database router or run migrations against the chosen database, depending on how your project handles multiple databases.</p>
      <p>Add indexes based on your real query patterns. Common examples:</p>
      <pre><code>CREATE INDEX idx_api_logs_added_on
ON drf_api_logs(added_on);

CREATE INDEX idx_api_logs_api_method
ON drf_api_logs(api, method);

CREATE INDEX idx_api_logs_status_added_on
ON drf_api_logs(status_code, added_on);</code></pre>

      <h2>Security and Privacy Checklist</h2>
      <p>API logging is powerful, but it can become a liability if you log the wrong data. Treat API logs as sensitive production data, and use the <a href="/cheatsheets/api-security">API security checklist</a> to review authentication, authorization, validation, rate limits, and audit controls around the endpoints.</p>
      <ul>
        <li><strong>Mask secrets:</strong> Add every credential-like key to <code>DRF_API_LOGGER_EXCLUDE_KEYS</code>.</li>
        <li><strong>Limit payload size:</strong> Use max request and response body settings before enabling production logging.</li>
        <li><strong>Skip sensitive endpoints:</strong> Do not log endpoints that process card data, tokens, secret exports, or regulated data unless you have a clear retention policy.</li>
        <li><strong>Restrict admin access:</strong> Only trusted operators should see request and response logs.</li>
        <li><strong>Set retention:</strong> Delete or archive old rows automatically.</li>
        <li><strong>Use a separate database:</strong> Keep logs away from the primary write path for busy systems.</li>
        <li><strong>Review compliance requirements:</strong> GDPR, HIPAA, PCI, SOC 2, and internal policies may restrict what you can store.</li>
      </ul>

      <h2>Troubleshooting: No Logs Showing Up</h2>
      <p>Start with the read-only production diagnostics command:</p>
      <pre><code>python manage.py drf_api_logger_doctor</code></pre>
      <p><code>drf_api_logger_doctor</code> checks the active logging mode, database and migration readiness, table availability, queue and worker state, payload limits, masking settings, and profiling risk. CI or deployment automation can also request JSON output or set a failure threshold; see the operations documentation for those options.</p>
      <p>If you installed the package but do not see logs, check these in order:</p>
      <ol>
        <li><strong>Middleware is missing:</strong> Confirm <code>APILoggerMiddleware</code> is in <code>MIDDLEWARE</code>.</li>
        <li><strong>Database logging is disabled:</strong> Set <code>DRF_API_LOGGER_DATABASE = True</code>.</li>
        <li><strong>Migrations were not run:</strong> Run <code>python manage.py migrate</code>.</li>
        <li><strong>Endpoint is skipped:</strong> Review skip namespace, skip URL name, method filters, and status-code filters.</li>
        <li><strong>Content type is not logged:</strong> Add your API media type to <code>DRF_API_LOGGER_CONTENT_TYPES</code>.</li>
        <li><strong>Admin endpoint confusion:</strong> Django admin panel requests are excluded from logging.</li>
        <li><strong>Wrong database:</strong> If using <code>DRF_API_LOGGER_DEFAULT_DATABASE</code>, migrate and query the correct database.</li>
      </ol>

      <h2>Troubleshooting: Logs Are Too Large</h2>
      <p>Large log growth usually comes from response bodies, high-volume endpoints, or long retention. Fix the data volume at the source:</p>
      <ul>
        <li>Set <code>DRF_API_LOGGER_MAX_REQUEST_BODY_SIZE</code> and <code>DRF_API_LOGGER_MAX_RESPONSE_BODY_SIZE</code>.</li>
        <li>Skip health checks, polling endpoints, metrics endpoints, and noisy internal routes.</li>
        <li>Use status-code filtering if you only need failures.</li>
        <li>Archive or delete rows older than your operational retention window.</li>
        <li>Move long-term logs to cheaper storage through signal listeners.</li>
      </ul>

      <h2>Troubleshooting: Slow Admin Search</h2>
      <p>If the admin log table becomes slow, the logger is doing its job but the storage strategy needs tuning. Add indexes, filter by date first, avoid retaining unlimited logs, and consider a separate logging database. Search over giant request and response bodies is inherently expensive, so do not keep unnecessary payloads forever.</p>

      <h2>DRF API Logger vs Plain Django Logging</h2>
      <p>Plain Django logging is still useful for application events, exceptions, and custom log statements. DRF API Logger is different because it captures structured API request/response records automatically. The difference is not "which one is better"; the difference is what question you are answering.</p>
      <ul>
        <li>Use Django logging for application events, error traces, startup issues, and custom domain events.</li>
        <li>Use DRF API Logger for API-level request/response records, status-code analysis, slow endpoint diagnosis, and support debugging.</li>
        <li>Use APM/tracing for cross-service timing and distributed request paths.</li>
      </ul>

      <h2>Practical Production Setup</h2>
      <p>For a serious production API, start with a conservative configuration:</p>
      <pre><code>DRF_API_LOGGER_DATABASE = True
DRF_API_LOGGER_SIGNAL = True

DRF_LOGGER_QUEUE_MAX_SIZE = 100
DRF_LOGGER_INTERVAL = 5

DRF_API_LOGGER_SKIP_URL_NAME = ['health-check', 'metrics']
DRF_API_LOGGER_STATUS_CODES = [400, 401, 403, 404, 409, 422, 429, 500, 502, 503]

DRF_API_LOGGER_EXCLUDE_KEYS = [
    'password',
    'token',
    'access',
    'refresh',
    'secret',
    'api_key',
    'authorization',
]

DRF_API_LOGGER_MAX_REQUEST_BODY_SIZE = 32768
DRF_API_LOGGER_MAX_RESPONSE_BODY_SIZE = 65536

DRF_API_LOGGER_SLOW_API_ABOVE = 200
DRF_API_LOGGER_ENABLE_CORRELATION = True
DRF_API_LOGGER_CORRELATION_REQUEST_ID_HEADERS = ['X-Request-ID']
DRF_API_LOGGER_CORRELATION_TRACE_ID_HEADERS = ['traceparent']
DRF_API_LOGGER_ENABLE_LOGGING_CONTEXT = True

# Validate profiling in staging, then sample it in production.
DRF_API_LOGGER_ENABLE_PROFILING = True
DRF_API_LOGGER_PROFILING_SQL_TRACKING = True
DRF_API_LOGGER_PROFILING_SAMPLE_RATE = 0.10</code></pre>
      <p>This example records selected failures, masks sensitive fields, keeps the documented default body caps, correlates with upstream request and W3C trace context, and profiles a sample. Review each status filter, payload cap, and retention period against your actual debugging and privacy requirements; this is a starting point, not a compliance preset.</p>

      <h2>What to Monitor After Enabling It</h2>
      <ul>
        <li><strong>Log table growth:</strong> Rows per day, storage size, and index size.</li>
        <li><strong>Queue behavior:</strong> Whether logs flush regularly under normal and peak traffic.</li>
        <li><strong>Slow endpoint count:</strong> Endpoints crossing your configured threshold.</li>
        <li><strong>Error bursts:</strong> Sudden increases in 4xx or 5xx responses.</li>
        <li><strong>Payload size:</strong> Whether large request or response bodies are being stored.</li>
        <li><strong>Admin query speed:</strong> Whether support engineers can search logs quickly.</li>
        <li><strong>Logger health:</strong> Queue depth, worker state, request-path overhead, flush duration, dropped records, and storage failures when first-party metrics are enabled.</li>
      </ul>

      <h2>FAQ</h2>
      <h3>Does DRF API Logger affect API response time?</h3>
      <p>It is designed for low request-path overhead, not zero overhead. Capture, masking, serialization, optional profiling or custom handling, and enqueueing remain on the request path. Batched database writes happen in the background. Benchmark representative payloads and monitor queue health, memory, and logger overhead under real traffic.</p>

      <h3>Can I use database logging and signal logging together?</h3>
      <p>Yes. Database logging gives you a convenient admin interface, while signal logging lets an application-owned listener process the same eligible record. Minimize and secure any external destination separately.</p>

      <h3>Should I log every endpoint?</h3>
      <p>Not always. Skip health checks, metrics endpoints, high-frequency polling routes, and endpoints that carry data you should not retain.</p>

      <h3>Is profiling safe in production?</h3>
      <p>Profiling is useful, but treat it as an operational feature to validate under your workload. SQL tracking can add overhead in some environments, so enable it deliberately and monitor impact.</p>

      <h3>Can it replace a SIEM, WAF, IDS, APM, Prometheus, OpenTelemetry, or Sentry?</h3>
      <p>No. It solves a different layer of the observability problem. Use it for structured DRF API records and optional detect-only signals. Use dedicated systems for enforcement, immutable auditing, distributed traces, metrics storage, alert investigation, and error tracking.</p>

      <h2>Reference Links</h2>
      <ul>
        <li><a href="https://pypi.org/project/drf-api-logger/" target="_blank" rel="noopener noreferrer">DRF API Logger on PyPI</a></li>
        <li><a href="https://drf-api-logger.readthedocs.io/en/latest/" target="_blank" rel="noopener noreferrer">DRF API Logger 1.4 documentation</a></li>
        <li><a href="https://github.com/vishalanandl177/DRF-API-Logger" target="_blank" rel="noopener noreferrer">DRF API Logger GitHub repository</a></li>
        <li><a href="https://github.com/vishalanandl177/DRF-API-Logger/issues" target="_blank" rel="noopener noreferrer">Report an issue or request a feature</a></li>
        <li><a href="https://www.django-rest-framework.org/community/third-party-packages/" target="_blank" rel="noopener noreferrer">Django REST Framework third-party packages documentation</a></li>
      </ul>

      <h2>Final Recommendation</h2>
      <p>DRF API Logger 1.4 is a practical way to add API-level evidence and performance diagnostics to a supported Django REST Framework service without rewriting views. Start in staging, run <code>drf_api_logger_doctor</code>, confirm masking and body policy, inspect migrations, validate ASGI or sync behavior, and measure request-path overhead. Then enable only the destinations, endpoint policies, profiling sample, metrics, and retention schedule your production system needs.</p>
    `;
