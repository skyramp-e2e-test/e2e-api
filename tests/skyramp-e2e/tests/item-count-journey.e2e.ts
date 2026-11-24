// Journey: see how many items there are, add one, and see the total go up (e2e-frontend main page, real API).
import { test, expect } from "@playwright/test";
import { FRONTEND_URL, ItemsPage, deleteItemsNamed, uniqueName } from "./items-app";

test.describe("item count journey", () => {
  const created: string[] = [];

  test.afterEach(async ({ request }) => {
    await deleteItemsNamed(request, created.splice(0));
  });

  test("see the item total, add an item, and see the total go up", async ({ page }) => {
    const items = new ItemsPage(page);
    const name = uniqueName("journey");
    let listed = 0;

    await test.step("1. open the page and see the total above the list", async () => {
      await items.page.goto(`${FRONTEND_URL}/`);
      await expect(items.title).toHaveText("Items");
      await items.waitForListRendered();
      listed = Number(await items.list.getAttribute("data-count"));
      const countBox = await items.count.boundingBox();
      const listBox = await items.list.boundingBox();
      expect.soft(countBox && listBox && countBox.y <= listBox.y).toBe(true);
      await expect.soft(items.count).toHaveAttribute("data-state", "ok");
      await expect.soft(items.count).toHaveText(`Total items: ${listed}`);
      await expect.soft(items.count).toHaveAttribute("data-count", String(listed));
    });

    await test.step("2. add an item through the form", async () => {
      const posted = page.waitForRequest(
        (req) => req.method() === "POST" && new URL(req.url()).pathname === "/api/items",
      );
      created.push(name);
      await items.add(name);
      expect((await posted).postDataJSON()).toEqual({ name });
      await expect(items.status).toHaveText(`Added "${name}"`);
      await expect(items.items.filter({ hasText: name })).toHaveCount(1);
      await expect(items.list).toHaveAttribute("data-count", String(listed + 1));
    });

    await test.step("3. without reloading, the total goes up by one", async () => {
      await expect.soft(items.count).toHaveAttribute("data-state", "ok");
      await expect.soft(items.count).toHaveText(`Total items: ${listed + 1}`);
      await expect.soft(items.count).toHaveAttribute("data-count", String(listed + 1));
    });

    await test.step("4. after a reload the item and the total hold", async () => {
      await page.reload();
      await items.waitForListRendered();
      await expect(items.items.filter({ hasText: name })).toHaveCount(1);
      await expect(items.count).toHaveAttribute("data-state", "ok");
      await expect(items.count).toHaveText(`Total items: ${listed + 1}`);
      await expect(items.countValue).toHaveText(String(listed + 1));
    });
  });
});
