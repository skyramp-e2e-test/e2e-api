const { clamp } = require('../src/clamp');

test('returns the lower bound when value equals min', () => {
  expect(clamp(0, 0, 10)).toBe(0);
  expect(clamp(-1, -1, 5)).toBe(-1);
});
test('swaps negative reversed bounds', () => {
  expect(clamp(-20, -1, -10)).toBe(-10);
  expect(clamp(0, -1, -10)).toBe(-1);
});
test('returns the single bound when min equals max', () => {
  expect(clamp(7, 3, 3)).toBe(3);
  expect(clamp(1, 3, 3)).toBe(3);
  expect(clamp(3, 3, 3)).toBe(3);
});
