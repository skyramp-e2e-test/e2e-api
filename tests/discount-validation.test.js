'use strict';

const { applyDiscount } = require('../src/discount');

describe('applyDiscount percent validation', () => {
  it('accepts the 0 and 100 percent bounds', () => {
    expect(applyDiscount(50, 0)).toBe(50);
    expect(applyDiscount(50, 100)).toBe(0);
  });

  it.each([
    ['150', 150],
    ['just above 100', 100.0001],
    ['-1', -1],
    ['just below 0', -0.0001],
    ['NaN', NaN],
    ['Infinity', Infinity],
    ['a numeric string', '10'],
    ['null', null],
    ['undefined', undefined],
  ])('rejects percent %s', (_label, percent) => {
    expect(() => applyDiscount(100, percent)).toThrow();
  });

  it('rejects a call without a percent', () => {
    expect(() => applyDiscount(100)).toThrow();
  });
});

describe('applyDiscount price validation', () => {
  it('accepts a zero price', () => {
    expect(applyDiscount(0, 10)).toBe(0);
  });

  it.each([
    ['-1', -1],
    ['-0.01', -0.01],
    ['NaN', NaN],
    ['Infinity', Infinity],
    ['a numeric string', '100'],
    ['null', null],
    ['undefined', undefined],
    ['a boolean', true],
    ['an array', []],
  ])('rejects price %s', (_label, price) => {
    expect(() => applyDiscount(price, 10)).toThrow();
  });
});

describe('applyDiscount on very large prices', () => {
  // A price the helper accepts must give a finite, non-negative result; rejecting it is also fine.
  it.each([
    [1e307, 0],
    [1e308, 50],
    [Number.MAX_VALUE, 10],
    [1.8e306, 100],
  ])('never returns a non-finite result for price %p at %p%%', (price, percent) => {
    let result;
    try {
      result = applyDiscount(price, percent);
    } catch {
      return; // rejecting the price is an accepted outcome
    }
    // Shows the returned value (e.g. Infinity) when it is not finite.
    expect(Number.isFinite(result) ? 'finite' : result).toBe('finite');
    expect(result).toBeGreaterThanOrEqual(0);
    if (percent === 100) expect(result).toBe(0);
    if (percent === 0) expect(result / price).toBeCloseTo(1, 10);
  });
});
