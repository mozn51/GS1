import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/login.page";
import { ProductPage } from "../pages/product.page";
import { CartPage } from "../pages/cart.page";
import { Messages } from "../utils/messages";

test.describe("Negative Checkout Tests", () => {
  let cartPage: CartPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginWithValidUser();

    // Add a product to the cart
    const productPage = new ProductPage(page);
    await productPage.goto();
    await productPage.addFirstProductToCart();

    // Navigate to cart and start checkout process
    cartPage = new CartPage(page);
    await cartPage.goto();
    await cartPage.startCheckout();
  });

  test("should display error for missing first name", async ({ page }) => {
    await cartPage.checkoutYourInformation("", "Doe", "12345");
    await cartPage.continueCheckout();

    // Validate error message
    await expect(cartPage.errorMessage).toBeVisible();
    await expect(cartPage.errorMessage).toContainText(Messages.CHECKOUT_FIRST_NAME_REQUIRED);
  });

  test("should display error for missing last name", async ({ page }) => {
    await cartPage.checkoutYourInformation("John", "", "12345");
    await cartPage.continueCheckout();

    // Validate error message
    await expect(cartPage.errorMessage).toBeVisible();
    await expect(cartPage.errorMessage).toContainText(Messages.CHECKOUT_LAST_NAME_REQUIRED);
  });

  test("should display error for missing postal code", async ({ page }) => {
    await cartPage.checkoutYourInformation("John", "Doe", "");
    await cartPage.continueCheckout();

    // Validate error message
    await expect(cartPage.errorMessage).toBeVisible();
    await expect(cartPage.errorMessage).toContainText(Messages.CHECKOUT_POSTAL_CODE_REQUIRED);
  });
});
