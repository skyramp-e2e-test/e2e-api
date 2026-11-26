'use strict';

const { applyDiscount } = require('../src/discount');

describe('applyDiscount', () => {
  test('returns whole-cent results exactly and rounds non-tie results to the nearest cent', () => {
    expect(applyDiscount(100, 10)).toBe(90);
    expect(applyDiscount(3.3, 50)).toBe(1.65);
    expect(applyDiscount(19.99, 15)).toBe(16.99);
    expect(applyDiscount(9.99, 33)).toBe(6.69);
  });

  test('rounds exact half-cent results up to the higher cent (Pasted text AC1)', () => {
    expect(applyDiscount(4.35, 50)).toBe(2.18);
    expect(applyDiscount(3.3, 25)).toBe(2.48);
    expect(applyDiscount(3.3, 85)).toBe(0.5);
    expect(applyDiscount(0.15, 50)).toBe(0.08);
    expect(applyDiscount(10.05, 50)).toBe(5.03);
  });

  test('matches exactly rounded cents across a sweep of prices and percents (Pasted text AC1)', () => {
    const mismatches = [];
    for (let cents = 1; cents <= 20000; cents += 7) {
      for (let p = 0; p <= 100; p += 1) {
        const num = cents * (100 - p);
        const expected = Math.floor((2 * num + 100) / 200);
        if (num % 100 === 50 && expected % 2 === 1) continue;
        const got = Math.round(applyDiscount(cents / 100, p) * 100);
        if (got !== expected) mismatches.push([cents / 100, p, got, expected]);
      }
    }
    expect(mismatches).toEqual([]);
  });

  test('returns at most two decimal places', () => {
    expect(applyDiscount(9.99, 33)).toBe(6.69);
    expect(applyDiscount(0.01, 50)).toBe(0.01);
    for (const [price, pct] of [[9.99, 33], [19.99, 15], [0.07, 13], [123.45, 67]]) {
      const r = applyDiscount(price, pct);
      expect(Math.round(r * 100) / 100).toBe(r);
      expect(Math.abs(r * 100 - Math.round(r * 100))).toBeLessThan(1e-9);
    }
  });

  test('accepts the percent limits 0 and 100 and a zero price', () => {
    expect(applyDiscount(50, 0)).toBe(50);
    expect(applyDiscount(50, 100)).toBe(0);
    expect(applyDiscount(0, 50)).toBe(0);
  });

  test('refuses a negative, non-number, NaN or infinite price with a TypeError', () => {
    for (const price of [-1, '10', NaN, Infinity, null]) {
      expect(() => applyDiscount(price, 10)).toThrow(TypeError);
    }
    expect(applyDiscount(0, 10)).toBe(0);
  });

  test('refuses a percent outside 0..100, non-number or NaN with a RangeError', () => {
    for (const pct of [-0.01, 100.01, '10', NaN, undefined]) {
      expect(() => applyDiscount(10, pct)).toThrow(RangeError);
    }
    expect(applyDiscount(10, 100)).toBe(0);
    expect(applyDiscount(10, 0)).toBe(10);
  });
});
