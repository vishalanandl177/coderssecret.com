export const CONTENT = `
      <p>Google uses Core Web Vitals as a ranking factor. A slow site does not just frustrate users &mdash; it literally pushes you down in search results. Yet most developers treat performance as an afterthought, adding a lazy loading directive and calling it done.</p>

      <p>This guide takes you from red Lighthouse scores to green with concrete, measurable optimizations for each Core Web Vital.</p>

      <h2>The Three Core Web Vitals</h2>

      <table>
        <thead>
          <tr>
            <th>Metric</th>
            <th>What It Measures</th>
            <th>Good</th>
            <th>Needs Improvement</th>
            <th>Poor</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>LCP</strong> (Largest Contentful Paint)</td>
            <td>Loading speed &mdash; when the biggest visible element renders</td>
            <td>&le; 2.5s</td>
            <td>2.5s - 4.0s</td>
            <td>&gt; 4.0s</td>
          </tr>
          <tr>
            <td><strong>INP</strong> (Interaction to Next Paint)</td>
            <td>Responsiveness &mdash; delay between user interaction and visual response</td>
            <td>&le; 200ms</td>
            <td>200ms - 500ms</td>
            <td>&gt; 500ms</td>
          </tr>
          <tr>
            <td><strong>CLS</strong> (Cumulative Layout Shift)</td>
            <td>Visual stability &mdash; how much the page layout shifts unexpectedly</td>
            <td>&le; 0.1</td>
            <td>0.1 - 0.25</td>
            <td>&gt; 0.25</td>
          </tr>
        </tbody>
      </table>

      <h2>Fixing LCP: Make the Biggest Element Load Fast</h2>

      <p>LCP measures when the largest visible element (usually a hero image, heading, or video poster) finishes rendering. The most common LCP killers:</p>

      <h3>1. Optimize Images</h3>

      <pre><code>&lt;!-- BEFORE: Unoptimized hero image --&gt;
&lt;img src="hero.png" alt="Hero"&gt;
&lt;!-- 2.4MB PNG, no sizing, blocks rendering --&gt;

&lt;!-- AFTER: Optimized with modern formats --&gt;
&lt;picture&gt;
  &lt;source srcset="hero.avif" type="image/avif"&gt;
  &lt;source srcset="hero.webp" type="image/webp"&gt;
  &lt;img
    src="hero.jpg"
    alt="Hero"
    width="1200"
    height="600"
    loading="eager"
    fetchpriority="high"
    decoding="async"
  &gt;
&lt;/picture&gt;
&lt;!-- 85KB AVIF, explicit dimensions, high priority --&gt;</code></pre>

      <p>Key rules for LCP images:</p>
      <ul>
        <li><strong>Use AVIF/WebP:</strong> 50-90% smaller than PNG/JPEG with equal quality</li>
        <li><strong>Set explicit width/height:</strong> Prevents layout shift and helps the browser allocate space early</li>
        <li><strong>Use fetchpriority="high":</strong> Tells the browser to prioritize this image over others</li>
        <li><strong>Never lazy-load the LCP image:</strong> Use <code>loading="eager"</code> (or omit the attribute) for above-the-fold images</li>
      </ul>

      <h3>2. Preload Critical Resources</h3>

      <pre><code>&lt;!-- In &lt;head&gt;: preload the LCP image --&gt;
&lt;link rel="preload" as="image" href="hero.avif" type="image/avif"&gt;

&lt;!-- Preload critical fonts --&gt;
&lt;link rel="preload" as="font" href="/fonts/inter.woff2"
      type="font/woff2" crossorigin&gt;

&lt;!-- Preconnect to third-party origins --&gt;
&lt;link rel="preconnect" href="https://cdn.example.com"&gt;
&lt;link rel="dns-prefetch" href="https://analytics.example.com"&gt;</code></pre>

      <h3>3. Eliminate Render-Blocking Resources</h3>

      <pre><code>&lt;!-- BEFORE: Render-blocking CSS and JS --&gt;
&lt;link rel="stylesheet" href="all-styles.css"&gt;  &lt;!-- 250KB --&gt;
&lt;script src="analytics.js"&gt;&lt;/script&gt;          &lt;!-- Blocks parsing --&gt;

&lt;!-- AFTER: Critical CSS inline, rest deferred --&gt;
&lt;style&gt;
  /* Only above-the-fold critical CSS (~14KB) */
  .hero { ... }
  .nav { ... }
&lt;/style&gt;
&lt;link rel="stylesheet" href="full-styles.css" media="print"
      onload="this.media='all'"&gt;
&lt;script src="analytics.js" defer&gt;&lt;/script&gt;</code></pre>

      <h2>Fixing INP: Make Interactions Feel Instant</h2>

      <p>INP replaced FID (First Input Delay) in March 2024. It measures the delay for <strong>all</strong> interactions, not just the first one. Common INP killers:</p>

      <h3>1. Break Up Long Tasks</h3>

      <pre><code>// BEFORE: One long task blocks the main thread for 400ms
function processLargeList(items) {
  items.forEach(item => {
    expensiveCalculation(item);  // Blocks UI for entire loop
  });
}

// AFTER: Yield to the browser between chunks
async function processLargeList(items) {
  const CHUNK_SIZE = 50;

  for (let i = 0; i < items.length; i += CHUNK_SIZE) {
    const chunk = items.slice(i, i + CHUNK_SIZE);
    chunk.forEach(item => expensiveCalculation(item));

    // Yield to browser: allow input handling and rendering
    await new Promise(resolve => setTimeout(resolve, 0));
  }
}</code></pre>

      <h3>2. Debounce Expensive Event Handlers</h3>

      <pre><code>// BEFORE: Recalculates on every scroll event (60+ times/second)
window.addEventListener('scroll', () => {
  recalculateLayout();  // 50ms each = constant jank
});

// AFTER: Throttle to once per frame
let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      recalculateLayout();
      ticking = false;
    });
    ticking = true;
  }
});</code></pre>

      <h3>3. Use CSS contain for Complex Layouts</h3>

      <pre><code>/* Tell the browser this element's layout is independent */
.card {
  contain: layout style paint;
  /* Browser skips recalculating this subtree when
     other parts of the page change */
}

/* For virtualized lists: contain size too */
.virtual-list-item {
  contain: strict;
  /* Browser can skip layout entirely for off-screen items */
}</code></pre>

      <h2>Fixing CLS: Stop the Page from Jumping</h2>

      <h3>1. Always Set Image Dimensions</h3>

      <pre><code>&lt;!-- BEFORE: No dimensions = layout shift when image loads --&gt;
&lt;img src="photo.jpg" alt="Photo"&gt;

&lt;!-- AFTER: Browser reserves space before image loads --&gt;
&lt;img src="photo.jpg" alt="Photo" width="800" height="600"&gt;

&lt;!-- Or use CSS aspect-ratio for responsive images --&gt;
&lt;style&gt;
  .responsive-img {
    width: 100%;
    aspect-ratio: 16 / 9;
    object-fit: cover;
  }
&lt;/style&gt;</code></pre>

      <h3>2. Font Loading Strategy</h3>

      <pre><code>/* BEFORE: FOUT (Flash of Unstyled Text) causes layout shift */
@font-face {
  font-family: 'Inter';
  src: url('/fonts/inter.woff2') format('woff2');
  /* Default: font-display: auto (browser decides) */
}

/* AFTER: Swap with size-adjust to minimize shift */
@font-face {
  font-family: 'Inter';
  src: url('/fonts/inter.woff2') format('woff2');
  font-display: swap;
  size-adjust: 107%;           /* Match fallback font metrics */
  ascent-override: 90%;
  descent-override: 22%;
  line-gap-override: 0%;
}</code></pre>

      <h3>3. Reserve Space for Dynamic Content</h3>

      <pre><code>&lt;!-- BEFORE: Ad loads and pushes content down --&gt;
&lt;div id="ad-slot"&gt;&lt;/div&gt;

&lt;!-- AFTER: Pre-allocate space --&gt;
&lt;div id="ad-slot" style="min-height: 250px;"&gt;&lt;/div&gt;

&lt;!-- For skeleton loaders --&gt;
&lt;div class="skeleton" style="height: 200px; background: #e0e0e0;"&gt;
  &lt;!-- Content loads here without shifting layout --&gt;
&lt;/div&gt;</code></pre>

      <h2>Angular-Specific Optimizations</h2>

      <pre><code>// 1. Use OnPush change detection
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  // Reduces unnecessary re-renders by 60-80%
})

// 2. Lazy load routes (already standard)
export const routes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard.component')
  }
];

// 3. Use @defer for below-the-fold components
// In template:
// @defer (on viewport) {
//   &lt;app-heavy-chart /&gt;
// } @placeholder {
//   &lt;div class="skeleton" style="height: 400px"&gt;&lt;/div&gt;
// }

// 4. Use NgOptimizedImage
import { NgOptimizedImage } from '@angular/common';

// &lt;img ngSrc="hero.jpg" width="1200" height="600" priority /&gt;
// Automatically: sets fetchpriority, generates srcset,
// warns about missing dimensions, lazy loads by default</code></pre>

      <h2>Measurement Tools</h2>

      <ul>
        <li><strong>Lighthouse (Chrome DevTools):</strong> Lab data &mdash; synthetic tests on your machine</li>
        <li><strong>PageSpeed Insights:</strong> Combines lab data with real-user data from CrUX</li>
        <li><strong>Web Vitals JS library:</strong> Measure real user metrics in production</li>
        <li><strong>Chrome DevTools Performance tab:</strong> Flame chart showing exactly where time is spent</li>
        <li><strong>Search Console Core Web Vitals report:</strong> Aggregated field data from real users</li>
      </ul>

      <pre><code>// Measure real user Core Web Vitals
import { onLCP, onINP, onCLS } from 'web-vitals';

onLCP(metric => sendToAnalytics('LCP', metric));
onINP(metric => sendToAnalytics('INP', metric));
onCLS(metric => sendToAnalytics('CLS', metric));

function sendToAnalytics(name, metric) {
  fetch('/api/vitals', {
    method: 'POST',
    body: JSON.stringify({
      name,
      value: metric.value,
      rating: metric.rating,  // 'good', 'needs-improvement', 'poor'
      url: location.href,
    }),
    keepalive: true,
  });
}</code></pre>

      <h2>Key Takeaways</h2>

      <ul>
        <li><strong>LCP:</strong> Optimize the hero image (AVIF/WebP, preload, fetchpriority), inline critical CSS, defer everything else</li>
        <li><strong>INP:</strong> Break long tasks into chunks with setTimeout(0), throttle event handlers, use CSS contain</li>
        <li><strong>CLS:</strong> Always set image dimensions, use font-display: swap with size-adjust, reserve space for dynamic content</li>
        <li><strong>Never lazy-load above-the-fold content</strong> &mdash; it makes LCP worse, not better</li>
        <li><strong>Use Angular @defer</strong> for below-the-fold components &mdash; it is built-in code splitting</li>
        <li><strong>Measure real users, not just Lighthouse</strong> &mdash; lab scores and field data often tell different stories</li>
        <li><strong>Performance is a feature</strong> &mdash; every 100ms of delay reduces conversions by 7%</li>
      </ul>

      <p>Web performance is not about chasing a perfect Lighthouse score. It is about ensuring real users on real devices have a fast, stable, responsive experience. Fix the fundamentals in this guide, measure with real-user data, and iterate on what matters most to your users.</p>
    `;
