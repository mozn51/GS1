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
    trace: process.env.CI ? 'retain-on-failure' : 'on',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  reporter: [
    ['list'],
    ['json', { outputFile: 'reports/ui-report.json' }],
    ["junit", { outputFile: "reports/ui-junit-report.xml" }],
    ['html', { outputFolder: 'playwright-report/', open: 'never' }],
  ],
  workers: process.env.CI ? 5 : 3,
  fullyParallel: true,
  maxFailures: 2,
  retries: process.env.CI ? 2 : 1,
  outputDir: 'reports/',
});
