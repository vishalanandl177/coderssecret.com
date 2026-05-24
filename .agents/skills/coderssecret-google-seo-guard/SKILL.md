---
name: coderssecret-google-seo-guard
description: >
  Protect CodersSecret.com SEO on every public website change. Use this skill before, during,
  and after any task that touches routes, pages, components, metadata, schema, content,
  internal links, redirects, robots, sitemap, JavaScript rendering, performance, accessibility,
  blog/course/slides pages, discussion/comments, or any user-visible public content. Based on
  Google Search Central SEO guidance and CodersSecret's learning-site objective.
---

# CodersSecret Google SEO Guard

You are working on `coderssecret.com`, a practical learning website for developers and engineers.

This skill is a release gate. Do not treat SEO as an afterthought. For every change that touches public UI, routes, metadata, content, schema, rendering, links, performance, robots, sitemap, discussions/comments, or navigation, preserve or improve SEO.

"Done" means zero known SEO regressions after repeated verification.

## Core objective

Protect CodersSecret from SEO regressions while keeping the site useful for learners.

CodersSecret content should help engineers understand real production topics such as system design, security, DevOps, cloud, Kubernetes, SPIFFE/SPIRE, Zero Trust, AI/RAG, databases, Python, analytics engineering, frontend engineering, and production architecture.

SEO must never push the site toward keyword stuffing, thin content, doorway pages, fake schema, fake dates, fake authors, fake FAQs, or generic AI-sounding content.

## Primary Google Search principles to follow

Use the official Google Search Central guidance summarized in the references:

- `references/google-seo-source-map.md`
- `references/seo-release-gate-checklist.md`
- `references/technical-seo-rules.md`
- `references/content-quality-rules.md`
- `references/structured-data-rules.md`
- `references/page-type-rules.md`
- `references/common-seo-regressions.md`
- `references/verification-and-audit.md`

Before changing code, inspect those files when the task involves SEO-sensitive work.

## SEO release gate

Before implementation:

1. Identify all touched public routes and templates.
2. Identify the page type for each touched route:
   - home
   - blog index
   - blog detail
   - slide page
   - course/listing page
   - course/detail page
   - tag/category/topic page
   - search/filter page
   - documentation/lab page
   - discussion/comment-enabled page
   - private/admin/draft/preview page
   - 404/error page
3. Inspect current SEO implementation:
   - route generation
   - metadata/head setup
   - canonical handling
   - title template
   - meta description generation
   - Open Graph/Twitter metadata
   - structured data generation
   - robots meta
   - sitemap generation
   - robots.txt
   - internal links
   - content rendering
   - JavaScript/client-only rendering
   - image rendering
   - performance-critical components
4. Record the current behavior mentally before editing. Do not remove existing SEO behavior accidentally.

During implementation:

1. Keep metadata server-rendered/static whenever the framework supports it.
2. Use stable, absolute canonical URLs for public indexable pages.
3. Keep exactly one clear H1 per page.
4. Keep crawlable links as real `<a href="...">` elements.
5. Do not hide primary content behind client-only JavaScript.
6. Do not add `noindex`, `nofollow`, robots disallow rules, or redirects unless the route is intentionally private, duplicate, temporary, or non-indexable.
7. Do not create fake structured data or mark up content that users cannot see.
8. Preserve route URLs unless the task explicitly asks for a migration. If a URL changes, add proper redirects and update internal links, canonical URLs, and sitemap entries.
9. Keep content helpful, human, practical, and aligned with CodersSecret's learning objective.
10. Keep page experience strong: fast, mobile-friendly, accessible, no intrusive interstitials.

After implementation:

1. Run relevant project checks.
2. Run an SEO smoke check where possible.
3. Manually inspect rendered HTML for critical pages.
4. Fix every known SEO issue.
5. Re-run checks.
6. Repeat until zero known SEO issues remain.

## Non-negotiable blockers

Stop and fix before final response if any public indexable page has:

