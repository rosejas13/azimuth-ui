#!/usr/bin/env node
/**
 * Post-build verification: ensures dist/ contains no sourceMappingURL
 * directives pointing at missing .map files (the 0.11.9 ENOENT issue).
 *
 * Exit 1 on failure so CI catches regressions.
 */
import { readFileSync, readdirSync } from 'fs';
import { resolve } from 'path';

const root = resolve(import.meta.dirname, '..');
const dist = resolve(root, 'dist');

const extensions = ['.js', '.cjs', '.css'];
const mapFiles = readdirSync(dist).filter((f) => f.endsWith('.map'));

if (mapFiles.length > 0) {
  console.error(`FAIL: unexpected .map files in dist/: ${mapFiles.join(', ')}`);
  process.exit(1);
}

let failed = false;

for (const file of readdirSync(dist)) {
  const ext = extensions.find((e) => file.endsWith(e));
  if (!ext) continue;

  const content = readFileSync(resolve(dist, file), 'utf8');
  const match = content.match(/sourceMappingURL\s*=\s*\S+/);
  if (match) {
    console.error(`FAIL: ${file} contains ${match[0]}`);
    failed = true;
  }
}

if (failed) process.exit(1);
console.log('OK: dist/ has no sourcemap references');
