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
const REDIRECTS_PATH = path.join(DIST_DIR, '_redirects');

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
  `${SITE_URL}/blog/types-of-malware-and-their-risks`,
  `${SITE_URL}/blog/vector-databases-embeddings-similarity-search`,
  `${SITE_URL}/category/frontend`,
  `${SITE_URL}/category/open-source`,
  `${SITE_URL}/cheatsheets`,
  `${SITE_URL}/glossary/opa`,
  `${SITE_URL}/courses/cloud-native-security-engineering`,
  `${SITE_URL}/courses/distributed-systems-engineering/distributed-security-zero-trust`,
  `${SITE_URL}/courses/distributed-systems-engineering/foundations-distributed-systems`,
  `${SITE_URL}/courses/distributed-systems-engineering/observability-debugging`,
  `${SITE_URL}/courses/malware-analysis-defense`,
  `${SITE_URL}/courses/malware-analysis-defense/authorization-ethics-lab-containment`,
  `${SITE_URL}/courses/malware-analysis-defense/controlled-endpoint-behavioral-analysis`,
  `${SITE_URL}/courses/malware-analysis-defense/mitre-attack-d3fend-mapping`,
  `${SITE_URL}/courses/malware-analysis-defense/yara-detection-as-code`,
  `${SITE_URL}/courses/malware-analysis-defense/capstone-synthetic-developer-tool-incident`,
  `${SITE_URL}/courses/machine-identity-management`,
  `${SITE_URL}/courses/malware-analysis-for-developers`,
  `${SITE_URL}/courses/malware-detection-engineering`,
  `${SITE_URL}/courses/building-malware-resistant-software`,
  `${SITE_URL}/courses/production-rag-systems-engineering`,
  `${SITE_URL}/courses/production-rag-systems-engineering/production-rag-architecture`,
];

