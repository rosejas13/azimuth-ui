import { test } from '@playwright/test';
import { runA11yTest } from '../../__tests__/a11y-utils';

const stories = [
  'components-breadcrumbpageheader--default',
  'components-breadcrumbs--default',
  'components-menu--default',
  'components-navbar--default',
  'components-tabs--default',
];

test.describe('Navigation components a11y', () => {
  for (const story of stories) {
    test(story, async ({ page }) => {
      await runA11yTest(page, story, 'navigation');
    });
  }
});
