import { test } from '@playwright/test';
import { runA11yTest } from '../../__tests__/a11y-utils';

const stories = [
  'components-commandpalette--default',
  'components-dialog--default',
  'components-drawer--default',
  'components-flyout--default',
  'components-modal--default',
  'components-sidebar--default',
  'components-slidesheet--default',
  'components-tooltip--default',
];

test.describe('Overlay components a11y', () => {
  for (const story of stories) {
    test(story, async ({ page }) => {
      await runA11yTest(page, story, 'overlay');
    });
  }
});
