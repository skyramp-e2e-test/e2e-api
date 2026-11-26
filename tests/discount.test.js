'use strict';

const { applyDiscount } = require('../src/discount');

describe('applyDiscount', () => {
  test('rounds the discounted price half-up to cents (Pasted text AC1)', () => {
    expect(applyDiscount(100, 10)).toBe(90);
    expect(applyDiscount(19.99, 15)).toBe(16.99);
    expect(applyDiscount(10, 33.333)).toBe(6.67);
    expect(Number.isInteger(applyDiscount(10, 33.333) * 100)).toBe(true);
    expect(applyDiscount(99.99, 12.5)).toBe(87.49);
    expect(applyDiscount(0.1, 50)).toBe(0.05);
  });

  test('rounds float-representation edge values half-up', () => {
    expect(applyDiscount(1.005, 0)).toBe(1.01);
    expect(applyDiscount(2.675, 0)).toBe(2.68);
  });

  test('accepts 0 and exactly 100 percent', () => {
    expect(() => applyDiscount(100, 100)).not.toThrow();
    expect(applyDiscount(100, 100)).toBe(0);
    expect(applyDiscount(100, 0)).toBe(100);
    expect(applyDiscount(0, 50)).toBe(0);
  });

  test('rejects a discount over 100 percent with RangeError (Pasted text AC1)', () => {
    expect(() => applyDiscount(100, 100.01)).toThrow(RangeError);
    expect(() => applyDiscount(100, 150)).toThrow(RangeError);
  });

  test.each([[-1], ['100'], [NaN], [Infinity], [null]])('rejects invalid price %p with TypeError', (price) => {
    expect(() => applyDiscount(price, 10)).toThrow(TypeError);
  });

  test('accepts a price of 0', () => {
    expect(applyDiscount(0, 10)).toBe(0);
  });

  test.each([[-1], ['10'], [NaN], [Infinity]])('rejects invalid percent %p with RangeError', (percent) => {
    expect(() => applyDiscount(100, percent)).toThrow(RangeError);
  });
});
