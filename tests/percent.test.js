const percentModule = require('../src/percent');
const { percent } = percentModule;

describe('percent', () => {
  test('exports percent as a named function', () => {
    expect(typeof percentModule.percent).toBe('function');
  });

  test('returns part / whole * 100 for a non-zero whole', () => {
    expect(percent(25, 200)).toBe(12.5);
    expect(percent(3, 2)).toBe(150);
    expect(percent(0, 5)).toBe(0);
    expect(percent(-1, 4)).toBe(-25);
    expect(percent(1, -4)).toBe(-25);
    expect(percent(1, 3)).toBeCloseTo(33.3333);
  });

  test('throws a RangeError naming whole when whole is 0', () => {
    expect(() => percent(5, 0)).toThrow(RangeError);
    expect(() => percent(5, 0)).toThrow(/whole/);
  });

  test('throws a RangeError for 0 of 0 instead of returning NaN', () => {
    expect(() => percent(0, 0)).toThrow(RangeError);
    expect(() => percent(0, 0)).toThrow(/whole/);
  });

  test('throws a RangeError when whole is -0', () => {
    expect(() => percent(5, -0)).toThrow(RangeError);
    expect(() => percent(5, -0)).toThrow(/whole/);
  });
});
