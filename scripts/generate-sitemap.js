/**
 * Generates sitemap.xml from blog post data.
 * Run after build: node scripts/generate-sitemap.js
 */

const fs = require('fs');
const path = require('path');

const SITE_URL = 'https://coderssecret.com';
const OUTPUT_DIR = path.join(__dirname, '..', 'dist', 'coderssecret-app', 'browser');
const SUPPORTED_LOCALES = ['en', 'es'];

function hreflangLinks(path) {
  return SUPPORTED_LOCALES.map(locale => {
    const href = locale === 'en' ? `${SITE_URL}${path}` : `${SITE_URL}/${locale}${path}`;
    return `    <xhtml:link rel="alternate" hreflang="${locale}" href="${href}"/>`;
  }).concat([
    `    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}${path}"/>`
  ]).join('\n');
}

// Read the blog post model to extract slugs and dates
const modelPath = path.join(__dirname, '..', 'src', 'app', 'models', 'blog-post.model.ts');
const modelContent = fs.readFileSync(modelPath, 'utf-8');

// Extract slugs and dates from the model
const slugRegex = /slug:\s*'([^']+)'/g;
const dateRegex = /date:\s*'([^']+)'/g;
const categoryRegex = /category:\s*'([^']+)'/g;

const slugs = [];
const dates = [];
const categories = new Set();
let match;

// Extract categories first
while ((match = categoryRegex.exec(modelContent)) !== null) {
  categories.add(match[1]);
}

// Extract blog post slugs — only after BLOG_POSTS starts
const blogPostsStart = modelContent.indexOf('BLOG_POSTS');
const blogSection = blogPostsStart > 0 ? modelContent.substring(blogPostsStart) : modelContent;
const blogSlugRegex = /slug:\s*'([^']+)'/g;
while ((match = blogSlugRegex.exec(blogSection)) !== null) {
  const s = match[1];
  // Skip category slugs that get matched
  if (s && !categories.has(s)) {
    slugs.push(s);
  }
}
while ((match = dateRegex.exec(blogSection)) !== null) {
  dates.push(match[1]);
}

const today = new Date().toISOString().split('T')[0];

let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>${SITE_URL}/</loc>
${hreflangLinks('/')}
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${SITE_URL}/blog</loc>
${hreflangLinks('/blog')}
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${SITE_URL}/about</loc>
${hreflangLinks('/about')}
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>${SITE_URL}/games</loc>
${hreflangLinks('/games')}
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${SITE_URL}/games/guess-output</loc>
${hreflangLinks('/games/guess-output')}
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>${SITE_URL}/games/spot-the-bug</loc>
${hreflangLinks('/games/spot-the-bug')}
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>${SITE_URL}/games/devops-scenario</loc>
${hreflangLinks('/games/devops-scenario')}
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>${SITE_URL}/games/typing-test</loc>
${hreflangLinks('/games/typing-test')}
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>${SITE_URL}/games/salary-calculator</loc>
${hreflangLinks('/games/salary-calculator')}
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>${SITE_URL}/games/linux-challenge</loc>
${hreflangLinks('/games/linux-challenge')}
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>${SITE_URL}/cheatsheets</loc>
${hreflangLinks('/cheatsheets')}
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${SITE_URL}/cheatsheets/python</loc>
${hreflangLinks('/cheatsheets/python')}
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${SITE_URL}/cheatsheets/kubernetes</loc>
${hreflangLinks('/cheatsheets/kubernetes')}
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${SITE_URL}/cheatsheets/git</loc>
${hreflangLinks('/cheatsheets/git')}
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${SITE_URL}/cheatsheets/docker</loc>
${hreflangLinks('/cheatsheets/docker')}
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${SITE_URL}/cheatsheets/sql</loc>
${hreflangLinks('/cheatsheets/sql')}
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${SITE_URL}/privacy</loc>
${hreflangLinks('/privacy')}
    <lastmod>${today}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>
  <url>
    <loc>${SITE_URL}/terms</loc>
${hreflangLinks('/terms')}
    <lastmod>${today}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>
  <url>
    <loc>${SITE_URL}/cookies</loc>
${hreflangLinks('/cookies')}
    <lastmod>${today}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>
`;

// Category pages
for (const cat of categories) {
  xml += `  <url>
    <loc>${SITE_URL}/category/${cat}</loc>
${hreflangLinks('/category/' + cat)}
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
`;
}

// Blog post pages
for (let i = 0; i < slugs.length; i++) {
  const date = dates[i] || today;
  xml += `  <url>
    <loc>${SITE_URL}/blog/${slugs[i]}</loc>
${hreflangLinks('/blog/' + slugs[i])}
    <lastmod>${date}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
`;
}

xml += `</urlset>
`;

// Sitemap index (so both /sitemap.xml and /sitemap_index.xml work)
const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${SITE_URL}/sitemap.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
</sitemapindex>
`;

// Write to build output
if (fs.existsSync(OUTPUT_DIR)) {
  fs.writeFileSync(path.join(OUTPUT_DIR, 'sitemap.xml'), xml);
  fs.writeFileSync(path.join(OUTPUT_DIR, 'sitemap_index.xml'), sitemapIndex);
  console.log(`✅ Sitemap generated with ${slugs.length} blog posts and ${categories.size} categories.`);
} else {
  console.error('❌ Build output directory not found. Run ng build first.');
  process.exit(1);
}
