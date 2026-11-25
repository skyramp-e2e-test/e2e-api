const { percent } = require('../src/percent');

test('returns part as a percentage of a non-zero whole', () => {
  expect(percent(1, 4)).toBe(25);
  expect(percent(50, 200)).toBe(25);
  expect(percent(3, 3)).toBe(100);
  expect(percent(0, 5)).toBe(0);
  expect(percent(5, 4)).toBe(125);
  expect(percent(-1, 4)).toBe(-25);
});

test('refuses a whole of 0 with a RangeError', () => {
  expect(() => percent(1, 0)).toThrow(RangeError);
  expect(() => percent(0, 0)).toThrow(RangeError);
});