- missing or empty `<title>`
- duplicate/boilerplate title that does not describe the page
- missing useful meta description on important public pages
- missing canonical URL
- canonical URL that points to the wrong route, wrong host, wrong protocol, or a relative URL
- accidental `noindex`
- accidental robots.txt block for public content, assets required for rendering, favicon, images meant to rank, or structured data pages
- more than one H1, no H1, or an H1 that does not match the page topic
- primary content rendered only after client-side JavaScript when SSR/static rendering is available
- broken article links, slide links, canonical links, or internal links
- JS-only links without `<a href>`
- schema that describes invisible, fake, outdated, or unrelated content
- invalid JSON-LD
- fake FAQ, fake rating, fake author, fake date, fake comment count, or fake review schema
- broken sitemap generation
- route removed without redirect or documented noindex decision
- public page returning wrong status code
- intrusive interstitial blocking content
- mobile layout hiding or removing meaningful content compared with desktop
- duplicate thin pages created for keyword variations
- hidden text or keyword stuffing
- content written primarily to manipulate ranking or AI search responses
- severe Core Web Vitals risk introduced by the change
- console/hydration errors that affect metadata, content, links, TOC, discussion, or article rendering

## Titles

Every public indexable page needs a unique, descriptive title.

Rules:

- Describe the specific page, not just "CodersSecret".
- Keep branding concise.
- Recommended pattern:
  - Home: `CodersSecret — Practical Engineering Tutorials`
  - Blog index: `Blog | CodersSecret — Practical Engineering Tutorials`
  - Blog detail: `{Article Title} | CodersSecret`
  - Course detail: `{Course Name} | CodersSecret`
  - Topic page: `{Topic} Tutorials | CodersSecret`
- Avoid half-empty titles like `| CodersSecret`.
- Avoid repeated boilerplate across many pages.
- Avoid keyword stuffing.
- Keep title, H1, visual hero title, and `og:title` consistent, but not necessarily identical.
- Do not include volatile data unless the page truly needs it.

## Meta descriptions

Every important public page needs a useful, page-specific meta description.

Rules:

- Write a short human summary of the page.
- Make it useful to learners deciding whether to click.
- Do not repeat the same description across many pages.
- Do not stuff keywords.
- For blog detail pages, summarize what the learner will understand, build, compare, or avoid.
- For topic pages, explain the practical learning scope.
- For course pages, describe the course outcome and audience.
- For pages where a generated description is unavailable, derive one from the article/course summary or first useful paragraph.
- Avoid generic language like:
  - "Learn everything about..."
  - "The ultimate guide..."
  - "Unlock the power..."
  - "Dive deep..."
  - "Game-changing..."
  - "In today's fast-paced world..."

## Canonicals and duplicate handling

Every public indexable page should have one canonical URL.

Rules:

- Use absolute HTTPS canonical URLs.
- Prefer `https://coderssecret.com/...`.
- Link internally to canonical URLs, not duplicate variants.
- Normalize trailing slash behavior consistently with the site.
- Normalize case, query strings, and slash variants.
- For duplicate or near-duplicate versions:
  - choose one canonical
  - canonicalize duplicates to the primary page
  - redirect when appropriate
  - remove duplicate URLs from sitemap
- Do not canonicalize unrelated pages to one another.
- Do not canonicalize all pages to the home page.
- Do not point article canonicals to category pages.
- Do not point paginated/filter pages to unrelated pages unless they are truly duplicate/thin and intentionally handled.
- If slides duplicate an article heavily, decide whether article is primary and use canonical accordingly. If slides are a unique learning format with distinct value, self-canonicalize them.
- If canonical cannot be emitted in the HTML source for a client-rendered page, fix the rendering approach instead of relying on late JavaScript mutation.

## Robots and indexing

Use robots controls carefully.

Rules:

- Public learning content should usually be indexable.
- Do not add `noindex` to public articles, blog index, topic pages, course pages, slides, or the home page unless explicitly intended.
- Use `noindex` for draft, preview, admin, internal, test, auth, duplicate-thin, or private pages.
- If a page must be removed from Google, use `noindex`, proper status codes, or access control. Do not rely on robots.txt alone to hide a URL from search results.
- Do not block pages with robots.txt if they need Google to see a `noindex` directive.
- Do not block CSS/JS required for Google to understand the rendered page.
- Do not block images, favicon, or assets that should appear in Search.
- Do not add site-wide `Disallow: /` unless intentionally taking the site offline.
- Ensure `robots.txt` points to the sitemap if the project supports it:
  - `Sitemap: https://coderssecret.com/sitemap.xml`

