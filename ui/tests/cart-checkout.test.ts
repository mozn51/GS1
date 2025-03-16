import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/login.page";
import { ProductPage } from "../pages/product.page";
import { Filters } from "../utils/filters";
import { CartPage } from "../pages/cart.page";
import { Messages } from "../utils/messages";
import '../ui-config';

test.describe("Cart & Checkout Tests", () => {
  test.beforeEach(async ({ page }) => {
    // Conditional logging based on LOG_LEVEL environment variable
    if (process.env.LOG_LEVEL === "debug") {
      console.log("[DEBUG] Starting test setup - Logging in");
    }

    await test.step("Login as valid user", async () => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.loginWithValidUser();
    });

    if (process.env.LOG_LEVEL === "debug") {
      console.log("[DEBUG] Test setup complete");
    }
  });

  test("should add the first two products (sorted by price low to high) to cart and complete checkout", async ({ page }) => {
    // Conditional logging based on LOG_LEVEL environment variable
    if (process.env.LOG_LEVEL === "debug") {
      console.log("[DEBUG] Running test: Add two products & complete checkout");
    }

    let productNames: string[]; // Store product names
    let productPrices: number[]; // Store product prices

    await test.step("Navigate to Product Page & Apply Filter", async () => {
      const productPage = new ProductPage(page);
      await productPage.goto();
      await productPage.applyFilter(Filters.PRICE_LOW_HIGH);
    });

    await test.step("Capture product details before adding to cart", async () => {
      const productPage = new ProductPage(page);
      productNames = await productPage.getAllProductNames();
      productPrices = await productPage.getAllProductPrices();
    });

    await test.step("Add first two products to cart", async () => {
      const productPage = new ProductPage(page);
      await productPage.addProductToCart(0);
      await productPage.addProductToCart(1);
    });

    let cartProductNames: string[];
    let cartProductPrices: number[];

    await test.step("Navigate to Cart & Capture Product Details", async () => {
      const cartPage = new CartPage(page);
      await cartPage.goto();
      cartProductNames = await cartPage.getAllCartProductNames();
      cartProductPrices = await cartPage.getAllCartProductPrices();
    });

    await test.step("Validate cart contents", async () => {
      expect(cartProductNames).toEqual([productNames[0], productNames[1]]);
      expect(cartProductPrices).toEqual([productPrices[0], productPrices[1]]);
    });

    await test.step("Proceed to Checkout", async () => {
      const cartPage = new CartPage(page);
      await cartPage.startCheckout();
      await cartPage.checkoutYourInformation("John", "Doe", "12345");
      await cartPage.continueCheckout();
    });

    await test.step("Ensure checkout page loads properly", async () => {
      const cartPage = new CartPage(page);
      await expect(cartPage.checkoutForm).not.toBeVisible();
      await expect(cartPage.cartList).toBeVisible();
    });

    let checkoutProductNames: string[];

    await test.step("Validate Order Summary", async () => {
      const cartPage = new CartPage(page);
      checkoutProductNames = await cartPage.getAllCheckoutProductNames();
      expect(checkoutProductNames).toEqual([productNames[0], productNames[1]]);
    });

    await test.step("Finish Checkout & Verify Success", async () => {
      const cartPage = new CartPage(page);
      await cartPage.finishCheckout();
      await expect(cartPage.successMessage).toHaveText(Messages.CHECKOUT_THANKS);
    });

    await test.step("Back to Home Page", async () => {
      const cartPage = new CartPage(page);
      await cartPage.goBackToHome();
    });

    if (process.env.LOG_LEVEL === "debug") {
      console.log("[DEBUG] Test completed: Add two products & complete checkout");
    }
  });
});
