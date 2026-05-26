import { readdirSync, readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ICONS_ROOT = join(__dirname, '..', 'src', 'icons');

function kebabToPascal(str) {
  return str
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

function toValidIdentifier(name) {
  if (/^[0-9]/.test(name)) {
    return '_' + name;
  }
  return name;
}

function componentName(filename) {
  const base = filename.replace(/\.svg$/, '');
  const pascal = kebabToPascal(base);
  const name = pascal.endsWith('Icon') ? pascal : pascal + 'Icon';
  return toValidIdentifier(name);
}

function extractSvgContent(svgContent) {
  const viewBoxMatch = svgContent.match(/viewBox="([^"]+)"/);
  const viewBox = viewBoxMatch ? viewBoxMatch[1] : '0 0 640 640';

  let cleaned = svgContent.replace(/<!--[\s\S]*?-->/g, '');

  const svgTagMatch = cleaned.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i);
  let innerContent = svgTagMatch ? svgTagMatch[1].trim() : '';

  innerContent = innerContent.replace(/\n{3,}/g, '\n\n');

  return { viewBox, innerContent };
}

const categories = ['regular', 'brands'];
let totalGenerated = 0;

for (const category of categories) {
  const dir = join(ICONS_ROOT, category);
  if (!existsSync(dir)) {
    console.log(`Directory ${dir} does not exist, skipping.`);
    continue;
  }

  const files = readdirSync(dir).filter(f => f.endsWith('.svg')).sort();
  const exports = [];

  for (const file of files) {
    const fullPath = join(dir, file);
    const content = readFileSync(fullPath, 'utf-8');
    const { viewBox, innerContent } = extractSvgContent(content);
    const name = componentName(file);
    const tsxPath = join(dir, file.replace(/\.svg$/, '.tsx'));

    const lines = [
      "import { type SVGAttributes, forwardRef } from 'react';",
      '',
      `export const ${name} = forwardRef<SVGSVGElement, SVGAttributes<SVGSVGElement>>(`,
      `  ({ className, ...props }, ref) => (`,
      `    <svg ref={ref} xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" className={className} {...props}>`,
    ];

    const innerLines = innerContent.split('\n');
    for (const line of innerLines) {
      const trimmed = line.trim();
      lines.push(trimmed ? `      ${trimmed}` : '');
    }

    lines.push('    </svg>');
    lines.push('  ),');
    lines.push(');');
    lines.push(`${name}.displayName = '${name}';`);
    lines.push('');

    writeFileSync(tsxPath, lines.join('\n'), 'utf-8');
    exports.push({ name, path: `./${file.replace(/\.svg$/, '')}` });
    totalGenerated++;
  }

  const indexPath = join(dir, 'index.ts');
  const barrelLines = exports.map(({ name, path }) => `export { ${name} } from '${path}';`);
  writeFileSync(indexPath, barrelLines.join('\n') + '\n', 'utf-8');
  console.log(`Generated ${exports.length} icons in ${category}/`);
}

// Read barrels to detect colliding exports between regular and brands
function parseBarrel(filePath) {
  if (!existsSync(filePath)) return [];
  const content = readFileSync(filePath, 'utf-8');
  const exports = [];
  const lines = content.split('\n');
  for (const line of lines) {
    const match = line.match(/^export \{ (\w+) \} from '\.\/(.+)';$/);
    if (match) {
      exports.push({ name: match[1], path: match[2] });
    }
  }
  return exports;
}

const regularExports = parseBarrel(join(ICONS_ROOT, 'regular', 'index.ts'));
const brandsExports = parseBarrel(join(ICONS_ROOT, 'brands', 'index.ts'));

const brandNames = new Set(brandsExports.map(e => e.name));
const rootLines = [];

for (const { name } of regularExports) {
  rootLines.push(`export { ${name} } from './regular';`);
}

for (const { name, path } of brandsExports) {
  if (regularExports.some(r => r.name === name)) {
    rootLines.push(`export { ${name} as ${name}Brand } from './brands';`);
  } else {
    rootLines.push(`export { ${name} } from './brands';`);
  }
}

rootLines.push('');
writeFileSync(join(ICONS_ROOT, 'index.ts'), rootLines.join('\n'), 'utf-8');

console.log(`\nDone! Generated ${totalGenerated} icon components total.`);
