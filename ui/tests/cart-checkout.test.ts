import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { ProductPage } from '../pages/product.page';
import { Filters } from '../utils/filters';
import { CartPage } from '../pages/cart.page';

test.describe('Cart & Checkout Tests', () => {
    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.loginWithValidUser();
    });

    test('should add the first two products (sorted by price low to high) to cart and complete checkout', async ({ page }) => {
        const productPage = new ProductPage(page);
        await productPage.goto();

        await productPage.applyFilter(Filters.PRICE_LOW_HIGH);

        const productNames = await productPage.inventoryItemsNames.allTextContents();
        const productPrices = await productPage.inventoryItemsPrices.allTextContents();

        const firstProduct = productPage.inventoryItems.nth(0);
        const secondProduct = productPage.inventoryItems.nth(1);

        await firstProduct.locator('button').click();
        await secondProduct.locator('button').click();

        const cartPage = new CartPage(page);
        await cartPage.goto();

        const cartProductNames = await productPage.inventoryItemsNames.allTextContents();
        const cartProductPrices = await productPage.inventoryItemsPrices.allTextContents();


        expect(cartProductNames).toEqual([productNames[0], productNames[1]]);
        expect(cartProductPrices).toEqual([productPrices[0], productPrices[1]]);

        await cartPage.checkoutButton.click();
        await cartPage.checkoutYourInformation('John', 'Doe', '12345');

        await expect(page.locator('.checkout_info_wrapper')).not.toBeVisible();
        await expect(cartPage.cartList).toBeVisible(); // Ensure order summary is displayed

        // Validate the order summary before completing the purchase
        const checkoutProductNames = await page.locator('.inventory_item_name').allTextContents();
        expect(checkoutProductNames).toEqual([productNames[0], productNames[1]]);


        // Finish checkout
        await cartPage.finishCheckout();

        // Verify checkout success
        await expect(cartPage.successMessage).toHaveText(/Thank you for your order!/);
       
        // Back to Home Page
        await cartPage.backHomeButton.click();
    });
});