## Sitemaps

Maintain a clean sitemap.

Rules:

- Include only canonical, public, indexable URLs.
- Exclude draft, preview, admin, private, duplicate, search query, and noindex pages.
- Update sitemap when public routes are added, removed, or renamed.
- Use accurate `lastmod` only if the project can provide real modified dates.
- Do not fake daily updates.
- Keep sitemap URLs absolute and HTTPS.
- If the site grows beyond limits, use sitemap indexes.
- If image or video sitemap extensions are used, ensure referenced assets are crawlable and relevant.

## URL structure

Use stable, readable URLs.

Rules:

- Use descriptive human-readable slugs.
- Use lowercase words separated by hyphens.
- Avoid underscores for word separation.
- Avoid long IDs, meaningless hashes, and noisy query strings for canonical learning pages.
- Do not change existing URLs without redirects.
- Keep `/blog/{slug}` stable for articles.
- Keep route hierarchy logical:
  - `/blog`
  - `/blog/{slug}`
  - `/slides/{slug}` or the existing project route
  - `/topics/{topic}` if topics exist
  - `/courses/{slug}` if courses exist

## Links and internal linking

Links must be crawlable and useful.

Rules:

- Use real `<a href="...">` links for navigation, article cards, breadcrumbs, related articles, slide links, topic links, and pagination.
- Do not rely on `onClick`, buttons, spans, or divs for links.
- Use descriptive anchor text.
- Avoid "click here" when a more descriptive label is possible.
- Keep breadcrumbs linked.
- Keep "Watch as Slides" links working.
- Keep related article links crawlable.
- Add useful internal links from articles to related lessons, topics, and slides.
- Avoid excessive unrelated internal links.
- Avoid broken anchors and hash links.
- For external links:
  - regular editorial references need no special rel by default
  - user-generated discussion/comment links should use `rel="ugc"` and may include `nofollow`
  - sponsored/paid/affiliate links must use `rel="sponsored"` or `rel="nofollow sponsored"`
  - untrusted links should use `rel="nofollow"`
- Do not add `nofollow` to normal internal links as a PageRank sculpting tactic.

## Content quality for CodersSecret

CodersSecret is a learning website. Every content change must be useful to learners.

A good CodersSecret page should answer:

1. What is this topic?
2. Why does it matter in real production systems?
3. How does it work?
4. What can go wrong?
5. What should a developer, architect, or security engineer actually do?
6. What examples, diagrams, commands, code, or checklists help the learner?
7. What related CodersSecret pages should they read next?

Rules:

- Write like a senior engineer explaining to another engineer.
- Keep language simple and direct.
- Prefer examples over hype.
- Prefer precise claims over broad claims.
- Avoid generic bot-like filler.
- Do not inflate content to hit word counts.
- Do not create near-duplicate articles for keyword variations.
- Do not invent facts, author names, dates, sources, metrics, quotes, comments, ratings, or tools.
- If content uses external technical claims, prefer official docs and primary sources.
- Add diagrams/images only when they clarify the topic.
- Keep the first screen useful: H1, summary, key learning value, and navigation should be clear.
- For AI-assisted content, ensure original value, human editing, factual review, and usefulness.

## Anti-spam rules

Never implement or preserve:

- cloaking
- hidden keyword text
- hidden links
- doorway pages
- scaled low-value pages
- expired-domain style irrelevant content
- scraped or lightly rewritten content
- keyword stuffing
- misleading redirects
- fake structured data
- fake reviews or ratings
- link schemes
- parasite SEO content unrelated to CodersSecret's learning mission
- automatically generated pages that add no value
- pages that target many keyword variants but say the same thing
- affiliate/sponsored content without proper qualification
- spammy UGC/comment links

