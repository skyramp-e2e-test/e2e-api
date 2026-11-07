const { half } = require('../src/half');
test('half of 10 is 5', () => { expect(half(10)).toBe(5); });

test('half of an odd integer or a fraction is the exact half, not rounded', () => {
  expect(half(3)).toBe(1.5);
  expect(half(2.5)).toBe(1.25);
});

test('half of zero is zero and half of a negative number stays negative', () => {
  expect(half(0)).toBe(0);
  expect(half(-8)).toBe(-4);
  expect(half(-3)).toBe(-1.5);
});
