// Discounted price on the items list of e2e-frontend (UC-12.3).
// GET /api/items is stubbed in the page to put priced fixtures ahead of the real items, because the API
// does not return price/discountedPrice yet; POST goes to the real API through the frontend's proxy.
import { test, expect, type Page, type Locator } from '@playwright/test';
import { newSkyrampPlaywrightPage } from '@skyramp/skyramp';

const UI_URL = (process.env.SKYRAMP_TEST_SERVICE_URL_UI || 'http://localhost:8080').replace(/\/+$/, '');
const API_URL = (process.env.SKYRAMP_TEST_SERVICE_URL_E2E_API || 'http://localhost:3000').replace(/\/+$/, '');
const ADDED_PREFIX = 'Walk Gadget e2e-';

type Fixture = Record<string, unknown>;

const LAMP = { id: 'fx-1', name: 'Discounted Lamp', price: 10, discountedPrice: 8 };
const MUG = { id: 'fx-2', name: 'Same Price Mug', price: 5, discountedPrice: 5 };
const PEN = { id: 'fx-3', name: 'No Original Pen', discountedPrice: 2.5 };
const CHAIR = { id: 'fx-4', name: 'Plain Chair' };
const DESK = { id: 'fx-5', name: 'String Price Desk', price: '20', discountedPrice: '15' };
const CUP = { id: 'fx-6', name: 'Bad Original Cup', price: 'abc', discountedPrice: 3 };
const TABLE = { id: 'fx-7', name: 'Priced Only Table', price: 12 };
const RUG = { id: 'fx-8', name: 'Null Discount Rug', price: 9, discountedPrice: null };
const HAT = { id: 'fx-9', name: 'Free Hat', price: 10, discountedPrice: 0 };
const BAG = { id: 'fx-10', name: 'Rounding Bag', price: 25, discountedPrice: 19.999 };
const SOCK = { id: 'fx-11', name: 'Half Sock', price: 8, discountedPrice: 7.5 };

/** Serve GET /api/items as [...fixtures, ...real items]; every other method reaches the real API. */
async function stubItemsWithFixtures(page: Page, fixtures: Fixture[]) {
  await page.route('**/api/items', async (route) => {
    if (route.request().method() !== 'GET') return route.fallback();
    const response = await route.fetch();
    const body = await response.json();
    const real = Array.isArray(body) ? body : (body.items ?? []);
    return route.fulfill({ response, json: [...fixtures, ...real] });
  });
}

async function openWithFixtures(rawPage: Page, testInfo: Parameters<typeof newSkyrampPlaywrightPage>[1], fixtures: Fixture[]) {
  await stubItemsWithFixtures(rawPage, fixtures);
  const page = newSkyrampPlaywrightPage(rawPage, testInfo) as Page;
  await page.goto(`${UI_URL}/`);
  await expect(page.getByTestId('item').filter({ hasText: fixtures[0].name as string })).toBeVisible();
  return page;
}

const itemNamed = (page: Page, name: string): Locator => page.getByTestId('item').filter({ hasText: name });

async function deleteAddedItems(name: string) {
  const res = await fetch(`${API_URL}/api/items`);
  const items = (await res.json()) as { id: string; name: string }[];
  for (const item of items.filter((i) => i.name === name)) {
    await fetch(`${API_URL}/api/items/${encodeURIComponent(item.id)}`, { method: 'DELETE' });
  }
}

test.describe('items list shows discounted prices (UC-12.3)', () => {
  test('discounted price follows the name with the different original price struck through', async ({ page: raw }, testInfo) => {
    const page = await openWithFixtures(raw, testInfo, [LAMP]);
    const lamp = itemNamed(page, 'Discounted Lamp');
    await expect(lamp).toHaveText('Discounted Lamp — $8.00 (was $10.00)');
    await expect(lamp.getByTestId('item-discounted-price')).toHaveText('— $8.00 (was $10.00)');
    const original = lamp.getByTestId('item-original-price');
    await expect(original).toHaveText('$10.00');
    expect(await original.evaluate((el) => el.tagName)).toBe('S');
  });

  test('only the discounted price is shown when it equals the price', async ({ page: raw }, testInfo) => {
    const page = await openWithFixtures(raw, testInfo, [MUG]);
    const mug = itemNamed(page, 'Same Price Mug');
    await expect(mug.getByTestId('item-discounted-price')).toHaveText('— $5.00');
    await expect(mug.getByTestId('item-original-price')).toHaveCount(0);
    await expect(mug).not.toContainText('(was');
  });

  test('discounted price without a numeric original price shows no struck-through price', async ({ page: raw }, testInfo) => {
    const page = await openWithFixtures(raw, testInfo, [PEN, CUP]);
    const pen = itemNamed(page, 'No Original Pen');
    await expect.soft(pen.getByTestId('item-discounted-price')).toHaveText('— $2.50');
    await expect.soft(pen.getByTestId('item-original-price')).toHaveCount(0);
    await expect.soft(pen).not.toContainText('(was');
    const cup = itemNamed(page, 'Bad Original Cup');
    await expect.soft(cup.getByTestId('item-discounted-price')).toHaveText('— $3.00');
    await expect.soft(cup.getByTestId('item-original-price')).toHaveCount(0);
    await expect.soft(cup).not.toContainText('(was');
  });

  test('item without a discounted price shows only its name, even with a price', async ({ page: raw }, testInfo) => {
    const page = await openWithFixtures(raw, testInfo, [CHAIR, TABLE]);
    for (const name of ['Plain Chair', 'Priced Only Table']) {
      const item = itemNamed(page, name);
      await expect.soft(item).toHaveText(name);
      await expect.soft(item.getByTestId('item-discounted-price')).toHaveCount(0);
      await expect.soft(item.getByTestId('item-original-price')).toHaveCount(0);
    }
  });

  test('non-numeric discounted price (string, null) shows no price and the list still renders', async ({ page: raw }, testInfo) => {
    const page = await openWithFixtures(raw, testInfo, [DESK, RUG, LAMP]);
    for (const name of ['String Price Desk', 'Null Discount Rug']) {
      const item = itemNamed(page, name);
      await expect.soft(item).toHaveText(name);
      await expect.soft(item.getByTestId('item-discounted-price')).toHaveCount(0);
    }
    await expect.soft(itemNamed(page, 'Discounted Lamp')).toHaveText('Discounted Lamp — $8.00 (was $10.00)');
    await expect.soft(page.getByTestId('status')).toHaveText('');
  });

  test('original price is struck through and the discounted price is green', async ({ page: raw }, testInfo) => {
    const page = await openWithFixtures(raw, testInfo, [LAMP]);
    const lamp = itemNamed(page, 'Discounted Lamp');
    const decoration = await lamp.getByTestId('item-original-price').evaluate((el) => getComputedStyle(el).textDecorationLine);
    expect.soft(decoration).toBe('line-through');
    const color = await lamp.getByTestId('item-discounted-price').evaluate((el) => getComputedStyle(el).color);
    expect.soft(color).toBe('rgb(10, 125, 50)');
  });

  test('prices use a dollar sign and two decimals, including zero and fractions', async ({ page: raw }, testInfo) => {
    const page = await openWithFixtures(raw, testInfo, [HAT, BAG, SOCK]);
    await expect.soft(itemNamed(page, 'Free Hat').getByTestId('item-discounted-price')).toHaveText('— $0.00 (was $10.00)');
    await expect.soft(itemNamed(page, 'Rounding Bag').getByTestId('item-discounted-price')).toContainText('— $20.00');
    await expect.soft(itemNamed(page, 'Half Sock').getByTestId('item-discounted-price')).toContainText('— $7.50');
  });
});

