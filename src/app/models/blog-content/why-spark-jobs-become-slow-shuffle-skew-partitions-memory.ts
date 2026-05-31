export const CONTENT = `
      <p>Spark jobs usually become slow for boring reasons. A job shuffles too much data. One partition gets most of the work. Files are too small. Executors spill to disk. A join chooses the wrong strategy. The cluster is not always the first problem; the physical plan usually is.</p>

      <p>This guide gives you a practical mental model for debugging slow Spark jobs without guessing.</p>

      <aside class="callout callout-performance">
        <strong>Do not tune blindly:</strong> increasing executor memory or cluster size can hide the issue for one run and make the bill worse forever. Start with the Spark UI and query plan.
      </aside>

      <h2>First Check: Is the Job CPU, IO, Shuffle, or Memory Bound?</h2>

      <p>Open the Spark UI and look at stages. Slow Spark jobs usually show one of these patterns:</p>

      <ul>
        <li><strong>Many tasks, all similarly slow:</strong> likely IO, expensive parsing, or heavy computation.</li>
        <li><strong>A few tasks much slower than the rest:</strong> likely data skew.</li>
        <li><strong>Large shuffle read/write:</strong> join, groupBy, distinct, repartition, or window operation is moving data.</li>
        <li><strong>High spill to disk:</strong> executor memory pressure or aggregation/join state is too large.</li>
        <li><strong>Too many tiny tasks:</strong> small files or over-partitioning.</li>
      </ul>

      <h2>Shuffle: The Expensive Data Movement</h2>

      <p>A shuffle happens when Spark must move rows across the cluster so rows with the same key land together. Joins, aggregations, repartitions, window functions, and distinct operations often trigger shuffles.</p>

      <pre><code>-- This usually shuffles orders by customer_id
SELECT customer_id, SUM(order_total)
FROM orders
GROUP BY customer_id;</code></pre>

      <p>Shuffles are not bad by themselves. They become a problem when the data moved is huge, the partition count is wrong, or the same shuffle happens repeatedly because intermediate results are not persisted or written in a usable layout.</p>

      <h2>Skew: One Key Does Most of the Work</h2>

      <p>Skew means the data is not evenly distributed. One customer, one country, one null key, or one event type may have far more rows than the rest. Spark runs many tasks in parallel, but the whole stage waits for the slowest task.</p>

      <p>Common signs:</p>

      <ul>
        <li>One task processes gigabytes while others process megabytes.</li>
        <li>A join stage sits at 99% for a long time.</li>
        <li>Most executors are idle while one task keeps running.</li>
      </ul>

      <p>Fixes depend on the query. You can filter bad null keys, broadcast a small side, split hot keys, salt keys, pre-aggregate, or let Adaptive Query Execution handle skewed joins when it applies.</p>

      <h2>Partitions: Too Few, Too Many, or Badly Sized</h2>

      <p>Partitions are Spark's unit of parallel work. Too few partitions underuse the cluster. Too many partitions create scheduler overhead and tiny output files. Bad partitions make some tasks huge and others empty.</p>

      <pre><code># Useful inspection pattern
df.rdd.getNumPartitions()

# Repartition by a high-cardinality key before a heavy keyed operation
df = df.repartition(400, "customer_id")

# Coalesce down before writing small outputs
df.coalesce(32).write.mode("overwrite").parquet(output_path)</code></pre>

      <p>There is no universal partition count. Use data size, file size targets, cluster cores, and shuffle volume. For SQL workloads, Spark's adaptive execution can coalesce post-shuffle partitions when enabled.</p>

      <h2>Memory: When Spark Spills to Disk</h2>

      <p>Spark uses memory for execution state, joins, aggregations, sorting, and caching. When memory is insufficient, Spark spills to disk. Some spilling is normal. Heavy spill usually means the physical plan is holding too much state per task.</p>

      <p>Useful fixes include reducing columns early, filtering before joins, using broadcast joins for genuinely small tables, avoiding unnecessary cache, improving partitioning, and rewriting huge aggregations into staged aggregations.</p>

      <h2>File Layout: The Hidden Spark Tax</h2>

      <p>Even a good query is slow if the table layout is bad. Thousands of tiny files increase planning and task overhead. Oversized files reduce parallelism. Missing partition pruning causes full scans. Poor table statistics can lead to bad join choices.</p>

      <p>For lakehouse tables, compaction, clustering, partition evolution, statistics, and table maintenance matter as much as Spark configuration.</p>

      <h2>Debugging Checklist</h2>

      <ul>
        <li>Read the physical plan before changing cluster size.</li>
        <li>Check shuffle read/write size per stage.</li>
        <li>Look for skewed tasks and long tails.</li>
        <li>Check input file count and average file size.</li>
        <li>Confirm partition pruning is actually happening.</li>
        <li>Review spills, executor lost events, GC time, and failed tasks.</li>
        <li>Enable or review Adaptive Query Execution settings where supported.</li>
        <li>Write intermediate data in a layout that matches downstream access.</li>
      </ul>

      <h2>Diagnostic Flow Diagram</h2>

      <p>Slow Spark jobs are easier to debug if you follow the symptom to the likely physical cause. The flow below is intentionally simple. It keeps you from changing ten settings at once and losing the signal.</p>

      <div class="flow-diagram" role="img" aria-label="Spark performance diagnostic flow from symptom to fix">
        <div class="flow-diagram-title">Spark Performance Triage Flow</div>
        <div style="display:grid;grid-template-columns:repeat(5,minmax(140px,1fr));gap:0.75rem;min-width:820px">
          <div style="border:1px solid var(--md-sys-color-outline-variant);background:var(--md-sys-color-surface-container);border-radius:0.9rem;padding:1rem;text-align:center"><strong>Spark UI</strong><br><small>Find the slow stage</small></div>
          <div style="border:1px solid var(--md-sys-color-tertiary);background:var(--md-sys-color-tertiary-container);color:var(--md-sys-color-on-tertiary-container);border-radius:0.9rem;padding:1rem;text-align:center"><strong>Stage Metrics</strong><br><small>Shuffle, spill, task time</small></div>
          <div style="border:1px solid var(--md-sys-color-secondary);background:var(--md-sys-color-secondary-container);color:var(--md-sys-color-on-secondary-container);border-radius:0.9rem;padding:1rem;text-align:center"><strong>Plan</strong><br><small>Join, aggregate, scan, sort</small></div>
          <div style="border:1px solid var(--md-sys-color-primary);background:var(--md-sys-color-primary-container);color:var(--md-sys-color-on-primary-container);border-radius:0.9rem;padding:1rem;text-align:center"><strong>Cause</strong><br><small>Skew, partitions, memory, files</small></div>
          <div style="border:1px solid var(--md-sys-color-outline-variant);background:var(--md-sys-color-surface-container-high);border-radius:0.9rem;padding:1rem;text-align:center"><strong>One Fix</strong><br><small>Change, rerun, compare</small></div>
        </div>
      </div>

      <h2>Read the Physical Plan Like a Debugger</h2>

      <p>The logical query is what you asked for. The physical plan is how Spark intends to do it. A slow query usually becomes obvious when you look for exchanges, sorts, broadcast decisions, full scans, and repeated expensive operations. In Spark SQL, the word <code>Exchange</code> usually means data movement. Large exchanges deserve attention.</p>

      <pre><code>-- SQL inspection pattern
EXPLAIN FORMATTED
SELECT customer_id, SUM(order_total)
FROM orders
WHERE order_date &gt;= DATE '2026-01-01'
GROUP BY customer_id;

-- PySpark inspection pattern
df.explain("formatted")</code></pre>

      <p>Do not treat every exchange as a bug. A group by needs rows with the same key together. A join may need data movement. The question is whether the shuffle is expected, whether it is sized correctly, and whether the same data movement could be avoided through filtering, pre-aggregation, partition pruning, broadcast joins, or better table layout.</p>

      <h2>Skew Debugging: Find the Hot Key First</h2>

      <p>Skew fixes are dangerous when you apply them blindly. Salting every key, repartitioning every table, or increasing shuffle partitions can make the job more expensive without removing the long tail. Start by finding the hot key or the hot partition. Nulls, default values, bot traffic, one huge customer, and one country can all create a single partition that does most of the work.</p>

      <pre><code># Find suspiciously hot join keys before the join
from pyspark.sql import functions as F

orders.groupBy("customer_id").count() \
  .orderBy(F.desc("count")) \
  .show(20, truncate=False)</code></pre>

      <p>If the hot key is invalid, filter it or handle it separately. If the hot key is legitimate, split that part of the workload. For joins, try broadcasting the genuinely small side, pre-aggregating before the join, or salting only the hot keys. Adaptive Query Execution can help with skewed joins in supported cases, but it is not a substitute for understanding the data distribution.</p>

      <h2>Partition Sizing Rules That Survive Production</h2>

      <p>Partition advice is often repeated as a magic number. In practice, the right partition count depends on data size, cluster cores, compression, file format, operation type, and downstream write target. A better rule is to make partitions large enough to avoid scheduler overhead and small enough to keep tasks balanced and memory-safe.</p>

      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Symptom</th>
              <th>Likely partition issue</th>
              <th>Practical response</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Cluster underused</td>
              <td>Too few partitions or one huge partition.</td>
              <td>Increase parallelism or repartition by a useful key before the heavy stage.</td>
            </tr>
            <tr>
              <td>Scheduler overhead high</td>
              <td>Too many tiny tasks.</td>
              <td>Coalesce after shuffle where safe, compact small files, avoid needless repartition.</td>
            </tr>
            <tr>
              <td>Many tiny output files</td>
              <td>Write partitioning does not match output size.</td>
              <td>Coalesce or tune write distribution and run table compaction.</td>
            </tr>
            <tr>
              <td>Stage stuck at 99%</td>
              <td>Skewed partition.</td>
              <td>Inspect task input size and hot keys before changing cluster size.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Memory Pressure Is Often a Query Shape Problem</h2>

      <p>Adding executor memory is sometimes correct, but it should not be the first reflex. Memory pressure often means the query is holding too much state per task: a huge aggregation group, a sort over too many columns, an accidental cross join, a cache of a wide dataframe, or a join strategy that builds a large hash table.</p>

      <p>Before increasing memory, reduce the width of the data. Select only needed columns. Filter early. Avoid caching wide intermediate data unless multiple downstream steps reuse it. Replace repeated transformations with a persisted table when the same expensive stage is reused by many jobs. Look at spill metrics after each change. If the spill disappears and the stage time drops, you fixed the shape of the work rather than merely buying more memory.</p>

      <aside class="callout callout-troubleshoot">
        <strong>Safe tuning loop:</strong> capture the baseline stage metrics, make one change, rerun on comparable data, and record shuffle bytes, spill bytes, task skew, file count, and total runtime. Without a baseline, tuning becomes storytelling.
      </aside>

      <h2>Production Runbook for a Slow Job</h2>

      <p>When a Spark job suddenly gets slower, avoid starting with code changes. First decide whether the data changed, the cluster changed, the engine changed, or the query plan changed. A new partition, a new source file pattern, a changed join key, a larger dimension table, or a disabled table maintenance job can all make yesterday's acceptable query slow today.</p>

      <p>A good runbook captures comparable evidence. Save the Spark application ID, input data range, table snapshot or version where available, cluster shape, Spark version, key configuration, physical plan, stage metrics, and output row count. That record lets another engineer reproduce the investigation instead of relying on memory.</p>

      <pre><code>slow_spark_runbook:
  capture:
    - application_id
    - input_tables_and_versions
    - cluster_cores_and_memory
    - spark_sql_shuffle_partitions
    - physical_plan
    - slowest_stage_metrics
    - output_row_count
  compare:
    - "last successful run with similar data"
    - "shuffle bytes and spill bytes"
    - "max task time versus median task time"
    - "input file count and average file size"</code></pre>

      <h2>Join Strategy Mistakes</h2>

      <p>Many slow Spark jobs are join problems. A small table that used to broadcast becomes too large and starts shuffling. A large table joins on a low-cardinality key and creates skew. A filter is applied after the join instead of before it. A join includes unnecessary columns, increasing shuffle size. These mistakes are not fixed by more executors as cleanly as they are fixed by changing the plan.</p>

      <p>Before tuning, ask whether the join can be made smaller. Filter both sides before the join. Select only needed columns. Check whether the dimension table is genuinely small enough to broadcast. Confirm that the join key is not mostly null. For slowly changing dimensions, verify that the effective-date condition is not turning a simple lookup into a huge range join.</p>

      <pre><code># Reduce data before the join
orders_small = orders.select("order_id", "customer_id", "order_total")
customers_small = customers.select("customer_id", "region")

result = orders_small.join(customers_small, "customer_id")</code></pre>

      <h2>File Layout and Table Maintenance</h2>

      <p>Spark is often blamed for table layout problems. A table with tens of thousands of tiny files creates too many tasks and expensive planning. A table with huge files can reduce parallelism. A partition strategy based on a high-cardinality column can create endless small directories. A missing compaction job can turn normal streaming ingestion into a slow batch query weeks later.</p>

      <p>For lakehouse tables, maintenance is part of performance engineering. Compact small files, keep statistics current, remove obsolete snapshots according to policy, and avoid partition columns that create unbounded cardinality. Use partitioning for pruning, not as a substitute for indexing. If most queries filter by date and region, design around that access pattern instead of copying the source-system folder layout.</p>

      <h2>What Not to Do</h2>

      <ul>
        <li>Do not raise executor memory before checking whether the job is spilling because of a bad join or aggregation shape.</li>
        <li>Do not increase shuffle partitions globally because one query is slow; that can make other workloads worse.</li>
        <li>Do not cache every intermediate dataframe. Cache only when reuse is real and the cached data fits safely.</li>
        <li>Do not repartition by a low-cardinality key and expect balanced tasks.</li>
        <li>Do not assume Adaptive Query Execution removes the need for table statistics and good query shape.</li>
        <li>Do not compare benchmark runs unless the data volume, layout, cluster, and configuration are comparable.</li>
      </ul>

      <p>The best Spark teams treat performance as an observability problem. They keep historical run metrics, review query plans during code review for critical pipelines, and tie table maintenance failures to data freshness alerts. That is how performance stays stable after the first optimization sprint ends.</p>

      <h2>Related CodersSecret Guides</h2>

      <ul>
        <li><a href="/blog/bronze-silver-gold-data-layers-explained">Bronze, Silver, and Gold Data Layers Explained</a></li>
        <li><a href="/blog/why-table-formats-exist-production">Why Table Formats Exist and Which Ones Matter in Production</a></li>
        <li><a href="/blog/s3-tables-explained">S3 Tables Explained</a></li>
      </ul>

      <h2>Sources and Further Reading</h2>

      <ul>
        <li><a href="https://spark.apache.org/docs/latest/sql-performance-tuning.html">Apache Spark SQL performance tuning</a></li>
        <li><a href="https://spark.apache.org/docs/latest/tuning.html">Apache Spark tuning guide</a></li>
      </ul>
`;
