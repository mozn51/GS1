import { Page, Locator } from "@playwright/test";
import { URLs } from "../utils/urls";
import { BasePage } from "./base.page";

export class ProductPage extends BasePage {
  private static readonly inventoryListSelector = ".inventory_list";
  public readonly inventoryItems: Locator;
  public readonly inventoryItemsNames: Locator;
  public readonly inventoryItemsPrices: Locator;
  private readonly filterDropdown: Locator;
  private readonly addToCartButtons: Locator;

  constructor(page: Page) {
    super(page);
    this.filterDropdown = page.locator(".product_sort_container");
    this.inventoryItems = page.locator(".inventory_item");
    this.inventoryItemsNames = page.locator(".inventory_item_name");
    this.inventoryItemsPrices = page.locator(".inventory_item_price");
    this.addToCartButtons = page.locator(".inventory_item button");
  }

  async goto() {
    await super.goto(URLs.INVENTORY_URL, ProductPage.inventoryListSelector);
  }

  async applyFilter(option: string) {
    await this.filterDropdown.selectOption(option);
  }

  async getAllProductNames(): Promise<string[]> {
    return await this.inventoryItemsNames.allTextContents();
  }

  async getAllProductPrices(): Promise<number[]> {
    const prices = await this.inventoryItemsPrices.allTextContents();
    return prices.map(price => parseFloat(price.replace("$", "")));
  }

  async addProductToCart(index: number) {
    const product = this.inventoryItems.nth(index);
    await product.locator("button").click();
  }

  async addFirstProductToCart() {
    await this.addProductToCart(0);
  }
}
