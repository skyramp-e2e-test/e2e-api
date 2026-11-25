const { percent } = require('../src/percent');

test('returns part as a percentage of a non-zero whole', () => {
  expect(percent(1, 4)).toBe(25);
  expect(percent(50, 200)).toBe(25);
  expect(percent(5, 2)).toBe(250);
});

test('a part of 0 gives 0', () => {
  expect(percent(0, 5)).toBe(0);
});

test('a whole of 0 throws a RangeError', () => {
  expect(() => percent(3, 0)).toThrow(RangeError);
  expect(() => percent(0, 0)).toThrow(RangeError);
});
