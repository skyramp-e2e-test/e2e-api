const { half } = require('../src/half');

test('odd and fractional inputs are halved exactly, not rounded or truncated', () => {
  expect(half(7)).toBe(3.5);
  expect(half(2.5)).toBe(1.25);
  expect(half(Number.MAX_SAFE_INTEGER)).toBe(Number.MAX_SAFE_INTEGER / 2);
});

test('zero and negative inputs are halved with their sign kept', () => {
  expect(half(0)).toBe(0);
  expect(half(-8)).toBe(-4);
  expect(half(-3)).toBe(-1.5);
});
