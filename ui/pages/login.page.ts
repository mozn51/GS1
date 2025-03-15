import { Page, Locator } from '@playwright/test';
import { URLs } from '../utils/urls';
import { Credentials } from '../utils/credentials';
import { BasePage } from './base.page';

export class LoginPage extends BasePage {
    private static readonly loginContainerSelector = '.login_container';
    private readonly usernameField: Locator;
    private readonly passwordField: Locator;
    private readonly loginButton: Locator;
    private readonly errorMessage: Locator;
    
    constructor(page: Page) {
        super(page);
        this.usernameField = page.locator('#user-name');
        this.passwordField = page.locator('#password');
        this.loginButton = page.locator('#login-button');
        this.errorMessage = page.locator('.error-message-container');  
    }

    async goto() {
        await super.goto(URLs.BASE_URL, LoginPage.loginContainerSelector);
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
