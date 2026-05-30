import { test, expect } from '@playwright/test';

test.describe('Dialog a11y', () => {
  test('should render dialog trigger button', async ({ page }) => {
    await page.goto('/?path=/story/components-dialog--info');
    await expect(page.locator('#storybook-root')).toBeVisible();

    const trigger = page.getByRole('button', { name: 'Open Dialog' });
    await expect(trigger).toBeVisible();
  });

  test('should open dialog on trigger click', async ({ page }) => {
    await page.goto('/?path=/story/components-dialog--info');
    await expect(page.locator('#storybook-root')).toBeVisible();

    await page.getByRole('button', { name: 'Open Dialog' }).click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
  });
});
