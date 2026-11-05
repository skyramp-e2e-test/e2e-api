'use strict';

// Removes items whose name starts with the given prefix from the e2e API (cleanup for tests that add items).
// Usage: node scripts/delete-items-by-prefix.js "<prefix>"
const api = (process.env.SKYRAMP_TEST_SERVICE_URL_E2E_API || 'http://localhost:3000').replace(/\/+$/, '');
const prefix = process.argv[2];

async function main() {
  if (!prefix) {
    console.error('usage: delete-items-by-prefix.js <prefix>');
    process.exit(2);
  }
  const res = await fetch(`${api}/api/items`);
  const items = await res.json();
  let removed = 0;
  for (const item of items) {
    if (typeof item.name === 'string' && item.name.startsWith(prefix)) {
      const del = await fetch(`${api}/api/items/${encodeURIComponent(item.id)}`, { method: 'DELETE' });
      if (del.ok) removed += 1;
    }
  }
  console.log(`removed ${removed} item(s) starting with ${JSON.stringify(prefix)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
