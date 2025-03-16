import { Page, Locator, expect } from "@playwright/test";
import { URLs } from "../utils/urls";
import { Credentials } from "../utils/credentials";
import { BasePage } from "./base.page";
import '../ui-config';

export class LoginPage extends BasePage {
  private static readonly loginContainerSelector = ".login_container";
  private readonly usernameField: Locator;
  private readonly passwordField: Locator;
  private readonly loginButton: Locator;
  public readonly loginErrorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameField = page.locator("#user-name");
    this.passwordField = page.locator("#password");
    this.loginButton = page.locator("#login-button");
    this.loginErrorMessage = page.locator(".error-message-container");
  }

  async goto() {
    this.log(`Navigating to Login Page | CI Mode: ${this.isCI}`);
    const startTime = Date.now();

    await super.goto(URLs.BASE_URL, LoginPage.loginContainerSelector);

    this.log(`Login Page loaded in ${Date.now() - startTime}ms`);
  }

  async login(username: string, password: string) {
    this.log(`Logging in with username: ${username}`);
    const startTime = Date.now();

    await this.usernameField.fill(username);
    await this.passwordField.fill(password);
    await this.loginButton.click();

    this.log(`Login action completed in ${Date.now() - startTime}ms`);
  }

  async loginWithValidUser() {
    this.log(`Logging in with valid user | CI Mode: ${this.isCI}`);
    const startTime = Date.now();

    await this.login(Credentials.VALID_USER.username, Credentials.VALID_USER.password);
    await expect(this.page).toHaveURL(/inventory/, { timeout: this.isCI ? 8000 : 5000 });

    this.log(`Valid user login completed in ${Date.now() - startTime}ms`);
  }

  async loginWithInvalidUser() {
    this.log(`Logging in with invalid user | CI Mode: ${this.isCI}`);
    const startTime = Date.now();

    await this.login(Credentials.INVALID_USER.username, Credentials.INVALID_USER.password);
    await expect(this.loginErrorMessage).toBeVisible({ timeout: this.isCI ? 5000 : 3000 });

    this.log(`Invalid login attempt detected in ${Date.now() - startTime}ms`);
  }

  async getLoginErrorMessage() {
    this.log(`Retrieving login error message`);
    const startTime = Date.now();

    const errorMessage = await this.loginErrorMessage.textContent();
    
    this.log(`Retrieved error message in ${Date.now() - startTime}ms: ${errorMessage}`);
    return errorMessage || "";
  }
}
