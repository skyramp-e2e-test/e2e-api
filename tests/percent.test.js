const { percent } = require('../src/percent');

test('returns part / whole * 100 for a non-zero whole', () => {
  expect(percent(1, 4)).toBe(25);
  expect(percent(5, 2)).toBe(250);
  expect(percent(-1, 4)).toBe(-25);
  expect(percent(1, 3)).toBeCloseTo(33.3333, 4);
});

test('refuses a whole of 0 with a RangeError', () => {
  expect(() => percent(1, 0)).toThrow(RangeError);
  expect(() => percent(0, 0)).toThrow(RangeError);
  expect(() => percent(1, -0)).toThrow(RangeError);
});

test('returns 0 for a part of 0 with a non-zero whole', () => {
  expect(percent(0, 4)).toBe(0);
});
