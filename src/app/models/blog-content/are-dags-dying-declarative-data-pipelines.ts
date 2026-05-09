export const CONTENT = `
      <p><strong>Short answer:</strong> DAGs are not dying. But the way many teams use DAGs is changing fast.</p>

      <p>For years, a data pipeline meant drawing a directed acyclic graph: extract data, transform it, load it, run a report, notify someone if it failed. That model still matters. The shift is that modern data teams increasingly want to declare <strong>what data products should exist</strong>, what contracts they must satisfy, how fresh they need to be, and which downstream assets depend on them. The scheduler can then figure out more of the execution details.</p>

      <p>This is the rise of <strong>declarative data pipelines</strong>: pipelines defined around assets, contracts, freshness, lineage, and tests rather than only around ordered tasks. If you are new to data engineering, think of this as moving from &quot;run these 12 steps in this exact order&quot; to &quot;keep these trusted tables and metrics correct, fresh, and observable.&quot;</p>

      <aside class="callout callout-production">
        <strong>Main idea</strong>
        <p>A DAG is an execution graph. A declarative pipeline is a description of desired data state. The modern orchestrator still builds a graph, but the graph is derived from assets, dependencies, checks, and policies instead of being hand-written task by task.</p>
      </aside>

      <h2>What Is a DAG?</h2>

      <p>A <strong>DAG</strong> is a directed acyclic graph. The words sound academic, but the idea is simple:</p>

      <ul>
        <li><strong>Directed</strong>: each arrow has a direction. Task B runs after task A.</li>
        <li><strong>Acyclic</strong>: the graph cannot loop forever. A cannot depend on B if B also depends on A.</li>
        <li><strong>Graph</strong>: the pipeline is a set of nodes connected by arrows.</li>
      </ul>

      <p>In a traditional data pipeline, nodes are usually <strong>tasks</strong>: run a SQL query, call an API, copy files from S3, train a model, send a Slack message. The DAG says which tasks must finish before other tasks can start.</p>

      <div class="flow-diagram">
        <div class="flow-diagram-title">Traditional Task DAG: The Pipeline Is a Sequence of Jobs</div>
        <svg viewBox="0 0 800 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A traditional task DAG where extract tasks feed clean tasks, then load and dashboard tasks">
          <rect width="800" height="300" rx="12" fill="#0f172a"/>
          <text x="400" y="32" text-anchor="middle" fill="#cbd5e1" font-size="14" font-weight="800">TASK-FIRST DAG</text>
          <g fill="#1e293b" stroke-width="1.5">
            <rect x="54" y="82" width="130" height="54" rx="8" stroke="#38bdf8"/>
            <rect x="54" y="168" width="130" height="54" rx="8" stroke="#38bdf8"/>
            <rect x="250" y="82" width="130" height="54" rx="8" stroke="#f59e0b"/>
            <rect x="250" y="168" width="130" height="54" rx="8" stroke="#f59e0b"/>
            <rect x="448" y="125" width="130" height="54" rx="8" stroke="#22c55e"/>
            <rect x="636" y="125" width="130" height="54" rx="8" stroke="#a855f7"/>
          </g>
          <g font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="700" text-anchor="middle">
            <text x="119" y="112" fill="#bae6fd">extract orders</text>
            <text x="119" y="198" fill="#bae6fd">extract users</text>
            <text x="315" y="112" fill="#fde68a">clean orders</text>
            <text x="315" y="198" fill="#fde68a">clean users</text>
            <text x="513" y="155" fill="#bbf7d0">join tables</text>
            <text x="701" y="155" fill="#e9d5ff">build report</text>
          </g>
          <g stroke="#94a3b8" stroke-width="1.8" fill="none" marker-end="url(#taskArrow)">
            <path d="M184 109 L250 109"/>
            <path d="M184 195 L250 195"/>
            <path d="M380 109 C414 109 414 152 448 152"/>
            <path d="M380 195 C414 195 414 152 448 152"/>
            <path d="M578 152 L636 152"/>
          </g>
          <text x="400" y="258" text-anchor="middle" fill="#94a3b8" font-size="11">The graph tells the scheduler: run these jobs in this order.</text>
          <defs>
            <marker id="taskArrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
              <polygon points="0 0, 8 4, 0 8" fill="#94a3b8"/>
            </marker>
          </defs>
        </svg>
      </div>

      <p>This model made data pipelines understandable. Before DAG orchestrators, many teams had scripts triggered by cron, shell commands chained together, or jobs started manually by people. A DAG turned hidden operational order into a visible dependency graph.</p>

      <h2>Why DAGs Became the Default</h2>

      <p>Task DAGs became popular because they solve very real problems:</p>

      <ul>
        <li><strong>Ordering</strong>: run the warehouse load only after extraction finishes.</li>
        <li><strong>Parallelism</strong>: run independent tasks at the same time.</li>
        <li><strong>Retries</strong>: retry the failed task instead of the whole pipeline.</li>
        <li><strong>Visibility</strong>: see what ran, what failed, and where the pipeline is stuck.</li>
        <li><strong>Scheduling</strong>: run daily, hourly, or after another dataset arrives.</li>
      </ul>

      <p>Tools like Airflow made this mental model mainstream. A pipeline became code. Teams could review it, test it, deploy it, and operate it. That was a huge improvement over scattered scripts.</p>

      <pre><code># Simplified task-first pipeline
from airflow import DAG
from airflow.operators.python import PythonOperator

with DAG("daily_revenue") as dag:
    extract_orders = PythonOperator(task_id="extract_orders", python_callable=extract_orders)
    clean_orders = PythonOperator(task_id="clean_orders", python_callable=clean_orders)
    build_revenue = PythonOperator(task_id="build_revenue", python_callable=build_revenue)
    publish_dashboard = PythonOperator(task_id="publish_dashboard", python_callable=publish_dashboard)

    extract_orders &gt;&gt; clean_orders &gt;&gt; build_revenue &gt;&gt; publish_dashboard</code></pre>

      <p>This is easy to follow. But notice the center of gravity: the code describes <strong>how to run steps</strong>, not the deeper meaning of the data being produced.</p>

      <h2>So Why Are People Questioning DAGs?</h2>

      <p>Because task DAGs can become the wrong abstraction when the data platform grows.</p>

      <p>At small scale, a DAG with ten tasks is clear. At larger scale, teams may have thousands of tasks producing hundreds of tables, dashboards, features, and machine learning inputs. The important question stops being &quot;did task 47 run after task 46?&quot; and becomes:</p>

      <ul>
        <li>Which dashboards depend on this broken table?</li>
        <li>Is the <code>revenue_by_day</code> asset fresh enough for the morning business review?</li>
        <li>Which upstream schema change caused this model to fail?</li>
        <li>Can I rebuild only the assets affected by this change?</li>
        <li>Who owns this dataset, and what quality checks protect it?</li>
      </ul>

      <p>A task DAG can answer some of these questions, but often indirectly. You have to infer the data meaning from task names, scripts, conventions, and tribal knowledge. Declarative systems try to make that meaning explicit.</p>

      <h2>Declarative Data Pipelines Explained</h2>

      <p><strong>Declarative</strong> means you describe the desired outcome, not every mechanical step required to get there. SQL is the classic example. You write:</p>

      <pre><code>SELECT customer_id, SUM(amount) AS lifetime_value
FROM orders
GROUP BY customer_id;</code></pre>

      <p>You do not tell the database exactly which join algorithm, memory layout, or scan strategy to use. You describe the result. The engine decides the plan.</p>

      <p>A declarative data pipeline applies the same idea to data products. You define assets such as <code>raw_orders</code>, <code>clean_orders</code>, <code>daily_revenue</code>, and <code>executive_dashboard</code>. You define their dependencies, schemas, freshness expectations, tests, and owners. The platform derives a graph from those declarations.</p>

      <div class="flow-diagram">
        <div class="flow-diagram-title">Declarative Pipeline: The Graph Is Built Around Data Assets</div>
        <svg viewBox="0 0 800 420" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Declarative data pipeline where data assets, contracts, freshness policies, checks and lineage produce an executable graph">
          <rect width="800" height="420" rx="12" fill="#0f172a"/>
          <text x="400" y="34" text-anchor="middle" fill="#cbd5e1" font-size="14" font-weight="800">DECLARATIVE DATA PIPELINE</text>
          <text x="400" y="58" text-anchor="middle" fill="#94a3b8" font-size="10">Declare assets, dependencies, checks, owners, and freshness. The orchestrator derives execution.</text>

          <g font-family="system-ui, -apple-system, sans-serif">
            <rect x="56" y="105" width="138" height="58" rx="8" fill="#082f49" stroke="#38bdf8" stroke-width="1.5"/>
            <text x="125" y="129" text-anchor="middle" fill="#bae6fd" font-size="11" font-weight="800">raw_orders</text>
            <text x="125" y="148" text-anchor="middle" fill="#7dd3fc" font-size="9">source asset</text>

            <rect x="56" y="240" width="138" height="58" rx="8" fill="#082f49" stroke="#38bdf8" stroke-width="1.5"/>
            <text x="125" y="264" text-anchor="middle" fill="#bae6fd" font-size="11" font-weight="800">raw_customers</text>
            <text x="125" y="283" text-anchor="middle" fill="#7dd3fc" font-size="9">source asset</text>

            <rect x="282" y="105" width="150" height="58" rx="8" fill="#422006" stroke="#f59e0b" stroke-width="1.5"/>
            <text x="357" y="129" text-anchor="middle" fill="#fde68a" font-size="11" font-weight="800">clean_orders</text>
            <text x="357" y="148" text-anchor="middle" fill="#fbbf24" font-size="9">schema + tests</text>

            <rect x="282" y="240" width="150" height="58" rx="8" fill="#422006" stroke="#f59e0b" stroke-width="1.5"/>
            <text x="357" y="264" text-anchor="middle" fill="#fde68a" font-size="11" font-weight="800">customer_dim</text>
            <text x="357" y="283" text-anchor="middle" fill="#fbbf24" font-size="9">contracted table</text>

            <rect x="520" y="172" width="150" height="58" rx="8" fill="#052e16" stroke="#22c55e" stroke-width="1.5"/>
            <text x="595" y="196" text-anchor="middle" fill="#bbf7d0" font-size="11" font-weight="800">daily_revenue</text>
            <text x="595" y="215" text-anchor="middle" fill="#86efac" font-size="9">fresh by 8:00 AM</text>

            <rect x="520" y="304" width="150" height="58" rx="8" fill="#3b0764" stroke="#a855f7" stroke-width="1.5"/>
            <text x="595" y="328" text-anchor="middle" fill="#e9d5ff" font-size="11" font-weight="800">dashboard</text>
            <text x="595" y="347" text-anchor="middle" fill="#d8b4fe" font-size="9">downstream asset</text>

            <rect x="292" y="356" width="130" height="34" rx="17" fill="#1e293b" stroke="#64748b"/>
            <text x="357" y="377" text-anchor="middle" fill="#cbd5e1" font-size="10" font-weight="700">lineage + ownership</text>

            <rect x="60" y="22" width="120" height="32" rx="16" fill="#1e293b" stroke="#334155"/>
          </g>

          <g stroke="#94a3b8" stroke-width="1.8" fill="none" marker-end="url(#assetArrow)">
            <path d="M194 134 L282 134"/>
            <path d="M194 269 L282 269"/>
            <path d="M432 134 C470 134 482 201 520 201"/>
            <path d="M432 269 C470 269 482 201 520 201"/>
            <path d="M595 230 L595 304"/>
            <path d="M357 298 L357 356"/>
          </g>

          <g font-family="system-ui, -apple-system, sans-serif" font-size="10" fill="#94a3b8">
            <text x="236" y="122" text-anchor="middle">depends on</text>
            <text x="474" y="164" text-anchor="middle">materializes</text>
            <text x="634" y="269" text-anchor="middle">feeds</text>
          </g>

          <defs>
            <marker id="assetArrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
              <polygon points="0 0, 8 4, 0 8" fill="#94a3b8"/>
            </marker>
          </defs>
        </svg>
      </div>

      <h2>The Big Shift: From Tasks to Assets</h2>

      <p>The key phrase is <strong>asset graph</strong>. An asset is a durable data object that matters to the business or platform: a table, view, file, feature set, dashboard, metric, embedding index, or report.</p>

      <p>Task-first orchestration asks: <em>What jobs should run?</em></p>

      <p>Asset-first orchestration asks: <em>What data assets should exist, what do they depend on, and what makes them trustworthy?</em></p>

      <div class="flow-diagram">
        <div class="flow-diagram-title">Task DAG vs Asset Graph</div>
        <div class="vs-cards">
          <div class="vs-card" style="border-color:#f97316">
            <div class="vs-card-header" style="background:#f97316">Task-first DAG</div>
            <div class="vs-card-body">
              <div class="vs-row"><span class="vs-row-icon">1</span>Primary unit is a job or operator</div>
              <div class="vs-row"><span class="vs-row-icon">2</span>Dependencies are manually wired</div>
              <div class="vs-row"><span class="vs-row-icon">3</span>Data meaning lives in scripts and names</div>
              <div class="vs-row"><span class="vs-row-icon">4</span>Freshness and quality are extra tasks</div>
              <div class="vs-row"><span class="vs-row-icon">5</span>Best for procedural workflows</div>
            </div>
          </div>
          <div class="vs-badge">VS</div>
          <div class="vs-card" style="border-color:#22c55e">
            <div class="vs-card-header" style="background:#22c55e">Asset-first pipeline</div>
            <div class="vs-card-body">
              <div class="vs-row"><span class="vs-row-icon">1</span>Primary unit is a dataset or metric</div>
              <div class="vs-row"><span class="vs-row-icon">2</span>Dependencies come from declarations</div>
              <div class="vs-row"><span class="vs-row-icon">3</span>Data meaning is explicit metadata</div>
              <div class="vs-row"><span class="vs-row-icon">4</span>Freshness and quality are built-in policies</div>
              <div class="vs-row"><span class="vs-row-icon">5</span>Best for data products and analytics platforms</div>
            </div>
          </div>
        </div>
      </div>

      <p>This does not remove orchestration. It moves orchestration up one level. Instead of hand-wiring every task edge, you declare that <code>daily_revenue</code> depends on <code>clean_orders</code> and <code>customer_dim</code>. The system can infer what needs to run when one upstream asset changes or becomes stale.</p>

      <h2>A Beginner-Friendly Analogy</h2>

      <p>Imagine a restaurant kitchen.</p>

      <p>A task DAG is a checklist: chop onions, heat pan, cook sauce, boil pasta, plate dish, notify waiter. It is useful because it tells the staff the order of operations.</p>

      <p>A declarative pipeline is closer to the menu plus quality standards: the customer ordered pasta, the sauce must be hot, the dish must be ready within 15 minutes, ingredients must be fresh, and allergens must be labeled. The kitchen still performs steps, but the operating system is organized around the desired product and its constraints.</p>

      <p>Data platforms are going through a similar shift. The business cares less about whether <code>task_clean_orders_v2</code> ran at 03:14. It cares whether <code>daily_revenue</code> is correct, fresh, documented, and safe to use.</p>

      <h2>What Makes a Pipeline Declarative?</h2>

      <p>A declarative data pipeline usually includes several declarations:</p>

      <ul>
        <li><strong>Assets</strong>: named tables, views, files, metrics, dashboards, or ML features.</li>
        <li><strong>Dependencies</strong>: which upstream assets are required to build each asset.</li>
        <li><strong>Contracts</strong>: expected columns, types, nullability, primary keys, and ownership.</li>
        <li><strong>Freshness policies</strong>: how current the asset must be, such as &quot;updated every hour&quot; or &quot;ready by 8:00 AM.&quot;</li>
        <li><strong>Quality checks</strong>: uniqueness, referential integrity, accepted values, row count ranges, and anomaly checks.</li>
        <li><strong>Materialization rules</strong>: whether the asset is a table, view, incremental model, partitioned table, or file output.</li>
        <li><strong>Lineage</strong>: how data flows from sources to downstream consumers.</li>
      </ul>

      <pre><code># Simplified asset-first style
asset: daily_revenue
description: Daily revenue by calendar day
owner: data-platform@company.com
depends_on:
  - clean_orders
  - customer_dim
freshness:
  maximum_lag: 2 hours
checks:
  - revenue_total_is_non_negative
  - order_id_is_unique
  - no_missing_calendar_days
materialization:
  type: incremental_table
  partition_by: order_date</code></pre>

      <p>The exact syntax depends on the tool. The important part is the shape: you are making the data asset understandable to both humans and machines.</p>

      <h2>Where dbt, Dagster, Airflow, and Prefect Fit</h2>

      <p>The ecosystem is not one clean category. Most tools can be used in multiple ways, and many teams combine them.</p>

      <div class="flow-diagram">
        <div class="flow-diagram-title">Pipeline Tooling Spectrum</div>
        <div style="overflow-x:auto">
          <table style="width:100%;border-collapse:collapse;font-size:0.76rem;min-width:620px">
            <thead>
              <tr>
                <th style="text-align:left;padding:0.65rem;background:var(--muted);color:var(--foreground);border-radius:0.4rem 0 0 0">Tool / pattern</th>
                <th style="text-align:left;padding:0.65rem;background:#3b82f6;color:#fff">Core abstraction</th>
                <th style="text-align:left;padding:0.65rem;background:#22c55e;color:#fff">Strong at</th>
                <th style="text-align:left;padding:0.65rem;background:#f97316;color:#fff;border-radius:0 0.4rem 0 0">Watch out for</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.55rem;font-weight:700;color:var(--foreground)">Airflow-style DAGs</td><td style="padding:0.55rem;color:var(--foreground)">Tasks and operators</td><td style="padding:0.55rem;color:var(--foreground)">Procedural workflows, broad integrations, mature scheduling</td><td style="padding:0.55rem;color:var(--foreground)">Asset meaning can be implicit unless you add conventions</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.55rem;font-weight:700;color:var(--foreground)">dbt models</td><td style="padding:0.55rem;color:var(--foreground)">SQL models and refs</td><td style="padding:0.55rem;color:var(--foreground)">Analytics transformations, tests, docs, lineage</td><td style="padding:0.55rem;color:var(--foreground)">Not a general-purpose orchestrator by itself</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.55rem;font-weight:700;color:var(--foreground)">Dagster assets</td><td style="padding:0.55rem;color:var(--foreground)">Software-defined assets</td><td style="padding:0.55rem;color:var(--foreground)">Asset graph, lineage, materialization, checks</td><td style="padding:0.55rem;color:var(--foreground)">Requires modeling your domain as assets, not only jobs</td></tr>
              <tr style="border-bottom:1px solid var(--border)"><td style="padding:0.55rem;font-weight:700;color:var(--foreground)">Prefect-style flows</td><td style="padding:0.55rem;color:var(--foreground)">Python flows and tasks</td><td style="padding:0.55rem;color:var(--foreground)">Pythonic orchestration and dynamic workflows</td><td style="padding:0.55rem;color:var(--foreground)">Asset contracts need intentional design</td></tr>
              <tr><td style="padding:0.55rem;font-weight:700;color:var(--foreground)">Data contracts</td><td style="padding:0.55rem;color:var(--foreground)">Schema and producer-consumer agreements</td><td style="padding:0.55rem;color:var(--foreground)">Preventing breaking changes before they hit consumers</td><td style="padding:0.55rem;color:var(--foreground)">Only useful if enforced in CI, ingestion, or runtime checks</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <p>A practical modern stack might use dbt for SQL transformations, Dagster for asset orchestration, Great Expectations or native checks for data quality, a catalog for discovery, and object storage or a warehouse as the compute layer. Another team might keep Airflow and add asset metadata, OpenLineage, dbt, and stronger contracts. The goal is not to chase a tool. The goal is to make data intent explicit.</p>

      <h2>The Problem With Giant Task DAGs</h2>

      <p>Task DAGs fail when they become giant maps of implementation detail. Common symptoms:</p>

      <ul>
        <li><strong>Task names hide business meaning</strong>: <code>run_sql_step_17</code> tells you almost nothing about the table it updates.</li>
        <li><strong>Retries are too mechanical</strong>: a task succeeded, but the table it produced has duplicate keys or stale partitions.</li>
        <li><strong>Backfills are scary</strong>: rerunning old dates requires custom parameters and manual dependency reasoning.</li>
        <li><strong>Ownership is unclear</strong>: nobody knows who owns a downstream dashboard until it breaks.</li>
        <li><strong>Lineage is incomplete</strong>: the orchestrator knows tasks, but the catalog needs datasets.</li>
      </ul>

      <p>The pain is not that DAGs exist. The pain is that a task DAG can become a pile of operational instructions without enough semantic information about the data.</p>

      <h2>What Declarative Pipelines Improve</h2>

      <p>Declarative data pipelines improve five things that matter in production.</p>

      <h3>1. Lineage Becomes Useful</h3>
      <p>If the platform knows that <code>executive_dashboard</code> depends on <code>daily_revenue</code>, which depends on <code>clean_orders</code>, which depends on <code>raw_orders</code>, then impact analysis becomes realistic. Before changing <code>raw_orders.amount</code>, you can see the downstream blast radius.</p>

      <h3>2. Freshness Is a First-Class Concept</h3>
      <p>A task can be green while the data is stale. A declarative pipeline can say that <code>daily_revenue</code> must be materialized by 8:00 AM or must not lag source data by more than two hours. That is closer to what users actually care about.</p>

      <h3>3. Quality Checks Move Closer to the Data</h3>
      <p>Instead of treating tests as a final task, checks attach to the asset itself. The table is not just &quot;built.&quot; It is built, checked, documented, and marked trustworthy or unhealthy.</p>

      <h3>4. Backfills Become More Targeted</h3>
      <p>If an upstream asset changed for March 2026, the platform can determine which partitions or downstream assets need rebuilding. You still need care, but the graph has more information to work with.</p>

      <h3>5. Teams Get a Shared Vocabulary</h3>
      <p>Engineers, analysts, platform teams, and business users can talk about assets and contracts. That is easier than talking only about Python operators, shell commands, and job IDs.</p>

      <h2>The Architecture of a Declarative Pipeline</h2>

      <p>A mature declarative data platform usually has these layers:</p>

      <div class="flow-diagram">
        <div class="flow-diagram-title">Declarative Data Pipeline Architecture</div>
        <div class="layer-diagram">
          <div class="layer-item" style="background:#7c3aed">Business-facing data products<span class="layer-item-sub">Dashboards, metrics, ML features, exports, reverse ETL targets</span></div>
          <div class="layer-item" style="background:#22c55e">Asset graph and policies<span class="layer-item-sub">Dependencies, freshness, owners, checks, contracts, lineage</span></div>
          <div class="layer-item" style="background:#3b82f6">Transformation layer<span class="layer-item-sub">SQL models, Python assets, Spark jobs, streaming transforms</span></div>
          <div class="layer-item" style="background:#f97316">Ingestion and storage<span class="layer-item-sub">Sources, CDC, object storage, warehouse tables, lakehouse tables</span></div>
          <div class="layer-item" style="background:#64748b">Execution infrastructure<span class="layer-item-sub">Orchestrator, workers, Kubernetes, warehouse compute, alerting</span></div>
        </div>
      </div>

      <p>The task runner still exists at the bottom. Declarative does not mean magic. Someone still has to execute SQL, move data, allocate workers, and retry failures. The difference is that those mechanics are guided by a higher-level model of data assets.</p>

      <h2>Are DAGs Actually Dying?</h2>

      <p>No. The graph is not going away. Dependencies still form a DAG in most batch data systems. You cannot build <code>daily_revenue</code> before you have clean orders. You cannot update a dashboard before the table behind it is ready.</p>

      <p>What is fading is the idea that humans should hand-author every edge in a task graph and treat that graph as the main source of truth. The DAG is becoming more of a compiled artifact: something the platform derives from assets, code references, SQL refs, contracts, and metadata.</p>

      <aside class="callout callout-mistake">
        <strong>Common mistake</strong>
        <p>Thinking declarative pipelines remove orchestration. They do not. They change what you orchestrate around. You still need scheduling, retries, workers, state, and observability. You just organize those concerns around data assets instead of only tasks.</p>
      </aside>

      <h2>When Task DAGs Still Win</h2>

      <p>Declarative pipelines are not always the better tool. Task DAGs still make sense when the workflow is truly procedural:</p>

      <ul>
        <li>Provision an environment, run a migration, smoke test it, then tear it down.</li>
        <li>Call several APIs in a strict order where each call has side effects.</li>
        <li>Coordinate human approval steps, notifications, and deployment gates.</li>
        <li>Run a one-off operational workflow where the output is not a reusable data asset.</li>
        <li>Glue together systems that do not expose meaningful dataset metadata.</li>
      </ul>

      <p>In those cases, a task graph is honest. The business object is the workflow itself, not a durable table or metric.</p>

      <h2>When Declarative Pipelines Win</h2>

      <p>Declarative pipelines shine when the durable thing is data:</p>

      <ul>
        <li>Analytics engineering with many warehouse models and downstream dashboards.</li>
        <li>Lakehouse pipelines with partitioned tables, incremental refresh, and backfills.</li>
        <li>Machine learning feature pipelines where training and serving depend on trusted features.</li>
        <li>Data products with owners, contracts, service-level expectations, and consumers.</li>
        <li>Platforms where impact analysis and lineage matter as much as scheduling.</li>
      </ul>

      <p>If your users ask &quot;can I trust this table?&quot; more often than &quot;did this Python function run?&quot;, you probably need more declarative asset modeling.</p>

      <h2>A Practical Migration Path</h2>

      <p>You do not need to rewrite your platform to benefit from declarative thinking. A safe migration looks like this:</p>

      <ol>
        <li><strong>Inventory your data assets</strong>: list the tables, views, reports, files, and metrics people actually use.</li>
        <li><strong>Add ownership</strong>: every important asset needs a team, channel, and escalation path.</li>
        <li><strong>Document dependencies</strong>: map upstream and downstream relationships. Start with the critical dashboards and revenue tables.</li>
        <li><strong>Add contracts</strong>: define column types, nullability, primary keys, accepted values, and compatibility rules.</li>
        <li><strong>Attach quality checks</strong>: uniqueness, freshness, row count, referential integrity, and anomaly checks.</li>
        <li><strong>Make freshness visible</strong>: alert when important assets miss their expected update time.</li>
        <li><strong>Refactor orchestration last</strong>: once the asset model is clear, decide whether to keep your existing orchestrator or move to an asset-first one.</li>
      </ol>

      <p>This order matters. Moving tools before modeling assets often just gives you the same mess in a new UI.</p>

      <h2>Decision Framework</h2>

      <div class="flow-diagram">
        <div class="flow-diagram-title">Should You Stay Task-First or Move Asset-First?</div>
        <div class="dtree">
          <div class="dtree-node question">What is the main thing you operate?</div>
          <div class="dtree-branches">
            <div class="dtree-branch">
              <div class="dtree-label">Ordered side effects?</div>
              <div class="dtree-connector orange"></div>
              <div class="dtree-answer saml">Task DAG<span class="dtree-answer-sub">Workflow is the product</span></div>
            </div>
            <div class="dtree-branch">
              <div class="dtree-label">Reusable data assets?</div>
              <div class="dtree-connector green"></div>
              <div class="dtree-answer both">Asset graph<span class="dtree-answer-sub">Data is the product</span></div>
            </div>
            <div class="dtree-branch">
              <div class="dtree-label">Both?</div>
              <div class="dtree-connector blue"></div>
              <div class="dtree-answer oidc">Hybrid<span class="dtree-answer-sub">Tasks around assets</span></div>
            </div>
          </div>
        </div>
      </div>

      <p>Most real platforms end up hybrid. They use declarative assets for core data products and task DAGs for operational glue around ingestion, external APIs, deployments, and notifications.</p>

      <h2>What Beginners Should Learn First</h2>

      <p>If you are starting in data engineering, do not skip DAGs. Learn them. They teach dependency thinking, retries, idempotency, backfills, scheduling, and failure handling. Those concepts remain essential.</p>

      <p>Then learn the declarative layer:</p>

      <ul>
        <li>How SQL model dependencies work with refs.</li>
        <li>How data tests protect consumers.</li>
        <li>How freshness differs from task success.</li>
        <li>How lineage helps impact analysis.</li>
        <li>How contracts prevent producers from breaking consumers.</li>
        <li>How partitioned backfills avoid rerunning everything.</li>
      </ul>

      <p>A strong data engineer can reason at both levels: the low-level execution graph and the high-level asset graph.</p>

      <h2>SEO-Friendly Summary</h2>

      <p>So, are DAGs dying? No. DAGs are evolving. Traditional DAG orchestration is still useful for task ordering, retries, and procedural workflows. But modern data engineering is moving toward <strong>declarative data pipelines</strong>, <strong>asset graphs</strong>, <strong>data contracts</strong>, and <strong>freshness policies</strong> because teams need to operate data products, not just jobs.</p>

      <p>The best mental model is this: <strong>task DAGs tell the system how to run work; declarative pipelines tell the system what data should be true.</strong> The future is not DAG-free. It is DAGs generated from richer declarations.</p>

      <h2>Frequently Asked Questions</h2>

      <h3>Are DAGs becoming obsolete?</h3>
      <p>No. Dependency graphs remain fundamental. What is changing is that more graphs are derived from assets, SQL refs, contracts, and metadata instead of being manually written as task chains.</p>

      <h3>What is a declarative data pipeline?</h3>
      <p>A declarative data pipeline describes desired data assets, dependencies, schemas, freshness expectations, checks, and ownership. The execution engine decides what work must run to keep those assets correct and fresh.</p>

      <h3>Is Airflow still useful?</h3>
      <p>Yes. Airflow remains useful for procedural workflows, broad integrations, and mature scheduling. Teams that use Airflow can still adopt declarative practices by adding dbt models, lineage, data contracts, asset naming, and freshness checks.</p>

      <h3>What is an asset graph?</h3>
      <p>An asset graph maps durable data objects such as tables, metrics, files, dashboards, or ML features and the dependencies between them. It is usually more meaningful to data consumers than a graph of implementation tasks.</p>

      <h3>Should beginners learn Airflow, dbt, or Dagster first?</h3>
      <p>Learn the concepts first: DAGs, idempotency, retries, partitions, SQL models, tests, and lineage. Then pick tools based on your target role. Analytics engineers should learn SQL and dbt early. Platform-oriented data engineers should understand Airflow-style orchestration and asset-first tools such as Dagster.</p>

      <h2>Where to Go Next</h2>

      <ul>
        <li>Read the <a href="/blog/scheduling-systems-production-guide" class="text-primary underline">Scheduling Systems guide</a> to understand the execution layer under orchestrators.</li>
        <li>Read the <a href="/blog/delta-lake-iceberg-s3-tables-beginner-guide" class="text-primary underline">Delta Lake, Iceberg, and S3 Tables guide</a> to understand the storage layer behind modern pipelines.</li>
        <li>Read the <a href="/blog/observability-opentelemetry-logs-metrics-traces" class="text-primary underline">Observability guide</a> to connect pipeline health with logs, metrics, and traces.</li>
      </ul>
    `;
