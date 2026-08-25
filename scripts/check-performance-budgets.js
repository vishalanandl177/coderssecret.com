/**
 * Deterministic production bundle budgets for CodersSecret.
 *
 * Run after an Angular production build with `--stats-json`. The Angular
 * budgets protect raw bundle size; this check also measures Brotli output and
 * guards against another monolithic lazy data chunk.
 */

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const ROOT = path.join(__dirname, '..');
const DIST_DIR = path.join(ROOT, 'dist', 'coderssecret-app');
const BROWSER_DIR = path.join(DIST_DIR, 'browser');
const STATS_PATH = path.join(DIST_DIR, 'stats.json');

const KB = 1000;
const BUDGETS = {
  // Leave a small cross-runtime margin: CI uses Node 22 while local work may
  // use a newer Brotli implementation. These limits still sit well below the
  // pre-optimization baseline (726 kB initial and 40.6 kB Brotli CSS).
  initialRaw: 610 * KB,
  initialBrotli: 120 * KB,
  globalCssBrotli: 32 * KB,
  largestScriptRaw: 310 * KB,
  largestScriptBrotli: 80 * KB,
  responsiveImagesRaw: 450 * KB,
};

const RESPONSIVE_IMAGE_BASES = [
  '01-admin-dashboard',
  '02-api-logs-list',
  '03-api-log-detail-slow-sql',
  '04-api-log-detail-login-masked',
  '05-api-log-detail-n-plus-one',
];

function fail(message) {
  console.error(`❌ ${message}`);
  process.exitCode = 1;
}

function formatKB(bytes) {
  return `${(bytes / KB).toFixed(2)} kB`;
}

function brotliSize(outputPath) {
  const absolutePath = path.join(BROWSER_DIR, outputPath);
  if (!fs.existsSync(absolutePath)) {
    fail(`Bundle output is missing: ${outputPath}`);
    return 0;
  }
  return zlib.brotliCompressSync(fs.readFileSync(absolutePath)).length;
}

if (!fs.existsSync(STATS_PATH)) {
  fail('dist/coderssecret-app/stats.json is missing. Build with --stats-json first.');
  process.exit(process.exitCode || 1);
}

const stats = JSON.parse(fs.readFileSync(STATS_PATH, 'utf8'));
const outputs = stats.outputs || {};
const initialOutputs = new Set();
const queue = [];

for (const [outputPath, output] of Object.entries(outputs)) {
  if (output.entryPoint === 'src/main.ts' || output.entryPoint === 'angular:styles/global:styles') {
    initialOutputs.add(outputPath);
    queue.push(outputPath);
  }
}

while (queue.length > 0) {
  const outputPath = queue.shift();
  for (const imported of outputs[outputPath]?.imports || []) {
    if (imported.external || imported.kind === 'dynamic-import' || !outputs[imported.path]) continue;
    if (!initialOutputs.has(imported.path)) {
      initialOutputs.add(imported.path);
      queue.push(imported.path);
    }
  }
}

if (initialOutputs.size === 0) {
  fail('Could not identify initial application outputs in stats.json.');
}

const initialRaw = [...initialOutputs]
  .reduce((total, outputPath) => total + (outputs[outputPath]?.bytes || 0), 0);
const initialBrotli = [...initialOutputs]
  .reduce((total, outputPath) => total + brotliSize(outputPath), 0);

const globalCssEntry = Object.entries(outputs)
  .find(([, output]) => output.entryPoint === 'angular:styles/global:styles');
const globalCssBrotli = globalCssEntry ? brotliSize(globalCssEntry[0]) : 0;

const scripts = Object.entries(outputs)
  .filter(([outputPath]) => outputPath.endsWith('.js'))
  .map(([outputPath, output]) => ({
    outputPath,
    raw: output.bytes || 0,
    brotli: brotliSize(outputPath),
  }))
  .sort((left, right) => right.raw - left.raw);
const largestScript = scripts[0] || { outputPath: 'none', raw: 0, brotli: 0 };

let responsiveImagesRaw = 0;
for (const baseName of RESPONSIVE_IMAGE_BASES) {
  const fallbackPath = path.join(BROWSER_DIR, 'images', 'drf-api-logger', `${baseName}.png`);
  if (!fs.existsSync(fallbackPath)) {
    fail(`Responsive image fallback is missing: ${baseName}.png`);
    continue;
  }

  const fallbackSize = fs.statSync(fallbackPath).size;
  for (const width of [960, 1440]) {
    const variantName = `${baseName}-${width}.webp`;
    const variantPath = path.join(BROWSER_DIR, 'images', 'drf-api-logger', variantName);
    if (!fs.existsSync(variantPath)) {
      fail(`Responsive image variant is missing: ${variantName}`);
      continue;
    }

    const contents = fs.readFileSync(variantPath);
    const isWebp = contents.length >= 12
      && contents.subarray(0, 4).toString('ascii') === 'RIFF'
      && contents.subarray(8, 12).toString('ascii') === 'WEBP';
    if (!isWebp) {
      fail(`Responsive image variant is invalid or empty: ${variantName}`);
      continue;
    }
    if (contents.length >= fallbackSize) {
      fail(`Responsive image variant is not smaller than its PNG fallback: ${variantName}`);
    }
    responsiveImagesRaw += contents.length;
  }
}

console.log('Production performance budgets');
console.log(`  Initial raw:          ${formatKB(initialRaw)} / ${formatKB(BUDGETS.initialRaw)}`);
console.log(`  Initial Brotli:       ${formatKB(initialBrotli)} / ${formatKB(BUDGETS.initialBrotli)}`);
console.log(`  Global CSS Brotli:    ${formatKB(globalCssBrotli)} / ${formatKB(BUDGETS.globalCssBrotli)}`);
console.log(`  Largest script raw:   ${formatKB(largestScript.raw)} / ${formatKB(BUDGETS.largestScriptRaw)} (${largestScript.outputPath})`);
console.log(`  Largest script Brotli:${formatKB(largestScript.brotli)} / ${formatKB(BUDGETS.largestScriptBrotli)}`);
console.log(`  Responsive images:    ${formatKB(responsiveImagesRaw)} / ${formatKB(BUDGETS.responsiveImagesRaw)}`);

if (initialRaw > BUDGETS.initialRaw) {
  fail(`Initial raw output exceeds its budget by ${formatKB(initialRaw - BUDGETS.initialRaw)}.`);
}
if (initialBrotli > BUDGETS.initialBrotli) {
  fail(`Initial Brotli output exceeds its budget by ${formatKB(initialBrotli - BUDGETS.initialBrotli)}.`);
}
if (globalCssBrotli > BUDGETS.globalCssBrotli) {
  fail(`Global CSS Brotli output exceeds its budget by ${formatKB(globalCssBrotli - BUDGETS.globalCssBrotli)}.`);
}
if (largestScript.raw > BUDGETS.largestScriptRaw) {
  fail(`Largest script exceeds its raw budget by ${formatKB(largestScript.raw - BUDGETS.largestScriptRaw)}.`);
}
if (largestScript.brotli > BUDGETS.largestScriptBrotli) {
  fail(`Largest script exceeds its Brotli budget by ${formatKB(largestScript.brotli - BUDGETS.largestScriptBrotli)}.`);
}
if (responsiveImagesRaw > BUDGETS.responsiveImagesRaw) {
  fail(`Responsive images exceed their raw budget by ${formatKB(responsiveImagesRaw - BUDGETS.responsiveImagesRaw)}.`);
}

if (process.exitCode) process.exit(process.exitCode);
console.log('✅ Production performance budgets passed.');
