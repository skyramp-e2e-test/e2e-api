const { half } = require('../src/half');
test('half of 10 is 5', () => { expect(half(10)).toBe(5); });
test('half of zero and of a negative even number are exact', () => {
  expect(half(0)).toBe(0);
  expect(half(-10)).toBe(-5);
});
test('half of a positive odd number rounds down', () => {
  expect(half(5)).toBe(2);
  expect(half(1)).toBe(0);
  expect(half(3)).toBe(1);
});
test('half of a negative odd number rounds toward negative infinity', () => {
  expect(half(-5)).toBe(-3);
  expect(half(-1)).toBe(-1);
  expect(half(-3)).toBe(-2);
});
