import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const root = resolve(import.meta.dirname, '..');
const distCss = resolve(root, 'dist/index.css');

const tokens = readFileSync(resolve(root, 'src/styles/tokens.css'), 'utf8');
const reset = readFileSync(resolve(root, 'src/styles/reset.css'), 'utf8');
const components = readFileSync(distCss, 'utf8');

writeFileSync(distCss, `${tokens}\n\n${reset}\n\n${components}`, 'utf8');
