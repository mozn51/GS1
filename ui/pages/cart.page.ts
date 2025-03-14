import { Page, Locator, expect } from '@playwright/test';
import { URLs } from '../utils/urls';
import { BasePage } from './base.page';
import { Selectors } from '../utils/selectors';

export class CartPage extends BasePage {
    private readonly cartIcon: Locator;
    private readonly cartItems: Locator;
    public readonly checkoutButton: Locator;
    private readonly firstNameField: Locator;
    private readonly lastNameField: Locator;
    private readonly postalCodeField: Locator;
    public readonly continueButton: Locator;
    private readonly finishButton: Locator;
    private readonly successMessage: Locator;
    public readonly backHomeButton: Locator;

    constructor(page: Page) {
        super(page);
        this.cartIcon = page.locator('.shopping_cart_link');
        this.cartItems = page.locator('.cart_item');
        this.checkoutButton = page.locator('#checkout');
        this.firstNameField = page.locator('#first-name');
        this.lastNameField = page.locator('#last-name');
        this.postalCodeField = page.locator('#postal-code');
        this.continueButton = page.locator('#continue');
        this.finishButton = page.locator('#finish');
        this.successMessage = page.locator('.complete-header');
        this.backHomeButton = page.locator('#back-to-products');
    }

    async goto() {
        await super.goto(URLs.CART_URL, Selectors.CART_LIST);
    }

    async checkoutYourInformation(firstName: string, lastName: string, postalCode: string) {
        await this.firstNameField.fill(firstName);
        await this.lastNameField.fill(lastName);
        await this.postalCodeField.fill(postalCode);
        await this.continueButton.click();
    }

    async finishCheckout() {
        await this.finishButton.click();
        await expect(this.successMessage).toBeVisible();
    }
}
