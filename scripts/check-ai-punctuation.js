/**
 * Fails when em-dash punctuation appears in source or generated site output.
 *
 * The generated HTML check matters because HTML entities can render as the
 * same character even when the source file does not contain it directly.
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const SKIP_DIRS = new Set([
  '.angular',
  '.git',
  'coverage',
  'generated-audio',
  'node_modules',
  'out',
]);

const TEXT_EXTENSIONS = new Set([
  '.css',
  '.html',
  '.js',
  '.json',
  '.md',
  '.ps1',
  '.svg',
  '.toml',
  '.ts',
  '.txt',
  '.xml',
  '.yaml',
  '.yml',
]);

const CHECKS = [
  { label: 'em dash', value: String.fromCharCode(0x2014) },
  { label: 'mojibake em dash', value: String.fromCharCode(0x00e2, 0x20ac, 0x201d) },
  { label: 'HTML em dash entity', value: '&' + 'mdash;' },
  { label: 'numeric em dash entity', value: '&' + '#8212;' },
  { label: 'hex em dash entity', value: '&' + '#x2014;' },
  { label: 'uppercase hex em dash entity', value: '&' + '#X2014;' },
];

const MAX_REPORTS = 200;
const findings = [];

function shouldSkip(filePath) {
  const relative = path.relative(ROOT_DIR, filePath);
  return relative.split(path.sep).some(part => SKIP_DIRS.has(part));
}

function isTextFile(filePath) {
  return TEXT_EXTENSIONS.has(path.extname(filePath).toLowerCase());
}

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const filePath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (!shouldSkip(filePath)) {
        walk(filePath);
      }
      continue;
    }

    if (!entry.isFile() || shouldSkip(filePath) || !isTextFile(filePath)) {
      continue;
    }

    checkFile(filePath);
  }
}

function checkFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split(/\r?\n/);

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
    const line = lines[lineIndex];
    for (const check of CHECKS) {
      let searchFrom = 0;
      while (true) {
        const columnIndex = line.indexOf(check.value, searchFrom);
        if (columnIndex === -1) {
          break;
        }

        findings.push({
          filePath,
          line: lineIndex + 1,
          column: columnIndex + 1,
          label: check.label,
        });

        searchFrom = columnIndex + check.value.length;
      }
    }
  }
}

walk(ROOT_DIR);

if (findings.length > 0) {
  console.error(`AI punctuation check failed: found ${findings.length} em-dash occurrence(s).`);
  console.error('Replace these with ASCII hyphen "-".');
  for (const finding of findings.slice(0, MAX_REPORTS)) {
    const relative = path.relative(ROOT_DIR, finding.filePath);
    console.error(` - ${relative}:${finding.line}:${finding.column} (${finding.label})`);
  }
  if (findings.length > MAX_REPORTS) {
    console.error(` - ... ${findings.length - MAX_REPORTS} more not shown`);
  }
  process.exit(1);
}

console.log('AI punctuation check passed: no em dashes or em-dash entities found.');
