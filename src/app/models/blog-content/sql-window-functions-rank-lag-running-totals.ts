export const CONTENT = `
      <p>You need to rank products by sales within each category. Or calculate a running total of revenue by month. Or compare each row to the previous one. Without window functions, you write correlated subqueries or self-joins that are slow and unreadable. With window functions, each of these is a single, elegant expression.</p>

      <h2>What Is a Window Function?</h2>

      <p>A window function performs a calculation across a set of rows that are related to the current row. Unlike GROUP BY (which collapses rows), window functions <strong>keep every row</strong> and add the calculated value as a new column.</p>

      <pre><code>-- GROUP BY: collapses to one row per department
SELECT department, AVG(salary)
FROM employees
GROUP BY department;
-- Result: 3 rows (one per department)

-- Window function: keeps all rows, adds average as column
SELECT name, department, salary,
       AVG(salary) OVER (PARTITION BY department) as dept_avg
FROM employees;
-- Result: all employee rows, each with their department average</code></pre>

      <h2>The OVER Clause</h2>

      <pre><code>-- Syntax:
-- function_name() OVER (
--   PARTITION BY column    -- groups (like GROUP BY but keeps rows)
--   ORDER BY column        -- ordering within each partition
--   ROWS/RANGE frame       -- which rows to include in calculation
-- )

-- All parts are optional:
SUM(amount) OVER ()                              -- sum of ALL rows
SUM(amount) OVER (PARTITION BY category)         -- sum per category
SUM(amount) OVER (ORDER BY date)                 -- running total
SUM(amount) OVER (PARTITION BY cat ORDER BY date) -- running total per category</code></pre>

      <h2>ROW_NUMBER, RANK, DENSE_RANK</h2>

      <pre><code>-- Sample data: product sales
-- product  | category    | revenue
-- iPhone   | Electronics | 1000
-- MacBook  | Electronics | 800
-- iPad     | Electronics | 800
-- Shirt    | Clothing    | 200
-- Jacket   | Clothing    | 150

SELECT product, category, revenue,
  ROW_NUMBER() OVER (PARTITION BY category ORDER BY revenue DESC) as row_num,
  RANK()       OVER (PARTITION BY category ORDER BY revenue DESC) as rank,
  DENSE_RANK() OVER (PARTITION BY category ORDER BY revenue DESC) as dense_rank
FROM products;

-- Result:
-- product  | category    | revenue | row_num | rank | dense_rank
-- iPhone   | Electronics | 1000    | 1       | 1    | 1
-- MacBook  | Electronics | 800     | 2       | 2    | 2
-- iPad     | Electronics | 800     | 3       | 2    | 2  (tie!)
-- Shirt    | Clothing    | 200     | 1       | 1    | 1
-- Jacket   | Clothing    | 150     | 2       | 2    | 2

-- ROW_NUMBER: always unique (arbitrary tiebreak)
-- RANK: ties get same rank, next rank skipped (1,2,2,4)
-- DENSE_RANK: ties get same rank, no skip (1,2,2,3)</code></pre>

      <h3>Practical: Top 3 Products Per Category</h3>

      <pre><code>-- Get the top 3 selling products in each category
WITH ranked AS (
  SELECT product, category, revenue,
    ROW_NUMBER() OVER (PARTITION BY category ORDER BY revenue DESC) as rn
  FROM products
)
SELECT product, category, revenue
FROM ranked
WHERE rn &lt;= 3;</code></pre>

      <h2>LAG and LEAD: Compare Adjacent Rows</h2>

      <pre><code>-- LAG: access the previous row's value
-- LEAD: access the next row's value

SELECT month, revenue,
  LAG(revenue) OVER (ORDER BY month) as prev_month,
  revenue - LAG(revenue) OVER (ORDER BY month) as month_over_month,
  ROUND(
    (revenue - LAG(revenue) OVER (ORDER BY month))::numeric /
    LAG(revenue) OVER (ORDER BY month) * 100, 1
  ) as pct_change
FROM monthly_revenue;

-- Result:
-- month   | revenue | prev_month | month_over_month | pct_change
-- 2026-01 | 10000   | NULL       | NULL             | NULL
-- 2026-02 | 12000   | 10000      | 2000             | 20.0
-- 2026-03 | 11500   | 12000      | -500             | -4.2
-- 2026-04 | 15000   | 11500      | 3500             | 30.4

-- LEAD example: compare with next period
SELECT month, revenue,
  LEAD(revenue) OVER (ORDER BY month) as next_month
FROM monthly_revenue;</code></pre>

      <h2>Running Totals and Moving Averages</h2>

      <pre><code>-- Running total (cumulative sum)
SELECT date, amount,
  SUM(amount) OVER (ORDER BY date) as running_total
FROM transactions;

-- date       | amount | running_total
-- 2026-04-01 | 100    | 100
-- 2026-04-02 | 250    | 350
-- 2026-04-03 | 75     | 425
-- 2026-04-04 | 300    | 725

-- Running total per customer
SELECT customer_id, date, amount,
  SUM(amount) OVER (PARTITION BY customer_id ORDER BY date) as customer_running_total
FROM transactions;

-- 7-day moving average
SELECT date, revenue,
  AVG(revenue) OVER (
    ORDER BY date
    ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
  ) as moving_avg_7d
FROM daily_revenue;

-- 30-day moving sum
SELECT date, signups,
  SUM(signups) OVER (
    ORDER BY date
    ROWS BETWEEN 29 PRECEDING AND CURRENT ROW
  ) as signups_last_30d
FROM daily_metrics;</code></pre>

      <h2>FIRST_VALUE, LAST_VALUE, NTH_VALUE</h2>

      <pre><code>-- First and last values in a partition
SELECT department, employee, salary,
  FIRST_VALUE(employee) OVER (
    PARTITION BY department ORDER BY salary DESC
  ) as highest_paid,
  FIRST_VALUE(salary) OVER (
    PARTITION BY department ORDER BY salary DESC
  ) as max_salary,
  salary - FIRST_VALUE(salary) OVER (
    PARTITION BY department ORDER BY salary DESC
  ) as gap_from_top
FROM employees;

-- Find each employee's salary as a percentage of department max
SELECT employee, department, salary,
  ROUND(
    salary::numeric / FIRST_VALUE(salary) OVER (
      PARTITION BY department ORDER BY salary DESC
    ) * 100, 1
  ) as pct_of_max
FROM employees;</code></pre>

      <h2>NTILE: Bucketing Rows</h2>

      <pre><code>-- Divide customers into quartiles by spending
SELECT customer, total_spent,
  NTILE(4) OVER (ORDER BY total_spent DESC) as quartile
FROM customer_spending;

-- quartile 1: top 25% spenders (VIP)
-- quartile 2: above average
-- quartile 3: below average
-- quartile 4: lowest spenders

-- Percentile ranking
SELECT customer, total_spent,
  PERCENT_RANK() OVER (ORDER BY total_spent) as percentile
FROM customer_spending;
-- percentile 0.95 means "better than 95% of customers"</code></pre>

      <h2>Real-World Examples</h2>

      <h3>Detect Consecutive Streaks</h3>

      <pre><code>-- Find users with 3+ consecutive days of activity
WITH activity AS (
  SELECT user_id, activity_date,
    activity_date - (ROW_NUMBER() OVER (
      PARTITION BY user_id ORDER BY activity_date
    ))::int AS streak_group
  FROM user_activity
)
SELECT user_id,
  MIN(activity_date) as streak_start,
  MAX(activity_date) as streak_end,
  COUNT(*) as streak_days
FROM activity
GROUP BY user_id, streak_group
HAVING COUNT(*) >= 3
ORDER BY streak_days DESC;</code></pre>

      <h3>Remove Duplicates (Keep Latest)</h3>

      <pre><code>-- Keep only the most recent record per user
DELETE FROM user_profiles
WHERE id IN (
  SELECT id FROM (
    SELECT id,
      ROW_NUMBER() OVER (PARTITION BY email ORDER BY updated_at DESC) as rn
    FROM user_profiles
  ) ranked
  WHERE rn > 1
);</code></pre>

      <h2>Window Function Cheat Sheet</h2>

      <table>
        <thead>
          <tr>
            <th>Function</th>
            <th>Purpose</th>
            <th>Example Use Case</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>ROW_NUMBER()</td>
            <td>Unique sequential number</td>
            <td>Top-N per group, deduplication</td>
          </tr>
          <tr>
            <td>RANK()</td>
            <td>Rank with gaps on ties</td>
            <td>Competition rankings</td>
          </tr>
          <tr>
            <td>DENSE_RANK()</td>
            <td>Rank without gaps</td>
            <td>Salary bands</td>
          </tr>
          <tr>
            <td>LAG(col, n)</td>
            <td>Previous row value</td>
            <td>Month-over-month change</td>
          </tr>
          <tr>
            <td>LEAD(col, n)</td>
            <td>Next row value</td>
            <td>Time to next event</td>
          </tr>
          <tr>
            <td>SUM() OVER</td>
            <td>Running total</td>
            <td>Cumulative revenue</td>
          </tr>
          <tr>
            <td>AVG() OVER</td>
            <td>Moving average</td>
            <td>7-day trend line</td>
          </tr>
          <tr>
            <td>NTILE(n)</td>
            <td>Divide into n buckets</td>
            <td>Customer segmentation</td>
          </tr>
          <tr>
            <td>FIRST_VALUE()</td>
            <td>First value in window</td>
            <td>Gap from best performer</td>
          </tr>
          <tr>
            <td>PERCENT_RANK()</td>
            <td>Percentile (0-1)</td>
            <td>Performance percentile</td>
          </tr>
        </tbody>
      </table>

      <h2>Key Takeaways</h2>

      <ul>
        <li><strong>Window functions keep all rows</strong> unlike GROUP BY which collapses them &mdash; you get the calculation AND the detail</li>
        <li><strong>PARTITION BY is like GROUP BY for windows</strong> &mdash; it defines the groups without collapsing rows</li>
        <li><strong>ROW_NUMBER() is the most versatile</strong> &mdash; top-N queries, deduplication, pagination</li>
        <li><strong>LAG/LEAD compare adjacent rows</strong> &mdash; month-over-month growth, time between events</li>
        <li><strong>SUM/AVG OVER with ROWS BETWEEN</strong> creates running totals and moving averages</li>
        <li><strong>Window functions execute after WHERE and GROUP BY</strong> but before ORDER BY and LIMIT</li>
        <li><strong>Use CTEs (WITH clause) to filter window results</strong> &mdash; you cannot put window functions in WHERE</li>
      </ul>

      <p>Window functions are the single most powerful SQL feature that most developers have not learned. Once you internalize OVER, PARTITION BY, and ORDER BY, queries that previously required subqueries, self-joins, or application code become simple one-liners. They work in PostgreSQL, MySQL 8+, SQLite 3.25+, and every major database.</p>
    `;
