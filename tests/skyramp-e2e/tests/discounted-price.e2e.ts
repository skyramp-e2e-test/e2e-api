// Items list in e2e-frontend: discounted price display (e2e-frontend public/app.js priceElement).
// e2e-api returns no price fields today, so the GET /api/items response the page receives is augmented
// in the browser (page.route) for the seeded items only; everything else comes from the running apps.
import { test, expect, type APIRequestContext, type Route } from "@playwright/test";
import { newSkyrampPlaywrightPage } from "@skyramp/skyramp";

const UI_URL = (
  process.env.SKYRAMP_TEST_SERVICE_URL_UI ??
  process.env.SKYRAMP_TEST_SERVICE_URL_E2E_FRONTEND ??
  "http://localhost:8080"
).replace(/\/+$/, "");
const API_URL = (process.env.SKYRAMP_TEST_SERVICE_URL_E2E_API ?? "http://localhost:3000").replace(/\/+$/, "");

type Item = { id: string | number; name: string; [k: string]: unknown };
type Extras = Record<string, unknown>;

let created: Item[] = [];
let createdNames: string[] = [];

const unique = (label: string) => `${label} ${Date.now()}-${Math.floor(Math.random() * 1e6)}`;

async function seedItem(request: APIRequestContext, name: string): Promise<Item> {
  const res = await request.post(`${API_URL}/api/items`, { data: { name } });
  expect(res.status(), `seeding ${name}`).toBe(201);
  const item = (await res.json()) as Item;
  created.push(item);
  return item;
}

/** GET /api/items through the frontend gets `extras` merged into the matching seeded items (by name). */
async function augmentItems(page: any, extras: Map<string, Extras>, { wrap = false } = {}) {
  await page.route("**/api/items", async (route: Route) => {
    if (route.request().method() !== "GET") return route.continue();
    const response = await route.fetch();
    const body = await response.json();
    const items: Item[] = Array.isArray(body) ? body : body.items;
    for (const it of items) {
      const extra = extras.get(it.name);
      if (extra) Object.assign(it, extra);
    }
    await route.fulfill({ response, json: wrap ? { items } : items });
  });
}

const itemRow = (page: any, name: string) => page.getByTestId("item").filter({ hasText: name });
const discounted = (page: any, name: string) => itemRow(page, name).getByTestId("item-discounted-price");
const original = (page: any, name: string) => itemRow(page, name).getByTestId("item-original-price");

async function openItems(page: any) {
  await page.goto(`${UI_URL}/`);
  await expect(page.getByTestId("status")).not.toHaveText("Loading…");
}

test.beforeEach(({}, testInfo) => {
  created = [];
  createdNames = [];
  testInfo.setTimeout(30_000);
});

test.afterEach(async ({ request }) => {
  const ids = new Set(created.map((i) => String(i.id)));
  if (createdNames.length) {
    const all = (await (await request.get(`${API_URL}/api/items`)).json()) as Item[];
    for (const it of all) if (createdNames.includes(it.name)) ids.add(String(it.id));
  }
  for (const id of ids) await request.delete(`${API_URL}/api/items/${id}`);
});

