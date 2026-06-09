import { test } from '@playwright/test';
import { runA11yTest } from '../../__tests__/a11y-utils';

const stories = [
  'components-accordion--default',
  'components-activityfeed--default',
  'components-alert--default',
  'components-aspectratio--default',
  'components-avatar--default',
  'components-badge--default',
  'components-card--default',
  'components-carousel--default',
  'components-chat--default',
  'components-chip--default',
  'components-clock--default',
  'components-codeblock--default',
  'components-cursor--default',
  'components-emptystate--default',
  'components-errorboundary--default',
  'components-errorpage--default',
  'components-fanmenu--default',
  'components-icon--default',
  'components-iconbutton--default',
  'components-imageviewer--default',
  'components-infobutton--default',
  'components-kbd--default',
  'components-kpicard--default',
  'components-loader--default',
  'components-loginsignup--default',
  'components-mapdisplay--default',
  'components-mediaplayer--default',
  'components-notificationbadge--default',
  'components-pagelayout--default',
  'components-pricedisplay--default',
  'components-productcard--default',
  'components-progressbar--default',
  'components-progresssteps--default',
  'components-resizablepanel--default',
  'components-scrollarea--default',
  'components-sectionview--default',
  'components-segmentedbutton--default',
  'components-skeleton--default',
  'components-skiplink--default',
  'components-splitbutton--default',
  'components-tag--default',
  'components-text--default',
  'components-toast--default',
  'components-visuallyhidden--default',
];

test.describe('Display components a11y', () => {
  for (const story of stories) {
    test(story, async ({ page }) => {
      await runA11yTest(page, story, 'display');
    });
  }
});
