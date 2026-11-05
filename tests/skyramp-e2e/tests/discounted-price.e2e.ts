// Items list (e2e-frontend) showing the discounted price the API returns for an item.
// The journey runs against the real frontend and API. The rendering tests below fulfil GET /api/items with
// priced items in the browser, so they check the display whether or not the API returns prices.
import { test, expect, type Page, type Locator } from "@playwright/test";
import { newSkyrampPlaywrightPage } from "@skyramp/skyramp";

const FRONTEND_URL = (process.env.SKYRAMP_TEST_SERVICE_URL_E2E_FRONTEND || "http://localhost:8080").replace(/\/+$/, "");
const API_URL = (process.env.SKYRAMP_TEST_SERVICE_URL_E2E_API || "http://localhost:3000").replace(/\/+$/, "");

const GREEN = "rgb(10, 125, 50)";
const GREY = "rgb(119, 119, 119)";

function itemNamed(page: Page, name: string): Locator {
  return page.getByTestId("item-list").getByTestId("item").filter({ hasText: name });
}

async function addItem(page: Page, name: string) {
  const posted = page.waitForRequest((r) => r.url().endsWith("/api/items") && r.method() === "POST");
  await page.getByTestId("item-name-input").fill(name);
  await page.getByTestId("add-item-submit").click();
  // The form posts exactly the name typed.
  expect((await posted).postDataJSON()).toEqual({ name });
}

