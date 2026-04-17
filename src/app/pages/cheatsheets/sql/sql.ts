import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../../services/seo.service';

interface Section {
  title: string;
  items: { cmd: string; desc: string }[];
}

@Component({
  selector: 'app-cheatsheet-sql',
  imports: [RouterLink],
  template: `
    <section class="py-16 md:py-20 animate-in fade-in duration-500">
      <div class="container max-w-5xl mx-auto px-6">
        <nav aria-label="Breadcrumb" class="mb-6">
          <ol class="flex items-center gap-1.5 text-sm text-muted-foreground">
            <li><a routerLink="/" class="hover:text-foreground transition-colors">Home</a></li>
            <li class="text-muted-foreground/50">/</li>
            <li><a routerLink="/cheatsheets" class="hover:text-foreground transition-colors">Cheat Sheets</a></li>
            <li class="text-muted-foreground/50">/</li>
            <li class="text-foreground font-medium" aria-current="page">SQL</li>
          </ol>
        </nav>

        <div class="flex items-center gap-4 mb-8">
          <span class="text-5xl">🗄️</span>
          <div>
            <h1 class="text-3xl md:text-4xl font-extrabold tracking-tight">SQL Cheat Sheet</h1>
            <p class="text-muted-foreground mt-1">Queries, joins, aggregations, and performance — all in one page</p>
          </div>
        </div>

        <div class="grid md:grid-cols-2 gap-5">
          @for (section of sections; track section.title) {
            <div class="rounded-xl border border-border/60 bg-card overflow-hidden">
              <div class="px-5 py-3 bg-muted/50 border-b border-border/40">
                <h2 class="text-sm font-bold uppercase tracking-wider">{{ section.title }}</h2>
              </div>
              <div class="divide-y divide-border/40">
                @for (item of section.items; track item.cmd) {
                  <div class="px-5 py-3 flex gap-4 hover:bg-accent/30 transition-colors">
                    <code class="text-xs font-mono bg-muted px-2 py-1 rounded flex-shrink-0 max-w-[55%] overflow-x-auto whitespace-nowrap">{{ item.cmd }}</code>
                    <span class="text-xs text-muted-foreground">{{ item.desc }}</span>
                  </div>
                }
              </div>
            </div>
          }
        </div>

        <div class="mt-8 text-center">
          <a routerLink="/cheatsheets" class="text-sm text-muted-foreground hover:text-foreground">← All Cheat Sheets</a>
          <span class="mx-3 text-muted-foreground/50">|</span>
          <a routerLink="/blog" [queryParams]="{tag:'SQL'}" class="text-sm text-primary hover:underline">Read SQL tutorials →</a>
        </div>
      </div>
    </section>
  `,
})
export class SqlCheatsheetComponent {
  private seo = inject(SeoService);

