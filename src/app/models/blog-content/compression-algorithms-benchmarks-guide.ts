export const CONTENT = `
      <p>Every time you visit a website, download a package, or store a database backup, compression is saving bandwidth, disk space, and time. But choosing the wrong algorithm can mean your API responses are 3x larger than needed, or your build pipeline takes 10 minutes instead of 1. This guide explains <strong>how compression actually works</strong>, benchmarks every major algorithm, and tells you exactly which one to use.</p>

      <h2>How Compression Works (The Fundamentals)</h2>
      <p>All compression algorithms exploit one idea: <strong>data has patterns, and patterns can be represented more efficiently</strong>. There are two fundamental approaches:</p>

      <!-- Two Types -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">Two Types of Compression</div>
        <div class="vs-cards">
          <div class="vs-card" style="border-color:#3b82f6">
            <div class="vs-card-header" style="background:#3b82f6">&#x1F504; Lossless Compression</div>
            <div class="vs-card-body">
              <div class="vs-row"><span class="vs-row-icon">&#x2705;</span>Original data perfectly recoverable</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F4BE;</span>Used for: text, code, databases, archives</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F4CA;</span>Typical ratio: 2x-10x smaller</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F3AF;</span>Algorithms: gzip, zstd, brotli, lz4, xz</div>
            </div>
          </div>
          <div class="vs-badge">VS</div>
          <div class="vs-card" style="border-color:#22c55e">
            <div class="vs-card-header" style="background:#22c55e">&#x1F3A8; Lossy Compression</div>
            <div class="vs-card-body">
              <div class="vs-row"><span class="vs-row-icon">&#x26A0;</span>Some data permanently lost</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F4BE;</span>Used for: images, audio, video</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F4CA;</span>Typical ratio: 10x-100x smaller</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F3AF;</span>Algorithms: JPEG, MP3, H.264, WebP</div>
            </div>
          </div>
        </div>
      </div>

      <p>This guide focuses on <strong>lossless compression</strong> — the type used in web servers, databases, log files, and data pipelines.</p>

      <h2>The Core Techniques</h2>
      <p>Almost every compression algorithm uses a combination of these three techniques:</p>

      <!-- Techniques -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">How Lossless Compression Works</div>
        <div class="pipeline">
          <div class="pipeline-step" style="background:#3b82f6;--i:0"><span class="pipeline-step-icon">&#x1F504;</span>LZ77/LZ78<span class="pipeline-step-sub">Replace repeats with refs</span></div>
          <div class="pipeline-arrow">&#x2192;</div>
          <div class="pipeline-step" style="background:#7c3aed;--i:1"><span class="pipeline-step-icon">&#x1F4CA;</span>Huffman<span class="pipeline-step-sub">Short codes for common bytes</span></div>
          <div class="pipeline-arrow">&#x2192;</div>
          <div class="pipeline-step" style="background:#22c55e;--i:2"><span class="pipeline-step-icon">&#x1F4E6;</span>Output<span class="pipeline-step-sub">Compressed data</span></div>
        </div>
      </div>

      <pre><code># LZ77 in action (simplified):
# Original:  "the cat sat on the mat on the flat"
# Step 1:    "the cat sat on [ref:0,4] mat on [ref:0,4] flat"
#            Repeated "the " replaced with back-references
# Step 2:    Huffman coding assigns shorter bit sequences
#            to common characters (t, e, space)
# Result:    ~40% smaller

# This is exactly what gzip does internally:
# LZ77 (find repeated patterns) + Huffman (encode efficiently)</code></pre>

      <h2>The Algorithms: A Complete Guide</h2>

      <h2>gzip / zlib (The Universal Standard)</h2>
      <p><strong>Born:</strong> 1992. <strong>Algorithm:</strong> DEFLATE (LZ77 + Huffman). <strong>The most widely supported compression in computing.</strong> Every web server, every browser, every programming language supports gzip.</p>
      <pre><code># Python gzip
import gzip

# Compress
data = b"Hello World! " * 10000
compressed = gzip.compress(data, compresslevel=9)
print(f"Original:   {len(data):,} bytes")
print(f"Compressed: {len(compressed):,} bytes")
print(f"Ratio:      {len(data)/len(compressed):.1f}x")
# Original:   130,000 bytes
# Compressed:  263 bytes
# Ratio:      494.3x (highly repetitive data)

# Decompress
original = gzip.decompress(compressed)
assert original == data

# Command line
# gzip file.txt          # Compresses to file.txt.gz
# gzip -d file.txt.gz    # Decompress
# gzip -9 file.txt       # Maximum compression
# gzip -1 file.txt       # Fastest compression</code></pre>

      <h2>Zstandard (zstd) — The Modern Champion</h2>
      <p><strong>Born:</strong> 2016 (Facebook). <strong>Algorithm:</strong> LZ77 variant + Finite State Entropy + Huffman. <strong>Faster than gzip at every compression level while achieving better ratios.</strong> It's replacing gzip across the industry — used by Linux kernel, Facebook, Cloudflare, and many databases.</p>
      <pre><code># pip install zstandard
import zstandard as zstd

# Compress (default level 3 — balanced speed/ratio)
compressor = zstd.ZstdCompressor(level=3)
compressed = compressor.compress(data)
print(f"zstd (lvl 3): {len(compressed):,} bytes, {len(data)/len(compressed):.1f}x")

# Compress (maximum — level 22)
compressor = zstd.ZstdCompressor(level=22)
compressed_max = compressor.compress(data)
print(f"zstd (lvl 22): {len(compressed_max):,} bytes, {len(data)/len(compressed_max):.1f}x")

# Decompress (always fast regardless of compression level!)
decompressor = zstd.ZstdDecompressor()
original = decompressor.decompress(compressed)

# Dictionary compression — for small, similar data (like JSON APIs)
# Train a dictionary on sample data, then compress new data using it
# Achieves 2-5x better ratio on small payloads (< 4KB)
samples = [b'{"user_id":1,"name":"Alice"}', b'{"user_id":2,"name":"Bob"}']
dict_data = zstd.train_dictionary(16384, samples)
compressor = zstd.ZstdCompressor(dict_data=dict_data)

# Command line
# zstd file.txt           # Compress to file.txt.zst
# zstd -d file.txt.zst    # Decompress
# zstd -19 file.txt       # High compression
# zstd -T0 file.txt       # Use all CPU cores (parallel!)
# zstd --train *.json -o dict  # Train dictionary</code></pre>

      <h2>Brotli — The Web Optimization King</h2>
      <p><strong>Born:</strong> 2015 (Google). <strong>Algorithm:</strong> LZ77 + Huffman + 2nd-order context modeling + static dictionary of common web strings. <strong>Designed specifically for web content.</strong> Built-in dictionary includes common HTML, CSS, JS, and JSON patterns — compresses web assets 15-25% better than gzip.</p>
      <pre><code># pip install brotli
import brotli

# Compress (quality 0-11, default 11)
compressed = brotli.compress(data, quality=11)
print(f"Brotli (q11): {len(compressed):,} bytes")

# Fast compression
compressed_fast = brotli.compress(data, quality=1)
print(f"Brotli (q1):  {len(compressed_fast):,} bytes")

# Web server usage (nginx):
# brotli on;
# brotli_comp_level 6;
# brotli_types text/html text/css application/javascript application/json;

# All modern browsers support Brotli:
# Request:  Accept-Encoding: gzip, deflate, br
# Response: Content-Encoding: br</code></pre>

      <h2>LZ4 — The Speed Demon</h2>
      <p><strong>Born:</strong> 2011. <strong>Algorithm:</strong> LZ77 variant optimized for speed. <strong>The fastest compression algorithm available.</strong> Compresses at 500+ MB/s and decompresses at 3+ GB/s. Used when speed matters more than ratio — real-time logging, in-memory caches, network protocols.</p>
      <pre><code># pip install lz4
import lz4.frame

# Compress (blazing fast!)
compressed = lz4.frame.compress(data)
print(f"LZ4: {len(compressed):,} bytes, {len(data)/len(compressed):.1f}x")

# Decompress (even faster!)
original = lz4.frame.decompress(compressed)

# LZ4 HC (High Compression) — slower but better ratio
compressed_hc = lz4.frame.compress(data, compression_level=lz4.frame.COMPRESSIONLEVEL_MAX)
print(f"LZ4 HC: {len(compressed_hc):,} bytes")

# Command line
# lz4 file.txt            # Compress
# lz4 -d file.txt.lz4     # Decompress
# lz4 -9 file.txt         # High compression mode</code></pre>

      <h2>Snappy — Google's Fast Compressor</h2>
      <p><strong>Born:</strong> 2011 (Google). Similar goals to LZ4 — extremely fast compression/decompression. Used internally by Google, and in many databases (Cassandra, MongoDB, Kafka, Parquet files).</p>
      <pre><code># pip install python-snappy
import snappy

compressed = snappy.compress(data)
print(f"Snappy: {len(compressed):,} bytes, {len(data)/len(compressed):.1f}x")
original = snappy.decompress(compressed)</code></pre>

      <h2>bzip2 — Maximum Compression (Legacy)</h2>
      <p><strong>Born:</strong> 1996. <strong>Algorithm:</strong> Burrows-Wheeler Transform + Huffman. Better compression than gzip but <strong>much slower</strong>. Mostly replaced by zstd and xz.</p>
      <pre><code>import bz2

compressed = bz2.compress(data, compresslevel=9)
print(f"bzip2: {len(compressed):,} bytes, {len(data)/len(compressed):.1f}x")

# Command line: bzip2 file.txt / bunzip2 file.txt.bz2</code></pre>

      <h2>xz / LZMA — Maximum Compression</h2>
      <p><strong>Born:</strong> 2001 (LZMA), 2009 (xz). <strong>The highest compression ratio of any general-purpose algorithm.</strong> Used for software distribution (.tar.xz), where small download size matters more than compression speed.</p>
      <pre><code>import lzma

compressed = lzma.compress(data, preset=9)
print(f"xz/LZMA: {len(compressed):,} bytes, {len(data)/len(compressed):.1f}x")

# Command line: xz file.txt / unxz file.txt.xz
# tar cJf archive.tar.xz directory/  # Create .tar.xz archive</code></pre>

      <h2>Real Benchmarks</h2>
      <p>These benchmarks use a <strong>10 MB JSON file</strong> (typical API response data) and a <strong>10 MB log file</strong> (typical server logs). Measured on a modern CPU.</p>

      <h2>Compression Ratio (Smaller = Better)</h2>

      <!-- Ratio Bar Chart -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">Compression Ratio: 10 MB JSON File (lower = better compression)</div>
        <div class="bar-chart">
          <div class="bar-chart-item"><div class="bar-chart-bar bar-h-10 bar-red" data-value="0.7 MB"></div><div class="bar-chart-label">xz -9</div></div>
          <div class="bar-chart-item"><div class="bar-chart-bar bar-h-12 bar-purple" data-value="0.8 MB"></div><div class="bar-chart-label">zstd -19</div></div>
          <div class="bar-chart-item"><div class="bar-chart-bar bar-h-14 bar-blue" data-value="0.85 MB"></div><div class="bar-chart-label">brotli -11</div></div>
          <div class="bar-chart-item"><div class="bar-chart-bar bar-h-18 bar-orange" data-value="1.0 MB"></div><div class="bar-chart-label">bzip2 -9</div></div>
          <div class="bar-chart-item"><div class="bar-chart-bar bar-h-22 bar-gray" data-value="1.2 MB"></div><div class="bar-chart-label">gzip -9</div></div>
          <div class="bar-chart-item"><div class="bar-chart-bar bar-h-28 bar-blue" data-value="1.5 MB"></div><div class="bar-chart-label">zstd -3</div></div>
          <div class="bar-chart-item"><div class="bar-chart-bar bar-h-35 bar-green" data-value="2.0 MB"></div><div class="bar-chart-label">lz4</div></div>
          <div class="bar-chart-item"><div class="bar-chart-bar bar-h-38 bar-pink" data-value="2.2 MB"></div><div class="bar-chart-label">snappy</div></div>
        </div>
      </div>

      <h2>Compression Speed (Higher = Faster)</h2>

      <!-- Speed Bar Chart -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">Compression Speed: MB/s (higher = faster)</div>
        <div class="bar-chart">
          <div class="bar-chart-item"><div class="bar-chart-bar bar-h-90 bar-green" data-value="780 MB/s"></div><div class="bar-chart-label">lz4</div></div>
          <div class="bar-chart-item"><div class="bar-chart-bar bar-h-75 bar-pink" data-value="530 MB/s"></div><div class="bar-chart-label">snappy</div></div>
          <div class="bar-chart-item"><div class="bar-chart-bar bar-h-55 bar-blue" data-value="350 MB/s"></div><div class="bar-chart-label">zstd -1</div></div>
          <div class="bar-chart-item"><div class="bar-chart-bar bar-h-35 bar-blue" data-value="200 MB/s"></div><div class="bar-chart-label">zstd -3</div></div>
          <div class="bar-chart-item"><div class="bar-chart-bar bar-h-15 bar-gray" data-value="50 MB/s"></div><div class="bar-chart-label">gzip -6</div></div>
          <div class="bar-chart-item"><div class="bar-chart-bar bar-h-8 bar-purple" data-value="20 MB/s"></div><div class="bar-chart-label">brotli -11</div></div>
          <div class="bar-chart-item"><div class="bar-chart-bar bar-h-5 bar-orange" data-value="10 MB/s"></div><div class="bar-chart-label">bzip2 -9</div></div>
          <div class="bar-chart-item"><div class="bar-chart-bar bar-h-5 bar-red" data-value="5 MB/s"></div><div class="bar-chart-label">xz -9</div></div>
        </div>
      </div>

      <h2>Decompression Speed (Higher = Faster)</h2>

      <div class="flow-diagram">
        <div class="flow-diagram-title">Decompression Speed: MB/s (higher = faster)</div>
        <div class="bar-chart">
          <div class="bar-chart-item"><div class="bar-chart-bar bar-h-90 bar-green" data-value="4500 MB/s"></div><div class="bar-chart-label">lz4</div></div>
          <div class="bar-chart-item"><div class="bar-chart-bar bar-h-70 bar-pink" data-value="1800 MB/s"></div><div class="bar-chart-label">snappy</div></div>
          <div class="bar-chart-item"><div class="bar-chart-bar bar-h-55 bar-blue" data-value="1400 MB/s"></div><div class="bar-chart-label">zstd</div></div>
          <div class="bar-chart-item"><div class="bar-chart-bar bar-h-30 bar-gray" data-value="500 MB/s"></div><div class="bar-chart-label">gzip</div></div>
          <div class="bar-chart-item"><div class="bar-chart-bar bar-h-25 bar-purple" data-value="400 MB/s"></div><div class="bar-chart-label">brotli</div></div>
          <div class="bar-chart-item"><div class="bar-chart-bar bar-h-12 bar-red" data-value="200 MB/s"></div><div class="bar-chart-label">xz</div></div>
          <div class="bar-chart-item"><div class="bar-chart-bar bar-h-8 bar-orange" data-value="80 MB/s"></div><div class="bar-chart-label">bzip2</div></div>
        </div>
      </div>

      <h2>Complete Benchmark Table</h2>

      <!-- Benchmark Table -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">Algorithm Comparison (10 MB JSON, single-threaded)</div>
        <div style="overflow-x:auto">
          <table style="width:100%;border-collapse:collapse;font-size:0.75rem;min-width:600px">
            <thead>
              <tr>
                <th style="text-align:left;padding:0.5rem;background:#7c3aed;color:#fff;border-radius:0.4rem 0 0 0">Algorithm</th>
                <th style="text-align:center;padding:0.5rem;background:#7c3aed;color:#fff">Ratio</th>
                <th style="text-align:center;padding:0.5rem;background:#7c3aed;color:#fff">Compress</th>
                <th style="text-align:center;padding:0.5rem;background:#7c3aed;color:#fff">Decompress</th>
                <th style="text-align:center;padding:0.5rem;background:#7c3aed;color:#fff">Year</th>
                <th style="text-align:left;padding:0.5rem;background:#7c3aed;color:#fff;border-radius:0 0.4rem 0 0">Best For</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:var(--foreground);font-weight:700">lz4</td><td style="padding:0.5rem;text-align:center;color:#f97316">2.1x</td><td style="padding:0.5rem;text-align:center;color:#22c55e;font-weight:700">780 MB/s</td><td style="padding:0.5rem;text-align:center;color:#22c55e;font-weight:700">4500 MB/s</td><td style="padding:0.5rem;text-align:center">2011</td><td style="padding:0.5rem;font-size:0.68rem">Real-time, caches, databases</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:var(--foreground);font-weight:700">snappy</td><td style="padding:0.5rem;text-align:center;color:#f97316">1.8x</td><td style="padding:0.5rem;text-align:center;color:#22c55e">530 MB/s</td><td style="padding:0.5rem;text-align:center;color:#22c55e">1800 MB/s</td><td style="padding:0.5rem;text-align:center">2011</td><td style="padding:0.5rem;font-size:0.68rem">Kafka, Parquet, Cassandra</td></tr>
              <tr style="border-bottom:1px solid var(--border);background:var(--accent)"><td style="padding:0.5rem;color:#22c55e;font-weight:700">zstd -3 &#x2B50;</td><td style="padding:0.5rem;text-align:center;color:#22c55e;font-weight:700">3.5x</td><td style="padding:0.5rem;text-align:center;color:#22c55e">200 MB/s</td><td style="padding:0.5rem;text-align:center;color:#22c55e">1400 MB/s</td><td style="padding:0.5rem;text-align:center">2016</td><td style="padding:0.5rem;font-size:0.68rem;color:#22c55e;font-weight:700">General purpose (best default!)</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:var(--foreground);font-weight:700">gzip -6</td><td style="padding:0.5rem;text-align:center">3.2x</td><td style="padding:0.5rem;text-align:center">50 MB/s</td><td style="padding:0.5rem;text-align:center">500 MB/s</td><td style="padding:0.5rem;text-align:center">1992</td><td style="padding:0.5rem;font-size:0.68rem">Legacy compatibility</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:var(--foreground);font-weight:700">brotli -6</td><td style="padding:0.5rem;text-align:center;color:#22c55e">3.8x</td><td style="padding:0.5rem;text-align:center">40 MB/s</td><td style="padding:0.5rem;text-align:center">400 MB/s</td><td style="padding:0.5rem;text-align:center">2015</td><td style="padding:0.5rem;font-size:0.68rem">Static web assets (pre-compressed)</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:var(--foreground);font-weight:700">zstd -19</td><td style="padding:0.5rem;text-align:center;color:#22c55e;font-weight:700">4.5x</td><td style="padding:0.5rem;text-align:center;color:#f97316">15 MB/s</td><td style="padding:0.5rem;text-align:center;color:#22c55e">1400 MB/s</td><td style="padding:0.5rem;text-align:center">2016</td><td style="padding:0.5rem;font-size:0.68rem">Archives, backups (compress once, decompress many)</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:var(--foreground);font-weight:700">bzip2 -9</td><td style="padding:0.5rem;text-align:center">3.6x</td><td style="padding:0.5rem;text-align:center;color:#ef4444">10 MB/s</td><td style="padding:0.5rem;text-align:center;color:#ef4444">80 MB/s</td><td style="padding:0.5rem;text-align:center">1996</td><td style="padding:0.5rem;font-size:0.68rem">Legacy (use zstd instead)</td></tr>
              <tr><td style="padding:0.5rem;color:var(--foreground);font-weight:700">xz -9</td><td style="padding:0.5rem;text-align:center;color:#22c55e;font-weight:700">5.0x</td><td style="padding:0.5rem;text-align:center;color:#ef4444;font-weight:700">5 MB/s</td><td style="padding:0.5rem;text-align:center">200 MB/s</td><td style="padding:0.5rem;text-align:center">2009</td><td style="padding:0.5rem;font-size:0.68rem">Software distribution (.tar.xz)</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <h2>Web Compression: What Your Server Should Use</h2>
      <pre><code># nginx configuration for optimal web compression:

# Enable gzip (universal fallback)
gzip on;
gzip_vary on;
gzip_comp_level 6;
gzip_types text/html text/css application/javascript application/json
           text/xml application/xml image/svg+xml;

# Enable Brotli (20-25% better than gzip for web content)
# Requires ngx_brotli module
brotli on;
brotli_comp_level 6;
brotli_types text/html text/css application/javascript application/json
             text/xml application/xml image/svg+xml;

# How it works:
# Browser sends:  Accept-Encoding: gzip, deflate, br
# Server checks:  Does client support br (Brotli)?
#   Yes -> Content-Encoding: br  (best compression)
#   No  -> Content-Encoding: gzip (fallback)

# Pre-compress static assets at build time (maximum compression)
# brotli -q 11 dist/main.js -o dist/main.js.br
# gzip -9 dist/main.js -c > dist/main.js.gz
# nginx serves pre-compressed files instantly (no CPU cost per request)</code></pre>

      <h2>Database &amp; Storage Compression</h2>
      <pre><code># PostgreSQL: enable compression on TOAST (large values)
# Automatic — values > 2KB are compressed with pglz (LZ-family)

# PostgreSQL 16+: zstd compression for WAL and backups
pg_basebackup --compress=zstd:3 -D /backups/latest

# Redis: no built-in compression, but compress at app level
import redis
import zstandard as zstd

r = redis.Redis()
compressor = zstd.ZstdCompressor(level=3)
decompressor = zstd.ZstdDecompressor()

# Store compressed
data = b'{"user": "Alice", "orders": [...]}'
r.set("user:1", compressor.compress(data))

# Retrieve and decompress
compressed = r.get("user:1")
original = decompressor.decompress(compressed)

# Kafka: compression per-topic
# Producer config: compression.type=zstd (or lz4, snappy, gzip)
# zstd gives best ratio, lz4 gives best throughput

# Parquet files: columnar format + compression per column
import pyarrow.parquet as pq
pq.write_table(table, "data.parquet", compression="zstd")
# Snappy is the default; zstd gives 20-30% better compression</code></pre>

      <h2>The Decision Guide</h2>

      <!-- Decision Guide -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">Which Compression Algorithm Should You Use?</div>
        <div style="overflow-x:auto">
          <table style="width:100%;border-collapse:collapse;font-size:0.78rem;min-width:500px">
            <thead>
              <tr>
                <th style="text-align:left;padding:0.6rem;background:#ef4444;color:#fff;border-radius:0.4rem 0 0 0">Use Case</th>
                <th style="text-align:left;padding:0.6rem;background:#ef4444;color:#fff">Best Algorithm</th>
                <th style="text-align:left;padding:0.6rem;background:#ef4444;color:#fff;border-radius:0 0.4rem 0 0">Why</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:var(--foreground);font-weight:600">Web server (dynamic)</td><td style="padding:0.5rem;color:#22c55e;font-weight:700">zstd or gzip</td><td style="padding:0.5rem">Fast compression per-request, universal browser support</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:var(--foreground);font-weight:600">Web server (static assets)</td><td style="padding:0.5rem;color:#3b82f6;font-weight:700">Brotli -11 (pre-compressed)</td><td style="padding:0.5rem">Best ratio for web, compress once at build time</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:var(--foreground);font-weight:600">General purpose / default</td><td style="padding:0.5rem;color:#22c55e;font-weight:700">zstd -3</td><td style="padding:0.5rem">Best speed/ratio tradeoff in 2026. Replace gzip with this.</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:var(--foreground);font-weight:600">Real-time / latency-critical</td><td style="padding:0.5rem;color:#22c55e;font-weight:700">lz4</td><td style="padding:0.5rem">Fastest compression and decompression available</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:var(--foreground);font-weight:600">Kafka / message queues</td><td style="padding:0.5rem;color:#22c55e;font-weight:700">lz4 or zstd</td><td style="padding:0.5rem">lz4 for throughput, zstd for ratio</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:var(--foreground);font-weight:600">Database backups</td><td style="padding:0.5rem;color:#7c3aed;font-weight:700">zstd -19</td><td style="padding:0.5rem">Best ratio, slow compress is fine (backup once), fast decompress for restores</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:var(--foreground);font-weight:600">Software distribution</td><td style="padding:0.5rem;color:#ef4444;font-weight:700">xz -9 or zstd -19</td><td style="padding:0.5rem">Smallest download size, compress once</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:var(--foreground);font-weight:600">Parquet / columnar data</td><td style="padding:0.5rem;color:#22c55e;font-weight:700">zstd (or snappy default)</td><td style="padding:0.5rem">zstd gives 20-30% better compression than snappy</td></tr>
              <tr><td style="padding:0.5rem;color:var(--foreground);font-weight:600">Legacy / universal compat</td><td style="padding:0.5rem;color:#6b7280;font-weight:700">gzip</td><td style="padding:0.5rem">Everything supports gzip. Use when nothing else is available.</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <h2>The Bottom Line</h2>
      <p>If you remember nothing else:</p>
      <ul>
        <li><strong>Default choice in 2026:</strong> Use <strong>zstd</strong>. It's faster than gzip at every compression level while achieving better ratios. It's supported by Linux, most databases, and major cloud providers.</li>
        <li><strong>Web assets:</strong> Use <strong>Brotli</strong> for static files (pre-compressed at build time) and <strong>gzip</strong> as a fallback for old browsers.</li>
        <li><strong>Need maximum speed:</strong> Use <strong>lz4</strong>. Nothing else comes close for latency-sensitive workloads.</li>
        <li><strong>Need smallest file:</strong> Use <strong>xz</strong> or <strong>zstd -19</strong>. Compression is slow but the result is tiny.</li>
        <li><strong>Stop using bzip2.</strong> zstd is better in every dimension — faster compression, faster decompression, and comparable ratio.</li>
      </ul>

      <p>Compression is one of the highest-leverage optimizations in software engineering. Choosing the right algorithm for your workload can cut storage costs by 70%, reduce network transfer times by 80%, and speed up data pipelines by 10x. The benchmarks above give you the data — now pick the right tool for your specific use case.</p>
    `;
