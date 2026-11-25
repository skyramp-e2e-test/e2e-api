'use strict';

const { percent } = require('../src/percent');

describe('percent', () => {
  test('returns part as an unrounded percentage of a non-zero whole', () => {
    expect(percent(1, 4)).toBe(25);
    expect(percent(50, 200)).toBe(25);
    expect(percent(3, 2)).toBe(150);
    expect(percent(0, 5)).toBe(0);
    expect(percent(-1, 4)).toBe(-25);
    expect(percent(1, -4)).toBe(-25);
    expect(percent(1, 3)).toBeCloseTo(33.3333, 4);
  });

  test('throws a RangeError for a zero whole', () => {
    expect(() => percent(5, 0)).toThrow(RangeError);
    expect(() => percent(0, 0)).toThrow(RangeError);
    expect(() => percent(5, -0)).toThrow(RangeError);
  });
});
