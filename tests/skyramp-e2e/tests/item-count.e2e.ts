// The "Total items: N" line on the e2e-frontend main page (e2e-frontend PR: show item count).
import { test, expect, type Page, type Route } from "@playwright/test";
import { ItemsPage, createItem, deleteItemsNamed, listItems, uniqueName } from "./items-app";

const COUNT_ROUTE = "**/api/items/count";
const ITEMS_ROUTE = "**/api/items";

function json(route: Route, status: number, body: unknown) {
  return route.fulfill({ status, contentType: "application/json", body: JSON.stringify(body) });
}

/** Stubs GET /api/items with a fixed list so these cases do not depend on the shared API's data. */
async function stubList(page: Page, items: Array<{ id: string; name: string }> = []) {
  await page.route(ITEMS_ROUTE, (route) =>
    route.request().method() === "GET" ? json(route, 200, items) : route.fallback(),
  );
}

test.describe("item count against the running API", () => {
  const created: string[] = [];

  test.afterEach(async ({ request }) => {
    await deleteItemsNamed(request, created.splice(0));
  });

  test("shows the API's item total above the list on page load", async ({ page, request }) => {
    for (const label of ["load-a", "load-b"]) {
      const name = uniqueName(label);
      created.push(name);
      await createItem(request, name);
    }
    const apiTotal = (await listItems(request)).length;
    const items = new ItemsPage(page);
    await items.open();
    await items.waitForListRendered();
    const listed = Number(await items.list.getAttribute("data-count"));
    expect(listed).toBe(apiTotal);
    await items.waitForCountSettled();
    await items.expectCountShown(listed);
  });

  test("count goes up by one after each item added through the form, without a reload", async ({ page }) => {
    const items = new ItemsPage(page);
    await items.open();
    await items.waitForListRendered();
    let navigations = 0;
    page.on("framenavigated", (frame) => {
      if (frame === page.mainFrame()) navigations += 1;
    });
    await expect(items.count).toHaveAttribute("data-state", "ok");
    const before = Number(await items.count.getAttribute("data-count"));
    for (const [i, label] of ["add-1", "add-2"].entries()) {
      const name = uniqueName(label);
      created.push(name);
      await items.add(name);
      await expect(items.status).toHaveText(`Added "${name}"`);
      await items.expectCountShown(before + i + 1);
    }
    expect(navigations).toBe(0);
  });
});