test.describe("items list discounted price", () => {
  const suffix = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
  const names = {
    widget: `Disc Widget ${suffix}`,
    flat: `Disc Flat ${suffix}`,
    only: `Disc Only ${suffix}`,
    plain: `Plain Item ${suffix}`,
  };

  test.afterAll(async ({ request }) => {
    const res = await request.get(`${API_URL}/api/items`);
    const items: Array<{ id: string; name: string }> = await res.json();
    for (const item of items.filter((i) => Object.values(names).includes(i.name))) {
      await request.delete(`${API_URL}/api/items/${item.id}`);
    }
  });

  test("open the items list, add items, and see their discounted prices", async ({ page: rawPage }, testInfo) => {
    const page: Page = newSkyrampPlaywrightPage(rawPage, testInfo);
    const list = page.getByTestId("item-list");
    let before = 0;

    await test.step("1. open the items list", async () => {
      await page.goto(`${FRONTEND_URL}/`);
      await expect(page.getByTestId("page-title")).toHaveText("Items");
      await expect(list).toHaveAttribute("data-count", /^\d+$/);
      before = Number(await list.getAttribute("data-count"));
      await expect.soft(list.getByTestId("item-discounted-price")).toHaveCount(0);
    });

    await test.step("2. add an item with a discount", async () => {
      await addItem(page, names.widget);
      await expect.soft(page.getByTestId("status")).toHaveText(`Added "${names.widget}"`);
      const item = itemNamed(page, names.widget);
      await expect.soft(item).toHaveText(`${names.widget} — $180.00 (was $200.00)`);
      const discounted = item.getByTestId("item-discounted-price");
      const original = item.getByTestId("item-original-price");
      await expect.soft(discounted).toHaveText("— $180.00 (was $200.00)");
      await expect.soft(original).toHaveText("$200.00");
      await expect.soft(item.locator("s[data-testid=item-original-price]")).toHaveCount(1);
      await expect.soft(discounted).toHaveCSS("color", GREEN);
      await expect.soft(original).toHaveCSS("color", GREY);
      await expect.soft(original).toHaveCSS("text-decoration-line", "line-through");
    });

    await test.step("3. add an item whose discounted price equals its price", async () => {
      await addItem(page, names.flat);
      await expect.soft(page.getByTestId("status")).toHaveText(`Added "${names.flat}"`);
      const item = itemNamed(page, names.flat);
      await expect.soft(item).toHaveText(`${names.flat} — $50.00`);
      await expect.soft(item.getByTestId("item-original-price")).toHaveCount(0);
    });

    await test.step("4. add an item with only a discounted price", async () => {
      await addItem(page, names.only);
      await expect.soft(page.getByTestId("status")).toHaveText(`Added "${names.only}"`);
      const item = itemNamed(page, names.only);
      await expect.soft(item).toHaveText(`${names.only} — $9.50`);
      await expect.soft(item.getByTestId("item-original-price")).toHaveCount(0);
    });

    await test.step("5. add an item without a price", async () => {
      await addItem(page, names.plain);
      await expect.soft(page.getByTestId("status")).toHaveText(`Added "${names.plain}"`);
      const item = itemNamed(page, names.plain);
      await expect.soft(item).toHaveText(names.plain);
      await expect.soft(item.getByTestId("item-discounted-price")).toHaveCount(0);
      await expect.soft(list).toHaveAttribute("data-count", String(before + 4));
      await expect.soft(page.getByTestId("empty-state")).toBeHidden();
    });

    await test.step("6. reload the list", async () => {
      await page.goto(`${FRONTEND_URL}/`);
      await expect(page.getByTestId("page-title")).toHaveText("Items");
      await expect.soft(itemNamed(page, names.widget)).toHaveText(`${names.widget} — $180.00 (was $200.00)`);
      await expect.soft(itemNamed(page, names.widget).getByTestId("item-original-price")).toHaveText("$200.00");
      await expect.soft(itemNamed(page, names.flat)).toHaveText(`${names.flat} — $50.00`);
      await expect.soft(itemNamed(page, names.only)).toHaveText(`${names.only} — $9.50`);
      await expect.soft(itemNamed(page, names.plain)).toHaveText(names.plain);
      await expect.soft(itemNamed(page, names.plain).getByTestId("item-discounted-price")).toHaveCount(0);
      await expect.soft(list).toHaveAttribute("data-count", String(before + 4));
    });
  });

  test("items with a discounted price show it, with a struck-through original price", async ({ page: rawPage }, testInfo) => {
    const page: Page = newSkyrampPlaywrightPage(rawPage, testInfo);
    await page.route("**/api/items", (route) =>
      route.fulfill({
        json: [
          { id: "w", name: "Widget", price: 200, discountedPrice: 180 },
          { id: "f", name: "Flat", price: 50, discountedPrice: 50 },
          { id: "o", name: "Only", discountedPrice: 9.5 },
          { id: "p", name: "Plain" },
        ],
      }),
    );
    await page.goto(`${FRONTEND_URL}/`);
    const list = page.getByTestId("item-list");
    await expect(list).toHaveAttribute("data-count", "4");

    await test.step("discounted item with a different original price", async () => {
      const item = list.getByTestId("item").filter({ hasText: "Widget" });
      await expect.soft(item).toHaveText("Widget — $180.00 (was $200.00)");
      const discounted = item.getByTestId("item-discounted-price");
      const original = item.getByTestId("item-original-price");
      expect.soft(await discounted.textContent()).toBe(" — $180.00 (was $200.00)");
      await expect.soft(original).toHaveText("$200.00");
      expect.soft(await original.evaluate((el) => el.tagName)).toBe("S");
      await expect.soft(discounted).toHaveCSS("color", GREEN);
      await expect.soft(original).toHaveCSS("color", GREY);
      await expect.soft(original).toHaveCSS("text-decoration-line", "line-through");
    });

    await test.step("discounted price equal to the price", async () => {
      const item = list.getByTestId("item").filter({ hasText: "Flat" });
      await expect.soft(item).toHaveText("Flat — $50.00");
      await expect.soft(item.getByTestId("item-original-price")).toHaveCount(0);
    });

    await test.step("discounted price without a price", async () => {
      const item = list.getByTestId("item").filter({ hasText: "Only" });
      await expect.soft(item).toHaveText("Only — $9.50");
      await expect.soft(item.getByTestId("item-original-price")).toHaveCount(0);
    });

    await test.step("item without a price", async () => {
      const item = list.getByTestId("item").filter({ hasText: "Plain" });
      await expect.soft(item).toHaveText("Plain");
      await expect.soft(item.getByTestId("item-discounted-price")).toHaveCount(0);
    });
  });

  test("items without a numeric discounted price show only their name", async ({ page: rawPage }, testInfo) => {
    const page: Page = newSkyrampPlaywrightPage(rawPage, testInfo);
    let body: unknown = [
      { id: "a", name: "NoField" },
      { id: "b", name: "NullDisc", discountedPrice: null, price: 10 },
      { id: "c", name: "StrDisc", discountedPrice: "9.99", price: 10 },
      { id: "d", name: "Zero", discountedPrice: 0, price: 10 },
      { id: "e", name: "StrPrice", discountedPrice: 5, price: "10" },
    ];
    await page.route("**/api/items", (route) => route.fulfill({ json: body }));

    await test.step("list with odd discount values", async () => {
      await page.goto(`${FRONTEND_URL}/`);
      const list = page.getByTestId("item-list");
      await expect(list).toHaveAttribute("data-count", "5");
      for (const name of ["NoField", "NullDisc", "StrDisc"]) {
        const item = list.getByTestId("item").filter({ hasText: name });
        await expect.soft(item).toHaveText(name);
        await expect.soft(item.getByTestId("item-discounted-price")).toHaveCount(0);
        await expect.soft(item.getByTestId("item-original-price")).toHaveCount(0);
      }
      const zero = list.getByTestId("item").filter({ hasText: "Zero" });
      await expect.soft(zero).toHaveText("Zero — $0.00 (was $10.00)");
      const strPrice = list.getByTestId("item").filter({ hasText: "StrPrice" });
      await expect.soft(strPrice).toHaveText("StrPrice — $5.00");
      await expect.soft(strPrice.getByTestId("item-original-price")).toHaveCount(0);
    });

    await test.step("list wrapped in an items object", async () => {
      body = { items: [{ name: "Wrapped", price: 3, discountedPrice: 2.5 }] };
      await page.reload();
      const item = page.getByTestId("item-list").getByTestId("item").filter({ hasText: "Wrapped" });
      await expect.soft(item).toHaveText("Wrapped — $2.50 (was $3.00)");
      await expect.soft(item.getByTestId("item-original-price")).toHaveText("$3.00");
    });
  });
});
