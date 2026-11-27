'use strict';

const { sign } = require('../src/sign');

describe('sign', () => {
  test('returns 1 for positive numbers, including the smallest positive and Infinity', () => {
    expect(sign(5)).toBe(1);
    expect(sign(0.0001)).toBe(1);
    expect(sign(Number.MIN_VALUE)).toBe(1);
    expect(sign(Infinity)).toBe(1);
  });

  test('returns -1 for negative numbers, including -Number.MIN_VALUE and -Infinity', () => {
    expect(sign(-5)).toBe(-1);
    expect(sign(-Number.MIN_VALUE)).toBe(-1);
    expect(sign(-Infinity)).toBe(-1);
  });

  test('returns 0 for 0 and -0', () => {
    expect(sign(0) === 0).toBe(true);
    expect(sign(-0) === 0).toBe(true);
  });

  test('throws a TypeError for NaN', () => {
    expect(() => sign(NaN)).toThrow(TypeError);
  });

  test.each([
    ['numeric string', '5'],
    ['null', null],
    ['undefined', undefined],
    ['boolean', true],
    ['BigInt', 5n],
    ['Number object', new Number(5)],
    ['array', [1]],
  ])('throws a TypeError for a non-number value (%s)', (_label, value) => {
    expect(() => sign(value)).toThrow(TypeError);
  });
});
