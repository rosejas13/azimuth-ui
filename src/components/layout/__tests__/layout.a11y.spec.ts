import { test } from '@playwright/test';
import { runA11yTest } from '../../__tests__/a11y-utils';

const stories = [
  'components-container--default',
  'components-divider--default',
  'components-grid--default',
  'components-stack--default',
];

test.describe('Layout components a11y', () => {
  for (const story of stories) {
    test(story, async ({ page }) => {
      await runA11yTest(page, story, 'layout');
    });
  }
});