test.describe("item count with the count endpoint scripted", () => {
  test("count line sits above the item list", async ({ page }) => {
    await page.route(COUNT_ROUTE, (route) => json(route, 200, { count: 1 }));
    await stubList(page, [{ id: "1", name: "A" }]);
    const items = new ItemsPage(page);
    await items.open();
    await items.waitForListRendered();
    await expect(items.count).toBeVisible();
    const precedes = await page.evaluate(() => {
      const count = document.querySelector('[data-testid="item-count"]');
      const list = document.querySelector('[data-testid="item-list"]');
      return !!count && !!list && !!(count.compareDocumentPosition(list) & Node.DOCUMENT_POSITION_FOLLOWING);
    });
    expect(precedes).toBe(true);
    const countBox = await items.count.boundingBox();
    const listBox = await items.list.boundingBox();
    expect(countBox && listBox && countBox.y < listBox.y).toBe(true);
  });

  test("shows a placeholder until the count answers", async ({ page }) => {
    let release!: () => void;
    const held = new Promise<void>((resolve) => (release = resolve));
    await page.route(COUNT_ROUTE, async (route) => {
      await held;
      await json(route, 200, { count: 3 });
    });
    await stubList(page);
    const items = new ItemsPage(page);
    await items.open();
    await items.waitForListRendered();
    await expect(items.count).toHaveText("Total items: …");
    await expect(items.countValue).toHaveText("…");
    await expect(items.count).not.toHaveAttribute("data-state");
    await expect(items.count).not.toHaveAttribute("data-count");
    release();
    await items.expectCountShown(3);
  });

  test("count is fetched once on load and again after each successful add", async ({ page }) => {
    let countCalls = 0;
    let total = 5;
    await page.route(COUNT_ROUTE, (route) => {
      countCalls += 1;
      return json(route, 200, { count: total });
    });
    await page.route(ITEMS_ROUTE, (route) => {
      if (route.request().method() === "POST") {
        total += 1;
        return json(route, 201, { id: String(total), name: route.request().postDataJSON().name });
      }
      return json(route, 200, []);
    });
    const items = new ItemsPage(page);
    await items.open();
    await items.expectCountShown(5);
    expect(countCalls).toBe(1);
    await items.add("first");
    await expect(items.status).toHaveText('Added "first"');
    await items.expectCountShown(6);
    await expect.poll(() => countCalls).toBe(2);
    await items.add("second");
    await expect(items.status).toHaveText('Added "second"');
    await items.expectCountShown(7);
    await expect.poll(() => countCalls).toBe(3);
  });

  test("a failed add leaves the count as it was and does not refetch it", async ({ page }) => {
    let countCalls = 0;
    await page.route(COUNT_ROUTE, (route) => {
      countCalls += 1;
      return json(route, 200, { count: 4 });
    });
    await page.route(ITEMS_ROUTE, (route) =>
      route.request().method() === "POST" ? json(route, 400, { error: "boom" }) : json(route, 200, []),
    );
    const items = new ItemsPage(page);
    await items.open();
    await items.expectCountShown(4);
    await items.add("will-fail");
    await expect(items.status).toHaveText("Failed to add item: boom");
    await expect(items.status).toHaveAttribute("data-state", "error");
    await items.expectCountShown(4);
    expect(countCalls).toBe(1);
  });

  test("a 500 from the count endpoint shows unavailable", async ({ page }) => {
    await page.route(COUNT_ROUTE, (route) => json(route, 500, { error: "x" }));
    await stubList(page);
    const items = new ItemsPage(page);
    await items.open();
    await items.expectCountUnavailable();
  });

  test("an unreachable API (proxy 502) shows unavailable", async ({ page }) => {
    await page.route(COUNT_ROUTE, (route) =>
      json(route, 502, { error: "Could not reach API at http://127.0.0.1:9: fetch failed" }),
    );
    await stubList(page);
    const items = new ItemsPage(page);
    await items.open();
    await items.expectCountUnavailable();
  });

  const nonNumeric: Array<[string, string, string]> = [
    ["an empty object", "application/json", "{}"],
    ["a string count", "application/json", '{"count":"5"}'],
    ["null", "application/json", "null"],
    ["non-JSON text", "text/plain", "oops"],
  ];
  for (const [label, contentType, body] of nonNumeric) {
    test(`a 200 count answer shows unavailable for ${label}`, async ({ page }) => {
      await page.route(COUNT_ROUTE, (route) => route.fulfill({ status: 200, contentType, body }));
      await stubList(page);
      const items = new ItemsPage(page);
      await items.open();
      await items.expectCountUnavailable();
    });
  }

  test("a failing count does not break the item list or the status line", async ({ page }) => {
    await page.route(COUNT_ROUTE, (route) => json(route, 500, { error: "x" }));
    await stubList(page, [{ id: "1", name: "A" }]);
    const items = new ItemsPage(page);
    await items.open();
    await expect(items.items).toHaveCount(1);
    await expect(items.items).toHaveText(["A"]);
    await expect(items.status).toHaveText("");
    await expect(items.status).toHaveAttribute("data-state", "ok");
    await items.expectCountUnavailable();
  });

  test("a count that recovers after a failure replaces unavailable with the number", async ({ page }) => {
    let countCalls = 0;
    await page.route(COUNT_ROUTE, (route) => {
      countCalls += 1;
      return countCalls === 1 ? json(route, 500, { error: "x" }) : json(route, 200, { count: 1 });
    });
    await page.route(ITEMS_ROUTE, (route) =>
      route.request().method() === "POST"
        ? json(route, 201, { id: "1", name: "R" })
        : json(route, 200, countCalls > 1 ? [{ id: "1", name: "R" }] : []),
    );
    const items = new ItemsPage(page);
    await items.open();
    await items.expectCountUnavailable();
    await items.add("R");
    await expect(items.status).toHaveText('Added "R"');
    await items.expectCountShown(1);
  });

  const shapes: Array<[string, string, number]> = [
    ['{"count": n}', '{"count":7}', 7],
    ['{"total": n}', '{"total":9}', 9],
    ["a bare number", "12", 12],
    ['{"count": 0}', '{"count":0}', 0],
    ["a bare 0", "0", 0],
    ['{"total": 0}', '{"total":0}', 0],
    ['{"count": 0, "total": 5}, count wins', '{"count":0,"total":5}', 0],
  ];
  for (const [label, body, expected] of shapes) {
    test(`shows the count from ${label}`, async ({ page }) => {
      await page.route(COUNT_ROUTE, (route) => route.fulfill({ status: 200, contentType: "application/json", body }));
      await stubList(page);
      const items = new ItemsPage(page);
      await items.open();
      await items.expectCountShown(expected);
    });
  }
});
