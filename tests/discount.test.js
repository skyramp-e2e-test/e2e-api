'use strict';

const { applyDiscount, isValidPercent } = require('../src/discount');

const PRICE_MESSAGE = 'price must be a non-negative number';
const PERCENT_MESSAGE = 'percent must be a number between 0 and 100';

describe('applyDiscount', () => {
  it('returns the price minus the discount percentage', () => {
    expect(applyDiscount(200, 10)).toBe(180);
  });

  it('discounts other prices, including by a fractional percent', () => {
    expect(applyDiscount(50, 50)).toBe(25);
    expect(applyDiscount(80, 25)).toBe(60);
    expect(applyDiscount(80, 12.5)).toBe(70);
  });

  it('gives the same result when called twice with the same input', () => {
    expect(applyDiscount(200, 10)).toBe(180);
    expect(applyDiscount(200, 10)).toBe(180);
  });

  it('rounds the result to 2 decimal places', () => {
    expect(applyDiscount(9.99, 15)).toBe(8.49);
  });

  it('rounds other results to 2 decimal places', () => {
    expect(applyDiscount(10, 33.333)).toBe(6.67);
    expect(applyDiscount(19.99, 10)).toBe(17.99);
    expect(applyDiscount(1.005, 0)).toBe(1.01);
  });

  describe('boundaries', () => {
    it('accepts percent 0 and returns the price unchanged', () => {
      expect(applyDiscount(42.5, 0)).toBe(42.5);
    });

    it('accepts percent 100 and returns 0, not -0', () => {
      const result = applyDiscount(42.5, 100);
      expect(result).toBe(0);
      expect(Object.is(result, -0)).toBe(false);
    });

    it('accepts a price of 0', () => {
      expect(applyDiscount(0, 30)).toBe(0);
    });
  });

  describe('half-cent results round up', () => {
    it('rounds exact half-cent results up to the next cent', () => {
      expect(applyDiscount(5.25, 6)).toBe(4.94); // exact 4.935
      expect(applyDiscount(3.5, 39)).toBe(2.14); // exact 2.135
    });

    it('matches exact half-up rounding for every whole-cent price up to 200.00 and integer percent', () => {
      const mismatches = [];
      for (let cents = 0; cents <= 20000; cents += 1) {
        for (let percent = 0; percent <= 100; percent += 1) {
          // exact result in 1/100 of a cent, rounded half-up to a cent
          const expectedCents = Math.floor((cents * (100 - percent) + 50) / 100);
          const expected = expectedCents / 100;
          const actual = applyDiscount(cents / 100, percent);
          if (actual !== expected) {
            mismatches.push(`${cents / 100} at ${percent}%: got ${actual}, expected ${expected}`);
          }
        }
      }
      expect(mismatches.slice(0, 10)).toEqual([]);
      expect(mismatches).toHaveLength(0);
    });
  });

  it('throws when percent is above 100', () => {
    expect(() => applyDiscount(100, 150)).toThrow();
  });

  describe('invalid price', () => {
    it.each([
      ['-1', -1],
      ['-0.01', -0.01],
      ['NaN', NaN],
      ['Infinity', Infinity],
      ['-Infinity', -Infinity],
      ['the string "100"', '100'],
      ['null', null],
      ['undefined', undefined],
      ['an object', {}],
      ['true', true],
    ])('throws TypeError for a price of %s', (_label, price) => {
      expect(() => applyDiscount(price, 10)).toThrow(TypeError);
      expect(() => applyDiscount(price, 10)).toThrow(PRICE_MESSAGE);
    });

    it('checks the price before the percent', () => {
      expect(() => applyDiscount(-1, 150)).toThrow(TypeError);
      expect(() => applyDiscount(-1, 150)).toThrow(PRICE_MESSAGE);
    });
  });

  describe('invalid percent', () => {
    it.each([
      ['-0.01', -0.01],
      ['-1', -1],
      ['100.01', 100.01],
      ['150', 150],
      ['NaN', NaN],
      ['Infinity', Infinity],
      ['the string "10"', '10'],
      ['null', null],
      ['undefined', undefined],
      ['true', true],
    ])('throws RangeError for a percent of %s', (_label, percent) => {
      expect(() => applyDiscount(100, percent)).toThrow(RangeError);
      expect(() => applyDiscount(100, percent)).toThrow(PERCENT_MESSAGE);
    });
  });
});

describe('isValidPercent', () => {
  it.each([0, 100, 50.5])('returns true for %p', (value) => {
    expect(isValidPercent(value)).toBe(true);
  });

  it.each([-0.0001, 100.0001, NaN, Infinity, '50', null, undefined])(
    'returns false for %p',
    (value) => {
      expect(isValidPercent(value)).toBe(false);
    },
  );
});
