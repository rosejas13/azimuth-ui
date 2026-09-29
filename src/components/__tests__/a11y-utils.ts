import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

export async function runA11yTest(
  page: Page,
  storyPath: string,
  componentName: string,
) {
  await test.step(`${componentName}: ${storyPath}`, async () => {
    // Render the story directly in its iframe — `#storybook-root` only exists
    // in iframe.html, not in the manager chrome served at `/?path=/story/…`
    // (the old default, which broke when the URL semantics changed).
    await page.goto(
      `/iframe.html?id=${encodeURIComponent(storyPath)}&viewMode=story`,
    );
    await expect(page.locator('#storybook-root')).toBeVisible({
      timeout: 15000,
    });
    await page.waitForTimeout(500);

    const axe = new AxeBuilder({ page }).withTags([
      'wcag2a',
      'wcag2aa',
      'wcag21a',
      'wcag21aa',
      'best-practice',
    ]);
    // The story canvas is a bare component page, not a document — page-level
    // document-structure rules can't be satisfied there and would flag every
    // story regardless of component quality.
    const disabled = axe.disableRules([
      'landmark-one-main',
      'page-has-heading-one',
      'region',
      'meta-viewport',
      'bypass',
    ]);

    // Color-sensitive rules run in BOTH color modes: the light default and
    // the dark data-theme scheme. A mode-specific failure labels the violation.
    for (const mode of ['light', 'dark'] as const) {
      await page.evaluate((m) => {
        document.documentElement.setAttribute('data-theme', m);
      }, mode);
      await page.waitForTimeout(150);
      const results = await disabled.analyze();
      if (results.violations.length > 0) {
        results.violations.forEach((v) => {
          v.help = `[${mode}] ${v.help}`;
        });
        expect(results.violations).toEqual([]);
      }
    }
  });
}
