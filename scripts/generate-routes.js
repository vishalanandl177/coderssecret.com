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
  ai: 'AI',
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
  <p>Battle-tested tutorials on Python, DevOps, APIs, AI, and system design. Every article can also be watched as a narrated slide presentation — click "Watch as Slides" on any tutorial.</p>
  <ul>
    ${posts.map(p => `<li><a href="/blog/${p.slug}">${escapeHtml(p.title)}</a> — ${escapeHtml(p.excerpt)} · <a href="/slides/${p.slug}">Watch as Slides</a></li>`).join('\n    ')}
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
    ai: 'Guides on AI, LLMs, Claude, MCP servers, prompting, local AI stacks, and building with modern AI tools.',
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
  { slug: '', name: 'Production Engineering Reference Sheets', desc: 'Production-grade reference guides for cloud-native security and infrastructure engineering: Kubernetes Security, kubectl, SPIFFE/SPIRE, OPA/Rego, API security, runtime detection, service mesh, and supply chain.' },
  { slug: 'kubernetes-security', name: 'Kubernetes Security Cheatsheet', desc: 'Production Kubernetes security reference: RBAC audit, PodSecurity standards, NetworkPolicy default-deny, secrets, image signing, runtime forensics. Commands with security warnings and production tips for every entry.' },
  { slug: 'kubernetes', name: 'Kubernetes (kubectl) Cheatsheet', desc: 'Essential kubectl commands: pods, deployments, services, debugging, config, and cluster ops.' },
  { slug: 'docker', name: 'Docker Cheatsheet', desc: 'Docker commands: build, run, compose, volumes, networks, debugging, and cleanup.' },
  { slug: 'git', name: 'Git Cheatsheet', desc: 'Git commands: branch, merge, rebase, stash, reset, log, cherry-pick, and undoing mistakes.' },
  { slug: 'sql', name: 'SQL Cheatsheet', desc: 'SQL reference: SELECT, JOIN, GROUP BY, window functions, CTEs, indexes, and performance.' },
  { slug: 'python', name: 'Python Cheatsheet', desc: 'Essential Python syntax: data types, strings, lists, dicts, functions, classes, file I/O, and more.' },
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

// ── Courses pages (/courses, /courses/<course>, /courses/<course>/<module>, SEO pages) ──
const courseModelPath = path.join(__dirname, '..', 'src', 'app', 'models', 'course.model.ts');
const courseContent = fs.existsSync(courseModelPath) ? fs.readFileSync(courseModelPath, 'utf-8') : '';

