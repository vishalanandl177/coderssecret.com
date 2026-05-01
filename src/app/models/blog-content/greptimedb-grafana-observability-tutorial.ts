export const CONTENT = `
      <p>Most teams use Prometheus for metrics, but Prometheus was designed as a monitoring tool, not a database. It struggles with long-term storage, high cardinality, and horizontal scaling. <strong>GreptimeDB</strong> is a cloud-native time-series database that speaks PromQL natively — meaning you can replace Prometheus's storage with GreptimeDB and keep your existing Grafana dashboards and alerting rules unchanged.</p>

      <h2>What is GreptimeDB?</h2>

      <p>GreptimeDB is an open-source, cloud-native time-series database written in Rust. It's designed for metrics, logs, and events at scale. Think of it as "what Prometheus storage would look like if redesigned from scratch in 2024."</p>

      <!-- GreptimeDB vs Prometheus -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">GreptimeDB vs Prometheus TSDB</div>
        <div class="vs-cards">
          <div class="vs-card" style="border-color:#f97316">
            <div class="vs-card-header" style="background:#f97316">Prometheus TSDB</div>
            <div class="vs-card-body">
              <div class="vs-row"><span class="vs-row-icon">&#x1F4BB;</span>Single-node only (no horizontal scaling)</div>
              <div class="vs-row"><span class="vs-row-icon">&#x23F1;</span>15-day default retention</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F4CA;</span>High cardinality = OOM crashes</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F5C3;</span>Local disk storage only</div>
            </div>
          </div>
          <div class="vs-badge">VS</div>
          <div class="vs-card" style="border-color:#22c55e">
            <div class="vs-card-header" style="background:#22c55e">GreptimeDB</div>
            <div class="vs-card-body">
              <div class="vs-row"><span class="vs-row-icon">&#x1F4BB;</span>Distributed, horizontally scalable</div>
              <div class="vs-row"><span class="vs-row-icon">&#x23F1;</span>Unlimited retention (object storage)</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F4CA;</span>Handles high cardinality well</div>
              <div class="vs-row"><span class="vs-row-icon">&#x2601;</span>S3/GCS/ADLS for long-term storage</div>
            </div>
          </div>
        </div>
      </div>

      <h2>Architecture</h2>

      <!-- Architecture -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">GreptimeDB + Grafana Stack</div>
        <div class="layer-diagram">
          <div class="layer-item" style="background:#3b82f6">Grafana (Dashboards + Alerts)<span class="layer-item-sub">Visualise metrics, create dashboards, set up alert rules — connects via Prometheus data source</span></div>
          <div class="layer-item" style="background:#7c3aed">GreptimeDB (Query Engine + Storage)<span class="layer-item-sub">PromQL + SQL query interface. Stores data in columnar format. Handles aggregation.</span></div>
          <div class="layer-item" style="background:#f97316">Data Ingestion (Prometheus remote_write / OTLP / SQL)<span class="layer-item-sub">Accepts data via Prometheus remote write, OpenTelemetry, gRPC, or direct SQL INSERT</span></div>
          <div class="layer-item" style="background:#22c55e">Data Sources (Your Services + Infrastructure)<span class="layer-item-sub">Application metrics, Kubernetes metrics, node metrics, custom business metrics</span></div>
        </div>
      </div>

      <h2>Step 1: Install GreptimeDB</h2>

      <pre><code># Option 1: Docker (quickest)
docker run -d --name greptimedb \\
  -p 4000:4000 \\
  -p 4001:4001 \\
  -p 4002:4002 \\
  -p 4003:4003 \\
  greptime/greptimedb:latest standalone start

# Ports:
# 4000 = HTTP API (SQL, PromQL, writes)
# 4001 = gRPC (high-performance ingestion)
# 4002 = MySQL protocol (connect with mysql CLI!)
# 4003 = PostgreSQL protocol (connect with psql!)

# Verify it's running
curl http://localhost:4000/health
# {"status":"ok"}

# Option 2: Kubernetes (production)
helm repo add greptime https://greptimeteam.github.io/helm-charts/
helm install greptimedb greptime/greptimedb-standalone \\
  --namespace monitoring --create-namespace

# Option 3: Binary
curl -fsSL https://raw.githubusercontent.com/GreptimeTeam/greptimedb/main/scripts/install.sh | sh
greptime standalone start</code></pre>

      <h2>Step 2: Create Tables and Insert Data</h2>

      <pre><code># GreptimeDB speaks SQL! Connect via MySQL protocol:
mysql -h 127.0.0.1 -P 4002

-- Create a metrics table
CREATE TABLE IF NOT EXISTS http_requests (
    host STRING,
    method STRING,
    path STRING,
    status_code INT,
    duration_ms DOUBLE,
    ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    TIME INDEX (ts),
    PRIMARY KEY (host, method, path)
)
ENGINE = mito
WITH (
    'storage' = 'File'
);

-- Insert sample metrics
INSERT INTO http_requests (host, method, path, status_code, duration_ms, ts) VALUES
    ('api-1', 'GET', '/users', 200, 45.2, '2025-07-15 10:00:00'),
    ('api-1', 'POST', '/orders', 201, 120.5, '2025-07-15 10:00:01'),
    ('api-2', 'GET', '/users', 200, 38.7, '2025-07-15 10:00:02'),
    ('api-1', 'GET', '/users', 500, 5023.1, '2025-07-15 10:00:03');

-- Query with SQL
SELECT host, AVG(duration_ms) as avg_latency, COUNT(*) as requests
FROM http_requests
WHERE ts > '2025-07-15 00:00:00'
GROUP BY host
ORDER BY avg_latency DESC;

-- Query with PromQL (yes, SQL and PromQL in the same database!)
-- Via HTTP: curl 'http://localhost:4000/v1/promql?query=avg(duration_ms)&start=1721030400&end=1721116800&step=60'</code></pre>

      <h2>Step 3: Connect Prometheus (Remote Write)</h2>

      <pre><code># prometheus.yml — Send metrics to GreptimeDB
global:
  scrape_interval: 15s

remote_write:
  - url: "http://greptimedb:4000/v1/prometheus/write"
    # GreptimeDB accepts standard Prometheus remote_write protocol
    # All your existing scrape configs continue working!

scrape_configs:
  - job_name: 'node-exporter'
    static_configs:
      - targets: ['node-exporter:9100']

  - job_name: 'kube-state-metrics'
    static_configs:
      - targets: ['kube-state-metrics:8080']

  - job_name: 'my-app'
    static_configs:
      - targets: ['my-app:8080']
    metrics_path: '/metrics'

# Prometheus scrapes as usual, but writes to GreptimeDB for long-term storage
# GreptimeDB handles retention, compression, and querying</code></pre>

      <h2>Step 4: Set Up Grafana</h2>

      <pre><code># Docker Compose: Full stack
version: '3.8'
services:
  greptimedb:
    image: greptime/greptimedb:latest
    command: standalone start
    ports:
      - "4000:4000"
      - "4001:4001"
      - "4002:4002"

  grafana:
    image: grafana/grafana:latest
    ports:
      - "3000:3000"
    environment:
      GF_SECURITY_ADMIN_PASSWORD: admin
    volumes:
      - grafana-data:/var/lib/grafana

  prometheus:
    image: prom/prometheus:latest
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.retention.time=1d'  # Short retention, GreptimeDB handles long-term

volumes:
  grafana-data:

# After starting:
# 1. Open Grafana: http://localhost:3000 (admin/admin)
# 2. Add Data Source:
#    - Type: Prometheus
#    - URL: http://greptimedb:4000/v1/prometheus
#    - Access: Server
#    - Save & Test
# 3. Import a dashboard or create your own!</code></pre>

      <h2>Step 5: Build a Dashboard</h2>

      <pre><code># Grafana dashboard panels using PromQL (via GreptimeDB):

# Panel 1: Request rate
rate(http_requests_total[5m])

# Panel 2: P99 latency
histogram_quantile(0.99, rate(http_request_duration_seconds_bucket[5m]))

# Panel 3: Error rate
sum(rate(http_requests_total{status_code=~"5.."}[5m]))
  /
sum(rate(http_requests_total[5m]))

# Panel 4: Top endpoints by latency
topk(10, avg by (path) (rate(http_request_duration_seconds_sum[5m]) / rate(http_request_duration_seconds_count[5m])))

# These are STANDARD PromQL queries.
# They work identically whether the backend is Prometheus or GreptimeDB.
# The difference: GreptimeDB can query months/years of data, Prometheus can't.</code></pre>

      <h2>Why GreptimeDB Over Alternatives?</h2>

      <!-- Comparison -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">Time-Series Database Comparison</div>
        <div style="overflow-x:auto">
          <table style="width:100%;border-collapse:collapse;font-size:0.78rem;min-width:550px">
            <thead>
              <tr>
                <th style="text-align:left;padding:0.6rem;background:var(--muted);color:var(--foreground);border-radius:0.4rem 0 0 0">Feature</th>
                <th style="text-align:center;padding:0.6rem;background:#22c55e;color:#fff">GreptimeDB</th>
                <th style="text-align:center;padding:0.6rem;background:#f97316;color:#fff">Prometheus</th>
                <th style="text-align:center;padding:0.6rem;background:#3b82f6;color:#fff">InfluxDB</th>
                <th style="text-align:center;padding:0.6rem;background:#7c3aed;color:#fff;border-radius:0 0.4rem 0 0">TimescaleDB</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:var(--foreground);font-weight:600">Language</td><td style="padding:0.5rem;text-align:center">Rust</td><td style="padding:0.5rem;text-align:center">Go</td><td style="padding:0.5rem;text-align:center">Go + Rust</td><td style="padding:0.5rem;text-align:center">C (PostgreSQL)</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:var(--foreground);font-weight:600">Query languages</td><td style="padding:0.5rem;text-align:center;color:#22c55e;font-weight:700">SQL + PromQL</td><td style="padding:0.5rem;text-align:center">PromQL only</td><td style="padding:0.5rem;text-align:center">InfluxQL + SQL</td><td style="padding:0.5rem;text-align:center">SQL only</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:var(--foreground);font-weight:600">Horizontal scale</td><td style="padding:0.5rem;text-align:center;color:#22c55e">Yes</td><td style="padding:0.5rem;text-align:center;color:#ef4444">No</td><td style="padding:0.5rem;text-align:center;color:#f97316">Enterprise only</td><td style="padding:0.5rem;text-align:center;color:#f97316">Limited</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:var(--foreground);font-weight:600">Object storage</td><td style="padding:0.5rem;text-align:center;color:#22c55e;font-weight:700">S3, GCS, ADLS</td><td style="padding:0.5rem;text-align:center;color:#ef4444">Local only</td><td style="padding:0.5rem;text-align:center;color:#f97316">Cloud only</td><td style="padding:0.5rem;text-align:center;color:#ef4444">Local only</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:var(--foreground);font-weight:600">Grafana compat</td><td style="padding:0.5rem;text-align:center;color:#22c55e">Native (Prometheus DS)</td><td style="padding:0.5rem;text-align:center;color:#22c55e">Native</td><td style="padding:0.5rem;text-align:center;color:#22c55e">Native</td><td style="padding:0.5rem;text-align:center;color:#22c55e">Native (PostgreSQL DS)</td></tr>
              <tr><td style="padding:0.5rem;color:var(--foreground);font-weight:600">License</td><td style="padding:0.5rem;text-align:center;color:#22c55e">Apache 2.0</td><td style="padding:0.5rem;text-align:center;color:#22c55e">Apache 2.0</td><td style="padding:0.5rem;text-align:center;color:#f97316">MIT (v3 proprietary)</td><td style="padding:0.5rem;text-align:center;color:#22c55e">Apache 2.0</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <h2>When to Use GreptimeDB</h2>
      <ul>
        <li><strong>Long-term metrics storage:</strong> Prometheus for scraping, GreptimeDB for months/years of retention on S3.</li>
        <li><strong>High cardinality:</strong> Kubernetes labels, per-pod metrics, per-endpoint tracking — GreptimeDB handles it without OOM.</li>
        <li><strong>SQL on metrics:</strong> Join metrics with business data. "Show me latency for premium customers" — impossible with pure PromQL.</li>
        <li><strong>Multi-cloud observability:</strong> One GreptimeDB instance stores metrics from AWS, GCP, and on-prem — all queryable together.</li>
        <li><strong>IoT / edge:</strong> Lightweight Rust binary, low resource usage — runs on edge nodes and aggregates to cloud.</li>
      </ul>

      <p>GreptimeDB is not a replacement for Prometheus — it's a <strong>complement</strong>. Prometheus scrapes. GreptimeDB stores and queries. Grafana visualises. Together, they form a modern observability stack that scales from a hobby project to a multi-region enterprise deployment.</p>
    `;
