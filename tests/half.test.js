const { half } = require('../src/half');
test('half of 10 is 5', () => { expect(half(10)).toBe(5); });
test('half of zero and of a negative even number is exact', () => {
  expect(half(0)).toBe(0);
  expect(half(-10)).toBe(-5);
});
test('half of a positive odd number is rounded down', () => {
  expect(half(7)).toBe(3);
  expect(half(1)).toBe(0);
  expect(half(Number.MAX_SAFE_INTEGER)).toBe(4503599627370495);
});
test('half of a negative odd number is rounded down toward negative infinity', () => {
  expect(half(-7)).toBe(-4);
  expect(half(-1)).toBe(-1);
});
