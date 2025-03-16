import { Page, Locator, expect } from "@playwright/test";
import { URLs } from "../utils/urls";
import { BasePage } from "./base.page";

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
    await super.goto(URLs.CART_URL, CartPage.cartListSelector);
  }

  async checkoutYourInformation(firstName: string, lastName: string, postalCode: string) {
    await this.firstNameField.fill(firstName);
    await this.lastNameField.fill(lastName);
    await this.postalCodeField.fill(postalCode);
  }

  async continueCheckout() {
    await this.continueButton.click();
  }

  async finishCheckout() {
    await this.finishButton.click();
    await expect(this.successMessage).toBeVisible({ timeout: 5000 });
  }

  async goBackToHome() {
    await this.backHomeButton.click();
  }

  async startCheckout() {
    await this.checkoutButton.click();
  }

  async getAllCartProductNames(): Promise<string[]> {
    return await this.cartList.locator('.inventory_item_name').allTextContents();
  }

  async getAllCartProductPrices(): Promise<number[]> {
    const prices = await this.cartItems.locator(".inventory_item_price").allTextContents();
    return prices.map(price => parseFloat(price.replace("$", "")));
  }

  async getAllCheckoutProductNames(): Promise<string[]> {
    return await this.cartList.locator('.inventory_item_name').allTextContents();
  }
}
