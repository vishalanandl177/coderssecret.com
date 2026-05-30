/**
 * Generates pre-rendered static HTML for all SPA routes.
 *
 * Each route gets an index.html with:
 * - Route-specific <title> and <meta description>
 * - Route-specific Open Graph tags
 * - Real text content inside <app-root> for Google to read
 * - Canonical URL
 *
 * This prevents "Soft 404" from Google (empty page = not indexable).
 * Angular hydrates on top when JS loads and replaces the static content.
 *
 * Run after build: node scripts/generate-routes.js
 */

const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawn, spawnSync } = require('child_process');

const SITE_NAME = 'CodersSecret';
const SITE_URL = 'https://coderssecret.com';
const YOUTUBE_URL = 'https://www.youtube.com/@CodersSecret';
const SPOTIFY_PODCAST_URL = 'https://open.spotify.com/show/033dhxk8tNClX2r4XduVyb';
const GITHUB_REPO_URL = 'https://github.com/vishalanandl177/coderssecret.com';
const OUTPUT_DIR = path.join(__dirname, '..', 'dist', 'coderssecret-app', 'browser');
const NOINDEX_FOLLOW_META = '  <meta name="robots" content="noindex,follow">\n';
const UI_SOURCE_PRERENDER = process.env.CODERSSECRET_PRERENDER_SOURCE !== 'manual';
const PRERENDER_BUDGET_MS = Number(process.env.CODERSSECRET_PRERENDER_BUDGET_MS || 1800);
const PRERENDER_RETRY_BUDGET_MS = Number(process.env.CODERSSECRET_PRERENDER_RETRY_BUDGET_MS || 5000);
const PRERENDER_TIMEOUT_MS = Number(process.env.CODERSSECRET_PRERENDER_TIMEOUT_MS || 60000);
const PRERENDER_RETRY_TIMEOUT_MS = Number(process.env.CODERSSECRET_PRERENDER_RETRY_TIMEOUT_MS || 120000);
const CHROME_WINDOW_SIZE = process.env.CODERSSECRET_PRERENDER_WINDOW || '1365,900';
const PRERENDER_ALLOW_EXTERNAL_NETWORK = process.env.CODERSSECRET_PRERENDER_ALLOW_NETWORK === '1';
const hydratedRouteCache = new Map();
let prerenderRuntime;
let prerenderRouteCount = 0;

// Read the blog post model
const modelPath = path.join(__dirname, '..', 'src', 'app', 'models', 'blog-post.model.ts');
const modelContent = fs.readFileSync(modelPath, 'utf-8');

// Load post metadata through TypeScript so dates, authors, and tags stay intact.
const posts = loadBlogPostsFromModel(modelContent);
const categories = new Set(posts.map(post => post.category).filter(Boolean));

// Category display names
const categoryNames = {
  ai: 'AI',
  frontend: 'Frontend',
  backend: 'Backend',
  devops: 'DevOps',
  tutorials: 'Tutorials',
  'open-source': 'Open Source',
};

const HOME_TITLE = `${SITE_NAME} | Security, AI, Data & Production Engineering`;
const HOME_DESCRIPTION = 'Free engineering courses and guides on Kubernetes, SPIFFE/SPIRE, Zero Trust, production RAG, analytics engineering, DevSecOps, labs, and diagrams.';

// Read the built index.html. The generator is intentionally idempotent: if it
// is rerun after a previous prerender, strip previously injected route content
// and head tags before using index.html as the shell for every route.
const baseHtml = normalizeBuiltShell(fs.readFileSync(path.join(OUTPUT_DIR, 'index.html'), 'utf-8'));
removeStaleGeneratedRoutes();

function normalizeBuiltShell(html) {
  return String(html)
    .replace(/<app-root[\s\S]*?<\/app-root>/i, '<app-root></app-root>')
    .replace(/\s*<link rel="canonical"[^>]*>\n?/gi, '')
    .replace(/\s*<link rel="alternate" hreflang="en"[^>]*>\n?/gi, '')
    .replace(/\s*<meta name="robots" content="[^"]*">\n?/gi, '')
    .replace(/\s*<meta property="og:[^"]+" content="[^"]*">\n?/gi, '')
    .replace(/\s*<meta name="twitter:[^"]+" content="[^"]*">\n?/gi, '')
    .replace(/\s*<script type="application\/ld\+json">[\s\S]*?<\/script>\n?/gi, '');
}

function removeStaleGeneratedRoutes() {
  for (const route of ['home']) {
    const routePath = path.resolve(OUTPUT_DIR, route);
    if (routePath.startsWith(path.resolve(OUTPUT_DIR) + path.sep)) {
      fs.rmSync(routePath, { recursive: true, force: true });
    }
  }
  removeGeneratedExtensionlessAliases(OUTPUT_DIR);
}

function removeGeneratedExtensionlessAliases(dir) {
  if (!fs.existsSync(dir)) return;

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      removeGeneratedExtensionlessAliases(fullPath);
    } else if (entry.name.endsWith('.html') && entry.name !== 'index.html' && entry.name !== '404.html') {
      fs.rmSync(fullPath, { force: true });
    }
  }
}

function makeHtml(options) {
  const { title, description, url, content, jsonLd, image, fullTitle: explicitFullTitle, ogType = 'website', extraHead = '' } = options;
  const normalizedUrl = normalizeCanonicalPath(url);
  const fullTitle = normalizeTitleSeparators(explicitFullTitle || buildFullTitle(title));
  const canonical = absoluteUrl(normalizedUrl);
  const ogImage = image ? `${SITE_URL}${image}` : `${SITE_URL}/og-image.svg`;
  const safeTitle = escapeHtml(fullTitle);
  const safeDescription = escapeHtml(clampText(description, 160));
  const renderedRoute = renderRouteSource({ url: normalizedUrl, fallbackContent: content });
  const appRootHtml = renderedRoute.appRootHtml;
  const structuredData = structuredDataForPage({
    jsonLd,
    fullTitle,
    description: clampText(description, 160),
    canonical,
    ogImage,
  });

  let html = renderedRoute.documentHtml
    ? normalizeBuiltShell(renderedRoute.documentHtml)
    : baseHtml;

  // Replace <title>
  html = html.replace(
    /<title>[^<]*<\/title>/,
    `<title>${safeTitle}</title>`
  );

  // Replace meta description
  html = html.replace(
    /<meta name="description" content="[^"]*">/,
    `<meta name="description" content="${safeDescription}">`
  );

  // Add canonical link before </head>
  html = html.replace(
    '</head>',
    `  <link rel="canonical" href="${canonical}">\n` +
    `  <meta property="og:title" content="${safeTitle}">\n` +
    `  <meta property="og:description" content="${safeDescription}">\n` +
    `  <meta property="og:url" content="${canonical}">\n` +
    `  <meta property="og:type" content="${escapeHtml(ogType)}">\n` +
    `  <meta property="og:image" content="${ogImage}">\n` +
    `  <meta property="og:image:width" content="1200">\n` +
    `  <meta property="og:image:height" content="630">\n` +
    `  <meta name="twitter:card" content="summary_large_image">\n` +
    `  <meta name="twitter:title" content="${safeTitle}">\n` +
    `  <meta name="twitter:description" content="${safeDescription}">\n` +
    `  <meta name="twitter:image" content="${ogImage}">\n` +
    `  <link rel="alternate" hreflang="en" href="${canonical}">\n` +
    extraHead +
    `  <script type="application/ld+json">${JSON.stringify(structuredData)}</script>\n` +
    '</head>'
  );

  // Inject the same rendered app source users see in the browser.
  html = html.replace(
    '<app-root></app-root>',
    appRootHtml
  );

  return html;
}

function renderRouteSource({ url, fallbackContent }) {
  if (!UI_SOURCE_PRERENDER) {
    return {
      documentHtml: '',
      appRootHtml: `<app-root>${wrapPrerenderContent(fallbackContent)}</app-root>`,
    };
  }

  const routePath = normalizeRoutePathForRender(url);
  if (hydratedRouteCache.has(routePath)) {
    return hydratedRouteCache.get(routePath);
  }

  const firstAttempt = renderRouteWithRetry(routePath, PRERENDER_BUDGET_MS, PRERENDER_TIMEOUT_MS);
  const firstText = stripHtml(firstAttempt.appRootHtml);
  const fallbackText = stripHtml(fallbackContent);
  const needsRetry = fallbackText.length > 120 && firstText.length < Math.min(120, fallbackText.length * 0.2);
  const rendered = needsRetry
    ? renderRouteWithRetry(routePath, PRERENDER_RETRY_BUDGET_MS, PRERENDER_RETRY_TIMEOUT_MS)
    : firstAttempt;
  const renderedText = stripHtml(rendered.appRootHtml);

  if (renderedText.length < 20) {
    throw new Error(`Rendered Angular source for ${routePath} is too small. Refusing to publish thin static HTML.`);
  }

  hydratedRouteCache.set(routePath, rendered);
  return rendered;
}

function normalizeRoutePathForRender(url) {
  const raw = String(url || '/').trim() || '/';
  const pathOnly = raw.startsWith('http') ? new URL(raw).pathname : raw.split(/[?#]/)[0];
  return normalizeCanonicalPath(pathOnly.startsWith('/') ? pathOnly : `/${pathOnly}`);
}

function normalizeCanonicalPath(url) {
  const raw = String(url || '/').trim() || '/';
  const pathOnly = raw.startsWith('http') ? new URL(raw).pathname : raw.split(/[?#]/)[0];
  const normalized = `/${pathOnly.replace(/^\/+/, '')}`.replace(/\/+$/, '');
  return normalized === '' ? '/' : normalized;
}

function absoluteUrl(url) {
  const normalizedPath = normalizeCanonicalPath(url);
  return normalizedPath === '/' ? SITE_URL : `${SITE_URL}${normalizedPath}`;
}

function renderRouteWithRetry(routePath, budgetMs, timeoutMs) {
  try {
    return renderRouteWithBudget(routePath, budgetMs, timeoutMs);
  } catch (err) {
    console.warn(`[prerender] retrying ${routePath}: ${err.message}`);
    return renderRouteWithBudget(routePath, PRERENDER_RETRY_BUDGET_MS, PRERENDER_RETRY_TIMEOUT_MS);
  }
}

function renderRouteWithBudget(routePath, budgetMs, timeoutMs) {
  const runtime = ensurePrerenderRuntime();
  const routeRenderId = ++prerenderRouteCount;
  const userDataDir = path.join(
    runtime.runtimeDir,
    `chrome-profile-${routeRenderId}-${sanitizeFileSegment(routePath)}`
  );
  fs.mkdirSync(userDataDir, { recursive: true });

  const browserArgs = [
    '--headless=new',
    '--disable-gpu',
    '--disable-dev-shm-usage',
    '--disable-background-networking',
    '--disable-component-update',
    '--disable-extensions',
    '--disable-features=Translate,OptimizationHints,MediaRouter',
    '--disable-sync',
    '--hide-scrollbars',
    '--metrics-recording-only',
    '--mute-audio',
    '--no-first-run',
    '--no-default-browser-check',
    '--no-sandbox',
    '--run-all-compositor-stages-before-draw',
    `--user-data-dir=${userDataDir}`,
    `--window-size=${CHROME_WINDOW_SIZE}`,
    `--virtual-time-budget=${budgetMs}`,
    '--dump-dom',
    `${runtime.baseUrl}${routePath}`,
  ];

  if (!PRERENDER_ALLOW_EXTERNAL_NETWORK) {
    browserArgs.splice(
      browserArgs.length - 2,
      0,
      '--host-resolver-rules=MAP * 0.0.0.0, EXCLUDE 127.0.0.1, EXCLUDE localhost'
    );
  }

  if (process.env.GITHUB_ACTIONS || routeRenderId === 1 || routeRenderId % 25 === 0) {
    console.log(`[prerender] ${routeRenderId}: ${routePath}`);
  }

  const result = spawnSync(runtime.browserPath, browserArgs, {
    encoding: 'utf-8',
    maxBuffer: 128 * 1024 * 1024,
    timeout: timeoutMs,
  });

  try {
    fs.rmSync(userDataDir, { recursive: true, force: true });
  } catch {
    // Best-effort cleanup; the parent temp directory is also removed at exit.
  }

  if (result.error) {
    throw new Error(
      `Could not render ${routePath} for static source: ${result.error.message}\n` +
      `stderr:\n${String(result.stderr || '').slice(0, 4000)}\n` +
      `stdout:\n${String(result.stdout || '').slice(0, 2000)}`
    );
  }

  if (result.status !== 0) {
    throw new Error(
      `Could not render ${routePath} for static source. Browser exited with ${result.status}.\n${String(result.stderr || '').slice(0, 4000)}`
    );
  }

  const documentHtml = String(result.stdout || '').trim();
  const appRootHtml = extractAppRootHtml(documentHtml, routePath);
  return { documentHtml, appRootHtml };
}

function sanitizeFileSegment(value) {
  const segment = String(value || 'root')
    .replace(/[^a-z0-9]+/gi, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);

  return segment || 'root';
}

function extractAppRootHtml(documentHtml, routePath) {
  const match = String(documentHtml || '').match(/<app-root\b[^>]*>[\s\S]*?<\/app-root>/i);
  if (!match) {
    throw new Error(`Rendered Angular source for ${routePath} does not contain <app-root>.`);
  }

  return match[0];
}

function ensurePrerenderRuntime() {
  if (prerenderRuntime) {
    return prerenderRuntime;
  }

  const browserPath = findBrowserExecutable();
  if (!browserPath) {
    throw new Error(
      'scripts/generate-routes.js needs Chrome/Chromium/Edge to prerender the exact Angular UI source. ' +
      'Install a browser, set CHROME_BIN, or set CODERSSECRET_PRERENDER_SOURCE=manual only for emergency non-UI fallback builds.'
    );
  }

  const port = Number(process.env.CODERSSECRET_PRERENDER_PORT || (43000 + (process.pid % 1000)));
  const runtimeDir = fs.mkdtempSync(path.join(os.tmpdir(), 'coderssecret-prerender-'));
  const shellPath = path.join(runtimeDir, 'index-shell.html');
  const readyPath = path.join(runtimeDir, 'server.ready');
  fs.writeFileSync(shellPath, baseHtml, 'utf-8');

  const serverProcess = spawn(process.execPath, ['-e', staticServerScript()], {
    env: {
      ...process.env,
      CS_PRERENDER_ROOT: OUTPUT_DIR,
      CS_PRERENDER_SHELL: shellPath,
      CS_PRERENDER_READY: readyPath,
      CS_PRERENDER_PORT: String(port),
      CS_PRERENDER_BLOCK_EXTERNAL: PRERENDER_ALLOW_EXTERNAL_NETWORK ? '0' : '1',
    },
    stdio: 'ignore',
    windowsHide: true,
  });
  serverProcess.unref();

  waitForFile(readyPath, 8000, 'static prerender server');

  prerenderRuntime = {
    browserPath,
    serverProcess,
    runtimeDir,
    baseUrl: `http://127.0.0.1:${port}`,
  };

  console.log(`Rendering static route source from hydrated Angular UI using ${browserPath}.`);
  return prerenderRuntime;
}

function findBrowserExecutable() {
  const candidates = [
    process.env.CHROME_BIN,
    process.env.PUPPETEER_EXECUTABLE_PATH,
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
    '/usr/bin/google-chrome',
    '/usr/bin/google-chrome-stable',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
    '/usr/bin/microsoft-edge',
    'google-chrome',
    'google-chrome-stable',
    'chromium',
    'chromium-browser',
    'microsoft-edge',
    'msedge',
  ].filter(Boolean);

  for (const candidate of candidates) {
    if (path.isAbsolute(candidate) && fs.existsSync(candidate)) {
      return candidate;
    }

    if (!path.isAbsolute(candidate)) {
      const probe = spawnSync(candidate, ['--version'], { encoding: 'utf-8', windowsHide: true });
      if (!probe.error && probe.status === 0) {
        return candidate;
      }
    }
  }

  return '';
}

function staticServerScript() {
  return `
const fs = require('fs');
const http = require('http');
const path = require('path');
const root = path.resolve(process.env.CS_PRERENDER_ROOT);
const shell = fs.readFileSync(process.env.CS_PRERENDER_SHELL, 'utf-8');
const ready = process.env.CS_PRERENDER_READY;
const port = Number(process.env.CS_PRERENDER_PORT);
const types = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml; charset=utf-8',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
};
function send(res, status, contentType, body) {
  const headers = {
    'content-type': contentType,
    'cache-control': 'no-store',
  };
  if (process.env.CS_PRERENDER_BLOCK_EXTERNAL === '1') {
    headers['content-security-policy'] = "default-src 'self' data: blob: 'unsafe-inline'; connect-src 'self'; frame-src 'none'; font-src 'self' data:; img-src 'self' data: blob:; media-src 'self' data: blob:; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'";
  }
  res.writeHead(status, headers);
  res.end(body);
}
const server = http.createServer((req, res) => {
  try {
    const requestUrl = new URL(req.url || '/', 'http://127.0.0.1');
    if (requestUrl.pathname === '/__coderssecret_prerender_ping') {
      send(res, 200, 'text/plain; charset=utf-8', 'ok');
      return;
    }

    const decodedPath = decodeURIComponent(requestUrl.pathname);
    const hasExtension = path.extname(decodedPath) !== '';
    const requestedFile = path.resolve(root, '.' + decodedPath);
    if (hasExtension && requestedFile.startsWith(root + path.sep) && fs.existsSync(requestedFile) && fs.statSync(requestedFile).isFile()) {
      const ext = path.extname(requestedFile).toLowerCase();
      send(res, 200, types[ext] || 'application/octet-stream', fs.readFileSync(requestedFile));
      return;
    }

    send(res, 200, 'text/html; charset=utf-8', shell);
  } catch (err) {
    send(res, 500, 'text/plain; charset=utf-8', err && err.stack ? err.stack : String(err));
  }
});
server.listen(port, '127.0.0.1', () => fs.writeFileSync(ready, String(port)));
process.on('SIGTERM', () => server.close(() => process.exit(0)));
process.on('SIGINT', () => server.close(() => process.exit(0)));
`;
}

function waitForFile(filePath, timeoutMs, label) {
  const deadline = Date.now() + timeoutMs;
  while (!fs.existsSync(filePath)) {
    if (Date.now() > deadline) {
      throw new Error(`Timed out waiting for ${label}.`);
    }
    sleepSync(50);
  }
}

function sleepSync(ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

function cleanupPrerenderRuntime() {
  if (!prerenderRuntime) {
    return;
  }

  try {
    prerenderRuntime.serverProcess.kill();
  } catch {
    // Best-effort cleanup; build output has already been written.
  }

  try {
    fs.rmSync(prerenderRuntime.runtimeDir, { recursive: true, force: true });
  } catch {
    // Best-effort cleanup of temporary browser profile and shell.
  }

  prerenderRuntime = undefined;
}

process.on('exit', cleanupPrerenderRuntime);

function buildFullTitle(title) {
  const trimmedTitle = String(title || SITE_NAME).trim();
  const normalizedTitle = normalizeTitleSeparators(trimmedTitle);

  if (normalizedTitle.toLowerCase().includes(SITE_NAME.toLowerCase())) {
    return normalizedTitle;
  }

  return `${normalizedTitle} | ${SITE_NAME}`;
}

function normalizeTitleSeparators(title) {
  return String(title || '')
    .replace(/\s+(?:\u2014|\u2013|\u00e2\u20ac\u201d|-)\s+/g, ' | ')
    .replace(/\s+\|\s+/g, ' | ')
    .trim();
}

function wrapPrerenderContent(content) {
  const normalized = String(content ?? '').trim();

  if (/^<main\b/i.test(normalized)) {
    return normalized.replace(/^<main\b([^>]*)>/i, (_match, attrs) => {
      return `<main${prerenderMainAttrs(attrs)}>`;
    });
  }

  return `<main id="main-content" class="seo-prerender-content">${normalized}</main>`;
}

function prerenderMainAttrs(attrs) {
  let nextAttrs = attrs || '';

  if (!/\sid\s*=/i.test(nextAttrs)) {
    nextAttrs += ' id="main-content"';
  }

  if (/\sclass\s*=/i.test(nextAttrs)) {
    return nextAttrs.replace(/\sclass=(["'])(.*?)\1/i, (_match, quote, value) => {
      return ` class=${quote}${value} seo-prerender-content${quote}`;
    });
  }

  return `${nextAttrs} class="seo-prerender-content"`;
}

function structuredDataForPage({ jsonLd, fullTitle, description, canonical, ogImage }) {
  const pageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    'name': fullTitle,
    'description': description,
    'url': canonical,
    'inLanguage': 'en',
    'isPartOf': {
      '@type': 'WebSite',
      'name': 'CodersSecret',
      'url': SITE_URL,
    },
    'primaryImageOfPage': {
      '@type': 'ImageObject',
      'url': ogImage,
    },
  };

  if (!jsonLd) {
    return pageSchema;
  }

  const items = Array.isArray(jsonLd) ? jsonLd : [jsonLd];
  const hasPageSchema = items.some(item => item && ['WebPage', 'CollectionPage'].includes(item['@type']));
  return normalizeStructuredDataUrls(hasPageSchema ? items : [pageSchema, ...items]);
}

function normalizeStructuredDataUrls(value) {
  if (typeof value === 'string') {
    return normalizeSiteUrlString(value);
  }

  if (Array.isArray(value)) {
    return value.map(normalizeStructuredDataUrls);
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [key, normalizeStructuredDataUrls(entry)])
    );
  }

  return value;
}

function normalizeSiteUrlString(value) {
  if (value === `${SITE_URL}/`) {
    return SITE_URL;
  }

  if (/^https:\/\/coderssecret\.com\/[^?#]+\/$/.test(value)) {
    return value.replace(/\/+$/, '');
  }

  return value;
}

function escapeHtml(str) {
  return String(str ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function loadBlogPostsFromModel(blogContent) {
  try {
    const ts = require('typescript');
    const js = ts.transpileModule(blogContent, {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2020,
      },
    }).outputText;
    const mod = { exports: {} };
    new Function('exports', 'require', 'module', js)(mod.exports, require, mod);
    return Array.isArray(mod.exports.BLOG_POSTS) ? mod.exports.BLOG_POSTS : [];
  } catch (err) {
    console.warn(`Could not load blog model for rich blog prerender: ${err.message}`);
    return [];
  }
}

function loadCoursesFromModel(courseContent) {
  try {
    const ts = require('typescript');
    const js = ts.transpileModule(courseContent, {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2020,
      },
    }).outputText;
    const mod = { exports: {} };
    new Function('exports', 'require', 'module', js)(mod.exports, require, mod);
    return Array.isArray(mod.exports.COURSES) ? mod.exports.COURSES : [];
  } catch (err) {
    console.warn(`Could not load course model for rich course hub prerender: ${err.message}`);
    return [];
  }
}

function loadComponentDataFromSource(relativePath, propertyNames) {
  const fullPath = path.join(__dirname, '..', relativePath);
  if (!fs.existsSync(fullPath)) {
    console.warn(`Could not find component source for SEO prerender: ${relativePath}`);
    return {};
  }

  try {
    const ts = require('typescript');
    const sourceText = fs.readFileSync(fullPath, 'utf-8');
    const sourceFile = ts.createSourceFile(fullPath, sourceText, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
    const wanted = new Set(propertyNames);
    const data = {};

    function visit(node) {
      if (
        ts.isPropertyDeclaration(node) &&
        node.initializer &&
        ts.isIdentifier(node.name) &&
        wanted.has(node.name.text)
      ) {
        const expression = sourceText.slice(
          node.initializer.getStart(sourceFile),
          node.initializer.getEnd()
        );
        data[node.name.text] = evaluateTsExpression(expression, `${relativePath}:${node.name.text}`);
      }

      ts.forEachChild(node, visit);
    }

    visit(sourceFile);
    return data;
  } catch (err) {
    console.warn(`Could not extract component data from ${relativePath}: ${err.message}`);
    return {};
  }
}

function evaluateTsExpression(expression, label) {
  try {
    const ts = require('typescript');
    const js = ts.transpileModule(`exports.value = (${expression});`, {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2020,
      },
    }).outputText;
    const mod = { exports: {} };
    new Function('exports', 'module', js)(mod.exports, mod);
    return mod.exports.value;
  } catch (err) {
    console.warn(`Could not evaluate SEO prerender expression ${label}: ${err.message}`);
    return undefined;
  }
}

function rowsForCommandGroup(group) {
  return Array.isArray(group?.rows) ? group.rows : (Array.isArray(group?.items) ? group.items : []);
}

function renderCodeBlock(code, label = 'Example') {
  if (!code) return '';
  return `<figure>
    <figcaption>${escapeHtml(label)}</figcaption>
    <pre><code>${escapeHtml(code)}</code></pre>
  </figure>`;
}

function renderTextList(items) {
  const values = Array.isArray(items) ? items.filter(Boolean) : [];
  return values.length ? `<ul>${values.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul>` : '';
}

function renderLinkList(links) {
  const values = Array.isArray(links) ? links.filter(link => link?.href && link?.label) : [];
  return values.length
    ? `<ul>${values.map(link => `<li><a href="${escapeHtml(link.href)}">${escapeHtml(link.label)}</a>${link.description ? ` - ${escapeHtml(link.description)}` : ''}</li>`).join('')}</ul>`
    : '';
}

function stripHtml(html) {
  return String(html ?? '')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&mdash;/g, '-')
    .replace(/&ndash;/g, '-')
    .replace(/&rarr;/g, '->')
    .replace(/&larr;/g, '<-')
    .replace(/\s+/g, ' ')
    .trim();
}

function clampText(text, maxLength = 155) {
  const normalized = stripHtml(text);
  if (normalized.length <= maxLength) return normalized;
  const clipped = normalized.slice(0, maxLength - 1);
  const lastBreak = Math.max(clipped.lastIndexOf('.'), clipped.lastIndexOf(','), clipped.lastIndexOf(' '));
  return `${clipped.slice(0, lastBreak > 80 ? lastBreak : clipped.length).trim()}...`;
}

function wordCountFor(html) {
  const text = stripHtml(html);
  return text ? text.split(/\s+/).length : 0;
}

function isoDurationFromReadTime(readTime) {
  const minutes = Number(String(readTime ?? '').match(/\d+/)?.[0] ?? 0);
  return minutes > 0 ? `PT${minutes}M` : undefined;
}

function blogSeoTitle(post) {
  return compactSeoTitle(post.title, 55);
}

function blogFaqJsonLd(slug) {
  if (slug === 'are-dags-dying-declarative-data-pipelines') {
    const faqs = [
      {
        question: 'Are DAGs becoming obsolete?',
        answer: 'No. Dependency graphs remain fundamental. What is changing is that more graphs are derived from assets, SQL refs, contracts, and metadata instead of being manually written as task chains.',
      },
      {
        question: 'What is a declarative data pipeline?',
        answer: 'A declarative data pipeline describes desired data assets, dependencies, schemas, freshness expectations, checks, and ownership. The execution engine decides what work must run to keep those assets correct and fresh.',
      },
      {
        question: 'Is Airflow still useful?',
        answer: 'Yes. Airflow remains useful for procedural workflows, broad integrations, and mature scheduling. Teams can still add dbt models, lineage, data contracts, asset naming, and freshness checks.',
      },
      {
        question: 'What is an asset graph?',
        answer: 'An asset graph maps durable data objects such as tables, metrics, files, dashboards, or ML features and the dependencies between them.',
      },
      {
        question: 'Should beginners learn Airflow, dbt, or Dagster first?',
        answer: 'Beginners should learn the concepts first: DAGs, idempotency, retries, partitions, SQL models, tests, and lineage. Then choose tools based on the role and platform.',
      },
    ];

    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': faqs.map(faq => ({
        '@type': 'Question',
        'name': faq.question,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': faq.answer,
        },
      })),
    };
  }

  if (slug === 'mcp-security-production-ai-agents-oauth-gateways') {
    const faqs = [
      {
        question: 'Is MCP secure by default?',
        answer: 'MCP is a protocol, not a complete security platform. Production deployments still need authentication, authorization, token validation, policy enforcement, sandboxing, and audit logging.',
      },
      {
        question: 'Should production MCP deployments use a gateway?',
        answer: 'A gateway is the cleanest control point when MCP tools can access sensitive data, mutate production systems, call internal APIs, or run local commands.',
      },
      {
        question: 'Why is token passthrough dangerous in MCP?',
        answer: 'Token passthrough breaks resource boundaries because an MCP server may accept or forward a token that was not issued for it. Production servers should validate token audience and use separate downstream credentials.',
      },
      {
        question: 'How should MCP tool permissions be designed?',
        answer: 'Design permissions at the tool and action level. Separate discovery, read, write, destructive, network, payment, and admin tools, then require stronger controls for higher-risk actions.',
      },
      {
        question: 'How do you make local MCP servers safer?',
        answer: 'Show the exact startup command, require explicit consent, restrict filesystem access, deny network by default, expose only required secrets, and run the server with least privilege.',
      },
    ];

    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': faqs.map(faq => ({
        '@type': 'Question',
        'name': faq.question,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': faq.answer,
        },
      })),
    };
  }

  if (slug !== 'claude-tokens-hidden-costs-optimization-guide') {
    return undefined;
  }

  const faqs = [
    {
      question: 'Are Claude thinking tokens billed?',
      answer: 'Yes. Anthropic documents that thinking tokens are billed as output tokens, even when thinking is summarized or omitted from the visible response.',
    },
    {
      question: 'Does prompt caching reduce context size?',
      answer: 'No. Prompt caching reduces price and latency for repeated prompt prefixes, but cached tokens still count toward the context window.',
    },
    {
      question: 'Why does Claude Code use more tokens than a simple API call?',
      answer: 'Claude Code can include project instructions, conversation history, tool results, file reads, command output, skills, and MCP or tool context. A short user message can sit on top of a much larger coding session context.',
    },
    {
      question: 'Do MCP servers always load every full schema?',
      answer: 'Current Claude Code guidance says MCP tool definitions are deferred by default, but tool names, selected tools, tool calls, and tool results can still affect context. Disable unused servers and measure with /context.',
    },
    {
      question: 'Does 1M context always mean premium long-context pricing?',
      answer: 'No. Claude Opus 4.7, Opus 4.6, and Sonnet 4.6 include the full 1M-token context window at standard pricing. A huge request is still expensive because it contains more tokens, but it does not add a separate long-context premium for those models.',
    },
    {
      question: 'Is the Claude Code /usage dollar amount my final bill?',
      answer: 'Not necessarily. Claude Code reports useful session token and estimated cost information, but the dollar figure is computed locally and may differ from actual billing. For API billing, use the Claude Console.',
    },
    {
      question: 'Can data residency, fast mode, or server tools change the price?',
      answer: 'Yes. US-only inference can add a 1.1x token multiplier for supported models, Opus 4.6 fast mode is priced at 6x standard token rates, and server-side tools can add usage-based charges beyond normal token cost.',
    },
    {
      question: 'What is the fastest way to cut Claude token cost?',
      answer: 'Use Sonnet for default coding work, cache repeated API prefixes, compact long Claude Code sessions, trim CLAUDE.md, disable unused MCP servers, monitor tool usage, and avoid dumping full files or full logs into context.',
    },
  ];

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': faqs.map(faq => ({
      '@type': 'Question',
      'name': faq.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': faq.answer,
      },
    })),
  };
}

