const { clamp } = require('../src/clamp');

test('returns value when within range', () => { expect(clamp(5, 0, 10)).toBe(5); });

test('returns negative and fractional values inside the range unchanged', () => {
  expect(clamp(-3, -10, -1)).toBe(-3);
  expect(clamp(0.5, 0, 1)).toBe(0.5);
});

test('returns min for a value below the range', () => {
  expect(clamp(-5, 0, 10)).toBe(0);
  expect(clamp(-Infinity, 0, 10)).toBe(0);
});

test('returns max for a value above the range', () => {
  expect(clamp(15, 0, 10)).toBe(10);
  expect(clamp(10.0001, 0, 10)).toBe(10);
  expect(clamp(Infinity, 0, 10)).toBe(10);
});

test('includes both bounds in the range', () => {
  expect(clamp(0, 0, 10)).toBe(0);
  expect(clamp(10, 0, 10)).toBe(10);
});

test('returns the bound for a range where min equals max', () => {
  expect(clamp(3, 7, 7)).toBe(7);
  expect(clamp(7, 7, 7)).toBe(7);
  expect(clamp(9, 7, 7)).toBe(7);
});

test('treats bounds given in reverse order as the range [max, min]', () => {
  expect(clamp(5, 10, 0)).toBe(5);
  expect(clamp(15, 10, 0)).toBe(10);
  expect(clamp(-5, 10, 0)).toBe(0);
});
