import { Page, Locator } from '@playwright/test';
import { URLs } from '../utils/urls';
import { Credentials } from '../utils/credentials';
import { BasePage } from './base.page';
import { Selectors } from '../utils/selectors';

export class LoginPage extends BasePage {
    private readonly usernameField: Locator;
    private readonly passwordField: Locator;
    private readonly loginButton: Locator;
    private readonly errorMessage: Locator;
    private readonly loginContainer: Locator;

    constructor(page: Page) {
        super(page);
        this.usernameField = page.locator('#user-name');
        this.passwordField = page.locator('#password');
        this.loginButton = page.locator('#login-button');
        this.errorMessage = page.locator('.error-message-container');
        this.loginContainer = page.locator('.login_container');
    }

    async goto() {
        await super.goto(URLs.BASE_URL, Selectors.LOGIN_CONTAINER);
    }

    async login(username: string, password: string) {
        await this.usernameField.fill(username);
        await this.passwordField.fill(password);
        await this.loginButton.click();
    }

    async loginWithValidUser() {
        await this.login(Credentials.VALID_USER.username, Credentials.VALID_USER.password);
    }

    async loginWithInvalidUser() {
        await this.login(Credentials.INVALID_USER.username, Credentials.INVALID_USER.password);
    }

    async getErrorMessage() {
        return this.errorMessage.textContent();
    }
}
