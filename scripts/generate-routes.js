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
  const { title, description, url, content, jsonLd, image } = options;
  const fullTitle = `${title} | CodersSecret`;
  const canonical = `${SITE_URL}${url}`;
  const ogImage = image ? `${SITE_URL}${image}` : `${SITE_URL}/og-image.svg`;

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
    `  <meta property="og:image" content="${ogImage}">\n` +
    `  <meta name="twitter:card" content="summary_large_image">\n` +
    `  <meta name="twitter:title" content="${fullTitle}">\n` +
    `  <meta name="twitter:description" content="${description}">\n` +
    `  <meta name="twitter:image" content="${ogImage}">\n` +
    `  <link rel="alternate" hreflang="en" href="${canonical}">\n` +
    (jsonLd ? `  <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>\n` : '') +
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

  // Find related posts by category/tags
  const related = posts
    .filter(p => p.slug !== post.slug && (p.category === post.category))
    .slice(0, 3);
  const tags = post.tags || [];

  const content = `
    <article>
      <nav aria-label="Breadcrumb"><a href="/">Home</a> / <a href="/blog">Blog</a> / ${escapeHtml(post.title)}</nav>
      <h1>${escapeHtml(post.title)}</h1>
      <p>By Coder Secret | ${post.date || ''} | Category: ${post.category || ''}</p>
      <p>${escapeHtml(post.excerpt)}</p>
      ${tags.length > 0 ? '<p>Tags: ' + tags.map(t => `<a href="/blog?tag=${encodeURIComponent(t)}">${escapeHtml(t)}</a>`).join(', ') + '</p>' : ''}
      <p>Read the full article on <a href="/blog/${post.slug}">CodersSecret</a>.</p>
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
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/blog/${post.slug}`,
    },
    'keywords': (post.tags || []).join(', '),
    'articleSection': post.category || '',
  };

  const bannerUrl = `/images/banners/${post.slug}.svg`;
  blogJsonLd.image = `${SITE_URL}${bannerUrl}`;

  fs.writeFileSync(path.join(dir, 'index.html'), makeHtml({
    title: post.title,
    description: post.excerpt,
    url: `/blog/${post.slug}`,
    content,
    jsonLd: blogJsonLd,
    image: bannerUrl,
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

// ── Legal pages (privacy, terms, cookies) ────
// ── Games pages (/games, /games/:slug) ──────
const games = [
  {
    slug: '',
    title: 'Developer Games — Coding Challenges & Interactive Tools',
    description: 'Fun coding challenges for developers: spot bugs, guess code outputs, debug production scenarios, test typing speed, and more. Sharpen your skills while having fun.',
    heading: 'Developer Games',
    content: 'Interactive games and tools for software engineers: Guess the Output, Spot the Bug, DevOps Scenario Simulator, Code Typing Speed Test, Tech Salary Calculator, and Linux Command Challenge.',
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

for (const game of games) {
  const gameDir = game.slug ? path.join(OUTPUT_DIR, 'games', game.slug) : path.join(OUTPUT_DIR, 'games');
  fs.mkdirSync(gameDir, { recursive: true });
  fs.writeFileSync(path.join(gameDir, 'index.html'), makeHtml({
    title: game.title,
    description: game.description,
    url: game.slug ? `/games/${game.slug}` : '/games',
    content: `
      <nav><a href="/">Home</a> / <a href="/games">Games</a>${game.slug ? ` / ${game.heading}` : ''}</nav>
      <h1>${game.heading}</h1>
      <p>${game.content}</p>
      ${!game.slug ? '<ul>' + games.filter(g => g.slug).map(g => `<li><a href="/games/${g.slug}">${g.heading}</a></li>`).join('') + '</ul>' : '<p><a href="/games">← Back to all games</a></p>'}
    `,
  }));
  created++;
}

// ── Cheatsheets pages ────────────────────────
const cheatsheets = [
  { slug: '', name: 'Developer Cheat Sheets', desc: 'Quick-reference cheat sheets for Python, Kubernetes, Git, Docker, and SQL.' },
  { slug: 'python', name: 'Python Cheat Sheet', desc: 'Essential Python syntax: data types, strings, lists, dicts, functions, classes, file I/O, and more.' },
  { slug: 'kubernetes', name: 'Kubernetes Cheat Sheet', desc: 'Essential kubectl commands: pods, deployments, services, debugging, config, and cluster ops.' },
  { slug: 'git', name: 'Git Cheat Sheet', desc: 'Git commands: branch, merge, rebase, stash, reset, log, cherry-pick, and undoing mistakes.' },
  { slug: 'docker', name: 'Docker Cheat Sheet', desc: 'Docker commands: build, run, compose, volumes, networks, debugging, and cleanup.' },
  { slug: 'sql', name: 'SQL Cheat Sheet', desc: 'SQL reference: SELECT, JOIN, GROUP BY, window functions, CTEs, indexes, and performance.' },
];
for (const cs of cheatsheets) {
  const csDir = cs.slug ? path.join(OUTPUT_DIR, 'cheatsheets', cs.slug) : path.join(OUTPUT_DIR, 'cheatsheets');
  fs.mkdirSync(csDir, { recursive: true });
  fs.writeFileSync(path.join(csDir, 'index.html'), makeHtml({
    title: cs.name,
    description: cs.desc,
    url: cs.slug ? `/cheatsheets/${cs.slug}` : '/cheatsheets',
    content: `<h1>${cs.name}</h1><p>${cs.desc}</p>${!cs.slug ? '<ul>' + cheatsheets.filter(c => c.slug).map(c => `<li><a href="/cheatsheets/${c.slug}">${c.name}</a></li>`).join('') + '</ul>' : '<p><a href="/cheatsheets">← All Cheat Sheets</a></p>'}`,
  }));
  created++;
}

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
    <p>${posts.length} articles published across ${categories.size} categories.</p>
    <p><a href="/blog">Browse all articles</a></p>
  `,
}));
created++;

const legalPages = [
  {
    slug: 'privacy',
    title: 'Privacy Policy',
    description: 'CodersSecret Privacy Policy — we collect minimal anonymous analytics data, no personal information, no advertising cookies.',
    content: `
      <h1>Privacy Policy</h1>
      <p>CodersSecret does not collect personal information. We use Google Analytics for anonymous usage data. We do not sell data to advertisers. Read the full privacy policy on the site.</p>
    `,
  },
  {
    slug: 'terms',
    title: 'Terms of Service',
    description: 'CodersSecret Terms of Service — rules for using the site, content licensing, and user responsibilities.',
    content: `
      <h1>Terms of Service</h1>
      <p>By using CodersSecret, you agree to our terms. Content is provided for educational purposes. Code examples are MIT-licensed. Read the full terms on the site.</p>
    `,
  },
  {
    slug: 'cookies',
    title: 'Cookie Policy',
    description: 'CodersSecret Cookie Policy — we use minimal cookies for anonymous analytics and theme preference. No advertising, no tracking pixels.',
    content: `
      <h1>Cookie Policy</h1>
      <p>CodersSecret uses minimal cookies for anonymous analytics (Google Analytics) and your theme preference (localStorage). No advertising cookies, no tracking pixels. Read the full cookie policy on the site.</p>
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
