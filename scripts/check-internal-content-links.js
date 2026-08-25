/**
 * Validate contextual internal links authored inside blog article bodies.
 *
 * Run after the production build and sitemap generation so link targets are
 * checked against the same canonical, indexable route inventory we publish.
 */

const fs = require('fs');
const path = require('path');

const SITE_URL = 'https://coderssecret.com';
const ROOT_DIR = path.join(__dirname, '..');
const BLOG_CONTENT_DIR = path.join(ROOT_DIR, 'src', 'app', 'models', 'blog-content');
const BLOG_POST_MODEL_PATH = path.join(ROOT_DIR, 'src', 'app', 'models', 'blog-post.model.ts');
const SITEMAP_PATH = path.join(ROOT_DIR, 'dist', 'coderssecret-app', 'browser', 'sitemap.xml');
// CodersSecret editorial floor, not a Google-prescribed ranking threshold.
const MIN_INTERNAL_TARGETS = 2;

const errors = [];

function fail(message) {
  errors.push(message);
}

function stripHtml(value) {
  return String(value || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&(?:amp|apos|quot|lt|gt);/gi, ' ')
    .replace(/&#(?:x[\da-f]+|\d+);/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function proseHtml(source) {
  return String(source || '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<pre\b[^>]*>[\s\S]*?<\/pre>/gi, '');
}

function normalizeInternalHref(href, sourceRoute) {
  const raw = String(href || '').trim();
  if (!raw || raw.startsWith('#') || /^(?:mailto|tel|javascript|data|blob):/i.test(raw)) {
    return null;
  }
  let parsed;
  try {
    parsed = new URL(raw, `${SITE_URL}${sourceRoute}`);
  } catch {
    fail(`${sourceRoute}: link is not a valid URL (${raw})`);
    return null;
  }

  if (parsed.hostname.toLowerCase() === 'coderssecret.com' && parsed.protocol === 'http:') {
    fail(`${sourceRoute}: internal link uses HTTP (${raw})`);
  }
  if (parsed.origin !== SITE_URL) return null;
  if (parsed.search) {
    fail(`${sourceRoute}: contextual internal link must not use a query URL (${raw})`);
  }
  if (parsed.pathname !== '/' && parsed.pathname.endsWith('/')) {
    fail(`${sourceRoute}: contextual internal link uses a trailing slash (${raw})`);
  }

  const pathname = parsed.pathname === '/'
    ? '/'
    : parsed.pathname.replace(/\/+$/, '');
  return { pathname, hash: parsed.hash, raw };
}

function sitemapPaths() {
  if (!fs.existsSync(SITEMAP_PATH)) {
    fail(`sitemap is missing at ${path.relative(ROOT_DIR, SITEMAP_PATH)}; run the production build and sitemap generator first`);
    return new Set();
  }

  const xml = fs.readFileSync(SITEMAP_PATH, 'utf8');
  return new Set([...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => {
    const url = new URL(match[1]);
    return url.pathname || '/';
  }));
}

function isAllowedSupportingRoute(pathname, canonicalSlidePaths, canonicalPaths) {
  if (canonicalSlidePaths.has(pathname)) return true;

  const courseSlides = pathname.match(/^(\/courses\/[^/]+\/[^/]+)\/slides$/);
  return Boolean(courseSlides && canonicalPaths.has(courseSlides[1]));
}

function articleFiles() {
  return fs.readdirSync(BLOG_CONTENT_DIR)
    .filter(file => file.endsWith('.ts'))
    .sort();
}

function blogPostCatalog() {
  try {
    const ts = require('typescript');
    const source = fs.readFileSync(BLOG_POST_MODEL_PATH, 'utf8');
    const js = ts.transpileModule(source, {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2020,
      },
    }).outputText;
    const mod = { exports: {} };
    new Function('exports', 'require', 'module', js)(mod.exports, require, mod);
    const posts = Array.isArray(mod.exports.BLOG_POSTS) ? mod.exports.BLOG_POSTS : [];
    if (posts.length === 0) {
      fail('BLOG_POSTS loaded an empty catalog from src/app/models/blog-post.model.ts');
    }
    return posts;
  } catch (err) {
    fail(`could not execute BLOG_POSTS from src/app/models/blog-post.model.ts (${err.message})`);
    return [];
  }
}

function reportInventoryDifference(leftName, left, rightName, right) {
  const missing = [...left].filter(value => !right.has(value)).sort();
  if (missing.length > 0) {
    fail(`${leftName} missing from ${rightName}: ${missing.join(', ')}`);
  }
}

function validate() {
  const canonicalPaths = sitemapPaths();
  const files = articleFiles();
  const articleSlugs = new Set(files.map(file => path.basename(file, '.ts')));
  const catalogPosts = blogPostCatalog();
  const catalogSlugs = new Set(catalogPosts.map(post => post.slug));
  const canonicalSlidePaths = new Set(catalogPosts.map(post => `/slides/${post.slideSlug || post.slug}`));
  const redirectSlideAliases = new Map(catalogPosts
    .filter(post => post.slideSlug && post.slideSlug !== post.slug)
    .map(post => [`/slides/${post.slug}`, `/slides/${post.slideSlug}`]));
  const drfPost = catalogPosts.find(post => post.projectId === 'drf-api-logger');
  if (!drfPost || `/slides/${drfPost.slideSlug || drfPost.slug}` !== '/slides/drf-api-logger') {
    fail('DRF API Logger must resolve to the canonical supporting route /slides/drf-api-logger');
  }
  const sitemapArticleSlugs = new Set([...canonicalPaths]
    .map(route => route.match(/^\/blog\/([^/]+)$/)?.[1])
    .filter(Boolean));
  reportInventoryDifference('content files', articleSlugs, 'BLOG_POSTS', catalogSlugs);
  reportInventoryDifference('BLOG_POSTS entries', catalogSlugs, 'content files', articleSlugs);
  reportInventoryDifference('content files', articleSlugs, 'sitemap blog routes', sitemapArticleSlugs);
  reportInventoryDifference('sitemap blog routes', sitemapArticleSlugs, 'content files', articleSlugs);
  const inboundSources = new Map([...articleSlugs].map(slug => [slug, new Set()]));
  let contextualLinkCount = 0;

  for (const file of files) {
    const slug = path.basename(file, '.ts');
    const route = `/blog/${slug}`;
    const source = proseHtml(fs.readFileSync(path.join(BLOG_CONTENT_DIR, file), 'utf8'));
    const anchors = [...source.matchAll(/<a\b([^>]*)\bhref\s*=\s*(["'])([^"']+)\2[^>]*>([\s\S]*?)<\/a>/gi)];
    const internalTargets = new Set();
    const articleTargets = new Set();

    for (const anchor of anchors) {
      const href = anchor[3];
      const normalized = normalizeInternalHref(href, route);
      if (!normalized) continue;

      const rel = anchor[0].match(/\brel\s*=\s*(["'])([^"']+)\1/i)?.[2] || '';
      if (rel.split(/\s+/).some(token => token.toLowerCase() === 'nofollow')) {
        fail(`${route}: contextual internal link must not use rel="nofollow" (${href})`);
      }

      const anchorText = stripHtml(anchor[4]).toLowerCase();
      if (/^(?:click here|here|learn more|read more|this page)$/.test(anchorText)) {
        fail(`${route}: contextual link uses vague anchor text "${stripHtml(anchor[4])}" (${href})`);
      }

      if (normalized.pathname === route) {
        if (!normalized.hash) fail(`${route}: article body contains a redundant self-link (${href})`);
        continue;
      }

      if (redirectSlideAliases.has(normalized.pathname)) {
        fail(`${route}: contextual link targets a redirect alias; link to ${redirectSlideAliases.get(normalized.pathname)} instead (${href})`);
        continue;
      }

      if (!canonicalPaths.has(normalized.pathname)
        && !isAllowedSupportingRoute(normalized.pathname, canonicalSlidePaths, canonicalPaths)) {
        fail(`${route}: contextual link target is not a canonical indexable route (${href})`);
      }

      internalTargets.add(normalized.pathname);
      const blogTarget = normalized.pathname.match(/^\/blog\/([^/]+)$/);
      if (blogTarget && articleSlugs.has(blogTarget[1])) {
        articleTargets.add(blogTarget[1]);
        inboundSources.get(blogTarget[1]).add(slug);
      }
    }

    contextualLinkCount += internalTargets.size;
    if (internalTargets.size < MIN_INTERNAL_TARGETS) {
      fail(`${route}: needs at least ${MIN_INTERNAL_TARGETS} unique contextual internal targets (found ${internalTargets.size})`);
    }
    if (articleTargets.size === 0) {
      fail(`${route}: needs a contextual link to at least one related blog article`);
    }
  }

  for (const [slug, sources] of inboundSources) {
    if (sources.size === 0) {
      fail(`/blog/${slug}: has no contextual backlink from another article`);
    }
  }

  if (errors.length === 0) {
    console.log(`Internal content link validation passed: ${files.length} articles, ${contextualLinkCount} unique contextual targets, and every article has an article-to-article backlink.`);
  }
}

validate();

if (errors.length > 0) {
  console.error(`Internal content link validation failed (${errors.length}):`);
  errors.forEach(message => console.error(` - ${message}`));
  process.exit(1);
}
