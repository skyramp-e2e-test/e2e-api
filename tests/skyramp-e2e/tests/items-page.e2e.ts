import { test, expect, type Page, type APIRequestContext } from "@playwright/test";
import { newSkyrampPlaywrightPage } from "@skyramp/skyramp";

// The Items page (e2e-frontend) and the API it proxies /api/items to (e2e-api).
const UI = (process.env.SKYRAMP_TEST_SERVICE_URL_UI || process.env.SKYRAMP_TEST_SERVICE_URL_E2E_FRONTEND || "http://localhost:8080").replace(/\/+$/, "");
const API = (process.env.SKYRAMP_TEST_SERVICE_URL_E2E_API || "http://localhost:3000").replace(/\/+$/, "");
// Items this file adds are named with this prefix, so cleanup-items-page-items.js can remove them if a run stops early.
const ITEM_PREFIX = "Testbot items-page ";

type Item = { id: string; name: string };

/** Opens the Items page and returns the item list the page itself loaded from GET /api/items. */
async function openItemsPage(page: Page): Promise<Item[]> {
  const loaded = page.waitForResponse((r) => new URL(r.url()).pathname === "/api/items" && r.request().method() === "GET");
  await page.goto(`${UI}/`);
  const res = await loaded;
  expect(res.status()).toBe(200);
  return (await res.json()) as Item[];
}

async function expectListShows(page: Page, items: Item[]) {
  if (items.length === 0) {
    await expect.soft(page.getByTestId("empty-state")).toHaveText("No items yet.");
    await expect.soft(page.getByTestId("empty-state")).toBeVisible();
  } else {
    await expect.soft(page.getByTestId("item")).toHaveText(items.map((i) => i.name));
    await expect.soft(page.getByTestId("empty-state")).toBeHidden();
  }
}

async function expectNoMarkerText(page: Page) {
  const text = await page.locator("body").innerText();
  expect.soft(text).not.toContain("UC-10.5");
  expect.soft(text).not.toContain("third branch");
}

async function deleteItemsNamed(request: APIRequestContext, name: string) {
  const res = await request.get(`${API}/api/items`);
  const items = (await res.json()) as Item[];
  for (const item of items.filter((i) => i.name === name)) {
    await request.delete(`${API}/api/items/${item.id}`);
  }
}

test.describe("Items page", () => {
  test("renders the item list the API returns without showing the marker comment", async ({ page }) => {
    page = newSkyrampPlaywrightPage(page);
    const items = await openItemsPage(page);
    await expect(page.getByRole("heading", { name: "Items" })).toBeVisible();
    await expectListShows(page, items);
    await expect(page.getByRole("status")).toHaveText("");
    await expect(page.getByRole("status")).not.toHaveClass(/error/);
    await expectNoMarkerText(page);
  });

  test("user opens the Items page and adds an item that stays listed after a reload", async ({ page, request }) => {
    page = newSkyrampPlaywrightPage(page);
    const name = `${ITEM_PREFIX}${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
    const nameInput = page.getByPlaceholder("Item name");
    const added = page.getByTestId("item").filter({ hasText: name });
    try {
      await test.step("1. open the Items page", async () => {
        const items = await openItemsPage(page);
        await expect.soft(page.getByRole("heading", { name: "Items" })).toBeVisible();
        await expectListShows(page, items);
        await expectNoMarkerText(page);
      });

      await test.step("2. add an item through the form", async () => {
        await nameInput.fill(name);
        const posted = page.waitForRequest((r) => new URL(r.url()).pathname === "/api/items" && r.method() === "POST");
        await page.getByRole("button", { name: "Add" }).click();
        expect.soft((await posted).postDataJSON()).toEqual({ name });
        await expect.soft(page.getByRole("status")).toHaveText(`Added "${name}"`);
        await expect.soft(page.getByRole("status")).not.toHaveClass(/error/);
        await expect.soft(added).toHaveCount(1);
        await expect.soft(nameInput).toHaveValue("");
      });

      await test.step("3. reload: the item is still listed", async () => {
        await page.reload();
        await expect.soft(page.getByRole("heading", { name: "Items" })).toBeVisible();
        await expect.soft(added).toHaveCount(1);
        await expectNoMarkerText(page);
      });
    } finally {
      await deleteItemsNamed(request, name);
    }
  });
});
