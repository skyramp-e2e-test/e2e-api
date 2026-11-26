'use strict';

const { applyDiscount } = require('../src/discount');

describe('applyDiscount', () => {
  it('rounds the discounted price to whole cents', () => {
    expect(applyDiscount(19.99, 15)).toBe(16.99);
    expect(applyDiscount(10, 33)).toBe(6.7);
    expect(applyDiscount(100, 10)).toBe(90);
    expect(applyDiscount(33.33, 50)).toBe(16.67);
    for (let c = 1; c <= 5000; c += 1) {
      for (const p of [10, 15, 25, 33, 50, 75]) {
        const r = applyDiscount(c / 100, p);
        expect(Math.round(r * 100) / 100).toBe(r);
      }
    }
  });

  it('rounds exact half-cent results up whatever the price (Pasted text AC1)', () => {
    expect(applyDiscount(1.15, 10)).toBe(1.04);
    expect(applyDiscount(2.3, 75)).toBe(0.58);
    expect(applyDiscount(2.9, 25)).toBe(2.18);
    expect(applyDiscount(3.3, 25)).toBe(2.48);
    expect(applyDiscount(4.02, 25)).toBe(3.02);
  });

  it('refuses a percent above 100 (Pasted text AC2)', () => {
    for (const p of [100.0001, 101, 150, Infinity]) {
      expect(() => applyDiscount(100, p)).toThrow(RangeError);
      expect(() => applyDiscount(100, p)).toThrow(/0 and 100/);
    }
    expect(() => applyDiscount(0, 150)).toThrow(RangeError);
  });

  it('accepts exactly 100 percent as a free item', () => {
    expect(applyDiscount(100, 100)).toEqual(0);
    expect(applyDiscount(19.99, 100)).toEqual(0);
  });

  it('leaves the price unchanged at 0 percent and refuses a negative percent', () => {
    expect(applyDiscount(100, 0)).toBe(100);
    expect(() => applyDiscount(100, -1)).toThrow(RangeError);
  });

  it('refuses an invalid price', () => {
    for (const price of [-1, '100', NaN, Infinity]) {
      expect(() => applyDiscount(price, 10)).toThrow(TypeError);
    }
  });

  it('refuses a percent that is not a number rather than coercing it', () => {
    for (const p of ['50', NaN, null]) {
      expect(() => applyDiscount(100, p)).toThrow(RangeError);
    }
  });
});
