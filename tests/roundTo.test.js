'use strict';

const { roundTo } = require('../src/roundTo');

describe('roundTo', () => {
  it('rounds a finite number to the given number of decimal places', () => {
    const cases = [
      [1.23456, 2, 1.23],
      [1.005, 2, 1.01],
      [2.675, 2, 2.68],
      [1.4999, 0, 1],
      [1.5, 0, 2],
      [123.456, 1, 123.5],
      [-1.234, 2, -1.23],
      [-1.236, 2, -1.24],
      [5, 3, 5],
      [0, 2, 0],
      [1.23456789, 8, 1.23456789],
    ];
    for (const [value, decimals, expected] of cases) {
      const result = roundTo(value, decimals);
      expect(Number.isFinite(result)).toBe(true);
      expect(result).toBe(expected);
    }
  });

  it.each([['1.5'], [NaN], [null], [undefined], [1n]])(
    'throws TypeError when value is %p',
    (value) => {
      let error;
      try {
        roundTo(value, 2);
      } catch (e) {
        error = e;
      }
      expect(error).toBeInstanceOf(TypeError);
      expect(error).not.toBeInstanceOf(RangeError);
      expect(error.message).toBe('value must be a number');
    },
  );

  it('throws when both value and decimals are invalid', () => {
    expect(() => roundTo(NaN, -1)).toThrow();
  });

  it.each([[-1], [1.5], ['2'], [NaN], [Infinity], [null]])(
    'throws RangeError when decimals is %p',
    (decimals) => {
      expect(() => roundTo(1.5, decimals)).toThrow(RangeError);
      expect(() => roundTo(1.5, decimals)).toThrow(
        'decimals must be a non-negative integer',
      );
    },
  );

  it('accepts 0 decimals', () => {
    expect(roundTo(1.5, 0)).toBe(2);
  });

  it.each([[309], [400]])(
    'does not return NaN for a very large decimals value (%p)',
    (decimals) => {
      let result;
      try {
        result = roundTo(1.5, decimals);
      } catch (e) {
        expect(e).toBeInstanceOf(RangeError);
        return;
      }
      expect(result).toBe(1.5);
    },
  );

  it.each([
    [1e300, 9],
    [Number.MAX_VALUE, 1],
  ])('keeps a large finite value %p finite with %p decimals', (value, decimals) => {
    expect(roundTo(value, decimals)).toBe(value);
  });

  it.each([
    [0.1, 16],
    [0.1, 20],
    [1.23, 16],
  ])(
    'returns %p unchanged when asked for more decimals (%p) than it has',
    (value, decimals) => {
      expect(roundTo(value, decimals)).toBe(value);
    },
  );
});
