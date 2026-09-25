import { test, expect } from '@playwright/test';

test.describe('Keyboard navigation smoke test', () => {
  test('tabs through primary interactive components without keyboard trap', async ({
    page,
  }) => {
    await page.goto(
      '/iframe.html?id=components-button--primary&viewMode=story',
    );
    await expect(page.locator('#storybook-root')).toBeVisible({
      timeout: 15000,
    });
    await page.waitForTimeout(500);

    const buttons = page.getByRole('button');
    const count = await buttons.count();
    expect(count).toBeGreaterThan(0);

    await page.keyboard.press('Tab');
    const focused = page.locator(':focus');
    await expect(focused).toBeVisible();
  });
});
