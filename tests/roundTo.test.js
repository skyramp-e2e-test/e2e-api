'use strict';

const { roundTo } = require('../src/roundTo');

describe('roundTo', () => {
  it('rounds half up to the requested decimals, including binary near-halves', () => {
    expect(roundTo(1.2345, 2)).toBe(1.23);
    expect(roundTo(1.005, 2)).toBe(1.01);
    expect(roundTo(10.235, 2)).toBe(10.24);
    expect(roundTo(1.255, 2)).toBe(1.26);
  });

  it('defaults decimals to 0 and rounds to an integer', () => {
    expect(roundTo(123.456)).toBe(123);
    expect(roundTo(2.5, 0)).toBe(3);
    expect(roundTo(2.4)).toBe(2);
  });

  it.each([['1.5'], [NaN], [null], [undefined]])('rejects non-number value %p', (value) => {
    expect(() => roundTo(value, 2)).toThrow(TypeError);
    expect(() => roundTo(value, 2)).toThrow('value must be a number');
  });

  it.each([[-1], [1.5], ['2']])('rejects invalid decimals %p', (decimals) => {
    expect(() => roundTo(1.5, decimals)).toThrow(RangeError);
    expect(() => roundTo(1.5, decimals)).toThrow('decimals must be a non-negative integer');
  });

  it('returns values already at the requested precision unchanged', () => {
    expect(roundTo(5, 2)).toBe(5);
    expect(roundTo(0, 2)).toBe(0);
    expect(roundTo(1.23, 2)).toBe(1.23);
  });
});