const REQUIRED_NOINDEX_URLS = [
  '/courses/spiffe-spire',
  '/courses/what-is-spire',
  '/courses/workload-identity',
  '/courses/zero-trust-kubernetes',
  '/courses/spire-kubernetes-tutorial',
  '/courses/spiffe-mtls-service-mesh',
  '/courses/cloud-native-security-explained',
  '/courses/kubernetes-runtime-security',
  '/courses/kubernetes-supply-chain-security',
  '/courses/secure-service-to-service-communication',
  '/courses/what-is-rag',
  '/courses/vector-database-comparison',
  '/courses/hybrid-search-explained',
  '/courses/ai-agents-explained',
  '/courses/distributed-systems-engineering-explained',
  '/courses/how-distributed-systems-work',
  '/courses/centralized-authentication-envoy-course',
  '/courses/envoy-jwt-jwks-course',
  '/courses/sso-envoy-kubernetes-course',
  '/courses/kubernetes-product-auth-architecture',
  '/courses/analytics-engineering-course',
  '/courses/dbt-course-beginner',
  '/courses/semantic-layer-course',
  '/courses/metrics-layer-course',
  '/courses/data-lineage-dbt-course',
  '/courses/dbt-data-quality-testing-course',
].map(pathname => `${SITE_URL}${pathname}`);

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
      directoryIndex: '',
      route: 'index.html',
    };
  }

  const parsed = new URL(url);
  const route = parsed.pathname.replace(/^\/+/, '');
  return {
    primary: path.join(DIST_DIR, `${route}.html`),
    directoryIndex: path.join(DIST_DIR, route, 'index.html'),
    route: `${route}.html`,
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

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function extractHead(content) {
  return extractFirst(/<head\b[^>]*>([\s\S]*?)<\/head>/i, content);
}

function extractTags(content, tagName) {
  return content.match(new RegExp(`<${tagName}\\b[^>]*>`, 'gi')) || [];
}

function extractTagAttribute(tag, attributeName) {
  const escapedName = escapeRegExp(attributeName);
  const match = tag.match(new RegExp(`(?:^|\\s)${escapedName}\\s*=\\s*(["'])([\\s\\S]*?)\\1`, 'i'));
  return match ? match[2].trim() : '';
}

function extractMetaContents(content, attributeName, attributeValue) {
  return extractTags(content, 'meta')
    .filter(tag => extractTagAttribute(tag, attributeName).toLowerCase() === attributeValue.toLowerCase())
    .map(tag => extractTagAttribute(tag, 'content'))
    .filter(Boolean);
}

function extractHeadTitles(content) {
  return extractAll(/<title\b[^>]*>([\s\S]*?)<\/title>/gi, extractHead(content));
}

function documentBaseUrl(content, canonicalUrl) {
  const baseTag = extractTags(extractHead(content), 'base')[0];
  const baseHref = baseTag ? extractTagAttribute(baseTag, 'href') : '';
  const documentUrl = isCanonicalSiteUrl(canonicalUrl) ? canonicalUrl : SITE_URL;
  try {
    return new URL(baseHref || documentUrl, documentUrl).href;
  } catch {
    return documentUrl;
  }
}

function parseSameOriginReference(value, baseUrl) {
  if (!value || /^(?:data|blob|mailto|tel|javascript):/i.test(value)) return null;

  try {
    const parsed = new URL(value, baseUrl || SITE_URL);
    return parsed.origin === SITE_URL ? parsed : null;
  } catch {
    return null;
  }
}

function localFileForPathname(pathname) {
  let decodedPath;
  try {
    decodedPath = decodeURIComponent(pathname);
  } catch {
    return '';
  }

  if (!decodedPath.startsWith('/') || decodedPath.includes('\0')) return '';
  const distRoot = path.resolve(DIST_DIR);
  const candidate = path.resolve(distRoot, `.${decodedPath}`);
  if (candidate !== distRoot && !candidate.startsWith(`${distRoot}${path.sep}`)) return '';
  return candidate;
}

function isNonemptyFile(filePath) {
  if (!filePath || !fs.existsSync(filePath)) return false;
  const stat = fs.statSync(filePath);
  return stat.isFile() && stat.size > 0;
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

function parseJsonLdData(content) {
  const scripts = extractAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi, content);
  const values = [];
  for (const script of scripts) {
    try {
      values.push(JSON.parse(script));
    } catch {
      // Parse errors are reported by validateJsonLd; callers here only inspect valid blocks.
    }
  }
  return values;
}

function collectObjectNodes(value, nodes = []) {
  if (Array.isArray(value)) {
    value.forEach(item => collectObjectNodes(item, nodes));
  } else if (value && typeof value === 'object') {
    nodes.push(value);
    Object.values(value).forEach(item => collectObjectNodes(item, nodes));
  }
  return nodes;
}

function collectStringValues(value, strings = []) {
  if (typeof value === 'string') {
    strings.push(value);
  } else if (Array.isArray(value)) {
    value.forEach(item => collectStringValues(item, strings));
  } else if (value && typeof value === 'object') {
    Object.values(value).forEach(item => collectStringValues(item, strings));
  }
  return strings;
}

const JSON_LD_ASSET_KEYS = new Set([
  'associatedmedia',
  'contenturl',
  'embedurl',
  'encoding',
  'image',
  'logo',
  'primaryimageofpage',
  'screenshot',
  'thumbnail',
  'thumbnailurl',
]);

const JSON_LD_MEDIA_URL_KEYS = new Set([
  'contenturl',
  'embedurl',
  'url',
]);

function collectJsonLdAssetValues(value, assetValues = []) {
  if (Array.isArray(value)) {
    value.forEach(item => collectJsonLdAssetValues(item, assetValues));
    return assetValues;
  }
  if (!value || typeof value !== 'object') return assetValues;

  const schemaTypes = Array.isArray(value['@type']) ? value['@type'] : [value['@type']];
  const isMediaObject = schemaTypes.some(type => typeof type === 'string' && /(?:Image|Media|Video|Audio)Object$/.test(type));

  for (const [key, entry] of Object.entries(value)) {
    const normalizedKey = key.toLowerCase();
    if (JSON_LD_ASSET_KEYS.has(normalizedKey)
      || (isMediaObject && JSON_LD_MEDIA_URL_KEYS.has(normalizedKey))) {
      collectJsonLdAssetField(entry, assetValues);
    } else if (entry && typeof entry === 'object') {
      collectJsonLdAssetValues(entry, assetValues);
    }
  }
  return assetValues;
}

function collectJsonLdAssetField(value, assetValues) {
  if (typeof value === 'string') {
    assetValues.push(value);
  } else if (Array.isArray(value)) {
    value.forEach(item => collectJsonLdAssetField(item, assetValues));
  } else if (value && typeof value === 'object') {
    for (const [key, entry] of Object.entries(value)) {
      const normalizedKey = key.toLowerCase();
      if (normalizedKey === '@id' || JSON_LD_MEDIA_URL_KEYS.has(normalizedKey)
        || JSON_LD_ASSET_KEYS.has(normalizedKey)) {
        collectJsonLdAssetField(entry, assetValues);
      } else if (entry && typeof entry === 'object') {
        collectJsonLdAssetValues(entry, assetValues);
      }
    }
  }
}

function hasSchemaType(value, expectedType) {
  if (!value || typeof value !== 'object') return false;
  const types = Array.isArray(value['@type']) ? value['@type'] : [value['@type']];
  return types.includes(expectedType);
}

function validateCategoryStructuredData(content, relativePath, url) {
  if (!new URL(url).pathname.startsWith('/category/')) return;

  const data = parseJsonLdData(content);
  const nodes = data.flatMap(value => collectObjectNodes(value));
  const breadcrumb = nodes.find(node => hasSchemaType(node, 'BreadcrumbList'));
  if (!breadcrumb) {
    fail(`${relativePath}: category page is missing BreadcrumbList structured data`);
  } else {
    const items = breadcrumb.itemListElement;
    if (!Array.isArray(items) || items.length < 2) {
      fail(`${relativePath}: category BreadcrumbList must contain at least two ListItem entries`);
    }
    const breadcrumbUrls = collectStringValues(breadcrumb);
    if (!breadcrumbUrls.some(value => value === url || value.startsWith(`${url}#`))) {
      fail(`${relativePath}: category BreadcrumbList does not reference its canonical URL (${url})`);
    }
  }

  const collectionPage = nodes.find(node => hasSchemaType(node, 'CollectionPage'));
  if (!collectionPage) {
    fail(`${relativePath}: category page is missing CollectionPage structured data`);
    return;
  }
  const collectionUrls = collectStringValues(collectionPage);
  if (!collectionUrls.some(value => value === url || value.startsWith(`${url}#`))) {
    fail(`${relativePath}: category CollectionPage does not reference its canonical URL (${url})`);
  }

  let itemList = collectObjectNodes(collectionPage.mainEntity || [])
    .find(node => hasSchemaType(node, 'ItemList'));
  if (!itemList && collectionPage.mainEntity && collectionPage.mainEntity['@id']) {
    itemList = nodes.find(node => hasSchemaType(node, 'ItemList')
      && node['@id'] === collectionPage.mainEntity['@id']);
  }
  if (!itemList) {
    fail(`${relativePath}: category CollectionPage must expose an ItemList as mainEntity`);
  } else if (!Array.isArray(itemList.itemListElement) || itemList.itemListElement.length === 0) {
    fail(`${relativePath}: category CollectionPage ItemList must contain at least one item`);
  }
}

function splitSrcset(value) {
  if (!value || value.trim().startsWith('data:')) return [];
  return value
    .split(',')
    .map(candidate => candidate.trim().split(/\s+/)[0])
    .filter(Boolean);
}

function validateSameOriginAssets(content, relativePath, canonicalUrl) {
  const baseUrl = documentBaseUrl(content, canonicalUrl);
  const references = [];
  const addReference = (value, kind) => {
    if (value) references.push({ value, kind });
  };

  const sourceAttributes = [
    ['img', 'src'],
    ['image', 'href'],
    ['image', 'xlink:href'],
    ['input', 'src'],
    ['source', 'src'],
    ['track', 'src'],
    ['video', 'src'],
    ['video', 'poster'],
    ['audio', 'src'],
    ['script', 'src'],
    ['object', 'data'],
    ['embed', 'src'],
  ];
  for (const [tagName, attributeName] of sourceAttributes) {
    for (const tag of extractTags(content, tagName)) {
      addReference(extractTagAttribute(tag, attributeName), `<${tagName}> ${attributeName}`);
    }
  }

  for (const tagName of ['img', 'source']) {
    for (const tag of extractTags(content, tagName)) {
      for (const value of splitSrcset(extractTagAttribute(tag, 'srcset'))) {
        addReference(value, `<${tagName}> srcset`);
      }
    }
  }

  const assetLinkRels = new Set([
    'apple-touch-icon',
    'icon',
    'image_src',
    'manifest',
    'mask-icon',
    'modulepreload',
    'preload',
    'stylesheet',
  ]);
  for (const tag of extractTags(content, 'link')) {
    const href = extractTagAttribute(tag, 'href');
    const rels = extractTagAttribute(tag, 'rel').toLowerCase().split(/\s+/).filter(Boolean);
    const parsed = parseSameOriginReference(href, baseUrl);
    const hasAssetExtension = parsed && ASSET_EXTENSIONS.has(path.extname(parsed.pathname).toLowerCase());
    if (rels.some(rel => assetLinkRels.has(rel)) || hasAssetExtension) {
      addReference(href, `<link rel="${rels.join(' ')}"> href`);
    }
  }

  const metadataAssetKeys = new Set([
    'og:image',
    'og:image:secure_url',
    'og:image:url',
    'image',
    'msapplication-tileimage',
    'thumbnailurl',
    'twitter:image',
    'twitter:image:src',
  ]);
  for (const tag of extractTags(extractHead(content), 'meta')) {
    const key = (extractTagAttribute(tag, 'property')
      || extractTagAttribute(tag, 'name')
      || extractTagAttribute(tag, 'itemprop')).toLowerCase();
    if (metadataAssetKeys.has(key)) {
      addReference(extractTagAttribute(tag, 'content'), `<meta ${key}> content`);
    }
  }

  for (const data of parseJsonLdData(content)) {
    for (const value of collectJsonLdAssetValues(data)) {
      const parsed = parseSameOriginReference(value, baseUrl);
      if (parsed) {
        addReference(value, 'JSON-LD asset');
      }
    }
  }

  const seen = new Set();
  for (const { value, kind } of references) {
    const parsed = parseSameOriginReference(value, baseUrl);
    if (!parsed) continue;
    const key = parsed.href;
    if (seen.has(key)) continue;
    seen.add(key);

    const filePath = localFileForPathname(parsed.pathname);
    if (!filePath) {
      fail(`${relativePath}: ${kind} has an unsafe or invalid local path (${value})`);
      continue;
    }
    if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
      fail(`${relativePath}: ${kind} references a missing same-origin asset (${value})`);
    } else if (fs.statSync(filePath).size === 0) {
      fail(`${relativePath}: ${kind} references an empty same-origin asset (${value})`);
    }
  }
}

