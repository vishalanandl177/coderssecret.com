export const CONTENT = `
      <p>Every API needs rate limiting. Without it, a single misbehaving client can overwhelm your servers, a bot can scrape your entire database, or a billing exploit can cost you thousands. But not all rate limiters are equal &mdash; each algorithm has distinct tradeoffs in accuracy, memory usage, and burst handling.</p>

      <p>This guide implements three production-grade algorithms from scratch, explains when to use each, and shows how to deploy them with Redis for distributed systems.</p>

      <h2>Why Rate Limiting Matters</h2>

      <ul>
        <li><strong>Protection:</strong> Prevent DDoS attacks and resource exhaustion</li>
        <li><strong>Fairness:</strong> Ensure no single client monopolizes capacity</li>
        <li><strong>Cost Control:</strong> Limit expensive operations (AI API calls, database queries)</li>
        <li><strong>Compliance:</strong> Enforce contractual API usage limits per tier</li>
      </ul>

      <h2>Algorithm 1: Token Bucket</h2>

      <p>The token bucket is the most widely used algorithm (used by AWS, Stripe, and most API gateways). Imagine a bucket that holds tokens. Tokens are added at a fixed rate. Each request consumes one token. If the bucket is empty, the request is rejected.</p>

      <h3>Key Properties</h3>
      <ul>
        <li><strong>Allows bursts:</strong> A full bucket can handle a burst of requests up to the bucket capacity</li>
        <li><strong>Smooth refill:</strong> Tokens regenerate at a constant rate regardless of traffic</li>
        <li><strong>Simple and efficient:</strong> O(1) per request, minimal memory</li>
      </ul>

      <pre><code>import time

class TokenBucket:
    def __init__(self, capacity: int, refill_rate: float):
        """
        capacity: maximum tokens in the bucket
        refill_rate: tokens added per second
        """
        self.capacity = capacity
        self.refill_rate = refill_rate
        self.tokens = capacity
        self.last_refill = time.monotonic()

    def allow_request(self) -> bool:
        now = time.monotonic()
        elapsed = now - self.last_refill

        # Refill tokens based on elapsed time
        self.tokens = min(
            self.capacity,
            self.tokens + elapsed * self.refill_rate
        )
        self.last_refill = now

        if self.tokens >= 1:
            self.tokens -= 1
            return True
        return False

# Usage: 10 requests per second, burst up to 20
limiter = TokenBucket(capacity=20, refill_rate=10)

for i in range(25):
    if limiter.allow_request():
        print(f"Request {i}: allowed")
    else:
        print(f"Request {i}: rate limited (429)")</code></pre>

      <h3>Distributed Token Bucket with Redis</h3>

      <pre><code>import redis
import time

r = redis.Redis()

def token_bucket_redis(key: str, capacity: int, refill_rate: float) -> bool:
    pipe = r.pipeline()
    now = time.time()

    # Atomic Lua script for thread safety
    lua_script = """
    local key = KEYS[1]
    local capacity = tonumber(ARGV[1])
    local refill_rate = tonumber(ARGV[2])
    local now = tonumber(ARGV[3])

    local bucket = redis.call('HMGET', key, 'tokens', 'last_refill')
    local tokens = tonumber(bucket[1]) or capacity
    local last_refill = tonumber(bucket[2]) or now

    local elapsed = now - last_refill
    tokens = math.min(capacity, tokens + elapsed * refill_rate)

    if tokens >= 1 then
        tokens = tokens - 1
        redis.call('HMSET', key, 'tokens', tokens, 'last_refill', now)
        redis.call('EXPIRE', key, math.ceil(capacity / refill_rate) + 1)
        return 1
    else
        redis.call('HMSET', key, 'tokens', tokens, 'last_refill', now)
        redis.call('EXPIRE', key, math.ceil(capacity / refill_rate) + 1)
        return 0
    end
    """
    result = r.eval(lua_script, 1, key, capacity, refill_rate, now)
    return result == 1</code></pre>

      <h2>Algorithm 2: Sliding Window Log</h2>

      <p>The sliding window log tracks the exact timestamp of every request. To check if a new request is allowed, count all requests in the past N seconds. This is the most accurate algorithm but uses more memory.</p>

      <h3>Key Properties</h3>
      <ul>
        <li><strong>Exact counting:</strong> No boundary issues &mdash; the window truly slides</li>
        <li><strong>No bursts at boundaries:</strong> Unlike fixed windows, you cannot get 2x the limit at a window edge</li>
        <li><strong>Higher memory:</strong> Stores a timestamp per request (O(n) where n is the limit)</li>
      </ul>

      <pre><code>import time
from collections import deque

class SlidingWindowLog:
    def __init__(self, max_requests: int, window_seconds: float):
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self.requests = deque()

    def allow_request(self) -> bool:
        now = time.monotonic()
        window_start = now - self.window_seconds

        # Remove expired timestamps
        while self.requests and self.requests[0] <= window_start:
            self.requests.popleft()

        if len(self.requests) < self.max_requests:
            self.requests.append(now)
            return True
        return False

# Usage: 100 requests per 60 seconds
limiter = SlidingWindowLog(max_requests=100, window_seconds=60)</code></pre>

      <h3>Redis Implementation with Sorted Sets</h3>

      <pre><code>def sliding_window_redis(key: str, max_requests: int, window_secs: int) -> bool:
    lua_script = """
    local key = KEYS[1]
    local max_req = tonumber(ARGV[1])
    local window = tonumber(ARGV[2])
    local now = tonumber(ARGV[3])

    -- Remove expired entries
    redis.call('ZREMRANGEBYSCORE', key, 0, now - window)

    -- Count current requests
    local count = redis.call('ZCARD', key)

    if count < max_req then
        redis.call('ZADD', key, now, now .. '-' .. math.random(1000000))
        redis.call('EXPIRE', key, window)
        return 1
    end
    return 0
    """
    result = r.eval(lua_script, 1, key, max_requests, window_secs, time.time())
    return result == 1</code></pre>

      <h2>Algorithm 3: Leaky Bucket</h2>

      <p>The leaky bucket processes requests at a <strong>fixed rate</strong>, like water dripping from a bucket with a hole. Incoming requests are queued. If the queue is full, new requests are rejected. This produces the smoothest output rate.</p>

      <h3>Key Properties</h3>
      <ul>
        <li><strong>Constant output rate:</strong> Requests are processed at exactly the configured rate &mdash; no bursts</li>
        <li><strong>Queue-based:</strong> Excess requests wait in a queue rather than being immediately rejected</li>
        <li><strong>Best for:</strong> APIs that call expensive downstream services at a fixed rate</li>
      </ul>

      <pre><code>import time
import threading
from collections import deque

class LeakyBucket:
    def __init__(self, capacity: int, leak_rate: float):
        """
        capacity: max queued requests
        leak_rate: requests processed per second
        """
        self.capacity = capacity
        self.leak_rate = leak_rate
        self.queue = deque()
        self.lock = threading.Lock()
        self.last_leak = time.monotonic()

    def allow_request(self) -> bool:
        with self.lock:
            now = time.monotonic()
            elapsed = now - self.last_leak

            # Drain processed requests
            leaked = int(elapsed * self.leak_rate)
            if leaked > 0:
                for _ in range(min(leaked, len(self.queue))):
                    self.queue.popleft()
                self.last_leak = now

            if len(self.queue) < self.capacity:
                self.queue.append(now)
                return True
            return False

# Usage: queue up to 50 requests, process 10/second
limiter = LeakyBucket(capacity=50, leak_rate=10)</code></pre>

      <h2>Algorithm Comparison</h2>

      <table>
        <thead>
          <tr>
            <th>Feature</th>
            <th>Token Bucket</th>
            <th>Sliding Window</th>
            <th>Leaky Bucket</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Burst Handling</td>
            <td>Allows controlled bursts</td>
            <td>No bursts</td>
            <td>No bursts (queued)</td>
          </tr>
          <tr>
            <td>Accuracy</td>
            <td>Good</td>
            <td>Exact</td>
            <td>Exact output rate</td>
          </tr>
          <tr>
            <td>Memory</td>
            <td>O(1)</td>
            <td>O(n) per client</td>
            <td>O(queue size)</td>
          </tr>
          <tr>
            <td>Complexity</td>
            <td>Simple</td>
            <td>Moderate</td>
            <td>Moderate</td>
          </tr>
          <tr>
            <td>Best For</td>
            <td>General API limiting</td>
            <td>Strict per-client limits</td>
            <td>Fixed-rate downstream calls</td>
          </tr>
          <tr>
            <td>Used By</td>
            <td>AWS, Stripe, nginx</td>
            <td>Custom implementations</td>
            <td>Network traffic shaping</td>
          </tr>
        </tbody>
      </table>

      <h2>HTTP Response Headers</h2>

      <p>Always communicate rate limit status to clients via standard headers:</p>

      <pre><code># Successful response
HTTP/1.1 200 OK
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 67
X-RateLimit-Reset: 1714233600

# Rate limited response
HTTP/1.1 429 Too Many Requests
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1714233600
Retry-After: 32</code></pre>

      <h2>Django Middleware Example</h2>

      <pre><code>from django.http import JsonResponse

class RateLimitMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        client_key = self.get_client_key(request)

        if not token_bucket_redis(f"rate:{client_key}", capacity=100, refill_rate=1.67):
            return JsonResponse(
                {"error": "Rate limit exceeded. Try again later."},
                status=429,
                headers={"Retry-After": "60"}
            )

        return self.get_response(request)

    def get_client_key(self, request):
        # Prefer API key, fall back to IP
        api_key = request.headers.get("X-API-Key")
        if api_key:
            return f"api:{api_key}"
        return f"ip:{request.META.get('REMOTE_ADDR')}"</code></pre>

      <h2>Key Takeaways</h2>

      <ul>
        <li><strong>Token bucket is the default choice</strong> &mdash; simple, efficient, handles bursts gracefully</li>
        <li><strong>Sliding window log is most accurate</strong> &mdash; use when strict per-client limits matter more than memory</li>
        <li><strong>Leaky bucket smooths output rate</strong> &mdash; ideal when downstream services need constant throughput</li>
        <li><strong>Use Redis Lua scripts</strong> for atomic, distributed rate limiting across multiple servers</li>
        <li><strong>Always return rate limit headers</strong> so clients can self-throttle</li>
        <li><strong>Rate limit by API key first, IP second</strong> &mdash; IP-based limiting breaks behind shared proxies</li>
      </ul>

      <p>Rate limiting is not just a security feature &mdash; it is a reliability feature. A well-implemented rate limiter protects your servers, your budget, and your users from each other. Pick the right algorithm for your use case, implement it with Redis for distribution, and always communicate limits clearly to your clients.</p>
    `;
