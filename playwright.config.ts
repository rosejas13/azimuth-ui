import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  webServer: {
    command: 'npx storybook dev -p 6006 --ci',
    url: 'http://localhost:6006',
    reuseExistingServer: true,
    timeout: 60000,
  },
  testDir: './src',
  testMatch: '**/*.a11y.spec.ts',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['list'],
    process.env.CI
      ? ['html', { outputFolder: '.playwright-report' }]
      : ['null'],
  ],
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:6006',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  timeout: 30000,
  expect: {
    timeout: 10000,
  },
});
