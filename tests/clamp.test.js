const { clamp } = require('../src/clamp');

test('returns a value inside the range unchanged', () => {
  expect(clamp(5, 0, 10)).toBe(5);
  expect(clamp(-5, -10, -1)).toBe(-5);
});

test('raises a value below min to min', () => {
  expect(clamp(-3, 0, 10)).toBe(0);
});

test('lowers a value above max to max', () => {
  expect(clamp(15, 0, 10)).toBe(10);
});

test('keeps values at the bounds and limits just past max', () => {
  expect(clamp(0, 0, 10)).toBe(0);
  expect(clamp(10, 0, 10)).toBe(10);
  expect(clamp(10.0001, 0, 10)).toBe(10);
});

test('swaps reversed bounds and clamps to [max, min]', () => {
  expect(clamp(15, 10, 0)).toBe(10);
  expect(clamp(-1, 10, 0)).toBe(0);
  expect(clamp(5, 10, 0)).toBe(5);
});

test('returns the bound when min equals max', () => {
  expect(clamp(7, 3, 3)).toBe(3);
  expect(clamp(-7, 3, 3)).toBe(3);
});
