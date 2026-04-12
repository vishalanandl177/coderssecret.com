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
const path = require('path');

const SITE_URL = 'https://coderssecret.com';
const OUTPUT_DIR = path.join(__dirname, '..', 'dist', 'coderssecret-app', 'browser');

// Read the blog post model
const modelPath = path.join(__dirname, '..', 'src', 'app', 'models', 'blog-post.model.ts');
const modelContent = fs.readFileSync(modelPath, 'utf-8');

// Extract post data — handle titles with escaped quotes
const posts = [];
const lines = modelContent.split('\n');
let currentPost = {};

for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();

  const idMatch = line.match(/^id:\s*'(\d+)'/);
  if (idMatch) {
    currentPost = { id: idMatch[1] };
    continue;
  }

  if (currentPost.id) {
    const titleMatch = line.match(/^title:\s*'(.+)',?\s*$/);
    if (titleMatch) {
      currentPost.title = titleMatch[1].replace(/\\'/g, "'");
      continue;
    }

    const slugMatch = line.match(/^slug:\s*'([^']+)'/);
    if (slugMatch) {
      currentPost.slug = slugMatch[1];
      continue;
    }

    const excerptMatch = line.match(/^excerpt:\s*'(.+)',?\s*$/);
    if (excerptMatch) {
      currentPost.excerpt = excerptMatch[1].replace(/\\'/g, "'");
      continue;
    }

    const catMatch = line.match(/^category:\s*'([^']+)'/);
    if (catMatch && !currentPost.category) {
      currentPost.category = catMatch[1];
    }

    if (currentPost.id && currentPost.title && currentPost.slug && currentPost.excerpt) {
      posts.push({ ...currentPost });
      currentPost = {};
    }
  }
}

// Extract categories
const categoryRegex = /category:\s*'([^']+)'/g;
const categories = new Set();
while ((m = categoryRegex.exec(modelContent)) !== null) {
  categories.add(m[1]);
}

// Category display names
const categoryNames = {
  frontend: 'Frontend',
  backend: 'Backend',
  devops: 'DevOps',
  tutorials: 'Tutorials',
  'open-source': 'Open Source',
};

// Read the built index.html
const baseHtml = fs.readFileSync(path.join(OUTPUT_DIR, 'index.html'), 'utf-8');

function makeHtml(options) {
  const { title, description, url, content } = options;
  const fullTitle = `${title} | CodersSecret`;
  const canonical = `${SITE_URL}${url}`;

  let html = baseHtml;

  // Replace <title>
  html = html.replace(
    /<title>[^<]*<\/title>/,
    `<title>${fullTitle}</title>`
  );

  // Replace meta description
  html = html.replace(
    /<meta name="description" content="[^"]*">/,
    `<meta name="description" content="${description}">`
  );

  // Add canonical link before </head>
  html = html.replace(
    '</head>',
    `  <link rel="canonical" href="${canonical}">\n` +
    `  <meta property="og:title" content="${fullTitle}">\n` +
    `  <meta property="og:description" content="${description}">\n` +
    `  <meta property="og:url" content="${canonical}">\n` +
    `  <meta property="og:type" content="website">\n` +
    `  <meta name="twitter:card" content="summary_large_image">\n` +
    `  <meta name="twitter:title" content="${fullTitle}">\n` +
    `  <meta name="twitter:description" content="${description}">\n` +
    '</head>'
  );

  // Inject real content inside <app-root> so Google can read it
  html = html.replace(
    '<app-root></app-root>',
    `<app-root>${content}</app-root>`
  );

  return html;
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

let created = 0;

// ── Blog list page (/blog) ────────────────────
const blogListContent = `
  <h1>All Articles — CodersSecret</h1>
  <p>Battle-tested guides on Python, DevOps, APIs, and system design.</p>
  <ul>
    ${posts.map(p => `<li><a href="/blog/${p.slug}">${escapeHtml(p.title)}</a> — ${escapeHtml(p.excerpt)}</li>`).join('\n    ')}
  </ul>
`;
const blogDir = path.join(OUTPUT_DIR, 'blog');
fs.mkdirSync(blogDir, { recursive: true });
fs.writeFileSync(path.join(blogDir, 'index.html'), makeHtml({
  title: 'All Articles',
  description: 'Browse all articles on Python, DevOps, APIs, Kubernetes, security, and modern web development.',
  url: '/blog',
  content: blogListContent,
}));
created++;

// ── Individual blog posts (/blog/:slug) ───────
for (const post of posts) {
  const dir = path.join(OUTPUT_DIR, 'blog', post.slug);
  fs.mkdirSync(dir, { recursive: true });

  const content = `
    <article>
      <h1>${escapeHtml(post.title)}</h1>
      <p>${escapeHtml(post.excerpt)}</p>
      <p>Read the full article on <a href="/blog/${post.slug}">CodersSecret</a>.</p>
    </article>
  `;

  fs.writeFileSync(path.join(dir, 'index.html'), makeHtml({
    title: post.title,
    description: post.excerpt,
    url: `/blog/${post.slug}`,
    content,
  }));
  created++;
}

// ── Category pages (/category/:slug) ──────────
for (const cat of categories) {
  const dir = path.join(OUTPUT_DIR, 'category', cat);
  fs.mkdirSync(dir, { recursive: true });

  const catName = categoryNames[cat] || cat;
  const catPosts = posts.filter(p => p.category === cat);

  const description = {
    frontend: 'Tutorials and deep dives into Angular, React, TypeScript, CSS, and modern frontend development.',
    backend: 'Practical guides on Python, Django, APIs, authentication, and backend architecture patterns.',
    devops: 'Learn Kubernetes, Docker, CI/CD, cron jobs, and infrastructure automation for production systems.',
    tutorials: 'Step-by-step workshops and hands-on tutorials for developers at every level.',
    'open-source': 'Discover and contribute to open-source projects, tools, and libraries.',
  }[cat] || `Browse articles about ${catName} on CodersSecret.`;

  const content = `
    <h1>${catName} Articles — CodersSecret</h1>
    <p>${description}</p>
    <ul>
      ${catPosts.map(p => `<li><a href="/blog/${p.slug}">${escapeHtml(p.title)}</a> — ${escapeHtml(p.excerpt)}</li>`).join('\n      ')}
    </ul>
  `;

  fs.writeFileSync(path.join(dir, 'index.html'), makeHtml({
    title: `${catName} Articles`,
    description,
    url: `/category/${cat}`,
    content,
  }));
  created++;
}

// ── Generate 404.html with Angular app (no redirect!) ──
const notFoundHtml = makeHtml({
  title: 'Page Not Found',
  description: 'The page you are looking for does not exist.',
  url: '/',
  content: `
    <h1>Page Not Found</h1>
    <p>The page you are looking for does not exist or has been moved.</p>
    <p><a href="/">Go to Home</a> | <a href="/blog">Browse Blog</a></p>
  `,
});
// Add noindex meta tag so Google ignores 404 pages
const notFoundFinal = notFoundHtml.replace('</head>', '  <meta name="robots" content="noindex">\n</head>');
fs.writeFileSync(path.join(OUTPUT_DIR, '404.html'), notFoundFinal);

console.log(`✅ Pre-rendered ${created} route files + 404.html with SEO content.`);
console.log(`   Blog posts: ${posts.length}`);
console.log(`   Categories: ${categories.size}`);
console.log(`   Blog list: 1`);
console.log(`   404.html: Angular app with noindex (no redirect!)`);
console.log(`   Each page has: unique <title>, meta description, OG tags, canonical URL, and real HTML content.`);
