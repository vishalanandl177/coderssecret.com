export const CONTENT = `
      <p>System design interviews and architecture decisions share the same core knowledge: understanding how each layer of a modern web system works, when to introduce it, and what breaks when you get it wrong. This guide walks through every layer from the user&rsquo;s browser to the database, and ties it all together with a complete URL shortener design.</p>

      <h2>The Framework: How to Think About System Design</h2>

      <p>Whether you are designing a system at work or in an interview, follow this sequence:</p>

      <ol>
        <li><strong>Requirements:</strong> What exactly does the system need to do? (Functional + non-functional)</li>
        <li><strong>Estimation:</strong> How much traffic, storage, and bandwidth? (Back-of-envelope math)</li>
        <li><strong>High-Level Design:</strong> Draw the architecture with all major components</li>
        <li><strong>Deep Dive:</strong> Zoom into the most critical or complex components</li>
        <li><strong>Bottlenecks:</strong> What breaks at 10x scale? How do you fix it?</li>
      </ol>

      <p>Now let us walk through each layer of the architecture.</p>

      <h2>Layer 1: DNS and CDN</h2>

      <p>Every request starts with a DNS lookup. The user types <code>app.example.com</code> and the browser resolves it to an IP address. In a production system, this is where your first optimization happens.</p>

      <ul>
        <li><strong>DNS-based load balancing:</strong> Route53 (AWS), Cloud DNS (GCP) can return different IPs based on geography, health checks, or weighted distribution</li>
        <li><strong>CDN (Content Delivery Network):</strong> Static assets (JS, CSS, images) are cached at edge servers worldwide. CloudFront, Cloudflare, or Fastly serve files from the nearest edge &mdash; 20ms instead of 200ms</li>
      </ul>

      <pre><code># Typical CDN setup for a web app:
# Origin: your-server.example.com (one region)
# CDN: cdn.example.com (200+ edge locations)

# HTML references the CDN:
# &lt;script src="https://cdn.example.com/app.js"&gt;&lt;/script&gt;
# &lt;link href="https://cdn.example.com/styles.css"&gt;

# First request: CDN fetches from origin, caches at edge
# Subsequent requests: served from edge cache (sub-20ms)</code></pre>

      <h2>Layer 2: Load Balancer</h2>

      <p>A load balancer distributes incoming requests across multiple application servers. It is the single most important component for horizontal scaling.</p>

      <h3>L4 vs L7 Load Balancing</h3>

      <ul>
        <li><strong>L4 (Transport):</strong> Routes based on IP/port. Fast, but cannot inspect HTTP headers or URLs. Used for TCP/UDP traffic.</li>
        <li><strong>L7 (Application):</strong> Routes based on HTTP headers, URL paths, cookies. Can do SSL termination, request modification, and content-based routing.</li>
      </ul>

      <h3>Algorithms</h3>

      <ul>
        <li><strong>Round Robin:</strong> Each request goes to the next server in sequence. Simple, works when servers are identical.</li>
        <li><strong>Least Connections:</strong> Routes to the server with the fewest active connections. Better for varying request durations.</li>
        <li><strong>Consistent Hashing:</strong> Routes based on a hash of the request key (user ID, session). Ensures the same user hits the same server &mdash; critical for WebSocket or cache-dependent workloads.</li>
      </ul>

      <pre><code># nginx load balancer configuration
upstream backend {
    least_conn;

    server app1.internal:8080 weight=3;
    server app2.internal:8080 weight=3;
    server app3.internal:8080 weight=1;  # smaller instance

    # Health checks
    server app4.internal:8080 backup;    # only if others are down
}

server {
    listen 443 ssl;
    server_name api.example.com;

    # SSL termination happens here
    ssl_certificate     /etc/ssl/cert.pem;
    ssl_certificate_key /etc/ssl/key.pem;

    location / {
        proxy_pass http://backend;
        proxy_set_header X-Real-IP $remote_addr;
    }
}</code></pre>

      <h2>Layer 3: API Gateway</h2>

      <p>An API gateway sits between clients and your microservices, handling cross-cutting concerns so your services do not have to.</p>

      <ul>
        <li><strong>Rate Limiting:</strong> 100 requests/minute per API key. Prevents abuse and protects downstream services.</li>
        <li><strong>Authentication:</strong> Validates JWT tokens, API keys, or OAuth tokens once at the gateway.</li>
        <li><strong>Request Routing:</strong> <code>/api/users/*</code> &rarr; User Service, <code>/api/orders/*</code> &rarr; Order Service</li>
        <li><strong>API Versioning:</strong> Route <code>/v1/</code> and <code>/v2/</code> to different service versions without client changes.</li>
        <li><strong>Response Caching:</strong> Cache GET responses for frequently accessed, rarely changing data.</li>
      </ul>

      <p>Popular options: Kong, AWS API Gateway, Envoy Proxy (covered in our Envoy blog), or nginx with OpenResty.</p>

      <h2>Layer 4: Application Servers</h2>

      <p>Your actual business logic runs here. The key design principle: <strong>stateless servers</strong>.</p>

      <ul>
        <li><strong>Stateless:</strong> No server stores user sessions, uploaded files, or cache locally. Everything goes to external stores (Redis, S3, database). This means any server can handle any request &mdash; enabling horizontal scaling.</li>
        <li><strong>Horizontal Scaling:</strong> Add more servers behind the load balancer. Kubernetes makes this automatic with Horizontal Pod Autoscaler (HPA).</li>
      </ul>

      <pre><code># Kubernetes HPA: auto-scale based on CPU usage
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: api-server-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: api-server
  minReplicas: 3
  maxReplicas: 20
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70</code></pre>

      <h2>Layer 5: Caching Layer</h2>

      <p>Caching is the single most effective way to improve performance and reduce database load. A well-designed cache can handle 100x the read throughput of your database.</p>

      <h3>Cache Patterns</h3>

      <ul>
        <li><strong>Cache-Aside (Lazy Loading):</strong> Application checks cache first. On miss, reads from database and populates cache. Most common pattern.</li>
        <li><strong>Write-Through:</strong> Every database write also writes to cache. Cache is always up to date, but adds write latency.</li>
        <li><strong>Write-Behind:</strong> Writes go to cache immediately, then asynchronously flushed to database. Fastest writes, but risk of data loss.</li>
      </ul>

      <pre><code># Cache-aside pattern with Redis (Python)
import redis
import json

cache = redis.Redis(host='cache.internal', port=6379)

def get_user(user_id: str) -> dict:
    # Step 1: Check cache
    cached = cache.get(f"user:{user_id}")
    if cached:
        return json.loads(cached)

    # Step 2: Cache miss - read from database
    user = db.query("SELECT * FROM users WHERE id = %s", [user_id])

    # Step 3: Populate cache with TTL
    cache.setex(f"user:{user_id}", 3600, json.dumps(user))  # 1 hour TTL

    return user

def update_user(user_id: str, data: dict):
    # Update database
    db.execute("UPDATE users SET ... WHERE id = %s", [user_id])

    # Invalidate cache (not update - avoids race conditions)
    cache.delete(f"user:{user_id}")</code></pre>

      <h2>Layer 6: Message Queue</h2>

      <p>Message queues decouple services and enable asynchronous processing. Instead of Service A directly calling Service B, Service A publishes a message that Service B consumes when ready.</p>

      <ul>
        <li><strong>Decoupling:</strong> Services evolve independently. The order service does not need to know about the email service.</li>
        <li><strong>Load Leveling:</strong> Absorb traffic spikes. If 10,000 orders arrive in one second, the queue holds them while workers process at a sustainable rate.</li>
        <li><strong>Reliability:</strong> If a consumer crashes, messages remain in the queue. No data loss.</li>
      </ul>

      <pre><code># Producer: Order service publishes event
import json
from kafka import KafkaProducer

producer = KafkaProducer(
    bootstrap_servers='kafka.internal:9092',
    value_serializer=lambda v: json.dumps(v).encode()
)

def create_order(order_data):
    # Save to database
    order = db.save_order(order_data)

    # Publish event (async - does not block the response)
    producer.send('order-events', {
        'event': 'order_created',
        'order_id': order.id,
        'customer_id': order.customer_id,
        'total': order.total
    })

    return order

# Consumer: Email service listens for events
from kafka import KafkaConsumer

consumer = KafkaConsumer(
    'order-events',
    bootstrap_servers='kafka.internal:9092',
    group_id='email-service'
)

for message in consumer:
    event = json.loads(message.value)
    if event['event'] == 'order_created':
        send_order_confirmation_email(event['order_id'])</code></pre>

      <h2>Layer 7: Database</h2>

      <h3>SQL vs NoSQL Decision</h3>

      <ul>
        <li><strong>SQL (PostgreSQL, MySQL):</strong> When you need ACID transactions, complex joins, and strong consistency. Default choice for most applications.</li>
        <li><strong>NoSQL (MongoDB, DynamoDB, Cassandra):</strong> When you need flexible schemas, horizontal write scaling, or specific access patterns (key-value, document, wide-column).</li>
      </ul>

      <h3>Scaling Reads: Replicas</h3>

      <pre><code># Primary handles writes, replicas handle reads
# Application-level read/write splitting:

def get_user(user_id):
    return read_replica.query("SELECT * FROM users WHERE id = %s", [user_id])

def update_user(user_id, data):
    return primary.execute("UPDATE users SET ... WHERE id = %s", [user_id])</code></pre>

      <h3>Scaling Writes: Sharding</h3>

      <p>When a single primary cannot handle write volume, split data across multiple databases:</p>

      <ul>
        <li><strong>Hash Sharding:</strong> <code>shard = hash(user_id) % num_shards</code>. Even distribution, but hard to add shards.</li>
        <li><strong>Range Sharding:</strong> Users A-M on shard 1, N-Z on shard 2. Simple, but can create hotspots.</li>
        <li><strong>Directory Sharding:</strong> A lookup service maps each key to a shard. Most flexible, but the directory is a single point of failure.</li>
      </ul>

      <h2>Putting It All Together: Design a URL Shortener</h2>

      <h3>Requirements</h3>
      <ul>
        <li>Shorten a long URL to a short code (e.g., <code>example.com/abc123</code>)</li>
        <li>Redirect short URLs to original URLs</li>
        <li>Track click analytics</li>
        <li>100 million URLs created per month, 10:1 read-to-write ratio</li>
      </ul>

      <h3>Back-of-Envelope Estimation</h3>

      <pre><code># Writes: 100M / month
#   = ~3.3M / day
#   = ~38 / second (average)
#   = ~190 / second (5x peak)

# Reads: 1B / month (10:1 ratio)
#   = ~33M / day
#   = ~380 / second (average)
#   = ~1,900 / second (5x peak)

# Storage (5 years):
#   100M * 12 months * 5 years = 6 billion URLs
#   Each URL: ~500 bytes (short code + original URL + metadata)
#   Total: 6B * 500B = 3 TB

# Bandwidth:
#   Reads: 380 req/s * 500B = 190 KB/s (trivial)

# Short code length:
#   Base62 (a-z, A-Z, 0-9): 62^7 = 3.5 trillion combinations
#   7 characters is sufficient for 6 billion URLs</code></pre>

      <h3>Architecture</h3>

      <div class="pipeline-diagram">
        <div class="pipeline-title">URL Shortener Architecture</div>
        <div class="pipeline-steps">
          <div class="pipeline-step" style="border-color:#3b82f6">Client<br>Browser / API</div>
          <div class="pipeline-arrow">&rarr;</div>
          <div class="pipeline-step" style="border-color:#8b5cf6">CDN<br>Cache redirects</div>
          <div class="pipeline-arrow">&rarr;</div>
          <div class="pipeline-step" style="border-color:#ec4899">Load Balancer<br>L7 / nginx</div>
          <div class="pipeline-arrow">&rarr;</div>
          <div class="pipeline-step" style="border-color:#f97316">App Server<br>Stateless API</div>
          <div class="pipeline-arrow">&rarr;</div>
          <div class="pipeline-step" style="border-color:#ef4444">Redis Cache<br>URL lookups</div>
          <div class="pipeline-arrow">&rarr;</div>
          <div class="pipeline-step" style="border-color:#10b981">PostgreSQL<br>URL storage</div>
        </div>
      </div>

      <h3>Write Path (Create Short URL)</h3>

      <pre><code># 1. Client sends POST /api/shorten with the long URL
# 2. App server generates a unique 7-character base62 code
# 3. Store in database: {code, original_url, created_at, user_id}
# 4. Store in Redis cache: code -> original_url
# 5. Return short URL to client

import hashlib
import base64

def generate_short_code(url: str, counter: int) -> str:
    """Generate unique 7-char code using URL + counter."""
    raw = hashlib.md5(f"{url}{counter}".encode()).digest()
    encoded = base64.b62encode(raw)[:7]
    return encoded.decode()</code></pre>

      <h3>Read Path (Redirect)</h3>

      <pre><code># 1. Client requests GET /abc123
# 2. Check CDN cache (hit? -> 301 redirect immediately)
# 3. Check Redis cache (hit? -> 301 redirect)
# 4. Check database (hit? -> populate caches, 301 redirect)
# 5. Not found -> 404

# Async: publish click event to Kafka for analytics
producer.send('click-events', {
    'code': 'abc123',
    'timestamp': now,
    'ip': request.remote_addr,
    'user_agent': request.headers['User-Agent']
})</code></pre>

      <h2>Common Interview Mistakes</h2>

      <ul>
        <li><strong>Jumping to a solution without understanding requirements:</strong> Always spend the first 3-5 minutes asking clarifying questions.</li>
        <li><strong>Over-engineering from the start:</strong> Begin with a simple, working design. Add complexity (sharding, queues, caching) only when the numbers justify it.</li>
        <li><strong>Ignoring estimation:</strong> If your system handles 100 requests/second, you do not need Kafka and 20 microservices. A single PostgreSQL instance handles 10,000+ QPS for reads.</li>
        <li><strong>Forgetting failure modes:</strong> What happens if Redis goes down? What if the database master fails? Always discuss fallback strategies.</li>
        <li><strong>Not discussing tradeoffs:</strong> Every decision has a tradeoff. Cache invalidation vs. stale data. Strong consistency vs. availability. Acknowledge them.</li>
      </ul>

      <h2>Quick Reference: Component Cheat Sheet</h2>

      <table>
        <thead>
          <tr>
            <th>Component</th>
            <th>When to Use</th>
            <th>Popular Tools</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>CDN</td>
            <td>Static assets, global users</td>
            <td>CloudFront, Cloudflare, Fastly</td>
          </tr>
          <tr>
            <td>Load Balancer</td>
            <td>Multiple app servers</td>
            <td>nginx, ALB, HAProxy</td>
          </tr>
          <tr>
            <td>API Gateway</td>
            <td>Microservices, rate limiting</td>
            <td>Kong, Envoy, AWS API Gateway</td>
          </tr>
          <tr>
            <td>Cache</td>
            <td>Read-heavy, repeated queries</td>
            <td>Redis, Memcached</td>
          </tr>
          <tr>
            <td>Message Queue</td>
            <td>Async processing, decoupling</td>
            <td>Kafka, RabbitMQ, SQS</td>
          </tr>
          <tr>
            <td>SQL Database</td>
            <td>Transactions, joins, consistency</td>
            <td>PostgreSQL, MySQL</td>
          </tr>
          <tr>
            <td>NoSQL Database</td>
            <td>Flexible schema, massive scale</td>
            <td>MongoDB, DynamoDB, Cassandra</td>
          </tr>
          <tr>
            <td>Object Storage</td>
            <td>Files, images, backups</td>
            <td>S3, GCS, Azure Blob</td>
          </tr>
          <tr>
            <td>Search Engine</td>
            <td>Full-text search, facets</td>
            <td>Elasticsearch, Meilisearch</td>
          </tr>
        </tbody>
      </table>

      <h2>Key Takeaways</h2>

      <ul>
        <li><strong>Start simple, scale when needed</strong> &mdash; a single server with PostgreSQL handles more traffic than most people think</li>
        <li><strong>Stateless servers enable horizontal scaling</strong> &mdash; store all state in external systems (Redis, database, S3)</li>
        <li><strong>Caching is your biggest performance lever</strong> &mdash; a Redis cache in front of your database can handle 100x the read throughput</li>
        <li><strong>Message queues decouple and absorb spikes</strong> &mdash; essential for reliable async processing</li>
        <li><strong>Always do back-of-envelope math</strong> &mdash; it prevents both over-engineering and under-provisioning</li>
        <li><strong>Every component adds complexity</strong> &mdash; only add a layer when you have a concrete problem it solves</li>
        <li><strong>Discuss tradeoffs, not just solutions</strong> &mdash; strong consistency vs. availability, cost vs. performance, simplicity vs. scalability</li>
      </ul>

      <p>System design is not about memorizing architectures &mdash; it is about understanding the <strong>building blocks</strong>, knowing their tradeoffs, and assembling them to meet specific requirements. Master the layers in this guide and you can design (or discuss) any system with confidence.</p>
    `;
