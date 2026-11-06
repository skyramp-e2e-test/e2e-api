'use strict';

// Removes items that tests/items-page.e2e.ts adds (named "Testbot items-page …"), for when a run stops before its own cleanup.
const API = (process.env.SKYRAMP_TEST_SERVICE_URL_E2E_API || 'http://localhost:3000').replace(/\/+$/, '');

async function main() {
  const items = await (await fetch(`${API}/api/items`)).json();
  for (const item of items.filter((i) => typeof i.name === 'string' && i.name.startsWith('Testbot items-page '))) {
    await fetch(`${API}/api/items/${item.id}`, { method: 'DELETE' });
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
