/**
 * Generates sitemap.xml from blog post data.
 * Run after build: node scripts/generate-sitemap.js
 */

const fs = require('fs');
const path = require('path');

const SITE_URL = 'https://coderssecret.com';
const OUTPUT_DIR = path.join(__dirname, '..', 'dist', 'coderssecret-app', 'browser');

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

while ((match = slugRegex.exec(modelContent)) !== null) {
  slugs.push(match[1]);
}
while ((match = dateRegex.exec(modelContent)) !== null) {
  dates.push(match[1]);
}
while ((match = categoryRegex.exec(modelContent)) !== null) {
  categories.add(match[1]);
}

const today = new Date().toISOString().split('T')[0];

let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${SITE_URL}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${SITE_URL}/blog</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${SITE_URL}/about</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>${SITE_URL}/games</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${SITE_URL}/games/guess-output</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>${SITE_URL}/games/spot-the-bug</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>${SITE_URL}/games/devops-scenario</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>${SITE_URL}/games/typing-test</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>${SITE_URL}/games/salary-calculator</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>${SITE_URL}/games/linux-challenge</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>${SITE_URL}/cheatsheets</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${SITE_URL}/cheatsheets/python</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${SITE_URL}/cheatsheets/kubernetes</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${SITE_URL}/cheatsheets/git</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${SITE_URL}/cheatsheets/docker</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${SITE_URL}/cheatsheets/sql</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${SITE_URL}/privacy</loc>
    <lastmod>${today}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>
  <url>
    <loc>${SITE_URL}/terms</loc>
    <lastmod>${today}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>
  <url>
    <loc>${SITE_URL}/cookies</loc>
    <lastmod>${today}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>
`;

// Category pages
for (const cat of categories) {
  xml += `  <url>
    <loc>${SITE_URL}/category/${cat}</loc>
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
