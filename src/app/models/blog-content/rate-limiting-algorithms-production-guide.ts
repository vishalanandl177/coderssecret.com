export const CONTENT = `
      <p>Rate limiting is one of the few infrastructure controls that simultaneously protects you from <strong>cost overruns</strong>, <strong>abuse</strong>, <strong>cascading failure</strong>, and <strong>noisy neighbours</strong>. Get it right and a single misbehaving client&apos;s burst is absorbed before it touches your application. Get it wrong and you either DDoS yourself with retries or open the door to credential stuffing, scraping, and inference-cost bombs.</p>

      <p>This guide is a production walk through the rate-limiting algorithms used in real API gateways, edge proxies, and service meshes &mdash; what each algorithm gets right, where it falls down, and how distributed systems implement these controls without becoming a coordination bottleneck themselves. Examples are grounded in Redis, Envoy, NGINX, Kubernetes ingress, and the patterns Cloudflare and Fastly publish about their edge networks.</p>

      <h2>Why Rate Limiting Matters in Production</h2>

      <p>Five concrete production failures that rate limiting prevents:</p>

      <ul>
        <li><strong>Credential stuffing</strong>: an attacker with a leaked password list testing them against your login endpoint at thousands of attempts per second.</li>
        <li><strong>Inference-cost abuse</strong>: a single AI API consumer running 4 million calls in a week against a paid LLM endpoint, racking up tens of thousands in compute cost.</li>
        <li><strong>Scraping</strong>: a competitor or LLM trainer downloading your entire product catalogue, search index, or pricing data.</li>
        <li><strong>Retry storms</strong>: a downstream brownout triggers exponential retries from every client; without rate limiting at the edge those retries amplify the load and prevent recovery.</li>
        <li><strong>Bug-induced runaway cost</strong>: a misconfigured cron job that calls your billing API in a tight loop. Your own code is the &quot;attacker&quot; and a circuit breaker would not have helped.</li>
      </ul>

      <p>The right rate-limiter design depends on which of these you are defending against, where in the network you sit, and whether you can afford to be off by a factor of two during a partition.</p>

      <h2>The Four Foundational Algorithms</h2>

      <h3>Fixed Window Counter</h3>

      <p>The simplest algorithm. For each (client, window) pair, increment a counter; when the counter exceeds the limit, reject. The window resets at fixed wall-clock boundaries (every minute, every hour). Implementation in pseudo-Redis:</p>

      <pre><code>key   = "rl:" + client_id + ":" + (now / window_seconds)
count = INCR(key)
if count == 1: EXPIRE(key, window_seconds)
if count &gt; limit: return 429
return 200</code></pre>

      <p><strong>Pros:</strong> trivial to implement, O(1) memory per client per window, easy to reason about.</p>

      <p><strong>Cons:</strong> the boundary problem. With a 100-req/min limit, a client can send 100 requests in the last second of one window and 100 more in the first second of the next window &mdash; effectively 200 requests in 2 seconds while still appearing compliant. The denial-of-service surface is real.</p>

      <h3>Sliding Window Log</h3>

      <p>Stores the timestamp of every request in a sorted set per client. To check, drop entries older than the window and count what remains. Conceptually accurate; operationally expensive.</p>

      <pre><code>now = time()
ZADD client_id now now
ZREMRANGEBYSCORE client_id 0 (now - window_seconds)
count = ZCARD client_id
if count &gt; limit: return 429
return 200</code></pre>

      <p><strong>Pros:</strong> exact. No boundary effect. Perfect for low-throughput precision-required scenarios (e.g. enforcing a hard 5-attempts-per-15-minutes login limit).</p>

      <p><strong>Cons:</strong> O(N) memory per client (N = limit). For a 1000-req/min limit, every active client costs 1000 timestamps in memory. At a million active clients you are storing a billion timestamps. Use only when the limit is small.</p>

      <h3>Sliding Window Counter</h3>

      <p>The hybrid that production systems usually pick. Store the count for the current window and the previous window. Estimate the sliding count by linearly interpolating: if you are 25% of the way into the current window, count = current_window_count + 0.75 &times; previous_window_count.</p>

      <pre><code>now           = time()
this_window   = now / window_seconds
prev_window   = this_window - 1
elapsed_pct   = (now % window_seconds) / window_seconds

current = INCR("rl:" + client + ":" + this_window)
EXPIRE  ("rl:" + client + ":" + this_window, 2 * window_seconds)
prev    = GET ("rl:" + client + ":" + prev_window) or 0

estimate = current + prev * (1 - elapsed_pct)
if estimate &gt; limit: return 429
return 200</code></pre>

      <p><strong>Pros:</strong> O(1) memory per client (two counters), no boundary problem (within ~1% error from the linear approximation), industry standard at large API gateways including Cloudflare.</p>

      <p><strong>Cons:</strong> the linear interpolation assumes uniform distribution within the previous window &mdash; if the previous window&apos;s requests were all in the last 10 seconds, the estimate is too low. In practice this matters less than the boundary problem of fixed windows.</p>

      <svg viewBox="0 0 800 320" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Sliding window counter showing the linear interpolation between previous and current window">
        <rect width="800" height="320" fill="#0f172a" rx="12"/>
        <text x="400" y="32" text-anchor="middle" fill="#94a3b8" font-size="14" font-weight="700">SLIDING WINDOW COUNTER</text>
        <line x1="60" y1="200" x2="740" y2="200" stroke="#475569" stroke-width="1"/>
        <line x1="60" y1="190" x2="60" y2="210" stroke="#475569" stroke-width="1"/>
        <line x1="400" y1="190" x2="400" y2="210" stroke="#475569" stroke-width="1"/>
        <line x1="740" y1="190" x2="740" y2="210" stroke="#475569" stroke-width="1"/>
        <text x="60" y="226" text-anchor="middle" fill="#94a3b8" font-size="10">T - 60s</text>
        <text x="400" y="226" text-anchor="middle" fill="#94a3b8" font-size="10">T (window boundary)</text>
        <text x="740" y="226" text-anchor="middle" fill="#94a3b8" font-size="10">T + 60s</text>
        <rect x="60" y="120" width="340" height="80" fill="#3b82f6" fill-opacity="0.25" stroke="#3b82f6" stroke-width="1"/>
        <text x="230" y="100" text-anchor="middle" fill="#60a5fa" font-size="11" font-weight="700">Previous window</text>
        <text x="230" y="165" text-anchor="middle" fill="#bfdbfe" font-size="14" font-weight="700">prev = 80</text>
        <rect x="400" y="155" width="170" height="45" fill="#22c55e" fill-opacity="0.3" stroke="#22c55e" stroke-width="1"/>
        <text x="485" y="135" text-anchor="middle" fill="#86efac" font-size="11" font-weight="700">Current window</text>
        <text x="485" y="183" text-anchor="middle" fill="#bbf7d0" font-size="13" font-weight="700">current = 30</text>
        <line x1="570" y1="190" x2="570" y2="260" stroke="#fbbf24" stroke-width="2" stroke-dasharray="4 3"/>
        <text x="570" y="280" text-anchor="middle" fill="#fcd34d" font-size="11" font-weight="700">now (T + 25s)</text>
        <text x="400" y="290" text-anchor="middle" fill="#cbd5e1" font-size="11">estimate = current + prev &times; (1 - elapsed_pct)</text>
        <text x="400" y="306" text-anchor="middle" fill="#cbd5e1" font-size="11">= 30 + 80 &times; (1 &minus; 0.42) = 30 + 46 = 76</text>
      </svg>

      <h3>Token Bucket</h3>

      <p>Each client (or scope) has a bucket of <strong>capacity C</strong> that <strong>refills at rate R tokens per second</strong>. Each request takes 1 token (or N tokens for weighted requests). If the bucket is empty, the request is rejected.</p>

      <pre><code>// Lazy refill on each request
elapsed     = now - last_refill
new_tokens  = elapsed * refill_rate
tokens      = min(capacity, tokens + new_tokens)
last_refill = now

if tokens &gt;= cost:
  tokens -= cost
  return 200
return 429</code></pre>

      <p>Token bucket is the algorithm of choice when you want to allow <strong>bursts</strong> while enforcing a sustained average. A bucket with C=100 and R=10/s lets a client send 100 requests instantly when the bucket is full, then settle into 10/s. This matches the &quot;real users browse in bursts&quot; pattern much better than a strict per-second rate.</p>

      <p>The bucket parameters encode an explicit policy: <em>capacity</em> is the burst budget, <em>refill rate</em> is the sustained throughput. Many systems expose both in their public limits (e.g. AWS DynamoDB&apos;s burst capacity, Stripe&apos;s 100 req/sec sustained with 25 req/sec burst).</p>

      <svg viewBox="0 0 800 340" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Token bucket diagram showing capacity, refill rate, and request token consumption">
        <rect width="800" height="340" fill="#0f172a" rx="12"/>
        <text x="400" y="32" text-anchor="middle" fill="#94a3b8" font-size="14" font-weight="700">TOKEN BUCKET</text>
        <rect x="280" y="100" width="240" height="180" rx="10" fill="none" stroke="#22c55e" stroke-width="2"/>
        <text x="400" y="86" text-anchor="middle" fill="#86efac" font-size="11" font-weight="700">Bucket: capacity C = 100</text>
        <rect x="295" y="180" width="210" height="90" fill="#22c55e" fill-opacity="0.4"/>
        <text x="400" y="240" text-anchor="middle" fill="#bbf7d0" font-size="22" font-weight="700">75</text>
        <text x="400" y="260" text-anchor="middle" fill="#bbf7d0" font-size="10">tokens available</text>
        <line x1="400" y1="60" x2="400" y2="98" stroke="#3b82f6" stroke-width="2" marker-end="url(#tbArr)"/>
        <text x="400" y="50" text-anchor="middle" fill="#60a5fa" font-size="11" font-weight="700">Refill: R = 10 tokens/sec</text>
        <line x1="540" y1="225" x2="640" y2="225" stroke="#fbbf24" stroke-width="2" marker-end="url(#tbArr)"/>
        <text x="590" y="215" text-anchor="middle" fill="#fcd34d" font-size="11" font-weight="700">Request &minus;1 token</text>
        <rect x="650" y="195" width="120" height="60" rx="6" fill="#1e293b" stroke="#fbbf24" stroke-width="1.5"/>
        <text x="710" y="218" text-anchor="middle" fill="#fcd34d" font-size="10" font-weight="700">200 OK</text>
        <text x="710" y="234" text-anchor="middle" fill="#94a3b8" font-size="9">if tokens &ge; cost</text>
        <text x="400" y="304" text-anchor="middle" fill="#cbd5e1" font-size="10">Burst budget = C &middot; Sustained throughput = R &middot; Empty bucket &rarr; 429</text>
      </svg>

      <h3>Leaky Bucket</h3>

      <p>The dual of token bucket: requests fill a queue (the &quot;bucket&quot;) and are processed at a fixed rate. Excess requests overflow and are dropped. Leaky bucket smooths a bursty input into a uniform output &mdash; useful when downstream cannot handle bursts.</p>

      <p>The classic example is shaping outbound traffic to a third-party API with a strict rate. Token bucket would happily fire all your requests as soon as you have tokens; leaky bucket paces them at exactly the allowed rate. Modern implementations (NGINX <code>limit_req</code>, Envoy local rate limit) are leaky-bucket-based.</p>

      <h3>Quick Comparison</h3>

      <p>Rule of thumb:</p>
      <ul>
        <li><strong>Burst friendly + rate limit:</strong> token bucket.</li>
        <li><strong>Strict pacing:</strong> leaky bucket.</li>
        <li><strong>Boundary-safe + memory-cheap:</strong> sliding window counter.</li>
        <li><strong>Boundary-safe + exact:</strong> sliding window log (small limits only).</li>
        <li><strong>Crude + cheap:</strong> fixed window counter (only if you can tolerate the boundary effect).</li>
      </ul>

      <h2>Distributed Rate Limiting</h2>

      <p>The hard part is not the algorithm &mdash; it is making it work across many gateway nodes without each node maintaining its own private counter. If you have 10 ingress replicas and each enforces a 1000-req/min limit independently, your effective limit is 10,000 req/min, and the limit is not really enforced.</p>

      <p>Three patterns dominate:</p>

      <h3>Pattern 1: Centralised Counter (Redis)</h3>

      <p>Every gateway sends an INCR or Lua-script call to a shared Redis instance per request. The Redis instance is the single source of truth. Strict and simple, but every request adds 1&ndash;2ms of network latency, and Redis becomes a single point of failure.</p>

      <p>The canonical implementation is a single Lua script that performs the entire token-bucket update atomically:</p>

      <pre><code>-- KEYS[1] = bucket key
-- ARGV    = capacity, refill_rate, now, cost
local capacity = tonumber(ARGV[1])
local refill   = tonumber(ARGV[2])
local now      = tonumber(ARGV[3])
local cost     = tonumber(ARGV[4])

local data = redis.call("HMGET", KEYS[1], "tokens", "ts")
local tokens = tonumber(data[1]) or capacity
local ts     = tonumber(data[2]) or now

tokens = math.min(capacity, tokens + (now - ts) * refill)
if tokens &lt; cost then
  redis.call("HMSET", KEYS[1], "tokens", tokens, "ts", now)
  redis.call("EXPIRE", KEYS[1], 600)
  return 0
end

tokens = tokens - cost
redis.call("HMSET", KEYS[1], "tokens", tokens, "ts", now)
redis.call("EXPIRE", KEYS[1], 600)
return 1</code></pre>

      <p>The Lua script ensures atomicity &mdash; no two gateways can race on the same client&apos;s bucket. With Redis Cluster, the bucket key&apos;s hash slot determines which Redis node owns it, so each client&apos;s checks are routed to a single node. For multi-region setups, use a per-region Redis with eventual cross-region reconciliation, accepting that limits are enforced regionally.</p>

      <h3>Pattern 2: Local Token Buckets with Periodic Reconciliation</h3>

      <p>Each gateway holds a local bucket sized for its share of the global limit (1/N of the global rate, where N is the number of gateways). Every few seconds, gateways exchange usage data via a gossip protocol or a shared store and adjust their local quotas based on observed traffic distribution.</p>

      <p>Used by Envoy&apos;s global rate limiting (which delegates to a separate gRPC rate-limit service), and by edge networks like Cloudflare for high-volume per-IP limits. The trade-off: under partition or sudden topology change, the limit can be temporarily wrong by a small percentage.</p>

      <h3>Pattern 3: Edge-First, Origin-Aware</h3>

      <p>The CDN or edge proxy enforces a permissive global rate to absorb obvious abuse (e.g. 10,000 req/min per IP). The origin enforces a stricter authenticated-user limit (e.g. 1000 req/min per API key). Each layer protects what is behind it from what would not survive without that layer.</p>

      <svg viewBox="0 0 800 360" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Distributed rate limiter architecture showing edge proxy, gateway, and centralized Redis counter">
        <rect width="800" height="360" fill="#0f172a" rx="12"/>
        <text x="400" y="32" text-anchor="middle" fill="#94a3b8" font-size="14" font-weight="700">DISTRIBUTED RATE LIMITER ARCHITECTURE</text>
        <rect x="40" y="70" width="120" height="70" rx="6" fill="#1e293b" stroke="#3b82f6" stroke-width="1.5"/>
        <text x="100" y="98" text-anchor="middle" fill="#60a5fa" font-size="11" font-weight="700">Edge / CDN</text>
        <text x="100" y="116" text-anchor="middle" fill="#94a3b8" font-size="9">Per-IP limit:</text>
        <text x="100" y="130" text-anchor="middle" fill="#94a3b8" font-size="9">10,000/min</text>
        <line x1="160" y1="105" x2="220" y2="105" stroke="#60a5fa" stroke-width="1.5" marker-end="url(#rlArr)"/>
        <rect x="220" y="60" width="160" height="180" rx="6" fill="#1e293b" stroke="#fbbf24" stroke-width="1.5"/>
        <text x="300" y="86" text-anchor="middle" fill="#fcd34d" font-size="11" font-weight="700">API Gateway</text>
        <text x="300" y="100" text-anchor="middle" fill="#94a3b8" font-size="9">(N replicas)</text>
        <rect x="240" y="115" width="50" height="32" rx="4" fill="#fbbf24" fill-opacity="0.15" stroke="#fbbf24" stroke-width="1"/>
        <text x="265" y="135" text-anchor="middle" fill="#fcd34d" font-size="9">GW 1</text>
        <rect x="310" y="115" width="50" height="32" rx="4" fill="#fbbf24" fill-opacity="0.15" stroke="#fbbf24" stroke-width="1"/>
        <text x="335" y="135" text-anchor="middle" fill="#fcd34d" font-size="9">GW 2</text>
        <rect x="240" y="155" width="50" height="32" rx="4" fill="#fbbf24" fill-opacity="0.15" stroke="#fbbf24" stroke-width="1"/>
        <text x="265" y="175" text-anchor="middle" fill="#fcd34d" font-size="9">GW 3</text>
        <rect x="310" y="155" width="50" height="32" rx="4" fill="#fbbf24" fill-opacity="0.15" stroke="#fbbf24" stroke-width="1"/>
        <text x="335" y="175" text-anchor="middle" fill="#fcd34d" font-size="9">GW N</text>
        <text x="300" y="208" text-anchor="middle" fill="#94a3b8" font-size="9">Per-API-key limit via Lua</text>
        <text x="300" y="222" text-anchor="middle" fill="#94a3b8" font-size="9">(token bucket in Redis)</text>
        <line x1="380" y1="150" x2="500" y2="150" stroke="#fbbf24" stroke-width="1.5" marker-end="url(#rlArr)"/>
        <line x1="500" y1="170" x2="380" y2="170" stroke="#fbbf24" stroke-width="1.5" marker-end="url(#rlArr)"/>
        <text x="440" y="142" text-anchor="middle" fill="#94a3b8" font-size="9">EVAL Lua</text>
        <text x="440" y="184" text-anchor="middle" fill="#94a3b8" font-size="9">allow / deny</text>
        <rect x="500" y="105" width="170" height="120" rx="6" fill="#1e293b" stroke="#22c55e" stroke-width="1.5"/>
        <text x="585" y="132" text-anchor="middle" fill="#86efac" font-size="11" font-weight="700">Redis Cluster</text>
        <text x="585" y="148" text-anchor="middle" fill="#94a3b8" font-size="9">Atomic token-bucket</text>
        <text x="585" y="162" text-anchor="middle" fill="#94a3b8" font-size="9">script per key</text>
        <text x="585" y="186" text-anchor="middle" fill="#94a3b8" font-size="9">key = rl:&lt;api_key&gt;</text>
        <text x="585" y="200" text-anchor="middle" fill="#94a3b8" font-size="9">slot &rarr; specific node</text>
        <line x1="300" y1="240" x2="300" y2="280" stroke="#94a3b8" stroke-width="1.2" marker-end="url(#rlArr)"/>
        <rect x="220" y="280" width="160" height="60" rx="6" fill="#1e293b" stroke="#94a3b8" stroke-width="1.2"/>
        <text x="300" y="306" text-anchor="middle" fill="#cbd5e1" font-size="11" font-weight="700">Origin services</text>
        <text x="300" y="324" text-anchor="middle" fill="#94a3b8" font-size="9">protected from overload</text>
        <defs>
          <marker id="rlArr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <polygon points="0 0, 6 3, 0 6" fill="#94a3b8"/>
          </marker>
        </defs>
      </svg>

      <h2>Production Implementations</h2>

      <h3>NGINX</h3>

      <p>NGINX&apos;s built-in <code>limit_req_zone</code> directive is a leaky-bucket rate limiter. Per-worker by default; for multi-worker correctness it stores state in shared memory.</p>

      <pre><code>http {
  limit_req_zone $binary_remote_addr zone=per_ip:10m rate=10r/s;
  limit_req_zone $http_x_api_key     zone=per_key:10m rate=100r/s;

  server {
    location /api/ {
      limit_req zone=per_ip   burst=20 nodelay;
      limit_req zone=per_key  burst=50 nodelay;
      proxy_pass http://upstream;
    }
  }
}</code></pre>

      <p>The <code>burst</code> argument is the queue size (in leaky-bucket terms); <code>nodelay</code> means burst requests are processed immediately rather than paced. For per-cluster correctness across many NGINX nodes, use the <code>nginx-redis</code> module or move the limiter to a shared Redis-backed gateway.</p>

      <h3>Envoy</h3>

      <p>Envoy supports two layers: <strong>local rate limiting</strong> (per-instance token bucket, no coordination) and <strong>global rate limiting</strong> (delegates to an external gRPC service that holds the shared state, typically Lyft&apos;s open-source <code>ratelimit</code> service backed by Redis).</p>

      <pre><code>http_filters:
- name: envoy.filters.http.local_ratelimit
  typed_config:
    "@type": type.googleapis.com/envoy.extensions.filters.http.local_ratelimit.v3.LocalRateLimit
    stat_prefix: http_local_rate_limit
    token_bucket:
      max_tokens: 100
      tokens_per_fill: 10
      fill_interval: 1s
    filter_enabled: { default_value: { numerator: 100 } }
    filter_enforced: { default_value: { numerator: 100 } }</code></pre>

      <p>The local filter is the right tool for &quot;protect this pod from overload&quot;; the global filter is the right tool for &quot;enforce a per-customer quota across the fleet&quot;. They compose &mdash; you typically run both.</p>

      <h3>Kubernetes Ingress</h3>

      <p>Most Kubernetes ingress controllers expose rate limiting via annotations. NGINX Ingress Controller:</p>

      <pre><code>apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: api
  annotations:
    nginx.ingress.kubernetes.io/limit-rps: "20"
    nginx.ingress.kubernetes.io/limit-rpm: "600"
    nginx.ingress.kubernetes.io/limit-connections: "10"
spec:
  ...</code></pre>

      <p>For Istio/Envoy ingress, define an <code>EnvoyFilter</code> or use the gateway API&apos;s rate-limiting policy. For more granular control (per-API-key, per-tenant), most teams converge on a dedicated API gateway (Kong, Tyk, or a custom Envoy-based gateway) sitting behind the ingress.</p>

      <h3>Cloud-Managed Gateways</h3>

      <p>AWS API Gateway, Google Cloud Endpoints, and Azure API Management all expose rate limiting natively. Their algorithms are typically token-bucket-based with per-region scope. The trade-off versus self-hosting is operational cost vs control: managed gateways are easy to operate and hard to customise.</p>

      <h2>Adaptive Rate Limiting</h2>

      <p>Static rate limits assume you know the right number in advance. Real systems learn it. Adaptive rate limiting (also called &quot;load shedding&quot; in some literatures) adjusts the allowed rate based on observed load &mdash; if the upstream is responding slowly, lower the rate; if everything is healthy, raise it.</p>

      <p>The classic algorithm is <strong>AIMD</strong> (Additive Increase Multiplicative Decrease, borrowed from TCP congestion control): on every successful response, increase the limit by a small constant; on every error or timeout, multiply the limit by a small fraction (typically 0.5). The system finds the maximum sustainable rate dynamically.</p>

      <p>Netflix&apos;s open-source <strong>concurrency-limits</strong> library applies AIMD as an in-process limiter; <strong>Sentinel</strong> (Alibaba) does similar at the framework level. Cloudflare&apos;s <strong>Bot Fight Mode</strong> applies adaptive limits per IP based on observed behaviour patterns.</p>

      <h3>Concurrency-Based Limits (vs Rate-Based)</h3>

      <p>Closely related: instead of rate-limiting requests-per-second, limit <strong>concurrent in-flight requests</strong>. This is more honest about back-pressure &mdash; if your service can handle 100 concurrent requests with acceptable latency, capping concurrency at 100 directly enforces that. Little&apos;s Law connects the two: <code>average_concurrency = arrival_rate &times; average_latency</code>.</p>

      <p>Concurrency-based limits adapt naturally to slow upstreams. If the upstream slows from 10ms to 100ms, fewer requests fit in the same concurrency budget, automatically throttling the load. AWS uses concurrency limits extensively in their internal services.</p>

      <h2>DDoS Mitigation</h2>

      <p>Application-layer rate limiting buys you minutes against a small attack and seconds against a large one. Real DDoS protection happens upstream: in the CDN layer (Cloudflare, Fastly, Akamai), in BGP-level scrubbing services (AWS Shield Advanced, Cloudflare Magic Transit), and in the kernel-level filters that reject obvious attack packets before they hit your application.</p>

      <p>The application-layer rate limiter&apos;s job in a DDoS scenario is mostly to identify and isolate attack patterns so the CDN or scrubbing layer can act on the signal. Common patterns:</p>

      <ul>
        <li><strong>Per-IP + per-ASN limits</strong> to detect botnets that span many IPs from a small set of providers.</li>
        <li><strong>Per-User-Agent fingerprint limits</strong> to detect bot fleets that all advertise the same UA.</li>
        <li><strong>JA3 / TLS fingerprint limits</strong> for clients that use the same TLS configuration (often a tell of automated tooling).</li>
        <li><strong>Behavioural anomaly detection</strong> &mdash; clients that hit endpoints in a non-human pattern (e.g. all 50 product pages in 2 seconds) get flagged regardless of rate.</li>
      </ul>

      <h2>Common Pitfalls</h2>

      <h3>Trusting the X-Forwarded-For Header</h3>

      <p>If your rate limiter keys on client IP and you read the IP from <code>X-Forwarded-For</code>, an attacker can spoof the header and rotate IPs trivially. Only trust XFF when set by an upstream proxy you control, and only the rightmost portion (your own proxies&apos; values, not the original client&apos;s claim).</p>

      <h3>Using Burst as Capacity</h3>

      <p>NGINX&apos;s <code>limit_req</code> with a high burst and <code>nodelay</code> behaves like a fixed window from the user&apos;s perspective &mdash; once the burst is consumed they get rate-limited, and the &quot;average rate&quot; intuition breaks. Tune burst conservatively and prefer separate limit zones for different scopes.</p>

      <h3>Counting Failed Requests Toward the Limit</h3>

      <p>If failed requests count, an attacker can deny service by making the victim&apos;s requests fail. Common with login endpoints: the attacker sends bad credentials with the victim&apos;s identifier, the limiter increments, and the legitimate user is rate-limited. Use exempt-on-failure for scenarios where the attacker controls the &quot;client&quot; identifier.</p>

      <h3>Forgetting to Limit Logged-In Users</h3>

      <p>Most teams limit per-IP at the edge but not per-user inside the gateway. A compromised account or misbehaving paid customer can blow past per-IP limits using a residential proxy network. Combine: per-IP at the edge, per-API-key in the gateway, per-user-action quotas at the application layer.</p>

      <h2>Security Considerations</h2>

      <p>Rate limiting is a security control. Two specific patterns matter:</p>

      <ol>
        <li><strong>Authentication endpoint rate limiting</strong>: enforce strict limits on <code>/login</code>, <code>/forgot-password</code>, <code>/verify-otp</code> &mdash; ideally with separate limits per IP and per username. The classic credential-stuffing defense.</li>
        <li><strong>Cost-based rate limiting</strong> for paid services: not all requests are equal. An LLM call costs more than a simple GET. Rate limits should reflect cost &mdash; either by varying token cost in the bucket (an LLM call costs 10 tokens, a GET costs 1) or by separate buckets per cost class.</li>
      </ol>

      <p>Walk through the scenarios in the <a href="/games/api-attack-defense" class="text-primary underline">API Attack &amp; Defense Simulator</a> to practice spotting JWT, OAuth, rate-limit, and CORS bypasses against rate-limited endpoints. For the broader API security picture, the <a href="/courses/cloud-native-security-engineering/kubernetes-authentication-authorization" class="text-primary underline">Kubernetes Authentication &amp; Authorization module</a> in the free Cloud Native Security Engineering course covers the full stack.</p>

      <h2>Observability</h2>

      <p>The rate limiter that does not emit metrics is just guessing. Minimum signals:</p>

      <ul>
        <li><strong>Per-scope acceptance rate</strong>: ratio of allowed to total requests, broken down by client / API-key / route.</li>
        <li><strong>429 response count</strong> with the specific rule that triggered it (so you can answer &quot;which limit are we hitting most?&quot;).</li>
        <li><strong>Bucket utilisation distribution</strong>: are clients consistently near the limit (suggesting the limit is too tight) or rarely near it (suggesting wasted budget)?</li>
        <li><strong>Latency added by the rate-limit check</strong>: in the centralised-Redis pattern, this is your tax. If it grows past 5ms, investigate.</li>
        <li><strong>Errors from the rate limiter itself</strong> (Redis timeouts, gRPC errors): these should default to <strong>fail-open or fail-closed</strong> by deliberate choice, not by accident.</li>
      </ul>

      <h2>Frequently Asked Questions</h2>

      <h3>Should I fail open or fail closed if the rate limiter is unavailable?</h3>
      <p>Depends on what you are protecting. For abuse protection on a hot endpoint (login, payment), fail closed &mdash; better to reject all traffic than let an attack through. For routine product traffic, fail open &mdash; better to let everyone through than block paying customers because of a Redis blip. Make the choice deliberately and document it.</p>

      <h3>How do I rate-limit by JWT subject without parsing the JWT on every gateway?</h3>
      <p>Either trust the upstream auth proxy to inject a verified header (e.g. <code>X-User-ID</code>) and key off that, or have the gateway verify the JWT once and cache the claims by JTI. The gateway-verifies pattern is more robust under federated auth.</p>

      <h3>Is sliding window log ever the right choice in production?</h3>
      <p>For low-volume strict-limit scenarios, yes &mdash; e.g. enforcing &quot;5 password reset requests per email per hour&quot; where the limit is small and the precision matters. For anything high-volume, sliding window counter or token bucket are better.</p>

      <h3>How do I rate-limit websockets / long-lived connections?</h3>
      <p>Limit two distinct things: <strong>connection rate</strong> (new connections per IP / API-key per second) and <strong>per-connection message rate</strong> (messages per connection per second). Token bucket per connection is a clean fit for the second; standard rate limiters for the first.</p>

      <h3>How do CDNs implement edge rate limiting at internet scale?</h3>
      <p>Edge nodes maintain local approximate counters per (IP, rule) and gossip aggregates back to a regional aggregator every few seconds. The aggregator computes the global rate and tells edge nodes to throttle if they cross thresholds. Counts are eventually consistent &mdash; an attacker can briefly exceed the limit before the aggregator catches up &mdash; but the system handles trillions of requests per day.</p>

      <h3>Should rate limits be public or hidden?</h3>
      <p>Public for legitimate users (so they can build clients that respect the limits). Returns the standard <code>X-RateLimit-Limit</code>, <code>X-RateLimit-Remaining</code>, <code>X-RateLimit-Reset</code> headers. Hidden for abuse-detection rules &mdash; if an attacker knows the threshold for triggering bot-detection, they can stay just under it.</p>

      <h2>Where to Go Next</h2>

      <ul>
        <li>Practice spotting API security flaws (including rate-limit bypasses) in the <a href="/games/api-attack-defense" class="text-primary underline">API Attack &amp; Defense Simulator</a>.</li>
        <li>Read the <a href="/blog/distributed-systems-algorithms-production-guide" class="text-primary underline">Distributed Systems Algorithms guide</a> for the consensus primitives that make the centralised-counter pattern correct.</li>
        <li>Walk the <a href="/courses/cloud-native-security-engineering/kubernetes-authentication-authorization" class="text-primary underline">Kubernetes Authentication &amp; Authorization module</a> to see how rate limiting fits with the broader access-control picture.</li>
        <li>Try the <a href="/games/incident-response-simulator" class="text-primary underline">Incident Response Simulator</a> for the on-call patterns that surround a rate-limit-triggering attack.</li>
      </ul>
    `;
