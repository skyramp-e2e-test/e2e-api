const { percent } = require('../src/percent');

describe('percent', () => {
  test('returns part as a percentage of a non-zero whole', () => {
    expect(percent(25, 200)).toBe(12.5);
    expect(percent(50, 200)).toBe(25);
    expect(percent(1, 3)).toBeCloseTo(33.333, 3);
  });

  test('refuses a whole of 0 with a RangeError', () => {
    expect(() => percent(5, 0)).toThrow(RangeError);
    expect(() => percent(0, 0)).toThrow(RangeError);
    expect(() => percent(5, -0)).toThrow(RangeError);
  });

  test('returns 0 for a part of 0 with a non-zero whole', () => {
    expect(percent(0, 50)).toBe(0);
  });

  test('does not clamp a part larger than the whole', () => {
    expect(percent(300, 200)).toBe(150);
  });

  test('gives a signed percentage for negative inputs', () => {
    expect(percent(-25, 200)).toBe(-12.5);
    expect(percent(25, -200)).toBe(-12.5);
  });
});
