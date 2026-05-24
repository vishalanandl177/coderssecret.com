# CodersSecret Agent Instructions

## SEO protection

For any task that touches public routes, pages, layouts, components, metadata, canonical URLs, schema, content, links, sitemap, robots.txt, redirects, performance, JavaScript rendering, blog pages, slide pages, course pages, topic pages, Discussion/comments, or navigation, use:

`$coderssecret-google-seo-guard`

If the task also touches UI/design, use both:

`$coderssecret-md3-ui-review`
`$coderssecret-google-seo-guard`

SEO is a release gate.

Done means:

- no accidental noindex or robots block
- title/meta/canonical are correct
- one H1 per page
- public content is crawlable
- important links use real `<a href>`
- sitemap is correct
- structured data is accurate and visible
- no fake schema, fake dates, fake authors, fake FAQs, or fake reviews
- no keyword stuffing or thin AI-generated content
- no broken article, slide, breadcrumb, TOC, related article, or Discussion behavior
- mobile and page experience remain strong
- relevant checks pass
- Codex has rechecked and fixed issues until zero known SEO issues remain