function claudeTokenSlidesPrerender(post) {
  if (post.slug !== 'claude-tokens-hidden-costs-optimization-guide') {
    return undefined;
  }

  const slides = [
    'Claude API vs Claude Code vs claude.ai',
    'The token cost formula',
    'Current Claude API pricing snapshot',
    'Opus 4.7 tokenizer changes',
    'Claude Code project context',
    'CLAUDE.md and skills strategy',
    'MCP deferred tool definitions',
    'Conversation history growth',
    'Thinking tokens billed as output',
    'Prompt caching break-even',
    'API usage object',
    'Claude Code slash commands',
    'Cost-control playbook',
  ];

  const title = 'Claude Token Costs Explained - Interactive Slides';
  const description = 'Watch a narrated slide walkthrough of Claude token costs, Opus 4.7 pricing, prompt caching, Claude Code context, MCP overhead, and thinking tokens.';
  const url = '/slides/claude-tokens-hidden-costs-optimization-guide';
  const content = `<main>
    <nav aria-label="Breadcrumb"><a href="/">Home</a> / <a href="/blog">Blog</a> / <a href="/blog/${post.slug}">${escapeHtml(post.title)}</a> / Slides</nav>
    <h1>${escapeHtml(title)}</h1>
    <p>${escapeHtml(description)}</p>
    <p>This slide deck turns the article into a guided walkthrough with narration, concise visuals, code examples, and a cost-control checklist.</p>
    <img src="/images/blog/claude-token-cost-stack.svg" alt="Claude token cost stack diagram" width="1200" height="630" loading="lazy" decoding="async">
    <section>
      <h2>Slide Outline</h2>
      <ol>${slides.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ol>
    </section>
    <p><a href="/blog/${post.slug}">Read the full article</a></p>
  </main>`;
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'LearningResource',
      'name': title,
      'description': description,
      'url': `${SITE_URL}${url}`,
      'image': `${SITE_URL}/images/blog/claude-token-cost-stack.svg`,
      'isAccessibleForFree': true,
      'inLanguage': 'en',
      'learningResourceType': 'Slide deck',
      'about': ['Claude API', 'Claude Code', 'Prompt Caching', 'MCP', 'Token Costs'],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [
        { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': SITE_URL },
        { '@type': 'ListItem', 'position': 2, 'name': 'Blog', 'item': `${SITE_URL}/blog` },
        { '@type': 'ListItem', 'position': 3, 'name': post.title, 'item': `${SITE_URL}/blog/${post.slug}` },
        { '@type': 'ListItem', 'position': 4, 'name': 'Slides', 'item': `${SITE_URL}${url}` },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      'name': 'Claude Token Costs slide outline',
      'itemListElement': slides.map((item, index) => ({
        '@type': 'ListItem',
        'position': index + 1,
        'name': item,
      })),
    },
  ];

  return { title, description, url, content, jsonLd, image: '/images/blog/claude-token-cost-stack.svg', extraHead: NOINDEX_FOLLOW_META };
}

function compactSeoTitle(title, maxLength) {
  const normalized = stripHtml(title);
  if (normalized.length <= maxLength) return normalized;

  const separators = [': ', ' - ', ' | '];
  for (const separator of separators) {
    const parts = normalized.split(separator);
    if (parts.length < 2) continue;

    let candidate = parts[0];
    for (let i = 1; i < parts.length; i++) {
      const next = `${candidate}${separator}${parts[i]}`;
      if (next.length > maxLength) break;
      candidate = next;
    }

    if (candidate.length >= 28) return candidate;
    const guided = `${candidate} Guide`;
    return guided.length <= maxLength ? guided : candidate;
  }

  return trimAtWord(normalized, maxLength);
}

function trimAtWord(text, maxLength) {
  const clipped = text.slice(0, maxLength);
  const lastSpace = clipped.lastIndexOf(' ');
  return clipped.slice(0, lastSpace > 30 ? lastSpace : clipped.length).trim();
}

function loadBlogPostContent(slug) {
  const contentPath = path.join(__dirname, '..', 'src', 'app', 'models', 'blog-content', `${slug}.ts`);
  if (!fs.existsSync(contentPath)) return '';

  try {
    const ts = require('typescript');
    const js = ts.transpileModule(fs.readFileSync(contentPath, 'utf-8'), {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2020,
      },
    }).outputText;
    const mod = { exports: {} };
    new Function('exports', 'require', 'module', js)(mod.exports, require, mod);
    return typeof mod.exports.CONTENT === 'string' ? enrichBlogHtml(mod.exports.CONTENT) : '';
  } catch (err) {
    console.warn(`Could not load blog content for ${slug}: ${err.message}`);
    return '';
  }
}

function enrichBlogHtml(html) {
  return String(html ?? '').replace(/<img\b[^>]*>/gi, tag => {
    const src = tag.match(/\bsrc=["']([^"']+)["']/i)?.[1];
    const dimensions = knownImageDimensions[src];
    let next = tag;

    if (dimensions) {
      next = addHtmlAttribute(next, 'width', dimensions.width);
      next = addHtmlAttribute(next, 'height', dimensions.height);
    }

    next = addHtmlAttribute(next, 'loading', 'lazy');
    next = addHtmlAttribute(next, 'decoding', 'async');
    return next;
  });
}

function addHtmlAttribute(tag, name, value) {
  if (new RegExp(`\\s${name}=`, 'i').test(tag)) return tag;
  return tag.replace(/\s*\/?>$/, ending => ` ${name}="${escapeHtml(value)}"${ending}`);
}

const knownImageDimensions = {
  '/images/blog/claude-token-cost-stack.svg': { width: 1200, height: 630 },
  '/images/blog/mcp-security-gateway-architecture.svg': { width: 1200, height: 630 },
  '/images/drf-api-logger/01-admin-dashboard.png': { width: 2880, height: 1800 },
  '/images/drf-api-logger/02-api-logs-list.png': { width: 2880, height: 4478 },
  '/images/drf-api-logger/03-api-log-detail-slow-sql.png': { width: 2880, height: 3180 },
  '/images/drf-api-logger/04-api-log-detail-login-masked.png': { width: 2880, height: 3182 },
  '/images/drf-api-logger/05-api-log-detail-n-plus-one.png': { width: 2880, height: 3316 },
  '/images/drf-api-logger/06-api-log-detail-echo-masked.png': { width: 2880, height: 2344 },
};

function totalLabsFor(course) {
  return course.modules.reduce((sum, mod) => sum + mod.labs.length, 0);
}

function labCountLabelFor(course, includePlus = false) {
  const count = totalLabsFor(course);
  if (course.labDelivery === 'inline') return `${count} inline exercises`;
  return `${count}${includePlus ? '+' : ''} hands-on labs`;
}

function moduleLabLabelFor(course, mod) {
  if (course.labDelivery === 'inline') {
    return `${mod.labs.length} inline ${mod.labs.length === 1 ? 'exercise' : 'exercises'}`;
  }
  return `${mod.labs.length} hands-on ${mod.labs.length === 1 ? 'lab' : 'labs'}`;
}

function courseImagePath(course) {
  return `/images/banners/course-${course.slug}.svg`;
}

function courseShortName(course) {
  return {
    'mastering-spiffe-spire': 'SPIFFE',
    'cloud-native-security-engineering': 'Cloud Security',
    'production-rag-systems-engineering': 'RAG Systems',
    'distributed-systems-engineering': 'Distributed Sys',
    'production-analytics-engineering-dbt': 'Analytics dbt',
  }[course.slug] || compactSeoTitle(course.title, 24);
}

function courseSeoCourseTitle(course) {
  return {
    'mastering-spiffe-spire': 'SPIFFE & SPIRE Zero Trust Course',
    'cloud-native-security-engineering': 'Cloud Native Security Free Course',
    'production-rag-systems-engineering': 'Production RAG Engineering Course',
    'distributed-systems-engineering': 'Distributed Systems Engineering Course',
    'production-analytics-engineering-dbt': 'Analytics Engineering with dbt Course',
  }[course.slug] || compactSeoTitle(`${course.title} Free Course`, 52);
}

function courseSeoTitle(course) {
  return courseSeoCourseTitle(course);
}

function courseSeoDescription(course) {
  const labCount = totalLabsFor(course);
  if (course.slug === 'mastering-spiffe-spire') {
    return `Free ${course.modules.length}-module SPIFFE/SPIRE course: deploy SPIRE on Kubernetes, issue SVIDs, configure mTLS, enforce OPA, federate clusters, and run ${labCount} labs.`;
  }
  return clampText(`${course.excerpt} ${course.modules.length} modules, ${labCountLabelFor(course)}, free.`);
}

function moduleSeoTitle(course, mod) {
  const title = course.slug === 'mastering-spiffe-spire' ? spiffeModuleShortTitle(mod) : mod.title;
  return `M${mod.number}: ${compactSeoTitle(title, 34)} | ${courseShortName(course)}`;
}

function spiffeModuleShortTitle(mod) {
  const titles = {
    1: 'Zero Trust Security',
    2: 'PKI Foundations',
    3: 'SPIFFE Fundamentals',
    4: 'SPIRE Architecture',
    5: 'SPIRE on Kubernetes',
    6: 'SVIDs & Workload API',
    7: 'Authorization & OPA',
    8: 'Service Mesh Integrations',
    9: 'Advanced SPIRE Architecture',
    10: 'SPIRE Operations',
    11: 'SPIFFE/SPIRE Ecosystem',
    12: 'Zero Trust Platform Capstone',
    13: 'SPIFFE for AI Infrastructure',
  };
  return titles[mod.number] || mod.title;
}

function moduleSeoDescription(course, mod) {
  const labLabel = mod.labs.length === 1 ? 'lab' : 'labs';
  const objectives = (mod.objectives || []).slice(0, 2).join('; ');
  const practice = mod.labs.length > 0
    ? `${mod.labs.length} hands-on ${labLabel}`
    : 'guided production practice';
  return clampText(`Free ${courseShortName(course)} module ${mod.number}: ${mod.subtitle}. ${objectives ? `Learn ${objectives}. ` : ''}Includes ${practice}.`, 165);
}

function courseBreadcrumbJsonLd(course, extraCrumbs = []) {
  const crumbs = [
    { name: 'Home', url: '/' },
    { name: 'Courses', url: '/courses' },
    { name: course.title, url: `/courses/${course.slug}` },
    ...extraCrumbs,
  ];
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': crumbs.map((crumb, i) => ({
      '@type': 'ListItem',
      'position': i + 1,
      'name': crumb.name,
      'item': `${SITE_URL}${crumb.url}`,
    })),
  };
}

