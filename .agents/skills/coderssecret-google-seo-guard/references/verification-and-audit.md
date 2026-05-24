# Verification and audit workflow

## Before code changes

1. Inspect the current route/template.
2. List affected public pages.
3. Check existing metadata and schema.
4. Check existing sitemap/robots behavior.
5. Identify potential SEO risk from the task.

## After code changes

Run project commands:

- lint
- typecheck
- tests
- build
- format check
- route generation
- sitemap generation
- broken-link check if available
- accessibility check if available

Run local SEO smoke check if static HTML is available:

```bash
python .agents/skills/coderssecret-google-seo-guard/scripts/seo_smoke_check.py ./dist --site https://coderssecret.com
```

Use the actual output folder for the project.

## Manual HTML inspection

For each important page, check rendered source or static output:

- title
- meta description
- canonical
- robots
- OG/Twitter tags
- H1
- headings
- content presence
- links
- schema
- image alt
- status code
- no console/hydration errors

## Structured data validation

Local:

- JSON.parse all JSON-LD blocks.
- Confirm visible content matches schema.

Post-deploy/manual:

- Use Google's Rich Results Test for changed schema pages.
- Use Search Console URL Inspection for important changed pages.

## Search Console monitoring

After production deployment, Search Console should be used to monitor:

- indexing issues
- sitemap processing
- page experience/Core Web Vitals
- manual actions
- rich result errors
- traffic drops
- crawl errors

Codex usually cannot access Search Console unless configured. If it cannot, state the exact post-deploy checks needed rather than pretending they were done.

## Zero-known-issue loop

If any issue appears:

1. Fix the smallest root cause.
2. Re-run relevant checks.
3. Re-inspect affected pages.
4. Repeat.

Do not stop with "mostly done." Final answer must be honest about what was checked and what could not be checked.
