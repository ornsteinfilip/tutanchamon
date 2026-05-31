import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourceDir = path.join(rootDir, 'prototypes', 'plan-view');
const outputDir = path.join(rootDir, 'dist');

const copiedEntries = [
  'index.html',
  'styles.css',
  'src',
  'data',
  'assets',
  '_headers'
];

await fs.rm(outputDir, { recursive: true, force: true });
await fs.mkdir(outputDir, { recursive: true });

for (const entry of copiedEntries) {
  const from = path.join(sourceDir, entry);
  const to = path.join(outputDir, entry);
  try {
    await fs.cp(from, to, { recursive: true });
  } catch (error) {
    if (error.code === 'ENOENT' && entry === '_headers') continue;
    throw error;
  }
}

console.log(`Built Cloudflare Pages output: ${path.relative(rootDir, outputDir)}`);
