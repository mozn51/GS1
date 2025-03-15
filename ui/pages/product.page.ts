import { Page, Locator } from '@playwright/test';
import { URLs } from '../utils/urls';
import { BasePage } from './base.page';

export class ProductPage extends BasePage{
    private static readonly inventoryListSelector = '.inventory_list';
    public readonly inventoryItems: Locator;
    public readonly inventoryItemsNames: Locator;
    public readonly inventoryItemsPrices: Locator;
    private readonly filterDropdown: Locator;
        
    constructor(page: Page) {
        super(page);
        this.filterDropdown = page.locator('.product_sort_container');
        this.inventoryItems = page.locator('.inventory_item');
        this.inventoryItemsNames = page.locator('.inventory_item_name');
        this.inventoryItemsPrices = page.locator('.inventory_item_price');
    }

    async goto() {
        await super.goto(URLs.INVENTORY_URL, ProductPage.inventoryListSelector);
    }

    async applyFilter(option: string) {
        await this.filterDropdown.selectOption(option);
    }

    async getProductNames(): Promise<string[]> {
        return await this.inventoryItemsNames.allTextContents();
    }
}
