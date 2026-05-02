export const CONTENT = `
      <p>Every cache eventually causes an outage if you do not design it right. The reasons are always the same family: stale data when invalidation lags, thundering herds when the cache expires under load, hot keys that overwhelm a single Redis node, cascading failure when the cache itself goes down and the underlying database cannot serve the resulting load. Caching is the most leveraged performance tool in your stack and one of the easiest to get subtly wrong.</p>

      <p>This guide is a production walk through how real systems cache &mdash; the access patterns (cache-aside, write-through, write-back, read-through), the topologies (application caches, distributed caches, CDN edges), the failure modes (thundering herd, cache stampede, hot partitions), and the operational decisions that determine whether your cache makes the system faster or just makes the next outage harder to debug.</p>

      <h2>Why Caching, and What Caching Actually Buys You</h2>

      <p>Caching is the deliberate trade of <strong>memory and complexity</strong> for <strong>latency and database load</strong>. When it works it returns a result in microseconds (RAM lookup) instead of milliseconds (database query), and it absorbs orders of magnitude more read traffic than your underlying datastore can handle. When it does not work it serves stale data, masks real problems, and produces incidents that are harder to root-cause than &quot;the database is slow&quot;.</p>

      <p>Three rules of thumb before adding any cache:</p>
      <ol>
        <li><strong>Measure first</strong>. If the underlying query is fast enough, caching adds complexity for no gain. The premature cache is a real anti-pattern.</li>
        <li><strong>Define the freshness contract</strong>. How stale is acceptable? Five seconds for a product page is fine; five seconds for a bank balance is not. The contract drives the invalidation strategy.</li>
        <li><strong>Plan for the cache being down or empty</strong>. Can the system serve traffic with the cache cold or unavailable? If not, you have built a critical dependency, not a performance optimisation.</li>
      </ol>

      <h2>The Access Patterns</h2>

      <h3>Cache-Aside (Lazy Loading)</h3>

      <p>The application checks the cache first. On a miss, it queries the database, writes the result into the cache, and returns it. The cache and database are independent; the application coordinates. The most common pattern in production for read-heavy workloads.</p>

      <pre><code>def get_user(user_id):
    key = f"user:{user_id}"
    cached = redis.get(key)
    if cached:
        return json.loads(cached)
    user = db.query("SELECT * FROM users WHERE id = ?", user_id)
    redis.setex(key, 300, json.dumps(user))   # TTL = 5 min
    return user

def update_user(user_id, data):
    db.execute("UPDATE users SET ... WHERE id = ?", user_id)
    redis.delete(f"user:{user_id}")           # invalidate</code></pre>

      <p><strong>Pros:</strong> simple. The cache only contains data that has been requested. Survives a cold cache or a missing entry &mdash; the worst case is a database query.</p>

      <p><strong>Cons:</strong> first request after a miss pays the database cost (latency penalty). Stale data possible if invalidation is lost or the TTL is too long. The thundering herd problem (covered below) shows up exactly here.</p>

      <h3>Read-Through</h3>

      <p>The cache itself loads data from the database on a miss. The application talks only to the cache; the cache decides when to fetch. Common with caching libraries that wrap the database (NCache, Caffeine with a CacheLoader, Spring Cache abstraction).</p>

      <p><strong>Pros:</strong> application code is simpler &mdash; one access path. Loading logic centralised. Cache implementation can deduplicate concurrent loads of the same key (the &quot;cache loader stampede&quot; defence).</p>

      <p><strong>Cons:</strong> the cache layer must know how to query your database, which couples them. Less common in microservices because the cache is rarely allowed to talk to your database directly.</p>

      <h3>Write-Through</h3>

      <p>Every write goes to both the cache and the database synchronously. The cache is always consistent with the database (modulo the brief window between the two writes).</p>

      <pre><code>def update_user(user_id, data):
    db.execute("UPDATE users SET ... WHERE id = ?", user_id)
    redis.setex(f"user:{user_id}", 300, json.dumps(data))</code></pre>

      <p><strong>Pros:</strong> never stale (within the write-completion window). Reads never miss for recently-written data.</p>

      <p><strong>Cons:</strong> writes are slower (two systems on the critical path). Wasted cache writes for data that is rarely or never read &mdash; you populate the cache for every write, not just for reads. Use only when most written data will be read soon.</p>

      <h3>Write-Back (Write-Behind)</h3>

      <p>Writes go to the cache only. The cache asynchronously flushes dirty entries to the database in batches. The database catches up later.</p>

      <p><strong>Pros:</strong> very fast writes &mdash; the database is never on the critical path. Naturally batches multiple updates to the same key. High write throughput.</p>

      <p><strong>Cons:</strong> data loss window if the cache crashes before flushing. Hard to reason about consistency. Only used when write throughput dominates and some data loss is acceptable (analytics counters, view counts, leaderboards).</p>

      <svg viewBox="0 0 800 380" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Cache access patterns comparing cache-aside, read-through, write-through, and write-back">
        <rect width="800" height="380" fill="#0f172a" rx="12"/>
        <text x="400" y="32" text-anchor="middle" fill="#94a3b8" font-size="14" font-weight="700">CACHE ACCESS PATTERNS</text>
        <text x="200" y="70" text-anchor="middle" fill="#60a5fa" font-size="12" font-weight="700">CACHE-ASIDE (read)</text>
        <rect x="120" y="90" width="80" height="40" rx="4" fill="#1e293b" stroke="#3b82f6"/>
        <text x="160" y="115" text-anchor="middle" fill="#bfdbfe" font-size="10">App</text>
        <rect x="240" y="90" width="80" height="40" rx="4" fill="#1e293b" stroke="#3b82f6"/>
        <text x="280" y="115" text-anchor="middle" fill="#bfdbfe" font-size="10">Cache</text>
        <rect x="120" y="160" width="80" height="40" rx="4" fill="#1e293b" stroke="#3b82f6"/>
        <text x="160" y="185" text-anchor="middle" fill="#bfdbfe" font-size="10">App</text>
        <rect x="240" y="160" width="80" height="40" rx="4" fill="#1e293b" stroke="#3b82f6"/>
        <text x="280" y="185" text-anchor="middle" fill="#bfdbfe" font-size="10">DB</text>
        <line x1="200" y1="110" x2="240" y2="110" stroke="#60a5fa" stroke-width="1.2" marker-end="url(#cArr)"/>
        <text x="220" y="103" text-anchor="middle" fill="#94a3b8" font-size="8">1: GET</text>
        <line x1="200" y1="180" x2="240" y2="180" stroke="#fca5a5" stroke-width="1.2" marker-end="url(#cArr)"/>
        <text x="220" y="173" text-anchor="middle" fill="#94a3b8" font-size="8">2 (miss): SELECT</text>
        <line x1="240" y1="190" x2="200" y2="190" stroke="#fca5a5" stroke-width="1.2" marker-end="url(#cArr)"/>
        <text x="220" y="200" text-anchor="middle" fill="#94a3b8" font-size="8">3: row</text>
        <text x="600" y="70" text-anchor="middle" fill="#22c55e" font-size="12" font-weight="700">WRITE-THROUGH</text>
        <rect x="520" y="90" width="80" height="40" rx="4" fill="#1e293b" stroke="#22c55e"/>
        <text x="560" y="115" text-anchor="middle" fill="#bbf7d0" font-size="10">App</text>
        <rect x="640" y="90" width="80" height="40" rx="4" fill="#1e293b" stroke="#22c55e"/>
        <text x="680" y="115" text-anchor="middle" fill="#bbf7d0" font-size="10">Cache</text>
        <rect x="640" y="160" width="80" height="40" rx="4" fill="#1e293b" stroke="#22c55e"/>
        <text x="680" y="185" text-anchor="middle" fill="#bbf7d0" font-size="10">DB</text>
        <line x1="600" y1="110" x2="640" y2="110" stroke="#86efac" stroke-width="1.2" marker-end="url(#cArr)"/>
        <text x="620" y="103" text-anchor="middle" fill="#94a3b8" font-size="8">1: SET</text>
        <line x1="680" y1="130" x2="680" y2="160" stroke="#86efac" stroke-width="1.2" marker-end="url(#cArr)"/>
        <text x="700" y="148" fill="#94a3b8" font-size="8">2: WRITE</text>
        <text x="200" y="250" text-anchor="middle" fill="#fbbf24" font-size="12" font-weight="700">WRITE-BACK</text>
        <rect x="120" y="270" width="80" height="40" rx="4" fill="#1e293b" stroke="#fbbf24"/>
        <text x="160" y="295" text-anchor="middle" fill="#fcd34d" font-size="10">App</text>
        <rect x="240" y="270" width="80" height="40" rx="4" fill="#1e293b" stroke="#fbbf24"/>
        <text x="280" y="295" text-anchor="middle" fill="#fcd34d" font-size="10">Cache</text>
        <rect x="240" y="330" width="80" height="35" rx="4" fill="#1e293b" stroke="#fbbf24"/>
        <text x="280" y="352" text-anchor="middle" fill="#fcd34d" font-size="10">DB</text>
        <line x1="200" y1="290" x2="240" y2="290" stroke="#fcd34d" stroke-width="1.2" marker-end="url(#cArr)"/>
        <text x="220" y="283" text-anchor="middle" fill="#94a3b8" font-size="8">1: SET</text>
        <line x1="280" y1="310" x2="280" y2="330" stroke="#fcd34d" stroke-width="1.2" stroke-dasharray="3 2" marker-end="url(#cArr)"/>
        <text x="305" y="324" fill="#94a3b8" font-size="8">async batch</text>
        <text x="600" y="250" text-anchor="middle" fill="#a855f7" font-size="12" font-weight="700">READ-THROUGH</text>
        <rect x="520" y="270" width="80" height="40" rx="4" fill="#1e293b" stroke="#a855f7"/>
        <text x="560" y="295" text-anchor="middle" fill="#ddd6fe" font-size="10">App</text>
        <rect x="640" y="270" width="80" height="40" rx="4" fill="#1e293b" stroke="#a855f7"/>
        <text x="680" y="295" text-anchor="middle" fill="#ddd6fe" font-size="10">Cache</text>
        <rect x="640" y="330" width="80" height="35" rx="4" fill="#1e293b" stroke="#a855f7"/>
        <text x="680" y="352" text-anchor="middle" fill="#ddd6fe" font-size="10">DB</text>
        <line x1="600" y1="290" x2="640" y2="290" stroke="#c4b5fd" stroke-width="1.2" marker-end="url(#cArr)"/>
        <text x="620" y="283" text-anchor="middle" fill="#94a3b8" font-size="8">1: GET</text>
        <line x1="680" y1="310" x2="680" y2="330" stroke="#c4b5fd" stroke-width="1.2" marker-end="url(#cArr)"/>
        <text x="710" y="324" fill="#94a3b8" font-size="8">on miss</text>
        <defs>
          <marker id="cArr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <polygon points="0 0, 6 3, 0 6" fill="#94a3b8"/>
          </marker>
        </defs>
      </svg>

      <h2>Multi-Layer Cache Hierarchy</h2>

      <p>Real systems cache at multiple layers. A request for a product page might hit:</p>

      <ol>
        <li><strong>Browser cache</strong> (Cache-Control headers, service worker) &mdash; nanoseconds.</li>
        <li><strong>CDN edge cache</strong> (Cloudflare, Fastly, CloudFront) &mdash; ~10ms within the same continent.</li>
        <li><strong>Origin reverse proxy cache</strong> (Varnish, NGINX) &mdash; ~5ms within the same datacentre.</li>
        <li><strong>Application in-process cache</strong> (Caffeine, Guava, Python <code>functools.lru_cache</code>) &mdash; microseconds.</li>
        <li><strong>Distributed cache</strong> (Redis, Memcached) &mdash; ~1&ndash;3ms within the same VPC.</li>
        <li><strong>Database query cache / page cache</strong> &mdash; ~1ms for in-memory pages.</li>
        <li><strong>The actual storage</strong> &mdash; tens of milliseconds for SSD, hundreds for cold storage.</li>
      </ol>

      <p>Each layer has different invalidation cost, different consistency story, and different blast radius if it fails. The hierarchy is intentional &mdash; the higher the layer, the cheaper the hit and the harder the invalidation.</p>

      <svg viewBox="0 0 800 360" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Multi-layer cache hierarchy showing browser, CDN, application, distributed cache, and origin database">
        <rect width="800" height="360" fill="#0f172a" rx="12"/>
        <text x="400" y="32" text-anchor="middle" fill="#94a3b8" font-size="14" font-weight="700">CACHE HIERARCHY</text>
        <text x="60" y="68" fill="#94a3b8" font-size="11" font-weight="700">faster &uarr;</text>
        <text x="60" y="320" fill="#94a3b8" font-size="11" font-weight="700">slower &darr;</text>
        <rect x="160" y="60" width="480" height="35" rx="6" fill="#22c55e" fill-opacity="0.2" stroke="#22c55e"/>
        <text x="180" y="82" fill="#86efac" font-size="11" font-weight="700">Browser cache</text>
        <text x="620" y="82" text-anchor="end" fill="#94a3b8" font-size="10">~ns &middot; Cache-Control / SW</text>
        <rect x="160" y="105" width="480" height="35" rx="6" fill="#3b82f6" fill-opacity="0.2" stroke="#3b82f6"/>
        <text x="180" y="127" fill="#bfdbfe" font-size="11" font-weight="700">CDN edge (Cloudflare, Fastly, CloudFront)</text>
        <text x="620" y="127" text-anchor="end" fill="#94a3b8" font-size="10">~10ms &middot; geo-distributed</text>
        <rect x="160" y="150" width="480" height="35" rx="6" fill="#a855f7" fill-opacity="0.2" stroke="#a855f7"/>
        <text x="180" y="172" fill="#ddd6fe" font-size="11" font-weight="700">Reverse proxy (Varnish, NGINX)</text>
        <text x="620" y="172" text-anchor="end" fill="#94a3b8" font-size="10">~5ms &middot; per-DC</text>
        <rect x="160" y="195" width="480" height="35" rx="6" fill="#ec4899" fill-opacity="0.2" stroke="#ec4899"/>
        <text x="180" y="217" fill="#fbcfe8" font-size="11" font-weight="700">In-process cache (Caffeine, lru_cache)</text>
        <text x="620" y="217" text-anchor="end" fill="#94a3b8" font-size="10">~&micro;s &middot; per-pod</text>
        <rect x="160" y="240" width="480" height="35" rx="6" fill="#fbbf24" fill-opacity="0.2" stroke="#fbbf24"/>
        <text x="180" y="262" fill="#fcd34d" font-size="11" font-weight="700">Distributed cache (Redis, Memcached)</text>
        <text x="620" y="262" text-anchor="end" fill="#94a3b8" font-size="10">~1&ndash;3ms &middot; cluster-wide</text>
        <rect x="160" y="285" width="480" height="35" rx="6" fill="#94a3b8" fill-opacity="0.2" stroke="#94a3b8"/>
        <text x="180" y="307" fill="#cbd5e1" font-size="11" font-weight="700">Database / origin storage</text>
        <text x="620" y="307" text-anchor="end" fill="#94a3b8" font-size="10">~10s of ms or more</text>
        <text x="700" y="68" fill="#94a3b8" font-size="11" font-weight="700">cheaper invalidation &uarr;</text>
        <text x="700" y="320" fill="#94a3b8" font-size="11" font-weight="700">authoritative &darr;</text>
      </svg>

      <h2>Distributed Cache Topologies</h2>

      <h3>Redis: Single-Node, Sentinel, Cluster</h3>

      <p>Redis is the de facto standard distributed cache because of its rich data structures (not just key/value &mdash; sorted sets, hashes, streams, HyperLogLog) and its operational maturity. Three topologies dominate:</p>

      <ul>
        <li><strong>Single-node</strong> with persistence (RDB snapshots + AOF). Simplest, no HA. Acceptable for non-critical caches; restart pauses are real.</li>
        <li><strong>Sentinel</strong>: a primary with one or more replicas, plus Sentinel processes that coordinate failover. Strong-ish HA &mdash; Sentinel orchestrates leader election among the Sentinels themselves and promotes a replica when the primary fails. The classic warning is split-brain during a partition: see <a href="/blog/distributed-systems-algorithms-production-guide" class="text-primary underline">the consensus discussion in the Distributed Systems Algorithms guide</a>.</li>
        <li><strong>Cluster</strong>: 16384 hash slots partitioned across N primary nodes, with replicas per primary. Linear scalability for both memory and throughput. Rebalancing happens online via slot migration. Most large Redis deployments converge on Cluster mode, often with cloud-managed offerings like AWS ElastiCache or Memorystore.</li>
      </ul>

      <h3>Memcached</h3>

      <p>Memcached is the simpler counterpoint to Redis. Pure key/value, no persistence, no replication, no data structures &mdash; just a sharded LRU cache. Its strength is operational simplicity (Facebook famously runs many trillions of ops/day on Memcached) and predictable performance.</p>

      <p>Memcached uses client-side consistent hashing for sharding. The <strong>libmemcached</strong> client is the de facto C client; <strong>Mcrouter</strong> (open-sourced by Facebook) is a proxy that adds connection pooling, replication, and pool management on top of plain Memcached.</p>

      <p>Choose Memcached when you only need cache, you have huge fleets, and you value operational simplicity. Choose Redis when you need data structures, persistence, or pub/sub.</p>

      <h3>CDN Edge Caching</h3>

      <p>CDN caching is a distributed cache the size of the internet. Cloudflare, Fastly, Akamai, CloudFront each maintain hundreds of edge POPs caching content close to end users. The CDN behaves like a giant reverse-proxy cache, keyed by URL and modulated by request headers (Vary).</p>

      <p>The contract between origin and edge is the cache headers. <code>Cache-Control: public, max-age=3600, stale-while-revalidate=86400</code> tells the CDN: serve from cache for an hour, serve stale for up to a day while you fetch a fresh version in the background. Combined with surrogate keys (Fastly&apos;s primary differentiator), origins can purge collections of related cache entries by tag rather than by URL.</p>

      <h2>Cache Invalidation</h2>

      <blockquote>
        <p>&ldquo;There are only two hard things in Computer Science: cache invalidation and naming things.&rdquo;</p>
        <p>&mdash; Phil Karlton</p>
      </blockquote>

      <p>Invalidation is hard because you have to maintain a relationship between two systems &mdash; the cache and the source of truth &mdash; and the moment that relationship lags, you serve stale data. The strategies, ordered from simplest to most complex:</p>

      <h3>TTL Expiry</h3>

      <p>Every entry has a time-to-live; entries are evicted when they expire. Simplest strategy. Always-correct-eventually. The trade-off is freshness vs database load: short TTL = fresh but more misses; long TTL = stale but fewer misses.</p>

      <p>The right TTL depends on the data&apos;s churn rate. Product page (changes daily): TTL = 1 hour. User profile (changes monthly): TTL = 24 hours. Geographic IP database (changes weekly): TTL = 6 hours. Configuration (changes minutes after a deploy): TTL = 30 seconds plus push-based bust.</p>

      <h3>Explicit Invalidation on Write</h3>

      <p>The application invalidates the cache when it writes to the database. The simplest version is <code>DEL</code> on each write; a correctness-first version uses transaction outboxes to ensure invalidation happens even if the write succeeds and the cache call fails.</p>

      <p>The classic anti-pattern: write to database, then write to cache (rather than DEL). If two writes race, you can end up with the older value cached. Always invalidate (DEL); let the next read repopulate.</p>

      <h3>Event-Driven Invalidation (CDC)</h3>

      <p>Change Data Capture (CDC) tools (Debezium, AWS DMS, MaxwellDB) tail the database&apos;s binlog and emit events on every write. A small consumer translates events into cache invalidation calls. The application code does not have to remember to invalidate; the database itself is the source of invalidation events.</p>

      <p>This pattern is the dominant invalidation strategy at large scale. LinkedIn, Netflix, and Slack all use CDC-driven cache invalidation. The trade-off is operational complexity (now you operate Kafka + a CDC pipeline) and event-handling latency (cache may be stale for a few hundred milliseconds after a database write).</p>

      <h3>Write-Through (Cache as Source of Truth)</h3>

      <p>Already covered above. The cache is updated atomically with the database. No invalidation needed because there is nothing to invalidate.</p>

      <h3>Surrogate Keys / Tag-Based Invalidation</h3>

      <p>For CDN caches, you tag cache entries with one or more surrogate keys (e.g. <code>product:123</code>, <code>category:electronics</code>). When the underlying data changes, you purge all entries tagged with the relevant key with a single API call. Fastly built this into their core; AWS CloudFront added it later as cache invalidation patterns.</p>

      <h3>Versioned Cache Keys</h3>

      <p>Bake a version into the cache key (<code>user:123:v42</code>). To invalidate, increment the version &mdash; old keys remain in cache but are never read again, and they expire naturally via TTL. Useful when you cannot reliably enumerate all entries to invalidate (e.g. precomputed search results).</p>

      <h2>The Thundering Herd and Cache Stampede</h2>

      <p>The most common production cache failure: an entry expires under load. Many concurrent requests miss the cache simultaneously. They all query the database. The database falls over. A request that was supposed to be O(1) cache becomes O(N) database thrash.</p>

      <p>Three defences:</p>

      <h3>1. Per-Key Locking (Lock + Recompute)</h3>

      <p>On miss, take a short-lived lock on the key. Whichever request gets the lock fetches and populates; others wait briefly and re-read the cache. Implementation:</p>

      <pre><code>def get_user_with_lock(user_id):
    key = f"user:{user_id}"
    cached = redis.get(key)
    if cached:
        return json.loads(cached)
    # Try to acquire lock
    lock_key = f"lock:{key}"
    if redis.set(lock_key, "1", nx=True, ex=10):
        try:
            user = db.query("SELECT * FROM users WHERE id = ?", user_id)
            redis.setex(key, 300, json.dumps(user))
            return user
        finally:
            redis.delete(lock_key)
    else:
        time.sleep(0.05)
        return get_user_with_lock(user_id)  # retry</code></pre>

      <p>Effective but adds latency for the losers. A failed lock-holder leaves the lock orphaned for the lock TTL &mdash; that is the worst-case latency penalty.</p>

      <h3>2. Probabilistic Early Expiration</h3>

      <p>Each request, with small probability, treats a still-valid entry as if it had expired and refreshes it asynchronously. The probability rises as the entry approaches its actual expiration. By the time the entry would have expired, it has already been preemptively refreshed by some lucky request.</p>

      <p>This is the &quot;XFetch&quot; algorithm (Vattani, Chierichetti, Lowenstein, 2015). Beautifully avoids the synchronisation problem because no request is forced to wait.</p>

      <h3>3. Stale-While-Revalidate</h3>

      <p>Borrowed from HTTP cache headers (<code>Cache-Control: stale-while-revalidate=N</code>). On miss-or-expiry, return the stale value immediately and refresh asynchronously. Acceptable when small amounts of staleness are fine. Cloudflare and Fastly support it natively at the CDN layer.</p>

      <svg viewBox="0 0 800 320" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Cache stampede pattern showing many concurrent misses overwhelming the database">
        <rect width="800" height="320" fill="#0f172a" rx="12"/>
        <text x="400" y="32" text-anchor="middle" fill="#94a3b8" font-size="14" font-weight="700">CACHE STAMPEDE &mdash; AND ITS DEFENCES</text>
        <text x="200" y="68" text-anchor="middle" fill="#fca5a5" font-size="12" font-weight="700">UNPROTECTED</text>
        <circle cx="80" cy="120" r="10" fill="#1e293b" stroke="#fca5a5"/>
        <circle cx="80" cy="150" r="10" fill="#1e293b" stroke="#fca5a5"/>
        <circle cx="80" cy="180" r="10" fill="#1e293b" stroke="#fca5a5"/>
        <circle cx="80" cy="210" r="10" fill="#1e293b" stroke="#fca5a5"/>
        <circle cx="80" cy="240" r="10" fill="#1e293b" stroke="#fca5a5"/>
        <text x="80" y="270" text-anchor="middle" fill="#fca5a5" font-size="9">N requests</text>
        <line x1="92" y1="120" x2="160" y2="170" stroke="#fca5a5" stroke-width="1" marker-end="url(#stArr)"/>
        <line x1="92" y1="150" x2="160" y2="170" stroke="#fca5a5" stroke-width="1" marker-end="url(#stArr)"/>
        <line x1="92" y1="180" x2="160" y2="180" stroke="#fca5a5" stroke-width="1" marker-end="url(#stArr)"/>
        <line x1="92" y1="210" x2="160" y2="190" stroke="#fca5a5" stroke-width="1" marker-end="url(#stArr)"/>
        <line x1="92" y1="240" x2="160" y2="200" stroke="#fca5a5" stroke-width="1" marker-end="url(#stArr)"/>
        <rect x="160" y="155" width="60" height="50" rx="4" fill="#1e293b" stroke="#fbbf24"/>
        <text x="190" y="175" text-anchor="middle" fill="#fcd34d" font-size="9">Cache</text>
        <text x="190" y="190" text-anchor="middle" fill="#fcd34d" font-size="9">EXPIRED</text>
        <line x1="220" y1="180" x2="290" y2="180" stroke="#fca5a5" stroke-width="2" marker-end="url(#stArr)"/>
        <text x="255" y="172" text-anchor="middle" fill="#fca5a5" font-size="9">N queries</text>
        <rect x="290" y="155" width="80" height="50" rx="4" fill="#1e293b" stroke="#fca5a5"/>
        <text x="330" y="180" text-anchor="middle" fill="#fca5a5" font-size="10" font-weight="700">DB melts</text>
        <text x="600" y="68" text-anchor="middle" fill="#86efac" font-size="12" font-weight="700">PROTECTED (lock + recompute)</text>
        <circle cx="480" cy="120" r="10" fill="#1e293b" stroke="#86efac"/>
        <circle cx="480" cy="150" r="10" fill="#1e293b" stroke="#86efac"/>
        <circle cx="480" cy="180" r="10" fill="#1e293b" stroke="#86efac"/>
        <circle cx="480" cy="210" r="10" fill="#1e293b" stroke="#86efac"/>
        <circle cx="480" cy="240" r="10" fill="#1e293b" stroke="#86efac"/>
        <text x="480" y="270" text-anchor="middle" fill="#86efac" font-size="9">N requests</text>
        <line x1="492" y1="180" x2="560" y2="180" stroke="#86efac" stroke-width="1.5" marker-end="url(#stArr)"/>
        <text x="525" y="170" text-anchor="middle" fill="#94a3b8" font-size="8">SETNX lock</text>
        <rect x="560" y="155" width="60" height="50" rx="4" fill="#1e293b" stroke="#86efac"/>
        <text x="590" y="175" text-anchor="middle" fill="#86efac" font-size="9">Cache</text>
        <text x="590" y="190" text-anchor="middle" fill="#86efac" font-size="9">+ lock</text>
        <line x1="620" y1="180" x2="690" y2="180" stroke="#86efac" stroke-width="1.5" marker-end="url(#stArr)"/>
        <text x="655" y="170" text-anchor="middle" fill="#94a3b8" font-size="8">1 query</text>
        <rect x="690" y="155" width="80" height="50" rx="4" fill="#1e293b" stroke="#86efac"/>
        <text x="730" y="180" text-anchor="middle" fill="#86efac" font-size="10" font-weight="700">DB OK</text>
        <defs>
          <marker id="stArr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <polygon points="0 0, 6 3, 0 6" fill="#94a3b8"/>
          </marker>
        </defs>
      </svg>

      <h2>Hot Keys and Hot Partitions</h2>

      <p>In a sharded cache (Redis Cluster, Memcached with consistent hashing, DynamoDB), every key maps to a single partition. If 90% of your traffic targets one key (the homepage product, the celebrity user&apos;s feed), that key&apos;s partition becomes a hotspot &mdash; saturating one node while others sit idle.</p>

      <p>Detection: per-partition request rate metrics. Cassandra exposes per-token-range metrics; Redis Cluster exposes per-node QPS. A 10x difference between the busiest and average node is a clear hot-key signal.</p>

      <p>Mitigation:</p>
      <ul>
        <li><strong>Local cache as a shield</strong>: each application pod caches the hot key in process for 1&ndash;2 seconds, fronting the distributed cache. Requests to the hot key never leave the pod.</li>
        <li><strong>Key splitting</strong>: instead of <code>product:123</code>, write to <code>product:123:shard1</code>...<code>product:123:shardN</code> and have readers pick a random shard. The hot key becomes N less-hot keys spread across partitions.</li>
        <li><strong>Cache the precomputed answer</strong>: if the hot key feeds 10 different views, compute all 10 once and cache them &mdash; avoid recomputation on every read.</li>
        <li><strong>CDN it</strong>: if it is GET-able, push it to the CDN with a short TTL. The hot key becomes the CDN&apos;s problem, which is built for it.</li>
      </ul>

      <h2>Eviction Policies</h2>

      <p>Caches have finite memory. When full, an eviction policy decides what to discard. Common choices:</p>

      <ul>
        <li><strong>LRU (Least Recently Used)</strong>: evict the entry that has not been accessed for the longest time. The default in most caches. Approximated in Redis (full LRU is too expensive at scale; Redis samples a small subset and evicts the LRU among them).</li>
        <li><strong>LFU (Least Frequently Used)</strong>: evict the least-accessed entry over a window. Better than LRU when access patterns have stable hot/cold distinction (e.g. evergreen vs viral content). Redis 4+ supports approximated LFU.</li>
        <li><strong>FIFO</strong>: evict in insertion order. Simple, rarely the best choice.</li>
        <li><strong>TTL-only</strong> (<code>volatile-ttl</code> in Redis): evict the entry with the soonest expiry first. Useful when you want strict TTL behaviour.</li>
        <li><strong>Random</strong>: evict at random. Surprisingly competitive with LRU in some workloads, much cheaper to implement.</li>
      </ul>

      <p>Redis exposes the choice as <code>maxmemory-policy</code>: <code>allkeys-lru</code>, <code>allkeys-lfu</code>, <code>volatile-lru</code>, <code>volatile-lfu</code>, <code>volatile-ttl</code>, <code>volatile-random</code>, <code>allkeys-random</code>, <code>noeviction</code>. The <code>noeviction</code> setting refuses writes when full &mdash; useful for cache-as-truth use cases (queues, session stores) where data loss is unacceptable.</p>

      <h2>Multi-Region Caching</h2>

      <p>For globally distributed services, you cache regionally to keep latency low. The architecture choices:</p>

      <ul>
        <li><strong>Independent regional caches</strong>: each region has its own Redis cluster; invalidation events are fanned out via a regional pub/sub or via the CDC pipeline. Simple, eventually consistent across regions.</li>
        <li><strong>Active-active with conflict resolution</strong>: writes accepted in any region; replicas converge via CRDTs or LWW. Used by DynamoDB Global Tables.</li>
        <li><strong>Active-passive with read replicas</strong>: a single primary region, read replicas in other regions. Writes pay cross-region latency; reads are local. Used by many cache-as-database deployments.</li>
      </ul>

      <p>The architectural decision tracks the <a href="/blog/distributed-systems-algorithms-production-guide" class="text-primary underline">CAP discussion</a>: you cannot have global strong consistency and local low latency simultaneously.</p>

      <h2>Database-Layer Caching</h2>

      <p>Modern databases include their own caching layers, and the application cache often sits on top of these.</p>

      <ul>
        <li><strong>PostgreSQL shared_buffers</strong>: the database keeps recently-read pages in memory. Tuned via <code>shared_buffers</code> (typical 25% of RAM) and aided by the OS page cache.</li>
        <li><strong>MySQL InnoDB buffer pool</strong>: same idea. <code>innodb_buffer_pool_size</code> typically 50&ndash;75% of RAM.</li>
        <li><strong>MongoDB WiredTiger cache</strong>: in-memory cache of working set.</li>
        <li><strong>DynamoDB DAX</strong>: an opt-in in-memory cache that fronts DynamoDB transparently for read latency.</li>
      </ul>

      <p>Sometimes the database&apos;s own cache is enough &mdash; if your working set fits in <code>shared_buffers</code>, you may not need a separate Redis at all. Always start with database tuning before introducing an external cache.</p>

      <h2>Kubernetes Caching Patterns</h2>

      <p>Kubernetes-specific caching patterns:</p>

      <ul>
        <li><strong>Sidecar cache</strong>: a Redis or Memcached container in the pod. Lowest latency (loopback), but unique cache per pod (multi-pod deployments duplicate). Useful for read-heavy single-tenant services.</li>
        <li><strong>StatefulSet cache</strong>: a dedicated Redis StatefulSet per cluster, accessed via Service DNS. The standard pattern for shared application caches.</li>
        <li><strong>External managed cache</strong>: AWS ElastiCache / GCP Memorystore. The right answer for production at any scale &mdash; outsource the operational burden.</li>
        <li><strong>HTTP cache via ingress</strong>: NGINX Ingress with proxy_cache directives, or a dedicated Varnish layer. Caches at the edge of the cluster.</li>
      </ul>

      <h2>Security Considerations</h2>

      <p>Caches multiply the blast radius of three security failure modes:</p>

      <ol>
        <li><strong>Cross-tenant data leakage</strong>: a cache key that does not include tenant scope can serve one tenant&apos;s data to another. Always include tenant_id in the key.</li>
        <li><strong>Cache poisoning</strong>: an attacker tricks the cache into storing malicious content. Most common with HTTP caches and unkeyed headers (e.g. caching based on Host header that the attacker controls). Use the <code>Vary</code> header carefully and validate cache keys against a whitelist.</li>
        <li><strong>Sensitive data in cache</strong>: PII, secrets, tokens cached without thought. Treat the cache as a separate datastore for compliance purposes &mdash; encryption at rest, access control, audit logs.</li>
      </ol>

      <p>The classic vulnerability is web cache deception (Omer Gil, 2017): an attacker requests <code>example.com/account/profile.css</code> &mdash; the CDN sees the .css extension and caches the response, but the application ignores the extension and serves the user&apos;s authenticated profile. Now the next request for the same path serves that profile to anyone. Cache only what the application explicitly marks as cacheable.</p>

      <p>For the broader API security picture, see the <a href="/games/api-attack-defense" class="text-primary underline">API Attack &amp; Defense Simulator</a> for hands-on practice and the <a href="/courses/cloud-native-security-engineering" class="text-primary underline">Cloud Native Security Engineering course</a> for the systematic walk through.</p>

      <h2>Observability</h2>

      <p>Cache metrics that tell you whether the cache is helping or hurting:</p>

      <ul>
        <li><strong>Hit rate</strong>: hits / (hits + misses). Below ~80% suggests the cache is not earning its keep; above ~99.5% suggests TTLs may be too long or the cache is too oversized.</li>
        <li><strong>Eviction rate</strong>: how often entries are evicted before TTL expiry. High evictions mean memory pressure; either grow the cache or reduce dataset.</li>
        <li><strong>Cache latency p50/p99</strong>: should be sub-millisecond for in-region Redis. p99 spikes indicate hot keys, GC pauses, or network problems.</li>
        <li><strong>Origin load with cache vs without</strong>: derived metric showing the cache&apos;s actual value. Useful for capacity planning and for justifying the cache&apos;s existence.</li>
        <li><strong>Stampede signals</strong>: simultaneous miss spikes for the same key, or duplicate origin queries within a short window.</li>
      </ul>

      <h2>Frequently Asked Questions</h2>

      <h3>Should I use Redis or Memcached?</h3>
      <p>Redis if you need data structures (sorted sets for leaderboards, streams for queues, hashes for object-style records), persistence, or replication. Memcached if you want pure key/value, operational simplicity, and predictable performance at huge scale. Most teams pick Redis by default and never look back.</p>

      <h3>How long should my TTL be?</h3>
      <p>The shortest TTL that keeps your hit rate acceptable. Start with 5 minutes for most user-facing reads, 1 hour for catalog/reference data, 24 hours for slow-moving content (geo databases, ML models). Measure hit rate; adjust.</p>

      <h3>Should I cache the request or the response?</h3>
      <p>Cache at the boundary that gives the most reuse. Caching the database query result is reusable across many endpoints; caching the rendered HTML is faster but only reusable per URL. Both are valid; many systems do both at different layers.</p>

      <h3>How do I avoid the &ldquo;cache and database disagree&rdquo; bug?</h3>
      <p>Use DEL on writes (not SET); use a CDC pipeline for cross-service invalidation; use short TTLs as a safety net so stale entries expire on their own; treat the database as authoritative and the cache as ephemeral.</p>

      <h3>Is in-process caching ever worth it on top of Redis?</h3>
      <p>Yes &mdash; for hot keys it can shave the 1ms Redis call to a few microseconds and dramatically reduce Redis load. Use a small TTL (1&ndash;5 seconds) so staleness is bounded, and keep the cache size small (Caffeine with size limit) to avoid memory pressure.</p>

      <h3>What about caching at the edge with workers (Cloudflare Workers, Lambda@Edge)?</h3>
      <p>Excellent fit for content that varies by region, country, or device class but does not need per-user customisation. Edge workers can compose responses from cached fragments and origin calls, often achieving 95%+ hit rates with sub-50ms latency globally.</p>

      <h2>Where to Go Next</h2>

      <ul>
        <li>Read the <a href="/blog/distributed-systems-algorithms-production-guide" class="text-primary underline">Distributed Systems Algorithms guide</a> for the consensus and replication primitives that determine your cache&apos;s consistency story.</li>
        <li>Walk through the <a href="/blog/rate-limiting-algorithms-production-guide" class="text-primary underline">Rate Limiting Algorithms guide</a> to see how caches and rate limiters interact at the API gateway.</li>
        <li>Try the <a href="/games/secure-architecture-builder" class="text-primary underline">Secure Architecture Builder</a> to practice the architectural decisions where caching shows up (CDN placement, multi-region, secret stores).</li>
        <li>Take the free <a href="/courses/cloud-native-security-engineering" class="text-primary underline">Cloud Native Security Engineering</a> course for the broader picture of how application caches integrate with the cloud-native stack.</li>
      </ul>
    `;
