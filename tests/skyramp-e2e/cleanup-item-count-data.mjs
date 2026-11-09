// Removes items the item-count / items-proxy tests created (names starting skyramp-itemcount-) through the API.
// Exits 0 when there is nothing to remove.
/* global process, fetch, console */
const API_URL = (process.env.SKYRAMP_TEST_SERVICE_URL_E2E_API || "http://localhost:3000").replace(/\/+$/, "");
const PREFIX = "skyramp-itemcount-";

const res = await fetch(`${API_URL}/api/items`);
if (!res.ok) {
  console.error(`GET /api/items answered ${res.status}`);
  process.exit(1);
}
const items = await res.json();
let removed = 0;
for (const item of items) {
  if (typeof item?.name === "string" && item.name.startsWith(PREFIX)) {
    const del = await fetch(`${API_URL}/api/items/${encodeURIComponent(item.id)}`, { method: "DELETE" });
    if (del.ok || del.status === 404) removed += 1;
    else {
      console.error(`DELETE ${item.id} answered ${del.status}`);
      process.exit(1);
    }
  }
}
console.log(`removed ${removed} item(s)`);
