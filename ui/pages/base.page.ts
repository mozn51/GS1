import { Page, expect } from '@playwright/test';

export class BasePage {
    protected page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async goto(url: string, waitForSelector: string) {
        await this.page.goto(url);
        await expect(this.page.locator(waitForSelector)).toBeVisible({ timeout: 5000 });
    }
}