/** Create an item through the real API, sending the price fields the list displays. */
async function createItem(body: Record<string, unknown>): Promise<string> {
  const res = await fetch(`${API_URL}/api/items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  expect(res.status, `POST /api/items ${JSON.stringify(body)}`).toBe(201);
  return ((await res.json()) as { id: string }).id;
}

test('sees discounted prices in the item list, then adds an item', async ({ page: raw }, testInfo) => {
  // No stubs: the journey runs against the real frontend and API, with its priced items created through the API.
  const run = `${Date.now()}-${testInfo.workerIndex}`;
  const lampName = `Discounted Lamp e2e-${run}`;
  const mugName = `Same Price Mug e2e-${run}`;
  const penName = `No Original Pen e2e-${run}`;
  const chairName = `Plain Chair e2e-${run}`;
  const name = `${ADDED_PREFIX}${run}-journey`;
  const created: string[] = [];
  try {
    created.push(await createItem({ name: lampName, price: 10, discountedPrice: 8 }));
    created.push(await createItem({ name: mugName, price: 5, discountedPrice: 5 }));
    created.push(await createItem({ name: penName, discountedPrice: 2.5 }));
    created.push(await createItem({ name: chairName }));
    const page = newSkyrampPlaywrightPage(raw, testInfo) as Page;

    await test.step('1. open the items list and see the discounted prices', async () => {
      await page.goto(`${UI_URL}/`);
      await expect(itemNamed(page, chairName)).toHaveText(chairName);
      const lamp = itemNamed(page, lampName);
      await expect.soft(lamp).toHaveText(`${lampName} — $8.00 (was $10.00)`);
      await expect.soft(lamp.getByTestId('item-original-price')).toHaveText('$10.00');
      const mug = itemNamed(page, mugName);
      await expect.soft(mug.getByTestId('item-discounted-price')).toHaveText('— $5.00');
      await expect.soft(mug.getByTestId('item-original-price')).toHaveCount(0);
      const pen = itemNamed(page, penName);
      await expect.soft(pen.getByTestId('item-discounted-price')).toHaveText('— $2.50');
      await expect.soft(pen.getByTestId('item-original-price')).toHaveCount(0);
      await expect.soft(itemNamed(page, chairName).getByTestId('item-discounted-price')).toHaveCount(0);
    });

    await test.step('2. add an item through the form', async () => {
      await page.getByPlaceholder('Item name').fill(name);
      const post = page.waitForRequest((r) => r.url().endsWith('/api/items') && r.method() === 'POST');
      await page.getByRole('button', { name: 'Add' }).click();
      expect.soft((await post).postDataJSON()).toEqual({ name });
      await expect.soft(page.getByTestId('status')).toHaveText(`Added "${name}"`);
    });

    await test.step('3. look at the reloaded list', async () => {
      const added = itemNamed(page, name);
      await expect.soft(added).toHaveCount(1);
      await expect.soft(added).toHaveText(name);
      await expect.soft(added.getByTestId('item-discounted-price')).toHaveCount(0);
      await expect.soft(itemNamed(page, lampName)).toContainText('$8.00 (was $10.00)');
      const count = await page.getByTestId('item').count();
      await expect.soft(page.getByTestId('item-list')).toHaveAttribute('data-count', String(count));
    });

    await test.step('after a reload the added item and prices are still shown', async () => {
      await page.reload();
      await expect.soft(itemNamed(page, name)).toHaveText(name);
      await expect.soft(itemNamed(page, lampName)).toHaveText(`${lampName} — $8.00 (was $10.00)`);
    });
  } finally {
    await deleteAddedItems(name);
    for (const id of created) await fetch(`${API_URL}/api/items/${encodeURIComponent(id)}`, { method: 'DELETE' });
  }
});
