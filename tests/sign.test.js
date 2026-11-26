'use strict';

const { sign } = require('../src/sign');

describe('sign', () => {
  it('returns 1 for positive numbers, including tiny fractions and Infinity', () => {
    expect(sign(5)).toBe(1);
    expect(sign(0.0001)).toBe(1);
    expect(sign(Number.MIN_VALUE)).toBe(1);
    expect(sign(Infinity)).toBe(1);
  });

  it('returns -1 for negative numbers, including tiny fractions and -Infinity', () => {
    expect(sign(-5)).toBe(-1);
    expect(sign(-Number.MIN_VALUE)).toBe(-1);
    expect(sign(-Infinity)).toBe(-1);
  });

  it('returns 0 for zero and negative zero', () => {
    expect(sign(0)).toBe(0);
    // Whether -0 or +0 comes back is not stated, so compare with === rather than toBe.
    expect(sign(-0) === 0).toBe(true);
  });

  it.each([
    ['a numeric string', '5'],
    ['null', null],
    ['undefined', undefined],
    ['a boolean', true],
    ['an object', {}],
    ['an array', []],
    ['a BigInt', 10n],
    ['a Number wrapper object', new Number(3)],
  ])('throws a TypeError for %s', (_label, value) => {
    expect(() => sign(value)).toThrow(TypeError);
  });

  it('throws a TypeError for NaN', () => {
    expect(() => sign(NaN)).toThrow(TypeError);
    expect(() => sign(0 / 0)).toThrow(TypeError);
  });
});
