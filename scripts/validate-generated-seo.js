/**
 * Validate crawler-visible generated output after the production build.
 *
 * This is intentionally filesystem-based: GitHub Pages serves the files in
 * dist/coderssecret-app/browser, so sitemap URLs, canonical tags, and local
 * static route files must agree before deployment.
 */

const fs = require('fs');
const path = require('path');

const SITE_URL = 'https://coderssecret.com';
const DIST_DIR = path.join(__dirname, '..', 'dist', 'coderssecret-app', 'browser');
const SITEMAP_PATH = path.join(DIST_DIR, 'sitemap.xml');
const ROBOTS_PATH = path.join(DIST_DIR, 'robots.txt');

const REQUIRED_URLS = [
  SITE_URL,
  `${SITE_URL}/blog`,
  `${SITE_URL}/blog/angular-state-management-ngrx-signals-services`,
  `${SITE_URL}/blog/are-dags-dying-declarative-data-pipelines`,
  `${SITE_URL}/blog/caching-strategies-production-guide`,
  `${SITE_URL}/blog/cap-theorem-distributed-systems-explained`,
  `${SITE_URL}/blog/celery-task-queues-django-workflows-guide`,
  `${SITE_URL}/blog/contributing-open-source-first-pull-request`,
  `${SITE_URL}/blog/css-grid-flexbox-mastery-responsive-layouts`,
  `${SITE_URL}/blog/database-connection-pooling-pgbouncer-guide`,
  `${SITE_URL}/blog/distributed-systems-algorithms-production-guide`,
  `${SITE_URL}/blog/fine-tuning-vs-rag-vs-prompt-engineering`,
  `${SITE_URL}/blog/linux-commands-developer-debugging-guide`,
  `${SITE_URL}/blog/m2m-authentication-golang-m2mauth-library`,
  `${SITE_URL}/blog/mcp-security-production-ai-agents-oauth-gateways`,
  `${SITE_URL}/blog/mcp-servers-ai-agents-tutorial`,
  `${SITE_URL}/blog/micro-frontends-module-federation-guide`,
  `${SITE_URL}/blog/monorepo-vs-polyrepo-codebase-structure`,
  `${SITE_URL}/blog/mtls-x509-certificates-python-tutorial`,
  `${SITE_URL}/blog/oauth2-openid-connect-developer-guide`,
  `${SITE_URL}/blog/python-concurrency-threads-async-multiprocessing`,
  `${SITE_URL}/blog/regex-demystified-practical-patterns-guide`,
  `${SITE_URL}/blog/scheduling-systems-production-guide`,
  `${SITE_URL}/blog/sql-window-functions-rank-lag-running-totals`,
  `${SITE_URL}/blog/terraform-infrastructure-as-code-production-guide`,
  `${SITE_URL}/blog/vector-databases-embeddings-similarity-search`,
  `${SITE_URL}/category/frontend`,
  `${SITE_URL}/category/open-source`,
  `${SITE_URL}/cheatsheets`,
  `${SITE_URL}/glossary/opa`,
  `${SITE_URL}/courses/cloud-native-security-engineering`,
  `${SITE_URL}/courses/data-lineage-dbt-course`,
  `${SITE_URL}/courses/dbt-course-beginner`,
  `${SITE_URL}/courses/dbt-data-quality-testing-course`,
  `${SITE_URL}/courses/distributed-systems-engineering-explained`,
  `${SITE_URL}/courses/distributed-systems-engineering/distributed-security-zero-trust`,
  `${SITE_URL}/courses/distributed-systems-engineering/foundations-distributed-systems`,
  `${SITE_URL}/courses/distributed-systems-engineering/observability-debugging`,
  `${SITE_URL}/courses/how-distributed-systems-work`,
  `${SITE_URL}/courses/metrics-layer-course`,
  `${SITE_URL}/courses/production-rag-systems-engineering`,
  `${SITE_URL}/courses/production-rag-systems-engineering/production-rag-architecture`,
  `${SITE_URL}/courses/semantic-layer-course`,
  `${SITE_URL}/slides/are-dags-dying-declarative-data-pipelines`,
  `${SITE_URL}/slides/caching-strategies-production-guide`,
  `${SITE_URL}/slides/celery-task-queues-django-workflows-guide`,
  `${SITE_URL}/slides/cloud-iam-aws-gcp-azure-compared`,
  `${SITE_URL}/slides/contributing-open-source-first-pull-request`,
  `${SITE_URL}/slides/css-grid-flexbox-mastery-responsive-layouts`,
  `${SITE_URL}/slides/database-connection-pooling-pgbouncer-guide`,
  `${SITE_URL}/slides/design-patterns-strategy-observer-factory-guide`,
  `${SITE_URL}/slides/event-driven-architecture-kafka-cqrs-guide`,
  `${SITE_URL}/slides/fine-tuning-vs-rag-vs-prompt-engineering`,
  `${SITE_URL}/slides/github-actions-ci-cd-pipelines-mastery`,
  `${SITE_URL}/slides/kubernetes-debugging-toolkit-kubectl-guide`,
  `${SITE_URL}/slides/linux-commands-developer-debugging-guide`,
  `${SITE_URL}/slides/mcp-security-production-ai-agents-oauth-gateways`,
  `${SITE_URL}/slides/micro-frontends-module-federation-guide`,
  `${SITE_URL}/slides/monorepo-vs-polyrepo-codebase-structure`,
  `${SITE_URL}/slides/oauth2-openid-connect-developer-guide`,
  `${SITE_URL}/slides/observability-opentelemetry-logs-metrics-traces`,
  `${SITE_URL}/slides/python-concurrency-threads-async-multiprocessing`,
  `${SITE_URL}/slides/rate-limiting-algorithms-production-guide`,
  `${SITE_URL}/slides/regex-demystified-practical-patterns-guide`,
  `${SITE_URL}/slides/sql-window-functions-rank-lag-running-totals`,
  `${SITE_URL}/slides/vector-databases-embeddings-similarity-search`,
  `${SITE_URL}/slides/web-authentication-passkeys-passwordless-login`,
];

