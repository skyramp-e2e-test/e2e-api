'use strict';

// Removes the items tests/discounted-price.e2e.ts creates, for a run stopped before its own cleanup.
// Usage: node tests/skyramp-e2e/cleanup-discounted-price-items.js
const API_URL = (process.env.SKYRAMP_TEST_SERVICE_URL_E2E_API ?? 'http://localhost:3000').replace(/\/+$/, '');
const LABELS = [
  'Discounted Lamp', 'Equal Chair', 'Plain Desk', 'New Shelf', 'Struck Lamp', 'No Price', 'String Price',
  'Price Only', 'Null Discount', 'String Discount', 'Free Item', 'Fraction Item', 'Big Item', 'Wrapped Lamp',
  'Kept Lamp', 'Added Shelf', 'Styled Lamp', 'Plain Alpha', 'Plain Beta',
];
const pattern = new RegExp(`^(${LABELS.join('|')}) \\d+-\\d+$`);

async function main() {
  const items = await (await fetch(`${API_URL}/api/items`)).json();
  let removed = 0;
  for (const item of items) {
    if (typeof item.name === 'string' && pattern.test(item.name)) {
      await fetch(`${API_URL}/api/items/${item.id}`, { method: 'DELETE' });
      removed += 1;
    }
  }
  console.log(`removed ${removed} item(s)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
