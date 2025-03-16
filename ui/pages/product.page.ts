import { Page, Locator, expect } from "@playwright/test";
import { URLs } from "../utils/urls";
import { BasePage } from "./base.page";
import '../ui-config';

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
    this.log(`Navigating to Product Page | CI Mode: ${this.isCI}`);
    const startTime = Date.now();

    await super.goto(URLs.INVENTORY_URL, ProductPage.inventoryListSelector);

    this.log(`Product Page loaded in ${Date.now() - startTime}ms`);
  }

  async applyFilter(option: string) {
    this.log(`Applying filter: ${option}`);
    const startTime = Date.now();

    await this.filterDropdown.selectOption(option);
    await this.waitFor(".inventory_list"); // Ensure products refresh after filtering

    this.log(`Filter applied in ${Date.now() - startTime}ms`);
  }

  async getAllProductNames(): Promise<string[]> {
    this.log("Retrieving all product names");
    const startTime = Date.now();

    const names = await this.inventoryItemsNames.allTextContents();

    this.log(`Retrieved ${names.length} product names in ${Date.now() - startTime}ms`);
    return names;
  }

  async getAllProductPrices(): Promise<number[]> {
    this.log("Retrieving all product prices");
    const startTime = Date.now();

    const prices = await this.inventoryItemsPrices.allTextContents();
    const priceNumbers = prices.map(price => parseFloat(price.replace("$", "")));

    this.log(`Retrieved ${priceNumbers.length} product prices in ${Date.now() - startTime}ms`);
    return priceNumbers;
  }

  async addProductToCart(index: number) {
    this.log(`Adding product at index ${index} to cart`);
    const startTime = Date.now();

    const product = this.inventoryItems.nth(index);
    await product.locator("button").click();

    this.log(`Product at index ${index} added to cart in ${Date.now() - startTime}ms`);
  }

  async addFirstProductToCart() {
    this.log("Adding first product to cart");
    await this.addProductToCart(0);
  }
}
