import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const viewports = [
  { width: 320, height: 568, name: 'mobile-sm' },
  { width: 375, height: 812, name: 'mobile' },
  { width: 768, height: 1024, name: 'tablet' },
  { width: 1280, height: 800, name: 'desktop' },
];

const stories = [
  'sections-hero--default',
  'sections-hero--splitwithmedia',
  'sections-featuresgrid--default',
  'sections-pricingtable--default',
  'sections-testimonials--default',
  'sections-footer--default',
  'components-navbar--default',
  'components-pagelayout--default',
  'components-datatable--default',
  'components-modal--default',
  'components-sidebar--default',
];

test.describe('Responsive a11y & layout', () => {
  for (const story of stories) {
    for (const vp of viewports) {
      test(`${story} @${vp.name}(${vp.width}px)`, async ({ page }) => {
        await page.setViewportSize({ width: vp.width, height: vp.height });
        await page.goto(`/?path=/story/${story}`);
        await expect(page.locator('#storybook-root')).toBeVisible({
          timeout: 15000,
        });
        await page.waitForTimeout(500);

        const axe = new AxeBuilder({ page }).withTags([
          'wcag2a',
          'wcag2aa',
          'wcag21a',
          'wcag21aa',
        ]);
        const results = await axe.analyze();
        expect(results.violations).toEqual([]);
      });
    }
  }
});
