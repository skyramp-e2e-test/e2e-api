'use strict';

const { clamp } = require('../src/clamp');

describe('clamp', () => {
  test('returns a value inside the range unchanged', () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-2.5, -5, 5)).toBe(-2.5);
  });

  test('returns min for a value below min', () => {
    expect(clamp(-1, 0, 10)).toBe(0);
    expect(clamp(-Infinity, 0, 10)).toBe(0);
  });

  test('returns max for a value above max', () => {
    expect(clamp(11, 0, 10)).toBe(10);
    expect(clamp(Infinity, 0, 10)).toBe(10);
  });

  test('returns boundary values as is and the bound of a degenerate range', () => {
    expect(clamp(0, 0, 10)).toBe(0);
    expect(clamp(10, 0, 10)).toBe(10);
    expect(clamp(7, 3, 3)).toBe(3);
  });

  test('swaps reversed bounds', () => {
    expect(clamp(15, 10, 0)).toBe(10);
    expect(clamp(-5, 10, 0)).toBe(0);
    expect(clamp(5, 10, 0)).toBe(5);
  });
});
