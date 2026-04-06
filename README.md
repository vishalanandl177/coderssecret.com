# CodersSecret

> Battle-tested guides on Python, DevOps, APIs, and system design — written by engineers, for engineers who ship.

**[coderssecret.com](https://coderssecret.com)**

## About

CodersSecret is a modern developer blog built with Angular 21, Tailwind CSS 4, and Spartan UI. It features in-depth technical tutorials on backend engineering, DevOps, security, and system design — with interactive diagrams, code examples, and practical walkthroughs.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Angular 21 (Standalone components, Signals) |
| **Styling** | Tailwind CSS 4 + Spartan UI |
| **Language** | TypeScript 5.9 (strict mode) |
| **Testing** | Vitest 4 + jsdom |
| **Build** | Angular CLI + PostCSS |
| **Hosting** | GitHub Pages (auto-deployed via GitHub Actions) |
| **Analytics** | Google Analytics 4 |

## Features

- **18+ in-depth blog posts** with interactive diagrams
- **Dynamic SEO** — per-page titles, meta descriptions, Open Graph, Twitter Cards, JSON-LD structured data
- **Interactive diagrams** — sequence flows, comparison cards, bar charts, pipeline animations, decision trees, layer diagrams
- **Syntax highlighted code blocks** with copy-to-clipboard button
- **Dark/Light theme** toggle with system preference detection
- **Reading progress bar** on blog posts
- **Table of contents** (auto-generated from headings)
- **Share buttons** (X/Twitter, LinkedIn, copy link)
- **Full-text search** with keyboard shortcut (Ctrl+K)
- **Responsive design** — mobile-first with category filters
- **PWA ready** — manifest.json, icons, apple-touch-icon
- **SEO optimized** — robots.txt, auto-generated sitemap.xml, canonical URLs, breadcrumbs
- **Back-to-top button** and skip-to-content link (accessibility)
- **Pagination** with "Load more" on blog list

## Blog Posts

| # | Title | Category |
|---|-------|----------|
| 1 | Apache Thrift: Cross-Language RPC Made Simple | Backend |
| 2 | gRPC: The High-Performance RPC Framework | Backend |
| 3 | Apache Arrow: The Universal Columnar Format | Backend |
| 4 | MCP Servers: The Universal Plugin System for AI Agents | Tutorials |
| 5 | Ethical Hacking for Beginners: A Hands-On Tutorial | Tutorials |
| 6 | Angular 21: Why It Wins for Large-Scale Applications | Frontend |
| 7 | Python C Extensions Workshop | Tutorials |
| 8 | SCIM: Automate User Provisioning Across SaaS Apps | Tutorials |
| 9 | Headless APIs vs Programmatic APIs | Backend |
| 10 | Kubernetes Operators: Build Your Own with Golang | DevOps |
| 11 | Improving Python Code Performance | Backend |
| 12 | M2M Authentication: Service-to-Service Communication | Backend |
| 13 | SSO Demystified: SAML and OIDC Practical Guide | Backend |
| 14 | Cron Jobs: The Complete Guide with Real-World Examples | DevOps |
| 15 | DRF API Logger: Effortless API Logging for Django | Open Source |

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm start
# Open http://localhost:4200

# Production build
npm run build:prod

# Run tests
npm test

# Run SEO checks
npm run check:seo
```

## Project Structure

```
src/
  app/
    components/       # Reusable UI (header, footer, search)
    pages/            # Route pages (home, blog-list, blog-post, category, not-found)
    models/           # Blog post data and interfaces
    services/         # SEO service, Analytics service
  styles.css          # Global styles + interactive diagram CSS
  index.html          # Root HTML with meta tags
public/               # Static assets (favicons, manifest, robots.txt, OG image)
scripts/              # Build scripts (sitemap generator, SEO checker, OG image)
.github/workflows/    # GitHub Actions (auto-deploy to GitHub Pages)
```

## Deployment

Pushes to `main` automatically trigger the GitHub Actions workflow which:
1. Installs dependencies
2. Builds the Angular app (production mode)
3. Generates `sitemap.xml`
4. Deploys to GitHub Pages

## License

All rights reserved. Content and code are property of CodersSecret.

---

Built with Angular 21 + Tailwind CSS 4 | Deployed on GitHub Pages
