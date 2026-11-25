const { clamp } = require('../src/clamp');

test('a value inside the range is returned unchanged', () => {
  expect(clamp(5, 1, 10)).toBe(5);
  expect(clamp(-3, -10, -1)).toBe(-3);
  expect(clamp(0.5, 0, 1)).toBe(0.5);
});

test('a value below min is returned as min', () => {
  expect(clamp(-5, 1, 10)).toBe(1);
  expect(clamp(0.99, 1, 10)).toBe(1);
  expect(clamp(-Infinity, 1, 10)).toBe(1);
});

test('a value above max is returned as max', () => {
  expect(clamp(15, 1, 10)).toBe(10);
  expect(clamp(10.01, 1, 10)).toBe(10);
  expect(clamp(Infinity, 1, 10)).toBe(10);
});

test('values exactly at the limits are returned as the limit', () => {
  expect(clamp(1, 1, 10)).toBe(1);
  expect(clamp(10, 1, 10)).toBe(10);
});

test('a degenerate range where min equals max always returns that bound', () => {
  expect(clamp(3, 7, 7)).toBe(7);
  expect(clamp(9, 7, 7)).toBe(7);
  expect(clamp(7, 7, 7)).toBe(7);
});
