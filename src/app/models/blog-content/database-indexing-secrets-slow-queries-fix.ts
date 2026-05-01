export const CONTENT = `
      <p>You added an index. The query is still slow. Sound familiar? Most developers treat indexes like magic &mdash; add one and hope for the best. But indexes are data structures with specific rules, and violating those rules means your &ldquo;indexed&rdquo; query is still doing a full table scan.</p>

      <p>This guide covers what your senior dev never explained: how indexes actually work internally, why column order in composite indexes matters more than you think, and how to read EXPLAIN ANALYZE output like a database engineer.</p>

      <h2>How Databases Find Your Data</h2>

      <p>When you run a query, the database has two fundamental strategies:</p>

      <ul>
        <li><strong>Sequential Scan:</strong> Read every single row in the table and check if it matches your WHERE clause. Simple, but devastating on large tables.</li>
        <li><strong>Index Scan:</strong> Use a pre-built data structure to jump directly to matching rows. Like using a book index instead of reading every page.</li>
      </ul>

      <p>Here is the difference in practice:</p>

      <pre><code>-- Table: orders (10 million rows)
-- No index on customer_id

EXPLAIN ANALYZE SELECT * FROM orders WHERE customer_id = 42;

-- Seq Scan on orders  (cost=0.00..185432.00 rows=52 width=96)
--   Filter: (customer_id = 42)
--   Rows Removed by Filter: 9999948
--   Planning Time: 0.085 ms
--   Execution Time: 1247.531 ms   &larr; Over 1 second!

-- Now with an index:
CREATE INDEX idx_orders_customer_id ON orders(customer_id);

EXPLAIN ANALYZE SELECT * FROM orders WHERE customer_id = 42;

-- Index Scan using idx_orders_customer_id on orders
--   Index Cond: (customer_id = 42)
--   Planning Time: 0.092 ms
--   Execution Time: 0.128 ms      &larr; 10,000x faster!</code></pre>

      <p>The sequential scan examined <strong>10 million rows</strong> to find 52 matches. The index scan went straight to those 52 rows. That is the power of proper indexing.</p>

      <h2>B-Tree Indexes: The Workhorse</h2>

      <p>B-tree (balanced tree) is the default index type in PostgreSQL, MySQL, and virtually every relational database. Understanding its structure explains most indexing behavior.</p>

      <p>A B-tree is a sorted, self-balancing tree structure:</p>

      <pre><code>          [50, 100]              &larr; Root node
         /    |     \\
   [20,35] [60,80] [120,150]    &larr; Internal nodes
   /  |  \\   / | \\   /  |  \\
  ... ... ... ... ... ... ...   &larr; Leaf nodes (actual row pointers)</code></pre>

      <ul>
        <li><strong>Root and internal nodes</strong> act as signposts, directing the search left or right</li>
        <li><strong>Leaf nodes</strong> contain the indexed values and pointers (ctid) to the actual table rows</li>
        <li><strong>All leaf nodes are linked</strong> in a doubly-linked list for efficient range scans</li>
        <li><strong>Tree depth is typically 3-4 levels</strong> even for millions of rows</li>
      </ul>

      <p>This means finding any single value requires only 3-4 disk reads, regardless of table size. A table with 100 rows and a table with 100 million rows both need roughly the same number of index lookups.</p>

      <h3>What B-Trees Are Great At</h3>

      <pre><code>-- Equality: direct lookup
WHERE email = 'user@example.com'

-- Range: walk the linked leaf nodes
WHERE created_at BETWEEN '2026-01-01' AND '2026-03-31'

-- Sorting: leaf nodes are already sorted
ORDER BY created_at DESC LIMIT 20

-- Prefix matching
WHERE name LIKE 'John%'    -- Uses index
WHERE name LIKE '%John'    -- Cannot use index (no prefix)</code></pre>

      <h2>Hash Indexes: The Specialist</h2>

      <p>Hash indexes use a hash function to map values to buckets. They are faster than B-trees for exact equality lookups but useless for everything else.</p>

      <pre><code>CREATE INDEX idx_users_email_hash ON users USING hash(email);

-- Uses the hash index (equality only):
WHERE email = 'user@example.com'     -- Yes

-- Cannot use hash index:
WHERE email LIKE 'user%'             -- No (pattern)
WHERE email > 'a' AND email < 'm'   -- No (range)
ORDER BY email                       -- No (sorting)</code></pre>

      <p><strong>When to use hash indexes:</strong> Only when you exclusively do exact-match lookups on high-cardinality columns (like UUIDs or email addresses) and never need range queries or sorting. In practice, B-tree is almost always the better choice because the performance difference is marginal and B-trees are far more versatile.</p>

      <h2>Composite Indexes: Column Order Is Everything</h2>

      <p>A composite index indexes multiple columns together. The column order determines which queries can use the index. This is the <strong>leftmost prefix rule</strong> &mdash; the most misunderstood concept in database indexing.</p>

      <pre><code>CREATE INDEX idx_orders_composite ON orders(customer_id, status, created_at);</code></pre>

      <p>This single index can satisfy these queries:</p>

      <pre><code>-- Uses index (all three columns, left to right):
WHERE customer_id = 42 AND status = 'shipped' AND created_at > '2026-01-01'

-- Uses index (first two columns):
WHERE customer_id = 42 AND status = 'shipped'

-- Uses index (first column only):
WHERE customer_id = 42

-- CANNOT use index (skips first column):
WHERE status = 'shipped'                        -- Skips customer_id!

-- CANNOT use index (skips middle column):
WHERE customer_id = 42 AND created_at > '2026-01-01'  -- Only uses customer_id part</code></pre>

      <p>Think of it like a phone book sorted by <strong>last name, then first name, then city</strong>. You can look up everyone named &ldquo;Smith&rdquo; (last name). You can look up &ldquo;Smith, John&rdquo; (last + first). But you cannot efficiently look up everyone named &ldquo;John&rdquo; without a last name &mdash; the book is not sorted that way.</p>

      <h3>Ordering Strategy</h3>

      <p>Put columns in this order:</p>

      <ol>
        <li><strong>Equality conditions first</strong> (WHERE status = 'active')</li>
        <li><strong>Range conditions last</strong> (WHERE created_at > '2026-01-01')</li>
        <li><strong>High-selectivity columns before low-selectivity</strong> (customer_id before status)</li>
      </ol>

      <h2>Covering Indexes: Skip the Table Entirely</h2>

      <p>Normally, an index scan finds the matching row pointers, then fetches the actual rows from the table (a &ldquo;heap fetch&rdquo;). A <strong>covering index</strong> includes all the columns your query needs, eliminating the heap fetch entirely.</p>

      <pre><code>-- Query that needs customer_id, status, and total_amount:
SELECT customer_id, status, total_amount
FROM orders
WHERE customer_id = 42 AND status = 'shipped';

-- Regular index: finds rows, then fetches total_amount from table
CREATE INDEX idx_orders_cust_status ON orders(customer_id, status);

-- Covering index: includes total_amount, no table fetch needed
CREATE INDEX idx_orders_covering ON orders(customer_id, status)
  INCLUDE (total_amount);</code></pre>

      <p>In EXPLAIN output, a covering index shows <strong>&ldquo;Index Only Scan&rdquo;</strong> instead of &ldquo;Index Scan&rdquo; &mdash; this is significantly faster because it avoids random I/O to the heap.</p>

      <pre><code>EXPLAIN ANALYZE SELECT customer_id, status, total_amount
FROM orders WHERE customer_id = 42 AND status = 'shipped';

-- Index Only Scan using idx_orders_covering on orders
--   Index Cond: ((customer_id = 42) AND (status = 'shipped'))
--   Heap Fetches: 0            &larr; Zero table access!
--   Execution Time: 0.045 ms</code></pre>

      <h2>Partial Indexes: Index Only What Matters</h2>

      <p>Why index 10 million rows when your query only ever looks at 50,000 of them? A partial index includes a WHERE clause that limits which rows are indexed.</p>

      <pre><code>-- Only 2% of orders are 'pending', but you query them constantly
CREATE INDEX idx_orders_pending ON orders(created_at)
  WHERE status = 'pending';

-- This index is 50x smaller than a full index
-- Faster to scan, faster to maintain, less disk space

-- Uses the partial index:
SELECT * FROM orders WHERE status = 'pending' ORDER BY created_at;

-- Cannot use it:
SELECT * FROM orders WHERE status = 'shipped' ORDER BY created_at;</code></pre>

      <p>Partial indexes are perfect for: active/inactive flags, unprocessed queues, soft-deleted records, and any column where you only query a small subset of values.</p>

      <h2>Index Bloat and Maintenance</h2>

      <p>PostgreSQL uses MVCC (Multi-Version Concurrency Control), which means UPDATE and DELETE operations leave dead tuples in indexes. Over time, indexes bloat &mdash; they grow larger without holding more useful data.</p>

      <pre><code>-- Check index bloat using pg_stat_user_indexes:
SELECT
  schemaname || '.' || relname AS table,
  indexrelname AS index,
  pg_size_pretty(pg_relation_size(indexrelid)) AS index_size,
  idx_scan AS times_used,
  idx_tup_read AS rows_read
FROM pg_stat_user_indexes
ORDER BY pg_relation_size(indexrelid) DESC
LIMIT 10;</code></pre>

      <p>If an index is large but <code>idx_scan</code> is zero, you are paying storage and write overhead for an index nobody uses. Drop it.</p>

      <pre><code>-- Rebuild a bloated index (locks the table briefly):
REINDEX INDEX idx_orders_customer_id;

-- Non-blocking rebuild (PostgreSQL 12+):
REINDEX INDEX CONCURRENTLY idx_orders_customer_id;</code></pre>

      <h2>Common Anti-Patterns</h2>

      <h3>1. Functions on Indexed Columns</h3>

      <pre><code>-- This CANNOT use an index on created_at:
WHERE YEAR(created_at) = 2026
WHERE LOWER(email) = 'user@example.com'
WHERE amount * 1.1 > 100

-- Fix: rewrite to keep the column bare
WHERE created_at >= '2026-01-01' AND created_at < '2027-01-01'

-- Or create an expression index:
CREATE INDEX idx_users_email_lower ON users(LOWER(email));</code></pre>

      <h3>2. Indexing Low-Cardinality Columns</h3>

      <pre><code>-- Bad: boolean column with only 2 possible values
CREATE INDEX idx_users_active ON users(is_active);
-- The index doesn't help much: 50% of rows match each value
-- The planner will choose a sequential scan anyway

-- Better: partial index if you only query one side
CREATE INDEX idx_users_active ON users(created_at) WHERE is_active = true;</code></pre>

      <h3>3. Over-Indexing</h3>

      <p>Every index slows down INSERT, UPDATE, and DELETE operations because the database must update every affected index. A table with 15 indexes means every single write operation triggers 15 index updates. Only create indexes that serve actual query patterns.</p>

      <h3>4. Implicit Type Casting</h3>

      <pre><code>-- Column user_id is INTEGER, but you pass a string:
WHERE user_id = '42'
-- PostgreSQL may cast and still use the index, but MySQL often will not.
-- Always match types exactly.</code></pre>

      <h2>EXPLAIN ANALYZE: Reading the Execution Plan</h2>

      <p>Here is a real optimization walkthrough. Suppose you have this slow query:</p>

      <pre><code>EXPLAIN ANALYZE
SELECT o.id, o.total_amount, c.name
FROM orders o
JOIN customers c ON c.id = o.customer_id
WHERE o.status = 'pending'
  AND o.created_at > '2026-01-01'
ORDER BY o.created_at DESC
LIMIT 20;

-- BEFORE optimization:
-- Sort  (cost=45123.45..45123.50 rows=20)
--   Sort Key: o.created_at DESC
--   Sort Method: top-N heapsort  Memory: 27kB
--   -> Hash Join  (cost=1234.56..45000.00 rows=48576)
--        Hash Cond: (o.customer_id = c.id)
--        -> Seq Scan on orders o  (cost=0.00..43210.00 rows=48576)
--              Filter: ((status = 'pending') AND (created_at > '2026-01-01'))
--              Rows Removed by Filter: 9951424
--        -> Hash  (cost=1000.00..1000.00 rows=50000)
--              -> Seq Scan on customers c
-- Planning Time: 0.234 ms
-- Execution Time: 892.456 ms</code></pre>

      <p>The bottleneck is the <strong>Seq Scan on orders</strong> &mdash; examining 10 million rows. Let us fix it:</p>

      <pre><code>-- Create a targeted composite index:
CREATE INDEX idx_orders_status_created ON orders(status, created_at DESC)
  INCLUDE (total_amount, customer_id);

-- AFTER optimization:
-- Limit  (cost=0.56..45.23 rows=20)
--   -> Nested Loop  (cost=0.56..109.45 rows=48576)
--        -> Index Only Scan Backward using idx_orders_status_created on orders o
--              Index Cond: ((status = 'pending') AND (created_at > '2026-01-01'))
--              Heap Fetches: 0
--        -> Index Scan using customers_pkey on customers c
--              Index Cond: (id = o.customer_id)
-- Planning Time: 0.187 ms
-- Execution Time: 0.342 ms</code></pre>

      <p>From <strong>892ms to 0.3ms</strong> &mdash; a 2,600x improvement. The key changes: the composite index matches the WHERE + ORDER BY, and the INCLUDE clause makes it a covering index (Index Only Scan, zero heap fetches).</p>

      <h2>Index Type Cheat Sheet</h2>

      <table>
        <thead>
          <tr>
            <th>Index Type</th>
            <th>Best For</th>
            <th>Supports Range</th>
            <th>Supports Sort</th>
            <th>Size</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>B-tree (default)</td>
            <td>Almost everything</td>
            <td>Yes</td>
            <td>Yes</td>
            <td>Medium</td>
          </tr>
          <tr>
            <td>Hash</td>
            <td>Equality-only lookups</td>
            <td>No</td>
            <td>No</td>
            <td>Small</td>
          </tr>
          <tr>
            <td>GIN</td>
            <td>Full-text search, arrays, JSONB</td>
            <td>No</td>
            <td>No</td>
            <td>Large</td>
          </tr>
          <tr>
            <td>GiST</td>
            <td>Geospatial, range types, nearest-neighbor</td>
            <td>Yes</td>
            <td>No</td>
            <td>Medium</td>
          </tr>
          <tr>
            <td>BRIN</td>
            <td>Large tables with natural ordering (timestamps)</td>
            <td>Yes</td>
            <td>No</td>
            <td>Tiny</td>
          </tr>
          <tr>
            <td>Partial</td>
            <td>Queries targeting a small subset of rows</td>
            <td>Depends on base type</td>
            <td>Depends on base type</td>
            <td>Tiny</td>
          </tr>
          <tr>
            <td>Covering</td>
            <td>Avoiding heap fetches for known queries</td>
            <td>Yes (B-tree)</td>
            <td>Yes (B-tree)</td>
            <td>Larger</td>
          </tr>
        </tbody>
      </table>

      <h2>Key Takeaways</h2>

      <ul>
        <li><strong>Always check EXPLAIN ANALYZE</strong> before and after adding indexes &mdash; do not guess</li>
        <li><strong>Column order in composite indexes matters</strong> &mdash; equality columns first, range columns last</li>
        <li><strong>Covering indexes eliminate heap fetches</strong> &mdash; use INCLUDE for frequently selected columns</li>
        <li><strong>Partial indexes save space and speed</strong> &mdash; index only the rows you actually query</li>
        <li><strong>Audit unused indexes regularly</strong> &mdash; every index has a write cost</li>
        <li><strong>Never apply functions to indexed columns</strong> in WHERE clauses &mdash; use expression indexes instead</li>
        <li><strong>B-tree is the right choice 95% of the time</strong> &mdash; only reach for specialized types when you have a specific need</li>
      </ul>

      <p>The difference between a junior and senior database engineer is not knowing that indexes exist &mdash; it is knowing <strong>which</strong> index to create, in <strong>what order</strong>, with <strong>which columns included</strong>. Master these fundamentals and you will never fear a slow query again.</p>
    `;