  sections: Section[] = [
    {
        "title": "Basic Queries",
        "items": [
            {
                "cmd": "SELECT * FROM users",
                "desc": "All rows, all columns"
            },
            {
                "cmd": "SELECT name, email FROM users",
                "desc": "Specific columns"
            },
            {
                "cmd": "SELECT DISTINCT city FROM users",
                "desc": "Unique values"
            },
            {
                "cmd": "WHERE age > 25",
                "desc": "Filter rows"
            },
            {
                "cmd": "WHERE name LIKE '%ali%'",
                "desc": "Pattern match"
            },
            {
                "cmd": "WHERE status IN ('active','vip')",
                "desc": "Match list"
            },
            {
                "cmd": "WHERE email IS NULL",
                "desc": "Check for NULL"
            },
            {
                "cmd": "ORDER BY created_at DESC",
                "desc": "Sort descending"
            },
            {
                "cmd": "LIMIT 10 OFFSET 20",
                "desc": "Pagination"
            }
        ]
    },
    {
        "title": "JOINs",
        "items": [
            {
                "cmd": "INNER JOIN orders ON u.id = o.user_id",
                "desc": "Match both sides"
            },
            {
                "cmd": "LEFT JOIN orders ON ...",
                "desc": "All from left + matches"
            },
            {
                "cmd": "RIGHT JOIN orders ON ...",
                "desc": "All from right + matches"
            },
            {
                "cmd": "FULL OUTER JOIN orders ON ...",
                "desc": "All from both sides"
            },
            {
                "cmd": "CROSS JOIN products",
                "desc": "Cartesian product"
            },
            {
                "cmd": "LEFT JOIN ... WHERE o.id IS NULL",
                "desc": "Users WITHOUT orders"
            }
        ]
    },
    {
        "title": "Aggregations",
        "items": [
            {
                "cmd": "COUNT(*)",
                "desc": "Count rows"
            },
            {
                "cmd": "COUNT(DISTINCT col)",
                "desc": "Count unique values"
            },
            {
                "cmd": "SUM(amount)",
                "desc": "Total"
            },
            {
                "cmd": "AVG(amount)",
                "desc": "Average"
            },
            {
                "cmd": "MAX(amount) / MIN(amount)",
                "desc": "Max / Min"
            },
            {
                "cmd": "GROUP BY category",
                "desc": "Group rows"
            },
            {
                "cmd": "HAVING COUNT(*) > 5",
                "desc": "Filter groups"
            }
        ]
    },
    {
        "title": "Window Functions",
        "items": [
            {
                "cmd": "ROW_NUMBER() OVER (ORDER BY id)",
                "desc": "Sequential number"
            },
            {
                "cmd": "RANK() OVER (ORDER BY score DESC)",
                "desc": "Rank with gaps"
            },
            {
                "cmd": "DENSE_RANK() OVER (...)",
                "desc": "Rank without gaps"
            },
            {
                "cmd": "LAG(col, 1) OVER (ORDER BY date)",
                "desc": "Previous row value"
            },
            {
                "cmd": "LEAD(col, 1) OVER (ORDER BY date)",
                "desc": "Next row value"
            },
            {
                "cmd": "SUM(amt) OVER (PARTITION BY user_id)",
                "desc": "Running total per user"
            }
        ]
    },
    {
        "title": "CTEs & Subqueries",
        "items": [
            {
                "cmd": "WITH cte AS (SELECT ...)",
                "desc": "Common Table Expression"
            },
            {
                "cmd": "WHERE id IN (SELECT ...)",
                "desc": "Subquery filter"
            },
            {
                "cmd": "SELECT *, (SELECT ...) AS x",
                "desc": "Scalar subquery"
            },
            {
                "cmd": "WITH RECURSIVE cte AS (...)",
                "desc": "Recursive CTE (trees)"
            }
        ]
    },
    {
        "title": "Data Modification",
        "items": [
            {
                "cmd": "INSERT INTO t (a,b) VALUES (1,2)",
                "desc": "Insert row"
            },
            {
                "cmd": "INSERT INTO t SELECT ... FROM s",
                "desc": "Insert from select"
            },
            {
                "cmd": "UPDATE users SET name='B' WHERE id=1",
                "desc": "Update rows"
            },
            {
                "cmd": "DELETE FROM users WHERE id=1",
                "desc": "Delete rows"
            },
            {
                "cmd": "TRUNCATE TABLE users",
                "desc": "Delete all rows (fast)"
            }
        ]
    },
    {
        "title": "Indexes & Performance",
        "items": [
            {
                "cmd": "CREATE INDEX idx ON t(col)",
                "desc": "Create index"
            },
            {
                "cmd": "CREATE UNIQUE INDEX idx ON t(col)",
                "desc": "Unique index"
            },
            {
                "cmd": "EXPLAIN ANALYZE SELECT ...",
                "desc": "Query execution plan"
            },
            {
                "cmd": "CREATE INDEX idx ON t(a, b)",
                "desc": "Composite index"
            },
            {
                "cmd": "DROP INDEX idx",
                "desc": "Remove index"
            }
        ]
    },
    {
        "title": "Schema",
        "items": [
            {
                "cmd": "CREATE TABLE t (id SERIAL PRIMARY KEY, ...)",
                "desc": "Create table"
            },
            {
                "cmd": "ALTER TABLE t ADD COLUMN col TYPE",
                "desc": "Add column"
            },
            {
                "cmd": "ALTER TABLE t DROP COLUMN col",
                "desc": "Remove column"
            },
            {
                "cmd": "ALTER TABLE t RENAME TO new_t",
                "desc": "Rename table"
            },
            {
                "cmd": "DROP TABLE t",
                "desc": "Delete table"
            }
        ]
    }
];

  constructor() {
    this.seo.update({
      title: 'SQL Cheat Sheet 2026 — Quick Reference for Developers',
      description: 'Complete SQL cheat sheet: SELECT, JOIN, GROUP BY, window functions, subqueries, CTEs, indexes, transactions, and performance tips.',
      url: '/cheatsheets/sql',
      breadcrumbs: [
        { name: 'Home', url: '/' },
        { name: 'Cheat Sheets', url: '/cheatsheets' },
        { name: 'SQL', url: '/cheatsheets/sql' },
      ],
    });
  }
}
