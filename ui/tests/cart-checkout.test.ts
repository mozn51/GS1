import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/login.page";
import { ProductPage } from "../pages/product.page";
import { Filters } from "../utils/filters";
import { CartPage } from "../pages/cart.page";

test.describe("Cart & Checkout Tests", () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginWithValidUser();
  });

  test("should add the first two products (sorted by price low to high) to cart and complete checkout", async ({ page }) => {
    const productPage = new ProductPage(page);
    await productPage.goto();

    // Apply sorting filter
    await productPage.applyFilter(Filters.PRICE_LOW_HIGH);

    // Capture product details before adding to cart
    const productNames = await productPage.getAllProductNames();
    const productPrices = await productPage.getAllProductPrices();

    // Add first two products to cart
    await productPage.addProductToCart(0);
    await productPage.addProductToCart(1);

    // Navigate to cart
    const cartPage = new CartPage(page);
    await cartPage.goto();

    // Capture product details inside the cart
    const cartProductNames = await cartPage.getAllCartProductNames();
    const cartProductPrices = await cartPage.getAllCartProductPrices();

    // Validate cart contents
    expect(cartProductNames).toEqual([productNames[0], productNames[1]]);
    expect(cartProductPrices).toEqual([productPrices[0], productPrices[1]]);

    // Proceed to checkout
    await cartPage.startCheckout();
    await cartPage.checkoutYourInformation("John", "Doe", "12345");
    await cartPage.continueCheckout();

    // Ensure checkout page loads properly
    await expect(cartPage.checkoutForm).not.toBeVisible();
    await expect(cartPage.cartList).toBeVisible();

    // Validate order summary
    const checkoutProductNames = await cartPage.getAllCheckoutProductNames();
    expect(checkoutProductNames).toEqual([productNames[0], productNames[1]]);

    // Finish checkout
    await cartPage.finishCheckout();

    // Verify checkout success message
    await expect(cartPage.successMessage).toHaveText(/Thank you for your order!/);

    // Back to home page
    await cartPage.goBackToHome();
  });
});
