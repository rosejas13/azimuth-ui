import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

/**
 * Real-browser regression for azimuth_ui-lqj: a consumer must be able to
 * override any --azimuth-* token from their own (unlayered) stylesheet.
 *
 * jsdom does not resolve CSS cascade layers, so this runs in a real engine.
 * It loads the actual shipped tokens.css (base layer + layer-order
 * declaration), a runtime block mimicking ThemeProvider's injected output,
 * and a consumer stylesheet, then asserts the computed token values.
 */

const here = dirname(fileURLToPath(import.meta.url));
const tokensCss = readFileSync(
  resolve(here, '../../styles/tokens.css'),
  'utf8',
);

/** Mimics the block ThemeProvider injects at runtime. */
const runtimeBlock = `<style data-azimuth-tokens>
  @layer azimuth.runtime {
    :root { --azimuth-radius-md: 4px; }
  }
</style>`;

function pageHtml(consumerCss: string, consumerFirst: boolean): string {
  const base = `<style>${tokensCss}</style>${runtimeBlock}`;
  const consumer = `<style id="consumer">${consumerCss}</style>`;
  // consumerFirst places the consumer sheet BEFORE azimuth's — the load order
  // that defeated the old approach — to prove layers make order irrelevant.
  const head = consumerFirst ? consumer + base : base + consumer;
  return `<!doctype html><html><head>${head}</head><body></body></html>`;
}

function readToken(name: string) {
  return `(() => getComputedStyle(document.documentElement).getPropertyValue('${name}').trim())()`;
}

test.describe('theming: consumer token overrides', () => {
  test('runtime layer wins over base defaults', async ({ page }) => {
    await page.setContent(pageHtml('', false));
    // tokens.css base sets 8px; the runtime layer sets 4px and must win.
    expect(await page.evaluate(readToken('--azimuth-radius-md'))).toBe('4px');
  });

  test('an unlayered consumer :root override beats azimuth at equal specificity', async ({
    page,
  }) => {
    await page.setContent(
      pageHtml(':root { --azimuth-radius-md: 2px; }', false),
    );
    expect(await page.evaluate(readToken('--azimuth-radius-md'))).toBe('2px');
  });

  test('the consumer override wins even when its stylesheet loads first', async ({
    page,
  }) => {
    await page.setContent(pageHtml(':root { --azimuth-space-md: 0px; }', true));
    // Base sets 1rem; despite loading earlier in source order, the unlayered
    // consumer rule wins because azimuth's tokens live in a cascade layer.
    expect(await page.evaluate(readToken('--azimuth-space-md'))).toBe('0px');
  });

  test('a non-color token (shadow) is overridable from consumer CSS', async ({
    page,
  }) => {
    await page.setContent(
      pageHtml(':root { --azimuth-shadow-lg: none; }', false),
    );
    expect(await page.evaluate(readToken('--azimuth-shadow-lg'))).toBe('none');
  });
});
