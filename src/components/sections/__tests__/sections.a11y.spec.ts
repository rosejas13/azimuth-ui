import { test } from '@playwright/test';
import { runA11yTest } from '../../__tests__/a11y-utils';

const stories = [
  'sections-hero--default',
  'sections-featuresgrid--default',
  'sections-pricingtable--default',
  'sections-testimonials--default',
  'sections-ctabanner--default',
  'sections-contactsection--default',
  'sections-teamsection--default',
  'sections-footer--default',
  'sections-statssection--default',
];

test.describe('Section components a11y', () => {
  for (const story of stories) {
    test(story, async ({ page }) => {
      await runA11yTest(page, story, 'sections');
    });
  }
});
