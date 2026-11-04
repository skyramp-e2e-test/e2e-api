'use strict';

const { applyDiscount } = require('../src/discount');

describe('applyDiscount', () => {
  it('returns the price minus the discount percentage', () => {
    expect(applyDiscount(200, 10)).toBe(180);
  });

  it('rounds the result to 2 decimal places', () => {
    expect(applyDiscount(9.99, 15)).toBe(8.49);
  });

  it('throws when percent is above 100', () => {
    expect(() => applyDiscount(100, 150)).toThrow();
  });
});
