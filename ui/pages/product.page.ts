import { Page, Locator } from '@playwright/test';
import { URLs } from '../utils/urls';
import { BasePage } from './base.page';
import { Selectors } from '../utils/selectors';

export class ProductPage extends BasePage{
    private readonly filterDropdown: Locator;
    private readonly inventoryItems: Locator;

    constructor(page: Page) {
        super(page);
        this.filterDropdown = page.locator('.product_sort_container');
        this.inventoryItems = page.locator('.inventory_item');
    }

    async goto() {
        await super.goto(URLs.INVENTORY_URL, Selectors.PRODUCT_LIST);
    }

    async applyFilter(option: string) {
        await this.filterDropdown.selectOption(option);
    }

    async getProductNames(): Promise<string[]> {
        return await this.page.locator('.inventory_item_name').allTextContents();
    }
}
