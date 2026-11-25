const { clamp } = require('../src/clamp');

test('returns value when within range', () => { expect(clamp(5, 0, 10)).toBe(5); });

test('returns integer and fractional values inside the range unchanged', () => {
  expect(clamp(5, 0, 10)).toBe(5);
  expect(clamp(0.5, 0, 1)).toBe(0.5);
});

test('returns min for a value below the range', () => {
  expect(clamp(-3, 0, 10)).toBe(0);
  expect(clamp(-20, -10, -1)).toBe(-10);
});

test('returns max for a value above the range', () => {
  expect(clamp(15, 0, 10)).toBe(10);
  expect(clamp(Infinity, 0, 10)).toBe(10);
});

test('keeps values exactly at the bounds and pulls back values just past them', () => {
  expect(clamp(0, 0, 10)).toBe(0);
  expect(clamp(10, 0, 10)).toBe(10);
  expect(clamp(-0.0001, 0, 10)).toBe(0);
  expect(clamp(10.0001, 0, 10)).toBe(10);
});

test('returns the bound when min equals max', () => {
  expect(clamp(4, 5, 5)).toBe(5);
  expect(clamp(5, 5, 5)).toBe(5);
  expect(clamp(6, 5, 5)).toBe(5);
});
