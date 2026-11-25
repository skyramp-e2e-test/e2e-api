const { clamp } = require('../src/clamp');

test('clamp returns a value inside the range unchanged', () => {
  expect(clamp(5, 1, 10)).toBe(5);
});

test('clamp raises a value below min to min', () => {
  expect(clamp(-3, 1, 10)).toBe(1);
});

test('clamp lowers a value above max to max', () => {
  expect(clamp(42, 1, 10)).toBe(10);
});

test('clamp bounds are inclusive and values just past them are clamped', () => {
  expect(clamp(1, 1, 10)).toBe(1);
  expect(clamp(10, 1, 10)).toBe(10);
  expect(clamp(10.0001, 1, 10)).toBe(10);
  expect(clamp(0.9999, 1, 10)).toBe(1);
});

test('clamp returns the bound when min equals max', () => {
  expect(clamp(7, 3, 3)).toBe(3);
  expect(clamp(-1, 3, 3)).toBe(3);
});

test('clamp handles negative ranges, fractional and infinite values', () => {
  expect(clamp(-50, -20, -10)).toBe(-20);
  expect(clamp(0.5, 0.1, 0.3)).toBe(0.3);
  expect(clamp(Infinity, 0, 1)).toBe(1);
  expect(clamp(-Infinity, 0, 1)).toBe(0);
});

test('clamp module exports clamp as a named function', () => {
  const mod = require('../src/clamp');
  expect(typeof mod.clamp).toBe('function');
});
