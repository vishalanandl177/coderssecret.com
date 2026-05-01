export const CONTENT = `
      <p>You write code every day that runs on a CPU, but do you actually know what happens inside that chip when your <code>for</code> loop executes? Understanding CPU architecture doesn't just satisfy curiosity — it explains <em>why</em> certain code patterns are fast and others are slow. This guide gives you a developer-friendly mental model of how modern CPUs work, without requiring an electrical engineering degree.</p>

      <h2>The Big Picture: What a CPU Does</h2>
      <p>At its core (pun intended), a CPU does exactly three things, billions of times per second:</p>

      <!-- Fetch-Decode-Execute -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">The Fetch-Decode-Execute Cycle</div>
        <div class="pipeline">
          <div class="pipeline-step" style="background:#3b82f6;--i:0"><span class="pipeline-step-icon">&#x1F4E5;</span>Fetch<span class="pipeline-step-sub">Get next instruction from memory</span></div>
          <div class="pipeline-arrow">&#x2192;</div>
          <div class="pipeline-step" style="background:#7c3aed;--i:1"><span class="pipeline-step-icon">&#x1F50D;</span>Decode<span class="pipeline-step-sub">Figure out what it means</span></div>
          <div class="pipeline-arrow">&#x2192;</div>
          <div class="pipeline-step" style="background:#22c55e;--i:2"><span class="pipeline-step-icon">&#x26A1;</span>Execute<span class="pipeline-step-sub">Do the math / move the data</span></div>
          <div class="pipeline-arrow">&#x2192;</div>
          <div class="pipeline-step" style="background:#f97316;--i:3"><span class="pipeline-step-icon">&#x1F4BE;</span>Write Back<span class="pipeline-step-sub">Store the result</span></div>
        </div>
      </div>

      <p>That's it. Every program you've ever written — from "Hello World" to a Kubernetes controller — boils down to this cycle running billions of times per second. A modern CPU at 5 GHz does this cycle 5,000,000,000 times per second. Per core.</p>

      <h2>Inside a Modern CPU Core</h2>

      <!-- CPU Core Architecture -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">Anatomy of a Single CPU Core</div>
        <div class="layer-diagram">
          <div class="layer-item" style="background:#3b82f6">Front End (Fetch + Decode)<span class="layer-item-sub">Instruction cache (L1i), instruction decoder, branch predictor, micro-op queue</span></div>
          <div class="layer-item" style="background:#7c3aed">Scheduler / Rename Unit<span class="layer-item-sub">Reorders instructions for maximum throughput. Maps logical to physical registers.</span></div>
          <div class="layer-item" style="background:#22c55e">Execution Units (Back End)<span class="layer-item-sub">ALU (math), FPU (floating point), SIMD (vector), AGU (memory addresses), branch unit</span></div>
          <div class="layer-item" style="background:#f97316">Memory Subsystem<span class="layer-item-sub">L1d cache (data), load/store buffers, TLB (virtual memory translation)</span></div>
          <div class="layer-item" style="background:#ef4444">Retirement Unit<span class="layer-item-sub">Commits results in program order. Handles exceptions and mispredictions.</span></div>
        </div>
      </div>

      <h2>Key Concept 1: Pipelining</h2>
      <p>Instead of finishing one instruction completely before starting the next, CPUs overlap them — like a factory assembly line. While instruction 1 is being executed, instruction 2 is being decoded, and instruction 3 is being fetched. A modern CPU has 15-20 pipeline stages.</p>

      <pre><code>// Without pipelining (1 instruction at a time):
// Clock 1: Fetch A
// Clock 2: Decode A
// Clock 3: Execute A
// Clock 4: Fetch B        &#x2190; B waits for A to finish
// Clock 5: Decode B
// 3 instructions = 9 clocks

// With pipelining (overlap stages):
// Clock 1: Fetch A
// Clock 2: Decode A  |  Fetch B
// Clock 3: Execute A |  Decode B  |  Fetch C
// Clock 4: Write A   |  Execute B |  Decode C
// 3 instructions = 4 clocks (after pipeline fills)

// The pipeline is WHY branch mispredictions are expensive:
// If the CPU guessed the wrong branch, it has to FLUSH
// 15-20 stages of work and start over. ~15 wasted cycles.</code></pre>

      <h2>Key Concept 2: Branch Prediction</h2>
      <p>When the CPU hits an <code>if</code> statement, it doesn't wait to evaluate the condition — it <strong>guesses</strong> which branch will be taken and starts executing it speculatively. Modern branch predictors guess correctly <strong>95-99% of the time</strong>.</p>

      <pre><code>// Why sorted data is faster to process (famous Stack Overflow question):

// Unsorted: [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5, 8...]
// Branch: if (x > 5) { sum += x; }
// Pattern: N,N,N,N,Y,Y,N,Y,N,N,Y,Y  &#x2190; Random! Predictor ~50% accuracy
// 50% misprediction = 50% * 15 cycles penalty = SLOW

// Sorted: [1, 1, 2, 3, 3, 4, 5, 5, 5, 6, 8, 9...]
// Pattern: N,N,N,N,N,N,N,N,N,Y,Y,Y  &#x2190; Predictable! ~99% accuracy
// Almost no mispredictions = FAST

// In C:
// Sorted array:   sum loop takes ~2.5s
// Unsorted array: sum loop takes ~12.0s
// 5x slower — same data, same algorithm, just unsorted!</code></pre>

      <h2>Key Concept 3: Out-of-Order Execution</h2>
      <p>Modern CPUs don't execute instructions in the order you wrote them. They look at upcoming instructions and execute whichever ones are ready — even if they appear later in the program:</p>

      <pre><code>// Your code:
a = load(x)      // Takes 300 cycles if x is in RAM
b = load(y)      // Also 300 cycles (independent of a)
c = a + 1        // Depends on a
d = b + 2        // Depends on b
e = c + d        // Depends on both

// CPU's execution (out of order):
// Cycle 1:   Start loading x AND y simultaneously (both independent!)
// Cycle 300: a and b arrive from RAM
// Cycle 301: Compute c=a+1 AND d=b+2 simultaneously
// Cycle 302: Compute e=c+d
// Total: ~302 cycles

// Without OoO (in order):
// Cycle 1:   Start loading x
// Cycle 300: a arrives. Start loading y
// Cycle 600: b arrives. Compute c, then d, then e
// Total: ~603 cycles — 2x slower!</code></pre>

      <h2>Key Concept 4: SIMD (Single Instruction, Multiple Data)</h2>
      <p>Modern CPUs have special registers (128-bit SSE, 256-bit AVX, 512-bit AVX-512) that can process 4, 8, or 16 values in a single instruction:</p>

      <pre><code>// Normal: add 4 numbers one by one
a[0] += b[0];  // 1 cycle
a[1] += b[1];  // 1 cycle
a[2] += b[2];  // 1 cycle
a[3] += b[3];  // 1 cycle
// Total: 4 cycles

// SIMD (AVX): add 4 numbers in ONE instruction
__m256 va = _mm256_load_ps(a);
__m256 vb = _mm256_load_ps(b);
__m256 vc = _mm256_add_ps(va, vb);  // 1 cycle for ALL 4!
_mm256_store_ps(a, vc);
// Total: ~1 cycle (4x speedup)

// NumPy uses SIMD internally — that's why:
// numpy.add(a, b) is 10-50x faster than a Python for loop
// It's doing the same math but 8 numbers at a time via AVX</code></pre>

      <h2>Multi-Core: Why More Cores != Proportionally Faster</h2>

      <!-- Core Scaling -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">Why Adding Cores Has Diminishing Returns (Amdahl's Law)</div>
        <div class="bar-chart">
          <div class="bar-chart-item"><div class="bar-chart-bar bar-h-25 bar-blue" data-value="1x"></div><div class="bar-chart-label">1 core</div></div>
          <div class="bar-chart-item"><div class="bar-chart-bar bar-h-45 bar-blue" data-value="1.8x"></div><div class="bar-chart-label">2 cores</div></div>
          <div class="bar-chart-item"><div class="bar-chart-bar bar-h-60 bar-green" data-value="3.2x"></div><div class="bar-chart-label">4 cores</div></div>
          <div class="bar-chart-item"><div class="bar-chart-bar bar-h-70 bar-green" data-value="5.5x"></div><div class="bar-chart-label">8 cores</div></div>
          <div class="bar-chart-item"><div class="bar-chart-bar bar-h-78 bar-purple" data-value="7x"></div><div class="bar-chart-label">16 cores</div></div>
          <div class="bar-chart-item"><div class="bar-chart-bar bar-h-82 bar-orange" data-value="8x"></div><div class="bar-chart-label">32 cores</div></div>
        </div>
      </div>

      <p><strong>Amdahl's Law:</strong> If 20% of your program is sequential (can't be parallelized), then even with infinite cores, you can only get a maximum 5x speedup. That sequential 20% becomes the bottleneck.</p>

      <h2>What This Means for Your Code</h2>

      <!-- Practical Implications -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">CPU Architecture Implications for Developers</div>
        <div style="overflow-x:auto">
          <table style="width:100%;border-collapse:collapse;font-size:0.78rem;min-width:500px">
            <thead>
              <tr>
                <th style="text-align:left;padding:0.6rem;background:#7c3aed;color:#fff;border-radius:0.4rem 0 0 0">CPU Feature</th>
                <th style="text-align:left;padding:0.6rem;background:#7c3aed;color:#fff">What to Do in Your Code</th>
                <th style="text-align:left;padding:0.6rem;background:#7c3aed;color:#fff;border-radius:0 0.4rem 0 0">What to Avoid</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:var(--foreground);font-weight:700">Pipelining</td><td style="padding:0.5rem">Write branchless code in hot loops</td><td style="padding:0.5rem;color:#ef4444">Unpredictable branches in tight loops</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:var(--foreground);font-weight:700">Branch Prediction</td><td style="padding:0.5rem">Sort data before processing; use lookup tables</td><td style="padding:0.5rem;color:#ef4444">Random branching patterns</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:var(--foreground);font-weight:700">Out-of-Order</td><td style="padding:0.5rem">Keep computations independent when possible</td><td style="padding:0.5rem;color:#ef4444">Long dependency chains</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:var(--foreground);font-weight:700">SIMD</td><td style="padding:0.5rem">Use NumPy, BLAS, vectorized ops; align data</td><td style="padding:0.5rem;color:#ef4444">Scalar loops over large arrays</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:var(--foreground);font-weight:700">Cache</td><td style="padding:0.5rem">Sequential memory access; keep working set small</td><td style="padding:0.5rem;color:#ef4444">Random access; pointer chasing</td></tr>
              <tr><td style="padding:0.5rem;color:var(--foreground);font-weight:700">Multi-core</td><td style="padding:0.5rem">Parallelize independent work; minimize shared state</td><td style="padding:0.5rem;color:#ef4444">Lock contention; false sharing</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <p>You don't need to think about this for every line of code. But for performance-critical paths — inner loops, data pipelines, real-time systems — understanding your CPU is the difference between "fast enough" and "10x faster than the competition."</p>
    `;
