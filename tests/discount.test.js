'use strict';

const { applyDiscount } = require('../src/discount');

describe('applyDiscount', () => {
  // Pasted text AC1: discounted price rounded to cents, halves up.
  test('rounds the discounted price to cents', () => {
    const cases = [
      [100, 10, 90],
      [19.99, 15, 16.99],
      [10, 33, 6.7],
      [9.99, 50, 5],
      [1.005, 0, 1.01],
      [0.01, 50, 0.01],
    ];
    for (const [price, percent, expected] of cases) {
      const r = applyDiscount(price, percent);
      expect(r).toBe(expected);
      expect(Math.abs(r * 100 - Math.round(r * 100))).toBeLessThan(1e-9);
    }
  });

  // Pasted text AC1: an exact half cent rounds up for every input.
  test('rounds exact half-cent results up', () => {
    expect(applyDiscount(3.5, 33)).toBe(2.35);
    expect(applyDiscount(4.27, 50)).toBe(2.14);
    expect(applyDiscount(5.25, 10)).toBe(4.73);
    expect(applyDiscount(7.35, 10)).toBe(6.62);
  });

  // Pasted text AC1: a discount over 100 percent is refused.
  test.each([101, 150, 100.0001, Infinity])('refuses percent %p above 100', (p) => {
    expect(() => applyDiscount(100, p)).toThrow(RangeError);
  });

  test('accepts the 0 and 100 percent boundaries', () => {
    expect(applyDiscount(100, 100)).toBe(0);
    expect(applyDiscount(19.99, 100)).toBe(0);
    expect(applyDiscount(100, 0)).toBe(100);
    expect(applyDiscount(19.99, 0)).toBe(19.99);
  });

  test.each([-1, '10', NaN, Infinity, null])('refuses invalid price %p', (v) => {
    expect(() => applyDiscount(v, 10)).toThrow(TypeError);
  });

  test('accepts a price of 0', () => {
    expect(applyDiscount(0, 10)).toBe(0);
  });

  test.each([-1, -0.0001, NaN, '50', null])('refuses invalid percent %p', (v) => {
    expect(() => applyDiscount(100, v)).toThrow(RangeError);
  });

  test('refuses a missing percent', () => {
    expect(() => applyDiscount(100)).toThrow(RangeError);
  });
});
