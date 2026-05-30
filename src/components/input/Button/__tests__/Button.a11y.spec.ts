import { test, expect } from '@playwright/test';

test.describe('Button a11y', () => {
  test('should render primary button with correct role', async ({ page }) => {
    await page.goto('/?path=/story/primitives-button--primary');
    await expect(page.locator('#storybook-root')).toBeVisible();

    const button = page.getByRole('button', { name: 'Primary Button' });
    await expect(button).toBeVisible();
    await expect(button).toHaveClass(/button/);
  });

  test('should render disabled button as disabled', async ({ page }) => {
    await page.goto('/?path=/story/primitives-button--disabled');
    await expect(page.locator('#storybook-root')).toBeVisible();

    const button = page.getByRole('button', { name: 'Disabled' });
    await expect(button).toBeDisabled();
  });
});
