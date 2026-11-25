const { half } = require('../src/half');
test('half of 10 is 5', () => { expect(half(10)).toBe(5); });

test('half of an even number or 0 is exact', () => {
  expect(half(2)).toBe(1);
  expect(half(0)).toBe(0);
});

test('half of a positive odd number rounds the .5 down', () => {
  expect(half(5)).toBe(2);
  expect(half(3)).toBe(1);
  expect(half(1)).toBe(0);
});

test('half of an integer is always an integer', () => {
  for (const n of [1, 3, 5, 7, 10, Number.MAX_SAFE_INTEGER]) {
    expect(Number.isInteger(half(n))).toBe(true);
  }
  expect(half(Number.MAX_SAFE_INTEGER)).toBe(4503599627370495);
});
