'use strict';

const { applyDiscount } = require('../src/discount');

describe('applyDiscount', () => {
  test('rounds to cents, half-cents up (Pasted text AC1)', () => {
    expect(applyDiscount(10.05, 50)).toBe(5.03);
    expect(applyDiscount(1.005, 0)).toBe(1.01);
    expect(applyDiscount(9.99, 12.5)).toBe(8.74);
    expect(applyDiscount(99.99, 10)).toBe(89.99);
    expect(applyDiscount(0.01, 99)).toBe(0);
  });

  test('rounds half-cent results up consistently at larger prices (Pasted text AC1)', () => {
    expect(applyDiscount(20.15, 50)).toBe(10.08);
    expect(applyDiscount(4.015, 0)).toBe(4.02);
    expect(applyDiscount(5.015, 0)).toBe(5.02);
    expect(applyDiscount(10.075, 0)).toBe(10.08);
  });

  test.each([
    [50, 100.01],
    [50, 101],
    [50, 150],
    [0, 150],
    [50, Infinity],
  ])('discount over 100 percent never gives a negative price: (%p, %p)', (price, percent) => {
    let result;
    try {
      result = applyDiscount(price, percent);
    } catch (err) {
      expect(err).toBeInstanceOf(RangeError);
      return;
    }
    expect(result).toBe(0);
  });

  test('subtracts percent of price', () => {
    expect(applyDiscount(100, 20)).toBe(80);
    expect(applyDiscount(19.99, 15)).toBe(16.99);
    expect(applyDiscount(0, 50)).toBe(0);
    expect(applyDiscount(49.99, 0)).toBe(49.99);
  });

  test.each([[-1], [NaN], ['20'], [undefined]])('refuses invalid percent %p', (percent) => {
    expect(() => applyDiscount(50, percent)).toThrow(RangeError);
  });

  test.each([[-1], ['10'], [NaN], [Infinity]])('refuses invalid price %p', (price) => {
    expect(() => applyDiscount(price, 10)).toThrow(TypeError);
  });

  test('accepts a zero price', () => {
    expect(applyDiscount(0, 10)).toBe(0);
    expect(applyDiscount(-0, 10)).toBe(0);
  });

  test('accepts exactly 100 percent', () => {
    expect(applyDiscount(50, 100)).toBe(0);
    expect(applyDiscount(19.99, 100)).toBe(0);
  });
});
