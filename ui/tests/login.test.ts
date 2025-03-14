import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { Messages } from '../utils/messages';


test.describe('Login Tests', () => {
    test('should login successfully with valid credentials', async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.loginWithValidUser();
        await expect(page).toHaveURL(/inventory/);
    });

    test('should display an error message for invalid credentials', async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.loginWithInvalidUser();
        const errorMessage = await loginPage.getErrorMessage();
        expect(errorMessage).toContain(Messages.LOGIN_ERROR);
    });
});