const DISALLOWED_PATH_SEGMENTS = [
  '/admin',
  '/api',
  '/draft',
  '/preview',
  '/search?',
];

const ASSET_EXTENSIONS = new Set([
  '.avif',
  '.css',
  '.gif',
  '.ico',
  '.jpg',
  '.jpeg',
  '.js',
  '.json',
  '.map',
  '.png',
  '.svg',
  '.webmanifest',
  '.webp',
  '.woff',
  '.woff2',
  '.xml',
]);

const errors = [];
const warnings = [];

function fail(message) {
  errors.push(message);
}

function warn(message) {
  warnings.push(message);
}

function read(filePath) {
  return fs.readFileSync(filePath, 'utf-8');
}

function isCanonicalSiteUrl(url) {
  return url === SITE_URL || url.startsWith(`${SITE_URL}/`);
}

function hasTrailingSlashUrl(url) {
  return url === `${SITE_URL}/` || /^https:\/\/coderssecret\.com\/.+\/$/.test(url);
}

function hasUppercasePath(url) {
  try {
    const parsed = new URL(url);
    return parsed.pathname !== parsed.pathname.toLowerCase();
  } catch {
    return false;
  }
}

function hasDisallowedPath(url) {
  try {
    const parsed = new URL(url);
    return DISALLOWED_PATH_SEGMENTS.some(segment => parsed.pathname.startsWith(segment));
  } catch {
    return true;
  }
}

function htmlFileForUrl(url) {
  if (url === SITE_URL) {
    return {
      primary: path.join(DIST_DIR, 'index.html'),
      alias: '',
      route: 'index.html',
    };
  }

  const parsed = new URL(url);
  const route = parsed.pathname.replace(/^\/+/, '');
  return {
    primary: path.join(DIST_DIR, route, 'index.html'),
    alias: path.join(DIST_DIR, `${route}.html`),
    route: `${route}/index.html`,
  };
}

function collectHtmlFiles(dir, files = []) {
  if (!fs.existsSync(dir)) return files;

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      collectHtmlFiles(fullPath, files);
    } else if (entry.name.endsWith('.html')) {
      files.push(fullPath);
    }
  }

  return files;
}

function extractFirst(regex, content) {
  const match = content.match(regex);
  return match ? match[1].trim() : '';
}

function extractAll(regex, content) {
  return [...content.matchAll(regex)].map(match => match[1].trim());
}

