import { Page, expect } from "@playwright/test";

export class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(url: string, waitForSelector: string) {
    if (!waitForSelector) {
      throw new Error(`Missing waitForSelector when navigating to ${url}`);
    }

    console.log(`Navigating to: ${url}`);

    try {
      await this.page.goto(url, { waitUntil: "domcontentloaded" });
      await expect(this.page.locator(waitForSelector)).toBeVisible({ timeout: 5000 });
    } catch (error) {
      console.error(`Navigation failed to: ${url}`);
      throw error;
    }
  }
}
