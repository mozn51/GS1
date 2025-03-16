import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/login.page";
import { ProductPage } from "../pages/product.page";
import { Filters } from "../utils/filters";
import '../ui-config';

test.describe("Product Filtering Tests", () => {
  let productPage: ProductPage;

  test.beforeEach(async ({ page }) => {
    // Conditional logging based on LOG_LEVEL environment variable
    if (process.env.LOG_LEVEL === "debug") {
      console.log("[DEBUG] Starting test setup - Logging in and navigating to Product Page");
    }

    await test.step("Login as valid user", async () => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.loginWithValidUser();
    });

    await test.step("Navigate to Product Page", async () => {
      productPage = new ProductPage(page);
      await productPage.goto();
    });

    if (process.env.LOG_LEVEL === "debug") {
      console.log("[DEBUG] Test setup complete");
    }
  });

  test("should filter products from low to high price", async ({ page }) => {
    // Conditional logging based on LOG_LEVEL environment variable
    if (process.env.LOG_LEVEL === "debug") {
      console.log("[DEBUG] Running test: Filter products from Low to High price");
    }

    await test.step("Apply Low to High Price Filter", async () => {
      await productPage.applyFilter(Filters.PRICE_LOW_HIGH);
    });

    let productNames: string[];
    let prices: number[];

    await test.step("Retrieve product names & prices", async () => {
      productNames = await productPage.getAllProductNames();
      expect(productNames.length).toBeGreaterThan(0); // ✅ Ensure products exist

      prices = await productPage.getAllProductPrices();
    });

    await test.step("Validate prices are sorted in ascending order", async () => {
      expect(prices).toEqual([...prices].sort((a, b) => a - b));
    });

    if (process.env.LOG_LEVEL === "debug") {
      console.log("[DEBUG] Test passed: Filter products from Low to High price");
    }
  });

  test("should filter products from high to low price", async ({ page }) => {
    // Conditional logging based on LOG_LEVEL environment variable
    if (process.env.LOG_LEVEL === "debug") {
      console.log("[DEBUG] Running test: Filter products from High to Low price");
    }

    await test.step("Apply High to Low Price Filter", async () => {
      await productPage.applyFilter(Filters.PRICE_HIGH_LOW);
    });

    let prices: number[];

    await test.step("Retrieve product prices", async () => {
      prices = await productPage.getAllProductPrices();
    });

    await test.step("Validate prices are sorted in descending order", async () => {
      expect(prices).toEqual([...prices].sort((a, b) => b - a));
    });

    if (process.env.LOG_LEVEL === "debug") {
      console.log("[DEBUG] Test passed: Filter products from High to Low price");
    }
  });
});
