import { test } from '@playwright/test';
import { runA11yTest } from '../../__tests__/a11y-utils';

const stories = [
  'components-button--primary',
  'components-button--secondary',
  'components-button--disabled',
  'components-checkbox--default',
  'components-combobox--default',
  'components-dropdownlist--default',
  'components-fileupload--default',
  'components-form--default',
  'components-input--default',
  'components-inputgroup--default',
  'components-otpinput--default',
  'components-phoneinput--default',
  'components-quantitystepper--default',
  'components-radio--default',
  'components-rating--default',
  'components-searchbar--default',
  'components-select--default',
  'components-slider--default',
  'components-textarea--default',
  'components-textbox--default',
  'components-toggle--default',
];

test.describe('Input components a11y', () => {
  for (const story of stories) {
    test(story, async ({ page }) => {
      await runA11yTest(page, story, 'input');
    });
  }
});
