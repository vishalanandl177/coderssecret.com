export const CONTENT = `
      <p>Every time you move data between systems — from a database to pandas, from Spark to your ML model, from one microservice to another — you pay a <strong>serialization tax</strong>. The data gets converted from one format to another, copied into new memory layouts, and reassembled on the other side. For large datasets, this overhead can dominate your processing time. <strong>Apache Arrow</strong> eliminates this tax entirely.</p>

      <h2>What is Apache Arrow?</h2>
      <p>Apache Arrow is a <strong>language-independent columnar memory format</strong> for flat and hierarchical data. It defines a standardized way to represent data in memory so that different systems, languages, and libraries can share data with <strong>zero serialization overhead</strong>. Instead of each tool having its own internal format (and paying conversion costs), everyone speaks Arrow.</p>

      <!-- Arrow Overview -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">The Problem Arrow Solves</div>
        <div class="vs-cards">
          <div class="vs-card" style="border-color:#ef4444">
            <div class="vs-card-header" style="background:#ef4444">&#x1F6AB; Without Arrow</div>
            <div class="vs-card-body">
              <div class="vs-row"><span class="vs-row-icon">&#x1F504;</span>Each system has its own format</div>
              <div class="vs-row"><span class="vs-row-icon">&#x23F1;</span>Serialize on send, deserialize on receive</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F4CB;</span>Copy data into new memory layout</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F422;</span>70-80% of time spent on conversion</div>
            </div>
          </div>
          <div class="vs-badge">VS</div>
          <div class="vs-card" style="border-color:#22c55e">
            <div class="vs-card-header" style="background:#22c55e">&#x2705; With Arrow</div>
            <div class="vs-card-body">
              <div class="vs-row"><span class="vs-row-icon">&#x1F91D;</span>Universal format everyone agrees on</div>
              <div class="vs-row"><span class="vs-row-icon">&#x26A1;</span>Zero-copy data sharing between systems</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F4CA;</span>Same memory layout everywhere</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F680;</span>10-100x faster data interchange</div>
            </div>
          </div>
        </div>
      </div>

      <h2>Why Columnar Format?</h2>
      <p>Traditional formats (JSON, CSV, row-based databases) store data <strong>row by row</strong>. Arrow stores data <strong>column by column</strong>. This sounds like a small difference, but it fundamentally changes performance characteristics:</p>

      <!-- Row vs Column -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">Row-Oriented vs Column-Oriented Storage</div>
        <div style="overflow-x:auto">
          <table style="width:100%;border-collapse:collapse;font-size:0.78rem;min-width:500px">
            <thead>
              <tr>
                <th style="text-align:left;padding:0.6rem;background:var(--muted);color:var(--foreground);border-radius:0.4rem 0 0 0">Aspect</th>
                <th style="text-align:center;padding:0.6rem;background:#f97316;color:#fff">Row-Oriented</th>
                <th style="text-align:center;padding:0.6rem;background:#22c55e;color:#fff;border-radius:0 0.4rem 0 0">Column-Oriented (Arrow)</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom:1px solid var(--border)">
                <td style="padding:0.5rem 0.6rem;color:var(--foreground);font-weight:600">Memory layout</td>
                <td style="padding:0.5rem 0.6rem;text-align:center;color:var(--foreground)">[name1, age1, city1, name2, age2, city2...]</td>
                <td style="padding:0.5rem 0.6rem;text-align:center;color:var(--foreground)">[name1, name2...] [age1, age2...] [city1, city2...]</td>
              </tr>
              <tr style="border-bottom:1px solid var(--border)">
                <td style="padding:0.5rem 0.6rem;color:var(--foreground);font-weight:600">Good at</td>
                <td style="padding:0.5rem 0.6rem;text-align:center;color:#f97316;font-weight:700">Single-row lookups (OLTP)</td>
                <td style="padding:0.5rem 0.6rem;text-align:center;color:#22c55e;font-weight:700">Column scans, aggregations (OLAP)</td>
              </tr>
              <tr style="border-bottom:1px solid var(--border)">
                <td style="padding:0.5rem 0.6rem;color:var(--foreground);font-weight:600">SUM(age)</td>
                <td style="padding:0.5rem 0.6rem;text-align:center;color:#ef4444">Slow — reads entire rows to get one column</td>
                <td style="padding:0.5rem 0.6rem;text-align:center;color:#22c55e;font-weight:700">Fast — reads only the age column</td>
              </tr>
              <tr style="border-bottom:1px solid var(--border)">
                <td style="padding:0.5rem 0.6rem;color:var(--foreground);font-weight:600">CPU cache</td>
                <td style="padding:0.5rem 0.6rem;text-align:center;color:#ef4444">Cache misses (mixed types in cache line)</td>
                <td style="padding:0.5rem 0.6rem;text-align:center;color:#22c55e;font-weight:700">Cache-friendly (same type, contiguous)</td>
              </tr>
              <tr style="border-bottom:1px solid var(--border)">
                <td style="padding:0.5rem 0.6rem;color:var(--foreground);font-weight:600">SIMD vectorization</td>
                <td style="padding:0.5rem 0.6rem;text-align:center;color:#ef4444">Not possible (mixed types)</td>
                <td style="padding:0.5rem 0.6rem;text-align:center;color:#22c55e;font-weight:700">Yes — process 4-8 values per CPU cycle</td>
              </tr>
              <tr>
                <td style="padding:0.5rem 0.6rem;color:var(--foreground);font-weight:600">Compression</td>
                <td style="padding:0.5rem 0.6rem;text-align:center;color:#f97316">Moderate (mixed types compress poorly)</td>
                <td style="padding:0.5rem 0.6rem;text-align:center;color:#22c55e;font-weight:700">Excellent (same-type columns compress 10x better)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <h2>Arrow's Memory Layout</h2>
      <p>Every Arrow array is a contiguous memory buffer with a fixed schema. Here's what a simple table looks like in memory:</p>
      <pre><code># Table: users (3 rows)
# | name    | age | active |
# |---------|-----|--------|
# | "Alice" |  30 | true   |
# | "Bob"   |  25 | false  |
# | null    |  35 | true   |

# Arrow memory layout (3 separate buffers):

# Column: name (String type)
# Offsets buffer: [0, 5, 8, 8]     ← where each string starts/ends
# Data buffer:    [A,l,i,c,e,B,o,b] ← all strings concatenated
# Validity bitmap: [1, 1, 0]        ← bit 0 = null, bit 1 = valid

# Column: age (Int32 type)
# Data buffer:    [30, 25, 35]      ← contiguous int32 values
# Validity bitmap: [1, 1, 1]        ← all valid (no nulls)

# Column: active (Boolean type)
# Data buffer:    [1, 0, 1]         ← bit-packed booleans
# Validity bitmap: [1, 1, 1]        ← all valid</code></pre>

      <!-- Memory Layout Diagram -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">Arrow Columnar Memory Layout</div>
        <div class="layer-diagram">
          <div class="layer-item" style="background:#3b82f6">Schema (metadata)<span class="layer-item-sub">Column names, types, nullability — describes the structure</span></div>
          <div class="layer-item" style="background:#a855f7">Validity Bitmaps<span class="layer-item-sub">One bit per value — 0 = null, 1 = valid. Handles nulls with zero overhead.</span></div>
          <div class="layer-item" style="background:#f97316">Offset Buffers (variable-length types)<span class="layer-item-sub">For strings and lists — stores start/end positions in the data buffer</span></div>
          <div class="layer-item" style="background:#22c55e">Data Buffers<span class="layer-item-sub">Contiguous, typed, aligned memory — the actual values, cache-friendly and SIMD-ready</span></div>
        </div>
      </div>

      <h2>Using Arrow in Python (PyArrow)</h2>
      <p><strong>PyArrow</strong> is the Python implementation of Arrow. It's the foundation that powers pandas 2.0, Polars, DuckDB, and most modern Python data tools.</p>
      <pre><code># Install
pip install pyarrow

import pyarrow as pa
import pyarrow.compute as pc

# ── Creating Arrow Arrays ──────────────────────
# Arrow arrays are typed, contiguous memory buffers
int_array = pa.array([1, 2, 3, 4, 5], type=pa.int64())
str_array = pa.array(["Alice", "Bob", None, "Diana"], type=pa.string())
bool_array = pa.array([True, False, True, True])

print(int_array)
# [1, 2, 3, 4, 5]

print(str_array)
# ["Alice", "Bob", null, "Diana"]
# Notice: null is a first-class citizen, not a Python None hack

# ── Creating Arrow Tables ──────────────────────
table = pa.table({
    "name": ["Alice", "Bob", "Charlie", "Diana"],
    "age": [30, 25, 35, 28],
    "department": ["Engineering", "Marketing", "Engineering", "Sales"],
    "salary": [120000, 85000, 140000, 95000],
})

print(table)
# pyarrow.Table
# name: string
# age: int64
# department: string
# salary: int64
# ----
# name: [["Alice","Bob","Charlie","Diana"]]
# age: [[30,25,35,28]]

print(f"Rows: {table.num_rows}, Columns: {table.num_columns}")
print(f"Memory: {table.nbytes} bytes")  # Exact memory usage</code></pre>

      <h2>Arrow Compute Functions</h2>
      <p>Arrow provides 200+ vectorized compute functions that operate directly on columnar data — no Python loops, no conversion overhead:</p>
      <pre><code>import pyarrow.compute as pc

# ── Filtering ──────────────────────────────────
# Filter: engineers only
engineers = table.filter(pc.equal(table["department"], "Engineering"))
print(engineers.to_pandas())
#       name  age   department  salary
# 0    Alice   30  Engineering  120000
# 1  Charlie   35  Engineering  140000

# Filter: salary > 100k
high_earners = table.filter(pc.greater(table["salary"], 100000))

# ── Aggregations ───────────────────────────────
avg_salary = pc.mean(table["salary"])
print(f"Average salary: {avg_salary}")  # 110000.0

max_age = pc.max(table["age"])
min_age = pc.min(table["age"])
print(f"Age range: {min_age} - {max_age}")  # 25 - 35

# Count non-null values
print(pc.count(table["name"]))  # 4

# ── String operations ──────────────────────────
names = table["name"]
upper_names = pc.utf8_upper(names)
print(upper_names)  # ["ALICE", "BOB", "CHARLIE", "DIANA"]

starts_with_a = pc.starts_with(names, pattern="A")
print(starts_with_a)  # [true, false, false, false]

# ── Sorting ────────────────────────────────────
sorted_table = table.sort_by([("salary", "descending")])
print(sorted_table.column("name"))  # ["Charlie", "Alice", "Diana", "Bob"]

# ── Group By + Aggregate ──────────────────────
grouped = table.group_by("department").aggregate([
    ("salary", "mean"),
    ("salary", "count"),
    ("age", "max"),
])
print(grouped.to_pandas())
#    department  salary_mean  salary_count  age_max
# 0  Engineering     130000.0             2       35
# 1   Marketing      85000.0             1       25
# 2       Sales      95000.0             1       28</code></pre>

      <h2>Arrow IPC: Zero-Copy Data Sharing</h2>
      <p>Arrow's IPC (Inter-Process Communication) format lets you send data between processes, languages, and machines with <strong>zero serialization</strong>. The data is already in Arrow format — just send the bytes.</p>
      <pre><code>import pyarrow as pa
import pyarrow.ipc as ipc

# ── Write Arrow IPC (Feather format) ──────────
# Feather is Arrow's on-disk format — binary, columnar, fast
table = pa.table({
    "id": range(1_000_000),
    "value": [f"item_{i}" for i in range(1_000_000)],
    "score": [i * 0.1 for i in range(1_000_000)],
})

# Write to Feather file (Arrow IPC format)
import pyarrow.feather as feather
feather.write_feather(table, "data.arrow")  # ~15ms for 1M rows

# Read back — memory-mapped, near-instant
table_back = feather.read_table("data.arrow")  # ~2ms — zero-copy!

# Compare with CSV:
# CSV write: ~2000ms, CSV read: ~1500ms (100x slower!)
# Parquet write: ~200ms, Parquet read: ~100ms (10x slower)

# ── Arrow IPC Stream (for sending over network) ──
# Write to bytes (for sending over gRPC, HTTP, etc.)
sink = pa.BufferOutputStream()
writer = ipc.new_stream(sink, table.schema)
writer.write_table(table)
writer.close()
buf = sink.getvalue()  # Arrow IPC bytes — send this anywhere

# Read from bytes (receiver side)
reader = ipc.open_stream(buf)
received_table = reader.read_all()
# Same table, zero deserialization — just pointer assignment!</code></pre>

      <h2>Arrow Flight: High-Performance Data Transport</h2>
      <p><strong>Arrow Flight</strong> is a gRPC-based protocol for transferring Arrow data over the network. It's designed for bulk data transfer — think "Arrow-native API for data services."</p>
      <pre><code>import pyarrow.flight as flight

# ── Flight Server (serves Arrow data) ─────────
class DataServer(flight.FlightServerBase):
    def __init__(self, location, data):
        super().__init__(location)
        self.data = data  # Dict of dataset_name -> Arrow Table

    def list_flights(self, context, criteria):
        for name, table in self.data.items():
            descriptor = flight.FlightDescriptor.for_path(name)
            schema = table.schema
            yield flight.FlightInfo(
                schema, descriptor, [], table.num_rows, table.nbytes
            )

    def do_get(self, context, ticket):
        name = ticket.ticket.decode()
        table = self.data[name]
        return flight.RecordBatchStream(table)

# Start server
data = {"users": users_table, "orders": orders_table}
server = DataServer("grpc://0.0.0.0:8815", data)
server.serve()

# ── Flight Client (fetches Arrow data) ────────
client = flight.connect("grpc://localhost:8815")

# List available datasets
for f in client.list_flights():
    print(f.descriptor.path, f.total_records, "rows")

# Fetch a dataset — arrives as Arrow RecordBatches
ticket = flight.Ticket(b"users")
reader = client.do_get(ticket)
table = reader.read_all()  # Arrow Table — zero deserialization!
print(table.to_pandas())

# Flight transfers data at memory speed — 10-100x faster than
# REST + JSON. No serialization, no parsing, just Arrow bytes.</code></pre>

      <!-- Performance Pipeline -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">Data Transfer Speed Comparison</div>
        <div class="bar-chart">
          <div class="bar-chart-item"><div class="bar-chart-bar bar-h-90 bar-red" data-value="~2000ms"></div><div class="bar-chart-label">REST + JSON</div></div>
          <div class="bar-chart-item"><div class="bar-chart-bar bar-h-60 bar-orange" data-value="~800ms"></div><div class="bar-chart-label">gRPC + Protobuf</div></div>
          <div class="bar-chart-item"><div class="bar-chart-bar bar-h-25 bar-purple" data-value="~200ms"></div><div class="bar-chart-label">Parquet file</div></div>
          <div class="bar-chart-item"><div class="bar-chart-bar bar-h-10 bar-green" data-value="~15ms"></div><div class="bar-chart-label">Arrow IPC</div></div>
          <div class="bar-chart-item"><div class="bar-chart-bar bar-h-5 bar-blue" data-value="~2ms"></div><div class="bar-chart-label">Arrow (memory-mapped)</div></div>
        </div>
      </div>

      <h2>Arrow + Pandas 2.0</h2>
      <p>Pandas 2.0 introduced Arrow as a backend, replacing NumPy for many operations. This gives pandas users Arrow performance without changing their code:</p>
      <pre><code>import pandas as pd

# ── Use Arrow backend in pandas ────────────────
# Just add dtype_backend="pyarrow" when reading data
df = pd.read_csv("large_file.csv", dtype_backend="pyarrow")
df = pd.read_parquet("data.parquet", dtype_backend="pyarrow")

# Or convert existing DataFrame
df = pd.DataFrame({
    "name": ["Alice", "Bob", "Charlie"],
    "age": [30, 25, 35],
}).convert_dtypes(dtype_backend="pyarrow")

print(df.dtypes)
# name    string[pyarrow]
# age      int64[pyarrow]

# Benefits:
# 1. Native null support (no more NaN for missing strings!)
# 2. Faster string operations (Arrow strings vs Python objects)
# 3. Lower memory usage (Arrow's compact representation)
# 4. Faster I/O (Arrow-native read/write)</code></pre>

      <h2>Arrow + Polars</h2>
      <p><strong>Polars</strong> is built entirely on Arrow. It's the fastest DataFrame library available — often 10-50x faster than pandas:</p>
      <pre><code>import polars as pl

# Polars is Arrow-native — everything is Arrow under the hood
df = pl.DataFrame({
    "name": ["Alice", "Bob", "Charlie", "Diana"],
    "department": ["Eng", "Mkt", "Eng", "Sales"],
    "salary": [120000, 85000, 140000, 95000],
})

# Lazy evaluation + Arrow = blazing fast
result = (
    df.lazy()
    .filter(pl.col("salary") > 90000)
    .group_by("department")
    .agg([
        pl.col("salary").mean().alias("avg_salary"),
        pl.col("name").count().alias("headcount"),
    ])
    .sort("avg_salary", descending=True)
    .collect()  # Executes the optimized query plan
)
print(result)
# ┌────────────┬────────────┬───────────┐
# │ department ┆ avg_salary ┆ headcount │
# │ str        ┆ f64        ┆ u32       │
# ╞════════════╪════════════╪═══════════╡
# │ Eng        ┆ 130000.0   ┆ 2         │
# │ Sales      ┆ 95000.0    ┆ 1         │
# └────────────┴────────────┴───────────┘

# Zero-copy conversion between Polars and Arrow
arrow_table = df.to_arrow()    # Polars → Arrow (instant, zero-copy)
df_back = pl.from_arrow(arrow_table)  # Arrow → Polars (instant)</code></pre>

      <h2>Arrow + DuckDB</h2>
      <p><strong>DuckDB</strong> is an in-process analytical database that speaks Arrow natively. You can query Arrow tables with SQL — no data copying:</p>
      <pre><code>import duckdb
import pyarrow as pa

# Create an Arrow table
table = pa.table({
    "product": ["Widget", "Gadget", "Widget", "Gadget", "Widget"],
    "region": ["US", "US", "EU", "EU", "US"],
    "revenue": [1000, 1500, 800, 1200, 1100],
    "quarter": ["Q1", "Q1", "Q1", "Q2", "Q2"],
})

# Query Arrow data with SQL — zero copy, no import step
result = duckdb.sql("""
    SELECT
        product,
        region,
        SUM(revenue) as total_revenue,
        COUNT(*) as transactions
    FROM table
    GROUP BY product, region
    ORDER BY total_revenue DESC
""").arrow()  # Returns Arrow Table — stays in Arrow format!

print(result.to_pandas())
#   product region  total_revenue  transactions
# 0  Widget     US           2100             2
# 1  Gadget     EU           1200             1
# 2  Gadget     US           1500             1
# 3  Widget     EU            800             1

# DuckDB can also read Parquet files directly into Arrow
result = duckdb.sql("""
    SELECT * FROM read_parquet('s3://my-bucket/data/*.parquet')
    WHERE date > '2026-01-01'
""").arrow()</code></pre>

      <h2>Cross-Language Zero-Copy</h2>
      <p>Arrow's killer feature is cross-language interoperability. Data created in Python can be consumed by Rust, Java, Go, C++, or JavaScript — with <strong>zero conversion cost</strong>.</p>

      <!-- Ecosystem -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">Arrow Ecosystem — Same Data, Any Language</div>
        <div class="hub-diagram">
          <div class="hub-center" style="background:#f97316;box-shadow:0 0 30px rgba(249,115,22,0.3)">
            Apache Arrow Format
            <span class="hub-center-sub">Universal in-memory columnar layout</span>
          </div>
          <div class="hub-arrow-label">
            <span class="arrow-animated">&#x2B07;</span> Zero-copy access from any language
          </div>
          <div class="hub-apps">
            <div class="hub-app"><span class="hub-app-icon">&#x1F40D;</span>Python<span class="hub-app-sub">PyArrow, Pandas, Polars</span></div>
            <div class="hub-app" style="background:#f97316"><span class="hub-app-icon">&#x1F980;</span>Rust<span class="hub-app-sub">arrow-rs, DataFusion</span></div>
            <div class="hub-app" style="background:#ef4444"><span class="hub-app-icon">&#x2615;</span>Java/Scala<span class="hub-app-sub">Spark, Flink, Arrow Java</span></div>
            <div class="hub-app" style="background:#a855f7"><span class="hub-app-icon">&#x1F310;</span>JS/WASM<span class="hub-app-sub">arrow-js, Perspective</span></div>
          </div>
        </div>
      </div>

      <h2>Arrow vs Parquet vs CSV vs JSON</h2>
      <div class="flow-diagram">
        <div class="flow-diagram-title">Data Format Comparison</div>
        <div style="overflow-x:auto">
          <table style="width:100%;border-collapse:collapse;font-size:0.78rem;min-width:550px">
            <thead>
              <tr>
                <th style="text-align:left;padding:0.6rem;background:var(--muted);color:var(--foreground);border-radius:0.4rem 0 0 0">Feature</th>
                <th style="text-align:center;padding:0.6rem;background:#f97316;color:#fff">Arrow (IPC)</th>
                <th style="text-align:center;padding:0.6rem;background:#a855f7;color:#fff">Parquet</th>
                <th style="text-align:center;padding:0.6rem;background:#3b82f6;color:#fff">CSV</th>
                <th style="text-align:center;padding:0.6rem;background:#6b7280;color:#fff;border-radius:0 0.4rem 0 0">JSON</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:var(--foreground);font-weight:600">Format</td><td style="padding:0.5rem;text-align:center">Binary columnar</td><td style="padding:0.5rem;text-align:center">Binary columnar</td><td style="padding:0.5rem;text-align:center">Text row-based</td><td style="padding:0.5rem;text-align:center">Text nested</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:var(--foreground);font-weight:600">Read speed</td><td style="padding:0.5rem;text-align:center;color:#22c55e;font-weight:700">Fastest (zero-copy)</td><td style="padding:0.5rem;text-align:center;color:#22c55e">Fast (decompress)</td><td style="padding:0.5rem;text-align:center;color:#ef4444">Slow (parse text)</td><td style="padding:0.5rem;text-align:center;color:#ef4444">Slowest (parse + type)</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:var(--foreground);font-weight:600">File size</td><td style="padding:0.5rem;text-align:center;color:#f97316">Large (uncompressed)</td><td style="padding:0.5rem;text-align:center;color:#22c55e;font-weight:700">Smallest (compressed)</td><td style="padding:0.5rem;text-align:center;color:#ef4444">Large (text)</td><td style="padding:0.5rem;text-align:center;color:#ef4444">Largest (verbose)</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:var(--foreground);font-weight:600">Schema</td><td style="padding:0.5rem;text-align:center;color:#22c55e">Embedded</td><td style="padding:0.5rem;text-align:center;color:#22c55e">Embedded</td><td style="padding:0.5rem;text-align:center;color:#ef4444">None</td><td style="padding:0.5rem;text-align:center;color:#f97316">Implicit</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:var(--foreground);font-weight:600">Best for</td><td style="padding:0.5rem;text-align:center;color:#f97316;font-weight:700">In-memory, IPC, streaming</td><td style="padding:0.5rem;text-align:center;color:#a855f7;font-weight:700">Storage, data lakes</td><td style="padding:0.5rem;text-align:center;color:#3b82f6">Simple data exchange</td><td style="padding:0.5rem;text-align:center;color:#6b7280">APIs, config files</td></tr>
              <tr><td style="padding:0.5rem;color:var(--foreground);font-weight:600">Null handling</td><td style="padding:0.5rem;text-align:center;color:#22c55e">Native bitmask</td><td style="padding:0.5rem;text-align:center;color:#22c55e">Native</td><td style="padding:0.5rem;text-align:center;color:#ef4444">Empty string (?)</td><td style="padding:0.5rem;text-align:center;color:#f97316">null keyword</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <h2>When to Use Arrow</h2>
      <ul>
        <li><strong>Moving data between systems:</strong> If your pipeline goes Python &#x2192; Spark &#x2192; ML model, Arrow eliminates all conversion overhead.</li>
        <li><strong>Building data services:</strong> Use Arrow Flight to serve data at memory speed instead of serializing to JSON/Protobuf.</li>
        <li><strong>High-performance analytics:</strong> Arrow's columnar format + SIMD operations make aggregations 10-100x faster than row-based processing.</li>
        <li><strong>Real-time data processing:</strong> Arrow's streaming IPC format is perfect for event pipelines (Kafka &#x2192; Arrow &#x2192; Dashboard).</li>
        <li><strong>Cross-language data sharing:</strong> When Python, Rust, and Java need to share the same data without conversion.</li>
        <li><strong>As a pandas backend:</strong> Use <code>dtype_backend="pyarrow"</code> for better null handling, faster strings, and lower memory.</li>
      </ul>

      <p>Apache Arrow is one of the most impactful infrastructure projects in the data ecosystem. It's invisible to most users — you don't "install Arrow" and use it directly. Instead, it powers the tools you already use: pandas, Polars, DuckDB, Spark, Snowflake, BigQuery, and dozens more. Understanding Arrow helps you make better architectural decisions and squeeze maximum performance out of your data pipelines.</p>
    `;
