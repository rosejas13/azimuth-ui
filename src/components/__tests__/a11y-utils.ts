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
    const results = await axe
      .disableRules([
        'landmark-one-main',
        'page-has-heading-one',
        'region',
        'meta-viewport',
        'bypass',
      ])
      .analyze();

    expect(results.violations).toEqual([]);
  });
}