Dynamic UI such as tabs, accordions, slide decks, and expandable content is allowed when it helps users and is not used to hide manipulative text.

## JavaScript SEO

Google can render JavaScript, but do not make SEO depend on fragile client-only behavior when the project can SSR/static render.

Rules:

- Emit title, meta description, canonical, robots, structured data, H1, primary article content, and important links in initial HTML whenever possible.
- Do not inject canonical late through JavaScript if server/static HTML can emit it.
- Do not use client-only rendering for primary content without a strong reason.
- Ensure hydrated content matches server content.
- Avoid hydration errors.
- Fix lazy-loaded content so it is discoverable and not hidden from crawlers.
- Use progressive enhancement.
- Ensure navigation links remain crawlable without JavaScript where feasible.
- If using client-side routing, page title, metadata, canonical, focus, and scroll restoration must update correctly.

## Structured data

Use structured data only when it accurately represents visible page content.

Preferred formats:

- JSON-LD when possible.
- Microdata/RDFa only if already used by the project.

Common CodersSecret schema:

- `WebSite` on home page.
- `Organization` or `Person` only if real and appropriate.
- `BreadcrumbList` on pages with visible breadcrumbs.
- `Article` or `BlogPosting` on blog detail pages.
- `Course` / course list schema only for real course lists and real course pages.
- `ItemList` for visible lists of articles/courses only if accurate.
- `FAQPage` only if the page has real visible FAQ questions and answers.
- `VideoObject` only if an actual visible video exists and required fields are real.
- `ImageObject`/image metadata only for real representative images.

Rules:

- Required fields must be present and real.
- Recommended fields should be added when real data exists.
- Dates must be real ISO dates.
- `dateModified` must update only when the content materially changes.
- Author must be a real visible author/source, not invented.
- Images must be crawlable and representative.
- Do not use generic site logo as the primary image for every article unless no better image exists and the project has intentionally chosen that.
- Do not mark up hidden content.
- Do not mark up fake FAQs, fake reviews, fake ratings, fake courses, fake videos, fake author profiles, fake comment counts, or fake breadcrumbs.
- Validate JSON-LD syntax.
- Prefer one coherent graph with stable `@id` values if the project already uses a graph model.

## Page experience, mobile, and Core Web Vitals

Protect the learner's experience.

Rules:

- Keep mobile content equivalent to desktop for meaningful content and metadata.
- Do not hide important learning content on mobile.
- Avoid intrusive interstitials and dialogs that block content.
- Avoid heavy animations that delay reading or cause layout shift.
- Preserve or improve:
  - LCP
  - INP
  - CLS
- Avoid layout shift from images, ads, embeds, code blocks, discussion widgets, TOC, and dynamic content.
- Use image dimensions or responsive aspect ratios.
- Lazy-load below-the-fold images, but do not lazy-load the LCP image in a way that hurts LCP.
- Keep discussion widgets from blocking article content.
- Avoid adding heavy dependencies.
- Avoid blocking scripts.
- Use accessible, responsive UI.

## Images and media

Rules:

- Use meaningful alt text for informative images.
- Use empty alt for decorative images.
- Use descriptive file names when adding new image assets.
- Use relevant representative `og:image` and schema image when available.
- Do not use irrelevant generic images.
- Ensure images referenced in schema/OG are crawlable.
- Avoid extreme aspect ratios for representative images.
- Add image dimensions or CSS aspect ratios to prevent CLS.
- Use modern optimized formats where supported.
- Do not block images in robots.txt if they should appear in Search.

## Blog detail pages

Every `/blog/[slug]` page should have:

- unique `<title>`
- unique meta description
- canonical URL
- exactly one H1
- visible author/date/category/read time if data exists
- visible breadcrumbs and matching `BreadcrumbList` if schema is used
- `Article` or `BlogPosting` schema if accurate
- `datePublished` and `dateModified` only when real
- representative image only when real
- crawlable article body in initial HTML when possible
- sticky "On this page" links as real anchors
- related article links as real anchors
- "Watch as Slides" link preserved if present
- sources/spec notes preserved if present
- Discussion section that does not break rendering, SEO, or layout
- discussion/comment outbound links marked appropriately as UGC

