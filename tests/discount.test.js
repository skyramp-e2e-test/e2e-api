'use strict';

const { applyDiscount } = require('../src/discount');

describe('applyDiscount', () => {
  test('rounds a result with more than two decimals to the nearest cent (Pasted text AC1)', () => {
    expect(applyDiscount(19.99, 15)).toBe(16.99);
    expect(applyDiscount(10, 33)).toBe(6.7);
    expect(applyDiscount(99.99, 33.33)).toBe(66.66);
  });

  test('rounds an exact half cent up despite floating point (Pasted text AC1)', () => {
    expect(applyDiscount(1.005, 0)).toBe(1.01);
    expect(applyDiscount(2.675, 0)).toBe(2.68);
    expect(applyDiscount(0.015, 0)).toBe(0.02);
    expect(applyDiscount(0.01, 50)).toBe(0.01);
  });

  test('leaves a result already in whole cents unchanged', () => {
    expect(applyDiscount(100, 10)).toBe(90);
    expect(applyDiscount(50, 0)).toBe(50);
    expect(applyDiscount(0.1, 0)).toBe(0.1);
  });

  test('refuses a percent just over 100 (Pasted text AC2)', () => {
    expect(() => applyDiscount(50, 100.0001)).toThrow(RangeError);
  });

  test('refuses a percent far over 100 and Infinity (Pasted text AC2)', () => {
    expect(() => applyDiscount(50, 101)).toThrow(RangeError);
    expect(() => applyDiscount(50, 1000)).toThrow(RangeError);
    expect(() => applyDiscount(50, Infinity)).toThrow(RangeError);
  });

  test('accepts exactly 100 percent and gives zero (Pasted text AC2)', () => {
    expect(applyDiscount(50, 100)).toBe(0);
    expect(applyDiscount(0, 100)).toBe(0);
  });

  test('refuses a negative percent', () => {
    expect(() => applyDiscount(50, -1)).toThrow(RangeError);
    expect(() => applyDiscount(50, -0.0001)).toThrow(RangeError);
  });

  test('refuses a non-number or non-finite percent', () => {
    for (const p of [NaN, '10', null, undefined]) {
      expect(() => applyDiscount(50, p)).toThrow(RangeError);
    }
  });

  test('refuses a negative, non-finite or non-number price', () => {
    for (const p of [-1, NaN, Infinity, '100', null]) {
      expect(() => applyDiscount(p, 10)).toThrow(TypeError);
    }
  });

  test('accepts zero price and zero percent', () => {
    expect(applyDiscount(0, 0)).toBe(0);
    expect(applyDiscount(0, 50)).toBe(0);
    expect(applyDiscount(50, 0)).toBe(50);
  });
});