function validateOgImageDimensions(content, relativePath, canonicalUrl) {
  const head = extractHead(content);
  const image = extractMetaContents(head, 'property', 'og:image')[0];
  const widthValue = extractMetaContents(head, 'property', 'og:image:width')[0];
  const heightValue = extractMetaContents(head, 'property', 'og:image:height')[0];
  if (!widthValue && !heightValue) return;
  if (!image) {
    fail(`${relativePath}: og:image dimensions are supplied without an og:image`);
    return;
  }

  const parsed = parseSameOriginReference(image, documentBaseUrl(content, canonicalUrl));
  if (!parsed || path.extname(parsed.pathname).toLowerCase() !== '.svg') return;
  const filePath = localFileForPathname(parsed.pathname);
  if (!isNonemptyFile(filePath)) return;

  const viewBoxMatch = read(filePath).match(/\bviewBox\s*=\s*["']([^"']+)["']/i);
  const viewBox = viewBoxMatch
    ? viewBoxMatch[1].trim().split(/[\s,]+/).map(Number)
    : [];
  if (viewBox.length !== 4 || viewBox.some(value => !Number.isFinite(value))
    || viewBox[2] <= 0 || viewBox[3] <= 0) {
    fail(`${relativePath}: local SVG og:image has no valid viewBox for dimension validation (${image})`);
    return;
  }

  const dimensions = [
    ['width', widthValue, viewBox[2]],
    ['height', heightValue, viewBox[3]],
  ];
  for (const [name, suppliedValue, expectedValue] of dimensions) {
    if (!suppliedValue) continue;
    const suppliedNumber = Number(suppliedValue);
    if (!Number.isFinite(suppliedNumber) || suppliedNumber <= 0) {
      fail(`${relativePath}: og:image:${name} is not a positive number (${suppliedValue})`);
    } else if (Math.abs(suppliedNumber - expectedValue) > 0.01) {
      fail(`${relativePath}: og:image:${name} (${suppliedValue}) does not match local SVG viewBox ${name} (${expectedValue}) for ${image}`);
    }
  }
}

