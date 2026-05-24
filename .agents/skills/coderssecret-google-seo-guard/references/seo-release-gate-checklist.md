# SEO release gate checklist

Use this checklist before finalizing any CodersSecret change.

## 1. Route and indexability

For every touched route:

- [ ] Is this page public and intended to be indexed?
- [ ] If yes, it must not have `noindex`.
- [ ] If no, it should have an intentional noindex/access-control strategy.
- [ ] It returns the correct HTTP status.
- [ ] It is included/excluded from sitemap correctly.
- [ ] It is not accidentally blocked in robots.txt.
- [ ] Its canonical target is correct.

## 2. Metadata

For every public indexable page:

- [ ] Unique title.
- [ ] Useful meta description.
- [ ] Absolute canonical URL.
- [ ] Exactly one H1.
- [ ] H1 matches the page topic.
- [ ] OG title/description/url/type if supported.
- [ ] Twitter metadata if supported.
- [ ] Favicon/site name not broken on home page.
- [ ] Robots meta is absent or index-friendly.

## 3. Content

- [ ] Main content is useful for learners.
- [ ] Content answers real user intent.
- [ ] Content is not generic, thin, or duplicated.
- [ ] No keyword stuffing.
- [ ] No hidden manipulative text/links.
- [ ] No fake author/date/rating/review/comment/source.
- [ ] AI-assisted content is human-edited, accurate, original, and useful.
- [ ] Technical claims are checked against trustworthy sources when needed.
- [ ] Internal links guide learners to related lessons/articles/slides.

## 4. Crawlability

- [ ] Main content is rendered in initial HTML when possible.
- [ ] Important links are real `<a href>` elements.
- [ ] JS hydration does not alter SEO-critical content incorrectly.
- [ ] Lazy-loaded content remains discoverable.
- [ ] CSS/JS needed for rendering is not blocked.
- [ ] Images intended for search/share previews are crawlable.

## 5. Structured data

- [ ] JSON-LD parses.
- [ ] Schema type matches the visible page.
- [ ] Required fields are present and real.
- [ ] Recommended fields are added only when real.
- [ ] No hidden/fake/misleading schema.
- [ ] Breadcrumb schema matches visible breadcrumbs.
- [ ] Article schema matches visible article metadata.
- [ ] Course schema is used only for real courses.
- [ ] FAQ schema is used only for visible FAQ content.
- [ ] Images in schema are crawlable and relevant.

## 6. URLs, redirects, and sitemap

- [ ] URLs are descriptive and stable.
- [ ] Slugs use hyphens.
- [ ] Existing URLs were not broken.
- [ ] Redirects exist for any renamed public URL.
- [ ] Sitemap contains only canonical public indexable URLs.
- [ ] `lastmod` is accurate if present.
- [ ] Query/filter/search pages are handled intentionally.

## 7. Page experience

- [ ] Mobile content matches desktop meaningfully.
- [ ] No intrusive interstitial blocks content.
- [ ] No new layout shift.
- [ ] Images have dimensions/aspect ratio.
- [ ] LCP is not worsened by heavy hero/media changes.
- [ ] INP is not worsened by heavy JS.
- [ ] Discussion/widgets do not block article content.
- [ ] Accessibility remains strong.

## 8. UGC/discussion

- [ ] Discussion does not crash or cause hydration errors.
- [ ] Loading/fallback state is safe.
- [ ] UGC links use `rel="ugc"` and possibly `nofollow`.
- [ ] No spammy UGC is made prominent/indexable.
- [ ] No fake comment counts or fake discussions.

## 9. Verification

- [ ] Build passes.
- [ ] Lint/typecheck/tests pass where applicable.
- [ ] SEO smoke check or equivalent inspection completed.
- [ ] At least one blog index and one blog detail page inspected.
- [ ] If schema changed, Rich Results Test should be used after deployment or manually validated locally.
- [ ] Search Console/URL Inspection tasks are noted if production verification is required.

## 10. Final decision

If any checkbox fails, fix it and re-check.

Do not call the task done until zero known SEO issues remain.
