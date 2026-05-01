export const CONTENT = `
      <p>Every database query needs a connection. Opening a connection takes 50-100ms (TCP handshake, SSL negotiation, authentication). Without pooling, your app opens and closes a connection for every single request. At 100 concurrent users, that is 100 simultaneous connections &mdash; and PostgreSQL defaults to a maximum of 100. Connection number 101 gets rejected, your app crashes, and your users see a 500 error.</p>

      <h2>How Connection Pooling Works</h2>

      <p>A connection pool maintains a set of pre-opened database connections. When your app needs a connection, it borrows one from the pool. When done, it returns it instead of closing it. The next request reuses the same connection instantly.</p>

      <pre><code># Without pooling (every request):
# 1. Open TCP connection to database     (20ms)
# 2. SSL handshake                        (30ms)
# 3. Authenticate                         (10ms)
# 4. Execute query                        (5ms)
# 5. Close connection                     (5ms)
# Total: 70ms (only 5ms was actual work!)

# With pooling (after warmup):
# 1. Borrow connection from pool          (0.1ms)
# 2. Execute query                        (5ms)
# 3. Return connection to pool            (0.1ms)
# Total: 5.2ms (93% faster!)</code></pre>

      <h2>Pool Sizing: The Math</h2>

      <p>The optimal pool size is NOT &ldquo;as many as possible.&rdquo; More connections means more context switching, more memory, and worse performance. The formula from the PostgreSQL wiki:</p>

      <pre><code># Optimal pool size formula:
# pool_size = (core_count * 2) + effective_spindle_count

# For a server with 4 CPU cores and SSD storage:
# pool_size = (4 * 2) + 1 = 9 connections

# For a server with 8 CPU cores and SSD:
# pool_size = (8 * 2) + 1 = 17 connections

# Yes, 17 connections can handle THOUSANDS of concurrent requests
# because most requests only hold a connection for milliseconds.

# Common mistake: setting pool_size = 100
# This actually HURTS performance due to lock contention and
# context switching overhead inside PostgreSQL.</code></pre>

      <h2>Application-Level Pooling: Django</h2>

      <pre><code># settings.py

# WITHOUT pooling (default): new connection every request
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'myapp',
        'HOST': 'localhost',
        'PORT': '5432',
        'USER': 'myapp',
        'PASSWORD': 'secret',
    }
}

# WITH persistent connections
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'myapp',
        'HOST': 'localhost',
        'PORT': '5432',
        'USER': 'myapp',
        'PASSWORD': 'secret',
        'CONN_MAX_AGE': 600,      # Keep connections alive for 10 minutes
        'CONN_HEALTH_CHECKS': True, # Verify connection is alive before using
    }
}

# CONN_MAX_AGE=None means connections live forever (until server restart)
# CONN_MAX_AGE=0 means close after every request (default, no pooling)
# CONN_MAX_AGE=600 means reuse for 10 minutes, then close

# WARNING: With CONN_MAX_AGE and Gunicorn, each WORKER gets its own
# persistent connection. 4 workers = 4 connections minimum.</code></pre>

      <h2>Application-Level Pooling: SQLAlchemy</h2>

      <pre><code>from sqlalchemy import create_engine

# SQLAlchemy has built-in connection pooling
engine = create_engine(
    "postgresql://user:pass@localhost/myapp",
    pool_size=10,           # Maintain 10 connections
    max_overflow=5,         # Allow 5 extra connections under load
    pool_timeout=30,        # Wait 30s for a connection before error
    pool_recycle=1800,      # Recycle connections after 30 minutes
    pool_pre_ping=True,     # Test connection health before using
)

# Total maximum connections = pool_size + max_overflow = 15

# pool_pre_ping: sends "SELECT 1" before giving you a connection
# This catches stale connections from network drops or DB restarts
# Small overhead (1ms) but prevents "connection reset" errors</code></pre>

      <h2>External Pooling: PgBouncer</h2>

      <p>PgBouncer sits between your app and PostgreSQL as a lightweight proxy. It is the production standard for PostgreSQL connection pooling, especially with multiple app servers.</p>

      <pre><code># /etc/pgbouncer/pgbouncer.ini

[databases]
myapp = host=db.internal port=5432 dbname=myapp

[pgbouncer]
listen_addr = 0.0.0.0
listen_port = 6432

# Pool modes:
# session:     Connection locked to client for entire session (safest)
# transaction: Connection returned after each transaction (recommended)
# statement:   Connection returned after each statement (most aggressive)
pool_mode = transaction

# Pool sizing
default_pool_size = 20        # Connections per database/user pair
max_client_conn = 1000        # Max simultaneous client connections
min_pool_size = 5             # Keep at least 5 connections warm

# Timeouts
server_idle_timeout = 600     # Close idle server connections after 10 min
client_idle_timeout = 0       # Never timeout idle clients (app handles this)
query_timeout = 30            # Kill queries running longer than 30s

# Your app connects to PgBouncer (port 6432), NOT directly to PostgreSQL
# App sees: 1000 available connections
# PostgreSQL sees: only 20 actual connections</code></pre>

      <h3>PgBouncer Pool Modes Explained</h3>

      <table>
        <thead>
          <tr>
            <th>Mode</th>
            <th>Connection Returned</th>
            <th>Supports</th>
            <th>Best For</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Session</td>
            <td>When client disconnects</td>
            <td>Everything (prepared statements, temp tables)</td>
            <td>Legacy apps, full compatibility</td>
          </tr>
          <tr>
            <td>Transaction</td>
            <td>After each COMMIT/ROLLBACK</td>
            <td>Most queries (not session-level features)</td>
            <td>Web apps (recommended)</td>
          </tr>
          <tr>
            <td>Statement</td>
            <td>After each statement</td>
            <td>Simple queries only (no multi-statement transactions)</td>
            <td>Simple read-heavy workloads</td>
          </tr>
        </tbody>
      </table>

      <h2>Architecture: App Servers + PgBouncer + PostgreSQL</h2>

      <pre><code># Without PgBouncer:
# 10 Gunicorn workers x 5 app servers = 50 connections to PostgreSQL
# Add Celery workers: 20 more connections
# Add admin tools: 5 more connections
# Total: 75 connections (dangerously close to max_connections=100)

# With PgBouncer:
# 10 workers x 5 servers = 50 connections to PgBouncer
# PgBouncer maintains only 20 connections to PostgreSQL
# Celery connects to PgBouncer too
# PostgreSQL sees: 20 connections (comfortable headroom)
# Apps see: unlimited connections (PgBouncer queues them)</code></pre>

      <h2>Monitoring Pool Health</h2>

      <pre><code># PgBouncer admin console
psql -p 6432 -U pgbouncer pgbouncer

# Show current pool stats
SHOW POOLS;
# database | user | cl_active | cl_waiting | sv_active | sv_idle
# myapp    | app  | 45        | 0          | 12        | 8

# cl_active: clients with active queries
# cl_waiting: clients waiting for a server connection (should be 0!)
# sv_active: server connections running queries
# sv_idle: server connections available

# If cl_waiting > 0 consistently, increase default_pool_size

# PostgreSQL: check connection count
SELECT count(*) FROM pg_stat_activity;
SELECT state, count(*) FROM pg_stat_activity GROUP BY state;</code></pre>

      <h2>Common Mistakes</h2>

      <ul>
        <li><strong>Setting pool_size too high:</strong> 100 connections is almost never better than 20. More connections means more CPU context switching and lock contention inside PostgreSQL.</li>
        <li><strong>Forgetting Celery workers:</strong> Each Celery worker opens its own database connections. 20 Celery workers with pool_size=10 = 200 connections.</li>
        <li><strong>Not using pool_pre_ping:</strong> After a network blip or database restart, pooled connections go stale. The next query fails with &ldquo;connection reset.&rdquo;</li>
        <li><strong>Using session mode with web apps:</strong> Session mode holds connections for the entire client session. Web requests are short &mdash; use transaction mode.</li>
        <li><strong>Leaking connections:</strong> Opening connections in a try block without ensuring they are returned in a finally block. Always use context managers.</li>
      </ul>

      <h2>Key Takeaways</h2>

      <ul>
        <li><strong>Connection pooling is not optional in production</strong> &mdash; without it, your app crashes at modest concurrency</li>
        <li><strong>Optimal pool size is small:</strong> (CPU cores * 2) + 1, not hundreds</li>
        <li><strong>Use PgBouncer in transaction mode</strong> for web applications &mdash; it is the production standard</li>
        <li><strong>Django CONN_MAX_AGE=600</strong> gives you basic pooling with zero infrastructure changes</li>
        <li><strong>Always enable health checks</strong> (pool_pre_ping / CONN_HEALTH_CHECKS) to catch stale connections</li>
        <li><strong>Monitor cl_waiting in PgBouncer</strong> &mdash; if clients are waiting, increase pool size or optimize query duration</li>
        <li><strong>Count ALL connection sources:</strong> app servers + Celery + cron jobs + admin tools + monitoring</li>
      </ul>

      <p>Database connection pooling is one of those infrastructure fundamentals that separates apps that work in development from apps that survive production. A 20-connection pool with PgBouncer can serve thousands of concurrent users. A 100-connection free-for-all will crash at a hundred. Size your pools deliberately, monitor them continuously, and never let your app open connections without a pool.</p>
    `;
