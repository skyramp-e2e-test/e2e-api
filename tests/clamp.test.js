const { clamp } = require('../src/clamp');

test('clamp returns a value inside the range unchanged', () => {
  expect(clamp(5, 0, 10)).toBe(5);
  expect(clamp(-5, -10, -1)).toBe(-5);
  expect(clamp(2.5, 1.5, 3.5)).toBe(2.5);
});

test('clamp raises a value below min to min', () => {
  expect(clamp(-3, 0, 10)).toBe(0);
  expect(clamp(-Infinity, 0, 10)).toBe(0);
});

test('clamp lowers a value above max to max', () => {
  expect(clamp(15, 0, 10)).toBe(10);
  expect(clamp(Infinity, 0, 10)).toBe(10);
});

test('clamp keeps values on the bounds and pulls values just past them back', () => {
  expect(clamp(0, 0, 10)).toBe(0);
  expect(clamp(10, 0, 10)).toBe(10);
  expect(clamp(-1e-9, 0, 10)).toBe(0);
  expect(clamp(10.0000001, 0, 10)).toBe(10);
});

test('clamp returns the bound when min equals max', () => {
  expect(clamp(7, 4, 4)).toBe(4);
  expect(clamp(1, 4, 4)).toBe(4);
});

test('clamp module exports clamp as a function', () => {
  expect(typeof require('../src/clamp').clamp).toBe('function');
});
