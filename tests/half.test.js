const { half } = require('../src/half');
test('half of 10 is 5', () => { expect(half(10)).toBe(5); });
test('half of a positive odd number rounds up to the next integer', () => {
  expect(half(5)).toBe(3);
  expect(Number.isInteger(half(5))).toBe(true);
  expect(half(3)).toBe(2);
  expect(half(1)).toBe(1);
});
