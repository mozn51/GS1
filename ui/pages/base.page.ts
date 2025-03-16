import { Page, expect } from "@playwright/test";
import '../ui-config';

export class BasePage {
  protected page: Page;
  protected isCI: boolean;
  protected logLevel: string;

  constructor(page: Page) {
    this.page = page;
    this.isCI = process.env.CI === "true";
    this.logLevel = process.env.LOG_LEVEL || "info"; // Default to 'info' if no log level is set
  }

  // Change log to 'protected' so it can be accessed in subclasses
  protected log(message: string) {
    if (this.logLevel === "debug") {
      console.log(`[DEBUG] ${message}`);
    }
  }

  async goto(url: string, waitForSelector: string) {
    if (!waitForSelector) {
      throw new Error(`[ERROR] Missing waitForSelector when navigating to ${url}`);
    }

    this.log(`Navigating to: ${url} | CI Mode: ${this.isCI}`);
    const startTime = Date.now();

    try {
      await this.page.goto(url, { waitUntil: "domcontentloaded" });
      await expect(this.page.locator(waitForSelector)).toBeVisible({ timeout: this.isCI ? 8000 : 5000 });
      this.log(`Navigation to ${url} completed in ${Date.now() - startTime}ms`);
    } catch (error) {
      console.error(`[ERROR] Navigation failed to: ${url}`);
      throw error;
    }
  }

  async click(selector: string) {
    if (this.logLevel === 'debug') {
      this.log(`Clicking on: ${selector}`);
    }
    await this.page.locator(selector).click();
  }

  async fill(selector: string, value: string) {
    if (this.logLevel === 'debug') {
      this.log(`Filling ${selector} with value: ${value}`);
    }
    await this.page.locator(selector).fill(value);
  }

  async waitFor(selector: string) {
    if (this.logLevel === 'debug') {
      this.log(`Waiting for element: ${selector}`);
    }
    await expect(this.page.locator(selector)).toBeVisible({ timeout: this.isCI ? 8000 : 5000 });
  }

  async getText(selector: string): Promise<string> {
    if (this.logLevel === 'debug') {
      this.log(`Getting text from: ${selector}`);
    }
    return (await this.page.locator(selector).textContent()) || "";
  }
}
