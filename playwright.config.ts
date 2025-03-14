import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  projects: [
    { name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    { name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    { name: 'webkit',
      use: {...devices['Desktop Safari'] },
    },
  ],
  use: {
    viewport: { width: 1280, height: 720 },
    baseURL: 'https://www.saucedemo.com',
    navigationTimeout: 10000,
    trace: 'on-first-retry',
    video: 'retain-on-failure',
  },
  reporter: [['list'], ['html', { outputFolder: 'reports/' }]],
  workers: 3,
  fullyParallel: true,
  maxFailures: 0,
  retries: 0,
});