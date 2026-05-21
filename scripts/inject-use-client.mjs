import { readFileSync, writeFileSync } from 'fs';
const files = ['dist/index.js', 'dist/index.cjs'];
for (const f of files) {
  const content = readFileSync(f, 'utf8');
  writeFileSync(f, `'use client';\n${content}`);
}
