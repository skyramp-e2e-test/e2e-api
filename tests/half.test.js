const { half } = require('../src/half');
test('half of 10 is 5', () => { expect(half(10)).toBe(5); });
test('half of 0 is 0', () => { expect(half(0)).toBe(0); });
test('half of an odd number rounds the exact .5 up', () => {
  expect(half(5)).toBe(3);
  expect(half(1)).toBe(1);
  expect(half(7)).toBe(4);
});
test('half that is not a tie rounds to the nearest integer', () => {
  expect(half(2.6)).toBe(1);
  expect(half(2.2)).toBe(1);
  expect(half(3.4)).toBe(2);
});