test.describe("items list: discounted price", () => {
  test("user sees discounted prices in the items list, then adds an item", async ({ page: rawPage, request }) => {
    const page = newSkyrampPlaywrightPage(rawPage);
    const lamp = await seedItem(request, unique("Discounted Lamp"));
    const chair = await seedItem(request, unique("Equal Chair"));
    const desk = await seedItem(request, unique("Plain Desk"));
    const shelf = unique("New Shelf");
    createdNames.push(shelf);
    // Runs against the real apps, unstubbed: the prices come from whatever e2e-api returns.
    test.setTimeout(90_000);

    await test.step("1. open the items list", async () => {
      await openItems(page);
      await expect.soft(itemRow(page, lamp.name)).toHaveText(`${lamp.name} — $8.00 (was $10.00)`);
      await expect.soft(original(page, lamp.name)).toHaveText("$10.00");
      await expect.soft(original(page, lamp.name)).toHaveJSProperty("tagName", "S");
      await expect.soft(original(page, lamp.name)).toHaveCSS("text-decoration-line", /line-through/);
      await expect.soft(discounted(page, chair.name)).toHaveText(" — $10.00");
      await expect.soft(original(page, chair.name)).toHaveCount(0);
      await expect.soft(itemRow(page, desk.name)).toHaveText(desk.name);
      await expect.soft(discounted(page, desk.name)).toHaveCount(0);
    });

    await test.step("2. add an item and see the reloaded list", async () => {
      await page.getByTestId("item-name-input").fill(shelf);
      const post = page.waitForRequest((r: any) => r.url().endsWith("/api/items") && r.method() === "POST");
      await page.getByTestId("add-item-submit").click();
      expect.soft((await post).postDataJSON()).toEqual({ name: shelf });
      await expect.soft(page.getByTestId("status")).toHaveText(`Added "${shelf}"`);
      await expect.soft(itemRow(page, shelf)).toHaveCount(1);
      await expect.soft(itemRow(page, shelf)).toHaveText(shelf);
      await expect.soft(discounted(page, shelf)).toHaveCount(0);
      await expect.soft(itemRow(page, lamp.name)).toHaveText(`${lamp.name} — $8.00 (was $10.00)`);
      await expect.soft(discounted(page, chair.name)).toHaveText(" — $10.00");
    });
  });

  test("shows the discounted price after the name with the different original price struck through", async ({ page: rawPage, request }) => {
    const page = newSkyrampPlaywrightPage(rawPage);
    const item = await seedItem(request, unique("Struck Lamp"));
    await augmentItems(page, new Map([[item.name, { price: 10, discountedPrice: 8 }]]));
    await openItems(page);
    await expect(itemRow(page, item.name)).toHaveText(`${item.name} — $8.00 (was $10.00)`);
    expect(await itemRow(page, item.name).evaluate((el: Element) => el.firstChild?.textContent)).toBe(item.name);
    await expect(discounted(page, item.name)).toHaveText(" — $8.00 (was $10.00)");
    await expect(original(page, item.name)).toHaveText("$10.00");
    expect(await original(page, item.name).evaluate((el: Element) => el.tagName)).toBe("S");
  });

  test("shows no struck original when price equals the discounted price", async ({ page: rawPage, request }) => {
    const page = newSkyrampPlaywrightPage(rawPage);
    const item = await seedItem(request, unique("Equal Chair"));
    await augmentItems(page, new Map([[item.name, { price: 10, discountedPrice: 10 }]]));
    await openItems(page);
    await expect(discounted(page, item.name)).toHaveText(" — $10.00");
    await expect(original(page, item.name)).toHaveCount(0);
  });

  test("shows only the discounted price when price is missing or not a number", async ({ page: rawPage, request }) => {
    const page = newSkyrampPlaywrightPage(rawPage);
    const noPrice = await seedItem(request, unique("No Price"));
    const stringPrice = await seedItem(request, unique("String Price"));
    await augmentItems(
      page,
      new Map<string, Extras>([
        [noPrice.name, { discountedPrice: 7.5 }],
        [stringPrice.name, { discountedPrice: 7.5, price: "10" }],
      ]),
    );
    await openItems(page);
    for (const it of [noPrice, stringPrice]) {
      await expect.soft(discounted(page, it.name), it.name).toHaveText(" — $7.50");
      await expect.soft(original(page, it.name), it.name).toHaveCount(0);
    }
  });

  test("shows no price when discountedPrice is absent, null or a string", async ({ page: rawPage, request }) => {
    const page = newSkyrampPlaywrightPage(rawPage);
    const priceOnly = await seedItem(request, unique("Price Only"));
    const nullDiscount = await seedItem(request, unique("Null Discount"));
    const stringDiscount = await seedItem(request, unique("String Discount"));
    await augmentItems(
      page,
      new Map<string, Extras>([
        [priceOnly.name, { price: 10 }],
        [nullDiscount.name, { discountedPrice: null, price: 10 }],
        [stringDiscount.name, { discountedPrice: "8", price: 10 }],
      ]),
    );
    await openItems(page);
    for (const it of [priceOnly, nullDiscount, stringDiscount]) {
      expect.soft(await itemRow(page, it.name).evaluate((el: Element) => el.textContent), it.name).toBe(it.name);
      await expect.soft(discounted(page, it.name), it.name).toHaveCount(0);
      await expect.soft(original(page, it.name), it.name).toHaveCount(0);
    }
  });

  test("formats prices as dollars with two decimals, zero included", async ({ page: rawPage, request }) => {
    const page = newSkyrampPlaywrightPage(rawPage);
    const zero = await seedItem(request, unique("Free Item"));
    const fraction = await seedItem(request, unique("Fraction Item"));
    const big = await seedItem(request, unique("Big Item"));
    await augmentItems(
      page,
      new Map<string, Extras>([
        [zero.name, { discountedPrice: 0, price: 5 }],
        [fraction.name, { discountedPrice: 9.5, price: 12.25 }],
        [big.name, { discountedPrice: 1234.5 }],
      ]),
    );
    await openItems(page);
    const text = (name: string) => discounted(page, name).evaluate((el: Element) => el.textContent);
    expect.soft(await text(zero.name)).toBe(" — $0.00 (was $5.00)");
    expect.soft(await text(fraction.name)).toBe(" — $9.50 (was $12.25)");
    expect.soft(await text(big.name)).toBe(" — $1234.50");
  });

  test("shows the discounted price when the API wraps items as { items: [...] }", async ({ page: rawPage, request }) => {
    const page = newSkyrampPlaywrightPage(rawPage);
    const item = await seedItem(request, unique("Wrapped Lamp"));
    await augmentItems(page, new Map([[item.name, { price: 10, discountedPrice: 8 }]]), { wrap: true });
    await openItems(page);
    await expect(discounted(page, item.name)).toHaveText(" — $8.00 (was $10.00)");
    await expect(original(page, item.name)).toHaveText("$10.00");
    expect(await original(page, item.name).evaluate((el: Element) => el.tagName)).toBe("S");
  });

  test("keeps discounted prices after adding an item, and the new item shows only its name", async ({ page: rawPage, request }) => {
    const page = newSkyrampPlaywrightPage(rawPage);
    const item = await seedItem(request, unique("Kept Lamp"));
    const added = unique("Added Shelf");
    createdNames.push(added);
    await augmentItems(page, new Map([[item.name, { price: 10, discountedPrice: 8 }]]));
    await openItems(page);
    const list = page.getByTestId("item-list");
    const before = Number(await list.getAttribute("data-count"));

    await page.getByTestId("item-name-input").fill(added);
    const post = page.waitForRequest((r: any) => r.url().endsWith("/api/items") && r.method() === "POST");
    await page.getByTestId("add-item-submit").click();
    expect((await post).postDataJSON()).toEqual({ name: added });

    await expect(page.getByTestId("status")).toHaveText(`Added "${added}"`);
    await expect.soft(list).toHaveAttribute("data-count", String(before + 1));
    await expect.soft(discounted(page, item.name)).toHaveText(" — $8.00 (was $10.00)");
    expect.soft(await itemRow(page, added).evaluate((el: Element) => el.textContent)).toBe(added);
  });

  test("styles the discounted price green and the original price grey and struck through", async ({ page: rawPage, request }) => {
    const page = newSkyrampPlaywrightPage(rawPage);
    const item = await seedItem(request, unique("Styled Lamp"));
    await augmentItems(page, new Map([[item.name, { price: 10, discountedPrice: 8 }]]));
    await openItems(page);
    await expect(original(page, item.name)).toHaveCount(1);
    const style = (loc: any) =>
      loc.evaluate((el: Element) => {
        const s = getComputedStyle(el);
        return { color: s.color, line: s.textDecorationLine };
      });
    expect.soft((await style(discounted(page, item.name))).color).toBe("rgb(10, 125, 50)");
    const orig = await style(original(page, item.name));
    expect.soft(orig.color).toBe("rgb(119, 119, 119)");
    expect.soft(orig.line).toContain("line-through");
  });
});
