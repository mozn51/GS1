import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/login.page";
import { Messages } from "../utils/messages";
import '../ui-config';

test.describe("Login Tests", () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    // Conditional logging based on LOG_LEVEL environment variable
    if (process.env.LOG_LEVEL === "debug") {
      console.log("[DEBUG] Starting Login Page setup");
    }

    await test.step("Navigate to Login Page", async () => {
      loginPage = new LoginPage(page);
      await loginPage.goto();
    });

    if (process.env.LOG_LEVEL === "debug") {
      console.log("[DEBUG] Login Page setup complete");
    }
  });

  test("should login successfully with valid credentials", async ({ page }) => {
    // Conditional logging based on LOG_LEVEL environment variable
    if (process.env.LOG_LEVEL === "debug") {
      console.log("[DEBUG] Running test: Login with valid credentials");
    }

    await test.step("Enter valid credentials & login", async () => {
      await loginPage.loginWithValidUser();
    });

    await test.step("Validate successful login", async () => {
      await expect(page).toHaveURL(/inventory/, { timeout: 5000 });
    });

    if (process.env.LOG_LEVEL === "debug") {
      console.log("[DEBUG] Test passed: Login with valid credentials");
    }
  });

  test("should display an error message for invalid credentials", async ({ page }) => {
    // Conditional logging based on LOG_LEVEL environment variable
    if (process.env.LOG_LEVEL === "debug") {
      console.log("[DEBUG] Running test: Login with invalid credentials");
    }

    await test.step("Enter invalid credentials & attempt login", async () => {
      await loginPage.loginWithInvalidUser();
    });

    await test.step("Validate error message", async () => {
      await expect(loginPage.loginErrorMessage).toBeVisible({ timeout: 5000 });
      const errorMessage = await loginPage.getLoginErrorMessage();
      expect(errorMessage).toContain(Messages.LOGIN_ERROR);
    });

    if (process.env.LOG_LEVEL === "debug") {
      console.log("[DEBUG] Test passed: Login with invalid credentials");
    }
  });
});
