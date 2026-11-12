const { clamp } = require('../src/clamp');

test('returns value when within range', () => { expect(clamp(5, 0, 10)).toBe(5); });
test('clamps value below min to min', () => { expect(clamp(-3, 0, 10)).toBe(0); });
test('clamps value above max to max', () => { expect(clamp(42, 0, 10)).toBe(10); });
test('returns bound when value equals it', () => { expect(clamp(10, 0, 10)).toBe(10); });
test('swaps min and max when min > max', () => {
  expect(clamp(42, 10, 0)).toBe(10);
  expect(clamp(-3, 10, 0)).toBe(0);
  expect(clamp(5, 10, 0)).toBe(5);
});
