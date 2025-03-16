import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/login.page";
import { ProductPage } from "../pages/product.page";
import { CartPage } from "../pages/cart.page";
import { Messages } from "../utils/messages";
import '../ui-config';

test.describe("Negative Checkout Tests", () => {
  let cartPage: CartPage;

  test.beforeEach(async ({ page }) => {
    // Only log critical actions in debug mode
    if (process.env.LOG_LEVEL === "debug") {
      console.log("[DEBUG] Starting test setup - Logging in and adding product to cart");
    }

    await test.step("Login as valid user", async () => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.loginWithValidUser();
    });

    await test.step("Add first product to cart", async () => {
      const productPage = new ProductPage(page);
      await productPage.goto();
      await productPage.addFirstProductToCart();
    });

    await test.step("Navigate to cart and start checkout", async () => {
      cartPage = new CartPage(page);
      await cartPage.goto();
      await cartPage.startCheckout();
    });

    if (process.env.LOG_LEVEL === "debug") {
      console.log("[DEBUG] Test setup complete");
    }
  });

  test("should display error for missing first name", async ({ page }) => {
    if (process.env.LOG_LEVEL === "debug") {
      console.log("[DEBUG] Running test: Missing First Name");
    }

    await test.step("Enter checkout details with missing first name", async () => {
      await cartPage.checkoutYourInformation("", "Doe", "12345");
      await cartPage.continueCheckout();
    });

    await test.step("Validate error message", async () => {
      await expect(cartPage.errorMessage).toBeVisible({ timeout: 5000 });
      await expect(cartPage.errorMessage).toContainText(Messages.CHECKOUT_FIRST_NAME_REQUIRED);
    });

    if (process.env.LOG_LEVEL === "debug") {
      console.log("[DEBUG] Test passed: Missing First Name");
    }
  });

  test("should display error for missing last name", async ({ page }) => {
    if (process.env.LOG_LEVEL === "debug") {
      console.log("[DEBUG] Running test: Missing Last Name");
    }

    await test.step("Enter checkout details with missing last name", async () => {
      await cartPage.checkoutYourInformation("John", "", "12345");
      await cartPage.continueCheckout();
    });

    await test.step("Validate error message", async () => {
      await expect(cartPage.errorMessage).toBeVisible({ timeout: 5000 });
      await expect(cartPage.errorMessage).toContainText(Messages.CHECKOUT_LAST_NAME_REQUIRED);
    });

    if (process.env.LOG_LEVEL === "debug") {
      console.log("[DEBUG] Test passed: Missing Last Name");
    }
  });

  test("should display error for missing postal code", async ({ page }) => {
    if (process.env.LOG_LEVEL === "debug") {
      console.log("[DEBUG] Running test: Missing Postal Code");
    }

    await test.step("Enter checkout details with missing postal code", async () => {
      await cartPage.checkoutYourInformation("John", "Doe", "");
      await cartPage.continueCheckout();
    });

    await test.step("Validate error message", async () => {
      await expect(cartPage.errorMessage).toBeVisible({ timeout: 5000 });
      await expect(cartPage.errorMessage).toContainText(Messages.CHECKOUT_POSTAL_CODE_REQUIRED);
    });

    if (process.env.LOG_LEVEL === "debug") {
      console.log("[DEBUG] Test passed: Missing Postal Code");
    }
  });
});
