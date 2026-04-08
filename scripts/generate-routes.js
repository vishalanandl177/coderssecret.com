/**
 * Generates static route files for GitHub Pages SPA routing.
 *
 * Problem: GitHub Pages returns 404 for SPA routes like /blog/my-post
 * because no physical file exists at that path. Google crawler sees 404
 * and refuses to index the page.
 *
 * Solution: For every route (blog posts, categories, /blog), create a
 * directory with an index.html that's a copy of the main index.html.
 * GitHub Pages serves directory/index.html automatically with 200 OK.
 * Angular's router then bootstraps and renders the correct content.
 *
 * Run after build: node scripts/generate-routes.js
 */

const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, '..', 'dist', 'coderssecret-app', 'browser');

// Read the blog post model to extract slugs and categories
const modelPath = path.join(__dirname, '..', 'src', 'app', 'models', 'blog-post.model.ts');
const modelContent = fs.readFileSync(modelPath, 'utf-8');

const slugRegex = /slug:\s*'([^']+)'/g;
const categoryRegex = /category:\s*'([^']+)'/g;

const slugs = [];
const categories = new Set();
let match;

while ((match = slugRegex.exec(modelContent)) !== null) {
  slugs.push(match[1]);
}
while ((match = categoryRegex.exec(modelContent)) !== null) {
  categories.add(match[1]);
}

// Read the built index.html
const indexHtml = fs.readFileSync(path.join(OUTPUT_DIR, 'index.html'), 'utf-8');

// Collect all routes that need static files
const routes = [
  'blog',
  ...slugs.map(slug => `blog/${slug}`),
  ...Array.from(categories).map(cat => `category/${cat}`),
];

let created = 0;

for (const route of routes) {
  const dir = path.join(OUTPUT_DIR, route);
  const filePath = path.join(dir, 'index.html');

  // Skip if file already exists (from a previous build or Angular prerender)
  if (fs.existsSync(filePath)) continue;

  // Create directory and write index.html
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, indexHtml);
  created++;
}

console.log(`✅ Generated ${created} route files (${routes.length} total routes).`);
console.log(`   Blog posts: ${slugs.length}`);
console.log(`   Categories: ${categories.size}`);
console.log(`   Static pages: 1 (/blog)`);
console.log(`   Google will now see 200 OK for all routes instead of 404!`);
