'use strict';

const { applyDiscount } = require('../src/discount');

describe('applyDiscount', () => {
  test('normal discounts are rounded to whole cents (Pasted text AC1)', () => {
    const cases = [
      [100, 10, 90],
      [19.99, 15, 16.99],
      [10, 33, 6.7],
      [0.03, 50, 0.02],
    ];
    for (const [price, percent, expected] of cases) {
      const r = applyDiscount(price, percent);
      expect(r).toBe(expected);
      expect(Math.round(r * 100) / 100).toBe(r);
    }
  });

  test('an exact half cent rounds up at small magnitudes (Pasted text AC1)', () => {
    expect(applyDiscount(1.005, 0)).toBe(1.01);
    expect(applyDiscount(1.255, 0)).toBe(1.26);
    expect(applyDiscount(0.25, 50)).toBe(0.13);
  });

  test('an exact half cent rounds up for a price above 10 as well (Pasted text AC1)', () => {
    expect(applyDiscount(10.075, 0)).toBe(10.08);
  });

  test('0% keeps the full price and 100% gives zero', () => {
    expect(applyDiscount(50, 0)).toBe(50);
    expect(applyDiscount(50, 100)).toBe(0);
    expect(applyDiscount(0, 50)).toBe(0);
  });

  test('a percent over 100 never yields a negative price (Pasted text AC2)', () => {
    for (const percent of [100.0001, 150]) {
      let result;
      let error;
      try {
        result = applyDiscount(50, percent);
      } catch (e) {
        error = e;
      }
      if (error) {
        expect(error).toBeInstanceOf(RangeError);
      } else {
        expect(result).toBe(0);
      }
    }
  });

  test('a negative or non-finite percent is refused with a RangeError', () => {
    for (const percent of [-1, NaN, Infinity, '10', null]) {
      expect(() => applyDiscount(50, percent)).toThrow(RangeError);
    }
    expect(() => applyDiscount(50)).toThrow(RangeError);
  });

  test('a negative, non-number or non-finite price is refused with a TypeError', () => {
    for (const price of [-1, '10', NaN, Infinity]) {
      expect(() => applyDiscount(price, 10)).toThrow(TypeError);
    }
  });
});
