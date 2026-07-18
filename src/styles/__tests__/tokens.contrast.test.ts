import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, it, expect } from 'vitest';
import { parse, formatHex } from 'culori';

/**
 * Token contrast guard for azimuth-ui filled-button variants.
 *
 * Regression coverage for azimuth_ui-8hu: every filled-variant Button
 * (primary, secondary, danger) must meet WCAG 2.2 AA contrast (>=4.5:1 for
 * normal-size text) against its text token, at rest AND on hover, in every
 * bundled theme (light + dark) and in both render paths:
 *   - the oklch token block (modern browsers)
 *   - the `@supports not (color: oklch)` hex-fallback block (legacy browsers)
 *
 * Color math is delegated to `culori` (parse + formatHex with sRGB gamut
 * mapping), which matches how browsers clamp out-of-gamut oklch values.
 * WCAG relative luminance is computed from the resulting sRGB triple.
 */

const __dirname = dirname(fileURLToPath(import.meta.url));
const TOKENS_PATH = resolve(__dirname, '../tokens.css');

type TokenMap = Record<string, string>;

interface Block {
  selector: string;
  body: string;
}

/** Strip CSS comments. */
function stripComments(css: string): string {
  return css.replace(/\/\*[\s\S]*?\*\//g, '');
}

/**
 * Given the index of an opening '{', return the index of its matching '}'.
 */
function findMatchingClose(css: string, openIdx: number): number {
  let depth = 0;
  for (let i = openIdx; i < css.length; i++) {
    if (css[i] === '{') depth++;
    else if (css[i] === '}') {
      depth--;
      if (depth === 0) return i;
    }
  }
  throw new Error('Unbalanced braces');
}

/** Parse `--name: value;` declarations into a map. */
function parseDeclarations(body: string): TokenMap {
  const out: TokenMap = {};
  const re = /(--[A-Za-z0-9-]+)\s*:\s*([^;]+);/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(body)) !== null) {
    out[m[1]] = m[2].trim();
  }
  return out;
}

/**
 * Find all top-level (depth-0 within `section`) blocks whose selector matches
 * `selectorRegex`, returning each selector + brace-balanced body.
 */
function findBlocks(section: string, selectorPattern: RegExp): Block[] {
  const out: Block[] = [];
  const re = new RegExp(selectorPattern.source, 'g');
  let i = 0;
  while (i < section.length) {
    re.lastIndex = i;
    const m = re.exec(section);
    if (!m) break;
    // The selector pattern consumes its opening '{'; the brace sits at the end of the match.
    const braceOpen = m.index + m[0].length - 1;
    if (section[braceOpen] !== '{') break;
    const close = findMatchingClose(section, braceOpen);
    out.push({ selector: m[0], body: section.slice(braceOpen + 1, close) });
    i = close + 1;
  }
  return out;
}

/** Merge multiple blocks' declarations into one map (later wins, as in CSS). */
function mergeMaps(blocks: Block[]): TokenMap {
  const out: TokenMap = {};
  for (const b of blocks) Object.assign(out, parseDeclarations(b.body));
  return out;
}

/** Resolve `var(--x)` references, including chained `var(var(--x))`, within `map`. */
function resolveVar(value: string, map: TokenMap): string {
  let v = value.trim();
  for (let guard = 0; guard < 8; guard++) {
    const m = v.match(/^var\(\s*(--[A-Za-z0-9-]+)\s*(?:,\s*([^)]*)\s*)?\)$/);
    if (!m) break;
    const fallback = m[2];
    const resolved = map[m[1]]
      ? resolveVar(map[m[1]], map)
      : fallback !== undefined
        ? fallback.trim()
        : '';
    v = resolved;
  }
  return v;
}

// ----- WCAG contrast -----

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const n = parseInt(hex.slice(1), 16);
  return {
    r: ((n >> 16) & 255) / 255,
    g: ((n >> 8) & 255) / 255,
    b: (n & 255) / 255,
  };
}

/** Relative luminance of an arbitrary CSS color string via culori sRGB output. */
function relLuminance(colorStr: string): number {
  const hex = formatHex(parse(colorStr));
  if (!hex) throw new Error(`culori could not resolve color: ${colorStr}`);
  const { r, g, b } = hexToRgb(hex);
  const f = (c: number) =>
    c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}

function contrastRatio(fg: string, bg: string): number {
  const lf = relLuminance(fg);
  const lb = relLuminance(bg);
  return (Math.max(lf, lb) + 0.05) / (Math.min(lf, lb) + 0.05);
}

// ----- fixture: which filled-button token pairs to enforce -----

type Pair = {
  name: string;
  bg: string; // token name for background
  fg: string; // token name for foreground (text)
};

