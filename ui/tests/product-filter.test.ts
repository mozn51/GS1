import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { ProductPage } from '../pages/product.page';
import { Filters } from '../utils/filters';

test.describe('Product Filtering Tests', () => {
    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.loginWithValidUser();
    });

    test('should filter products from low to high price', async ({ page }) => {
        const productPage = new ProductPage(page);
        await productPage.goto();
        await productPage.applyFilter(Filters.PRICE_LOW_HIGH);

        const productNames = await productPage.getProductNames();
        expect(productNames.length).toBeGreaterThan(0); // Ensure products exist

        const productPrices = await page.locator('.inventory_item_price').allTextContents();
        const prices = productPrices.map(price => parseFloat(price.replace('$', '')));

        expect(prices).toEqual([...prices].sort((a, b) => a - b)); // Ensure prices are sorted in ascending order
    });

    test('should filter products from high to low price', async ({ page }) => {
        const productPage = new ProductPage(page);
        await productPage.goto();
        await productPage.applyFilter(Filters.PRICE_HIGH_LOW);

        const productPrices = await page.locator('.inventory_item_price').allTextContents();
        const prices = productPrices.map(price => parseFloat(price.replace('$', '')));

        expect(prices).toEqual([...prices].sort((a, b) => b - a)); // Ensure prices are sorted in descending order
    });
});
