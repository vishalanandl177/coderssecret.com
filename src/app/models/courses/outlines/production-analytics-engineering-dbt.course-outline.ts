import type { CourseOutline } from '../../course-outline';

export const PRODUCTION_ANALYTICS_ENGINEERING_DBT_OUTLINE: CourseOutline = {
  "id": "5",
  "title": "Production Analytics Engineering with dbt: Metrics, Semantic Layers & Lineage",
  "slug": "production-analytics-engineering-dbt",
  "subtitle": "From raw tables to trusted business metrics, step by step. Beginner-friendly, interactive, and built for freshers learning production data work.",
  "excerpt": "Learn analytics engineering from scratch: dbt models, table grain, staging, marts, tests, freshness, metrics, semantic layers, MetricFlow, lineage, CI/CD, and data incident debugging. 16 modules, inline labs, no repository required.",
  "description": "A beginner-friendly production analytics engineering course for freshers. You will learn how modern data teams transform raw warehouse tables into tested dbt models, governed metrics, semantic layer definitions, and lineage-aware data products. The course uses inline SQL/YAML exercises, diagrams, quizzes, and revealable answers so learners can practice without setting up a GitHub repository.",
  "instructor": {
    "name": "Vishal Anand",
    "title": "Senior Product Engineer & Tech Lead",
    "bio": "Creator of DRF API Logger and author of production-focused CodersSecret courses. Vishal teaches engineering through concrete systems, diagrams, operational failures, and practical tradeoffs.",
    "github": "https://github.com/vishalanandl177",
    "achievements": [
      "Creator of DRF API Logger, used across production Django systems",
      "Author of free CodersSecret courses on security, distributed systems, and production AI",
      "Writes practical engineering guides for backend, DevOps, security, and data systems",
      "Focuses on beginner-friendly explanations without hiding production realities"
    ]
  },
  "totalDuration": "About 28 hours",
  "level": "Beginner to Intermediate",
  "category": "data-engineering",
  "labDelivery": "inline",
  "outcomes": [
    "A complete raw-to-mart analytics model map",
    "Tested dbt-style staging, intermediate, fact, and dimension models",
    "Governed metric specs for revenue, active users, and conversion",
    "A semantic layer map with entities, measures, dimensions, and metrics",
    "A lineage blast-radius worksheet from source column to dashboard and AI consumer",
    "A capstone design that can be used as a fresher portfolio artifact"
  ],
  "tags": [
    "Analytics Engineering",
    "dbt",
    "Semantic Layer",
    "MetricFlow",
    "Metrics Layer",
    "Data Lineage",
    "Data Quality",
    "Data Modeling",
    "SQL",
    "Data Engineering",
    "Data Contracts",
    "Data Observability",
    "CI/CD",
    "AI Analytics",
    "Business Intelligence"
  ],
  "targetAudience": [
    "Freshers who know basic SQL and want to enter data engineering or analytics engineering",
    "Backend engineers moving toward data platform work",
    "Data analysts who want software-engineering discipline with dbt",
    "Students who get confused by warehouse, dbt, metrics, and semantic layer terminology",
    "Junior data engineers who want to build trustworthy models, not just pipelines",
    "AI builders who need governed data and metrics before using LLMs over warehouse data"
  ],
  "seoPages": [
    {
      "slug": "analytics-engineering-course",
      "title": "Analytics Engineering Course for Beginners",
      "description": "A beginner-friendly analytics engineering course covering dbt, models, tests, metrics, semantic layers, and lineage from raw tables to trusted dashboards.",
      "ctaModule": 1,
      "content": "<h1>Analytics Engineering Course for Beginners</h1><p>Analytics engineering is the practice of turning raw warehouse data into trusted, tested, documented business-ready models and metrics. This free CodersSecret course starts with table grain and SQL basics, then builds toward dbt, semantic layers, metrics, lineage, and CI/CD.</p><h2>Who This Is For</h2><p>If you are a fresher, data analyst, backend engineer, or junior data engineer, this course gives you the mental model behind production analytics work before forcing tool setup.</p>"
    },
    {
      "slug": "dbt-course-beginner",
      "title": "dbt Course for Beginners: Models, Tests, and Marts",
      "description": "Learn dbt fundamentals through staging models, intermediate models, facts, dimensions, tests, documentation, and production analytics workflows.",
      "ctaModule": 3,
      "content": "<h1>dbt Course for Beginners</h1><p>dbt helps data teams build transformations as SQL models with dependencies, tests, documentation, and deployment workflows. This course teaches dbt as a production engineering habit: clear grain, safe refs, tested assumptions, and maintainable marts.</p><h2>What You Will Learn</h2><p>You will learn sources, refs, DAGs, staging models, intermediate models, marts, tests, freshness checks, incremental models, and CI/CD review practices.</p>"
    },
    {
      "slug": "semantic-layer-course",
      "title": "Semantic Layer Course: Metrics, Entities, Measures, and Dimensions",
      "description": "Learn semantic layer fundamentals: entities, measures, dimensions, metrics, semantic graphs, and how governed metrics serve BI and AI tools.",
      "ctaModule": 11,
      "content": "<h1>Semantic Layer Course</h1><p>A semantic layer centralizes business meaning so BI tools, embedded analytics, spreadsheets, and AI systems all use the same governed definitions. This course teaches the concepts with small ecommerce examples before introducing MetricFlow and the dbt Semantic Layer.</p>"
    },
    {
      "slug": "metrics-layer-course",
      "title": "Metrics Layer Course: Revenue, Active Users, Conversion, and Retention",
      "description": "Learn how to design governed metrics as reusable product APIs with definitions, owners, grain, dimensions, freshness, and change policies.",
      "ctaModule": 10,
      "content": "<h1>Metrics Layer Course</h1><p>Metrics such as revenue, active users, conversion, and retention should be defined once and reused everywhere. This course shows how to write metric specs, assign owners, choose grain, control dimensions, and prevent dashboard drift.</p>"
    },
    {
      "slug": "data-lineage-dbt-course",
      "title": "Data Lineage with dbt: Source to Metric to Dashboard",
      "description": "Understand data lineage with dbt artifacts, table lineage, column lineage, metric lineage, and blast-radius analysis for analytics changes.",
      "ctaModule": 13,
      "content": "<h1>Data Lineage with dbt</h1><p>Lineage shows how data flows from sources to models, metrics, dashboards, and AI answers. In this course, you learn lineage through dbt DAGs, artifacts such as manifest and run results, and practical blast-radius exercises.</p>"
    },
    {
      "slug": "dbt-data-quality-testing-course",
      "title": "dbt Data Quality and Testing Course",
      "description": "Learn data quality with dbt-style tests, freshness checks, relationship tests, contracts, documentation, and data incident debugging.",
      "ctaModule": 7,
      "content": "<h1>dbt Data Quality and Testing Course</h1><p>Data quality is not a cleanup project. It is an engineering workflow. This course teaches not_null, unique, accepted values, relationship tests, freshness checks, contracts, and incident debugging for trusted analytics.</p>"
    }
  ],
  "faqs": [
    {
      "question": "Is this course beginner-friendly?",
      "answer": "Yes. It starts with tables, grain, and simple SQL mental models before introducing dbt, semantic layers, and lineage. Every module has a small interactive exercise and answer reveal."
    },
    {
      "question": "Do I need a GitHub repository or local setup?",
      "answer": "No. The first version uses inline labs inside the course pages. Optional downloadable datasets or a starter dbt project can be added later, but the course is useful without setup."
    },
    {
      "question": "Is this only a dbt course?",
      "answer": "No. dbt is the transformation tool used for examples, but the course is about production analytics engineering: modeling, quality, metrics, semantic layers, lineage, CI/CD, and data trust."
    },
    {
      "question": "Will this help with data engineering roles?",
      "answer": "Yes. It teaches the analytics engineering side of data engineering: warehouse modeling, transformation quality, metric governance, and lineage. It pairs well with a future lakehouse or streaming course."
    },
    {
      "question": "Why include semantic layers and metrics?",
      "answer": "Modern BI and AI analytics need governed definitions. Without a semantic layer or metrics layer, every dashboard or AI query can calculate business terms differently."
    },
    {
      "question": "What should I know before starting?",
      "answer": "Basic SQL helps, but the course explains the data modeling concepts slowly. You do not need prior dbt, Airflow, Spark, or warehouse experience."
    }
  ],
  "modules": [
    {
      "number": 1,
      "title": "What Analytics Engineering Actually Is",
      "slug": "what-is-analytics-engineering",
      "subtitle": "Understand the job: turn raw tables into trusted business meaning.",
      "duration": "75 minutes",
      "objectives": [
        "Explain analytics engineering in beginner-friendly language",
        "Separate data engineering, analytics engineering, and BI work",
        "Understand why trust matters more than query cleverness"
      ],
      "labs": [
        {
          "title": "Classify the Analytics Stack"
        }
      ]
    },
    {
      "number": 2,
      "title": "Tables, Grain, and Why Dashboards Lie",
      "slug": "tables-grain-dashboard-lies",
      "subtitle": "Learn the most important beginner concept: one row per what?",
      "duration": "90 minutes",
      "objectives": [
        "Define table grain accurately",
        "Spot double-counting bugs before they reach dashboards",
        "Understand facts, dimensions, and event tables"
      ],
      "labs": [
        {
          "title": "Find the Grain"
        }
      ]
    },
    {
      "number": 3,
      "title": "The dbt Mental Model",
      "slug": "dbt-mental-model",
      "subtitle": "Understand sources, refs, models, DAGs, and materializations without setup friction.",
      "duration": "90 minutes",
      "objectives": [
        "Explain how dbt compiles SQL models",
        "Read a dbt DAG as a dependency graph",
        "Know when a model should be a view, table, or incremental model"
      ],
      "labs": [
        {
          "title": "Order the dbt DAG"
        }
      ]
    },
    {
      "number": 4,
      "title": "Staging Models",
      "slug": "staging-models",
      "subtitle": "Clean source data gently: rename, cast, standardize, and expose a stable base layer.",
      "duration": "100 minutes",
      "objectives": [
        "Build staging models that stay close to the source",
        "Apply safe renaming and type casting",
        "Avoid burying business logic too early"
      ],
      "labs": [
        {
          "title": "Fix stg_orders"
        }
      ]
    },
    {
      "number": 5,
      "title": "Intermediate Models",
      "slug": "intermediate-models",
      "subtitle": "Build reusable transformation steps without exposing half-finished business tables.",
      "duration": "95 minutes",
      "objectives": [
        "Know when to create an intermediate model",
        "Separate reusable logic from final reporting shape",
        "Reduce duplication across marts"
      ],
      "labs": [
        {
          "title": "Extract Shared Logic"
        }
      ]
    },
    {
      "number": 6,
      "title": "Marts: Facts and Dimensions",
      "slug": "marts-facts-dimensions",
      "subtitle": "Create the business-facing layer: facts, dimensions, and star schemas.",
      "duration": "110 minutes",
      "objectives": [
        "Design simple fact and dimension tables",
        "Understand star schema basics",
        "Choose the right mart grain for reporting"
      ],
      "labs": [
        {
          "title": "Design an Ecommerce Mart"
        }
      ]
    },
    {
      "number": 7,
      "title": "Testing and Data Quality",
      "slug": "testing-data-quality",
      "subtitle": "Use tests to catch broken assumptions before users lose trust.",
      "duration": "110 minutes",
      "objectives": [
        "Use not_null, unique, relationships, and accepted_values tests",
        "Write testable assumptions in model YAML",
        "Connect data quality to user trust"
      ],
      "labs": [
        {
          "title": "Add the First Tests"
        }
      ]
    },
    {
      "number": 8,
      "title": "Freshness, Contracts, and Documentation",
      "slug": "freshness-contracts-documentation",
      "subtitle": "Make data understandable, current, and safe to change.",
      "duration": "95 minutes",
      "objectives": [
        "Explain source freshness and data SLAs",
        "Document models and columns clearly",
        "Understand model contracts and ownership"
      ],
      "labs": [
        {
          "title": "Write the Model Contract Card"
        }
      ]
    },
    {
      "number": 9,
      "title": "Incremental Models and Backfills",
      "slug": "incremental-models-backfills",
      "subtitle": "Scale transformations without losing correctness when old data changes.",
      "duration": "120 minutes",
      "objectives": [
        "Understand full refresh vs incremental builds",
        "Handle late-arriving data",
        "Reason about backfills and idempotency"
      ],
      "labs": [
        {
          "title": "Spot the Incremental Bug"
        }
      ]
    },
    {
      "number": 10,
      "title": "Metrics as Product APIs",
      "slug": "metrics-as-product-apis",
      "subtitle": "Treat revenue, active users, retention, and conversion as governed interfaces.",
      "duration": "105 minutes",
      "objectives": [
        "Define a production metric specification",
        "Separate measures from metrics",
        "Understand why metrics need owners and change policies"
      ],
      "labs": [
        {
          "title": "Write the net_revenue Metric Spec"
        }
      ]
    },
    {
      "number": 11,
      "title": "Semantic Layer Fundamentals",
      "slug": "semantic-layer-fundamentals",
      "subtitle": "Learn entities, measures, dimensions, and the semantic graph.",
      "duration": "110 minutes",
      "objectives": [
        "Explain the purpose of a semantic layer",
        "Map business questions to semantic objects",
        "Understand how semantic layers protect consistency"
      ],
      "labs": [
        {
          "title": "Map Questions to Semantics"
        }
      ]
    },
    {
      "number": 12,
      "title": "MetricFlow and the dbt Semantic Layer",
      "slug": "metricflow-dbt-semantic-layer",
      "subtitle": "See how dbt semantic models produce governed SQL at query time.",
      "duration": "115 minutes",
      "objectives": [
        "Understand semantic model YAML at a high level",
        "Know what MetricFlow does",
        "Explain how governed metrics can serve BI, apps, and AI"
      ],
      "labs": [
        {
          "title": "Read a Semantic Model YAML"
        }
      ]
    },
    {
      "number": 13,
      "title": "Lineage with dbt Artifacts",
      "slug": "lineage-dbt-artifacts",
      "subtitle": "Trace impact from source columns to models, metrics, dashboards, and AI answers.",
      "duration": "120 minutes",
      "objectives": [
        "Explain table, column, metric, and operational lineage",
        "Know what dbt manifest, run_results, and catalog artifacts contain",
        "Use lineage to reason about blast radius"
      ],
      "labs": [
        {
          "title": "Trace the Blast Radius"
        }
      ]
    },
    {
      "number": 14,
      "title": "Data Incidents and Debugging",
      "slug": "data-incidents-debugging",
      "subtitle": "Debug wrong revenue, stale data, broken joins, and schema drift like an engineer.",
      "duration": "110 minutes",
      "objectives": [
        "Classify common data incidents",
        "Use tests and lineage during debugging",
        "Write a useful data incident review"
      ],
      "labs": [
        {
          "title": "Debug a Wrong Metric"
        }
      ]
    },
    {
      "number": 15,
      "title": "CI/CD for Analytics Engineering",
      "slug": "analytics-engineering-cicd",
      "subtitle": "Prevent broken models and metric changes from reaching production silently.",
      "duration": "105 minutes",
      "objectives": [
        "Understand analytics CI checks",
        "Use slim CI thinking for changed models",
        "Design review rules for metric and semantic changes"
      ],
      "labs": [
        {
          "title": "Design a Safe PR Gate"
        }
      ]
    },
    {
      "number": 16,
      "title": "Capstone: Build a Trusted Analytics Layer",
      "slug": "trusted-analytics-layer-capstone",
      "subtitle": "Design the full flow from raw ecommerce tables to governed metrics and lineage.",
      "duration": "2 hours",
      "objectives": [
        "Design an end-to-end analytics layer",
        "Apply dbt, tests, metrics, semantic modeling, and lineage together",
        "Produce a portfolio-ready architecture explanation"
      ],
      "labs": [
        {
          "title": "Trusted Analytics Layer Design"
        }
      ]
    }
  ]
};
