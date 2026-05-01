export const CONTENT = `
      <p>Let me tell you a story. You're a data engineer at a growing startup. Your team dumps CSV files into S3 — sales reports, user events, transaction logs. Fifty files. Then five hundred. Then five thousand. One morning, a data analyst asks you: "Where's the Q3 revenue data?" And you realise... you have no idea. Is it in <code>s3://data/reports/revenue_q3.csv</code> or <code>s3://analytics/sales/2025-q3/</code> or <code>s3://data-lake-prod/revenue/year=2025/quarter=3/</code>?</p>

      <p>Nobody knows which files have which columns. Nobody knows what data type "revenue" is — is it a float? An integer? A string with a dollar sign? Nobody knows when the data was last updated, who created it, or whether it's even valid anymore.</p>

      <p>You have a data swamp, not a data lake.</p>

      <p><strong>This is the problem a metastore solves.</strong></p>

      <h2>What is a Metastore?</h2>

      <p>A metastore is a <strong>catalogue of metadata</strong> — it stores information <em>about</em> your data, not the data itself. Think of it as the card catalogue in a library. The books (data files) are on the shelves (S3, ADLS, GCS). The catalogue tells you: which shelf, what topic, how many pages, when it was published, and who wrote it.</p>

      <!-- What a Metastore Stores -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">What a Metastore Actually Stores</div>
        <div class="layer-diagram">
          <div class="layer-item" style="background:#3b82f6">Table Definitions (Schema)<span class="layer-item-sub">Column names, data types, partitioning scheme — "revenue is a DECIMAL(10,2), partitioned by year"</span></div>
          <div class="layer-item" style="background:#7c3aed">Location Mapping<span class="layer-item-sub">Where the data files live — "this table's data is at s3://lake/sales/revenue/"</span></div>
          <div class="layer-item" style="background:#f97316">Partition Information<span class="layer-item-sub">Which partitions exist and where — "year=2025/quarter=3 has 47 Parquet files"</span></div>
          <div class="layer-item" style="background:#22c55e">Statistics &amp; Metadata<span class="layer-item-sub">Row counts, file sizes, column min/max — used by query optimizers to run queries faster</span></div>
          <div class="layer-item" style="background:#ef4444">Access Control &amp; Governance<span class="layer-item-sub">Who can read which tables, column-level masking, audit logs — "analysts can see revenue but not PII"</span></div>
        </div>
      </div>

      <p>Without a metastore, every query engine (Spark, Presto, Trino, Athena) would need to scan every file to figure out what's inside. With a metastore, they just ask the catalogue: "What are the columns in the sales.revenue table? Where are the files?" and go straight to reading data. It's the difference between opening every book in the library versus checking the catalogue first.</p>

      <h2>The Evolution of Metastores</h2>

      <!-- Evolution Timeline -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">The Metastore Evolution</div>
        <div class="pipeline">
          <div class="pipeline-step" style="background:#f97316;--i:0"><span class="pipeline-step-icon">&#x1F418;</span>Hive<span class="pipeline-step-sub">2010 (original)</span></div>
          <div class="pipeline-arrow">&#x2192;</div>
          <div class="pipeline-step" style="background:#3b82f6;--i:1"><span class="pipeline-step-icon">&#x2601;</span>AWS Glue<span class="pipeline-step-sub">2017 (managed)</span></div>
          <div class="pipeline-arrow">&#x2192;</div>
          <div class="pipeline-step" style="background:#ef4444;--i:2"><span class="pipeline-step-icon">&#x1F9F1;</span>Unity Catalog<span class="pipeline-step-sub">2022 (governance)</span></div>
          <div class="pipeline-arrow">&#x2192;</div>
          <div class="pipeline-step" style="background:#22c55e;--i:3"><span class="pipeline-step-icon">&#x2744;</span>Polaris<span class="pipeline-step-sub">2024 (open, Iceberg)</span></div>
        </div>
      </div>

      <h2>Apache Hive Metastore — The Original</h2>

      <p>The Hive Metastore (HMS) was built by Facebook in 2010 as part of Apache Hive. It became the <strong>de facto standard</strong> that every data tool speaks. Even today, Spark, Presto, Trino, Flink, and dozens of other engines can talk to a Hive Metastore.</p>

      <h2>How Hive Metastore Works</h2>

      <!-- HMS Architecture -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">Hive Metastore Architecture</div>
        <div class="seq-diagram">
          <div class="seq-actors">
            <div class="seq-actor browser">Query Engine<span class="seq-actor-sub">(Spark / Trino)</span></div>
            <div class="seq-actor idp">Hive Metastore<span class="seq-actor-sub">(Thrift API)</span></div>
            <div class="seq-actor sp">Backend DB<span class="seq-actor-sub">(MySQL / PostgreSQL)</span></div>
          </div>
          <div class="seq-steps">
            <div class="seq-step">
              <div class="seq-arrow right" style="--arrow-color:#3b82f6"><span class="seq-num blue">1</span> "What columns does sales.revenue have?"</div>
            </div>
            <div class="seq-step">
              <div class="seq-arrow right-23" style="--arrow-color:#7c3aed"><span class="seq-num purple">2</span> SELECT * FROM TBLS WHERE TBL_NAME='revenue'</div>
            </div>
            <div class="seq-step">
              <div class="seq-arrow left-23" style="--arrow-color:#22c55e"><span class="seq-num green">3</span> Schema: {id: BIGINT, amount: DECIMAL, date: DATE}</div>
            </div>
            <div class="seq-step">
              <div class="seq-arrow left" style="--arrow-color:#22c55e"><span class="seq-num green">4</span> Schema + location: s3://lake/sales/revenue/</div>
            </div>
            <div class="seq-step">
              <div></div>
              <div></div>
              <div class="seq-action" style="border-color:#3b82f6;color:#60a5fa">Engine reads Parquet files directly from S3</div>
            </div>
          </div>
        </div>
      </div>

      <pre><code>-- Hive DDL: Creating a table in the metastore
CREATE EXTERNAL TABLE sales.revenue (
    transaction_id  BIGINT,
    customer_id     BIGINT,
    amount          DECIMAL(10,2),
    currency        STRING,
    payment_method  STRING,
    created_at      TIMESTAMP
)
PARTITIONED BY (year INT, quarter INT)
STORED AS PARQUET
LOCATION 's3://data-lake-prod/sales/revenue/';

-- Add a partition (tells metastore where to find the data)
ALTER TABLE sales.revenue ADD PARTITION (year=2025, quarter=3)
LOCATION 's3://data-lake-prod/sales/revenue/year=2025/quarter=3/';

-- Now ANY engine connected to this metastore can query:
SELECT SUM(amount) FROM sales.revenue WHERE year=2025 AND quarter=3;
-- Spark, Presto, Trino, Athena — they all understand this schema</code></pre>

      <pre><code># Running Hive Metastore standalone (no Hive needed!)
# Most teams run HMS as a standalone service

# Docker Compose for Hive Metastore + PostgreSQL backend
version: '3.8'
services:
  metastore-db:
    image: postgres:15
    environment:
      POSTGRES_DB: metastore
      POSTGRES_USER: hive
      POSTGRES_PASSWORD: hive123
    volumes:
      - metastore-data:/var/lib/postgresql/data

  metastore:
    image: apache/hive:4.0.0
    depends_on:
      - metastore-db
    environment:
      SERVICE_NAME: metastore
      DB_DRIVER: postgres
      SERVICE_OPTS: >-
        -Djavax.jdo.option.ConnectionURL=jdbc:postgresql://metastore-db:5432/metastore
        -Djavax.jdo.option.ConnectionDriverName=org.postgresql.Driver
        -Djavax.jdo.option.ConnectionUserName=hive
        -Djavax.jdo.option.ConnectionPassword=hive123
    ports:
      - "9083:9083"  # Thrift API port

volumes:
  metastore-data:</code></pre>

      <h2>Hive Metastore: Pros &amp; Cons</h2>

      <div class="flow-diagram">
        <div class="flow-diagram-title">Hive Metastore Assessment</div>
        <div class="vs-cards" style="grid-template-columns:1fr 1fr">
          <div class="vs-card" style="border-color:#22c55e">
            <div class="vs-card-header" style="background:#22c55e">&#x2705; Strengths</div>
            <div class="vs-card-body">
              <div class="vs-row"><span class="vs-row-icon">&#x1F310;</span>Universal — every engine speaks Hive protocol</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F4E6;</span>Open source (Apache 2.0)</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F504;</span>Battle-tested at petabyte scale</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F512;</span>Self-hosted — full control over your metadata</div>
            </div>
          </div>
          <div class="vs-card" style="border-color:#ef4444">
            <div class="vs-card-header" style="background:#ef4444">&#x274C; Weaknesses</div>
            <div class="vs-card-body">
              <div class="vs-row"><span class="vs-row-icon">&#x1F6E0;</span>Operational burden — you manage the DB, backups, upgrades</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F422;</span>Single-threaded Thrift server — bottleneck at scale</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F6AB;</span>No built-in access control (anyone who connects can see everything)</div>
              <div class="vs-row"><span class="vs-row-icon">&#x1F4C5;</span>Old architecture — designed for Hadoop, not modern lakehouse</div>
            </div>
          </div>
        </div>
      </div>

      <h2>AWS Glue Data Catalog — Managed Hive Metastore</h2>

      <p>AWS Glue Data Catalog is essentially a <strong>managed Hive Metastore</strong> hosted by AWS. You don't run any servers, don't manage a database, don't worry about backups. AWS handles everything. And it's deeply integrated with the AWS ecosystem — Athena, Redshift Spectrum, EMR, Lake Formation, and Glue ETL all share the same catalogue.</p>

      <pre><code># AWS Glue: Creating a table via AWS CLI
aws glue create-table \\
  --database-name sales \\
  --table-input '{
    "Name": "revenue",
    "StorageDescriptor": {
      "Columns": [
        {"Name": "transaction_id", "Type": "bigint"},
        {"Name": "customer_id", "Type": "bigint"},
        {"Name": "amount", "Type": "decimal(10,2)"},
        {"Name": "currency", "Type": "string"},
        {"Name": "created_at", "Type": "timestamp"}
      ],
      "Location": "s3://data-lake-prod/sales/revenue/",
      "InputFormat": "org.apache.hadoop.hive.ql.io.parquet.MapredParquetInputFormat",
      "OutputFormat": "org.apache.hadoop.hive.ql.io.parquet.MapredParquetOutputFormat",
      "SerdeInfo": {
        "SerializationLibrary": "org.apache.hadoop.hive.ql.io.parquet.serde.ParquetHiveSerDe"
      }
    },
    "PartitionKeys": [
      {"Name": "year", "Type": "int"},
      {"Name": "quarter", "Type": "int"}
    ],
    "TableType": "EXTERNAL_TABLE"
  }'

# Now query via Athena (SQL over S3 — serverless):
# SELECT SUM(amount) FROM sales.revenue WHERE year=2025;
# No servers to manage. Pay per query.</code></pre>

      <pre><code># Glue Crawlers: Auto-discover schemas
# Instead of manually defining tables, let Glue scan your S3 bucket:
aws glue create-crawler \\
  --name sales-crawler \\
  --role GlueServiceRole \\
  --database-name sales \\
  --targets '{
    "S3Targets": [
      {"Path": "s3://data-lake-prod/sales/"}
    ]
  }'

# Run the crawler
aws glue start-crawler --name sales-crawler
# Glue scans the Parquet files, infers the schema, and creates
# tables + partitions in the Data Catalog automatically!

# Terraform for Glue Catalog
resource "aws_glue_catalog_database" "sales" {
  name = "sales"
}

resource "aws_glue_catalog_table" "revenue" {
  name          = "revenue"
  database_name = aws_glue_catalog_database.sales.name

  table_type = "EXTERNAL_TABLE"
  parameters = {
    classification = "parquet"
  }

  storage_descriptor {
    location      = "s3://data-lake-prod/sales/revenue/"
    input_format  = "org.apache.hadoop.hive.ql.io.parquet.MapredParquetInputFormat"
    output_format = "org.apache.hadoop.hive.ql.io.parquet.MapredParquetOutputFormat"

    ser_de_info {
      serialization_library = "org.apache.hadoop.hive.ql.io.parquet.serde.ParquetHiveSerDe"
    }

    columns {
      name = "transaction_id"
      type = "bigint"
    }
    columns {
      name = "amount"
      type = "decimal(10,2)"
    }
  }

  partition_keys {
    name = "year"
    type = "int"
  }
}</code></pre>

      <h2>AWS Lake Formation — Governance on Top of Glue</h2>

      <p>Glue Data Catalog tells you <em>what</em> data exists. <strong>Lake Formation</strong> adds <em>who can access it</em>. It provides fine-grained access control: table-level, column-level, even row-level filtering. This is how enterprises manage data lakes at scale.</p>

      <pre><code># Lake Formation: Grant access to a table
aws lakeformation grant-permissions \\
  --principal '{"DataLakePrincipalIdentifier": "arn:aws:iam::123456789:role/analyst-role"}' \\
  --resource '{"Table": {"DatabaseName": "sales", "Name": "revenue"}}' \\
  --permissions '["SELECT"]' \\
  --permissions-with-grant-option '[]'

# Column-level access:
aws lakeformation grant-permissions \\
  --principal '{"DataLakePrincipalIdentifier": "arn:aws:iam::123456789:role/analyst-role"}' \\
  --resource '{"TableWithColumns": {"DatabaseName": "sales", "Name": "customers", "ColumnNames": ["name", "city"], "ColumnWildcard": null}}' \\
  --permissions '["SELECT"]'
# Analysts can see name and city, but NOT email, phone, or SSN</code></pre>

      <h2>Databricks Unity Catalog — The Governance-First Approach</h2>

      <p>Databricks Unity Catalog takes a fundamentally different approach. Instead of bolting governance onto an existing catalogue (like Lake Formation does with Glue), Unity Catalog was <strong>built from the ground up for governance</strong>. It provides a three-level namespace, centralised access control, data lineage, and cross-workspace sharing.</p>

      <!-- Unity Catalog Namespace -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">Unity Catalog: Three-Level Namespace</div>
        <div class="pipeline">
          <div class="pipeline-step" style="background:#ef4444;--i:0"><span class="pipeline-step-icon">&#x1F3E2;</span>Catalog<span class="pipeline-step-sub">e.g., production</span></div>
          <div class="pipeline-arrow">.</div>
          <div class="pipeline-step" style="background:#f97316;--i:1"><span class="pipeline-step-icon">&#x1F4C1;</span>Schema<span class="pipeline-step-sub">e.g., sales</span></div>
          <div class="pipeline-arrow">.</div>
          <div class="pipeline-step" style="background:#22c55e;--i:2"><span class="pipeline-step-icon">&#x1F4CA;</span>Table<span class="pipeline-step-sub">e.g., revenue</span></div>
        </div>
      </div>

      <pre><code>-- Unity Catalog: Creating objects
-- Three-level namespace: catalog.schema.table

-- Create a catalog (top-level container)
CREATE CATALOG production;

-- Create a schema within the catalog
CREATE SCHEMA production.sales;

-- Create a managed table (Unity Catalog manages the storage)
CREATE TABLE production.sales.revenue (
    transaction_id  BIGINT,
    customer_id     BIGINT,
    amount          DECIMAL(10,2),
    currency        STRING,
    created_at      TIMESTAMP
)
USING DELTA;  -- Delta Lake format (ACID transactions!)

-- Or create an external table (you manage storage)
CREATE TABLE production.sales.legacy_revenue
USING PARQUET
LOCATION 's3://data-lake-prod/sales/revenue/';

-- Grant access
GRANT SELECT ON TABLE production.sales.revenue TO analyst_group;
GRANT USAGE ON SCHEMA production.sales TO analyst_group;
GRANT USAGE ON CATALOG production TO analyst_group;

-- Column-level masking
ALTER TABLE production.sales.customers
ALTER COLUMN email SET MASK mask_email;
-- Analysts see: j***@example.com instead of john@example.com</code></pre>

      <h2>Apache Polaris (Iceberg REST Catalog) — The Open Future</h2>

      <p>Apache Polaris (originally Snowflake's Polaris Catalog, donated to Apache in 2024) is the newest entrant. It's built specifically for <strong>Apache Iceberg</strong> tables and provides a vendor-neutral REST API. If you believe the future is open table formats (Iceberg), Polaris is worth watching closely.</p>

      <pre><code># Polaris uses a REST API instead of Thrift (like Hive)
# This makes it language-agnostic and cloud-agnostic

# Create a catalog via REST API
curl -X POST https://polaris.example.com/api/management/v1/catalogs \\
  -H "Content-Type: application/json" \\
  -d '{
    "catalog": {
      "name": "production",
      "type": "INTERNAL",
      "properties": {
        "default-base-location": "s3://data-lake/production/"
      },
      "storageConfigInfo": {
        "storageType": "S3",
        "allowedLocations": ["s3://data-lake/production/"]
      }
    }
  }'

# Spark connects to Polaris using Iceberg REST catalog:
spark.conf.set("spark.sql.catalog.polaris", "org.apache.iceberg.spark.SparkCatalog")
spark.conf.set("spark.sql.catalog.polaris.type", "rest")
spark.conf.set("spark.sql.catalog.polaris.uri", "https://polaris.example.com/api/catalog")
spark.conf.set("spark.sql.catalog.polaris.warehouse", "production")

# Then query normally:
spark.sql("SELECT * FROM polaris.sales.revenue WHERE year = 2025")</code></pre>

      <h2>The Big Comparison</h2>

      <!-- Comparison Table -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">Metastore Comparison: Hive vs Glue vs Unity Catalog vs Polaris</div>
        <div style="overflow-x:auto">
          <table style="width:100%;border-collapse:collapse;font-size:0.72rem;min-width:650px">
            <thead>
              <tr>
                <th style="text-align:left;padding:0.6rem;background:var(--muted);color:var(--foreground);border-radius:0.4rem 0 0 0">Feature</th>
                <th style="text-align:center;padding:0.6rem;background:#f97316;color:#fff">Hive Metastore</th>
                <th style="text-align:center;padding:0.6rem;background:#3b82f6;color:#fff">AWS Glue</th>
                <th style="text-align:center;padding:0.6rem;background:#ef4444;color:#fff">Unity Catalog</th>
                <th style="text-align:center;padding:0.6rem;background:#22c55e;color:#fff;border-radius:0 0.4rem 0 0">Polaris</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:var(--foreground);font-weight:600">Type</td><td style="padding:0.5rem;text-align:center">Open source</td><td style="padding:0.5rem;text-align:center">Managed (AWS)</td><td style="padding:0.5rem;text-align:center">Managed (Databricks)</td><td style="padding:0.5rem;text-align:center">Open source</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:var(--foreground);font-weight:600">Protocol</td><td style="padding:0.5rem;text-align:center">Thrift</td><td style="padding:0.5rem;text-align:center">Hive-compatible + AWS API</td><td style="padding:0.5rem;text-align:center">REST + Hive-compatible</td><td style="padding:0.5rem;text-align:center">REST (Iceberg spec)</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:var(--foreground);font-weight:600">Table formats</td><td style="padding:0.5rem;text-align:center">Hive tables</td><td style="padding:0.5rem;text-align:center">Hive + Iceberg</td><td style="padding:0.5rem;text-align:center">Delta Lake + Iceberg</td><td style="padding:0.5rem;text-align:center;color:#22c55e;font-weight:700">Iceberg (native)</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:var(--foreground);font-weight:600">Access control</td><td style="padding:0.5rem;text-align:center;color:#ef4444">None built-in</td><td style="padding:0.5rem;text-align:center">Lake Formation</td><td style="padding:0.5rem;text-align:center;color:#22c55e;font-weight:700">Built-in (column-level)</td><td style="padding:0.5rem;text-align:center">Pluggable</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:var(--foreground);font-weight:600">Data lineage</td><td style="padding:0.5rem;text-align:center;color:#ef4444">No</td><td style="padding:0.5rem;text-align:center;color:#ef4444">No</td><td style="padding:0.5rem;text-align:center;color:#22c55e;font-weight:700">Yes (automatic)</td><td style="padding:0.5rem;text-align:center;color:#ef4444">No</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:var(--foreground);font-weight:600">Multi-engine</td><td style="padding:0.5rem;text-align:center;color:#22c55e;font-weight:700">Everything speaks Hive</td><td style="padding:0.5rem;text-align:center">AWS services only</td><td style="padding:0.5rem;text-align:center">Databricks + Iceberg clients</td><td style="padding:0.5rem;text-align:center;color:#22c55e;font-weight:700">Any Iceberg client</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:var(--foreground);font-weight:600">Cloud</td><td style="padding:0.5rem;text-align:center;color:#22c55e;font-weight:700">Any / self-hosted</td><td style="padding:0.5rem;text-align:center">AWS only</td><td style="padding:0.5rem;text-align:center">AWS + Azure + GCP</td><td style="padding:0.5rem;text-align:center;color:#22c55e;font-weight:700">Any / self-hosted</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem;color:var(--foreground);font-weight:600">Ops overhead</td><td style="padding:0.5rem;text-align:center;color:#ef4444">High (self-manage)</td><td style="padding:0.5rem;text-align:center;color:#22c55e">Zero (managed)</td><td style="padding:0.5rem;text-align:center;color:#22c55e">Zero (managed)</td><td style="padding:0.5rem;text-align:center;color:#f97316">Medium (self-manage)</td></tr>
              <tr><td style="padding:0.5rem;color:var(--foreground);font-weight:600">Cost</td><td style="padding:0.5rem;text-align:center;color:#22c55e">Free (infra cost only)</td><td style="padding:0.5rem;text-align:center">Per-request pricing</td><td style="padding:0.5rem;text-align:center">Included with Databricks</td><td style="padding:0.5rem;text-align:center;color:#22c55e">Free (infra cost only)</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <h2>When to Use What</h2>

      <!-- Decision -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">Which Metastore Should You Choose?</div>
        <div class="dtree">
          <div class="dtree-node question">What's your environment?</div>
          <div class="dtree-branches">
            <div class="dtree-branch">
              <div class="dtree-label">All-in on AWS?</div>
              <div class="dtree-connector blue"></div>
              <div class="dtree-answer oidc">AWS Glue + Lake Formation<span class="dtree-answer-sub">Zero ops, deep integration</span></div>
            </div>
            <div class="dtree-branch">
              <div class="dtree-label">Using Databricks?</div>
              <div class="dtree-connector orange"></div>
              <div class="dtree-answer saml">Unity Catalog<span class="dtree-answer-sub">Best governance, lineage</span></div>
            </div>
            <div class="dtree-branch">
              <div class="dtree-label">Multi-cloud / open?</div>
              <div class="dtree-connector green"></div>
              <div class="dtree-answer both">Hive MS or Polaris<span class="dtree-answer-sub">No vendor lock-in</span></div>
            </div>
          </div>
        </div>
      </div>

      <h2>The Modern Lakehouse Architecture</h2>

      <p>The modern data stack has converged on a pattern called the <strong>lakehouse</strong>. Instead of separate data lakes and data warehouses, you have one storage layer (S3/ADLS/GCS) with a table format (Delta Lake, Iceberg, Hudi) that provides warehouse-like features (ACID transactions, schema enforcement, time travel) on top of a data lake. The metastore is the <strong>central nervous system</strong> of this architecture.</p>

      <!-- Lakehouse Architecture -->
      <div class="flow-diagram">
        <div class="flow-diagram-title">Modern Lakehouse Architecture</div>
        <div class="layer-diagram">
          <div class="layer-item" style="background:#ef4444">Consumers (BI Tools, ML Pipelines, Applications)<span class="layer-item-sub">Tableau, Power BI, MLflow, dbt, custom apps — all query through the metastore</span></div>
          <div class="layer-item" style="background:#f97316">Query Engines (Spark, Trino, Athena, Redshift Spectrum)<span class="layer-item-sub">SQL and distributed compute — connect to the metastore for table definitions</span></div>
          <div class="layer-item" style="background:#7c3aed">Metastore (Glue / Unity Catalog / Hive / Polaris)<span class="layer-item-sub">The catalogue — knows every table, column, partition, and who can access what</span></div>
          <div class="layer-item" style="background:#3b82f6">Table Format (Delta Lake / Apache Iceberg / Apache Hudi)<span class="layer-item-sub">ACID transactions, schema evolution, time travel, partition pruning — on files</span></div>
          <div class="layer-item" style="background:#22c55e">Object Storage (S3 / ADLS / GCS)<span class="layer-item-sub">The actual Parquet/ORC files live here. Cheap, durable, infinite scale.</span></div>
        </div>
      </div>

      <h2>Practical Tips from Production</h2>

      <ul>
        <li><strong>Partition wisely:</strong> Over-partitioning (one file per partition) kills query performance. Aim for partitions with 100 MB+ of data each. Common strategy: partition by date (year/month/day), not by user_id.</li>
        <li><strong>Use Iceberg or Delta Lake, not raw Parquet:</strong> Raw Parquet tables in Hive have no ACID, no schema evolution, no time travel. Iceberg and Delta Lake solve all of this. Migration is a one-time cost with massive long-term benefits.</li>
        <li><strong>Automate schema discovery:</strong> Use Glue Crawlers, or write Spark jobs that register new partitions automatically. Don't manually run ALTER TABLE ADD PARTITION for every new data drop.</li>
        <li><strong>Name things properly from day one:</strong> <code>production.sales.revenue</code> is much better than <code>db1.tbl_rev_v2_final_FINAL</code>. You'll thank yourself in 6 months.</li>
        <li><strong>Start with governance:</strong> Don't wait until you have 500 tables to add access control. Set it up from day one. It's 10x harder to retrofit than to build in from the start.</li>
        <li><strong>Monitor metastore health:</strong> Slow metastore = slow queries everywhere. Monitor Thrift API latency, backend DB connections, and catalogue API rate limits.</li>
      </ul>

      <p>Back to our story from the beginning. That analyst who couldn't find Q3 revenue data? With a metastore, the answer is one SQL query away: <code>SELECT * FROM production.sales.revenue WHERE quarter=3</code>. The metastore knows where the files are, what the columns are, and who's allowed to see them. No more hunting through S3 buckets. No more guessing column types. No more data swamp. Just a clean, governed, queryable lake.</p>
    `;
