import type { Course, CourseModule } from '../course.model';
import { ANALYTICS_WORKED_EXAMPLES } from './analytics-worked-examples';

interface AnalyticsModuleSeed {
  number: number;
  title: string;
  slug: string;
  subtitle: string;
  duration: string;
  diagramSteps: string[];
  objectives: string[];
  concept: string;
  beginnerBridge: string;
  practicePrompt: string;
  answer: string;
  labTitle: string;
  labObjective: string;
  labSteps: string[];
  keyTakeaways: string[];
  productionNotes: string[];
  commonMistakes: string[];
  glossary: { term: string; definition: string }[];
}

function analyticsDiagram(title: string, steps: string[]): string {
  const cardWidth = 150;
  const gap = 18;
  const startX = 40;
  const cards = steps.map((step, index) => {
    const x = startX + index * (cardWidth + gap);
    const arrow = index < steps.length - 1
      ? `<line x1="${x + cardWidth}" y1="145" x2="${x + cardWidth + gap - 4}" y2="145" stroke="#38bdf8" stroke-width="2" marker-end="url(#arrow)"/>`
      : '';
    return `
      <rect x="${x}" y="92" width="${cardWidth}" height="106" rx="10" fill="#0f172a" stroke="#334155" stroke-width="1.5"/>
      <text x="${x + cardWidth / 2}" y="122" text-anchor="middle" fill="#7dd3fc" font-size="12" font-weight="700">${step}</text>
      <text x="${x + cardWidth / 2}" y="150" text-anchor="middle" fill="#cbd5e1" font-size="10">step ${index + 1}</text>
      ${arrow}
    `;
  }).join('');

  return `
    <svg viewBox="0 0 880 290" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${title} diagram">
      <rect width="880" height="290" fill="#020617" rx="18"/>
      <text x="440" y="42" text-anchor="middle" fill="#f8fafc" font-size="19" font-weight="800">${title}</text>
      <text x="440" y="66" text-anchor="middle" fill="#94a3b8" font-size="12">Follow the arrows. Each box is one idea you will practice in this module.</text>
      ${cards}
      <text x="440" y="245" text-anchor="middle" fill="#a7f3d0" font-size="12">Production analytics engineering turns raw records into governed, trusted business meaning.</text>
      <defs>
        <marker id="arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <polygon points="0 0, 8 4, 0 8" fill="#38bdf8"/>
        </marker>
      </defs>
    </svg>
  `;
}

function analyticsContent(seed: AnalyticsModuleSeed): string {
  const example = ANALYTICS_WORKED_EXAMPLES[seed.slug];
  if (!example) throw new Error(`Missing analytics worked example: ${seed.slug}`);
  const dataset = seed.number === 1
    ? `<h2 id="course-dataset">Course Dataset</h2>
      <p>The course uses a small ecommerce model. Individual worked examples provide their own rows and state any narrower assumptions.</p>
      <table>
        <thead><tr><th>Table</th><th>Grain</th><th>Example columns</th></tr></thead>
        <tbody>
          <tr><td><code>raw_orders</code></td><td>one row per order in the lesson fixtures; deduplicate source events before using this grain</td><td><code>order_id</code>, <code>customer_id</code>, <code>amount</code>, <code>status</code>, <code>created_at</code></td></tr>
          <tr><td><code>raw_order_items</code></td><td>one row per item inside an order</td><td><code>order_id</code>, <code>product_id</code>, <code>quantity</code>, <code>item_price</code></td></tr>
          <tr><td><code>raw_customers</code></td><td>one row per current customer</td><td><code>customer_id</code>, <code>email</code>, <code>country</code>, <code>created_at</code></td></tr>
        </tbody>
      </table>`
    : '<p>Dataset reference: <a href="/courses/production-analytics-engineering-dbt/what-is-analytics-engineering#course-dataset">ecommerce tables and grain assumptions</a>.</p>';

  return `
    <h2>The Mental Model</h2>
    <p>${seed.concept}</p>
    <p>${seed.beginnerBridge}</p>
    ${dataset}
    <h2>${example.title}</h2>
    ${example.html}
    <h2>Interactive Check</h2>
    <p><strong>Question:</strong> ${seed.practicePrompt}</p>
    <details>
      <summary>Reveal the answer</summary>
      <p>${seed.answer}</p>
    </details>
    <h2>Practice: ${seed.labTitle}</h2>
    <p>${seed.labObjective}</p>
    <p>Use the guided lab below to record your result, assumptions, and the check that would catch an incorrect result.</p>
  `;
}

function analyticsModule(seed: AnalyticsModuleSeed): CourseModule {
  return {
    dateModified: '2026-09-14',
    number: seed.number,
    title: seed.title,
    slug: seed.slug,
    subtitle: seed.subtitle,
    duration: seed.duration,
    objectives: seed.objectives,
    content: analyticsContent(seed),
    svgDiagram: analyticsDiagram(seed.title, seed.diagramSteps),
    labs: [
      {
        title: seed.labTitle,
        objective: seed.labObjective,
        steps: seed.labSteps,
        duration: '30-45 minutes',
        difficulty: seed.number <= 4 ? 'Beginner' : seed.number <= 12 ? 'Beginner to Intermediate' : 'Intermediate',
        expectedOutput: 'A short answer, SQL/YAML snippet, or lineage map that can live directly in the course page notes.',
      },
    ],
    keyTakeaways: seed.keyTakeaways,
    productionNotes: seed.productionNotes,
    commonMistakes: seed.commonMistakes,
    thinkLikeAnEngineer: seed.number === 1 ? [
      'Can you explain the grain of this model in one sentence?',
      'What breaks downstream if this field becomes null tomorrow?',
      'Where should this logic live so it is reused instead of copied?',
    ] : undefined,
    realWorldUseCases: seed.number === 1 ? [
      'Reliable executive dashboards that do not disagree across teams',
      'AI analytics agents that query governed metrics instead of guessing SQL',
      'Auditable metric changes where owners can see downstream impact before merge',
    ] : undefined,
    careerRelevance: seed.number === 1 ? 'Analytics engineering is the bridge between SQL skill and production data ownership. Freshers who learn tests, lineage, metrics, and semantic modeling early stand out because they can reason about trust, not just queries.' : undefined,
    glossary: seed.glossary,
  };
}

