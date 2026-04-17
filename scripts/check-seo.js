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
  if (!/['"]ItemList['"]/.test(content)) errors.push('seo.service.ts: Missing ItemList schema for blog list / category pages (required for collection SEO)');
  if (!/['"]CollectionPage['"]/.test(content)) warnings.push('seo.service.ts: Missing CollectionPage schema (pairs with ItemList)');
  if (!/SearchAction/.test(content)) warnings.push('seo.service.ts: Missing SearchAction schema — site search box in Google disabled');

  // Article metadata
  if (!/article:section/.test(content)) warnings.push('seo.service.ts: Missing article:section OG tag');
  if (!/article:author/.test(content)) warnings.push('seo.service.ts: Missing article:author OG tag');
  if (!/article:published_time/.test(content)) warnings.push('seo.service.ts: Missing article:published_time OG tag');
}

function checkEEATSignals() {
  // E-E-A-T: Experience, Expertise, Authoritativeness, Trustworthiness
  // Google heavily favors content with clear authorship

  const aboutPath = path.join(__dirname, '..', 'src', 'app', 'pages', 'about', 'about.ts');
  if (!fs.existsSync(aboutPath)) {
    errors.push('Missing /about page — required for E-E-A-T signals (author credibility)');
  }

  // Check footer for legal pages (trust signals)
  const footerPath = path.join(__dirname, '..', 'src', 'app', 'components', 'footer', 'footer.ts');
  if (fs.existsSync(footerPath)) {
    const footer = fs.readFileSync(footerPath, 'utf-8');
    if (!/\/privacy/.test(footer)) warnings.push('footer: Missing link to /privacy — trust signal for Google');
    if (!/\/terms/.test(footer)) warnings.push('footer: Missing link to /terms — trust signal for Google');
  }

  // Check legal pages exist
  const legalPages = ['privacy', 'terms', 'cookies'];
  const pagesDir = path.join(__dirname, '..', 'src', 'app', 'pages');
  for (const page of legalPages) {
    if (!fs.existsSync(path.join(pagesDir, page))) {
      warnings.push(`Missing /${page} page — expected legal/trust page`);
    }
  }
}

function checkContentQuality() {
  // Validates pre-rendered content has real SEO value, not just empty shell
  const genRoutesPath = path.join(__dirname, '..', 'scripts', 'generate-routes.js');
  if (!fs.existsSync(genRoutesPath)) {
    errors.push('scripts/generate-routes.js not found — pre-rendering disabled, Google sees empty <app-root>');
    return;
  }

  const content = fs.readFileSync(genRoutesPath, 'utf-8');

  // Check for enriched pre-rendered content (not just title + excerpt)
  if (!/Breadcrumb/.test(content)) {
    warnings.push('generate-routes.js: Pre-rendered pages missing breadcrumb nav — weaker SEO signal');
  }
  if (!/Related Articles|relatedPosts|related/.test(content)) {
    warnings.push('generate-routes.js: Pre-rendered pages missing related post links — internal linking weaker');
  }
  if (!/tag=/.test(content)) {
    warnings.push('generate-routes.js: Pre-rendered pages missing tag links — no topic clustering');
  }
  if (!/canonical/.test(content)) {
    errors.push('generate-routes.js: Pre-rendered pages missing canonical URLs — duplicate content risk');
  }
}

function checkKeywordTargeting() {
  // Validates meta descriptions and titles avoid generic phrasing
  const pagesDir = path.join(__dirname, '..', 'src', 'app', 'pages');
  if (!fs.existsSync(pagesDir)) return;

  const pages = ['blog-list', 'home'];
  for (const page of pages) {
    const pageDir = path.join(pagesDir, page);
    if (!fs.existsSync(pageDir)) continue;

    const files = fs.readdirSync(pageDir).filter(f => f.endsWith('.ts'));
    for (const file of files) {
      const filePath = path.join(pageDir, file);
      const content = fs.readFileSync(filePath, 'utf-8');

      // Extract description from seo.update calls
      const descMatch = content.match(/description:\s*['"`]([^'"`]+)['"`]/);
      if (descMatch) {
        const desc = descMatch[1];
        if (desc.length < 80) {
          warnings.push(`${page}/${file}: Meta description too short (${desc.length} chars) — aim for 120-160 chars`);
        }
        if (desc.length > 200) {
          warnings.push(`${page}/${file}: Meta description too long (${desc.length} chars) — Google truncates after 160`);
        }
        // Check for weak/generic phrases
        const weakPatterns = [
          /browse all articles on .{1,30}$/i,
          /^welcome to/i,
          /lorem ipsum/i,
        ];
        for (const pattern of weakPatterns) {
          if (pattern.test(desc)) {
            warnings.push(`${page}/${file}: Meta description is generic — add specific keywords`);
            break;
          }
        }
      }
    }
  }
}

function checkBlogPostQuality() {
  // Validate blog post model: all posts have required SEO fields
  const modelPath = path.join(__dirname, '..', 'src', 'app', 'models', 'blog-post.model.ts');
  if (!fs.existsSync(modelPath)) return;

  const content = fs.readFileSync(modelPath, 'utf-8');

  // Count posts
  const postCount = (content.match(/^\s{2}{\s*\n\s*id:\s*'/gm) || []).length;

  // Check for required fields pattern
  const missingExcerpts = (content.match(/excerpt:\s*''/g) || []).length;
  if (missingExcerpts > 0) {
    errors.push(`blog-post.model.ts: ${missingExcerpts} posts with empty excerpts — meta description will be missing`);
  }

  const missingTags = (content.match(/tags:\s*\[\s*\]/g) || []).length;
  if (missingTags > 0) {
    warnings.push(`blog-post.model.ts: ${missingTags} posts with empty tags — no topic clustering for these`);
  }

  // Check for short excerpts (bad for meta description)
  const excerpts = [...content.matchAll(/excerpt:\s*'([^']{1,})'/g)];
  let shortCount = 0;
  for (const m of excerpts) {
    if (m[1].length < 80) shortCount++;
  }
  if (shortCount > 0) {
    warnings.push(`blog-post.model.ts: ${shortCount} posts have short excerpts (<80 chars) — weak meta descriptions`);
  }
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
checkEEATSignals();
checkContentQuality();
checkKeywordTargeting();
checkBlogPostQuality();

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
