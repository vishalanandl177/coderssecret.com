/**
 * Auto-generates unique SVG banner images for every blog post.
 * Reads blog-post.model.ts, outputs one SVG per post to public/images/banners/{slug}.svg.
 *
 * Each banner is:
 *  - 1200x480 (optimized for OG / blog hero)
 *  - Category-themed color palette
 *  - Unique pattern seeded from the slug (deterministic — same slug = same banner)
 *  - Title overlaid on top
 *
 * Run: node scripts/generate-banners.js
 */

const fs = require('fs');
const path = require('path');

const MODEL_PATH = path.join(__dirname, '..', 'src', 'app', 'models', 'blog-post.model.ts');
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'images', 'banners');

fs.mkdirSync(OUTPUT_DIR, { recursive: true });

// ── Parse posts from model ──────────────────────
const modelContent = fs.readFileSync(MODEL_PATH, 'utf-8');
const blogPostsStart = modelContent.indexOf('BLOG_POSTS');
const blogSection = modelContent.substring(blogPostsStart);

// Split into post blocks by looking for `{ id: '<n>',`
const postBlocks = blogSection.split(/(?=\{\s*id:\s*')/).slice(1);

const posts = [];
for (const block of postBlocks) {
  const idMatch = block.match(/^\{\s*id:\s*'(\d+)'/);
  const titleMatch = block.match(/title:\s*'((?:[^'\\]|\\.)+)'/);
  const slugMatch = block.match(/slug:\s*'([^']+)'/);
  const categoryMatch = block.match(/category:\s*'([^']+)'/);

  if (idMatch && titleMatch && slugMatch && categoryMatch) {
    posts.push({
      id: idMatch[1],
      title: titleMatch[1].replace(/\\'/g, "'"),
      slug: slugMatch[1],
      category: categoryMatch[1],
    });
  }
}

// ── Category themes ─────────────────────────────
const THEMES = {
  ai: {
    gradFrom: '#0e7490',
    gradMid: '#0891b2',
    gradTo: '#06b6d4',
    accent: '#67e8f9',
    accent2: '#a5f3fc',
    label: 'AI',
    icon: 'brain',
  },
  frontend: {
    gradFrom: '#1e3a8a',
    gradMid: '#1e40af',
    gradTo: '#3730a3',
    accent: '#60a5fa',
    accent2: '#a78bfa',
    label: 'FRONTEND',
    icon: 'monitor',
  },
  backend: {
    gradFrom: '#064e3b',
    gradMid: '#065f46',
    gradTo: '#047857',
    accent: '#34d399',
    accent2: '#6ee7b7',
    label: 'BACKEND',
    icon: 'server',
  },
  devops: {
    gradFrom: '#7c2d12',
    gradMid: '#9a3412',
    gradTo: '#c2410c',
    accent: '#fb923c',
    accent2: '#fdba74',
    label: 'DEVOPS',
    icon: 'layers',
  },
  tutorials: {
    gradFrom: '#581c87',
    gradMid: '#6b21a8',
    gradTo: '#7c3aed',
    accent: '#c084fc',
    accent2: '#e9d5ff',
    label: 'TUTORIAL',
    icon: 'book',
  },
  'open-source': {
    gradFrom: '#831843',
    gradMid: '#9f1239',
    gradTo: '#be185d',
    accent: '#f472b6',
    accent2: '#fbcfe8',
    label: 'OPEN SOURCE',
    icon: 'branch',
  },
};

// ── Deterministic pseudo-random from slug ───────
function hash(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = (h * 16777619) >>> 0;
  }
  return h;
}

function seededRandom(seed) {
  let x = seed;
  return () => {
    x = (x * 1664525 + 1013904223) >>> 0;
    return x / 0x100000000;
  };
}

// ── SVG icons (simplified, stroke-based) ────────
const ICONS = {
  monitor: `<rect x="0" y="0" width="60" height="42" rx="4" fill="none" stroke-width="3"/><line x1="20" y1="50" x2="40" y2="50" stroke-width="3"/><line x1="30" y1="42" x2="30" y2="50" stroke-width="3"/>`,
  server: `<rect x="0" y="0" width="60" height="18" rx="3" fill="none" stroke-width="3"/><rect x="0" y="25" width="60" height="18" rx="3" fill="none" stroke-width="3"/><circle cx="12" cy="9" r="2.5" fill="currentColor"/><circle cx="12" cy="34" r="2.5" fill="currentColor"/>`,
  layers: `<polygon points="30,0 60,15 30,30 0,15" fill="none" stroke-width="3"/><polyline points="0,30 30,45 60,30" fill="none" stroke-width="3"/>`,
  book: `<path d="M0,6 C0,2 4,0 10,0 L30,0 C36,0 40,2 40,6 L40,50 C40,48 36,46 30,46 L10,46 C4,46 0,48 0,50 Z" fill="none" stroke-width="3"/><line x1="40" y1="6" x2="40" y2="50" stroke-width="3"/>`,
  branch: `<circle cx="10" cy="10" r="5" fill="none" stroke-width="3"/><circle cx="10" cy="45" r="5" fill="none" stroke-width="3"/><circle cx="45" cy="28" r="5" fill="none" stroke-width="3"/><path d="M10,15 L10,40" stroke-width="3"/><path d="M10,15 C10,22 25,24 40,26" fill="none" stroke-width="3"/>`,
  brain: `<path d="M20,5 C10,5 5,15 10,25 C5,30 10,42 20,40 C22,48 32,48 34,40 C44,42 49,30 44,25 C49,15 44,5 34,5 C32,-2 22,-2 20,5 Z" fill="none" stroke-width="3"/><path d="M27,10 L27,40" stroke-width="2" opacity="0.6"/><path d="M18,18 L27,22 L36,18" fill="none" stroke-width="2" opacity="0.6"/><path d="M18,28 L27,32 L36,28" fill="none" stroke-width="2" opacity="0.6"/>`,
};

