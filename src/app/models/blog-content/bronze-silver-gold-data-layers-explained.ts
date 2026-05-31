export const CONTENT = `
      <p>Bronze, silver, and gold layers are a simple way to organize data as it becomes more trustworthy. The pattern is often called the <strong>medallion architecture</strong>. It is common in lakehouse systems, but the idea works anywhere: keep raw data, clean it into reliable facts, then publish business-ready data products.</p>

      <p>The value is not the names. The value is separating different quality levels so teams know what they can safely build on.</p>

      <aside class="callout callout-production">
        <strong>Production rule:</strong> bronze is for replay, silver is for correctness, and gold is for consumption. If every layer serves every purpose, the architecture stops helping.
      </aside>

      <h2>Bronze: Raw, Replayable Data</h2>

      <p>The bronze layer stores source data with minimal transformation. It should preserve enough detail to replay pipelines when downstream logic changes. Typical bronze data includes CDC events, API payloads, logs, Kafka topics, CSV exports, object-store drops, and vendor feeds.</p>

      <p>Bronze is not a junk drawer. It still needs ingestion metadata, load timestamps, source identifiers, schema capture, and retention policy. The goal is to keep the original signal without pretending it is already clean.</p>

      <pre><code>bronze.orders_raw
- source_system
- ingestion_batch_id
- ingestion_time
- payload_json
- source_event_time
- source_file_path</code></pre>

      <h2>Silver: Clean, Conformed, Reliable Facts</h2>

      <p>The silver layer turns raw data into usable entities. This is where you parse payloads, normalize timestamps, deduplicate records, apply type checks, handle deletes, join reference data, and create conformed dimensions or facts.</p>

      <p>Silver tables should be safe for engineers and analysts who understand the domain. They are not always final business metrics, but they should be dependable building blocks.</p>

      <pre><code>silver.orders
- order_id
- customer_id
- order_status
- order_total
- currency
- ordered_at
- updated_at
- is_deleted</code></pre>

      <h2>Gold: Business-Ready Data Products</h2>

      <p>The gold layer is where you publish datasets that answer real business questions. Gold tables power dashboards, finance reports, ML features, reverse ETL jobs, and operational reporting. They should have strong ownership, documented semantics, freshness expectations, and quality checks.</p>

      <pre><code>gold.daily_revenue
- revenue_date
- region
- product_line
- gross_revenue
- refunds
- net_revenue
- paying_customers</code></pre>

      <h2>What Changes Between Layers?</h2>

      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Layer</th>
              <th>Question it answers</th>
              <th>Typical owner</th>
              <th>Quality expectation</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Bronze</td>
              <td>Can we replay exactly what arrived?</td>
              <td>Data platform / ingestion team</td>
              <td>Completeness and traceability</td>
            </tr>
            <tr>
              <td>Silver</td>
              <td>Can engineers trust these entities?</td>
              <td>Data engineering / domain team</td>
              <td>Correctness and conformance</td>
            </tr>
            <tr>
              <td>Gold</td>
              <td>Can the business act on this output?</td>
              <td>Analytics / domain product owner</td>
              <td>Semantic stability and freshness</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Layer Flow Diagram</h2>

      <p>The layers are easiest to understand as a promotion flow. Each promotion should add a specific kind of trust. Bronze adds traceability. Silver adds correctness. Gold adds shared business meaning. If a step does not add trust, it is probably just a copy.</p>

      <div class="flow-diagram" role="img" aria-label="Bronze silver gold data layer promotion flow">
        <div class="flow-diagram-title">Raw Signal &rarr; Reliable Facts &rarr; Business Products</div>
        <div class="layer-diagram" style="max-width:680px">
          <div class="layer-item" style="background:var(--md-sys-color-surface-container-high);color:var(--md-sys-color-on-surface)">Source systems: application events, CDC, logs, vendor files</div>
          <div class="layer-item" style="background:var(--md-sys-color-tertiary-container);color:var(--md-sys-color-on-tertiary-container)">Bronze: raw, replayable, source-shaped, ingestion metadata attached</div>
          <div class="layer-item" style="background:var(--md-sys-color-secondary-container);color:var(--md-sys-color-on-secondary-container)">Silver: typed, deduplicated, conformed, tested domain entities</div>
          <div class="layer-item" style="background:var(--md-sys-color-primary-container);color:var(--md-sys-color-on-primary-container)">Gold: metric-ready data products with owners and freshness targets</div>
          <div class="layer-item" style="background:var(--md-sys-color-surface-container-high);color:var(--md-sys-color-on-surface)">Consumers: BI, reverse ETL, ML features, finance reports, APIs</div>
        </div>
      </div>

      <h2>Where Data Quality Checks Belong</h2>

      <p>Quality checks should become stricter as data moves upward. Bronze checks should prove that ingestion worked and that raw records can be traced. Silver checks should prove entity correctness. Gold checks should prove business meaning and consumer safety. Running the same checks in every layer creates noise; running no checks at promotion boundaries creates broken trust.</p>

      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Boundary</th>
              <th>Useful checks</th>
              <th>Failure action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Source to bronze</td>
              <td>File count, schema capture, source timestamp, batch ID, duplicate delivery, malformed payload rate.</td>
              <td>Quarantine bad payloads, alert ingestion owner, keep raw data for replay.</td>
            </tr>
            <tr>
              <td>Bronze to silver</td>
              <td>Primary key uniqueness, required fields, type conversion, late arrivals, deletes, referential checks.</td>
              <td>Stop promotion or publish partial data only with visible freshness and quality status.</td>
            </tr>
            <tr>
              <td>Silver to gold</td>
              <td>Metric reconciliation, semantic definitions, accepted dimensions, row-level security, freshness SLA.</td>
              <td>Block dashboard refresh, notify data product owner, preserve previous trusted version.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Handling Late Arriving and Corrected Data</h2>

      <p>Real data does not arrive perfectly ordered. Payments can settle later. CDC streams can replay events. A source system can send a correction. A vendor file can be reissued. Bronze should preserve those facts. Silver should decide how to apply them. Gold should expose a stable answer to consumers, including whether the metric is complete for a time window.</p>

      <p>A practical pattern is to separate <strong>event time</strong>, <strong>ingestion time</strong>, and <strong>processing time</strong>. Event time says when the business event happened. Ingestion time says when the platform received it. Processing time says when your model applied it. Keeping all three makes debugging possible when a dashboard changes unexpectedly.</p>

      <pre><code>-- Silver model pattern for late data
select
  order_id,
  customer_id,
  status,
  total_amount,
  source_event_time,
  ingestion_time,
  current_timestamp as processed_at
from bronze.orders_raw
where ingestion_time &gt;= last_successful_watermark</code></pre>

      <h2>Ownership Model for Each Layer</h2>

      <p>Layering does not remove ownership. It clarifies it. The platform team may own ingestion patterns and storage reliability, but domain teams still need to own entity meaning. Analytics teams may own gold metrics, but they should not silently patch bad silver data with dashboard SQL. When ownership is unclear, teams start fixing the same problem in different layers.</p>

      <aside class="callout callout-mistake">
        <strong>Common failure:</strong> gold tables become the only place business rules exist. That makes dashboards look right for one team while every other consumer sees inconsistent numbers.
      </aside>

      <p>Good ownership shows up in small details: table descriptions, data contracts, freshness alerts routed to the right team, documented breaking-change policy, and tests owned by the same team that owns the data product. The medallion pattern is only useful when those operating rules exist.</p>

      <h2>Example: Orders Pipeline</h2>

      <p>Consider an order service that emits CDC records. Bronze stores every source event with metadata. Silver reconstructs the current order state and a clean order-events history. Gold publishes daily revenue and fulfillment metrics. The same source supports multiple outputs, but each layer has a different contract.</p>

      <pre><code>bronze.orders_cdc
  raw_payload, op, source_lsn, source_event_time, ingestion_time

silver.orders_current
  order_id, customer_id, status, total_amount, updated_at, is_deleted

silver.order_events
  order_id, event_type, event_time, previous_status, next_status

gold.daily_revenue
  revenue_date, region, channel, net_revenue, paid_orders</code></pre>

      <p>This separation lets you replay from bronze when business logic changes, fix silver when entity rules are wrong, and keep gold focused on consumer-facing definitions. It also makes incident response cleaner: you can ask which layer introduced the error instead of debugging a single giant model.</p>

      <h2>Common Mistakes</h2>

      <ul>
        <li><strong>Deleting bronze too early.</strong> Without replay, every schema or business-rule change becomes painful.</li>
        <li><strong>Putting business metrics in silver.</strong> Silver should be reusable facts; gold should encode business meaning.</li>
        <li><strong>Copying everything into every layer.</strong> Layers should add value, not multiply storage and confusion.</li>
        <li><strong>No tests at promotion boundaries.</strong> Each layer transition needs data quality checks, not just SQL transformations.</li>
        <li><strong>No ownership.</strong> A gold table without an owner is just a dashboard dependency waiting to break.</li>
      </ul>

      <h2>A Practical Promotion Checklist</h2>

      <ul>
        <li>Bronze records include ingestion time, source, batch ID, and raw payload or source file reference.</li>
        <li>Silver tables have primary keys, deduplication rules, type checks, and delete/update handling.</li>
        <li>Gold datasets have documented definitions, freshness targets, owners, and downstream consumers.</li>
        <li>Every layer has retention policy, lineage, and monitoring.</li>
        <li>Critical transformations are tested with dbt, Great Expectations, Spark expectations, or platform-native checks.</li>
      </ul>

      <h2>Designing Layer Boundaries</h2>

      <p>The hardest part of bronze, silver, and gold is deciding what should not move upward yet. A row should not enter silver just because it exists in bronze. It should enter silver because the platform understands its identity, expected type, delete behavior, duplicate behavior, and relationship to other domain entities. A row should not enter gold just because it is clean. It should enter gold because consumers can use it without reverse-engineering business rules.</p>

      <p>A useful boundary test is to ask what promise the table makes. Bronze promises traceability: "this is what arrived from the source." Silver promises entity correctness: "this is the clean order, customer, payment, or session record." Gold promises decision usefulness: "this is the revenue, conversion, retention, or operational metric that a downstream team can act on." When the promise is unclear, the layer is probably unclear too.</p>

      <p>Do not make bronze too clever. If you parse away source detail too early, you lose the ability to replay when requirements change. Do not make silver too business-specific. If one dashboard's logic enters silver, every other consumer inherits that dashboard's assumptions. Do not make gold too generic. A gold table that tries to serve every metric becomes a second silver layer with a better name.</p>

      <h2>Backfills, Reprocessing, and Replay</h2>

      <p>Every serious data platform eventually needs to backfill. A source fixes historical records, a product changes a definition, a pipeline bug is found, or a new dimension must be added to an old metric. The medallion pattern is valuable because it gives you a replay path. You can rebuild silver from bronze, then rebuild gold from silver, while keeping the source of truth visible.</p>

      <p>Backfills should be treated like production changes. They need a scope, owner, validation query, rollback plan, and consumer communication. A backfill that silently changes a gold table can break trust even if the new number is more correct. Business users do not only need the right answer; they need to know why yesterday's answer changed.</p>

      <pre><code>backfill_runbook:
  reason: "payment status logic changed for refunded orders"
  input_scope: "bronze.orders_cdc from 2026-01-01 to 2026-05-31"
  rebuild_order: ["silver.orders_current", "silver.order_events", "gold.daily_revenue"]
  validation:
    - "row counts by day match expected source counts"
    - "refund totals reconcile with finance export"
    - "gold dashboard deltas are reviewed before publish"
  rollback: "restore previous gold snapshot if validation fails"</code></pre>

      <h2>How This Works with dbt and Spark</h2>

      <p>The medallion idea is not tied to one tool. In dbt, bronze might be external sources or staging models, silver might be intermediate and marts-adjacent models with strong tests, and gold might be published marts with documentation and exposures. In Spark, bronze might be raw object-store tables, silver might be normalized Delta or Iceberg tables, and gold might be curated aggregate tables or features.</p>

      <p>The important part is not whether the folder is named <code>silver</code>. The important part is whether promotion is testable. A dbt model that produces a gold metric should have tests that encode the metric contract. A Spark job that writes silver should record its input watermark, output row count, and bad-record count. A dashboard should not be the first place a broken transformation is noticed.</p>

      <h2>Review Questions Before Publishing a Gold Table</h2>

      <ul>
        <li>Who owns this table and who gets alerted when freshness or quality fails?</li>
        <li>What is the grain of the table, and can a consumer accidentally double count it?</li>
        <li>Which silver tables feed it, and are those dependencies documented?</li>
        <li>What definitions are encoded here that differ from another team's metric?</li>
        <li>Can the table be reproduced from bronze if a bug is found?</li>
        <li>Does a previous trusted version remain available during a failed publish?</li>
      </ul>

      <p>If those answers are missing, the gold table is not ready for production consumption. It may still be useful for exploration, but it should not become the official source for dashboards, finance exports, or customer-facing analytics.</p>

      <h2>Related CodersSecret Guides</h2>

      <ul>
        <li><a href="/blog/are-dags-dying-declarative-data-pipelines">Are DAGs Dying? The Rise of Declarative Data Pipelines</a></li>
        <li><a href="/blog/why-spark-jobs-become-slow-shuffle-skew-partitions-memory">Why Spark Jobs Become Slow</a></li>
        <li><a href="/courses/production-analytics-engineering-dbt">Production Analytics Engineering with dbt</a></li>
      </ul>

      <h2>Sources and Further Reading</h2>

      <ul>
        <li><a href="https://docs.databricks.com/aws/en/lakehouse/medallion">Databricks: What is the medallion lakehouse architecture?</a></li>
        <li><a href="https://docs.delta.io/">Delta Lake documentation</a></li>
      </ul>
`;
