import { test } from '@playwright/test';
import { runA11yTest } from '../../../__tests__/a11y-utils';

const stories = [
  'components-suggestionsfield--suggestions-mode',
  'components-suggestionsfield--free-mode',
  'components-suggestionsfield--fixed-mode',
  'components-suggestionsfield--with-error',
  'components-suggestionsfield--max-selected',
  'components-suggestionsfield--disabled',
];

test.describe('SuggestionsField a11y', () => {
  for (const story of stories) {
    test(story, async ({ page }) => {
      await runA11yTest(page, story, 'suggestionsfield');
    });
  }
});
