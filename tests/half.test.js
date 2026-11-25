const { half } = require('../src/half');
test('half of 10 is 5', () => { expect(half(10)).toBe(5); });

test('half of zero and of a negative even number is exact', () => {
  // + 0 turns a -0 result into 0, so either zero passes
  expect(half(0) + 0).toBe(0);
  expect(half(-4)).toBe(-2);
});

test('half of an odd number ending in exactly .5 rounds up', () => {
  expect(half(1)).toBe(1);
  expect(half(3)).toBe(2);
  expect(half(5)).toBe(3);
});

test('half with a fractional part below .5 rounds down to the nearest integer', () => {
  expect(half(2.2)).toBe(1);
  expect(half(2.6)).toBe(1);
  expect(half(4.8)).toBe(2);
  expect(half(-3.4)).toBe(-2);
  expect(half(0.5) + 0).toBe(0);
});

test('half with a fractional part above .5 rounds up to the nearest integer', () => {
  expect(half(3.4)).toBe(2);
  expect(half(3.8)).toBe(2);
});
