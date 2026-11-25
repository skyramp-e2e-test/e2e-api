const { clamp } = require('../src/clamp');

test('returns a value inside the range unchanged', () => {
  expect(clamp(5, 0, 10)).toBe(5);
  expect(clamp(0.5, 0, 1)).toBe(0.5);
});

test('returns min for a value below min', () => {
  expect(clamp(-3, 0, 10)).toBe(0);
});

test('returns max for a value above max', () => {
  expect(clamp(15, 0, 10)).toBe(10);
});

test('returns the bound for a value at either bound and the single value when min equals max', () => {
  expect(clamp(0, 0, 10)).toBe(0);
  expect(clamp(10, 0, 10)).toBe(10);
  expect(clamp(3, 4, 4)).toBe(4);
});
