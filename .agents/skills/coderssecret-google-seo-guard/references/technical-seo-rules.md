# Technical SEO rules

## Rendering

- Prefer SSR/static rendering for all SEO-critical content.
- Emit metadata in HTML, not only after hydration.
- Emit canonical links in HTML source whenever possible.
- Do not rely on client-side route transitions to create SEO-critical links or article body.
- Avoid hydration mismatch.
- Do not hide content behind login/client-only providers unless intentionally private.

## HTML essentials

Every public indexable page:

- `<html lang="en">` or appropriate language.
- `<meta name="viewport">`.
- Unique `<title>`.
- Useful `<meta name="description">`.
- One `<link rel="canonical" href="https://coderssecret.com/...">`.
- One visible H1.
- Logical headings.
- Crawlable anchor links.
- Accessible images.
- Valid JSON-LD if schema is used.

## Status codes

- Public pages: `200`.
- Permanent moved pages: `301` or permanent framework equivalent.
- Temporary moved pages: temporary redirect only when truly temporary.
- Deleted pages with no replacement: `404` or `410`.
- Private/auth-only pages: not public, usually noindex or auth-protected.
- Error page must not return `200` for missing content.

## robots.txt

Allowed:

- Manage crawler traffic.
- Block unimportant resources only if blocking them does not prevent understanding pages.
- Point to sitemap.

Not allowed:

- Do not use robots.txt to hide web pages from Google results.
- Do not block public pages that need indexing.
- Do not block CSS/JS required to render/understand content.
- Do not block favicon/image files that should appear in search.

## noindex

Use `noindex` for:

- admin
- preview
- draft
- internal search result pages if thin/duplicative
- test pages
- duplicate pages intentionally excluded
- private pages

Do not use `noindex` on:

- home
- `/blog`
- public article pages
- public slide pages unless intentionally excluded
- public course pages
- public topic pages with unique value

If a page is blocked by robots.txt, Google may not see its noindex. Allow crawl if Google must see noindex.

## Canonical

- One canonical per page.
- Absolute URL.
- HTTPS.
- Stable.
- Self-canonical for canonical pages.
- Duplicate variants canonicalize to primary.
- Sitemap should list canonical URLs only.
- Do not add conflicting canonical signals.
- Do not set canonical to a page with substantially different content.

## JavaScript

- Real links: `<a href>`.
- Avoid JS-only navigation for important pages.
- Metadata/head should update correctly in client-side routing.
- Lazy loaded content should be loaded when visible and not require unsupported interactions.
- Do not block Googlebot from resources needed to render.
- Avoid client-side canonical mutation when server/static rendering can do it.

## Performance

- Use transform/opacity for animation; avoid layout shift.
- Keep route transitions from delaying content.
- Avoid heavy client JS on article pages.
- Keep Discussion/comments async and non-blocking.
- Avoid loading third-party scripts before content unless required.
- Add image width/height or aspect-ratio.
- Do not lazy-load the main LCP asset if it harms loading.
- Keep code blocks/tables from causing horizontal page layout overflow.

## Mobile-first

- Mobile page must include same primary content as desktop.
- Metadata and structured data should be the same.
- Images/videos should be accessible and crawlable.
- Navigation and internal links must remain accessible.
- Do not hide key learning sections on mobile.
