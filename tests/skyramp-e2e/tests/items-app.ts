// Page object and API helpers for the e2e-frontend items page, shared by the item-count and items-proxy tests.
import { expect, type APIRequestContext, type Locator, type Page } from "@playwright/test";
import { newSkyrampPlaywrightPage } from "@skyramp/skyramp";

export const API_URL = (process.env.SKYRAMP_TEST_SERVICE_URL_E2E_API || "http://localhost:3000").replace(/\/+$/, "");
export const FRONTEND_URL = (
  process.env.SKYRAMP_TEST_SERVICE_URL_UI ||
  process.env.SKYRAMP_TEST_SERVICE_URL_E2E_FRONTEND ||
  "http://localhost:8080"
).replace(/\/+$/, "");

/** Prefix of every item these tests create, so cleanup-item-count-data.mjs can find leftovers. */
export const ITEM_PREFIX = "skyramp-itemcount-";

export function uniqueName(label: string): string {
  return `${ITEM_PREFIX}${label}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export type Item = { id: string; name: string };

export async function createItem(request: APIRequestContext, name: string): Promise<Item> {
  const res = await request.post(`${API_URL}/api/items`, { data: { name } });
  expect(res.status(), `creating ${name} in the API`).toBe(201);
  return res.json();
}

export async function listItems(request: APIRequestContext): Promise<Item[]> {
  const res = await request.get(`${API_URL}/api/items`);
  expect(res.status()).toBe(200);
  return res.json();
}

/** Deletes the named items through the API (by the names the test sent). */
export async function deleteItemsNamed(request: APIRequestContext, names: string[]): Promise<void> {
  if (names.length === 0) return;
  const items = await listItems(request);
  for (const item of items.filter((i) => names.includes(i.name))) {
    await request.delete(`${API_URL}/api/items/${item.id}`);
  }
}

export class ItemsPage {
  readonly page: Page;
  readonly title: Locator;
  readonly count: Locator;
  readonly countValue: Locator;
  readonly nameInput: Locator;
  readonly addButton: Locator;
  readonly status: Locator;
  readonly list: Locator;
  readonly items: Locator;

  constructor(page: Page) {
    this.page = newSkyrampPlaywrightPage(page) as Page;
    this.title = this.page.getByTestId("page-title");
    this.count = this.page.getByTestId("item-count");
    this.countValue = this.page.getByTestId("item-count-value");
    this.nameInput = this.page.getByTestId("item-name-input");
    this.addButton = this.page.getByTestId("add-item-submit");
    this.status = this.page.getByTestId("status");
    this.list = this.page.getByTestId("item-list");
    this.items = this.list.getByTestId("item");
  }

  async open(): Promise<void> {
    await this.page.goto(`${FRONTEND_URL}/`);
    await expect(this.title).toHaveText("Items");
  }

  /** Waits until the count request has been answered either way (data-state is set). */
  async waitForCountSettled(): Promise<void> {
    await expect(this.count).toHaveAttribute("data-state", /^(ok|error)$/);
  }

  /** Waits until the item list has rendered (it sets data-count). */
  async waitForListRendered(): Promise<void> {
    await expect(this.list).toHaveAttribute("data-count", /^\d+$/);
  }

  async add(name: string): Promise<void> {
    await this.nameInput.fill(name);
    await this.addButton.click();
  }

  async expectCountShown(n: number): Promise<void> {
    await expect(this.count).toHaveAttribute("data-state", "ok");
    await expect(this.count).toHaveText(`Total items: ${n}`);
    await expect(this.countValue).toHaveText(String(n));
    await expect(this.count).toHaveAttribute("data-count", String(n));
  }

  async expectCountUnavailable(): Promise<void> {
    await expect(this.count).toHaveAttribute("data-state", "error");
    await expect(this.count).toHaveText("Total items: unavailable");
    await expect(this.countValue).toHaveText("unavailable");
    await expect(this.count).not.toHaveAttribute("data-count");
  }
}
