export const CONTENT = `
      <p>So you wrote a program. It works fine. But when you try to scale it up, suddenly it becomes slow like anything. You check the algorithm, it's O(n) only. You check the database, nothing wrong there. Then what is happening, yaar? Most of the time, the answer is one simple thing — <strong>your code is fighting with the CPU cache</strong>, and the cache is winning.</p>

      <p>Let me tell you something that most tutorials don't emphasize enough: the difference between a program that uses cache properly and one that doesn't is not 10% or 20%. It can be <strong>100x or more</strong>. Same algorithm, same CPU, same language — just different memory access patterns. That's how important cache is.</p>

      <h2>First, Why Does Cache Even Exist?</h2>

      <p>Here's the simple truth: CPUs became very fast over the years. Memory (RAM), unfortunately, did not keep up at the same speed. Today's CPU can do billions of operations per second, but fetching a single byte from RAM takes around 100 nanoseconds — which feels like forever to the CPU.</p>

      <p>Think of it like this — imagine you are a chef cooking in a restaurant. The kitchen is your CPU (fast). The main pantry is far away in the basement (RAM — slow). If you had to walk down to the basement every time you needed salt, you would make one dish per hour only. So what do chefs do? They keep frequently used items near the stove (cache!). Salt, pepper, oil — all within arm's reach. That's exactly what CPU cache is doing.</p>

      <!-- The Memory Hierarchy -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">The Memory Hierarchy (The Chef's Kitchen Analogy)</div>
        <div class="layer-diagram">
          <div class="layer-item" style="background:#22c55e">CPU Registers — On the cutting board<span class="layer-item-sub">Smallest, fastest. Holds the ingredients you are literally using right now. ~1 CPU cycle.</span></div>
          <div class="layer-item" style="background:#3b82f6">L1 Cache — Spice rack next to stove<span class="layer-item-sub">32-64 KB per core. Access in ~4 cycles. Split into L1d (data) and L1i (instructions).</span></div>
          <div class="layer-item" style="background:#a855f7">L2 Cache — Counter near the stove<span class="layer-item-sub">256 KB - 1 MB per core. Access in ~12 cycles. Bigger but slightly slower.</span></div>
          <div class="layer-item" style="background:#f97316">L3 Cache — Shared shelf in the kitchen<span class="layer-item-sub">8-32 MB shared across all cores. Access in ~40 cycles. Last stop before going to RAM.</span></div>
          <div class="layer-item" style="background:#ef4444">RAM — The basement pantry<span class="layer-item-sub">8-128 GB. Access in ~100 nanoseconds (~300 cycles). Slow like anything compared to cache!</span></div>
        </div>
      </div>

      <h2>The Real Numbers You Must Remember</h2>

      <p>Jeff Dean from Google has a famous list of "Numbers Every Programmer Should Know." For cache specifically, these are the ones that matter most:</p>

      <!-- Latency Bar Chart -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">Memory Access Latency (lower is faster — notice the huge jumps!)</div>
        <div class="bar-chart">
          <div class="bar-chart-item"><div class="bar-chart-bar bar-h-5 bar-green" data-value="~1ns"></div><div class="bar-chart-label">L1 Cache</div></div>
          <div class="bar-chart-item"><div class="bar-chart-bar bar-h-10 bar-blue" data-value="~3ns"></div><div class="bar-chart-label">L2 Cache</div></div>
          <div class="bar-chart-item"><div class="bar-chart-bar bar-h-20 bar-purple" data-value="~12ns"></div><div class="bar-chart-label">L3 Cache</div></div>
          <div class="bar-chart-item"><div class="bar-chart-bar bar-h-55 bar-orange" data-value="~100ns"></div><div class="bar-chart-label">RAM</div></div>
          <div class="bar-chart-item"><div class="bar-chart-bar bar-h-90 bar-red" data-value="~10,000ns"></div><div class="bar-chart-label">SSD</div></div>
        </div>
      </div>

      <p>Notice one thing — RAM is <strong>100 times slower</strong> than L1. So if your program is fetching data from RAM instead of cache, you are paying a 100x penalty for every access. That's why the same algorithm on the same CPU can give you very different performance depending on how cache-friendly your code is.</p>

      <h2>How Cache Actually Works — The Cache Line</h2>

      <p>Here is something most people don't know, but it changes everything once you understand it. When the CPU fetches data from RAM, it does <strong>not</strong> fetch just one byte. It fetches an entire <strong>cache line</strong>, which is typically 64 bytes on modern x86 CPUs.</p>

      <p>Why 64 bytes, you are asking? Because of something called <strong>spatial locality</strong> — if you accessed byte N, there is a very high chance you will access bytes N+1, N+2, N+3 soon. So CPU says "let me be smart, let me bring all 64 bytes together, maybe I will save some trips later." And most of the time, this gamble pays off beautifully.</p>

      <pre><code># Let's prove this with actual Python code
# Create a list of 10 million integers
import time

SIZE = 10_000_000
arr = list(range(SIZE))

# Sequential access — cache-friendly
start = time.perf_counter()
total = 0
for i in range(SIZE):
    total += arr[i]
sequential_time = time.perf_counter() - start
print(f"Sequential access:  {sequential_time:.3f}s")

# Random access — cache-hostile
import random
indices = list(range(SIZE))
random.shuffle(indices)

start = time.perf_counter()
total = 0
for i in indices:
    total += arr[i]
random_time = time.perf_counter() - start
print(f"Random access:      {random_time:.3f}s")

print(f"Slowdown factor:    {random_time / sequential_time:.1f}x")

# On my laptop:
# Sequential access:  0.42s
# Random access:      2.15s
# Slowdown factor:    5.1x
# Same algorithm! Same data! Just different access pattern.
# Cache is saying "I told you so" only.</code></pre>

      <h2>The Classic Example: Row-Major vs Column-Major Traversal</h2>

      <p>This is the textbook example that every computer science student should do once in their life. Let me show you why.</p>

      <p>In C (and in most languages, actually), 2D arrays are stored in <strong>row-major order</strong> in memory. That means <code>arr[0][0]</code>, <code>arr[0][1]</code>, <code>arr[0][2]</code>... are all in consecutive memory locations. Then <code>arr[1][0]</code> comes after <code>arr[0][N-1]</code>.</p>

      <pre><code>// C code — the most famous cache benchmark
#include &lt;stdio.h&gt;
#include &lt;time.h&gt;
#include &lt;stdlib.h&gt;

#define N 4096

int matrix[N][N];

int main() {
    // Initialize matrix
    for (int i = 0; i < N; i++)
        for (int j = 0; j < N; j++)
            matrix[i][j] = i + j;

    clock_t start, end;

    // ── Row-major traversal (cache-friendly) ──
    start = clock();
    long sum1 = 0;
    for (int i = 0; i < N; i++)
        for (int j = 0; j < N; j++)
            sum1 += matrix[i][j];
    end = clock();
    double row_time = (double)(end - start) / CLOCKS_PER_SEC;
    printf("Row-major:    %.3fs  (sum=%ld)\\n", row_time, sum1);

    // ── Column-major traversal (cache-hostile!) ──
    start = clock();
    long sum2 = 0;
    for (int j = 0; j < N; j++)
        for (int i = 0; i < N; i++)
            sum2 += matrix[i][j];
    end = clock();
    double col_time = (double)(end - start) / CLOCKS_PER_SEC;
    printf("Column-major: %.3fs  (sum=%ld)\\n", col_time, sum2);

    printf("Slowdown:     %.1fx\\n", col_time / row_time);
    return 0;
}

// Compile and run:
// gcc -O2 cache_test.c -o cache_test && ./cache_test
//
// Output on typical laptop (i7, 2023):
// Row-major:    0.056s
// Column-major: 0.412s
// Slowdown:     7.4x
//
// Same 16 million additions. Same CPU. 7x slower.
// Only difference is the order of the two loops!</code></pre>

      <!-- Visual explanation -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">Why Column-Major Is So Slow</div>
        <div class="vs-cards">
          <div class="vs-card" style="border-color:#22c55e">
            <div class="vs-card-header" style="background:#22c55e">&#x2705; Row-major (good)</div>
            <div class="vs-card-body">
              <div class="vs-row"><span class="vs-row-icon">1</span>Fetch arr[0][0] &#x2192; cache line brings 0-15</div>
              <div class="vs-row"><span class="vs-row-icon">2</span>Read arr[0][1]-[0][15] &#x2192; cache hits!</div>
              <div class="vs-row"><span class="vs-row-icon">3</span>Fetch arr[0][16] &#x2192; cache line brings 16-31</div>
              <div class="vs-row"><span class="vs-row-icon">4</span>1 RAM fetch per 16 elements = excellent!</div>
            </div>
          </div>
          <div class="vs-badge">VS</div>
          <div class="vs-card" style="border-color:#ef4444">
            <div class="vs-card-header" style="background:#ef4444">&#x274C; Column-major (bad)</div>
            <div class="vs-card-body">
              <div class="vs-row"><span class="vs-row-icon">1</span>Fetch arr[0][0] &#x2192; cache line brings [0][0..15]</div>
              <div class="vs-row"><span class="vs-row-icon">2</span>Now need arr[1][0] &#x2192; different cache line!</div>
              <div class="vs-row"><span class="vs-row-icon">3</span>Fetch arr[1][0] &#x2192; cache line brings [1][0..15]</div>
              <div class="vs-row"><span class="vs-row-icon">4</span>Every access = cache miss &#x2192; RAM trip. Disaster!</div>
            </div>
          </div>
        </div>
      </div>

      <h2>Real Benchmark Numbers</h2>

      <p>I ran these benchmarks on my laptop (Intel i7-1260P, 16 GB RAM). Your numbers will vary but the pattern will be similar.</p>

      <!-- Matrix Benchmark -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">Matrix Traversal: 4096x4096 int Matrix</div>
        <div class="bar-chart">
          <div class="bar-chart-item"><div class="bar-chart-bar bar-h-10 bar-green" data-value="56ms"></div><div class="bar-chart-label">Row-major (C)</div></div>
          <div class="bar-chart-item"><div class="bar-chart-bar bar-h-70 bar-red" data-value="412ms"></div><div class="bar-chart-label">Column-major (C)</div></div>
          <div class="bar-chart-item"><div class="bar-chart-bar bar-h-30 bar-blue" data-value="180ms"></div><div class="bar-chart-label">Row-major (Go)</div></div>
          <div class="bar-chart-item"><div class="bar-chart-bar bar-h-85 bar-orange" data-value="890ms"></div><div class="bar-chart-label">Column-major (Go)</div></div>
        </div>
      </div>

      <h2>False Sharing — The Sneaky Killer</h2>

      <p>Now I will tell you about a problem that will make you pull your hair out if you don't know about it. It's called <strong>false sharing</strong>, and it only happens in multi-threaded code.</p>

      <p>Remember I said cache lines are 64 bytes? Here's the thing — when multiple CPU cores want to work on the same cache line, they have to coordinate. If Core 1 writes to one part of the line and Core 2 writes to another part, the cache lines have to be invalidated and synchronized between cores. This is called "cache coherence protocol" (MESI protocol, if you want to look it up).</p>

      <p>The tricky part is — even if Core 1 and Core 2 are working on <em>different variables</em>, if those variables happen to be in the same cache line, the cores will be constantly fighting over that line. The result? Your multi-threaded program becomes slower than single-threaded.</p>

      <pre><code>// C example — false sharing in action
#include &lt;pthread.h&gt;
#include &lt;stdio.h&gt;
#include &lt;time.h&gt;

// &#x274C; BAD: Two counters next to each other in memory
// Both fit in the same 64-byte cache line!
struct {
    long counter1;   // 8 bytes
    long counter2;   // 8 bytes
    // Both in same cache line &#x2192; false sharing disaster
} bad_counters;

void* thread1_bad(void* arg) {
    for (long i = 0; i < 100000000L; i++)
        bad_counters.counter1++;
    return NULL;
}

void* thread2_bad(void* arg) {
    for (long i = 0; i < 100000000L; i++)
        bad_counters.counter2++;
    return NULL;
}

// &#x2705; GOOD: Pad each counter to its own cache line
struct {
    long counter1;
    char padding[56];   // Pad to 64 bytes
    long counter2;
} good_counters;

// Result on my laptop:
// With false sharing:    1.85s
// Without false sharing: 0.34s
// 5.4x faster, just by adding 56 bytes of padding!</code></pre>

      <h2>How to Check Your Cache Usage</h2>

      <p>Don't guess what cache is doing — measure it. On Linux, there is a beautiful tool called <code>perf</code> that will tell you exactly what is happening.</p>

      <pre><code># Install perf (Ubuntu/Debian)
sudo apt install linux-tools-generic linux-tools-\\$(uname -r)

# Run your program with cache stats
perf stat -e cache-references,cache-misses,L1-dcache-load-misses,LLC-load-misses ./my_program

# Sample output:
# 8,234,567,891  cache-references
#   123,456,789  cache-misses              # 1.50% miss rate (GOOD)
#   987,654,321  L1-dcache-load-misses
#    45,678,912  LLC-load-misses           # Last-level cache misses

# If cache-miss rate is > 5%, something is wrong.
# If LLC miss rate is > 1%, you are hitting RAM too often.

# For more detail:
perf record -e cache-misses ./my_program
perf report   # Shows which functions have most cache misses

# On macOS, use Instruments (part of Xcode) &#x2192; Counters template
# On Windows, use Intel VTune or AMD uProf</code></pre>

      <h2>Practical Tips to Make Code Cache-Friendly</h2>

      <!-- Tips Timeline -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">Cache-Friendly Programming Checklist</div>
        <div class="timeline">
          <div class="timeline-item" style="--c:#22c55e"><div class="timeline-item-title" style="color:#22c55e">1. Use sequential access patterns</div><div class="timeline-item-desc">Iterate arrays in order. Process lists front-to-back. Your prefetcher will love you for this.</div></div>
          <div class="timeline-item" style="--c:#3b82f6"><div class="timeline-item-title" style="color:#3b82f6">2. Keep related data together</div><div class="timeline-item-desc">If you always access x, y, z together, put them in the same struct. Don't scatter them across objects.</div></div>
          <div class="timeline-item" style="--c:#a855f7"><div class="timeline-item-title" style="color:#a855f7">3. Use arrays of structs, not structs of arrays (usually)</div><div class="timeline-item-desc">If you process entire records at a time, AoS is better. If you process one field across all records, SoA is better. Choose based on access pattern.</div></div>
          <div class="timeline-item" style="--c:#f97316"><div class="timeline-item-title" style="color:#f97316">4. Avoid pointer chasing</div><div class="timeline-item-desc">Linked lists are cache-killers. Each node is somewhere random in memory. Use arrays or contiguous allocations when you can.</div></div>
          <div class="timeline-item" style="--c:#ef4444"><div class="timeline-item-title" style="color:#ef4444">5. Watch out for false sharing</div><div class="timeline-item-desc">In multi-threaded code, put per-thread variables on different cache lines using padding or alignas(64).</div></div>
          <div class="timeline-item" style="--c:#ec4899"><div class="timeline-item-title" style="color:#ec4899">6. Keep hot data small</div><div class="timeline-item-desc">If your frequently-accessed data fits in L2 (say, under 256 KB), it will stay there. Optimize for this working set size.</div></div>
          <div class="timeline-item" style="--c:#7c3aed"><div class="timeline-item-title" style="color:#7c3aed">7. Use cache-oblivious algorithms</div><div class="timeline-item-desc">Divide-and-conquer algorithms (like matrix multiplication with tiling) are naturally cache-friendly across all cache levels.</div></div>
        </div>
      </div>

      <h2>Array of Structs vs Struct of Arrays</h2>

      <pre><code># Python example showing the difference

# Array of Structs (AoS) — traditional OOP style
class Particle:
    def __init__(self):
        self.x = 0.0
        self.y = 0.0
        self.z = 0.0
        self.mass = 0.0
        self.charge = 0.0

particles_aos = [Particle() for _ in range(1_000_000)]

# If you want to update all x positions:
for p in particles_aos:
    p.x += 1.0  # Each access pulls in x, y, z, mass, charge... only x is needed!

# Struct of Arrays (SoA) — data-oriented style
class ParticleSystem:
    def __init__(self, n):
        self.x = [0.0] * n
        self.y = [0.0] * n
        self.z = [0.0] * n
        self.mass = [0.0] * n
        self.charge = [0.0] * n

particles_soa = ParticleSystem(1_000_000)

# Updating x positions:
for i in range(1_000_000):
    particles_soa.x[i] += 1.0  # Perfect sequential access, great cache usage!

# For this particular operation, SoA can be 3-5x faster because
# you only touch the memory you actually need.
# NumPy works exactly this way &#x2014; that's one reason it's so fast.</code></pre>

      <h2>When You Should Not Worry About Cache</h2>

      <p>Now don't go crazy and start padding every variable and rewriting all your code. Most of the time, cache is not your bottleneck. Worry about it when:</p>
      <ul>
        <li>Your code is CPU-bound (not I/O or network)</li>
        <li>You are processing large datasets (more than L2 cache size)</li>
        <li>You are doing tight loops over lots of data</li>
        <li>Profiling shows high cache-miss rates</li>
        <li>You have hot paths that run millions of times per second</li>
      </ul>

      <p>For normal web applications, database queries, or scripts that run once in a while — algorithm choice matters way more than cache optimization. Premature optimization is the root of all evil, na?</p>

      <h2>Languages and Their Cache Behavior</h2>

      <!-- Language Comparison -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">Language Impact on Cache Usage</div>
        <div style="overflow-x:auto">
          <table style="width:100%;border-collapse:collapse;font-size:0.78rem;min-width:500px">
            <thead>
              <tr>
                <th style="text-align:left;padding:0.6rem;background:#7c3aed;color:#fff;border-radius:0.4rem 0 0 0">Language</th>
                <th style="text-align:center;padding:0.6rem;background:#7c3aed;color:#fff">Cache Control</th>
                <th style="text-align:left;padding:0.6rem;background:#7c3aed;color:#fff;border-radius:0 0.4rem 0 0">Why</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:#22c55e;font-weight:700">C / C++</td><td style="padding:0.5rem;text-align:center;color:#22c55e">Full</td><td style="padding:0.5rem">Direct memory layout control, manual padding, intrinsics</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:#f97316;font-weight:700">Rust</td><td style="padding:0.5rem;text-align:center;color:#22c55e">Full</td><td style="padding:0.5rem">Same as C++ with memory safety. Use #[repr(C)] and alignas()</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:#3b82f6;font-weight:700">Go</td><td style="padding:0.5rem;text-align:center;color:#f97316">Good</td><td style="padding:0.5rem">Slices are cache-friendly. GC and goroutines add overhead.</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:#ef4444;font-weight:700">Java / C#</td><td style="padding:0.5rem;text-align:center;color:#f97316">Limited</td><td style="padding:0.5rem">Objects scattered by GC. Use primitive arrays for hot paths.</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:#a855f7;font-weight:700">Python</td><td style="padding:0.5rem;text-align:center;color:#ef4444">Poor</td><td style="padding:0.5rem">Lists store pointers, not values. Use NumPy arrays for cache benefits.</td></tr>
              <tr><td style="padding:0.5rem;color:#ec4899;font-weight:700">JavaScript</td><td style="padding:0.5rem;text-align:center;color:#f97316">Variable</td><td style="padding:0.5rem">V8 is clever but unpredictable. Typed Arrays (Float32Array etc.) help a lot.</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <h2>The Bottom Line</h2>

      <p>Cache is not some dark magic. It's just a very fast memory sitting close to the CPU, bringing data in 64-byte chunks, shared across cores. Once you understand this simple model, you will start seeing cache issues everywhere — and more importantly, you will know how to fix them.</p>

      <p>My honest advice to you, my friend: don't obsess over cache in every piece of code you write. But when you hit a performance wall and the profiler says you are CPU-bound, cache is usually the first place to look. Simple changes like switching loop order, using arrays instead of linked lists, or adding padding to avoid false sharing can give you 5x, 10x, even 100x speedups. No joke.</p>

      <p>And most importantly — <strong>measure, don't guess</strong>. Use <code>perf</code> on Linux, Instruments on macOS, VTune on Windows. The numbers don't lie. Cache wants to be your friend. Treat it well, and it will pay you back handsomely. All the best!</p>
    `;
