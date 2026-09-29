import { test } from '@playwright/test';
import { runA11yTest } from '../../../__tests__/a11y-utils';

const stories = [
  'components-markdownfield--default',
  'components-markdownfield--preview',
  'components-markdownfield--split',
  'components-markdownfield--no-toolbar',
  'components-markdownfield--error',
  'components-markdownfield--char-count',
];

test.describe('MarkdownField a11y', () => {
  for (const story of stories) {
    test(story, async ({ page }) => {
      await runA11yTest(page, story, 'markdownfield');
    });
  }
});
