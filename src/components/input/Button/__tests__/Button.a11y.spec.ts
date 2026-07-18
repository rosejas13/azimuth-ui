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

  // Regression: azimuth_ui-c5m. A Button rendered as an anchor must not keep the
  // browser's default anchor underline; the base `.button` class sets
  // text-decoration: none in every variant (including asChild + link).
  test('asChild link variant removes the UA default underline', async ({
    page,
  }) => {
    await page.goto('/?path=/story/primitives-button--as-child-link');
    await expect(page.locator('#storybook-root')).toBeVisible();

    const link = page.getByRole('link', { name: 'Start Your Project' });
    await expect(link).toBeVisible();
    // Real-browser computed style: the UA default `underline` must be reset.
    const textDecoration = await link.evaluate(
      (el) => getComputedStyle(el).textDecorationLine,
    );
    expect(textDecoration).not.toContain('underline');
  });
});
