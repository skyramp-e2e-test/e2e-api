import { test, expect } from "@playwright/test";

// The e2e-frontend server, which serves public/index.html and public/app.js.
const FRONTEND = (process.env.SKYRAMP_TEST_SERVICE_URL_E2E_FRONTEND || "http://localhost:8080").replace(/\/+$/, "");
const MARKER = "<!-- UC-10.5 third branch -->";
const APP_TEST_IDS = ["app", "add-item-form", "item-name-input", "add-item-submit", "status", "empty-state", "item-list"];

async function expectItemsDocument(body: string) {
  for (const id of APP_TEST_IDS) {
    expect(body, `data-testid="${id}" present`).toContain(`data-testid="${id}"`);
  }
  expect(body).toContain('<script src="app.js"></script>');
  const htmlEnd = body.indexOf("</html>");
  expect(htmlEnd, "document closes with </html>").toBeGreaterThan(-1);
  expect(body.indexOf(MARKER), "marker comment comes after </html>").toBeGreaterThan(htmlEnd);
}

test.describe("frontend index document", () => {
  test("GET / serves the Items page HTML with the marker comment and app markup", async ({ request }) => {
    const res = await request.get(`${FRONTEND}/`);
    expect(res.status()).toBe(200);
    expect(res.headers()["content-type"]).toMatch(/^text\/html/);
    await expectItemsDocument(await res.text());
  });

  test("GET /index.html serves the same document as GET /", async ({ request }) => {
    const [root, index] = await Promise.all([request.get(`${FRONTEND}/`), request.get(`${FRONTEND}/index.html`)]);
    expect(index.status()).toBe(200);
    expect(index.headers()["content-type"]).toMatch(/^text\/html/);
    const body = await index.text();
    await expectItemsDocument(body);
    expect(body).toBe(await root.text());
  });

  test("GET /app.js serves the page script", async ({ request }) => {
    const res = await request.get(`${FRONTEND}/app.js`);
    expect(res.status()).toBe(200);
    expect(res.headers()["content-type"]).toMatch(/javascript/);
    expect(await res.text()).toContain("loadItems");
  });
});
