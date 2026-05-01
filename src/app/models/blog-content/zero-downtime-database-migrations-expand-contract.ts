export const CONTENT = `
      <p>You need to rename a column, add a NOT NULL constraint, or change a data type. In development, you run the migration and it takes 200 milliseconds. In production with 50 million rows, that same migration locks the table for 45 minutes and your app goes down.</p>

      <p>This guide teaches the <strong>expand-contract pattern</strong> &mdash; the industry-standard approach to zero-downtime schema changes used by companies like GitHub, Shopify, and Stripe.</p>

      <h2>Why Migrations Cause Downtime</h2>

      <p>Most schema changes in PostgreSQL and MySQL acquire <strong>exclusive locks</strong> on the table. While the lock is held, no reads or writes can proceed. On large tables, the migration itself can take minutes or hours.</p>

      <pre><code>-- This innocent-looking migration:
ALTER TABLE orders ADD COLUMN discount_code VARCHAR(50) NOT NULL DEFAULT '';

-- On a 50M row table in PostgreSQL < 11:
-- 1. Acquires ACCESS EXCLUSIVE lock (blocks ALL queries)
-- 2. Rewrites every single row to add the default value
-- 3. Rebuilds all indexes
-- Duration: 30-60 minutes of TOTAL DOWNTIME</code></pre>

      <p><strong>PostgreSQL 11+ improvement:</strong> Adding a column with a constant DEFAULT no longer rewrites the table. But many other operations (adding constraints, changing types, renaming) still require careful handling.</p>

      <h2>The Expand-Contract Pattern</h2>

      <p>Instead of making a breaking change in one step, split it into three safe phases:</p>

      <ol>
        <li><strong>Expand:</strong> Add the new structure alongside the old one (backward compatible)</li>
        <li><strong>Migrate:</strong> Update application code to use the new structure. Backfill data.</li>
        <li><strong>Contract:</strong> Remove the old structure once nothing depends on it</li>
      </ol>

      <h3>Example: Renaming a Column</h3>

      <p>You want to rename <code>user_name</code> to <code>display_name</code>. A direct rename locks the table and breaks all queries referencing the old name.</p>

      <pre><code>-- WRONG: Direct rename (causes downtime + app errors)
ALTER TABLE users RENAME COLUMN user_name TO display_name;
-- Every query using "user_name" immediately breaks!

-- RIGHT: Expand-Contract (zero downtime)

-- Phase 1: EXPAND - Add new column
ALTER TABLE users ADD COLUMN display_name VARCHAR(255);

-- Phase 2: MIGRATE - Backfill data in batches
UPDATE users SET display_name = user_name
WHERE display_name IS NULL
AND id BETWEEN 1 AND 100000;  -- Batch by ID range

-- Phase 2b: Deploy code that writes to BOTH columns
-- Phase 2c: Deploy code that reads from display_name (falls back to user_name)
-- Phase 2d: Deploy code that reads ONLY from display_name

-- Phase 3: CONTRACT - Remove old column (after verification)
ALTER TABLE users DROP COLUMN user_name;</code></pre>

      <h3>Example: Adding a NOT NULL Constraint</h3>

      <pre><code>-- WRONG: Direct NOT NULL (scans entire table with lock)
ALTER TABLE orders ALTER COLUMN customer_email SET NOT NULL;

-- RIGHT: Add constraint without validation, then validate separately

-- Phase 1: Add constraint as NOT VALID (instant, no scan)
ALTER TABLE orders
ADD CONSTRAINT orders_email_not_null
CHECK (customer_email IS NOT NULL) NOT VALID;

-- Phase 2: Backfill any NULL values
UPDATE orders SET customer_email = 'unknown@example.com'
WHERE customer_email IS NULL;

-- Phase 3: Validate constraint (reads table but does NOT lock writes)
ALTER TABLE orders VALIDATE CONSTRAINT orders_email_not_null;</code></pre>

      <h2>Backfilling Data Safely</h2>

      <p>Never backfill an entire table in one UPDATE. It creates a massive transaction that bloats WAL, locks rows, and can overwhelm your database.</p>

      <pre><code># Django management command for batched backfill
from django.db import connection

def backfill_display_name(batch_size=10000):
    while True:
        with connection.cursor() as cursor:
            cursor.execute("""
                UPDATE users
                SET display_name = user_name
                WHERE display_name IS NULL
                AND id IN (
                    SELECT id FROM users
                    WHERE display_name IS NULL
                    LIMIT %s
                )
            """, [batch_size])

            rows_updated = cursor.rowcount

        if rows_updated == 0:
            break

        print(f"Updated {rows_updated} rows")
        time.sleep(0.1)  # Brief pause to reduce load</code></pre>

      <h2>Index Changes Without Downtime</h2>

      <pre><code>-- WRONG: CREATE INDEX locks the table for the entire duration
CREATE INDEX idx_orders_email ON orders(customer_email);
-- On 50M rows: 10-30 minutes of blocked writes

-- RIGHT: CREATE INDEX CONCURRENTLY (no lock on writes)
CREATE INDEX CONCURRENTLY idx_orders_email ON orders(customer_email);
-- Takes the same time but does NOT block any queries
-- Caveat: cannot run inside a transaction block</code></pre>

      <h2>Django Migration Best Practices</h2>

      <pre><code># migrations/0042_add_display_name.py
from django.db import migrations, models

class Migration(migrations.Migration):
    # CRITICAL: Prevent Django from wrapping in a transaction
    # Required for CREATE INDEX CONCURRENTLY
    atomic = False

    dependencies = [
        ('users', '0041_previous'),
    ]

    operations = [
        # Add nullable column (instant, no rewrite)
        migrations.AddField(
            model_name='user',
            name='display_name',
            field=models.CharField(max_length=255, null=True),
        ),

        # Add index concurrently
        migrations.RunSQL(
            sql='CREATE INDEX CONCURRENTLY idx_user_display ON users_user(display_name);',
            reverse_sql='DROP INDEX IF EXISTS idx_user_display;',
        ),
    ]</code></pre>

      <h2>Dangerous Operations Cheat Sheet</h2>

      <table>
        <thead>
          <tr>
            <th>Operation</th>
            <th>Risk Level</th>
            <th>Safe Alternative</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>ADD COLUMN (nullable)</td>
            <td>Safe</td>
            <td>Direct (instant in PostgreSQL)</td>
          </tr>
          <tr>
            <td>ADD COLUMN with DEFAULT</td>
            <td>Safe (PG 11+)</td>
            <td>Direct (PG 11+) or add nullable + backfill</td>
          </tr>
          <tr>
            <td>ADD COLUMN NOT NULL</td>
            <td>Dangerous</td>
            <td>Add nullable &rarr; backfill &rarr; add CHECK NOT VALID &rarr; validate</td>
          </tr>
          <tr>
            <td>DROP COLUMN</td>
            <td>Moderate</td>
            <td>Remove from code first, then drop in next deploy</td>
          </tr>
          <tr>
            <td>RENAME COLUMN</td>
            <td>Dangerous</td>
            <td>Expand-contract: add new &rarr; dual write &rarr; drop old</td>
          </tr>
          <tr>
            <td>CHANGE TYPE</td>
            <td>Dangerous</td>
            <td>Add new column &rarr; backfill &rarr; swap</td>
          </tr>
          <tr>
            <td>ADD INDEX</td>
            <td>Dangerous</td>
            <td>CREATE INDEX CONCURRENTLY</td>
          </tr>
          <tr>
            <td>ADD FOREIGN KEY</td>
            <td>Dangerous</td>
            <td>ADD CONSTRAINT NOT VALID &rarr; VALIDATE</td>
          </tr>
          <tr>
            <td>ADD UNIQUE CONSTRAINT</td>
            <td>Dangerous</td>
            <td>CREATE UNIQUE INDEX CONCURRENTLY &rarr; ADD CONSTRAINT USING INDEX</td>
          </tr>
        </tbody>
      </table>

      <h2>Deployment Order Matters</h2>

      <p>The golden rule: <strong>migration and code must be backward compatible at every step</strong>. Never deploy code that depends on a migration that has not run yet, and never run a migration that breaks currently deployed code.</p>

      <pre><code># Safe deployment order for renaming a column:

# Deploy 1: Add new column (migration only)
# - Old code works fine (ignores new column)
# - New column exists but is empty

# Deploy 2: Write to both columns (code change)
# - Writes go to both user_name AND display_name
# - Reads still from user_name

# Deploy 3: Backfill historical data (script/migration)
# - All rows now have display_name populated

# Deploy 4: Read from new column (code change)
# - Reads from display_name
# - Still writes to both (in case of rollback)

# Deploy 5: Stop writing to old column (code change)
# - Only writes to display_name

# Deploy 6: Drop old column (migration)
# - Safe: nothing references user_name anymore</code></pre>

      <h2>Key Takeaways</h2>

      <ul>
        <li><strong>Never run ALTER TABLE on large tables without checking lock behavior</strong> &mdash; test migrations against production-sized data first</li>
        <li><strong>Use the expand-contract pattern</strong> for any schema change that could break running code</li>
        <li><strong>Backfill in batches</strong> &mdash; never update millions of rows in a single transaction</li>
        <li><strong>Always use CONCURRENTLY</strong> for index creation in production</li>
        <li><strong>Add constraints as NOT VALID first</strong>, then validate separately to avoid full table locks</li>
        <li><strong>Deploy in the right order:</strong> migration before code that needs it, code change before migration that removes something</li>
        <li><strong>PostgreSQL 11+ is your friend</strong> &mdash; many operations that used to be dangerous are now safe, but always verify</li>
      </ul>

      <p>Zero-downtime migrations require more steps than a simple ALTER TABLE, but the alternative is explaining to your users why the app was down for 45 minutes during a &ldquo;routine update.&rdquo; The expand-contract pattern is not complex &mdash; it is disciplined. And discipline beats downtime every time.</p>
    `;
