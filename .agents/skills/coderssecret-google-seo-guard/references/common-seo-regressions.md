# Common SEO regressions to avoid

## Metadata regressions

- Replacing page-specific titles with one global title.
- Removing meta descriptions during layout refactor.
- Duplicating the same description across all articles.
- Moving metadata generation to client-only code.
- Creating conflicting canonical tags.
- Leaving canonical URLs relative.
- Using localhost/staging URLs in production canonicals.
- Accidentally adding `noindex`.

## Routing regressions

- Renaming slugs without redirects.
- Breaking `/blog/[slug]`.
- Removing `/blog`.
- Breaking slide routes.
- Returning `200` for missing pages.
- Redirecting all unknown routes to home.
- Changing trailing slash behavior without canonical/redirect consistency.

## Link regressions

- Turning article cards into `div onClick` without `<a href>`.
- Removing breadcrumb links.
- Breaking "Watch as Slides" links.
- Removing related article links.
- Using vague anchor text everywhere.
- Adding nofollow to normal internal links.
- Adding unqualified UGC/sponsored links.

## Content regressions

- Adding generic AI-like intros.
- Expanding content with filler.
- Creating thin topic pages.
- Creating many duplicate pages for keyword variants.
- Removing examples/checklists/code that made content useful.
- Hiding content on mobile.
- Using fake dates to appear fresh.

## Schema regressions

- Invalid JSON-LD.
- Fake FAQ schema.
- Fake author/date.
- Schema doesn't match visible content.
- Article image blocked or irrelevant.
- Breadcrumb schema doesn't match visible breadcrumb.
- Course schema added to non-course pages.
- ItemList includes hidden items.

## Rendering regressions

- Primary article content rendered only in browser.
- Hydration errors remove content.
- Lazy-loading article body.
- Blocking CSS/JS Google needs.
- Infinite scroll without crawlable pagination/links.
- Client-side redirects that confuse crawlers.

## Performance/page experience regressions

- Heavy animation/transition delaying content.
- LCP hero image lazy-loaded.
- Image dimensions removed causing CLS.
- Discussion script blocks article rendering.
- Intrusive newsletter or signup modal blocks content.
- Mobile menu overlays content permanently.
- Sticky elements overlap headings/TOC/content.