const PAIRS: Pair[] = [
  {
    name: 'primary',
    bg: '--azimuth-color-primary',
    fg: '--azimuth-color-on-primary',
  },
  {
    name: 'primary:hover',
    bg: '--azimuth-color-primary-hover',
    fg: '--azimuth-color-on-primary-hover',
  },
  {
    name: 'secondary',
    bg: '--azimuth-color-surface',
    fg: '--azimuth-color-text',
  },
  {
    name: 'secondary:hover',
    bg: '--azimuth-color-surface-hover',
    fg: '--azimuth-color-text',
  },
  {
    name: 'danger',
    bg: '--azimuth-color-error-bg',
    fg: '--azimuth-color-error-text',
  },
  {
    name: 'danger:hover',
    bg: '--azimuth-color-error-text',
    fg: '--azimuth-color-on-primary',
  },
  // Filled-accent surfaces (badges, selected chips, sale tags, timeline dots)
  // use accent-strong so white on-accent text passes AA. The base --azimuth-color-accent
  // (Copper #e8734a) is reserved for non-text uses (borders, accent-colored text on
  // transparent, accent-subtle backgrounds, progress bar fill) and deliberately excluded.
  {
    name: 'accent-filled',
    bg: '--azimuth-color-accent-strong',
    fg: '--azimuth-color-on-accent',
  },
];

const AA_NORMAL = 4.5;

// ----- parse tokens.css and group into 4 theme blocks -----

function loadThemeBlocks(): Array<{
  theme: string;
  path: 'oklch' | 'fallback';
  tokens: TokenMap;
}> {
  const raw = stripComments(readFileSync(TOKENS_PATH, 'utf8'));
  const supportsMatch = raw.match(/@supports[^{]*\boklch\b[^{]*\{/);
  if (!supportsMatch || supportsMatch.index === undefined) {
    throw new Error(
      'Expected an `@supports not (color: oklch...)` fallback block in tokens.css',
    );
  }
  const supportsIdx = supportsMatch.index;
  const oklchSection = raw.slice(0, supportsIdx);

  // Fallback section = body of the @supports block.
  const supportsBrace = raw.indexOf('{', supportsIdx);
  const supportsClose = findMatchingClose(raw, supportsBrace);
  const fallbackSection = raw.slice(supportsBrace + 1, supportsClose);

  const rootSel = /:root\s*\{/g;
  const darkSel = /\.dark,\s*\[data-theme='dark'\]\s*\{/g;

  const blocks: Array<{
    theme: string;
    path: 'oklch' | 'fallback';
    tokens: TokenMap;
  }> = [
    {
      theme: 'light',
      path: 'oklch',
      tokens: mergeMaps(findBlocks(oklchSection, rootSel)),
    },
    {
      theme: 'light',
      path: 'fallback',
      tokens: mergeMaps(findBlocks(fallbackSection, rootSel)),
    },
    {
      theme: 'dark',
      path: 'oklch',
      tokens: mergeMaps(findBlocks(oklchSection, darkSel)),
    },
    {
      theme: 'dark',
      path: 'fallback',
      tokens: mergeMaps(findBlocks(fallbackSection, darkSel)),
    },
  ];
  return blocks.filter((b) => Object.keys(b.tokens).length > 0);
}

describe('token contrast — filled-button variants meet WCAG AA (azimuth_ui-8hu)', () => {
  const blocks = loadThemeBlocks();

  it('parsed all four theme blocks', () => {
    const names = blocks.map((b) => `${b.theme}/${b.path}`).sort();
    expect(names).toEqual([
      'dark/fallback',
      'dark/oklch',
      'light/fallback',
      'light/oklch',
    ]);
  });

  for (const block of blocks) {
    describe(`${block.theme} / ${block.path}`, () => {
      for (const pair of PAIRS) {
        it(`${pair.name} >= ${AA_NORMAL}:1`, () => {
          const bgRaw = block.tokens[pair.bg];
          const fgRaw = block.tokens[pair.fg];
          expect(
            bgRaw,
            `token ${pair.bg} missing in ${block.theme}/${block.path}`,
          ).toBeDefined();
          expect(
            fgRaw,
            `token ${pair.fg} missing in ${block.theme}/${block.path}`,
          ).toBeDefined();
          const bg = resolveVar(bgRaw, block.tokens);
          const fg = resolveVar(fgRaw, block.tokens);
          expect(bg, `could not resolve ${pair.bg} to a color`).toBeTruthy();
          expect(fg, `could not resolve ${pair.fg} to a color`).toBeTruthy();
          const ratio = contrastRatio(fg, bg);
          expect(ratio).toBeGreaterThanOrEqual(AA_NORMAL);
        });
      }
    });
  }
});
