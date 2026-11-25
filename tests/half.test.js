const { half } = require('../src/half');
test('half of 10 is 5', () => { expect(half(10)).toBe(5); });
test('half of an odd positive integer rounds down to the integer below', () => {
  expect(half(7)).toBe(3);
  expect(half(3)).toBe(1);
  expect(half(1)).toBe(0);
});
test('half of 0 is 0', () => { expect(half(0)).toBe(0); });
test('half of -10 is -5', () => { expect(half(-10)).toBe(-5); });
