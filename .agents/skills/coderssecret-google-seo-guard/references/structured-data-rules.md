# Structured data rules

Structured data must be accurate, visible, complete, and useful.

## General rules

- Prefer JSON-LD.
- Place structured data on the page it describes.
- Use the most specific applicable type.
- Required fields must be real.
- Recommended fields should be added when real.
- Structured data must match visible content.
- Do not mark up hidden or fake content.
- Do not mislead users.
- Validate JSON-LD syntax.
- Do not block pages or schema-referenced images from Googlebot.
- Do not use structured data as a ranking hack.
- Rich results are never guaranteed.

## Site-wide

### WebSite

Use on the home page if supported.

Fields:

- `@context`
- `@type`: `WebSite`
- `name`: `CodersSecret`
- `url`: `https://coderssecret.com/`
- `alternateName` only if real
- `potentialAction` SearchAction only if the site has a working search feature

### Organization

Use only if the site has accurate organization information.

Fields should be real:

- name
- url
- logo
- sameAs links if real

Do not invent business details.

## BreadcrumbList

Use when visible breadcrumbs exist.

Rules:

- Breadcrumb schema must match visible breadcrumbs.
- Positions must be sequential.
- Item URLs must be canonical where possible.
- Last item may omit `item` if it represents current page.
- Do not include fake breadcrumb levels.

## Article / BlogPosting

Use for blog detail pages.

Required/important real data:

- headline
- description
- mainEntityOfPage
- datePublished if real
- dateModified if real
- author if real
- image if real and representative
- publisher if real and supported by project

Rules:

- Headline should match article title.
- Description should summarize visible content.
- Dates must be ISO and not fake.
- `dateModified` should update only for material changes.
- Image must be crawlable and representative.
- Do not add author if there is no real visible author.
- Do not add fake reading time to schema unless visible and meaningful.

## Course

Use only for real course list pages and real courses.

Rules:

- Do not mark ordinary blog posts as courses.
- Course name and description must be visible.
- Course provider must be real.
- Use course list schema for actual course lists.
- Use required properties from Google docs.
- Do not invent course details, pricing, ratings, or provider info.

## ItemList / Carousel

Use only for visible lists.

Examples:

- visible blog article list
- visible course list
- visible featured articles

Rules:

- Item order in schema must match visible order.
- URLs must be canonical.
- Do not include hidden items.
- Do not mark unrelated items.

## FAQPage

Use only if:

- the page has visible FAQ content
- questions and answers are original and useful
- answers are visible to users
- it is not created only for SEO

Do not create fake FAQ blocks.

## VideoObject

Use only if a real visible video exists.

Rules:

- Video must be relevant to page.
- thumbnail and content/embed URLs must be real and crawlable.
- Do not mark slide decks or static images as video unless there is actual video.

## Discussion / UGC

Do not use fake discussion schema.

If using discussion/forum/Q&A schema:

- comments/questions/answers must be visible
- authors and dates must be real
- spam must be moderated
- no fake counts
