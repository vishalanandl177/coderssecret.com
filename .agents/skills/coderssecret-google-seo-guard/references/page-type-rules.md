# Page-type SEO rules for CodersSecret

## Home page

Must have:

- title: `CodersSecret — Practical Engineering Tutorials` or equivalent
- meta description describing practical engineering tutorials
- canonical: `https://coderssecret.com/`
- one H1
- clear links to Blog, topics, slides, and important learning paths
- WebSite structured data if supported
- favicon link
- site name consistency

Avoid:

- generic marketing copy
- hidden keyword blocks
- fake stats

## Blog index `/blog`

Must have:

- title: `Blog | CodersSecret — Practical Engineering Tutorials` or equivalent
- page-specific meta description
- canonical: `https://coderssecret.com/blog` or trailing slash equivalent
- one H1
- crawlable article cards
- visible topic filters if present
- "Watch as Slides" links preserved where present
- self-canonical or correct pagination/canonical handling
- sitemap inclusion

Structured data:

- BreadcrumbList if breadcrumbs visible.
- ItemList only if it accurately represents visible articles.

## Blog detail `/blog/[slug]`

Must have:

- unique title based on article title
- unique meta description
- self canonical
- one H1
- visible article metadata if available
- crawlable article body
- visible breadcrumbs
- article tags/topics if available
- related article links
- Watch as Slides link if available
- sticky "On this page" as real anchor links
- Discussion safe loading/fallback

Structured data:

- BlogPosting/Article if metadata is real.
- BreadcrumbList if visible.
- No fake FAQ/review/rating.

## Slides page

Must have:

- unique title
- description that explains the slide learning format
- canonical strategy
- crawlable link back to the article if related
- no duplicate-content confusion

If slides are near-duplicates of the article, choose whether the article is the canonical. If slides are unique and valuable, self-canonicalize.

## Topic/category pages

Index only when they provide unique value.

Must have if indexable:

- unique title
- unique description
- self canonical
- one H1
- useful intro copy
- crawlable links to related articles/courses/slides
- sitemap inclusion

Noindex/canonicalize if:

- thin
- duplicate
- generated only by query/filter
- no stable content

## Course/listing pages

Must have:

- unique title/description
- clear course outcomes
- real course cards
- crawlable links
- Course or ItemList schema only if accurate

Do not invent courses, providers, prices, ratings, or completion data.

## Search/filter/query pages

Usually avoid indexing unless they have unique stable value.

Rules:

- If query results are dynamic/thin: noindex.
- If filter pages are canonical category pages with unique content: index and self-canonical.
- Do not put infinite query variants into sitemap.
- Avoid crawl traps.

## Draft/preview/admin pages

- Noindex or auth-protect.
- Exclude from sitemap.
- Do not expose internal URLs publicly.

## 404/error pages

- Correct 404/410 status.
- Noindex or not indexable by status.
- Helpful user-facing links.
- Do not return `200` for missing content.
