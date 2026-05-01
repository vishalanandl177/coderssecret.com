export const CONTENT = `
      <p>Python has three concurrency models, and most developers use the wrong one. They reach for threading when they need multiprocessing, or multiprocessing when they need asyncio. The choice depends on one question: <strong>is your bottleneck I/O or CPU?</strong></p>

      <h2>The GIL: What It Actually Means</h2>

      <p>The Global Interpreter Lock (GIL) prevents multiple Python threads from executing Python bytecode simultaneously. But it does <strong>not</strong> prevent concurrency &mdash; it prevents parallelism for CPU-bound code.</p>

      <pre><code># The GIL means:
# - Only one thread executes Python code at a time
# - BUT threads release the GIL during I/O operations
# - So I/O-bound threads CAN run concurrently

# CPU-bound: GIL is a bottleneck (use multiprocessing)
# I/O-bound: GIL does not matter (use threading or asyncio)</code></pre>

      <h2>Threading: For I/O-Bound Work</h2>

      <p>When your code waits for network responses, file reads, or database queries, threads release the GIL and other threads can run. Threading is the simplest way to parallelize I/O.</p>

      <pre><code>import concurrent.futures
import requests
import time

urls = [f"https://httpbin.org/delay/1" for _ in range(10)]

# Sequential: 10 seconds (1 second per request)
def fetch_sequential():
    return [requests.get(url).status_code for url in urls]

# Threaded: ~1 second (all requests in parallel)
def fetch_threaded():
    with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
        futures = [executor.submit(requests.get, url) for url in urls]
        return [f.result().status_code for f in futures]

# Benchmark
start = time.time()
fetch_sequential()
print(f"Sequential: {time.time() - start:.1f}s")  # ~10.0s

start = time.time()
fetch_threaded()
print(f"Threaded: {time.time() - start:.1f}s")     # ~1.1s</code></pre>

      <h3>ThreadPoolExecutor Patterns</h3>

      <pre><code># Map pattern: apply function to each item
def download_file(url):
    response = requests.get(url)
    filename = url.split("/")[-1]
    with open(filename, "wb") as f:
        f.write(response.content)
    return filename

with concurrent.futures.ThreadPoolExecutor(max_workers=5) as executor:
    # map() returns results in order
    results = list(executor.map(download_file, urls))

# As-completed pattern: process results as they finish
with concurrent.futures.ThreadPoolExecutor(max_workers=5) as executor:
    futures = {executor.submit(download_file, url): url for url in urls}
    for future in concurrent.futures.as_completed(futures):
        url = futures[future]
        try:
            result = future.result()
            print(f"Downloaded: {result}")
        except Exception as e:
            print(f"Failed {url}: {e}")</code></pre>

      <h2>Asyncio: For Many Concurrent Connections</h2>

      <p>Asyncio uses a single thread with an event loop. It is more efficient than threading when you have thousands of concurrent connections because there is no thread switching overhead.</p>

      <pre><code>import asyncio
import aiohttp

async def fetch_one(session, url):
    async with session.get(url) as response:
        return await response.text()

async def fetch_all(urls):
    async with aiohttp.ClientSession() as session:
        tasks = [fetch_one(session, url) for url in urls]
        return await asyncio.gather(*tasks)

# Run 1000 concurrent requests with ONE thread
urls = [f"https://httpbin.org/delay/1" for _ in range(1000)]
results = asyncio.run(fetch_all(urls))
# Completes in ~2 seconds (not 1000 seconds!)</code></pre>

      <h3>Asyncio Patterns</h3>

      <pre><code># Semaphore: limit concurrency
async def fetch_with_limit(urls, max_concurrent=50):
    semaphore = asyncio.Semaphore(max_concurrent)

    async def bounded_fetch(session, url):
        async with semaphore:
            async with session.get(url) as response:
                return await response.text()

    async with aiohttp.ClientSession() as session:
        tasks = [bounded_fetch(session, url) for url in urls]
        return await asyncio.gather(*tasks)

# Timeout per task
async def fetch_with_timeout(session, url, timeout=5):
    try:
        async with asyncio.timeout(timeout):
            async with session.get(url) as response:
                return await response.text()
    except asyncio.TimeoutError:
        return None

# Producer-consumer with asyncio.Queue
async def producer(queue):
    for i in range(100):
        await queue.put(i)
    await queue.put(None)  # Sentinel

async def consumer(queue, name):
    while True:
        item = await queue.get()
        if item is None:
            queue.put_nowait(None)  # Pass sentinel to next consumer
            break
        await process(item)
        queue.task_done()

async def main():
    queue = asyncio.Queue(maxsize=10)
    await asyncio.gather(
        producer(queue),
        consumer(queue, "worker-1"),
        consumer(queue, "worker-2"),
        consumer(queue, "worker-3"),
    )</code></pre>

      <h2>Multiprocessing: For CPU-Bound Work</h2>

      <p>Each process gets its own Python interpreter and its own GIL. This is the only way to achieve true parallelism for CPU-bound Python code.</p>

      <pre><code>import concurrent.futures
import math

def is_prime(n):
    """CPU-intensive prime check."""
    if n < 2:
        return False
    for i in range(2, int(math.sqrt(n)) + 1):
        if n % i == 0:
            return False
    return True

numbers = [112272535095293, 112582705942171, 115280095190773,
           115797848077099, 1099726899285419, 115280095190773] * 4

# Sequential: uses one CPU core
start = time.time()
results = [is_prime(n) for n in numbers]
print(f"Sequential: {time.time() - start:.1f}s")  # ~8.0s

# Multiprocessing: uses ALL CPU cores
start = time.time()
with concurrent.futures.ProcessPoolExecutor() as executor:
    results = list(executor.map(is_prime, numbers))
print(f"Multiprocessing: {time.time() - start:.1f}s")  # ~2.0s (4 cores)

# Threading: same as sequential (GIL prevents parallel CPU work)
start = time.time()
with concurrent.futures.ThreadPoolExecutor() as executor:
    results = list(executor.map(is_prime, numbers))
print(f"Threading: {time.time() - start:.1f}s")  # ~8.0s (GIL!)</code></pre>

      <h2>Comparison Table</h2>

      <table>
        <thead>
          <tr>
            <th>Feature</th>
            <th>Threading</th>
            <th>Asyncio</th>
            <th>Multiprocessing</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Best for</td>
            <td>I/O-bound (moderate)</td>
            <td>I/O-bound (many connections)</td>
            <td>CPU-bound</td>
          </tr>
          <tr>
            <td>GIL impact</td>
            <td>Released during I/O</td>
            <td>Single-threaded (no GIL issue)</td>
            <td>Separate GIL per process</td>
          </tr>
          <tr>
            <td>Memory overhead</td>
            <td>~8MB per thread</td>
            <td>~1KB per coroutine</td>
            <td>Full process per worker</td>
          </tr>
          <tr>
            <td>Max concurrency</td>
            <td>~100-1000 threads</td>
            <td>~10,000+ coroutines</td>
            <td>~CPU core count</td>
          </tr>
          <tr>
            <td>Shared state</td>
            <td>Easy (same memory)</td>
            <td>Easy (same thread)</td>
            <td>Hard (serialization needed)</td>
          </tr>
          <tr>
            <td>Libraries</td>
            <td>All (requests, etc.)</td>
            <td>Async only (aiohttp, etc.)</td>
            <td>All (separate processes)</td>
          </tr>
          <tr>
            <td>Debugging</td>
            <td>Race conditions possible</td>
            <td>Simpler (no real concurrency bugs)</td>
            <td>Hard (inter-process communication)</td>
          </tr>
        </tbody>
      </table>

      <h2>Decision Framework</h2>

      <ul>
        <li><strong>Making 10-100 HTTP requests?</strong> &rarr; Threading (simple, works with requests library)</li>
        <li><strong>Making 1,000+ concurrent connections?</strong> &rarr; Asyncio (one thread handles thousands)</li>
        <li><strong>Processing images, crunching numbers, ML training?</strong> &rarr; Multiprocessing (true parallelism)</li>
        <li><strong>Web scraping at scale?</strong> &rarr; Asyncio + aiohttp (high concurrency, low memory)</li>
        <li><strong>Django/Flask background tasks?</strong> &rarr; Celery with multiprocessing workers</li>
        <li><strong>Data pipeline with I/O and CPU stages?</strong> &rarr; Asyncio for I/O, multiprocessing for CPU</li>
      </ul>

      <h2>Key Takeaways</h2>

      <ul>
        <li><strong>The GIL prevents parallel CPU work, not concurrent I/O</strong> &mdash; threading works fine for I/O</li>
        <li><strong>Threading is simplest for moderate I/O concurrency</strong> &mdash; no async/await refactoring needed</li>
        <li><strong>Asyncio scales to thousands of connections on one thread</strong> &mdash; use it for high-concurrency I/O</li>
        <li><strong>Multiprocessing is the ONLY option for parallel CPU work</strong> in standard CPython</li>
        <li><strong>concurrent.futures provides a unified API</strong> for both threading and multiprocessing</li>
        <li><strong>Do not use threading for CPU work</strong> &mdash; it will be as slow as sequential due to the GIL</li>
        <li><strong>Asyncio requires async libraries</strong> &mdash; you cannot use requests, only aiohttp or httpx</li>
      </ul>

      <p>Python concurrency is not confusing once you answer one question: is my bottleneck I/O or CPU? I/O-bound gets threading or asyncio. CPU-bound gets multiprocessing. Everything else is implementation detail. Match the tool to the bottleneck and your Python code will be as concurrent as any language.</p>
    `;
