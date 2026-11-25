const { half } = require('../src/half');
test('half of 10 is 5', () => { expect(half(10)).toBe(5); });
test('half of a positive odd number rounds the .5 up', () => {
  expect(half(5)).toBe(3);
  expect(half(1)).toBe(1);
  expect(half(7)).toBe(4);
});
test('half of a negative odd number rounds the .5 up toward +infinity', () => {
  expect(half(-5)).toBe(-2);
  expect(half(-3)).toBe(-1);
});
