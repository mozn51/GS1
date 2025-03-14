import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { ProductPage } from '../pages/product.page';
import { Filters } from '../utils/filters';
import { CartPage } from '../pages/cart.page';
import { Selectors } from '../utils/selectors';

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

        const productNames = await page.locator(Selectors.PRODUCT_NAME).allTextContents();
        const productPrices = await page.locator(Selectors.PRODUCT_PRICE).allTextContents();

        const firstProduct = page.locator('.inventory_item').nth(0);
        const secondProduct = page.locator('.inventory_item').nth(1);

        await firstProduct.locator('button').click();
        await secondProduct.locator('button').click();

        const cartPage = new CartPage(page);
        await cartPage.goto();

        const cartProductNames = await page.locator(Selectors.PRODUCT_NAME).allTextContents();
        const cartProductPrices = await page.locator(Selectors.PRODUCT_PRICE).allTextContents();


        expect(cartProductNames).toEqual([productNames[0], productNames[1]]);
        expect(cartProductPrices).toEqual([productPrices[0], productPrices[1]]);

        await cartPage.checkoutButton.click();
        await cartPage.checkoutYourInformation('John', 'Doe', '12345');

        await expect(page.locator('.checkout_info_wrapper')).not.toBeVisible();
        await expect(page.locator('.cart_list')).toBeVisible(); // Ensure order summary is displayed

        // Validate the order summary before completing the purchase
        const checkoutProductNames = await page.locator('.inventory_item_name').allTextContents();
        expect(checkoutProductNames).toEqual([productNames[0], productNames[1]]);


        // Finish checkout
        await cartPage.finishCheckout();

        // Verify checkout success
        await expect(page.locator(Selectors.COMPLETE_HEADER)).toHaveText(/Thank you for your order!/);
       
        // Back to Home Page
        await cartPage.backHomeButton.click();
    });
});