function courseJsonLd(course) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    'name': course.title,
    'description': courseSeoDescription(course),
    'url': `${SITE_URL}/courses/${course.slug}`,
    'image': `${SITE_URL}${courseImagePath(course)}`,
    'provider': {
      '@type': 'Organization',
      'name': 'CodersSecret',
      'sameAs': SITE_URL,
    },
    'instructor': {
      '@type': 'Person',
      'name': course.instructor.name,
      'url': course.instructor.github,
    },
    'offers': {
      '@type': 'Offer',
      'price': 0,
      'priceCurrency': 'USD',
      'availability': 'https://schema.org/InStock',
      'category': 'Free',
    },
    'hasCourseInstance': {
      '@type': 'CourseInstance',
      'courseMode': 'online',
      'courseWorkload': course.totalDuration,
      'instructor': {
        '@type': 'Person',
        'name': course.instructor.name,
      },
    },
    'educationalLevel': course.level,
    'teaches': course.tags,
    'numberOfCredits': course.modules.length,
    'isAccessibleForFree': true,
    'inLanguage': 'en',
    'hasPart': course.modules.map(mod => ({
      '@type': 'LearningResource',
      'name': `Module ${mod.number}: ${mod.title}`,
      'url': `${SITE_URL}/courses/${course.slug}/${mod.slug}`,
      'description': moduleSeoDescription(course, mod),
      'position': mod.number,
      'isAccessibleForFree': true,
    })),
  };
}

function courseModuleItemListJsonLd(course) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    'name': `${course.title} curriculum`,
    'itemListElement': course.modules.map(mod => ({
      '@type': 'ListItem',
      'position': mod.number,
      'url': `${SITE_URL}/courses/${course.slug}/${mod.slug}`,
      'name': `Module ${mod.number}: ${mod.title}`,
    })),
  };
}

function moduleJsonLd(course, mod) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LearningResource',
    'name': `Module ${mod.number}: ${mod.title}`,
    'description': moduleSeoDescription(course, mod),
    'url': `${SITE_URL}/courses/${course.slug}/${mod.slug}`,
    'learningResourceType': 'Course module',
    'isAccessibleForFree': true,
    'inLanguage': 'en',
    'position': mod.number,
    'timeRequired': mod.duration,
    'teaches': mod.objectives,
    'about': course.tags,
    'provider': {
      '@type': 'Organization',
      'name': 'CodersSecret',
      'url': SITE_URL,
    },
    'creator': {
      '@type': 'Person',
      'name': course.instructor.name,
      'url': course.instructor.github,
    },
    'isPartOf': {
      '@type': 'Course',
      'name': course.title,
      'url': `${SITE_URL}/courses/${course.slug}`,
    },
  };
}

function renderList(items) {
  return items && items.length > 0
    ? `<ul>${items.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`
    : '';
}

function renderOptionalList(title, items) {
  return items && items.length > 0
    ? `<section><h2>${escapeHtml(title)}</h2>${renderList(items)}</section>`
    : '';
}

function renderCourseLandingContent(course) {
  const curriculum = course.modules.map(mod => `<li>
    <a href="/courses/${course.slug}/${mod.slug}">Module ${mod.number}: ${escapeHtml(mod.title)}</a>
    <p>${escapeHtml(mod.subtitle)} ${escapeHtml(mod.duration)}. ${moduleLabLabelFor(course, mod)}.</p>
    ${renderList(mod.objectives)}
  </li>`).join('\n');
  const faq = course.faqs && course.faqs.length > 0
    ? `<section><h2>Frequently Asked Questions</h2>${course.faqs.map(item => `<h3>${escapeHtml(item.question)}</h3><p>${escapeHtml(item.answer)}</p>`).join('\n')}</section>`
    : '';

  return `<main>
    <nav aria-label="Breadcrumb"><a href="/">Home</a> / <a href="/courses">Courses</a> / ${escapeHtml(course.title)}</nav>
    <h1>${escapeHtml(course.title)}</h1>
    <p>${escapeHtml(courseSeoDescription(course))}</p>
    <section>
      <h2>What You Will Learn</h2>
      <p>${escapeHtml(course.description)}</p>
      <p>${course.modules.length} modules, ${labCountLabelFor(course, true)}, ${escapeHtml(course.totalDuration)}, ${escapeHtml(course.level)}, 100% free.</p>
      ${renderList(course.targetAudience)}
    </section>
    <section>
      <h2>Full Curriculum</h2>
      <ol>${curriculum}</ol>
    </section>
    <section>
      <h2>Course Topics</h2>
      <p>${course.tags.map(escapeHtml).join(', ')}</p>
    </section>
    <section>
      <h2>Instructor</h2>
      <h3>${escapeHtml(course.instructor.name)}</h3>
      <p>${escapeHtml(course.instructor.title)}</p>
      <p>${escapeHtml(course.instructor.bio)}</p>
      ${renderList(course.instructor.achievements)}
    </section>
    ${faq}
  </main>`;
}

function renderLabs(course, mod) {
  if (!mod.labs || mod.labs.length === 0) return '';
  const heading = course.labDelivery === 'inline' ? 'Inline Exercises' : 'Hands-On Labs';
  return `<section>
    <h2>${heading}</h2>
    <ol>${mod.labs.map(lab => `<li>
      <h3>${escapeHtml(lab.title)}</h3>
      <p>${escapeHtml(lab.objective)}</p>
      <p>${[lab.duration, lab.difficulty].filter(Boolean).map(escapeHtml).join(' - ')}</p>
      ${renderList(lab.steps)}
      ${lab.repoPath && course.labDelivery !== 'inline' ? `<p><a href="https://github.com/vishalanandl177/${course.slug}/tree/main/${escapeHtml(lab.repoPath)}">View lab files on GitHub</a></p>` : '<p>Inline lab: complete the exercise directly in the course page.</p>'}
    </li>`).join('\n')}</ol>
  </section>`;
}

function renderTradeoffs(tradeoffs) {
  if (!tradeoffs || tradeoffs.length === 0) return '';
  return `<section>
    <h2>Design Tradeoffs</h2>
    ${tradeoffs.map(trade => `<h3>${escapeHtml(trade.option)}</h3><h4>Pros</h4>${renderList(trade.pros)}<h4>Cons</h4>${renderList(trade.cons)}`).join('\n')}
  </section>`;
}

function renderGlossary(glossary) {
  if (!glossary || glossary.length === 0) return '';
  return `<section>
    <h2>Key Terms</h2>
    <dl>${glossary.map(item => `<dt>${escapeHtml(item.term)}</dt><dd>${escapeHtml(item.definition)}</dd>`).join('\n')}</dl>
  </section>`;
}

function renderModuleContent(course, mod) {
  const prev = course.modules.find(item => item.number === mod.number - 1);
  const next = course.modules.find(item => item.number === mod.number + 1);
  const content = String(mod.content || '').replace(/<h1[\s\S]*?<\/h1>/gi, '');
  const diagram = mod.svgDiagram
    ? `<figure>${mod.svgDiagram}<figcaption>Architecture diagram for Module ${mod.number}: ${escapeHtml(mod.title)}.</figcaption></figure>`
    : '';
  const navigationLinks = [
    prev ? `<a href="/courses/${course.slug}/${prev.slug}">Previous module: ${escapeHtml(prev.title)}</a>` : '',
    `<a href="/courses/${course.slug}">Back to full curriculum</a>`,
    next ? `<a href="/courses/${course.slug}/${next.slug}">Next module: ${escapeHtml(next.title)}</a>` : '',
  ].filter(Boolean).join(' | ');

  return `<main>
    <nav aria-label="Breadcrumb"><a href="/">Home</a> / <a href="/courses">Courses</a> / <a href="/courses/${course.slug}">${escapeHtml(course.title)}</a> / Module ${mod.number}</nav>
    <article>
      <h1>Module ${mod.number}: ${escapeHtml(mod.title)}</h1>
      <p>${escapeHtml(mod.subtitle)}</p>
      <p>${escapeHtml(mod.duration)}. ${moduleLabLabelFor(course, mod)}. Free course module.</p>
      <section><h2>Learning Objectives</h2>${renderList(mod.objectives)}</section>
      ${mod.whyThisMatters ? `<section><h2>Why This Matters</h2><p>${escapeHtml(mod.whyThisMatters)}</p></section>` : ''}
      ${diagram}
      <section><h2>Lesson Content</h2>${content}</section>
      ${renderOptionalList('Real-World Use Cases', mod.realWorldUseCases)}
      ${renderOptionalList('Production Notes', mod.productionNotes)}
      ${renderOptionalList('Common Mistakes', mod.commonMistakes)}
      ${renderOptionalList('Security Risks to Watch', mod.securityRisks)}
      ${renderTradeoffs(mod.designTradeoffs)}
      ${renderOptionalList('Production Alternatives', mod.productionAlternatives?.map(item => `${item.name}: ${item.description}`))}
      ${renderOptionalList('Think Like an Engineer', mod.thinkLikeAnEngineer)}
      ${mod.operationalStory ? `<section><h2>Production Story</h2><p>${escapeHtml(mod.operationalStory)}</p></section>` : ''}
      ${mod.careerRelevance ? `<section><h2>Career Relevance</h2><p>${escapeHtml(mod.careerRelevance)}</p></section>` : ''}
      ${renderGlossary(mod.glossary)}
      ${renderLabs(course, mod)}
      <section><h2>Key Takeaways</h2>${renderList(mod.keyTakeaways)}</section>
      <nav aria-label="Course module navigation">${navigationLinks}</nav>
    </article>
  </main>`;
}

function writeCourseModulePage(course, mod) {
  const moduleDir = path.join(OUTPUT_DIR, 'courses', course.slug, mod.slug);
  fs.mkdirSync(moduleDir, { recursive: true });
  fs.writeFileSync(path.join(moduleDir, 'index.html'), makeHtml({
    title: moduleSeoTitle(course, mod),
    description: moduleSeoDescription(course, mod),
    url: `/courses/${course.slug}/${mod.slug}`,
    image: courseImagePath(course),
    content: renderModuleContent(course, mod),
    jsonLd: [
      courseBreadcrumbJsonLd(course, [{ name: `Module ${mod.number}: ${mod.title}`, url: `/courses/${course.slug}/${mod.slug}` }]),
      moduleJsonLd(course, mod),
    ],
  }));
  created++;

  writeCourseModuleSlidesPage(course, mod);
}

function writeCourseModuleSlidesPage(course, mod) {
  const slidesDir = path.join(OUTPUT_DIR, 'courses', course.slug, mod.slug, 'slides');
  fs.mkdirSync(slidesDir, { recursive: true });
  fs.writeFileSync(path.join(slidesDir, 'index.html'), makeHtml({
    title: moduleSlidesSeoTitle(course, mod),
    description: moduleSlidesSeoDescription(course, mod),
    url: `/courses/${course.slug}/${mod.slug}/slides`,
    image: courseImagePath(course),
    extraHead: NOINDEX_FOLLOW_META,
    content: renderModuleSlidesContent(course, mod),
    jsonLd: courseModuleSlidesJsonLd(course, mod),
  }));
  created++;
}

function moduleSlidesSeoTitle(course, mod) {
  return compactSeoTitle(`Module ${mod.number}: ${mod.title} Slides`, 55);
}

function moduleSlidesSeoDescription(course, mod) {
  return clampText(`Slide walkthrough for Module ${mod.number} of ${course.title}: ${mod.subtitle}. Covers objectives, production notes, labs, and key takeaways.`, 155);
}

function renderModuleSlidesContent(course, mod) {
  const outline = courseModuleSlideOutline(course, mod);

  return `<main>
    <nav aria-label="Breadcrumb"><a href="/">Home</a> / <a href="/courses">Courses</a> / <a href="/courses/${course.slug}">${escapeHtml(course.title)}</a> / <a href="/courses/${course.slug}/${mod.slug}">Module ${mod.number}</a> / Slides</nav>
    <article>
      <h1>Module ${mod.number}: ${escapeHtml(mod.title)} Slides</h1>
      <p>${escapeHtml(moduleSlidesSeoDescription(course, mod))}</p>
      <p>This slide page is the visual review companion for the full course module. Use it to recap the architecture, examples, exercises, production warnings, and takeaways after reading the lesson.</p>
      <section>
        <h2>Slide Outline</h2>
        <ol>${outline.map(item => `<li><strong>${escapeHtml(item.title)}</strong>${item.description ? ` - ${escapeHtml(item.description)}` : ''}</li>`).join('')}</ol>
      </section>
      <section>
        <h2>Learning Objectives</h2>
        ${renderList(mod.objectives)}
      </section>
      ${mod.whyThisMatters ? `<section><h2>Why This Module Matters</h2><p>${escapeHtml(mod.whyThisMatters)}</p></section>` : ''}
      ${renderOptionalList('Production Notes', mod.productionNotes)}
      ${renderOptionalList('Common Mistakes', mod.commonMistakes)}
      ${renderOptionalList('Key Takeaways', mod.keyTakeaways)}
      ${renderLabs(course, mod)}
      <p><a href="/courses/${course.slug}/${mod.slug}">Read the full module</a> | <a href="/courses/${course.slug}">Back to course curriculum</a></p>
    </article>
  </main>`;
}

function courseModuleSlideOutline(course, mod) {
  const h2s = [...String(mod.content || '').matchAll(/<h2[^>]*>(.*?)<\/h2>/gi)]
    .map(match => stripHtml(match[1]))
    .filter(Boolean)
    .slice(0, 8);

  return [
    { title: `${mod.title}`, description: mod.subtitle },
    { title: 'Learning Objectives', description: `${mod.objectives.length} outcomes for this module` },
    mod.whyThisMatters ? { title: 'Why This Module Matters', description: stripHtml(mod.whyThisMatters).slice(0, 120) } : undefined,
    mod.beforeAfter ? { title: 'Before vs After', description: 'The operational shift this module teaches' } : undefined,
    ...h2s.map(title => ({ title, description: 'Lesson section from the full module' })),
    mod.realWorldUseCases?.length ? { title: 'Real-World Use Cases', description: mod.realWorldUseCases.slice(0, 2).join(', ') } : undefined,
    mod.commonMistakes?.length ? { title: 'Common Mistakes to Avoid', description: `${mod.commonMistakes.length} mistakes covered` } : undefined,
    mod.productionNotes?.length ? { title: 'Production Notes', description: `${mod.productionNotes.length} practical notes` } : undefined,
    mod.securityRisks?.length ? { title: 'Security Risks to Watch', description: `${mod.securityRisks.length} risks covered` } : undefined,
    mod.labs?.length ? { title: course.labDelivery === 'inline' ? 'Inline Exercises' : 'Hands-On Labs', description: moduleLabLabelFor(course, mod) } : undefined,
    { title: 'Key Takeaways', description: `${mod.keyTakeaways.length} points to remember` },
  ].filter(Boolean);
}

function courseModuleSlidesJsonLd(course, mod) {
  return [
    courseBreadcrumbJsonLd(course, [
      { name: `Module ${mod.number}: ${mod.title}`, url: `/courses/${course.slug}/${mod.slug}` },
      { name: 'Slides', url: `/courses/${course.slug}/${mod.slug}/slides` },
    ]),
    {
      '@context': 'https://schema.org',
      '@type': 'LearningResource',
      'name': `Module ${mod.number}: ${mod.title} Slides`,
      'description': moduleSlidesSeoDescription(course, mod),
      'url': `${SITE_URL}/courses/${course.slug}/${mod.slug}/slides`,
      'learningResourceType': 'Slide deck',
      'isAccessibleForFree': true,
      'inLanguage': 'en',
      'teaches': mod.objectives,
      'isPartOf': {
        '@type': 'LearningResource',
        'name': `Module ${mod.number}: ${mod.title}`,
        'url': `${SITE_URL}/courses/${course.slug}/${mod.slug}`,
      },
      'provider': {
        '@type': 'Organization',
        'name': 'CodersSecret',
        'url': SITE_URL,
      },
    },
  ];
}

function renderSeoLandingContent(course, page) {
  const target = course.modules.find(mod => mod.number === page.ctaModule);
  const ctaHref = target ? `/courses/${course.slug}/${target.slug}` : `/courses/${course.slug}`;
  return `<main>
    <nav aria-label="Breadcrumb"><a href="/">Home</a> / <a href="/courses">Courses</a> / ${escapeHtml(page.title)}</nav>
    <article>${page.content}</article>
    <section>
      <h2>How to Use This Topic</h2>
      <p>This page is a focused entry point into the larger course. Use it to understand the vocabulary, the production problem, and the first practical module to open next.</p>
      <ul>
        <li>Read the overview to map the concept to real engineering work.</li>
        <li>Follow the linked module for exercises, diagrams, and implementation details.</li>
        <li>Return to the full curriculum when you need adjacent topics and a complete learning path.</li>
      </ul>
    </section>
    <section>
      <h2>Start Learning for Free</h2>
      <p>Continue with ${escapeHtml(course.title)}: ${course.modules.length} modules, ${labCountLabelFor(course)}, completely free.</p>
      <p><a href="${ctaHref}">Start Module ${page.ctaModule}</a> | <a href="/courses/${course.slug}">View full curriculum</a></p>
    </section>
  </main>`;
}

function seoLandingJsonLd(course, page) {
  return [
    courseBreadcrumbJsonLd(course, [{ name: page.title, url: `/courses/${page.slug}` }]),
    {
      '@context': 'https://schema.org',
      '@type': 'TechArticle',
      'headline': page.title,
      'description': page.description,
      'url': `${SITE_URL}/courses/${page.slug}`,
      'isPartOf': {
        '@type': 'Course',
        'name': course.title,
        'url': `${SITE_URL}/courses/${course.slug}`,
      },
      'author': {
        '@type': 'Person',
        'name': course.instructor.name,
        'url': course.instructor.github,
      },
      'publisher': {
        '@type': 'Organization',
        'name': 'CodersSecret',
        'url': SITE_URL,
      },
      'inLanguage': 'en',
    },
  ];
}

let created = 0;

// Home page (/)
const topHomePosts = posts.slice(0, 10);
const homeCategoryLinks = [...categories]
  .map(cat => `<li><a href="/category/${cat}">${categoryNames[cat] || cat}</a></li>`)
  .join('\n      ');
const homeContent = `
  <main>
    <h1>CodersSecret - Security, AI, Data and Production Engineering</h1>
    <p>${HOME_DESCRIPTION}</p>
    <section>
      <h2>Free Production Engineering Courses</h2>
      <p>Learn workload identity, Kubernetes security, Zero Trust, DevSecOps, API security, production RAG, distributed systems, and analytics engineering through practical modules, labs, diagrams, and engineering guides.</p>
      <ul>
        <li><a href="/courses/mastering-spiffe-spire">Master SPIFFE and SPIRE for Workload Identity</a> - deploy SPIRE, issue SVIDs, federate trust domains, and replace long-lived secrets.</li>
        <li><a href="/courses/cloud-native-security-engineering">Cloud Native Security Engineering</a> - secure Kubernetes, containers, service mesh, policy-as-code, runtime detection, and CI/CD pipelines.</li>
        <li><a href="/courses/production-rag-systems-engineering">Production RAG Systems Engineering</a> - build reliable retrieval, vector search, AI agent, evaluation, and deployment workflows.</li>
        <li><a href="/courses/distributed-systems-engineering">Distributed Systems Engineering</a> - learn CAP, consensus, replication, scalability, reliability, Zero Trust, observability, and Kubernetes-native architecture.</li>
        <li><a href="/courses/production-analytics-engineering-dbt">Production Analytics Engineering with dbt</a> - learn transformations, marts, tests, metrics, semantic layers, lineage, and data quality workflows.</li>
      </ul>
    </section>
    <section>
      <h2>Popular Engineering Topics</h2>
      <ul>
        <li><a href="/glossary/workload-identity">Workload identity</a>, <a href="/glossary/spiffe">SPIFFE</a>, <a href="/glossary/spire">SPIRE</a>, and <a href="/glossary/mtls">mTLS</a></li>
        <li><a href="/courses/kubernetes-runtime-security">Kubernetes runtime security</a>, supply-chain signing, OPA policy, Falco, and eBPF detection</li>
        <li><a href="/courses/production-analytics-engineering-dbt/semantic-layer-fundamentals">Semantic layers</a>, governed metrics, dbt lineage, and analytics engineering quality gates</li>
        <li><a href="/games">Interactive security simulators</a> and <a href="/cheatsheets">developer cheatsheets</a></li>
      </ul>
    </section>
    <section>
      <h2>Latest Engineering Guides</h2>
      <ul>
        ${topHomePosts.map(p => `<li><a href="/blog/${p.slug}">${escapeHtml(p.title)}</a> - ${escapeHtml(p.excerpt)}</li>`).join('\n        ')}
      </ul>
    </section>
    <section>
      <h2>Watch and Listen</h2>
      <p>CodersSecret is also on YouTube and Spotify, with visual tutorials and audio-first engineering explainers based on the same production backend, security, Kubernetes, AI, and data engineering topics.</p>
      <ul>
        <li><a href="${YOUTUBE_URL}">Watch CodersSecret tutorials on YouTube</a></li>
        <li><a href="${SPOTIFY_PODCAST_URL}">Listen to the CodersSecret Podcast on Spotify</a></li>
      </ul>
      <p>Recent podcast topics include Claude token costs, OAuth authentication mistakes, and Delta Lake vs Iceberg.</p>
    </section>
    <section>
      <h2>Article Categories</h2>
      <ul>
        ${homeCategoryLinks}
      </ul>
    </section>
    <section>
      <h2>About CodersSecret</h2>
      <p>CodersSecret is written by Vishal Anand for engineers who build, secure, and operate production systems. Every course and guide is free, ad-free, and focused on real infrastructure trade-offs.</p>
      <p><a href="/about">Learn more about CodersSecret</a></p>
    </section>
  </main>
`;

const homeJsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    'name': 'CodersSecret',
    'url': SITE_URL,
    'logo': `${SITE_URL}/logo.svg`,
    'description': HOME_DESCRIPTION,
    'sameAs': [
      'https://instagram.com/vis_naz',
      'https://linkedin.com/in/vishal-techlead',
      YOUTUBE_URL,
      SPOTIFY_PODCAST_URL,
      GITHUB_REPO_URL,
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    'name': 'CodersSecret',
    'url': SITE_URL,
    'description': HOME_DESCRIPTION,
    'potentialAction': {
      '@type': 'SearchAction',
      'target': `${SITE_URL}/blog?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'PodcastSeries',
    'name': 'CodersSecret Podcast',
    'description': 'Audio-first engineering explainers on backend systems, cloud native security, AI, data engineering, and production architecture.',
    'url': SPOTIFY_PODCAST_URL,
    'inLanguage': 'en',
    'publisher': {
      '@type': 'Organization',
      'name': 'CodersSecret',
      'url': SITE_URL,
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': [
      {
        '@type': 'Question',
        'name': 'What is cloud native security?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Cloud native security secures containerized, distributed systems with identity-based controls, defense-in-depth, policy-as-code, runtime detection, and secure service communication.',
        },
      },
      {
        '@type': 'Question',
        'name': 'Are the CodersSecret courses free?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Yes. CodersSecret courses, modules, labs, diagrams, articles, and slide tutorials are free and ad-free.',
        },
      },
      {
        '@type': 'Question',
        'name': 'Who writes CodersSecret?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'CodersSecret is written by Vishal Anand, a Senior Product Engineer and Tech Lead focused on backend architecture, DevOps, security, Kubernetes, Python, and system design.',
        },
      },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    'name': 'CodersSecret featured guides',
    'itemListElement': topHomePosts.map((post, i) => ({
      '@type': 'ListItem',
      'position': i + 1,
      'url': `${SITE_URL}/blog/${post.slug}`,
      'name': post.title,
    })),
  },
];

fs.writeFileSync(path.join(OUTPUT_DIR, 'index.html'), makeHtml({
  title: 'CodersSecret',
  fullTitle: HOME_TITLE,
  description: HOME_DESCRIPTION,
  url: '/',
  content: homeContent,
  jsonLd: homeJsonLd,
}));
created++;

// ── Blog list page (/blog) ────────────────────
const BLOG_LIST_TITLE = 'Blog | CodersSecret | Practical Engineering Tutorials';
const BLOG_LIST_DESCRIPTION = 'Practical tutorials on system design, security, DevOps, AI, cloud, Python, databases, and production software engineering.';
const visibleBlogPosts = posts.slice(0, 24);
const startHerePosts = posts.filter(post => post.featured).slice(0, 4);
const topicLinks = [
  ['Security', 'security'],
  ['System Design', 'system-design'],
  ['DevOps', 'devops'],
  ['AI', 'ai'],
  ['Python', 'python'],
  ['Cloud', 'cloud'],
  ['Data', 'data'],
  ['Frontend', 'frontend'],
  ['Career', 'career'],
];
const blogListContent = `
  <nav aria-label="Breadcrumb"><a href="/">Home</a> / Blog</nav>
  <header>
    <p>CodersSecret blog</p>
    <h1>Learn the systems behind production software</h1>
    <p>${escapeHtml(BLOG_LIST_DESCRIPTION)}</p>
    <p><a href="/courses">Start with courses</a> <a href="/cheatsheets">Use reference sheets</a></p>
  </header>
  <section aria-labelledby="blog-start-here">
    <p>Start here</p>
    <h2 id="blog-start-here">Featured paths for practical engineers</h2>
    <ul>
      ${(startHerePosts.length ? startHerePosts : posts.slice(0, 4)).map(post => `<li><a href="/blog/${post.slug}">${escapeHtml(post.title)}</a> - ${escapeHtml(post.excerpt)} <a href="/slides/${post.slug}">Watch as Slides</a></li>`).join('\n      ')}
    </ul>
  </section>
  <section aria-labelledby="blog-topics">
    <p>Browse by topic</p>
    <h2 id="blog-topics">Find the guide that matches your work</h2>
    <ul>
      ${topicLinks.map(([label]) => `<li><span>${escapeHtml(label)}</span></li>`).join('\n      ')}
    </ul>
  </section>
  <section aria-labelledby="blog-latest">
    <p>Latest practical guides</p>
    <h2 id="blog-latest">Newest engineering tutorials</h2>
    <ul>
      ${posts.map(post => `<li><article><h3><a href="/blog/${post.slug}">${escapeHtml(post.title)}</a></h3><p>${escapeHtml(post.excerpt)}</p><p>${escapeHtml(categoryNames[post.category] || post.category || 'Guide')} ${post.date ? `| ${escapeHtml(post.date)}` : ''} ${post.readTime ? `| ${escapeHtml(post.readTime)}` : ''}</p><p><a href="/blog/${post.slug}">Read article</a> <a href="/slides/${post.slug}">Watch as Slides</a></p></article></li>`).join('\n      ')}
    </ul>
  </section>
`;
const blogListJsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    'name': BLOG_LIST_TITLE,
    'description': BLOG_LIST_DESCRIPTION,
    'url': `${SITE_URL}/blog`,
    'mainEntity': {
      '@type': 'ItemList',
      'numberOfItems': visibleBlogPosts.length,
      'itemListElement': visibleBlogPosts.map((post, index) => ({
        '@type': 'ListItem',
        'position': index + 1,
        'url': `${SITE_URL}/blog/${post.slug}`,
        'name': post.title,
        'description': post.excerpt,
      })),
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'Home',
        'item': SITE_URL,
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': 'Blog',
        'item': `${SITE_URL}/blog`,
      },
    ],
  },
];
const blogDir = path.join(OUTPUT_DIR, 'blog');
fs.mkdirSync(blogDir, { recursive: true });
fs.writeFileSync(path.join(blogDir, 'index.html'), makeHtml({
  title: BLOG_LIST_TITLE,
  description: BLOG_LIST_DESCRIPTION,
  url: '/blog',
  content: blogListContent,
  jsonLd: blogListJsonLd,
}));
created++;

// ── Individual blog posts (/blog/:slug) ───────
for (const post of posts) {
  const dir = path.join(OUTPUT_DIR, 'blog', post.slug);
  fs.mkdirSync(dir, { recursive: true });

  // Find related posts by category/tags
  const related = posts
    .filter(p => p.slug !== post.slug && (p.category === post.category || (p.tags || []).some(tag => (post.tags || []).includes(tag))))
    .slice(0, 3);
  const tags = post.tags || [];
  const articleHtml = loadBlogPostContent(post.slug);
  const articleBody = articleHtml
    ? `<div class="article-body">${articleHtml}</div>`
    : `<p>${escapeHtml(post.excerpt)}</p>`;
  const articleWordCount = wordCountFor(articleHtml || post.excerpt);
  const authorName = post.author || 'Vishal Anand';
  const seoTitle = blogSeoTitle(post);

  const content = `
    <article>
      <nav aria-label="Breadcrumb"><a href="/">Home</a> / <a href="/blog">Blog</a> / ${escapeHtml(post.title)}</nav>
      <h1>${escapeHtml(post.title)}</h1>
      <p>By ${escapeHtml(authorName)} | ${post.date || ''} | Category: ${escapeHtml(categoryNames[post.category] || post.category || '')} | ${escapeHtml(post.readTime || '')}</p>
      <p>${escapeHtml(post.excerpt)}</p>
      ${articleBody}
      ${tags.length > 0 ? '<p>Tags: ' + tags.map(t => `<span>${escapeHtml(t)}</span>`).join(', ') + '</p>' : ''}
      ${related.length > 0 ? '<h2>Related Articles</h2><ul>' + related.map(r => `<li><a href="/blog/${r.slug}">${escapeHtml(r.title)}</a></li>`).join('') + '</ul>' : ''}
    </article>
  `;

  // BlogPosting JSON-LD for Google rich results
  const blogJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    'headline': post.title,
    'description': post.excerpt,
    'url': `${SITE_URL}/blog/${post.slug}`,
    'datePublished': post.date || '',
    'dateModified': post.date || '',
    'author': {
      '@type': 'Person',
      'name': authorName,
      'url': `${SITE_URL}/about`,
    },
    'publisher': {
      '@type': 'Organization',
      'name': 'CodersSecret',
      'url': SITE_URL,
    },
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/blog/${post.slug}`,
    },
    'keywords': (post.tags || []).join(', '),
    'articleSection': post.category || '',
    'wordCount': articleWordCount,
  };
  const timeRequired = isoDurationFromReadTime(post.readTime);
  if (timeRequired) blogJsonLd.timeRequired = timeRequired;

  const bannerUrl = `/images/banners/${post.slug}.svg`;
  blogJsonLd.image = `${SITE_URL}${bannerUrl}`;
  const faqJsonLd = blogFaqJsonLd(post.slug);
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': SITE_URL },
      { '@type': 'ListItem', 'position': 2, 'name': 'Blog', 'item': `${SITE_URL}/blog` },
      { '@type': 'ListItem', 'position': 3, 'name': post.title, 'item': `${SITE_URL}/blog/${post.slug}` },
    ],
  };

  fs.writeFileSync(path.join(dir, 'index.html'), makeHtml({
    title: seoTitle,
    description: post.excerpt,
    url: `/blog/${post.slug}`,
    content,
    jsonLd: faqJsonLd ? [blogJsonLd, breadcrumbJsonLd, faqJsonLd] : [blogJsonLd, breadcrumbJsonLd],
    image: bannerUrl,
    ogType: 'article',
    extraHead: [
      post.date ? `  <meta property="article:published_time" content="${escapeHtml(post.date)}">\n` : '',
      post.date ? `  <meta property="article:modified_time" content="${escapeHtml(post.date)}">\n` : '',
      post.category ? `  <meta property="article:section" content="${escapeHtml(post.category)}">\n` : '',
      ...tags.map(tag => `  <meta property="article:tag" content="${escapeHtml(tag)}">\n`),
    ].join(''),
  }));
  created++;
}

// ── Category pages (/category/:slug) ──────────
function categoryHubDetails(slug, name) {
  const hubs = {
    ai: {
      description: 'Learn production AI systems through RAG, MCP, Claude, embeddings, agents, and observability guides.',
      scope: 'This hub connects AI application ideas to the systems work that makes them reliable: retrieval quality, token cost control, tool permissions, evaluation, and safe deployment.',
      topics: ['RAG', 'MCP', 'AI agents', 'Vector search', 'Prompting', 'Evaluation'],
    },
    frontend: {
      description: 'Learn practical frontend engineering through real layout, framework, state-management, and performance guides.',
      scope: 'This hub is for engineers who want frontend decisions to stay maintainable under real product pressure: routing, state, responsive layout, accessibility, and production UI trade-offs.',
      topics: ['Angular', 'React', 'TypeScript', 'CSS architecture', 'Responsive UI', 'Performance'],
    },
    backend: {
      description: 'Learn backend architecture through API design, authentication, databases, distributed systems, and production patterns.',
      scope: 'This hub covers the decisions backend engineers revisit repeatedly: rate limiting, caching, auth, connection pooling, queues, concurrency, and operational debugging.',
      topics: ['APIs', 'Auth', 'Databases', 'Caching', 'Queues', 'Distributed systems'],
    },
    devops: {
      description: 'Learn DevOps and platform engineering through Kubernetes, Linux, CI/CD, observability, and infrastructure automation.',
      scope: 'This hub is built for engineers who operate systems after deployment: scheduling, debugging, infrastructure-as-code, deployment safety, and production reliability.',
      topics: ['Kubernetes', 'Linux', 'CI/CD', 'Terraform', 'Observability', 'Reliability'],
    },
    tutorials: {
      description: 'Step-by-step engineering tutorials with examples, commands, trade-offs, and production notes.',
      scope: 'This hub collects guided walkthroughs that teach one practical skill at a time, with enough context to understand the decisions behind the code.',
      topics: ['Hands-on guides', 'Code examples', 'Architecture notes', 'Debugging', 'Production trade-offs'],
    },
    'open-source': {
      description: 'Learn how to read, contribute to, and maintain open-source projects without turning the workflow into guesswork.',
      scope: 'This hub focuses on the engineering habits behind public software: first pull requests, repository structure, maintainer communication, package quality, and practical project hygiene.',
      topics: ['First PRs', 'Project structure', 'Maintainer workflow', 'Package quality', 'Developer tooling'],
    },
  };

  return hubs[slug] || {
    description: `Practical ${name} guides for engineers building production software.`,
    scope: `Use this hub to scan the most useful ${name} articles, then follow the internal links into detailed tutorials, examples, and related learning paths.`,
    topics: [name, 'Production engineering', 'Practical guides'],
  };
}

for (const cat of categories) {
  const dir = path.join(OUTPUT_DIR, 'category', cat);
  fs.mkdirSync(dir, { recursive: true });

  const catName = categoryNames[cat] || cat;
  const catPosts = posts.filter(p => p.category === cat);
  const recommended = catPosts.slice(0, 3);
  const hub = categoryHubDetails(cat, catName);

  const description = hub.description;

  const content = `
    <h1>${escapeHtml(catName)} Tutorials and Guides</h1>
    <p>${escapeHtml(hub.description)}</p>
    <section>
      <h2>What This Category Covers</h2>
      <p>${escapeHtml(hub.scope)}</p>
      <ul>${hub.topics.map(topic => `<li>${escapeHtml(topic)}</li>`).join('')}</ul>
    </section>
    ${recommended.length ? `<section>
      <h2>Recommended Starting Guides</h2>
      <ol>${recommended.map(p => `<li><a href="/blog/${p.slug}">${escapeHtml(p.title)}</a> - ${escapeHtml(p.excerpt)}</li>`).join('')}</ol>
    </section>` : ''}
    <section>
      <h2>All ${escapeHtml(catName)} Guides</h2>
    <ul>
      ${catPosts.map(p => `<li><a href="/blog/${p.slug}">${escapeHtml(p.title)}</a> — ${escapeHtml(p.excerpt)}</li>`).join('\n      ')}
    </ul>
    </section>
  `;

  fs.writeFileSync(path.join(dir, 'index.html'), makeHtml({
    title: `${catName} Tutorials and Guides`,
    description,
    url: `/category/${cat}`,
    content,
  }));
  created++;
}

// ── Legal pages (privacy, terms, cookies) ────
// ── Games pages (/games, /games/:slug) ──────
const games = [
  {
    slug: '',
    title: 'Cloud Native Security Simulators & Labs',
    description: 'Interactive Kubernetes security labs, Zero Trust simulations, threat-modeling challenges, and infrastructure-engineering drills. Learn cloud-native security by playing — free and ad-free.',
    heading: 'Cloud Native Security Simulators & Labs',
    content: 'Interactive cloud-native security simulators and engineering drills: Kubernetes Security Simulator, Zero Trust Network Builder, API Attack & Defense, Incident Response Simulator, Supply Chain Defense, Service Mesh Routing, Threat Modeling Challenge, Secure Architecture Builder, Kubernetes Escape Room, AI Infrastructure Security, plus DevOps Scenario, Linux Command Challenge, Spot the Bug, Guess the Output, Code Typing Speed Test, and Tech Salary Calculator.',
  },
  {
    slug: 'kubernetes-security-simulator',
    title: 'Kubernetes Security Simulator — Interactive Lab',
    description: 'Interactive Kubernetes security lab: spot RBAC misconfigurations, network policy gaps, privileged pods, leaked secrets, and supply-chain risks across 6 production scenarios. Free, no signup.',
    heading: 'Kubernetes Security Simulator',
    content: 'Interactive Kubernetes security lab. Six production scenarios cover RBAC misconfigurations, missing NetworkPolicies, privileged pods, leaked secrets, image security, and shared-namespace tenancy — with explanations grounded in real CVEs and post-mortems.',
  },
  {
    slug: 'zero-trust-network-builder',
    title: 'Zero Trust Network Builder — SPIFFE/SPIRE Workload Identity Lab',
    description: 'Interactive Zero Trust simulator. Design SPIFFE ID schemes, configure SPIRE attestation, bootstrap mTLS, federate trust domains, and rotate SVIDs across 6 production scenarios. Free, no signup.',
    heading: 'Zero Trust Network Builder',
    content: 'Interactive workload-identity lab. Six production scenarios cover SPIFFE ID design, SPIRE registration entries and selectors, mTLS bootstrap with short-lived SVIDs, SPIFFE-based authorization policy, federation trust bundle exchange across clusters, and SVID rotation pitfalls in real Go code.',
  },
  {
    slug: 'api-attack-defense',
    title: 'API Attack & Defense — Interactive API Security Lab',
    description: 'Interactive API security simulator: spot JWT verification bypasses, OAuth redirect_uri exploits, mass assignment, rate-limit bypasses, CORS misconfigurations, and webhook timing attacks across 6 production scenarios. Free, no signup.',
    heading: 'API Attack & Defense',
    content: 'Interactive API security lab. Six scenarios cover JWT algorithm confusion (RS256/HS256), OAuth redirect_uri startsWith bypasses, mass assignment / overposting via spread operators, rate-limit bypasses through X-Forwarded-For spoofing, CORS wildcard + credentials misconfigurations, and webhook signature timing side-channels.',
  },
  {
    slug: 'incident-response-simulator',
    title: 'Incident Response Simulator — Runtime Defense Lab',
    description: 'Interactive runtime-security incident response simulator: triage Falco alerts, lateral movement, crypto-miners, container drift, audit-log compromise, and eBPF-detected fileless attacks across 6 production scenarios. Free, no signup.',
    heading: 'Incident Response Simulator',
    content: 'Interactive runtime-defense lab. Six scenarios drop you into the first 60 seconds of an incident: a Falco "shell in container" alert, lateral movement via stolen ServiceAccount tokens, crypto-miner indicators, Tetragon-detected container drift, audit-log triage of privilege escalation, and eBPF detection of fileless memfd-based attacks.',
  },
  {
    slug: 'supply-chain-defense',
    title: 'Supply Chain Defense Simulator — CI/CD & Sigstore',
    description: 'Interactive supply-chain security simulator: spot Sigstore identity gaps, SBOM blind spots, SLSA L2 vs L3 confusion, dependency confusion attacks, GitHub Actions secret leaks, and admission policy scope gaps across 6 production scenarios. Free, no signup.',
    heading: 'Supply Chain Defense Simulator',
    content: 'Interactive supply-chain security lab. Six scenarios cover cosign verify without certificate-identity, syft SBOMs missing Go modules under -ldflags strip, SLSA L2 vs L3 provenance, Python dependency confusion via --extra-index-url, GitHub Actions pull_request_target with secrets exposed to fork checkouts, and Kyverno verifyImages namespace-scope gaps.',
  },
  {
    slug: 'service-mesh-routing',
    title: 'Service Mesh Routing Game — Istio / Envoy Lab',
    description: 'Interactive Istio/Envoy service mesh simulator: spot mTLS rollout flaws, AuthorizationPolicy semantics, JWT validation gaps, traffic-shift ordering bugs, retry-storm patterns, and Envoy diagnostic flows across 6 production scenarios. Free, no signup.',
    heading: 'Service Mesh Routing Game',
    content: 'Interactive Istio service mesh lab. Six scenarios cover mesh-wide STRICT mTLS rollout failures (PERMISSIVE-first migration), AuthorizationPolicy ALLOW-with-empty-rules anti-pattern, RequestAuthentication that does not actually require JWTs, VirtualService route ordering and broken canaries, retry-storm amplification of brownouts, and istioctl proxy-config diagnostics for missing endpoints.',
  },
  {
    slug: 'threat-modeling-challenge',
    title: 'Threat Modeling Challenge — STRIDE & Attack Trees',
    description: 'Interactive threat modeling simulator: classify threats with STRIDE, identify trust boundaries, classify PII, build attack trees, prioritise by severity, and rank mitigations across 6 production scenarios. Free, no signup.',
    heading: 'Threat Modeling Challenge',
    content: 'Interactive threat modeling lab. Six scenarios cover STRIDE classification of token-enumeration as spoofing, identifying the API-to-database trust boundary as the highest-stakes, GDPR PII classification of hashed device fingerprints, attack tree analysis prioritising CI/CD compromise over RCE, severity prioritisation by impact-times-likelihood, and mitigation ranking by blast-radius reduction.',
  },
  {
    slug: 'secure-architecture-builder',
    title: 'Secure Architecture Builder — VPC, WAF & Multi-region',
    description: 'Interactive cloud architecture simulator: design VPC layouts, place WAFs, choose between bastions and IAM-managed access, pick secret stores, authenticate CDN-to-origin, and design multi-region resilience across 6 production scenarios. Free, no signup.',
    heading: 'Secure Architecture Builder',
    content: 'Interactive architecture-design lab. Six scenarios cover three-tier VPC layout (public/private/isolated), WAF placement at both CloudFront and ALB with origin verification, AWS SSM Session Manager + IAM database auth replacing SSH bastions, AWS Secrets Manager + Secrets Store CSI Driver as the right baseline, CloudFront-to-origin authentication via custom headers and OAC, and active-active multi-region split-brain risk on payment workloads.',
  },
  {
    slug: 'kubernetes-escape-room',
    title: 'Kubernetes Escape Room — Adversarial Cluster Lab',
    description: 'Adversarial Kubernetes lab: walk through real container-escape and privilege-escalation chains — SA token recon, docker.sock mounts, hostPID, etcd snapshot leaks, pods/exec → cluster-admin, and CVE defense — and identify the control that breaks each step. Free, no signup.',
    heading: 'Kubernetes Escape Room',
    content: 'Adversarial Kubernetes lab. Six scenarios walk through real cluster-compromise chains: ServiceAccount token reconnaissance closed by automountServiceAccountToken: false, docker.sock host-mount escapes blocked by PodSecurity restricted, hostPID/hostNetwork process traversal, etcd snapshot leaks defeated by KMS encryption-at-rest, pods/exec → cluster-admin via stolen privileged SA tokens, and defence-in-depth posture against container-runtime CVEs.',
  },
  {
    slug: 'ai-infrastructure-security',
    title: 'AI Infrastructure Security Game — Agents & Inference Lab',
    description: 'Interactive AI infrastructure security simulator: identify indirect prompt injection, model extraction, vector-DB tenant leakage, agent tool over-scoping, inference cost abuse, and MCP server identity gaps across 6 production scenarios. Free, no signup.',
    heading: 'AI Infrastructure Security Game',
    content: 'Interactive AI security lab. Six scenarios cover indirect prompt injection in support agents and tool-layer capability scoping, model extraction via high-volume diverse queries and the multi-layer defence stack, multi-tenant vector DB isolation in shared indexes, agent tool over-scoping and capability-based decomposition, free-tier inference API abuse with disposable email farming, and MCP server identity propagation via SPIFFE workload identity.',
  },
  {
    slug: 'guess-output',
    title: 'Guess the Output — Python & JavaScript Code Quiz',
    description: 'Test your knowledge with tricky Python and JavaScript code snippets. Can you predict the output? 10 questions covering classic language quirks.',
    heading: 'Guess the Output',
    content: 'Predict what Python and JavaScript code snippets will print. Covers classic language quirks: mutable defaults, closure captures, floating-point math, type coercion, and more.',
  },
  {
    slug: 'spot-the-bug',
    title: 'Spot the Bug — Code Review Challenge Game',
    description: 'Find bugs in real code snippets — race conditions, off-by-one errors, N+1 queries, and more. Test your code review skills.',
    heading: 'Spot the Bug',
    content: 'Find the bug in each code snippet. Tests your code review skills on real-world issues: off-by-one errors, race conditions, N+1 queries, memory leaks, and more.',
  },
  {
    slug: 'devops-scenario',
    title: 'DevOps Scenario Simulator — Production Incident Game',
    description: 'Practice production incident response. Kubernetes crashes, database outages, TLS expiry, memory leaks — what would you do? Interactive SRE training.',
    heading: 'DevOps Scenario Simulator',
    content: 'Practice real production incident response. Debug Kubernetes CrashLoopBackOff, database outages, TLS certificate expiry, memory leaks, and slow CI pipelines. Interactive SRE training.',
  },
  {
    slug: 'typing-test',
    title: 'Code Typing Speed Test — Real Code Snippets',
    description: 'Test your typing speed with real code from Python, JavaScript, Go, Rust, TypeScript, and SQL. Measure WPM and accuracy on production code.',
    heading: 'Code Typing Speed Test',
    content: 'Test your typing speed on real code snippets in Python, JavaScript, Go, Rust, TypeScript, and SQL. Measures words per minute and accuracy.',
  },
  {
    slug: 'salary-calculator',
    title: 'Tech Salary Calculator — Software Engineer Compensation',
    description: 'Estimate software engineer salaries by role, experience, location, and company type. Data from Levels.fyi, Glassdoor, and industry reports.',
    heading: 'Tech Salary Calculator',
    content: 'Estimate software engineer compensation by role (SWE, SRE, ML engineer, etc.), experience level, location (SF, NYC, London, Bangalore, etc.), and company type.',
  },
  {
    slug: 'linux-challenge',
    title: 'Linux Command Challenge — Test Your Shell Skills',
    description: 'Interactive Linux command-line challenges. Find files, kill processes, manage permissions, and more. Practice real sysadmin tasks.',
    heading: 'Linux Command Challenge',
    content: 'Interactive Linux command-line challenges covering real sysadmin tasks: finding files, killing processes on ports, managing permissions, grep, sed, watch, and more.',
  },
];

