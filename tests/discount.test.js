'use strict';

const { applyDiscount } = require('../src/discount');

describe('applyDiscount', () => {
  test('subtracts the percent and rounds to whole cents (Pasted text AC1)', () => {
    expect(applyDiscount(100, 10)).toBe(90);
    expect(applyDiscount(19.99, 15)).toBe(16.99);
    expect(applyDiscount(10, 33.333)).toBe(6.67);
  });

  test('rounds half a cent up, including float-stored halves (Pasted text AC1)', () => {
    expect(applyDiscount(10.125, 0)).toBe(10.13);
    expect(applyDiscount(1.005, 0)).toBe(1.01);
    expect(applyDiscount(2.675, 0)).toBe(2.68);
    expect(applyDiscount(1.255, 0)).toBe(1.26);
    expect(applyDiscount(0.01, 50)).toBe(0.01);
  });

  test('refuses a percent over 100 (Pasted text AC2)', () => {
    expect(() => applyDiscount(50, 100.0001)).toThrow(RangeError);
    expect(() => applyDiscount(50, 101)).toThrow(RangeError);
    expect(() => applyDiscount(50, 150)).toThrow(RangeError);
  });

  test('accepts 100 percent as zero and 0 percent as unchanged (Pasted text AC2)', () => {
    expect(applyDiscount(50, 100)).toBe(0);
    expect(applyDiscount(50, 0)).toBe(50);
  });

  test('refuses a negative, non-finite or non-number percent', () => {
    expect(() => applyDiscount(50, -1)).toThrow(RangeError);
    expect(() => applyDiscount(50, NaN)).toThrow(RangeError);
    expect(() => applyDiscount(50, Infinity)).toThrow(RangeError);
    expect(() => applyDiscount(50, '10')).toThrow(RangeError);
  });

  test('refuses a negative, non-finite or non-number price and accepts 0', () => {
    expect(() => applyDiscount(-1, 10)).toThrow(TypeError);
    expect(() => applyDiscount('10', 10)).toThrow(TypeError);
    expect(() => applyDiscount(NaN, 10)).toThrow(TypeError);
    expect(applyDiscount(0, 10)).toBe(0);
  });
});
