const { clamp } = require('../src/clamp');

test('returns a value inside the range unchanged', () => {
  expect(clamp(5, 0, 10)).toBe(5);
  expect(clamp(-0.5, -1, 1)).toBe(-0.5);
});

test('raises a value below min to min', () => {
  expect(clamp(-3, 0, 10)).toBe(0);
  expect(clamp(-1.5, -1, 1)).toBe(-1);
});

test('lowers a value above max to max', () => {
  expect(clamp(15, 0, 10)).toBe(10);
  expect(clamp(10.0001, 0, 10)).toBe(10);
});

test('returns a value exactly at min or max as is', () => {
  expect(clamp(0, 0, 10)).toBe(0);
  expect(clamp(10, 0, 10)).toBe(10);
});

test('clamps every value to the single bound when min equals max', () => {
  expect(clamp(5, 5, 5)).toBe(5);
  expect(clamp(1, 5, 5)).toBe(5);
  expect(clamp(9, 5, 5)).toBe(5);
});
