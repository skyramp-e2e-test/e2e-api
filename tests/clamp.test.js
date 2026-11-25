const { clamp } = require('../src/clamp');

test('returns value when within range', () => { expect(clamp(5, 0, 10)).toBe(5); });

test('returns an in-range value unchanged for negative ranges and fractions', () => {
  expect(clamp(5, 0, 10)).toBe(5);
  expect(clamp(-3, -5, -1)).toBe(-3);
  expect(clamp(0.5, 0, 1)).toBe(0.5);
});

test('returns min for a value below min', () => {
  expect(clamp(-1, 0, 10)).toBe(0);
  expect(clamp(-20, -10, -5)).toBe(-10);
  expect(clamp(-Infinity, 0, 10)).toBe(0);
});

test('returns max for a value above max', () => {
  expect(clamp(11, 0, 10)).toBe(10);
  expect(clamp(1e308, 0, 10)).toBe(10);
  expect(clamp(Infinity, 0, 10)).toBe(10);
});

test('treats both bounds as inclusive', () => {
  expect(clamp(0, 0, 10)).toBe(0);
  expect(clamp(10, 0, 10)).toBe(10);
});

test('returns the bound for a zero-width range', () => {
  expect(clamp(7, 7, 7)).toBe(7);
  expect(clamp(3, 7, 7)).toBe(7);
});
