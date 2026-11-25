const { percent } = require('../src/percent');

describe('percent', () => {
  test('returns part as a percentage of whole', () => {
    expect(percent(50, 200)).toBe(25);
    expect(percent(0, 5)).toBe(0);
    expect(percent(300, 100)).toBe(300);
    expect(percent(-1, 4)).toBe(-25);
    expect(percent(5, -10)).toBe(-50);
  });

  test('does not round a fractional result', () => {
    expect(percent(1, 3)).toBeCloseTo(100 / 3);
  });

  test('throws a RangeError for a zero whole', () => {
    expect(() => percent(5, 0)).toThrow(RangeError);
    expect(() => percent(0, 0)).toThrow(RangeError);
    expect(() => percent(5, -0)).toThrow(RangeError);
  });

  test('does not throw for a non-zero whole', () => {
    expect(() => percent(5, 1)).not.toThrow();
    expect(percent(5, 1)).toBe(500);
  });
});
