import { test } from '@playwright/test';
import { runA11yTest } from '../../__tests__/a11y-utils';

const stories = [
  'components-accordion--default',
  'components-activityfeed--default',
  'components-alert--info',
  'components-aspectratio--default',
  'components-avatar--image',
  'components-badge--neutral',
  'components-card--basic',
  'components-carousel--basic',
  'components-chat--default',
  'components-chip--neutral',
  'components-clock--default',
  'components-codeblock--default',
  'components-cursor--default',
  'components-emptystate--basic',
  'components-errorboundary--default',
  'components-errorpage--default-404',
  'components-fanmenu--default',
  'primitives-icon--default',
  'primitives-iconbutton--primary',
  'components-imageviewer--with-single-image',
  'components-infobutton--basic',
  'components-kbd--basic',
  'components-kpicard--default',
  'components-loader--circle-small',
  'components-loginsignup--default-login',
  'components-mapdisplay--default',
  'components-mediaplayer--default',
  'components-notificationbadge--count-badge',
  'components-pagelayout--default',
  'display-pricedisplay--default',
  'display-productcard--default',
  'components-progressbar--determinate',
  'components-progresssteps--default',
  'components-resizablepanel--default',
  'components-scrollarea--default',
  'components-sectionview--default',
  'components-segmentedbutton--default',
  'components-skeleton--text',
  'components-skiplink--default',
  'components-splitbutton--primary',
  'components-tag--neutral',
  'primitives-text--heading-1',
  'components-toast--default',
  'primitives-visuallyhidden--default',
];

test.describe('Display components a11y', () => {
  for (const story of stories) {
    test(story, async ({ page }) => {
      await runA11yTest(page, story, 'display');
    });
  }
});
