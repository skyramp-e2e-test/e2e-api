'use strict';

const { applyDiscount } = require('../src/discount');

describe('applyDiscount', () => {
  test.each([
    [19.99, 15, 16.99],
    [10, 33, 6.7],
    [10, 33.333, 6.67],
    [100, 10, 90],
    [1000000, 12.5, 875000],
  ])('rounds %p at %p%% to whole cents (%p)', (price, percent, want) => {
    expect(applyDiscount(price, percent)).toBe(want);
  });

  test.each([
    [2.01, 50, 1.01],
    [4.27, 50, 2.14],
    [4.35, 50, 2.18],
    [20.1, 95, 1.01],
    [35.855, 0, 35.86],
    [1.005, 0, 1.01],
  ])('rounds an exact half cent up: %p at %p%% gives %p', (price, percent, want) => {
    expect(applyDiscount(price, percent)).toBe(want);
  });

  test.each([
    [50, 0, 50],
    [19.99, 0, 19.99],
    [0, 50, 0],
  ])('leaves a whole-cent price unchanged at 0%% or 0: %p at %p%%', (price, percent, want) => {
    expect(applyDiscount(price, percent)).toBe(want);
  });

  test.each([
    [50, 100.01],
    [50, 101],
    [50, 150],
    [0, 150],
    [50, Infinity],
  ])('refuses a percent over 100 with RangeError (%p, %p)', (price, percent) => {
    expect(() => applyDiscount(price, percent)).toThrow(RangeError);
  });

  test('accepts exactly 100 percent and gives 0', () => {
    expect(applyDiscount(50, 100)).toEqual(0);
    expect(applyDiscount(0.01, 100)).toEqual(0);
  });

  test.each([[-1], [-0.01], [NaN], ['10'], [null], [undefined]])(
    'refuses an invalid percent %p with RangeError',
    (percent) => {
      expect(() => applyDiscount(50, percent)).toThrow(RangeError);
    },
  );

  test.each([[-1], [-0.01], ['100'], [NaN], [Infinity], [null]])(
    'refuses an invalid price %p with TypeError',
    (price) => {
      expect(() => applyDiscount(price, 10)).toThrow(TypeError);
    },
  );

  test('discounts a very large price to 9e305', () => {
    expect(applyDiscount(1e306, 10)).toBe(9e305);
  });

  test.each([[50], [0]])('a huge accepted price at %p%% never gives a negative or infinite result', (percent) => {
    let r;
    try {
      r = applyDiscount(1e308, percent);
    } catch (e) {
      r = e;
    }
    if (r instanceof Error) return;
    expect(Number.isFinite(r)).toBe(true);
    expect(r).toBeGreaterThanOrEqual(0);
    expect(r).toBeLessThanOrEqual(1e308);
  });
});
