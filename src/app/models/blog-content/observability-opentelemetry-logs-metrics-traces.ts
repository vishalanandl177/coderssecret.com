export const CONTENT = `
      <p>Your service is slow. Is it the database? The cache? A downstream API? Without observability, you are guessing. With it, you can trace a single request from the browser through every service, see exactly where the 2 seconds were spent, and correlate it with system metrics and error logs.</p>

      <p>This guide builds a complete observability stack with <strong>OpenTelemetry</strong> (the CNCF standard), covering all three pillars: logs, metrics, and distributed traces.</p>

      <h2>The Three Pillars</h2>

      <table>
        <thead>
          <tr>
            <th>Pillar</th>
            <th>What It Answers</th>
            <th>Example</th>
            <th>Tool</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Logs</strong></td>
            <td>What happened?</td>
            <td>"User 123 failed login: invalid password"</td>
            <td>Loki, Elasticsearch</td>
          </tr>
          <tr>
            <td><strong>Metrics</strong></td>
            <td>How much/how many?</td>
            <td>Request rate: 500 req/s, P99 latency: 230ms</td>
            <td>Prometheus, Grafana</td>
          </tr>
          <tr>
            <td><strong>Traces</strong></td>
            <td>Where was time spent?</td>
            <td>API: 50ms &rarr; DB: 120ms &rarr; Cache: 5ms</td>
            <td>Jaeger, Tempo</td>
          </tr>
        </tbody>
      </table>

      <p>The power comes from <strong>correlating</strong> all three. A trace shows a slow request. You check metrics to see if latency spiked system-wide. You search logs filtered by that trace ID to find the error message. OpenTelemetry makes this correlation automatic.</p>

      <h2>OpenTelemetry: One SDK for Everything</h2>

      <p>Before OpenTelemetry, you needed separate libraries for each concern: StatsD for metrics, Zipkin client for traces, structured logging for logs. OpenTelemetry provides a single, vendor-neutral instrumentation SDK that exports to any backend.</p>

      <pre><code># Install OpenTelemetry for Python
pip install opentelemetry-api opentelemetry-sdk \\
    opentelemetry-exporter-otlp \\
    opentelemetry-instrumentation-flask \\
    opentelemetry-instrumentation-requests \\
    opentelemetry-instrumentation-sqlalchemy</code></pre>

      <h2>Setting Up Traces</h2>

      <pre><code># tracing.py - Initialize OpenTelemetry
from opentelemetry import trace
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter
from opentelemetry.sdk.resources import Resource

def init_tracing(service_name: str):
    resource = Resource.create({"service.name": service_name})
    provider = TracerProvider(resource=resource)

    # Export traces to the collector via gRPC
    exporter = OTLPSpanExporter(endpoint="http://otel-collector:4317")
    provider.add_span_processor(BatchSpanProcessor(exporter))

    trace.set_tracer_provider(provider)

# Usage in your app
init_tracing("order-service")
tracer = trace.get_tracer("order-service")

# Create custom spans
def process_order(order_id: int):
    with tracer.start_as_current_span("process_order") as span:
        span.set_attribute("order.id", order_id)

        with tracer.start_as_current_span("validate_inventory"):
            check_inventory(order_id)

        with tracer.start_as_current_span("charge_payment"):
            charge_customer(order_id)

        with tracer.start_as_current_span("send_notification"):
            notify_customer(order_id)

# Result in Jaeger:
# process_order (350ms)
#   ├── validate_inventory (45ms)
#   ├── charge_payment (280ms)    &larr; The bottleneck!
#   └── send_notification (25ms)</code></pre>

      <h2>Auto-Instrumentation</h2>

      <p>OpenTelemetry can automatically instrument popular libraries without code changes:</p>

      <pre><code># Auto-instrument Flask, requests, SQLAlchemy, Redis, etc.
from opentelemetry.instrumentation.flask import FlaskInstrumentor
from opentelemetry.instrumentation.requests import RequestsInstrumentor
from opentelemetry.instrumentation.sqlalchemy import SQLAlchemyInstrumentor

app = Flask(__name__)

FlaskInstrumentor().instrument_app(app)     # Traces every HTTP request
RequestsInstrumentor().instrument()          # Traces outgoing HTTP calls
SQLAlchemyInstrumentor().instrument()        # Traces every SQL query

# Now every request automatically generates:
# - A root span for the Flask route
# - Child spans for each outgoing HTTP request
# - Child spans for each SQL query with the actual SQL text</code></pre>

      <h2>Setting Up Metrics</h2>

      <pre><code>from opentelemetry import metrics
from opentelemetry.sdk.metrics import MeterProvider
from opentelemetry.sdk.metrics.export import PeriodicExportingMetricReader
from opentelemetry.exporter.otlp.proto.grpc.metric_exporter import OTLPMetricExporter

def init_metrics(service_name: str):
    exporter = OTLPMetricExporter(endpoint="http://otel-collector:4317")
    reader = PeriodicExportingMetricReader(exporter, export_interval_millis=10000)

    provider = MeterProvider(
        resource=Resource.create({"service.name": service_name}),
        metric_readers=[reader],
    )
    metrics.set_meter_provider(provider)

# Create custom metrics
meter = metrics.get_meter("order-service")

# Counter: total count of events
order_counter = meter.create_counter(
    name="orders.created",
    description="Total orders created",
    unit="1",
)

# Histogram: distribution of values (latency, sizes)
order_latency = meter.create_histogram(
    name="orders.processing_time",
    description="Order processing time",
    unit="ms",
)

# Up/Down Counter: current value that goes up and down
active_orders = meter.create_up_down_counter(
    name="orders.active",
    description="Currently processing orders",
)

# Record metrics
def create_order(order):
    start = time.time()
    active_orders.add(1)

    try:
        process(order)
        order_counter.add(1, {"status": "success", "region": "us-east"})
    except Exception:
        order_counter.add(1, {"status": "failed", "region": "us-east"})
        raise
    finally:
        duration = (time.time() - start) * 1000
        order_latency.record(duration)
        active_orders.add(-1)</code></pre>

      <h2>Structured Logging with Trace Correlation</h2>

      <pre><code>import logging
import json
from opentelemetry import trace

class JSONFormatter(logging.Formatter):
    def format(self, record):
        log_data = {
            "timestamp": self.formatTime(record),
            "level": record.levelname,
            "message": record.getMessage(),
            "logger": record.name,
            "module": record.module,
        }

        # Automatically inject trace context
        span = trace.get_current_span()
        if span.is_recording():
            ctx = span.get_span_context()
            log_data["trace_id"] = format(ctx.trace_id, '032x')
            log_data["span_id"] = format(ctx.span_id, '016x')

        return json.dumps(log_data)

# Setup
handler = logging.StreamHandler()
handler.setFormatter(JSONFormatter())
logger = logging.getLogger("order-service")
logger.addHandler(handler)

# Now every log entry includes trace_id and span_id:
# {"timestamp": "2026-04-28 10:30:00", "level": "ERROR",
#  "message": "Payment failed for order 456",
#  "trace_id": "abc123def456...", "span_id": "789xyz..."}

# In Grafana: click trace_id in a log entry to jump directly
# to the corresponding trace in Jaeger/Tempo</code></pre>

      <h2>The Collector: Central Pipeline</h2>

      <pre><code># otel-collector-config.yaml
receivers:
  otlp:
    protocols:
      grpc:
        endpoint: 0.0.0.0:4317
      http:
        endpoint: 0.0.0.0:4318

processors:
  batch:
    timeout: 5s
    send_batch_size: 1000

  # Add service metadata
  resource:
    attributes:
      - key: environment
        value: production
        action: upsert

exporters:
  # Send traces to Jaeger
  otlp/jaeger:
    endpoint: jaeger:4317
    tls:
      insecure: true

  # Send metrics to Prometheus
  prometheus:
    endpoint: 0.0.0.0:8889

  # Send logs to Loki
  loki:
    endpoint: http://loki:3100/loki/api/v1/push

service:
  pipelines:
    traces:
      receivers: [otlp]
      processors: [batch, resource]
      exporters: [otlp/jaeger]
    metrics:
      receivers: [otlp]
      processors: [batch]
      exporters: [prometheus]
    logs:
      receivers: [otlp]
      processors: [batch]
      exporters: [loki]</code></pre>

      <h2>Grafana Dashboards</h2>

      <pre><code># Docker Compose for the full stack
services:
  otel-collector:
    image: otel/opentelemetry-collector-contrib
    volumes:
      - ./otel-config.yaml:/etc/otel/config.yaml
    ports:
      - "4317:4317"   # gRPC receiver
      - "4318:4318"   # HTTP receiver
      - "8889:8889"   # Prometheus metrics

  jaeger:
    image: jaegertracing/all-in-one
    ports:
      - "16686:16686"  # Jaeger UI

  prometheus:
    image: prom/prometheus
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
    ports:
      - "9090:9090"

  grafana:
    image: grafana/grafana
    ports:
      - "3000:3000"
    environment:
      - GF_AUTH_ANONYMOUS_ENABLED=true

  loki:
    image: grafana/loki
    ports:
      - "3100:3100"</code></pre>

      <h2>Key Takeaways</h2>

      <ul>
        <li><strong>Observability is not monitoring</strong> &mdash; monitoring tells you something is wrong, observability tells you <em>why</em></li>
        <li><strong>OpenTelemetry is the standard</strong> &mdash; vendor-neutral, CNCF-backed, works with every observability backend</li>
        <li><strong>Auto-instrumentation covers 80% of needs</strong> &mdash; Flask, Django, Express, database drivers, HTTP clients all have plugins</li>
        <li><strong>Correlate all three pillars</strong> &mdash; trace IDs in logs let you jump from a log entry to the full request trace</li>
        <li><strong>Use the Collector as a central pipeline</strong> &mdash; receive from all services, process in one place, export to any backend</li>
        <li><strong>Histograms over averages</strong> &mdash; P99 latency reveals problems that averages hide</li>
        <li><strong>Start with auto-instrumentation and traces</strong> &mdash; add custom metrics and structured logging as you identify specific needs</li>
      </ul>

      <p>The goal of observability is answering questions you did not know you would ask. With traces, metrics, and correlated logs, you can debug any production issue by following the data instead of guessing. Start with OpenTelemetry auto-instrumentation today &mdash; you will wonder how you ever debugged without it.</p>
    `;
