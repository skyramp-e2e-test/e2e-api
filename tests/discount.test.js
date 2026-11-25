'use strict';

const { applyDiscount } = require('../src/discount');

describe('applyDiscount', () => {
  test('reduces a valid price by the given percent', () => {
    expect(applyDiscount(100, 10)).toBe(90);
    expect(applyDiscount(19.99, 15)).toBe(16.99);
    expect(applyDiscount(80, 25)).toBe(60);
  });

  test('rounds the result to cents, half up', () => {
    expect(applyDiscount(10, 33.333)).toBe(6.67);
    expect(applyDiscount(1.005, 0)).toBe(1.01);
    expect(applyDiscount(9.99, 33)).toBe(6.69);
  });

  test('accepts percent 0 and 100 and price 0', () => {
    expect(applyDiscount(100, 0)).toBe(100);
    expect(applyDiscount(100, 100)).toBe(0);
    expect(applyDiscount(0, 50)).toBe(0);
  });

  test.each([-0.01, -1, '100', null, undefined, NaN, Infinity])(
    'refuses price %p with a TypeError',
    (price) => {
      expect(() => applyDiscount(price, 10)).toThrow(TypeError);
      expect(() => applyDiscount(price, 10)).toThrow('price must be a non-negative number');
    },
  );

  test.each([-0.01, 100.01, '10', undefined, NaN, Infinity])(
    'refuses percent %p with a RangeError',
    (percent) => {
      expect(() => applyDiscount(100, percent)).toThrow(RangeError);
      expect(() => applyDiscount(100, percent)).toThrow('percent must be a number between 0 and 100');
    },
  );

  test('a huge accepted price gives a finite result between 0 and the price, or is refused', () => {
    for (const [price, percent] of [[1e308, 50], [1e307, 100]]) {
      let result;
      let error;
      try {
        result = applyDiscount(price, percent);
      } catch (e) {
        error = e;
      }
      if (error === undefined) {
        expect(Number.isFinite(result)).toBe(true);
        expect(result).toBeGreaterThanOrEqual(0);
        expect(result).toBeLessThanOrEqual(price);
      }
    }
  });
});
