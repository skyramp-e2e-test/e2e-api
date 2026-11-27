const { isEven } = require('../src/is-even');

test('even integers, including zero, negatives, -0 and a large safe integer, are reported even', () => {
  expect(isEven(0)).toBe(true);
  expect(isEven(2)).toBe(true);
  expect(isEven(-4)).toBe(true);
  expect(isEven(-0)).toBe(true);
  expect(isEven(Number.MAX_SAFE_INTEGER - 1)).toBe(true);
});

test('odd integers, including negatives, are reported not even', () => {
  expect(isEven(1)).toBe(false);
  expect(isEven(3)).toBe(false);
  expect(isEven(-1)).toBe(false);
  expect(isEven(-3)).toBe(false);
  expect(isEven(Number.MAX_SAFE_INTEGER)).toBe(false);
});

test('numbers that are not integers throw a TypeError, while 2.0 is even', () => {
  for (const v of [1.5, 2.5, NaN, Infinity, -Infinity]) {
    expect(() => isEven(v)).toThrow(TypeError);
  }
  expect(isEven(2.0)).toBe(true);
});

test('values that are not numbers throw a TypeError rather than being coerced', () => {
  for (const v of ['4', '', null, undefined, true, [2], {}, 4n]) {
    expect(() => isEven(v)).toThrow(TypeError);
  }
  expect(() => isEven()).toThrow(TypeError);
});
