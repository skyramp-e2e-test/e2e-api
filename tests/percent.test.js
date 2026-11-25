const { percent } = require('../src/percent');

test('returns part as a percentage of a non-zero whole', () => {
  expect(percent(25, 200)).toBe(12.5);
  expect(percent(50, 50)).toBe(100);
  expect(percent(1, 3)).toBeCloseTo(33.333, 3);
});

test('refuses a whole of 0 with a RangeError', () => {
  expect(() => percent(5, 0)).toThrow(RangeError);
  expect(() => percent(0, 0)).toThrow(RangeError);
  expect(() => percent(5, -0)).toThrow(RangeError);
});

test('returns 0 for a part of 0 with a non-zero whole', () => {
  expect(percent(0, 10)).toBe(0);
});

test('does not cap results above 100 or below 0', () => {
  expect(percent(30, 20)).toBe(150);
  expect(percent(-5, 20)).toBe(-25);
});
