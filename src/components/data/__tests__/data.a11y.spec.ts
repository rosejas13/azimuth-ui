import { test } from '@playwright/test';
import { runA11yTest } from '../../__tests__/a11y-utils';

const stories = [
  'components-calendar--default',
  'components-colorpicker--default',
  'components-datatable--default',
  'components-daterangepicker--default',
  'components-datepicker--default',
  'components-datetimepicker--default',
  'components-datafilterbar--default',
  'components-diffviewer--default',
  'components-list--default',
  'components-pagination--default',
  'components-simplechart--default',
  'components-table--default',
  'components-timeline--default',
  'components-treelist--default',
];

test.describe('Data components a11y', () => {
  for (const story of stories) {
    test(story, async ({ page }) => {
      await runA11yTest(page, story, 'data');
    });
  }
});