const gameDetailsBySlug = new Map(games
  .filter(game => game.slug)
  .map(game => [
    game.slug,
    loadComponentDataFromSource(`src/app/pages/games/${game.slug}/${game.slug}.ts`, [
      'intro',
      'scenarios',
      'questions',
      'snippets',
      'challenges',
      'roles',
      'levels',
      'locations',
      'companies',
      'callToActions',
    ]),
  ]));

function gameSeoTitle(game) {
  return compactSeoTitle(game.title.replace(/\s+—\s+(Interactive Lab|SPIFFE\/SPIRE Workload Identity Lab)$/i, ''), 52);
}

function gameDescription(game) {
  const desc = stripHtml(game.description);
  if (desc.length >= 80) {
    return desc;
  }

  return `${desc} Free CodersSecret practice lab with scenario-based prompts, production context, and links to related engineering material.`;
}

function renderGameContent(game, allGames) {
  const description = gameDescription(game);
  const detail = game.slug ? gameDetailsBySlug.get(game.slug) : undefined;
  const related = allGames
    .filter(item => item.slug && item.slug !== game.slug)
    .slice(0, 6);

  if (!game.slug) {
    return `<main>
      <nav aria-label="Breadcrumb"><a href="/">Home</a> / Games</nav>
      <h1>${escapeHtml(game.heading)}</h1>
      <p>${escapeHtml(description)}</p>
      <p>These browser-based tools are lightweight practice surfaces for production engineering judgment: identify risk, choose safer defaults, debug symptoms, and reason about tradeoffs.</p>
      <section>
        <h2>Available Games and Labs</h2>
        <ul>${allGames.filter(item => item.slug).map(item => `<li><a href="/games/${item.slug}">${escapeHtml(item.heading)}</a> - ${escapeHtml(gameDescription(item))}</li>`).join('')}</ul>
      </section>
    </main>`;
  }

  return `<main>
    <nav aria-label="Breadcrumb"><a href="/">Home</a> / <a href="/games">Games</a> / ${escapeHtml(game.heading)}</nav>
    <article>
      <h1>${escapeHtml(game.heading)}</h1>
      <p>${escapeHtml(description)}</p>
      <p>${escapeHtml(game.content)}</p>
      ${renderGameDetailContent(detail)}
      <section>
        <h2>What You Practice</h2>
        <ul>
          <li>Recognizing production failure modes before they become incidents.</li>
          <li>Connecting security, reliability, and operational choices to real engineering outcomes.</li>
          <li>Building intuition through short interactive scenarios instead of passive reading only.</li>
        </ul>
      </section>
      <section>
        <h2>Related Practice</h2>
        <ul>${related.map(item => `<li><a href="/games/${item.slug}">${escapeHtml(item.heading)}</a></li>`).join('')}</ul>
      </section>
      <p><a href="/courses">Continue with free courses</a> or <a href="/blog">read production engineering articles</a>.</p>
    </article>
  </main>`;
}

function renderGameDetailContent(detail) {
  if (!detail) return '';

  return [
    renderScenarioIntro(detail.intro),
    renderScenarioWalkthroughs(detail.scenarios),
    renderCodeQuestions(detail.questions),
    renderTypingSnippets(detail.snippets),
    renderLinuxChallenges(detail.challenges),
    renderSalaryInputs(detail),
  ].filter(Boolean).join('\n');
}

function renderScenarioIntro(intro) {
  if (!intro) return '';
  return `<section>
    <h2>How This Lab Works</h2>
    <p>${escapeHtml(intro.description)}</p>
    ${renderTextList(intro.steps)}
    ${intro.practiceTitle ? `<h3>${escapeHtml(intro.practiceTitle)}</h3>` : ''}
    ${intro.practiceDescription ? `<p>${escapeHtml(intro.practiceDescription)}</p>` : ''}
    ${Array.isArray(intro.practiceConcepts) && intro.practiceConcepts.length ? `<ul>${intro.practiceConcepts.map(concept => `<li><strong>${escapeHtml(concept.name)}</strong> - ${escapeHtml(concept.description)}</li>`).join('')}</ul>` : ''}
    ${intro.deeperLine ? `<p>${escapeHtml(intro.deeperLine)}</p>` : ''}
    ${renderLinkList(intro.deeperLinks)}
  </section>`;
}

function renderScenarioWalkthroughs(scenarios) {
  if (!Array.isArray(scenarios) || !scenarios.length) return '';

  return `<section>
    <h2>Scenario Walkthroughs</h2>
    ${scenarios.map((scenario, index) => {
      const choices = Array.isArray(scenario.choices)
        ? scenario.choices.map(choice => ({
          label: choice.label,
          correct: Boolean(choice.correct),
          feedback: choice.feedback,
        }))
        : (Array.isArray(scenario.options)
          ? scenario.options.map((label, optionIndex) => ({
            label,
            correct: optionIndex === scenario.correctIndex,
          }))
          : []);

      return `<article>
        <h3>${index + 1}. ${escapeHtml(scenario.title)}</h3>
        ${scenario.topic ? `<p><strong>Skill area:</strong> ${escapeHtml(scenario.topic)}</p>` : ''}
        ${scenario.briefing || scenario.situation ? `<p>${escapeHtml(scenario.briefing || scenario.situation)}</p>` : ''}
        ${renderTextList(scenario.symptoms)}
        ${renderCodeBlock(scenario.yaml || scenario.code, scenario.topic ? `${scenario.topic} scenario` : 'Scenario code')}
        ${scenario.question ? `<p><strong>${escapeHtml(scenario.question)}</strong></p>` : ''}
        ${choices.length ? `<ol>${choices.map(choice => `<li>${choice.correct ? '<strong>Correct pattern:</strong> ' : ''}${escapeHtml(choice.label)}${choice.feedback ? `<p>${escapeHtml(choice.feedback)}</p>` : ''}</li>`).join('')}</ol>` : ''}
        ${scenario.explanation ? `<p><strong>Production lesson:</strong> ${escapeHtml(scenario.explanation)}</p>` : ''}
        ${scenario.learnMore?.href ? `<p><a href="${escapeHtml(scenario.learnMore.href)}">${escapeHtml(scenario.learnMore.label || 'Continue learning')}</a></p>` : ''}
      </article>`;
    }).join('\n')}
  </section>`;
}

function renderCodeQuestions(questions) {
  if (!Array.isArray(questions) || !questions.length) return '';

  return `<section>
    <h2>Practice Questions</h2>
    ${questions.map((question, index) => `<article>
      <h3>${index + 1}. ${escapeHtml(question.language || 'Code')} question</h3>
      ${renderCodeBlock(question.code, question.language || 'Code snippet')}
      ${Array.isArray(question.options) ? `<ol>${question.options.map((option, optionIndex) => `<li>${optionIndex === question.correctIndex ? '<strong>Correct answer:</strong> ' : ''}${escapeHtml(option)}</li>`).join('')}</ol>` : ''}
      ${question.explanation ? `<p><strong>Explanation:</strong> ${escapeHtml(question.explanation)}</p>` : ''}
    </article>`).join('\n')}
  </section>`;
}

function renderTypingSnippets(snippets) {
  if (!Array.isArray(snippets) || !snippets.length) return '';

  return `<section>
    <h2>Typing Snippets</h2>
    <p>The typing test uses real code-shaped snippets so the practice feels closer to daily engineering work than random words.</p>
    ${snippets.map((snippet, index) => `<article>
      <h3>${index + 1}. ${escapeHtml(snippet.language)} - ${escapeHtml(snippet.source)}</h3>
      ${renderCodeBlock(snippet.code, `${snippet.language} snippet`)}
    </article>`).join('\n')}
  </section>`;
}

function renderLinuxChallenges(challenges) {
  if (!Array.isArray(challenges) || !challenges.length) return '';

  return `<section>
    <h2>Command Challenges</h2>
    ${challenges.map((challenge, index) => `<article>
      <h3>${index + 1}. ${escapeHtml(challenge.task)}</h3>
      ${challenge.hint ? `<p><strong>Hint:</strong> ${escapeHtml(challenge.hint)}</p>` : ''}
      ${Array.isArray(challenge.acceptedAnswers) ? `<p><strong>Accepted commands:</strong></p><ul>${challenge.acceptedAnswers.map(answer => `<li><code>${escapeHtml(answer)}</code></li>`).join('')}</ul>` : ''}
    </article>`).join('\n')}
  </section>`;
}

function renderSalaryInputs(detail) {
  if (!Array.isArray(detail?.roles) || !Array.isArray(detail?.levels) || !Array.isArray(detail?.locations) || !Array.isArray(detail?.companies)) {
    return '';
  }

  return `<section>
    <h2>Calculator Inputs</h2>
    <p>The calculator lets learners compare compensation estimates by role, experience level, location, and company type. Estimates are guidance only; individual offers vary by company, skill set, negotiation, and market timing.</p>
    <h3>Roles</h3>
    <ul>${detail.roles.map(role => `<li>${escapeHtml(role.label)}</li>`).join('')}</ul>
    <h3>Experience Levels</h3>
    <ul>${detail.levels.map(level => `<li>${escapeHtml(level.label)}</li>`).join('')}</ul>
    <h3>Locations</h3>
    <ul>${detail.locations.map(location => `<li>${escapeHtml(location.label)}</li>`).join('')}</ul>
    <h3>Company Types</h3>
    <ul>${detail.companies.map(company => `<li>${escapeHtml(company.label)}</li>`).join('')}</ul>
  </section>`;
}

function gameJsonLd(game, allGames) {
  const url = game.slug ? `/games/${game.slug}` : '/games';
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': SITE_URL },
      { '@type': 'ListItem', 'position': 2, 'name': 'Games', 'item': `${SITE_URL}/games` },
      ...(game.slug ? [{ '@type': 'ListItem', 'position': 3, 'name': game.heading, 'item': `${SITE_URL}${url}` }] : []),
    ],
  };

  if (!game.slug) {
    return [
      breadcrumb,
      {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        'name': game.heading,
        'description': gameDescription(game),
        'itemListElement': allGames.filter(item => item.slug).map((item, index) => ({
          '@type': 'ListItem',
          'position': index + 1,
          'url': `${SITE_URL}/games/${item.slug}`,
          'name': item.heading,
        })),
      },
    ];
  }

  return [
    breadcrumb,
    {
      '@context': 'https://schema.org',
      '@type': 'LearningResource',
      'name': game.heading,
      'description': gameDescription(game),
      'url': `${SITE_URL}${url}`,
      'learningResourceType': 'Interactive practice',
      'isAccessibleForFree': true,
      'inLanguage': 'en',
    },
  ];
}

for (const game of games) {
  const gameDir = game.slug ? path.join(OUTPUT_DIR, 'games', game.slug) : path.join(OUTPUT_DIR, 'games');
  fs.mkdirSync(gameDir, { recursive: true });
  fs.writeFileSync(path.join(gameDir, 'index.html'), makeHtml({
    title: gameSeoTitle(game),
    description: gameDescription(game),
    url: game.slug ? `/games/${game.slug}` : '/games',
    content: renderGameContent(game, games),
    jsonLd: gameJsonLd(game, games),
  }));
  created++;
}

// ── Cheatsheets pages ────────────────────────
const cheatsheets = [
  { slug: '', name: 'Production Engineering Reference Sheets', desc: 'Production-grade reference guides for cloud-native security and infrastructure engineering: Kubernetes Security, kubectl, SPIFFE/SPIRE, OPA/Rego, API security, runtime detection, service mesh, and supply chain.' },
  { slug: 'kubernetes-security', name: 'Kubernetes Security Cheatsheet', desc: 'Production Kubernetes security reference: RBAC audit, PodSecurity standards, NetworkPolicy default-deny, secrets, image signing, runtime forensics. Commands with security warnings and production tips for every entry.' },
  { slug: 'kubernetes', name: 'Kubernetes (kubectl) Cheatsheet', desc: 'Essential kubectl commands: pods, deployments, services, debugging, config, and cluster ops.' },
  { slug: 'docker', name: 'Docker Cheatsheet', desc: 'Docker commands: build, run, compose, volumes, networks, debugging, and cleanup.' },
  { slug: 'git', name: 'Git Cheatsheet', desc: 'Git commands: branch, merge, rebase, stash, reset, log, cherry-pick, and undoing mistakes.' },
  { slug: 'sql', name: 'SQL Cheatsheet', desc: 'SQL reference: SELECT, JOIN, GROUP BY, window functions, CTEs, indexes, and performance.' },
  { slug: 'python', name: 'Python Cheatsheet', desc: 'Essential Python syntax: data types, strings, lists, dicts, functions, classes, file I/O, and more.' },
  { slug: 'spiffe-spire', name: 'SPIFFE & SPIRE Cheatsheet', desc: 'Production reference for SPIFFE workload identity and SPIRE: SPIFFE IDs, X.509/JWT SVIDs, registration entries, Kubernetes attestor selectors, federation bundle endpoints, and diagnostics.' },
  { slug: 'opa-rego', name: 'OPA & Rego Cheatsheet', desc: 'Production reference for Open Policy Agent and Rego: syntax, Gatekeeper Kubernetes admission, OPA CLI (eval/test/run), bundle distribution, and testing patterns.' },
  { slug: 'api-security', name: 'API Security Cheatsheet', desc: 'Production reference for securing HTTP APIs: JWT verification, OAuth2/OIDC flows, security headers (HSTS/CSP/XFO), CORS, mTLS, webhook signatures, and rate limiting.' },
  { slug: 'linux-networking', name: 'Linux Networking Cheatsheet', desc: 'Production reference for Linux networking: ip / ss / lsof, tcpdump, openssl s_client, iptables/nftables, eBPF observability with bpftrace and Hubble.' },
  { slug: 'runtime-security', name: 'Runtime Security Cheatsheet (Falco / eBPF)', desc: 'Production reference for Linux runtime security: Falco rule syntax, high-signal detection rules, eBPF observability with Tetragon, syscall reference, and detection-engineering tuning.' },
  { slug: 'service-mesh', name: 'Service Mesh Cheatsheet (Istio / Envoy)', desc: 'Production reference for Istio and Envoy: mesh-wide mTLS, AuthorizationPolicy patterns, RequestAuthentication for JWTs, traffic management, and istioctl/Envoy diagnostics.' },
  { slug: 'devsecops', name: 'DevSecOps & Supply Chain Cheatsheet', desc: 'Production reference for software supply chain security: cosign keyless signing, SBOM generation with syft, SLSA provenance levels, Kyverno admission policy, and hardened GitHub Actions patterns.' },
];

const cheatsheetDetailsBySlug = new Map(cheatsheets
  .filter(cs => cs.slug)
  .map(cs => [
    cs.slug,
    loadComponentDataFromSource(`src/app/pages/cheatsheets/${cs.slug}/${cs.slug}.ts`, [
      'header',
      'groups',
      'sections',
      'misconfigurations',
      'misconfigs',
      'related',
    ]),
  ]));

function cheatsheetDescription(cs) {
  const desc = stripHtml(cs.desc);
  if (desc.length >= 80) {
    return desc;
  }

  return `${desc} Production reference with commands, diagnostics, safety checks, and links to deeper CodersSecret learning paths.`;
}