// ── Text wrapping ───────────────────────────────
function wrapText(text, maxCharsPerLine) {
  const words = text.split(' ');
  const lines = [];
  let current = '';
  for (const word of words) {
    if ((current + ' ' + word).trim().length <= maxCharsPerLine) {
      current = (current + ' ' + word).trim();
    } else {
      if (current) lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines.slice(0, 3); // Max 3 lines
}

function escapeXml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

// ── Build SVG ───────────────────────────────────
function makeBanner(post) {
  const theme = THEMES[post.category] || THEMES.tutorials;
  const rand = seededRandom(hash(post.slug));

  // Generate unique decorative elements using seeded random
  const decorations = [];
  const numCircles = 3 + Math.floor(rand() * 3); // 3-5 circles
  for (let i = 0; i < numCircles; i++) {
    decorations.push({
      type: 'circle',
      cx: Math.floor(rand() * 1200),
      cy: Math.floor(rand() * 480),
      r: 40 + Math.floor(rand() * 120),
      opacity: (0.04 + rand() * 0.05).toFixed(3),
      color: rand() > 0.5 ? theme.accent : theme.accent2,
    });
  }

  // Grid offset
  const gridOffset = Math.floor(rand() * 40);
  const angleOffset = Math.floor(rand() * 15);

  // Wrap title to fit
  const titleLines = wrapText(post.title, 28);
  const titleFontSize = titleLines.length === 1 ? 52 : titleLines.length === 2 ? 44 : 36;
  const titleStartY = 210 - (titleLines.length - 1) * (titleFontSize * 0.35);

  // Icon selection
  const icon = ICONS[theme.icon];

  // Build SVG
  const decorationsSvg = decorations.map(d =>
    `<circle cx="${d.cx}" cy="${d.cy}" r="${d.r}" fill="${d.color}" opacity="${d.opacity}"/>`
  ).join('\n    ');

  const titleSvg = titleLines.map((line, i) =>
    `<text x="80" y="${Math.floor(titleStartY + i * titleFontSize * 1.1)}" font-family="system-ui, -apple-system, sans-serif" font-size="${titleFontSize}" font-weight="800" fill="#ffffff">${escapeXml(line)}</text>`
  ).join('\n    ');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 480" fill="none">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${theme.gradFrom}"/>
      <stop offset="50%" style="stop-color:${theme.gradMid}"/>
      <stop offset="100%" style="stop-color:${theme.gradTo}"/>
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:${theme.accent}"/>
      <stop offset="100%" style="stop-color:${theme.accent2}"/>
    </linearGradient>
    <pattern id="grid" x="${gridOffset}" y="${gridOffset}" width="40" height="40" patternUnits="userSpaceOnUse" patternTransform="rotate(${angleOffset})">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#ffffff" stroke-width="0.5" opacity="0.06"/>
    </pattern>
  </defs>

  <!-- Background -->
  <rect width="1200" height="480" fill="url(#bg)"/>
  <rect width="1200" height="480" fill="url(#grid)"/>

  <!-- Decorative circles (seeded from slug) -->
  <g>
    ${decorationsSvg}
  </g>

  <!-- Category badge -->
  <rect x="80" y="90" width="${theme.label.length * 10 + 40}" height="30" rx="15" fill="url(#accent)" opacity="0.2"/>
  <text x="${100}" y="110" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="800" fill="${theme.accent}" letter-spacing="2">${theme.label}</text>

  <!-- Title -->
  ${titleSvg}

  <!-- Bottom brand -->
  <text x="80" y="420" font-family="system-ui, -apple-system, sans-serif" font-size="14" fill="#ffffff" opacity="0.5">coderssecret.com</text>

  <!-- Icon (right side) -->
  <g transform="translate(1020, 200)" stroke="${theme.accent}" opacity="0.9" color="${theme.accent}">
    ${icon}
  </g>

  <!-- Bottom accent bar -->
  <rect y="470" width="1200" height="10" fill="url(#accent)" opacity="0.6"/>
</svg>
`;
}

// ── Generate banners ────────────────────────────
let count = 0;
for (const post of posts) {
  const svg = makeBanner(post);
  const outPath = path.join(OUTPUT_DIR, `${post.slug}.svg`);
  fs.writeFileSync(outPath, svg);
  count++;
}

console.log(`✅ Generated ${count} unique banner SVGs at public/images/banners/`);
console.log(`   Themes: ${Object.keys(THEMES).join(', ')}`);
