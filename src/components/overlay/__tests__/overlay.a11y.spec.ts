import { test } from '@playwright/test';
import { runA11yTest } from '../../__tests__/a11y-utils';

const stories = [
  'components-commandpalette--default',
  'components-dialog--info',
  'components-drawer--left',
  'components-flyout--default',
  'components-modal--demo',
  'components-sidebar--left-sidebar',
  'components-slidesheet--bottom',
  'components-tooltip--basic',
];

test.describe('Overlay components a11y', () => {
  for (const story of stories) {
    test(story, async ({ page }) => {
      await runA11yTest(page, story, 'overlay');
    });
  }
});