function visibleText(html) {
  return html
    .replace(/<script\b[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function validateJsonLd(content, relativePath, expectedUrl) {
  const scripts = extractAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi, content);

  for (let index = 0; index < scripts.length; index++) {
    let data;
    try {
      data = JSON.parse(scripts[index]);
    } catch (err) {
      fail(`${relativePath}: JSON-LD block ${index + 1} does not parse (${err.message})`);
      continue;
    }

    const strings = [];
    const walk = value => {
      if (typeof value === 'string') {
        strings.push(value);
      } else if (Array.isArray(value)) {
        value.forEach(walk);
      } else if (value && typeof value === 'object') {
        Object.values(value).forEach(walk);
      }
    };
    walk(data);

    for (const value of strings) {
      if (value.startsWith('http://coderssecret.com')) {
        fail(`${relativePath}: JSON-LD uses HTTP URL (${value})`);
      }
      if (hasTrailingSlashUrl(value)) {
        fail(`${relativePath}: JSON-LD URL uses trailing slash (${value})`);
      }
    }

    const pageUrls = strings.filter(value => value === SITE_URL || value.startsWith(`${SITE_URL}/`));
    const hasPageUrl = pageUrls.some(value => value === expectedUrl || value.startsWith(`${expectedUrl}#`));
    if (!hasPageUrl && scripts.length === 1) {
      warn(`${relativePath}: JSON-LD does not reference the canonical page URL`);
    }
  }
}

function validateSitemapXml() {
  if (!fs.existsSync(SITEMAP_PATH)) {
    fail('sitemap.xml is missing from generated output');
    return [];
  }

  const sitemap = read(SITEMAP_PATH);
  if (!sitemap.startsWith('<?xml version="1.0" encoding="UTF-8"?>')) {
    fail('sitemap.xml: missing XML declaration');
  }
  if (!/<urlset\s+xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9">/.test(sitemap)) {
    fail('sitemap.xml: missing sitemap urlset namespace');
  }
  if (!/<\/urlset>\s*$/.test(sitemap)) {
    fail('sitemap.xml: missing closing urlset tag');
  }
  if ((sitemap.match(/<loc>/g) || []).length !== (sitemap.match(/<\/loc>/g) || []).length) {
    fail('sitemap.xml: mismatched loc tags');
  }
  if (/<changefreq>|<priority>/.test(sitemap)) {
    fail('sitemap.xml: remove changefreq/priority because Google ignores them');
  }

  const locs = extractAll(/<loc>([^<]+)<\/loc>/g, sitemap);
  const seen = new Set();

  for (const loc of locs) {
    if (seen.has(loc)) fail(`sitemap.xml: duplicate URL (${loc})`);
    seen.add(loc);

    let parsed;
    try {
      parsed = new URL(loc);
    } catch {
      fail(`sitemap.xml: loc is not an absolute URL (${loc})`);
      continue;
    }

    if (parsed.protocol !== 'https:') fail(`sitemap.xml: loc is not HTTPS (${loc})`);
    if (parsed.host !== 'coderssecret.com') fail(`sitemap.xml: loc uses the wrong host (${loc})`);
    if (loc.startsWith('http://coderssecret.com')) fail(`sitemap.xml: loc uses HTTP (${loc})`);
    if (hasTrailingSlashUrl(loc)) fail(`sitemap.xml: loc uses a trailing slash (${loc})`);
    if (hasUppercasePath(loc)) fail(`sitemap.xml: loc path has uppercase characters (${loc})`);
    if (parsed.search) fail(`sitemap.xml: loc contains a query string (${loc})`);
    if (parsed.hash) fail(`sitemap.xml: loc contains a hash fragment (${loc})`);
    if (hasDisallowedPath(loc)) fail(`sitemap.xml: loc should not expose private/draft/admin routes (${loc})`);
  }

  for (const requiredUrl of REQUIRED_URLS) {
    if (!seen.has(requiredUrl)) {
      fail(`sitemap.xml: missing required public URL (${requiredUrl})`);
    }
  }

  return locs;
}

function validateRobotsTxt() {
  if (!fs.existsSync(ROBOTS_PATH)) {
    fail('robots.txt is missing from generated output');
    return;
  }

  const robots = read(ROBOTS_PATH);
  if (!/Sitemap:\s*https:\/\/coderssecret\.com\/sitemap\.xml/i.test(robots)) {
    fail('robots.txt: missing Sitemap directive for https://coderssecret.com/sitemap.xml');
  }
  if (/Disallow:\s*\/(?:\s|$)/i.test(robots)) {
    fail('robots.txt: blocks the whole public site');
  }
  for (const blocked of ['/blog', '/category', '/courses', '/cheatsheets', '/glossary', '/slides', '/assets']) {
    if (new RegExp(`Disallow:\\s*${blocked}(?:\\s|$)`, 'i').test(robots)) {
      fail(`robots.txt: blocks public route or asset path (${blocked})`);
    }
  }
}

function validatePageForSitemapUrl(url) {
  const { primary, alias, route } = htmlFileForUrl(url);
  const relativePrimary = path.relative(DIST_DIR, primary);
  const relativeAlias = alias ? path.relative(DIST_DIR, alias) : '';

  if (!fs.existsSync(primary)) {
    fail(`${route}: generated page file is missing for sitemap URL ${url}`);
    return;
  }
  if (alias && !fs.existsSync(alias)) {
    fail(`${relativeAlias}: extensionless static alias is missing for sitemap URL ${url}`);
  }

  const content = read(primary);
  const canonicalLinks = extractAll(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["'][^>]*>/gi, content);
  if (canonicalLinks.length !== 1) {
    fail(`${relativePrimary}: expected exactly one canonical link, found ${canonicalLinks.length}`);
  } else if (canonicalLinks[0] !== url) {
    fail(`${relativePrimary}: canonical (${canonicalLinks[0]}) does not match sitemap URL (${url})`);
  }

  if (/<meta[^>]+name=["']robots["'][^>]+content=["'][^"']*noindex/i.test(content)) {
    fail(`${relativePrimary}: sitemap page is marked noindex`);
  }
  if (/<meta[^>]+http-equiv=["']refresh["']/i.test(content)) {
    fail(`${relativePrimary}: sitemap page uses a meta refresh redirect`);
  }

  const title = extractFirst(/<title>([^<]+)<\/title>/i, content);
  if (!title) fail(`${relativePrimary}: missing title`);

  const description = extractFirst(/<meta\s+name=["']description["']\s+content=["']([^"']+)["'][^>]*>/i, content);
  if (!description || description.length < 40) {
    fail(`${relativePrimary}: missing or thin meta description`);
  }

  const h1Count = (content.match(/<h1\b/gi) || []).length;
  if (h1Count !== 1) {
    fail(`${relativePrimary}: expected exactly one H1, found ${h1Count}`);
  }

  const appRoot = extractFirst(/<app-root\b[^>]*>([\s\S]*?)<\/app-root>/i, content);
  if (!appRoot || visibleText(appRoot).length < 120) {
    fail(`${relativePrimary}: generated app-root content is missing or too thin`);
  }

  const ogUrl = extractFirst(/<meta\s+property=["']og:url["']\s+content=["']([^"']+)["'][^>]*>/i, content);
  if (ogUrl && ogUrl !== url) {
    fail(`${relativePrimary}: og:url (${ogUrl}) does not match canonical sitemap URL (${url})`);
  }

  const twitterUrl = extractFirst(/<meta\s+name=["']twitter:url["']\s+content=["']([^"']+)["'][^>]*>/i, content);
  if (twitterUrl && twitterUrl !== url) {
    fail(`${relativePrimary}: twitter:url (${twitterUrl}) does not match canonical sitemap URL (${url})`);
  }

  validateJsonLd(content, relativePrimary, url);
}

function validateGeneratedHtmlFiles() {
  const files = collectHtmlFiles(DIST_DIR);
  for (const filePath of files) {
    const relative = path.relative(DIST_DIR, filePath);
    const content = read(filePath);

    if (content.includes('http://coderssecret.com')) {
      fail(`${relative}: generated HTML contains http://coderssecret.com`);
    }

    const urlAttrs = [
      ...extractAll(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["'][^>]*>/gi, content),
      ...extractAll(/<meta\s+property=["']og:url["']\s+content=["']([^"']+)["'][^>]*>/gi, content),
      ...extractAll(/<meta\s+name=["']twitter:url["']\s+content=["']([^"']+)["'][^>]*>/gi, content),
    ];

    for (const value of urlAttrs) {
      if (!isCanonicalSiteUrl(value)) {
        fail(`${relative}: canonical/social URL is not on the preferred HTTPS host (${value})`);
      }
      if (hasTrailingSlashUrl(value)) {
        fail(`${relative}: canonical/social URL uses a trailing slash (${value})`);
      }
    }

    validateJsonLd(content, relative, urlAttrs[0] || SITE_URL);

    const hrefs = extractAll(/<a\b[^>]*\shref=["']([^"']+)["'][^>]*>/gi, content);
    for (const href of hrefs) {
      if (!href.startsWith('/') || href === '/' || href.startsWith('/#') || href.startsWith('//')) {
        continue;
      }
      const [pathPart] = href.split(/[?#]/);
      const ext = path.extname(pathPart);
      if (ASSET_EXTENSIONS.has(ext)) continue;
      if (pathPart.endsWith('/')) {
        fail(`${relative}: internal link points to trailing-slash route (${href})`);
      }
    }
  }
}

if (!fs.existsSync(DIST_DIR)) {
  fail(`Generated output directory is missing: ${DIST_DIR}`);
} else {
  const sitemapUrls = validateSitemapXml();
  validateRobotsTxt();
  validateGeneratedHtmlFiles();
  sitemapUrls.forEach(validatePageForSitemapUrl);
}

if (warnings.length > 0) {
  console.log(`SEO generated-output warnings (${warnings.length}):`);
  warnings.forEach(message => console.log(` - ${message}`));
}

if (errors.length > 0) {
  console.error(`SEO generated-output validation failed (${errors.length}):`);
  errors.forEach(message => console.error(` - ${message}`));
  process.exit(1);
}

console.log('Generated SEO validation passed: sitemap, robots, canonicals, aliases, metadata, JSON-LD, and internal links are consistent.');