function renderCheatsheetContent(cs, allCheatsheets) {
  const description = cheatsheetDescription(cs);
  const detail = cs.slug ? cheatsheetDetailsBySlug.get(cs.slug) : undefined;
  const related = allCheatsheets
    .filter(item => item.slug && item.slug !== cs.slug)
    .slice(0, 6);

  if (!cs.slug) {
    return `<main>
      <nav aria-label="Breadcrumb"><a href="/">Home</a> / Cheatsheets</nav>
      <h1>${escapeHtml(cs.name)}</h1>
      <p>${escapeHtml(description)}</p>
      <p>Use these pages as quick operational references while debugging clusters, hardening APIs, reviewing infrastructure, or preparing for production incidents.</p>
      <section>
        <h2>Available Reference Sheets</h2>
        <ul>${allCheatsheets.filter(item => item.slug).map(item => `<li><a href="/cheatsheets/${item.slug}">${escapeHtml(item.name)}</a> - ${escapeHtml(cheatsheetDescription(item))}</li>`).join('')}</ul>
      </section>
      <section>
        <h2>How to Use These References</h2>
        <p>Each cheatsheet is intentionally concise: commands first, then the production context that explains when a command is safe, risky, or incomplete. Pair them with the long-form guides and free courses when you need deeper architecture tradeoffs.</p>
      </section>
    </main>`;
  }

  return `<main>
    <nav aria-label="Breadcrumb"><a href="/">Home</a> / <a href="/cheatsheets">Cheatsheets</a> / ${escapeHtml(cs.name)}</nav>
    <article>
      <h1>${escapeHtml(cs.name)}</h1>
      <p>${escapeHtml(description)}</p>
      ${renderCheatsheetDetailContent(detail, cs.slug)}
      <section>
        <h2>What This Reference Covers</h2>
        <ul>
          <li>High-signal commands and checks for day-to-day production work.</li>
          <li>Security and reliability notes that explain what can go wrong when a command is used casually.</li>
          <li>Debugging vocabulary for incidents, code reviews, platform audits, and interview preparation.</li>
        </ul>
      </section>
      <section>
        <h2>Recommended Next Steps</h2>
        <p>Start with the commands that match your current task, then follow the related CodersSecret material for deeper context on architecture, risk, and operational tradeoffs.</p>
        <p><a href="/blog">Read production engineering articles</a> or continue with <a href="/courses">free courses</a>.</p>
      </section>
      <section>
        <h2>Related Cheatsheets</h2>
        <ul>${related.map(item => `<li><a href="/cheatsheets/${item.slug}">${escapeHtml(item.name)}</a></li>`).join('')}</ul>
      </section>
      <p><a href="/cheatsheets">All Cheat Sheets</a></p>
    </article>
  </main>`;
}

function renderCheatsheetDetailContent(detail, slug) {
  if (!detail) return '';

  const header = detail.header;
  const groups = Array.isArray(detail.groups) ? detail.groups : (Array.isArray(detail.sections) ? detail.sections : []);
  const misconfigPairs = Array.isArray(detail.misconfigurations) ? detail.misconfigurations : (Array.isArray(detail.misconfigs) ? detail.misconfigs : []);

  return [
    header?.intro ? `<section><h2>Reference Scope</h2><p>${escapeHtml(header.intro)}</p></section>` : '',
    renderCheatsheetTemplateExtras(slug),
    renderCheatsheetCommandGroups(groups),
    renderCheatsheetMisconfigurations(misconfigPairs),
    renderCheatsheetRelated(detail.related),
  ].filter(Boolean).join('\n');
}

function renderCheatsheetTemplateExtras(slug) {
  if (slug !== 'kubernetes-security') return '';

  return `<section>
    <h2>Kubernetes Authorization Chain</h2>
    <p>Every API request moves from the client to authentication, authorization, admission, and finally etcd persistence. Most cluster security failures happen when authentication, RBAC authorization, or admission policy is too permissive.</p>
    <ol>
      <li>Client: kubectl, controllers, SDKs, or service accounts call the API server.</li>
      <li>Authentication: x509, OIDC, bootstrap tokens, or service-account tokens establish identity.</li>
      <li>Authorization: RBAC or webhook authorizers decide whether the identity can perform the verb on the resource.</li>
      <li>Admission: PodSecurity Admission, OPA, Gatekeeper, Kyverno, or webhooks enforce policy before persistence.</li>
      <li>etcd: accepted objects are stored and then reconciled by controllers.</li>
    </ol>
    <h2>Default-Deny NetworkPolicy</h2>
    <p>Use default-deny as the baseline for namespace blast-radius control, then add explicit allows for traffic that should exist.</p>
    ${renderCodeBlock(`apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny-all
  namespace: payments
spec:
  podSelector: {}
  policyTypes:
  - Ingress
  - Egress
---
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-payments-to-rds
  namespace: payments
spec:
  podSelector:
    matchLabels:
      app: payments-api
  policyTypes:
  - Egress
  egress:
  - to:
    - ipBlock:
        cidr: 10.20.0.0/16
    ports:
    - protocol: TCP
      port: 5432`, 'network-policy-default-deny.yaml')}
  </section>`;
}

function renderCheatsheetCommandGroups(groups) {
  if (!Array.isArray(groups) || !groups.length) return '';

  return `<section>
    <h2>Command Reference</h2>
    ${groups.map(group => {
      const rows = rowsForCommandGroup(group);
      return `<section>
        <h3>${escapeHtml(group.title)}</h3>
        ${rows.length ? `<dl>${rows.map(row => `<div>
          <dt><code>${escapeHtml(row.cmd)}</code></dt>
          <dd>${escapeHtml(row.desc)}${row.prodNote ? `<p><strong>Production note:</strong> ${escapeHtml(row.prodNote)}</p>` : ''}${row.warning ? `<p><strong>Warning:</strong> ${escapeHtml(row.warning)}</p>` : ''}</dd>
        </div>`).join('')}</dl>` : ''}
      </section>`;
    }).join('\n')}
  </section>`;
}

function renderCheatsheetMisconfigurations(misconfigPairs) {
  if (!Array.isArray(misconfigPairs) || !misconfigPairs.length) return '';

  return `<section>
    <h2>Common Misconfigurations</h2>
    ${misconfigPairs.map((pair, index) => `<article>
      <h3>${index + 1}. Safer replacement pattern</h3>
      ${renderCodeBlock(pair.bad, 'Risky pattern')}
      ${renderCodeBlock(pair.good, 'Hardened pattern')}
      <p><strong>Why it matters:</strong> ${escapeHtml(pair.why)}</p>
    </article>`).join('\n')}
  </section>`;
}

function renderCheatsheetRelated(related) {
  if (!Array.isArray(related) || !related.length) return '';

  return `<section>
    <h2>Related Learning Paths</h2>
    ${renderLinkList(related)}
  </section>`;
}

function cheatsheetJsonLd(cs, allCheatsheets) {
  const url = cs.slug ? `/cheatsheets/${cs.slug}` : '/cheatsheets';
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': SITE_URL },
      { '@type': 'ListItem', 'position': 2, 'name': 'Cheatsheets', 'item': `${SITE_URL}/cheatsheets` },
      ...(cs.slug ? [{ '@type': 'ListItem', 'position': 3, 'name': cs.name, 'item': `${SITE_URL}${url}` }] : []),
    ],
  };

  if (!cs.slug) {
    return [
      breadcrumb,
      {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        'name': cs.name,
        'description': cheatsheetDescription(cs),
        'itemListElement': allCheatsheets.filter(item => item.slug).map((item, index) => ({
          '@type': 'ListItem',
          'position': index + 1,
          'url': `${SITE_URL}/cheatsheets/${item.slug}`,
          'name': item.name,
        })),
      },
    ];
  }

  return [
    breadcrumb,
    {
      '@context': 'https://schema.org',
      '@type': 'TechArticle',
      'headline': cs.name,
      'description': cheatsheetDescription(cs),
      'url': `${SITE_URL}${url}`,
      'author': {
        '@type': 'Person',
        'name': 'Vishal Anand',
        'url': `${SITE_URL}/about`,
      },
      'publisher': {
        '@type': 'Organization',
        'name': 'CodersSecret',
        'url': SITE_URL,
      },
      'isAccessibleForFree': true,
      'inLanguage': 'en',
    },
  ];
}

for (const cs of cheatsheets) {
  const csDir = cs.slug ? path.join(OUTPUT_DIR, 'cheatsheets', cs.slug) : path.join(OUTPUT_DIR, 'cheatsheets');
  fs.mkdirSync(csDir, { recursive: true });
  fs.writeFileSync(path.join(csDir, 'index.html'), makeHtml({
    title: cs.name,
    description: cheatsheetDescription(cs),
    url: cs.slug ? `/cheatsheets/${cs.slug}` : '/cheatsheets',
    content: renderCheatsheetContent(cs, cheatsheets),
    jsonLd: cheatsheetJsonLd(cs, cheatsheets),
  }));
  created++;
}

// ── Courses pages (/courses, /courses/<course>, /courses/<course>/<module>, SEO pages) ──
const courseModelPath = path.join(__dirname, '..', 'src', 'app', 'models', 'course.model.ts');
const courseContent = fs.existsSync(courseModelPath) ? fs.readFileSync(courseModelPath, 'utf-8') : '';
let generatedCourseModelSlugs = new Set();

if (courseContent) {
  const courses = loadCoursesFromModel(courseContent);
  generatedCourseModelSlugs = new Set(courses.map(course => course.slug));
  const coursesHubTitle = 'Free Production Engineering Courses';
  const coursesHubDescription = 'Free hands-on courses in cloud native security, distributed systems, SPIFFE/SPIRE, Kubernetes, Zero Trust, production RAG, and analytics engineering. No signup.';

  // Course hub page
  const coursesHubDir = path.join(OUTPUT_DIR, 'courses');
  fs.mkdirSync(coursesHubDir, { recursive: true });
  const coursesHubContent = courses.length > 0
    ? `<main>
      <nav aria-label="Breadcrumb"><a href="/">Home</a> / Courses</nav>
      <h1>Free Production Engineering Courses</h1>
      <p>${coursesHubDescription}</p>
      <p>Production-focused, architecture-first courses for engineers who secure, scale, and operate real infrastructure. Learn through modules, hands-on labs or inline exercises, diagrams, and concrete production trade-offs.</p>
      <h2>Available Courses</h2>
      <ul>
        ${courses.map(course => `<li>
          <a href="/courses/${course.slug}">${escapeHtml(course.title)}</a>
          <p>${escapeHtml(course.excerpt)}</p>
          <p>${course.modules.length} modules · hands-on labs/exercises · ${escapeHtml(course.totalDuration)} · ${escapeHtml(course.level)} · 100% free</p>
          <p>Topics: ${course.tags.slice(0, 8).map(escapeHtml).join(', ')}</p>
        </li>`).join('\n        ')}
      </ul>
      <h2>Suggested Learning Paths</h2>
      <ol>
        <li><a href="/courses/distributed-systems-engineering">Distributed Systems Engineering</a> → <a href="/courses/cloud-native-security-engineering">Cloud Native Security Engineering</a> → <a href="/courses/mastering-spiffe-spire">Mastering SPIFFE & SPIRE</a></li>
        <li><a href="/courses/cloud-native-security-engineering">Cloud Native Security Engineering</a> → <a href="/courses/mastering-spiffe-spire">Mastering SPIFFE & SPIRE</a> → <a href="/games/kubernetes-security-simulator">Kubernetes Security Simulator</a></li>
        <li><a href="/courses/distributed-systems-engineering">Distributed Systems Engineering</a> → <a href="/courses/production-rag-systems-engineering">Production RAG Systems Engineering</a> → <a href="/games/ai-infrastructure-security">AI Infrastructure Security Game</a></li>
        <li><a href="/courses/production-analytics-engineering-dbt">Production Analytics Engineering</a> → <a href="/blog/are-dags-dying-declarative-data-pipelines">Declarative Data Pipelines</a> → <a href="/blog/delta-lake-iceberg-s3-tables-beginner-guide">Lakehouse Table Formats</a></li>
      </ol>
      <h2>Practice Beyond the Courses</h2>
      <ul>
        <li><a href="/games">Interactive security simulators</a> for Kubernetes, Zero Trust, API defense, incident response, supply-chain security, and AI infrastructure.</li>
        <li><a href="/cheatsheets">Operational cheatsheets</a> for Kubernetes, Docker, Git, SQL, SPIFFE/SPIRE, OPA/Rego, API security, runtime security, service mesh, and DevSecOps.</li>
        <li><a href="/blog">Engineering articles</a> on distributed systems, rate limiting, caching, scheduling, infrastructure, APIs, and production architecture.</li>
      </ul>
    </main>`
    : `<h1>Free Production Engineering Courses</h1>
      <p>${coursesHubDescription}</p>
      <ul><li><a href="/courses/mastering-spiffe-spire">Mastering SPIFFE & SPIRE: Zero Trust for Cloud Native Systems</a></li></ul>`;

  const coursesHubJsonLd = courses.length > 0 ? [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [
        {
          '@type': 'ListItem',
          'position': 1,
          'name': 'Home',
          'item': SITE_URL,
        },
        {
          '@type': 'ListItem',
          'position': 2,
          'name': 'Courses',
          'item': `${SITE_URL}/courses`,
        },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      'name': coursesHubTitle,
      'description': coursesHubDescription,
      'numberOfItems': courses.length,
      'itemListElement': courses.map((course, i) => ({
        '@type': 'ListItem',
        'position': i + 1,
        'url': `${SITE_URL}/courses/${course.slug}`,
        'item': {
          '@type': 'Course',
          'name': course.title,
          'description': course.excerpt,
          'url': `${SITE_URL}/courses/${course.slug}`,
          'provider': {
            '@type': 'Organization',
            'name': 'CodersSecret',
            'url': SITE_URL,
          },
          'creator': {
            '@type': 'Person',
            'name': course.instructor.name,
            'url': `${SITE_URL}/about`,
          },
          'educationalLevel': course.level,
          'teaches': course.tags,
          'isAccessibleForFree': true,
          'inLanguage': 'en',
          'offers': {
            '@type': 'Offer',
            'price': 0,
            'priceCurrency': 'USD',
            'category': 'Free',
            'availability': 'https://schema.org/InStock',
          },
          'hasCourseInstance': {
            '@type': 'CourseInstance',
            'courseMode': 'online',
            'courseWorkload': course.totalDuration,
            'instructor': {
              '@type': 'Person',
              'name': course.instructor.name,
            },
          },
        },
      })),
    },
  ] : undefined;

  fs.writeFileSync(path.join(coursesHubDir, 'index.html'), makeHtml({
    title: coursesHubTitle,
    fullTitle: `${coursesHubTitle} | CodersSecret`,
    description: coursesHubDescription,
    url: '/courses',
    content: coursesHubContent,
    jsonLd: coursesHubJsonLd,
  }));
  created++;

  // Mastering SPIFFE & SPIRE course: rich prerendered landing, module, and topic pages.
  const spiffeCourse = courses.find(course => course.slug === 'mastering-spiffe-spire');
  if (spiffeCourse) {
    const courseLandingDir = path.join(OUTPUT_DIR, 'courses', spiffeCourse.slug);
    fs.mkdirSync(courseLandingDir, { recursive: true });
    fs.writeFileSync(path.join(courseLandingDir, 'index.html'), makeHtml({
      title: courseSeoTitle(spiffeCourse),
      description: courseSeoDescription(spiffeCourse),
      url: `/courses/${spiffeCourse.slug}`,
      image: courseImagePath(spiffeCourse),
      content: renderCourseLandingContent(spiffeCourse),
      jsonLd: [
        courseBreadcrumbJsonLd(spiffeCourse),
        courseJsonLd(spiffeCourse),
        courseModuleItemListJsonLd(spiffeCourse),
        ...(spiffeCourse.faqs ? [{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          'mainEntity': spiffeCourse.faqs.map(faq => ({
            '@type': 'Question',
            'name': faq.question,
            'acceptedAnswer': { '@type': 'Answer', 'text': faq.answer },
          })),
        }] : []),
      ],
    }));
    created++;

    spiffeCourse.modules.forEach(mod => {
      writeCourseModulePage(spiffeCourse, mod);
    });

    spiffeCourse.seoPages.forEach(page => {
      const seoDir = path.join(OUTPUT_DIR, 'courses', page.slug);
      fs.mkdirSync(seoDir, { recursive: true });
      fs.writeFileSync(path.join(seoDir, 'index.html'), makeHtml({
        title: compactSeoTitle(page.title, 52),
        description: page.description,
        url: `/courses/${page.slug}`,
        image: courseImagePath(spiffeCourse),
        content: renderSeoLandingContent(spiffeCourse, page),
        jsonLd: seoLandingJsonLd(spiffeCourse, page),
      }));
      created++;
    });
  }

  // Rich prerender for courses that do not have a legacy manual section below.
  const legacyManualCourseSlugs = new Set([
    'mastering-spiffe-spire',
  ]);
  courses
    .filter(course => !legacyManualCourseSlugs.has(course.slug))
    .forEach(course => {
      const courseLandingDir = path.join(OUTPUT_DIR, 'courses', course.slug);
      fs.mkdirSync(courseLandingDir, { recursive: true });
      fs.writeFileSync(path.join(courseLandingDir, 'index.html'), makeHtml({
        title: courseSeoTitle(course),
        description: courseSeoDescription(course),
        url: `/courses/${course.slug}`,
        image: courseImagePath(course),
        content: renderCourseLandingContent(course),
        jsonLd: [
          courseBreadcrumbJsonLd(course),
          courseJsonLd(course),
          courseModuleItemListJsonLd(course),
          ...(course.faqs ? [{
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            'mainEntity': course.faqs.map(faq => ({
              '@type': 'Question',
              'name': faq.question,
              'acceptedAnswer': { '@type': 'Answer', 'text': faq.answer },
            })),
          }] : []),
        ],
      }));
      created++;

      course.modules.forEach(mod => {
        writeCourseModulePage(course, mod);
      });

      course.seoPages.forEach(page => {
        const seoDir = path.join(OUTPUT_DIR, 'courses', page.slug);
        fs.mkdirSync(seoDir, { recursive: true });
        fs.writeFileSync(path.join(seoDir, 'index.html'), makeHtml({
          title: compactSeoTitle(page.title, 52),
          description: page.description,
          url: `/courses/${page.slug}`,
          image: courseImagePath(course),
          content: renderSeoLandingContent(course, page),
          jsonLd: seoLandingJsonLd(course, page),
        }));
        created++;
      });
    });

  // ── Cloud Native Security Engineering course ──
  if (!generatedCourseModelSlugs.has('cloud-native-security-engineering')) {
  const cnsDir = path.join(OUTPUT_DIR, 'courses', 'cloud-native-security-engineering');
  fs.mkdirSync(cnsDir, { recursive: true });
  fs.writeFileSync(path.join(cnsDir, 'index.html'), makeHtml({
    title: 'Cloud Native Security Engineering — Free Course',
    description: 'The most practical cloud-native security course. 16 modules covering Kubernetes security, Zero Trust, SPIFFE/SPIRE, OPA, Falco, eBPF, Sigstore, Vault, and AI infrastructure security. 50+ hands-on labs, 100% free.',
    url: '/courses/cloud-native-security-engineering',
    content: `<h1>Cloud Native Security Engineering</h1>
      <p>Securing Kubernetes, Workloads, APIs & Zero Trust Systems. 16 modules, 50+ labs, completely free.</p>
      <h2>Curriculum</h2>
      <ol>
        <li><a href="/courses/cloud-native-security-engineering/introduction-cloud-native-security">Introduction to Cloud Native Security</a></li>
        <li><a href="/courses/cloud-native-security-engineering/kubernetes-foundations-security">Kubernetes Foundations for Security</a></li>
        <li><a href="/courses/cloud-native-security-engineering/containers-workload-security">Containers & Workload Security</a></li>
        <li><a href="/courses/cloud-native-security-engineering/kubernetes-authentication-authorization">Kubernetes Authentication & Authorization</a></li>
        <li><a href="/courses/cloud-native-security-engineering/zero-trust-security-fundamentals">Zero Trust Security Fundamentals</a></li>
        <li><a href="/courses/cloud-native-security-engineering/spiffe-spire-deep-dive">SPIFFE & SPIRE Deep Dive</a></li>
        <li><a href="/courses/cloud-native-security-engineering/service-mesh-security">Service Mesh Security</a></li>
        <li><a href="/courses/cloud-native-security-engineering/policy-as-code-security">Policy-as-Code Security</a></li>
        <li><a href="/courses/cloud-native-security-engineering/secrets-management-machine-identity">Secrets Management & Machine Identity</a></li>
        <li><a href="/courses/cloud-native-security-engineering/runtime-security-threat-detection">Runtime Security & Threat Detection</a></li>
        <li><a href="/courses/cloud-native-security-engineering/supply-chain-security">Supply Chain Security</a></li>
        <li><a href="/courses/cloud-native-security-engineering/secure-cicd-pipelines">Secure CI/CD Pipelines</a></li>
        <li><a href="/courses/cloud-native-security-engineering/observability-security-monitoring">Observability & Security Monitoring</a></li>
        <li><a href="/courses/cloud-native-security-engineering/multi-cluster-multi-cloud-security">Multi-Cluster & Multi-Cloud Security</a></li>
        <li><a href="/courses/cloud-native-security-engineering/ai-infrastructure-security">AI Infrastructure Security</a></li>
        <li><a href="/courses/cloud-native-security-engineering/production-architecture-capstone">Production Architecture & Capstone</a></li>
      </ol>`,
  }));
  created++;

  const cnsModules = [
    { slug: 'introduction-cloud-native-security', title: 'Introduction to Cloud Native Security', desc: 'Why traditional security fails in cloud-native systems. Threat landscape, security principles, and the five pillars.' },
    { slug: 'kubernetes-foundations-security', title: 'Kubernetes Foundations for Security', desc: 'Kubernetes architecture, API request flow, RBAC, admission controllers, and the Kubernetes attack surface.' },
    { slug: 'containers-workload-security', title: 'Containers & Workload Security', desc: 'Linux isolation, seccomp, distroless images, Pod Security Standards, and container escape prevention.' },
    { slug: 'kubernetes-authentication-authorization', title: 'Kubernetes Authentication & Authorization', desc: 'Service accounts, OIDC, RBAC deep dive, and identity in distributed systems.' },
    { slug: 'zero-trust-security-fundamentals', title: 'Zero Trust Security Fundamentals', desc: 'Identity-based security, mTLS, microsegmentation, and east-west security for Kubernetes.' },
    { slug: 'spiffe-spire-deep-dive', title: 'SPIFFE & SPIRE Deep Dive', desc: 'Production workload identity with SPIFFE/SPIRE on Kubernetes. SVIDs, attestation, federation.' },
    { slug: 'service-mesh-security', title: 'Service Mesh Security', desc: 'Envoy, Istio, Linkerd — transparent mTLS, identity propagation, and authorization policies.' },
    { slug: 'policy-as-code-security', title: 'Policy-as-Code Security', desc: 'OPA Gatekeeper, Kyverno, admission controllers, and automated compliance enforcement.' },
    { slug: 'secrets-management-machine-identity', title: 'Secrets Management & Machine Identity', desc: 'HashiCorp Vault, dynamic secrets, certificate rotation, and replacing secret sprawl with workload identity.' },
    { slug: 'runtime-security-threat-detection', title: 'Runtime Security & Threat Detection', desc: 'Falco, Tetragon, eBPF — detecting container escapes, unauthorized access, and runtime threats.' },
    { slug: 'supply-chain-security', title: 'Supply Chain Security', desc: 'Sigstore, Cosign, SLSA, SBOM — image signing, provenance verification, and vulnerability tracking.' },
    { slug: 'secure-cicd-pipelines', title: 'Secure CI/CD Pipelines', desc: 'GitHub Actions hardening, secret scanning, OIDC deployment, and secure artifact signing.' },
    { slug: 'observability-security-monitoring', title: 'Observability & Security Monitoring', desc: 'OpenTelemetry, Kubernetes audit logs, security dashboards, and threat telemetry.' },
    { slug: 'multi-cluster-multi-cloud-security', title: 'Multi-Cluster & Multi-Cloud Security', desc: 'Federation, cross-cloud identity, hybrid infrastructure, and trust boundaries at scale.' },
    { slug: 'ai-infrastructure-security', title: 'AI Infrastructure Security', desc: 'Securing AI agents, LLM endpoints, MCP servers, vector databases, and inference pipelines.' },
    { slug: 'production-architecture-capstone', title: 'Production Architecture & Capstone', desc: 'Build a production-grade cloud-native security platform combining all five pillars.' },
  ];
  cnsModules.forEach((mod, i) => {
    const modDir = path.join(OUTPUT_DIR, 'courses', 'cloud-native-security-engineering', mod.slug);
    fs.mkdirSync(modDir, { recursive: true });
    fs.writeFileSync(path.join(modDir, 'index.html'), makeHtml({
      title: `Module ${i + 1}: ${mod.title} — Cloud Native Security Engineering`,
      description: mod.desc,
      url: `/courses/cloud-native-security-engineering/${mod.slug}`,
      content: `<h1>Module ${i + 1}: ${mod.title}</h1><p>${mod.desc}</p><p><a href="/courses/cloud-native-security-engineering">← Back to course curriculum</a></p>`,
    }));
    created++;
  });

  // CNS SEO pages
  const cnsSeoPages = [
    { slug: 'cloud-native-security-explained', title: 'Cloud Native Security Explained', desc: 'Why traditional security fails in cloud-native systems and how workload identity, Zero Trust, and policy-as-code create production-grade security.' },
    { slug: 'kubernetes-runtime-security', title: 'Kubernetes Runtime Security: Falco, Tetragon, and eBPF', desc: 'Detect container escapes, unauthorized syscalls, and runtime threats using Falco, Tetragon, and eBPF.' },
    { slug: 'kubernetes-supply-chain-security', title: 'Kubernetes Supply Chain Security: Sigstore, SLSA, and SBOM', desc: 'Secure your software supply chain with image signing, provenance verification, and vulnerability tracking.' },
    { slug: 'secure-service-to-service-communication', title: 'Secure Service-to-Service Communication in Kubernetes', desc: 'Implement mTLS, workload identity, and authorization for secure east-west traffic.' },
  ];
  cnsSeoPages.forEach(seo => {
    const seoDir = path.join(OUTPUT_DIR, 'courses', seo.slug);
    fs.mkdirSync(seoDir, { recursive: true });
    fs.writeFileSync(path.join(seoDir, 'index.html'), makeHtml({
      title: `${seo.title} — CodersSecret`,
      description: seo.desc,
      url: `/courses/${seo.slug}`,
      content: `<h1>${seo.title}</h1><p>${seo.desc}</p><p>Start the free <a href="/courses/cloud-native-security-engineering">Cloud Native Security Engineering</a> course.</p>`,
    }));
    created++;
  });
  }
}

