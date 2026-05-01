export const CONTENT = `
      <p>You wrote a Python script that processes 10,000 files, but it takes 30 minutes because it handles them one by one. You've heard about "threading" and "multiprocessing" but you're not sure which to use — or what the difference even is. This guide explains Python's concurrency models from the ground up, with diagrams and real code you can run.</p>

      <h2>First: What Does "Concurrency" Mean?</h2>
      <p>Imagine a restaurant kitchen. <strong>Sequential processing</strong> means one chef does everything — chops vegetables, then cooks meat, then plates the dish. <strong>Concurrency</strong> means multiple tasks make progress at the same time. But there are two ways to achieve this:</p>

      <!-- Concurrency vs Parallelism -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">Concurrency vs Parallelism</div>
        <div class="vs-cards">
          <div class="vs-card" style="border-color:#3b82f6">
            <div class="vs-card-header" style="background:#3b82f6">&#x1F504; Concurrency (Threading)</div>
            <div class="vs-card-body">
              <div class="vs-row"><span class="vs-row-icon">&#x1F468;&#x200D;&#x1F373;</span>One chef, switching tasks rapidly</div>
              <div class="vs-row"><span class="vs-row-icon">&#x23F1;</span>Chop a bit, stir the pot, chop more</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F4BB;</span>One CPU core, time-slicing</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F3AF;</span>Best for: waiting tasks (I/O)</div>
            </div>
          </div>
          <div class="vs-badge">VS</div>
          <div class="vs-card" style="border-color:#22c55e">
            <div class="vs-card-header" style="background:#22c55e">&#x26A1; Parallelism (Multiprocessing)</div>
            <div class="vs-card-body">
              <div class="vs-row"><span class="vs-row-icon">&#x1F468;&#x200D;&#x1F373;&#x1F468;&#x200D;&#x1F373;</span>Multiple chefs, working simultaneously</div>
              <div class="vs-row"><span class="vs-row-icon">&#x23F1;</span>Each chef handles a full dish</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F4BB;</span>Multiple CPU cores, true parallel</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F3AF;</span>Best for: computation tasks (CPU)</div>
            </div>
          </div>
        </div>
      </div>

      <h2>The GIL: Python's Biggest Gotcha</h2>
      <p>Before we dive into code, you need to understand the <strong>Global Interpreter Lock (GIL)</strong>. It's the single most important concept for Python concurrency.</p>
      <p>The GIL is a mutex (lock) in CPython that allows <strong>only one thread to execute Python bytecode at a time</strong>. Even if you create 10 threads on a machine with 10 CPU cores, only one thread runs Python code at any given moment.</p>

      <!-- GIL Diagram -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">How the GIL Works</div>
        <div class="layer-diagram">
          <div class="layer-item" style="background:#ef4444">The GIL (Global Interpreter Lock)<span class="layer-item-sub">Only ONE thread can hold the GIL and execute Python code at a time</span></div>
          <div class="layer-item" style="background:#3b82f6">Thread 1: Hold GIL &#x2192; Run code &#x2192; Release GIL &#x2192; Wait...<span class="layer-item-sub">Gets the lock, runs for a bit, gives it up</span></div>
          <div class="layer-item" style="background:#7c3aed">Thread 2: Wait... &#x2192; Hold GIL &#x2192; Run code &#x2192; Release GIL<span class="layer-item-sub">Waits its turn, then runs when Thread 1 releases</span></div>
          <div class="layer-item" style="background:#f97316">Thread 3: Wait... &#x2192; Wait... &#x2192; Hold GIL &#x2192; Run code<span class="layer-item-sub">Threads take turns — no true parallelism for CPU work!</span></div>
        </div>
      </div>

      <p><strong>Why does the GIL exist?</strong> It simplifies CPython's memory management. Python objects use reference counting for garbage collection, and the GIL prevents race conditions on reference counts. Without it, every object access would need its own lock — much slower.</p>

      <p><strong>Key insight:</strong> The GIL only blocks <em>CPU-bound</em> work. When a thread does I/O (network request, file read, database query), it <strong>releases the GIL</strong> while waiting. This is why threading works great for I/O but not for computation.</p>

      <h2>Threading: Perfect for I/O-Bound Work</h2>
      <p>Use <code>threading</code> when your program spends most of its time <strong>waiting</strong> — for network responses, file I/O, database queries, or API calls.</p>

      <pre><code>import threading
import time
import requests

# ── Sequential (SLOW) ──────────────────────────
def fetch_url(url):
    response = requests.get(url)
    return f"{url}: {response.status_code}"

urls = [
    "https://httpbin.org/delay/1",
    "https://httpbin.org/delay/1",
    "https://httpbin.org/delay/1",
    "https://httpbin.org/delay/1",
    "https://httpbin.org/delay/1",
]

# Sequential: each request waits for the previous one
start = time.time()
for url in urls:
    print(fetch_url(url))
print(f"Sequential: {time.time() - start:.1f}s")
# Output: ~5.0s (1 second per request x 5)

# ── Threaded (FAST) ───────────────────────────
results = []

def fetch_and_store(url):
    result = fetch_url(url)
    results.append(result)

start = time.time()
threads = []
for url in urls:
    t = threading.Thread(target=fetch_and_store, args=(url,))
    threads.append(t)
    t.start()

# Wait for all threads to finish
for t in threads:
    t.join()

for r in results:
    print(r)
print(f"Threaded: {time.time() - start:.1f}s")
# Output: ~1.1s (all 5 requests run simultaneously!)
# That's a 5x speedup — because threads release the GIL during I/O</code></pre>

      <!-- Why Threading Works for I/O -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">Why Threading Works for I/O</div>
        <div class="seq-diagram">
          <div class="seq-actors">
            <div class="seq-actor browser">Thread 1</div>
            <div class="seq-actor idp">Thread 2</div>
            <div class="seq-actor sp">Thread 3</div>
          </div>
          <div class="seq-steps">
            <div class="seq-step">
              <div class="seq-arrow right" style="--arrow-color:#3b82f6"><span class="seq-num blue">1</span> Send HTTP request</div>
              <div></div>
              <div></div>
            </div>
            <div class="seq-step">
              <div class="seq-action" style="border-color:#3b82f6;color:#60a5fa;grid-column:1">&#x23F3; Waiting (GIL released)</div>
              <div class="seq-arrow right" style="--arrow-color:#7c3aed"><span class="seq-num purple">2</span> Send HTTP request</div>
            </div>
            <div class="seq-step">
              <div class="seq-action" style="border-color:#3b82f6;color:#60a5fa;grid-column:1">&#x23F3; Still waiting...</div>
              <div class="seq-action" style="border-color:#7c3aed;color:#a78bfa">&#x23F3; Waiting</div>
              <div class="seq-arrow right" style="--arrow-color:#22c55e"><span class="seq-num green">3</span> Send HTTP</div>
            </div>
            <div class="seq-step">
              <div class="seq-arrow left" style="--arrow-color:#22c55e"><span class="seq-num green">&#x2705;</span> All responses arrive ~simultaneously</div>
            </div>
          </div>
        </div>
      </div>

      <h2>ThreadPoolExecutor: The Modern Way</h2>
      <p>Instead of manually creating threads, use <code>concurrent.futures.ThreadPoolExecutor</code> — it manages a pool of reusable threads and returns results cleanly:</p>
      <pre><code>from concurrent.futures import ThreadPoolExecutor, as_completed
import requests
import time

def fetch_url(url):
    """Fetch a URL and return the status code."""
    response = requests.get(url, timeout=10)
    return {"url": url, "status": response.status_code, "size": len(response.content)}

urls = [f"https://httpbin.org/delay/{i % 3}" for i in range(10)]

# ── ThreadPoolExecutor ─────────────────────────
start = time.time()

with ThreadPoolExecutor(max_workers=5) as executor:
    # Submit all tasks
    future_to_url = {executor.submit(fetch_url, url): url for url in urls}

    # Collect results as they complete (not in submission order!)
    for future in as_completed(future_to_url):
        url = future_to_url[future]
        try:
            result = future.result()
            print(f"  {result['url']}: {result['status']} ({result['size']} bytes)")
        except Exception as e:
            print(f"  {url}: ERROR - {e}")

print(f"\\nCompleted in {time.time() - start:.1f}s")
# 10 URLs with max 2s delay each, 5 workers = ~4s total (not 15s!)</code></pre>

      <h2>Multiprocessing: True Parallelism for CPU Work</h2>
      <p>When your program is <strong>CPU-bound</strong> (number crunching, image processing, data transformation), threads won't help because of the GIL. Instead, use <code>multiprocessing</code> — it spawns separate Python processes, each with its own GIL and its own CPU core.</p>

      <!-- Threading vs Multiprocessing -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">Threading vs Multiprocessing — Under the Hood</div>
        <div class="vs-cards">
          <div class="vs-card" style="border-color:#3b82f6">
            <div class="vs-card-header" style="background:#3b82f6">&#x1F9F5; Threading</div>
            <div class="vs-card-body">
              <div class="vs-row"><span class="vs-row-icon">&#x1F4BB;</span>Same process, shared memory</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F512;</span>Shared GIL (one thread at a time)</div>
              <div class="vs-row"><span class="vs-row-icon">&#x26A1;</span>Lightweight (fast to create)</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F4BE;</span>Low memory overhead</div>
              <div class="vs-row"><span class="vs-row-icon">&#x26A0;</span>Race conditions possible</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F3AF;</span>Best for: I/O-bound work</div>
            </div>
          </div>
          <div class="vs-badge">VS</div>
          <div class="vs-card" style="border-color:#22c55e">
            <div class="vs-card-header" style="background:#22c55e">&#x2699; Multiprocessing</div>
            <div class="vs-card-body">
              <div class="vs-row"><span class="vs-row-icon">&#x1F4BB;</span>Separate processes, isolated memory</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F513;</span>Separate GIL per process (true parallel!)</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F422;</span>Heavier (slower to create)</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F4BE;</span>Higher memory (copies of data)</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F6E1;</span>No race conditions (isolated)</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F3AF;</span>Best for: CPU-bound work</div>
            </div>
          </div>
        </div>
      </div>

      <pre><code>import multiprocessing
import time
import math

# ── CPU-heavy function ─────────────────────────
def is_prime(n):
    """Check if a number is prime (CPU-intensive for large numbers)."""
    if n < 2:
        return False
    for i in range(2, int(math.sqrt(n)) + 1):
        if n % i == 0:
            return False
    return True

def count_primes(start, end):
    """Count primes in a range."""
    count = sum(1 for n in range(start, end) if is_prime(n))
    return count

RANGE_END = 500_000

# ── Sequential ─────────────────────────────────
start = time.time()
result = count_primes(0, RANGE_END)
print(f"Sequential: {result} primes in {time.time() - start:.1f}s")
# Output: 41538 primes in ~3.5s

# ── Threaded (NO improvement for CPU work!) ────
start = time.time()
with ThreadPoolExecutor(max_workers=4) as executor:
    chunk_size = RANGE_END // 4
    futures = [
        executor.submit(count_primes, i * chunk_size, (i + 1) * chunk_size)
        for i in range(4)
    ]
    result = sum(f.result() for f in futures)
print(f"Threaded (4 threads): {result} primes in {time.time() - start:.1f}s")
# Output: 41538 primes in ~3.8s (SLOWER! GIL prevents parallelism)

# ── Multiprocessing (REAL speedup!) ────────────
start = time.time()
with multiprocessing.Pool(processes=4) as pool:
    chunk_size = RANGE_END // 4
    chunks = [(i * chunk_size, (i + 1) * chunk_size) for i in range(4)]
    results = pool.starmap(count_primes, chunks)
    result = sum(results)
print(f"Multiprocessing (4 processes): {result} primes in {time.time() - start:.1f}s")
# Output: 41538 primes in ~1.0s (3.5x speedup on 4 cores!)</code></pre>

      <!-- Benchmark Bar Chart -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">CPU-Bound Benchmark: Count Primes to 500K (lower is better)</div>
        <div class="bar-chart">
          <div class="bar-chart-item"><div class="bar-chart-bar bar-h-90 bar-gray" data-value="~3.5s"></div><div class="bar-chart-label">Sequential</div></div>
          <div class="bar-chart-item"><div class="bar-chart-bar bar-h-95 bar-blue" data-value="~3.8s"></div><div class="bar-chart-label">Threading (4)</div></div>
          <div class="bar-chart-item"><div class="bar-chart-bar bar-h-25 bar-green" data-value="~1.0s"></div><div class="bar-chart-label">Multiprocessing (4)</div></div>
        </div>
      </div>

      <p><strong>Notice:</strong> Threading is actually <em>slower</em> than sequential for CPU work! The GIL means threads take turns, plus there's overhead from context switching. Multiprocessing gives a near-linear speedup because each process has its own GIL on its own CPU core.</p>

      <h2>ProcessPoolExecutor: The Clean Way</h2>
      <pre><code>from concurrent.futures import ProcessPoolExecutor
import time

def heavy_computation(n):
    """Simulate CPU-intensive work."""
    total = 0
    for i in range(n):
        total += i ** 2
    return total

numbers = [10_000_000] * 8  # 8 heavy tasks

# ── ProcessPoolExecutor ────────────────────────
start = time.time()
with ProcessPoolExecutor(max_workers=4) as executor:
    results = list(executor.map(heavy_computation, numbers))
print(f"ProcessPool: {time.time() - start:.1f}s")

# Compare with sequential:
start = time.time()
results = [heavy_computation(n) for n in numbers]
print(f"Sequential: {time.time() - start:.1f}s")
# ProcessPool is ~3-4x faster on a 4-core machine</code></pre>

      <h2>asyncio: The Third Option</h2>
      <p><strong>asyncio</strong> is Python's built-in async/await framework. Like threading, it's for I/O-bound work — but instead of creating OS threads, it uses a <strong>single-threaded event loop</strong> with cooperative multitasking. It's lighter than threading and scales to thousands of concurrent connections.</p>
      <pre><code>import asyncio
import aiohttp
import time

async def fetch_url(session, url):
    """Fetch a URL asynchronously."""
    async with session.get(url) as response:
        content = await response.read()
        return {"url": url, "status": response.status, "size": len(content)}

async def main():
    urls = [f"https://httpbin.org/delay/{i % 3}" for i in range(10)]

    async with aiohttp.ClientSession() as session:
        # Launch ALL requests concurrently
        tasks = [fetch_url(session, url) for url in urls]
        results = await asyncio.gather(*tasks)

    for r in results:
        print(f"  {r['url']}: {r['status']} ({r['size']} bytes)")

start = time.time()
asyncio.run(main())
print(f"\\nasyncio: {time.time() - start:.1f}s")
# Same speed as threading (~2s), but uses only 1 thread!
# Can handle 10,000+ concurrent connections efficiently</code></pre>

      <h2>Real-World Example: Image Processing Pipeline</h2>
      <p>Let's build a practical pipeline that downloads images (I/O-bound) and resizes them (CPU-bound) using the right tool for each:</p>
      <pre><code>from concurrent.futures import ThreadPoolExecutor, ProcessPoolExecutor
from PIL import Image
import requests
import io
import time

def download_image(url):
    """Download an image (I/O-bound — use threads)."""
    response = requests.get(url, timeout=10)
    return response.content

def resize_image(image_bytes):
    """Resize an image to 300x300 (CPU-bound — use processes)."""
    img = Image.open(io.BytesIO(image_bytes))
    img = img.resize((300, 300), Image.LANCZOS)
    buffer = io.BytesIO()
    img.save(buffer, format="JPEG", quality=85)
    return buffer.getvalue()

# Sample image URLs
image_urls = [
    "https://picsum.photos/2000/2000",  # Random 2000x2000 images
] * 20  # 20 images

# Step 1: Download all images using THREADS (I/O-bound)
start = time.time()
with ThreadPoolExecutor(max_workers=10) as executor:
    raw_images = list(executor.map(download_image, image_urls))
print(f"Downloaded {len(raw_images)} images in {time.time() - start:.1f}s")

# Step 2: Resize all images using PROCESSES (CPU-bound)
start = time.time()
with ProcessPoolExecutor(max_workers=4) as executor:
    resized = list(executor.map(resize_image, raw_images))
print(f"Resized {len(resized)} images in {time.time() - start:.1f}s")

# The RIGHT tool for each job:
# - Threads for downloading (waiting for network)
# - Processes for resizing (CPU-intensive pixel manipulation)</code></pre>

      <h2>Thread Safety: Race Conditions and Locks</h2>
      <p>When multiple threads share data, you can get <strong>race conditions</strong> — bugs where the result depends on which thread runs first:</p>
      <pre><code>import threading

# ── BROKEN: Race condition ─────────────────────
counter = 0

def increment():
    global counter
    for _ in range(100_000):
        counter += 1  # NOT atomic! Read + Modify + Write

threads = [threading.Thread(target=increment) for _ in range(5)]
for t in threads:
    t.start()
for t in threads:
    t.join()

print(f"Expected: 500,000")
print(f"Actual:   {counter}")  # Something like 387,421 (WRONG!)
# Why? Two threads read counter=100, both write 101, losing one increment

# ── FIXED: Using a Lock ───────────────────────
counter = 0
lock = threading.Lock()

def safe_increment():
    global counter
    for _ in range(100_000):
        with lock:  # Only one thread can be inside this block at a time
            counter += 1

threads = [threading.Thread(target=safe_increment) for _ in range(5)]
for t in threads:
    t.start()
for t in threads:
    t.join()

print(f"Expected: 500,000")
print(f"Actual:   {counter}")  # Exactly 500,000 &#x2705;

# ── BEST: Use thread-safe data structures ──────
from queue import Queue
from collections import Counter

# Queue is thread-safe by default — no locks needed
task_queue = Queue()
for i in range(1000):
    task_queue.put(i)

results = []
results_lock = threading.Lock()

def worker():
    while not task_queue.empty():
        try:
            item = task_queue.get_nowait()
            result = item ** 2  # Process the item
            with results_lock:
                results.append(result)
        except:
            break

threads = [threading.Thread(target=worker) for _ in range(4)]
for t in threads:
    t.start()
for t in threads:
    t.join()
print(f"Processed {len(results)} items")  # 1000 &#x2705;</code></pre>

      <h2>Sharing Data Between Processes</h2>
      <p>Processes have <strong>isolated memory</strong> — they can't share variables like threads can. Use these mechanisms to communicate:</p>
      <pre><code>import multiprocessing

# ── Method 1: Shared Value ─────────────────────
counter = multiprocessing.Value('i', 0)  # 'i' = integer
lock = multiprocessing.Lock()

def increment_shared(counter, lock):
    for _ in range(100_000):
        with lock:
            counter.value += 1

processes = [
    multiprocessing.Process(target=increment_shared, args=(counter, lock))
    for _ in range(4)
]
for p in processes:
    p.start()
for p in processes:
    p.join()
print(f"Shared counter: {counter.value}")  # 400,000 &#x2705;

# ── Method 2: Queue (producer-consumer) ────────
def producer(queue):
    for i in range(100):
        queue.put(f"item-{i}")
    queue.put(None)  # Poison pill = "stop"

def consumer(queue, results):
    while True:
        item = queue.get()
        if item is None:
            break
        results.append(item.upper())

queue = multiprocessing.Queue()
manager = multiprocessing.Manager()
results = manager.list()  # Shared list across processes

p1 = multiprocessing.Process(target=producer, args=(queue,))
p2 = multiprocessing.Process(target=consumer, args=(queue, results))
p1.start()
p2.start()
p1.join()
p2.join()
print(f"Processed: {len(results)} items")  # 100

# ── Method 3: Pool.map (simplest for batch work) ──
with multiprocessing.Pool(4) as pool:
    results = pool.map(str.upper, ["hello", "world", "python"])
print(results)  # ['HELLO', 'WORLD', 'PYTHON']</code></pre>

      <h2>The Complete Decision Guide</h2>

      <!-- Decision Tree -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">Which Concurrency Model Should You Use?</div>
        <div class="dtree">
          <div class="dtree-node question">What kind of work?</div>
          <div class="dtree-branches">
            <div class="dtree-branch">
              <div class="dtree-label">I/O-bound (network, files, DB)?</div>
              <div class="dtree-connector blue"></div>
              <div class="dtree-answer oidc">Threading or asyncio<span class="dtree-answer-sub">Threads release GIL during I/O</span></div>
            </div>
            <div class="dtree-branch">
              <div class="dtree-label">CPU-bound (math, data, images)?</div>
              <div class="dtree-connector green"></div>
              <div class="dtree-answer both">Multiprocessing<span class="dtree-answer-sub">Separate GIL per process</span></div>
            </div>
            <div class="dtree-branch">
              <div class="dtree-label">Both I/O + CPU mixed?</div>
              <div class="dtree-connector orange"></div>
              <div class="dtree-answer saml">Threads for I/O + Processes for CPU<span class="dtree-answer-sub">Combine both!</span></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Comparison Table -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">Threading vs Multiprocessing vs asyncio — Complete Comparison</div>
        <div style="overflow-x:auto">
          <table style="width:100%;border-collapse:collapse;font-size:0.78rem;min-width:550px">
            <thead>
              <tr>
                <th style="text-align:left;padding:0.6rem;background:var(--muted);color:var(--foreground);border-radius:0.4rem 0 0 0">Feature</th>
                <th style="text-align:center;padding:0.6rem;background:#3b82f6;color:#fff">Threading</th>
                <th style="text-align:center;padding:0.6rem;background:#22c55e;color:#fff">Multiprocessing</th>
                <th style="text-align:center;padding:0.6rem;background:#a855f7;color:#fff;border-radius:0 0.4rem 0 0">asyncio</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:var(--foreground);font-weight:600">Best for</td><td style="padding:0.5rem;text-align:center;color:#3b82f6;font-weight:700">I/O-bound</td><td style="padding:0.5rem;text-align:center;color:#22c55e;font-weight:700">CPU-bound</td><td style="padding:0.5rem;text-align:center;color:#a855f7;font-weight:700">I/O-bound (high concurrency)</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:var(--foreground);font-weight:600">GIL impact</td><td style="padding:0.5rem;text-align:center;color:#ef4444">Blocked for CPU work</td><td style="padding:0.5rem;text-align:center;color:#22c55e">Bypassed (separate GILs)</td><td style="padding:0.5rem;text-align:center;color:#f97316">Same as threading</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:var(--foreground);font-weight:600">Memory</td><td style="padding:0.5rem;text-align:center;color:#22c55e">Shared (lightweight)</td><td style="padding:0.5rem;text-align:center;color:#ef4444">Isolated (heavy)</td><td style="padding:0.5rem;text-align:center;color:#22c55e">Shared (lightest)</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:var(--foreground);font-weight:600">Overhead</td><td style="padding:0.5rem;text-align:center;color:var(--foreground)">Low</td><td style="padding:0.5rem;text-align:center;color:var(--foreground)">High (process spawn)</td><td style="padding:0.5rem;text-align:center;color:var(--foreground)">Lowest</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:var(--foreground);font-weight:600">Max concurrent</td><td style="padding:0.5rem;text-align:center;color:var(--foreground)">~100-1000 threads</td><td style="padding:0.5rem;text-align:center;color:var(--foreground)">= CPU cores</td><td style="padding:0.5rem;text-align:center;color:#22c55e;font-weight:700">10,000+ tasks</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:var(--foreground);font-weight:600">Data sharing</td><td style="padding:0.5rem;text-align:center;color:#f97316">Shared (need locks)</td><td style="padding:0.5rem;text-align:center;color:var(--foreground)">Queue / Pipe / Manager</td><td style="padding:0.5rem;text-align:center;color:#22c55e">Shared (single thread)</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:var(--foreground);font-weight:600">Learning curve</td><td style="padding:0.5rem;text-align:center;color:#22c55e">Easy</td><td style="padding:0.5rem;text-align:center;color:#f97316">Medium</td><td style="padding:0.5rem;text-align:center;color:#f97316">Medium (async/await)</td></tr>
              <tr><td style="padding:0.5rem;color:var(--foreground);font-weight:600">Use when</td><td style="padding:0.5rem;text-align:center;font-size:0.7rem">API calls, file I/O, web scraping</td><td style="padding:0.5rem;text-align:center;font-size:0.7rem">Math, image processing, ML</td><td style="padding:0.5rem;text-align:center;font-size:0.7rem">Web servers, chat, 1000s of connections</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <h2>Common Mistakes Beginners Make</h2>
      <ul>
        <li><strong>Using threading for CPU work:</strong> The GIL means threads take turns for CPU tasks. Use <code>multiprocessing</code> instead.</li>
        <li><strong>Creating too many processes:</strong> Each process copies your entire program's memory. 100 processes on a 4-core machine wastes RAM and adds overhead. Match <code>max_workers</code> to your CPU core count.</li>
        <li><strong>Forgetting to join threads/processes:</strong> Always call <code>.join()</code> or use a context manager (<code>with</code>) to wait for completion. Otherwise your program may exit before workers finish.</li>
        <li><strong>Sharing mutable state without locks:</strong> If two threads modify the same variable, you'll get race conditions. Use <code>threading.Lock()</code> or thread-safe structures like <code>Queue</code>.</li>
        <li><strong>Not handling exceptions in workers:</strong> Exceptions in threads/processes are swallowed silently unless you check <code>future.result()</code> or wrap in try/except.</li>
        <li><strong>Using <code>multiprocessing</code> for I/O:</strong> It works, but you're paying process spawn overhead for no benefit. Use threads or asyncio for I/O.</li>
      </ul>

      <h2>Quick Reference</h2>
      <pre><code># ── I/O-bound: Use ThreadPoolExecutor ──────────
from concurrent.futures import ThreadPoolExecutor
with ThreadPoolExecutor(max_workers=10) as pool:
    results = list(pool.map(fetch_url, urls))

# ── CPU-bound: Use ProcessPoolExecutor ─────────
from concurrent.futures import ProcessPoolExecutor
with ProcessPoolExecutor(max_workers=4) as pool:
    results = list(pool.map(heavy_computation, data))

# ── High-concurrency I/O: Use asyncio ──────────
import asyncio
async def main():
    results = await asyncio.gather(*[fetch(url) for url in urls])
asyncio.run(main())

# ── Mixed workload: Combine both ───────────────
# Step 1: ThreadPool for I/O (download files)
# Step 2: ProcessPool for CPU (process files)
# This is the most common real-world pattern!</code></pre>

      <p>Python's concurrency story is simpler than it looks: <strong>threads for waiting, processes for computing, asyncio for massive I/O scale</strong>. The GIL is not a bug — it's a design choice that makes single-threaded Python fast and safe. Once you understand it, choosing the right tool becomes second nature. Start with <code>ThreadPoolExecutor</code> and <code>ProcessPoolExecutor</code> — they handle 95% of real-world concurrency needs with clean, readable code.</p>
    `;
