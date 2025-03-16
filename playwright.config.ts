import { defineConfig, devices } from '@playwright/test';
import fs from 'fs';

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
    ['json', { outputFile: './reports/ui-report.json' }],
    ["junit", { outputFile: "./reports/ui-junit-report.xml" }],
    ['html', { outputFolder: './playwright-report/', open: 'never' }],
  ],
  workers: process.env.CI ? 5 : 3,
  fullyParallel: true,
  maxFailures: 2,
  retries: process.env.CI ? 2 : 1,
  outputDir: 'reports/',
});

process.on('exit', () => {
  const jsonFile = 'reports/ui-report.json';
  if (!fs.existsSync(jsonFile)) {
    console.error("Playwright JSON report was NOT created. Creating an empty file...");
    fs.writeFileSync(jsonFile, '{}');
  }
});
