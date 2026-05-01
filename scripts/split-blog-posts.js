/**
 * Splits blog-post.model.ts into:
 *   - blog-post.model.ts (metadata only — ~95KB)
 *   - blog-content/<slug>.ts (one file per post — ~10-30KB each)
 *
 * Run: node scripts/split-blog-posts.js
 */

const fs = require('fs');
const path = require('path');

const MODEL_PATH = path.join(__dirname, '..', 'src', 'app', 'models', 'blog-post.model.ts');
const CONTENT_DIR = path.join(__dirname, '..', 'src', 'app', 'models', 'blog-content');

fs.mkdirSync(CONTENT_DIR, { recursive: true });

const source = fs.readFileSync(MODEL_PATH, 'utf-8');

// Extract everything before BLOG_POSTS array
const blogPostsIdx = source.indexOf('export const BLOG_POSTS');
const preamble = source.substring(0, blogPostsIdx);

// Extract the calcReadTime function and auto-calculate block
const calcReadTimeMatch = source.match(/\/\*\* Calculate read time[\s\S]*?^}/m);
const calcReadTime = calcReadTimeMatch ? calcReadTimeMatch[0] : '';

// Parse each post block
const postsStart = source.indexOf('[', blogPostsIdx);
const postsSection = source.substring(postsStart);

// Split into individual post blocks by looking for { id: 'N',
const postBlocks = [];
const regex = /\{\s*\n?\s*id:\s*'(\d+)'/g;
let match;
const indices = [];

while ((match = regex.exec(postsSection)) !== null) {
  indices.push({ index: match.index, id: match[1] });
}

for (let i = 0; i < indices.length; i++) {
  const start = indices[i].index;
  const end = i + 1 < indices.length ? indices[i + 1].index : postsSection.lastIndexOf(']');
  let block = postsSection.substring(start, end).trim();
  // Remove trailing comma
  if (block.endsWith(',')) block = block.slice(0, -1);

  const id = indices[i].id;
  const slugMatch = block.match(/slug:\s*'([^']+)'/);
  const titleMatch = block.match(/title:\s*'((?:[^'\\]|\\.)+)'/);

  if (!slugMatch) continue;

  const slug = slugMatch[1];
  const title = titleMatch ? titleMatch[1] : slug;

  // Extract content
  const contentStart = block.indexOf("content: `");
  const contentEndSearch = block.indexOf("    `,\n    author:");
  const contentEnd = contentEndSearch > -1 ? contentEndSearch + 6 : -1;

  let content = '';
  let metadataBlock = block;

  if (contentStart > -1 && contentEnd > -1) {
    content = block.substring(contentStart + 10, contentEnd - 2); // strip content: ` and `,
    // Replace content with empty placeholder in metadata
    metadataBlock = block.substring(0, contentStart) + "content: ''" + block.substring(contentEnd - 1);
  }

  postBlocks.push({
    id,
    slug,
    title,
    content,
    metadataBlock,
    originalBlock: block,
  });
}

console.log(`Parsed ${postBlocks.length} posts`);

// Write individual content files
for (const post of postBlocks) {
  const filename = `${post.slug}.ts`;
  const fileContent = `export const CONTENT = \`${post.content}\`;\n`;
  fs.writeFileSync(path.join(CONTENT_DIR, filename), fileContent);
}
console.log(`Written ${postBlocks.length} content files to ${CONTENT_DIR}`);

// Write metadata-only model
let metadataModel = preamble;
metadataModel += `export const BLOG_POSTS: BlogPost[] = [\n`;
for (let i = 0; i < postBlocks.length; i++) {
  metadataModel += `  ${postBlocks[i].metadataBlock}`;
  if (i < postBlocks.length - 1) metadataModel += ',';
  metadataModel += '\n';
}
metadataModel += `];\n\n`;
metadataModel += `// Content is loaded dynamically per-post from blog-content/<slug>.ts\n`;
metadataModel += `// Auto-calculate readTime from content for all posts\n`;
metadataModel += `BLOG_POSTS.forEach(post => {\n`;
metadataModel += `  if (!post.readTime || post.readTime === '') {\n`;
metadataModel += `    post.readTime = '5 min read';\n`;
metadataModel += `  }\n`;
metadataModel += `});\n`;

// Write the new metadata-only model
const BACKUP_PATH = MODEL_PATH + '.backup';
fs.copyFileSync(MODEL_PATH, BACKUP_PATH);
console.log(`Backup saved to ${BACKUP_PATH}`);

fs.writeFileSync(MODEL_PATH, metadataModel);
const newSize = fs.statSync(MODEL_PATH).size;
console.log(`New blog-post.model.ts: ${(newSize / 1024).toFixed(0)} KB (was ${(fs.statSync(BACKUP_PATH).size / 1024).toFixed(0)} KB)`);

// Summary
const contentSizes = postBlocks.map(p => {
  const f = path.join(CONTENT_DIR, `${p.slug}.ts`);
  return fs.statSync(f).size;
});
console.log(`Content files: ${contentSizes.length} files, avg ${(contentSizes.reduce((a,b)=>a+b,0) / contentSizes.length / 1024).toFixed(1)} KB each`);
