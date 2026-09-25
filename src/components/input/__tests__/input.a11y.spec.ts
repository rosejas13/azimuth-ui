import { test } from '@playwright/test';
import { runA11yTest } from '../../__tests__/a11y-utils';

const stories = [
  'primitives-button--primary',
  'primitives-button--secondary',
  'primitives-button--disabled',
  'primitives-checkbox--unchecked',
  'components-combobox--default',
  'components-dropdownlist--default',
  'components-fileupload--default',
  'components-form--default',
  'primitives-input--text',
  'components-inputgroup--default',
  'components-otpinput--default',
  'components-phoneinput--default',
  'input-quantitystepper--default',
  'primitives-radio--unchecked',
  'components-rating--empty',
  'components-searchbar--default',
  'primitives-select--default',
  'components-slider--default',
  'components-textarea--default',
  'components-textbox--plain',
  'primitives-toggle--off',
];

test.describe('Input components a11y', () => {
  for (const story of stories) {
    test(story, async ({ page }) => {
      await runA11yTest(page, story, 'input');
    });
  }
});
