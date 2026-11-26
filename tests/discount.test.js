const { applyDiscount } = require('../src/discount');

// Pasted text AC1: rounding to cents, half up
describe('applyDiscount rounding', () => {
  test('returns exact discounted prices that need no rounding', () => {
    expect(applyDiscount(100, 10)).toBe(90);
    expect(applyDiscount(10, 33)).toBe(6.7);
  });
  test('rounds to two decimals', () => {
    expect(applyDiscount(19.99, 15)).toBe(16.99);
    expect(applyDiscount(0.004, 0)).toBe(0);
  });
  test('rounds 0.625 half up to 0.63', () => {
    expect(applyDiscount(1.25, 50)).toBe(0.63);
  });
  test('rounds 0.135 half up to 0.14', () => {
    expect(applyDiscount(0.15, 10)).toBe(0.14);
  });
  test('rounds 1.005 half up to 1.01', () => {
    expect(applyDiscount(1.005, 0)).toBe(1.01);
  });
  test('rounds 2.675 half up to 2.68', () => {
    expect(applyDiscount(2.675, 0)).toBe(2.68);
  });
});

// Pasted text AC1: 100 percent limit and over-100 refusal
describe('applyDiscount percent limits', () => {
  test('accepts exactly 100 percent and returns 0', () => {
    expect(Object.is(applyDiscount(50, 100), 0)).toBe(true);
    expect(applyDiscount(19.99, 100)).toBe(0);
  });
  test.each([100.01, 101, 150, Infinity])('refuses percent %p over 100 with RangeError', (p) => {
    expect(() => applyDiscount(50, p)).toThrow(RangeError);
    expect(() => applyDiscount(50, p)).toThrow('percent must be a number between 0 and 100');
  });
});

describe('applyDiscount input validation', () => {
  test.each([-1, '100', NaN, Infinity])('refuses invalid price %p with TypeError', (x) => {
    expect(() => applyDiscount(x, 10)).toThrow(TypeError);
  });
  test('accepts a price of 0', () => {
    expect(applyDiscount(0, 10)).toBe(0);
  });
  test.each([-1, -0.01, '10', NaN, undefined])('refuses invalid percent %p with RangeError', (p) => {
    expect(() => applyDiscount(50, p)).toThrow(RangeError);
  });
  test('accepts 0 percent and returns the price unchanged', () => {
    expect(applyDiscount(50, 0)).toBe(50);
  });
});