// ── Slides pages (/slides/{slug}) — pre-render for every blog post ──
for (const post of posts) {
  const slideDir = path.join(OUTPUT_DIR, 'slides', post.slug);
  fs.mkdirSync(slideDir, { recursive: true });
  const customSlidePage = claudeTokenSlidesPrerender(post);
  if (customSlidePage) {
    const html = makeHtml(customSlidePage);
    fs.mkdirSync(slideDir, { recursive: true });
    fs.writeFileSync(path.join(slideDir, 'index.html'), html);
    created++;
    continue;
  }
  const slideTitle = `${compactSeoTitle(post.title, 42)} Slides`;
  const slideTopic = compactSeoTitle(post.title, 45);
  const slideDescription = `Watch narrated slides for ${slideTopic}. Review the core ideas with lightweight visuals, then read the full article for code and diagrams.`;
  const slideHtml = makeHtml({
    title: slideTitle,
    description: slideDescription,
    url: `/slides/${post.slug}`,
    extraHead: NOINDEX_FOLLOW_META,
    content: `<main>
      <nav aria-label="Breadcrumb"><a href="/">Home</a> / <a href="/blog/${post.slug}">Article</a> / Slides</nav>
      <h1>${escapeHtml(post.title)} Slides</h1>
      <p>${escapeHtml(slideDescription)}</p>
      <section>
        <h2>What You Will Learn</h2>
        <p>This slide version summarizes the same production engineering topic for quick review. Use it when you want a visual walkthrough before reading the deeper article.</p>
        <ul>
          <li>Main concepts from the article in a presentation-friendly format.</li>
          <li>Short explanations designed for review, sharing, and audio-first learning.</li>
          <li>Direct path back to the complete tutorial, code examples, and references.</li>
        </ul>
      </section>
      <p><a href="/blog/${post.slug}">Read the full article</a></p>
    </main>`,
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': [
          { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': SITE_URL },
          { '@type': 'ListItem', 'position': 2, 'name': 'Article', 'item': `${SITE_URL}/blog/${post.slug}` },
          { '@type': 'ListItem', 'position': 3, 'name': 'Slides', 'item': `${SITE_URL}/slides/${post.slug}` },
        ],
      },
      {
        '@context': 'https://schema.org',
        '@type': 'LearningResource',
        'name': slideTitle,
        'description': slideDescription,
        'url': `${SITE_URL}/slides/${post.slug}`,
        'isAccessibleForFree': true,
        'learningResourceType': 'Slide deck',
        'inLanguage': 'en',
      },
    ],
  });
  fs.mkdirSync(slideDir, { recursive: true });
  fs.writeFileSync(path.join(slideDir, 'index.html'), slideHtml);
  created++;
}

// ── /home/ redirect (Google sometimes discovers /home/ instead of /) ──
const standaloneSlidePages = [
  {
    slug: 'drf-api-logger',
    title: 'DRF API Logger Tutorial Slides',
    description: 'Watch a narrated slide walkthrough for DRF API Logger, Django REST Framework request logging, middleware flow, configuration, production usage, and debugging patterns.',
    articleUrl: '/blog/drf-api-logger-django-rest-framework',
    topic: 'Django REST Framework API logging',
  },
  {
    slug: 'python-c-extensions',
    title: 'Python C Extensions Tutorial Slides',
    description: 'Watch a narrated slide walkthrough for Python C extensions, CPython internals, native modules, performance tradeoffs, memory safety, and practical extension patterns.',
    articleUrl: '/blog/python-c-extensions-workshop',
    topic: 'Python C extension development',
  },
];

for (const slide of standaloneSlidePages) {
  const slideDir = path.join(OUTPUT_DIR, 'slides', slide.slug);
  fs.mkdirSync(slideDir, { recursive: true });
  const standaloneSlideHtml = makeHtml({
    title: slide.title,
    description: slide.description,
    url: `/slides/${slide.slug}`,
    extraHead: NOINDEX_FOLLOW_META,
    content: `<main>
      <nav aria-label="Breadcrumb"><a href="/">Home</a> / <a href="${slide.articleUrl}">Article</a> / Slides</nav>
      <h1>${escapeHtml(slide.title)}</h1>
      <p>${escapeHtml(slide.description)}</p>
      <section>
        <h2>Slide Learning Path</h2>
        <p>This standalone slide page gives crawlers and readers a clear summary of the tutorial before the Angular slide player loads. It covers ${escapeHtml(slide.topic)}, key implementation ideas, and where to continue learning.</p>
        <ul>
          <li>Start with the visual explanation to understand the architecture.</li>
          <li>Use the related article for complete code, configuration, and production notes.</li>
          <li>Return to CodersSecret courses and cheatsheets for deeper engineering context.</li>
        </ul>
      </section>
      <p><a href="${slide.articleUrl}">Read the full article</a></p>
    </main>`,
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': [
          { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': SITE_URL },
          { '@type': 'ListItem', 'position': 2, 'name': 'Article', 'item': `${SITE_URL}${slide.articleUrl}` },
          { '@type': 'ListItem', 'position': 3, 'name': 'Slides', 'item': `${SITE_URL}/slides/${slide.slug}` },
        ],
      },
      {
        '@context': 'https://schema.org',
        '@type': 'LearningResource',
        'name': slide.title,
        'description': slide.description,
        'url': `${SITE_URL}/slides/${slide.slug}`,
        'learningResourceType': 'Slide deck',
        'isAccessibleForFree': true,
        'inLanguage': 'en',
      },
    ],
  });
  fs.mkdirSync(slideDir, { recursive: true });
  fs.writeFileSync(path.join(slideDir, 'index.html'), standaloneSlideHtml);
  created++;
}

const homeDir = path.join(OUTPUT_DIR, 'home');
fs.mkdirSync(homeDir, { recursive: true });
fs.writeFileSync(path.join(homeDir, 'index.html'), `<!doctype html>
<html lang="en"><head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="description" content="Redirecting to the canonical CodersSecret homepage for practical engineering tutorials, courses, labs, and reference sheets.">
<meta name="robots" content="noindex">
<meta http-equiv="refresh" content="0;url=/">
<link rel="canonical" href="https://coderssecret.com">
<meta property="og:title" content="CodersSecret">
<meta property="og:description" content="Redirecting to the canonical CodersSecret homepage.">
<meta property="og:url" content="https://coderssecret.com">
<meta property="og:type" content="website">
<meta property="og:image" content="https://coderssecret.com/og-image.svg">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="CodersSecret">
<meta name="twitter:description" content="Redirecting to the canonical CodersSecret homepage.">
<meta name="twitter:image" content="https://coderssecret.com/og-image.svg">
<title>Redirecting to CodersSecret</title>
</head><body>
<main id="main-content" class="seo-prerender-content"><h1>Redirecting to CodersSecret</h1><p>Redirecting to <a href="/">the canonical CodersSecret homepage</a>.</p></main>
</body></html>`);
created++;

  // ── Production RAG Systems Engineering course ──
  if (!generatedCourseModelSlugs.has('production-rag-systems-engineering')) {
  const ragDir = path.join(OUTPUT_DIR, 'courses', 'production-rag-systems-engineering');
  fs.mkdirSync(ragDir, { recursive: true });
  fs.writeFileSync(path.join(ragDir, 'index.html'), makeHtml({
    title: 'Production-Grade RAG Systems Engineering — Free Course',
    description: 'Build scalable, reliable RAG systems. Embeddings, vector databases, hybrid retrieval, reranking, AI agents, evaluation, security, and Kubernetes deployment. 16 modules, 31 labs, free.',
    url: '/courses/production-rag-systems-engineering',
    content: '<h1>Production-Grade RAG Systems Engineering</h1><p>16 modules, 31 hands-on labs, completely free.</p>',
  }));
  created++;

  const ragModules = [
    { slug: 'introduction-ai-rag-systems', title: 'Introduction to AI & RAG Systems' },
    { slug: 'foundations-search-retrieval', title: 'Foundations of Search & Retrieval' },
    { slug: 'embeddings-deep-dive', title: 'Embeddings Deep Dive' },
    { slug: 'vector-databases-engineering', title: 'Vector Databases Engineering' },
    { slug: 'document-processing-chunking', title: 'Document Processing & Chunking' },
    { slug: 'building-basic-rag-systems', title: 'Building Basic RAG Systems' },
    { slug: 'advanced-retrieval-engineering', title: 'Advanced Retrieval Engineering' },
    { slug: 'ai-agents-agentic-rag', title: 'AI Agents & Agentic RAG' },
    { slug: 'production-rag-architecture', title: 'Production RAG Architecture' },
    { slug: 'rag-evaluation-quality-engineering', title: 'RAG Evaluation & Quality Engineering' },
    { slug: 'ai-observability-engineering', title: 'AI Observability Engineering' },
    { slug: 'security-rag-systems', title: 'Security for RAG Systems' },
    { slug: 'deploying-rag-systems', title: 'Deploying RAG Systems' },
    { slug: 'advanced-rag-architectures', title: 'Advanced RAG Architectures' },
    { slug: 'ai-infrastructure-future-systems', title: 'AI Infrastructure & Future Systems' },
    { slug: 'production-capstone-project', title: 'Production Capstone Project' },
  ];
  ragModules.forEach((mod, i) => {
    const modDir = path.join(OUTPUT_DIR, 'courses', 'production-rag-systems-engineering', mod.slug);
    fs.mkdirSync(modDir, { recursive: true });
    fs.writeFileSync(path.join(modDir, 'index.html'), makeHtml({
      title: `Module ${i + 1}: ${mod.title} — Production RAG Engineering`,
      description: `Module ${i + 1} of the Production-Grade RAG Systems Engineering course.`,
      url: `/courses/production-rag-systems-engineering/${mod.slug}`,
      content: `<h1>Module ${i + 1}: ${mod.title}</h1><p><a href="/courses/production-rag-systems-engineering">← Back to course</a></p>`,
    }));
    created++;
  });

  // RAG SEO pages
  const ragSeoPages = [
    { slug: 'what-is-rag', title: 'What is RAG? Retrieval-Augmented Generation Explained' },
    { slug: 'vector-database-comparison', title: 'Vector Database Comparison: Qdrant vs Pinecone vs pgvector' },
    { slug: 'hybrid-search-explained', title: 'Hybrid Search: Combining Keyword and Semantic Search' },
    { slug: 'ai-agents-explained', title: 'AI Agents: From Simple RAG to Agentic Systems' },
  ];
  ragSeoPages.forEach(seo => {
    const seoDir = path.join(OUTPUT_DIR, 'courses', seo.slug);
    fs.mkdirSync(seoDir, { recursive: true });
    fs.writeFileSync(path.join(seoDir, 'index.html'), makeHtml({
      title: `${seo.title} — CodersSecret`,
      description: seo.title,
      url: `/courses/${seo.slug}`,
      content: `<h1>${seo.title}</h1><p><a href="/courses/production-rag-systems-engineering">Start the free RAG course</a></p>`,
    }));
    created++;
  });

  // ── Distributed Systems Engineering course ──
  }

  if (!generatedCourseModelSlugs.has('distributed-systems-engineering')) {
  const dseDir = path.join(OUTPUT_DIR, 'courses', 'distributed-systems-engineering');
  fs.mkdirSync(dseDir, { recursive: true });
  fs.writeFileSync(path.join(dseDir, 'index.html'), makeHtml({
    title: 'Distributed Systems Engineering: Building Scalable, Reliable & Secure Systems — Free Course',
    description: 'Production-grade, beginner-friendly but deeply practical course on distributed systems. CAP, consensus (Raft/Paxos), distributed data, scalability, reliability, Zero Trust, observability, Kubernetes. 12 modules, hands-on labs, free.',
    url: '/courses/distributed-systems-engineering',
    content: '<h1>Distributed Systems Engineering</h1><p>12 modules, hands-on labs every module, completely free. CAP, consensus, replication, scalability, reliability, Zero Trust security, observability, Kubernetes-native architecture, real failure scenarios, and production system design.</p>',
  }));
  created++;

  const dseModules = [
    { slug: 'foundations-distributed-systems', title: 'Foundations of Distributed Systems' },
    { slug: 'networking-distributed-communication', title: 'Networking & Distributed Communication' },
    { slug: 'event-driven-asynchronous-systems', title: 'Event-Driven & Asynchronous Systems' },
    { slug: 'distributed-data-management', title: 'Distributed Data Management' },
    { slug: 'consensus-coordination', title: 'Consensus & Coordination' },
    { slug: 'scalability-engineering', title: 'Scalability Engineering' },
    { slug: 'reliability-failure-engineering', title: 'Reliability & Failure Engineering' },
    { slug: 'distributed-security-zero-trust', title: 'Distributed Security & Zero Trust' },
    { slug: 'observability-debugging', title: 'Observability & Debugging' },
    { slug: 'kubernetes-cloud-native-distributed-systems', title: 'Kubernetes & Cloud Native Distributed Systems' },
    { slug: 'real-world-failure-scenarios', title: 'Real-World Failure Scenarios' },
    { slug: 'production-system-design-capstone', title: 'Production System Design & Capstone' },
  ];
  dseModules.forEach((mod, i) => {
    const modDir = path.join(OUTPUT_DIR, 'courses', 'distributed-systems-engineering', mod.slug);
    fs.mkdirSync(modDir, { recursive: true });
    fs.writeFileSync(path.join(modDir, 'index.html'), makeHtml({
      title: `Module ${i + 1}: ${mod.title} — Distributed Systems Engineering`,
      description: `Module ${i + 1} of the Distributed Systems Engineering course.`,
      url: `/courses/distributed-systems-engineering/${mod.slug}`,
      content: `<h1>Module ${i + 1}: ${mod.title}</h1><p><a href="/courses/distributed-systems-engineering">← Back to course</a></p>`,
    }));
    created++;
  });

// ── Glossary pages ──
}

const glossaryTerms = [
  { slug: 'spiffe', term: 'SPIFFE', desc: 'Secure Production Identity Framework For Everyone — CNCF standard for workload identity.' },
  { slug: 'spire', term: 'SPIRE', desc: 'SPIFFE Runtime Environment — production implementation that issues and manages workload identities.' },
  { slug: 'zero-trust', term: 'Zero Trust', desc: 'Security architecture: never trust, always verify. Every request authenticated regardless of network location.' },
  { slug: 'workload-identity', term: 'Workload Identity', desc: 'Cryptographic identity for services and containers — replaces shared secrets and API keys.' },
  { slug: 'mtls', term: 'mTLS', desc: 'Mutual TLS — both client and server verify certificates. Foundation of Zero Trust communication.' },
  { slug: 'svid', term: 'SVID', desc: 'SPIFFE Verifiable Identity Document — X.509 certificate or JWT proving workload identity.' },
  { slug: 'opa', term: 'OPA', desc: 'Open Policy Agent — CNCF policy engine for policy-as-code with Rego language.' },
  { slug: 'falco', term: 'Falco', desc: 'CNCF runtime security tool — monitors syscalls and alerts on suspicious container behavior.' },
  { slug: 'service-mesh', term: 'Service Mesh', desc: 'Infrastructure layer of sidecar proxies handling mTLS, load balancing, and observability.' },
  { slug: 'sigstore', term: 'Sigstore', desc: 'Keyless container image signing and verification for supply chain security.' },
];

