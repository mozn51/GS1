import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: "ui/tests",
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
  use: {
    viewport: { width: 1280, height: 720 },
    baseURL: 'https://www.saucedemo.com',
    navigationTimeout: 10000,
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  reporter: [
    ['list'],
    ['json', { outputFile: 'reports/report.json' }],
    ["junit", { outputFile: "reports/ui-junit-report.xml" }],
    ['html', { outputFolder: 'playwright-report/', open: 'never' }],
  ],
  workers: 3,
  fullyParallel: true,
  maxFailures: 0,
  retries: 2,
});
