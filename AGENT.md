# Agent Instructions

## Scope

This is the CodersSecret Angular learning site. Follow these instructions before editing code, content, SEO metadata, generated route behavior, or UI.

## First Steps

- Run `git status -sb` before making changes.
- Preserve unrelated local edits. Do not revert, restage, or reformat files outside the task scope.
- Read the relevant source files before editing.
- Keep changes focused and stage only intended files when asked to commit or push.

## Commands

Use `npm.cmd` in PowerShell.

- Install dependencies: `npm.cmd install`
- Production build, sitemap, and prerender output: `npm.cmd run build:prod`
- SEO validation: `npm.cmd run check:seo`
- Production build only: `npm.cmd run check:build`
- High-severity dependency audit: `npm.cmd run check:vulnerabilities`
- Full precommit check: `npm.cmd run precommit`

## Source Map

- Site shell and routes: `src/app/app.ts`, `src/app/app.routes.ts`
- SEO service: `src/app/services/seo.service.ts`
- Blog metadata: `src/app/models/blog-post.model.ts`
- Blog content: `src/app/models/blog-content/<slug>.ts`
- Blog rendering: `src/app/pages/blog-post/blog-post.ts`
- Course model and pages: `src/app/models/course.model.ts`, `src/app/pages/courses/...`
- Shared links: `src/app/shared/external-links.ts`
- Sitemap and prerender generation: `scripts/generate-sitemap.js`, `scripts/generate-routes.js`
- SEO checker: `scripts/check-seo.js`
- Crawler-visible output: `dist/coderssecret-app/browser/...`

## SEO And Content Work

- Treat generated HTML as the SEO deliverable, not only Angular source.
- Run `npm.cmd run build:prod` for SEO, route, course, blog, sitemap, prerender, homepage, performance, or accessibility changes.
- Run `npm.cmd run check:seo` after the production build.
- Inspect generated `dist/coderssecret-app/browser/.../index.html` files when titles, descriptions, canonical URLs, JSON-LD, visible content, or prerendered route output are affected.
- Do not manually edit generated sitemap or `dist` output unless the user explicitly asks for generated artifacts.
- Keep content practical, production-oriented, and learner-focused. Use simple English, specific claims, useful examples, and honest metadata.
- Verify unstable facts such as current versions, pricing, APIs, or product behavior against primary sources.

## UI And Accessibility Work

- Reuse existing Angular, Tailwind, and Spartan UI patterns.
- Prefer project tokens and semantic roles over one-off colors, font sizes, radii, or spacing.
- Check responsive behavior, keyboard access, focus states, alt text, and text overflow for visible UI changes.
- When available, use `coderssecret-md3-ui-review` for MD3-focused UI review and `coderssecret-content-seo-review` for learner-content and SEO review.

## Git And Artifacts

- Do not commit or push unless the user asks.
- Leave unrelated modified files alone.
- Do not stage `dist/`, `out/`, caches, or temporary build artifacts unless the task explicitly requires them.