function glossaryDescription(term) {
  const desc = stripHtml(term.desc);
  if (desc.length >= 80) {
    return desc;
  }

  return `${desc} Practical definition for cloud-native security, platform engineering, and production architecture decisions.`;
}

function renderGlossaryHubContent(terms) {
  return `<main>
    <nav aria-label="Breadcrumb"><a href="/">Home</a> / Glossary</nav>
    <h1>Cloud Native Security Glossary</h1>
    <p>Definitions for SPIFFE, SPIRE, Zero Trust, workload identity, mTLS, OPA, Falco, and more cloud-native security terms.</p>
    <p>Use this glossary when reading CodersSecret courses, security guides, and production architecture articles. Each term links to a concise explanation and related operational context.</p>
    <ul>${terms.map(t => `<li><a href="/glossary/${t.slug}">${escapeHtml(t.term)}</a>: ${escapeHtml(glossaryDescription(t))}</li>`).join('')}</ul>
  </main>`;
}

function renderGlossaryTermContent(t) {
  return `<main>
    <nav aria-label="Breadcrumb"><a href="/">Home</a> / <a href="/glossary">Glossary</a> / ${escapeHtml(t.term)}</nav>
    <article>
      <h1>What is ${escapeHtml(t.term)}?</h1>
      <p>${escapeHtml(glossaryDescription(t))}</p>
      <section>
        <h2>Why It Matters</h2>
        <p>${escapeHtml(t.term)} appears in production engineering decisions around security, identity, reliability, and platform operations. Understanding the term helps you read architecture diagrams, debug incidents, and choose safer defaults.</p>
        <p>When you see ${escapeHtml(t.term)} in a course, article, architecture review, or incident write-up, connect it to the system boundary it protects, the team that owns it, and the failure mode it is meant to reduce.</p>
      </section>
      <section>
        <h2>Where to Learn Next</h2>
        <p>Continue with <a href="/courses">free CodersSecret courses</a>, <a href="/cheatsheets">operational cheatsheets</a>, or <a href="/blog">deep technical articles</a> for implementation-level examples.</p>
      </section>
      <p><a href="/glossary">All glossary terms</a></p>
    </article>
  </main>`;
}

function glossaryJsonLd(t) {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [
        { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': SITE_URL },
        { '@type': 'ListItem', 'position': 2, 'name': 'Glossary', 'item': `${SITE_URL}/glossary` },
        { '@type': 'ListItem', 'position': 3, 'name': t.term, 'item': `${SITE_URL}/glossary/${t.slug}` },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'DefinedTerm',
      'name': t.term,
      'description': glossaryDescription(t),
      'url': `${SITE_URL}/glossary/${t.slug}`,
      'inDefinedTermSet': `${SITE_URL}/glossary`,
    },
  ];
}

const glossaryHubDir = path.join(OUTPUT_DIR, 'glossary');
fs.mkdirSync(glossaryHubDir, { recursive: true });
fs.writeFileSync(path.join(glossaryHubDir, 'index.html'), makeHtml({
  title: 'Cloud Native Security Glossary — CodersSecret',
  description: 'Definitions for SPIFFE, SPIRE, Zero Trust, workload identity, mTLS, OPA, Falco, and more cloud-native security terms.',
  url: '/glossary',
  content: renderGlossaryHubContent(glossaryTerms),
}));
created++;
glossaryTerms.forEach(t => {
  const termDir = path.join(OUTPUT_DIR, 'glossary', t.slug);
  fs.mkdirSync(termDir, { recursive: true });
  fs.writeFileSync(path.join(termDir, 'index.html'), makeHtml({
    title: `What is ${t.term}? — CodersSecret Glossary`,
    description: glossaryDescription(t),
    url: `/glossary/${t.slug}`,
    content: renderGlossaryTermContent(t),
    jsonLd: glossaryJsonLd(t),
  }));
  created++;
});

// ── About page (/about) ──────────────────────
const aboutDir = path.join(OUTPUT_DIR, 'about');
fs.mkdirSync(aboutDir, { recursive: true });
fs.writeFileSync(path.join(aboutDir, 'index.html'), makeHtml({
  title: 'About CodersSecret — Vishal Anand',
  description: 'CodersSecret is a technical blog by Vishal Anand, Senior Product Engineer and Tech Lead, covering Python, Kubernetes, security, and system design with production-grade tutorials.',
  url: '/about',
  content: `
    <h1>About CodersSecret</h1>
    <p>CodersSecret is written by Vishal Anand — a Senior Product Engineer and Tech Lead with experience building production systems at scale. The blog covers backend architecture, DevOps, security, Kubernetes, Python, and system design with practical, production-grade tutorials.</p>
    <p>The <a href="${SPOTIFY_PODCAST_URL}">CodersSecret Podcast on Spotify</a> turns the same production engineering topics into audio-first explainers for screen-free learning.</p>
    <p>The site focuses on systems that engineers actually operate: API gateways, workload identity, distributed systems, RAG infrastructure, analytics engineering, observability, platform security, and production debugging.</p>
    <p>Every guide aims to connect the concept, the implementation path, the failure mode, and the operational tradeoff so readers can use the material in real projects instead of only memorizing definitions.</p>
    <p>${posts.length} articles published across ${categories.size} categories.</p>
    <p><a href="/blog">Browse all articles</a></p>
  `,
}));
created++;

const legalPages = [
  {
    slug: 'privacy',
    title: 'Privacy Policy',
    description: 'CodersSecret Privacy Policy: analytics, browser storage, GitHub comments, third-party services, cookies, retention, and user choices.',
    content: `
      <h1>Privacy Policy</h1>
      <p>Last updated: May 20, 2026.</p>
      <p>CodersSecret is a free technical education website. You can read articles, open courses, use cheatsheets, play games, and watch narrated slides without creating an account.</p>
      <p>We do not directly collect names, email addresses, phone numbers, payment details, or account passwords. We do not sell personal data and we do not use advertising pixels, remarketing tags, or session replay tools.</p>
      <p>We use Google Analytics 4 for aggregate traffic, on-site search, scroll-depth, and Core Web Vitals reporting. We use local browser storage for theme and slide-player preferences. Blog comments are optional and use Giscus with GitHub Discussions.</p>
      <p>External services such as Google, GitHub, YouTube, Spotify, Buy Me a Coffee, LinkedIn, and Instagram have their own privacy practices when you interact with them.</p>
    `,
  },
  {
    slug: 'terms',
    title: 'Terms of Service',
    description: 'CodersSecret Terms of Service: educational content, acceptable use, comments, content reuse, third-party links, warranty, and liability.',
    content: `
      <h1>Terms of Service</h1>
      <p>Last updated: May 20, 2026.</p>
      <p>By using CodersSecret, you agree to these terms. CodersSecret publishes free educational content about software engineering, backend systems, cloud native security, AI infrastructure, analytics engineering, games, cheatsheets, and narrated slides.</p>
      <p>Content is provided for learning and reference only. Code snippets, diagrams, infrastructure commands, and security examples may need adaptation before use in your own environment. Always review official documentation and perform security, compliance, cost, backup, and rollout checks before applying anything to production.</p>
      <p>You may link to CodersSecret pages and quote short excerpts with attribution. Do not republish full articles, course modules, diagrams, slide scripts, or generated media without permission.</p>
      <p>Comments use Giscus and GitHub Discussions. You are responsible for what you post, and comments may be moderated if they are spam, abusive, unsafe, illegal, or off-topic.</p>
      <p>The site is provided as is and as available. To the fullest extent permitted by law, CodersSecret and its contributors are not liable for damages arising from use of the site or reliance on its content.</p>
    `,
  },
  {
    slug: 'cookies',
    title: 'Cookie Policy',
    description: 'CodersSecret Cookie Policy: Google Analytics cookies, browser storage, slide preferences, GitHub comments, and cookie controls.',
    content: `
      <h1>Cookie Policy</h1>
      <p>Last updated: May 20, 2026.</p>
      <p>CodersSecret uses a small number of cookies and browser storage keys. We do not use advertising cookies, remarketing cookies, session replay tools, or marketing pixels.</p>
      <p>Browser storage keys include theme, slides.voice, and slides.rate for local display and slide-player preferences. Google Analytics may set _ga and _ga_* cookies for aggregate analytics and session measurement.</p>
      <p>GitHub or Giscus cookies/storage may apply only when you interact with GitHub-powered comments. External services such as YouTube, Spotify, Buy Me a Coffee, LinkedIn, and Instagram may set their own cookies after you leave CodersSecret.</p>
      <p>You can block or delete cookies in your browser settings. CodersSecret content remains available if analytics cookies are blocked.</p>
    `,
  },
];

for (const page of legalPages) {
  const dir = path.join(OUTPUT_DIR, page.slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), makeHtml({
    title: page.title,
    description: page.description,
    url: `/${page.slug}`,
    content: page.content,
  }));
  created++;
}

// ── Generate 404.html — FULL Angular app with noindex ──
// GitHub Pages serves this for any path without a pre-rendered index.html.
// Angular Router then takes over and shows the correct page (SPA routing).
// This prevents "Redirect error" from Google because the page actually renders.
const consultationDir = path.join(OUTPUT_DIR, 'consultation');
fs.mkdirSync(consultationDir, { recursive: true });
fs.writeFileSync(path.join(consultationDir, 'index.html'), makeHtml({
  title: 'Technical Consultation for Engineers',
  description: 'Book focused technical consultation for system design, backend architecture, Kubernetes, API performance, AI infrastructure, security reviews, and production debugging.',
  url: '/consultation',
  content: `<main>
    <nav aria-label="Breadcrumb"><a href="/">Home</a> / Consultation</nav>
    <h1>Technical Consultation for Engineers</h1>
    <p>Book focused technical consultation for system design, backend architecture, Kubernetes, API performance, AI infrastructure, security reviews, and production debugging.</p>
    <section>
      <h2>Where This Helps</h2>
      <ul>
        <li>Reviewing architecture decisions before implementation.</li>
        <li>Debugging production performance, reliability, or scaling issues.</li>
        <li>Planning security improvements for APIs, Kubernetes, service-to-service identity, or AI tooling.</li>
        <li>Turning a confusing technical roadmap into concrete engineering steps.</li>
      </ul>
    </section>
    <section>
      <h2>Related Free Material</h2>
      <p>Before booking, you can also explore <a href="/courses">free courses</a>, <a href="/blog">technical articles</a>, <a href="/cheatsheets">cheatsheets</a>, and <a href="/games">interactive labs</a>.</p>
    </section>
  </main>`,
  jsonLd: [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [
        { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': SITE_URL },
        { '@type': 'ListItem', 'position': 2, 'name': 'Consultation', 'item': `${SITE_URL}/consultation` },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      'name': 'Technical Consultation',
      'description': 'Focused technical consultation for production engineering, architecture, Kubernetes, backend systems, security, and AI infrastructure.',
      'provider': {
        '@type': 'Person',
        'name': 'Vishal Anand',
        'url': `${SITE_URL}/about`,
      },
      'areaServed': 'Worldwide',
      'url': `${SITE_URL}/consultation`,
    },
  ],
}));
created++;

let notFoundHtml = makeHtml({
  title: 'Page Not Found',
  description: 'The requested CodersSecret page does not exist. Return to the homepage or browse engineering articles, courses, labs, and reference sheets.',
  url: '/404',
  content: `<main>
    <h1>Page Not Found</h1>
    <p>The page you are looking for does not exist or has been moved.</p>
    <p><a href="/">Go to Home</a> | <a href="/blog">Browse Blog</a></p>
  </main>`,
});
// Add noindex so Google ignores the 404 fallback. The script only normalizes
// non-root trailing-slash paths; root remains stable and assets are untouched.
notFoundHtml = notFoundHtml.replace('</head>', `  <meta name="robots" content="noindex">
  <script>
    (function () {
      var path = window.location.pathname;
      var canonicalPath = path.replace(/\\/+$/, '') || '/';
      if (canonicalPath === '/blog' && window.location.search) {
        window.location.replace('/blog' + window.location.hash);
        return;
      }
      if (path.length > 1 && /\\/$/.test(path)) {
        window.location.replace(canonicalPath + window.location.search + window.location.hash);
      }
    })();
  </script>
</head>`);
fs.writeFileSync(path.join(OUTPUT_DIR, '404.html'), notFoundHtml);

const extensionlessAliases = writeExtensionlessRouteAliases();

assertGeneratedSeoContent([
  {
    route: 'index.html',
    requiredText: ['Security, AI, Data & Production Engineering', 'Start a Free Course'],
  },
  {
    route: 'blog/index.html',
    requiredText: ['Learn the systems behind production software', 'Browse by topic', 'Watch as Slides'],
  },
  {
    route: 'blog/mcp-security-production-ai-agents-oauth-gateways/index.html',
    requiredText: ['MCP Security in Production', 'On this page', 'Discussion', 'Continue Reading'],
  },
  {
    route: 'consultation/index.html',
    requiredText: ['Architecture, Security, and Production Engineering Consulting', 'Submit your challenge'],
  },
  {
    route: 'slides/build-your-own-design-system-guide/index.html',
    requiredText: ['Building Your Own Design System', 'app-slide-player'],
  },
  {
    route: 'slides/x86-vs-arm-architecture-comparison/index.html',
    requiredText: ['x86 vs ARM', 'app-slide-player'],
  },
  {
    route: 'slides/kubernetes-operators-build-your-own-with-golang/index.html',
    requiredText: ['Kubernetes Operators', 'app-slide-player'],
  },
  {
    route: 'slides/solid-principles-practical-examples/index.html',
    requiredText: ['SOLID Principles', 'app-slide-player'],
  },
  {
    route: 'games/kubernetes-security-simulator/index.html',
    requiredText: ['Kubernetes Security Simulator', 'Practice loop', 'Start simulation'],
  },
  {
    route: 'games/service-mesh-routing/index.html',
    requiredText: ['Service Mesh Routing Game', 'Practice loop', 'Start simulation'],
  },
  {
    route: 'games/guess-output/index.html',
    requiredText: ['Guess the Output', 'Question 1 of', 'What does this code print?'],
  },
  {
    route: 'cheatsheets/kubernetes-security/index.html',
    requiredText: ['Kubernetes Security', 'kubectl auth can-i', 'PodSecurity'],
  },
  {
    route: 'cheatsheets/api-security/index.html',
    requiredText: ['API Security', 'jwt.verify', 'OAuth2 / OIDC'],
  },
  {
    route: 'courses/mastering-spiffe-spire/understanding-zero-trust-security/slides/index.html',
    requiredText: ['Understanding Zero Trust Security', 'Module 1 of 13', 'app-slide-player'],
  },
]);
const removedDirectoryIndexes = removeNonCanonicalDirectoryIndexes();
const removedEmptyRouteDirectories = removeEmptyRouteDirectories();
const staticRedirectRules = writeStaticRedirectRules();
cleanupPrerenderRuntime();

function writeExtensionlessRouteAliases() {
  const outputRoot = path.resolve(OUTPUT_DIR);
  let aliases = 0;

  function visit(dir) {
    const indexPath = path.join(dir, 'index.html');
    const relativeDir = path.relative(outputRoot, dir);
    if (relativeDir && fs.existsSync(indexPath)) {
      const aliasPath = path.resolve(outputRoot, `${relativeDir}.html`);
      if (aliasPath.startsWith(outputRoot + path.sep)) {
        fs.copyFileSync(indexPath, aliasPath);
        aliases++;
      }
    }

    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory()) {
        visit(path.join(dir, entry.name));
      }
    }
  }

  visit(outputRoot);
  return aliases;
}

function removeNonCanonicalDirectoryIndexes() {
  const outputRoot = path.resolve(OUTPUT_DIR);
  let removed = 0;

  function visit(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory()) {
        visit(path.join(dir, entry.name));
      }
    }

    const relativeDir = path.relative(outputRoot, dir);
    const indexPath = path.join(dir, 'index.html');
    if (relativeDir && fs.existsSync(indexPath)) {
      const resolved = path.resolve(indexPath);
      if (resolved.startsWith(outputRoot + path.sep)) {
        fs.rmSync(resolved, { force: true });
        removed++;
      }
    }
  }

  visit(outputRoot);
  return removed;
}

function removeEmptyRouteDirectories() {
  const outputRoot = path.resolve(OUTPUT_DIR);
  let removed = 0;

  function visit(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory()) {
        visit(path.join(dir, entry.name));
      }
    }

    const relativeDir = path.relative(outputRoot, dir);
    if (!relativeDir) {
      return;
    }

    if (fs.readdirSync(dir).length > 0) {
      return;
    }

    const aliasPath = path.resolve(outputRoot, `${relativeDir}.html`);
    const resolvedDir = path.resolve(dir);
    if (aliasPath.startsWith(outputRoot + path.sep) && fs.existsSync(aliasPath) && resolvedDir.startsWith(outputRoot + path.sep)) {
      fs.rmSync(resolvedDir, { recursive: true, force: true });
      removed++;
    }
  }

  visit(outputRoot);
  return removed;
}

function writeStaticRedirectRules() {
  const outputRoot = path.resolve(OUTPUT_DIR);
  const rules = [
    '# Canonical redirects for hosts that support _redirects, such as Netlify or Cloudflare Pages.',
    '# GitHub Pages ignores this file; 404.html keeps a client-side canonical fallback for users.',
    'http://coderssecret.com/* https://coderssecret.com/:splat 301!',
    'https://www.coderssecret.com/* https://coderssecret.com/:splat 301!',
    '/blog/?tag=:tag /blog 301!',
    '/blog?tag=:tag /blog 301!',
  ];
  const routePaths = [];

  function visit(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        visit(fullPath);
        continue;
      }

      if (!entry.name.endsWith('.html') || entry.name === 'index.html' || entry.name === '404.html') {
        continue;
      }

      const relative = path.relative(outputRoot, fullPath).replace(/\\/g, '/');
      routePaths.push(`/${relative.replace(/\.html$/, '')}`);
    }
  }

  visit(outputRoot);
  for (const routePath of [...new Set(routePaths)].sort()) {
    rules.push(`${routePath}/ ${routePath} 301!`);
  }

  fs.writeFileSync(path.join(OUTPUT_DIR, '_redirects'), `${rules.join('\n')}\n`);
  return rules.length;
}

function extensionlessAliasForRoute(route) {
  if (route === 'index.html' || !route.endsWith('/index.html')) {
    return '';
  }

  return route.replace(/\/index\.html$/, '.html');
}

function assertGeneratedSeoContent(checks) {
  const failures = [];

  for (const check of checks) {
    const filePath = path.join(OUTPUT_DIR, check.route);
    if (!fs.existsSync(filePath)) {
      failures.push(`${check.route}: file missing`);
      continue;
    }

    const aliasRoute = extensionlessAliasForRoute(check.route);
    if (aliasRoute && !fs.existsSync(path.join(OUTPUT_DIR, aliasRoute))) {
      failures.push(`${aliasRoute}: extensionless route alias missing`);
    }

    const html = fs.readFileSync(filePath, 'utf-8');
    const appRootMatch = html.match(/<app-root\b[^>]*>[\s\S]*?<\/app-root>/i);
    if (!appRootMatch) {
      failures.push(`${check.route}: missing rendered <app-root>`);
      continue;
    }

    const appRootText = stripHtml(appRootMatch[0]);
    if (appRootText.length < 120) {
      failures.push(`${check.route}: rendered app source is too small`);
    }

    if (/<main\b[^>]*class=["'][^"']*\bseo-prerender-content\b/i.test(appRootMatch[0])) {
      failures.push(`${check.route}: still contains old summary-only seo-prerender-content main`);
    }

    if (!/<link rel="canonical" href="https:\/\/coderssecret\.com(?:\/[^"]*)?"/.test(html)) {
      failures.push(`${check.route}: missing canonical link`);
    }

    if (!/<script type="application\/ld\+json">/.test(html)) {
      failures.push(`${check.route}: missing JSON-LD`);
    }

    for (const text of check.requiredText) {
      if (!html.includes(text)) {
        failures.push(`${check.route}: missing "${text}"`);
      }
    }
  }

  if (failures.length > 0) {
    throw new Error(`Static SEO prerender content check failed:\n${failures.join('\n')}`);
  }
}

console.log(`✅ Pre-rendered ${created} route files + 404.html with SEO content.`);
console.log(`   Extensionless aliases: ${extensionlessAliases}`);
console.log(`   Removed non-canonical directory index files: ${removedDirectoryIndexes}`);
console.log(`   Removed empty route directories: ${removedEmptyRouteDirectories}`);
console.log(`   Static redirect rules: ${staticRedirectRules}`);
console.log(`   Blog posts: ${posts.length}`);
console.log(`   Categories: ${categories.size}`);
console.log(`   Blog list: 1`);
console.log(`   404.html: Angular app with noindex and client-side canonical fallback`);
console.log(`   Each page has: unique <title>, meta description, OG tags, canonical URL, and real HTML content.`);
