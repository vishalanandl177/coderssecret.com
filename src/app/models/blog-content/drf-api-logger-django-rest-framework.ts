export const CONTENT = `
      <p>If you run APIs in Django REST Framework, you eventually need answers that normal application logs do not give you quickly: which endpoint failed, what payload arrived, what status code was returned, how long the request took, whether sensitive data was masked, and whether the same endpoint is getting slower over time. <strong>DRF API Logger</strong> exists for that exact gap. It adds request and response observability to a DRF project without forcing every view to write custom logging code.</p>

      <p>This guide targets the modern <strong>v1.2.x</strong> line, including the documentation update for <strong>v1.2.1</strong>. The package is published under the <strong>Apache 2.0 license</strong>, supports Python 3.6 and newer, and the current documentation highlights request/response logging, sensitive-data masking, database logging, signal-based logging, admin analytics, queue-based background processing, request tracing, content-type controls, and per-request API profiling.</p>

      <!-- DRF Logger Pipeline -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">DRF API Logger Request Lifecycle</div>
        <div class="pipeline">
          <div class="pipeline-step" style="background:#3b82f6;--i:0"><span class="pipeline-step-icon">&#x1F4E8;</span>Client<span class="pipeline-step-sub">Calls DRF endpoint</span></div>
          <div class="pipeline-arrow">&#x2192;</div>
          <div class="pipeline-step" style="background:#7c3aed;--i:1"><span class="pipeline-step-icon">&#x1F50D;</span>Middleware<span class="pipeline-step-sub">Captures request</span></div>
          <div class="pipeline-arrow">&#x2192;</div>
          <div class="pipeline-step" style="background:#22c55e;--i:2"><span class="pipeline-step-icon">&#x2699;</span>View<span class="pipeline-step-sub">Runs normally</span></div>
          <div class="pipeline-arrow">&#x2192;</div>
          <div class="pipeline-step" style="background:#f97316;--i:3"><span class="pipeline-step-icon">&#x23F1;</span>Profiler<span class="pipeline-step-sub">Measures timing</span></div>
          <div class="pipeline-arrow">&#x2192;</div>
          <div class="pipeline-step" style="background:#0ea5e9;--i:4"><span class="pipeline-step-icon">&#x1F4DD;</span>Queue<span class="pipeline-step-sub">Stores asynchronously</span></div>
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
        <li><strong>Audit trails:</strong> Keep a structured trail of API activity for internal analysis and compliance workflows.</li>
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
        <li>The log event is sent to the configured destination: database, signal listeners, or both.</li>
        <li>Database writes are buffered through a queue so normal API response time is not blocked by one insert per request.</li>
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
      <p>Do not treat it as a full replacement for metrics, distributed tracing, or APM. It complements those systems. Metrics tell you that error rate increased. Tracing tells you which service path was slow. DRF API Logger gives you the concrete DRF request/response record inside your Django app.</p>

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

      <h2>Database Logging Deep Dive</h2>
      <p>Database logging stores API calls in a Django model and exposes them through the Django admin. This is the easiest mode to start with because it gives your team an immediate UI for searching, filtering, and inspecting API traffic.</p>
      <p>The built-in admin dashboard gives you charts and high-level API activity:</p>
      <img src="/images/drf-api-logger/01-admin-dashboard.png" alt="DRF API Logger admin dashboard with API analytics charts" width="2880" height="1800" loading="lazy" decoding="async" style="width:100%;border-radius:0.5rem;border:1px solid var(--border);margin:1rem 0;" />
      <p>The log listing view gives you a table of API calls with status codes, methods, timings, and request metadata:</p>
      <img src="/images/drf-api-logger/02-api-logs-list.png" alt="DRF API Logger list view showing API call logs with status codes, methods, and execution times" width="2880" height="4478" loading="lazy" decoding="async" style="width:100%;border-radius:0.5rem;border:1px solid var(--border);margin:1rem 0;" />
      <p>Clicking into a log entry gives you detailed request and response information, including timing and diagnostics:</p>
      <img src="/images/drf-api-logger/03-api-log-detail-slow-sql.png" alt="DRF API Logger detail view showing slow SQL query detection with execution time breakdown" width="2880" height="3180" loading="lazy" decoding="async" style="width:100%;border-radius:0.5rem;border:1px solid var(--border);margin:1rem 0;" />
      <p>Sensitive values can be masked before storage, so fields like passwords and tokens do not appear as raw values:</p>
      <img src="/images/drf-api-logger/04-api-log-detail-login-masked.png" alt="DRF API Logger detail view showing automatic masking of password and token fields" width="2880" height="3182" loading="lazy" decoding="async" style="width:100%;border-radius:0.5rem;border:1px solid var(--border);margin:1rem 0;" />
      <p>Profiling views make slow endpoints easier to reason about because the problem is split into query count, SQL time, middleware time, and application time:</p>
      <img src="/images/drf-api-logger/05-api-log-detail-n-plus-one.png" alt="DRF API Logger detail view showing API timing and diagnostic information" width="2880" height="3316" loading="lazy" decoding="async" style="width:100%;border-radius:0.5rem;border:1px solid var(--border);margin:1rem 0;" />

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
      <p>Signal-based logging is for teams that do not want every API log stored only in the application database. When enabled, DRF API Logger emits a signal for every API call. Your listeners can write JSON lines, ship events to a log pipeline, publish to Kafka, trigger a Slack alert, or attach application-specific labels.</p>
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
      <p>This makes signal mode useful when your main log storage is not Django admin. For example, you can keep a short retention window in the database for support/debugging and send the full stream to a centralized log system for longer retention.</p>

      <h2>API Profiling in v1.2.x</h2>
      <p>The most important modern capability to explain is API profiling. When profiling is enabled, each logged request can include a timing breakdown instead of only a single total duration. That lets you answer better questions:</p>
      <ul>
        <li>Was the request slow because of SQL?</li>
        <li>Was it slow because the serializer did too much work?</li>
        <li>Was middleware adding unexpected overhead?</li>
        <li>Did the endpoint run many queries and look like an N+1 problem?</li>
        <li>Was total time high even though SQL time was low, pointing to external calls or business logic?</li>
      </ul>

      <pre><code>DRF_API_LOGGER_ENABLE_PROFILING = True
DRF_API_LOGGER_PROFILING_SQL_TRACKING = True</code></pre>
      <p>When enabled, the profiling data can include middleware time, view and serialization time, SQL time, SQL query count, and diagnosis hints. The package documentation describes patterns such as SQL taking more than 70 percent of total time with high query count as likely N+1 behavior, while low SQL time with high total time suggests business logic or external service latency.</p>

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
      <p>Use database mode for admin search and debugging. Use signal mode when your organization already has centralized logging. Use both when you want a short local debugging window plus a durable external log stream.</p>

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

DRF_API_LOGGER_MAX_REQUEST_BODY_SIZE = 1024
DRF_API_LOGGER_MAX_RESPONSE_BODY_SIZE = 2048</code></pre>
      <p>Masking protects common secret fields. Body size limits protect your database. A single huge response body can consume more storage than thousands of normal API calls, so set limits before using the logger on high-volume production endpoints.</p>

      <h3>Supported Content Types</h3>
      <pre><code>DRF_API_LOGGER_CONTENT_TYPES = [
    'application/json',
    'application/vnd.api+json',
    'application/xml',
    'text/csv',
]</code></pre>
      <p>By default, JSON APIs are the primary use case. The package also supports custom content types, including vendor JSON media types such as JSON:API style content types.</p>

      <h3>Tracing and Correlation IDs</h3>
      <pre><code>DRF_API_LOGGER_ENABLE_TRACING = True
DRF_API_LOGGER_TRACING_ID_HEADER_NAME = 'X-Trace-ID'
DRF_API_LOGGER_TRACING_FUNC = 'myapp.tracing.generate_trace_id'</code></pre>
      <p>Tracing IDs matter when an API request crosses systems. If your gateway already sends a trace header, configure the header name so DRF API Logger stores the upstream correlation ID instead of inventing an unrelated one. In your views, you can access <code>request.tracing_id</code> when tracing is enabled.</p>

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
        avg_ms=Avg('execution_time'),
        max_ms=Max('execution_time'),
    )
    .order_by('-calls')
)</code></pre>

      <h2>Retention and Cleanup</h2>
      <p>API logs grow forever unless you intentionally delete or archive them. Decide retention before enabling database logging in production. For many teams, 7 to 30 days in the application database is enough for support and debugging, while longer retention belongs in cheaper log storage.</p>
      <pre><code>from datetime import timedelta
from django.core.management.base import BaseCommand
from django.utils import timezone
from drf_api_logger.models import APILogsModel

class Command(BaseCommand):
    help = 'Delete old DRF API Logger records'

    def handle(self, *args, **options):
        cutoff = timezone.now() - timedelta(days=30)
        deleted, _ = APILogsModel.objects.filter(
            added_on__lt=cutoff,
        ).delete()
        self.stdout.write(f'Deleted {deleted} old API log rows')</code></pre>

      <h2>Production Database Design</h2>
      <p>For small applications, storing logs in the default database may be acceptable. For high-traffic systems, use a dedicated logging database so API log writes and log searches do not compete with customer-facing transactional data.</p>
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
      <p>API logging is powerful, but it can become a liability if you log the wrong data. Treat API logs as sensitive production data.</p>
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

DRF_API_LOGGER_MAX_REQUEST_BODY_SIZE = 2048
DRF_API_LOGGER_MAX_RESPONSE_BODY_SIZE = 4096

DRF_API_LOGGER_SLOW_API_ABOVE = 200
DRF_API_LOGGER_ENABLE_TRACING = True
DRF_API_LOGGER_TRACING_ID_HEADER_NAME = 'X-Trace-ID'

# Enable profiling first in staging or selectively in production.
DRF_API_LOGGER_ENABLE_PROFILING = True
DRF_API_LOGGER_PROFILING_SQL_TRACKING = True</code></pre>
      <p>This example logs failures and slow behavior aggressively, masks sensitive fields, limits payload growth, and keeps traceability. You can widen or narrow it based on your compliance and debugging needs.</p>

      <h2>What to Monitor After Enabling It</h2>
      <ul>
        <li><strong>Log table growth:</strong> Rows per day, storage size, and index size.</li>
        <li><strong>Queue behavior:</strong> Whether logs flush regularly under normal and peak traffic.</li>
        <li><strong>Slow endpoint count:</strong> Endpoints crossing your configured threshold.</li>
        <li><strong>Error bursts:</strong> Sudden increases in 4xx or 5xx responses.</li>
        <li><strong>Payload size:</strong> Whether large request or response bodies are being stored.</li>
        <li><strong>Admin query speed:</strong> Whether support engineers can search logs quickly.</li>
      </ul>

      <h2>FAQ</h2>
      <h3>Does DRF API Logger affect API response time?</h3>
      <p>The package is designed around queue-based background processing so log writes do not sit directly on the API response path. You should still monitor memory, queue settings, and database write behavior under real traffic.</p>

      <h3>Can I use database logging and signal logging together?</h3>
      <p>Yes. Database logging gives you a convenient admin interface, while signal logging lets you ship the same event stream to external systems.</p>

      <h3>Should I log every endpoint?</h3>
      <p>Not always. Skip health checks, metrics endpoints, high-frequency polling routes, and endpoints that carry data you should not retain.</p>

      <h3>Is profiling safe in production?</h3>
      <p>Profiling is useful, but treat it as an operational feature to validate under your workload. SQL tracking can add overhead in some environments, so enable it deliberately and monitor impact.</p>

      <h3>Can it replace Datadog, Prometheus, OpenTelemetry, or Sentry?</h3>
      <p>No. It solves a different layer of the observability problem. Use it for structured DRF API logs. Use metrics, traces, and error tracking for broader system visibility.</p>

      <h2>Reference Links</h2>
      <ul>
        <li><a href="https://pypi.org/project/drf-api-logger/" target="_blank" rel="noopener noreferrer">DRF API Logger on PyPI</a></li>
        <li><a href="https://drf-api-logger.readthedocs.io/" target="_blank" rel="noopener noreferrer">DRF API Logger documentation</a></li>
        <li><a href="https://github.com/vishalanandl177/DRF-API-Logger" target="_blank" rel="noopener noreferrer">DRF API Logger GitHub repository</a></li>
      </ul>

      <h2>Final Recommendation</h2>
      <p>DRF API Logger is a practical way to add API-level observability to Django REST Framework without rewriting views. Start with database logging in a staging environment, confirm that masking and body limits are correct, tune the queue, then enable the production paths you actually need. For higher-traffic systems, route logs to a dedicated database or an external pipeline and keep retention intentionally short.</p>
    `;
