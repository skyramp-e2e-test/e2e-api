/* global fetch, process */
// Removes items left behind by tests/discounted-price.e2e.ts when it stops before its own cleanup.
const API_URL = (process.env.SKYRAMP_TEST_SERVICE_URL_E2E_API || "http://localhost:3000").replace(/\/+$/, "");
const made = /^(Disc Widget|Disc Flat|Disc Only|Plain Item) [a-z0-9]{8,}$/;
const items = await (await fetch(`${API_URL}/api/items`)).json();
for (const item of items.filter((i) => made.test(i.name ?? ""))) {
  await fetch(`${API_URL}/api/items/${item.id}`, { method: "DELETE" });
}
