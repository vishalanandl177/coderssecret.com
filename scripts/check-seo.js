/**
 * SEO Checker - Validates SEO essentials, performance hints, and accessibility.
 * Runs as part of pre-commit hook.
 */

const fs = require('fs');
const path = require('path');

const errors = [];
const warnings = [];

function checkIndexHtml() {
  const indexPath = path.join(__dirname, '..', 'src', 'index.html');
  if (!fs.existsSync(indexPath)) {
    errors.push('index.html not found');
    return;
  }

  const content = fs.readFileSync(indexPath, 'utf-8');

  // Required meta tags
  if (!/<title>.+<\/title>/.test(content)) {
    errors.push('index.html: Missing or empty <title> tag');
  }
  if (!/meta\s+name=["']description["']/.test(content)) {
    errors.push('index.html: Missing meta description tag');
  }
  if (!/meta\s+name=["']viewport["']/.test(content)) {
    errors.push('index.html: Missing viewport meta tag');
  }
  if (!/meta\s+charset=/.test(content)) {
    errors.push('index.html: Missing charset meta tag');
  }
  if (!/<html\s+[^>]*lang=/.test(content)) {
    errors.push('index.html: Missing lang attribute on <html> tag');
  }

  // Performance hints
  if (!/rel=["']preconnect["']/.test(content)) {
    warnings.push('index.html: No preconnect links found — consider adding for external domains');
  }

  // PWA
  if (!/rel=["']manifest["']/.test(content)) {
    warnings.push('index.html: Missing manifest link — PWA not configured');
  }
  if (!/apple-mobile-web-app-capable/.test(content)) {
    warnings.push('index.html: Missing apple-mobile-web-app-capable meta tag');
  }

  // Theme color
  if (!/meta\s+name=["']theme-color["']/.test(content)) {
    warnings.push('index.html: Missing theme-color meta tag');
  }

  // Favicon
  if (!/rel=["']icon["']/.test(content)) {
    errors.push('index.html: Missing favicon link');
  }

  // Apple touch icon
  if (!/apple-touch-icon/.test(content)) {
    warnings.push('index.html: Missing apple-touch-icon link');
  }
}

function checkStaticFiles() {
  const publicDir = path.join(__dirname, '..', 'public');

  // robots.txt
  const robotsPath = path.join(publicDir, 'robots.txt');
  if (!fs.existsSync(robotsPath)) {
    errors.push('public/robots.txt not found — search engines need this');
  } else {
    const robots = fs.readFileSync(robotsPath, 'utf-8');
    if (!/Sitemap:/i.test(robots)) {
      warnings.push('robots.txt: Missing Sitemap directive');
    }
  }

  // 404.html for SPA redirect
  if (!fs.existsSync(path.join(publicDir, '404.html'))) {
    errors.push('public/404.html not found — SPA routing will break on GitHub Pages');
  }

  // manifest.json
  if (!fs.existsSync(path.join(publicDir, 'manifest.json'))) {
    warnings.push('public/manifest.json not found — PWA not configured');
  }

  // OG image
  const hasOgImage = fs.existsSync(path.join(publicDir, 'og-image.svg'))
    || fs.existsSync(path.join(publicDir, 'og-image.png'));
  if (!hasOgImage) {
    warnings.push('No OG image found (og-image.svg or og-image.png) — social sharing will lack preview');
  }

  // Sitemap generator
  if (!fs.existsSync(path.join(__dirname, 'generate-sitemap.js'))) {
    errors.push('scripts/generate-sitemap.js not found — sitemap won\'t be generated in CI');
  }
}

function checkSeoService() {
  const seoPath = path.join(__dirname, '..', 'src', 'app', 'services', 'seo.service.ts');
  if (!fs.existsSync(seoPath)) {
    errors.push('seo.service.ts not found — dynamic SEO management missing');
    return;
  }

  const content = fs.readFileSync(seoPath, 'utf-8');

  // Check for required OG tags
  if (!/og:title/.test(content)) errors.push('seo.service.ts: Missing og:title implementation');
  if (!/og:description/.test(content)) errors.push('seo.service.ts: Missing og:description implementation');
  if (!/og:image/.test(content)) errors.push('seo.service.ts: Missing og:image implementation');
  if (!/og:url/.test(content)) errors.push('seo.service.ts: Missing og:url implementation');

  // Twitter cards
  if (!/twitter:card/.test(content)) errors.push('seo.service.ts: Missing twitter:card implementation');
  if (!/twitter:creator/.test(content)) warnings.push('seo.service.ts: Missing twitter:creator tag');

  // OG image dimensions
  if (!/og:image:width/.test(content)) warnings.push('seo.service.ts: Missing og:image:width — social cards may render incorrectly');
  if (!/og:image:height/.test(content)) warnings.push('seo.service.ts: Missing og:image:height');

  // Canonical
  if (!/canonical/.test(content)) errors.push('seo.service.ts: Missing canonical URL implementation');

  // JSON-LD
  if (!/application\/ld\+json/.test(content)) errors.push('seo.service.ts: Missing JSON-LD structured data');
  if (!/BlogPosting/.test(content)) warnings.push('seo.service.ts: Missing BlogPosting schema');
  if (!/Organization/.test(content)) warnings.push('seo.service.ts: Missing Organization schema');
  if (!/BreadcrumbList/.test(content)) warnings.push('seo.service.ts: Missing BreadcrumbList schema');
}

function checkPageComponents() {
  const pagesDir = path.join(__dirname, '..', 'src', 'app', 'pages');
  if (!fs.existsSync(pagesDir)) return;

  const pages = fs.readdirSync(pagesDir);
  for (const page of pages) {
    const pageDir = path.join(pagesDir, page);
    if (!fs.statSync(pageDir).isDirectory()) continue;

    const files = fs.readdirSync(pageDir);
    for (const file of files) {
      if (!file.endsWith('.ts')) continue;
      const filePath = path.join(pageDir, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      const relative = path.relative(path.join(__dirname, '..'), filePath);

      // Check SEO service usage
      if (!/SeoService/.test(content) && !/seo\.update/.test(content)) {
        errors.push(`${relative}: Page component doesn't use SeoService — missing dynamic title/meta`);
      }

      // Check for images without alt
      const imgMatches = content.match(/<img\s[^>]*>/g);
      if (imgMatches) {
        for (const img of imgMatches) {
          if (!/alt=/.test(img)) {
            errors.push(`${relative}: <img> tag missing alt attribute`);
          }
        }
      }

      // Check for time elements without datetime
      const timeMatches = content.match(/<time[^>]*>/g);
      if (timeMatches) {
        for (const time of timeMatches) {
          if (!/datetime/.test(time)) {
            warnings.push(`${relative}: <time> tag missing datetime attribute — bad for structured data`);
          }
        }
      }

      // Check for multiple h1 tags
      const h1Matches = content.match(/<h1[\s>]/g);
      if (h1Matches && h1Matches.length > 1) {
        warnings.push(`${relative}: Multiple <h1> tags found — prefer a single <h1> per page`);
      }

      // Check for empty links
      const emptyLinks = content.match(/<a\s[^>]*>\s*<\/a>/g);
      if (emptyLinks) {
        warnings.push(`${relative}: Found empty <a> tag(s) — bad for SEO and accessibility`);
      }
    }
  }
}

function checkRoutes() {
  const routesPath = path.join(__dirname, '..', 'src', 'app', 'app.routes.ts');
  if (!fs.existsSync(routesPath)) {
    errors.push('app.routes.ts not found');
    return;
  }

  const content = fs.readFileSync(routesPath, 'utf-8');

  // Check for 404 catch-all route
  if (!/path:\s*['"]?\*\*['"]?/.test(content)) {
    errors.push('app.routes.ts: Missing catch-all (**) route — unknown URLs will show blank page');
  }
}

function checkDeployWorkflow() {
  const workflowPath = path.join(__dirname, '..', '.github', 'workflows', 'deploy.yml');
  if (!fs.existsSync(workflowPath)) {
    warnings.push('.github/workflows/deploy.yml not found — no CI/CD configured');
    return;
  }

  const content = fs.readFileSync(workflowPath, 'utf-8');

  if (!/generate-sitemap/.test(content)) {
    warnings.push('deploy.yml: Sitemap generation not included in CI pipeline');
  }
}

// Run all checks
console.log('🔍 Running SEO & quality checks...\n');

checkIndexHtml();
checkStaticFiles();
checkSeoService();
checkPageComponents();
checkRoutes();
checkDeployWorkflow();

// Report
if (warnings.length > 0) {
  console.log(`⚠️  SEO Warnings (${warnings.length}):`);
  warnings.forEach(w => console.log(`   - ${w}`));
  console.log('');
}

if (errors.length > 0) {
  console.log(`❌ SEO Errors (${errors.length}):`);
  errors.forEach(e => console.log(`   - ${e}`));
  console.log(`\n${errors.length} SEO error(s) found. Please fix before committing.\n`);
  process.exit(1);
} else {
  console.log(`✅ SEO checks passed (${warnings.length} warning${warnings.length !== 1 ? 's' : ''}).\n`);
}
