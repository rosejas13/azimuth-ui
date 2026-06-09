import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

export async function runA11yTest(
  page: Page,
  storyPath: string,
  componentName: string,
) {
  await test.step(`${componentName}: ${storyPath}`, async () => {
    await page.goto(`/?path=/story/${storyPath}`);
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
    const results = await axe.analyze();

    expect(results.violations).toEqual([]);
  });
}