function findGeneratedDestination(pathname) {
  const exactPath = localFileForPathname(pathname);
  if (exactPath && fs.existsSync(exactPath) && fs.statSync(exactPath).isFile()) {
    return exactPath;
  }

  let decodedPath;
  try {
    decodedPath = decodeURIComponent(pathname);
  } catch {
    return '';
  }
  const normalizedPath = decodedPath === '/' ? '/' : decodedPath.replace(/\/+$/, '');
  if (normalizedPath === '/') {
    const indexPath = path.join(DIST_DIR, 'index.html');
    return fs.existsSync(indexPath) ? indexPath : '';
  }

  const route = normalizedPath.replace(/^\/+/, '');
  const candidates = [
    path.join(DIST_DIR, `${route}.html`),
    path.join(DIST_DIR, route, 'index.html'),
  ];
  return candidates.find(candidate => fs.existsSync(candidate) && fs.statSync(candidate).isFile()) || '';
}

function hasFragmentDestination(content, fragment) {
  let decodedFragment;
  try {
    decodedFragment = decodeURIComponent(fragment);
  } catch {
    return false;
  }
  if (!decodedFragment || decodedFragment.startsWith(':~:text=')) return true;

  const attributePattern = /\s(?:id|name)\s*=\s*(["'])([\s\S]*?)\1/gi;
  return [...content.matchAll(attributePattern)].some(match => match[2] === decodedFragment);
}

function validateInternalAnchorDestination(href, relativePath, content, canonicalUrl) {
  if (!href || /^(?:mailto|tel|javascript|data|blob):/i.test(href)) return;
  const parsed = parseSameOriginReference(href, documentBaseUrl(content, canonicalUrl));
  if (!parsed) return;

  const destination = findGeneratedDestination(parsed.pathname);
  if (!destination) {
    fail(`${relativePath}: internal anchor destination does not resolve to generated output (${href})`);
    return;
  }
  if (!isNonemptyFile(destination)) {
    fail(`${relativePath}: internal anchor destination is empty (${href})`);
    return;
  }

  if (parsed.hash && path.extname(destination).toLowerCase() === '.html'
    && !hasFragmentDestination(read(destination), parsed.hash.slice(1))) {
    fail(`${relativePath}: internal anchor fragment does not exist in the generated destination (${href})`);
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

  for (const block of sitemap.match(/<url>[\s\S]*?<\/url>/g) || []) {
    const loc = extractFirst(/<loc>([^<]+)<\/loc>/i, block);
    const lastmods = extractAll(/<lastmod>([^<]+)<\/lastmod>/gi, block);
    if (lastmods.length > 1) {
      fail(`sitemap.xml: URL has multiple lastmod values (${loc})`);
      continue;
    }
    if (lastmods.length === 1) {
      const value = lastmods[0];
      const parsed = Date.parse(value);
      if (!/^\d{4}-\d{2}-\d{2}(?:T[^\s]+)?$/.test(value) || !Number.isFinite(parsed)) {
        fail(`sitemap.xml: invalid lastmod value (${loc}: ${value})`);
      } else if (parsed > Date.now() + 24 * 60 * 60 * 1000) {
        fail(`sitemap.xml: future lastmod value (${loc}: ${value})`);
      }
    }
  }

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
    if (parsed.pathname.startsWith('/slides/') || parsed.pathname.endsWith('/slides')) {
      fail(`sitemap.xml: noindex slide route must not be included (${loc})`);
    }
  }

  for (const requiredUrl of REQUIRED_URLS) {
    if (!seen.has(requiredUrl)) {
      fail(`sitemap.xml: missing required public URL (${requiredUrl})`);
    }
  }
  for (const noindexUrl of REQUIRED_NOINDEX_URLS) {
    if (seen.has(noindexUrl)) {
      fail(`sitemap.xml: noindex supporting guide must not be included (${noindexUrl})`);
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

function validateStaticRedirectRules() {
  if (!fs.existsSync(REDIRECTS_PATH)) {
    fail('_redirects is missing from generated output');
    return;
  }

  const redirects = read(REDIRECTS_PATH);
  const requiredRules = [
    'http://coderssecret.com/* https://coderssecret.com/:splat 301!',
    'https://www.coderssecret.com/* https://coderssecret.com/:splat 301!',
    '/blog/?tag=:tag /blog 301!',
    '/blog?tag=:tag /blog 301!',
    '/blog/cap-theorem-distributed-systems-explained/ /blog/cap-theorem-distributed-systems-explained 301!',
    '/category/frontend/ /category/frontend 301!',
    '/courses/production-rag-systems-engineering/production-rag-architecture/ /courses/production-rag-systems-engineering/production-rag-architecture 301!',
  ];

  for (const rule of requiredRules) {
    if (!redirects.includes(rule)) {
      fail(`_redirects: missing required canonical redirect rule (${rule})`);
    }
  }

  if (/\/sitemap\.xml\/|\/robots\.txt\/|\/assets\//.test(redirects)) {
    fail('_redirects: should not include sitemap, robots, or asset redirects');
  }
}

function validatePageForSitemapUrl(url) {
  const { primary, directoryIndex, route } = htmlFileForUrl(url);
  const relativePrimary = path.relative(DIST_DIR, primary);

  if (!fs.existsSync(primary)) {
    fail(`${route}: generated page file is missing for sitemap URL ${url}`);
    return;
  }

  validateCanonicalPageFile(primary, relativePrimary, url);
  if (directoryIndex && fs.existsSync(directoryIndex)) {
    const relativeDirectoryIndex = path.relative(DIST_DIR, directoryIndex);
    validateCanonicalPageFile(directoryIndex, relativeDirectoryIndex, url);
  }
}

function validateRequiredNoindexPages() {
  for (const url of REQUIRED_NOINDEX_URLS) {
    const { primary, route } = htmlFileForUrl(url);
    if (!fs.existsSync(primary)) {
      fail(`${route}: required supporting noindex page is missing (${url})`);
      continue;
    }

    const content = read(primary);
    const canonical = extractAll(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["'][^>]*>/gi, content);
    if (canonical.length !== 1 || canonical[0] !== url) {
      fail(`${route}: noindex supporting page must keep one self-canonical (${url})`);
    }
    if (!/<meta[^>]+name=["']robots["'][^>]+content=["'][^"']*noindex[^"']*follow/i.test(content)) {
      fail(`${route}: supporting guide must be marked noindex,follow (${url})`);
    }
  }
}

function validateCanonicalPageFile(filePath, relativePath, url) {
  const content = read(filePath);
  const head = extractHead(content);
  const canonicalLinks = extractAll(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["'][^>]*>/gi, content);
  if (canonicalLinks.length !== 1) {
    fail(`${relativePath}: expected exactly one canonical link, found ${canonicalLinks.length}`);
  } else if (canonicalLinks[0] !== url) {
    fail(`${relativePath}: canonical (${canonicalLinks[0]}) does not match sitemap URL (${url})`);
  }

  if (/<meta[^>]+name=["']robots["'][^>]+content=["'][^"']*noindex/i.test(content)) {
    fail(`${relativePath}: sitemap page is marked noindex`);
  }
  if (/<meta[^>]+http-equiv=["']refresh["']/i.test(content)) {
    fail(`${relativePath}: sitemap page uses a meta refresh redirect`);
  }

  const titles = extractHeadTitles(content);
  if (titles.length !== 1 || !visibleText(titles[0])) {
    fail(`${relativePath}: expected exactly one nonempty title in <head>, found ${titles.length}`);
  }

  const description = extractMetaContents(head, 'name', 'description')[0] || '';
  if (!description || description.length < 40) {
    fail(`${relativePath}: missing or thin meta description`);
  }
  if (/(?:\.\.\.|…)\s*$/u.test(description)) {
    fail(`${relativePath}: meta description ends with a mechanically clipped ellipsis`);
  }

  const siteNames = extractMetaContents(head, 'property', 'og:site_name');
  if (siteNames.length !== 1 || siteNames[0] !== 'CodersSecret') {
    fail(`${relativePath}: expected one og:site_name set to CodersSecret`);
  }

  const articleProperties = ['author', 'published_time', 'modified_time', 'section'];
  for (const property of articleProperties) {
    const values = extractMetaContents(head, 'property', `article:${property}`);
    if (values.length > 1) {
      fail(`${relativePath}: duplicate article:${property} metadata (${values.join(', ')})`);
    }
  }
  const articleTags = extractMetaContents(head, 'property', 'article:tag');
  if (new Set(articleTags).size !== articleTags.length) {
    fail(`${relativePath}: duplicate article:tag metadata`);
  }
  if (extractMetaContents(head, 'property', 'og:type')[0] === 'article') {
    for (const requiredProperty of ['author', 'published_time', 'section']) {
      if (extractMetaContents(head, 'property', `article:${requiredProperty}`).length !== 1) {
        fail(`${relativePath}: article page must expose exactly one article:${requiredProperty}`);
      }
    }
  }

  const h1Count = (content.match(/<h1\b/gi) || []).length;
  if (h1Count !== 1) {
    fail(`${relativePath}: expected exactly one H1, found ${h1Count}`);
  }

  const appRoot = extractFirst(/<app-root\b[^>]*>([\s\S]*?)<\/app-root>/i, content);
  if (!appRoot || visibleText(appRoot).length < 120) {
    fail(`${relativePath}: generated app-root content is missing or too thin`);
  }

  const ogUrl = extractFirst(/<meta\s+property=["']og:url["']\s+content=["']([^"']+)["'][^>]*>/i, content);
  if (ogUrl && ogUrl !== url) {
    fail(`${relativePath}: og:url (${ogUrl}) does not match canonical sitemap URL (${url})`);
  }

  const twitterUrl = extractFirst(/<meta\s+name=["']twitter:url["']\s+content=["']([^"']+)["'][^>]*>/i, content);
  if (twitterUrl && twitterUrl !== url) {
    fail(`${relativePath}: twitter:url (${twitterUrl}) does not match canonical sitemap URL (${url})`);
  }

  validateJsonLd(content, relativePath, url);
  validateCategoryStructuredData(content, relativePath, url);
}

function normalizeMetadataValue(value) {
  const namedEntities = {
    amp: '&',
    apos: "'",
    gt: '>',
    lt: '<',
    quot: '"',
  };
  const decodeCodePoint = (code, radix) => {
    const number = parseInt(code, radix);
    return Number.isInteger(number) && number >= 0 && number <= 0x10ffff
      ? String.fromCodePoint(number)
      : '';
  };
  return value
    .replace(/&#(\d+);/g, (_, code) => decodeCodePoint(code, 10))
    .replace(/&#x([\da-f]+);/gi, (_, code) => decodeCodePoint(code, 16))
    .replace(/&(amp|apos|gt|lt|quot);/gi, (_, name) => namedEntities[name.toLowerCase()])
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function validateUniqueSitemapMetadata(sitemapUrls) {
  const titlePages = new Map();
  const descriptionPages = new Map();

  const addPage = (groups, value, url) => {
    const normalized = normalizeMetadataValue(value);
    if (!normalized) return;
    if (!groups.has(normalized)) groups.set(normalized, []);
    groups.get(normalized).push(url);
  };

  for (const url of new Set(sitemapUrls)) {
    const { primary } = htmlFileForUrl(url);
    if (!fs.existsSync(primary)) continue;
    const content = read(primary);
    const head = extractHead(content);
    const title = extractHeadTitles(content)[0] || '';
    const description = extractMetaContents(head, 'name', 'description')[0] || '';
    addPage(titlePages, visibleText(title), url);
    addPage(descriptionPages, description, url);
  }

  for (const [title, urls] of titlePages) {
    if (urls.length > 1) {
      fail(`metadata: duplicate <title> across sitemap pages ("${title.slice(0, 120)}": ${urls.join(', ')})`);
    }
  }
  for (const [description, urls] of descriptionPages) {
    if (urls.length > 1) {
      fail(`metadata: duplicate meta description across sitemap pages ("${description.slice(0, 120)}": ${urls.join(', ')})`);
    }
  }
}

function validateGeneratedHtmlFiles() {
  const files = collectHtmlFiles(DIST_DIR);
  for (const filePath of files) {
    const relative = path.relative(DIST_DIR, filePath);
    const normalizedRelative = relative.replace(/\\/g, '/');
    const content = read(filePath);

    if (content.includes('http://coderssecret.com')) {
      fail(`${relative}: generated HTML contains http://coderssecret.com`);
    }
    if (/href=["']\/blog\/?\?tag=/.test(content)) {
      fail(`${relative}: generated HTML links to duplicate /blog?tag query URLs`);
    }
    if (content.includes('__coderssecret_prerender')) {
      fail(`${relative}: temporary prerender query marker leaked into published HTML`);
    }
    if (/<script\b[^>]*\bsrc=["']https:\/\/giscus\.app\/client\.js["']/i.test(content)) {
      fail(`${relative}: third-party discussion script was serialized into published HTML`);
    }
    if (/<app-blog-post\b/i.test(content)
      && !content.includes('https://github.com/vishalanandl177/coderssecret.com/discussions')) {
      fail(`${relative}: rendered article is missing the crawlable GitHub Discussions fallback`);
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
    validateSameOriginAssets(content, relative, urlAttrs[0] || SITE_URL);
    validateOgImageDimensions(content, relative, urlAttrs[0] || SITE_URL);

    const hrefs = extractTags(content, 'a')
      .map(tag => extractTagAttribute(tag, 'href'))
      .filter(Boolean);
    for (const href of hrefs) {
      validateInternalAnchorDestination(href, relative, content, urlAttrs[0] || SITE_URL);
      if (!href.startsWith('/') || href === '/' || href.startsWith('/#') || href.startsWith('//')) {
        continue;
      }
      const [pathPart, queryPart = ''] = href.split(/[?#]/);
      const ext = path.extname(pathPart);
      if (ASSET_EXTENSIONS.has(ext)) continue;
      if (pathPart === '/blog' && /(?:^|&)tag=/.test(queryPart)) {
        fail(`${relative}: internal link points to duplicate blog tag query URL (${href})`);
      }
      if (pathPart.endsWith('/')) {
        fail(`${relative}: internal link points to trailing-slash route (${href})`);
      }
    }
  }
}

function normalizeInternalHref(href) {
  try {
    const parsed = new URL(href, SITE_URL);
    if (parsed.origin !== SITE_URL) return '';

    const normalizedPath = parsed.pathname === '/'
      ? ''
      : parsed.pathname.replace(/\/+$/, '');
    return `${SITE_URL}${normalizedPath}`;
  } catch {
    return '';
  }
}

function validateSitemapInternalLinks(sitemapUrls) {
  const sitemapSet = new Set(sitemapUrls);
  const inboundSources = new Map(sitemapUrls.map(url => [url, new Set()]));

  for (const sourceUrl of sitemapUrls) {
    const { primary } = htmlFileForUrl(sourceUrl);
    if (!fs.existsSync(primary)) continue;

    const hrefs = extractAll(/<a\b[^>]*\shref=["']([^"']+)["'][^>]*>/gi, read(primary));
    for (const href of hrefs) {
      const targetUrl = normalizeInternalHref(href);
      if (!targetUrl || targetUrl === sourceUrl || !sitemapSet.has(targetUrl)) continue;
      inboundSources.get(targetUrl).add(sourceUrl);
    }
  }

  for (const [url, sources] of inboundSources) {
    if (sources.size === 0) {
      fail(`internal links: sitemap URL has no crawlable link from another sitemap page (${url})`);
    }

    if (url.startsWith(`${SITE_URL}/blog/`) && sources.size < 3) {
      fail(`internal links: blog article has fewer than three crawlable inbound page links (${url}, found ${sources.size})`);
    }
  }
}

function validateNoEmptyRouteDirectories() {
  function visit(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory()) {
        visit(path.join(dir, entry.name));
      }
    }

    const relativeDir = path.relative(DIST_DIR, dir);
    if (!relativeDir) {
      return;
    }

    if (fs.readdirSync(dir).length > 0) {
      return;
    }

    const aliasPath = path.resolve(DIST_DIR, `${relativeDir}.html`);
    if (fs.existsSync(aliasPath)) {
      fail(`${relativeDir}: empty route directory remains beside ${relativeDir}.html and can shadow the canonical extensionless URL on static hosts`);
    }
  }

  visit(DIST_DIR);
}

if (!fs.existsSync(DIST_DIR)) {
  fail(`Generated output directory is missing: ${DIST_DIR}`);
} else {
  const sitemapUrls = validateSitemapXml();
  validateRobotsTxt();
  validateStaticRedirectRules();
  validateGeneratedHtmlFiles();
  validateNoEmptyRouteDirectories();
  validateRequiredNoindexPages();
  sitemapUrls.forEach(validatePageForSitemapUrl);
  validateUniqueSitemapMetadata(sitemapUrls);
  validateSitemapInternalLinks(sitemapUrls);
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

console.log('Generated SEO validation passed: sitemap, robots, canonicals, extensionless route files, metadata, JSON-LD, and crawlable internal links are consistent.');
