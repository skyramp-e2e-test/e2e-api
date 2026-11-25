const { clamp } = require('../src/clamp');

test('returns value when within range', () => { expect(clamp(5, 0, 10)).toBe(5); });

test('returns a fractional value within range unchanged', () => {
  expect(clamp(2.5, 1.5, 3.5)).toBe(2.5);
});

test('raises a value below min to min', () => {
  expect(clamp(-5, 0, 10)).toBe(0);
  expect(clamp(-20, -10, -1)).toBe(-10);
  expect(clamp(-Infinity, 0, 10)).toBe(0);
});

test('lowers a value above max to max', () => {
  expect(clamp(15, 0, 10)).toBe(10);
  expect(clamp(5, -10, -1)).toBe(-1);
  expect(clamp(Infinity, 0, 10)).toBe(10);
});

test('treats the bounds as inclusive', () => {
  expect(clamp(0, 0, 10)).toBe(0);
  expect(clamp(10, 0, 10)).toBe(10);
  expect(clamp(-0.001, 0, 10)).toBe(0);
  expect(clamp(10.001, 0, 10)).toBe(10);
  expect(clamp(7, 3, 3)).toBe(3);
});