const ANALYTICS_ENGINEERING_MODULES: CourseModule[] = [
  analyticsModule({
    number: 1,
    title: 'What Analytics Engineering Actually Is',
    slug: 'what-is-analytics-engineering',
    subtitle: 'Understand the job: turn raw tables into trusted business meaning.',
    duration: '75 minutes',
    diagramSteps: ['Raw data', 'Models', 'Tests', 'Metrics', 'Decisions'],
    objectives: ['Explain analytics engineering in beginner-friendly language', 'Separate data engineering, analytics engineering, and BI work', 'Understand why trust matters more than query cleverness'],
    concept: 'Analytics engineering sits between raw data movement and business decision-making. The work is to make data clean, tested, documented, reusable, and understandable.',
    beginnerBridge: 'If data engineering brings boxes into a warehouse, analytics engineering labels the boxes, checks what is inside, creates shelves, and writes the map everyone else uses.',
    practicePrompt: 'A dashboard says revenue is $10,000, but another dashboard says $9,200. Is this mainly a charting problem or a modeling/metric definition problem?',
    answer: 'It is usually a modeling or metric definition problem. Two dashboards probably use different filters, grains, joins, or revenue definitions. The fix is a governed metric, not another chart.',
    labTitle: 'Classify the Analytics Stack',
    labObjective: 'Place raw tables, staging models, marts, metrics, semantic layer, dashboards, and AI tools in the correct order.',
    labSteps: ['Read the seven components listed in the lesson', 'Draw them as a left-to-right flow', 'Mark which components are owned by analytics engineers', 'Write one sentence describing why each layer exists'],
    keyTakeaways: ['Analytics engineering creates trusted business-ready data', 'The core output is not a dashboard; it is reusable meaning', 'dbt is one tool in a broader production data workflow'],
    productionNotes: ['Define ownership for every model early. Orphaned data models become silent liabilities.'],
    commonMistakes: ['Thinking analytics engineering is only dashboard work', 'Skipping documentation because the SQL seems obvious', 'Letting every dashboard redefine core metrics'],
    glossary: [{ term: 'Analytics engineering', definition: 'The practice of building tested, documented, business-ready data models and metrics.' }, { term: 'Metric', definition: 'A governed business measurement such as revenue, active users, or conversion rate.' }],
  }),
  analyticsModule({
    number: 2,
    title: 'Tables, Grain, and Why Dashboards Lie',
    slug: 'tables-grain-dashboard-lies',
    subtitle: 'Learn the most important beginner concept: one row per what?',
    duration: '90 minutes',
    diagramSteps: ['Table', 'Grain', 'Join', 'Aggregate', 'Check'],
    objectives: ['Define table grain accurately', 'Spot double-counting bugs before they reach dashboards', 'Understand facts, dimensions, and event tables'],
    concept: 'Grain means what one row represents. Most bad metrics come from joining tables with different grains and then aggregating without noticing the duplication.',
    beginnerBridge: 'Before writing any SQL, ask: one row per what? If you cannot answer, you are not ready to aggregate.',
    practicePrompt: 'You join orders to order_items and then sum order amount. Why might revenue become too high?',
    answer: 'Each order can have many items. The order amount repeats once per item after the join, so summing it counts the same order multiple times.',
    labTitle: 'Find the Grain',
    labObjective: 'Identify the grain of five sample tables and decide whether each can be safely joined before aggregation.',
    labSteps: ['Label raw_orders as one row per order', 'Label raw_order_items as one row per order item', 'Label raw_customers as one row per customer', 'Explain why orders to order_items is one-to-many', 'Write the safe aggregation rule'],
    keyTakeaways: ['Always state grain before aggregating', 'One-to-many joins are the main source of dashboard lies', 'Facts and dimensions are useful because they make grain explicit'],
    productionNotes: ['Add model descriptions that start with grain: "One row per..." This prevents many review mistakes.'],
    commonMistakes: ['Summing order-level values after item-level joins', 'Assuming unique IDs without testing them', 'Mixing event time and reporting time without naming the difference'],
    glossary: [{ term: 'Grain', definition: 'The real-world entity or event represented by one row.' }, { term: 'Fact table', definition: 'A table containing measurable business events such as orders or payments.' }],
  }),
  analyticsModule({
    number: 3,
    title: 'The dbt Mental Model',
    slug: 'dbt-mental-model',
    subtitle: 'Understand sources, refs, models, DAGs, and materializations without setup friction.',
    duration: '90 minutes',
    diagramSteps: ['Source', 'ref()', 'Model', 'DAG', 'Build'],
    objectives: ['Explain how dbt compiles SQL models', 'Read a dbt DAG as a dependency graph', 'Know when a model should be a view, table, or incremental model'],
    concept: 'dbt lets analytics engineers build data transformations as version-controlled SQL files. The dependency graph comes from source declarations and ref calls.',
    beginnerBridge: 'Think of each dbt model as a recipe. ref() means "use the output of another recipe." dbt reads the recipes and decides the safe build order.',
    practicePrompt: 'If fct_orders uses ref("stg_orders"), which model must build first?',
    answer: 'stg_orders must build first. The ref call creates a dependency edge from fct_orders back to stg_orders.',
    labTitle: 'Order the dbt DAG',
    labObjective: 'Put shuffled dbt models into the correct build order.',
    labSteps: ['Start with sources', 'Place staging models next', 'Place intermediate joins after staging', 'Place marts last', 'Explain why dashboards should read marts, not raw sources'],
    keyTakeaways: ['dbt is SQL plus dependency management, tests, docs, and deployment discipline', 'ref() creates maintainable dependencies', 'The DAG is your first lineage map'],
    productionNotes: ['Review DAG shape in pull requests. A messy graph usually predicts ownership and debugging pain.'],
    commonMistakes: ['Using raw tables directly in marts', 'Hardcoding schema names instead of using ref/source', 'Creating circular model dependencies'],
    glossary: [{ term: 'DAG', definition: 'Directed acyclic graph; a dependency graph with no circular dependencies.' }, { term: 'Materialization', definition: 'How dbt stores a model, such as view, table, or incremental table.' }],
  }),
  analyticsModule({
    number: 4,
    title: 'Staging Models',
    slug: 'staging-models',
    subtitle: 'Clean source data gently: rename, cast, standardize, and expose a stable base layer.',
    duration: '100 minutes',
    diagramSteps: ['Raw', 'Rename', 'Cast', 'Clean', 'Stage'],
    objectives: ['Build staging models that stay close to the source', 'Apply safe renaming and type casting', 'Avoid burying business logic too early'],
    concept: 'Staging models are the clean mirror of raw sources. They should make data easier to use without making heavy business decisions.',
    beginnerBridge: 'A staging model is like rewriting messy notes into clean handwriting. You are not changing the story yet; you are making it readable.',
    practicePrompt: 'Should a staging model calculate lifetime customer value?',
    answer: 'No. That is business logic across many events and belongs later. Staging should focus on source cleanup: names, types, null handling, and basic standardization.',
    labTitle: 'Fix stg_orders',
    labObjective: 'Turn a messy raw_orders table into a clean staging model.',
    labSteps: ['Rename id to order_id', 'Cast created_at to a timestamp', 'Standardize status values to lowercase', 'Keep source-level fields only', 'Write the model grain in one sentence'],
    keyTakeaways: ['Staging models are stable cleaned source interfaces', 'Keep business logic out of staging unless it is source-specific cleanup', 'Good staging makes every downstream model simpler'],
    productionNotes: ['Use one staging model per source table. It gives every raw table one official cleaned interface.'],
    commonMistakes: ['Joining multiple sources in staging', 'Adding metrics to staging models', 'Leaving cryptic source column names unchanged'],
    glossary: [{ term: 'Staging model', definition: 'A dbt model that cleans and standardizes one raw source table.' }, { term: 'Source', definition: 'An upstream table that dbt reads but does not create.' }],
  }),
  analyticsModule({
    number: 5,
    title: 'Intermediate Models',
    slug: 'intermediate-models',
    subtitle: 'Build reusable transformation steps without exposing half-finished business tables.',
    duration: '95 minutes',
    diagramSteps: ['Stage', 'Join', 'Derive', 'Reuse', 'Mart'],
    objectives: ['Know when to create an intermediate model', 'Separate reusable logic from final reporting shape', 'Reduce duplication across marts'],
    concept: 'Intermediate models hold reusable transformation logic that is too complex for staging but not final enough for business users.',
    beginnerBridge: 'Intermediate models are the prep bowls in a kitchen. They are useful while cooking, but you do not serve them as the final dish.',
    practicePrompt: 'Two marts need the same order refund calculation. Should both copy the SQL?',
    answer: 'No. Put the shared refund logic in an intermediate model, then let both marts ref it.',
    labTitle: 'Extract Shared Logic',
    labObjective: 'Move repeated refund and order status logic into one intermediate model.',
    labSteps: ['Find duplicated CASE expressions', 'Create int_order_status_enriched', 'Point downstream marts to the intermediate model', 'Explain what duplication disappeared'],
    keyTakeaways: ['Intermediate models reduce repeated business logic', 'They should usually not be consumed directly by BI users', 'Good naming makes hidden transformation steps easier to debug'],
    productionNotes: ['Intermediate models are useful, but too many create a maze. Each one should remove real duplication or clarify complex logic.'],
    commonMistakes: ['Creating intermediate models for every tiny SELECT', 'Letting BI tools query intermediate models directly', 'Hiding important business definitions without documentation'],
    glossary: [{ term: 'Intermediate model', definition: 'A model that captures reusable logic between staging and final marts.' }, { term: 'DRY', definition: 'Do not repeat yourself; centralize shared logic once.' }],
  }),
  analyticsModule({
    number: 6,
    title: 'Marts: Facts and Dimensions',
    slug: 'marts-facts-dimensions',
    subtitle: 'Create the business-facing layer: facts, dimensions, and star schemas.',
    duration: '110 minutes',
    diagramSteps: ['Facts', 'Dimensions', 'Keys', 'Schema', 'Users'],
    objectives: ['Design simple fact and dimension tables', 'Understand star schema basics', 'Choose the right mart grain for reporting'],
    concept: 'Marts are the tables business users and dashboards should trust. Facts store measurable events; dimensions store descriptive context.',
    beginnerBridge: 'If staging is clean ingredients and intermediate is prep work, marts are the served plates. This is the layer people actually consume.',
    practicePrompt: 'Should customer country live in fct_orders or dim_customers?',
    answer: 'Usually dim_customers owns customer country. fct_orders can join to it for analysis, but the descriptive customer attributes belong in the customer dimension.',
    labTitle: 'Design an Ecommerce Mart',
    labObjective: 'Create a simple star schema with fct_orders, dim_customers, and dim_products.',
    labSteps: ['List each table grain', 'Choose primary keys', 'Choose foreign keys', 'Choose three measures on fct_orders', 'Choose five descriptive columns for dimensions'],
    keyTakeaways: ['Marts should be easy and safe for downstream consumers', 'Facts and dimensions make reporting grain explicit', 'Star schemas remain useful even in modern warehouses'],
    productionNotes: ['Name marts based on business concepts, not source systems. Business users do not care which app emitted the raw table.'],
    commonMistakes: ['Creating one giant flat table for every question', 'Putting measures in dimensions', 'Ignoring slowly changing attributes'],
    glossary: [{ term: 'Mart', definition: 'A business-facing model intended for analytics consumption.' }, { term: 'Dimension', definition: 'A descriptive table such as customers, products, or accounts.' }],
  }),
  analyticsModule({
    number: 7,
    title: 'Testing and Data Quality',
    slug: 'testing-data-quality',
    subtitle: 'Use tests to catch broken assumptions before users lose trust.',
    duration: '110 minutes',
    diagramSteps: ['Assumption', 'Test', 'Fail', 'Fix', 'Trust'],
    objectives: ['Use not_null, unique, relationships, and accepted_values tests', 'Write testable assumptions in model YAML', 'Connect data quality to user trust'],
    concept: 'Data tests are executable assumptions. They do not prove data is perfect, but they catch the breakages you know would make the model unsafe.',
    beginnerBridge: 'A test is a smoke alarm. It does not stop every fire, but it tells you when a known danger is happening.',
    practicePrompt: 'Which test should protect customer_id in dim_customers?',
    answer: 'Use unique and not_null. A customer dimension needs exactly one non-null row per customer_id.',
    labTitle: 'Add the First Tests',
    labObjective: 'Add basic dbt-style tests to fct_orders and dim_customers.',
    labSteps: ['Mark customer_id in dim_customers as unique and not_null', 'Mark order_id in fct_orders as unique and not_null', 'Add accepted_values for order_status', 'Add a relationship test from fct_orders.customer_id to dim_customers.customer_id'],
    keyTakeaways: ['Tests turn assumptions into automated checks', 'Basic tests catch many expensive dashboard failures', 'Quality is an engineering workflow, not a cleanup sprint'],
    productionNotes: ['Every model should have at least one grain-protecting test. For facts, test the event key. For dimensions, test the entity key.'],
    commonMistakes: ['Testing only columns that already look clean', 'Adding hundreds of noisy tests nobody investigates', 'Treating warnings and failures without a clear policy'],
    glossary: [{ term: 'Data test', definition: 'A check that validates an expected property of a dataset.' }, { term: 'Relationship test', definition: 'A test that checks whether foreign key values exist in a referenced table.' }],
  }),
  analyticsModule({
    number: 8,
    title: 'Freshness, Contracts, and Documentation',
    slug: 'freshness-contracts-documentation',
    subtitle: 'Make data understandable, current, and safe to change.',
    duration: '95 minutes',
    diagramSteps: ['Freshness', 'Contract', 'Docs', 'Owner', 'SLA'],
    objectives: ['Explain source freshness and data SLAs', 'Document models and columns clearly', 'Understand model contracts and ownership'],
    concept: 'A trusted model needs more than correct SQL. Users need to know what it means, who owns it, how fresh it is, and what changes are allowed.',
    beginnerBridge: 'Documentation is the instruction label on the data. Freshness is the expiration date. A contract is the promise that the shape will not change silently.',
    practicePrompt: 'A payments source stops updating at midnight but tests still pass. What kind of check is missing?',
    answer: 'A freshness check is missing. The data can be structurally valid but stale.',
    labTitle: 'Write the Model Contract Card',
    labObjective: 'Document one model with grain, owner, freshness expectation, and important columns.',
    labSteps: ['Write the model description starting with "One row per..."', 'Add owner and domain', 'Add a freshness expectation for the source', 'Mark columns that should not change type without review'],
    keyTakeaways: ['Freshness is a quality dimension', 'Documentation prevents repeated tribal explanations', 'Contracts make downstream breakage less likely'],
    productionNotes: ['A model without an owner has no one accountable when it breaks. Ownership is part of the data product.'],
    commonMistakes: ['Writing descriptions that repeat the column name', 'Ignoring freshness until executives report stale dashboards', 'Changing column meaning without updating docs'],
    glossary: [{ term: 'Freshness', definition: 'How recently a source or model has received expected data.' }, { term: 'Contract', definition: 'A declared promise about model columns, types, and shape.' }],
  }),
  analyticsModule({
    number: 9,
    title: 'Incremental Models and Backfills',
    slug: 'incremental-models-backfills',
    subtitle: 'Scale transformations without losing correctness when old data changes.',
    duration: '120 minutes',
    diagramSteps: ['Full run', 'New rows', 'Late data', 'Backfill', 'Verify'],
    objectives: ['Understand full refresh vs incremental builds', 'Handle late-arriving data', 'Reason about backfills and idempotency'],
    concept: 'Incremental models process only new or changed data to reduce cost. The hard part is correctness when data arrives late or historical logic changes.',
    beginnerBridge: 'Instead of rewriting an entire notebook every day, you add only today\'s pages. But if yesterday\'s page was corrected, you need a way to update it.',
    practicePrompt: 'An order from Monday arrives in the source on Wednesday. What can go wrong in a naive incremental model?',
    answer: 'The model may only process Wednesday rows and miss the Monday order because its event timestamp is old. Use a lookback window or update timestamp strategy.',
    labTitle: 'Spot the Incremental Bug',
    labObjective: 'Read a naive incremental filter and explain why it misses late-arriving data.',
    labSteps: ['Identify the event timestamp', 'Identify the load timestamp', 'Explain which timestamp the filter uses', 'Add a 3-day lookback window', 'Describe how to deduplicate after the lookback'],
    keyTakeaways: ['Incremental models are performance tools with correctness risks', 'Late-arriving data must be designed for explicitly', 'Backfills should be repeatable and reviewed'],
    productionNotes: ['Document the backfill procedure before you need it. Emergency backfills are risky when no one knows the intended path.'],
    commonMistakes: ['Filtering only by event date', 'Skipping deduplication after lookback windows', 'Using incremental models before the logic is stable'],
    glossary: [{ term: 'Incremental model', definition: 'A model that updates only a subset of rows instead of rebuilding everything.' }, { term: 'Backfill', definition: 'A controlled rebuild or correction of historical data.' }],
  }),
  analyticsModule({
    number: 10,
    title: 'Metrics as Product APIs',
    slug: 'metrics-as-product-apis',
    subtitle: 'Treat revenue, active users, retention, and conversion as governed interfaces.',
    duration: '105 minutes',
    diagramSteps: ['Definition', 'Owner', 'Grain', 'Dims', 'Consumers'],
    objectives: ['Define a production metric specification', 'Separate measures from metrics', 'Understand why metrics need owners and change policies'],
    concept: 'Metrics are product APIs for decision-making. A metric definition should be reusable, owned, documented, tested, and safe for many tools to consume.',
    beginnerBridge: 'If an API changes without warning, apps break. If a metric changes without warning, decisions break.',
    practicePrompt: 'Why is "revenue" not a complete metric definition?',
    answer: 'It does not say gross or net, whether refunds are included, which timestamp is used, what grain applies, or which dimensions are allowed.',
    labTitle: 'Write the net_revenue Metric Spec',
    labObjective: 'Create a beginner-friendly metric card for net revenue.',
    labSteps: ['Define the metric formula', 'Choose the time grain', 'List allowed dimensions', 'Add owner and freshness expectation', 'List two dashboards or AI tools that consume it'],
    keyTakeaways: ['Metrics need more than names', 'A metric spec reduces repeated interpretation', 'Changing a metric is a product change'],
    productionNotes: ['Core business metrics deserve review workflows. Treat metric changes like API changes.'],
    commonMistakes: ['Letting every team define revenue separately', 'Leaving metric ownership unclear', 'Skipping time grain and timezone decisions'],
    glossary: [{ term: 'Measure', definition: 'An aggregatable numeric field such as order_amount.' }, { term: 'Metric', definition: 'A governed business calculation built from measures, filters, and dimensions.' }],
  }),
  analyticsModule({
    number: 11,
    title: 'Semantic Layer Fundamentals',
    slug: 'semantic-layer-fundamentals',
    subtitle: 'Learn entities, measures, dimensions, and the semantic graph.',
    duration: '110 minutes',
    diagramSteps: ['Entity', 'Measure', 'Dimension', 'Metric', 'Query'],
    objectives: ['Explain the purpose of a semantic layer', 'Map business questions to semantic objects', 'Understand how semantic layers protect consistency'],
    concept: 'A semantic layer centralizes business meaning on top of trusted models. It lets tools ask for metrics and dimensions without each tool rewriting SQL logic.',
    beginnerBridge: 'The semantic layer is a dictionary plus a map. It says what business words mean and how those words connect to warehouse tables.',
    practicePrompt: 'For "revenue by customer country", what are the metric and dimension?',
    answer: 'Revenue is the metric. Customer country is the dimension. The semantic layer knows how to join orders to customers safely.',
    labTitle: 'Map Questions to Semantics',
    labObjective: 'Translate five business questions into entities, measures, dimensions, and metrics.',
    labSteps: ['Identify the business noun', 'Identify the number being measured', 'Identify the slice or grouping', 'Identify the time dimension', 'Decide whether a governed metric already exists'],
    keyTakeaways: ['Semantic layers turn tables into business concepts', 'They reduce duplicated SQL in BI and AI tools', 'The semantic graph must respect model grain'],
    productionNotes: ['Start semantic modeling with a small set of critical metrics. A huge semantic layer with no adoption is just another catalog.'],
    commonMistakes: ['Modeling every column semantically on day one', 'Ignoring join fanout risk', 'Letting metric definitions drift from dbt model logic'],
    glossary: [{ term: 'Semantic layer', definition: 'A governed layer defining business entities, dimensions, measures, and metrics.' }, { term: 'Entity', definition: 'A business object such as customer, order, product, or account.' }],
  }),
  analyticsModule({
    number: 12,
    title: 'MetricFlow and the dbt Semantic Layer',
    slug: 'metricflow-dbt-semantic-layer',
    subtitle: 'See how dbt semantic models produce governed SQL at query time.',
    duration: '115 minutes',
    diagramSteps: ['YAML', 'Graph', 'Metric', 'SQL', 'Result'],
    objectives: ['Understand semantic model YAML at a high level', 'Know what MetricFlow does', 'Explain how governed metrics can serve BI, apps, and AI'],
    concept: 'MetricFlow powers the dbt Semantic Layer by using semantic model and metric definitions to generate SQL dynamically for requested metrics and dimensions.',
    beginnerBridge: 'You define the rules once. MetricFlow acts like a careful translator that writes the SQL for each question using those rules.',
    practicePrompt: 'Why is generated SQL safer than each dashboard author writing their own revenue SQL?',
    answer: 'The generated SQL comes from one governed metric definition, so all tools use the same calculation, joins, and time rules.',
    labTitle: 'Read a Semantic Model YAML',
    labObjective: 'Identify entities, measures, dimensions, and metrics in a simplified YAML snippet.',
    labSteps: ['Circle the primary entity', 'Find the revenue measure', 'Find the order date time dimension', 'Find the revenue metric', 'Explain how a query could ask for revenue by month'],
    keyTakeaways: ['MetricFlow generates SQL from semantic definitions', 'The dbt Semantic Layer connects governed metrics to many consumers', 'Semantic YAML should be reviewed like production code'],
    productionNotes: ['Keep semantic definitions close to the dbt models they describe. Distance creates drift.'],
    commonMistakes: ['Confusing measures and metrics', 'Creating semantic definitions on untested models', 'Exposing dimensions that create unsafe joins'],
    glossary: [{ term: 'MetricFlow', definition: 'The query engine used by the dbt Semantic Layer to generate metric SQL.' }, { term: 'Semantic model', definition: 'A definition that describes entities, measures, and dimensions for a dbt model.' }],
  }),
  analyticsModule({
    number: 13,
    title: 'Lineage with dbt Artifacts',
    slug: 'lineage-dbt-artifacts',
    subtitle: 'Trace impact from source columns to models, metrics, dashboards, and AI answers.',
    duration: '120 minutes',
    diagramSteps: ['Source', 'Model', 'Column', 'Metric', 'Dashboard'],
    objectives: ['Explain table, column, metric, and operational lineage', 'Know what dbt manifest, run_results, and catalog artifacts contain', 'Use lineage to reason about blast radius'],
    concept: 'Lineage is the map of how data flows. It helps you debug wrong numbers, assess change impact, and explain how a metric was produced.',
    beginnerBridge: 'Lineage is like a family tree for data. If one parent changes, you can see which children may be affected.',
    practicePrompt: 'raw_orders.amount changes from dollars to cents. Which downstream objects might be impacted?',
    answer: 'Any staging model using amount, any fact table deriving revenue, any revenue metric, and all dashboards or AI tools consuming that metric.',
    labTitle: 'Trace the Blast Radius',
    labObjective: 'Follow one changed source column through models, metrics, and consumers.',
    labSteps: ['Start at raw_orders.amount', 'Map it to stg_orders.order_amount', 'Map it to fct_orders.gross_revenue', 'Map it to net_revenue', 'List impacted dashboards and owners'],
    keyTakeaways: ['Lineage makes data changes safer', 'dbt artifacts already contain useful dependency metadata', 'Column and metric lineage are more useful than table lineage alone'],
    productionNotes: ['Use lineage during code review. Ask "what downstream object changes if this column changes meaning?" before merge.'],
    commonMistakes: ['Treating lineage as a pretty graph only', 'Ignoring dashboards and metrics as lineage endpoints', 'Not capturing run status and freshness alongside structural lineage'],
    glossary: [{ term: 'Lineage', definition: 'Metadata describing how data flows from upstream inputs to downstream outputs.' }, { term: 'Manifest', definition: 'A dbt artifact containing project graph and resource metadata.' }],
  }),
  analyticsModule({
    number: 14,
    title: 'Data Incidents and Debugging',
    slug: 'data-incidents-debugging',
    subtitle: 'Debug wrong revenue, stale data, broken joins, and schema drift like an engineer.',
    duration: '110 minutes',
    diagramSteps: ['Alert', 'Scope', 'Trace', 'Fix', 'Review'],
    objectives: ['Classify common data incidents', 'Use tests and lineage during debugging', 'Write a useful data incident review'],
    concept: 'Data incidents are production incidents. A wrong dashboard can be as damaging as a down API when leaders use it to make decisions.',
    beginnerBridge: 'When a number is wrong, do not randomly edit SQL. Scope the issue, trace upstream, find the first bad layer, fix it, and write what prevented detection.',
    practicePrompt: 'Revenue drops 40% but order count is normal. What should you check first?',
    answer: 'Check payment/refund amount logic, currency/unit conversion, filters on successful orders, and recent changes in models feeding the revenue metric.',
    labTitle: 'Debug a Wrong Metric',
    labObjective: 'Use a fake incident timeline to identify the most likely failing model.',
    labSteps: ['Read the symptoms', 'List affected metrics', 'Trace upstream models', 'Pick the first layer where values diverge', 'Write one test that would have caught it'],
    keyTakeaways: ['Data debugging needs scope, lineage, and tests', 'Incidents should produce prevention work', 'Wrong data is a reliability problem'],
    productionNotes: ['Maintain a data incident template: symptom, impact, first bad layer, detection gap, fix, prevention.'],
    commonMistakes: ['Fixing the dashboard instead of the model', 'Skipping incident review after numbers recover', 'Not notifying metric owners and consumers'],
    glossary: [{ term: 'Data incident', definition: 'A reliability event where data is wrong, late, incomplete, or misleading.' }, { term: 'Blast radius', definition: 'The set of downstream users, models, or metrics affected by a change or failure.' }],
  }),
  analyticsModule({
    number: 15,
    title: 'CI/CD for Analytics Engineering',
    slug: 'analytics-engineering-cicd',
    subtitle: 'Prevent broken models and metric changes from reaching production silently.',
    duration: '105 minutes',
    diagramSteps: ['Change', 'Compile', 'Test', 'Review', 'Deploy'],
    objectives: ['Understand analytics CI checks', 'Use slim CI thinking for changed models', 'Design review rules for metric and semantic changes'],
    concept: 'CI/CD for analytics engineering applies software delivery discipline to data models: compile, test, document, review, and deploy with clear gates.',
    beginnerBridge: 'Before a change reaches users, it should pass the same kind of gate a backend service would pass. Does it build? Do tests pass? What downstream objects change?',
    practicePrompt: 'A pull request changes dim_customers.country. Which models should CI run?',
    answer: 'Run dim_customers, its direct downstream models, and any tests or metrics affected by country. In mature setups, state-aware selection handles this from lineage.',
    labTitle: 'Design a Safe PR Gate',
    labObjective: 'Choose the checks that should block a risky analytics pull request.',
    labSteps: ['List compile checks', 'List model tests', 'List changed model selection', 'Add docs or contract checks', 'Add reviewer rules for metric changes'],
    keyTakeaways: ['Analytics code needs CI because it affects production decisions', 'Run the smallest safe set of changed and downstream models', 'Metric changes deserve extra review'],
    productionNotes: ['A fast CI path increases adoption. If checks take too long, teams route around them.'],
    commonMistakes: ['Running no tests in pull requests', 'Running the entire warehouse for every change', 'Allowing semantic layer changes without business owner review'],
    glossary: [{ term: 'CI', definition: 'Continuous integration; automated checks that run before merge.' }, { term: 'Slim CI', definition: 'A strategy that runs only changed resources and their needed dependencies.' }],
  }),
  analyticsModule({
    number: 16,
    title: 'Capstone: Build a Trusted Analytics Layer',
    slug: 'trusted-analytics-layer-capstone',
    subtitle: 'Design the full flow from raw ecommerce tables to governed metrics and lineage.',
    duration: '2 hours',
    diagramSteps: ['Sources', 'Models', 'Tests', 'Metrics', 'Lineage'],
    objectives: ['Design an end-to-end analytics layer', 'Apply dbt, tests, metrics, semantic modeling, and lineage together', 'Produce a portfolio-ready architecture explanation'],
    concept: 'The capstone combines every course idea into one trusted analytics layer. You will design the models, tests, metric specs, semantic objects, and lineage map.',
    beginnerBridge: 'This is not about memorizing commands. It is about showing you can reason from raw records to trusted business answers.',
    practicePrompt: 'What should be the final proof that your analytics layer is trustworthy?',
    answer: 'You should be able to explain the grain, tests, metric definitions, owners, freshness expectations, and lineage from source to consumer.',
    labTitle: 'Trusted Analytics Layer Design',
    labObjective: 'Create a complete design worksheet for ecommerce analytics.',
    labSteps: ['Define sources and staging models', 'Design marts with facts and dimensions', 'Add tests and freshness checks', 'Define three governed metrics', 'Draw lineage from raw source to dashboard and AI consumer'],
    keyTakeaways: ['Trusted analytics requires modeling, quality, semantics, and lineage together', 'A strong fresher portfolio shows reasoning, not just SQL snippets', 'The same governed layer can serve BI, embedded analytics, and AI tools'],
    productionNotes: ['Use the capstone as a reusable interview story: problem, model design, quality gates, metric governance, lineage, and tradeoffs.'],
    commonMistakes: ['Submitting only SQL without explaining grain or trust', 'Skipping metric ownership', 'Treating lineage as optional decoration'],
    glossary: [{ term: 'Data product', definition: 'A reliable, owned, documented data asset designed for consumers.' }, { term: 'Trusted analytics layer', definition: 'A governed set of models, tests, metrics, semantic definitions, and lineage.' }],
  }),
];

