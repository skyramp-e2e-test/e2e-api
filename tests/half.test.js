const { half } = require('../src/half');
test('half of 10 is 5', () => { expect(half(10)).toBe(5); });
test('half of a positive odd integer rounds an exact .5 up', () => {
  expect(half(5)).toBe(3);
  expect(half(1)).toBe(1);
  expect(half(7)).toBe(4);
  expect(half(99)).toBe(50);
});
test('half of a negative odd integer rounds an exact -.5 up toward +infinity', () => {
  expect(half(-5)).toBe(-2);
  expect(half(-1) + 0).toBe(0);
});
test('half of a fraction that is not an exact .5 rounds to the nearest integer', () => {
  expect(half(2.2)).toBe(1);
  expect(half(0.6)).toBe(0);
  expect(half(2.6)).toBe(1);
  expect(half(3.4)).toBe(2);
});