## Blog index page

The `/blog` page should have:

- unique title and meta description
- canonical URL
- exactly one H1
- clear learning-focused hero copy
- crawlable article cards
- topic/category filters that do not break article links
- featured/latest article links
- "Watch as Slides" links preserved
- item list or collection schema only if accurate and supported
- no accidental noindex
- no client-only article list if server/static rendering is available
- clean pagination or filtering behavior if implemented

## Slides pages

Slides should support learning without harming SEO.

Rules:

- Preserve slide routes and links.
- If slide pages are indexable, give them unique titles/descriptions/canonicals.
- If a slide page duplicates an article closely, choose a canonical strategy intentionally.
- If slides are not intended to be indexed, use `noindex` intentionally and document why.
- Do not remove slide links from articles or blog cards.
- Keep slide navigation crawl-safe where needed.

## Discussion/comments

The Discussion section must not harm SEO.

Rules:

- It must not break page rendering, metadata, article content, or hydration.
- It must not add intrusive scripts that block article content.
- It must have loading and fallback states.
- UGC/comment links should use `rel="ugc"` and may include `nofollow`.
- Sponsored or paid user links should be disallowed or marked `sponsored`.
- Prevent spammy UGC from becoming indexable content.
- Do not add fake comments, fake counts, or fake ratings.
- If a discussion provider fails, show a safe fallback and keep the article content indexable.

## Search appearance extras

Where supported by the project:

- Home page should include consistent site name signals:
  - `WebSite` structured data
  - `og:site_name`
  - consistent visible site name "CodersSecret"
- Home page should include favicon link tags.
- Favicon should be stable, square, representative, crawlable, and not blocked.
- Use Open Graph/Twitter metadata for share previews.
- Do not let social metadata conflict with page title/description/canonical.

## Verification commands

Use the repo's actual scripts. Inspect `package.json`, lockfiles, framework config, and existing docs.

Run applicable commands such as:

- `npm run lint`
- `npm run typecheck`
- `npm test`
- `npm run build`
- `npm run format:check`
- `npm run test:e2e`
- framework-specific route generation checks
- sitemap generation command
- local Lighthouse/PageSpeed check if available
- accessibility check if available
- broken-link check if available

Optional smoke checker included with this skill:

```bash
python .agents/skills/coderssecret-google-seo-guard/scripts/seo_smoke_check.py ./dist --site https://coderssecret.com
```

Use the actual output directory for the project, for example `dist`, `out`, `build`, or another static export folder.

This script is a local smoke check only. It does not replace Search Console, Rich Results Test, URL Inspection, Lighthouse, or human SEO review.

## Manual verification

Manually inspect rendered HTML for at least:

1. Home page.
2. `/blog`.
3. One long `/blog/[slug]` article.
4. One article with "Watch as Slides" if available.
5. One topic/category page if affected.
6. One slide page if affected.
7. 404/error page if routing changed.

Check:

- title
- meta description
- canonical
- robots meta
- H1
- headings
- article body
- internal links
- breadcrumbs
- Open Graph/Twitter metadata
- JSON-LD
- image alt text and representative image metadata
- sitemap inclusion/exclusion
- robots.txt
- HTTP status
- mobile rendering
- no console/hydration errors
- no content blocked by overlays
- no broken discussion behavior
- no broken TOC or anchor links

## Iterative repair loop

If any issue is found:

1. Fix it.
2. Re-run the most relevant automated checks.
3. Re-inspect affected pages.
4. Repeat until zero known issues remain.

Never report "done" when known SEO issues remain unless they are truly outside the task scope and explicitly documented as limitations.

## Final response format

When finished, report:

1. Summary of changes.
2. Files changed.
3. Routes/pages affected.
4. SEO protections verified:
   - title
   - meta description
   - canonical
   - robots
   - sitemap
   - structured data
   - crawlable links
   - content quality
   - mobile/page experience
5. Structured data added/changed/validated.
6. Google SEO guidance followed.
7. Commands run and results.
8. Remaining limitations, only if truly unavoidable.