export const ANALYTICS_ENGINEERING_COURSE: Course = {
  id: '5',
  title: 'Production Analytics Engineering with dbt: Metrics, Semantic Layers & Lineage',
  slug: 'production-analytics-engineering-dbt',
  subtitle: 'From raw tables to trusted business metrics, step by step. Beginner-friendly, interactive, and built for freshers learning production data work.',
  excerpt: 'Learn analytics engineering from scratch: dbt models, table grain, staging, marts, tests, freshness, metrics, semantic layers, MetricFlow, lineage, CI/CD, and data incident debugging. 16 modules, inline labs, no repository required.',
  description: 'A beginner-friendly production analytics engineering course for freshers. You will learn how modern data teams transform raw warehouse tables into tested dbt models, governed metrics, semantic layer definitions, and lineage-aware data products. The course uses inline SQL/YAML exercises, diagrams, quizzes, and revealable answers so learners can practice without setting up a GitHub repository.',
  instructor: {
    name: 'Vishal Anand',
    title: 'Senior Product Engineer & Tech Lead',
    bio: 'Creator and maintainer of DRF API Logger, an Apache-2.0 package listed in Django REST Framework\'s third-party packages documentation, and author of production-focused CodersSecret courses. Vishal teaches engineering through concrete systems, diagrams, operational failures, and practical tradeoffs.',
    github: 'https://github.com/vishalanandl177',
    achievements: [
      'Maintainer of DRF API Logger - request logging, profiling, and masking for Django APIs',
      'Author of free CodersSecret courses on security, distributed systems, and production AI',
      'Writes practical engineering guides for backend, DevOps, security, and data systems',
      'Focuses on beginner-friendly explanations without hiding production realities',
    ],
  },
  totalDuration: 'About 28 hours',
  level: 'Beginner to Intermediate',
  category: 'data-engineering',
  labDelivery: 'inline',
  outcomes: [
    'A complete raw-to-mart analytics model map',
    'Tested dbt-style staging, intermediate, fact, and dimension models',
    'Governed metric specs for revenue, active users, and conversion',
    'A semantic layer map with entities, measures, dimensions, and metrics',
    'A lineage blast-radius worksheet from source column to dashboard and AI consumer',
    'A capstone design that can be used as a fresher portfolio artifact',
  ],
  tags: ['Analytics Engineering', 'dbt', 'Semantic Layer', 'MetricFlow', 'Metrics Layer', 'Data Lineage', 'Data Quality', 'Data Modeling', 'SQL', 'Data Engineering', 'Data Contracts', 'Data Observability', 'CI/CD', 'AI Analytics', 'Business Intelligence'],
  targetAudience: [
    'Freshers who know basic SQL and want to enter data engineering or analytics engineering',
    'Backend engineers moving toward data platform work',
    'Data analysts who want software-engineering discipline with dbt',
    'Students who get confused by warehouse, dbt, metrics, and semantic layer terminology',
    'Junior data engineers who want to build trustworthy models, not just pipelines',
    'AI builders who need governed data and metrics before using LLMs over warehouse data',
  ],
  modules: ANALYTICS_ENGINEERING_MODULES,
  seoPages: [
    {
      slug: 'analytics-engineering-course',
      title: 'Analytics Engineering Course for Beginners',
      description: 'A beginner-friendly analytics engineering course covering dbt, models, tests, metrics, semantic layers, and lineage from raw tables to trusted dashboards.',
      ctaModule: 1,
      content: '<h1>Analytics Engineering Course for Beginners</h1><p>Analytics engineering is the practice of turning raw warehouse data into trusted, tested, documented business-ready models and metrics. This free CodersSecret course starts with table grain and SQL basics, then builds toward dbt, semantic layers, metrics, lineage, and CI/CD.</p><h2>Who This Is For</h2><p>If you are a fresher, data analyst, backend engineer, or junior data engineer, this course gives you the mental model behind production analytics work before forcing tool setup.</p>',
    },
    {
      slug: 'dbt-course-beginner',
      title: 'dbt Course for Beginners: Models, Tests, and Marts',
      description: 'Learn dbt fundamentals through staging models, intermediate models, facts, dimensions, tests, documentation, and production analytics workflows.',
      ctaModule: 3,
      content: '<h1>dbt Course for Beginners</h1><p>dbt helps data teams build transformations as SQL models with dependencies, tests, documentation, and deployment workflows. This course teaches dbt as a production engineering habit: clear grain, safe refs, tested assumptions, and maintainable marts.</p><h2>What You Will Learn</h2><p>You will learn sources, refs, DAGs, staging models, intermediate models, marts, tests, freshness checks, incremental models, and CI/CD review practices.</p>',
    },
    {
      slug: 'semantic-layer-course',
      title: 'Semantic Layer Course: Metrics, Entities, Measures, and Dimensions',
      description: 'Learn semantic layer fundamentals: entities, measures, dimensions, metrics, semantic graphs, and how governed metrics serve BI and AI tools.',
      ctaModule: 11,
      content: '<h1>Semantic Layer Course</h1><p>A semantic layer centralizes business meaning so BI tools, embedded analytics, spreadsheets, and AI systems all use the same governed definitions. This course teaches the concepts with small ecommerce examples before introducing MetricFlow and the dbt Semantic Layer.</p>',
    },
    {
      slug: 'metrics-layer-course',
      title: 'Metrics Layer Course: Revenue, Active Users, Conversion, and Retention',
      description: 'Learn how to design governed metrics as reusable product APIs with definitions, owners, grain, dimensions, freshness, and change policies.',
      ctaModule: 10,
      content: '<h1>Metrics Layer Course</h1><p>Metrics such as revenue, active users, conversion, and retention should be defined once and reused everywhere. This course shows how to write metric specs, assign owners, choose grain, control dimensions, and prevent dashboard drift.</p>',
    },
    {
      slug: 'data-lineage-dbt-course',
      title: 'Data Lineage with dbt: Source to Metric to Dashboard',
      description: 'Understand data lineage with dbt artifacts, table lineage, column lineage, metric lineage, and blast-radius analysis for analytics changes.',
      ctaModule: 13,
      content: '<h1>Data Lineage with dbt</h1><p>Lineage shows how data flows from sources to models, metrics, dashboards, and AI answers. In this course, you learn lineage through dbt DAGs, artifacts such as manifest and run results, and practical blast-radius exercises.</p>',
    },
    {
      slug: 'dbt-data-quality-testing-course',
      title: 'dbt Data Quality and Testing Course',
      description: 'Learn data quality with dbt-style tests, freshness checks, relationship tests, contracts, documentation, and data incident debugging.',
      ctaModule: 7,
      content: '<h1>dbt Data Quality and Testing Course</h1><p>Data quality is not a cleanup project. It is an engineering workflow. This course teaches not_null, unique, accepted values, relationship tests, freshness checks, contracts, and incident debugging for trusted analytics.</p>',
    },
  ],
  faqs: [
    { question: 'Is this course beginner-friendly?', answer: 'Yes. It starts with tables, grain, and simple SQL mental models before introducing dbt, semantic layers, and lineage. Every module has a small interactive exercise and answer reveal.' },
    { question: 'Do I need a GitHub repository or local setup?', answer: 'No. The first version uses inline labs inside the course pages. Optional downloadable datasets or a starter dbt project can be added later, but the course is useful without setup.' },
    { question: 'Is this only a dbt course?', answer: 'No. dbt is the transformation tool used for examples, but the course is about production analytics engineering: modeling, quality, metrics, semantic layers, lineage, CI/CD, and data trust.' },
    { question: 'Will this help with data engineering roles?', answer: 'Yes. It teaches the analytics engineering side of data engineering: warehouse modeling, transformation quality, metric governance, and lineage. It pairs well with a future lakehouse or streaming course.' },
    { question: 'Why include semantic layers and metrics?', answer: 'Modern BI and AI analytics need governed definitions. Without a semantic layer or metrics layer, every dashboard or AI query can calculate business terms differently.' },
    { question: 'What should I know before starting?', answer: 'Basic SQL helps, but the course explains the data modeling concepts slowly. You do not need prior dbt, Airflow, Spark, or warehouse experience.' },
  ],
};
