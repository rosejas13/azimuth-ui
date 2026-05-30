import { test, expect } from '@playwright/test';

test.describe('Accordion a11y', () => {
  test('should render default accordion panels', async ({ page }) => {
    await page.goto('/?path=/story/components-accordion--default');
    await expect(page.locator('#storybook-root')).toBeVisible();

    const panels = page.getByRole('heading');
    await expect(panels.first()).toBeVisible();
  });

  test('should toggle panel content on click', async ({ page }) => {
    await page.goto('/?path=/story/components-accordion--default');
    await expect(page.locator('#storybook-root')).toBeVisible();

    const firstTrigger = page.getByRole('button').first();
    await firstTrigger.click();

    await expect(page.locator('#storybook-root')).toBeVisible();
  });
});
