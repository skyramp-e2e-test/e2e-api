'use strict';

const { applyDiscount } = require('../src/discount');

describe('applyDiscount', () => {
  // Pasted text AC1
  it('rounds a result with more than two decimals to cents', () => {
    expect(applyDiscount(19.99, 15)).toBe(16.99);
    expect(applyDiscount(33.33, 33.33)).toBe(22.22);
  });

  it('rounds an exact half cent up, including binary-float halves', () => {
    expect(applyDiscount(0.03, 50)).toBe(0.02);
    expect(applyDiscount(1.005, 0)).toBe(1.01);
    expect(applyDiscount(2.675, 0)).toBe(2.68);
    expect(applyDiscount(0.125, 0)).toBe(0.13);
  });

  it('returns results already exact to the cent unchanged', () => {
    expect(applyDiscount(100, 10)).toBe(90);
    expect(applyDiscount(10, 12.5)).toBe(8.75);
    expect(applyDiscount(0.01, 50)).toBe(0.01);
  });

  // Pasted text AC2
  it('refuses a percent over 100', () => {
    expect(() => applyDiscount(50, 100.0001)).toThrow(RangeError);
    expect(() => applyDiscount(50, 150)).toThrow(RangeError);
    expect(() => applyDiscount(50, Infinity)).toThrow(RangeError);
  });

  it('accepts exactly 100 percent and returns positive zero', () => {
    expect(applyDiscount(50, 100)).toBe(0);
    expect(applyDiscount(0, 100)).toBe(0);
  });

  it('refuses a negative or non-numeric percent', () => {
    expect(() => applyDiscount(50, -1)).toThrow(RangeError);
    expect(() => applyDiscount(50, NaN)).toThrow(RangeError);
    expect(() => applyDiscount(50, '10')).toThrow(RangeError);
  });

  it('refuses an invalid price with TypeError', () => {
    expect(() => applyDiscount(-1, 10)).toThrow(TypeError);
    expect(() => applyDiscount(NaN, 10)).toThrow(TypeError);
    expect(() => applyDiscount('10', 10)).toThrow(TypeError);
    expect(() => applyDiscount(null, 10)).toThrow(TypeError);
  });

  it('accepts a zero price', () => {
    expect(applyDiscount(0, 50)).toBe(0);
  });

  it('returns a finite discounted price for a very large valid price', () => {
    expect(applyDiscount(1e307, 50)).toBe(5e306);
    expect(applyDiscount(1e308, 10)).toBe(9e307);
  });
});
