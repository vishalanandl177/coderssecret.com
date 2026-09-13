# CodersSecret

[![Deploy to GitHub Pages](https://github.com/vishalanandl177/coderssecret.com/actions/workflows/deploy.yml/badge.svg)](https://github.com/vishalanandl177/coderssecret.com/actions/workflows/deploy.yml)

CodersSecret is a free, ad-free engineering learning platform created by [Vishal Anand](https://github.com/vishalanandl177). It combines practical guides, full courses, interactive labs, cheat sheets, glossary entries, architecture visuals, and narrated slides for engineers building secure production systems.

**Live site:** [coderssecret.com](https://coderssecret.com)

[Blog](https://coderssecret.com/blog) |
[Courses](https://coderssecret.com/courses) |
[Interactive labs](https://coderssecret.com/games) |
[Cheat sheets](https://coderssecret.com/cheatsheets) |
[Glossary](https://coderssecret.com/glossary) |
[Discussions](https://github.com/vishalanandl177/coderssecret.com/discussions)

## Table of contents

- [What is included](#what-is-included)
- [Technology stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Quick start](#quick-start)
- [Available commands](#available-commands)
- [Validation and release gate](#validation-and-release-gate)
- [Production build and prerendering](#production-build-and-prerendering)
- [Content authoring](#content-authoring)
- [Project structure](#project-structure)
- [Runtime integrations and privacy](#runtime-integrations-and-privacy)
- [Deployment](#deployment)
- [Forking or rebranding](#forking-or-rebranding)
- [Contributing](#contributing)
- [Troubleshooting](#troubleshooting)
- [Security](#security)
- [License and content reuse](#license-and-content-reuse)

## What is included

- Long-form engineering articles across security, AI, data, DevOps, backend systems, frontend engineering, Python, cloud infrastructure, and distributed systems.
- Multi-module courses covering SPIFFE/SPIRE, cloud-native security, production RAG, distributed systems, centralized authentication and authorization with Envoy, and analytics engineering with dbt.
- Scenario-based labs and games for Kubernetes security, Zero Trust, API defense, incident response, supply-chain security, Linux, AI infrastructure, and engineering problem solving.
- Production-oriented cheat sheets and a connected technical glossary.
- Narrated article and course slides with browser text-to-speech controls.
- Client-side blog metadata search across titles, excerpts, tags, categories, and authors, available with `Ctrl+K` or `Cmd+K`.
- Styled code blocks with copy-to-clipboard controls, article reading progress, generated tables of contents, social sharing, and Giscus discussions.
- Responsive Material Design 3 interfaces, light and dark themes, keyboard focus states, reduced-motion support, semantic landmarks, and a back-to-top control.
- Route-specific titles, descriptions, canonical URLs, robots directives, Open Graph and Twitter metadata, JSON-LD, sitemap generation, and crawler-visible static HTML.
- Web app manifest metadata and install icons. The site does not currently provide a service worker or offline cache.

The live registries are the source of truth for catalog totals:

- Articles and categories: [`src/app/models/blog-post.model.ts`](src/app/models/blog-post.model.ts)
- Article bodies: [`src/app/models/blog-content/`](src/app/models/blog-content/)
- Courses and modules: [`src/app/models/course.model.ts`](src/app/models/course.model.ts) and [`src/app/models/courses/`](src/app/models/courses/)
- Glossary entries: [`src/app/models/glossary.model.ts`](src/app/models/glossary.model.ts)
- Public routes: [`src/app/app.routes.ts`](src/app/app.routes.ts)

Counts are intentionally not duplicated in this README because they change whenever content is added. The live [blog](https://coderssecret.com/blog), [courses](https://coderssecret.com/courses), and source registries above are canonical.

## Technology stack

| Area | Technology |
| --- | --- |
| Application | Angular 21 standalone components, Signals, lazy routes, and view transitions |
| Language | TypeScript 5.9 in strict mode |
| Styling | Tailwind CSS 4, the Spartan Brain Tailwind preset, PostCSS, and custom Material Design 3 tokens/components |
| Testing | Angular unit-test builder, Vitest 4, and jsdom |
| Build | Angular application builder plus custom Node.js sitemap, banner, prerender, and SEO scripts |
| Static prerender | Headless Chrome, Chromium, or Edge rendering the built Angular UI |
| Analytics | Google Analytics 4 events and cumulative layout shift (CLS) monitoring |
| Discussions | Giscus backed by GitHub Discussions |
| Hosting | GitHub Pages deployed by GitHub Actions |

This repository is a static client application. It does not contain an application server, database, user-account system, payment flow, or npm package for publication. [`package.json`](package.json) marks the application as private.

## Prerequisites

- [Git](https://git-scm.com/)
- Node.js **22.12 or newer in the Node 22 line**, matching the GitHub Actions build environment
- npm **10.9.7**, as declared by the repository's `packageManager` field
- Google Chrome, Chromium, or Microsoft Edge for the full production prerender

The Angular dependencies may run on additional Node.js versions, but Node 22 is the repository and CI baseline.

No `.env` file is required for local development or production builds. The repository ignores `.env` and `.env.*`, and it does not load them at runtime.

## Quick start

```bash
git clone https://github.com/vishalanandl177/coderssecret.com.git
cd coderssecret.com
npm ci
npm start
```

Open [http://localhost:4200](http://localhost:4200).

Use `npm ci` for a clean, reproducible install from `package-lock.json`. Use `npm install` only when intentionally adding, removing, or updating dependencies, and commit the resulting lockfile change with `package.json`.

For exact npm-version parity without changing a global npm installation:

```bash
npx --yes npm@10.9.7 ci
```

### Windows PowerShell

If PowerShell blocks the `npm.ps1` or `npx.ps1` shim, use `npm.cmd` or `npx.cmd`:

```powershell
npm.cmd ci
npm.cmd start
npx.cmd --yes npm@10.9.7 --version
```

The remaining examples use `npm`; the equivalent PowerShell form is `npm.cmd`.

## Available commands

| Command | Purpose |
| --- | --- |
| `npm start` | Start the Angular development server at `http://localhost:4200` |
| `npm run build` | Build the Angular application using the default production configuration; does not generate the sitemap or static routes |
| `npm run watch` | Rebuild the development configuration when source files change |
| `npm test` | Run unit tests through Angular's Vitest-based test builder; may watch in an interactive terminal |
| `npm test -- --watch=false` | Run the unit test suite once, which is the recommended validation form |
| `npm run check:build` | Run only the Angular production compilation |
| `npm run build:prod` | Build Angular, generate sitemap files, prerender routes, and validate generated SEO output |
| `npm run check:vulnerabilities` | Fail on high or critical vulnerabilities in production dependencies; dev dependencies are omitted |
| `npm run check:seo` | Validate source SEO, route, metadata, content, workflow, and available generated-output rules |
| `npm run check:generated-seo` | Validate the existing generated site in `dist`; run `build:prod` first |
| `npm run check:ai-punctuation` | Reject em-dash characters or entities in repository source and generated text |
| `npm run check:analytics-examples` | Check unique lesson examples and execute the published SQL fixtures |
| `npm run generate:course-directory` | Refresh the lightweight lesson directory after course titles or slugs change |
| `npm run precommit` | Run the production dependency audit, asset and example checks, unit tests, production build, performance, SEO, internal-link, and punctuation checks |

`npm run precommit` is the authoritative local release gate and includes unit tests. Enable the versioned Git hook once per clone to run the same gate before every commit:

```bash
git config core.hooksPath .githooks
```

## Validation and release gate

Before opening a pull request or pushing a public-site change, run:

```bash
npm test -- --watch=false
npm run precommit
git diff --check
git diff --cached --check
```

For changes to routes, articles, courses, metadata, structured data, internal links, sitemap behavior, or crawler-visible content, also inspect the relevant generated HTML under:

```text
dist/coderssecret-app/browser/
```

At minimum, confirm:

- The canonical URL uses `https://coderssecret.com` with no trailing slash.
- The page has exactly one visible `h1`.
- Public pages are not accidentally marked `noindex`.
- Slides remain `noindex` and are excluded from the sitemap.
- Title, description, Open Graph, Twitter, and JSON-LD values match visible content.
- Important internal links are real anchors and resolve to generated routes.
- The page is present in `sitemap.xml` when it should be indexed.
- The generated page contains useful visible content without relying on JavaScript alone.

Do not edit `dist/`, generated sitemap files, route aliases, or `_redirects` by hand. They are ignored build artifacts and are recreated by the production pipeline.

## Production build and prerendering

`npm run build:prod` performs these steps in order:

1. Compile the Angular application with the production configuration.
2. Generate `sitemap.xml` and `sitemap_index.xml` from source registries and public route definitions.
3. Launch a temporary local static server.
4. Render each route through headless Chrome, Chromium, or Edge using the built Angular UI.
5. Write crawler-visible route HTML, extensionless aliases, a `_redirects` artifact for compatible static hosts, and the final `404.html`.
6. Validate the generated sitemap, robots rules, canonicals, metadata, JSON-LD, internal links, and route files.

The deployable output is:

```text
dist/coderssecret-app/browser/
```

GitHub Pages does not apply `_redirects`; the Pages deployment relies on the generated route files, extensionless aliases, canonical metadata, and `404.html`. The `_redirects` artifact is available only for static hosts that support that format.

A generated route normally has both forms:

```text
dist/coderssecret-app/browser/blog/<slug>/index.html
dist/coderssecret-app/browser/blog/<slug>.html
```

### Prerender configuration

The full build automatically looks for common Chrome, Chromium, and Edge locations. These optional shell environment variables are supported:

| Variable | Default | Purpose |
| --- | --- | --- |
| `CHROME_BIN` | Auto-detected | Explicit browser executable path or command |
| `PUPPETEER_EXECUTABLE_PATH` | Auto-detected | Alternate explicit browser executable path |
| `CODERSSECRET_PRERENDER_SOURCE` | Hydrated Angular UI | Set to `manual` only for an emergency non-UI fallback build; do not use it for a release |
| `CODERSSECRET_PRERENDER_PORT` | `43000 + process ID modulo 1000` | Temporary local prerender server port |
| `CODERSSECRET_PRERENDER_BUDGET_MS` | `1800` | First render's browser virtual-time budget |
| `CODERSSECRET_PRERENDER_RETRY_BUDGET_MS` | `5000` | Retry render's virtual-time budget |
| `CODERSSECRET_PRERENDER_TIMEOUT_MS` | `60000` | First render process timeout |
| `CODERSSECRET_PRERENDER_RETRY_TIMEOUT_MS` | `120000` | Retry render process timeout |
| `CODERSSECRET_PRERENDER_WINDOW` | `1365,900` | Headless browser window size |
| `CODERSSECRET_PRERENDER_ALLOW_NETWORK` | External network blocked | Set to `1` only when external network access is intentionally required during prerender |

Bash example:

```bash
CHROME_BIN=/usr/bin/google-chrome npm run build:prod
```

PowerShell example:

```powershell
$env:CHROME_BIN = 'C:\Program Files\Google\Chrome\Application\chrome.exe'
npm.cmd run build:prod
```

## Content authoring

### Add or update a blog article

1. Add or update article metadata in [`src/app/models/blog-post.model.ts`](src/app/models/blog-post.model.ts).
2. Add the article body at `src/app/models/blog-content/<slug>.ts`.
3. Export the body as `CONTENT`, and keep the filename exactly equal to the metadata slug:

   ```ts
   export const CONTENT = `
     <p>Article introduction.</p>
     <h2>First section</h2>
     <p>Section content.</p>
   `;
   ```

4. Keep the metadata slug, content filename, canonical route, internal links, and banner filename aligned.
5. Do not add another article `h1`; the blog page template owns the single page heading.
6. Escape backticks and `${...}` sequences that must appear literally inside the TypeScript template string.
7. Use real publication dates, authorship, claims, links, and structured data. Do not add invented FAQs, reviews, metrics, dates, or credentials.
8. Generate or refresh deterministic fallback banners when needed:

   ```bash
   node scripts/generate-banners.js
   ```

   This writes `public/images/banners/<slug>.svg`, regenerates script-owned banners, and preserves recognized custom banner files.

9. Run the complete validation gate and inspect:

   ```text
   dist/coderssecret-app/browser/blog/<slug>.html
   ```

The blog route dynamically imports the matching content module, so a normal article does not need a new route entry.

### Add or update a course

- Course interfaces live in [`src/app/models/course.model.ts`](src/app/models/course.model.ts); runtime loading is mapped in [`src/app/models/course-loader.ts`](src/app/models/course-loader.ts).
- Full course definitions and the build-only `COURSES` registry live under [`src/app/models/courses/`](src/app/models/courses/), with compact landing-page data under `courses/outlines/`.
- Add a primary course route before the generic `courses/:seoSlug` route in [`src/app/app.routes.ts`](src/app/app.routes.ts), and confirm module and slide routes for the course slug.
- The sitemap and route generators load the exported `COURSES` registry, including local course-module imports.
- Update the manually maintained course summary copy and totals in [`src/app/pages/home/home.ts`](src/app/pages/home/home.ts) whenever courses, modules, labs, or inline exercises change. Recalculate from the live course registry rather than copying an older total.
- Validate the course landing page, every module, module slides, SEO landing pages, breadcrumbs, internal links, structured data, and sitemap entries.

### Add another public route

Routes for games, cheat sheets, legal pages, slides, and other page types are not all registry-driven. When adding one:

1. Add the lazy route to [`src/app/app.routes.ts`](src/app/app.routes.ts).
2. Add accurate page metadata through [`src/app/services/seo.service.ts`](src/app/services/seo.service.ts).
3. Update [`scripts/generate-sitemap.js`](scripts/generate-sitemap.js) if the page should be indexed and is not data-driven.
4. Update [`scripts/generate-routes.js`](scripts/generate-routes.js) so the route receives meaningful static HTML.
5. Add a real internal link from an appropriate public page.
6. Run the full release gate and inspect the generated route.

### Maintenance-script safety

| Script | Notes |
| --- | --- |
| `node scripts/generate-banners.js` | Normal content utility; creates deterministic article SVG banners and preserves custom banners |
| `node scripts/generate-og-image.js` | Overwrites `public/og-image.svg`; run only when intentionally replacing the site-wide fallback image and review the result |
| `node scripts/split-blog-posts.js` | Legacy destructive migration utility; rewrites the blog metadata model and content modules, so do not run it during normal authoring |
| `powershell -File scripts/generate-podcast-art.ps1` | Optional Windows podcast-art generator; writes local files under `out/podcasts/art`, which must be kept out of commits unless they are intentionally requested |

## Project structure

```text
.
|-- .github/workflows/
|   `-- deploy.yml                 # GitHub Pages build and deployment
|-- branding/                      # YouTube and other brand assets
|-- public/
|   |-- CNAME                      # Production custom domain
|   |-- images/                    # Blog banners and supporting images
|   |-- assets/                    # Article diagrams and static resources
|   |-- manifest.json              # Web app metadata
|   |-- robots.txt                 # Crawler rules and sitemap links
|   `-- 404.html                   # Source fallback copied before final generation
|-- scripts/
|   |-- generate-banners.js        # Deterministic article banners
|   |-- generate-sitemap.js        # Sitemap and sitemap-index generation
|   |-- generate-routes.js         # Browser-backed static route generation
|   |-- validate-generated-seo.js  # Generated artifact validation
|   |-- check-seo.js               # Source and SEO quality checks
|   `-- check-ai-punctuation.js    # Repository punctuation guard
|-- src/
|   |-- app/
|   |   |-- components/            # Header, footer, search, and slide player
|   |   |-- models/
|   |   |   |-- blog-content/      # One TypeScript content module per article
|   |   |   |-- courses/           # Separated course definitions
|   |   |   |-- blog-post.model.ts # Article metadata registry
|   |   |   |-- course.model.ts    # Course interfaces
|   |   |   |-- course-loader.ts   # Route-level full course and outline loaders
|   |   |   `-- glossary.model.ts  # Glossary registry
|   |   |-- pages/
|   |   |   |-- blog-list/         # Article catalog and filters
|   |   |   |-- blog-post/         # Article renderer, TOC, sharing, and comments
|   |   |   |-- courses/           # Course hub, landing, modules, and slides
|   |   |   |-- games/             # Interactive engineering labs
|   |   |   |-- cheatsheets/       # Reference sheets
|   |   |   |-- glossary/          # Glossary hub and term pages
|   |   |   `-- slides/            # Article slide routes
|   |   |-- services/              # SEO and analytics services
|   |   |-- shared/                # MD3 primitives, brand, links, and TOC logic
|   |   |-- app.routes.ts          # Public Angular route map
|   |   `-- app.ts                 # Application shell and route behavior
|   |-- index.html                 # Base metadata and root document
|   `-- styles.css                 # Tailwind import, MD3 tokens, and global styles
|-- angular.json                   # Angular build, serve, test, assets, and budgets
|-- package.json                   # Scripts and dependency manifest
|-- package-lock.json              # Reproducible npm dependency graph
`-- README.md
```

Generated output under `dist/`, Angular cache data, `node_modules/`, local `.env*` files, and files under `out/` are not source files.

## Runtime integrations and privacy

- Google Analytics 4 events and cumulative layout shift (CLS) monitoring are configured in [`src/app/services/analytics.service.ts`](src/app/services/analytics.service.ts).
- Giscus repository and category identifiers are configured in [`src/app/pages/blog-post/blog-post.ts`](src/app/pages/blog-post/blog-post.ts).
- Shared public destinations are centralized in [`src/app/shared/external-links.ts`](src/app/shared/external-links.ts).
- Browser storage is used for the `theme`, `slides.voice`, and `slides.rate` preferences.

There is currently no environment-specific analytics or Giscus configuration. A local development session can attempt to load the production integrations when network access is available. Use browser blocking or an isolated network when local analytics traffic is not wanted.

See the public policies for the user-facing behavior:

- [Privacy Policy](https://coderssecret.com/privacy)
- [Cookie Policy](https://coderssecret.com/cookies)
- [Terms of Service](https://coderssecret.com/terms)

## Deployment

[`deploy.yml`](.github/workflows/deploy.yml) runs on:

- A push to `main`
- A manual `workflow_dispatch`

The workflow:

1. Checks out the repository.
2. Sets up Node.js 22 with npm caching.
3. Runs `npm ci`.
4. Runs unit tests, the production dependency audit, course asset checks, and analytics example checks.
5. Generates article banners and builds Angular in production mode.
6. Checks performance budgets, generates the sitemap, and checks internal content links.
7. Generates prerendered static routes and validates generated SEO, source SEO, and punctuation.
8. Uploads `dist/coderssecret-app/browser` as the Pages artifact.
9. Deploys the artifact to GitHub Pages.

The workflow has `contents: read`, `pages: write`, and `id-token: write` permissions. It runs the release checks as separate steps so failures are visible before deployment. Run the local validation sequence before merging or pushing to `main` as well.

The production custom domain is stored in [`public/CNAME`](public/CNAME). DNS records and GitHub Pages repository settings are external to this repository.

## Forking or rebranding

Before deploying a fork, review and replace every production-specific value:

- `public/CNAME`
- The `https://coderssecret.com` canonical host in the SEO service, sitemap generator, route generator, generated-output validator, static files, and public content
- Google Analytics measurement ID
- Giscus repository, repository ID, category, and category ID
- Shared GitHub, YouTube, Spotify, social, and support links
- Brand names, logos, icons, Open Graph images, manifest data, and legal policies
- GitHub Pages environment settings and DNS records

Use a repository-wide search before release:

```bash
git grep -n -E "coderssecret[.]com|vishalanandl177|G-[A-Z0-9]+|giscus|github[.]com" -- src public scripts .github README.md
```

Removing or replacing only `CNAME` is not sufficient because canonical URLs and validators intentionally enforce the production host.

## Contributing

There is no separate `CONTRIBUTING.md`, contributor agreement, or open-source license. Outside code and content contributions are therefore not currently documented as accepted. Use an [issue](https://github.com/vishalanandl177/coderssecret.com/issues) or [discussion](https://github.com/vishalanandl177/coderssecret.com/discussions) to propose substantial work without submitting implementation first. The repository owner must clarify contribution and licensing terms before accepting outside work.

For a maintainer change or another change explicitly authorized by the repository owner:

1. Create a focused branch from the current `main`.
2. Keep unrelated files and generated artifacts out of the change.
3. Follow the existing Angular, TypeScript, Tailwind, Material Design 3, content, and accessibility patterns.
4. Preserve truthful metadata and crawler-visible content.
5. Add or update tests when behavior changes.
6. Run `npm test -- --watch=false`, `npm run precommit`, `git diff --check`, and `git diff --cached --check`.
7. Review the final diff, stage only the intended files, and create a focused commit.
8. Push the authorized branch and open a pull request to `main` with the user-visible impact and validation evidence.

Merging or pushing to `main` deploys production, so treat content, metadata, routes, workflow files, and build scripts as production code.

## Troubleshooting

### The production build cannot find a browser

Install Chrome, Chromium, or Edge, or point `CHROME_BIN` to the executable. Do not use `CODERSSECRET_PRERENDER_SOURCE=manual` for a release because it bypasses the exact UI-backed prerender source.

### `npm ci` reports that the lockfile is out of sync

If dependency metadata was intentionally changed, regenerate the lockfile with the declared npm version:

```bash
npx --yes npm@10.9.7 install --package-lock-only
npx --yes npm@10.9.7 ci
```

Review both `package.json` and `package-lock.json`, then run the complete release gate. Do not regenerate the lockfile to hide an unrelated build failure.

### `check:generated-seo` says build output is missing

It validates existing files under `dist/coderssecret-app/browser`; run:

```bash
npm run build:prod
```

### The prerender port is already in use

Set a free local port with `CODERSSECRET_PRERENDER_PORT` and rerun the build.

### PowerShell will not run `npm`

Use the Windows executable shims:

```powershell
npm.cmd run precommit
npx.cmd --yes npm@10.9.7 ci
```

## Security

Run `npm run check:vulnerabilities` for high and critical findings in production dependencies. This check omits development dependencies and is not a substitute for broader dependency, workflow, or application security review.

Non-sensitive bugs can be reported through [GitHub Issues](https://github.com/vishalanandl177/coderssecret.com/issues). This repository does not currently define a private vulnerability-reporting address or a `SECURITY.md`. Do not publish credentials, personal data, or exploitable vulnerability details in a public issue. A dedicated private reporting channel must be configured by the repository owner before it can be documented here.

## License and content reuse

This repository does not contain a `LICENSE` file and does not grant an open-source license for the repository code.

CodersSecret articles, diagrams, course material, page design, and original explanations remain owned by CodersSecret or their author unless a specific file says otherwise. Short excerpts with attribution and links are permitted, and small code snippets in articles may be reusable unless the page states otherwise. Full republication and other reuse are governed by the [CodersSecret Terms of Service](https://coderssecret.com/terms).

Third-party product names, logos, trademarks, examples, and linked code remain subject to their respective owners and licenses.
