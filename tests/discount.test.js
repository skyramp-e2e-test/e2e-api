'use strict';

const { applyDiscount } = require('../src/discount');
const { roundTo } = require('../src/roundTo');

describe('applyDiscount rounding (Pasted text AC1)', () => {
  test('returns the discounted price rounded half-up to cents', () => {
    expect(applyDiscount(100, 10)).toBe(90);
    expect(applyDiscount(19.99, 15)).toBe(16.99);
    expect(applyDiscount(10, 33)).toBe(6.7);
    expect(applyDiscount(0.1, 50)).toBe(0.05);
    expect(applyDiscount(1.005, 0)).toBe(1.01);
    expect(applyDiscount(2.675, 0)).toBe(2.68);
    expect(applyDiscount(99.99, 33.333)).toBe(66.66);
  });

  test('never returns more than two decimals', () => {
    for (const [p, q] of [[10, 33], [99.99, 33.333], [19.99, 15], [7.77, 12.5]]) {
      const r = applyDiscount(p, q);
      expect(Math.round(r * 100) / 100).toBe(r);
    }
  });

  test('rounds the same way as roundTo at 2 decimals', () => {
    const inputs = [[1.005, 0], [2.675, 0], [19.99, 0], [0.125, 0], [10, 33], [99.99, 33.333]];
    for (const [p, q] of inputs) {
      expect(applyDiscount(p, q)).toBe(roundTo(p - (p * q) / 100, 2));
    }
  });
});

describe('applyDiscount percent bounds (Pasted text AC2)', () => {
  test.each([101, 150, 100.0001, Infinity])('refuses percent %p with a RangeError', (x) => {
    expect(() => applyDiscount(100, x)).toThrow(RangeError);
    expect(() => applyDiscount(100, x)).toThrow(/percent/);
  });

  test('accepts exactly 100 percent and gives a free item', () => {
    expect(applyDiscount(100, 100)).toBe(0);
    expect(applyDiscount(19.99, 100)).toBe(0);
  });
});

describe('applyDiscount input validation', () => {
  test.each([-1, NaN, Infinity, '100'])('refuses price %p with a TypeError', (p) => {
    expect(() => applyDiscount(p, 10)).toThrow(TypeError);
  });

  test('accepts a price of 0', () => {
    expect(applyDiscount(0, 50)).toBe(0);
  });

  test.each([-1, NaN, '10', undefined])('refuses percent %p with a RangeError', (q) => {
    expect(() => applyDiscount(100, q)).toThrow(RangeError);
  });

  test('leaves the price unchanged at 0 percent', () => {
    expect(applyDiscount(100, 0)).toBe(100);
    expect(applyDiscount(19.99, 0)).toBe(19.99);
  });
});
