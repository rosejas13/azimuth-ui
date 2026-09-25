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
  'components-diffviewer--simple-diff',
  'components-list--unordered',
  'components-pagination--default',
  'components-simplechart--bar-chart',
  'components-table--default',
  'components-timeline--default-items',
  'components-treelist--simple',
];

test.describe('Data components a11y', () => {
  for (const story of stories) {
    test(story, async ({ page }) => {
      await runA11yTest(page, story, 'data');
    });
  }
});
