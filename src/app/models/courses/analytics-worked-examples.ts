export interface AnalyticsWorkedExample {
  title: string;
  html: string;
}

export const ANALYTICS_WORKED_EXAMPLES: Record<string, AnalyticsWorkedExample> = {
  'what-is-analytics-engineering': {
    title: 'Reconcile two revenue dashboards',
    html: `<p>In this example, finance reports 9,200 and sales reports 10,000 for the same day. Both read the same warehouse. The difference is a missing refund rule, not missing data.</p>
      <table><thead><tr><th>Component</th><th>Amount</th><th>Definition</th></tr></thead><tbody>
        <tr><td>Completed orders</td><td>10,000</td><td>Gross amount before refunds</td></tr>
        <tr><td>Refunds</td><td>800</td><td>Refunds attributed to those orders</td></tr>
        <tr><td>Net revenue</td><td>9,200</td><td>Gross amount minus refunds</td></tr>
      </tbody></table>
      <p>The analytics engineer defines the metric once, records the refund timing rule, tests the calculation, and points both dashboards at it. The sales dashboard can still show gross revenue, but its label must say so.</p>
      <p><strong>Acceptance check:</strong> a new consumer can reproduce 9,200 without copying a dashboard-specific formula.</p>`,
  },
  'tables-grain-dashboard-lies': {
    title: 'Measure join fanout before aggregating',
    html: `<p>Order 101 is worth 100 and has two line items. Order 102 is worth 50 and has one. This standalone SQL example compares an unsafe join with a calculation at order grain.</p>
      <pre><code>with orders(order_id, amount) as (values (101, 100), (102, 50)),
items(order_id, item_id) as (values (101, 1), (101, 2), (102, 3))
select
  (select sum(o.amount) from orders o
   join items i on i.order_id = o.order_id) as unsafe_total,
  (select sum(amount) from orders) as order_total;</code></pre>
      <p><strong>Expected result:</strong> unsafe_total = 250; order_total = 150. The extra 100 is the repeated order amount. SUM(DISTINCT amount) is not a repair: two different orders can have the same amount. Aggregate items to one row per order before joining, or aggregate the order fact separately.</p>
      <p><strong>Acceptance check:</strong> compare row count and distinct order count before and after every join intended to preserve order grain.</p>`,
  },
  'dbt-mental-model': {
    title: 'Read dependencies from a model',
    html: `<p>Save the following model as <code>models/marts/fct_orders.sql</code> in a dbt project that already defines <code>stg_orders</code>.</p>
      <pre><code>select order_id, customer_id, amount
from {{ ref('stg_orders') }}
where status = 'completed'</code></pre>
      <p>The ref call resolves the relation and records a dependency. dbt compiles the template into warehouse SQL; the configured materialization determines whether the result becomes a view, table, or another supported relation. A file named fct_orders does not automatically become a table.</p>
      <p><strong>Expected dependency:</strong> source orders to stg_orders to fct_orders. Compile the project and inspect the resolved relation before a build. See the <a href="https://docs.getdbt.com/reference/dbt-jinja-functions/ref">dbt ref reference</a> for dependency behavior.</p>`,
  },
  'staging-models': {
    title: 'Standardize values without changing grain',
    html: `<p>A source sends padded status strings and amounts in cents. Normalize those representations while retaining one row per source order.</p>
      <pre><code>with raw_orders(order_id, amount_cents, status) as (
  values (101, 1250, ' PAID '), (102, 0, 'CANCELLED')
)
select order_id,
       amount_cents / 100.0 as amount,
       lower(trim(status)) as status
from raw_orders;</code></pre>
      <p><strong>Expected rows:</strong> (101, 12.5, paid) and (102, 0.0, cancelled). The cancelled order remains present: deciding which states count as revenue belongs in a documented business model. Validate source types before casting and record the currency separately; a numeric conversion does not perform foreign-exchange conversion.</p>`,
  },
  'intermediate-models': {
    title: 'Aggregate refunds before a reusable join',
    html: `<p>An order can have several refunds. Produce one refund total per order before sharing that logic with finance and customer-support marts.</p>
      <pre><code>with orders(order_id, amount) as (values (101, 100), (102, 50)),
refunds(order_id, amount) as (values (101, 10), (101, 15)),
refund_totals as (
  select order_id, sum(amount) as refunded
  from refunds group by order_id
)
select o.order_id, o.amount - coalesce(r.refunded, 0) as net_amount
from orders o left join refund_totals r on r.order_id = o.order_id;</code></pre>
      <p><strong>Expected rows:</strong> (101, 75) and (102, 50). The left join preserves an order with no refunds. In dbt, put the reusable result behind a ref and test its order_id for uniqueness. Decide explicitly how pending refunds and cross-currency refunds are handled before applying this pattern to production data.</p>`,
  },
  'marts-facts-dimensions': {
    title: 'Choose the time meaning of a dimension',
    html: `<p>Customer C7 ordered on January 10 while living in France, then moved to Germany on February 1. A current-state customer dimension classifies the old order as Germany. An order-time dimension classifies it as France. Both can be valid, but they answer different questions.</p>
      <table><thead><tr><th>Relation</th><th>Grain</th><th>Key rule</th></tr></thead><tbody>
        <tr><td>fct_orders</td><td>One row per completed order</td><td>Unique, non-null order_id</td></tr>
        <tr><td>dim_customers_current</td><td>One row per customer</td><td>Unique customer_id</td></tr>
        <tr><td>dim_customers_history</td><td>One row per customer version</td><td>Non-overlapping validity intervals</td></tr>
      </tbody></table>
      <p>For historical reporting, join on customer_id and the order timestamp within [valid_from, valid_to). A customer-only join to the history table duplicates orders. Specify whether the metric uses current attributes or order-time attributes before choosing the table.</p>
      <p><strong>Acceptance check:</strong> an order matches exactly one dimension version, including at a validity boundary.</p>`,
  },
  'testing-data-quality': {
    title: 'Turn a key assumption into a failing test',
    html: `<p>A dimension containing customer IDs 7, 7, and NULL should fail both uniqueness and non-null checks. This dbt model properties file expresses those assumptions:</p>
      <pre><code>version: 2
models:
  - name: dim_customers
    columns:
      - name: customer_id
        data_tests:
          - unique
          - not_null</code></pre>
      <p>Run <code>dbt test --select dim_customers</code> after building the model. A test failure means the assumed key contract is broken; it does not prove which upstream source caused it. Add a relationship test from orders to customers separately if referential integrity is required. See <a href="https://docs.getdbt.com/docs/build/data-tests">dbt data tests</a>.</p>
      <p><strong>Acceptance check:</strong> deliberately duplicate a key in a development fixture and confirm the test fails before relying on it as a release gate.</p>`,
  },
  'freshness-contracts-documentation': {
    title: 'Separate valid data from fresh data',
    html: `<p>At 09:00 UTC, the newest source ingestion timestamp is 08:10. A daily model can pass every key test while still violating a 30-minute freshness objective.</p>
      <table><thead><tr><th>Contract</th><th>Example value</th><th>Failure action</th></tr></thead><tbody>
        <tr><td>Owner</td><td>Payments data team</td><td>Route alerts to the accountable team</td></tr>
        <tr><td>Loaded timestamp</td><td>ingested_at in UTC</td><td>Investigate missing or invalid timestamps</td></tr>
        <tr><td>Maximum source age</td><td>30 minutes during the agreed service window</td><td>Warn consumers that the source is delayed</td></tr>
        <tr><td>Serving model age</td><td>Latest successful model run</td><td>Check transformation lag separately</td></tr>
      </tbody></table>
      <p><strong>Expected finding:</strong> source age is 50 minutes, exceeding the example objective by 20 minutes. Use ingestion time when measuring delivery delay; an old event can arrive on time in a backfill. Document maintenance windows and empty-source behavior so an alert has an actionable meaning.</p>`,
  },
  'incremental-models-backfills': {
    title: 'Catch a late update without duplicating an order',
    html: `<p>Order 101 has created_at = Monday and source_updated_at = Wednesday. A Wednesday load filtered only by created_at misses the update. The processing cursor and business event timestamp serve different purposes.</p>
      <pre><code>Existing target: order 101, amount 100, updated Monday
Incoming batch:  order 101, amount 80, updated Wednesday
Required target: order 101, amount 80, one row only</code></pre>
      <p>Choose a reliable source update timestamp, an overlap window, and an adapter-supported merge or replacement strategy keyed by order_id. The unique_key setting identifies matching rows; it is not a database uniqueness test. Handle deletes explicitly and run a backfill for corrections older than the overlap window. Exact incremental syntax depends on the warehouse and adapter; see <a href="https://docs.getdbt.com/docs/build/incremental-models">dbt incremental models</a>.</p>
      <p><strong>Acceptance check:</strong> process the same batch twice, then process an older correction. Verify one final row per order and reconcile against a full rebuild on the same source snapshot.</p>`,
  },
  'metrics-as-product-apis': {
    title: 'Write a metric contract with a counterexample',
    html: `<p>For this exercise, define order-date net revenue in USD as completed order gross amount minus successful refunds attributed to those orders. Exclude cancelled orders and taxes. This is a teaching definition, not an accounting standard.</p>
      <pre><code>Order 101: completed, gross 100, successful refund 20
Order 102: cancelled, gross 50, successful refund 0
Expected net revenue: 80 USD</code></pre>
      <p>A cash-flow report that buckets refunds by refund date will have a different daily result. Give that metric a different name rather than silently changing the existing API. Record allowed dimensions, currency handling, owner, refund timing, and version policy with the metric.</p>
      <p><strong>Acceptance check:</strong> a dashboard and an API consumer return the same 80 for the fixed fixture, and both exclude order 102.</p>`,
  },
  'semantic-layer-fundamentals': {
    title: 'Resolve a question into joins and aggregation',
    html: `<p>The question is "net revenue by customer country." Identify the measure, dimension, join cardinality, and time interpretation before generating SQL.</p>
      <pre><code>with orders(customer_id, net_amount) as (values (7, 80), (8, 50)),
customers(customer_id, country) as (values (7, 'FR'), (8, 'DE'))
select c.country, sum(o.net_amount) as net_revenue
from orders o join customers c on c.customer_id = o.customer_id
group by c.country order by c.country;</code></pre>
      <p><strong>Expected rows:</strong> DE = 50 and FR = 80. This example assumes one current customer row per customer_id and no missing customer keys. Duplicating a customer row changes the result, so the semantic layer still depends on tested entity relationships. For historical countries, use the validity-aware design from the <a href="/courses/production-analytics-engineering-dbt/marts-facts-dimensions">facts and dimensions lesson</a>.</p>`,
  },
  'metricflow-dbt-semantic-layer': {
    title: 'Review a semantic query plan',
    html: `<p>Use this conceptual plan to review a MetricFlow query. It is a design checklist, not a version-specific YAML configuration.</p>
      <table><thead><tr><th>Definition</th><th>Example</th><th>Review question</th></tr></thead><tbody>
        <tr><td>Entity</td><td>order and customer</td><td>Which side is unique?</td></tr>
        <tr><td>Measure</td><td>Sum of net_amount</td><td>Is the input already at order grain?</td></tr>
        <tr><td>Time dimension</td><td>order_date</td><td>Which timezone and day boundary apply?</td></tr>
        <tr><td>Group-by dimension</td><td>customer country</td><td>Current country or country at order time?</td></tr>
      </tbody></table>
      <p>Compile a query for the same two-country fixture from the previous lesson and inspect the joins in the generated SQL. Compare its result with the hand-checked totals before exposing it to dashboards. Central generation makes a definition reusable; an incorrect definition can still produce consistently incorrect results.</p>
      <p><strong>Acceptance check:</strong> no many-to-many join is introduced, and adding a second measure does not change the first measure's total.</p>`,
  },
  'lineage-dbt-artifacts': {
    title: 'Trace a unit change to consumers',
    html: `<p>A source changes amount from dollars to cents. Trace the dependency before editing a downstream dashboard.</p>
      <pre><code>raw_orders.amount_cents
  -> stg_orders.amount (divide by 100)
    -> fct_orders.net_amount
      -> net_revenue metric
        -> finance dashboard
        -> revenue API</code></pre>
      <p>Use the dependency graph in dbt artifacts to identify model edges, then add consumers that live outside dbt. A graph can show that one model depends on another without proving the units or every field-level transformation. Review SQL, model descriptions, exposures, and consumer ownership together.</p>
      <p><strong>Acceptance check:</strong> the fixture value 1250 becomes 12.50 exactly once, every affected consumer has an owner, and the migration plan covers both old and new source versions.</p>`,
  },
  'data-incidents-debugging': {
    title: 'Localize a revenue regression',
    html: `<p>After a deployment, revenue falls by 40% while order count stays at 100. Compare intermediate results at the same snapshot and time window.</p>
      <table><thead><tr><th>Check</th><th>Before</th><th>After</th></tr></thead><tbody>
        <tr><td>Completed order count</td><td>100</td><td>100</td></tr>
        <tr><td>Gross amount</td><td>10,000</td><td>10,000</td></tr>
        <tr><td>Refund total</td><td>500</td><td>4,300</td></tr>
        <tr><td>Net revenue</td><td>9,500</td><td>5,700</td></tr>
      </tbody></table>
      <p>The first observed divergence is the refund total. Inspect its filters, units, join cardinality, and recent code changes. This table narrows the investigation; it does not prove a particular root cause. Preserve the failing query and source snapshot, correct the model, backfill affected partitions, and reconcile consumer totals.</p>
      <p><strong>Acceptance check:</strong> add a regression fixture that reproduces the actual defect, then confirm both the corrected result and unaffected date ranges.</p>`,
  },
  'analytics-engineering-cicd': {
    title: 'Select downstream work for a changed dimension',
    html: `<p>A pull request changes dim_customers.country. A development build must exercise the dimension and the models downstream of it, not only compile the edited file.</p>
      <pre><code>dbt build --select dim_customers+ --target ci</code></pre>
      <p>The trailing plus selects descendants in the model graph. Configure an isolated ci target with the required upstream relations and credentials before running this command. The selection does not automatically test every external dashboard, API, or semantic query, so add consumer checks for those contracts. See <a href="https://docs.getdbt.com/reference/node-selection/syntax">dbt selection syntax</a>.</p>
      <p><strong>Acceptance check:</strong> the country fixture produces the expected grouped metric, changed column contracts pass, and a failed build prevents promotion. Keep promotion and rollback as explicit deployment steps.</p>`,
  },
  'trusted-analytics-layer-capstone': {
    title: 'Deliver evidence for a trusted revenue model',
    html: `<p>Use three orders: completed order 101 for 100 with a refund of 20, completed order 102 for 50 without a refund, and cancelled order 103 for 90. Under the teaching metric contract, net revenue is 130.</p>
      <table><thead><tr><th>Deliverable</th><th>Evidence to provide</th></tr></thead><tbody>
        <tr><td>Models</td><td>Staging, refund aggregation, order fact, and customer dimension with stated grain</td></tr>
        <tr><td>Tests</td><td>Key uniqueness, non-null keys, relationships, and the 130 revenue fixture</td></tr>
        <tr><td>Operations</td><td>Freshness objective, owner, retry behavior, and backfill procedure</td></tr>
        <tr><td>Consumers</td><td>One metric contract used by a dashboard and an API</td></tr>
      </tbody></table>
      <p>Introduce a duplicated refund, a late correction, and a missing customer in separate runs. Show which check catches each defect and how you recover without changing unrelated dates. Keep the source snapshot, model revision, test results, and reconciliation together.</p>
      <p><strong>Acceptance check:</strong> another engineer can reproduce 130, explain every exclusion, and restore the expected result after each injected data-quality failure.</p>`,
  },
};
