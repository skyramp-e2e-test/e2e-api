const { half } = require('../src/half');
test('half of 10 is 5', () => { expect(half(10)).toBe(5); });
test('odd positive integers round down to the integer below', () => {
  expect(half(7)).toBe(3);
  expect(half(1)).toBe(0);
  expect(half(9)).toBe(4);
  expect(Number.isInteger(half(7))).toBe(true);
});
