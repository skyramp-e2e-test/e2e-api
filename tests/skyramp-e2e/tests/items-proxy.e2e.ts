// e2e-frontend's Express proxy for /api/items and /api/items/count, checked against e2e-api over HTTP.
import { test, expect } from "@playwright/test";
import { spawn, type ChildProcess } from "child_process";
import { existsSync } from "fs";
import path from "path";
import { API_URL, FRONTEND_URL, createItem, deleteItemsNamed, listItems, uniqueName } from "./items-app";

const FRONTEND_DIR = process.env.E2E_FRONTEND_DIR || path.resolve(__dirname, "../../../../e2e-frontend");

test.describe("items proxy", () => {
  const created: string[] = [];

  test.afterEach(async ({ request }) => {
    await deleteItemsNamed(request, created.splice(0));
  });

  test("GET /api/items/count is forwarded to the API unchanged", async ({ request }) => {
    const direct = await request.get(`${API_URL}/api/items/count`);
    const proxied = await request.get(`${FRONTEND_URL}/api/items/count`);
    expect(proxied.status()).toBe(direct.status());
    expect(proxied.headers()["content-type"]?.split(";")[0]).toBe(direct.headers()["content-type"]?.split(";")[0]);
    expect(await proxied.text()).toBe(await direct.text());
    const list = await request.get(`${API_URL}/api/items`);
    expect(await proxied.text()).not.toBe(await list.text());
  });

  test("the API answers GET /api/items/count with the number of items", async ({ request }) => {
    const name = uniqueName("count");
    created.push(name);
    await createItem(request, name);
    const total = (await listItems(request)).length;
    const res = await request.get(`${FRONTEND_URL}/api/items/count`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    const count = typeof body === "number" ? body : (body.count ?? body.total);
    expect(count).toBe(total);
  });

  test.describe("with the API unreachable", () => {
    let server: ChildProcess | undefined;
    const port = 8091;

    test.beforeAll(async () => {
      test.skip(!existsSync(path.join(FRONTEND_DIR, "server.js")), `e2e-frontend checkout not found at ${FRONTEND_DIR}`);
      server = spawn(process.execPath, ["server.js"], {
        cwd: FRONTEND_DIR,
        env: { ...process.env, PORT: String(port), API_BASE_URL: "http://127.0.0.1:9" },
        stdio: "ignore",
      });
      await expect
        .poll(
          async () => {
            try {
              return (await fetch(`http://localhost:${port}/healthz`)).status;
            } catch {
              return 0;
            }
          },
          { timeout: 10_000 },
        )
        .toBe(200);
    });

    test.afterAll(() => {
      server?.kill();
    });

    test("GET /api/items/count answers 502 with an error", async ({ request }) => {
      const res = await request.get(`http://localhost:${port}/api/items/count`);
      expect(res.status()).toBe(502);
      const body = await res.json();
      expect(body.error.startsWith("Could not reach API at http://127.0.0.1:9")).toBe(true);
    });
  });
});
