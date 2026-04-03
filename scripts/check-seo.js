/**
 * SEO Checker - Validates SEO essentials in the Angular project.
 * Checks: meta tags, title, description, semantic HTML, image alts, canonical links.
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

  // Title tag
  if (!/<title>.+<\/title>/.test(content)) {
    errors.push('index.html: Missing or empty <title> tag');
  }

  // Meta description
  if (!/meta\s+name=["']description["']/.test(content)) {
    errors.push('index.html: Missing meta description tag');
  }

  // Viewport meta
  if (!/meta\s+name=["']viewport["']/.test(content)) {
    errors.push('index.html: Missing viewport meta tag');
  }

  // Charset
  if (!/meta\s+charset=/.test(content)) {
    warnings.push('index.html: Missing charset meta tag');
  }

  // Language attribute
  if (!/<html\s+[^>]*lang=/.test(content)) {
    errors.push('index.html: Missing lang attribute on <html> tag');
  }
}

function checkComponentTemplates() {
  const srcDir = path.join(__dirname, '..', 'src', 'app');

  function walkDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      if (stat.isDirectory()) {
        walkDir(filePath);
      } else if (file.endsWith('.ts') || file.endsWith('.html')) {
        checkFile(filePath);
      }
    }
  }

  function checkFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const relative = path.relative(path.join(__dirname, '..'), filePath);

    // Check for images without alt attributes
    const imgMatches = content.match(/<img\s[^>]*>/g);
    if (imgMatches) {
      for (const img of imgMatches) {
        if (!/alt=/.test(img)) {
          errors.push(`${relative}: <img> tag missing alt attribute`);
        }
      }
    }

    // Check for anchor tags without meaningful content
    const emptyLinks = content.match(/<a\s[^>]*>\s*<\/a>/g);
    if (emptyLinks) {
      warnings.push(`${relative}: Found empty <a> tag(s) — bad for SEO`);
    }

    // Check for multiple h1 tags in a single template
    const h1Matches = content.match(/<h1[\s>]/g);
    if (h1Matches && h1Matches.length > 1) {
      warnings.push(`${relative}: Multiple <h1> tags found — prefer a single <h1> per page`);
    }
  }

  if (fs.existsSync(srcDir)) {
    walkDir(srcDir);
  }
}

// Run checks
console.log('🔍 Running SEO checks...\n');

checkIndexHtml();
checkComponentTemplates();

// Report
if (warnings.length > 0) {
  console.log('⚠️  SEO Warnings:');
  warnings.forEach(w => console.log(`   - ${w}`));
  console.log('');
}

if (errors.length > 0) {
  console.log('❌ SEO Errors:');
  errors.forEach(e => console.log(`   - ${e}`));
  console.log(`\n${errors.length} SEO error(s) found. Please fix before committing.\n`);
  process.exit(1);
} else {
  console.log('✅ SEO checks passed.\n');
}
