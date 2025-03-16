import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/login.page";
import { Messages } from "../utils/messages";

test.describe("Login Tests", () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test("should login successfully with valid credentials", async ({ page }) => {
    await loginPage.loginWithValidUser();
    await expect(page).toHaveURL(/inventory/);
  });

  test("should display an error message for invalid credentials", async ({ page }) => {
    await loginPage.loginWithInvalidUser();
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText(Messages.LOGIN_ERROR);
  });
});
