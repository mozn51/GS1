import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { ProductPage } from '../pages/product.page';
import { CartPage } from '../pages/cart.page';
import { Messages } from '../utils/messages';

test.describe('Negative Checkout Tests', () => {
    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.loginWithValidUser();

        // Add product to cart
        const productPage = new ProductPage(page);
        await productPage.goto();
        await page.locator('.inventory_item button').first().click();

        // Navigate to cart
        const cartPage = new CartPage(page);
        await cartPage.goto();
        await cartPage.checkoutButton.click();
    });

    test('should display error for missing first name', async ({ page }) => {
        const cartPage = new CartPage(page);
        await cartPage.checkoutYourInformation('', 'Doe', '12345');
        await cartPage.continueButton.click();
        const errorMessage = await page.locator('.error-message-container').textContent();
        expect(errorMessage).toContain(Messages.CHECKOUT_FIRST_NAME_REQUIRED);
    });

    test('should display error for missing last name', async ({ page }) => {
        const cartPage = new CartPage(page);
        await cartPage.checkoutYourInformation('John', '', '12345');
        await cartPage.continueButton.click();
        const errorMessage = await page.locator('.error-message-container').textContent();
        expect(errorMessage).toContain(Messages.CHECKOUT_LAST_NAME_REQUIRED);
    });

    test('should display error for missing postal code', async ({ page }) => {
        const cartPage = new CartPage(page);
        await cartPage.checkoutYourInformation('John', 'Doe', '');
        await cartPage.continueButton.click();
        const errorMessage = await page.locator('.error-message-container').textContent();
        expect(errorMessage).toContain(Messages.CHECKOUT_POSTAL_CODE_REQUIRED);
    });
});