if (courseContent) {
  // Course hub page
  const coursesHubDir = path.join(OUTPUT_DIR, 'courses');
  fs.mkdirSync(coursesHubDir, { recursive: true });
  fs.writeFileSync(path.join(coursesHubDir, 'index.html'), makeHtml({
    title: 'Free Engineering Courses — CodersSecret',
    description: 'Production-focused engineering courses, completely free. Learn zero trust security, SPIFFE/SPIRE, Kubernetes identity, and cloud-native architecture with hands-on labs.',
    url: '/courses',
    content: `<h1>Free Engineering Courses</h1>
      <p>Production-focused courses that transform you from tutorial reader to the engineer who secures, scales, and ships real infrastructure.</p>
      <h2>Available Courses</h2>
      <ul><li><a href="/courses/mastering-spiffe-spire">Mastering SPIFFE & SPIRE: Zero Trust for Cloud Native Systems</a> — 13 modules, 30+ labs, 100% free</li></ul>`,
  }));
  created++;

  // Course landing page (mastering-spiffe-spire)
  const courseLandingDir = path.join(OUTPUT_DIR, 'courses', 'mastering-spiffe-spire');
  fs.mkdirSync(courseLandingDir, { recursive: true });
  fs.writeFileSync(path.join(courseLandingDir, 'index.html'), makeHtml({
    title: 'Mastering SPIFFE & SPIRE: Zero Trust for Cloud Native Systems — Free Course',
    description: 'The most comprehensive free course on SPIFFE & SPIRE workload identity. Deploy SPIRE on Kubernetes, configure mTLS with Envoy, enforce OPA policies, federate clusters, and secure AI infrastructure. 13 modules, 30+ hands-on labs, 100% free.',
    url: '/courses/mastering-spiffe-spire',
    content: `<h1>Mastering SPIFFE & SPIRE: Zero Trust for Cloud Native Systems</h1>
      <p>The most comprehensive free course on workload identity, built from real production deployment experience.</p>
      <h2>Curriculum</h2>
      <ol>
        <li><a href="/courses/mastering-spiffe-spire/understanding-zero-trust-security">Understanding Zero Trust Security</a></li>
        <li><a href="/courses/mastering-spiffe-spire/cryptography-pki-foundations">Cryptography and PKI Foundations</a></li>
        <li><a href="/courses/mastering-spiffe-spire/spiffe-fundamentals">SPIFFE Fundamentals</a></li>
        <li><a href="/courses/mastering-spiffe-spire/spire-architecture-components">SPIRE Architecture and Components</a></li>
        <li><a href="/courses/mastering-spiffe-spire/running-spire-on-kubernetes">Running SPIRE on Kubernetes</a></li>
        <li><a href="/courses/mastering-spiffe-spire/working-with-svids-workload-api">Working with SVIDs and the Workload API</a></li>
        <li><a href="/courses/mastering-spiffe-spire/authorization-policy-enforcement">Authorization and Policy Enforcement</a></li>
        <li><a href="/courses/mastering-spiffe-spire/spire-integrations-service-mesh">SPIRE Integrations and Service Mesh</a></li>
        <li><a href="/courses/mastering-spiffe-spire/advanced-spire-architectures">Advanced SPIRE Architectures</a></li>
        <li><a href="/courses/mastering-spiffe-spire/day-two-operations-observability">Day Two Operations and Observability</a></li>
        <li><a href="/courses/mastering-spiffe-spire/spiffe-spire-ecosystem">The SPIFFE/SPIRE Ecosystem</a></li>
        <li><a href="/courses/mastering-spiffe-spire/building-zero-trust-platform">Capstone: Building a Zero Trust Platform</a></li>
        <li><a href="/courses/mastering-spiffe-spire/spiffe-for-ai-infrastructure">Bonus: SPIFFE for AI Infrastructure</a></li>
      </ol>`,
  }));
  created++;

  // Module pages
  const moduleSlugs = [
    { slug: 'understanding-zero-trust-security', title: 'Understanding Zero Trust Security', desc: 'Why perimeter security fails and how identity-based security changes everything. Module 1 of Mastering SPIFFE & SPIRE.' },
    { slug: 'cryptography-pki-foundations', title: 'Cryptography and PKI Foundations', desc: 'The cryptographic building blocks behind SPIFFE: PKI, X.509 certificates, mTLS, and JWT.' },
    { slug: 'spiffe-fundamentals', title: 'SPIFFE Fundamentals', desc: 'The specification that defines workload identity: trust domains, SPIFFE IDs, SVIDs, and the Workload API.' },
    { slug: 'spire-architecture-components', title: 'SPIRE Architecture and Components', desc: 'How SPIRE implements SPIFFE: Server, Agent, node attestation, workload attestation, registration entries.' },
    { slug: 'running-spire-on-kubernetes', title: 'Running SPIRE on Kubernetes', desc: 'Deploy and operate SPIRE in real Kubernetes clusters with auto-rotation and CSI driver integration.' },
    { slug: 'working-with-svids-workload-api', title: 'Working with SVIDs and the Workload API', desc: 'How applications consume SPIFFE identities — SPIFFE Helper, go-spiffe, mTLS, gRPC.' },
    { slug: 'authorization-policy-enforcement', title: 'Authorization and Policy Enforcement', desc: 'Identity answers who. Policy answers what they can do. Open Policy Agent (OPA) with SPIFFE.' },
    { slug: 'spire-integrations-service-mesh', title: 'SPIRE Integrations and Service Mesh', desc: 'Connect SPIRE with Envoy SDS, Istio, OIDC discovery, and the cloud-native ecosystem.' },
    { slug: 'advanced-spire-architectures', title: 'Advanced SPIRE Architectures', desc: 'Production-grade deployments: high availability, nested SPIRE, federation, multi-cluster.' },
    { slug: 'day-two-operations-observability', title: 'Day Two Operations and Observability', desc: 'Monitor SPIRE with Prometheus, debug attestation failures, plan certificate rotation.' },
    { slug: 'spiffe-spire-ecosystem', title: 'The SPIFFE/SPIRE Ecosystem', desc: 'Real-world integrations: HashiCorp Vault, Cilium, CI/CD pipelines, enterprise patterns.' },
    { slug: 'building-zero-trust-platform', title: 'Capstone: Building a Complete Zero Trust Platform', desc: 'Combine SPIRE, Envoy, OPA, and federation into a production-ready zero trust platform.' },
    { slug: 'spiffe-for-ai-infrastructure', title: 'Bonus: SPIFFE for AI Infrastructure', desc: 'Secure AI agents, LLM endpoints, vector databases, and MCP servers with workload identity.' },
  ];
  moduleSlugs.forEach((mod, i) => {
    const moduleDir = path.join(OUTPUT_DIR, 'courses', 'mastering-spiffe-spire', mod.slug);
    fs.mkdirSync(moduleDir, { recursive: true });
    fs.writeFileSync(path.join(moduleDir, 'index.html'), makeHtml({
      title: `Module ${i + 1}: ${mod.title} — Mastering SPIFFE & SPIRE`,
      description: mod.desc,
      url: `/courses/mastering-spiffe-spire/${mod.slug}`,
      content: `<h1>Module ${i + 1}: ${mod.title}</h1><p>${mod.desc}</p><p><a href="/courses/mastering-spiffe-spire">← Back to course curriculum</a></p>`,
    }));
    created++;
  });

  // SEO landing pages
  const seoPages = [
    { slug: 'spiffe-spire', title: 'SPIFFE & SPIRE: The Complete Guide to Workload Identity', desc: 'Everything you need to know about SPIFFE and SPIRE: standards, architecture, deployment, and production patterns.' },
    { slug: 'what-is-spire', title: 'What Is SPIRE? SPIFFE Runtime Environment Explained', desc: 'SPIRE (SPIFFE Runtime Environment) is the production implementation of the SPIFFE specification — a CNCF graduated project for cryptographic workload identity.' },
    { slug: 'workload-identity', title: 'Workload Identity: Why Network Location Is Not Identity', desc: 'Workload identity gives services cryptographic certificates instead of relying on IPs, network policies, or shared secrets.' },
    { slug: 'zero-trust-kubernetes', title: 'Zero Trust for Kubernetes: Moving Beyond Network Policies', desc: 'NetworkPolicies are not zero trust. Learn how SPIFFE/SPIRE delivers true cryptographic identity for every Kubernetes pod.' },
    { slug: 'spire-kubernetes-tutorial', title: 'SPIRE on Kubernetes: Step-by-Step Tutorial', desc: 'Deploy SPIRE on Kubernetes with hands-on examples covering Server, Agent, Controller Manager, and CSI driver.' },
    { slug: 'spiffe-mtls-service-mesh', title: 'SPIFFE, mTLS, and Service Mesh: How They Connect', desc: 'Understand how SPIFFE provides identity, mTLS provides encryption, and service meshes orchestrate them.' },
    { slug: 'machine-identity-management', title: 'Machine Identity Management: SPIFFE vs Vault vs Cloud IAM', desc: 'Compare workload identity approaches for machine identity at scale. SPIFFE vs Vault PKI vs Kubernetes Service Accounts vs Cloud IAM.' },
  ];
  seoPages.forEach(seo => {
    const seoDir = path.join(OUTPUT_DIR, 'courses', seo.slug);
    fs.mkdirSync(seoDir, { recursive: true });
    fs.writeFileSync(path.join(seoDir, 'index.html'), makeHtml({
      title: `${seo.title} — CodersSecret`,
      description: seo.desc,
      url: `/courses/${seo.slug}`,
      content: `<h1>${seo.title}</h1><p>${seo.desc}</p><p>Start the free <a href="/courses/mastering-spiffe-spire">Mastering SPIFFE & SPIRE</a> course to learn this hands-on.</p>`,
    }));
    created++;
  });

  // ── Cloud Native Security Engineering course ──
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

// ── Slides pages (/slides/{slug}) — pre-render for every blog post ──
for (const post of posts) {
  const slideDir = path.join(OUTPUT_DIR, 'slides', post.slug);
  fs.mkdirSync(slideDir, { recursive: true });
  fs.writeFileSync(path.join(slideDir, 'index.html'), makeHtml({
    title: `${escapeHtml(post.title)} — Watch as Slides | CodersSecret`,
    description: `Watch "${escapeHtml(post.title)}" as narrated slides with voice narration. 20x lighter than video, zero ads, fully free.`,
    url: `/slides/${post.slug}`,
    content: `<h1>${escapeHtml(post.title)} — Slides</h1><p>Watch this tutorial as narrated slides with voice narration.</p><p><a href="/blog/${post.slug}">Read the full article</a></p>`,
  }));
  created++;
}

// ── /home/ redirect (Google sometimes discovers /home/ instead of /) ──
const homeDir = path.join(OUTPUT_DIR, 'home');
fs.mkdirSync(homeDir, { recursive: true });
fs.writeFileSync(path.join(homeDir, 'index.html'), `<!doctype html>
<html lang="en"><head>
<meta charset="UTF-8">
<meta http-equiv="refresh" content="0;url=/">
<link rel="canonical" href="https://coderssecret.com/">
<title>Redirecting to CodersSecret</title>
</head><body><p>Redirecting to <a href="/">home page</a>...</p></body></html>`);
created++;

  // ── Production RAG Systems Engineering course ──
  const ragDir = path.join(OUTPUT_DIR, 'courses', 'production-rag-systems-engineering');
  fs.mkdirSync(ragDir, { recursive: true });
  fs.writeFileSync(path.join(ragDir, 'index.html'), makeHtml({
    title: 'Production-Grade RAG Systems Engineering — Free Course',
    description: 'Build scalable, reliable RAG systems. Embeddings, vector databases, hybrid retrieval, reranking, AI agents, evaluation, security, and Kubernetes deployment. 16 modules, 50+ labs, free.',
    url: '/courses/production-rag-systems-engineering',
    content: '<h1>Production-Grade RAG Systems Engineering</h1><p>16 modules, 50+ hands-on labs, completely free.</p>',
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

// ── Glossary pages ──
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
const glossaryHubDir = path.join(OUTPUT_DIR, 'glossary');
fs.mkdirSync(glossaryHubDir, { recursive: true });
fs.writeFileSync(path.join(glossaryHubDir, 'index.html'), makeHtml({
  title: 'Cloud Native Security Glossary — CodersSecret',
  description: 'Definitions for SPIFFE, SPIRE, Zero Trust, workload identity, mTLS, OPA, Falco, and more cloud-native security terms.',
  url: '/glossary',
  content: '<h1>Cloud Native Security Glossary</h1><ul>' + glossaryTerms.map(t => `<li><a href="/glossary/${t.slug}">${t.term}</a>: ${t.desc}</li>`).join('') + '</ul>',
}));
created++;
glossaryTerms.forEach(t => {
  const termDir = path.join(OUTPUT_DIR, 'glossary', t.slug);
  fs.mkdirSync(termDir, { recursive: true });
  fs.writeFileSync(path.join(termDir, 'index.html'), makeHtml({
    title: `What is ${t.term}? — CodersSecret Glossary`,
    description: t.desc,
    url: `/glossary/${t.slug}`,
    content: `<h1>What is ${t.term}?</h1><p>${t.desc}</p><p><a href="/glossary">← All glossary terms</a></p>`,
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

// ── Generate 404.html — FULL Angular app with noindex ──
// GitHub Pages serves this for any path without a pre-rendered index.html.
// Angular Router then takes over and shows the correct page (SPA routing).
// This prevents "Redirect error" from Google because the page actually renders.
let notFoundHtml = baseHtml;
// Add noindex so Google ignores the 404 fallback
notFoundHtml = notFoundHtml.replace('</head>', '  <meta name="robots" content="noindex">\n</head>');
// Inject fallback content inside app-root for pre-JS rendering
notFoundHtml = notFoundHtml.replace(
  '<app-root></app-root>',
  `<app-root>
    <h1>Page Not Found</h1>
    <p>The page you are looking for does not exist or has been moved.</p>
    <p><a href="/">Go to Home</a> | <a href="/blog">Browse Blog</a></p>
  </app-root>`
);
fs.writeFileSync(path.join(OUTPUT_DIR, '404.html'), notFoundHtml);


console.log(`✅ Pre-rendered ${created} route files + 404.html with SEO content.`);
console.log(`   Blog posts: ${posts.length}`);
console.log(`   Categories: ${categories.size}`);
console.log(`   Blog list: 1`);
console.log(`   404.html: Angular app with noindex (no redirect!)`);
console.log(`   Each page has: unique <title>, meta description, OG tags, canonical URL, and real HTML content.`);
