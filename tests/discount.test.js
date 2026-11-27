'use strict';

const { applyDiscount } = require('../src/discount');

describe('applyDiscount', () => {
  // Pasted text AC1
  test('rounds discounted prices with more than two decimals to cents', () => {
    expect(applyDiscount(19.99, 15)).toBe(16.99);
    expect(applyDiscount(10, 33)).toBe(6.7);
    expect(applyDiscount(9.99, 33.333)).toBe(6.66);
    expect(applyDiscount(100, 10)).toBe(90);
  });

  // Pasted text AC1
  test('rounds half-cent results up and sub-half results down', () => {
    expect(applyDiscount(10.05, 50)).toBe(5.03);
    expect(applyDiscount(1.45, 50)).toBe(0.73);
    expect(applyDiscount(0.01, 50)).toBe(0.01);
    expect(applyDiscount(1.005, 0)).toBe(1.01);
    expect(applyDiscount(2.675, 0)).toBe(2.68);
    expect(applyDiscount(1.234, 0)).toBe(1.23);
    expect(applyDiscount(0.01, 51)).toBe(0);
  });

  test('leaves the price unchanged at 0 percent and keeps a zero price at zero', () => {
    expect(applyDiscount(50, 0)).toBe(50);
    expect(applyDiscount(0, 50)).toBe(0);
  });

  // Pasted text AC2
  test('accepts exactly 100 percent and just under it', () => {
    expect(applyDiscount(80, 100)).toBe(0);
    expect(applyDiscount(80, 99.999)).toBe(0);
  });

  // Pasted text AC2
  test.each([100.0001, 101, 150, 1e9, Infinity])('refuses a %p percent discount with RangeError', (p) => {
    expect(() => applyDiscount(80, p)).toThrow(RangeError);
  });

  test('refuses a percent over 100 on a zero price', () => {
    expect(() => applyDiscount(0, 150)).toThrow(RangeError);
  });

  test.each([[-5], ['10'], [NaN], [undefined]])('refuses invalid percent %p with RangeError', (p) => {
    expect(() => applyDiscount(80, p)).toThrow(RangeError);
  });

  test.each([[-1], ['100'], [NaN], [Infinity]])('refuses invalid price %p with TypeError', (price) => {
    expect(() => applyDiscount(price, 10)).toThrow(TypeError);
  });
});
