import { Page, Locator, expect } from "@playwright/test";
import { URLs } from "../utils/urls";
import { BasePage } from "./base.page";
import '../ui-config';

export class CartPage extends BasePage {
  private static readonly cartListSelector = ".cart_list";
  public readonly cartList: Locator;
  private readonly cartItems: Locator;
  public readonly checkoutButton: Locator;
  private readonly firstNameField: Locator;
  private readonly lastNameField: Locator;
  private readonly postalCodeField: Locator;
  public readonly continueButton: Locator;
  private readonly finishButton: Locator;
  public readonly successMessage: Locator;
  public readonly backHomeButton: Locator;
  public readonly errorMessage: Locator;
  public readonly checkoutForm: Locator;

  constructor(page: Page) {
    super(page);
    this.cartList = page.locator(CartPage.cartListSelector);
    this.cartItems = page.locator(".cart_item");
    this.checkoutButton = page.locator("#checkout");
    this.firstNameField = page.locator("#first-name");
    this.lastNameField = page.locator("#last-name");
    this.postalCodeField = page.locator("#postal-code");
    this.continueButton = page.locator("#continue");
    this.finishButton = page.locator("#finish");
    this.successMessage = page.locator('[data-test="complete-header"]');
    this.backHomeButton = page.locator("#back-to-products");
    this.errorMessage = page.locator(".error-message-container");
    this.checkoutForm = page.locator('.checkout_info_wrapper');
  }

  async goto() {
    this.log(`Navigating to Cart Page | CI Mode: ${this.isCI}`);
    const startTime = Date.now();

    await super.goto(URLs.CART_URL, CartPage.cartListSelector);

    this.log(`Cart Page loaded in ${Date.now() - startTime}ms`);
  }

  async checkoutYourInformation(firstName: string, lastName: string, postalCode: string) {
    this.log(`Filling checkout information: ${firstName} ${lastName}, ${postalCode}`);
    const startTime = Date.now();

    await this.firstNameField.fill(firstName);
    await this.lastNameField.fill(lastName);
    await this.postalCodeField.fill(postalCode);

    this.log(`Checkout form filled in ${Date.now() - startTime}ms`);
  }

  async continueCheckout() {
    this.log("Clicking Continue Checkout");
    const startTime = Date.now();

    await this.continueButton.click();

    this.log(`Continue Checkout clicked in ${Date.now() - startTime}ms`);
  }

  async finishCheckout() {
    this.log("Clicking Finish Checkout");
    const startTime = Date.now();

    await this.finishButton.click();
    await expect(this.successMessage).toBeVisible({ timeout: this.isCI ? 8000 : 5000 });

    this.log(`Finish Checkout completed in ${Date.now() - startTime}ms`);
  }

  async goBackToHome() {
    this.log("Clicking Back to Home");
    const startTime = Date.now();

    await this.backHomeButton.click();

    this.log(`Back to Home clicked in ${Date.now() - startTime}ms`);
  }

  async startCheckout() {
    this.log("Clicking Start Checkout");
    const startTime = Date.now();

    await this.checkoutButton.click();

    this.log(`Start Checkout clicked in ${Date.now() - startTime}ms`);
  }

  async getAllCartProductNames(): Promise<string[]> {
    this.log("Retrieving all cart product names");
    const startTime = Date.now();

    const names = await this.cartList.locator('.inventory_item_name').allTextContents();

    this.log(`Retrieved ${names.length} cart products in ${Date.now() - startTime}ms`);
    return names;
  }

  async getAllCartProductPrices(): Promise<number[]> {
    this.log("Retrieving all cart product prices");
    const startTime = Date.now();

    const prices = await this.cartItems.locator(".inventory_item_price").allTextContents();
    const priceNumbers = prices.map(price => parseFloat(price.replace("$", "")));

    this.log(`Retrieved ${priceNumbers.length} cart prices in ${Date.now() - startTime}ms`);
    return priceNumbers;
  }

  async getAllCheckoutProductNames(): Promise<string[]> {
    this.log("Retrieving all checkout product names");
    const startTime = Date.now();

    const names = await this.cartList.locator('.inventory_item_name').allTextContents();

    this.log(`Retrieved ${names.length} checkout products in ${Date.now() - startTime}ms`);
    return names;
  }
}
